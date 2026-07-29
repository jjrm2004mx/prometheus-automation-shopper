# Shopper Onboarding Specification

## Purpose

Convertir a una personal shopper interesada en un tenant activo con su sitio
funcionando. Es el producto que se le vende a ella; el resto de la plataforma es
lo que ella le vende a sus clientas.

## Requirements

### Requirement: Alta guiada de una shopper

El alta SHALL capturar marca, contacto, parámetros comerciales, datos bancarios
y categorías, y SHALL dejar el sitio operativo al terminar.

#### Scenario: Alta completa

- **WHEN** una shopper completa el alta
- **THEN** se crea su tenant con su configuración
- **AND** su sitio queda accesible en un subdominio de la plataforma
- **AND** no se requiere despliegue ni intervención de código

#### Scenario: Valores por defecto sensatos

- **WHEN** la shopper no define un parámetro opcional
- **THEN** hereda el valor por defecto del producto
- **AND** puede cambiarlo después sin rehacer el alta

### Requirement: Vista previa antes de publicar

La shopper SHALL poder ver su sitio antes de que sea público.

#### Scenario: Previsualización

- **WHEN** la shopper abre su vista previa
- **THEN** ve su sitio con su configuración real
- **AND** el sitio no es accesible para el público mientras el tenant no esté activo

### Requirement: Conexión de dominio propio

La shopper SHALL poder apuntar su propio dominio, con verificación previa.

#### Scenario: Alta de dominio

- **WHEN** la shopper registra un dominio
- **THEN** recibe las instrucciones de DNS
- **AND** el dominio solo sirve su sitio una vez verificado

#### Scenario: Dominio ya tomado

- **WHEN** el dominio ya está registrado por otro tenant
- **THEN** el alta se rechaza

### Requirement: Consola de configuración

La shopper SHALL poder editar su configuración, su copy y su contenido sin
asistencia técnica.

#### Scenario: Cambio de parámetro comercial

- **WHEN** la shopper cambia su comisión o su monto de apartado
- **THEN** su sitio refleja el cambio en todas las superficies
- **AND** los pedidos ya registrados conservan los valores con los que se crearon

#### Scenario: Cambio de datos bancarios

- **WHEN** la shopper actualiza su cuenta
- **THEN** la página de apartado muestra la nueva cuenta
- **AND** el cambio queda registrado con fecha y autor

### Requirement: Estado del tenant

Un tenant SHALL poder pausarse o cancelarse, y su sitio SHALL reflejarlo.

#### Scenario: Tenant pausado

- **WHEN** un tenant pasa a pausado
- **THEN** su sitio deja de aceptar pedidos nuevos
- **AND** los pedidos en curso siguen visibles para sus clientas

#### Scenario: Tenant cancelado

- **WHEN** un tenant se cancela
- **THEN** su dominio deja de resolver
- **AND** sus datos se conservan durante el periodo de retención declarado

### Requirement: Separación de responsabilidad sobre el contenido

La plataforma SHALL dejar claro que los parámetros comerciales, los datos
bancarios y las promesas publicadas son responsabilidad de cada shopper.

#### Scenario: Datos bancarios

- **WHEN** una shopper captura su cuenta para recibir apartados
- **THEN** la plataforma la almacena como configuración de su tenant
- **AND** no intermedia ni retiene esos fondos

#### Scenario: Afirmaciones de resultados

- **WHEN** una shopper publica cifras de resultados en su sitio
- **THEN** la plataforma acompaña esas cifras con el descargo de que los
  resultados pasados no garantizan resultados futuros
