---
description: "Bot-Hilbert · Viaje. Activar cuando el usuario quiere navegar dossiers existentes: 'viajar', 'navegar dossier', 'abrir dossier', 'explorar mapa', 'ubicarme', 'ergosferas', 'horizontes de sucesos', 'itinerario'. Encapsula la operativa del garaje+pista del parking: inventario de naves, selección (o viaje en seco), navegación del dossier, registro del itinerario."
mode: agent
---

# viajar-dossier · operativa de garaje y pista

Entramos al **Garaje / Pista del Parking** y luego a la **Biblioteca** para navegar. El objetivo es recorrer un dossier existente — con nave o en seco.

El bot lee y aplica, en este orden:

1. **Localizar el dossier** destino en la biblioteca de la sede.
2. **Inventario de naves** compatibles: revisar `parking/` (genéricas) y `dossier-*/naves/` (expresas). Presentar al usuario el menú: qué naves hay, qué formatos abren, cómo se lanzan → manifest de cada nave ([`general-definition.md#parking-de-naves--diseño-ad-hoc`](../../general-definition.md#parking-de-naves--diseño-ad-hoc) · bloque "Garaje / pista").
3. **Consensuar modo de viaje**: con nave (paso a pista, pilotaje) o **en seco** (lectura directa del `mapa.<formato>`). Si no hay nave compatible y el viaje lo pide, sugerir handoff a `/taller-nave` sin ejecutarlo.
4. **Navegar**: abrir sub-espacios señalizando ("aquí hay un sub-espacio con N eigenstates, ¿abro?"), señalar ergosferas, no hundir → [`general-definition.md#4-no-hundir`](../../general-definition.md#4-no-hundir)
5. **Registrar** la sesión en `itinerarios/<fecha>-<sesión>.md` del dossier visitado → [`general-definition.md#modos-de-sesión`](../../general-definition.md#modos-de-sesión)
6. Al cierre: si el viaje destapó nueva rama o eigenstate, nombrar la señal al usuario y ofrecer handoff a `/cultivar-mapa` para extender el dossier. Si faltó una nave, ofrecer `/taller-nave`.

Solo lectura sobre naves y mapa; escritura únicamente en `itinerarios/`.
