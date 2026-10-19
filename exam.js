import { MODULES } from './catalog.js';
import { $, esc } from './data.js';
import { answered, isRight, qBody, rightText, userText, wireQ } from './question.js';
import { makeSet } from './quiz.js';
import { S, recordResult, save, ui } from './state.js';
import { app, go, setCrumb, track } from './ui.js';
import { viewLevel } from './views/level.js';
import { viewModule } from './views/module.js';

/* ---------- examen ---------- */
export function viewExam(mod,ex){track(viewExam,[mod,ex]);setCrumb(`${mod.name} · ${ex.name}`);
  // Un examen puede mezclar niveles de otros módulos con referencias «módulo:nivel» (p. ej. 'laboratorio:2').
  const refs=ex.levels.map(r=>typeof r==='number'?{m:mod,li:r}:{m:MODULES.find(x=>x.id===r.split(':')[0]),li:+r.split(':')[1]});
  const label=r=>r.m===mod?`Nivel ${r.li+1}`:`${r.m.name} ${r.li+1}`;
  const per=Math.floor(ex.n/refs.length);let qs=[];
  refs.forEach((r,k)=>{const extra=k<ex.n-per*refs.length?1:0;qs=qs.concat(makeSet(r.m.levels[r.li].gens,per+extra,k))});
  let idx=0;const t0=Date.now();
  const clock=()=>{const s=Math.floor((Date.now()-t0)/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
  app.innerHTML=`<div class="stack"><div class="row" style="justify-content:space-between"><div><p class="eyebrow">${ex.sub}</p><h1>${ex.name}</h1></div><span class="timer" id="clock">⏱ 0:00</span></div><div id="pane"></div></div>`;
  ui.timerId=setInterval(()=>{const c=$('#clock');c&&(c.textContent='⏱ '+clock())},1000);
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
  function finish(){clearInterval(ui.timerId);const time=clock();qs.forEach(q=>q.ok=answered(q)&&isRight(q));
    const ok=qs.filter(q=>q.ok).length,g=Math.round(ok/qs.length*100)/10;
    qs.forEach(q=>{const r=refs[q.level];recordResult(r.m.id,r.li,q.gi,q.ok)});
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
       ${q.ok?'':`<div class="ua">Tu respuesta: ${esc(userText(q))} · Correcta: <b>${rightText(q)}</b></div>`}<div style="font-size:.95rem">${q.explain}</div></div>`).join('')}</div></div>`;
    $('#again').onclick=()=>go(viewExam,mod,ex);$('#back').onclick=()=>go(viewModule,mod);
    pane.querySelectorAll('[data-lv]').forEach(b=>b.onclick=()=>{const r=refs[+b.dataset.lv];go(viewLevel,r.m,r.li,'learn')});window.scrollTo({top:0})}
  show()}

