'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Users, Eye, TrendingUp, DollarSign, Settings, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function AdminPage() {
  const { isAdmin, loginAsAdmin, loginAsPremium, loginAsFree, user } = useAuth()

  // Mock stats
  const stats = {
    totalUsers: 12453,
    activeToday: 892,
    readingsToday: 2456,
    premiumUsers: 1234,
    revenue: 15678.90,
    growth: 12.5
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-red-900/10 to-mystica-dark-100 flex items-center justify-center">
        <Card className="bg-mystica-dark-100/50 border-red-500/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
            <p className="text-gray-400 mb-4">Solo administradores pueden acceder a esta página.</p>
            <Link href="/">
              <Button>Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-red-900/5 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
              <div>
                <h1 className="text-2xl font-bold text-red-400">Panel de Administración</h1>
                <p className="text-sm text-gray-400">Control total de Mystica</p>
              </div>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-red-500/50 text-red-300">
              <RefreshCw className="w-4 h-4 mr-2" />Actualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Usuarios Totales', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue' },
            { label: 'Activos Hoy', value: stats.activeToday.toLocaleString(), icon: Eye, color: 'green' },
            { label: 'Lecturas Hoy', value: stats.readingsToday.toLocaleString(), icon: TrendingUp, color: 'purple' },
            { label: 'Usuarios Premium', value: stats.premiumUsers.toLocaleString(), icon: DollarSign, color: 'yellow' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-mystica-dark-100/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <stat.icon className={cn("w-8 h-8", `text-${stat.color}-400`)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Revenue Card */}
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border-green-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ingresos Este Mes</p>
                <p className="text-3xl font-bold text-green-400">€{stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-300">+{stats.growth}% vs mes anterior</p>
              </div>
              <DollarSign className="w-16 h-16 text-green-400/30" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas (Demo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-4">Iniciar como Admin</p>
              <Button onClick={loginAsAdmin} variant="destructive" className="w-full">Activar</Button>
            </CardContent>
          </Card>
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-4">Iniciar como Premium</p>
              <Button onClick={loginAsPremium} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500">Activar</Button>
            </CardContent>
          </Card>
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium mb-4">Iniciar como Free</p>
              <Button onClick={loginAsFree} variant="outline" className="w-full">Activar</Button>
            </CardContent>
          </Card>
        </div>

        {/* Current User */}
        <Card className="bg-mystica-dark-100/50 border-gray-700">
          <CardHeader><CardTitle className="text-white">Usuario Actual</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mystica-purple-500 to-mystica-purple-700 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <p className="text-xs text-mystica-purple-300">Rol: {user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
