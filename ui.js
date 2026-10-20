import { $ } from './data.js';
import { nextTheme, themeLabel } from './theme.js';
import { net } from './net.js';
import { stopAnim } from './player.js';
import { S, emptyState, migrateState, replaceState, save, ui } from './state.js';
import { saveLink } from './sync.js';
import { viewHome } from './views/home.js';
import { viewModule } from './views/module.js';
import { viewPrivacy } from './views/privacy.js';
import { viewProgress } from './views/progress.js';
import { viewSync } from './views/sync.js';

// Repinta solo vistas sin ejercicios en curso, sin mover el foco ni el scroll.
export function refresh(){if([viewHome,viewModule,viewSync,viewProgress].includes(ui.view.fn))ui.view.fn(...ui.view.args);renderFoot()}

/* ---------- vistas ---------- */
export const app=$('#app');
export function setCrumb(t){$('#crumb').textContent=t||''}
export function go(view,...args){clearInterval(ui.timerId);stopAnim();window.scrollTo({top:0});view(...args);renderFoot();requestAnimationFrame(()=>{const h=app.querySelector('h1');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}else app.focus()})}
$('#home-btn').onclick=()=>go(viewHome);

export function renderFoot(){$('#foot-actions').innerHTML=`<button class="link" id="export" type="button">Exportar progreso</button> · <button class="link" id="import" type="button">Importar progreso</button> · <button class="link" id="open-all" type="button">${S.open?'Volver a bloquear niveles':'Modo profesor: abrir todos los niveles'}</button> · <button class="link" id="reset" type="button">Borrar progreso</button> · <button class="link" id="sync" type="button">${net.link?'Sincronización activada':'Sincronizar entre dispositivos'}</button> · <button class="link" id="progress" type="button">Mi progreso</button> · <button class="link" id="privacy" type="button">Privacidad</button> · <button class="link" id="theme" type="button">Tema: ${themeLabel()}</button>${ui.warning?`<span class="storage-warning" role="alert"> ${ui.warning}</span>`:''}${net.status&&ui.view.fn!==viewSync?`<span class="storage-warning" role="alert"> ${net.status}</span>`:''}`;
  $('#sync').onclick=()=>go(viewSync);
  $('#progress').onclick=()=>go(viewProgress);
  $('#privacy').onclick=()=>go(viewPrivacy);
  $('#theme').onclick=()=>{nextTheme();renderFoot()};
  $('#export').onclick=exportProgress;
  $('#import').onclick=()=>$('#import-file').click();
  $('#open-all').onclick=()=>{S.open=!S.open;save();go(ui.view.fn,...ui.view.args)};
  $('#reset').onclick=()=>{const fa=$('#foot-actions');fa.innerHTML=`¿Seguro? Se borrarán niveles y notas${net.link?' de este dispositivo y dejará de sincronizarse (tu código conserva el progreso en la nube)':''}. <button class="link" id="r-yes" type="button">Sí, borrar</button> · <button class="link" id="r-no" type="button">Cancelar</button>`;
    $('#r-yes').onclick=()=>{net.link=null;saveLink(null);clearTimeout(net.timer);net.status='';replaceState(emptyState());save();go(viewHome)};$('#r-no').onclick=renderFoot}}
export const track=(fn,args)=>ui.view={fn,args};



export function exportProgress(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;a.download='cuaderno-1eso-progreso.json';a.click();URL.revokeObjectURL(url);
}

$('#import-file').onchange=async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try{const imported=migrateState(JSON.parse(await file.text()));replaceState(imported);save();go(ui.view.fn||viewHome,...(ui.view.args||[]));}
  catch{ui.warning='El archivo de progreso no es válido.';renderFoot();}
};

