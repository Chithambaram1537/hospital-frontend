import api from './api';
import type { Appointment, AppointmentListResponse, AppointmentResponse, CreateAppointmentRequest, ConsultationNotesRequest } from '../types/appointment';
export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<AppointmentListResponse>('/appointments');
  return response.data.appointments;
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const response = await api.get<AppointmentResponse>(`/appointments/${id}`);
  return response.data.appointment;
}

export async function createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
  const response = await api.post<AppointmentResponse>('/appointments', data);
  return response.data.appointment;
}
export async function updateAppointment(id: string, data: CreateAppointmentRequest): Promise<Appointment> {
  const response = await api.put<AppointmentResponse>(`/appointments/${id}`, data);
  return response.data.appointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/${id}`);
}

export async function addConsultationNotes(id: string, data: ConsultationNotesRequest): Promise<Appointment> {
  const response = await api.put<AppointmentResponse>(`/appointments/${id}`, data);
  return response.data.appointment;
}