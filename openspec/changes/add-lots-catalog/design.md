# Diseño técnico — catálogo de lotes

## Decisión 1: el apartado es una actualización condicional, no una transacción del cliente

**El problema:** dos clientas abren el mismo lote. Ambas ven "disponible". Ambas
pulsan apartar. Si el código lee el estado, comprueba que está publicado y luego
escribe, hay una ventana entre la lectura y la escritura donde las dos pasan la
comprobación.

**La solución:** una sola sentencia que solo afecta filas que siguen disponibles.

```sql
update lots
   set status = 'reserved',
       reserved_by = $customer_id,
       reserved_at = now()
 where id = $lot_id
   and tenant_id = $tenant_id
   and status = 'published'
returning id;
```

Si devuelve una fila, esa clienta ganó. Si devuelve cero, alguien se adelantó.
No hay estado intermedio posible: Postgres serializa las escrituras sobre la
misma fila.

Requiere añadir la columna `reserved_at`, que el esquema actual no tiene.

## Decisión 2: apartar pasa por Edge Function

Igual que el envío de pedidos: `anon` no escribe. La función `reserve-lot`
resuelve el tenant por `Origin`, crea o reutiliza la clienta por teléfono, y
ejecuta la actualización condicional con `service_role`.

Devuelve `{ reserved: true, token }` o `{ reserved: false, reason: 'taken' }`.

## Decisión 3: dos formas de llegar a un lote

| Ruta | Qué muestra | Quién entra |
|---|---|---|
| `/lotes/:slug` | Solo lotes con `status = 'published'` | Cualquiera, por RLS pública |
| `/lote/:token` | Cualquier lote, sea cual sea su estado | Quien tenga el enlace |

El segundo existe porque la shopper arma un lote pensando en una clienta concreta
y quiere enseñárselo antes de publicarlo. Pasa por la función `lot-by-token`,
que valida el token y devuelve la proyección — no por RLS, porque un token no
debe convertirse en llave de tabla.

El token vive en `generated_links`, no como columna de `lots`: así se puede
revocar, caducar y auditar quién lo abrió sin tocar el lote.

## Decisión 4: el precio del lote es cerrado

`lots.price_local` es el precio final en moneda local: mercancía, comisión, envío
estimado y empaque, todo dentro. No se recalcula con la tasa del día ni se le
suma la comisión del tenant.

Esto es deliberado y contradice a propósito la lógica de la ventana de compra.
Un lote es un producto, no un servicio: si su precio se moviera con el tipo de
cambio, la promesa de "precio todo incluido" dejaría de ser cierta entre que la
clienta lo ve y lo aparta.

## Decisión 5: estados de carga con final garantizado

Toda consulta de lotes SHALL resolver a uno de cuatro estados terminales:
`cargando` solo es transitorio y tiene tiempo límite.

```
cargando ──(datos, n>0)──> lista
         ──(datos, n=0)──> vacío
         ──(error o 8s)──> error con reintento
```

Esto está escrito como requisito porque el sitio de referencia dejaba
`/usa-drops` en "Loading…" indefinidamente. Un estado de carga sin salida es
peor que un error: el error al menos dice qué pasó.

## Decisión 6: media servida con transformación

Las imágenes viven en el bucket `lot-inventory`. Se piden con transformación de
ancho para no mandar el original:

- Portada de la lista: 640 px de ancho
- Galería del detalle: 1280 px de ancho
- `loading="lazy"` en todo lo que no sea la primera imagen

El campo `media` es un arreglo JSON:

```json
[
  { "type": "image", "path": "lote-014/01.jpg", "alt": "Vista general del lote" },
  { "type": "video", "path": "lote-014/video.mp4", "poster": "lote-014/01.jpg" }
]
```

`alt` es obligatorio en imágenes. Un lote sin texto alternativo no se publica.

## Decisión 7: el detalle no se prerenderiza

Las rutas con parámetro quedan fuera del prerender del build: los lotes rotan en
días y regenerar el sitio por cada uno no compensa. La lista `/lotes` sí se
prerenderiza, con su explicación del proceso y lo que incluye el precio — que es
el contenido que importa para búsqueda.

Para que compartir un lote por WhatsApp muestre una tarjeta decente, el detalle
escribe sus metadatos al montar. Los rastreadores que no ejecutan JavaScript
verán los metadatos genéricos del sitio; se acepta.

## Migración necesaria

```sql
alter table lots
  add column if not exists reserved_at timestamptz,
  add column if not exists sort_order  int not null default 0,
  add column if not exists published_at timestamptz;

create index if not exists lots_public_idx
  on lots (tenant_id, status, sort_order, published_at desc);

-- El texto alternativo es obligatorio en las imágenes de un lote publicado.
alter table lots add constraint lots_media_alt_required check (
  status <> 'published'
  or not exists (
    select 1 from jsonb_array_elements(media) m
    where m->>'type' = 'image' and coalesce(m->>'alt', '') = ''
  )
);
```

> La restricción con subconsulta no es válida en un `CHECK` de Postgres. Se
> implementa como trigger `before insert or update` que levanta excepción. Se
> deja anotado aquí para que quien implemente no intente el `CHECK` literal.
