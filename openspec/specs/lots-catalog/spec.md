# Lots Catalog Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Ofrecer una vía de compra sin cita: lotes de mercancía ya armados, con precio
todo incluido, disponibles por orden de llegada.

Rutas: `/lotes`, `/lotes/:slug`, `/lote/:token`, `/como-funciona-lotes`,
`/crear-lote`. Datos: `admin_lots`, `lot_items`, `lot_carts`, `lot_cart_items`,
`lot_inventory_products`, `lot_inventory_categories`, `lot_inventory_history`.

## Requirements

### Requirement: Catálogo de lotes disponibles

La ruta `/lotes` SHALL listar los lotes publicados con fotos, video y resumen, y
SHALL reflejar su disponibilidad en tiempo real.

#### Scenario: Lote disponible

- **WHEN** un lote está publicado y no apartado
- **THEN** aparece en `/lotes` con fotos, video y resumen
- **AND** es accesible en su propia ruta `/lotes/:slug`

#### Scenario: Sin lotes disponibles

- **WHEN** no hay lotes publicados
- **THEN** la página conserva la explicación del proceso
- **AND** ofrece el CTA "Preguntar por WhatsApp" para conocer disponibilidad

### Requirement: Precio todo incluido

El precio publicado de un lote SHALL incluir mercancía, comisión, envío estimado
y empaque, sin cargos posteriores.

#### Scenario: Desglose de lo incluido

- **WHEN** la clienta consulta un lote
- **THEN** se declara que el precio incluye mercancía, comisión, envío estimado y empaque

### Requirement: Reserva por orden de llegada

Un lote SHALL asignarse a la primera clienta que complete la transferencia de
apartado.

#### Scenario: Proceso de reserva

- **WHEN** la clienta decide un lote
- **THEN** el flujo es: revisar fotos, video y resumen → preguntar si sigue
  disponible → apartar con transferencia → envío a su puerta

#### Scenario: Lote ya apartado

- **WHEN** una clienta intenta apartar un lote que ya fue tomado
- **THEN** el sistema indica que ya no está disponible
- **AND** ofrece ver otros lotes o escribir por WhatsApp

### Requirement: Enlace privado de lote

La ruta `/lote/:token` SHALL permitir compartir un lote específico con una
clienta mediante un enlace opaco.

#### Scenario: Acceso por token

- **WHEN** una clienta abre `/lote/:token` con un token válido
- **THEN** ve el lote asociado sin necesidad de autenticarse
- **AND** un token inválido o expirado no revela ningún lote

### Requirement: Posicionamiento del producto "lote"

El contenido SHALL presentar los lotes como alternativa para primera compra,
reposición rápida y menos gestión, no como el producto principal.

#### Scenario: Encuadre en el sitio

- **WHEN** la visitante ve las opciones de compra en `/` o `/como-funciona`
- **THEN** "Ventana de Compra Prioritaria" se presenta como opción principal
- **AND** "Lotes" se presenta como otra opción, sujeta a disponibilidad
