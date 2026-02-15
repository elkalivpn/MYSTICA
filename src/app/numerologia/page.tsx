'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Hash, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { calculateLifePath, calculateDestiny, calculateSoulUrge, calculatePersonality, calculatePersonalYear, NumerologyResult } from '@/lib/numerology'
import { cn } from '@/lib/utils'

export default function NumerologiaPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessFull = isAdmin || isPremium
  
  const [birthDate, setBirthDate] = useState('')
  const [fullName, setFullName] = useState('')
  const [results, setResults] = useState<{
    lifePath?: NumerologyResult
    destiny?: NumerologyResult
    soulUrge?: NumerologyResult
    personality?: NumerologyResult
    personalYear?: NumerologyResult
  } | null>(null)
  const [calculating, setCalculating] = useState(false)

  const calculate = () => {
    if (!birthDate) return
    setCalculating(true)
    
    setTimeout(() => {
      const lifePath = calculateLifePath(birthDate)
      let destiny, soulUrge, personality, personalYear
      
      if (fullName && canAccessFull) {
        destiny = calculateDestiny(fullName)
        soulUrge = calculateSoulUrge(fullName)
        personality = calculatePersonality(fullName)
        personalYear = calculatePersonalYear(birthDate)
      }
      
      setResults({ lifePath, destiny, soulUrge, personality, personalYear })
      setCalculating(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-cyan-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Numerología</h1>
                <p className="text-sm text-gray-400">Descubre el poder de tus números</p>
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
        {/* Input Form */}
        <Card className="bg-mystica-dark-100/50 border-gray-700 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              Calcula tus Números
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Fecha de Nacimiento</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-mystica-dark-200 border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Nombre Completo
                  {!canAccessFull && <span className="text-yellow-500 ml-1">(Premium)</span>}
                </label>
                <Input
                  placeholder="Tu nombre completo..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-mystica-dark-200 border-gray-700"
                  disabled={!canAccessFull}
                />
              </div>
              
              <Button
                onClick={calculate}
                disabled={!birthDate || calculating}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500"
              >
                {calculating ? 'Calculando...' : 'Calcular'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Life Path - Always available */}
            {results.lifePath && (
              <Card className="bg-gradient-to-br from-cyan-900/30 to-teal-900/20 border-cyan-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
                      {results.lifePath.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Camino de Vida</h3>
                      <p className="text-cyan-300">{results.lifePath.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{results.lifePath.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {results.lifePath.traits.map((trait, i) => (
                      <Badge key={i} className="bg-cyan-900/50 text-cyan-200">{trait}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 italic">{results.lifePath.lifePath}</p>
                </CardContent>
              </Card>
            )}

            {/* Premium Results */}
            {canAccessFull && results.destiny && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { result: results.destiny, title: 'Destino', color: 'teal' },
                  { result: results.soulUrge, title: 'Impulso del Alma', color: 'purple' },
                  { result: results.personality, title: 'Personalidad', color: 'pink' },
                  { result: results.personalYear, title: 'Año Personal', color: 'orange' },
                ].filter(r => r.result).map((item) => (
                  <Card key={item.title} className="bg-mystica-dark-100/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-lg font-bold text-white">
                          {item.result!.number}
                        </div>
                        <h4 className="font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400">{item.result!.description.slice(0, 100)}...</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!canAccessFull && (
              <Card className="bg-yellow-900/20 border-yellow-500/30">
                <CardContent className="p-6 text-center">
                  <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white">Desbloquea el análisis completo con Premium</p>
                  <Link href="/premium">
                    <Button className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500">Hazte Premium</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
