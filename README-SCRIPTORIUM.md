# Integración con ALEPH Scriptorium

> **Submódulo**: #18  
  "name": "@aleph-scriptorium/agent-lore-sdk",
  "version": "0.1.0",
  "description": "AGENT-TEMPLATES-1.0.0 + BOT-HILBERT-2.0.0",
> **Fecha integración**: 2026-06-04

Doble superficie AgentLoreSDK;

| Superficie | Rutas | Uso |
|---|---|---|
| **AGENT-TEMPLATES** | `cli-tool/components/**` | Catálogo de plantillas de agentes, commands, hooks, MCPs y skills para Scriptorium. |
| **BOT-HILBERT** | `general-definition.md`, `AGENTS.md`, `.github/**` | Cartógrafo de espacios temáticos con agentes, prompts, instructions, hooks y skills de VS Code Copilot. |


## Arquitectura del Submódulo AGENT-TEMPLATES-1.0.0

```
AgentLoreSDK/ nothing.zip
└── cli-tool/
    └── components/
        ├── agents/      # 25 categorías, 165 plantillas
        ├── commands/    # 20 categorías, 217 plantillas
        ├── skills/      # 10 categorías, 255 plantillas
        └── templates/   # 6 lenguajes (go, java, js, python, ruby, rust)
```

**Total**: 61 categorías, 637+ plantillas

### Tecnologías

- Markdown templates
- YAML frontmatter para metadatos
- Compatible con Claude Code / Copilot

### Mapeo Ontológico

| AgentLoreSDK | Scriptorium |
|--------------|-------------|
| `agents/` | @plugin_ox_agentcreator (detección proactiva) |
| `commands/` | Handoffs de agentes creados |
| `skills/` | Capacidades fusionables |
| `templates/` | Scaffolding de proyectos |

### Integración con Agent Creator DE LA SUITE SCRIPTORIUM (solo disponible si esta codebase está conectada al Scriptorium)

El plugin `agent-creator` usa este submódulo para:

1. **Detección Proactiva DRY** (Paso 1.5 de `crear-agente.prompt.md`)
2. **Índice navegable** en `.github/plugins/agent-creator/index/catalog.json`
3. **Fusión de plantillas** con agentes base del Scriptorium

#### Flujo de Uso

```
Usuario: "Quiero crear agente de seguridad"
              │
              ▼
Agent Creator detecta keywords → "security"
              │
              ▼
Consulta catalog.json → agents/security/ (5 items)
              │
              ▼
Sugiere proactivamente → Usuario elige
              │
              ▼
Fusiona plantilla con @blueflag (o base elegida)
```

---

### Dependencias Externas

- Ninguna (solo archivos Markdown)

---

### Supuestos y Gaps

| Gap | Descripción | Estado |
|-----|-------------|--------|
| G1 | Algunas plantillas pueden estar incompletas | Aceptado |
| G2 | Tags inferidos del nombre de carpeta | Funcional |
| G3 | Sin script de regeneración automática de catalog.json | Pendiente |

---

### Referencias

- **Fuente**: [escrivivir-co/mcp-agent-lore-sdk](https://github.com/escrivivir-co/mcp-agent-lore-sdk)
- **Plugin**: `.github/plugins/agent-creator/`
- **Índice**: `.github/plugins/agent-creator/index/catalog.json`
- **Sesión**: `ARCHIVO/DISCO/SESIONES_COTRABAJO/2026-01-04_agent-creator-claude-templates/`


## Arquitectura del Submódulo BOT-HILBERT-2.0.0

.github/copilot-instructions.md

La canónica vive en [general-definition.md](general-definition.md). El `AGENTS.md` enlaza sus anclas y registra los artefactos vivos de la sede. El bloque v2.0.0 trae estos modos:

- **Biblioteca**: crea o extiende dossiers `dossier-<tema>-v00-<tag>/`.
- **Parking/Taller**: navega dossiers existentes y registra itinerarios.
- **Volátil**: respuesta cartográfica volátil en chat.

Validación de anclas canónicas:

```bash
npm run validate
```

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

Este bloque hereda la [Animus Iocandi Public License](LICENSE.md) de Aleph Scriptorium.