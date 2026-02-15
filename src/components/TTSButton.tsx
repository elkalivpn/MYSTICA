'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Pause, Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useTTS, useTTSToggle } from '@/hooks/useTTS'
import { SPEED_PRESETS } from '@/lib/ttsService'

export interface TTSButtonProps {
  /** Text to speak */
  text: string
  /** Additional options for speech */
  options?: {
    rate?: number
    pitch?: number
    volume?: number
  }
  /** Speed preset to use */
  speedPreset?: 'normal' | 'reading' | 'relaxing' | 'slow'
  /** Custom class name */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show progress bar */
  showProgress?: boolean
  /** Label for accessibility */
  label?: string
  /** Called when speech starts */
  onSpeakStart?: () => void
  /** Called when speech ends */
  onSpeakEnd?: () => void
}

/**
 * TTS Button with wave animation when speaking
 */
export function TTSButton({
  text,
  options,
  speedPreset = 'reading',
  className,
  size = 'md',
  showProgress = false,
  label = 'Escuchar',
  onSpeakStart,
  onSpeakEnd
}: TTSButtonProps) {
  const { isSpeaking, isPaused, progress, speak, stop, togglePause, isSupported } = useTTS()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = useCallback(async () => {
    if (!isSupported) return
    
    if (isSpeaking) {
      stop()
      return
    }

    setIsLoading(true)
    try {
      await speak(text, {
        rate: options?.rate ?? SPEED_PRESETS[speedPreset],
        pitch: options?.pitch,
        volume: options?.volume,
        onStart: () => {
          setIsLoading(false)
          onSpeakStart?.()
        },
        onEnd: () => {
          onSpeakEnd?.()
        }
      })
    } catch (error) {
      console.error('TTS Error:', error)
      setIsLoading(false)
    }
  }, [isSupported, isSpeaking, speak, stop, text, options, speedPreset, onSpeakStart, onSpeakEnd])

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            "relative rounded-full transition-all duration-300",
            sizeClasses[size],
            isSpeaking 
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 text-purple-300 hover:text-white"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          )}
          aria-label={isSpeaking ? 'Detener lectura' : label}
        >
          {/* Wave animation when speaking */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-purple-400/50"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icon */}
          {isLoading ? (
            <Loader2 className={cn("animate-spin", iconSizes[size])} />
          ) : isSpeaking ? (
            isPaused ? (
              <Play className={iconSizes[size]} />
            ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <VolumeX className={iconSizes[size]} />
              </motion.div>
            )
          ) : (
            <Volume2 className={iconSizes[size]} />
          )}
        </Button>
      </motion.div>

      {/* Progress bar */}
      {showProgress && isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="w-20"
        >
          <Progress value={progress} className="h-1" />
        </motion.div>
      )}
    </div>
  )
}

/**
 * Floating TTS Button that appears in corner
 */
export interface FloatingTTSButtonProps extends TTSButtonProps {
  /** Position of the floating button */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Show controls panel */
  showControls?: boolean
}

export function FloatingTTSButton({
  text,
  position = 'bottom-right',
  showControls = true,
  ...props
}: FloatingTTSButtonProps) {
  const { isSpeaking, isPaused, progress, speak, stop, pause, resume, isSupported } = useTTS()
  const [isExpanded, setIsExpanded] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4'
  }

  if (!isSupported) {
    return null
  }

  return (
    <motion.div
      className={cn("fixed z-50", positionClasses[position])}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {/* Expanded controls panel */}
      <AnimatePresence>
        {isExpanded && showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-2 right-0 bg-mystica-dark-200/95 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4 min-w-[200px] shadow-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 text-gray-400 hover:text-white"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
              <span className="text-sm text-white font-medium">Lectura de voz</span>
            </div>

            {/* Progress */}
            {isSpeaking && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              {isSpeaking ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isPaused ? resume : pause}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Continuar
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pausar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stop}
                    className="border-red-500/50 text-red-300 hover:bg-red-900/30"
                  >
                    Detener
                  </Button>
                </>
              ) : (
                <Button
                  onClick={async () => {
                    await speak(text, props.options)
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {props.label || 'Escuchar'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={() => {
          if (isSpeaking && !isExpanded) {
            setIsExpanded(true)
          } else {
            setIsExpanded(!isExpanded)
          }
        }}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
          "shadow-lg shadow-purple-500/30",
          isSpeaking && "ring-2 ring-purple-400/50 ring-offset-2 ring-offset-mystica-dark-300"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Wave animation when speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio bars animation when speaking */}
        {isSpeaking ? (
          <div className="flex items-center gap-0.5 h-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white rounded-full"
                animate={{
                  height: [8, 20, 8]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </motion.div>
  )
}

/**
 * Compact TTS Button for inline use
 */
export function CompactTTSButton({
  text,
  options,
  speedPreset = 'reading',
  className,
  onSpeakStart,
  onSpeakEnd
}: Omit<TTSButtonProps, 'size' | 'showProgress' | 'label'>) {
  const { isSpeaking, speak, stop, isSupported } = useTTS()

  const handleToggle = useCallback(async () => {
    if (!isSupported) return
    
    if (isSpeaking) {
      stop()
      return
    }

    await speak(text, {
      rate: options?.rate ?? SPEED_PRESETS[speedPreset],
      pitch: options?.pitch,
      volume: options?.volume,
      onStart: onSpeakStart,
      onEnd: onSpeakEnd
    })
  }, [isSupported, isSpeaking, speak, stop, text, options, speedPreset, onSpeakStart, onSpeakEnd])

  if (!isSupported) return null

  return (
    <motion.button
      onClick={handleToggle}
      className={cn(
        "p-1.5 rounded-full transition-all duration-200",
        isSpeaking 
          ? "text-purple-400 bg-purple-500/20" 
          : "text-gray-400 hover:text-white hover:bg-white/10",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isSpeaking ? 'Detener' : 'Escuchar'}
    >
      {isSpeaking ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <VolumeX className="w-4 h-4" />
        </motion.div>
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </motion.button>
  )
}

/**
 * Simple toggle TTS button - just play/stop functionality
 */
export function TTSToggleButton({
  text,
  options,
  speedPreset = 'reading',
  className,
  children
}: TTSButtonProps & { children?: React.ReactNode }) {
  const { isSpeaking, toggle, isSupported } = useTTSToggle(text, {
    rate: options?.rate ?? SPEED_PRESETS[speedPreset],
    pitch: options?.pitch,
    volume: options?.volume
  })

  if (!isSupported) return null

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200",
        isSpeaking 
          ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" 
          : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isSpeaking ? (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <VolumeX className="w-4 h-4" />
          </motion.div>
          {children || 'Detener'}
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          {children || 'Escuchar'}
        </>
      )}
    </motion.button>
  )
}

export default TTSButton
