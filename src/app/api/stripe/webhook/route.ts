import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeClient, stripeConfig, isSubscriptionActive } from '@/lib/stripe/config'
import { db } from '@/lib/db'

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { userId, planId } = session.metadata || {}
  
  if (!userId) {
    console.error('[Stripe Webhook] No userId in session metadata')
    return
  }

  const customerId = session.customer as string
  const subscriptionId = session.subscription as string | null
  const paymentIntentId = session.payment_intent as string | null

  console.log(`[Stripe Webhook] Checkout completed for user ${userId}, plan: ${planId}`)

  // Determine if it's a subscription or one-time payment
  const isLifetime = planId === 'lifetime'
  const plan = isLifetime ? 'premium_lifetime' : 'premium'

  // Update user role to premium
  await db.user.update({
    where: { id: userId },
    data: { role: 'premium' }
  })

  // Update subscription record
  const existingSubscription = await db.subscription.findUnique({
    where: { userId }
  })

  if (existingSubscription) {
    await db.subscription.update({
      where: { userId },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: isLifetime ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        stripeCurrentPeriodEnd: isLifetime ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        stripeCancelAtPeriodEnd: false,
      }
    })
  } else {
    await db.subscription.create({
      data: {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan,
        status: 'active',
        startDate: new Date(),
        endDate: isLifetime ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        stripeCurrentPeriodEnd: isLifetime ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })
  }

  console.log(`[Stripe Webhook] User ${userId} upgraded to premium`)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { userId, planId } = subscription.metadata || {}
  const customerId = subscription.customer as string

  if (!userId) {
    console.error('[Stripe Webhook] No userId in subscription metadata')
    return
  }

  console.log(`[Stripe Webhook] Subscription created for user ${userId}, status: ${subscription.status}`)

  // Update user role if subscription is active
  if (isSubscriptionActive(subscription.status)) {
    await db.user.update({
      where: { id: userId },
      data: { role: 'premium' }
    })
  }

  // Update subscription record
  await db.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      status: subscription.status,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      plan: 'premium',
      status: subscription.status,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {}
  const customerId = subscription.customer as string

  console.log(`[Stripe Webhook] Subscription updated: ${subscription.id}, status: ${subscription.status}`)

  // Find user by customer ID or metadata
  let userIdToUpdate = userId

  if (!userIdToUpdate) {
    const existingSub = await db.subscription.findFirst({
      where: { stripeCustomerId: customerId }
    })
    userIdToUpdate = existingSub?.userId
  }

  if (!userIdToUpdate) {
    console.error('[Stripe Webhook] Could not find user for subscription update')
    return
  }

  // Update user role based on subscription status
  if (isSubscriptionActive(subscription.status)) {
    await db.user.update({
      where: { id: userIdToUpdate },
      data: { role: 'premium' }
    })
  } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    await db.user.update({
      where: { id: userIdToUpdate },
      data: { role: 'free' }
    })
  }

  // Update subscription record
  await db.subscription.update({
    where: { userId: userIdToUpdate },
    data: {
      status: subscription.status,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripePriceId: subscription.items.data[0]?.price.id,
    }
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {}
  const customerId = subscription.customer as string

  console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`)

  // Find user
  let userIdToUpdate = userId

  if (!userIdToUpdate) {
    const existingSub = await db.subscription.findFirst({
      where: { stripeCustomerId: customerId }
    })
    userIdToUpdate = existingSub?.userId
  }

  if (!userIdToUpdate) {
    console.error('[Stripe Webhook] Could not find user for subscription deletion')
    return
  }

  // Downgrade user to free
  await db.user.update({
    where: { id: userIdToUpdate },
    data: { role: 'free' }
  })

  // Update subscription record
  await db.subscription.update({
    where: { userId: userIdToUpdate },
    data: {
      status: 'canceled',
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeCancelAtPeriodEnd: false,
    }
  })

  console.log(`[Stripe Webhook] User ${userIdToUpdate} downgraded to free`)
}

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`[Stripe Webhook] Customer subscription deleted: ${subscription.id}`)
  await handleSubscriptionDeleted(subscription)
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = invoice.subscription as string | null

  console.log(`[Stripe Webhook] Invoice paid for customer: ${customerId}`)

  if (!subscriptionId) return

  // Find subscription by customer ID
  const existingSub = await db.subscription.findFirst({
    where: { stripeCustomerId: customerId }
  })

  if (!existingSub) return

  // Ensure user remains premium
  await db.user.update({
    where: { id: existingSub.userId },
    data: { role: 'premium' }
  })

  // Update subscription status to active
  await db.subscription.update({
    where: { userId: existingSub.userId },
    data: {
      status: 'active',
      stripeCurrentPeriodEnd: invoice.lines.data[0]?.period?.end 
        ? new Date(invoice.lines.data[0].period.end * 1000)
        : null,
    }
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  console.log(`[Stripe Webhook] Invoice payment failed for customer: ${customerId}`)

  // Find subscription
  const existingSub = await db.subscription.findFirst({
    where: { stripeCustomerId: customerId }
  })

  if (!existingSub) return

  // Update subscription status
  await db.subscription.update({
    where: { userId: existingSub.userId },
    data: {
      status: 'past_due',
    }
  })

  console.log(`[Stripe Webhook] Subscription marked as past_due for user ${existingSub.userId}`)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !stripeConfig.webhookSecret) {
    console.error('[Stripe Webhook] Missing signature or webhook secret')
    return NextResponse.json(
      { error: 'Missing webhook signature or secret' },
      { status: 400 }
    )
  }

  const stripe = getStripeClient()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    )
  } catch (error) {
    console.error('[Stripe Webhook] Signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleCustomerSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
