// Phase 33 ticket 2: who is In progress and who is Paused on the Programs page, and in what order.
const test = require('node:test');
const assert = require('node:assert/strict');
const { startedRows, ROW } = require('../app/programs.js');

const P = (id) => ({ id, name: id });
const INFO = {
  fresh: { count: 0, dayCount: 60, pausedAt: null, lastTime: null },
  early: { count: 2, dayCount: 60, pausedAt: null, lastTime: '2026-10-01' },
  recent: { count: 10, dayCount: 60, pausedAt: null, lastTime: '2026-10-12' },
  finished: { count: 30, dayCount: 30, pausedAt: null, lastTime: '2026-10-13' },
  pausedOld: { count: 5, dayCount: 60, pausedAt: '2026-10-02', lastTime: '2026-10-02' },
  pausedNew: { count: 0, dayCount: 60, pausedAt: '2026-10-10', lastTime: null },
  pausedDone: { count: 60, dayCount: 60, pausedAt: '2026-10-05', lastTime: '2026-10-04' },
};
const ids = (l) => l.map((p) => p.id);

test('In progress: a day done this round, not finished, not paused; the most recently trained first', () => {
  const r = startedRows(Object.keys(INFO).map(P), (p) => INFO[p.id]);
  assert.deepEqual(ids(r.inProgress), ['recent', 'early']);
});

test('Paused: every paused program, done or not, the most recently paused first', () => {
  const r = startedRows(Object.keys(INFO).map(P), (p) => INFO[p.id]);
  assert.deepEqual(ids(r.paused), ['pausedNew', 'pausedDone', 'pausedOld']);
});

test('nothing started: both rows empty; a row shows three cards before Show all', () => {
  assert.deepEqual(startedRows([P('fresh')], (p) => INFO[p.id]), { inProgress: [], paused: [] });
  assert.equal(ROW, 3);
});
