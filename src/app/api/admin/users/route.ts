import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } }
      ]
    }

    if (role) {
      where.role = role
    }

    if (status === 'banned') {
      where.banned = true
    } else if (status === 'active') {
      where.banned = false
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscription: true,
          progress: true,
          _count: {
            select: {
              meditationSessions: true,
              tarotReadings: true,
              supportTickets: true
            }
          }
        }
      }),
      db.user.count({ where })
    ])

    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      banned: user.banned,
      bannedAt: user.bannedAt,
      bannedReason: user.bannedReason,
      createdAt: user.createdAt,
      subscription: user.subscription ? {
        plan: user.subscription.plan,
        status: user.subscription.status,
        endDate: user.subscription.endDate
      } : null,
      progress: user.progress ? {
        level: user.progress.level,
        xp: user.progress.xp,
        streak: user.progress.streak,
        lastActive: user.progress.lastActive
      } : null,
      stats: {
        meditations: user._count.meditationSessions,
        readings: user._count.tarotReadings,
        tickets: user._count.supportTickets
      }
    }))

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, data } = body

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing userId or action' },
        { status: 400 }
      )
    }

    let updatedUser

    switch (action) {
      case 'change_role':
        if (!['user', 'premium', 'admin'].includes(data.role)) {
          return NextResponse.json(
            { error: 'Invalid role' },
            { status: 400 }
          )
        }
        updatedUser = await db.user.update({
          where: { id: userId },
          data: { role: data.role }
        })
        break

      case 'ban':
        updatedUser = await db.user.update({
          where: { id: userId },
          data: {
            banned: true,
            bannedAt: new Date(),
            bannedReason: data.reason || 'No reason provided'
          }
        })
        break

      case 'unban':
        updatedUser = await db.user.update({
          where: { id: userId },
          data: {
            banned: false,
            bannedAt: null,
            bannedReason: null
          }
        })
        break

      case 'update':
        updatedUser = await db.user.update({
          where: { id: userId },
          data: {
            name: data.name,
            email: data.email
          }
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error updating user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    await db.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error deleting user' },
      { status: 500 }
    )
  }
}
