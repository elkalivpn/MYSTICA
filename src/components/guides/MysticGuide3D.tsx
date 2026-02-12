'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import type { MysticGuide } from '@/data/mystic-guides'

interface MysticGuide3DProps {
  guide: MysticGuide
  onQuestionSelect?: (question: string) => void
  isOpen?: boolean
  onClose?: () => void
}

// Mapa de imágenes de guías
const guideImages: Record<string, string> = {
  'hecate': '/hecate-3d.png',
  'frigg': '/frigg-3d.png',
  'selene': '/selene-3d.png',
  'pythia': '/hecate-3d.png',
  'astraea': '/selene-3d.png',
  'morpheus': '/selene-3d.png',
  'isis': '/hecate-3d.png',
  'thoth': '/frigg-3d.png',
}

export function MysticGuide3D({ guide, onQuestionSelect, isOpen = true, onClose }: MysticGuide3DProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [speaking, setSpeaking] = useState(false)

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

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.9
      utterance.pitch = 0.8
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
    if (onQuestionSelect) {
      onQuestionSelect(question)
    }
  }

  const guideImage = guideImages[guide.id] || '/hecate-3d.png'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className={cn(
            "relative rounded-2xl overflow-hidden",
            "bg-gradient-to-br from-mystica-dark-100/95 to-mystica-dark-300/95",
            "border-2 border-mystica-purple-500/40",
            "backdrop-blur-xl shadow-2xl shadow-mystica-purple-500/20"
          )}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute w-1 h-1 rounded-full blur-sm",
                  i % 3 === 0 ? "bg-mystica-gold-400" : 
                  i % 3 === 1 ? "bg-mystica-purple-400" : "bg-white"
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -150],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                }}
              />
            ))}
          </div>

          {/* Mystical glow effect */}
          <div className={cn(
            "absolute inset-0 opacity-30 blur-3xl",
            `bg-gradient-to-r ${guide.gradient}`
          )} />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                {/* 3D Avatar Image */}
                <motion.div
                  className="relative w-28 h-28 rounded-2xl overflow-hidden"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-mystica-purple-600/50 to-mystica-gold-500/50 animate-pulse" />
                  <Image
                    src={guideImage}
                    alt={guide.name}
                    fill
                    className={cn(
                      "object-cover transition-all duration-500",
                      imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
                    )}
                    onLoad={() => setImageLoaded(true)}
                    priority
                  />
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-mystica-gold-400/50"
                    animate={{
                      boxShadow: [
                        '0 0 10px rgba(251, 191, 36, 0.3)',
                        '0 0 30px rgba(251, 191, 36, 0.6)',
                        '0 0 10px rgba(251, 191, 36, 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-white mb-1"
                  >
                    {guide.name}
                  </motion.h3>
                  <p className="text-mystica-gold-400 font-medium">{guide.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-mystica-purple-800/50 text-mystica-purple-200 text-xs">
                      {guide.culture}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-mystica-gold-800/30 text-mystica-gold-300 text-xs">
                      {guide.domain}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speaking ? window.speechSynthesis.cancel() : speak(guide.greeting)}
                  className="text-mystica-purple-300 hover:text-white hover:bg-mystica-purple-800/30"
                >
                  {speaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                {onClose && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-mystica-purple-800/30"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Dialogue Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mb-6 p-5 rounded-xl bg-mystica-dark-300/80 border border-mystica-purple-600/30"
            >
              <div className="absolute -top-2 left-6 w-4 h-4 rotate-45 bg-mystica-dark-300/80 border-l border-t border-mystica-purple-600/30" />
              <p className="text-gray-100 text-base leading-relaxed">
                {displayedText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-2 h-5 ml-1 bg-mystica-gold-400 rounded"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                )}
              </p>
            </motion.div>

            {/* Questions */}
            {!isTyping && !selectedQuestion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <p className="text-sm text-mystica-purple-300 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Elige tu pregunta para la lectura:
                </p>
                {guide.questions.map((question, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleQuestionClick(question)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all duration-300",
                      "bg-gradient-to-r from-mystica-dark-200/80 to-mystica-dark-300/80",
                      "border border-mystica-purple-700/30",
                      "hover:border-mystica-gold-500/50 hover:shadow-lg hover:shadow-mystica-purple-500/10",
                      "text-gray-200 hover:text-white",
                      "group"
                    )}
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="inline-block w-4 h-4 mr-3 text-mystica-gold-400 group-hover:animate-pulse" />
                    <span className="font-medium">{question}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Selected question confirmation */}
            {selectedQuestion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-mystica-purple-900/30 to-mystica-dark-200/50 border border-mystica-gold-500/30"
              >
                <Sparkles className="w-8 h-8 text-mystica-gold-400 mx-auto mb-3 animate-pulse" />
                <p className="text-mystica-purple-200 italic text-lg">
                  "{selectedQuestion}"
                </p>
                <p className="text-gray-400 text-sm mt-3">
                  Las cartas están siendo barajadas...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
