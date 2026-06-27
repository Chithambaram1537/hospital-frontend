import api from './api';
import type { LabResult, LabResultListResponse, LabResultResponse } from '../types/lab';

export async function getLabResults(patientId?: number): Promise<LabResult[]> {
  const response = await api.get<LabResultListResponse>('/lab-results', { params: patientId ? { patientId } : {} });
  return response.data.labResults;
}

export async function getLabResultById(id: string): Promise<LabResult> {
  const response = await api.get<LabResultResponse>(`/lab-results/${id}`);
  return response.data.labResult;
}