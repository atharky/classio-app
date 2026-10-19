import { $ } from './data.js';
import { S, persist, ui } from './state.js';
import { loadLink, pushState, saveLink, syncMessage } from './sync.js';
import { refresh, renderFoot } from './ui.js';
import { viewSync } from './views/sync.js';

/* ---------- sincronización ---------- */
export const net={link:loadLink(),status:'',timer:null,syncing:false};
export const progressJSON=st=>JSON.stringify({mods:st.mods,exams:st.exams,misses:st.misses||{},days:st.days||[]});
export function setSyncStatus(t){net.status=t;const m=$('#sync-msg');m?m.textContent=t:renderFoot()}
export function scheduleSync(){if(!net.link)return;clearTimeout(net.timer);net.timer=setTimeout(syncNow,2000)}
export async function syncNow(){if(!net.link)return;if(net.syncing){scheduleSync();return}
  clearTimeout(net.timer);net.syncing=true;const code=net.link.code,sent=progressJSON(S);
  try{const r=await pushState(code,S);
    if(!net.link||net.link.code!==code)return;
    net.link.at=Date.now();saveLink(net.link);net.status='';
    // Si hubo progreso nuevo mientras viajaba la petición, no se pisa: se envía en la siguiente.
    if(progressJSON(S)!==sent){scheduleSync();renderFoot();return}
    const changed=progressJSON(r.state)!==sent;
    if(changed){S.mods=r.state.mods;S.exams=r.state.exams;S.misses=r.state.misses||{};S.days=r.state.days||[];persist()}
    if(changed||ui.view.fn===viewSync)refresh();else renderFoot()}
  catch(e){setSyncStatus(syncMessage(e))}
  finally{net.syncing=false}}
