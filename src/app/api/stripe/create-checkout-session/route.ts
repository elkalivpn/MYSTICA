import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient, stripeProducts, getProductById } from '@/lib/stripe/config'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, userId, email, name } = body

    // Validate required fields
    if (!planId || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, userId, email' },
        { status: 400 }
      )
    }

    // Get product info
    const product = getProductById(planId)
    if (!product || !product.priceId) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const stripe = getStripeClient()

    // Check if user already has a Stripe customer ID
    let user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user) {
      // Create user if doesn't exist
      user = await db.user.create({
        data: {
          id: userId,
          email,
          name: name || email.split('@')[0],
          role: 'free',
        },
        include: { subscription: true }
      })
    }

    let customerId = user.subscription?.stripeCustomerId

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: name || email.split('@')[0],
        metadata: {
          userId,
        },
      })
      customerId = customer.id

      // Update or create subscription record with customer ID
      if (user.subscription) {
        await db.subscription.update({
          where: { userId },
          data: { stripeCustomerId: customerId }
        })
      } else {
        await db.subscription.create({
          data: {
            userId,
            stripeCustomerId: customerId,
            plan: 'free',
            status: 'inactive',
          }
        })
      }
    }

    // Create checkout session
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: planId === 'lifetime' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/premium?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${origin}/premium?canceled=true`,
      metadata: {
        userId,
        planId,
      },
      subscription_data: planId !== 'lifetime' ? {
        metadata: {
          userId,
          planId,
        },
      } : undefined,
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    // Log the checkout attempt
    console.log(`[Stripe] Checkout session created for user ${userId}, plan: ${planId}, session: ${session.id}`)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
