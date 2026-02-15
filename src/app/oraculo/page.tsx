'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sun, Crown, Shield, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { oracleCards, OracleCard } from '@/data/oracle-cards'
import { NPC3DGuide } from '@/components/NPC3DGuide'

export default function OraclePage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium

  const [currentCard, setCurrentCard] = useState<OracleCard | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [canReadToday, setCanReadToday] = useState(true)
  const [guideDialogue, setGuideDialogue] = useState('')

  const hecateGuide = {
    id: 'hecate',
    name: 'Hécate',
    title: 'Guardiana de las Encrucijadas',
    culture: 'Griega',
    domain: 'Oráculo',
    image: '/guides/hecate-3d.png',
    color: '#9333ea',
    gradient: 'from-purple-600 to-pink-600'
  }

  const hecateGreeting = 'Te doy la bienvenida al oráculo sagrado. En la encrucijada de los mundos, los secretos del universo aguardan. Formula tu pregunta en silencio y recibe el mensaje que el cosmos tiene para ti.'

  const hecateReveal = 'El velo se ha descorrido. El mensaje ha sido revelado. Medita sobre estas palabras, pues contienen la guía que tu alma busca.'

  useEffect(() => {
    const lastReading = localStorage.getItem('lastOracleReading')
    if (lastReading && !canAccessPremium) {
      const lastDate = new Date(lastReading)
      const today = new Date()
      const isSameDay = lastDate.toDateString() === today.toDateString()
      // Use timeout to avoid synchronous setState warning
      if (isSameDay) {
        const timer = setTimeout(() => setCanReadToday(false), 0)
        return () => clearTimeout(timer)
      }
    }
  }, [canAccessPremium])

  const drawCard = () => {
    setIsDrawing(true)
    setShowGuide(false)
    
    setTimeout(() => {
      const randomCard = oracleCards[Math.floor(Math.random() * oracleCards.length)]
      setCurrentCard(randomCard)
      setIsDrawing(false)
      setGuideDialogue(hecateReveal)
      if (!canAccessPremium) {
        localStorage.setItem('lastOracleReading', new Date().toISOString())
        setCanReadToday(false)
      }
    }, 1500)
  }

  const resetReading = () => {
    setCurrentCard(null)
    setShowGuide(true)
    setGuideDialogue('')
  }

  const getElementEmoji = (element: string) => {
    const emojis: Record<string, string> = {
      'fuego': '🔥',
      'agua': '💧',
      'aire': '🌬️',
      'tierra': '🌍',
      'espíritu': '✨'
    }
    return emojis[element] || '✨'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-amber-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-mystica">
                  Oráculo Místico
                </h1>
                <p className="text-xs text-gray-400">Mensajes del universo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hécate 3D Guide */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={hecateGuide}
                dialogue={showGuide ? hecateGreeting : guideDialogue}
                showDialogue={true}
                size="md"
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Draw Button */}
            {!currentCard && !showGuide && (
              <div className="text-center mb-8">
                {!canReadToday && !canAccessPremium ? (
                  <Card className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border-orange-500/30 max-w-md mx-auto">
                    <CardContent className="p-8 text-center">
                      <Sun className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-orange-300 mb-2">Ya has recibido tu mensaje de hoy</p>
                      <p className="text-gray-400 text-sm mb-4">Los usuarios Premium tienen mensajes ilimitados</p>
                      <Link href="/premium">
                        <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                          <Crown className="w-4 h-4 mr-2" />
                          Mensajes Ilimitados
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Button
                    onClick={drawCard}
                    disabled={isDrawing}
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-lg px-10 py-6 shadow-xl shadow-orange-500/30"
                  >
                    {isDrawing ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Sun className="w-5 h-5 mr-2" />
                        </motion.div>
                        Consultando el oráculo...
                      </>
                    ) : (
                      <>
                        <Sun className="w-5 h-5 mr-2" />
                        Recibir Mensaje
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Card Display */}
            <AnimatePresence>
              {currentCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <Card className="bg-gradient-to-br from-mystica-dark-200/80 to-mystica-dark-300/80 border-yellow-500/30 overflow-hidden relative">
                    {/* Background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentCard.color} opacity-15 blur-3xl`} />
                    
                    <CardContent className="relative p-8">
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                        >
                          <span className="text-7xl block mb-4">{getElementEmoji(currentCard.element)}</span>
                        </motion.div>
                        
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl font-bold text-white font-mystica mb-2"
                        >
                          {currentCard.name}
                        </motion.h2>
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Badge className={`bg-gradient-to-r ${currentCard.color} text-white border-0`}>
                            {currentCard.element}
                          </Badge>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                      >
                        {/* Message */}
                        <div className="text-center p-4 rounded-xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20">
                          <p className="text-xl text-yellow-100 italic leading-relaxed">"{currentCard.message}"</p>
                        </div>
                        
                        {/* Guidance */}
                        <div className="p-4 rounded-xl bg-mystica-dark-300/50 border border-gray-700/50">
                          <h3 className="text-mystica-gold-400 font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Guía de Hécate
                          </h3>
                          <p className="text-gray-300">{currentCard.guidance}</p>
                        </div>

                        {/* Affirmation */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20">
                          <h3 className="text-purple-300 font-semibold mb-2">Afirmación del Día</h3>
                          <p className="text-white italic text-center">"{currentCard.affirmation}"</p>
                        </div>

                        {/* Reset Button */}
                        <div className="text-center pt-4">
                          <Button
                            onClick={resetReading}
                            variant="outline"
                            className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-900/30"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Nuevo Mensaje
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
