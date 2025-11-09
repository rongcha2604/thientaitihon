import React from 'react';
import { useDailyChallenge } from '../../contexts/DailyChallengeContext';
import { useToast } from '../common/ToastNotification';
import { playSound } from '../common/SoundEffects';
import Confetti from '../common/Confetti';
import ProgressBar from '../common/ProgressBar';

const DailyChallenge: React.FC = () => {
  const { challenges } = useDailyChallenge();
  const { showToast } = useToast();
  const [confettiActive, setConfettiActive] = React.useState(false);

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  if (challenges.length === 0) return null;

  return (
    <>
      <Confetti active={confettiActive} />
      <div className="bg-[#FDFBF5]/80 p-5 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
        <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">🎯</span>
          Thử thách hôm nay
        </h2>
        
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
    </>
  );
};

export default DailyChallenge;

