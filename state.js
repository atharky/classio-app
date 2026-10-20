import { dayKey } from './progress.js';
import { scheduleSync } from './net.js';

/* ---------- progreso ---------- */
export const KEY='mates1eso.v1';
export const STATE_VERSION=4;
export const emptyState=()=>({v:STATE_VERSION,mods:{},exams:{},misses:{},days:[],open:false});
export function migrateState(raw){
  if(!raw||typeof raw!=='object')return emptyState();
  if(raw.v>=1&&raw.v<STATE_VERSION)return {v:STATE_VERSION,mods:raw.mods&&typeof raw.mods==='object'?raw.mods:{},exams:raw.exams&&typeof raw.exams==='object'?raw.exams:{},misses:raw.misses&&typeof raw.misses==='object'?raw.misses:{},days:Array.isArray(raw.days)?raw.days:[],open:Boolean(raw.open)};
  if(raw.v===STATE_VERSION)return {...emptyState(),...raw};
  return emptyState();
}
export const ui={warning:'',view:{fn:null,args:[]},timerId:null};
export const S=(()=>{try{return migrateState(JSON.parse(localStorage.getItem(KEY)))}catch(e){ui.warning='No se pudo leer el progreso guardado.';return emptyState()}})();
export const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));ui.warning='';return true}catch(e){ui.warning='No se pudo guardar el progreso en este navegador.';return false}};
// Apunta el día de hoy como día con actividad (para la racha del panel de progreso).
export function touchDay(){const k=dayKey();if(!S.days)S.days=[];if(S.days[S.days.length-1]!==k&&!S.days.includes(k)){S.days.push(k);S.days.sort();S.days=S.days.slice(-90)}}
export const save=()=>{touchDay();const ok=persist();scheduleSync();return ok};
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
