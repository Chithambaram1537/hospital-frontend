import api from './api';
import type { PharmacyItem, PharmacyStockResponse } from '../types/pharmacy';

export async function getPharmacyStock(): Promise<PharmacyItem[]> {
  const response = await api.get<PharmacyStockResponse>('/pharmacy-stock');
  return response.data.stock;
}