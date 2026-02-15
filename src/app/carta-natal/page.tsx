'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Crown, Shield, Star, Sun, Moon as MoonIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { NPC3DGuide } from '@/components/NPC3DGuide'
import { zodiacSigns } from '@/data/zodiac'

export default function NatalChartPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium

  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [showChart, setShowChart] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const hecateGuide = {
    id: 'hecate',
    name: 'Hécate',
    title: 'Guardiana de las Encrucijadas',
    culture: 'Griega',
    domain: 'Carta Natal',
    image: '/guides/hecate-3d.png',
    color: '#9333ea',
    gradient: 'from-purple-600 to-pink-600'
  }

  const hecateGreeting = 'Bienvenido al santuario de las estrellas. Tu carta natal revela los secretos que los cielos grabaron en tu alma el día de tu nacimiento. Dime, ¿cuándo llegaste a este mundo?'

  const calculateNatalChart = () => {
    if (!birthDate) return
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      setShowChart(true)
    }, 2500)
  }

  const sunSign = useMemo(() => {
    if (!birthDate) return null
    const date = new Date(birthDate)
    const month = date.getMonth() + 1
    const day = date.getDate()

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0]
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1]
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2]
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3]
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4]
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5]
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6]
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7]
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8]
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9]
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10]
    return zodiacSigns[11]
  }, [birthDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-purple-950/20 to-mystica-dark-100">
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
                  Carta Natal
                </h1>
                <p className="text-xs text-gray-400">Tu mapa astral personal</p>
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
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={hecateGuide}
                dialogue={hecateGreeting}
                showDialogue={!showChart}
                size="lg"
              />
            </div>
          </motion.div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!showChart ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystica-purple-600 to-pink-600 flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white font-mystica">Datos de Nacimiento</h2>
                          <p className="text-gray-400 text-sm">Ingresa tu información</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-mystica-purple-300 mb-2">Fecha de nacimiento</label>
                          <Input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="bg-mystica-dark-300/50 border-mystica-purple-600/30 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-mystica-purple-300 mb-2">Hora de nacimiento</label>
                          <Input
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="bg-mystica-dark-300/50 border-mystica-purple-600/30 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-mystica-purple-300 mb-2">Lugar de nacimiento</label>
                          <Input
                            type="text"
                            placeholder="Ciudad, País"
                            value={birthPlace}
                            onChange={(e) => setBirthPlace(e.target.value)}
                            className="bg-mystica-dark-300/50 border-mystica-purple-600/30 text-white placeholder:text-gray-500"
                          />
                        </div>

                        <Button
                          onClick={calculateNatalChart}
                          disabled={!birthDate || isCalculating}
                          className="w-full bg-gradient-to-r from-mystica-purple-600 to-pink-600 hover:from-mystica-purple-500 hover:to-pink-500 text-lg py-6"
                        >
                          {isCalculating ? (
                            <>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                <Sparkles className="w-5 h-5 mr-2" />
                              </motion.div>
                              Calculando...
                            </>
                          ) : (
                            <>
                              <Star className="w-5 h-5 mr-2" />
                              Revelar mi Carta Natal
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                          <div className="absolute inset-0 rounded-full border-2 border-mystica-gold-500/40" />
                          <div className="absolute inset-4 rounded-full border border-mystica-purple-500/30" />
                          <div className="absolute inset-8 rounded-full border border-mystica-purple-500/20" />
                          <div className="absolute inset-12 rounded-full border border-mystica-purple-500/10" />

                          {zodiacSigns.map((sign, i) => {
                            const angle = (i * 30) - 90
                            const radius = 140
                            const x = Math.cos(angle * Math.PI / 180) * radius
                            const y = Math.sin(angle * Math.PI / 180) * radius
                            return (
                              <motion.div
                                key={sign.id}
                                className="absolute text-2xl"
                                style={{
                                  left: `calc(50% + ${x}px - 12px)`,
                                  top: `calc(50% + ${y}px - 12px)`
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                {sign.symbol}
                              </motion.div>
                            )
                          })}

                          {sunSign && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5, type: 'spring' }}
                            >
                              <div className="text-center">
                                <div className="text-5xl mb-2">{sunSign.symbol}</div>
                                <div className="text-mystica-gold-400 font-mystica text-lg">{sunSign.name}</div>
                                <div className="text-gray-400 text-xs">Signo Solar</div>
                              </div>
                            </motion.div>
                          )}

                          {['☉', '☽', '☿', '♀', '♂'].map((planet, i) => {
                            const angle = (i * 72) + Math.random() * 30
                            const radius = 60 + Math.random() * 40
                            const x = Math.cos(angle * Math.PI / 180) * radius
                            const y = Math.sin(angle * Math.PI / 180) * radius
                            return (
                              <motion.div
                                key={i}
                                className="absolute text-xl text-white"
                                style={{
                                  left: `calc(50% + ${x}px - 10px)`,
                                  top: `calc(50% + ${y}px - 10px)`
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, y: [0, -3, 0] }}
                                transition={{ delay: 1 + i * 0.2, y: { duration: 2, repeat: Infinity, delay: i * 0.3 } }}
                              >
                                {planet}
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>

                      {sunSign && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="text-center mb-6 p-4 rounded-xl bg-mystica-purple-900/30 border border-mystica-gold-500/30"
                        >
                          <p className="text-mystica-purple-200 italic">
                            "Tu sol en {sunSign.name} te otorga {sunSign.traits[0].toLowerCase()} y {sunSign.traits[1].toLowerCase()}."
                          </p>
                          <p className="text-xs text-mystica-gold-400 mt-2">— Hécate</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {sunSign && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Sun className="w-6 h-6 text-mystica-gold-400" />
                            <h3 className="text-lg font-bold text-white font-mystica">Signo Solar</h3>
                          </div>
                          <div className="text-3xl mb-2">{sunSign.symbol}</div>
                          <h4 className="text-xl text-mystica-gold-300 mb-2">{sunSign.name}</h4>
                          <p className="text-gray-300 text-sm mb-3">{sunSign.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {sunSign.traits.map((trait, i) => (
                              <span key={i} className="px-2 py-1 rounded-full bg-mystica-purple-800/50 text-mystica-purple-100 text-xs">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-mystica-dark-200/60 border-mystica-purple-700/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <MoonIcon className="w-6 h-6 text-mystica-purple-300" />
                            <h3 className="text-lg font-bold text-white font-mystica">Signo Lunar</h3>
                          </div>
                          <div className="text-3xl mb-2">☽</div>
                          <p className="text-gray-400 text-sm mb-3">
                            Para conocer tu signo lunar con precisión, necesitamos tu hora exacta de nacimiento.
                          </p>
                          {!canAccessPremium && (
                            <Link href="/premium">
                              <Button variant="outline" size="sm" className="border-mystica-gold-500/30 text-mystica-gold-300">
                                <Crown className="w-3 h-3 mr-1" />
                                Desbloquear
                              </Button>
                            </Link>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div className="text-center">
                    <Button onClick={() => setShowChart(false)} variant="outline" className="border-mystica-purple-600/50 text-mystica-purple-300">
                      Calcular otra carta
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}
