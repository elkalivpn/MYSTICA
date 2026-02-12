'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, Sparkles, Shield, Crown, Check, AlertTriangle, Target, Users, MessageCircle, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { zodiacSigns } from '@/data/zodiac'
import { calculateCompatibility, CompatibilityResult } from '@/lib/compatibility'
import { cn } from '@/lib/utils'

export default function CompatibilityPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium

  const [sign1, setSign1] = useState<string | null>(null)
  const [sign2, setSign2] = useState<string | null>(null)
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleCalculate = async () => {
    if (!sign1 || !sign2) return
    setIsCalculating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const compatibility = calculateCompatibility(sign1, sign2)
    setResult(compatibility)
    setIsCalculating(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '💕'
    if (score >= 80) return '❤️'
    if (score >= 70) return '💛'
    if (score >= 60) return '🧡'
    if (score >= 50) return '💙'
    if (score >= 40) return '💜'
    return '🖤'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-pink-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">Compatibilidad Zodiacal</h1>
                <p className="text-sm text-gray-400">Descubre tu conexión cósmica</p>
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
        {/* Selector de signos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-center text-white font-medium mb-4">Tu Signo</h3>
            <div className="grid grid-cols-4 gap-2">
              {zodiacSigns.map((sign) => (
                <button key={`s1-${sign.name}`} onClick={() => setSign1(sign.name)}
                  className={cn("p-3 rounded-xl text-center transition-all",
                    sign1 === sign.name ? "bg-gradient-to-br from-pink-500 to-rose-600 scale-105 shadow-lg" : "bg-white/5 hover:bg-white/10"
                  )}>
                  <span className="text-xl block">{sign.symbol}</span>
                  <span className="text-[10px] text-gray-400">{sign.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-center text-white font-medium mb-4">Su Signo</h3>
            <div className="grid grid-cols-4 gap-2">
              {zodiacSigns.map((sign) => (
                <button key={`s2-${sign.name}`} onClick={() => setSign2(sign.name)}
                  className={cn("p-3 rounded-xl text-center transition-all",
                    sign2 === sign.name ? "bg-gradient-to-br from-purple-500 to-indigo-600 scale-105 shadow-lg" : "bg-white/5 hover:bg-white/10"
                  )}>
                  <span className="text-xl block">{sign.symbol}</span>
                  <span className="text-[10px] text-gray-400">{sign.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botón calcular */}
        <div className="text-center mb-8">
          <Button size="lg" onClick={handleCalculate} disabled={!sign1 || !sign2 || isCalculating}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-lg px-8">
            {isCalculating ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Heart className="w-5 h-5 mr-2" />
                </motion.div>
                Calculando...
              </>
            ) : (<><Heart className="w-5 h-5 mr-2" />Calcular Compatibilidad</>)}
          </Button>
        </div>

        {/* Resultados */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Score principal */}
              <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/20 border-pink-500/30 overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <span className="text-5xl">{zodiacSigns.find(s => s.name === sign1)?.symbol}</span>
                      <p className="text-white mt-2">{sign1}</p>
                    </div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      <span className="text-4xl">{getScoreEmoji(result.overall)}</span>
                    </motion.div>
                    <div className="text-center">
                      <span className="text-5xl">{zodiacSigns.find(s => s.name === sign2)?.symbol}</span>
                      <p className="text-white mt-2">{sign2}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className={cn("text-7xl font-bold", getScoreColor(result.overall))}>{result.overall}%</span>
                    <p className="text-xl text-gray-300 mt-2">Compatibilidad General</p>
                  </div>
                  <p className="text-gray-300 max-w-lg mx-auto">{result.summary}</p>
                </CardContent>
              </Card>

              {/* Scores por área */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Romance', value: result.romance, icon: Heart, color: 'pink' },
                  { label: 'Amistad', value: result.friendship, icon: Users, color: 'blue' },
                  { label: 'Comunicación', value: result.communication, icon: MessageCircle, color: 'green' },
                  { label: 'Pasión', value: result.passion, icon: Flame, color: 'orange' },
                ].map((item) => (
                  <Card key={item.label} className="bg-mystica-dark-100/50 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <item.icon className={cn("w-6 h-6 mx-auto mb-2", `text-${item.color}-400`)} />
                      <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                      <p className={cn("text-2xl font-bold", getScoreColor(item.value))}>{item.value}%</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Fortalezas y Desafíos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-green-400"><Check className="w-5 h-5" />Fortalezas</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300"><Sparkles className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />{s}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-orange-900/20 border-orange-500/30">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-orange-400"><AlertTriangle className="w-5 h-5" />Desafíos</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300"><Target className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />{c}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Consejo Premium */}
              {canAccessPremium ? (
                <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Crown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">Consejo Premium</h3>
                        <p className="text-gray-300">{result.advice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-yellow-900/20 border-yellow-500/30">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium mb-1">Desbloquea consejos personalizados</h3>
                      <p className="text-sm text-gray-400">Análisis profundo para tu relación</p>
                    </div>
                    <Link href="/premium"><Button className="bg-gradient-to-r from-yellow-500 to-orange-500"><Crown className="w-4 h-4 mr-2" />Premium</Button></Link>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
