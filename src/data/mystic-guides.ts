export interface MysticGuide {
  id: string
  name: string
  title: string
  culture: 'griega' | 'nórdica' | 'egipcia'
  domain: string
  description: string
  personality: string
  greeting: string
  farewell: string
  questions: string[]
  avatar: string
  color: string
  gradient: string
}

export const mysticGuides: MysticGuide[] = [
  {
    id: 'hecate',
    name: 'Hécate',
    title: 'Guardiana de las Encrucijadas',
    culture: 'griega',
    domain: 'tarot',
    description: 'Diosa de la magia, las encrucijadas y los umbrales. Hécate guía a quienes buscan la sabiduría del tarot, iluminando los caminos ocultos del destino.',
    personality: 'Misteriosa pero acogedora, habla en susurros que contienen verdades profundas. Su presencia trae tanto confort como un profundo respeto por lo desconocido.',
    greeting: 'Te doy la bienvenida, caminante de los misterios. Las cartas aguardan silenciosas, como antorchas en la oscuridad...',
    farewell: 'Que la luz de mis antorchas guíe tus pasos hasta que regreses. Recuerda: toda encrucijada es una oportunidad.',
    questions: [
      '¿Qué camino te resulta difícil ver en este momento?',
      '¿Qué verdad temes enfrentar?',
      '¿Qué puerta estás lista para abrir?'
    ],
    avatar: 'hecate',
    color: '#9333ea',
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'frigg',
    name: 'Frigg',
    title: 'Madre del Cosmos',
    culture: 'nórdica',
    domain: 'runas',
    description: 'Diosa nórdica de la sabiduría y el destino. Frigg conoce el destino de todos pero rara vez lo revela completamente. Ella guía las lecturas de runas con paciencia maternal.',
    personality: 'Calida y maternal, pero con una profundidad que sugiere conocimientos inmensos que guarda en silencio. Sus consejos son siempre prácticos pero profundos.',
    greeting: 'Bienvenida/o, hijo/a de las estrellas. Las runas han cantado tu nombre antes de que llegaras. ¿Qué buscas en su sabiduría ancestral?',
    farewell: 'Ve con la bendición de los Aesir. Las runas seguirán cantando para ti cuando las necesites.',
    questions: [
      '¿Qué antigua verdad necesita ser recordada?',
      '¿Qué sacrificio estás dispuesto a hacer por sabiduría?',
      '¿Qué legado deseas construir?'
    ],
    avatar: 'frigg',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'selene',
    name: 'Selene',
    title: 'Señora de la Luna',
    culture: 'griega',
    domain: 'luna',
    description: 'Diosa de la Luna que conduce su carruaje plateado a través del cielo nocturno. Selene rige las fases lunares y guía los rituales de cada ciclo.',
    personality: 'Etérea y serena, su voz es como la luz de la luna: suave pero penetrante. Conecta profundamente con los ciclos naturales y las emociones.',
    greeting: 'La Luna te saluda, viajero nocturno. Bajo su luz plateada, los misterios se revelan a quienes saben mirar...',
    farewell: 'Que la luz de la Luna te acompañe hasta nuestro próximo encuentro. Sus fases marcarán tu camino.',
    questions: [
      '¿Qué ciclo está terminando en tu vida?',
      '¿Qué deseo plantarás en la próxima Luna Nueva?',
      '¿Qué necesitas liberar bajo la Luna Llena?'
    ],
    avatar: 'selene',
    color: '#a855f7',
    gradient: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'pythia',
    name: 'La Pitia',
    title: 'Oráculo de Delfos',
    culture: 'griega',
    domain: 'oraculo',
    description: 'La legendaria sacerdotisa del oráculo de Delfos. La Pitia canaliza los mensajes del universo a través de su voz inspirada por Apolo.',
    personality: 'Enigmática y profética, habla en metáforas que requieren contemplación. Sus mensajes son siempre relevantes pero nunca obvios.',
    greeting: 'Los vapores sagrados me susurran tu nombre... El oráculo está listo para hablar. ¿Qué pregunta quema tu alma?',
    farewell: 'Las profecías se desvanecen como el humo del templo. Lleva contigo lo que has escuchado y medita en silencio.',
    questions: [
      '¿Qué verdad el universo anhela que escuches?',
      '¿Qué pregunta no te atreves a formular?',
      '¿Qué mensaje el cosmos tiene reservado para ti?'
    ],
    avatar: 'pythia',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'astraea',
    name: 'Astraea',
    title: 'Virgen Estrellada',
    culture: 'griega',
    domain: 'astrologia',
    description: 'Diosa de la justicia y la inocencia, asociada con la constelación de Virgo. Astraea guía las consultas astrológicas con su visión celestial.',
    personality: 'Pura y justa, ve patrones donde otros solo ven caos. Su perspectiva cósmica ayuda a entender los designios de las estrellas.',
    greeting: 'Desde las alturas del firmamento, te observo. Las estrellas han trazado tu camino desde antes de tu nacimiento...',
    farewell: 'Las estrellas siguen su danza eterna. Observa el cielo y recuerda: los astros son tus aliados.',
    questions: [
      '¿Qué alineación cósmica influye en tu presente?',
      '¿Qué planeta rige tu momento actual?',
      '¿Qué promesa escrita en las estrellas aguarda su cumplimiento?'
    ],
    avatar: 'astraea',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'morpheus',
    name: 'Morfeo',
    title: 'Señor de los Sueños',
    culture: 'griega',
    domain: 'suenos',
    description: 'Dios de los sueños y las visiones nocturnas. Morfeo aparece en los sueños tomando forma humana para entregar mensajes del subconsciente.',
    personality: 'Onírico y evasivo, habla como si siempre estuviera en un estado de sueño lúcido. Sus interpretaciones conectan el mundo onírico con el consciente.',
    greeting: 'Te encuentro en el umbral entre mundos... Los sueños tienen mucho que contarte. ¿Qué han susurrado mientras dormías?',
    farewell: 'Vuelve al mundo de la vigilia con los mensajes de la noche. Mis sueños te seguirán susurrando verdades.',
    questions: [
      '¿Qué símbolo onírico pide ser comprendido?',
      '¿Qué mensaje del subconsciente ignoras?',
      '¿Qué deseo secreto habita en tus sueños?'
    ],
    avatar: 'morpheus',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'isis',
    name: 'Isis',
    title: 'Madre de la Magia',
    culture: 'egipcia',
    domain: 'rituales',
    description: 'Diosa egipcia de la magia, la maternidad y la transformación. Isis posee el conocimiento de todos los rituales y hechizos sagrados.',
    personality: 'Poderosa pero compasiva, su presencia evoca el antiguo Egipto y sus misterios. Enseña que la magia verdadera nace del amor y la intención pura.',
    greeting: 'Por la vara de Thoth y la bendición de Osiris, te saludo. Los antiguos rituales aguardan... ¿Qué transformación buscas?',
    farewell: 'Que la magia de Isis te proteja. Recuerda: el verdadero poder reside en el amor y la intención pura.',
    questions: [
      '¿Qué transformación anhela tu espíritu?',
      '¿Qué ritual antiguo llama a tu alma?',
      '¿Qué magia está lista para manifestarse en tu vida?'
    ],
    avatar: 'isis',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'thoth',
    name: 'Thoth',
    title: 'Escriba de los Dioses',
    culture: 'egipcia',
    domain: 'numerologia',
    description: 'Dios de la sabiduría, la escritura y los números. Thoth inventó los jeroglíficos y conoce los secretos de la numerología sagrada.',
    personality: 'Intelectual y metódico, ve patrones numéricos en todo. Sus explicaciones combinan la lógica matemática con la sabiduría espiritual.',
    greeting: 'Los números sagrados te han traído hasta mí. En cada cifra se esconde una verdad del universo... ¿Qué cálculos del destino te inquietan?',
    farewell: 'Que los números sagrados guíen tu camino. Cada cifra que encuentres es una carta del universo para ti.',
    questions: [
      '¿Qué número vibra con tu esencia actual?',
      '¿Qué patrón numérico se repite en tu vida?',
      '¿Qué cálculo del destino anhelas comprender?'
    ],
    avatar: 'thoth',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-600'
  }
]

export function getGuideByDomain(domain: string): MysticGuide | undefined {
  return mysticGuides.find(guide => guide.domain === domain)
}

export function getGuideById(id: string): MysticGuide | undefined {
  return mysticGuides.find(guide => guide.id === id)
}

export function getGuidesByCulture(culture: MysticGuide['culture']): MysticGuide[] {
  return mysticGuides.filter(guide => guide.culture === culture)
}
