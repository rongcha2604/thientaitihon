export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProgressInput {
  bookSeries: string;
  grade: number;
  subject: string;
  week: number;
  lessonId: string;
  status: 'completed' | 'in_progress' | 'locked';
  score?: number;
}

export interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  sessionId?: string;
}

