/* ---------- almacén en Azure Table Storage ---------- */
import { TableClient } from '@azure/data-tables';

const PK='sync';

/* Contadores para la limitación de peticiones (tabla aparte, una partición por ventana). */
export function tableCounters(connectionString,table='limites'){
  const local=/UseDevelopmentStorage=true|DefaultEndpointsProtocol=http;/i.test(connectionString);
  const client=TableClient.fromConnectionString(connectionString,table,{allowInsecureConnection:local});
  let ready=null;
  const init=()=>ready??=client.createTable().catch(e=>{ready=null;throw e});
  return {
    async hit(partition,key){await init();
      for(let i=0;i<6;i++){
        try{const e=await client.getEntity(partition,key);const n=Number(e.n)+1;await client.updateEntity({partitionKey:partition,rowKey:key,n},'Replace',{etag:e.etag});return n}
        catch(e){if(e.statusCode===404){try{await client.createEntity({partitionKey:partition,rowKey:key,n:1});return 1}catch(c){if(c.statusCode!==409)throw c}}
          else if(e.statusCode!==412)throw e}}
      return Infinity}, // demasiada contención: se trata como exceso
    async prune(kind,keepFrom){await init();
      for await(const e of client.listEntities({queryOptions:{filter:`PartitionKey ge '${kind}-' and PartitionKey lt '${kind}.'`,select:['PartitionKey','RowKey']}})){
        const b=Number(e.partitionKey.slice(kind.length+1));if(b<keepFrom)await client.deleteEntity(e.partitionKey,e.rowKey).catch(()=>{})}}
  }}

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
    async remove(id){await init();
      try{await client.deleteEntity(PK,id);return true}
      catch(e){if(e.statusCode===404)return false;throw e}},
    async update(id,state,etag){await init();
      try{await client.updateEntity(entity(id,state),'Replace',{etag});return true}
      catch(e){if(e.statusCode===412)return false;throw e}}
  }}
