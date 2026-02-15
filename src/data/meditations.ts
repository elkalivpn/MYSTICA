// ============================================
// MYSTICA - SISTEMA COMPLETO DE MEDITACIONES
// ============================================

// ==================== INTERFACES ====================

export interface Meditation {
  id: number
  name: string
  description: string
  duration: number // in minutes
  category: MeditationCategory
  level: MeditationLevel
  guide: string
  benefits: string[]
  steps: string[]
  affirmations: string[]
  music?: string
  imagePrompt: string
  tags?: string[]
  featured?: boolean
  premium?: boolean
}

export interface UnguidedMeditation {
  id: number
  name: string
  description: string
  duration: number
  category: string
  audioType: AudioType
  benefits: string[]
  frequency?: string
  color: string
  icon: string
  premium?: boolean
}

export interface MeditationProgram {
  id: number
  name: string
  description: string
  duration: string // e.g., "7 días", "30 días"
  level: MeditationLevel
  meditations: number[] // IDs of meditations
  benefits: string[]
  icon: string
  color: string
  premium?: boolean
}

export interface MeditationCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  count?: number
}

export type MeditationLevel = 'principiante' | 'intermedio' | 'avanzado'
export type AudioType = 'cuencos' | 'frecuencias' | 'naturaleza' | 'mantras' | 'ambiental' | 'binaural'

// ==================== CATEGORÍAS ====================

export const meditationCategories: MeditationCategory[] = [
  { id: 'chakras', name: 'Chakras', description: 'Equilibra tus centros energéticos', icon: '🔮', color: 'from-red-500 via-yellow-500 to-purple-500' },
  { id: 'visualizacion', name: 'Visualización', description: 'Viajes imaginarios transformadores', icon: '🌈', color: 'from-cyan-500 to-blue-500' },
  { id: 'relajacion', name: 'Relajación', description: 'Libera tensión y estrés', icon: '🍃', color: 'from-green-500 to-teal-500' },
  { id: 'espiritual', name: 'Espiritual', description: 'Conecta con tu esencia divina', icon: '✨', color: 'from-purple-500 to-pink-500' },
  { id: 'sanacion', name: 'Sanación', description: 'Restaura tu bienestar integral', icon: '💚', color: 'from-emerald-500 to-green-500' },
  { id: 'abundancia', name: 'Abundancia', description: 'Atrapa prosperidad y éxito', icon: '🌟', color: 'from-yellow-500 to-orange-500' },
  { id: 'dormir', name: 'Dormir', description: 'Descenso consciente al sueño', icon: '🌙', color: 'from-indigo-500 to-purple-500' },
  { id: 'ansiedad', name: 'Ansiedad', description: 'Calma tu mente inquieta', icon: '🧘', color: 'from-blue-500 to-cyan-500' },
  { id: 'autocompasion', name: 'Autocompasión', description: 'Ama y acepta tu ser', icon: '💗', color: 'from-pink-500 to-rose-500' },
  { id: 'gratitud', name: 'Gratitud', description: 'Cultiva agradecimiento', icon: '🙏', color: 'from-amber-500 to-yellow-500' },
  { id: 'perdon', name: 'Perdón', description: 'Libera el peso del resentimiento', icon: '🕊️', color: 'from-sky-500 to-blue-500' },
  { id: 'manifestacion', name: 'Manifestación', description: 'Crea tu realidad deseada', icon: '💫', color: 'from-violet-500 to-purple-500' },
  { id: 'concentracion', name: 'Concentración', description: 'Enfoca tu mente', icon: '🎯', color: 'from-orange-500 to-red-500' },
  { id: 'energia', name: 'Energía', description: 'Vitaliza tu cuerpo y mente', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
  { id: 'proteccion', name: 'Protección', description: 'Escudo energético y espiritual', icon: '🛡️', color: 'from-slate-500 to-gray-600' }
]

// ==================== MEDITACIONES GUIADAS ====================

export const meditations: Meditation[] = [
  // ----- CHAKRAS (3 meditaciones) -----
  {
    id: 1,
    name: 'Despertar de Chakras',
    description: 'Un viaje completo a través de los siete centros energéticos principales, activando y equilibrando cada chakra desde la raíz hasta la corona.',
    duration: 20,
    category: 'chakras',
    level: 'intermedio',
    guide: 'Comenzando desde la base de tu columna, imagina una luz roja brillante girando en sentido horario...',
    benefits: ['Equilibra todo el sistema energético', 'Aumenta la vitalidad y la claridad mental', 'Promueve la sanación física y emocional', 'Facilita la conexión espiritual'],
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
    affirmations: ['Mis chakras están abiertos y en equilibrio perfecto.', 'La energía fluye libremente a través de todo mi ser.', 'Estoy conectado/a con mi poder interior.'],
    music: 'Sonidos ambientales suaves con cuencos tibetanos',
    imagePrompt: 'Seven chakras glowing along spine, rainbow energy',
    featured: true
  },
  {
    id: 2,
    name: 'Chakra Corazón',
    description: 'Una meditación enfocada exclusivamente en el cuarto chakra, el centro del amor incondicional y la compasión.',
    duration: 15,
    category: 'chakras',
    level: 'principiante',
    guide: 'Tu corazón es el centro de todo amor. Visualiza una esmeralda verde radiante en tu pecho...',
    benefits: ['Abre el corazón al amor incondicional', 'Sana heridas emocionales del pasado', 'Mejora las relaciones interpersonales', 'Aumenta la empatía y compasión'],
    steps: [
      'Coloca tu mano derecha sobre tu corazón. Siente su latido constante y reconfortante.',
      'Visualiza una luz verde esmeralda que emana del centro de tu pecho.',
      'Con cada inhalación, esta luz se expande más allá de tu cuerpo físico.',
      'Imagina que tu corazón es una flor de loto verde que se abre pétalo a pétalo.',
      'Siente cómo el amor fluye desde tu corazón hacia cada parte de tu ser.',
      'Permite que este amor te llene completamente, sin reservas.',
      'Ahora, dirige este amor hacia alguien que amas. Siente la conexión.',
      'Finalmente, envía amor a alguien que necesita perdón o sanación.',
      'Tu corazón es infinito. Siempre hay más amor para dar y recibir.',
      'Respira profundamente y abre los ojos, sintiendo tu corazón expandido y cálido.'
    ],
    affirmations: ['Mi corazón está abierto para dar y recibir amor.', 'Soy un canal de amor incondicional.', 'El amor fluye a través de mí sin obstáculos.'],
    music: 'Frecuencias 639Hz con sonidos de agua',
    imagePrompt: 'Green emerald heart chakra glowing with pink light rays',
    tags: ['amor', 'corazón', 'sanación emocional']
  },
  {
    id: 3,
    name: 'Limpieza de Chakras',
    description: 'Una práctica purificadora que elimina bloqueos energéticos y restaura el flujo natural de tu sistema de chakras.',
    duration: 25,
    category: 'chakras',
    level: 'avanzado',
    guide: 'Comenzaremos un proceso profundo de limpieza energética, liberando todo aquello que ya no te sirve...',
    benefits: ['Elimina bloqueos energéticos', 'Limpia el aura y los cuerpos sutiles', 'Restaura el flujo vital', 'Aumenta la claridad mental'],
    steps: [
      'Acuéstate en posición cómoda. Respira profundo tres veces, relajando tu cuerpo.',
      'Imagina una lluvia de luz blanca descendiendo sobre ti desde el universo.',
      'Esta luz entra por tu coronilla y comienza a descender, limpiando cada chakra.',
      'En tu coronilla, la luz disuelve pensamientos obsesivos y confusión mental.',
      'En tu tercer ojo, libera ilusiones y miedos sobre el futuro.',
      'En tu garganta, limpia palabras no dichas y mentiras internalizadas.',
      'En tu corazón, disuelve dolor, traiciones y corazas emocionales.',
      'En tu plexo solar, libera vergüenza, culpa y miedo al rechazo.',
      'En tu sacro, limpia culpa sexual y represión creativa.',
      'En tu raíz, suelta miedos de supervivencia y desconexión con la tierra.',
      'Visualiza toda la oscuridad siendo arrastrada hacia el núcleo de la tierra.',
      'Tu sistema energético está limpio y brillante. Permanece en este estado.'
    ],
    affirmations: ['Mis chakras están limpios y brillantes.', 'Libero todo lo que ya no me sirve.', 'Mi energía fluye pura y cristalina.'],
    music: 'Cuencos tibetanos con frecuencias 417Hz',
    imagePrompt: 'Person silhouette with chakras being cleansed by white light',
    premium: true
  },

  // ----- VISUALIZACIÓN (4 meditaciones) -----
  {
    id: 4,
    name: 'Bosque Mágico',
    description: 'Una visualización guiada que te lleva a través de un antiguo bosque encantado donde la sabiduría de la naturaleza te espera.',
    duration: 15,
    category: 'visualizacion',
    level: 'principiante',
    guide: 'Te encuentras en el borde de un bosque antiguo. Los árboles se alzan como guardianes sabios...',
    benefits: ['Reduce el estrés y la ansiedad', 'Conecta con la energía de la naturaleza', 'Desarrolla la imaginación creativa', 'Proporciona una sensación de paz profunda'],
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
    affirmations: ['La sabiduría de la naturaleza vive en mí.', 'Encuentro paz en los espacios verdes de mi mente.', 'Estoy conectado/a con la tierra y sus criaturas.'],
    music: 'Sonidos de naturaleza: pájaros, agua, viento entre árboles',
    imagePrompt: 'Enchanted forest with golden sunlight filtering through ancient trees',
    featured: true
  },
  {
    id: 5,
    name: 'Playa Paradisíaca',
    description: 'Transporta tu mente a una playa tropical de aguas cristalinas donde el sol y el mar te rejuvenecen.',
    duration: 12,
    category: 'visualizacion',
    level: 'principiante',
    guide: 'El suave sonido de las olas te invita a un viaje de relajación total en una playa de ensueño...',
    benefits: ['Induce una relajación profunda', 'Reduce el estrés acumulado', 'Mejora el estado de ánimo', 'Proporciona una pausa mental revitalizante'],
    steps: [
      'Cierra los ojos y respira el aire salado del mar. Siente la brisa suave en tu rostro.',
      'Imagina que estás parado en una playa de arena blanca y suave. El agua turquesa se extiende hasta el horizonte.',
      'Camina despacio hacia el agua. Siente la arena tibia bajo tus pies descalzos.',
      'Entra al mar gradualmente. El agua está perfectamente tibia, como un abrazo líquido.',
      'Flota suavemente en el agua. El sol te acaricia con su luz dorada y reconfortante.',
      'Imagina que el agua lava todas tus preocupaciones, llevándolas hacia el mar abierto.',
      'Eres parte del océano. Eres una con el agua, el sol y el cielo.',
      'Nadas de regreso a la orilla, sintiéndote renovado/a y lleno/a de energía.',
      'Acuéstate en la arena tibia. Una paz profunda te envuelve.',
      'Gradualmente, regresa a tu cuerpo en el aquí y ahora, trayendo contigo la serenidad del mar.'
    ],
    affirmations: ['El universo me sostiene y me nutre.', 'Suelgo mis preocupaciones al océano infinito.', 'Mi espíritu es tan vasto como el mar.'],
    music: 'Sonidos de olas del mar con música ambiental suave',
    imagePrompt: 'Tropical paradise beach with crystal clear turquoise water',
    tags: ['relajación', 'naturaleza', 'vacaciones mentales']
  },
  {
    id: 6,
    name: 'Montaña Sagrada',
    description: 'Una ascensión espiritual a la cima de una montaña mística donde obtienes perspectiva y claridad sobre tu vida.',
    duration: 18,
    category: 'visualizacion',
    level: 'intermedio',
    guide: 'Una montaña antigua se alza ante ti, invitándote a escalar hacia la sabiduría de las alturas...',
    benefits: ['Proporciona perspectiva vital', 'Fortalece la determinación', 'Conecta con la energía de la tierra', 'Aporta claridad mental'],
    steps: [
      'Imagina que estás al pie de una montaña majestuosa. Su pico toca las nubes.',
      'Comienza a caminar por un sendero serpenteante. Cada paso te eleva más.',
      'El aire se vuelve más puro y fresco. Tu mente se despeja con cada metro.',
      'A mitad de camino, te detienes en un mirador. Ves tu vida desde arriba, como un mapa.',
      'Continúa ascendiendo. Los desafíos del camino representan tus propios obstáculos.',
      'Llegas a la cima. El horizonte se extiende infinito ante ti.',
      'En la cumbre, te encuentras con tu yo sabio, tu guía interior.',
      'Tu yo sabio tiene un mensaje para ti. Escucha con atención.',
      'Contempla tu vida desde esta altura. Los problemas se ven pequeños, manejables.',
      'Baja de la montaña con nueva perspectiva. La sabiduría de la cima te acompaña siempre.'
    ],
    affirmations: ['Desde la altura, todo es claro y posible.', 'Tengo la fortaleza de una montaña.', 'Mi perspectiva se eleva sobre los problemas.'],
    music: 'Flauta nativa con sonidos de viento de montaña',
    imagePrompt: 'Snow-capped sacred mountain summit at sunrise with golden light',
    tags: ['perspectiva', 'claridad', 'fortaleza']
  },
  {
    id: 7,
    name: 'Jardín del Alma',
    description: 'Entra en tu jardín interior personal, un espacio sagrado donde cultivas las flores de tu espíritu.',
    duration: 15,
    category: 'visualizacion',
    level: 'principiante',
    guide: 'Existe un jardín secreto dentro de ti, donde florece todo lo que nutres con tu atención...',
    benefits: ['Cultiva la autoconciencia', 'Desarrolla la creatividad', 'Promueve la introspección', 'Nutre el ser interior'],
    steps: [
      'Cierra los ojos y respira. Con cada exhalación, te hundes más en tu mundo interior.',
      'Apareces ante una verja de hierro forjado. Ábrela y entra a tu jardín del alma.',
      'Observa las flores que crecen aquí. Cada una representa un aspecto de tu vida.',
      'Hay flores que florecen con fuerza. Reconoce qué representan: amor, creatividad, salud.',
      'También hay plantas que necesitan atención. ¿Cuáles están mustias por falta de cuidado?',
      'Quizás hay malas hierbas: creencias limitantes, miedos. Arráncalas con amor.',
      'Descubre una fuente en el centro. Su agua es el manantial de tu fuerza vital.',
      'Bebe de esta agua. Siente cómo te rejuvenece y fortalece.',
      'Siembra una semilla nueva: un deseo, un sueño, una cualidad que quieres desarrollar.',
      'Promete volver a regar este jardín. Cierra la verja sabiendo que siempre puedes regresar.'
    ],
    affirmations: ['Cultivo mi alma con amor y atención.', 'Mi jardín interior florece en abundancia.', 'Nutro lo que deseo ver crecer en mi vida.'],
    music: 'Arpa y sonidos de agua de fuente con pájaros',
    imagePrompt: 'Magical garden with colorful flowers and a glowing fountain',
    tags: ['crecimiento personal', 'introspección', 'naturaleza interior']
  },

  // ----- RELAJACIÓN (3 meditaciones) -----
  {
    id: 8,
    name: 'Relajación Profunda',
    description: 'Una técnica de relajación muscular progresiva que libera la tensión acumulada en cada parte del cuerpo.',
    duration: 25,
    category: 'relajacion',
    level: 'principiante',
    guide: 'Tensa cada grupo muscular mientras inhalas, y suelta completamente mientras exhalas...',
    benefits: ['Libera la tensión física acumulada', 'Mejora la calidad del sueño', 'Reduce dolores musculares relacionados con el estrés', 'Calma el sistema nervioso'],
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
    affirmations: ['Mi cuerpo está completamente relajado y en paz.', 'Suelgo toda tensión y abrazo la calma.', 'Mi mente y cuerpo descansan en armonía.'],
    music: 'Música ambiental suave, frecuencias de ondas delta',
    imagePrompt: 'Person in deep relaxation, floating on calm water under starlight',
    featured: true
  },
  {
    id: 9,
    name: 'Cuerpo de Luz',
    description: 'Una técnica avanzada de escaneo corporal que transforma tu cuerpo físico en luz pura.',
    duration: 20,
    category: 'relajacion',
    level: 'intermedio',
    guide: 'Tu cuerpo es energía condensada. Vamos a liberarlo de su forma densa y convertirlo en luz...',
    benefits: ['Expande la conciencia corporal', 'Induce estados de conciencia elevados', 'Libera bloqueos energéticos profundos', 'Mejora la conexión mente-cuerpo'],
    steps: [
      'Acuédate en posición cómoda. Respira profundamente, permitiendo que tu cuerpo se relaje.',
      'Dirige tu atención a los dedos de tus pies. Imagina que comienzan a brillar con luz dorada.',
      'La luz asciende por tus pies, tobillos y pantorrillas. Cada célula se ilumina.',
      'Siente tus rodillas y muslos transformándose en luz pura. Ya no hay peso, solo brillo.',
      'La luz sube por tu cadera y abdomen. Tus órganos internos se vuelven cristal luminoso.',
      'Tu pecho y corazón brillan intensamente. Eres un ser de luz.',
      'Los hombros, brazos y manos se disuelven en rayos de luz.',
      'Tu cuello y rostro se transforman. Tu cabeza es una esfera de luz radiante.',
      'Ahora todo tu cuerpo es luz. Flotas en un espacio infinito de paz.',
      'Permanece en este estado de existencia luminosa el tiempo que desees.',
      'Gradualmente, tu cuerpo de luz se condensa de nuevo en forma física, pero mantienes la luminosidad interior.'
    ],
    affirmations: ['Soy un ser de luz pura.', 'Mi esencia es eterna e iluminada.', 'La luz fluye a través de mí sin límites.'],
    music: 'Frecuencias 963Hz con armónicos celestiales',
    imagePrompt: 'Human silhouette transforming into pure golden light particles',
    premium: true
  },
  {
    id: 10,
    name: 'Olas de Calma',
    description: 'Utiliza la metáfora de las olas del mar para inducir un estado de calma profunda y serenidad.',
    duration: 15,
    category: 'relajacion',
    level: 'principiante',
    guide: 'Como las olas del mar, tu respiración entra y sale, trayendo paz con cada ciclo...',
    benefits: ['Induce calma rápidamente', 'Reduce la ansiedad', 'Mejora la calidad respiratoria', 'Promueve la serenidad mental'],
    steps: [
      'Siéntate o acuéstate cómodamente. Cierra los ojos y escucha mentalmente el sonido del mar.',
      'Tu respiración es como las olas. Inhalar es la ola que llega a la orilla.',
      'Exhalar es la ola que regresa al mar, llevando consigo toda tensión.',
      'Con cada inhalación, imagina que el océano de calma te inunda de paz.',
      'Con cada exhalación, la ola arranca preocupaciones y las lleva mar adentro.',
      'Las olas son cada vez más suaves. El mar interior se calma.',
      'Entre olas, hay pausas de quietud perfecta. Disfruta esos momentos de silencio.',
      'Tu mente es ahora un mar en calma. Superficie de espejo reflejando el cielo.',
      'Flota en este mar de serenidad. Sin esfuerzo, sin prisa, sin preocupaciones.',
      'Cuando estés listo, permite que las olas te traigan suavemente de vuelta a la orilla.'
    ],
    affirmations: ['Soy calma en medio de cualquier tormenta.', 'Mi respiración es mi ancla de paz.', 'La serenidad fluye naturalmente en mí.'],
    music: 'Sonidos de olas suaves con campanas tibetanas',
    imagePrompt: 'Calm ocean at sunset with gentle waves reflecting golden light',
    tags: ['respiración', 'calma', 'mar']
  },

  // ----- ESPIRITUAL (3 meditaciones) -----
  {
    id: 11,
    name: 'Conexión con el Yo Superior',
    description: 'Establece comunicación con tu ser más elevado, aquella parte de ti que posee sabiduría infinita.',
    duration: 25,
    category: 'espiritual',
    level: 'avanzado',
    guide: 'Existe una parte de ti que trasciende el tiempo y el espacio. Vamos a conectar con ella...',
    benefits: ['Accede a sabiduría interior profunda', 'Clarifica tu propósito de vida', 'Fortalece la intuición', 'Eleva la conciencia espiritual'],
    steps: [
      'Siéntate en una posición meditativa. Respira profundamente y entra en silencio.',
      'Imagina que subes por una escalera de luz. Cada escalón te eleva en conciencia.',
      'Llegas a un templo de cristal en la cima. Aquí habita tu Yo Superior.',
      'Tu Yo Superior aparece ante ti como una figura de luz brillante y amorosa.',
      'Es tu versión más sabia, evolucionada y amorosa. Te mira con ojos de compasión infinita.',
      'Haz una pregunta o expresa una inquietud. Recibe la respuesta en silencio.',
      'Tu Yo Superior te muestra visiones de tu camino y propósito.',
      'Recibe una bendición de luz de tu Yo Superior hacia ti.',
      'Promete volver a conectar regularmente. Esta conexión siempre está disponible.',
      'Desciende la escalera de luz, trayendo contigo la sabiduría recibida.'
    ],
    affirmations: ['Mi Yo Superior me guía siempre.', 'Tengo acceso a sabiduría infinita.', 'Soy un ser espiritual teniendo una experiencia humana.'],
    music: 'Frecuencias 963Hz con coros angelicales',
    imagePrompt: 'Human figure meeting their luminous higher self in a crystal temple',
    premium: true
  },
  {
    id: 12,
    name: 'Silencio Interior',
    description: 'Una práctica de quietud mental que te lleva más allá del ruido de los pensamientos hacia el espacio puro de la conciencia.',
    duration: 20,
    category: 'espiritual',
    level: 'intermedio',
    guide: 'Detrás de cada pensamiento hay un espacio de silencio. Vamos a descubrirlo juntos...',
    benefits: ['Calma el diálogo mental', 'Expande la conciencia', 'Mejora la concentración', 'Profundiza la práctica meditativa'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y observa tus pensamientos sin intervenir.',
      'Los pensamientos son como nubes pasando por el cielo de tu mente. No son tú.',
      'Observa el espacio entre pensamientos. Ese momento de quietud antes del siguiente.',
      'Con cada pausa entre pensamientos, el silencio se expande.',
      'No trates de detener los pensamientos. Simplemente déjalos pasar.',
      'Gradualmente, los espacios de silencio se hacen más largos.',
      'En el silencio, descubre quién eres realmente. No el pensador, sino el observador.',
      'Descansa en este espacio de conciencia pura. Sin forma, sin nombre, sin límites.',
      'El silencio es tu verdadera naturaleza. Llévalo contigo al abrir los ojos.',
      'Regresa al mundo exterior, pero mantén el ancla del silencio interior.'
    ],
    affirmations: ['Soy el silencio detrás de los pensamientos.', 'Mi esencia es paz eterna.', 'En el vacío, encuentro plenitud.'],
    music: 'Silencio con tonos binaurales theta muy sutiles',
    imagePrompt: 'Person meditating in void of pure white light and silence',
    tags: ['mindfulness', 'conciencia', 'vacío']
  },
  {
    id: 13,
    name: 'Bendición Universal',
    description: 'Una práctica de envío de amor y luz a todos los seres del universo, cultivando compasión ilimitada.',
    duration: 15,
    category: 'espiritual',
    level: 'principiante',
    guide: 'Tu corazón tiene la capacidad de bendecir a todo el universo. Abramos esa fuente infinita...',
    benefits: ['Cultiva compasión ilimitada', 'Eleva la vibración personal', 'Fortalece la conexión con la humanidad', 'Genera karma positivo'],
    steps: [
      'Siéntate cómodamente y cierra los ojos. Respira con intención amorosa.',
      'Coloca tus manos sobre tu corazón. Siente su calor y su latido.',
      'Visualiza luz dorada emanando de tu corazón, expandiéndose como ondas.',
      'Envía esta luz a tus seres queridos. Bendícelos con salud, paz y felicidad.',
      'Extiende la luz a tus amigos y conocidos. Que todos encuentren su camino.',
      'Ahora, envía luz a personas neutrales, aquellos que no conoces.',
      'Incluso envía bendiciones a quienes te han causado dolor. Ellos también sufren.',
      'La luz se expande a toda la humanidad. Todos somos uno en el corazón.',
      'Finalmente, envía luz a todos los seres del universo: animales, plantas, ángeles.',
      'Tu corazón es ahora un faro de amor inagotable. Abre los ojos sintiendo la unidad.'
    ],
    affirmations: ['Soy un canal de amor y bendiciones.', 'Envío luz a todos los seres sin excepción.', 'Mi corazón abraza al universo entero.'],
    music: 'Música devocional suave con mantras OM de fondo',
    imagePrompt: 'Person sending golden light rays to the universe and all beings',
    tags: ['compasión', 'amor', 'unidad']
  },

  // ----- SANACIÓN (4 meditaciones) -----
  {
    id: 14,
    name: 'Sanación del Niño Interior',
    description: 'Un viaje compasivo para reconectar y sanar a tu niño/a interior, liberando heridas emocionales del pasado.',
    duration: 30,
    category: 'sanacion',
    level: 'avanzado',
    guide: 'Imagina que entras en una habitación especial donde tu yo más joven te espera...',
    benefits: ['Sana heridas emocionales de la infancia', 'Recupera la capacidad de jugar y disfrutar', 'Aumenta la compasión hacia uno mismo', 'Libera patrones heredados que ya no sirven'],
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
    affirmations: ['Amo y protejo a mi niño/a interior incondicionalmente.', 'Las heridas del pasado se transforman en sabiduría.', 'Soy el adulto amoroso que mi niño/a interior siempre necesitó.'],
    music: 'Melodía suave de piano con frecuencias de sanación 528Hz',
    imagePrompt: 'Adult embracing their inner child in a warm golden light',
    featured: true
  },
  {
    id: 15,
    name: 'Luz de Sanación',
    description: 'Una meditación de sanación que dirige luz curativa a cada parte de tu cuerpo que necesita atención.',
    duration: 20,
    category: 'sanacion',
    level: 'intermedio',
    guide: 'Una luz blanca sanadora desciende desde el universo hacia cada célula de tu cuerpo...',
    benefits: ['Apoya los procesos de sanación del cuerpo', 'Reduce el dolor y la inflamación', 'Fortalece el sistema inmunológico', 'Promueve la regeneración celular'],
    steps: [
      'Acuéstate cómodamente. Cierra los ojos y respira lenta y profundamente.',
      'Visualiza un rayo de luz blanca brillante descendiendo desde el universo hacia tu coronilla.',
      'La luz entra por tu cabeza y se dispersa por cada célula de tu cerebro, sanando y limpiando.',
      'La luz baja por tu cuello, hombros y brazos. Siente cómo tus manos se llenan de esta energía curativa.',
      'La luz llega a tu pecho. Tu corazón brilla intensamente. Siente el latido de vida y salud.',
      'Continúa hacia tu abdomen. Visualiza cada órgano bañado en luz blanca sanadora.',
      'La luz recorre tu columna vertebral, de arriba abajo, alineando y sanando.',
      'Llega a tus caderas, muslos, rodillas, pantorrillas y finalmente tus pies.',
      'Todo tu cuerpo es ahora una columna de luz blanca. Permanece en este estado de sanación.',
      'Agradece a tu cuerpo por todo lo que hace. Abre los ojos sintiéndote renovado/a.'
    ],
    affirmations: ['Mi cuerpo tiene la sabiduría y el poder de sanarse.', 'Cada célula de mi ser vibra con salud perfecta.', 'La luz divina fluye a través de mí restaurando mi bienestar.'],
    music: 'Frecuencias de sanación 528Hz con sonidos de cuencos de cristal',
    imagePrompt: 'Human body outline filled with white healing light',
    tags: ['salud', 'regeneración', 'bienestar']
  },
  {
    id: 16,
    name: 'Sanación Emocional',
    description: 'Libera emociones atrapadas y restaura el equilibrio de tu mundo emocional con esta práctica sanadora.',
    duration: 25,
    category: 'sanacion',
    level: 'intermedio',
    guide: 'Las emociones son energía en movimiento. Vamos a liberar lo estancado y permitir el flujo natural...',
    benefits: ['Libera emociones reprimidas', 'Restaura el equilibrio emocional', 'Mejora la inteligencia emocional', 'Reduce la carga emocional del pasado'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y lleva atención a tu centro emocional, el pecho.',
      'Pregunta a tu cuerpo: ¿Qué emoción necesita ser liberada hoy?',
      'Observa sin juzgar. Quizás es tristeza, ira, miedo, o una mezcla de varias.',
      'Visualiza la emoción como una forma o color en tu cuerpo. ¿Dónde se aloja?',
      'Sin intentar cambiarla, simplemente dale la bienvenida. "Te veo, te reconozco."',
      'Respira hacia la emoción. Con cada exhalación, la vas abrazando con compasión.',
      'Imagina que la emoción comienza a disolverse, como niebla bajo el sol.',
      'El espacio que dejaba se llena de luz dorada de sanación.',
      'Agradece a la emoción por su mensaje. Ahora puede irse en paz.',
      'Respira profundamente, sintiendo el alivio y la ligereza en tu pecho.',
      'Abre los ojos, sintiéndote más ligero/a y emocionalmente renovado/a.'
    ],
    affirmations: ['Mis emociones fluyen libremente y en armonía.', 'Suelgo el pasado emocional con gratitud.', 'Mi corazón es un espacio de sanación continua.'],
    music: 'Sonidos de agua fluyente con frecuencias 417Hz',
    imagePrompt: 'Person releasing colorful emotional energy from their heart',
    premium: true
  },
  {
    id: 17,
    name: 'Sanación del Linaje',
    description: 'Una práctica poderosa para sanar patrones ancestrales y liberar cargas heredadas de tus antepasados.',
    duration: 35,
    category: 'sanacion',
    level: 'avanzado',
    guide: 'Tu linaje se extiende atrás en el tiempo. Vamos a sanar lo que te fue transmitido para liberar a las generaciones futuras...',
    benefits: ['Libera patrones familiares negativos', 'Sana traumas transgeneracionales', 'Honra y conecta con ancestros', 'Crea un nuevo legado para las futuras generaciones'],
    steps: [
      'Siéntate en un espacio tranquilo. Respira profundamente y entra en estado meditativo.',
      'Visualiza una línea de luz extendiéndose detrás de ti. Son tus ancestros.',
      'A cada lado están tus líneas paterna y materna, extendiéndose hacia el pasado.',
      'Observa patrones que se repiten: miedos, comportamientos, creencias heredadas.',
      'Envía luz de sanación hacia atrás en el tiempo, a tus padres.',
      'Continúa enviando luz a tus abuelos, bisabuelos, y todas las generaciones.',
      'Reconoce el sufrimiento de tus ancestros. Ellos hicieron lo mejor que pudieron.',
      'Perdona lo que necesitaba ser perdonado. Libera lo que ya no te sirve.',
      'Agradece las fortalezas heredadas: la resiliencia, el amor, los dones.',
      'Declara: "Yo rompo el ciclo. Soy el punto de sanación de mi linaje."',
      'Visualiza luz fluyendo desde ti hacia las generaciones futuras, ya libres de estas cargas.',
      'Regresa al presente, sintiéndote más ligero/a y conectado/a con tu linaje sanado.'
    ],
    affirmations: ['Soy el sanador de mi linaje.', 'Libero lo que no me pertenece con amor.', 'Honro a mis ancestros creando un nuevo camino.'],
    music: 'Tambores ancestrales suaves con frecuencias 741Hz',
    imagePrompt: 'Person standing between ancestral spirits behind and light ahead',
    premium: true
  },

  // ----- ABUNDANCIA (3 meditaciones) -----
  {
    id: 18,
    name: 'Templo de la Abundancia',
    description: 'Una visualización para abrir tu conciencia a la prosperidad y manifestar abundancia en todas las áreas de tu vida.',
    duration: 20,
    category: 'abundancia',
    level: 'intermedio',
    guide: 'Entras en un templo dorado donde la abundancia del universo fluye sin límites...',
    benefits: ['Abre la conciencia a la prosperidad', 'Libera bloqueos hacia la abundancia', 'Actitud mental positiva hacia el éxito', 'Alineación con la energía de la receptividad'],
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
    affirmations: ['La abundancia del universo fluye hacia mí sin esfuerzo.', 'Merezco toda la prosperidad que recibo.', 'Soy un imán para las bendiciones en todas sus formas.'],
    music: 'Música inspiradora con cuerdas doradas y frecuencias de 432Hz',
    imagePrompt: 'Golden temple interior with flowing light fountain',
    featured: true
  },
  {
    id: 19,
    name: 'Magnetismo de la Prosperidad',
    description: 'Activa tu campo energético para atraer oportunidades, dinero y éxito de manera natural y alineada.',
    duration: 18,
    category: 'abundancia',
    level: 'intermedio',
    guide: 'Tu energía es magnética. Vamos a sintonizarla con la frecuencia de la prosperidad...',
    benefits: ['Aumenta el magnetismo personal', 'Atrae oportunidades laborales y financieras', 'Mejora la autoestima relacionada con el dinero', 'Sincroniza con la energía de la riqueza'],
    steps: [
      'Siéntate con la espalda recta. Cierra los ojos y respira profundamente.',
      'Visualiza tu campo energético como un óvalo de luz que te rodea.',
      'Actualmente, ¿de qué color es? ¿Está brillante o apagado?',
      'Comienza a transformarlo en un dorado brillante, como el sol.',
      'Siente cómo este campo dorado se expande, atrayendo todo lo bueno hacia ti.',
      'Repite mentalmente: "Soy un imán para la prosperidad en todas sus formas."',
      'Imagina oportunidades, dinero, conexiones, éxito, acercándose a tu campo magnético.',
      'Siente la alegría de recibir. Abre tus brazos energéticos para abrazar la abundancia.',
      'Tu campo magnético está ahora activado. Atrae prosperidad incluso mientras duermes.',
      'Abre los ojos, sintiéndote magnético/a, atractivo/a, listo/a para recibir.'
    ],
    affirmations: ['Soy magnéticamente atractivo/a para la prosperidad.', 'El dinero y las oportunidades fluyen hacia mí.', 'Mi energía irradia abundancia.'],
    music: 'Frecuencias 432Hz con tonos de riqueza y éxito',
    imagePrompt: 'Person with golden magnetic energy field attracting prosperity symbols',
    tags: ['atracción', 'prosperidad', 'dinero']
  },
  {
    id: 20,
    name: 'Gratitud Generadora',
    description: 'Utiliza la gratitud como el motor más poderoso para generar más abundancia en tu vida.',
    duration: 12,
    category: 'abundancia',
    level: 'principiante',
    guide: 'Lo que aprecias, se multiplica. Vamos a activar el generador de abundancia a través de la gratitud...',
    benefits: ['Multiplica la abundancia existente', 'Eleva la vibración personal', 'Mejora el estado de ánimo', 'Activa la ley de la atracción'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y coloca tu mano sobre tu corazón.',
      'Piensa en tres cosas por las que estás profundamente agradecido/a ahora mismo.',
      'Siente la gratitud en tu cuerpo. ¿Dónde la sientes? ¿Es cálida, expansiva?',
      'Ahora, agradece por algo que aún no tienes, como si ya fuera tuyo.',
      'Siente la emoción de tenerlo. La gratitud anticipada es el secreto de la manifestación.',
      'Tu corazón genera ondas de gratitud que se expanden al universo.',
      'El universo responde enviando más razones para estar agradecido.',
      'Eres un generador de abundancia a través de tu gratitud.',
      'Abre los ojos, sintiéndote lleno/a de gratitud y expectativa positiva.'
    ],
    affirmations: ['La gratitud multiplica mis bendiciones.', 'Agradezco por lo que tengo y por lo que viene.', 'Mi corazón es un generador de abundancia infinita.'],
    music: 'Música suave de piano con sonidos de naturaleza',
    imagePrompt: 'Person radiating gratitude with heart glowing and abundance symbols around',
    tags: ['gratitud', 'manifestación', 'ley de atracción']
  },

  // ----- DORMIR (3 meditaciones) -----
  {
    id: 21,
    name: 'Descenso al Sueño',
    description: 'Una meditación diseñada para guiarte suavemente hacia un sueño profundo y reparador.',
    duration: 20,
    category: 'dormir',
    level: 'principiante',
    guide: 'Deja que el día se desvanezca mientras te sumerges en un océano de paz nocturna...',
    benefits: ['Facilita el conciliar el sueño', 'Mejora la calidad del sueño', 'Reduce el insomnio', 'Calma la mente antes de dormir'],
    steps: [
      'Acuéstate en tu cama en tu posición favorita para dormir. Cierra los ojos.',
      'Respira profundamente tres veces. Con cada exhalación, suelta el día.',
      'Imagina que tu cuerpo se vuelve pesado, muy pesado. Se hunde en el colchón.',
      'Tus pies están pesados y relajados. Las piernas pesadas y tranquilas.',
      'Tu abdomen sube y baja suavemente. El pecho relajado. Los brazos pesados.',
      'Tu cuello y cabeza se hunden en la almohada. El rostro completamente relajado.',
      'Visualiza un cielo nocturno estrellado. Eres parte de la noche.',
      'Las estrellas te observan con ojos amorosos. Todo está bien. Puedes descansar.',
      'Una suave niebla plateada te envuelve. Es el manto del sueño.',
      'Flotas en este espacio entre la vigilia y el sueño. Es seguro dejarse ir.',
      'Desciende, desciende, desciende hacia el sueño profundo y reparador.'
    ],
    affirmations: ['Mi cuerpo y mente merecen descanso profundo.', 'El sueño viene a mí naturalmente y con facilidad.', 'Despierto renovado/a y lleno/a de energía.'],
    music: 'Frecuencias delta con lluvia suave de fondo',
    imagePrompt: 'Person sleeping peacefully under starry night sky with moon',
    featured: true
  },
  {
    id: 22,
    name: 'Cuento para Dormir',
    description: 'Una historia relajante que transporta tu mente a un mundo de fantasía mientras te quedas dormido/a.',
    duration: 25,
    category: 'dormir',
    level: 'principiante',
    guide: 'Había una vez un viajero que buscaba el secreto del descanso perfecto...',
    benefits: ['Distracción mental para dormir', 'Reduce pensamientos nocturnos', 'Induce estados de sueño', 'Promueve sueños positivos'],
    steps: [
      'Acuéstate cómodamente. Respira suavemente y escucha esta historia...',
      'Había una vez un pequeño búho llamado Luna que vivía en un árbol antiguo.',
      'Cada noche, Luna volaba sobre el bosque durmiente, vigilando los sueños de todos.',
      'Una noche, Luna descubrió un claro mágico donde las luciérnagas bailaban.',
      'Las luciérnagas formaban patrones en el aire, contando historias antiguas.',
      'Luna se posó en una rama suave y observó el baile hipnótico de las luces.',
      'El bosque entero respiraba en calma. Cada criatura descansaba en paz.',
      'Luna sintió sus párpados pesados. Era hora de volver a su nido cálido.',
      'Voló suavemente de regreso, planeando en el aire nocturno.',
      'En su nido de plumas suaves, Luna se acurrucó y cerró sus ojos.',
      'El bosque cantaba una canción de cuna. Todo estaba en paz.',
      'Y tú también, como Luna, puedes dejarte llevar por la noche suave.'
    ],
    affirmations: ['Me dejo llevar por la suavidad de la noche.', 'Mis sueños son tranquilos y restauradores.', 'El descanso viene a mí con facilidad.'],
    music: 'Narración suave con música de cuna y sonidos nocturnos',
    imagePrompt: 'Cute owl sleeping in a tree under starry moonlit sky',
    tags: ['cuento', 'relajación', 'infantil']
  },
  {
    id: 23,
    name: 'Cuenta Atrás Profundo',
    description: 'Una técnica clásica de hipnosis ligera para inducir un sueño profundo mediante cuenta atrás.',
    duration: 15,
    category: 'dormir',
    level: 'principiante',
    guide: 'Vamos a contar hacia atrás, y con cada número, descenderás más profundamente en el sueño...',
    benefits: ['Técnica probada para el insomnio', 'Fácil de seguir mentalmente', 'Induce sueño profundo', 'Puede usarse sin la grabación una vez aprendida'],
    steps: [
      'Acuéstate cómodamente. Cierra los ojos y respira profundamente.',
      'Imagina que estás en la cima de una escalera suave con 10 escalones.',
      'Con cada número que cuente, bajarás un escalón hacia un sueño más profundo.',
      '10... Bajas un escalón. Tu cuerpo se relaja más.',
      '9... Otro escalón. Los músculos se sueltan.',
      '8... Más profundo. La mente se aquieta.',
      '7... Sintiendo pesadez agradable en todo el cuerpo.',
      '6... Los pensamientos se desvanecen como nubes.',
      '5... A mitad de camino. Muy relajado/a.',
      '4... El sueño se acerca suavemente.',
      '3... Cada vez más profundo.',
      '2... Casi llegando al descanso total.',
      '1... El último escalón. Duermes profundamente.',
      '0... En el reino del sueño reparador.'
    ],
    affirmations: ['Duermo profundamente y despierto renovado/a.', 'El sueño es mi aliado natural.', 'Mi cuerpo sabe cómo descansar perfectamente.'],
    music: 'Tonos binaurales delta con fondo blanco suave',
    imagePrompt: 'Staircase descending into peaceful dreamy clouds',
    tags: ['insomnio', 'técnica', 'hipnosis']
  },

  // ----- ANSIEDAD (3 meditaciones) -----
  {
    id: 24,
    name: 'Ancla de Calma',
    description: 'Una técnica rápida para anclarte en el presente y disolver la ansiedad cuando surge.',
    duration: 10,
    category: 'ansiedad',
    level: 'principiante',
    guide: 'Cuando la ansiedad te invade, necesitas un ancla que te devuelva a la seguridad del presente...',
    benefits: ['Reduce la ansiedad rápidamente', 'Técnica utilizable en cualquier momento', 'Reconecta con el presente', 'Calma el sistema nervioso'],
    steps: [
      'Siéntate y coloca los pies firmemente en el suelo. Siente la tierra bajo ti.',
      'Coloca una mano sobre tu corazón y otra sobre tu abdomen.',
      'Respira profundamente. Inhalando por la nariz, exhalando por la boca.',
      'Di mentalmente: "Estoy aquí. Estoy a salvo. Este momento es seguro."',
      'Nombra 5 cosas que puedes ver a tu alrededor. Obsérvalas sin juzgar.',
      'Nombra 4 cosas que puedes tocar. Siente sus texturas.',
      'Nombra 3 cosas que puedes escuchar. Los sonidos del presente.',
      'Nombra 2 cosas que puedes oler. Los aromas a tu alrededor.',
      'Nombra 1 cosa que puedes saborear. O el sabor de tu boca.',
      'Has vuelto al presente. La ansiedad era solo una proyección mental. Aquí estás a salvo.'
    ],
    affirmations: ['Estoy a salvo en este momento presente.', 'La ansiedad es solo una emoción pasajera.', 'Tengo el poder de calmar mi mente.'],
    music: 'Sonidos de naturaleza con tonos calmantes',
    imagePrompt: 'Person anchored in peaceful present moment surrounded by light',
    featured: true
  },
  {
    id: 25,
    name: 'Olas de Tranquilidad',
    description: 'Transforma la energía ansiosa en calma utilizando la metáfora de las olas del mar.',
    duration: 12,
    category: 'ansiedad',
    level: 'principiante',
    guide: 'La ansiedad es como una ola: sube, alcanza su pico, y luego baja. Aprendamos a surfearla...',
    benefits: ['Cambia la relación con la ansiedad', 'Enseña a no resistir las emociones', 'Reduce la intensidad de los ataques de pánico', 'Promueve la aceptación emocional'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y respira.',
      'Observa tu ansiedad sin intentar alejarla. ¿Dónde la sientes en tu cuerpo?',
      'Imagina que es una ola en el océano. Viene hacia ti, sube, y pasará.',
      'No intentes detener la ola. Simplemente flota sobre ella.',
      'La ola sube... alcanza su punto máximo... y comienza a descender.',
      'Con cada exhalación, sientes cómo la ola baja.',
      'El océano siempre vuelve a la calma. Es su naturaleza.',
      'Tu respiración es tu tabla de surf. Mantente flotando.',
      'La ansiedad es solo energía. Puede moverse a través de ti sin dañarte.',
      'El océano está en calma ahora. Tú estás en calma. Todo pasó.'
    ],
    affirmations: ['Las olas de ansiedad pasan y yo permanezco.', 'Surfeo las emociones con gracia y facilidad.', 'La calma siempre regresa después de la tormenta.'],
    music: 'Sonidos de olas suaves con piano relajante',
    imagePrompt: 'Person floating peacefully on calm ocean after storm',
    tags: ['pánico', 'aceptación', 'resiliencia']
  },
  {
    id: 26,
    name: 'Santuario Interior',
    description: 'Crea un espacio seguro en tu mente donde siempre puedes refugiarte de la ansiedad.',
    duration: 18,
    category: 'ansiedad',
    level: 'intermedio',
    guide: 'Dentro de ti existe un lugar inquebrantable de paz. Vamos a construir tu santuario personal...',
    benefits: ['Crea un refugio mental permanente', 'Reduce ataques de ansiedad', 'Proporciona seguridad emocional', 'Fortalece la resiliencia'],
    steps: [
      'Cierra los ojos y respira profundamente. Vas a crear un lugar especial.',
      'Imagina un espacio que te inspira paz absoluta. Puede ser real o imaginario.',
      'Quizás es una cabaña en el bosque, una playa privada, o un jardín secreto.',
      'Constrúyelo en detalle: ¿Qué ves? ¿Qué oyes? ¿Qué hueles?',
      'Este es tu santuario. Nadie puede entrar sin tu permiso.',
      'Aquí estás completamente a salvo. Nada puede dañarte.',
      'Coloca objetos que te traigan paz: cristales, velas, libros, flores.',
      'Hay un asiento especial solo para ti. Siéntate y descansa.',
      'Este lugar siempre está disponible para ti. Cierra los ojos y estarás aquí.',
      'Regresa lentamente, sabiendo que tu santuario te espera siempre que lo necesites.'
    ],
    affirmations: ['Tengo un refugio seguro dentro de mí.', 'Mi santuario interior siempre está disponible.', 'Puedo encontrar paz en cualquier momento.'],
    music: 'Sonidos de cascada con cuerdas suaves',
    imagePrompt: 'Beautiful peaceful sanctuary garden with comfortable seating',
    tags: ['seguridad', 'refugio', 'paz interior']
  },

  // ----- AUTOCOMPASIÓN (3 meditaciones) -----
  {
    id: 27,
    name: 'Abrazo de Autocompasión',
    description: 'Aprende a ofrecerte el mismo amor y comprensión que darías a un buen amigo.',
    duration: 15,
    category: 'autocompasion',
    level: 'principiante',
    guide: 'Tratamos a otros con amabilidad, pero a menudo somos duros con nosotros mismos. Cambiemos eso...',
    benefits: ['Reduce la autocrítica', 'Aumenta la autoestima', 'Mejora la relación contigo mismo', 'Promueve la sanación emocional'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y respira.',
      'Piensa en algo que te hace sentir mal contigo mismo. Un error, una falla percibida.',
      'Observa cómo te hablas a ti mismo sobre esto. ¿Serías así con un amigo?',
      'Imagina que un ser querido te cuenta exactamente lo mismo que te afecta.',
      '¿Qué le dirías? ¿Cómo le tratarías? Con amor, comprensión, apoyo.',
      'Ahora, ofrece esas mismas palabras a ti mismo. "Está bien. Eres humano."',
      'Coloca tus brazos alrededor de ti mismo en un abrazo real.',
      'Siente el calor de tus propios brazos. Date el amor que necesitas.',
      'Repite: "Me amo y me acepto completamente. Soy digno/a de compasión."',
      'Siente cómo la dureza hacia ti mismo se derrite. Eres tu mejor amigo/a.'
    ],
    affirmations: ['Me trato con la misma amabilidad que ofrezco a otros.', 'Merezco mi propio amor y compasión.', 'Soy digno/a de perdón y comprensión.'],
    music: 'Música suave de piano con frecuencias 639Hz',
    imagePrompt: 'Person hugging themselves with warm pink light of self-love',
    tags: ['amor propio', 'aceptación', 'perdón personal']
  },
  {
    id: 28,
    name: 'Aceptación Radical',
    description: 'Acepta completamente quién eres, con todas tus luces y sombras, sin condiciones.',
    duration: 20,
    category: 'autocompasion',
    level: 'intermedio',
    guide: 'La verdadera paz viene de aceptar todo lo que eres. Incluso lo que juzgas imperfecto...',
    benefits: ['Libera de la autocrítica crónica', 'Promueve la paz interior', 'Integra partes rechazadas del ser', 'Mejora la autoestima genuina'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y respira profundamente.',
      'Piensa en una parte de ti que no te gusta o rechazas. Una debilidad, un defecto.',
      'Observa cómo normalmente te relacionas con esta parte: evitación, crítica, vergüenza.',
      'Ahora, vamos a cambiar eso. Imagina que esta parte es un niño herido.',
      'El niño se acerca a ti. Tiene los ojos bajos, esperando tu rechazo habitual.',
      'En lugar de rechazarlo, arrodíllate y míralo con amor.',
      'Dile: "Te veo. Te acepto. Eres parte de mí y te doy la bienvenida."',
      'Siente cómo esta parte se relaja al ser finalmente aceptada.',
      'Todas tus partes son bienvenidas en tu ser. No hay nada que deba ser excluido.',
      'Eres completo/a exactamente como eres. Perfecto/a en tu imperfección.',
      'Respira en esta aceptación radical. Siempre ha sido suficiente ser tú.'
    ],
    affirmations: ['Me acepto completa e incondicionalmente.', 'Todas mis partes son bienvenidas.', 'Soy suficiente exactamente como soy.'],
    music: 'Frecuencias 528Hz con coros suaves',
    imagePrompt: 'Person embracing their shadow self in loving acceptance',
    premium: true
  },
  {
    id: 29,
    name: 'Autocuidado Sagrado',
    description: 'Transforma el autocuidado de un lujo a una práctica espiritual sagrada y necesaria.',
    duration: 12,
    category: 'autocompasion',
    level: 'principiante',
    guide: 'Cuidar de ti mismo no es egoísmo. Es la base desde donde puedes dar a otros...',
    benefits: ['Prioriza el bienestar personal', 'Reduce el agotamiento', 'Mejora la relación contigo mismo', 'Establece límites saludables'],
    steps: [
      'Siéntate cómodamente. Coloca las manos sobre tu corazón.',
      'Reconoce todo lo que haces por otros. El dar constante puede agotar.',
      'Ahora, reconoce lo que haces por ti. ¿Es suficiente?',
      'El autocuidado no es un premio por productividad. Es una necesidad.',
      'Imagina que eres un jarrón hermoso. Para dar agua, primero debes llenarte.',
      'Si el jarrón está vacío, no tienes nada que dar. Llenarte es generosidad.',
      'Visualiza lo que más necesitas ahora: descanso, juego, silencio, naturaleza.',
      'Comprométete a darte esto. No es egoísmo, es sostenibilidad.',
      'Siente el permiso de cuidarte. Es tu derecho y responsabilidad.',
      'Abre los ojos con la intención de honrar tus necesidades hoy.'
    ],
    affirmations: ['Mi autocuidado es sagrado y necesario.', 'Me lleno primero para dar desde la abundancia.', 'Merezco ser prioridad en mi propia vida.'],
    music: 'Sonidos de spa con música relajante',
    imagePrompt: 'Person in peaceful self-care ritual surrounded by candles and flowers',
    tags: ['cuidado personal', 'límites', 'bienestar']
  },

  // ----- GRATITUD (3 meditaciones) -----
  {
    id: 30,
    name: 'Diario de Gratitud Mental',
    description: 'Una práctica diaria para cultivar gratitud y elevar tu vibración.',
    duration: 10,
    category: 'gratitud',
    level: 'principiante',
    guide: 'La gratitud es la puerta a la abundancia. Abrámosla juntos cada día...',
    benefits: ['Eleva el estado de ánimo', 'Mejora la perspectiva vital', 'Activa la ley de atracción', 'Reduce el enfoque en lo negativo'],
    steps: [
      'Siéntate cómodamente. Cierra los ojos y respira.',
      'Piensa en algo pequeño por lo que estás agradecido/a ahora mismo.',
      'Puede ser simple: una taza de café, el sol en la ventana, una sonrisa.',
      'Siente la gratitud en tu corazón. Deja que se expanda.',
      'Ahora piensa en algo más grande: una persona, una oportunidad, tu salud.',
      'Siente gratitud profunda. El corazón se llena de calidez.',
      'Finalmente, agradece algo sobre ti mismo. Un don, una cualidad, un logro.',
      'Eres tan digno/a de gratitud como todo lo demás.',
      'Tu corazón ahora irradia gratitud. Es un imán para más bendiciones.',
      'Abre los ojos listo/a para ver más razones para agradecer.'
    ],
    affirmations: ['La gratitud transforma mi vida diaria.', 'Encuentro bendiciones en cada momento.', 'Mi corazón desborda de agradecimiento.'],
    music: 'Música acústica suave con sonidos de la mañana',
    imagePrompt: 'Person writing in gratitude journal with morning sunlight',
    featured: true
  },
  {
    id: 31,
    name: 'Gratitud por las Dificultades',
    description: 'Encuentra el regalo oculto en los desafíos y transforma el sufrimiento en sabiduría.',
    duration: 18,
    category: 'gratitud',
    level: 'avanzado',
    guide: 'Las mayores bendiciones a menudo vienen disfrazadas de dificultades. Vamos a descubrir el oro en las sombras...',
    benefits: ['Transforma la adversidad en crecimiento', 'Desarrolla resiliencia', 'Cambia la perspectiva sobre el sufrimiento', 'Promueve la aceptación'],
    steps: [
      'Siéntate cómodamente. Respira y trae a mente un desafío actual o pasado.',
      'Sin negar el dolor que causó, pregúntate: ¿Qué aprendí de esto?',
      'Quizás aprendiste fortaleza, paciencia, compasión, o a valorar lo importante.',
      'Pregúntate: ¿Qué me llevó a hacer o ser que no habría hecho de otra manera?',
      'Las dificultades son maestros duros pero efectivos.',
      'Ahora, intenta sentir gratitud por esta dificultad. No por el dolor, sino por el crecimiento.',
      'Di mentalmente: "Gracias por enseñarme. Gracias por fortalecerme."',
      'El dolor se transmuta en sabiduría cuando lo abrazas con gratitud.',
      'Todo en tu vida ha contribuido a quien eres. Todo tiene un propósito.',
      'Respira en esta aceptación. Eres más fuerte y sabio/a gracias a cada desafío.'
    ],
    affirmations: ['Cada dificultad ha sido un maestro valioso.', 'Agradezco el crecimiento que viene de los desafíos.', 'Transformo el dolor en sabiduría y fortaleza.'],
    music: 'Música reflexiva con tonos profundos',
    imagePrompt: 'Person finding golden light within dark storm clouds',
    premium: true
  },
  {
    id: 32,
    name: 'Carta de Gratitud',
    description: 'Escribe una carta mental de gratitud a alguien que ha impactado tu vida positivamente.',
    duration: 15,
    category: 'gratitud',
    level: 'principiante',
    guide: 'Hay personas que han dejado huella en tu vida. Vamos a honrarlas con gratitud profunda...',
    benefits: ['Fortalece relaciones', 'Eleva el estado de ánimo', 'Promueve la conexión humana', 'Puede inspirar acción real'],
    steps: [
      'Siéntate cómodamente. Respira y piensa en alguien que ha sido importante para ti.',
      'Puede ser un familiar, un amigo, un maestro, o incluso un extraño que te ayudó.',
      'Imagina que le escribes una carta de gratitud en tu mente.',
      "Empieza con: 'Querido/a [nombre], quiero agradecerte por...'",
      'Enumera las razones específicas por las que estás agradecido/a.',
      'Siente la gratitud fluyendo de tu corazón hacia esa persona.',
      'Imagina su reacción al recibir esta gratitud. Siente la conexión.',
      'Decide si quieres compartir esta gratitud en la vida real.',
      'El amor no expresado es amor incompleto. Comparte cuando puedas.',
      'Abre los ojos con el corazón lleno y quizás la intención de expresar tu gratitud.'
    ],
    affirmations: ['Expreso mi gratitud libremente.', 'Las palabras de agradecimiento sanan y conectan.', 'Honro a quienes han impactado mi vida.'],
    music: 'Música emotiva de piano con cuerdas',
    imagePrompt: 'Person writing heartfelt gratitude letter with warm light',
    tags: ['relaciones', 'expresión', 'conexión']
  },

  // ----- PERDÓN (3 meditaciones) -----
  {
    id: 33,
    name: 'El Arte del Perdón',
    description: 'Una práctica transformadora para liberar el peso del resentimiento y abrir el corazón.',
    duration: 25,
    category: 'perdon',
    level: 'intermedio',
    guide: 'El perdón no es olvidar ni justificar. Es liberarte del veneno del resentimiento...',
    benefits: ['Libera carga emocional pesada', 'Mejora la salud mental', 'Abre el corazón', 'Restaura la paz interior'],
    steps: [
      'Siéntate cómodamente. Respira profundamente y trae a mente alguien que te ha herido.',
      'No niegues el dolor. Reconoce que te lastimaron. Eso es válido.',
      'El resentimiento es como beber veneno esperando que el otro muera.',
      'Vamos a soltar el veneno, no por ellos, sino por ti.',
      'Imagina a esa persona frente a ti. Observa sus imperfecciones, su humanidad.',
      'Probablemente actuaron desde su propio dolor, ignorancia o heridas.',
      'Dices mentalmente: "Te perdono. No por lo que hiciste, sino por mi propia paz."',
      'Siente cómo el nudo en tu pecho comienza a aflojarse.',
      'El perdón es un proceso. Puedes necesitar hacerlo varias veces.',
      'Con cada perdón, te vuelves más libre. Más ligero. Más tú.',
      'Abre los ojos sintiéndote más libre del pasado.'
    ],
    affirmations: ['Me libero del peso del resentimiento.', 'El perdón es mi regalo para mí mismo/a.', 'Elijo la paz sobre el dolor del pasado.'],
    music: 'Música sanadora con frecuencias 741Hz',
    imagePrompt: 'Person releasing white doves symbolizing forgiveness and freedom',
    featured: true
  },
  {
    id: 34,
    name: 'Perdón hacia Uno Mismo',
    description: 'El perdón más difícil y necesario: perdonarte a ti mismo por tus errores y fallas.',
    duration: 20,
    category: 'perdon',
    level: 'intermedio',
    guide: 'A menudo somos nuestros jueces más duros. Es hora de perdonarnos...',
    benefits: ['Libera la culpa crónica', 'Promueve la paz interior', 'Mejora la autoestima', 'Permite avanzar en la vida'],
    steps: [
      'Siéntate cómodamente. Respira y piensa en algo de lo que te culpas.',
      'Puede ser un error, una decisión, algo que hiciste o dejaste de hacer.',
      'Observa la dureza con la que te tratas por esto.',
      'Imagina que un amigo querido te cuenta exactamente lo mismo.',
      '¿Le juzgarías tan duramente? Probablemente no. Le ofrecerías compasión.',
      'Ofrece esa misma compasión a ti mismo. Eras diferente entonces.',
      'Hiciste lo mejor que pudiste con lo que tenías y sabías en ese momento.',
      'Dite mentalmente: "Me perdono. Aprendí. Soy libre de esa carga."',
      'Siente cómo el peso de la culpa se levanta de tus hombros.',
      'El pasado no puede cambiarse, pero tu relación con él sí.',
      'Abre los ojos sintiéndote perdonado/a y libre para avanzar.'
    ],
    affirmations: ['Me perdono completamente por mis errores del pasado.', 'Aprendí y crecí de cada experiencia.', 'Merezco paz y liberación de la culpa.'],
    music: 'Música suave de piano con frecuencias 528Hz',
    imagePrompt: 'Person embracing themselves in forgiveness with healing light',
    tags: ['culpa', 'liberación', 'paz interior']
  },
  {
    id: 35,
    name: 'Ritual de Soltar',
    description: 'Un ritual simbólico para soltar viejos agravios y hacer espacio para lo nuevo.',
    duration: 15,
    category: 'perdon',
    level: 'principiante',
    guide: 'A veces necesitamos un acto simbólico para cerrar ciclos y soltar el pasado...',
    benefits: ['Cierre simbólico de heridas', 'Liberación emocional tangible', 'Crea espacio para lo nuevo', 'Poder ritual de transformación'],
    steps: [
      'Prepara un papel pequeño y algo con qué escribir (o imagina hacerlo mentalmente).',
      'Escribe lo que quieres soltar: un agravio, una queja, un resentimiento.',
      'Puede ser una palabra, un nombre, o una frase que represente lo que te ata.',
      'Sostén el papel y siente el peso de lo que está escrito.',
      'Agradece la lección que esto te enseñó, incluso si fue dolorosa.',
      'Ahora, decide conscientientemente soltarlo. Ya no te sirve.',
      'Imagina que el papel se quema o se deshace en agua, llevándose el peso.',
      'Visualiza el humo o el agua llevándose el resentimiento lejos.',
      'El espacio que ocupaba ahora está libre para nuevas bendiciones.',
      'Respira en este espacio nuevo. Eres libre. El pasado queda atrás.',
      'Abre los ojos sintiéndote renovado/a y listo/a para lo que viene.'
    ],
    affirmations: ['Suelto el pasado y abrazo el presente.', 'Hago espacio para nuevas bendiciones.', 'El perdón es mi puerta a la libertad.'],
    music: 'Sonidos de fuego crepitante con música ambiental',
    imagePrompt: 'Paper burning transforming into white doves flying away',
    tags: ['ritual', 'liberación', 'cierre']
  },

  // ----- MANIFESTACIÓN (3 meditaciones) -----
  {
    id: 36,
    name: 'Manifestación Consciente',
    description: 'Una práctica poderosa para manifestar tus deseos más profundos con claridad e intención.',
    duration: 20,
    category: 'manifestacion',
    level: 'intermedio',
    guide: 'Eres un creador consciente. Vamos a usar tu poder para manifestar tu realidad deseada...',
    benefits: ['Clarifica tus deseos', 'Activa la ley de atracción', 'Alinea pensamiento y emoción', 'Aumenta la motivación'],
    steps: [
      'Siéntate cómodamente. Respira y aclara tu mente.',
      'Piensa en algo que deseas manifestar. Sé específico/a.',
      'Visualízalo con todos los detalles. ¿Cómo se ve, suena, huele, se siente?',
      'Imagina que ya lo tienes. No en el futuro, sino ahora.',
      'Siente la emoción de tenerlo. Alegría, gratitud, satisfacción.',
      'Esta emoción es el combustible de la manifestación.',
      'Declara en voz alta o mentalmente: "[Tu deseo] es mi realidad ahora."',
      'Suelta el cómo y el cuándo. El universo se encarga de los detalles.',
      'Confía. La duda es el opuesto de la fe manifestadora.',
      'Abre los ojos con la certeza de que tu deseo está en camino.'
    ],
    affirmations: ['Mis deseos se manifiestan con facilidad.', 'Soy un creador consciente de mi realidad.', 'El universo conspira a mi favor.'],
    music: 'Música inspiradora con frecuencias 432Hz',
    imagePrompt: 'Person manifesting dreams with golden light rays from hands',
    featured: true
  },
  {
    id: 37,
    name: 'Tablero de Visión Mental',
    description: 'Crea un tablero de visión en tu mente con imágenes de tu vida ideal.',
    duration: 18,
    category: 'manifestacion',
    level: 'principiante',
    guide: 'Tu mente no distingue entre lo que imaginas vívidamente y lo real. Usemos esto a tu favor...',
    benefits: ['Clarifica la visión de vida', 'Activa el subconsciente', 'Motiva hacia las metas', 'Mejora el enfoque'],
    steps: [
      'Cierra los ojos. Imagina una pantalla grande frente a ti.',
      'Esta pantalla mostrará diferentes áreas de tu vida ideal.',
      'Primero: tu hogar ideal. ¿Dónde vives? ¿Cómo es? Siente que estás ahí.',
      'Segundo: tu trabajo o propósito ideal. ¿Qué haces? ¿Cómo te sientes haciéndolo?',
      'Tercero: tus relaciones ideales. ¿Con quién estás? ¿Cómo es el amor?',
      'Cuarto: tu salud y cuerpo ideal. ¿Cómo te ves y sientes?',
      'Quinto: tu estilo de vida ideal. ¿Qué haces en tu tiempo libre?',
      'Cada imagen es nítida y vibrante. Coloca todas en tu tablero mental.',
      'Este tablero está guardado en tu mente. Visítalo cada día.',
      'Siente gratitud por esta vida que está manifestándose.',
      'Abre los ojos con tu visión clara y tu motivación renovada.'
    ],
    affirmations: ['Mi visión se manifiesta en mi realidad.', 'Veo claramente el camino hacia mis sueños.', 'Mi vida ideal existe y está llegando.'],
    music: 'Música upliftante con sintetizadores etéreos',
    imagePrompt: 'Mental vision board floating in space with life goals images',
    tags: ['visión', 'metas', 'futuro']
  },
  {
    id: 38,
    name: 'Alineación de Vibración',
    description: 'Sintoniza tu vibración con la frecuencia de aquello que deseas atraer.',
    duration: 15,
    category: 'manifestacion',
    level: 'avanzado',
    guide: 'Todo es energía y vibración. Para atraer algo, debes vibrar en su misma frecuencia...',
    benefits: ['Entiende la ley de atracción', 'Eleva la vibración personal', 'Mejora la manifestación', 'Aumenta la consciencia energética'],
    steps: [
      'Siéntate cómodamente. Respira y piensa en lo que quieres atraer.',
      'Todo tiene una vibración. El amor, la abundancia, la salud son frecuencias elevadas.',
      'Pregúntate: ¿Cómo se siente tener lo que deseo? ¿Es alegría, paz, plenitud?',
      'Esa emoción es la frecuencia. Tu trabajo es sintonizarte con ella.',
      'Comienza a generar esa emoción ahora, sin la manifestación física.',
      'Como una radio, sintoniza la estación de la abundancia, el amor, o lo que buscas.',
      'Siente cómo tu cuerpo vibra más alto. Más ligero. Más expandido.',
      'Cuando vibras en la frecuencia correcta, la manifestación es inevitable.',
      'Mantén esta vibración elevada durante tu día.',
      'Abre los ojos, vibrando en la frecuencia de tus sueños.'
    ],
    affirmations: ['Vibro en la frecuencia de mis deseos.', 'Mi energía atrae lo que resuana con ella.', 'Soy un ser de alta vibración.'],
    music: 'Frecuencias 528Hz con armónicos elevados',
    imagePrompt: 'Person glowing with rainbow vibrational energy field',
    premium: true
  },

  // ----- CONCENTRACIÓN (3 meditaciones) -----
  {
    id: 39,
    name: 'Enfoque de Láser',
    description: 'Entrena tu mente para concentrarse en una sola cosa con claridad cristalina.',
    duration: 12,
    category: 'concentracion',
    level: 'principiante',
    guide: 'La mente saltarina puede ser entrenada. Como un músculo, la concentración se fortalece con práctica...',
    benefits: ['Mejora la concentración', 'Reduce la distracción', 'Aumenta la productividad', 'Entrena la mente'],
    steps: [
      'Siéntate cómodamente. Elige un punto de enfoque: tu respiración, una vela, un punto.',
      'Dirige toda tu atención a ese punto. Es lo único que existe ahora.',
      'Cuando tu mente divague, gentilmente regresa al punto de enfoque.',
      'No te juzgues por divagar. Es la naturaleza de la mente.',
      'Cada vez que regresas, fortaleces el músculo de la concentración.',
      'Como un rayo láser, tu atención se vuelve más precisa y potente.',
      'El mundo exterior se desvanece. Solo tú y tu punto de enfoque existen.',
      'Respira en el enfoque. Siente el poder de la atención unidireccional.',
      'Con práctica, podrás mantener este enfoque en cualquier actividad.',
      'Abre los ojos con la mente clara y enfocada.'
    ],
    affirmations: ['Mi mente está clara y enfocada.', 'Dirijo mi atención con poder y precisión.', 'La concentración es mi superpoder.'],
    music: 'Sonidos binaurales beta para enfoque',
    imagePrompt: 'Person with laser-focused attention, mind glowing with clarity',
    tags: ['productividad', 'atención', 'claridad mental']
  },

  // ----- ENERGÍA (3 meditaciones) -----
  {
    id: 40,
    name: 'Recarga Energética',
    description: 'Recupera tu vitalidad conectándote con fuentes infinitas de energía universal.',
    duration: 15,
    category: 'energia',
    level: 'principiante',
    guide: 'Tu cuerpo es un conductor de energía. Vamos a recargarte con la fuente infinita...',
    benefits: ['Aumenta la vitalidad', 'Reduce el agotamiento', 'Mejora el estado de ánimo', 'Conecta con la fuente'],
    steps: [
      'Siéntate o párate cómodamente. Imagina que eres un recipiente de energía.',
      'Sobre ti, el sol o una luz dorada universal brilla intensamente.',
      'Bajo ti, la tierra te sostiene con su energía estable y nutritiva.',
      'Inhala y visualiza luz dorada entrando por tu coronilla.',
      'La luz llena tu cabeza, cuello, pecho, abdomen, brazos, piernas.',
      'Exhala y visualiza que expulsas cualquier energía estancada o gris.',
      'Con cada respiración, te llenas más de luz y vitalidad.',
      'Tus células bailan con nueva energía. Te sientes vivo/a, vibrante.',
      'Eres un canal entre el cielo y la tierra. Energía infinita fluye a través de ti.',
      'Abre los ojos sintiéndote completamente recargado/a.'
    ],
    affirmations: ['Mi energía es ilimitada y renovable.', 'Me conecto con la fuente de toda vitalidad.', 'Estoy lleno/a de fuerza y vida.'],
    music: 'Música energizante con frecuencias altas',
    imagePrompt: 'Person being recharged by golden light from above and earth energy below',
    featured: true
  },
  {
    id: 41,
    name: 'Escudo de Protección',
    description: 'Crea un campo energético de protección a tu alrededor para mantener tu energía limpia.',
    duration: 12,
    category: 'proteccion',
    level: 'principiante',
    guide: 'En un mundo lleno de energías, necesitas protección. Vamos a crear tu escudo personal...',
    benefits: ['Protege de energías negativas', 'Mantiene la energía propia', 'Reduce la sensibilidad empática', 'Fortalece los límites energéticos'],
    steps: [
      'Siéntate cómodamente. Respira y centra tu energía.',
      'Imagina una luz blanca brillante en el centro de tu pecho.',
      'Esta luz se expande hacia afuera, formando una esfera a tu alrededor.',
      'La esfera te rodea completamente: arriba, abajo, adelante, atrás.',
      'Es un escudo de luz. Nada negativo puede penetrarlo.',
      'Cualquier energía que no sea para tu bien más alto, rebota en el escudo.',
      'Visualiza el escudo brillante e impenetrable.',
      'Puedes programarlo: "Solo permite el amor y la luz."',
      'Tu escudo está activo ahora. Te protege donde quiera que vayas.',
      'Abre los ojos sintiéndote seguro/a y protegido/a.'
    ],
    affirmations: ['Estoy protegido/a por un escudo de luz.', 'Solo permito energías de amor y bien.', 'Mi campo energético es sagrado e inviolable.'],
    music: 'Sonidos de protección con tonos graves',
    imagePrompt: 'Person surrounded by protective golden light shield sphere',
    tags: ['protección', 'límites', 'energía']
  },
  {
    id: 42,
    name: 'Limpieza del Aura',
    description: 'Limpia tu campo áurico de energías acumuladas que no te pertenecen.',
    duration: 18,
    category: 'proteccion',
    level: 'intermedio',
    guide: 'Tu aura absorbe energías del ambiente. Es hora de limpiarla y restaurarla...',
    benefits: ['Limpia el campo energético', 'Restaura la claridad áurica', 'Mejora la sensibilidad espiritual', 'Promueve el bienestar'],
    steps: [
      'Siéntate cómodamente. Respira y visualiza tu aura, el campo de luz a tu alrededor.',
      'Observa si hay manchas, colores turbios, o zonas oscuras.',
      'Esto es energía acumulada que no te pertenece.',
      'Imagina una lluvia de luz plateada cayendo sobre ti.',
      'La luz atraviesa tu aura, arrastrando las impurezas hacia la tierra.',
      'Tu aura se vuelve más clara, más brillante con cada lavado de luz.',
      'Visualiza tus manos barriendo tu aura, sacudiendo lo que sobra.',
      'Finalmente, visualiza una luz dorada llenando tu aura limpia.',
      'Tu aura ahora brilla con tu propia luz, clara y radiante.',
      'Abre los ojos sintiéndote ligero/a y renovado/a energéticamente.'
    ],
    affirmations: ['Mi aura está limpia y radiante.', 'Suelgo toda energía que no me pertenece.', 'Brillo con mi propia luz auténtica.'],
    music: 'Sonidos de lluvia con cuencos de cristal',
    imagePrompt: 'Person having their aura cleansed by waterfall of white light',
    premium: true
  }
]

// ==================== SONIDOS SIN GUIAR ====================

export const unguidedMeditations: UnguidedMeditation[] = [
  // ----- CUENCOS TIBETANOS (6) -----
  { id: 101, name: 'Cuenco Raíz', description: 'Frecuencia del chakra raíz para grounding y estabilidad', duration: 15, category: 'Chakra Raíz', audioType: 'cuencos', benefits: ['Grounding', 'Estabilidad', 'Seguridad'], frequency: '396Hz', color: 'from-red-600 to-red-800', icon: '🔴' },
  { id: 102, name: 'Cuenco Sacro', description: 'Frecuencia del chakra sacro para creatividad y pasión', duration: 15, category: 'Chakra Sacro', audioType: 'cuencos', benefits: ['Creatividad', 'Pasión', 'Placer'], frequency: '417Hz', color: 'from-orange-500 to-orange-700', icon: '🟠' },
  { id: 103, name: 'Cuenco Plexo Solar', description: 'Frecuencia del chakra del plexo solar para poder personal', duration: 15, category: 'Chakra Plexo Solar', audioType: 'cuencos', benefits: ['Poder personal', 'Confianza', 'Voluntad'], frequency: '528Hz', color: 'from-yellow-500 to-yellow-700', icon: '🟡' },
  { id: 104, name: 'Cuenco Corazón', description: 'Frecuencia del chakra corazón para amor y compasión', duration: 20, category: 'Chakra Corazón', audioType: 'cuencos', benefits: ['Amor', 'Compasión', 'Sanación'], frequency: '639Hz', color: 'from-green-500 to-green-700', icon: '🟢' },
  { id: 105, name: 'Cuenco Garganta', description: 'Frecuencia del chakra garganta para expresión', duration: 15, category: 'Chakra Garganta', audioType: 'cuencos', benefits: ['Expresión', 'Verdad', 'Comunicación'], frequency: '741Hz', color: 'from-blue-500 to-blue-700', icon: '🔵' },
  { id: 106, name: 'Cuenco Tercer Ojo', description: 'Frecuencia del chakra tercer ojo para intuición', duration: 20, category: 'Chakra Tercer Ojo', audioType: 'cuencos', benefits: ['Intuición', 'Claridad', 'Visión'], frequency: '852Hz', color: 'from-indigo-500 to-indigo-700', icon: '🟣' },

  // ----- FRECUENCIAS SOLFEGGIO (6) -----
  { id: 107, name: 'UT - 396Hz', description: 'Libera miedo y culpa. Frecuencia de transformación', duration: 20, category: 'Solfeggio', audioType: 'frecuencias', benefits: ['Liberar miedo', 'Transformación', 'Sanación'], frequency: '396Hz', color: 'from-purple-600 to-purple-800', icon: '🎵' },
  { id: 108, name: 'RE - 417Hz', description: 'Facilita el cambio y deshace situaciones negativas', duration: 20, category: 'Solfeggio', audioType: 'frecuencias', benefits: ['Cambio positivo', 'Liberación', 'Renovación'], frequency: '417Hz', color: 'from-violet-600 to-violet-800', icon: '🎵' },
  { id: 109, name: 'MI - 528Hz', description: 'Frecuencia del amor y la reparación del ADN', duration: 25, category: 'Solfeggio', audioType: 'frecuencias', benefits: ['Amor', 'Sanación ADN', 'Milagros'], frequency: '528Hz', color: 'from-pink-500 to-pink-700', icon: '🎵', featured: true },
  { id: 110, name: 'FA - 639Hz', description: 'Conexión y relaciones armoniosas', duration: 20, category: 'Solfeggio', audioType: 'frecuencias', benefits: ['Relaciones', 'Armonía', 'Conexión'], frequency: '639Hz', color: 'from-rose-500 to-rose-700', icon: '🎵' },
  { id: 111, name: 'SOL - 741Hz', description: 'Despierta la intuición y limpia toxinas', duration: 20, category: 'Solfeggio', audioType: 'frecuencias', benefits: ['Intuición', 'Limpieza', 'Despertar'], frequency: '741Hz', color: 'from-amber-500 to-amber-700', icon: '🎵' },
  { id: 112, name: 'LA - 852Hz', description: 'Despertar espiritual y retorno al orden espiritual', duration: 20, category: 'Solfeggio', audioType: 'frecuencias', benefits: ['Despertar espiritual', 'Orden divino', 'Paz'], frequency: '852Hz', color: 'from-cyan-500 to-cyan-700', icon: '🎵' },

  // ----- NATURALEZA (8) -----
  { id: 113, name: 'Lluvia Suave', description: 'Sonido de lluvia gentil para relajación profunda', duration: 30, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Relajación', 'Concentración', 'Paz'], color: 'from-slate-500 to-slate-700', icon: '🌧️' },
  { id: 114, name: 'Tormenta Lejana', description: 'Truenos distantes para dormir profundamente', duration: 45, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Sueño profundo', 'Confort', 'Seguridad'], color: 'from-gray-600 to-gray-800', icon: '⛈️' },
  { id: 115, name: 'Olas del Mar', description: 'Sonido de olas rompiendo en la orilla', duration: 30, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Calma', 'Meditación', 'Paz mental'], color: 'from-blue-400 to-blue-600', icon: '🌊' },
  { id: 116, name: 'Bosque Lluvioso', description: 'Sonidos de un bosque tropical húmedo', duration: 30, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Conexión natural', 'Renovación', 'Paz'], color: 'from-green-600 to-green-800', icon: '🌲' },
  { id: 117, name: 'Canto de Pájaros', description: 'Aves del amanecer para comenzar el día', duration: 20, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Alegría', 'Energía matutina', 'Vitalidad'], color: 'from-sky-400 to-sky-600', icon: '🐦' },
  { id: 118, name: 'Cascada', description: 'Agua cayendo suavemente entre rocas', duration: 25, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Limpieza mental', 'Fluidez', 'Purificación'], color: 'from-teal-500 to-teal-700', icon: '💧' },
  { id: 119, name: 'Viento en los Árboles', description: 'Brisa suave moviendo hojas', duration: 20, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Soltar', 'Movimiento', 'Liberación'], color: 'from-emerald-500 to-emerald-700', icon: '🍃' },
  { id: 120, name: 'Noche de Grillos', description: 'Sonidos nocturnos de verano', duration: 45, category: 'Naturaleza', audioType: 'naturaleza', benefits: ['Sueño', 'Paz nocturna', 'Conexión'], color: 'from-indigo-800 to-purple-900', icon: '🦗' },

  // ----- MANTRAS (6) -----
  { id: 121, name: 'OM - El Sonido Primordial', description: 'El mantra más sagrado del universo', duration: 20, category: 'Mantras', audioType: 'mantras', benefits: ['Unidad', 'Paz', 'Conexión divina'], color: 'from-purple-600 to-purple-800', icon: '🕉️', featured: true },
  { id: 122, name: 'Om Mani Padme Hum', description: 'Mantra de compasión del budismo tibetano', duration: 25, category: 'Mantras', audioType: 'mantras', benefits: ['Compasión', 'Sabiduría', 'Transformación'], color: 'from-pink-500 to-pink-700', icon: '☸️' },
  { id: 123, name: 'Gayatri Mantra', description: 'Mantra védico para iluminación', duration: 20, category: 'Mantras', audioType: 'mantras', benefits: ['Iluminación', 'Protección', 'Sabiduría'], color: 'from-amber-500 to-amber-700', icon: '☀️' },
  { id: 124, name: 'So Ham', description: 'Mantra de la respiración: "Yo soy Eso"', duration: 15, category: 'Mantras', audioType: 'mantras', benefits: ['Autoconocimiento', 'Unidad', 'Paz'], color: 'from-cyan-500 to-cyan-700', icon: '🌙' },
  { id: 125, name: 'Om Namah Shivaya', description: 'Mantra de devoción a Shiva', duration: 20, category: 'Mantras', audioType: 'mantras', benefits: ['Transformación', 'Devoción', 'Poder interior'], color: 'from-blue-600 to-blue-800', icon: '🔱' },
  { id: 126, name: 'Lokah Samastah Sukhino Bhavantu', description: 'Mantra de amor universal', duration: 15, category: 'Mantras', audioType: 'mantras', benefits: ['Amor universal', 'Paz mundial', 'Compasión'], color: 'from-rose-400 to-rose-600', icon: '💗' },

  // ----- AMBIENTAL (6) -----
  { id: 127, name: 'Espacio Profundo', description: 'Sonidos ambientales del cosmos', duration: 30, category: 'Ambiental', audioType: 'ambiental', benefits: ['Expansión', 'Meditación profunda', 'Trascendencia'], color: 'from-indigo-900 to-black', icon: '🌌' },
  { id: 128, name: 'Templo Tibetano', description: 'Ambiente de un monasterio en los Himalayas', duration: 30, category: 'Ambiental', audioType: 'ambiental', benefits: ['Espiritualidad', 'Paz', 'Tradición'], color: 'from-orange-600 to-orange-800', icon: '🛕' },
  { id: 129, name: 'Cueva de Cristal', description: 'Resonancia de una cueva de cristales', duration: 25, category: 'Ambiental', audioType: 'ambiental', benefits: ['Sanación', 'Claridad', 'Purificación'], color: 'from-violet-400 to-violet-600', icon: '💎' },
  { id: 130, name: 'Jardín Zen', description: 'Atmósfera de un jardín japonés', duration: 20, category: 'Ambiental', audioType: 'ambiental', benefits: ['Simplicidad', 'Armonía', 'Paz'], color: 'from-green-400 to-green-600', icon: '🎋' },
  { id: 131, name: 'Noche Estrellada', description: 'Ambiente nocturno sereno', duration: 45, category: 'Ambiental', audioType: 'ambiental', benefits: ['Sueño', 'Misterio', 'Paz'], color: 'from-blue-900 to-indigo-900', icon: '✨' },
  { id: 132, name: 'Amanecer Dorado', description: 'Sonidos del amanecer', duration: 15, category: 'Ambiental', audioType: 'ambiental', benefits: ['Nuevo comienzo', 'Esperanza', 'Energía'], color: 'from-yellow-400 to-orange-500', icon: '🌅' },

  // ----- BINAURAL (4) -----
  { id: 133, name: 'Delta - Sueño Profundo', description: 'Ondas delta para sueño reparador (0.5-4 Hz)', duration: 45, category: 'Binaural', audioType: 'binaural', benefits: ['Sueño profundo', 'Regeneración', 'Sanación'], frequency: 'Delta (2Hz)', color: 'from-indigo-900 to-purple-900', icon: '😴', premium: true },
  { id: 134, name: 'Theta - Meditación', description: 'Ondas theta para meditación profunda (4-8 Hz)', duration: 30, category: 'Binaural', audioType: 'binaural', benefits: ['Meditación', 'Creatividad', 'Intuición'], frequency: 'Theta (6Hz)', color: 'from-purple-700 to-violet-900', icon: '🧘' },
  { id: 135, name: 'Alpha - Relajación', description: 'Ondas alpha para relajación consciente (8-13 Hz)', duration: 20, category: 'Binaural', audioType: 'binaural', benefits: ['Relajación', 'Aprendizaje', 'Creatividad'], frequency: 'Alpha (10Hz)', color: 'from-cyan-600 to-blue-800', icon: '🌊' },
  { id: 136, name: 'Beta - Enfoque', description: 'Ondas beta para concentración (13-30 Hz)', duration: 15, category: 'Binaural', audioType: 'binaural', benefits: ['Concentración', 'Productividad', 'Alerta'], frequency: 'Beta (14Hz)', color: 'from-yellow-500 to-orange-600', icon: '⚡' }
]

// ==================== PROGRAMAS DE MEDITACIÓN ====================

export const meditationPrograms: MeditationProgram[] = [
  {
    id: 1,
    name: 'Introducción a la Meditación',
    description: 'Un programa de 7 días para principiantes que quieren establecer una práctica sólida.',
    duration: '7 días',
    level: 'principiante',
    meditations: [4, 8, 24, 30, 21, 5, 1],
    benefits: ['Establecer hábito meditativo', 'Reducir estrés', 'Mejorar concentración'],
    icon: '🌱',
    color: 'from-green-400 to-teal-500'
  },
  {
    id: 2,
    name: 'Sanación Emocional',
    description: '21 días de meditaciones enfocadas en sanar heridas emocionales y trauma.',
    duration: '21 días',
    level: 'intermedio',
    meditations: [14, 16, 27, 33, 34, 28, 15, 13, 32, 17, 31, 35, 11, 29, 26, 7, 3, 12, 19, 20, 30],
    benefits: ['Sanar heridas del pasado', 'Liberar emociones atrapadas', 'Aumentar autoestima'],
    icon: '💚',
    color: 'from-emerald-400 to-green-600',
    premium: true
  },
  {
    id: 3,
    name: 'Manifestación de Abundancia',
    description: '30 días para transformar tu mentalidad y atraer prosperidad.',
    duration: '30 días',
    level: 'intermedio',
    meditations: [18, 19, 20, 36, 37, 38, 1, 5, 6, 11, 12, 13, 27, 28, 29, 30, 31, 32, 33, 34, 35, 40, 41, 42, 14, 15, 16, 7, 3, 1],
    benefits: ['Mentalidad de abundancia', 'Atraer prosperidad', 'Eliminar bloqueos'],
    icon: '🌟',
    color: 'from-yellow-400 to-orange-500',
    premium: true
  },
  {
    id: 4,
    name: 'Maestría del Sueño',
    description: '14 días para transformar tu sueño y despertar renovado.',
    duration: '14 días',
    level: 'principiante',
    meditations: [21, 22, 23, 8, 9, 10, 24, 25, 26, 3, 14, 15, 21, 22],
    benefits: ['Mejorar calidad del sueño', 'Reducir insomnio', 'Despertar renovado'],
    icon: '🌙',
    color: 'from-indigo-400 to-purple-600'
  },
  {
    id: 5,
    name: 'Despertar Espiritual',
    description: '21 días para profundizar tu conexión espiritual y expandir tu conciencia.',
    duration: '21 días',
    level: 'avanzado',
    meditations: [11, 12, 13, 1, 3, 7, 14, 15, 16, 17, 28, 29, 33, 34, 35, 36, 37, 38, 40, 41, 42],
    benefits: ['Expandir conciencia', 'Conexión espiritual', 'Propósito de vida'],
    icon: '✨',
    color: 'from-purple-400 to-violet-600',
    premium: true
  },
  {
    id: 6,
    name: 'Calma y Claridad',
    description: '10 días para reducir la ansiedad y encontrar paz mental.',
    duration: '10 días',
    level: 'principiante',
    meditations: [24, 25, 26, 8, 9, 10, 4, 5, 12, 30],
    benefits: ['Reducir ansiedad', 'Calmar la mente', 'Encontrar paz'],
    icon: '🧘',
    color: 'from-blue-400 to-cyan-500'
  }
]

// ==================== FUNCIONES DE UTILIDAD ====================

export function getMeditationById(id: number): Meditation | undefined {
  return meditations.find(meditation => meditation.id === id)
}

export function getMeditationsByCategory(category: Meditation['category']): Meditation[] {
  return meditations.filter(meditation => meditation.category === category)
}

export function getMeditationsByLevel(level: Meditation['level']): Meditation[] {
  return meditations.filter(meditation => meditation.level === level)
}

export function getFeaturedMeditations(): Meditation[] {
  return meditations.filter(meditation => meditation.featured)
}

export function getUnguidedByType(audioType: AudioType): UnguidedMeditation[] {
  return unguidedMeditations.filter(m => m.audioType === audioType)
}

export function getProgramById(id: number): MeditationProgram | undefined {
  return meditationPrograms.find(program => program.id === id)
}
