'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, Filter, MoreHorizontal, UserX, UserCheck, Shield, 
  ChevronLeft, ChevronRight, Eye, Ban, Crown, User, Trash2,
  Mail, Calendar, Activity, X, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  banned: boolean
  bannedAt: Date | null
  bannedReason: string | null
  createdAt: Date
  subscription: {
    plan: string
    status: string
    endDate: Date | null
  } | null
  progress: {
    level: number
    xp: number
    streak: number
    lastActive: Date
  } | null
  stats: {
    meditations: number
    readings: number
    tickets: number
  }
}

interface UserManagementProps {
  onRefresh?: () => void
}

export function UserManagement({ onRefresh }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [newRole, setNewRole] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        role: roleFilter,
        status: statusFilter
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleAction = async (action: string, userId: string, data?: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, data })
      })

      if (response.ok) {
        toast.success('Accion completada')
        fetchUsers()
        onRefresh?.()
      } else {
        toast.error('Error al realizar la accion')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al realizar la accion')
    }
  }

  const handleBan = async () => {
    if (!selectedUser) return
    await handleAction('ban', selectedUser.id, { reason: banReason })
    setShowBanDialog(false)
    setBanReason('')
    setSelectedUser(null)
  }

  const handleUnban = async (userId: string) => {
    await handleAction('unban', userId)
  }

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return
    await handleAction('change_role', selectedUser.id, { role: newRole })
    setShowRoleDialog(false)
    setNewRole('')
    setSelectedUser(null)
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      premium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      user: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
    return (
      <Badge className={styles[role] || styles.user}>
        {role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
        {role === 'premium' && <Crown className="w-3 h-3 mr-1" />}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    )
  }

  const getStatusBadge = (user: User) => {
    if (user.banned) {
      return <Badge variant="destructive">Baneado</Badge>
    }
    return <Badge variant="outline" className="text-green-600 border-green-600">Activo</Badge>
  }

  return (
    <div className="space-y-6">
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
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="banned">Baneados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usuarios ({total})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Suscripcion</TableHead>
                <TableHead>Actividad</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name || 'Sin nombre'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>
                      {user.subscription ? (
                        <div>
                          <Badge variant="outline">{user.subscription.plan}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.subscription.status}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin plan</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span>{user.stats.meditations} med</span>
                        <span>|</span>
                        <span>{user.stats.readings} lect.</span>
                      </div>
                      {user.progress && (
                        <p className="text-xs text-muted-foreground">
                          Nivel {user.progress.level} - Racha {user.progress.streak}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {formatDistanceToNow(new Date(user.createdAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowDetails(true) }}>
                            <Eye className="w-4 h-4 mr-2" /> Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setNewRole(user.role); setShowRoleDialog(true) }}>
                            <Shield className="w-4 h-4 mr-2" /> Cambiar rol
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.banned ? (
                            <DropdownMenuItem onClick={() => handleUnban(user.id)} className="text-green-600">
                              <UserCheck className="w-4 h-4 mr-2" /> Desbanear
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowBanDialog(true) }} className="text-red-600">
                              <Ban className="w-4 h-4 mr-2" /> Banear
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {users.length} de {total} usuarios
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
              <span className="text-sm">
                Pagina {page} de {totalPages}
              </span>
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

      {/* User Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <User className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name || 'Sin nombre'}</h3>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedUser.progress?.level || 1}</p>
                    <p className="text-sm text-muted-foreground">Nivel</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedUser.progress?.xp || 0}</p>
                    <p className="text-sm text-muted-foreground">XP</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedUser.progress?.streak || 0}</p>
                    <p className="text-sm text-muted-foreground">Racha</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedUser.stats.meditations}</p>
                    <p className="text-sm text-muted-foreground">Meditaciones</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Informacion</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Rol</p>
                    <p>{getRoleBadge(selectedUser.role)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estado</p>
                    <p>{getStatusBadge(selectedUser)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p>{selectedUser.subscription?.plan || 'Sin plan'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Registro</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDistanceToNow(new Date(selectedUser.createdAt), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {selectedUser.banned && selectedUser.bannedReason && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Razon del baneo: {selectedUser.bannedReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Banear Usuario</DialogTitle>
            <DialogDescription>
              Estas a punto de banear a {selectedUser?.email}. Esta accion impedira que el usuario acceda a su cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Razon del baneo</Label>
              <Textarea
                id="reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Explica la razon del baneo..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBan}>
              <Ban className="w-4 h-4 mr-2" /> Banear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo rol para {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangeRole}>
              <Check className="w-4 h-4 mr-2" /> Cambiar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
