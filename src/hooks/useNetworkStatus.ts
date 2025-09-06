import { useState, useEffect } from 'react';
import { dataSyncManager, SyncStatus } from '../utils/dataSync';

export const useNetworkStatus = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(dataSyncManager.getSyncStatus());

  useEffect(() => {
    const unsubscribe = dataSyncManager.onSyncStatusChange(setSyncStatus);
    return unsubscribe;
  }, []);

  const forceSync = async () => {
    await dataSyncManager.forcSync();
  };

  return {
    ...syncStatus,
    forceSync
  };
};