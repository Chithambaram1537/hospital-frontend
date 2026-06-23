export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  hospitalId: number;
  patientId?: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}
