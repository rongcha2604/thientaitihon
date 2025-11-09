/**
 * Sync Storage Service
 * Handles local storage for synced questions and audio files
 */

const STORAGE_PREFIX = 'sync_';
const METADATA_KEY = `${STORAGE_PREFIX}metadata`;
const QUESTIONS_KEY = `${STORAGE_PREFIX}questions`;
const AUDIO_KEY = `${STORAGE_PREFIX}audio`;

export interface CachedMetadata {
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

/**
 * Get cached metadata
 */
export function getCachedMetadata(): CachedMetadata | null {
  try {
    const cached = localStorage.getItem(METADATA_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cached metadata:', error);
    return null;
  }
}

/**
 * Save metadata to cache
 */
export function saveMetadata(metadata: CachedMetadata): void {
  try {
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving metadata:', error);
  }
}

/**
 * Get cached questions
 */
export function getCachedQuestions(
  bookSeries: string,
  grade: number,
  subject: string,
  week: number
): any | null {
  try {
    const key = `${QUESTIONS_KEY}_${bookSeries}_${grade}_${subject}_${week}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error getting cached questions:', error);
    return null;
  }
}

/**
 * Save questions to cache
 */
export function saveQuestions(
  bookSeries: string,
  grade: number,
  subject: string,
  week: number,
  questions: any
): void {
  try {
    const key = `${QUESTIONS_KEY}_${bookSeries}_${grade}_${subject}_${week}`;
    localStorage.setItem(key, JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions:', error);
  }
}

/**
 * Check if questions need sync
 */
export function needsSync(serverMetadata: CachedMetadata, cachedMetadata: CachedMetadata | null): boolean {
  if (!cachedMetadata) return true;
  
  // Check if server version is newer
  if (serverMetadata.questions.lastUpdated > cachedMetadata.questions.lastUpdated) {
    return true;
  }
  
  if (serverMetadata.audio.lastUpdated > cachedMetadata.audio.lastUpdated) {
    return true;
  }
  
  return false;
}

/**
 * Clear all cached sync data
 */
export function clearSyncCache(): void {
  try {
    // Clear metadata
    localStorage.removeItem(METADATA_KEY);
    
    // Clear all questions
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(QUESTIONS_KEY)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear all audio (if stored as base64)
    keys.forEach(key => {
      if (key.startsWith(AUDIO_KEY)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing sync cache:', error);
  }
}

/**
 * Get cache size (approximate)
 */
export function getCacheSize(): number {
  try {
    let size = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          size += value.length;
        }
      }
    });
    
    return size;
  } catch (error) {
    console.error('Error getting cache size:', error);
    return 0;
  }
}

