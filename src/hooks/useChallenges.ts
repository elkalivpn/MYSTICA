'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WeeklyChallenge {
  id: string
  title: string
  description: string
  icon: string
  target: number
  progress: number
  type: 'meditation' | 'sessions' | 'minutes' | 'variety' | 'streak'
  reward: {
    xp: number
    badge?: string
  }
  weekStart: string // ISO date of week start
  completed: boolean
  completedAt?: string
}

export const challengeTemplates = [
  {
    title: 'Meditador Consistente',
    description: 'Completa 5 sesiones de meditación esta semana',
    icon: '🧘',
    target: 5,
    type: 'sessions' as const,
    reward: { xp: 100, badge: 'consistent_meditator' }
  },
  {
    title: 'Explorador Interior',
    description: 'Prueba 3 meditaciones diferentes esta semana',
    icon: '🗺️',
    target: 3,
    type: 'variety' as const,
    reward: { xp: 75 }
  },
  {
    title: 'Mañana Mística',
    description: 'Medita 3 días antes de las 9am esta semana',
    icon: '🌅',
    target: 3,
    type: 'morning' as const,
    reward: { xp: 80 }
  },
  {
    title: 'Noche Serena',
    description: 'Medita 3 veces antes de dormir esta semana',
    icon: '🌙',
    target: 3,
    type: 'night' as const,
    reward: { xp: 80 }
  },
  {
    title: 'Maratón de Paz',
    description: 'Acumula 60 minutos de meditación esta semana',
    icon: '⏱️',
    target: 60,
    type: 'minutes' as const,
    reward: { xp: 120 }
  },
  {
    title: 'Racha Semanal',
    description: 'Medita 7 días consecutivos',
    icon: '🔥',
    target: 7,
    type: 'streak' as const,
    reward: { xp: 150, badge: 'week_warrior' }
  },
  {
    title: 'Sanador del Alma',
    description: 'Completa 2 meditaciones de sanación esta semana',
    icon: '💚',
    target: 2,
    type: 'category' as const,
    category: 'sanacion',
    reward: { xp: 60 }
  },
  {
    title: 'Chakras en Armonía',
    description: 'Completa 2 meditaciones de chakras esta semana',
    icon: '🔮',
    target: 2,
    type: 'category' as const,
    category: 'chakras',
    reward: { xp: 60 }
  },
  {
    title: 'Sintonía Cósmica',
    description: 'Escucha 3 sonidos binaurales esta semana',
    icon: '🎧',
    target: 3,
    type: 'audio_type' as const,
    audioType: 'binaural',
    reward: { xp: 70 }
  },
  {
    title: 'Descanso Profundo',
    description: 'Completa 2 meditaciones para dormir esta semana',
    icon: '😴',
    target: 2,
    type: 'category' as const,
    category: 'dormir',
    reward: { xp: 65 }
  }
]

interface ChallengeState {
  challenges: WeeklyChallenge[]
  currentWeek: string
  totalXP: number
  weeklyXP: number
  
  // Actions
  initializeWeek: () => void
  updateProgress: (type: string, value: number, metadata?: Record<string, any>) => void
  completeChallenge: (challengeId: string) => void
  getActiveChallenges: () => WeeklyChallenge[]
  getCompletedChallenges: () => WeeklyChallenge[]
  getWeeklyProgress: () => { completed: number; total: number; percentage: number }
}

const getWeekStart = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0]
}

const generateWeeklyChallenges = (): WeeklyChallenge[] => {
  const weekStart = getWeekStart()
  const shuffled = [...challengeTemplates].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 4)
  
  return selected.map((template, index) => ({
    id: `challenge-${weekStart}-${index}`,
    title: template.title,
    description: template.description,
    icon: template.icon,
    target: template.target,
    progress: 0,
    type: template.type,
    reward: template.reward,
    weekStart,
    completed: false
  }))
}

export const useChallenges = create<ChallengeState>()(
  persist(
    (set, get) => ({
      challenges: [],
      currentWeek: '',
      totalXP: 0,
      weeklyXP: 0,

      initializeWeek: () => {
        const currentWeekStart = getWeekStart()
        const state = get()
        
        if (state.currentWeek !== currentWeekStart) {
          const newChallenges = generateWeeklyChallenges()
          set({
            challenges: newChallenges,
            currentWeek: currentWeekStart,
            weeklyXP: 0
          })
        }
      },

      updateProgress: (type, value, metadata = {}) => {
        set((state) => {
          const updatedChallenges = state.challenges.map(challenge => {
            if (challenge.completed) return challenge
            
            let shouldUpdate = false
            let newProgress = challenge.progress
            
            switch (challenge.type) {
              case 'sessions':
                if (type === 'session_complete') {
                  newProgress += 1
                  shouldUpdate = true
                }
                break
              case 'minutes':
                if (type === 'minutes_added') {
                  newProgress += value
                  shouldUpdate = true
                }
                break
              case 'variety':
                if (type === 'unique_meditation') {
                  newProgress += 1
                  shouldUpdate = true
                }
                break
              case 'streak':
                if (type === 'streak_updated') {
                  newProgress = value
                  shouldUpdate = true
                }
                break
              case 'morning':
                if (type === 'morning_meditation') {
                  newProgress += 1
                  shouldUpdate = true
                }
                break
              case 'night':
                if (type === 'night_meditation') {
                  newProgress += 1
                  shouldUpdate = true
                }
                break
              case 'category':
                if (type === 'category_complete' && metadata.category === (challenge as any).category) {
                  newProgress += 1
                  shouldUpdate = true
                }
                break
              case 'audio_type':
                if (type === 'audio_type_complete' && metadata.audioType === (challenge as any).audioType) {
                  newProgress += 1
                  shouldUpdate = true
                }
                break
            }
            
            if (shouldUpdate) {
              const completed = newProgress >= challenge.target
              return {
                ...challenge,
                progress: Math.min(newProgress, challenge.target),
                completed,
                completedAt: completed ? new Date().toISOString() : undefined
              }
            }
            
            return challenge
          })
          
          // Calculate XP for newly completed challenges
          const newCompletions = updatedChallenges.filter(
            (c, i) => c.completed && !state.challenges[i].completed
          )
          const earnedXP = newCompletions.reduce((sum, c) => sum + c.reward.xp, 0)
          
          return {
            challenges: updatedChallenges,
            weeklyXP: state.weeklyXP + earnedXP,
            totalXP: state.totalXP + earnedXP
          }
        })
      },

      completeChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map(c => 
            c.id === challengeId 
              ? { ...c, completed: true, completedAt: new Date().toISOString() }
              : c
          )
        }))
      },

      getActiveChallenges: () => {
        return get().challenges.filter(c => !c.completed)
      },

      getCompletedChallenges: () => {
        return get().challenges.filter(c => c.completed)
      },

      getWeeklyProgress: () => {
        const challenges = get().challenges
        const completed = challenges.filter(c => c.completed).length
        const total = challenges.length
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      }
    }),
    {
      name: 'mystica-challenges'
    }
  )
)
