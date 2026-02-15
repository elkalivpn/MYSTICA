'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AudioSystem,
  getAudioSystem,
  BINAURAL_CONFIGS,
  SOLFEGGIO_FREQUENCIES,
  TIBETAN_BOWL_FREQUENCIES,
} from '@/lib/audioSystem'

export type BinauralType = keyof typeof BINAURAL_CONFIGS
export type SolfeggioNote = keyof typeof SOLFEGGIO_FREQUENCIES
export type ChakraType = keyof typeof TIBETAN_BOWL_FREQUENCIES
export type NaturalSoundType = 'rain' | 'wind' | 'ocean'

export interface AudioPlayerState {
  isPlaying: boolean
  currentSound: string | null
  duration: number
  currentTime: number
  volume: number
}

export interface UseAudioPlayerOptions {
  initialVolume?: number
  autoResume?: boolean
}

/**
 * Hook for playing meditation audio
 */
export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
  const { initialVolume = 0.7, autoResume = true } = options

  const audioSystemRef = useRef<AudioSystem | null>(null)
  const activeSoundIdRef = useRef<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSound, setCurrentSound] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(initialVolume)
  const [isReady, setIsReady] = useState(false)

  // Stop tracking helper
  const stopTrackingRef = useRef<() => void>(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  })

  // Stop function ref for use in effects
  const stopRef = useRef<() => void>(() => {
    if (audioSystemRef.current && activeSoundIdRef.current) {
      audioSystemRef.current.stop(activeSoundIdRef.current)
      activeSoundIdRef.current = null
    }
    setIsPlaying(false)
    setCurrentSound(null)
    setCurrentTime(0)
    stopTrackingRef.current()
  })

  // Initialize audio system
  useEffect(() => {
    if (typeof window === 'undefined') return

    audioSystemRef.current = getAudioSystem()
    setIsReady(audioSystemRef.current.isAvailable())

    return () => {
      stopRef.current()
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioSystemRef.current) {
      audioSystemRef.current.setVolume(volume)
    }
  }, [volume])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Start tracking time
  const startTracking = useCallback((totalDuration: number) => {
    setDuration(totalDuration)
    setCurrentTime(0)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const startTime = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      setCurrentTime(elapsed)

      if (elapsed >= totalDuration) {
        setIsPlaying(false)
        setCurrentSound(null)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, 100)
  }, [])

  // Stop tracking
  const stopTracking = useCallback(() => {
    stopTrackingRef.current()
  }, [])

  // Resume audio context
  const resume = useCallback(async () => {
    if (audioSystemRef.current) {
      await audioSystemRef.current.resume()
    }
  }, [])

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  // Stop current sound
  const stop = useCallback(() => {
    stopRef.current()
  }, [])

  /**
   * Play a simple tone
   */
  const playTone = useCallback(async (
    frequency: number,
    duration: number = 2,
    type: OscillatorType = 'sine'
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    await audioSystemRef.current.playFrequency(frequency, duration, type, {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.3,
    })
  }, [autoResume, resume])

  /**
   * Play binaural beats
   */
  const playBinaural = useCallback(async (
    type: BinauralType,
    playDuration: number = 300, // 5 minutes default
    customVolume?: number
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    stop()

    const config = BINAURAL_CONFIGS[type]
    const soundId = await audioSystemRef.current.playBinauralBeats(
      config.baseFreq,
      config.beatFreq,
      playDuration,
      customVolume ?? volume
    )

    if (soundId) {
      activeSoundIdRef.current = soundId
      setCurrentSound(`binaural-${type}`)
      setIsPlaying(true)
      startTracking(playDuration)
    }
  }, [autoResume, resume, stop, volume, startTracking])

  /**
   * Play pink noise
   */
  const playPinkNoise = useCallback(async (
    playDuration: number = 300,
    customVolume?: number
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    stop()

    const soundId = await audioSystemRef.current.playPinkNoise(
      playDuration,
      customVolume ?? volume
    )

    if (soundId) {
      activeSoundIdRef.current = soundId
      setCurrentSound('pink-noise')
      setIsPlaying(true)
      startTracking(playDuration)
    }
  }, [autoResume, resume, stop, volume, startTracking])

  /**
   * Play natural sound (rain, wind, ocean)
   */
  const playNaturalSound = useCallback(async (
    type: NaturalSoundType,
    playDuration: number = 300,
    customVolume?: number
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    stop()

    const soundId = await audioSystemRef.current.playNaturalSound(
      type,
      playDuration,
      customVolume ?? volume
    )

    if (soundId) {
      activeSoundIdRef.current = soundId
      setCurrentSound(`natural-${type}`)
      setIsPlaying(true)
      startTracking(playDuration)
    }
  }, [autoResume, resume, stop, volume, startTracking])

  /**
   * Play Tibetan bowl
   */
  const playTibetanBowl = useCallback(async (
    chakra?: ChakraType,
    frequency?: number,
    playDuration: number = 8
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    const freq = frequency ?? (chakra ? TIBETAN_BOWL_FREQUENCIES[chakra] : 432)

    await audioSystemRef.current.playTibetanBowl(freq, playDuration)
    setCurrentSound(`tibetan-bowl-${freq}hz`)
    setIsPlaying(true)
    startTracking(playDuration)
  }, [autoResume, resume, startTracking])

  /**
   * Play Solfeggio frequency
   */
  const playSolfeggio = useCallback(async (
    note: SolfeggioNote,
    playDuration: number = 10
  ): Promise<void> => {
    const frequency = SOLFEGGIO_FREQUENCIES[note]
    await playTone(frequency, playDuration, 'sine')
    setCurrentSound(`solfeggio-${note}`)
    setIsPlaying(true)
    startTracking(playDuration)
  }, [playTone, startTracking])

  /**
   * Play mantra tone with vibrato
   */
  const playMantra = useCallback(async (
    frequency: number = 432,
    playDuration: number = 60,
    vibratoRate: number = 5,
    vibratoDepth: number = 10
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    stop()

    const soundId = await audioSystemRef.current.playMantraTone(
      frequency,
      playDuration,
      vibratoRate,
      vibratoDepth,
      volume
    )

    if (soundId) {
      activeSoundIdRef.current = soundId
      setCurrentSound('mantra')
      setIsPlaying(true)
      startTracking(playDuration)
    }
  }, [autoResume, resume, stop, volume, startTracking])

  /**
   * Play a predefined sound effect
   */
  const playSound = useCallback(async (
    soundName: 'meditation-bell' | 'chime' | 'success' | 'click' | 'mystical' | 'bowl'
  ): Promise<void> => {
    if (!audioSystemRef.current) return

    if (autoResume) await resume()

    await audioSystemRef.current.play(soundName)
  }, [autoResume, resume])

  /**
   * Stop all sounds
   */
  const stopAll = useCallback(() => {
    if (audioSystemRef.current) {
      audioSystemRef.current.stopAll()
    }
    setIsPlaying(false)
    setCurrentSound(null)
    setCurrentTime(0)
    stopTracking()
  }, [stopTracking])

  return {
    // State
    isPlaying,
    currentSound,
    duration,
    currentTime,
    volume,
    isReady,

    // Actions
    playTone,
    playBinaural,
    playPinkNoise,
    playNaturalSound,
    playTibetanBowl,
    playSolfeggio,
    playMantra,
    playSound,
    stop,
    stopAll,
    setVolume,
    resume,

    // Progress
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,

    // Configuration
    binauralTypes: Object.keys(BINAURAL_CONFIGS) as BinauralType[],
    solfeggioNotes: Object.keys(SOLFEGGIO_FREQUENCIES) as SolfeggioNote[],
    chakras: Object.keys(TIBETAN_BOWL_FREQUENCIES) as ChakraType[],
    naturalSounds: ['rain', 'wind', 'ocean'] as NaturalSoundType[],
  }
}

/**
 * Hook for simple sound effects
 */
export function useSoundEffects() {
  const audioSystemRef = useRef<AudioSystem | null>(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    audioSystemRef.current = getAudioSystem()
  }, [])

  const play = useCallback(async (soundName: 'click' | 'success' | 'chime' | 'meditation-bell' | 'mystical' | 'bowl') => {
    if (!enabled || !audioSystemRef.current) return

    try {
      await audioSystemRef.current.play(soundName)
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }, [enabled])

  const toggle = useCallback(() => {
    setEnabled(prev => !prev)
  }, [])

  return {
    enabled,
    play,
    toggle,
    setEnabled,
  }
}

/**
 * Hook for meditation session audio
 */
export function useMeditationAudio() {
  const player = useAudioPlayer({ initialVolume: 0.5 })
  const [sessionType, setSessionType] = useState<string | null>(null)

  // Preset meditation configurations
  const startMeditation = useCallback(async (
    type: 'relaxation' | 'focus' | 'sleep' | 'chakra' | 'mindfulness',
    playDuration: number = 600 // 10 minutes default
  ) => {
    setSessionType(type)

    switch (type) {
      case 'relaxation':
        // Alpha waves for relaxation
        await player.playBinaural('alpha', playDuration, 0.3)
        break
      case 'focus':
        // Beta waves for concentration
        await player.playBinaural('beta', playDuration, 0.25)
        break
      case 'sleep':
        // Delta waves for deep sleep
        await player.playBinaural('delta', playDuration, 0.2)
        break
      case 'chakra':
        // Tibetan bowl meditation
        await player.playTibetanBowl('heart', 432, 10)
        break
      case 'mindfulness':
        // Theta waves for meditation
        await player.playBinaural('theta', playDuration, 0.3)
        break
    }
  }, [player])

  const endMeditation = useCallback(async () => {
    // Play meditation bell to end
    await player.playSound('meditation-bell')
    player.stopAll()
    setSessionType(null)
  }, [player])

  return {
    ...player,
    sessionType,
    startMeditation,
    endMeditation,
  }
}

export default useAudioPlayer
