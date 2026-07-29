import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { useExchangeRate } from '../lib/exchange';
import { quote, formatMoney } from '../lib/money';
import { usePageMeta } from '../lib/usePageMeta';
import { Button, Card, Metric, Section, Accordion } from '../components/ui';
import { whatsappUrl } from '../components/Layout';
import { processSteps, advantages, faqs } from '../content/data';

export default function Home() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const { rate } = useExchangeRate(tenant);
  const c = tenant.commerce;

  usePageMeta(t('home.title'), t('home.description'), '/');

  const q = quote(tenant, c.exampleMerchandise, rate);
  const wa = whatsappUrl(tenant.contact.whatsapp, tenant.contact.whatsappMessage);

  return (
    <>
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="section-container max-w-4xl">
          <p className="eyebrow mb-4">{t('home.eyebrow')}</p>
          <h1 className="display mb-6">{t('home.headline')}</h1>
          <p className="body-lg max-w-2xl mb-8">{t('home.sub')}</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/agendar" size="lg">
              {t('cta.book')}
            </Button>
            <Button href={wa} variant="outline" size="lg">
              {t('cta.whatsapp')}
            </Button>
          </div>
          <p className="body-sm mt-6">{t('home.terms')}</p>
        </div>
      </section>

      <div className="border-y border-border bg-surface">
        <div className="section-container grid grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          <Metric
            value={`$${c.minimumPurchase} ${c.sourceCurrency}`}
            label={t('home.metric.min')}
          />
          <Metric
            value={`${Math.round(c.commissionRate * 100)}%`}
            label={t('home.metric.commission')}
          />
          <Metric value={c.shippingDaysLabel} label={t('home.metric.shipping')} />
          <Metric
            value={rate.toFixed(2)}
            label={t('home.metric.rate', { local: c.localCurrency, source: c.sourceCurrency })}
          />
        </div>
      </div>

      <Section eyebrow={t('home.process.eyebrow')} title={t('home.process.title')}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <span className="text-sm font-semibold text-text-tertiary tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="headline-sm mt-3">{s.title}</h3>
                <p className="body-sm mt-2">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow={t('home.advantage.eyebrow')} title={t('home.advantage.title')} className="bg-surface">
        <div className="grid gap-4 sm:grid-cols-3">
          {advantages.map((a) => (
            <Card key={a.title} className="bg-background h-full">
              <h3 className="headline-sm">{a.title}</h3>
              <p className="body-sm mt-2">{a.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow={t('home.invest.eyebrow')} title={t('home.invest.title')}>
        <Card className="max-w-xl">
          <dl className="space-y-3 text-sm">
            <Row label="Mercancía" value={formatMoney(q.merchandise, c.sourceCurrency, tenant.locale, 0)} />
            <Row
              label={`Comisión (${Math.round(c.commissionRate * 100)}%)`}
              value={formatMoney(q.commission, c.sourceCurrency, tenant.locale, 0)}
            />
            <Row label="Envío estimado" value={`~${formatMoney(q.shipping, c.sourceCurrency, tenant.locale, 0)}`} />
            <div className="pt-3 border-t border-border">
              <Row
                label="Total estimado"
                value={`~${formatMoney(q.total, c.sourceCurrency, tenant.locale, 0)}`}
                strong
              />
            </div>
          </dl>
          <p className="body-sm mt-4">
            ≈ {formatMoney(q.totalLocal, c.localCurrency, tenant.locale, 0)} al tipo de cambio de{' '}
            {rate.toFixed(2)}
          </p>
          <div className="mt-6">
            <Button to="/numeros" variant="outline">
              Ver números completos
            </Button>
          </div>
        </Card>
      </Section>

      <Section eyebrow={t('home.options.eyebrow')} title={t('home.options.title')} className="bg-surface">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="bg-background">
            <p className="eyebrow mb-2">{t('home.options.mainLabel')}</p>
            <h3 className="headline-sm">{t('home.options.mainTitle')}</h3>
            <p className="body-sm mt-2 mb-6">{t('home.options.mainBody')}</p>
            <Button to="/agendar">{t('cta.book')}</Button>
          </Card>
          {tenant.features.lots && (
            <Card className="bg-background">
              <p className="eyebrow mb-2">{t('home.options.altLabel')}</p>
              <h3 className="headline-sm">{t('home.options.altTitle')}</h3>
              <p className="body-sm mt-2 mb-6">{t('home.options.altBody')}</p>
              <Button to="/lotes" variant="outline">
                Explorar lotes
              </Button>
            </Card>
          )}
        </div>
      </Section>

      <Section eyebrow="Preguntas frecuentes" title="Lo que necesitas saber">
        <div className="max-w-3xl">
          <Accordion items={faqs.slice(0, 4)} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/preguntas" variant="outline">
              Ver todas
            </Button>
            <Button href={wa} variant="ghost">
              {t('faq.stillAsking')}
            </Button>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">{t('home.close.eyebrow')}</p>
          <h2 className="headline-md mb-4">{t('home.close.title')}</h2>
          <p className="body-lg mb-8">{t('home.close.body')}</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/agendar" size="lg">
              {t('cta.book')}
            </Button>
            <Button href={wa} variant="outline" size="lg">
              {t('cta.whatsapp')}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? 'font-medium text-foreground' : 'text-text-secondary'}>{label}</dt>
      <dd className={`tabular-nums ${strong ? 'font-semibold text-foreground' : 'text-foreground'}`}>
        {value}
      </dd>
    </div>
  );
}
