import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { type User } from '../../src/lib/api/auth';

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
    <div className="bg-[#FDFBF5]/80 p-5 rounded-3xl shadow-viet-style-raised h-full border-2 border-yellow-700/20">
        <h2 className="text-xl font-bold text-green-800 mb-4">{title}</h2>
        <div className="bg-yellow-100/40 p-4 rounded-2xl shadow-viet-style-pressed h-full flex flex-col">
            {children}
        </div>
    </div>
);

interface ReviewCardProps {
  title: string;
  weeks: string;
  duration: string;
  questions: string;
  color: string;
  examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH';
  onStartExam: (examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH') => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ title, weeks, duration, questions, color, examType, onStartExam }) => (
    <div className={`p-5 rounded-3xl border-2 border-amber-900/30 shadow-viet-style-raised flex flex-col h-full ${color}`}>
        <div className="flex-grow">
            <h3 className="font-black text-2xl text-amber-900">{title}</h3>
            <div className="text-sm text-amber-800 space-y-1 mt-2 font-semibold">
                <p><strong>Tuần:</strong> {weeks}</p>
                <p><strong>⏰ Thời gian:</strong> {duration}</p>
                <p><strong>❓ Câu hỏi:</strong> {questions}</p>
            </div>
        </div>
        <button 
          onClick={() => onStartExam(examType)}
          className="w-full mt-4 bg-white/80 text-amber-900 font-bold py-3 rounded-2xl text-base shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all"
        >
            Vào thi
        </button>
    </div>
);

const SkillBar: React.FC<{ name: string; percentage: number; level: 'Yếu' | 'Cần cố gắng' | 'Tốt' }> = ({ name, percentage, level }) => {
    const color = level === 'Yếu' ? 'bg-red-400' : level === 'Cần cố gắng' ? 'bg-yellow-400' : 'bg-green-400';
    const textColor = level === 'Yếu' ? 'text-red-700' : level === 'Cần cố gắng' ? 'text-yellow-700' : 'text-green-700';

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-bold text-amber-900">{name}</span>
                <span className={`text-sm font-bold ${textColor}`}>{level}</span>
            </div>
            <div className="w-full bg-[#E8DDCB] rounded-full h-6 p-1 shadow-viet-style-pressed border-2 border-amber-900/20 bamboo-texture">
                <div className="relative bg-gradient-to-r from-lime-400 to-green-500 h-full rounded-full transition-all duration-500 border-2 border-white/80" style={{ width: `${percentage}%` }}>
                   <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-black text-white drop-shadow-sm">{percentage}%</span>
                </div>
            </div>
        </div>
    );
};

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
};

const DEFAULT_BOOK_SERIES = 'Kết nối tri thức';
const grades = [1, 2, 3, 4, 5];
const subjects = [
    { name: 'Toán', icon: '🧮', color: 'bg-red-200' },
    { name: 'Tiếng Việt', icon: '📝', color: 'bg-sky-200' },
];

const SELECTION_STORAGE_KEY = 'review_selection';

// Get selection storage key for user
const getSelectionKey = (userId: string | null): string => {
    return userId ? `${SELECTION_STORAGE_KEY}_${userId}` : SELECTION_STORAGE_KEY;
};

// Load selection with priority: localStorage > user.grade > default
const loadSelection = (user: User | null) => {
    // Priority 1: localStorage (nếu có) - gắn với user ID
    try {
        const selectionKey = getSelectionKey(user?.id || null);
        const stored = localStorage.getItem(selectionKey);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                selectedGrade: parsed.selectedGrade || (user?.grade && user.grade >= 1 && user.grade <= 5 ? user.grade : grades[0]),
                selectedSubject: parsed.selectedSubject || subjects[0].name,
            };
        }
    } catch (error) {
        console.error('Error loading selection:', error);
    }
    
    // Priority 2: user.grade (nếu có và valid)
    if (user?.grade && user.grade >= 1 && user.grade <= 5) {
        return {
            selectedGrade: user.grade,
            selectedSubject: subjects[0].name,
        };
    }
    
    // Priority 3: default
    return {
        selectedGrade: grades[0],
        selectedSubject: subjects[0].name,
    };
};

// Save selection to localStorage (gắn với user ID)
const saveSelection = (userId: string | null, selectedGrade: number, selectedSubject: string) => {
    try {
        const selectionKey = getSelectionKey(userId);
        localStorage.setItem(selectionKey, JSON.stringify({
            selectedGrade,
            selectedSubject,
        }));
    } catch (error) {
        console.error('Error saving selection:', error);
    }
};

interface OnTapPageProps {
  onStartExam?: (examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH', weekId: number, bookSeries: string, grade: number, subject: string) => void;
}

const OnTapPage: React.FC<OnTapPageProps> = ({ onStartExam }) => {
    // Safe access to useAuth
    let user: User | null = null;
    try {
        const authContext = useAuth();
        user = authContext.user;
    } catch (error) {
        console.warn('OnTapPage: useAuth error:', error);
        user = null;
    }
    
    const initialSelection = loadSelection(user);
    const [selectedGrade, setSelectedGrade] = useState(initialSelection.selectedGrade);
    const [selectedSubject, setSelectedSubject] = useState(initialSelection.selectedSubject);
    
    // Auto-update selectedGrade when user.grade changes
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
    
    // Reload selection when component mounts or user changes
    useEffect(() => {
        const reloadedSelection = loadSelection(user);
        setSelectedGrade(reloadedSelection.selectedGrade);
        setSelectedSubject(reloadedSelection.selectedSubject);
    }, [user?.id]);
    
    // Save selection when changed
    useEffect(() => {
        const userId = user?.id || null;
        saveSelection(userId, selectedGrade, selectedSubject);
    }, [user?.id, selectedGrade, selectedSubject]);

    const handleStartExam = (examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH') => {
        // Map subject từ display name về folder name
        const subjectMap: { [key: string]: string } = {
            'Toán': 'math',
            'Tiếng Việt': 'vietnamese',
        };
        const subjectFolder = subjectMap[selectedSubject] || 'math';
        
        // THI HƯƠNG: Học Kỳ 1 (tuần 1-18), THI HỘI: Học Kỳ 2 (tuần 19-35), THI ĐÌNH: Cả Năm
        // Dùng weekId = 1 làm placeholder, ExercisePage sẽ tự load questions phù hợp
        const weekId = 1; // Placeholder, ExercisePage sẽ load questions từ nhiều tuần
        
        if (onStartExam) {
            onStartExam(examType, weekId, DEFAULT_BOOK_SERIES, selectedGrade, selectedSubject);
        }
    };

    return (
        <div>
            <VietHeader title="Thử Tài Trạng Tí" icon="📜" />
            <main className="p-4 md:p-6 space-y-6">
                <VietSection title="Hành Trang">
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-800 mb-2">📖 Chọn lớp</h3>
                                <div className="grid grid-cols-5 gap-2 bg-amber-100/50 p-2 rounded-2xl">
                                    {grades.map(grade => (
                                        <button 
                                            key={grade} 
                                            onClick={() => {
                                                setSelectedGrade(grade);
                                                localStorage.setItem('selectedGrade', grade.toString());
                                                window.dispatchEvent(new Event('gradeChanged'));
                                            }} 
                                            className={`aspect-square rounded-full font-black text-2xl flex items-center justify-center transition-all duration-200 transform ${
                                                selectedGrade === grade 
                                                    ? 'bg-red-400 text-white shadow-viet-style-pressed scale-95' 
                                                    : 'bg-[#FDFBF5] text-amber-800 shadow-viet-style-raised hover:scale-105'
                                            }`}
                                        >
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
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <VietSection title="Chọn Vòng Thi">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ReviewCard
                                    title="THI HƯƠNG"
                                    weeks="Học Kỳ 1"
                                    duration="15 phút"
                                    questions="30 câu"
                                    color="bg-pink-200/70"
                                    examType="THI_HUONG"
                                    onStartExam={handleStartExam}
                                />
                                <ReviewCard
                                    title="THI HỘI"
                                    weeks="Học Kỳ 2"
                                    duration="15 phút"
                                    questions="30 câu"
                                    color="bg-sky-200/70"
                                    examType="THI_HOI"
                                    onStartExam={handleStartExam}
                                />
                                <div className="md:col-span-2">
                                    <ReviewCard
                                        title="THI ĐÌNH"
                                        weeks="Cả Năm"
                                        duration="30 phút"
                                        questions="30 câu"
                                        color="bg-lime-200/70"
                                        examType="THI_DINH"
                                        onStartExam={handleStartExam}
                                    />
                                </div>
                            </div>
                        </VietSection>
                    </div>
                    <div className="lg:col-span-1">
                        <VietSection title="Võ Công Của Tí">
                            <div className="space-y-6 flex-grow">
                                <SkillBar name="Phép trừ" percentage={60} level="Yếu" />
                                <SkillBar name="Phép nhân" percentage={70} level="Cần cố gắng" />
                                <SkillBar name="Phép cộng" percentage={90} level="Tốt" />
                            </div>
                        </VietSection>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OnTapPage;
