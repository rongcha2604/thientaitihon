import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { playSound } from '../common/SoundEffects';
import { useToast } from '../common/ToastNotification';
import ProgressBar from '../common/ProgressBar';
import ExplanationModal from '../learning/ExplanationModal';
import DiscoveryCard from '../curiosity/DiscoveryCard';
import InteractiveMascot from '../interactive/InteractiveMascot';
import { useDailyChallenge } from '../../contexts/DailyChallengeContext';
import { useAdaptiveDifficulty } from '../../contexts/AdaptiveDifficultyContext';
import AdaptiveDifficulty from '../learning/AdaptiveDifficulty';
import SuccessCelebration from '../common/SuccessCelebration';
import { saveExerciseProgress, getExerciseProgress, clearExerciseProgress } from '../../src/lib/storage/exerciseProgress';
import { awardCoins as awardCoinsAPI } from '../../src/lib/api/coins';
import { getStarsForGrade, setStarsForGrade, getCoinsForGrade, setCoinsForGrade, addStarsForGrade, addCoinsForGrade } from '../../src/lib/storage/gradeStorage';

// Wrapper function để gọi awardCoins với error handling
const awardCoins = async (data: { amount: number; reason: string; metadata?: Record<string, any> }) => {
  try {
    return await awardCoinsAPI(data);
  } catch (error) {
    console.error('Error calling awardCoins API:', error);
    throw error; // Throw để trigger fallback trong code
  }
};

// Helper function để award stars (localStorage only) - theo lớp
const awardStarsLocal = (amount: number, grade: number) => {
  return addStarsForGrade(grade, amount);
};

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl: string | null;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

interface WeekData {
  week: number;
  subject: string;
  grade: number;
  bookSeries: string;
  lessons: Lesson[];
}

interface ExercisePageProps {
  weekId: number;
  bookSeries: string;
  grade: number;
  subject: string;
  onBack: () => void;
  examType?: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH'; // Optional: để phân biệt học chính vs ôn tập
}

const ExercisePage: React.FC<ExercisePageProps> = ({ weekId, bookSeries, grade, subject, onBack, examType }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { updateProgress } = useDailyChallenge();
  const { updatePerformance } = useAdaptiveDifficulty();
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'thinking' | 'excited' | 'encouraging' | 'sleep'>('thinking');
  const [currentStars, setCurrentStars] = useState(100); // Mock stars for now
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

  // Reset hasRestoredProgress when exercise changes
  useEffect(() => {
    setHasRestoredProgress(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCompletedQuestions([]);
    setCorrectStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setShowCelebration(false);
  }, [weekId, bookSeries, grade, subject]);

  // Helper function để load questions từ nhiều tuần cho ôn tập
  const loadExamQuestions = async (
    examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH',
    bookSeries: string,
    grade: number
  ): Promise<WeekData> => {
    // Map book series name to folder name
    const bookSeriesMap: { [key: string]: string } = {
      'Kết nối tri thức': 'ket-noi-tri-thuc',
      'Chân trời sáng tạo': 'chan-troi-sang-tao',
      'Phát triển năng lực': 'cung-hoc',
      'Bình đẳng & Dân chủ': 'vi-su-binh-dang',
      'ket-noi-tri-thuc': 'ket-noi-tri-thuc',
      'chan-troi-sang-tao': 'chan-troi-sang-tao',
      'cung-hoc': 'cung-hoc',
      'vi-su-binh-dang': 'vi-su-binh-dang',
    };

    const subjectMap: { [key: string]: string } = {
      'Toán': 'math',
      'Tiếng Việt': 'vietnamese',
      'math': 'math',
      'vietnamese': 'vietnamese',
    };

    const bookSeriesFolder = bookSeriesMap[bookSeries] || 'ket-noi-tri-thuc';
    const subjects = ['math', 'vietnamese']; // 2 môn: Toán, Tiếng Việt

    // Xác định range tuần dựa trên examType
    let weekRange: number[];
    if (examType === 'THI_HUONG') {
      weekRange = Array.from({ length: 18 }, (_, i) => i + 1); // Tuần 1-18
    } else if (examType === 'THI_HOI') {
      weekRange = Array.from({ length: 17 }, (_, i) => i + 19); // Tuần 19-35
    } else {
      // THI ĐÌNH: Tất cả tuần (1-35)
      weekRange = Array.from({ length: 35 }, (_, i) => i + 1);
    }

    // Load tất cả questions từ các tuần và môn
    const allQuestions: { subject: string; questions: Question[] }[] = [];

    for (const subjectFolder of subjects) {
      const subjectQuestions: Question[] = [];

      // Load questions từ tất cả tuần trong range
      for (const week of weekRange) {
        try {
          const dataPath = `/data/questions/${bookSeriesFolder}/grade-${grade}/${subjectFolder}/week-${week}.json`;
          const response = await fetch(dataPath);

          if (response.ok) {
            const weekData: WeekData = await response.json();
            // Lấy tất cả questions từ tất cả lessons
            weekData.lessons?.forEach(lesson => {
              lesson.questions?.forEach(q => {
                subjectQuestions.push({
                  ...q,
                  id: `${subjectFolder}-week-${week}-${q.id}`, // Unique ID
                });
              });
            });
          }
        } catch (error) {
          console.warn(`Failed to load week ${week} for ${subjectFolder}:`, error);
        }
      }

      // Lấy ngẫu nhiên 10 câu từ môn này
      const shuffled = subjectQuestions.sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, 10);
      allQuestions.push({ subject: subjectFolder, questions: selectedQuestions });
    }

    // Xáo trộn câu hỏi xen kẽ giữa 3 môn
    // Gộp tất cả questions lại và xáo trộn ngẫu nhiên
    const allMixedQuestions: Question[] = [];
    allQuestions.forEach(({ questions }) => {
      allMixedQuestions.push(...questions);
    });

    // Xáo trộn ngẫu nhiên để đảm bảo xen kẽ giữa 3 môn
    const finalQuestions = allMixedQuestions.sort(() => Math.random() - 0.5);

    // Tạo WeekData structure
    const examData: WeekData = {
      week: weekId,
      subject: 'mixed', // Mixed subjects
      grade: grade,
      bookSeries: bookSeries,
      lessons: [
        {
          id: `exam-${examType}`,
          title: examType === 'THI_HUONG' ? 'THI HƯƠNG' : examType === 'THI_HOI' ? 'THI HỘI' : 'THI ĐÌNH',
          duration: examType === 'THI_DINH' ? 30 : 15, // 30 phút cho THI ĐÌNH, 15 phút cho THI HƯƠNG/HỘI
          questions: finalQuestions,
        },
      ],
    };

    return examData;
  };

  // Load week data and restore progress
  useEffect(() => {
    const loadWeekData = async () => {
      try {
        // Nếu là ôn tập → Load questions từ nhiều tuần
        if (examType) {
          const examData = await loadExamQuestions(examType, bookSeries, grade);
          setWeekData(examData);
          return; // Không restore progress cho ôn tập
        }

        // Map book series name to folder name
        const bookSeriesMap: { [key: string]: string } = {
          'Kết nối tri thức': 'ket-noi-tri-thuc',
          'Chân trời sáng tạo': 'chan-troi-sang-tao',
          'Phát triển năng lực': 'cung-hoc',
          'Bình đẳng & Dân chủ': 'vi-su-binh-dang',
        };

        const subjectMap: { [key: string]: string } = {
          'Toán': 'math',
          'Tiếng Việt': 'vietnamese',
        };

        const bookSeriesFolder = bookSeriesMap[bookSeries] || 'ket-noi-tri-thuc';
        const subjectFolder = subjectMap[subject] || 'math';

        // Use fetch to load JSON from public folder (works in both dev and production/APK)
        const dataPath = `/data/questions/${bookSeriesFolder}/grade-${grade}/${subjectFolder}/week-${weekId}.json`;
        const response = await fetch(dataPath);

        if (!response.ok) {
          throw new Error(`Failed to load week data: ${response.statusText}`);
        }

        const data: WeekData = await response.json();
        setWeekData(data);

        // Restore progress from localStorage (only once)
        if (!hasRestoredProgress) {
          const userId = user?.id || null;
          const savedProgress = getExerciseProgress(userId, weekId, bookSeries, grade, subject);
          if (savedProgress) {
            const totalQuestions = data.lessons[0]?.questions.length || 0;
            const completedQuestions = savedProgress.completedQuestions || [];
            // Mục tiêu: Hoàn thành = làm đúng TẤT CẢ câu hỏi trong tuần
            // Với Toán/Tiếng Việt: Tất cả câu đúng
            const targetCorrectAnswers = totalQuestions;
            
            // Chỉ restore nếu chưa hoàn thành (completedQuestions.length < targetCorrectAnswers)
            // Hoàn thành = làm đúng tất cả câu hỏi
            if (completedQuestions.length < targetCorrectAnswers) {
              // Restore về câu đầu tiên chưa làm đúng (dựa vào completedQuestions)
              // KHÔNG restore về currentQuestionIndex đã lưu (có thể là câu đã làm sai)
              let firstUncompletedIndex = 0;
              for (let i = 0; i < totalQuestions; i++) {
                if (!completedQuestions.includes(i)) {
                  firstUncompletedIndex = i;
                  break;
                }
              }
              
              setCurrentQuestionIndex(firstUncompletedIndex);
              setScore(savedProgress.score || 0);
              setCompletedQuestions(completedQuestions);
              setCorrectStreak(savedProgress.correctStreak || 0);
              setHasRestoredProgress(true);
              
              // Toast message hiển thị đúng với progress: Câu X/20 (X = completedQuestions.length + 1)
              // Nếu làm đúng 5 câu (index 0-4), completedQuestions.length = 5, firstUncompletedIndex = 5
              // Toast: "Đã khôi phục tiến độ: Câu 6/20" (firstUncompletedIndex + 1 = 6)
              // Progress bar: 5/20 (completedQuestions.length = 5)
              // Đây là đúng vì progress bar hiển thị số câu ĐÃ LÀM ĐÚNG, còn toast hiển thị câu SẼ LÀM TIẾP
              const targetCorrectAnswers = totalQuestions;
              showToast(`Đã khôi phục tiến độ: Câu ${firstUncompletedIndex + 1}/${totalQuestions} (Đã làm đúng ${completedQuestions.length}/${targetCorrectAnswers})`, 'info');
            } else {
              // Đã hoàn thành (>= 20 câu đúng) → GIỮ NGUYÊN progress (KHÔNG clear!)
              // Progress đã hoàn thành phải được giữ lại để unlock tuần tiếp theo
              // Cho phép làm lại nhưng vẫn giữ progress cũ (để unlock tuần tiếp theo)
              setCurrentQuestionIndex(0); // Bắt đầu từ câu đầu tiên khi làm lại
              setScore(completedQuestions.length); // Giữ score = số câu đúng
              setCompletedQuestions(completedQuestions); // Giữ completedQuestions để unlock tuần tiếp theo
              setCorrectStreak(0); // Reset streak khi làm lại
              setHasRestoredProgress(true);
              
              // Xóa flag reward để có thể nhận coins lại khi làm lại và hoàn thành lại
              const rewardKey = `week-${weekId}-${bookSeries}-${grade}-${subject}-rewarded`;
              localStorage.removeItem(rewardKey);
              
              const targetCorrectAnswers = totalQuestions;
              showToast(`Tuần này đã hoàn thành! (Đã làm đúng ${completedQuestions.length}/${targetCorrectAnswers} câu). Bạn có thể làm lại nếu muốn.`, 'success');
            }
          }
        }
      } catch (error) {
        console.error('Error loading week data:', error);
        showToast('Không thể tải dữ liệu tuần học', 'error');
      }
    };

    loadWeekData();
  }, [weekId, bookSeries, grade, subject, examType, showToast]);

  const currentLesson = weekData?.lessons[0]; // Use first lesson for now
  const currentQuestion = currentLesson?.questions[currentQuestionIndex];
  const totalQuestions = currentLesson?.questions.length || 0;
  // Progress chỉ tính theo số câu ĐÚNG (completedQuestions.length), không phải số câu đã làm
  const progress = totalQuestions > 0 ? Math.round((completedQuestions.length / totalQuestions) * 100) : 0;
  
  // Mục tiêu: Với Toán/Tiếng Việt → cần tất cả câu đúng
  // Hoàn thành = làm đúng tất cả câu hỏi trong tuần đó
  const targetCorrectAnswers = totalQuestions;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    // Tự động nộp bài ngay khi chọn đáp án
    setTimeout(() => {
      handleSubmit(answerIndex);
    }, 100); // Small delay để UX smooth hơn
  };

  const handleSubmit = (answerIndex?: number) => {
    const answer = answerIndex !== undefined ? answerIndex : selectedAnswer;
    if (answer === null || !currentQuestion) return;

    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setMascotState(correct ? 'happy' : 'encouraging');

    // Calculate time spent
    const timeSpent = Date.now() - questionStartTime;

    if (correct) {
      const userId = user?.id || null;
      
      // Dùng functional update để tránh stale state và save progress ngay lập tức
      setCompletedQuestions(prev => {
        // Đảm bảo không duplicate
        let newCompleted = prev.includes(currentQuestionIndex) ? prev : [...prev, currentQuestionIndex];
        
        // Save progress ngay lập tức với completedQuestions mới
        setScore(prevScore => {
          setCorrectStreak(prevStreak => {
            saveExerciseProgress(userId, weekId, bookSeries, grade, subject, {
              currentQuestionIndex,
              score: prevScore + 1,
              completedQuestions: newCompleted,
              correctStreak: prevStreak + 1,
            });
            return prevStreak;
          });
          return prevScore;
        });
        
        return newCompleted;
      });
      
      setScore(prev => prev + 1);
      playSound('correct');
      
      // Update adaptive difficulty performance
      updatePerformance(true, timeSpent);

      // Update correct streak
      setCorrectStreak(prev => prev + 1);

      // Hiển thị celebration mỗi lần làm đúng (lần đầu và các câu kế tiếp)
      setShowCelebration(true);

      // Hiện celebration → Sau 1.5 giây tự động chuyển câu tiếp
      // Dùng functional update để lấy state mới nhất
      setTimeout(() => {
        handleNext();
      }, 1500); // 1.5 giây sau celebration

      // Update daily challenge progress (sau state update)
      setTimeout(() => {
        setScore(prev => {
          if (subject === 'Toán') {
            updateProgress('challenge-1', prev);
          }
          return prev;
        });
      }, 0);

      // Trigger discovery card when streak reaches 5 (sau state update)
      setTimeout(() => {
        setCorrectStreak(prev => {
          if (prev === 5) {
            setShowDiscovery(true);
            setMascotState('excited');
          }
          return prev;
        });
      }, 0);

      // Update challenge-3 (score 80%+) (sau state update)
      setTimeout(() => {
        setScore(prev => {
          const finalScore = (prev / totalQuestions) * 100;
          if (finalScore >= 80) {
            updateProgress('challenge-3', 1);
          }
          return prev;
        });
      }, 0);

      // Progress đã được save ngay trong setCompletedQuestions ở trên
    } else {
      // Update adaptive difficulty performance
      updatePerformance(false, timeSpent);
      
      setCorrectStreak(0); // Reset streak on wrong answer
      playSound('wrong');
      showToast('Sai rồi, cố gắng lần sau nhé!', 'error');
      
      // KHÔNG save progress khi làm sai (để không restore về câu sai)
      // Chỉ khi làm đúng mới save progress để đảm bảo tiến độ đồng nhất
      // Progress chỉ tính từ completedQuestions (câu đúng), không tính câu sai
      
      // Sai → Hiện explanation modal và đợi bé xác nhận "Đã hiểu!"
      setShowExplanation(true);
    }
  };

  // Track question start time
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Helper function để tính thưởng sao cho ôn tập
  // Hệ thống mới: 28 thử thách ôn tập (THI HƯƠNG: 9, THI HỘI: 9, THI ĐÌNH: 10)
  // Tổng sao từ ôn tập: 2,800 sao (40% của tổng 7,000 sao)
  // - THI HƯƠNG: 9 thử thách × 100 sao = 900 sao (100% = 150, 80% = 120, 60% = 90, <60% = 60)
  // - THI HỘI: 9 thử thách × 100 sao = 900 sao (100% = 200, 80% = 160, 60% = 120, <60% = 80)
  // - THI ĐÌNH: 10 thử thách × 100 sao = 1,000 sao (100% = 300, 80% = 250, 60% = 200, <60% = 150)
  const calculateReviewExamStars = (examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH', completionRate: number): number => {
    if (examType === 'THI_HUONG') {
      // THI HƯƠNG: 150/120/90/60 sao (9 thử thách × 100 sao = 900 sao)
      return completionRate >= 100 ? 150 : (completionRate >= 80 ? 120 : (completionRate >= 60 ? 90 : 60));
    } else if (examType === 'THI_HOI') {
      // THI HỘI: 200/160/120/80 sao (9 thử thách × 100 sao = 900 sao)
      return completionRate >= 100 ? 200 : (completionRate >= 80 ? 160 : (completionRate >= 60 ? 120 : 80));
    } else if (examType === 'THI_DINH') {
      // THI ĐÌNH: 300/250/200/150 sao (10 thử thách × 100 sao = 1,000 sao)
      return completionRate >= 100 ? 300 : (completionRate >= 80 ? 250 : (completionRate >= 60 ? 200 : 150));
    }
    return 0;
  };

  // Helper function để thưởng coins và stars (async, gọi ngoài callback)
  const rewardCoinsForWeek = async (
    correctCount: number,
    targetCount: number,
    completionRate?: number
  ) => {
    const coinsReward = completionRate !== undefined 
      ? (completionRate >= 100 ? 10 : (completionRate >= 80 ? 5 : 0))
      : 10;
    
    // Tính sao: Nếu là ôn tập → dùng logic riêng, nếu không → dùng logic học chính
    let starsReward: number;
    if (examType && completionRate !== undefined) {
      // Ôn tập: THI HƯƠNG/HỘI/ĐÌNH
      starsReward = calculateReviewExamStars(examType, completionRate);
    } else {
      // Học chính: 100% = 100 sao, 80-99% = 80 sao, 60-79% = 60 sao, <60% = 40 sao
      // Hệ thống mới: 70 thử thách (35 tuần × 2 môn = 70)
      // - 60% cho vật phẩm + linh vật = 42 thử thách học chính → 4,200 sao (100% đúng)
      // - 40% cho ôn tập = 28 thử thách ôn tập → 2,800 sao
      // Tổng: 7,000 sao
      starsReward = completionRate !== undefined
        ? (completionRate >= 100 ? 100 : (completionRate >= 80 ? 80 : (completionRate >= 60 ? 60 : 40)))
        : 60; // Mặc định 60 sao nếu không có completionRate
    }
    
    if (coinsReward === 0 && starsReward === 0) return;
    
    // Key thưởng: Nếu là ôn tập → dùng examType, nếu không → dùng weekId
    const rewardKey = examType 
      ? `exam-${examType}-${bookSeries}-${grade}-${subject}-rewarded`
      : `week-${weekId}-${bookSeries}-${grade}-${subject}-rewarded`;
    
    // Ôn tập có thể làm lại nhiều lần để tích lũy sao (không check alreadyRewarded)
    // Học chính chỉ thưởng 1 lần
    if (!examType) {
      const alreadyRewarded = localStorage.getItem(rewardKey);
      if (alreadyRewarded) {
        console.log(`[Reward] Already rewarded for ${rewardKey}, skipping...`);
        return;
      }
      console.log(`[Reward] Awarding ${starsReward} stars for ${rewardKey}`);
    } else {
      console.log(`[Reward] Awarding ${starsReward} stars for ${examType} (can repeat)`);
    }
    
    if (user?.id) {
      try {
        // Award coins
        if (coinsReward > 0) {
          await awardCoins({
            amount: coinsReward,
            reason: examType
              ? `Hoàn thành ${examType} - ${subject} lớp ${grade} (${Math.round(completionRate || 0)}%)`
              : completionRate !== undefined
              ? `Hoàn thành tuần ${weekId} - ${subject} lớp ${grade} (${Math.round(completionRate)}%)`
              : `Hoàn thành tuần ${weekId} - ${subject} lớp ${grade}`,
            metadata: {
              weekId,
              bookSeries,
              grade,
              subject,
              correctCount,
              totalQuestions: targetCount,
              ...(completionRate !== undefined && { completionRate: Math.round(completionRate) }),
            },
          });
        }

        // Award stars (localStorage only) - theo lớp
        if (starsReward > 0) {
          awardStarsLocal(starsReward, grade);
        }

        // Chỉ lưu rewardKey cho học chính (không lưu cho ôn tập vì có thể làm lại)
        if (!examType) {
          localStorage.setItem(rewardKey, 'true');
        }
        const rewards = [];
        if (coinsReward > 0) rewards.push(`${coinsReward} coins`);
        if (starsReward > 0) rewards.push(`${starsReward} ⭐`);
        showToast(`🎉 Nhận được ${rewards.join(' và ')}!`, 'success');
      } catch (error) {
        console.error('Error awarding rewards:', error);
        // Fallback to demo mode - theo lớp
        const newCoins = addCoinsForGrade(grade, coinsReward);
        const newStars = addStarsForGrade(grade, starsReward);
        
        // Chỉ lưu rewardKey cho học chính (không lưu cho ôn tập vì có thể làm lại)
        if (!examType) {
          localStorage.setItem(rewardKey, 'true');
        }
        const rewards = [];
        if (coinsReward > 0) rewards.push(`${coinsReward} coins`);
        if (starsReward > 0) rewards.push(`${starsReward} ⭐`);
        showToast(`🎉 Nhận được ${rewards.join(' và ')}! (Demo mode)`, 'success');
      }
    } else {
      // Demo mode - theo lớp
      const newCoins = addCoinsForGrade(grade, coinsReward);
      const newStars = addStarsForGrade(grade, starsReward);
      
      // Chỉ lưu rewardKey cho học chính (không lưu cho ôn tập vì có thể làm lại)
      if (!examType) {
        localStorage.setItem(rewardKey, 'true');
      }
      const rewards = [];
      if (coinsReward > 0) rewards.push(`${coinsReward} coins`);
      if (starsReward > 0) rewards.push(`${starsReward} ⭐`);
      showToast(`🎉 Nhận được ${rewards.join(' và ')}! (Demo mode)`, 'success');
    }
  };

  const handleNext = useCallback(() => {
    // Đóng celebration trước khi chuyển câu
    setShowCelebration(false);
    
    // Dùng functional update để lấy state mới nhất
    const userId = user?.id || null;
    setScore(currentScore => {
      setCompletedQuestions(currentCompleted => {
        setCorrectStreak(currentStreak => {
          // Mục tiêu: Hoàn thành = làm đúng TẤT CẢ câu hỏi trong tuần
          // Với Toán/Tiếng Việt: Tất cả câu đúng
          const targetCorrectAnswers = totalQuestions;
          const currentCorrectCount = currentCompleted.length;
          
          // Kiểm tra nếu đã đủ tất cả câu đúng → hoàn thành
          if (currentCorrectCount >= targetCorrectAnswers) {
            // Đã đủ tất cả câu đúng → hoàn thành
            playSound('success');
            showToast(`Hoàn thành! Đã làm đúng ${currentCorrectCount}/${targetCorrectAnswers} câu`, 'success');
            setMascotState('excited');
            
            // Update challenge-2 (complete week)
            updateProgress('challenge-2', 1);
            
            // Thưởng coins (gọi async function ngoài callback)
            rewardCoinsForWeek(currentCorrectCount, targetCorrectAnswers).catch(err => {
              console.error('Error in rewardCoinsForWeek:', err);
            });
            
            // Save final progress
            saveExerciseProgress(userId, weekId, bookSeries, grade, subject, {
              currentQuestionIndex: currentQuestionIndex,
              score: currentCorrectCount,
              completedQuestions: currentCompleted,
              correctStreak: currentStreak,
            });
            
            // Auto go back after 2 seconds
            setTimeout(() => {
              onBack();
            }, 2000);
            return currentStreak;
          }
          
          // Chưa đủ tất cả câu đúng → Tìm câu tiếp theo chưa làm đúng
          let nextIndex = -1;
          for (let i = 0; i < totalQuestions; i++) {
            if (!currentCompleted.includes(i)) {
              nextIndex = i;
              break;
            }
          }
          
          if (nextIndex !== -1) {
            // Tìm thấy câu chưa làm đúng → Chuyển đến câu đó
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer(null);
            setShowResult(false);
            setIsCorrect(false);
            setShowExplanation(false);
            setMascotState('thinking');
            setQuestionStartTime(Date.now());
            
            // Save progress after moving to next question
            saveExerciseProgress(userId, weekId, bookSeries, grade, subject, {
              currentQuestionIndex: nextIndex,
              score: currentScore,
              completedQuestions: currentCompleted,
              correctStreak: currentStreak,
            });
          } else {
            // Không còn câu nào chưa làm đúng nhưng chưa đủ 20 câu đúng
            // → Có thể làm lại câu đã làm sai để đạt 20 câu đúng
            // Hoặc hoàn thành nếu đã làm hết tất cả câu
            if (currentQuestionIndex < totalQuestions - 1) {
              // Vẫn còn câu chưa làm → Chuyển đến câu tiếp theo
              const nextIndex = currentQuestionIndex + 1;
              setCurrentQuestionIndex(nextIndex);
              setSelectedAnswer(null);
              setShowResult(false);
              setIsCorrect(false);
              setShowExplanation(false);
              setMascotState('thinking');
              setQuestionStartTime(Date.now());
              
              saveExerciseProgress(userId, weekId, bookSeries, grade, subject, {
                currentQuestionIndex: nextIndex,
                score: currentScore,
                completedQuestions: currentCompleted,
                correctStreak: currentStreak,
              });
            } else {
              // Đã làm hết tất cả câu nhưng chưa đủ 20 câu đúng
              // → Hoàn thành với số câu đúng hiện tại
              playSound('success');
              showToast(`Hoàn thành! Đã làm đúng ${currentCorrectCount} câu`, 'success');
              setMascotState('excited');
              
              // Update challenge-2 (complete week)
              updateProgress('challenge-2', 1);
              
              // Thưởng coins khi hoàn thành tuần (dù chưa đủ 100%)
              const completionRate = (currentCorrectCount / targetCorrectAnswers) * 100;
              rewardCoinsForWeek(currentCorrectCount, targetCorrectAnswers, completionRate).catch(err => {
                console.error('Error in rewardCoinsForWeek:', err);
              });
              
              // Save final progress
              saveExerciseProgress(userId, weekId, bookSeries, grade, subject, {
                currentQuestionIndex: currentQuestionIndex,
                score: currentCorrectCount,
                completedQuestions: currentCompleted,
                correctStreak: currentStreak,
              });
              
              // Auto go back after 2 seconds
              setTimeout(() => {
                onBack();
              }, 2000);
            }
          }
          return currentStreak;
        });
        return currentCompleted;
      });
      return currentScore;
    });
  }, [currentQuestionIndex, totalQuestions, weekId, bookSeries, grade, subject, user?.id, showToast, onBack]);

  const handleExplanationClose = () => {
    // Khi bé click "Đã hiểu!" → đóng explanation modal và chuyển câu tiếp theo
    setShowExplanation(false);
    handleNext();
  };

  const handleCelebrationComplete = () => {
    // Celebration đã tự động gọi handleNext sau 1 giây trong handleSubmit
    // Không cần làm gì ở đây
    setShowCelebration(false);
  };

  const handleBack = () => {
    // Save progress before going back
    const hasProgress = currentQuestionIndex > 0 || score > 0 || completedQuestions.length > 0;
    
    if (hasProgress) {
      // Save current progress before going back
      const userId = user?.id || null;
      saveExerciseProgress(userId, weekId, bookSeries, grade, subject, {
        currentQuestionIndex,
        score,
        completedQuestions,
        correctStreak,
      });
      
      // Show toast notification
      showToast(`Đã lưu tiến độ: Câu ${currentQuestionIndex + 1}/${totalQuestions}`, 'info');
    }
    
    // Go back after a short delay to show toast
    setTimeout(() => {
      onBack();
    }, 500);
  };


  if (!weekData || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5]">
        <div className="text-2xl font-black text-amber-900">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF5] pb-24 md:pb-28">
      <SuccessCelebration 
        isActive={showCelebration} 
        streak={correctStreak}
        onComplete={undefined}
      />
      <DiscoveryCard trigger={showDiscovery} onClose={() => setShowDiscovery(false)} />
      
      {/* Header */}
      <header className="px-3 py-2 md:px-4 md:py-2.5 bg-[#FDFBF5]/80 backdrop-blur-sm sticky top-0 z-10 border-b-2 border-yellow-700/20">
        {/* Progress Section - Compact */}
        <div className="flex items-center justify-between gap-2">
          <div className="w-12 md:w-16"></div> {/* Spacer for alignment */}
          <div className="flex items-center space-x-1.5 md:space-x-2 flex-1 justify-center">
            <InteractiveMascot state={mascotState} size="small" />
            <div className="text-center">
              <p className="text-xs font-bold text-amber-800">Câu {currentQuestionIndex + 1}/{totalQuestions}</p>
              <p className="text-[10px] text-amber-700">⭐ {score} điểm</p>
            </div>
            <AdaptiveDifficulty />
          </div>
          <div className="w-12 md:w-16"></div> {/* Spacer for alignment */}
        </div>
        <div className="mt-2 md:mt-2.5">
          <ProgressBar progress={progress} current={completedQuestions.length} total={totalQuestions} color="blue" animated />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 max-w-4xl mx-auto space-y-8">
        {/* Question Card */}
        <div className="bg-[#FDFBF5]/80 p-5 md:p-7 lg:p-8 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
          <div className="bg-yellow-100/40 p-5 md:p-6 lg:p-7 rounded-2xl shadow-viet-style-pressed mb-7 md:mb-8">
            <h3 className="text-lg md:text-xl font-black text-amber-900 mb-4 md:mb-5">❓ Câu hỏi:</h3>
            <p className="text-base md:text-lg font-bold text-amber-900 leading-relaxed">{currentQuestion.question}</p>
            
            {/* Hiển thị hình ảnh nếu có */}
            {currentQuestion.imageUrl && (
              <div className="mt-4 flex justify-center items-center">
                {currentQuestion.imageUrl.startsWith('emoji:') ? (
                  // Hiển thị emoji
                  <div className="text-8xl md:text-9xl" role="img" aria-label="Question image">
                    {currentQuestion.imageUrl.replace('emoji:', '')}
                  </div>
                ) : (
                  // Hiển thị hình ảnh từ URL
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Question illustration"
                    className="max-w-full h-auto rounded-2xl shadow-lg border-2 border-amber-800/20"
                    style={{ maxHeight: '300px' }}
                    onError={(e) => {
                      // Nếu hình ảnh không tải được, ẩn đi
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 md:space-y-5">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'bg-[#FDFBF5] text-amber-900 shadow-viet-style-raised hover:scale-105';
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  optionClass = 'bg-green-300 text-green-900 shadow-viet-style-pressed border-2 border-green-700/30';
                } else if (index === selectedAnswer && !isCorrect) {
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
                  className={`w-full p-5 md:p-6 rounded-2xl font-bold text-left transition-all duration-200 transform active:scale-95 border-2 border-amber-800/20 text-base md:text-lg ${optionClass}`}
                >
                  <span className="font-black mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  {showResult && index === currentQuestion.correctAnswer && (
                    <span className="ml-2 text-xl">✅</span>
                  )}
                  {showResult && index === selectedAnswer && !isCorrect && index !== currentQuestion.correctAnswer && (
                    <span className="ml-2 text-xl">❌</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Modal - Chỉ hiện khi sai */}
          <ExplanationModal
            isOpen={showExplanation && !isCorrect}
            explanation={currentQuestion.explanation}
            isCorrect={false}
            onClose={handleExplanationClose}
          />

          {/* Action Buttons - Đã bỏ, tự động nộp bài và chuyển câu */}
        </div>
      </main>

      {/* Footer - Nút Quay lại ở cuối màn hình */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#FDFBF5]/90 backdrop-blur-sm border-t-2 border-yellow-700/20 z-20 px-4 py-3 md:py-4 pb-safe">
        <div className="max-w-4xl mx-auto flex justify-center">
          <button
            onClick={handleBack}
            className="w-auto px-6 py-3 md:px-8 md:py-3.5 bg-amber-200 text-amber-900 rounded-xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-transform border-2 border-amber-800/20 text-sm md:text-base"
          >
            ← Quay lại
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ExercisePage;

