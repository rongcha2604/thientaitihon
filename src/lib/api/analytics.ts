import apiClient from './client.js';

export interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  sessionId?: string;
}

// Analytics API functions
export const analyticsAPI = {
  async trackEvent(event: AnalyticsEvent): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>('/api/analytics/track', event);
      return response.data;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw - analytics should not break the app
      return { success: false };
    }
  },
};

// Helper to generate session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

