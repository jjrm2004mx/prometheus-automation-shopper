# Platform Foundations Specification

## Purpose

Comportamientos transversales que la plataforma garantiza a todas las shoppers:
indexabilidad, un solo tipo de cambio, peso de carga, accesibilidad y separación
entre sitio público y consola.

Estos requisitos existen porque son exactamente los que fallaban en el sitio de
referencia que originó el producto.

## Requirements

### Requirement: Contenido indexable sin ejecutar JavaScript

Cada ruta pública SHALL servirse con su contenido dentro del HTML.

#### Scenario: Crawler sin JavaScript

- **WHEN** un cliente solicita cualquier ruta pública y no ejecuta JavaScript
- **THEN** la respuesta incluye encabezados, párrafos, cifras y enlaces internos

#### Scenario: Verificación en el build

- **WHEN** corre el prerender del build
- **THEN** cada ruta pública produce un HTML con contenido de texto
- **AND** el build falla si alguna ruta queda por debajo del umbral mínimo

#### Scenario: Hidratación sin parpadeo

- **WHEN** el navegador carga una ruta prerenderizada
- **THEN** React hidrata el HTML existente en vez de reemplazarlo

### Requirement: Metadatos propios por ruta

Cada ruta SHALL emitir título, descripción, canonical, Open Graph y Twitter Card
derivados del tenant activo.

#### Scenario: Título por tenant y ruta

- **WHEN** se solicita una ruta pública
- **THEN** el título incluye el nombre de marca del tenant
- **AND** el canonical apunta al dominio de ese tenant

### Requirement: Un solo tipo de cambio vigente

Todas las conversiones mostradas a una clienta SHALL provenir del mismo valor.

#### Scenario: Consistencia entre superficies

- **WHEN** una clienta compara el tipo de cambio en la home, el asistente, la
  página de números y la de transferencia el mismo día
- **THEN** el valor es idéntico en las cuatro

#### Scenario: Fuente caída

- **WHEN** la fuente del tipo de cambio no responde
- **THEN** se conserva el último valor conocido
- **AND** en su defecto se usa el valor manual del tenant
- **AND** la interfaz nunca muestra un valor vacío ni cero

#### Scenario: Tasa congelada en el pedido

- **WHEN** un pedido se registra
- **THEN** guarda la tasa usada
- **AND** los números que ya vio la clienta no cambian si el mercado se mueve

### Requirement: Presupuesto de carga del sitio público

El código que una visitante anónima descarga SHALL limitarse a lo que su ruta
necesita.

#### Scenario: Carga inicial

- **WHEN** una visitante anónima abre una ruta pública
- **THEN** descarga menos de 500 KB de JavaScript sin comprimir
- **AND** no descarga el código de la consola de administración

#### Scenario: Superficie de datos oculta

- **WHEN** se inspecciona el bundle público
- **THEN** no contiene rutas de la consola, nombres de tablas ni lógica administrativa

### Requirement: Accesibilidad de base

Las superficies públicas SHALL permitir zoom y exponer estado accesible en todos
los controles.

#### Scenario: Zoom del usuario

- **WHEN** una persona hace zoom en el sitio desde su teléfono
- **THEN** el navegador lo permite
- **AND** el meta viewport no declara `maximum-scale` ni `user-scalable=no`

#### Scenario: Estado de las opciones

- **WHEN** un lector de pantalla recorre el asistente de pedido
- **THEN** cada opción anuncia su etiqueta y si está seleccionada

#### Scenario: Progreso del asistente

- **WHEN** la clienta avanza en el asistente
- **THEN** el progreso se expone como `progressbar` con su valor

#### Scenario: Movimiento reducido

- **WHEN** el sistema operativo pide movimiento reducido
- **THEN** las animaciones y transiciones se desactivan

### Requirement: Errores visibles, no silenciosos

Un fallo de red o de almacenamiento SHALL degradar la funcionalidad afectada sin
tumbar la página.

#### Scenario: Almacenamiento local no disponible

- **WHEN** el navegador bloquea el almacenamiento local
- **THEN** el asistente sigue funcionando en memoria durante la sesión

#### Scenario: Borrador corrupto

- **WHEN** el borrador guardado no se puede interpretar
- **THEN** el asistente empieza limpio en vez de romper
