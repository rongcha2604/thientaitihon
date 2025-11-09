// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const API_TIMEOUT = 10000; // 10 seconds

// Debug: Log API_BASE_URL chỉ trong development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('🔍 API_BASE_URL:', API_BASE_URL);
  console.log('🔍 import.meta.env.VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
}

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

