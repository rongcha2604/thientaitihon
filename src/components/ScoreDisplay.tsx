import { memo } from "react";

interface Props {
  score: number;
  total: number;
  points?: number;
  streak?: number;
  className?: string;
}

function ScoreDisplay({ 
  score, 
  total, 
  points = 0, 
  streak = 0,
  className = "" 
}: Props) {
  return (
    <div className={`flex items-center justify-center gap-4 md:gap-6 flex-wrap ${className}`}>
      <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <span className="text-2xl">⭐</span>
        <div>
          <div className="text-sm text-gray-600">Điểm</div>
          <div className="text-xl font-bold text-kid-primary">{score}/{total}</div>
        </div>
      </div>
      
      {points > 0 && (
        <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <span className="text-2xl">💰</span>
          <div>
            <div className="text-sm text-gray-600">Xu</div>
            <div className="text-xl font-bold text-yellow-600">{points}</div>
          </div>
        </div>
      )}
      
      {streak > 0 && (
        <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-sm text-gray-600">Streak</div>
            <div className="text-xl font-bold text-orange-600">{streak}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Memoize để tránh re-render không cần thiết
export default memo(ScoreDisplay);

