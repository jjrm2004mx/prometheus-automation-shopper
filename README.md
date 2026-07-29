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
   JavaScript. Hoy el build entrega ~226 KB (~71 KB gzip).
3. **Un solo tipo de cambio vigente**, y congelado en cada pedido.
4. **El zoom del usuario nunca se bloquea.**
5. **El aislamiento entre shoppers se resuelve con RLS**, no ocultando pantallas.

## Qué falta

- Consola de la shopper (alta, configuración, pedidos)
- Persistencia de pedidos contra Supabase — hoy el asistente termina en local
- Calendario de citas
- Inventario de lotes
- Notificaciones
