'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Gem, Heart, Star, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { crystals, Crystal } from '@/data/crystals'
import { NPC3DGuide } from '@/components/NPC3DGuide'
import { cn } from '@/lib/utils'

export default function CrystalsPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessFull = isAdmin || isPremium
  
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const isisGuide = {
    id: 'isis',
    name: 'Isis',
    title: 'Madre de la Magia',
    culture: 'Egipcia',
    domain: 'Cristales',
    image: '/guides/isis-3d.png',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600'
  }

  const isisGreeting = 'Bienvenido al santuario de los cristales. Yo soy Isis, y durante milenios he custodiado los secretos de estas piedras sagradas. Cada cristal vibra con una frecuencia única que puede sanar, proteger y elevar tu espíritu. Explora su sabiduría.'

  const freeCrystals = crystals.slice(0, 8)
  const visibleCrystals = canAccessFull ? crystals : freeCrystals

  const filteredCrystals = visibleCrystals.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.properties.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const getCrystalEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      'Amatista': '💎',
      'Cuarzo Cristal': '🔮',
      'Cuarzo Rosa': '💗',
      'Lapislázuli': '💠',
      'Ojo de Tigre': '🧿',
      'Turmalina Negra': '🖤',
      'Citrino': '💛',
      'Selenita': '🤍',
      'Ágata': '🟤',
      'Jade': '💚',
      'Obsidiana': '🌑',
      'Cuarzo Ahumado': '🌫️',
    }
    return emojis[name] || '✨'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-emerald-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-mystica">
                  Guía de Cristales
                </h1>
                <p className="text-xs text-gray-400">Propiedades y usos mágicos</p>
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
          {/* Isis 3D Guide */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={isisGuide}
                dialogue={isisGreeting}
                showDialogue={true}
                size="md"
              />
              
              {/* Search */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar cristales..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-mystica-dark-200/60 border border-emerald-500/20 text-white placeholder-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Crystals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredCrystals.map((crystal, index) => (
                <motion.div
                  key={crystal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCrystal(crystal)}
                  className="cursor-pointer"
                >
                  <Card className="bg-mystica-dark-200/60 border-emerald-500/20 hover:border-emerald-400/50 transition-all h-full hover:shadow-lg hover:shadow-emerald-500/10">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{getCrystalEmoji(crystal.name)}</div>
                      <h3 className="font-bold text-white text-sm">{crystal.name}</h3>
                      <p className="text-xs text-emerald-300 mb-2">{crystal.color}</p>
                      <div className="flex justify-center flex-wrap gap-1">
                        {crystal.properties.slice(0, 2).map((p, i) => (
                          <Badge key={i} className="text-[10px] bg-emerald-900/50 text-emerald-200 border border-emerald-500/20">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Premium Upsell */}
            {!canAccessFull && (
              <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                <CardContent className="p-6 text-center">
                  <Gem className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <p className="text-white mb-2 font-mystica text-lg">Desbloquea {crystals.length - 8} cristales más</p>
                  <p className="text-gray-400 text-sm mb-4">Accede a la guía completa con Premium</p>
                  <Link href="/premium">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400">
                      <Crown className="w-4 h-4 mr-2" />
                      Hazte Premium
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Crystal Detail Modal */}
      <Dialog open={!!selectedCrystal} onOpenChange={() => setSelectedCrystal(null)}>
        <DialogContent className="bg-mystica-dark-200 border-emerald-500/30 max-w-lg">
          {selectedCrystal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-white flex items-center gap-3 font-mystica">
                  <span className="text-4xl">{getCrystalEmoji(selectedCrystal.name)}</span>
                  {selectedCrystal.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-emerald-900/50 border border-emerald-500/30">{selectedCrystal.color}</Badge>
                  <Badge className="bg-indigo-900/50 border border-indigo-500/30">{selectedCrystal.chakra}</Badge>
                  <Badge className="bg-amber-900/50 border border-amber-500/30">{selectedCrystal.element}</Badge>
                </div>
                
                <div>
                  <h4 className="font-bold text-emerald-400 mb-2">Propiedades</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCrystal.properties.map((p, i) => (
                      <Badge key={i} className="bg-emerald-900/40 text-emerald-200 border border-emerald-500/20">{p}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-emerald-400 mb-2">Beneficios</h4>
                  <ul className="space-y-2">
                    {selectedCrystal.benefits.map((b, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <Star className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-emerald-400 mb-2">Limpieza y Carga</h4>
                  <p className="text-sm text-gray-300">{selectedCrystal.cleansing}</p>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-4 rounded-xl border border-emerald-500/20">
                  <p className="text-emerald-200 italic text-sm text-center">"{selectedCrystal.affirmation}"</p>
                  <p className="text-xs text-gray-500 text-center mt-2">— Afirmación de {selectedCrystal.name}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
