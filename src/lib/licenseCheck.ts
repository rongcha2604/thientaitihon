/**
 * License Check Utility
 * Check if user has completed 10 weeks/challenges and needs license
 */

import { getExerciseProgress, getAllExerciseProgress } from './storage/exerciseProgress';

/**
 * Count total completed weeks across all subjects and grades
 * A week is considered completed if all questions in that week are answered correctly
 */
export async function countCompletedWeeks(userId: string | null): Promise<number> {
  let completedCount = 0;
  
  // Get all progress entries
  const allProgress = getAllExerciseProgress(userId);
  
  // Group by week (weekId + bookSeries + grade + subject)
  const weekMap = new Map<string, { progress: any; totalQuestions: number | null }>();
  
  for (const progress of allProgress) {
    const weekKey = `${progress.weekId}_${progress.bookSeries}_${progress.grade}_${progress.subject}`;
    
    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { progress, totalQuestions: null });
    }
  }
  
  // Load totalQuestions for each week (async)
  const weekChecks = Array.from(weekMap.entries()).map(async ([weekKey, data]) => {
    const { weekId, bookSeries, grade, subject } = data.progress;
    
    // Try to load week data to get totalQuestions
    try {
      const subjectFolder = subject === 'math' ? 'math' : 'vietnamese';
      // Map bookSeries name to folder name
      const bookSeriesFolder = bookSeries === 'Kết nối tri thức' ? 'ket-noi-tri-thuc' : bookSeries.toLowerCase().replace(/\s+/g, '-');
      const dataPath = `/data/questions/${bookSeriesFolder}/grade-${grade}/${subjectFolder}/week-${weekId}.json`;
      const response = await fetch(dataPath);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const weekData = await response.json();
          const totalQuestions = weekData.lessons?.reduce((sum: number, lesson: any) => {
            return sum + (lesson.questions?.length || 0);
          }, 0) || 0;
          
          data.totalQuestions = totalQuestions;
        }
      }
    } catch (error) {
      // If can't load, use heuristic: >= 10 questions completed
      // Silently fail - don't spam console
    }
    
    // Check if completed
    const completedQuestions = data.progress.completedQuestions || [];
    const targetQuestions = data.totalQuestions || 10; // Fallback to 10 if can't load
    
    if (completedQuestions.length >= targetQuestions) {
      return 1;
    }
    
    return 0;
  });
  
  const results = await Promise.all(weekChecks);
  completedCount = results.reduce((sum, count) => sum + count, 0);
  
  return completedCount;
}

/**
 * Check if license is required (10+ weeks completed)
 * Note: This is async, but we'll cache the result
 */
let licenseCheckCache: { userId: string | null; count: number; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

export async function isLicenseRequired(userId: string | null): Promise<boolean> {
  // Check cache
  if (licenseCheckCache && 
      licenseCheckCache.userId === userId && 
      Date.now() - licenseCheckCache.timestamp < CACHE_DURATION) {
    return licenseCheckCache.count >= 10;
  }
  
  // Count completed weeks
  const count = await countCompletedWeeks(userId);
  
  // Update cache
  licenseCheckCache = {
    userId,
    count,
    timestamp: Date.now(),
  };
  
  return count >= 10;
}

/**
 * Clear license check cache (call when progress changes)
 */
export function clearLicenseCheckCache(): void {
  licenseCheckCache = null;
}

