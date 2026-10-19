# Sincronización entre dispositivos

Permite continuar el progreso en otro ordenador, tablet o móvil **sin cuentas ni datos personales**: cada alumno crea un código de sincronización (p. ej. `VENP5-FTFRB`) y lo escribe en el otro dispositivo.

## Cómo funciona

1. **Crear código** (`Sincronizar entre dispositivos` en el pie de página). El servidor genera un código de 10 caracteres y guarda el progreso actual.
2. **Vincular** otro dispositivo escribiendo el código (da igual mayúsculas, espacios o guion). El progreso de los dos dispositivos se **junta**, no se reemplaza:
   - por nivel, la mejor puntuación;
   - por módulo, el desbloqueo más alto;
   - por examen, todas las notas (se guardan las 10 últimas);
   - por tipo de pregunta fallada (`misses`, usado por «Repasar lo que fallé»), gana el último fallo y, si es el mismo, los aciertos más altos: así una curación hecha en un dispositivo no se deshace al sincronizar.
3. A partir de ahí, cada vez que se guarda progreso se sincroniza en segundo plano (2 s después) y también al abrir la app. Si no hay conexión, el progreso sigue en el navegador y se avisa en el pie de página.
4. **Desvincular** deja el progreso en el dispositivo y deja de sincronizarlo. **Borrar progreso** también desvincula el dispositivo; si no, la nube lo volvería a traer.
5. **Borrar mis datos de la nube** (en la misma vista, con confirmación) elimina la fila del código en Table Storage y desvincula el dispositivo, que conserva su progreso local. Después el código responde `unknown_code`.

El **modo profesor** (abrir todos los niveles) no se sincroniza: es de cada dispositivo.

## Privacidad y seguridad

- No se pide ni se guarda nombre, correo, contraseña ni ningún dato personal; solo niveles superados, notas y los tipos de pregunta pendientes de repasar.
- El código es la única credencial: quien lo tenga puede ver y cambiar ese progreso. La app lo explica al alumno.
- La tabla guarda el **hash SHA-256** del código, no el código: un acceso a la tabla no permite usar los códigos.
- El código viaja en el cuerpo de la petición (POST), no en la URL, para que no aparezca en registros de acceso.
- 30 símbolos × 10 posiciones ≈ 2⁴⁹ combinaciones (sin 0/O, 1/I/L ni U para evitar confusiones al copiar).
- El servidor valida y limita lo que guarda (`sanitizeState`): solo módulos e identificadores con formato válido, puntuaciones en rango y cuerpo de 32 KB como máximo.
- **Pendiente:** no hay limitación de peticiones por IP. Con 2⁴⁹ combinaciones adivinar un código no es práctico, pero si la app crece conviene añadirla (Azure Front Door/WAF o un contador en la tabla).

## Arquitectura

| Pieza | Archivo |
|---|---|
| Cliente: llamadas a la API y código guardado en `localStorage` (`mates1eso.sync`) | [`sync.js`](../sync.js) |
| Vista *Sincronizar* y sincronización en segundo plano | [`views/sync.js`](../views/sync.js), [`net.js`](../net.js) |
| Lógica del servidor sin dependencias de Azure (validar, juntar, reintentar) | [`api/src/sync.js`](../api/src/sync.js) |
| Almacén Azure Table Storage con concurrencia optimista por ETag | [`api/src/table-store.js`](../api/src/table-store.js) |
| Funciones HTTP de Azure Functions (modelo v4: `sync/new`, `sync`, `sync/delete`) | [`api/src/functions/sync.js`](../api/src/functions/sync.js) |

API (mismo dominio, así que la CSP `connect-src 'self'` no cambia):

| Método y ruta | Cuerpo | Respuesta |
|---|---|---|
| `POST /api/sync/new` | `{state}` | `201 {code, state}` |
| `POST /api/sync` | `{code, state}` | `200 {code, state}` con el progreso ya juntado |
| `POST /api/sync/delete` | `{code}` | `200 {deleted:true}` o `404 unknown_code` |

Errores: `400 invalid_body` · `400 invalid_code` · `404 unknown_code` · `409 conflict` · `500/503 server`.

Si dos dispositivos escriben a la vez, el servidor detecta el conflicto por ETag, vuelve a leer, junta y reintenta (hasta 5 veces). Si al cliente le llega la respuesta después de que haya habido progreso nuevo, no la aplica y vuelve a enviar.

## Puesta en marcha en Azure

1. Crear una **cuenta de almacenamiento** (Storage account, StorageV2, LRS es suficiente) en la misma región que la Static Web App.
2. En la Static Web App → *Configuración* → *Variables de entorno*, añadir `SYNC_STORAGE_CONNECTION` con la cadena de conexión de la cuenta de almacenamiento. La tabla `progreso` se crea sola en la primera petición.
3. Desplegar: cada push a `main` lo despliega el flujo de GitHub Actions (`.github/workflows/azure-static-web-apps-*.yml`), que ejecuta antes `npm test`; cada PR contra `main` crea un entorno de vista previa. La web se publica tal cual (`skip_app_build`) y la API se compila con sus dependencias. El plan Free de Static Web Apps admite estas funciones administradas con `platform.apiRuntime: node:22`, la versión más nueva que admiten (Node 24 aún no está disponible para funciones administradas).

Sin la variable de entorno la app sigue funcionando en local; la API responde `500` y la vista de sincronización muestra que el servidor no está disponible.

## Desarrollo y pruebas

- `npm test` en la raíz ejecuta también las pruebas de `api/test/` (lógica de servidor con almacén en memoria).
- Para probar con almacenamiento real en local: `npx azurite-table --inMemoryPersistence` y `SYNC_STORAGE_CONNECTION="UseDevelopmentStorage=true"` (el almacén permite HTTP solo con el emulador).
- Validado en esta iteración: el almacén contra Azurite (creación, duplicados, ETag obsoleto, dos escrituras simultáneas) y el flujo completo en Chromium con dos dispositivos (crear, vincular con errores, juntar, sincronización en segundo plano, recarga, modo profesor, desvincular, borrar, sin conexión).
- No validado: el despliegue real en Azure.
