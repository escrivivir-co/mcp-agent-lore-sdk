---
name: parking-naves
description: "Heurísticas ad hoc de diseño y operación de naves del parking de Bot-Hilbert (cartógrafo, suite Scriptorium). Una nave es una herramienta reejecutable (visualizador, parser, server, explorador, piloto asistido) que abre dossiers existentes; nunca genera contenido cartográfico. Use when el cartógrafo entra a parking/ o a dossier-*/naves/, propone construir/reparar/promover una nave (operativa Taller), o selecciona y pilota una nave existente sobre un dossier (operativa Garaje/pista)."
user-invocable: false
---

### Parking de naves · diseño ad hoc

Misma lógica: menú y señales, no protocolo.

**Frontera dura**: una nave **abre** dossiers existentes; no los **genera**. Si una "nave" empieza a producir contenido cartográfico, deja de ser nave y pasa a ser un modo del cartógrafo (revisar [`general-definition.md#modos-de-sesión`](../../../general-definition.md#modos-de-sesión)).

**Tipología sugerida** (abierta, el cartógrafo extiende):

- **Visualizadores**: D3, cytoscape, three.js para Hilbert 3D, reveal.js para diapos, lectores de cómic, partituras.
- **Servers**: `http-server`, vite dev, file-watchers que recargan al editar.
- **Parsers / convertidores**: `mapa.md ↔ mapa.graph.json`, exportador a PDF, sincronizador con Obsidian / Logseq / Roam.
- **Exploradores**: TUI con `grep + jq` sobre el grafo, REPL que carga el dossier y permite consultas, buscador semántico local.
- **Pilotos asistidos**: nave que abre un dossier y propone itinerarios sugeridos (ergosferas pendientes, horizontes de sucesos no visitados).

**Genéricas vs. expresas**:

- **Genérica** → `parking/<nave-id>/` · sirve para cualquier dossier compatible con un formato (p.ej. todos los `mapa.graph.json`).
- **Expresa** → `dossier-<tema>-v00-<tag>/naves/<nave-id>/` · depende de la estructura íntima de ese dossier (campos propios, axiomas locales). Cuando se generaliza, se promueve a `parking/`.

**Preguntas-guía antes de construir**:

- ¿html estático autocontenido o necesita server local?
- ¿qué formato(s) de entrada acepta? ¿uno solo o familia?
- ¿offline-first o depende de red / CDN / APIs?
- ¿basta una sesión de pilotaje, o conviene un mini-tutorial en `itinerarios/` del dossier que estrena la nave?
- ¿stack mínimo (HTML+JS plano) o framework? Preferencia por mínimo viable hasta que el uso pida más.

**Patrón scrum mínimo** (sin dogma):

1. Prototipo de un disparo en chat o sandbox (sin persistir).
2. Si al usuario le sirve, persistir + `manifest.md` con: qué formatos abre, cómo se lanza, dependencias, autor-modelo, tasa de cambio del propio código de la nave.
3. Si se reutiliza en ≥2 dossiers, promover a `parking/` (si era expresa) o anotarla en `parking/.meta/manifest.md` como nave estable.
4. Si deja de usarse, aplicar [`general-definition.md#política-de-destrucción-0--50--100`](../../../general-definition.md#política-de-destrucción-0--50--100).

**Dos operativas naturales del parking** (el cartógrafo las lee como bifrontal):

- **Taller** — se entra a **construir, reparar o promover** una nave: escribir código, consensuar stack, persistir manifest, decidir genérica vs. expresa. La nave todavía no existe o necesita cirugía. Escritura de código + manifest.
- **Garaje / pista** — se entra a **seleccionar y pilotar** una nave existente sobre un dossier: inventario de `parking/` y `dossier-*/naves/`, elección de nave compatible (o decisión de viajar en seco), apertura del dossier, registro del itinerario. Solo lectura sobre las naves.

