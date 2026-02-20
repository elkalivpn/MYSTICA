'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Moon, Star, Crown, ArrowRight, Flame, Shield, ChevronRight,
  Sun, Hash, Gem, Headphones, Heart, Users, Calendar, Eye, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useStreak } from '@/hooks/useStreak'
import { cn } from '@/lib/utils'
import { DailyCheckIn } from '@/components/DailyCheckIn'
import { getRotatingQuote } from '@/data/quotes'
import Image from 'next/image'

// Guías espirituales 3D con imágenes hiperrealistas
const npcGuides = [
  {
    id: 'hecate',
    name: 'Hécate',
    title: 'Diosa de la Magia',
    culture: 'Griega',
    domain: 'Tarot',
    href: '/cartas',
    image: '/guides/hecate-3d.png',
    gradient: 'from-purple-600 to-pink-600',
    description: 'Guardiana de las encrucijadas y el tarot',
    color: '#9333ea',
  },
  {
    id: 'frigg',
    name: 'Frigg',
    title: 'Madre del Cosmos',
    culture: 'Nórdica',
    domain: 'Runas',
    href: '/runas',
    image: '/guides/frigg-3d.png',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Diosa de la sabiduría y las runas',
    color: '#3b82f6',
  },
  {
    id: 'selene',
    name: 'Selene',
    title: 'Señora de la Luna',
    culture: 'Griega',
    domain: 'Luna',
    href: '/calendario-lunar',
    image: '/guides/selene-3d.png',
    gradient: 'from-purple-400 to-indigo-500',
    description: 'Diosa de la Luna y sus ciclos',
    color: '#a855f7',
  },
  {
    id: 'morpheus',
    name: 'Morfeo',
    title: 'Señor de los Sueños',
    culture: 'Griega',
    domain: 'Sueños',
    href: '/suenos',
    image: '/guides/morpheus-3d.png',
    gradient: 'from-indigo-500 to-violet-600',
    description: 'Dios de los sueños y visiones',
    color: '#6366f1',
  },
  {
    id: 'isis',
    name: 'Isis',
    title: 'Madre de la Magia',
    culture: 'Egipcia',
    domain: 'Cristales',
    href: '/cristales',
    image: '/guides/isis-3d.png',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Diosa de la magia y cristales',
    color: '#10b981',
  },
  {
    id: 'thoth',
    name: 'Thoth',
    title: 'Escriba de los Dioses',
    culture: 'Egipcia',
    domain: 'Astrología',
    href: '/astrologia',
    image: '/guides/thoth-3d.png',
    gradient: 'from-amber-500 to-orange-500',
    description: 'Dios de la sabiduría y astrología',
    color: '#f59e0b',
  },
]

const extraFeatures = [
  { title: 'Oráculo', desc: 'Mensajes del universo', icon: Sun, href: '/oraculo', gradient: 'from-yellow-500 to-orange-500' },
  { title: 'Horóscopo', desc: 'Predicciones diarias', icon: Calendar, href: '/horoscopo', gradient: 'from-pink-500 to-rose-500', premium: true },
  { title: 'Carta Natal', desc: 'Tu mapa astral', icon: Star, href: '/carta-natal', gradient: 'from-purple-500 to-violet-600' },
  { title: 'Afirmaciones', desc: 'Poderosas palabras', icon: Sparkles, href: '/afirmaciones', gradient: 'from-amber-400 to-orange-500' },
  { title: 'Compatibilidad', desc: 'Conexión zodiacal', icon: Heart, href: '/compatibilidad', gradient: 'from-red-500 to-pink-500' },
  { title: 'Numerología', desc: 'Poder de números', icon: Hash, href: '/numerologia', gradient: 'from-cyan-500 to-teal-500' },
  { title: 'Rituales', desc: 'Magia práctica', icon: Sparkles, href: '/rituales', gradient: 'from-emerald-500 to-green-600' },
  { title: 'Meditaciones', desc: 'Paz interior', icon: Headphones, href: '/meditaciones', gradient: 'from-indigo-400 to-purple-500', highlight: true },
  { title: 'Perfil', desc: 'Tu identidad cósmica', icon: Crown, href: '/perfil-cosmico', gradient: 'from-yellow-400 to-amber-500' },
  { title: 'Ajustes', desc: 'Personaliza tu app', icon: Users, href: '/ajustes', gradient: 'from-gray-500 to-slate-600' },
]

export default function HomePage() {
  const { user, isAdmin, isPremium } = useAuth()
  const { currentStreak, lastCheckIn } = useStreak()
  const [quote, setQuote] = useState({ text: '', author: '' })
  const [showCheckIn, setShowCheckIn] = useState(false)

  useEffect(() => {
    const dailyQuote = getRotatingQuote(6)
    setQuote({ text: dailyQuote.text, author: dailyQuote.author || '' })
    const today = new Date().toISOString().split('T')[0]
    if (lastCheckIn !== today) setTimeout(() => setShowCheckIn(true), 2000)
  }, [lastCheckIn])

  return (
    <div className="min-h-screen relative">
      {/* Background Image - Templo Borobudur */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/backgrounds/borobudur-temple.png"
          alt="Templo Borobudur - Fondo Místico"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mystica-dark-300/90 via-mystica-dark-300/80 to-mystica-dark-300/95" />
      </div>

      {/* Estrellas animadas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 1, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo animado */}
            <motion.div
              className="mb-8 inline-block"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 blur-3xl opacity-60" />
                <motion.div
                  className="relative w-36 h-36 mx-auto bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 rounded-full flex items-center justify-center shadow-2xl border-2 border-mystica-gold-400/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Moon className="w-20 h-20 text-mystica-gold-300" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mystica-purple-300 via-mystica-gold-300 to-mystica-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                MYSTICA
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-4 font-light tracking-wide">
              Tu Portal al Mundo Místico
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8 max-w-2xl mx-auto p-4 rounded-xl bg-mystica-dark-200/60 border border-mystica-purple-700/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-mystica-gold-400" />
                <span className="text-xs text-mystica-gold-400 font-medium">Frase del día</span>
              </div>
              <p className="text-lg text-mystica-purple-200 italic">"{quote.text}"</p>
              {quote.author && <p className="text-sm text-gray-400 mt-2">— {quote.author}</p>}
            </motion.div>

            {user && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-8"
              >
                <span className="text-gray-300">Bienvenido,</span>
                <span className="text-white font-semibold">{user.name}</span>
                {currentStreak > 0 && (
                  <span className="px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-sm font-medium flex items-center gap-1.5 border border-orange-500/30">
                    <Flame className="w-4 h-4" />{currentStreak} días
                  </span>
                )}
                {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/cartas">
                <Button
                  size="lg"
                  className="group text-lg px-10 py-7 bg-gradient-to-r from-mystica-purple-600 to-mystica-purple-800 hover:from-mystica-purple-500 hover:to-mystica-purple-700 shadow-xl shadow-mystica-purple-500/30 border border-mystica-purple-400/30"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Comenzar Lectura
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {!isPremium && !isAdmin && (
                <Link href="/premium">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-xl shadow-yellow-500/30 border border-yellow-400/30"
                  >
                    <Crown className="mr-2 h-5 w-5" />
                    Hazte Premium
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-8 h-8 text-mystica-gold-400/60 rotate-90" />
        </motion.div>
      </section>

      {/* Guías Espirituales 3D - SECCIÓN PRINCIPAL */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-mystica-purple-300 to-mystica-gold-300 bg-clip-text text-transparent">
              Elige tu Guía Espiritual
            </h2>
            <p className="text-gray-400 text-lg">Deidades ancestrales te esperan para guiarte</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {npcGuides.map((npc, index) => (
              <motion.div
                key={npc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={npc.href}>
                  <Card className="relative group h-full bg-mystica-dark-200/60 border-mystica-purple-700/40 hover:border-mystica-gold-500/50 transition-all duration-500 overflow-hidden hover:scale-[1.02] backdrop-blur-sm">
                    {/* Imagen 3D del guía */}
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mt-6">
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-50 blur-xl"
                        style={{ background: `linear-gradient(135deg, ${npc.color} 0%, ${npc.color}80 100%)` }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-mystica-purple-500/30 group-hover:border-mystica-gold-500/50 transition-all duration-300">
                        <Image
                          src={npc.image}
                          alt={npc.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority
                        />
                      </div>
                    </div>

                    <CardContent className="p-4 text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-mystica-gold-300 transition-colors">
                        {npc.name}
                      </h3>
                      <p className="text-xs text-mystica-purple-300 mb-2">{npc.title}</p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-mystica-purple-800/50 text-mystica-purple-200 border border-mystica-purple-600/30">
                          {npc.culture}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-mystica-gold-800/30 text-mystica-gold-300 border border-mystica-gold-600/30">
                          {npc.domain}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{npc.description}</p>

                      <div className="flex justify-center mt-4">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-mystica-purple-700/50 flex items-center justify-center border border-mystica-purple-500/30 group-hover:bg-mystica-gold-600/30 group-hover:border-mystica-gold-500/50 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ArrowRight className="w-4 h-4 text-mystica-purple-300 group-hover:text-mystica-gold-300 transition-colors" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Más Funciones */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-300">
              Más Funciones
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {extraFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={feature.href}>
                    <motion.div
                      className={cn(
                        "group flex flex-col items-center p-3 rounded-xl transition-all duration-300",
                        feature.highlight
                          ? "bg-indigo-900/50 border-2 border-indigo-500/50 hover:border-indigo-400"
                          : "bg-mystica-dark-200/50 border border-mystica-purple-700/30 hover:border-mystica-gold-500/40"
                      )}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2 shadow-lg', feature.gradient)}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <span className="text-xs text-gray-300 text-center group-hover:text-white transition-colors">
                        {feature.title}
                      </span>
                      {feature.premium && (
                        <Crown className="w-3 h-3 text-yellow-500 mt-1" />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-mystica-dark-300/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Usuarios Activos', value: '10,000+', icon: Users },
              { label: 'Lecturas', value: '50,000+', icon: Eye },
              { label: 'Precisión', value: '98%', icon: Zap },
              { label: 'Satisfacción', value: '5.0⭐', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-mystica-gold-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      {!isPremium && !isAdmin && (
        <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mystica-purple-900/80 to-mystica-dark-300/80 p-12 text-center border border-mystica-gold-500/30 backdrop-blur-lg shadow-2xl"
            >
              <Crown className="w-16 h-16 text-mystica-gold-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">Desbloquea Todo el Poder Místico</h2>
              <p className="text-xl text-gray-200 mb-8">Acceso ilimitado a todas las funciones premium</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">€4.99</p>
                  <p className="text-gray-300">al mes</p>
                </div>
                <div className="text-2xl text-gray-500">o</div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">€39.99</p>
                  <p className="text-gray-300">al año</p>
                  <p className="text-sm text-green-400">Ahorra 33%</p>
                </div>
              </div>
              <Link href="/premium">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-xl shadow-yellow-500/30">
                  <Crown className="mr-2 h-5 w-5" />
                  Comenzar Prueba Gratuita
                </Button>
              </Link>
              <p className="text-sm text-gray-400 mt-4">7 días gratis • Cancela cuando quieras</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 border-t border-mystica-purple-700/30 bg-mystica-dark-300/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-6 h-6 text-mystica-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-mystica-purple-300 to-mystica-gold-300 bg-clip-text text-transparent">
              Mystica
            </span>
          </div>
          <p className="text-gray-400 mb-3 text-sm">© 2024 Mystica. Todos los derechos reservados.</p>
          <div className="mb-4 py-3 px-4 rounded-lg bg-mystica-dark-200/50 inline-block border border-mystica-purple-700/30">
            <p className="text-mystica-purple-200 text-sm">
              ✨ Desarrollado con 💜 por <span className="font-semibold text-mystica-gold-400">Yrys</span> ✨
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm">
            <Link href="/agradecimientos" className="text-gray-500 hover:text-mystica-purple-300 transition-colors">
              Agradecimientos
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/premium" className="text-gray-500 hover:text-mystica-gold-400 transition-colors">
              Patrocinar
            </Link>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCheckIn && <DailyCheckIn onClose={() => setShowCheckIn(false)} />}
      </AnimatePresence>
    </div>
  )
}
