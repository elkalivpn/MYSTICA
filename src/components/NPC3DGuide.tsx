'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export interface NPCGuide {
  id: string
  name: string
  title: string
  culture: string
  domain: string
  image: string
  color: string
  gradient: string
}

interface NPC3DGuideProps {
  guide: NPCGuide
  dialogue?: string
  isTyping?: boolean
  showDialogue?: boolean
  onSpeak?: (text: string) => void
  speaking?: boolean
  size?: 'sm' | 'md' | 'lg'
  showGlow?: boolean
  floating?: boolean
  questions?: string[]
  onSelectQuestion?: (question: string) => void
}

export function NPC3DGuide({
  guide,
  dialogue = '',
  isTyping = false,
  showDialogue = true,
  onSpeak,
  speaking = false,
  size = 'md',
  showGlow = true,
  floating = true,
  questions,
  onSelectQuestion
}: NPC3DGuideProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (dialogue && showDialogue) {
      setDisplayedText('')
      setIsAnimating(true)
      let i = 0
      const interval = setInterval(() => {
        if (i < dialogue.length) {
          setDisplayedText(dialogue.slice(0, i + 1))
          i++
        } else {
          setIsAnimating(false)
          clearInterval(interval)
        }
      }, 25)
      return () => clearInterval(interval)
    }
  }, [dialogue, showDialogue])

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-48 h-48 sm:w-56 sm:h-56'
  }

  return (
    <div className="flex flex-col items-center">
      {/* NPC Image with Floating Animation */}
      <motion.div
        className={cn("relative", sizeClasses[size])}
        animate={floating ? { y: [0, -8, 0] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glow Effect */}
        {showGlow && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-60"
            style={{ 
              background: `linear-gradient(135deg, ${guide.color}40, ${guide.color}20)` 
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Particles around NPC */}
        <div className="absolute inset-0 overflow-visible">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                backgroundColor: guide.color,
                top: `${20 + Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main Image Container */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-mystica-gold-400/50 group hover:border-mystica-gold-400/80 transition-all duration-500 shadow-2xl">
          <Image
            src={guide.image}
            alt={guide.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          
          {/* Shimmer overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Flame/Sparkle effects for magic feel */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.7, 1, 0.7],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-mystica-gold-400" />
        </motion.div>
      </motion.div>

      {/* NPC Name and Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4"
      >
        <h3 className="text-xl font-bold text-white font-mystica mb-1">
          {guide.name}
        </h3>
        <p className="text-mystica-gold-400 text-sm mb-2">{guide.title}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-mystica-purple-800/50 text-mystica-purple-200 text-xs border border-mystica-purple-600/30">
            {guide.culture}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-mystica-gold-800/30 text-mystica-gold-300 text-xs border border-mystica-gold-600/30">
            {guide.domain}
          </span>
        </div>
      </motion.div>

      {/* Dialogue Bubble */}
      <AnimatePresence>
        {showDialogue && dialogue && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="relative mt-4 w-full max-w-sm"
          >
            {/* Speech bubble pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-mystica-dark-200/90 border-l border-t border-mystica-purple-600/30" />
            
            <div className="relative p-4 rounded-xl bg-mystica-dark-200/90 border border-mystica-purple-600/30 backdrop-blur-sm">
              <p className="text-gray-100 text-sm leading-relaxed pr-8">
                {displayedText}
                {isAnimating && (
                  <motion.span
                    className="inline-block w-1 h-4 ml-1 bg-mystica-gold-400 rounded"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
              
              {/* Voice button */}
              {onSpeak && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeak(dialogue)}
                  className="absolute top-2 right-2 text-mystica-purple-300 hover:text-white p-1 h-auto"
                >
                  {speaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions */}
      {questions && questions.length > 0 && !isAnimating && onSelectQuestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full max-w-sm space-y-2"
        >
          <p className="text-xs text-mystica-purple-300 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Elige tu pregunta:
          </p>
          {questions.map((question, i) => (
            <motion.button
              key={i}
              onClick={() => onSelectQuestion(question)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full text-left p-3 rounded-lg bg-mystica-dark-200/50 border border-mystica-purple-700/30 hover:border-mystica-gold-500/50 text-gray-200 hover:text-white text-sm transition-all duration-300 group"
              whileHover={{ x: 5, scale: 1.02 }}
            >
              <Sparkles className="inline-block w-3 h-3 mr-2 text-mystica-gold-400" />
              {question}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
