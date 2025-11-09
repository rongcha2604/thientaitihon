import React, { useState, useRef } from 'react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const presetAmounts = [20000, 50000, 100000];

  const handleDonate = () => {
    const amount = selectedAmount || parseInt(customAmount.replace(/[^\d]/g, '')) || 0;
    
    if (amount < 10000) {
      alert('Số tiền tối thiểu là 10,000 VNĐ');
      return;
    }

    // Hiển thị thông tin chuyển khoản
    setShowThankYou(true);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Đã sao chép ${label}!`);
    });
  };

  if (showThankYou) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div 
          className="bg-[#FDFBF5] rounded-3xl p-6 max-w-md w-full shadow-viet-style-raised border-2 border-pink-300/40 max-h-[90vh] overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">💝</div>
            <h2 className="text-2xl font-black text-pink-800">Cảm ơn bạn rất nhiều!</h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              Chúng tôi rất biết ơn sự ủng hộ của bạn. Mọi đóng góp đều giúp chúng tôi tiếp tục phát triển ứng dụng miễn phí cho trẻ em.
            </p>
            <div className="space-y-4">
              {/* Momo */}
              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200">
                <p className="text-xs text-amber-700 mb-3 font-semibold">1. Ví Momo:</p>
                <div className="space-y-2 text-sm text-amber-800">
                  <p>
                    <span className="font-semibold">Số điện thoại:</span>{' '}
                    <span className="font-mono">0909127331</span>{' '}
                    <button
                      onClick={() => handleCopy('0909127331', 'số điện thoại Momo')}
                      className="ml-2 text-blue-600 hover:underline text-xs"
                    >
                      📋 Sao chép
                    </button>
                  </p>
                  <p>
                    <span className="font-semibold">Tên chủ ví:</span>{' '}
                    <span className="font-mono">Trịnh Ngọc Long</span>{' '}
                    <button
                      onClick={() => handleCopy('Trịnh Ngọc Long', 'tên chủ ví')}
                      className="ml-2 text-blue-600 hover:underline text-xs"
                    >
                      📋 Sao chép
                    </button>
                  </p>
                </div>
              </div>

              {/* Techcombank */}
              <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200">
                <p className="text-xs text-amber-700 mb-3 font-semibold">2. Ngân hàng Techcombank:</p>
                <div className="space-y-3">
                  <div className="space-y-2 text-sm text-amber-800">
                    <p>
                      <span className="font-semibold">Số tài khoản:</span>{' '}
                      <span className="font-mono">3899 9938 3899 99</span>{' '}
                      <button
                        onClick={() => handleCopy('3899 9938 3899 99', 'số tài khoản')}
                        className="ml-2 text-blue-600 hover:underline text-xs"
                      >
                        📋 Sao chép
                      </button>
                    </p>
                    <p>
                      <span className="font-semibold">Chủ tài khoản:</span>{' '}
                      <span className="font-mono">TRINH NGOC LONG</span>{' '}
                      <button
                        onClick={() => handleCopy('TRINH NGOC LONG', 'tên chủ tài khoản')}
                        className="ml-2 text-blue-600 hover:underline text-xs"
                      >
                        📋 Sao chép
                      </button>
                    </p>
                    <p>
                      <span className="font-semibold">Nội dung:</span>{' '}
                      <span className="font-mono">UNG HO THIEN TAI DAT VIET</span>{' '}
                      <button
                        onClick={() => handleCopy('UNG HO THIEN TAI DAT VIET', 'nội dung')}
                        className="ml-2 text-blue-600 hover:underline text-xs"
                      >
                        📋 Sao chép
                      </button>
                    </p>
                  </div>
                  
                  {/* QR Code */}
                  <div className="mt-4 flex justify-center">
                    <div className="bg-white p-3 rounded-xl shadow-md">
                      <img
                        src="/images/qr-techcombank.png"
                        alt="QR Code Techcombank"
                        className="w-48 h-48 object-contain"
                        onError={(e) => {
                          // Fallback nếu image không tồn tại
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-xs text-gray-500 text-center p-4">QR Code sẽ được cập nhật</p>';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-pink-200 text-pink-900 font-bold py-3 rounded-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-[#FDFBF5] rounded-3xl p-6 max-w-md w-full shadow-viet-style-raised border-2 border-pink-300/40 max-h-[90vh] overflow-y-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-2">💝</div>
            <h2 className="text-2xl font-black text-pink-800 mb-2">Cảm ơn bạn đã quan tâm!</h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              Ứng dụng được phát triển <strong>miễn phí</strong> để hỗ trợ học tập cho trẻ em.
            </p>
            <p className="text-amber-700 text-xs mt-2 leading-relaxed">
              Nếu bạn muốn ủng hộ để chúng tôi tiếp tục phát triển, chúng tôi rất biết ơn!<br/>
              <span className="text-pink-600 font-semibold">Mọi đóng góp đều là tự nguyện và không bắt buộc.</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-amber-800">Chọn số tiền ủng hộ:</p>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`py-2 px-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedAmount === amount
                      ? 'bg-pink-300 text-pink-900 shadow-viet-style-pressed'
                      : 'bg-pink-100 text-pink-800 hover:bg-pink-200 shadow-viet-style-raised'
                  }`}
                >
                  {amount.toLocaleString('vi-VN')}₫
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-amber-800">Hoặc nhập số tiền khác:</label>
              <input
                ref={inputRef}
                type="text"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setCustomAmount(value);
                  setSelectedAmount(null);
                }}
                onFocus={() => {
                  // Scroll buttons into view when input is focused (mobile keyboard opens)
                  setTimeout(() => {
                    buttonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                  }, 300); // Delay to wait for keyboard animation
                }}
                placeholder="Nhập số tiền (VNĐ)"
                className="w-full px-4 py-2 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-amber-900"
              />
              {customAmount && (
                <p className="text-xs text-amber-600">
                  {parseInt(customAmount.replace(/[^\d]/g, '') || '0').toLocaleString('vi-VN')} VNĐ
                </p>
              )}
            </div>
          </div>

          <div ref={buttonsRef} className="flex gap-3 pt-2 pb-6">
            <button
              onClick={onClose}
              className="flex-1 bg-amber-200 text-amber-900 font-semibold py-3 rounded-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
            >
              Đóng
            </button>
            <button
              onClick={handleDonate}
              className="flex-1 bg-pink-300 text-pink-900 font-bold py-3 rounded-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
            >
              Tiếp tục 💝
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;

