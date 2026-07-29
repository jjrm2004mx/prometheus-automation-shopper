# Project Context — Plataforma para personal shoppers

## Purpose

Producto multi-tenant que le da a una personal shopper todo lo que necesita para
vender un servicio de sourcing: sitio público, asistente de pedido, apartado por
transferencia, preparación previa a la cita, captura de envío y calculadora de
costos — configurado por ella, sin escribir código.

Una base de código, una base de datos, N shoppers. Cada una con su dominio, su
marca, su comisión y sus categorías.

## Origen

El producto nace de la ingeniería inversa de un sitio real en producción
(`eduardosourcing.com`, julio 2026): 127 rutas, 151 tablas, 26 Edge Functions.
Ese análisis aportó el modelo de negocio y los flujos que funcionan. También
aportó tres problemas estructurales que aquí son requisitos explícitos:

| Problema del original | Requisito en este producto |
|---|---|
| SPA sin SSR: el HTML llegaba vacío y Google no veía el contenido | `platform-foundations` — prerender verificado en el build |
| Bundle de 6.32 MB con el back office completo expuesto al público | `platform-foundations` — presupuesto < 500 KB, consola en chunk aparte |
| Dos tipos de cambio simultáneos ($18.14 vs $20.00) | `platform-foundations` — un solo valor vigente, tasa congelada por pedido |
| `user-scalable=no` bloqueaba el zoom | `platform-foundations` — zoom siempre permitido |

## Modelo mental

- **Plataforma**: el código y la base de datos. Se despliega una vez.
- **Tenant**: una shopper. Es una fila en `tenants` más su configuración.
- **Clienta**: quien le compra a la shopper. No tiene cuenta; accede por tokens.

## Stack

| Capa | Elección |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS sobre tokens HSL aplicados en runtime |
| Routing | React Router |
| Prerender | Script de build con Playwright, un HTML por ruta pública |
| Backend | Supabase — Postgres con RLS, Auth, Storage, Edge Functions |
| Tipo de cambio | Fuente diaria con caché y degradación a valor manual |

## Convenciones

- **Ningún valor de negocio literal en el código.** Comisión, mínimos, montos,
  marca, banco y categorías vienen de la configuración del tenant.
- **Ningún color literal.** Todo pasa por tokens CSS.
- **Cada texto tiene una clave** en `src/content/copy.ts` y el tenant puede
  sobrescribirla.
- **El aislamiento entre tenants se resuelve con RLS**, nunca ocultando UI.
- **Las clientas no leen tablas.** Sus portales pasan por Edge Function que
  valida el token.
- **La tasa se congela en el pedido**: los números que ya vio la clienta no
  cambian solos.

## Estado actual del código

Implementado y verificado en build:

- Resolución de tenant por dominio, subdominio y previsualización
- Sitio público: home, cómo funciona, números, preguntas, sobre, lotes
- Asistente de pedido de 10 pasos con ramificación y borrador persistente
- Apartado por transferencia y calendario bloqueado hasta validar
- Checklist bloqueante previo a la cita
- Captura de envío con validación
- Calculadora de costo aterrizado con prorrateo proporcional
- Prerender de 10 rutas públicas, verificado en el build
- Esquema SQL con RLS por tenant

Pendiente:

- Consola de la shopper (alta, configuración, pedidos)
- Persistencia real de pedidos contra Supabase (hoy el asistente termina local)
- Calendario de citas
- Módulo de lotes con inventario
- Notificaciones
