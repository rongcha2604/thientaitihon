import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

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

interface OnTapPageProps {
  onStartExam?: (examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH', weekId: number, bookSeries: string, grade: number, subject: string) => void;
}

const OnTapPage: React.FC<OnTapPageProps> = ({ onStartExam }) => {
    const { user } = useAuth();
    
    // Lấy thông tin từ localStorage hoặc user (tương tự HocPage)
    const getDefaultSelection = () => {
        if (user?.grade && user.grade >= 1 && user.grade <= 5) {
            return {
                bookSeries: 'ket-noi-tri-thuc', // Default
                grade: user.grade,
                subject: 'math', // Default
            };
        }
        // Fallback từ localStorage
        const savedBook = localStorage.getItem('selectedBook') || 'ket-noi-tri-thuc';
        const savedGrade = parseInt(localStorage.getItem('selectedGrade') || '1', 10);
        const savedSubject = localStorage.getItem('selectedSubject') || 'math';
        return {
            bookSeries: savedBook,
            grade: savedGrade,
            subject: savedSubject,
        };
    };

    const handleStartExam = (examType: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH') => {
        const selection = getDefaultSelection();
        // Map bookSeries từ folder name về display name (nếu cần)
        const bookSeriesMap: { [key: string]: string } = {
            'ket-noi-tri-thuc': 'Kết nối tri thức',
            'chan-troi-sang-tao': 'Chân trời sáng tạo',
            'cung-hoc': 'Phát triển năng lực',
            'vi-su-binh-dang': 'Bình đẳng & Dân chủ',
        };
        const bookSeriesDisplay = bookSeriesMap[selection.bookSeries] || selection.bookSeries;
        
        // Map subject từ folder name về display name
        const subjectMap: { [key: string]: string } = {
            'math': 'Toán',
            'vietnamese': 'Tiếng Việt',
        };
        const subjectDisplay = subjectMap[selection.subject] || selection.subject;
        
        // THI HƯƠNG: Học Kỳ 1 (tuần 1-18), THI HỘI: Học Kỳ 2 (tuần 19-35), THI ĐÌNH: Cả Năm
        // Dùng weekId = 1 làm placeholder, ExercisePage sẽ tự load questions phù hợp
        const weekId = 1; // Placeholder, ExercisePage sẽ load questions từ nhiều tuần
        
        if (onStartExam) {
            onStartExam(examType, weekId, bookSeriesDisplay, selection.grade, subjectDisplay);
        }
    };

    return (
        <div>
            <VietHeader title="Thử Tài Trạng Tí" icon="📜" />
            <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            </main>
        </div>
    );
};

export default OnTapPage;
