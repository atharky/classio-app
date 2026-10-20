import { SUBJECTS } from '../catalog.js';
import { $ } from '../data.js';
import { viewExam } from '../exam.js';
import { viewReview } from '../quiz.js';
import { PASS, QUIZ_N, S, isOpen, mp, pendingMisses } from '../state.js';
import { app, go, setCrumb, track } from '../ui.js';
import { viewLevel } from './level.js';

export function viewModule(mod){track(viewModule,[mod]);setCrumb(mod.name);const p=mp(mod.id);
  app.innerHTML=`<div class="stack">
   <div><p class="eyebrow">${SUBJECTS.find(s=>s.id===mod.subject).name}</p><h1>${mod.name}</h1></div>
   <h2 data-s="margin-top:6px">Niveles</h2>
   <div class="path">${mod.levels.map((lv,i)=>{const best=p.best[i];const done=best>=PASS;const open=isOpen(mod,i);const cur=open&&!done;
     return `<button type="button" class="lvl ${done?'done':''} ${cur?'cur':''}" data-i="${i}" ${open?'':'disabled'} aria-label="Nivel ${i+1}: ${lv.title}${open?'':' (bloqueado)'}">
      <span class="n">${done?'✓':i+1}</span><span class="t"><b>${lv.title}</b><small>${lv.sub}</small></span>
      <span class="stars">${open?(best!==undefined?`Mejor: ${best}/${QUIZ_N}`:'Nuevo'):'🔒 Aprueba el anterior'}</span></button>`}).join('')}</div>
   ${pendingMisses(mod.id).length?`<div class="card row" data-s="justify-content:space-between"><span><b>Repasa lo que fallaste.</b> Tienes ${pendingMisses(mod.id).length} tipo${pendingMisses(mod.id).length===1?'':'s'} de pregunta pendiente${pendingMisses(mod.id).length===1?'':'s'}.</span><button class="btn" type="button" id="review">Repasar lo que fallé</button></div>`:''}
   <h2 data-s="margin-top:14px">Exámenes de prueba</h2>
   <p class="muted">Preguntas al azar, sin pistas hasta el final. Puedes repetirlos todas las veces que quieras: cada vez salen preguntas distintas.</p>
   <div class="exams">${mod.exams.map(ex=>{const h=(S.exams[mod.id+':'+ex.id]||[]);const last=h[h.length-1];
     return `<div class="card stack" data-s="gap:8px"><h3>${ex.name}</h3><span class="muted">${ex.sub} · ${ex.n} preguntas</span>
      <span class="hint">${last?`Última nota: <b>${last.g.toFixed(1).replace('.',',')}</b>${h.length>1?` · Mejor: <b>${Math.max(...h.map(x=>x.g)).toFixed(1).replace('.',',')}</b>`:''}`:'Aún sin hacer'}</span>
      <button class="btn ${last?'ghost':''}" type="button" data-ex="${ex.id}">${last?'Repetir':'Empezar'}</button></div>`}).join('')}</div>
  </div>`;
  app.querySelectorAll('.lvl:not([disabled])').forEach(b=>b.onclick=()=>go(viewLevel,mod,+b.dataset.i,'learn'));
  $('#review')&&($('#review').onclick=()=>go(viewReview,mod));
  app.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>go(viewExam,mod,mod.exams.find(e=>e.id===b.dataset.ex)))}

