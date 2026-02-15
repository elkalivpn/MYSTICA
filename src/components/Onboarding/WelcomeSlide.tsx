'use client'

import { motion } from 'framer-motion'
import { Moon, Sparkles, Star } from 'lucide-react'

export function WelcomeSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Animated Logo */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 20,
          delay: 0.2 
        }}
      >
        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            width: '180%',
            height: '180%',
            left: '-40%',
            top: '-40%'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Main logo container */}
        <motion.div
          className="relative w-32 h-32 rounded-full bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-900 flex items-center justify-center border-2 border-mystica-gold-400/40 glow-mystica-intense"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Inner glow */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-mystica-purple-400/30 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {/* Moon icon */}
          <motion.div
            animate={{
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Moon className="w-16 h-16 text-mystica-gold-300" />
          </motion.div>

          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0 
              }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * 60,
                y: Math.sin((i * Math.PI * 2) / 8) * 60,
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut'
              }}
            >
              <Sparkles className="w-4 h-4 text-mystica-gold-400" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 font-mystica">
          <span className="bg-gradient-to-r from-mystica-purple-300 via-mystica-gold-300 to-mystica-purple-300 bg-clip-text text-transparent">
            Bienvenido a Mystica
          </span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-lg sm:text-xl text-gray-300 mb-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Tu portal al mundo mistico
      </motion.p>

      {/* Description */}
      <motion.div
        className="max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-gray-400 text-sm leading-relaxed">
          Descubre el poder del tarot, las meditaciones guiadas, 
          el calendario lunar y mucho mas. Tu viaje espiritual comienza aqui.
        </p>
      </motion.div>

      {/* Floating stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 1.2, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          >
            <Star className="w-3 h-3 text-mystica-gold-400/60" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
