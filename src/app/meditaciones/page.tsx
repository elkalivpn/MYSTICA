'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Crown, Shield, Headphones, Play, Pause, SkipBack, SkipForward, 
  Music, Timer, Sparkles, Moon, Waves, Wind, Heart, Brain, Leaf, Flame, 
  Search, Star, Clock, TrendingUp, Award, ChevronRight, X, Bookmark, 
  BookmarkCheck, BarChart3, Calendar, Bell, BellOff, Settings, Volume2,
  VolumeX, RotateCcw, Check, Plus, Trash2, Trophy, Share2, Target, Zap,
  BookOpen, Compass
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { useAppSound } from '@/hooks/useSettings'
import { useConfetti } from '@/hooks/useConfetti'
import { useMeditationProgress } from '@/hooks/useMeditationProgress'
import { useReminders, meditationAchievements, MeditationAchievement } from '@/hooks/useReminders'
import { ReminderPanel } from '@/components/ReminderPanel'
import { useChallenges } from '@/hooks/useChallenges'
import { useLevelSystem } from '@/hooks/useLevelSystem'
import { ShareProgressCard } from '@/components/ShareProgressCard'
import { MeditationHeatmap } from '@/components/MeditationHeatmap'
import { MeditationCharts } from '@/components/MeditationCharts'
import { MeditationStats } from '@/components/MeditationStats'
import { 
  meditations, 
  unguidedMeditations, 
  meditationCategories,
  meditationPrograms,
  Meditation,
  UnguidedMeditation,
  MeditationCategory,
  MeditationProgram,
  getFeaturedMeditations
} from '@/data/meditations'
import { cn } from '@/lib/utils'
import { NPC3DGuide, NPCGuide } from '@/components/NPC3DGuide'
import { toast } from 'sonner'

const bodhisattvaGuide: NPCGuide = {
  id: 'bodhisattva',
  name: 'Bodhisattva',
  title: 'Guía Espiritual',
  culture: 'Universal',
  domain: 'Meditación',
  image: '/guides/buddha-3d.png',
  color: '#818cf8',
  gradient: 'from-indigo-500 to-purple-500'
}

const dialogues = [
  "Bienvenido al templo de la paz interior. Aquí encontrarás meditaciones guiadas y sonidos sanadores para cada momento de tu día...",
  "La mente es como un lago. Cuando está agitado, no puedes ver el fondo. La meditación calma las aguas...",
  "En el silencio, escuchamos las respuestas que el ruido del mundo nos impide oír...",
  "La paz que buscas en el exterior, reside en tu interior. Permíteme guiarte..."
]

const audioTypeIcons: Record<string, React.ReactNode> = {
  cuencos: <Sparkles className="w-4 h-4" />,
  frecuencias: <Waves className="w-4 h-4" />,
  naturaleza: <Leaf className="w-4 h-4" />,
  mantras: <Brain className="w-4 h-4" />,
  ambiental: <Music className="w-4 h-4" />,
  binaural: <Headphones className="w-4 h-4" />
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function MeditationsPage() {
  const { isAdmin, isPremium } = useAuth()
  const canAccessFull = isAdmin || isPremium
  const { play } = useAppSound()
  const { bigCelebration } = useConfetti()
  const progress = useMeditationProgress()
  const reminders = useReminders()
  const challenges = useChallenges()
  const levelSystem = useLevelSystem()
  
  // Initialize weekly challenges
  useEffect(() => {
    challenges.initializeWeek()
  }, [])
  
  const [showShareCard, setShowShareCard] = useState(false)
  
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null)
  const [selectedUnguided, setSelectedUnguided] = useState<UnguidedMeditation | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [activeTab, setActiveTab] = useState<'guiadas' | 'sin-guiar' | 'programas' | 'progreso' | 'estadisticas' | 'recordatorios' | 'logros'>('guiadas')
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategory | 'all'>('all')
  const [selectedAudioType, setSelectedAudioType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number>(0)
  
  // Timer state
  const [showTimer, setShowTimer] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(10)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timerRemaining, setTimerRemaining] = useState(0)
  
  // Reminder dialog
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [newReminderTime, setNewReminderTime] = useState('08:00')
  const [newReminderDays, setNewReminderDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [newReminderMessage, setNewReminderMessage] = useState('Es hora de tu práctica diaria de meditación 🧘')

  const freeMeditations = meditations.slice(0, 5)
  const visibleMeditations = canAccessFull ? meditations : freeMeditations
  
  const freeUnguided = unguidedMeditations.slice(0, 8)
  const visibleUnguided = canAccessFull ? unguidedMeditations : freeUnguided

  // Get meditation of the day based on date
  const getMeditationOfTheDay = useMemo(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const featuredMeditations = getFeaturedMeditations()
    if (featuredMeditations.length > 0) {
      return featuredMeditations[dayOfYear % featuredMeditations.length]
    }
    return meditations[dayOfYear % meditations.length]
  }, [])

  // Get recommended meditations based on time of day
  const getRecommendedMeditations = useMemo(() => {
    const hour = new Date().getHours()
    let categories: string[] = []
    
    if (hour >= 5 && hour < 12) {
      // Morning: energy, concentration, chakras
      categories = ['energia', 'concentracion', 'chakras', 'gratitud']
    } else if (hour >= 12 && hour < 18) {
      // Afternoon: relaxation, focus, abundance
      categories = ['relajacion', 'concentracion', 'abundancia']
    } else if (hour >= 18 && hour < 22) {
      // Evening: spiritual, healing, autocompasion
      categories = ['espiritual', 'sanacion', 'autocompasion', 'perdon']
    } else {
      // Night: sleep, relaxation
      categories = ['dormir', 'relajacion', 'ansiedad']
    }
    
    return meditations.filter(m => categories.includes(m.category)).slice(0, 4)
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false)
            play('success')
            bigCelebration()
            toast.success('⏰ ¡Tiempo completado!')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, timerRemaining, play, bigCelebration])

  // Check achievements after session
  const checkAchievements = useCallback(() => {
    const uniqueMeditations = new Set(progress.sessions.map(s => s.meditationId)).size
    const newAchievements = reminders.checkAndUnlockAchievements({
      totalSessions: progress.stats.totalSessions,
      totalMinutes: progress.stats.totalMinutes,
      currentStreak: progress.stats.currentStreak,
      uniqueMeditations
    })
    
    if (newAchievements.length > 0) {
      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          bigCelebration()
          toast.success(`🏆 ¡Logro desbloqueado: ${achievement.name}!`, {
            duration: 5000
          })
        }, index * 1000)
      })
    }
  }, [progress.stats, progress.sessions, reminders, bigCelebration])

  // Filter meditations by search
  const filteredMeditations = useMemo(() => {
    let result = selectedCategory === 'all' 
      ? visibleMeditations 
      : visibleMeditations.filter(m => m.category === selectedCategory)
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [selectedCategory, searchQuery, visibleMeditations])

  const filteredUnguided = useMemo(() => {
    let result = selectedAudioType === 'all'
      ? visibleUnguided
      : visibleUnguided.filter(m => m.audioType === selectedAudioType)
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      )
    }
    
    return result
  }, [selectedAudioType, searchQuery, visibleUnguided])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      play('meditation')
    }
  }

  const nextStep = () => {
    if (selectedMeditation && currentStep < selectedMeditation.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      play('magic-chime')
      if (currentStep + 1 === selectedMeditation.steps.length - 1) {
        play('success')
        bigCelebration()
        completeMeditation()
        toast.success('🧘 ¡Meditación completada!')
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      play('click')
    }
  }

  const completeMeditation = () => {
    if (selectedMeditation) {
      progress.addSession({
        meditationId: selectedMeditation.id,
        meditationName: selectedMeditation.name,
        meditationType: 'guided',
        category: selectedMeditation.category,
        duration: selectedMeditation.duration,
        completed: true,
        stepsCompleted: selectedMeditation.steps.length,
        totalSteps: selectedMeditation.steps.length
      })
      
      // Update challenges
      challenges.updateProgress('session_complete', 1)
      challenges.updateProgress('minutes_added', selectedMeditation.duration)
      challenges.updateProgress('unique_meditation', 1)
      challenges.updateProgress('category_complete', 1, { category: selectedMeditation.category })
      
      // Check time-based challenges
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 9) {
        challenges.updateProgress('morning_meditation', 1)
      }
      if (hour >= 20 || hour < 6) {
        challenges.updateProgress('night_meditation', 1)
      }
      
    } else if (selectedUnguided) {
      progress.addSession({
        meditationId: selectedUnguided.id,
        meditationName: selectedUnguided.name,
        meditationType: 'unguided',
        category: selectedUnguided.category,
        duration: selectedUnguided.duration,
        completed: true
      })
      
      // Update challenges
      challenges.updateProgress('session_complete', 1)
      challenges.updateProgress('minutes_added', selectedUnguided.duration)
      challenges.updateProgress('unique_meditation', 1)
      challenges.updateProgress('audio_type_complete', 1, { audioType: selectedUnguided.audioType })
    }
    setTimeout(checkAchievements, 500)
    
    // Add XP and check for level up
    const xpEarned = selectedMeditation ? selectedMeditation.duration : (selectedUnguided?.duration || 5)
    const { leveledUp, newLevel } = levelSystem.addXP(xpEarned)
    
    if (leveledUp && newLevel) {
      setTimeout(() => {
        bigCelebration()
        toast.success(`🎉 ¡Subiste al Nivel ${newLevel.level}!\n${newLevel.icon} ${newLevel.title}`, {
          duration: 5000
        })
      }, 1000)
    }
  }

  const startMeditation = (meditation: Meditation) => {
    if (!canAccessFull && !freeMeditations.find(m => m.id === meditation.id)) {
      toast.error('🔒 Esta meditación requiere Premium')
      return
    }
    setSelectedMeditation(meditation)
    setSelectedUnguided(null)
    setCurrentStep(0)
    setIsPlaying(false)
    setSessionStartTime(Date.now())
    setCurrentDialogue(prev => (prev + 1) % dialogues.length)
    play('mystical-bell')
  }

  const startUnguided = (meditation: UnguidedMeditation) => {
    if (!canAccessFull && !freeUnguided.find(m => m.id === meditation.id)) {
      toast.error('🔒 Esta meditación requiere Premium')
      return
    }
    setSelectedUnguided(meditation)
    setSelectedMeditation(null)
    setIsPlaying(true)
    setSessionStartTime(Date.now())
    play('mystical-bell')
  }

  const toggleFavorite = (meditationId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    progress.toggleFavorite(meditationId)
    const isFav = progress.isFavorite(meditationId)
    play('magic-chime')
    toast.success(isFav ? '💔 Quitado de favoritos' : '❤️ Añadido a favoritos')
  }

  const startTimer = () => {
    const totalSeconds = timerMinutes * 60 + timerSeconds
    setTimerRemaining(totalSeconds)
    setTimerActive(true)
    setShowTimer(true)
    play('mystical-bell')
  }

  const stopTimer = () => {
    setTimerActive(false)
    setTimerRemaining(0)
    setShowTimer(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const addReminder = () => {
    reminders.addReminder({
      time: newReminderTime,
      days: newReminderDays,
      enabled: true,
      message: newReminderMessage
    })
    setShowReminderDialog(false)
    play('success')
    toast.success('🔔 Recordatorio creado')
  }

  const toggleDay = (day: number) => {
    setNewReminderDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  const goBack = () => {
    if (isPlaying && (selectedMeditation || selectedUnguided)) {
      const elapsedMinutes = Math.round((Date.now() - sessionStartTime) / 60000)
      if (elapsedMinutes > 0 && selectedMeditation) {
        progress.addSession({
          meditationId: selectedMeditation.id,
          meditationName: selectedMeditation.name,
          meditationType: 'guided',
          category: selectedMeditation.category,
          duration: elapsedMinutes,
          completed: false,
          stepsCompleted: currentStep + 1,
          totalSteps: selectedMeditation.steps.length
        })
        toast.info('📊 Progreso guardado')
      }
    }
    
    setSelectedMeditation(null)
    setSelectedUnguided(null)
    setIsPlaying(false)
    setCurrentStep(0)
  }

  // Stats display component
  const StatsOverview = () => {
    const currentLevel = levelSystem.getLevel()
    const levelProgress = levelSystem.getLevelProgress()
    
    return (
      <>
        {/* Level Card */}
        <Card className={cn("bg-gradient-to-r border-2 mb-6", currentLevel.gradient, "border-current/30")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="text-6xl">{currentLevel.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold text-white">{currentLevel.title}</h3>
                  <Badge className="bg-white/20 text-white">Nivel {currentLevel.level}</Badge>
                </div>
                <p className="text-white/80 text-sm mb-3">{currentLevel.name}</p>
                
                {/* XP Progress */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>{levelProgress.currentXP} XP</span>
                    <span>{levelProgress.xpToNextLevel} XP para siguiente nivel</span>
                  </div>
                  <Progress value={levelProgress.progress} className="h-2 bg-white/20" />
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <p className="text-white/60 text-xs">
                    Total: <span className="text-white font-semibold">{levelSystem.totalXP} XP</span>
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => setShowShareCard(!showShareCard)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Share Card */}
        {showShareCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <ShareProgressCard onClose={() => setShowShareCard(false)} />
          </motion.div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border-indigo-500/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
              <p className="text-2xl font-bold text-white">{progress.stats.totalMinutes}</p>
              <p className="text-xs text-gray-400">Minutos totales</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-900/40 to-teal-900/20 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Headphones className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-2xl font-bold text-white">{progress.stats.completedSessions}</p>
              <p className="text-xs text-gray-400">Sesiones completadas</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/20 border-orange-500/30">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <p className="text-2xl font-bold text-white">{progress.stats.currentStreak}</p>
              <p className="text-xs text-gray-400">Racha actual</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-900/40 to-amber-900/20 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-2xl font-bold text-white">{reminders.unlockedAchievements.length}</p>
              <p className="text-xs text-gray-400">Logros</p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Weekly Challenges component
  const WeeklyChallenges = () => {
    const weeklyProgress = challenges.getWeeklyProgress()
    const activeChallenges = challenges.getActiveChallenges()
    
    return (
      <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border-emerald-500/30 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-orange-400" />
              Retos Semanales
            </CardTitle>
            <Badge className="bg-emerald-500/20 text-emerald-400">
              {weeklyProgress.completed}/{weeklyProgress.total} completados
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="mb-4">
            <Progress value={weeklyProgress.percentage} className="h-2" />
            <p className="text-xs text-gray-400 mt-1 text-right">{weeklyProgress.percentage}% completado</p>
          </div>
          
          {/* Challenges list */}
          <div className="space-y-3">
            {challenges.challenges.map((challenge) => (
              <div 
                key={challenge.id}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  challenge.completed 
                    ? "bg-green-900/20 border-green-500/30" 
                    : "bg-mystica-dark-200/50 border-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                    challenge.completed ? "bg-green-500/20" : "bg-gray-800"
                  )}>
                    {challenge.completed ? '✅' : challenge.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{challenge.title}</h4>
                    <p className="text-xs text-gray-400">{challenge.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-1 flex-1"
                      />
                      <span className="text-xs text-gray-400">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-400 font-semibold">+{challenge.reward.xp} XP</p>
                    {challenge.reward.badge && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] mt-1">
                        Badge
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* XP earned this week */}
          <div className="mt-4 pt-4 border-t border-emerald-500/20 text-center">
            <p className="text-sm text-gray-400">XP ganado esta semana</p>
            <p className="text-2xl font-bold text-emerald-400">{challenges.weeklyXP}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Achievements component
  const AchievementsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meditationAchievements.map((achievement) => {
        const isUnlocked = reminders.isAchievementUnlocked(achievement.id)
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={isUnlocked ? { scale: 1.02 } : {}}
          >
            <Card className={cn(
              "transition-all",
              isUnlocked 
                ? "bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border-yellow-500/40" 
                : "bg-mystica-dark-100/50 border-gray-700 opacity-60"
            )}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                  isUnlocked ? "bg-yellow-500/20" : "bg-gray-800"
                )}>
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "font-bold",
                    isUnlocked ? "text-yellow-400" : "text-gray-500"
                  )}>
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                {isUnlocked && <Check className="w-5 h-5 text-green-400" />}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-indigo-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Meditaciones</h1>
                <p className="text-sm text-gray-400">{meditations.length} guiadas • {unguidedMeditations.length} sonidos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Timer Button */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowTimer(!showTimer)}
                className="text-gray-400 hover:text-white"
                title="Temporizador"
              >
                <Timer className="h-5 w-5" />
              </Button>
              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-400 hover:text-white"
              >
                {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
              {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
              {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
            </div>
          </div>
          
          {/* Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar meditaciones por nombre, categoría o beneficio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-mystica-dark-100 border-gray-700 focus:border-indigo-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Timer Panel */}
          <AnimatePresence>
            {showTimer && !timerActive && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-mystica-dark-100 rounded-lg border border-indigo-500/30">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={120}
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-20 bg-mystica-dark-200 border-gray-700"
                      />
                      <span className="text-gray-400">min</span>
                    </div>
                    <Button onClick={startTimer} className="bg-gradient-to-r from-indigo-500 to-purple-500">
                      <Play className="w-4 h-4 mr-2" /> Iniciar
                    </Button>
                    <Button variant="outline" onClick={() => setTimerMinutes(5)}>5 min</Button>
                    <Button variant="outline" onClick={() => setTimerMinutes(10)}>10 min</Button>
                    <Button variant="outline" onClick={() => setTimerMinutes(15)}>15 min</Button>
                    <Button variant="outline" onClick={() => setTimerMinutes(20)}>20 min</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Active Timer */}
          <AnimatePresence>
            {timerActive && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg border border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-mono text-white font-bold">
                        {formatTime(timerRemaining)}
                      </div>
                      <div className="w-32">
                        <Progress 
                          value={((timerMinutes * 60 + timerSeconds - timerRemaining) / (timerMinutes * 60 + timerSeconds)) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setTimerActive(!timerActive)} variant="outline" size="icon">
                        {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button onClick={stopTimer} variant="destructive" size="icon">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Player View */}
        <AnimatePresence mode="wait">
          {selectedMeditation ? (
            <motion.div 
              key="guided-player"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Button onClick={goBack} variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver
              </Button>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 flex justify-center">
                  <NPC3DGuide
                    guide={bodhisattvaGuide}
                    dialogue={selectedMeditation.steps[currentStep]}
                    size="md"
                    showGlow={true}
                    floating={true}
                  />
                </div>

                <div className="lg:w-2/3">
                  <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <h2 className="text-2xl font-bold text-white">{selectedMeditation.name}</h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleFavorite(selectedMeditation.id, e as React.MouseEvent)}
                            className="text-yellow-400"
                          >
                            {progress.isFavorite(selectedMeditation.id) 
                              ? <BookmarkCheck className="w-5 h-5" /> 
                              : <Bookmark className="w-5 h-5" />}
                          </Button>
                        </div>
                        <p className="text-gray-400">{selectedMeditation.duration} minutos • {selectedMeditation.level}</p>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Paso {currentStep + 1} de {selectedMeditation.steps.length}</span>
                          <span>{Math.round(((currentStep + 1) / selectedMeditation.steps.length) * 100)}%</span>
                        </div>
                        <Progress value={((currentStep + 1) / selectedMeditation.steps.length) * 100} className="h-2" />
                      </div>

                      <div className="bg-mystica-dark-300/50 rounded-xl p-6 mb-6">
                        <p className="text-white text-lg text-center">{selectedMeditation.steps[currentStep]}</p>
                      </div>

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

                      <div className="mt-8 p-4 bg-purple-900/20 rounded-xl">
                        <p className="text-center text-purple-300 italic">"{selectedMeditation.affirmations[0]}"</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : selectedUnguided ? (
            <motion.div 
              key="unguided-player"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Button onClick={goBack} variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver
              </Button>

              <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30 overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        {audioTypeIcons[selectedUnguided.audioType] || <Music className="w-12 h-12 text-white" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedUnguided.name}</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => toggleFavorite(selectedUnguided.id, e as React.MouseEvent)}
                        className="text-yellow-400"
                      >
                        {progress.isFavorite(selectedUnguided.id) 
                          ? <BookmarkCheck className="w-5 h-5" /> 
                          : <Bookmark className="w-5 h-5" />}
                      </Button>
                    </div>
                    <p className="text-gray-400">{selectedUnguided.duration} minutos • {selectedUnguided.category}</p>
                  </div>

                  <p className="text-center text-gray-300 mb-6">{selectedUnguided.description}</p>

                  {/* Audio Visualizer Animation */}
                  <div className="flex items-end justify-center gap-1 h-20 mb-8">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
                        animate={{
                          height: isPlaying 
                            ? [20, Math.random() * 60 + 20, 20]
                            : 20
                        }}
                        transition={{
                          duration: 0.5 + Math.random() * 0.5,
                          repeat: isPlaying ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={handlePlay}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>
                    <Button onClick={completeMeditation} variant="outline" className="border-green-500 text-green-400">
                      ✓ Completar
                    </Button>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {selectedUnguided.benefits.map((benefit, i) => (
                      <Badge key={i} className="bg-indigo-900/50 text-indigo-200">{benefit}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="main-view"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              {/* NPC Guide Section */}
              <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="lg:w-1/3 flex justify-center">
                  <NPC3DGuide
                    guide={bodhisattvaGuide}
                    dialogue={dialogues[currentDialogue]}
                    size="lg"
                    showGlow={true}
                    floating={true}
                  />
                </div>

                <div className="lg:w-2/3">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-7 mb-6 bg-mystica-dark-200 h-auto">
                      <TabsTrigger value="guiadas" className="data-[state=active]:bg-indigo-600 py-2">
                        <Headphones className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Guiadas</span>
                        <span className="sm:hidden">{meditations.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="sin-guiar" className="data-[state=active]:bg-purple-600 py-2">
                        <Music className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Sonidos</span>
                        <span className="sm:hidden">{unguidedMeditations.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="programas" className="data-[state=active]:bg-teal-600 py-2">
                        <BookOpen className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Programas</span>
                        <span className="sm:hidden">{meditationPrograms.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="progreso" className="data-[state=active]:bg-green-600 py-2">
                        <BarChart3 className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Progreso</span>
                      </TabsTrigger>
                      <TabsTrigger value="estadisticas" className="data-[state=active]:bg-amber-600 py-2">
                        <TrendingUp className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Estadisticas</span>
                      </TabsTrigger>
                      <TabsTrigger value="recordatorios" className="data-[state=active]:bg-pink-600 py-2">
                        <Bell className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Recordatorios</span>
                      </TabsTrigger>
                      <TabsTrigger value="logros" className="data-[state=active]:bg-yellow-600 py-2">
                        <Trophy className="w-4 h-4 mr-1 md:mr-2" />
                        <span className="hidden sm:inline">Logros</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="guiadas">
                      {/* Meditation of the Day */}
                      {getMeditationOfTheDay && (
                        <div className="mb-6">
                          <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-2 border-indigo-500/50 overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                <div className="flex-1 p-6">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Meditación del Día</Badge>
                                  </div>
                                  <h3 className="text-2xl font-bold text-white mb-2">{getMeditationOfTheDay.name}</h3>
                                  <p className="text-gray-300 mb-4 line-clamp-2">{getMeditationOfTheDay.description}</p>
                                  <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="text-sm text-gray-400 flex items-center gap-1">
                                      <Timer className="w-4 h-4" /> {getMeditationOfTheDay.duration} min
                                    </span>
                                    <Badge className={cn(
                                      getMeditationOfTheDay.level === 'principiante' && "bg-green-900/50 text-green-200",
                                      getMeditationOfTheDay.level === 'intermedio' && "bg-yellow-900/50 text-yellow-200",
                                      getMeditationOfTheDay.level === 'avanzado' && "bg-red-900/50 text-red-200"
                                    )}>
                                      {getMeditationOfTheDay.level}
                                    </Badge>
                                  </div>
                                  <Button 
                                    onClick={() => startMeditation(getMeditationOfTheDay)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Comenzar Ahora
                                  </Button>
                                </div>
                                <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                                  <span className="text-6xl">{meditationCategories.find(c => c.id === getMeditationOfTheDay.category)?.icon || '🧘'}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Recommended for You */}
                      {getRecommendedMeditations.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <Compass className="w-4 h-4 text-indigo-400" /> Recomendado para ti ahora
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {getRecommendedMeditations.map((meditation) => {
                              const categoryInfo = meditationCategories.find(c => c.id === meditation.category)
                              return (
                                <motion.div
                                  key={meditation.id}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => startMeditation(meditation)}
                                  className="cursor-pointer"
                                >
                                  <Card className="bg-mystica-dark-100/50 border-gray-700 hover:border-indigo-500/50 transition-all h-full">
                                    <CardContent className="p-3 text-center">
                                      <div className={cn(
                                        "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-gradient-to-br",
                                        categoryInfo?.color || "from-indigo-500 to-purple-500"
                                      )}>
                                        <span className="text-xl">{categoryInfo?.icon || '🧘'}</span>
                                      </div>
                                      <p className="text-sm font-medium text-white line-clamp-1">{meditation.name}</p>
                                      <p className="text-xs text-gray-400">{meditation.duration} min</p>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Favorites Quick Access */}
                      {progress.favorites.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" /> Favoritos
                          </h3>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {progress.favorites
                              .filter(id => visibleMeditations.some(m => m.id === id))
                              .slice(0, 5)
                              .map(id => {
                                const meditation = meditations.find(m => m.id === id)
                                if (!meditation) return null
                                const categoryInfo = meditationCategories.find(c => c.id === meditation.category)
                                return (
                                  <Badge 
                                    key={id}
                                    className="cursor-pointer bg-yellow-500/20 text-yellow-400 whitespace-nowrap hover:bg-yellow-500/30"
                                    onClick={() => startMeditation(meditation)}
                                  >
                                    {categoryInfo?.icon} {meditation.name}
                                  </Badge>
                                )
                              })}
                          </div>
                        </div>
                      )}

                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge 
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedCategory === 'all' 
                              ? "bg-indigo-600 text-white" 
                              : "bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800/50"
                          )}
                          onClick={() => setSelectedCategory('all')}
                        >
                          Todas ({visibleMeditations.length})
                        </Badge>
                        {meditationCategories.map((cat) => (
                          <Badge 
                            key={cat.id}
                            className={cn(
                              "cursor-pointer transition-all",
                              selectedCategory === cat.id 
                                ? "bg-indigo-600 text-white" 
                                : "bg-indigo-900/50 text-indigo-200 hover:bg-indigo-800/50"
                            )}
                            onClick={() => setSelectedCategory(cat.id)}
                          >
                            {cat.icon} {cat.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Results count */}
                      {searchQuery && (
                        <p className="text-sm text-gray-400 mb-4">
                          {filteredMeditations.length} resultado{filteredMeditations.length !== 1 ? 's' : ''} para "{searchQuery}"
                        </p>
                      )}

                      {/* Guided Meditations Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredMeditations.map((meditation, index) => {
                          const isLocked = !canAccessFull && index >= freeMeditations.length
                          const categoryInfo = meditationCategories.find(c => c.id === meditation.category)
                          const isFav = progress.isFavorite(meditation.id)
                          const sessions = progress.getSessionsByMeditation(meditation.id)
                          
                          return (
                            <motion.div
                              key={meditation.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.02, 0.5) }}
                              onClick={() => !isLocked && startMeditation(meditation)}
                              className={cn("cursor-pointer", isLocked && "opacity-50")}
                            >
                              <Card className={cn(
                                "bg-mystica-dark-100/50 border-gray-700 hover:border-indigo-500/50 transition-all h-full",
                                isLocked && "hover:border-gray-700"
                              )}>
                                <CardContent className="p-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                        {meditation.name}
                                        {isFav && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                                        {isLocked && <span className="text-yellow-400">🔒</span>}
                                      </h3>
                                      <p className="text-sm text-gray-400 flex items-center gap-2">
                                        <Timer className="w-3 h-3" />
                                        {meditation.duration} min
                                        {sessions.length > 0 && (
                                          <span className="text-green-400">• {sessions.length}x</span>
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => toggleFavorite(meditation.id, e)}
                                        className="h-8 w-8"
                                      >
                                        {isFav 
                                          ? <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                          : <Star className="w-4 h-4 text-gray-500" />
                                        }
                                      </Button>
                                      <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
                                        categoryInfo?.color || "from-indigo-500 to-purple-500"
                                      )}>
                                        <span className="text-xl">{categoryInfo?.icon || '🧘'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-300 line-clamp-2 mb-3">{meditation.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-indigo-900/50 text-indigo-200">
                                      {categoryInfo?.name || meditation.category}
                                    </Badge>
                                    <Badge className={cn(
                                      meditation.level === 'principiante' && "bg-green-900/50 text-green-200",
                                      meditation.level === 'intermedio' && "bg-yellow-900/50 text-yellow-200",
                                      meditation.level === 'avanzado' && "bg-red-900/50 text-red-200"
                                    )}>
                                      {meditation.level}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="sin-guiar">
                      {/* Audio Type Filter */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge 
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedAudioType === 'all' 
                              ? "bg-purple-600 text-white" 
                              : "bg-purple-900/50 text-purple-200 hover:bg-purple-800/50"
                          )}
                          onClick={() => setSelectedAudioType('all')}
                        >
                          Todos ({visibleUnguided.length})
                        </Badge>
                        {[
                          { id: 'cuencos', name: 'Cuencos', icon: <Sparkles className="w-3 h-3" /> },
                          { id: 'frecuencias', name: 'Frecuencias', icon: <Waves className="w-3 h-3" /> },
                          { id: 'naturaleza', name: 'Naturaleza', icon: <Leaf className="w-3 h-3" /> },
                          { id: 'mantras', name: 'Mantras', icon: <Brain className="w-3 h-3" /> },
                          { id: 'ambiental', name: 'Ambiental', icon: <Music className="w-3 h-3" /> },
                          { id: 'binaural', name: 'Binaural', icon: <Headphones className="w-3 h-3" /> },
                        ].map((type) => (
                          <Badge 
                            key={type.id}
                            className={cn(
                              "cursor-pointer transition-all",
                              selectedAudioType === type.id 
                                ? "bg-purple-600 text-white" 
                                : "bg-purple-900/50 text-purple-200 hover:bg-purple-800/50"
                            )}
                            onClick={() => setSelectedAudioType(type.id)}
                          >
                            {type.icon} <span className="ml-1">{type.name}</span>
                          </Badge>
                        ))}
                      </div>

                      {/* Unguided Meditations Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUnguided.map((meditation, index) => {
                          const isLocked = !canAccessFull && index >= freeUnguided.length
                          const isFav = progress.isFavorite(meditation.id)
                          
                          return (
                            <motion.div
                              key={meditation.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(index * 0.02, 0.5) }}
                              onClick={() => !isLocked && startUnguided(meditation)}
                              className={cn("cursor-pointer", isLocked && "opacity-50")}
                            >
                              <Card className={cn(
                                "bg-mystica-dark-100/50 border-gray-700 hover:border-purple-500/50 transition-all h-full",
                                isLocked && "hover:border-gray-700"
                              )}>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                                      {audioTypeIcons[meditation.audioType] || <Music className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {isFav && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                                      {isLocked && <span className="text-yellow-400">🔒</span>}
                                    </div>
                                  </div>
                                  <h3 className="font-bold text-white mb-1">{meditation.name}</h3>
                                  <p className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                                    <Timer className="w-3 h-3" />
                                    {meditation.duration} min
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-2">{meditation.description}</p>
                                  <Badge className="mt-2 bg-purple-900/50 text-purple-200 text-xs">
                                    {meditation.category}
                                  </Badge>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="programas">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-teal-400" />
                          Programas de Meditación
                        </h2>
                        <p className="text-gray-400">
                          Rutas estructuradas para transformar tu práctica de meditación
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {meditationPrograms.map((program) => {
                          const isLocked = program.premium && !canAccessFull
                          const programMeditations = program.meditations.map(id => meditations.find(m => m.id === id)).filter(Boolean)
                          
                          return (
                            <motion.div
                              key={program.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: program.id * 0.1 }}
                              className={cn(isLocked && "opacity-60")}
                            >
                              <Card className={cn(
                                "bg-mystica-dark-100/50 border-gray-700 hover:border-teal-500/50 transition-all h-full overflow-hidden",
                                isLocked && "hover:border-gray-700"
                              )}>
                                <div className={cn("h-2 bg-gradient-to-r", program.color)} />
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                                        program.color
                                      )}>
                                        <span className="text-2xl">{program.icon}</span>
                                      </div>
                                      <div>
                                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                          {program.name}
                                          {isLocked && <Crown className="w-4 h-4 text-yellow-400" />}
                                        </h3>
                                        <p className="text-sm text-gray-400">{program.duration} • {program.level}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-gray-300 text-sm mb-4">{program.description}</p>

                                  {/* Benefits */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {program.benefits.map((benefit, i) => (
                                      <Badge key={i} className="bg-teal-900/30 text-teal-300 text-xs">
                                        {benefit}
                                      </Badge>
                                    ))}
                                  </div>

                                  {/* Progress Preview */}
                                  <div className="bg-mystica-dark-200/50 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-gray-400 mb-2">Meditaciones incluidas:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {programMeditations.slice(0, 4).map((meditation, i) => (
                                        <span key={i} className="text-xs text-gray-300">
                                          {meditation?.name}
                                          {i < Math.min(programMeditations.length, 4) - 1 && ' • '}
                                        </span>
                                      ))}
                                      {programMeditations.length > 4 && (
                                        <span className="text-xs text-teal-400"> +{programMeditations.length - 4} más</span>
                                      )}
                                    </div>
                                  </div>

                                  <Button 
                                    className={cn(
                                      "w-full bg-gradient-to-r",
                                      isLocked ? "from-yellow-600 to-orange-600" : "from-teal-600 to-cyan-600"
                                    )}
                                    disabled={!isLocked && !canAccessFull && program.premium}
                                  >
                                    {isLocked ? (
                                      <>
                                        <Crown className="w-4 h-4 mr-2" />
                                        Desbloquear Premium
                                      </>
                                    ) : (
                                      <>
                                        <Target className="w-4 h-4 mr-2" />
                                        Comenzar Programa
                                      </>
                                    )}
                                  </Button>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>

                      {/* Category Overview */}
                      <div className="mt-8">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Compass className="w-5 h-5 text-indigo-400" />
                          Explora por Categoría
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {meditationCategories.map((category) => {
                            const count = meditations.filter(m => m.category === category.id).length
                            return (
                              <motion.div
                                key={category.id}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => {
                                  setSelectedCategory(category.id as MeditationCategory)
                                  setActiveTab('guiadas')
                                }}
                                className="cursor-pointer"
                              >
                                <Card className="bg-mystica-dark-100/50 border-gray-700 hover:border-indigo-500/50 transition-all h-full">
                                  <CardContent className="p-3 text-center">
                                    <div className={cn(
                                      "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-gradient-to-br",
                                      category.color
                                    )}>
                                      <span className="text-lg">{category.icon}</span>
                                    </div>
                                    <p className="text-xs font-medium text-white">{category.name}</p>
                                    <p className="text-[10px] text-gray-400">{count} meditaciones</p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="progreso">
                      <StatsOverview />
                      <WeeklyChallenges />
                      
                      {/* Reminders Section */}
                      <Card className="bg-mystica-dark-100/50 border-gray-700 mb-6">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                              <Bell className="w-5 h-5 text-indigo-400" />
                              Recordatorios
                            </CardTitle>
                            <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
                              <DialogTrigger asChild>
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                  <Plus className="w-4 h-4 mr-1" /> Nuevo
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-mystica-dark-100 border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Crear Recordatorio</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Hora</label>
                                    <Input
                                      type="time"
                                      value={newReminderTime}
                                      onChange={(e) => setNewReminderTime(e.target.value)}
                                      className="bg-mystica-dark-200 border-gray-700"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Días</label>
                                    <div className="flex gap-2">
                                      {DAYS.map((day, i) => (
                                        <Button
                                          key={i}
                                          size="sm"
                                          variant={newReminderDays.includes(i) ? "default" : "outline"}
                                          onClick={() => toggleDay(i)}
                                          className={cn(
                                            "w-10",
                                            newReminderDays.includes(i) && "bg-indigo-600"
                                          )}
                                        >
                                          {day}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400 mb-2 block">Mensaje</label>
                                    <Input
                                      value={newReminderMessage}
                                      onChange={(e) => setNewReminderMessage(e.target.value)}
                                      className="bg-mystica-dark-200 border-gray-700"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={addReminder} className="bg-indigo-600">
                                    Crear Recordatorio
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {reminders.reminders.length === 0 ? (
                            <p className="text-gray-400 text-sm">No tienes recordatorios. Crea uno para recordar meditar.</p>
                          ) : (
                            <div className="space-y-2">
                              {reminders.reminders.map((reminder) => (
                                <div key={reminder.id} className="flex items-center justify-between p-3 bg-mystica-dark-200/50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Switch
                                      checked={reminder.enabled}
                                      onCheckedChange={() => reminders.toggleReminder(reminder.id)}
                                    />
                                    <div>
                                      <p className="font-medium text-white">{reminder.time}</p>
                                      <p className="text-xs text-gray-400">
                                        {reminder.days.map(d => DAYS[d]).join(', ')}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => reminders.deleteReminder(reminder.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Recent Sessions */}
                      {progress.sessions.length > 0 && (
                        <Card className="bg-mystica-dark-100/50 border-gray-700 mb-6">
                          <CardContent className="p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-indigo-400" />
                              Sesiones Recientes
                            </h3>
                            <div className="space-y-3">
                              {progress.getRecentSessions(5).map((session) => (
                                <div 
                                  key={session.id}
                                  className="flex items-center justify-between p-3 bg-mystica-dark-200/50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium text-white">{session.meditationName}</p>
                                    <p className="text-xs text-gray-400">
                                      {new Date(session.completedAt).toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-indigo-400">{session.duration} min</p>
                                    {session.completed ? (
                                      <Badge className="bg-green-500/20 text-green-400 text-xs">Completada</Badge>
                                    ) : (
                                      <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Parcial</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Favorite Category */}
                      {progress.stats.favoriteCategory && (
                        <Card className="bg-mystica-dark-100/50 border-gray-700 mb-6">
                          <CardContent className="p-6">
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-green-400" />
                              Categoría Favorita
                            </h3>
                            <p className="text-lg text-indigo-400">{progress.stats.favoriteCategory}</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Basado en tu historial de meditaciones
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Empty State */}
                      {progress.sessions.length === 0 && (
                        <Card className="bg-mystica-dark-100/50 border-gray-700">
                          <CardContent className="p-8 text-center">
                            <Headphones className="w-16 h-16 mx-auto mb-4 text-indigo-400 opacity-50" />
                            <h3 className="text-xl font-bold text-white mb-2">Comienza tu viaje</h3>
                            <p className="text-gray-400 mb-4">
                              Aún no has completado ninguna meditación. ¡Elige una para empezar!
                            </p>
                            <Button onClick={() => setActiveTab('guiadas')} className="bg-gradient-to-r from-indigo-500 to-purple-500">
                              <ChevronRight className="w-4 h-4 mr-2" />
                              Ver Meditaciones
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="estadisticas">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <TrendingUp className="w-6 h-6 text-amber-400" />
                          Estadisticas Detalladas
                        </h2>
                        <p className="text-gray-400">
                          Analiza tu progreso y patrones de meditacion
                        </p>
                      </div>
                      
                      {/* Summary Stats */}
                      <MeditationStats className="mb-6" />
                      
                      {/* Heatmap */}
                      <MeditationHeatmap className="mb-6" />
                      
                      {/* Charts */}
                      <MeditationCharts />
                    </TabsContent>

                    <TabsContent value="recordatorios">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <Bell className="w-6 h-6 text-pink-400" />
                          Gestion de Recordatorios
                        </h2>
                        <p className="text-gray-400">
                          Configura notificaciones para tu practica diaria
                        </p>
                      </div>
                      <ReminderPanel />
                    </TabsContent>

                    <TabsContent value="logros">
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <Trophy className="w-6 h-6 text-yellow-400" />
                          Logros de Meditación
                        </h2>
                        <p className="text-gray-400">
                          {reminders.unlockedAchievements.length} de {meditationAchievements.length} desbloqueados
                        </p>
                        <Progress 
                          value={(reminders.unlockedAchievements.length / meditationAchievements.length) * 100} 
                          className="h-2 mt-2"
                        />
                      </div>
                      <AchievementsGrid />
                    </TabsContent>
                  </Tabs>

                  {/* Premium Upsell */}
                  {!canAccessFull && (
                    <Card className="mt-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                      <CardContent className="p-6 text-center">
                        <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white mb-2">Desbloquea Todo el Contenido</h3>
                        <p className="text-gray-300 mb-4">
                          Accede a <span className="text-yellow-400 font-semibold">{meditations.length} meditaciones guiadas</span> y{' '}
                          <span className="text-yellow-400 font-semibold">{unguidedMeditations.length} sonidos sin guiar</span>
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          <Badge className="bg-yellow-500/20 text-yellow-400">Sin límites</Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-400">Sin anuncios</Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-400">Progreso ilimitado</Badge>
                        </div>
                        <Link href="/premium">
                          <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold">
                            <Crown className="w-4 h-4 mr-2" />
                            Hazte Premium
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
