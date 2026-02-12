'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StreakState {
  currentStreak: number
  longestStreak: number
  lastCheckIn: string | null
  totalCheckIns: number
  achievements: string[]
  dailyAffirmation: string | null
  affirmationSeen: boolean
  
  checkIn: () => boolean
  getAffirmation: () => string
  markAffirmationSeen: () => void
  resetStreak: () => void
}

const affirmations = [
  "Soy digno/a de amor, abundancia y felicidad.",
  "Mi intuición me guía hacia mi mayor bien.",
  "Confío en el proceso de la vida.",
  "Cada día me acerco más a mis metas.",
  "Soy fuerte, capaz y valiente.",
  "El universo conspira a mi favor.",
  "Merezco todas las cosas buenas que me llegan.",
  "Mi energía atrae experiencias positivas.",
  "Soy un imán para la prosperidad.",
  "Mi luz interior brilla con fuerza.",
  "Libero lo que no me sirve con amor.",
  "Estoy en el lugar correcto en el momento correcto.",
  "Mi corazón está abierto al amor verdadero.",
  "Transformo los desafíos en oportunidades.",
  "Soy paz, soy calma, soy serenidad.",
  "Mi potencial es ilimitado.",
  "Elijo pensamientos que me empoderan.",
  "Cada respiración me llena de energía positiva.",
  "Soy el/la creador/a de mi propia realidad.",
  "La magia fluye a través de mí.",
  "Honro mi camino espiritual único.",
  "Mis sueños son válidos y alcanzables.",
  "Estoy conectado/a con la sabiduría universal.",
  "Mi aura brilla con luz protectora.",
  "Acepto la abundancia en todas sus formas.",
  "Soy exactamente quien necesito ser hoy.",
  "Mi fe es más fuerte que mis miedos.",
  "Las estrellas guían mi camino.",
  "Soy uno/a con el ritmo del universo.",
  "Mi espíritu es libre e ilimitado."
]

const achievements = [
  { id: 'first_check', name: 'Primer Despertar', requirement: 1, emoji: '🌅' },
  { id: 'week_streak', name: 'Semana Mística', requirement: 7, emoji: '⭐' },
  { id: 'two_weeks', name: 'Fortnight de Fe', requirement: 14, emoji: '🌙' },
  { id: 'month_streak', name: 'Mes Lunar', requirement: 30, emoji: '🔮' },
  { id: 'quarter', name: 'Ciclo Estacional', requirement: 90, emoji: '🌟' },
  { id: 'half_year', name: 'Medio Año Sagrado', requirement: 180, emoji: '✨' },
  { id: 'full_year', name: 'Año Cósmico', requirement: 365, emoji: '🌌' }
]

export const useStreak = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
      totalCheckIns: 0,
      achievements: [],
      dailyAffirmation: null,
      affirmationSeen: false,

      checkIn: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        // Ya hizo check-in hoy
        if (state.lastCheckIn === today) {
          return false
        }

        let newStreak = 1

        // Si fue ayer, incrementar racha
        if (state.lastCheckIn === yesterday) {
          newStreak = state.currentStreak + 1
        }

        const newLongest = Math.max(newStreak, state.longestStreak)
        const newTotal = state.totalCheckIns + 1

        // Verificar logros
        const newAchievements = [...state.achievements]
        achievements.forEach(achievement => {
          if (newStreak >= achievement.requirement && !newAchievements.includes(achievement.id)) {
            newAchievements.push(achievement.id)
          }
        })

        // Nueva afirmación del día
        const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]

        set({
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastCheckIn: today,
          totalCheckIns: newTotal,
          achievements: newAchievements,
          dailyAffirmation: newAffirmation,
          affirmationSeen: false
        })

        return true
      },

      getAffirmation: () => {
        const state = get()
        if (state.dailyAffirmation) return state.dailyAffirmation
        
        const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)]
        set({ dailyAffirmation: newAffirmation })
        return newAffirmation
      },

      markAffirmationSeen: () => {
        set({ affirmationSeen: true })
      },

      resetStreak: () => {
        set({
          currentStreak: 0,
          lastCheckIn: null
        })
      }
    }),
    {
      name: 'mystica-streak'
    }
  )
)

export function getAchievementDetails(id: string) {
  return achievements.find(a => a.id === id)
}

export function getNextAchievement(currentStreak: number) {
  return achievements.find(a => a.requirement > currentStreak)
}

export { achievements }
