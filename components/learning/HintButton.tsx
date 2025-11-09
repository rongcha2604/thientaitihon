import React, { useState } from 'react';
import { playSound } from '../common/SoundEffects';
import { useToast } from '../common/ToastNotification';

interface HintButtonProps {
  hints: string[]; // 3 hints: vague → specific → almost answer
  onHintUsed?: (hintIndex: number) => void;
  costPerHint?: number; // Cost in stars (default: 1)
  currentStars?: number; // Current stars available
  freeHints?: boolean; // Free hints (no cost)
}

const HintButton: React.FC<HintButtonProps> = ({
  hints,
  onHintUsed,
  costPerHint = 1,
  currentStars = 0,
  freeHints = false,
}) => {
  const [usedHints, setUsedHints] = useState<boolean[]>(new Array(hints.length).fill(false));
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleHintIconClick = () => {
    setShowMenu(!showMenu);
    playSound('tap');
  };

  // Calculate cost for each hint (tăng dần: 1⭐, 2⭐, 3⭐)
  const getHintCost = (hintIndex: number): number => {
    return (hintIndex + 1) * costPerHint;
  };

  const handleHintClick = (hintIndex: number) => {
    if (usedHints[hintIndex]) {
      // Hint đã dùng → Show hint
      setShowHint(hintIndex);
      setShowMenu(false);
      return;
    }

    // Calculate cost for this hint
    const hintCost = getHintCost(hintIndex);

    // Check cost
    if (!freeHints && currentStars < hintCost) {
      showToast(`Không đủ sao để dùng gợi ý ${hintIndex + 1}! Cần ${hintCost}⭐`, 'warning');
      playSound('wrong');
      return;
    }

    // Use hint
    setUsedHints(prev => {
      const newUsed = [...prev];
      newUsed[hintIndex] = true;
      return newUsed;
    });
    setShowHint(hintIndex);
    setShowMenu(false); // Close menu after selecting hint
    playSound('tap');
    onHintUsed?.(hintIndex);
    
    if (!freeHints) {
      showToast(`Đã dùng gợi ý ${hintIndex + 1} (-${hintCost}⭐)`, 'info');
    } else {
      showToast(`Gợi ý ${hintIndex + 1}`, 'info');
    }
  };

  const getHintIcon = (hintIndex: number): string => {
    if (hintIndex === 0) return '💡';
    if (hintIndex === 1) return '💡💡';
    return '💡💡💡';
  };

  const getHintLabel = (hintIndex: number): string => {
    if (hintIndex === 0) return 'Gợi ý 1';
    if (hintIndex === 1) return 'Gợi ý 2';
    return 'Gợi ý 3';
  };

  return (
    <div className="space-y-4 relative">
      {/* Hint Icon Button - Compact */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleHintIconClick}
          className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-blue-200 text-blue-900 rounded-xl font-bold text-sm md:text-base shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-blue-700/30"
        >
          <span className="text-xl md:text-2xl">💡</span>
          <span>Gợi ý</span>
          {showMenu ? (
            <span className="text-xs">▼</span>
          ) : (
            <span className="text-xs">▶</span>
          )}
        </button>
      </div>

      {/* Dropdown Menu - Show when menu is open */}
      {showMenu && (
        <div className="bg-white rounded-2xl shadow-viet-style-raised border-2 border-blue-700/30 p-3 md:p-4 space-y-2 md:space-y-3 animate-scale-in">
          {hints.map((hint, index) => {
            const hintCost = getHintCost(index);
            const canAfford = freeHints || currentStars >= hintCost || usedHints[index];
            
            return (
              <button
                key={index}
                onClick={() => handleHintClick(index)}
                disabled={!canAfford}
                className={`w-full px-4 py-3 md:px-5 md:py-3.5 rounded-xl font-bold text-sm md:text-base shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-800/20 text-left ${
                  usedHints[index]
                    ? 'bg-yellow-300 text-amber-900 border-yellow-700/30'
                    : !canAfford
                    ? 'bg-gray-300 text-gray-600 border-gray-500/30 cursor-not-allowed opacity-60'
                    : 'bg-blue-200 text-blue-900 border-blue-700/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl">{getHintIcon(index)}</span>
                    <span>{getHintLabel(index)}</span>
                  </div>
                  {!freeHints && !usedHints[index] && (
                    <span className="text-xs md:text-sm">(-{hintCost}⭐)</span>
                  )}
                  {usedHints[index] && (
                    <span className="text-xs md:text-sm">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Show current hint content */}
      {showHint !== null && usedHints[showHint] && (
        <div className="bg-blue-100/50 p-4 md:p-5 rounded-2xl shadow-viet-style-pressed border-2 border-blue-700/30 animate-scale-in">
          <div className="flex items-start space-x-3 md:space-x-4">
            <span className="text-2xl">{getHintIcon(showHint)}</span>
            <div className="flex-1">
              <p className="font-bold text-blue-900 mb-2 text-sm md:text-base">{getHintLabel(showHint)}</p>
              <p className="text-sm md:text-base text-blue-800 leading-relaxed">{hints[showHint]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HintButton;

