import React, { useEffect, useState } from 'react';
import Confetti from './Confetti';
import BubblesEffect from './BubblesEffect';
import FireworksEffect from './FireworksEffect';

interface SuccessCelebrationProps {
  isActive: boolean;
  streak: number; // Số câu đúng liên tiếp
  onComplete?: () => void;
}

const SuccessCelebration: React.FC<SuccessCelebrationProps> = ({ 
  isActive, 
  streak,
  onComplete 
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Reset showModal trước khi set lại để đảm bảo animation chạy lại
      setShowModal(false);
      // Slight delay để đảm bảo state update
      const resetTimer = setTimeout(() => {
        setShowModal(true);
      }, 10);
      
      // Auto close sau 2 giây (từ lúc showModal = true)
      const closeTimer = setTimeout(() => {
        setShowModal(false);
        if (onComplete) {
          setTimeout(onComplete, 300); // Delay để animation hoàn thành
        }
      }, 2010); // 10ms delay + 2000ms display
      
      return () => {
        clearTimeout(resetTimer);
        clearTimeout(closeTimer);
      };
    } else {
      // Reset showModal khi isActive = false
      setShowModal(false);
    }
  }, [isActive, onComplete]);

  // Xác định hiệu ứng và message dựa trên streak
  const getCelebrationConfig = () => {
    if (streak >= 5) {
      return {
        message: '🔥 TUYỆT VỜI! 🔥',
        subMessage: `Combo ${streak} câu đúng!`,
        emoji: '🎆',
        showConfetti: true,
        showBubbles: true,
        showFireworks: true,
        confettiCount: 100,
        bubbleCount: 30,
        fireworkCount: 5,
      };
    } else if (streak >= 4) {
      return {
        message: '🎆 PHÁO HOA! 🎆',
        subMessage: `Combo ${streak} câu đúng!`,
        emoji: '🎆',
        showConfetti: true,
        showBubbles: false,
        showFireworks: true,
        confettiCount: 70,
        bubbleCount: 0,
        fireworkCount: 3,
      };
    } else if (streak >= 2) {
      return {
        message: '💫 BONG BÓNG! 💫',
        subMessage: `Combo ${streak} câu đúng!`,
        emoji: '💫',
        showConfetti: true,
        showBubbles: true,
        showFireworks: false,
        confettiCount: 50,
        bubbleCount: 20,
        fireworkCount: 0,
      };
    } else {
      return {
        message: '🎉 ĐÚNG RỒI! 🎉',
        subMessage: 'Làm tốt lắm!',
        emoji: '🎉',
        showConfetti: true,
        showBubbles: false,
        showFireworks: false,
        confettiCount: 50,
        bubbleCount: 0,
        fireworkCount: 0,
      };
    }
  };

  const config = getCelebrationConfig();

  if (!isActive || !showModal) return null;

  return (
    <>
      {/* Background Effects */}
      {config.showConfetti && (
        <Confetti 
          active={isActive} 
          duration={2000}
          particleCount={config.confettiCount}
        />
      )}
      {config.showBubbles && (
        <BubblesEffect 
          active={isActive} 
          duration={2000}
          bubbleCount={config.bubbleCount}
        />
      )}
      {config.showFireworks && (
        <FireworksEffect 
          active={isActive} 
          duration={2000}
          fireworkCount={config.fireworkCount}
        />
      )}

      {/* Celebration Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div 
          className="bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-amber-900/30 transform animate-scale-in pointer-events-auto"
          style={{
            boxShadow: '0 0 50px rgba(251, 191, 36, 0.8), 0 0 100px rgba(251, 191, 36, 0.5)',
          }}
        >
          <div className="text-center">
            <div className="text-6xl md:text-8xl mb-4 animate-bounce-slow">
              {config.emoji}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-amber-900 mb-2 drop-shadow-lg">
              {config.message}
            </h2>
            <p className="text-xl md:text-2xl font-bold text-amber-800">
              {config.subMessage}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessCelebration;

