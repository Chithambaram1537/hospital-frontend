import api from './api';
import type { Appointment, CreateAppointmentRequest, ConsultationNotesRequest } from '../types/appointment';

interface P3Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  chief_complaint?: string;
  status: string;
}

interface P3ListResponse {
  status: string;
  data: P3Appointment[];
  pagination?: { page: number; pageSize: number; totalCount: number; totalPages: number; };
}

interface P3SingleResponse {
  status: string;
  data: P3Appointment;
}

function addThirtyMinutes(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const P3_TO_FRONTEND_STATUS: Record<string, Appointment['status']> = {
  booked: 'scheduled', confirmed: 'scheduled', checked_in: 'scheduled',
  in_consultation: 'scheduled', completed: 'completed', cancelled: 'cancelled', no_show: 'no-show',
};

const FRONTEND_TO_P3_STATUS: Record<string, string> = {
  scheduled: 'booked', completed: 'completed', cancelled: 'cancelled', 'no-show': 'no_show',
};

let patientNameCache = new Map<string, string>();
let doctorNameCache = new Map<string, string>();

async function resolveNames(patientId: string, doctorId: string) {
  let patientName = patientNameCache.get(patientId);
  let doctorName = doctorNameCache.get(doctorId);

  if (!patientName) {
    try {
      const r = await api.get<{ status: string; data: { first_name: string; last_name: string } }>(`/patients/${patientId}`);
      patientName = `${r.data.data.first_name} ${r.data.data.last_name}`.trim();
      patientNameCache.set(patientId, patientName);
    } catch { patientName = 'Unknown patient'; }
  }

  if (!doctorName) {
    try {
      const r = await api.get<{ status: string; data: { first_name: string; last_name: string } }>(`/doctors/${doctorId}`);
      doctorName = `${r.data.data.first_name} ${r.data.data.last_name}`.trim();
      doctorNameCache.set(doctorId, doctorName);
    } catch { doctorName = 'Unknown doctor'; }
  }

  return { patientName, doctorName };
}

async function adaptAppointment(a: P3Appointment): Promise<Appointment> {
  const { patientName, doctorName } = await resolveNames(a.patient_id, a.doctor_id);
  return {
    id: a.appointment_id,
    patientId: a.patient_id,
    patientName,
    doctorId: a.doctor_id,
    doctorName,
    date: a.date,
    time: a.start_time?.slice(0, 5) ?? '',
    reason: a.chief_complaint ?? '',
    status: P3_TO_FRONTEND_STATUS[a.status] ?? 'scheduled',
    chiefComplaint: a.chief_complaint,
  };
}

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<P3ListResponse>('/appointments', { params: { pageSize: 100 } });
  return Promise.all(response.data.data.map(adaptAppointment));
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const response = await api.get<P3SingleResponse>(`/appointments/${id}`);
  return adaptAppointment(response.data.data);
}

export async function createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
  const payload = {
    patient_id: data.patientId,
    doctor_id: data.doctorId,
    date: data.date,
    start_time: data.time,
    end_time: addThirtyMinutes(data.time),
    chief_complaint: data.reason,
    appointment_type: 'consultation',
  };
  const response = await api.post<P3SingleResponse>('/appointments', payload);
  return adaptAppointment(response.data.data);
}

export async function updateAppointment(id: string, data: CreateAppointmentRequest): Promise<Appointment> {
  const payload: Record<string, unknown> = {
    status: FRONTEND_TO_P3_STATUS[data.status] || 'booked',
  };
  if (data.date) {
    payload.date = data.date;
    payload.start_time = data.time;
    payload.end_time = addThirtyMinutes(data.time);
  }
  const response = await api.put<P3SingleResponse>(`/appointments/${id}`, payload);
  return adaptAppointment(response.data.data);
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.post(`/appointments/${id}/cancel`, { cancellation_reason: 'Cancelled by staff' });
}

export async function addConsultationNotes(id: string, data: ConsultationNotesRequest): Promise<Appointment> {
  await api.post('/consultations', {
    appointment_id: id,
    chief_complaint: data.chiefComplaint,
    provisional_diagnosis: data.diagnosis,
    status: 'completed',
  });
  return getAppointmentById(id);
}