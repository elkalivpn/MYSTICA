'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, Star, Sparkles, Crown, Github, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AgradecimientosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-mystica-purple-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-mystica-purple-800/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-mystica-purple-400 to-mystica-gold-400 bg-clip-text text-transparent">
                Agradecimientos
              </h1>
              <p className="text-sm text-gray-400">Gracias por hacer esto posible</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            💜
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Gracias por tu apoyo</h2>
          <p className="text-gray-300 max-w-lg mx-auto">
            Mystica nació de la pasión por el misticismo y la tecnología. 
            Cada lectura, cada ritual, cada momento de conexión espiritual es posible gracias a personas como tú.
          </p>
        </motion.div>

        {/* Developer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-mystica-purple-900/30 to-mystica-dark-200 border-mystica-purple-500/30 mb-8 overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 rounded-full blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 flex items-center justify-center">
                  <span className="text-3xl">🔮</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Yrys</h3>
              <p className="text-mystica-gold-400 font-medium mb-4">Desarrolladora & Creadora</p>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                "Creo que la tecnología puede ser un puente hacia nuestra espiritualidad. 
                Mystica es mi forma de compartir esa visión con el mundo."
              </p>
              <a 
                href="https://github.com/elkalivpn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-mystica-purple-300 hover:text-mystica-purple-200 transition-colors"
              >
                <Github className="w-5 h-5" />
                @elkalivpn
              </a>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sponsor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border-yellow-500/30 mb-8">
            <CardContent className="p-8 text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">¿Te gusta Mystica?</h3>
              <p className="text-gray-300 mb-6">
                Puedes apoyar el desarrollo de la app haciéndote Premium o compartiendo con amigos.
              </p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400">
                  <Heart className="w-4 h-4 mr-2" />
                  Apoyar el Proyecto
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Thanks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 text-center">Agradecimientos Especiales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '⭐', title: 'Comunidad Mystica', desc: 'Por cada sugerencia y feedback' },
              { icon: '🌙', title: 'Luna y Estrellas', desc: 'Por guiar nuestros caminos' },
              { icon: '🔮', title: 'Sabiduría Ancestral', desc: 'Por preservar el conocimiento' },
              { icon: '💜', title: 'Usuarios Premium', desc: 'Por hacer esto sostenible' },
            ].map((item, i) => (
              <Card key={i} className="bg-mystica-dark-100/50 border-gray-700">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="bg-mystica-dark-100/30 border-mystica-purple-800/20">
            <CardContent className="p-6">
              <Sparkles className="w-6 h-6 text-mystica-gold-400 mx-auto mb-4" />
              <p className="text-mystica-purple-200 italic text-lg">
                "El universo conspira a favor de quienes sueñan despiertos."
              </p>
              <p className="text-gray-500 text-sm mt-2">— Mystica</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
