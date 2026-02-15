'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Sun, Moon as MoonIcon, Eye } from 'lucide-react'
import Image from 'next/image'

// Tarot cards data for animation
const tarotCards = [
  { id: 0, name: 'El Loco', image: '/tarot-cards/00-fool.png' },
  { id: 1, name: 'La Sacerdotisa', image: '/tarot-cards/02-high-priestess.png' },
  { id: 2, name: 'La Luna', image: '/tarot-cards/18-moon.png' },
  { id: 3, name: 'El Mago', image: '/tarot-cards/01-magician.png' },
  { id: 4, name: 'La Estrella', image: '/tarot-cards/17-star.png' },
]

const features = [
  {
    icon: Sparkles,
    title: 'Lecturas de Tarot',
    description: '22 Arcanos Mayores con interpretaciones detalladas'
  },
  {
    icon: Sun,
    title: 'Oraculo Diario',
    description: 'Mensajes del universo para guiarte cada dia'
  },
  {
    icon: Eye,
    title: 'Tiradas Especiales',
    description: 'Cruz Celta, Relacion, Decision y mas'
  }
]

export function TarotSlide() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 font-mystica">
          <span className="bg-gradient-to-r from-mystica-purple-300 to-mystica-gold-300 bg-clip-text text-transparent">
            Tarot y Oraculo
          </span>
        </h2>
        <p className="text-gray-400 max-w-sm">
          Conecta con la sabiduria ancestral de las cartas
        </p>
      </motion.div>

      {/* Animated Tarot Cards */}
      <div className="relative w-full max-w-xs h-48 mb-8">
        {/* Cards spread */}
        <AnimatePresence>
          {tarotCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="absolute left-1/2"
              initial={{ 
                x: '-50%',
                y: 100,
                rotate: 0,
                opacity: 0 
              }}
              animate={{ 
                x: `calc(-50% + ${(index - 2) * 35}px)`,
                y: Math.abs(index - 2) * 8,
                rotate: (index - 2) * 8,
                opacity: 1
              }}
              transition={{ 
                delay: 0.1 + index * 0.15,
                duration: 0.6,
                ease: 'easeOut'
              }}
            >
              <motion.div
                className="relative w-16 h-28 rounded-lg overflow-hidden border border-mystica-purple-500/30 shadow-xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.2) 0%, rgba(26, 26, 46, 0.9) 100%)'
                }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.1
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                />
                {/* Card glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-mystica-purple-500/30 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hecate image on the side */}
        <motion.div
          className="absolute -right-4 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="relative w-24 h-32"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Image
              src="/guides/hecate-3d.png"
              alt="Hecate - Diosa de la Magia"
              fill
              className="object-contain drop-shadow-2xl"
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
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
          </motion.div>
        </motion.div>
      </div>

      {/* Features list */}
      <div className="grid gap-4 max-w-sm w-full">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.15 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-mystica-dark-200/50 border border-mystica-purple-700/30"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 flex items-center justify-center">
                <Icon className="w-5 h-5 text-mystica-gold-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/4 left-8"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <MoonIcon className="w-6 h-6 text-mystica-purple-400/50" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 right-8"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5
        }}
      >
        <Sparkles className="w-5 h-5 text-mystica-gold-400/50" />
      </motion.div>
    </div>
  )
}
