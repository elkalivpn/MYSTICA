'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ZodiacSign = 
  | 'aries' | 'tauro' | 'geminis' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'escorpio' 
  | 'sagitario' | 'capricornio' | 'acuario' | 'piscis'
  | ''

interface OnboardingState {
  hasCompletedOnboarding: boolean
  currentStep: number
  userName: string
  userZodiac: ZodiacSign
  completedAt: string | null
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setUserName: (name: string) => void
  setUserZodiac: (zodiac: ZodiacSign) => void
  completeOnboarding: () => void
  restartOnboarding: () => void
  resetProgress: () => void
}

const TOTAL_STEPS = 6

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      userName: '',
      userZodiac: '',
      completedAt: null,

      setStep: (step) => set({ 
        currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) 
      }),

      nextStep: () => {
        const { currentStep } = get()
        if (currentStep < TOTAL_STEPS - 1) {
          set({ currentStep: currentStep + 1 })
        }
      },

      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 })
        }
      },

      setUserName: (name) => set({ userName: name }),
      
      setUserZodiac: (zodiac) => set({ userZodiac: zodiac }),

      completeOnboarding: () => set({ 
        hasCompletedOnboarding: true,
        completedAt: new Date().toISOString()
      }),

      restartOnboarding: () => set({ 
        hasCompletedOnboarding: false,
        currentStep: 0,
        // Keep userName and userZodiac for the ReadySlide
      }),

      resetProgress: () => set({
        hasCompletedOnboarding: false,
        currentStep: 0,
        userName: '',
        userZodiac: '',
        completedAt: null
      })
    }),
    {
      name: 'mystica-onboarding'
    }
  )
)

// Zodiac sign data for the selector
export const zodiacOptions: { id: ZodiacSign; name: string; symbol: string; dates: string }[] = [
  { id: 'aries', name: 'Aries', symbol: '\u2648', dates: '21 Mar - 19 Abr' },
  { id: 'tauro', name: 'Tauro', symbol: '\u2649', dates: '20 Abr - 20 May' },
  { id: 'geminis', name: 'Geminis', symbol: '\u264A', dates: '21 May - 20 Jun' },
  { id: 'cancer', name: 'Cancer', symbol: '\u264B', dates: '21 Jun - 22 Jul' },
  { id: 'leo', name: 'Leo', symbol: '\u264C', dates: '23 Jul - 22 Ago' },
  { id: 'virgo', name: 'Virgo', symbol: '\u264D', dates: '23 Ago - 22 Sep' },
  { id: 'libra', name: 'Libra', symbol: '\u264E', dates: '23 Sep - 22 Oct' },
  { id: 'escorpio', name: 'Escorpio', symbol: '\u264F', dates: '23 Oct - 21 Nov' },
  { id: 'sagitario', name: 'Sagitario', symbol: '\u2650', dates: '22 Nov - 21 Dic' },
  { id: 'capricornio', name: 'Capricornio', symbol: '\u2651', dates: '22 Dic - 19 Ene' },
  { id: 'acuario', name: 'Acuario', symbol: '\u2652', dates: '20 Ene - 18 Feb' },
  { id: 'piscis', name: 'Piscis', symbol: '\u2653', dates: '19 Feb - 20 Mar' },
]

// Helper function to get zodiac by id
export function getZodiacById(id: ZodiacSign): typeof zodiacOptions[0] | undefined {
  return zodiacOptions.find(z => z.id === id)
}
