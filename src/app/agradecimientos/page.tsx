'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, Star, Sparkles, Crown, Github, ExternalLink, Check, Zap, Coffee, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const fundingGoals = [
  { name: 'Apple Developer', cost: '99 EUR/año', status: 'pending', icon: '🍎' },
  { name: 'Google Play Developer', cost: '25 EUR', status: 'pending', icon: '▶️' },
  { name: 'Dominio .app', cost: '15 EUR/año', status: 'pending', icon: '🌐' },
  { name: 'Email corporativo', cost: '60 EUR/año', status: 'pending', icon: '📧' },
  { name: 'Servidor VPS', cost: '120 EUR/año', status: 'pending', icon: '🖥️' },
  { name: 'SSL Certificado', cost: 'Gratis', status: 'available', icon: '🔒' },
]

const teamMembers = [
  {
    name: 'Yrys',
    role: 'Creadora & Desarrolladora',
    avatar: '🔮',
    social: 'https://github.com/elkalivpn',
    username: '@elkalivpn'
  }
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
                Agradecimientos
              </h1>
              <p className="text-sm text-gray-400">Gracias por hacer esto posible</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* DONACIONES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <Heart className="w-10 h-10 text-pink-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white">Apoya el Proyecto</h2>
            <p className="text-gray-400 mt-2">Ayuda a que Mystica siga creciendo</p>
          </div>

          <Card className="bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-mystica-dark-200 border-pink-500/40 overflow-hidden">
            <CardContent className="p-8 text-center">
              <Gift className="w-16 h-16 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Hacer una Donacion</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Tu aportacion ayuda a cubrir los costes de desarrollo, servidores y nuevas funcionalidades.
                Cada contribucion, por pequena que sea, marca la diferencia.
              </p>
              
              <a 
                href="https://www.paypal.com/donate/?hosted_button_id=JRTW5XP38JDUC"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-8 py-6 text-lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donar con PayPal
                </Button>
              </a>
              
              <p className="text-gray-500 text-sm mt-4">
                Se redirigira a PayPal para completar la donacion de forma segura.
              </p>
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
            Fondos Necesarios
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
                <div className="text-center">
                  <p className="text-gray-300 mb-2">Coste estimado anual</p>
                  <p className="text-3xl font-bold text-mystica-gold-400">~300 EUR</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Sin incluir marketing, publicidad ni desarrollos adicionales
                  </p>
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
          <div className="text-center mb-6">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Creadora</h2>
          </div>
          
          {teamMembers.map((member, i) => (
            <Card key={i} className="bg-gradient-to-br from-mystica-purple-900/30 to-mystica-dark-200 border-mystica-purple-500/30 mb-8 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-mystica-purple-500 to-mystica-gold-500 rounded-full blur-xl opacity-50" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-mystica-purple-600 to-mystica-purple-800 flex items-center justify-center">
                    <span className="text-3xl">{member.avatar}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-mystica-gold-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  "Mystica nacio de la pasion por el misticismo y la tecnologia. 
                  Mi objetivo es crear herramientas espirituales accesibles para todos."
                </p>
                <a 
                  href={member.social} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-mystica-purple-300 hover:text-mystica-purple-200 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  {member.username}
                </a>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* AGRADECIMIENTOS */}
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
              { icon: '🔮', title: 'Sabiduria Ancestral', desc: 'Por preservar el conocimiento' },
              { icon: '💜', title: 'Usuarios', desc: 'Por usar y compartir Mystica' },
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

        {/* VOLVERSE PREMIUM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border-yellow-500/30">
            <CardContent className="p-8 text-center">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Hazte Premium</h3>
              <p className="text-gray-300 mb-6">
                Accede a todas las funcionalidades y apoya el desarrollo continuo.
              </p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black">
                  <Crown className="w-4 h-4 mr-2" />
                  Ver Planes Premium
                </Button>
              </Link>
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
                "El universo conspira a favor de quienes suenan despiertos."
              </p>
              <p className="text-gray-500 text-sm mt-2">— Equipo Mystica, 2024</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
