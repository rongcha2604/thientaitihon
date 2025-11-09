import React from 'react';

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

const ReviewCard: React.FC<{ title: string; weeks: string; duration: string; questions: string; color: string; }> = ({ title, weeks, duration, questions, color }) => (
    <div className={`p-5 rounded-3xl border-2 border-amber-900/30 shadow-viet-style-raised flex flex-col h-full ${color}`}>
        <div className="flex-grow">
            <h3 className="font-black text-2xl text-amber-900">{title}</h3>
            <div className="text-sm text-amber-800 space-y-1 mt-2 font-semibold">
                <p><strong>Tuần:</strong> {weeks}</p>
                <p><strong>⏰ Thời gian:</strong> {duration}</p>
                <p><strong>❓ Câu hỏi:</strong> {questions}</p>
            </div>
        </div>
        <button className="w-full mt-4 bg-white/80 text-amber-900 font-bold py-3 rounded-2xl text-base shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all">
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

const OnTapPage: React.FC = () => {
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
                            />
                            <ReviewCard
                                title="THI HỘI"
                                weeks="Học Kỳ 2"
                                duration="15 phút"
                                questions="30 câu"
                                color="bg-sky-200/70"
                            />
                             <div className="md:col-span-2">
                                <ReviewCard
                                    title="THI ĐÌNH"
                                    weeks="Cả Năm"
                                    duration="30 phút"
                                    questions="60 câu"
                                    color="bg-lime-200/70"
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
