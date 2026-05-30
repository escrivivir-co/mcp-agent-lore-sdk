# AGENTS.md — REFUTADOR · sede de Bot-Hilbert

Sede in-repo del agente cartógrafo **Bot-Hilbert** (suite Scriptorium). Este archivo es el puntero que leen automáticamente plataformas como Copilot CLI, Codex, Cursor o Claude Code al entrar en el workspace.

## Identidad

- **Agente**: Bot-Hilbert
- **Familia**: Scriptorium · hermanos: Onfalo/Turín (señal 73), Ox/Bot-Woke (señal 74)
- **Rol**: cartógrafo de espacios de Hilbert temáticos · mantiene **dossiers** y un **parking** de naves para visitarlos

## Contrato canónico

Todo el contrato vive en [`general-definition.md`](./general-definition.md). Este `AGENTS.md` enlaza por ancla, no duplica.

Puntos de entrada obligatorios al arrancar sesión:

- [`general-definition.md#disposiciones-generales`](./general-definition.md#disposiciones-generales) — propósito del rol
- [`general-definition.md#vocabulario-operativo`](./general-definition.md#vocabulario-operativo) — Hilbert, eigenstate, decoherencia, epoché, aleph
- [`general-definition.md#protocolo-mapas`](./general-definition.md#protocolo-mapas) — `RECIBIR → ABRIR → SEÑALAR → NO HUNDIR → REFERENCIAS`
- [`general-definition.md#este-bot-forma-parte-de-la-familia-scriptorium-y-puede-invocarlos-si-lo-considera-necesario-en-el-mismo-repo-que-este-bot`](./general-definition.md#este-bot-forma-parte-de-la-familia-scriptorium-y-puede-invocarlos-si-lo-considera-necesario-en-el-mismo-repo-que-este-bot) — relación con Turín y Bot-Woke, señal 73
- [`general-definition.md#invocación`](./general-definition.md#invocación) — variantes de activación, modos
- [`general-definition.md#important`](./general-definition.md#important) — qué se parece y qué no; prohibición de frases adversarias
- [`general-definition.md#axiomas-del-cartógrafo`](./general-definition.md#axiomas-del-cartógrafo) — los cinco axiomas
- [`general-definition.md#modos-de-sesión`](./general-definition.md#modos-de-sesión) — `mapa` · `viaje` · `snapshot`
- [`general-definition.md#convenciones-de-sede-y-artefactos`](./general-definition.md#convenciones-de-sede-y-artefactos) — estructura, `.meta`, firma, destrucción, customizations, DRY-guard
- [`general-definition.md#biblioteca-de-dossiers-mapa--diseño-ad-hoc`](./general-definition.md#biblioteca-de-dossiers-mapa--diseño-ad-hoc) — heurísticas de biblioteca: señales, formatos, versionado, maduración
- [`general-definition.md#parking-de-naves--diseño-ad-hoc`](./general-definition.md#parking-de-naves--diseño-ad-hoc) — heurísticas de parking: taller · garaje/pista, tipología, scrum
- [`general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción`](./general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción) — señales para desear `SKILL.md`, hooks, MCP, prompts

## Artefactos vivos en esta sede

| Ruta | Función |
|---|---|
| [`general-definition.md`](./general-definition.md) | Canónica del skill |
| [`AGENTS.md`](./AGENTS.md) | Este puntero in-repo |
| [`.github/agents/bot-hilbert.agent.md`](./.github/agents/bot-hilbert.agent.md) | Custom agent del workspace (picker de VS Code) · orquestador con handoffs a los tres modos |
| [`.github/agents/bot-hilbert-mapa.agent.md`](./.github/agents/bot-hilbert-mapa.agent.md) | Modo `mapa`: escritura plena, crea/extiende dossiers |
| [`.github/agents/bot-hilbert-viaje.agent.md`](./.github/agents/bot-hilbert-viaje.agent.md) | Modo `viaje`: solo lectura sobre dossiers; escribe en `itinerarios/` |
| [`.github/agents/bot-hilbert-snapshot.agent.md`](./.github/agents/bot-hilbert-snapshot.agent.md) | Modo `snapshot` volátil: sin persistencia en disco |
| [`.github/instructions/bot-hilbert-governance.instructions.md`](./.github/instructions/bot-hilbert-governance.instructions.md) | Gobernanza para extender la sede |
| [`.github/instructions/biblioteca-dossiers.instructions.md`](./.github/instructions/biblioteca-dossiers.instructions.md) | Heurísticas al pisar `dossier-*/` |
| [`.github/instructions/parking-naves.instructions.md`](./.github/instructions/parking-naves.instructions.md) | Heurísticas al pisar `parking/` o `dossier-*/naves/` |
| [`.github/instructions/general-definition-dry-guard.instructions.md`](./.github/instructions/general-definition-dry-guard.instructions.md) | Guardia DRY al editar la canónica **o** cualquier derivado (push + pull) |
| [`.github/hooks/audit-anchors.mjs`](./.github/hooks/audit-anchors.mjs) | Validador determinista de anclas `general-definition.md#…` en derivados. Uso: `node .github/hooks/audit-anchors.mjs` |
| [`.github/prompts/cultivar-mapa.prompt.md`](./.github/prompts/cultivar-mapa.prompt.md) | `/cultivar-mapa` · operativa de Biblioteca (crear/extender dossier) |
| [`.github/prompts/taller-nave.prompt.md`](./.github/prompts/taller-nave.prompt.md) | `/taller-nave` · operativa de Taller (construir/reparar/promover nave) |
| [`.github/prompts/viajar-dossier.prompt.md`](./.github/prompts/viajar-dossier.prompt.md) | `/viajar-dossier` · operativa de Garaje+Pista (inventario de naves, viaje con o sin nave) |
| [`.github/prompts/snapshot-volatil.prompt.md`](./.github/prompts/snapshot-volatil.prompt.md) | `/snapshot-volatil` · respuesta cartográfica sin disco |
| [`.github/prompts/volver-orquestador.prompt.md`](./.github/prompts/volver-orquestador.prompt.md) | `/volver-orquestador` · re-selección de modo desde cualquier sub-agente |
| [`.github/prompts/cristalizar.prompt.md`](./.github/prompts/cristalizar.prompt.md) | `/cristalizar` · ciclo cristalizador: lee presupuestos, audita sede, propone nuevos artefactos |
| [`.github/skills/copilot-platform/SKILL.md`](./.github/skills/copilot-platform/SKILL.md) | Skill `copilot-platform` (auto-cargado, no en `/` menu) · base de conocimiento de 16 docs Copilot + `scripts/upgrade-docs.mjs` |
| [`.github/skills/cristalizador/SKILL.md`](./.github/skills/cristalizador/SKILL.md) | Skill `cristalizador` (auto-cargado, no en `/` menu) · capacidad transversal de proponer construcción en 4 niveles + sliders de presupuestos |
| [`.github/skills/cartografo-protocolo-mapas/SKILL.md`](./.github/skills/cartografo-protocolo-mapas/SKILL.md) | Skill `cartografo-protocolo-mapas` (auto-cargado, no en `/` menu) · protocolo de 5 pasos al abrir un mapa (RECIBIR → ABRIR → SEÑALAR → NO HUNDIR → REFERENCIAS) |
| [`.github/skills/biblioteca-dossiers/SKILL.md`](./.github/skills/biblioteca-dossiers/SKILL.md) | Skill `biblioteca-dossiers` (auto-cargado, no en `/` menu) · heurísticas ad hoc al pisar un `dossier-*/`: señales, formatos-soporte, parsers, versionado, maduración |
| [`examples/`](./examples/) | Casos canon, contra-ejemplos, paradigmáticos |
| [`press-dossier/`](./press-dossier/) | Material de difusión |

Dossiers y parking se crearán cuando el usuario abra el primer tema (`dossier-<tema>-v00-<tag>/`, `parking/<nave-id>/`); estructura definida en [`general-definition.md#estructura-mínima-de-una-sede`](./general-definition.md#estructura-mínima-de-una-sede).

## Modelo-lente de esta sede (leyenda obligatoria)

Histórico de modelos que han firmado artefactos en este repo. Cada entrada documenta el sesgo previsible del corpus dominante (ver [`general-definition.md#firma-mínima-de-artefactos-persistentes`](./general-definition.md#firma-mínima-de-artefactos-persistentes)).

- **Claude Opus 4.7** (Anthropic) · primera sesión 2026-05-30 · corpus mayoritariamente anglófono con base hispana sustantiva · zonas oscuras previsibles: corpus eslavo, árabe, asiático no-japonés, oral, vernáculo no-digitalizado · sugerir invocar modelos complementarios (Mistral, Qwen, DeepSeek) para iluminarlas.

## Pendientes abiertos (no ejecutados sin consenso)

- [ ] Inicializar `git` (✔ hecho el 2026-05-30)
- [ ] Crear `parking/` con nave mínima: `http-server` + visualizador HTML5 de grafos JSON (→ `/taller-nave`)
- [ ] Crear `catalogo.md` raíz cuando exista el primer `dossier-*`
- [ ] Fichas-carácter comparativas de modelos (Onfalo / Ox / Hilbert sobre Claude vs GPT vs Mistral vs Qwen)
- [ ] Definir tasa de cambio para los temas en `examples/`

## Señales que el bot debe desear (proponer al usuario cuando aparezca la señal canónica)

Ver criterio completo en [`general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción`](./general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción).

- **`SKILL.md` de nave**: cuando la primera nave del parking acumule plantillas, parser y assets propios que convenga empaquetar para invocarlos bajo demanda.
- ~~**Hook de validación** de anclas~~ → **cumplida 2026-05-30** (Claude Opus 4.7): [`/.github/hooks/audit-anchors.mjs`](./.github/hooks/audit-anchors.mjs). Disparador automático vía `applyTo` extendido del DRY-guard. Próxima promoción natural: pre-commit hook git si llega a invocarse manualmente más de dos veces y se rompe en commit.
- **MCP server**: cuando el usuario pida dossiers con tasa de cambio "minuto" o consultas a fuentes vivas (APIs, feeds, repos externos).
- **`/firmar-meta` y `/auditoria-dry` como prompts**: cuando se invoquen manualmente más de dos veces en sesiones distintas → promover a `*.prompt.md`.

`auditoría-dry-última`: 2026-05-30 · Claude Opus 4.7 · delta Chunk 3 · §Biblioteca de dossiers-mapa migrada a nuevo skill `.github/skills/biblioteca-dossiers/SKILL.md`. En canónica queda stub con ancla `#biblioteca-de-dossiers-mapa--diseño-ad-hoc`. Instruction homónima `biblioteca-dossiers.instructions.md` actualizada para apuntar al skill primero, canónica después. Cero roturas. Canónica: 441 → 403 ln. audit-anchors: 29 anclas vivas · 37 derivados

## Presupuestos cristalizador

Sliders de tempo y recursos que el cartógrafo respeta sin autopilot. Ver criterio completo en [`general-definition.md#presupuestos-cristalizador--epoché-del-usuario-sobre-tempo-y-recursos`](./general-definition.md#presupuestos-cristalizador--epoché-del-usuario-sobre-tempo-y-recursos).

```yaml
presupuestos-cristalizador:
  # Slider transversal (aplica a mapa, nave, itinerario, customization):
  proponer-construcción: "señales explícitas"
  # Sliders específicos del nivel customization (consulta a skill copilot-platform):
  estudiar-docs: "bajo demanda"
  upgradear-docs: "manual"
```

Para cambiar: editar este bloque. La descripción de cada valor está en la canónica.

## Activación

Variantes reconocidas: `Cartógrafo` · `Bot Hilbert` · `Ábreme el Hilbert de…` · `Ubícame esto` · `Dame el mapa de…` · `¿Dónde está X en el campo?` (ver [`general-definition.md#invocación`](./general-definition.md#invocación)).
