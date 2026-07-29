# Diseño técnico — persistencia de pedidos

## Decisión 1: el pedido se envía por Edge Function, no por INSERT anónimo

**Alternativa descartada:** dar a `anon` una política `INSERT` sobre `orders` y
`customers` y escribir directo desde el navegador.

**Por qué no:** la clave anónima de Supabase es pública por diseño — está en el
bundle. Una política de inserción anónima es un endpoint de escritura abierto a
internet. Sin servidor de por medio no hay dónde poner límite de tasa, ni
validar que el `tenant_id` corresponda al dominio que hizo la petición, ni
impedir que alguien infle la tabla con miles de filas.

**Decisión:** una Edge Function `submit-order` con `service_role`. Valida el
payload, resuelve el `tenant_id` a partir del `Origin` de la petición (no del
cuerpo, que el cliente controla), aplica límite por IP y devuelve el token.

`anon` conserva únicamente lectura de configuración pública y lotes publicados.

## Decisión 2: el `tenant_id` sale del `Origin`, nunca del cuerpo

Si el cliente enviara `tenant_id`, cualquiera podría inyectar pedidos en el
tenant de otra shopper. La función toma el `Origin` de la cabecera, lo busca en
`tenant_domains` con `verified_at not null`, y usa ese tenant. Un `Origin` sin
tenant verificado se rechaza con 403.

## Decisión 3: idempotencia con clave generada en el cliente

El asistente genera un `submission_id` (UUID) la primera vez que la clienta pulsa
"Apartar mi cita", y lo conserva en el borrador. Si la red falla y reintenta, la
función encuentra el mismo `submission_id` y devuelve el pedido existente en vez
de crear uno nuevo.

Esto evita el caso clásico: la clienta pulsa dos veces porque no vio respuesta, y
la shopper recibe dos pedidos idénticos.

## Decisión 4: el borrador local sobrevive hasta la confirmación

`localStorage` se limpia **después** de que el servidor responde con éxito, no
antes de enviar. Si el envío falla, la clienta ve el error con su pedido intacto
y un botón de reintento.

## Decisión 5: el prerender usa el tenant sembrado

El build corre en CI sin credenciales de producción. `resolveTenant` acepta una
fuente inyectada: en el navegador consulta Supabase con caché; en el prerender
usa `src/config/tenants.ts`.

Consecuencia aceptada: el HTML prerenderizado lleva la marca del tenant sembrado
y se corrige al hidratar. Para dominios de producción, el despliegue genera un
prerender por tenant a partir de un volcado de `tenants` — se resuelve en un
cambio posterior, no en este.

## Decisión 6: la tasa se congela al enviar, no al mostrar

`orders.exchange_rate` guarda la tasa que la clienta tenía en pantalla en el
momento de confirmar el resumen. Todos los cálculos posteriores —desglose en
`/transferencia`, total en caja— usan esa tasa guardada, no la vigente.

## Contrato de `submit-order`

```
POST /functions/v1/submit-order
Headers: Origin, Content-Type: application/json

Body:
{
  "submission_id": "uuid",
  "customer":  { "name": string, "phone": string, "email": string | null },
  "order": {
    "purchase_type": "reventa" | "personal",
    "experience":    "vende" | "primera" | null,
    "seller_context": { "years": string?, "channels": string[], "bought_before": "si"|"no"? },
    "budget_local":   number,
    "categories":     string[],
    "details":        { "brands": string?, "sizes": string?, "colors": string?,
                        "priorities": string?, "exclusions": string? },
    "exchange_rate":  number
  }
}

200 { "public_token": string, "order_id": uuid, "created": boolean }
400 { "error": "invalid_payload", "fields": string[] }
403 { "error": "unknown_origin" }
429 { "error": "rate_limited", "retry_after": number }
```

`created: false` indica que el `submission_id` ya existía — reintento, no duplicado.

## Validación en el servidor

- `name`: 2–120 caracteres tras recortar espacios
- `phone`: 8–20 caracteres, solo dígitos y `+ - ( ) espacio`
- `email`: opcional; si viene, formato válido
- `budget_local`: número finito, mayor que cero, menor que 100× la compra mínima
  del tenant convertida a moneda local
- `categories`: subconjunto de las categorías configuradas del tenant
- Campos de texto libre: máximo 2,000 caracteres cada uno
- `exchange_rate`: se ignora si difiere más de 20 % de la tasa vigente del
  servidor; en ese caso se usa la del servidor

El cliente valida para dar buena experiencia; el servidor valida porque es el
único que cuenta.

## Políticas RLS a añadir

```sql
-- El cliente anónimo no escribe pedidos: solo la Edge Function con service_role.
-- No se añade ninguna política INSERT para anon.

-- Lectura de un pedido por token: tampoco es política, es la función
-- `order-by-token`, que valida el token y devuelve una proyección — nunca la
-- fila completa ni columnas internas.

create index if not exists orders_submission_idx
  on orders ((details->>'submission_id'));
```

## Límite de tasa

Tabla ligera en Postgres, no memoria de la función (las Edge Functions no
comparten estado entre invocaciones):

```sql
create table if not exists submit_rate_limit (
  ip_hash    text not null,
  window_at  timestamptz not null,
  count      int not null default 1,
  primary key (ip_hash, window_at)
);
```

Ventana de 10 minutos, máximo 5 envíos por IP. El hash es SHA-256 de la IP con
una sal del entorno — no se almacena la IP en claro.
