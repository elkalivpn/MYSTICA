'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Crown, 
  Check, 
  Sparkles, 
  Shield, 
  Zap, 
  Star,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { getProducts, StripeProduct, formatPrice } from '@/lib/stripe/config'

interface PremiumCheckoutProps {
  userId?: string
  email?: string
  name?: string
  isPremium?: boolean
  onCheckoutStart?: () => void
  onCheckoutSuccess?: () => void
  onCheckoutError?: (error: string) => void
}

// Stripe publishable key from env
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export function PremiumCheckout({
  userId,
  email,
  name,
  isPremium = false,
  onCheckoutStart,
  onCheckoutSuccess,
  onCheckoutError,
}: PremiumCheckoutProps) {
  const [isYearly, setIsYearly] = useState(true)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stripeLoaded, setStripeLoaded] = useState(false)

  const products = getProducts()

  useEffect(() => {
    // Load Stripe.js
    if (stripePublishableKey) {
      loadStripe(stripePublishableKey)
        .then(() => setStripeLoaded(true))
        .catch((err) => {
          console.error('Failed to load Stripe:', err)
          setError('Failed to load payment system')
        })
    } else {
      setError('Stripe is not configured')
    }
  }, [])

  const handleSubscribe = async (product: StripeProduct) => {
    if (!userId || !email) {
      setError('Please log in to subscribe')
      onCheckoutError?.('Please log in to subscribe')
      return
    }

    if (!stripeLoaded) {
      setError('Payment system is still loading. Please wait...')
      return
    }

    setIsLoading(product.id)
    setError(null)
    onCheckoutStart?.()

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: product.id,
          userId,
          email,
          name,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url, sessionId } = await response.json()

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        // Fallback: use Stripe.js to redirect
        const stripe = await loadStripe(stripePublishableKey!)
        if (stripe && sessionId) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setIsLoading(null)
      onCheckoutError?.(errorMessage)
    }
  }

  // Filter products based on toggle
  const displayProducts = isYearly 
    ? products.filter(p => p.id === 'yearly' || p.id === 'lifetime')
    : products.filter(p => p.id === 'monthly')

  const currentPlan = isYearly 
    ? products.find(p => p.id === 'yearly') 
    : products.find(p => p.id === 'monthly')

  const lifetimePlan = products.find(p => p.id === 'lifetime')

  if (isPremium) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30"
        >
          <Crown className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Ya eres Premium!</h2>
        <p className="text-gray-400 mb-6">Tienes acceso completo a todas las funciones de Mystica.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {['Lecturas ilimitadas', 'Analisis con IA', 'Soporte prioritario'].map((feature, i) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4">
        <Label 
          htmlFor="billing-toggle" 
          className={cn(
            "text-sm cursor-pointer transition-colors",
            !isYearly ? "text-white" : "text-gray-400"
          )}
        >
          Mensual
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-yellow-500"
        />
        <Label 
          htmlFor="billing-toggle" 
          className={cn(
            "text-sm cursor-pointer transition-colors flex items-center gap-2",
            isYearly ? "text-white" : "text-gray-400"
          )}
        >
          Anual
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            Ahorra 33%
          </Badge>
        </Label>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-md mx-auto p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Subscription Plan */}
        {currentPlan && (
          <motion.div
            key={currentPlan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative",
              currentPlan.popular && "md:-mt-4"
            )}
          >
            {currentPlan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1">
                  Mas Popular
                </Badge>
              </div>
            )}
            <Card className={cn(
              "bg-gradient-to-br from-mystica-dark-100/80 to-mystica-dark-200/80 overflow-hidden h-full",
              currentPlan.popular 
                ? "border-yellow-500/50 ring-2 ring-yellow-500/30" 
                : "border-gray-700"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 pointer-events-none" />
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{currentPlan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(currentPlan.price, currentPlan.currency)}
                  </span>
                  <span className="text-gray-400">
                    /{currentPlan.interval === 'month' ? 'mes' : 'ano'}
                  </span>
                </div>
                {currentPlan.savings && (
                  <p className="text-green-400 text-sm mt-1">
                    Ahorras {currentPlan.savings}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-400 text-sm text-center mb-4">
                  {currentPlan.description}
                </p>
                {[
                  'Acceso a todas las funciones premium',
                  'Lecturas ilimitadas de Tarot',
                  'Analisis avanzado con IA',
                  'Historial ilimitado',
                  'Soporte prioritario',
                  'Sin anuncios',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(currentPlan)}
                  disabled={isLoading !== null || !stripeLoaded}
                  className={cn(
                    "w-full py-6 text-lg font-semibold",
                    currentPlan.popular
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white"
                      : "bg-mystica-purple-600 hover:bg-mystica-purple-500 text-white"
                  )}
                >
                  {isLoading === currentPlan.id ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Suscribirse
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Lifetime Plan */}
        {lifetimePlan && (
          <motion.div
            key="lifetime"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/30 to-mystica-dark-200 border-purple-500/30 overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{lifetimePlan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(lifetimePlan.price, lifetimePlan.currency)}
                  </span>
                  <span className="text-gray-400"> pago unico</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-400 text-sm text-center mb-4">
                  {lifetimePlan.description}
                </p>
                {[
                  'Todo lo de Premium, para siempre',
                  'Sin pagos recurrentes',
                  'Acceso a nuevas funciones',
                  'Soporte VIP de por vida',
                  'Badge exclusivo en tu perfil',
                  'Actualizaciones gratuitas',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Zap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(lifetimePlan)}
                  disabled={isLoading !== null || !stripeLoaded}
                  variant="outline"
                  className="w-full py-6 text-lg font-semibold border-purple-500/50 hover:bg-purple-500/20 text-white"
                >
                  {isLoading === 'lifetime' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Comprar Ahora
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Guarantee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
          <Shield className="w-5 h-5" />
          <span className="text-sm">Garantia de devolucion de 7 dias</span>
        </div>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Pago seguro con Stripe
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4" />
          Cancela cuando quieras
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Activacion inmediata
        </div>
      </motion.div>
    </div>
  )
}
