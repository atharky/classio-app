/* ---------- Azure Functions: POST /api/sync/new y POST /api/sync ---------- */
import { app } from '@azure/functions';
import { createSync } from '../sync.js';
import { tableStore } from '../table-store.js';

let sync=null;
const service=()=>sync??=createSync(tableStore(process.env.SYNC_STORAGE_CONNECTION));
const headers={'Cache-Control':'no-store'};
// El código va en el cuerpo y no en la URL para que no quede en los registros de acceso.
const handle=pick=>async(request,context)=>{
  try{return {...await pick(service())(await request.text()),headers}}
  catch(e){context.error(e);return {status:500,headers,jsonBody:{error:'server'}}}};

app.http('syncCreate',{methods:['POST'],authLevel:'anonymous',route:'sync/new',handler:handle(s=>s.create)});
app.http('sync',{methods:['POST'],authLevel:'anonymous',route:'sync',handler:handle(s=>s.sync)});
