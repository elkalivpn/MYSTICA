'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  ttsService, 
  TTSServiceState, 
  SpeakOptions, 
  VoiceConfig, 
  SPEED_PRESETS 
} from '@/lib/ttsService'

export interface UseTTSReturn {
  // State
  isSpeaking: boolean
  isPaused: boolean
  currentText: string
  progress: number
  isSupported: boolean
  
  // Actions
  speak: (text: string, options?: SpeakOptions) => Promise<void>
  stop: () => void
  pause: () => void
  resume: () => void
  togglePause: () => void
  
  // Configuration
  setConfig: (config: Partial<VoiceConfig>) => void
  getConfig: () => VoiceConfig
  setSpeed: (speed: keyof typeof SPEED_PRESETS) => void
  setLanguage: (lang: VoiceConfig['lang']) => void
  
  // Utilities
  formatTarotReading: (cards: Array<{
    name: string
    numeral: string
    upright: string
    keywords: string[]
    isReversed?: boolean
  }>) => string
  formatRuneReading: (runes: Array<{
    name: string
    symbol: string
    meaning: string
    upright: string
    keywords: string[]
  }>) => string
  formatOracleReading: (card: {
    name: string
    element: string
    message: string
    guidance: string
    affirmation: string
  }) => string
  formatMeditationGuide: (
    name: string,
    steps: string[],
    affirmations: string[]
  ) => string
}

export function useTTS(): UseTTSReturn {
  const [state, setState] = useState<TTSServiceState>({
    isSpeaking: false,
    isPaused: false,
    currentText: '',
    progress: 0
  })
  const [isSupported, setIsSupported] = useState(() => {
    // Check support on initial render (client-side only)
    if (typeof window === 'undefined') return false
    return ttsService.isSupported()
  })
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Initialize and subscribe to TTS service
  useEffect(() => {
    // Subscribe to state changes
    unsubscribeRef.current = ttsService.subscribe((newState) => {
      setState(newState)
    })
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  // Actions
  const speak = useCallback(async (text: string, options?: SpeakOptions) => {
    return ttsService.speak(text, options)
  }, [])

  const stop = useCallback(() => {
    ttsService.stop()
  }, [])

  const pause = useCallback(() => {
    ttsService.pause()
  }, [])

  const resume = useCallback(() => {
    ttsService.resume()
  }, [])

  const togglePause = useCallback(() => {
    ttsService.togglePause()
  }, [])

  // Configuration
  const setConfig = useCallback((config: Partial<VoiceConfig>) => {
    ttsService.setConfig(config)
  }, [])

  const getConfig = useCallback(() => {
    return ttsService.getConfig()
  }, [])

  const setSpeed = useCallback((speed: keyof typeof SPEED_PRESETS) => {
    ttsService.setConfig({ rate: SPEED_PRESETS[speed] })
  }, [])

  const setLanguage = useCallback((lang: VoiceConfig['lang']) => {
    ttsService.setLanguage(lang)
  }, [])

  // Formatting utilities
  const formatTarotReading = useCallback((cards: Array<{
    name: string
    numeral: string
    upright: string
    keywords: string[]
    isReversed?: boolean
  }>) => {
    return ttsService.formatTarotReading(cards)
  }, [])

  const formatRuneReading = useCallback((runes: Array<{
    name: string
    symbol: string
    meaning: string
    upright: string
    keywords: string[]
  }>) => {
    return ttsService.formatRuneReading(runes)
  }, [])

  const formatOracleReading = useCallback((card: {
    name: string
    element: string
    message: string
    guidance: string
    affirmation: string
  }) => {
    return ttsService.formatOracleReading(card)
  }, [])

  const formatMeditationGuide = useCallback((
    name: string,
    steps: string[],
    affirmations: string[]
  ) => {
    return ttsService.formatMeditationGuide(name, steps, affirmations)
  }, [])

  return {
    // State
    isSpeaking: state.isSpeaking,
    isPaused: state.isPaused,
    currentText: state.currentText,
    progress: state.progress,
    isSupported,
    
    // Actions
    speak,
    stop,
    pause,
    resume,
    togglePause,
    
    // Configuration
    setConfig,
    getConfig,
    setSpeed,
    setLanguage,
    
    // Utilities
    formatTarotReading,
    formatRuneReading,
    formatOracleReading,
    formatMeditationGuide
  }
}

/**
 * Hook for simple TTS toggle functionality
 * Useful for simple play/stop scenarios
 */
export function useTTSToggle(text: string, options?: SpeakOptions) {
  const { isSpeaking, speak, stop, ...rest } = useTTS()
  
  const toggle = useCallback(async () => {
    if (isSpeaking) {
      stop()
    } else {
      await speak(text, options)
    }
  }, [isSpeaking, speak, stop, text, options])
  
  return {
    isSpeaking,
    toggle,
    speak: () => speak(text, options),
    stop,
    ...rest
  }
}

/**
 * Hook for reading content with progress tracking
 * Useful for long readings like tarot or meditation guides
 */
export function useTTSReading() {
  const tts = useTTS()
  const [hasStarted, setHasStarted] = useState(false)

  const startReading = useCallback(async (text: string, options?: SpeakOptions) => {
    setHasStarted(true)
    await tts.speak(text, {
      ...options,
      onEnd: () => {
        setHasStarted(false)
        options?.onEnd?.()
      }
    })
  }, [tts])

  const stopReading = useCallback(() => {
    tts.stop()
    setHasStarted(false)
  }, [tts])

  return {
    ...tts,
    hasStarted,
    startReading,
    stopReading
  }
}
