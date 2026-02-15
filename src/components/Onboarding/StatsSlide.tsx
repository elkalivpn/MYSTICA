'use client'

import { motion } from 'framer-motion'
import { Trophy, Flame, Target, Star, Zap, Crown, Award, TrendingUp } from 'lucide-react'

// Levels data
const levels = [
  { level: 1, name: 'Aprendiz', xp: 0, color: 'from-gray-400 to-gray-500' },
  { level: 5, name: 'Buscador', xp: 500, color: 'from-green-400 to-emerald-500' },
  { level: 10, name: 'Iniciado', xp: 1500, color: 'from-blue-400 to-cyan-500' },
  { level: 20, name: 'Mistico', xp: 5000, color: 'from-purple-400 to-violet-500' },
  { level: 30, name: 'Maestro', xp: 10000, color: 'from-amber-400 to-yellow-500' },
]

const achievements = [
  { icon: Flame, name: 'Primera Llama', description: '7 dias de racha', unlocked: true },
  { icon: Star, name: 'Astral', description: '10 lecturas de tarot', unlocked: true },
  { icon: Target, name: 'Enfoque', description: '30 min meditando', unlocked: false },
  { icon: Trophy, name: 'Campeon', description: '50 dias activo', unlocked: false },
]

const progressionTypes = [
  {
    icon: TrendingUp,
    title: 'Experiencia',
    description: 'Gana XP con cada accion',
    color: 'text-green-400'
  },
  {
    icon: Flame,
    title: 'Rachas',
    description: 'Mantente activo cada dia',
    color: 'text-orange-400'
  },
  {
    icon: Trophy,
    title: 'Logros',
    description: 'Desbloquea recompensas',
    color: 'text-yellow-400'
  },
  {
    icon: Crown,
    title: 'Niveles',
    title: 'Niveles',
    description: 'Sube de rango mistico',
    color: 'text-purple-400'
  }
]

export function StatsSlide() {
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
            Tu Progreso Mistico
          </span>
        </h2>
        <p className="text-gray-400 max-w-sm">
          Un viaje de crecimiento personal y espiritual
        </p>
      </motion.div>

      {/* Level Progress Demo */}
      <motion.div
        className="w-full max-w-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(251, 191, 36, 0.3)',
                    '0 0 20px rgba(251, 191, 36, 0.5)',
                    '0 0 10px rgba(251, 191, 36, 0.3)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-white font-semibold">Nivel 5</p>
                <p className="text-xs text-mystica-gold-300">Buscador</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">850 / 1500 XP</p>
              <p className="text-xs text-mystica-purple-300">Proximo: Iniciado</p>
            </div>
          </div>
          
          {/* XP Bar */}
          <div className="h-2 bg-mystica-dark-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: '57%' }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Progression Types */}
      <div className="grid grid-cols-2 gap-3 max-w-sm w-full mb-6">
        {progressionTypes.map((type, index) => {
          const Icon = type.icon
          return (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-mystica-dark-200/50 border border-mystica-purple-700/30"
            >
              <Icon className={`w-5 h-5 ${type.color}`} />
              <div>
                <h3 className="text-white text-sm font-semibold">{type.title}</h3>
                <p className="text-gray-400 text-xs">{type.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Achievements Preview */}
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Ejemplo de logros
        </p>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-amber-500/30' 
                    : 'bg-mystica-dark-200/30 border-gray-700/30 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-600' 
                    : 'bg-gray-600'
                }`}>
                  <Icon className={`w-4 h-4 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Streak indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4 }}
        className="flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30"
      >
        <Flame className="w-5 h-5 text-orange-400" />
        <span className="text-sm text-orange-300">Las rachas te dan bonus de XP</span>
      </motion.div>

      {/* Decorative */}
      <motion.div
        className="absolute top-1/3 right-8"
        animate={{
          opacity: [0.2, 0.6, 0.2],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Zap className="w-5 h-5 text-amber-400/50" />
      </motion.div>
    </div>
  )
}
