'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Language type for i18n support
export type Language = 'es' | 'en'

// Audio settings types
export interface AudioSettings {
  masterVolume: number      // 0-100
  meditationVolume: number  // 0-100
  effectsVolume: number     // 0-100
  binauralEnabled: boolean
  naturalSoundsEnabled: boolean
  tibetanBowlsEnabled: boolean
}

// Predefined audio type configurations
export interface AudioTypeConfig {
  id: string
  name: string
  nameEs: string
  description: string
  descriptionEs: string
  category: 'binaural' | 'natural' | 'tibetan' | 'solfeggio' | 'mantra'
  defaultDuration: number
  settings: {
    frequency?: number
    beatFrequency?: number
    vibratoRate?: number
    vibratoDepth?: number
  }
}

// Available audio types with predefined configurations
export const availableAudioTypes: AudioTypeConfig[] = [
  // Binaural beats
  {
    id: 'binaural-delta',
    name: 'Delta Waves',
    nameEs: 'Ondas Delta',
    description: 'Deep sleep and healing',
    descriptionEs: 'Sueno profundo y sanacion',
    category: 'binaural',
    defaultDuration: 1800,
    settings: { frequency: 100, beatFrequency: 2 }
  },
  {
    id: 'binaural-theta',
    name: 'Theta Waves',
    nameEs: 'Ondas Theta',
    description: 'Meditation and creativity',
    descriptionEs: 'Meditacion y creatividad',
    category: 'binaural',
    defaultDuration: 1200,
    settings: { frequency: 150, beatFrequency: 4 }
  },
  {
    id: 'binaural-alpha',
    name: 'Alpha Waves',
    nameEs: 'Ondas Alpha',
    description: 'Relaxation and focus',
    descriptionEs: 'Relajacion y enfoque',
    category: 'binaural',
    defaultDuration: 900,
    settings: { frequency: 200, beatFrequency: 10 }
  },
  {
    id: 'binaural-beta',
    name: 'Beta Waves',
    nameEs: 'Ondas Beta',
    description: 'Alertness and concentration',
    descriptionEs: 'Alerta y concentracion',
    category: 'binaural',
    defaultDuration: 600,
    settings: { frequency: 250, beatFrequency: 20 }
  },
  {
    id: 'binaural-gamma',
    name: 'Gamma Waves',
    nameEs: 'Ondas Gamma',
    description: 'Higher cognition and insight',
    descriptionEs: 'Cognicion superior y percepcion',
    category: 'binaural',
    defaultDuration: 600,
    settings: { frequency: 300, beatFrequency: 40 }
  },

  // Natural sounds
  {
    id: 'natural-rain',
    name: 'Rain',
    nameEs: 'Lluvia',
    description: 'Gentle rain sounds',
    descriptionEs: 'Sonidos de lluvia suave',
    category: 'natural',
    defaultDuration: 1800,
    settings: {}
  },
  {
    id: 'natural-wind',
    name: 'Wind',
    nameEs: 'Viento',
    description: 'Soft wind blowing',
    descriptionEs: 'Viento suave soplando',
    category: 'natural',
    defaultDuration: 1800,
    settings: {}
  },
  {
    id: 'natural-ocean',
    name: 'Ocean Waves',
    nameEs: 'Olas del Mar',
    description: 'Calming ocean waves',
    descriptionEs: 'Olas del oceano relajantes',
    category: 'natural',
    defaultDuration: 1800,
    settings: {}
  },

  // Tibetan bowls
  {
    id: 'tibetan-root',
    name: 'Root Chakra Bowl',
    nameEs: 'Cuenco Chakra Raiz',
    description: 'Grounding at 432Hz',
    descriptionEs: 'Anclaje a 432Hz',
    category: 'tibetan',
    defaultDuration: 300,
    settings: { frequency: 432 }
  },
  {
    id: 'tibetan-heart',
    name: 'Heart Chakra Bowl',
    nameEs: 'Cuenco Chakra Corazon',
    description: 'Love and healing at 432Hz',
    descriptionEs: 'Amor y sanacion a 432Hz',
    category: 'tibetan',
    defaultDuration: 300,
    settings: { frequency: 432 }
  },
  {
    id: 'tibetan-thirdeye',
    name: 'Third Eye Bowl',
    nameEs: 'Cuenco Tercer Ojo',
    description: 'Intuition at 528Hz',
    descriptionEs: 'Intuicion a 528Hz',
    category: 'tibetan',
    defaultDuration: 300,
    settings: { frequency: 528 }
  },
  {
    id: 'tibetan-crown',
    name: 'Crown Chakra Bowl',
    nameEs: 'Cuenco Chakra Corona',
    description: 'Spiritual connection at 768Hz',
    descriptionEs: 'Conexion espiritual a 768Hz',
    category: 'tibetan',
    defaultDuration: 300,
    settings: { frequency: 768 }
  },

  // Solfeggio frequencies
  {
    id: 'solfeggio-528',
    name: '528Hz Miracle',
    nameEs: '528Hz Milagro',
    description: 'DNA repair and transformation',
    descriptionEs: 'Reparacion del ADN y transformacion',
    category: 'solfeggio',
    defaultDuration: 600,
    settings: { frequency: 528 }
  },
  {
    id: 'solfeggio-432',
    name: '432Hz Universal',
    nameEs: '432Hz Universal',
    description: 'Cosmic harmony frequency',
    descriptionEs: 'Frecuencia de armonia cosmica',
    category: 'solfeggio',
    defaultDuration: 600,
    settings: { frequency: 432 }
  },
  {
    id: 'solfeggio-963',
    name: '963Hz Divine',
    nameEs: '963Hz Divino',
    description: 'Divine connection',
    descriptionEs: 'Conexion divina',
    category: 'solfeggio',
    defaultDuration: 600,
    settings: { frequency: 963 }
  },

  // Mantra tones
  {
    id: 'mantra-om',
    name: 'OM Mantra',
    nameEs: 'Mantra OM',
    description: 'Sacred OM vibration at 136.1Hz',
    descriptionEs: 'Vibracion sagrada OM a 136.1Hz',
    category: 'mantra',
    defaultDuration: 600,
    settings: { frequency: 136.1, vibratoRate: 4, vibratoDepth: 5 }
  },
  {
    id: 'mantra-so-ham',
    name: 'So Ham Mantra',
    nameEs: 'Mantra So Ham',
    description: 'I am that - meditation frequency',
    descriptionEs: 'Yo soy eso - frecuencia de meditacion',
    category: 'mantra',
    defaultDuration: 600,
    settings: { frequency: 432, vibratoRate: 6, vibratoDepth: 8 }
  },
]

// Chakra audio configurations
export const chakraAudioConfigs = [
  { chakra: 'root', frequency: 396, color: '#FF0000', name: 'Muladhara' },
  { chakra: 'sacral', frequency: 417, color: '#FF7F00', name: 'Svadhisthana' },
  { chakra: 'solar', frequency: 528, color: '#FFFF00', name: 'Manipura' },
  { chakra: 'heart', frequency: 639, color: '#00FF00', name: 'Anahata' },
  { chakra: 'throat', frequency: 741, color: '#0000FF', name: 'Vishuddha' },
  { chakra: 'thirdEye', frequency: 852, color: '#4B0082', name: 'Ajna' },
  { chakra: 'crown', frequency: 963, color: '#9400D3', name: 'Sahasrara' },
]

interface SettingsState {
  soundEnabled: boolean
  volume: number
  hapticsEnabled: boolean
  darkMode: boolean
  language: Language

  // Audio settings
  audioSettings: AudioSettings
  favoriteAudioTypes: string[]
  lastUsedAudioType: string | null

  // Actions
  toggleSound: () => void
  setVolume: (volume: number) => void
  toggleHaptics: () => void
  toggleDarkMode: () => void
  setLanguage: (lang: Language) => void

  // Audio actions
  updateAudioSettings: (settings: Partial<AudioSettings>) => void
  setMasterVolume: (volume: number) => void
  setMeditationVolume: (volume: number) => void
  setEffectsVolume: (volume: number) => void
  addFavoriteAudioType: (id: string) => void
  removeFavoriteAudioType: (id: string) => void
  setLastUsedAudioType: (id: string) => void
}

const defaultAudioSettings: AudioSettings = {
  masterVolume: 75,
  meditationVolume: 60,
  effectsVolume: 50,
  binauralEnabled: true,
  naturalSoundsEnabled: true,
  tibetanBowlsEnabled: true,
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      volume: 75,
      hapticsEnabled: true,
      darkMode: true,
      language: 'es',

      // Audio settings
      audioSettings: defaultAudioSettings,
      favoriteAudioTypes: [],
      lastUsedAudioType: null,

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setVolume: (volume) => set({ volume }),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setLanguage: (language) => set({ language }),

      // Audio actions
      updateAudioSettings: (settings) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...settings }
        })),

      setMasterVolume: (volume) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, masterVolume: volume }
        })),

      setMeditationVolume: (volume) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, meditationVolume: volume }
        })),

      setEffectsVolume: (volume) =>
        set((state) => ({
          audioSettings: { ...state.audioSettings, effectsVolume: volume }
        })),

      addFavoriteAudioType: (id) =>
        set((state) => ({
          favoriteAudioTypes: state.favoriteAudioTypes.includes(id)
            ? state.favoriteAudioTypes
            : [...state.favoriteAudioTypes, id]
        })),

      removeFavoriteAudioType: (id) =>
        set((state) => ({
          favoriteAudioTypes: state.favoriteAudioTypes.filter(f => f !== id)
        })),

      setLastUsedAudioType: (id) => set({ lastUsedAudioType: id }),
    }),
    {
      name: 'mystica-settings'
    }
  )
)

// Sound effects hook
interface AppSoundState {
  enabled: boolean
  play: (sound: string) => void
  toggle: () => void
}

// Simple audio context for sound effects
const soundFiles: Record<string, string> = {
  'click': '/sounds/click.mp3',
  'success': '/sounds/success.mp3',
  'magic-chime': '/sounds/magic-chime.mp3',
  'meditation': '/sounds/meditation-bell.mp3',
  'mystical-bell': '/sounds/mystical-bell.mp3',
}

export const useAppSound = create<AppSoundState>()(
  persist(
    (set, get) => ({
      enabled: true,

      play: (sound: string) => {
        if (typeof window === 'undefined') return
        const state = get()
        if (!state.enabled) return

        try {
          // Create a simple audio context beep
          const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          // Different frequencies for different sounds
          const frequencies: Record<string, number> = {
            'click': 800,
            'success': 523.25,
            'magic-chime': 880,
            'meditation': 392,
            'mystical-bell': 660,
          }

          oscillator.frequency.value = frequencies[sound] || 440
          oscillator.type = 'sine'

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        } catch {
          // Silently fail if audio context is not available
          console.log('Audio not available')
        }
      },

      toggle: () => set((state) => ({ enabled: !state.enabled })),
    }),
    {
      name: 'mystica-app-sound'
    }
  )
)

// Hook to get audio type by ID
export function useAudioType(id: string | null): AudioTypeConfig | undefined {
  if (!id) return undefined
  return availableAudioTypes.find(type => type.id === id)
}

// Hook to get audio types by category
export function useAudioTypesByCategory(category: AudioTypeConfig['category']): AudioTypeConfig[] {
  return availableAudioTypes.filter(type => type.category === category)
}

// Hook for favorites
export function useFavoriteAudioTypes(): AudioTypeConfig[] {
  const favorites = useSettings(state => state.favoriteAudioTypes)
  return availableAudioTypes.filter(type => favorites.includes(type.id))
}
