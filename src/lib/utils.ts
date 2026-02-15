import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export function getMoonPhase(date: Date = new Date()): { phase: string; illumination: number; emoji: string } {
  // Simplified moon phase calculation
  const lunarCycle = 29.53058867 // days
  const knownNewMoon = new Date('2000-01-06T18:14:00Z')
  
  const daysSinceNew = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const currentPhase = (daysSinceNew % lunarCycle + lunarCycle) % lunarCycle
  
  const illumination = Math.abs(Math.cos((currentPhase / lunarCycle) * 2 * Math.PI)) * 100
  
  if (currentPhase < 1.85) {
    return { phase: 'Luna Nueva', illumination: 0, emoji: '🌑' }
  } else if (currentPhase < 7.38) {
    return { phase: 'Luna Creciente', illumination: illumination, emoji: '🌒' }
  } else if (currentPhase < 9.23) {
    return { phase: 'Cuarto Creciente', illumination: 50, emoji: '🌓' }
  } else if (currentPhase < 14.77) {
    return { phase: 'Luna Gibosa Creciente', illumination: illumination, emoji: '🌔' }
  } else if (currentPhase < 16.61) {
    return { phase: 'Luna Llena', illumination: 100, emoji: '🌕' }
  } else if (currentPhase < 22.15) {
    return { phase: 'Luna Gibosa Menguante', illumination: illumination, emoji: '🌖' }
  } else if (currentPhase < 24.00) {
    return { phase: 'Cuarto Menguante', illumination: 50, emoji: '🌗' }
  } else {
    return { phase: 'Luna Menguante', illumination: illumination, emoji: '🌘' }
  }
}

export function getNextFullMoon(): Date {
  const lunarCycle = 29.53058867
  const knownFullMoon = new Date('2000-01-21T04:40:00Z')
  const now = new Date()
  
  const daysSinceFull = (now.getTime() - knownFullMoon.getTime()) / (1000 * 60 * 60 * 24)
  const cyclesSinceFull = Math.floor(daysSinceFull / lunarCycle)
  
  const nextFull = new Date(knownFullMoon.getTime() + (cyclesSinceFull + 1) * lunarCycle * 24 * 60 * 60 * 1000)
  
  return nextFull
}

export function getNextNewMoon(): Date {
  const lunarCycle = 29.53058867
  const knownNewMoon = new Date('2000-01-06T18:14:00Z')
  const now = new Date()
  
  const daysSinceNew = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
  const cyclesSinceNew = Math.floor(daysSinceNew / lunarCycle)
  
  const nextNew = new Date(knownNewMoon.getTime() + (cyclesSinceNew + 1) * lunarCycle * 24 * 60 * 60 * 1000)
  
  return nextNew
}
