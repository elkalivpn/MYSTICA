'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Crown, Shield, RefreshCw, X, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { tarotCards, TarotCard } from '@/data/tarot-cards'
import { TarotCard3D } from '@/components/tarot/TarotCard3D'
import { ParticleField } from '@/components/effects/ParticleField'
import { MysticalGlow } from '@/components/effects/MysticalGlow'
import { FloatingOrbs } from '@/components/effects/FloatingOrbs'
import { PageTransition } from '@/components/transitions/PageTransition'
import Image from 'next/image'
import '@/styles/animations.css'

export default function TarotPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium
  
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([])
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [canReadToday, setCanReadToday] = useState(true)
  const [cooldownHours, setCooldownHours] = useState(0)
  const [guideText, setGuideText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [cardParticles, setCardParticles] = useState<{id: number, x: number, y: number}[]>([])

  const maxCards = canAccessPremium ? 5 : 3

  // Hecate greeting
  const hecateGreeting = 'Te doy la bienvenida, caminante de los misterios. Las cartas aguardan silenciosas, como antorchas en la oscuridad...'

  const hecateQuestions = [
    'Que camino te resulta dificil ver en este momento?',
    'Que verdad temes enfrentar?',
    'Que puerta estas lista para abrir?'
  ]

  const hecateRevealMessages = [
    'Las cartas han hablado... Observa con atencion su mensaje.',
    'El velo se descorre... La sabiduria ancestral se revela ante ti.',
    'Los arcanos han elegido hablarte... Escucha con el corazon.',
  ]

  useEffect(() => {
    // Typewriter effect for guide text
    if (showGuide) {
      setGuideText('')
      setIsTyping(true)
      let i = 0
      const interval = setInterval(() => {
        if (i < hecateGreeting.length) {
          setGuideText(hecateGreeting.slice(0, i + 1))
          i++
        } else {
          setIsTyping(false)
          clearInterval(interval)
        }
      }, 30)
      return () => clearInterval(interval)
    }
  }, [showGuide])

  useEffect(() => {
    const lastReading = localStorage.getItem('lastTarotReading')
    if (lastReading && !canAccessPremium) {
      const lastDate = new Date(lastReading)
      const now = new Date()
      const hoursDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60)
      if (hoursDiff < 24) {
        setCanReadToday(false)
        setCooldownHours(Math.ceil(24 - hoursDiff))
      }
    }
  }, [canAccessPremium])

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

  // Spawn particles on card reveal
  const spawnParticles = (index: number) => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + (index * 20),
      y: 50,
    }))
    setCardParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setCardParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 2000)
  }

  const drawCards = () => {
    setIsDrawing(true)
    setSelectedCards([])
    setRevealedCards([])
    
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
      const drawn = shuffled.slice(0, maxCards)
      setSelectedCards(drawn)
      setIsDrawing(false)
      setShowGuide(false)
      if (!canAccessPremium) {
        localStorage.setItem('lastTarotReading', new Date().toISOString())
        setCanReadToday(false)
        setCooldownHours(24)
      }
    }, 1500)
  }

  const flipCard = (index: number) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index])
      spawnParticles(index)
      // Hecate speaks when all cards are revealed
      if (revealedCards.length === selectedCards.length - 1) {
        const randomMessage = hecateRevealMessages[Math.floor(Math.random() * hecateRevealMessages.length)]
        setGuideText(randomMessage)
      }
    }
  }

  const resetReading = () => {
    setSelectedCards([])
    setRevealedCards([])
    setSelectedQuestion(null)
    setShowGuide(true)
  }

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question)
    setShowGuide(false)
  }

  return (
    <PageTransition variant="fade">
      <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-purple-900/10 to-mystica-dark-100 relative">
        {/* Background particles */}
        <ParticleField
          count={30}
          color="mystic"
          minSize={1}
          maxSize={2}
          shape="star"
          movement="float"
          className="z-0"
        />
        
        {/* Floating orbs for ambiance */}
        <FloatingOrbs
          count={3}
          colorTheme="mystic"
          minSize={60}
          maxSize={120}
          position="sides"
          speed={0.4}
          className="z-0"
        />
        
        {/* Card reveal particles */}
        <AnimatePresence>
          {cardParticles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute z-20 pointer-events-none"
              style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              initial={{ opacity: 1, scale: 0 }}
              animate={{ 
                opacity: [1, 0], 
                scale: [0, 1.5],
                y: [0, -100],
                x: [0, (Math.random() - 0.5) * 100]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <Sparkles className="w-4 h-4 text-mystica-gold-400" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Header */}
        <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-mystica-purple-800/20">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-mystica">
                    Lectura de Tarot
                  </h1>
                  <p className="text-xs text-gray-400">22 Arcanos Mayores</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Hecate 3D Guide - Floating on left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-72 flex-shrink-0"
            >
              <div className="lg:sticky lg:top-36">
                {/* Guide Image with Glow */}
                <MysticalGlow
                  color="purple"
                  intensity="intense"
                  size={200}
                  animated
                  pulse
                >
                  <motion.div
                    className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto lg:mx-0 mb-4"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-pink-600/50 rounded-full blur-xl opacity-60" />
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-mystica-gold-400/50 glow-mystica-intense">
                      <Image
                        src="/guides/hecate-3d.png"
                        alt="Hecate - Diosa de la Magia"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </motion.div>
                </MysticalGlow>

                {/* Guide Info */}
                <div className="text-center lg:text-left mb-4">
                  <h2 className="text-2xl font-bold text-white font-mystica mb-1">Hecate</h2>
                  <p className="text-mystica-gold-400 text-sm mb-2">Guardiana de las Encrucijadas</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-mystica-purple-800/50 text-mystica-purple-200 text-xs">
                      Griega
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-mystica-gold-800/30 text-mystica-gold-300 text-xs">
                      Tarot
                    </span>
                  </div>
                </div>

                {/* Guide Dialogue */}
                {(showGuide || revealedCards.length === selectedCards.length) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-4 rounded-xl bg-mystica-dark-200/80 border border-mystica-purple-600/30 backdrop-blur-sm"
                  >
                    <div className="absolute -top-2 left-6 lg:left-6 w-4 h-4 rotate-45 bg-mystica-dark-200/80 border-l border-t border-mystica-purple-600/30" />
                    <p className="text-gray-100 text-sm leading-relaxed">
                      {guideText}
                      {isTyping && (
                        <motion.span
                          className="inline-block w-1 h-4 ml-1 bg-mystica-gold-400 rounded"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                        />
                      )}
                    </p>
                    
                    {/* Voice button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => speaking ? window.speechSynthesis.cancel() : speak(guideText)}
                      className="absolute top-2 right-2 text-mystica-purple-300 hover:text-white p-1 h-auto"
                    >
                      {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </motion.div>
                )}

                {/* Questions when guide is shown */}
                {showGuide && !isTyping && !selectedQuestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    <p className="text-xs text-mystica-purple-300 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Elige tu pregunta:
                    </p>
                    {hecateQuestions.map((question, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleQuestionSelect(question)}
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
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Selected Question */}
              {selectedQuestion && selectedCards.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-6 p-4 rounded-xl bg-mystica-purple-900/30 border border-mystica-gold-500/30"
                >
                  <p className="text-mystica-purple-200 italic">"{selectedQuestion}"</p>
                </motion.div>
              )}

              {/* Draw Button */}
              {selectedCards.length === 0 && !showGuide && (
                <div className="text-center mb-6">
                  {!canReadToday && !canAccessPremium ? (
                    <Card className="bg-orange-900/20 border-orange-500/30 max-w-md mx-auto">
                      <CardContent className="p-6 text-center">
                        <p className="text-orange-300 mb-2">Proxima lectura disponible en</p>
                        <p className="text-2xl font-bold text-orange-400">{cooldownHours} horas</p>
                        <Link href="/premium" className="mt-4 inline-block">
                          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                            <Crown className="w-4 h-4 mr-2" />
                            Obtener Acceso Ilimitado
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={drawCards}
                        disabled={isDrawing}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-8 shadow-xl shadow-purple-500/30 relative overflow-hidden"
                      >
                        {isDrawing ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                              <Sparkles className="w-5 h-5 mr-2" />
                            </motion.div>
                            Barajando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Sacar {maxCards} Cartas
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Cards Display */}
              <AnimatePresence>
                {selectedCards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6"
                  >
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
                      {selectedCards.map((card, index) => {
                        const isRevealed = revealedCards.includes(index)
                        return (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 50, rotateY: 180 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="aspect-[2/3]"
                          >
                            <motion.div
                              className={cn(
                                "relative w-full h-full cursor-pointer",
                                isRevealed && "z-10"
                              )}
                              onClick={() => flipCard(index)}
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {/* Glow effect for selected cards */}
                              {isRevealed && (
                                <MysticalGlow
                                  color="mixed"
                                  intensity="intense"
                                  size={150}
                                  animated
                                  className="absolute inset-0"
                                />
                              )}
                              
                              <TarotCard3D
                                card={card}
                                isReversed={Math.random() > 0.7}
                                isFlipped={isRevealed}
                                onFlip={() => flipCard(index)}
                              />
                            </motion.div>
                          </motion.div>
                        )
                      })}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 mb-4 text-sm">
                        {revealedCards.length} de {selectedCards.length} cartas reveladas
                      </p>
                      {revealedCards.length === selectedCards.length && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Button
                            onClick={resetReading}
                            variant="outline"
                            className="border-mystica-purple-600/50 text-mystica-purple-300 hover:bg-mystica-purple-900/30"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Nueva Lectura
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Meanings */}
              {revealedCards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <h2 className="text-lg font-bold text-white mb-4 font-mystica">
                    Interpretacion de las Cartas
                  </h2>
                  {selectedCards.filter((_, i) => revealedCards.includes(i)).map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <Card className="bg-mystica-dark-100/50 border-mystica-purple-800/30 overflow-hidden hover:border-mystica-gold-500/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Mini card image */}
                            <motion.div 
                              className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-mystica-gold-500/30"
                              whileHover={{ scale: 1.05, rotate: 2 }}
                            >
                              <Image
                                src={`/tarot-cards/${card.id.toString().padStart(2, '0')}-${card.name.toLowerCase().replace(/el |la |los |la /g, '').replace(/ /g, '-')}.png`}
                                alt={card.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/tarot-cards/00-fool.png'
                                }}
                              />
                            </motion.div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <motion.span 
                                  className="text-mystica-gold-400 font-mystica text-lg font-bold"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {card.numeral}
                                </motion.span>
                                <h3 className="text-white font-bold">{card.name}</h3>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {card.keywords.slice(0, 4).map((keyword, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-mystica-purple-800/60 text-mystica-purple-100"
                                  >
                                    {keyword}
                                  </motion.span>
                                ))}
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {card.upright}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
