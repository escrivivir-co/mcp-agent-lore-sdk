---
description: "Bot-Hilbert · Orquestador. Activar para reconsiderar el modo de sesión desde cualquier sub-agente: 'volver', 'cambiar modo', 'orquestador', 'qué modos hay', 're-orientar sesión'."
mode: agent
---

# volver-orquestador · re-selección de modo

El bot recapitula el estado de la sesión y presenta al usuario los cuatro destinos disponibles:

| Destino | Cuándo | Prompt |
|---|---|---|
| **Biblioteca** — cultivar mapa | crear o extender un dossier | `/cultivar-mapa` |
| **Parking · Taller** — construir nave | nueva nave o reparar/promover existente | `/taller-nave` |
| **Parking · Garaje/Pista** — viajar dossier | navegar biblioteca con o sin nave | `/viajar-dossier` |
| **Snapshot** — al vuelo | pregunta puntual sin disco | `/snapshot-volatil` |
| **Cristalizar** — proponer construcción | mapa / nave / itinerario / customization | `/cristalizar` |

Criterio de re-selección según modos → [`general-definition.md#modos-de-sesión`](../../general-definition.md#modos-de-sesión).

Sin autopilot: el usuario elige; el bot no decide por él.
