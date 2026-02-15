// ============================================
// MYSTICA - SISTEMA DE INTERNACIONALIZACION (i18n)
// ============================================

import esTranslations from '@/locales/es.json'
import enTranslations from '@/locales/en.json'

export type Locale = 'es' | 'en'

export interface Translations {
  [key: string]: string | Translations
}

const translations: Record<Locale, Translations> = {
  es: esTranslations,
  en: enTranslations
}

// Default locale
export const defaultLocale: Locale = 'es'

// Available locales with their display names
export const availableLocales: { code: Locale; name: string; flag: string }[] = [
  { code: 'es', name: 'Espanol', flag: 'ES' },
  { code: 'en', name: 'English', flag: 'EN' }
]

/**
 * Get a nested value from an object using dot notation
 * Example: getNestedValue(obj, 'navigation.home') returns obj.navigation.home
 */
function getNestedValue(obj: Translations, path: string): string | undefined {
  const keys = path.split('.')
  let current: Translations | string = obj

  for (const key of keys) {
    if (typeof current === 'string') {
      return undefined
    }
    if (current[key] === undefined) {
      return undefined
    }
    current = current[key] as Translations | string
  }

  return typeof current === 'string' ? current : undefined
}

/**
 * Translate a key to the current locale
 * @param key - The translation key (dot notation)
 * @param locale - The locale to use
 * @param params - Optional parameters for interpolation
 * @returns The translated string
 */
export function t(key: string, locale: Locale = defaultLocale, params?: Record<string, string | number>): string {
  const translation = getNestedValue(translations[locale], key)

  if (translation === undefined) {
    // Fallback to default locale
    const fallback = getNestedValue(translations[defaultLocale], key)
    if (fallback === undefined) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return interpolate(fallback, params)
  }

  return interpolate(translation, params)
}

/**
 * Interpolate parameters into a translation string
 * Example: interpolate('Hello {name}!', { name: 'World' }) returns 'Hello World!'
 */
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str

  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale === 'es' || locale === 'en'
}

/**
 * Get locale from browser or default
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale

  const browserLang = navigator.language.split('-')[0]
  return isValidLocale(browserLang) ? browserLang : defaultLocale
}
