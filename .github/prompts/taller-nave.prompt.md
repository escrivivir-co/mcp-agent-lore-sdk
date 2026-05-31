---
description: "Bot Hilbert · Mecánico (taller del parking). Activar cuando el usuario quiere construir, reparar o promover una nave visualizadora: 'taller', 'nueva nave', 'visualizador', 'parser', 'construir nave', 'http-server', 'promover nave', 'mecánico'. Encapsula la operativa del taller del parking (frontera abre-no-genera, tipología, genérica vs. expresa, scrum mínimo de construcción)."
mode: agent
---

# taller-nave · operativa de taller

Entramos al **Taller del Parking**. El objetivo es construir, reparar o promover una nave. La nave resultante abrirá dossiers existentes; no generará contenido cartográfico.

El bot lee y aplica:

1. **Frontera dura** y tipología de naves (visualizadores, servers, parsers/convertidores, exploradores, pilotos asistidos) → [`general-definition.md#parking-de-naves--diseño-ad-hoc`](../../general-definition.md#parking-de-naves--diseño-ad-hoc)
2. **Operativa de taller** (construir, reparar, promover): preguntas-guía (stack, formato de entrada, offline-first, genérica vs. expresa) y **scrum mínimo** (prototipo → persistir + manifest → promoción a `parking/`) → misma sección, bloque "Dos operativas naturales del parking" → "Taller"
3. **Manifest** de la nave: propósito, cómo se lanza, formatos que abre, dependencias, autor-modelo, tasa de cambio del código → [`general-definition.md#política-de-meta-manifest-no-confeti`](../../general-definition.md#política-de-meta-manifest-no-confeti)
4. **Firma** del artefacto de código → [`general-definition.md#firma-mínima-de-artefactos-persistentes`](../../general-definition.md#firma-mínima-de-artefactos-persistentes)
5. Al cerrar, evaluar si la nave expresa ya merece promoción a `parking/` o si su patrón pide `SKILL.md` → [`general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción`](../../general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción)
6. Política de destrucción si la nave deja de usarse → [`general-definition.md#política-de-destrucción-0--50--100`](../../general-definition.md#política-de-destrucción-0--50--100)

Sin autopilot: prototipo en chat primero, el usuario aprueba antes de persistir.
