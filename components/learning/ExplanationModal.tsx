import React from 'react';

interface ExplanationModalProps {
  isOpen: boolean;
  explanation: string;
  isCorrect: boolean;
  onClose: () => void;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  explanation,
  isCorrect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none p-4">
        <div
          className={`pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 shadow-viet-style-raised border-4 border-amber-800/30 max-w-md w-full animate-slide-up ${
            isCorrect ? 'border-green-700/30' : 'border-blue-700/30'
          }`}
          style={{
            animation: 'slideUp 0.4s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">{isCorrect ? '✅' : '💡'}</span>
              <h3 className="text-xl font-black text-amber-900">
                {isCorrect ? 'Giải thích đáp án' : 'Xem lại bài này'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-2xl hover:scale-110 transition-transform text-amber-800"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className={`p-4 rounded-2xl shadow-viet-style-pressed border-2 ${
            isCorrect ? 'bg-green-100/50 border-green-700/30' : 'bg-blue-100/50 border-blue-700/30'
          }`}>
            <p className="font-bold text-amber-900 mb-2">💡 Giải thích:</p>
            <p className="text-amber-800 leading-relaxed">{explanation}</p>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-amber-200 text-amber-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform border-2 border-amber-800/20"
            >
              Đã hiểu! 👍
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplanationModal;

