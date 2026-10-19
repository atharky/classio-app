# Materias y módulos

La app (ahora **Cuaderno 1º ESO**) organiza el contenido en **materias → módulos → niveles**. El inicio muestra los módulos agrupados por materia.

| Materia | Módulo | Niveles | Exámenes |
|---|---|---|---|
| Matemáticas | Potencias | 6 | Parcial A, parcial B, final |
| Matemáticas | Raíces cuadradas | 5 | Parcial A, parcial B, final |
| Lengua Castellana y Literatura | La comunicación | 1. Elementos (emisor, receptor, mensaje, código, canal, contexto) · 2. Verbal y no verbal; indicio, icono y símbolo · 3. Funciones del lenguaje | Examen del tema |
| Lengua Castellana y Literatura | El resumen | 1. Idea principal, secundarias y palabras clave · 2. Cómo se hace un resumen | Examen del tema |
| Biología y Geología | La ciencia y el método científico | 1. Fake news o bulos · 2. El método científico · 3. El experimento de Redi · 4. Ciencia y pseudociencia · 5. Mujeres científicas | Parcial A, parcial B y **Examen del tema** (este módulo + Material de laboratorio) |
| Biología y Geología | Material de laboratorio | 1. Material de vidrio · 2. Otros instrumentos · 3. El microscopio óptico · 4. Seguridad y pictogramas | Parcial A, parcial B, final |

## Dónde está cada cosa

| Archivo | Contenido |
|---|---|
| [`catalog.js`](../catalog.js) | `SUBJECTS`, `MODULES` (cada módulo con su `subject`) y `ANIMS` |
| [`data.js`](../data.js) | Utilidades (`mc`, `num`, `fmt`…) y niveles de Matemáticas |
| [`anim.js`](../anim.js) | Animaciones de Matemáticas |
| [`lengua.js`](../lengua.js) | Niveles y animaciones de Lengua |
| [`ciencia.js`](../ciencia.js) | Niveles y relatos de «La ciencia y el método científico» |
| [`biologia.js`](../biologia.js) | Niveles y animaciones de Biología, dibujos del material, microscopio y pictogramas |
| [`sketch.js`](../sketch.js) | Piezas de pizarra compartidas (texto que se escribe, trazos SVG, personas, bocadillos, flechas) |

## Añadir una materia o un módulo

1. Escribe los niveles (`{title, sub, lesson, gens}`) y las animaciones (una por nivel) en el archivo de la materia.
2. Añade la materia a `SUBJECTS` si es nueva, y el módulo a `MODULES` con su `subject`, `levels` y `exams`; y sus animaciones a `ANIMS`.
3. Añade el archivo nuevo a `ASSETS` en `sw.js` y sube la versión de `CACHE`.
4. `npm test` comprueba que cada módulo tiene materia, que todas las preguntas son válidas y que cada nivel tiene su explicación animada con preguntas y un ejemplo de la vida real.

El progreso se sigue guardando con la clave `mates1eso.v1` para no perder el de quien ya usaba la app; los módulos nuevos se añaden solos al estado (y a la sincronización) la primera vez que se abren.

## Exámenes que mezclan módulos

En `exams`, un número es un nivel del propio módulo y una cadena `'módulo:nivel'` toma un nivel de otro módulo (empezando en 0). Por ejemplo, el «Examen del tema» de Biología usa `[0,1,2,3,4,'laboratorio:0','laboratorio:1','laboratorio:2','laboratorio:3']`, como el examen real del tema 1 (fake news, método científico, ciencia y pseudociencia, material de laboratorio y mujeres científicas). Las pruebas comprueban que cada referencia apunta a un nivel que existe.

## Nota sobre la ficha del experimento de Redi

La ficha de clase dice que «en el bote sin cubrir no habían crecido gusanos, mientras que en el otro, sí». Es al revés: los gusanos aparecieron en el bote **abierto** (las moscas pudieron poner huevos) y no en el cubierto con tela. La app usa la versión correcta, que es la que lleva a la conclusión de Redi.

