'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMeditationProgress } from '@/hooks/useMeditationProgress'
import { cn } from '@/lib/utils'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

// Colors for charts
const CHART_COLORS = {
  primary: '#818cf8',
  secondary: '#a78bfa',
  tertiary: '#c4b5fd',
  accent: '#fbbf24',
  categories: [
    '#818cf8', '#a78bfa', '#c4b5fd', '#fbbf24', '#f59e0b',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
    '#6366f1', '#ec4899', '#f43f5e', '#ef4444', '#f97316'
  ]
}

interface WeeklyAreaChartProps {
  className?: string
}

export function WeeklyAreaChart({ className }: WeeklyAreaChartProps) {
  const { getWeeklyStats } = useMeditationProgress()
  const weeklyStats = useMemo(() => getWeeklyStats(0), [getWeeklyStats])
  
  const chartData = weeklyStats.days.map(day => ({
    day: day.day,
    minutes: day.minutes,
    sessions: day.sessions
  }))
  
  const totalMinutes = chartData.reduce((sum, d) => sum + d.minutes, 0)

  return (
    <Card className={cn("bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400" />
            Minutos por Semana
          </CardTitle>
          <span className="text-sm text-gray-400">{totalMinutes} min total</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`${value} min`, 'Minutos']}
              />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                stroke={CHART_COLORS.primary} 
                fillOpacity={1} 
                fill="url(#colorMinutes)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface CategoryDonutChartProps {
  className?: string
}

export function CategoryDonutChart({ className }: CategoryDonutChartProps) {
  const { getCategoryDistribution } = useMeditationProgress()
  const distribution = useMemo(() => getCategoryDistribution(), [getCategoryDistribution])
  
  // Take top 5 categories
  const topCategories = distribution.slice(0, 5)
  const othersMinutes = distribution.slice(5).reduce((sum, c) => sum + c.minutes, 0)
  
  const chartData = [
    ...topCategories.map(c => ({ name: c.category, value: c.minutes })),
    ...(othersMinutes > 0 ? [{ name: 'Otros', value: othersMinutes }] : [])
  ]
  
  const totalMinutes = chartData.reduce((sum, d) => sum + d.value, 0)

  if (totalMinutes === 0) {
    return (
      <Card className={cn("bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
            Tiempo por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Sin datos de meditacion</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
            Tiempo por Categoria
          </CardTitle>
          <span className="text-sm text-gray-400">{totalMinutes} min total</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="h-48 w-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.categories[index % CHART_COLORS.categories.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid rgba(129, 140, 248, 0.3)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value} min`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{totalMinutes}</p>
                <p className="text-xs text-gray-400">min</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {chartData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: CHART_COLORS.categories[index % CHART_COLORS.categories.length] }}
                />
                <span className="text-sm text-gray-300 flex-1 capitalize">{item.name}</span>
                <span className="text-sm text-gray-400">{item.value} min</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((item.value / totalMinutes) * 100)}%)
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TopMeditationsBarChartProps {
  className?: string
}

export function TopMeditationsBarChart({ className }: TopMeditationsBarChartProps) {
  const { sessions } = useMeditationProgress()
  
  const meditationStats = useMemo(() => {
    const stats = new Map<string, { name: string; minutes: number; sessions: number }>()
    
    sessions.forEach(s => {
      const existing = stats.get(s.meditationName) || { name: s.meditationName, minutes: 0, sessions: 0 }
      stats.set(s.meditationName, {
        name: s.meditationName,
        minutes: existing.minutes + s.duration,
        sessions: existing.sessions + 1
      })
    })
    
    return Array.from(stats.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8)
  }, [sessions])

  if (meditationStats.length === 0) {
    return (
      <Card className={cn("bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
            Meditaciones Mas Usadas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Sin datos de meditacion</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          Meditaciones Mas Usadas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={meditationStats} 
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                stroke="#9ca3af" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={100}
                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number, name: string) => [
                  name === 'sessions' ? `${value} sesiones` : `${value} min`,
                  name === 'sessions' ? 'Sesiones' : 'Minutos'
                ]}
              />
              <Bar 
                dataKey="sessions" 
                fill={CHART_COLORS.primary}
                radius={[0, 4, 4, 0]}
                name="sessions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface Last30DaysChartProps {
  className?: string
}

export function Last30DaysChart({ className }: Last30DaysChartProps) {
  const { getLast30DaysProgress } = useMeditationProgress()
  const progress = useMemo(() => getLast30DaysProgress(), [getLast30DaysProgress])
  
  const chartData = progress.map(p => ({
    date: new Date(p.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    minutes: p.minutes,
    sessions: p.sessions
  }))
  
  const totalMinutes = chartData.reduce((sum, d) => sum + d.minutes, 0)
  const activeDays = chartData.filter(d => d.minutes > 0).length

  return (
    <Card className={cn("bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400" />
            Progreso Ultimos 30 Dias
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">{totalMinutes} min</span>
            <span className="text-gray-400">{activeDays} dias activos</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMinutes30" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={8}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number, name: string) => [
                  name === 'minutes' ? `${value} min` : `${value} sesiones`,
                  name === 'minutes' ? 'Minutos' : 'Sesiones'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                stroke={CHART_COLORS.accent} 
                fillOpacity={1} 
                fill="url(#colorMinutes30)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Combined Charts Component
interface MeditationChartsProps {
  className?: string
}

export function MeditationCharts({ className }: MeditationChartsProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyAreaChart />
        <CategoryDonutChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMeditationsBarChart />
        <Last30DaysChart />
      </div>
    </div>
  )
}
