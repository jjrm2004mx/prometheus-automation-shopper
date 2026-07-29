# Tenant Resolution Specification

## Purpose

Determinar de qué shopper es cada visita y garantizar que ninguna vea los datos
de otra. Es el requisito de seguridad central del producto: todo lo demás
descansa aquí.

## Requirements

### Requirement: Resolución por dominio

El tenant SHALL determinarse a partir del hostname de la petición.

#### Scenario: Dominio propio

- **WHEN** una visitante entra por el dominio verificado de una shopper
- **THEN** se sirve la configuración de esa shopper
- **AND** el prefijo `www.` se ignora al comparar

#### Scenario: Subdominio de la plataforma

- **WHEN** el hostname no coincide con ningún dominio registrado pero su primer
  segmento coincide con el slug de un tenant
- **THEN** se resuelve ese tenant

#### Scenario: Dominio desconocido

- **WHEN** el hostname no corresponde a ningún tenant
- **THEN** se sirve una página de plataforma, no un error ni un tenant al azar
- **AND** la resolución nunca lanza una excepción

### Requirement: Previsualización explícita

SHALL existir una forma de previsualizar un tenant sin su dominio, y esa forma
NO SHALL otorgar acceso a datos.

#### Scenario: Previsualización por parámetro

- **WHEN** se abre la plataforma con `?tenant=<slug>`
- **THEN** se pinta la configuración pública de ese tenant
- **AND** no se expone ningún pedido, cliente ni pago

### Requirement: Aislamiento de datos en la base

Toda tabla de operación SHALL llevar `tenant_id` y SHALL estar protegida por RLS
que restrinja el acceso a los miembros de ese tenant.

#### Scenario: Consulta autenticada

- **WHEN** una shopper autenticada consulta pedidos
- **THEN** solo recibe los pedidos de su propio tenant
- **AND** manipular el filtro del lado del cliente no cambia el resultado

#### Scenario: Consulta anónima

- **WHEN** un cliente anónimo consulta las tablas de operación
- **THEN** no recibe ninguna fila
- **AND** las únicas lecturas anónimas permitidas son la configuración pública
  del tenant, sus dominios, sus lotes publicados y el tipo de cambio

#### Scenario: Intento de acceso cruzado

- **WHEN** una shopper intenta leer o escribir datos de otro tenant
- **THEN** la base lo rechaza
- **AND** el rechazo ocurre en la política RLS, no en la interfaz

### Requirement: Portales de clienta por token

El acceso de una clienta a su pedido SHALL resolverse con un token opaco a
través del servidor, nunca con lectura directa de tabla.

#### Scenario: Token válido

- **WHEN** una clienta abre su portal con un token válido
- **THEN** el servidor valida el token y devuelve únicamente ese pedido

#### Scenario: Token inválido

- **WHEN** el token no existe o fue revocado
- **THEN** no se devuelve ningún dato
- **AND** la respuesta no revela si el token existió alguna vez

### Requirement: Verificación de dominios

Un dominio SHALL servir a un tenant solo después de verificarse.

#### Scenario: Dominio sin verificar

- **WHEN** un dominio está registrado pero sin verificar
- **THEN** no resuelve al tenant
- **AND** se evita que alguien reclame un dominio ajeno
