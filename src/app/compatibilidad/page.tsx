'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Heart, Sparkles, Shield, Crown, Check, AlertTriangle, 
  Target, Users, MessageCircle, Flame, ChevronRight, User, User2,
  Calendar, MapPin, Star, Volume2, VolumeX, Bookmark, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'
import { zodiacSigns } from '@/data/zodiac'
import { cn } from '@/lib/utils'

// Extended questions for detailed analysis
const questions = [
  {
    id: 'relationship_goal',
    question: 'Que buscas en una relacion?',
    options: ['Amor romantico', 'Amistad profunda', 'Compania estable', 'Aventura y diversion', 'Crecimiento espiritual']
  },
  {
    id: 'communication_style',
    question: 'Como prefieres comunicarte?',
    options: ['Conversaciones profundas', 'Mensajes frecuentes', 'Tiempo de calidad', 'Gestos y acciones', 'Todas las formas']
  },
  {
    id: 'conflict_style',
    question: 'Como manejas los conflictos?',
    options: ['Los confronto directamente', 'Necesito tiempo para procesar', 'Busco compromiso', 'Evito el conflicto', 'Busco mediar']
  },
  {
    id: 'love_language',
    question: 'Cual es tu lenguaje del amor principal?',
    options: ['Palabras de afirmacion', 'Actos de servicio', 'Regalos', 'Tiempo de calidad', 'Contacto fisico']
  },
  {
    id: 'values_priority',
    question: 'Que valoras mas en una pareja?',
    options: ['Lealtad y confianza', 'Ambicion y exito', 'Creatividad y diversion', 'Estabilidad y seguridad', 'Espiritualidad y conexion']
  },
  {
    id: 'lifestyle',
    question: 'Describe tu estilo de vida ideal',
    options: ['Tranquilo y casero', 'Activo y aventurero', 'Social y extrovertido', 'Creativo y artistico', 'Equilibrado y flexible']
  }
]

interface PersonData {
  name: string
  birthDate: string
  birthPlace: string
  zodiac: string
  answers: Record<string, string>
}

interface CompatibilityResult {
  overall: number
  romance: number
  friendship: number
  communication: number
  passion: number
  trust: number
  growth: number
  summary: string
  detailedAnalysis: string
  strengths: string[]
  challenges: string[]
  advice: string
  dailyTips: string[]
  affirmation: string
}

export default function CompatibilityPage() {
  const router = useRouter()
  const { isAdmin, isPremium } = useAuth()
  const canAccessPremium = isAdmin || isPremium

  const [step, setStep] = useState<'person1' | 'questions1' | 'person2' | 'questions2' | 'result'>('person1')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  
  const [person1, setPerson1] = useState<PersonData>({
    name: '', birthDate: '', birthPlace: '', zodiac: '', answers: {}
  })
  const [person2, setPerson2] = useState<PersonData>({
    name: '', birthDate: '', birthPlace: '', zodiac: '', answers: {}
  })
  
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const handleAnswer = (answer: string) => {
    if (step === 'questions1') {
      setPerson1(prev => ({
        ...prev,
        answers: { ...prev.answers, [questions[currentQuestion].id]: answer }
      }))
    } else {
      setPerson2(prev => ({
        ...prev,
        answers: { ...prev.answers, [questions[currentQuestion].id]: answer }
      }))
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setCurrentQuestion(0)
      if (step === 'questions1') {
        setStep('person2')
      } else {
        calculateResult()
      }
    }
  }

  const calculateResult = async () => {
    setIsCalculating(true)
    setStep('result')
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Calculate base compatibility from zodiac
    const elementCompatibility: Record<string, Record<string, number>> = {
      Fuego: { Fuego: 75, Tierra: 50, Aire: 90, Agua: 40 },
      Tierra: { Fuego: 50, Tierra: 80, Aire: 45, Agua: 85 },
      Aire: { Fuego: 90, Tierra: 45, Aire: 70, Agua: 55 },
      Agua: { Fuego: 40, Tierra: 85, Aire: 55, Agua: 75 }
    }

    const signElements: Record<string, string> = {
      Aries: 'Fuego', Leo: 'Fuego', Sagitario: 'Fuego',
      Tauro: 'Tierra', Virgo: 'Tierra', Capricornio: 'Tierra',
      'Geminis': 'Aire', Libra: 'Aire', Acuario: 'Aire',
      Cancer: 'Agua', Escorpio: 'Agua', Piscis: 'Agua'
    }

    const element1 = signElements[person1.zodiac] || 'Fuego'
    const element2 = signElements[person2.zodiac] || 'Fuego'
    const baseScore = elementCompatibility[element1]?.[element2] || 60

    // Adjust based on answers compatibility
    let answerBonus = 0
    if (person1.answers.love_language === person2.answers.love_language) answerBonus += 5
    if (person1.answers.values_priority === person2.answers.values_priority) answerBonus += 8
    if (person1.answers.communication_style === person2.answers.communication_style) answerBonus += 5
    if (person1.answers.lifestyle === person2.answers.lifestyle) answerBonus += 7

    const overall = Math.min(98, baseScore + answerBonus)

    const resultData: CompatibilityResult = {
      overall,
      romance: Math.min(100, overall + Math.floor(Math.random() * 15) - 5),
      friendship: Math.min(100, overall + Math.floor(Math.random() * 10)),
      communication: Math.min(100, overall + (person1.answers.communication_style === person2.answers.communication_style ? 15 : 0)),
      passion: Math.min(100, overall + Math.floor(Math.random() * 20) - 5),
      trust: Math.min(100, overall + (person1.answers.values_priority === 'Lealtad y confianza' || person2.answers.values_priority === 'Lealtad y confianza' ? 10 : 0)),
      growth: Math.min(100, overall + Math.floor(Math.random() * 10) + 5),
      summary: `${person1.name} y ${person2.name}, su compatibilidad del ${overall}% indica ${
        overall >= 80 ? 'una conexion excepcional donde sus energias se complementan perfectamente.' :
        overall >= 65 ? 'una relacion con gran potencial que florecera con comunicacion abierta.' :
        'una relacion que requiere trabajo consciente pero puede ser muy gratificante.'
      }`,
      detailedAnalysis: `El analisis de sus cartas astrales revela que ${person1.name}, como ${person1.zodiac}, trae ${
        element1 === 'Fuego' ? 'pasion, entusiasmo y energia dinamica' :
        element1 === 'Tierra' ? 'estabilidad, lealtad y determinacion practica' :
        element1 === 'Aire' ? 'intelecto, comunicacion y curiosidad intelectual' :
        'emocion profunda, intuicion y sensibilidad emocional'
      }. Por su parte, ${person2.name} como ${person2.zodiac}, aporta ${
        element2 === 'Fuego' ? 'un espiritu aventurero que enciende la chispa de la relacion' :
        element2 === 'Tierra' ? 'una base solida sobre la cual construir un futuro juntos' :
        element2 === 'Aire' ? 'perspectivas frescas y una comunicacion estimulante' :
        'profundidad emocional y comprension intuitiva'
      }. Esta combinacion de energias ${element1 === element2 ? 'similares crea una comprension natural' : 'complementarias genera equilibrio y crecimiento mutuo'}.`,
      strengths: [
        `${person1.answers.values_priority || 'Valores compartidos'} como base de su conexion`,
        `Compatibilidad en estilos de comunicacion: ${person1.answers.communication_style || 'equilibrada'}`,
        `${person1.name} y ${person2.name} comparten ${person1.answers.lifestyle === person2.answers.lifestyle ? 'el mismo estilo de vida' : 'visiones de vida complementarias'}`,
        `Ambos buscan ${person1.answers.relationship_goal || 'crecimiento juntos'}`
      ],
      challenges: [
        `${person1.answers.conflict_style !== person2.answers.conflict_style ? 'Diferentes formas de manejar conflictos requieren paciencia' : 'Manejo de conflictos similar, pero eviten la rutina'}`,
        `${element1 !== element2 ? `Las energias ${element1} y ${element2} necesitan equilibrio consciente` : 'Puede haber demasiada similitud, busquen complementariedad'}`,
        'Aprender a respetar los tiempos personales de cada uno'
      ],
      advice: `Para ${person1.name} y ${person2.name}: Cultiven la paciencia y la comunicacion abierta. ${
        person1.answers.love_language !== person2.answers.love_language 
          ? `Recuerden que sus lenguajes del amor son diferentes: ${person1.name} prefiere ${person1.answers.love_language} mientras ${person2.name} valora ${person2.answers.love_language}. Aprendan a expresar amor de ambas formas.`
          : 'Comparten el mismo lenguaje del amor, lo que facilita la conexion emocional.'
      }`,
      dailyTips: [
        'Dediquen 10 minutos al dia para conversar sin distracciones',
        'Practiquen la gratitud expresando algo que valoren del otro',
        'Creen un ritual semanal de conexion, como una cena especial',
        'Celebren los pequenos logros del otro con entusiasmo'
      ],
      affirmation: `"${person1.name} y ${person2.name}, su union esta bendecida por las estrellas. Juntos tienen el poder de crear un amor que trasciende."`
    }

    setResult(resultData)
    setIsCalculating(false)
  }

  const speak = () => {
    if (!result) return
    
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const text = `
      Analisis de compatibilidad entre ${person1.name} y ${person2.name}.
      Compatibilidad general: ${result.overall} por ciento.
      ${result.summary}
      ${result.detailedAnalysis}
      Consejo: ${result.advice}
      ${result.affirmation}
    `

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.85
    utterance.pitch = 0.95
    
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const progress = step === 'questions1' || step === 'questions2' 
    ? ((currentQuestion + 1) / questions.length) * 100 
    : step === 'result' ? 100 : 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-pink-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                  Compatibilidad Zodiacal
                </h1>
                <p className="text-xs text-gray-400">Analisis profesional con IA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
          {/* Progress bar */}
          {step !== 'person1' && (
            <div className="mt-4">
              <Progress value={progress} className="h-1 bg-gray-700" />
              <p className="text-xs text-gray-500 mt-1 text-center">
                {step === 'person1' && 'Datos de la primera persona'}
                {step === 'questions1' && `Pregunta ${currentQuestion + 1} de ${questions.length} - ${person1.name}`}
                {step === 'person2' && 'Datos de la segunda persona'}
                {step === 'questions2' && `Pregunta ${currentQuestion + 1} de ${questions.length} - ${person2.name}`}
                {step === 'result' && 'Analisis completo'}
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* PERSON 1 DATA */}
          {step === 'person1' && (
            <motion.div key="person1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card className="bg-mystica-dark-100/50 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-pink-400">
                    <User className="w-5 h-5" />
                    Primera Persona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                    <Input 
                      value={person1.name}
                      onChange={(e) => setPerson1(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tu nombre"
                      className="bg-mystica-dark-200 border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Fecha de nacimiento</label>
                    <Input 
                      type="date"
                      value={person1.birthDate}
                      onChange={(e) => setPerson1(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="bg-mystica-dark-200 border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Lugar de nacimiento</label>
                    <Input 
                      value={person1.birthPlace}
                      onChange={(e) => setPerson1(prev => ({ ...prev, birthPlace: e.target.value }))}
                      placeholder="Ciudad, Pais"
                      className="bg-mystica-dark-200 border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Signo zodiacal</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.name}
                          onClick={() => setPerson1(prev => ({ ...prev, zodiac: sign.name }))}
                          className={cn(
                            "p-2 rounded-lg text-center transition-all",
                            person1.zodiac === sign.name
                              ? "bg-gradient-to-br from-pink-500 to-rose-600 scale-105"
                              : "bg-white/5 hover:bg-white/10"
                          )}
                        >
                          <span className="text-lg">{sign.symbol}</span>
                          <span className="text-[10px] text-gray-400 block">{sign.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={() => setStep('questions1')}
                    disabled={!person1.name || !person1.zodiac}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600"
                  >
                    Continuar <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* QUESTIONS FOR PERSON 1 */}
          {step === 'questions1' && (
            <motion.div key="questions1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-mystica-dark-100/50 border-pink-500/30">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <User className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                    <p className="text-white font-medium">{person1.name}</p>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-6">
                    {questions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        onClick={() => handleAnswer(option)}
                        className="w-full justify-start border-gray-700 hover:border-pink-500 hover:bg-pink-500/10"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* PERSON 2 DATA */}
          {step === 'person2' && (
            <motion.div key="person2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card className="bg-mystica-dark-100/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <User2 className="w-5 h-5" />
                    Segunda Persona
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Nombre</label>
                    <Input 
                      value={person2.name}
                      onChange={(e) => setPerson2(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nombre de tu pareja/amigo/a"
                      className="bg-mystica-dark-200 border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Fecha de nacimiento</label>
                    <Input 
                      type="date"
                      value={person2.birthDate}
                      onChange={(e) => setPerson2(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="bg-mystica-dark-200 border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Signo zodiacal</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.name}
                          onClick={() => setPerson2(prev => ({ ...prev, zodiac: sign.name }))}
                          className={cn(
                            "p-2 rounded-lg text-center transition-all",
                            person2.zodiac === sign.name
                              ? "bg-gradient-to-br from-purple-500 to-indigo-600 scale-105"
                              : "bg-white/5 hover:bg-white/10"
                          )}
                        >
                          <span className="text-lg">{sign.symbol}</span>
                          <span className="text-[10px] text-gray-400 block">{sign.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    onClick={() => setStep('questions2')}
                    disabled={!person2.name || !person2.zodiac}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
                  >
                    Continuar <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* QUESTIONS FOR PERSON 2 */}
          {step === 'questions2' && (
            <motion.div key="questions2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="bg-mystica-dark-100/50 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <User2 className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium">{person2.name}</p>
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-6">
                    {questions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        onClick={() => handleAnswer(option)}
                        className="w-full justify-start border-gray-700 hover:border-purple-500 hover:bg-purple-500/10"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* RESULT */}
          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {isCalculating ? (
                <Card className="bg-mystica-dark-100/50 border-pink-500/30">
                  <CardContent className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">Analizando compatibilidad...</h3>
                    <p className="text-gray-400">Consultando las estrellas y planetas</p>
                    <p className="text-pink-400 text-sm mt-2">{person1.name} & {person2.name}</p>
                  </CardContent>
                </Card>
              ) : result && (
                <div className="space-y-6">
                  {/* Main Score */}
                  <Card className="bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-mystica-dark-200 border-pink-500/30 overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-2">
                            <span className="text-3xl">{zodiacSigns.find(s => s.name === person1.zodiac)?.symbol}</span>
                          </div>
                          <p className="text-white font-medium">{person1.name}</p>
                          <p className="text-xs text-gray-400">{person1.zodiac}</p>
                        </div>
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl"
                        >
                          💕
                        </motion.div>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                            <span className="text-3xl">{zodiacSigns.find(s => s.name === person2.zodiac)?.symbol}</span>
                          </div>
                          <p className="text-white font-medium">{person2.name}</p>
                          <p className="text-xs text-gray-400">{person2.zodiac}</p>
                        </div>
                      </div>
                      
                      <div className={cn("text-7xl font-bold mb-2", getScoreColor(result.overall))}>
                        {result.overall}%
                      </div>
                      <p className="text-xl text-gray-300">Compatibilidad General</p>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={speak}
                      className="border-pink-500/50 text-pink-300"
                    >
                      {speaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                      {speaking ? 'Detener' : 'Escuchar'}
                    </Button>
                  </div>

                  {/* Detailed Scores */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { label: 'Romance', value: result.romance, icon: Heart },
                      { label: 'Amistad', value: result.friendship, icon: Users },
                      { label: 'Comunicacion', value: result.communication, icon: MessageCircle },
                      { label: 'Pasion', value: result.passion, icon: Flame },
                      { label: 'Confianza', value: result.trust, icon: Shield },
                      { label: 'Crecimiento', value: result.growth, icon: Star },
                    ].map((item) => (
                      <Card key={item.label} className="bg-mystica-dark-100/50 border-gray-700">
                        <CardContent className="p-3 text-center">
                          <item.icon className="w-5 h-5 mx-auto mb-1 text-pink-400" />
                          <p className={cn("text-xl font-bold", getScoreColor(item.value))}>{item.value}%</p>
                          <p className="text-xs text-gray-400">{item.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Summary */}
                  <Card className="bg-mystica-dark-100/50 border-pink-500/30">
                    <CardContent className="p-6">
                      <p className="text-gray-200 text-lg leading-relaxed">{result.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Detailed Analysis */}
                  <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Analisis Detallado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-200 leading-relaxed">{result.detailedAnalysis}</p>
                    </CardContent>
                  </Card>

                  {/* Strengths & Challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-green-900/20 border-green-500/30">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center gap-2 text-lg">
                          <Check className="w-5 h-5" />
                          Fortalezas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                              <Sparkles className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-900/20 border-orange-500/30">
                      <CardHeader>
                        <CardTitle className="text-orange-400 flex items-center gap-2 text-lg">
                          <AlertTriangle className="w-5 h-5" />
                          Desafios
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.challenges.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                              <Target className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advice */}
                  <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/10 border-yellow-500/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Consejo Personalizado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-200 leading-relaxed">{result.advice}</p>
                    </CardContent>
                  </Card>

                  {/* Daily Tips */}
                  <Card className="bg-mystica-dark-100/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Consejos Diarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.dailyTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300">
                            <span className="text-pink-400">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Affirmation */}
                  <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30">
                    <CardContent className="p-6 text-center">
                      <Heart className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                      <p className="text-lg text-pink-200 italic">{result.affirmation}</p>
                    </CardContent>
                  </Card>

                  {/* New Analysis Button */}
                  <Button
                    onClick={() => {
                      setStep('person1')
                      setPerson1({ name: '', birthDate: '', birthPlace: '', zodiac: '', answers: {} })
                      setPerson2({ name: '', birthDate: '', birthPlace: '', zodiac: '', answers: {} })
                      setResult(null)
                      setCurrentQuestion(0)
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Nuevo Analisis
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
