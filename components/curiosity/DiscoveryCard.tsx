import React, { useEffect, useState } from 'react';
import { playSound } from '../common/SoundEffects';
import Confetti from '../common/Confetti';

interface Discovery {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const discoveries: Discovery[] = [
  {
    id: 'discovery-1',
    title: 'Bạn biết không?',
    content: 'Cây đa có thể sống hơn 1000 năm! 🌳',
    icon: '🌳',
  },
  {
    id: 'discovery-2',
    title: 'Bạn biết không?',
    content: 'Lúa được trồng từ 9000 năm trước! 🌾',
    icon: '🌾',
  },
  {
    id: 'discovery-3',
    title: 'Bạn biết không?',
    content: 'Tre là cây mọc nhanh nhất thế giới! 🎋',
    icon: '🎋',
  },
  {
    id: 'discovery-4',
    title: 'Bạn biết không?',
    content: 'Giếng nước có thể sâu đến 100 mét! 💧',
    icon: '💧',
  },
  {
    id: 'discovery-5',
    title: 'Bạn biết không?',
    content: 'Con gà có thể nhớ hơn 100 khuôn mặt! 🐔',
    icon: '🐔',
  },
];

interface DiscoveryCardProps {
  trigger: boolean; // Trigger khi đúng 5 câu liên tiếp
  onClose: () => void;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ trigger, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDiscovery, setCurrentDiscovery] = useState<Discovery | null>(null);

  useEffect(() => {
    if (trigger) {
      // Random discovery
      const randomDiscovery = discoveries[Math.floor(Math.random() * discoveries.length)];
      setCurrentDiscovery(randomDiscovery);
      setIsVisible(true);
      playSound('achievement');
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onClose]);

  if (!isVisible || !currentDiscovery) return null;

  return (
    <>
      <Confetti active={isVisible} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
        <div
          className="pointer-events-auto bg-gradient-to-br from-yellow-200 to-orange-300 rounded-3xl p-6 shadow-viet-style-raised border-4 border-amber-800/30 max-w-md w-full animate-scale-in"
          style={{
            animation: 'scaleIn 0.5s ease-out',
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">{currentDiscovery.icon}</div>
            <h3 className="text-2xl font-black text-amber-900 mb-2">{currentDiscovery.title}</h3>
            <p className="text-lg font-bold text-amber-800 mb-4">{currentDiscovery.content}</p>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  onClose();
                }, 500);
              }}
              className="px-6 py-2 bg-amber-200 text-amber-900 font-bold rounded-xl shadow-viet-style-pressed hover:scale-105 active:scale-95 transition-transform border-2 border-amber-800/20"
            >
              Tuyệt vời! 🎉
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscoveryCard;

