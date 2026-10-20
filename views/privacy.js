import { app, setCrumb, track } from '../ui.js';

export function viewPrivacy(){track(viewPrivacy,[]);setCrumb('Privacidad');
  app.innerHTML=`<div class="stack">
   <div><p class="eyebrow">Tus datos</p><h1>Privacidad y uso de datos</h1></div>
   <section class="card stack"><h3>Qué guarda este cuaderno</h3>
    <p>No pedimos nombre, correo, edad, centro ni contraseña. No hay cuentas. El cuaderno no usa cookies ni publicidad ni analítica.</p>
    <p>En tu navegador se guardan tus <b>niveles superados</b>, tus <b>notas</b> de los exámenes, los <b>tipos de pregunta que has fallado</b> (para el repaso), los <b>días en que has usado el cuaderno</b> (para la racha), si tienes el sonido activado y, si lo usas, el código de sincronización. Todo queda en este dispositivo.</p></section>
   <section class="card stack"><h3>Si usas la sincronización</h3>
    <p>Al crear un código se guardan en un servidor de Microsoft Azure solo tus niveles, notas, tipos de pregunta pendientes de repasar y días de actividad, asociados a un identificador que sale del código. El servidor no guarda el código, sino una huella irreversible de él. Como en cualquier servicio web, el proveedor puede registrar datos técnicos de la conexión.</p>
    <p>Quien tenga tu código puede ver y cambiar tu progreso. No lo compartas con nadie que no quieras.</p></section>
   <section class="card stack"><h3>Cómo borrar tus datos</h3>
    <ul><li><b>De este dispositivo:</b> «Borrar progreso» en el pie de página.</li>
    <li><b>De la nube:</b> en «Sincronizar entre dispositivos» pulsa «Borrar mis datos de la nube». El código deja de funcionar.</li></ul></section>
   <section class="card stack"><h3>Narración con voz</h3>
    <p>La voz que lee las explicaciones es la de tu propio dispositivo; el cuaderno no envía textos ni audio a ningún servicio.</p></section>
   <p class="hint">Si eres menor de edad, comenta con tu familia o tu profesorado qué dispositivo usas para sincronizar.</p></div>`}

