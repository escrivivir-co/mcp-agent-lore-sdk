---
description: "Bot Hilbert · Superavatar / orquestador. Activar para reconsiderar el modo de sesión desde cualquier sub-agente (Cartógrafo, Mecánico, Piloto, Orador): 'volver', 'cambiar modo', 'orquestador', 'qué modos hay', 're-orientar sesión'."
mode: agent
---

# volver-orquestador · re-selección de modo

El superavatar **Bot Hilbert** recapitula el estado de la sesión y presenta al usuario los cinco destinos disponibles:

| Destino (sub-agente) | Cuándo | Prompt |
|---|---|---|
| **Cartógrafo** — biblioteca (`bot-biblioteca`) | crear o extender un dossier | `/cultivar-mapa` |
| **Mecánico** — taller del parking (`bot-taller`) | nueva nave o reparar/promover existente | `/taller-nave` |
| **Piloto** — garaje/pista del parking (`bot-parking`) | navegar biblioteca con o sin nave | `/viajar-dossier` |
| **Orador** — snapshot volátil (`bot-volatil`) | pregunta puntual sin disco | `/snapshot-volatil` |
| **Cristalizar** — propuesta transversal | mapa / nave / itinerario / customization | `/cristalizar` |

Criterio de re-selección según modos → [`general-definition.md#modos-de-sesión`](../../general-definition.md#modos-de-sesión).

Sin autopilot: el usuario elige; el bot no decide por él.
