import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Mantiene al día el control de estado de plans/tareas.md: una fila por tarea, estados válidos,
// contadores correctos y ninguna tarea avanzando con dependencias sin terminar.
const md = readFileSync(new URL('../plans/tareas.md', import.meta.url), 'utf8');
const STATES = { '⬜': 'Pendiente', '🔄': 'En curso', '👀': 'En revisión', '✅': 'Hecha', '⛔': 'Bloqueada', '➖': 'Descartada' };

const section = md.slice(md.indexOf('## Control de estado'), md.indexOf('## Fase 1'));
const rows = section.split('\n').filter(l => /^\| T\d+ /.test(l)).map(l => {
  const c = l.split('|').slice(1, -1).map(x => x.trim());
  const [icon, ...label] = c[6].split(' ');
  return { id: c[0], deps: c[4] === '—' ? [] : c[4].split(',').map(x => x.trim()), icon, label: label.join(' '), pr: c[7], date: c[8] };
});
const details = [...md.matchAll(/^### (T\d+) · .+\n- \*\*Estado:\*\* (\S+) (.+)$/gm)].map(m => ({ id: m[1], icon: m[2], label: m[3] }));

test('plans/tareas.md: cada tarea tiene una fila en el control de estado y una línea de estado en su detalle', () => {
  const heads = [...md.matchAll(/^### (T\d+) · /gm)].map(m => m[1]);
  assert.ok(heads.length >= 20);
  assert.deepEqual(rows.map(r => r.id), heads, 'la tabla debe tener las mismas tareas y en el mismo orden que el detalle');
  assert.deepEqual(details.map(d => d.id), heads, 'cada tarea necesita su línea «Estado» bajo el encabezado');
});

test('plans/tareas.md: los estados son válidos y coinciden entre la tabla y el detalle', () => {
  for (const r of rows) {
    assert.equal(STATES[r.icon], r.label, `${r.id}: estado «${r.icon} ${r.label}» no válido`);
    const d = details.find(x => x.id === r.id);
    assert.equal(`${d.icon} ${d.label}`, `${r.icon} ${r.label}`, `${r.id}: tabla y detalle no coinciden`);
    if (r.icon === '✅') assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(r.date) && /^#\d+$/.test(r.pr), `${r.id}: una tarea hecha lleva PR (#n) y fecha (AAAA-MM-DD)`);
  }
});

test('plans/tareas.md: los contadores de cabecera cuadran con la tabla', () => {
  const n = icon => rows.filter(r => r.icon === icon).length;
  const head = section.match(/\*\*Hechas:\*\* (\d+) de (\d+) · \*\*En curso:\*\* (\d+) · \*\*Pendientes:\*\* (\d+)/);
  assert.ok(head, 'falta la línea de contadores');
  assert.deepEqual(head.slice(1).map(Number), [n('✅'), rows.length, n('🔄') + n('👀'), n('⬜')]);
});

test('plans/tareas.md: ninguna tarea avanza si sus dependencias no están hechas', () => {
  const done = new Set(rows.filter(r => r.icon === '✅' || r.icon === '➖').map(r => r.id));
  for (const r of rows) {
    for (const dep of r.deps) assert.ok(rows.some(x => x.id === dep), `${r.id}: depende de ${dep}, que no existe`);
    if (['🔄', '👀', '✅'].includes(r.icon)) for (const dep of r.deps) assert.ok(done.has(dep), `${r.id} está ${r.label.toLowerCase()} pero depende de ${dep}, que no está hecha`);
  }
});
