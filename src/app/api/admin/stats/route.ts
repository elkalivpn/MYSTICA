import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // User stats
    const totalUsers = await db.user.count()
    const activeToday = await db.user.count({
      where: {
        progress: {
          lastActive: { gte: today }
        }
      }
    })
    const newUsersToday = await db.user.count({
      where: { createdAt: { gte: today } }
    })
    const newUsersThisWeek = await db.user.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    })
    const newUsersThisMonth = await db.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    })

    // Subscription stats
    const premiumUsers = await db.user.count({ where: { role: 'premium' } })
    const activeSubscriptions = await db.subscription.count({
      where: { status: 'active' }
    })
    const cancelledSubscriptions = await db.subscription.count({
      where: { status: 'cancelled' }
    })

    // Activity stats
    const readingsToday = await db.tarotReading.count({
      where: { date: { gte: today } }
    })
    const meditationsToday = await db.meditationSession.count({
      where: { date: { gte: today } }
    })

    // Support stats
    const openTickets = await db.supportTicket.count({
      where: { status: 'open' }
    })
    const inProgressTickets = await db.supportTicket.count({
      where: { status: 'in_progress' }
    })

    // Bug report stats
    const newBugs = await db.bugReport.count({ where: { status: 'new' } })
    const criticalBugs = await db.bugReport.count({
      where: { priority: 'critical', status: { not: 'resolved' } }
    })

    // Activity chart data (last 7 days)
    const activityData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const [users, readings, meditations] = await Promise.all([
        db.user.count({ where: { createdAt: { gte: date, lt: nextDate } } }),
        db.tarotReading.count({ where: { date: { gte: date, lt: nextDate } } }),
        db.meditationSession.count({ where: { date: { gte: date, lt: nextDate } } })
      ])

      activityData.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        users,
        readings,
        meditations
      })
    }

    // Meditation stats by category
    const meditationSessions = await db.meditationSession.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      select: { meditationId: true, duration: true }
    })

    // Revenue calculation (mock - in real app would come from Stripe)
    const monthlyRevenue = activeSubscriptions * 4.99 * 12 + activeSubscriptions * 39.99
    const revenueGrowth = 12.5 // Mock percentage

    // User distribution by role
    const userByRole = await db.user.groupBy({
      by: ['role'],
      _count: true
    })

    // Device distribution (from user activities)
    await db.userActivity.groupBy({
      by: ['metadata'],
      where: {
        action: 'login',
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: true
    })

    return NextResponse.json({
      overview: {
        totalUsers,
        activeToday,
        premiumUsers,
        activeSubscriptions,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        revenueGrowth,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth
      },
      activity: {
        readingsToday,
        meditationsToday,
        activityData
      },
      support: {
        openTickets,
        inProgressTickets,
        totalTickets: openTickets + inProgressTickets
      },
      bugs: {
        newBugs,
        criticalBugs
      },
      distribution: {
        userByRole: userByRole.reduce((acc, item) => {
          acc[item.role] = item._count
          return acc
        }, {} as Record<string, number>)
      },
      meditationStats: {
        totalSessions: meditationSessions.length,
        totalMinutes: meditationSessions.reduce((acc, s) => acc + Math.round(s.duration / 60), 0)
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Error fetching statistics' },
      { status: 500 }
    )
  }
}
