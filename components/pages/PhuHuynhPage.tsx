import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import DeleteDataModal from '../common/DeleteDataModal';
import DonateButton from '../common/DonateButton';
import DonateModal from '../common/DonateModal';
import { useToast } from '../common/ToastNotification';
import { clearAllProgressForUser } from '../../src/lib/storage/exerciseProgress';
import { useDailyChallenge } from '../../contexts/DailyChallengeContext';

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
        <div className="bg-yellow-100/40 p-4 rounded-2xl shadow-viet-style-pressed h-full">
            {children}
        </div>
    </div>
);

const PhuHuynhPage: React.FC = () => {
    const { user } = useAuth();
    const { resetDaily } = useDailyChallenge();
    const { showToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);

    // Beta mode: Tab "Ủng hộ" auto mở DonateModal khi vào tab
    useEffect(() => {
        setShowDonateModal(true);
    }, []);

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

    // Beta mode: Hiển thị Parent Dashboard ngay lập tức (không cần PIN verification)
    return (
        <div>
            <VietHeader title="Góc Phụ Huynh" icon="👨‍👩‍👧" />
            <main className="p-4 md:p-6 space-y-6">
                <VietSection title="👨‍👩‍👧 Quản Lý">
                    <div className="space-y-4">
                        {/* Donate Button - Nhẹ nhàng, tinh tế */}
                        <DonateButton onClick={() => setShowDonateModal(true)} />

                        {/* Delete Data Button */}
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full bg-red-200/80 text-red-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-700/20"
                        >
                            🗑️ Xóa Dữ Liệu
                        </button>
                    </div>
                </VietSection>

                <VietSection title="ℹ️ Thông Tin">
                    <div className="space-y-3 text-sm text-amber-800">
                        <p className="font-semibold">Tài khoản:</p>
                        <p>{user?.email}</p>
                        {user?.fullName && (
                            <>
                                <p className="font-semibold mt-3">Tên:</p>
                                <p>{user.fullName}</p>
                            </>
                        )}
                        {user?.grade && (
                            <>
                                <p className="font-semibold mt-3">Lớp:</p>
                                <p>Lớp {user.grade}</p>
                            </>
                        )}
                    </div>
                </VietSection>
            </main>

            {/* Delete Data Modal */}
            <DeleteDataModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteData}
                parentPin={user?.parentPin || ''}
            />

            {/* Donate Modal */}
            <DonateModal
                isOpen={showDonateModal}
                onClose={() => setShowDonateModal(false)}
            />
        </div>
    );
};

export default PhuHuynhPage;

