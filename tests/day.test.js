// The Day: a program day as you'll do it (swaps applied), with its live Workout Session and swap actions.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { createSession } = require('../app/session.js');
const { createStore } = require('../app/store.js');
const { createProgramCatalogue, inlined } = require('../app/programs.js');
const { createDays } = require('../app/day.js');
const { buildAll } = require('../program-builder.js');

const real = buildAll().filter((p) => p.id === 'three-split-60');
const setup = () => {
  const m = {};
  const store = createStore({ programIds: ['three-split-60'], storage: { get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } }, now: () => 't' });
  store.load();
  const programs = createProgramCatalogue(inlined(real));
  return { store, days: createDays({ programs, store, cat, createSession }) };
};
const P = 'three-split-60';
const first = (D) => D.day.blocks[0].items[0].ex;
const laterWith = (ex, after) => real[0].days.find((d) => d.day > after && d.blocks.some((b) => b.items.some((it) => it.ex === ex))).day;

test('opening a day gives the program\'s day and its session; unknown days give nothing', () => {
  const { days } = setup();
  const D = days.open(P, 1);
  assert.equal(D.day.day, 1);
  assert.equal(D.program.id, P);
  assert.equal(D.session(), days.open(P, 1).session(), 'the same live session while the day stays open');
  assert.equal(days.open(P, 99), undefined);
  assert.equal(days.open('zzz', 1), undefined);
  assert.equal(days.resolved(P, 99), undefined);
});

test('swap for today: the new exercise with its own reps; ticks already made stay', () => {
  const { days } = setup();
  const D = days.open(P, 1), ex = first(D), to = D.alternatives(0, 0)[0];
  D.session().complete({ type: 'set', bi: 0, i: 0, k: 1 });
  D.swap(0, 0, to);
  const after = days.open(P, 1);
  assert.equal(first(after), to);
  assert.equal(after.day.blocks[0].items[0].n, cat.EX[to].r[0]);
  assert.equal(after.session().state(0).sets[0], 1, 'ticks carried over');
  assert.deepEqual(after.swapBehind(0, 0), { day: 1, ex, to });
  const exsOf = (d) => d.day.blocks.flatMap((b) => b.items.map((it) => it.ex));
  assert.ok(exsOf(days.open(P, laterWith(ex, 1))).includes(ex), 'today only: later days keep it');
  assert.equal(days.resolved(P, 1).blocks[0].items[0].ex, to, 'stats see the swapped day');
});

test('swap for the rest of the program reaches later days; undo restores every day', () => {
  const { days, store } = setup();
  const D = days.open(P, 1), ex = first(D), to = D.alternatives(0, 0)[0], later = laterWith(ex, 1);
  D.swap(0, 0, to, { onward: true });
  const L = days.open(P, later), bi = L.day.blocks.findIndex((b) => b.items.some((it) => it.ex === to));
  const i = L.day.blocks[bi].items.findIndex((it) => it.ex === to);
  assert.equal(L.swapBehind(bi, i).onward, true);
  L.undo(bi, i);
  assert.deepEqual(store.swaps(P), []);
  assert.equal(first(days.open(P, 1)), ex);
  assert.equal(days.open(P, 1).swapBehind(0, 0), undefined);
});

test('alternatives: what the item can be swapped for, none for an exercise with no match', () => {
  const { days } = setup();
  const D = days.open(P, 1);
  assert.ok(D.alternatives(0, 0).length > 0);
  assert.ok(!D.alternatives(0, 0).includes(first(D)));
});

test('the page modules leave days, sessions and swap rules to the Day module', () => {
  const fs = require('fs'), path = require('path');
  const src = ['app/views.js', 'app/main.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /\bsessionFor\b|\bcardDay\b|createSession\(p|x\.onward|KBSwaps\.(applySwaps|undoSwap|alternatives)/);
});
