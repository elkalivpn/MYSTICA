'use client'

import { motion } from 'framer-motion'
import { Headphones, Clock, Flame, Sparkles, Volume2 } from 'lucide-react'

// Tibetan bowl animation component
function TibetanBowl({ delay = 0, size = 'md' }: { delay?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const rippleSize = {
    sm: 40,
    md: 50,
    lg: 60
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-600/80 to-amber-800/80 flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      {/* Bowl shine */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-400/40 to-transparent" />
      
      {/* Sound waves animation */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-amber-400/50"
          style={{
            width: rippleSize[size],
            height: rippleSize[size],
          }}
          animate={{
            scale: [1, 2.5],
            opacity: [0.6, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay + i * 0.6,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Inner glow */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-t from-amber-900/60 to-amber-500/20"
        animate={{
          boxShadow: [
            'inset 0 -4px 8px rgba(0,0,0,0.3)',
            'inset 0 -4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(251, 191, 36, 0.4)',
            'inset 0 -4px 8px rgba(0,0,0,0.3)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  )
}

const meditationTypes = [
  {
    icon: '🧘',
    name: 'Mindfulness',
    description: 'Atencion plena',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: '🌙',
    name: 'Sueno Profundo',
    description: 'Relajacion nocturna',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: '❤️',
    name: 'Chakras',
    description: 'Energia interior',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: '☀️',
    name: 'Mañana',
    description: 'Inicio consciente',
    color: 'from-amber-500 to-orange-500'
  }
]

const stats = [
  { icon: Headphones, value: '78', label: 'Meditaciones' },
  { icon: Clock, value: '15+', label: 'Categorias' },
  { icon: Flame, value: '20', label: 'Logros' }
]

export function MeditationSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-mystica">
          <span className="bg-gradient-to-r from-indigo-300 to-mystica-gold-300 bg-clip-text text-transparent">
            Meditaciones Guiadas
          </span>
        </h2>
        <p className="text-gray-400 max-w-sm">
          Encuentra paz interior con nuestras meditaciones
        </p>
      </motion.div>

      {/* Tibetan Bowls Animation */}
      <motion.div
        className="relative w-full max-w-xs h-32 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Main bowl */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            y: [0, -3, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <TibetanBowl delay={0.3} size="lg" />
        </motion.div>

        {/* Side bowls */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2"
          animate={{
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        >
          <TibetanBowl delay={0.5} size="sm" />
        </motion.div>

        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          animate={{
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7
          }}
        >
          <TibetanBowl delay={0.7} size="sm" />
        </motion.div>

        {/* Sound indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-gray-400">Sonidos binaurales y cuencos tibetanos</span>
        </motion.div>
      </motion.div>

      {/* Meditation Types */}
      <div className="grid grid-cols-2 gap-3 max-w-sm w-full mb-6">
        {meditationTypes.map((type, index) => (
          <motion.div
            key={type.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-mystica-dark-200/50 border border-mystica-purple-700/30"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-lg`}>
              {type.icon}
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold">{type.name}</h3>
              <p className="text-gray-400 text-xs">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4 max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <Icon className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Decorative sparkles */}
      <motion.div
        className="absolute top-1/4 right-10"
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Sparkles className="w-5 h-5 text-indigo-400/50" />
      </motion.div>
    </div>
  )
}
