import { useEffect, useState } from 'react';
import { syncService, type SyncProgress } from '../lib/services/syncService.js';

export function useSyncData(autoSync = true) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (autoSync) {
      syncData();
    }
  }, [autoSync]);

  const syncData = async (force = false) => {
    try {
      setIsSyncing(true);
      setError(null);

      // Set progress callback
      syncService.setProgressCallback((progress) => {
        setSyncProgress(progress);
      });

      // Check if sync needed
      const needsSync = await syncService.checkSyncNeeded();
      if (!force && !needsSync) {
        console.log('✅ Data already up to date');
        setSyncProgress({
          status: 'completed',
          total: 0,
          completed: 0,
          current: 'Already up to date',
        });
        setIsSyncing(false);
        return;
      }

      // Sync all data
      await syncService.syncAll(force);
      setLastSync(new Date());
      console.log('✅ Data synced successfully');
    } catch (err: any) {
      console.error('❌ Error syncing data:', err);
      setError(err.message || 'Sync failed');
      setSyncProgress({
        status: 'error',
        error: err.message || 'Sync failed',
        total: 0,
        completed: 0,
        current: 'Sync failed',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getCacheInfo = () => {
    return syncService.getCacheInfo();
  };

  const clearCache = () => {
    syncService.clearCache();
    setLastSync(null);
  };

  return {
    isSyncing,
    syncProgress,
    lastSync,
    error,
    syncData,
    getCacheInfo,
    clearCache,
  };
}

