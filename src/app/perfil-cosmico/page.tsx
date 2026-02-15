'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sun, Moon, Star, Sparkles, Crown, Flame, Calendar, Heart, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function CosmicProfilePage() {
  const { user, isPremium, isAdmin } = useAuth()
  const { currentStreak } = useStreak()
  const [userData, setUserData] = useState({
    name: '',
    birthDate: '',
    sunSign: '',
    moonSign: '',
    ascendant: '',
    joinDate: '',
    totalReadings: 0,
    favoriteCrystals: [] as string[],
    achievements: [] as string[]
  })

  useEffect(() => {
    const saved = localStorage.getItem('mystica_user_profile')
    if (saved) {
      // Use timeout to avoid synchronous setState warning
      const timer = setTimeout(() => {
        setUserData(JSON.parse(saved))
      }, 0)
      return () => clearTimeout(timer)
    } else if (user) {
      const timer = setTimeout(() => {
        setUserData(prev => ({ ...prev, name: user.name }))
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [user])

  const stats = [
    { label: 'Racha actual', value: currentStreak, icon: Flame, color: 'text-orange-400' },
    { label: 'Lecturas', value: userData.totalReadings, icon: Star, color: 'text-mystica-purple-400' },
    { label: 'Logros', value: userData.achievements.length, icon: Crown, color: 'text-mystica-gold-400' },
  ]

  const quickActions = [
    { label: 'Carta Natal', href: '/carta-natal', icon: Star },
    { label: 'Horóscopo', href: '/horoscopo', icon: Calendar },
    { label: 'Compatibilidad', href: '/compatibilidad', icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-purple-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-mystica-purple-800/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mystica">
                  Perfil Cósmico
                </h1>
                <p className="text-xs text-gray-400">Tu identidad espiritual</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-mystica-gold-400/50">
                    <Image
                      src="/guides/hecate-3d.png"
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  {(isPremium || isAdmin) && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white font-mystica">
                    {userData.name || 'Místico Anónimo'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {isAdmin && <Badge variant="destructive" className="text-xs">Admin</Badge>}
                    {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Premium</Badge>}
                    {!isPremium && !isAdmin && <Badge variant="outline" className="text-xs">Free</Badge>}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Miembro desde {userData.joinDate || 'enero 2024'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {stats.map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center p-3 rounded-xl bg-mystica-dark-300/50"
                    >
                      <Icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zodiac Signs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white font-mystica mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-mystica-gold-400" />
                Signos Astrales
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20">
                  <Sun className="w-6 h-6 mx-auto text-amber-400 mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Signo Solar</p>
                  <p className="text-lg font-bold text-amber-300">
                    {userData.sunSign || '—'}
                  </p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                  <Moon className="w-6 h-6 mx-auto text-indigo-400 mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Signo Lunar</p>
                  <p className="text-lg font-bold text-indigo-300">
                    {userData.moonSign || '—'}
                  </p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-500/20">
                  <Star className="w-6 h-6 mx-auto text-pink-400 mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Ascendente</p>
                  <p className="text-lg font-bold text-pink-300">
                    {userData.ascendant || '—'}
                  </p>
                </div>
              </div>

              <Link href="/carta-natal" className="block mt-4">
                <Button variant="outline" className="w-full border-mystica-purple-600/30 text-mystica-purple-300">
                  <Star className="w-4 h-4 mr-2" />
                  Calcular Carta Natal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white font-mystica mb-4">
                Acciones Rápidas
              </h3>

              <div className="space-y-2">
                {quickActions.map((action, i) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.label} href={action.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-mystica-dark-300/50 border border-mystica-purple-700/20 hover:border-mystica-gold-500/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-mystica-purple-800/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-mystica-purple-300" />
                        </div>
                        <span className="text-gray-200">{action.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white font-mystica mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-mystica-gold-400" />
                Logros
              </h3>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { emoji: '🌟', name: 'Inicio', unlocked: true },
                  { emoji: '🔥', name: '7 días', unlocked: currentStreak >= 7 },
                  { emoji: '✨', name: '10 lecturas', unlocked: userData.totalReadings >= 10 },
                  { emoji: '🔮', name: 'Vidente', unlocked: userData.totalReadings >= 50 },
                  { emoji: '🌙', name: 'Nocturno', unlocked: false },
                  { emoji: '💫', name: 'Estrella', unlocked: false },
                  { emoji: '👑', name: 'Maestro', unlocked: false },
                  { emoji: '🏆', name: 'Leyenda', unlocked: false },
                ].map((achievement, i) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className={cn(
                      "text-center p-3 rounded-xl transition-all",
                      achievement.unlocked
                        ? "bg-mystica-gold-800/20 border border-mystica-gold-500/30"
                        : "bg-mystica-dark-300/50 border border-mystica-purple-700/20 opacity-50"
                    )}
                  >
                    <div className="text-2xl mb-1">{achievement.emoji}</div>
                    <p className="text-[10px] text-gray-400">{achievement.name}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium CTA */}
        {!isPremium && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/premium">
              <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
                <CardContent className="p-6 text-center">
                  <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white font-mystica mb-2">
                    Desbloquea tu Potencial
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Acceso ilimitado a lecturas, carta natal completa y más
                  </p>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400">
                    <Crown className="w-4 h-4 mr-2" />
                    Hazte Premium
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  )
}
