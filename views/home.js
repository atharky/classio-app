import { MODULES, SUBJECTS } from '../catalog.js';
import { PASS, mp } from '../state.js';
import { app, go, setCrumb, track } from '../ui.js';
import { viewModule } from './module.js';

export function viewHome(){track(viewHome,[]);setCrumb('');
  app.innerHTML=`<div class="stack">
   <section class="hero"><p class="eyebrow">Aprendizaje guiado · 1º de ESO</p>
    <div class="big" aria-hidden="true">2<sup>5</sup> · Aa · 🔬</div>
    <p class="muted" data-s="max-width:56ch">Elige una materia y un módulo. Cada módulo tiene niveles que se desbloquean al aprobar una prueba corta, y exámenes de prueba para repasar todo.</p></section>
   ${SUBJECTS.map(sub=>`<section class="subject stack" aria-labelledby="sub-${sub.id}"><h2 id="sub-${sub.id}">${sub.name}</h2>
   <div class="mods">${MODULES.filter(m=>m.subject===sub.id).map(m=>{const p=m.soon?null:mp(m.id);const done=p?Math.min(Object.keys(p.best).filter(k=>p.best[k]>=PASS).length,m.levels.length):0;
     return `<button class="mod ${m.soon?'':'on'}" type="button" data-id="${m.id}" ${m.soon?'disabled':''}>
      <span class="sym">${m.sym}</span><h3>${m.name}</h3><span class="muted" data-s="font-size:.92rem">${m.desc}</span>
      ${m.soon?'<span><span class="chip grey">Próximamente</span></span>':`<span class="row" data-s="justify-content:space-between"><span class="chip ${done===m.levels.length?'ok':''}">${done} de ${m.levels.length} niveles</span></span><div class="bar"><i data-s="width:${done/m.levels.length*100}%"></i></div>`}
     </button>`}).join('')}</div></section>`).join('')}</div>`;
  app.querySelectorAll('.mod:not([disabled])').forEach(b=>b.onclick=()=>go(viewModule,MODULES.find(m=>m.id===b.dataset.id)))}

