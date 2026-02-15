'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Moon, Star, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePWA } from '@/lib/pwa';

interface OfflineFeature {
  name: string;
  available: boolean;
  description: string;
}

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  showFeatures?: boolean;
  className?: string;
}

export function OfflineIndicator({ 
  position = 'top',
  showFeatures = true,
  className = ''
}: OfflineIndicatorProps) {
  const { isOnline } = usePWA();
  const prevOnlineRef = useRef(isOnline);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    // Coming back online after being offline
    if (prevOnlineRef.current === false && isOnline === true) {
      // Use queueMicrotask to avoid cascading render warning
      queueMicrotask(() => {
        setShowBackOnline(true);
        timerRef.current = setTimeout(() => {
          setShowBackOnline(false);
        }, 3000);
      });
    }
    prevOnlineRef.current = isOnline;
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOnline]);

  // Features available offline
  const offlineFeatures: OfflineFeature[] = [
    { name: 'Tarot', available: true, description: 'Lecturas de cartas guardadas' },
    { name: 'Runas', available: true, description: 'Tiradas de runas' },
    { name: 'Meditaciones', available: true, description: 'Meditaciones descargadas' },
    { name: 'Calendario Lunar', available: true, description: 'Fases lunares' },
    { name: 'Horoscopo', available: false, description: 'Requiere conexion' },
    { name: 'Sincronizacion', available: false, description: 'Requiere conexion' }
  ];

  const availableCount = offlineFeatures.filter(f => f.available).length;

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 ${className}`}
          >
            <div className="bg-gradient-to-r from-amber-900/95 via-amber-800/95 to-amber-900/95 backdrop-blur-lg border-b border-amber-600/30">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  {/* Status indicator */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center"
                    >
                      <WifiOff className="w-4 h-4 text-amber-400" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Sin Conexion a Internet
                      </p>
                      <p className="text-xs text-amber-200/80">
                        {availableCount} funciones disponibles offline
                      </p>
                    </div>
                  </div>

                  {/* Available features (desktop) */}
                  {showFeatures && (
                    <div className="hidden md:flex items-center gap-2">
                      {offlineFeatures.slice(0, 4).map((feature) => (
                        <span
                          key={feature.name}
                          className={`px-2 py-1 text-xs rounded-full ${
                            feature.available 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {feature.available ? (
                            <Star className="w-3 h-3 inline mr-1" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                          )}
                          {feature.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Retry button */}
                  <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Reintentar conexion"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Toast */}
      <AnimatePresence>
        {showBackOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-900/95 to-emerald-800/95 backdrop-blur-lg rounded-full px-4 py-2 border border-green-500/30 shadow-lg">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <Wifi className="w-3 h-3 text-white" />
                </motion.div>
                <span className="text-sm font-medium text-white">
                  Conexion Restablecida
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Compact offline indicator for mobile bottom nav
export function OfflineIndicatorCompact() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-24 right-4 z-40 md:hidden"
    >
      <div className="w-10 h-10 rounded-full bg-amber-500/90 backdrop-blur-lg flex items-center justify-center shadow-lg border border-amber-400/30">
        <WifiOff className="w-5 h-5 text-white" />
      </div>
    </motion.div>
  );
}

// Detailed offline status panel
export function OfflineStatusPanel() {
  const { isOnline } = usePWA();
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    { 
      icon: Moon,
      name: 'Meditaciones Offline', 
      available: true, 
      description: 'Tus meditaciones guiadas descargadas estan disponibles' 
    },
    { 
      icon: Star,
      name: 'Tarot y Runas', 
      available: true, 
      description: 'Lecturas misticas sin conexion' 
    },
    { 
      icon: WifiOff,
      name: 'Sincronizacion', 
      available: false, 
      description: 'Los cambios se guardaran cuando vuelvas a estar online' 
    },
    { 
      icon: AlertTriangle,
      name: 'Contenido Nuevo', 
      available: false, 
      description: 'Requiere conexion para actualizar' 
    }
  ];

  if (isOnline) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-amber-500/90 backdrop-blur-lg flex items-center justify-center shadow-lg border border-amber-400/30 md:hidden"
      >
        <WifiOff className="w-5 h-5 text-white" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel content */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-mystica-dark-200 to-mystica-dark-300 rounded-t-3xl p-6 max-h-[70vh] overflow-auto"
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white font-cinzel">
                    Modo Offline
                  </h3>
                  <p className="text-sm text-gray-400">
                    Funciones disponibles sin conexion
                  </p>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl ${
                        feature.available 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${
                          feature.available ? 'text-green-400' : 'text-red-400'
                        }`} />
                        <div>
                          <p className="font-medium text-white">{feature.name}</p>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Retry button */}
              <button
                onClick={() => window.location.reload()}
                className="w-full mt-6 py-3 bg-mystica-purple-600 hover:bg-mystica-purple-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar Conexion
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default OfflineIndicator;
