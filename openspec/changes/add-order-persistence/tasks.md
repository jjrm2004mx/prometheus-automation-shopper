# Tareas — persistencia de pedidos

## 1. Infraestructura

- [ ] Crear proyecto en Supabase y guardar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y
      `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Añadir `.env.example` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
      (nunca la service role en el cliente)
- [ ] Confirmar que `.env` está en `.gitignore`
- [ ] Ejecutar `supabase/schema.sql` contra el proyecto
- [ ] Crear migración `supabase/migrations/0002_order_submission.sql` con la
      tabla `submit_rate_limit` y el índice `orders_submission_idx`
- [ ] Sembrar un tenant real en `tenants` y su dominio en `tenant_domains` con
      `verified_at` puesto
- [ ] Verificar con la clave anónima que `orders`, `customers` y `payments` no
      devuelven filas ni aceptan inserciones

## 2. Cliente de Supabase

- [ ] `src/lib/supabase.ts`: cliente único, creado solo si hay variables de entorno
- [ ] Exportar un indicador `hasBackend` para que el resto del código degrade
- [ ] No crear el cliente durante el prerender

## 3. Tenants desde la base

- [ ] `src/lib/tenantSource.ts`: consulta de tenant por hostname contra
      `tenant_domains` + `tenants`, con caché en memoria y en `sessionStorage`
- [ ] `resolveTenant` acepta la fuente por parámetro: base en el navegador,
      sembrado en el prerender
- [ ] Degradar a caché y luego a sembrado cuando la consulta falla
- [ ] Filtrar tenants con `status <> 'active'`
- [ ] Verificar que un dominio sin `verified_at` no resuelve

## 4. Edge Function `submit-order`

- [ ] Crear `supabase/functions/submit-order/index.ts`
- [ ] Resolver tenant desde la cabecera `Origin`; 403 si no hay coincidencia verificada
- [ ] Validar el payload según las reglas de `design.md`; 400 con lista de campos
- [ ] Aplicar límite de tasa por hash de IP con sal de entorno; 429 con `retry_after`
- [ ] Contrastar `exchange_rate` contra el valor del servidor y descartarla si se
      desvía más de 20 %
- [ ] Reutilizar `customers` por `(tenant_id, phone)`; crear si no existe
- [ ] Buscar `submission_id` previo y devolver el pedido existente con `created: false`
- [ ] Insertar `orders` con estado `submitted` y devolver `public_token`
- [ ] Registrar el evento en `activity_events`
- [ ] Desplegar la función y probar los cuatro códigos de respuesta

## 5. Envío desde el asistente

- [ ] `src/lib/orders.ts`: función `submitOrder(draft, tenant, rate)` que arma el
      payload y llama a la Edge Function
- [ ] Generar `submission_id` en el borrador la primera vez que se confirma
- [ ] `Book.tsx`: estado `enviando | error | listo` en el paso `recap`
- [ ] Deshabilitar el botón y anunciar el estado mientras se envía
- [ ] Mostrar el error con opción de reintento, conservando el borrador
- [ ] Limpiar el borrador solo tras respuesta exitosa
- [ ] Guardar el `public_token` y navegar a `/transferencia/:token`

## 6. Apartado ligado al pedido

- [ ] Añadir la ruta `/transferencia/:token` conservando `/transferencia` como
      página informativa
- [ ] Edge Function `order-by-token`: valida el token y devuelve una proyección
      del pedido, nunca la fila completa
- [ ] `Transfer.tsx`: leer el pedido por token y mostrar monto, concepto con el
      nombre de la clienta y equivalente con la tasa congelada
- [ ] "Ya transferí" registra un `payments` de tipo `deposit` con `declared_at`
- [ ] Impedir una segunda declaración si ya existe una
- [ ] Incluir la referencia del pedido en el mensaje de WhatsApp

## 7. Verificación

- [ ] Recorrer el asistente completo y comprobar que el pedido aparece en `orders`
- [ ] Repetir el envío con el mismo `submission_id` y comprobar que no duplica
- [ ] Cortar la red en el momento del envío y comprobar que el borrador sobrevive
- [ ] Intentar insertar en `orders` con la clave anónima y comprobar el rechazo
- [ ] Enviar desde un `Origin` no registrado y comprobar el 403
- [ ] Superar el límite de tasa y comprobar el 429
- [ ] Enviar una categoría que no pertenece al tenant y comprobar el 400
- [ ] `npm run build && npm run prerender` sigue pasando 10/10 rutas
- [ ] `openspec validate --all --strict` sigue en verde
