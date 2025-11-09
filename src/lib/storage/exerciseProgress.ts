// Exercise Progress Storage Service
// Quản lý tiến độ bài học trong localStorage

interface ExerciseProgress {
  weekId: number;
  bookSeries: string;
  grade: number;
  subject: string;
  currentQuestionIndex: number;
  score: number;
  completedQuestions: number[];
  correctStreak: number;
  startedAt: string; // ISO timestamp
  lastUpdatedAt: string; // ISO timestamp
}

const EXERCISE_PROGRESS_KEY = 'exercise_progress';

// Generate unique key for exercise session
function getExerciseKey(userId: string | null, weekId: number, bookSeries: string, grade: number, subject: string): string {
  // If userId is provided, include it in the key
  if (userId) {
    return `${EXERCISE_PROGRESS_KEY}_${userId}_${weekId}_${bookSeries}_${grade}_${subject}`;
  }
  // Backward compatible: anonymous users (no userId)
  return `${EXERCISE_PROGRESS_KEY}_${weekId}_${bookSeries}_${grade}_${subject}`;
}

// Save exercise progress to localStorage
export function saveExerciseProgress(
  userId: string | null,
  weekId: number,
  bookSeries: string,
  grade: number,
  subject: string,
  progress: Partial<ExerciseProgress>
): void {
  const key = getExerciseKey(userId, weekId, bookSeries, grade, subject);
  const existing = getExerciseProgress(userId, weekId, bookSeries, grade, subject);
  
  const updated: ExerciseProgress = {
    weekId,
    bookSeries,
    grade,
    subject,
    currentQuestionIndex: progress.currentQuestionIndex ?? existing?.currentQuestionIndex ?? 0,
    score: progress.score ?? existing?.score ?? 0,
    completedQuestions: progress.completedQuestions ?? existing?.completedQuestions ?? [],
    correctStreak: progress.correctStreak ?? existing?.correctStreak ?? 0,
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(updated));
}

// Get exercise progress from localStorage
export function getExerciseProgress(
  userId: string | null,
  weekId: number,
  bookSeries: string,
  grade: number,
  subject: string
): ExerciseProgress | null {
  const key = getExerciseKey(userId, weekId, bookSeries, grade, subject);
  const stored = localStorage.getItem(key);
  
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    // Validate that it's for the same exercise
    if (
      parsed.weekId === weekId &&
      parsed.bookSeries === bookSeries &&
      parsed.grade === grade &&
      parsed.subject === subject
    ) {
      return parsed as ExerciseProgress;
    }
    return null;
  } catch (error) {
    console.error('Error parsing exercise progress:', error);
    return null;
  }
}

// Clear exercise progress (when completed or user wants to start fresh)
export function clearExerciseProgress(
  userId: string | null,
  weekId: number,
  bookSeries: string,
  grade: number,
  subject: string
): void {
  const key = getExerciseKey(userId, weekId, bookSeries, grade, subject);
  localStorage.removeItem(key);
}

// Clear all exercise progress (utility function)
export function clearAllExerciseProgress(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(EXERCISE_PROGRESS_KEY)) {
      localStorage.removeItem(key);
    }
  });
}

// Clear all exercise progress for a specific user
export function clearAllProgressForUser(userId: string): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(`${EXERCISE_PROGRESS_KEY}_${userId}_`)) {
      localStorage.removeItem(key);
    }
  });
}

// Get all exercise progress (for admin/debugging)
export function getAllExerciseProgress(userId?: string | null): ExerciseProgress[] {
  const keys = Object.keys(localStorage);
  const progress: ExerciseProgress[] = [];
  const prefix = userId ? `${EXERCISE_PROGRESS_KEY}_${userId}_` : EXERCISE_PROGRESS_KEY;
  
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          progress.push(JSON.parse(stored) as ExerciseProgress);
        }
      } catch (error) {
        console.error(`Error parsing progress for key ${key}:`, error);
      }
    }
  });
  
  return progress;
}

