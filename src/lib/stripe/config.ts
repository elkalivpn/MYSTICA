import Stripe from 'stripe'

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
}

// Product and price IDs from environment variables
export const stripeProducts = {
  monthly: {
    name: 'Premium Mensual',
    description: 'Acceso completo con facturacion mensual',
    price: 4.99,
    currency: 'EUR',
    interval: 'month' as const,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || '',
  },
  yearly: {
    name: 'Premium Anual',
    description: 'Mejor valor - Ahorra 2 meses',
    price: 39.99,
    currency: 'EUR',
    interval: 'year' as const,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || '',
    popular: true,
    savings: '20 EUR',
  },
  lifetime: {
    name: 'Premium Vitalicio',
    description: 'Pago unico, acceso para siempre',
    price: 99.99,
    currency: 'EUR',
    interval: null,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || '',
  },
}

// Types
export interface StripeProduct {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval?: 'month' | 'year' | null
  popular?: boolean
  savings?: string
  priceId: string
}

export interface StripePrice {
  id: string
  productId: string
  unitAmount: number
  currency: string
  interval?: 'month' | 'year'
  active: boolean
}

export interface StripeSubscription {
  id: string
  customerId: string
  status: Stripe.Subscription.Status
  currentPeriodStart: number
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
  plan: {
    id: string
    interval?: 'month' | 'year'
    amount: number
    currency: string
  }
}

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid'
  | 'none'

export interface SubscriptionInfo {
  isPremium: boolean
  status: SubscriptionStatus
  plan: string
  currentPeriodEnd?: number
  cancelAtPeriodEnd: boolean
  customerId?: string
  subscriptionId?: string
}

// Helper function to get Stripe client (server-side only)
export function getStripeClient(): Stripe {
  if (!stripeConfig.secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not defined')
  }
  return new Stripe(stripeConfig.secretKey, {
    apiVersion: '2024-12-18.acacia',
  })
}

// Helper to check if subscription is active
export function isSubscriptionActive(status: Stripe.Subscription.Status): boolean {
  return ['active', 'trialing'].includes(status)
}

// Helper to format price for display
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

// Get product list for display
export function getProducts(): StripeProduct[] {
  return [
    {
      id: 'monthly',
      ...stripeProducts.monthly,
    },
    {
      id: 'yearly',
      ...stripeProducts.yearly,
    },
    {
      id: 'lifetime',
      ...stripeProducts.lifetime,
    },
  ]
}

// Get product by ID
export function getProductById(id: string): StripeProduct | undefined {
  const products = getProducts()
  return products.find(p => p.id === id)
}
