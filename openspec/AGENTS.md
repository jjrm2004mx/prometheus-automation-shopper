# AGENTS.md — Instrucciones para asistentes de IA

Este proyecto usa **OpenSpec**: la especificación es la fuente de verdad; el
código la implementa.

## Estructura

```
openspec/
├── project.md              # Contexto del proyecto (leer siempre primero)
├── AGENTS.md               # Este archivo
├── specs/                  # Capacidades ya desplegadas — el "ahora"
│   └── <capability>/spec.md
└── changes/                # Cambios propuestos — el "después"
    └── <change-id>/
        ├── proposal.md
        ├── tasks.md
        ├── design.md       # opcional
        └── specs/<capability>/spec.md   # deltas
```

## Reglas

1. **Antes de escribir código**, lee `project.md` y el `spec.md` de la capacidad
   que vas a tocar.
2. **Un cambio de comportamiento = un delta en `changes/`.** No edites
   `specs/**/spec.md` directamente; escribe el delta y archívalo cuando se
   despliegue.
3. **Formato obligatorio de los specs**:
   - `### Requirement: <nombre>` — descriptivo, menos de 50 caracteres, redactado
     con `SHALL`.
   - `#### Scenario: <descripción>` — al menos uno por requisito.
   - Viñetas con `**GIVEN**` (opcional), `**WHEN**`, `**THEN**`, `**AND**`.
4. **Formato de deltas** en `changes/<id>/specs/<capability>/spec.md`:
   `## ADDED Requirements`, `## MODIFIED Requirements`,
   `## REMOVED Requirements`, `## RENAMED Requirements`.
   Los requisitos se emparejan por el texto exacto del encabezado
   `### Requirement:`.

## Convenciones de este proyecto

- **Ningún valor de negocio literal.** Comisión, mínimos, montos, marca, banco y
  categorías vienen de la configuración del tenant (ver `tenant-configuration`).
- **El aislamiento entre tenants se resuelve con RLS**, nunca ocultando interfaz.

- El producto se escribe en **español mexicano** (`es-MX`); USA Drops en inglés.
  Los specs se escriben en español, las palabras clave (`SHALL`, `WHEN`, `THEN`,
  `AND`, `GIVEN`) permanecen en inglés porque OpenSpec las parsea.
- Toda conversión MXN↔USD pasa por el tipo de cambio vigente del sistema. Nunca
  escribas un tipo de cambio literal en el código ni en el contenido.
- Ninguna pieza se compra sin aprobación explícita de la clienta. Cualquier
  cambio que rompa esa regla necesita un delta explícito y aprobación.
- Ocultar la interfaz no es control de acceso: la autorización se resuelve con
  políticas RLS en Supabase.

## Estado de confianza de los specs

| Capacidad | Confianza |
|---|---|
| `tenant-configuration`, `tenant-resolution`, `platform-foundations` | Alta — implementadas y verificadas en el build |
| `marketing-site`, `order-intake`, `booking-and-deposit`, `pre-appointment`, `pricing-and-numbers`, `shipping-and-delivery` | Alta — derivadas de un sitio real e implementadas aquí |
| `lots-catalog`, `live-purchase-session` | Media — especificadas, aún no implementadas |
| `shopper-onboarding` | Media — especificada, la consola está pendiente |
