# Tenant Configuration — Delta

## ADDED Requirements

### Requirement: La configuración se lee de la base

La configuración de un tenant SHALL provenir de la base de datos en tiempo de
ejecución, no de un archivo compilado en el bundle.

#### Scenario: Alta sin despliegue

- **WHEN** se inserta un tenant activo con su dominio verificado
- **THEN** su sitio queda operativo sin recompilar ni desplegar

#### Scenario: Cambio de parámetro en caliente

- **WHEN** la shopper modifica su comisión o sus categorías en la base
- **THEN** las visitas posteriores usan el valor nuevo
- **AND** no se requiere despliegue

### Requirement: Degradación cuando la base no responde

La ausencia de conexión con la base NO SHALL dejar el sitio en blanco.

#### Scenario: Base inaccesible

- **WHEN** la consulta de configuración falla
- **THEN** se usa la última configuración conocida en caché
- **AND** en su defecto, la configuración sembrada del producto
- **AND** el sitio renderiza normalmente

#### Scenario: Entorno sin credenciales

- **WHEN** la aplicación corre sin variables de entorno de Supabase
- **THEN** funciona contra la configuración sembrada
- **AND** el modo de desarrollo sigue siendo posible sin backend

### Requirement: El prerender usa una fuente determinista

El prerender del build SHALL producir el mismo HTML para la misma versión del
código, sin depender de la base.

#### Scenario: Build sin credenciales

- **WHEN** el build corre en integración continua sin acceso a la base
- **THEN** el prerender usa la configuración sembrada
- **AND** completa las rutas públicas con contenido

#### Scenario: Corrección al hidratar

- **WHEN** el navegador carga una página prerenderizada de un dominio de tenant
- **THEN** la configuración real del tenant se aplica al hidratar

### Requirement: Solo se expone la configuración pública

La lectura anónima de un tenant SHALL limitarse a lo que el sitio necesita para
pintarse.

#### Scenario: Lectura anónima

- **WHEN** un cliente anónimo consulta la configuración de un tenant activo
- **THEN** recibe marca, contacto, parámetros comerciales, categorías, tema,
  banderas y copy
- **AND** no recibe pedidos, clientas, pagos ni miembros del tenant

#### Scenario: Tenant no activo

- **WHEN** el tenant está pausado o cancelado
- **THEN** su configuración no se sirve a clientes anónimos
