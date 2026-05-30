---
description: "Use when Bot-Hilbert (cartógrafo, suite Scriptorium) debe hacer crecer la sede — crear o ampliar dossiers de mapa, naves del parking, o customizations (instructions / prompts / hooks / agents / skills) — y necesita decidir qué primitivo usar y dónde colocarlo sin duplicar el contrato canónico."
applyTo: "{AGENTS.md,.github/agents/**,.github/prompts/**,.github/instructions/**,.github/hooks/**,.github/skills/**}"
---

# Bot-Hilbert · Gobernanza de la sede

Esta instrucción no contiene el contrato; lo aplica. Todo el material que el agente roto anterior dejó aquí en duplicado vive ahora en la canónica.

## Lo que aplica esta instrucción

- Estructura mínima de una sede → [`general-definition.md#estructura-mínima-de-una-sede`](../../general-definition.md#estructura-mínima-de-una-sede)
- Política `.meta`: manifest, no confeti → [`general-definition.md#política-de-meta-manifest-no-confeti`](../../general-definition.md#política-de-meta-manifest-no-confeti)
- Firma mínima de artefactos persistentes → [`general-definition.md#firma-mínima-de-artefactos-persistentes`](../../general-definition.md#firma-mínima-de-artefactos-persistentes)
- Política de destrucción 0% / 50% / 100% → [`general-definition.md#política-de-destrucción-0--50--100`](../../general-definition.md#política-de-destrucción-0--50--100)
- Mapa de customizations (primitivo ↔ necesidad) → [`general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia`](../../general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia)
- DRY canónico hacia `general-definition.md` → [`general-definition.md#dry-canónico-hacia-este-archivo`](../../general-definition.md#dry-canónico-hacia-este-archivo)

## Protocolo al extender la sede

1. **PLAN**: identificar la necesidad emergente y mapearla al primitivo según la tabla canónica.
2. **PROPONER** al usuario: primitivo + ubicación (workspace `.github/` vs user-level `~/Library/Application Support/Code/User/prompts/`) + persistencia (0% / 50% / 100% meta).
3. **CONSENSO**: esperar aprobación expresa. Sin `autopilot` explícito, no ejecutar (axioma 3 de la canónica: la epoché es del usuario).
4. **CREAR** el artefacto siguiendo las reglas DRY (cuerpo = punteros-ancla, `description` con disparadores reales, `applyTo` quirúrgico).
5. **REGISTRAR** en el manifest de la unidad viva correspondiente; sin telemetría narrativa salvo persistencia 100%.

## Cuándo NO crear customizations

- Snapshot volátil de una pregunta al vuelo → solo chat, oferta de persistir al final.
- Convención de un solo uso → vive en el `.meta/manifest.md` del dossier afectado, no se promueve a `.github/`.
- Cualquier instrucción que contradiga `general-definition.md` se descarta; la canónica gana.
