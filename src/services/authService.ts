import api from './api';

import type { LoginResponse, RegisterRequest, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest } from '../types/auth';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
}
export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/register', data);
  return response.data;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await api.post('/auth/forgot-password', data);
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<void> {
  await api.post('/auth/verify-otp', data);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await api.post('/auth/reset-password', data);
}