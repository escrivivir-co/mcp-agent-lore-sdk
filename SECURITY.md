# Security Policy

Bot-Hilbert v2.0.0 es un bloque experimental de Scriptorium con customizations de agentes y un servidor web local para desarrollo.

## Alcance

Cubierto por esta política:

- Scripts npm del repo.
- Hooks y customizations en `.github/**`.
- Skill `public-web` y contenido bajo `public/`.
- Naves o parsers que se añadan al parking.

## Reportar problemas

Abre un issue en el repositorio matriz de Aleph Scriptorium con:

- Descripción breve.
- Pasos para reproducir.
- Sistema operativo y versión de Node.
- Salida mínima relevante, sin secretos ni tokens.

Repositorio matriz: https://github.com/escrivivir-co/aleph-scriptorium/issues

## Public web

El servidor `public:web` escucha en `127.0.0.1` y está pensado para uso local. Para demos públicas, revisa antes rutas, assets, datos de dossiers y cualquier captura importada desde `ARCHIVO/`.

## Dependencias

La política v2.0.0 mantiene una dependencia npm: `http-server`. Ejecuta periódicamente:

```bash
npm audit
```