'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Moon, Crown, Shield, Sun, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getMoonPhase, getNextFullMoon, getNextNewMoon, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function LunarCalendarPage() {
  const { isAdmin, isPremium } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [moonPhase, setMoonPhase] = useState({ phase: '', illumination: 0, emoji: '🌙' })

  useEffect(() => {
    setMoonPhase(getMoonPhase(currentDate))
  }, [currentDate])

  const nextFullMoon = getNextFullMoon()
  const nextNewMoon = getNextNewMoon()

  const phaseInfo: Record<string, { description: string; energy: string; activities: string[] }> = {
    'Luna Nueva': {
      description: 'Tiempo de nuevos comienzos, siembra de intenciones y proyectos.',
      energy: 'Introspectiva, preparatoria',
      activities: ['Meditación', 'Establecer intenciones', 'Planificación', 'Nuevos proyectos']
    },
    'Luna Creciente': {
      description: 'Momento de crecimiento, acción y desarrollo de proyectos.',
      energy: 'Activa, expansiva',
      activities: ['Tomar acción', 'Networking', 'Aprender', 'Iniciar proyectos']
    },
    'Cuarto Creciente': {
      description: 'Punto de decisión, evaluación del progreso.',
      energy: 'Decisiva, evaluativa',
      activities: ['Tomar decisiones', 'Resolver problemas', 'Ajustar planes']
    },
    'Luna Gibosa Creciente': {
      description: 'Refinamiento y perfeccionamiento antes de la plenitud.',
      energy: 'Refinadora, detallista',
      activities: ['Pulir proyectos', 'Detalles finales', 'Preparación']
    },
    'Luna Llena': {
      description: 'Momento de culminación, manifestación y celebración.',
      energy: 'Máxima, reveladora',
      activities: ['Celebración', 'Manifestación', 'Gratitud', 'Liberación']
    },
    'Luna Gibosa Menguante': {
      description: 'Tiempo de distribución y compartir lo logrado.',
      energy: 'Distributiva, generosa',
      activities: ['Compartir', 'Enseñar', 'Distribuir', 'Donar']
    },
    'Cuarto Menguante': {
      description: 'Momento de reorganización y ajuste.',
      energy: 'Reorganizadora, ajustada',
      activities: ['Reorganizar', 'Ajustar', 'Transicionar']
    },
    'Luna Menguante': {
      description: 'Tiempo de liberación, descanso y preparación para el nuevo ciclo.',
      energy: 'Liberadora, descansada',
      activities: ['Liberar', 'Descansar', 'Limpiar', 'Perdonar']
    }
  }

  const currentPhaseInfo = phaseInfo[moonPhase.phase] || phaseInfo['Luna Nueva']

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-indigo-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Calendario Lunar</h1>
                <p className="text-sm text-gray-400">Fases y rituales lunares</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Phase */}
        <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30 overflow-hidden mb-8">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              {moonPhase.emoji}
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">{moonPhase.phase}</h2>
            <p className="text-gray-400 mb-4">{formatDate(currentDate)}</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-full bg-mystica-dark-300 rounded-full h-2 max-w-xs">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${moonPhase.illumination}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{Math.round(moonPhase.illumination)}%</span>
            </div>
            <p className="text-gray-300 max-w-lg mx-auto">{currentPhaseInfo.description}</p>
          </CardContent>
        </Card>

        {/* Energy & Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-indigo-400 mb-4">Energía del Momento</h3>
              <p className="text-gray-300">{currentPhaseInfo.energy}</p>
            </CardContent>
          </Card>
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-indigo-400 mb-4">Actividades Recomendadas</h3>
              <div className="flex flex-wrap gap-2">
                {currentPhaseInfo.activities.map((activity, i) => (
                  <Badge key={i} className="bg-indigo-900/50 text-indigo-200">{activity}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Phases */}
        <h2 className="text-xl font-bold text-white mb-4">Próximas Fases Importantes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-4xl">🌕</span>
              <div>
                <p className="font-bold text-white">Próxima Luna Llena</p>
                <p className="text-gray-400">{formatDate(nextFullMoon)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-4xl">🌑</span>
              <div>
                <p className="font-bold text-white">Próxima Luna Nueva</p>
                <p className="text-gray-400">{formatDate(nextNewMoon)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Phases */}
        <h2 className="text-xl font-bold text-white mb-4">Guía de Fases Lunares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(phaseInfo).map(([phase, info]) => (
            <Card
              key={phase}
              className={cn(
                "bg-mystica-dark-100/50 border-gray-700 cursor-pointer transition-all hover:border-indigo-500/50",
                moonPhase.phase === phase && "border-indigo-500 ring-1 ring-indigo-500"
              )}
            >
              <CardContent className="p-4 text-center">
                <span className="text-3xl mb-2 block">
                  {phase === 'Luna Nueva' ? '🌑' :
                   phase === 'Luna Creciente' ? '🌒' :
                   phase === 'Cuarto Creciente' ? '🌓' :
                   phase === 'Luna Gibosa Creciente' ? '🌔' :
                   phase === 'Luna Llena' ? '🌕' :
                   phase === 'Luna Gibosa Menguante' ? '🌖' :
                   phase === 'Cuarto Menguante' ? '🌗' : '🌘'}
                </span>
                <p className="text-sm font-medium text-white">{phase}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
