# Contributing

Gracias por cuidar Bot-Hilbert. Este bloque combina customizations de agentes, documentación cartográfica, plantillas AgentLoreSDK y una superficie web local. Mantén cada cambio cerca de su unidad viva.

## Flujo básico

1. Crea una rama con un nombre concreto: `docs/readme-v2`, `skill/public-web`, `dossier/<tema>`.
2. Instala dependencias:

   ```bash
   npm install
   ```

3. Haz cambios pequeños y revisables.
4. Valida anclas antes de abrir PR:

   ```bash
   npm run validate
   ```

5. Actualiza [CHANGELOG.md](CHANGELOG.md) si el cambio afecta uso, scripts, estructura o customizations.

## Cambios en customizations

Cuando toques `.github/agents/**`, `.github/prompts/**`, `.github/instructions/**`, `.github/hooks/**`, `.github/skills/**` o `AGENTS.md`:

- Conserva la canónica en [general-definition.md](general-definition.md) y enlaza por ancla.
- Revisa frontmatter YAML: `name`, `description`, `applyTo`, `tools` y `user-invocable` cuando aplique.
- Ejecuta `npm run validate`.
- Añade o actualiza el manifest de la unidad viva cuando crees un skill, dossier, nave o pack estable.

## Cambios en mapas y naves

- Dossiers nuevos: `dossier-<tema>-v00-<tag>/` con `mapa.<formato>`, `itinerarios/` y `.meta/manifest.md`.
- Naves genéricas: `parking/<nave-id>/`.
- Naves expresas: `dossier-*/naves/<nave-id>/`.
- Assets web servidos por navegador: `public/`, usando `npm run public:web`.

## Pull requests

Cada PR debe indicar:

- Qué superficie toca: AgentLoreSDK, Bot-Hilbert, public-web, docs, dossier, nave.
- Qué validación se ejecutó.
- Si hay migración desde v1 o cambio de formato.
- Si toca la canónica o solo derivados.

Usa la plantilla de PR en [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).