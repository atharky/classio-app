import { ANIMS } from '../catalog.js';
import { $ } from '../data.js';
import { animPlayer } from '../player.js';
import { levelQuiz } from '../quiz.js';
import { PASS, QUIZ_N } from '../state.js';
import { app, go, setCrumb, track } from '../ui.js';
import { viewModule } from './module.js';

// Tarjeta «En la vida real» del resumen escrito: el paso del relato, ya terminado y sin animación.
export function realCard(steps){const s=steps&&steps.find(x=>/class="real-tag"/.test(x.show||''));
  return s?`<section class="card realcard"><div class="anim"><div class="stage static"><div class="fc">${s.show}</div></div></div><p>${s.say}</p></section>`:''}
export function viewLevel(mod,i,tab){track(viewLevel,[mod,i,tab]);const lv=mod.levels[i];setCrumb(`${mod.name} · Nivel ${i+1}`);
  app.innerHTML=`<div class="stack">
   <div><button class="link" type="button" id="back">← Todos los niveles</button><p class="eyebrow" data-s="margin-top:10px">Nivel ${i+1} de ${mod.levels.length}</p><h1>${lv.title}</h1></div>
   <div class="tabs" role="tablist" aria-label="Partes del nivel"><button class="tab" role="tab" type="button" id="t-learn" aria-controls="pane" tabindex="${tab==='learn'?0:-1}" aria-selected="${tab==='learn'}">1 · Aprende</button><button class="tab" role="tab" type="button" id="t-quiz" aria-controls="pane" tabindex="${tab==='quiz'?0:-1}" aria-selected="${tab==='quiz'}">2 · Prueba del nivel</button></div>
   <div id="pane" role="tabpanel" aria-labelledby="t-${tab==='learn'?'learn':'quiz'}"></div></div>`;
  $('#back').onclick=()=>go(viewModule,mod);
  $('#t-learn').onclick=()=>go(viewLevel,mod,i,'learn');
  $('#t-quiz').onclick=()=>go(viewLevel,mod,i,'quiz');
  // Pestañas con teclado: flechas, Inicio y Fin cambian de pestaña.
  app.querySelector('[role=tablist]').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
    const to=e.key==='Home'||e.key==='ArrowLeft'&&tab==='quiz'?'learn':e.key==='End'||e.key==='ArrowRight'&&tab==='learn'?'quiz':tab;
    if(to!==tab){go(viewLevel,mod,i,to);requestAnimationFrame(()=>requestAnimationFrame(()=>$('#t-'+to).focus()))}};
  const pane=$('#pane');
  if(tab==='learn'){
    pane.innerHTML=`<div class="stack lesson"><div id="anim"></div>${ANIMS[mod.id]?.[i]?'<h2>Resumen escrito</h2>':''}${lv.lesson.map(([t,h])=>`<section class="card"><h3>${t}</h3>${h}</section>`).join('')}${realCard(ANIMS[mod.id]?.[i])}
     <div class="card row" data-s="justify-content:space-between"><span>¿Lo tienes? Responde ${QUIZ_N} preguntas. Con ${PASS} bien ${i+1<mod.levels.length?'desbloqueas el siguiente nivel':'completas el módulo'}.</span><button class="btn" type="button" id="go-quiz">Hacer la prueba</button></div></div>`;
    $('#go-quiz').onclick=()=>go(viewLevel,mod,i,'quiz');
    const steps=ANIMS[mod.id]?.[i];if(steps)animPlayer($('#anim'),steps)}
  else levelQuiz(pane,mod,i)}

