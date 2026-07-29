/**
 * Contenido estructurado de las superficies secundarias.
 * Igual que `data.ts`: son los valores por defecto que hereda un tenant nuevo,
 * reemplazables desde la consola.
 */

export const homeTimeline = [
  { label: 'Reservas', body: 'Apartas tu bloque de compra.' },
  { label: 'Entramos a comprar', body: 'Buscamos con tu pedido en mano.' },
  { label: 'Eliges en vivo', body: 'Apruebas pieza por pieza.' },
  { label: 'Transfieres en caja', body: 'Aquí es donde pagas.', highlight: true },
  { label: 'Coordinamos envío', body: 'Ticket, confirmación y rastreo.' },
];

export const afterBooking = [
  { title: 'Confirmación', body: 'Recibes los detalles de tu ventana: tu bloque asignado, qué día y qué esperar.' },
  { title: 'Aviso una hora antes', body: 'Te recordamos que estés pendiente para no perder tu turno.' },
  { title: 'Aviso de turno', body: 'Cuando faltan unos 30 minutos, te avisamos por mensaje.' },
  { title: 'Llamada en vivo', body: 'Te llamamos y te mostramos lo encontrado para que decidas.' },
];

export const intentionPoints = [
  'Seleccionamos con intención',
  'Filtramos por ti en vivo',
  'Te orientamos para decidir',
  'Compramos juntos, no al azar',
];

export const whatYouSee = [
  {
    phase: 'Durante tu cita',
    title: 'Ves lo encontrado en vivo.',
    body: 'Te mostramos cada pieza por videollamada y decides qué sí tiene sentido para tu reventa.',
    art: 5,
  },
  {
    phase: 'Antes de caja',
    title: 'El total se comparte con claridad.',
    body: 'Cuando ya te convenció lo encontrado, ves el desglose completo antes de pagar.',
    art: 9,
  },
  {
    phase: 'Después de comprar',
    title: 'Ticket, envío y rastreo.',
    body: 'Se comparte el comprobante, se confirma el envío y se manda tu número de seguimiento.',
    art: 6,
  },
];

export const testimonials = [
  {
    name: 'Andrea M.',
    city: 'Guadalajara',
    body: 'Llegué con lista y presupuesto. Vi todo antes de pagar y no me sobró una sola pieza sin vender.',
  },
  {
    name: 'Lucía R.',
    city: 'Monterrey',
    body: 'Lo que más me sirvió fue la calculadora. Antes dividía el envío entre todas mis piezas por igual y traía mal mis precios.',
  },
  {
    name: 'Paola V.',
    city: 'Tijuana',
    body: 'Era mi primera compra para revender. Me explicaron el proceso completo antes de que transfiriera un peso.',
  },
  {
    name: 'Karla S.',
    city: 'Puebla',
    body: 'La ventana funciona. No pierdo la mañana esperando y me avisan cuando ya casi toca mi turno.',
  },
];

export const galleryItems = [
  { title: 'Selección en tienda', caption: 'Piezas revisadas antes de mostrarlas.', art: 8 },
  { title: 'Aprobación en vivo', caption: 'Cada pieza se muestra por videollamada.', art: 5 },
  { title: 'Mercancía lista', caption: 'Contada y verificada antes de empacar.', art: 0 },
  { title: 'Empaque', caption: 'Protegido para el traslado.', art: 4 },
  { title: 'Ticket y desglose', caption: 'Comprobante de la compra.', art: 6 },
  { title: 'Salida del envío', caption: 'Con número de rastreo.', art: 7 },
];

export const carriers = [
  { name: 'Paquetería estándar', days: '8 a 12 días hábiles', note: 'La opción más usada. Cubre todo el país.' },
  { name: 'Paquetería exprés', days: '4 a 6 días hábiles', note: 'Cuesta más. Conviene con mercancía de alto valor.' },
  { name: 'Consolidado', days: '12 a 18 días hábiles', note: 'Sale más barato por pieza si tu pedido es grande.' },
];

export const shippingFaq = [
  { q: '¿Cuándo se calcula el envío exacto?', a: 'Después de empacar. Antes de eso es un estimado, porque depende del peso y el volumen reales de lo que se compró.' },
  { q: '¿El envío se cobra aparte?', a: 'Sí, salvo en los lotes, donde el precio ya lo incluye.' },
  { q: '¿Puedo recibir en sucursal?', a: 'Sí. Al capturar tu dirección eliges entre domicilio y punto de entrega.' },
];

/** Escala de tallas de calzado. Referencia, no promesa de calce. */
export const shoeSizes = [
  { us: '5', mx: '22.5', cm: '22.5' },
  { us: '5.5', mx: '23', cm: '23' },
  { us: '6', mx: '23.5', cm: '23.5' },
  { us: '6.5', mx: '24', cm: '24' },
  { us: '7', mx: '24.5', cm: '24.5' },
  { us: '7.5', mx: '25', cm: '25' },
  { us: '8', mx: '25.5', cm: '25.5' },
  { us: '8.5', mx: '26', cm: '26' },
  { us: '9', mx: '26.5', cm: '26.5' },
  { us: '9.5', mx: '27', cm: '27' },
  { us: '10', mx: '27.5', cm: '27.5' },
  { us: '11', mx: '28.5', cm: '28.5' },
];

export const marginQuiz = [
  {
    id: 'q1',
    q: 'Compraste una pieza de etiqueta a $40 USD dentro de un pedido de $1,000 USD con $110 USD de envío. ¿Cuánto te costó puesta en México?',
    options: ['$40 USD', '$46 USD', '$52.4 USD', '$60 USD'],
    correct: 2,
    why: 'La pieza es el 4 % del pedido, así que absorbe el 4 % de la comisión ($8 USD) y el 4 % del envío ($4.4 USD). $40 + $8 + $4.4 = $52.4 USD.',
  },
  {
    id: 'q2',
    q: 'Si vendes esa pieza en $1,400 MXN con un tipo de cambio de 18, ¿cuál es tu margen aproximado?',
    options: ['Cerca del 15 %', 'Cerca del 33 %', 'Cerca del 50 %', 'Cerca del 70 %'],
    correct: 1,
    why: '$52.4 USD × 18 ≈ $943 MXN. Vendiendo en $1,400 tu utilidad es $457, o sea 33 % del precio de venta.',
  },
  {
    id: 'q3',
    q: '¿Cuál es el error más común al calcular el costo por pieza?',
    options: [
      'Olvidar el tipo de cambio',
      'Dividir comisión y envío entre todas las piezas por igual',
      'No sumar el precio de etiqueta',
      'Usar el precio de venta como base',
    ],
    correct: 1,
    why: 'Repartir en partes iguales subestima el costo de las piezas caras y sobreestima el de las baratas. El costo debe repartirse en proporción al valor de cada pieza.',
  },
];

export const schoolIncludes = [
  'Acceso a la comunidad privada',
  'Clases base para empezar',
  'Sesión semanal de preguntas en vivo',
  'Plantillas descargables',
  'Lista de materiales para arrancar',
  'Ejemplos de números y precios',
  'Videos nuevos mientras estés dentro',
];

export const schoolTopics = [
  'Qué productos buscar',
  'Cómo poner precios',
  'Cómo calcular comisión',
  'Cómo organizar pedidos',
  'Cómo empacar',
  'Cómo manejar apartados',
  'Cómo hablar con clientas',
  'Opciones de envío',
];

export const schoolForYou = [
  'Quieres empezar como personal shopper',
  'Te gusta vender productos',
  'No sabes por dónde empezar',
  'Quieres aprender con ejemplos',
  'Quieres preguntar mientras avanzas',
];

export const schoolNotForYou = [
  'No quieres vender',
  'No quieres organizarte',
  'Esperas resultados sin practicar',
  'Quieres que alguien haga todo por ti',
];

export const schoolFaq = [
  { q: '¿Es un curso?', a: 'Es una comunidad con clases. Puedes ver el material a tu ritmo y preguntar cada semana en vivo.' },
  { q: '¿Necesito experiencia?', a: 'No. El material empieza desde las bases: qué vender, cómo cobrar y cómo organizar tus primeros pedidos.' },
  { q: '¿Necesito mucho dinero para empezar?', a: 'No para entrar a la comunidad. Para tu primera compra sí necesitas capital, y una de las clases trata exactamente cuánto y cómo planearlo.' },
  { q: '¿Puedo cancelar?', a: 'Sí. Es mes a mes y te quedas mientras te siga sirviendo.' },
  { q: '¿Esto garantiza ventas?', a: 'No. Nada garantiza ventas. La comunidad enseña el proceso; aplicarlo y practicarlo te toca a ti.' },
];

export const dropIncludes = ['Curated selection', 'Ships within the United States', 'One-time purchase', 'No subscription'];
