import React, { useState } from 'react';
import ActivationScreen from './ActivationScreen';
import LicenseStatus from './LicenseStatus';

/**
 * Component để preview các thông báo license
 * Chỉ dùng cho development/testing
 */
const LicensePreview: React.FC = () => {
  const [showActivationScreen, setShowActivationScreen] = useState(false);
  const [showLicenseStatus, setShowLicenseStatus] = useState(false);
  const [licenseType, setLicenseType] = useState<'permanent' | 'temporary'>('permanent');

  // Mock license expiry for preview
  const mockExpiry = new Date();
  mockExpiry.setDate(mockExpiry.getDate() + 30); // 30 days from now

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white/80 rounded-3xl p-6 shadow-lg border-2 border-amber-700/30">
          <h1 className="text-3xl font-black text-amber-900 mb-6 text-center">
            🔍 Xem Trước Thông Báo License
          </h1>

          {/* Preview Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setShowActivationScreen(true)}
              className="p-6 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <div className="text-4xl mb-2">🔒</div>
              <div className="text-xl">Xem Màn Hình Kích Hoạt</div>
              <div className="text-sm mt-2 opacity-90">
                (ActivationScreen)
              </div>
            </button>

            <button
              onClick={() => setShowLicenseStatus(true)}
              className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <div className="text-4xl mb-2">⏰</div>
              <div className="text-xl">Xem Trạng Thái License</div>
              <div className="text-sm mt-2 opacity-90">
                (LicenseStatus)
              </div>
            </button>
          </div>

          {/* Toast Notification Preview */}
          <div className="bg-yellow-100/80 border-2 border-yellow-500/40 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">
              📢 Thông Báo Toast (Khi click vào tuần bị lock):
            </h2>
            <div className="bg-white rounded-xl p-4 border-2 border-red-500/40">
              <p className="text-red-900 font-bold">
                🔒 Bạn đã hoàn thành 10 thử thách! Để tiếp tục mở khóa các thử thách kế tiếp, vui lòng liên hệ tác giả để nhận license key.
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-100/80 border-2 border-blue-500/40 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              ℹ️ Thông Tin:
            </h2>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>ActivationScreen:</strong> Hiển thị khi user đã completed 10 tuần nhưng chưa có license</li>
              <li>• <strong>LicenseStatus:</strong> Hiển thị ở góc trên bên phải khi có license active</li>
              <li>• <strong>Toast Notification:</strong> Hiển thị khi user click vào tuần bị lock do license</li>
              <li>• <strong>Machine ID:</strong> Format WEB-XXXX-XXXX (tự động generate)</li>
              <li>• <strong>License Key:</strong> Format XXXX-XXXX-XXXX-XXXX (vĩnh viễn) hoặc XXXX-XXXX-XXXX-XXXX-365 (có hạn)</li>
            </ul>
          </div>
        </div>

        {/* Preview Activation Screen */}
        {showActivationScreen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setShowActivationScreen(false)}
                className="absolute -top-12 right-0 bg-white text-red-600 font-bold px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                ✕ Đóng
              </button>
              <ActivationScreen
                onActivated={() => {
                  setShowActivationScreen(false);
                  alert('License đã được kích hoạt! (Preview mode)');
                }}
              />
            </div>
          </div>
        )}

        {/* Preview License Status */}
        {showLicenseStatus && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-8">
              <button
                onClick={() => setShowLicenseStatus(false)}
                className="absolute top-4 right-4 bg-red-500 text-white font-bold w-8 h-8 rounded-full hover:scale-110 transition-all"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black text-amber-900 mb-6">
                Preview License Status
              </h2>
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-2">
                    Loại License:
                  </label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value as 'permanent' | 'temporary')}
                    className="w-full px-4 py-2 border-2 border-amber-700/40 rounded-xl"
                  >
                    <option value="permanent">Vĩnh viễn</option>
                    <option value="temporary">Có thời hạn (30 ngày)</option>
                  </select>
                </div>
                <div className="relative">
                  <LicenseStatus />
                  <div className="mt-4 p-4 bg-gray-100 rounded-xl text-sm text-gray-700">
                    <p><strong>Note:</strong> Component LicenseStatus sẽ hiển thị ở góc trên bên phải màn hình khi có license active.</p>
                    <p className="mt-2">Trong preview này, component được render trong container để dễ xem.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicensePreview;

