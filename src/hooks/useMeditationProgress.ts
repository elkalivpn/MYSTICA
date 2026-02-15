'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MeditationSession {
  id: string
  meditationId: number
  meditationName: string
  meditationType: 'guided' | 'unguided'
  category: string
  duration: number
  completed: boolean
  date: string
  stepsCompleted?: number
  totalSteps?: number
}

interface MeditationStats {
  totalSessions: number
  completedSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  averageSessionLength: number
  favoriteCategory: string
  lastSessionDate: string | null
}

export interface DayStats {
  day: string
  dayIndex: number
  minutes: number
  sessions: number
}

export interface MonthlyStats {
  totalMinutes: number
  totalSessions: number
  completedSessions: number
  averagePerDay: number
  daysMeditated: number
  longestStreak: number
}

export interface CategoryDistribution {
  category: string
  minutes: number
  sessions: number
  percentage: number
}

export interface WeeklyStats {
  days: DayStats[]
  totalMinutes: number
  totalSessions: number
  bestDay: string
  averagePerDay: number
}

export interface HeatmapDay {
  date: string
  minutes: number
  sessions: number
  level: 0 | 1 | 2 | 3 | 4
}

interface MeditationProgressState {
  sessions: MeditationSession[]
  favorites: number[]
  stats: MeditationStats
  
  // Actions
  addSession: (session: Omit<MeditationSession, 'id' | 'date'>) => void
  toggleFavorite: (meditationId: number) => void
  isFavorite: (meditationId: number) => boolean
  clearHistory: () => void
  getSessionsByMeditation: (meditationId: number) => MeditationSession[]
  getRecentSessions: (limit?: number) => MeditationSession[]
  
  // New analytics methods
  getWeeklyStats: (weekOffset?: number) => WeeklyStats
  getMonthlyStats: (monthOffset?: number) => MonthlyStats
  getCategoryDistribution: () => CategoryDistribution[]
  getLongestStreak: () => number
  getAverageSessionLength: () => number
  getHeatmapData: (months?: number) => HeatmapDay[][]
  getSessionsByDate: (date: string) => MeditationSession[]
  getLast30DaysProgress: () => { date: string; minutes: number; sessions: number }[]
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export const useMeditationProgress = create<MeditationProgressState>()(
  persist(
    (set, get) => ({
      sessions: [],
      favorites: [],
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageSessionLength: 0,
        favoriteCategory: '',
        lastSessionDate: null
      },

      addSession: (sessionData) => {
        const newSession: MeditationSession = {
          ...sessionData,
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString()
        }

        set((state) => {
          const newSessions = [...state.sessions, newSession]
          const stats = calculateStats(newSessions)
          return { sessions: newSessions, stats }
        })
      },

      toggleFavorite: (meditationId) => {
        set((state) => {
          const isFav = state.favorites.includes(meditationId)
          return {
            favorites: isFav
              ? state.favorites.filter(id => id !== meditationId)
              : [...state.favorites, meditationId]
          }
        })
      },

      isFavorite: (meditationId) => {
        return get().favorites.includes(meditationId)
      },

      clearHistory: () => {
        set({
          sessions: [],
          favorites: [],
          stats: {
            totalSessions: 0,
            completedSessions: 0,
            totalMinutes: 0,
            currentStreak: 0,
            longestStreak: 0,
            averageSessionLength: 0,
            favoriteCategory: '',
            lastSessionDate: null
          }
        })
      },

      getSessionsByMeditation: (meditationId) => {
        return get().sessions.filter(s => s.meditationId === meditationId)
      },

      getRecentSessions: (limit = 10) => {
        return get().sessions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit)
      },

      getWeeklyStats: (weekOffset = 0) => {
        const sessions = get().sessions
        const today = new Date()
        
        // Get the start of the week (Sunday)
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7))
        startOfWeek.setHours(0, 0, 0, 0)
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)

        const dayStats: DayStats[] = DAYS.map((day, index) => {
          const dayStart = new Date(startOfWeek)
          dayStart.setDate(startOfWeek.getDate() + index)
          dayStart.setHours(0, 0, 0, 0)
          
          const dayEnd = new Date(dayStart)
          dayEnd.setHours(23, 59, 59, 999)

          const daySessions = sessions.filter(s => {
            const sessionDate = new Date(s.date)
            return sessionDate >= dayStart && sessionDate <= dayEnd
          })

          return {
            day,
            dayIndex: index,
            minutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
            sessions: daySessions.length
          }
        })

        const totalMinutes = dayStats.reduce((sum, d) => sum + d.minutes, 0)
        const totalSessions = dayStats.reduce((sum, d) => sum + d.sessions, 0)
        const bestDay = dayStats.reduce((best, d) => d.minutes > best.minutes ? d : best, dayStats[0])

        return {
          days: dayStats,
          totalMinutes,
          totalSessions,
          bestDay: bestDay.day,
          averagePerDay: Math.round(totalMinutes / 7)
        }
      },

      getMonthlyStats: (monthOffset = 0) => {
        const sessions = get().sessions
        const today = new Date()
        
        const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
        const monthStart = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1)
        const monthEnd = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59, 999)

        const monthSessions = sessions.filter(s => {
          const sessionDate = new Date(s.date)
          return sessionDate >= monthStart && sessionDate <= monthEnd
        })

        const totalMinutes = monthSessions.reduce((sum, s) => sum + s.duration, 0)
        const completedSessions = monthSessions.filter(s => s.completed).length
        const daysInMonth = monthEnd.getDate()
        
        // Get unique days with sessions
        const daysWithSessions = new Set(
          monthSessions.map(s => new Date(s.date).toISOString().split('T')[0])
        )

        // Calculate longest streak in this month
        const sortedDates = Array.from(daysWithSessions).sort()
        let longestStreak = 0
        let currentStreak = 0
        
        for (let i = 0; i < sortedDates.length; i++) {
          if (i === 0) {
            currentStreak = 1
          } else {
            const prevDate = new Date(sortedDates[i - 1])
            const currDate = new Date(sortedDates[i])
            const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
            
            if (diffDays === 1) {
              currentStreak++
            } else {
              longestStreak = Math.max(longestStreak, currentStreak)
              currentStreak = 1
            }
          }
        }
        longestStreak = Math.max(longestStreak, currentStreak)

        return {
          totalMinutes,
          totalSessions: monthSessions.length,
          completedSessions,
          averagePerDay: Math.round(totalMinutes / daysInMonth),
          daysMeditated: daysWithSessions.size,
          longestStreak
        }
      },

      getCategoryDistribution: () => {
        const sessions = get().sessions
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
        
        const categoryMap = new Map<string, { minutes: number; sessions: number }>()
        
        sessions.forEach(s => {
          const existing = categoryMap.get(s.category) || { minutes: 0, sessions: 0 }
          categoryMap.set(s.category, {
            minutes: existing.minutes + s.duration,
            sessions: existing.sessions + 1
          })
        })

        const distribution: CategoryDistribution[] = Array.from(categoryMap.entries())
          .map(([category, data]) => ({
            category,
            minutes: data.minutes,
            sessions: data.sessions,
            percentage: totalMinutes > 0 ? Math.round((data.minutes / totalMinutes) * 100) : 0
          }))
          .sort((a, b) => b.minutes - a.minutes)

        return distribution
      },

      getLongestStreak: () => {
        return get().stats.longestStreak
      },

      getAverageSessionLength: () => {
        const sessions = get().sessions
        if (sessions.length === 0) return 0
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
        return Math.round(totalMinutes / sessions.length)
      },

      getHeatmapData: (months = 12) => {
        const sessions = get().sessions
        const today = new Date()
        const heatmapData: HeatmapDay[][] = []
        
        // Create a map of date strings to session data
        const sessionMap = new Map<string, { minutes: number; sessions: number }>()
        sessions.forEach(s => {
          const dateStr = new Date(s.date).toISOString().split('T')[0]
          const existing = sessionMap.get(dateStr) || { minutes: 0, sessions: 0 }
          sessionMap.set(dateStr, {
            minutes: existing.minutes + s.duration,
            sessions: existing.sessions + 1
          })
        })

        // Find max minutes for intensity calculation
        let maxMinutes = 0
        sessionMap.forEach(data => {
          if (data.minutes > maxMinutes) maxMinutes = data.minutes
        })

        // Generate data for each month
        for (let m = months - 1; m >= 0; m--) {
          const monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1)
          const year = monthDate.getFullYear()
          const month = monthDate.getMonth()
          const daysInMonth = new Date(year, month + 1, 0).getDate()
          
          const monthData: HeatmapDay[] = []
          
          for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d)
            const dateStr = date.toISOString().split('T')[0]
            const data = sessionMap.get(dateStr) || { minutes: 0, sessions: 0 }
            
            // Calculate intensity level (0-4)
            let level: 0 | 1 | 2 | 3 | 4 = 0
            if (data.minutes > 0) {
              const intensity = maxMinutes > 0 ? data.minutes / maxMinutes : 0
              if (intensity <= 0.25) level = 1
              else if (intensity <= 0.5) level = 2
              else if (intensity <= 0.75) level = 3
              else level = 4
            }
            
            monthData.push({
              date: dateStr,
              minutes: data.minutes,
              sessions: data.sessions,
              level
            })
          }
          
          heatmapData.push(monthData)
        }
        
        return heatmapData
      },

      getSessionsByDate: (date: string) => {
        return get().sessions.filter(s => {
          const sessionDate = new Date(s.date).toISOString().split('T')[0]
          return sessionDate === date
        })
      },

      getLast30DaysProgress: () => {
        const sessions = get().sessions
        const today = new Date()
        const progress: { date: string; minutes: number; sessions: number }[] = []
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          
          const daySessions = sessions.filter(s => {
            const sessionDate = new Date(s.date).toISOString().split('T')[0]
            return sessionDate === dateStr
          })
          
          progress.push({
            date: dateStr,
            minutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
            sessions: daySessions.length
          })
        }
        
        return progress
      }
    }),
    {
      name: 'mystica-meditation-progress'
    }
  )
)

// Helper function to calculate stats
function calculateStats(sessions: MeditationSession[]): MeditationStats {
  const completedSessions = sessions.filter(s => s.completed)
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  
  // Calculate streak
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  
  // Get unique dates with sessions
  const sessionDates = [...new Set(sessions.map(s => 
    new Date(s.date).toISOString().split('T')[0]
  ))].sort().reverse()

  if (sessionDates.length > 0) {
    for (let i = 0; i < sessionDates.length; i++) {
      const sessionDate = new Date(sessionDates[i])
      sessionDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (sessionDate.getTime() === expectedDate.getTime()) {
        tempStreak++
        currentStreak = tempStreak
      } else if (i === 0 && sessionDate < expectedDate) {
        // First session date is before today, streak might be from past
        break
      }
    }
    
    // Calculate longest streak
    let streak = 1
    for (let i = 1; i < sessionDates.length; i++) {
      const prevDate = new Date(sessionDates[i - 1])
      const currDate = new Date(sessionDates[i])
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        streak++
      } else {
        longestStreak = Math.max(longestStreak, streak)
        streak = 1
      }
    }
    longestStreak = Math.max(longestStreak, streak, currentStreak)
  }

  // Find favorite category
  const categoryCount: Record<string, number> = {}
  sessions.forEach(s => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1
  })
  const favoriteCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || ''

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    totalMinutes,
    currentStreak,
    longestStreak,
    averageSessionLength: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
    favoriteCategory,
    lastSessionDate: sessions.length > 0 ? sessions[sessions.length - 1].date : null
  }
}
