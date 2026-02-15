/**
 * TTS (Text-to-Speech) Service for Mystica
 * Web Speech API implementation with feminine voice selection
 * Optimized for relaxing readings and meditations
 */

export interface VoiceConfig {
  lang: 'es-ES' | 'en-US' | 'es-MX'
  rate: number // 0.1 - 10 (0.8 for relaxing, 0.9 for readings, 1.0 for normal)
  pitch: number // 0 - 2 (1.0 is normal)
  volume: number // 0 - 1
}

export interface SpeakOptions {
  rate?: number
  pitch?: number
  volume?: number
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  onBoundary?: (charIndex: number, charLength: number) => void
}

export interface TTSServiceState {
  isSpeaking: boolean
  isPaused: boolean
  currentText: string
  progress: number // 0-100 percentage
}

// Default voice configurations
const DEFAULT_CONFIG: VoiceConfig = {
  lang: 'es-ES',
  rate: 0.9,
  pitch: 1.0,
  volume: 0.9
}

// Speed presets for different contexts
export const SPEED_PRESETS = {
  normal: 1.0,      // Normal speed
  reading: 0.9,     // For interpretations and readings
  relaxing: 0.85,   // For meditations (more relaxing)
  slow: 0.8         // Very slow for deep meditations
} as const

// Preferred female voice names in order of preference for Spanish
const FEMALE_VOICE_PREFERENCES_ES = [
  'Google español',
  'Microsoft Laura',
  'Microsoft Helena',
  'Monica',
  'Penelope',
  'Paulina',
  'Sabina',
  'Soledad',
  'Mónica',
  'Laura',
  'Helena',
  'Paulina',
  'Lucia',
  'Lucía',
  'Isabel',
  'Carmen',
  'Lola',
  'Marta',
  'María',
  'ES Spanish Female',
  'Spanish Spain Female',
  'es-ES-female',
  'female-es-ES'
]

// Preferred female voice names for English
const FEMALE_VOICE_PREFERENCES_EN = [
  'Google UK English Female',
  'Microsoft Zira',
  'Samantha',
  'Victoria',
  'Karen',
  'Moira',
  'Fiona',
  'Tessa',
  'Veena',
  'Samantha',
  'Susan',
  'Emily',
  'Kate',
  'US English Female',
  'English Female',
  'en-US-female',
  'female-en-US'
]

class TTSService {
  private synthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private selectedVoice: SpeechSynthesisVoice | null = null
  private voices: SpeechSynthesisVoice[] = []
  private state: TTSServiceState = {
    isSpeaking: false,
    isPaused: false,
    currentText: '',
    progress: 0
  }
  private listeners: Set<(state: TTSServiceState) => void> = new Set()
  private voicesLoaded = false
  private config: VoiceConfig = { ...DEFAULT_CONFIG }

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
      this.loadVoices()
      
      // Handle voices changed event (voices load asynchronously in some browsers)
      this.synthesis.onvoiceschanged = () => {
        this.loadVoices()
      }
    }
  }

  /**
   * Check if TTS is supported in the current browser
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window
  }

  /**
   * Load and cache available voices
   */
  private loadVoices(): void {
    if (!this.synthesis) return
    
    this.voices = this.synthesis.getVoices()
    this.voicesLoaded = this.voices.length > 0
    
    if (this.voicesLoaded) {
      this.selectBestVoice()
    }
  }

  /**
   * Get all available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  /**
   * Get Spanish female voices
   */
  getSpanishFemaleVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('es') && 
      this.isFemaleVoice(voice.name)
    )
  }

  /**
   * Get English female voices
   */
  getEnglishFemaleVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.startsWith('en') && 
      this.isFemaleVoice(voice.name)
    )
  }

  /**
   * Check if a voice name suggests it's female
   */
  private isFemaleVoice(voiceName: string): boolean {
    const lowerName = voiceName.toLowerCase()
    const femaleIndicators = [
      'female', 'mujer', 'femenina', 'feminine',
      'laura', 'helena', 'monica', 'penelope', 'paulina', 
      'sabina', 'soledad', 'lucia', 'isabel', 'carmen',
      'lola', 'marta', 'maria', 'susan', 'samantha',
      'victoria', 'karen', 'zira', 'moira', 'fiona',
      'tessa', 'veena', 'emily', 'kate', 'linda',
      'anna', 'ellen', 'zoe', 'alice'
    ]
    
    // Check for explicit female indicators
    for (const indicator of femaleIndicators) {
      if (lowerName.includes(indicator)) {
        return true
      }
    }
    
    // Check against our preference lists
    const allFemalePreferences = [...FEMALE_VOICE_PREFERENCES_ES, ...FEMALE_VOICE_PREFERENCES_EN]
    return allFemalePreferences.some(pref => 
      lowerName.includes(pref.toLowerCase())
    )
  }

  /**
   * Select the best available voice based on preferences
   */
  private selectBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) return null

    const preferences = this.config.lang.startsWith('es') 
      ? FEMALE_VOICE_PREFERENCES_ES 
      : FEMALE_VOICE_PREFERENCES_EN

    // First, try to find a female voice matching the language
    for (const prefName of preferences) {
      const found = this.voices.find(voice => 
        voice.name.toLowerCase().includes(prefName.toLowerCase()) &&
        voice.lang.startsWith(this.config.lang.substring(0, 2))
      )
      if (found) {
        this.selectedVoice = found
        return found
      }
    }

    // Second, try any female voice with the correct language
    const femaleVoices = this.config.lang.startsWith('es')
      ? this.getSpanishFemaleVoices()
      : this.getEnglishFemaleVoices()

    if (femaleVoices.length > 0) {
      // Prefer local voices over network voices for better reliability
      const localVoice = femaleVoices.find(v => v.localService)
      this.selectedVoice = localVoice || femaleVoices[0]
      return this.selectedVoice
    }

    // Third, try any voice with the correct language
    const langVoices = this.voices.filter(voice => 
      voice.lang.startsWith(this.config.lang.substring(0, 2))
    )
    
    if (langVoices.length > 0) {
      // Prefer local voices
      const localVoice = langVoices.find(v => v.localService)
      this.selectedVoice = localVoice || langVoices[0]
      return this.selectedVoice
    }

    // Fallback to first available voice
    this.selectedVoice = this.voices[0] || null
    return this.selectedVoice
  }

  /**
   * Set the language for TTS
   */
  setLanguage(lang: VoiceConfig['lang']): void {
    this.config.lang = lang
    this.selectBestVoice()
  }

  /**
   * Set voice configuration
   */
  setConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config }
    if (config.lang) {
      this.selectBestVoice()
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): VoiceConfig {
    return { ...this.config }
  }

  /**
   * Get the currently selected voice
   */
  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice
  }

  /**
   * Speak text with current configuration
   */
  speak(text: string, options: SpeakOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        const error = 'Speech synthesis not supported'
        options.onError?.(error)
        reject(new Error(error))
        return
      }

      // Cancel any current speech
      this.stop()

      // Clean text for speech
      const cleanText = this.cleanTextForSpeech(text)
      
      const utterance = new SpeechSynthesisUtterance(cleanText)
      this.currentUtterance = utterance

      // Set voice
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice
      }

      // Set properties
      utterance.lang = this.config.lang
      utterance.rate = options.rate ?? this.config.rate
      utterance.pitch = options.pitch ?? this.config.pitch
      utterance.volume = options.volume ?? this.config.volume

      // Track progress
      let charCount = cleanText.length
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const progress = Math.min(100, Math.round((event.charIndex / charCount) * 100))
          this.updateState({
            progress,
            currentText: cleanText.substring(event.charIndex, event.charIndex + 50)
          })
          options.onBoundary?.(event.charIndex, event.charLength || 0)
        }
      }

      // Event handlers
      utterance.onstart = () => {
        this.updateState({
          isSpeaking: true,
          isPaused: false,
          currentText: cleanText,
          progress: 0
        })
        options.onStart?.()
      }

      utterance.onend = () => {
        this.updateState({
          isSpeaking: false,
          isPaused: false,
          progress: 100
        })
        this.currentUtterance = null
        options.onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        // Don't treat 'interrupted' or 'canceled' as errors
        if (event.error === 'interrupted' || event.error === 'canceled') {
          this.updateState({
            isSpeaking: false,
            isPaused: false
          })
          resolve()
          return
        }
        
        const errorMsg = `Speech synthesis error: ${event.error}`
        this.updateState({
          isSpeaking: false,
          isPaused: false
        })
        options.onError?.(errorMsg)
        reject(new Error(errorMsg))
      }

      // Start speaking
      this.synthesis.speak(utterance)
      
      // Workaround for Chrome bug where speech stops after ~15 seconds of silence
      this.keepAlive()
    })
  }

  /**
   * Chrome workaround to keep speech alive
   */
  private keepAlive(): void {
    if (!this.synthesis) return
    
    const keepAliveInterval = setInterval(() => {
      if (!this.state.isSpeaking) {
        clearInterval(keepAliveInterval)
        return
      }
      // Pause and resume to prevent Chrome timeout
      this.synthesis.pause()
      this.synthesis.resume()
    }, 10000)
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
    this.currentUtterance = null
    this.updateState({
      isSpeaking: false,
      isPaused: false,
      currentText: '',
      progress: 0
    })
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis && this.state.isSpeaking) {
      this.synthesis.pause()
      this.updateState({ isPaused: true })
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis && this.state.isPaused) {
      this.synthesis.resume()
      this.updateState({ isPaused: false })
    }
  }

  /**
   * Toggle pause/resume
   */
  togglePause(): void {
    if (this.state.isPaused) {
      this.resume()
    } else {
      this.pause()
    }
  }

  /**
   * Clean text for better speech synthesis
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Remove emojis
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      // Remove special Unicode symbols
      .replace(/[\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Add pauses at sentence endings for more natural speech
      .replace(/\. /g, '. ... ')
      .replace(/! /g, '! ... ')
      .replace(/\? /g, '? ... ')
      // Add slight pause at commas
      .replace(/, /g, ', .. ')
      // Clean up any multiple dots
      .replace(/\.{4,}/g, '...')
      .replace(/\.{2,}/g, '..')
      .trim()
  }

  /**
   * Get current state
   */
  getState(): TTSServiceState {
    return { ...this.state }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: TTSServiceState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Update state and notify listeners
   */
  private updateState(updates: Partial<TTSServiceState>): void {
    this.state = { ...this.state, ...updates }
    this.listeners.forEach(listener => listener(this.state))
  }

  /**
   * Format reading for Tarot cards
   */
  formatTarotReading(cards: Array<{
    name: string
    numeral: string
    upright: string
    keywords: string[]
    isReversed?: boolean
  }>): string {
    const totalCards = cards.length
    let text = `Has seleccionado ${totalCards} carta${totalCards > 1 ? 's' : ''}. `
    
    cards.forEach((card, index) => {
      const position = this.getPositionName(index, totalCards)
      text += `${position}, tienes la carta ${card.name}. `
      
      if (card.isReversed) {
        text += `Esta carta aparece invertida, lo que indica `
      } else {
        text += `Esta carta representa ${card.keywords.slice(0, 3).join(', ')}. `
      }
      
      text += `${card.upright}. `
      
      if (index < cards.length - 1) {
        text += '... '
      }
    })
    
    text += 'Que estas cartas iluminen tu camino.'
    return text
  }

  /**
   * Format reading for Runes
   */
  formatRuneReading(runes: Array<{
    name: string
    symbol: string
    meaning: string
    upright: string
    keywords: string[]
  }>): string {
    let text = `Las runas ancestrales han hablado. `
    
    runes.forEach((rune, index) => {
      const position = this.getPositionName(index, runes.length)
      text += `${position}, la runa ${rune.name}, que significa ${rune.meaning}. `
      text += `${rune.upright}. `
      
      if (index < runes.length - 1) {
        text += '... '
      }
    })
    
    text += 'Que la sabiduria de los antiguos te guie.'
    return text
  }

  /**
   * Format reading for Oracle
   */
  formatOracleReading(card: {
    name: string
    element: string
    message: string
    guidance: string
    affirmation: string
  }): string {
    let text = `El oraculo ha revelado: ${card.name}. `
    text += `Elemento: ${card.element}. `
    text += `Mensaje: ${card.message}. `
    text += `Guia: ${card.guidance}. `
    text += `Afirmacion del dia: ${card.affirmation}. `
    text += 'Que este mensaje resuene en tu corazon.'
    return text
  }

  /**
   * Format meditation guide
   */
  formatMeditationGuide(
    name: string,
    steps: string[],
    affirmations: string[]
  ): string {
    let text = `Comenzando la meditacion: ${name}. `
    text += 'Respira profundamente y permite que cada palabra te guie hacia un estado de paz interior. '
    text += '... '
    
    steps.forEach((step, index) => {
      text += `Paso ${index + 1}: ${step}. `
      text += '... '
    })
    
    if (affirmations.length > 0) {
      text += `Afirmacion: ${affirmations[0]}. `
    }
    
    text += 'Que esta meditacion te traiga paz y serenidad.'
    return text
  }

  /**
   * Get position name for readings (past, present, future)
   */
  private getPositionName(index: number, total: number): string {
    if (total === 1) return 'En tu lectura'
    
    const positions3 = ['En el pasado', 'En el presente', 'En el futuro']
    const positions5 = [
      'En tu situacion actual',
      'En el desafio que enfrentas',
      'En tu pasado reciente',
      'En el futuro cercano',
      'En el resultado final'
    ]
    
    if (total === 3 && index < 3) return positions3[index]
    if (total === 5 && index < 5) return positions5[index]
    
    return `En la posicion ${index + 1}`
  }
}

// Export singleton instance
export const ttsService = new TTSService()

// Also export the class for testing purposes
export { TTSService }
