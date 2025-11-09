import apiClient from './client.js';
import { API_BASE_URL } from './config.js';

export interface QuestionFile {
  bookSeries: string;
  grade: number;
  subject: string;
  week: number;
  path: string;
  size: number;
  modified: string;
}

export interface AudioFile {
  filename: string;
  size: number;
  modified: string;
}

export interface SyncMetadata {
  questions: {
    version: string;
    lastUpdated: string;
    totalFiles: number;
    totalSize: number;
  };
  audio: {
    totalFiles: number;
    totalSize: number;
    lastUpdated: string;
  };
  lastSync: string;
}

export interface QuestionsResponse {
  bookSeries: string;
  grade: number;
  subject: string;
  week: number;
  questions: any;
}

/**
 * Get sync metadata
 */
export async function getSyncMetadata(): Promise<SyncMetadata> {
  const response = await apiClient.get<SyncMetadata>('/api/sync/metadata');
  return response.data;
}

/**
 * List all available questions files
 */
export async function listQuestions(): Promise<{ files: QuestionFile[]; total: number }> {
  const response = await apiClient.get<{ files: QuestionFile[]; total: number }>('/api/sync/questions/list');
  return response.data;
}

/**
 * Get questions by bookSeries, grade, subject, week
 */
export async function getQuestions(
  bookSeries: string,
  grade: number,
  subject: string,
  week: number
): Promise<QuestionsResponse> {
  const response = await apiClient.get<QuestionsResponse>('/api/sync/questions', {
    params: { bookSeries, grade, subject, week },
  });
  return response.data;
}

/**
 * Get audio file URL
 */
export function getAudioUrl(filename: string): string {
  return `${API_BASE_URL}/api/sync/audio/${filename}`;
}

/**
 * List all available audio files
 */
export async function listAudio(): Promise<{ files: AudioFile[]; total: number }> {
  const response = await apiClient.get<{ files: AudioFile[]; total: number }>('/api/sync/audio');
  return response.data;
}

/**
 * Download audio file as blob
 */
export async function downloadAudio(filename: string): Promise<Blob> {
  const response = await apiClient.get(`/api/sync/audio/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
}

