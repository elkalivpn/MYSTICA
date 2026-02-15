'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Volume2, VolumeX, Bookmark, Share2, 
  Sparkles, MessageCircle, Lightbulb, Heart,
  Download, Copy, Check, ChevronDown, ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface TarotCardData {
  id: number
  name: string
  numeral: string
  keywords: string[]
  upright: string
  reversed: string
  isReversed: boolean
}

export interface TarotInterpretation {
  cardAnalysis: Array<{
    cardName: string
    meaning: string
    context: string
  }>
  connections: string
  mainMessage: string
  practicalAdvice: string
  finalReflection: string
}

interface TarotReadingResultProps {
  cards: TarotCardData[]
  interpretation: TarotInterpretation | null
  userQuestion: string | null
  isLoading: boolean
  onSave?: () => void
  onNewReading?: () => void
}

// Mapping of card names to image files
const cardImageMap: Record<string, string> = {
  'El Loco': '/tarot-cards/00-fool.png',
  'El Mago': '/tarot-cards/01-magician.png',
  'La Sacerdotisa': '/tarot-cards/02-high-priestess.png',
  'La Emperatriz': '/tarot-cards/03-empress.png',
  'El Emperador': '/tarot-cards/04-emperor.png',
  'El Sumo Sacerdote': '/tarot-cards/05-hierophant.png',
  'Los Enamorados': '/tarot-cards/06-lovers.png',
  'El Carro': '/tarot-cards/07-chariot.png',
  'La Justicia': '/tarot-cards/08-justice.png',
  'El Ermitaño': '/tarot-cards/09-hermit.png',
  'La Rueda de la Fortuna': '/tarot-cards/10-wheel.png',
  'La Fuerza': '/tarot-cards/11-strength.png',
  'El Colgado': '/tarot-cards/12-hanged-man.png',
  'La Muerte': '/tarot-cards/13-death.png',
  'La Templanza': '/tarot-cards/14-temperance.png',
  'El Diablo': '/tarot-cards/15-devil.png',
  'La Torre': '/tarot-cards/16-tower.png',
  'La Estrella': '/tarot-cards/17-star.png',
  'La Luna': '/tarot-cards/18-moon.png',
  'El Sol': '/tarot-cards/19-sun.png',
  'El Juicio': '/tarot-cards/20-judgment.png',
  'El Mundo': '/tarot-cards/21-world.png',
}

export function TarotReadingResult({
  cards,
  interpretation,
  userQuestion,
  isLoading,
  onSave,
  onNewReading
}: TarotReadingResultProps) {
  const [speaking, setSpeaking] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cards: true,
    connections: true,
    message: true,
    advice: true,
    reflection: true
  })

  const getCardImage = (cardName: string) => {
    return cardImageMap[cardName] || '/tarot-cards/00-fool.png'
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const speak = () => {
    if (!interpretation) return
    
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel()
        setSpeaking(false)
        return
      }

      const text = `
        ${userQuestion ? `Tu pregunta fue: ${userQuestion}. ` : ''}
        Las cartas seleccionadas son: ${cards.map(c => c.name).join(', ')}.
        
        ${interpretation.mainMessage}
        
        ${interpretation.connections}
        
        ${interpretation.practicalAdvice}
        
        ${interpretation.finalReflection}
      `

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.rate = 0.85
      utterance.pitch = 0.9
      
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSave = () => {
    if (!interpretation) return
    
    const reading = {
      date: new Date().toISOString(),
      question: userQuestion,
      cards: cards,
      interpretation: interpretation
    }
    
    const savedReadings = JSON.parse(localStorage.getItem('tarot-readings') || '[]')
    savedReadings.unshift(reading)
    // Keep only the last 50 readings
    localStorage.setItem('tarot-readings', JSON.stringify(savedReadings.slice(0, 50)))
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSave?.()
  }

  const handleCopy = async () => {
    if (!interpretation) return
    
    const text = `
LECTURA DE TAROT
${userQuestion ? `Pregunta: ${userQuestion}` : 'Lectura General'}
Fecha: ${new Date().toLocaleDateString('es-ES')}

CARTAS: ${cards.map(c => `${c.name} (${c.isReversed ? 'Invertida' : 'Derecha'})`).join(' | ')}

${interpretation.mainMessage}

${interpretation.connections}

${interpretation.practicalAdvice}

${interpretation.finalReflection}
    `.trim()
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!interpretation) return
    
    const shareText = `Mi lectura de Tarot de hoy:
${cards.map(c => c.name).join(' - ')}
"${interpretation.finalReflection}"`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Lectura de Tarot',
          text: shareText,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopy()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Selected Question */}
      {userQuestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-mystica-purple-900/30 border border-mystica-gold-500/20"
        >
          <p className="text-mystica-purple-200 text-sm mb-1">Tu pregunta:</p>
          <p className="text-white italic font-medium">"{userQuestion}"</p>
        </motion.div>
      )}

      {/* Cards Display - Large */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="relative"
          >
            <div 
              className={cn(
                "relative aspect-[2/3] rounded-lg overflow-hidden border-2 shadow-xl transition-all duration-300",
                card.isReversed 
                  ? "border-red-500/50 shadow-red-500/20" 
                  : "border-mystica-gold-500/50 shadow-mystica-gold-500/20"
              )}
            >
              <Image
                src={getCardImage(card.name)}
                alt={card.name}
                fill
                className={cn(
                  "object-cover",
                  card.isReversed && "rotate-180"
                )}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/tarot-cards/00-fool.png'
                }}
              />
              
              {/* Card number overlay */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm">
                <span className="text-mystica-gold-400 font-mystica font-bold text-sm">
                  {card.numeral}
                </span>
              </div>
              
              {/* Reversed indicator */}
              {card.isReversed && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-red-900/80 backdrop-blur-sm">
                  <span className="text-red-300 text-xs font-medium">Invertida</span>
                </div>
              )}
            </div>
            
            {/* Card name below */}
            <p className="text-center mt-2 text-white font-medium text-sm truncate">
              {card.name}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-mystica-gold-400" />
          </motion.div>
          <p className="text-mystica-purple-200">Hecate esta interpretando las cartas...</p>
          <p className="text-mystica-purple-300 text-sm mt-2">Conectando con la sabiduria ancestral</p>
        </motion.div>
      )}

      {/* Interpretation Sections */}
      {interpretation && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={speak}
              className="border-mystica-purple-600/50 text-mystica-purple-200 hover:bg-mystica-purple-900/30"
            >
              {speaking ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Detener
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Escuchar
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className={cn(
                "border-mystica-purple-600/50 hover:bg-mystica-purple-900/30",
                saved ? "text-green-400" : "text-mystica-purple-200"
              )}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Guardada
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Guardar
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "border-mystica-purple-600/50 hover:bg-mystica-purple-900/30",
                copied ? "text-green-400" : "text-mystica-purple-200"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-mystica-purple-600/50 text-mystica-purple-200 hover:bg-mystica-purple-900/30"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Card Analysis Section */}
          <InterpretationSection
            title="Analisis de las Cartas"
            icon={<Sparkles className="w-5 h-5" />}
            isExpanded={expandedSections.cards}
            onToggle={() => toggleSection('cards')}
          >
            <div className="space-y-4">
              {interpretation.cardAnalysis.map((analysis, index) => {
                const card = cards[index]
                return (
                  <Card key={index} className="bg-mystica-dark-100/50 border-mystica-purple-700/30">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-mystica-gold-500/30">
                          <Image
                            src={getCardImage(analysis.cardName)}
                            alt={analysis.cardName}
                            fill
                            className={cn("object-cover", card?.isReversed && "rotate-180")}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/tarot-cards/00-fool.png'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-mystica-gold-400 font-mystica font-bold">
                              {card?.numeral}
                            </span>
                            <h4 className="text-white font-bold">{analysis.cardName}</h4>
                            {card?.isReversed && (
                              <span className="text-xs px-2 py-0.5 rounded bg-red-900/50 text-red-300">
                                Invertida
                              </span>
                            )}
                          </div>
                          {card && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {card.keywords.slice(0, 3).map((keyword, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-mystica-purple-800/60 text-mystica-purple-100"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {analysis.context || analysis.meaning}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </InterpretationSection>

          {/* Connections Section */}
          {interpretation.connections && (
            <InterpretationSection
              title="Conexiones entre Cartas"
              icon={<MessageCircle className="w-5 h-5" />}
              isExpanded={expandedSections.connections}
              onToggle={() => toggleSection('connections')}
            >
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                {interpretation.connections}
              </p>
            </InterpretationSection>
          )}

          {/* Main Message Section */}
          {interpretation.mainMessage && (
            <InterpretationSection
              title="Mensaje Principal"
              icon={<Sparkles className="w-5 h-5" />}
              isExpanded={expandedSections.message}
              onToggle={() => toggleSection('message')}
              highlight
            >
              <p className="text-gray-100 leading-relaxed whitespace-pre-line text-lg">
                {interpretation.mainMessage}
              </p>
            </InterpretationSection>
          )}

          {/* Practical Advice Section */}
          {interpretation.practicalAdvice && (
            <InterpretationSection
              title="Consejo Practico"
              icon={<Lightbulb className="w-5 h-5" />}
              isExpanded={expandedSections.advice}
              onToggle={() => toggleSection('advice')}
            >
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                {interpretation.practicalAdvice}
              </p>
            </InterpretationSection>
          )}

          {/* Final Reflection Section */}
          {interpretation.finalReflection && (
            <InterpretationSection
              title="Reflexion Final"
              icon={<Heart className="w-5 h-5" />}
              isExpanded={expandedSections.reflection}
              onToggle={() => toggleSection('reflection')}
              highlight
            >
              <p className="text-mystica-gold-200 leading-relaxed whitespace-pre-line italic text-lg">
                {interpretation.finalReflection}
              </p>
            </InterpretationSection>
          )}

          {/* New Reading Button */}
          {onNewReading && (
            <div className="text-center pt-4">
              <Button
                onClick={onNewReading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Nueva Lectura
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// Sub-component for collapsible sections
interface InterpretationSectionProps {
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  highlight?: boolean
  children: React.ReactNode
}

function InterpretationSection({
  title,
  icon,
  isExpanded,
  onToggle,
  highlight,
  children
}: InterpretationSectionProps) {
  return (
    <Card className={cn(
      "border transition-all duration-300",
      highlight 
        ? "bg-mystica-purple-900/20 border-mystica-gold-500/30" 
        : "bg-mystica-dark-100/50 border-mystica-purple-700/30"
    )}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-mystica-purple-900/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-mystica-gold-400">{icon}</span>
          <h3 className="text-white font-bold font-mystica">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-mystica-purple-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-mystica-purple-300" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-4 px-4">
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
