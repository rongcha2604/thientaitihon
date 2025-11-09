import React, { useState } from 'react';
import { playSound } from './SoundEffects';

interface PINEntryModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onVerify: (pin: string) => void;
  onCancel: () => void;
  maxLength?: number; // Default: 4
}

const PINEntryModal: React.FC<PINEntryModalProps> = ({
  isOpen,
  title,
  description,
  onVerify,
  onCancel,
  maxLength = 4,
}) => {
  const [pin, setPin] = useState<string>('');

  if (!isOpen) return null;

  const handleNumberClick = (num: number) => {
    if (pin.length < maxLength) {
      const newPin = pin + num.toString();
      setPin(newPin);
      playSound('tap');
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      playSound('tap');
    }
  };

  const handleVerify = () => {
    if (pin.length === maxLength) {
      onVerify(pin);
      setPin(''); // Reset PIN after verify
    }
  };

  const handleCancel = () => {
    setPin('');
    onCancel();
  };

  // Auto verify when PIN is complete
  React.useEffect(() => {
    if (pin.length === maxLength) {
      const timer = setTimeout(() => {
        if (pin.length === maxLength) {
          onVerify(pin);
          setPin(''); // Reset PIN after verify
        }
      }, 300); // Small delay for UX
      return () => clearTimeout(timer);
    }
  }, [pin, maxLength, onVerify]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={handleCancel}
        style={{
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
        <div
          className="pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-viet-style-raised border-4 border-amber-800/30 max-w-md w-full animate-slide-up"
          style={{
            animation: 'slideUp 0.4s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-amber-900 mb-2">{title}</h2>
            <p className="text-sm md:text-base text-amber-800">{description}</p>
          </div>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 md:gap-4 mb-6">
            {Array.from({ length: maxLength }).map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center font-black text-2xl md:text-3xl transition-all ${
                  index < pin.length
                    ? 'bg-amber-200 border-amber-700 text-amber-900 shadow-viet-style-pressed'
                    : 'bg-yellow-100/50 border-amber-300/50 text-amber-300 shadow-viet-style-raised'
                }`}
              >
                {index < pin.length ? '●' : ''}
              </div>
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="py-4 md:py-5 bg-amber-200 text-amber-900 rounded-2xl font-black text-xl md:text-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-700/30"
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="py-4 md:py-5 bg-red-200 text-red-900 rounded-2xl font-black text-xl md:text-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-red-700/30"
            >
              ←
            </button>
            <button
              onClick={() => handleNumberClick(0)}
              className="py-4 md:py-5 bg-amber-200 text-amber-900 rounded-2xl font-black text-xl md:text-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-700/30"
            >
              0
            </button>
            <button
              onClick={handleVerify}
              disabled={pin.length !== maxLength}
              className={`py-4 md:py-5 rounded-2xl font-black text-xl md:text-2xl shadow-viet-style-raised transition-all border-2 ${
                pin.length === maxLength
                  ? 'bg-green-200 text-green-900 border-green-700/30 hover:scale-105 active:scale-95'
                  : 'bg-gray-200 text-gray-500 border-gray-400/30 cursor-not-allowed opacity-50'
              }`}
            >
              ✓
            </button>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="w-full py-3 md:py-4 bg-red-200 text-red-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-red-700/30 text-sm md:text-base"
          >
            ❌ Hủy
          </button>
        </div>
      </div>
    </>
  );
};

export default PINEntryModal;

