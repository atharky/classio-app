# Cuaderno 1º ESO

Aplicación web educativa y estática para 1º de ESO: explicaciones animadas en pizarra con narración, pruebas por niveles, exámenes y progreso que se puede sincronizar entre dispositivos con un código (sin cuentas ni datos personales).

**Materias y módulos activos:** Matemáticas (Potencias, Raíces cuadradas), Lengua (La comunicación, El resumen) y Biología (La ciencia y el método científico, Material de laboratorio, La Tierra y la geosfera). El plan de lo que viene está en [`plans/`](plans/plan-ejecucion.md).

## Ejecutar en local

No hay compilación ni frameworks. Hace falta Node 22 o superior.

```bash
node tests/e2e/server.mjs 8791     # web + API de sincronización en memoria
# abre http://localhost:8791/
```

## Probar

```bash
npm test                 # unitarias: contenido, relatos, plan de tareas, API de sincronización, service worker
npm ci && npx playwright install chromium
npm run lint             # ESLint (y `npm run format` para Prettier en scripts y pruebas)
npm run test:e2e         # navegador: reproductor, recorrido de niveles y exámenes, sincronización, service worker
```

`npm run test:e2e` levanta solo el servidor de pruebas. Si ya tienes un Chromium, define `CHROMIUM_PATH=/ruta/al/chrome`. Ambas suites se ejecutan en CI antes de desplegar.

## Estructura

| Fichero | Qué contiene |
|---|---|
| `index.html`, `styles.css`, `main.js` | Página, estilos y punto de entrada |
| `state.js`, `net.js`, `ui.js`, `update.js` | Estado y progreso (`localStorage`), sincronización en segundo plano, marco de la página (migas, pie, navegación) y aviso de versión nueva |
| `views/` | Vistas: inicio, módulo, nivel (con resumen escrito), privacidad y sincronización |
| `quiz.js`, `exam.js`, `question.js`, `player.js` | Pruebas de nivel y repaso, exámenes, preguntas (render y corrección) y reproductor de relatos |
| `data.js` | Utilidades y generadores de preguntas de Potencias y Raíces |
| `anim.js`, `lengua.js`, `biologia.js`, `ciencia.js`, `tierra.js` | Niveles de cada materia y los relatos animados (`ANIMS`) |
| `sketch.js` | Piezas de dibujo de la pizarra (trazos, texto que se escribe) |
| `catalog.js` | Materias (`SUBJECTS`), módulos (`MODULES`) y relatos (`ANIMS`) |
| `sync.js`, `api/` | Cliente de sincronización y API (Azure Functions + Table Storage) |
| `sw.js`, `scripts/stamp-sw.mjs` | Service worker (PWA) y sello de versión de la caché |
| `tests/`, `api/test/` | Pruebas unitarias; `tests/e2e/` las de navegador |
| `plans/` | Plan de mejoras, detalle de tareas con control de estado |
| `_etc/` | Documentación de diseño: [materias](_etc/materias.md), [animaciones](_etc/animaciones.md), [sincronización](_etc/sincronizacion.md), [plan de Raíces](_etc/plan-modulo-raices.md) |

## Añadir contenido

- **Un nivel:** añade el nivel al módulo (`lessons` + `gens`, generadores que devuelven `{prompt, options|answer, explain}`) y su relato en `ANIMS`. `tests/data.test.mjs` valida cada pregunta y cada relato.
- **Un módulo nuevo:** declara el módulo en `catalog.js` con su materia, niveles y exámenes (referencias `'módulo:nivel'`). Mira [`_etc/materias.md`](_etc/materias.md).
- Las reglas de narración y los pasos de un relato están en [`_etc/animaciones.md`](_etc/animaciones.md).

## Despliegue

Cada push a `main` y cada PR contra `main` ejecutan `.github/workflows/azure-static-web-apps-*.yml`: `npm test`, pruebas E2E, sellado de la caché del service worker y publicación en Azure Static Web Apps (la web tal cual, la API compilada). La API necesita la variable `SYNC_STORAGE_CONNECTION`; ver [`_etc/sincronizacion.md`](_etc/sincronizacion.md).

## Privacidad

No hay cuentas ni datos personales. Solo se guardan niveles superados, notas y tipos de pregunta pendientes de repasar, en el navegador y, si el alumno lo activa, en Table Storage bajo la huella de un código. Se puede borrar todo (ver la página «Privacidad» de la app).
