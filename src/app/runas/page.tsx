'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Star, Crown, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { runes, Rune } from '@/data/runes'
import { MysticGuide3D } from '@/components/guides/MysticGuide3D'
import { mysticGuides } from '@/data/mystic-guides'
import { cn } from '@/lib/utils'

export default function RunesPage() {
  const { isAdmin, isPremium } = useAuth()
  const [selectedRunes, setSelectedRunes] = useState<Rune[]>([])
  const [revealedRunes, setRevealedRunes] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  const frigg = mysticGuides.find(g => g.id === 'frigg')!

  const drawRunes = () => {
    setIsDrawing(true)
    setShowGuide(false)
    
    setTimeout(() => {
      const shuffled = [...runes].sort(() => Math.random() - 0.5)
      setSelectedRunes(shuffled.slice(0, 3))
      setIsDrawing(false)
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-blue-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Runas Nórdicas</h1>
                <p className="text-sm text-gray-400">24 runas del Futhark</p>
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
              <MysticGuide3D guide={frigg} onQuestionSelect={() => {}} onClose={() => setShowGuide(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draw Button */}
        {selectedRunes.length === 0 && !showGuide && (
          <div className="text-center mb-8">
            <Button onClick={drawRunes} disabled={isDrawing} size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-lg px-8">
              {isDrawing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Star className="w-5 h-5 mr-2" />
                  </motion.div>
                  Invocando...
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {selectedRunes.map((rune, index) => (
                  <motion.div
                    key={rune.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    onClick={() => revealRune(index)}
                    className="cursor-pointer"
                  >
                    <Card className={cn(
                      "aspect-square flex items-center justify-center transition-all duration-500",
                      revealedRunes.includes(index)
                        ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/30 border-blue-500/50"
                        : "bg-gradient-to-br from-mystica-dark-100 to-mystica-dark-200 border-blue-500/20"
                    )}>
                      <CardContent className="p-6 text-center">
                        {revealedRunes.includes(index) ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <div className="text-6xl text-blue-300 mb-2">{rune.symbol}</div>
                            <h3 className="text-lg font-bold text-white">{rune.name}</h3>
                            <p className="text-sm text-gray-400">{rune.meaning}</p>
                          </motion.div>
                        ) : (
                          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                            <div className="text-4xl text-blue-500/30">ᚱ</div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {revealedRunes.length === 3 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-4">Interpretación</h2>
                  {selectedRunes.map((rune, index) => (
                    <Card key={rune.id} className="bg-mystica-dark-100/50 border-blue-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl text-blue-300">{rune.symbol}</div>
                          <div>
                            <h3 className="text-lg font-bold text-cyan-400">{rune.name} - {rune.meaning}</h3>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {rune.keywords.map((kw, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-200">{kw}</span>
                              ))}
                            </div>
                            <p className="text-gray-300">{rune.upright}</p>
                            <p className="text-sm text-gray-500 mt-2">Deidad: {rune.deity}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={resetReading} variant="outline" className="w-full border-blue-500/50 text-blue-300">
                    <Sparkles className="w-4 h-4 mr-2" />Nueva Lectura
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
