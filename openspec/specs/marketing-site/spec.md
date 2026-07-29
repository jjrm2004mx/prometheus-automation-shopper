# Marketing Site Specification

> **Parametrización.** Los valores concretos que aparecen en los escenarios
> (comisión, compra mínima, monto de apartado, tiempos de envío, categorías,
> nombres y datos bancarios) son los del tenant de ejemplo. En el producto
> multi-tenant cada uno proviene de la configuración del tenant activo — ver
> `tenant-configuration`. Ningún valor de esta especificación se escribe
> literal en el código.


## Purpose

Explicar el servicio de sourcing a una audiencia mexicana de revendedoras, dar
transparencia de números antes de cualquier compromiso, y llevar a la visitante
a una de dos conversiones: **agendar una ventana de compra** o **escribir por
WhatsApp**.

## Requirements

### Requirement: Navegación global consistente

El sitio SHALL exponer una barra de navegación fija con la marca a la izquierda,
enlaces principales al centro y un CTA primario "Agendar" a la derecha, y SHALL
colapsar los enlaces en un botón "Menú" en viewports móviles.

#### Scenario: Navegación en escritorio

- **WHEN** una visitante carga cualquier página pública en un viewport ≥ 1024 px
- **THEN** el header muestra los enlaces `Inicio`, `Cómo funciona`, `Números`,
  `Lotes`, `Preguntas`
- **AND** muestra un botón CTA "Agendar" que enlaza a `/agendar`

#### Scenario: Navegación en móvil

- **WHEN** el viewport es menor al breakpoint de escritorio
- **THEN** los enlaces centrales se ocultan
- **AND** se muestra un botón "Menú" que despliega la navegación completa

### Requirement: Home comunica propuesta, números y proceso

La página `/` SHALL presentar, en este orden: propuesta de valor, métricas clave
del servicio, el proceso de la ventana de compra, las ventajas, el momento del
pago, un ejemplo de inversión, las dos modalidades de compra, preguntas
frecuentes y un cierre con CTA.

#### Scenario: Métricas del servicio visibles sin scroll profundo

- **WHEN** la visitante llega a `/`
- **THEN** ve un bloque de cuatro métricas: compra mínima `$500 USD`,
  comisión `20%`, envío típico `~10 días`, y el tipo de cambio MXN por USD del día
- **AND** el tipo de cambio mostrado proviene del valor vigente del sistema, no
  de un valor escrito a mano

#### Scenario: Ejemplo de inversión calculado

- **WHEN** la visitante llega al bloque "Piensa mejor tu inversión"
- **THEN** ve un desglose de ejemplo: mercancía `$1,000 USD`, comisión (20 %)
  `$200 USD`, envío estimado `~$110 USD`, total `~$1,310 USD`
- **AND** ve el equivalente en MXN calculado con el tipo de cambio del día
- **AND** ve un enlace "Ver números completos" hacia `/numeros`

#### Scenario: Dos modalidades de compra

- **WHEN** la visitante llega al bloque "Elige cómo quieres comprar"
- **THEN** ve la opción principal "Ventana de Compra Prioritaria" con CTA a `/agendar`
- **AND** ve la opción alterna "Lotes" con CTA a `/lotes`

### Requirement: Página de proceso explica la ventana de compra

La página `/como-funciona` SHALL describir el ciclo completo en cuatro fases —
antes de la tienda, en vivo, antes de caja, después de comprar — y SHALL
enumerar los seis pasos de la ventana de compra.

#### Scenario: La ventana no es una hora exacta

- **WHEN** la visitante lee la sección "Cómo funciona tu ventana de compra"
- **THEN** el contenido establece explícitamente que es una ventana de atención
  y no una hora exacta
- **AND** describe los avisos: confirmación, recordatorio una hora antes, aviso
  ~30 minutos antes, y llamada en vivo al llegar el turno
- **AND** advierte que si la clienta no responde, su turno puede recorrerse

#### Scenario: Descarga del proceso en PDF

- **WHEN** la visitante pulsa "Descargar PDF" en `/como-funciona`
- **THEN** el sistema entrega un documento con el proceso completo

### Requirement: Preguntas frecuentes agrupadas por tema

La página `/preguntas` SHALL agrupar las preguntas en las categorías
`Ventana de compra`, `Pago`, `Envío`, `Lotes` y `Reventa`, y SHALL permitir
expandir cada pregunta de forma independiente.

#### Scenario: Filtrado por categoría

- **WHEN** la visitante selecciona una categoría
- **THEN** solo se muestran las preguntas de esa categoría
- **AND** cada pregunta se muestra colapsada hasta que se pulsa

#### Scenario: Salida a WhatsApp desde las dudas

- **WHEN** la visitante no encuentra respuesta
- **THEN** existe un CTA "Escríbenos por WhatsApp" que abre la conversación con
  el número del negocio

### Requirement: Página de autoridad y encuadre del servicio

La página `/sobre-eduardo` SHALL declarar qué es el servicio, qué **no** es, la
ruta de tiendas y la filosofía de compra.

#### Scenario: Delimitación explícita del alcance

- **WHEN** la visitante lee "Lo que este servicio no es"
- **THEN** se declara que no es para compras personales, que no es compra
  improvisada y que nada se cierra sin aprobación de la clienta

### Requirement: Metadatos y datos estructurados por ruta

Cada ruta pública SHALL emitir `title`, `meta description`, `canonical`, Open
Graph y Twitter Card propios, y el sitio SHALL publicar JSON-LD de tipo
`Organization` y `WebSite` con `inLanguage: es-MX`.

#### Scenario: Título por ruta

- **WHEN** un crawler solicita `/como-funciona`
- **THEN** el título es específico de esa página (p. ej. "Cómo funciona | Eduardo Sourcing Co.")
- **AND** el `canonical` apunta a la URL absoluta de esa ruta

#### Scenario: Sitemap y robots

- **WHEN** un crawler solicita `/robots.txt`
- **THEN** permite el rastreo completo a `Googlebot`, `Bingbot`, `Twitterbot`,
  `facebookexternalhit` y `*`
- **AND** declara `Sitemap: https://eduardosourcing.com/sitemap.xml`
- **AND** el sitemap lista todas las rutas públicas indexables

### Requirement: Contenido indexable sin ejecución de JavaScript

El contenido principal de cada ruta pública SHALL estar disponible en el HTML
que responde el servidor, sin depender de la hidratación del cliente.

> Estado actual: **no cumplido**. El HTML de respuesta contiene únicamente
> `<head>` y un contenedor vacío; todo el texto lo pinta el bundle. Ver
> `changes/` para la propuesta de prerender.

#### Scenario: Crawler sin JavaScript

- **WHEN** un cliente solicita `/numeros` y no ejecuta JavaScript
- **THEN** la respuesta incluye los encabezados, párrafos y cifras de la página
- **AND** incluye los enlaces internos de navegación
