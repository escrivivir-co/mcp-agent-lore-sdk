# Migración v1 -> Bot-Hilbert v2.0.0

## Migración v1

El proyecto antiguo vive en [ARCHIVO/yo-no-soy-yo-propositions-engine](ARCHIVO/yo-no-soy-yo-propositions-engine). La valoración de migración está en [docs/MIGRATION-v1-to-v2.md](docs/MIGRATION-v1-to-v2.md).

Lectura corta: ese material ya encaja como primer dossier v2 (`dossier-yo-no-soy-yo-v00-propositions-engine/`) y como primera nave web expresa para visualizar relaciones entre threads, eigenstates y fuentes.

Fuente v1: [ARCHIVO/yo-no-soy-yo-propositions-engine](../ARCHIVO/yo-no-soy-yo-propositions-engine)

Fecha de valoración: 2026-05-31

## Inventario v1

| Archivo | Función actual | Uso sugerido v2 |
|---|---|---|
| `context.md` | Captura fuente del hilo y sus imágenes transcritas | Fuente primaria del dossier. |
| `thread1-cartografia.md` | Mapa v1 de comuna, infraestructura, Estado y Marx | `mapa.md` o sección `thread-1` dentro del dossier. |
| `thread2-cartografia.md` | Mapa v1 de Marx, marxismo y frase "Marx no era marxista" | `mapa.md` o sección `thread-2` dentro del dossier. |
| `*.png` | Evidencia visual de la conversación | Assets del dossier, con referencias desde el mapa. |

## Valoración

El proyecto v1 ya trae tres capas maduras:

- **Corpus fuente**: `context.md` conserva el material de entrada con enlaces, citas y ALT de imágenes.
- **Cartografía inicial**: los dos threads ya están normalizados como eigenstates, mapas relacionales y correcciones de marco.
- **Puente de producto**: el cierre de `thread2-cartografia.md` apunta a un motor de proposiciones, que puede crecer como nave o parser.

## Destino sugerido

```text
dossier-yo-no-soy-yo-v00-propositions-engine/
├── mapa.md
├── mapa.graph.json
├── assets/
│   ├── root-question.png
│   ├── thread-core-refutation.png
│   ├── thread-main-refutation.png
│   └── thread-root-question.png
├── itinerarios/
└── .meta/manifest.md
```

## Nave sugerida

Primera nave expresa:

```text
dossier-yo-no-soy-yo-v00-propositions-engine/naves/thread-eigenstate-viewer/
```

Función: abrir `mapa.graph.json` y mostrar threads, eigenstates, referencias y puentes entre Thread 1 y Thread 2. Durante el prototipo puede servirse desde `public/` con el skill `public-web`:

```bash
npm run public:web
```

## Checklist de importación

- Crear dossier con manifest y firma mínima.
- Compactar `thread1-cartografia.md` y `thread2-cartografia.md` en `mapa.md`, conservando referencias a fuentes.
- Copiar imágenes a `assets/`.
- Extraer un `mapa.graph.json` mínimo: nodes `thread`, `eigenstate`, `source`, `bridge`; edges `contains`, `references`, `corrects`, `bridges`.
- Prototipar nave expresa en `public/yo-no-soy-yo/` o en `dossier-*/naves/thread-eigenstate-viewer/`.
- Si la nave sirve para un segundo dossier, promoverla a `parking/thread-eigenstate-viewer/`.

## Riesgos de migración

- Las fuentes de X cambian rápido; trata el corpus como captura histórica y registra fecha de captura.
- Algunas referencias bibliográficas del mapa v1 vienen de conocimiento del modelo y deben verificarse si el dossier se usa como material público.
- El motor de proposiciones merece su propio formato cuando pase de visualizador a parser.