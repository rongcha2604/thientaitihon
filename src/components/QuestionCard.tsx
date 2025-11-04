import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { Question } from "../types";
import Fireworks from "./Fireworks";
import ConfettiParticles from "./ConfettiParticles";
import Bubbles from "./Bubbles";
import Sparkles from "./Sparkles";

interface Props {
  q: Question;
  picked: number | null;
  onPick: (i: number) => void;
  showResult: boolean;
  isCorrect: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
  isAutoLoading?: boolean;
  correctIdx: number;
}

export default function QuestionCard({
  q,
  picked,
  onPick,
  showResult,
  isCorrect,
  onNext,
  isLastQuestion,
  isAutoLoading = false,
  correctIdx
}: Props) {
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBubbles, setShowBubbles] = useState(false);
  const [sparklePos, setSparklePos] = useState<{ x: number; y: number } | null>(null);
  const correctButtonRef = useRef<HTMLButtonElement>(null);

  // Trigger effects khi trả lời đúng
  useEffect(() => {
    if (showResult && isCorrect) {
      setShowFireworks(true);
      setShowConfetti(true);
      setShowBubbles(true);
      
      // Get position của button đúng để show sparkles
      if (correctButtonRef.current) {
        const rect = correctButtonRef.current.getBoundingClientRect();
        setSparklePos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }

      // Cleanup sau effects
      const cleanup = setTimeout(() => {
        setShowFireworks(false);
        setShowConfetti(false);
        setShowBubbles(false);
        setSparklePos(null);
      }, 3000);

      return () => clearTimeout(cleanup);
    } else {
      setShowFireworks(false);
      setShowConfetti(false);
      setShowBubbles(false);
      setSparklePos(null);
    }
  }, [showResult, isCorrect]);

  return (
    <>
      {/* Effects - Lazy loaded for performance */}
      {showFireworks && <Fireworks isActive={showFireworks} />}
      {showConfetti && <ConfettiParticles isActive={showConfetti} count={60} />}
      {showBubbles && <Bubbles isActive={showBubbles} count={15} />}
      {sparklePos && (
        <Sparkles
          isActive={true}
          x={sparklePos.x}
          y={sparklePos.y}
          count={20}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border-2 border-gray-200 bg-white p-6 md:p-8 w-full shadow-lg card-hover relative overflow-hidden"
      >
      <div className="text-left text-lg font-semibold mb-4 text-gray-800">
        {q.question}
      </div>
      
      <div className="grid gap-3">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrectAnswer = i === correctIdx;
          let stateClass = "border-2 border-gray-300 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-blue-100 hover:border-blue-300";
          
          if (showResult) {
            if (isCorrectAnswer) {
              stateClass = "border-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-200";
            } else if (isPicked && !isCorrect) {
              stateClass = "border-2 border-red-400 bg-gradient-to-r from-red-50 to-pink-50";
            }
          } else if (isPicked) {
            stateClass = "border-3 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md";
          }
          
          return (
            <motion.button
              key={i}
              ref={isCorrectAnswer && showResult ? correctButtonRef : undefined}
              disabled={showResult}
              onClick={() => onPick(i)}
              whileHover={!showResult ? { scale: 1.03, rotateZ: 0.5 } : {}}
              whileTap={!showResult ? { scale: 0.97 } : {}}
              animate={
                showResult && isCorrectAnswer
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0px rgba(34, 197, 94, 0)",
                        "0 0 30px rgba(34, 197, 94, 0.6)",
                        "0 0 0px rgba(34, 197, 94, 0)",
                      ],
                    }
                  : {}
              }
              transition={
                showResult && isCorrectAnswer
                  ? {
                      scale: {
                        duration: 0.6,
                        repeat: 2,
                        ease: "easeInOut",
                      },
                      boxShadow: {
                        duration: 0.6,
                        repeat: 2,
                        ease: "easeInOut",
                      },
                    }
                  : {}
              }
              className={`text-left rounded-xl px-4 py-3 ${stateClass} transition-all ripple ${
                showResult ? "cursor-default" : "cursor-pointer"
              } relative overflow-hidden`}
            >
              {showResult && isCorrectAnswer && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ opacity: 0.3 }}
                />
              )}
              <span className="font-bold mr-3 text-kid-primary text-lg">
                ({String.fromCharCode(65 + i)})
              </span>
              <span className="text-gray-800 font-medium">{opt}</span>
              {showResult && isCorrectAnswer && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute right-4 text-3xl"
                >
                  ✨
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {isCorrect ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.3, stiffness: 200 }}
                className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-4 border-green-500 rounded-xl p-5 text-green-800 shadow-xl shadow-green-200 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ opacity: 0.3 }}
                />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <motion.span
                    animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                    className="text-4xl"
                  >
                    ✅
                  </motion.span>
                  <span className="text-2xl font-bold">Chính xác! Giỏi lắm!</span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-base font-semibold relative z-10 mb-2"
                >
                  Tiếp tục phát huy nhen! ✨🎉🔥
                </motion.div>
                {isAutoLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-sm text-green-600 font-medium relative z-10 text-center"
                  >
                    Tự động chuyển sang câu tiếp theo...
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="bg-red-50 border-2 border-red-500 rounded-xl p-4 md:p-5 text-red-800 animate-shake"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">❌</span>
                  <span className="text-xl font-bold">Chưa đúng rồi…</span>
                </div>
                <div className="space-y-3 text-sm mb-4">
                  <div>
                    <span className="font-semibold">Đáp án đúng:</span>{" "}
                    <span className="bg-green-100 px-2 py-1 rounded">
                      {q.options[correctIdx]}
                    </span>
                  </div>
                  {q.explanation && (
                    <div>
                      <span className="font-semibold">Giải thích:</span> {q.explanation}
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={onNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full"
                >
                  {isLastQuestion ? "🎉 Xem kết quả" : "✅ Đã hiểu"}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </>
  );
}
