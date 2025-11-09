import React, { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface BubblesEffectProps {
  active: boolean;
  duration?: number;
  bubbleCount?: number;
}

const BubblesEffect: React.FC<BubblesEffectProps> = ({ 
  active, 
  duration = 3000, 
  bubbleCount = 20 
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    if (!active) {
      setBubbles([]);
      return;
    }

    // Tạo bubbles từ dưới lên
    const newBubbles: Bubble[] = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random position từ 0-100%
      y: 100, // Bắt đầu từ dưới màn hình
      size: Math.random() * 30 + 20, // Size 20-50px
      speed: Math.random() * 2 + 1, // Speed 1-3
      opacity: Math.random() * 0.5 + 0.3, // Opacity 0.3-0.8
    }));

    setBubbles(newBubbles);

    // Cleanup sau duration
    const timer = setTimeout(() => {
      setBubbles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration, bubbleCount]);

  useEffect(() => {
    if (!active || bubbles.length === 0) return;

    const interval = setInterval(() => {
      setBubbles(prev => 
        prev.map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed, // Bay lên
          x: bubble.x + (Math.sin(bubble.id * 0.1) * 0.5), // Slight horizontal movement
        })).filter(bubble => bubble.y > -10) // Remove bubbles above screen
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [active, bubbles.length]);

  if (!active || bubbles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full border-2 border-white/30"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: `rgba(135, 206, 250, ${bubble.opacity})`, // Light blue
            boxShadow: `inset 0 0 ${bubble.size / 2}px rgba(255, 255, 255, 0.5)`,
            transform: `translate(-50%, -50%)`,
            transition: 'none',
          }}
        />
      ))}
    </div>
  );
};

export default BubblesEffect;

