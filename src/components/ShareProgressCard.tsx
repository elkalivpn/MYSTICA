'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, X, Trophy, Clock, Flame, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useMeditationProgress } from '@/hooks/useMeditationProgress'
import { useLevelSystem, getLevelFromXP } from '@/hooks/useLevelSystem'
import { useReminders } from '@/hooks/useReminders'
import { toast } from 'sonner'

interface ShareProgressCardProps {
  onClose?: () => void
}

export function ShareProgressCard({ onClose }: ShareProgressCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const meditationProgress = useMeditationProgress()
  const levelSystem = useLevelSystem()
  const reminders = useReminders()
  
  const currentLevel = levelSystem.getLevel()
  const levelProgress = levelSystem.getLevelProgress()

  const generateShareImage = async () => {
    setIsGenerating(true)
    
    // Create canvas for the share image
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      setIsGenerating(false)
      return
    }
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 800)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(0.5, '#16213e')
    gradient.addColorStop(1, '#0f0f23')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 600, 800)
    
    // Decorative circles
    ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
    ctx.beginPath()
    ctx.arc(300, 200, 300, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = 'rgba(139, 92, 246, 0.1)'
    ctx.beginPath()
    ctx.arc(300, 600, 200, 0, Math.PI * 2)
    ctx.fill()
    
    // App name
    ctx.fillStyle = '#a78bfa'
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('MYSTICA', 300, 60)
    
    // Level badge
    ctx.fillStyle = currentLevel.color
    ctx.font = 'bold 24px Arial'
    ctx.fillText(`Nivel ${currentLevel.level}`, 300, 100)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px Arial'
    ctx.fillText(currentLevel.title, 300, 130)
    
    // Level icon (large)
    ctx.font = '80px Arial'
    ctx.fillText(currentLevel.icon, 300, 230)
    
    // Stats container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.roundRect(50, 280, 500, 200, 20)
    ctx.fill()
    
    // Stats
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Arial'
    ctx.fillText(`${meditationProgress.stats.totalMinutes}`, 150, 350)
    ctx.fillText(`${meditationProgress.stats.completedSessions}`, 300, 350)
    ctx.fillText(`${meditationProgress.stats.currentStreak}`, 450, 350)
    
    ctx.fillStyle = '#9ca3af'
    ctx.font = '16px Arial'
    ctx.fillText('Minutos', 150, 380)
    ctx.fillText('Sesiones', 300, 380)
    ctx.fillText('Racha', 450, 380)
    
    // Achievements
    const unlockedCount = reminders.unlockedAchievements.length
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 28px Arial'
    ctx.fillText(`${unlockedCount} Logros Desbloqueados`, 300, 540)
    
    // XP Progress
    ctx.fillStyle = '#4b5563'
    ctx.fillRect(100, 580, 400, 20)
    ctx.fillStyle = '#8b5cf6'
    ctx.fillRect(100, 580, 400 * (levelProgress.progress / 100), 20)
    
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px Arial'
    ctx.fillText(`${Math.round(levelProgress.progress)}% hacia el siguiente nivel`, 300, 620)
    
    // Footer
    ctx.fillStyle = '#6b7280'
    ctx.font = '14px Arial'
    ctx.fillText('Medita con Mystica', 300, 750)
    ctx.fillText('mystica.app', 300, 770)
    
    // Download image
    const link = document.createElement('a')
    link.download = `mystica-progress-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    
    setIsGenerating(false)
    toast.success('📥 Imagen descargada')
  }

  const shareToTwitter = () => {
    const text = `🧘 He completado ${meditationProgress.stats.completedSessions} sesiones de meditación en Mystica!\n\n⏱️ ${meditationProgress.stats.totalMinutes} minutos\n🔥 ${meditationProgress.stats.currentStreak} días de racha\n🏆 Nivel ${currentLevel.level}: ${currentLevel.title}\n\n#Meditación #Bienestar #MysticaApp`
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    toast.success('🐦 Compartido en Twitter')
  }

  const shareToWhatsApp = () => {
    const text = `🧘 *Mi progreso en Mystica*\n\n⏱️ ${meditationProgress.stats.totalMinutes} minutos meditando\n🔥 ${meditationProgress.stats.currentStreak} días de racha\n🧘 ${meditationProgress.stats.completedSessions} sesiones\n🏆 Nivel ${currentLevel.level}: ${currentLevel.title}\n\n¡Únete a mí en el camino de la meditación!`
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    toast.success('📱 Compartido en WhatsApp')
  }

  const copyToClipboard = () => {
    const text = `🧘 Mi progreso en Mystica:
    
⏱️ ${meditationProgress.stats.totalMinutes} minutos meditando
🔥 ${meditationProgress.stats.currentStreak} días de racha
🧘 ${meditationProgress.stats.completedSessions} sesiones completadas
🏆 Nivel ${currentLevel.level}: ${currentLevel.title}
⭐ ${reminders.unlockedAchievements.length} logros desbloqueados`
    
    navigator.clipboard.writeText(text)
    toast.success('📋 Copiado al portapapeles')
  }

  return (
    <Card className="bg-mystica-dark-100/80 border-indigo-500/30 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            Compartir Progreso
          </h3>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Preview Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 mb-4 text-center">
          <div className="text-4xl mb-2">{currentLevel.icon}</div>
          <h4 className="text-xl font-bold text-white">{currentLevel.title}</h4>
          <p className="text-indigo-400 text-sm mb-4">Nivel {currentLevel.level}</p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{meditationProgress.stats.totalMinutes}</p>
              <p className="text-xs text-gray-400">Minutos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{meditationProgress.stats.completedSessions}</p>
              <p className="text-xs text-gray-400">Sesiones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{meditationProgress.stats.currentStreak}</p>
              <p className="text-xs text-gray-400">Racha</p>
            </div>
          </div>
        </div>
        
        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button 
            variant="outline" 
            className="border-blue-500/30 text-blue-400"
            onClick={shareToTwitter}
          >
            𝕏 Twitter
          </Button>
          <Button 
            variant="outline" 
            className="border-green-500/30 text-green-400"
            onClick={shareToWhatsApp}
          >
            WhatsApp
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400"
            onClick={generateShareImage}
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-2" />
            Imagen
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-500/30 text-gray-400"
            onClick={copyToClipboard}
          >
            📋 Copiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
