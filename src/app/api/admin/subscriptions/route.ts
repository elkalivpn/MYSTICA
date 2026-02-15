import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const plan = searchParams.get('plan') || ''
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (plan) {
      where.plan = plan
    }

    if (search) {
      where.user = {
        OR: [
          { email: { contains: search } },
          { name: { contains: search } }
        ]
      }
    }

    const [subscriptions, total] = await Promise.all([
      db.subscription.findMany({
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
      db.subscription.count({ where })
    ])

    // Calculate revenue stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [activeCount, cancelledCount] = await Promise.all([
      db.subscription.count({ where: { status: 'active' } }),
      db.subscription.count({ where: { status: 'cancelled' } })
    ])

    // Plan distribution
    const planDistribution = await db.subscription.groupBy({
      by: ['plan'],
      _count: true,
      where: { status: 'active' }
    })

    // Revenue by plan (mock calculation)
    const revenueByPlan = {
      monthly: planDistribution.find(p => p.plan === 'monthly')?._count || 0,
      yearly: planDistribution.find(p => p.plan === 'yearly')?._count || 0,
      lifetime: planDistribution.find(p => p.plan === 'lifetime')?._count || 0
    }

    const totalRevenue = (revenueByPlan.monthly * 4.99) +
                         (revenueByPlan.yearly * 39.99 / 12) +
                         (revenueByPlan.lifetime * 99.99 / 12)

    return NextResponse.json({
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        userId: sub.userId,
        user: sub.user,
        plan: sub.plan,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        stripeCustomerId: sub.stripeCustomerId,
        stripeSubscriptionId: sub.stripeSubscriptionId,
        stripePriceId: sub.stripePriceId,
        stripeCurrentPeriodEnd: sub.stripeCurrentPeriodEnd,
        stripeCancelAtPeriodEnd: sub.stripeCancelAtPeriodEnd,
        createdAt: sub.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        activeCount,
        cancelledCount,
        monthlyActiveRevenue: Math.round(totalRevenue * 100) / 100,
        planDistribution: planDistribution.reduce((acc, item) => {
          acc[item.plan] = item._count
          return acc
        }, {} as Record<string, number>)
      }
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Error fetching subscriptions' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscriptionId, action, data } = body

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { error: 'Missing subscriptionId or action' },
        { status: 400 }
      )
    }

    let updatedSubscription

    switch (action) {
      case 'cancel':
        updatedSubscription = await db.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'cancelled',
            stripeCancelAtPeriodEnd: true
          }
        })
        break

      case 'reactivate':
        updatedSubscription = await db.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'active',
            stripeCancelAtPeriodEnd: false
          }
        })
        break

      case 'upgrade':
        updatedSubscription = await db.subscription.update({
          where: { id: subscriptionId },
          data: { plan: data.plan }
        })
        // Also update user role
        await db.user.update({
          where: { id: updatedSubscription.userId },
          data: { role: data.plan === 'premium' ? 'premium' : 'user' }
        })
        break

      case 'refund':
        // In a real app, this would call Stripe API
        updatedSubscription = await db.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'cancelled',
            endDate: new Date()
          }
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, subscription: updatedSubscription })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Error updating subscription' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Export all subscriptions
    const subscriptions = await db.subscription.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (format === 'csv') {
      const headers = ['ID', 'User Email', 'User Name', 'Plan', 'Status', 'Start Date', 'End Date', 'Stripe Customer ID', 'Created At']
      const rows = subscriptions.map(sub => [
        sub.id,
        sub.user.email,
        sub.user.name || '',
        sub.plan,
        sub.status,
        sub.startDate.toISOString(),
        sub.endDate?.toISOString() || '',
        sub.stripeCustomerId || '',
        sub.createdAt.toISOString()
      ])

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="subscriptions.csv"'
        }
      })
    }

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('Error exporting subscriptions:', error)
    return NextResponse.json(
      { error: 'Error exporting subscriptions' },
      { status: 500 }
    )
  }
}
