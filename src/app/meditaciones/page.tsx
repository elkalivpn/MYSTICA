'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Headphones, Play, Pause, SkipBack, SkipForward, Volume2, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { meditations, Meditation } from '@/data/meditations'
import { cn } from '@/lib/utils'

export default function MeditationsPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessFull = isAdmin || isPremium
  
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const freeMeditations = meditations.slice(0, 3)
  const visibleMeditations = canAccessFull ? meditations : freeMeditations

  const categories = [
    { id: 'chakras', name: 'Chakras', icon: '🔮' },
    { id: 'visualizacion', name: 'Visualización', icon: '👁️' },
    { id: 'relajacion', name: 'Relajación', icon: '🧘' },
    { id: 'espiritual', name: 'Espiritual', icon: '✨' },
    { id: 'sanacion', name: 'Sanación', icon: '💚' },
    { id: 'abundancia', name: 'Abundancia', icon: '💰' },
  ]

  const handlePlay = () => setIsPlaying(!isPlaying)

  const nextStep = () => {
    if (selectedMeditation && currentStep < selectedMeditation.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const startMeditation = (meditation: Meditation) => {
    setSelectedMeditation(meditation)
    setCurrentStep(0)
    setIsPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-indigo-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Meditaciones Guiadas</h1>
                <p className="text-sm text-gray-400">Viajes hacia tu paz interior</p>
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
        {!selectedMeditation ? (
          <>
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <Badge key={cat.id} className="bg-indigo-900/50 text-indigo-200 cursor-pointer hover:bg-indigo-800/50">
                  {cat.icon} {cat.name}
                </Badge>
              ))}
            </div>

            {/* Meditations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleMeditations.map((meditation) => (
                <motion.div
                  key={meditation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => startMeditation(meditation)}
                  className="cursor-pointer"
                >
                  <Card className="bg-mystica-dark-100/50 border-gray-700 hover:border-indigo-500/50 transition-all h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg">{meditation.name}</h3>
                          <p className="text-sm text-gray-400">{meditation.duration} min</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <Headphones className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4">{meditation.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-900/50 text-indigo-200">{meditation.category}</Badge>
                        <Badge className="bg-purple-900/50 text-purple-200">{meditation.level}</Badge>
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
                  <Headphones className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white mb-2">Desbloquea {meditations.length - 3} meditaciones más con Premium</p>
                  <Link href="/premium">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">Hazte Premium</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Meditation Player */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <Button onClick={() => setSelectedMeditation(null)} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>

            <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30 overflow-hidden">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedMeditation.name}</h2>
                  <p className="text-gray-400">{selectedMeditation.duration} minutos • {selectedMeditation.level}</p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Paso {currentStep + 1} de {selectedMeditation.steps.length}</span>
                    <span>{Math.round(((currentStep + 1) / selectedMeditation.steps.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-mystica-dark-300 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / selectedMeditation.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                <div className="bg-mystica-dark-300/50 rounded-xl p-6 mb-6">
                  <p className="text-white text-lg text-center">{selectedMeditation.steps[currentStep]}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={prevStep} disabled={currentStep === 0} variant="ghost" size="icon">
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button
                    onClick={handlePlay}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>
                  <Button onClick={nextStep} disabled={currentStep === selectedMeditation.steps.length - 1} variant="ghost" size="icon">
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                {/* Affirmations */}
                <div className="mt-8 p-4 bg-purple-900/20 rounded-xl">
                  <p className="text-center text-purple-300 italic">"{selectedMeditation.affirmations[0]}"</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}
