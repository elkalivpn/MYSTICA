'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useOnboarding } from '@/hooks/useOnboarding'
import { WelcomeSlide } from './WelcomeSlide'
import { TarotSlide } from './TarotSlide'
import { MeditationSlide } from './MeditationSlide'
import { MoonSlide } from './MoonSlide'
import { StatsSlide } from './StatsSlide'
import { ReadySlide } from './ReadySlide'
import { cn } from '@/lib/utils'

const TOTAL_STEPS = 6

const slides = [
  { id: 0, component: WelcomeSlide, title: 'Bienvenido' },
  { id: 1, component: TarotSlide, title: 'Tarot' },
  { id: 2, component: MeditationSlide, title: 'Meditaciones' },
  { id: 3, component: MoonSlide, title: 'Luna' },
  { id: 4, component: StatsSlide, title: 'Progreso' },
  { id: 5, component: ReadySlide, title: 'Comenzar' },
]

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const { currentStep, nextStep, prevStep, hasCompletedOnboarding } = useOnboarding()

  const handleComplete = () => {
    onComplete()
  }

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100
  const isLastStep = currentStep === TOTAL_STEPS - 1
  const isFirstStep = currentStep === 0

  // Get current slide component
  const CurrentSlide = slides[currentStep]?.component

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  }

  const direction = 1 // 1 for forward, -1 for backward

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-mystica-dark-300 via-mystica-dark-200 to-mystica-dark-300 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-mystica-purple-600/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-mystica-gold-500/10 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Header with progress */}
      <header className="relative z-10 px-4 py-4">
        <div className="max-w-lg mx-auto">
          {/* Progress bar */}
          <div className="mb-2">
            <Progress 
              value={progress} 
              className="h-1 bg-mystica-dark-100/50"
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Paso {currentStep + 1} de {TOTAL_STEPS}
            </span>
            <div className="flex gap-1">
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentStep 
                      ? "bg-mystica-gold-400 w-4" 
                      : index < currentStep 
                        ? "bg-mystica-purple-500" 
                        : "bg-gray-600"
                  )}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1
                  }}
                />
              ))}
            </div>
            {!isLastStep && (
              <button
                onClick={onSkip}
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Saltar <SkipForward className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="relative z-10 h-[calc(100vh-180px)] overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="h-full"
          >
            {CurrentSlide && (
              currentStep === TOTAL_STEPS - 1 
                ? <ReadySlide onComplete={handleComplete} />
                : <CurrentSlide />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation buttons */}
      {!isLastStep && (
        <footer className="absolute bottom-0 left-0 right-0 z-10 px-4 py-6 bg-gradient-to-t from-mystica-dark-300 via-mystica-dark-300/95 to-transparent">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className={cn(
                "flex-1 h-12 border-mystica-purple-700/30 text-gray-300",
                "hover:bg-mystica-purple-900/30 hover:text-white",
                "disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Anterior
            </Button>
            
            <Button
              onClick={nextStep}
              className="flex-1 h-12 bg-gradient-to-r from-mystica-purple-600 to-mystica-purple-700 hover:from-mystica-purple-500 hover:to-mystica-purple-600 text-white"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
