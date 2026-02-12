export interface DreamSymbol {
  id: number
  name: string
  keywords: string[]
  meanings: {
    positive: string
    negative: string
    spiritual: string
  }
  relatedSymbols: string[]
  element: 'agua' | 'fuego' | 'aire' | 'tierra' | 'espíritu'
}

export const dreamSymbols: DreamSymbol[] = [
  {
    id: 1,
    name: 'Agua',
    keywords: ['mar', 'río', 'lago', 'lluvia', 'océano', 'natación'],
    meanings: {
      positive: 'Emociones purificadas, fluidez emocional, claridad en sentimientos, renovación espiritual.',
      negative: 'Emociones abrumadoras, miedo a ahogarse en problemas, ansiedad, inestabilidad emocional.',
      spiritual: 'El agua representa el útero cósmico, el origen de la vida y la purificación del alma.'
    },
    relatedSymbols: ['Peces', 'Barco', 'Lluvia'],
    element: 'agua'
  },
  {
    id: 2,
    name: 'Vuelo',
    keywords: ['volar', 'alas', 'elevarse', 'flotar', 'cielo'],
    meanings: {
      positive: 'Libertad, trascendencia, superación de obstáculos, perspectiva elevada, éxito.',
      negative: 'Escapismo, huir de responsabilidades, miedo a perder el control, inestabilidad.',
      spiritual: 'El alma trascendiendo las limitaciones terrenales, conexión con realms superiores.'
    },
    relatedSymbols: ['Pájaros', 'Cielo', 'Ángeles'],
    element: 'aire'
  },
  {
    id: 3,
    name: 'Caída',
    keywords: ['caer', 'precipicio', 'abismo', 'despeñadero'],
    meanings: {
      positive: 'Liberación de control excesivo, humildad necesaria, oportunidad de reconstrucción.',
      negative: 'Pérdida de control, miedo al fracaso, ansiedad, pérdida de estatus o seguridad.',
      spiritual: 'El ego cayendo para permitir el ascenso espiritual, descenso al inframundo iniciático.'
    },
    relatedSymbols: ['Montaña', 'Escaleras', 'Vuelo'],
    element: 'aire'
  },
  {
    id: 4,
    name: 'Muerte',
    keywords: ['morir', 'tumba', 'funeral', 'cadáver', 'ataúd'],
    meanings: {
      positive: 'Transformación profunda, fin de ciclo, renacimiento, liberación de lo viejo.',
      negative: 'Miedo al cambio, pérdida dolorosa, resistencia a transformaciones necesarias.',
      spiritual: 'Muerte del ego, renacimiento espiritual, iniciación en nuevos niveles de conciencia.'
    },
    relatedSymbols: ['Mariposa', 'Fénix', 'Serpiente'],
    element: 'espíritu'
  },
  {
    id: 5,
    name: 'Serpiente',
    keywords: ['serpiente', 'culebra', 'víbora', 'serpenteante'],
    meanings: {
      positive: 'Transformación, sabiduría ancestral, curación, energía kundalini, renovación.',
      negative: 'Traición, peligro oculto, tentación, miedos profundos, energía sexual reprimida.',
      spiritual: 'La serpiente muerde su cola: el eterno retorno, el ciclo infinito de muerte y renacimiento.'
    },
    relatedSymbols: ['Dragón', 'Muerte', 'Fuego'],
    element: 'tierra'
  },
  {
    id: 6,
    name: 'Casa',
    keywords: ['hogar', 'casa', 'edificio', 'habitación', 'puerta'],
    meanings: {
      positive: 'Seguridad, identidad, el ser interior, estabilidad emocional, relaciones familiares.',
      negative: 'Inseguridad, problemas familiares, partes de ti mismo descuidadas, estancamiento.',
      spiritual: 'El templo interior, diferentes habitaciones representan aspectos del ser.'
    },
    relatedSymbols: ['Puerta', 'Escaleras', 'Jardín'],
    element: 'tierra'
  },
  {
    id: 7,
    name: 'Animales',
    keywords: ['animal', 'bestia', 'criatura', 'salvaje'],
    meanings: {
      positive: 'Instintos naturales, poder personal, conexión con la naturaleza, guía espiritual.',
      negative: 'Impulsos incontrolados, miedos primitivos, aspectos salvajes reprimidos.',
      spiritual: 'Cada animal porta un mensaje específico del reino espiritual.'
    },
    relatedSymbols: ['Serpiente', 'Pájaros', 'Lobo'],
    element: 'tierra'
  },
  {
    id: 8,
    name: 'Fuego',
    keywords: ['fuego', 'llamas', 'incendio', 'quemar', 'hoguera'],
    meanings: {
      positive: 'Pasión, transformación purificadora, creatividad, energía, iluminación.',
      negative: 'Destrucción incontrolada, ira, celos, pasiones destructivas, purificación dolorosa.',
      spiritual: 'El fuego sagrado que transforma y eleva, la chispa divina interior.'
    },
    relatedSymbols: ['Sol', 'Veloc', 'Dragón'],
    element: 'fuego'
  },
  {
    id: 9,
    name: 'Persecución',
    keywords: ['perseguir', 'huir', 'correr', 'escapar', 'acorralar'],
    meanings: {
      positive: 'Confrontar miedos, enfrentar aspectos evitados, coraje para mirar dentro.',
      negative: 'Evitación de problemas, ansiedad, trauma sin procesar, miedo paralizante.',
      spiritual: 'El perseguidor representa aspectos del sombra que exigen integración.'
    },
    relatedSymbols: ['Sombra', 'Caída', 'Monstruo'],
    element: 'aire'
  },
  {
    id: 10,
    name: 'Dientes',
    keywords: ['dientes', 'muelas', 'sonrisa', 'morder', 'dental'],
    meanings: {
      positive: 'Poder personal, capacidad de afectar el mundo, confianza, autoexpresión.',
      negative: 'Pérdida de poder, miedo al envejecimiento, ansiedad por autoimagen, impotencia.',
      spiritual: 'Los dientes representan el poder de asimilación y la capacidad de procesar experiencias.'
    },
    relatedSymbols: ['Boca', 'Comida', 'Animales'],
    element: 'tierra'
  },
  {
    id: 11,
    name: 'Desnudez',
    keywords: ['desnudo', 'desnudez', 'ropa', 'exposición'],
    meanings: {
      positive: 'Autenticidad, vulnerabilidad valiente, liberación de máscaras, verdad.',
      negative: 'Vulnerabilidad no deseada, vergüenza, miedo a ser visto, exposición.',
      spiritual: 'El alma desnuda ante el universo, despojarse de identificaciones superficiales.'
    },
    relatedSymbols: ['Agua', 'Infancia', 'Escenario'],
    element: 'espíritu'
  },
  {
    id: 12,
    name: 'Bebé',
    keywords: ['bebé', 'niño', 'infante', 'nacimiento', 'embarazo'],
    meanings: {
      positive: 'Nuevos comienzos, potencial infinito, inocencia, creatividad naciente.',
      negative: 'Dependencia, inmadurez, necesidades no atendidas del niño interior.',
      spiritual: 'El nacimiento del ser crístico interior, nueva fase evolutiva del alma.'
    },
    relatedSymbols: ['Nacimiento', 'Casa', 'Familia'],
    element: 'agua'
  },
  {
    id: 13,
    name: 'Luna',
    keywords: ['luna', 'noche', 'oscuridad', 'claro de luna'],
    meanings: {
      positive: 'Intuición, feminidad, ciclos naturales, emociones profundas, misterios.',
      negative: 'Locura, confusión, emociones descontroladas, miedos nocturnos.',
      spiritual: 'La Diosa Luna iluminando los misterios del subconsciente.'
    },
    relatedSymbols: ['Sol', 'Estrellas', 'Noche'],
    element: 'espíritu'
  },
  {
    id: 14,
    name: 'Sol',
    keywords: ['sol', 'luz', 'día', 'brillo', 'amanecer'],
    meanings: {
      positive: 'Vitalidad, éxito, claridad, poder personal, iluminación, conciencia.',
      negative: 'Exposición excesiva, arrogancia, fuerza dominante, padre herido.',
      spiritual: 'El Yo Superior brillando con luz propia, la conciencia iluminada.'
    },
    relatedSymbols: ['Luna', 'Fuego', 'Estrellas'],
    element: 'fuego'
  },
  {
    id: 15,
    name: 'Viaje',
    keywords: ['viaje', 'camino', 'ruta', 'destino', 'viajar'],
    meanings: {
      positive: 'Progreso, búsqueda espiritual, aventura, crecimiento, nuevos horizontes.',
      negative: 'Sentirse perdido, falta de dirección, huir de problemas, desarraigo.',
      spiritual: 'El viaje del héroe, el camino del alma hacia su destino.'
    },
    relatedSymbols: ['Vuelo', 'Carretera', 'Montaña'],
    element: 'aire'
  },
  {
    id: 16,
    name: 'Montaña',
    keywords: ['montaña', 'cima', 'pico', 'escalada', 'altura'],
    meanings: {
      positive: 'Logros, superación, perspectiva elevada, metas altas, conquista.',
      negative: 'Obstáculos abrumadores, metas inalcanzables, arrogancia, aislamiento.',
      spiritual: 'La montaña sagrada, conexión entre tierra y cielo, ascenso espiritual.'
    },
    relatedSymbols: ['Caída', 'Viaje', 'Cueva'],
    element: 'tierra'
  },
  {
    id: 17,
    name: 'Árbol',
    keywords: ['árbol', 'bosque', 'raíces', 'hojas', 'frutos'],
    meanings: {
      positive: 'Crecimiento, conexión tierra-cielo, vida, estabilidad, sabiduría.',
      negative: 'Estancamiento, raíces tóxicas, desconexión, muerte de aspectos.',
      spiritual: 'El Árbol de la Vida, eje del mundo que conecta todos los planos.'
    },
    relatedSymbols: ['Bosque', 'Jardín', 'Frutos'],
    element: 'tierra'
  },
  {
    id: 18,
    name: 'Espejo',
    keywords: ['espejo', 'reflejo', 'imagen', 'ver'],
    meanings: {
      positive: 'Autoconocimiento, verdad, reflexión, claridad sobre uno mismo.',
      negative: 'Narcisismo, rechazo a verse, autoimagen distorsionada, engaño.',
      spiritual: 'El espejo del alma, ver más allá de las apariencias hacia la esencia.'
    },
    relatedSymbols: ['Agua', 'Desnudez', 'Rostro'],
    element: 'espíritu'
  },
  {
    id: 19,
    name: 'Puerta',
    keywords: ['puerta', 'entrada', 'salida', 'portal', 'umbral'],
    meanings: {
      positive: 'Oportunidades, nuevas etapas, acceso, elección, posibilidades.',
      negative: 'Barreras, oportunidades perdidas, miedo a entrar, encierro.',
      spiritual: 'El portal entre mundos, umbrales de iniciación y transformación.'
    },
    relatedSymbols: ['Casa', 'Llave', 'Camino'],
    element: 'espíritu'
  },
  {
    id: 20,
    name: 'Pájaros',
    keywords: ['pájaro', 'ave', 'volar', 'alas', 'plumas'],
    meanings: {
      positive: 'Libertad, perspectiva, mensaje espiritual, trascendencia, alma.',
      negative: 'Pérdida de libertad, malos presagios, pensamientos intrusivos.',
      spiritual: 'Mensajeros entre el cielo y la tierra, el alma en su forma más libre.'
    },
    relatedSymbols: ['Vuelo', 'Cielo', 'Plumas'],
    element: 'aire'
  }
]

export function getDreamSymbolById(id: number): DreamSymbol | undefined {
  return dreamSymbols.find(symbol => symbol.id === id)
}

export function getDreamSymbolByName(name: string): DreamSymbol | undefined {
  return dreamSymbols.find(symbol => 
    symbol.name.toLowerCase() === name.toLowerCase() ||
    symbol.keywords.some(k => k.toLowerCase().includes(name.toLowerCase()))
  )
}

export function analyzeDreamContent(content: string): DreamSymbol[] {
  const foundSymbols: DreamSymbol[] = []
  const lowerContent = content.toLowerCase()
  
  for (const symbol of dreamSymbols) {
    if (lowerContent.includes(symbol.name.toLowerCase())) {
      foundSymbols.push(symbol)
      continue
    }
    
    for (const keyword of symbol.keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        if (!foundSymbols.find(s => s.id === symbol.id)) {
          foundSymbols.push(symbol)
        }
        break
      }
    }
  }
  
  return foundSymbols
}

export function getDreamSymbolsByElement(element: DreamSymbol['element']): DreamSymbol[] {
  return dreamSymbols.filter(symbol => symbol.element === element)
}
