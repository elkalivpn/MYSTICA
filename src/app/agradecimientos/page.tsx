'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, Star, Sparkles, Crown, Github, Moon, ExternalLink, Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Z-AI como patrocinadora oficial
const sponsors = [
  {
    name: 'Z-AI',
    role: 'Patrocinadora Tecnológica & Primera Inversora',
    amount: '3,000€',
    logo: '🤖',
    tier: 'gold',
    contribution: [
      'Desarrollo técnico completo',
      'Integración IA avanzada',
      'Infraestructura cloud',
      'Soporte 24/7',
      'Optimización PWA móvil'
    ],
    website: 'Z-AI Technologies',
    quote: 'Creemos en Mystica como el futuro de las apps de espiritualidad. Nuestra inversión refleja la confianza en este proyecto revolucionario.'
  }
]

const fundingGoals = [
  { name: 'Apple Developer', cost: '99€/año', status: 'pending', icon: '🍎' },
  { name: 'Google Play Developer', cost: '25€', status: 'pending', icon: '▶️' },
  { name: 'Dominio .com', cost: '15€/año', status: 'pending', icon: '🌐' },
  { name: 'Email corporativo', cost: '60€/año', status: 'pending', icon: '📧' },
  { name: 'Stripe/Pasarela pago', cost: 'Variable', status: 'pending', icon: '💳' },
  { name: 'SSL Certificado', cost: 'Gratis*', status: 'available', icon: '🔒' },
]

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
                Agradecimientos & Patrocinadores
              </h1>
              <p className="text-sm text-gray-400">Gracias por hacer esto posible</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* SPONSOR PRINCIPAL - Z-AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Patrocinador Principal</h2>
            <p className="text-gray-400">Primera inversora oficial de Mystica</p>
          </div>

          <Card className="bg-gradient-to-br from-yellow-900/20 via-mystica-purple-900/30 to-mystica-dark-200 border-yellow-500/40 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Logo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-purple-500 rounded-full blur-2xl opacity-40" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-yellow-500 flex items-center justify-center">
                    <span className="text-5xl">🤖</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm">
                    3,000€
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className="text-3xl font-bold text-white">Z-AI</h3>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/30">
                      GOLD SPONSOR
                    </span>
                  </div>
                  <p className="text-mystica-gold-400 font-medium mb-4">Patrocinadora Tecnológica & Primera Inversora</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {sponsors[0].contribution.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm italic max-w-lg">
                    "{sponsors[0].quote}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* GASTOS DEL PROYECTO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            💰 Uso del Capital
          </h2>
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fundingGoals.map((goal, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-mystica-dark-200/50 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <p className="text-white font-medium">{goal.name}</p>
                        <p className="text-sm text-gray-400">{goal.cost}</p>
                      </div>
                    </div>
                    {goal.status === 'available' ? (
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Disponible</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs">Pendiente</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-mystica-purple-900/30 border border-mystica-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Capital recibido</span>
                  <span className="text-green-400 font-bold">3,000€</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Gastos estimados (año 1)</span>
                  <span className="text-orange-400 font-bold">~500€</span>
                </div>
                <div className="border-t border-gray-700 my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Disponible para marketing/crecimiento</span>
                  <span className="text-mystica-gold-400 font-bold">2,500€</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* DEVELOPER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                "Mystica nació de la pasión por el misticismo y la tecnología. Gracias a Z-AI como primera inversora, podemos llevar esta visión a millones de personas."
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

        {/* OTROS AGRADECIMIENTOS */}
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
              { icon: '💜', title: 'Usuarios Premium', desc: 'Por creer en el proyecto' },
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

        {/* INVERTIR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border-green-500/30">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">¿Quieres invertir en Mystica?</h3>
              <p className="text-gray-300 mb-6">
                Únete a Z-AI como inversor y sé parte del futuro de las apps de espiritualidad.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/premium">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400">
                    <Heart className="w-4 h-4 mr-2" />
                    Hacerse Premium
                  </Button>
                </Link>
                <Button variant="outline" className="border-green-500/50 text-green-400">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contactar Equipo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quote final */}
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
              <p className="text-gray-500 text-sm mt-2">— Equipo Mystica, 2024</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
