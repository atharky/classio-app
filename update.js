import { $ } from './data.js';

/* Aviso de versión nueva: el service worker nuevo espera hasta que el alumno pulse «Recargar». */
function offerUpdate(worker){
  if($('#update'))return;
  const bar=document.createElement('div');bar.id='update';bar.className='update';bar.setAttribute('role','status');
  bar.innerHTML='<span>Hay una versión nueva del cuaderno.</span> <button class="btn" type="button" id="update-btn">Recargar</button>';
  document.body.append(bar);
  $('#update-btn').onclick=()=>{navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});worker.postMessage('skip')}}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').then(reg=>{
  const watch=w=>w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)offerUpdate(w)});
  if(reg.waiting&&navigator.serviceWorker.controller)offerUpdate(reg.waiting);
  reg.addEventListener('updatefound',()=>watch(reg.installing))}).catch(()=>{});
