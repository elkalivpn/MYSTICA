// Mystica PWA Utilities - Service Worker Registration and Management

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  canInstall: boolean;
  hasUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export interface PWACapabilities {
  serviceWorker: boolean;
  pushManager: boolean;
  notifications: boolean;
  backgroundSync: boolean;
  periodicSync: boolean;
  storage: boolean;
}

type PWAEventType = 'update' | 'installed' | 'offline' | 'online' | 'install-prompt';

type PWACallback = (data: unknown) => void;

class PWAService {
  private registration: ServiceWorkerRegistration | null = null;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private listeners: Map<PWAEventType, Set<PWACallback>> = new Map();
  private isOnline: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.setupEventListeners();
    }
  }

  // Initialize PWA
  async init(): Promise<PWAStatus> {
    if (typeof window === 'undefined') {
      return this.getDefaultStatus();
    }

    // Register service worker
    await this.registerServiceWorker();

    // Check if already installed
    const isInstalled = this.checkIfInstalled();

    return {
      isInstalled,
      isOnline: this.isOnline,
      canInstall: !!this.deferredPrompt,
      hasUpdate: false,
      registration: this.registration
    };
  }

  // Register Service Worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      this.registration = registration;
      console.log('[PWA] Service Worker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available');
              this.emit('update', { registration });
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Controller changed');
        window.location.reload();
      });

      // Handle messages from SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[PWA] Message from SW:', event.data);
        
        if (event.data.type === 'SYNC_COMPLETE') {
          this.emit('update', { type: 'sync', timestamp: event.data.timestamp });
        }
      });

      return registration;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
      return null;
    }
  }

  // Check for updates
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('[PWA] Update check failed:', error);
      return false;
    }
  }

  // Apply update (activate waiting service worker)
  applyUpdate(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Check if app is installed
  private checkIfInstalled(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // Check for iOS standalone
    const isIOSStandalone = window.matchMedia('(display-mode: standalone)').matches;

    return isStandalone || isIOSStandalone;
  }

  // Prompt install
  async promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.deferredPrompt) {
      return 'unavailable';
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.emit('installed', { timestamp: Date.now() });
      }
      
      this.deferredPrompt = null;
      return outcome;
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return 'unavailable';
    }
  }

  // Get install prompt availability
  canInstall(): boolean {
    return !!this.deferredPrompt;
  }

  // Get online status
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Cache URLs
  async cacheUrls(urls: string[]): Promise<void> {
    if (!this.registration?.active) {
      throw new Error('Service Worker not active');
    }

    this.registration.active.postMessage({
      type: 'CACHE_URLS',
      urls
    });
  }

  // Clear cache
  async clearCache(): Promise<void> {
    if (!this.registration?.active) {
      throw new Error('Service Worker not active');
    }

    this.registration.active.postMessage({
      type: 'CLEAR_CACHE'
    });
  }

  // Subscribe to push notifications
  async subscribeToPush(vapidPublicKey?: string): Promise<PushSubscription | null> {
    if (!this.registration?.pushManager) {
      console.log('[PWA] Push Manager not available');
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey 
          ? this.urlBase64ToUint8Array(vapidPublicKey)
          : undefined
      });

      console.log('[PWA] Push subscription created:', subscription.endpoint);
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  }

  // Unsubscribe from push
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration?.pushManager) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('[PWA] Unsubscribed from push');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[PWA] Unsubscribe failed:', error);
      return false;
    }
  }

  // Get capabilities
  getCapabilities(): PWACapabilities {
    if (typeof window === 'undefined') {
      return this.getDefaultCapabilities();
    }

    return {
      serviceWorker: 'serviceWorker' in navigator,
      pushManager: 'PushManager' in window,
      notifications: 'Notification' in window,
      backgroundSync: 'serviceWorker' in navigator && 'SyncManager' in window,
      periodicSync: 'serviceWorker' in navigator && 'PeriodicSyncManager' in window,
      storage: 'storage' in navigator && 'estimate' in navigator.storage
    };
  }

  // Get storage estimate
  async getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
    if (!navigator.storage?.estimate) {
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    } catch {
      return null;
    }
  }

  // Request persistent storage
  async requestPersistentStorage(): Promise<boolean> {
    if (!navigator.storage?.persist) {
      return false;
    }

    try {
      return await navigator.storage.persist();
    } catch {
      return false;
    }
  }

  // Check if storage is persistent
  async isStoragePersistent(): Promise<boolean> {
    if (!navigator.storage?.persisted) {
      return false;
    }

    try {
      return await navigator.storage.persisted();
    } catch {
      return false;
    }
  }

  // Event handling
  on(event: PWAEventType, callback: PWACallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: PWAEventType, data: unknown): void {
    const callbacks = this.listeners.get(event);
    callbacks?.forEach(callback => callback(data));
  }

  private setupEventListeners(): void {
    // Online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online', { timestamp: Date.now() });
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline', { timestamp: Date.now() });
    });

    // Install prompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.emit('install-prompt', { available: true });
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.emit('installed', { timestamp: Date.now() });
    });
  }

  private getDefaultStatus(): PWAStatus {
    return {
      isInstalled: false,
      isOnline: true,
      canInstall: false,
      hasUpdate: false,
      registration: null
    };
  }

  private getDefaultCapabilities(): PWACapabilities {
    return {
      serviceWorker: false,
      pushManager: false,
      notifications: false,
      backgroundSync: false,
      periodicSync: false,
      storage: false
    };
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Export singleton instance
export const pwa = new PWAService();

// React hook for PWA
export function usePWA() {
  const [status, setStatus] = React.useState<PWAStatus>({
    isInstalled: false,
    isOnline: true,
    canInstall: false,
    hasUpdate: false,
    registration: null
  });

  React.useEffect(() => {
    let mounted = true;

    const initPWA = async () => {
      const initialStatus = await pwa.init();
      if (mounted) {
        setStatus(initialStatus);
      }
    };

    initPWA();

    // Subscribe to events
    const unsubUpdate = pwa.on('update', () => {
      if (mounted) setStatus(prev => ({ ...prev, hasUpdate: true }));
    });

    const unsubOnline = pwa.on('online', () => {
      if (mounted) setStatus(prev => ({ ...prev, isOnline: true }));
    });

    const unsubOffline = pwa.on('offline', () => {
      if (mounted) setStatus(prev => ({ ...prev, isOnline: false }));
    });

    const unsubInstallPrompt = pwa.on('install-prompt', () => {
      if (mounted) setStatus(prev => ({ ...prev, canInstall: true }));
    });

    const unsubInstalled = pwa.on('installed', () => {
      if (mounted) setStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
    });

    return () => {
      mounted = false;
      unsubUpdate();
      unsubOnline();
      unsubOffline();
      unsubInstallPrompt();
      unsubInstalled();
    };
  }, []);

  return {
    ...status,
    promptInstall: () => pwa.promptInstall(),
    applyUpdate: () => pwa.applyUpdate(),
    checkForUpdates: () => pwa.checkForUpdates(),
    getCapabilities: () => pwa.getCapabilities()
  };
}

import React from 'react';
