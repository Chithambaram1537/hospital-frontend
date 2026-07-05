import { authApi } from './api';
import type { LoginResponse, RegisterRequest, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest } from '../types/auth';

interface P2LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

function adaptLoginResponse(p2: P2LoginResponse): LoginResponse {
  const { user } = p2.data;
  return {
    token: p2.data.token,
    user: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      role: user.role,
    },
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await authApi.post<P2LoginResponse>('/auth/login', { email, password });
  return adaptLoginResponse(response.data);
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  // Person 2 register takes firstName+lastName, not a single name
  const [firstName, ...rest] = data.name.split(' ');
  const lastName = rest.join(' ') || firstName;
  const response = await authApi.post<P2LoginResponse>('/auth/register', {
    email: data.email,
    password: data.password,
    phone: data.phone,
    firstName,
    lastName,
    role: 'patient',
  });
  return adaptLoginResponse(response.data);
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<void> {
  await authApi.post('/auth/forgot-password', data);
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<void> {
  await authApi.post('/auth/verify-otp', data);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  await authApi.post('/auth/reset-password', data);
}