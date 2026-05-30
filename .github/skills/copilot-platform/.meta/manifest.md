# copilot-platform · manifest

| Campo | Valor |
|---|---|
| `propósito` | Knowledge base offline de Copilot customization primitives para uso interno del cartógrafo |
| `fuente` | https://code.visualstudio.com/docs/copilot/overview |
| `snapshot_date` | 2026-05-30 |
| `modelo_importador` | desconocido · origen externo, importado de `CRISTALIZADOR/` proyecto Bartleby |
| `tasa_de_cambio` | trimestral aproximado (VS Code releases) |
| `parsers_sugeridos` | lectura directa de `.md`; no requiere parser |
| `upgrade_script` | `node .github/skills/copilot-platform/scripts/upgrade-docs.mjs` |

## Mapeo archivo → URL canónica

| Archivo local | URL fuente |
|---|---|
| `docs/overview.md` | https://code.visualstudio.com/docs/copilot/customization/overview |
| `docs/agents.md` | https://code.visualstudio.com/docs/copilot/agents/agents |
| `docs/custom-agents.md` | https://code.visualstudio.com/docs/copilot/customization/custom-agents |
| `docs/instructions.md` | https://code.visualstudio.com/docs/copilot/customization/custom-instructions |
| `docs/prompt.md` | https://code.visualstudio.com/docs/copilot/customization/prompt-files |
| `docs/skill.md` | https://code.visualstudio.com/docs/copilot/customization/agent-skills |
| `docs/hooks.md` | https://code.visualstudio.com/docs/copilot/customization/hooks |
| `docs/mcp.md` | https://code.visualstudio.com/docs/copilot/model-context-protocol |
| `docs/context.md` | https://code.visualstudio.com/docs/copilot/context |
| `docs/customize.md` | https://code.visualstudio.com/docs/copilot/customization/overview |
| `docs/language-models.md` | https://code.visualstudio.com/docs/copilot/language-models |
| `docs/tools.md` | https://code.visualstudio.com/docs/copilot/agents/agent-tools |
| `docs/plugins.md` | https://code.visualstudio.com/docs/copilot/customization/agent-plugins |
| `docs/setup.md` | https://code.visualstudio.com/docs/copilot/setup |
| `docs/trust-safety.md` | https://code.visualstudio.com/docs/copilot/security |
| `docs/quickstart.md` | https://code.visualstudio.com/docs/copilot/getting-started |

## Historial de upgrades

| Fecha | Modelo | Acción | Resultado |
|---|---|---|---|
| 2026-05-30 | Claude Sonnet 4.6 (Anthropic) | Import inicial desde CRISTALIZADOR/COPILOT/ | 16 docs, sin diff (primer snapshot) |
