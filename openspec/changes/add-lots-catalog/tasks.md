# Tareas — catálogo de lotes

> Depende de `add-order-persistence`. No empezar hasta que ese cambio esté
> archivado: este reutiliza el cliente de Supabase y la resolución de tenant
> desde la base.

## 1. Esquema

- [ ] Migración `0003_lots.sql`: añadir `reserved_at`, `sort_order`,
      `published_at` a `lots`
- [ ] Índice `lots_public_idx` sobre `(tenant_id, status, sort_order, published_at desc)`
- [ ] Trigger `lots_require_alt` que impide publicar un lote con imágenes sin
      texto alternativo (no usar `CHECK`: no admite subconsultas)
- [ ] Verificar que `lots_public_read` sigue limitando a `status = 'published'`
- [ ] Sembrar dos lotes de prueba, uno publicado y uno en borrador

## 2. Media

- [ ] Confirmar el bucket `lot-inventory` y su política de lectura pública
- [ ] `src/lib/media.ts`: constructor de URL con transformación de ancho
- [ ] Anchos: 640 px para portada de lista, 1280 px para galería de detalle
- [ ] `loading="lazy"` en todo lo que no sea la primera imagen

## 3. Consulta de lotes

- [ ] `src/lib/lots.ts`: `listLots(tenantId)` y `getLotBySlug(tenantId, slug)`
- [ ] Máquina de estados `cargando | lista | vacío | error` con tiempo límite de 8 s
- [ ] Caché en memoria por sesión para no reconsultar al navegar atrás

## 4. Catálogo

- [ ] Extraer `Lots` de `src/pages/Static.tsx` a `src/pages/Lots.tsx`
- [ ] Renderizar la cuadrícula de lotes publicados
- [ ] Conservar la explicación del proceso y los chips de lo incluido en **todos**
      los estados, incluido el vacío
- [ ] Estado de error con botón de reintento
- [ ] Comprobar que la ruta sigue prerenderizándose con contenido

## 5. Detalle

- [ ] `src/pages/LotDetail.tsx` en la ruta `/lotes/:slug`
- [ ] Galería con navegación por teclado y texto alternativo en cada imagen
- [ ] Video con póster y sin reproducción automática
- [ ] Precio con desglose de lo incluido
- [ ] Estado de no encontrado con salida al catálogo
- [ ] Estado apartado o vendido con la acción deshabilitada
- [ ] Escribir metadatos propios al montar: título, descripción e imagen

## 6. Apartado

- [ ] Edge Function `supabase/functions/reserve-lot/index.ts`
- [ ] Resolver tenant por `Origin`; 403 si no coincide
- [ ] Validar nombre y teléfono con las mismas reglas que el envío de pedidos
- [ ] Crear o reutilizar la clienta por `(tenant_id, phone)`
- [ ] Ejecutar la actualización condicional `status = 'published'` → `'reserved'`
- [ ] Devolver `{ reserved: false, reason: 'taken' }` cuando afecta cero filas
- [ ] Formulario de apartado en el detalle, con estado de envío y error
- [ ] Al apartar con éxito, mostrar las instrucciones de transferencia del tenant
- [ ] Comprobar que no se crea ningún registro en `orders` ni en `appointments`

## 7. Enlace privado

- [ ] Edge Function `lot-by-token`: valida contra `generated_links`, comprueba
      vigencia y devuelve la proyección del lote
- [ ] Ruta `/lote/:token`
- [ ] Registrar la apertura en `document_tracking`
- [ ] Respuesta idéntica para token inexistente, revocado y caducado
- [ ] Comprobar que un lote en borrador es visible por token y no en el catálogo

## 8. Verificación

- [ ] Dos navegadores apartando el mismo lote a la vez: exactamente uno gana
- [ ] Intentar `update` sobre `lots` con la clave anónima: rechazado
- [ ] Lote de otro tenant no visible ni por catálogo ni por slug
- [ ] Publicar un lote con una imagen sin `alt`: rechazado por el trigger
- [ ] Cortar la red y comprobar que se llega al estado de error, no a carga infinita
- [ ] Compartir un enlace de lote y comprobar la tarjeta de vista previa
- [ ] `npm run build && npm run prerender` sigue pasando las rutas estáticas
- [ ] `openspec validate --all --strict` en verde
