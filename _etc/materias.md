# Materias y módulos

La app (ahora **Cuaderno 1º ESO**) organiza el contenido en **materias → módulos → niveles**. El inicio muestra los módulos agrupados por materia.

| Materia | Módulo | Niveles | Exámenes |
|---|---|---|---|
| Matemáticas | Potencias | 6 | Parcial A, parcial B, final |
| Matemáticas | Raíces cuadradas (oculto, en preparación) | 3 de 5 | — |
| Lengua Castellana y Literatura | La comunicación | 1. Elementos (emisor, receptor, mensaje, código, canal, contexto) · 2. Verbal y no verbal; indicio, icono y símbolo · 3. Funciones del lenguaje | Examen del tema |
| Lengua Castellana y Literatura | El resumen | 1. Idea principal, secundarias y palabras clave · 2. Cómo se hace un resumen | Examen del tema |
| Biología y Geología | Material de laboratorio | 1. Material de vidrio · 2. Otros instrumentos · 3. El microscopio óptico · 4. Seguridad y pictogramas | Parcial A, parcial B, final |

## Dónde está cada cosa

| Archivo | Contenido |
|---|---|
| [`catalog.js`](../catalog.js) | `SUBJECTS`, `MODULES` (cada módulo con su `subject`) y `ANIMS` |
| [`data.js`](../data.js) | Utilidades (`mc`, `num`, `fmt`…) y niveles de Matemáticas |
| [`anim.js`](../anim.js) | Animaciones de Matemáticas |
| [`lengua.js`](../lengua.js) | Niveles y animaciones de Lengua |
| [`biologia.js`](../biologia.js) | Niveles y animaciones de Biología, dibujos del material, microscopio y pictogramas |
| [`sketch.js`](../sketch.js) | Piezas de pizarra compartidas (texto que se escribe, trazos SVG, personas, bocadillos, flechas) |

## Añadir una materia o un módulo

1. Escribe los niveles (`{title, sub, lesson, gens}`) y las animaciones (una por nivel) en el archivo de la materia.
2. Añade la materia a `SUBJECTS` si es nueva, y el módulo a `MODULES` con su `subject`, `levels` y `exams`; y sus animaciones a `ANIMS`.
3. Añade el archivo nuevo a `ASSETS` en `sw.js` y sube la versión de `CACHE`.
4. `npm test` comprueba que cada módulo tiene materia, que todas las preguntas son válidas y que cada nivel tiene su explicación animada con preguntas y un ejemplo de la vida real.

El progreso se sigue guardando con la clave `mates1eso.v1` para no perder el de quien ya usaba la app; los módulos nuevos se añaden solos al estado (y a la sincronización) la primera vez que se abren.
