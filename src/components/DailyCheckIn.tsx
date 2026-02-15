'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Flame, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStreak, achievements } from '@/hooks/useStreak'
import { cn } from '@/lib/utils'

interface DailyCheckInProps {
  onClose: () => void
}

export function DailyCheckIn({ onClose }: DailyCheckInProps) {
  const { checkIn, currentStreak, getAffirmation } = useStreak()
  const [checked, setChecked] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)

  const handleCheckIn = () => {
    const result = checkIn()
    setChecked(true)
    if (result.achievement) {
      setNewAchievement(result.achievement.id)
    }
  }

  const affirmation = getAffirmation()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-gradient-to-br from-mystica-dark-100 to-mystica-dark-200 rounded-2xl border border-mystica-purple-600/30 overflow-hidden shadow-2xl"
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-mystica-gold-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative p-6">
            {/* Close button */}
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>

            {!checked ? (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-mystica-purple-500 to-mystica-gold-500 flex items-center justify-center"
                    animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.5)', '0 0 40px rgba(251,191,36,0.5)', '0 0 20px rgba(139,92,246,0.5)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-1">Check-in Diario</h2>
                  <p className="text-gray-400">Comienza tu día con intención</p>
                </div>

                {/* Affirmation */}
                <div className="mb-6 p-4 rounded-xl bg-mystica-dark-300/50 border border-mystica-purple-800/30">
                  <p className="text-center text-mystica-purple-200 italic">"{affirmation}"</p>
                </div>

                {/* Streak info */}
                {currentStreak > 0 && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-medium">Racha actual: {currentStreak} días</span>
                  </div>
                )}

                {/* Check-in button */}
                <Button
                  onClick={handleCheckIn}
                  className="w-full bg-gradient-to-r from-mystica-purple-600 to-mystica-gold-600 hover:from-mystica-purple-500 hover:to-mystica-gold-500 text-white py-6 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Registrar Check-in
                </Button>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">¡Bien hecho!</h2>
                  <p className="text-gray-400 mb-6">Has registrado tu check-in de hoy</p>

                  {/* Achievement unlock */}
                  {newAchievement && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mb-6 p-4 rounded-xl bg-mystica-gold-500/20 border border-mystica-gold-500/30"
                    >
                      <div className="text-3xl mb-2">
                        {achievements.find(a => a.id === newAchievement)?.icon}
                      </div>
                      <h3 className="text-mystica-gold-400 font-bold">
                        ¡Logro Desbloqueado!
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {achievements.find(a => a.id === newAchievement)?.name}
                      </p>
                    </motion.div>
                  )}

                  <Button onClick={onClose} variant="outline" className="border-mystica-purple-600/50 text-mystica-purple-300">
                    Continuar
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
