# Detalle de tareas · Cuaderno 1º ESO

Complemento de [`plan-ejecucion.md`](plan-ejecucion.md). Cada tarea indica alcance, ficheros, criterio de hecho y el **modelo recomendado** para ejecutarla con un agente, elegido para optimizar coste sin perder calidad.

## Cómo se elige el modelo

Precios de referencia (API de Anthropic, por millón de tokens, entrada / salida, octubre de 2026):

| Modelo | ID | Precio | Para qué |
|---|---|---|---|
| **Haiku 5.5** | `claude-haiku-5-5` | 0,10 $ / 0,50 $ | Cambios mecánicos con especificación cerrada y pruebas que verifican el resultado: textos, configuración, documentación, correcciones de una línea. |
| **Sonnet 5.5** | `claude-sonnet-5-5` | 2 $ / 10 $ | Trabajo de desarrollo y de contenido con patrones ya establecidos en el repositorio: niveles y relatos nuevos, pruebas E2E a partir de los guiones existentes, componentes de interfaz. |
| **Opus 5.5** | `claude-opus-5-5` | 4 $ / 20 $ | Arquitectura, refactorizaciones que tocan todo el código, seguridad, diseño de CI, revisión didáctica con criterio. |
| **Fable 5.1** | `claude-fable-5-1` | 10 $ / 50 $ | Solo revisiones de diseño de alto nivel o depuración que Opus no resuelva. No se asigna a ninguna tarea por defecto. |

Reglas:
- Una tarea con **pruebas automáticas que la validan** puede bajar un escalón de modelo: el agente itera contra las pruebas.
- El **nivel de esfuerzo** (`effort`) también cuenta: Sonnet a `medium` basta para contenido con plantilla; Opus a `high` para refactorizaciones.
- Para contenido nuevo (niveles, relatos) la revisión didáctica final la hace una persona (T09), no un modelo más caro.
- El coste orientativo es relativo: **€** < 1 $ de modelo por sesión típica, **€€** 1–5 $, **€€€** 5–20 $.

Todas las tareas terminan con `npm test` en verde y, desde T01, con las E2E en verde. Cada una va en su PR contra `main`.

---

## Control de estado

**Actualizado:** 19-10-2026 · **Hechas:** 3 de 26 · **En curso:** 0 · **Pendientes:** 23

| Icono | Estado | Significa |
|---|---|---|
| ⬜ | Pendiente | Sin empezar |
| 🔄 | En curso | Hay una rama abierta; indicar la rama en «PR» hasta que haya PR |
| 👀 | En revisión | PR abierto y esperando CI o revisión |
| ✅ | Hecha | PR fusionado en `main` y desplegado |
| ⛔ | Bloqueada | No puede avanzar; anotar el motivo debajo de la tabla |
| ➖ | Descartada | Decidido no hacerla; anotar el motivo |

| ID | Tarea | Fase | Prio | Depende de | Modelo | Estado | PR | Fecha |
|---|---|---|---|---|---|---|---|---|
| T01 | Pruebas E2E en el repositorio y en CI | F1 | P1 | — | Opus | ✅ Hecha | #7 | 2026-10-19 |
| T02 | Versionado automático de la caché del service worker | F1 | P1 | — | Sonnet | ✅ Hecha | #7 | 2026-10-19 |
| T03 | Borrado del progreso en la nube | F1 | P1 | — | Sonnet | ⬜ Pendiente | — | — |
| T04 | Página de privacidad y uso de datos | F1 | P1 | T03 | Haiku | ⬜ Pendiente | — | — |
| T05 | Correcciones rápidas | F1 | P1 | — | Haiku | ✅ Hecha | #7 | 2026-10-19 |
| T06 | README y `CLAUDE.md` | F1 | P1 | T01, T02 | Haiku | ⬜ Pendiente | — | — |
| T07 | Raíces cuadradas: niveles 4 y 5, exámenes y activación | F2 | P2 | T01, T02 | Sonnet | ⬜ Pendiente | — | — |
| T08 | «En la vida real» en el resumen escrito | F2 | P2 | — | Haiku | ⬜ Pendiente | — | — |
| T09 | Revisión didáctica de todos los contenidos | F2 | P2 | — | Opus | ⬜ Pendiente | — | — |
| T10 | Repaso de fallos (repetición espaciada simple) | F2 | P2 | T01 | Opus | ⬜ Pendiente | — | — |
| T11 | Módulo «Divisibilidad» | F2 | P2 | T07 | Opus | ⬜ Pendiente | — | — |
| T24 | Módulo de Biología «La Tierra y la geosfera» | F2 | P2 | T01 | Sonnet | ⬜ Pendiente | — | — |
| T25 | Rehacer «Ciencia y pseudociencia» con la ficha de clase | F2 | P2 | — | Sonnet | ⬜ Pendiente | — | — |
| T12 | Dividir `app.js` en módulos | F3 | P2 | T01 | Opus | ⬜ Pendiente | — | — |
| T13 | ESLint y Prettier | F3 | P3 | T12 | Haiku | ⬜ Pendiente | — | — |
| T14 | Accesibilidad | F3 | P2 | T12 | Sonnet | ⬜ Pendiente | — | — |
| T15 | Fuentes autoalojadas | F3 | P2 | T02 | Haiku | ⬜ Pendiente | — | — |
| T16 | CSP sin `'unsafe-inline'` en estilos | F3 | P3 | T12 | Sonnet | ⬜ Pendiente | — | — |
| T17 | Selector de tema | F3 | P3 | — | Haiku | ⬜ Pendiente | — | — |
| T18 | Limitación de peticiones y telemetría en la API | F3 | P3 | T03 | Opus | ⬜ Pendiente | — | — |
| T26 | Nuevos tipos de pregunta: clasificar, completar y crucigrama | F3 | P3 | T01, T12 | Opus | ⬜ Pendiente | — | — |
| T19 | Módulo «Números enteros» | F4 | P3 | T11 | Opus | ⬜ Pendiente | — | — |
| T20 | Más temas de Lengua y Biología | F4 | P3 | T09 | Sonnet | ⬜ Pendiente | — | — |
| T21 | Narraciones grabadas | F4 | P4 | T07 | Haiku | ⬜ Pendiente | — | — |
| T22 | Panel de progreso del alumno | F4 | P3 | T10 | Sonnet | ⬜ Pendiente | — | — |
| T23 | Modo profesor real | F4 | P4 | T04, T18 | Opus | ⬜ Pendiente | — | — |

**Notas de bloqueo o descarte:** _ninguna_

### Cómo se actualiza

1. Al **empezar** una tarea, cambia su fila a 🔄 y anota la rama (`claude/<id>-<tema>`, por ejemplo `claude/t05-correcciones`).
2. Al **abrir el PR**, pasa a 👀 y escribe `#número` en «PR».
3. Al **fusionarlo** en `main`, pasa a ✅ y escribe la fecha (`AAAA-MM-DD`). Actualiza también la línea «Actualizado / Hechas / En curso / Pendientes» de arriba.
4. Una tarea solo puede empezar si todas las de «Depende de» están en ✅ (o ➖).
5. El estado se cambia **en el mismo PR** que ejecuta la tarea, para que `main` siempre refleje la realidad.

`npm test` comprueba que la tabla tiene una fila por cada tarea, que los estados son válidos, que los contadores cuadran y que ninguna tarea avanza con dependencias sin terminar.

---

## Fase 1 · Red de seguridad y deuda urgente

### T01 · Pruebas E2E en el repositorio y en CI
- **Estado:** ✅ Hecha
- **Prioridad:** P1 · **Tipo:** técnica · **Depende de:** —
- **Por qué:** los guiones de Playwright que validan el reproductor de relatos, la sincronización con dos dispositivos, el recorrido de todos los niveles y exámenes, y la revisión visual solo existen en el scratchpad de las sesiones. Hoy una regresión en `app.js` pasaría `npm test` y llegaría a producción.
- **Alcance:** carpeta `tests/e2e/` con `@playwright/test` como dependencia de desarrollo; migrar los cuatro guiones (reproductor con voz simulada y sin voz, humo de niveles y exámenes, sincronización contra Azurite con el almacén en memoria o un servidor de desarrollo, capturas de escenas con `reducedMotion`); servidor estático de pruebas; job en el flujo de Actions (`npx playwright test`, Chromium) antes del despliegue; capturas de referencia opcionales.
- **Hecho cuando:** `npm run test:e2e` pasa en local y en CI; un fallo provocado (por ejemplo, romper `advance()` en el reproductor) hace fallar el PR.
- **Modelo:** **Opus 5.5** (`high`) para el diseño de la suite y la integración en CI; los guiones ya existen, pero hay que convertirlos en pruebas robustas y sin tiempos fijos. **€€€**

### T02 · Versionado automático de la caché del service worker
- **Estado:** ✅ Hecha
- **Prioridad:** P1 · **Tipo:** técnica · **Depende de:** —
- **Por qué:** `sw.js` es *cache-first* con un nombre de caché que se sube a mano (`v4`). Ya se olvidó una vez y los usuarios con la PWA instalada no habrían visto los cambios.
- **Alcance:** paso en CI que calcula un hash de los ficheros publicados y lo escribe en `sw.js` (o genera `sw.js` desde una plantilla); estrategia *stale-while-revalidate* para los recursos propios, red directa para `/api/`; aviso discreto «Hay una versión nueva, recarga» cuando el SW nuevo se activa.
- **Hecho cuando:** cambiar cualquier fichero y desplegar invalida la caché sin tocar `sw.js` a mano; prueba E2E que comprueba el aviso de versión nueva.
- **Modelo:** **Sonnet 5.5** (`medium`). Patrón conocido; la prueba E2E valida el resultado. **€€**

### T03 · Borrado del progreso en la nube
- **Estado:** ⬜ Pendiente
- **Prioridad:** P1 · **Tipo:** funcional + legal · **Depende de:** —
- **Por qué:** «Borrar progreso» solo desvincula el dispositivo; la fila de Table Storage queda para siempre. Para un público menor de edad hace falta poder borrar los datos.
- **Alcance:** `POST /api/sync/delete` con `{code}` que elimina la entidad; botón «Borrar mis datos de la nube» en la vista Sincronizar, con confirmación; pruebas de la API (memoria y Azurite) y E2E; documentar en `_etc/sincronizacion.md`.
- **Hecho cuando:** tras borrar, el código deja de existir (`404 unknown_code`) y el dispositivo queda desvinculado.
- **Modelo:** **Sonnet 5.5** (`medium`); la lógica de `api/src/sync.js` tiene pruebas con almacén en memoria. **€€**

### T04 · Página de privacidad y uso de datos
- **Estado:** ⬜ Pendiente
- **Prioridad:** P1 · **Tipo:** funcional + legal · **Depende de:** T03
- **Alcance:** vista «Privacidad» enlazada desde el pie: qué se guarda en el navegador, qué viaja a la nube con el código (solo niveles y notas), que no se piden datos personales, cómo borrar; mención a las fuentes externas mientras no se haga T15.
- **Hecho cuando:** la página existe, es accesible y el texto lo ha revisado el responsable del proyecto.
- **Modelo:** **Haiku 5.5** para la vista y el enlace (especificación cerrada); el texto legal lo redacta o revisa una persona. **€**

### T05 · Correcciones rápidas
- **Estado:** ✅ Hecha
- **Prioridad:** P1 · **Tipo:** mixta · **Depende de:** —
- **Alcance:**
  1. `data.js` nivel 2 de Potencias: «cada vez que bajamos el exponente, dividimos entre 2» → «dividimos entre la base».
  2. `app.js` corrección del examen: escapar `userText(q)` (texto tecleado por el alumno) antes de insertarlo con `innerHTML`; añadir un helper `esc()` y usarlo también en la vista Sincronizar.
  3. `api/package.json`: `"engines": {"node": ">=22"}`.
  4. `deploy.ps1`: borrar o encabezar como obsoleto (el despliegue es por GitHub Actions).
  5. `_etc/materias.md`: añadir T07 pendiente; `_etc/analisis-app.md`: marcar como histórico.
- **Hecho cuando:** `npm test` en verde y una prueba unitaria para `esc()`.
- **Modelo:** **Haiku 5.5**. Cambios de una línea con instrucciones exactas. **€**

### T06 · README y `CLAUDE.md`
- **Estado:** ⬜ Pendiente
- **Prioridad:** P1 · **Tipo:** técnica · **Depende de:** T01, T02
- **Alcance:** `README.md` (qué es, cómo ejecutar en local, cómo probar, estructura de ficheros, cómo añadir un módulo o un relato, despliegue y variables); `CLAUDE.md` con las convenciones para agentes (sin frameworks, estilo de una línea por generador, reglas de narración, qué pruebas pasar, cómo subir la caché, rama + PR). Refundir el contenido útil de `_etc/*.md` y enlazar desde el README.
- **Modelo:** **Haiku 5.5** redactando a partir de la documentación existente; revisión de una persona. **€**

---

## Fase 2 · Contenido con el examen a la vista

### T07 · Raíces cuadradas: niveles 4 y 5, exámenes y activación
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional · **Depende de:** T01, T02
- **Alcance:** según `_etc/plan-modulo-raices.md`: nivel 4 (raíces, potencias y signos), nivel 5 (operaciones combinadas con raíces), exámenes parcial A/B y final, relatos de los dos niveles en el estilo de «El huerto de la abuela Rosa», prueba de recálculo de respuestas ampliada, quitar `soon:true`.
- **Hecho cuando:** el módulo aparece activo en el inicio, las 5 animaciones y los 3 exámenes pasan las pruebas y el recorrido E2E.
- **Modelo:** **Sonnet 5.5** (`medium`). Hay plan, plantilla y pruebas que recalculan las respuestas. **€€**

### T08 · «En la vida real» en el resumen escrito
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional · **Depende de:** —
- **Alcance:** tomar el paso `real(...)` de cada relato y mostrarlo como tarjeta al final del resumen escrito (escena en estado final, sin animación, más el texto narrado). Sin duplicar contenido: una función en `app.js` lo deriva de `ANIMS`.
- **Modelo:** **Haiku 5.5** con la especificación anterior; **€**.

### T09 · Revisión didáctica de todos los contenidos
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** contenido · **Depende de:** —
- **Alcance:** lista de comprobación por nivel: hechos, terminología del libro de texto (p. ej. los «cuatro pasos» del método científico de las páginas 10–11), redacción adecuada a 12 años, coherencia entre lección, preguntas y relato, el aviso sobre la ficha de Redi. Salida: informe con correcciones propuestas y PR con las que no requieran decisión.
- **Modelo:** **Opus 5.5** (`high`) para la revisión (hace falta criterio y conocimiento del currículo); **Haiku 5.5** para aplicar la lista de correcciones resultante. La aprobación final es de un docente. **€€**

### T10 · Repaso de fallos (repetición espaciada simple)
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional · **Depende de:** T01
- **Alcance:** guardar en el estado los generadores/niveles fallados con fecha; botón «Repasar lo que fallé» en el módulo que genera una prueba con preguntas de esos niveles; el fallo se «cura» tras dos aciertos; sincronizar el campo nuevo (ampliar `sanitizeState` y `mergeState` con pruebas); migración de estado `v3`.
- **Modelo:** **Opus 5.5** (`medium`) por tocar el modelo de estado y la fusión en la nube; **€€€**.

### T11 · Módulo «Divisibilidad»
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional · **Depende de:** T07
- **Alcance:** 5–6 niveles (múltiplos y divisores, criterios de divisibilidad, números primos y compuestos, descomposición factorial, m.c.m. y m.c.d., problemas), generadores con recálculo en pruebas, relatos, exámenes. Antes, un plan corto como el de Raíces.
- **Modelo:** **Opus 5.5** (`medium`) para el plan y los generadores con sus pruebas de recálculo; **Sonnet 5.5** para lecciones y relatos. **€€€**

### T24 · Módulo de Biología «La Tierra y la geosfera»
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional (contenido) · **Depende de:** T01
- **Alcance:** a partir de los apuntes y actividades del cuaderno (datos, respuestas y dudas en [`contenido-tierra-y-pseudociencia.md`](contenido-tierra-y-pseudociencia.md)): módulo `tierra` de la materia Biología con 4 niveles — Un planeta excepcional · Los subsistemas terrestres · Las capas de la geosfera · Corteza, manto y núcleo en detalle (litosfera, rocas, espesores, estados). Incluye lección, generadores con las preguntas de las fichas (etiquetar el dibujo de las capas, completar frases, verdadero o falso con corrección y las 8 pistas del crucigrama), el dibujo de la Tierra en corte, un relato «Un viaje al centro de la Tierra» por nivel con su ejemplo «En la vida real», exámenes parcial A, parcial B y del tema, y la caché del service worker.
- **Hecho cuando:** módulo activo en el inicio, pruebas de contenido y de relatos en verde, recorrido E2E sin errores, y los datos dudosos de la sección 5 del documento de contenido confirmados.
- **Modelo:** **Sonnet 5.5** (`medium`): `ciencia.js` y `biologia.js` sirven de plantilla y las pruebas validan preguntas y relatos. **€€**

### T25 · Rehacer «Ciencia y pseudociencia» con la ficha de clase
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional (contenido) · **Depende de:** —
- **Alcance:** actualizar el nivel 4 del módulo `ciencia` (`ciencia.js`) con el material real: las 11 disciplinas de la ficha con su clasificación correcta, las 5 características, el caso de María y Ricardo como hilo del relato «La fiesta de fin de curso» y la comparación de los dos mensajes (Agencia Nacional de Meteorología frente a «El Horóscopo»). Sustituir las listas actuales `SCIENCE`, `PSEUDO` y `TRAITS`, que no incluyen Matemáticas, Arqueología, Psicología, Grafología, Ufología, Cienciología ni Reflexología. Añadir preguntas sobre los errores frecuentes (Arqueología y Psicología son ciencias; Homeopatía, Numerología y Cienciología, no).
- **Hecho cuando:** pruebas de contenido y de relatos en verde; las 11 disciplinas aparecen en los generadores con la clasificación de la sección 2.2 del documento de contenido; el caso de Cienciología confirmado con la profesora.
- **Modelo:** **Sonnet 5.5** (`medium`): contenido sobre una plantilla existente y con pruebas que lo validan. **€€**

---

## Fase 3 · Calidad técnica y accesibilidad

### T12 · Dividir `app.js` en módulos
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** técnica · **Depende de:** T01
- **Alcance:** `state.js` (estado, migración, guardado, sincronización en segundo plano), `views/home.js`, `views/module.js`, `views/level.js`, `views/sync.js`, `exam.js`, `quiz.js`, `player.js` (reproductor de relatos), `question.js` (`qBody`, `wireQ`, `lockQ`…). Sin cambio de comportamiento; actualizar `sw.js`/T02 y las pruebas.
- **Hecho cuando:** E2E idénticas en verde; ningún fichero supera ~200 líneas.
- **Modelo:** **Opus 5.5** (`high`). Refactorización transversal con riesgo de regresión sutil. **€€€**

### T13 · ESLint y Prettier
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Tipo:** técnica · **Depende de:** T12
- **Alcance:** configuración mínima (ESM, navegador + Node, reglas recomendadas, sin reformatear el estilo de una línea por generador en los ficheros de contenido o acordar uno nuevo), scripts `lint`/`format`, paso en CI.
- **Modelo:** **Haiku 5.5**. **€**

### T14 · Accesibilidad
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** funcional · **Depende de:** T12
- **Alcance:** pestañas con `aria-controls`, `tabpanel` y navegación con flechas/Home/End; foco al encabezado al cambiar de vista; `aria-live` para el resultado de cada pregunta; etiquetas de los dibujos de material e instrumentos; comprobación con `@axe-core/playwright` en las E2E; revisión de contraste del rotulador rojo sobre pizarra.
- **Modelo:** **Sonnet 5.5** (`medium`); axe valida el resultado. **€€**

### T15 · Fuentes autoalojadas
- **Estado:** ⬜ Pendiente
- **Prioridad:** P2 · **Tipo:** técnica + privacidad · **Depende de:** T02
- **Alcance:** descargar Atkinson Hyperlegible, Bricolage Grotesque y Kalam en WOFF2 a `fonts/`, `@font-face` local, quitar Google Fonts de `index.html` y de la CSP, añadir a la caché del SW.
- **Modelo:** **Haiku 5.5**. **€**

### T16 · CSP sin `'unsafe-inline'` en estilos
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Tipo:** técnica · **Depende de:** T12
- **Alcance:** sustituir los `style="…"` de las plantillas por clases utilitarias; los anchos de las barras de progreso pasan a variables CSS (`style` con `--w` sigue siendo inline: usar `width` por clase escalonada o `data-` + CSS); quitar `'unsafe-inline'`.
- **Modelo:** **Sonnet 5.5** (`low`); la revisión visual E2E valida. **€€**

### T17 · Selector de tema
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Tipo:** funcional · **Depende de:** —
- **Alcance:** botón en el pie (Automático / Claro / Oscuro) que fija `data-theme` en `<html>` y lo recuerda en `localStorage`; el CSS ya contempla `data-theme`.
- **Modelo:** **Haiku 5.5**. **€**

### T18 · Limitación de peticiones y telemetría en la API
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Tipo:** técnica · **Depende de:** T03
- **Alcance:** contador por IP y ventana en Table Storage (o Front Door si se contrata), respuesta `429` con mensaje en el cliente; Application Insights en la Static Web App para errores de las funciones; alarma básica.
- **Modelo:** **Opus 5.5** (`medium`): decisión de diseño con seguridad; **€€**.

### T26 · Nuevos tipos de pregunta: clasificar, completar y crucigrama
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Tipo:** funcional · **Depende de:** T01, T12
- **Alcance:** hoy solo hay opción múltiple y respuesta numérica, y las fichas de clase usan formatos que no caben (sección 4 del documento de contenido): **clasificar** elementos en dos columnas (ciencia o pseudociencia), **completar frases** con una palabra (tolerando mayúsculas y tildes), **verdadero o falso y elegir la corrección**, **crucigrama** de definiciones y **etiquetar un dibujo** tocando la capa. Diseñar el tipo de pregunta en el modelo (`type`), su interfaz accesible con teclado, la corrección y su uso en niveles, relatos y exámenes; pruebas unitarias y E2E. Después, T24 y T25 pueden pasar de opción múltiple a estos formatos.
- **Hecho cuando:** los cinco formatos funcionan en un nivel de ejemplo, con teclado y lector de pantalla, y las pruebas de contenido los validan.
- **Modelo:** **Opus 5.5** (`high`): toca el modelo de preguntas, la interfaz y los exámenes. **€€€**

---

## Fase 4 · Crecimiento

### T19 · Módulo «Números enteros»
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Depende de:** T11 · **Modelo:** como T11. **€€€**

### T20 · Más temas de Lengua y Biología
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Depende de:** T09
- **Alcance:** a partir del temario real (fichas o índice del libro); cada tema sigue la plantilla: plan corto → niveles y generadores → relatos → exámenes → revisión.
- **Modelo:** **Sonnet 5.5** por tema; **Opus 5.5** si el tema exige generadores con cálculo. **€€** por tema.

### T21 · Narraciones grabadas
- **Estado:** ⬜ Pendiente
- **Prioridad:** P4 · **Depende de:** T07
- **Alcance:** generar un audio por paso (`audio: 'audio/<modulo>-<nivel>-<paso>.mp3'`) con un servicio TTS de calidad o grabación humana; script que detecta pasos sin audio; añadir a la caché del SW o cargar bajo demanda. Decidir coste de almacenamiento.
- **Modelo:** **Haiku 5.5** para el script y el cableado; la generación de audio no es tarea de modelo de lenguaje. **€**

### T22 · Panel de progreso del alumno
- **Estado:** ⬜ Pendiente
- **Prioridad:** P3 · **Depende de:** T10
- **Alcance:** vista «Mi progreso»: niveles superados por materia, mejores notas, fallos pendientes, racha; exportable.
- **Modelo:** **Sonnet 5.5**. **€€**

### T23 · Modo profesor real
- **Estado:** ⬜ Pendiente
- **Prioridad:** P4 · **Depende de:** T04, T18
- **Alcance:** decisión previa sobre datos de menores (qué ve el profesor y con qué consentimiento). Después: código de clase, alumnos que se unen con su código de sincronización, vista del grupo. Sustituye al «modo profesor» actual, que solo abre niveles sin protección.
- **Modelo:** **Opus 5.5** para el diseño y la API; **Sonnet 5.5** para las vistas. **€€€**

---

## Resumen por modelo

| Modelo | Tareas | Coste relativo |
|---|---|---|
| Haiku 5.5 | T04, T05, T06, T08, T13, T15, T17, T21 | € |
| Sonnet 5.5 | T02, T03, T07, T14, T16, T20, T22, T24, T25 (+ partes de T11, T23) | €€ |
| Opus 5.5 | T01, T09, T10, T11, T12, T18, T19, T23, T26 | €€€ |
| Fable 5.1 | Ninguna por defecto; disponible para revisar el diseño de T12 o T23 si Opus se atasca | — |

El orden de ejecución recomendado es el de `plan-ejecucion.md`: T01 → T05 → T02 → T03 → T04 → T06, y después la fase 2.
