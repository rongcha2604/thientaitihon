import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import StreakCounter from '../common/StreakCounter';
import ProgressBar from '../common/ProgressBar';
import AchievementBadge from '../common/AchievementBadge';
import LearningAnalytics from '../analytics/LearningAnalytics';
import DeleteDataModal from '../common/DeleteDataModal';
import { useToast } from '../common/ToastNotification';
import LicensePreview from '../security/LicensePreview';
import { getSpiritPetsForGrade, getCurrentGrade } from '../../src/lib/storage/gradeStorage';
import { clearAllProgressForUser } from '../../src/lib/storage/exerciseProgress';
import { useDailyChallenge } from '../../contexts/DailyChallengeContext';

interface SelectedItems {
    character: string | null;
    accessory: string | null;
    frame: string | null;
    sticker: string | null;
}

interface AlbumItem {
    id: string;
    name: string;
    category: string;
    image: string;
    imageFile?: string | null;
}

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
    const { user, logout, updateProfile } = useAuth();
    const { resetDaily } = useDailyChallenge();
    const { showToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isEditingGrade, setIsEditingGrade] = useState(false);
    const [newGrade, setNewGrade] = useState<number | undefined>(undefined);
    const [showLicensePreview, setShowLicensePreview] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AlbumItem | null>(null); // Đổi từ selectedCharacter thành selectedItem để hỗ trợ tất cả categories
    const [activeSpiritPet, setActiveSpiritPet] = useState<{ pet: any; userPet: any } | null>(null);

    // Helper: Tạo đường dẫn ảnh cho spirit pet dựa trên code và level
    const getSpiritPetImage = (spiritPet: any, level: number): string | null => {
        if (!spiritPet.code || level === 0) {
            return null; // Chưa unlock hoặc không có code
        }
        // Đường dẫn: /icons/spirit-pets/[CODE]_level_[LEVEL].png
        return `/icons/spirit-pets/${spiritPet.code}_level_${level}.png`;
    };

    // Helper: Lấy level data
    const getLevelData = (spiritPet: any, level: number) => {
        const levels = spiritPet.levels as any[];
        return levels.find((l: any) => l.star === level);
    };

    // Load active spirit pet từ localStorage (ưu tiên hơn selectedCharacter) - theo lớp
    const loadActiveSpiritPet = useCallback(async () => {
        try {
            const userId = user?.id || 'guest';
            const currentGrade = getCurrentGrade();
            const userPets = getSpiritPetsForGrade(userId, currentGrade);
            
            if (userPets && userPets.length > 0) {
                // Tìm spirit pet đang active
                const activeUserPet = userPets.find((up: any) => up.isActive === true);
                
                if (activeUserPet) {
                    // Load master data từ spirit-pets.json
                    const response = await fetch('/data/spirit-pets.json');
                    if (response.ok) {
                        const data = await response.json();
                        const pet = data.pets.find((p: any) => p.id === activeUserPet.spiritPetId);
                        if (pet) {
                            setActiveSpiritPet({ pet, userPet: activeUserPet });
                            return; // Ưu tiên spirit pet, không load character
                        }
                    }
                }
            }
            // Nếu không có active spirit pet, set về null
            setActiveSpiritPet(null);
        } catch (error) {
            console.error('Error loading active spirit pet:', error);
            setActiveSpiritPet(null);
        }
    }, [user?.id]);

    useEffect(() => {
        loadActiveSpiritPet();
    }, [loadActiveSpiritPet]);

    // Reload khi quay lại tab/window (để cập nhật ảnh đại diện sau khi đặt trong Album)
    useEffect(() => {
        const handleFocus = () => {
            loadActiveSpiritPet();
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [loadActiveSpiritPet]);

    // Load selected item từ localStorage (hỗ trợ tất cả categories: character, accessory, frame, sticker)
    const loadSelectedItem = useCallback(async () => {
        if (activeSpiritPet) {
            setSelectedItem(null); // Không load item nếu có active spirit pet
            return;
        }

        try {
            // Load selectedItems từ localStorage
            const userId = user?.id || 'guest';
            const key = `album_selected_items_${userId}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                const selectedItems: SelectedItems = JSON.parse(stored);
                
                // Tìm item được chọn từ bất kỳ category nào (ưu tiên: character > accessory > frame > sticker)
                const selectedItemId = selectedItems.character || selectedItems.accessory || selectedItems.frame || selectedItems.sticker;
                const selectedCategory = selectedItems.character ? 'character' 
                    : selectedItems.accessory ? 'accessory'
                    : selectedItems.frame ? 'frame'
                    : selectedItems.sticker ? 'sticker'
                    : null;

                if (selectedItemId && selectedCategory) {
                    // Load album items để tìm item
                    const response = await fetch('/data/album-items.json');
                    if (response.ok) {
                        const data = await response.json();
                        const item = data.items.find(
                            (item: AlbumItem) => item.id === selectedItemId && item.category === selectedCategory
                        );
                        if (item) {
                            setSelectedItem(item);
                            return;
                        }
                    }
                }
            }
            // Nếu không có item nào được chọn
            setSelectedItem(null);
        } catch (error) {
            console.error('Error loading selected item:', error);
            setSelectedItem(null);
        }
    }, [user?.id, activeSpiritPet]);

    useEffect(() => {
        loadSelectedItem();
    }, [loadSelectedItem]);

    // Sync newName khi user.fullName thay đổi
    useEffect(() => {
        if (!isEditingName && user?.fullName) {
            setNewName(user.fullName);
        }
    }, [user?.fullName, isEditingName]);

    // Sync newGrade khi user.grade thay đổi
    useEffect(() => {
        if (!isEditingGrade && user?.grade) {
            setNewGrade(user.grade);
        }
    }, [user?.grade, isEditingGrade]);

    // Reload khi localStorage thay đổi (khi user chọn item mới trong Album)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key && e.key.startsWith('album_selected_items_')) {
                loadSelectedItem();
            }
            if (e.key && e.key.startsWith('user_spirit_pets_')) {
                loadActiveSpiritPet();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Custom event cho cùng tab (AlbumPage sẽ dispatch event khi save)
        const handleSelectedItemsChanged = () => {
            loadSelectedItem();
        };
        
        const handleSpiritPetsChanged = () => {
            loadActiveSpiritPet();
        };
        
        window.addEventListener('album_selected_items_changed', handleSelectedItemsChanged);
        window.addEventListener('user_spirit_pets_changed', handleSpiritPetsChanged);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('album_selected_items_changed', handleSelectedItemsChanged);
            window.removeEventListener('user_spirit_pets_changed', handleSpiritPetsChanged);
        };
    }, [loadSelectedItem, loadActiveSpiritPet]);

    const handleLogout = async () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            await logout();
            window.location.reload(); // Reload để redirect về login
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

    const handleStartEditName = () => {
        setNewName(user?.fullName || '');
        setIsEditingName(true);
    };

    const handleCancelEditName = () => {
        setIsEditingName(false);
        setNewName('');
    };

    const handleSaveName = async () => {
        if (!newName.trim()) {
            showToast('Vui lòng nhập tên!', 'error');
            return;
        }

        try {
            await updateProfile({ fullName: newName.trim() });
            showToast('Đã đổi tên thành công!', 'success');
            setIsEditingName(false);
            setNewName('');
        } catch (error) {
            console.error('Error updating name:', error);
            showToast('Không thể đổi tên. Vui lòng thử lại!', 'error');
        }
    };

    const handleStartEditGrade = () => {
        setNewGrade(user?.grade || 1);
        setIsEditingGrade(true);
    };

    const handleCancelEditGrade = () => {
        setIsEditingGrade(false);
        setNewGrade(undefined);
    };

    const handleSaveGrade = async () => {
        if (!newGrade || newGrade < 1 || newGrade > 5) {
            showToast('Vui lòng chọn lớp từ 1 đến 5!', 'error');
            return;
        }

        try {
            await updateProfile({ grade: newGrade });
            showToast('Đã đổi lớp thành công!', 'success');
            setIsEditingGrade(false);
            setNewGrade(undefined);
            // Reload spirit pets sau khi đổi lớp
            loadActiveSpiritPet();
        } catch (error) {
            console.error('Error updating grade:', error);
            showToast('Không thể đổi lớp. Vui lòng thử lại!', 'error');
        }
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
                                    {activeSpiritPet ? (
                                        // Hiển thị linh vật đang active (ưu tiên cao nhất)
                                        (() => {
                                            const level = activeSpiritPet.userPet.currentLevel;
                                            const levelData = getLevelData(activeSpiritPet.pet, level);
                                            const imagePath = getSpiritPetImage(activeSpiritPet.pet, level);
                                            return imagePath ? (
                                                <img 
                                                    src={imagePath} 
                                                    alt={levelData?.name_vi || activeSpiritPet.pet.baseNameVi}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        // Fallback về emoji nếu ảnh không load được
                                                        const parent = e.currentTarget.parentElement;
                                                        if (parent) {
                                                            e.currentTarget.style.display = 'none';
                                                            const emojiSpan = document.createElement('span');
                                                            emojiSpan.className = 'text-6xl';
                                                            emojiSpan.textContent = '🐉';
                                                            parent.appendChild(emojiSpan);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-6xl">🐉</span>
                                            );
                                        })()
                                    ) : selectedItem ? (
                                        // Hiển thị item đã chọn từ bất kỳ category nào (nếu không có active spirit pet)
                                        selectedItem.imageFile ? (
                                            <img 
                                                src={selectedItem.imageFile} 
                                                alt={selectedItem.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback về emoji nếu ảnh không load được
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        e.currentTarget.style.display = 'none';
                                                        const emojiSpan = document.createElement('span');
                                                        emojiSpan.className = 'text-6xl';
                                                        emojiSpan.textContent = selectedItem.image;
                                                        parent.appendChild(emojiSpan);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <span className="text-6xl">{selectedItem.image}</span>
                                        )
                                    ) : (
                                        // Mặc định: Trang Ti avatar
                                        <TrangTiAvatar />
                                    )}
                                </div>
                            </div>
                        </div>
                        {isEditingName ? (
                            <div className="w-full space-y-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-2 text-2xl font-black text-amber-900 text-center rounded-2xl border-2 border-amber-700/40 focus:outline-none focus:border-amber-700"
                                    placeholder="Nhập tên mới"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveName();
                                        } else if (e.key === 'Escape') {
                                            handleCancelEditName();
                                        }
                                    }}
                                />
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={handleSaveName}
                                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
                                    >
                                        💾 Lưu
                                    </button>
                                    <button
                                        onClick={handleCancelEditName}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
                                    >
                                        ❌ Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="flex items-center justify-center gap-2">
                                    <h2 className="text-3xl font-black text-amber-900">{user?.fullName || 'Bạn nhỏ'}</h2>
                                    <button
                                        onClick={handleStartEditName}
                                        className="p-2 hover:bg-amber-100 rounded-full transition-all active:scale-95"
                                        title="Đổi tên"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            </div>
                        )}
                        {isEditingGrade ? (
                            <div className="w-full space-y-2">
                                <select
                                    value={newGrade || 1}
                                    onChange={(e) => setNewGrade(Number(e.target.value))}
                                    className="w-full px-4 py-2 text-lg font-semibold text-amber-900 text-center rounded-2xl border-2 border-amber-700/40 focus:outline-none focus:border-amber-700 bg-white"
                                >
                                    <option value={1}>Lớp 1</option>
                                    <option value={2}>Lớp 2</option>
                                    <option value={3}>Lớp 3</option>
                                    <option value={4}>Lớp 4</option>
                                    <option value={5}>Lớp 5</option>
                                </select>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={handleSaveGrade}
                                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
                                    >
                                        💾 Lưu
                                    </button>
                                    <button
                                        onClick={handleCancelEditGrade}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
                                    >
                                        ❌ Hủy
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-amber-800 font-semibold">
                                    {user?.grade ? `Lớp ${user.grade}` : 'Chưa chọn lớp'}
                                </p>
                                <button
                                    onClick={handleStartEditGrade}
                                    className="p-2 hover:bg-amber-100 rounded-full transition-all active:scale-95"
                                    title="Đổi lớp"
                                >
                                    ✏️
                                </button>
                            </div>
                        )}
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

                    {/* Góc Phụ Huynh - Beta mode: Không cần PIN */}
                    <VietSection title="👨‍👩‍👧 Góc Phụ Huynh">
                        <div className="space-y-4">
                            {/* License Preview Button (for testing) */}
                            <button
                                onClick={() => setShowLicensePreview(true)}
                                className="w-full bg-blue-200/80 text-blue-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-blue-700/20"
                            >
                                🔍 Xem Trước Thông Báo License
                            </button>
                            
                            {/* Delete Data Button */}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full bg-red-200/80 text-red-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-700/20"
                            >
                                🗑️ Xóa Dữ Liệu
                            </button>
                        </div>
                    </VietSection>
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
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-200/80 text-red-900 font-bold py-4 rounded-3xl shadow-viet-style-raised hover:scale-105 active:scale-95 active:shadow-viet-style-pressed transition-all border-2 border-red-700/20 mt-4"
                    >
                        🚪 Đăng Xuất
                    </button>
                </div>
            </main>

            {/* Delete Data Modal */}
            <DeleteDataModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteData}
                parentPin={user?.parentPin || ''}
            />

            {/* License Preview Modal */}
            {showLicensePreview && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowLicensePreview(false)}
                            className="absolute top-4 right-4 bg-red-500 text-white font-bold w-10 h-10 rounded-full hover:scale-110 transition-all z-10 flex items-center justify-center"
                        >
                            ✕
                        </button>
                        <LicensePreview />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HoSoPage;
