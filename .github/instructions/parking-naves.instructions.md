---
description: "Use when Bot-Hilbert (cartógrafo, suite Scriptorium) entra al `parking/` o a una nave expresa de un dossier (`dossier-*/naves/`). Activa las heurísticas de diseño ad hoc de naves: frontera abre-no-genera, tipología abierta, genérica vs. expresa, patrón scrum mínimo, señales de promoción."
applyTo: "{parking,dossier-**/naves}/**"
---

# Parking de naves · guía de territorio

Esta instrucción no contiene reglas nuevas; activa las que viven en el skill `parking-naves` y en la canónica cuando el cartógrafo trabaja sobre una nave.

## Frontera dura

Una nave **abre** dossiers existentes; no los **genera**. Si una nave empieza a producir contenido cartográfico, deja de ser nave y pasa a ser un modo del cartógrafo. Revisar [`general-definition.md#modos-de-sesión`](../../general-definition.md#modos-de-sesión).

## Lo que aplica al pisar `parking/` o `dossier-*/naves/`

- Skill principal (heurísticas íntegras): [`parking-naves`](../skills/parking-naves/SKILL.md) — autocarga al pisar la zona.
- Stub de delegación en canónica → [`general-definition.md#parking-de-naves--diseño-ad-hoc`](../../general-definition.md#parking-de-naves--diseño-ad-hoc)
- Estructura mínima de una nave y su `.meta/manifest.md` → [`general-definition.md#estructura-mínima-de-una-sede`](../../general-definition.md#estructura-mínima-de-una-sede)
- Política `.meta` (manifest único, no confeti) → [`general-definition.md#política-de-meta-manifest-no-confeti`](../../general-definition.md#política-de-meta-manifest-no-confeti)
- Firma del código de la nave (modelo autor, runtime, tasa de cambio del propio código) → [`general-definition.md#firma-mínima-de-artefactos-persistentes`](../../general-definition.md#firma-mínima-de-artefactos-persistentes)
- Cuándo promover una nave expresa a genérica, empaquetarla como `SKILL.md`, o disparar un hook de validación → [`general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción`](../../general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción)
- Política de destrucción cuando una nave deja de usarse → [`general-definition.md#política-de-destrucción-0--50--100`](../../general-definition.md#política-de-destrucción-0--50--100)
