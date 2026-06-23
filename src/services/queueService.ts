import api from './api';
import type { QueueEntry, QueueListResponse, QueueResponse, CheckInRequest, UpdateQueueStatusRequest } from '../types/queue';

export async function getQueue(): Promise<QueueEntry[]> {
  const response = await api.get<QueueListResponse>('/queue');
  return response.data.queue;
}

export async function checkIn(data: CheckInRequest): Promise<QueueEntry> {
  const response = await api.post<QueueResponse>('/queue', data);
  return response.data.entry;
}

export async function updateQueueStatus(id: number, data: UpdateQueueStatusRequest): Promise<QueueEntry> {
  const response = await api.put<QueueResponse>(`/queue/${id}`, data);
  return response.data.entry;
}