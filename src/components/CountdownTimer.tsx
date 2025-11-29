import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  expiryDate: number; // timestamp in milliseconds
  onExpired?: () => void;
}

export default function CountdownTimer({ expiryDate, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(expiryDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiryDate - Date.now();
      
      if (remaining <= 0) {
        setTimeLeft(0);
        if (onExpired) {
          onExpired();
        }
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [expiryDate, onExpired]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (timeLeft <= 0) {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        ⏰ Đã hết hạn
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-sm font-medium">⏰ Còn lại:</span>
        <div className="flex items-center gap-1 font-mono font-bold">
          <span className="bg-white/20 px-2 py-1 rounded">{String(days).padStart(2, "0")}</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-1 rounded">{String(hours).padStart(2, "0")}</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-1 rounded">{String(minutes).padStart(2, "0")}</span>
          <span>:</span>
          <motion.span
            key={seconds}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="bg-white/20 px-2 py-1 rounded"
          >
            {String(seconds).padStart(2, "0")}
          </motion.span>
        </div>
      </div>
      <div className="text-xs mt-1 text-center opacity-90">
        Hết hạn: {formatDate(expiryDate)}
      </div>
    </motion.div>
  );
}

