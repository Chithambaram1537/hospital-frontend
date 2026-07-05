export interface Vitals {
  bp: string;
  temperature: string;
  weight: string;
  oxygen: string;
}

export interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  hospitalId?: number;
  chiefComplaint?: string;
  diagnosis?: string;
  vitals?: Vitals;
  prescriptions?: Prescription[];
}

export interface AppointmentListResponse { appointments: Appointment[]; }
export interface AppointmentResponse { appointment: Appointment; }
export interface CreateAppointmentRequest {
  patientId: string; doctorId: string; date: string; time: string;
  reason: string; status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
}
export interface ConsultationNotesRequest {
  chiefComplaint?: string;
  diagnosis?: string;
  vitals?: Vitals;
  prescriptions?: Prescription[];
  status: 'completed';
}