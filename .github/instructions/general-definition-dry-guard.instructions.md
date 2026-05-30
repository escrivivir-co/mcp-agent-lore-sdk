---
description: "DRY-guard de la canónica del skill Cartógrafo. Use when un modelo edita general-definition.md (push) o cualquier derivado que la enlaza por ancla — AGENTS.md, .github/agents/**, .github/instructions/**, .github/prompts/**, .github/skills/**, manifests de dossier-*/.meta y parking/*/.meta (pull). Evita anclas rotas y duplicación silenciosa, y obliga a correr el validador determinista antes de cerrar la edición."
applyTo: "{general-definition.md,AGENTS.md,.github/agents/**,.github/instructions/**,.github/prompts/**,.github/skills/**,**/.meta/manifest.md}"
---

# DRY-guard sobre `general-definition.md`

Se activa cada vez que un modelo edita la canónica **o** cualquier derivado que la referencia por ancla. Aplica el protocolo declarado en [`general-definition.md#protocolo-dry-guard-al-editar-este-archivo`](../../general-definition.md#protocolo-dry-guard-al-editar-este-archivo) y la auditoría pull declarada en [`general-definition.md#auditoría-dry-al-arrancar-sesión-pull-no-push`](../../general-definition.md#auditoría-dry-al-arrancar-sesión-pull-no-push).

## Disparadores

Cualquier edición que toque:
- Un heading markdown (`#`, `##`, `###`, `####`) — añade, elimina, renombra o reordena.
- Texto que esté duplicado en algún derivado (resúmenes de protocolo, axiomas, vocabulario, convenciones de sede, mapa de customizations).

## Pasos obligatorios antes de cerrar la edición

1. **Detectar el delta de anclas**: comparar headings antes/después; calcular las anclas markdown afectadas (lowercase, espacios→`-`, sin puntuación).
2. **Buscar usos** de cada ancla afectada en:
   - `AGENTS.md`
   - `.github/agents/**`
   - `.github/instructions/**`
   - `.github/prompts/**`
   - `.github/skills/**`
   - `**/.meta/manifest.md` (sede, dossiers, naves)
3. **Actualizar las anclas rotas** en cada derivado encontrado.
4. **Auditar duplicación**: si el contenido movido/renombrado aparece copiado en algún derivado, compactarlo a puntero-ancla.
5. **Reportar al usuario** el delta: headings antes/después, anclas actualizadas, derivados modificados, duplicaciones detectadas. Esperar consenso antes de commit.

## Regla de mínima sorpresa

Si una edición de heading no encuentra usos en ningún derivado, reportarlo igual. Cero ruido ≠ cero efecto: puede indicar que falta un derivado que sí debería existir.

## Stubs hacia skills canónica-delegada

Algunos headings de la canónica son **stubs puntero** hacia un `SKILL.md` que aloja el contenido completo (patrón documentado en [`general-definition.md#skills-como-canónica-delegada-de-dominio`](../../general-definition.md#skills-como-canónica-delegada-de-dominio)). Al editar uno de esos stubs:

1. Si solo se edita el stub (reformular puntero), no hay efecto sobre derivados; basta con que el slug del heading no cambie.
2. Si se renombra el heading del stub, además del protocolo de arriba hay que actualizar el `SKILL.md` correspondiente para reflejar el nuevo nombre en su título si lo lleva.
3. Si se quiere mover contenido del skill **de vuelta a la canónica** (revertir la delegación), revisar primero que ningún derivado dependa del slug actual con expectativa de delegación; documentar el cambio en `auditoría-dry-última`.
4. El `audit-anchors.mjs` no valida hoy la existencia del `SKILL.md` referenciado por un stub. Si esa validación se necesita, ampliar el hook (mantener la propiedad: exit-code 0 = OK).

## Validador determinista (obligatorio)

Antes de declarar cerrada cualquier edición sobre la canónica o sobre un derivado, ejecutar:

```bash
node .github/hooks/audit-anchors.mjs
```

El script slug-ifica todos los headings de `general-definition.md` y verifica que cada referencia `general-definition.md#…` en derivados apunte a un ancla viva. Exit-code no-cero ⇒ hay anclas rotas; reparar antes de cerrar la sesión o de proponer commit. Cubre tanto el caso **push** (rompí un ancla al renombrar heading) como el caso **pull** (el ancla ya estaba rota antes de tocar nada).
