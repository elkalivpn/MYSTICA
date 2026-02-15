'use client'

import { useCallback, useEffect, useRef } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { t as translate, Locale, isValidLocale, defaultLocale, availableLocales } from '@/lib/i18n'
import { useSettings } from './useSettings'

// ============================================
// TRANSLATION STORE
// ============================================

interface TranslationState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set) => ({
      locale: defaultLocale,

      setLocale: (locale) => {
        set({ locale })
      }
    }),
    {
      name: 'mystica-locale'
    }
  )
)

// ============================================
// USE TRANSLATION HOOK
// ============================================

interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: Locale
  changeLocale: (newLocale: Locale) => void
  availableLocales: typeof availableLocales
  defaultLocale: Locale
}

/**
 * Hook for handling translations in the application
 * @returns Translation utilities and current locale
 */
export function useTranslation(): UseTranslationReturn {
  const { locale: storeLocale, setLocale: storeSetLocale } = useTranslationStore()
  const { setLanguage } = useSettings()
  const isClientRef = useRef(false)

  // Sync with settings on mount - runs once when component mounts
  useEffect(() => {
    isClientRef.current = true
    
    const savedLanguage = localStorage.getItem('mystica-settings')
    if (savedLanguage) {
      try {
        const parsed = JSON.parse(savedLanguage)
        const language = parsed.state?.language
        if (language && isValidLocale(language) && language !== storeLocale) {
          storeSetLocale(language as Locale)
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, [storeLocale, storeSetLocale])

  /**
   * Translate a key to the current locale
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return translate(key, storeLocale, params)
    },
    [storeLocale]
  )

  /**
   * Change the current locale and persist it
   */
  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (!isValidLocale(newLocale)) {
        console.warn(`Invalid locale: ${newLocale}`)
        return
      }

      storeSetLocale(newLocale)
      setLanguage(newLocale)

      // Update localStorage directly for immediate persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('mystica-locale', JSON.stringify({ state: { locale: newLocale } }))
      }
    },
    [storeSetLocale, setLanguage]
  )

  return {
    t,
    locale: storeLocale,
    changeLocale,
    availableLocales,
    defaultLocale
  }
}

// Re-export types for convenience
export type { Locale } from '@/lib/i18n'
export { availableLocales, defaultLocale, isValidLocale } from '@/lib/i18n'
