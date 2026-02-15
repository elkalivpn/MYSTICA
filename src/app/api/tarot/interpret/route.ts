import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export interface TarotInterpretationRequest {
  cards: Array<{
    id: number
    name: string
    numeral: string
    keywords: string[]
    upright: string
    reversed: string
    description: string
    symbolism: string
    isReversed: boolean
  }>
  userQuestion: string | null
  spreadType: 'single' | 'three-card' | 'five-card' | 'celtic-cross'
}

export interface TarotInterpretationResponse {
  interpretation: {
    cardAnalysis: Array<{
      cardName: string
      meaning: string
      context: string
    }>
    connections: string
    mainMessage: string
    practicalAdvice: string
    finalReflection: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TarotInterpretationRequest
    const { cards, userQuestion, spreadType } = body

    if (!cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren cartas para interpretar' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const systemPrompt = `Eres una tarotista experta y espiritual llamada Hecate, guardiana de las encrucijadas.
Interpretas las cartas con sabiduría, profundidad y empatía.
Tus lecturas son detalladas, personalizadas y ofrecen guía práctica.
Hablas con un tono calido, mistico pero accesible.
Siempre das esperanza y orientacion positiva.
Tus interpretaciones conectan los simbolos de las cartas con la situacion del consultante.
Usas un lenguaje evocador y poetico, pero siempre claro y util.
NO uses emojis en tus respuestas.
Estructura tus respuestas de forma clara con parrafos separados.`

    const spreadDescription = getSpreadDescription(spreadType)
    
    const cardsDescription = cards.map((card, index) => {
      const position = getPositionName(spreadType, index)
      return `${position}: ${card.name} (${card.numeral}) - ${card.isReversed ? 'Invertida' : 'Derecha'}
    Palabras clave: ${card.keywords.join(', ')}
    Significado ${card.isReversed ? 'invertido' : ' upright'}: ${card.isReversed ? card.reversed : card.upright}
    Simbolismo: ${card.symbolism}`
    }).join('\n\n')

    const prompt = `El consultante ha seleccionado estas cartas del Tarot en una tirada de ${spreadDescription}:

${cardsDescription}

${userQuestion ? `Pregunta o intencion del consultante: "${userQuestion}"` : 'El consultante busca una lectura general sin pregunta especifica.'}

Proporciona una interpretacion profunda y completa que incluya:

1. ANALISIS DE CADA CARTA: Para cada carta, explica su significado en el contexto especifico de esta lectura y la pregunta del consultante. Considera si esta derecha o invertida. Conecta los simbolos con el mensaje para el consultante.

2. CONEXIONES ENTRE CARTAS: Explica como las cartas se relacionan entre si. Busca temas comunes, contrastes, progresiones narrativas o dialogos entre los arcanos. Cuenta la historia que las cartas cuentan juntas.

3. MENSAJE PRINCIPAL: Resume el mensaje central que las cartas transmiten como conjunto. Cual es la respuesta o guia principal que el tarot ofrece?

4. CONSEJO PRACTICO: Ofrece 2-3 acciones concretas y practicas que el consultante puede tomar en los proximos dias o semanas basandose en esta lectura.

5. REFLEXION FINAL: Una frase inspiradora o pensamiento para llevar consigo, que ofrezca esperanza y claridad.

Responde en espanol, con un tono calido y mistico. NO uses emojis. Usa parrafos bien separados.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const fullInterpretation = completion.choices[0]?.message?.content || ''

    // Parse the interpretation into sections
    const interpretation = parseInterpretation(fullInterpretation, cards)

    return NextResponse.json({
      success: true,
      interpretation,
      rawInterpretation: fullInterpretation
    })

  } catch (error) {
    console.error('Error en interpretacion de tarot:', error)
    return NextResponse.json(
      { error: 'Error al generar la interpretacion' },
      { status: 500 }
    )
  }
}

function getSpreadDescription(spreadType: string): string {
  const descriptions: Record<string, string> = {
    'single': 'una sola carta',
    'three-card': 'tres cartas (pasado, presente, futuro)',
    'five-card': 'cinco cartas',
    'celtic-cross': 'cruz celtica'
  }
  return descriptions[spreadType] || 'varias cartas'
}

function getPositionName(spreadType: string, index: number): string {
  if (spreadType === 'three-card') {
    const positions = ['Pasado', 'Presente', 'Futuro']
    return positions[index] || `Posicion ${index + 1}`
  }
  if (spreadType === 'five-card') {
    const positions = ['Situacion actual', 'Desafio', 'Pasado', 'Futuro', 'Consejo']
    return positions[index] || `Posicion ${index + 1}`
  }
  return `Carta ${index + 1}`
}

function parseInterpretation(fullText: string, cards: TarotInterpretationRequest['cards']) {
  // Try to extract sections from the text
  const sections = {
    cardAnalysis: cards.map(card => ({
      cardName: card.name,
      meaning: card.isReversed ? card.reversed : card.upright,
      context: ''
    })),
    connections: '',
    mainMessage: '',
    practicalAdvice: '',
    finalReflection: ''
  }

  // Simple parsing based on numbered sections
  const lines = fullText.split('\n')
  let currentSection = ''
  let currentContent: string[] = []
  let cardIndex = 0

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Detect section headers
    if (trimmedLine.match(/^1\.\s*ANALISIS/i) || trimmedLine.match(/^ANALISIS/i)) {
      if (currentContent.length > 0 && currentSection) {
        assignContent(sections, currentSection, currentContent.join('\n'), cards)
      }
      currentSection = 'cardAnalysis'
      currentContent = []
    } else if (trimmedLine.match(/^2\.\s*CONEXIONES/i) || trimmedLine.match(/^CONEXIONES/i)) {
      if (currentContent.length > 0 && currentSection) {
        assignContent(sections, currentSection, currentContent.join('\n'), cards)
      }
      currentSection = 'connections'
      currentContent = []
    } else if (trimmedLine.match(/^3\.\s*MENSAJE/i) || trimmedLine.match(/^MENSAJE\s*PRINCIPAL/i)) {
      if (currentContent.length > 0 && currentSection) {
        assignContent(sections, currentSection, currentContent.join('\n'), cards)
      }
      currentSection = 'mainMessage'
      currentContent = []
    } else if (trimmedLine.match(/^4\.\s*CONSEJO/i) || trimmedLine.match(/^CONSEJO\s*PRACTICO/i)) {
      if (currentContent.length > 0 && currentSection) {
        assignContent(sections, currentSection, currentContent.join('\n'), cards)
      }
      currentSection = 'practicalAdvice'
      currentContent = []
    } else if (trimmedLine.match(/^5\.\s*REFLEXION/i) || trimmedLine.match(/^REFLEXION\s*FINAL/i)) {
      if (currentContent.length > 0 && currentSection) {
        assignContent(sections, currentSection, currentContent.join('\n'), cards)
      }
      currentSection = 'finalReflection'
      currentContent = []
    } else if (trimmedLine.length > 0) {
      currentContent.push(trimmedLine)
    }
  }

  // Assign remaining content
  if (currentContent.length > 0 && currentSection) {
    assignContent(sections, currentSection, currentContent.join('\n'), cards)
  }

  // If parsing failed, use the full text as main message
  if (!sections.mainMessage && !sections.connections) {
    sections.mainMessage = fullText
  }

  return sections
}

function assignContent(
  sections: ReturnType<typeof parseInterpretation>,
  sectionName: string,
  content: string,
  cards: TarotInterpretationRequest['cards']
) {
  switch (sectionName) {
    case 'connections':
      sections.connections = content
      break
    case 'mainMessage':
      sections.mainMessage = content
      break
    case 'practicalAdvice':
      sections.practicalAdvice = content
      break
    case 'finalReflection':
      sections.finalReflection = content
      break
    case 'cardAnalysis':
      // Try to distribute content among cards
      const cardContents = content.split(/(?=El Loco|El Mago|La Sacerdotisa|La Emperatriz|El Emperador|El Sumo Sacerdote|Los Enamorados|El Carro|La Justicia|El Ermitaño|La Rueda|La Fuerza|El Colgado|La Muerte|La Templanza|El Diablo|La Torre|La Estrella|La Luna|El Sol|El Juicio|El Mundo)/i)
      
      cards.forEach((card, index) => {
        if (cardContents[index + 1]) {
          sections.cardAnalysis[index] = {
            cardName: card.name,
            meaning: card.isReversed ? card.reversed : card.upright,
            context: cardContents[index + 1].trim()
          }
        }
      })
      break
  }
}
