// Utility functions for animations and effects

export function getAchievementBadge(score: number, totalQuestions: number): string | null {
  const percentage = (score / totalQuestions) * 100;
  
  if (percentage === 100) return "🏆 Thiên tài xuất sắc!";
  if (percentage >= 90) return "⭐ Siêu sao!";
  if (percentage >= 80) return "🌟 Xuất sắc!";
  if (percentage >= 70) return "✨ Giỏi lắm!";
  if (percentage >= 60) return "👍 Tốt!";
  
  return null;
}

export function calculatePoints(correct: number, streak: number = 0): number {
  const basePoints = correct * 10;
  const streakBonus = Math.floor(streak / 3) * 50;
  return basePoints + streakBonus;
}

export function getLevelColor(level: string): string {
  switch (level) {
    case "easy":
      return "bg-green-100 text-green-800 border-green-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "hard":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export function getSubjectIcon(subjectId: string): string {
  switch (subjectId) {
    case "math":
      return "🔢";
    case "vie":
    case "vietnamese":
      return "📚";
    case "eng":
    case "english":
      return "🔤";
    default:
      return "📖";
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

