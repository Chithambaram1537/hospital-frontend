export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  hospitalId: number;
}

export interface LoginResponse {
  token: string;
  user: User;
}