import apiClient from './client.js';

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName?: string;
  role: string;
}

export interface AdminAuthResponse {
  admin: AdminUser;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  grade?: number;
  role: string;
  createdAt: string;
}

export interface AnalyticsDashboard {
  totalUsers: number;
  activeUsers: number;
  totalExercises: number;
  topSubjects: Array<{ subject: string; _count: number }>;
  eventsByType: Array<{ eventType: string; _count: number }>;
  period: string;
}

// Admin API functions
export const adminAPI = {
  async login(credentials: AdminLoginCredentials): Promise<AdminAuthResponse> {
    const response = await apiClient.post<AdminAuthResponse>('/api/admin/login', credentials);
    return response.data;
  },

  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get('/api/admin/users', { params });
    return response.data;
  },

  async getUserDetails(userId: string): Promise<{
    user: User;
    progressSummary: any[];
    analyticsSummary: any[];
  }> {
    const response = await apiClient.get(`/api/admin/users/${userId}`);
    return response.data;
  },

  async getAnalyticsDashboard(days?: number): Promise<AnalyticsDashboard> {
    const response = await apiClient.get('/api/admin/analytics', {
      params: { days },
    });
    return response.data;
  },

  async getProgressSummary(params?: {
    bookSeries?: string;
    grade?: number;
    subject?: string;
  }): Promise<{ summary: any[] }> {
    const response = await apiClient.get('/api/admin/progress', { params });
    return response.data;
  },

  async getAuditLogs(params?: { page?: number; limit?: number }): Promise<{
    logs: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get('/api/admin/audit-logs', { params });
    return response.data;
  },
};

