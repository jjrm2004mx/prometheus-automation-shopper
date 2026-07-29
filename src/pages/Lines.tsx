import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTenant } from '../lib/tenant';
import { usePageMeta } from '../lib/usePageMeta';
import { formatMoney } from '../lib/money';
import { Accordion, Button, Card, Section } from '../components/ui';
import { ArtByIndex, Figure } from '../components/Art';
import { schoolFaq, schoolForYou, schoolIncludes, schoolNotForYou, schoolTopics, dropIncludes } from '../content/catalog';

/* ------------------------------------------------------------------ */
/* Membresía de formación                                              */
/* ------------------------------------------------------------------ */

export function School() {
  const tenant = useTenant();
  const s = tenant.school;
  usePageMeta(
    `Escuela | ${tenant.brand.name}`,
    'Aprende a empezar como personal shopper: clases, comunidad y preguntas en vivo.',
    '/school',
  );

  if (!tenant.features.school || !s) {
    return (
      <Section title="Esta sección no está disponible.">
        <Link to="/" className="underline">Volver al inicio</Link>
      </Section>
    );
  }

  const price = `${formatMoney(s.priceMonthly, s.currency, tenant.locale, 0)} / mes`;

  return (
    <>
      <Section eyebrow="Escuela" title="Aprende a empezar como personal shopper." lead="Sin inventarlo todo desde cero.">
        <div className="flex flex-wrap items-center gap-3">
          <Button href={s.joinUrl} size="lg">Entrar a la comunidad — {price}</Button>
          <Button to="#incluye" variant="outline" size="lg">Ver qué incluye</Button>
        </div>
        <p className="body-sm mt-4">Comunidad mensual · cancela cuando quieras</p>
        {s.joinNotice && <p className="text-xs text-text-tertiary mt-2">{s.joinNotice}</p>}
      </Section>

      <Section eyebrow="Más que un curso" title="No es algo que ves una vez y ya." className="bg-surface">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center max-w-5xl">
          <p className="body-lg">
            Es una comunidad donde puedes ver las clases, usar plantillas y preguntar tus dudas cada
            semana. El material está para consultarse cuando lo necesites, no para verse de corrido.
          </p>
          <Figure><ArtByIndex index={9} label="Comunidad y clases" /></Figure>
        </div>
      </Section>

      <Section eyebrow="Lo que verás" title="Las bases para empezar bien.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl">
          {schoolTopics.map((x) => (
            <li key={x}>
              <Card className="h-full">
                <p className="text-sm font-medium text-foreground">{x}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="incluye" eyebrow={price} title="Qué incluye la comunidad" className="bg-surface">
        <ul className="max-w-2xl space-y-2 body-lg list-disc pl-5">
          {schoolIncludes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="body-sm mt-6">Pagas mes a mes. Te quedas mientras te siga sirviendo.</p>
        <div className="mt-8">
          <Button href={s.joinUrl} size="lg">Entrar por {price}</Button>
        </div>
      </Section>

      <Section eyebrow="En vivo" title="Preguntas cada semana.">
        <Card className="max-w-xl">
          <p className="body-lg text-foreground">{s.liveSchedule}</p>
          <p className="body-sm mt-2">Pregunta lo que sea sobre tu semana: precios, pedidos, empaque o clientas.</p>
        </Card>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <Card className="bg-background">
            <h2 className="headline-sm mb-4">Esto es para ti si…</h2>
            <ul className="space-y-2 body-sm list-disc pl-5">
              {schoolForYou.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </Card>
          <Card className="bg-background">
            <h2 className="headline-sm mb-4">No es para ti si…</h2>
            <ul className="space-y-2 body-sm list-disc pl-5">
              {schoolNotForYou.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Preguntas" title="Lo que la gente pregunta.">
        <div className="max-w-3xl">
          <Accordion items={schoolFaq} />
        </div>
        <p className="body-sm mt-10 max-w-2xl">
          Los resultados pasados no garantizan resultados futuros. La comunidad enseña el proceso;
          aplicarlo y practicarlo depende de cada persona.
        </p>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Paquetes listos para enviar                                         */
/* ------------------------------------------------------------------ */

type Drop = {
  slug: string;
  title: string;
  summary: string;
  price: number;
  items: string[];
  art: number;
  soldOut?: boolean;
};

/** Catálogo de ejemplo. Se reemplaza por la consulta a `usa_drops`. */
const sampleDrops: Drop[] = [
  {
    slug: 'starter-bundle',
    title: 'Starter Bundle',
    summary: 'A curated mix to open your first shop — bags, accessories and a few statement pieces.',
    price: 340,
    items: ['3 handbags', '5 accessories', '2 statement pieces', 'Protective packaging'],
    art: 0,
  },
  {
    slug: 'sneaker-drop',
    title: 'Sneaker Drop',
    summary: 'Six pairs across the most requested sizes, checked and photographed before shipping.',
    price: 520,
    items: ['6 pairs, sizes 6–9', 'Original boxes', 'Condition report', 'Protective packaging'],
    art: 1,
  },
  {
    slug: 'beauty-box',
    title: 'Beauty Box',
    summary: 'Fragrance and beauty, sealed and in date, ready to resell.',
    price: 280,
    items: ['4 fragrances', '8 beauty items', 'Sealed, in date', 'Protective packaging'],
    art: 3,
    soldOut: true,
  },
];

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

/** Simula la consulta con sus estados terminales — nunca se queda cargando. */
function useDrops() {
  const [state, setState] = useState<LoadState>('loading');
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(() => {
      if (!alive) return;
      setDrops(sampleDrops);
      setState(sampleDrops.length ? 'ready' : 'empty');
    }, 250);
    // Salvaguarda: si la consulta no responde, se resuelve como error.
    const bail = setTimeout(() => {
      if (alive) setState((s) => (s === 'loading' ? 'error' : s));
    }, 8000);
    return () => {
      alive = false;
      clearTimeout(timer);
      clearTimeout(bail);
    };
  }, []);

  return { state, drops, retry: () => setState('loading') };
}

export function Drops() {
  const tenant = useTenant();
  const d = tenant.drops;
  const { state, drops, retry } = useDrops();
  usePageMeta(
    `Ready-to-Ship Drops | ${tenant.brand.name}`,
    'Curated bundles, shipped within the United States. One-time purchase, no subscriptions.',
    '/drops',
  );

  if (!tenant.features.drops || !d) {
    return (
      <Section title="Esta sección no está disponible.">
        <Link to="/" className="underline">Volver al inicio</Link>
      </Section>
    );
  }

  return (
    <>
      <Section
        eyebrow="Drops"
        title="Ready-to-Ship Drops"
        lead={`Curated bundles, shipped within ${d.shipsWithin}. One-time purchase, no subscriptions.`}
      >
        <div className="flex flex-wrap gap-2">
          {dropIncludes.map((x) => (
            <span key={x} className="chip chip-idle">{x}</span>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        {state === 'loading' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <div className="aspect-[4/3] rounded-xl bg-accent" />
                <div className="mt-4 h-4 w-2/3 rounded bg-accent" />
                <div className="mt-2 h-3 w-full rounded bg-accent" />
              </div>
            ))}
            <p className="sr-only">Loading drops…</p>
          </div>
        )}

        {state === 'error' && (
          <Card className="max-w-xl bg-background">
            <h2 className="headline-sm mb-2">We couldn’t load the drops.</h2>
            <p className="body-sm mb-5">Something went wrong on our side. Try again in a moment.</p>
            <Button onClick={retry}>Try again</Button>
          </Card>
        )}

        {state === 'empty' && (
          <Card className="max-w-xl bg-background">
            <h2 className="headline-sm mb-2">No drops right now.</h2>
            <p className="body-sm">New bundles are posted as they’re built. Check back soon.</p>
          </Card>
        )}

        {state === 'ready' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {drops.map((x) => (
              <article key={x.slug} className="rounded-2xl border border-border bg-background overflow-hidden">
                <Figure ratio="aspect-[4/3]" className="[&>div]:rounded-none [&>div]:border-0">
                  <ArtByIndex index={x.art} label={x.title} />
                </Figure>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="headline-sm">{x.title}</h2>
                    <p className="font-semibold tabular-nums">{formatMoney(x.price, d.currency, d.locale, 0)}</p>
                  </div>
                  <p className="body-sm mt-2">{x.summary}</p>
                  <div className="mt-5">
                    {x.soldOut ? (
                      <Button disabled>Sold out</Button>
                    ) : (
                      <Button to={`/drops/${x.slug}`}>View drop</Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

export function DropDetail() {
  const tenant = useTenant();
  const d = tenant.drops;
  const { slug } = useParams();
  const drop = sampleDrops.find((x) => x.slug === slug);

  usePageMeta(
    drop ? `${drop.title} | ${tenant.brand.name}` : `Drop not found | ${tenant.brand.name}`,
    drop?.summary ?? 'This drop is no longer available.',
    `/drops/${slug ?? ''}`,
  );

  if (!d) return null;

  if (!drop) {
    return (
      <Section title="This drop isn’t available.">
        <Button to="/drops">Back to drops</Button>
      </Section>
    );
  }

  return (
    <Section eyebrow="Drop">
      <div className="grid gap-10 lg:grid-cols-2 max-w-5xl">
        <Figure ratio="aspect-square"><ArtByIndex index={drop.art} label={drop.title} /></Figure>
        <div>
          <h1 className="headline-lg mb-3">{drop.title}</h1>
          <p className="headline-sm tabular-nums mb-5">{formatMoney(drop.price, d.currency, d.locale, 0)}</p>
          <p className="body-lg mb-8">{drop.summary}</p>

          <h2 className="eyebrow mb-3">What’s included</h2>
          <ul className="space-y-2 body-sm list-disc pl-5 mb-8">
            {drop.items.map((i) => <li key={i}>{i}</li>)}
          </ul>

          {drop.soldOut ? (
            <>
              <Button disabled size="lg">Sold out</Button>
              <p className="body-sm mt-3">This bundle is gone. New drops are posted regularly.</p>
            </>
          ) : (
            <>
              <Button size="lg" to={`/drops/${drop.slug}/checkout`}>Buy this drop</Button>
              <p className="body-sm mt-3">
                One-time purchase. Ships within {d.shipsWithin}. Payment is processed on the next
                step.
              </p>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

export function DropCheckout() {
  const tenant = useTenant();
  const { slug } = useParams();
  const drop = sampleDrops.find((x) => x.slug === slug);
  usePageMeta(`Checkout | ${tenant.brand.name}`, 'Complete your purchase.', `/drops/${slug ?? ''}/checkout`);

  return (
    <Section eyebrow="Checkout" title={drop ? drop.title : 'Drop not found'}>
      <Card className="max-w-xl">
        <p className="body-lg mb-4">
          Payment isn’t connected yet.
        </p>
        <p className="body-sm mb-6">
          This step will create a payment session on the server and redirect to the processor. The
          amount is never taken from the browser — it’s resolved server-side from the drop record.
          See the <code>usa-drops</code> capability for the full requirement.
        </p>
        <Button to="/drops" variant="outline">Back to drops</Button>
      </Card>
    </Section>
  );
}
