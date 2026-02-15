export interface HoroscopeReading {
  sign: string
  period: string
  date: string
  general: string
  love: string
  work: string
  money: string
  health: string
  ratings: {
    love: number
    work: number
    money: number
    health: number
  }
  luckyNumbers: number[]
  luckyColor: string
  luckyHour: string
  compatibility: string
  advice: string
  affirmation: string
}

const generalReadings: Record<string, string[]> = {
  Aries: [
    'Tu energía está en su punto más alto. Es momento de tomar la iniciativa en proyectos que has estado posponiendo. Marte te impulsa hacia adelante con fuerza renovada.',
    'Las estrellas favorecen tu espíritu aventurero. No temas explorar nuevos territorios, tanto físicos como emocionales. Tu valentía será recompensada.',
    'Tu liderazgo natural brilla especialmente hoy. Otros buscan tu guía y dirección. Acepta este rol con responsabilidad y humildad.'
  ],
  Tauro: [
    'La estabilidad que tanto valoras está fortalecida por Venus. Es un buen momento para consolidar tus finanzas y relaciones más cercanas.',
    'Tu conexión con la naturaleza y los placeres sensoriales está intensificada. Permítete disfrutar de las pequeñas cosas que hacen la vida hermosa.',
    'La paciencia es tu superpoder hoy. Mientras otros se apresuran, tú avanzas con paso firme hacia tus metas.'
  ],
  Géminis: [
    'Tu mente está especialmente ágil. Las ideas fluyen y la comunicación es tu mejor herramienta. Comparte tus pensamientos con confianza.',
    'La curiosidad te lleva por caminos inesperados. Cada conversación puede abrir una puerta a nuevas oportunidades.',
    'Mercurio amplifica tu don de la palabra. Es momento ideal para negociaciones, presentaciones o confesiones importantes.'
  ],
  Cáncer: [
    'Tu intuición está más aguda que nunca. Confía en esos presentimientos que surgen desde lo más profundo de tu ser.',
    'El hogar y la familia ocupan un lugar central. Es momento de nutrir esos lazos que te dan seguridad emocional.',
    'La Luna te conecta con tus emociones más profundas. No temas mostrar tu vulnerabilidad, es tu mayor fortaleza.'
  ],
  Leo: [
    'Tu brillo natural atrae todas las miradas. Es tu momento de destacar y recibir el reconocimiento que mereces.',
    'La creatividad fluye sin obstáculos. Cualquier proyecto artístico o expresivo tendrá resultados excepcionales.',
    'El Sol te llena de vitalidad y magnetismo. Tu presencia ilumina cualquier espacio donde entres.'
  ],
  Virgo: [
    'Tu ojo para el detalle te permite ver lo que otros pasan por alto. Usa esta habilidad para resolver problemas complejos.',
    'Es un día excelente para organizar, planificar y poner orden en tu vida. La claridad mental es tu aliada.',
    'Tu deseo de servir a otros encuentra canales positivos. Ayudar te llenará de satisfacción profunda.'
  ],
  Libra: [
    'El equilibrio que buscas está más cerca de lo que crees. Las relaciones armoniosas florecen a tu alrededor.',
    'Venus te bendice con gracia y diplomacia. Eres el puente que une a personas en conflicto.',
    'La belleza en todas sus formas te inspira. Rodéate de arte, música y personas que eleven tu espíritu.'
  ],
  Escorpio: [
    'Tu poder de transformación está en su apogeo. Lo que antes parecía imposible de cambiar, ahora cede ante tu voluntad.',
    'Los misterios te llaman. Tu intuición te guía hacia verdades ocultas que otros no pueden percibir.',
    'La intensidad de tus emociones es tu combustible. Canalízala hacia la creación, no la destrucción.'
  ],
  Sagitario: [
    'El horizonte te llama con promesas de aventura. Tu optimismo contagioso abre puertas por todas partes.',
    'Júpiter expande tus posibilidades. Sueña en grande, porque el universo conspira para hacer realidad tus visiones.',
    'Tu filosofía de vida inspira a quienes te rodean. Comparte tu sabiduría con generosidad.'
  ],
  Capricornio: [
    'Tu disciplina y perseverancia dan frutos. Los cimientos que has construido sostienen ahora grandes logros.',
    'Saturno te otorga la paciencia de los sabios. Cada paso, por pequeño que sea, te acerca a la cumbre.',
    'Tu autoridad natural es reconocida. Otros confían en tu juicio y buscan tu consejo.'
  ],
  Acuario: [
    'Tu visión del futuro es más clara que nunca. Las ideas innovadoras fluyen y encuentran caminos de manifestación.',
    'Urano despierta tu lado más revolucionario. No temas desafiar lo establecido si sabes que hay un camino mejor.',
    'Tu conexión con la humanidad se fortalece. Proyectos comunitarios o causas sociales te llenan de propósito.'
  ],
  Piscis: [
    'Tu sensibilidad es un don que te conecta con dimensiones invisibles. Los sueños traen mensajes importantes.',
    'Neptuno intensifica tu creatividad y espiritualidad. El arte y la meditación son tus mejores aliados.',
    'Tu compasión no tiene límites. Pero recuerda: cuidar de ti mismo te permite cuidar mejor de otros.'
  ]
}

const loveReadings: Record<string, string[]> = {
  Aries: [
    'La pasión enciende tus relaciones. Si estás en pareja, la chispa se reaviva. Si estás soltero/a, alguien audaz captará tu atención.',
    'Tu naturaleza directa en el amor es refrescante. No juegues juegos, di lo que sientes.',
    'Una conexión intensa está en el horizonte. Prepárate para sentir mariposas en el estómago.'
  ],
  Tauro: [
    'El romance se viste de gestos tangibles. Regalos, cenas, caricias... el amor se expresa a través de los sentidos.',
    'La lealtad es tu carta de presentación en el amor. Quien te tenga, tiene un tesoro.',
    'Busca estabilidad emocional en tus relaciones. La montaña rusa no es para ti.'
  ],
  Géminis: [
    'Las conversaciones profundas te conectan como nunca. Busca alguien que estimule tu mente.',
    'Tu versatilidad enamora. Pero asegúrate de que tu pareja también sea interesante.',
    'Un encuentro intelectual podría convertirse en algo más. Mantén los ojos abiertos.'
  ],
  Cáncer: [
    'El nido te llama. Es momento de fortalecer los lazos familiares y de pareja.',
    'Tu intuición en el amor es infalible. Escucha lo que te dice el corazón.',
    'Cuidar y ser cuidado es lo que más deseas. No tengas miedo de pedir lo que necesitas.'
  ],
  Leo: [
    'El amor te busca como protagonista. Brilla y deja que te adoren.',
    'Tu generosidad en el amor es legendaria. Pero asegúrate de recibir también.',
    'Un admirador secreto podría revelarse. El drama romántico te favorece.'
  ],
  Virgo: [
    'Los pequeños detalles fortalecen tu relación. Muestra tu amor a través de actos de servicio.',
    'Busca alguien que aprecie tu naturaleza perfeccionista sin criticarte.',
    'La limpieza y el orden en tu vida amorosa traerán claridad emocional.'
  ],
  Libra: [
    'El romance está en el aire. Venus te sonríe y el amor florece.',
    'La armonía en pareja es tu mayor deseo. Trabaja por ella activamente.',
    'Una propuesta romántica podría sorprenderte. Di sí a las experiencias hermosas.'
  ],
  Escorpio: [
    'La intensidad emocional te define. En el amor, lo quieres todo o nada.',
    'Secretos y misterios podrían revelarse en tu vida amorosa.',
    'La transformación a través del amor es posible. Deja ir el pasado.'
  ],
  Sagitario: [
    'El amor se vive como aventura. Busca alguien que quiera explorar contigo.',
    'Tu optimismo enamora. Pero asegúrate de que la relación tenga profundidad.',
    'Un romance de viaje o con alguien de otra cultura es posible.'
  ],
  Capricornio: [
    'El compromiso serio está en el horizonte si así lo deseas.',
    'Tu lealtad en el amor es inquebrantable. Busca alguien que la valore.',
    'El amor maduro y estable te llama. Construye sobre cimientos sólidos.'
  ],
  Acuario: [
    'La amistad puede convertirse en amor. No descartes a tus amigos cercanos.',
    'Tu originalidad enamora. Alguien apreciará tu singularidad.',
    'El amor libre o no convencional podría llamarte. Define tus propias reglas.'
  ],
  Piscis: [
    'El amor soñado podría materializarse. Mantén tu corazón abierto.',
    'Tu romanticismo es encantador. Pero asegúrate de ver la realidad también.',
    'Una conexión kármica podría presentarse. Reconoce a las almas conocidas.'
  ],
  default: [
    'El amor está en el aire. Mantén tu corazón abierto a las posibilidades.',
    'Las relaciones existentes se fortalecen con comunicación honesta.',
    'Un encuentro inesperado podría cambiar tu perspectiva sobre el amor.'
  ]
}

const workReadings: string[] = [
  'Tu productividad está en su mejor momento. Aprovecha para avanzar en proyectos importantes.',
  'Colaboraciones fructíferas están en el horizonte. El trabajo en equipo te llevará más lejos.',
  'Es momento de mostrar tus habilidades. No tengas miedo de destacar.',
  'Nuevas oportunidades profesionales se presentan. Mantén los ojos abiertos.',
  'Tu creatividad en el trabajo es valorada. Propón esas ideas innovadoras.'
]

const moneyReadings: string[] = [
  'Las finanzas muestran señales positivas. Es buen momento para inversiones prudentes.',
  'Evita gastos impulsivos hoy. La moderación será tu mejor aliado.',
  'Una oportunidad de ingreso extra podría presentarse. Mantente alerta.',
  'Revisa tus finanzas con atención. Pequeños ajustes pueden hacer grandes diferencias.',
  'La abundancia fluye hacia ti. Recíbela con gratitud y compártela con sabiduría.'
]

const healthReadings: string[] = [
  'Tu energía vital está alta. Aprovecha para establecer nuevas rutinas saludables.',
  'Presta atención a tu descanso. El cuerpo necesita recuperarse para rendir al máximo.',
  'El equilibrio mente-cuerpo es crucial hoy. Considera prácticas como yoga o meditación.',
  'La alimentación consciente potenciará tu bienestar. Escucha lo que tu cuerpo necesita.',
  'El ejercicio al aire libre te recargará de energía positiva.'
]

const colors = ['Rojo', 'Azul', 'Verde', 'Dorado', 'Púrpura', 'Naranja', 'Rosa', 'Turquesa', 'Plateado', 'Blanco']

const advices = [
  'Confía en tu intuición, te guiará correctamente.',
  'La paciencia será tu mayor virtud hoy.',
  'Abre tu corazón a nuevas posibilidades.',
  'No temas mostrar tu verdadero yo.',
  'Las pequeñas acciones crean grandes cambios.',
  'Rodéate de personas que te eleven.',
  'El silencio interior te dará las respuestas que buscas.',
  'Celebra cada pequeño logro del día.',
  'La gratitud transforma la perspectiva.',
  'Hoy es un nuevo comienzo, aprovéchalo.'
]

const affirmations: Record<string, string[]> = {
  Aries: [
    'Soy un líder valiente que inspira a otros con mi determinación.',
    'Mi coraje me lleva a conquistar cualquier desafío.',
    'Abrazo mi naturaleza apasionada y la canalizo hacia el éxito.'
  ],
  Tauro: [
    'Atraigo abundancia y estabilidad a mi vida.',
    'Mi paciencia y perseverancia me llevan al éxito.',
    'Merezco disfrutar de los placeres de la vida.'
  ],
  Géminis: [
    'Mi mente es brillante y mis ideas tienen valor.',
    'Me comunico con claridad y autenticidad.',
    'Abrazo mi versatilidad como mi mayor fortaleza.'
  ],
  default: [
    'Las estrellas me guían hacia mi mayor bien.',
    'Estoy alineado/a con mi propósito cósmico.',
    'El universo conspira a mi favor.'
  ]
}

export function generateDailyHoroscope(sign: string, period: string): HoroscopeReading {
  const today = new Date()
  const seed = today.getDate() + today.getMonth() + sign.length
  
  const getRandomFromArray = <T>(arr: T[], offset: number = 0): T => {
    const index = (seed + offset) % arr.length
    return arr[index]
  }
  
  const generateRating = (base: number): number => {
    const variation = ((seed % 3) - 1)
    return Math.max(1, Math.min(5, base + variation))
  }
  
  const signGeneralReadings = generalReadings[sign] || generalReadings.Aries
  const signLoveReadings = loveReadings[sign] || loveReadings.default
  const signAffirmations = affirmations[sign] || affirmations.default
  
  const luckyNumbers = [
    ((seed * 3) % 49) + 1,
    ((seed * 7) % 49) + 1,
    ((seed * 11) % 49) + 1
  ].sort((a, b) => a - b)
  
  const compatibilityOptions = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
    .filter(s => s !== sign)
  
  return {
    sign,
    period,
    date: today.toISOString(),
    general: getRandomFromArray(signGeneralReadings),
    love: getRandomFromArray(signLoveReadings, 1),
    work: getRandomFromArray(workReadings, 2),
    money: getRandomFromArray(moneyReadings, 3),
    health: getRandomFromArray(healthReadings, 4),
    ratings: {
      love: generateRating(3),
      work: generateRating(4),
      money: generateRating(3),
      health: generateRating(4)
    },
    luckyNumbers,
    luckyColor: getRandomFromArray(colors, 5),
    luckyHour: `${((seed % 12) + 7)}:00`,
    compatibility: getRandomFromArray(compatibilityOptions, 6),
    advice: getRandomFromArray(advices, 7),
    affirmation: getRandomFromArray(signAffirmations, 8)
  }
}
