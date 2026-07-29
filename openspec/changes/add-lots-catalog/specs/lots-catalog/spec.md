# Lots Catalog — Delta

## MODIFIED Requirements

### Requirement: Catálogo de lotes disponibles

La ruta `/lotes` SHALL consultar los lotes publicados del tenant activo y
mostrarlos con portada, título, resumen y precio, ordenados según el criterio
configurado.

#### Scenario: Lote disponible

- **WHEN** un lote está publicado y no apartado
- **THEN** aparece en `/lotes` con su portada, título, resumen y precio
- **AND** enlaza a su detalle en `/lotes/:slug`

#### Scenario: Lote de otro tenant

- **WHEN** existe un lote publicado de otra shopper
- **THEN** no aparece en el catálogo de este tenant
- **AND** su ruta de detalle tampoco lo revela

#### Scenario: Sin lotes disponibles

- **WHEN** la consulta devuelve cero lotes publicados
- **THEN** se muestra el estado vacío con el texto configurado del tenant
- **AND** la explicación del proceso y de lo que incluye el precio sigue visible
- **AND** se ofrece el contacto por WhatsApp

### Requirement: Reserva por orden de llegada

Un lote SHALL asignarse a la primera clienta que complete el apartado, y el
sistema SHALL garantizar que dos clientas no puedan apartar el mismo lote.

#### Scenario: Proceso de reserva

- **WHEN** la clienta decide un lote disponible
- **THEN** captura su nombre y teléfono
- **AND** al confirmar, el lote queda apartado a su nombre
- **AND** recibe las instrucciones de transferencia

#### Scenario: Dos apartados simultáneos

- **GIVEN** dos clientas viendo el mismo lote disponible
- **WHEN** ambas confirman el apartado a la vez
- **THEN** exactamente una queda con el lote apartado
- **AND** la otra recibe el aviso de que ya no está disponible
- **AND** en ningún caso el lote queda asignado a las dos

#### Scenario: Lote ya apartado

- **WHEN** una clienta abre el detalle de un lote que ya fue apartado
- **THEN** el lote se muestra marcado como apartado
- **AND** la acción de apartar está deshabilitada
- **AND** se ofrece ver otros lotes o escribir por WhatsApp

### Requirement: Enlace privado de lote

La ruta `/lote/:token` SHALL permitir compartir un lote específico —publicado o
no— mediante un enlace opaco, resuelto en el servidor.

#### Scenario: Acceso por token

- **WHEN** una clienta abre `/lote/:token` con un token vigente
- **THEN** ve ese lote sin necesidad de autenticarse
- **AND** puede apartarlo si su estado lo permite

#### Scenario: Lote sin publicar

- **WHEN** la shopper comparte el enlace de un lote en borrador
- **THEN** la clienta con el enlace lo ve
- **AND** ese lote sigue sin aparecer en el catálogo público

#### Scenario: Token inválido, revocado o caducado

- **WHEN** el token no existe, fue revocado o caducó
- **THEN** no se revela ningún lote
- **AND** la respuesta no distingue entre "nunca existió" y "ya no vale"

#### Scenario: Registro de apertura

- **WHEN** se abre un enlace privado de lote
- **THEN** queda registrada la apertura asociada a ese enlace

## ADDED Requirements

### Requirement: Detalle del lote

La ruta `/lotes/:slug` SHALL mostrar la media, el contenido y el precio del lote.

#### Scenario: Contenido del detalle

- **WHEN** la clienta abre un lote publicado
- **THEN** ve su galería de imágenes y video
- **AND** ve el resumen, el precio y el desglose de lo que incluye
- **AND** ve la acción de apartado

#### Scenario: Slug inexistente

- **WHEN** el slug no corresponde a un lote publicado del tenant
- **THEN** se muestra un estado de no encontrado
- **AND** se ofrece volver al catálogo

#### Scenario: Imágenes accesibles

- **WHEN** se muestra la galería de un lote publicado
- **THEN** cada imagen tiene texto alternativo
- **AND** un lote con imágenes sin texto alternativo no puede publicarse

#### Scenario: Peso de las imágenes

- **WHEN** se cargan las imágenes del catálogo o del detalle
- **THEN** se solicitan con el ancho acotado que necesita cada superficie
- **AND** las que están fuera de la primera pantalla se cargan de forma diferida

### Requirement: Precio cerrado del lote

El precio publicado de un lote SHALL ser final en moneda local y NO SHALL
recalcularse con el tipo de cambio ni con la comisión del tenant.

#### Scenario: Precio estable

- **WHEN** una clienta ve el precio de un lote y vuelve al día siguiente
- **THEN** el precio es el mismo, aunque el tipo de cambio se haya movido

#### Scenario: Desglose de lo incluido

- **WHEN** la clienta consulta un lote
- **THEN** se declara que el precio incluye mercancía, comisión, envío estimado
  y empaque
- **AND** no se le suma ningún cargo posterior

### Requirement: El apartado de un lote pasa por el servidor

La reserva NO SHALL escribirse desde el navegador.

#### Scenario: Escritura anónima directa

- **WHEN** un cliente anónimo intenta actualizar la tabla de lotes con la clave pública
- **THEN** la base lo rechaza

#### Scenario: Tenant resuelto por el servidor

- **WHEN** llega una solicitud de apartado
- **THEN** el tenant se resuelve por el origen de la petición
- **AND** un identificador de tenant enviado por el cliente se ignora

### Requirement: Metadatos propios del lote

El detalle de un lote SHALL emitir título, descripción e imagen propios.

#### Scenario: Compartir por mensajería

- **WHEN** se comparte el enlace de un lote
- **THEN** la vista previa muestra el título, el resumen y la portada del lote

### Requirement: Los lotes no consumen el flujo de cita

Apartar un lote NO SHALL crear un pedido, una cita ni consumir el apartado de
ventana de compra.

#### Scenario: Compra cerrada

- **WHEN** una clienta aparta un lote
- **THEN** no se genera ningún registro en pedidos ni en citas
- **AND** el apartado de ventana de compra no se ve afectado
