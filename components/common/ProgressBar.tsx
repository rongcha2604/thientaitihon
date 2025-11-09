import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  total?: number;
  current?: number;
  showLabel?: boolean;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  animated?: boolean;
  className?: string;
}

const colorClasses = {
  green: 'bg-gradient-to-r from-green-400 to-green-600',
  blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
  yellow: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
  red: 'bg-gradient-to-r from-red-400 to-red-600',
  purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  total,
  current,
  showLabel = true,
  color = 'green',
  animated = true,
  className = '',
}) => {
  const progressValue = Math.max(0, Math.min(100, progress));
  const displayText = total !== undefined && current !== undefined
    ? `${current}/${total}`
    : `${Math.round(progressValue)}%`;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-amber-900">
            {total !== undefined && current !== undefined ? displayText : `${Math.round(progressValue)}%`}
          </span>
          {total !== undefined && current !== undefined && (
            <span className="text-xs text-amber-800">
              {Math.round(progressValue)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-[#FDFBF5] rounded-full h-5 md:h-6 p-1 shadow-viet-style-pressed border-2 border-amber-800/20 overflow-hidden">
        <div
          className={`relative ${colorClasses[color]} h-full rounded-full transition-all duration-500 ease-out border-2 border-white/80 ${
            animated ? 'transform transition-all' : ''
          }`}
          style={{
            width: `${progressValue}%`,
            transition: animated ? 'width 0.5s ease-out' : 'none',
          }}
        >
          {showLabel && progressValue > 20 && (
            <span className="text-xs font-black text-white absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 drop-shadow-md">
              {displayText}
            </span>
          )}
          {/* Shimmer effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

