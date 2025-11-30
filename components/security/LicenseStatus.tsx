import React, { useState, useEffect } from 'react';
import { getLicenseExpiry, getStoredLicenseKey } from '../../src/lib/license';

const LicenseStatus: React.FC = () => {
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    const checkLicense = () => {
      const expiry = getLicenseExpiry();
      const key = getStoredLicenseKey();
      
      if (!key) {
        return;
      }

      if (!expiry) {
        // Permanent license
        setIsPermanent(true);
        setExpiryDate(null);
        setTimeLeft(null);
      } else {
        // Time-limited license
        setIsPermanent(false);
        setExpiryDate(expiry);
        updateTimeLeft(expiry);
      }
    };

    checkLicense();
    
    // Update countdown every second
    const interval = setInterval(() => {
      if (expiryDate) {
        updateTimeLeft(expiryDate);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  const updateTimeLeft = (expiry: Date) => {
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      // Expired
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  if (isPermanent) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl shadow-lg border-2 border-green-600/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="font-bold text-sm">License: Vĩnh viễn</span>
        </div>
      </div>
    );
  }

  if (!expiryDate || !timeLeft) {
    return null;
  }

  const isExpiringSoon = timeLeft.days < 7;

  return (
    <div className={`fixed top-4 right-4 z-50 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg border-2 ${
      isExpiringSoon 
        ? 'bg-red-500/90 border-red-600/50' 
        : 'bg-blue-500/90 border-blue-600/50'
    } text-white`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{isExpiringSoon ? '⚠️' : '⏰'}</span>
          <span className="font-bold text-xs">License còn lại:</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-sm">
          <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.days).padStart(2, '0')}</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span>:</span>
          <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
        <div className="text-xs opacity-90">
          Hết hạn: {expiryDate.toLocaleDateString('vi-VN')} {expiryDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default LicenseStatus;

