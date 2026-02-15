'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Filter, ChevronLeft, ChevronRight, Bug,
  AlertTriangle, AlertCircle, CheckCircle, X, Clock,
  User, Calendar, MessageSquare, MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

interface BugComment {
  id: string
  message: string
  authorId: string
  authorName: string
  createdAt: string
}

interface BugReport {
  id: string
  userId: string
  user: {
    id: string
    email: string
    name: string | null
  }
  title: string
  description: string
  status: string
  priority: string
  category: string
  device: string | null
  os: string | null
  browser: string | null
  version: string | null
  assignedTo: string | null
  comments: BugComment[]
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
}

export function BugReports() {
  const [bugs, setBugs] = useState<BugReport[]>([])
  const [stats, setStats] = useState<{ byStatus: Record<string, number>; byPriority: Record<string, number> }>({ byStatus: {}, byPriority: {} })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Dialogs
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null)
  const [showBugDialog, setShowBugDialog] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [sending, setSending] = useState(false)

  const fetchBugs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter
      })

      const response = await fetch(`/api/admin/bugs?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBugs(data.bugs)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching bugs:', error)
      toast.error('Error al cargar bugs')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, priorityFilter, categoryFilter])

  useEffect(() => {
    fetchBugs()
  }, [fetchBugs])

  const openBug = (bug: BugReport) => {
    setSelectedBug(bug)
    setShowBugDialog(true)
  }

  const addComment = async () => {
    if (!selectedBug || !commentText.trim()) return

    setSending(true)
    try {
      const response = await fetch('/api/admin/bugs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugId: selectedBug.id,
          action: 'add_comment',
          data: {
            message: commentText,
            authorId: 'admin',
            authorName: 'Admin'
          }
        })
      })

      if (response.ok) {
        toast.success('Comentario agregado')
        setCommentText('')
        fetchBugs()
      } else {
        toast.error('Error al agregar comentario')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al agregar comentario')
    } finally {
      setSending(false)
    }
  }

  const updateStatus = async (status: string) => {
    if (!selectedBug) return

    try {
      const response = await fetch('/api/admin/bugs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugId: selectedBug.id,
          action: 'update_status',
          data: { status }
        })
      })

      if (response.ok) {
        toast.success('Estado actualizado')
        fetchBugs()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar')
    }
  }

  const updatePriority = async (priority: string) => {
    if (!selectedBug) return

    try {
      const response = await fetch('/api/admin/bugs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bugId: selectedBug.id,
          action: 'update_priority',
          data: { priority }
        })
      })

      if (response.ok) {
        toast.success('Prioridad actualizada')
        fetchBugs()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      new: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' },
      confirmed: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
      in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200' },
      resolved: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
      wont_fix: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-200' }
    }

    const style = styles[status] || styles.new
    const labels: Record<string, string> = {
      new: 'Nuevo',
      confirmed: 'Confirmado',
      in_progress: 'En progreso',
      resolved: 'Resuelto',
      wont_fix: 'No se arreglara'
    }
    return <Badge className={`${style.bg} ${style.text}`}>{labels[status]}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      critical: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-800 dark:text-red-200', icon: <AlertTriangle className="w-3 h-3" /> },
      high: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', icon: <AlertCircle className="w-3 h-3" /> },
      medium: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', icon: null },
      low: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-200', icon: null }
    }

    const style = styles[priority] || styles.medium
    const labels: Record<string, string> = {
      critical: 'Critica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    }
    return (
      <Badge className={`${style.bg} ${style.text}`}>
        {style.icon}
        <span className={style.icon ? 'ml-1' : ''}>{labels[priority]}</span>
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:border-blue-500" onClick={() => setStatusFilter('new')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nuevos</p>
                <p className="text-2xl font-bold">{stats.byStatus['new'] || 0}</p>
              </div>
              <Bug className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-yellow-500" onClick={() => setStatusFilter('in_progress')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En progreso</p>
                <p className="text-2xl font-bold">{stats.byStatus['in_progress'] || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-green-500" onClick={() => setStatusFilter('resolved')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resueltos</p>
                <p className="text-2xl font-bold">{stats.byStatus['resolved'] || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-red-500" onClick={() => setPriorityFilter('critical')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Criticos</p>
                <p className="text-2xl font-bold">{stats.byPriority['critical'] || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-orange-500" onClick={() => setPriorityFilter('high')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alta prioridad</p>
                <p className="text-2xl font-bold">{stats.byPriority['high'] || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
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
                placeholder="Buscar bugs..."
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
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="in_progress">En progreso</SelectItem>
                <SelectItem value="resolved">Resuelto</SelectItem>
                <SelectItem value="wont_fix">No se arreglara</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="critical">Critica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="ui">UI</SelectItem>
                <SelectItem value="functionality">Funcionalidad</SelectItem>
                <SelectItem value="performance">Rendimiento</SelectItem>
                <SelectItem value="security">Seguridad</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bugs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes de Bugs ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Reportado por</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Cargando...</TableCell>
                </TableRow>
              ) : bugs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron bugs
                  </TableCell>
                </TableRow>
              ) : (
                bugs.map((bug) => (
                  <TableRow
                    key={bug.id}
                    className={`cursor-pointer hover:bg-muted/50 ${bug.priority === 'critical' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}
                    onClick={() => openBug(bug)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {bug.priority === 'critical' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <div>
                          <p className="font-medium">{bug.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {bug.description.slice(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{bug.user.name || 'Anonimo'}</p>
                      <p className="text-sm text-muted-foreground">{bug.user.email}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(bug.status)}</TableCell>
                    <TableCell>{getPriorityBadge(bug.priority)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{bug.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {bug.device && <p>{bug.device}</p>}
                        {bug.os && <p className="text-muted-foreground">{bug.os}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true, locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openBug(bug) }}>
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {bugs.length} de {total} bugs
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Pagina {page} de {totalPages}</span>
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bug Detail Dialog */}
      <Dialog open={showBugDialog} onOpenChange={setShowBugDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {selectedBug?.priority === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {selectedBug?.title}
              </DialogTitle>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Estado</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => updateStatus('confirmed')}>Confirmado</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('in_progress')}>En progreso</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('resolved')}>Resuelto</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus('wont_fix')}>No se arreglara</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Prioridad</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => updatePriority('critical')}>Critica</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updatePriority('high')}>Alta</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updatePriority('medium')}>Media</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updatePriority('low')}>Baja</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            {selectedBug && getStatusBadge(selectedBug.status)}
            {selectedBug && getPriorityBadge(selectedBug.priority)}
            <Badge variant="outline">{selectedBug?.category}</Badge>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {/* Bug info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Descripcion</h4>
                  <p className="text-sm">{selectedBug?.description}</p>
                </CardContent>
              </Card>

              {/* Environment info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Entorno</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Dispositivo</p>
                      <p>{selectedBug?.device || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sistema Operativo</p>
                      <p>{selectedBug?.os || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Navegador</p>
                      <p>{selectedBug?.browser || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p>{selectedBug?.version || 'No especificado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reporter info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Reportado por</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedBug?.user.name || 'Anonimo'}</p>
                      <p className="text-sm text-muted-foreground">{selectedBug?.user.email}</p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      {selectedBug && format(new Date(selectedBug.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal comments */}
              {selectedBug?.comments && selectedBug.comments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Comentarios internos</h4>
                  {selectedBug.comments.map((comment) => (
                    <Card key={comment.id} className="mb-2">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{comment.authorName}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                              </p>
                            </div>
                            <p className="text-sm">{comment.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Comment area */}
          <div className="border-t pt-4 mt-4">
            <div className="space-y-3">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Agregar comentario interno..."
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowBugDialog(false)}>
                  Cerrar
                </Button>
                <Button onClick={addComment} disabled={!commentText.trim() || sending}>
                  Agregar comentario
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
