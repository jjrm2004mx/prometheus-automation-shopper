# Live Purchase Session Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Ejecutar la compra: bloque de atención reservado, videollamada en vivo desde
tienda, aprobación pieza por pieza, desglose de total, transferencia final en
caja y cierre con ticket.

Rutas de apoyo: `/lo-que-veras`, `/como-funciona`. Evidencia y seguimiento viven
en los portales por token (ver `client-portals`).

## Requirements

### Requirement: Modelo de ventana, no de hora exacta

El sistema SHALL tratar la cita como un bloque de atención dentro de un día, no
como una hora exacta, y SHALL comunicarlo de forma consistente en todas las
superficies.

#### Scenario: Comunicación del modelo

- **WHEN** la clienta consulta cualquier página que describa la cita
- **THEN** se declara que es una ventana de atención y no una hora exacta
- **AND** se explica la razón: permite encontrar más opciones y moverse mejor en
  tienda sin hacerle perder toda la mañana

### Requirement: Secuencia de avisos antes del turno

El sistema SHALL notificar a la clienta en tres momentos antes de la llamada:
confirmación de ventana, recordatorio una hora antes y aviso ~30 minutos antes.

#### Scenario: Confirmación de ventana

- **WHEN** la cita queda reservada
- **THEN** la clienta recibe su bloque asignado, el día y qué esperar

#### Scenario: Recordatorio previo

- **WHEN** falta aproximadamente una hora para el turno
- **THEN** se envía un recordatorio para que esté pendiente

#### Scenario: Aviso inminente

- **WHEN** faltan aproximadamente 30 minutos
- **THEN** se envía un aviso por mensaje

#### Scenario: Clienta no disponible

- **WHEN** la clienta no responde la llamada en su turno
- **THEN** su turno puede recorrerse dentro del día
- **AND** esta consecuencia está declarada de antemano en el contenido público

### Requirement: Aprobación en vivo antes de cualquier pago

Ninguna pieza SHALL comprarse sin aprobación explícita de la clienta durante la
videollamada.

#### Scenario: Selección en vivo

- **WHEN** Eduardo muestra opciones durante la llamada
- **THEN** la clienta aprueba o rechaza cada opción
- **AND** solo lo aprobado entra al pedido

#### Scenario: Evidencia de selección

- **WHEN** la clienta aprueba piezas
- **THEN** el sistema registra la evidencia de selección asociada al pedido

### Requirement: Total desglosado antes de caja

Antes de solicitar la transferencia final, el sistema SHALL presentar un total
con desglose de mercancía, comisión del 20 % y envío estimado.

#### Scenario: Desglose visible

- **WHEN** la clienta terminó de aprobar y el pedido está en caja
- **THEN** ve mercancía, comisión (20 %), envío estimado y total
- **AND** ve el tipo de cambio aplicado ese día

#### Scenario: Momento del pago

- **WHEN** la clienta aprueba el total
- **THEN** realiza la transferencia mientras el pedido está en caja
- **AND** el envío se coordina después de la transferencia

### Requirement: Cierre con comprobantes

Tras cerrar la compra, el sistema SHALL entregar ticket, confirmación de envío y
número de rastreo.

#### Scenario: Entrega de comprobantes

- **WHEN** la compra se cierra
- **THEN** la clienta recibe el comprobante (ticket) de la compra
- **AND** recibe confirmación de cuándo sale su paquete
- **AND** recibe su número de seguimiento

### Requirement: Página de expectativas del proceso

La ruta `/lo-que-veras` SHALL explicar qué ocurre antes, durante y después de la
cita, y SHALL soportar una galería de ejemplos que puede estar vacía.

#### Scenario: Galería sin contenido

- **WHEN** no hay ejemplos de pedidos, empaques o entregas publicados
- **THEN** se muestra el estado "Aquí aparecerán más ejemplos."
- **AND** el resto de la página sigue siendo útil
