# Plataforma para personal shoppers

Producto multi-tenant: una base de código, N shoppers, cada una con su dominio,
su marca y sus parámetros comerciales.

## Arrancar

```bash
npm install
npm run dev            # http://localhost:5173
```

## Build con prerender

```bash
npm run build
npm run prerender      # escribe un index.html por ruta pública
```

En contenedores con Chromium ya instalado:

```bash
CHROMIUM_PATH=/ruta/a/chrome npm run prerender
```

El prerender **falla el build** si alguna ruta pública queda sin contenido. Esa
es la garantía de que el sitio es indexable.

## Cómo se configura una shopper

Todo lo que distingue a un negocio de otro vive en un objeto de configuración
(`src/config/schema.ts`). Ningún componente escribe un valor de negocio literal.

```ts
{
  slug: 'nombre',
  domains: ['sudominio.com'],
  brand:    { name, shortName, hostName, sourcingCity, ... },
  commerce: { commissionRate: 0.20, minimumPurchase: 500, depositAmount: 500, ... },
  exchange: { mode: 'live' | 'manual', manualRate, spread },
  bank:     { beneficiary, bankName, accountNumber, accountLabel, conceptTemplate },
  categories: [...],
  theme:    { background, foreground, primary, radius, ... },
  features: { lots, calculator, school, drops, orderDraft },
  content:  { 'home.headline': 'Texto propio' }   // sobrescribe cualquier clave
}
```

En desarrollo los tenants viven en `src/config/tenants.ts`. En producción se
leen de la tabla `tenants` — el shape es idéntico, el resto de la app no cambia.

Previsualizar un tenant sin su dominio: `?tenant=<slug>`.

## Estructura

```
src/
├── config/      esquema de tenant y tenants sembrados
├── content/     copy con claves e interpolación, contenido estructurado
├── lib/         tenant, tipo de cambio, dinero, tema, borrador de pedido
├── components/  layout y primitivas de UI
└── pages/       rutas públicas y flujo de cliente
supabase/
└── schema.sql   tablas, RLS por tenant y utilidades
scripts/
└── prerender.mjs
openspec/        la especificación — leer antes de tocar código
```

## Decisiones que no son negociables

Están escritas como requisitos en `openspec/specs/platform-foundations/spec.md`
porque son los errores que se están corrigiendo del sitio que originó el
producto:

1. **Cada ruta pública se sirve con su contenido dentro del HTML.** Una SPA que
   responde un body vacío no existe para los buscadores.
2. **El sitio público no arrastra la consola.** Presupuesto: menos de 500 KB de
   JavaScript. Hoy el build entrega ~272 KB (~85 KB gzip) con las 28 rutas.
3. **Un solo tipo de cambio vigente**, y congelado en cada pedido.
4. **El zoom del usuario nunca se bloquea.**
5. **El aislamiento entre shoppers se resuelve con RLS**, no ocultando pantallas.

## Rutas públicas (28, todas prerenderizadas)

**Marketing** — `/` · `/como-funciona` · `/lo-que-veras` · `/numeros` · `/precios` ·
`/preguntas` · `/sobre` · `/galeria` · `/testimonios` · `/paqueteria` · `/pedidos` ·
`/preguntar` · `/web-para-shoppers` · `/tiktok`

**Flujo de cliente** — `/agendar` · `/tu-pedido` · `/transferencia` · `/reservar` ·
`/confirmado` · `/antes-de-tu-cita` · `/envio`

**Herramientas** — `/calculadora` · `/ganancia-por-pieza` · `/inversion-y-ganancia` ·
`/compra-dolar` · `/quiz-margen` · `/tabulador-tallas-zapatos`

**Líneas de negocio** — `/lotes` · `/school` · `/drops` (+ `/drops/:slug` y su checkout)

Cada una se activa por bandera de tenant: una shopper sin escuela ni drops no
registra esas rutas ni las muestra en el pie.

El `sitemap.xml` y el `robots.txt` se generan de la misma lista que se
prerenderiza, así que no pueden desincronizarse de lo que existe.

## Imágenes

Las ilustraciones son SVG en `src/components/Art.tsx`, no fotos. Heredan los
tokens de tema, así que un tenant con otra paleta las obtiene en su color. Están
pensadas como marcador: cada shopper sube su media real desde la consola.

## Qué falta

- Consola de la shopper (alta, configuración, pedidos)
- Persistencia de pedidos contra Supabase — hoy el asistente termina en local
- Calendario de citas
- Catálogo de lotes con datos reales (hoy es la explicación + estado vacío)
- Checkout real de drops (hoy declara que el pago no está conectado)
- Notificaciones

Los dos primeros tienen propuesta OpenSpec escrita en `openspec/changes/`.
