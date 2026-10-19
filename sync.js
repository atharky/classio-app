/* ---------- sincronización entre dispositivos (cliente) ---------- */
const LINK_KEY='mates1eso.sync';
const ALPHABET='23456789ABCDEFGHJKMNPQRSTVWXYZ';

function loadLink(){try{const l=JSON.parse(localStorage.getItem(LINK_KEY));return l&&normalizeCode(l.code)===l.code?l:null}catch(e){return null}}
function saveLink(l){try{l?localStorage.setItem(LINK_KEY,JSON.stringify(l)):localStorage.removeItem(LINK_KEY)}catch(e){}}
function normalizeCode(raw){const s=String(raw??'').toUpperCase().replace(/[\s-]/g,'');
  if(s.length!==10||[...s].some(c=>!ALPHABET.includes(c)))return null;return s.slice(0,5)+'-'+s.slice(5)}

class SyncError extends Error{constructor(kind){super(kind);this.kind=kind}}
async function call(path,body){let r,data=null;
  try{r=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}catch(e){throw new SyncError('offline')}
  try{data=await r.json()}catch(e){}
  if(!r.ok)throw new SyncError(data&&typeof data.error==='string'?data.error:'server');
  return data}
// Solo viaja el progreso; el modo profesor se queda en cada dispositivo.
const payload=S=>({mods:S.mods,exams:S.exams,misses:S.misses||{}});
const createCode=S=>call('sync/new',{state:payload(S)});
const deleteCode=code=>call('sync/delete',{code});
const pushState=(code,S)=>call('sync',{code,state:payload(S)});

const MESSAGES={
  offline:'No hay conexión con el servidor. Tu progreso sigue guardado en este navegador.',
  unknown_code:'Ese código no existe. Revisa que esté bien escrito.',
  invalid_code:'El código no es válido: son 10 letras y números.',
  conflict:'Otro dispositivo estaba guardando a la vez. Vuelve a intentarlo.'};
const syncMessage=e=>MESSAGES[e&&e.kind]||'El servidor de sincronización no está disponible ahora. Inténtalo más tarde.';

export { loadLink, saveLink, normalizeCode, createCode, pushState, deleteCode, syncMessage };
