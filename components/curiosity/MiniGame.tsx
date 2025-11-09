import React, { useState, useEffect } from 'react';
import { playSound } from '../common/SoundEffects';
import { useToast } from '../common/ToastNotification';
import Confetti from '../common/Confetti';

interface MiniGameProps {
  type: 'memory' | 'puzzle';
  onComplete: (stars: number) => void;
  onClose: () => void;
}

// Memory Game Component
const MemoryGame: React.FC<{ onComplete: (stars: number) => void; onClose: () => void }> = ({
  onComplete,
  onClose,
}) => {
  const { showToast } = useToast();
  const [confettiActive, setConfettiActive] = useState(false);
  
  // Vietnamese-themed pairs
  const pairs = ['🌾', '🌳', '🎋', '🐔', '💧', '🏮'];
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Create shuffled pairs
    const shuffled = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleCardClick = (index: number) => {
    if (flipped.length >= 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        // Match!
        setMatched([...matched, first, second]);
        setFlipped([]);
        playSound('correct');
        
        if (matched.length + 2 === cards.length) {
          // All matched!
          setConfettiActive(true);
          playSound('success');
          showToast('Hoàn thành! Nhận được 5 sao! ⭐', 'success');
          setTimeout(() => {
            onComplete(5);
            onClose();
          }, 2000);
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <>
      <Confetti active={confettiActive} />
      <div className="bg-[#FDFBF5]/80 p-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-amber-900">🧠 Trò chơi trí nhớ</h3>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-amber-800 mb-4">Tìm các cặp giống nhau</p>
        <p className="text-xs text-amber-700 mb-4">Lượt: {moves}</p>
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={isFlipped || flipped.length >= 2}
                className={`aspect-square rounded-2xl font-bold text-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-800/20 ${
                  isFlipped
                    ? 'bg-yellow-200 text-amber-900'
                    : 'bg-blue-200 text-blue-900'
                }`}
              >
                {isFlipped ? card : '?'}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

// Puzzle Game Component (Simple 3x3)
const PuzzleGame: React.FC<{ onComplete: (stars: number) => void; onClose: () => void }> = ({
  onComplete,
  onClose,
}) => {
  const { showToast } = useToast();
  const [confettiActive, setConfettiActive] = useState(false);
  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Create solved puzzle (1-8, empty = 9)
    const solved = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle (simple shuffle)
    const shuffled = [...solved].sort(() => Math.random() - 0.5);
    setPuzzle(shuffled);
  }, []);

  const handleTileClick = (index: number) => {
    if (puzzle[index] === 9) return; // Empty tile

    const emptyIndex = puzzle.indexOf(9);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    // Check if adjacent
    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
      setPuzzle(newPuzzle);
      setMoves(moves + 1);
      playSound('tap');

      // Check if solved
      const isSolved = newPuzzle.every((val, idx) => val === idx + 1 || val === 9);
      if (isSolved) {
        setConfettiActive(true);
        playSound('success');
        showToast('Hoàn thành! Nhận được 5 sao! ⭐', 'success');
        setTimeout(() => {
          onComplete(5);
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <>
      <Confetti active={confettiActive} />
      <div className="bg-[#FDFBF5]/80 p-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-amber-900">🧩 Trò chơi xếp hình</h3>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-amber-800 mb-4">Sắp xếp các số theo thứ tự</p>
        <p className="text-xs text-amber-700 mb-4">Lượt: {moves}</p>
        <div className="grid grid-cols-3 gap-2">
          {puzzle.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              disabled={tile === 9}
              className={`aspect-square rounded-2xl font-black text-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-800/20 ${
                tile === 9
                  ? 'bg-transparent'
                  : 'bg-blue-200 text-blue-900'
              }`}
            >
              {tile === 9 ? '' : tile}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const MiniGame: React.FC<MiniGameProps> = ({ type, onComplete, onClose }) => {
  if (type === 'memory') {
    return <MemoryGame onComplete={onComplete} onClose={onClose} />;
  }
  return <PuzzleGame onComplete={onComplete} onClose={onClose} />;
};

export default MiniGame;

