import { $ } from '../data.js';
import { SUBJECTS, MODULES } from '../catalog.js';
import { dayKey, lastWeek, streak, summarize, toCsv } from '../progress.js';
import { S } from '../state.js';
import { app, go, setCrumb, track } from '../ui.js';
import { viewModule } from './module.js';
import { viewReview } from '../quiz.js';

const fmtGrade = (g) => g.toFixed(1).replace('.', ',');
const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export function viewProgress() {
  track(viewProgress, []);
  setCrumb('Mi progreso');
  const sum = summarize(S, MODULES, SUBJECTS);
  const days = S.days ?? [];
  const run = streak(days);
  const week = lastWeek(days);
  const dow = (k) => WEEK[(new Date(k + 'T12:00:00').getDay() + 6) % 7];
  app.innerHTML = `<div class="stack">
   <div><p class="eyebrow">Tu cuaderno</p><h1>Mi progreso</h1></div>
   <section class="card stack"><div class="row" data-s="justify-content:space-between;align-items:center;gap:18px">
     <div><span class="score">${sum.passed}/${sum.total}</span> <span class="muted">niveles superados</span></div>
     <div><b>${run}</b> ${run === 1 ? 'día' : 'días'} seguidos con actividad</div></div>
     <progress class="pbar" max="${sum.total}" value="${sum.passed}" aria-label="Niveles superados: ${sum.passed} de ${sum.total}"></progress>
     <div class="week" role="img" aria-label="Actividad de los últimos siete días: ${week.filter((d) => d.active).length} de 7">${week.map((d) => `<span class="wd ${d.active ? 'on' : ''} ${d.day === dayKey() ? 'today' : ''}"><i></i>${dow(d.day)}</span>`).join('')}</div>
     ${sum.pending ? `<p>Tienes <b>${sum.pending}</b> tipo${sum.pending === 1 ? '' : 's'} de pregunta pendiente${sum.pending === 1 ? '' : 's'} de repasar.</p>` : '<p class="muted">No tienes nada pendiente de repasar.</p>'}
   </section>
   ${sum.subjects
     .map(
       (s) => `<section class="stack"><h2>${s.name} <small class="muted">${s.passed} de ${s.total}</small></h2>
      ${s.mods
        .map(
          (m) => `<div class="card stack" data-s="gap:8px"><div class="row" data-s="justify-content:space-between;gap:10px"><h3>${m.name}</h3><span class="muted">${m.passed} de ${m.levels.length} niveles</span></div>
        <progress class="pbar" max="${m.levels.length}" value="${m.passed}" aria-label="${m.name}: ${m.passed} de ${m.levels.length} niveles"></progress>
        <ol class="plv">${m.levels.map((l, i) => `<li class="${l.passed ? 'ok' : ''}"><span>${i + 1}. ${l.title}</span><b>${l.best === undefined ? '—' : `${l.best}/5`}</b></li>`).join('')}</ol>
        ${m.exams.some((e) => e.tries) ? `<p class="muted">Exámenes: ${m.exams.filter((e) => e.tries).map((e) => `${e.name} · mejor nota <b>${fmtGrade(e.best)}</b> (${e.tries} ${e.tries === 1 ? 'intento' : 'intentos'})`).join(' · ')}</p>` : ''}
        <div class="row"><button class="btn ghost" type="button" data-mod="${m.id}">Ir al módulo</button>${m.pending ? `<button class="btn" type="button" data-review="${m.id}">Repasar lo que fallé (${m.pending})</button>` : ''}</div></div>`,
        )
        .join('')}</section>`,
     )
     .join('')}
   <div class="row"><button class="btn ghost" type="button" id="csv">Descargar informe (CSV)</button></div></div>`;
  app.querySelectorAll('[data-mod]').forEach((b) => (b.onclick = () => go(viewModule, MODULES.find((m) => m.id === b.dataset.mod))));
  app.querySelectorAll('[data-review]').forEach((b) => (b.onclick = () => go(viewReview, MODULES.find((m) => m.id === b.dataset.review))));
  $('#csv').onclick = () => {
    const url = URL.createObjectURL(new Blob([toCsv(sum)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cuaderno-1eso-informe.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
}
