import React, { useState, useEffect } from 'react';
import { activateLicense, getMachineId } from '../../src/lib/license';
import { useToast } from '../common/ToastNotification';

interface ActivationScreenProps {
  onActivated: () => void;
}

const ActivationScreen: React.FC<ActivationScreenProps> = ({ onActivated }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [machineId, setMachineId] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    setMachineId(getMachineId());
  }, []);

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      showToast('Vui lòng nhập license key!', 'error');
      return;
    }

    setIsActivating(true);
    try {
      const result = await activateLicense(licenseKey.trim());
      
      if (result.success) {
        showToast(result.message, 'success');
        // Reload UI immediately
        setTimeout(() => {
          onActivated();
        }, 500);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Activation error:', error);
      showToast('Có lỗi xảy ra khi kích hoạt. Vui lòng thử lại!', 'error');
    } finally {
      setIsActivating(false);
    }
  };

  const handleCopyMachineId = () => {
    navigator.clipboard.writeText(machineId).then(() => {
      showToast('Đã copy Machine ID!', 'success');
    }).catch(() => {
      showToast('Không thể copy. Vui lòng copy thủ công!', 'error');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FDFBF5]/95 backdrop-blur-lg rounded-3xl shadow-viet-style-raised border-2 border-amber-700/30 p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-3">🔒</div>
          <h1 className="text-2xl font-black text-amber-900 mb-3">
            Kích Hoạt Bản Quyền
          </h1>
        </div>

        {/* Success Message */}
        <div className="bg-green-100/80 border-2 border-green-500/40 rounded-2xl p-3">
          <p className="text-green-900 font-bold text-center text-sm">
            🎉 Chúc mừng! Bạn đã mở khóa 10 thử thách thành công!
          </p>
          <p className="text-green-800 text-xs text-center mt-2">
            Để tiếp tục mở khóa các thử thách kế tiếp, vui lòng liên hệ tác giả để nhận license key.
          </p>
          <div className="mt-2 pt-2 border-t-2 border-green-600/30">
            <p className="text-green-900 font-bold text-center text-xs">
              📞 Liên hệ: <span className="text-blue-700">0909.127.331</span> (Long)
            </p>
            <p className="text-green-800 text-xs text-center mt-1 opacity-80">
              Zalo / Điện thoại
            </p>
          </div>
        </div>

        {/* Machine ID */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-amber-900">
            Machine ID (Gửi cho tác giả):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={machineId}
              readOnly
              className="flex-1 px-4 py-3 bg-white border-2 border-amber-700/40 rounded-xl text-amber-900 font-mono font-bold focus:outline-none focus:border-amber-700"
            />
            <button
              onClick={handleCopyMachineId}
              className="px-4 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* License Key Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-amber-900">
            Nhập License Key:
          </label>
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX-XXXX hoặc XXXX-XXXX-XXXX-XXXX-365"
            className="w-full px-4 py-3 bg-white border-2 border-amber-700/40 rounded-xl text-amber-900 font-mono font-bold placeholder-amber-400 focus:outline-none focus:border-amber-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleActivate();
              }
            }}
          />
        </div>

        {/* Activate Button */}
        <button
          onClick={handleActivate}
          disabled={isActivating || !licenseKey.trim()}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-2xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isActivating ? '⏳ Đang kích hoạt...' : '🚀 Kích Hoạt License'}
        </button>

        {/* Info */}
        <div className="text-center text-xs text-amber-700 space-y-1">
          <p>💡 Format: XXXX-XXXX-XXXX-XXXX (Vĩnh viễn)</p>
          <p>💡 Hoặc: XXXX-XXXX-XXXX-XXXX-365 (Có thời hạn)</p>
        </div>
      </div>
    </div>
  );
};

export default ActivationScreen;

