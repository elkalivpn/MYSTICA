'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Moon, Crown, Shield, Sparkles, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getMoonPhase, getNextFullMoon, getNextNewMoon, formatDate } from '@/lib/utils'
import { NPC3DGuide } from '@/components/NPC3DGuide'
import { cn } from '@/lib/utils'

export default function LunarCalendarPage() {
  const { isAdmin, isPremium } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [moonPhase, setMoonPhase] = useState({ phase: '', illumination: 0, emoji: '🌙' })

  const seleneGuide = {
    id: 'selene',
    name: 'Selene',
    title: 'Señora de la Luna',
    culture: 'Griega',
    domain: 'Ciclos Lunares',
    image: '/guides/selene-3d.png',
    color: '#a855f7',
    gradient: 'from-purple-400 to-indigo-500'
  }

  const seleneGreeting = 'Bienvenido bajo mi luz plateada. Yo soy Selene, y la Luna es mi dominio. Sus ciclos rigen las mareas, las emociones y los ritmos de la vida. Observa su fase actual y deja que su sabiduría te guíe.'

  useEffect(() => {
    setMoonPhase(getMoonPhase(currentDate))
  }, [currentDate])

  const nextFullMoon = getNextFullMoon()
  const nextNewMoon = getNextNewMoon()

  const phaseInfo: Record<string, { description: string; energy: string; activities: string[]; color: string }> = {
    'Luna Nueva': {
      description: 'Tiempo de nuevos comienzos, siembra de intenciones y proyectos. La oscuridad es un lienzo en blanco.',
      energy: 'Introspectiva, preparatoria',
      activities: ['Meditación', 'Establecer intenciones', 'Planificación', 'Nuevos proyectos'],
      color: 'from-gray-700 to-gray-900'
    },
    'Luna Creciente': {
      description: 'Momento de crecimiento, acción y desarrollo de proyectos. La luz aumenta.',
      energy: 'Activa, expansiva',
      activities: ['Tomar acción', 'Networking', 'Aprender', 'Iniciar proyectos'],
      color: 'from-slate-600 to-gray-700'
    },
    'Cuarto Creciente': {
      description: 'Punto de decisión, evaluación del progreso. Perfecto para ajustes.',
      energy: 'Decisiva, evaluativa',
      activities: ['Tomar decisiones', 'Resolver problemas', 'Ajustar planes'],
      color: 'from-indigo-600 to-slate-700'
    },
    'Luna Gibosa Creciente': {
      description: 'Refinamiento y perfeccionamiento antes de la plenitud.',
      energy: 'Refinadora, detallista',
      activities: ['Pulir proyectos', 'Detalles finales', 'Preparación'],
      color: 'from-purple-600 to-indigo-700'
    },
    'Luna Llena': {
      description: 'Momento de culminación, manifestación y celebración. Mi poder es máximo.',
      energy: 'Máxima, reveladora',
      activities: ['Celebración', 'Manifestación', 'Gratitud', 'Liberación'],
      color: 'from-amber-200 to-yellow-300'
    },
    'Luna Gibosa Menguante': {
      description: 'Tiempo de distribución y compartir lo logrado.',
      energy: 'Distributiva, generosa',
      activities: ['Compartir', 'Enseñar', 'Distribuir', 'Donar'],
      color: 'from-purple-700 to-indigo-800'
    },
    'Cuarto Menguante': {
      description: 'Momento de reorganización y ajuste.',
      energy: 'Reorganizadora, ajustada',
      activities: ['Reorganizar', 'Ajustar', 'Transicionar'],
      color: 'from-indigo-700 to-purple-800'
    },
    'Luna Menguante': {
      description: 'Tiempo de liberación, descanso y preparación para el nuevo ciclo.',
      energy: 'Liberadora, descansada',
      activities: ['Liberar', 'Descansar', 'Limpiar', 'Perdonar'],
      color: 'from-gray-800 to-slate-900'
    }
  }

  const currentPhaseInfo = phaseInfo[moonPhase.phase] || phaseInfo['Luna Nueva']

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-indigo-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-mystica">
                  Calendario Lunar
                </h1>
                <p className="text-xs text-gray-400">Fases y rituales lunares</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Selene 3D Guide */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={seleneGuide}
                dialogue={seleneGreeting}
                showDialogue={true}
                size="md"
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Current Phase */}
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/30 overflow-hidden">
              <CardContent className="p-8 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  {moonPhase.emoji}
                </motion.div>
                <h2 className="text-3xl font-bold text-white font-mystica mb-2">{moonPhase.phase}</h2>
                <p className="text-gray-400 mb-4">{formatDate(currentDate)}</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-full bg-mystica-dark-300 rounded-full h-3 max-w-xs">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-500 via-purple-400 to-yellow-200 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${moonPhase.illumination}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{Math.round(moonPhase.illumination)}%</span>
                </div>
                <p className="text-gray-300 max-w-lg mx-auto leading-relaxed">{currentPhaseInfo.description}</p>
              </CardContent>
            </Card>

            {/* Energy & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-mystica-dark-200/60 border-indigo-500/30">
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-indigo-400 mb-3 flex items-center gap-2 font-mystica">
                    <Sparkles className="w-5 h-5" />
                    Energía del Momento
                  </h3>
                  <p className="text-gray-300">{currentPhaseInfo.energy}</p>
                </CardContent>
              </Card>
              <Card className="bg-mystica-dark-200/60 border-indigo-500/30">
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2 font-mystica">
                    <Moon className="w-5 h-5" />
                    Actividades Recomendadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPhaseInfo.activities.map((activity, i) => (
                      <Badge key={i} className="bg-indigo-900/50 text-indigo-200 border border-indigo-500/30">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Phases */}
            <h2 className="text-lg font-bold text-white font-mystica">Próximas Fases Importantes</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-mystica-dark-200/60 border-yellow-500/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-5xl">🌕</span>
                  <div>
                    <p className="font-bold text-white">Próxima Luna Llena</p>
                    <p className="text-yellow-300 text-sm">{formatDate(nextFullMoon)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-mystica-dark-200/60 border-gray-500/30">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-5xl">🌑</span>
                  <div>
                    <p className="font-bold text-white">Próxima Luna Nueva</p>
                    <p className="text-gray-300 text-sm">{formatDate(nextNewMoon)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Phases */}
            <h2 className="text-lg font-bold text-white font-mystica">Guía de Fases Lunares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(phaseInfo).map(([phase, info]) => (
                <motion.div
                  key={phase}
                  whileHover={{ scale: 1.03 }}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer",
                    moonPhase.phase === phase
                      ? "bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-400/50 ring-1 ring-indigo-400"
                      : "bg-mystica-dark-200/50 border-gray-700/50 hover:border-indigo-500/30"
                  )}
                >
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
                  <p className="text-xs text-gray-500 mt-1">{info.energy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
