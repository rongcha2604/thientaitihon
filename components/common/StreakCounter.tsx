import React from 'react';

interface StreakCounterProps {
  streak: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  size = 'medium',
  showLabel = true,
  animated = true,
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  const containerSizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const getFireCount = (streak: number): number => {
    if (streak >= 30) return 3;
    if (streak >= 7) return 3;
    if (streak >= 3) return 2;
    return 1;
  };

  const fireCount = getFireCount(streak);
  const fireEmojis = '🔥'.repeat(fireCount);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`${containerSizeClasses[size]} rounded-full bg-gradient-to-br from-orange-200 to-red-300 flex items-center justify-center shadow-viet-style-raised border-4 border-orange-500/30 ${
          animated && streak > 0 ? 'animate-pulse' : ''
        }`}
      >
        <span className={`${sizeClasses[size]} drop-shadow-lg`}>
          {streak > 0 ? fireEmojis : '😴'}
        </span>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="font-black text-amber-900 text-lg">{streak}</p>
          <p className="text-xs font-bold text-amber-800">Ngày liên tiếp</p>
          {streak >= 7 && (
            <p className="text-xs font-bold text-red-600 mt-1 animate-bounce">
              🔥 Streak xuất sắc!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StreakCounter;

