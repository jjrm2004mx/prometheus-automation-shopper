# Order Intake Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Convertir una visitante en un pedido estructurado antes de que exista una cita:
capturar tipo de compra, contexto de negocio, presupuesto, categorías, detalles y
datos de contacto en un asistente por pasos que se pueda abandonar y retomar.

Ruta: `/agendar`. Borrador libre alterno: `/tu-pedido`.

## Requirements

### Requirement: Asistente por pasos con estado persistente

El asistente SHALL avanzar por los pasos `intro`, `purchase_type`, `experience`,
`seller_context`, `budget`, `categories`, `category_details`, `priorities`,
`contact`, `recap`, y SHALL conservar las respuestas al navegar hacia atrás.

#### Scenario: Entrada al asistente

- **WHEN** la visitante abre `/agendar`
- **THEN** ve el paso `intro` con el resumen de dos etapas — "Crea tu pedido" y
  "Aparta tu lugar" — y un botón "Comenzar"
- **AND** el header cambia a modo asistente, con "Salir" en lugar de la
  navegación del sitio

#### Scenario: Retroceso sin pérdida de datos

- **WHEN** la visitante pulsa "Atrás" en cualquier paso posterior a `intro`
- **THEN** vuelve al paso anterior
- **AND** las respuestas capturadas siguen seleccionadas

#### Scenario: Reinicio explícito

- **WHEN** la visitante pulsa "Reiniciar pedido"
- **THEN** se descartan todas las respuestas y el asistente vuelve a `intro`

#### Scenario: Cambio de tipo de compra

- **WHEN** la visitante pulsa "Cambiar tipo de compra"
- **THEN** el asistente regresa al paso `purchase_type`
- **AND** se recalculan los pasos aplicables según la nueva selección

### Requirement: Ramificación por tipo de compra

El paso `purchase_type` SHALL ofrecer exactamente dos opciones — `Reventa` y
`Uso personal` — y el camino posterior SHALL depender de la elección.

#### Scenario: Camino de reventa

- **WHEN** la visitante elige "Reventa"
- **THEN** avanza al paso `experience` ("Cuéntanos desde dónde empiezas")
- **AND** se le presentan las opciones "Ya vendo actualmente" y "Es mi primera vez"

#### Scenario: Camino de uso personal

- **WHEN** la visitante elige "Uso personal"
- **THEN** el sistema registra la consulta como personal
- **AND** omite los pasos de contexto de vendedora

### Requirement: Captura de contexto de negocio

Para quien ya vende, el paso `seller_context` SHALL capturar antigüedad, canales
de venta y experiencia previa comprando en USA, y SHALL declarar que la
información es solo de referencia.

#### Scenario: Antigüedad vendiendo

- **WHEN** la visitante llega a `seller_context`
- **THEN** puede elegir una sola opción entre `Menos de 1 año`, `1 a 3 años`,
  `3 a 5 años`, `5+ años`

#### Scenario: Canales de venta múltiples

- **WHEN** la visitante responde "¿Dónde vendes?"
- **THEN** puede seleccionar varias opciones entre `Tienda física`, `Instagram`,
  `Facebook`, `TikTok`, `WhatsApp`, `Página web`, `Otro`

#### Scenario: Experiencia previa en tiendas de USA

- **WHEN** la visitante responde "¿Has comprado en tiendas de USA antes?"
- **THEN** elige entre `Sí` y `No`

### Requirement: Presupuesto en MXN con conversión en vivo

El paso `budget` SHALL capturar el presupuesto total de mercancía en pesos
mexicanos, ofrecer atajos de monto y mostrar el equivalente en USD con el tipo de
cambio del día.

#### Scenario: Selección por atajo

- **WHEN** la visitante pulsa uno de los atajos `$10.000`, `$15.000`, `$20.000`, `$30.000`
- **THEN** el campo de monto toma ese valor
- **AND** se muestra "Equivale aprox. a $X USD"
- **AND** se muestra "Tipo de cambio de hoy: $Y MXN por $1 USD"

#### Scenario: Monto libre

- **WHEN** la visitante escribe un monto en el campo "Monto en MXN"
- **THEN** la conversión a USD se recalcula al momento
- **AND** la barra inferior fija muestra el monto seleccionado junto al botón "Continuar"

#### Scenario: Presupuesto por debajo del mínimo

- **WHEN** el monto capturado equivale a menos de `$500 USD` de mercancía
- **THEN** el sistema advierte que la compra mínima es de `$500 USD`

### Requirement: Categorías y detalle de la compra

El paso `categories` SHALL permitir elegir una o más categorías de producto, y el
paso `category_details` SHALL pedir contexto específico para lo seleccionado.

#### Scenario: Categorías disponibles

- **WHEN** la visitante llega a `categories`
- **THEN** puede seleccionar entre `Bolsas`, `Tenis`, `Ropa`, `Perfumes`,
  `Belleza`, `Accesorios`, `Hogar`, `Otros`
- **AND** el catálogo de categorías proviene de configuración administrable, no
  de una lista fija en el código

#### Scenario: Detalle de la compra

- **WHEN** la visitante llega a `category_details`
- **THEN** puede especificar marcas, tallas / modelos / medidas y colores / acabados

#### Scenario: Prioridades y exclusiones

- **WHEN** la visitante llega a `priorities`
- **THEN** puede indicar qué tiene prioridad y qué **no** quiere que se compre

### Requirement: Captura de contacto y resumen antes de apartar

El paso `contact` SHALL capturar los datos de la clienta y el paso `recap` SHALL
mostrar el pedido armado antes de enviar a apartado.

#### Scenario: Resumen del pedido

- **WHEN** la visitante llega a `recap`
- **THEN** ve el resumen completo de sus respuestas bajo el encabezado
  "Así va tu pedido."
- **AND** puede regresar a cualquier paso a corregir

#### Scenario: Cierre del intake

- **WHEN** la visitante confirma el resumen
- **THEN** el pedido queda registrado en el sistema
- **AND** se le dirige al apartado por transferencia (`/transferencia`)

### Requirement: Borrador de pedido local e independiente

La ruta `/tu-pedido` SHALL ofrecer un borrador libre del pedido, guardado en el
dispositivo, que no requiere haber agendado.

#### Scenario: Guardado local

- **WHEN** la visitante escribe en cualquier campo de `/tu-pedido`
- **THEN** el contenido se guarda en el almacenamiento local del dispositivo
- **AND** la interfaz indica "Guardado local en este dispositivo"

#### Scenario: Campos del borrador

- **WHEN** la visitante abre `/tu-pedido`
- **THEN** puede capturar presupuesto (con selector USD / MXN), categorías,
  marcas, tallas / modelos / medidas, colores / acabados, prioridades,
  qué no quiere, y notas

#### Scenario: Reinicio del borrador

- **WHEN** la visitante pulsa "Reiniciar borrador"
- **THEN** se limpian todos los campos y el almacenamiento local
