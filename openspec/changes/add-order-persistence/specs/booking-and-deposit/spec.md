# Booking and Deposit — Delta

## MODIFIED Requirements

### Requirement: Aviso de transferencia realizada

La página de apartado SHALL permitir a la clienta declarar que ya transfirió, y
esa declaración SHALL quedar registrada como un pago pendiente de confirmación
ligado a su pedido.

#### Scenario: Declaración de pago

- **WHEN** la clienta pulsa "Ya transferí"
- **THEN** se registra un pago de tipo apartado con la fecha de declaración
- **AND** el pedido pasa a estado de apartado pendiente
- **AND** se le indica que recibirá el acceso al calendario una vez confirmada

#### Scenario: Declaración sin pedido

- **WHEN** alguien abre la página de apartado sin un pedido asociado
- **THEN** no se registra ningún pago
- **AND** se le dirige a armar su pedido primero

#### Scenario: Duda antes de transferir

- **WHEN** la clienta pulsa el contacto por WhatsApp
- **THEN** se abre la conversación con el negocio
- **AND** el mensaje incluye la referencia de su pedido

## ADDED Requirements

### Requirement: El apartado se liga a un pedido concreto

La página de apartado SHALL mostrar los datos del pedido de la clienta, no un
texto genérico.

#### Scenario: Apartado con pedido

- **WHEN** la clienta llega desde su pedido recién enviado
- **THEN** ve el monto del apartado del tenant
- **AND** ve el concepto de pago con su propio nombre sustituido
- **AND** ve el equivalente en la moneda de origen con la tasa congelada de su pedido

#### Scenario: Regreso posterior

- **WHEN** la clienta vuelve a abrir el enlace de su pedido más tarde
- **THEN** ve el estado actual de su apartado
- **AND** no puede declarar el pago dos veces si ya lo declaró

### Requirement: Confirmación del apartado por la shopper

Solo la shopper SHALL poder confirmar un pago; la clienta únicamente lo declara.

#### Scenario: Declaración no confirma

- **WHEN** la clienta declara su transferencia
- **THEN** el pago queda con fecha de declaración y sin fecha de confirmación
- **AND** el calendario sigue bloqueado

#### Scenario: Confirmación por la shopper

- **WHEN** la shopper confirma el pago
- **THEN** se registra quién lo confirmó y cuándo
- **AND** el pedido queda habilitado para reservar horario
