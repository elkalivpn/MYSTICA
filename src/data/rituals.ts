export interface Ritual {
  id: number
  name: string
  description: string
  category: 'luna' | 'proteccion' | 'amor' | 'abundancia' | 'limpieza' | 'manifestacion'
  moonPhase?: string
  duration: string
  materials: string[]
  steps: string[]
  incantation?: string
  tips: string[]
  guide: string
  premium: boolean
}

export const rituals: Ritual[] = [
  {
    id: 1,
    name: 'Baño de Luna Llena',
    description: 'Un ritual de purificación y recarga energética bajo la luz de la Luna Llena. Ideal para liberar lo que ya no sirve y manifestar nuevos deseos.',
    category: 'luna',
    moonPhase: 'Luna Llena',
    duration: '30-45 minutos',
    materials: [
      'Sal marina o sal del Himalaya',
      'Pétalos de flores blancas',
      'Vela blanca',
      'Aceite esencial de lavanda (opcional)',
      'Cristal de cuarzo o selenita'
    ],
    steps: [
      'Prepara el baño llenando la tina con agua caliente.',
      'Añade la sal marina, visualizando cómo purifica el agua.',
      'Esparce los pétalos de flores sobre el agua.',
      'Enciende la vela blanca y colócala en un lugar seguro.',
      'Si tienes cristales, ponlos cerca del baño o sumérgelos si es seguro.',
      'Entra al baño con intención. Relájate y permite que la luz de la luna (real o visualizada) te bañe.',
      'Cierra los ojos y visualiza la luz plateada de la luna entrando por tu coronilla.',
      'Declara lo que deseas liberar: "Dejo ir todo lo que ya no sirve a mi bien más elevado."',
      'Declara lo que deseas manifestar: "Recibo con gratitud [tu deseo]."',
      'Permanece en el baño el tiempo que sientas necesario, mínimo 20 minutos.',
      'Al salir, agradece a la Luna y deja que el agua se drene llevándose lo que soltaste.'
    ],
    incantation: 'Bajo la luz de la Madre Luna, me purifico, me renuevo, me elevo. Que sus rayos plateados laven mi ser y llenen mi espíritu de luz renovada.',
    tips: [
      'Realízalo preferiblemente en la noche de luna llena o hasta 3 días después.',
      'Puedes dejar un vaso con agua bajo la luna para crear "agua de luna" y usarla después.',
      'Si no tienes tina, puedes hacer una ducha de limpieza visualizando la luz lunar.'
    ],
    guide: 'Selene, la diosa de la Luna, te guiará en este ritual de purificación y renovación.',
    premium: false
  },
  {
    id: 2,
    name: 'Siembra de Luna Nueva',
    description: 'Un ritual para plantar las semillas de tus intenciones durante la Luna Nueva, el momento más poderoso para nuevos comienzos.',
    category: 'luna',
    moonPhase: 'Luna Nueva',
    duration: '20-30 minutos',
    materials: [
      'Papel y pluma',
      'Vela blanca o morada',
      'Incienso de sándalo o mirra',
      'Una pequeña maceta o jardín',
      'Semillas de tu elección',
      'Tierra'
    ],
    steps: [
      'Crea un espacio sagrado donde no serás molestado/a.',
      'Enciende la vela y el incienso. Siéntate en silencio y respira profundamente.',
      'En el papel, escribe tus intenciones para este ciclo lunar. Sé específico/a y usa tiempo presente.',
      'Lee cada intención en voz alta, sintiendo como si ya fueran realidad.',
      'Prepara la maceta con tierra. Sostén las semillas y carga con tus intenciones.',
      'Planta las semillas diciendo: "Así como estas semillas crecerán, mis sueños florecerán."',
      'Riega la tierra con agua, visualizando cómo nutres tus deseos.',
      'Coloca la maceta donde reciba luz lunar en las noches siguientes.',
      'Mantén el papel de intenciones cerca de tu cama o altar.',
      'Cuida las plantas como simboliza cuidar tus sueños.'
    ],
    incantation: 'En la oscuridad fértil de la Luna Nueva, planto las semillas de mi destino. Que la Madre Tierra las nutra y la Madre Luna las guíe hacia la luz.',
    tips: [
      'Escribe las intenciones en positivo: "Tengo" en lugar de "Quiero tener".',
      'Revisa tus intenciones en la próxima Luna Llena para ver su progreso.',
      'Puedes guardar el papel bajo tu almohada durante el ciclo lunar.'
    ],
    guide: 'Selene te guía en la oscuridad fértil donde nacen todas las posibilidades.',
    premium: false
  },
  {
    id: 3,
    name: 'Círculo de Protección',
    description: 'Un ritual para crear un escudo energético de protección alrededor de ti y tu espacio.',
    category: 'proteccion',
    duration: '15-20 minutos',
    materials: [
      'Sal gruesa',
      'Una vela negra o blanca',
      'Incienso de ruda o salvia',
      'Turmalina negra u obsidiana (opcional)',
      'Aceite de protección (opcional)'
    ],
    steps: [
      'Limpia el espacio con humo de salvia o incienso, moviéndote en sentido horario.',
      'Siéntate en el centro de la habitación. Enciende la vela.',
      'Toma la sal y camina formando un círculo alrededor de ti, dejando caer granos.',
      'Visualiza una esfera de luz blanca formándose desde el suelo hacia arriba.',
      'Imagina que la esfera se completa sobre tu cabeza, sellándote dentro.',
      'Declara: "Este círculo es un espacio de luz y protección. Solo el amor y la verdad pueden entrar."',
      'Sostén el cristal de protección si lo tienes, y visualiza cómo se activa.',
      'Permanece en el círculo el tiempo que necesites para meditar o realizar otro trabajo.',
      'Cuando termines, agradece a los elementos y "abre" el círculo caminando en sentido antihorario.',
      'Recoge la sal y deséchala lejos de tu hogar.'
    ],
    incantation: 'Por el poder de la tierra y la luz del espíritu, trazo este círculo sagrado. Que nada negativo pueda cruzar, que solo el bien habite en mi espacio protegido.',
    tips: [
      'Repite este ritual semanalmente o cuando sientas que tu energía está baja.',
      'Puedes dejar cristales de protección en las esquinas de tu hogar.',
      'Nunca salgas del círculo sin abrirlo primero.'
    ],
    guide: 'Hécate, guardiana de los umbrales, protege tu espacio sagrado.',
    premium: false
  },
  {
    id: 4,
    name: 'Ritual de Autoamor',
    description: 'Una ceremonia sagrada para sanar tu relación contigo mismo/a y abrir tu corazón al amor incondicional.',
    category: 'amor',
    duration: '25-30 minutos',
    materials: [
      'Cuarzo rosa',
      'Vela rosa o roja',
      'Espejo pequeño',
      'Papel y pluma rosa',
      'Aceite de rosa o jazmín',
      'Pétalos de rosa'
    ],
    steps: [
      'Crea un ambiente relajado con música suave y la vela encendida.',
      'Escribe en el papel 10 cosas que amas de ti mismo/a.',
      'Escribe también las heridas que deseas sanar respecto al amor propio.',
      'Sostén el cuarzo rosa sobre tu corazón y cierra los ojos.',
      'Visualiza una luz rosa suave emanando del cristal hacia tu pecho.',
      'Mírate al espejo. Observa tus ojos con compasión, sin juzgarte.',
      'Di en voz alta: "Te amo. Te acepto completamente. Eres merecedor/a de amor."',
      'Quema el papel con las heridas en la vela, simbolizando su liberación.',
      'Guarda el papel con tus cualidades positivas bajo tu almohada.',
      'Unta una gota de aceite en tu corazón y di: "Mi corazón está abierto para dar y recibir amor."'
    ],
    incantation: 'Amo a quien soy, en todas mis facetas. Mi corazón es un templo de amor propio sagrado. Atraigo relaciones que reflejan el amor que siento por mí.',
    tips: [
      'Realiza este ritual cada Luna Nueva en Leo o cuando necesites reconectarte contigo.',
      'Repite las afirmaciones frente al espejo cada mañana.',
      'Lleva el cuarzo rosa contigo como recordatorio de tu valor.'
    ],
    guide: 'Isis, madre amorosa, te guía hacia el amor propio más profundo.',
    premium: true
  },
  {
    id: 5,
    name: 'Atrapa la Abundancia',
    description: 'Un ritual para abrir los caminos de la prosperidad y atraer abundancia a tu vida.',
    category: 'abundancia',
    duration: '30 minutos',
    materials: [
      'Citrino o pirita',
      'Vela verde o dorada',
      'Billete de cualquier denominación',
      'Canela en polvo',
      'Miel',
      'Un frasco con tapa'
    ],
    steps: [
      'En un jueves por la noche (día de Júpiter), prepara tu espacio.',
      'Enciende la vela verde/dorada y coloca el cristal junto a ella.',
      'Unta el billete con un poco de miel, simbolizando la dulzura de la abundancia.',
      'Espolvorea canela sobre el billete para acelerar la manifestación.',
      'Dobla el billete hacia ti tres veces, visualizando cómo la riqueza se multiplica.',
      'Coloca el billete dentro del frasco. Añade más canela y una gota de miel.',
      'Sostén el frasco entre tus manos y visualiza flujo de dinero constante hacia ti.',
      'Di: "La abundancia del universo fluye hacia mí sin esfuerzo. Merezco la prosperidad."',
      'Sella el frasco y colócalo cerca de donde guardas tu dinero o en tu altar.',
      'Cada vez que recibas dinero, agradece y añade una moneda al frasco.'
    ],
    incantation: 'Por el poder de la tierra y la generosidad del universo, abro mis caminos a la prosperidad. El dinero fluye hacia mí como agua de río, constante y abundante.',
    tips: [
      'Realiza este ritual en luna creciente o llena para máximo poder.',
      'No hables de este ritual a otros; mantén la energía concentrada.',
      'Añade monedas al frasco regularmente para mantener la energía activa.'
    ],
    guide: 'Thoth, señor de la sabiduría y los números, bendice tu camino hacia la abundancia.',
    premium: false
  },
  {
    id: 6,
    name: 'Limpieza Energética del Hogar',
    description: 'Un ritual completo para limpiar tu hogar de energías estancadas o negativas y renovar su vibración.',
    category: 'limpieza',
    duration: '45-60 minutos',
    materials: [
      'Salvia o palo santo',
      'Campana o cuenco tibetano',
      'Sal gruesa',
      'Velas blancas (varias)',
      'Agua bendita o de luna',
      'Aceites esenciales de lavanda y limón'
    ],
    steps: [
      'Abre todas las ventanas para que la energía pueda salir.',
      'Comienza en la entrada principal. Enciende la salvia y sopla el humo en las cuatro direcciones.',
      'Camina por toda la casa en sentido horario, permitiendo que el humo llegue a cada rincón.',
      'En cada habitación, usa la campana o cuenco para romper energías estancadas.',
      'Coloca un poco de sal en las esquinas de cada habitación. Déjala por 24 horas.',
      'Enciende velas blancas en cada habitación principal.',
      'Rocía agua bendita o de luna mientras declaras: "Esta casa es un templo de luz y paz."',
      'Añade gotas de aceites esenciales en un difusor o en recipientes con agua.',
      'Termina en la entrada principal, agradeciendo a los elementos su ayuda.',
      'Cierra el ritual declarando: "Este hogar está limpio, protegido y lleno de luz."'
    ],
    incantation: 'Por el aire que limpio, por el fuego que purifica, por el agua que bendice, por la tierra que protege: este hogar es sagrado, este hogar es luz.',
    tips: [
      'Realiza esta limpieza al mudarte, después de conflictos, o estacionalmente.',
      'Mantén las ventanas abiertas hasta que el humo se disipe completamente.',
      'Barrer la sal a las 24 horas y deshacerla fuera de casa.'
    ],
    guide: 'Hécate te guía en la limpieza de umbrales y la protección del hogar.',
    premium: true
  },
  {
    id: 7,
    name: 'Manifestación de Deseos',
    description: 'Un poderoso ritual para manifestar tus deseos más profundos utilizando la ley de la atracción y magia práctica.',
    category: 'manifestacion',
    duration: '20-30 minutos',
    materials: [
      'Papel de pergamino o blanco',
      'Pluma con tinta dorada o roja',
      'Vela de color según el deseo',
      'Cristal de cuarzo',
      'Hierbas correspondientes al deseo',
      'Cinta del color apropiado'
    ],
    steps: [
      'Define claramente tu deseo. Sé específico pero deja espacio para que el universo te sorprenda.',
      'Enciende la vela del color apropiado (verde=prosperidad, rosa=amor, amarillo=éxito).',
      'Escribe tu deseo en el papel como si ya fuera realidad: "Estoy felizmente..."',
      'Dobla el papel hacia ti tres veces, atrayendo el deseo hacia tu ser.',
      'Coloca el papel bajo el cristal de cuarzo junto a la vela.',
      'Riega las hierbas alrededor formando un círculo.',
      'Visualiza tu deseo cumplido con todos los sentidos. Siente la emoción de ya tenerlo.',
      'Recita tu deseo en voz alta tres veces con convicción.',
      'Deja que la vela se consuma completamente si es segura.',
      'Envuelve los restos en la cinta y guárdalos en un lugar especial hasta que se manifieste.'
    ],
    incantation: 'Pido esto no desde la carencia, sino desde la certeza de que ya es mío. El universo conspira a mi favor, y mis deseos se manifiestan en perfecto timing divino.',
    tips: [
      'Realiza en luna creciente o llena para deseos de incremento.',
      'Suelta el apego al resultado después del ritual.',
      'Mantén una actitud de gratitud como si ya tuvieras lo que pediste.'
    ],
    guide: 'La Pitia canaliza tu intención hacia los reinos donde todo es posible.',
    premium: true
  },
  {
    id: 8,
    name: 'Corte de Lazos Kármicos',
    description: 'Un ritual para liberarte de conexiones energéticas que ya no sirven a tu bien más elevado.',
    category: 'limpieza',
    duration: '25-30 minutos',
    materials: [
      'Vela negra y vela blanca',
      'Tijeras o cuchillo ceremonial',
      'Cuerda o cinta negra',
      'Papel y pluma',
      'Incienso de ruda',
      'Cuenco con agua salada'
    ],
    steps: [
      'Escribe en el papel el nombre de la persona o situación de la que deseas liberarte.',
      'Enciende la vela negra (transformación) y la blanca (paz y luz).',
      'Corta un trozo de cuerda y haz un nudo por cada lazo que identifiques.',
      'Sostén la cuerda con los nudos y visualiza los lazos que te conectan.',
      'Con las tijeras, corta cada nudo diciendo: "Te libero con amor. Soy libre."',
      'Quema la cuerda cortada y el papel en la vela negra.',
      'Deja que las cenizas caigan en el agua salada para neutralizar la energía.',
      'Lava tus manos con el agua salada, visualizando cómo te purificas.',
      'Apaga las velas diciendo: "Estoy libre. Solo el amor y la luz permanecen en mi vida."',
      'Desecha el agua lejos de tu hogar.'
    ],
    incantation: 'Corto los lazos que ya no sirven, con amor y gratitud por las lecciones. Libre soy, libre seré, en luz y paz camino ahora.',
    tips: [
      'No realices este ritual con la intención de dañar a otros.',
      'Puedes repetirlo para diferentes personas o situaciones.',
      'Después del ritual, practica el perdón verdadero para completar la liberación.'
    ],
    guide: 'Hécate te guía a través del umbral de la liberación.',
    premium: true
  },
  {
    id: 9,
    name: 'Ritual de la Diosa Luna',
    description: 'Una ceremonia para conectar con la energía de la Diosa Luna y recibir su guía y bendiciones.',
    category: 'luna',
    moonPhase: 'Cualquier fase',
    duration: '30 minutos',
    materials: [
      'Piedra de luna (moonstone)',
      'Vela plateada o blanca',
      'Agua en un cuenco de plata o cristal',
      'Flores blancas',
      'Incienso de jazmín o loto',
      'Ropa blanca o plateada (opcional)'
    ],
    steps: [
      'Prepara tu altar al aire libre donde puedas ver la luna, o junto a una ventana.',
      'Coloca el cuenco con agua para reflejar la luz lunar.',
      'Enciende la vela y el incienso. Rodea el agua con flores blancas.',
      'Sostén la piedra de luna sobre tu corazón y mira hacia la luna.',
      'Respira la luz plateada de la luna. Siente cómo entra por tu coronilla.',
      'Invoca a la Diosa Luna: "Gran Madre Luna, te invoco. Guíame, bendíceme, ilumíname."',
      'Permanece en silencio receptivo. Escucha los mensajes que la Diosa te envía.',
      'Sumerge tus manos en el agua lunar. Lávate la cara con ella.',
      'Agradece a la Diosa por su presencia y guía.',
      'Deja el agua toda la noche bajo la luna para crear agua de luna bendecida.'
    ],
    incantation: 'Oh Diosa de la Luz Plateada, Selene, Artemisa, Hécate. En tus tres formas te honro. Bendíceme con tu sabiduría, guíame con tu luz, protégeme con tu amor eterno.',
    tips: [
      'Adapta la invocación según la fase lunar: doncella (nueva), madre (llena), anciana (menguan).',
      'Usa el agua de luna durante el mes para limpiezas y bendiciones.',
      'Realiza este ritual regularmente para fortalecer tu conexión lunar.'
    ],
    guide: 'Selene, la Diosa Luna, desciende para bendecir tu ceremonia.',
    premium: true
  },
  {
    id: 10,
    name: 'Consagración de Cristales',
    description: 'Un ritual para limpiar, cargar y programar tus cristales con intenciones específicas.',
    category: 'limpieza',
    duration: '15-20 minutos',
    materials: [
      'El cristal a consagrar',
      'Sal gruesa o tierra',
      'Agua (si el cristal lo permite)',
      'Vela blanca',
      'Incienso',
      'Aceite esencial (opcional)'
    ],
    steps: [
      'Investiga si tu cristal puede sumergirse en agua o no.',
      'Limpia el cristal: entiérralo en sal o tierra por 24 horas, o pásalo por humo de incienso.',
      'Si es seguro, enjuágalo bajo agua corriente visualizando cómo la impurezas se van.',
      'Enciende la vela y el incienso. Coloca el cristal entre ellos.',
      'Sostén el cristal con ambas manos. Cierra los ojos y respira.',
      'Visualiza luz blanca entrando por tu coronilla y fluyendo hacia el cristal.',
      'Declara: "Te limpio de toda energía previa. Eres ahora un receptor puro de luz."',
      'Programa el cristal: "Te programo para [tu intención específica]."',
      'Agradece al cristal por su servicio. Promete cuidarlo y respetarlo.',
      'Guarda el cristal en un lugar especial o úsalo según su propósito.'
    ],
    incantation: 'Por la tierra que te formó, por el agua que te pulió, por el fuego que te templó, por el aire que te secó: te consagro como herramienta de luz y poder.',
    tips: [
      'Limpia tus cristales regularmente, especialmente después de uso intenso.',
      'Nunca dejes cristales al sol directo prolongadamente (pueden decolorarse).',
      'Algunos cristales como selenita no necesitan limpieza.'
    ],
    guide: 'Isis te guía en el arte sagrado de trabajar con los cristales.',
    premium: false
  }
]

export function getRitualById(id: number): Ritual | undefined {
  return rituals.find(ritual => ritual.id === id)
}

export function getRitualsByCategory(category: Ritual['category']): Ritual[] {
  return rituals.filter(ritual => ritual.category === category)
}

export function getRitualsByMoonPhase(phase: string): Ritual[] {
  return rituals.filter(ritual => ritual.moonPhase === phase)
}

export function getFreeRituals(): Ritual[] {
  return rituals.filter(ritual => !ritual.premium)
}

export function getPremiumRituals(): Ritual[] {
  return rituals.filter(ritual => ritual.premium)
}
