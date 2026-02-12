'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Moon, Sun, Star, User, Settings, LogOut, Crown, Shield, Flame,
  Sparkles, Heart, Users, Calendar, ChevronDown, BookOpen, Hash, Gem, Headphones
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem { name: string; href: string; icon: React.ElementType; submenu?: NavItem[]; premium?: boolean; new?: boolean }

const navigation: NavItem[] = [
  { name: 'Inicio', href: '/', icon: Moon },
  { name: 'Tarot', href: '/cartas', icon: Sparkles },
  { name: 'Oráculo', href: '/oraculo', icon: Sun },
  { name: 'Runas', href: '/runas', icon: Star },
  { name: 'Luna', href: '/calendario-lunar', icon: Moon },
  { name: 'Horóscopo', href: '/horoscopo', icon: Calendar, premium: true },
  { name: 'Compatibilidad', href: '/compatibilidad', icon: Heart },
]

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAdmin, isPremium } = useAuth()
  const { currentStreak } = useStreak()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false)
  }, [pathname])

  const getRoleBadge = () => {
    if (isAdmin) return { icon: Shield, color: 'text-red-500', bg: 'bg-red-500/20', label: 'Admin' }
    if (isPremium) return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Premium' }
    return null
  }
  const roleBadge = getRoleBadge()
  const isActiveLink = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="fixed top-0 z-50 w-full bg-mystica-dark-200/95 backdrop-blur-lg border-b border-mystica-purple-800/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 rounded-full blur-xl opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 rounded-full flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-mystica-purple-400 to-mystica-gold-400 bg-clip-text text-transparent">Mystica</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              return (
                <Link key={item.name} href={item.href}
                  className={cn("flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive ? "bg-mystica-purple-900/50 text-mystica-purple-300" : "text-gray-300 hover:bg-mystica-purple-900/30 hover:text-white"
                  )}>
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.premium && <Crown className="w-3 h-3 text-yellow-500 ml-1" />}
                </Link>
              )
            })}
            {isAdmin && (
              <Link href="/admin" className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {currentStreak > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">{currentStreak}</span>
              </div>
            )}
            {user && roleBadge && (
              <div className={cn("hidden md:flex items-center gap-1 px-2 py-1 rounded-full", roleBadge.bg)}>
                <roleBadge.icon className={cn("w-3 h-3", roleBadge.color)} />
                <span className={cn("text-xs font-medium", roleBadge.color)}>{roleBadge.label}</span>
              </div>
            )}
            {!isPremium && !isAdmin && (
              <Link href="/premium" className="hidden sm:block">
                <Button size="sm" variant="premium" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />Premium
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="w-5 h-5" />
                  {roleBadge && <div className="absolute -top-1 -right-1"><roleBadge.icon className={cn("w-3 h-3", roleBadge.color)} /></div>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-mystica-dark-100 border-mystica-purple-800/30">
                <DropdownMenuLabel className="text-mystica-purple-300">{user?.name || 'Mi Cuenta'}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-mystica-purple-800/30" />
                {!isPremium && !isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/premium" className="text-yellow-400 cursor-pointer"><Crown className="mr-2 h-4 w-4" /><span>Hazte Premium</span></Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-gray-300 cursor-pointer" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" /><span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-mystica-dark-200/95 backdrop-blur-lg border-t border-mystica-purple-800/30 overflow-hidden">
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = isActiveLink(item.href)
                return (
                  <Link key={item.name} href={item.href}
                    className={cn("flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                      isActive ? "bg-mystica-purple-900/50 text-mystica-purple-300" : "text-gray-300 hover:bg-mystica-purple-900/30 hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}>
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {item.premium && <Crown className="w-3 h-3 text-yellow-500 ml-auto" />}
                  </Link>
                )
              })}
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-900/30"
                  onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="w-5 h-5" /><span>Panel Admin</span>
                </Link>
              )}
              {!isPremium && !isAdmin && (
                <Link href="/premium" className="flex items-center justify-center gap-2 mx-3 mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}>
                  <Crown className="w-5 h-5" /><span>Hazte Premium</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
