# Cuaderno 1º ESO · guía para agentes

App educativa estática (módulos ES, sin build) + API de sincronización en `api/`. Antes de tocar nada lee [`README.md`](README.md) y [`plans/tareas.md`](plans/tareas.md).

## Convenciones

- **Sin frameworks ni compilación.** JavaScript de módulos ES y CSS planos. No añadas dependencias a la web; las de desarrollo (`@playwright/test`) viven solo en `package.json`.
- **Estilo del código:** funciones cortas, generadores y niveles en una línea densa, como en `data.js` y `ciencia.js`. Imita lo que hay.
- **Texto del alumno y del almacenamiento** que vaya a `innerHTML` pasa por `esc()` (`data.js`).
- **Contenido nuevo:** cada nivel lleva lección, generadores con `explain`, relato (`ANIMS`) con un paso «En la vida real» y preguntas que se comprueban en `tests/data.test.mjs` (recálculo de respuestas). Las respuestas se calculan, no se escriben a mano.
- **Relatos:** un recuadro por paso, `say` es lo que se narra y se subtitula, ningún `--d` mayor de 12 s. Respetan `prefers-reduced-motion`.
- **Estado del alumno:** `localStorage` clave `mates1eso.v1` (versión en `STATE_VERSION`). Un cambio de forma requiere migración en `migrateState` y, si se sincroniza, `sanitizeState`/`mergeState` en `api/src/sync.js` con pruebas.
- **Mensajes y textos en español**, tono cercano para 12 años.

## Antes de dar algo por hecho

1. `npm test` y `npm run lint` en verde (`npm test` incluye el control de estado del plan). `npm run format` comprueba Prettier solo en scripts y pruebas E2E; el contenido de una línea por generador no se reformatea.
2. `npm run test:e2e` en verde si tocaste `main.js`, `views/`, `player.js`, estilos, el reproductor, la API o el service worker.
3. No hace falta subir a mano la versión de la caché: la sella el despliegue (`scripts/stamp-sw.mjs`). Si añades un fichero a la web, inclúyelo en `ASSETS` de `sw.js` (una prueba lo exige).

## Flujo

- Una rama por tarea: `claude/tNN-tema`; PR contra `main`; CI en verde antes de fusionar.
- Actualiza el control de estado de `plans/tareas.md` en el mismo PR (⬜ → 🔄 → 👀 → ✅ con `#PR` y fecha). Una tarea solo empieza si sus dependencias están hechas.
- Sin datos personales de alumnos: nada de nombres, correos ni analítica.
