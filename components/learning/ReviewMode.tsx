import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { useToast } from '../common/ToastNotification';
import { playSound } from '../common/SoundEffects';
import ProgressBar from '../common/ProgressBar';
import ExplanationModal from './ExplanationModal';
import HintButton from './HintButton';

interface ReviewQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number;
  explanation: string;
  isCorrect: boolean;
  weekId: number;
  subject: string;
}

interface ReviewModeProps {
  questions: ReviewQuestion[];
  onClose: () => void;
  practiceMode?: boolean; // Practice mode (không tính điểm)
}

const ReviewMode: React.FC<ReviewModeProps> = ({ questions, onClose, practiceMode = false }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStars] = useState(100); // Mock stars

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);
    setShowExplanation(true);

    if (isCorrect) {
      setScore(score + 1);
      playSound('correct');
      showToast('Đúng rồi! 🎉', 'success');
    } else {
      playSound('wrong');
      showToast('Sai rồi, cố gắng lần sau nhé!', 'error');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      // Completed all questions
      playSound('success');
      showToast(`Hoàn thành! Điểm: ${score}/${questions.length}`, 'success');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const getHints = (): string[] => {
    if (!currentQuestion) return [];
    return [
      'Hãy đọc kỹ câu hỏi và suy nghĩ từng bước',
      'Thử đếm hoặc tính toán từng phần một',
      `Đáp án đúng là: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
    ];
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5]">
        <div className="text-center">
          <p className="text-2xl font-black text-amber-900 mb-4">Không có câu hỏi để xem lại</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-amber-200 text-amber-900 rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform border-2 border-amber-800/20"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF5] pb-28 md:pb-32">
      {/* Header */}
      <header className="p-4 bg-[#FDFBF5]/80 backdrop-blur-sm sticky top-0 z-10 border-b-2 border-yellow-700/20">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-200 text-amber-900 rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform border-2 border-amber-800/20"
          >
            ← Quay lại
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-amber-800">
              {practiceMode ? 'Luyện tập' : 'Xem lại'} - Câu {currentIndex + 1}/{questions.length}
            </p>
            <p className="text-xs text-amber-700">⭐ {score} điểm</p>
          </div>
          <div className="w-20"></div>
        </div>
        <div className="mt-2">
          <ProgressBar progress={progress} current={currentIndex + 1} total={questions.length} color="purple" animated />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Question Card */}
        <div className="bg-[#FDFBF5]/80 p-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-amber-800 mb-2">
              📚 {currentQuestion.subject} - Tuần {currentQuestion.weekId}
              {currentQuestion.isCorrect ? (
                <span className="ml-2 text-green-600">✅ Đã đúng</span>
              ) : (
                <span className="ml-2 text-red-600">❌ Đã sai</span>
              )}
            </h2>
          </div>

          <div className="bg-yellow-100/40 p-6 rounded-2xl shadow-viet-style-pressed mb-6">
            <h3 className="text-xl font-black text-amber-900 mb-4">❓ Câu hỏi:</h3>
            <p className="text-lg font-bold text-amber-900 leading-relaxed">{currentQuestion.question}</p>
          </div>

          {/* Hint System */}
          {!showResult && (
            <div className="mb-4">
              <HintButton
                hints={getHints()}
                currentStars={currentStars}
                freeHints={practiceMode}
                onHintUsed={() => {}}
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'bg-[#FDFBF5] text-amber-900 shadow-viet-style-raised hover:scale-105';

              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  optionClass = 'bg-green-300 text-green-900 shadow-viet-style-pressed border-2 border-green-700/30';
                } else if (index === currentQuestion.userAnswer && !currentQuestion.isCorrect) {
                  optionClass = 'bg-red-300 text-red-900 shadow-viet-style-pressed border-2 border-red-700/30';
                } else {
                  optionClass = 'bg-gray-200 text-gray-600 shadow-viet-style-pressed opacity-60';
                }
              } else if (selectedAnswer === index) {
                optionClass = 'bg-blue-300 text-blue-900 shadow-viet-style-pressed border-2 border-blue-700/30';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all duration-200 transform active:scale-95 border-2 border-amber-800/20 ${optionClass}`}
                >
                  <span className="font-black mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  {showResult && index === currentQuestion.correctAnswer && (
                    <span className="ml-2 text-xl">✅</span>
                  )}
                  {showResult && index === currentQuestion.userAnswer && !currentQuestion.isCorrect && index !== currentQuestion.correctAnswer && (
                    <span className="ml-2 text-xl">❌ (Bạn đã chọn)</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Modal */}
          <ExplanationModal
            isOpen={showExplanation}
            explanation={currentQuestion.explanation}
            isCorrect={selectedAnswer === currentQuestion.correctAnswer}
            onClose={() => setShowExplanation(false)}
          />

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`flex-1 py-4 rounded-2xl font-black text-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 ${
                  selectedAnswer === null
                    ? 'bg-gray-300 text-gray-600 border-gray-500/30 cursor-not-allowed'
                    : 'bg-red-400 text-white border-red-500/50'
                }`}
              >
                {practiceMode ? 'Kiểm tra' : 'Nộp bài'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-4 rounded-2xl font-black text-xl bg-green-400 text-white shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-green-500/50"
              >
                {currentIndex < questions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành! 🎉'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewMode;

