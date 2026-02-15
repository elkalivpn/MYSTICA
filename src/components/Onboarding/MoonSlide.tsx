'use client'

import { motion } from 'framer-motion'
import { Moon, Sun, Sparkles, Calendar } from 'lucide-react'

// Moon phases data
const moonPhases = [
  { id: 'new', name: 'Nueva', icon: '🌑', angle: 0 },
  { id: 'waxing-crescent', name: 'Creciente', icon: '🌒', angle: 45 },
  { id: 'first-quarter', name: 'Cuarto Creciente', icon: '🌓', angle: 90 },
  { id: 'waxing-gibbous', name: 'Gibosa Crece.', icon: '🌔', angle: 135 },
  { id: 'full', name: 'Llena', icon: '🌕', angle: 180 },
  { id: 'waning-gibbous', name: 'Gibosa Menguante', icon: '🌖', angle: 225 },
  { id: 'last-quarter', name: 'Cuarto Menguante', icon: '🌗', angle: 270 },
  { id: 'waning-crescent', name: 'Menguante', icon: '🌘', angle: 315 },
]

const lunarActivities = [
  {
    phase: 'Luna Nueva',
    description: 'Nuevos comienzos e intenciones',
    icon: Sparkles,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    phase: 'Luna Llena',
    description: 'Liberacion y manifestacion',
    icon: Moon,
    color: 'from-amber-400 to-yellow-500'
  },
  {
    phase: 'Cuartos',
    description: 'Accion y toma de decisiones',
    icon: Sun,
    color: 'from-blue-400 to-indigo-500'
  }
]

export function MoonSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-mystica">
          <span className="bg-gradient-to-r from-mystica-purple-300 to-mystica-gold-300 bg-clip-text text-transparent">
            Calendario Lunar
          </span>
        </h2>
        <p className="text-gray-400 max-w-sm">
          Sincroniza tu vida con los ciclos de la luna
        </p>
      </motion.div>

      {/* Animated Moon Phases Circle */}
      <motion.div
        className="relative w-56 h-56 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Center glowing moon */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center shadow-lg shadow-yellow-500/30">
            {/* Moon craters effect */}
            <div className="absolute inset-0 rounded-full opacity-20">
              <div className="absolute w-3 h-3 rounded-full bg-gray-400 top-3 left-4" />
              <div className="absolute w-2 h-2 rounded-full bg-gray-400 top-8 left-6" />
              <div className="absolute w-4 h-4 rounded-full bg-gray-400 bottom-4 right-4" />
            </div>
            <Moon className="w-10 h-10 text-yellow-600" />
          </div>
        </motion.div>

        {/* Orbiting phases */}
        {moonPhases.map((phase, index) => {
          const radius = 90
          const angleRad = (phase.angle * Math.PI) / 180
          const x = Math.cos(angleRad) * radius
          const y = Math.sin(angleRad) * radius

          return (
            <motion.div
              key={phase.id}
              className="absolute left-1/2 top-1/2"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                x,
                y,
                opacity: 1,
                scale: 1
              }}
              transition={{ 
                delay: 0.5 + index * 0.08,
                duration: 0.5,
                ease: 'easeOut'
              }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-mystica-dark-200/80 border border-mystica-purple-500/30 flex items-center justify-center text-lg cursor-pointer"
                whileHover={{ scale: 1.3, zIndex: 50 }}
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
              >
                {phase.icon}
              </motion.div>
            </motion.div>
          )
        })}

        {/* Orbital ring */}
        <motion.div
          className="absolute inset-4 rounded-full border border-dashed border-mystica-purple-500/20"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>

      {/* Lunar Activities */}
      <div className="grid gap-3 max-w-sm w-full mb-6">
        {lunarActivities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.15 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-mystica-dark-200/50 border border-mystica-purple-700/30"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{activity.phase}</h3>
                <p className="text-gray-400 text-sm">{activity.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Calendar reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 max-w-sm w-full"
      >
        <Calendar className="w-5 h-5 text-purple-400" />
        <p className="text-sm text-gray-300">
          Recibe recordatorios de cada fase lunar
        </p>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/3 left-6"
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scale: [0.8, 1.1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Sparkles className="w-4 h-4 text-mystica-gold-400/50" />
      </motion.div>
    </div>
  )
}
