import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useTenant } from '../lib/tenant';
import { createCopy } from '../content/copy';
import { Button } from './ui';

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function Header() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/como-funciona', label: t('nav.process') },
    { to: '/numeros', label: t('nav.numbers') },
    ...(tenant.features.lots ? [{ to: '/lotes', label: t('nav.lots') }] : []),
    { to: '/preguntas', label: t('nav.faq') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="section-container flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          {tenant.brand.shortName}
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Principal">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'text-foreground' : 'text-text-secondary hover:text-foreground'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Button to="/agendar">{t('nav.cta')}</Button>
          </div>
          <button
            type="button"
            className="lg:hidden rounded-full border border-border px-4 py-2 text-sm"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {t('nav.menu')}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-movil" className="lg:hidden border-t border-border bg-background">
          <nav className="section-container py-4 flex flex-col gap-3" aria-label="Principal móvil">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-1 text-base">
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <Button to="/agendar" size="lg">
                {t('nav.cta')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const tenant = useTenant();
  const t = createCopy(tenant);
  const f = tenant.features;

  // El pie es también el mapa del sitio: cada ruta pública debe ser alcanzable
  // con un enlace real, no solo existir en el router.
  const columns: Array<{ title: string; links: Array<[string, string]> }> = [
    {
      title: 'El servicio',
      links: [
        ['/como-funciona', t('nav.process')],
        ['/lo-que-veras', 'Lo que verás'],
        ['/sobre', 'Sobre nosotros'],
        ['/galeria', 'Galería'],
        ['/testimonios', 'Testimonios'],
      ],
    },
    {
      title: 'Números',
      links: [
        ['/numeros', t('nav.numbers')],
        ['/precios', 'Precios'],
        ...(f.calculator
          ? ([
              ['/calculadora', 'Calculadora de costo'],
              ['/ganancia-por-pieza', 'Ganancia por pieza'],
              ['/inversion-y-ganancia', 'Inversión y ganancia'],
              ['/compra-dolar', 'Conversión de moneda'],
              ['/quiz-margen', 'Quiz de márgenes'],
            ] as Array<[string, string]>)
          : []),
        ['/tabulador-tallas-zapatos', 'Tallas de calzado'],
      ],
    },
    {
      title: 'Tu compra',
      links: [
        ['/agendar', t('nav.cta')],
        ...(f.orderDraft ? ([['/tu-pedido', 'Armar mi pedido']] as Array<[string, string]>) : []),
        ['/pedidos', 'Estados del pedido'],
        ['/paqueteria', 'Paquetería'],
        ['/preguntas', t('nav.faq')],
        ['/preguntar', 'Preguntar'],
      ],
    },
    {
      title: 'Más',
      links: [
        ...(f.lots ? ([['/lotes', t('nav.lots')]] as Array<[string, string]>) : []),
        ...(f.school ? ([['/school', 'Escuela']] as Array<[string, string]>) : []),
        ...(f.drops ? ([['/drops', 'Ready-to-ship drops']] as Array<[string, string]>) : []),
        ['/web-para-shoppers', 'Web para shoppers'],
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="section-container py-14">
        <nav aria-label="Mapa del sitio" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow mb-4">{col.title}</h2>
              <ul className="space-y-2.5">
                {col.links.map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className="text-sm text-text-secondary hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border pt-8">
          <p className="text-sm text-text-tertiary">{t('footer.rights')}</p>
          <a
            href={whatsappUrl(tenant.contact.whatsapp, tenant.contact.whatsappMessage)}
            className="text-sm text-text-secondary hover:text-foreground"
          >
            {t('cta.whatsapp')}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
