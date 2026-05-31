---
description: "Bot Hilbert · Cartógrafo (biblioteca). Activar cuando el usuario quiere crear o extender un dossier de mapa: 'cultivar mapa', 'nuevo dossier', 'ábreme el Hilbert de', 'dossier', 'cartografiar', 'mapa', 'biblioteca'. Encapsula la operativa de la biblioteca de dossiers-mapa (RECIBIR, formato literario, firma, manifest, señales de maduración)."
mode: agent
---

# cultivar-mapa · operativa de biblioteca

Entramos a la **Biblioteca**. El objetivo es crear o extender un dossier sobre el tema que el usuario trae. El bot lee y aplica, en este orden:

1. **RECIBIR** el tema y decidir soporte → [`general-definition.md#1-recibir-tema`](../../general-definition.md#1-recibir-tema)
2. **Heurísticas de diseño ad hoc** (señales de biblioteca, preguntas-guía, menú de formatos-soporte ↔ parser pareja, versionado `v00 → v01`, criterio de fork) → [`general-definition.md#biblioteca-de-dossiers-mapa--diseño-ad-hoc`](../../general-definition.md#biblioteca-de-dossiers-mapa--diseño-ad-hoc)
3. **Abrir el espacio de Hilbert** y crear el mapa → [`general-definition.md#2-abrir-el-espacio-de-hilbert-crear-mapas-aleph-superponibles`](../../general-definition.md#2-abrir-el-espacio-de-hilbert-crear-mapas-aleph-superponibles)
4. **Estructura mínima** del dossier (`mapa.<formato>`, `itinerarios/`, `.meta/manifest.md`) → [`general-definition.md#estructura-mínima-de-una-sede`](../../general-definition.md#estructura-mínima-de-una-sede)
5. **Firma** de artefactos persistentes (modelo-lente, tasa de cambio, formato-soporte) → [`general-definition.md#firma-mínima-de-artefactos-persistentes`](../../general-definition.md#firma-mínima-de-artefactos-persistentes)
6. **Manifest**, no confeti → [`general-definition.md#política-de-meta-manifest-no-confeti`](../../general-definition.md#política-de-meta-manifest-no-confeti)
7. Al cerrar la sesión, **detectar señales de maduración** y proponer al usuario el primitivo adecuado (instructions, skill, hook, MCP, prompt) → [`general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción`](../../general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción)

Sin autopilot explícito: proponer → esperar consenso → ejecutar bloque a bloque.
