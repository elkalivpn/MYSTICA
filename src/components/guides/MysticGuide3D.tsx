'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { MysticGuide } from '@/data/mystic-guides'

interface MysticGuide3DProps {
  guide: MysticGuide
  onQuestionSelect?: (question: string) => void
  isOpen?: boolean
  onClose?: () => void
}

export function MysticGuide3D({ guide, onQuestionSelect, isOpen = true, onClose }: MysticGuide3DProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('')
      setIsTyping(true)
      setSelectedQuestion(null)
      return
    }

    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const text = guide.greeting
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1))
        i++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [guide.greeting, isOpen])

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
    if (onQuestionSelect) {
      onQuestionSelect(question)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={cn(
            "relative rounded-2xl overflow-hidden",
            "bg-gradient-to-br from-mystica-dark-100/90 to-mystica-dark-200/90",
            "border border-mystica-purple-600/30",
            "backdrop-blur-lg shadow-2xl"
          )}
        >
          {/* Animated background glow */}
          <div className={cn(
            "absolute inset-0 opacity-20 blur-xl",
            `bg-gradient-to-r ${guide.gradient}`
          )} />
          
          {/* Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("absolute w-1 h-1 rounded-full", 
                  i % 2 === 0 ? "bg-mystica-gold-400" : "bg-mystica-purple-400"
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center",
                    `bg-gradient-to-br ${guide.gradient}`,
                    "shadow-lg"
                  )}
                  animate={{ boxShadow: [`0 0 20px ${guide.color}40`, `0 0 40px ${guide.color}60`, `0 0 20px ${guide.color}40`] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl">
                    {guide.id === 'hecate' ? '🔮' : 
                     guide.id === 'frigg' ? '🦅' :
                     guide.id === 'selene' ? '🌙' :
                     guide.id === 'pythia' ? '🏛️' :
                     guide.id === 'astraea' ? '⭐' :
                     guide.id === 'morpheus' ? '💭' :
                     guide.id === 'isis' ? '🌿' :
                     guide.id === 'thoth' ? '📜' : '✨'}
                  </span>
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-bold text-white">{guide.name}</h3>
                  <p className="text-sm text-mystica-purple-300">{guide.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{guide.culture}</span>
                    <span className="text-xs text-mystica-gold-400">• {guide.domain}</span>
                  </div>
                </div>
              </div>

              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Dialogue */}
            <div className="relative mb-6 p-4 rounded-xl bg-mystica-dark-300/50 border border-mystica-purple-800/30">
              <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-mystica-dark-300/50 border-l border-t border-mystica-purple-800/30" />
              <p className="text-gray-200 text-sm leading-relaxed">
                {displayedText}
                {isTyping && <span className="inline-block w-1 h-4 ml-1 bg-mystica-gold-400 animate-pulse" />}
              </p>
            </div>

            {/* Questions */}
            {!isTyping && !selectedQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="text-xs text-gray-400 mb-2">Elige una pregunta para tu lectura:</p>
                {guide.questions.map((question, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleQuestionClick(question)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200",
                      "bg-mystica-dark-200/50 hover:bg-mystica-purple-900/30",
                      "border border-mystica-purple-800/30 hover:border-mystica-purple-600/50",
                      "text-sm text-gray-300 hover:text-white"
                    )}
                    whileHover={{ x: 5 }}
                  >
                    <Sparkles className="inline-block w-3 h-3 mr-2 text-mystica-gold-400" />
                    {question}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
