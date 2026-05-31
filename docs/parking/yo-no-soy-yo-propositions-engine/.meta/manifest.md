# Manifest Nave: yo-no-soy-yo-propositions-engine

- **Versión**: 2.0.0
- **Propósito**: Aplicación web de una sola página (SPA) dinámica para visualizar y explorar el `mapa.md` y `mapa.graph.json` desde un dossier.
- **Cómo se lanza**: Servidor HTTP estático (`npm run ynsy-engine:start` o `python -m http.server`) apuntando a la carpeta `nave/`. Abre `index.html`.
- **Formatos que abre**: Archivos Markdown y JSON. Convierte a HTML dinámicamente usando `marked.js` y renderiza grafos SVG interactivos.
- **Autor/Modelo**: Gemini 3.1 Pro (High) (v1.x); Claude Sonnet 4.6 (v2.0.0, 2026-05-31)
- **Dependencias**: Navegador moderno, HTML5. Sin librerías pesadas para grafo (motor SVG puro integrado).
- **Tasa de cambio**: Estacionario.

## Changelog

### v2.0.0 · 2026-05-31 · Claude Sonnet 4.6
- Nueva tab **Eigenstates**: catálogo con filtros por capa; tarjetas `.eigen-card` con axiomas, referencias y pills de forks/crossrefs
- Nueva tab **Galería**: 4 assets con lightbox accesible (ESC / click-fuera / botón ×)
- Nueva tab **Forks**: tabla de todas las aristas filtrables por símbolo operativo (⊢ ⊬ ⊘ ⥱ ⟲ ≈ alias bridges)
- Nav expandido con dropdown **Threads ▾** (Thread 1 / Thread 2 / Vista Total / Sub-espectro R/N/RN)
- Sidebar `showNodeDetail()` enriquecido: axiomas, referencias, pills de forks y crossrefs
- Capa `rojo-negro` añadida a `activeLayers` por defecto; toggles con etiquetas en `LAYER_LABELS`
- Grafo: gravedad por clúster (`LAYER_CENTERS`) + viewBox 1000×900; colores de nodo por capa; etiquetas de capa en SVG
- CSS: `.nav-dropdown`, `.lightbox`, `.crossref-pill`, `.crossref-pill--alias`

### v1.0.0 · 2026-05-31 · Gemini 3.1 Pro
- SPA inicial: tabs Corpus / General / Mapa / Thread 1 / Thread 2 / Vista Total
