'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Heart, Share2, RefreshCw, Sun, Moon, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Afirmaciones diarias por tema
const affirmations = {
  morning: [
    "Hoy el universo conspira a mi favor. Cada paso que doy me acerca a mi mejor versión.",
    "Despierto con gratitud, abrazo el día con amor y confianza.",
    "Mi energía es sagrada. Elijo llenar este día de luz y positividad.",
    "Soy un imán para las bendiciones. Lo bueno fluye hacia mí sin esfuerzo.",
    "Mi intuición es mi brújula. Confío en la sabiduría de mi alma.",
    "Hoy elijo ver la magia en cada momento. La vida me sonríe.",
    "Soy digna de amor, éxito y abundancia. Todo lo bueno es mío.",
    "Mi luz interior brilla más fuerte cada día. Soy infinita.",
  ],
  night: [
    "Libero todo lo que no me sirve. Descanso en paz y confianza.",
    "Las estrellas velan mis sueños. Mañana despierto renovada.",
    "Agradezco las lecciones del día. Cada experiencia me transforma.",
    "Mi alma descansa en el regazo del universo. Estoy a salvo.",
    "Los sueños son mensajes del alma. Mi inconsciente me guía.",
    "Suelto el control y confío en el proceso de la vida.",
    "La noche me envuelve con su manto de paz y misterio.",
    "Mañana el sol traerá nuevas oportunidades. Confío en el ciclo.",
  ],
  moon: [
    "Como la luna, atravieso fases pero siempre brillo.",
    "Los ciclos de la luna son mis ciclos. Honro cada fase.",
    "En la oscuridad encuentro mi luz más profunda.",
    "La luna llena me llena de poder. La luna nueva me renueva.",
    "Mi intuición lunar me guía hacia mi destino.",
    "Soy cíclica, soy eterna, soy luna y soy sol.",
  ],
  cosmic: [
    "Soy polvo de estrellas. El universo vive en mí.",
    "Mi alma es antigua, mi espíritu es infinito.",
    "Los planetas bailan a mi alrededor. Soy el centro de mi cosmos.",
    "Mi carta natal es mi mapa. Los cielos me guían.",
    "Soy hija del cosmos, heredera de la sabiduría ancestral.",
  ]
}

const themes = [
  { id: 'morning', name: 'Mañana', icon: Sun, color: 'from-amber-500 to-orange-500', time: '6:00 - 12:00' },
  { id: 'night', name: 'Noche', icon: Moon, color: 'from-indigo-500 to-purple-600', time: '20:00 - 6:00' },
  { id: 'moon', name: 'Lunar', icon: Star, color: 'from-gray-400 to-slate-500', time: 'Ciclos lunares' },
  { id: 'cosmic', name: 'Cósmico', icon: Sparkles, color: 'from-purple-500 to-pink-500', time: 'Siempre' },
]

export default function AffirmationsPage() {
  const [selectedTheme, setSelectedTheme] = useState<string>('morning')
  const [currentAffirmation, setCurrentAffirmation] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const getRandomAffirmation = (theme: string) => {
    const themeAffirmations = affirmations[theme as keyof typeof affirmations] || affirmations.morning
    const random = themeAffirmations[Math.floor(Math.random() * themeAffirmations.length)]
    setCurrentAffirmation(random)
  }

  // Auto-select theme based on time
  useEffect(() => {
    const hour = new Date().getHours()
    const timer = setTimeout(() => {
      if (hour >= 6 && hour < 12) setSelectedTheme('morning')
      else if (hour >= 20 || hour < 6) setSelectedTheme('night')
      else setSelectedTheme('cosmic')
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('favoriteAffirmations')
    const timer = setTimeout(() => {
      if (saved) setFavorites(JSON.parse(saved))
      getRandomAffirmation(selectedTheme)
    }, 0)
    return () => clearTimeout(timer)
  }, [selectedTheme])

  useEffect(() => {
    localStorage.setItem('favoriteAffirmations', JSON.stringify(favorites))
  }, [favorites])

  const handleNewAffirmation = () => {
    setIsAnimating(true)
    setTimeout(() => {
      getRandomAffirmation(selectedTheme)
      setIsAnimating(false)
    }, 500)
  }

  const toggleFavorite = () => {
    if (favorites.includes(currentAffirmation)) {
      setFavorites(favorites.filter(a => a !== currentAffirmation))
    } else {
      setFavorites([...favorites, currentAffirmation])
    }
  }

  const isFavorite = favorites.includes(currentAffirmation)

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-purple-950/30 to-mystica-dark-100">
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent font-mystica">
                  Afirmaciones
                </h1>
                <p className="text-xs text-gray-400">Poderosas palabras diarias</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Theme Selector */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {themes.map((theme) => {
            const Icon = theme.icon
            const isSelected = selectedTheme === theme.id
            return (
              <motion.button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-300",
                  isSelected
                    ? `bg-gradient-to-br ${theme.color} border-transparent text-white shadow-lg`
                    : "bg-mystica-dark-200/50 border-mystica-purple-700/30 text-gray-300 hover:border-mystica-gold-500/30"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <p className="text-xs font-medium">{theme.name}</p>
              </motion.button>
            )
          })}
        </div>

        {/* Main Affirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500/20 to-mystica-gold-500/20 blur-3xl rounded-full" />

          <Card className="relative bg-mystica-dark-200/80 border-mystica-purple-700/30 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              {/* Stars decoration */}
              <div className="absolute top-4 left-4 text-mystica-gold-400/50">
                ✦ ✧ ✦
              </div>
              <div className="absolute bottom-4 right-4 text-mystica-gold-400/50">
                ✦ ✧ ✦
              </div>

              {/* Affirmation Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAffirmation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? -20 : 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-8"
                >
                  <p className="text-2xl sm:text-3xl text-white font-light leading-relaxed font-mystica">
                    "{currentAffirmation}"
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <motion.button
                  onClick={toggleFavorite}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isFavorite
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "bg-mystica-purple-800/30 text-gray-400 border border-mystica-purple-600/30"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                </motion.button>

                <motion.button
                  onClick={handleNewAffirmation}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-mystica-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-mystica-purple-500/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isAnimating}
                >
                  <RefreshCw className={cn("w-6 h-6 text-white", isAnimating && "animate-spin")} />
                </motion.button>

                <motion.button
                  className="w-12 h-12 rounded-full bg-mystica-purple-800/30 text-gray-400 border border-mystica-purple-600/30 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-lg font-bold text-white font-mystica mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Tus Favoritas
            </h2>
            <div className="space-y-3">
              {favorites.slice(0, 5).map((affirmation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-mystica-dark-200/50 border border-mystica-purple-700/20"
                >
                  <p className="text-gray-300 text-sm italic">"{affirmation}"</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Daily Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-xl bg-mystica-gold-800/10 border border-mystica-gold-500/20"
        >
          <p className="text-mystica-gold-300 text-sm">
            ✨ <strong>Consejo:</strong> Repite tu afirmación 3 veces al despertar y 3 veces antes de dormir para programar tu mente.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
