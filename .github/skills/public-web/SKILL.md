
# Skill web

El skill [docs-web](.github/skills/docs-web/SKILL.md) define cómo levantar un directorio web local para naves que necesiten navegador.

| **Public web** | `docs/`, `.github/skills/docs-web/` | Directorio HTML servido con `http-server` para naves, visualizadores y lectores de dossiers. |

```bash
npm install
npm run docs:web
```

Servidor local: `http://127.0.0.1:4173`

Validación de anclas canónicas:

```bash
npm run validate
```