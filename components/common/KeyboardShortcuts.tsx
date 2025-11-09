import React, { useEffect, useState } from 'react';
import { useToast } from './ToastNotification';
import { playSound } from './SoundEffects';

interface KeyboardShortcutsProps {
  onNavigate: (page: 'Hoc' | 'OnTap' | 'Album' | 'HoSo') => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + number
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            onNavigate('Hoc');
            playSound('tap');
            showToast('📚 Chuyển đến Học', 'info');
            break;
          case '2':
            e.preventDefault();
            onNavigate('OnTap');
            playSound('tap');
            showToast('📖 Chuyển đến Ôn tập', 'info');
            break;
          case '3':
            e.preventDefault();
            onNavigate('Album');
            playSound('tap');
            showToast('📸 Chuyển đến Album', 'info');
            break;
          case '4':
            e.preventDefault();
            onNavigate('HoSo');
            playSound('tap');
            showToast('👤 Chuyển đến Hồ sơ', 'info');
            break;
          case '?':
            e.preventDefault();
            setShowHelp(!showHelp);
            playSound('tap');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate, showToast]);

  if (!showHelp) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setShowHelp(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-6 shadow-viet-style-raised border-4 border-amber-800/30 max-w-md w-full animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-amber-900 flex items-center">
              <span className="text-2xl mr-2">⌨️</span>
              Phím tắt
            </h3>
            <button
              onClick={() => setShowHelp(false)}
              className="text-2xl hover:scale-110 transition-transform text-amber-800"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            <div className="bg-yellow-100/40 p-3 rounded-xl border-2 border-yellow-700/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Ctrl + 1</span>
                <span className="text-amber-800">📚 Học</span>
              </div>
            </div>
            <div className="bg-yellow-100/40 p-3 rounded-xl border-2 border-yellow-700/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Ctrl + 2</span>
                <span className="text-amber-800">📖 Ôn tập</span>
              </div>
            </div>
            <div className="bg-yellow-100/40 p-3 rounded-xl border-2 border-yellow-700/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Ctrl + 3</span>
                <span className="text-amber-800">📸 Album</span>
              </div>
            </div>
            <div className="bg-yellow-100/40 p-3 rounded-xl border-2 border-yellow-700/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Ctrl + 4</span>
                <span className="text-amber-800">👤 Hồ sơ</span>
              </div>
            </div>
            <div className="bg-yellow-100/40 p-3 rounded-xl border-2 border-yellow-700/20">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Ctrl + ?</span>
                <span className="text-amber-800">Hiển thị phím tắt</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-yellow-700/20">
            <p className="text-xs text-amber-700 text-center">
              💡 Tip: Nhấn Ctrl + ? để mở/đóng danh sách phím tắt
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcuts;

