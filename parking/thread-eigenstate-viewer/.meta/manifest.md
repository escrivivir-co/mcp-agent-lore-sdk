# manifest · thread-eigenstate-viewer

- **Tipo**: nave web (visualizador + parser de corpus markdown).
- **Frontera**: abre dossiers existentes; no genera contenido cartográfico.
- **Lanzamiento**: `node parking/thread-eigenstate-viewer/server.cjs` (opcional `CORPUS_PATH=`, `PORT=`). Extensión `.cjs` porque la sede está en `type=module`.
- **Corpus por defecto**: `examples/yo-no-soy-yo-propositions-engine/`.
- **Formatos que abre**: directorio con `context.md`, `threadN-cartografia.md` y assets `.png`. Convenciones detalladas en `../README.md`.
- **Estructura interna**: `server.cjs` (parser + render + http) · `public/styles.css` + `public/layout.html` (presentación) · `data/graph.json` (nodos + edges del mapa relacional).
- **Dependencias**: ninguna fuera de Node.js estándar (`http`, `fs`, `path`, `url`). Offline-first.
- **Salidas**: HTML servido desde plantilla + `/static/styles.css` + `/api/data` (JSON parseado) + `/asset/<file>` (imágenes whitelisted).
- **Tasa de cambio del código**: media; estabilizar parser cuando abra un segundo corpus.
- **Estado de tipología**: expresa de facto para `yo-no-soy-yo-propositions-engine`; se reclasificará como genérica al abrir un segundo corpus sin tocar parser.
- **Política de destrucción**: si pasa 90 días sin uso registrado en `itinerarios/` de algún dossier que la invoque, evaluar destrucción 0% (borrado total) o 50% (mover a `naves/` del dossier al que sirva).
- **Promoción posible**: si crece con plantillas, parser dedicado y assets propios, candidata a `SKILL.md` empaquetable.

## Firma

```
firma:
  modelo: Claude Opus 4.7 (Anthropic)
  vendor: github-copilot
  fecha: 2026-05-31
  rol: Mecánico · sub-agente taller del parking
  sesion: inicialización a partir de prototipo volátil sobre ARCHIVO/yo-no-soy-yo-propositions-engine
  zonas-oscuras: corpus anglo-céntrico del modelo; verificar referencias bibliográficas si la nave sirve material público
```

## Cambios

- 2026-05-31 · v0.2 · Claude Opus 4.7 · Extracción de presentación a `public/styles.css` + `public/layout.html`; extracción de datos del grafo a `data/graph.json`. Subsumida la vista `migration` (el corpus ya migró). Cambiado default `CORPUS_PATH` a `examples/yo-no-soy-yo-propositions-engine`. Eliminada paratextualidad de prompt (tagline, stamp, eyebrow `Visualizador fanzine`, título `YO NO SOY YO & OTROS ZURCIDOS`).
- 2026-05-31 · v0.1 · Claude Opus 4.7 · Inicialización desde prototipo volátil con estética B/N + Courier New, parser de secciones, parametrización por `CORPUS_PATH`/`PORT`.
