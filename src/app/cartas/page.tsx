'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Crown, Shield, RefreshCw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { tarotCards, TarotCard } from '@/data/tarot-cards'
import { TarotCard3D } from '@/components/tarot/TarotCard3D'
import { MysticGuide3D } from '@/components/guides/MysticGuide3D'
import { mysticGuides } from '@/data/mystic-guides'

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

  const hecate = mysticGuides.find(g => g.id === 'hecate')!
  const maxCards = canAccessPremium ? 5 : 3

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

  const drawCards = () => {
    setIsDrawing(true)
    setSelectedCards([])
    setRevealedCards([])
    
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
      const drawn = shuffled.slice(0, maxCards)
      setSelectedCards(drawn)
      setIsDrawing(false)
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
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-purple-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-mystica-purple-800/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Lectura de Tarot</h1>
                <p className="text-sm text-gray-400">22 Arcanos Mayores</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Guide */}
        <AnimatePresence>
          {showGuide && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
              <MysticGuide3D guide={hecate} onQuestionSelect={handleQuestionSelect} onClose={() => setShowGuide(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Question */}
        {selectedQuestion && selectedCards.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <p className="text-mystica-purple-300 italic">"{selectedQuestion}"</p>
          </motion.div>
        )}

        {/* Draw Button */}
        {selectedCards.length === 0 && !showGuide && (
          <div className="text-center mb-8">
            {!canReadToday && !canAccessPremium ? (
              <Card className="bg-orange-900/20 border-orange-500/30 max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <p className="text-orange-300 mb-2">Próxima lectura disponible en</p>
                  <p className="text-2xl font-bold text-orange-400">{cooldownHours} horas</p>
                  <Link href="/premium" className="mt-4 inline-block">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      <Crown className="w-4 h-4 mr-2" />Obtener Acceso Ilimitado
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Button onClick={drawCards} disabled={isDrawing} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg px-8">
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
            )}
          </div>
        )}

        {/* Cards Display */}
        <AnimatePresence>
          {selectedCards.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                {selectedCards.map((card, index) => (
                  <motion.div key={card.id} initial={{ opacity: 0, y: 50, rotateY: 180 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ delay: index * 0.2 }} className="aspect-[2/3]">
                    <TarotCard3D card={card} isReversed={Math.random() > 0.7} isFlipped={revealedCards.includes(index)} onFlip={() => flipCard(index)} />
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  {revealedCards.length} de {selectedCards.length} cartas reveladas
                </p>
                {revealedCards.length === selectedCards.length && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Button onClick={resetReading} variant="outline" className="border-mystica-purple-600/50 text-mystica-purple-300">
                      <RefreshCw className="w-4 h-4 mr-2" />Nueva Lectura
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Meanings */}
        {revealedCards.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Interpretación de las Cartas</h2>
            {selectedCards.filter((_, i) => revealedCards.includes(i)).map((card, index) => (
              <Card key={card.id} className="bg-mystica-dark-100/50 border-mystica-purple-800/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{card.numeral}</div>
                    <div>
                      <h3 className="text-lg font-bold text-mystica-gold-400">{card.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{card.keywords.join(' • ')}</p>
                      <p className="text-gray-300">{card.upright}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}
