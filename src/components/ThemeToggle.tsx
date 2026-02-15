'use client'

import { useTheme } from '@/components/ThemeProvider'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown'
  className?: string
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={cn('gap-2', className)}>
            {resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Oscuro' : 'Claro'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className={cn('gap-2', theme === 'light' && 'bg-accent')}
          >
            <Sun className="h-4 w-4" />
            <span>Claro</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className={cn('gap-2', theme === 'dark' && 'bg-accent')}
          >
            <Moon className="h-4 w-4" />
            <span>Oscuro</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className={cn('gap-2', theme === 'system' && 'bg-accent')}
          >
            <Monitor className="h-4 w-4" />
            <span>Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Simple icon toggle - cycles through light -> dark -> system
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={cn('relative', className)}
      title={`Tema actual: ${theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Oscuro' : 'Claro'}`}
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-transform hover:rotate-12" />
      )}
      {theme === 'system' && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-muted-foreground rounded-full" />
      )}
    </Button>
  )
}

// Compact theme selector for settings pages
interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Claro', icon: Sun, description: 'Tema claro' },
    { value: 'dark', label: 'Oscuro', icon: Moon, description: 'Tema oscuro' },
    { value: 'system', label: 'Sistema', icon: Monitor, description: 'Seguir preferencia del sistema' },
  ] as const

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {themes.map((t) => {
        const Icon = t.icon
        const isSelected = theme === t.value
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
              isSelected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            )}
          >
            <Icon className={cn('h-6 w-6', isSelected && 'text-primary')} />
            <span className={cn('text-sm font-medium', isSelected && 'text-primary')}>
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
