import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { useExchangeRate } from '../lib/exchange';
import { formatMoney } from '../lib/money';
import { usePageMeta } from '../lib/usePageMeta';
import { useOrderDraft, stepsFor, type StepId } from '../lib/orderDraft';
import { Button, Chip, OptionCard, Field, inputClass } from '../components/ui';

const YEARS = ['Menos de 1 año', '1 a 3 años', '3 a 5 años', '5+ años'];
const CHANNELS = ['Tienda física', 'Instagram', 'Facebook', 'TikTok', 'WhatsApp', 'Página web', 'Otro'];

export default function Book() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const nav = useNavigate();
  const { rate } = useExchangeRate(tenant);
  const { draft, patch, reset, toggle } = useOrderDraft();
  const [index, setIndex] = useState(0);

  usePageMeta(t('book.title'), t('book.description'), '/agendar');

  const steps = useMemo(() => stepsFor(draft), [draft]);
  const step: StepId = steps[Math.min(index, steps.length - 1)];
  const c = tenant.commerce;

  const budgetSource = (draft.budgetLocal ?? 0) / (rate || 1);
  const belowMinimum = draft.budgetLocal != null && budgetSource < c.minimumPurchase;

  const canContinue = (() => {
    switch (step) {
      case 'purchase_type':
        return !!draft.purchaseType;
      case 'experience':
        return !!draft.experience;
      case 'seller_context':
        return !!draft.years && draft.channels.length > 0 && !!draft.boughtUsaBefore;
      case 'budget':
        return !!draft.budgetLocal && draft.budgetLocal > 0;
      case 'categories':
        return draft.categories.length > 0;
      case 'contact':
        return draft.name.trim().length > 1 && draft.phone.trim().length >= 8;
      default:
        return true;
    }
  })();

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setIndex((i) => Math.max(i - 1, 0));

  // Elegir una opción única avanza sola: un toque menos por paso.
  const pick = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    patch({ [key]: value } as never);
    setTimeout(next, 180);
  };

  if (step === 'intro') {
    return (
      <div className="section-container max-w-2xl py-20 text-center">
        <p className="eyebrow mb-4">{t('nav.cta')}</p>
        <h1 className="headline-lg mb-5">{t('book.headline')}</h1>
        <p className="body-lg mb-10">{t('book.sub')}</p>
        <div className="grid gap-4 text-left mb-10">
          <StepIntro n={1} title={t('book.step1')} body={t('book.step1body')} />
          <StepIntro n={2} title={t('book.step2')} body={t('book.step2body')} dim />
        </div>
        <Button size="lg" onClick={next}>
          {t('book.start')}
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="section-container max-w-2xl py-12 sm:py-16">
        <Progress current={index} total={steps.length - 1} />

        {step === 'purchase_type' && (
          <StepShell title={t('book.q.type')}>
            <OptionCard
              title="Reventa"
              body="Quiero comprar mercancía para revender."
              active={draft.purchaseType === 'reventa'}
              onClick={() => pick('purchaseType', 'reventa')}
            />
            <OptionCard
              title="Uso personal"
              body="Quiero comprar algo para mí."
              active={draft.purchaseType === 'personal'}
              onClick={() => pick('purchaseType', 'personal')}
            />
          </StepShell>
        )}

        {step === 'experience' && (
          <StepShell title={t('book.q.experience')}>
            <OptionCard
              title="Ya vendo actualmente"
              body="Tengo experiencia vendiendo mercancía."
              active={draft.experience === 'vende'}
              onClick={() => pick('experience', 'vende')}
            />
            <OptionCard
              title="Es mi primera vez"
              body="Quiero empezar a revender."
              active={draft.experience === 'primera'}
              onClick={() => pick('experience', 'primera')}
            />
          </StepShell>
        )}

        {step === 'seller_context' && (
          <StepShell
            title={t('book.q.context')}
            lead="Esto nos sirve solo como referencia para entender mejor lo que ya vendes."
          >
            <fieldset>
              <legend className="text-sm font-medium mb-3">¿Cuántos años llevas vendiendo?</legend>
              <div className="flex flex-wrap gap-2">
                {YEARS.map((y) => (
                  <Chip key={y} active={draft.years === y} onClick={() => patch({ years: y })}>
                    {y}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-8">
              <legend className="text-sm font-medium mb-3">¿Dónde vendes?</legend>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((ch) => (
                  <Chip key={ch} active={draft.channels.includes(ch)} onClick={() => toggle('channels', ch)}>
                    {ch}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-8">
              <legend className="text-sm font-medium mb-3">
                ¿Has comprado en tiendas de {tenant.brand.sourcingCountry} antes?
              </legend>
              <div className="flex gap-2">
                {(['si', 'no'] as const).map((v) => (
                  <Chip
                    key={v}
                    active={draft.boughtUsaBefore === v}
                    onClick={() => patch({ boughtUsaBefore: v })}
                  >
                    {v === 'si' ? 'Sí' : 'No'}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </StepShell>
        )}

        {step === 'budget' && (
          <StepShell
            title={t('book.q.budget')}
            lead={`Este es tu presupuesto total de mercancía en ${c.localCurrency}.`}
          >
            <Field label={`Monto en ${c.localCurrency}`}>
              <input
                className={inputClass}
                inputMode="numeric"
                placeholder={`Monto en ${c.localCurrency}`}
                value={draft.budgetLocal ?? ''}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/\D/g, ''));
                  patch({ budgetLocal: Number.isFinite(n) && n > 0 ? n : undefined });
                }}
              />
            </Field>
            <div className="flex flex-wrap gap-2 mt-4">
              {c.budgetPresets.map((p) => (
                <Chip key={p} active={draft.budgetLocal === p} onClick={() => patch({ budgetLocal: p })}>
                  {formatMoney(p, c.localCurrency, tenant.locale, 0)}
                </Chip>
              ))}
            </div>
            {draft.budgetLocal ? (
              <div className="mt-6 space-y-1">
                <p className="body-sm">
                  Equivale aprox. a {formatMoney(budgetSource, c.sourceCurrency, tenant.locale, 0)}
                </p>
                <p className="text-xs text-text-tertiary">
                  Tipo de cambio de hoy: {rate.toFixed(2)} {c.localCurrency} por 1 {c.sourceCurrency}
                </p>
                {belowMinimum && (
                  <p role="alert" className="text-sm font-medium text-foreground mt-3">
                    La compra mínima es de ${c.minimumPurchase} {c.sourceCurrency}. Con este monto
                    quedas por debajo.
                  </p>
                )}
              </div>
            ) : null}
          </StepShell>
        )}

        {step === 'categories' && (
          <StepShell title={t('book.q.categories')} lead="Elige todas las que apliquen.">
            <div className="flex flex-wrap gap-2">
              {tenant.categories.map((cat) => (
                <Chip
                  key={cat.id}
                  active={draft.categories.includes(cat.id)}
                  onClick={() => toggle('categories', cat.id)}
                >
                  {cat.label}
                </Chip>
              ))}
            </div>
          </StepShell>
        )}

        {step === 'category_details' && (
          <StepShell title={t('book.q.details')} lead="Entre más claro llegue tu pedido, mejor rinde tu ventana.">
            <div className="space-y-5">
              <Field label="Marcas">
                <input className={inputClass} value={draft.brands} onChange={(e) => patch({ brands: e.target.value })} />
              </Field>
              <Field label="Tallas / modelos / medidas">
                <input className={inputClass} value={draft.sizes} onChange={(e) => patch({ sizes: e.target.value })} />
              </Field>
              <Field label="Colores / acabados">
                <input className={inputClass} value={draft.colors} onChange={(e) => patch({ colors: e.target.value })} />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 'priorities' && (
          <StepShell title={t('book.q.priorities')}>
            <div className="space-y-5">
              <Field label="Qué tiene prioridad">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={draft.priorities}
                  onChange={(e) => patch({ priorities: e.target.value })}
                />
              </Field>
              <Field label="Qué no quieres" hint="Es tan útil como decir qué sí.">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={draft.exclusions}
                  onChange={(e) => patch({ exclusions: e.target.value })}
                />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 'contact' && (
          <StepShell title={t('book.q.contact')}>
            <div className="space-y-5">
              <Field label="Nombre completo" required>
                <input className={inputClass} value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
              </Field>
              <Field label="Teléfono / WhatsApp" required>
                <input
                  className={inputClass}
                  inputMode="tel"
                  value={draft.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                />
              </Field>
              <Field label="Correo (opcional)">
                <input
                  className={inputClass}
                  inputMode="email"
                  value={draft.email}
                  onChange={(e) => patch({ email: e.target.value })}
                />
              </Field>
            </div>
          </StepShell>
        )}

        {step === 'recap' && (
          <StepShell title={t('book.q.recap')} lead="Revísalo antes de apartar. Puedes corregir cualquier paso.">
            <dl className="divide-y divide-border border-y border-border text-sm">
              <Recap k="Tipo de compra" v={draft.purchaseType === 'personal' ? 'Uso personal' : 'Reventa'} />
              {draft.experience && (
                <Recap k="Experiencia" v={draft.experience === 'vende' ? 'Ya vende' : 'Primera vez'} />
              )}
              {draft.years && <Recap k="Años vendiendo" v={draft.years} />}
              {draft.channels.length > 0 && <Recap k="Canales" v={draft.channels.join(', ')} />}
              <Recap
                k="Presupuesto"
                v={`${formatMoney(draft.budgetLocal ?? 0, c.localCurrency, tenant.locale, 0)} ≈ ${formatMoney(
                  budgetSource,
                  c.sourceCurrency,
                  tenant.locale,
                  0,
                )}`}
              />
              <Recap
                k="Categorías"
                v={draft.categories
                  .map((id) => tenant.categories.find((x) => x.id === id)?.label ?? id)
                  .join(', ')}
              />
              {draft.brands && <Recap k="Marcas" v={draft.brands} />}
              {draft.sizes && <Recap k="Tallas / medidas" v={draft.sizes} />}
              {draft.colors && <Recap k="Colores" v={draft.colors} />}
              {draft.priorities && <Recap k="Prioridades" v={draft.priorities} />}
              {draft.exclusions && <Recap k="Qué no quiere" v={draft.exclusions} />}
              <Recap k="Contacto" v={`${draft.name} · ${draft.phone}`} />
            </dl>
          </StepShell>
        )}

        <div className="mt-10 flex flex-wrap gap-4 text-xs text-text-tertiary">
          <button type="button" className="hover:text-foreground" onClick={() => setIndex(1)}>
            Cambiar tipo de compra
          </button>
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => {
              reset();
              setIndex(0);
            }}
          >
            Reiniciar pedido
          </button>
          <Link to="/" className="hover:text-foreground">
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="section-container max-w-2xl flex items-center justify-between gap-4 py-4">
          <Button variant="ghost" onClick={back}>
            ← Atrás
          </Button>
          {step === 'recap' ? (
            <Button size="lg" onClick={() => nav('/transferencia')}>
              Apartar mi cita
            </Button>
          ) : (
            <Button size="lg" onClick={next} disabled={!canContinue}>
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepShell({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="headline-md mb-3">{title}</h1>
      {lead && <p className="body-sm mb-8">{lead}</p>}
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function StepIntro({ n, title, body, dim }: { n: number; title: string; body: string; dim?: boolean }) {
  return (
    <div className={`card ${dim ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-bold">
          {n}
        </span>
        <h2 className="headline-sm">{title}</h2>
      </div>
      <p className="body-sm ml-10">{body}</p>
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / Math.max(total, 1)) * 100);
  return (
    <div className="mb-10">
      <div
        className="h-1 w-full rounded-full bg-border overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del pedido"
      >
        <div className="h-full bg-foreground transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-text-tertiary">
        Paso {current} de {total}
      </p>
    </div>
  );
}

function Recap({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4 py-3">
      <dt className="w-40 shrink-0 text-text-secondary">{k}</dt>
      <dd className="text-foreground">{v}</dd>
    </div>
  );
}
