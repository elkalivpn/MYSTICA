export interface CompatibilityResult {
  overall: number
  romance: number
  friendship: number
  communication: number
  passion: number
  summary: string
  strengths: string[]
  challenges: string[]
  advice: string
}

const elementCompatibility: Record<string, Record<string, number>> = {
  Fuego: { Fuego: 75, Tierra: 50, Aire: 90, Agua: 40 },
  Tierra: { Fuego: 50, Tierra: 80, Aire: 45, Agua: 85 },
  Aire: { Fuego: 90, Tierra: 45, Aire: 70, Agua: 55 },
  Agua: { Fuego: 40, Tierra: 85, Aire: 55, Agua: 75 }
}

const signElements: Record<string, string> = {
  Aries: 'Fuego', Leo: 'Fuego', Sagitario: 'Fuego',
  Tauro: 'Tierra', Virgo: 'Tierra', Capricornio: 'Tierra',
  Géminis: 'Aire', Libra: 'Aire', Acuario: 'Aire',
  Cáncer: 'Agua', Escorpio: 'Agua', Piscis: 'Agua'
}

const signStrengths: Record<string, string[]> = {
  Aries: ['pasión', 'iniciativa', 'valentía'],
  Tauro: ['lealtad', 'estabilidad', 'sensualidad'],
  Géminis: ['comunicación', 'versatilidad', 'ingenio'],
  Cáncer: ['cuidado', 'intuición', 'devoción'],
  Leo: ['generosidad', 'carisma', 'protección'],
  Virgo: ['dedicación', 'atención', 'servicio'],
  Libra: ['armonía', 'romance', 'diplomacia'],
  Escorpio: ['intensidad', 'profundidad', 'transformación'],
  Sagitario: ['aventura', 'optimismo', 'expansión'],
  Capricornio: ['compromiso', 'ambición', 'estructura'],
  Acuario: ['originalidad', 'libertad', 'amistad'],
  Piscis: ['empatía', 'romanticismo', 'espiritualidad']
}

const signChallenges: Record<string, string[]> = {
  Aries: ['impaciencia', 'impulsividad'],
  Tauro: ['terquedad', 'posesividad'],
  Géminis: ['inconsistencia', 'superficialidad'],
  Cáncer: ['susceptibilidad', 'dependencia'],
  Leo: ['ego', 'dramatismo'],
  Virgo: ['crítica', 'perfeccionismo'],
  Libra: ['indecisión', 'evitación'],
  Escorpio: ['celos', 'secretismo'],
  Sagitario: ['compromiso', 'tacto'],
  Capricornio: ['frialdad', 'trabajo excesivo'],
  Acuario: ['distancia emocional', 'rebeldía'],
  Piscis: ['escapismo', 'victimismo']
}

export function calculateCompatibility(sign1: string, sign2: string): CompatibilityResult {
  const element1 = signElements[sign1]
  const element2 = signElements[sign2]
  
  const baseScore = elementCompatibility[element1]?.[element2] || 60
  
  // Añadir variación basada en los signos específicos
  const sameSign = sign1 === sign2 ? 10 : 0
  const oppositeSign = isOpposite(sign1, sign2) ? 15 : 0
  
  const overall = Math.min(100, baseScore + sameSign + oppositeSign + Math.floor(Math.random() * 10))
  
  // Calcular scores individuales con variación
  const romance = Math.min(100, overall + Math.floor(Math.random() * 20) - 10)
  const friendship = Math.min(100, overall + Math.floor(Math.random() * 20) - 5)
  const communication = Math.min(100, overall + Math.floor(Math.random() * 15) - 5)
  const passion = Math.min(100, overall + Math.floor(Math.random() * 25) - 10)
  
  // Generar resumen
  const summary = generateSummary(sign1, sign2, overall)
  
  // Combinar fortalezas de ambos signos
  const strengths = generateStrengths(sign1, sign2)
  
  // Identificar desafíos
  const challenges = generateChallenges(sign1, sign2)
  
  // Consejo personalizado
  const advice = generateAdvice(sign1, sign2, overall)
  
  return {
    overall,
    romance,
    friendship,
    communication,
    passion,
    summary,
    strengths,
    challenges,
    advice
  }
}

function isOpposite(sign1: string, sign2: string): boolean {
  const opposites: Record<string, string> = {
    Aries: 'Libra', Libra: 'Aries',
    Tauro: 'Escorpio', Escorpio: 'Tauro',
    Géminis: 'Sagitario', Sagitario: 'Géminis',
    Cáncer: 'Capricornio', Capricornio: 'Cáncer',
    Leo: 'Acuario', Acuario: 'Leo',
    Virgo: 'Piscis', Piscis: 'Virgo'
  }
  return opposites[sign1] === sign2
}

function generateSummary(sign1: string, sign2: string, score: number): string {
  if (score >= 85) {
    return `¡Una conexión celestial! ${sign1} y ${sign2} tienen una compatibilidad excepcional. Sus energías se complementan de manera natural, creando una relación armoniosa y enriquecedora.`
  } else if (score >= 70) {
    return `Una conexión prometedora. ${sign1} y ${sign2} tienen mucho potencial juntos. Con comunicación y comprensión mutua, pueden construir algo hermoso.`
  } else if (score >= 55) {
    return `Una relación que requiere trabajo. ${sign1} y ${sign2} tienen diferencias significativas, pero estas pueden ser fuente de crecimiento si ambos están dispuestos a aprender.`
  } else {
    return `Un camino desafiante. ${sign1} y ${sign2} tienen energías muy diferentes. Necesitarán mucha paciencia y compromiso para hacer que funcione.`
  }
}

function generateStrengths(sign1: string, sign2: string): string[] {
  const s1 = signStrengths[sign1] || []
  const s2 = signStrengths[sign2] || []
  
  const combined = [
    `${sign1} aporta ${s1[0]} mientras ${sign2} contribuye con ${s2[0]}`,
    `Juntos pueden lograr el equilibrio entre ${s1[1]} y ${s2[1]}`,
    `La combinación de ${s1[2]} de ${sign1} y ${s2[2]} de ${sign2} es poderosa`
  ]
  
  return combined
}

function generateChallenges(sign1: string, sign2: string): string[] {
  const c1 = signChallenges[sign1] || []
  const c2 = signChallenges[sign2] || []
  
  return [
    `La ${c1[0]} de ${sign1} puede chocar con la ${c2[0]} de ${sign2}`,
    `Ambos deben trabajar en superar tendencias hacia ${c1[1]} y ${c2[1]}`,
    `Encontrar un punto medio entre sus diferentes estilos de comunicación`
  ]
}

function generateAdvice(sign1: string, sign2: string, score: number): string {
  const element1 = signElements[sign1]
  const element2 = signElements[sign2]
  
  if (element1 === element2) {
    return `Al compartir el elemento ${element1}, entienden instintivamente las necesidades del otro. Usen esta conexión para profundizar su vínculo, pero asegúrense de aportar novedad para evitar la monotonía.`
  }
  
  if (score >= 80) {
    return `Su alta compatibilidad no significa que no deban trabajar en la relación. Mantengan la comunicación abierta y nunca den por sentado el amor del otro.`
  } else if (score >= 60) {
    return `Enfóquense en apreciar sus diferencias en lugar de tratar de cambiar al otro. Sus perspectivas únicas enriquecen la relación cuando se respetan mutuamente.`
  } else {
    return `Esta relación requiere compromiso consciente de ambas partes. Establezcan expectativas claras y celebren cada pequeño logro juntos. El crecimiento vendrá con la paciencia.`
  }
}
