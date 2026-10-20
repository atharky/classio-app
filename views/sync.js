import { $, esc } from '../data.js';
import { net, setSyncStatus, syncNow } from '../net.js';
import { S, persist, ui } from '../state.js';
import { createCode, deleteCode, normalizeCode, pushState, saveLink, syncMessage } from '../sync.js';
import { app, go, renderFoot, setCrumb, track } from '../ui.js';

export function viewSync(){track(viewSync,[]);setCrumb('Sincronizar');
  app.innerHTML=`<div class="stack">
   <div><p class="eyebrow">Tu progreso</p><h1>Sincronizar entre dispositivos</h1></div>
   ${net.link?`<section class="card stack"><h3>Este dispositivo está sincronizado</h3>
     <p class="muted">Tu código de sincronización es:</p><p class="code">${esc(net.link.code)}</p>
     <p>Apúntalo en un lugar seguro: es la única forma de recuperar tu progreso en otro dispositivo. Quien tenga el código puede ver y cambiar tu progreso, así que no lo compartas.</p>
     <p class="hint">${net.link.at?`Última sincronización: ${new Date(net.link.at).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'})}`:'Aún sin sincronizar'}</p>
     <div class="row" id="sync-actions"><button class="btn" type="button" id="sync-now">Sincronizar ahora</button><button class="btn ghost" type="button" id="unlink">Desvincular este dispositivo</button><button class="btn ghost" type="button" id="wipe">Borrar mis datos de la nube</button></div></section>`
   :`<section class="card stack"><h3>Continúa en otro dispositivo</h3>
     <p>Ahora tu progreso solo está en este navegador. Crea un código para seguir en otro ordenador, tablet o móvil. No pedimos nombre, correo ni contraseña.</p>
     <div class="row"><button class="btn" type="button" id="create">Crear código</button></div></section>
    <section class="card stack"><h3>Ya tengo un código</h3>
     <p class="muted">Escríbelo para traer aquí tu progreso. Se juntará con lo que ya tengas en este dispositivo: no se pierde nada.</p>
     <form class="row" id="link-form"><input id="code-in" class="codein" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="13" aria-label="Código de sincronización" placeholder="XXXXX-XXXXX"><button class="btn" type="submit" id="link-btn">Vincular</button></form></section>`}
   <p class="storage-warning" id="sync-msg" role="alert">${esc(net.status)}</p></div>`;
  const busy=(b,on,text)=>{b.disabled=on;b.textContent=text};
  const stay=()=>ui.view.fn===viewSync?go(viewSync):renderFoot(); // no saca al alumno de otra pantalla
  if(net.link){
    $('#sync-now').onclick=async e=>{busy(e.target,true,'Sincronizando…');await syncNow();const b=$('#sync-now');b&&busy(b,false,'Sincronizar ahora')};
    $('#unlink').onclick=()=>{$('#sync-actions').innerHTML=`<span>¿Seguro? Apunta antes tu código: sin él no podrás recuperar el progreso en otro dispositivo.</span><button class="btn" type="button" id="u-yes">Sí, desvincular</button><button class="btn ghost" type="button" id="u-no">Cancelar</button>`;
      $('#u-yes').onclick=()=>{net.link=null;saveLink(null);clearTimeout(net.timer);net.status='';go(viewSync)};$('#u-no').onclick=()=>go(viewSync)};
    $('#wipe').onclick=()=>{$('#sync-actions').innerHTML=`<span>¿Seguro? Se borra de la nube el progreso de este código y no se podrá recuperar con él. En este dispositivo se conserva.</span><button class="btn" type="button" id="w-yes">Sí, borrar de la nube</button><button class="btn ghost" type="button" id="w-no">Cancelar</button>`;
      $('#w-no').onclick=()=>go(viewSync);
      $('#w-yes').onclick=async e=>{busy(e.target,true,'Borrando…');
        try{await deleteCode(net.link.code)}catch(err){if(!err||err.kind!=='unknown_code'){busy(e.target,false,'Sí, borrar de la nube');setSyncStatus(syncMessage(err));return}}
        net.link=null;saveLink(null);clearTimeout(net.timer);net.status='Datos borrados de la nube. Este dispositivo conserva su progreso.';go(viewSync)}}}
  else{
    $('#create').onclick=async e=>{busy(e.target,true,'Creando…');
      try{const r=await createCode(S);net.link={code:r.code,at:Date.now()};saveLink(net.link);net.status='';stay()}
      catch(err){busy(e.target,false,'Crear código');setSyncStatus(syncMessage(err))}};
    $('#link-form').onsubmit=async e=>{e.preventDefault();const inp=$('#code-in'),b=$('#link-btn'),code=normalizeCode(inp.value);
      if(!code){setSyncStatus(syncMessage({kind:'invalid_code'}));inp.focus();return}
      busy(b,true,'Vinculando…');
      try{const r=await pushState(code,S);net.link={code,at:Date.now()};saveLink(net.link);S.mods=r.state.mods;S.exams=r.state.exams;S.misses=r.state.misses||{};S.days=r.state.days||[];persist();net.status='';stay()}
      catch(err){busy(b,false,'Vincular');setSyncStatus(syncMessage(err));inp.focus()}}}}

