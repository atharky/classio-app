# Análisis de la aplicación HTML

**Archivo revisado:** [`index.html`](../index.html)  
**Tipo:** aplicación educativa web autocontenida  
**Idioma:** español  
**Ámbito:** Matemáticas de 1.º de ESO  
**Revisión:** análisis estático del código y comprobación de sintaxis JavaScript.

## 1. Resumen ejecutivo

La aplicación implementa un cuaderno interactivo de matemáticas en un único archivo HTML de aproximadamente 465 líneas. Incluye estilos, contenido didáctico y lógica JavaScript embebida, sin backend ni dependencias de ejecución obligatorias.

El producto es funcional para un prototipo educativo: presenta lecciones sobre potencias, genera ejercicios aleatorios, corrige respuestas, desbloquea niveles y registra notas de exámenes. Su mayor fortaleza es la sencillez de distribución y una interfaz cuidada. Sus principales limitaciones son la ausencia de pruebas automatizadas, la persistencia exclusivamente local, la dificultad de mantenimiento de un archivo monolítico y algunos detalles de accesibilidad, robustez y precisión didáctica.

**Valoración general:** buena base de prototipo/MVP; requiere separación de responsabilidades y pruebas antes de considerarse una aplicación educativa mantenible o de uso institucional.

## 2. Arquitectura y organización

- `index.html` contiene toda la aplicación: estructura, CSS, datos de contenidos y JavaScript.
- La navegación se monta dinámicamente dentro de `main#app` y se apoya en vistas (`viewHome`, `viewModule`, `viewLevel`, `viewExam`).
- El contenido educativo está modelado como datos en `POT_LEVELS`, con lecciones y generadores de preguntas.
- `MODULES` permite declarar módulos futuros (`raices`, `divis`, `enteros`) mediante la propiedad `soon`.
- El estado global `S` contiene progreso, exámenes y el modo profesor. Se guarda bajo la clave `mates1eso.v1` de `localStorage`.
- No existe compilación, framework, bundler, módulos ES, backend ni API.

**Ventajas:** instalación inmediata, baja complejidad operativa y funcionamiento potencialmente offline salvo las fuentes externas.  
**Costes:** archivo difícil de revisar, probar y extender; cualquier cambio mezcla presentación, datos y lógica.

## 3. Funcionalidad observada

1. Pantalla inicial con módulos y porcentaje de niveles completados.
2. Módulo activo de **Potencias**, con seis niveles.
3. Lecciones con explicaciones, ejemplos, tablas y errores típicos.
4. Pruebas de cinco preguntas por nivel; se supera con cuatro aciertos.
5. Preguntas de opción múltiple y respuestas numéricas.
6. Generación aleatoria de ejercicios mediante `Math.random()`.
7. Desbloqueo progresivo de niveles.
8. Exámenes parcial A, parcial B y final, con 10 o 12 preguntas.
9. Corrección final, nota, tiempo, desglose por nivel y recomendaciones.
10. Reinicio de progreso y modo profesor para abrir todos los niveles.
11. Tema claro/oscuro según `prefers-color-scheme` y adaptación básica a pantallas pequeñas.

## 4. Puntos fuertes

- **Modelo pedagógico claro:** aprendizaje → prueba → desbloqueo.
- **Retroalimentación inmediata:** cada ejercicio puede mostrar explicación y respuesta correcta.
- **Variedad:** combina selección múltiple, entrada numérica y exámenes acumulativos.
- **Contenido coherente:** las reglas de potencias se acompañan de ejemplos y errores frecuentes.
- **Responsive básico:** el diseño incluye viewport, rejilla flexible y una regla específica para anchos de hasta 480 px.
- **Accesibilidad inicial:** `lang="es"`, título, etiquetas ARIA, `aria-live`, roles de pestañas, estados `aria-selected`/`aria-pressed`, botones reales y estilos de foco visibles.
- **Privacidad operativa:** no se observa envío de respuestas a un servidor; el progreso permanece en el navegador.

## 5. Riesgos y problemas detectados

### Prioridad alta

- **Sin pruebas automatizadas ni pruebas de navegador.** La sintaxis JavaScript pasa `node --check`, pero no se validan los flujos de interacción, teclado, persistencia, exámenes ni casos límite.
- **Persistencia silenciosamente fallida.** `save()` ignora cualquier error de `localStorage`. En modo privado, con almacenamiento bloqueado o con cuota agotada, la interfaz puede indicar que el progreso se guarda cuando en realidad se perderá.
- **Archivo monolítico.** Mezclar unas 200 líneas de contenidos con estilos y lógica complica la evolución y aumenta el riesgo de regresiones.

### Prioridad media

- **Accesibilidad de navegación dinámica incompleta.** `aria-live` anuncia cambios, pero no se mueve explícitamente el foco al título o a la nueva vista. Un usuario de lector de pantalla puede perder el contexto tras cambiar de pantalla.
- **Pestañas incompletas semánticamente.** Se usan `role="tablist"` y `role="tab"`, pero no se observan `aria-controls`, `id` de panel ni gestión de teclado con flechas/Home/End.
- **Modo profesor sin protección.** El enlace “abrir todos los niveles” no solicita confirmación ni distingue entre entorno de demostración y uso real.
- **Dependencia de Google Fonts.** Las fuentes externas mejoran el diseño, pero añaden una solicitud de terceros y una variación visual/offline. Hay fuentes de reserva, por lo que no bloquea la funcionalidad.
- **Riesgo de mantenimiento del HTML dinámico.** Se construyen muchas vistas mediante `innerHTML`; hoy los datos parecen controlados por el propio código, pero cualquier contenido futuro procedente de usuarios o fuentes externas podría introducir XSS si no se escapa.
- **Seguimiento de vista durante un examen.** `viewExam` registra como vista actual `viewModule`; por ello, las acciones del pie de página que dependen de `currentView` pueden devolver al módulo en lugar de restaurar exactamente el examen.

### Prioridad baja

- `meta name="claude:viewport-fit-sides"` no es un metadato web estándar y no aporta comportamiento conocido en navegadores.
- El cálculo de progreso depende de claves numéricas convertidas a texto, válido actualmente pero poco explícito.
- `makeSet` intenta evitar preguntas repetidas por texto, pero permite repeticiones después de 15 intentos; es razonable, aunque conviene documentarlo o cubrirlo con pruebas.
- No se observa un mecanismo de exportación/importación del progreso, por lo que cambiar de dispositivo implica perder las notas.

## 6. Revisión didáctica

El nivel y el enfoque son adecuados para una introducción a potencias. Es positivo incluir base, exponente, cuadrados, cubos, exponentes 0/1, bases 1/10, números negativos y propiedades operativas.

Hay una formulación que debería revisarse: en la explicación del exponente 0 se indica que “cada vez que bajamos el exponente, dividimos entre 2”, aunque el ejemplo usa base 2. La regla general debe expresar que se divide entre la base (cuando la base no es cero), no siempre entre 2.

También sería recomendable añadir validaciones didácticas para:

- bases negativas con paréntesis y prioridad de operaciones;
- diferencia entre `−a²` y `(-a)²`;
- cocientes con exponentes que produzcan exponentes negativos, si entran en el nivel curricular;
- respuestas con separadores decimales y casos de entrada vacía o signos aislados.

## 7. Rendimiento y seguridad

- Para el tamaño actual, el rendimiento debería ser suficiente en dispositivos modernos.
- La generación de ejercicios es ligera y no usa operaciones de red.
- El uso de `innerHTML` merece una política clara de contenido confiable y, si se publica, una Content Security Policy compatible con los scripts embebidos.
- No se detectan credenciales, llamadas de autenticación ni datos sensibles.
- `localStorage` no debe considerarse un almacenamiento seguro: cualquier usuario del navegador puede modificar las notas y el estado `open` desde las herramientas de desarrollo.

## 8. Recomendaciones priorizadas

### Próximo paso

1. Añadir pruebas de navegador para: desbloqueo, corrección de preguntas, reinicio, exámenes, temporizador y persistencia.
2. Mostrar un aviso si `localStorage` no está disponible o falla.
3. Corregir la regla didáctica del exponente 0.
4. Mejorar el foco tras cada navegación y completar la semántica/teclado de pestañas.

### Evolución del proyecto

5. Separar en `index.html`, `styles.css`, `data.js` y `app.js`, manteniendo primero JavaScript vanilla para limitar el coste de migración.
6. Introducir un esquema versionado de estado y funciones de validación/migración.
7. Añadir exportación/importación JSON del progreso.
8. Centralizar la creación de nodos o sanitización si se incorpora contenido editable o remoto.
9. Añadir una estrategia de publicación offline, por ejemplo fuentes locales y un service worker si el objetivo lo requiere.
10. Incorporar instrumentación opcional y respetuosa con la privacidad solo si se necesita conocer el uso real.

## 9. Estado de la evolución 1–10

Los puntos 1–10 se han aplicado parcialmente en esta iteración:

- La aplicación está separada en [`index.html`](../index.html), [`styles.css`](../styles.css), [`data.js`](../data.js) y [`app.js`](../app.js).
- El estado usa versión lógica `v:2`, migración desde v1 y validación básica.
- Se incorporaron exportación/importación JSON y avisos visibles cuando falla el almacenamiento.
- Se añadió CSP y cabeceras de seguridad en [`staticwebapp.config.json`](../staticwebapp.config.json).
- Se añadió PWA con manifest, service worker e icono SVG.
- Se añadieron pruebas unitarias para generadores y utilidades.
- La instrumentación sigue limitada al uso local de la aplicación; no se envían datos educativos a terceros.

Queda como mejora posterior completar pruebas E2E en navegador y revisar exhaustivamente la semántica de pestañas y teclado.

## 10. Validación realizada

- `node --check app.js` y `node --check data.js`: **sin errores de sintaxis**.
- `npm test`: **3 pruebas correctas**.
- Servidor local: `GET /index.html` respondió **HTTP 200**.
- Producción: la raíz y los recursos principales (`styles.css`, `app.js`, manifest y service worker) respondieron **HTTP 200**.
- Producción: se verificaron CSP, HSTS, `X-Content-Type-Options` y `Referrer-Policy`.
- Queda pendiente una validación visual y E2E completa en navegador real.
