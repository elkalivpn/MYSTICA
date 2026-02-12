'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Sparkles, Flame, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { rituals, Ritual } from '@/data/rituals'
import { cn } from '@/lib/utils'

export default function RitualesPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium
  
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const freeRituals = rituals.filter(r => !r.premium)
  const premiumRituals = rituals.filter(r => r.premium)
  const visibleRituals = canAccessPremium ? rituals : freeRituals

  const categories = [
    { id: 'luna', name: 'Luna', icon: '🌙' },
    { id: 'proteccion', name: 'Protección', icon: '🛡️' },
    { id: 'amor', name: 'Amor', icon: '💕' },
    { id: 'abundancia', name: 'Abundancia', icon: '💰' },
    { id: 'limpieza', name: 'Limpieza', icon: '✨' },
    { id: 'manifestacion', name: 'Manifestación', icon: '🌟' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-emerald-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Rituales y Hechizos</h1>
                <p className="text-sm text-gray-400">Guías mágicas paso a paso</p>
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
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Badge key={cat.id} className="bg-emerald-900/50 text-emerald-200 cursor-pointer hover:bg-emerald-800/50">
              {cat.icon} {cat.name}
            </Badge>
          ))}
        </div>

        {!selectedRitual ? (
          /* Ritual List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRituals.map((ritual) => (
              <motion.div
                key={ritual.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedRitual(ritual)}
                className="cursor-pointer"
              >
                <Card className="bg-mystica-dark-100/50 border-gray-700 hover:border-emerald-500/50 transition-all h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white">{ritual.name}</h3>
                        <p className="text-sm text-gray-400">{ritual.moonPhase || ritual.category}</p>
                      </div>
                      <span className="text-2xl">
                        {ritual.category === 'luna' ? '🌙' :
                         ritual.category === 'proteccion' ? '🛡️' :
                         ritual.category === 'amor' ? '💕' :
                         ritual.category === 'abundancia' ? '💰' :
                         ritual.category === 'limpieza' ? '✨' : '🌟'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{ritual.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className="bg-emerald-900/50 text-emerald-200">{ritual.duration}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Ritual Detail */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button onClick={() => { setSelectedRitual(null); setCompletedSteps([]) }} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>

            <Card className="bg-mystica-dark-100/50 border-gray-700 mb-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedRitual.name}</h2>
                <p className="text-gray-300 mb-4">{selectedRitual.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedRitual.moonPhase && <Badge className="bg-indigo-900/50">{selectedRitual.moonPhase}</Badge>}
                  <Badge className="bg-emerald-900/50">{selectedRitual.duration}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            <Card className="bg-mystica-dark-100/50 border-gray-700 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Materiales Necesarios</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRitual.materials.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <span className="text-emerald-400">•</span> {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="bg-mystica-dark-100/50 border-gray-700 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Pasos del Ritual</h3>
                <div className="space-y-3">
                  {selectedRitual.steps.map((step, i) => (
                    <button
                      key={i}
                      onClick={() => toggleStep(i)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all",
                        completedSteps.includes(i)
                          ? "bg-emerald-900/30 border border-emerald-500/30"
                          : "bg-mystica-dark-200/50 border border-gray-700"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-sm",
                          completedSteps.includes(i) ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-400"
                        )}>
                          {completedSteps.includes(i) ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <p className={cn(
                          "flex-1",
                          completedSteps.includes(i) ? "text-emerald-200" : "text-gray-300"
                        )}>
                          {step}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Incantation */}
            {selectedRitual.incantation && (
              <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border-emerald-500/30 mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4">Encantamiento</h3>
                  <p className="text-white italic text-lg">"{selectedRitual.incantation}"</p>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="bg-mystica-dark-100/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Consejos</h3>
                <ul className="space-y-2">
                  {selectedRitual.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <Sparkles className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Premium Upsell */}
        {!canAccessPremium && premiumRituals.length > 0 && !selectedRitual && (
          <Card className="bg-yellow-900/20 border-yellow-500/30 mt-8">
            <CardContent className="p-6 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white mb-2">Desbloquea {premiumRituals.length} rituales más con Premium</p>
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">Hazte Premium</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
