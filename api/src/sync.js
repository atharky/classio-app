/* ---------- sincronización por código: lógica sin dependencias de Azure ---------- */
import { createHash, randomInt } from 'node:crypto';

// Sin 0/O, 1/I/L ni U para que el código se pueda dictar y copiar sin confusiones.
export const ALPHABET='23456789ABCDEFGHJKMNPQRSTVWXYZ';
export const CODE_LEN=10; // 30^10 ≈ 2^49 combinaciones
export const MAX_BODY=32*1024;
const MAX_MODS=50,MAX_LEVELS=50,MAX_EXAMS=10,RETRIES=5;
const ID=/^[a-z0-9-]{1,40}$/;
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;

export function newCode(){let s='';for(let i=0;i<CODE_LEN;i++)s+=ALPHABET[randomInt(ALPHABET.length)];return s.slice(0,5)+'-'+s.slice(5)}
export function normalizeCode(raw){if(typeof raw!=='string')return null;const s=raw.toUpperCase().replace(/[\s-]/g,'');
  if(s.length!==CODE_LEN||[...s].some(c=>!ALPHABET.includes(c)))return null;return s.slice(0,5)+'-'+s.slice(5)}
// Se guarda el hash, no el código: quien lea la tabla no puede usar los códigos.
export const codeId=code=>createHash('sha256').update(code).digest('hex');

// Solo se sincroniza el progreso (niveles y notas). El modo profesor (open) es de cada dispositivo.
export function sanitizeState(raw){
  const out={mods:{},exams:{}};
  if(!raw||typeof raw!=='object')return out;
  if(raw.mods&&typeof raw.mods==='object')for(const [id,m] of Object.entries(raw.mods).slice(0,MAX_MODS)){
    if(!ID.test(id)||!m||typeof m!=='object')continue;
    const best={};if(m.best&&typeof m.best==='object')for(const [k,v] of Object.entries(m.best))if(/^\d{1,2}$/.test(k)&&+k<MAX_LEVELS&&int(v,0,100))best[+k]=v;
    out.mods[id]={unlocked:int(m.unlocked,1,MAX_LEVELS)?m.unlocked:1,best}}
  if(raw.exams&&typeof raw.exams==='object')for(const [key,list] of Object.entries(raw.exams).slice(0,MAX_MODS*5)){
    const parts=key.split(':');if(parts.length!==2||!parts.every(p=>ID.test(p))||!Array.isArray(list))continue;
    const items=list.filter(x=>x&&typeof x.g==='number'&&x.g>=0&&x.g<=10&&int(x.d,0,8.64e15)).map(x=>({g:x.g,d:x.d}));
    if(items.length)out.exams[key]=items.slice(-MAX_EXAMS)}
  return out}

// Unión sin pérdidas: lo mejor de cada nivel, el desbloqueo más alto y todas las notas (últimas 10).
export function mergeState(a,b){
  const out={mods:{},exams:{}},blank={unlocked:1,best:{}};
  for(const id of new Set([...Object.keys(a.mods),...Object.keys(b.mods)])){
    const x=a.mods[id]||blank,y=b.mods[id]||blank,best={...x.best};
    for(const [k,v] of Object.entries(y.best))best[k]=Math.max(best[k]??0,v);
    out.mods[id]={unlocked:Math.max(x.unlocked,y.unlocked),best}}
  for(const key of new Set([...Object.keys(a.exams),...Object.keys(b.exams)])){
    const seen=new Map();for(const e of [...(a.exams[key]||[]),...(b.exams[key]||[])])seen.set(`${e.d}:${e.g}`,e);
    out.exams[key]=[...seen.values()].sort((p,q)=>p.d-q.d).slice(-MAX_EXAMS)}
  return out}

const fail=(status,error)=>({status,jsonBody:{error}});
const parse=text=>{if(typeof text!=='string'||text.length>MAX_BODY)return null;try{const b=JSON.parse(text);return b&&typeof b==='object'?b:null}catch{return null}};

/* store: get(id)→{state,etag}|null · create(id,state)→false si ya existe · update(id,state,etag)→false si hubo otra escritura */
export function createSync(store){
  return {
    async create(text){const body=parse(text);if(!body)return fail(400,'invalid_body');const state=sanitizeState(body.state);
      for(let i=0;i<RETRIES;i++){const code=newCode();if(await store.create(codeId(code),state))return {status:201,jsonBody:{code,state}}}
      return fail(503,'server')},
    async sync(text){const body=parse(text);if(!body)return fail(400,'invalid_body');
      const code=normalizeCode(body.code);if(!code)return fail(400,'invalid_code');
      const id=codeId(code),local=sanitizeState(body.state);
      for(let i=0;i<RETRIES;i++){const cur=await store.get(id);if(!cur)return fail(404,'unknown_code');
        const merged=mergeState(cur.state,local);
        if(JSON.stringify(merged)===JSON.stringify(cur.state)||await store.update(id,merged,cur.etag))return {status:200,jsonBody:{code,state:merged}}}
      return fail(409,'conflict')}
  }}
