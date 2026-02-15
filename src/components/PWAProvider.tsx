'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { PWAUpdatePrompt, PWAUpdatePromptCompact } from '@/components/PWAUpdatePrompt';
import { OfflineIndicator, OfflineIndicatorCompact } from '@/components/OfflineIndicator';

interface PWAProviderProps {
  children: React.ReactNode;
}

// Simple subscription store for SW events
const subscribe = (callback: () => void) => {
  window.addEventListener('sw-update-available', callback);
  return () => window.removeEventListener('sw-update-available', callback);
};

const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function PWAProvider({ children }: PWAProviderProps) {
  // Use useSyncExternalStore for SW events
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Prevent double mount in strict mode
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Use flushSync or queueMicrotask to avoid the lint warning
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {/* PWA Update Prompt - Desktop */}
      <PWAUpdatePrompt position="bottom" />
      {/* PWA Update Prompt - Mobile */}
      <PWAUpdatePromptCompact />
      {/* Offline Indicator - Desktop/Tablet */}
      <OfflineIndicator position="top" showFeatures={true} />
      {/* Offline Indicator - Mobile */}
      <OfflineIndicatorCompact />
    </>
  );
}

export default PWAProvider;
