export interface ZodiacSign {
  id: number
  name: string
  symbol: string
  element: 'Fuego' | 'Tierra' | 'Aire' | 'Agua'
  modality: 'Cardinal' | 'Fijo' | 'Mutable'
  planet: string
  dates: string
  description: string
  traits: {
    strengths: string[]
    weaknesses: string[]
    likes: string[]
    dislikes: string[]
  }
  compatibility: string[]
  color: string
  stone: string
  number: number
  day: string
}

export const zodiacSigns: ZodiacSign[] = [
  {
    id: 0,
    name: 'Aries',
    symbol: '♈',
    element: 'Fuego',
    modality: 'Cardinal',
    planet: 'Marte',
    dates: '21 Mar - 19 Abr',
    description: 'Aries es el primer signo del zodíaco, representando el inicio, la acción y el coraje. Los nacidos bajo este signo son pioneros naturales, llenos de energía y determinación. Su espíritu guerrero los impulsa a enfrentar desafíos con valentía y a liderar con decisión. Rigen la cabeza y tienden a actuar primero y pensar después.',
    traits: {
      strengths: ['Valentía', 'Determinación', 'Confianza', 'Entusiasmo', 'Honestidad'],
      weaknesses: ['Impaciencia', 'Impulsividad', 'Egoísmo', 'Mal genio', 'Competitividad excesiva'],
      likes: ['Comenzar proyectos', 'Desafíos físicos', 'Independencia', 'Ser líder', 'El adrenaline'],
      dislikes: ['Esperar', 'Seguir órdenes', 'La rutina', 'La lentitud', 'La injusticia']
    },
    compatibility: ['Leo', 'Sagitario', 'Géminis', 'Acuario'],
    color: 'Rojo',
    stone: 'Diamante',
    number: 9,
    day: 'Martes'
  },
  {
    id: 1,
    name: 'Tauro',
    symbol: '♉',
    element: 'Tierra',
    modality: 'Fijo',
    planet: 'Venus',
    dates: '20 Abr - 20 May',
    description: 'Tauro es el signo de la estabilidad, la sensualidad y la persistencia. Los taurinos valoran la seguridad material y emocional, disfrutando de los placeres sensuales de la vida. Son pacientes, leales y confiables, aunque pueden ser posesivos y resistentes al cambio. Su conexión con la tierra los hace prácticos y orientados a resultados tangibles.',
    traits: {
      strengths: ['Paciencia', 'Lealtad', 'Determinación', 'Practicidad', 'Sensualidad'],
      weaknesses: ['Terquedad', 'Posesividad', 'Materialismo', 'Pereza', 'Resistencia al cambio'],
      likes: ['Comodidad', 'Buena comida', 'Arte', 'Naturaleza', 'Estabilidad'],
      dislikes: ['Cambios repentinos', 'Inseguridad', 'Prisa', 'Ser presionado', 'Riesgos innecesarios']
    },
    compatibility: ['Virgo', 'Capricornio', 'Cáncer', 'Piscis'],
    color: 'Verde',
    stone: 'Esmeralda',
    number: 6,
    day: 'Viernes'
  },
  {
    id: 2,
    name: 'Géminis',
    symbol: '♊',
    element: 'Aire',
    modality: 'Mutable',
    planet: 'Mercurio',
    dates: '21 May - 20 Jun',
    description: 'Géminis representa la dualidad, la comunicación y la curiosidad intelectual. Los geminianos son versátiles, adaptables y tienen una mente rápida que salta de un tema a otro. Son comunicadores naturales que disfrutan del intercambio de ideas, aunque pueden parecer superficiales o indecisos. Su naturaleza dual les permite ver múltiples perspectivas.',
    traits: {
      strengths: ['Versatilidad', 'Comunicación', 'Inteligencia', 'Adaptabilidad', 'Curiosidad'],
      weaknesses: ['Superficialidad', 'Indecisión', 'Inconsistencia', 'Nerviosismo', 'Difícil compromiso'],
      likes: ['Aprender', 'Comunicar', 'Viajes cortos', 'Variedad', 'Estimulación mental'],
      dislikes: ['Rutina', 'Soledad prolongada', 'Aburrimiento', 'Restricciones', 'Profundidad excesiva']
    },
    compatibility: ['Libra', 'Acuario', 'Aries', 'Leo'],
    color: 'Amarillo',
    stone: 'Ágata',
    number: 5,
    day: 'Miércoles'
  },
  {
    id: 3,
    name: 'Cáncer',
    symbol: '♋',
    element: 'Agua',
    modality: 'Cardinal',
    planet: 'Luna',
    dates: '21 Jun - 22 Jul',
    description: 'Cáncer es el signo del hogar, la familia y las emociones profundas. Los cancerianos son intuitivos, protectores y profundamente conectados con sus raíces. Su caparazón externo protege un interior sensible y compasivo. Son los cuidadores naturales del zodíaco, aunque pueden ser manipuladores emocionales cuando se sienten amenazados.',
    traits: {
      strengths: ['Intuición', 'Lealtad', 'Cuidado', 'Tenacidad', 'Imaginación'],
      weaknesses: ['Sensibilidad extrema', 'Manipulación emocional', 'Apego al pasado', 'Cambios de humor', 'Auto-compasión'],
      likes: ['Hogar', 'Familia', 'Tradición', 'Cocinar', 'Coleccionar'],
      dislikes: ['Críticas', 'Extrañar', 'Conflictos familiares', 'Ser ignorado', 'Desarraigo']
    },
    compatibility: ['Escorpio', 'Piscis', 'Tauro', 'Virgo'],
    color: 'Blanco',
    stone: 'Perla',
    number: 2,
    day: 'Lunes'
  },
  {
    id: 4,
    name: 'Leo',
    symbol: '♌',
    element: 'Fuego',
    modality: 'Fijo',
    planet: 'Sol',
    dates: '23 Jul - 22 Ago',
    description: 'Leo es el signo del brillo personal, la creatividad y el liderazgo magnético. Los leoninos poseen un carisma natural que atrae atención donde quayan. Son generosos, leales y dramáticos, con un corazón tan grande como su ego. Su misión es brillar e inspirar a otros a hacer lo mismo, aunque deben cuidar no volverse arrogantes o excesivamente dominantes.',
    traits: {
      strengths: ['Carisma', 'Generosidad', 'Creatividad', 'Liderazgo', 'Lealtad'],
      weaknesses: ['Arrogancia', 'Dramatismo', 'Obstinación', 'Necesidad de atención', 'Egoísmo'],
      likes: ['Ser centro de atención', 'Admiración', 'Lujo', 'Entretenimiento', 'Niños'],
      dislikes: ['Ser ignorado', 'Críticas', 'El fracaso', 'Mediocridad', 'No ser apreciado']
    },
    compatibility: ['Aries', 'Sagitario', 'Géminis', 'Libra'],
    color: 'Dorado',
    stone: 'Rubí',
    number: 1,
    day: 'Domingo'
  },
  {
    id: 5,
    name: 'Virgo',
    symbol: '♍',
    element: 'Tierra',
    modality: 'Mutable',
    planet: 'Mercurio',
    dates: '23 Ago - 22 Sep',
    description: 'Virgo es el signo del servicio, el análisis y la perfección. Los virginianos tienen un ojo para los detalles que otros pasan por alto y un deseo de mejorar todo lo que tocan. Son prácticos, analíticos y humildes servidores, aunque pueden caer en la crítica excesiva y el perfeccionismo paralizante. Su pureza de intención los convierte en sanadores naturales.',
    traits: {
      strengths: ['Análisis', 'Organización', 'Servicio', 'Practicidad', 'Modestia'],
      weaknesses: ['Crítica excesiva', 'Preocupación', 'Perfeccionismo', 'Inseguridad', 'Hipocresía percibida'],
      likes: ['Orden', 'Salud', 'Aprender', 'Servir', 'Detalles'],
      dislikes: ['Caos', 'Suciedad', 'Ineficiencia', 'Irresponsabilidad', 'Atención excesiva']
    },
    compatibility: ['Tauro', 'Capricornio', 'Cáncer', 'Escorpio'],
    color: 'Verde oliva',
    stone: 'Zafiro',
    number: 5,
    day: 'Miércoles'
  },
  {
    id: 6,
    name: 'Libra',
    symbol: '♎',
    element: 'Aire',
    modality: 'Cardinal',
    planet: 'Venus',
    dates: '23 Sep - 22 Oct',
    description: 'Libra representa el equilibrio, la armonía y las relaciones. Los librianos son diplomáticos naturales que buscan la justicia y la belleza en todas las cosas. Son encantadores, sociables y estéticamente sensibles, aunque pueden ser indecisos y dependientes de la aprobación ajena. Su misión es crear armonía en un mundo de opuestos.',
    traits: {
      strengths: ['Diplomacia', 'Encanto', 'Justicia', 'Estética', 'Cooperación'],
      weaknesses: ['Indecisión', 'Evitación de conflictos', 'Dependencia', 'Superficialidad', 'Autocompasión'],
      likes: ['Armonía', 'Belleza', 'Pareja', 'Arte', 'Justicia'],
      dislikes: ['Conflictos', 'Injusticia', 'Soledad', 'Vulgaridad', 'Decisiones difíciles']
    },
    compatibility: ['Géminis', 'Acuario', 'Leo', 'Sagitario'],
    color: 'Rosa',
    stone: 'Ópalo',
    number: 6,
    day: 'Viernes'
  },
  {
    id: 7,
    name: 'Escorpio',
    symbol: '♏',
    element: 'Agua',
    modality: 'Fijo',
    planet: 'Plutón',
    dates: '23 Oct - 21 Nov',
    description: 'Escorpio es el signo de la transformación, el poder y la profundidad emocional. Los escorpianos poseen una intensidad magnética que todo lo penetra. Son investigadores naturales del alma humana, capaces de ver más allá de las apariencias. Su poder de regeneración es legendario, aunque pueden volverse vengativos o manipuladores si se sienten traicionados.',
    traits: {
      strengths: ['Intensidad', 'Percepción', 'Determinación', 'Lealtad', 'Poder de transformación'],
      weaknesses: ['Celos', 'Venganza', 'Secretismo', 'Obsesión', 'Control'],
      likes: ['Misterio', 'Profundidad', 'Intimidad', 'Poder', 'Secretos'],
      dislikes: ['Superficialidad', 'Traición', 'Ser ignorado', 'Pérdida de control', 'Debilidades']
    },
    compatibility: ['Cáncer', 'Piscis', 'Virgo', 'Capricornio'],
    color: 'Negro',
    stone: 'Topacio',
    number: 8,
    day: 'Martes'
  },
  {
    id: 8,
    name: 'Sagitario',
    symbol: '♐',
    element: 'Fuego',
    modality: 'Mutable',
    planet: 'Júpiter',
    dates: '22 Nov - 21 Dic',
    description: 'Sagitario es el signo de la expansión, la aventura y la filosofía. Los sagitarianos son los exploradores del zodíaco, siempre buscando expandir sus horizontes a través del viaje, la educación y las experiencias. Son optimistas, generosos y amantes de la libertad, aunque pueden ser imprudentes y excesivamente francos. Su misión es encontrar y compartir la verdad.',
    traits: {
      strengths: ['Optimismo', 'Generosidad', 'Filosofía', 'Aventura', 'Honestidad'],
      weaknesses: ['Impaciencia', 'Tactlessness', 'Promesas incumplidas', 'Exceso', 'Irresponsabilidad'],
      likes: ['Viajar', 'Filosofía', 'Libertad', 'Humor', 'Deportes'],
      dislikes: ['Restricciones', 'Rutina', 'Pesimismo', 'Detalles', 'Claustrofobia emocional']
    },
    compatibility: ['Aries', 'Leo', 'Libra', 'Acuario'],
    color: 'Púrpura',
    stone: 'Turquesa',
    number: 3,
    day: 'Jueves'
  },
  {
    id: 9,
    name: 'Capricornio',
    symbol: '♑',
    element: 'Tierra',
    modality: 'Cardinal',
    planet: 'Saturno',
    dates: '22 Dic - 19 Ene',
    description: 'Capricornio es el signo de la ambición, la disciplina y el logro. Los capricornianos son los escaladores de montañas del zodíaco, persistentes y determinados en su ascenso hacia la cima. Son prácticos, responsables y maestros del autocontrol, aunque pueden parecer fríos o excesivamente orientados al trabajo. Su misión es construir estructuras duraderas.',
    traits: {
      strengths: ['Disciplina', 'Responsabilidad', 'Ambición', 'Paciencia', 'Practicidad'],
      weaknesses: ['Pesimismo', 'Obstinación', 'Materialismo', 'Frialdad', 'Exceso de trabajo'],
      likes: ['Logros', 'Estructura', 'Tradición', 'Éxito', 'Reconocimiento'],
      dislikes: ['Fracaso', 'Irresponsabilidad', 'Riesgos innecesarios', 'Pérdida de tiempo', 'Desorden']
    },
    compatibility: ['Tauro', 'Virgo', 'Escorpio', 'Piscis'],
    color: 'Marrón',
    stone: 'Granate',
    number: 4,
    day: 'Sábado'
  },
  {
    id: 10,
    name: 'Acuario',
    symbol: '♒',
    element: 'Aire',
    modality: 'Fijo',
    planet: 'Urano',
    dates: '20 Ene - 18 Feb',
    description: 'Acuario es el signo de la innovación, la humanidad y la libertad. Los acuarianos son visionarios que ven posibilidades donde otros solo ven lo establecido. Son independientes, humanitarios y originales, aunque pueden parecer distantes o rebeldes sin causa. Su misión es traer el futuro al presente y crear un mundo mejor para todos.',
    traits: {
      strengths: ['Originalidad', 'Humanitarismo', 'Independencia', 'Visión', 'Amistad'],
      weaknesses: ['Distanciamiento', 'Rebeldía', 'Terquedad', 'Emociones reprimidas', 'Impracticidad'],
      likes: ['Innovación', 'Humanidad', 'Libertad', 'Amistades', 'Tecnología'],
      dislikes: ['Restricciones', 'Tradición sin sentido', 'Prejuicios', 'Expresiones emocionales intensas', 'Autoridad injusta']
    },
    compatibility: ['Géminis', 'Libra', 'Aries', 'Sagitario'],
    color: 'Azul eléctrico',
    stone: 'Amatista',
    number: 7,
    day: 'Sábado'
  },
  {
    id: 11,
    name: 'Piscis',
    symbol: '♓',
    element: 'Agua',
    modality: 'Mutable',
    planet: 'Neptuno',
    dates: '19 Feb - 20 Mar',
    description: 'Piscis es el signo de la compasión, la espiritualidad y la imaginación. Los piscianos son los soñadores del zodíaco, con una sensibilidad que abarca todo el espectro emocional. Son intuitivos, artísticos y profundamente empáticos, aunque pueden ser escapistas y fácilmente influenciables. Su misión es conectar con lo divino y traer compasión al mundo.',
    traits: {
      strengths: ['Compasión', 'Intuición', 'Creatividad', 'Espiritualidad', 'Empatía'],
      weaknesses: ['Escapismo', 'Victimismo', 'Indecisión', 'Sensibilidad extrema', 'Adicciones'],
      likes: ['Soñar', 'Arte', 'Espiritualidad', 'Ayudar', 'Música'],
      dislikes: ['Crueldad', 'Realidad harsh', 'Críticas', 'Ser confrontado', 'Límites estrictos']
    },
    compatibility: ['Cáncer', 'Escorpio', 'Tauro', 'Capricornio'],
    color: 'Turquesa',
    stone: 'Aguamarina',
    number: 12,
    day: 'Jueves'
  }
]

export function getZodiacSignById(id: number): ZodiacSign | undefined {
  return zodiacSigns.find(sign => sign.id === id)
}

export function getZodiacSignByName(name: string): ZodiacSign | undefined {
  return zodiacSigns.find(sign => sign.name.toLowerCase() === name.toLowerCase())
}

export function getZodiacSignByDate(month: number, day: number): ZodiacSign {
  // Simplified date-based sign detection
  const dateRanges = [
    { sign: 'Capricornio', start: [12, 22], end: [1, 19] },
    { sign: 'Acuario', start: [1, 20], end: [2, 18] },
    { sign: 'Piscis', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Tauro', start: [4, 20], end: [5, 20] },
    { sign: 'Géminis', start: [5, 21], end: [6, 20] },
    { sign: 'Cáncer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Escorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagitario', start: [11, 22], end: [12, 21] },
  ]
  
  for (const range of dateRanges) {
    const [startMonth, startDay] = range.start
    const [endMonth, endDay] = range.end
    
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) {
        return getZodiacSignByName(range.sign)!
      }
    } else if (startMonth > endMonth) {
      // Handles Capricorn which spans year boundary
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return getZodiacSignByName(range.sign)!
      }
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return getZodiacSignByName(range.sign)!
      }
    }
  }
  
  return zodiacSigns[0]
}

export function getElementsBySign(signName: string): { element: string; compatible: string[] } {
  const sign = getZodiacSignByName(signName)
  if (!sign) return { element: '', compatible: [] }
  
  const elements = {
    Fuego: ['Aries', 'Leo', 'Sagitario'],
    Tierra: ['Tauro', 'Virgo', 'Capricornio'],
    Aire: ['Géminis', 'Libra', 'Acuario'],
    Agua: ['Cáncer', 'Escorpio', 'Piscis']
  }
  
  return {
    element: sign.element,
    compatible: elements[sign.element].filter(s => s !== signName)
  }
}
