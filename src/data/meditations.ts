export interface Meditation {
  id: number
  name: string
  description: string
  duration: number // in minutes
  category: 'chakras' | 'visualizacion' | 'relajacion' | 'espiritual' | 'sanacion' | 'abundancia'
  level: 'principiante' | 'intermedio' | 'avanzado'
  guide: string
  benefits: string[]
  steps: string[]
  affirmations: string[]
  music?: string
  imagePrompt: string
}

export const meditations: Meditation[] = [
  {
    id: 1,
    name: 'Despertar de Chakras',
    description: 'Un viaje a través de los siete centros energéticos principales, activando y equilibrando cada chakra desde la raíz hasta la corona.',
    duration: 20,
    category: 'chakras',
    level: 'intermedio',
    guide: 'Comenzando desde la base de tu columna, imagina una luz roja brillante girando en sentido horario...',
    benefits: [
      'Equilibra todo el sistema energético',
      'Aumenta la vitalidad y la claridad mental',
      'Promueve la sanación física y emocional',
      'Facilita la conexión espiritual'
    ],
    steps: [
      'Siéntate cómodamente con la espalda recta. Cierra los ojos y respira profundamente tres veces.',
      'Visualiza una luz roja en la base de tu columna. Siente cómo gira y se expande con cada respiración.',
      'Mueve tu atención al bajo abdomen. Imagina una luz naranja brillante girando suavemente.',
      'Sube al plexo solar, visualizando un sol amarillo radiante que te llena de poder personal.',
      'Dirígete al centro del pecho. Una luz verde esmeralda irradia amor incondicional.',
      'En tu garganta, una luz azul celeste facilita tu expresión verdadera.',
      'Entre tus cejas, una luz índigo profunda despierta tu intuición.',
      'Finalmente, en la coronilla, una luz violeta te conecta con lo divino.',
      'Siente todos los chakras vibrando en armonía. Respira en esta unidad.',
      'Gradualmente, regresa a tu cuerpo y abre los ojos cuando estés listo.'
    ],
    affirmations: [
      'Mis chakras están abiertos y en equilibrio perfecto.',
      'La energía fluye libremente a través de todo mi ser.',
      'Estoy conectado/a con mi poder interior.'
    ],
    music: 'Sonidos ambientales suaves con cuencos tibetanos',
    imagePrompt: 'Seven chakras glowing along spine, rainbow energy'
  },
  {
    id: 2,
    name: 'Bosque Mágico',
    description: 'Una visualización guiada que te lleva a través de un antiguo bosque encantado donde la sabiduría de la naturaleza te espera.',
    duration: 15,
    category: 'visualizacion',
    level: 'principiante',
    guide: 'Te encuentras en el borde de un bosque antiguo. Los árboles se alzan como guardianes sabios...',
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Conecta con la energía de la naturaleza',
      'Desarrolla la imaginación creativa',
      'Proporciona una sensación de paz profunda'
    ],
    steps: [
      'Cierra los ojos y respira profundamente. Con cada exhalación, suelta las tensiones del día.',
      'Imagina que estás de pie ante un sendero que entra en un bosque antiguo y mágico.',
      'Camina por el sendero. Los árboles se curvan suavemente sobre ti, creando un túnel de hojas.',
      'La luz del sol se filtra entre las ramas, creando patrones danzantes en el suelo del bosque.',
      'Escucha el sonido de un arroyo cercano. El agua cristalina fluye sobre piedras suaves.',
      'Un animal del bosque se acerca a ti. Quizás un ciervo, un búho o un zorro. Te mira con ojos sabios.',
      'Este animal tiene un mensaje para ti. Siéntate en silencio y recibe su sabiduría.',
      'Agradece a tu guía del bosque. Comienza a caminar de regreso por el sendero.',
      'Trae contigo la paz del bosque. Respira profundo y abre los ojos.'
    ],
    affirmations: [
      'La sabiduría de la naturaleza vive en mí.',
      'Encuentro paz en los espacios verdes de mi mente.',
      'Estoy conectado/a con la tierra y sus criaturas.'
    ],
    music: 'Sonidos de naturaleza: pájaros, agua, viento entre árboles',
    imagePrompt: 'Enchanted forest with golden sunlight filtering through ancient trees'
  },
  {
    id: 3,
    name: 'Relajación Profunda',
    description: 'Una técnica de relajación muscular progresiva que libera la tensión acumulada en cada parte del cuerpo.',
    duration: 25,
    category: 'relajacion',
    level: 'principiante',
    guide: 'Tensa cada grupo muscular mientras inhalas, y suelta completamente mientras exhalas...',
    benefits: [
      'Libera la tensión física acumulada',
      'Mejora la calidad del sueño',
      'Reduce dolores musculares relacionados con el estrés',
      'Calma el sistema nervioso'
    ],
    steps: [
      'Acuéstate boca arriba en una posición cómoda. Cierra los ojos y respira naturalmente.',
      'Comienza con tus pies. Tensa todos los músculos de los pies durante 5 segundos. Suelta completamente.',
      'Sube a tus pantorrillas. Tensa, sostén, suelta. Siente la diferencia entre tensión y relajación.',
      'Continúa con los muslos. Tensa fuerte, luego deja que se hundan pesadamente.',
      'Ahora tus glúteos y caderas. Aprieta, luego suelta. Siente cómo tu cuerpo se vuelve más pesado.',
      'Pasa al abdomen. Tensa como si fueras a recibir un golpe, luego exhala y relaja completamente.',
      'Tus manos: aprieta los puños fuerte, luego ábrelos y siente la calma.',
      'Los brazos: dobla los bíceps con fuerza, luego déjalos caer pesadamente.',
      'Los hombros: llévalos hacia las orejas, luego déjalos caer completamente.',
      'Tu rostro: arruga toda la cara, luego suaviza cada línea. Tu mandíbula está relajada.',
      'Todo tu cuerpo está ahora pesado y relajado. Permanece en este estado de paz.'
    ],
    affirmations: [
      'Mi cuerpo está completamente relajado y en paz.',
      'Suelgo toda tensión y abrazo la calma.',
      'Mi mente y cuerpo descansan en armonía.'
    ],
    music: 'Música ambiental suave, frecuencias de ondas delta',
    imagePrompt: 'Person in deep relaxation, floating on calm water under starlight'
  },
  {
    id: 4,
    name: 'Sanación del Niño Interior',
    description: 'Un viaje compasivo para reconectar y sanar a tu niño/a interior, liberando heridas emocionales del pasado.',
    duration: 30,
    category: 'sanacion',
    level: 'avanzado',
    guide: 'Imagina que entras en una habitación especial donde tu yo más joven te espera...',
    benefits: [
      'Sana heridas emocionales de la infancia',
      'Recupera la capacidad de jugar y disfrutar',
      'Aumenta la compasión hacia uno mismo',
      'Libera patrones heredados que ya no sirven'
    ],
    steps: [
      'Encuentra un espacio seguro y privado. Respira profundamente y entra en un estado meditativo.',
      'Visualiza una habitación cálida y acogedora. Hay juguetes, dibujos y objetos de tu infancia.',
      'En un rincón, ves a tu niño/a interior. Observa su edad, su apariencia, su estado emocional.',
      'Acércate lentamente. El niño/a te mira con una mezcla de esperanza y miedo.',
      'Arrodíllate a su altura. Míralo/a a los ojos con todo el amor que puedes dar.',
      'Dile: "Estoy aquí ahora. Te veo. Te amo. Estás a salvo conmigo."',
      'Escucha lo que el niño/a tiene que decir. Tal vez necesita expresar dolor, miedo o necesidades.',
      'Abraza a tu niño/a interior. Siente cómo se funden en un abrazo sanador.',
      'Promete que siempre estarás ahí. Que nunca más estará solo/a o desprotegido/a.',
      'Juntos, caminen hacia una luz cálida. El niño/a se integra en tu ser adulto sanado.',
      'Regresa lentamente, trayendo contigo esta nueva integración y paz.'
    ],
    affirmations: [
      'Amo y protejo a mi niño/a interior incondicionalmente.',
      'Las heridas del pasado se transforman en sabiduría.',
      'Soy el adulto amoroso que mi niño/a interior siempre necesitó.'
    ],
    music: 'Melodía suave de piano con frecuencias de sanación 528Hz',
    imagePrompt: 'Adult embracing their inner child in a warm golden light'
  },
  {
    id: 5,
    name: 'Templo de la Abundancia',
    description: 'Una visualización para abrir tu conciencia a la prosperidad y manifestar abundancia en todas las áreas de tu vida.',
    duration: 20,
    category: 'abundancia',
    level: 'intermedio',
    guide: 'Entras en un templo dorado donde la abundancia del universo fluye sin límites...',
    benefits: [
      'Abre la conciencia a la prosperidad',
      'Libera bloqueos hacia la abundancia',
      'Actitud mental positiva hacia el éxito',
      'Alineación con la energía de la receptividad'
    ],
    steps: [
      'Siéntate cómodamente. Visualiza una luz dorada entrando por tu coronilla.',
      'Imagina que flotas hacia un hermoso templo hecho de luz dorada y cristal.',
      'Entras al templo. El suelo es de mármol brillante, las columnas de cristal refractan luz dorada.',
      'En el centro del templo hay una fuente de luz líquida dorada: es la esencia de la abundancia universal.',
      'Te acercas a la fuente. Sumerge tus manos en la luz dorada. Siente cómo fluye a través de ti.',
      'Bebe de esta luz. Siente cómo llena cada célula de tu cuerpo con prosperidad.',
      'Mira alrededor: ves manifestaciones de abundancia en todas las formas que deseas.',
      'Declara en voz alta o mentalmente: "Soy un canal abierto para la abundancia infinita."',
      'Siente gratitud por la abundancia que ya existe en tu vida y la que está por llegar.',
      'El templo se desvanece, pero la luz dorada permanece en ti. Abre los ojos listo/a para recibir.'
    ],
    affirmations: [
      'La abundancia del universo fluye hacia mí sin esfuerzo.',
      'Merezco toda la prosperidad que recibo.',
      'Soy un imán para las bendiciones en todas sus formas.'
    ],
    music: 'Música inspiradora con cuerdas doradas y frecuencias de 432Hz',
    imagePrompt: 'Golden temple interior with flowing light fountain'
  },
  {
    id: 6,
    name: 'Luz de Sanación',
    description: 'Una meditación de sanación que dirige luz curativa a cada parte de tu cuerpo que necesita atención.',
    duration: 20,
    category: 'sanacion',
    level: 'intermedio',
    guide: 'Una luz blanca sanadora desciende desde el universo hacia cada célula de tu cuerpo...',
    benefits: [
      'Apoya los procesos de sanación del cuerpo',
      'Reduce el dolor y la inflamación',
      'Fortalece el sistema inmunológico',
      'Promueve la regeneración celular'
    ],
    steps: [
      'Acuéstate cómodamente. Cierra los ojos y respira lenta y profundamente.',
      'Visualiza un rayo de luz blanca brillante descendiendo desde el universo hacia tu coronilla.',
      'La luz entra por tu cabeza y se dispersa por cada célula de tu cerebro, sanando y limpiando.',
      'La luz baja por tu cuello, hombros y brazos. Siente cómo tus manos se llenan de esta energía curativa.',
      'La luz llega a tu pecho. Tu corazón brilla intensamente. Siente el latido de vida y salud.',
      'Continúa hacia tu abdomen. Visualiza cada órgano bañado en luz blanca sanadora.',
      'La luz recorre tu columna vertebral, de arriba abajo, alineando y sanando.',
      'Llega a tus caderas, muslos, rodillas, pantorrillas y finalmente tus pies.',
      'Todo tu cuerpo es ahora una columna de luz blanca. Permanece en esta estado de sanación.',
      'Agradece a tu cuerpo por todo lo que hace. Abre los ojos sintiéndote renovado/a.'
    ],
    affirmations: [
      'Mi cuerpo tiene la sabiduría y el poder de sanarse.',
      'Cada célula de mi ser vibra con salud perfecta.',
      'La luz divina fluye a través de mí restaurando mi bienestar.'
    ],
    music: 'Frecuencias de sanación 528Hz con sonidos de cuencos de cristal',
    imagePrompt: 'Human body outline filled with white healing light'
  }
]

export function getMeditationById(id: number): Meditation | undefined {
  return meditations.find(meditation => meditation.id === id)
}

export function getMeditationsByCategory(category: Meditation['category']): Meditation[] {
  return meditations.filter(meditation => meditation.category === category)
}

export function getMeditationsByLevel(level: Meditation['level']): Meditation[] {
  return meditations.filter(meditation => meditation.level === level)
}
