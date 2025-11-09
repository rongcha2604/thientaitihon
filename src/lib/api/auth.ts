import apiClient from './client.js';
import { STORAGE_KEYS } from './config.js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  grade?: number;
  parentPin?: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  grade?: number;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  parentPin?: string; // PIN bảo mật cho phụ huynh (4 số)
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Auth API functions
export const authAPI = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');
    return response.data;
  },

  async updateProfile(data: { fullName?: string; grade?: number }): Promise<{ user: User }> {
    const response = await apiClient.patch<{ user: User }>('/api/auth/profile', data);
    return response.data;
  },
};

