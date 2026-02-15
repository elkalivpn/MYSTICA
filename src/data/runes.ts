export interface Rune {
  id: number
  name: string
  symbol: string
  letter: string
  meaning: string
  upright: string
  reversed: string
  keywords: string[]
  element: 'fuego' | 'agua' | 'aire' | 'tierra'
  deity: string
  mythology: string
  affirmation: string
}

export const runes: Rune[] = [
  {
    id: 0,
    name: 'Fehu',
    symbol: 'ᚠ',
    letter: 'F',
    meaning: 'Ganado, Riqueza',
    upright: 'Riqueza material y espiritual te aguarda. Éxito en empresas comerciales y abundancia en todas sus formas.',
    reversed: 'Pérdida de posesiones, codicia, pobreza temporal. Cuidado con apegos materiales.',
    keywords: ['riqueza', 'abundancia', 'posesiones', 'éxito', 'prosperidad'],
    element: 'fuego',
    deity: 'Freyja, Freyr',
    mythology: 'Representa el ganado como símbolo de riqueza móvil en las culturas nórdicas. Conecta con la fertilidad y la prosperidad.',
    affirmation: 'La abundancia fluye hacia mí en todas sus formas.'
  },
  {
    id: 1,
    name: 'Uruz',
    symbol: 'ᚢ',
    letter: 'U',
    meaning: 'Auroch, Fuerza',
    upright: 'Fuerza vital, salud robusta, poder interior. Valentía y determinación para superar obstáculos.',
    reversed: 'Debilidad, enfermedad, falta de energía. Pérdida de poder personal.',
    keywords: ['fuerza', 'salud', 'vitalidad', 'coraje', 'poder'],
    element: 'tierra',
    deity: 'Thor',
    mythology: 'El auroch era un toro salvaje gigante. Esta runa representa la fuerza primigenia y la salud perfecta.',
    affirmation: 'Poseo una fuerza inagotable para alcanzar mis metas.'
  },
  {
    id: 2,
    name: 'Thurisaz',
    symbol: 'ᚦ',
    letter: 'Th',
    meaning: 'Gigante, Espina',
    upright: 'Protección divina, fuerza defensiva. Thor te resguarda. Cautela necesaria.',
    reversed: 'Peligro, traición, actos impulsivos. Desafíos que requieren reflexión.',
    keywords: ['protección', 'defensa', 'conflicto', 'cautela', 'fuerza'],
    element: 'fuego',
    deity: 'Thor',
    mythology: 'Asociada con los gigantes y la fuerza protectora de Thor. Representa la dualidad de la destrucción y la protección.',
    affirmation: 'Estoy protegido por fuerzas superiores mientras avanzo con cautela.'
  },
  {
    id: 3,
    name: 'Ansuz',
    symbol: 'ᚨ',
    letter: 'A',
    meaning: 'Dios, Mensaje',
    upright: 'Sabiduría divina, comunicación clara, mensajes de los dioses. Inspiración y creatividad.',
    reversed: 'Malentendidos, confusión, desinformación. Desconexión espiritual.',
    keywords: ['comunicación', 'sabiduría', 'mensaje', 'inspiración', 'Odín'],
    element: 'aire',
    deity: 'Odín',
    mythology: 'Runa de Odín, padre de los dioses. Representa el aliento divino y la comunicación sagrada.',
    affirmation: 'Recibo con claridad los mensajes del universo.'
  },
  {
    id: 4,
    name: 'Raido',
    symbol: 'ᚱ',
    letter: 'R',
    meaning: 'Viaje, Rueda',
    upright: 'Viajes físicos o espirituales, progreso, movimiento hacia metas. El camino correcto.',
    reversed: 'Retrasos, viajes interrumpidos, perder el rumbo. Estancamiento temporal.',
    keywords: ['viaje', 'movimiento', 'camino', 'progreso', 'dirección'],
    element: 'aire',
    deity: 'Heimdall',
    mythology: 'Representa el viaje como metáfora de la vida. La rueda cósmica que gira eternamente.',
    affirmation: 'Cada paso me acerca a mi destino sagrado.'
  },
  {
    id: 5,
    name: 'Kenaz',
    symbol: 'ᚲ',
    letter: 'K',
    meaning: 'Antorcha, Fuego',
    upright: 'Iluminación, conocimiento, creatividad ardiente. La luz que disipa la oscuridad.',
    reversed: 'Oscuridad, pérdida de dirección, creatividad bloqueada. Engaño.',
    keywords: ['luz', 'conocimiento', 'creatividad', 'iluminación', 'fuego'],
    element: 'fuego',
    deity: 'Heimdall, Freyr',
    mythology: 'La antorcha que guía en la oscuridad. Fuego controlado que ilumina sin destruir.',
    affirmation: 'Mi luz interior ilumina todo camino oscuro.'
  },
  {
    id: 6,
    name: 'Gebo',
    symbol: 'ᚷ',
    letter: 'G',
    meaning: 'Regalo, Don',
    upright: 'Regalos del universo, asociaciones fructíferas, generosidad mutua. Amor y amistad.',
    reversed: 'No tiene reverso - siempre es positiva.',
    keywords: ['regalo', 'generosidad', 'asociación', 'amor', 'intercambio'],
    element: 'aire',
    deity: 'Odín',
    mythology: 'El regalo sagrado que crea lazos entre humanos y dioses. Representa la generosidad cósmica.',
    affirmation: 'Doy y recibo con el corazón abierto, equilibrando el flujo universal.'
  },
  {
    id: 7,
    name: 'Wunjo',
    symbol: 'ᚹ',
    letter: 'W',
    meaning: 'Alegría, Gloria',
    upright: 'Felicidad, armonía, prosperidad en relaciones. Éxito y bienestar emocional.',
    reversed: 'Tristeza, alienación, conflictos en relaciones. Aislamiento temporal.',
    keywords: ['alegría', 'felicidad', 'armonía', 'éxito', 'bienestar'],
    element: 'aire',
    deity: 'Odín',
    mythology: 'La runa de la felicidad perfecta. Representa el estado de bienaventuranza y gloria.',
    affirmation: 'La alegría es mi estado natural y el universo conspira para mi felicidad.'
  },
  {
    id: 8,
    name: 'Hagalaz',
    symbol: 'ᚺ',
    letter: 'H',
    meaning: 'Granizo',
    upright: 'Transformación a través del caos. Crecimiento tras la tempestad. Cambios inevitables.',
    reversed: 'No tiene reverso - representa fuerzas incontrolables.',
    keywords: ['cambio', 'crisis', 'transformación', 'desafío', 'renovación'],
    element: 'agua',
    deity: 'Heimdall, Hel',
    mythology: 'El granizo destructor que prepara la tierra para nuevos cultivos. La crisis como catalizador.',
    affirmation: 'Acepto las tormentas de la vida como herramientas de transformación.'
  },
  {
    id: 9,
    name: 'Nauthiz',
    symbol: 'ᚾ',
    letter: 'N',
    meaning: 'Necesidad, Compulsión',
    upright: 'Resistencia, paciencia ante limitaciones. Necesidad que enseña lecciones valiosas.',
    reversed: 'Liberación de restricciones, impaciencia. Superar obstáculos internos.',
    keywords: ['necesidad', 'restricción', 'paciencia', 'resistencia', 'liberación'],
    element: 'fuego',
    deity: 'Las Nornas',
    mythology: 'Representa las limitaciones que el destino impone para el crecimiento espiritual.',
    affirmation: 'Cada limitación me enseña la fortaleza que poseo.'
  },
  {
    id: 10,
    name: 'Isa',
    symbol: 'ᛁ',
    letter: 'I',
    meaning: 'Hielo',
    upright: 'Pausa necesaria, concentración, quietud. Tiempo de reflexión y concentración.',
    reversed: 'No tiene reverso - representa el poder del hielo.',
    keywords: ['hielo', 'pausa', 'quietud', 'concentración', 'reflexión'],
    element: 'agua',
    deity: 'Heimdall',
    mythology: 'El hielo primordial de Niflheim. Representa la concentración y el poder de la quietud.',
    affirmation: 'En la quietud encuentro la claridad que busco.'
  },
  {
    id: 11,
    name: 'Jera',
    symbol: 'ᛃ',
    letter: 'J',
    meaning: 'Año, Cosecha',
    upright: 'Recompensas por trabajo realizado, ciclos naturales, cosecha abundante.',
    reversed: 'No tiene reverso - representa los ciclos naturales.',
    keywords: ['cosecha', 'ciclo', 'recompensa', 'paciencia', 'naturaleza'],
    element: 'tierra',
    deity: 'Freyr, Freyja',
    mythology: 'Representa el ciclo anual y la cosecha. El resultado natural del esfuerzo sostenido.',
    affirmation: 'Cosecho los frutos de mi dedicación y paciencia.'
  },
  {
    id: 12,
    name: 'Eihwaz',
    symbol: 'ᛇ',
    letter: 'Ei',
    meaning: 'Tejo, Resistencia',
    upright: 'Protección, resistencia, longevidad. Superar pruebas con perseverancia.',
    reversed: 'No tiene reverso - representa la resistencia inquebrantable.',
    keywords: ['resistencia', 'protección', 'perseverancia', 'sabiduría', 'muerte-renacimiento'],
    element: 'tierra',
    deity: 'Odín, Ullr',
    mythology: 'El tejo es el árbol de la muerte y la vida. Conecta los mundos y otorga longevidad.',
    affirmation: 'Mi espíritu es tan resistente como el tejo milenario.'
  },
  {
    id: 13,
    name: 'Perthro',
    symbol: 'ᛈ',
    letter: 'P',
    meaning: 'Lotería, Misterio',
    upright: 'Secretos revelados, destino, intuición profunda. Conexión con lo oculto.',
    reversed: 'Secretos ocultos, decepciones, adicciones. Misterios sin resolver.',
    keywords: ['misterio', 'destino', 'secreto', 'intuición', 'lo oculto'],
    element: 'agua',
    deity: 'Las Nornas, Freyja',
    mythology: 'Conectada con el pozo de Urd donde las Nornas tejen el destino.',
    affirmation: 'Confío en los misterios del destino que se revelan en mi vida.'
  },
  {
    id: 14,
    name: 'Algiz',
    symbol: 'ᛉ',
    letter: 'Z',
    meaning: 'Alce, Protección',
    upright: 'Protección divina, conexión espiritual, guía de los ancestros. Escudo sagrado.',
    reversed: 'Vulnerabilidad, falta de protección, desprotección espiritual.',
    keywords: ['protección', 'guía', 'conexión', 'ancestros', 'escudo'],
    element: 'aire',
    deity: 'Heimdall, Valkirias',
    mythology: 'Los cuernos del alce forman un escudo protector. Runa de protección suprema.',
    affirmation: 'Estoy protegido por los guardianes sagrados de los mundos.'
  },
  {
    id: 15,
    name: 'Sowilo',
    symbol: 'ᛊ',
    letter: 'S',
    meaning: 'Sol',
    upright: 'Victoria, éxito, vitalidad, luz. El poder del sol ilumina todo obstáculo.',
    reversed: 'No tiene reverso - representa la luz siempre victoriosa.',
    keywords: ['sol', 'victoria', 'éxito', 'luz', 'vitalidad'],
    element: 'fuego',
    deity: 'Balder, Sól',
    mythology: 'El sol invencible que todo lo ilumina. Representa la victoria de la luz.',
    affirmation: 'La luz del sol me guía hacia la victoria en cada emprendimiento.'
  },
  {
    id: 16,
    name: 'Tiwaz',
    symbol: 'ᛏ',
    letter: 'T',
    meaning: 'Tyr, Guerrero',
    upright: 'Justicia, honor, sacrificio noble, valor en la batalla. Victoria justa.',
    reversed: 'Injusticia, cobardía, conflictos sin resolver. Pérdida de honor.',
    keywords: ['justicia', 'guerrero', 'honor', 'sacrificio', 'victoria'],
    element: 'fuego',
    deity: 'Tyr',
    mythology: 'Tyr, dios de la guerra y la justicia, que sacrificó su mano para encadenar a Fenrir.',
    affirmation: 'Actúo con honor y justicia, y la victoria me acompaña.'
  },
  {
    id: 17,
    name: 'Berkano',
    symbol: 'ᛒ',
    letter: 'B',
    meaning: 'Abedul, Nacimiento',
    upright: 'Nuevos comienzos, fertilidad, crecimiento, protección materna.',
    reversed: 'Aborto de planes, estancamiento, problemas familiares. Crecimiento bloqueado.',
    keywords: ['nacimiento', 'fertilidad', 'crecimiento', 'madre', 'protección'],
    element: 'tierra',
    deity: 'Frigg, Idunn',
    mythology: 'El abedul es el árbol del renacimiento y la fertilidad. Runa de la Gran Madre.',
    affirmation: 'Nuevos comienzos florecen en mi vida con gracia y abundancia.'
  },
  {
    id: 18,
    name: 'Ehwaz',
    symbol: 'ᛖ',
    letter: 'E',
    meaning: 'Caballo, Movimiento',
    upright: 'Progreso armonioso, asociaciones, confianza, lealtad. Viaje exitoso.',
    reversed: 'Falta de progreso, desconfianza, asociaciones rotas. Viaje difícil.',
    keywords: ['caballo', 'movimiento', 'asociación', 'lealtad', 'progreso'],
    element: 'tierra',
    deity: 'Odín, Freyr',
    mythology: 'El caballo como símbolo de movimiento entre mundos y asociación sagrada.',
    affirmation: 'Avanzo en armonía con mis compañeros de camino.'
  },
  {
    id: 19,
    name: 'Mannaz',
    symbol: 'ᛗ',
    letter: 'M',
    meaning: 'Humano, Humanidad',
    upright: 'Autoconocimiento, conexión humana, comunidad, apoyo mutuo.',
    reversed: 'Aislamiento, egoísmo, conflicto interno. Desconexión de otros.',
    keywords: ['humanidad', 'comunidad', 'autoconocimiento', 'colaboración', 'mente'],
    element: 'aire',
    deity: 'Heimdall',
    mythology: 'Representa a la humanidad y la conexión divina en cada ser humano.',
    affirmation: 'Me reconozco en otros y encuentro la divinidad en la humanidad.'
  },
  {
    id: 20,
    name: 'Laguz',
    symbol: 'ᛚ',
    letter: 'L',
    meaning: 'Agua, Lago',
    upright: 'Intuición, flujo emocional, clarividencia, conexión con el inconsciente.',
    reversed: 'Confusión emocional, miedo, alucinaciones. Aguas turbulentas.',
    keywords: ['agua', 'intuición', 'emociones', 'inconsciente', 'flujo'],
    element: 'agua',
    deity: 'Njord, Ran',
    mythology: 'Las aguas primordiales que conectan todos los mundos. Pozo de sabiduría.',
    affirmation: 'Fluyo con la sabiduría de las aguas profundas de mi ser.'
  },
  {
    id: 21,
    name: 'Ingwaz',
    symbol: 'ᛝ',
    letter: 'Ng',
    meaning: 'Ing, Fertilidad',
    upright: 'Fertilidad, potencial latente, gestación, semilla. Energía interna acumulándose.',
    reversed: 'No tiene reverso - representa el potencial fértil.',
    keywords: ['fertilidad', 'potencial', 'gestación', 'semilla', 'energía'],
    element: 'tierra',
    deity: 'Freyr, Ing',
    mythology: 'Ing es un nombre de Freyr. Representa la energía reproductiva y el potencial.',
    affirmation: 'Mi potencial interno está listo para florecer en el momento perfecto.'
  },
  {
    id: 22,
    name: 'Dagaz',
    symbol: 'ᛞ',
    letter: 'D',
    meaning: 'Día, Amanecer',
    upright: 'Despertar, iluminación, transformación, nuevo día. Claro después de oscuro.',
    reversed: 'No tiene reverso - representa la luz del nuevo día.',
    keywords: ['amanecer', 'iluminación', 'transformación', 'despertar', 'claridad'],
    element: 'fuego',
    deity: 'Heimdall',
    mythology: 'El amanecer que disipa la oscuridad. Representa la iluminación espiritual.',
    affirmation: 'Cada día despierto a una nueva realidad de luz y claridad.'
  },
  {
    id: 23,
    name: 'Othala',
    symbol: 'ᛟ',
    letter: 'O',
    meaning: 'Herencia, Propiedad',
    upright: 'Herencia espiritual, hogar, tierra ancestral, tradiciones sagradas.',
    reversed: 'Pérdida de herencia, ruptura familiar, desarraigo. Liberación necesaria.',
    keywords: ['herencia', 'hogar', 'ancestros', 'tradición', 'propiedad'],
    element: 'tierra',
    deity: 'Odín',
    mythology: 'Representa la herencia ancestral y la conexión con la tierra de los antepasados.',
    affirmation: 'Honro a mis ancestros y construyo sobre los cimientos que me legaron.'
  }
]

export function getRuneById(id: number): Rune | undefined {
  return runes.find(rune => rune.id === id)
}

export function getRandomRunes(count: number): Rune[] {
  const shuffled = [...runes].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getRunesByElement(element: Rune['element']): Rune[] {
  return runes.filter(rune => rune.element === element)
}
