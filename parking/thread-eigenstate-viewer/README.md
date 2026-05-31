# thread-eigenstate-viewer

Visualizador web del corpus `yo-no-soy-yo-propositions-engine`: overview, mapa relacional de eigenstates, dos threads y la captura fuente.

## Uso rápido

```bash
node parking/thread-eigenstate-viewer/server.cjs
```

Por defecto abre `examples/yo-no-soy-yo-propositions-engine/` y sirve en `http://127.0.0.1:43127/`.

## Parámetros

- `CORPUS_PATH`: ruta absoluta o relativa al directorio del corpus. Default `examples/yo-no-soy-yo-propositions-engine`.
- `PORT`: puerto inicial. Si está ocupado prueba +1, +2, +3.

```bash
CORPUS_PATH=dossier-yo-no-soy-yo-v00-propositions-engine \
PORT=5050 \
node parking/thread-eigenstate-viewer/server.cjs
```

## Estructura

```
thread-eigenstate-viewer/
├── server.cjs           # parser + render + http
├── public/
│   ├── styles.css       # estilos B/N Courier
│   └── layout.html      # shell con placeholders {{TITLE}}, {{NAV}}, {{BODY}}, {{FOOTER}}, {{CORPUS_NAME}}
├── data/
│   └── graph.json       # nodos + edges del mapa relacional
└── .meta/manifest.md
```

## Convenciones que asume del corpus

| Archivo | Rol |
|---|---|
| `context.md` | Captura fuente con secciones `Original Poster`, `Thread 1 — …`, `Thread 2 — …` y bloques `![alt](./asset.png)` seguidos de `<ALT: …>` |
| `thread1-cartografia.md` | Cartografía con `## Eigenstates` (tabla), `## Correccion de marco`, `## Mapa relacional`, `## Etiqueta del conflicto`, etc. |
| `thread2-cartografia.md` | Idem para el segundo hilo |
| `*.png` | Imágenes referenciadas por el `context.md` |

Si el corpus no respeta esa silueta el visor degrada con paneles vacíos en lugar de romperse.

## Rutas

- `/?view=overview|graph|thread1|thread2|context` — vistas HTML
- `/?view=graph&focus=<node-id>` — foco del mapa relacional (ids en `data/graph.json`)
- `/static/styles.css` — hoja de estilos
- `/asset/<file>` — imágenes whitelisted del corpus
- `/api/data` — JSON parseado completo

## Estado

Expresa de facto para `yo-no-soy-yo-propositions-engine`. Si abre un segundo corpus sin tocar parser, queda confirmada como genérica.
