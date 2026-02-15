import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const category = searchParams.get('category') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { subject: { contains: search } },
        { message: { contains: search } }
      ]
    }

    const [tickets, total] = await Promise.all([
      db.supportTicket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      }),
      db.supportTicket.count({ where })
    ])

    // Stats
    const stats = await db.supportTicket.groupBy({
      by: ['status'],
      _count: true
    })

    return NextResponse.json({
      tickets: tickets.map(ticket => ({
        id: ticket.id,
        userId: ticket.userId,
        user: ticket.user,
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        assignedTo: ticket.assignedTo,
        responses: JSON.parse(ticket.responses),
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        resolvedAt: ticket.resolvedAt,
        closedAt: ticket.closedAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: stats.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>)
    })
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json(
      { error: 'Error fetching support tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subject, message, category, priority } = body

    if (!userId || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const ticket = await db.supportTicket.create({
      data: {
        userId,
        subject,
        message,
        category: category || 'general',
        priority: priority || 'normal'
      }
    })

    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json(
      { error: 'Error creating support ticket' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, action, data } = body

    if (!ticketId || !action) {
      return NextResponse.json(
        { error: 'Missing ticketId or action' },
        { status: 400 }
      )
    }

    let updatedTicket

    switch (action) {
      case 'respond':
        const ticket = await db.supportTicket.findUnique({
          where: { id: ticketId }
        })
        if (!ticket) {
          return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
        }

        const responses = JSON.parse(ticket.responses)
        responses.push({
          id: Date.now().toString(),
          message: data.message,
          adminId: data.adminId,
          adminName: data.adminName,
          createdAt: new Date().toISOString()
        })

        updatedTicket = await db.supportTicket.update({
          where: { id: ticketId },
          data: {
            responses: JSON.stringify(responses),
            status: data.status || ticket.status
          }
        })
        break

      case 'update_status':
        const updateData: Record<string, unknown> = { status: data.status }

        if (data.status === 'resolved') {
          updateData.resolvedAt = new Date()
        } else if (data.status === 'closed') {
          updateData.closedAt = new Date()
        }

        updatedTicket = await db.supportTicket.update({
          where: { id: ticketId },
          data: updateData
        })
        break

      case 'assign':
        updatedTicket = await db.supportTicket.update({
          where: { id: ticketId },
          data: {
            assignedTo: data.adminId,
            status: 'in_progress'
          }
        })
        break

      case 'update_priority':
        updatedTicket = await db.supportTicket.update({
          where: { id: ticketId },
          data: { priority: data.priority }
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, ticket: updatedTicket })
  } catch (error) {
    console.error('Error updating support ticket:', error)
    return NextResponse.json(
      { error: 'Error updating support ticket' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketId = searchParams.get('ticketId')

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Missing ticketId' },
        { status: 400 }
      )
    }

    await db.supportTicket.delete({
      where: { id: ticketId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting support ticket:', error)
    return NextResponse.json(
      { error: 'Error deleting support ticket' },
      { status: 500 }
    )
  }
}
