/* ---------- Azure Functions: POST /api/sync/new y POST /api/sync ---------- */
import { app } from '@azure/functions';
import { createSync } from '../sync.js';
import { tableStore, tableCounters } from '../table-store.js';
import { createLimiter, clientId } from '../rate-limit.js';

let sync=null;
const service=()=>sync??=createSync(tableStore(process.env.SYNC_STORAGE_CONNECTION));
let limiter=null;
const limits=()=>limiter??=createLimiter(tableCounters(process.env.SYNC_STORAGE_CONNECTION));
const headers={'Cache-Control':'no-store'};
// El código va en el cuerpo y no en la URL para que no quede en los registros de acceso.
const handle=(pick,kind)=>async(request,context)=>{
  try{
    const id=clientId(request.headers);
    // Un fallo del contador no debe dejar sin servicio: se registra y se deja pasar.
    const ok=await limits().allow('general',id).then(a=>!kind||!a?a:limits().allow(kind,id)).catch(e=>{context.warn('limitador',e.message);return true});
    if(!ok){context.warn('límite de peticiones superado');return {status:429,headers:{...headers,'Retry-After':'60'},jsonBody:{error:'rate_limited'}}}
    return {...await pick(service())(await request.text()),headers}}
  catch(e){context.error(e);return {status:500,headers,jsonBody:{error:'server'}}}};

app.http('syncCreate',{methods:['POST'],authLevel:'anonymous',route:'sync/new',handler:handle(s=>s.create,'create')});
app.http('syncDelete',{methods:['POST'],authLevel:'anonymous',route:'sync/delete',handler:handle(s=>s.remove)});
app.http('sync',{methods:['POST'],authLevel:'anonymous',route:'sync',handler:handle(s=>s.sync)});
