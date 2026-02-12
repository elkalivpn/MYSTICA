'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Crown, Shield, Star, Heart, Zap, Coins, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { zodiacSigns } from '@/data/zodiac'
import { generateDailyHoroscope, HoroscopeReading } from '@/lib/horoscope-generator'
import { cn } from '@/lib/utils'

export default function HoroscopePage() {
  const { isAdmin, isPremium } = useAuth()
  const [selectedSign, setSelectedSign] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<HoroscopeReading | null>(null)
  const [period, setPeriod] = useState<'today' | 'tomorrow' | 'week' | 'month'>('today')

  const canAccessExtended = isAdmin || isPremium

  const selectSign = (signName: string) => {
    setSelectedSign(signName)
    const reading = generateDailyHoroscope(signName, period)
    setHoroscope(reading)
  }

  const getRatingStars = (rating: number) => '⭐'.repeat(rating)

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-pink-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Horóscopo Diario</h1>
                <p className="text-sm text-gray-400">Predicciones por signo</p>
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
        {/* Period Selector */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {[
            { id: 'today', label: 'Hoy', free: true },
            { id: 'tomorrow', label: 'Mañana', free: true },
            { id: 'week', label: 'Semana', free: false },
            { id: 'month', label: 'Mes', free: false },
          ].map((p) => (
            <Button
              key={p.id}
              variant={period === p.id ? 'default' : 'outline'}
              onClick={() => {
                if (p.free || canAccessExtended) {
                  setPeriod(p.id as typeof period)
                  if (selectedSign) selectSign(selectedSign)
                }
              }}
              className={cn(
                period === p.id && 'bg-gradient-to-r from-pink-500 to-rose-500',
                !p.free && !canAccessExtended && 'opacity-50'
              )}
            >
              {p.label}
              {!p.free && !canAccessExtended && <Crown className="w-3 h-3 ml-1" />}
            </Button>
          ))}
        </div>

        {/* Sign Selector */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-8">
          {zodiacSigns.map((sign) => (
            <motion.button
              key={sign.name}
              onClick={() => selectSign(sign.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-3 rounded-xl text-center transition-all",
                selectedSign === sign.name
                  ? "bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg"
                  : "bg-white/5 hover:bg-white/10"
              )}
            >
              <span className="text-2xl block">{sign.symbol}</span>
              <span className="text-[10px] text-gray-400">{sign.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Horoscope Display */}
        {horoscope && selectedSign && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-pink-900/30 to-rose-900/20 border-pink-500/30">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-5xl">{zodiacSigns.find(s => s.name === selectedSign)?.symbol}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedSign}</h2>
                    <p className="text-gray-400">{zodiacSigns.find(s => s.name === selectedSign)?.dates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ratings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Amor', value: horoscope.ratings.love, icon: Heart, color: 'pink' },
                { label: 'Trabajo', value: horoscope.ratings.work, icon: Zap, color: 'yellow' },
                { label: 'Dinero', value: horoscope.ratings.money, icon: Coins, color: 'green' },
                { label: 'Salud', value: horoscope.ratings.health, icon: Activity, color: 'blue' },
              ].map((item) => (
                <Card key={item.label} className="bg-mystica-dark-100/50 border-gray-700">
                  <CardContent className="p-4 text-center">
                    <item.icon className={cn("w-6 h-6 mx-auto mb-2", `text-${item.color}-400`)} />
                    <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                    <p className="text-lg">{getRatingStars(item.value)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-mystica-dark-100/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">General</h3>
                  <p className="text-gray-300">{horoscope.general}</p>
                </CardContent>
              </Card>
              <Card className="bg-mystica-dark-100/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">Amor</h3>
                  <p className="text-gray-300">{horoscope.love}</p>
                </CardContent>
              </Card>
              <Card className="bg-mystica-dark-100/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">Trabajo</h3>
                  <p className="text-gray-300">{horoscope.work}</p>
                </CardContent>
              </Card>
              <Card className="bg-mystica-dark-100/50 border-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">Dinero</h3>
                  <p className="text-gray-300">{horoscope.money}</p>
                </CardContent>
              </Card>
            </div>

            {/* Lucky Info */}
            <Card className="bg-mystica-dark-100/50 border-gray-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Números de la Suerte</p>
                    <p className="text-lg text-mystica-gold-400">{horoscope.luckyNumbers.join(' - ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Color del Día</p>
                    <p className="text-lg text-mystica-gold-400">{horoscope.luckyColor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Hora Favorable</p>
                    <p className="text-lg text-mystica-gold-400">{horoscope.luckyHour}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Compatibilidad</p>
                    <p className="text-lg text-mystica-gold-400">{horoscope.compatibility}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advice */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-mystica-gold-400 mb-2">Consejo de las Estrellas</h3>
                <p className="text-gray-300 italic">"{horoscope.advice}"</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
