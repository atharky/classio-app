/* ---------- almacén en memoria para pruebas y desarrollo local ---------- */
export function memoryStore(){
  const rows=new Map();let n=0;
  return {
    rows,
    async get(id){const r=rows.get(id);return r?{state:structuredClone(r.state),etag:r.etag}:null},
    async create(id,state){if(rows.has(id))return false;rows.set(id,{state:structuredClone(state),etag:String(++n)});return true},
    async update(id,state,etag){const r=rows.get(id);if(!r||r.etag!==etag)return false;rows.set(id,{state:structuredClone(state),etag:String(++n)});return true}
  }}
