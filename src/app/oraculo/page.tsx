'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sun, Crown, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { oracleCards, OracleCard } from '@/data/oracle-cards'
import { MysticGuide3D } from '@/components/guides/MysticGuide3D'
import { mysticGuides } from '@/data/mystic-guides'

export default function OraclePage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium

  const [currentCard, setCurrentCard] = useState<OracleCard | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [canReadToday, setCanReadToday] = useState(true)

  const pythia = mysticGuides.find(g => g.id === 'pythia')!

  useEffect(() => {
    const lastReading = localStorage.getItem('lastOracleReading')
    if (lastReading && !canAccessPremium) {
      const lastDate = new Date(lastReading)
      const today = new Date()
      if (lastDate.toDateString() === today.toDateString()) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCanReadToday(false)
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
      if (!canAccessPremium) {
        localStorage.setItem('lastOracleReading', new Date().toISOString())
        setCanReadToday(false)
      }
    }, 1500)
  }

  const resetReading = () => {
    setCurrentCard(null)
    setShowGuide(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-amber-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Oráculo Místico</h1>
                <p className="text-sm text-gray-400">Mensajes del universo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Guide */}
        <AnimatePresence>
          {showGuide && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
              <MysticGuide3D guide={pythia} onQuestionSelect={() => {}} onClose={() => setShowGuide(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draw Button */}
        {!currentCard && !showGuide && (
          <div className="text-center mb-8">
            {!canReadToday && !canAccessPremium ? (
              <Card className="bg-orange-900/20 border-orange-500/30 max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <p className="text-orange-300 mb-4">Ya has recibido tu mensaje de hoy</p>
                  <Link href="/premium">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      <Crown className="w-4 h-4 mr-2" />Mensajes Ilimitados
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Button onClick={drawCard} disabled={isDrawing} size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-lg px-8">
                {isDrawing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Sun className="w-5 h-5 mr-2" />
                    </motion.div>
                    Consultando...
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
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="mb-8">
              <Card className={`bg-gradient-to-br from-mystica-dark-100/80 to-mystica-dark-200/80 border-yellow-500/30 overflow-hidden`}>
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentCard.color} opacity-10 blur-xl`} />
                
                <CardContent className="relative p-8 text-center">
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className="text-6xl mb-4">
                      {currentCard.element === 'fuego' ? '🔥' :
                       currentCard.element === 'agua' ? '💧' :
                       currentCard.element === 'aire' ? '🌬️' :
                       currentCard.element === 'tierra' ? '🌍' : '✨'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{currentCard.name}</h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Badge className={`bg-gradient-to-r ${currentCard.color} text-white`}>{currentCard.element}</Badge>
                    </div>
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <p className="text-xl text-gray-200 mb-6 italic">"{currentCard.message}"</p>
                    
                    <div className="bg-mystica-dark-300/50 rounded-xl p-4 mb-6">
                      <h3 className="text-mystica-gold-400 font-semibold mb-2">Guía</h3>
                      <p className="text-gray-300">{currentCard.guidance}</p>
                    </div>

                    <div className="bg-mystica-purple-900/30 rounded-xl p-4 mb-6">
                      <h3 className="text-mystica-purple-300 font-semibold mb-2">Afirmación</h3>
                      <p className="text-white italic">"{currentCard.affirmation}"</p>
                    </div>

                    <Button onClick={resetReading} variant="outline" className="border-yellow-500/50 text-yellow-400">
                      <Sparkles className="w-4 h-4 mr-2" />Nuevo Mensaje
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
