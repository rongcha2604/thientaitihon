import React from 'react';
import { useAdaptiveDifficulty } from '../../contexts/AdaptiveDifficultyContext';

const AdaptiveDifficulty: React.FC = () => {
  const { difficulty } = useAdaptiveDifficulty();

  const difficultyConfig = {
    easy: {
      label: 'Dễ',
      color: 'bg-green-500',
      icon: '🌱',
      description: 'Độ khó phù hợp với bạn',
    },
    medium: {
      label: 'Trung bình',
      color: 'bg-yellow-500',
      icon: '⭐',
      description: 'Độ khó vừa phải',
    },
    hard: {
      label: 'Khó',
      color: 'bg-red-500',
      icon: '🔥',
      description: 'Thử thách cao hơn',
    },
  };

  const config = difficultyConfig[difficulty];

  return (
    <div className="inline-flex items-center space-x-2 bg-[#FDFBF5]/80 px-3 py-2 rounded-xl shadow-viet-style-raised border-2 border-amber-800/20">
      <span className="text-lg">{config.icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-amber-900">{config.label}</span>
        <span className="text-xs text-amber-700">{config.description}</span>
      </div>
    </div>
  );
};

export default AdaptiveDifficulty;

