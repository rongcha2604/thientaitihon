import React, { useState } from 'react';
import PINEntryModal from './PINEntryModal';
import { useToast } from './ToastNotification';

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  parentPin?: string; // PIN bảo mật để xóa dữ liệu
}

const DeleteDataModal: React.FC<DeleteDataModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  parentPin,
}) => {
  const [showPINModal, setShowPINModal] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleDeleteClick = () => {
    // Nếu chưa có PIN, yêu cầu nhập PIN
    if (!parentPin) {
      showToast('Vui lòng đăng ký mã PIN trong phần đăng ký!', 'warning');
      return;
    }
    setShowPINModal(true);
  };

  const handlePINVerify = (pin: string) => {
    if (pin === parentPin) {
      setPinVerified(true);
      setShowPINModal(false);
      showToast('PIN đúng! Xác nhận xóa dữ liệu...', 'success');
    } else {
      showToast('PIN không đúng! Vui lòng thử lại.', 'error');
    }
  };

  const handleConfirmDelete = () => {
    onDelete();
    setPinVerified(false);
    onClose();
    showToast('Đã xóa toàn bộ dữ liệu! Bé có thể học lại từ đầu.', 'success');
  };

  const handleCancel = () => {
    setShowPINModal(false);
    setPinVerified(false);
  };

  return (
    <>
      {/* PIN Entry Modal */}
      <PINEntryModal
        isOpen={showPINModal}
        title="🔐 Nhập Mã PIN"
        description="Nhập mã PIN 4 số để xác thực xóa dữ liệu"
        onVerify={handlePINVerify}
        onCancel={handleCancel}
        maxLength={4}
      />

      {/* Delete Confirmation Modal */}
      {pinVerified && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={handleCancel}
            style={{
              animation: 'fadeIn 0.3s ease-out',
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <div
              className="pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-viet-style-raised border-4 border-red-700/30 max-w-md w-full animate-slide-up"
              style={{
                animation: 'slideUp 0.4s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-5xl md:text-6xl mb-4">🗑️</div>
                <h2 className="text-2xl md:text-3xl font-black text-red-900 mb-2">
                  Xóa Toàn Bộ Dữ Liệu
                </h2>
                <p className="text-sm md:text-base text-amber-800">
                  Bạn có chắc muốn xóa toàn bộ dữ liệu học tập của bé?
                </p>
              </div>

              {/* Warning */}
              <div className="bg-red-100/50 p-4 rounded-2xl shadow-viet-style-pressed border-2 border-red-700/30 mb-6">
                <p className="text-sm md:text-base text-red-900 font-bold mb-2">
                  ⚠️ CẢNH BÁO:
                </p>
                <ul className="text-xs md:text-sm text-red-800 space-y-1 list-disc list-inside">
                  <li>Xóa toàn bộ tiến độ bài học</li>
                  <li>Xóa toàn bộ thử thách đã hoàn thành</li>
                  <li>Xóa toàn bộ lựa chọn (bộ sách, lớp, môn)</li>
                  <li>Bé sẽ học lại từ đầu (progress = 0)</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 md:py-4 bg-amber-200 text-amber-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-700/30 text-sm md:text-base"
                >
                  ❌ Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-3 md:py-4 bg-red-200 text-red-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-red-700/30 text-sm md:text-base"
                >
                  ✓ Xác Nhận Xóa
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Delete Button Modal (if not PIN verified yet) */}
      {!pinVerified && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={onClose}
            style={{
              animation: 'fadeIn 0.3s ease-out',
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <div
              className="pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-viet-style-raised border-4 border-amber-800/30 max-w-md w-full animate-slide-up"
              style={{
                animation: 'slideUp 0.4s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-5xl md:text-6xl mb-4">🗑️</div>
                <h2 className="text-2xl md:text-3xl font-black text-amber-900 mb-2">
                  Xóa Dữ Liệu
                </h2>
                <p className="text-sm md:text-base text-amber-800">
                  Xóa toàn bộ dữ liệu học tập để bé học lại từ đầu
                </p>
              </div>

              {/* Info */}
              <div className="bg-yellow-100/50 p-4 rounded-2xl shadow-viet-style-pressed border-2 border-yellow-700/30 mb-6">
                <p className="text-xs md:text-sm text-amber-800">
                  💡 Bạn cần nhập mã PIN bảo mật để xác thực xóa dữ liệu
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 md:py-4 bg-amber-200 text-amber-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-700/30 text-sm md:text-base"
                >
                  ❌ Hủy
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 py-3 md:py-4 bg-red-200 text-red-900 rounded-2xl font-bold shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-red-700/30 text-sm md:text-base"
                >
                  🔐 Xóa Dữ Liệu
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DeleteDataModal;

