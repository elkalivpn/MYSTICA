'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTranslation, availableLocales } from '@/hooks/useTranslation'
import type { Locale } from '@/lib/i18n'

// Flag emoji mapping
const localeFlags: Record<Locale, string> = {
  es: 'ES',
  en: 'EN'
}

// Display names for locales
const localeNames: Record<Locale, string> = {
  es: 'Espanol',
  en: 'English'
}

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'dropdown'
  className?: string
  onLanguageChange?: (locale: Locale) => void
}

export function LanguageSelector({
  variant = 'default',
  className,
  onLanguageChange
}: LanguageSelectorProps) {
  const { locale, changeLocale, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    changeLocale(newLocale)
    onLanguageChange?.(newLocale)
    setIsOpen(false)
  }

  // Compact variant - just shows the current locale flag
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-2 px-2', className)}
          >
            <span className="text-sm font-medium">{localeFlags[locale]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-mystica-dark-100 border-mystica-purple-800/30">
          {availableLocales.map((loc) => (
            <DropdownMenuItem
              key={loc.code}
              onClick={() => handleLocaleChange(loc.code)}
              className={cn(
                'cursor-pointer flex items-center gap-3',
                locale === loc.code && 'bg-mystica-purple-900/30'
              )}
            >
              <span className="w-6 text-center font-medium">{localeFlags[loc.code]}</span>
              <span>{localeNames[loc.code]}</span>
              {locale === loc.code && (
                <Check className="ml-auto h-4 w-4 text-mystica-purple-400" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Dropdown variant - shows globe icon with dropdown
  if (variant === 'dropdown') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2 border-mystica-purple-700/30', className)}
          >
            <Globe className="h-4 w-4" />
            <span>{localeNames[locale]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-mystica-dark-100 border-mystica-purple-800/30">
          {availableLocales.map((loc) => (
            <DropdownMenuItem
              key={loc.code}
              onClick={() => handleLocaleChange(loc.code)}
              className={cn(
                'cursor-pointer flex items-center gap-3',
                locale === loc.code && 'bg-mystica-purple-900/30'
              )}
            >
              <span className="w-6 text-center font-medium">{localeFlags[loc.code]}</span>
              <span>{localeNames[loc.code]}</span>
              {locale === loc.code && (
                <Check className="ml-auto h-4 w-4 text-mystica-purple-400" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default variant - full buttons
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-white font-medium flex items-center gap-2">
        <Globe className="w-5 h-5 text-indigo-400" />
        {t('settings.language.title')}
      </p>
      <p className="text-sm text-gray-400 mb-2">
        {t('settings.language.description')}
      </p>
      <div className="flex gap-2">
        {availableLocales.map((loc) => (
          <motion.div
            key={loc.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={locale === loc.code ? 'default' : 'outline'}
              onClick={() => handleLocaleChange(loc.code)}
              className={cn(
                'flex-1 gap-2',
                locale === loc.code
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                  : 'border-mystica-purple-700/30 text-gray-300 hover:text-white hover:bg-mystica-purple-900/30'
              )}
            >
              <span className="font-medium">{localeFlags[loc.code]}</span>
              <span>{localeNames[loc.code]}</span>
              {locale === loc.code && <Check className="h-4 w-4 ml-1" />}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default LanguageSelector
