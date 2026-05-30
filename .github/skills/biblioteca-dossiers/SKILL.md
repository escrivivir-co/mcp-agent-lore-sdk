---
name: biblioteca-dossiers
description: "Heurísticas ad hoc de diseño de la biblioteca de dossiers-mapa de Bot-Hilbert (cartógrafo, suite Scriptorium): señales de cuándo conviene biblioteca vs one-shot, preguntas-guía antes de escribir, menú abierto de formatos-soporte ↔ parser pareja, versionado v00 → v01 y forks, señales de maduración para promover a customizations. Use when el cartógrafo entra a crear, extender o reorganizar un dossier-<tema>-v00-<tag>/ o decide qué soporte literario comprometer con un tema."
user-invocable: false
---

### Biblioteca de dossiers-mapa · diseño ad hoc

Esta sección no es un checklist. Es un menú de señales y preguntas-guía que el cartógrafo activa cuando huele que el usuario está dejando de ser one-shot.

**Señales de que toca biblioteca** (basta con una, no hace falta el combo):

- el usuario vuelve a un tema ya tocado;
- pide "guardar", "mantener", "volver mañana";
- el tema tiene tasa de cambio rápida (día / minuto) y conviene capturar snapshots versionados;
- hay varios sub-temas que el usuario quiere comparar lado a lado;
- el modelo intuye que la sesión va a generar más material del que cabe en una ventana de contexto.

**Preguntas que el cartógrafo lanza antes de escribir un solo byte de dossier**:

- ¿un único dossier que crece, o varios pequeños federados por un `catalogo.md` raíz?
- ¿qué soporte literario propone el tema? (tabla, ensayo, poema, grafo, dataset, sistema de ecuaciones, partitura, diapos, cómic, libreto…). Una vez consensuado, **comprometerse** con él en esa versión.
- ¿`itinerarios/` por fecha-sesión, por sub-tema, o por viajero?
- ¿persistencia 0% / 50% / 100% meta? (gradar con [`#política-de-meta-manifest-no-confeti`](#política-de-meta-manifest-no-confeti)).
- versionado: ¿`v00 → v01` cuando cambia el soporte literario o el axioma rector; **fork** a `dossier-<tema>-v00-<tag-bis>/` cuando el sub-tema rompe la coherencia del padre?

**Menú abierto de formatos-soporte ↔ parser pareja** (sugestivo, no cerrado; el cartógrafo es libre de inventar el suyo):

| Soporte del mapa | Parser / nave pareja típica |
|---|---|
| tabla `mapa.md` | export CSV / JSON; nave de filtrado y orden |
| grafo `mapa.graph.json` | visualizador D3 / cytoscape / three.js |
| ensayo `mapa.md` con anclas densas | índice de anclas + buscador full-text |
| poema / glosario denso | tarjetero (anki-like) + leyenda expandida |
| dataset `mapa.csv` / `mapa.parquet` | notebook exploratorio + dashboard |
| sistema de ecuaciones | sympy / desmos / geogebra embebido |
| partitura / audio | reproductor + transcripción sincronizada |
| diapos / cómic / libreto | reveal.js / lector de viñetas / lectura escénica |

**Señales de maduración** (cuando promover convención emergente):

- un mismo patrón aparece en ≥2 dossiers → candidato a `*.instructions.md` con `applyTo` quirúrgico;
- un mismo asset (plantilla, parser, dataset semilla) se copia entre dossiers → candidato a `SKILL.md` con su carpeta;
- una validación se repite a mano antes de cada commit (firma, anclas, manifest) → candidato a hook;
- una fuente externa empieza a ser necesaria en cada apertura → candidato a MCP server.

Puente al [`general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia`](../../../general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia).

