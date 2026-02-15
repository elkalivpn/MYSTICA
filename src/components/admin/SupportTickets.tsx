'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Filter, ChevronLeft, ChevronRight, MessageSquare,
  AlertCircle, Clock, CheckCircle, X, Send, User,
  Calendar, MoreHorizontal
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

interface TicketResponse {
  id: string
  message: string
  adminId: string
  adminName: string
  createdAt: string
}

interface SupportTicket {
  id: string
  userId: string
  user: {
    id: string
    email: string
    name: string | null
  }
  subject: string
  message: string
  status: string
  priority: string
  category: string
  assignedTo: string | null
  responses: TicketResponse[]
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
  closedAt: Date | null
}

const RESPONSE_TEMPLATES = [
  { name: 'Saludo inicial', text: 'Hola! Gracias por contactarnos. Estamos revisando tu caso y te responderemos a la brevedad.' },
  { name: 'Solicitar mas info', text: 'Gracias por la informacion. Podrias proporcionarnos mas detalles sobre el problema? Por ejemplo, capturas de pantalla o pasos para reproducirlo.' },
  { name: 'Problema resuelto', text: 'Hemos revisado tu caso y el problema ha sido resuelto. Por favor, confirma que todo funciona correctamente. Si tienes mas preguntas, no dudes en contactarnos.' },
  { name: 'Escalado', text: 'Tu caso ha sido escalado a nuestro equipo tecnico. Te mantendremos informado sobre el progreso.' },
  { name: 'Cierre', text: 'Gracias por tu paciencia. Damos por cerrado este ticket. Si necesitas mas ayuda, puedes abrir uno nuevo.' }
]

export function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Dialogs
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [sending, setSending] = useState(false)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        status: statusFilter,
        priority: priorityFilter
      })

      const response = await fetch(`/api/admin/support?${params}`)
      const data = await response.json()

      if (response.ok) {
        setTickets(data.tickets)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Error al cargar tickets')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, priorityFilter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const openTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setShowTicketDialog(true)
  }

  const sendResponse = async () => {
    if (!selectedTicket || !responseText.trim()) return

    setSending(true)
    try {
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          action: 'respond',
          data: {
            message: responseText,
            adminId: 'admin',
            adminName: 'Admin'
          }
        })
      })

      if (response.ok) {
        toast.success('Respuesta enviada')
        setResponseText('')
        fetchTickets()
        // Update selected ticket
        const updated = await fetch(`/api/admin/support?search=${selectedTicket.id}`)
        if (updated.ok) {
          const data = await updated.json()
          if (data.tickets.length > 0) {
            setSelectedTicket(data.tickets[0])
          }
        }
      } else {
        toast.error('Error al enviar respuesta')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar respuesta')
    } finally {
      setSending(false)
    }
  }

  const updateStatus = async (status: string) => {
    if (!selectedTicket) return

    try {
      const response = await fetch('/api/admin/support', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          action: 'update_status',
          data: { status }
        })
      })

      if (response.ok) {
        toast.success('Estado actualizado')
        fetchTickets()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      open: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', icon: <AlertCircle className="w-3 h-3" /> },
      in_progress: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', icon: <Clock className="w-3 h-3" /> },
      resolved: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', icon: <CheckCircle className="w-3 h-3" /> },
      closed: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-200', icon: <X className="w-3 h-3" /> }
    }

    const style = styles[status] || styles.open
    return (
      <Badge className={`${style.bg} ${style.text}`}>
        {style.icon}
        <span className="ml-1">{status === 'in_progress' ? 'En progreso' : status === 'open' ? 'Abierto' : status === 'resolved' ? 'Resuelto' : 'Cerrado'}</span>
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return (
      <Badge className={styles[priority] || styles.normal}>
        {priority === 'low' ? 'Baja' : priority === 'normal' ? 'Normal' : priority === 'high' ? 'Alta' : 'Urgente'}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-blue-500" onClick={() => setStatusFilter('open')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Abiertos</p>
                <p className="text-2xl font-bold">{stats['open'] || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-yellow-500" onClick={() => setStatusFilter('in_progress')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold">{stats['in_progress'] || 0}</p>
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
                <p className="text-2xl font-bold">{stats['resolved'] || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-gray-500" onClick={() => setStatusFilter('closed')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cerrados</p>
                <p className="text-2xl font-bold">{stats['closed'] || 0}</p>
              </div>
              <X className="w-8 h-8 text-gray-500" />
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
                placeholder="Buscar tickets..."
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
                <SelectItem value="open">Abierto</SelectItem>
                <SelectItem value="in_progress">En progreso</SelectItem>
                <SelectItem value="resolved">Resuelto</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets de Soporte ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asunto</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Cargando...</TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron tickets
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openTicket(ticket)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {ticket.message.slice(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.user.name || 'Sin nombre'}</p>
                        <p className="text-sm text-muted-foreground">{ticket.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openTicket(ticket) }}>
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
              Mostrando {tickets.length} de {total} tickets
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

      {/* Ticket Detail Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedTicket?.subject}</DialogTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Cambiar estado
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => updateStatus('in_progress')}>En progreso</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus('resolved')}>Resuelto</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus('closed')}>Cerrado</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DialogDescription>
              Ticket de {selectedTicket?.user.email}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            {selectedTicket && getStatusBadge(selectedTicket.status)}
            {selectedTicket && getPriorityBadge(selectedTicket.priority)}
            <Badge variant="outline">{selectedTicket?.category}</Badge>
          </div>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {/* Original message */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">{selectedTicket?.user.name || 'Usuario'}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedTicket && format(new Date(selectedTicket.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                        </p>
                      </div>
                      <p className="text-sm">{selectedTicket?.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Responses */}
              {selectedTicket?.responses.map((response) => (
                <Card key={response.id} className="border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-purple-600 dark:text-purple-300">{response.adminName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(response.createdAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </p>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Response area */}
          <div className="border-t pt-4 mt-4">
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {RESPONSE_TEMPLATES.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setResponseText(template.text)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
                  Cerrar
                </Button>
                <Button onClick={sendResponse} disabled={!responseText.trim() || sending}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar respuesta
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
