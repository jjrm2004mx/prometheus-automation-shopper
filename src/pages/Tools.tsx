import { useState } from 'react';
import { useTenant } from '../lib/tenant';
import { usePageMeta } from '../lib/usePageMeta';
import { useExchangeRate } from '../lib/exchange';
import { formatMoney, margin, pieceCost, quote } from '../lib/money';
import { Button, Card, Field, inputClass, Section } from '../components/ui';
import { marginQuiz, shoeSizes } from '../content/catalog';

const num = (s: string) => {
  const v = Number(String(s).replace(/[^\d.]/g, ''));
  return Number.isFinite(v) ? v : 0;
};

/** Ganancia estimada de una sola pieza. */
export function ProfitPerPiece() {
  const tenant = useTenant();
  const c = tenant.commerce;
  const { rate } = useExchangeRate(tenant);
  usePageMeta(
    `Ganancia por pieza | ${tenant.brand.name}`,
    'Calcula rápido cuánto te deja una pieza según lo que pagas y a cuánto la vendes.',
    '/ganancia-por-pieza',
  );

  const [ticket, setTicket] = useState('');
  const [sale, setSale] = useState('');

  // Versión rápida: la pieza carga comisión y envío a la tasa promedio del
  // servicio. Para el reparto exacto dentro de un pedido está /calculadora.
  const t = num(ticket);
  const landedSource = t * (1 + c.commissionRate + c.shippingEstimateRate);
  const landedLocal = landedSource * rate;
  const mg = margin(num(sale), landedLocal);

  return (
    <>
      <Section eyebrow="Herramienta" title="Ganancia por pieza" lead="Dos datos y sabes si te conviene.">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <div className="space-y-5">
            <Field label={`Precio de etiqueta (${c.sourceCurrency})`} hint="Sin impuestos ni comisión: eso lo agrega el cálculo.">
              <input className={inputClass} inputMode="decimal" value={ticket} onChange={(e) => setTicket(e.target.value)} />
            </Field>
            <Field label={`Precio de venta esperado (${c.localCurrency})`}>
              <input className={inputClass} inputMode="decimal" value={sale} onChange={(e) => setSale(e.target.value)} />
            </Field>
          </div>
          <Card>
            {t <= 0 ? (
              <p className="body-sm">Escribe el precio de etiqueta para empezar.</p>
            ) : (
              <dl className="space-y-3 text-sm">
                <L k="Etiqueta" v={formatMoney(t, c.sourceCurrency, tenant.locale)} />
                <L k={`Comisión ${Math.round(c.commissionRate * 100)}%`} v={formatMoney(t * c.commissionRate, c.sourceCurrency, tenant.locale)} />
                <L k="Envío estimado" v={formatMoney(t * c.shippingEstimateRate, c.sourceCurrency, tenant.locale)} />
                <div className="pt-3 border-t border-border">
                  <L k="Costo puesto en destino" v={formatMoney(landedLocal, c.localCurrency, tenant.locale, 0)} strong />
                </div>
                {mg && (
                  <div className="pt-3 border-t border-border space-y-3">
                    <L k="Utilidad" v={formatMoney(mg.profit, c.localCurrency, tenant.locale, 0)} strong />
                    <L k="Margen" v={`${mg.marginPct.toFixed(1)}%`} />
                    <L k="Multiplicador" v={`${mg.multiplier.toFixed(2)}x`} />
                  </div>
                )}
              </dl>
            )}
          </Card>
        </div>
      </Section>

      <Section className="bg-surface">
        <Card className="max-w-2xl bg-background">
          <h2 className="headline-sm mb-3">Este cálculo es aproximado</h2>
          <p className="body-sm">
            Reparte comisión y envío usando el promedio del servicio. Dentro de un pedido real, cada
            pieza absorbe costo según cuánto vale respecto al total — una pieza cara carga mucho más
            que una barata. Para ese cálculo exacto usa la calculadora completa.
          </p>
          <div className="mt-5">
            <Button to="/calculadora">Ir a la calculadora completa</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}

/** Proyección de inversión y retorno de un pedido completo. */
export function InvestmentReturn() {
  const tenant = useTenant();
  const c = tenant.commerce;
  const { rate } = useExchangeRate(tenant);
  usePageMeta(
    `Inversión y ganancia | ${tenant.brand.name}`,
    'Proyecta cuánto inviertes en un pedido completo y cuánto podrías recuperar.',
    '/inversion-y-ganancia',
  );

  const [budget, setBudget] = useState(String(c.budgetPresets[1] ?? 15000));
  const [multiplier, setMultiplier] = useState('2.2');
  const [sellThrough, setSellThrough] = useState('80');

  const local = num(budget);
  const merch = local / (rate || 1);
  const q = quote(tenant, merch, rate);
  const mult = Math.max(num(multiplier), 0);
  const sold = Math.min(Math.max(num(sellThrough), 0), 100) / 100;

  const revenue = q.totalLocal * mult * sold;
  const profit = revenue - q.totalLocal;

  return (
    <>
      <Section eyebrow="Herramienta" title="Inversión y ganancia" lead="Proyecta un pedido completo, no una sola pieza.">
        <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
          <div className="space-y-5">
            <Field label={`Presupuesto de mercancía (${c.localCurrency})`}>
              <input className={inputClass} inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </Field>
            <Field label="Multiplicador de venta" hint="A cuántas veces el costo vendes en promedio. 2.0 es conservador, 3.0 optimista.">
              <input className={inputClass} inputMode="decimal" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
            </Field>
            <Field label="Porcentaje que esperas vender (%)" hint="Casi nadie vende el 100 % del lote. Ser realista aquí cambia todo.">
              <input className={inputClass} inputMode="numeric" value={sellThrough} onChange={(e) => setSellThrough(e.target.value)} />
            </Field>
          </div>

          <Card>
            <p className="eyebrow mb-4">Tu inversión</p>
            <dl className="space-y-3 text-sm">
              <L k="Mercancía" v={formatMoney(q.merchandise, c.sourceCurrency, tenant.locale, 0)} />
              <L k={`Comisión ${Math.round(c.commissionRate * 100)}%`} v={formatMoney(q.commission, c.sourceCurrency, tenant.locale, 0)} />
              <L k="Envío estimado" v={formatMoney(q.shipping, c.sourceCurrency, tenant.locale, 0)} />
              <div className="pt-3 border-t border-border">
                <L k="Inversión total" v={formatMoney(q.totalLocal, c.localCurrency, tenant.locale, 0)} strong />
              </div>
            </dl>

            <p className="eyebrow mt-8 mb-4">Tu proyección</p>
            <dl className="space-y-3 text-sm">
              <L k="Venta esperada" v={formatMoney(revenue, c.localCurrency, tenant.locale, 0)} />
              <L k="Utilidad proyectada" v={formatMoney(profit, c.localCurrency, tenant.locale, 0)} strong />
              <L k="Retorno sobre inversión" v={`${q.totalLocal > 0 ? ((profit / q.totalLocal) * 100).toFixed(0) : '0'}%`} />
            </dl>
          </Card>
        </div>
        <p className="body-sm mt-8 max-w-2xl">
          Es una proyección, no una promesa. El multiplicador y el porcentaje de venta dependen de
          tu mercado, tus precios y tu ritmo de venta.
        </p>
      </Section>
    </>
  );
}

/** Cuánto cuesta comprar cierta cantidad en moneda de origen. */
export function CurrencyBuy() {
  const tenant = useTenant();
  const c = tenant.commerce;
  const { rate } = useExchangeRate(tenant);
  usePageMeta(
    `Compra de ${c.sourceCurrency} | ${tenant.brand.name}`,
    'Convierte entre monedas con la tasa que se aplica a tu pedido.',
    '/compra-dolar',
  );

  const [amount, setAmount] = useState('500');
  const [dir, setDir] = useState<'toLocal' | 'toSource'>('toLocal');
  const v = num(amount);
  const result = dir === 'toLocal' ? v * rate : v / (rate || 1);
  const from = dir === 'toLocal' ? c.sourceCurrency : c.localCurrency;
  const to = dir === 'toLocal' ? c.localCurrency : c.sourceCurrency;

  return (
    <Section eyebrow="Herramienta" title="Conversión de moneda" lead="Con la misma tasa que usa todo el sitio.">
      <div className="max-w-xl space-y-5">
        <div className="flex gap-2">
          <button type="button" aria-pressed={dir === 'toLocal'} onClick={() => setDir('toLocal')} className={`chip ${dir === 'toLocal' ? 'chip-active' : 'chip-idle'}`}>
            {c.sourceCurrency} → {c.localCurrency}
          </button>
          <button type="button" aria-pressed={dir === 'toSource'} onClick={() => setDir('toSource')} className={`chip ${dir === 'toSource' ? 'chip-active' : 'chip-idle'}`}>
            {c.localCurrency} → {c.sourceCurrency}
          </button>
        </div>

        <Field label={`Monto en ${from}`}>
          <input className={inputClass} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>

        <Card>
          <p className="eyebrow mb-2">Equivale a</p>
          <p className="headline-md tabular-nums">{formatMoney(result, to, tenant.locale, to === c.localCurrency ? 0 : 2)}</p>
          <p className="body-sm mt-3">
            Tipo de cambio: {rate.toFixed(2)} {c.localCurrency} por 1 {c.sourceCurrency}. Es el mismo
            valor que usan la home, el asistente y la página de apartado.
          </p>
        </Card>

        <p className="body-sm">
          La tasa que se aplica a tu pedido es la del día en que haces tu transferencia, y queda
          guardada en tu pedido para que tus números no cambien después.
        </p>
      </div>
    </Section>
  );
}

/** Equivalencias de tallas de calzado. */
export function ShoeSizeChart() {
  const tenant = useTenant();
  usePageMeta(
    `Tabulador de tallas | ${tenant.brand.name}`,
    'Equivalencias de tallas de calzado entre US, MX y centímetros.',
    '/tabulador-tallas-zapatos',
  );

  const [cm, setCm] = useState('');
  const target = num(cm);
  const match = target > 0 ? shoeSizes.reduce((a, b) => (Math.abs(num(b.cm) - target) < Math.abs(num(a.cm) - target) ? b : a)) : null;

  return (
    <>
      <Section eyebrow="Referencia" title="Tallas de calzado" lead="Para pedir bien y devolver menos.">
        <div className="max-w-md space-y-5">
          <Field label="Mide tu pie en centímetros" hint="De talón a dedo más largo, de pie y con el peso repartido.">
            <input className={inputClass} inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} />
          </Field>
          {match && (
            <Card>
              <p className="eyebrow mb-2">Tu talla aproximada</p>
              <p className="headline-md tabular-nums">US {match.us} · MX {match.mx}</p>
            </Card>
          )}
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="max-w-md overflow-hidden rounded-2xl border border-border bg-background">
          <table className="w-full text-sm">
            <caption className="sr-only">Equivalencias de tallas de calzado</caption>
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="px-4 py-3 text-left font-medium">US</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">MX</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">cm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shoeSizes.map((s) => (
                <tr key={s.us} className={match?.us === s.us ? 'bg-accent font-medium' : ''}>
                  <td className="px-4 py-2.5 tabular-nums">{s.us}</td>
                  <td className="px-4 py-2.5 tabular-nums">{s.mx}</td>
                  <td className="px-4 py-2.5 tabular-nums">{s.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="body-sm mt-6 max-w-2xl">
          Es una referencia, no una garantía de calce: cada marca corta distinto. Cuando puedas,
          pide la medida en centímetros de la plantilla.
        </p>
      </Section>
    </>
  );
}

/** Quiz corto sobre márgenes. */
export function MarginQuiz() {
  const tenant = useTenant();
  usePageMeta(
    `Quiz de márgenes | ${tenant.brand.name}`,
    'Tres preguntas para saber si estás calculando bien tu costo por pieza.',
    '/quiz-margen',
  );

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const score = marginQuiz.filter((q) => answers[q.id] === q.correct).length;
  const complete = Object.keys(answers).length === marginQuiz.length;

  return (
    <>
      <Section eyebrow="Quiz" title="¿Estás calculando bien tu margen?" lead="Tres preguntas. Al final te explico cada una.">
        <div className="max-w-2xl space-y-8">
          {marginQuiz.map((q, i) => (
            <fieldset key={q.id}>
              <legend className="font-medium text-foreground mb-4">
                {i + 1}. {q.q}
              </legend>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const picked = answers[q.id] === oi;
                  const isRight = revealed && oi === q.correct;
                  const isWrong = revealed && picked && oi !== q.correct;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={picked}
                      onClick={() => !revealed && setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`rounded-2xl border-2 px-5 py-3 text-left transition-all ${
                        isRight
                          ? 'border-foreground bg-surface font-medium'
                          : isWrong
                            ? 'border-border bg-surface line-through text-text-tertiary'
                            : picked
                              ? 'border-foreground bg-surface'
                              : 'border-border bg-surface hover:border-foreground/30'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {revealed && <p className="body-sm mt-3">{q.why}</p>}
            </fieldset>
          ))}

          {!revealed ? (
            <Button size="lg" disabled={!complete} onClick={() => setRevealed(true)}>
              Ver resultados
            </Button>
          ) : (
            <Card>
              <p className="headline-sm mb-2 tabular-nums">
                {score} de {marginQuiz.length}
              </p>
              <p className="body-sm">
                {score === marginQuiz.length
                  ? 'Tienes claro el reparto proporcional. Usa la calculadora para tus números reales.'
                  : 'El punto no es acertar, es que el costo se reparte según cuánto vale cada pieza. La calculadora lo hace por ti.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button to="/calculadora">Abrir la calculadora</Button>
                <Button variant="ghost" onClick={() => { setAnswers({}); setRevealed(false); }}>
                  Repetir
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}

/** Página de recursos para shoppers — captación B2B. */
export function ForShoppers() {
  const tenant = useTenant();
  usePageMeta(
    `Web para shoppers | ${tenant.brand.name}`,
    'Un sitio completo para tu negocio de personal shopping, listo para configurar.',
    '/web-para-shoppers',
  );

  const features = [
    ['Sitio completo', 'Home, proceso, números, preguntas y calculadora, ya escritos.'],
    ['Asistente de pedido', 'Tus clientas arman su pedido antes de agendar.'],
    ['Apartado por transferencia', 'Con tus datos bancarios y tus términos.'],
    ['Calculadora de costo real', 'Reparte comisión y envío de forma proporcional.'],
    ['Catálogo de lotes', 'Publica mercancía ya armada con precio cerrado.'],
    ['Tu marca y tus números', 'Comisión, mínimos y colores se configuran, no se programan.'],
  ];

  return (
    <>
      <Section eyebrow="Para shoppers" title="El mismo sitio, con tu nombre." lead="Configuras tu marca, tu comisión y tus mínimos. No escribes código.">
        <div className="flex flex-wrap gap-3">
          <Button href={`https://wa.me/${tenant.contact.whatsapp.replace(/\D/g, '')}`} size="lg">
            Quiero el mío
          </Button>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {features.map(([h, b]) => (
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

function L({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? 'font-medium text-foreground' : 'text-text-secondary'}>{k}</dt>
      <dd className={`tabular-nums ${strong ? 'font-semibold' : ''}`}>{v}</dd>
    </div>
  );
}

export { pieceCost };
