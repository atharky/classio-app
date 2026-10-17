/* ---------- almacén en Azure Table Storage ---------- */
import { TableClient } from '@azure/data-tables';

const PK='sync';

export function tableStore(connectionString,table='progreso'){
  if(!connectionString)throw new Error('Falta la variable de entorno SYNC_STORAGE_CONNECTION.');
  // HTTP solo se permite con el emulador local (Azurite); en Azure la conexión es siempre HTTPS.
  const local=/UseDevelopmentStorage=true|DefaultEndpointsProtocol=http;/i.test(connectionString);
  const client=TableClient.fromConnectionString(connectionString,table,{allowInsecureConnection:local});
  let ready=null;
  const init=()=>ready??=client.createTable().catch(e=>{ready=null;throw e}); // no falla si la tabla ya existe
  const entity=(id,state)=>({partitionKey:PK,rowKey:id,state:JSON.stringify(state)});
  return {
    async get(id){await init();
      try{const e=await client.getEntity(PK,id);return {state:JSON.parse(e.state),etag:e.etag}}
      catch(e){if(e.statusCode===404)return null;throw e}},
    async create(id,state){await init();
      try{await client.createEntity(entity(id,state));return true}
      catch(e){if(e.statusCode===409)return false;throw e}},
    async update(id,state,etag){await init();
      try{await client.updateEntity(entity(id,state),'Replace',{etag});return true}
      catch(e){if(e.statusCode===412)return false;throw e}}
  }}
