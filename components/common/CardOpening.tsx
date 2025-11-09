import React, { useEffect, useState } from 'react';

interface CardOpeningProps {
  isOpen: boolean;
  itemName: string;
  itemIcon: string;
  onComplete?: () => void;
}

const CardOpening: React.FC<CardOpeningProps> = ({
  isOpen,
  itemName,
  itemIcon,
  onComplete,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlipping(true);
      setTimeout(() => {
        setShowSparkles(true);
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      }, 600);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto relative">
        {/* Card */}
        <div
          className={`relative w-64 h-80 perspective-1000 ${
            isFlipping ? 'animate-flip-card' : ''
          }`}
        >
          <div className="relative w-full h-full preserve-3d">
            {/* Back of card */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-3xl shadow-viet-style-raised border-4 border-amber-800/30 backface-hidden ${
                isFlipping ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-6xl">🎴</span>
              </div>
            </div>
            
            {/* Front of card */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-green-200 to-blue-300 rounded-3xl shadow-viet-style-raised border-4 border-amber-800/30 backface-hidden ${
                isFlipping ? '' : 'rotate-y-180'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-8xl mb-4 animate-bounce">{itemIcon}</div>
                <h3 className="text-2xl font-black text-amber-900 mb-2">{itemName}</h3>
                <p className="text-sm font-bold text-amber-800 text-center">
                  Bạn đã mở thẻ mới! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sparkles */}
        {showSparkles && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardOpening;

