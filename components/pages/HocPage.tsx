import React, { useState, useEffect } from 'react';
import { Week } from '../../types';
import { useAuth } from '../../src/contexts/AuthContext';
import { type User } from '../../src/lib/api/auth';
import ProgressBar from '../common/ProgressBar';
import DailyChallengeBubble from '../curiosity/DailyChallengeBubble';
import MiniGame from '../curiosity/MiniGame';
import InteractiveMascot from '../interactive/InteractiveMascot';
import { getExerciseProgress } from '../../src/lib/storage/exerciseProgress';

const VietHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <header className="p-4 text-center">
    <div className="inline-block bg-[#FDFBF5]/80 py-3 px-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
      <h1 className="text-3xl font-black text-amber-900 flex items-center justify-center">
        <span className="text-4xl mr-3 drop-shadow-md">{icon}</span>
        <span>{title}</span>
      </h1>
    </div>
  </header>
);

const VietSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-[#FDFBF5]/80 p-5 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
    <h2 className="text-xl font-bold text-green-800 mb-4">{title}</h2>
    <div className="bg-yellow-100/40 p-4 rounded-2xl shadow-viet-style-pressed">
        {children}
    </div>
  </div>
);

const VietButton: React.FC<{onClick: () => void; children: React.ReactNode; isActive: boolean; className?: string; glowColor?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'sky' | 'lime';}> = ({ onClick, children, isActive, className, glowColor }) => {
    const baseClasses = `p-3 rounded-2xl font-extrabold transition-all duration-200 transform active:scale-95 border-2 border-amber-800/20`;
    
    // Get glow animation class based on glowColor
    const getGlowClass = () => {
        if (!glowColor) return 'animate-glow';
        const glowClassMap: { [key: string]: string } = {
            'blue': 'animate-glow-blue',
            'green': 'animate-glow-green',
            'yellow': 'animate-glow-yellow',
            'purple': 'animate-glow-purple',
            'red': 'animate-glow-red',
            'sky': 'animate-glow-sky',
            'lime': 'animate-glow-lime',
        };
        return glowClassMap[glowColor] || 'animate-glow';
    };
    
    const activeClasses = `shadow-viet-style-pressed scale-95 opacity-100 ${getGlowClass()}`;
    const inactiveClasses = `shadow-viet-style-raised hover:scale-105 opacity-80 hover:opacity-100`;
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}>
            {children}
        </button>
    )
}

const bookSeries = [ { name: 'Kết nối tri thức', color: 'bg-blue-200' }, { name: 'Chân trời sáng tạo', color: 'bg-green-200' }, { name: 'Phát triển năng lực', color: 'bg-yellow-200' }, { name: 'Bình đẳng & Dân chủ', color: 'bg-purple-200' }, ];
const grades = [1, 2, 3, 4, 5];
const subjects = [ { name: 'Toán', icon: '🧮', color: 'bg-red-200' }, { name: 'Tiếng Việt', icon: '📝', color: 'bg-sky-200' }, ];
// Week metadata (titles, dates) - Base titles cho 5 tuần đầu
const baseWeekTitles: { [key: number]: string } = {
  1: 'Cây Đa Đầu Làng',
  2: 'Giếng Nước Trong Veo',
  3: 'Sân Đình Rộn Rã',
  4: 'Đồng Lúa Chín Vàng',
  5: 'Lũy Tre Xanh Mát',
};

// Function để generate week metadata động (detect số tuần có sẵn)
// Beta: Chỉ hiển thị 10 tuần đầu tiên
const generateWeekMetadata = async (bookSeriesFolder: string, grade: number, subjectFolder: string, maxWeeks: number = 10): Promise<Array<{ id: number; title: string; date: string }>> => {
  const weekMetadata: Array<{ id: number; title: string; date: string }> = [];
  
  // Thử detect số tuần có sẵn bằng cách check file week-*.json
  // Dùng Promise.all để check song song (nhanh hơn)
  const checkPromises = [];
  for (let weekId = 1; weekId <= maxWeeks; weekId++) {
    const dataPath = `/data/questions/${bookSeriesFolder}/grade-${grade}/${subjectFolder}/week-${weekId}.json`;
    checkPromises.push(
      fetch(dataPath, { method: 'GET', cache: 'no-cache' })
        .then(response => ({ weekId, exists: response.ok }))
        .catch(() => ({ weekId, exists: false }))
    );
  }
  
  const results = await Promise.all(checkPromises);
  
  // Thêm các tuần có file vào metadata
  for (const result of results) {
    if (result.exists) {
      const title = baseWeekTitles[result.weekId] || `Tuần ${result.weekId}`;
      weekMetadata.push({
        id: result.weekId,
        title,
        date: `Tuần ${result.weekId}`,
      });
    }
  }
  
  return weekMetadata;
};

interface HocPageProps {
  onStartWeek: (weekId: number, bookSeries: string, grade: number, subject: string) => void;
}

const SELECTION_STORAGE_KEY = 'learning_selection';

// Get selection storage key for user
const getSelectionKey = (userId: string | null): string => {
    return userId ? `${SELECTION_STORAGE_KEY}_${userId}` : SELECTION_STORAGE_KEY;
};

// Load selection with priority: localStorage > user.grade > default
const loadSelection = (user: User | null) => {
    // Priority 1: localStorage (nếu có) - gắn với user ID (ƯU TIÊN CAO NHẤT)
    // Luôn load từ localStorage trước để nhớ selection của user
    try {
        const selectionKey = getSelectionKey(user?.id || null);
        const stored = localStorage.getItem(selectionKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ưu tiên localStorage hơn user.grade để giữ selection của user
            return {
                selectedBook: parsed.selectedBook || bookSeries[0].name,
                selectedGrade: parsed.selectedGrade || (user?.grade && user.grade >= 1 && user.grade <= 5 ? user.grade : grades[0]),
                selectedSubject: parsed.selectedSubject || subjects[0].name,
            };
        }
    } catch (error) {
        console.error('Error loading selection:', error);
    }
    
    // Priority 2: user.grade (nếu có và valid) - chỉ dùng khi không có localStorage
    if (user?.grade && user.grade >= 1 && user.grade <= 5) {
        return {
            selectedBook: bookSeries[0].name, // Default book
            selectedGrade: user.grade,
            selectedSubject: subjects[0].name, // Default subject
        };
    }
    
    // Priority 3: default (lớp 1 thay vì lớp 2)
    return {
        selectedBook: bookSeries[0].name,
        selectedGrade: grades[0], // Lớp 1 thay vì lớp 2
        selectedSubject: subjects[0].name,
    };
};

// Save selection to localStorage (gắn với user ID)
const saveSelection = (userId: string | null, selectedBook: string, selectedGrade: number, selectedSubject: string) => {
    try {
        const selectionKey = getSelectionKey(userId);
        localStorage.setItem(selectionKey, JSON.stringify({
            selectedBook,
            selectedGrade,
            selectedSubject,
        }));
    } catch (error) {
        console.error('Error saving selection:', error);
    }
};

const HocPage: React.FC<HocPageProps> = ({ onStartWeek }) => {
    // Safe access to useAuth - handle case where context might not be ready yet
    let user: User | null = null;
    try {
        const authContext = useAuth();
        user = authContext.user;
    } catch (error) {
        // If AuthProvider is not available, user will be null
        // This should not happen in production, but handles edge cases
        console.warn('HocPage: useAuth error (AuthProvider might not be ready):', error);
        user = null;
    }
    
    const initialSelection = loadSelection(user);
    const [selectedBook, setSelectedBook] = useState(initialSelection.selectedBook);
    const [selectedGrade, setSelectedGrade] = useState(initialSelection.selectedGrade);
    const [selectedSubject, setSelectedSubject] = useState(initialSelection.selectedSubject);
    const [showMiniGame, setShowMiniGame] = useState(false);
    const [miniGameType, setMiniGameType] = useState<'memory' | 'puzzle'>('memory');
    const [mascotState, setMascotState] = useState<'idle' | 'happy' | 'thinking' | 'excited' | 'encouraging' | 'sleep'>('idle');
    const [weeks, setWeeks] = useState<Week[]>([]);
    
    // Auto-update selectedGrade when user.grade changes (e.g., after login)
    // CHỈ update nếu chưa có selection trong localStorage (để không override selection của user)
    useEffect(() => {
        if (user?.grade && user.grade >= 1 && user.grade <= 5) {
            const selectionKey = getSelectionKey(user?.id || null);
            const stored = localStorage.getItem(selectionKey);
            // Chỉ update nếu chưa có selection trong localStorage
            if (!stored) {
                setSelectedGrade(user.grade);
            }
        }
    }, [user?.grade, user?.id]);
    
    // Reload selection when component mounts or user changes (khi quay lại từ ExercisePage)
    useEffect(() => {
        const reloadedSelection = loadSelection(user);
        setSelectedBook(reloadedSelection.selectedBook);
        setSelectedGrade(reloadedSelection.selectedGrade);
        setSelectedSubject(reloadedSelection.selectedSubject);
    }, [user?.id]); // Reload khi user thay đổi (login/logout) hoặc component mount lại
    
    // Reload selection khi quay lại từ ExercisePage
    useEffect(() => {
        const handleExercisePageClosed = () => {
            const reloadedSelection = loadSelection(user);
            setSelectedBook(reloadedSelection.selectedBook);
            setSelectedGrade(reloadedSelection.selectedGrade);
            setSelectedSubject(reloadedSelection.selectedSubject);
        };
        
        window.addEventListener('exercisePageClosed', handleExercisePageClosed);
        return () => {
            window.removeEventListener('exercisePageClosed', handleExercisePageClosed);
        };
    }, [user]);
    
    // Save selection when changed (gắn với user ID)
    useEffect(() => {
        const userId = user?.id || null;
        saveSelection(userId, selectedBook, selectedGrade, selectedSubject);
    }, [user?.id, selectedBook, selectedGrade, selectedSubject]);
    
    // Load week data and calculate status based on real progress
    useEffect(() => {
        const loadWeeksStatus = async () => {
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
            
            const bookSeriesFolder = bookSeriesMap[selectedBook] || 'ket-noi-tri-thuc';
            const subjectFolder = subjectMap[selectedSubject] || 'math';
            
            // Auto-detect số tuần có sẵn
            const dynamicWeekMetadata = await generateWeekMetadata(bookSeriesFolder, selectedGrade, subjectFolder);
            
            const userId = user?.id || null;
            const weeksData: Week[] = await Promise.all(
                dynamicWeekMetadata.map(async (weekMeta) => {
                    // Load progress from localStorage (gắn với user ID)
                    const progress = getExerciseProgress(userId, weekMeta.id, selectedBook, selectedGrade, selectedSubject);
                    
                    // Load week data to get totalQuestions (số câu hỏi thực tế)
                    let totalQuestions = 0;
                    try {
                        const dataPath = `/data/questions/${bookSeriesFolder}/grade-${selectedGrade}/${subjectFolder}/week-${weekMeta.id}.json`;
                        const response = await fetch(dataPath);
                        if (response.ok) {
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                try {
                                    const data = await response.json();
                                    // Đếm số câu hỏi thực tế trong tất cả lessons
                                    // Với tiếng Anh: 10 câu, với Toán/Tiếng Việt: có thể nhiều hơn
                                    totalQuestions = data.lessons?.reduce((sum: number, lesson: any) => {
                                        return sum + (lesson.questions?.length || 0);
                                    }, 0) || 0;
                                } catch (parseError) {
                                    console.warn(`Error parsing JSON for week ${weekMeta.id}:`, parseError);
                                    totalQuestions = 0;
                                }
                            } else {
                                console.warn(`Week ${weekMeta.id} data is not JSON (Content-Type: ${contentType || 'unknown'})`);
                                totalQuestions = 0;
                            }
                        } else {
                            console.warn(`Week ${weekMeta.id} data not found (${response.status})`);
                            totalQuestions = 0;
                        }
                    } catch (error) {
                        console.warn(`Error loading week ${weekMeta.id} data:`, error);
                        totalQuestions = 0;
                    }
                    
                    // Calculate status - tính số câu đúng (completedQuestions.length)
                    // Tiến độ = số câu trả lời đúng
                    const completedQuestions = progress?.completedQuestions || [];
                    // Progress = số câu đúng (completedQuestions chứa indices của câu đã làm đúng)
                    const progressCount = completedQuestions.length;
                    // Mục tiêu: Hoàn thành = làm đúng TẤT CẢ câu hỏi trong tuần
                    // Với tiếng Anh: 10/10 câu đúng
                    // Với Toán/Tiếng Việt: Tất cả câu đúng
                    const targetCorrectAnswers = totalQuestions > 0 ? totalQuestions : 20; // Fallback: 20 nếu không load được
                    
                    let status: 'completed' | 'inprogress' | 'locked';
                    if (weekMeta.id === 1) {
                        // Week 1: Always unlocked
                        if (progressCount >= targetCorrectAnswers) {
                            status = 'completed';
                        } else if (progressCount > 0) {
                            status = 'inprogress';
                        } else {
                            status = 'inprogress'; // Week 1 is always available
                        }
                    } else {
                        // Week N (N > 1): Check if previous week is completed
                        const prevWeekProgress = getExerciseProgress(userId, weekMeta.id - 1, selectedBook, selectedGrade, selectedSubject);
                        const prevWeekCompletedQuestions = prevWeekProgress?.completedQuestions || [];
                        
                        // Load totalQuestions của tuần trước để check unlock
                        let prevWeekTotalQuestions = 0;
                        try {
                            const prevDataPath = `/data/questions/${bookSeriesFolder}/grade-${selectedGrade}/${subjectFolder}/week-${weekMeta.id - 1}.json`;
                            const prevResponse = await fetch(prevDataPath);
                            if (prevResponse.ok) {
                                const prevData = await prevResponse.json();
                                prevWeekTotalQuestions = prevData.lessons?.reduce((sum: number, lesson: any) => {
                                    return sum + (lesson.questions?.length || 0);
                                }, 0) || 0;
                            }
                        } catch (error) {
                            console.warn(`Error loading prev week ${weekMeta.id - 1} data:`, error);
                            prevWeekTotalQuestions = 20; // Fallback: 20 nếu không load được
                        }
                        
                        // Tuần trước hoàn thành khi có >= số câu hỏi của tuần trước
                        // Với tiếng Anh: 10/10 câu đúng
                        // Với Toán/Tiếng Việt: Tất cả câu đúng
                        const prevWeekTarget = prevWeekTotalQuestions > 0 ? prevWeekTotalQuestions : 20;
                        const prevWeekCompleted = prevWeekCompletedQuestions.length >= prevWeekTarget;
                        
                        if (prevWeekCompleted) {
                            // Previous week completed → Check current week status
                            if (progressCount >= targetCorrectAnswers) {
                                status = 'completed';
                            } else if (progressCount > 0) {
                                status = 'inprogress';
                            } else {
                                status = 'inprogress'; // Unlocked but not started
                            }
                        } else {
                            // Previous week not completed → Locked
                            status = 'locked';
                        }
                    }
                    
                    return {
                        id: weekMeta.id,
                        title: weekMeta.title,
                        date: weekMeta.date,
                        status,
                        progress: progressCount,
                        totalTasks: targetCorrectAnswers, // Hiển thị progress: X/totalQuestions câu đúng
                    };
                })
            );
            
            setWeeks(weeksData);
        };
        
        loadWeeksStatus();
    }, [user?.id, selectedBook, selectedGrade, selectedSubject]);
    
    const handleWeekClick = (week: Week) => {
        if (week.status === 'locked') {
            return; // Không làm gì nếu bị khóa
        }
        // Click vào tuần đã unlock → Bắt đầu học ngay
        onStartWeek(week.id, selectedBook, selectedGrade, selectedSubject);
    };

    const handleMiniGameComplete = (stars: number) => {
        // Handle mini-game completion rewards
        console.log(`Mini-game completed! Earned ${stars} stars`);
    };
    
    return (
        <div>
            <VietHeader title="Hành Trình Về Làng" icon="🌾" />
            <main className="p-4 md:p-6 space-y-6">
                {/* Daily Challenge Bubble (Notification) */}
                <DailyChallengeBubble />

                <div className="flex flex-col md:flex-row items-center justify-center text-center bg-[#FDFBF5]/70 rounded-3xl p-4 gap-2 shadow-viet-style-raised border-2 border-yellow-700/20">
                    <InteractiveMascot state={mascotState} size="medium" />
                    <p className="text-lg font-bold text-amber-900 md:text-xl">
                        Chào {user?.fullName || 'bạn nhỏ'}! <br/> Cùng Tí về làng chơi nhé!
                    </p>
                </div>

                <VietSection title="Hành Trang">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-amber-800 mb-2">📚 Chọn sách giáo khoa</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {bookSeries.map((book, index) => {
                                    const glowColors: ('blue' | 'green' | 'yellow' | 'purple')[] = ['blue', 'green', 'yellow', 'purple'];
                                    return (
                                        <VietButton 
                                            key={book.name} 
                                            onClick={() => setSelectedBook(book.name)} 
                                            isActive={selectedBook === book.name}
                                            glowColor={glowColors[index]}
                                            className={`${book.color} text-slate-800`}
                                        >
                                            <span className="text-center drop-shadow">{book.name}</span>
                                        </VietButton>
                                    );
                                })}
                            </div>
                        </div>
                         <div className="flex flex-col md:flex-row gap-6">
                             <div className="flex-1">
                                <h3 className="font-bold text-amber-800 mb-2">📖 Chọn lớp</h3>
                                <div className="grid grid-cols-5 gap-2 bg-amber-100/50 p-2 rounded-2xl">
                                    {grades.map(grade => (
                                        <button key={grade} onClick={() => {
                                            setSelectedGrade(grade);
                                            // Lưu grade mới vào localStorage để các component khác biết
                                            localStorage.setItem('selectedGrade', grade.toString());
                                            // Trigger reload để load stars/coins từ lớp mới (nếu cần)
                                            window.dispatchEvent(new Event('gradeChanged'));
                                        }} className={`aspect-square rounded-full font-black text-2xl flex items-center justify-center transition-all duration-200 transform ${selectedGrade === grade ? 'bg-red-400 text-white shadow-viet-style-pressed scale-95' : 'bg-[#FDFBF5] text-amber-800 shadow-viet-style-raised hover:scale-105'}`}>
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-800 mb-2">🚀 Chọn môn</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {subjects.map((subject, index) => {
                                        const glowColors: ('red' | 'sky')[] = ['red', 'sky'];
                                        return (
                                            <VietButton 
                                                key={subject.name} 
                                                onClick={() => setSelectedSubject(subject.name)} 
                                                isActive={selectedSubject === subject.name}
                                                glowColor={glowColors[index]}
                                                className={`${subject.color} text-slate-800 text-sm flex flex-col items-center justify-center`}
                                            >
                                                <span className="text-3xl drop-shadow">{subject.icon}</span>
                                                <span>{subject.name}</span>
                                            </VietButton>
                                        );
                                    })}
                                </div>
                            </div>
                         </div>
                    </div>
                </VietSection>
                <VietSection title="🗺️ Con Đường Làng">
                    <div className="relative flex flex-col items-center py-4 space-y-4">
                        <div className="absolute top-10 bottom-10 left-1/2 w-2 bg-yellow-600/30 rounded-full -translate-x-1/2 border-x border-dashed border-yellow-700/50"></div>
                        {weeks.length > 0 ? (
                            weeks.map((week, index) => (
                                <VillageStopCard 
                                    key={week.id} 
                                    week={week} 
                                    index={index}
                                    onClick={() => handleWeekClick(week)}
                                />
                            ))
                        ) : (
                            // Loading state - Show 5 placeholders
                            Array.from({ length: 5 }, (_, index) => (
                                <div key={`loading-${index}`} className="w-full md:w-3/5 p-4 rounded-3xl bg-slate-200/50 animate-pulse">
                                    <div className="h-20"></div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-bold text-amber-800 mb-2">Tiến độ tổng thể</p>
                        {(() => {
                            const completedWeeks = weeks.filter(w => w.status === 'completed').length;
                            const totalWeeks = weeks.length;
                            const progressPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;
                            return (
                                <ProgressBar 
                                    progress={progressPercentage} 
                                    current={completedWeeks} 
                                    total={totalWeeks} 
                                    color="blue" 
                                    animated 
                                />
                            );
                        })()}
                    </div>
                </VietSection>

                {/* Mini-Games Break Time */}
                <VietSection title="🎮 Giải lao vui vẻ">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                setMiniGameType('memory');
                                setShowMiniGame(true);
                            }}
                            className="p-4 bg-blue-200 text-blue-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-blue-700/20"
                        >
                            <div className="text-4xl mb-2">🧠</div>
                            <div className="text-sm">Trò chơi trí nhớ</div>
                        </button>
                        <button
                            onClick={() => {
                                setMiniGameType('puzzle');
                                setShowMiniGame(true);
                            }}
                            className="p-4 bg-purple-200 text-purple-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-purple-700/20"
                        >
                            <div className="text-4xl mb-2">🧩</div>
                            <div className="text-sm">Trò chơi xếp hình</div>
                        </button>
                    </div>
                </VietSection>

                {/* Mini-Game Modal */}
                {showMiniGame && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-[#FDFBF5] rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <MiniGame
                                type={miniGameType}
                                onComplete={handleMiniGameComplete}
                                onClose={() => setShowMiniGame(false)}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const VillageStopCard: React.FC<{ week: Week; index: number; onClick: () => void }> = ({ week, index, onClick }) => {
    const isEven = index % 2 === 0;
    const alignment = isEven ? 'md:self-start md:pr-16' : 'md:self-end md:pl-16';

    const cardBg = {
        completed: 'bg-green-200/70',
        inprogress: 'bg-sky-200/70',
        locked: 'bg-slate-300/70'
    }[week.status];
    
    const decoration = {
         completed: '🌸', inprogress: '🪁', locked: '☁️'
    }[week.status]

    const isClickable = week.status !== 'locked';

    return (
         <div className={`relative w-full md:w-3/5 z-10 ${alignment}`}>
            <button
                onClick={isClickable ? onClick : undefined}
                disabled={!isClickable}
                className={`relative w-full p-4 rounded-3xl border-2 border-amber-900/30 shadow-viet-style-raised ${cardBg} ${
                    isClickable 
                        ? 'hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer' 
                        : 'cursor-not-allowed opacity-60'
                }`}
            >
                 <div className="absolute -top-3 -left-3 text-4xl transform -rotate-12">{decoration}</div>
                 {week.status === 'locked' && <div className="absolute inset-0 bg-slate-500/30 rounded-3xl flex items-center justify-center text-4xl backdrop-blur-sm text-white">🔒</div>}
                
                <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white/50 text-2xl font-black text-white ${week.status === 'completed' ? 'bg-green-500' : week.status === 'inprogress' ? 'bg-sky-500' : 'bg-slate-500'}`}>
                        {week.status === 'completed' ? '✓' : week.id}
                    </div>
                    <div className="flex-1 text-left">
                        <h3 className="font-extrabold text-lg text-amber-900">{week.title}</h3>
                        <p className={`text-sm font-semibold text-amber-800`}>
                           {week.status === 'inprogress' ? `${week.progress}/${week.totalTasks} câu đúng` : `${week.date}`}
                        </p>
                        {isClickable && (
                            <p className="text-xs text-amber-700 mt-1 font-semibold">
                                👆 Bấm để học ngay
                            </p>
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
};

export default HocPage;