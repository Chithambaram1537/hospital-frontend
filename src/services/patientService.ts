import api from './api';
import type {
  Patient,
  PatientListResponse,
  PatientResponse,
  CreatePatientRequest,
} from '../types/patient';

export async function getPatients(): Promise<Patient[]> {
  const response = await api.get<PatientListResponse>('/patients');
  return response.data.patients;
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await api.get<PatientResponse>(`/patients/${id}`);
  return response.data.patient;
}

export async function createPatient(
  data: CreatePatientRequest
): Promise<Patient> {
  const response = await api.post<PatientResponse>('/patients', data);
  return response.data.patient;
}