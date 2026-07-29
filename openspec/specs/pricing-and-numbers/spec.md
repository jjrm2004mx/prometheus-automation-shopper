# Pricing and Numbers Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Dar transparencia económica: qué cuesta el servicio, cuánto suma comisión y
envío, y cuánto termina costando cada pieza puesta en México — para que la
clienta decida su precio de venta con números correctos.

Rutas: `/numeros`, `/calculadora-costo-real`, y calculadoras satélite
(`/quiz-margen`, `/ganancia-por-pieza`, `/inversion-y-ganancia`, `/precios`).

## Requirements

### Requirement: Estructura de costo declarada

El sistema SHALL exponer públicamente los parámetros del servicio: compra mínima
`$500 USD`, comisión `20 %`, envío típico `~10 días hábiles` y el tipo de cambio
vigente.

#### Scenario: Panel de números

- **WHEN** la visitante abre `/numeros`
- **THEN** ve compra mínima, comisión, envío típico y tipo de cambio
- **AND** ve el equivalente en MXN de la compra mínima
- **AND** se declara que todos los números son estimados y sirven para planear

#### Scenario: Simulación por monto y categoría

- **WHEN** la visitante captura un monto y elige una categoría en `/numeros`
- **THEN** el sistema estima cuánto se invierte, cuánto se suma en costos y cuánto
  podría ganar

#### Scenario: Envío estimado, no final

- **WHEN** la visitante consulta el envío
- **THEN** se declara que el envío exacto se confirma después de empacar

### Requirement: Tipo de cambio único y vigente

Todas las conversiones MXN↔USD mostradas al cliente SHALL usar el mismo tipo de
cambio vigente del sistema.

#### Scenario: Consistencia entre superficies

- **WHEN** la visitante compara el tipo de cambio en `/`, `/numeros`,
  `/agendar` y `/transferencia` en el mismo día
- **THEN** el valor mostrado es idéntico en las cuatro

> Estado actual: **no cumplido**. `/` y el asistente muestran el valor vivo
> (p. ej. `$18.14`), mientras `/numeros` y `/transferencia` muestran un valor
> fijo `$20.00`.

### Requirement: Calculadora de costo final por pieza

La ruta `/calculadora-costo-real` SHALL calcular el costo aterrizado por pieza
distribuyendo comisión y envío de forma **proporcional al valor** de cada pieza,
no en partes iguales.

#### Scenario: Entradas de la compra

- **WHEN** la clienta abre el paso 1 "Ingresa tu compra"
- **THEN** captura precio final de mercancía (USD), envío total (USD) y tipo de
  cambio cobrado (MXN por USD)
- **AND** puede declarar que tuvo varios tickets o ajustes

#### Scenario: Resumen del pedido

- **WHEN** los tres datos están capturados
- **THEN** se muestra mercancía total, comisión 20 %, subtotal con comisión,
  envío total y costo final aterrizado, en USD y en MXN

#### Scenario: Costo de una pieza

- **WHEN** la clienta captura el precio de etiqueta de una pieza en USD
- **THEN** el sistema calcula qué proporción del pedido representa esa pieza
- **AND** le asigna esa misma proporción de comisión y de envío
- **AND** muestra el costo final de esa pieza puesta en México

#### Scenario: Sin datos de compra

- **WHEN** la clienta intenta calcular una pieza sin haber llenado el paso 1
- **THEN** se muestra "Completa tu compra arriba para empezar a calcular piezas."

#### Scenario: Prueba de precio de venta

- **WHEN** la clienta captura un precio de venta esperado en MXN
- **THEN** se muestra su utilidad estimada, su margen y su multiplicador

#### Scenario: Precio de etiqueta sin impuestos

- **WHEN** la clienta captura el precio de etiqueta
- **THEN** la interfaz aclara que no debe sumar impuestos ni comisión porque el
  cálculo los aplica

### Requirement: Justificación pedagógica del prorrateo

La calculadora SHALL explicar por qué dividir el costo entre todas las piezas por
igual produce números incorrectos.

#### Scenario: Explicación del error común

- **WHEN** la clienta lee la sección "Una pieza cara no carga lo mismo que una barata"
- **THEN** se explica el error de dividir en partes iguales
- **AND** se explica que una pieza de $100 USD carga mucho más costo que una de $10 USD
