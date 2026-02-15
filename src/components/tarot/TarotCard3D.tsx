'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { TarotCard } from '@/data/tarot-cards'

interface TarotCard3DProps {
  card: TarotCard
  isReversed?: boolean
  onFlip?: () => void
  isFlipped?: boolean
}

// Importar imágenes de cartas REALES desde /tarot-cards/
const cardImages: Record<number, string> = {
  0: '/tarot-cards/00-fool.png',
  1: '/tarot-cards/01-magician.png',
  2: '/tarot-cards/02-high-priestess.png',
  3: '/tarot-cards/03-empress.png',
  4: '/tarot-cards/04-emperor.png',
  5: '/tarot-cards/05-hierophant.png',
  6: '/tarot-cards/06-lovers.png',
  7: '/tarot-cards/07-chariot.png',
  8: '/tarot-cards/08-justice.png',
  9: '/tarot-cards/09-hermit.png',
  10: '/tarot-cards/10-wheel.png',
  11: '/tarot-cards/11-strength.png',
  12: '/tarot-cards/12-hanged-man.png',
  13: '/tarot-cards/13-death.png',
  14: '/tarot-cards/14-temperance.png',
  15: '/tarot-cards/15-devil.png',
  16: '/tarot-cards/16-tower.png',
  17: '/tarot-cards/17-star.png',
  18: '/tarot-cards/18-moon.png',
  19: '/tarot-cards/19-sun.png',
  20: '/tarot-cards/20-judgment.png',
  21: '/tarot-cards/21-world.png',
}

export function TarotCard3D({ card, isReversed = false, onFlip, isFlipped = false }: TarotCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const cardImage = cardImages[card.id] || '/tarot-cards/00-fool.png'

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
            {/* Background */}
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
              {[...Array(12)].map((_, i) => (
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
            <div className="relative h-full flex flex-col items-center justify-center p-3">
              <motion.div
                className="text-4xl mb-2"
                animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.2 : 1 }}
                transition={{ duration: 1.5, ease: 'linear' }}
              >
                ✨
              </motion.div>
              <div className="text-mystica-gold-400 font-mystica text-lg tracking-widest mb-1">
                MYSTICA
              </div>
              <div className="text-mystica-purple-200 text-xs tracking-wider">
                TAROT
              </div>
              <div className="mt-3 text-mystica-purple-300 text-[10px] text-center">
                Toca para revelar
              </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-mystica-gold-400/60 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-mystica-gold-400/60 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-mystica-gold-400/60 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-mystica-gold-400/60 rounded-br-lg" />

            {/* Border */}
            <div className={cn(
              "absolute inset-0 rounded-xl border-2 border-mystica-purple-500/50 transition-colors duration-300",
              isHovered && "border-mystica-gold-400/70"
            )} />
          </div>
        </div>

        {/* Card Front - IMAGEN REAL */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={cn(
            "w-full h-full relative",
            "rounded-xl overflow-hidden",
            isHovered && "shadow-[0_0_40px_rgba(251,191,36,0.5)]"
          )}>
            {/* Placeholder mientras carga */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-mystica-purple-900 to-mystica-dark-200 animate-pulse flex items-center justify-center">
                <Star className="w-8 h-8 text-mystica-purple-400 animate-spin" />
              </div>
            )}
            
            {/* Card image - IMAGEN REAL */}
            <Image
              src={cardImage}
              alt={card.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                isReversed && "rotate-180",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 33vw, 20vw"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-mystica-dark-500/90 via-transparent to-transparent" />
            
            {/* Card Number */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-mystica-dark-300/90 backdrop-blur-sm border border-mystica-purple-500/30">
              <span className="text-mystica-gold-400 font-mystica text-base font-bold">
                {card.numeral}
              </span>
            </div>

            {/* Bottom info section */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-mystica-gold-400 font-mystica text-sm font-bold mb-1 drop-shadow-lg">
                {card.name}
              </h3>
              <div className="flex flex-wrap gap-1">
                {card.keywords.slice(0, 3).map((keyword, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-mystica-purple-800/80 text-mystica-purple-100 backdrop-blur-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Reversed indicator */}
            {isReversed && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-orange-500/90 backdrop-blur-sm text-white font-bold text-xs animate-pulse shadow-lg shadow-orange-500/50">
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
