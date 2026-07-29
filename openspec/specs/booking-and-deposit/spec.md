# Booking and Deposit Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Convertir un pedido armado en una cita confirmada mediante un apartado de
$500 MXN por transferencia bancaria mexicana, con validación manual por parte del
negocio antes de liberar el calendario.

Rutas: `/transferencia` → (validación) → `/reservar` → `/confirmado`.

## Requirements

### Requirement: Apartado por transferencia en pesos mexicanos

La página `/transferencia` SHALL presentar los datos bancarios completos para un
apartado de `$500 MXN` y SHALL dejar explícito que no se requiere enviar dólares
ni transferir al extranjero.

#### Scenario: Datos bancarios mostrados

- **WHEN** la clienta abre `/transferencia`
- **THEN** ve beneficiario, banco, CLABE y concepto de pago sugerido
  (`TU NOMBRE CITA`)
- **AND** los datos bancarios provienen de configuración administrable

#### Scenario: Monto y equivalencia

- **WHEN** la clienta ve el monto del apartado
- **THEN** se muestra `$500 MXN`
- **AND** se muestra el aproximado en USD junto al tipo de cambio aplicado

#### Scenario: Aclaraciones de fricción

- **WHEN** la clienta lee la página
- **THEN** se declara que no necesita enviar dólares, no necesita transferir a
  Estados Unidos y no necesita ir al banco si tiene banca móvil

### Requirement: Términos del apartado

El sistema SHALL declarar, antes de la transferencia, en qué casos el apartado se
aplica a la compra y en cuáles se pierde.

#### Scenario: Apartado aplicable

- **WHEN** la clienta asiste a su cita o avisa con tiempo
- **THEN** los `$500 MXN` cuentan a favor de su compra

#### Scenario: Apartado no aplicable

- **WHEN** la clienta no se presenta ni avisa
- **THEN** el monto ya no se aplica a su orden

### Requirement: Aviso de transferencia realizada

La página `/transferencia` SHALL permitir a la clienta declarar que ya transfirió
y SHALL ofrecer WhatsApp como canal de aclaración.

#### Scenario: Declaración de pago

- **WHEN** la clienta pulsa "Ya transferí"
- **THEN** el sistema registra el aviso y queda pendiente de validación
- **AND** se le indica que recibirá el acceso al calendario una vez confirmada

#### Scenario: Duda antes de transferir

- **WHEN** la clienta pulsa "Contactar por WhatsApp"
- **THEN** se abre la conversación de WhatsApp con el negocio

### Requirement: Calendario protegido hasta validar el pago

La ruta `/reservar` SHALL negar la selección de horario mientras la transferencia
no esté confirmada por el negocio.

#### Scenario: Acceso sin validación

- **WHEN** una clienta abre `/reservar` sin transferencia confirmada
- **THEN** ve el mensaje "Primero necesitamos validar tu transferencia."
- **AND** ve enlaces para volver a `/transferencia` y para escribir por WhatsApp
- **AND** no se muestra ningún horario disponible

#### Scenario: Acceso con validación

- **WHEN** el negocio confirma la transferencia y envía el acceso a la clienta
- **THEN** `/reservar` muestra los horarios disponibles bajo "Reserva tu horario."
- **AND** la clienta puede seleccionar un bloque

#### Scenario: Fallo de carga del calendario

- **WHEN** el calendario no puede cargarse
- **THEN** se muestra el estado "El calendario no cargó."
- **AND** se ofrece una vía alterna de contacto

### Requirement: Confirmación de cita

Tras reservar, el sistema SHALL confirmar la cita en `/confirmado` y SHALL
comunicar los avisos previstos antes del turno.

#### Scenario: Cita confirmada

- **WHEN** la clienta completa la reserva de horario
- **THEN** se le muestra la confirmación con su bloque asignado y qué esperar
- **AND** se le dirige a la preparación previa (`/antes-de-tu-cita`)
