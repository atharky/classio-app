import { $, fmt, parseNum, pick, shuffle } from './data.js';
import { SUBJECTS, MODULES, ANIMS } from './catalog.js';
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

// Rotulador de pizarra: sigue cada trazo SVG punto a punto y cada texto de izquierda a derecha.
const PEN_SVG='<svg viewBox="0 0 44 44"><g transform="rotate(35 22 22)"><rect x="16" y="1" width="12" height="28" rx="3" fill="#2d3748"/><rect x="16" y="6" width="12" height="6" fill="#1f4fd1"/><path d="M17 29h10l-3 10h-4z" fill="#1f4fd1"/></g></svg>';
function followPen(stage){
  const pen=document.createElement('div');pen.className='pen';pen.setAttribute('aria-hidden','true');pen.innerHTML=PEN_SVG;
  let raf=0,hide=0;
  const onStart=e=>{const el=e.target,name=e.animationName;
    if(!['wb-write','wb-draw','x-in'].includes(name)||!el.isConnected)return;
    const dur=(parseFloat(getComputedStyle(el,e.pseudoElement||null).animationDuration)||.5)*1000;
    if(pen.parentNode!==stage)stage.appendChild(pen); // repintar la escena lo quita
    const sr=stage.getBoundingClientRect(),ox=stage.scrollLeft-sr.left,oy=stage.scrollTop-sr.top;let at;
    if(name==='wb-draw'&&el.getTotalLength){const len=el.getTotalLength(),m=el.getScreenCTM();
      at=t=>{const p=el.getPointAtLength(t*len);return [m.a*p.x+m.c*p.y+m.e+ox,m.b*p.x+m.d*p.y+m.f+oy]}}
    else{const r=el.getBoundingClientRect(),y=name==='x-in'?r.top+r.height/2:r.bottom-6;at=t=>[r.left+t*r.width+ox,y+oy]}
    cancelAnimationFrame(raf);clearTimeout(hide);pen.classList.add('on');const t0=performance.now();
    const tick=now=>{if(!el.isConnected){pen.classList.remove('on');return} // la escena se repintó o se salió de la pantalla
      const t=Math.min(1,(now-t0)/dur),[x,y]=at(t);pen.style.transform=`translate(${x}px,${y}px)`;
      if(t<1)raf=requestAnimationFrame(tick);else hide=setTimeout(()=>pen.classList.remove('on'),700)};
    raf=requestAnimationFrame(tick)};
  stage.addEventListener('animationstart',onStart);
  return ()=>{cancelAnimationFrame(raf);clearTimeout(hide);stage.removeEventListener('animationstart',onStart)}}

function animPlayer(root,steps){
  let idx=0,playing=false,started=false,pending=false,ended=false,token=0,timer=null,watchdog=null,audio=null;
  root.innerHTML=`<section class="card anim stack" aria-label="Explicación animada">
    <div class="qhead"><h3>Explicación animada</h3><span class="dots" id="a-dots"></span></div>
    <div class="stage" id="a-stage"></div>
    <p class="caption" id="a-cap"></p>
    <div class="row"><button class="btn" type="button" id="a-play">▶ Empezar</button><button class="btn ghost" type="button" id="a-again">↺ Repetir paso</button><button class="btn ghost" type="button" id="a-next">Siguiente →</button></div>
    <div class="row"><button class="link" type="button" id="a-sound"></button><span class="hint" id="a-note"></span></div></section>`;
  const el=id=>root.querySelector('#'+id),stage=el('a-stage'),cap=el('a-cap'),play=el('a-play'),next=el('a-next'),again=el('a-again'),snd=el('a-sound'),note=el('a-note');
  function silence(){token++;clearTimeout(timer);clearTimeout(watchdog);if(tts)tts.cancel();if(audio){audio.pause();audio=null}}
  // Narra el texto (grabación si existe, si no la voz del navegador) y llama a done al acabar.
  // Sin sonido o sin voz en español se espera un tiempo proporcional al texto, para leer los subtítulos.
  function speak(text,src,done){silence();const t=token,wait=Math.max(2500,text.length*65);
    const finish=()=>{if(t!==token)return;clearTimeout(timer);clearTimeout(watchdog);done&&done()};
    const v=soundOn&&!src&&esVoice();
    if(soundOn&&src){audio=new Audio(src);audio.onended=finish;audio.onerror=()=>{timer=setTimeout(finish,wait)};audio.play().catch(audio.onerror)}
    else if(v){const u=new SpeechSynthesisUtterance(text);u.voice=v;u.lang=v.lang;u.rate=.95;u.onend=finish;u.onerror=finish;tts.speak(u);watchdog=setTimeout(finish,wait*2+3000)}
    else timer=setTimeout(finish,wait)}
  function paintControls(){
    play.textContent=ended?'↺ Ver otra vez':playing?'Pausar':started?'▶ Continuar':'▶ Empezar';
    next.disabled=pending||ended;again.disabled=ended;
    snd.textContent=soundOn?'🔊 Sonido activado':'🔇 Sonido desactivado';snd.setAttribute('aria-pressed',String(soundOn));
    note.textContent=soundOn&&!tts?'Tu navegador no permite audio: sigue los subtítulos.':soundOn&&tts&&tts.getVoices().length&&!esVoice()?'Tu navegador no tiene voz en español: sigue los subtítulos.':'';
    el('a-dots').innerHTML=steps.map((s,k)=>`<i class="${ended||k<idx?'ok':k===idx?'cur':''}"></i>`).join('')}
  function show(k,force){idx=k;ended=false;const s=steps[k];cap.textContent=s.say;pending=Boolean(s.ask);
    if(s.ask)askStep(s);else stage.innerHTML=s.show; // repintar reinicia las animaciones CSS
    if(playing||force)speak(s.say,s.audio,s.ask||!playing?null:advance);
    paintControls()}
  function advance(){idx+1<steps.length?show(idx+1):end()}
  function end(){const wasPlaying=playing;playing=false;pending=false;ended=true;
    stage.innerHTML='<div class="sl big"><span class="a" style="--d:0">¡Fin de la explicación!</span></div>';
    cap.textContent='Repasa el resumen escrito de abajo o haz la prueba del nivel.';
    wasPlaying?speak('¡Fin de la explicación! Ahora puedes hacer la prueba del nivel.',null,null):silence();paintControls()}
  function askStep(s){const q=s.ask();let tries=0;
    stage.innerHTML=`<div class="stack aq"><span class="eyebrow">Tu turno</span><div class="prompt">${q.prompt}</div><div id="a-qb">${qBody(q)}</div><div id="a-fb"></div>
      <div class="row"><button class="btn" type="button" id="a-check" disabled>Comprobar</button></div></div>`;
    const qb=stage.querySelector('#a-qb'),btn=stage.querySelector('#a-check'),fb=stage.querySelector('#a-fb');
    wireQ(qb,q,()=>{if(pending)btn.disabled=!answered(q)});
    const inp=qb.querySelector('#ans');if(inp)inp.onkeydown=e=>{if(e.key==='Enter'&&!btn.disabled)btn.click()};
    btn.onclick=()=>{if(!pending){advance();return}
      tries++;const ok=isRight(q);
      if(ok||tries>=2){pending=false;lockQ(qb,q,ok);const v=ok?pick(PRAISE):`La respuesta es ${rightText(q)}.`;
        fb.innerHTML=`<div class="fb ${ok?'ok':'ko'}"><span class="v">${v}</span>${q.explain}</div>`;
        btn.textContent=idx+1<steps.length?'Continuar':'Terminar';btn.focus();
        speak(ok?v:'Fíjate en la explicación.',null,null);paintControls()}
      else{fb.innerHTML=`<div class="fb ko"><span class="v">Casi. Inténtalo otra vez.</span>${q.hint||'Repasa lo que acabas de ver.'}</div>`;
        if(q.type==='mc'){q.sel=undefined;qb.querySelectorAll('.opt').forEach(b=>b.setAttribute('aria-pressed','false'))}
        btn.disabled=true;speak('Casi. Inténtalo otra vez.',null,null)}}}
  play.onclick=()=>{started=true;if(ended){playing=true;show(0);return}
    if(playing){playing=false;silence();paintControls();return}
    playing=true;pending?(speak(steps[idx].say,steps[idx].audio,null),paintControls()):show(idx)};
  again.onclick=()=>show(idx,true);
  next.onclick=()=>{if(!pending)advance()};
  snd.onclick=()=>{soundOn=!soundOn;try{localStorage.setItem('mates1eso.sound',soundOn?'on':'off')}catch(e){}
    if(playing&&!pending)show(idx);else{if(!soundOn)silence();paintControls()}};
  if(tts)tts.onvoiceschanged=paintControls;
  const stopPen=followPen(stage);
  animStop=()=>{playing=false;silence();stopPen();if(tts)tts.onvoiceschanged=null};
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
  const per=Math.floor(ex.n/ex.levels.length);let qs=[];
  ex.levels.forEach((li,k)=>{const extra=k<ex.n-per*ex.levels.length?1:0;qs=qs.concat(makeSet(mod.levels[li].gens,per+extra,li))});
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
    const by=ex.levels.map(li=>{const sub=qs.filter(q=>q.level===li);return {li,ok:sub.filter(q=>q.ok).length,n:sub.length}});
    const weak=by.filter(b=>b.ok/b.n<.6);
    pane.innerHTML=`<div class="stack pop">
     <div class="card stack"><div class="row" style="gap:18px"><span class="score">${g.toFixed(1).replace('.',',')}</span>
      <div style="flex:1;min-width:200px"><h2>${verdict}</h2><p class="muted">${ok} de ${qs.length} aciertos · tiempo ${time}</p></div></div>
      <div class="brk">${by.map(b=>`<span>Nivel ${b.li+1}</span><div class="bar"><i style="width:${b.ok/b.n*100}%;${b.ok/b.n<.6?'background:var(--bad)':''}"></i></div><span>${b.ok}/${b.n}</span>`).join('')}</div>
      ${weak.length?`<p>Te conviene repasar: ${weak.map(b=>`<button class="link" type="button" data-lv="${b.li}">Nivel ${b.li+1} · ${mod.levels[b.li].title}</button>`).join(', ')}.</p>`:'<p>Dominas todos los niveles de este examen.</p>'}
      <div class="row"><button class="btn" type="button" id="again">Otro examen</button><button class="btn ghost" type="button" id="back">Volver al módulo</button></div></div>
     <h2>Corrección</h2>
     <div class="review">${qs.map((q,k)=>`<div class="rv ${q.ok?'':'ko'}"><div class="eyebrow">${k+1} · Nivel ${q.level+1} · ${q.ok?'Bien':'Mal'}</div><div class="prompt" style="font-size:1.1rem">${q.prompt}</div>
       ${q.ok?'':`<div class="ua">Tu respuesta: ${userText(q)} · Correcta: <b>${rightText(q)}</b></div>`}<div style="font-size:.95rem">${q.explain}</div></div>`).join('')}</div></div>`;
    $('#again').onclick=()=>go(viewExam,mod,ex);$('#back').onclick=()=>go(viewModule,mod);
    pane.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>go(viewLevel,mod,+b.dataset.lv,'learn'));window.scrollTo({top:0})}
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
