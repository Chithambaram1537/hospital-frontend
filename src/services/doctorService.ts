import api from './api';
import type { Doctor, DoctorListResponse, DoctorResponse, CreateDoctorRequest } from '../types/doctor';

export async function getDoctors(): Promise<Doctor[]> {
  const response = await api.get<DoctorListResponse>('/doctors');
  return response.data.doctors;
}

export async function getDoctorById(id: string): Promise<Doctor> {
  const response = await api.get<DoctorResponse>(`/doctors/${id}`);
  return response.data.doctor;
}

export async function createDoctor(data: CreateDoctorRequest): Promise<Doctor> {
  const response = await api.post<DoctorResponse>('/doctors', data);
  return response.data.doctor;
}