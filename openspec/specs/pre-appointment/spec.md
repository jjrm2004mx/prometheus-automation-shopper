# Pre-Appointment Preparation Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Reducir fricción el día de la compra: asegurar que la clienta llega con
presupuesto listo, expectativas correctas sobre la videollamada y método de pago
resuelto, antes de que Eduardo entre a tienda.

Ruta: `/antes-de-tu-cita`.

## Requirements

### Requirement: Checklist obligatorio previo a la cita

La página SHALL presentar seis secciones de preparación con progreso visible, y
SHALL bloquear el avance hasta que todas estén marcadas como revisadas.

#### Scenario: Estado inicial

- **WHEN** la clienta abre `/antes-de-tu-cita` con la cita ya reservada
- **THEN** ve el indicador "✓ Cita reservada"
- **AND** ve el contador "0 de 6 revisados"
- **AND** el botón "Continuar" está deshabilitado con el aviso
  "Revisa todas las secciones para continuar."

#### Scenario: Marcado de secciones

- **WHEN** la clienta pulsa "Entendido" en una sección de contenido
- **THEN** el contador de progreso aumenta en uno
- **AND** el estado se conserva si recarga la página

#### Scenario: Desbloqueo del avance

- **WHEN** las seis secciones están revisadas
- **THEN** el botón "Continuar" se habilita

### Requirement: Contenido de preparación

Las secciones SHALL cubrir: video introductorio, cómo será la cita, tener el
dinero listo, cómo se hacen los pagos, cómo seguir la compra durante la
videollamada, y puntualidad y preparación.

#### Scenario: Cómo será la cita

- **WHEN** la clienta abre la sección "Cómo será tu cita"
- **THEN** se establece que Eduardo entra a tienda con el pedido ya pensado, que
  muestra opciones en vivo por videollamada, que la clienta decide qué sí y qué
  no, y que no paga mercancía que no elija

#### Scenario: Dinero disponible

- **WHEN** la clienta abre la sección "Ten listo tu dinero antes de entrar"
- **THEN** se indica que el dinero para mercancía debe estar en el banco antes de
  la cita y que no conviene resolverlo el mismo día

#### Scenario: Mecánica de pago

- **WHEN** la clienta abre la sección "Cómo se hacen los pagos"
- **THEN** se indica que todo se mueve por transferencia mexicana, que no hace
  falta enviar dólares ni transferir a Estados Unidos, y que el tipo de cambio se
  toma el día de la transferencia

#### Scenario: Seguimiento durante la llamada

- **WHEN** la clienta abre la sección de seguimiento
- **THEN** se le recomienda ir sumando sus piezas mientras las elige y llegar con
  una forma simple de anotar sus números

#### Scenario: Puntualidad

- **WHEN** la clienta abre la sección "Puntualidad y preparación"
- **THEN** se indica que hay más citas apartadas ese día
- **AND** se advierte que si depende de depósitos en OXXO para montos grandes,
  conviene tener los fondos en el banco con anticipación

### Requirement: Video introductorio administrable

La sección de video SHALL soportar un estado "Próximamente" cuando no hay
contenido publicado, y SHALL permitir marcarlo como visto cuando lo hay.

#### Scenario: Sin video publicado

- **WHEN** no existe video introductorio publicado
- **THEN** se muestra el placeholder "Video de Eduardo — Próximamente"
- **AND** la sección puede marcarse igualmente como revisada
