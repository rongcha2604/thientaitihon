import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if app is installed on iOS
    if ((window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was just installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    await deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  // Don't show if already installed
  if (isInstalled) return null;

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <div className="bg-[#FDFBF5]/95 backdrop-blur-sm rounded-3xl p-4 shadow-viet-style-raised border-2 border-amber-700/30 max-w-md w-full pointer-events-auto animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📱</div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-amber-900 mb-1">Tải ứng dụng về máy</h3>
            <p className="text-sm text-amber-800">
              Cài đặt để sử dụng nhanh hơn, không cần mở trình duyệt!
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-amber-600 hover:text-amber-800 text-xl font-bold px-2"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-amber-400 text-amber-900 font-bold py-2 rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-amber-700/30"
          >
            📥 Cài đặt
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl shadow-viet-style-raised hover:scale-105 active:scale-95 transition-all border-2 border-gray-400/30"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

