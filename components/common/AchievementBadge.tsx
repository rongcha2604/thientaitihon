import React, { useEffect, useState } from 'react';

export type BadgeType = 'streak' | 'milestone' | 'perfect' | 'subject' | 'daily';

interface AchievementBadgeProps {
  type: BadgeType;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  showPopup?: boolean;
  onClose?: () => void;
}

const badgeColors = {
  streak: 'bg-orange-200/90 text-orange-900 border-orange-700/30',
  milestone: 'bg-blue-200/90 text-blue-900 border-blue-700/30',
  perfect: 'bg-yellow-200/90 text-yellow-900 border-yellow-700/30',
  subject: 'bg-purple-200/90 text-purple-900 border-purple-700/30',
  daily: 'bg-green-200/90 text-green-900 border-green-700/30',
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  title,
  description,
  icon,
  unlocked,
  showPopup = false,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(showPopup);

  useEffect(() => {
    if (showPopup) {
      setIsVisible(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, onClose]);

  if (showPopup && isVisible) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className={`pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 shadow-viet-style-raised border-4 border-amber-800/30 max-w-md mx-4 animate-scale-in ${badgeColors[type]}`}
          style={{
            animation: 'scaleIn 0.5s ease-out',
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">{icon}</div>
            <h3 className="text-2xl font-black text-amber-900 mb-2">{title}</h3>
            <p className="text-sm font-bold text-amber-800 mb-4">{description}</p>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="px-6 py-2 bg-amber-200 text-amber-900 font-bold rounded-xl shadow-viet-style-pressed hover:scale-105 active:scale-95 transition-transform border-2 border-amber-800/20"
            >
              Tuyệt vời! 🎉
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-4 rounded-2xl shadow-viet-style-raised border-2 ${
        unlocked ? badgeColors[type] : 'bg-slate-200/50 text-slate-500 border-slate-400/30'
      }`}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h4 className="font-black text-sm mb-1">{title}</h4>
        <p className="text-xs font-semibold">{description}</p>
      </div>
      {!unlocked && (
        <div className="absolute inset-0 bg-slate-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <span className="text-2xl text-white">🔒</span>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;

