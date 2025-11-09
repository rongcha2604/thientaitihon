import React, { useEffect, useState } from 'react';
import Mascot from '../Mascot';

export type MascotState = 'idle' | 'happy' | 'thinking' | 'excited' | 'encouraging' | 'sleep';

interface InteractiveMascotProps {
  state: MascotState;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const InteractiveMascot: React.FC<InteractiveMascotProps> = ({
  state,
  size = 'medium',
  className = '',
}) => {
  const [animation, setAnimation] = useState<string>('');

  useEffect(() => {
    // Set animation based on state
    switch (state) {
      case 'happy':
        setAnimation('animate-bounce');
        setTimeout(() => setAnimation(''), 1000);
        break;
      case 'thinking':
        setAnimation('animate-pulse');
        break;
      case 'excited':
        setAnimation('animate-bounce');
        break;
      case 'encouraging':
        setAnimation('animate-pulse');
        setTimeout(() => setAnimation(''), 2000);
        break;
      case 'sleep':
        setAnimation('animate-pulse opacity-60');
        break;
      default:
        setAnimation('');
    }
  }, [state]);

  const sizeClasses = {
    small: 'w-16 h-16 md:w-20 md:h-20',
    medium: 'w-20 h-20 md:w-24 md:h-24',
    large: 'w-32 h-32 md:w-40 md:h-40',
  };

  const getEmoji = (): string => {
    switch (state) {
      case 'happy':
        return '😊';
      case 'thinking':
        return '🤔';
      case 'excited':
        return '🎉';
      case 'encouraging':
        return '💪';
      case 'sleep':
        return '😴';
      default:
        return '👋';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizeClasses[size]} ${animation} transition-all duration-300`}>
        <Mascot className="w-full h-full" />
      </div>
      {state !== 'idle' && (
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
          {getEmoji()}
        </div>
      )}
    </div>
  );
};

export default InteractiveMascot;

