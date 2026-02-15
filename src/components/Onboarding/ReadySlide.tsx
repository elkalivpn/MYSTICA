'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Star, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useOnboarding, zodiacOptions } from '@/hooks/useOnboarding'

interface ReadySlideProps {
  onComplete: () => void
}

export function ReadySlide({ onComplete }: ReadySlideProps) {
  const { userName, userZodiac, setUserName, setUserZodiac } = useOnboarding()
  const [showZodiacPicker, setShowZodiacPicker] = useState(false)
  const [nameError, setNameError] = useState('')

  const handleNameChange = (value: string) => {
    setUserName(value)
    if (nameError && value.trim().length >= 2) {
      setNameError('')
    }
  }

  const handleComplete = () => {
    if (userName.trim().length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres')
      return
    }
    onComplete()
  }

  const selectedZodiac = zodiacOptions.find(z => z.id === userZodiac)

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          className="mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mystica-purple-500 to-mystica-purple-700 flex items-center justify-center border-2 border-mystica-gold-400/40 glow-mystica">
            <Sparkles className="w-10 h-10 text-mystica-gold-300" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-mystica">
          <span className="bg-gradient-to-r from-mystica-purple-300 to-mystica-gold-300 bg-clip-text text-transparent">
            Listo para Comenzar
          </span>
        </h2>
        <p className="text-gray-400 max-w-sm">
          Personaliza tu experiencia mistica
        </p>
      </motion.div>

      {/* Name Input */}
      <motion.div
        className="w-full max-w-sm mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-mystica-purple-400" />
          Tu nombre
        </label>
        <Input
          value={userName}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Como te llamas?"
          className={cn(
            "bg-mystica-dark-200/50 border-mystica-purple-700/30 text-white placeholder-gray-500 h-12 text-lg",
            nameError && "border-red-500/50 focus-visible:ring-red-500/50"
          )}
        />
        {nameError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm mt-1"
          >
            {nameError}
          </motion.p>
        )}
      </motion.div>

      {/* Zodiac Selector */}
      <motion.div
        className="w-full max-w-sm mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-mystica-gold-400" />
          Tu signo zodiacal (opcional)
        </label>
        
        {/* Dropdown trigger */}
        <button
          onClick={() => setShowZodiacPicker(!showZodiacPicker)}
          className={cn(
            "w-full h-12 px-4 rounded-lg bg-mystica-dark-200/50 border border-mystica-purple-700/30",
            "flex items-center justify-between text-left",
            "hover:border-mystica-purple-500/50 transition-colors"
          )}
        >
          {selectedZodiac ? (
            <span className="text-white flex items-center gap-2">
              <span className="text-lg">{selectedZodiac.symbol}</span>
              {selectedZodiac.name}
              <span className="text-xs text-gray-400 ml-2">{selectedZodiac.dates}</span>
            </span>
          ) : (
            <span className="text-gray-500">Selecciona tu signo</span>
          )}
          <ChevronDown className={cn(
            "w-5 h-5 text-gray-400 transition-transform",
            showZodiacPicker && "rotate-180"
          )} />
        </button>

        {/* Zodiac grid dropdown */}
        {showZodiacPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 rounded-xl bg-mystica-dark-200 border border-mystica-purple-700/30 grid grid-cols-3 gap-2"
          >
            {zodiacOptions.map((zodiac) => (
              <button
                key={zodiac.id}
                onClick={() => {
                  setUserZodiac(zodiac.id)
                  setShowZodiacPicker(false)
                }}
                className={cn(
                  "p-2 rounded-lg flex flex-col items-center gap-1 transition-all",
                  userZodiac === zodiac.id
                    ? "bg-gradient-to-r from-mystica-purple-600 to-mystica-purple-700 border border-mystica-gold-400/40"
                    : "bg-mystica-dark-100/50 hover:bg-mystica-dark-100 border border-transparent"
                )}
              >
                <span className="text-xl">{zodiac.symbol}</span>
                <span className="text-xs text-white">{zodiac.name}</span>
              </button>
            ))}
            
            {/* Clear selection button */}
            {userZodiac && (
              <button
                onClick={() => {
                  setUserZodiac('')
                  setShowZodiacPicker(false)
                }}
                className="col-span-3 p-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 text-red-400 text-sm transition-colors"
              >
                Quitar seleccion
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Begin Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={handleComplete}
          size="lg"
          className="w-full h-14 text-lg bg-gradient-to-r from-mystica-purple-600 to-mystica-purple-700 hover:from-mystica-purple-500 hover:to-mystica-purple-600 border border-mystica-gold-400/30 shadow-lg shadow-mystica-purple-500/20"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Comenzar mi viaje
        </Button>
      </motion.div>

      {/* Privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-gray-500 mt-4 text-center max-w-sm"
      >
        Tu informacion se guarda de forma local en tu dispositivo. 
        No compartimos tus datos con nadie.
      </motion.p>

      {/* Decorative stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
        >
          <Star className="w-3 h-3 text-mystica-gold-400/40" />
        </motion.div>
      ))}
    </div>
  )
}
