import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
}

const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#FFA07A', '#98D8C8', '#FFD93D'];

const Confetti: React.FC<ConfettiProps> = ({ 
  active, 
  duration = 3000, 
  particleCount = 50 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    // Tạo particles
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));

    setParticles(newParticles);

    // Cleanup sau duration
    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration, particleCount]);

  useEffect(() => {
    if (!active || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.velocityX,
          y: p.y + p.velocityY,
          velocityY: p.velocityY + 0.1, // Gravity
          rotation: p.rotation + p.rotationSpeed,
        })).filter(p => p.y < 110) // Remove particles below screen
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [active, particles.length]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            transition: 'none',
            opacity: particle.y > 100 ? 0 : 1,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;

