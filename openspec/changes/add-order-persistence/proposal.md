# Persistir pedidos y cargar tenants desde Supabase

## Why

El asistente de `/agendar` recorre sus 10 pasos, arma un pedido completo con
contacto, presupuesto, categorías y prioridades — y lo deja en `localStorage`.
Ningún lead llega a la shopper. Mientras eso no cambie, el resto de la
plataforma no tiene con qué operar: no hay pedido que apartar, ni cita que
agendar, ni envío que capturar.

Al mismo tiempo, los tenants viven en un archivo TypeScript (`src/config/tenants.ts`)
que se compila. Dar de alta una shopper hoy exige un despliegue, lo que
contradice el requisito central de `tenant-configuration`: *"su sitio queda
operativo sin modificar ni una línea de código y sin un despliegue nuevo"*.

Ambos problemas se resuelven con la misma pieza: conectar Supabase.

## What Changes

- **Cliente de Supabase** configurado por variables de entorno, con degradación
  a la configuración sembrada cuando no hay conexión.
- **Tenants desde la base**: `tenants` + `tenant_domains` se consultan al
  resolver el host. El archivo sembrado pasa a ser respaldo de desarrollo y
  fuente del prerender.
- **Envío del pedido**: el paso `recap` deja de ser un callejón sin salida.
  Escribe `customers` y `orders` a través de una Edge Function `submit-order`,
  y redirige a `/transferencia` con el token del pedido.
- **Token de pedido**: la clienta recibe una URL con su token para volver a ver
  su pedido, y `/transferencia` deja de ser una página genérica — muestra el
  monto y el concepto de *su* apartado.
- **Tasa congelada**: el pedido guarda el tipo de cambio con el que la clienta
  vio sus números.
- **Aviso de transferencia**: el botón "Ya transferí" registra un `payments` de
  tipo `deposit` con `declared_at`, en lugar de solo cambiar el estado visual.

## Impact

| Capacidad | Efecto |
|---|---|
| `order-intake` | Requisito modificado (cierre del intake) + 4 requisitos nuevos |
| `tenant-configuration` | Requisito nuevo: origen de la configuración |
| `booking-and-deposit` | Requisito modificado: el apartado se liga a un pedido |

Código afectado: `src/lib/tenant.tsx`, `src/lib/exchange.ts`, `src/pages/Book.tsx`,
`src/pages/Flow.tsx`, `scripts/prerender.mjs`. Nuevo: `src/lib/supabase.ts`,
`src/lib/orders.ts`, `supabase/functions/submit-order/`.

Sin cambios de esquema: `supabase/schema.sql` ya contempla estas tablas.
Sí se añaden políticas RLS y una función de reserva de token.

## Riesgos

- **Spam de formularios.** Un endpoint anónimo que escribe filas es un imán.
  Mitigado con Edge Function (no INSERT anónimo directo), límite por IP y
  validación de payload en el servidor.
- **Pérdida de leads por fallo de red.** El borrador local no se borra hasta que
  el servidor confirma. Si falla, la clienta puede reintentar sin recapturar.
- **Prerender sin base.** El build corre sin credenciales de producción; por eso
  el prerender usa el tenant sembrado y no la base.
