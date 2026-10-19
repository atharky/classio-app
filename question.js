import { fmt, parseNum } from './data.js';
import { TYPES } from './qtypes.js';

/* ---------- pregunta ---------- */
export function qBody(q){
  if(TYPES[q.type])return TYPES[q.type].body(q);
  if(q.type==='mc')return `<div class="opts">${q.options.map((o,k)=>`<button type="button" class="opt" data-k="${k}" aria-pressed="false">${o}</button>`).join('')}</div>`;
  return `<div class="numin"><button type="button" class="pm" aria-label="Cambiar signo">±</button><input id="ans" type="text" inputmode="text" autocomplete="off" aria-label="Tu respuesta" placeholder="?"></div>${q.hint?`<p class="hint">${q.hint}</p>`:''}`}
export function wireQ(root,q,onChange){
  if(TYPES[q.type])return TYPES[q.type].wire(root,q,onChange);
  if(q.type==='mc'){root.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(b.disabled)return;root.querySelectorAll('.opt').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');q.sel=+b.dataset.k;onChange&&onChange()})}
  else{const inp=root.querySelector('#ans');if(q.raw!==undefined)inp.value=q.raw;
    root.querySelector('.pm').onclick=()=>{const v=inp.value.trim();inp.value=v.startsWith('-')||v.startsWith('−')?v.replace(/^[-−]/,''):'−'+v;inp.focus();q.raw=inp.value;onChange&&onChange()};
    inp.oninput=()=>{q.raw=inp.value;onChange&&onChange()}}
  if(q.type==='mc'&&q.sel!==undefined){const b=root.querySelector(`.opt[data-k="${q.sel}"]`);b&&b.setAttribute('aria-pressed','true')}}
export const answered=q=>TYPES[q.type]?TYPES[q.type].answered(q):q.type==='mc'?q.sel!==undefined:(q.raw!==undefined&&parseNum(q.raw)!==null);
export const isRight=q=>TYPES[q.type]?TYPES[q.type].isRight(q):q.type==='mc'?q.sel===q.answer:parseNum(q.raw)===q.answer;
export const rightText=q=>TYPES[q.type]?TYPES[q.type].rightText(q):q.type==='mc'?q.options[q.answer]:fmt(q.answer);
export const userText=q=>TYPES[q.type]?TYPES[q.type].userText(q):q.type==='mc'?(q.sel!==undefined?q.options[q.sel]:'(sin responder)'):(q.raw&&q.raw.trim()?q.raw:'(sin responder)');
export const PRAISE=['¡Correcto!','¡Muy bien!','¡Exacto!','¡Eso es!'];
export function lockQ(qb,q,ok){
  if(TYPES[q.type])return TYPES[q.type].lock(qb,q,ok);
  if(q.type==='mc')qb.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const k=+b.dataset.k;if(k===q.answer)b.classList.add('right');else if(k===q.sel)b.classList.add('wrong')});
  else{const inp=qb.querySelector('#ans');inp.disabled=true;inp.classList.add(ok?'right':'wrong');qb.querySelector('.pm').disabled=true}}

// Vuelve a dejar la pregunta sin contestar (segundo intento en el reproductor de relatos).
export function resetQ(qb,q){if(TYPES[q.type])return TYPES[q.type].reset(qb,q);if(q.type==='mc'){q.sel=undefined;qb.querySelectorAll('.opt').forEach(b=>b.setAttribute('aria-pressed','false'))}}
