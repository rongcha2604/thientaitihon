import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import StreakCounter from '../common/StreakCounter';
import ProgressBar from '../common/ProgressBar';
import AchievementBadge from '../common/AchievementBadge';
import LearningAnalytics from '../analytics/LearningAnalytics';
import PINEntryModal from '../common/PINEntryModal';
import DeleteDataModal from '../common/DeleteDataModal';
import { useToast } from '../common/ToastNotification';
import { clearAllProgressForUser } from '../../src/lib/storage/exerciseProgress';
import { useDailyChallenge } from '../../contexts/DailyChallengeContext';

const VietHeader: React.FC<{ title: string; icon: string; onLogout?: () => void }> = ({ title, icon, onLogout }) => (
    <header className="p-4 text-center relative">
        <div className="inline-block bg-[#FDFBF5]/80 py-3 px-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
            <h1 className="text-3xl font-black text-amber-900 flex items-center justify-center">
                <span className="text-4xl mr-3 drop-shadow-md">{icon}</span>
                <span>{title}</span>
            </h1>
        </div>
        {onLogout && (
            <button
                onClick={onLogout}
                className="absolute top-4 right-4 bg-red-200/80 text-red-900 font-bold px-4 py-2 rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-700/20 text-sm"
            >
                🚪 Đăng Xuất
            </button>
        )}
    </header>
);

const VietSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-[#FDFBF5]/80 p-5 rounded-3xl shadow-viet-style-raised h-full border-2 border-yellow-700/20">
        <h2 className="text-xl font-bold text-green-800 mb-4">{title}</h2>
        <div className="bg-yellow-100/40 p-4 rounded-2xl shadow-viet-style-pressed h-full">
            {children}
        </div>
    </div>
);

const TrangTiAvatar: React.FC = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <g>
            {/* Face */}
            <circle cx="50" cy="55" r="25" fill="#FFE4C4" />
            {/* Hair */}
            <path d="M 50 20 Q 25 30, 25 55 A 25 25 0 0 0 75 55 Q 75 30, 50 20 Z" fill="#2C2C2C" />
            <circle cx="50" cy="25" r="7" fill="#2C2C2C" />
            {/* Eyes */}
            <circle cx="40" cy="55" r="2" fill="#2C2C2C" />
            <circle cx="60" cy="55" r="2" fill="#2C2C2C" />
            {/* Smile */}
            <path d="M 45 65 Q 50 70, 55 65" stroke="#2C2C2C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Khan Dong */}
            <path d="M 20 50 L 80 50 L 75 40 L 25 40 Z" fill="#3B82F6" />
            <rect x="25" y="40" width="50" height="5" fill="#2563EB" />
        </g>
    </svg>
);

const LotusMedal: React.FC<{ type: 'gold' | 'silver' | 'bronze', size: string }> = ({ type, size }) => {
    const colors = {
        gold: { outer: '#FFD700', inner: '#FFA500' },
        silver: { outer: '#C0C0C0', inner: '#A9A9A9' },
        bronze: { outer: '#CD7F32', inner: '#8B4513' },
    }
    return (
        <svg viewBox="0 0 24 24" className={`${size} drop-shadow-lg group-hover:scale-110 transition-transform`}>
            <defs>
                <radialGradient id={`${type}Gradient`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{stopColor: colors[type].outer, stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: colors[type].inner, stopOpacity: 1}} />
                </radialGradient>
            </defs>
            <path fill={`url(#${type}Gradient)`} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.13 14.87c-.32.32-.75.5-1.19.5-.44 0-.87-.18-1.19-.5-.66-.66-.66-1.72 0-2.38.32-.32.75-.5 1.19-.5.44 0 .87.18 1.19.5.66.66.66 1.72 0 2.38zm4.64 0c-.32.32-.75.5-1.19.5-.44 0-.87-.18-1.19-.5-.66-.66-.66-1.72 0-2.38.32-.32.75-.5 1.19-.5.44 0 .87.18 1.19.5.66.66.66 1.72 0 2.38zm-2.32-5.37c-1.38 0-2.5-1.12-2.5-2.5S9.81 9.5 11.19 9.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" transform="scale(0.8) translate(3,3)" />
            <path fill={`url(#${type}Gradient)`} d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM12,20a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/>
            <path fill={colors[type].outer} d="M12 9a3 3 0 00-3 3c0 2.76 3 6 3 6s3-3.24 3-6a3 3 0 00-3-3zm0 4a1 1 0 110-2 1 1 0 010 2z"/>
        </svg>
    )
}


const HoSoPage: React.FC = () => {
    const { user, logout, refreshUser } = useAuth();
    const { resetDaily } = useDailyChallenge();
    const { showToast } = useToast();
    const [showParentModal, setShowParentModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isParentVerified, setIsParentVerified] = useState(false);

    // Restore parentPin khi component mount hoặc user thay đổi
    useEffect(() => {
        if (user?.id && (!user?.parentPin || user.parentPin === undefined || user.parentPin === null || user.parentPin === '')) {
            console.log('🔍 HoSoPage useEffect: Restoring parentPin for user:', user.email, 'current parentPin:', user?.parentPin);
            refreshUser().then(() => {
                console.log('✅ HoSoPage useEffect: refreshUser completed');
            }).catch((error) => {
                console.error('❌ HoSoPage useEffect: refreshUser error:', error);
            });
        } else if (user?.parentPin) {
            console.log('✅ HoSoPage useEffect: User already has parentPin:', user.email, user.parentPin);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleLogout = async () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            await logout();
            window.location.reload(); // Reload để redirect về login
        }
    };

    const handleParentClick = () => {
        // Debug: Log user và parentPin để kiểm tra
        console.log('🔍 handleParentClick(): user:', user);
        console.log('🔍 handleParentClick(): user?.parentPin:', user?.parentPin);
        console.log('🔍 handleParentClick(): typeof user?.parentPin:', typeof user?.parentPin);
        
        // Nếu chưa có PIN, yêu cầu đăng ký PIN
        // Check: undefined, null, empty string
        if (!user?.parentPin || user.parentPin === undefined || user.parentPin === null || user.parentPin === '') {
            console.log('❌ handleParentClick(): No parentPin found!');
            showToast('Vui lòng đăng ký mã PIN trong phần đăng ký!', 'warning');
            return;
        }
        
        console.log('✅ handleParentClick(): parentPin found, opening PIN entry modal');
        setShowParentModal(true);
    };

    const handleParentPINVerify = (pin: string) => {
        if (pin === user?.parentPin) {
            setIsParentVerified(true);
            setShowParentModal(false);
            showToast('Đã xác thực PIN! Vào Góc Phụ Huynh...', 'success');
        } else {
            showToast('PIN không đúng! Vui lòng thử lại.', 'error');
        }
    };

    const handleDeleteData = () => {
        if (!user?.id) {
            showToast('Không tìm thấy thông tin người dùng!', 'error');
            return;
        }

        // Xóa tất cả exercise progress
        clearAllProgressForUser(user.id);
        
        // Xóa selection data
        const selectionKey = `learning_selection_${user.id}`;
        localStorage.removeItem(selectionKey);
        
        // Xóa daily challenge progress
        localStorage.removeItem('daily_challenges');
        localStorage.removeItem('daily_challenges_last_reset');
        resetDaily(); // Reset daily challenges
        
        // Xóa album progress (nếu có)
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('album_') || key.startsWith('collection_')) {
                localStorage.removeItem(key);
            }
        });

        showToast('Đã xóa toàn bộ dữ liệu! Bé có thể học lại từ đầu.', 'success');
        setShowDeleteModal(false);
        
        // Reload page để refresh data
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <div>
            <VietHeader title="Góc Nhỏ Của Tí" icon="🏡" onLogout={handleLogout} />
            <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#FDFBF5]/80 p-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full bg-yellow-200 shadow-viet-style-pressed flex items-center justify-center p-2 border-4 border-amber-800/20">
                                <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-blue-300 rounded-full flex items-center justify-center overflow-hidden">
                                   <TrangTiAvatar />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-amber-900">{user?.fullName || 'Bạn nhỏ'}</h2>
                        <p className="text-amber-800 font-semibold">
                            {user?.grade ? `Lớp ${user.grade}` : 'Chưa chọn lớp'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-yellow-200/80 p-3 rounded-2xl shadow-viet-style-raised border border-yellow-700/20">
                            <p className="text-3xl font-black text-yellow-700">250</p>
                            <p className="text-sm text-amber-900 font-semibold">Thóc 🌾</p>
                        </div>
                        <div className="bg-red-200/80 p-3 rounded-2xl shadow-viet-style-raised border border-red-700/20 flex flex-col items-center justify-center">
                            <StreakCounter streak={5} size="small" showLabel={false} />
                            <p className="text-xs text-amber-900 font-semibold mt-1">Ngày liên tiếp</p>
                        </div>
                         <div className="bg-green-200/80 p-3 rounded-2xl shadow-viet-style-raised border border-green-700/20">
                            <p className="text-3xl font-black text-green-700">12</p>
                            <p className="text-sm text-amber-900 font-semibold">Chặng 🚩</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <VietSection title="🎋 Cây Tre Trăm Đốt (Học 5 ngày)">
                        <div className="flex items-end justify-center h-full text-7xl space-x-[-15px] mb-4">
                           <div className="text-8xl transform -scale-x-100 -rotate-12">🍃</div>
                           <div className="text-9xl relative" style={{ color: '#659B5E'}}>
                                <div className="absolute w-full h-2 bg-black/20 bottom-1/4 rounded-full"></div>
                                ┃
                           </div>
                           <div className="text-8xl relative" style={{ color: '#55824D'}}>
                                <div className="absolute w-full h-2 bg-black/20 bottom-1/4 rounded-full"></div>
                                ┃
                           </div>
                            <div className="text-7xl relative" style={{ color: '#44693C'}}>
                                <div className="absolute w-full h-2 bg-black/20 bottom-1/4 rounded-full"></div>
                                ┃
                           </div>
                           <div className="text-8xl rotate-12">🍃</div>
                        </div>
                        <div className="mb-4">
                            <ProgressBar progress={60} current={3} total={5} color="green" animated />
                        </div>
                        <p className="text-center text-sm text-amber-800 mt-2 font-semibold">Học mỗi ngày để tre mau cao lớn nhé!</p>
                    </VietSection>
                    
                    <VietSection title="🏅 Bảng Vàng Thành Tích">
                        <div className="flex justify-around items-end h-full">
                            <div className="text-center group flex flex-col items-center">
                                <LotusMedal type="silver" size="w-20 h-20" />
                                <p className="text-xs font-bold mt-1 text-amber-900">Văn Hay</p>
                            </div>
                            <div className="text-center group flex flex-col items-center">
                                <LotusMedal type="gold" size="w-24 h-24" />
                                <p className="text-sm font-bold mt-1 text-amber-900">Toán Giỏi</p>
                            </div>
                            <div className="text-center group flex flex-col items-center">
                                <LotusMedal type="bronze" size="w-16 h-16" />
                                <p className="text-xs font-bold mt-1 text-amber-900">Chăm Chỉ</p>
                            </div>
                        </div>
                    </VietSection>
                    
                    <LearningAnalytics />
                    
                    {/* Góc Phụ Huynh Button */}
                    <button 
                        onClick={handleParentClick}
                        className="w-full bg-sky-200/80 text-amber-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-sky-700/20"
                    >
                        🔐 Góc Phụ Huynh
                    </button>

                    {/* Parent Dashboard (chỉ hiện khi đã verify PIN) */}
                    {isParentVerified && (
                        <div className="bg-blue-100/50 p-5 rounded-3xl shadow-viet-style-raised border-2 border-blue-700/20 space-y-4">
                            <h3 className="text-xl font-black text-blue-900 mb-4">👨‍👩‍👧 Góc Phụ Huynh</h3>
                            
                            {/* Delete Data Button */}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full bg-red-200/80 text-red-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-700/20"
                            >
                                🗑️ Xóa Dữ Liệu
                            </button>

                            {/* Close Parent Dashboard */}
                            <button
                                onClick={() => setIsParentVerified(false)}
                                className="w-full bg-amber-200/80 text-amber-900 font-bold py-3 rounded-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-amber-700/20 text-sm"
                            >
                                ← Quay lại
                            </button>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-200/80 text-red-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-700/20 mt-4"
                    >
                        🚪 Đăng Xuất
                    </button>
                </div>
            </main>

            {/* PIN Entry Modal for Parent Access */}
            <PINEntryModal
                isOpen={showParentModal}
                title="🔐 Góc Phụ Huynh"
                description="Nhập mã PIN 4 số để vào Góc Phụ Huynh"
                onVerify={handleParentPINVerify}
                onCancel={() => setShowParentModal(false)}
                maxLength={4}
            />

            {/* Delete Data Modal */}
            <DeleteDataModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteData}
                parentPin={user?.parentPin}
            />
        </div>
    );
};

export default HoSoPage;
