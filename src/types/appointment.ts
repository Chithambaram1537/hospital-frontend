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
}

export interface AppointmentListResponse { appointments: Appointment[]; }
export interface AppointmentResponse { appointment: Appointment; }
export interface CreateAppointmentRequest {
  patientId: number; doctorId: number; date: string; time: string;
  reason: string; status: 'scheduled' | 'completed' | 'cancelled';
}