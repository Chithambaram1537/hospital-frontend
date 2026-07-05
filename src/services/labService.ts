import api from './api';
import type { LabResult } from '../types/lab';

interface P3LabOrder {
  lab_order_id: string;
  patient_id: string;
  lab_order_number: string;
  ordered_at: string;
  status: string;
  items?: {
    lab_order_item_id: string;
    status: string;
    test_name: string;
    result_value?: string;
    result_unit?: string;
    reference_range?: string;
    abnormal_flag?: string;
  }[];
}

interface P3Response {
  status: string;
  data: P3LabOrder[];
  pagination?: { page: number; pageSize: number; totalCount: number; };
}

let doctorNameCache = new Map<string, string>();

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

function adaptLabOrder(order: P3LabOrder, doctorName: string, index: number): LabResult {
  const firstItem = order.items?.[0];
  return {
    id: index + 1,
    patientId: order.patient_id as unknown as number,
    patientName: '',
    doctorName,
    testName: firstItem?.test_name ?? order.lab_order_number,
    date: order.ordered_at?.split('T')[0] ?? '',
    status: order.status === 'completed' ? 'completed' : 'pending',
    value: firstItem?.result_value ?? '',
    unit: firstItem?.result_unit ?? '',
    referenceRange: firstItem?.reference_range ?? '',
    isAbnormal: firstItem?.abnormal_flag === 'high' || firstItem?.abnormal_flag === 'low',
    hospitalId: 1,
  };
}

export async function getLabResults(patientId?: number): Promise<LabResult[]> {
  const params: Record<string, unknown> = { pageSize: 100 };
  if (patientId) params.patientId = patientId;
  const response = await api.get<P3Response>('/lab-orders', { params });
  return Promise.all(response.data.data.map(async (order, i) => {
    const doctorName = await resolveDoctorName(order.patient_id);
    return adaptLabOrder(order, doctorName, i);
  }));
}

export async function getLabResultById(id: string): Promise<LabResult> {
  const response = await api.get<{ status: string; data: P3LabOrder }>(`/lab-orders/${id}`);
  const doctorName = await resolveDoctorName(response.data.data.patient_id);
  return adaptLabOrder(response.data.data, doctorName, 0);
}