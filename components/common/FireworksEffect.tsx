import React, { useEffect, useState } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
}

interface FireworksEffectProps {
  active: boolean;
  duration?: number;
  fireworkCount?: number;
}

const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#FFA07A', '#98D8C8', '#FFD93D', '#FF69B4', '#00CED1'];

const FireworksEffect: React.FC<FireworksEffectProps> = ({ 
  active, 
  duration = 3000, 
  fireworkCount = 3 
}) => {
  const [fireworks, setFireworks] = useState<Spark[]>([]);

  useEffect(() => {
    if (!active) {
      setFireworks([]);
      return;
    }

    // Tạo fireworks từ các vị trí random trên màn hình
    const newFireworks: Spark[] = [];
    for (let i = 0; i < fireworkCount; i++) {
      const x = 20 + Math.random() * 60; // 20-80% từ trái
      const y = 20 + Math.random() * 40; // 20-60% từ trên
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Mỗi firework tạo ra nhiều sparks
      for (let j = 0; j < 30; j++) {
        const angle = (Math.PI * 2 * j) / 30; // 360 độ chia đều
        const speed = Math.random() * 3 + 2; // Speed 2-5
        newFireworks.push({
          id: i * 1000 + j,
          x,
          y,
          color,
          size: Math.random() * 4 + 2, // Size 2-6px
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          life: 0,
          maxLife: 100 + Math.random() * 50, // Life 100-150 frames
        });
      }
    }

    setFireworks(newFireworks);

    // Cleanup sau duration
    const timer = setTimeout(() => {
      setFireworks([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration, fireworkCount]);

  useEffect(() => {
    if (!active || fireworks.length === 0) return;

    const interval = setInterval(() => {
      setFireworks(prev => 
        prev.map(spark => ({
          ...spark,
          x: spark.x + spark.velocityX * 0.1,
          y: spark.y + spark.velocityY * 0.1 + 0.1, // Gravity
          velocityY: spark.velocityY + 0.1, // Gravity effect
          life: spark.life + 1,
        })).filter(spark => spark.life < spark.maxLife && spark.y < 110) // Remove dead or off-screen sparks
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [active, fireworks.length]);

  if (!active || fireworks.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map(spark => {
        const opacity = 1 - (spark.life / spark.maxLife); // Fade out
        return (
          <div
            key={spark.id}
            className="absolute rounded-full"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
              boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
              transform: `translate(-50%, -50%)`,
              transition: 'none',
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

export default FireworksEffect;

