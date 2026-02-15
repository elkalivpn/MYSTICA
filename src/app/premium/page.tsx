'use client'

import { useRef, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Crown, 
  Shield, 
  Check, 
  X, 
  Sparkles,
  Star,
  MessageCircle,
  CreditCard,
  HelpCircle,
  Zap,
  Clock,
  Heart,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { useAuth } from '@/hooks/useAuth'
import { useSubscriptionSync } from '@/hooks/useSubscription'
import { PremiumCheckout } from '@/components/PremiumCheckout'
import { subscriptionPlans, planFeatures } from '@/data/subscription-plans'
import { cn } from '@/lib/utils'

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Maria G.',
    avatar: 'M',
    role: 'Premium desde 2023',
    content: 'Las lecturas de tarot con IA son increiblemente precisas. Me ayudan a reflexionar sobre mis decisiones de vida.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Carlos R.',
    avatar: 'C',
    role: 'Premium Anual',
    content: 'El calendario lunar y los rituales han transformado mi practica espiritual. Vale cada centimo.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ana L.',
    avatar: 'A',
    role: 'Vitalicio',
    content: 'El soporte es excelente y las meditaciones guiadas me ayudan a dormir mejor. Muy recomendado.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Pedro M.',
    avatar: 'P',
    role: 'Premium Mensual',
    content: 'El diario de suenos con analisis detallado es mi funcion favorita. Ahora entiendo mejor mis suenos.',
    rating: 5,
  },
]

// FAQ data
const faqItems = [
  {
    question: 'Como funciona la suscripcion?',
    answer: 'Puedes elegir entre planes mensuales, anuales o vitalicios. El pago se procesa de forma segura a traves de Stripe. Una vez completado el pago, tu cuenta se actualiza automaticamente a Premium.',
  },
  {
    question: 'Puedo cancelar mi suscripcion?',
    answer: 'Si, puedes cancelar tu suscripcion en cualquier momento desde la seccion de ajustes de tu cuenta. Seguiras teniendo acceso Premium hasta el final del periodo facturado.',
  },
  {
    question: 'Que metodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de credito y debito (Visa, Mastercard, American Express) a traves de Stripe, el procesador de pagos mas seguro del mundo.',
  },
  {
    question: 'Ofrecen garantia de devolucion?',
    answer: 'Si, ofrecemos una garantia de devolucion de 7 dias. Si no estas satisfecho, contactanos y te devolveremos el importe completo.',
  },
  {
    question: 'Como accedo a las funciones Premium?',
    answer: 'Una vez realizada la suscripcion, tu cuenta se actualiza automaticamente. Todas las funciones Premium estaran disponibles inmediatamente en todas las secciones de la app.',
  },
  {
    question: 'Puedo cambiar de plan?',
    answer: 'Si, puedes cambiar de plan en cualquier momento. Si actualizas, se aplicara un credito proporcional. Si cambias a un plan inferior, el cambio se aplicara al final del periodo actual.',
  },
  {
    question: 'Mis datos de pago estan seguros?',
    answer: 'Absolutamente. Nunca almacenamos los datos de tu tarjeta. Todo el procesamiento de pagos lo gestiona Stripe, cumpliendo con los mas altos estandares de seguridad PCI DSS.',
  },
]

// Benefits data
const benefits = [
  {
    icon: Star,
    title: 'Lecturas Ilimitadas',
    description: 'Tarot, runas y oraculo sin limites diarios',
  },
  {
    icon: Sparkles,
    title: 'Analisis con IA',
    description: 'Interpretaciones profundas y personalizadas',
  },
  {
    icon: Clock,
    title: 'Historial Completo',
    description: 'Acceso a todas tus lecturas pasadas',
  },
  {
    icon: Heart,
    title: 'Sin Anuncios',
    description: 'Experiencia limpia y sin distracciones',
  },
  {
    icon: Users,
    title: 'Soporte VIP',
    description: 'Atencion prioritaria cuando la necesites',
  },
  {
    icon: Zap,
    title: 'Nuevas Funciones',
    description: 'Acceso anticipado a novedades',
  },
]

export default function PremiumPage() {
  const { user, isPremium, isAdmin } = useAuth()
  const { subscription, refresh: refreshSubscription } = useSubscriptionSync(user?.id)
  const searchParams = useSearchParams()
  const hasHandledParamsRef = useRef(false)

  // Derive success/canceled from URL params using useMemo
  const { showSuccess, showCanceled } = useMemo(() => {
    const success = searchParams.get('success') === 'true'
    const canceled = searchParams.get('canceled') === 'true'
    return { showSuccess: success, showCanceled: canceled }
  }, [searchParams])

  useEffect(() => {
    // Refresh subscription on success (only once)
    if (showSuccess && !hasHandledParamsRef.current) {
      hasHandledParamsRef.current = true
      refreshSubscription()
    }
  }, [showSuccess, refreshSubscription])

  // Check if premium (from auth or subscription)
  const isUserPremium = isPremium || subscription?.isPremium

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-yellow-900/10 to-mystica-dark-100">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Premium
              </h1>
              <p className="text-sm text-gray-400">Desbloquea todo el potencial mistico</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-center"
          >
            <Check className="w-6 h-6 inline mr-2" />
            ¡Gracias por tu suscripcion! Tu cuenta Premium esta activa.
          </motion.div>
        )}

        {/* Canceled Message */}
        {showCanceled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-center"
          >
            El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
          </motion.div>
        )}

        {/* Premium Checkout */}
        <PremiumCheckout
          userId={user?.id}
          email={user?.email}
          name={user?.name}
          isPremium={isUserPremium}
        />

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Beneficios Premium
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="bg-mystica-dark-100/50 border-gray-700 h-full hover:border-yellow-500/30 transition-colors">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Comparison */}
        {!isUserPremium && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Comparativa de Planes
            </h2>
            <Card className="bg-mystica-dark-100/50 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-4 text-gray-400">Caracteristica</th>
                        <th className="text-center p-4 text-gray-400">Gratuito</th>
                        <th className="text-center p-4 text-yellow-400">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planFeatures.slice(0, 12).map((feature, i) => (
                        <tr key={i} className="border-b border-gray-700/50">
                          <td className="p-4 text-gray-300">{feature.name}</td>
                          <td className="p-4 text-center">
                            {typeof feature.free === 'boolean' ? (
                              feature.free ? (
                                <Check className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-400">{feature.free}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {typeof feature.premium === 'boolean' ? (
                              feature.premium ? (
                                <Check className="w-5 h-5 text-green-400 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )
                            ) : (
                              <span className="text-yellow-400">{feature.premium}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="bg-mystica-dark-100/50 border-gray-700 h-full hover:border-yellow-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{testimonial.name}</p>
                        <p className="text-gray-500 text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Preguntas Frecuentes</h2>
          </div>
          <Card className="bg-mystica-dark-100/50 border-gray-700">
            <CardContent className="p-4">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-gray-700">
                    <AccordionTrigger className="text-white hover:text-yellow-400 text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>

        {/* Sponsor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-mystica-purple-900/30 to-mystica-dark-200 border-mystica-purple-500/30">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-6 h-6 text-mystica-purple-300 mx-auto mb-2" />
              <p className="text-white mb-4">
                Al suscribirte a Premium, apoyas el desarrollo continuo de Mystica
              </p>
              <p className="text-mystica-gold-400 text-sm">
                Desarrollado con dedicacion por <span className="font-semibold">Yrys</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
