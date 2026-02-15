/**
 * Mystica Audio System
 * Web Audio API-based sound generation for meditation and mystical experiences
 * No external audio files required
 */

// Sound configuration types
export interface EnvelopeConfig {
  attack: number    // Time to reach peak volume (seconds)
  decay: number     // Time to reach sustain level (seconds)
  sustain: number   // Sustain volume level (0-1)
  release: number   // Time to fade out (seconds)
}

export interface HarmonicConfig {
  frequency: number  // Frequency multiplier (1 = fundamental)
  amplitude: number  // Relative amplitude (0-1)
  type: OscillatorType
}

export interface SoundConfig {
  frequency: number
  harmonics: HarmonicConfig[]
  envelope: EnvelopeConfig
  duration: number
  type?: OscillatorType
}

// Predefined sound configurations
export const SOUND_CONFIGS: Record<string, SoundConfig> = {
  'meditation-bell': {
    frequency: 432, // Healing frequency
    harmonics: [
      { frequency: 1, amplitude: 1, type: 'sine' },
      { frequency: 2, amplitude: 0.5, type: 'sine' },
      { frequency: 3, amplitude: 0.25, type: 'sine' },
      { frequency: 5, amplitude: 0.125, type: 'sine' },
    ],
    envelope: {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.4,
      release: 3.0,
    },
    duration: 4.0,
  },
  'chime': {
    frequency: 528, // Love frequency
    harmonics: [
      { frequency: 1, amplitude: 1, type: 'sine' },
      { frequency: 2.5, amplitude: 0.3, type: 'sine' },
      { frequency: 4, amplitude: 0.15, type: 'sine' },
    ],
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1.5,
    },
    duration: 2.0,
  },
  'success': {
    frequency: 639, // Relationship frequency
    harmonics: [
      { frequency: 1, amplitude: 1, type: 'sine' },
      { frequency: 1.5, amplitude: 0.6, type: 'triangle' },
    ],
    envelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0.5,
      release: 0.5,
    },
    duration: 1.0,
  },
  'click': {
    frequency: 800,
    harmonics: [
      { frequency: 1, amplitude: 1, type: 'sine' },
    ],
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0,
      release: 0.05,
    },
    duration: 0.1,
  },
  'mystical': {
    frequency: 741, // Awakening intuition
    harmonics: [
      { frequency: 1, amplitude: 1, type: 'sine' },
      { frequency: 1.5, amplitude: 0.4, type: 'sine' },
      { frequency: 2, amplitude: 0.2, type: 'triangle' },
      { frequency: 3, amplitude: 0.1, type: 'sine' },
    ],
    envelope: {
      attack: 0.1,
      decay: 0.4,
      sustain: 0.3,
      release: 2.0,
    },
    duration: 3.0,
  },
  'bowl': {
    frequency: 432, // Tibetan bowl - healing frequency
    harmonics: [
      { frequency: 1, amplitude: 1, type: 'sine' },
      { frequency: 2.4, amplitude: 0.7, type: 'sine' },
      { frequency: 4.2, amplitude: 0.4, type: 'sine' },
      { frequency: 5.8, amplitude: 0.2, type: 'sine' },
      { frequency: 7.5, amplitude: 0.1, type: 'sine' },
    ],
    envelope: {
      attack: 0.5,
      decay: 1.0,
      sustain: 0.6,
      release: 5.0,
    },
    duration: 8.0,
  },
}

// Solfeggio frequencies for healing
export const SOLFEGGIO_FREQUENCIES = {
  ut: 396,  // Liberating guilt and fear
  re: 417,  // Undoing situations and facilitating change
  mi: 528,  // Transformation and miracles (DNA repair)
  fa: 639,  // Connecting/relationships
  sol: 741, // Awakening intuition
  la: 852,  // Returning to spiritual order
  si: 963,  // Divine connection
} as const

// Binaural beat configurations
export const BINAURAL_CONFIGS = {
  delta: { baseFreq: 100, beatFreq: 2, description: 'Deep sleep, healing' },
  theta: { baseFreq: 150, beatFreq: 4, description: 'Meditation, creativity' },
  alpha: { baseFreq: 200, beatFreq: 10, description: 'Relaxation, focus' },
  beta: { baseFreq: 250, beatFreq: 20, description: 'Alertness, concentration' },
  gamma: { baseFreq: 300, beatFreq: 40, description: 'Higher cognition' },
} as const

// Tibetan bowl frequencies
export const TIBETAN_BOWL_FREQUENCIES = {
  root: 432,      // Root chakra
  sacral: 288,    // Sacral chakra
  solar: 320,     // Solar plexus
  heart: 432,     // Heart chakra
  throat: 480,    // Throat chakra
  thirdEye: 528,  // Third eye
  crown: 768,     // Crown chakra
} as const

/**
 * AudioSystem class - Main audio engine for Mystica
 */
export class AudioSystem {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private activeOscillators: Map<string, OscillatorNode[]> = new Map()
  private volume: number = 0.7

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext()
    }
  }

  private initAudioContext(): void {
    if (this.audioContext) return

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = this.volume
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error)
    }
  }

  /**
   * Resume audio context if suspended (required for user interaction)
   */
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  /**
   * Set master volume
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.masterGain) {
      this.masterGain.gain.value = this.volume
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume
  }

  /**
   * Apply envelope to a gain node
   */
  private applyEnvelope(
    gainNode: GainNode,
    envelope: EnvelopeConfig,
    startTime: number,
    duration: number,
    maxGain: number = 1
  ): void {
    const ctx = this.audioContext!
    const { attack, decay, sustain, release } = envelope
    
    // Start from zero
    gainNode.gain.setValueAtTime(0, startTime)
    
    // Attack phase
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + attack)
    
    // Decay phase
    gainNode.gain.linearRampToValueAtTime(maxGain * sustain, startTime + attack + decay)
    
    // Sustain phase (held until release)
    const sustainEnd = startTime + duration - release
    gainNode.gain.setValueAtTime(maxGain * sustain, sustainEnd)
    
    // Release phase
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration)
  }

  /**
   * Play a predefined sound
   */
  async play(soundName: keyof typeof SOUND_CONFIGS): Promise<void> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return

    const config = SOUND_CONFIGS[soundName]
    if (!config) return

    const startTime = this.audioContext.currentTime
    const soundId = `${soundName}-${startTime}`

    const oscillators: OscillatorNode[] = []

    // Create oscillators for each harmonic
    config.harmonics.forEach((harmonic) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.type = harmonic.type
      oscillator.frequency.value = config.frequency * harmonic.frequency

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      // Apply envelope with harmonic amplitude
      this.applyEnvelope(gainNode.gain, config.envelope, startTime, config.duration, harmonic.amplitude * this.volume)

      oscillator.start(startTime)
      oscillator.stop(startTime + config.duration)

      oscillators.push(oscillator)
    })

    this.activeOscillators.set(soundId, oscillators)

    // Clean up after sound ends
    setTimeout(() => {
      this.activeOscillators.delete(soundId)
    }, config.duration * 1000 + 100)
  }

  /**
   * Play a custom frequency
   */
  async playFrequency(
    frequency: number,
    duration: number = 1.0,
    type: OscillatorType = 'sine',
    envelope?: Partial<EnvelopeConfig>
  ): Promise<void> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return

    const defaultEnvelope: EnvelopeConfig = {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.3,
    }

    const finalEnvelope = { ...defaultEnvelope, ...envelope }
    const startTime = this.audioContext.currentTime

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    this.applyEnvelope(gainNode.gain, finalEnvelope, startTime, duration, this.volume)

    oscillator.start(startTime)
    oscillator.stop(startTime + duration)
  }

  /**
   * Play Tibetan bowl sound with rich harmonics
   */
  async playTibetanBowl(frequency: number = 432, duration: number = 8.0): Promise<void> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return

    const startTime = this.audioContext.currentTime
    const bowlId = `bowl-${startTime}`

    // Tibetan bowl harmonic series (approximate real bowl harmonics)
    const harmonics = [
      { freq: 1, amp: 1.0 },
      { freq: 2.4, amp: 0.65 },
      { freq: 4.2, amp: 0.35 },
      { freq: 5.8, amp: 0.2 },
      { freq: 7.5, amp: 0.1 },
    ]

    const envelope: EnvelopeConfig = {
      attack: 0.5,
      decay: 1.5,
      sustain: 0.5,
      release: 3.0,
    }

    const oscillators: OscillatorNode[] = []

    harmonics.forEach(({ freq, amp }) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.value = frequency * freq

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      this.applyEnvelope(gainNode.gain, envelope, startTime, duration, amp * this.volume)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)

      oscillators.push(oscillator)
    })

    this.activeOscillators.set(bowlId, oscillators)

    setTimeout(() => {
      this.activeOscillators.delete(bowlId)
    }, duration * 1000 + 100)
  }

  /**
   * Play binaural beats (requires headphones)
   */
  async playBinauralBeats(
    baseFrequency: number,
    beatFrequency: number,
    duration: number = 60,
    volume: number = 0.5
  ): Promise<string> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return ''

    const startTime = this.audioContext.currentTime
    const beatId = `binaural-${startTime}`

    // Left ear oscillator
    const leftOsc = this.audioContext.createOscillator()
    const leftGain = this.audioContext.createGain()
    const leftPanner = this.audioContext.createStereoPanner()

    leftOsc.type = 'sine'
    leftOsc.frequency.value = baseFrequency
    leftPanner.pan.value = -1 // Full left

    leftOsc.connect(leftGain)
    leftGain.connect(leftPanner)
    leftPanner.connect(this.masterGain)

    // Right ear oscillator
    const rightOsc = this.audioContext.createOscillator()
    const rightGain = this.audioContext.createGain()
    const rightPanner = this.audioContext.createStereoPanner()

    rightOsc.type = 'sine'
    rightOsc.frequency.value = baseFrequency + beatFrequency
    rightPanner.pan.value = 1 // Full right

    rightOsc.connect(rightGain)
    rightGain.connect(rightPanner)
    rightPanner.connect(this.masterGain)

    // Set volume
    const effectiveVolume = volume * this.volume
    leftGain.gain.setValueAtTime(0, startTime)
    leftGain.gain.linearRampToValueAtTime(effectiveVolume, startTime + 2) // Fade in

    rightGain.gain.setValueAtTime(0, startTime)
    rightGain.gain.linearRampToValueAtTime(effectiveVolume, startTime + 2)

    // Fade out at end
    const fadeOutStart = startTime + duration - 2
    leftGain.gain.setValueAtTime(effectiveVolume, fadeOutStart)
    leftGain.gain.linearRampToValueAtTime(0, startTime + duration)

    rightGain.gain.setValueAtTime(effectiveVolume, fadeOutStart)
    rightGain.gain.linearRampToValueAtTime(0, startTime + duration)

    leftOsc.start(startTime)
    rightOsc.start(startTime)
    leftOsc.stop(startTime + duration)
    rightOsc.stop(startTime + duration)

    this.activeOscillators.set(beatId, [leftOsc, rightOsc])

    return beatId
  }

  /**
   * Stop a specific sound by ID
   */
  stop(soundId: string): void {
    const oscillators = this.activeOscillators.get(soundId)
    if (oscillators) {
      oscillators.forEach(osc => {
        try {
          osc.stop()
        } catch {
          // Already stopped
        }
      })
      this.activeOscillators.delete(soundId)
    }
  }

  /**
   * Stop all active sounds
   */
  stopAll(): void {
    this.activeOscillators.forEach((oscillators) => {
      oscillators.forEach(osc => {
        try {
          osc.stop()
        } catch {
          // Already stopped
        }
      })
    })
    this.activeOscillators.clear()
  }

  /**
   * Create pink noise generator
   */
  createPinkNoise(): AudioBufferSourceNode | null {
    if (!this.audioContext) return null

    const bufferSize = this.audioContext.sampleRate * 2 // 2 seconds
    const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate)

    // Pink noise algorithm
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1

        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980

        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
        b6 = white * 0.115926
      }
    }

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = true

    return source
  }

  /**
   * Play pink noise (similar to rain or waterfall)
   */
  async playPinkNoise(duration: number = 60, volume: number = 0.3): Promise<string> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return ''

    const startTime = this.audioContext.currentTime
    const noiseId = `pinknoise-${startTime}`

    const noiseSource = this.createPinkNoise()
    if (!noiseSource) return ''

    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Low-pass filter for softer, more natural sound
    filter.type = 'lowpass'
    filter.frequency.value = 2000

    noiseSource.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    const effectiveVolume = volume * this.volume

    // Fade in
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(effectiveVolume, startTime + 2)

    // Fade out
    const fadeOutStart = startTime + duration - 2
    gainNode.gain.setValueAtTime(effectiveVolume, fadeOutStart)
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

    noiseSource.start(startTime)
    noiseSource.stop(startTime + duration)

    // Store reference for stopping
    ;(noiseSource as unknown as { id: string }).id = noiseId

    return noiseId
  }

  /**
   * Create filtered noise for natural sounds
   */
  async playNaturalSound(
    type: 'rain' | 'wind' | 'ocean',
    duration: number = 60,
    volume: number = 0.3
  ): Promise<string> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return ''

    const startTime = this.audioContext.currentTime
    const soundId = `natural-${type}-${startTime}`

    const noiseSource = this.createPinkNoise()
    if (!noiseSource) return ''

    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    // Different filter settings for different sounds
    const filterConfigs = {
      rain: { type: 'highpass' as BiquadFilterType, freq: 400, Q: 0.5 },
      wind: { type: 'bandpass' as BiquadFilterType, freq: 500, Q: 2 },
      ocean: { type: 'lowpass' as BiquadFilterType, freq: 800, Q: 1 },
    }

    const config = filterConfigs[type]
    filter.type = config.type
    filter.frequency.value = config.freq
    filter.Q.value = config.Q

    noiseSource.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    const effectiveVolume = volume * this.volume

    // Fade in
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(effectiveVolume, startTime + 3)

    // Fade out
    const fadeOutStart = startTime + duration - 3
    gainNode.gain.setValueAtTime(effectiveVolume, fadeOutStart)
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

    noiseSource.start(startTime)
    noiseSource.stop(startTime + duration)

    return soundId
  }

  /**
   * Play a tone with vibrato (mantra-like)
   */
  async playMantraTone(
    frequency: number = 432,
    duration: number = 10,
    vibratoRate: number = 5,
    vibratoDepth: number = 10,
    volume: number = 0.5
  ): Promise<string> {
    if (!this.audioContext) {
      this.initAudioContext()
    }

    await this.resume()
    if (!this.audioContext || !this.masterGain) return ''

    const startTime = this.audioContext.currentTime
    const mantraId = `mantra-${startTime}`

    // Main oscillator
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    // Vibrato LFO
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()

    lfo.type = 'sine'
    lfo.frequency.value = vibratoRate
    lfoGain.gain.value = vibratoDepth // Frequency deviation in Hz

    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    const effectiveVolume = volume * this.volume

    // Envelope
    gainNode.gain.setValueAtTime(0, startTime)
    gainNode.gain.linearRampToValueAtTime(effectiveVolume, startTime + 1)

    const fadeOutStart = startTime + duration - 2
    gainNode.gain.setValueAtTime(effectiveVolume, fadeOutStart)
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

    lfo.start(startTime)
    oscillator.start(startTime)
    lfo.stop(startTime + duration)
    oscillator.stop(startTime + duration)

    this.activeOscillators.set(mantraId, [oscillator, lfo])

    return mantraId
  }

  /**
   * Check if audio context is available
   */
  isAvailable(): boolean {
    return this.audioContext !== null
  }

  /**
   * Get audio context state
   */
  getState(): AudioContextState | null {
    return this.audioContext?.state ?? null
  }
}

// Singleton instance
let audioSystemInstance: AudioSystem | null = null

export function getAudioSystem(): AudioSystem {
  if (!audioSystemInstance) {
    audioSystemInstance = new AudioSystem()
  }
  return audioSystemInstance
}
