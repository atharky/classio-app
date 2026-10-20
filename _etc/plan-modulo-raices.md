# Plan de implementación: módulo «Raíces cuadradas»

> **Ejecutado (T07):** niveles 4 y 5, exámenes y activación del módulo ya están en `main`.

**Estado de partida:** `main` @ `bf54b49`  
**Módulo objetivo:** `raices` (hoy declarado en `MODULES` con `soon:true`, en [`data.js`](../data.js))  
**Por qué este:** es el siguiente de la lista y continúa directamente a Potencias (la raíz cuadrada es la operación inversa del cuadrado, ya trabajado en el nivel 2 de Potencias).

## 1. Qué hay ya y qué se reutiliza

La app está preparada para módulos dirigidos por datos, así que **no hace falta tocar las vistas** de `app.js`:

| Pieza | Dónde | Reutilización |
|---|---|---|
| Modelo de módulo `{id,name,sym,desc,levels,exams}` | `data.js` · `MODULES` | Se rellena la entrada `raices` y se quita `soon` |
| Nivel `{title,sub,lesson:[[título,html]],gens:[()=>pregunta]}` | `data.js` · `POT_LEVELS` | Mismo formato para `RAI_LEVELS` |
| Generadores de pregunta `mc()` y `num()` | `data.js` | Se usan tal cual |
| Corrección numérica `parseNum` (acepta coma decimal y `−`) | `data.js` | Sirve para respuestas enteras y con décimas |
| Progreso por módulo `mp(id)` y exámenes `S.exams['raices:…']` | `app.js` | Se crean solos; **no requiere migración** ni subir `STATE_VERSION` |
| Inicio, ruta de niveles, prueba de 5 preguntas (aprobar con 4), exámenes con nota y desglose | `app.js` | Funcionan para cualquier módulo |

## 2. Diseño didáctico (5 niveles)

Ajustado a 1.º de ESO: raíces cuadradas de naturales, exactas y enteras (por defecto, con resto), estimación y jerarquía de operaciones. Se deja fuera el algoritmo manual de la raíz cuadrada (ver §6).

### Nivel 1 · ¿Qué es una raíz cuadrada?
*La operación inversa de elevar al cuadrado.*
- **Lección:** √49 = 7 porque 7² = 49; partes (símbolo radical, radicando, raíz); relación con el área de un cuadrado (lado de un cuadrado de área 36); cómo se lee.
- **Error típico:** √16 ≠ 8 (no es dividir entre 2).
- **Generadores:**
  - `num`: Calcula √n² para n ∈ 1–12.
  - `mc`: «¿Por qué √64 = 8?» → «porque 8² = 64» frente a «porque 64 : 2 = 32», «porque 8 · 2 = 16»…
  - `mc`: identificar radicando o raíz en √a = b.
  - `num`: «Un cuadrado tiene un área de A cm². ¿Cuánto mide su lado?».
  - `mc`: √n vs n : 2 (distractor de dividir entre 2).

### Nivel 2 · Cuadrados perfectos y raíces exactas
*Reconocer cuadrados perfectos y calcular raíces exactas.*
- **Lección:** tabla de cuadrados 1–20 (reutilizando el estilo `.tbl`); qué es un cuadrado perfecto; truco con ceros: √(a·100) = 10·√a (√900 = 30, √10 000 = 100).
- **Error típico:** √90 no es 30 (los ceros deben ir por parejas).
- **Generadores:**
  - `num`: √n² para n ∈ 11–20.
  - `mc`: «¿Cuál de estos números es un cuadrado perfecto?» (uno perfecto + vecinos no perfectos).
  - `num`: √(k²·100) y √(k²·10 000).
  - `mc`: «¿Es n cuadrado perfecto?» Sí/No.
  - `num`: «¿Qué número al cuadrado da N?» (redacción inversa).

### Nivel 3 · Raíces enteras y aproximadas
*Raíz entera por defecto, resto y estimación.*
- **Lección:** si el número no es cuadrado perfecto, la raíz está entre dos enteros (5² = 25 < 30 < 36 = 6²); raíz entera por defecto (5) y resto (30 − 25 = 5); prueba: radicando = raíz² + resto; aproximación a las décimas por tanteo (5,4² = 29,16; 5,5² = 30,25 → √30 ≈ 5,4).
- **Error típico:** el resto nunca puede ser mayor que 2·raíz.
- **Generadores (respuesta siempre entera, salvo el de décimas):**
  - `num`: raíz entera de n (n no cuadrado, 2–400).
  - `num`: resto de la raíz entera de n.
  - `mc`: «√n está entre…» (a y a+1, con distractores a−1/a, a+1/a+2, n/2…).
  - `num`: «La raíz entera de N es r y el resto es s. ¿Cuánto vale N?».
  - `num`: √n aproximada a las décimas por defecto (n ≤ 99). Calcular la respuesta como `Math.floor(Math.sqrt(n)*10)/10` y comprobar en el propio generador que `(d/10)² ≤ n < ((d+1)/10)²` con enteros, para evitar errores de coma flotante.

### Nivel 4 · Raíces, potencias y signos
*Dos números al cuadrado dan lo mismo; la raíz de un negativo no existe (en los números que conocemos).*
- **Lección:** 5² = 25 y (−5)² = 25, por eso «¿qué número al cuadrado da 25?» tiene dos respuestas, pero el símbolo √25 indica la positiva; √(−9) no tiene solución entre los números que se estudian en 1.º; √(a²) = a y (√a)² = a.
- **Error típico:** √(−9) ≠ −3, porque (−3)² = 9.
- **Generadores:**
  - `mc`: «¿Qué números elevados al cuadrado dan N?» → «k y −k».
  - `mc`: «¿Cuánto vale √(−n)?» → «No existe» frente a −k, k, «−k y k».
  - `num`: (√n)² y √(n²) con n grande (p. ej. √(37²) = 37) para fijar la idea de operación inversa.
  - `mc`: verdadero/falso sobre las propiedades anteriores.

### Nivel 5 · Operaciones combinadas con raíces
*Jerarquía y propiedades de la raíz de un producto y un cociente.*
- **Lección:** las raíces se calculan al mismo nivel que las potencias (después de paréntesis, antes de · y :); √(a·b) = √a · √b (√(4·25) = 2·5 = 10); √(a:b) = √a : √b; el radicando funciona como un paréntesis: √(9+16) = √25 = 5.
- **Error típico:** √(9 + 16) ≠ √9 + √16 (5 ≠ 7). Paralelo al error (2+3)² ≠ 2² + 3² de Potencias.
- **Generadores:**
  - `num`: √a² + √b², k·√n², √a² · √b².
  - `num`: √(a² + b²) con ternas pitagóricas (3-4-5, 6-8-10, 5-12-13, 8-15-17).
  - `num`: √(a²·b²) usando la propiedad del producto.
  - `num`: expresión combinada tipo `3 + √49 : 7 − 2²`.
  - `mc`: √(a + b) frente a √a + √b (elegir el valor correcto).

### Exámenes del módulo

```js
exams:[
  {id:'r1',name:'Examen parcial A',sub:'Niveles 1 a 3',levels:[0,1,2],n:10},
  {id:'r2',name:'Examen parcial B',sub:'Niveles 4 y 5',levels:[3,4],n:10},
  {id:'rf',name:'Examen final',sub:'Todo el módulo',levels:[0,1,2,3,4],n:12}
]
```

`viewExam` reparte las preguntas con `Math.floor(n/levels.length)` y asigna el sobrante a los primeros niveles: 10/3 → 4-3-3, 10/2 → 5-5, 12/5 → 3-3-2-2-2. Sin cambios.

## 3. Cambios técnicos por archivo

### `data.js`
1. **Helper de presentación `R(x)`**, análogo a `P(b,e)`:
   ```js
   const R=x=>`<span class="rt"><span class="rad" aria-hidden="true">√</span><span class="sr">raíz de </span><span class="rc">${typeof x==='number'?fmt(x):x}</span></span>`;
   ```
   La barra superior sobre el radicando se hace con CSS (`border-top`) para que `√(9 + 16)` se vea agrupado sin necesitar paréntesis visuales. El texto `.sr` hace que un lector de pantalla lea «raíz de 49» en vez de un símbolo suelto.
2. **Helper numérico `isqrt(n)`** (`Math.floor(Math.sqrt(n))` con corrección ±1 por si la coma flotante falla) para raíz entera y resto; exportarlo para probarlo.
3. **`RAI_LEVELS`** con los 5 niveles de §2, mismo estilo de código que `POT_LEVELS` (una línea por generador, `ri`/`pick`/`mc`/`num`).
4. **Entrada en `MODULES`:** sustituir la línea de `raices` por `{id:'raices',name:'Raíces cuadradas',sym:R('x'),desc:'Raíces exactas y aproximadas.',levels:RAI_LEVELS,exams:[…]}` (sin `soon`). Ojo: `sym` hoy es `'√'` en texto plano; si se usa `R('x')` hay que comprobar que en la tarjeta de inicio (`.mod .sym`) se ve bien, si no dejar `'√'`.
5. **Exportar** `R`, `isqrt`, `RAI_LEVELS`.

> Si `data.js` pasa de ~300 líneas, valorar mover los contenidos a `content/potencias.js` y `content/raices.js` que importen las utilidades. **No es requisito** de este módulo; si se hace, añadir los nuevos ficheros a `ASSETS` en `sw.js`.

### `styles.css`
- `.rt{white-space:nowrap}`; `.rt .rad{color:var(--pen);font-weight:700}`; `.rt .rc{border-top:2px solid currentColor;padding:0 2px;margin-left:1px}`; `.prompt .rt{font-size:1.15em}` (igual que `.prompt .pw`).
- Clase utilitaria `.sr` (visualmente oculta) si no existe ya.
- Opcional: variante de `.anat` para la anatomía de la raíz (radical / radicando / raíz) en la lección del nivel 1.

### `app.js`
No requiere cambios funcionales. Revisar solo:
- La tarjeta de inicio y el recuento «X de 5 niveles» (son genéricos).
- Que `rightText()` muestre bien respuestas con décimas: `fmt(5.4)` devuelve `"5.4"` con punto. **Ajuste necesario:** en `fmt`, sustituir el punto decimal por coma (`String(...).replace('.',',')`) para que la corrección diga «5,4». Afecta solo a números no enteros, así que Potencias no cambia.
- `parseNum` elimina los puntos (los trata como separador de miles), así que «5.4» se lee como 54. No cambiarlo (rompería «1.000» en Potencias); en su lugar, el generador de décimas debe llevar la pista `'Usa la coma decimal: 5,4'`.

### `sw.js` (crítico)
- El service worker es **cache-first** y la caché se llama `cuaderno-mates-v1`. Si no se cambia, los usuarios que ya instalaron la PWA **seguirán viendo el `data.js` viejo** (con «Próximamente»). Subir a `cuaderno-mates-v2` en el mismo commit que publica el módulo.
- Recomendado (puede ir en un PR aparte): pasar a *stale-while-revalidate* para que futuros módulos no dependan de acordarse de subir la versión.

### `tests/data.test.mjs`
1. Generalizar la prueba existente a **todos los módulos activos** (`MODULES.filter(m=>!m.soon)`) en lugar de solo `POT_LEVELS`.
2. Ejecutar cada generador muchas veces (p. ej. 200) porque son aleatorios, y comprobar:
   - `num`: `Number.isFinite(answer)`; `parseNum(fmt(answer)) === answer` (lo que la app muestra como correcto debe ser aceptado si el alumno lo escribe).
   - `mc`: opciones sin duplicados, `answer` dentro de rango, al menos 2 opciones.
   - `prompt` y `explain` no vacíos y sin `undefined`/`NaN` en el texto.
3. Coherencia de exámenes: todos los índices de `exam.levels` existen en `levels` y `n ≥ levels.length`.
4. Pruebas propias de raíces: `isqrt` en 0–10 000 cumple `r² ≤ n < (r+1)²`; `R(49)` contiene `49` y el texto accesible.
5. Prueba de `fmt` con decimales (`fmt(5.4) === '5,4'`).

### `_etc/analisis-app.md`
Añadir una sección breve con el estado del nuevo módulo y la validación realizada.

## 4. Orden de trabajo (commits)

> Entre los commits 2 y 3 se añadió la sincronización entre dispositivos por código (ver [`sincronizacion.md`](sincronizacion.md)). Ya sube la caché del service worker a `v2` y añade `sync.js` a `ASSETS`; al activar Raíces hay que subirla otra vez (`v3`).

1. **Infraestructura:** `R`, `isqrt`, `.rt`/`.sr` en CSS, `fmt` con coma decimal + pruebas de estos helpers. `npm test` en verde, Potencias sin cambios visibles.
2. **Pruebas generales:** generalizar `tests/data.test.mjs` a todos los módulos (debe seguir pasando solo con Potencias).
3. **Contenido niveles 1–3** de `RAI_LEVELS` (el módulo todavía con `soon:true` para no publicarlo a medias).
4. **Contenido niveles 4–5** y exámenes.
5. **Activación:** quitar `soon`, subir la versión de caché en `sw.js`, actualizar `_etc/analisis-app.md`.

## 5. Verificación

- `node --check data.js app.js` y `npm test`.
- Servidor local (`npx serve .` o `python3 -m http.server`) y recorrido manual o con Playwright (Chromium ya disponible en el entorno):
  - inicio muestra «Raíces cuadradas · 0 de 5 niveles» y la tarjeta es pulsable;
  - nivel 1 abierto, nivel 2 bloqueado; aprobar 4/5 desbloquea el nivel 2;
  - una respuesta con décimas («5,4») se acepta como correcta;
  - los tres exámenes generan 10/10/12 preguntas, la nota se guarda y aparece en la tarjeta;
  - el modo profesor abre los 5 niveles; exportar/importar conserva el progreso de ambos módulos;
  - modo oscuro y ancho de móvil (≤ 480 px): el radical y la barra se ven bien.
- PWA: con la versión anterior instalada, recargar y comprobar que aparece el módulo nuevo (valida el cambio de caché).
- Revisión didáctica de las 5 lecciones por un docente antes de publicar.

## 6. Fuera de alcance / decisiones abiertas

- **Algoritmo manual de la raíz cuadrada:** algunos libros de 1.º lo incluyen. Se puede añadir más adelante como nivel 6 con preguntas de paso a paso; no encaja bien con preguntas de una sola respuesta.
- **Raíces cúbicas o de índice superior:** corresponden a cursos posteriores.
- **Corrección pendiente en Potencias:** el análisis previo señala que la lección del exponente 0 dice «dividimos entre 2» en lugar de «entre la base». Es un cambio de una línea y conviene hacerlo en el mismo PR o justo antes, ya que el nivel 4 de Raíces vuelve sobre esas ideas.
- **Pruebas E2E en navegador:** siguen pendientes para toda la app; este módulo es buen momento para añadir un primer test de Playwright que cubra el desbloqueo de niveles.
