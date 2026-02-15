'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Headphones } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMeditationProgress, HeatmapDay, MeditationSession } from '@/hooks/useMeditationProgress'
import { cn } from '@/lib/utils'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

interface MeditationHeatmapProps {
  onDayClick?: (date: string, sessions: MeditationSession[]) => void
}

// Intensity colors from dark violet to golden
const intensityColors = {
  0: 'bg-gray-800/30 dark:bg-gray-800/30',
  1: 'bg-violet-900/60 dark:bg-violet-900/60',
  2: 'bg-violet-700/70 dark:bg-violet-700/70',
  3: 'bg-amber-600/70 dark:bg-amber-600/70',
  4: 'bg-amber-400/80 dark:bg-amber-400/80'
}

const intensityBorders = {
  0: 'border-gray-700/30',
  1: 'border-violet-600/30',
  2: 'border-violet-500/40',
  3: 'border-amber-500/40',
  4: 'border-amber-300/50'
}

export function MeditationHeatmap({ onDayClick }: MeditationHeatmapProps) {
  const { getHeatmapData, getSessionsByDate } = useMeditationProgress()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSessions, setSelectedSessions] = useState<MeditationSession[]>([])
  
  const heatmapData = useMemo(() => getHeatmapData(12), [getHeatmapData])
  
  const handleDayClick = (day: HeatmapDay) => {
    if (day.sessions > 0) {
      const sessions = getSessionsByDate(day.date)
      setSelectedDate(day.date)
      setSelectedSessions(sessions)
      onDayClick?.(day.date, sessions)
    }
  }
  
  const closeDetail = () => {
    setSelectedDate(null)
    setSelectedSessions([])
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${DAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
  }
  
  // Calculate summary stats
  const totalActiveDays = useMemo(() => {
    let count = 0
    heatmapData.forEach(month => {
      month.forEach(day => {
        if (day.sessions > 0) count++
      })
    })
    return count
  }, [heatmapData])
  
  const totalMinutes = useMemo(() => {
    let total = 0
    heatmapData.forEach(month => {
      month.forEach(day => {
        total += day.minutes
      })
    })
    return total
  }, [heatmapData])

  return (
    <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-amber-400" />
            Actividad de Meditacion
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              {totalActiveDays} dias activos
            </span>
            <span className="text-gray-400">
              {totalMinutes} min totales
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <span className="text-xs text-gray-500">Menos</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={cn(
                'w-3 h-3 rounded-sm border',
                intensityColors[level as keyof typeof intensityColors],
                intensityBorders[level as keyof typeof intensityBorders]
              )}
            />
          ))}
          <span className="text-xs text-gray-500">Mas</span>
        </div>
        
        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-fit">
            {heatmapData.map((monthData, monthIndex) => {
              const monthDate = new Date()
              monthDate.setMonth(monthDate.getMonth() - (11 - monthIndex))
              const monthName = MONTHS[monthDate.getMonth()]
              
              return (
                <div key={monthIndex} className="flex flex-col gap-0.5">
                  {/* Month label */}
                  <div className="h-4 text-[10px] text-gray-500 text-center mb-0.5">
                    {monthName}
                  </div>
                  
                  {/* Days grid - 7 rows for each day of week */}
                  <div className="grid grid-rows-7 gap-0.5">
                    {Array.from({ length: Math.ceil(monthData.length / 7) * 7 }).map((_, cellIndex) => {
                      const dayIndex = cellIndex % 7
                      const weekIndex = Math.floor(cellIndex / 7)
                      const dayData = monthData[weekIndex * 7 + dayIndex]
                      
                      if (!dayData) {
                        return (
                          <div
                            key={cellIndex}
                            className="w-3 h-3"
                          />
                        )
                      }
                      
                      const date = new Date(dayData.date)
                      const isToday = dayData.date === new Date().toISOString().split('T')[0]
                      
                      return (
                        <TooltipProvider key={cellIndex}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                className={cn(
                                  'w-3 h-3 rounded-sm border cursor-pointer transition-all',
                                  intensityColors[dayData.level as keyof typeof intensityColors],
                                  intensityBorders[dayData.level as keyof typeof intensityBorders],
                                  isToday && 'ring-1 ring-white/50',
                                  dayData.sessions > 0 && 'hover:ring-1 hover:ring-white/30'
                                )}
                                whileHover={dayData.sessions > 0 ? { scale: 1.3 } : {}}
                                onClick={() => handleDayClick(dayData)}
                              />
                            </TooltipTrigger>
                            <TooltipContent 
                              side="right" 
                              className="bg-mystica-dark-200 border-indigo-500/30"
                            >
                              <div className="text-xs">
                                <p className="font-medium text-white">{formatDate(dayData.date)}</p>
                                {dayData.sessions > 0 ? (
                                  <>
                                    <p className="text-gray-300">{dayData.minutes} minutos</p>
                                    <p className="text-gray-400">{dayData.sessions} sesion{dayData.sessions > 1 ? 'es' : ''}</p>
                                  </>
                                ) : (
                                  <p className="text-gray-400">Sin actividad</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Selected Day Detail */}
        <AnimatePresence>
          {selectedDate && selectedSessions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 bg-mystica-dark-200/50 rounded-lg border border-indigo-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">{formatDate(selectedDate)}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={closeDetail}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 bg-mystica-dark-300/50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-white">{session.meditationName}</span>
                        {session.completed && (
                          <Badge className="bg-green-500/20 text-green-400 text-[10px]">
                            Completada
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{session.duration} min</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
