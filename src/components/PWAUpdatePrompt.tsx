'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePWA } from '@/lib/pwa';

interface PWAUpdatePromptProps {
  position?: 'top' | 'bottom';
  className?: string;
}

export function PWAUpdatePrompt({ 
  position = 'bottom',
  className = '' 
}: PWAUpdatePromptProps) {
  const { hasUpdate, applyUpdate } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (hasUpdate && !isDismissed) {
      // Small delay for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasUpdate, isDismissed]);

  const handleUpdate = () => {
    applyUpdate();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const positionClasses = position === 'top' 
    ? 'top-4 left-4 right-4' 
    : 'bottom-4 left-4 right-4 md:bottom-8';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed ${positionClasses} z-50 ${className}`}
        >
          <Card className="bg-gradient-to-r from-mystica-purple-900/95 to-mystica-dark-200/95 backdrop-blur-lg border-mystica-purple-500/30 shadow-2xl">
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Animated icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-mystica-gold-400 to-mystica-purple-500 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white font-cinzel">
                    Nueva Version Disponible
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Hemos mejorado Mystica con nuevas funciones y correcciones. 
                    Actualiza para disfrutar de la mejor experiencia.
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      onClick={handleUpdate}
                      className="bg-gradient-to-r from-mystica-gold-500 to-mystica-gold-600 hover:from-mystica-gold-400 hover:to-mystica-gold-500 text-black font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Actualizar Ahora
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleDismiss}
                      className="text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      Mas Tarde
                    </Button>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-mystica-purple-500/20 to-mystica-gold-500/20 blur-xl" />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact version for mobile
export function PWAUpdatePromptCompact() {
  const { hasUpdate, applyUpdate } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (hasUpdate && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasUpdate, isDismissed]);

  const handleUpdate = () => {
    applyUpdate();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:hidden"
        >
          <Card className="bg-mystica-dark-200/95 backdrop-blur-lg border-mystica-purple-500/30 p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mystica-gold-400 to-mystica-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Nueva Version</p>
                <p className="text-xs text-gray-400">Actualiza para mejorar tu experiencia</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDismissed(true)}
                  className="text-gray-400"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-mystica-gold-500 hover:bg-mystica-gold-400 text-black"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PWAUpdatePrompt;
