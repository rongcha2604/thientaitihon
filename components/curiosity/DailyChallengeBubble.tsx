import React, { useState } from 'react';
import { useDailyChallenge } from '../../contexts/DailyChallengeContext';
import { useToast } from '../common/ToastNotification';
import { playSound } from '../common/SoundEffects';
import Confetti from '../common/Confetti';
import ProgressBar from '../common/ProgressBar';

const DailyChallengeBubble: React.FC = () => {
  const { challenges } = useDailyChallenge();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);
  const uncompletedCount = activeChallenges.length;

  const handleClick = () => {
    playSound('tap');
    setIsModalOpen(true);
  };

  // Don't show if all challenges completed
  if (challenges.length === 0 || uncompletedCount === 0) {
    return null;
  }

  return (
    <>
      <Confetti active={confettiActive} />
      
      {/* Notification Bubble */}
      <button
        onClick={handleClick}
        className="fixed top-20 right-4 z-50 group"
        aria-label="Xem thử thách hôm nay"
      >
        <div className="relative">
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-75 animate-pulse group-hover:opacity-100 transition-opacity"></div>
          
          {/* Main bubble */}
          <div className="relative bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full p-4 shadow-viet-style-raised border-4 border-amber-800/30 hover:scale-110 active:scale-95 transition-all duration-200 animate-bounce-slow">
            <div className="text-4xl">🎯</div>
            
            {/* Badge với số thách thức chưa hoàn thành */}
            {uncompletedCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-sm shadow-lg border-2 border-white animate-pulse">
                {uncompletedCount}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 shadow-viet-style-raised border-4 border-yellow-700/30 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🎯</span>
                  <h2 className="text-xl font-black text-amber-900">Thử thách hôm nay</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-2xl hover:scale-110 transition-transform text-amber-800"
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Challenges List */}
              <div className="space-y-3">
                {activeChallenges.map(challenge => {
                  const progress = (challenge.progress / challenge.target) * 100;
                  return (
                    <div
                      key={challenge.id}
                      className="bg-yellow-100/40 p-4 rounded-2xl shadow-viet-style-pressed border-2 border-yellow-700/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-black text-amber-900 mb-1">{challenge.title}</h3>
                          <p className="text-sm text-amber-800 mb-2">{challenge.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-amber-700">
                            +{challenge.reward.stars}⭐ +{challenge.reward.rice}🌾
                          </p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <ProgressBar
                          progress={progress}
                          current={challenge.progress}
                          total={challenge.target}
                          color="yellow"
                          animated
                        />
                      </div>
                      <p className="text-xs font-semibold text-amber-700 text-center">
                        {challenge.progress}/{challenge.target}
                      </p>
                    </div>
                  );
                })}

                {completedChallenges.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-yellow-700/20">
                    <p className="text-sm font-bold text-green-800 mb-2">✅ Hoàn thành:</p>
                    {completedChallenges.map(challenge => (
                      <div
                        key={challenge.id}
                        className="bg-green-100/50 p-3 rounded-xl mb-2 flex items-center justify-between"
                      >
                        <span className="font-bold text-green-900 text-sm">{challenge.title}</span>
                        <span className="text-xs text-green-700">
                          +{challenge.reward.stars}⭐ +{challenge.reward.rice}🌾
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DailyChallengeBubble;

