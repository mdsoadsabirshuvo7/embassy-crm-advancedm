// Offline-First Storage System using IndexedDB
class OfflineStorageManager {
  private dbName = 'EmbassyCRM';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for different data types
        if (!db.objectStoreNames.contains('clients')) {
          db.createObjectStore('clients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('audit_logs')) {
          const auditStore = db.createObjectStore('audit_logs', { keyPath: 'id', autoIncrement: true });
          auditStore.createIndex('timestamp', 'timestamp', { unique: false });
          auditStore.createIndex('userId', 'userId', { unique: false });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async store(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        // Add to sync queue for later upload
        this.addToSyncQueue(storeName, 'PUT', data);
        resolve();
      };
    });
  }

  async get(storeName: string, id: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll(storeName: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.addToSyncQueue(storeName, 'DELETE', { id });
        resolve();
      };
    });
  }

  private async addToSyncQueue(storeName: string, operation: string, data: any): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    
    store.add({
      storeName,
      operation,
      data,
      timestamp: Date.now(),
      synced: false
    });
  }

  async syncPendingChanges(): Promise<void> {
    if (!navigator.onLine) return;

    const pendingItems = await this.getPendingSyncItems();
    
    for (const item of pendingItems) {
      try {
        // Here you would sync with your backend (Firebase/API)
        await this.syncItem(item);
        await this.markItemSynced(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }
  }

  private async getPendingSyncItems(): Promise<any[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_queue'], 'readonly');
      const store = transaction.objectStore('sync_queue');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const items = request.result.filter(item => !item.synced);
        resolve(items);
      };
    });
  }

  private async syncItem(item: any): Promise<void> {
    // Implement sync logic with Firebase
    console.log('Syncing item:', item);
    // This would integrate with your existing Firebase services
  }

  private async markItemSynced(itemId: number): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    const request = store.get(itemId);

    request.onsuccess = () => {
      const item = request.result;
      if (item) {
        item.synced = true;
        store.put(item);
      }
    };
  }

  // Check online status and sync when back online
  setupAutoSync(): void {
    window.addEventListener('online', () => {
      console.log('Back online, syncing changes...');
      this.syncPendingChanges();
    });

    // Periodic sync when online
    setInterval(() => {
      if (navigator.onLine) {
        this.syncPendingChanges();
      }
    }, 30000); // Sync every 30 seconds when online
  }
}

export const offlineStorage = new OfflineStorageManager();