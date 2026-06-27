import api from './api';
import type { Invoice, InvoiceListResponse, InvoiceResponse } from '../types/billing';

export async function getInvoices(patientId?: number): Promise<Invoice[]> {
  const response = await api.get<InvoiceListResponse>('/invoices', { params: patientId ? { patientId } : {} });
  return response.data.invoices;
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await api.get<InvoiceResponse>(`/invoices/${id}`);
  return response.data.invoice;
}