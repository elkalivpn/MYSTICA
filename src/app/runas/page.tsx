'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Star, Crown, Shield, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { runes, Rune } from '@/data/runes'
import { NPC3DGuide } from '@/components/NPC3DGuide'
import { cn } from '@/lib/utils'

export default function RunesPage() {
  const { isAdmin, isPremium } = useAuth()
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([])
  const [revealedRunes, setRevealedRunes] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [guideDialogue, setGuideDialogue] = useState('')

  const friggGuide = {
    id: 'frigg',
    name: 'Frigg',
    title: 'Madre del Cosmos',
    culture: 'Nórdica',
    domain: 'Runas',
    image: '/guides/frigg-3d.png',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500'
  }

  const friggGreeting = 'Bienvenido al sagrado círculo de las runas. Los antiguos símbolos del Futhark aguardan para revelarte los misterios del destino. Yo, Frigg, te guiaré en esta lectura.'

  const friggReveal = 'Las runas han hablado. Cada símbolo contiene una sabiduría ancestral que iluminará tu camino.'

  const questions = [
    '¿Qué debo saber sobre mi camino actual?',
    '¿Qué energías rodean mi situación?',
    '¿Qué consejo tienen los antiguos para mí?'
  ]

  const drawRunes = () => {
    setIsDrawing(true)
    setShowGuide(false)
    
    setTimeout(() => {
      const shuffled = [...runes].sort(() => Math.random() - 0.5)
      setSelectedRunes(shuffled.slice(0, 3))
      setIsDrawing(false)
      setGuideDialogue(friggReveal)
    }, 1500)
  }

  const revealRune = (index: number) => {
    if (!revealedRunes.includes(index)) {
      setRevealedRunes([...revealedRunes, index])
    }
  }

  const resetReading = () => {
    setSelectedRunes([])
    setRevealedRunes([])
    setShowGuide(true)
    setGuideDialogue('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-blue-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-mystica">
                  Runas Nórdicas
                </h1>
                <p className="text-xs text-gray-400">24 runas del Elder Futhark</p>
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
          {/* Frigg 3D Guide */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={friggGuide}
                dialogue={showGuide ? friggGreeting : guideDialogue}
                showDialogue={true}
                size="md"
                questions={showGuide ? questions : undefined}
                onSelectQuestion={() => {
                  setShowGuide(false)
                  drawRunes()
                }}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Draw Button */}
            {selectedRunes.length === 0 && !showGuide && (
              <div className="text-center mb-8">
                <Button
                  onClick={drawRunes}
                  disabled={isDrawing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-lg px-8 shadow-xl shadow-blue-500/30"
                >
                  {isDrawing ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Star className="w-5 h-5 mr-2" />
                      </motion.div>
                      Invocando runas...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 mr-2" />
                      Sacar 3 Runas
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Runes Display */}
            <AnimatePresence>
              {selectedRunes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Runes Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {selectedRunes.map((rune, index) => (
                      <motion.div
                        key={rune.id}
                        initial={{ opacity: 0, y: 50, rotateY: 180 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ delay: index * 0.2 }}
                        onClick={() => revealRune(index)}
                        className="cursor-pointer perspective-1000"
                      >
                        <Card className={cn(
                          "aspect-square flex items-center justify-center transition-all duration-500 overflow-hidden",
                          revealedRunes.includes(index)
                            ? "bg-gradient-to-br from-blue-900/60 to-cyan-900/40 border-blue-400/50 shadow-lg shadow-blue-500/20"
                            : "bg-gradient-to-br from-mystica-dark-100 to-mystica-dark-200 border-blue-500/20 hover:border-blue-400/40"
                        )}>
                          <CardContent className="p-4 text-center w-full">
                            {revealedRunes.includes(index) ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                              >
                                <div className="text-6xl sm:text-7xl text-blue-300 mb-2 font-runic">{rune.symbol}</div>
                                <h3 className="text-lg font-bold text-white font-mystica">{rune.name}</h3>
                                <p className="text-xs text-cyan-300">{rune.meaning}</p>
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                className="text-5xl text-blue-500/30 font-runic"
                              >
                                ᚱ
                              </motion.div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-center text-gray-400 text-sm">
                    {revealedRunes.length} de 3 runas reveladas
                  </p>

                  {/* Interpretation */}
                  {revealedRunes.length === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-bold text-white font-mystica">
                        Interpretación de Frigg
                      </h2>
                      
                      {selectedRunes.map((rune, index) => (
                        <Card key={rune.id} className="bg-mystica-dark-200/60 border-blue-500/30">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-900/50 to-cyan-900/30 flex items-center justify-center border border-blue-500/30">
                                <span className="text-3xl text-blue-300 font-runic">{rune.symbol}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-cyan-400">{rune.name}</h3>
                                  <span className="text-sm text-gray-400">— {rune.meaning}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {rune.keywords.map((kw, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-200">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-gray-300 text-sm">{rune.upright}</p>
                                <p className="text-xs text-gray-500 mt-2">Deidad asociada: {rune.deity}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <div className="text-center">
                        <Button
                          onClick={resetReading}
                          variant="outline"
                          className="border-blue-500/50 text-blue-300 hover:bg-blue-900/30"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Nueva Lectura
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* All Runes Reference */}
            {selectedRunes.length === 0 && showGuide && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <h2 className="text-lg font-bold text-white mb-4 font-mystica">Runas del Elder Futhark</h2>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {runes.slice(0, 24).map((rune) => (
                    <div
                      key={rune.id}
                      className="aspect-square rounded-lg bg-mystica-dark-200/50 border border-blue-500/20 flex items-center justify-center hover:border-blue-400/40 transition-colors cursor-default"
                      title={`${rune.name} - ${rune.meaning}`}
                    >
                      <span className="text-xl text-blue-300 font-runic">{rune.symbol}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
