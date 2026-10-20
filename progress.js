/* ---------- panel de progreso: cálculos sin interfaz ---------- */
export const PASS_SCORE = 4;

/** Resumen por materia y módulo a partir del estado y el catálogo. */
export function summarize(S, MODULES, SUBJECTS) {
  const mods = MODULES.filter((m) => !m.soon && m.levels).map((m) => {
    const p = S.mods?.[m.id] ?? { best: {} };
    const levels = m.levels.map((lv, i) => ({ title: lv.title, best: p.best?.[i], passed: (p.best?.[i] ?? -1) >= PASS_SCORE }));
    const exams = m.exams.map((ex) => {
      const h = S.exams?.[`${m.id}:${ex.id}`] ?? [];
      return { name: ex.name, tries: h.length, last: h.length ? h[h.length - 1].g : undefined, best: h.length ? Math.max(...h.map((x) => x.g)) : undefined };
    });
    const pending = Object.entries(S.misses ?? {}).filter(([k, v]) => k.startsWith(m.id + ':') && v.ok < 2).length;
    return { id: m.id, name: m.name, subject: m.subject, levels, passed: levels.filter((l) => l.passed).length, exams, pending };
  });
  const subjects = SUBJECTS.map((s) => {
    const ms = mods.filter((m) => m.subject === s.id);
    return { id: s.id, name: s.name, passed: ms.reduce((a, m) => a + m.passed, 0), total: ms.reduce((a, m) => a + m.levels.length, 0), mods: ms };
  }).filter((s) => s.total);
  return { subjects, passed: subjects.reduce((a, s) => a + s.passed, 0), total: subjects.reduce((a, s) => a + s.total, 0), pending: mods.reduce((a, m) => a + m.pending, 0) };
}

export const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const shift = (key, n) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

/** Racha: días seguidos con actividad hasta hoy (si hoy aún no hay actividad, cuenta hasta ayer). */
export function streak(days, today = dayKey()) {
  const set = new Set(days);
  let day = set.has(today) ? today : shift(today, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = shift(day, -1);
  }
  return n;
}

/** Los últimos 7 días, de más antiguo a hoy, con si hubo actividad. */
export const lastWeek = (days, today = dayKey()) => Array.from({ length: 7 }, (_, i) => shift(today, i - 6)).map((k) => ({ day: k, active: days.includes(k) }));

const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
/** Informe en CSV (una fila por nivel y por examen), para abrir en una hoja de cálculo. */
export function toCsv(summary) {
  const rows = [['materia', 'módulo', 'tipo', 'nombre', 'mejor nota', 'intentos']];
  for (const s of summary.subjects)
    for (const m of s.mods) {
      m.levels.forEach((l, i) => rows.push([s.name, m.name, 'nivel', `${i + 1}. ${l.title}`, l.best === undefined ? '' : `${l.best}/5`, '']));
      for (const e of m.exams) rows.push([s.name, m.name, 'examen', e.name, e.best === undefined ? '' : e.best.toFixed(1).replace('.', ','), e.tries]);
    }
  return '﻿' + rows.map((r) => r.map(csv).join(';')).join('\r\n') + '\r\n';
}
