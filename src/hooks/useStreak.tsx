'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
}

export const achievements: Achievement[] = [
  {
    id: 'first-checkin',
    name: 'Primer Paso',
    description: 'Tu primer check-in diario',
    icon: '🌟'
  },
  {
    id: 'streak-3',
    name: 'En Racha',
    description: '3 días consecutivos',
    icon: '🔥'
  },
  {
    id: 'streak-7',
    name: 'Semana Mística',
    description: '7 días consecutivos',
    icon: '✨'
  },
  {
    id: 'streak-14',
    name: 'Dos Semanas de Luz',
    description: '14 días consecutivos',
    icon: '🌙'
  },
  {
    id: 'streak-30',
    name: 'Mes Sagrado',
    description: '30 días consecutivos',
    icon: '🌟'
  },
  {
    id: 'streak-60',
    name: 'Disciplina Mística',
    description: '60 días consecutivos',
    icon: '🔮'
  },
  {
    id: 'streak-100',
    name: 'Maestro del Tiempo',
    description: '100 días consecutivos',
    icon: '👑'
  }
]

interface StreakState {
  currentStreak: number
  bestStreak: number
  lastCheckIn: string | null
  totalCheckIns: number
  unlockedAchievements: string[]
  affirmations: string[]
  
  checkIn: () => { newStreak: number; achievement?: Achievement }
  getStreakStatus: () => 'active' | 'broken' | 'new'
  getAffirmation: () => string
  addAffirmation: (affirmation: string) => void
}

const defaultAffirmations = [
  'Hoy es un día lleno de posibilidades mágicas.',
  'Mi intuición me guía hacia mi mayor bien.',
  'Soy merecedor/a de todas las bendiciones del universo.',
  'Cada día me acerco más a mi verdadero ser.',
  'La luz del universo brilla a través de mí.',
  'Confío en el proceso de mi vida.',
  'Mi energía atrae todo lo que necesito.',
  'Estoy alineado/a con el propósito de mi alma.',
  'El amor y la abundancia fluyen hacia mí.',
  'Soy un canal de luz y sabiduría.'
]

const getTodayString = () => new Date().toISOString().split('T')[0]

const getYesterdayString = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export const useStreak = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      bestStreak: 0,
      lastCheckIn: null,
      totalCheckIns: 0,
      unlockedAchievements: [],
      affirmations: defaultAffirmations,

      checkIn: () => {
        const state = get()
        const today = getTodayString()
        const yesterday = getYesterdayString()
        
        // Already checked in today
        if (state.lastCheckIn === today) {
          return { newStreak: state.currentStreak }
        }

        let newStreak = 1
        
        // If last check-in was yesterday, continue streak
        if (state.lastCheckIn === yesterday) {
          newStreak = state.currentStreak + 1
        }

        const newBestStreak = Math.max(newStreak, state.bestStreak)
        
        // Check for achievements
        let achievement: Achievement | undefined
        const achievementMap: Record<number, string> = {
          1: 'first-checkin',
          3: 'streak-3',
          7: 'streak-7',
          14: 'streak-14',
          30: 'streak-30',
          60: 'streak-60',
          100: 'streak-100'
        }

        const achievementId = achievementMap[newStreak]
        if (achievementId && !state.unlockedAchievements.includes(achievementId)) {
          achievement = achievements.find(a => a.id === achievementId)
        }

        set({
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          lastCheckIn: today,
          totalCheckIns: state.totalCheckIns + 1,
          unlockedAchievements: achievement 
            ? [...state.unlockedAchievements, achievement.id]
            : state.unlockedAchievements
        })

        return { newStreak, achievement }
      },

      getStreakStatus: () => {
        const state = get()
        const today = getTodayString()
        const yesterday = getYesterdayString()

        if (!state.lastCheckIn) return 'new'
        if (state.lastCheckIn === today) return 'active'
        if (state.lastCheckIn === yesterday) return 'active'
        return 'broken'
      },

      getAffirmation: () => {
        const state = get()
        const dayOfYear = Math.floor(
          (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        )
        return state.affirmations[dayOfYear % state.affirmations.length]
      },

      addAffirmation: (affirmation) => {
        set((state) => ({
          affirmations: [...state.affirmations, affirmation]
        }))
      }
    }),
    {
      name: 'mystica-streak',
    }
  )
)
