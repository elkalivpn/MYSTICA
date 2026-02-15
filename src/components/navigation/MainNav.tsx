'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Menu, X, Moon, Sparkles, Star, User, Settings, LogOut, Crown, Shield, Flame,
  Sun, Heart, Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Bottom navigation items (mobile style like Moonly)
const bottomNavItems = [
  { name: 'Inicio', href: '/', icon: Moon },
  { name: 'Tarot', href: '/cartas', icon: Sparkles },
  { name: 'Luna', href: '/calendario-lunar', icon: Sun },
  { name: 'Astrologia', href: '/astrologia', icon: Star },
  { name: 'Perfil', href: '#profile', icon: User },
]

// Desktop navigation
const desktopNavItems = [
  { name: 'Inicio', href: '/', icon: Moon },
  { name: 'Tarot', href: '/cartas', icon: Sparkles },
  { name: 'Oraculo', href: '/oraculo', icon: Sun },
  { name: 'Runas', href: '/runas', icon: Star },
  { name: 'Luna', href: '/calendario-lunar', icon: Moon },
  { name: 'Horoscopo', href: '/horoscopo', icon: Calendar, premium: true },
  { name: 'Compatibilidad', href: '/compatibilidad', icon: Heart },
]

// Nav link hover animation variants
const navLinkVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

// Icon animation variants
const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 15, transition: { duration: 0.2 } },
}

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAdmin, isPremium } = useAuth()
  const { currentStreak } = useStreak()
  
  // Track scroll position for blur effect
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 50], [0.95, 0.98])
  const headerBlur = useTransform(scrollY, [0, 50], [12, 24])
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    queueMicrotask(() => setMobileMenuOpen(false))
  }, [pathname])

  const getRoleBadge = () => {
    if (isAdmin) return { icon: Shield, color: 'text-red-500', bg: 'bg-red-500/20', label: 'Admin' }
    if (isPremium) return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/20', label: 'Premium' }
    return null
  }
  const roleBadge = getRoleBadge()
  const isActiveLink = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* Top Header - Compact with scroll blur */}
      <motion.header 
        className="fixed top-0 z-50 w-full border-b border-mystica-purple-800/20"
        style={{
          backgroundColor: useTransform(headerOpacity, (v) => `rgba(15, 15, 26, ${v})`),
          backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          WebkitBackdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
        }}
      >
        {/* Animated border glow on scroll */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: useTransform(
              scrollY,
              [0, 100],
              ['transparent', 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)']
            ),
          }}
        />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div 
                variants={navLinkVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap" 
                className="relative"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 rounded-full blur-xl opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative w-9 h-9 bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 rounded-full flex items-center justify-center border border-mystica-purple-500/30 overflow-hidden">
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    <Moon className="w-5 h-5 text-mystica-gold-300" />
                  </motion.div>
                  {/* Shine effect on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-mystica-purple-400 to-mystica-gold-400 bg-clip-text text-transparent font-mystica"
                whileHover={{ scale: 1.02 }}
              >
                Mystica
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {desktopNavItems.map((item, index) => {
                const Icon = item.icon
                const isActive = isActiveLink(item.href)
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        className={cn(
                          "relative flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden group",
                          isActive 
                            ? "text-mystica-purple-300" 
                            : "text-gray-300 hover:text-white"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Background glow on hover */}
                        <motion.div
                          className={cn(
                            "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity",
                            isActive ? "bg-mystica-purple-900/50" : "bg-mystica-purple-900/30"
                          )}
                        />
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-mystica-gold-400 rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        
                        <motion.div
                          variants={iconVariants}
                          initial="initial"
                          whileHover="hover"
                          className="relative z-10"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <span className="relative z-10">{item.name}</span>
                        {item.premium && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Crown className="w-3 h-3 text-yellow-500 ml-1" />
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
              {isAdmin && (
                <Link href="/admin">
                  <motion.div
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Streak badge */}
              {currentStreak > 0 && (
                <motion.div 
                  className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Flame className="w-4 h-4" />
                  </motion.div>
                  <span className="text-sm font-medium">{currentStreak}</span>
                </motion.div>
              )}
              
              {/* Role badge */}
              {user && roleBadge && (
                <motion.div 
                  className={cn("hidden md:flex items-center gap-1 px-2 py-1 rounded-full", roleBadge.bg)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <roleBadge.icon className={cn("w-3 h-3", roleBadge.color)} />
                  <span className={cn("text-xs font-medium", roleBadge.color)}>{roleBadge.label}</span>
                </motion.div>
              )}
              
              {/* Premium CTA */}
              {!isPremium && !isAdmin && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/premium" className="hidden sm:block">
                    <Button size="sm" variant="premium" className="text-xs group relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                      <Crown className="w-3 h-3 mr-1" />Premium
                    </Button>
                  </Link>
                </motion.div>
              )}
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="icon" className="relative rounded-full group">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-mystica-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <User className="w-5 h-5 relative z-10" />
                      {roleBadge && (
                        <motion.div 
                          className="absolute -top-1 -right-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <roleBadge.icon className={cn("w-3 h-3", roleBadge.color)} />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-mystica-dark-100 border-mystica-purple-800/30">
                  <DropdownMenuLabel className="text-mystica-purple-300">
                    {user?.name || 'Mi Cuenta'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-mystica-purple-800/30" />
                  {!isPremium && !isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/premium" className="text-yellow-400 cursor-pointer">
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Hazte Premium</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="text-red-400 cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Panel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-gray-300 cursor-pointer" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile menu button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-mystica-dark-200/98 backdrop-blur-xl border-b border-mystica-purple-800/30 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {desktopNavItems.map((item, index) => {
                const Icon = item.icon
                const isActive = isActiveLink(item.href)
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 group",
                        isActive 
                          ? "bg-mystica-purple-900/50 text-mystica-purple-300" 
                          : "text-gray-300 hover:bg-mystica-purple-900/30 hover:text-white"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      <span>{item.name}</span>
                      {item.premium && <Crown className="w-3 h-3 text-yellow-500 ml-auto" />}
                    </Link>
                  </motion.div>
                )
              })}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: desktopNavItems.length * 0.05 }}
                >
                  <Link href="/admin" 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-900/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Panel Admin</span>
                  </Link>
                </motion.div>
              )}
              <motion.div 
                className="flex items-center justify-between px-4 py-3 mt-2 border-t border-mystica-purple-800/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-gray-400 text-sm">Tema</span>
                <ThemeToggle variant="dropdown" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Mobile style like Moonly) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bottom-nav safe-area-inset">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon
            const isActive = item.href === '#profile' ? false : isActiveLink(item.href)
            
            if (item.href === '#profile') {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <motion.button 
                      className={cn(
                        "bottom-nav-item flex-1",
                        "text-gray-400 hover:text-white transition-colors"
                      )}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top" className="w-56 bg-mystica-dark-100 border-mystica-purple-800/30 mb-2">
                    <DropdownMenuLabel className="text-mystica-purple-300">
                      {user?.name || 'Mi Cuenta'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-mystica-purple-800/30" />
                    {!isPremium && !isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/premium" className="text-yellow-400 cursor-pointer">
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Hazte Premium</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-red-400 cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Panel Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-gray-300 cursor-pointer" onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            }

            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <motion.div
                  className={cn("bottom-nav-item", isActive && "active")}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
