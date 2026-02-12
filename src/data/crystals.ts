export interface Crystal {
  id: number
  name: string
  color: string
  chakra: string
  element: 'fuego' | 'agua' | 'aire' | 'tierra'
  zodiac: string[]
  properties: string[]
  benefits: string[]
  uses: string[]
  cleansing: string
  affirmation: string
  rarity: 'común' | 'poco común' | 'raro' | 'muy raro'
  imagePrompt: string
}

export const crystals: Crystal[] = [
  {
    id: 1,
    name: 'Amatista',
    color: 'Púrpura',
    chakra: 'Corona y Tercer Ojo',
    element: 'aire',
    zodiac: ['Piscis', 'Virgo', 'Acuario', 'Capricornio'],
    properties: ['Espiritualidad', 'Intuición', 'Protección psíquica', 'Meditación'],
    benefits: [
      'Calma la mente y promueve la claridad mental',
      'Mejora la calidad del sueño y ayuda con el insomnio',
      'Potencia la intuición y las habilidades psíquicas',
      'Protege contra energías negativas y ataques psíquicos',
      'Facilita la meditación y la conexión espiritual'
    ],
    uses: [
      'Colócala bajo la almohada para sueños lúcidos',
      'Úsala durante la meditación para profundizar la práctica',
      'Sitúala en tu espacio de trabajo para claridad mental',
      'Llévala como joyería para protección constante'
    ],
    cleansing: 'Luz de luna, humo de salvia, visualización con luz violeta',
    affirmation: 'Mi mente está clara y mi espíritu está protegido.',
    rarity: 'común',
    imagePrompt: 'Beautiful purple amethyst crystal cluster, mystical glow'
  },
  {
    id: 2,
    name: 'Cuarzo Cristal',
    color: 'Transparente/Blanco',
    chakra: 'Todos los chakras',
    element: 'tierra',
    zodiac: ['Todos los signos'],
    properties: ['Amplificación', 'Claridad', 'Programación', 'Sanación'],
    benefits: [
      'Amplifica la energía de otros cristales',
      'Clarifica pensamientos y emociones',
      'Puede programarse para cualquier intención',
      'Armoniza y alinea todos los chakras',
      'Mejora la concentración y el enfoque'
    ],
    uses: [
      'Úsalo para cargar otros cristales',
      'Prográmalo con afirmaciones específicas',
      'Colócalo en cualquier espacio para elevar la energía',
      'Medita sosteniéndolo para claridad'
    ],
    cleansing: 'Agua corriente, luz solar suave, tierra, cualquier método',
    affirmation: 'Soy un canal claro para la luz del universo.',
    rarity: 'común',
    imagePrompt: 'Clear quartz crystal point, pure white light'
  },
  {
    id: 3,
    name: 'Cuarzo Rosa',
    color: 'Rosa suave',
    chakra: 'Corazón',
    element: 'agua',
    zodiac: ['Tauro', 'Libra', 'Escorpio', 'Cáncer'],
    properties: ['Amor propio', 'Compasión', 'Sanación emocional', 'Paz interior'],
    benefits: [
      'Abre el corazón al amor propio y al amor universal',
      'Sanan heridas emocionales del pasado',
      'Promueve la paz y la calma interior',
      'Atrae el amor romántico y las amistades genuinas',
      'Ayuda a perdonar y soltar rencores'
    ],
    uses: [
      'Colócala en tu habitación para amor y armonía',
      'Úsala durante meditaciones de autocuración',
      'Llévala cerca del corazón para sanación emocional',
      'Gift it to strengthen relationships'
    ],
    cleansing: 'Luz de luna, agua de rose, visualización rosa',
    affirmation: 'Me amo profundamente y soy merecedor/a de amor.',
    rarity: 'común',
    imagePrompt: 'Soft pink rose quartz crystal heart shape'
  },
  {
    id: 4,
    name: 'Lapislázuli',
    color: 'Azul profundo con oro',
    chakra: 'Garganta y Tercer Ojo',
    element: 'agua',
    zodiac: ['Sagitario', 'Virgo', 'Libra', 'Acuario'],
    properties: ['Sabiduría', 'Verdad', 'Comunicación', 'Autoconocimiento'],
    benefits: [
      'Potencia la comunicación honesta y auténtica',
      'Desarrolla la sabiduría interior y el autoconocimiento',
      'Mejora la memoria y la concentración',
      'Facilita la expresión de la verdad personal',
      'Conecta con el conocimiento ancestral'
    ],
    uses: [
      'Úsalo durante presentaciones o conversaciones difíciles',
      'Medita con él para acceder a sabiduría ancestral',
      'Colócalo en el escritorio para claridad mental',
      'Llévalo como collar cerca de la garganta'
    ],
    cleansing: 'Luz de luna, visualización azul, evitar agua prolongada',
    affirmation: 'Mi voz expresa la verdad de mi alma.',
    rarity: 'poco común',
    imagePrompt: 'Deep blue lapis lazuli with golden pyrite flecks'
  },
  {
    id: 5,
    name: 'Ojo de Tigre',
    color: 'Dorado/Marrón',
    chakra: 'Plexo Solar y Raíz',
    element: 'fuego',
    zodiac: ['Leo', 'Capricornio', 'Aries'],
    properties: ['Protección', 'Confianza', 'Fuerza', 'Valentía'],
    benefits: [
      'Protege contra la negatividad y el mal de ojo',
      'Aumenta la confianza y el poder personal',
      'Proporciona coraje para enfrentar desafíos',
      'Ayuda a tomar decisiones con claridad',
      'Equilibra las emociones extremas'
    ],
    uses: [
      'Llévalo en el bolsillo para protección diaria',
      'Úsalo en situaciones que requieren coraje',
      'Colócalo en la entrada del hogar para protección',
      'Medita con él antes de decisiones importantes'
    ],
    cleansing: 'Luz solar breve, tierra, visualización dorada',
    affirmation: 'Poseo la fuerza y el coraje para enfrentar cualquier desafío.',
    rarity: 'común',
    imagePrompt: 'Golden brown tiger eye stone with chatoyancy'
  },
  {
    id: 6,
    name: 'Citrino',
    color: 'Amarillo/Dorado',
    chakra: 'Plexo Solar y Sacro',
    element: 'fuego',
    zodiac: ['Leo', 'Aries', 'Géminis'],
    properties: ['Abundancia', 'Energía', 'Creatividad', 'Felicidad'],
    benefits: [
      'Atrae la abundancia y la prosperidad',
      'Eleva el estado de ánimo y combate la depresión',
      'Potencia la creatividad y la motivación',
      'Transmuta la energía negativa en positiva',
      'Mejora la concentración y la determinación'
    ],
    uses: [
      'Colócalo en la caja registradora o zona de dinero',
      'Úsalo para manifestar abundancia',
      'Llévalo cuando necesites un impulso de energía',
      'Sitúalo en el escritorio para creatividad'
    ],
    cleansing: 'Luz solar, visualización dorada, no necesita limpieza frecuente',
    affirmation: 'La abundancia fluye hacia mí en todas sus formas.',
    rarity: 'poco común',
    imagePrompt: 'Bright golden yellow citrine crystal cluster'
  },
  {
    id: 7,
    name: 'Turmalina Negra',
    color: 'Negro',
    chakra: 'Raíz',
    element: 'tierra',
    zodiac: ['Escorpio', 'Capricornio', 'Libra'],
    properties: ['Protección', 'Grounding', 'Purificación', 'Escudo'],
    benefits: [
      'Poderosa protección contra energías negativas',
      'Grounding y conexión con la tierra',
      'Purifica el aura y los espacios',
      'Protege contra la radiación electromagnética',
      'Disipa el miedo y la ansiedad'
    ],
    uses: [
      'Colócalo cerca de ordenadores y electrónicos',
      'Llévalo para protección en lugares concurridos',
      'Sitúalo en las esquinas del hogar para protección',
      'Úsalo durante meditación de grounding'
    ],
    cleansing: 'Tierra, agua corriente, visualización negra absorbente',
    affirmation: 'Estoy protegido/a y conectado/a con la tierra.',
    rarity: 'común',
    imagePrompt: 'Black tourmaline crystal formation'
  },
  {
    id: 8,
    name: 'Selenita',
    color: 'Blanco perlado',
    chakra: 'Corona y Tercer Ojo',
    element: 'aire',
    zodiac: ['Tauro', 'Escorpio', 'Cáncer'],
    properties: ['Purificación', 'Conexión angelical', 'Claridad', 'Paz'],
    benefits: [
      'Limpia y carga otros cristales',
      'Facilita la conexión con guías espirituales',
      'Promueve la paz profunda y la serenidad',
      'Abre el chakra de la corona',
      'Ayuda a acceder a memorias de vidas pasadas'
    ],
    uses: [
      'Úsala para limpiar otros cristales',
      'Colócala en espacios de meditación',
      'Crea rejillas de sanación con ella',
      'Medita con ella para conexión espiritual'
    ],
    cleansing: 'No necesita limpieza, evita el agua',
    affirmation: 'La luz divina fluye a través de mí purificando todo.',
    rarity: 'común',
    imagePrompt: 'White pearlescent selenite wand'
  },
  {
    id: 9,
    name: 'Aguamarina',
    color: 'Azul claro',
    chakra: 'Garganta',
    element: 'agua',
    zodiac: ['Piscis', 'Acuario', 'Libra'],
    properties: ['Comunicación', 'Valentía', 'Calma', 'Viaje'],
    benefits: [
      'Mejora la comunicación clara y honesta',
      'Calma la ansiedad y reduce el estrés',
      'Fomenta el coraje para expresarse',
      'Protege a los viajeros, especialmente por agua',
      'Armoniza el chakra de la garganta'
    ],
    uses: [
      'Úsala antes de discursos o conversaciones importantes',
      'Llévala de viaje para protección',
      'Medita con ella para calmar la mente',
      'Colócala cerca durante la práctica de canto'
    ],
    cleansing: 'Agua de mar o salada, luz de luna, visualización azul',
    affirmation: 'Expreso mi verdad con valentía y claridad.',
    rarity: 'poco común',
    imagePrompt: 'Light blue aquamarine crystal gemstone'
  },
  {
    id: 10,
    name: 'Obsidiana Negra',
    color: 'Negro intenso',
    chakra: 'Raíz',
    element: 'tierra',
    zodiac: ['Escorpio', 'Sagitario', 'Capricornio'],
    properties: ['Protección', 'Sombra', 'Verdad', 'Grounding'],
    benefits: [
      'Revela verdades ocultas y la propia sombra',
      'Poderosa protección psíquica',
      'Ayuda a procesar experiencias traumáticas',
      'Grounding intenso y conexión terrenal',
      'Elimina bloqueos energéticos'
    ],
    uses: [
      'Úsala para trabajo de sombra profundo',
      'Colócala en el espacio personal para protección',
      'Medita con ella para enfrentar verdades',
      'Llévala durante procesos de transformación'
    ],
    cleansing: 'Agua corriente, tierra, visualización negra',
    affirmation: 'Abrazo mi sombra y emerge mi verdadero poder.',
    rarity: 'común',
    imagePrompt: 'Black obsidian volcanic glass stone'
  },
  {
    id: 11,
    name: 'Cuarzo Ahumado',
    color: 'Gris/Marrón ahumado',
    chakra: 'Raíz',
    element: 'tierra',
    zodiac: ['Escorpio', 'Sagitario', 'Capricornio'],
    properties: ['Grounding', 'Protección', 'Manifestación', 'Liberación'],
    benefits: [
      'Poderoso grounding y estabilidad',
      'Absorbe y transmuta energía negativa',
      'Ayuda a manifestar sueños en realidad',
      'Libera de miedos y emociones bloqueadas',
      'Protege contra la radiación electromagnética'
    ],
    uses: [
      'Llévalo para grounding diario',
      'Colócalo cerca de aparatos electrónicos',
      'Úsalo durante meditación de manifestación',
      'Sitúalo en el espacio de trabajo para enfoque'
    ],
    cleansing: 'Tierra, luz de luna, visualización marrón',
    affirmation: 'Estoy anclado/a en mi poder y manifiesto mis sueños.',
    rarity: 'común',
    imagePrompt: 'Smoky brown gray quartz crystal'
  },
  {
    id: 12,
    name: 'Piedra de Luna',
    color: 'Blanco con brillo azulado',
    chakra: 'Corona y Sacro',
    element: 'agua',
    zodiac: ['Cáncer', 'Libra', 'Escorpio'],
    properties: ['Intuición', 'Feminidad', 'Ciclos', 'Nuevos comienzos'],
    benefits: [
      'Potencia la intuición y la clarividencia',
      'Conecta con la energía de la Luna y sus ciclos',
      'Equilibra las emociones y el sistema hormonal',
      'Fomenta los nuevos comienzos',
      'Honra la energía femenina divina'
    ],
    uses: [
      'Úsala durante la luna llena para rituales',
      'Llévala para equilibrar emociones',
      'Colócala bajo la luna para cargar',
      'Medita con ella para despertar la intuición'
    ],
    cleansing: 'Luz de luna, agua de luna, visualización plateada',
    affirmation: 'Honro mis ciclos y confío en mi intuición.',
    rarity: 'poco común',
    imagePrompt: 'White moonstone with blue adularescence'
  }
]

export function getCrystalById(id: number): Crystal | undefined {
  return crystals.find(crystal => crystal.id === id)
}

export function getCrystalByName(name: string): Crystal | undefined {
  return crystals.find(crystal => crystal.name.toLowerCase() === name.toLowerCase())
}

export function getCrystalsByChakra(chakra: string): Crystal[] {
  return crystals.filter(crystal => crystal.chakra.toLowerCase().includes(chakra.toLowerCase()))
}

export function getCrystalsByZodiac(sign: string): Crystal[] {
  return crystals.filter(crystal => 
    crystal.zodiac.some(z => z.toLowerCase() === sign.toLowerCase() || z === 'Todos los signos')
  )
}

export function getCrystalsByElement(element: Crystal['element']): Crystal[] {
  return crystals.filter(crystal => crystal.element === element)
}
