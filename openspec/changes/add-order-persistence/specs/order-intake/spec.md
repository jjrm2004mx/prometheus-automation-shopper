# Order Intake — Delta

## MODIFIED Requirements

### Requirement: Captura de contacto y resumen antes de apartar

El paso `contact` SHALL capturar los datos de la clienta y el paso `recap` SHALL
mostrar el pedido armado. Al confirmar, el pedido SHALL persistirse en el
servidor antes de dirigir a la clienta al apartado.

#### Scenario: Resumen del pedido

- **WHEN** la visitante llega a `recap`
- **THEN** ve el resumen completo de sus respuestas bajo el encabezado
  "Así va tu pedido."
- **AND** puede regresar a cualquier paso a corregir

#### Scenario: Cierre del intake

- **WHEN** la visitante confirma el resumen
- **THEN** el pedido se envía al servidor y queda registrado con estado `submitted`
- **AND** se crea o se reutiliza la clienta según su teléfono dentro del tenant
- **AND** se le dirige al apartado por transferencia con el token de su pedido

#### Scenario: Envío en curso

- **WHEN** el envío del pedido está en proceso
- **THEN** el botón de confirmación queda deshabilitado y anuncia el estado
- **AND** una segunda pulsación no genera un segundo envío

## ADDED Requirements

### Requirement: El pedido se envía a través del servidor

El pedido NO SHALL escribirse en la base directamente desde el navegador. SHALL
enviarse a un endpoint del servidor que valide, resuelva el tenant y persista.

#### Scenario: Escritura anónima directa

- **WHEN** un cliente anónimo intenta insertar una fila en `orders` o `customers`
  usando la clave pública
- **THEN** la base lo rechaza
- **AND** no existe ninguna política que permita inserción anónima en esas tablas

#### Scenario: Tenant determinado por el servidor

- **WHEN** llega un envío de pedido
- **THEN** el tenant se resuelve a partir del origen de la petición
- **AND** un `tenant_id` incluido en el cuerpo se ignora
- **AND** un origen sin tenant verificado se rechaza

#### Scenario: Validación en el servidor

- **WHEN** el envío contiene datos fuera de rango, categorías que no pertenecen
  al tenant, o textos por encima del límite
- **THEN** el servidor lo rechaza indicando qué campos fallaron
- **AND** no se crea ningún registro parcial

### Requirement: Envío idempotente

Un mismo intento de envío SHALL producir un solo pedido, aunque se repita.

#### Scenario: Reintento tras fallo de red

- **WHEN** la clienta reintenta el envío después de una respuesta perdida
- **THEN** el servidor reconoce el intento como el mismo
- **AND** devuelve el pedido ya creado en lugar de crear otro
- **AND** la shopper ve un solo pedido

#### Scenario: Doble pulsación

- **WHEN** la clienta pulsa dos veces el botón de confirmación
- **THEN** se registra un solo pedido

### Requirement: El borrador sobrevive a un envío fallido

El borrador local NO SHALL borrarse hasta que el servidor confirme el registro.

#### Scenario: Fallo de red al enviar

- **WHEN** el envío falla por red o por error del servidor
- **THEN** la clienta ve un mensaje que explica qué pasó
- **AND** su pedido sigue completo en pantalla
- **AND** puede reintentar sin volver a capturar nada

#### Scenario: Envío exitoso

- **WHEN** el servidor confirma el registro
- **THEN** el borrador local se limpia
- **AND** el token del pedido queda disponible para las siguientes pantallas

### Requirement: Protección contra envíos abusivos

El endpoint de envío SHALL limitar la frecuencia de envíos por origen.

#### Scenario: Exceso de envíos

- **WHEN** un mismo origen supera el límite de envíos en la ventana definida
- **THEN** el servidor responde con un error de límite excedido y el tiempo de espera
- **AND** no se crean registros adicionales

#### Scenario: Registro de la procedencia

- **WHEN** se aplica el límite de tasa
- **THEN** la dirección de origen se almacena en forma de hash con sal
- **AND** nunca en claro

### Requirement: La tasa de cambio se congela en el pedido

El pedido SHALL guardar el tipo de cambio con el que la clienta vio sus números.

#### Scenario: Registro de la tasa

- **WHEN** el pedido se registra
- **THEN** guarda la tasa vigente en el momento de la confirmación
- **AND** las pantallas posteriores usan esa tasa guardada, no la del día

#### Scenario: Tasa manipulada

- **WHEN** la tasa enviada por el cliente difiere en más de 20 % de la vigente en
  el servidor
- **THEN** se descarta y se usa la del servidor
