import api from './api';
import type { Ward, Bed, Admission, OccupancyReport } from '../types/ward';

interface P3Ward {
  ward_id: string;
  ward_code: string;
  ward_name: string;
  ward_type: string;
  total_beds: number;
  available_beds: number;
  occupied_beds: number;
  floor_number?: string;
  is_active: boolean;
}

interface P3Bed {
  bed_id: string;
  ward_id: string;
  bed_number: string;
  status: string;
  bed_type?: string;
}

interface P3Admission {
  admission_id: string;
  patient_id: string;
  ward_id: string;
  ward_name?: string;
  bed_id: string;
  bed_number?: string;
  admitting_doctor_id: string;
  admission_date: string;
  expected_discharge_date?: string;
  primary_diagnosis?: string;
  status: string;
}

let patientNameCache = new Map<string, string>();
let doctorNameCache = new Map<string, string>();

async function resolvePatientName(patientId: string): Promise<string> {
  let name = patientNameCache.get(patientId);
  if (!name) {
    try {
      const r = await api.get<{ status: string; data: { first_name: string; last_name: string } }>(`/patients/${patientId}`);
      name = `${r.data.data.first_name} ${r.data.data.last_name}`.trim();
      patientNameCache.set(patientId, name);
    } catch { name = 'Unknown patient'; }
  }
  return name;
}

async function resolveDoctorName(doctorId: string): Promise<string> {
  let name = doctorNameCache.get(doctorId);
  if (!name) {
    try {
      const r = await api.get<{ status: string; data: { first_name: string; last_name: string } }>(`/doctors/${doctorId}`);
      name = `${r.data.data.first_name} ${r.data.data.last_name}`.trim();
      doctorNameCache.set(doctorId, name);
    } catch { name = 'Unknown doctor'; }
  }
  return name;
}

function adaptWard(w: P3Ward): Ward {
  return {
    id: w.ward_id,
    wardCode: w.ward_code,
    wardName: w.ward_name,
    wardType: w.ward_type as Ward['wardType'],
    totalBeds: w.total_beds,
    availableBeds: w.available_beds,
    occupiedBeds: w.occupied_beds,
    floor: w.floor_number,
    isActive: w.is_active,
  };
}

function adaptBed(b: P3Bed): Bed {
  return {
    id: b.bed_id,
    wardId: b.ward_id,
    bedNumber: b.bed_number,
    status: b.status as Bed['status'],
    bedType: b.bed_type,
  };
}

async function adaptAdmission(a: P3Admission): Promise<Admission> {
  const [patientName, admittingDoctorName] = await Promise.all([
    resolvePatientName(a.patient_id),
    resolveDoctorName(a.admitting_doctor_id),
  ]);
  return {
    id: a.admission_id,
    patientId: a.patient_id,
    patientName,
    wardId: a.ward_id,
    wardName: a.ward_name ?? '',
    bedId: a.bed_id,
    bedNumber: a.bed_number ?? '',
    admittingDoctorId: a.admitting_doctor_id,
    admittingDoctorName,
    admissionDate: a.admission_date?.split('T')[0] ?? '',
    expectedDischargeDate: a.expected_discharge_date?.split('T')[0],
    diagnosis: a.primary_diagnosis,
    status: a.status as Admission['status'],
  };
}

export async function getWards(): Promise<Ward[]> {
  const response = await api.get<{ status: string; data: P3Ward[] }>('/wards');
  return response.data.data.map(adaptWard);
}

export async function getWardById(id: string): Promise<Ward> {
  const response = await api.get<{ status: string; data: P3Ward }>(`/wards/${id}`);
  return adaptWard(response.data.data);
}

export async function getBedsForWard(wardId: string, status?: string): Promise<Bed[]> {
  const params = status ? { status } : {};
  const response = await api.get<{ status: string; data: P3Bed[] }>(`/wards/${wardId}/beds`, { params });
  return response.data.data.map(adaptBed);
}

export async function updateBedStatus(wardId: string, bedId: string, status: string): Promise<Bed> {
  const response = await api.patch<{ status: string; data: P3Bed }>(
    `/wards/${wardId}/beds/${bedId}/status`, { status }
  );
  return adaptBed(response.data.data);
}

export async function getOccupancyReport(): Promise<OccupancyReport> {
  const response = await api.get<{ status: string; data: OccupancyReport }>('/wards/reports/occupancy');
  return response.data.data;
}

export async function getAdmissions(filters?: { patientId?: string; wardId?: string; status?: string }): Promise<Admission[]> {
  const response = await api.get<{ status: string; data: P3Admission[] }>('/admissions', {
    params: { ...filters, pageSize: 100 }
  });
  return Promise.all(response.data.data.map(adaptAdmission));
}

export async function getAdmissionById(id: string): Promise<Admission> {
  const response = await api.get<{ status: string; data: P3Admission }>(`/admissions/${id}`);
  return adaptAdmission(response.data.data);
}

export async function createAdmission(data: {
  patientId: string; wardId: string; bedId: string;
  admittingDoctorId: string; admissionDate: string;
  expectedDischargeDate?: string; diagnosis?: string;
}): Promise<Admission> {
  const payload = {
    patient_id: data.patientId,
    ward_id: data.wardId,
    bed_id: data.bedId,
    admitting_doctor_id: data.admittingDoctorId,
    admission_date: data.admissionDate,
    expected_discharge_date: data.expectedDischargeDate,
    primary_diagnosis: data.diagnosis,
  };
  const response = await api.post<{ status: string; data: P3Admission }>('/admissions', payload);
  return adaptAdmission(response.data.data);
}

export async function transferPatient(admissionId: string, data: {
  bedId: string; wardId: string; reason?: string;
}): Promise<Admission> {
  const payload = {
    new_bed_id: data.bedId,
    new_ward_id: data.wardId,
    transfer_reason: data.reason,
  };
  const response = await api.post<{ status: string; data: P3Admission }>(
    `/admissions/${admissionId}/transfer`, payload
  );
  return adaptAdmission(response.data.data);
}

export async function dischargePatient(admissionId: string, data: {
  dischargedByDoctorId: string; dischargeNotes?: string;
}): Promise<Admission> {
  const payload = {
    discharged_by_doctor_id: data.dischargedByDoctorId,
    discharge_notes: data.dischargeNotes,
  };
  const response = await api.post<{ status: string; data: P3Admission }>(
    `/admissions/${admissionId}/discharge`, payload
  );
  return adaptAdmission(response.data.data);
}