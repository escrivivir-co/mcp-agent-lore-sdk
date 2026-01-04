# Integración con ALEPH Scriptorium

> **Submódulo**: #18  
> **Épica**: AGENT-TEMPLATES-1.0.0  
> **Fecha integración**: 2026-01-04

---

## Arquitectura del Submódulo

```
AgentLoreSDK/
└── cli-tool/
    └── components/
        ├── agents/      # 25 categorías, 165 plantillas
        ├── commands/    # 20 categorías, 217 plantillas
        ├── skills/      # 10 categorías, 255 plantillas
        └── templates/   # 6 lenguajes (go, java, js, python, ruby, rust)
```

**Total**: 61 categorías, 637+ plantillas

---

## Tecnologías

- Markdown templates
- YAML frontmatter para metadatos
- Compatible con Claude Code / Copilot

---

## Mapeo Ontológico

| AgentLoreSDK | Scriptorium |
|--------------|-------------|
| `agents/` | @plugin_ox_agentcreator (detección proactiva) |
| `commands/` | Handoffs de agentes creados |
| `skills/` | Capacidades fusionables |
| `templates/` | Scaffolding de proyectos |

---

## Integración con Agent Creator

El plugin `agent-creator` usa este submódulo para:

1. **Detección Proactiva DRY** (Paso 1.5 de `crear-agente.prompt.md`)
2. **Índice navegable** en `.github/plugins/agent-creator/index/catalog.json`
3. **Fusión de plantillas** con agentes base del Scriptorium

### Flujo de Uso

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

## Dependencias Externas

- Ninguna (solo archivos Markdown)

---

## Supuestos y Gaps

| Gap | Descripción | Estado |
|-----|-------------|--------|
| G1 | Algunas plantillas pueden estar incompletas | Aceptado |
| G2 | Tags inferidos del nombre de carpeta | Funcional |
| G3 | Sin script de regeneración automática de catalog.json | Pendiente |

---

## Referencias

- **Fuente**: [escrivivir-co/mcp-agent-lore-sdk](https://github.com/escrivivir-co/mcp-agent-lore-sdk)
- **Plugin**: `.github/plugins/agent-creator/`
- **Índice**: `.github/plugins/agent-creator/index/catalog.json`
- **Sesión**: `ARCHIVO/DISCO/SESIONES_COTRABAJO/2026-01-04_agent-creator-claude-templates/`
