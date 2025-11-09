import React, { useState, useEffect } from 'react';
import { useToast } from './ToastNotification';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Đã kết nối lại! 🌐', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('Không có kết nối mạng. Một số tính năng có thể bị hạn chế.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg border-2 border-red-700/30 animate-bounce-slow">
      <div className="flex items-center space-x-2">
        <span className="text-lg">📡</span>
        <span className="font-bold text-sm">Không có kết nối mạng</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;

