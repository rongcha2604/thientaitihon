import React, { createContext, useContext, useState, useEffect } from 'react';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface AdaptiveDifficultyContextType {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  updatePerformance: (isCorrect: boolean, timeSpent?: number) => void;
  getPerformanceStats: () => {
    correctRate: number;
    streak: number;
    averageTime: number;
    totalQuestions: number;
  };
  resetStats: () => void;
}

const AdaptiveDifficultyContext = createContext<AdaptiveDifficultyContextType | undefined>(undefined);

const STORAGE_KEY = 'adaptive_difficulty';
const PERFORMANCE_KEY = 'difficulty_performance';

interface PerformanceData {
  answers: boolean[]; // Last 20 answers
  times: number[]; // Time spent per question (ms)
  streak: number;
  totalQuestions: number;
}

export const AdaptiveDifficultyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<DifficultyLevel>('medium');
  const [performance, setPerformance] = useState<PerformanceData>({
    answers: [],
    times: [],
    streak: 0,
    totalQuestions: 0,
  });

  // Load from localStorage
  useEffect(() => {
    const storedDifficulty = localStorage.getItem(STORAGE_KEY);
    const storedPerformance = localStorage.getItem(PERFORMANCE_KEY);

    if (storedDifficulty) {
      try {
        const parsed = JSON.parse(storedDifficulty) as DifficultyLevel;
        if (['easy', 'medium', 'hard'].includes(parsed)) {
          setDifficultyState(parsed);
        }
      } catch (e) {
        // Use default
      }
    }

    if (storedPerformance) {
      try {
        const parsed = JSON.parse(storedPerformance) as PerformanceData;
        setPerformance(parsed);
      } catch (e) {
        // Use default
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(difficulty));
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(performance));
  }, [performance]);

  const setDifficulty = (level: DifficultyLevel) => {
    setDifficultyState(level);
  };

  const updatePerformance = (isCorrect: boolean, timeSpent: number = 0) => {
    setPerformance(prev => {
      const newAnswers = [...prev.answers, isCorrect].slice(-20); // Keep last 20
      const newTimes = [...prev.times, timeSpent].slice(-20); // Keep last 20
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newTotal = prev.totalQuestions + 1;

      // Auto-adjust difficulty based on performance
      const correctRate = newAnswers.length > 0 
        ? newAnswers.filter(a => a).length / newAnswers.length 
        : 0;

      // Adjust difficulty if we have enough data (at least 5 questions)
      if (newAnswers.length >= 5) {
        if (correctRate >= 0.9 && difficulty === 'medium') {
          // 90%+ correct → Increase difficulty
          setDifficultyState('hard');
        } else if (correctRate >= 0.8 && difficulty === 'easy') {
          // 80%+ correct → Increase difficulty
          setDifficultyState('medium');
        } else if (correctRate < 0.5 && difficulty === 'hard') {
          // <50% correct → Decrease difficulty
          setDifficultyState('medium');
        } else if (correctRate < 0.6 && difficulty === 'medium') {
          // <60% correct → Decrease difficulty
          setDifficultyState('easy');
        }
      }

      return {
        answers: newAnswers,
        times: newTimes,
        streak: newStreak,
        totalQuestions: newTotal,
      };
    });
  };

  const getPerformanceStats = () => {
    const correctRate = performance.answers.length > 0
      ? performance.answers.filter(a => a).length / performance.answers.length
      : 0;
    
    const averageTime = performance.times.length > 0
      ? performance.times.reduce((a, b) => a + b, 0) / performance.times.length
      : 0;

    return {
      correctRate,
      streak: performance.streak,
      averageTime,
      totalQuestions: performance.totalQuestions,
    };
  };

  const resetStats = () => {
    setPerformance({
      answers: [],
      times: [],
      streak: 0,
      totalQuestions: 0,
    });
    setDifficultyState('medium');
  };

  return (
    <AdaptiveDifficultyContext.Provider
      value={{
        difficulty,
        setDifficulty,
        updatePerformance,
        getPerformanceStats,
        resetStats,
      }}
    >
      {children}
    </AdaptiveDifficultyContext.Provider>
  );
};

export const useAdaptiveDifficulty = () => {
  const context = useContext(AdaptiveDifficultyContext);
  if (!context) {
    throw new Error('useAdaptiveDifficulty must be used within AdaptiveDifficultyProvider');
  }
  return context;
};

