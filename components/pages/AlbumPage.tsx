import React, { useState, useEffect } from 'react';
import { AlbumItem } from '../../types';

// Extend AlbumItem type để có imageFile
interface AlbumItemWithImage extends AlbumItem {
    imageFile?: string | null;
}
import ProgressBar from '../common/ProgressBar';
import CardOpening from '../common/CardOpening';
import { playSound } from '../common/SoundEffects';
import { getAlbumItems, purchaseItem, type AlbumItem as APIAlbumItem } from '../../src/lib/api/album';
import { getUserCoins, type CoinsResponse } from '../../src/lib/api/coins';
import { useAuth } from '../../src/contexts/AuthContext';
import { useToast } from '../common/ToastNotification';

const VietHeader: React.FC<{ title: string; icon: string; coins?: number }> = ({ title, icon, coins }) => (
    <header className="p-4 text-center">
        <div className="inline-block bg-[#FDFBF5]/80 py-3 px-6 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
            <h1 className="text-3xl font-black text-amber-900 flex items-center justify-center">
                <span className="text-4xl mr-3 drop-shadow-md">{icon}</span>
                <span>{title}</span>
                {coins !== undefined && (
                    <span className="ml-4 px-3 py-1 bg-yellow-400 rounded-full text-lg font-bold text-amber-900 flex items-center gap-1">
                        <span>🪙</span>
                        <span>{coins}</span>
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
}

const ItemCard: React.FC<ItemCardProps> = ({ item, coins, onClick, onPurchase }) => {
    const isOwned = item.owned || item.unlocked;
    const canAfford = item.price !== undefined && coins >= item.price;
    const showPurchase = !isOwned && item.price !== undefined;

    return (
        <div className="relative">
            <button
                onClick={isOwned ? onClick : undefined}
                className={`relative aspect-square rounded-3xl transition-all duration-300 border-2 border-amber-900/30 ${
                    isOwned 
                        ? 'bg-[#FDFBF5] shadow-viet-style-raised hover:scale-105 active:scale-95 cursor-pointer' 
                        : 'bg-yellow-100/50 shadow-viet-style-pressed cursor-default'
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
    const [filter, setFilter] = useState<'character' | 'accessory' | 'frame' | 'sticker'>('character');
    const [openingCard, setOpeningCard] = useState<{ name: string; icon: string } | null>(null);
    const [items, setItems] = useState<AlbumItemWithImage[]>([]);
    const [coins, setCoins] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [purchaseModal, setPurchaseModal] = useState<{ item: AlbumItemWithImage | null; isOpen: boolean }>({
        item: null,
        isOpen: false,
    });
    const [purchasing, setPurchasing] = useState(false);

    // Load coins và items
    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load coins (optional - chỉ load nếu có backend)
            if (user?.id) {
                try {
                    const coinsData = await getUserCoins();
                    setCoins(coinsData.coins);
                    // Sync với localStorage
                    localStorage.setItem('user_coins', coinsData.coins.toString());
                } catch (error) {
                    // Nếu không có backend, đọc từ localStorage hoặc dùng mặc định
                    console.log('Backend not available, using localStorage coins');
                    const storedCoins = parseInt(localStorage.getItem('user_coins') || '100', 10);
                    setCoins(storedCoins);
                }
            } else {
                // Không có user → đọc từ localStorage hoặc dùng mặc định
                const storedCoins = parseInt(localStorage.getItem('user_coins') || '100', 10);
                setCoins(storedCoins);
            }
            
            // Load items từ file JSON local (không cần backend)
            const response = await fetch('/data/album-items.json');
            if (!response.ok) {
                throw new Error('Failed to load album items');
            }
            const data = await response.json();
            
            // Filter theo category và convert format
            const allItems = data.items.filter((item: any) => item.isActive);
            
            // Convert to AlbumItem format (không filter theo category ở đây, sẽ filter sau)
            const convertedItems: AlbumItemWithImage[] = allItems.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                image: item.image, // Emoji fallback
                imageFile: item.imageFile || null, // Path ảnh nếu có
                price: item.price,
                description: item.description,
                owned: item.owned || false,
                unlocked: item.owned || false, // Legacy compatibility
            }));
            
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

    const filteredItems = items.filter(item => item.category === filter);
    const ownedCount = filteredItems.filter(item => item.owned || item.unlocked).length;
    const totalCount = filteredItems.length;
    const progress = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;

    const handleCardClick = (item: AlbumItemWithImage) => {
        const isOwned = item.owned || item.unlocked;
        if (isOwned) {
            playSound('success');
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
                    localStorage.setItem('user_coins', result.coins.toString());
                    
                    // Cập nhật items (đánh dấu item đã sở hữu)
                    setItems(prevItems => 
                        prevItems.map(i => 
                            i.id === item.id 
                                ? { ...i, owned: true, unlocked: true }
                                : i
                        )
                    );

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
                localStorage.setItem('user_coins', newCoins.toString());
                
                setItems(prevItems => 
                    prevItems.map(i => 
                        i.id === item.id 
                            ? { ...i, owned: true, unlocked: true }
                            : i
                    )
                );
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
                <VietHeader title="Gánh Hàng Rong" icon="🧺" coins={coins} />
                <main className="p-4 md:p-6">
                    <div className="text-center text-amber-900 font-bold">Đang tải...</div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <VietHeader title="Gánh Hàng Rong" icon="🧺" coins={coins} />
            <main className="p-4 md:p-6">
                <div className="bg-yellow-100/50 p-3 rounded-3xl shadow-viet-style-pressed mb-6">
                    <div className="flex justify-center flex-wrap gap-2">
                        <FilterButton label="Nhân vật" icon="🧒" isActive={filter === 'character'} onClick={() => setFilter('character')} />
                        <FilterButton label="Trang phục" icon="👒" isActive={filter === 'accessory'} onClick={() => setFilter('accessory')} />
                        <FilterButton label="Khung cảnh" icon="🖼️" isActive={filter === 'frame'} onClick={() => setFilter('frame')} />
                        <FilterButton label="Đồ chơi" icon="🏮" isActive={filter === 'sticker'} onClick={() => setFilter('sticker')} />
                    </div>
                </div>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {filteredItems.map(item => (
                       <ItemCard 
                           key={item.id} 
                           item={item} 
                           coins={coins}
                           onClick={() => handleCardClick(item)}
                           onPurchase={() => handleCardClick(item)}
                       />
                    ))}
                </div>
                
                <div className="mt-8 text-center max-w-md mx-auto bg-[#FDFBF5]/80 p-4 rounded-3xl shadow-viet-style-raised border-2 border-yellow-700/20">
                    <p className="font-bold text-amber-900 text-lg mb-2">
                        Bộ sưu tập: {ownedCount}/{totalCount}
                    </p>
                    <ProgressBar progress={progress} current={ownedCount} total={totalCount} color="green" animated />
                </div>

                {openingCard && (
                    <CardOpening
                        isOpen={true}
                        itemName={openingCard.name}
                        itemIcon={openingCard.icon}
                        onComplete={() => setOpeningCard(null)}
                    />
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
