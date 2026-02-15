'use client'

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'mystica-theme'

// Helper functions defined outside the component
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveThemeValue(themeValue: Theme): 'light' | 'dark' {
  if (themeValue === 'system') {
    return getSystemTheme()
  }
  return themeValue
}

function applyThemeToDocument(resolved: 'light' | 'dark') {
  const root = document.documentElement
  
  // Remove both classes first
  root.classList.remove('light', 'dark')
  
  // Add the resolved theme class
  root.classList.add(resolved)
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', resolved === 'dark' ? '#8b5cf6' : '#f8f7ff')
  }
}

// Store for external sync
let listeners: Array<() => void> = []
let currentTheme: Theme = 'system'

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  currentTheme = stored || 'system'
  return currentTheme
}

function getServerSnapshot(): Theme {
  return 'system'
}

function subscribeToTheme(callback: () => void) {
  listeners.push(callback)
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      currentTheme = (e.newValue as Theme) || 'system'
      listeners.forEach(l => l())
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  return () => {
    listeners = listeners.filter(l => l !== callback)
    window.removeEventListener('storage', handleStorageChange)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore to sync theme
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerSnapshot)
  const resolvedTheme = resolveThemeValue(theme)

  // Set theme and save to localStorage
  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    currentTheme = newTheme
    listeners.forEach(l => l())
    applyThemeToDocument(resolveThemeValue(newTheme))
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (currentTheme === 'system') {
        applyThemeToDocument(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme on initial render and when theme changes
  useEffect(() => {
    applyThemeToDocument(resolvedTheme)
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
