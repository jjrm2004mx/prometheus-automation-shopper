/**
 * Contenido estructurado por defecto. Un tenant puede reemplazarlo desde la
 * consola; esto es lo que hereda quien no configura nada.
 */

export const processSteps = [
  {
    title: 'Reservas tu ventana',
    body: 'Apartas tu bloque de compra. Esta es tu ventana, no una cita a hora exacta.',
  },
  { title: 'Entras a tu ventana', body: 'Te confirmamos tu bloque, el día y qué esperar.' },
  { title: 'Aviso previo', body: 'Una hora antes te recordamos que estés pendiente.' },
  { title: 'Te llamamos en vivo', body: 'Cuando llega tu turno, te mostramos lo encontrado.' },
  { title: 'Tú eliges', body: 'Decides qué sí y qué no. Nada se compra sin tu aprobación.' },
  { title: 'Cierre y envío', body: 'Recibes ticket, confirmación de envío y tu número de rastreo.' },
];

export const advantages = [
  {
    title: 'Ves antes de pagar',
    body: 'Todo en vivo, sin sorpresas. Ves exactamente lo que vas a comprar antes de hacer cualquier pago.',
  },
  {
    title: 'Aprovechas mejor tu tiempo',
    body: 'Estás pendiente de tu ventana, no esperando todo el día. Tu tiempo vale.',
  },
  {
    title: 'Compras con más criterio',
    body: 'Te mostramos opciones pensadas para ti. Seleccionamos con intención, no al azar.',
  },
];

export const faqCategories = ['Ventana de compra', 'Pago', 'Envío', 'Lotes'] as const;
export type FaqCategory = (typeof faqCategories)[number];

export const faqs: Array<{ q: string; a: string; cat: FaqCategory }> = [
  {
    cat: 'Ventana de compra',
    q: '¿La compra es a una hora exacta?',
    a: 'No. Apartas una ventana de atención dentro de un día. Eso permite encontrar más opciones y moverse mejor en tienda sin que pierdas toda la mañana esperando.',
  },
  {
    cat: 'Ventana de compra',
    q: '¿Cómo sé cuándo me van a llamar?',
    a: 'Te confirmamos tu bloque al reservar, te recordamos una hora antes y te avisamos por mensaje cuando falten unos 30 minutos para tu turno.',
  },
  {
    cat: 'Ventana de compra',
    q: '¿Qué pasa si no contesto?',
    a: 'Tu turno puede recorrerse dentro del mismo día para no detener a las demás. Te volvemos a marcar en cuanto se libere un espacio.',
  },
  {
    cat: 'Pago',
    q: '¿Cómo aparto mi lugar?',
    a: 'Con una transferencia de apartado desde tu banca móvil. Es una cuenta local, no necesitas enviar dólares ni transferir al extranjero.',
  },
  {
    cat: 'Pago',
    q: '¿Cuándo pago la mercancía?',
    a: 'Cuando ya elegiste en vivo y estamos en caja. Antes de eso ves el total con desglose de mercancía, comisión y envío estimado.',
  },
  {
    cat: 'Pago',
    q: '¿El apartado se pierde?',
    a: 'No si asistes a tu cita o avisas con tiempo: cuenta a favor de tu compra. Si no te presentas ni avisas, ya no se aplica a tu orden.',
  },
  {
    cat: 'Envío',
    q: '¿Cuánto tarda el envío?',
    a: 'El tiempo típico está publicado en la página de números. El costo exacto se confirma después de empacar, porque depende del peso y el volumen reales.',
  },
  {
    cat: 'Lotes',
    q: '¿Qué incluye el precio de un lote?',
    a: 'Mercancía, comisión, envío estimado y empaque. Es precio todo incluido, sin cargos posteriores.',
  },
];

export const prepSections = [
  {
    id: 'como-sera',
    title: 'Cómo será tu cita',
    points: [
      'Entramos a tienda con tu pedido ya pensado.',
      'Te mostramos opciones en vivo por videollamada.',
      'Tú decides qué sí y qué no.',
      'No pagas mercancía que no quieras elegir.',
    ],
  },
  {
    id: 'dinero',
    title: 'Ten listo tu dinero antes de entrar',
    points: [
      'El dinero para mercancía debe estar listo en tu banco antes de la cita.',
      'No conviene resolverlo el mismo día.',
      'Eso ayuda a que la compra avance sin fricción.',
    ],
  },
  {
    id: 'pagos',
    title: 'Cómo se hacen los pagos',
    points: [
      'Todo se mueve por transferencia local.',
      'No hace falta enviar dólares.',
      'El tipo de cambio se toma el día de la transferencia.',
    ],
  },
  {
    id: 'seguimiento',
    title: 'Cómo seguir tu compra durante la videollamada',
    points: [
      'Ve sumando tus piezas mientras las eliges.',
      'Así llevas claridad sobre cuánto vas gastando.',
      'Llega con una forma simple de anotar tus números.',
    ],
  },
  {
    id: 'puntualidad',
    title: 'Puntualidad y preparación',
    points: [
      'Llega puntual a tu cita.',
      'Hay más citas apartadas ese día.',
      'Eso permite darte el tiempo y la atención que tu compra necesita.',
    ],
  },
  {
    id: 'video',
    title: 'Video de introducción',
    points: ['Cuando haya video publicado aparecerá aquí.'],
  },
];

export const mexicanStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Estado de México',
  'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit',
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán',
  'Zacatecas',
];
