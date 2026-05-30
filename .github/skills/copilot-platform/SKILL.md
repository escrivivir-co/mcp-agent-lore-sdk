---
name: copilot-platform
description: "Knowledge base of GitHub Copilot VS Code customization primitives (agents, instructions, prompts, hooks, skills, MCP, tools, plugins, context, language-models). Use when Bot-Hilbert must decide which primitive to propose for the customization level of cristalización, validate that a proposed customization follows the official spec, or estimate whether existing customizations are using features optimally. This skill is ONE of four knowledge sources of the cristalizador (mapa, nave, itinerario, customization) — it applies only to the customization branch."
user-invocable: false
---

# Copilot Platform · Base de conocimiento

Snapshot offline de la documentación oficial de VS Code Copilot customizations, extraído de https://code.visualstudio.com/docs/copilot/overview (snapshot 2026-05-30). Ver protocolo de upgrade en [scripts/upgrade-docs.mjs](./scripts/upgrade-docs.mjs).

**Rol dentro de Bot-Hilbert**: este skill es **una** de las cuatro fuentes que consulta el cristalizador (ver [`general-definition.md#cristalización--capacidad-transversal-del-cartógrafo`](../../../general-definition.md#cristalización--capacidad-transversal-del-cartógrafo)). Solo se carga cuando el nivel a cristalizar es **customization**. Para cristalizar mapas, naves o itinerarios el cartógrafo consulta otras fuentes (biblioteca-dossiers / parking-naves / canonica directa).

## Índice de documentos

| Archivo | Qué contiene |
|---|---|
| [docs/overview.md](./docs/overview.md) | Panorámica de todas las customizations disponibles; cuándo usar cada una |
| [docs/agents.md](./docs/agents.md) | Modo agente: tools, agent mode, autonomous workflows |
| [docs/custom-agents.md](./docs/custom-agents.md) | Custom agents `.agent.md`: frontmatter, handoffs, tools, name |
| [docs/instructions.md](./docs/instructions.md) | Custom instructions `.instructions.md`: applyTo, description, body |
| [docs/prompt.md](./docs/prompt.md) | Prompt files `.prompt.md`: slash commands, mode, tools |
| [docs/skill.md](./docs/skill.md) | Agent Skills `SKILL.md`: frontmatter, user-invocable, carga progresiva |
| [docs/hooks.md](./docs/hooks.md) | Hooks `.github/hooks/`: lifecycle, triggers, JSON schema |
| [docs/mcp.md](./docs/mcp.md) | Model Context Protocol: servidores, inputs, herramientas |
| [docs/context.md](./docs/context.md) | Variables de contexto, `#file`, `#selection`, `#codebase` |
| [docs/customize.md](./docs/customize.md) | Overview de personalización: Chat Customizations editor |
| [docs/language-models.md](./docs/language-models.md) | Selección de modelo, API de language models en extensiones |
| [docs/tools.md](./docs/tools.md) | Herramientas disponibles para agentes: terminal, file, web… |
| [docs/plugins.md](./docs/plugins.md) | Agent plugins: distribución de customizations como extensión |
| [docs/setup.md](./docs/setup.md) | Configuración inicial, settings clave, workspace vs user scope |
| [docs/trust-safety.md](./docs/trust-safety.md) | Confianza, seguridad, auto-aprobación de terminal |
| [docs/quickstart.md](./docs/quickstart.md) | Quickstart guiado: primeros pasos con Copilot Chat |

## Cómo usa este skill el agente

1. **Discovery**: este `SKILL.md` (solo frontmatter + índice) se carga cuando el contexto pide decidir sobre primitivos de customización o se invoca `/cristalizar`.
2. **Carga progresiva**: el agente cita el documento específico que necesita (ej. `[docs/hooks.md](./docs/hooks.md)`) y solo ese entra en contexto.
3. **Upgrade**: ejecutar `node .github/skills/copilot-platform/scripts/upgrade-docs.mjs` para comparar snapshot local con las URLs canónicas. Sin `--apply`, solo reporta deltas.

## Referencia rápida · primitivo ↔ necesidad

Ver tabla completa en [`general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia`](../../../general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia).

Regla de entrada: ¿aplica a casi todo el trabajo? → `instructions`. ¿Se invoca bajo demanda con assets? → `skill`. ¿Tarea parametrizada de un disparo? → `prompt`. ¿Modo de sesión restringido? → `agent`. ¿Lifecycle determinista? → `hook`. ¿Datos vivos? → `MCP`.
