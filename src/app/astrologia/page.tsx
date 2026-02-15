'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Star, Crown, Shield, Calendar, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { zodiacSigns } from '@/data/zodiac'
import { NPC3DGuide } from '@/components/NPC3DGuide'
import { cn } from '@/lib/utils'

export default function AstrologyPage() {
  const { isAdmin, isPremium } = useAuth()
  const [selectedSign, setSelectedSign] = useState<string | null>(null)

  const thothGuide = {
    id: 'thoth',
    name: 'Thoth',
    title: 'Escriba de los Dioses',
    culture: 'Egipcia',
    domain: 'Astrología',
    image: '/guides/thoth-3d.png',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500'
  }

  const thothGreeting = 'Te doy la bienvenida al observatorio celestial. Yo soy Thoth, guardián del conocimiento astral. Los doce signos del zodíaco son arquetipos cósmicos que revelan los misterios de tu alma. Selecciona un signo para descubrir sus secretos.'

  const sign = zodiacSigns.find(s => s.name === selectedSign)

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-amber-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-mystica">
                  Astrología
                </h1>
                <p className="text-xs text-gray-400">12 signos zodiacales</p>
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
          {/* Thoth 3D Guide */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={thothGuide}
                dialogue={thothGreeting}
                showDialogue={true}
                size="md"
              />
              
              {/* Quick Links */}
              <div className="mt-4 space-y-2">
                <Link href="/carta-natal" className="block">
                  <Button variant="outline" className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-900/20 justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Carta Natal
                  </Button>
                </Link>
                <Link href="/horoscopo" className="block">
                  <Button variant="outline" className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-900/20 justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Horóscopo Diario
                  </Button>
                </Link>
                <Link href="/compatibilidad" className="block">
                  <Button variant="outline" className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-900/20 justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    Compatibilidad
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Sign Selector */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {zodiacSigns.map((s, index) => (
                <motion.button
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedSign(s.name)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-3 rounded-xl text-center transition-all border",
                    selectedSign === s.name
                      ? "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 shadow-lg shadow-amber-500/30"
                      : "bg-mystica-dark-200/50 border-amber-500/20 hover:border-amber-400/50"
                  )}
                >
                  <span className="text-2xl sm:text-3xl block">{s.symbol}</span>
                  <span className="text-[10px] text-gray-400">{s.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Sign Details */}
            {sign && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30 overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <motion.span
                        className="text-7xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {sign.symbol}
                      </motion.span>
                      <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-white font-mystica">{sign.name}</h2>
                        <p className="text-amber-300">{sign.dates}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
                          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">{sign.element}</Badge>
                          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">{sign.modality}</Badge>
                          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">{sign.planet}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-6 leading-relaxed text-center sm:text-left">{sign.description}</p>
                  </CardContent>
                </Card>

                {/* Traits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-900/20 border-green-500/30">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-green-400 mb-4 font-mystica">Fortalezas</h3>
                      <ul className="space-y-2">
                        {sign.traits.strengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                            <Star className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-900/20 border-orange-500/30">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-orange-400 mb-4 font-mystica">Áreas de Crecimiento</h3>
                      <ul className="space-y-2">
                        {sign.traits.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                            <Star className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Planeta', value: sign.planet, icon: '🪐' },
                    { label: 'Color', value: sign.color, icon: '🎨' },
                    { label: 'Piedra', value: sign.stone, icon: '💎' },
                    { label: 'Número', value: sign.number.toString(), icon: '🔢' },
                  ].map((item) => (
                    <Card key={item.label} className="bg-mystica-dark-200/60 border-amber-500/20">
                      <CardContent className="p-4 text-center">
                        <span className="text-2xl mb-1 block">{item.icon}</span>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm font-bold text-amber-400">{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Compatibility */}
                <Card className="bg-mystica-dark-200/60 border-pink-500/20">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-pink-400 mb-4 font-mystica flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Compatibilidad
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sign.compatibility.map((c, i) => (
                        <Link key={i} href="/compatibilidad">
                          <Badge className="bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 cursor-pointer">
                            {c}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Placeholder when no sign selected */}
            {!sign && (
              <Card className="bg-mystica-dark-200/40 border-amber-500/20">
                <CardContent className="p-8 text-center">
                  <span className="text-6xl mb-4 block">⭐</span>
                  <p className="text-gray-400">Selecciona un signo zodiacal para ver su información detallada</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
