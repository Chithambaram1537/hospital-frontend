import api from './api';
import type { Invoice } from '../types/billing';

interface P3Invoice {
  invoice_id: string;
  patient_id: string;
  invoice_number: string;
  status: string;
  issued_at: string;
  total_amount: string;
  items?: { description: string; unit_price: string; quantity: number }[];
}

interface P3Response {
  status: string;
  data: P3Invoice[];
  pagination?: { page: number; };
}

interface P3SingleResponse {
  status: string;
  data: P3Invoice;
}

let patientNameCache = new Map<string, string>();

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

async function adaptInvoice(inv: P3Invoice): Promise<Invoice> {
  const patientName = await resolvePatientName(inv.patient_id);
  const items = (inv.items || []).map((it) => ({
    description: it.description,
    amount: Number(it.unit_price) * (it.quantity || 1),
  }));
  const totalAmount = items.reduce((sum, it) => sum + it.amount, 0) || Number(inv.total_amount) || 0;
  return {
    id: inv.invoice_id as unknown as number,
    patientId: inv.patient_id as unknown as number,
    patientName,
    appointmentId: 0,
    date: inv.issued_at?.split('T')[0] ?? '',
    items,
    totalAmount,
    status: inv.status === 'paid' ? 'paid' : 'pending',
    hospitalId: 1,
  };
}

export async function getInvoices(patientId?: number): Promise<Invoice[]> {
  const params: Record<string, unknown> = { pageSize: 100 };
  if (patientId) params.patientId = patientId;
  const response = await api.get<P3Response>('/invoices', { params });
  return Promise.all(response.data.data.map(adaptInvoice));
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await api.get<P3SingleResponse>(`/invoices/${id}`);
  return adaptInvoice(response.data.data);
}
