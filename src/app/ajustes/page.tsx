'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Volume2, VolumeX, Bell, BellOff, Moon, Sun, 
  Trash2, Download, Upload, Crown, Shield, User, LogOut,
  Headphones, Clock, Trophy, Target, Flame, RefreshCw, Palette, Monitor,
  Eye, Moon as MoonIcon, Sun as SunIcon, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useSettings, useAppSound } from '@/hooks/useSettings'
import { useMeditationProgress } from '@/hooks/useMeditationProgress'
import { useReminders, meditationAchievements } from '@/hooks/useReminders'
import { useStreak } from '@/hooks/useStreak'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useTheme } from '@/components/ThemeProvider'
import { ThemeSelector } from '@/components/ThemeToggle'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user, isAdmin, isPremium, logout } = useAuth()
  const settings = useSettings()
  const { enabled: soundEnabled, toggle: toggleSound } = useAppSound()
  const meditationProgress = useMeditationProgress()
  const reminders = useReminders()
  const streak = useStreak()
  const { restartOnboarding } = useOnboarding()
  const { theme, resolvedTheme } = useTheme()
  const { t } = useTranslation()
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(reminders.notificationsEnabled)
  
  // Get notification settings from the hook
  const notificationSettings = reminders.getNotificationSettings()
  const complianceStats = reminders.getComplianceStats()

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const result = await reminders.requestPersistentPermission()
      if (result.granted) {
        setNotificationsEnabled(true)
        toast.success(result.persistent 
          ? 'Notificaciones habilitadas con persistencia' 
          : t('settings.notifications.enabled'))
      } else {
        toast.error(t('settings.notifications.enableError'))
      }
    } else {
      reminders.disableNotifications()
      setNotificationsEnabled(false)
      toast.info(t('settings.notifications.disabled'))
    }
  }

  const handlePreviewNotification = async () => {
    await reminders.sendPreviewNotification()
    toast.success('Notificacion de prueba enviada')
  }

  const handleClearNotificationHistory = () => {
    if (confirm('¿Estas seguro de que quieres limpiar el historial de notificaciones?')) {
      reminders.clearNotificationHistory()
      toast.success('Historial de notificaciones limpiado')
    }
  }

  const handleClearMeditationHistory = () => {
    if (confirm(t('settings.meditationStats.clearHistoryConfirm'))) {
      meditationProgress.clearHistory()
      toast.success(t('settings.meditationStats.clearHistorySuccess'))
    }
  }

  const handleExportData = () => {
    const data = {
      meditationProgress: {
        sessions: meditationProgress.sessions,
        favorites: meditationProgress.favorites,
        stats: meditationProgress.stats
      },
      achievements: reminders.unlockedAchievements,
      streak: {
        currentStreak: streak.currentStreak,
        bestStreak: streak.bestStreak,
        totalCheckIns: streak.totalCheckIns
      },
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mystica-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(t('settings.data.exportSuccess'))
  }

  const handleLogout = () => {
    logout()
    toast.success(t('settings.account.logoutSuccess'))
  }

  const handleRestartOnboarding = () => {
    restartOnboarding()
    toast.success('El tutorial de bienvenida se mostrara la proxima vez que entres')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-indigo-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {t('settings.title')}
              </h1>
              <p className="text-sm text-gray-400">{t('settings.subtitle')}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* User Info */}
        {user && (
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-white text-lg">{user.name}</h2>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin && <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>}
                  {isPremium && !isAdmin && <Badge className="bg-yellow-500/20 text-yellow-400"><Crown className="w-3 h-3 mr-1" />Premium</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sound Settings */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-400" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
              {t('settings.sound.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.sound.effects')}</p>
                <p className="text-sm text-gray-400">{t('settings.sound.effectsDescription')}</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.sound.volume')}</p>
                <p className="text-sm text-gray-400">{t('settings.sound.volumeDescription')}</p>
              </div>
              <Select 
                value={settings.volume.toString()} 
                onValueChange={(v) => settings.setVolume(parseInt(v))}
              >
                <SelectTrigger className="w-24 bg-mystica-dark-200 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-mystica-dark-200 border-gray-700">
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              {resolvedTheme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-foreground mb-1">Tema de la aplicacion</p>
              <p className="text-sm text-muted-foreground mb-4">Elige el modo de visualizacion</p>
              <ThemeSelector />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardContent className="p-6">
            <LanguageSelector />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {notificationsEnabled ? <Bell className="w-5 h-5 text-indigo-400" /> : <BellOff className="w-5 h-5 text-gray-500" />}
              {t('settings.notifications.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.notifications.reminders')}</p>
                <p className="text-sm text-gray-400">{t('settings.notifications.remindersDescription')}</p>
              </div>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleToggleNotifications} 
              />
            </div>
            
            <Separator className="bg-gray-700" />

            {/* Notification Sound */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
                <div>
                  <p className="text-white text-sm">Sonido de notificacion</p>
                  <p className="text-xs text-gray-400">Reproducir sonido al recibir notificaciones</p>
                </div>
              </div>
              <Switch 
                checked={notificationSettings.soundEnabled}
                onCheckedChange={(checked) => 
                  reminders.updateNotificationSettings({ soundEnabled: checked })
                }
              />
            </div>

            <Separator className="bg-gray-700" />

            {/* Do Not Disturb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MoonIcon className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-white text-sm">No molestar</p>
                  <p className="text-xs text-gray-400">Silenciar notificaciones en horario especifico</p>
                </div>
              </div>
              <Switch 
                checked={notificationSettings.doNotDisturb.enabled}
                onCheckedChange={(checked) =>
                  reminders.setDoNotDisturb({ enabled: checked })
                }
              />
            </div>

            {/* DND Time Range */}
            {notificationSettings.doNotDisturb.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-7"
              >
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Desde</label>
                    <Input
                      type="time"
                      value={notificationSettings.doNotDisturb.startTime}
                      onChange={(e) =>
                        reminders.setDoNotDisturb({ startTime: e.target.value })
                      }
                      className="bg-mystica-dark-200 border-gray-700 h-9"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Hasta</label>
                    <Input
                      type="time"
                      value={notificationSettings.doNotDisturb.endTime}
                      onChange={(e) =>
                        reminders.setDoNotDisturb({ endTime: e.target.value })
                      }
                      className="bg-mystica-dark-200 border-gray-700 h-9"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <Separator className="bg-gray-700" />

            {/* Preview Notification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-indigo-400" />
                <div>
                  <p className="text-white text-sm">Vista previa</p>
                  <p className="text-xs text-gray-400">Enviar una notificacion de prueba</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreviewNotification}
                className="border-indigo-500/30 text-indigo-400"
              >
                <Play className="w-3 h-3 mr-1" />
                Probar
              </Button>
            </div>
            
            {/* Active Reminders List */}
            {reminders.reminders.length > 0 && (
              <>
                <Separator className="bg-gray-700" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white">{t('settings.notifications.activeReminders')}</p>
                    <Badge className="bg-indigo-500/20 text-indigo-400">
                      {reminders.reminders.filter(r => r.enabled).length} activos
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reminders.reminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 bg-mystica-dark-200/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className={cn(
                            "w-4 h-4",
                            reminder.enabled ? "text-indigo-400" : "text-gray-500"
                          )} />
                          <div>
                            <p className={cn(
                              "text-sm",
                              reminder.enabled ? "text-white" : "text-gray-500"
                            )}>{reminder.time}</p>
                            <p className="text-xs text-gray-400">{reminder.days.length} dias/semana</p>
                          </div>
                        </div>
                        <Switch 
                          checked={reminder.enabled}
                          onCheckedChange={() => reminders.toggleReminder(reminder.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notification Stats */}
            {complianceStats.total > 0 && (
              <>
                <Separator className="bg-gray-700" />
                <div>
                  <p className="text-white mb-2">Estadisticas de cumplimiento</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-mystica-dark-200/50 rounded-lg">
                      <p className="text-lg font-bold text-white">{complianceStats.total}</p>
                      <p className="text-[10px] text-gray-400">Enviadas</p>
                    </div>
                    <div className="text-center p-2 bg-green-900/30 rounded-lg">
                      <p className="text-lg font-bold text-green-400">{complianceStats.meditated}</p>
                      <p className="text-[10px] text-gray-400">Completadas</p>
                    </div>
                    <div className="text-center p-2 bg-indigo-900/30 rounded-lg">
                      <p className="text-lg font-bold text-indigo-400">{Math.round(complianceStats.complianceRate)}%</p>
                      <p className="text-[10px] text-gray-400">Tasa</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link href="/meditaciones" className="flex-1">
                <Button variant="outline" className="w-full border-indigo-500/30 text-indigo-400">
                  <Headphones className="w-4 h-4 mr-2" />
                  {t('settings.notifications.configureReminders')}
                </Button>
              </Link>
              {reminders.getNotificationHistory().length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleClearNotificationHistory}
                  className="border-red-500/30 text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meditation Stats */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              {t('settings.meditationStats.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-mystica-dark-200/50 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                <p className="text-lg font-bold text-white">{meditationProgress.stats.totalMinutes}</p>
                <p className="text-xs text-gray-400">{t('common.minutes')}</p>
              </div>
              <div className="text-center p-3 bg-mystica-dark-200/50 rounded-lg">
                <Headphones className="w-5 h-5 mx-auto mb-1 text-green-400" />
                <p className="text-lg font-bold text-white">{meditationProgress.stats.completedSessions}</p>
                <p className="text-xs text-gray-400">{t('common.sessions')}</p>
              </div>
              <div className="text-center p-3 bg-mystica-dark-200/50 rounded-lg">
                <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                <p className="text-lg font-bold text-white">{meditationProgress.stats.currentStreak}</p>
                <p className="text-xs text-gray-400">{t('common.streak')}</p>
              </div>
              <div className="text-center p-3 bg-mystica-dark-200/50 rounded-lg">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                <p className="text-lg font-bold text-white">{reminders.unlockedAchievements.length}/{meditationAchievements.length}</p>
                <p className="text-xs text-gray-400">{t('common.achievements')}</p>
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 border-red-500/30 text-red-400"
                onClick={handleClearMeditationHistory}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('settings.meditationStats.clearHistory')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              {t('settings.data.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.data.export')}</p>
                <p className="text-sm text-gray-400">{t('settings.data.exportDescription')}</p>
              </div>
              <Button variant="outline" onClick={handleExportData} className="border-cyan-500/30 text-cyan-400">
                <Download className="w-4 h-4 mr-2" />
                {t('settings.data.export')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        {user && (
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                {t('settings.account.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isPremium && !isAdmin && (
                <Link href="/premium">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                    <Crown className="w-4 h-4 mr-2" />
                    {t('premium.goPremium')}
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline" 
                className="w-full border-red-500/30 text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('settings.account.logout')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tutorial */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              Tutorial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Ver tutorial de bienvenida</p>
                <p className="text-sm text-gray-400">Repite el proceso de onboarding</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRestartOnboarding}
                className="border-purple-500/30 text-purple-400"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ver tutorial
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">
              {t('settings.appInfo.version')}
            </p>
            <p className="text-gray-500 text-xs">
              {t('common.developedBy')} <span className="font-semibold text-mystica-gold-400">Yrys</span>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
