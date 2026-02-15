/**
 * LocalStorage Adapter for Offline-First Database Support
 * Provides a fallback when database connection is not available
 * Supports offline queue for pending operations
 */

// Types
export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  model: string;
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

export interface LocalStorageConfig {
  prefix: string;
  maxRetries: number;
  syncInterval: number;
}

// Default configuration
const DEFAULT_CONFIG: LocalStorageConfig = {
  prefix: 'mystica_',
  maxRetries: 3,
  syncInterval: 30000, // 30 seconds
};

/**
 * LocalStorage Adapter Class
 * Handles all local storage operations with offline-first approach
 */
export class LocalStorageAdapter {
  private config: LocalStorageConfig;
  private syncTimer: NodeJS.Timeout | null = null;
  private onSyncCallback: ((operations: PendingOperation[]) => Promise<void>) | null = null;

  constructor(config: Partial<LocalStorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the storage key with prefix
   */
  private getKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  /**
   * Get all items for a model
   */
  getAll<T>(model: string): T[] {
    if (!this.isAvailable()) return [];
    
    const key = this.getKey(model);
    const data = localStorage.getItem(key);
    
    if (!data) return [];
    
    try {
      return JSON.parse(data) as T[];
    } catch {
      console.error(`Error parsing ${model} from localStorage`);
      return [];
    }
  }

  /**
   * Get a single item by ID
   */
  getById<T extends { id: string }>(model: string, id: string): T | null {
    const items = this.getAll<T>(model);
    return items.find(item => item.id === id) || null;
  }

  /**
   * Get items by field value
   */
  getByField<T>(model: string, field: string, value: unknown): T[] {
    const items = this.getAll<T>(model);
    return items.filter(item => (item as Record<string, unknown>)[field] === value);
  }

  /**
   * Create a new item
   */
  create<T extends { id: string }>(model: string, data: T): T {
    const items = this.getAll<T>(model);
    items.push(data);
    this.save(model, items);
    this.addPendingOperation('create', model, data);
    return data;
  }

  /**
   * Update an existing item
   */
  update<T extends { id: string }>(model: string, id: string, data: Partial<T>): T | null {
    const items = this.getAll<T>(model);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...items[index], ...data } as T;
    items[index] = updatedItem;
    this.save(model, items);
    this.addPendingOperation('update', model, updatedItem);
    
    return updatedItem;
  }

  /**
   * Delete an item
   */
  delete<T extends { id: string }>(model: string, id: string): boolean {
    const items = this.getAll<T>(model);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    const deletedItem = items[index];
    items.splice(index, 1);
    this.save(model, items);
    this.addPendingOperation('delete', model, deletedItem);
    
    return true;
  }

  /**
   * Save items to localStorage
   */
  private save<T>(model: string, items: T[]): void {
    if (!this.isAvailable()) return;
    
    const key = this.getKey(model);
    localStorage.setItem(key, JSON.stringify(items));
  }

  /**
   * Clear all data for a model
   */
  clearModel(model: string): void {
    if (!this.isAvailable()) return;
    
    const key = this.getKey(model);
    localStorage.removeItem(key);
  }

  /**
   * Clear all Mystica data
   */
  clearAll(): void {
    if (!this.isAvailable()) return;
    
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.config.prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // ========================================
  // Pending Operations Queue
  // ========================================

  /**
   * Get pending operations queue
   */
  getPendingOperations(): PendingOperation[] {
    if (!this.isAvailable()) return [];
    
    const key = this.getKey('pending_operations');
    const data = localStorage.getItem(key);
    
    if (!data) return [];
    
    try {
      return JSON.parse(data) as PendingOperation[];
    } catch {
      return [];
    }
  }

  /**
   * Add an operation to the pending queue
   */
  private addPendingOperation(
    type: PendingOperation['type'],
    model: string,
    data: Record<string, unknown>
  ): void {
    if (!this.isAvailable()) return;
    
    const operations = this.getPendingOperations();
    
    const operation: PendingOperation = {
      id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      model,
      data,
      timestamp: Date.now(),
      retries: 0,
    };
    
    operations.push(operation);
    
    const key = this.getKey('pending_operations');
    localStorage.setItem(key, JSON.stringify(operations));
  }

  /**
   * Remove an operation from the queue
   */
  removePendingOperation(operationId: string): void {
    if (!this.isAvailable()) return;
    
    const operations = this.getPendingOperations();
    const filtered = operations.filter(op => op.id !== operationId);
    
    const key = this.getKey('pending_operations');
    localStorage.setItem(key, JSON.stringify(filtered));
  }

  /**
   * Update operation retry count
   */
  incrementRetry(operationId: string): boolean {
    if (!this.isAvailable()) return false;
    
    const operations = this.getPendingOperations();
    const operation = operations.find(op => op.id === operationId);
    
    if (!operation) return false;
    
    operation.retries += 1;
    
    if (operation.retries >= this.config.maxRetries) {
      this.removePendingOperation(operationId);
      return false;
    }
    
    const key = this.getKey('pending_operations');
    localStorage.setItem(key, JSON.stringify(operations));
    return true;
  }

  /**
   * Clear all pending operations
   */
  clearPendingOperations(): void {
    if (!this.isAvailable()) return;
    
    const key = this.getKey('pending_operations');
    localStorage.removeItem(key);
  }

  /**
   * Get count of pending operations
   */
  getPendingCount(): number {
    return this.getPendingOperations().length;
  }

  // ========================================
  // Synchronization
  // ========================================

  /**
   * Set callback for sync operations
   */
  onSync(callback: (operations: PendingOperation[]) => Promise<void>): void {
    this.onSyncCallback = callback;
  }

  /**
   * Start automatic sync
   */
  startAutoSync(): void {
    if (this.syncTimer) return;
    
    this.syncTimer = setInterval(() => {
      this.sync();
    }, this.config.syncInterval);
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Manual sync trigger
   */
  async sync(): Promise<{ success: boolean; synced: number; failed: number }> {
    const operations = this.getPendingOperations();
    
    if (operations.length === 0) {
      return { success: true, synced: 0, failed: 0 };
    }
    
    if (!this.onSyncCallback) {
      console.warn('No sync callback registered');
      return { success: false, synced: 0, failed: operations.length };
    }
    
    try {
      await this.onSyncCallback(operations);
      
      // Clear successfully synced operations
      this.clearPendingOperations();
      
      return { success: true, synced: operations.length, failed: 0 };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, synced: 0, failed: operations.length };
    }
  }

  // ========================================
  // Utility Methods
  // ========================================

  /**
   * Get storage usage
   */
  getStorageUsage(): { used: number; available: number; percentage: number } {
    if (!this.isAvailable()) {
      return { used: 0, available: 0, percentage: 0 };
    }
    
    let used = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }
    
    // localStorage typically has 5MB limit
    const available = 5 * 1024 * 1024;
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  }

  /**
   * Export all data as JSON
   */
  exportData(): Record<string, unknown> {
    if (!this.isAvailable()) return {};
    
    const data: Record<string, unknown> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.config.prefix)) {
        const value = localStorage.getItem(key);
        if (value) {
          const cleanKey = key.replace(this.config.prefix, '');
          try {
            data[cleanKey] = JSON.parse(value);
          } catch {
            data[cleanKey] = value;
          }
        }
      }
    }
    
    return data;
  }

  /**
   * Import data from JSON
   */
  importData(data: Record<string, unknown>): void {
    if (!this.isAvailable()) return;
    
    Object.entries(data).forEach(([key, value]) => {
      const storageKey = this.getKey(key);
      localStorage.setItem(storageKey, JSON.stringify(value));
    });
  }
}

// Export singleton instance
export const localStorageAdapter = new LocalStorageAdapter();
