export interface TarotCard {
  id: number
  name: string
  arcana: 'major'
  numeral: string
  hebrewLetter: string
  element?: string
  zodiac?: string
  planet?: string
  keywords: string[]
  upright: string
  reversed: string
  description: string
  symbolism: string
  numerology: string
  affirmation: string
  imagePrompt: string
}

export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: 'El Loco',
    arcana: 'major',
    numeral: '0',
    hebrewLetter: 'Aleph',
    element: 'Aire',
    keywords: ['Comienzos', 'Inocencia', 'Espontaneidad', 'Libertad', 'Aventura'],
    upright: 'Nuevos comienzos, fe en el universo, tomar riesgos calculados, espíritu aventurero.',
    reversed: 'Imprudencia, irresponsabilidad, miedo al cambio, estancamiento por exceso de precaución.',
    description: 'El Loco representa el inicio de un viaje espiritual. Es el alma antes de encarnar, llena de potencial infinito. Su número 0 simboliza el vacío fértil del cual emerge toda creación.',
    symbolism: 'Un joven viajero al borde de un acantilado, con una pequeña bolsa y un perro blanco. El sol ilumina su camino mientras camina con fe hacia lo desconocido.',
    numerology: 'El 0 representa el potencial infinito, el punto de partida de todo. Es la unión del principio y el fin.',
    affirmation: 'Confío en el universo y abrazo mi viaje con fe inquebrantable.',
    imagePrompt: 'A mystical tarot card showing The Fool, a young traveler at a cliff edge with a small bag and white dog, sun shining, mystical purple and gold colors'
  },
  {
    id: 1,
    name: 'El Mago',
    arcana: 'major',
    numeral: 'I',
    hebrewLetter: 'Beth',
    planet: 'Mercurio',
    keywords: ['Manifestación', 'Poder', 'Acción', 'Creatividad', 'Habilidad'],
    upright: 'Manifestar tus deseos, usar tus habilidades, tomar acción decisiva, confianza en tus talentos.',
    reversed: 'Manipulación, mala uso del poder, falta de planificación, desperdiciar el potencial.',
    description: 'El Mago es el puente entre el cielo y la tierra. Con una mano alza la varita hacia el cosmos y con la otra señala la tierra, canalizando la energía divina hacia la manifestación terrena.',
    symbolism: 'El mago ante una mesa con los cuatro elementos: copa, espada, pentáculo y bastón. Sobre su cabeza el símbolo del infinito brilla con luz propia.',
    numerology: 'El 1 representa la unidad, el principio activo, la voluntad creadora y la individualidad.',
    affirmation: 'Tengo todo lo necesario para manifestar mis sueños en realidad.',
    imagePrompt: 'A mystical tarot card showing The Magician with four elements on table, infinity symbol above head, purple and gold mystical theme'
  },
  {
    id: 2,
    name: 'La Sacerdotisa',
    arcana: 'major',
    numeral: 'II',
    hebrewLetter: 'Gimel',
    planet: 'Luna',
    keywords: ['Intuición', 'Misterio', 'Sabiduría interior', 'Lo oculto', 'Paciencia'],
    upright: 'Escuchar tu intuición, misterios por revelar, conexión con lo divino femenino, conocimiento oculto.',
    reversed: 'Ignorar la intuición, secretos reprimidos, desconexión espiritual, superficialidad.',
    description: 'La Sacerdotisa guarda los misterios del templo interior. Sentada entre dos columnas, ella es el umbral entre lo consciente y lo inconsciente, guardiana de la sabiduría ancestral.',
    symbolism: 'Una mujer sentada entre columnas negra y blanca, con un libro en su regazo. La luna a sus pies y un velo decorado con granadas detrás de ella.',
    numerology: 'El 2 representa la dualidad, el equilibrio, la receptividad y el subconsciente.',
    affirmation: 'Mi intuición es mi guía más sabia y confiable.',
    imagePrompt: 'A mystical tarot card showing The High Priestess between two columns, moon at feet, pomegranate veil, deep purple mystical colors'
  },
  {
    id: 3,
    name: 'La Emperatriz',
    arcana: 'major',
    numeral: 'III',
    hebrewLetter: 'Daleth',
    planet: 'Venus',
    keywords: ['Fertilidad', 'Abundancia', 'Naturaleza', 'Creatividad', 'Nurturing'],
    upright: 'Abundancia, fertilidad, creatividad floreciente, conexión con la naturaleza, cuidado maternal.',
    reversed: 'Bloqueo creativo, descuido, dependencia excesiva, desequilibrio en dar y recibir.',
    description: 'La Emperatriz es la madre cósmica, fuente de toda abundancia y creatividad. Rodeada de naturaleza exuberante, ella nutre todos los proyectos y relaciones con amor incondicional.',
    symbolism: 'Una mujer majestuosa en un trono rodeado de naturaleza, con una corona de estrellas. Un cetro en su mano y un escudo con el símbolo de Venus.',
    numerology: 'El 3 representa la creación, la expresión, la fertilidad y la manifestación divina.',
    affirmation: 'Soy un canal de abundancia y creatividad infinita.',
    imagePrompt: 'A mystical tarot card showing The Empress on throne surrounded by nature, crown of stars, Venus symbol, lush green and gold colors'
  },
  {
    id: 4,
    name: 'El Emperador',
    arcana: 'major',
    numeral: 'IV',
    hebrewLetter: 'He',
    planet: 'Marte',
    keywords: ['Autoridad', 'Estructura', 'Control', 'Padre', 'Fundamentos'],
    upright: 'Establecer orden, tomar el control, liderazgo con responsabilidad, construir cimientos sólidos.',
    reversed: 'Tiranía, rigidez excesiva, abuso de poder, falta de disciplina o exceso de control.',
    description: 'El Emperador representa la autoridad divina manifestada en la tierra. Es el arquitecto del universo, estableciendo orden a partir del caos primordial.',
    symbolism: 'Un hombre maduro en un trono de piedra, con armadura bajo su túnica. Un cetro en forma de ankh y un águila a sus pies.',
    numerology: 'El 4 representa la estabilidad, la estructura, el orden y la materialización.',
    affirmation: 'Creo estructuras sólidas que sostienen mis sueños y los de otros.',
    imagePrompt: 'A mystical tarot card showing The Emperor on stone throne, armor, scepter, eagle, deep red and gold mystical colors'
  },
  {
    id: 5,
    name: 'El Sumo Sacerdote',
    arcana: 'major',
    numeral: 'V',
    hebrewLetter: 'Vav',
    planet: 'Júpiter',
    keywords: ['Espiritualidad', 'Tradición', 'Enseñanza', 'Conformidad', 'Mentor'],
    upright: 'Buscar guía espiritual, seguir tradiciones significativas, aprendizaje de un mentor, bendición divina.',
    reversed: 'Rebelión contra dogmas, descubrir tu propia verdad, cuestionar la autoridad espiritual.',
    description: 'El Sumo Sacerdote es el intermediario entre lo divino y lo humano. Guardián de las tradiciones sagradas, enseña los misterios ancestrales a quienes buscan sabiduría.',
    symbolism: 'Un sacerdote entre dos columnas, con dos discípulos arrodillados. Tres cruces y las llaves del cielo a sus pies.',
    numerology: 'El 5 representa el cambio, la enseñanza, la conexión espiritual y la humanidad.',
    affirmation: 'Busco y encuentro la sabiduría en todas las tradiciones sagradas.',
    imagePrompt: 'A mystical tarot card showing The Hierophant between columns, two disciples, keys of heaven, purple and gold sacred colors'
  },
  {
    id: 6,
    name: 'Los Enamorados',
    arcana: 'major',
    numeral: 'VI',
    hebrewLetter: 'Zain',
    zodiac: 'Géminis',
    keywords: ['Amor', 'Unión', 'Elección', 'Armonía', 'Relaciones'],
    upright: 'Unión amorosa, alineación de valores, elección significativa, armonía en relaciones.',
    reversed: 'Desacuerdos, desequilibrio, elección difícil, alejamiento de los valores propios.',
    description: 'Los Enamorados representan la unión sagrada y las elecciones del alma. Más allá del romance, simbolizan la decisión de alinearse con tu verdad más profunda.',
    symbolism: 'Adán y Eva en el jardín del Edén, con un ángel bendiciéndolos. El árbol del conocimiento y la serpiente completan la escena.',
    numerology: 'El 6 representa la armonía, el amor, la belleza y la elección consciente.',
    affirmation: 'Elijo con mi corazón y creo uniones que honran mi alma.',
    imagePrompt: 'A mystical tarot card showing The Lovers, Adam and Eve with angel, tree of knowledge, romantic purple and pink mystical colors'
  },
  {
    id: 7,
    name: 'El Carro',
    arcana: 'major',
    numeral: 'VII',
    hebrewLetter: 'Cheth',
    zodiac: 'Cáncer',
    keywords: ['Victoria', 'Determinación', 'Control', 'Viaje', 'Voluntad'],
    upright: 'Triunfo sobre obstáculos, determinación inquebrantable, avance hacia metas, control de fuerzas opuestas.',
    reversed: 'Falta de dirección, agresión descontrolada, obstáculos insuperables, derrota temporal.',
    description: 'El Carro simboliza la victoria del espíritu sobre la materia. El auriga debe dominar las fuerzas opuestas que tiran de su carro, representando el dominio sobre las pasiones y el control del destino.',
    symbolism: 'Un guerrero en un carro tirado por dos esfinges o caballos de colores opuestos. Un dosel de estrellas corona su cabeza.',
    numerology: 'El 7 representa la perfección, la victoria espiritual, el movimiento y la conquista.',
    affirmation: 'Avanzo con determinación hacia mis metas, dominando toda oposición.',
    imagePrompt: 'A mystical tarot card showing The Chariot with warrior, two sphinxes, star canopy, powerful blue and gold mystical colors'
  },
  {
    id: 8,
    name: 'La Justicia',
    arcana: 'major',
    numeral: 'VIII',
    hebrewLetter: 'Lamed',
    zodiac: 'Libra',
    keywords: ['Justicia', 'Verdad', 'Equilibrio', 'Causa y efecto', 'Legalidad'],
    upright: 'Justicia divina, verdad revelada, equilibrio restaurado, consecuencias de acciones.',
    reversed: 'Injusticia, deshonestidad, desequilibrio, evitar la responsabilidad.',
    description: 'La Justicia representa la ley universal de causa y efecto. Con su espada y balanza, ella pesa cada acción y asegura que el equilibrio cósmico sea mantenido.',
    symbolism: 'Una mujer sentada en un trono, con una espada alzada y una balanza en equilibrio. Dos columnas la flanquean.',
    numerology: 'El 8 representa el equilibrio, la justicia, el karma y la manifestación.',
    affirmation: 'Acepto la verdad y abrazo las consecuencias de mis acciones.',
    imagePrompt: 'A mystical tarot card showing Justice with sword and scales, balanced composition, white and gold mystical colors'
  },
  {
    id: 9,
    name: 'El Ermitaño',
    arcana: 'major',
    numeral: 'IX',
    hebrewLetter: 'Yod',
    zodiac: 'Virgo',
    keywords: ['Introspección', 'Soledad', 'Guía interior', 'Sabiduría', 'Búsqueda'],
    upright: 'Búsqueda interior, soledad constructiva, sabiduría adquirida, guía espiritual.',
    reversed: 'Aislamiento excesivo, rechazo de ayuda, soledad no productiva, cinismo.',
    description: 'El Ermitaño ilumina el camino hacia la interioridad. Con su linterna, guía a otros hacia su propia luz interior, recordando que la verdadera sabiduría nace del silencio.',
    symbolism: 'Un anciano con capa y capucha, sosteniendo una linterna en lo alto de una montaña. Un bastón de peregrino en su mano.',
    numerology: 'El 9 representa la culminación, la introspección, la sabiduría y el servicio.',
    affirmation: 'Encuentro en el silencio las respuestas que busco.',
    imagePrompt: 'A mystical tarot card showing The Hermit on mountain top, lantern raised, walking staff, deep blue and purple mystical colors'
  },
  {
    id: 10,
    name: 'La Rueda de la Fortuna',
    arcana: 'major',
    numeral: 'X',
    hebrewLetter: 'Kaph',
    planet: 'Júpiter',
    keywords: ['Cambio', 'Ciclos', 'Destino', 'Oportunidad', 'Suerte'],
    upright: 'Cambios positivos, ciclos favorables, destino en movimiento, nueva oportunidad.',
    reversed: 'Mala racha, resistir el cambio, fuerzas fuera de control, aprendizaje difícil.',
    description: 'La Rueda de la Fortuna gira eternamente, recordando que todo en la vida es cíclico. Lo que sube debe bajar, y lo que baja subirá de nuevo.',
    symbolism: 'Una rueda con criaturas en diferentes posiciones: una esfinge, una serpiente y Anubis. Las letras ROTA y TARO adornan la rueda.',
    numerology: 'El 10 representa los ciclos, el destino, la perfección y el nuevo comienzo.',
    affirmation: 'Fluyo con los ciclos de la vida, confiando en el giro del destino.',
    imagePrompt: 'A mystical tarot card showing Wheel of Fortune with sphinx, snake, Anubis, TARO letters, golden mystical colors'
  },
  {
    id: 11,
    name: 'La Fuerza',
    arcana: 'major',
    numeral: 'XI',
    hebrewLetter: 'Teth',
    zodiac: 'Leo',
    keywords: ['Fortaleza', 'Coraje', 'Paciencia', 'Control interior', 'Compasión'],
    upright: 'Fuerza interior, coraje ante adversidades, dominio sobre impulsos, compasión.',
    reversed: 'Debilidad, falta de confianza, abuso de poder, autocrítica excesiva.',
    description: 'La Fuerza representa el dominio sobre las pasiones animales a través de la suavidad y el amor. La mujer no domina al león con fuerza bruta, sino con ternura y dominio espiritual.',
    symbolism: 'Una mujer acariciando suavemente a un león. Sobre su cabeza, el símbolo del infinito brilla con luz propia.',
    numerology: 'El 11 representa la fuerza espiritual, la maestría, el coraje y la inspiración.',
    affirmation: 'Mi fuerza interior es mayor que cualquier desafío que enfrente.',
    imagePrompt: 'A mystical tarot card showing Strength with woman and lion, infinity symbol, warm orange and gold mystical colors'
  },
  {
    id: 12,
    name: 'El Colgado',
    arcana: 'major',
    numeral: 'XII',
    hebrewLetter: 'Lamed',
    element: 'Agua',
    keywords: ['Sacrificio', 'Nueva perspectiva', 'Pausa', 'Rendición', 'Iluminación'],
    upright: 'Pausa necesaria, ver desde otra perspectiva, rendición consciente, sacrificio voluntario.',
    reversed: 'Resistencia al cambio, martirio, estancamiento, perspectiva limitada.',
    description: 'El Colgado cuelga voluntariamente, sacrificando su posición para ganar una nueva perspectiva. Su aparente sacrificio es en realidad un acto de iluminación.',
    symbolism: 'Un hombre colgado de un pie de una cruz en forma de T. Su rostro sereno y una aureola dorada indican iluminación.',
    numerology: 'El 12 representa el sacrificio, la iluminación, la prueba espiritual y la entrega.',
    affirmation: 'Me rindo al flujo de la vida y encuentro sabiduría en la pausa.',
    imagePrompt: 'A mystical tarot card showing The Hanged Man upside down on cross, halo, serene expression, blue and purple mystical colors'
  },
  {
    id: 13,
    name: 'La Muerte',
    arcana: 'major',
    numeral: 'XIII',
    hebrewLetter: 'Nun',
    zodiac: 'Escorpio',
    keywords: ['Transformación', 'Final', 'Renacimiento', 'Cambio profundo', 'Liberación'],
    upright: 'Transformación profunda, fin de ciclo, renacimiento, liberación de lo viejo.',
    reversed: 'Resistir el cambio, miedo a transformarse, estancamiento, aferrarse al pasado.',
    description: 'La Muerte no es el fin, sino la transformación absoluta. Es el ciclo necesario de destrucción y creación, la muerte del viejo yo para dar paso al nuevo.',
    symbolism: 'Un esqueleto con armadura montado en un caballo blanco. Reyes y campesinos yacen ante él, mientras el sol se levanta en el horizonte.',
    numerology: 'El 13 representa la transformación, la muerte del ego, el renacimiento y el cambio.',
    affirmation: 'Abrazo la transformación y suelto lo que ya no me sirve.',
    imagePrompt: 'A mystical tarot card showing Death as skeleton on white horse, sun rising, deep black and purple mystical colors'
  },
  {
    id: 14,
    name: 'La Templanza',
    arcana: 'major',
    numeral: 'XIV',
    hebrewLetter: 'Samekh',
    zodiac: 'Sagitario',
    keywords: ['Equilibrio', 'Paciencia', 'Moderación', 'Armonía', 'Alquimia'],
    upright: 'Equilibrio perfecto, paciencia, alquimia espiritual, armonía de opuestos.',
    reversed: 'Desequilibrio, exceso, impaciencia, falta de armonía interior.',
    description: 'La Templanza representa la alquimia espiritual: la mezcla perfecta de opuestos para crear algo más elevado. El ángel vierte líquido entre copas, creando el elixir de la inmortalidad.',
    symbolism: 'Un ángel con un pie en tierra y otro en agua, vertiendo líquido entre dos copas. Un iris y un camino hacia montañas completan la escena.',
    numerology: 'El 14 representa la moderación, la integración, la alquimia y el equilibrio.',
    affirmation: 'Encuentro el equilibrio perfecto en todas las áreas de mi vida.',
    imagePrompt: 'A mystical tarot card showing Temperance angel pouring water between cups, rainbow, mountain path, soft blue and gold mystical colors'
  },
  {
    id: 15,
    name: 'El Diablo',
    arcana: 'major',
    numeral: 'XV',
    hebrewLetter: 'Ayin',
    zodiac: 'Capricornio',
    keywords: ['Ataduras', 'Materialismo', 'Adicción', 'Tentación', 'Sombra'],
    upright: 'Reconocer ataduras, enfrentar la sombra, materialismo excesivo, liberación pendiente.',
    reversed: 'Liberación de ataduras, superar adicciones, recuperar el poder, enfrentar miedos.',
    description: 'El Diablo representa nuestras cadenas autoimpuestas. Pero observa: las cadenas son flojas. Somos prisioneros solo por nuestra propia elección de permanecer atados.',
    symbolism: 'Una figura demoníaca con un pentáculo invertido. Dos figuras encadenadas a su pedestal, pero las cadenas son flojas.',
    numerology: 'El 15 representa la materialidad, la tentación, la prueba y la elección.',
    affirmation: 'Reconozco mis cadenas y elijo liberarme de ellas.',
    imagePrompt: 'A mystical tarot card showing The Devil with inverted pentagram, chained figures, dark purple and black mystical colors'
  },
  {
    id: 16,
    name: 'La Torre',
    arcana: 'major',
    numeral: 'XVI',
    hebrewLetter: 'Pe',
    planet: 'Marte',
    keywords: ['Catástrofe', 'Revelación', 'Liberación repentina', 'Destrucción', 'Cambio súbito'],
    upright: 'Colapso de estructuras falsas, revelación impactante, liberación repentina, destrucción necesaria.',
    reversed: 'Evitar el desastre, miedo al cambio, posponer lo inevitable, reconstrucción interna.',
    description: 'La Torre es el rayo que destruye las estructuras construidas sobre bases falsas. Aunque doloroso, es una liberación necesaria que permite construir sobre cimientos verdaderos.',
    symbolism: 'Una torre siendo destruida por un rayo. Dos figuras caen al vacío mientras llamas consumen la estructura.',
    numerology: 'El 16 representa la revelación, el despertar forzado, la destrucción del ego.',
    affirmation: 'Confío que cada caída es una oportunidad de renacer más fuerte.',
    imagePrompt: 'A mystical tarot card showing The Tower struck by lightning, figures falling, flames, dramatic red and orange mystical colors'
  },
  {
    id: 17,
    name: 'La Estrella',
    arcana: 'major',
    numeral: 'XVII',
    hebrewLetter: 'Tzaddi',
    zodiac: 'Acuario',
    keywords: ['Esperanza', 'Inspiración', 'Sanación', 'Renovación', 'Fe'],
    upright: 'Esperanza renovada, inspiración divina, sanación profunda, conexión espiritual.',
    reversed: 'Desesperanza, pérdida de fe, desconexión espiritual, falta de inspiración.',
    description: 'La Estrella brilla después de la tormenta de La Torre. Es la esperanza que emerge de las cenizas, la guía celestial que señala el camino hacia la sanación.',
    symbolism: 'Una mujer desnuda vertiendo agua de dos jarras en un estanque y la tierra. Una gran estrella con siete estrellas menores brillan sobre ella.',
    numerology: 'El 17 representa la esperanza, la fe, la renovación y la inspiración.',
    affirmation: 'La esperanza guía mis pasos y la luz de las estrellas ilumina mi camino.',
    imagePrompt: 'A mystical tarot card showing The Star with naked woman pouring water, seven stars, deep blue and silver mystical colors'
  },
  {
    id: 18,
    name: 'La Luna',
    arcana: 'major',
    numeral: 'XVIII',
    hebrewLetter: 'Qoph',
    zodiac: 'Piscis',
    keywords: ['Ilusión', 'Intuición', 'Miedo', 'Subconsciente', 'Sueños'],
    upright: 'Intuición profunda, explorar el subconsciente, ilusiones reveladas, sueños significativos.',
    reversed: 'Miedos liberados, claridad mental, salir de la confusión, superar ilusiones.',
    description: 'La Luna ilumina el camino entre lo consciente y lo inconsciente. Es el reino de los sueños, las ilusiones y los miedos que debemos atravesar para encontrar la verdad.',
    symbolism: 'Una luna llena con rostro entre dos torres. Un perro y un lobo aúllan, y un cangrejo emerge del agua. Un camino serpenteante lleva hacia las montañas.',
    numerology: 'El 18 representa la intuición, el subconsciente, los sueños y las ilusiones.',
    affirmation: 'Navego las aguas de mi subconsciente con confianza y claridad.',
    imagePrompt: 'A mystical tarot card showing The Moon between towers, wolf and dog howling, crayfish, silver and purple mystical colors'
  },
  {
    id: 19,
    name: 'El Sol',
    arcana: 'major',
    numeral: 'XIX',
    hebrewLetter: 'Resh',
    zodiac: 'Leo',
    planet: 'Sol',
    keywords: ['Felicidad', 'Éxito', 'Vitalidad', 'Alegría', 'Claridad'],
    upright: 'Éxito radiante, felicidad pura, vitalidad renovada, claridad total, celebración.',
    reversed: 'Falta de entusiasmo, éxito temporal, optimismo excesivo, dificultades en superar.',
    description: 'El Sol es la carta más positiva del tarot. Representa la victoria de la luz sobre la oscuridad, la alegría pura y el éxito que proviene de vivir en autenticidad.',
    symbolism: 'Un sol brillante con rostro humano. Un niño feliz montado en un caballo blanco, rodeado de girasoles que florecen hacia la luz.',
    numerology: 'El 19 representa la iluminación, el éxito, la felicidad y la vitalidad.',
    affirmation: 'La luz brilla en mí y a través de mí, iluminando todo a mi alrededor.',
    imagePrompt: 'A mystical tarot card showing The Sun with smiling face, child on white horse, sunflowers, bright gold and orange mystical colors'
  },
  {
    id: 20,
    name: 'El Juicio',
    arcana: 'major',
    numeral: 'XX',
    hebrewLetter: 'Shin',
    element: 'Fuego',
    keywords: ['Renacimiento', 'Llamado interior', 'Absolución', 'Despertar', 'Transformación'],
    upright: 'Renacimiento espiritual, llamado del alma, absolución, despertar de conciencia.',
    reversed: 'Auto-duda, evitar el llamado, negarse a perdonar, miedo al cambio.',
    description: 'El Juicio representa el llamado final del alma hacia su transformación. Es la trompeta que despierta a los muertos, simbolizando el renacimiento espiritual y la absolución.',
    symbolism: 'Ángeles tocando trompetas desde el cielo. Los muertos se levantan de sus tumbas, con los brazos extendidos hacia la luz.',
    numerology: 'El 20 representa el renacimiento, el despertar, la resurrección y la liberación.',
    affirmation: 'Respondo al llamado de mi alma y nazco de nuevo cada día.',
    imagePrompt: 'A mystical tarot card showing Judgement with angels blowing trumpets, risen figures, white and gold mystical colors'
  },
  {
    id: 21,
    name: 'El Mundo',
    arcana: 'major',
    numeral: 'XXI',
    hebrewLetter: 'Tav',
    planet: 'Saturno',
    keywords: ['Completitud', 'Integración', 'Logro', 'Culminación', 'Unidad'],
    upright: 'Ciclo completado, integración total, logro supremo, unidad con el universo.',
    reversed: 'Incompletitud, falta de cierre, buscar más antes de terminar, desintegración.',
    description: 'El Mundo representa la culminación del viaje del Loco. Es la integración de todas las experiencias, la unión con el todo, el final que es también un nuevo comienzo.',
    symbolism: 'Una mujer en una guirnalda ovalada, rodeada por cuatro criaturas: águila, león, toro y ángel. Los símbolos de los cuatro evangelistas en las esquinas.',
    numerology: 'El 21 representa la completitud, la perfección, la culminación y la unidad.',
    affirmation: 'He completado mi ciclo y me integro armoniosamente con el universo.',
    imagePrompt: 'A mystical tarot card showing The World with woman in wreath, four creatures, rainbow of mystical colors'
  }
]

export function getTarotCardById(id: number): TarotCard | undefined {
  return tarotCards.find(card => card.id === id)
}

export function getRandomCards(count: number): TarotCard[] {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getCardByKeyword(keyword: string): TarotCard[] {
  return tarotCards.filter(card => 
    card.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
  )
}
