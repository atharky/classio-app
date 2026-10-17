# Explicaciones animadas con audio

Cada nivel empieza, en la pestaña **Aprende**, con una explicación animada por pasos: una escena que se va dibujando, una narración en voz alta y subtítulos siempre visibles. En algunos pasos la explicación se detiene y el alumno tiene que responder una pregunta para seguir. Si falla dos veces se le muestra la respuesta explicada y puede continuar. Debajo se mantiene la lección escrita como **Resumen escrito**.

## Controles

- **Empezar / Pausar / Continuar**: la narración no empieza hasta que el alumno pulsa (los navegadores no permiten audio sin un gesto del usuario).
- **Repetir paso**: vuelve a dibujar y narrar el paso actual.
- **Siguiente**: salta al paso siguiente. Está desactivado mientras haya una pregunta sin resolver.
- **Sonido activado / desactivado**: se recuerda en el dispositivo (`localStorage`, clave `mates1eso.sound`). Sin sonido, los pasos avanzan por tiempo, proporcional a la longitud del subtítulo.

Al salir de la pantalla (cambiar de pestaña, volver a niveles…) la narración se corta.

## Audio

- Por defecto se usa la **voz del navegador** (Web Speech API) con la primera voz en español disponible (`es-ES` si existe). No se descarga nada ni hace falta red, y la política de seguridad (CSP) no cambia.
- Si el navegador no tiene voz en español, se avisa y se siguen los subtítulos.
- Para usar **grabaciones propias**, añade `audio: 'audio/pot-1-1.mp3'` al paso y sube el archivo al mismo sitio. Si la grabación falla, se vuelve a los subtítulos. Recuerda añadir los archivos a `ASSETS` en `sw.js` si deben funcionar sin conexión.

## Cómo se escribe una animación

El contenido está en [`anim.js`](../anim.js), un array de pasos por nivel y módulo (`ANIMS[moduleId][nivel]`):

```js
{ say: 'Texto que se narra y se muestra como subtítulo.',
  show: line(`${at(0,'5 · 5 = 25')} ${at(1.4,`→ ${R(25)} = 5`)}`,'big'),  // escena
  ask: () => num('Calcula …', 5, 'Explicación'),                       // opcional: pregunta
  audio: 'audio/rai-1-2.mp3' }                                         // opcional: grabación
```

Piezas de escena: `at(retraso, html)` hace aparecer algo a los `retraso` segundos; `seq([...])` hace aparecer piezas una tras otra; `line(html, 'big')` es una línea de la escena; `lab(html, etiqueta, retraso, arriba)` pone una etiqueta debajo (o encima); `grid(n)` dibuja un cuadrado de n×n cuadraditos; `strike(html, retraso)` tacha algo. Con «reducir movimiento» activado en el sistema, las escenas se muestran directamente en su estado final.

Las pruebas (`npm test`) exigen para cada nivel de cada módulo con contenido: una animación, al menos 4 pasos, empezar explicando, al menos 2 preguntas válidas, y narraciones de 220 caracteres como máximo **escritas con palabras, sin cifras ni HTML** (la voz lee mejor «veinticinco» que «25»).
