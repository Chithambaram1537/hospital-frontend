import api from './api';
import type { Doctor, CreateDoctorRequest } from '../types/doctor';

interface P3Doctor {
  doctor_id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  phone?: string;
  email?: string;
  experience_years?: number;
  status: string;
}

interface P3ListResponse {
  status: string;
  data: P3Doctor[];
}

interface P3SingleResponse {
  status: string;
  data: P3Doctor;
}

function adaptDoctor(d: P3Doctor): Doctor {
  const statusMap: Record<string, Doctor['status']> = {
    active: 'available',
    on_leave: 'on-leave',
    inactive: 'on-leave',
    retired: 'on-leave',
  };
  return {
    id: d.doctor_id,
    name: `${d.first_name} ${d.last_name}`.trim(),
    specialty: d.specialization,
    phone: d.phone || '',
    email: d.email || '',
    experience: d.experience_years || 0,
    status: statusMap[d.status] || 'available',
  };
}

export async function getDoctors(): Promise<Doctor[]> {
  const response = await api.get<P3ListResponse>('/doctors', { params: { pageSize: 100 } });
  return response.data.data.map(adaptDoctor);
}

export async function getDoctorById(id: string): Promise<Doctor> {
  const response = await api.get<P3SingleResponse>(`/doctors/${id}`);
  return adaptDoctor(response.data.data);
}

export async function createDoctor(data: CreateDoctorRequest): Promise<Doctor> {
  const [firstName, ...rest] = data.name.split(' ');
  const payload = {
    first_name: firstName,
    last_name: rest.join(' ') || firstName,
    specialization: data.specialty,
    phone: data.phone,
    email: data.email,
    experience_years: data.experience,
    employee_code: `EMP-${Date.now()}`,
    registration_number: `REG-${Date.now()}`,
    status: data.status === 'available' ? 'active' : data.status === 'on-leave' ? 'on_leave' : 'inactive',
  };
  const response = await api.post<P3SingleResponse>('/doctors', payload);
  return adaptDoctor(response.data.data);
}

export async function updateDoctor(id: string, data: CreateDoctorRequest): Promise<Doctor> {
  const [firstName, ...rest] = data.name.split(' ');
  const statusMap = { 'available': 'active', 'on-leave': 'on_leave', 'in-surgery': 'active' };
  const payload = {
    first_name: firstName,
    last_name: rest.join(' ') || firstName,
    specialization: data.specialty,
    phone: data.phone,
    email: data.email,
    experience_years: data.experience,
    status: statusMap[data.status] || 'active',
  };
  const response = await api.put<P3SingleResponse>(`/doctors/${id}`, payload);
  return adaptDoctor(response.data.data);
}

export async function deleteDoctor(id: string): Promise<void> {
  await api.delete(`/doctors/${id}`);
}