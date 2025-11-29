import { memo } from "react";

interface Props {
  current: number;
  total: number;
  className?: string;
}

function ProgressBar({ current, total, className = "" }: Props) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Tiến độ
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="progress-bar h-2.5">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Memoize để tránh re-render không cần thiết
export default memo(ProgressBar);

