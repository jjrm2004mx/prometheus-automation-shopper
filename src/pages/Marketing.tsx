import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { usePageMeta } from '../lib/usePageMeta';
import { useExchangeRate } from '../lib/exchange';
import { quote, formatMoney } from '../lib/money';
import { Accordion, Button, Card, Chip, Field, inputClass, Section } from '../components/ui';
import { whatsappUrl } from '../components/Layout';
import { ArtByIndex, Avatar, Figure } from '../components/Art';
import { carriers, galleryItems, shippingFaq, testimonials, whatYouSee } from '../content/catalog';
import { useOrderDraft } from '../lib/orderDraft';

/** Qué ve la clienta antes, durante y después de la cita. */
export function WhatYouSee() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  usePageMeta(
    `Lo que verás | ${tenant.brand.name}`,
    'Qué ves en tu videollamada, qué recibes antes de pagar y qué sigue después de la compra.',
    '/lo-que-veras',
  );

  return (
    <>
      <Section eyebrow="Lo que verás" title="Antes, durante y después." lead="Aquí entiendes cada momento del proceso, sin sorpresas.">
        <div className="flex flex-wrap gap-3">
          <Button to="/agendar" size="lg">{t('cta.schedule')}</Button>
          <Button to="/como-funciona" variant="outline" size="lg">Cómo funciona</Button>
        </div>
      </Section>

      {whatYouSee.map((s, i) => (
        <Section key={s.phase} eyebrow={s.phase} className={i % 2 === 1 ? 'bg-surface' : ''}>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <h2 className="headline-md mb-4">{s.title}</h2>
              <p className="body-lg">{s.body}</p>
            </div>
            <Figure ratio="aspect-[4/3]">
              <ArtByIndex index={s.art} />
            </Figure>
          </div>
        </Section>
      ))}

      <Section title="Lista para comprar mejor." className="bg-surface">
        <Button to="/agendar" size="lg">{t('cta.schedule')}</Button>
      </Section>
    </>
  );
}

/** Galería de ejemplos del proceso. */
export function Gallery() {
  const tenant = useTenant();
  usePageMeta(
    `Galería | ${tenant.brand.name}`,
    'Ejemplos de pedidos, empaque y entregas.',
    '/galeria',
  );

  return (
    <Section eyebrow="Galería" title="Cómo se ve el proceso." lead="Ejemplos de cada etapa, de la tienda a tu puerta.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((g) => (
          <Figure key={g.title} caption={g.caption}>
            <ArtByIndex index={g.art} label={g.title} />
          </Figure>
        ))}
      </div>
      <p className="body-sm mt-8 max-w-2xl">
        Estas ilustraciones se reemplazan por fotos reales de pedidos desde la consola. Mientras no
        haya media publicada, el sitio muestra estos marcadores.
      </p>
    </Section>
  );
}

/** Testimonios de clientas. */
export function Testimonials() {
  const tenant = useTenant();
  usePageMeta(
    `Testimonios | ${tenant.brand.name}`,
    'Lo que dicen quienes ya compraron.',
    '/testimonios',
  );

  return (
    <>
      <Section eyebrow="Testimonios" title="Lo que dicen quienes ya compraron.">
        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
          {testimonials.map((x) => (
            <Card key={x.name}>
              <p className="body-lg text-foreground">“{x.body}”</p>
              <div className="mt-5 flex items-center gap-3">
                <Avatar name={x.name} />
                <div>
                  <p className="text-sm font-medium text-foreground">{x.name}</p>
                  <p className="text-xs text-text-tertiary">{x.city}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="body-sm mt-8 max-w-2xl">
          Testimonios de ejemplo. Los resultados de cada persona dependen de su mercancía, sus
          precios y su mercado; no son una promesa de venta.
        </p>
      </Section>
    </>
  );
}

/** Precios y estructura de costo. */
export function Pricing() {
  const tenant = useTenant();
  const { rate } = useExchangeRate(tenant);
  const c = tenant.commerce;
  usePageMeta(
    `Precios | ${tenant.brand.name}`,
    'Comisión, compra mínima, apartado y envío. Sin letras chiquitas.',
    '/precios',
  );

  const rows = [
    { k: 'Compra mínima de mercancía', v: `$${c.minimumPurchase} ${c.sourceCurrency}` },
    { k: 'Comisión sobre mercancía', v: `${Math.round(c.commissionRate * 100)} %` },
    { k: 'Apartado de cita', v: formatMoney(c.depositAmount, c.localCurrency, tenant.locale, 0) },
    { k: 'Envío estimado', v: `~${Math.round(c.shippingEstimateRate * 100)} % de la mercancía` },
    { k: 'Tiempo típico de envío', v: c.shippingDaysLabel },
    { k: 'Tipo de cambio de hoy', v: `${rate.toFixed(2)} ${c.localCurrency} por 1 ${c.sourceCurrency}` },
  ];

  return (
    <>
      <Section eyebrow="Precios" title="Qué cuesta y por qué." lead="Todo lo que se cobra, en un solo lugar.">
        <div className="max-w-2xl divide-y divide-border border-y border-border">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between gap-6 py-4">
              <span className="text-text-secondary">{r.k}</span>
              <span className="font-medium tabular-nums text-foreground">{r.v}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Qué no se cobra" className="bg-surface">
        <ul className="max-w-2xl space-y-2 body-lg list-disc pl-5">
          <li>No se cobra por buscar ni por mostrarte opciones.</li>
          <li>No se cobra comisión sobre el envío, solo sobre la mercancía.</li>
          <li>No hay cargo por cancelar antes de tu ventana si avisas con tiempo.</li>
          <li>No hay cuota mensual ni membresía para comprar.</li>
        </ul>
      </Section>

      <Section title="Calcula tu caso">
        <p className="body-lg max-w-2xl mb-8">
          La calculadora reparte comisión y envío en proporción al valor de cada pieza, que es como
          se calcula bien el costo real.
        </p>
        <Button to="/calculadora" size="lg">Abrir la calculadora</Button>
      </Section>
    </>
  );
}

/** Información de paquetería. */
export function ShippingInfo() {
  const tenant = useTenant();
  usePageMeta(
    `Paquetería | ${tenant.brand.name}`,
    'Opciones de envío, tiempos y cómo se calcula el costo.',
    '/paqueteria',
  );

  return (
    <>
      <Section eyebrow="Paquetería" title="Cómo llega tu pedido." lead="Opciones, tiempos y cómo se calcula lo que pagas.">
        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl">
          {carriers.map((x) => (
            <Card key={x.name}>
              <h3 className="headline-sm">{x.name}</h3>
              <p className="mt-2 text-sm font-medium tabular-nums text-foreground">{x.days}</p>
              <p className="body-sm mt-2">{x.note}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center max-w-4xl">
          <div>
            <h2 className="headline-md mb-4">El costo exacto se confirma al empacar.</h2>
            <p className="body-lg">
              Antes de empacar solo se puede estimar, porque el precio depende del peso y del
              volumen reales. Por eso todo número de envío que ves antes es un estimado, y se
              declara como tal.
            </p>
          </div>
          <Figure><ArtByIndex index={7} /></Figure>
        </div>
      </Section>

      <Section title="Preguntas de envío">
        <div className="max-w-3xl">
          <Accordion items={shippingFaq} />
        </div>
      </Section>
    </>
  );
}

/** Estados por los que pasa un pedido. */
export function OrderStates() {
  const tenant = useTenant();
  usePageMeta(
    `Tus pedidos | ${tenant.brand.name}`,
    'En qué estado puede estar tu pedido y qué sigue en cada uno.',
    '/pedidos',
  );

  const states = [
    ['Enviado', 'Armaste tu pedido y lo recibimos. Falta apartar tu cita.'],
    ['Apartado pendiente', 'Declaraste tu transferencia. Estamos confirmándola.'],
    ['Cita reservada', 'Tu ventana está agendada. Prepárate antes del día.'],
    ['En compra', 'Estamos en tienda con tu pedido en mano.'],
    ['Esperando pago', 'Aprobaste tu mercancía. Falta tu transferencia de caja.'],
    ['Empacando', 'Se está armando y pesando tu caja.'],
    ['Enviado a tu dirección', 'Ya salió. Tienes tu número de rastreo.'],
    ['Entregado', 'Llegó. Cualquier detalle, escríbenos.'],
  ];

  return (
    <Section eyebrow="Tus pedidos" title="En qué estado puede estar tu pedido." lead="Cada estado dice qué pasó y qué sigue.">
      <ol className="max-w-3xl divide-y divide-border border-y border-border">
        {states.map(([k, v], i) => (
          <li key={k} className="flex gap-4 py-4">
            <span className="w-6 shrink-0 text-sm tabular-nums text-text-tertiary">{i + 1}</span>
            <div>
              <p className="font-medium text-foreground">{k}</p>
              <p className="body-sm mt-1">{v}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="body-sm mt-8 max-w-2xl">
        Si tienes el enlace de tu pedido, ahí ves tu estado actual. Si lo perdiste, escríbenos por
        WhatsApp con tu nombre y te lo reenviamos.
      </p>
      <div className="mt-6">
        <Button href={whatsappUrl(tenant.contact.whatsapp, 'Hola, quiero el enlace de mi pedido.')} variant="outline">
          Pedir mi enlace
        </Button>
      </div>
    </Section>
  );
}

/** Captura pública de preguntas. */
export function Ask() {
  const tenant = useTenant();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  usePageMeta(
    `Preguntar | ${tenant.brand.name}`,
    `Escribe tu pregunta y ${tenant.brand.hostName} te responde.`,
    '/preguntar',
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get('pregunta') ?? '').trim();
    const phone = String(fd.get('telefono') ?? '').trim();
    if (q.length < 10) return setError('Escribe tu pregunta con un poco más de detalle.');
    if (phone.replace(/\D/g, '').length < 8) return setError('Necesitamos un teléfono válido para responderte.');
    setError('');
    setSent(true);
  };

  if (sent) {
    return (
      <Section eyebrow="Preguntar" title="Pregunta recibida.">
        <Card className="max-w-xl">
          <p className="body-lg">Te respondemos por WhatsApp al número que dejaste.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/preguntas" variant="outline">Ver preguntas frecuentes</Button>
            <Button to="/agendar">Agendar</Button>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <Section eyebrow="Preguntar" title={`Escribe tu pregunta.`} lead={`${tenant.brand.hostName} las responde.`}>
      <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-5">
        <Field label="Tu pregunta" required>
          <textarea name="pregunta" rows={5} className={inputClass} placeholder="¿Qué quieres saber?" />
        </Field>
        <Field label="Teléfono / WhatsApp" required hint="Solo lo usamos para responderte.">
          <input name="telefono" inputMode="tel" className={inputClass} />
        </Field>
        {error && <p role="alert" className="text-sm font-medium text-foreground">{error}</p>}
        <Button type="submit" size="lg">Enviar pregunta</Button>
      </form>
    </Section>
  );
}

/** Confirmación de cita. */
export function Confirmed() {
  const tenant = useTenant();
  usePageMeta(
    `Cita confirmada | ${tenant.brand.name}`,
    'Tu ventana de compra quedó reservada.',
    '/confirmado',
  );

  return (
    <Section eyebrow="✓ Confirmado" title="Tu ventana quedó reservada." lead="Ya tienes lugar. Esto es lo que sigue.">
      <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
        <Card>
          <h3 className="headline-sm">Antes del día</h3>
          <p className="body-sm mt-2">
            Revisa la preparación: presupuesto listo, expectativas claras y buena señal para la llamada.
          </p>
          <div className="mt-5">
            <Button to="/antes-de-tu-cita">Ver preparación</Button>
          </div>
        </Card>
        <Card>
          <h3 className="headline-sm">El día de tu ventana</h3>
          <p className="body-sm mt-2">
            Te avisamos una hora antes y otra vez cuando falten unos 30 minutos. Mantente pendiente
            de tu teléfono.
          </p>
        </Card>
      </div>
    </Section>
  );
}

/** Borrador libre de pedido, guardado en el dispositivo. */
export function Draft() {
  const tenant = useTenant();
  const { draft, patch, reset, toggle } = useOrderDraft();
  const { rate } = useExchangeRate(tenant);
  const c = tenant.commerce;
  usePageMeta(
    `Tu pedido | ${tenant.brand.name}`,
    'Arma el borrador de tu pedido antes de agendar. Se guarda en tu dispositivo.',
    '/tu-pedido',
  );

  const q = draft.budgetLocal ? quote(tenant, draft.budgetLocal / (rate || 1), rate) : null;

  return (
    <Section eyebrow="Tu pedido" title="Tu pedido empieza aquí." lead="Entre más claro llegue, mejor se compra.">
      <p className="body-sm mb-8">Guardado local en este dispositivo.</p>

      <div className="grid gap-8 lg:grid-cols-2 max-w-5xl">
        <div className="space-y-6">
          <Field label={`Presupuesto (${c.localCurrency})`}>
            <input
              className={inputClass}
              inputMode="numeric"
              value={draft.budgetLocal ?? ''}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ''));
                patch({ budgetLocal: n > 0 ? n : undefined });
              }}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium mb-3">Qué quieres comprar</legend>
            <div className="flex flex-wrap gap-2">
              {tenant.categories.map((cat) => (
                <Chip key={cat.id} active={draft.categories.includes(cat.id)} onClick={() => toggle('categories', cat.id)}>
                  {cat.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <Field label="Marcas">
            <input className={inputClass} value={draft.brands} onChange={(e) => patch({ brands: e.target.value })} />
          </Field>
          <Field label="Tallas / modelos / medidas">
            <input className={inputClass} value={draft.sizes} onChange={(e) => patch({ sizes: e.target.value })} />
          </Field>
          <Field label="Colores / acabados">
            <input className={inputClass} value={draft.colors} onChange={(e) => patch({ colors: e.target.value })} />
          </Field>
          <Field label="Prioridades">
            <textarea rows={3} className={inputClass} value={draft.priorities} onChange={(e) => patch({ priorities: e.target.value })} />
          </Field>
          <Field label="Qué no quieres">
            <textarea rows={3} className={inputClass} value={draft.exclusions} onChange={(e) => patch({ exclusions: e.target.value })} />
          </Field>
          <Field label="Notas">
            <textarea rows={3} className={inputClass} value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} />
          </Field>
        </div>

        <div className="lg:sticky lg:top-24 h-fit space-y-4">
          <Card>
            <p className="eyebrow mb-4">Así se ve tu compra</p>
            {!q ? (
              <p className="body-sm">Escribe tu presupuesto para ver el estimado.</p>
            ) : (
              <dl className="space-y-3 text-sm">
                <Line k="Mercancía" v={formatMoney(q.merchandise, c.sourceCurrency, tenant.locale, 0)} />
                <Line k={`Comisión ${Math.round(c.commissionRate * 100)}%`} v={formatMoney(q.commission, c.sourceCurrency, tenant.locale, 0)} />
                <Line k="Envío estimado" v={`~${formatMoney(q.shipping, c.sourceCurrency, tenant.locale, 0)}`} />
                <div className="pt-3 border-t border-border">
                  <Line k="Total estimado" v={`~${formatMoney(q.total, c.sourceCurrency, tenant.locale, 0)}`} strong />
                </div>
              </dl>
            )}
          </Card>
          <div className="flex flex-wrap gap-3">
            <Button to="/agendar" size="lg">Agendar con este pedido</Button>
            <Button variant="ghost" onClick={reset}>Reiniciar borrador</Button>
          </div>
          <p className="body-sm">
            Este borrador no se envía a nadie todavía. Vive solo en este dispositivo hasta que
            agendes.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Line({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? 'font-medium text-foreground' : 'text-text-secondary'}>{k}</dt>
      <dd className={`tabular-nums ${strong ? 'font-semibold' : ''}`}>{v}</dd>
    </div>
  );
}

/** Página de captación para tráfico social. */
export function SocialLanding() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  usePageMeta(
    `${tenant.brand.name} | ${tenant.brand.tagline}`,
    'Compra en el extranjero con acompañamiento en vivo y números claros.',
    '/tiktok',
  );

  const c = tenant.commerce;
  const links = [
    { to: '/agendar', label: 'Agendar mi ventana de compra', primary: true },
    { to: '/numeros', label: 'Ver los números del servicio' },
    { to: '/calculadora', label: 'Calcular mi costo por pieza' },
    { to: '/como-funciona', label: 'Cómo funciona' },
    ...(tenant.features.lots ? [{ to: '/lotes', label: 'Ver lotes disponibles' }] : []),
    { to: '/preguntas', label: 'Preguntas frecuentes' },
  ];

  return (
    <div className="section-container max-w-lg py-16 text-center">
      <h1 className="headline-lg mb-3">{tenant.brand.name}</h1>
      <p className="body-lg mb-8">{tenant.brand.tagline}</p>

      <div className="mb-8 grid grid-cols-3 gap-3 text-center">
        <Mini v={`$${c.minimumPurchase}`} k="Mínimo" />
        <Mini v={`${Math.round(c.commissionRate * 100)}%`} k="Comisión" />
        <Mini v={c.shippingDaysLabel} k="Envío" />
      </div>

      <div className="space-y-3">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`block rounded-full px-6 py-4 font-medium transition-all ${
              l.primary
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-surface text-foreground hover:border-foreground/40'
            }`}
          >
            {l.label}
          </Link>
        ))}
        <a
          href={whatsappUrl(tenant.contact.whatsapp, tenant.contact.whatsappMessage)}
          className="block rounded-full border border-border bg-surface px-6 py-4 font-medium hover:border-foreground/40"
        >
          {t('cta.whatsapp')}
        </a>
      </div>
    </div>
  );
}

function Mini({ v, k }: { v: string; k: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-2 py-4">
      <p className="font-semibold tabular-nums">{v}</p>
      <p className="text-xs text-text-tertiary mt-0.5">{k}</p>
    </div>
  );
}
