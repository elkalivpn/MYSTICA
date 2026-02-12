export interface Quote {
  id: number
  text: string
  author?: string
  category: 'tarot' | 'astrology' | 'runes' | 'general' | 'wisdom' | 'luna'
}

export const quotes: Quote[] = [
  // Tarot
  {
    id: 1,
    text: 'El tarot no predice el futuro, te empodera para crearlo.',
    author: 'Corinne Kenner',
    category: 'tarot'
  },
  {
    id: 2,
    text: 'Cada carta del tarot es una puerta hacia tu inconsciente.',
    category: 'tarot'
  },
  {
    id: 3,
    text: 'Las cartas son espejos del alma.',
    author: 'Rachel Pollack',
    category: 'tarot'
  },
  {
    id: 4,
    text: 'El tarot te habla en el lenguaje de los símbolos que tu alma ya conoce.',
    category: 'tarot'
  },
  {
    id: 5,
    text: 'No busques respuestas en las cartas, busca despertar las respuestas que ya habitan en ti.',
    category: 'tarot'
  },
  // Astrología
  {
    id: 6,
    text: 'Las estrellas inclinan, no obligan.',
    category: 'astrology'
  },
  {
    id: 7,
    text: 'Somos polvo de estrellas contemplando las estrellas.',
    author: 'Carl Sagan',
    category: 'astrology'
  },
  {
    id: 8,
    text: 'Tu carta natal es el mapa del cielo en el momento de tu primer aliento.',
    category: 'astrology'
  },
  {
    id: 9,
    text: 'Los planetas son los relojes del universo, marcando los tiempos de tu alma.',
    category: 'astrology'
  },
  {
    id: 10,
    text: 'En los cielos está escrito el potencial; en la tierra se escribe la historia.',
    category: 'astrology'
  },
  // Runas
  {
    id: 11,
    text: 'Las runas susurran lo que el viento del norte recuerda.',
    category: 'runes'
  },
  {
    id: 12,
    text: 'Cada runa es una letra del alfabeto del destino.',
    category: 'runes'
  },
  {
    id: 13,
    text: 'Odín colgó nueve noches para obtener la sabiduría de las runas.',
    author: 'Hávamál',
    category: 'runes'
  },
  {
    id: 14,
    text: 'Las runas son semillas de poder que florecen en la mente del vidente.',
    category: 'runes'
  },
  // Luna
  {
    id: 15,
    text: 'La Luna no cambia de fase; es nuestra perspectiva la que se transforma.',
    category: 'luna'
  },
  {
    id: 16,
    text: 'En la oscuridad de la Luna Nueva, nacen los sueños más luminosos.',
    category: 'luna'
  },
  {
    id: 17,
    text: 'La Luna llena es el espejo donde el alma contempla su plenitud.',
    category: 'luna'
  },
  {
    id: 18,
    text: 'Cada fase lunar es un capítulo en el libro de tu evolución.',
    category: 'luna'
  },
  {
    id: 19,
    text: 'Selene guía los sueños de quienes velan bajo su luz plateada.',
    category: 'luna'
  },
  // Sabiduría General
  {
    id: 20,
    text: 'El misterio no es un muro, es una puerta.',
    category: 'wisdom'
  },
  {
    id: 21,
    text: 'La intuición es la brújula del alma.',
    category: 'wisdom'
  },
  {
    id: 22,
    text: 'Lo que busca el buscador es el buscador mismo.',
    author: 'Rumi',
    category: 'wisdom'
  },
  {
    id: 23,
    text: 'En el silencio se escucha la voz que importa.',
    category: 'wisdom'
  },
  {
    id: 24,
    text: 'La magia no es romper las leyes de la naturaleza, es comprenderlas profundamente.',
    category: 'wisdom'
  },
  {
    id: 25,
    text: 'Todo poder oculto es simplemente una verdad que aún no comprendemos.',
    category: 'wisdom'
  },
  {
    id: 26,
    text: 'El universo habla a quienes aprenden a escuchar.',
    category: 'wisdom'
  },
  {
    id: 27,
    text: 'Cada día es una nueva oportunidad para leer el libro del universo.',
    category: 'general'
  },
  {
    id: 28,
    text: 'Los símbolos son el lenguaje del alma.',
    category: 'general'
  },
  {
    id: 29,
    text: 'Confía en el proceso; cada carta gira en el momento perfecto.',
    category: 'tarot'
  },
  {
    id: 30,
    text: 'Tu signo no te define; te invita a descubrir quién puedes ser.',
    category: 'astrology'
  },
  {
    id: 31,
    text: 'La adivinación no ve el futuro; ilumina el presente.',
    category: 'general'
  },
  {
    id: 32,
    text: 'Hécate guarda las encrucijadas donde el destino se decide.',
    category: 'wisdom'
  },
  {
    id: 33,
    text: 'En cada línea de tu mano está escrita la historia de tu alma.',
    category: 'wisdom'
  },
  {
    id: 34,
    text: 'Los arcanos mayores son las 22 lecciones que todo alma debe aprender.',
    category: 'tarot'
  },
  {
    id: 35,
    text: 'La sincronicidad es el lenguaje secreto del universo.',
    author: 'Carl Jung',
    category: 'wisdom'
  }
]

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

export function getRotatingQuote(seed?: number): Quote {
  const today = new Date()
  const index = seed 
    ? seed % quotes.length 
    : (today.getDate() + today.getMonth()) % quotes.length
  return quotes[index]
}

export function getQuotesByCategory(category: Quote['category']): Quote[] {
  return quotes.filter(quote => quote.category === category)
}
