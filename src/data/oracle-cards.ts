export interface OracleCard {
  id: number
  name: string
  message: string
  guidance: string
  affirmation: string
  element: 'fuego' | 'agua' | 'aire' | 'tierra' | 'espíritu'
  keywords: string[]
  color: string
  imagePrompt: string
}

export const oracleCards: OracleCard[] = [
  {
    id: 0,
    name: 'Despertar',
    message: 'El momento de despertar ha llegado. Tu conciencia se expande hacia nuevas dimensiones de comprensión.',
    guidance: 'Presta atención a las señales que el universo te envía. Un nuevo ciclo de claridad comienza ahora.',
    affirmation: 'Despierto a mi verdadera naturaleza y abrazo mi poder interior.',
    element: 'espíritu',
    keywords: ['conciencia', 'despertar', 'nuevo inicio', 'claridad'],
    color: 'from-purple-400 to-pink-500',
    imagePrompt: 'A mystical oracle card showing awakening consciousness, light breaking through darkness, purple and pink colors'
  },
  {
    id: 1,
    name: 'Abundancia',
    message: 'La abundancia fluye hacia ti desde todas las direcciones. El universo te provee más de lo que necesitas.',
    guidance: 'Abre tus manos y tu corazón para recibir. La gratitud multiplica las bendiciones.',
    affirmation: 'Soy un canal abierto para la abundancia infinita del universo.',
    element: 'tierra',
    keywords: ['prosperidad', 'recurso', 'fertilidad', 'gratitud'],
    color: 'from-green-400 to-yellow-500',
    imagePrompt: 'A mystical oracle card showing abundance, golden light, fruits and flowers, green and gold colors'
  },
  {
    id: 2,
    name: 'Transformación',
    message: 'Estás en medio de una poderosa transformación. Lo viejo cae para dar paso a lo nuevo.',
    guidance: 'No temas el cambio. Cada final es un disfraz de nuevo comienzo. Confía en el proceso.',
    affirmation: 'Abrazo la transformación como el camino hacia mi ser más auténtico.',
    element: 'fuego',
    keywords: ['cambio', 'renacimiento', 'evolución', 'poder'],
    color: 'from-orange-400 to-red-500',
    imagePrompt: 'A mystical oracle card showing transformation, phoenix rising, orange and red flames'
  },
  {
    id: 3,
    name: 'Sanación',
    message: 'Sanación profunda está disponible para ti ahora. Tu cuerpo, mente y espíritu se restauran.',
    guidance: 'Permítete recibir esta sanación. Suelta las heridas del pasado y abraza la plenitud del presente.',
    affirmation: 'Mi cuerpo, mente y espíritu se sanan completamente con cada respiración.',
    element: 'agua',
    keywords: ['restauración', 'paz', 'alivio', 'renovación'],
    color: 'from-blue-400 to-cyan-500',
    imagePrompt: 'A mystical oracle card showing healing, gentle hands, blue water energy, soothing light'
  },
  {
    id: 4,
    name: 'Intuición',
    message: 'Tu intuición es fuerte y clara. Los mensajes del alma fluyen sin obstáculos.',
    guidance: 'Confía en esas corazonadas. Tu guía interior te lleva siempre por el camino correcto.',
    affirmation: 'Mi intuición es mi brújula infalible en el viaje de la vida.',
    element: 'aire',
    keywords: ['percepción', 'guía interior', 'sabiduría', 'clarividencia'],
    color: 'from-indigo-400 to-purple-500',
    imagePrompt: 'A mystical oracle card showing intuition, third eye opening, indigo and purple light'
  },
  {
    id: 5,
    name: 'Conexión',
    message: 'Tu conexión con el universo se fortalece. No estás solo; eres parte de un todo mayor.',
    guidance: 'Nutre tus relaciones y tu conexión espiritual. La unidad es tu estado natural.',
    affirmation: 'Estoy profundamente conectado con todo lo que existe en el universo.',
    element: 'espíritu',
    keywords: ['unidad', 'relación', 'pertenencia', 'amor universal'],
    color: 'from-pink-400 to-rose-500',
    imagePrompt: 'A mystical oracle card showing connection, golden threads linking souls, pink and rose energy'
  },
  {
    id: 6,
    name: 'Protección',
    message: 'Estás rodeado de protección divina. Nada puede dañarte sin tu permiso espiritual.',
    guidance: 'Visualiza un escudo de luz a tu alrededor. Los ángeles y guías te custodian.',
    affirmation: 'Estoy protegido por la luz divina en todo momento y lugar.',
    element: 'espíritu',
    keywords: ['seguridad', 'resguardo', 'fe', 'ángel guardián'],
    color: 'from-white to-yellow-200',
    imagePrompt: 'A mystical oracle card showing protection, angel wings, golden shield, white light'
  },
  {
    id: 7,
    name: 'Creatividad',
    message: 'Tu chisca creativa brilla intensamente. El universo te invita a crear y expresar.',
    guidance: 'Deja fluir tu creatividad sin juicios. Cada acto creativo es una oración.',
    affirmation: 'Soy un canal de creatividad divina y mi expresión es sagrada.',
    element: 'fuego',
    keywords: ['inspiración', 'arte', 'expresión', 'manifestación'],
    color: 'from-yellow-400 to-orange-500',
    imagePrompt: 'A mystical oracle card showing creativity, colorful spark, artistic expression, yellow and orange'
  },
  {
    id: 8,
    name: 'Equilibrio',
    message: 'El equilibrio se restaura en tu vida. Armonía entre dar y recibir, hacer y ser.',
    guidance: 'Busca el punto medio en todo. La paz interior florece en el equilibrio.',
    affirmation: 'Encuentro armonía perfecta en cada aspecto de mi existencia.',
    element: 'tierra',
    keywords: ['armonía', 'centro', 'paz', 'moderación'],
    color: 'from-green-400 to-teal-500',
    imagePrompt: 'A mystical oracle card showing balance, scales in equilibrium, green and teal colors'
  },
  {
    id: 9,
    name: 'Propósito',
    message: 'Tu propósito de alma se revela. Cada experiencia te ha traído a este momento.',
    guidance: 'Reflexiona sobre qué hace cantar tu corazón. Tu misión está ahí.',
    affirmation: 'Vivo con propósito y cada día acercó más a mi misión sagrada.',
    element: 'espíritu',
    keywords: ['misión', 'destino', 'camino', 'significado'],
    color: 'from-purple-500 to-indigo-600',
    imagePrompt: 'A mystical oracle card showing purpose, glowing path, compass of light, purple and indigo'
  }
]

export function getOracleCardById(id: number): OracleCard | undefined {
  return oracleCards.find(card => card.id === id)
}

export function getRandomOracleCard(): OracleCard {
  return oracleCards[Math.floor(Math.random() * oracleCards.length)]
}

export function getOracleCardsByElement(element: OracleCard['element']): OracleCard[] {
  return oracleCards.filter(card => card.element === element)
}
