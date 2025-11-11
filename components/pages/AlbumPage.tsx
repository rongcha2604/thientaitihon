import React, { useState, useEffect } from 'react';
import { AlbumItem } from '../../types';

// Extend AlbumItem type để có imageFile
interface AlbumItemWithImage extends AlbumItem {
    imageFile?: string | null;
}

// Interface cho selected items
interface SelectedItems {
    character: string | null;
    accessory: string | null;
    frame: string | null;
    sticker: string | null;
}
import ProgressBar from '../common/ProgressBar';
import CardOpening from '../common/CardOpening';
import { playSound } from '../common/SoundEffects';
import { getAlbumItems, purchaseItem, type AlbumItem as APIAlbumItem } from '../../src/lib/api/album';
import { getUserCoins, type CoinsResponse } from '../../src/lib/api/coins';
import { getStarsForGrade, setStarsForGrade, getCoinsForGrade, setCoinsForGrade, getSpiritPetsForGrade, setSpiritPetsForGrade, getCurrentGrade } from '../../src/lib/storage/gradeStorage';
// Removed API imports - using localStorage only
import { useAuth } from '../../src/contexts/AuthContext';
import { useToast } from '../common/ToastNotification';

const VietHeader: React.FC<{ title: string; icon: string; coins?: number; stars?: number }> = ({ title, icon, coins, stars }) => (
    <header className="p-4 text-center">
        <div className="inline-block bg-[#FDFBF5]/80 py-3 px-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
            <h1 className="text-3xl font-black text-amber-900 flex items-center justify-center flex-wrap gap-2">
                <span className="text-4xl mr-3 drop-shadow-md">{icon}</span>
                <span>{title}</span>
                {coins !== undefined && (
                    <span className="px-3 py-1 bg-yellow-400 rounded-full text-lg font-bold text-amber-900 flex items-center gap-1">
                        <span>🪙</span>
                        <span>{coins}</span>
                    </span>
                )}
                {stars !== undefined && (
                    <span className="px-3 py-1 bg-purple-400 rounded-full text-lg font-bold text-purple-900 flex items-center gap-1">
                        <span>⭐</span>
                        <span>{stars}</span>
                    </span>
                )}
            </h1>
        </div>
    </header>
);

const FilterButton: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-bold transition-all duration-300 transform active:scale-95 border-2 border-amber-800/20 ${
            isActive ? 'bg-green-300/80 text-slate-800 shadow-viet-style-pressed scale-95' : 'bg-[#FDFBF5] text-amber-800 shadow-viet-style-raised hover:scale-105'
        }`}
    >
        <span>{icon}</span>
        <span>{label}</span>
    </button>
);

interface ItemCardProps {
    item: AlbumItemWithImage;
    coins: number;
    onClick: () => void;
    onPurchase?: () => void;
    isSelected?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, coins, onClick, onPurchase, isSelected = false }) => {
    const isOwned = item.owned || item.unlocked;
    const canAfford = item.price !== undefined && coins >= item.price;
    const showPurchase = !isOwned && item.price !== undefined;

    return (
        <div className="relative">
            <button
                onClick={isOwned ? onClick : undefined}
                className={`relative aspect-square rounded-3xl transition-all duration-300 border-2 ${
                    isSelected
                        ? 'border-green-500 shadow-lg ring-4 ring-green-300/50'
                        : isOwned 
                            ? 'border-amber-900/30 bg-[#FDFBF5] shadow-viet-style-raised hover:scale-105 active:scale-95 cursor-pointer' 
                            : 'border-amber-900/30 bg-yellow-100/50 shadow-viet-style-pressed cursor-default'
                }`}
            >
                <div className={`flex items-center justify-center w-full h-full transition-all duration-300 ${isOwned ? 'scale-100' : 'scale-90 opacity-40'}`}>
                    {item.imageFile ? (
                        // Hiển thị ảnh nếu có imageFile
                        <img 
                            src={item.imageFile} 
                            alt={item.name}
                            className="w-full h-full object-contain rounded-3xl"
                            onError={(e) => {
                                // Nếu ảnh không load được, fallback về emoji
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    e.currentTarget.style.display = 'none';
                                    const emojiSpan = document.createElement('span');
                                    emojiSpan.className = 'text-6xl md:text-7xl drop-shadow-lg';
                                    emojiSpan.textContent = item.image;
                                    parent.appendChild(emojiSpan);
                                }
                            }}
                        />
                    ) : (
                        // Hiển thị emoji nếu không có imageFile
                        <span className="text-6xl md:text-7xl drop-shadow-lg">{item.image}</span>
                    )}
                </div>
                {!isOwned && (
                    <div className="absolute inset-0 bg-slate-100/50 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-4xl text-slate-500">🔒</span>
                    </div>
                )}
                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
                        <span className="text-white text-xs font-black">✓</span>
                    </div>
                )}
                {isOwned && (
                    <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-900 truncate w-11/12 text-center bg-white/50 rounded-full px-2">
                        {item.name}
                    </p>
                )}
            </button>
            
            {/* Giá và nút đổi */}
            {showPurchase && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full">
                    <div className={`bg-white rounded-2xl p-2 shadow-lg border-2 ${
                        canAfford ? 'border-green-500' : 'border-red-300'
                    }`}>
                        <div className="text-center mb-1">
                            <span className="text-xs font-bold text-amber-900 flex items-center justify-center gap-1">
                                <span>🪙</span>
                                <span>{item.price}</span>
                            </span>
                        </div>
                        <button
                            onClick={onPurchase}
                            disabled={!canAfford}
                            className={`w-full py-1 px-2 rounded-xl text-xs font-bold transition-all ${
                                canAfford
                                    ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {canAfford ? 'Đổi' : 'Không đủ'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface PurchaseModalProps {
    isOpen: boolean;
    item: AlbumItemWithImage | null;
    coins: number;
    onConfirm: () => void;
    onCancel: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, item, coins, onConfirm, onCancel }) => {
    if (!isOpen || !item) return null;

    const canAfford = item.price !== undefined && coins >= item.price;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FDFBF5] rounded-3xl p-6 max-w-md w-full shadow-viet-style-raised border-2 border-amber-900/30">
                <div className="text-center">
                    <div className="mb-4 flex items-center justify-center h-32">
                        {item.imageFile ? (
                            <img 
                                src={item.imageFile} 
                                alt={item.name}
                                className="max-w-full max-h-full object-contain rounded-2xl"
                                onError={(e) => {
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        e.currentTarget.style.display = 'none';
                                        const emojiSpan = document.createElement('span');
                                        emojiSpan.className = 'text-8xl';
                                        emojiSpan.textContent = item.image;
                                        parent.appendChild(emojiSpan);
                                    }
                                }}
                            />
                        ) : (
                            <span className="text-8xl">{item.image}</span>
                        )}
                    </div>
                    <h2 className="text-2xl font-black text-amber-900 mb-2">{item.name}</h2>
                    {item.description && (
                        <p className="text-sm text-amber-700 mb-4">{item.description}</p>
                    )}
                    
                    <div className="bg-yellow-100 rounded-2xl p-4 mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-lg font-bold text-amber-900">Giá:</span>
                            <span className="text-2xl font-black text-amber-900 flex items-center gap-1">
                                <span>🪙</span>
                                <span>{item.price}</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold text-amber-900">Coins của bạn:</span>
                            <span className="text-xl font-black text-amber-900 flex items-center gap-1">
                                <span>🪙</span>
                                <span>{coins}</span>
                            </span>
                        </div>
                        {!canAfford && (
                            <p className="text-red-600 text-sm font-bold mt-2">
                                Bạn không đủ coins để đổi vật phẩm này!
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 active:scale-95 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!canAfford}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                                canAfford
                                    ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Xác nhận đổi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlbumPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [filter, setFilter] = useState<'character' | 'accessory' | 'frame' | 'sticker' | 'spirit-pet' | 'owned'>('character');
    const [openingCard, setOpeningCard] = useState<{ name: string; icon: string } | null>(null);
    const [items, setItems] = useState<AlbumItemWithImage[]>([]);
    const [coins, setCoins] = useState<number>(0);
    const [stars, setStars] = useState<number>(0);
    const [spiritPets, setSpiritPets] = useState<any[]>([]);
    const [userSpiritPets, setUserSpiritPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseModal, setPurchaseModal] = useState<{ item: AlbumItemWithImage | null; isOpen: boolean }>({
        item: null,
        isOpen: false,
    });
    const [purchasing, setPurchasing] = useState(false);
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({
        character: null,
        accessory: null,
        frame: null,
        sticker: null,
    });
    const [spiritPetModal, setSpiritPetModal] = useState<{ pet: any; userPet: any; isOpen: boolean }>({
        pet: null,
        userPet: null,
        isOpen: false,
    });
    const [upgradeConfirmModal, setUpgradeConfirmModal] = useState<{ pet: any; userPet: any; isOpen: boolean }>({
        pet: null,
        userPet: null,
        isOpen: false,
    });

    // Load coins và items
    useEffect(() => {
        loadData();
    }, [filter]);

    // Reload stars và coins khi component mount, khi quay lại từ trang khác, hoặc khi đổi lớp
    useEffect(() => {
        const loadStarsAndCoins = () => {
            const currentGrade = getCurrentGrade();
            const storedStars = getStarsForGrade(currentGrade);
            const storedCoins = getCoinsForGrade(currentGrade);
            setStars(storedStars);
            setCoins(storedCoins);
        };
        
        loadStarsAndCoins();
        
        // Listen to gradeChanged event
        const handleGradeChange = () => {
            loadStarsAndCoins();
            // Reload spirit pets từ lớp mới
            const userId = user?.id || 'guest';
            const newGrade = getCurrentGrade();
            const newPets = getSpiritPetsForGrade(userId, newGrade);
            setUserSpiritPets(newPets);
        };
        
        window.addEventListener('gradeChanged', handleGradeChange);
        return () => window.removeEventListener('gradeChanged', handleGradeChange);
    }, [user?.id]);

    // Load selected items khi user thay đổi hoặc component mount
    useEffect(() => {
        loadSelectedItems();
    }, [user?.id]);

    // Load selected items từ localStorage
    const loadSelectedItems = () => {
        try {
            const userId = user?.id || 'guest';
            const key = `album_selected_items_${userId}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored) as SelectedItems;
                setSelectedItems(parsed);
            }
        } catch (error) {
            console.error('Error loading selected items:', error);
        }
    };

    // Lưu selected items vào localStorage
    const saveSelectedItems = (newSelectedItems: SelectedItems) => {
        try {
            const userId = user?.id || 'guest';
            const key = `album_selected_items_${userId}`;
            localStorage.setItem(key, JSON.stringify(newSelectedItems));
            setSelectedItems(newSelectedItems);
            
            // Dispatch custom event để HoSoPage biết và reload
            window.dispatchEvent(new Event('album_selected_items_changed'));
        } catch (error) {
            console.error('Error saving selected items:', error);
        }
    };

    // Load owned items từ localStorage
    const loadOwnedItems = (): string[] => {
        try {
            const userId = user?.id || 'guest';
            const key = `album_owned_items_${userId}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                return JSON.parse(stored) as string[];
            }
            return [];
        } catch (error) {
            console.error('Error loading owned items:', error);
            return [];
        }
    };

    // Lưu owned items vào localStorage
    const saveOwnedItems = (itemId: string) => {
        try {
            const userId = user?.id || 'guest';
            const key = `album_owned_items_${userId}`;
            const ownedItems = loadOwnedItems();
            if (!ownedItems.includes(itemId)) {
                ownedItems.push(itemId);
                localStorage.setItem(key, JSON.stringify(ownedItems));
            }
        } catch (error) {
            console.error('Error saving owned items:', error);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load coins (optional - chỉ load nếu có backend) - theo lớp
            const currentGrade = getCurrentGrade();
            if (user?.id) {
                try {
                    const coinsData = await getUserCoins();
                    setCoins(coinsData.coins);
                    // Sync với localStorage - theo lớp
                    setCoinsForGrade(currentGrade, coinsData.coins);
                } catch (error) {
                    // Nếu không có backend, đọc từ localStorage - theo lớp
                    console.log('Backend not available, using localStorage coins');
                    const storedCoins = getCoinsForGrade(currentGrade);
                    setCoins(storedCoins);
                }

            } else {
                // Không có user → đọc từ localStorage - theo lớp
                const storedCoins = getCoinsForGrade(currentGrade);
                setCoins(storedCoins);
            }

            // Load stars từ localStorage - theo lớp
            const storedStars = getStarsForGrade(currentGrade);
            setStars(storedStars);

            // Load spirit pets từ file JSON local
            try {
                const petsResponse = await fetch('/data/spirit-pets.json');
                if (!petsResponse.ok) {
                    throw new Error('Failed to load spirit pets');
                }
                const petsData = await petsResponse.json();
                setSpiritPets(petsData.pets);
            } catch (error) {
                console.error('Error loading spirit pets:', error);
                setSpiritPets([]);
            }

            // Load user spirit pets từ localStorage - theo lớp
            const userId = user?.id || 'guest';
            // currentGrade đã được khai báo ở trên (dòng 382)
            const userPets = getSpiritPetsForGrade(userId, currentGrade);
            setUserSpiritPets(userPets);
            
            // Load items từ file JSON local (không cần backend)
            const response = await fetch('/data/album-items.json');
            if (!response.ok) {
                throw new Error('Failed to load album items');
            }
            const data = await response.json();
            
            // Filter theo category và convert format
            const allItems = data.items.filter((item: any) => item.isActive);
            
            // Load owned items từ localStorage
            const ownedItemIds = loadOwnedItems();
            const ownedItemIdsSet = new Set(ownedItemIds);
            
            // Convert to AlbumItem format (không filter theo category ở đây, sẽ filter sau)
            const convertedItems: AlbumItemWithImage[] = allItems.map((item: any) => {
                const isOwned = ownedItemIdsSet.has(item.id) || item.owned || false;
                return {
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    image: item.image, // Emoji fallback
                    imageFile: item.imageFile || null, // Path ảnh nếu có
                    price: item.price,
                    description: item.description,
                    owned: isOwned,
                    unlocked: isOwned, // Legacy compatibility
                };
            });
            
            setItems(convertedItems);
        } catch (error) {
            console.error('Error loading album data:', error);
            showToast('Không thể tải dữ liệu album', 'error');
            // Fallback to empty array
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter items (spirit pets sẽ render riêng trong tab "Sở hữu")
    const filteredItems = filter === 'owned' 
        ? items.filter(item => item.owned || item.unlocked) // Tab "Sở hữu": Hiển thị tất cả items đã mua
        : filter === 'spirit-pet'
            ? [] // Spirit pets render riêng
            : items.filter(item => item.category === filter && !(item.owned || item.unlocked)); // Các tab khác: Chỉ hiển thị items CHƯA mua
    
    // Get owned spirit pets for "Sở hữu" tab
    const ownedSpiritPets = userSpiritPets.map(userPet => {
        const pet = spiritPets.find(p => p.id === userPet.spiritPetId);
        return pet ? { pet, userPet } : null;
    }).filter((item): item is { pet: any; userPet: any } => item !== null);
    
    // Tính ownedCount và totalCount cho progress bar
    // (Cần tính từ tất cả items trong category, không phải từ filteredItems)
    const categoryItems = filter === 'owned' 
        ? items // Tab "Sở hữu": Tất cả items
        : filter === 'spirit-pet'
            ? [] // Tab "Linh vật": Không có items thông thường
            : items.filter(item => item.category === filter); // Các tab khác: Items trong category
    
    const ownedCount = categoryItems.filter(item => item.owned || item.unlocked).length;
    const totalCount = filter === 'owned' 
        ? items.length // Tab "Sở hữu": Tổng số items tất cả categories
        : filter === 'spirit-pet'
            ? 0 // Tab "Linh vật": Không có items thông thường
            : categoryItems.length; // Các tab khác: Tổng số items trong category (owned + unowned)
    const progress = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

    const handleCardClick = (item: AlbumItemWithImage) => {
        const isOwned = item.owned || item.unlocked;
        if (isOwned) {
            // Khi chọn item làm ảnh đại diện → Tắt tất cả linh vật đang active
            const hasActiveSpiritPet = userSpiritPets.some(up => up.isActive === true);
            if (hasActiveSpiritPet) {
                // Tắt tất cả linh vật
                const updatedPets = userSpiritPets.map(up => ({
                    ...up,
                    isActive: false,
                }));
                saveUserSpiritPets(updatedPets);
            }
            
            // Lưu selection vào localStorage
            const newSelectedItems: SelectedItems = {
                ...selectedItems,
                [item.category]: item.id,
            };
            saveSelectedItems(newSelectedItems);
            
            playSound('success');
            showToast(`Đã chọn ${item.name} làm ảnh đại diện!`, 'success');
            setOpeningCard({ name: item.name, icon: item.image });
            setTimeout(() => {
                setOpeningCard(null);
            }, 3000);
        } else if (item.price !== undefined) {
            // Mở modal đổi vật phẩm
            setPurchaseModal({ item, isOpen: true });
        }
    };

    const handlePurchase = async () => {
        if (!purchaseModal.item) return;

        const item = purchaseModal.item;
        if (item.price === undefined || coins < item.price) {
            showToast('Bạn không đủ coins!', 'error');
            return;
        }

        try {
            setPurchasing(true);
            
            // Thử gọi API nếu có user?.id, nếu fail thì fallback về demo mode
            let purchaseSuccess = false;
            
            if (user?.id) {
                try {
                    const result = await purchaseItem({ albumItemId: String(item.id) });
                    
                    // Cập nhật coins
                    setCoins(result.coins);
                    // Sync với localStorage - theo lớp
                    const currentGrade = getCurrentGrade();
                    setCoinsForGrade(currentGrade, result.coins);
                    
                    // Lưu owned item vào localStorage
                    saveOwnedItems(item.id);
                    
                    // Cập nhật items (đánh dấu item đã sở hữu)
                    setItems(prevItems => 
                        prevItems.map(i => 
                            i.id === item.id 
                                ? { ...i, owned: true, unlocked: true }
                                : i
                        )
                    );

                    // Khi mua item mới và tự động chọn → Tắt tất cả linh vật đang active
                    const hasActiveSpiritPet = userSpiritPets.some(up => up.isActive === true);
                    if (hasActiveSpiritPet) {
                        // Tắt tất cả linh vật
                        const updatedPets = userSpiritPets.map(up => ({
                            ...up,
                            isActive: false,
                        }));
                        saveUserSpiritPets(updatedPets);
                    }
                    
                    // Tự động lưu selection sau khi purchase thành công
                    const newSelectedItems: SelectedItems = {
                        ...selectedItems,
                        [item.category]: item.id,
                    };
                    saveSelectedItems(newSelectedItems);

                    showToast(`Đã đổi thành công ${item.name}!`, 'success');
                    purchaseSuccess = true;
                } catch (error: any) {
                    console.error('Error purchasing item (backend failed, using demo mode):', error);
                    // Nếu backend fail (network error, connection refused), fallback về demo mode
                    // Không return, tiếp tục với demo mode
                }
            }
            
            // Nếu không có user?.id hoặc backend fail → dùng demo mode
            if (!purchaseSuccess) {
                // Update local state (demo mode)
                const newCoins = coins - item.price;
                setCoins(newCoins);
                // Lưu vào localStorage - theo lớp
                const currentGrade = getCurrentGrade();
                setCoinsForGrade(currentGrade, newCoins);
                
                // Lưu owned item vào localStorage (demo mode)
                saveOwnedItems(item.id);
                
                setItems(prevItems => 
                    prevItems.map(i => 
                        i.id === item.id 
                            ? { ...i, owned: true, unlocked: true }
                            : i
                    )
                );
                
                // Khi mua item mới và tự động chọn (demo mode) → Tắt tất cả linh vật đang active
                const hasActiveSpiritPet = userSpiritPets.some(up => up.isActive === true);
                if (hasActiveSpiritPet) {
                    // Tắt tất cả linh vật
                    const updatedPets = userSpiritPets.map(up => ({
                        ...up,
                        isActive: false,
                    }));
                    saveUserSpiritPets(updatedPets);
                }
                
                // Tự động lưu selection sau khi purchase thành công (demo mode)
                const newSelectedItems: SelectedItems = {
                    ...selectedItems,
                    [item.category]: item.id,
                };
                saveSelectedItems(newSelectedItems);
                
                showToast(`Đã đổi thành công ${item.name}! (Demo mode)`, 'success');
            }

            // Đóng modal
            setPurchaseModal({ item: null, isOpen: false });
            
            // Hiển thị animation mở thẻ
            playSound('success');
            setOpeningCard({ name: item.name, icon: item.image });
            setTimeout(() => {
                setOpeningCard(null);
            }, 3000);
        } catch (error: any) {
            console.error('Error purchasing item:', error);
            showToast('Không thể đổi vật phẩm', 'error');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div>
                <VietHeader title="Gánh Hàng Rong" icon="🧺" coins={coins} stars={stars} />
                <main className="p-4 md:p-6">
                    <div className="text-center text-amber-900 font-bold">Đang tải...</div>
                </main>
            </div>
        );
    }

    // Helper: Lưu user spirit pets vào localStorage
    const saveUserSpiritPets = (pets: any[]) => {
        try {
            const userId = user?.id || 'guest';
            const currentGrade = getCurrentGrade();
            // Lưu vào localStorage - theo lớp
            setSpiritPetsForGrade(userId, currentGrade, pets);
            setUserSpiritPets(pets);
            
            // Dispatch custom event để HoSoPage biết và reload
            window.dispatchEvent(new Event('user_spirit_pets_changed'));
        } catch (error) {
            console.error('Error saving user spirit pets:', error);
        }
    };

    // Helper: Lấy user pet cho một spirit pet
    const getUserPet = (spiritPetId: string): any | undefined => {
        return userSpiritPets.find(up => up.spiritPetId === spiritPetId);
    };

    // Helper: Lấy level hiện tại của user pet
    const getCurrentLevel = (spiritPet: any): number => {
        const userPet = getUserPet(spiritPet.id);
        return userPet?.currentLevel || 0;
    };

    // Helper: Lấy level data
    const getLevelData = (spiritPet: any, level: number) => {
        const levels = spiritPet.levels as any[];
        return levels.find((l: any) => l.star === level);
    };

    // Helper: Tạo đường dẫn ảnh cho spirit pet dựa trên code và level
    const getSpiritPetImage = (spiritPet: any, level: number): string | null => {
        if (!spiritPet.code || level === 0) {
            return null; // Chưa unlock hoặc không có code
        }
        // Đường dẫn: /icons/spirit-pets/[CODE]_level_[LEVEL].png
        return `/icons/spirit-pets/${spiritPet.code}_level_${level}.png`;
    };

    // Helper: Tính sao cần để unlock/upgrade
    const getStarsNeeded = (spiritPet: any): number => {
        const currentLevel = getCurrentLevel(spiritPet);
        if (currentLevel === 0) {
            // Chưa unlock - cần sao cho level 1
            const level1 = getLevelData(spiritPet, 1);
            return level1?.unlock_cost?.STAR || 50;
        } else if (currentLevel < spiritPet.maxStars) {
            // Đã unlock - cần sao cho level tiếp theo
            const nextLevel = getLevelData(spiritPet, currentLevel + 1);
            return nextLevel?.unlock_cost?.STAR || 0;
        }
        return 0; // Đã max level
    };

    return (
        <div>
            <VietHeader title="Gánh Hàng Rong" icon="🧺" coins={coins} stars={stars} />
            <main className="p-4 md:p-6">
                <div className="bg-yellow-100/50 p-3 rounded-3xl shadow-viet-style-pressed mb-6">
                    <div className="flex justify-center flex-wrap gap-2">
                        <FilterButton label="Nhân vật" icon="🧒" isActive={filter === 'character'} onClick={() => setFilter('character')} />
                        <FilterButton label="Trang phục" icon="👒" isActive={filter === 'accessory'} onClick={() => setFilter('accessory')} />
                        <FilterButton label="Khung cảnh" icon="🖼️" isActive={filter === 'frame'} onClick={() => setFilter('frame')} />
                        <FilterButton label="Đồ chơi" icon="🏮" isActive={filter === 'sticker'} onClick={() => setFilter('sticker')} />
                        <FilterButton label="Linh vật" icon="🐉" isActive={filter === 'spirit-pet'} onClick={() => setFilter('spirit-pet')} />
                        <FilterButton label="Sở hữu" icon="📦" isActive={filter === 'owned'} onClick={() => setFilter('owned')} />
                    </div>
                </div>
                
                {filter === 'spirit-pet' ? (
                    // Hiển thị linh vật
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {spiritPets.map(pet => {
                            const userPet = getUserPet(pet.id);
                            const currentLevel = getCurrentLevel(pet);
                            const starsNeeded = getStarsNeeded(pet);
                            const levelData = currentLevel > 0 ? getLevelData(pet, currentLevel) : null;
                            const canUnlock = currentLevel === 0 && stars >= starsNeeded;
                            const canUpgrade = currentLevel > 0 && currentLevel < pet.maxStars && stars >= starsNeeded;

                            return (
                                <div
                                    key={pet.id}
                                    onClick={() => {
                                        // Nếu đã sở hữu và đủ điều kiện nâng cấp → Hiện modal xác nhận
                                        if (userPet && canUpgrade) {
                                            setUpgradeConfirmModal({ pet, userPet, isOpen: true });
                                        }
                                        // Nếu đã sở hữu nhưng không đủ điều kiện → Không làm gì (hoặc có thể hiện thông báo)
                                        else if (userPet && !canUpgrade && currentLevel < pet.maxStars) {
                                            showToast(`Cần ${starsNeeded} ⭐ để nâng cấp!`, 'error');
                                        }
                                    }}
                                    className={`relative aspect-square rounded-3xl transition-all duration-300 border-2 ${
                                        userPet?.isActive
                                            ? 'border-green-500 shadow-lg ring-4 ring-green-300/50'
                                            : currentLevel > 0
                                                ? 'border-amber-900/30 bg-[#FDFBF5] shadow-viet-style-raised cursor-pointer hover:scale-105 active:scale-95'
                                                : 'border-amber-900/30 bg-yellow-100/50 shadow-viet-style-pressed'
                                    }`}
                                >
                                    <div className="flex flex-col items-center justify-center w-full h-full p-2">
                                        {/* Hiển thị ảnh PNG hoặc emoji fallback */}
                                        {currentLevel > 0 ? (
                                            <div className="w-full h-24 md:h-32 flex items-center justify-center mb-2">
                                                <img
                                                    src={getSpiritPetImage(pet, currentLevel) || ''}
                                                    alt={levelData?.name_vi || pet.baseNameVi}
                                                    className="max-w-full max-h-full object-contain"
                                                    onError={(e) => {
                                                        // Fallback về emoji nếu ảnh không load được
                                                        const parent = e.currentTarget.parentElement;
                                                        if (parent) {
                                                            e.currentTarget.style.display = 'none';
                                                            const emojiSpan = document.createElement('span');
                                                            emojiSpan.className = 'text-4xl md:text-5xl';
                                                            emojiSpan.textContent = '🐉';
                                                            parent.appendChild(emojiSpan);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-4xl md:text-5xl mb-2">🔒</span>
                                        )}
                                        
                                        {/* Tên và cấp độ */}
                                        <div className="text-center">
                                            <div className="font-bold text-xs md:text-sm text-amber-900 mb-1">
                                                {levelData?.name_vi || pet.baseNameVi}
                                            </div>
                                            <div className="text-xs text-amber-700">
                                                {currentLevel > 0 ? '⭐'.repeat(currentLevel) : 'Chưa mở khóa'}
                                            </div>
                                        </div>

                                        {/* Progress bar và thông tin nâng cấp */}
                                        {currentLevel > 0 && currentLevel < pet.maxStars && (
                                            <div className="w-full px-2 mt-2">
                                                <div className="text-xs text-center text-purple-700 font-bold mb-1">
                                                    Cần {starsNeeded} ⭐ để nâng cấp
                                                </div>
                                                <div className="text-xs text-center text-amber-700 mb-1">
                                                    Đang có: {stars}/{starsNeeded} ⭐
                                                </div>
                                                <div className="w-full bg-amber-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-400 h-2 rounded-full transition-all"
                                                        style={{ width: `${Math.min(100, (stars / starsNeeded) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div className="mt-2 flex gap-1">
                                            {canUnlock && (
                                                <button
                                                    onClick={() => {
                                                        // Unlock linh vật cấp 1
                                                        const level1 = getLevelData(pet, 1);
                                                        const cost = level1?.unlock_cost?.STAR || 50;
                                                        
                                                        if (stars < cost) {
                                                            showToast('Không đủ sao!', 'error');
                                                            return;
                                                        }

                                                        // Trừ sao - theo lớp
                                                        const currentGrade = getCurrentGrade();
                                                        const newStars = stars - cost;
                                                        setStars(newStars);
                                                        setStarsForGrade(currentGrade, newStars);

                                                        // Tạo user pet mới
                                                        const newUserPet = {
                                                            id: `user-pet-${pet.id}-${Date.now()}`,
                                                            userId: user?.id || 'guest',
                                                            spiritPetId: pet.id,
                                                            currentLevel: 1,
                                                            isActive: false,
                                                            unlockedAt: new Date().toISOString(),
                                                            spiritPet: pet,
                                                        };

                                                        // Lưu vào localStorage - theo lớp
                                                        const updatedPets = [...userSpiritPets, newUserPet];
                                                        setUserSpiritPets(updatedPets);
                                                        setSpiritPetsForGrade(userId, currentGrade, updatedPets);

                                                        showToast(`Đã mở khóa ${pet.baseNameVi}!`, 'success');
                                                        playSound('success');
                                                    }}
                                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg font-bold hover:bg-green-600"
                                                >
                                                    Mở khóa
                                                </button>
                                            )}
                                            {canUpgrade && (
                                                <div className="text-xs text-center text-purple-700 font-bold mt-2">
                                                    👆 Bấm để nâng cấp
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : filter === 'owned' ? (
                    // Tab "Sở hữu" - Hiển thị cả items và spirit pets
                    <div>
                        {/* Items thông thường */}
                        {filteredItems.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-6">
                                {filteredItems.map(item => (
                                   <ItemCard 
                                       key={item.id} 
                                       item={item} 
                                       coins={coins}
                                       onClick={() => handleCardClick(item)}
                                       onPurchase={() => handleCardClick(item)}
                                       isSelected={selectedItems[item.category] === item.id}
                                   />
                                ))}
                            </div>
                        )}
                        
                        {/* Spirit pets đã sở hữu */}
                        {ownedSpiritPets.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">
                                    🐉 Linh Vật Đã Sở Hữu
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {ownedSpiritPets.map(({ pet, userPet }) => {
                                        const currentLevel = userPet.currentLevel;
                                        const levelData = getLevelData(pet, currentLevel);

                                        return (
                                            <div
                                                key={pet.id}
                                                onClick={() => {
                                                    setSpiritPetModal({ pet, userPet, isOpen: true });
                                                }}
                                                className={`relative aspect-square rounded-3xl transition-all duration-300 border-2 cursor-pointer hover:scale-105 active:scale-95 ${
                                                    userPet.isActive
                                                        ? 'border-green-500 shadow-lg ring-4 ring-green-300/50'
                                                        : 'border-amber-900/30 bg-[#FDFBF5] shadow-viet-style-raised'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center justify-center w-full h-full p-2">
                                                    {/* Hiển thị ảnh PNG hoặc emoji fallback */}
                                                    <div className="w-full h-24 md:h-32 flex items-center justify-center mb-2">
                                                        <img
                                                            src={getSpiritPetImage(pet, currentLevel) || ''}
                                                            alt={levelData?.name_vi || pet.baseNameVi}
                                                            className="max-w-full max-h-full object-contain"
                                                            onError={(e) => {
                                                                // Fallback về emoji nếu ảnh không load được
                                                                const parent = e.currentTarget.parentElement;
                                                                if (parent) {
                                                                    e.currentTarget.style.display = 'none';
                                                                    const emojiSpan = document.createElement('span');
                                                                    emojiSpan.className = 'text-4xl md:text-5xl';
                                                                    emojiSpan.textContent = '🐉';
                                                                    parent.appendChild(emojiSpan);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-bold text-xs md:text-sm text-amber-900 mb-1">
                                                            {levelData?.name_vi || pet.baseNameVi}
                                                        </div>
                                                        <div className="text-xs text-amber-700">
                                                            {'⭐'.repeat(currentLevel)}
                                                        </div>
                                                        {userPet.isActive && (
                                                            <div className="text-xs text-green-600 font-bold mt-1">
                                                                ✓ Đang dùng
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {filteredItems.length === 0 && ownedSpiritPets.length === 0 && (
                            <div className="text-center py-12 text-amber-700">
                                <p className="text-lg font-bold">Chưa có vật phẩm nào</p>
                                <p className="text-sm mt-2">Hãy học bài và đổi vật phẩm nhé!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Hiển thị items thông thường (chỉ items chưa mua)
                    filteredItems.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {filteredItems.map(item => (
                               <ItemCard 
                                   key={item.id} 
                                   item={item} 
                                   coins={coins}
                                   onClick={() => handleCardClick(item)}
                                   onPurchase={() => handleCardClick(item)}
                                   isSelected={selectedItems[item.category] === item.id}
                               />
                            ))}
                        </div>
                    ) : (
                        // Tất cả items đã mua hết
                        <div className="text-center py-12 text-amber-700">
                            <p className="text-2xl mb-2">🎉</p>
                            <p className="text-lg font-bold">Đã sở hữu tất cả {filter === 'character' ? 'nhân vật' : filter === 'accessory' ? 'trang phục' : filter === 'frame' ? 'khung cảnh' : 'đồ chơi'}!</p>
                            <p className="text-sm mt-2">Vào tab "Sở hữu" để xem bộ sưu tập của bé nhé!</p>
                        </div>
                    )
                )}
                
                {filter !== 'spirit-pet' && filter !== 'owned' && (
                    <div className="mt-8 text-center max-w-md mx-auto bg-[#FDFBF5]/80 p-4 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
                        <p className="font-bold text-amber-900 text-lg mb-2">
                            Bộ sưu tập: {ownedCount}/{totalCount}
                        </p>
                        <ProgressBar progress={progress} current={ownedCount} total={totalCount} color="green" animated />
                    </div>
                )}
                {filter === 'owned' && (
                    <div className="mt-8 text-center max-w-md mx-auto bg-[#FDFBF5]/80 p-4 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
                        <p className="font-bold text-amber-900 text-lg mb-2">
                            Bộ sưu tập của bé: {ownedCount + ownedSpiritPets.length}/{totalCount + spiritPets.length}
                        </p>
                        <ProgressBar 
                            progress={(totalCount + spiritPets.length) > 0 ? Math.round(((ownedCount + ownedSpiritPets.length) / (totalCount + spiritPets.length)) * 100) : 0} 
                            current={ownedCount + ownedSpiritPets.length} 
                            total={totalCount + spiritPets.length} 
                            color="green" 
                            animated 
                        />
                    </div>
                )}
                {filter === 'spirit-pet' && (
                    <div className="mt-8 text-center max-w-md mx-auto bg-[#FDFBF5]/80 p-4 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
                        <p className="font-bold text-amber-900 text-lg mb-2">
                            Linh vật đã mở khóa: {userSpiritPets.length}/{spiritPets.length}
                        </p>
                        <ProgressBar 
                            progress={spiritPets.length > 0 ? Math.round((userSpiritPets.length / spiritPets.length) * 100) : 0} 
                            current={userSpiritPets.length} 
                            total={spiritPets.length} 
                            color="purple" 
                            animated 
                        />
                    </div>
                )}

                {openingCard && (
                    <CardOpening
                        isOpen={true}
                        itemName={openingCard.name}
                        itemIcon={openingCard.icon}
                        onComplete={() => setOpeningCard(null)}
                    />
                )}

                {/* Spirit Pet Modal - Hiển thị khi click vào linh vật đã sở hữu */}
                {spiritPetModal.isOpen && spiritPetModal.pet && spiritPetModal.userPet && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#FDFBF5] rounded-3xl shadow-viet-style-raised border-2 border-amber-900/30 max-w-md w-full p-6">
                            <div className="text-center mb-6">
                                {/* Hiển thị ảnh PNG hoặc emoji fallback */}
                                <div className="w-full h-32 flex items-center justify-center mb-4">
                                    <img
                                        src={getSpiritPetImage(spiritPetModal.pet, spiritPetModal.userPet.currentLevel) || ''}
                                        alt={getLevelData(spiritPetModal.pet, spiritPetModal.userPet.currentLevel)?.name_vi || spiritPetModal.pet.baseNameVi}
                                        className="max-w-full max-h-full object-contain"
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
                                </div>
                                <h2 className="text-2xl font-black text-amber-900 mb-2">
                                    {getLevelData(spiritPetModal.pet, spiritPetModal.userPet.currentLevel)?.name_vi || spiritPetModal.pet.baseNameVi}
                                </h2>
                                <div className="text-lg text-amber-700 mb-2">
                                    {'⭐'.repeat(spiritPetModal.userPet.currentLevel)}
                                </div>
                                <p className="text-sm text-amber-600">
                                    {spiritPetModal.pet.theme && `Chủ đề: ${spiritPetModal.pet.theme}`}
                                </p>
                                {spiritPetModal.userPet.currentLevel < spiritPetModal.pet.maxStars && (
                                    <div className="mt-4 p-3 bg-purple-100 rounded-xl">
                                        <p className="text-sm font-bold text-purple-900">
                                            Nâng cấp lên cấp {spiritPetModal.userPet.currentLevel + 1}: {getStarsNeeded(spiritPetModal.pet)} ⭐
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {/* Tùy chọn: Đặt thành ảnh đại diện */}
                                <button
                                    onClick={() => {
                                        // Khi chọn linh vật làm ảnh đại diện → Clear tất cả selectedItems (character, accessory, frame, sticker)
                                        const clearedSelectedItems: SelectedItems = {
                                            character: null,
                                            accessory: null,
                                            frame: null,
                                            sticker: null,
                                        };
                                        saveSelectedItems(clearedSelectedItems);
                                        
                                        // Tắt tất cả linh vật khác, bật/tắt linh vật hiện tại
                                        const newActiveState = !spiritPetModal.userPet.isActive;
                                        const updatedPets = userSpiritPets.map(up => ({
                                            ...up,
                                            isActive: up.spiritPetId === spiritPetModal.pet.id ? newActiveState : false,
                                        }));
                                        saveUserSpiritPets(updatedPets);
                                        
                                        showToast(
                                            newActiveState 
                                                ? `Đã đặt ${spiritPetModal.pet.baseNameVi} làm ảnh đại diện!` 
                                                : `Đã gỡ ${spiritPetModal.pet.baseNameVi} khỏi ảnh đại diện`,
                                            'success'
                                        );
                                        playSound('success');
                                        setSpiritPetModal({ pet: null, userPet: null, isOpen: false });
                                    }}
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
                                        spiritPetModal.userPet.isActive
                                            ? 'bg-gray-500 hover:bg-gray-600'
                                            : 'bg-green-500 hover:bg-green-600'
                                    }`}
                                >
                                    {spiritPetModal.userPet.isActive ? '✓ Đang dùng' : 'Đặt thành ảnh đại diện'}
                                </button>

                                {/* Tùy chọn: Nâng cấp */}
                                {spiritPetModal.userPet.currentLevel < spiritPetModal.pet.maxStars && (
                                    <button
                                        onClick={() => {
                                            const nextLevel = spiritPetModal.userPet.currentLevel + 1;
                                            const nextLevelData = getLevelData(spiritPetModal.pet, nextLevel);
                                            const cost = nextLevelData?.unlock_cost?.STAR || 0;
                                            
                                            if (stars < cost) {
                                                showToast('Không đủ sao!', 'error');
                                                return;
                                            }

                                            // Trừ sao - theo lớp
                                            const currentGrade = getCurrentGrade();
                                            const newStars = stars - cost;
                                            setStars(newStars);
                                            setStarsForGrade(currentGrade, newStars);

                                            // Update level
                                            const updatedUserPet = {
                                                ...spiritPetModal.userPet,
                                                currentLevel: nextLevel,
                                                lastUpgradedAt: new Date().toISOString(),
                                            };

                                            // Lưu vào localStorage - theo lớp
                                            const updatedPets = userSpiritPets.map(up => 
                                                up.spiritPetId === spiritPetModal.pet.id ? updatedUserPet : up
                                            );
                                            saveUserSpiritPets(updatedPets);

                                            showToast(`Đã nâng cấp ${spiritPetModal.pet.baseNameVi} lên cấp ${nextLevel}!`, 'success');
                                            playSound('success');
                                            setSpiritPetModal({ pet: null, userPet: null, isOpen: false });
                                        }}
                                        disabled={stars < getStarsNeeded(spiritPetModal.pet)}
                                        className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
                                            stars >= getStarsNeeded(spiritPetModal.pet)
                                                ? 'bg-purple-500 hover:bg-purple-600'
                                                : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        Nâng cấp ({getStarsNeeded(spiritPetModal.pet)} ⭐)
                                    </button>
                                )}

                                {/* Nút đóng */}
                                <button
                                    onClick={() => setSpiritPetModal({ pet: null, userPet: null, isOpen: false })}
                                    className="w-full py-2 px-4 rounded-xl font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 transition-all"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upgrade Confirm Modal - Hiển thị khi click vào linh vật đã sở hữu và đủ điều kiện nâng cấp */}
                {upgradeConfirmModal.isOpen && upgradeConfirmModal.pet && upgradeConfirmModal.userPet && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#FDFBF5] rounded-3xl shadow-viet-style-raised border-2 border-amber-900/30 max-w-md w-full p-6">
                            <div className="text-center mb-6">
                                {/* Hiển thị ảnh PNG hiện tại và ảnh sẽ nâng cấp lên */}
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    {/* Ảnh hiện tại */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 flex items-center justify-center">
                                            <img
                                                src={getSpiritPetImage(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel) || ''}
                                                alt={getLevelData(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel)?.name_vi || upgradeConfirmModal.pet.baseNameVi}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => {
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        e.currentTarget.style.display = 'none';
                                                        const emojiSpan = document.createElement('span');
                                                        emojiSpan.className = 'text-4xl';
                                                        emojiSpan.textContent = '🐉';
                                                        parent.appendChild(emojiSpan);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-amber-700 mt-1">Cấp {upgradeConfirmModal.userPet.currentLevel}</span>
                                    </div>
                                    {/* Mũi tên */}
                                    <span className="text-3xl">→</span>
                                    {/* Ảnh sẽ nâng cấp */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 flex items-center justify-center">
                                            <img
                                                src={getSpiritPetImage(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel + 1) || ''}
                                                alt={getLevelData(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel + 1)?.name_vi || upgradeConfirmModal.pet.baseNameVi}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => {
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        e.currentTarget.style.display = 'none';
                                                        const emojiSpan = document.createElement('span');
                                                        emojiSpan.className = 'text-4xl';
                                                        emojiSpan.textContent = '🐉';
                                                        parent.appendChild(emojiSpan);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-amber-700 mt-1">Cấp {upgradeConfirmModal.userPet.currentLevel + 1}</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-amber-900 mb-2">
                                    Nâng cấp {upgradeConfirmModal.pet.baseNameVi}?
                                </h2>
                                <div className="text-lg text-amber-700 mb-2">
                                    Cấp {upgradeConfirmModal.userPet.currentLevel} → Cấp {upgradeConfirmModal.userPet.currentLevel + 1}
                                </div>
                                <div className="mt-4 p-3 bg-purple-100 rounded-xl">
                                    <p className="text-sm font-bold text-purple-900">
                                        Chi phí: {getStarsNeeded(upgradeConfirmModal.pet)} ⭐
                                    </p>
                                    <p className="text-xs text-purple-700 mt-1">
                                        Sao hiện có: {stars} ⭐
                                    </p>
                                </div>
                                {getLevelData(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel + 1) && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-xl">
                                        <p className="text-xs font-bold text-green-900">
                                            Tên mới: {getLevelData(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel + 1)?.name_vi}
                                        </p>
                                        {getLevelData(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel + 1)?.effect && (
                                            <p className="text-xs text-green-700 mt-1">
                                                Hiệu ứng: {JSON.stringify(getLevelData(upgradeConfirmModal.pet, upgradeConfirmModal.userPet.currentLevel + 1)?.effect)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {/* Nút xác nhận nâng cấp */}
                                <button
                                    onClick={() => {
                                        const nextLevel = upgradeConfirmModal.userPet.currentLevel + 1;
                                        const nextLevelData = getLevelData(upgradeConfirmModal.pet, nextLevel);
                                        const cost = nextLevelData?.unlock_cost?.STAR || 0;
                                        
                                        if (stars < cost) {
                                            showToast('Không đủ sao!', 'error');
                                            setUpgradeConfirmModal({ pet: null, userPet: null, isOpen: false });
                                            return;
                                        }

                                        // Trừ sao - theo lớp
                                        const currentGrade = getCurrentGrade();
                                        const newStars = stars - cost;
                                        setStars(newStars);
                                        setStarsForGrade(currentGrade, newStars);

                                        // Update level
                                        const updatedUserPet = {
                                            ...upgradeConfirmModal.userPet,
                                            currentLevel: nextLevel,
                                            lastUpgradedAt: new Date().toISOString(),
                                        };

                                        // Lưu vào localStorage - theo lớp
                                        const updatedPets = userSpiritPets.map(up => 
                                            up.spiritPetId === upgradeConfirmModal.pet.id ? updatedUserPet : up
                                        );
                                        setUserSpiritPets(updatedPets);
                                        const userId = user?.id || 'guest';
                                        setSpiritPetsForGrade(userId, currentGrade, updatedPets);

                                        showToast(`Đã nâng cấp ${upgradeConfirmModal.pet.baseNameVi} lên cấp ${nextLevel}!`, 'success');
                                        playSound('success');
                                        setUpgradeConfirmModal({ pet: null, userPet: null, isOpen: false });
                                    }}
                                    className="w-full py-3 px-4 rounded-xl font-bold text-white bg-purple-500 hover:bg-purple-600 transition-all"
                                >
                                    Xác nhận nâng cấp ({getStarsNeeded(upgradeConfirmModal.pet)} ⭐)
                                </button>

                                {/* Nút hủy */}
                                <button
                                    onClick={() => setUpgradeConfirmModal({ pet: null, userPet: null, isOpen: false })}
                                    className="w-full py-2 px-4 rounded-xl font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 transition-all"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <PurchaseModal
                    isOpen={purchaseModal.isOpen}
                    item={purchaseModal.item}
                    coins={coins}
                    onConfirm={handlePurchase}
                    onCancel={() => setPurchaseModal({ item: null, isOpen: false })}
                />
            </main>
        </div>
    );
};

export default AlbumPage;
