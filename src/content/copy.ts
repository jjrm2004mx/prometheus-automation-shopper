import type { TenantConfig } from '../config/schema';

/**
 * Copy base del producto, parametrizada por tenant.
 *
 * Cada texto se resuelve con `t()`. Si el tenant define una sobrescritura en
 * `tenant.content[clave]`, esa gana. Así una shopper puede cambiar el tono sin
 * tocar código, y las que no configuran nada heredan una copy que ya funciona.
 */

type Vars = Record<string, string | number>;

function interpolate(template: string, vars: Vars): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

export function createCopy(tenant: TenantConfig) {
  const base: Vars = {
    marca: tenant.brand.name,
    marcaCorta: tenant.brand.shortName,
    anfitrion: tenant.brand.hostName,
    ciudad: tenant.brand.sourcingCity,
    origen: tenant.brand.sourcingCountry,
    destino: tenant.brand.destinationCountry,
    comision: `${Math.round(tenant.commerce.commissionRate * 100)}%`,
    minimo: `$${tenant.commerce.minimumPurchase} ${tenant.commerce.sourceCurrency}`,
    apartado: `$${tenant.commerce.depositAmount} ${tenant.commerce.localCurrency}`,
    envioDias: tenant.commerce.shippingDaysLabel,
  };

  return function t(key: keyof typeof strings, vars: Vars = {}): string {
    const override = tenant.content[key as string];
    return interpolate(override ?? strings[key], { ...base, ...vars });
  };
}

export type Copy = ReturnType<typeof createCopy>;

export const strings = {
  // ---- Global ----
  'nav.home': 'Inicio',
  'nav.process': 'Cómo funciona',
  'nav.numbers': 'Números',
  'nav.lots': 'Lotes',
  'nav.faq': 'Preguntas',
  'nav.cta': 'Agendar',
  'nav.menu': 'Menú',
  'cta.whatsapp': 'WhatsApp',
  'cta.book': 'Reservar ventana',
  'cta.schedule': 'Agendar',
  'footer.rights': '© {marca}',

  // ---- Home ----
  'home.title': '{marca} | Compra en {origen} desde {destino}',
  'home.description':
    'Compra productos de {origen} con ayuda, números claros, fotos del pedido y seguimiento de principio a fin.',
  'home.eyebrow': 'Compra en {origen}',
  'home.headline': 'Compra en {origen} sin salir de {destino}',
  'home.sub':
    'Te acompañamos en vivo durante tu ventana de compra para ayudarte a elegir mejor y comprar con más claridad.',
  'home.terms': 'Reservación {apartado} · Comisión {comision} · Envío a todo {destino}',
  'home.metric.min': 'Compra mínima',
  'home.metric.commission': 'Comisión fija',
  'home.metric.shipping': 'Envío típico',
  'home.metric.rate': '{local} por {source}',
  'home.process.eyebrow': 'Tu ventana de compra',
  'home.process.title': 'Cómo funciona',
  'home.advantage.eyebrow': 'Tu ventaja',
  'home.advantage.title': 'Compra con más claridad',
  'home.invest.eyebrow': 'Tu inversión',
  'home.invest.title': 'Piensa mejor tu inversión',
  'home.options.eyebrow': 'Dos opciones',
  'home.options.title': 'Elige cómo quieres comprar',
  'home.options.mainLabel': 'Opción principal',
  'home.options.mainTitle': 'Ventana de Compra Prioritaria',
  'home.options.mainBody':
    'Compra guiada en vivo dentro de un bloque de atención reservado. Te acompañamos, te mostramos y tú decides.',
  'home.options.altLabel': 'Otra opción',
  'home.options.altTitle': 'Lotes',
  'home.options.altBody':
    'Si prefieres comprar por lote, puedes conocer esa opción aparte cuando hay disponibilidad.',
  'home.close.eyebrow': 'Lista para comprar mejor',
  'home.close.title': 'Tu próxima compra puede ser más fácil.',
  'home.close.body':
    'Reserva tu ventana y compra en {origen} con guía, criterio y sin complicaciones.',

  // ---- Proceso ----
  'process.title': 'Cómo funciona | {marca}',
  'process.description':
    'El proceso completo: cómo reservas tu ventana, cómo compras en vivo y qué pasa después.',
  'process.headline': 'Compra en {origen} con más claridad y mejores decisiones',
  'process.windowNote':
    'No es una hora exacta, es una ventana de atención. Esto nos permite movernos mejor en tienda, encontrar más opciones y atenderte sin hacerte perder toda la mañana.',

  // ---- Números ----
  'numbers.title': 'Números | {marca}',
  'numbers.description':
    'Compra mínima, comisión, envío y tipo de cambio. Los números del servicio, sin letras chiquitas.',
  'numbers.headline': 'Números claros. Decisiones más fáciles.',
  'numbers.sub':
    'Pon tu monto y ve un estimado claro de cuánto se invierte, cuánto se suma en costos y cuánto podrías ganar.',
  'numbers.disclaimer': 'Todos los números aquí son estimados y sirven para planear.',
  'numbers.shippingNote': 'El envío exacto se confirma después de empacar.',

  // ---- Calculadora ----
  'calc.title': 'Calculadora de costo final | {marca}',
  'calc.description':
    'Calcula cuánto te termina costando cada pieza puesta en {destino}, con comisión y envío repartidos de forma proporcional.',
  'calc.headline': 'Calculadora de costo final',
  'calc.sub':
    'Entiende mejor tus números y calcula cuánto te termina costando una pieza en {destino}, incluyendo comisión y envío.',
  'calc.warning':
    'No dividas tu compra entre todas las piezas por igual. Esta calculadora reparte el costo de forma proporcional según el valor de cada producto.',

  // ---- Agendar ----
  'book.title': 'Agendar tu ventana de compra | {marca}',
  'book.description':
    'Arma tu pedido y aparta tu lugar. {anfitrion} te envía el acceso para elegir tu horario.',
  'book.headline': 'Tu compra empieza aquí.',
  'book.sub':
    'Antes de reservar tu cita, primero armas tu pedido. Después apartas tu lugar y {anfitrion} te enviará el acceso para elegir tu horario.',
  'book.step1': 'Crea tu pedido',
  'book.step1body': 'Define qué quieres buscar y con qué presupuesto.',
  'book.step2': 'Aparta tu lugar',
  'book.step2body':
    'Haz tu transferencia en {destino} y {anfitrion} te enviará el acceso para reservar tu cita.',
  'book.start': 'Comenzar',
  'book.q.type': '¿Esto es para reventa o para uso personal?',
  'book.q.experience': 'Cuéntanos desde dónde empiezas.',
  'book.q.context': 'Un poco más sobre tu negocio',
  'book.q.budget': '¿Con cuánto quieres arrancar?',
  'book.q.categories': '¿Qué quieres buscar?',
  'book.q.details': 'Dale contexto a tu compra.',
  'book.q.priorities': 'Tus prioridades.',
  'book.q.contact': 'Ahora sí, tus datos.',
  'book.q.recap': 'Así va tu pedido.',

  // ---- Transferencia ----
  'transfer.title': 'Aparta tu cita | {marca}',
  'transfer.description': 'Haz tu transferencia de apartado y {anfitrion} te confirma tu ventana.',
  'transfer.headline': 'Aparta tu cita.',
  'transfer.sub':
    'Haz tu transferencia desde tu banca móvil. Es una cuenta en {destino}, así que no necesitas enviar {source}.',
  'transfer.termsTitle': 'Términos del apartado',
  'transfer.termsKept':
    'Tu apartado sí cuenta a favor de tu compra si asistes a tu cita o avisas con tiempo.',
  'transfer.termsLost':
    'Si no te presentas o no avisas, ese monto ya no se aplica a tu orden.',
  'transfer.done': 'Ya transferí',

  // ---- Reservar ----
  'reserve.locked': 'Primero necesitamos validar tu transferencia.',
  'reserve.lockedBody':
    '{anfitrion} te enviará el acceso a esta página una vez que confirme tu transferencia.',

  // ---- Preparación ----
  'prep.title': 'Antes de tu cita | {marca}',
  'prep.description': 'Todo lo que conviene tener listo antes de tu ventana de compra.',
  'prep.headline': 'Antes de tu cita.',
  'prep.sub':
    'Ya apartaste tu espacio. Antes de entrar a tienda, aquí tienes lo más importante para llegar lista y aprovechar mejor tu videollamada.',
  'prep.blocked': 'Revisa todas las secciones para continuar.',

  // ---- Envío ----
  'shipping.title': 'Envío | {marca}',
  'shipping.description': 'Confirma dónde recibes tu pedido y marca tu transferencia final.',
  'shipping.headline': 'Tu pedido ya está listo para salir.',
  'shipping.sub':
    'Confirma dónde lo vas a recibir. Después marca cuando ya hayas hecho tu transferencia final.',

  // ---- FAQ ----
  'faq.title': 'Preguntas frecuentes | {marca}',
  'faq.description': 'Dudas comunes sobre la ventana de compra, el pago, el envío y los lotes.',
  'faq.headline': 'Dudas comunes, respuestas claras.',
  'faq.stillAsking': '¿Todavía tienes dudas?',

  // ---- Lotes ----
  'lots.title': 'Lotes listos | {marca}',
  'lots.description':
    'Mercancía ya seleccionada, con precio todo incluido y envío directo a tu puerta.',
  'lots.headline': 'Ya armados. Listos para reservar.',
  'lots.sub':
    'Mercancía seleccionada, con precio todo incluido y envío directo a tu puerta. El primero que lo aparte, se lo lleva.',
  'lots.empty': 'Ahora mismo no hay lotes disponibles.',

  // ---- Sobre ----
  'about.title': 'Sobre {anfitrion} | {marca}',
  'about.description': 'Qué es este servicio, qué no es, y cómo se compra.',
  'about.headline': 'No se trata de comprar por comprar. Se trata de comprar mejor.',
} as const;

export type CopyKey = keyof typeof strings;
