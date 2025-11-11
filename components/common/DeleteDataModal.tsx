import React from 'react';
import { useToast } from './ToastNotification';

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  parentPin?: string; // Không dùng nữa, giữ lại để không break interface
}

const DeleteDataModal: React.FC<DeleteDataModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    onDelete();
    onClose();
    showToast('Đã xóa toàn bộ dữ liệu! Bé có thể học lại từ đầu.', 'success');
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
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
                onClick={onClose}
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
    </>
  );
};

export default DeleteDataModal;

