'use client'

import { MeditationReminder } from '@/hooks/useReminders'

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  actions?: NotificationAction[]
  data?: Record<string, unknown>
  timestamp?: number
}

export interface QueuedNotification {
  id: string
  reminderId: string
  scheduledTime: Date
  options: NotificationOptions
  status: 'pending' | 'sent' | 'cancelled' | 'snoozed'
  createdAt: Date
  sentAt?: Date
  snoozedUntil?: Date
  actionTaken?: string
}

export interface NotificationHistoryEntry {
  id: string
  reminderId: string
  reminderName?: string
  title: string
  body: string
  sentAt: Date
  actionTaken?: 'meditate' | 'snooze' | 'dismiss'
  wasSnoozed?: boolean
  originalScheduledTime?: Date
}

export interface DoNotDisturbConfig {
  enabled: boolean
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  allowUrgent?: boolean
}

export interface NotificationSettings {
  soundEnabled: boolean
  vibrationEnabled: boolean
  doNotDisturb: DoNotDisturbConfig
  showPreview: boolean
}

class NotificationService {
  private static instance: NotificationService
  private notificationQueue: Map<string, QueuedNotification> = new Map()
  private scheduledTimeouts: Map<string, NodeJS.Timeout> = new Map()
  private history: NotificationHistoryEntry[] = []
  private settings: NotificationSettings = {
    soundEnabled: true,
    vibrationEnabled: true,
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      allowUrgent: false
    },
    showPreview: true
  }
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map()

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage()
      this.registerServiceWorker()
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Service Worker Registration
  private async registerServiceWorker(): Promise<void> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered for notifications')

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data)
      })
    } catch (error) {
      console.log('Service Worker registration failed:', error)
    }
  }

  private handleServiceWorkerMessage(data: { type: string; payload?: unknown }): void {
    switch (data.type) {
      case 'NOTIFICATION_CLICKED':
        this.emit('notificationClicked', data.payload)
        break
      case 'NOTIFICATION_ACTION':
        this.emit('notificationAction', data.payload)
        break
      case 'NOTIFICATION_CLOSED':
        this.emit('notificationClosed', data.payload)
        break
    }
  }

  // Event System
  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private emit(event: string, data?: unknown): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  // Permission Management
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    return await Notification.requestPermission()
  }

  async requestPersistentPermission(): Promise<{ granted: boolean; persistent: boolean }> {
    const permission = await this.requestPermission()

    if (permission !== 'granted') {
      return { granted: false, persistent: false }
    }

    // Check if we can get persistent notifications via Service Worker
    let persistent = false
    if (this.serviceWorkerRegistration && 'persistentStorage' in navigator) {
      try {
        // Request persistent storage for better reliability
        const storage = navigator.storage as StorageManager & { persist: () => Promise<boolean> }
        if (storage.persist) {
          persistent = await storage.persist()
        }
      } catch {
        // Not all browsers support persistent storage
      }
    }

    return { granted: true, persistent }
  }

  checkPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }

  // Notification Queue Management
  addToQueue(reminder: MeditationReminder): string {
    const notificationId = `notif-${reminder.id}-${Date.now()}`

    const notification: QueuedNotification = {
      id: notificationId,
      reminderId: reminder.id,
      scheduledTime: this.getNextOccurrence(reminder),
      options: {
        title: 'Hora de Meditar',
        body: reminder.message,
        tag: reminder.id,
        requireInteraction: true,
        silent: !this.settings.soundEnabled,
        actions: [
          { action: 'meditate', title: 'Meditar ahora', icon: '/icons/meditate.png' },
          { action: 'snooze', title: 'Posponer 5 min', icon: '/icons/snooze.png' }
        ],
        data: {
          reminderId: reminder.id,
          meditationId: reminder.meditationId,
          meditationName: reminder.meditationName
        }
      },
      status: 'pending',
      createdAt: new Date()
    }

    this.notificationQueue.set(notificationId, notification)
    this.saveToStorage()

    return notificationId
  }

  removeFromQueue(notificationId: string): void {
    const timeout = this.scheduledTimeouts.get(notificationId)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledTimeouts.delete(notificationId)
    }

    const notification = this.notificationQueue.get(notificationId)
    if (notification) {
      notification.status = 'cancelled'
      this.notificationQueue.delete(notificationId)
      this.saveToStorage()
    }
  }

  clearQueue(): void {
    this.scheduledTimeouts.forEach(timeout => clearTimeout(timeout))
    this.scheduledTimeouts.clear()
    this.notificationQueue.clear()
    this.saveToStorage()
  }

  getQueue(): QueuedNotification[] {
    return Array.from(this.notificationQueue.values())
      .filter(n => n.status === 'pending')
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
  }

  // Notification Sending
  async sendNotification(options: NotificationOptions): Promise<Notification | null> {
    if (this.checkPermission() !== 'granted') {
      return null
    }

    // Check Do Not Disturb
    if (this.isDoNotDisturbActive()) {
      console.log('Notification suppressed due to Do Not Disturb')
      return null
    }

    try {
      // Try Service Worker first for better notification support
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/notification-icon.png',
          badge: options.badge || '/icons/badge-icon.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
          actions: options.actions,
          data: options.data
        })
        return null // SW notifications don't return a Notification object
      }

      // Fallback to regular Notification API
      return new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/notification-icon.png',
        badge: options.badge || '/icons/badge-icon.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        silent: options.silent
      })
    } catch (error) {
      console.error('Failed to send notification:', error)
      return null
    }
  }

  // Scheduling
  scheduleNotification(reminder: MeditationReminder): () => void {
    const nextTime = this.getNextOccurrence(reminder)
    const now = new Date()
    const delay = nextTime.getTime() - now.getTime()

    if (delay <= 0) {
      return () => {}
    }

    const notificationId = this.addToQueue(reminder)

    const timeoutId = setTimeout(async () => {
      const dayOfWeek = nextTime.getDay()
      if (reminder.days.includes(dayOfWeek) && reminder.enabled) {
        await this.sendNotification({
          title: 'Hora de Meditar',
          body: reminder.message,
          tag: reminder.id,
          requireInteraction: true,
          silent: !this.settings.soundEnabled,
          actions: [
            { action: 'meditate', title: 'Meditar ahora' },
            { action: 'snooze', title: 'Posponer 5 min' }
          ],
          data: { reminderId: reminder.id }
        })

        this.addToHistory({
          id: `history-${Date.now()}`,
          reminderId: reminder.id,
          reminderName: reminder.meditationName,
          title: 'Hora de Meditar',
          body: reminder.message,
          sentAt: new Date(),
          originalScheduledTime: nextTime
        })

        // Mark as sent
        const notification = this.notificationQueue.get(notificationId)
        if (notification) {
          notification.status = 'sent'
          notification.sentAt = new Date()
          this.saveToStorage()
        }
      }

      // Reschedule for next occurrence (recursive)
      this.scheduleNotification(reminder)
    }, delay)

    this.scheduledTimeouts.set(notificationId, timeoutId)

    // Return cancel function
    return () => this.removeFromQueue(notificationId)
  }

  // Repeating Notifications with setTimeout recursive
  scheduleRepeatingNotification(
    reminder: MeditationReminder,
    intervalMinutes: number = 1
  ): () => void {
    const scheduleNext = () => {
      const now = new Date()
      const nextTime = this.getNextOccurrence(reminder)
      const delay = nextTime.getTime() - now.getTime()

      if (delay <= 0) {
        // Time has passed, schedule for next valid day
        setTimeout(scheduleNext, 60000) // Check again in 1 minute
        return
      }

      const timeoutId = setTimeout(async () => {
        const dayOfWeek = nextTime.getDay()
        if (reminder.days.includes(dayOfWeek) && reminder.enabled) {
          await this.sendNotification({
            title: 'Hora de Meditar',
            body: reminder.message,
            tag: reminder.id,
            requireInteraction: true,
            silent: !this.settings.soundEnabled,
            actions: [
              { action: 'meditate', title: 'Meditar ahora' },
              { action: 'snooze', title: 'Posponer 5 min' }
            ],
            data: { reminderId: reminder.id }
          })

          this.addToHistory({
            id: `history-${Date.now()}`,
            reminderId: reminder.id,
            reminderName: reminder.meditationName,
            title: 'Hora de Meditar',
            body: reminder.message,
            sentAt: new Date(),
            originalScheduledTime: nextTime
          })
        }

        // Recursive scheduling
        scheduleNext()
      }, delay)

      this.scheduledTimeouts.set(`repeat-${reminder.id}`, timeoutId)
    }

    scheduleNext()

    // Return cancel function
    return () => {
      const timeoutId = this.scheduledTimeouts.get(`repeat-${reminder.id}`)
      if (timeoutId) {
        clearTimeout(timeoutId)
        this.scheduledTimeouts.delete(`repeat-${reminder.id}`)
      }
    }
  }

  // Snooze functionality
  async snoozeReminder(reminderId: string, minutes: number): Promise<void> {
    const reminder = this.getReminderById(reminderId)
    if (!reminder) return

    const snoozeTime = new Date(Date.now() + minutes * 60000)

    // Add snoozed notification to queue
    const notificationId = `snooze-${reminderId}-${Date.now()}`
    const notification: QueuedNotification = {
      id: notificationId,
      reminderId,
      scheduledTime: snoozeTime,
      options: {
        title: 'Recordatorio pospuesto',
        body: reminder.message,
        tag: `snooze-${reminderId}`,
        requireInteraction: true,
        silent: !this.settings.soundEnabled,
        actions: [
          { action: 'meditate', title: 'Meditar ahora' },
          { action: 'snooze', title: 'Posponer mas' }
        ],
        data: { reminderId, wasSnoozed: true }
      },
      status: 'pending',
      createdAt: new Date(),
      snoozedUntil: snoozeTime
    }

    this.notificationQueue.set(notificationId, notification)
    this.saveToStorage()

    // Schedule the snoozed notification
    const delay = minutes * 60000
    const timeoutId = setTimeout(async () => {
      await this.sendNotification(notification.options)

      this.addToHistory({
        id: `history-${Date.now()}`,
        reminderId,
        reminderName: reminder.meditationName,
        title: 'Recordatorio pospuesto',
        body: reminder.message,
        sentAt: new Date(),
        wasSnoozed: true,
        originalScheduledTime: snoozeTime
      })

      notification.status = 'sent'
      notification.sentAt = new Date()
      this.saveToStorage()
    }, delay)

    this.scheduledTimeouts.set(notificationId, timeoutId)
  }

  // History Management
  addToHistory(entry: Omit<NotificationHistoryEntry, 'id' | 'sentAt'> & { id?: string; sentAt?: Date }): void {
    const historyEntry: NotificationHistoryEntry = {
      id: entry.id || `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reminderId: entry.reminderId,
      reminderName: entry.reminderName,
      title: entry.title,
      body: entry.body,
      sentAt: entry.sentAt || new Date(),
      actionTaken: entry.actionTaken,
      wasSnoozed: entry.wasSnoozed,
      originalScheduledTime: entry.originalScheduledTime
    }

    this.history.unshift(historyEntry)

    // Keep only last 100 entries
    if (this.history.length > 100) {
      this.history = this.history.slice(0, 100)
    }

    this.saveToStorage()
  }

  getHistory(): NotificationHistoryEntry[] {
    return this.history
  }

  getHistoryByReminder(reminderId: string): NotificationHistoryEntry[] {
    return this.history.filter(h => h.reminderId === reminderId)
  }

  clearHistory(): void {
    this.history = []
    this.saveToStorage()
  }

  // Statistics
  getComplianceStats(): {
    total: number
    meditated: number
    snoozed: number
    dismissed: number
    complianceRate: number
  } {
    const total = this.history.length
    const meditated = this.history.filter(h => h.actionTaken === 'meditate').length
    const snoozed = this.history.filter(h => h.actionTaken === 'snooze').length
    const dismissed = this.history.filter(h => h.actionTaken === 'dismiss').length

    return {
      total,
      meditated,
      snoozed,
      dismissed,
      complianceRate: total > 0 ? (meditated / total) * 100 : 0
    }
  }

  getWeeklyStats(): Array<{ date: string; sent: number; actioned: number }> {
    const stats: Map<string, { sent: number; actioned: number }> = new Map()
    const today = new Date()

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      stats.set(dateKey, { sent: 0, actioned: 0 })
    }

    // Count notifications per day
    this.history.forEach(entry => {
      const dateKey = entry.sentAt.toISOString().split('T')[0]
      const stat = stats.get(dateKey)
      if (stat) {
        stat.sent++
        if (entry.actionTaken === 'meditate') {
          stat.actioned++
        }
      }
    })

    return Array.from(stats.entries()).map(([date, data]) => ({
      date,
      sent: data.sent,
      actioned: data.actioned
    }))
  }

  // Settings Management
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    this.saveToStorage()
  }

  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  setDoNotDisturb(config: Partial<DoNotDisturbConfig>): void {
    this.settings.doNotDisturb = { ...this.settings.doNotDisturb, ...config }
    this.saveToStorage()
  }

  isDoNotDisturbActive(): boolean {
    if (!this.settings.doNotDisturb.enabled) {
      return false
    }

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const { startTime, endTime } = this.settings.doNotDisturb

    // Handle overnight range (e.g., 22:00 to 07:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime
    }

    return currentTime >= startTime && currentTime < endTime
  }

  // Preview
  async sendPreviewNotification(): Promise<void> {
    await this.sendNotification({
      title: 'Vista previa de notificacion',
      body: 'Asi apareceran tus recordatorios de meditacion',
      tag: 'preview',
      requireInteraction: false,
      silent: !this.settings.soundEnabled,
      actions: [
        { action: 'meditate', title: 'Meditar ahora' },
        { action: 'snooze', title: 'Posponer' }
      ]
    })
  }

  // Helper Methods
  private getNextOccurrence(reminder: MeditationReminder): Date {
    const now = new Date()
    const [hours, minutes] = reminder.time.split(':').map(Number)

    const next = new Date()
    next.setHours(hours, minutes, 0, 0)

    // If time has passed today, start from tomorrow
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }

    // Find next valid day
    let attempts = 0
    while (!reminder.days.includes(next.getDay()) && attempts < 7) {
      next.setDate(next.getDate() + 1)
      attempts++
    }

    return next
  }

  private getReminderById(reminderId: string): MeditationReminder | null {
    // This will be populated from the hook
    const reminders = this.getRemindersFromStorage()
    return reminders.find(r => r.id === reminderId) || null
  }

  private getRemindersFromStorage(): MeditationReminder[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem('mystica-meditation-reminders')
      if (stored) {
        const data = JSON.parse(stored)
        return data.state?.reminders || []
      }
    } catch {
      // Ignore parsing errors
    }
    return []
  }

  // Storage
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('mystica-notification-service')
      if (stored) {
        const data = JSON.parse(stored)
        this.history = (data.history || []).map((h: NotificationHistoryEntry) => ({
          ...h,
          sentAt: new Date(h.sentAt),
          originalScheduledTime: h.originalScheduledTime ? new Date(h.originalScheduledTime) : undefined
        }))
        this.settings = { ...this.settings, ...data.settings }
      }
    } catch {
      // Ignore parsing errors
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const data = {
        history: this.history,
        settings: this.settings,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('mystica-notification-service', JSON.stringify(data))
    } catch {
      // Ignore storage errors
    }
  }

  // Cleanup
  destroy(): void {
    this.scheduledTimeouts.forEach(timeout => clearTimeout(timeout))
    this.scheduledTimeouts.clear()
    this.notificationQueue.clear()
    this.listeners.clear()
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()

// Export class for testing
export { NotificationService }

// Utility functions
export function formatTimeForDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function getDayName(dayIndex: number, short: boolean = true): string {
  const days = short
    ? ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    : ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  return days[dayIndex] || ''
}

export function getTimeUntilNext(time: string, days: number[]): string {
  const now = new Date()
  const [hours, minutes] = time.split(':').map(Number)

  const next = new Date()
  next.setHours(hours, minutes, 0, 0)

  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }

  let attempts = 0
  while (!days.includes(next.getDay()) && attempts < 7) {
    next.setDate(next.getDate() + 1)
    attempts++
  }

  const diffMs = next.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours > 24) {
    const diffDays = Math.floor(diffHours / 24)
    return `en ${diffDays} dias`
  }

  if (diffHours > 0) {
    return `en ${diffHours}h ${diffMinutes}m`
  }

  return `en ${diffMinutes} minutos`
}
