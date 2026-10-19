import test from 'node:test';
import assert from 'node:assert/strict';
import { createSync, newCode, normalizeCode, codeId, sanitizeState, mergeState, ALPHABET, MAX_BODY } from '../src/sync.js';
import { memoryStore } from '../src/memory-store.js';

const CODE=new RegExp(`^[${ALPHABET}]{5}-[${ALPHABET}]{5}$`);
const progress=(best,unlocked,exams={})=>({mods:{potencias:{unlocked,best}},exams,open:true});
const body=o=>JSON.stringify(o);

test('newCode genera códigos legibles y distintos', () => {
  const codes=new Set(Array.from({length:2000},newCode));
  assert.equal(codes.size,2000);
  for(const c of codes)assert.match(c,CODE);
});

test('normalizeCode acepta minúsculas, espacios y sin guion, y rechaza lo demás', () => {
  assert.equal(normalizeCode(' abcde fghjk '),'ABCDE-FGHJK');
  assert.equal(normalizeCode('ABCDEFGHJK'),'ABCDE-FGHJK');
  for(const bad of ['ABCDE-FGHJ','ABCDE-FGHJKM','ABCDE-FGHI0','',null,42])assert.equal(normalizeCode(bad),null);
});

test('codeId es estable y no contiene el código', () => {
  assert.equal(codeId('ABCDE-FGHJK'),codeId('ABCDE-FGHJK'));
  assert.match(codeId('ABCDE-FGHJK'),/^[0-9a-f]{64}$/);
});

test('sanitizeState conserva el progreso y descarta el resto', () => {
  const s=sanitizeState({v:2,open:true,extra:'x',
    mods:{potencias:{unlocked:3,best:{0:5,1:4,foo:3,2:-1,3:1.5}},'MAL ID':{unlocked:2,best:{}},raices:{unlocked:'9',best:null}},
    exams:{'potencias:p1':[{g:7.5,d:1},{g:11,d:2},{g:5,d:'x'},null],'potencias':[{g:5,d:1}],'a:b:c':[{g:5,d:1}],'raices:r1':[]}});
  assert.deepEqual(s,{mods:{potencias:{unlocked:3,best:{0:5,1:4}},raices:{unlocked:1,best:{}}},exams:{'potencias:p1':[{g:7.5,d:1}]},misses:{}});
  assert.deepEqual(sanitizeState(null),{mods:{},exams:{},misses:{}});
});

test('mergeState se queda con lo mejor de los dos lados', () => {
  const a=sanitizeState(progress({0:5,1:2},2,{'potencias:p1':[{g:6,d:1},{g:7,d:3}]}));
  const b=sanitizeState({mods:{potencias:{unlocked:4,best:{1:4,2:5}},raices:{unlocked:2,best:{0:4}}},exams:{'potencias:p1':[{g:6,d:1},{g:9,d:2}],'potencias:pf':[{g:8,d:5}]}});
  assert.deepEqual(mergeState(a,b),{
    mods:{potencias:{unlocked:4,best:{0:5,1:4,2:5}},raices:{unlocked:2,best:{0:4}}},
    exams:{'potencias:p1':[{g:6,d:1},{g:9,d:2},{g:7,d:3}],'potencias:pf':[{g:8,d:5}]},misses:{}});
});

test('mergeState guarda solo las 10 últimas notas de cada examen', () => {
  const list=n=>Array.from({length:n},(_,i)=>({g:5,d:i}));
  const m=mergeState({mods:{},exams:{'potencias:p1':list(8)}},{mods:{},exams:{'potencias:p1':list(14)}});
  assert.equal(m.exams['potencias:p1'].length,10);
  assert.equal(m.exams['potencias:p1'][0].d,4);
});

test('crear código y sincronizar desde otro dispositivo junta el progreso', async () => {
  const store=memoryStore(),sync=createSync(store);
  const created=await sync.create(body({state:progress({0:5},2)}));
  assert.equal(created.status,201);
  assert.match(created.jsonBody.code,CODE);
  assert.equal(created.jsonBody.state.open,undefined);
  assert.equal(store.rows.size,1);
  assert.ok(!JSON.stringify([...store.rows.keys()]).includes(created.jsonBody.code),'la tabla no guarda el código en claro');

  const other=await sync.sync(body({code:created.jsonBody.code.toLowerCase().replace('-',' '),state:progress({1:4},3)}));
  assert.equal(other.status,200);
  assert.deepEqual(other.jsonBody.state.mods.potencias,{unlocked:3,best:{0:5,1:4}});

  const first=await sync.sync(body({code:created.jsonBody.code,state:progress({0:5},2)}));
  assert.deepEqual(first.jsonBody.state.mods.potencias,{unlocked:3,best:{0:5,1:4}});
});

test('sync responde con errores claros', async () => {
  const sync=createSync(memoryStore());
  assert.deepEqual(await sync.sync(body({code:'ABCDE-FGHJK',state:{}})),{status:404,jsonBody:{error:'unknown_code'}});
  assert.deepEqual(await sync.sync(body({code:'nope',state:{}})),{status:400,jsonBody:{error:'invalid_code'}});
  assert.deepEqual(await sync.sync('{no es json'),{status:400,jsonBody:{error:'invalid_body'}});
  assert.deepEqual(await sync.create('x'.repeat(MAX_BODY+1)),{status:400,jsonBody:{error:'invalid_body'}});
  assert.deepEqual(await sync.create('null'),{status:400,jsonBody:{error:'invalid_body'}});
});

test('sync reintenta si otro dispositivo escribe a la vez', async () => {
  const store=memoryStore(),sync=createSync(store);
  const {jsonBody:{code}}=await sync.create(body({state:progress({0:5},2)}));
  const update=store.update;let raced=false;
  store.update=async(id,state,etag)=>{
    if(!raced){raced=true;const cur=await store.get(id);await update(id,mergeState(cur.state,sanitizeState(progress({2:5},3))),cur.etag)}
    return update(id,state,etag)};
  const r=await sync.sync(body({code,state:progress({1:4},2)}));
  assert.equal(r.status,200);
  assert.deepEqual(r.jsonBody.state.mods.potencias,{unlocked:3,best:{0:5,1:4,2:5}});
});

test('sync no reescribe si no hay nada nuevo', async () => {
  const store=memoryStore(),sync=createSync(store);
  const {jsonBody:{code}}=await sync.create(body({state:progress({0:5},2)}));
  let writes=0;const update=store.update;store.update=(...a)=>{writes++;return update(...a)};
  await sync.sync(body({code,state:progress({0:3},1)}));
  assert.equal(writes,0);
});

test('remove borra el código y después deja de existir', async () => {
  const sync=createSync(memoryStore());
  const {jsonBody:{code}}=await sync.create(body({state:progress({0:5},2)}));
  assert.deepEqual((await sync.remove(body({code}))).jsonBody,{deleted:true});
  assert.equal((await sync.sync(body({code,state:progress({},1)}))).jsonBody.error,'unknown_code');
  assert.equal((await sync.remove(body({code}))).status,404);
});

test('remove valida el cuerpo y el código', async () => {
  const sync=createSync(memoryStore());
  assert.equal((await sync.remove('no es json')).jsonBody.error,'invalid_body');
  assert.equal((await sync.remove(body({code:'abc'}))).jsonBody.error,'invalid_code');
});

test('misses: se validan y se limitan', () => {
  const s=sanitizeState({misses:{'potencias:0:3':{d:5,ok:1},'potencias:0':{d:5,ok:0},'Potencias:0:3':{d:5,ok:0},'raices:1:2':{d:5,ok:3},'raices:2:2':{d:-1,ok:0},'raices:3:2':'x'}});
  assert.deepEqual(s.misses,{'potencias:0:3':{d:5,ok:1}});
  const many=Object.fromEntries(Array.from({length:500},(_,i)=>[`m:${i%50}:${Math.floor(i/50)}`,{d:1,ok:0}]));
  assert.ok(Object.keys(sanitizeState({misses:many}).misses).length<=300);
});

test('mergeState de misses: gana el último fallo y no se deshace una curación', () => {
  const a=sanitizeState({misses:{'p:0:1':{d:10,ok:2},'p:0:2':{d:10,ok:0},'p:0:3':{d:5,ok:2}}});
  const b=sanitizeState({misses:{'p:0:1':{d:10,ok:0},'p:0:2':{d:20,ok:0},'p:0:4':{d:7,ok:1}}});
  assert.deepEqual(mergeState(a,b).misses,{'p:0:1':{d:10,ok:2},'p:0:2':{d:20,ok:0},'p:0:3':{d:5,ok:2},'p:0:4':{d:7,ok:1}});
  assert.deepEqual(mergeState(b,a).misses,mergeState(a,b).misses);
  assert.deepEqual(mergeState({mods:{},exams:{}},{mods:{},exams:{}}).misses,{});
});

test('un cliente antiguo sin misses no borra los de la nube', async () => {
  const sync=createSync(memoryStore());
  const {jsonBody:{code}}=await sync.create(body({state:{...progress({0:5},2),misses:{'potencias:0:1':{d:5,ok:0}}}}));
  const r=await sync.sync(body({code,state:progress({0:5},2)}));
  assert.deepEqual(r.jsonBody.state.misses,{'potencias:0:1':{d:5,ok:0}});
});
