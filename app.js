import { $, fmt, P, mc, num, parseNum, POT_LEVELS, MODULES, pick, shuffle } from './data.js';

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
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));storageWarning='';return true}catch(e){storageWarning='No se pudo guardar el progreso en este navegador.';return false}};
const mp=id=>S.mods[id]||(S.mods[id]={unlocked:1,best:{}});
const isOpen=(mod,i)=>S.open||i<mp(mod.id).unlocked;
const QUIZ_N=5,PASS=4;

function makeSet(gens,n,tag){const out=[],seen=new Set();let order=shuffle(gens.map((g,i)=>i));let k=0;
  while(out.length<n){const gi=order[k%order.length];k++;if(k%order.length===0)order=shuffle(order);
    let q,tries=0;do{q=gens[gi]();tries++}while(seen.has(q.prompt)&&tries<15);seen.add(q.prompt);if(tag!==undefined)q.level=tag;out.push(q)}
  return out}

/* ---------- vistas ---------- */
const app=$('#app');
let timerId=null;
function setCrumb(t){$('#crumb').textContent=t||''}
function go(view,...args){clearInterval(timerId);window.scrollTo({top:0});view(...args);renderFoot();requestAnimationFrame(()=>app.focus())}
$('#home-btn').onclick=()=>go(viewHome);

function renderFoot(){$('#foot-actions').innerHTML=`<button class="link" id="export" type="button">Exportar progreso</button> · <button class="link" id="import" type="button">Importar progreso</button> · <button class="link" id="open-all" type="button">${S.open?'Volver a bloquear niveles':'Modo profesor: abrir todos los niveles'}</button> · <button class="link" id="reset" type="button">Borrar progreso</button>${storageWarning?`<span class="storage-warning" role="alert"> ${storageWarning}</span>`:''}`;
  $('#export').onclick=exportProgress;
  $('#import').onclick=()=>$('#import-file').click();
  $('#open-all').onclick=()=>{S.open=!S.open;save();go(currentView.fn,...currentView.args)};
  $('#reset').onclick=()=>{const fa=$('#foot-actions');fa.innerHTML=`¿Seguro? Se borrarán niveles y notas. <button class="link" id="r-yes" type="button">Sí, borrar</button> · <button class="link" id="r-no" type="button">Cancelar</button>`;
    $('#r-yes').onclick=()=>{S=emptyState();save();go(viewHome)};$('#r-no').onclick=renderFoot}}
let currentView={fn:null,args:[]};
const track=(fn,args)=>currentView={fn,args};

function viewHome(){track(viewHome,[]);setCrumb('');
  app.innerHTML=`<div class="stack">
   <section class="hero"><p class="eyebrow">Aprendizaje guiado · 1º de ESO</p>
    <div class="big" aria-hidden="true">2<sup>5</sup> = 32</div>
    <p class="muted" style="max-width:56ch">Elige un módulo. Cada uno tiene niveles que se desbloquean al aprobar una prueba corta, y exámenes de prueba para repasar todo.</p></section>
   <div class="mods">${MODULES.map(m=>{const p=m.soon?null:mp(m.id);const done=p?Math.min(Object.keys(p.best).filter(k=>p.best[k]>=PASS).length,m.levels.length):0;
     return `<button class="mod ${m.soon?'':'on'}" type="button" data-id="${m.id}" ${m.soon?'disabled':''}>
      <span class="sym">${m.sym}</span><h3>${m.name}</h3><span class="muted" style="font-size:.92rem">${m.desc}</span>
      ${m.soon?'<span><span class="chip grey">Próximamente</span></span>':`<span class="row" style="justify-content:space-between"><span class="chip ${done===m.levels.length?'ok':''}">${done} de ${m.levels.length} niveles</span></span><div class="bar"><i style="width:${done/m.levels.length*100}%"></i></div>`}
     </button>`}).join('')}</div></div>`;
  app.querySelectorAll('.mod:not([disabled])').forEach(b=>b.onclick=()=>go(viewModule,MODULES.find(m=>m.id===b.dataset.id)))}

function viewModule(mod){track(viewModule,[mod]);setCrumb(mod.name);const p=mp(mod.id);
  app.innerHTML=`<div class="stack">
   <div><p class="eyebrow">Módulo</p><h1>${mod.name}</h1></div>
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
    pane.innerHTML=`<div class="stack lesson">${lv.lesson.map(([t,h])=>`<section class="card"><h3>${t}</h3>${h}</section>`).join('')}
     <div class="card row" style="justify-content:space-between"><span>¿Lo tienes? Responde ${QUIZ_N} preguntas. Con ${PASS} bien ${i+1<mod.levels.length?'desbloqueas el siguiente nivel':'completas el módulo'}.</span><button class="btn" type="button" id="go-quiz">Hacer la prueba</button></div></div>`;
    $('#go-quiz').onclick=()=>go(viewLevel,mod,i,'quiz')}
  else levelQuiz(pane,mod,i)}

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
      if(q.type==='mc'){qb.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const k=+b.dataset.k;if(k===q.answer)b.classList.add('right');else if(k===q.sel)b.classList.add('wrong')})}
      else{inp.disabled=true;inp.classList.add(q.ok?'right':'wrong');qb.querySelector('.pm').disabled=true}
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


function exportProgress(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;a.download='cuaderno-mates-progreso.json';a.click();URL.revokeObjectURL(url);
}

$('#import-file').onchange=async e=>{
  const file=e.target.files[0];e.target.value='';if(!file)return;
  try{const imported=migrateState(JSON.parse(await file.text()));S=imported;save();go(currentView.fn||viewHome,...(currentView.args||[]));}
  catch{storageWarning='El archivo de progreso no es válido.';renderFoot();}
};
