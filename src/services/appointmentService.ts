import api from './api';
import type { Appointment, AppointmentListResponse, AppointmentResponse, CreateAppointmentRequest } from '../types/appointment';

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