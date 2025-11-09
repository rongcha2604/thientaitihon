import apiClient from './client.js';

export interface UserProgress {
  id: string;
  userId: string;
  bookSeries: string;
  grade: number;
  subject: string;
  week: number;
  lessonId: string;
  status: 'completed' | 'in_progress' | 'locked';
  score?: number;
  completedAt?: string;
  createdAt: string;
}

export interface ProgressInput {
  bookSeries: string;
  grade: number;
  subject: string;
  week: number;
  lessonId: string;
  status: 'completed' | 'in_progress' | 'locked';
  score?: number;
}

export interface ProgressQuery {
  bookSeries?: string;
  grade?: number;
  subject?: string;
  week?: number;
}

// Progress API functions
export const progressAPI = {
  async getProgress(query?: ProgressQuery): Promise<{ progress: UserProgress[] }> {
    const response = await apiClient.get<{ progress: UserProgress[] }>('/api/progress', {
      params: query,
    });
    return response.data;
  },

  async saveProgress(data: ProgressInput): Promise<{ progress: UserProgress }> {
    const response = await apiClient.post<{ progress: UserProgress }>('/api/progress', data);
    return response.data;
  },

  async getProgressByWeek(week: number): Promise<{ progress: UserProgress[] }> {
    const response = await apiClient.get<{ progress: UserProgress[] }>(`/api/progress/week/${week}`);
    return response.data;
  },
};

