import api from './api';
import type { Patient, CreatePatientRequest } from '../types/patient';

interface P3Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  phone: string;
  email?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  status: string;
  created_at: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

interface P3ListResponse {
  status: string;
  data: P3Patient[];
  pagination: { page: number; pageSize: number; totalCount: number; totalPages: number; };
}

interface P3SingleResponse {
  status: string;
  data: P3Patient;
}

function ageFromDob(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function adaptPatient(p: P3Patient): Patient {
  const status = p.status === 'active' ? 'outpatient' : p.status === 'inactive' ? 'discharged' : 'discharged';
  return {
    id: p.patient_id,
    name: `${p.first_name} ${p.last_name}`.trim(),
    age: ageFromDob(p.date_of_birth),
    gender: (p.gender as 'male' | 'female' | 'other') || 'other',
    phone: p.phone,
    bloodGroup: p.blood_group || '',
    address: [p.address_line1, p.city, p.state].filter(Boolean).join(', '),
    status,
    isActive: p.status === 'active',
    registeredAt: p.created_at?.split('T')[0],
    emergencyContactName: p.emergency_contact_name,
    emergencyContactPhone: p.emergency_contact_phone,
  };
}

function dobFromAge(age: number): string {
  const year = new Date().getFullYear() - age;
  return `${year}-01-01`;
}

export async function getPatients(): Promise<Patient[]> {
  const response = await api.get<P3ListResponse>('/patients', { params: { pageSize: 100 } });
  return response.data.data.map(adaptPatient);
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await api.get<P3SingleResponse>(`/patients/${id}`);
  return adaptPatient(response.data.data);
}

export async function createPatient(data: CreatePatientRequest): Promise<Patient> {
  const [firstName, ...rest] = data.name.split(' ');
  const payload = {
    first_name: firstName,
    last_name: rest.join(' ') || firstName,
    date_of_birth: dobFromAge(data.age),
    gender: data.gender,
    blood_group: data.bloodGroup,
    phone: data.phone,
    address_line1: data.address,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
    medical_record_number: `MRN-${Date.now()}`,
  };
  const response = await api.post<P3SingleResponse>('/patients', payload);
  return adaptPatient(response.data.data);
}

export async function updatePatient(id: string, data: CreatePatientRequest): Promise<Patient> {
  const payload: Record<string, unknown> = {
    phone: data.phone,
    address_line1: data.address,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
  };
  const response = await api.put<P3SingleResponse>(`/patients/${id}`, payload);
  return adaptPatient(response.data.data);
}

export async function deletePatient(id: string): Promise<void> {
  await api.delete(`/patients/${id}`);
}

export async function setPatientActive(id: string, isActive: boolean): Promise<Patient> {
  const response = await api.put<P3SingleResponse>(`/patients/${id}`, {
    status: isActive ? 'active' : 'inactive',
  });
  return adaptPatient(response.data.data);
}