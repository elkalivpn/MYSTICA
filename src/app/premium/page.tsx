'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Crown, Shield, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { subscriptionPlans, planFeatures } from '@/data/subscription-plans'
import { cn } from '@/lib/utils'

export default function PremiumPage() {
  const { isAdmin, isPremium, loginAsPremium } = useAuth()
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setIsSubscribing(true)
    setSelectedPlan(planId)
    
    // Simulate subscription process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For demo purposes, just log in as premium
    loginAsPremium()
    setIsSubscribing(false)
  }

  if (isAdmin || isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-yellow-900/10 to-mystica-dark-100">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">¡Ya eres {isAdmin ? 'Admin' : 'Premium'}!</h1>
          <p className="text-gray-300 mb-8">Tienes acceso completo a todas las funciones de Mystica.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystica-dark-300 via-yellow-900/10 to-mystica-dark-100">
      <header className="sticky top-16 z-40 bg-mystica-dark-200/95 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Premium</h1>
              <p className="text-sm text-gray-400">Desbloquea todo el potencial místico</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "relative",
                plan.popular && "md:-mt-4"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">Más Popular</Badge>
                </div>
              )}
              <Card className={cn(
                "bg-gradient-to-br from-mystica-dark-100/80 to-mystica-dark-200/80",
                plan.popular ? "border-yellow-500/50 ring-1 ring-yellow-500/30" : "border-gray-700"
              )}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">€{plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-400">/{plan.period === 'monthly' ? 'mes' : 'año'}</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  {plan.savings && (
                    <p className="text-green-400 text-sm mb-4">Ahorra {plan.savings}</p>
                  )}
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isSubscribing}
                    className={cn(
                      "w-full",
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400"
                        : "bg-mystica-purple-600 hover:bg-mystica-purple-500"
                    )}
                  >
                    {isSubscribing && selectedPlan === plan.id ? "Procesando..." : plan.price === 0 ? "Plan Actual" : "Suscribirse"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Comparativa de Planes</h2>
        <Card className="bg-mystica-dark-100/50 border-gray-700 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400">Característica</th>
                    <th className="text-center p-4 text-gray-400">Gratuito</th>
                    <th className="text-center p-4 text-yellow-400">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {planFeatures.slice(0, 15).map((feature, i) => (
                    <tr key={i} className="border-b border-gray-700/50">
                      <td className="p-4 text-gray-300">{feature.name}</td>
                      <td className="p-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          <span className="text-gray-400">{feature.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof feature.premium === 'boolean' ? (
                          feature.premium ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
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

        {/* Testimonials */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">¿Tienes dudas?</p>
          <p className="text-white">Prueba gratis por 7 días. Cancela cuando quieras.</p>
        </div>
      </main>
    </div>
  )
}
