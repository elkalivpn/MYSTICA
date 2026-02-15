'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Moon, Star, Crown, ArrowRight, Flame, Shield,
  Sun, Hash, Gem, Headphones, Heart, Calendar, User, Play, 
  Clock, Trophy, Target, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'
import { useMeditationProgress } from '@/hooks/useMeditationProgress'
import { useReminders, meditationAchievements } from '@/hooks/useReminders'
import { cn } from '@/lib/utils'
import { DailyCheckIn } from '@/components/DailyCheckIn'
import { getRotatingQuote } from '@/data/quotes'
import { meditations, unguidedMeditations, meditationCategories } from '@/data/meditations'
import Image from 'next/image'
import { ParticleField } from '@/components/effects/ParticleField'
import { FloatingOrbs } from '@/components/effects/FloatingOrbs'
import { MysticalGlow } from '@/components/effects/MysticalGlow'
import { CardHover, AnimatedCardGrid, AnimatedGridItem } from '@/components/transitions/CardHover'
import '@/styles/animations.css'

// NPCs 3D REALES - Usa los archivos que existen en /public/guides/
const npcGuides = [
  {
    id: 'hecate',
    name: 'Hecate',
    title: 'Diosa de la Magia',
    culture: 'Griega',
    domain: 'Tarot',
    href: '/cartas',
    image: '/guides/hecate-3d.png',
    gradient: 'from-purple-600 to-pink-600',
    description: 'Guardiana de las encrucijadas y el tarot',
    color: '#9333ea',
  },
  {
    id: 'frigg',
    name: 'Frigg',
    title: 'Madre del Cosmos',
    culture: 'Nordica',
    domain: 'Runas',
    href: '/runas',
    image: '/guides/frigg-3d.png',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Diosa de la sabiduria y las runas',
    color: '#3b82f6',
  },
  {
    id: 'selene',
    name: 'Selene',
    title: 'Senora de la Luna',
    culture: 'Griega',
    domain: 'Luna',
    href: '/calendario-lunar',
    image: '/guides/selene-3d.png',
    gradient: 'from-purple-400 to-indigo-500',
    description: 'Diosa de la Luna y sus ciclos',
    color: '#a855f7',
  },
  {
    id: 'morpheus',
    name: 'Morfeo',
    title: 'Senor de los Suenos',
    culture: 'Griega',
    domain: 'Suenos',
    href: '/suenos',
    image: '/guides/morpheus-3d.png',
    gradient: 'from-indigo-500 to-violet-600',
    description: 'Dios de los suenos y visiones',
    color: '#6366f1',
  },
  {
    id: 'isis',
    name: 'Isis',
    title: 'Madre de la Magia',
    culture: 'Egipcia',
    domain: 'Cristales',
    href: '/cristales',
    image: '/guides/isis-3d.png',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Diosa de la magia y cristales',
    color: '#10b981',
  },
  {
    id: 'thoth',
    name: 'Thoth',
    title: 'Escriba de los Dioses',
    culture: 'Egipcia',
    domain: 'Astrologia',
    href: '/astrologia',
    image: '/guides/thoth-3d.png',
    gradient: 'from-amber-500 to-orange-500',
    description: 'Dios de la sabiduria y astrologia',
    color: '#f59e0b',
  },
]

const extraFeatures = [
  { title: 'Oraculo', desc: 'Mensajes del universo', icon: Sun, href: '/oraculo', gradient: 'from-yellow-500 to-orange-500' },
  { title: 'Horoscopo', desc: 'Predicciones diarias', icon: Calendar, href: '/horoscopo', gradient: 'from-pink-500 to-rose-500', premium: true },
  { title: 'Carta Natal', desc: 'Tu mapa astral', icon: Star, href: '/carta-natal', gradient: 'from-purple-500 to-violet-600' },
  { title: 'Afirmaciones', desc: 'Poderosas palabras', icon: Sparkles, href: '/afirmaciones', gradient: 'from-amber-400 to-orange-500' },
  { title: 'Compatibilidad', desc: 'Conexion zodiacal', icon: Heart, href: '/compatibilidad', gradient: 'from-red-500 to-pink-500' },
  { title: 'Numerologia', desc: 'Poder de numeros', icon: Hash, href: '/numerologia', gradient: 'from-cyan-500 to-teal-500' },
  { title: 'Rituales', desc: 'Magia practica', icon: Flame, href: '/rituales', gradient: 'from-emerald-500 to-green-600' },
  { title: 'Meditaciones', desc: 'Paz interior', icon: Headphones, href: '/meditaciones', gradient: 'from-indigo-400 to-purple-500', highlight: true },
  { title: 'Perfil', desc: 'Tu identidad cosmica', icon: Crown, href: '/perfil-cosmico', gradient: 'from-yellow-400 to-amber-500' },
  { title: 'Ajustes', desc: 'Personaliza tu app', icon: User, href: '/ajustes', gradient: 'from-gray-500 to-slate-600' },
]

// Quick meditation suggestions based on time of day
const getQuickMeditation = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return { name: 'Despertar Consciente', duration: 5, type: 'manana' }
  } else if (hour >= 12 && hour < 18) {
    return { name: 'Pausa Revitalizante', duration: 10, type: 'tarde' }
  } else {
    return { name: 'Descenso al Sueno', duration: 15, type: 'noche' }
  }
}

export default function HomePage() {
  const { user, isAdmin, isPremium } = useAuth()
  const { currentStreak, lastCheckIn } = useStreak()
  const meditationProgress = useMeditationProgress()
  const reminders = useReminders()
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [quickMeditation] = useState(getQuickMeditation)
  
  // Initialize quote with useMemo instead of useEffect+setState
  const quote = useMemo(() => {
    const dailyQuote = getRotatingQuote(6)
    return { text: dailyQuote.text, author: dailyQuote.author || '' }
  }, [])
  
  // Parallax scroll effect
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  // Check for daily check-in
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (lastCheckIn !== today) {
      const timer = setTimeout(() => setShowCheckIn(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [lastCheckIn])

  // Calculate meditation stats
  const totalMinutes = meditationProgress.stats.totalMinutes
  const totalSessions = meditationProgress.stats.completedSessions
  const unlockedAchievements = reminders.unlockedAchievements.length
  const totalAchievements = meditationAchievements.length

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Borobudur Temple */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/backgrounds/borobudur-temple.png"
          alt="Templo Borobudur - Fondo Mistico"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mystica-dark-300/90 via-mystica-dark-300/80 to-mystica-dark-300/95" />
      </div>

      {/* Premium Particle Field Background */}
      <ParticleField
        count={60}
        color="mystic"
        minSize={1}
        maxSize={3}
        shape="star"
        movement="float"
        className="z-0"
      />

      {/* Floating Orbs in corners */}
      <FloatingOrbs
        count={4}
        colorTheme="mystic"
        minSize={50}
        maxSize={100}
        position="corners"
        speed={0.5}
        className="z-0"
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header with Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <motion.div
                className="mb-6 inline-block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <MysticalGlow
                  color="mixed"
                  intensity="intense"
                  size={200}
                  animated
                  pulse
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 blur-3xl opacity-40"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-mystica-purple-700 to-mystica-purple-900 rounded-full flex items-center justify-center border-2 border-mystica-gold-400/40 glow-mystica overflow-hidden">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Moon className="w-10 h-10 text-mystica-gold-300" />
                      </motion.div>
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      />
                    </div>
                  </div>
                </MysticalGlow>
              </motion.div>

              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-mystica"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-mystica-purple-300 via-mystica-gold-300 to-mystica-purple-300 bg-clip-text text-transparent drop-shadow-lg animate-gradient-flow">
                  MYSTICA
                </span>
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-gray-300 mb-2 font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Tu Portal al Mundo Mistico
              </motion.p>

              {/* Daily Affirmation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-lg mx-auto mb-6 p-4 rounded-xl bg-mystica-dark-200/60 border border-mystica-purple-700/30 backdrop-blur-sm hover:border-mystica-purple-500/50 transition-colors group"
              >
                <motion.div
                  className="flex items-center gap-2 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Sparkles className="w-4 h-4 text-mystica-gold-400" />
                  <span className="text-xs text-mystica-gold-400 font-medium">Frase del dia</span>
                </motion.div>
                <p className="text-mystica-purple-200 italic text-sm sm:text-base">"{quote.text}"</p>
                {quote.author && <p className="text-xs text-gray-400 mt-2">- {quote.author}</p>}
              </motion.div>

              {/* User Info */}
              {user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="flex flex-wrap items-center justify-center gap-3 mb-6"
                >
                  <span className="text-gray-300 text-sm">Bienvenido,</span>
                  <span className="text-white font-semibold text-sm">{user.name}</span>
                  {currentStreak > 0 && (
                    <motion.span 
                      className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-medium flex items-center gap-1 border border-orange-500/30"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Flame className="w-3 h-3" />{currentStreak} dias
                    </motion.span>
                  )}
                  {isAdmin && <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                  {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
                </motion.div>
              )}
            </motion.div>

            {/* Quick Meditation Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <CardHover borderGlow glowColor="rgba(99, 102, 241, 0.3)">
                <Card className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/30 overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Zap className="w-5 h-5 text-yellow-400" />
                          </motion.div>
                          <h3 className="font-bold text-white">Meditacion Rapida</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">
                          {quickMeditation.name} - {quickMeditation.duration} min
                        </p>
                        <p className="text-gray-500 text-xs">
                          Ideal para la {quickMeditation.type}
                        </p>
                      </div>
                      <Link href="/meditaciones">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 group relative overflow-hidden">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            />
                            <Play className="w-4 h-4 mr-2" />
                            Comenzar
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                    
                    {/* Mini Stats */}
                    {totalSessions > 0 && (
                      <div className="mt-4 pt-4 border-t border-indigo-500/20 grid grid-cols-3 gap-4 text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <p className="text-xl font-bold text-white">{totalMinutes}</p>
                          <p className="text-xs text-gray-400">Minutos</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <p className="text-xl font-bold text-white">{totalSessions}</p>
                          <p className="text-xs text-gray-400">Sesiones</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <p className="text-xl font-bold text-white">{unlockedAchievements}/{totalAchievements}</p>
                          <p className="text-xs text-gray-400">Logros</p>
                        </motion.div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardHover>
            </motion.div>

            {/* NPC Guides Grid - MAIN FEATURE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <motion.h2 
                className="text-center text-xl font-semibold mb-6 text-mystica-gold-300 font-mystica"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Elige tu Guia Espiritual
              </motion.h2>
              
              <AnimatedCardGrid className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto" staggerDelay={0.1}>
                {npcGuides.map((npc, index) => (
                  <AnimatedGridItem key={npc.id} index={index}>
                    <Link href={npc.href}>
                      <CardHover
                        tilt
                        tiltIntensity={8}
                        glare
                        glareColor="rgba(251, 191, 36, 0.08)"
                        lift
                        borderGlow
                        glowColor={npc.color + '60'}
                        className="h-full"
                      >
                        <div className="npc-card p-4 h-full cursor-pointer group">
                          {/* NPC Image */}
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                            <motion.div
                              className="absolute inset-0 rounded-full opacity-50 blur-xl"
                              style={{ background: `linear-gradient(135deg, ${npc.color} 0%, ${npc.color}80 100%)` }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-mystica-purple-500/30 group-hover:border-mystica-gold-500/50 transition-all duration-300">
                              <Image
                                src={npc.image}
                                alt={npc.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                priority
                              />
                              {/* Glow overlay on hover */}
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-t from-mystica-dark-500/40 to-transparent"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                              />
                            </div>
                          </div>

                          {/* NPC Info */}
                          <div className="text-center">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-mystica-gold-300 transition-colors font-mystica">
                              {npc.name}
                            </h3>
                            <p className="text-xs text-mystica-purple-300 mb-2">{npc.title}</p>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mystica-purple-800/50 text-mystica-purple-200 border border-mystica-purple-600/30">
                                {npc.culture}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mystica-gold-800/30 text-mystica-gold-300 border border-mystica-gold-600/30">
                                {npc.domain}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{npc.description}</p>
                          </div>

                          {/* Arrow indicator */}
                          <div className="flex justify-center mt-3">
                            <motion.div
                              className="w-8 h-8 rounded-full bg-mystica-purple-700/50 flex items-center justify-center border border-mystica-purple-500/30 group-hover:bg-mystica-gold-600/30 group-hover:border-mystica-gold-500/50 transition-all duration-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              <ArrowRight className="w-4 h-4 text-mystica-purple-300 group-hover:text-mystica-gold-300 transition-colors" />
                            </motion.div>
                          </div>
                        </div>
                      </CardHover>
                    </Link>
                  </AnimatedGridItem>
                ))}
              </AnimatedCardGrid>
            </motion.div>

            {/* Extra Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <motion.h2 
                className="text-center text-lg font-semibold mb-4 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Mas Funciones
              </motion.h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
                {extraFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link href={feature.href}>
                        <motion.div 
                          className={cn(
                            "group flex flex-col items-center p-3 rounded-xl transition-all duration-300",
                            feature.highlight 
                              ? "bg-indigo-900/50 border-2 border-indigo-500/50 hover:border-indigo-400" 
                              : "bg-mystica-dark-200/50 border border-mystica-purple-700/30 hover:border-mystica-gold-500/40"
                          )}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div 
                            className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2 shadow-lg', feature.gradient)}
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </motion.div>
                          <span className="text-xs text-gray-300 text-center group-hover:text-white transition-colors">
                            {feature.title}
                          </span>
                          {feature.premium && (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Crown className="w-3 h-3 text-yellow-500 mt-1" />
                            </motion.div>
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Meditation Stats Card (if user has progress) */}
            {totalSessions > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <CardHover borderGlow glowColor="rgba(251, 191, 36, 0.2)">
                  <Card className="bg-mystica-dark-200/50 border-mystica-purple-700/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-yellow-400" />
                          Tu Progreso Mistico
                        </h3>
                        <Link href="/meditaciones">
                          <Button variant="ghost" size="sm" className="text-indigo-400">
                            Ver todo <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { icon: Clock, value: totalMinutes, label: 'Minutos', color: 'text-indigo-400' },
                          { icon: Headphones, value: totalSessions, label: 'Sesiones', color: 'text-green-400' },
                          { icon: Flame, value: meditationProgress.stats.currentStreak, label: 'Racha', color: 'text-orange-400' },
                          { icon: Target, value: unlockedAchievements, label: 'Logros', color: 'text-yellow-400' },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            className="text-center p-3 bg-mystica-dark-100/50 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                          >
                            <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                            <p className="text-lg font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Achievement Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Logros desbloqueados</span>
                          <span>{Math.round((unlockedAchievements / totalAchievements) * 100)}%</span>
                        </div>
                        <Progress value={(unlockedAchievements / totalAchievements) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </CardHover>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link href="/cartas">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="group text-base px-8 py-6 bg-gradient-to-r from-mystica-purple-600 to-mystica-purple-800 hover:from-mystica-purple-500 hover:to-mystica-purple-700 shadow-xl shadow-mystica-purple-500/30 border border-mystica-purple-400/30 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <Sparkles className="mr-2 h-5 w-5" />
                    Comenzar Lectura de Tarot
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              {!isPremium && !isAdmin && (
                <Link href="/premium">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      className="text-base px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-xl shadow-yellow-500/30 border border-yellow-400/30 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                      <Crown className="mr-2 h-5 w-5" />
                      Hazte Premium
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>

            {/* Admin Link */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <Link href="/admin">
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-900/20">
                    <Shield className="w-4 h-4 mr-2" />
                    Panel Admin
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-mystica-purple-700/30 bg-mystica-dark-300/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Moon className="w-5 h-5 text-mystica-purple-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-mystica-purple-300 to-mystica-gold-300 bg-clip-text text-transparent font-mystica">
                Mystica
              </span>
            </div>
            <p className="text-gray-500 text-xs mb-3">2024 Mystica. Todos los derechos reservados.</p>
            <div className="py-2 px-3 rounded-lg bg-mystica-dark-200/50 inline-block border border-mystica-purple-700/30">
              <p className="text-mystica-purple-200 text-xs">
                Desarrollado con purpura por <span className="font-semibold text-mystica-gold-400">Yrys</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs">
              <Link href="/agradecimientos" className="text-gray-500 hover:text-mystica-purple-300 transition-colors">
                Agradecimientos
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/premium" className="text-gray-500 hover:text-mystica-gold-400 transition-colors">
                Patrocinar
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showCheckIn && <DailyCheckIn onClose={() => setShowCheckIn(false)} />}
      </AnimatePresence>
    </div>
  )
}
