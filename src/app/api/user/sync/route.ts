/**
 * User Sync API Endpoint
 * Handles synchronization of offline data to the server
 * Prepared for Supabase/Firebase integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { localStorageAdapter, PendingOperation } from '@/lib/db/adapters/localStorage';

// Types for API responses
interface SyncResponse {
  success: boolean;
  synced: number;
  failed: number;
  errors?: string[];
  timestamp: string;
}

interface SyncRequest {
  operations: PendingOperation[];
  deviceId?: string;
  lastSyncTime?: string;
}

/**
 * POST /api/user/sync
 * Synchronize offline operations to the database
 */
export async function POST(request: NextRequest): Promise<NextResponse<SyncResponse>> {
  try {
    const body: SyncRequest = await request.json();
    const { operations, deviceId, lastSyncTime } = body;

    // Validate request
    if (!operations || !Array.isArray(operations)) {
      return NextResponse.json(
        {
          success: false,
          synced: 0,
          failed: 0,
          errors: ['Invalid operations array'],
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Log sync request for debugging
    console.log(`[Sync] Received ${operations.length} operations from device: ${deviceId || 'unknown'}`);
    if (lastSyncTime) {
      console.log(`[Sync] Last sync time: ${lastSyncTime}`);
    }

    // Check database connection
    const status = db.getConnectionStatus();
    if (!status.connected) {
      // Attempt to connect
      const connected = await db.connect();
      if (!connected) {
        return NextResponse.json(
          {
            success: false,
            synced: 0,
            failed: operations.length,
            errors: ['Database connection unavailable'],
            timestamp: new Date().toISOString(),
          },
          { status: 503 }
        );
      }
    }

    // Process operations
    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const operation of operations) {
      try {
        await processOperation(operation);
        synced++;
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Operation ${operation.id}: ${errorMessage}`);
        console.error(`[Sync] Failed operation ${operation.id}:`, error);
      }
    }

    // Return result
    return NextResponse.json({
      success: failed === 0,
      synced,
      failed,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Sync] Error processing sync request:', error);
    
    return NextResponse.json(
      {
        success: false,
        synced: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Internal server error'],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/sync
 * Get sync status and pending operations count
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const status = db.getConnectionStatus();
    
    // Get pending operations from localStorage adapter
    const pendingOperations = localStorageAdapter.getPendingOperations();
    
    // Calculate storage usage
    const storageUsage = localStorageAdapter.getStorageUsage();

    return NextResponse.json({
      connected: status.connected,
      provider: status.provider,
      pendingOperations: pendingOperations.length,
      storage: storageUsage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Sync] Error getting sync status:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to get sync status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/sync
 * Clear all pending operations
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const pendingCount = localStorageAdapter.getPendingCount();
    localStorageAdapter.clearPendingOperations();

    return NextResponse.json({
      success: true,
      cleared: pendingCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Sync] Error clearing pending operations:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear pending operations',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Process a single operation
 */
async function processOperation(operation: PendingOperation): Promise<void> {
  const { type, model, data } = operation;

  // Validate operation data
  if (!type || !model || !data) {
    throw new Error('Invalid operation: missing required fields');
  }

  // Validate model name
  const validModels = ['user', 'meditationSession', 'tarotReading', 'userProgress', 'reminder', 'subscription'];
  if (!validModels.includes(model)) {
    throw new Error(`Invalid model: ${model}`);
  }

  // Process based on operation type
  switch (type) {
    case 'create':
      await db.create(model, data);
      break;
    case 'update':
      if (!data.id) {
        throw new Error('Update operation requires an id');
      }
      await db.update(model, data.id as string, data);
      break;
    case 'delete':
      if (!data.id) {
        throw new Error('Delete operation requires an id');
      }
      await db.delete(model, data.id as string);
      break;
    default:
      throw new Error(`Unknown operation type: ${type}`);
  }
}

// ========================================
// Future: Supabase/Firebase Integration
// ========================================

/**
 * Supabase Integration (prepared for future use)
 * 
 * To enable Supabase:
 * 1. Install @supabase/supabase-js
 * 2. Set environment variables:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *    - SUPABASE_SERVICE_ROLE_KEY
 * 
 * Example implementation:
 * 
 * import { createClient } from '@supabase/supabase-js';
 * 
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY!
 * );
 * 
 * async function syncToSupabase(operation: PendingOperation) {
 *   const { type, model, data } = operation;
 *   
 *   switch (type) {
 *     case 'create':
 *       const { error: createError } = await supabase
 *         .from(model)
 *         .insert(data);
 *       if (createError) throw createError;
 *       break;
 *     case 'update':
 *       const { error: updateError } = await supabase
 *         .from(model)
 *         .update(data)
 *         .eq('id', data.id);
 *       if (updateError) throw updateError;
 *       break;
 *     case 'delete':
 *       const { error: deleteError } = await supabase
 *         .from(model)
 *         .delete()
 *         .eq('id', data.id);
 *       if (deleteError) throw deleteError;
 *       break;
 *   }
 * }
 */

/**
 * Firebase Integration (prepared for future use)
 * 
 * To enable Firebase:
 * 1. Install firebase
 * 2. Set environment variables:
 *    - NEXT_PUBLIC_FIREBASE_API_KEY
 *    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *    - NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *    - NEXT_PUBLIC_FIREBASE_APP_ID
 * 
 * Example implementation:
 * 
 * import { initializeApp } from 'firebase/app';
 * import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
 * 
 * const firebaseApp = initializeApp({
 *   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 *   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
 *   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
 *   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
 *   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
 *   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
 * });
 * 
 * const firestore = getFirestore(firebaseApp);
 * 
 * async function syncToFirebase(operation: PendingOperation) {
 *   const { type, model, data } = operation;
 *   const docRef = doc(firestore, model, data.id as string);
 *   
 *   switch (type) {
 *     case 'create':
 *     case 'update':
 *       await setDoc(docRef, data, { merge: type === 'update' });
 *       break;
 *     case 'delete':
 *       await deleteDoc(docRef);
 *       break;
 *   }
 * }
 */
