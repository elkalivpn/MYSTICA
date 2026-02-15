export interface NumerologyResult {
  number: number
  name: string
  description: string
  traits: string[]
  challenges: string[]
  lifePath: string
}

export interface FullNumerologyReading {
  lifePath: NumerologyResult
  destiny?: NumerologyResult
  soulUrge?: NumerologyResult
  personality?: NumerologyResult
  personalYear?: NumerologyResult
}

const numberMeanings: Record<number, NumerologyResult> = {
  1: {
    number: 1,
    name: 'El Líder',
    description: 'Los números 1 son pioneros naturales, líderes natos con una fuerza de voluntad inquebrantable. Representan el inicio, la individualidad y la capacidad de forjar nuevos caminos.',
    traits: ['Liderazgo', 'Independencia', 'Ambición', 'Creatividad', 'Determinación'],
    challenges: ['Puede ser dominante', 'Impaciencia', 'Testarudez', 'Arrogancia'],
    lifePath: 'Tu camino es liderar, innovar y ser pionero. Has venido a mostrar nuevos caminos y inspirar a otros con tu ejemplo.'
  },
  2: {
    number: 2,
    name: 'El Diplomático',
    description: 'Los números 2 son mediadores naturales, con un don para la armonía y la cooperación. Son sensibles, intuitivos y poseen una gran capacidad para entender a otros.',
    traits: ['Cooperación', 'Sensibilidad', 'Paciencia', 'Diplomacia', 'Intuición'],
    challenges: ['Indecisión', 'Sobre-sensibilidad', 'Dependencia', 'Evitación de conflictos'],
    lifePath: 'Tu camino es crear armonía, mediar y colaborar. Has venido a aprender sobre asociaciones y equilibrio.'
  },
  3: {
    number: 3,
    name: 'El Comunicador',
    description: 'Los números 3 son expresivos, creativos y optimistas. Tienen un don para la comunicación y la autoexpresión, brillando en las artes y las relaciones sociales.',
    traits: ['Creatividad', 'Expresión', 'Optimismo', 'Carisma', 'Versatilidad'],
    challenges: ['Superficialidad', 'Dispersión', 'Exageración', 'Dificultad para enfocarse'],
    lifePath: 'Tu camino es expresar, crear y comunicar. Has venido a traer alegría y belleza al mundo.'
  },
  4: {
    number: 4,
    name: 'El Constructor',
    description: 'Los números 4 son trabajadores dedicados, prácticos y orientados a construir cimientos sólidos. Representan la estabilidad, el orden y la perseverancia.',
    traits: ['Estabilidad', 'Trabajo duro', 'Practicidad', 'Organización', 'Lealtad'],
    challenges: ['Rigidez', 'Obstinación', 'Exceso de trabajo', 'Resistencia al cambio'],
    lifePath: 'Tu camino es construir, organizar y crear estructuras duraderas. Has venido a traer orden y estabilidad.'
  },
  5: {
    number: 5,
    name: 'El Libertador',
    description: 'Los números 5 son aventureros, versátiles y amantes de la libertad. Representan el cambio, la adaptabilidad y la búsqueda de nuevas experiencias.',
    traits: ['Libertad', 'Adaptabilidad', 'Curiosidad', 'Versatilidad', 'Aventura'],
    challenges: ['Impaciencia', 'Irresponsabilidad', 'Inconstancia', 'Exceso'],
    lifePath: 'Tu camino es explorar, cambiar y enseñar sobre la libertad. Has venido a experimentar la vida en todas sus formas.'
  },
  6: {
    number: 6,
    name: 'El Nutridor',
    description: 'Los números 6 son cuidadores naturales, responsables y llenos de amor. Representan la familia, el servicio y la armonía en el hogar.',
    traits: ['Responsabilidad', 'Amor', 'Protección', 'Armonía', 'Servicio'],
    challenges: ['Perfeccionismo', 'Control', 'Autosacrificio', 'Preocupación excesiva'],
    lifePath: 'Tu camino es nutrir, proteger y crear belleza. Has venido a amar y ser amado, a cuidar y enseñar compasión.'
  },
  7: {
    number: 7,
    name: 'El Buscador',
    description: 'Los números 7 son analíticos, místicos y buscadores de la verdad. Representan la sabiduría, la introspección y la conexión espiritual.',
    traits: ['Sabiduría', 'Análisis', 'Introspección', 'Espiritualidad', 'Perfección'],
    challenges: ['Aislamiento', 'Cinismo', 'Secretismo', 'Dificultad para conectar'],
    lifePath: 'Tu camino es buscar, investigar y encontrar la verdad. Has venido a profundizar en los misterios de la existencia.'
  },
  8: {
    number: 8,
    name: 'El Poderoso',
    description: 'Los números 8 son líderes poderosos, ambiciosos y materialmente exitosos. Representan la abundancia, el poder y el logro tangible.',
    traits: ['Poder', 'Ambición', 'Éxito', 'Autoridad', 'Eficiencia'],
    challenges: ['Materialismo', 'Control', 'Insensibilidad', 'Codicia'],
    lifePath: 'Tu camino es lograr, liderar y manifestar abundancia. Has venido a entender el poder verdadero y usarlo sabiamente.'
  },
  9: {
    number: 9,
    name: 'El Humanitario',
    description: 'Los números 9 son humanitarios, compasivos y espiritualmente evolucionados. Representan la culminación, el servicio a la humanidad y la sabiduría universal.',
    traits: ['Compasión', 'Humanitarismo', 'Sabiduría', 'Generosidad', 'Idealismo'],
    challenges: ['Victimismo', 'Desapego excesivo', 'Resentimiento', 'Auto-sacrificio'],
    lifePath: 'Tu camino es servir, completar y elevar. Has venido a dejar ir lo viejo y abrazar el bien mayor.'
  },
  11: {
    number: 11,
    name: 'El Maestro Iluminador',
    description: 'El 11 es un Número Maestro que combina la intuición del 2 con la maestría espiritual. Representan la iluminación, la inspiración y la conexión con planos superiores.',
    traits: ['Intuición', 'Inspiración', 'Espiritualidad', 'Visionario', 'Sensibilidad psíquica'],
    challenges: ['Nerviosismo', 'Auto-duda', 'Sensibilidad extrema', 'Dificultad para aterrizar'],
    lifePath: 'Tu camino es iluminar, inspirar y elevar la conciencia colectiva. Has venido como puente entre mundos.'
  },
  22: {
    number: 22,
    name: 'El Maestro Constructor',
    description: 'El 22 es el Número Maestro más poderoso, combinando la visión del 11 con la capacidad de manifestación del 4. Pueden transformar sueños en realidad tangible.',
    traits: ['Maestría', 'Manifestación', 'Visión', 'Liderazgo global', 'Poder constructivo'],
    challenges: ['Perfeccionismo extremo', 'Autocrítica', 'Presión', 'Miedo al fracaso'],
    lifePath: 'Tu camino es construir en grande, crear legados duraderos. Has venido a materializar visiones que benefician a muchos.'
  },
  33: {
    number: 33,
    name: 'El Maestro Sanador',
    description: 'El 33 es el Número Maestro del amor incondicional y la sanación. Representan la maestría en el servicio desinteresado y la elevación espiritual.',
    traits: ['Amor incondicional', 'Sanación', 'Enseñanza espiritual', 'Compasión', 'Elevación'],
    challenges: ['Mártir', 'Desgaste emocional', 'Expectativas irreales', 'Auto-negación'],
    lifePath: 'Tu camino es sanar, amar y elevar. Has venido a encarnar el amor más puro y enseñar compasión verdadera.'
  }
}

// Calculate single digit or master number
function reduceToSingleDigit(num: number, keepMasterNumbers: boolean = true): number {
  if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
    return num
  }
  
  while (num > 9) {
    if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num
    }
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  }
  
  return num
}

// Letter to number mapping (Pythagorean system)
const letterValues: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
}

// Vowels for Soul Urge calculation
const vowels = ['a', 'e', 'i', 'o', 'u']

// Calculate Life Path Number from birth date
export function calculateLifePath(birthDate: string): NumerologyResult {
  const [year, month, day] = birthDate.split('-').map(Number)
  
  // Reduce each component separately
  const reducedDay = reduceToSingleDigit(day, true)
  const reducedMonth = reduceToSingleDigit(month, true)
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    true
  )
  
  // Sum and reduce
  const total = reducedDay + reducedMonth + reducedYear
  const lifePathNumber = reduceToSingleDigit(total, true)
  
  return numberMeanings[lifePathNumber] || numberMeanings[1]
}

// Calculate Destiny Number from full name
export function calculateDestiny(fullName: string): NumerologyResult {
  const name = fullName.toLowerCase().replace(/[^a-z]/g, '')
  const total = name.split('').reduce((sum, letter) => sum + (letterValues[letter] || 0), 0)
  const destinyNumber = reduceToSingleDigit(total, true)
  
  return numberMeanings[destinyNumber] || numberMeanings[1]
}

// Calculate Soul Urge Number from vowels in name
export function calculateSoulUrge(fullName: string): NumerologyResult {
  const name = fullName.toLowerCase().replace(/[^a-z]/g, '')
  const vowelTotal = name
    .split('')
    .filter(letter => vowels.includes(letter))
    .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0)
  
  const soulUrgeNumber = reduceToSingleDigit(vowelTotal, true)
  
  return numberMeanings[soulUrgeNumber] || numberMeanings[1]
}

// Calculate Personality Number from consonants in name
export function calculatePersonality(fullName: string): NumerologyResult {
  const name = fullName.toLowerCase().replace(/[^a-z]/g, '')
  const consonantTotal = name
    .split('')
    .filter(letter => !vowels.includes(letter))
    .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0)
  
  const personalityNumber = reduceToSingleDigit(consonantTotal, true)
  
  return numberMeanings[personalityNumber] || numberMeanings[1]
}

// Calculate Personal Year Number
export function calculatePersonalYear(birthDate: string, year?: number): NumerologyResult {
  const [_, month, day] = birthDate.split('-').map(Number)
  const targetYear = year || new Date().getFullYear()
  
  const reducedDay = reduceToSingleDigit(day, false)
  const reducedMonth = reduceToSingleDigit(month, false)
  const reducedYear = reduceToSingleDigit(
    String(targetYear).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    false
  )
  
  const total = reducedDay + reducedMonth + reducedYear
  const personalYearNumber = reduceToSingleDigit(total, false)
  
  return numberMeanings[personalYearNumber] || numberMeanings[1]
}

// Get full numerology reading
export function getFullNumerologyReading(birthDate: string, fullName: string): FullNumerologyReading {
  return {
    lifePath: calculateLifePath(birthDate),
    destiny: calculateDestiny(fullName),
    soulUrge: calculateSoulUrge(fullName),
    personality: calculatePersonality(fullName),
    personalYear: calculatePersonalYear(birthDate)
  }
}

// Compatibility analysis
export function calculateNumerologyCompatibility(num1: number, num2: number): {
  score: number
  description: string
} {
  // Simplified compatibility matrix
  const compatibilityMatrix: Record<string, { score: number; description: string }> = {
    '1-1': { score: 60, description: 'Dos líderes pueden chocar, pero también pueden lograr grandes cosas si aprenden a colaborar.' },
    '1-2': { score: 80, description: 'Excelente combinación: el 1 lidera mientras el 2 apoya y media.' },
    '1-3': { score: 85, description: 'Gran conexión creativa y social. El 1 aporta dirección y el 3 alegría.' },
    '1-4': { score: 70, description: 'El 1 impulsa mientras el 4 construye. Pueden lograr mucho si respetan sus diferencias.' },
    '1-5': { score: 75, description: 'Ambos valoran la independencia. Aventura y liderazgo se combinan.' },
    '1-6': { score: 85, description: 'El 6 aporta el hogar que el 1 necesita. Buena combinación para familia.' },
    '1-7': { score: 65, description: 'El 7 necesita soledad mientras el 1 quiere acción. Requiere comprensión.' },
    '1-8': { score: 60, description: 'Ambos poderosos, pueden competir o colaborar. Necesitan equilibrio.' },
    '1-9': { score: 80, description: 'El 9 humaniza al 1. Buena combinación para proyectos altruistas.' },
    '2-2': { score: 85, description: 'Gran armonía y comprensión mutua. Pueden crear un hogar muy unido.' },
    '2-3': { score: 90, description: 'Excelente combinación de sensibilidad y expresión. Muy comunicativos.' },
    '2-4': { score: 85, description: 'Estabilidad y armonía perfectas. Gran base para construir juntos.' },
    '2-5': { score: 60, description: 'El 5 puede inquietar al 2. Necesitan encontrar equilibrio entre cambio y estabilidad.' },
    '2-6': { score: 95, description: 'Combinación armoniosa por excelencia. Amor y servicio mutuo.' },
    '2-7': { score: 80, description: 'Ambos intuitivos y sensibles. Profunda conexión espiritual.' },
    '2-8': { score: 75, description: 'El 8 aporta seguridad que el 2 valora. Buena colaboración.' },
    '2-9': { score: 85, description: 'Ambos compasivos y serviciales. Unión altruista.' },
    '3-3': { score: 75, description: 'Mucha creatividad pero pueden dispersarse. Necesitan enfoque.' },
    '3-4': { score: 65, description: 'El 4 puede frenar al 3, pero también lo puede estabilizar.' },
    '3-5': { score: 90, description: 'Aventura y expresión. Vida social activa y emocionante.' },
    '3-6': { score: 90, description: 'Creatividad y amor. Gran ambiente familiar y social.' },
    '3-7': { score: 70, description: 'El 7 puede ser demasiado serio para el 3. Necesitan equilibrio.' },
    '3-8': { score: 75, description: 'El 8 aporta estructura a las ideas del 3. Buena colaboración.' },
    '3-9': { score: 85, description: 'Ambos creativos y humanitarios. Proyectos artísticos compartidos.' },
    '4-4': { score: 80, description: 'Estabilidad doble. Pueden construir un imperio juntos.' },
    '4-5': { score: 55, description: 'Diferencias significativas. El 5 necesita libertad, el 4 estructura.' },
    '4-6': { score: 90, description: 'Hogar y estabilidad perfectos. Excelente para familia.' },
    '4-7': { score: 80, description: 'Ambos buscan la verdad de formas diferentes. Buena conexión.' },
    '4-8': { score: 85, description: 'Poder y construcción. Pueden lograr grandes éxitos materiales.' },
    '4-9': { score: 70, description: 'El 9 puede parecer muy idealista para el práctico 4.' },
    '5-5': { score: 70, description: 'Aventura doble pero pueden faltar estabilidad y compromiso.' },
    '5-6': { score: 65, description: 'El 6 quiere hogar, el 5 libertad. Requiere negociación.' },
    '5-7': { score: 80, description: 'Ambos buscan experiencia y conocimiento. Buena exploración juntos.' },
    '5-8': { score: 75, description: 'Éxito y aventura. Pueden lograr metas ambiciosas.' },
    '5-9': { score: 80, description: 'Ambos quieren expandir horizontes. Viajes y crecimiento.' },
    '6-6': { score: 85, description: 'Amor y hogar duplicados. Cuidado con el exceso de sacrificio.' },
    '6-7': { score: 75, description: 'El 7 puede ser distante para el cariñoso 6.' },
    '6-8': { score: 85, description: 'Éxito y familia. Buena combinación para construir juntos.' },
    '6-9': { score: 90, description: 'Amor y compasión. Gran conexión humanitaria.' },
    '7-7': { score: 80, description: 'Profunda conexión espiritual. Cuidado con el aislamiento.' },
    '7-8': { score: 70, description: 'Materialismo vs espiritualidad. Pueden aprender mucho el uno del otro.' },
    '7-9': { score: 85, description: 'Espiritualidad y humanitarismo. Búsqueda compartida de verdad.' },
    '8-8': { score: 65, description: 'Poder doble pero pueden competir. Necesitan colaboración.' },
    '8-9': { score: 80, description: 'El 9 humaniza al 8. Éxito con propósito mayor.' },
    '9-9': { score: 85, description: 'Humanitarismo compartido. Unión para causas mayores.' },
  }

  const key = num1 <= num2 ? `${num1}-${num2}` : `${num2}-${num1}`
  return compatibilityMatrix[key] || { score: 70, description: 'Conexión única que requiere exploración y comprensión mutua.' }
}
