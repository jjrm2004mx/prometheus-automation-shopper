# Tenant Configuration Specification

## Purpose

Definir qué distingue a una shopper de otra. Todo lo que cambia entre negocios
—marca, comisión, mínimos, cuenta bancaria, categorías, colores, copy— vive en
la configuración del tenant. El código no contiene ninguno de esos valores.

Esquema: `src/config/schema.ts`. Persistencia: tabla `tenants`.

## Requirements

### Requirement: Un solo esquema de configuración

Toda diferencia entre tenants SHALL expresarse como un campo del esquema de
configuración; ningún componente SHALL contener un valor de negocio literal.

#### Scenario: Valor de negocio en la interfaz

- **WHEN** una pantalla necesita la comisión, el mínimo de compra, el monto del
  apartado, el nombre de la marca o los datos bancarios
- **THEN** lo lee de la configuración del tenant activo
- **AND** una revisión del código no encuentra ese valor escrito literal

#### Scenario: Alta de una shopper nueva

- **WHEN** se da de alta un tenant nuevo con su configuración
- **THEN** su sitio queda operativo sin modificar ni una línea de código
- **AND** sin un despliegue nuevo

### Requirement: Parámetros comerciales configurables

La configuración SHALL incluir moneda local, moneda de origen, tasa de comisión,
compra mínima, monto de apartado, tasa de envío estimado, etiqueta de tiempo de
envío, atajos de presupuesto y monto del ejemplo de inversión.

#### Scenario: Comisión distinta

- **WHEN** una shopper cobra 15 % en lugar de 20 %
- **THEN** todos los desgloses, la calculadora y las páginas de números usan 15 %
- **AND** ningún texto sigue diciendo 20 %

#### Scenario: Par de monedas distinto

- **WHEN** una shopper compra en USD y vende en COP
- **THEN** las conversiones, los formatos de moneda y las etiquetas reflejan ese par

### Requirement: Catálogo de categorías por tenant

Las categorías del asistente de pedido SHALL venir de la configuración, con sus
campos de detalle asociados.

#### Scenario: Categorías propias

- **WHEN** una shopper vende solo bolsas y perfumes
- **THEN** el asistente ofrece únicamente esas categorías
- **AND** pide los campos de detalle declarados para cada una

### Requirement: Tema visual por tenant

Los colores, el radio y la tipografía SHALL definirse como tokens en la
configuración y aplicarse en tiempo de ejecución.

#### Scenario: Marca con color propio

- **WHEN** un tenant define tokens de tema distintos
- **THEN** toda la interfaz los adopta sin recompilar
- **AND** ningún componente escribe un color literal

### Requirement: Sobrescritura de copy sin código

Cada texto del producto SHALL tener una clave, y el tenant SHALL poder
sobrescribir cualquier clave desde su configuración.

#### Scenario: Cambio de tono

- **WHEN** una shopper reemplaza el titular de la home en su configuración
- **THEN** su sitio muestra ese texto
- **AND** los tenants que no lo sobrescriben siguen viendo el texto base

#### Scenario: Interpolación de variables

- **WHEN** un texto contiene `{marca}`, `{comision}`, `{minimo}` u otra variable
- **THEN** se sustituye con el valor del tenant activo

### Requirement: Banderas de funcionalidad

Los módulos opcionales SHALL activarse por tenant.

#### Scenario: Tenant sin lotes

- **WHEN** un tenant tiene la bandera de lotes desactivada
- **THEN** la ruta `/lotes` no se registra
- **AND** el enlace desaparece de la navegación y de las opciones de compra

### Requirement: Configuración inválida no rompe el sitio

Una configuración incompleta o corrupta SHALL degradar a valores por defecto en
lugar de dejar el sitio en blanco.

#### Scenario: Campo faltante

- **WHEN** un tenant no define un campo opcional
- **THEN** la interfaz usa el valor por defecto del producto
- **AND** el sitio renderiza normalmente
