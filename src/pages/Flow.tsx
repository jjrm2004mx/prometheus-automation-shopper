import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { usePageMeta } from '../lib/usePageMeta';
import { useExchangeRate } from '../lib/exchange';
import { formatMoney } from '../lib/money';
import { Button, Card, Field, inputClass, Section } from '../components/ui';
import { whatsappUrl } from '../components/Layout';
import { prepSections, mexicanStates } from '../content/data';

/** Paso 2 de 2: apartado por transferencia local. */
export function Transfer() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const { rate } = useExchangeRate(tenant);
  const c = tenant.commerce;
  const [declared, setDeclared] = useState(false);
  usePageMeta(t('transfer.title'), t('transfer.description'), '/transferencia');

  const concept = tenant.bank.conceptTemplate.replace('{nombre}', 'TU NOMBRE');

  return (
    <Section eyebrow="Paso 2 de 2" title={t('transfer.headline')} lead={t('transfer.sub', { source: c.sourceCurrency })}>
      <div className="grid gap-6 lg:grid-cols-2 max-w-4xl">
        <Card>
          <p className="eyebrow mb-2">Reserva de cita</p>
          <p className="headline-md tabular-nums">
            {formatMoney(c.depositAmount, c.localCurrency, tenant.locale, 0)}
          </p>
          <p className="body-sm mt-2">
            Aproximado: {formatMoney(c.depositAmount / (rate || 1), c.sourceCurrency, tenant.locale)} ·
            Tipo de cambio: {rate.toFixed(2)}
          </p>

          <div className="mt-6 pt-6 border-t border-border space-y-2">
            <p className="text-sm font-medium">{t('transfer.termsTitle')}</p>
            <p className="body-sm">{t('transfer.termsKept')}</p>
            <p className="body-sm">{t('transfer.termsLost')}</p>
          </div>
        </Card>

        <Card>
          <dl className="space-y-4 text-sm">
            <B k="Beneficiario" v={tenant.bank.beneficiary} />
            <B k="Banco" v={tenant.bank.bankName} />
            <B k={tenant.bank.accountLabel} v={tenant.bank.accountNumber} mono />
            <B k="Concepto" v={concept} mono />
          </dl>
          <ul className="mt-6 pt-6 border-t border-border space-y-1.5 body-sm">
            <li>Puedes hacerla desde tu celular, como cualquier transferencia local.</li>
            <li>No necesitas enviar {c.sourceCurrency}.</li>
            <li>No necesitas ir al banco si ya tienes banca móvil.</li>
          </ul>
        </Card>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => setDeclared(true)} disabled={declared}>
          {declared ? 'Aviso registrado' : t('transfer.done')}
        </Button>
        <Button
          href={whatsappUrl(tenant.contact.whatsapp, 'Hola, ya hice mi transferencia de apartado.')}
          variant="outline"
          size="lg"
        >
          Contactar por WhatsApp
        </Button>
      </div>
      {declared && (
        <p role="status" className="body-sm mt-4 max-w-xl">
          Recibimos tu aviso. En cuanto se confirme la transferencia te enviamos el acceso para
          elegir tu horario.
        </p>
      )}
    </Section>
  );
}

/** El calendario no existe hasta que el pago está validado. */
export function Reserve() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  usePageMeta(`Reservar horario | ${tenant.brand.name}`, t('reserve.lockedBody'), '/reservar');

  return (
    <Section>
      <Card className="max-w-xl text-center">
        <p className="text-3xl mb-4" aria-hidden>
          🔒
        </p>
        <h1 className="headline-sm mb-3">{t('reserve.locked')}</h1>
        <p className="body-sm mb-8">{t('reserve.lockedBody')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/transferencia">Volver a transferencia</Button>
          <Button
            href={whatsappUrl(tenant.contact.whatsapp, 'Hola, ya transferí mi apartado.')}
            variant="outline"
          >
            {t('cta.whatsapp')}
          </Button>
        </div>
      </Card>
    </Section>
  );
}

/** Checklist bloqueante: no se avanza sin revisar las seis secciones. */
export function Prep() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const [done, setDone] = useState<string[]>([]);
  usePageMeta(t('prep.title'), t('prep.description'), '/antes-de-tu-cita');

  const total = prepSections.length;
  const complete = done.length === total;

  return (
    <Section eyebrow="✓ Cita reservada" title={t('prep.headline')} lead={t('prep.sub')}>
      <p className="body-sm mb-8 tabular-nums" role="status">
        {done.length} de {total} revisados
      </p>

      <div className="grid gap-4 max-w-3xl">
        {prepSections.map((s) => {
          const isDone = done.includes(s.id);
          return (
            <Card key={s.id} className={isDone ? 'opacity-70' : ''}>
              <h2 className="headline-sm mb-3">{s.title}</h2>
              <ul className="space-y-1.5 body-sm list-disc pl-5">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="mt-5">
                <Button
                  variant={isDone ? 'ghost' : 'outline'}
                  onClick={() => setDone((d) => (d.includes(s.id) ? d : [...d, s.id]))}
                >
                  {isDone ? '✓ Revisado' : 'Entendido'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-10">
        <Button size="lg" to={complete ? '/envio' : undefined} disabled={!complete}>
          Continuar
        </Button>
        {!complete && (
          <p className="body-sm mt-3" role="status">
            {t('prep.blocked')}
          </p>
        )}
      </div>
    </Section>
  );
}

/** Datos de entrega + transferencia final. */
export function Shipping() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [kind, setKind] = useState<'domicilio' | 'sucursal'>('domicilio');
  usePageMeta(t('shipping.title'), t('shipping.description'), '/envio');

  const required = ['receptor', 'telefono', 'calle', 'colonia', 'ciudad', 'estado', 'cp'];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const missing = required.filter((k) => !String(fd.get(k) ?? '').trim());
    setErrors(missing);
    if (missing.length === 0) setSent(true);
  };

  if (sent) {
    return (
      <Section eyebrow="Envío" title="Datos recibidos.">
        <Card className="max-w-xl">
          <p className="body-sm">
            Confirmamos tu dirección. Cuando el pedido esté empacado te confirmamos el costo exacto
            de envío y te mandamos tu número de rastreo.
          </p>
          <div className="mt-6">
            <Button to="/">Volver al inicio</Button>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <Section eyebrow="Envío" title={t('shipping.headline')} lead={t('shipping.sub')}>
      <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-5">
        <fieldset>
          <legend className="text-sm font-medium mb-3">Tipo de entrega</legend>
          <div className="flex gap-2">
            {(['domicilio', 'sucursal'] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={`chip ${kind === k ? 'chip-active' : 'chip-idle'}`}
              >
                {k === 'domicilio' ? 'Domicilio' : 'Sucursal / punto de entrega'}
              </button>
            ))}
          </div>
        </fieldset>

        <Field label="Nombre completo de quien recibe" required>
          <input name="receptor" className={inputClass} />
        </Field>
        <Field label="Teléfono" required>
          <input name="telefono" inputMode="tel" className={inputClass} />
        </Field>
        <Field label="Calle y número" required>
          <input name="calle" className={inputClass} />
        </Field>
        <Field label="Interior (opcional)">
          <input name="interior" className={inputClass} />
        </Field>
        <Field label="Colonia" required>
          <input name="colonia" className={inputClass} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ciudad / Municipio" required>
            <input name="ciudad" className={inputClass} />
          </Field>
          <Field label="Estado" required>
            <select name="estado" className={inputClass} defaultValue="">
              <option value="">Seleccionar</option>
              {mexicanStates.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Código postal" required>
          <input name="cp" inputMode="numeric" className={inputClass} />
        </Field>
        <Field label="Referencias del lugar">
          <textarea name="referencias" rows={3} className={inputClass} />
        </Field>

        {errors.length > 0 && (
          <p role="alert" className="text-sm font-medium text-foreground">
            Faltan {errors.length} campos obligatorios.
          </p>
        )}

        <Button type="submit" size="lg">
          Continuar
        </Button>
      </form>
    </Section>
  );
}

export function NotFound() {
  usePageMeta('Página no encontrada', 'La página que buscas no existe.', '/404');
  return (
    <Section title="Esta página no existe.">
      <Link to="/" className="underline">
        Volver al inicio
      </Link>
    </Section>
  );
}

function B({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-text-tertiary text-xs uppercase tracking-wide">{k}</dt>
      <dd className={`text-foreground ${mono ? 'font-mono text-base' : ''}`}>{v}</dd>
    </div>
  );
}
