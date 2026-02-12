'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TarotCard } from '@/data/tarot-cards'

interface TarotCard3DProps {
  card: TarotCard
  isReversed?: boolean
  onFlip?: () => void
  isFlipped?: boolean
}

export function TarotCard3D({ card, isReversed = false, onFlip, isFlipped = false }: TarotCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative w-full aspect-[2/3] cursor-pointer perspective-1000"
      onClick={onFlip}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={cn(
            "w-full h-full bg-gradient-to-br from-mystica-purple-800 via-mystica-dark-100 to-mystica-purple-900",
            "border-2 border-mystica-purple-600/50 rounded-xl p-4 flex items-center justify-center",
            isHovered && "shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          )}>
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-mystica-gold-400 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
              ))}
            </div>
            <div className="relative text-center">
              <motion.div
                className="text-4xl mb-2"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 2, ease: 'linear' }}
              >
                ✨
              </motion.div>
              <div className="text-mystica-gold-400 font-serif text-lg tracking-wider">MYSTICA</div>
              <div className="text-mystica-purple-300 text-xs mt-1">TAROT</div>
            </div>
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-mystica-gold-400/50 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-mystica-gold-400/50 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-mystica-gold-400/50 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-mystica-gold-400/50 rounded-br-lg" />
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={cn(
            "w-full h-full bg-gradient-to-br from-mystica-dark-100 to-mystica-dark-200",
            "border-2 border-mystica-purple-600/50 rounded-xl p-4",
            isHovered && "shadow-[0_0_30px_rgba(251,191,36,0.3)]"
          )}>
            {/* Card Number */}
            <div className="absolute top-2 left-3 text-mystica-gold-400 font-serif text-xl">
              {card.numeral}
            </div>
            
            {/* Card Name */}
            <div className={cn(
              "absolute top-2 right-3 text-white font-serif text-sm text-right",
              isReversed && "rotate-180"
            )}>
              {card.name}
            </div>

            {/* Card Content */}
            <div className={cn(
              "h-full flex flex-col items-center justify-center text-center",
              isReversed && "rotate-180"
            )}>
              <div className="text-3xl mb-3">{card.id === 0 ? '🃏' : '✨'}</div>
              <h3 className="text-mystica-gold-400 font-serif text-lg mb-2">{card.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {card.keywords.slice(0, 3).map((keyword, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-mystica-purple-800/50 text-mystica-purple-200">
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-xs line-clamp-4">
                {isReversed ? card.reversed : card.upright}
              </p>
            </div>

            {/* Reversed indicator */}
            {isReversed && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-orange-400">
                ⬆ Invertida
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
