import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: string;
  x: number;
  y: number;
  delay: number;
  size: number;
}

interface Props {
  isActive: boolean;
  x?: number;
  y?: number;
  count?: number;
}

export default function Sparkles({ isActive, x, y, count = 20 }: Props) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!isActive || x === undefined || y === undefined) {
      setSparkles([]);
      return;
    }

    // Tạo sparkles xung quanh điểm (x, y)
    const newSparkles: Sparkle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = 50 + Math.random() * 50;
      const sparkleX = x + Math.cos(angle) * distance;
      const sparkleY = y + Math.sin(angle) * distance;
      
      newSparkles.push({
        id: `sparkle-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        x: sparkleX,
        y: sparkleY,
        delay: Math.random() * 0.3,
        size: 3 + Math.random() * 4,
      });
    }

    setSparkles(newSparkles);

    // Cleanup sau 1.5 giây
    const cleanup = setTimeout(() => {
      setSparkles([]);
    }, 1500);

    return () => clearTimeout(cleanup);
  }, [isActive, x, y, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{
              x: sparkle.x,
              y: sparkle.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6, // Giảm từ 0.8 → 0.6
              delay: sparkle.delay,
              ease: "easeOut",
            }}
            className="absolute rounded-full optimize-animation"
            style={{
              width: sparkle.size,
              height: sparkle.size,
              background: "radial-gradient(circle, #FFE66D 0%, #FF6B6B 100%)",
              boxShadow: `0 0 ${sparkle.size * 3}px #FFE66D, 0 0 ${sparkle.size * 5}px #FF6B6B`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

