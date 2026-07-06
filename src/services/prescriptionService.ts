import api from './api';
import type { Prescription } from '../types/prescription';

interface P3Prescription {
  prescription_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_first_name?: string;
  doctor_last_name?: string;
  prescribed_at: string;
  status?: string;
  items?: {
    prescription_item_id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration_days?: number;
    instructions?: string;
  }[];
}

function adaptPrescription(p: P3Prescription): Prescription {
  return {
    id: p.prescription_id,
    patientId: p.patient_id,
    doctorId: p.doctor_id,
    doctorName: `${p.doctor_first_name ?? ''} ${p.doctor_last_name ?? ''}`.trim() || 'Unknown doctor',
    prescribedAt: p.prescribed_at?.split('T')[0] ?? '',
    status: (p.status as Prescription['status']) ?? 'active',
    items: (p.items ?? []).map((it) => ({
      id: it.prescription_item_id,
      medicationName: it.medication_name,
      dosage: it.dosage,
      frequency: it.frequency,
      duration: it.duration_days ? `${it.duration_days} days` : '',
      instructions: it.instructions,
    })),
  };
}

export async function getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
  const response = await api.get<{ status: string; data: P3Prescription[] }>(
    `/portal/me/prescriptions`,
    { params: { pageSize: 100 } }
  );
  return response.data.data.map(adaptPrescription);
}