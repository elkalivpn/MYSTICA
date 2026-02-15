'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Moon, Save, Trash2, Sparkles, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { dreamSymbols, analyzeDreamContent, DreamSymbol } from '@/data/dream-symbols'
import { NPC3DGuide } from '@/components/NPC3DGuide'
import { cn } from '@/lib/utils'

interface DreamEntry {
  id: string
  title: string
  content: string
  date: string
  emotions: string[]
  analyzedSymbols: DreamSymbol[]
}

export default function DreamsPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessFull = isAdmin || isPremium
  
  const [dreams, setDreams] = useState<DreamEntry[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const emotions = ['Felicidad', 'Miedo', 'Tristeza', 'Ansiedad', 'Paz', 'Confusión', 'Amor', 'Ira', 'Sorpresa', 'Esperanza']

  const morpheusGuide = {
    id: 'morpheus',
    name: 'Morfeo',
    title: 'Señor de los Sueños',
    culture: 'Griega',
    domain: 'Sueños',
    image: '/guides/morpheus-3d.png',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-violet-600'
  }

  const morpheusGreeting = 'Te doy la bienvenida al reino de los sueños, donde lo imposible se vuelve posible. Yo soy Morfeo, y aquí los símbolos hablan en el lenguaje del alma. Registra tus sueños y te ayudaré a descifrar sus mensajes ocultos.'

  const analyzeDream = () => {
    if (!content.trim()) return
    setAnalyzing(true)
    
    setTimeout(() => {
      const symbols = analyzeDreamContent(content)
      const newDream: DreamEntry = {
        id: Date.now().toString(),
        title: title || 'Sin título',
        content,
        date: new Date().toISOString(),
        emotions: selectedEmotions,
        analyzedSymbols: symbols
      }
      setDreams([newDream, ...dreams])
      setTitle('')
      setContent('')
      setSelectedEmotions([])
      setAnalyzing(false)
      setShowForm(false)
    }, 2000)
  }

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    )
  }

  const deleteDream = (id: string) => {
    setDreams(dreams.filter(d => d.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-violet-950/20 to-mystica-dark-100">
      <header className="sticky top-14 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent font-mystica">
                  Diario de Sueños
                </h1>
                <p className="text-xs text-gray-400">Analiza tus sueños</p>
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
          {/* Morpheus 3D Guide */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-36">
              <NPC3DGuide
                guide={morpheusGuide}
                dialogue={morpheusGreeting}
                showDialogue={true}
                size="md"
              />
              
              {/* Add Dream Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  {showForm ? 'Cancelar' : 'Registrar Sueño'}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* New Dream Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="bg-mystica-dark-200/60 border-violet-500/30 overflow-hidden">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-mystica">
                        <Moon className="w-5 h-5 text-violet-400" />
                        Nuevo Sueño
                      </h2>
                      
                      <div className="space-y-4">
                        <Input
                          placeholder="Título del sueño..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="bg-mystica-dark-300/50 border-violet-500/30 text-white"
                        />
                        
                        <textarea
                          placeholder="Describe tu sueño con el mayor detalle posible. Incluye colores, personas, lugares, emociones..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full h-32 p-3 rounded-lg bg-mystica-dark-300/50 border border-violet-500/30 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-violet-400/50"
                        />
                        
                        <div>
                          <p className="text-sm text-violet-300 mb-2">Emociones sentidas:</p>
                          <div className="flex flex-wrap gap-2">
                            {emotions.map((emotion) => (
                              <button
                                key={emotion}
                                onClick={() => toggleEmotion(emotion)}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-sm transition-all border",
                                  selectedEmotions.includes(emotion)
                                    ? "bg-violet-600/50 border-violet-400 text-white"
                                    : "bg-mystica-dark-300/50 border-gray-700 text-gray-400 hover:border-violet-500/50"
                                )}
                              >
                                {emotion}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <Button
                          onClick={analyzeDream}
                          disabled={!content.trim() || analyzing}
                          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                        >
                          {analyzing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                <Sparkles className="w-4 h-4 mr-2" />
                              </motion.div>
                              Analizando símbolos...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Guardar y Analizar
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dream History */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4 font-mystica flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Tus Sueños Registrados
              </h2>
              
              {dreams.length === 0 ? (
                <Card className="bg-mystica-dark-200/40 border-violet-500/20">
                  <CardContent className="p-8 text-center">
                    <Moon className="w-16 h-16 text-violet-500/30 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Aún no has registrado ningún sueño</p>
                    <p className="text-gray-500 text-sm">Haz clic en "Registrar Sueño" para comenzar tu diario onírico</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {dreams.map((dream, index) => (
                    <motion.div
                      key={dream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-mystica-dark-200/60 border-violet-500/30 overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-white">{dream.title}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(dream.date).toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteDream(dream.id)}
                              className="text-gray-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <p className="text-gray-300 mb-4 leading-relaxed">{dream.content}</p>
                          
                          {dream.emotions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {dream.emotions.map((e, i) => (
                                <Badge key={i} className="bg-violet-900/50 text-violet-200 border border-violet-500/30">
                                  {e}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {dream.analyzedSymbols.length > 0 && (
                            <div className="pt-4 border-t border-violet-500/20">
                              <p className="text-sm text-violet-300 mb-2 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Símbolos detectados por Morfeo:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {dream.analyzedSymbols.map((s) => (
                                  <div
                                    key={s.id}
                                    className="px-3 py-1.5 rounded-lg bg-purple-900/30 border border-purple-500/30"
                                  >
                                    <span className="text-purple-300 text-sm">{s.symbol}</span>
                                    <span className="text-gray-500 text-xs ml-2">— {s.meaning}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Symbol Dictionary */}
            <Card className="bg-mystica-dark-200/40 border-violet-500/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-white mb-4 font-mystica">Diccionario de Símbolos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dreamSymbols.slice(0, 12).map((symbol) => (
                    <div
                      key={symbol.id}
                      className="p-3 rounded-lg bg-mystica-dark-300/50 border border-gray-700/50 hover:border-violet-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{symbol.symbol}</span>
                        <span className="text-sm text-violet-300">{symbol.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{symbol.meaning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
