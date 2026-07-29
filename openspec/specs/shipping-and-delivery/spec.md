# Shipping and Delivery Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Capturar el destino en México, cobrar la transferencia final y dar seguimiento
hasta la entrega.

Rutas: `/envio`, `/paqueteria`, `/entrega/:token`, `/r/recepcion/:public_token`.
Datos: `shipments`, `shipment_boxes`, `packing_boxes`, `packing_cortes`,
`tracking_events`, `address_submissions`, `client_delivery_locations`,
`receiving_shipments`, `receiving_item_photos`, `box_extra_charges`.

## Requirements

### Requirement: Captura de datos de entrega

La ruta `/envio` SHALL capturar la dirección de entrega en tres etapas —
`Entrega`, `Transferencia`, `Lo que sigue` — y SHALL validar los campos
obligatorios antes de continuar.

#### Scenario: Tipo de entrega

- **WHEN** la clienta abre la etapa `Entrega`
- **THEN** elige entre `Domicilio` y `Sucursal / punto de entrega`

#### Scenario: Campos obligatorios

- **WHEN** la clienta llena el formulario de domicilio
- **THEN** son obligatorios: nombre completo de quien recibe, teléfono, calle y
  número, colonia, ciudad / municipio, estado y código postal
- **AND** son opcionales: interior y referencias del lugar

#### Scenario: Selector de estado

- **WHEN** la clienta abre el campo `Estado`
- **THEN** puede elegir entre los 32 estados de la República Mexicana

#### Scenario: Lada del teléfono

- **WHEN** la clienta captura su teléfono
- **THEN** puede elegir entre lada `+52` y `+1`

#### Scenario: Validación antes de avanzar

- **WHEN** la clienta pulsa "Continuar" con campos obligatorios vacíos
- **THEN** el formulario señala los campos faltantes y no avanza

### Requirement: Transferencia final antes del envío

Tras confirmar la dirección, la clienta SHALL declarar su transferencia final y el
envío SHALL quedar condicionado a la confirmación de ese pago.

#### Scenario: Declaración de transferencia final

- **WHEN** la clienta completa la etapa `Entrega`
- **THEN** avanza a la etapa `Transferencia`
- **AND** puede marcar que ya realizó su transferencia final

#### Scenario: Qué sigue

- **WHEN** la transferencia queda declarada
- **THEN** la etapa `Lo que sigue` explica empaque, salida y rastreo

### Requirement: Envío estimado y confirmación posterior

El costo de envío mostrado antes de empacar SHALL identificarse como estimado, y
el costo definitivo SHALL confirmarse una vez empacado.

#### Scenario: Estimado antes de empacar

- **WHEN** la clienta ve el envío en cualquier cálculo previo
- **THEN** se etiqueta como estimado
- **AND** se declara que el exacto se confirma después de empacar

#### Scenario: Cargos extra de caja

- **WHEN** el empaque genera cargos adicionales
- **THEN** quedan registrados y asociados a la caja del pedido

### Requirement: Seguimiento del envío

El sistema SHALL entregar número de rastreo y SHALL registrar eventos de
seguimiento del paquete.

#### Scenario: Entrega de tracking

- **WHEN** el paquete sale
- **THEN** la clienta recibe confirmación de salida y su número de seguimiento

#### Scenario: Vista pública de recepción

- **WHEN** se comparte `/r/recepcion/:public_token` con la clienta
- **THEN** puede ver el estado de recepción de su mercancía sin autenticarse
