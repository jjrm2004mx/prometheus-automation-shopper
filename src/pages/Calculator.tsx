import { useState } from 'react';
import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { usePageMeta } from '../lib/usePageMeta';
import { quote, pieceCost, margin, formatMoney } from '../lib/money';
import { Card, Field, inputClass, Section } from '../components/ui';

/**
 * Calculadora de costo aterrizado.
 * El punto no es sumar: es repartir comisión y envío en proporción al valor
 * de cada pieza, que es donde casi todo el mundo se equivoca.
 */
export default function Calculator() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const c = tenant.commerce;
  usePageMeta(t('calc.title'), t('calc.description'), '/calculadora');

  const [merch, setMerch] = useState('');
  const [ship, setShip] = useState('');
  const [rate, setRate] = useState(String(tenant.exchange.manualRate));
  const [ticket, setTicket] = useState('');
  const [sale, setSale] = useState('');

  const n = (s: string) => {
    const v = Number(s.replace(/[^\d.]/g, ''));
    return Number.isFinite(v) ? v : 0;
  };

  const m = n(merch);
  const s = n(ship);
  const r = n(rate) || 1;
  const q = quote(tenant, m, r);
  const total = m + m * c.commissionRate + s;
  const piece = pieceCost(tenant, n(ticket), m, s, r);
  const mg = piece ? margin(n(sale), piece.landedLocal) : null;

  const money = (v: number, cur = c.sourceCurrency, d = 2) => formatMoney(v, cur, tenant.locale, d);

  return (
    <>
      <Section eyebrow="Herramienta" title={t('calc.headline')} lead={t('calc.sub')}>
        <Card className="max-w-2xl border-foreground/20">
          <p className="body-sm">{t('calc.warning')}</p>
        </Card>
      </Section>

      <Section title="1 · Ingresa tu compra" className="bg-surface">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <div className="space-y-5">
            <Field
              label={`Precio final de mercancía (${c.sourceCurrency})`}
              hint="Usa el total final que te compartieron. Si hubo ajustes o devoluciones, usa el número ya corregido."
            >
              <input className={inputClass} inputMode="decimal" value={merch} onChange={(e) => setMerch(e.target.value)} />
            </Field>
            <Field label={`Envío total (${c.sourceCurrency})`}>
              <input className={inputClass} inputMode="decimal" value={ship} onChange={(e) => setShip(e.target.value)} />
            </Field>
            <Field
              label={`Tipo de cambio cobrado (${c.localCurrency} por 1 ${c.sourceCurrency})`}
              hint="El que se aplicó a tu pedido."
            >
              <input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
            </Field>
          </div>

          <Card className="bg-background h-fit">
            <p className="eyebrow mb-4">Resumen del pedido</p>
            <dl className="space-y-3 text-sm">
              <Line k="Mercancía total" v={money(m)} />
              <Line k={`Comisión ${Math.round(c.commissionRate * 100)}%`} v={money(q.commission)} />
              <Line k="Subtotal con comisión" v={money(m + q.commission)} />
              <Line k="Envío total" v={money(s)} />
              <div className="pt-3 border-t border-border">
                <Line k="Costo final aterrizado" v={money(total)} strong />
                <p className="mt-1 text-right text-sm text-text-secondary tabular-nums">
                  {money(total * r, c.localCurrency, 0)}
                </p>
              </div>
            </dl>
          </Card>
        </div>
      </Section>

      <Section title="2 · Calcula una pieza">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <Field
            label={`Precio de etiqueta de la pieza (${c.sourceCurrency})`}
            hint="El precio que viste en la etiqueta. No le sumes impuestos ni comisión: eso lo calcula esta herramienta."
          >
            <input className={inputClass} inputMode="decimal" value={ticket} onChange={(e) => setTicket(e.target.value)} />
          </Field>

          <Card className="bg-surface">
            <p className="eyebrow mb-4">Así te queda esta pieza</p>
            {!piece ? (
              <p className="body-sm">Completa tu compra arriba para empezar a calcular piezas.</p>
            ) : (
              <dl className="space-y-3 text-sm">
                <Line k="Representa del pedido" v={`${(piece.share * 100).toFixed(1)}%`} />
                <Line k="Comisión que absorbe" v={money(piece.commissionShare)} />
                <Line k="Envío que absorbe" v={money(piece.shippingShare)} />
                <div className="pt-3 border-t border-border">
                  <Line k="Costo puesto en destino" v={money(piece.landed)} strong />
                  <p className="mt-1 text-right text-sm text-text-secondary tabular-nums">
                    {money(piece.landedLocal, c.localCurrency, 0)}
                  </p>
                </div>
              </dl>
            )}
          </Card>
        </div>
      </Section>

      <Section title="3 · Prueba tu precio de venta" className="bg-surface">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <Field label={`Precio de venta esperado (${c.localCurrency})`}>
            <input className={inputClass} inputMode="decimal" value={sale} onChange={(e) => setSale(e.target.value)} />
          </Field>
          <Card className="bg-background">
            <p className="eyebrow mb-4">Tu ganancia estimada</p>
            {!mg ? (
              <p className="body-sm">Escribe tu precio de venta para ver tu ganancia estimada.</p>
            ) : (
              <dl className="space-y-3 text-sm">
                <Line k="Utilidad" v={money(mg.profit, c.localCurrency, 0)} strong />
                <Line k="Margen" v={`${mg.marginPct.toFixed(1)}%`} />
                <Line k="Multiplicador" v={`${mg.multiplier.toFixed(2)}x`} />
              </dl>
            )}
          </Card>
        </div>
      </Section>

      <Section eyebrow="Por qué importa" title="Una pieza cara no carga lo mismo que una barata">
        <div className="grid gap-4 sm:grid-cols-3 max-w-4xl">
          <Card>
            <h3 className="headline-sm">El error más común</h3>
            <p className="body-sm mt-2">
              Tomar el total de la compra y dividirlo entre todas las piezas por igual. Eso hace que
              algunas se vean más baratas de lo que realmente fueron.
            </p>
          </Card>
          <Card>
            <h3 className="headline-sm">Lo que sí funciona</h3>
            <p className="body-sm mt-2">
              Cada pieza absorbe comisión y envío según cuánto vale dentro del pedido. Una pieza de
              $100 carga mucho más costo que una de $10.
            </p>
          </Card>
          <Card>
            <h3 className="headline-sm">Para qué te sirve</h3>
            <p className="body-sm mt-2">
              Te dice cuánto te termina costando esa pieza ya puesta en destino, para que decidas tu
              precio de venta con números claros.
            </p>
          </Card>
        </div>
      </Section>
    </>
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
