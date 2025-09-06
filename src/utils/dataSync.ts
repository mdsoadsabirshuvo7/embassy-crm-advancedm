import { offlineStorage } from './offlineStorage';
import { auditLogger } from './auditLogger';
import { LocalStorageService } from '../services/localStorageService';

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingSync: number;
  isSyncing: boolean;
}

class DataSyncManager {
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingSync: 0,
    isSyncing: false
  };

  private listeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    this.initializeSync();
  }

  private async initializeSync() {
    try {
      await offlineStorage.init();
      offlineStorage.setupAutoSync();
      
      // Set up network status listeners
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      
      // Load last sync time
      const lastSyncStr = localStorage.getItem('lastSyncTime');
      if (lastSyncStr) {
        this.syncStatus.lastSync = new Date(lastSyncStr);
      }
      
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to initialize data sync:', error);
    }
  }

  private handleOnline() {
    this.syncStatus.isOnline = true;
    this.notifyListeners();
    this.performSync();
  }

  private handleOffline() {
    this.syncStatus.isOnline = false;
    this.notifyListeners();
  }

  async performSync(): Promise<void> {
    if (!this.syncStatus.isOnline || this.syncStatus.isSyncing) {
      return;
    }

    this.syncStatus.isSyncing = true;
    this.notifyListeners();

    try {
      // Sync with IndexedDB
      await offlineStorage.syncPendingChanges();
      
      // Update sync status
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingSync = 0;
      localStorage.setItem('lastSyncTime', this.syncStatus.lastSync.toISOString());
      
      console.log('Data sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      await auditLogger.log(
        'system',
        'System',
        'SYNC_ERROR',
        'sync',
        undefined,
        undefined,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    } finally {
      this.syncStatus.isSyncing = false;
      this.notifyListeners();
    }
  }

  // Store data with offline support
  async storeData<T>(
    storeName: string,
    data: T,
    localStorageMethod: (data: T) => void,
    userId?: string,
    userName?: string
  ): Promise<void> {
    try {
      // Store in IndexedDB for offline support
      await offlineStorage.store(storeName, data);
      
      // Also store in localStorage for immediate access
      localStorageMethod(data);
      
      // Log the action
      if (userId && userName) {
        await auditLogger.logCreate(
          userId,
          userName,
          storeName,
          (data as any).id || 'unknown',
          data
        );
      }
    } catch (error) {
      console.error('Failed to store data:', error);
      throw error;
    }
  }

  // Get sync status
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Subscribe to sync status changes
  onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  // Manual sync trigger
  async forcSync(): Promise<void> {
    await this.performSync();
  }
}

export const dataSyncManager = new DataSyncManager();