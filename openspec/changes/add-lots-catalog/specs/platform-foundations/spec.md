# Platform Foundations — Delta

## ADDED Requirements

### Requirement: Todo estado de carga tiene salida

Ninguna superficie SHALL quedar indefinidamente en estado de carga. Toda consulta
SHALL resolver a contenido, a estado vacío o a error con reintento.

#### Scenario: Consulta con resultados

- **WHEN** una consulta devuelve datos
- **THEN** se muestra el contenido y desaparece el indicador de carga

#### Scenario: Consulta sin resultados

- **WHEN** una consulta devuelve cero resultados
- **THEN** se muestra un estado vacío que explica la situación
- **AND** no se deja un indicador de carga en pantalla

#### Scenario: Consulta que falla

- **WHEN** una consulta falla
- **THEN** se muestra un mensaje de error y una acción de reintento
- **AND** el resto de la página sigue siendo utilizable

#### Scenario: Consulta que no responde

- **WHEN** una consulta supera el tiempo límite definido
- **THEN** se trata como error y se ofrece reintento
- **AND** el indicador de carga desaparece

### Requirement: Rutas dinámicas fuera del prerender

Las rutas con parámetro NO SHALL bloquear el prerender del build, y su ausencia
SHALL estar declarada, no ser un descuido.

#### Scenario: Build con rutas dinámicas

- **WHEN** corre el prerender
- **THEN** genera las rutas públicas estáticas
- **AND** omite las rutas con parámetro sin fallar

#### Scenario: Contenido indexable de la lista

- **WHEN** un cliente solicita la ruta de catálogo sin ejecutar JavaScript
- **THEN** recibe la explicación del proceso y de lo que incluye el precio
- **AND** ese contenido no depende de que existan elementos publicados
