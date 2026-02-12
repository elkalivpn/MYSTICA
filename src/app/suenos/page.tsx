'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, BookOpen, Save, Trash2, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { dreamSymbols, analyzeDreamContent, DreamSymbol } from '@/data/dream-symbols'
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
  
  const emotions = ['Felicidad', 'Miedo', 'Tristeza', 'Ansiedad', 'Paz', 'Confusión', 'Amor', 'Ira', 'Sorpresa', 'Esperanza']

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
    }, 1500)
  }

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-violet-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-violet-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Diario de Sueños</h1>
                <p className="text-sm text-gray-400">Registra y analiza tus sueños</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* New Dream Entry */}
        <Card className="bg-mystica-dark-100/50 border-gray-700 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-violet-400" />
              Registrar Sueño
            </h2>
            
            <div className="space-y-4">
              <Input
                placeholder="Título del sueño..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-mystica-dark-200 border-gray-700"
              />
              
              <textarea
                placeholder="Describe tu sueño con el mayor detalle posible..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-3 rounded-lg bg-mystica-dark-200 border border-gray-700 text-white placeholder-gray-500 resize-none"
              />
              
              <div>
                <p className="text-sm text-gray-400 mb-2">Emociones:</p>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion}
                      onClick={() => toggleEmotion(emotion)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-all",
                        selectedEmotions.includes(emotion)
                          ? "bg-violet-500 text-white"
                          : "bg-mystica-dark-200 text-gray-400 hover:text-white"
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
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500"
              >
                {analyzing ? 'Analizando...' : 'Guardar y Analizar'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dream History */}
        <h2 className="text-xl font-bold text-white mb-4">Tus Sueños</h2>
        <div className="space-y-4">
          {dreams.length === 0 ? (
            <Card className="bg-mystica-dark-100/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Moon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Aún no has registrado ningún sueño</p>
              </CardContent>
            </Card>
          ) : (
            dreams.map((dream) => (
              <motion.div
                key={dream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-mystica-dark-100/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{dream.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(dream.date).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{dream.content}</p>
                    
                    {dream.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {dream.emotions.map((e, i) => (
                          <Badge key={i} className="bg-violet-900/50 text-violet-200">{e}</Badge>
                        ))}
                      </div>
                    )}
                    
                    {dream.analyzedSymbols.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Símbolos detectados:</p>
                        <div className="flex flex-wrap gap-2">
                          {dream.analyzedSymbols.map((s) => (
                            <Badge key={s.id} className="bg-purple-900/50 text-purple-200">{s.name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
