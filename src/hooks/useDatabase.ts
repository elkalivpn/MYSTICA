'use client';

/**
 * useDatabase Hook
 * Provides database access with offline-first support
 * Handles connection state, sync status, and pending operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { db, DatabaseService, ModelName, QueryOptions } from '@/lib/db';
import { localStorageAdapter, PendingOperation } from '@/lib/db/adapters/localStorage';

// Types
export interface DatabaseState {
  isConnected: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  provider: 'prisma' | 'localStorage';
  lastSyncTime: Date | null;
  error: string | null;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  error?: string;
}

// Initial state
const initialState: DatabaseState = {
  isConnected: false,
  isSyncing: false,
  pendingOperations: 0,
  provider: 'localStorage',
  lastSyncTime: null,
  error: null,
};

/**
 * useDatabase Hook
 */
export function useDatabase() {
  const [state, setState] = useState<DatabaseState>(initialState);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dbRef = useRef<DatabaseService>(db);

  /**
   * Update state from database connection status
   */
  const updateState = useCallback(() => {
    const status = dbRef.current.getConnectionStatus();
    setState(prev => ({
      ...prev,
      isConnected: status.connected,
      provider: status.provider as 'prisma' | 'localStorage',
      pendingOperations: status.pendingOperations,
    }));
  }, []);

  /**
   * Connect to database
   */
  const connect = useCallback(async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const connected = await dbRef.current.connect();
      updateState();
      return connected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [updateState]);

  /**
   * Disconnect from database
   */
  const disconnect = useCallback(async (): Promise<void> => {
    await dbRef.current.disconnect();
    updateState();
  }, [updateState]);

  /**
   * Sync pending operations
   */
  const sync = useCallback(async (): Promise<SyncResult> => {
    if (state.isSyncing) {
      return { success: false, synced: 0, failed: 0, error: 'Sync already in progress' };
    }

    setState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const result = await dbRef.current.syncPendingOperations();
      
      setState(prev => ({
        ...prev,
        isSyncing: false,
        pendingOperations: localStorageAdapter.getPendingCount(),
        lastSyncTime: new Date(),
      }));

      return {
        success: result.failed === 0,
        synced: result.synced,
        failed: result.failed,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setState(prev => ({
        ...prev,
        isSyncing: false,
        error: errorMessage,
      }));
      
      return {
        success: false,
        synced: 0,
        failed: localStorageAdapter.getPendingCount(),
        error: errorMessage,
      };
    }
  }, [state.isSyncing]);

  /**
   * Clear pending operations
   */
  const clearPending = useCallback((): void => {
    localStorageAdapter.clearPendingOperations();
    setState(prev => ({ ...prev, pendingOperations: 0 }));
  }, []);

  /**
   * Get pending operations list
   */
  const getPendingOperations = useCallback((): PendingOperation[] => {
    return localStorageAdapter.getPendingOperations();
  }, []);

  /**
   * Check connection status
   */
  const checkConnection = useCallback(async (): Promise<boolean> => {
    const connected = await dbRef.current.checkConnection();
    updateState();
    return connected;
  }, [updateState]);

  // ========================================
  // CRUD Operations
  // ========================================

  /**
   * Create a new record
   */
  const create = useCallback(async <T>(
    model: ModelName,
    data: Record<string, unknown>
  ): Promise<T> => {
    return dbRef.current.create<T>(model, data);
  }, []);

  /**
   * Find a record by ID
   */
  const findById = useCallback(async <T>(
    model: ModelName,
    id: string
  ): Promise<T | null> => {
    return dbRef.current.findById<T>(model, id);
  }, []);

  /**
   * Find multiple records
   */
  const findMany = useCallback(async <T>(
    model: ModelName,
    options?: QueryOptions
  ): Promise<T[]> => {
    return dbRef.current.findMany<T>(model, options);
  }, []);

  /**
   * Find first matching record
   */
  const findFirst = useCallback(async <T>(
    model: ModelName,
    where: Record<string, unknown>
  ): Promise<T | null> => {
    return dbRef.current.findFirst<T>(model, where);
  }, []);

  /**
   * Update a record
   */
  const update = useCallback(async <T>(
    model: ModelName,
    id: string,
    data: Record<string, unknown>
  ): Promise<T | null> => {
    return dbRef.current.update<T>(model, id, data);
  }, []);

  /**
   * Delete a record
   */
  const deleteRecord = useCallback(async (
    model: ModelName,
    id: string
  ): Promise<boolean> => {
    return dbRef.current.delete(model, id);
  }, []);

  /**
   * Count records
   */
  const count = useCallback(async (
    model: ModelName,
    where?: Record<string, unknown>
  ): Promise<number> => {
    return dbRef.current.count(model, where);
  }, []);

  // ========================================
  // Model-Specific Operations
  // ========================================

  /**
   * User operations
   */
  const users = {
    create: (data: Record<string, unknown>) => create('user', data),
    findById: (id: string) => findById('user', id),
    findByEmail: (email: string) => findFirst('user', { email }),
    findAll: (options?: QueryOptions) => findMany('user', options),
    update: (id: string, data: Record<string, unknown>) => update('user', id, data),
    delete: (id: string) => deleteRecord('user', id),
    count: (where?: Record<string, unknown>) => count('user', where),
  };

  /**
   * Meditation session operations
   */
  const meditationSessions = {
    create: (data: Record<string, unknown>) => create('meditationSession', data),
    findById: (id: string) => findById('meditationSession', id),
    findByUser: (userId: string, options?: QueryOptions) => 
      findMany('meditationSession', { where: { userId }, ...options }),
    findAll: (options?: QueryOptions) => findMany('meditationSession', options),
    update: (id: string, data: Record<string, unknown>) => 
      update('meditationSession', id, data),
    delete: (id: string) => deleteRecord('meditationSession', id),
    count: (where?: Record<string, unknown>) => count('meditationSession', where),
  };

  /**
   * Tarot reading operations
   */
  const tarotReadings = {
    create: (data: Record<string, unknown>) => create('tarotReading', data),
    findById: (id: string) => findById('tarotReading', id),
    findByUser: (userId: string, options?: QueryOptions) => 
      findMany('tarotReading', { where: { userId }, ...options }),
    findAll: (options?: QueryOptions) => findMany('tarotReading', options),
    update: (id: string, data: Record<string, unknown>) => 
      update('tarotReading', id, data),
    delete: (id: string) => deleteRecord('tarotReading', id),
    count: (where?: Record<string, unknown>) => count('tarotReading', where),
  };

  /**
   * User progress operations
   */
  const userProgress = {
    create: (data: Record<string, unknown>) => create('userProgress', data),
    findById: (id: string) => findById('userProgress', id),
    findByUser: (userId: string) => findFirst('userProgress', { userId }),
    update: (id: string, data: Record<string, unknown>) => 
      update('userProgress', id, data),
    upsert: async (userId: string, data: Record<string, unknown>) => {
      const existing = await findFirst('userProgress', { userId });
      if (existing) {
        return update('userProgress', (existing as { id: string }).id, data);
      }
      return create('userProgress', { ...data, userId });
    },
  };

  /**
   * Reminder operations
   */
  const reminders = {
    create: (data: Record<string, unknown>) => create('reminder', data),
    findById: (id: string) => findById('reminder', id),
    findByUser: (userId: string, options?: QueryOptions) => 
      findMany('reminder', { where: { userId }, ...options }),
    findEnabled: (userId: string) => 
      findMany('reminder', { where: { userId, enabled: true } }),
    update: (id: string, data: Record<string, unknown>) => 
      update('reminder', id, data),
    delete: (id: string) => deleteRecord('reminder', id),
  };

  /**
   * Subscription operations
   */
  const subscriptions = {
    create: (data: Record<string, unknown>) => create('subscription', data),
    findById: (id: string) => findById('subscription', id),
    findByUser: (userId: string) => findFirst('subscription', { userId }),
    update: (id: string, data: Record<string, unknown>) => 
      update('subscription', id, data),
    findActive: () => findMany('subscription', { where: { status: 'active' } }),
  };

  // ========================================
  // Effects
  // ========================================

  // Initialize on mount
  useEffect(() => {
    updateState();
    
    // Start auto-sync interval
    syncIntervalRef.current = setInterval(() => {
      const status = dbRef.current.getConnectionStatus();
      if (status.connected && status.pendingOperations > 0) {
        sync();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [updateState, sync]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      const connected = await connect();
      if (connected) {
        await sync();
      }
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isConnected: false, provider: 'localStorage' }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [connect, sync]);

  return {
    // State
    ...state,
    
    // Connection methods
    connect,
    disconnect,
    checkConnection,
    
    // Sync methods
    sync,
    clearPending,
    getPendingOperations,
    
    // Generic CRUD
    create,
    findById,
    findMany,
    findFirst,
    update,
    delete: deleteRecord,
    count,
    
    // Model-specific operations
    users,
    meditationSessions,
    tarotReadings,
    userProgress,
    reminders,
    subscriptions,
    
    // Utility
    exportData: () => dbRef.current.exportData(),
    importData: (data: Record<string, unknown>) => dbRef.current.importData(data),
  };
}

// Export types
export type { ModelName, QueryOptions };
