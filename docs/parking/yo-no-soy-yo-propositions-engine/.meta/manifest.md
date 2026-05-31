# Manifest Nave: yo-no-soy-yo-propositions-engine

- **Propósito**: Aplicación web de una sola página (SPA) dinámica para visualizar y explorar el `mapa.md` y `mapa.graph.json` desde un dossier.
- **Cómo se lanza**: Servidor HTTP estático (`npm run ynsy-engine:start` o `python -m http.server`) apuntando a la carpeta `nave/`. Abre `index.html`.
- **Formatos que abre**: Archivos Markdown y JSON. Convierte a HTML dinámicamente usando `marked.js` y renderiza grafos SVG interactivos.
- **Autor/Modelo**: Gemini 3.1 Pro (High) (2026-05-31)
- **Dependencias**: Navegador moderno, HTML5. Sin librerías pesadas para grafo (motor SVG puro integrado).
- **Tasa de cambio**: Estacionario.
