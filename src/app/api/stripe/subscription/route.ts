import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeClient, isSubscriptionActive, SubscriptionInfo } from '@/lib/stripe/config'
import { db } from '@/lib/db'

// GET - Get current subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get user with subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const subscription = user.subscription

    // If no subscription record, return free status
    if (!subscription) {
      const info: SubscriptionInfo = {
        isPremium: false,
        status: 'none',
        plan: 'free',
        cancelAtPeriodEnd: false,
      }
      return NextResponse.json(info)
    }

    // If there's a Stripe subscription ID, fetch fresh data from Stripe
    if (subscription.stripeSubscriptionId) {
      try {
        const stripe = getStripeClient()
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripeSubscriptionId
        )

        const isActive = isSubscriptionActive(stripeSubscription.status)

        // Update local database with latest status
        if (subscription.status !== stripeSubscription.status) {
          await db.subscription.update({
            where: { userId },
            data: {
              status: isActive ? 'active' : stripeSubscription.status,
              stripeCurrentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
              stripeCancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            }
          })

          // Update user role if needed
          if (isActive && user.role !== 'premium' && user.role !== 'admin') {
            await db.user.update({
              where: { id: userId },
              data: { role: 'premium' }
            })
          } else if (!isActive && user.role === 'premium') {
            await db.user.update({
              where: { id: userId },
              data: { role: 'free' }
            })
          }
        }

        const info: SubscriptionInfo = {
          isPremium: isActive || user.role === 'admin',
          status: stripeSubscription.status as SubscriptionInfo['status'],
          plan: subscription.plan,
          currentPeriodEnd: stripeSubscription.current_period_end,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          customerId: subscription.stripeCustomerId || undefined,
          subscriptionId: subscription.stripeSubscriptionId,
        }

        return NextResponse.json(info)
      } catch (stripeError) {
        console.error('[Stripe] Error fetching subscription:', stripeError)
        // Fall through to return local data
      }
    }

    // Return local subscription data
    const isPremium = user.role === 'premium' || user.role === 'admin'
    const info: SubscriptionInfo = {
      isPremium,
      status: (subscription.status === 'active' ? 'active' : subscription.status) as SubscriptionInfo['status'],
      plan: subscription.plan,
      currentPeriodEnd: subscription.stripeCurrentPeriodEnd?.getTime() 
        ? Math.floor(subscription.stripeCurrentPeriodEnd.getTime() / 1000)
        : undefined,
      cancelAtPeriodEnd: subscription.stripeCancelAtPeriodEnd,
      customerId: subscription.stripeCustomerId || undefined,
      subscriptionId: subscription.stripeSubscriptionId || undefined,
    }

    return NextResponse.json(info)
  } catch (error) {
    console.error('[Stripe] Error getting subscription:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, immediately = false } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get user with subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user || !user.subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    const subscription = user.subscription

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No Stripe subscription to cancel' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    if (immediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)

      // Update local database
      await db.subscription.update({
        where: { userId },
        data: {
          status: 'canceled',
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
          stripeCancelAtPeriodEnd: false,
        }
      })

      // Downgrade user
      await db.user.update({
        where: { id: userId },
        data: { role: 'free' }
      })

      console.log(`[Stripe] Subscription canceled immediately for user ${userId}`)
    } else {
      // Cancel at period end
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      )

      // Update local database
      await db.subscription.update({
        where: { userId },
        data: {
          stripeCancelAtPeriodEnd: true,
        }
      })

      console.log(`[Stripe] Subscription set to cancel at period end for user ${userId}`)
    }

    return NextResponse.json({
      success: true,
      message: immediately 
        ? 'Subscription canceled immediately' 
        : 'Subscription will cancel at the end of the current period'
    })
  } catch (error) {
    console.error('[Stripe] Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

// POST - Create customer portal session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get user with subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user || !user.subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      )
    }

    const stripe = getStripeClient()
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${origin}/premium`,
    })

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error) {
    console.error('[Stripe] Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
