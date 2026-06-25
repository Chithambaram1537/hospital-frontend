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
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  hospitalId: number;
  chiefComplaint?: string;
  diagnosis?: string;
  vitals?: Vitals;
  prescriptions?: Prescription[];
}

export interface AppointmentListResponse { appointments: Appointment[]; }
export interface AppointmentResponse { appointment: Appointment; }
export interface CreateAppointmentRequest {
  patientId: number; doctorId: number; date: string; time: string;
  reason: string; status: 'scheduled' | 'completed' | 'cancelled';
}
export interface ConsultationNotesRequest {
  chiefComplaint?: string;
  diagnosis?: string;
  vitals?: Vitals;
  prescriptions?: Prescription[];
  status: 'completed';
}