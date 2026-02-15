'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Clock, Trophy, TrendingUp, Calendar, Target, Zap, Heart, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useMeditationProgress } from '@/hooks/useMeditationProgress'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  color: string
  gradient: string
  delay?: number
}

function StatCard({ title, value, subtitle, icon, color, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={cn("relative overflow-hidden border", gradient)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">{title}</p>
              <p className={cn("text-2xl font-bold", color)}>{value}</p>
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            </div>
            <div className={cn("p-2 rounded-lg bg-white/5", color)}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface WeeklyProgressBarProps {
  weeklyStats: ReturnType<typeof useMeditationProgress.prototype.getWeeklyStats>
}

function WeeklyProgressBar({ weeklyStats }: WeeklyProgressBarProps) {
  const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
  const today = new Date().getDay()
  
  return (
    <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Actividad Semanal
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {weeklyStats.days.map((day, index) => (
            <div key={day.day} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm",
                  index === today ? "text-white font-medium" : "text-gray-400"
                )}>
                  {day.day}
                  {index === today && (
                    <Badge className="ml-2 bg-indigo-500/20 text-indigo-300 text-[10px]">Hoy</Badge>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {day.sessions > 0 ? `${day.sessions} sesion${day.sessions > 1 ? 'es' : ''}` : 'Sin actividad'}
                </span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((day.minutes / 60) * 100, 100)}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    index === today 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                      : day.minutes > 0 
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600"
                        : "bg-gray-700"
                  )}
                />
                {day.minutes > 0 && (
                  <span className="absolute right-0 text-[10px] text-gray-400 -top-4">
                    {day.minutes} min
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-indigo-500/20">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total semanal</span>
            <span className="text-white font-medium">{weeklyStats.totalMinutes} min</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Promedio diario</span>
            <span className="text-white font-medium">{weeklyStats.averagePerDay} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MeditationStatsProps {
  className?: string
}

export function MeditationStats({ className }: MeditationStatsProps) {
  const { 
    stats, 
    getWeeklyStats, 
    getMonthlyStats, 
    getCategoryDistribution,
    sessions 
  } = useMeditationProgress()
  
  const weeklyStats = useMemo(() => getWeeklyStats(0), [getWeeklyStats])
  const monthlyStats = useMemo(() => getMonthlyStats(0), [getMonthlyStats])
  const categoryDistribution = useMemo(() => getCategoryDistribution(), [getCategoryDistribution])
  
  // Calculate additional stats
  const uniqueMeditations = useMemo(() => {
    return new Set(sessions.map(s => s.meditationId)).size
  }, [sessions])
  
  const completionRate = useMemo(() => {
    if (stats.totalSessions === 0) return 0
    return Math.round((stats.completedSessions / stats.totalSessions) * 100)
  }, [stats.totalSessions, stats.completedSessions])
  
  const favoriteCategory = useMemo(() => {
    if (categoryDistribution.length === 0) return 'Ninguna'
    return categoryDistribution[0].category
  }, [categoryDistribution])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Mejor Racha"
          value={stats.longestStreak}
          subtitle="dias consecutivos"
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          color="text-orange-400"
          gradient="bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-500/30"
          delay={0}
        />
        <StatCard
          title="Racha Actual"
          value={stats.currentStreak}
          subtitle={stats.currentStreak > 0 ? "dias" : "comienza hoy"}
          icon={<Zap className="w-5 h-5 text-yellow-400" />}
          color="text-yellow-400"
          gradient="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border-yellow-500/30"
          delay={0.1}
        />
        <StatCard
          title="Promedio Diario"
          value={stats.averageSessionLength}
          subtitle="minutos por sesion"
          icon={<Target className="w-5 h-5 text-blue-400" />}
          color="text-blue-400"
          gradient="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/30"
          delay={0.2}
        />
        <StatCard
          title="Tasa de Exito"
          value={`${completionRate}%`}
          subtitle="sesiones completadas"
          icon={<Award className="w-5 h-5 text-green-400" />}
          color="text-green-400"
          gradient="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-500/30"
          delay={0.3}
        />
      </div>
      
      {/* Period Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-purple-500/30 h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Esta Semana</p>
                  <p className="text-xs text-gray-400">Ultimos 7 dias</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Minutos</span>
                  <span className="text-sm text-white font-medium">{weeklyStats.totalMinutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Sesiones</span>
                  <span className="text-sm text-white font-medium">{weeklyStats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Mejor dia</span>
                  <span className="text-sm text-white font-medium">{weeklyStats.bestDay}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-teal-900/30 to-emerald-900/20 border-teal-500/30 h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Este Mes</p>
                  <p className="text-xs text-gray-400">Mes actual</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Minutos</span>
                  <span className="text-sm text-white font-medium">{monthlyStats.totalMinutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Dias activos</span>
                  <span className="text-sm text-white font-medium">{monthlyStats.daysMeditated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Promedio diario</span>
                  <span className="text-sm text-white font-medium">{monthlyStats.averagePerDay} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 border-amber-500/30 h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Total Acumulado</p>
                  <p className="text-xs text-gray-400">Historial completo</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Minutos totales</span>
                  <span className="text-sm text-white font-medium">{stats.totalMinutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Sesiones</span>
                  <span className="text-sm text-white font-medium">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Meditaciones unicas</span>
                  <span className="text-sm text-white font-medium">{uniqueMeditations}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Weekly Progress */}
      <WeeklyProgressBar weeklyStats={weeklyStats} />
      
      {/* Favorite Category */}
      {categoryDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-to-br from-pink-900/30 to-rose-900/20 border-pink-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-pink-400" />
                Categoria Favorita
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {categoryDistribution.slice(0, 5).map((cat, index) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-sm capitalize",
                        index === 0 ? "text-white font-medium" : "text-gray-400"
                      )}>
                        {cat.category}
                        {index === 0 && (
                          <Badge className="ml-2 bg-pink-500/20 text-pink-300 text-[10px]">
                            Favorita
                          </Badge>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{cat.sessions} sesiones</span>
                        <span className="text-xs text-white font-medium">{cat.minutes} min</span>
                      </div>
                    </div>
                    <Progress 
                      value={cat.percentage} 
                      className="h-1.5 bg-gray-800"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
