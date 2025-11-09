import React from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { useAdaptiveDifficulty } from '../../contexts/AdaptiveDifficultyContext';
import ProgressBar from '../common/ProgressBar';

const LearningAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { getPerformanceStats, difficulty } = useAdaptiveDifficulty();

  const stats = getPerformanceStats();
  const correctRatePercent = Math.round(stats.correctRate * 100);
  const averageTimeSeconds = Math.round(stats.averageTime / 1000);

  return (
    <div className="bg-[#FDFBF5]/80 p-5 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
      <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">📊</span>
        Thống kê học tập
      </h2>

      <div className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-100/50 p-4 rounded-2xl text-center border-2 border-blue-700/20">
            <p className="text-2xl font-black text-blue-900">{stats.totalQuestions}</p>
            <p className="text-xs font-bold text-blue-700">Tổng câu hỏi</p>
          </div>
          <div className="bg-green-100/50 p-4 rounded-2xl text-center border-2 border-green-700/20">
            <p className="text-2xl font-black text-green-900">{correctRatePercent}%</p>
            <p className="text-xs font-bold text-green-700">Tỷ lệ đúng</p>
          </div>
          <div className="bg-yellow-100/50 p-4 rounded-2xl text-center border-2 border-yellow-700/20">
            <p className="text-2xl font-black text-yellow-900">{stats.streak}</p>
            <p className="text-xs font-bold text-yellow-700">Streak hiện tại</p>
          </div>
          <div className="bg-purple-100/50 p-4 rounded-2xl text-center border-2 border-purple-700/20">
            <p className="text-2xl font-black text-purple-900">{averageTimeSeconds}s</p>
            <p className="text-xs font-bold text-purple-700">Thời gian TB</p>
          </div>
        </div>

        {/* Correct Rate Progress */}
        <div className="bg-yellow-100/40 p-4 rounded-2xl border-2 border-yellow-700/20">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-amber-900">Tỷ lệ đúng</p>
            <p className="text-sm font-bold text-amber-800">{correctRatePercent}%</p>
          </div>
          <ProgressBar
            progress={correctRatePercent}
            current={Math.round(stats.correctRate * stats.totalQuestions)}
            total={stats.totalQuestions}
            color="green"
            animated
          />
        </div>

        {/* Difficulty Indicator */}
        <div className="bg-blue-100/40 p-4 rounded-2xl border-2 border-blue-700/20">
          <div className="flex items-center justify-between">
            <p className="font-bold text-blue-900">Độ khó hiện tại</p>
            <div className="flex items-center space-x-2">
              {difficulty === 'easy' && <span className="text-2xl">🌱</span>}
              {difficulty === 'medium' && <span className="text-2xl">⭐</span>}
              {difficulty === 'hard' && <span className="text-2xl">🔥</span>}
              <span className="font-bold text-blue-900">
                {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-green-100/40 p-4 rounded-2xl border-2 border-green-700/20">
          <p className="font-bold text-green-900 mb-2">Xu hướng</p>
          <p className="text-sm text-green-800">
            {stats.correctRate >= 0.8 ? (
              <>📈 Bạn đang làm rất tốt! Tiếp tục phát huy nhé!</>
            ) : stats.correctRate >= 0.6 ? (
              <>👍 Bạn đang tiến bộ! Cố gắng thêm một chút nữa!</>
            ) : (
              <>💪 Đừng nản lòng! Hãy xem lại các câu sai và cố gắng nhé!</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningAnalytics;

