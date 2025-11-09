/**
 * Sync Service
 * Handles syncing questions and audio from backend to mobile app
 */

import {
  getSyncMetadata,
  listQuestions,
  getQuestions,
  listAudio,
  downloadAudio,
  type SyncMetadata,
  type QuestionFile,
  type AudioFile,
} from '../api/sync.js';
import {
  getCachedMetadata,
  saveMetadata,
  getCachedQuestions,
  saveQuestions,
  needsSync,
  clearSyncCache,
  getCacheSize,
} from '../storage/syncStorage.js';

export interface SyncProgress {
  total: number;
  completed: number;
  current: string;
  status: 'idle' | 'syncing' | 'completed' | 'error';
  error?: string;
}

export type SyncProgressCallback = (progress: SyncProgress) => void;

/**
 * Sync Service Class
 */
export class SyncService {
  private onProgress?: SyncProgressCallback;
  private isSyncing = false;

  /**
   * Set progress callback
   */
  setProgressCallback(callback: SyncProgressCallback): void {
    this.onProgress = callback;
  }

  /**
   * Report progress
   */
  private reportProgress(progress: Partial<SyncProgress>): void {
    if (this.onProgress) {
      this.onProgress({
        total: 0,
        completed: 0,
        current: '',
        status: 'idle',
        ...progress,
      });
    }
  }

  /**
   * Check if sync is needed
   */
  async checkSyncNeeded(): Promise<boolean> {
    try {
      const serverMetadata = await getSyncMetadata();
      const cachedMetadata = getCachedMetadata();
      return needsSync(serverMetadata, cachedMetadata);
    } catch (error) {
      console.error('Error checking sync needed:', error);
      return false;
    }
  }

  /**
   * Sync all data (questions + audio)
   */
  async syncAll(force = false): Promise<void> {
    if (this.isSyncing) {
      console.warn('Sync already in progress');
      return;
    }

    this.isSyncing = true;

    try {
      this.reportProgress({ status: 'syncing', current: 'Checking metadata...' });

      // Get server metadata
      const serverMetadata = await getSyncMetadata();
      const cachedMetadata = getCachedMetadata();

      // Check if sync needed
      if (!force && !needsSync(serverMetadata, cachedMetadata)) {
        this.reportProgress({
          status: 'completed',
          current: 'Already up to date',
          total: 0,
          completed: 0,
        });
        this.isSyncing = false;
        return;
      }

      // Sync questions
      await this.syncQuestions(serverMetadata);

      // Sync audio (optional - can be lazy loaded)
      // await this.syncAudio(serverMetadata);

      // Save metadata
      saveMetadata(serverMetadata);

      this.reportProgress({
        status: 'completed',
        current: 'Sync completed',
        total: 0,
        completed: 0,
      });
    } catch (error: any) {
      console.error('Error syncing:', error);
      this.reportProgress({
        status: 'error',
        error: error.message || 'Sync failed',
        current: 'Sync failed',
        total: 0,
        completed: 0,
      });
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync questions
   */
  private async syncQuestions(metadata: SyncMetadata): Promise<void> {
    try {
      this.reportProgress({ current: 'Fetching questions list...' });

      // List all questions
      const { files } = await listQuestions();
      const total = files.length;

      this.reportProgress({ total, completed: 0, current: 'Syncing questions...' });

      // Sync each question file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.reportProgress({
          current: `Syncing ${file.bookSeries} - Grade ${file.grade} - ${file.subject} - Week ${file.week}`,
          completed: i,
        });

        try {
          // Get questions from server
          const questionsData = await getQuestions(
            file.bookSeries,
            file.grade,
            file.subject,
            file.week
          );

          // Save to cache
          saveQuestions(
            file.bookSeries,
            file.grade,
            file.subject,
            file.week,
            questionsData.questions
          );
        } catch (error) {
          console.error(`Error syncing question file ${file.path}:`, error);
          // Continue with next file
        }
      }

      this.reportProgress({ completed: total, current: 'Questions synced' });
    } catch (error) {
      console.error('Error syncing questions:', error);
      throw error;
    }
  }

  /**
   * Sync audio files (optional - can be lazy loaded)
   */
  private async syncAudio(metadata: SyncMetadata): Promise<void> {
    try {
      this.reportProgress({ current: 'Fetching audio list...' });

      // List all audio files
      const { files } = await listAudio();
      const total = files.length;

      this.reportProgress({ total, completed: 0, current: 'Syncing audio...' });

      // Note: Audio files are large, so we can lazy load them on demand
      // For now, we just save the list
      // In production, you might want to download audio files on demand

      this.reportProgress({ completed: total, current: 'Audio list synced' });
    } catch (error) {
      console.error('Error syncing audio:', error);
      throw error;
    }
  }

  /**
   * Get questions (from cache or server)
   */
  async getQuestions(
    bookSeries: string,
    grade: number,
    subject: string,
    week: number,
    useCache = true
  ): Promise<any> {
    // Try cache first
    if (useCache) {
      const cached = getCachedQuestions(bookSeries, grade, subject, week);
      if (cached) {
        return cached;
      }
    }

    // Fetch from server
    const questionsData = await getQuestions(bookSeries, grade, subject, week);
    
    // Save to cache
    saveQuestions(bookSeries, grade, subject, week, questionsData.questions);

    return questionsData.questions;
  }

  /**
   * Get audio URL (for lazy loading)
   */
  async getAudioUrl(filename: string): Promise<string> {
    // In production, you might want to check cache first
    // For now, return server URL
    try {
      const blob = await downloadAudio(filename);
      // Convert blob to URL
      return URL.createObjectURL(blob);
    } catch (error) {
      // Fallback to server URL
      const { API_BASE_URL } = await import('../api/config.js');
      return `${API_BASE_URL}/api/sync/audio/${filename}`;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    clearSyncCache();
  }

  /**
   * Get cache info
   */
  getCacheInfo(): {
    size: number;
    metadata: SyncMetadata | null;
  } {
    return {
      size: getCacheSize(),
      metadata: getCachedMetadata(),
    };
  }
}

// Export singleton instance
export const syncService = new SyncService();

