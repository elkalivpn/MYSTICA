'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, BellOff, Clock, Calendar, Plus, Trash2, Edit2, Check, X,
  Volume2, VolumeX, Moon as MoonIcon, Sun, ChevronLeft, ChevronRight,
  History, BarChart3, AlertCircle, RefreshCw, Eye, EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  useReminders,
  MeditationReminder,
  NotificationHistoryEntry,
  formatTimeForDisplay,
  getTimeUntilNext
} from '@/hooks/useReminders'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const SNOOZE_OPTIONS = [
  { value: 5, label: '5 minutos' },
  { value: 10, label: '10 minutos' },
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' }
]

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

// Calendar View Component - extracted to avoid creating during render
interface CalendarViewProps {
  currentWeekStart: Date
  reminders: MeditationReminder[]
  navigateWeek: (direction: 'prev' | 'next') => void
}

function CalendarView({ currentWeekStart, reminders, navigateWeek }: CalendarViewProps) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart)
    date.setDate(date.getDate() + i)
    const dayReminders = reminders.filter(r =>
      r.days.includes(date.getDay()) && r.enabled
    )
    const isToday = date.toDateString() === new Date().toDateString()

    days.push(
      <div
        key={i}
        className={cn(
          "flex-1 min-w-[80px] p-2 rounded-lg border transition-all",
          isToday
            ? "bg-indigo-900/40 border-indigo-500/50"
            : "bg-mystica-dark-200/50 border-gray-700"
        )}
      >
        <div className="text-center mb-2">
          <p className={cn(
            "text-xs",
            isToday ? "text-indigo-300 font-bold" : "text-gray-400"
          )}>
            {DAYS[date.getDay()]}
          </p>
          <p className={cn(
            "text-lg font-bold",
            isToday ? "text-white" : "text-gray-300"
          )}>
            {date.getDate()}
          </p>
        </div>
        <div className="space-y-1">
          {dayReminders.map(r => (
            <div
              key={r.id}
              className="text-xs p-1 rounded bg-indigo-600/30 text-indigo-200 truncate"
              title={`${r.time} - ${r.message}`}
            >
              {r.time}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateWeek('prev')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <p className="text-white font-medium">
          {currentWeekStart.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateWeek('next')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days}
      </div>
    </div>
  )
}

// History View Component - extracted
interface HistoryViewProps {
  history: NotificationHistoryEntry[]
  onClear: () => void
}

function HistoryView({ history, onClear }: HistoryViewProps) {
  const recentHistory = history.slice(0, 20)

  if (recentHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay notificaciones en el historial</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium">Historial de notificaciones</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-red-400"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Limpiar
        </Button>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {recentHistory.map((entry) => (
          <div
            key={entry.id}
            className="p-3 bg-mystica-dark-200/50 rounded-lg border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-sm">{entry.title}</p>
                <p className="text-gray-400 text-xs">{entry.body}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(entry.sentAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {entry.wasSnoozed && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] mt-1">
                    Pospuesto
                  </Badge>
                )}
                {entry.actionTaken && (
                  <Badge className={cn(
                    "text-[10px] mt-1",
                    entry.actionTaken === 'meditate' 
                      ? "bg-green-500/20 text-green-400"
                      : entry.actionTaken === 'snooze'
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  )}>
                    {entry.actionTaken === 'meditate' 
                      ? 'Medito' 
                      : entry.actionTaken === 'snooze' 
                      ? 'Pospuesto' 
                      : 'Descartado'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Stats View Component - extracted
interface StatsViewProps {
  complianceStats: {
    total: number
    meditated: number
    snoozed: number
    dismissed: number
    complianceRate: number
  }
  weeklyStats: Array<{ date: string; sent: number; actioned: number }>
}

function StatsView({ complianceStats, weeklyStats }: StatsViewProps) {
  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-mystica-dark-200/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{complianceStats.total}</p>
            <p className="text-xs text-gray-400">Total enviadas</p>
          </CardContent>
        </Card>
        <Card className="bg-green-900/30 border-green-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{complianceStats.meditated}</p>
            <p className="text-xs text-gray-400">Meditaciones</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900/30 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{complianceStats.snoozed}</p>
            <p className="text-xs text-gray-400">Pospuestos</p>
          </CardContent>
        </Card>
        <Card className="bg-indigo-900/30 border-indigo-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-indigo-400">
              {Math.round(complianceStats.complianceRate)}%
            </p>
            <p className="text-xs text-gray-400">Cumplimiento</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="bg-mystica-dark-200/50 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Ultimos 7 dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-24">
            {weeklyStats.map((day, i) => {
              const maxSent = Math.max(...weeklyStats.map(d => d.sent), 1)
              const height = (day.sent / maxSent) * 100
              const actionedHeight = day.sent > 0 ? (day.actioned / day.sent) * height : 0
              const dayName = new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })

              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-20">
                    <div
                      className="w-full bg-indigo-500/30 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="w-full bg-green-500/50 rounded-t"
                        style={{ height: `${actionedHeight}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{dayName}</p>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-500/30 rounded" />
              <span className="text-gray-400">Enviadas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500/50 rounded" />
              <span className="text-gray-400">Completadas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Reminder Item Component - extracted
interface ReminderItemProps {
  reminder: MeditationReminder
  onToggle: (id: string) => void
  onEdit: (reminder: MeditationReminder) => void
  onDelete: (id: string) => void
  onSnooze: (id: string, minutes: number) => void
}

function ReminderItem({ reminder, onToggle, onEdit, onDelete, onSnooze }: ReminderItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="p-4 bg-mystica-dark-200/50 rounded-lg border border-gray-700 hover:border-indigo-500/30 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            reminder.enabled ? "bg-indigo-500/20" : "bg-gray-800"
          )}>
            <Clock className={cn(
              "w-5 h-5",
              reminder.enabled ? "text-indigo-400" : "text-gray-500"
            )} />
          </div>
          <div>
            <p className={cn(
              "text-lg font-bold",
              reminder.enabled ? "text-white" : "text-gray-500"
            )}>
              {formatTimeForDisplay(reminder.time)}
            </p>
            <p className="text-xs text-gray-400">
              {reminder.days.map(d => DAYS[d]).join(', ')}
            </p>
            {reminder.message && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {reminder.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={reminder.enabled}
            onCheckedChange={() => onToggle(reminder.id)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(reminder)}
            className="text-gray-400 hover:text-white"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(reminder.id)}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {reminder.enabled && (
        <div className="mt-3 flex items-center justify-between text-xs">
          <p className="text-indigo-400">
            Proxima: {getTimeUntilNext(reminder.time, reminder.days)}
          </p>
          <Select
            value=""
            onValueChange={(v) => onSnooze(reminder.id, parseInt(v))}
          >
            <SelectTrigger className="w-[120px] h-7 bg-mystica-dark-100 border-gray-700 text-xs">
              <SelectValue placeholder="Posponer..." />
            </SelectTrigger>
            <SelectContent className="bg-mystica-dark-200 border-gray-700">
              {SNOOZE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value.toString()}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </motion.div>
  )
}

interface ReminderPanelProps {
  onOpenChange?: (open: boolean) => void
}

export function ReminderPanel({ onOpenChange }: ReminderPanelProps) {
  const reminders = useReminders()
  const [activeView, setActiveView] = useState<'list' | 'calendar' | 'history' | 'stats'>('list')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingReminder, setEditingReminder] = useState<MeditationReminder | null>(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()))

  // New reminder form state
  const [newTime, setNewTime] = useState('08:00')
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [newMessage, setNewMessage] = useState('Es hora de tu practica diaria de meditacion')

  // Get notification settings
  const settings = reminders.getNotificationSettings()
  const history = reminders.getNotificationHistory()
  const complianceStats = reminders.getComplianceStats()
  const weeklyStats = reminders.getWeeklyStats()

  const handleAddReminder = () => {
    reminders.addReminder({
      time: newTime,
      days: newDays,
      enabled: true,
      message: newMessage
    })
    setShowAddDialog(false)
    resetForm()
    toast.success('Recordatorio creado')
  }

  const handleUpdateReminder = () => {
    if (editingReminder) {
      reminders.updateReminder(editingReminder.id, {
        time: newTime,
        days: newDays,
        message: newMessage
      })
      setEditingReminder(null)
      resetForm()
      toast.success('Recordatorio actualizado')
    }
  }

  const handleDeleteReminder = (id: string) => {
    reminders.deleteReminder(id)
    toast.success('Recordatorio eliminado')
  }

  const handleSnooze = async (reminderId: string, minutes: number) => {
    await reminders.snoozeReminder(reminderId, minutes)
    toast.success(`Recordatorio pospuesto ${minutes} minutos`)
  }

  const handleToggleNotifications = async () => {
    if (!reminders.notificationsEnabled) {
      const result = await reminders.requestPersistentPermission()
      if (result.granted) {
        toast.success(result.persistent 
          ? 'Notificaciones habilitadas con persistencia' 
          : 'Notificaciones habilitadas')
      } else {
        toast.error('No se pudieron habilitar las notificaciones')
      }
    } else {
      reminders.disableNotifications()
      toast.info('Notificaciones deshabilitadas')
    }
  }

  const handlePreviewNotification = async () => {
    await reminders.sendPreviewNotification()
    toast.success('Notificacion de prueba enviada')
  }

  const resetForm = () => {
    setNewTime('08:00')
    setNewDays([1, 2, 3, 4, 5])
    setNewMessage('Es hora de tu practica diaria de meditacion')
  }

  const openEditDialog = (reminder: MeditationReminder) => {
    setEditingReminder(reminder)
    setNewTime(reminder.time)
    setNewDays(reminder.days)
    setNewMessage(reminder.message)
  }

  const toggleDay = (day: number) => {
    setNewDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newStart)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {reminders.notificationsEnabled ? (
            <Bell className="w-5 h-5 text-indigo-400" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="text-lg font-bold text-white">Recordatorios</h3>
          <Badge className={cn(
            reminders.notificationsEnabled
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-500/20 text-gray-400"
          )}>
            {reminders.notificationsEnabled ? 'Activos' : 'Inactivos'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleNotifications}
            className={cn(
              reminders.notificationsEnabled ? "text-green-400" : "text-gray-400"
            )}
          >
            {reminders.notificationsEnabled ? (
              <Bell className="w-4 h-4" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddDialog(true)}
            className="border-indigo-500/30 text-indigo-400"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'list', icon: Bell, label: 'Lista' },
          { id: 'calendar', icon: Calendar, label: 'Calendario' },
          { id: 'history', icon: History, label: 'Historial' },
          { id: 'stats', icon: BarChart3, label: 'Estadisticas' }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeView === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView(tab.id as any)}
            className={cn(
              activeView === tab.id
                ? "bg-indigo-600 text-white"
                : "text-gray-400"
            )}
          >
            <tab.icon className="w-4 h-4 mr-1" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeView === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {reminders.reminders.length === 0 ? (
              <Card className="bg-mystica-dark-200/50 border-gray-700">
                <CardContent className="py-8 text-center">
                  <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400 mb-4">No tienes recordatorios configurados</p>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear primer recordatorio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              reminders.reminders.map(reminder => (
                <ReminderItem 
                  key={reminder.id} 
                  reminder={reminder}
                  onToggle={(id) => reminders.toggleReminder(id)}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteReminder}
                  onSnooze={handleSnooze}
                />
              ))
            )}
          </motion.div>
        )}

        {activeView === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-mystica-dark-200/50 border-gray-700">
              <CardContent className="p-4">
                <CalendarView 
                  currentWeekStart={currentWeekStart}
                  reminders={reminders.reminders}
                  navigateWeek={navigateWeek}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeView === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-mystica-dark-200/50 border-gray-700">
              <CardContent className="p-4">
                <HistoryView 
                  history={history}
                  onClear={() => reminders.clearNotificationHistory()}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeView === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StatsView 
              complianceStats={complianceStats}
              weeklyStats={weeklyStats}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Settings */}
      <Card className="bg-mystica-dark-200/50 border-gray-700">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-3">Configuracion rapida</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-300">Sonido de notificacion</span>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => 
                  reminders.updateNotificationSettings({ soundEnabled: checked })
                }
              />
            </div>

            <Separator className="bg-gray-700" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MoonIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-gray-300">No molestar</span>
              </div>
              <Switch
                checked={settings.doNotDisturb.enabled}
                onCheckedChange={(checked) =>
                  reminders.setDoNotDisturb({ enabled: checked })
                }
              />
            </div>

            {settings.doNotDisturb.enabled && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Desde</label>
                  <Input
                    type="time"
                    value={settings.doNotDisturb.startTime}
                    onChange={(e) =>
                      reminders.setDoNotDisturb({ startTime: e.target.value })
                    }
                    className="bg-mystica-dark-100 border-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400">Hasta</label>
                  <Input
                    type="time"
                    value={settings.doNotDisturb.endTime}
                    onChange={(e) =>
                      reminders.setDoNotDisturb({ endTime: e.target.value })
                    }
                    className="bg-mystica-dark-100 border-gray-700"
                  />
                </div>
              </div>
            )}

            <Separator className="bg-gray-700" />

            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewNotification}
              className="w-full border-indigo-500/30 text-indigo-400"
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista previa de notificacion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || !!editingReminder} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setEditingReminder(null)
          resetForm()
        }
      }}>
        <DialogContent className="bg-mystica-dark-100 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingReminder ? 'Editar recordatorio' : 'Nuevo recordatorio'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Time */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Hora</label>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-mystica-dark-200 border-gray-700"
              />
            </div>

            {/* Days */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Dias</label>
              <div className="flex gap-2">
                {DAYS.map((day, i) => (
                  <Button
                    key={i}
                    variant={newDays.includes(i) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "flex-1",
                      newDays.includes(i)
                        ? "bg-indigo-600 text-white"
                        : "border-gray-700 text-gray-400"
                    )}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Mensaje</label>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Es hora de meditar..."
                className="bg-mystica-dark-200 border-gray-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddDialog(false)
                setEditingReminder(null)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={editingReminder ? handleUpdateReminder : handleAddReminder}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              {editingReminder ? 'Guardar cambios' : 'Crear recordatorio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
