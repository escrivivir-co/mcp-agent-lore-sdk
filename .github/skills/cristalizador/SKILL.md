---
name: cristalizador
description: "Capacidad transversal de Bot-Hilbert (cartógrafo, suite Scriptorium) para proponer construir algo nuevo en la sede ante una señal. Cristaliza a cuatro niveles co-iguales: mapa, nave, itinerario, customization. Use when el cartógrafo detecta gap durante un viaje, recibe señal explícita de promoción, una sesión snapshot merece persistir, o el usuario invoca /cristalizar. No crea nada sin consenso explícito (axioma 3 del cartógrafo: la epoché es del usuario)."
user-invocable: false
---

# Cristalización · capacidad transversal del cartógrafo

**Cristalizar** es la capacidad por la que el cartógrafo, ante una señal, **propone construir algo nuevo** en la sede. Verbo: proponer. No crea nada sin consenso (axioma 3: la epoché es del usuario).

La sede de Bot-Hilbert crece en **cuatro niveles** y la cristalización aplica a los cuatro:

| Nivel | Qué cristaliza | Fuente de conocimiento | Modo natural |
|---|---|---|---|
| **Mapa** | Un dossier nuevo, o una extensión sustantiva a uno existente | `biblioteca-dossiers.instructions.md` + [`general-definition.md#biblioteca-de-dossiers-mapa--diseño-ad-hoc`](../../../general-definition.md#biblioteca-de-dossiers-mapa--diseño-ad-hoc) | `mapa` |
| **Nave** | Un visualizador / parser / server del parking, o nave expresa de dossier | `parking-naves.instructions.md` + [`general-definition.md#parking-de-naves--diseño-ad-hoc`](../../../general-definition.md#parking-de-naves--diseño-ad-hoc) | `mapa` (taller) |
| **Itinerario** | Una sesión de viaje persistida con valor reusable | [`general-definition.md#modos-de-sesión`](../../../general-definition.md#modos-de-sesión) modo `viaje` | `viaje` |
| **Customization** | Una instruction / prompt / hook / agent / skill / MCP nueva en `.github/` | skill [`copilot-platform`](../copilot-platform/SKILL.md) + [`general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia`](../../../general-definition.md#mapa-de-customizations-cuando-la-sede-vive-en-vs-code--agentes-de-ia) | cualquier modo, según señal |

El cartógrafo no privilegia ningún nivel. La señal del usuario y el estado de la sede deciden qué se cristaliza.

## Pasos del proceso cristalizador

Mismos para los cuatro niveles, sub-protocolos diferentes:

1. **Identificar señal**: petición explícita del usuario, gap detectado durante un viaje, sesión `snapshot` que merece persistir, o señales de [`general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción`](../../../general-definition.md#crecimiento-futuro-de-la-sede--señales-de-promoción) para el caso customizations.
2. **Respetar presupuestos**: leer `AGENTS.md §presupuestos-cristalizador`; si la señal no encaja con los sliders activos, callarla solo si el usuario lo ha pedido — si no, nombrarla.
3. **Consultar la fuente** correspondiente al nivel (ver tabla).
4. **Proponer** al usuario: nivel, ubicación, formato, esfuerzo estimado.
5. **Crear tras consenso explícito**. Sin `autopilot`, no.

## Por modo, qué cristaliza de forma natural (no exclusiva)

- Modo `mapa` — mapas y naves (su trabajo principal). También customizations cuando una señal canónica aparece tras crear varios artefactos.
- Modo `viaje` — itinerarios (escritura natural del modo). Propone mapas/naves nuevas si el viaje descubre un gap, sin crearlas (solo lectura sobre el resto de la sede).
- Modo `snapshot` — propone persistir como mapa (mini-cristalización al cierre). Nunca cristaliza customizations.

## Operativa explícita

`/cristalizar` (en `.github/prompts/`) ejecuta el ciclo completo con pregunta inicial *¿qué nivel?* y sub-protocolo según respuesta.

---

# Presupuestos cristalizador · epoché del usuario sobre tempo y recursos

Cada sede declara explícitamente cuánto tiempo y recursos el cartógrafo invierte en proponer construcción frente a ejecutarla. Sin declaración, se aplican los **defaults conservadores** definidos en `AGENTS.md §presupuestos-cristalizador`.

El cartógrafo **nunca decide solo** cuánto tiempo invertir en proponer; eso es epoché del usuario.

## Sliders transversales

Aplican a los cuatro niveles de cristalización (mapa, nave, itinerario, customization):

- `proponer-construcción` — cuándo activar el ciclo cristalizador:
  - `"señales explícitas"` *(default)* — solo si el usuario lo pide o si una señal canónica clara aparece.
  - `"tras commit grande"` — después de cada sesión con varios artefactos creados.
  - `"continuo"` — el agente evalúa en cada sesión; máximo ruido, máxima cobertura.

## Sliders específicos del nivel customization

Consulta al skill [`copilot-platform`](../copilot-platform/SKILL.md):

- `estudiar-docs` — cuándo el agente consulta el skill internamente:
  - `"bajo demanda"` *(default)* — solo si una decisión sobre customizations lo requiere o se invoca `/cristalizar` rama customization.
  - `"al arrancar sesión de mapa"` — cada vez que el modo `mapa` inicia, revisa si hay features de Copilot no aprovechadas.
  - `"siempre"` — activo en todos los modos; costoso en contexto.
- `upgradear-docs` — cuándo proponer actualizar el snapshot local de la doc oficial de Copilot:
  - `"manual"` *(default)* — solo si el usuario invoca el upgrade o el agente detecta snapshot muy viejo.
  - `"mensual"` — el agente propone al inicio de la primera sesión del mes.
  - `"semanal"` — propone cada semana.

Los valores actuales de la sede están en `AGENTS.md §presupuestos-cristalizador`. Cambiarlos es una decisión del usuario, no del cartógrafo.
