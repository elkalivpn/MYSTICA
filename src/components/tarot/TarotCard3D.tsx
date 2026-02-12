'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { TarotCard } from '@/data/tarot-cards'

interface TarotCard3DProps {
  card: TarotCard
  isReversed?: boolean
  onFlip?: () => void
  isFlipped?: boolean
}

// Importar imágenes de cartas
const cardImages: Record<string, string> = {
  'the-fool': '/tarot-fool.png',
  'the-magician': '/tarot-fool.png',
  'the-high-priestess': '/tarot-fool.png',
  'the-empress': '/tarot-fool.png',
  'the-emperor': '/tarot-fool.png',
  'the-hierophant': '/tarot-fool.png',
  'the-lovers': '/tarot-fool.png',
  'the-chariot': '/tarot-fool.png',
  'strength': '/tarot-fool.png',
  'the-hermit': '/tarot-fool.png',
  'wheel-of-fortune': '/tarot-fool.png',
  'justice': '/tarot-fool.png',
  'the-hanged-man': '/tarot-fool.png',
  'death': '/tarot-fool.png',
  'temperance': '/tarot-fool.png',
  'the-devil': '/tarot-fool.png',
  'the-tower': '/tarot-fool.png',
  'the-star': '/tarot-fool.png',
  'the-moon': '/tarot-fool.png',
  'the-sun': '/tarot-fool.png',
  'judgement': '/tarot-fool.png',
  'the-world': '/tarot-fool.png',
}

export function TarotCard3D({ card, isReversed = false, onFlip, isFlipped = false }: TarotCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardImage = cardImages[card.id] || '/tarot-fool.png'

  return (
    <motion.div
      className="relative w-full aspect-[2/3] cursor-pointer perspective-1000"
      onClick={onFlip}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={cn(
            "w-full h-full relative",
            "rounded-xl overflow-hidden",
            isHovered && "shadow-[0_0_40px_rgba(139,92,246,0.6)]"
          )}>
            {/* Background image */}
            <div className="absolute inset-0 bg-gradient-to-br from-mystica-purple-900 via-mystica-purple-800 to-mystica-dark-100" />
            
            {/* Mystical pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="mystical-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#fbbf24" />
                  <path d="M0 10 L20 10 M10 0 L10 20" stroke="#8b5cf6" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#mystical-pattern)" />
              </svg>
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-mystica-gold-400 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
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

            {/* Central design */}
            <div className="relative h-full flex flex-col items-center justify-center p-4">
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
                transition={{ duration: 1.5, ease: 'linear' }}
              >
                ✨
              </motion.div>
              <div className="text-mystica-gold-400 font-serif text-xl tracking-widest mb-1">
                MYSTICA
              </div>
              <div className="text-mystica-purple-200 text-sm tracking-wider">
                TAROT
              </div>
              <div className="mt-4 text-mystica-purple-300 text-xs text-center">
                Toca para revelar
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-mystica-gold-400/60 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-mystica-gold-400/60 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-mystica-gold-400/60 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-mystica-gold-400/60 rounded-br-lg" />

            {/* Border glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-xl border-2 border-mystica-purple-500/50",
              isHovered && "border-mystica-gold-400/70"
            )} />
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={cn(
            "w-full h-full relative",
            "rounded-xl overflow-hidden",
            isHovered && "shadow-[0_0_40px_rgba(251,191,36,0.5)]"
          )}>
            {/* Card image background */}
            <Image
              src={cardImage}
              alt={card.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                isReversed && "rotate-180"
              )}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-mystica-dark-500/90 via-transparent to-transparent" />
            
            {/* Card Number */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-mystica-dark-300/80 backdrop-blur-sm">
              <span className="text-mystica-gold-400 font-serif text-lg font-bold">
                {card.numeral}
              </span>
            </div>

            {/* Card Name */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-mystica-dark-300/80 backdrop-blur-sm">
              <span className="text-white font-serif text-sm font-bold">
                {card.name}
              </span>
            </div>

            {/* Bottom info section */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-mystica-gold-400 font-serif text-lg font-bold mb-2">
                {card.name}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {card.keywords.slice(0, 3).map((keyword, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full bg-mystica-purple-800/60 text-mystica-purple-100 backdrop-blur-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-gray-200 text-xs leading-relaxed line-clamp-3">
                {isReversed ? card.reversed : card.upright}
              </p>
            </div>

            {/* Reversed indicator */}
            {isReversed && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="px-4 py-2 rounded-full bg-orange-500/80 backdrop-blur-sm text-white font-bold text-sm animate-pulse">
                  ⬆ INVERTIDA
                </div>
              </div>
            )}

            {/* Border */}
            <div className="absolute inset-0 rounded-xl border-2 border-mystica-gold-500/40" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
