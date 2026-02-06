import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  accountStatus?: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export const login = (payload: LoginPayload) =>
  api.post<{ success: boolean; accessToken: string; userId: string; userRole: string }>('/v1/user/login', payload);

export const register = (payload: RegisterPayload) =>
  api.post<{ success: boolean; accessToken: string; userId: string; userRole: string }>('/v1/user/register', payload);

export const getProfile = () => api.get<{ success: boolean; data: User }>('/v1/user/profile');

export const updateProfile = (data: { firstName?: string; lastName?: string; userName?: string }) =>
  api.put<{ success: boolean; data: User }>('/v1/user/profile', data);

export const getSubjects = () => api.get<{ success: boolean; data: Subject[] }>('/v1/worksheet/subjects');

export const createSubject = (data: { name: string; code?: string }) =>
  api.post<{ success: boolean; data: Subject }>('/v1/worksheet/subjects', data);

export const updateSubject = (id: string, data: { name?: string; code?: string }) =>
  api.put<{ success: boolean; data: Subject }>(`/v1/worksheet/subjects/${id}`, data);

export const deleteSubject = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/v1/worksheet/subjects/${id}`);

export const getPackages = () =>
  api.post<{ success: boolean; data: Package[] }>('/v1/payment/packages/list', {});

export const getPaymentStatus = () =>
  api.get<{ success: boolean; data: { status: string; lastPayment: unknown; plan: string } }>('/v1/payment/status');
