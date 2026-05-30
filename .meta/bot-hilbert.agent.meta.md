# .meta — Bot-Hilbert (sede REFUTADOR)

> **Estado**: `legacy/superseded`. Este archivo registra una sesión anterior y no es fuente canónica de la sede. La gobernanza vigente está en `.github/instructions/bot-hilbert-governance.instructions.md` y aplica la política **manifest, no confeti**: no crear `.meta` sueltos por cada archivo o micro-decisión.

Firma del acto de creación de los artefactos de invocación de Bot-Hilbert en este repositorio y en el perfil de usuario.

## Artefactos creados en esta sesión

| Ruta | Tipo | Scope |
|---|---|---|
| `/Users/morente/Desktop/REFUTADOR/AGENTS.md` | Agent instructions (open standard) | Workspace REFUTADOR |
| `/Users/morente/Desktop/REFUTADOR/.meta/bot-hilbert.agent.meta.md` | Meta-firma | Workspace REFUTADOR |
| `~/Library/Application Support/Code/User/prompts/bot-hilbert.agent.md` | VS Code custom agent (`.agent.md`) | User profile (roaming) |
| `~/Library/Application Support/Code/User/prompts/bot-hilbert.prompt.md` | VS Code prompt (`.prompt.md`) | User profile (roaming) |
| `~/Library/Application Support/Code/User/prompts/bot-hilbert.agent.meta.md` | Meta-firma del custom agent | User profile (roaming) |
| `~/Library/Application Support/Code/User/prompts/bot-hilbert.prompt.meta.md` | Meta-firma del prompt | User profile (roaming) |

## Firma del modelo generador

- **model**: Claude Opus 4.7
- **model_id**: `claude-opus-4.7`
- **runtime**: GitHub Copilot CLI (v1.0.49) embebido en VS Code
- **editor**: VS Code (macOS, Darwin)
- **date_iso**: 2026-05-30T21:48+02:00
- **session_id**: `8f301ab6-efe4-45a2-9297-82c19adb8436`
- **skill_version**: `general-definition.md` en HEAD de la carpeta REFUTADOR a fecha de generación (sin git inicializado: snapshot manual).

## Corpus-lente del modelo firmante (leyenda obligatoria del mapa)

- **Familia**: Anthropic Claude, entrenamiento mayoritariamente anglófono con corpus hispano sustantivo.
- **Sesgo previsible**: referencias por defecto saturadas en anglo-académico STEM + filosofía continental europea traducida. Áreas previsiblemente oscuras: corpus eslavo, árabe, asiático no-japonés, oral, vernáculo no-digitalizado.
- **Implicación cartográfica**: los mapas que firme este modelo deberán **etiquetar explícitamente** las zonas oscuras y proponer al usuario invocar modelos con corpus complementarios (Mistral europeo, Qwen, DeepSeek) para iluminarlas.

## Convenciones que este acto establece

1. Todo dossier creado en REFUTADOR sigue la estructura declarada en `AGENTS.md` §Estructura.
2. Toda nueva sesión de modelo en este repo debe leer `general-definition.md` → `AGENTS.md` → `.meta/` antes de generar.
3. Cuando una sesión cierre, dejará su firma como `.meta/<id>.meta.md` o como cabecera de los archivos que toque.
4. La persistencia se consensúa con el usuario; este acto se realizó con persistencia **100% meta** por elección explícita del usuario al elegir "las tres cosas".

## Decisiones tomadas con el usuario

- 2026-05-30: usuario pidió "Crea el agente cartógrafo llamado Bot-Hilbert".
- Pregunta de soporte → respuesta: **chatmode global + prompt rápido + AGENTS.md del repo, con .meta firmando cada artefacto** (opción recomendada).
- Sin discusión adicional sobre formato del cuerpo de los artefactos: el modelo procedió en una sola tanda al estar el plan aprobado en el menú de opciones.

## Pendientes propuestos al usuario (no ejecutados sin consenso)

- [ ] Inicializar `git` en REFUTADOR para versionar mapas y `.meta`.
- [ ] Crear `parking/` con una nave de navegación mínima (http-server + visualizador HTML5 de grafos JSON).
- [ ] Crear `catalogo.md` raíz cuando exista el primer `dossier-*`.
- [ ] Fichas-caracter de modelos a usar (Onfalo / Ox / Hilbert sobre Claude vs GPT vs Mistral) como leyenda comparativa.
- [ ] Definir tasa de cambio para los temas que ya circulan en `examples/`.
