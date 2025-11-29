import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { getAchievementBadge, formatTime } from "../lib/utils";

interface Props {
  isOpen: boolean;
  score: number;
  total: number;
  timeSpent?: number;
  points?: number;
  onRestart: () => void;
  onNewQuiz: () => void;
  onClose: () => void;
}

export default function ResultsModal({
  isOpen,
  score,
  total,
  timeSpent,
  points = 0,
  onRestart,
  onNewQuiz,
  onClose,
}: Props) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const badge = getAchievementBadge(score, total);
  const isExcellent = percentage >= 80;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isExcellent && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
            />
          )}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-4"
                  >
                    {badge}
                  </motion.div>
                )}

                <h2 className="text-3xl font-bold mb-4 text-kid-primary">
                  Hoàn thành! 🎉
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Điểm số:</span>
                    <span className="text-2xl font-bold text-kid-primary">
                      {score}/{total}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Phần trăm:</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {percentage}%
                    </span>
                  </div>

                  {timeSpent !== undefined && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Thời gian:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatTime(timeSpent)}
                      </span>
                    </div>
                  )}

                  {points > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Xu tích lũy:</span>
                      <span className="text-2xl font-bold text-yellow-600">
                        💰 {points}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={onRestart}
                    className="btn-primary w-full"
                  >
                    🔄 Làm lại
                  </button>
                  <button
                    onClick={onNewQuiz}
                    className="btn-primary w-full"
                  >
                    📚 Chọn bài khác
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

