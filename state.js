import { scheduleSync } from './net.js';

/* ---------- progreso ---------- */
export const KEY='mates1eso.v1';
export const STATE_VERSION=3;
export const emptyState=()=>({v:STATE_VERSION,mods:{},exams:{},misses:{},open:false});
export function migrateState(raw){
  if(!raw||typeof raw!=='object')return emptyState();
  if(raw.v===1||raw.v===2)return {v:STATE_VERSION,mods:raw.mods&&typeof raw.mods==='object'?raw.mods:{},exams:raw.exams&&typeof raw.exams==='object'?raw.exams:{},misses:{},open:Boolean(raw.open)};
  if(raw.v===STATE_VERSION)return {...emptyState(),...raw};
  return emptyState();
}
export const ui={warning:'',view:{fn:null,args:[]},timerId:null};
export const S=(()=>{try{return migrateState(JSON.parse(localStorage.getItem(KEY)))}catch(e){ui.warning='No se pudo leer el progreso guardado.';return emptyState()}})();
export const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));ui.warning='';return true}catch(e){ui.warning='No se pudo guardar el progreso en este navegador.';return false}};
export const save=()=>{const ok=persist();scheduleSync();return ok};
export const mp=id=>S.mods[id]||(S.mods[id]={unlocked:1,best:{}});
export const isOpen=(mod,i)=>S.open||i<mp(mod.id).unlocked;
export const QUIZ_N=5,PASS=4;

/* ---------- repaso de fallos ---------- */
// «módulo:nivel:generador» → {d: último fallo, ok: aciertos seguidos desde entonces}; con CURE aciertos queda curado.
export const CURE=2,REVIEW_N=8;
export const missKey=(modId,li,gi)=>`${modId}:${li}:${gi}`;
export function recordResult(modId,li,gi,ok){if(gi===undefined)return;const key=missKey(modId,li,gi),m=S.misses[key];
  if(!ok)S.misses[key]={d:Date.now(),ok:0};
  else if(m&&m.ok<CURE)m.ok++}
export const pendingMisses=modId=>Object.entries(S.misses).filter(([k,m])=>k.startsWith(modId+':')&&m.ok<CURE).map(([k])=>k.split(':').map((x,n)=>n?+x:x));


export function replaceState(next){for(const k of Object.keys(S))delete S[k];Object.assign(S,next)}
