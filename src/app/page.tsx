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

const features = [
  { title: 'Tarot', desc: '22 Arcanos Mayores', icon: Sparkles, href: '/cartas', gradient: 'from-purple-500 to-pink-500', free: '3 cartas', premium: '5 cartas', popular: true },
  { title: 'Oráculo', desc: 'Mensajes del universo', icon: Sun, href: '/oraculo', gradient: 'from-yellow-500 to-orange-500', free: '1 mensaje', premium: 'Ilimitado' },
  { title: 'Runas', desc: 'Sabiduría nórdica', icon: Star, href: '/runas', gradient: 'from-blue-500 to-cyan-500', free: 'Básica', premium: 'Completa' },
  { title: 'Horóscopo', desc: 'Predicciones diarias', icon: Calendar, href: '/horoscopo', gradient: 'from-pink-500 to-rose-500', free: 'Hoy', premium: 'Semanal', new: true },
  { title: 'Compatibilidad', desc: 'Conexión zodiacal', icon: Heart, href: '/compatibilidad', gradient: 'from-red-500 to-pink-500', free: 'Básica', premium: 'Detallada' },
  { title: 'Luna', desc: 'Fases y rituales', icon: Moon, href: '/calendario-lunar', gradient: 'from-indigo-500 to-purple-500', free: 'Actual', premium: 'Predicciones' },
  { title: 'Sueños', desc: 'Análisis onírico', icon: Moon, href: '/suenos', gradient: 'from-violet-500 to-purple-600', free: '5 sueños', premium: 'Ilimitado', new: true },
  { title: 'Numerología', desc: 'Poder de números', icon: Hash, href: '/numerologia', gradient: 'from-cyan-500 to-teal-500', free: 'Camino vida', premium: 'Completo', new: true },
  { title: 'Rituales', desc: 'Magia práctica', icon: Sparkles, href: '/rituales', gradient: 'from-emerald-500 to-green-600', free: '4 rituales', premium: 'Todos', new: true },
  { title: 'Cristales', desc: 'Guía de piedras', icon: Gem, href: '/cristales', gradient: 'from-pink-400 to-purple-500', free: '6 cristales', premium: 'Todos', new: true },
  { title: 'Meditaciones', desc: 'Paz interior', icon: Headphones, href: '/meditaciones', gradient: 'from-indigo-400 to-purple-500', free: '3 sesiones', premium: 'Todas', new: true },
  { title: 'Astrología', desc: '12 signos', icon: Star, href: '/astrologia', gradient: 'from-amber-500 to-orange-500', free: 'Info básica', premium: 'Carta natal' },
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-mystica-dark-300 via-mystica-purple-900/20 to-mystica-dark-200" />
          <motion.div className="absolute inset-0" animate={{ background: ['radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)', 'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)', 'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)'] }} transition={{ duration: 10, repeat: Infinity }} />
          {[...Array(50)].map((_, i) => (
            <motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="mb-8 inline-block" animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.02, 0.98, 1] }} transition={{ duration: 5, repeat: Infinity }}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 blur-3xl opacity-50" />
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 rounded-full flex items-center justify-center shadow-2xl">
                  <Moon className="w-20 h-20 text-white" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mystica-purple-400 via-mystica-gold-400 to-mystica-purple-400 bg-clip-text text-transparent">Mystica</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 font-light">Tu Portal al Mundo Místico</p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8 max-w-2xl mx-auto">
              <p className="text-lg text-mystica-purple-300 italic">"{quote.text}"</p>
              {quote.author && <p className="text-sm text-gray-500 mt-2">— {quote.author}</p>}
            </motion.div>

            {user && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <span className="text-gray-400">Bienvenido,</span>
                <span className="text-white font-semibold">{user.name}</span>
                {currentStreak > 0 && (
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium flex items-center gap-1">
                    <Flame className="w-4 h-4" />{currentStreak} días
                  </span>
                )}
                {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/cartas"><Button size="lg" className="group text-lg px-8 py-6 bg-gradient-to-r from-mystica-purple-600 to-mystica-purple-800 hover:from-mystica-purple-500 hover:to-mystica-purple-700"><Sparkles className="mr-2 h-5 w-5" />Comenzar Lectura<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></Button></Link>
              {!isPremium && !isAdmin && (
                <Link href="/premium"><Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"><Crown className="mr-2 h-5 w-5" />Hazte Premium</Button></Link>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronRight className="w-6 h-6 text-gray-500 rotate-90" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-mystica-purple-400 to-mystica-gold-400 bg-clip-text text-transparent">Explora el Misticismo</h2>
            <p className="text-gray-400 text-lg">Descubre todas las herramientas a tu disposición</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                  <Link href={feature.href}>
                    <Card className="relative group h-full bg-gradient-to-br from-mystica-dark-100/50 to-mystica-dark-200/50 border-mystica-purple-800/30 hover:border-mystica-purple-600/50 transition-all duration-300 overflow-hidden hover:scale-[1.02]">
                      {feature.popular && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-mystica-gold-500/20 text-mystica-gold-400 text-[10px] font-medium">Popular</span>}
                      {feature.new && <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">Nuevo</span>}
                      <CardContent className="p-5">
                        <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4", feature.gradient)}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-mystica-purple-300 transition-colors">{feature.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{feature.desc}</p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1"><span className="text-gray-500">Free:</span><span className="text-gray-300">{feature.free}</span></div>
                          <div className="flex items-center gap-1"><Crown className="w-3 h-3 text-yellow-500" /><span className="text-yellow-400">{feature.premium}</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
            {isAdmin && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Link href="/admin">
                  <Card className="h-full bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30 hover:border-red-500/60 transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">Panel Admin</h3>
                      <p className="text-gray-400 text-sm">Control total de la app</p>
                      <Badge variant="destructive" className="mt-4">Solo Admin</Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-mystica-dark-300/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ label: 'Usuarios Activos', value: '10,000+', icon: Users }, { label: 'Lecturas', value: '50,000+', icon: Eye }, { label: 'Precisión', value: '98%', icon: Zap }, { label: 'Satisfacción', value: '5.0⭐', icon: Star }].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                <stat.icon className="w-8 h-8 text-mystica-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isPremium && !isAdmin && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mystica-purple-900 to-mystica-purple-800 p-12 text-center">
              <div className="relative z-10">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">Desbloquea Todo el Poder Místico</h2>
                <p className="text-xl text-gray-200 mb-8">Acceso ilimitado a todas las funciones premium</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
                  <div className="text-center"><p className="text-3xl font-bold text-white">€4.99</p><p className="text-gray-300">al mes</p></div>
                  <div className="text-2xl text-gray-400">o</div>
                  <div className="text-center"><p className="text-3xl font-bold text-white">€39.99</p><p className="text-gray-300">al año</p><p className="text-sm text-green-400">Ahorra 33%</p></div>
                </div>
                <Link href="/premium"><Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"><Crown className="mr-2 h-5 w-5" />Comenzar Prueba Gratuita</Button></Link>
                <p className="text-sm text-gray-400 mt-4">7 días gratis • Cancela cuando quieras</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-mystica-purple-800/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-6 h-6 text-mystica-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-mystica-purple-400 to-mystica-gold-400 bg-clip-text text-transparent">Mystica</span>
          </div>
          <p className="text-gray-400 mb-4">© 2024 Mystica. Todos los derechos reservados.</p>
        </div>
      </footer>

      <AnimatePresence>{showCheckIn && <DailyCheckIn onClose={() => setShowCheckIn(false)} />}</AnimatePresence>
    </div>
  )
}
