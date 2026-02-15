'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  notificationService,
  NotificationHistoryEntry,
  NotificationSettings,
  DoNotDisturbConfig,
  QueuedNotification
} from '@/lib/notificationService'

export interface MeditationReminder {
  id: string
  time: string // HH:MM format
  days: number[] // 0 = Sunday, 1 = Monday, etc.
  enabled: boolean
  meditationId?: number // Specific meditation to suggest
  meditationName?: string
  message: string
  createdAt?: string
  lastTriggeredAt?: string
  snoozeCount?: number
  totalTriggered?: number
}

export interface MeditationAchievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  type: 'sessions' | 'minutes' | 'streak' | 'category' | 'variety'
  unlockedAt?: string
}

export const meditationAchievements: MeditationAchievement[] = [
  // Sessions
  { id: 'first-session', name: 'Primer Respirar', description: 'Completa tu primera meditacion', icon: '🌬️', requirement: 1, type: 'sessions' },
  { id: 'sessions-5', name: 'Explorador Interior', description: 'Completa 5 meditaciones', icon: '🧭', requirement: 5, type: 'sessions' },
  { id: 'sessions-10', name: 'Buscador Sereno', description: 'Completa 10 meditaciones', icon: '🔍', requirement: 10, type: 'sessions' },
  { id: 'sessions-25', name: 'Practicante Dedicado', description: 'Completa 25 meditaciones', icon: '🙏', requirement: 25, type: 'sessions' },
  { id: 'sessions-50', name: 'Maestro de la Calma', description: 'Completa 50 meditaciones', icon: '🧘', requirement: 50, type: 'sessions' },
  { id: 'sessions-100', name: 'Iluminado', description: 'Completa 100 meditaciones', icon: '✨', requirement: 100, type: 'sessions' },

  // Minutes
  { id: 'minutes-30', name: 'Media Hora de Paz', description: 'Acumula 30 minutos meditando', icon: '⏰', requirement: 30, type: 'minutes' },
  { id: 'minutes-60', name: 'Hora Sagrada', description: 'Acumula 1 hora meditando', icon: '⌛', requirement: 60, type: 'minutes' },
  { id: 'minutes-180', name: 'Medio Dia Zen', description: 'Acumula 3 horas meditando', icon: '☀️', requirement: 180, type: 'minutes' },
  { id: 'minutes-360', name: 'Jornada Interior', description: 'Acumula 6 horas meditando', icon: '🌅', requirement: 360, type: 'minutes' },
  { id: 'minutes-1000', name: 'Maestro del Tiempo', description: 'Acumula 1000 minutos meditando', icon: '⭐', requirement: 1000, type: 'minutes' },

  // Streak
  { id: 'streak-3', name: 'En el Camino', description: 'Medita 3 dias seguidos', icon: '🔥', requirement: 3, type: 'streak' },
  { id: 'streak-7', name: 'Semana Mistica', description: 'Medita 7 dias seguidos', icon: '🌙', requirement: 7, type: 'streak' },
  { id: 'streak-14', name: 'Dos Semanas de Luz', description: 'Medita 14 dias seguidos', icon: '💫', requirement: 14, type: 'streak' },
  { id: 'streak-30', name: 'Mes de Armonia', description: 'Medita 30 dias seguidos', icon: '🌟', requirement: 30, type: 'streak' },
  { id: 'streak-60', name: 'Disciplina Espiritual', description: 'Medita 60 dias seguidos', icon: '💎', requirement: 60, type: 'streak' },
  { id: 'streak-100', name: 'Centuria de Paz', description: 'Medita 100 dias seguidos', icon: '👑', requirement: 100, type: 'streak' },

  // Variety
  { id: 'variety-5', name: 'Mente Abierta', description: 'Prueba 5 meditaciones diferentes', icon: '🌈', requirement: 5, type: 'variety' },
  { id: 'variety-10', name: 'Explorador de Tecnicas', description: 'Prueba 10 meditaciones diferentes', icon: '🎭', requirement: 10, type: 'variety' },
  { id: 'variety-20', name: 'Coleccionista de Paz', description: 'Prueba 20 meditaciones diferentes', icon: '🎨', requirement: 20, type: 'variety' },
]

// Type for scheduled notifications
type ScheduledNotification = {
  reminderId: string
  cancelFn: () => void
}

interface ReminderState {
  reminders: MeditationReminder[]
  notificationsEnabled: boolean
  unlockedAchievements: string[]
  notificationHistory: NotificationHistoryEntry[]
  scheduledNotifications: Map<string, ScheduledNotification>
  persistentPermission: boolean
  notificationSettings: NotificationSettings

  // Actions
  addReminder: (reminder: Omit<MeditationReminder, 'id'>) => void
  updateReminder: (id: string, updates: Partial<MeditationReminder>) => void
  deleteReminder: (id: string) => void
  toggleReminder: (id: string) => void
  enableNotifications: () => Promise<boolean>
  disableNotifications: () => void
  checkAndUnlockAchievements: (stats: {
    totalSessions: number
    totalMinutes: number
    currentStreak: number
    uniqueMeditations: number
  }) => MeditationAchievement[]
  isAchievementUnlocked: (id: string) => boolean
  getUnlockedAchievements: () => MeditationAchievement[]

  // New notification features
  requestPersistentPermission: () => Promise<{ granted: boolean; persistent: boolean }>
  scheduleRepeatingNotification: (reminder: MeditationReminder) => () => void
  snoozeReminder: (reminderId: string, minutes: number) => Promise<void>
  getNotificationHistory: () => NotificationHistoryEntry[]
  clearNotificationHistory: () => void
  getNotificationSettings: () => NotificationSettings
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  setDoNotDisturb: (config: Partial<DoNotDisturbConfig>) => void
  sendPreviewNotification: () => Promise<void>
  getNotificationQueue: () => QueuedNotification[]
  getComplianceStats: () => {
    total: number
    meditated: number
    snoozed: number
    dismissed: number
    complianceRate: number
  }
  getWeeklyStats: () => Array<{ date: string; sent: number; actioned: number }>
}

export const useReminders = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      notificationsEnabled: false,
      unlockedAchievements: [],
      notificationHistory: [],
      scheduledNotifications: new Map(),
      persistentPermission: false,
      notificationSettings: {
        soundEnabled: true,
        vibrationEnabled: true,
        doNotDisturb: {
          enabled: false,
          startTime: '22:00',
          endTime: '07:00',
          allowUrgent: false
        },
        showPreview: true
      },

      addReminder: (reminder) => {
        const newReminder: MeditationReminder = {
          ...reminder,
          id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          snoozeCount: 0,
          totalTriggered: 0
        }
        set((state) => ({
          reminders: [...state.reminders, newReminder]
        }))

        // Schedule the notification if enabled
        if (get().notificationsEnabled && newReminder.enabled) {
          get().scheduleRepeatingNotification(newReminder)
        }
      },

      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          )
        }))

        // Reschedule if time or days changed
        if (updates.time || updates.days || updates.enabled !== undefined) {
          const reminder = get().reminders.find(r => r.id === id)
          if (reminder && get().notificationsEnabled) {
            // Cancel existing
            const scheduled = get().scheduledNotifications.get(id)
            if (scheduled) {
              scheduled.cancelFn()
            }
            // Reschedule if enabled
            if (reminder.enabled) {
              get().scheduleRepeatingNotification(reminder)
            }
          }
        }
      },

      deleteReminder: (id) => {
        // Cancel scheduled notification
        const scheduled = get().scheduledNotifications.get(id)
        if (scheduled) {
          scheduled.cancelFn()
        }

        set((state) => {
          const newScheduled = new Map(state.scheduledNotifications)
          newScheduled.delete(id)
          return {
            reminders: state.reminders.filter((r) => r.id !== id),
            scheduledNotifications: newScheduled
          }
        })
      },

      toggleReminder: (id) => {
        const reminder = get().reminders.find(r => r.id === id)
        if (!reminder) return

        const newEnabled = !reminder.enabled

        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, enabled: newEnabled } : r
          )
        }))

        // Handle scheduling
        if (get().notificationsEnabled) {
          if (newEnabled) {
            get().scheduleRepeatingNotification({ ...reminder, enabled: true })
          } else {
            const scheduled = get().scheduledNotifications.get(id)
            if (scheduled) {
              scheduled.cancelFn()
            }
          }
        }
      },

      enableNotifications: async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
          return false
        }

        try {
          const permission = await notificationService.requestPermission()
          if (permission === 'granted') {
            set({ notificationsEnabled: true })

            // Schedule all enabled reminders
            get().reminders.forEach(reminder => {
              if (reminder.enabled) {
                get().scheduleRepeatingNotification(reminder)
              }
            })

            return true
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error)
        }
        return false
      },

      disableNotifications: () => {
        // Cancel all scheduled notifications
        get().scheduledNotifications.forEach(scheduled => {
          scheduled.cancelFn()
        })

        set({
          notificationsEnabled: false,
          scheduledNotifications: new Map()
        })
      },

      checkAndUnlockAchievements: (stats) => {
        const state = get()
        const newAchievements: MeditationAchievement[] = []

        for (const achievement of meditationAchievements) {
          if (state.unlockedAchievements.includes(achievement.id)) continue

          let shouldUnlock = false
          switch (achievement.type) {
            case 'sessions':
              shouldUnlock = stats.totalSessions >= achievement.requirement
              break
            case 'minutes':
              shouldUnlock = stats.totalMinutes >= achievement.requirement
              break
            case 'streak':
              shouldUnlock = stats.currentStreak >= achievement.requirement
              break
            case 'variety':
              shouldUnlock = stats.uniqueMeditations >= achievement.requirement
              break
          }

          if (shouldUnlock) {
            newAchievements.push({
              ...achievement,
              unlockedAt: new Date().toISOString()
            })
          }
        }

        if (newAchievements.length > 0) {
          set((state) => ({
            unlockedAchievements: [
              ...state.unlockedAchievements,
              ...newAchievements.map(a => a.id)
            ]
          }))
        }

        return newAchievements
      },

      isAchievementUnlocked: (id) => {
        return get().unlockedAchievements.includes(id)
      },

      getUnlockedAchievements: () => {
        const state = get()
        return meditationAchievements
          .filter(a => state.unlockedAchievements.includes(a.id))
          .map(a => ({
            ...a,
            unlockedAt: state.unlockedAchievements.includes(a.id)
              ? new Date().toISOString()
              : undefined
          }))
      },

      // New notification features

      requestPersistentPermission: async () => {
        const result = await notificationService.requestPersistentPermission()
        set({ persistentPermission: result.persistent })
        return result
      },

      scheduleRepeatingNotification: (reminder: MeditationReminder) => {
        // Cancel existing if any
        const existing = get().scheduledNotifications.get(reminder.id)
        if (existing) {
          existing.cancelFn()
        }

        // Schedule new notification using the service
        const cancelFn = notificationService.scheduleRepeatingNotification(reminder, 1)

        // Store the cancel function
        set((state) => {
          const newScheduled = new Map(state.scheduledNotifications)
          newScheduled.set(reminder.id, { reminderId: reminder.id, cancelFn })
          return { scheduledNotifications: newScheduled }
        })

        return cancelFn
      },

      snoozeReminder: async (reminderId: string, minutes: number) => {
        const reminder = get().reminders.find(r => r.id === reminderId)
        if (!reminder) return

        await notificationService.snoozeReminder(reminderId, minutes)

        // Update snooze count
        set((state) => ({
          reminders: state.reminders.map(r =>
            r.id === reminderId
              ? { ...r, snoozeCount: (r.snoozeCount || 0) + 1 }
              : r
          )
        }))
      },

      getNotificationHistory: () => {
        return notificationService.getHistory()
      },

      clearNotificationHistory: () => {
        notificationService.clearHistory()
        set({ notificationHistory: [] })
      },

      getNotificationSettings: () => {
        return notificationService.getSettings()
      },

      updateNotificationSettings: (settings: Partial<NotificationSettings>) => {
        notificationService.updateSettings(settings)
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings }
        }))
      },

      setDoNotDisturb: (config: Partial<DoNotDisturbConfig>) => {
        notificationService.setDoNotDisturb(config)
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            doNotDisturb: { ...state.notificationSettings.doNotDisturb, ...config }
          }
        }))
      },

      sendPreviewNotification: async () => {
        await notificationService.sendPreviewNotification()
      },

      getNotificationQueue: () => {
        return notificationService.getQueue()
      },

      getComplianceStats: () => {
        return notificationService.getComplianceStats()
      },

      getWeeklyStats: () => {
        return notificationService.getWeeklyStats()
      }
    }),
    {
      name: 'mystica-meditation-reminders'
    }
  )
)

// Utility function to schedule notifications (called from components)
export function scheduleNotification(reminder: MeditationReminder) {
  if (typeof window === 'undefined' || !('Notification' in window)) return

  if (Notification.permission === 'granted' && reminder.enabled) {
    notificationService.scheduleNotification(reminder)
  }
}

// Re-export notification service utilities
export {
  formatTimeForDisplay,
  getDayName,
  getTimeUntilNext
} from '@/lib/notificationService'

// Export types
export type { NotificationHistoryEntry, NotificationSettings, DoNotDisturbConfig, QueuedNotification }
