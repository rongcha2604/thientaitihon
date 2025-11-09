// Demo component để test Phase 1 features
// Có thể xóa sau khi test xong

import React, { useState } from 'react';
import Confetti from './Confetti';
import { playSound } from './SoundEffects';
import ProgressBar from './ProgressBar';
import { useToast } from './ToastNotification';
import StreakCounter from './StreakCounter';
import AchievementBadge from './AchievementBadge';
import CardOpening from './CardOpening';

const Phase1Demo: React.FC = () => {
  const [confettiActive, setConfettiActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(5);
  const [showBadge, setShowBadge] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const { showToast } = useToast();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-black text-amber-900 mb-6">🎨 Phase 1 Features Demo</h2>

      {/* Confetti Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">🎉 Confetti</h3>
        <button
          onClick={() => {
            setConfettiActive(true);
            playSound('success');
            setTimeout(() => setConfettiActive(false), 3000);
          }}
          className="px-4 py-2 bg-green-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform"
        >
          Trigger Confetti
        </button>
        <Confetti active={confettiActive} />
      </div>

      {/* Sound Effects Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">🔊 Sound Effects</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => playSound('correct')} className="px-4 py-2 bg-green-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Correct</button>
          <button onClick={() => playSound('wrong')} className="px-4 py-2 bg-red-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Wrong</button>
          <button onClick={() => playSound('success')} className="px-4 py-2 bg-blue-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Success</button>
          <button onClick={() => playSound('achievement')} className="px-4 py-2 bg-yellow-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Achievement</button>
          <button onClick={() => playSound('levelUp')} className="px-4 py-2 bg-purple-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Level Up</button>
          <button onClick={() => playSound('tap')} className="px-4 py-2 bg-gray-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Tap</button>
        </div>
      </div>

      {/* Progress Bar Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">📊 Progress Bar</h3>
        <div className="space-y-4">
          <ProgressBar progress={progress} color="green" animated />
          <div className="flex gap-2">
            <button onClick={() => setProgress(Math.max(0, progress - 10))} className="px-4 py-2 bg-red-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">-10%</button>
            <button onClick={() => setProgress(Math.min(100, progress + 10))} className="px-4 py-2 bg-green-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">+10%</button>
          </div>
        </div>
      </div>

      {/* Toast Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">🍞 Toast Notifications</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => showToast('Đã lưu tiến độ!', 'success')} className="px-4 py-2 bg-green-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Success</button>
          <button onClick={() => showToast('Có lỗi xảy ra!', 'error')} className="px-4 py-2 bg-red-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Error</button>
          <button onClick={() => showToast('Thông tin quan trọng!', 'info')} className="px-4 py-2 bg-blue-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Info</button>
          <button onClick={() => showToast('Cảnh báo!', 'warning')} className="px-4 py-2 bg-yellow-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">Warning</button>
        </div>
      </div>

      {/* Streak Counter Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">🔥 Streak Counter</h3>
        <div className="flex items-center gap-4">
          <StreakCounter streak={streak} size="medium" showLabel />
          <div className="flex gap-2">
            <button onClick={() => setStreak(Math.max(0, streak - 1))} className="px-4 py-2 bg-red-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">-1</button>
            <button onClick={() => setStreak(streak + 1)} className="px-4 py-2 bg-green-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform">+1</button>
          </div>
        </div>
      </div>

      {/* Achievement Badge Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">🏅 Achievement Badge</h3>
        <button
          onClick={() => {
            setShowBadge(true);
            playSound('achievement');
            setTimeout(() => setShowBadge(false), 5000);
          }}
          className="px-4 py-2 bg-yellow-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform"
        >
          Show Achievement Badge
        </button>
        {showBadge && (
          <AchievementBadge
            type="streak"
            title="Streak Xuất Sắc!"
            description="Học liên tiếp 7 ngày"
            icon="🔥"
            unlocked={true}
            showPopup={true}
            onClose={() => setShowBadge(false)}
          />
        )}
      </div>

      {/* Card Opening Demo */}
      <div className="bg-[#FDFBF5]/80 p-4 rounded-2xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h3 className="font-bold text-amber-800 mb-2">🎴 Card Opening</h3>
        <button
          onClick={() => {
            setShowCard(true);
            playSound('success');
            setTimeout(() => setShowCard(false), 3000);
          }}
          className="px-4 py-2 bg-purple-400 text-white rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform"
        >
          Open Card
        </button>
        {showCard && (
          <CardOpening
            isOpen={true}
            itemName="Trạng Tí"
            itemIcon="🧒"
            onComplete={() => setShowCard(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Phase1Demo;

