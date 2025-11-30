import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Bubble {
  id: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

interface Props {
  isActive: boolean;
  count?: number;
}

const bubbleColors = [
  "rgba(255, 107, 107, 0.6)",
  "rgba(78, 205, 196, 0.6)",
  "rgba(255, 230, 109, 0.6)",
  "rgba(149, 225, 211, 0.6)",
  "rgba(255, 139, 148, 0.6)",
  "rgba(168, 230, 207, 0.6)",
];

export default function Bubbles({ isActive, count = 15 }: Props) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    if (!isActive) {
      setBubbles([]);
      return;
    }

    // Tạo bubbles từ dưới màn hình
    const newBubbles: Bubble[] = [];
    const screenWidth = window.innerWidth;
    
    for (let i = 0; i < count; i++) {
      newBubbles.push({
        id: `bubble-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        x: Math.random() * screenWidth,
        size: 20 + Math.random() * 40,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 0.5,
      });
    }

    setBubbles(newBubbles);

    // Cleanup sau 5 giây
    const cleanup = setTimeout(() => {
      setBubbles([]);
    }, 5000);

    return () => clearTimeout(cleanup);
  }, [isActive, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <AnimatePresence>
        {bubbles.map((bubble) => {
          const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
          return (
            <motion.div
              key={bubble.id}
              initial={{
                y: window.innerHeight + bubble.size,
                x: bubble.x,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: -bubble.size,
                x: bubble.x + (Math.random() - 0.5) * 100,
                opacity: [0, 0.8, 0.8, 0],
                scale: [0, 1, 1, 0.8],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full border-2 optimize-animation"
              style={{
                width: bubble.size,
                height: bubble.size,
                backgroundColor: color,
                borderColor: color.replace("0.6", "0.9"),
                boxShadow: `inset 0 0 10px ${color}, 0 0 20px ${color}`,
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

