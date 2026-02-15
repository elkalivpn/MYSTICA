/**
 * Database Service for Mystica
 * Provides unified database access with multi-provider support
 * Falls back to localStorage when database is not available
 */

import { PrismaClient } from '@prisma/client';
import { localStorageAdapter, PendingOperation } from './adapters/localStorage';

// Prisma client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Types
export type ModelName = 
  | 'user'
  | 'meditationSession'
  | 'tarotReading'
  | 'userProgress'
  | 'reminder'
  | 'subscription';

export interface DatabaseConfig {
  provider: 'prisma' | 'localStorage' | 'auto';
  enableOfflineQueue: boolean;
  syncOnReconnect: boolean;
}

export interface QueryOptions {
  where?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  limit?: number;
  offset?: number;
  include?: Record<string, boolean>;
}

// Default configuration
const DEFAULT_CONFIG: DatabaseConfig = {
  provider: 'auto',
  enableOfflineQueue: true,
  syncOnReconnect: true,
};

/**
 * Database Service Class
 * Main interface for database operations
 */
export class DatabaseService {
  private config: DatabaseConfig;
  private prisma: PrismaClient | null = null;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxConnectionAttempts: number = 3;

  constructor(config: Partial<DatabaseConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Setup localStorage adapter sync callback
    localStorageAdapter.onSync(this.handleSync.bind(this));
    
    // Auto-connect if configured
    if (this.config.provider !== 'localStorage') {
      this.connect();
    }
  }

  // ========================================
  // Connection Management
  // ========================================

  /**
   * Connect to the database
   */
  async connect(): Promise<boolean> {
    if (this.isConnected && this.prisma) {
      return true;
    }

    try {
      this.prisma = globalForPrisma.prisma ?? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

      // Test connection
      await this.prisma.$connect();
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      // Sync pending operations if enabled
      if (this.config.syncOnReconnect) {
        await this.syncPendingOperations();
      }

      // Store in global for development hot reload
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = this.prisma;
      }

      console.log('[Database] Connected successfully');
      return true;
    } catch (error) {
      console.error('[Database] Connection failed:', error);
      this.isConnected = false;
      this.connectionAttempts++;
      
      if (this.connectionAttempts >= this.maxConnectionAttempts) {
        console.warn('[Database] Max connection attempts reached, falling back to localStorage');
      }
      
      return false;
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
      this.isConnected = false;
      console.log('[Database] Disconnected');
    }
  }

  /**
   * Check if database is connected
   */
  async checkConnection(): Promise<boolean> {
    if (!this.prisma) return false;
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; provider: string; pendingOperations: number } {
    return {
      connected: this.isConnected,
      provider: this.isConnected ? 'prisma' : 'localStorage',
      pendingOperations: localStorageAdapter.getPendingCount(),
    };
  }

  // ========================================
  // Generic CRUD Operations
  // ========================================

  /**
   * Create a new record
   */
  async create<T>(model: ModelName, data: Record<string, unknown>): Promise<T> {
    const modelData = this.prepareData(data);
    
    if (this.isConnected && this.prisma) {
      try {
        const result = await this.prisma[model].create({
          data: modelData,
        });
        return result as T;
      } catch (error) {
        console.error(`[Database] Create failed for ${model}:`, error);
        // Fall back to localStorage
      }
    }
    
    // Use localStorage fallback
    return localStorageAdapter.create<T & { id: string }>(
      model,
      this.generateId(modelData)
    ) as T;
  }

  /**
   * Find a single record by ID
   */
  async findById<T>(model: ModelName, id: string): Promise<T | null> {
    if (this.isConnected && this.prisma) {
      try {
        const result = await this.prisma[model].findUnique({
          where: { id },
        });
        return result as T | null;
      } catch (error) {
        console.error(`[Database] FindById failed for ${model}:`, error);
      }
    }
    
    // Use localStorage fallback
    return localStorageAdapter.getById<T & { id: string }>(model, id);
  }

  /**
   * Find records with options
   */
  async findMany<T>(model: ModelName, options: QueryOptions = {}): Promise<T[]> {
    if (this.isConnected && this.prisma) {
      try {
        const result = await this.prisma[model].findMany({
          where: options.where,
          orderBy: options.orderBy,
          take: options.limit,
          skip: options.offset,
          include: options.include,
        });
        return result as T[];
      } catch (error) {
        console.error(`[Database] FindMany failed for ${model}:`, error);
      }
    }
    
    // Use localStorage fallback
    let items = localStorageAdapter.getAll<T>(model);
    
    // Apply filters
    if (options.where) {
      items = items.filter(item => {
        return Object.entries(options.where!).every(([key, value]) => {
          return (item as Record<string, unknown>)[key] === value;
        });
      });
    }
    
    // Apply sorting
    if (options.orderBy) {
      const [field, direction] = Object.entries(options.orderBy)[0];
      items.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[field];
        const bVal = (b as Record<string, unknown>)[field];
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    if (options.offset) {
      items = items.slice(options.offset);
    }
    if (options.limit) {
      items = items.slice(0, options.limit);
    }
    
    return items;
  }

  /**
   * Find first matching record
   */
  async findFirst<T>(model: ModelName, where: Record<string, unknown>): Promise<T | null> {
    if (this.isConnected && this.prisma) {
      try {
        const result = await this.prisma[model].findFirst({
          where,
        });
        return result as T | null;
      } catch (error) {
        console.error(`[Database] FindFirst failed for ${model}:`, error);
      }
    }
    
    // Use localStorage fallback
    const items = localStorageAdapter.getAll<T & { id: string }>(model);
    return items.find(item => {
      return Object.entries(where).every(([key, value]) => {
        return (item as Record<string, unknown>)[key] === value;
      });
    }) || null;
  }

  /**
   * Update a record
   */
  async update<T>(model: ModelName, id: string, data: Record<string, unknown>): Promise<T | null> {
    const modelData = this.prepareData(data);
    
    if (this.isConnected && this.prisma) {
      try {
        const result = await this.prisma[model].update({
          where: { id },
          data: modelData,
        });
        return result as T;
      } catch (error) {
        console.error(`[Database] Update failed for ${model}:`, error);
      }
    }
    
    // Use localStorage fallback
    return localStorageAdapter.update<T & { id: string }>(model, id, modelData as Partial<T & { id: string }>);
  }

  /**
   * Delete a record
   */
  async delete(model: ModelName, id: string): Promise<boolean> {
    if (this.isConnected && this.prisma) {
      try {
        await this.prisma[model].delete({
          where: { id },
        });
        return true;
      } catch (error) {
        console.error(`[Database] Delete failed for ${model}:`, error);
      }
    }
    
    // Use localStorage fallback
    return localStorageAdapter.delete(model, id);
  }

  /**
   * Count records
   */
  async count(model: ModelName, where?: Record<string, unknown>): Promise<number> {
    if (this.isConnected && this.prisma) {
      try {
        const result = await this.prisma[model].count({ where });
        return result;
      } catch (error) {
        console.error(`[Database] Count failed for ${model}:`, error);
      }
    }
    
    // Use localStorage fallback
    const items = localStorageAdapter.getAll(model);
    if (!where) return items.length;
    
    return items.filter(item => {
      return Object.entries(where).every(([key, value]) => {
        return (item as Record<string, unknown>)[key] === value;
      });
    }).length;
  }

  // ========================================
  // Synchronization
  // ========================================

  /**
   * Sync pending operations to the database
   */
  async syncPendingOperations(): Promise<{ synced: number; failed: number }> {
    if (!this.isConnected || !this.prisma) {
      return { synced: 0, failed: 0 };
    }

    const operations = localStorageAdapter.getPendingOperations();
    
    if (operations.length === 0) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
        localStorageAdapter.removePendingOperation(operation.id);
        synced++;
      } catch (error) {
        console.error(`[Database] Sync failed for operation ${operation.id}:`, error);
        localStorageAdapter.incrementRetry(operation.id);
        failed++;
      }
    }

    return { synced, failed };
  }

  /**
   * Execute a pending operation
   */
  private async executeOperation(operation: PendingOperation): Promise<void> {
    if (!this.prisma) throw new Error('Database not connected');

    const { type, model, data } = operation;

    switch (type) {
      case 'create':
        await this.prisma[model].create({ data });
        break;
      case 'update':
        await this.prisma[model].update({
          where: { id: data.id },
          data,
        });
        break;
      case 'delete':
        await this.prisma[model].delete({
          where: { id: data.id },
        });
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  /**
   * Handle sync callback from localStorage adapter
   */
  private async handleSync(operations: PendingOperation[]): Promise<void> {
    if (!this.isConnected || !this.prisma) {
      throw new Error('Database not connected');
    }

    for (const operation of operations) {
      await this.executeOperation(operation);
    }
  }

  // ========================================
  // Utility Methods
  // ========================================

  /**
   * Prepare data for storage
   */
  private prepareData(data: Record<string, unknown>): Record<string, unknown> {
    const prepared: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      
      // Convert objects to JSON strings for SQLite
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        prepared[key] = JSON.stringify(value);
      } else if (Array.isArray(value)) {
        prepared[key] = JSON.stringify(value);
      } else {
        prepared[key] = value;
      }
    }
    
    return prepared;
  }

  /**
   * Generate ID for new records
   */
  private generateId<T extends { id?: string }>(data: T): T {
    if (!data.id) {
      const id = `${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
      return { ...data, id };
    }
    return data;
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll(): Promise<void> {
    if (this.isConnected && this.prisma) {
      const models: ModelName[] = [
        'subscription',
        'reminder',
        'userProgress',
        'tarotReading',
        'meditationSession',
        'user',
      ];
      
      for (const model of models) {
        await this.prisma[model].deleteMany();
      }
    }
    
    localStorageAdapter.clearAll();
  }

  /**
   * Export all data
   */
  exportData(): Record<string, unknown> {
    return localStorageAdapter.exportData();
  }

  /**
   * Import data
   */
  importData(data: Record<string, unknown>): void {
    localStorageAdapter.importData(data);
  }
}

// Export singleton instance
export const db = new DatabaseService();

// Export types and adapter
export { localStorageAdapter };
export type { PendingOperation };
