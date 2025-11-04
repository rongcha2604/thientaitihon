import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface Props {
  isActive: boolean;
  onComplete?: () => void;
}

const colors = [
  "#FF6B6B", // Đỏ
  "#4ECDC4", // Xanh dương
  "#FFE66D", // Vàng
  "#95E1D3", // Xanh lá
  "#FF8B94", // Hồng
  "#A8E6CF", // Xanh nhạt
  "#FFB347", // Cam
];

export default function Fireworks({ isActive, onComplete }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Tạo particles cho pháo hoa
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Tạo 4 vụ nổ pháo hoa (giảm từ 6)
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4;
      const delay = i * 150;
      
      setTimeout(() => {
        const burstParticles: Particle[] = [];
        const particleCount = 20 + Math.random() * 15; // Giảm từ 30-50 → 20-35
        
        for (let j = 0; j < particleCount; j++) {
          const randomAngle = angle + (Math.random() - 0.5) * 0.8;
          const speed = 2 + Math.random() * 4;
          const vx = Math.cos(randomAngle) * speed;
          const vy = Math.sin(randomAngle) * speed;
          
          burstParticles.push({
            id: `firework-${Date.now()}-${i}-${j}-${Math.random().toString(36).substr(2, 9)}`,
            x: centerX + Math.cos(angle) * 50,
            y: centerY + Math.sin(angle) * 50,
            vx,
            vy,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 3 + Math.random() * 4,
          });
        }
        
        setParticles((prev) => [...prev, ...burstParticles]);
      }, delay);
    }

    // Cleanup sau 3 giây
    const cleanup = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(cleanup);
  }, [isActive, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: particle.x + particle.vx * 100,
              y: particle.y + particle.vy * 100,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2, // Giảm từ 1.5 → 1.2
              ease: "easeOut",
            }}
            className="absolute rounded-full optimize-animation"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

