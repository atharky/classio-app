import { $, fmt, parseNum, pick, shuffle } from './data.js';
import { SUBJECTS, MODULES, ANIMS } from './catalog.js';
import { at, sk, stroke, dot, tx } from './sketch.js';
import { loadLink, saveLink, normalizeCode, createCode, pushState, syncMessage } from './sync.js';

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');

/* ---------- progreso ---------- */
const KEY='mates1eso.v1';
const STATE_VERSION=2;
const emptyState=()=>({v:STATE_VERSION,mods:{},exams:{},open:false});
function migrateState(raw){
  if(!raw||typeof raw!=='object')return emptyState();
  if(raw.v===1)return {v:STATE_VERSION,mods:raw.mods&&typeof raw.mods==='object'?raw.mods:{},exams:raw.exams&&typeof raw.exams==='object'?raw.exams:{},open:Boolean(raw.open)};
  if(raw.v===STATE_VERSION)return {...emptyState(),...raw};
  return emptyState();
}
let storageWarning='';
let S=(()=>{try{return migrateState(JSON.parse(localStorage.getItem(KEY)))}catch(e){storageWarning='No se pudo leer el progreso guardado.';return emptyState()}})();
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));storageWarning='';return true}catch(e){storageWarning='No se pudo guardar el progreso en este navegador.';return false}};
const save=()=>{const ok=persist();scheduleSync();return ok};
const mp=id=>S.mods[id]||(S.mods[id]={unlocked:1,best:{}});
const isOpen=(mod,i)=>S.open||i<mp(mod.id).unlocked;
const QUIZ_N=5,PASS=4;

/* ---------- sincronización ---------- */
let link=loadLink(),syncStatus='',syncTimer=null,syncing=false;
const progressJSON=st=>JSON.stringify({mods:st.mods,exams:st.exams});
function setSyncStatus(t){syncStatus=t;const m=$('#sync-msg');m?m.textContent=t:renderFoot()}
function scheduleSync(){if(!link)return;clearTimeout(syncTimer);syncTimer=setTimeout(syncNow,2000)}
async function syncNow(){if(!link)return;if(syncing){scheduleSync();return}
  clearTimeout(syncTimer);syncing=true;const code=link.code,sent=progressJSON(S);
  try{const r=await pushState(code,S);
    if(!link||link.code!==code)return;
    link.at=Date.now();saveLink(link);syncStatus='';
    // Si hubo progreso nuevo mientras viajaba la petición, no se pisa: se envía en la siguiente.
    if(progressJSON(S)!==sent){scheduleSync();renderFoot();return}
    const changed=progressJSON(r.state)!==sent;
    if(changed){S.mods=r.state.mods;S.exams=r.state.exams;persist()}
    if(changed||currentView.fn===viewSync)refresh();else renderFoot()}
  catch(e){setSyncStatus(syncMessage(e))}
  finally{syncing=false}}
// Repinta solo vistas sin ejercicios en curso, sin mover el foco ni el scroll.
function refresh(){if([viewHome,viewModule,viewSync].includes(currentView.fn))currentView.fn(...currentView.args);renderFoot()}

function makeSet(gens,n,tag){const out=[],seen=new Set();let order=shuffle(gens.map((g,i)=>i));let k=0;
  while(out.length<n){const gi=order[k%order.length];k++;if(k%order.length===0)order=shuffle(order);
    let q,tries=0;do{q=gens[gi]();tries++}while(seen.has(q.prompt)&&tries<15);seen.add(q.prompt);if(tag!==undefined)q.level=tag;out.push(q)}
  return out}

/* ---------- vistas ---------- */
const app=$('#app');
let timerId=null;
function setCrumb(t){$('#crumb').textContent=t||''}
function go(view,...args){clearInterval(timerId);stopAnim();window.scrollTo({top:0});view(...args);renderFoot();requestAnimationFrame(()=>app.focus())}
$('#home-btn').onclick=()=>go(viewHome);

function renderFoot(){$('#foot-actions').innerHTML=`<button class="link" id="export" type="button">Exportar progreso</button> · <button class="link" id="import" type="button">Importar progreso</button> · <button class="link" id="open-all" type="button">${S.open?'Volver a bloquear niveles':'Modo profesor: abrir todos los niveles'}</button> · <button class="link" id="reset" type="button">Borrar progreso</button> · <button class="link" id="sync" type="button">${link?'Sincronización activada':'Sincronizar entre dispositivos'}</button>${storageWarning?`<span class="storage-warning" role="alert"> ${storageWarning}</span>`:''}${syncStatus&&currentView.fn!==viewSync?`<span class="storage-warning" role="alert"> ${syncStatus}</span>`:''}`;
  $('#sync').onclick=()=>go(viewSync);
  $('#export').onclick=exportProgress;
  $('#import').onclick=()=>$('#import-file').click();
  $('#open-all').onclick=()=>{S.open=!S.open;save();go(currentView.fn,...currentView.args)};
  $('#reset').onclick=()=>{const fa=$('#foot-actions');fa.innerHTML=`¿Seguro? Se borrarán niveles y notas${link?' de este dispositivo y dejará de sincronizarse (tu código conserva el progreso en la nube)':''}. <button class="link" id="r-yes" type="button">Sí, borrar</button> · <button class="link" id="r-no" type="button">Cancelar</button>`;
    $('#r-yes').onclick=()=>{link=null;saveLink(null);clearTimeout(syncTimer);syncStatus='';S=emptyState();save();go(viewHome)};$('#r-no').onclick=renderFoot}}
let currentView={fn:null,args:[]};
const track=(fn,args)=>currentView={fn,args};

function viewHome(){track(viewHome,[]);setCrumb('');
  app.innerHTML=`<div class="stack">
   <section class="hero"><p class="eyebrow">Aprendizaje guiado · 1º de ESO</p>
    <div class="big" aria-hidden="true">2<sup>5</sup> · Aa · 🔬</div>
    <p class="muted" style="max-width:56ch">Elige una materia y un módulo. Cada módulo tiene niveles que se desbloquean al aprobar una prueba corta, y exámenes de prueba para repasar todo.</p></section>
   ${SUBJECTS.map(sub=>`<section class="subject stack" aria-labelledby="sub-${sub.id}"><h2 id="sub-${sub.id}">${sub.name}</h2>
   <div class="mods">${MODULES.filter(m=>m.subject===sub.id).map(m=>{const p=m.soon?null:mp(m.id);const done=p?Math.min(Object.keys(p.best).filter(k=>p.best[k]>=PASS).length,m.levels.length):0;
     return `<button class="mod ${m.soon?'':'on'}" type="button" data-id="${m.id}" ${m.soon?'disabled':''}>
      <span class="sym">${m.sym}</span><h3>${m.name}</h3><span class="muted" style="font-size:.92rem">${m.desc}</span>
      ${m.soon?'<span><span class="chip grey">Próximamente</span></span>':`<span class="row" style="justify-content:space-between"><span class="chip ${done===m.levels.length?'ok':''}">${done} de ${m.levels.length} niveles</span></span><div class="bar"><i style="width:${done/m.levels.length*100}%"></i></div>`}
     </button>`}).join('')}</div></section>`).join('')}</div>`;
  app.querySelectorAll('.mod:not([disabled])').forEach(b=>b.onclick=()=>go(viewModule,MODULES.find(m=>m.id===b.dataset.id)))}

function viewModule(mod){track(viewModule,[mod]);setCrumb(mod.name);const p=mp(mod.id);
  app.innerHTML=`<div class="stack">
   <div><p class="eyebrow">${SUBJECTS.find(s=>s.id===mod.subject).name}</p><h1>${mod.name}</h1></div>
   <h2 style="margin-top:6px">Niveles</h2>
   <div class="path">${mod.levels.map((lv,i)=>{const best=p.best[i];const done=best>=PASS;const open=isOpen(mod,i);const cur=open&&!done;
     return `<button type="button" class="lvl ${done?'done':''} ${cur?'cur':''}" data-i="${i}" ${open?'':'disabled'} aria-label="Nivel ${i+1}: ${lv.title}${open?'':' (bloqueado)'}">
      <span class="n">${done?'✓':i+1}</span><span class="t"><b>${lv.title}</b><small>${lv.sub}</small></span>
      <span class="stars">${open?(best!==undefined?`Mejor: ${best}/${QUIZ_N}`:'Nuevo'):'🔒 Aprueba el anterior'}</span></button>`}).join('')}</div>
   <h2 style="margin-top:14px">Exámenes de prueba</h2>
   <p class="muted">Preguntas al azar, sin pistas hasta el final. Puedes repetirlos todas las veces que quieras: cada vez salen preguntas distintas.</p>
   <div class="exams">${mod.exams.map(ex=>{const h=(S.exams[mod.id+':'+ex.id]||[]);const last=h[h.length-1];
     return `<div class="card stack" style="gap:8px"><h3>${ex.name}</h3><span class="muted">${ex.sub} · ${ex.n} preguntas</span>
      <span class="hint">${last?`Última nota: <b>${last.g.toFixed(1).replace('.',',')}</b>${h.length>1?` · Mejor: <b>${Math.max(...h.map(x=>x.g)).toFixed(1).replace('.',',')}</b>`:''}`:'Aún sin hacer'}</span>
      <button class="btn ${last?'ghost':''}" type="button" data-ex="${ex.id}">${last?'Repetir':'Empezar'}</button></div>`}).join('')}</div>
  </div>`;
  app.querySelectorAll('.lvl:not([disabled])').forEach(b=>b.onclick=()=>go(viewLevel,mod,+b.dataset.i,'learn'));
  app.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>go(viewExam,mod,mod.exams.find(e=>e.id===b.dataset.ex)))}

function viewLevel(mod,i,tab){track(viewLevel,[mod,i,tab]);const lv=mod.levels[i];setCrumb(`${mod.name} · Nivel ${i+1}`);
  app.innerHTML=`<div class="stack">
   <div><button class="link" type="button" id="back">← Todos los niveles</button><p class="eyebrow" style="margin-top:10px">Nivel ${i+1} de ${mod.levels.length}</p><h1>${lv.title}</h1></div>
   <div class="tabs" role="tablist"><button class="tab" role="tab" type="button" id="t-learn" aria-selected="${tab==='learn'}">1 · Aprende</button><button class="tab" role="tab" type="button" id="t-quiz" aria-selected="${tab==='quiz'}">2 · Prueba del nivel</button></div>
   <div id="pane"></div></div>`;
  $('#back').onclick=()=>go(viewModule,mod);
  $('#t-learn').onclick=()=>go(viewLevel,mod,i,'learn');
  $('#t-quiz').onclick=()=>go(viewLevel,mod,i,'quiz');
  const pane=$('#pane');
  if(tab==='learn'){
    pane.innerHTML=`<div class="stack lesson"><div id="anim"></div>${ANIMS[mod.id]?.[i]?'<h2>Resumen escrito</h2>':''}${lv.lesson.map(([t,h])=>`<section class="card"><h3>${t}</h3>${h}</section>`).join('')}
     <div class="card row" style="justify-content:space-between"><span>¿Lo tienes? Responde ${QUIZ_N} preguntas. Con ${PASS} bien ${i+1<mod.levels.length?'desbloqueas el siguiente nivel':'completas el módulo'}.</span><button class="btn" type="button" id="go-quiz">Hacer la prueba</button></div></div>`;
    $('#go-quiz').onclick=()=>go(viewLevel,mod,i,'quiz');
    const steps=ANIMS[mod.id]?.[i];if(steps)animPlayer($('#anim'),steps)}
  else levelQuiz(pane,mod,i)}

function viewSync(){track(viewSync,[]);setCrumb('Sincronizar');
  app.innerHTML=`<div class="stack">
   <div><p class="eyebrow">Tu progreso</p><h1>Sincronizar entre dispositivos</h1></div>
   ${link?`<section class="card stack"><h3>Este dispositivo está sincronizado</h3>
     <p class="muted">Tu código de sincronización es:</p><p class="code">${link.code}</p>
     <p>Apúntalo en un lugar seguro: es la única forma de recuperar tu progreso en otro dispositivo. Quien tenga el código puede ver y cambiar tu progreso, así que no lo compartas.</p>
     <p class="hint">${link.at?`Última sincronización: ${new Date(link.at).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'})}`:'Aún sin sincronizar'}</p>
     <div class="row" id="sync-actions"><button class="btn" type="button" id="sync-now">Sincronizar ahora</button><button class="btn ghost" type="button" id="unlink">Desvincular este dispositivo</button></div></section>`
   :`<section class="card stack"><h3>Continúa en otro dispositivo</h3>
     <p>Ahora tu progreso solo está en este navegador. Crea un código para seguir en otro ordenador, tablet o móvil. No pedimos nombre, correo ni contraseña.</p>
     <div class="row"><button class="btn" type="button" id="create">Crear código</button></div></section>
    <section class="card stack"><h3>Ya tengo un código</h3>
     <p class="muted">Escríbelo para traer aquí tu progreso. Se juntará con lo que ya tengas en este dispositivo: no se pierde nada.</p>
     <form class="row" id="link-form"><input id="code-in" class="codein" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="13" aria-label="Código de sincronización" placeholder="XXXXX-XXXXX"><button class="btn" type="submit" id="link-btn">Vincular</button></form></section>`}
   <p class="storage-warning" id="sync-msg" role="alert">${syncStatus}</p></div>`;
  const busy=(b,on,text)=>{b.disabled=on;b.textContent=text};
  const stay=()=>currentView.fn===viewSync?go(viewSync):renderFoot(); // no saca al alumno de otra pantalla
  if(link){
    $('#sync-now').onclick=async e=>{busy(e.target,true,'Sincronizando…');await syncNow();const b=$('#sync-now');b&&busy(b,false,'Sincronizar ahora')};
    $('#unlink').onclick=()=>{$('#sync-actions').innerHTML=`<span>¿Seguro? Apunta antes tu código: sin él no podrás recuperar el progreso en otro dispositivo.</span><button class="btn" type="button" id="u-yes">Sí, desvincular</button><button class="btn ghost" type="button" id="u-no">Cancelar</button>`;
      $('#u-yes').onclick=()=>{link=null;saveLink(null);clearTimeout(syncTimer);syncStatus='';go(viewSync)};$('#u-no').onclick=()=>go(viewSync)}}
  else{
    $('#create').onclick=async e=>{busy(e.target,true,'Creando…');
      try{const r=await createCode(S);link={code:r.code,at:Date.now()};saveLink(link);syncStatus='';stay()}
      catch(err){busy(e.target,false,'Crear código');setSyncStatus(syncMessage(err))}};
    $('#link-form').onsubmit=async e=>{e.preventDefault();const inp=$('#code-in'),b=$('#link-btn'),code=normalizeCode(inp.value);
      if(!code){setSyncStatus(syncMessage({kind:'invalid_code'}));inp.focus();return}
      busy(b,true,'Vinculando…');
      try{const r=await pushState(code,S);link={code,at:Date.now()};saveLink(link);S.mods=r.state.mods;S.exams=r.state.exams;persist();syncStatus='';stay()}
      catch(err){busy(b,false,'Vincular');setSyncStatus(syncMessage(err));inp.focus()}}}}

/* ---------- pregunta ---------- */
function qBody(q){
  if(q.type==='mc')return `<div class="opts">${q.options.map((o,k)=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${o}</button>`).join('')}</div>`;
  return `<div class="numin"><button type="button" class="pm" aria-label="Cambiar signo">±</button><input id="ans" type="text" inputmode="text" autocomplete="off" aria-label="Tu respuesta" placeholder="?"></div>${q.hint?`<p class="hint">${q.hint}</p>`:''}`}
function wireQ(root,q,onChange){
  if(q.type==='mc'){root.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(b.disabled)return;root.querySelectorAll('.opt').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');q.sel=+b.dataset.k;onChange&&onChange()})}
  else{const inp=root.querySelector('#ans');if(q.raw!==undefined)inp.value=q.raw;
    root.querySelector('.pm').onclick=()=>{const v=inp.value.trim();inp.value=v.startsWith('-')||v.startsWith('−')?v.replace(/^[-−]/,''):'−'+v;inp.focus();q.raw=inp.value;onChange&&onChange()};
    inp.oninput=()=>{q.raw=inp.value;onChange&&onChange()}}
  if(q.type==='mc'&&q.sel!==undefined){const b=root.querySelector(`.opt[data-k="${q.sel}"]`);b&&b.setAttribute('aria-pressed','true')}}
const answered=q=>q.type==='mc'?q.sel!==undefined:(q.raw!==undefined&&parseNum(q.raw)!==null);
const isRight=q=>q.type==='mc'?q.sel===q.answer:parseNum(q.raw)===q.answer;
const rightText=q=>q.type==='mc'?q.options[q.answer]:fmt(q.answer);
const userText=q=>q.type==='mc'?(q.sel!==undefined?q.options[q.sel]:'(sin responder)'):(q.raw&&q.raw.trim()?q.raw:'(sin responder)');
const PRAISE=['¡Correcto!','¡Muy bien!','¡Exacto!','¡Eso es!'];
function lockQ(qb,q,ok){
  if(q.type==='mc')qb.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const k=+b.dataset.k;if(k===q.answer)b.classList.add('right');else if(k===q.sel)b.classList.add('wrong')});
  else{const inp=qb.querySelector('#ans');inp.disabled=true;inp.classList.add(ok?'right':'wrong');qb.querySelector('.pm').disabled=true}}

/* ---------- explicación animada con audio ---------- */
let animStop=null;
function stopAnim(){if(animStop){animStop();animStop=null}}
let soundOn=(()=>{try{return localStorage.getItem('mates1eso.sound')!=='off'}catch(e){return true}})();
const tts=window.speechSynthesis||null;
tts&&tts.getVoices(); // Chrome carga las voces de forma diferida
const esVoice=()=>{const vs=tts?tts.getVoices():[];return vs.find(v=>/^es[-_]ES/i.test(v.lang))||vs.find(v=>/^es\b/i.test(v.lang))||null};

/* ---------- storytelling en pizarra ----------
   Cada paso se dibuja en un recuadro nuevo de una pizarra grande que conserva los anteriores.
   La cámara viaja de un recuadro al siguiente mientras se traza la flecha que los une, los trazos
   de cada paso se reparten a lo largo de su narración y al final se ve la historia completa. */
const REDUCED=Boolean(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const SWOOP=900,COLS=3; // ms del viaje de cámara · recuadros por fila (en zigzag)
const QUESTION_MARK=sk(160,132,stroke('M58 40Q58 14 81 14Q104 14 104 37Q104 53 85 61Q80 64 80 80',0,{c:'blue',t:1})+dot(80,98,6,1,'blue')+tx(80,128,'Tu turno',1.3,{s:17}),'qmark');
// La pregunta también se escribe en la pizarra (sin dibujos ni textos largos), para que la historia se entienda al verla entera.
const questionScene=q=>`<div class="qscene">${QUESTION_MARK}<div class="qtext">${at(1,q.prompt.replace(/<svg[\s\S]*?<\/svg>|<div class="texto">[\s\S]*?<\/div>/g,'').replace(/<br>/g,' '))}</div></div>`;
const stamp=(ok,html)=>`<div class="stamp">${sk(64,52,stroke(ok?'M8 28L24 44L56 8':'M12 10L52 42M52 10L12 42',0,{c:ok?'green':'red',t:.5}),'mark')}${at(.5,html,ok?'good':'')}</div>`;
// Narración y trazo: cuánto debería durar el paso para que el dibujo acompañe a la voz.
const sayTime=text=>Math.max(2.5,text.length*.065);
function pace(f,offset,text){let nat=0;
  f.querySelectorAll('.fc [style*="--d"]').forEach(e=>{const st=e.getAttribute('style'),d=parseFloat((st.match(/--d:\s*([\d.]+)/)||[])[1])||0,t=parseFloat((st.match(/--t:\s*([\d.]+)/)||[])[1])||.4;nat=Math.max(nat,d+t)});
  const k=nat?Math.min(2.6,Math.max(.8,sayTime(text)*.8/nat)):1;
  f.style.setProperty('--k',k.toFixed(2));f.style.setProperty('--o',offset.toFixed(2)+'s')}

function animPlayer(root,steps){
  let idx=0,playing=false,started=false,pending=false,ended=false,userPaused=false,token=0,timer=null,watchdog=null,audio=null,cam=null,camAnim=null,drift=null,G=null;
  root.innerHTML=`<section class="card anim stack" aria-label="Explicación animada">
    <div class="qhead"><h3>Explicación animada</h3><span class="dots" id="a-dots"></span></div>
    <div class="stage" id="a-stage"><div class="board" id="a-board"><svg class="sk links" id="a-links" aria-hidden="true"></svg></div></div>
    <p class="caption" id="a-cap"></p>
    <div id="a-q"></div>
    <div class="row"><button class="btn" type="button" id="a-play">▶ Empezar</button><button class="btn ghost" type="button" id="a-again">↺ Repetir paso</button><button class="btn ghost" type="button" id="a-next">Siguiente →</button></div>
    <div class="row"><button class="link" type="button" id="a-sound"></button><span class="hint" id="a-note"></span></div></section>`;
  const el=id=>root.querySelector('#'+id),stage=el('a-stage'),board=el('a-board'),links=el('a-links'),qp=el('a-q'),cap=el('a-cap'),play=el('a-play'),next=el('a-next'),again=el('a-again'),snd=el('a-sound'),note=el('a-note');
  const frames=[];

  /* geometría: cada recuadro ocupa la pizarra visible; la cámara transforma la pizarra entera */
  const geom=()=>{const W=stage.clientWidth||320,H=Math.round(Math.min(340,Math.max(260,W*.62)));return {W,H,gap:Math.round(W*.22)}};
  const pos=i=>{const row=Math.floor(i/COLS),c=i%COLS,col=row%2?COLS-1-c:c;return {x:col*(G.W+G.gap),y:row*(G.H+G.gap)}};
  const centerOf=i=>{const p=pos(i);return {cx:p.x+G.W/2,cy:p.y+G.H/2,s:1}};
  const camT=c=>`translate(${(G.W/2-c.cx*c.s).toFixed(1)}px,${(G.H/2-c.cy*c.s).toFixed(1)}px) scale(${c.s.toFixed(3)})`;
  // Dónde mira la cámara ahora mismo (también a mitad de un viaje o de un acercamiento), para seguir sin saltos.
  const readCam=()=>{const m=new DOMMatrixReadOnly(getComputedStyle(board).transform);return {s:m.a,cx:(G.W/2-m.e)/m.a,cy:(G.H/2-m.f)/m.a}};
  function stopCam(){const now=cam&&readCam();if(camAnim){camAnim.cancel();camAnim=null}if(drift){drift.cancel();drift=null}return now}
  // Mueve la cámara; con viaje, se aleja a mitad de camino y vuelve a acercarse. Devuelve lo que tarda (s).
  function moveCam(to,travel){const from=stopCam();
    const same=from&&Math.abs(from.cx-to.cx)<1&&Math.abs(from.cy-to.cy)<1&&Math.abs(from.s-to.s)<.06;cam=to;board.style.transform=camT(to);
    if(!travel||same||!from||REDUCED||!board.animate)return 0;
    const mid={cx:(from.cx+to.cx)/2,cy:(from.cy+to.cy)/2,s:Math.min(from.s,to.s)*.62};
    camAnim=board.animate([{transform:camT(from)},{transform:camT(mid),offset:.5},{transform:camT(to)}],{duration:SWOOP,easing:'ease-in-out'});
    camAnim.onfinish=()=>{camAnim=null};return SWOOP/1000}
  // Mientras se narra, la cámara se acerca despacio: la pizarra nunca está quieta del todo.
  function slowZoom(seconds,delay){if(REDUCED||!board.animate)return;
    drift=board.animate([{transform:camT(cam)},{transform:camT({...cam,s:cam.s*1.05})}],{duration:seconds*1000,delay:delay*1000,easing:'ease-out',fill:'forwards'})}
  function overview(){const ps=frames.map((f,i)=>f&&pos(i)).filter(Boolean),x0=Math.min(...ps.map(p=>p.x)),y0=Math.min(...ps.map(p=>p.y)),x1=Math.max(...ps.map(p=>p.x))+G.W,y1=Math.max(...ps.map(p=>p.y))+G.H;
    board.classList.add('overview');moveCam({cx:(x0+x1)/2,cy:(y0+y1)/2,s:Math.min(1,G.W*.94/(x1-x0),G.H*.94/(y1-y0))},true)}

  /* recuadros y flechas que los unen */
  function linkSvg(k,done){const a=pos(k-1),b=pos(k),{W,H}=G,cls=done?'done':'',t=(SWOOP/1000*.85).toFixed(2);let x1,y1,x2,y2,qx,qy;
    if(a.y===b.y){const r=b.x>a.x;y1=y2=a.y+H/2;x1=r?a.x+W+8:a.x-8;x2=r?b.x-8:b.x+W+8;qx=(x1+x2)/2;qy=y1-G.gap*.35}
    else{x1=x2=a.x+W/2;y1=a.y+H+8;y2=b.y-8;qx=x1+G.gap*.35;qy=(y1+y2)/2}
    const ang=Math.atan2(y2-qy,x2-qx),h=12,p=s=>`${(x2-h*Math.cos(ang+s)).toFixed(1)} ${(y2-h*Math.sin(ang+s)).toFixed(1)}`;
    return `<path class="dr blue ${cls}" pathLength="1" style="--d:0;--t:${t}s" d="M${x1} ${y1}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2} ${y2}"/>`
      +`<path class="dr blue ${cls}" pathLength="1" style="--d:${t};--t:.2s" d="M${p(.5)}L${x2} ${y2}L${p(-.5)}"/>`}
  function sizeLinks(){const n=frames.length,rows=Math.ceil(n/COLS)||1;links.setAttribute('width',COLS*(G.W+G.gap));links.setAttribute('height',rows*(G.H+G.gap))}
  function place(k){const p=pos(k);Object.assign(frames[k].style,{left:p.x+'px',top:p.y+'px',width:G.W+'px',height:G.H+'px'})}
  function frameAt(k){if(frames[k])return frames[k];
    const f=document.createElement('div');f.className='frame';f.setAttribute('aria-label',`Paso ${k+1}`);f.innerHTML=`<span class="fnum" aria-hidden="true">${k+1}</span><div class="fc"></div>`;
    const go=()=>{if(ended){started=true;show(k,true)}};f.onclick=go;f.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};
    board.appendChild(f);frames[k]=f;place(k);sizeLinks();
    if(k>0&&frames[k-1])links.insertAdjacentHTML('beforeend',linkSvg(k));return f}
  // Encoge el contenido si no cabe en el recuadro.
  function fit(f){const fc=f.querySelector('.fc');fc.style.transform='';const s=Math.min(1,(G.W-20)/fc.scrollWidth,(G.H-20)/fc.scrollHeight);if(s<1)fc.style.transform=`scale(${s.toFixed(3)})`}
  function relayout(){stopCam();G=geom();stage.style.height=G.H+'px';frames.forEach((f,k)=>{if(f){place(k);fit(f)}});sizeLinks();
    links.innerHTML=frames.map((f,k)=>k>0&&f&&frames[k-1]?linkSvg(k,true):'').join('');
    ended?overview():moveCam(centerOf(idx),false)}

  function silence(){token++;clearTimeout(timer);clearTimeout(watchdog);if(tts)tts.cancel();if(audio){audio.pause();audio=null}}
  // Narra el texto (grabación si existe, si no la voz del navegador) y llama a done al acabar.
  // Sin sonido o sin voz en español se espera un tiempo proporcional al texto, para leer los subtítulos.
  function speak(text,src,done){silence();const t=token,wait=sayTime(text)*1000;
    const finish=()=>{if(t!==token)return;clearTimeout(timer);clearTimeout(watchdog);done&&done()};
    const v=soundOn&&!src&&esVoice();
    if(soundOn&&src){audio=new Audio(src);audio.onended=finish;audio.onerror=()=>{timer=setTimeout(finish,wait)};audio.play().catch(audio.onerror)}
    else if(v){const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=.95;u.onend=finish;u.onerror=finish;tts.speak(u);watchdog=setTimeout(finish,wait*2+3000)}
    else timer=setTimeout(finish,wait)}
  function paintControls(){
    play.textContent=ended?'↺ Ver otra vez':playing?'Pausar':started?'▶ Continuar':'▶ Empezar';
    next.disabled=pending||ended;again.disabled=ended;
    board.classList.toggle('paused',userPaused);board.getAnimations().forEach(a=>userPaused?a.pause():a.play());
    frames.forEach(f=>f&&(ended?f.setAttribute('tabindex','0'):f.removeAttribute('tabindex')));
    snd.textContent=soundOn?'🔊 Sonido activado':'🔇 Sonido desactivado';snd.setAttribute('aria-pressed',String(soundOn));
    note.textContent=soundOn&&!tts?'Tu navegador no permite audio: sigue los subtítulos.':soundOn&&tts&&tts.getVoices().length&&!esVoice()?'Tu navegador no tiene voz en español: sigue los subtítulos.':'';
    el('a-dots').innerHTML=steps.map((s,k)=>`<i class="${ended||k<idx?'ok':k===idx?'cur':''}"></i>`).join('')}
  function show(k,force){idx=k;ended=false;userPaused=false;const s=steps[k];cap.textContent=s.say;pending=Boolean(s.ask);
    board.classList.remove('overview');
    const f=frameAt(k),q=s.ask&&s.ask();
    // Al salir de un recuadro su dibujo se completa al instante: la historia nunca queda a medias.
    frames.forEach(x=>{if(x){x.classList.toggle('on',x===f);x.classList.toggle('done',x!==f)}});
    f.querySelector('.fc').innerHTML=q?questionScene(q):s.show; // repintar reinicia las animaciones CSS
    fit(f);const o=moveCam(centerOf(k),true);pace(f,o,s.say);slowZoom(sayTime(s.say)+2,o);
    qp.innerHTML='';if(q)askStep(q,f);
    if(playing||force)speak(s.say,s.audio,s.ask||!playing?null:advance);
    paintControls()}
  function advance(){idx+1<steps.length?show(idx+1):end()}
  function end(){const wasPlaying=playing;playing=false;pending=false;ended=true;userPaused=false;qp.innerHTML='';
    frames.forEach(f=>{if(f){f.classList.remove('on');f.classList.add('done')}});links.querySelectorAll('path').forEach(x=>x.classList.add('done'));overview();
    cap.textContent='¡Fin! Esta es toda la historia: toca un recuadro para repasarlo o haz la prueba del nivel.';
    wasPlaying?speak('¡Fin de la explicación! Aquí tienes toda la historia. Ahora puedes hacer la prueba del nivel.',null,null):silence();paintControls()}
  function askStep(q,f){let tries=0;
    qp.innerHTML=`<div class="stack aq"><div class="prompt">${q.prompt}</div><div id="a-qb">${qBody(q)}</div><div id="a-fb"></div>
      <div class="row"><button class="btn" type="button" id="a-check" disabled>Comprobar</button></div></div>`;
    const qb=qp.querySelector('#a-qb'),btn=qp.querySelector('#a-check'),fb=qp.querySelector('#a-fb');
    wireQ(qb,q,()=>{if(pending)btn.disabled=!answered(q)});
    const inp=qb.querySelector('#ans');if(inp)inp.onkeydown=e=>{if(e.key==='Enter'&&!btn.disabled)btn.click()};
    btn.onclick=()=>{if(!pending){advance();return}
      tries++;const ok=isRight(q);
      if(ok||tries>=2){pending=false;lockQ(qb,q,ok);const v=ok?pick(PRAISE):`La respuesta es ${rightText(q)}.`;
        fb.innerHTML=`<div class="fb ${ok?'ok':'ko'}"><span class="v">${v}</span>${q.explain}</div>`;
        // La respuesta queda escrita en la pizarra, como parte de la historia.
        const fc=f.querySelector('.fc');fc.insertAdjacentHTML('beforeend',stamp(ok,ok?rightText(q):'Solución: '+rightText(q)));f.style.setProperty('--o','0s');f.style.setProperty('--k','1');fit(f);
        btn.textContent=idx+1<steps.length?'Continuar':'Terminar';btn.focus();
        speak(ok?v:'Fíjate en la explicación.',null,null);paintControls()}
      else{fb.innerHTML=`<div class="fb ko"><span class="v">Casi. Inténtalo otra vez.</span>${q.hint||'Repasa lo que acabas de ver.'}</div>`;
        if(q.type==='mc'){q.sel=undefined;qb.querySelectorAll('.opt').forEach(b=>b.setAttribute('aria-pressed','false'))}
        btn.disabled=true;speak('Casi. Inténtalo otra vez.',null,null)}}}
  play.onclick=()=>{started=true;if(ended){playing=true;show(0);return}
    if(playing){playing=false;userPaused=true;silence();paintControls();return}
    playing=true;userPaused=false;pending?(speak(steps[idx].say,steps[idx].audio,null),paintControls()):show(idx)};
  again.onclick=()=>show(idx,true);
  next.onclick=()=>{if(!pending)advance()};
  snd.onclick=()=>{soundOn=!soundOn;try{localStorage.setItem('mates1eso.sound',soundOn?'on':'off')}catch(e){}
    if(playing&&!pending)show(idx);else{if(!soundOn)silence();paintControls()}};
  if(tts)tts.onvoiceschanged=paintControls;
  const ro=window.ResizeObserver?new ResizeObserver(()=>{const w=stage.clientWidth;if(G&&w&&w!==G.W)relayout()}):null;
  ro&&ro.observe(stage);
  animStop=()=>{playing=false;silence();if(G)stopCam();ro&&ro.disconnect();if(tts)tts.onvoiceschanged=null};
  G=geom();stage.style.height=G.H+'px';
  show(0)}

/* ---------- prueba de nivel ---------- */
function levelQuiz(pane,mod,i){const lv=mod.levels[i];const qs=makeSet(lv.gens,QUIZ_N);let idx=0;
  function show(){const q=qs[idx];
    pane.innerHTML=`<div class="card stack pop">
      <div class="qhead"><span class="eyebrow">Pregunta ${idx+1} de ${QUIZ_N}</span><span class="dots">${qs.map((x,k)=>`<i class="${x.done?(x.ok?'ok':'ko'):k===idx?'cur':''}"></i>`).join('')}</span></div>
      <div class="prompt">${q.prompt}</div><div id="qb">${qBody(q)}</div><div id="fb"></div>
      <div class="row"><button class="btn" type="button" id="check" disabled>Comprobar</button></div></div>`;
    const qb=$('#qb'),btn=$('#check');
    wireQ(qb,q,()=>btn.disabled=!answered(q));
    const inp=qb.querySelector('#ans');if(inp){inp.focus();inp.onkeydown=e=>{if(e.key==='Enter'&&!btn.disabled)btn.click()}}
    btn.onclick=()=>{if(q.done){idx++;idx<QUIZ_N?show():finish();return}
      q.done=true;q.ok=isRight(q);
      lockQ(qb,q,q.ok);
      $('#fb').innerHTML=`<div class="fb ${q.ok?'ok':'ko'}"><span class="v">${q.ok?pick(PRAISE):`No es correcto. La respuesta es ${rightText(q)}.`}</span>${q.explain}</div>`;
      btn.textContent=idx+1<QUIZ_N?'Siguiente':'Ver resultado';btn.focus()}}
  function finish(){const ok=qs.filter(q=>q.ok).length,pass=ok>=PASS,p=mp(mod.id);
    p.best[i]=Math.max(p.best[i]??0,ok);
    let unlockedNow=false;if(pass&&p.unlocked<=i+1&&i+1<mod.levels.length){p.unlocked=i+2;unlockedNow=true}save();
    const last=i+1>=mod.levels.length;
    pane.innerHTML=`<div class="card stack pop">
      <div class="row" style="gap:18px"><span class="score">${ok}/${QUIZ_N}</span><div style="flex:1;min-width:200px"><h2>${pass?(last?'¡Módulo completado!':'¡Nivel superado!'):'Casi, inténtalo otra vez'}</h2>
      <p class="muted">${pass?(unlockedNow?`Has desbloqueado el nivel ${i+2}: <b>${mod.levels[i+1].title}</b>.`:last?'Ahora prueba el examen final del módulo.':'Puedes seguir al siguiente nivel.'):`Necesitas ${PASS} aciertos. Repasa la lección y vuelve a intentarlo; las preguntas cambian.`}</p></div></div>
      <div class="row">${pass&&!last?`<button class="btn" type="button" id="next">Ir al nivel ${i+2}</button>`:''}
       ${pass&&last?`<button class="btn" type="button" id="exams">Ir a los exámenes</button>`:''}
       ${!pass?`<button class="btn" type="button" id="relearn">Repasar la lección</button>`:''}
       <button class="btn ghost" type="button" id="again">Otra prueba</button></div></div>`;
    $('#again').onclick=()=>go(viewLevel,mod,i,'quiz');
    $('#next')&&($('#next').onclick=()=>go(viewLevel,mod,i+1,'learn'));
    $('#relearn')&&($('#relearn').onclick=()=>go(viewLevel,mod,i,'learn'));
    $('#exams')&&($('#exams').onclick=()=>go(viewModule,mod))}
  show()}

/* ---------- examen ---------- */
function viewExam(mod,ex){track(viewExam,[mod,ex]);setCrumb(`${mod.name} · ${ex.name}`);
  // Un examen puede mezclar niveles de otros módulos con referencias «módulo:nivel» (p. ej. 'laboratorio:2').
  const refs=ex.levels.map(r=>typeof r==='number'?{m:mod,li:r}:{m:MODULES.find(x=>x.id===r.split(':')[0]),li:+r.split(':')[1]});
  const label=r=>r.m===mod?`Nivel ${r.li+1}`:`${r.m.name} ${r.li+1}`;
  const per=Math.floor(ex.n/refs.length);let qs=[];
  refs.forEach((r,k)=>{const extra=k<ex.n-per*refs.length?1:0;qs=qs.concat(makeSet(r.m.levels[r.li].gens,per+extra,k))});
  let idx=0;const t0=Date.now();
  const clock=()=>{const s=Math.floor((Date.now()-t0)/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
  app.innerHTML=`<div class="stack"><div class="row" style="justify-content:space-between"><div><p class="eyebrow">${ex.sub}</p><h1>${ex.name}</h1></div><span class="timer" id="clock">⏱ 0:00</span></div><div id="pane"></div></div>`;
  timerId=setInterval(()=>{const c=$('#clock');c&&(c.textContent='⏱ '+clock())},1000);
  const pane=$('#pane');
  function show(){const q=qs[idx];const nAns=qs.filter(answered).length;
    pane.innerHTML=`<div class="card stack pop">
     <div class="qhead"><span class="eyebrow">Pregunta ${idx+1} de ${qs.length}</span><span class="dots">${qs.map((x,k)=>`<i class="${k===idx?'cur':answered(x)?'ans':''}"></i>`).join('')}</span></div>
     <div class="prompt">${q.prompt}</div><div id="qb">${qBody(q)}</div>
     <div class="row" style="justify-content:space-between"><div class="row"><button class="btn ghost" type="button" id="prev" ${idx===0?'disabled':''}>Anterior</button>
       ${idx<qs.length-1?`<button class="btn" type="button" id="nxt">Siguiente</button>`:''}</div>
       <span class="hint" id="cnt">${nAns} de ${qs.length} respondidas</span></div>
     <div class="row" id="submit-row"><button class="btn ${idx===qs.length-1?'':'ghost'}" type="button" id="sub">Entregar examen</button></div></div>`;
    const qb=$('#qb');wireQ(qb,q,()=>{$('#cnt').textContent=`${qs.filter(answered).length} de ${qs.length} respondidas`});
    const inp=qb.querySelector('#ans');if(inp){inp.focus();inp.onkeydown=e=>{if(e.key==='Enter'){idx<qs.length-1?(idx++,show()):$('#sub').click()}}}
    $('#prev').onclick=()=>{idx--;show()};$('#nxt')&&($('#nxt').onclick=()=>{idx++;show()});
    $('#sub').onclick=()=>{const left=qs.length-qs.filter(answered).length;
      if(left>0){$('#submit-row').innerHTML=`<span>Te quedan ${left} sin responder.</span><button class="btn" type="button" id="sub2">Entregar igualmente</button><button class="btn ghost" type="button" id="cancel">Seguir</button>`;
        $('#sub2').onclick=finish;$('#cancel').onclick=show}else finish()}}
  function finish(){clearInterval(timerId);const time=clock();qs.forEach(q=>q.ok=answered(q)&&isRight(q));
    const ok=qs.filter(q=>q.ok).length,g=Math.round(ok/qs.length*100)/10;
    const key=mod.id+':'+ex.id;(S.exams[key]=S.exams[key]||[]).push({g,d:Date.now()});S.exams[key]=S.exams[key].slice(-10);save();
    const verdict=g>=9?'Sobresaliente':g>=7?'Notable':g>=6?'Bien':g>=5?'Suficiente':'Insuficiente';
    const by=refs.map((r,k)=>{const sub=qs.filter(q=>q.level===k);return {k,ok:sub.filter(q=>q.ok).length,n:sub.length}});
    const weak=by.filter(b=>b.ok/b.n<.6);
    pane.innerHTML=`<div class="stack pop">
     <div class="card stack"><div class="row" style="gap:18px"><span class="score">${g.toFixed(1).replace('.',',')}</span>
      <div style="flex:1;min-width:200px"><h2>${verdict}</h2><p class="muted">${ok} de ${qs.length} aciertos · tiempo ${time}</p></div></div>
      <div class="brk">${by.map(b=>`<span>${label(refs[b.k])}</span><div class="bar"><i style="width:${b.ok/b.n*100}%;${b.ok/b.n<.6?'background:var(--bad)':''}"></i></div><span>${b.ok}/${b.n}</span>`).join('')}</div>
      ${weak.length?`<p>Te conviene repasar: ${weak.map(b=>`<button class="link" type="button" data-lv="${b.k}">${label(refs[b.k])} · ${refs[b.k].m.levels[refs[b.k].li].title}</button>`).join(', ')}.</p>`:'<p>Dominas todos los niveles de este examen.</p>'}
      <div class="row"><button class="btn" type="button" id="again">Otro examen</button><button class="btn ghost" type="button" id="back">Volver al módulo</button></div></div>
     <h2>Corrección</h2>
     <div class="review">${qs.map((q,k)=>`<div class="rv ${q.ok?'':'ko'}"><div class="eyebrow">${k+1} · ${label(refs[q.level])} · ${q.ok?'Bien':'Mal'}</div><div class="prompt" style="font-size:1.1rem">${q.prompt}</div>
       ${q.ok?'':`<div class="ua">Tu respuesta: ${userText(q)} · Correcta: <b>${rightText(q)}</b></div>`}<div style="font-size:.95rem">${q.explain}</div></div>`).join('')}</div></div>`;
    $('#again').onclick=()=>go(viewExam,mod,ex);$('#back').onclick=()=>go(viewModule,mod);
    pane.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{const r=refs[+b.dataset.lv];go(viewLevel,r.m,r.li,'learn')});window.scrollTo({top:0})}
  show()}

go(viewHome);
syncNow();


function exportProgress(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;a.download='cuaderno-1eso-progreso.json';a.click();URL.revokeObjectURL(url);
}

$('#import-file').onchange=async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try{const imported=migrateState(JSON.parse(await file.text()));S=imported;save();go(currentView.fn||viewHome,...(currentView.args||[]));}
  catch{storageWarning='El archivo de progreso no es válido.';renderFoot();}
};
