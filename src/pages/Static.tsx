import { useState } from 'react';
import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { usePageMeta } from '../lib/usePageMeta';
import { useExchangeRate } from '../lib/exchange';
import { quote, formatMoney } from '../lib/money';
import { Accordion, Button, Card, Chip, Field, inputClass, Metric, Section } from '../components/ui';
import { whatsappUrl } from '../components/Layout';
import { faqCategories, faqs, processSteps } from '../content/data';

export function Process() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  usePageMeta(t('process.title'), t('process.description'), '/como-funciona');

  return (
    <>
      <Section eyebrow={`Compra en ${tenant.brand.sourcingCountry}`} title={t('process.headline')}>
        <div className="flex flex-wrap gap-3">
          <Button to="/agendar" size="lg">
            {t('cta.schedule')}
          </Button>
        </div>
      </Section>

      <Section eyebrow="Tu ventana" title="Cómo funciona tu ventana de compra" className="bg-surface">
        <ol className="max-w-3xl space-y-4">
          {processSteps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-semibold tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="font-medium text-foreground">{s.title}</h3>
                <p className="body-sm mt-1">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Card className="mt-10 max-w-3xl bg-background">
          <p className="body-sm">{t('process.windowNote')}</p>
        </Card>
      </Section>

      <Section eyebrow="Antes de caja" title="Antes de pagar, todo está claro.">
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
          <Card>
            <h3 className="headline-sm">Total claro</h3>
            <p className="body-sm mt-2">
              Ves el desglose de mercancía, comisión y envío estimado antes de pagar.
            </p>
          </Card>
          <Card>
            <h3 className="headline-sm">Pago después de aprobar</h3>
            <p className="body-sm mt-2">Depositas solo cuando ya aprobaste lo encontrado.</p>
          </Card>
        </div>
      </Section>

      <Section eyebrow="Después de comprar" title="El proceso sigue claro." className="bg-surface">
        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl">
          {[
            ['Ticket', 'Te compartimos el comprobante de la compra.'],
            ['Confirmación de envío', 'Te confirmamos cuándo sale y cómo va tu paquete.'],
            ['Tracking', 'Recibes tu número de seguimiento para rastrear tu envío.'],
          ].map(([h, b]) => (
            <Card key={h} className="bg-background">
              <h3 className="headline-sm">{h}</h3>
              <p className="body-sm mt-2">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

export function Numbers() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const { rate } = useExchangeRate(tenant);
  const c = tenant.commerce;
  usePageMeta(t('numbers.title'), t('numbers.description'), '/numeros');

  const [amount, setAmount] = useState(String(c.budgetPresets[0] ?? 10000));
  const local = Number(amount.replace(/\D/g, '')) || 0;
  const merch = local / (rate || 1);
  const q = quote(tenant, merch, rate);

  return (
    <>
      <Section eyebrow="Números" title={t('numbers.headline')} lead={t('numbers.sub')}>
        <p className="body-sm">{t('numbers.disclaimer')}</p>
      </Section>

      <div className="border-y border-border bg-surface">
        <div className="section-container grid grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          <Metric value={`$${c.minimumPurchase} ${c.sourceCurrency}`} label="Compra mínima" />
          <Metric value={`${Math.round(c.commissionRate * 100)}%`} label="Comisión" />
          <Metric value={c.shippingDaysLabel} label="Envío típico" />
          <Metric value={rate.toFixed(2)} label={`${c.localCurrency} por 1 ${c.sourceCurrency}`} />
        </div>
      </div>

      <Section title="Simula tu compra">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <div>
            <Field label={`Tu presupuesto de mercancía (${c.localCurrency})`}>
              <input className={inputClass} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2 mt-4">
              {c.budgetPresets.map((p) => (
                <Chip key={p} active={local === p} onClick={() => setAmount(String(p))}>
                  {formatMoney(p, c.localCurrency, tenant.locale, 0)}
                </Chip>
              ))}
            </div>
          </div>
          <Card>
            <dl className="space-y-3 text-sm">
              <L k="Mercancía" v={formatMoney(q.merchandise, c.sourceCurrency, tenant.locale, 0)} />
              <L k={`Comisión ${Math.round(c.commissionRate * 100)}%`} v={formatMoney(q.commission, c.sourceCurrency, tenant.locale, 0)} />
              <L k="Envío estimado" v={`~${formatMoney(q.shipping, c.sourceCurrency, tenant.locale, 0)}`} />
              <div className="pt-3 border-t border-border">
                <L k="Total estimado" v={`~${formatMoney(q.total, c.sourceCurrency, tenant.locale, 0)}`} strong />
                <p className="mt-1 text-right text-sm text-text-secondary tabular-nums">
                  {formatMoney(q.totalLocal, c.localCurrency, tenant.locale, 0)}
                </p>
              </div>
            </dl>
            <p className="body-sm mt-5">{t('numbers.shippingNote')}</p>
          </Card>
        </div>
      </Section>
    </>
  );
}

export function Faq() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const [cat, setCat] = useState<string>('todas');
  usePageMeta(t('faq.title'), t('faq.description'), '/preguntas');

  const shown = cat === 'todas' ? faqs : faqs.filter((f) => f.cat === cat);

  return (
    <Section eyebrow="Preguntas" title={t('faq.headline')} lead="Todo lo importante, explicado sin rodeos.">
      <div className="flex flex-wrap gap-2 mb-8">
        <Chip active={cat === 'todas'} onClick={() => setCat('todas')}>
          Todas
        </Chip>
        {faqCategories.map((f) => (
          <Chip key={f} active={cat === f} onClick={() => setCat(f)}>
            {f}
          </Chip>
        ))}
      </div>
      <div className="max-w-3xl">
        <Accordion items={shown} />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button to="/agendar">{t('cta.schedule')}</Button>
          <Button
            href={whatsappUrl(tenant.contact.whatsapp, tenant.contact.whatsappMessage)}
            variant="outline"
          >
            {t('cta.whatsapp')}
          </Button>
        </div>
      </div>
    </Section>
  );
}

export function About() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  usePageMeta(t('about.title'), t('about.description'), '/sobre');

  return (
    <>
      <Section eyebrow={`Sobre ${tenant.brand.hostName}`} title={t('about.headline')} />
      <Section eyebrow="Qué es" title="Un servicio pensado para reventa." className="bg-surface">
        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl">
          {[
            ['Compra por cita', 'Agenda, prepara tu pedido y aprueba en videollamada.'],
            ['Lotes listos', 'Inventario ya armado cuando hay disponibilidad.'],
            ['Enfoque en reventa', 'Todo el proceso está pensado para quien compra para revender.'],
          ].map(([h, b]) => (
            <Card key={h} className="bg-background">
              <h3 className="headline-sm">{h}</h3>
              <p className="body-sm mt-2">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section eyebrow="Qué no es" title="Lo que este servicio no es.">
        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl">
          {[
            ['No es compra improvisada', 'Cada compra sigue un proceso con claridad y aprobación.'],
            ['No es proceso sin aprobación', 'Nada se cierra sin que tú lo veas y lo apruebes.'],
            ['No es comprar por comprar', 'Se selecciona con intención, pensando en tu pedido.'],
          ].map(([h, b]) => (
            <Card key={h}>
              <h3 className="headline-sm">{h}</h3>
              <p className="body-sm mt-2">{b}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

export function Lots() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  usePageMeta(t('lots.title'), t('lots.description'), '/lotes');

  return (
    <>
      <Section eyebrow="Lotes listos" title={t('lots.headline')} lead={t('lots.sub')} />
      <Section eyebrow="El proceso" title="Así funciona." className="bg-surface">
        <ol className="grid gap-4 sm:grid-cols-4 max-w-4xl">
          {[
            'Revisas fotos, video y resumen',
            'Preguntas si sigue disponible',
            'Apartas con transferencia',
            'Se envía a tu puerta',
          ].map((s, i) => (
            <li key={s}>
              <Card className="bg-background h-full">
                <span className="text-sm font-semibold text-text-tertiary tabular-nums">{i + 1}</span>
                <p className="body-sm mt-2 text-foreground">{s}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Todo incluido en el precio">
        <div className="flex flex-wrap gap-2 mb-10">
          {['Mercancía', 'Comisión', 'Envío estimado', 'Empaque'].map((x) => (
            <span key={x} className="chip chip-idle">
              {x}
            </span>
          ))}
        </div>
        <Card className="max-w-2xl">
          <p className="body-sm">{t('lots.empty')}</p>
          <div className="mt-5">
            <Button href={whatsappUrl(tenant.contact.whatsapp, 'Hola, ¿qué lotes hay disponibles?')}>
              Preguntar por WhatsApp
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}

function L({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? 'font-medium text-foreground' : 'text-text-secondary'}>{k}</dt>
      <dd className={`tabular-nums ${strong ? 'font-semibold' : ''}`}>{v}</dd>
    </div>
  );
}
