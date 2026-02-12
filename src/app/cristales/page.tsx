'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Gem, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { crystals, Crystal } from '@/data/crystals'
import { cn } from '@/lib/utils'

export default function CrystalsPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessFull = isAdmin || isPremium
  
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const freeCrystals = crystals.slice(0, 6)
  const visibleCrystals = canAccessFull ? crystals : freeCrystals

  const filteredCrystals = visibleCrystals.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.properties.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-pink-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Guía de Cristales</h1>
                <p className="text-sm text-gray-400">Propiedades y usos mágicos</p>
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
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar cristales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg bg-mystica-dark-100/50 border border-gray-700 text-white placeholder-gray-500"
          />
        </div>

        {/* Crystals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCrystals.map((crystal) => (
            <motion.div
              key={crystal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedCrystal(crystal)}
              className="cursor-pointer"
            >
              <Card className="bg-mystica-dark-100/50 border-gray-700 hover:border-pink-500/50 transition-all h-full">
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">
                    {crystal.name === 'Amatista' ? '💎' :
                     crystal.name === 'Cuarzo Cristal' ? '🔮' :
                     crystal.name === 'Cuarzo Rosa' ? '💗' :
                     crystal.name === 'Lapislázuli' ? '💠' :
                     crystal.name === 'Ojo de Tigre' ? '🧿' : '✨'}
                  </div>
                  <h3 className="font-bold text-white">{crystal.name}</h3>
                  <p className="text-sm text-gray-400">{crystal.color}</p>
                  <div className="flex justify-center gap-1 mt-2">
                    {crystal.properties.slice(0, 2).map((p, i) => (
                      <Badge key={i} className="text-[10px] bg-pink-900/50 text-pink-200">{p}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Premium Upsell */}
        {!canAccessFull && (
          <Card className="bg-yellow-900/20 border-yellow-500/30 mt-8">
            <CardContent className="p-6 text-center">
              <Gem className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white mb-2">Desbloquea {crystals.length - 6} cristales más con Premium</p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">Hazte Premium</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Crystal Detail Modal */}
        <Dialog open={!!selectedCrystal} onOpenChange={() => setSelectedCrystal(null)}>
          <DialogContent className="bg-mystica-dark-100 border-gray-700 max-w-lg">
            {selectedCrystal && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white flex items-center gap-2">
                    <span className="text-3xl">
                      {selectedCrystal.name === 'Amatista' ? '💎' :
                       selectedCrystal.name === 'Cuarzo Cristal' ? '🔮' :
                       selectedCrystal.name === 'Cuarzo Rosa' ? '💗' : '✨'}
                    </span>
                    {selectedCrystal.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge className="bg-pink-900/50">{selectedCrystal.color}</Badge>
                    <Badge className="bg-indigo-900/50">{selectedCrystal.chakra}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">Elemento: {selectedCrystal.element}</p>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">Propiedades</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedCrystal.properties.map((p, i) => (
                        <Badge key={i} className="bg-pink-900/50 text-pink-200">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">Beneficios</h4>
                    <ul className="space-y-1">
                      {selectedCrystal.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <Star className="w-3 h-3 text-pink-400 mt-1 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white mb-2">Limpieza</h4>
                    <p className="text-sm text-gray-300">{selectedCrystal.cleansing}</p>
                  </div>
                  
                  <div className="bg-pink-900/20 p-3 rounded-lg">
                    <p className="text-pink-300 italic text-sm">"{selectedCrystal.affirmation}"</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
