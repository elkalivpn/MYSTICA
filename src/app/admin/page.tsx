'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, Shield, Users, Eye, TrendingUp, DollarSign, Settings, RefreshCw,
  Bug, Headphones, CreditCard, BarChart3, FileText, Bell, Database,
  UserCheck, UserX, Crown, AlertTriangle, CheckCircle, Clock, MessageSquare,
  ExternalLink, ChevronRight, Search, Filter, Download, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { UserManagement } from '@/components/admin/UserManagement'
import { SubscriptionManager } from '@/components/admin/SubscriptionManager'
import { SupportTickets } from '@/components/admin/SupportTickets'
import { BugReports } from '@/components/admin/BugReports'

// Stats data
const stats = {
  totalUsers: 12453,
  activeToday: 892,
  readingsToday: 2456,
  premiumUsers: 1234,
  revenue: 15678.90,
  growth: 12.5,
  openBugs: 7,
  pendingTickets: 12,
  monthlySignups: 456,
  churnRate: 2.3
}

// Recent activity
const recentActivity = [
  { id: 1, type: 'user', action: 'Nuevo usuario registrado', user: 'maria@email.com', time: 'Hace 5 min' },
  { id: 2, type: 'premium', action: 'Nueva suscripcion Premium', user: 'carlos@email.com', time: 'Hace 12 min' },
  { id: 3, type: 'bug', action: 'Bug reportado', user: 'anonimo', time: 'Hace 23 min' },
  { id: 4, type: 'ticket', action: 'Ticket de soporte abierto', user: 'lucia@email.com', time: 'Hace 45 min' },
  { id: 5, type: 'refund', action: 'Reembolso solicitado', user: 'pedro@email.com', time: 'Hace 1 hora' },
]

// Alerts
const alerts = [
  { id: 1, type: 'critical', message: 'Servidor respondiendo lentamente (2.3s)', time: 'Hace 10 min' },
  { id: 2, type: 'warning', message: 'Rate limit alcanzado en API de tarot', time: 'Hace 30 min' },
  { id: 3, type: 'info', message: 'Backup completado exitosamente', time: 'Hace 2 horas' },
]

export default function AdminPage() {
  const { isAdmin, loginAsAdmin, loginAsPremium, loginAsFree, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-red-900/10 to-mystica-dark-100 flex items-center justify-center">
        <Card className="bg-mystica-dark-100/50 border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
            <p className="text-gray-400 mb-4">Solo administradores pueden acceder a esta pagina.</p>
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-14 z-40 bg-slate-800/95 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-400" />
                <h1 className="text-xl font-bold text-white">Panel de Control</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Bell className="w-4 h-4 mr-2" />
                {alerts.filter(a => a.type === 'critical').length}
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-6 bg-slate-800 h-auto py-2">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-700 text-slate-300">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700 text-slate-300">
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-slate-700 text-slate-300">
              <CreditCard className="w-4 h-4 mr-2" />
              Suscripciones
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-slate-700 text-slate-300">
              <Headphones className="w-4 h-4 mr-2" />
              Soporte
            </TabsTrigger>
            <TabsTrigger value="bugs" className="data-[state=active]:bg-slate-700 text-slate-300">
              <Bug className="w-4 h-4 mr-2" />
              Bugs
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700 text-slate-300">
              <Settings className="w-4 h-4 mr-2" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <StatCard label="Usuarios Totales" value={stats.totalUsers.toLocaleString()} icon={Users} color="blue" />
              <StatCard label="Activos Hoy" value={stats.activeToday.toLocaleString()} icon={Eye} color="green" />
              <StatCard label="Lecturas Hoy" value={stats.readingsToday.toLocaleString()} icon={TrendingUp} color="purple" />
              <StatCard label="Premium" value={stats.premiumUsers.toLocaleString()} icon={Crown} color="yellow" />
              <StatCard label="Bugs Abiertos" value={stats.openBugs.toString()} icon={Bug} color="red" />
              <StatCard label="Tickets Pendientes" value={stats.pendingTickets.toString()} icon={MessageSquare} color="orange" />
            </div>

            {/* Revenue & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-400">Ingresos Este Mes</p>
                    <Badge className="bg-emerald-500/20 text-emerald-300">+{stats.growth}%</Badge>
                  </div>
                  <p className="text-4xl font-bold text-emerald-400">{stats.revenue.toLocaleString()} EUR</p>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <p className="text-slate-400">Signups</p>
                      <p className="text-white font-semibold">{stats.monthlySignups}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Conversion</p>
                      <p className="text-white font-semibold">3.2%</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Churn</p>
                      <p className="text-white font-semibold">{stats.churnRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Alertas del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={cn(
                        "flex items-start gap-3 p-3 rounded-lg",
                        alert.type === 'critical' && "bg-red-900/20 border border-red-500/20",
                        alert.type === 'warning' && "bg-amber-900/20 border border-amber-500/20",
                        alert.type === 'info' && "bg-blue-900/20 border border-blue-500/20"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          alert.type === 'critical' && "bg-red-400",
                          alert.type === 'warning' && "bg-amber-400",
                          alert.type === 'info' && "bg-blue-400"
                        )} />
                        <div className="flex-1">
                          <p className="text-white text-sm">{alert.message}</p>
                          <p className="text-slate-500 text-xs">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {activity.type === 'user' && <UserCheck className="w-4 h-4 text-blue-400" />}
                        {activity.type === 'premium' && <Crown className="w-4 h-4 text-yellow-400" />}
                        {activity.type === 'bug' && <Bug className="w-4 h-4 text-red-400" />}
                        {activity.type === 'ticket' && <MessageSquare className="w-4 h-4 text-orange-400" />}
                        {activity.type === 'refund' && <DollarSign className="w-4 h-4 text-red-400" />}
                        <div>
                          <p className="text-white text-sm">{activity.action}</p>
                          <p className="text-slate-500 text-xs">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demo Actions */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-sm">Acciones de Demo (Testing)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button onClick={loginAsAdmin} variant="destructive" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Modo Admin
                  </Button>
                  <Button onClick={loginAsPremium} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
                    <Crown className="w-4 h-4 mr-2" />
                    Modo Premium
                  </Button>
                  <Button onClick={loginAsFree} variant="outline" className="w-full border-slate-600">
                    <Users className="w-4 h-4 mr-2" />
                    Modo Free
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <SubscriptionManager />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <SupportTickets />
          </TabsContent>

          {/* Bugs Tab */}
          <TabsContent value="bugs">
            <BugReports />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Estado del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Base de datos</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300">Operativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">API Principal</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300">Operativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">Servicio TTS</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300">Operativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-300">CDN de Imagenes</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300">Operativo</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Enlaces Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="https://github.com/elkalivpn/MYSTICA" target="_blank" rel="noopener noreferrer" 
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <span className="text-white">Repositorio GitHub</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                  <a href="https://www.paypal.com/donate/?hosted_button_id=JRTW5XP38JDUC" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <span className="text-white">PayPal Donaciones</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                  <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <span className="text-white">Vercel Dashboard</span>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Usuario Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.name}</p>
                      <p className="text-slate-400 text-sm">{user?.email}</p>
                    </div>
                    <Badge className="ml-auto bg-red-500/20 text-red-300">Admin</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
          <Icon className={cn("w-5 h-5", `text-${color}-400`)} />
        </div>
      </CardContent>
    </Card>
  )
}
