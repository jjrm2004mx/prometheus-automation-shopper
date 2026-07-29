# Catálogo de lotes funcional

## Why

`/lotes` hoy es una cáscara: explica el proceso, lista lo que incluye el precio,
y termina en un estado vacío fijo con un botón de WhatsApp. No consulta nada. La
tabla `lots` existe con su política de lectura pública, y la capacidad
`lots-catalog` está especificada — pero nada las conecta.

Para la shopper, los lotes son la vía de venta que no consume una ventana de
compra: mercancía ya armada, precio cerrado, sin cita y sin videollamada. Es el
único ingreso de la plataforma que no depende de su tiempo. Dejarlo sin
implementar significa que cada venta cuesta una hora de atención en vivo.

## What Changes

- **Catálogo real** en `/lotes`: consulta los lotes publicados del tenant y los
  muestra con foto de portada, título, resumen y precio.
- **Detalle** en `/lotes/:slug`: galería de media, contenido del lote, precio con
  desglose de lo incluido, y acción de apartado.
- **Enlace privado** en `/lote/:token`: permite a la shopper compartir un lote
  específico —incluso no publicado— con una clienta por WhatsApp.
- **Apartado atómico**: el primer apartado gana. La transición de `published` a
  `reserved` es una actualización condicional, no una lectura seguida de una
  escritura.
- **Estados explícitos**: cargando, vacío, error y agotado. Cada uno con su
  mensaje. Ninguna pantalla se queda en "Cargando…" para siempre.
- **Metadatos por lote**: cada detalle emite su propio título, descripción e
  imagen para que compartirlo por WhatsApp muestre una tarjeta con la mercancía.

## What Does NOT Change

Este cambio no toca el flujo de ventana de compra. Un lote no genera cita, no
pasa por el asistente de pedido y no consume el apartado de $500. Es una compra
cerrada, y así debe quedar en el código: `orders` no se involucra.

## Impact

| Capacidad | Efecto |
|---|---|
| `lots-catalog` | 3 requisitos modificados + 5 nuevos |
| `platform-foundations` | 1 requisito nuevo: estados de carga que terminan |

Código nuevo: `src/lib/lots.ts`, `src/pages/Lots.tsx` (sustituye al componente
estático en `Static.tsx`), `src/pages/LotDetail.tsx`,
`supabase/functions/reserve-lot/`, `supabase/functions/lot-by-token/`.

Depende de: `add-order-persistence` (cliente de Supabase y tenants desde la base).
No empezar hasta que ese cambio esté archivado.

## Riesgos

- **Doble apartado.** Dos clientas pulsando a la vez sobre el último lote. Se
  resuelve con actualización condicional en la base; si el `UPDATE` no afecta
  ninguna fila, la segunda clienta ve "ya lo apartaron".
- **Fotos pesadas.** Un lote con 15 imágenes sin optimizar arruina la carga en
  4G. Se sirven por el transformador de imágenes de Supabase Storage con ancho
  acotado.
- **SEO del detalle.** Las rutas dinámicas no se prerenderizan en el build. Se
  acepta y se documenta; los lotes rotan demasiado rápido para justificar
  regenerar el sitio con cada uno.
