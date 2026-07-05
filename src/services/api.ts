import axios from 'axios';

// Two separate axios instances — one per backend
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_AUTH,
  headers: { 'Content-Type': 'application/json' },
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to both
function attachToken(config: import('axios').InternalAxiosRequestConfig) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

authApi.interceptors.request.use(attachToken);
api.interceptors.request.use(attachToken);

// Auto-logout on 401 from either
function handle401(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

authApi.interceptors.response.use((r) => r, handle401);
api.interceptors.response.use((r) => r, handle401);

export { authApi };
export default api;