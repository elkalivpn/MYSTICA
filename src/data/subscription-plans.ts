export interface PlanFeature {
  name: string
  free: string | boolean
  premium: string | boolean
  description?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  currency: string
  description: string
  popular?: boolean
  savings?: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    period: 'monthly',
    currency: 'EUR',
    description: 'Acceso básico a las funciones esenciales'
  },
  {
    id: 'premium-monthly',
    name: 'Premium Mensual',
    price: 4.99,
    period: 'monthly',
    currency: 'EUR',
    description: 'Acceso completo con facturación mensual'
  },
  {
    id: 'premium-yearly',
    name: 'Premium Anual',
    price: 39.99,
    period: 'yearly',
    currency: 'EUR',
    description: 'Mejor valor - Ahorra 2 meses',
    popular: true,
    savings: '€20'
  }
]

export const planFeatures: PlanFeature[] = [
  // TAROT
  {
    name: 'Lecturas de Tarot',
    free: '3 cartas / 1 al día',
    premium: '5 cartas / Ilimitadas',
    description: 'Lecturas con los 22 Arcanos Mayores'
  },
  {
    name: 'Interpretaciones de Tarot',
    free: 'Básica',
    premium: 'Avanzada con IA',
    description: 'Profundidad de las interpretaciones'
  },
  
  // ORÁCULO
  {
    name: 'Mensajes del Oráculo',
    free: '1 al día',
    premium: 'Ilimitados',
    description: 'Mensajes del universo'
  },
  {
    name: 'Conexión Tarot-Oráculo',
    free: true,
    premium: true,
    description: 'Vinculación con lecturas previas'
  },
  
  // RUNAS
  {
    name: 'Lecturas de Runas',
    free: '3 runas básicas',
    premium: 'Tiradas avanzadas',
    description: '24 runas del Futhark'
  },
  
  // HORÓSCOPO
  {
    name: 'Horóscopo Diario',
    free: 'Hoy',
    premium: 'Diario, Semanal, Mensual',
    description: 'Predicciones astrológicas'
  },
  {
    name: 'Compatibilidad Zodiacal',
    free: 'Score básico',
    premium: 'Análisis completo',
    description: 'Compatibilidad entre signos'
  },
  
  // CALENDARIO LUNAR
  {
    name: 'Fases Lunares',
    free: 'Fase actual',
    premium: 'Calendario completo',
    description: 'Información lunar detallada'
  },
  {
    name: 'Rituales Lunares',
    free: false,
    premium: true,
    description: 'Rituales para cada fase'
  },
  
  // SUEÑOS
  {
    name: 'Diario de Sueños',
    free: '5 entradas',
    premium: 'Ilimitado',
    description: 'Registro y análisis de sueños'
  },
  {
    name: 'Análisis de Símbolos',
    free: 'Básico',
    premium: 'Detallado con conexiones',
    description: 'Interpretación de símbolos oníricos'
  },
  
  // NUMEROLOGÍA
  {
    name: 'Número de Camino de Vida',
    free: true,
    premium: true,
    description: 'Tu número principal'
  },
  {
    name: 'Análisis Numerológico Completo',
    free: false,
    premium: true,
    description: 'Destino, Alma, Personalidad, Año Personal'
  },
  
  // RITUALES
  {
    name: 'Rituales y Hechizos',
    free: '4 básicos',
    premium: 'Todos (20+)',
    description: 'Guías de rituales mágicos'
  },
  
  // CRISTALES
  {
    name: 'Guía de Cristales',
    free: '6 cristales',
    premium: 'Todos (50+)',
    description: 'Propiedades y usos de cristales'
  },
  
  // MEDITACIONES
  {
    name: 'Meditaciones Guiadas',
    free: '3 básicas',
    premium: 'Todas (15+)',
    description: 'Sesiones de meditación'
  },
  
  // GENERAL
  {
    name: 'Guías NPCs Místicos',
    free: 'Limitado',
    premium: 'Todos los guías',
    description: 'Interacción con guías místicos'
  },
  {
    name: 'Racha y Afirmaciones',
    free: true,
    premium: true,
    description: 'Sistema de rachas diarias'
  },
  {
    name: 'Sin Anuncios',
    free: false,
    premium: true,
    description: 'Experiencia sin publicidad'
  },
  {
    name: 'Historial de Lecturas',
    free: '7 días',
    premium: 'Ilimitado',
    description: 'Acceso a lecturas pasadas'
  },
  {
    name: 'Exportar Lecturas',
    free: false,
    premium: true,
    description: 'Descargar en PDF'
  },
  {
    name: 'Soporte Prioritario',
    free: false,
    premium: true,
    description: 'Atención al cliente premium'
  }
]

export function getPlanById(id: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find(p => p.id === id)
}

export function getYearlyPlan(): SubscriptionPlan | undefined {
  return subscriptionPlans.find(p => p.period === 'yearly' && p.price > 0)
}

export function getMonthlyPlan(): SubscriptionPlan | undefined {
  return subscriptionPlans.find(p => p.period === 'monthly' && p.price > 0)
}
