# Explicaciones animadas con audio

Cada nivel empieza, en la pestaña **Aprende**, con una explicación animada por pasos en estilo **pizarra blanca** (*whiteboard animation*): una historia que se va trazando a medida que avanza la narración (ver «Storytelling en pizarra»). Hay narración en voz alta y subtítulos siempre visibles. En algunos pasos la explicación se detiene y el alumno tiene que responder una pregunta para seguir. Si falla dos veces se le muestra la respuesta explicada y puede continuar. Debajo se mantiene la lección escrita como **Resumen escrito**.

## Storytelling en pizarra

La explicación de cada nivel se cuenta como una **historia que se va trazando** en una pizarra blanca grande:

- **Cada paso se dibuja en un recuadro nuevo** y los anteriores se quedan en la pizarra. Los recuadros se colocan en zigzag (tres por fila).
- **La cámara viaja** de un recuadro al siguiente: se aleja a mitad de camino y vuelve a acercarse mientras se traza la flecha que los une. Durante la narración se acerca muy despacio, para que la pizarra nunca esté quieta del todo.
- **El trazo acompaña a la voz:** los tiempos de cada escena se estiran o encogen (`--k`) para que el dibujo se reparta a lo largo de la narración, y esperan (`--o`) a que la cámara llegue.
- **Las palabras clave** (las negritas de las escenas) se marcan con rotulador fosforito justo después de escribirse.
- **Las preguntas también forman parte de la historia:** en la pizarra se dibuja un «?» con la pregunta escrita. La pregunta se responde debajo de la pizarra, y al resolverla queda escrita en el recuadro con un ✓ (o con la solución).
- **Al salir de un recuadro su dibujo se completa al instante**, para que la historia nunca quede a medias.
- **Al final, la cámara se aleja hasta mostrar la historia completa.** Tocando un recuadro (o con Tab + Intro) se vuelve a ese paso.
- **Pausar** detiene la voz, el trazo y la cámara a la vez.
- No aparece ninguna mano ni rotulador: solo el trazo.

### Aspecto

- La pizarra es blanca con marco, también en modo oscuro (es un objeto, no el fondo de la página). Usa letra manuscrita **Kalam** (autoalojada en `fonts/`) y rotulador negro, azul, rojo y verde.
- El texto aparece «escribiéndose» (recorte animado) y los dibujos SVG se trazan con `stroke-dashoffset`; las líneas tienen un pequeño temblor de mano alzada, siempre el mismo para que las escenas no cambien entre visitas.
- Si una escena no cabe en su recuadro, se encoge para caber.
- Con «reducir movimiento» activado en el sistema no hay viajes de cámara ni animaciones: cada escena aparece terminada.

## Ejemplos de la vida real

Cada nivel incluye un paso **«En la vida real»** con su dibujo y una pregunta práctica:

| Nivel | Ejemplo |
|---|---|
| Potencias 1 | Doblar un folio: cada doblez duplica las capas (2⁵ = 32) |
| Potencias 2 | Baldosas de un patio (6² = 36) y cubo de Rubik (3³ = 27) |
| Potencias 3 | El signo menos como «media vuelta» |
| Potencias 4 | Almacén: 10² cajas con 10³ clips = 10⁵ |
| Potencias 5 | Tablero de ajedrez: (2³)² = 2⁶ = 64 casillas |
| Potencias 6 | Caja de bombones: 4² − 3 = 13, primero la potencia |
| Raíces 1 | Huerto cuadrado de 49 m² → lado de 7 m |
| Raíces 2 | Formar un cuadrado con 36 alumnos (con 40 no se puede) |
| Raíces 3 | 30 alumnos → cuadrado de 5 × 5 y sobran 5 (el resto) |
| Raíces 4 | El área de un cuadrado nunca es negativa: no hay raíz de −9 |
| Raíces 5 | Escalera del carpintero: 3 m de base y 4 m de pared → 5 m (√(9+16)) |
| Divisibilidad 1 | Repartir 12 onzas de chocolate: sus divisores |
| Divisibilidad 2 | Repartir 120 caramelos entre 3 amigos con el criterio del 3 |
| Divisibilidad 3 | Claves de seguridad con primos enormes |
| Divisibilidad 4 | Engranajes y descomposición en factores primos |
| Divisibilidad 5 | Cortar cintas en trozos iguales (m.c.d.) |
| Divisibilidad 6 | Semáforos coordinados («ola verde», m.c.m.) |
| Enteros 1 | El termómetro: −5 °C es más frío que −2 °C |
| Enteros 2 | Las puntuaciones negativas de un juego |
| Enteros 3 | La temperatura que sube de −4 °C a 2 °C |
| Enteros 4 | Las deudas a cuatro amigos: 4 · (−3) = −12 € |
| Enteros 5 | La calculadora y la jerarquía de operaciones |
| Enteros 6 | La montaña: temperatura y altitud |
| Comunicación 1 | El árbitro pita un penalti: emisor, receptores, código y canal |
| Comunicación 2 | Señales de tráfico: iconos (peatón) y símbolos (prohibido) |
| Comunicación 3 | La publicidad: función apelativa y poética |
| Palabras 1 | Una receta: sustantivos (ingredientes) y adjetivos (cómo deben estar) |
| Palabras 2 | Un mensaje de móvil: llego, llegué, llegaré |
| Palabras 3 | En la panadería: «dame este bollo» |
| Resumen 1 | Subrayar para estudiar un examen |
| Resumen 2 | Contar una película a un amigo en un minuto |
| Seres vivos 1 | Una planta de interior que se nutre, crece y echa un brote |
| Seres vivos 2 | El yogur y sus bacterias |
| Seres vivos 3 | El pan y la levadura (un hongo) |
| Laboratorio 1 | La cocina: jarra medidora y embudo |
| Laboratorio 2 | La báscula de la cocina: pesar por diferencia |
| Laboratorio 3 | Observar células de cebolla al microscopio |
| Laboratorio 4 | La lejía de casa y el pictograma de corrosivo |

## Controles

- **Empezar / Pausar / Continuar**: la narración no empieza hasta que el alumno pulsa (los navegadores no permiten audio sin un gesto del usuario).
- **Repetir paso**: vuelve a dibujar y narrar el paso actual.
- **Siguiente**: salta al paso siguiente. Está desactivado mientras haya una pregunta sin resolver.
- **Sonido activado / desactivado**: se recuerda en el dispositivo (`localStorage`, clave `mates1eso.sound`). Sin sonido, los pasos avanzan por tiempo, proporcional a la longitud del subtítulo.

Al salir de la pantalla (cambiar de pestaña, volver a niveles…) la narración se corta.

## Audio

- Por defecto se usa la **voz del navegador** (Web Speech API) con la primera voz en español disponible (`es-ES` si existe). No se descarga nada ni hace falta red, y la política de seguridad (CSP) no cambia.
- Si el navegador no tiene voz en español, se avisa y se siguen los subtítulos.
- Para usar **grabaciones propias** (voz humana o de un servicio de síntesis de calidad):
  1. `node scripts/audio-report.mjs --write` crea `audio/manifest.json` con la ruta y el texto de cada paso sin audio (`audio/<módulo>-<nivel>-<paso>.mp3`).
  2. Graba o genera cada texto y guarda el archivo en su ruta.
  3. Añade `audio: 'audio/<módulo>-<nivel>-<paso>.mp3'` al paso. Si la grabación falla, se vuelve a los subtítulos y a la voz del navegador.
  `npm test` comprueba que cada audio declarado existe y que el nombre es el esperado. `node scripts/audio-report.mjs --strict` falla si falta alguno (para activarlo en CI cuando estén todos).
- **Sin conexión:** los audios se cargan **bajo demanda** y el service worker los guarda al reproducirlos por primera vez (solo respuestas completas; los audios solo se precargan si se añaden a `ASSETS`). Para precargar todos hay que sumarlos a `ASSETS`: cada narración de 10 a 20 s en MP3 mono a 64 kbit/s pesa unos 100–150 KB, así que los 355 pasos actuales rondan los 45 MB. **Decisión pendiente:** si ese peso es aceptable en la Static Web App y en los móviles del alumnado, o si solo se graban los niveles con más uso.

## Cómo se escribe una animación

Las animaciones están en [`anim.js`](../anim.js) (Matemáticas), [`lengua.js`](../lengua.js) y [`biologia.js`](../biologia.js), y se reúnen en `ANIMS[moduleId][nivel]` en [`catalog.js`](../catalog.js). Las piezas de pizarra están en [`sketch.js`](../sketch.js). Cada paso:

```js
{ say: 'Texto que se narra y se muestra como subtítulo.',
  show: line(`${at(0,'5 · 5 = 25')} ${at(1.4,`→ ${R(25)} = 5`)}`,'big'),  // escena
  ask: () => num('Calcula …', 5, 'Explicación'),                       // opcional: pregunta
  audio: 'audio/rai-1-2.mp3' }                                         // opcional: grabación
```

Piezas de texto: `at(retraso, html)` escribe algo a los `retraso` segundos (tarda más cuanto más largo); `seq([...])` escribe piezas una tras otra; `line(html, 'big')` es una línea de la pizarra; `lab(html, etiqueta, retraso, arriba)` pone una etiqueta debajo (o encima); `strike(html, retraso)` tacha algo; `real(título, html)` marca el paso como ejemplo «En la vida real».

Piezas de dibujo (SVG): `sk(ancho, alto, trazos)` crea el dibujo; dentro, `ln` (línea), `box` (rectángulo), `circ` (círculo), `ell` (elipse), `arrow` (flecha horizontal), `pointer` (flecha en cualquier dirección), `person` (persona), `bubble` (bocadillo) se trazan con el rotulador; `fill` y `dot` rellenan; `tx` escribe texto. Atajos: `grid(n)` (cuadrícula de n × n que se rellena casilla a casilla) y `dots(n, sobran)` (formación de n × n puntos con puntos sueltos en rojo).

Las pruebas (`npm test`) exigen para cada nivel de cada módulo con contenido: una animación, al menos 4 pasos, empezar explicando, al menos 2 preguntas válidas, un ejemplo «En la vida real», y narraciones de 220 caracteres como máximo **escritas con palabras, sin cifras ni HTML** (la voz lee mejor «veinticinco» que «25»).
