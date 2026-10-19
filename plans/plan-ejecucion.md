# Plan de ejecución · Cuaderno 1º ESO

**Estado de partida:** `main` @ `f149d66` (18-10-2026). App estática en Azure Static Web Apps con API de sincronización (Azure Functions + Table Storage), 5 módulos activos en 3 materias, explicaciones animadas en pizarra con relatos, 44 pruebas unitarias en CI.

El detalle de cada tarea (alcance, criterio de hecho, modelo recomendado y coste) está en [`tareas.md`](tareas.md). Este documento ordena las tareas en fases y explica por qué.

**Seguimiento:** el estado de cada tarea (⬜ pendiente, 🔄 en curso, 👀 en revisión, ✅ hecha, ⛔ bloqueada, ➖ descartada) se lleva en el [Control de estado de `tareas.md`](tareas.md#control-de-estado). Se actualiza en el mismo PR que ejecuta la tarea, y `npm test` comprueba que la tabla es coherente.

## Resumen ejecutivo

| | Qué está bien | Qué falta |
|---|---|---|
| **Producto** | Modelo pedagógico claro (aprender → prueba → desbloqueo → examen), relatos animados en todos los niveles, sincronización sin datos personales, «Examen del tema» alineado con el examen real de Biología. | Raíces sigue oculto; dos módulos de Matemáticas son solo placeholders; no hay forma de borrar el progreso de la nube; sin página de privacidad para un público menor de edad; errores didácticos menores sin corregir. |
| **Técnica** | Sin frameworks ni compilación, CSP estricta, PWA, pruebas de contenido que validan cada pregunta y cada relato, flujo CI/CD que ejecuta `npm test` antes de desplegar. | Las pruebas de navegador (Playwright) **no están en el repositorio**: viven en el scratchpad de las sesiones y no se ejecutan en CI. `app.js` es un único fichero de líneas densas. La caché del service worker hay que subirla a mano en cada cambio (ya se olvidó una vez). Sin README ni `CLAUDE.md`. Sin lint. |

**Riesgo principal:** cualquier regresión en el reproductor de relatos, los exámenes o la sincronización solo se detectaría a mano, porque las pruebas E2E no están automatizadas. Por eso la **fase 1 es consolidar la red de seguridad** antes de seguir añadiendo contenido o refactorizar.

## Criterios de prioridad

- **P1 · Ahora:** riesgo real para usuarios o para la capacidad de seguir desarrollando (regresiones silenciosas, datos de menores, errores didácticos visibles).
- **P2 · Siguiente:** aporta valor claro y desbloquea otras tareas.
- **P3 · Después:** mejoras deseables sin urgencia.
- **P4 · Si hay tiempo:** ideas de bajo impacto o alto coste.

## Fases

Cada fase se entrega en uno o varios PR pequeños contra `main`; el flujo de Actions despliega una vista previa por PR y producción al fusionar.

### Fase 1 · Red de seguridad y deuda urgente (P1)

Objetivo: que cualquier cambio posterior se valide solo.

| # | Tarea | Depende de |
|---|---|---|
| T01 | Llevar las pruebas E2E de Playwright al repositorio (`tests/e2e/`) y ejecutarlas en CI | — |
| T02 | Versionado automático de la caché del service worker (hash de los ficheros en CI) y estrategia *stale-while-revalidate* | — |
| T03 | Borrado del progreso en la nube (`DELETE /api/sync`) y botón «Borrar mis datos de la nube» | — |
| T04 | Página de privacidad y uso de datos (qué se guarda, dónde, cómo borrarlo; público menor de edad) | T03 |
| T05 | Correcciones rápidas: lección del exponente 0 («dividir entre la base»), escapar el texto del alumno en la corrección del examen, `engines` en `api/package.json`, retirar `deploy.ps1` o marcarlo como obsoleto | — |
| T06 | README y `CLAUDE.md` (cómo ejecutar, probar, estructura, convenciones de contenido); refundir `_etc/analisis-app.md`, que está desfasado | T01, T02 |

**Salida de la fase:** CI con pruebas unitarias + E2E; sin pasos manuales al publicar; el alumno puede borrar sus datos; documentación de entrada para cualquier colaborador o agente.

### Fase 2 · Contenido con el examen a la vista (P2)

Objetivo: cubrir lo que los alumnos necesitan ahora, con el motor ya validado. El contenido de T24 y T25 sale de los materiales de clase recibidos el 19-10-2026 y está detallado en [`contenido-tierra-y-pseudociencia.md`](contenido-tierra-y-pseudociencia.md).

| # | Tarea | Depende de |
|---|---|---|
| T07 | Raíces cuadradas: niveles 4 y 5, exámenes, relatos y activación del módulo (plan en `_etc/plan-modulo-raices.md`) | T01 (regresión), T02 (caché) |
| T08 | Tarjeta «En la vida real» en el resumen escrito de cada nivel (hoy solo está en el relato) | — |
| T09 | Revisión didáctica de todos los contenidos (hechos, terminología del libro, nombres de los pasos del método científico) con una lista de correcciones | — |
| T10 | Repaso de fallos: cola de preguntas falladas por alumno y «Repasar lo que fallé» en el módulo (repetición espaciada simple) | T01 |
| T11 | Módulo de Matemáticas «Divisibilidad» (múltiplos, divisores, criterios, primos, m.c.m. y m.c.d.) | T07 |
| T24 | Módulo de Biología «La Tierra y la geosfera» (apuntes y actividades del cuaderno) | T01 |
| T25 | Rehacer «Ciencia y pseudociencia» con la ficha de clase (11 disciplinas, características, mensajes) | — |

### Fase 3 · Calidad técnica y accesibilidad (P2–P3)

Objetivo: reducir el coste de cada cambio futuro.

| # | Tarea | Depende de |
|---|---|---|
| T12 | Dividir `app.js` en módulos (`state.js`, `views/`, `player.js`, `exam.js`) sin cambiar comportamiento, protegido por E2E | T01 |
| T13 | ESLint + Prettier con configuración mínima y paso en CI | T12 |
| T14 | Accesibilidad: pestañas con `aria-controls` y flechas, foco al cambiar de vista, anuncio de resultados, revisión con axe en E2E | T12 |
| T15 | Fuentes autoalojadas (Atkinson Hyperlegible, Kalam): sin petición a Google desde dispositivos de menores y funcionamiento sin conexión | T02 |
| T16 | Quitar `'unsafe-inline'` de `style-src` sustituyendo los `style="…"` por clases | T12 |
| T17 | Selector de tema claro/oscuro (el CSS ya admite `data-theme`) | — |
| T18 | Limitación de peticiones en la API y telemetría de errores (Application Insights) | T03 |
| T26 | Nuevos tipos de pregunta: clasificar, completar, verdadero o falso con corrección y crucigrama | T01, T12 |

### Fase 4 · Crecimiento (P3–P4)

| # | Tarea | Depende de |
|---|---|---|
| T19 | Módulo «Números enteros» | T11 |
| T20 | Más temas de Lengua y Biología según el temario del curso | T09 |
| T21 | Narraciones grabadas (voz humana o TTS de calidad) por paso, con el campo `audio` ya previsto | T07 |
| T22 | Panel de progreso del alumno (mejores notas, tiempo, niveles por materia) | T10 |
| T23 | Modo profesor real: código de clase, ver el progreso del grupo (requiere decisión sobre datos de menores) | T04, T18 |

## Dependencias (vista rápida)

```
T01 ─┬─> T07 ─> T11 ─> T19
     ├─> T10 ─> T22
     ├─> T24
     └─> T12 ─┬─> T13
              ├─> T14
              ├─> T16
              └─> T26
T02 ─┬─> T07
     └─> T15
T03 ─> T04 ─> T23
T03 ─> T18 ─> T23
T09 ─> T20
```

## Lo que no está en el plan (y por qué)

- **Migrar a un framework o a TypeScript:** la app funciona sin compilación y eso simplifica el despliegue y la revisión. No compensa hasta que el tamaño lo exija; T12 y T13 cubren la mantenibilidad a corto plazo.
- **Cuentas de usuario:** la decisión de usar códigos de sincronización sin datos personales se tomó a propósito (menores). Solo se reconsideraría con T23.
- **Internacionalización:** la app es para 1º ESO en español.

## Estimación global

Con el reparto de modelos de `tareas.md`, las fases 1–2 son unas 14 sesiones de trabajo de agente, la mayoría en Sonnet 5.5; Opus 5.5 solo en las tareas de arquitectura y seguridad; Fable 5.1 únicamente en revisiones de diseño puntuales. El coste de modelo de todo el plan queda dominado por cuatro tareas (T01, T12, T26 y T07); T24 y T25, que nacen de los materiales de clase, son de Sonnet; el resto son tareas de Haiku o Sonnet con pruebas que verifican el resultado.
