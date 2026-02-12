'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Star, Crown, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { zodiacSigns } from '@/data/zodiac'
import { cn } from '@/lib/utils'

export default function AstrologyPage() {
  const { isAdmin, isPremium } = useAuth()
  const [selectedSign, setSelectedSign] = useState<string | null>(null)

  const sign = zodiacSigns.find(s => s.name === selectedSign)

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-amber-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Astrología</h1>
                <p className="text-sm text-gray-400">12 signos zodiacales</p>
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
        {/* Sign Selector */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-8">
          {zodiacSigns.map((s) => (
            <motion.button
              key={s.name}
              onClick={() => setSelectedSign(s.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-3 rounded-xl text-center transition-all",
                selectedSign === s.name
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg"
                  : "bg-white/5 hover:bg-white/10"
              )}
            >
              <span className="text-2xl block">{s.symbol}</span>
              <span className="text-[10px] text-gray-400">{s.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Sign Details */}
        {sign && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-6xl">{sign.symbol}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{sign.name}</h2>
                    <p className="text-gray-400">{sign.dates}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-amber-500/20 text-amber-300">{sign.element}</Badge>
                      <Badge className="bg-amber-500/20 text-amber-300">{sign.modality}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{sign.description}</p>
              </CardContent>
            </Card>

            {/* Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-green-400 mb-4">Fortalezas</h3>
                  <ul className="space-y-2">
                    {sign.traits.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <Star className="w-4 h-4 text-green-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-orange-900/20 border-orange-500/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-orange-400 mb-4">Debilidades</h3>
                  <ul className="space-y-2">
                    {sign.traits.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <Star className="w-4 h-4 text-orange-400" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Planeta', value: sign.planet },
                { label: 'Color', value: sign.color },
                { label: 'Piedra', value: sign.stone },
                { label: 'Número', value: sign.number.toString() },
              ].map((item) => (
                <Card key={item.label} className="bg-mystica-dark-100/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-gray-400">{item.label}</p>
                    <p className="text-lg font-bold text-amber-400">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compatibility */}
            <Card className="bg-mystica-dark-100/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Compatibilidad</h3>
                <div className="flex flex-wrap gap-2">
                  {sign.compatibility.map((c, i) => (
                    <Link key={i} href={`/compatibilidad`}>
                      <Badge className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 cursor-pointer">{c}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
