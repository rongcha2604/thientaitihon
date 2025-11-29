import { useState, useEffect } from "react";

interface GamificationState {
  score: number;
  points: number;
  streak: number;
  totalQuestions: number;
}

export function useGamification(totalQuestions: number) {
  const [state, setState] = useState<GamificationState>({
    score: 0,
    points: 0,
    streak: 0,
    totalQuestions,
  });

  const addCorrect = () => {
    setState((prev) => {
      const newStreak = prev.streak + 1;
      const streakBonus = newStreak >= 3 && newStreak % 3 === 0 ? 50 : 0;
      const newPoints = prev.points + 10 + streakBonus;
      
      return {
        score: prev.score + 1,
        points: newPoints,
        streak: newStreak,
        totalQuestions: prev.totalQuestions,
      };
    });
  };

  const addWrong = () => {
    setState((prev) => ({
      ...prev,
      streak: 0,
    }));
  };

  const reset = () => {
    setState({
      score: 0,
      points: 0,
      streak: 0,
      totalQuestions,
    });
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      totalQuestions,
    }));
  }, [totalQuestions]);

  return {
    score: state.score,
    points: state.points,
    streak: state.streak,
    addCorrect,
    addWrong,
    reset,
  };
}

