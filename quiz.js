import { $, pick, shuffle } from './data.js';
import { PRAISE, answered, isRight, lockQ, qBody, rightText, wireQ } from './question.js';
import { CURE, PASS, QUIZ_N, REVIEW_N, mp, pendingMisses, recordResult, save } from './state.js';
import { app, go, setCrumb, track } from './ui.js';
import { viewLevel } from './views/level.js';
import { viewModule } from './views/module.js';

export function makeSet(gens,n,tag){const out=[],seen=new Set();let order=shuffle(gens.map((g,i)=>i));let k=0;
  while(out.length<n){const gi=order[k%order.length];k++;if(k%order.length===0)order=shuffle(order);
    let q,tries=0;do{q=gens[gi]();tries++}while(seen.has(q.prompt)&&tries<15);seen.add(q.prompt);q.gi=gi;if(tag!==undefined)q.level=tag;out.push(q)}
  return out}

/* ---------- prueba de nivel ---------- */
// Cuestionario de una pregunta cada vez con corrección inmediata; al terminar llama a done(qs).
export function runQuiz(pane,qs,done){let idx=0;const N=qs.length;
  function show(){const q=qs[idx];
    pane.innerHTML=`<div class="card stack pop">
      <div class="qhead"><span class="eyebrow">Pregunta ${idx+1} de ${N}</span><span class="dots">${qs.map((x,k)=>`<i class="${x.done?(x.ok?'ok':'ko'):k===idx?'cur':''}"></i>`).join('')}</span></div>
      <div class="prompt">${q.prompt}</div><div id="qb">${qBody(q)}</div><div id="fb"></div>
      <div class="row"><button class="btn" type="button" id="check" disabled>Comprobar</button></div></div>`;
    const qb=$('#qb'),btn=$('#check');
    wireQ(qb,q,()=>btn.disabled=!answered(q));
    const inp=qb.querySelector('#ans');if(inp){inp.focus();inp.onkeydown=e=>{if(e.key==='Enter'&&!btn.disabled)btn.click()}}
    btn.onclick=()=>{if(q.done){idx++;idx<N?show():done(qs);return}
      q.done=true;q.ok=isRight(q);
      lockQ(qb,q,q.ok);
      $('#fb').innerHTML=`<div class="fb ${q.ok?'ok':'ko'}"><span class="v">${q.ok?pick(PRAISE):`No es correcto. La respuesta es ${rightText(q)}.`}</span>${q.explain}</div>`;
      btn.textContent=idx+1<N?'Siguiente':'Ver resultado';btn.focus()}}
  show()}

export function levelQuiz(pane,mod,i){const lv=mod.levels[i];
  runQuiz(pane,makeSet(lv.gens,QUIZ_N),qs=>{const ok=qs.filter(q=>q.ok).length,pass=ok>=PASS,p=mp(mod.id);
    p.best[i]=Math.max(p.best[i]??0,ok);qs.forEach(q=>recordResult(mod.id,i,q.gi,q.ok));
    let unlockedNow=false;if(pass&&p.unlocked<=i+1&&i+1<mod.levels.length){p.unlocked=i+2;unlockedNow=true}save();
    const last=i+1>=mod.levels.length;
    pane.innerHTML=`<div class="card stack pop">
      <div class="row" data-s="gap:18px"><span class="score">${ok}/${QUIZ_N}</span><div data-s="flex:1;min-width:200px"><h2>${pass?(last?'¡Módulo completado!':'¡Nivel superado!'):'Casi, inténtalo otra vez'}</h2>
      <p class="muted">${pass?(unlockedNow?`Has desbloqueado el nivel ${i+2}: <b>${mod.levels[i+1].title}</b>.`:last?'Ahora prueba el examen final del módulo.':'Puedes seguir al siguiente nivel.'):`Necesitas ${PASS} aciertos. Repasa la lección y vuelve a intentarlo; las preguntas cambian.`}</p></div></div>
      <div class="row">${pass&&!last?`<button class="btn" type="button" id="next">Ir al nivel ${i+2}</button>`:''}
       ${pass&&last?`<button class="btn" type="button" id="exams">Ir a los exámenes</button>`:''}
       ${!pass?`<button class="btn" type="button" id="relearn">Repasar la lección</button>`:''}
       <button class="btn ghost" type="button" id="again">Otra prueba</button></div></div>`;
    $('#again').onclick=()=>go(viewLevel,mod,i,'quiz');
    $('#next')&&($('#next').onclick=()=>go(viewLevel,mod,i+1,'learn'));
    $('#relearn')&&($('#relearn').onclick=()=>go(viewLevel,mod,i,'learn'));
    $('#exams')&&($('#exams').onclick=()=>go(viewModule,mod))})}

// «Repasar lo que fallé»: preguntas nuevas de los mismos tipos que el alumno falló; con dos aciertos seguidos se curan.
export function viewReview(mod){track(viewReview,[mod]);setCrumb(`${mod.name} · Repaso`);
  const picks=shuffle(pendingMisses(mod.id)).filter(([,li,gi])=>mod.levels[li]&&mod.levels[li].gens[gi]).slice(0,REVIEW_N);
  app.innerHTML=`<div class="stack"><div><p class="eyebrow">${mod.name}</p><h1>Repasar lo que fallé</h1></div><div id="pane"></div></div>`;
  const pane=$('#pane');
  if(!picks.length){pane.innerHTML=`<div class="card stack"><p>¡No tienes nada pendiente de repasar en este módulo!</p><div class="row"><button class="btn" type="button" id="back">Volver al módulo</button></div></div>`;$('#back').onclick=()=>go(viewModule,mod);return}
  const qs=picks.map(([,li,gi])=>{const q=mod.levels[li].gens[gi]();q.gi=gi;q.li=li;return q});
  runQuiz(pane,qs,qs=>{qs.forEach(q=>recordResult(mod.id,q.li,q.gi,q.ok));save();
    const ok=qs.filter(q=>q.ok).length,left=pendingMisses(mod.id).length;
    pane.innerHTML=`<div class="card stack pop"><div class="row" data-s="gap:18px"><span class="score">${ok}/${qs.length}</span><div data-s="flex:1;min-width:200px"><h2>${ok===qs.length?'¡Muy bien!':'Sigue practicando'}</h2>
      <p class="muted">${left?`Te quedan ${left} tipo${left===1?'':'s'} de pregunta por repasar. Con ${CURE} aciertos seguidos de cada uno, quedan superados.`:'Has repasado todo lo que tenías pendiente.'}</p></div></div>
      <div class="row">${left?`<button class="btn" type="button" id="again">Seguir repasando</button>`:''}<button class="btn ${left?'ghost':''}" type="button" id="back">Volver al módulo</button></div></div>`;
    $('#again')&&($('#again').onclick=()=>go(viewReview,mod));$('#back').onclick=()=>go(viewModule,mod)})}

