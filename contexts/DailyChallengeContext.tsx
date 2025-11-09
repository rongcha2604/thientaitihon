import React, { createContext, useContext, useState, useEffect } from 'react';
import { awardCoins } from '../src/lib/api/coins';
import { useAuth } from '../src/contexts/AuthContext';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'correct' | 'complete' | 'score';
  target: number;
  reward: {
    stars: number;
    rice: number;
    item?: string; // Album item ID
  };
  progress: number;
  completed: boolean;
  completedAt?: string;
}

interface DailyChallengeContextType {
  challenges: DailyChallenge[];
  completeChallenge: (challengeId: string) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  resetDaily: () => void;
}

const DailyChallengeContext = createContext<DailyChallengeContextType | undefined>(undefined);

const STORAGE_KEY = 'daily_challenges';
const LAST_RESET_KEY = 'daily_challenges_last_reset';

export const DailyChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const { user } = useAuth();

  // Load challenges from localStorage
  useEffect(() => {
    const loadChallenges = () => {
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      const today = new Date().toDateString();

      // Reset if new day
      if (lastReset !== today) {
        generateDailyChallenges();
        localStorage.setItem(LAST_RESET_KEY, today);
        return;
      }

      // Load from storage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setChallenges(parsed);
        } catch (e) {
          generateDailyChallenges();
        }
      } else {
        generateDailyChallenges();
      }
    };

    loadChallenges();
  }, []);

  // Save to localStorage when challenges change
  useEffect(() => {
    if (challenges.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    }
  }, [challenges]);

  const generateDailyChallenges = () => {
    const today = new Date();
    const challenges: DailyChallenge[] = [
      {
        id: 'challenge-1',
        title: 'Làm đúng 5 câu Toán',
        description: 'Trả lời đúng 5 câu Toán trong hôm nay',
        type: 'correct',
        target: 5,
        reward: {
          stars: 5,
          rice: 10,
        },
        progress: 0,
        completed: false,
      },
      {
        id: 'challenge-2',
        title: 'Hoàn thành 1 tuần học',
        description: 'Hoàn thành tất cả câu hỏi trong 1 tuần',
        type: 'complete',
        target: 1,
        reward: {
          stars: 10,
          rice: 20,
          item: 'special-badge',
        },
        progress: 0,
        completed: false,
      },
      {
        id: 'challenge-3',
        title: 'Đạt 80% trong 1 bài tập',
        description: 'Đạt ít nhất 80% điểm trong 1 bài tập',
        type: 'score',
        target: 80,
        reward: {
          stars: 8,
          rice: 15,
        },
        progress: 0,
        completed: false,
      },
    ];

    setChallenges(challenges);
  };

  const completeChallenge = async (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    // Tính coins từ reward (1 star = 1 coin, 1 rice = 1 coin)
    const coinsToAward = challenge.reward.stars + challenge.reward.rice;

    // Tích lũy coins
    if (coinsToAward > 0) {
      try {
        // Thử gọi API nếu có backend và user
        if (user?.id) {
          try {
            await awardCoins({
              amount: coinsToAward,
              reason: `Hoàn thành thử thách: ${challenge.title}`,
              metadata: { challengeId, challengeType: challenge.type },
            });
          } catch (error) {
            // Nếu backend fail, fallback về localStorage
            console.log('Backend not available, using localStorage');
            const currentCoins = parseInt(localStorage.getItem('user_coins') || '0', 10);
            const newCoins = currentCoins + coinsToAward;
            localStorage.setItem('user_coins', newCoins.toString());
          }
        } else {
          // Không có user → dùng localStorage
          const currentCoins = parseInt(localStorage.getItem('user_coins') || '0', 10);
          const newCoins = currentCoins + coinsToAward;
          localStorage.setItem('user_coins', newCoins.toString());
        }
      } catch (error) {
        console.error('Error awarding coins:', error);
      }
    }

    // Cập nhật challenge status
    setChallenges(prev =>
      prev.map(c =>
        c.id === challengeId
          ? {
              ...c,
              completed: true,
              completedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const updateProgress = async (challengeId: string, progress: number) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === challengeId) {
          const newProgress = Math.min(progress, challenge.target);
          const completed = newProgress >= challenge.target && !challenge.completed;
          
          // Nếu challenge vừa hoàn thành → tích lũy coins
          if (completed && !challenge.completed) {
            const coinsToAward = challenge.reward.stars + challenge.reward.rice;
            
            if (coinsToAward > 0) {
              // Tích lũy coins
              try {
                if (user?.id) {
                  awardCoins({
                    amount: coinsToAward,
                    reason: `Hoàn thành thử thách: ${challenge.title}`,
                    metadata: { challengeId, challengeType: challenge.type },
                  }).catch(() => {
                    // Fallback về localStorage nếu backend fail
                    const currentCoins = parseInt(localStorage.getItem('user_coins') || '0', 10);
                    const newCoins = currentCoins + coinsToAward;
                    localStorage.setItem('user_coins', newCoins.toString());
                  });
                } else {
                  // Không có user → dùng localStorage
                  const currentCoins = parseInt(localStorage.getItem('user_coins') || '0', 10);
                  const newCoins = currentCoins + coinsToAward;
                  localStorage.setItem('user_coins', newCoins.toString());
                }
              } catch (error) {
                console.error('Error awarding coins:', error);
              }
            }
          }
          
          return {
            ...challenge,
            progress: newProgress,
            completed: completed || challenge.completed,
            completedAt: completed ? new Date().toISOString() : challenge.completedAt,
          };
        }
        return challenge;
      })
    );
  };

  const resetDaily = () => {
    generateDailyChallenges();
    localStorage.setItem(LAST_RESET_KEY, new Date().toDateString());
  };

  return (
    <DailyChallengeContext.Provider
      value={{
        challenges,
        completeChallenge,
        updateProgress,
        resetDaily,
      }}
    >
      {children}
    </DailyChallengeContext.Provider>
  );
};

export const useDailyChallenge = () => {
  const context = useContext(DailyChallengeContext);
  if (!context) {
    throw new Error('useDailyChallenge must be used within DailyChallengeProvider');
  }
  return context;
};

