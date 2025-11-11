import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Page } from './types';
import BottomNav from './components/BottomNav';

// Lazy load pages for code splitting
const HocPage = lazy(() => import('./components/pages/HocPage'));
const OnTapPage = lazy(() => import('./components/pages/OnTapPage'));
const AlbumPage = lazy(() => import('./components/pages/AlbumPage'));
const HoSoPage = lazy(() => import('./components/pages/HoSoPage'));
const PhuHuynhPage = lazy(() => import('./components/pages/PhuHuynhPage'));
const ExercisePage = lazy(() => import('./components/pages/ExercisePage'));
import VietnameseScenery from './components/VietnameseScenery';
import LoginPage from './src/components/auth/LoginPage';
import AdminDashboard from './src/components/admin/AdminDashboard';
import { useAuth } from './src/contexts/AuthContext';
import ToastProvider from './components/common/ToastNotification';
import { DailyChallengeProvider } from './contexts/DailyChallengeContext';
import { AdaptiveDifficultyProvider } from './contexts/AdaptiveDifficultyContext';
import KeyboardShortcuts from './components/common/KeyboardShortcuts';
import OfflineIndicator from './components/common/OfflineIndicator';
import InstallPrompt from './components/common/InstallPrompt';
import { useSyncData } from './src/hooks/useSyncData';

// Global styles are now in src/index.css (Tailwind CSS)
// No need for GlobalStyles component anymore


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.Hoc);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isExerciseMode, setIsExerciseMode] = useState(false);
  const [exerciseData, setExerciseData] = useState<{
    weekId: number;
    bookSeries: string;
    grade: number;
    subject: string;
    examType?: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH';
  } | null>(null);
  const { user, loading, isAuthenticated } = useAuth();
  
  // Auto-sync data when app starts (only on mobile/Capacitor)
  const { isSyncing, syncProgress, lastSync, error: syncError } = useSyncData(
    typeof window !== 'undefined' && (window as any).Capacitor !== undefined
  );

  // Prefetch pages khi user có thể navigate (optimize performance)
  useEffect(() => {
    // Prefetch các pages có thể được navigate
    const prefetchPages = [
      () => import('./components/pages/OnTapPage'),
      () => import('./components/pages/AlbumPage'),
      () => import('./components/pages/HoSoPage'),
      () => import('./components/pages/PhuHuynhPage'),
    ];
    
    // Prefetch sau 2 giây (không block initial load)
    const prefetchTimer = setTimeout(() => {
      prefetchPages.forEach((prefetchFn) => {
        prefetchFn().catch(() => {}); // Ignore errors
      });
    }, 2000);
    
    return () => clearTimeout(prefetchTimer);
  }, []);

  const handleStartWeek = (weekId: number, bookSeries: string, grade: number, subject: string, examType?: 'THI_HUONG' | 'THI_HOI' | 'THI_DINH') => {
    setExerciseData({ weekId, bookSeries, grade, subject, examType });
    setIsExerciseMode(true);
  };

  const handleBackFromExercise = () => {
    setIsExerciseMode(false);
    setExerciseData(null);
    // Dispatch event để HocPage reload selection khi quay lại
    window.dispatchEvent(new Event('exercisePageClosed'));
  };

  const handleNavigate = (page: 'Hoc' | 'OnTap' | 'Album' | 'HoSo' | 'PhuHuynh') => {
    const pageMap: { [key: string]: Page } = {
      'Hoc': Page.Hoc,
      'OnTap': Page.OnTap,
      'Album': Page.Album,
      'HoSo': Page.HoSo,
      'PhuHuynh': Page.PhuHuynh,
    };
    setActivePage(pageMap[page]);
  };

  const renderPage = () => {
    // Show ExercisePage if in exercise mode
    if (isExerciseMode && exerciseData) {
      return (
        <ExercisePage
          weekId={exerciseData.weekId}
          bookSeries={exerciseData.bookSeries}
          grade={exerciseData.grade}
          subject={exerciseData.subject}
          onBack={handleBackFromExercise}
          examType={exerciseData.examType}
        />
      );
    }

    // Show normal pages
    switch (activePage) {
      case Page.Hoc:
        return <HocPage onStartWeek={handleStartWeek} />;
      case Page.OnTap:
        return <OnTapPage onStartExam={(examType, weekId, bookSeries, grade, subject) => handleStartWeek(weekId, bookSeries, grade, subject, examType)} />;
      case Page.Album:
        return <AlbumPage />;
      case Page.HoSo:
        return <HoSoPage />;
      case Page.PhuHuynh:
        // Tab "Ủng hộ" mở DonateModal trực tiếp
        return <PhuHuynhPage />;
      default:
        return <HocPage onStartWeek={handleStartWeek} />;
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5]">
        <div className="text-2xl font-black text-amber-900">Đang tải...</div>
      </div>
    );
  }

  // TEMPORARY: Skip authentication check for testing
  // TODO: Re-enable authentication by uncommenting the code below
  // Show login page if not authenticated
  // if (!isAuthenticated) {
  //   return <LoginPage />;
  // }

  // Show admin dashboard if in admin mode
  if (isAdminMode && user?.role === 'admin') {
    return <AdminDashboard onExit={() => setIsAdminMode(false)} />;
  }

  // Show main app
  return (
    <ToastProvider>
      <DailyChallengeProvider>
        <AdaptiveDifficultyProvider>
          <KeyboardShortcuts onNavigate={handleNavigate} />
          <OfflineIndicator />
          <InstallPrompt />
          <VietnameseScenery />
          <div className="relative w-full max-w-5xl mx-auto min-h-screen">
            {/* Admin mode button (only for admin users) */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setIsAdminMode(true)}
                className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg hover:bg-blue-600 transition-all"
              >
                🔧 Admin
              </button>
            )}
        <main className="pb-28 md:pb-32">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5]">
              <div className="text-2xl font-black text-amber-900">Đang tải...</div>
            </div>
          }>
            {/* Only render pages when auth is ready (loading = false) */}
            {!loading && renderPage()}
          </Suspense>
        </main>
            {!isExerciseMode && (
              <BottomNav activePage={activePage} setActivePage={setActivePage} />
            )}
          </div>
        </AdaptiveDifficultyProvider>
      </DailyChallengeProvider>
    </ToastProvider>
  );
};

export default App;