import React from 'react';

interface DonateButtonProps {
  onClick: () => void;
  className?: string;
}

const DonateButton: React.FC<DonateButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-pink-100/60 text-pink-800 font-semibold py-3 px-4 rounded-2xl shadow-viet-style-raised hover:bg-pink-100/80 active:scale-95 active:shadow-viet-style-pressed transition-all border border-pink-300/40 text-sm flex items-center justify-center gap-2 ${className}`}
    >
      <span className="text-lg">💝</span>
      <span>Ủng hộ dự án</span>
    </button>
  );
};

export default DonateButton;

