/* ---------- limitación de peticiones por IP ----------
   Cuenta peticiones por ventana fija. No se guarda la IP, solo un hash con sal diaria, y las ventanas viejas se borran. */
import { createHash } from 'node:crypto';

export const LIMITS = { general: { max: 60, windowMs: 60_000 }, create: { max: 10, windowMs: 3_600_000 } };

export const clientId = (headers, salt = new Date().toISOString().slice(0, 10)) => {
  const raw = (headers.get?.('x-forwarded-for') ?? headers['x-forwarded-for'] ?? '').split(',')[0].trim().replace(/:\d+$/, '') || 'desconocida';
  return createHash('sha256').update(`${salt}|${raw}`).digest('hex').slice(0, 32);
};

/* counters: hit(partition,key)→cantidad tras sumar esta petición · prune(prefix,keepFrom)→borra particiones anteriores */
export function createLimiter(counters, { now = Date.now, limits = LIMITS } = {}) {
  return {
    /** true si la petición puede seguir; false si se pasó del límite. */
    async allow(kind, id) {
      const { max, windowMs } = limits[kind];
      const bucket = Math.floor(now() / windowMs);
      const n = await counters.hit(`${kind}-${bucket}`, id);
      if (n === 1) counters.prune(kind, bucket - 1).catch(() => {}); // limpieza oportunista de ventanas viejas
      return n <= max;
    },
  };
}

export function memoryCounters() {
  const rows = new Map();
  return {
    rows,
    async hit(partition, key) {
      const k = `${partition}|${key}`;
      rows.set(k, (rows.get(k) ?? 0) + 1);
      return rows.get(k);
    },
    async prune(kind, keepFrom) {
      for (const k of [...rows.keys()]) {
        const [p] = k.split('|');
        const [kk, b] = [p.slice(0, p.lastIndexOf('-')), Number(p.slice(p.lastIndexOf('-') + 1))];
        if (kk === kind && b < keepFrom) rows.delete(k);
      }
    },
  };
}
