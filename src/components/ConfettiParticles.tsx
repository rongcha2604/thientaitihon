import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  color: string;
  shape: "square" | "circle";
}

interface Props {
  isActive: boolean;
  count?: number;
}

const confettiColors = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3",
  "#FF8B94", "#A8E6CF", "#FFB347", "#DDA0DD",
];

export default function ConfettiParticles({ isActive, count = 60 }: Props) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }

    // Tạo confetti pieces từ nhiều điểm trên màn hình
    const newPieces: ConfettiPiece[] = [];
    // Giảm số điểm nguồn từ 3 → 2 để tăng performance
    const sources = [
      { x: window.innerWidth / 2, y: 100 },
      { x: window.innerWidth / 2, y: 150 },
    ];

    sources.forEach((source) => {
      for (let i = 0; i < count / sources.length; i++) {
        const angle = (Math.PI * 2 * Math.random()) + Math.PI / 2;
        const speed = 3 + Math.random() * 5;
        
        newPieces.push({
          id: `confetti-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          x: source.x + (Math.random() - 0.5) * 100,
          y: source.y,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
          vy: Math.sin(angle) * speed + Math.random() * 2,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: Math.random() > 0.5 ? "square" : "circle",
        });
      }
    });

    setPieces(newPieces);

    // Cleanup sau 4 giây
    const cleanup = setTimeout(() => {
      setPieces([]);
    }, 4000);

    return () => clearTimeout(cleanup);
  }, [isActive, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              x: piece.x,
              y: piece.y,
              rotate: piece.rotation,
              opacity: 1,
            }}
            animate={{
              x: piece.x + piece.vx * 200,
              y: piece.y + piece.vy * 300,
              rotate: piece.rotation + piece.rotationSpeed * 20,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5 + Math.random() * 0.5, // Giảm từ 2-3 → 1.5-2
              ease: [0.42, 0, 0.58, 1],
            }}
            className="absolute optimize-animation"
            style={{
              width: piece.shape === "square" ? 8 : 10,
              height: piece.shape === "square" ? 8 : 10,
              backgroundColor: piece.color,
              borderRadius: piece.shape === "circle" ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

