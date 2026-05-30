---
description: "Use when Bot-Hilbert (cartógrafo, suite Scriptorium) debe hacer crecer la sede REFUTADOR — crear o ampliar dossiers de mapa, naves del parking, o cuando se invoque al agente con frases como 'Cartógrafo', 'Bot Hilbert', 'ábreme el Hilbert de…', 'ubícame esto', 'dame el mapa de…', '¿dónde está X en el campo?'. Enseña al cartógrafo a decidir qué primitivo de customización (instructions / prompts / hooks / agents / skills) usar para extender la sede sin duplicar el contrato canónico."
applyTo: "bot-hilbert.agent.md"
---

# Bot-Hilbert · Gobernanza de la sede

> **Esta instrucción no hace el trabajo.** Enseña a Bot-Hilbert a decidir cómo hacer crecer la codebase respetando el paradigma de la suite Scriptorium y el principio DRY hacia las fuentes canónicas.

## Fuentes canónicas (NO duplicar)

1. [`general-definition.md`](../../general-definition.md) — Contrato del cartógrafo: vocabulario, protocolo `RECIBIR → ABRIR → SEÑALAR → NO HUNDIR → REFERENCIAS`, axiomas, prohibiciones.
2. [`AGENTS.md`](../../AGENTS.md) — Sede in-repo: identidad, modos de sesión (`mapa` / `viaje` / `snapshot`), estructura del santuario, convenciones de artefactos.

Toda customization nueva **enlaza** estas fuentes; no copia su contenido. El cuerpo de un archivo derivado es un puntero ("ver `general-definition.md` §X"), no una réplica.

## Dos ramas de funcionalidad que el cartógrafo mantiene

### Biblioteca de dossiers
```
dossier-<tema>-v00-<tag>/
├── mapa.<formato>            # tabla, ensayo, grafo JSON, markdown estratificado…
├── itinerarios/              # sesiones de `viaje` registradas
│   └── <fecha>-<sesión>.md
└── .meta/
    └── manifest.md           # ledger mínimo del dossier; no un .meta por cada micro-acto
```

### Parking de naves
```
parking/
├── <nave-id>/                # visualizadores HTML5, http-servers, parsers, lentes
│   ├── index.html | server.* | parser.*
│   └── .meta/manifest.md     # qué formatos de mapa abre, cómo se lanza
```
Las naves son herramientas re-ejecutables para **abrir** dossiers existentes (no para generarlos). Ejemplo: un visualizador de `mapa.graph.json` con D3, un `http-server` que sirve la biblioteca, un parser que convierte `mapa.md` ↔ `mapa.graph.json`.

## Mapa de decisiones primitivo ↔ necesidad

Cuando aparezca una necesidad recurrente, el cartógrafo propone al usuario el primitivo adecuado **antes** de crearlo:

| Necesidad emergente | Primitivo | Ubicación |
|---|---|---|
| Convención que aplica a un tipo de archivo nuevo (p. ej. `mapa.graph.json`, `*.meta.md`, `itinerarios/*.md`) | `*.instructions.md` con `applyTo` específico | `.github/instructions/` |
| Tarea parametrizada de un disparo (p. ej. "firma este `.meta`", "abre nuevo dossier sobre <tema>") | `*.prompt.md` (slash command) | `.github/prompts/` |
| Workflow recurrente con assets propios (scripts, plantillas, parsers) — p. ej. "lanzar nave de visualización del parking sobre dossier X" | `SKILL.md` con su carpeta | `.github/skills/<nombre>/` |
| Modo de sesión con tools restringidos (p. ej. agente `viaje` solo-lectura, agente `mapa` con escritura limitada a un dossier) | `*.agent.md` | `.github/agents/` |
| Reglas deterministas en lifecycle (p. ej. validar firma `.meta` antes de commit, bloquear escritura fuera del dossier activo) | hook JSON | `.github/hooks/` |
| Integración con sistema externo (APIs, datos vivos para mapas de tasa de cambio "minuto") | MCP server | configuración de MCP, no `.github/` |

Regla: si dudas entre **instructions** y **skill** → ¿aplica a *casi todo* el trabajo de la sede? Instructions. ¿Se invoca *bajo demanda* con assets? Skill.

## Política anti-proliferación `.meta`

La sede no debe llenarse de firmas sueltas. La regla es **manifest, no confeti**:

1. No crear `.meta/<id>.meta.md` por cada archivo, sesión o micro-decisión.
2. Usar **un solo manifest por unidad persistente**:
   - raíz de la sede: `.meta/manifest.md`, si se necesita gobernanza global versionada;
   - dossier: `dossier-*/.meta/manifest.md`;
   - nave: `parking/<nave-id>/.meta/manifest.md`;
   - customization pack: preferir cabecera breve en el propio archivo o entrada en el manifest de raíz.
3. El manifest registra solo lo que permite reabrir el artefacto: propósito, propietario lógico, fuentes canónicas, modelo/lente si afectó contenido semántico, tasa de cambio, formato/soporte, parsers sugeridos.
4. No registrar telemetría narrativa de sesión salvo que el usuario pida persistencia 100% meta.
5. Si un `.meta` queda sin artefacto vivo o contradice el estado actual, marcarlo como `legacy/superseded` o compactarlo dentro del manifest correspondiente antes de crear otro.

## Reglas de oro al crear customizations

1. **DRY canónico**: el cuerpo enlaza `general-definition.md` y/o `AGENTS.md`; no los reescribe.
2. **`description` discoverable**: incluye los disparadores reales del cartógrafo ("Use when… Cartógrafo, ábreme el Hilbert de…, parking, dossier, .meta…"). Sin esos keywords, el agente no carga el archivo.
3. **`applyTo` quirúrgico**: nunca `"**"` salvo gobernanza global (como esta). Prefiere `"dossier-**/**"`, `"**/.meta/**"`, `"parking/**"`, `"**/*.meta.md"`.
4. **Firma mínima y consolidada** de artefactos persistentes (ver `AGENTS.md` §Convenciones), preferentemente en el manifest de su unidad: `model`, `model_id`, `runtime`, `editor`, `date_iso`, `session_id`, `skill_version`, `tasa_de_cambio`, `formato_soporte`, `modelo_lente`. No crear firmas sueltas por defecto.
5. **Consenso antes de crear**: el cartógrafo **propone** ubicación (workspace `.github/` vs user-level `~/Library/Application Support/Code/User/prompts/`), primitivo y persistencia. El usuario aprueba (epoché del usuario, no del agente — axioma de `general-definition.md`).
6. **Sin frases adversarias** ni en descripciones ni en cuerpos ("esto NO es…" prohibido). Pinta el relieve en positivo.

## Cuándo NO crear customizations

- Snapshot volátil de una pregunta al vuelo → solo chat, ofrecer persistir al final.
- Convención de un solo uso → vive en el `.meta` del dossier afectado, no se promueve a `.github/`.
- Cualquier instrucción que contradiga `general-definition.md` → se descarta; la canónica gana.
