# Revisión didáctica de los contenidos (T09)

Fecha: 19-10-2026 · Alcance: `data.js` (Potencias y Raíces), `lengua.js` (La comunicación y El resumen), `biologia.js` (Material de laboratorio), `ciencia.js` (La ciencia y el método científico) y los relatos animados (`*_ANIMS`, incluido `anim.js`).

Método: lectura completa de lecciones, generadores, explicaciones (`explain`) y relatos (`say`/`show`), y generación de preguntas de ejemplo con `node` para comprobar los casos dudosos (por ejemplo, con qué frecuencia sale una respuesta negativa). Solo se recogen problemas reales. Lo que está bien no aparece.

## Resumen

| Gravedad | Nº | Qué significa |
|---|---|---|
| **Alta** | 5 | Hay una pregunta con dos respuestas válidas (el alumno acierta y se le marca fallo) o un error de hecho en lo que se enseña |
| **Media** | 14 | Error menor de hecho o de cálculo explicado, regla incompleta, error gramatical visible o incoherencia entre lección, preguntas y relato |
| **Baja** | 15 | Redacción, precisión o coherencia interna del relato |
| **Total** | **34** | 30 «Aplicar ya» · 4 «Decidir» (S5, F2, M1, M3) |

**Fuera de alcance:**
- **Nivel 4 de `ciencia.js` (Ciencia y pseudociencia).** Depende de **T25**, que sustituirá `SCIENCE`, `PSEUDO`, `TRAITS` y el relato de Sara por el material de la ficha (ver `plans/contenido-tierra-y-pseudociencia.md`). No se revisa como fallo. Al rehacerlo, conviene evitar los problemas de este informe: distractores que también son correctos y artículos escritos a mano en las explicaciones.
- **Experimento de Redi.** La app usa la versión correcta (gusanos en el bote abierto). El aviso sobre la ficha con los resultados invertidos ya está documentado, así que no hay hallazgo.

Leyenda: **AY** = Aplicar ya (corrección inequívoca) · **D** = Decidir (requiere criterio del profesorado).

---

## Matemáticas · Potencias (`data.js`, `anim.js`)

### Nivel 1 · ¿Qué es una potencia?

**P1 · Media · AY** — `data.js:33`
- **Texto actual:** `const b=ri(2,9),e=ri(2,6);` con el distractor `` `${W[e]} elevado a ${W[b]}` ``
- **Problema:** cuando la base y el exponente coinciden en 2 o 3 (≈5 % de las preguntas), el distractor «dos elevado a dos» o «tres elevado a tres» también es una lectura correcta de 2² o 3³. Hay dos respuestas válidas.
- **Corrección:** `let b=ri(2,9),e=ri(2,6);while(e===b)e=ri(2,6);` (el mismo patrón que ya usa la línea 30).

**P2 · Baja · AY** — `anim.js:40` y `anim.js:42`
- **Texto actual:** la narración dice «una bacteria se divide en dos **cada veinte minutos**», y la pregunta que sigue dice «Una bacteria se divide en dos **cada hora**…».
- **Problema:** el relato y la pregunta dan datos distintos.
- **Corrección (pregunta, l. 42):** `` `Una bacteria se divide en dos cada veinte minutos. Si empiezas con una, ¿cuántas bacterias hay después de ${n} divisiones?` `` y en la explicación `` `Cada división duplica las bacterias: ${P(2,n)} = ${2**n} bacterias.` ``

### Nivel 2 · Cuadrados, cubos y casos especiales

**P3 · Baja · AY** — `anim.js:48`
- **Texto actual:** «Con las baldosas que sobran, su hermano monta un cubo de tres por tres por tres. Tres al cubo: veintisiete cubitos.»
- **Problema:** con baldosas planas no se monta un cubo de 27 cubitos. La imagen mental no encaja.
- **Corrección:** «Mientras tanto, su hermano monta con cubitos de madera un cubo de tres por tres por tres. Tres al cubo: veintisiete cubitos.»

### Nivel 3 · Potencias de números negativos

**P4 · Baja · AY** — `anim.js:74`
- **Texto actual:** «En la vida real: las calculadoras siguen la misma regla.»
- **Problema:** no todas las calculadoras siguen esa regla. Algunas básicas y algunas aplicaciones del móvil calculan −3² como 9. La afirmación es cierta para las **científicas**.
- **Corrección:** «En la vida real: las calculadoras científicas siguen la misma regla. Si tecleas menos tres al cuadrado sin paréntesis, te da menos nueve. Con paréntesis, nueve.»

### Nivel 6 · Operaciones combinadas

**P5 · Media · AY** — `data.js:117` (y el relato, `anim.js:120`)
- **Texto actual:** `1. Paréntesis → 2. Potencias → 3. Multiplicaciones y divisiones → 4. Sumas y restas`
- **Problema:** falta la regla para operaciones del mismo nivel (de izquierda a derecha). Los generadores la necesitan: `10^m · 10^n : 10^p` (l. 132) y, en Raíces, `a·r : √(r²) + c²` (l. 228). Sin ella, el alumno puede dividir antes de multiplicar y equivocarse.
- **Corrección (l. 117):** añadir después del `div`: `<p>Si hay varias operaciones del mismo nivel (por ejemplo, multiplicaciones y divisiones), se hacen <b>de izquierda a derecha</b>.</p>`

---

## Matemáticas · Raíces cuadradas (`data.js`, `anim.js`)

### Nivel 1 · ¿Qué es una raíz cuadrada?

**R1 · Media · AY** — `data.js:152`
- **Texto actual:** el distractor `` `Porque ${n*n} es la mitad de ${2*n*n}` `` (por ejemplo, «Porque 49 es la mitad de 98»).
- **Problema:** la frase es **verdadera**: 49 sí es la mitad de 98. Un alumno puede elegirla razonando bien. El distractor quería atacar el error «la raíz es la mitad».
- **Corrección:** `` `Porque ${n} es la mitad de ${n*n}` `` (es falsa para n ≥ 3, y el generador usa n de 3 a 10).

### Nivel 2 · Cuadrados perfectos y raíces exactas

**R2 · Media · AY** — `data.js:161`
- **Texto actual:** «Si el radicando acaba en un número **par** de ceros, la raíz lleva la mitad de ceros»
- **Problema:** la regla está incompleta. El 200 la contradice: acaba en dos ceros, pero no tiene raíz exacta, porque 2 no es un cuadrado perfecto.
- **Corrección:** `<p>Si el radicando acaba en un número <b>par</b> de ceros y, al quitarlos, queda un <b>cuadrado perfecto</b>, la raíz lleva <span class="hl">la mitad de ceros</span>:</p>`

### Nivel 3 · Raíces enteras y aproximadas

**R3 · Media · AY** — `anim.js:181`
- **Texto actual:** «Raíz de treinta es **casi** cinco con cuatro.»
- **Problema:** es un error de hecho. √30 ≈ 5,477: es **algo más** de 5,4 (5,4 es la aproximación por defecto). «Casi» da a entender que queda por debajo.
- **Corrección:** «Raíz de treinta es algo más de cinco con cuatro: aproximada por defecto a las décimas, cinco con cuatro.»

### Nivel 4 · Raíces, potencias y signos

**R4 · Media · AY** — `data.js:211`
- **Texto actual:** `` num(`Calcula ${P(-k,2)} − ${R(m*m)}`,k*k-m, …) `` sin `hint`
- **Problema:** con k = 2 y m > 4 el resultado es negativo (≈8 % de las preguntas, comprobado con 20 000 generaciones), pero no aparece la pista del botón ± que sí llevan las preguntas de Potencias (l. 66 y 68). El alumno puede no saber cómo escribir el signo menos.
- **Corrección:** añadir el cuarto argumento `'Si el resultado es negativo, usa el botón ±.'`

### Nivel 5 · Operaciones combinadas con raíces

**R5 · Media · AY** — `data.js:227`
- **Texto actual:** `` num(`Calcula ${a} + ${R(r*r)} · ${b} − ${P(c,2)}`,a+r*b-c*c, …) `` sin `hint`
- **Problema:** es el mismo caso que R4. Sale un resultado negativo en ≈8 % de las preguntas (por ejemplo, 2 + 2 · 2 − 16 = −10) y no hay pista del botón ±.
- **Corrección:** añadir el cuarto argumento `'Si el resultado es negativo, usa el botón ±.'` Otra opción, si se prefiere evitar los negativos aquí: `c=ri(2,3)`.

**R6 · Baja · AY** — `anim.js:219`
- **Texto actual:** «Si la base está a tres metros y la pared a cuatro metros de altura, la escalera mide cinco metros.»
- **Problema:** la frase es confusa: lo que mide cuatro metros no es la pared, sino la altura a la que llega la escalera. Además, no dice de qué está a tres metros la base.
- **Corrección:** «En la vida real: un carpintero apoya una escalera en la pared. Si el pie de la escalera está a tres metros de la pared y la escalera llega a cuatro metros de altura, mide raíz de nueve más dieciséis: cinco metros.»

---

## Lengua · La comunicación (`lengua.js`)

### Nivel 1 · Los elementos de la comunicación

**C1 · Baja · AY** — `lengua.js:196`
- **Texto actual:** `tag(250,122,'quedar la tarde',3.9,'blue')`
- **Problema:** «quedar la tarde» no es correcto en español. La narración dice «dos amigos que organizan la tarde».
- **Corrección:** `tag(250,122,'organizar la tarde',3.9,'blue')`

### Nivel 2 · Comunicación verbal y no verbal. Los signos

**C2 · Baja · AY** — `lengua.js:214`
- **Texto actual:** «El semáforo en rojo significa para porque lo hemos acordado»
- **Problema:** «significa para» se lee mal, sobre todo si la narración se oye en voz alta.
- **Corrección:** «El semáforo en rojo significa que hay que parar porque lo hemos acordado: es un símbolo.»

### Nivel 3 · Las funciones del lenguaje

**C3 · Alta · AY** — `lengua.js:38`
- **Texto actual:** `Poética:[…,'Bebe Frescola, ¡la que mola!',…]`
- **Problema:** el eslogan es también **apelativo**. El propio relato (l. 236) lo presenta como «apelativa + poética». En el generador de la l. 97 («¿Qué función predomina?») aparece la opción «Apelativa», que también sería correcta. En el de la l. 98 («¿Qué frase tiene función apelativa?») puede salir como distractor siendo apelativo.
- **Corrección:** sustituirlo en la lista `Poética` por un verso sin intención apelativa, por ejemplo `'Por una mirada, un mundo.'` (Bécquer). El ejemplo de Frescola se queda solo en el relato de «En la vida real», donde se explica la mezcla.

---

## Lengua · El resumen (`lengua.js`)

### Nivel 1 · Idea principal, ideas secundarias y palabras clave

**S1 · Media · AY** — `lengua.js:122`
- **Texto actual:** `keys:'reciclar · materiales · recursos · basura'`
- **Problema:** «recursos» **no aparece en el texto**. Los distractores (`'árboles · mar · vidrio · efecto'`) sí son palabras del texto. La lección enseña a subrayar palabras clave del texto.
- **Corrección:** `keys:'reciclar · materiales · energía · basura'`

**S2 · Baja · AY** — `lengua.js:126`
- **Texto actual:** `main:'Leer a menudo mejora el lenguaje, la concentración y la imaginación.'`
- **Problema:** el texto no habla de imaginación, sino de vocabulario, ortografía, concentración, memoria y «viajar a otros lugares». La respuesta modelo añade una idea que no está en el texto, justo lo que la lección dice que no hay que hacer («Fiel: […] sin añadir nada»).
- **Corrección:** `main:'Leer a menudo tiene muchos beneficios: mejora el vocabulario, la concentración y la memoria.'`

**S3 · Baja · AY** — `lengua.js:254` (relato)
- **Texto actual:** «abejas, polen, plantas, alimentos. Son sustantivos y verbos importantes»
- **Problema:** las cuatro palabras son sustantivos. Ninguna es un verbo.
- **Corrección:** «Por último, Carla rodea las palabras clave: abejas, polen, plantas, alimentos. Son sustantivos importantes, no palabras como además o porque.»

### Nivel 2 · Cómo se hace un resumen

**S4 · Alta · AY** — `lengua.js:165-166`
- **Texto actual:** cuando el resumen erróneo es `x.opinion`, las opciones incluyen «Dice algo que no aparece en el texto o lo contradice».
- **Problema:** hay dos respuestas válidas. Varias opiniones también dicen algo que no está en el texto o lo contradicen: «no creo que dormir sea tan importante» (l. 118), «Reciclar es un rollo…» (l. 124), «Leer es aburrido…» (l. 130).
- **Corrección:** sustituir el filtro por `.filter(w=>w!==why&&!(k===0&&w.startsWith('Dice algo')))`. Quedan tres opciones: la correcta, «Solo recoge un detalle» y «Es demasiado objetivo».

**S5 · Media · D** — `lengua.js:160` frente a `lengua.js:111`, `117`, `123`, `129` y `135`
- **Texto actual:** la regla dice «Breve: más o menos una **cuarta parte** del texto original», pero los resúmenes modelo ocupan entre el 39 % (abejas: 23 de 59 palabras) y el 56 % (sueño: 29 de 52 palabras).
- **Problema:** la respuesta «mejor resumen» incumple la regla que se acaba de enseñar, y el relato (l. 267) la repite. Con textos de unas 55 palabras, una cuarta parte son unas 14, y es difícil resumir fielmente en tan poco.
- **Opciones:** (a) suavizar la regla: «Breve: mucho más corto que el original (en textos largos, más o menos una cuarta parte)», o (b) acortar los cinco `sum` a unas 15-20 palabras. El generador de la l. 167 (calcular la cuarta parte) puede mantenerse en los dos casos.

---

## Biología · Material de laboratorio (`biologia.js`)

### Nivel 1 · Material de vidrio

**B1 · Alta · AY** — `biologia.js:90-91` (con los usos de `USE`, l. 65)
- **Texto actual:** en «¿Qué material sirve para *contener, mezclar y calentar líquidos*?» puede salir el matraz Erlenmeyer como distractor. En «¿Para qué sirve el matraz Erlenmeyer?» puede salir como distractor el uso del vaso de precipitados.
- **Problema:** la lección (l. 83) dice que «el vaso de precipitados y el matraz Erlenmeyer contienen, mezclan y calientan líquidos». El distractor también es correcto.
- **Corrección:** en las dos líneas, cambiar `GLASS.filter(x=>x!==k)` por `GLASS.filter(x=>x!==k&&!(['vaso','erlen'].includes(k)&&['vaso','erlen'].includes(x)))`.

### Nivel 2 · Otros instrumentos

**B2 · Media · AY** — `biologia.js:179` (relato)
- **Texto actual:** «Mientras el agua se calienta, deja los tubos en la gradilla y tritura unos granos de sal gorda en el mortero.»
- **Problema:** contradice el paso anterior (está sujetando el tubo sobre la llama con las pinzas) y da mal ejemplo de seguridad: deja el calentamiento sin vigilar.
- **Corrección:** «Cuando el agua ya está caliente, apaga el mechero y deja el tubo en la gradilla. Después tritura unos granos de sal gorda en el mortero.»

### Nivel 3 · El microscopio óptico

**B3 · Media · AY** — `biologia.js:125`
- **Texto actual:** `` `¿El <b>${p}</b> forma parte de la parte óptica o de la parte mecánica del microscopio?` ``
- **Problema:** el artículo está fijo. Salen «¿El **platina** forma parte…?», «¿El **base**…?» y «¿El **objetivos** forma parte…?».
- **Corrección:** `` `¿${p==='platina'||p==='base'?'La':p==='objetivos'?'Los':'El'} <b>${p}</b> ${p==='objetivos'?'forman':'forma'} parte de la parte óptica o de la parte mecánica del microscopio?` ``

**B4 · Baja · AY** — `biologia.js:117` (frente a `biologia.js:40` y `biologia.js:195`)
- **Texto actual:** la lección dice «Acerca **el objetivo** con el macrométrico», la función del macrométrico dice que «sube o baja mucho **la platina**» y el relato dice «acerca **la muestra**».
- **Problema:** tres descripciones distintas del mismo gesto.
- **Corrección (l. 117):** «3. Acerca la platina al objetivo con el <b>macrométrico</b>, mirando de lado.»

---

## Biología · La ciencia y el método científico (`ciencia.js`)

### Nivel 1 · Fake news o bulos

**F1 · Alta · AY** — `ciencia.js:33-37` y `ciencia.js:95`
- **Texto actual:** cada caso de `CLUE_CASES` tiene una sola pista correcta, y las otras salen como distractores.
- **Problema:** varios casos encajan en más de una pista:
  - «La buscas en Google y no aparece en ningún periódico» (4) también encaja en «¿Está en medios serios o solo en redes?» (3).
  - «Te llega por WhatsApp […] sin enlace a ningún medio» (0) también encaja en 3 y 4.
  - «Solo aparece en una cuenta de TikTok» (3) también encaja en 0 y 4.
  - «¡¡INCREÍBLE!!» con faltas (1) también encaja en 2.
  - «un zumo cura todas las enfermedades» (2) y «un mineral se convierte en diamante» (2) también encajan en «exageraciones» (1).
- **Corrección:** añadir a cada caso las pistas que también valen y excluirlas de los distractores.
  ```js
  const CLUE_CASES=[
    ['La noticia no dice quién la ha escrito ni de dónde sale.',0,[]],['El titular dice «¡¡INCREÍBLE!! Los cientificos lo confirman» con varias faltas de ortografía.',1,[2]],
    ['Asegura que un mineral se convierte en diamante al tocar el agua del mar.',2,[1]],['Solo aparece en una cuenta de TikTok con pocos seguidores.',3,[0,4]],
    ['La buscas en Google y no aparece en ningún periódico.',4,[3]],['La publica una marca que vende justo el producto del que habla la noticia.',5,[]],
    ['Promete que un zumo cura todas las enfermedades «en tres días».',2,[1]],['Te llega por WhatsApp como «reenviado muchas veces», sin enlace a ningún medio.',0,[3,4]]];
  // l. 95
  ()=>{const [c,i,also]=pick(CLUE_CASES);return mc(`${c}<br>¿Qué pista te hace sospechar?`,CLUES[i][0],shuffle(CLUES.filter((_,j)=>j!==i&&!also.includes(j))).slice(0,3).map(x=>x[0]),`${CLUES[i][0]} ${CLUES[i][1]}`)},
  ```
  Siempre quedan al menos 3 distractores.

**F2 · Baja · D** — `ciencia.js:39`
- **Texto actual:** `'«España suma más de 4.500 kilómetros de cuevas y cada año se descubren 50 más.» (El País)'`
- **Problema:** la cita se atribuye a un periódico real como ejemplo de noticia «fiable», pero no hay referencia que permita comprobarla. Además, «50 más» es ambiguo (¿kilómetros o cuevas?). En un nivel sobre contrastar fuentes conviene que el ejemplo se pueda contrastar.
- **Opciones:** confirmar la noticia y precisar «50 kilómetros más», o quitar la atribución y cambiarla por un ejemplo genérico, como en la l. 40.

### Nivel 2 · El método científico

**M1 · Media · D** — `ciencia.js:105`, `ciencia.js:48` y `ciencia.js:56`
- **Texto actual:**
  - La lección numera cuatro pasos y deja uno sin número: «1. Observación y pregunta → 2. Hipótesis → 3. Experimentación → 4. Análisis de datos y conclusiones → comunicación de resultados».
  - `STEPS` tiene **seis** pasos, y con ellos se pregunta «¿Qué paso va justo después…?» (l. 114).
  - `PART` usa otros nombres: «Datos (resultados)» y «Conclusión».
- **Problema:** la terminología y el número de pasos no coinciden entre lección y preguntas. El alumno estudia «4. Análisis de datos y conclusiones» como un solo paso, y después se le pregunta qué va después del análisis de datos (respuesta: «Conclusiones»). Hay que alinearlo con el libro de texto (páginas 10-11, «cuatro pasos» según `tareas.md`).
- **Opciones:**
  - (a) Si el libro usa seis pasos: `1. <b>Observación</b> → 2. <b>Hipótesis</b> → 3. <b>Experimentación</b> → 4. <b>Análisis de datos</b> → 5. <b>Conclusiones</b> → 6. <b>Comunicación de resultados</b>`, y en `PART` usar `dat:'Análisis de datos'` y `con:'Conclusiones'`.
  - (b) Si usa cuatro pasos: reducir `STEPS` y `STEP_DEF` a esos cuatro con el nombre exacto del libro y ajustar la l. 114 (`Math.random()*3`).

**M2 · Media · AY** — `ciencia.js:112`
- **Texto actual:** `` `Es la ${s.toLowerCase()}.` ``
- **Problema:** salen explicaciones como «Es la **análisis de datos**.» y «Es la **conclusiones**.».
- **Corrección:** `` `Es ${({'Análisis de datos':'el','Conclusiones':'las'})[s]||'la'} ${s.toLowerCase()}.` ``

**M3 · Alta · D** — `ciencia.js:53`, relato `ciencia.js:186-191`
- **Texto actual:** en el experimento, una planta crece «al sol y otra a oscuras». Tras dos semanas, «la planta al sol mide 12 cm y la otra, 4 cm».
- **Problema:** es un error de hecho. En la oscuridad las plantas se **ahílan** (etiolación): el tallo se alarga más buscando luz, aunque la planta quede pálida y débil. El experimento escolar clásico da justo lo contrario en altura, y un alumno que lo pruebe en casa verá otro resultado.
- **Propuesta:** medir algo que sí cambia en el sentido esperado.
  - `exp:'Pongo dos plantas iguales, con la misma tierra y la misma agua: una junto a la ventana y otra dentro de un armario.'`
  - `dat:'Tras dos semanas, la planta de la ventana tiene 6 hojas nuevas y está verde; la del armario no tiene hojas nuevas y está amarillenta.'`
  - `con:'Las plantas necesitan luz para crecer sanas.'`
  - Ajustar en el mismo sentido la hipótesis (l. 53 y 183: «…crecen más sanas cuando reciben luz») y la tabla del relato (l. 189: «6 hojas» y «0 hojas» en lugar de «12 cm» y «4 cm»).

**M4 · Baja · AY** — `ciencia.js:54`
- **Texto actual:** `obs:'El pan que guardo en una bolsa cerrada se llena de moho antes.'`
- **Problema:** «antes» no dice antes que qué. La observación queda incompleta.
- **Corrección:** `obs:'El pan que guardo en una bolsa cerrada se llena de moho antes que el que dejo al aire.'`

**M5 · Baja · AY** — `ciencia.js:190` (relato)
- **Texto actual:** `say:'¿Qué sabes de los datos y las conclusiones?'` delante de `gens[0]`
- **Problema:** `gens[0]` elige al azar entre cinco preguntas, y varias no tratan de datos ni conclusiones (por ejemplo, «¿Qué queremos comprobar cuando experimentamos?»).
- **Corrección:** `say:'Responde a esta pregunta sobre el método científico.'`

### Nivel 3 · El experimento de Redi

**E1 · Baja · AY** — `ciencia.js:119`
- **Texto actual:** «que algunos seres vivos, como los gusanos, nacían solos de la carne podrida»
- **Problema:** los «gusanos» de la carne son larvas de mosca. Aclararlo una vez da sentido a la conclusión (huevo → larva → mosca) y evita una idea errónea.
- **Corrección:** «que algunos seres vivos, como los gusanos (en realidad, larvas de mosca), nacían solos de la carne podrida»

**E2 · Baja · AY** — `ciencia.js:67`
- **Texto actual:** `con:'Los gusanos proceden de los huevos de las moscas: la generación espontánea es falsa.'`
- **Problema:** Redi solo la refutó para los gusanos (los microorganismos llegaron después, con Pasteur). El propio relato (l. 207) matiza «al menos para los gusanos», y la pregunta de la l. 129 también. La conclusión de la lección generaliza demasiado.
- **Corrección:** `con:'Los gusanos proceden de los huevos de las moscas: no nacen por generación espontánea.'`

### Nivel 4 · Ciencia y pseudociencia

Pendiente de **T25**. No se reporta.

### Nivel 5 · Mujeres científicas

**W1 · Media · AY** — `ciencia.js:149` (y relato, `ciencia.js:233`)
- **Texto actual:** «a veces sus descubrimientos se atribuyeron a hombres. Por ejemplo, Rosalind Franklin no recibió el premio Nobel por el ADN.»
- **Problema:** el ejemplo, tal como está, induce a error. Franklin murió en 1958, el Nobel de 1962 no se concede a título póstumo, y la injusticia documentada es otra: su «Fotografía 51» se enseñó a Watson y Crick sin que ella lo supiera.
- **Corrección (l. 149):** «Por ejemplo, la «Fotografía 51» de Rosalind Franklin se enseñó a otros investigadores sin que ella lo supiera y les ayudó a descubrir la forma del ADN. Ella murió en 1958 y no compartió el premio Nobel de 1962.»
- **Relato (l. 233):** cambiar «No recibió el Nobel.» por «Murió joven y no llegó a recibir el Nobel.»

**W2 · Baja · AY** — `ciencia.js:151`
- **Texto actual:** «Hoy hay tantas chicas como chicos que pueden dedicarse a la ciencia.»
- **Problema:** la frase es ambigua (parece hablar de cantidades) y no transmite la idea de igualdad de oportunidades.
- **Corrección:** «Hoy chicas y chicos pueden dedicarse a la ciencia por igual.»

---

## Comprobaciones sin hallazgos

- **Matemáticas:** cálculos, tablas y ejemplos de Potencias y Raíces, recalculados uno a uno: 5,4² = 29,16; 3 + 7 : 7 − 4 = 0; 310 − 125 = 185, etc.
- **Lengua:** los seis elementos, el código y el canal de las escenas, las funciones del lenguaje (salvo C3) y los signos.
- **Laboratorio:** pictogramas del SGA (rombo de borde rojo), normas de seguridad y aumentos del microscopio.
- **Científicas:** datos de Curie (única persona premiada en dos ciencias), Salas (φ29), Goodall (Tanzania), Johnson (Apolo 11), Carson (1962), Hipatia y la fecha del 11 de febrero.
- **Redi:** año 1668 y diseño del experimento.
- **Sesgos:** en los relatos se reparten por igual entre chicos y chicas los errores y los aciertos, y los papeles de autoridad. No se han encontrado estereotipos.
