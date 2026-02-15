'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Filter, ChevronLeft, ChevronRight, Download,
  Crown, AlertCircle, CheckCircle, XCircle, RefreshCw,
  DollarSign, TrendingUp, Users, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Subscription {
  id: string
  userId: string
  user: {
    id: string
    email: string
    name: string | null
  }
  plan: string
  status: string
  startDate: Date
  endDate: Date | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripePriceId: string | null
  stripeCurrentPeriodEnd: Date | null
  stripeCancelAtPeriodEnd: boolean
  createdAt: Date
}

interface SubscriptionStats {
  activeCount: number
  cancelledCount: number
  monthlyActiveRevenue: number
  planDistribution: Record<string, number>
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Dialogs
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<'cancel' | 'reactivate' | 'refund'>('cancel')

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        status: statusFilter,
        plan: planFilter
      })

      const response = await fetch(`/api/admin/subscriptions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSubscriptions(data.subscriptions)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast.error('Error al cargar suscripciones')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, planFilter])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const handleAction = async () => {
    if (!selectedSub) return

    try {
      const response = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: selectedSub.id,
          action: actionType
        })
      })

      if (response.ok) {
        toast.success('Accion completada')
        fetchSubscriptions()
      } else {
        toast.error('Error al realizar la accion')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al realizar la accion')
    } finally {
      setShowActionDialog(false)
      setSelectedSub(null)
    }
  }

  const exportCSV = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions?format=csv')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `suscripciones-${format(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Exportacion completada')
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error('Error al exportar')
    }
  }

  const getStatusBadge = (status: string, cancelAtEnd: boolean) => {
    if (cancelAtEnd && status === 'active') {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Cancela al final</Badge>
    }

    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: <XCircle className="w-3 h-3" /> },
      expired: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-200', icon: <AlertCircle className="w-3 h-3" /> }
    }

    const style = styles[status] || styles.expired
    return (
      <Badge className={`${style.bg} ${style.text}`}>
        {style.icon}
        <span className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, string> = {
      free: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      monthly: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      yearly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      lifetime: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
    return (
      <Badge className={styles[plan] || styles.free}>
        {plan === 'monthly' ? 'Mensual' : plan === 'yearly' ? 'Anual' : plan === 'lifetime' ? 'Vitalicio' : 'Free'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suscripciones Activas</p>
                <p className="text-2xl font-bold">{stats?.activeCount || 0}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold">{stats?.cancelledCount || 0}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                <p className="text-2xl font-bold">{stats?.monthlyActiveRevenue.toFixed(2) || '0.00'} EUR</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Conversion</p>
                <p className="text-2xl font-bold">12.5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por email o nombre..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={(v) => { setPlanFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
                <SelectItem value="lifetime">Vitalicio</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" /> Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suscripciones ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Stripe ID</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Cargando...</TableCell>
                </TableRow>
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron suscripciones
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{sub.user.name || 'Sin nombre'}</p>
                        <p className="text-sm text-muted-foreground">{sub.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(sub.plan)}</TableCell>
                    <TableCell>{getStatusBadge(sub.status, sub.stripeCancelAtPeriodEnd)}</TableCell>
                    <TableCell>
                      {format(new Date(sub.startDate), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      {sub.endDate 
                        ? format(new Date(sub.endDate), 'dd/MM/yyyy', { locale: es })
                        : sub.stripeCurrentPeriodEnd 
                          ? format(new Date(sub.stripeCurrentPeriodEnd), 'dd/MM/yyyy', { locale: es })
                          : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {sub.stripeSubscriptionId ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {sub.stripeSubscriptionId.slice(0, 12)}...
                        </code>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSub(sub)
                              setActionType('cancel')
                              setShowActionDialog(true)
                            }}
                          >
                            Cancelar
                          </Button>
                        )}
                        {sub.status === 'cancelled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedSub(sub)
                              setActionType('reactivate')
                              setShowActionDialog(true)
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" /> Reactivar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {subscriptions.length} de {total} suscripciones
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Pagina {page} de {totalPages}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'cancel' && 'Cancelar Suscripcion'}
              {actionType === 'reactivate' && 'Reactivar Suscripcion'}
              {actionType === 'refund' && 'Procesar Reembolso'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'cancel' && 'Esta accion cancelara la suscripcion al final del periodo actual.'}
              {actionType === 'reactivate' && 'Esta accion reactivara la suscripcion cancelada.'}
              {actionType === 'refund' && 'Esta accion procesara un reembolso a traves de Stripe.'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm"><strong>Usuario:</strong> {selectedSub?.user.email}</p>
            <p className="text-sm"><strong>Plan:</strong> {selectedSub?.plan}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancelar
            </Button>
            <Button 
              variant={actionType === 'cancel' ? 'destructive' : 'default'}
              onClick={handleAction}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
