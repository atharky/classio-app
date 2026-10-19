import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, streak, lastWeek, toCsv, dayKey } from '../progress.js';
import { MODULES, SUBJECTS } from '../catalog.js';

const state = {
  mods: { potencias: { unlocked: 4, best: { 0: 5, 1: 4, 2: 3 } }, laboratorio: { unlocked: 2, best: { 0: 4 } } },
  exams: { 'potencias:p1': [{ g: 6, d: 1 }, { g: 8.5, d: 2 }] },
  misses: { 'potencias:1:0': { d: 5, ok: 0 }, 'potencias:1:1': { d: 5, ok: 2 }, 'laboratorio:0:3': { d: 5, ok: 1 } },
};

test('summarize cuenta niveles superados, notas y repasos pendientes', () => {
  const sum = summarize(state, MODULES, SUBJECTS);
  const pot = sum.subjects.flatMap((s) => s.mods).find((m) => m.id === 'potencias');
  assert.equal(pot.passed, 2, 'solo los niveles con 4 o más aciertos');
  assert.equal(pot.levels[2].best, 3);
  assert.equal(pot.exams.find((e) => e.name.includes('parcial A')).best, 8.5);
  assert.equal(pot.pending, 1, 'un tipo curado no cuenta');
  assert.equal(sum.pending, 2);
  assert.equal(sum.passed, 3);
  assert.equal(sum.total, sum.subjects.reduce((a, s) => a + s.total, 0));
  assert.ok(sum.subjects.every((s) => s.total > 0), 'no salen materias vacías');
});

test('summarize funciona con un estado vacío', () => {
  const sum = summarize({ mods: {}, exams: {} }, MODULES, SUBJECTS);
  assert.equal(sum.passed, 0);
  assert.equal(sum.pending, 0);
});

test('streak cuenta días seguidos y tolera que hoy aún no haya actividad', () => {
  assert.equal(streak(['2026-10-17', '2026-10-18', '2026-10-19'], '2026-10-19'), 3);
  assert.equal(streak(['2026-10-17', '2026-10-18'], '2026-10-19'), 2, 'sin hoy, cuenta hasta ayer');
  assert.equal(streak(['2026-10-15', '2026-10-18'], '2026-10-19'), 1);
  assert.equal(streak(['2026-10-10'], '2026-10-19'), 0);
  assert.equal(streak([], '2026-10-19'), 0);
  assert.equal(streak(['2026-02-28', '2026-03-01'], '2026-03-01'), 2, 'cruza el fin de mes');
});

test('lastWeek da siete días terminando hoy', () => {
  const w = lastWeek(['2026-10-19', '2026-10-15'], '2026-10-19');
  assert.equal(w.length, 7);
  assert.equal(w[6].day, '2026-10-19');
  assert.equal(w[0].day, '2026-10-13');
  assert.deepEqual(w.filter((d) => d.active).map((d) => d.day), ['2026-10-15', '2026-10-19']);
  assert.match(dayKey(new Date(2026, 0, 5)), /^2026-01-05$/);
});

test('el informe CSV escapa comillas y usa coma decimal', () => {
  const sum = summarize(state, MODULES, SUBJECTS);
  const csv = toCsv(sum);
  assert.ok(csv.startsWith('﻿"materia";"módulo";"tipo";"nombre";"mejor nota";"intentos"'));
  assert.match(csv, /"examen";"Examen parcial A";"8,5";"2"/);
  assert.match(csv, /"nivel";"1\. ¿Qué es una potencia\?";"5\/5"/);
  assert.ok(csv.split('\r\n').length > 20);
});
