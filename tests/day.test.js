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
  const m = {}, clock = { t: 1_000_000 };
  const store = createStore({ programIds: ['three-split-60'], storage: { get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } }, now: () => 't' });
  store.load();
  const programs = createProgramCatalogue(inlined(real));
  // the device: one adapter shared by every Day module made on it, as the page's storage is
  const device = { get: (k) => m['dev:' + k] ?? null, set: (k, v) => { m['dev:' + k] = v; }, remove: (k) => { delete m['dev:' + k]; } };
  const make = () => createDays({ programs, store, cat, createSession, storage: device, now: () => clock.t });
  return { store, days: make(), make, device, clock, keys: () => Object.keys(m).filter((k) => k.startsWith('dev:')).map((k) => k.slice(4)) };
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

test('a day of a past round is resolved with the swaps that round had', () => {
  const { days, store } = setup();
  const D = days.open(P, 1), ex = first(D), to = D.alternatives(0, 0)[0];
  D.swap(0, 0, to); // today only, in round 1
  store.startRound(P, []);
  assert.equal(days.resolved(P, 1, 1).blocks[0].items[0].ex, to, 'round 1 had the swap');
  assert.equal(days.resolved(P, 1, 2).blocks[0].items[0].ex, ex, 'round 2 does not');
  assert.equal(days.resolved(P, 1).blocks[0].items[0].ex, ex, 'no round: the current one');
});

// resume: the open day's session is saved on the device and comes back
const HOUR = 3600 * 1000;
const tickSet = (D, k = 1) => D.session().complete({ type: 'set', bi: 0, i: 0, k });

test('a day restores after other days were opened in between, and after a fresh start', () => {
  const { days, make, keys } = setup();
  const d3 = days.open(P, 3);
  tickSet(d3, 1);
  days.open(P, 4).session(); // another day replaces the one in memory
  assert.equal(days.open(P, 4).restored(), false, 'nothing saved for day 4');
  const back = days.open(P, 3);
  assert.equal(back.session().state(0).sets[0], 1, 'day 3 comes back');
  assert.equal(back.restored(), true);
  assert.deepEqual(keys(), [`kb-session-${P}-1-3`], 'day 4 was only opened, never changed: nothing saved');
  assert.equal(make().open(P, 3).session().state(0).sets[0], 1, 'a new page load (fresh module) finds it too');
});

test('every change is saved: ticks, stretches and the time started', () => {
  const { days, make } = setup();
  const D = days.open(P, 1), s = D.session();
  s.complete({ type: 'stretch', key: 'warm' });
  const after = () => make().open(P, 1).session();
  assert.ok(after().stretchDone('warm'));
  tickSet(D, 1);
  assert.equal(after().state(0).sets[0], 1);
  tickSet(D, 1); // un-tick
  assert.equal(after().state(0).sets[0], 0);
  s.setStarted(555);
  assert.equal(after().started(), 555);
});

test('a session that was not restored says so: restored() is false for a new one and stays true while it is live', () => {
  const { days, make } = setup();
  const D = days.open(P, 1); D.session(); tickSet(D);
  assert.equal(days.open(P, 1).restored(), false, 'the session made in this page is not "picked up"');
  const again = make().open(P, 1); again.session();
  assert.equal(again.restored(), true);
  assert.equal(make().open(P, 2).restored(), false);
});

test('Mark as done clears the saved session (and so does un-marking)', () => {
  const { days, keys, make } = setup();
  tickSet(days.open(P, 1));
  assert.equal(keys().length, 1);
  days.forget(P, 1);
  assert.deepEqual(keys(), []);
  assert.equal(make().open(P, 1).session().state(0).sets[0], 0, 'a fresh page starts the day from zero');
  days.forget(P, 1); // nothing there: fine
});

test('a saved session older than 12 hours is ignored and removed', () => {
  const { days, make, clock, keys } = setup();
  tickSet(days.open(P, 1));
  clock.t += 12 * HOUR - 1;
  assert.equal(make().open(P, 1).session().state(0).sets[0], 1, 'just inside 12 hours');
  clock.t += 2;
  assert.equal(make().open(P, 1).session().state(0).sets[0], 0, 'older than 12 hours');
  assert.deepEqual(keys(), [], 'and removed');
});

test('the saved-at time moves with every change', () => {
  const { days, make, clock } = setup();
  const D = days.open(P, 1); tickSet(D, 1);
  clock.t += 11 * HOUR; tickSet(D, 2);
  clock.t += 11 * HOUR;
  assert.equal(make().open(P, 1).session().state(0).sets[0], 2, '22 hours after the first tick, 11 after the last');
});

test('the round is in the key: round 2 day 5 does not restore round 1\'s', () => {
  const { days, store, keys } = setup();
  tickSet(days.open(P, 5));
  store.startRound(P, []);
  assert.equal(days.open(P, 5).session().state(0).sets[0], 0, 'even from the same Day module');
  tickSet(days.open(P, 5), 1);
  assert.deepEqual(keys().sort(), [`kb-session-${P}-1-5`, `kb-session-${P}-2-5`]);
});

test('a saved session that does not fit the day is ignored; corrupt text too', () => {
  const { days, make, device, clock } = setup();
  const key = `kb-session-${P}-1-1`, put = (v) => device.set(key, typeof v === 'string' ? v : JSON.stringify(v));
  const state0 = () => make().open(P, 1).session().state(0).sets[0];
  put({ savedAt: clock.t, session: { state: [], stretched: { warm: false, cool: false } } });
  assert.equal(state0(), 0, 'block count differs');
  put('{oops'); assert.equal(state0(), 0, 'not JSON');
  put({ session: {} }); assert.equal(state0(), 0, 'no saved-at time');
  put('null'); assert.equal(state0(), 0, 'nothing in it');
});

test('a swap made while away still restores the ticks (same shape), and one after a restore carries them over', () => {
  const { days, make } = setup();
  const D = days.open(P, 1); tickSet(D);
  D.swap(0, 0, D.alternatives(0, 0)[0]);
  const back = make().open(P, 1);
  assert.equal(back.session().state(0).sets[0], 1);
  back.undo(0, 0); // the exercises change again, after the restore
  assert.equal(make().open(P, 1).session().state(0).sets[0], 1);
  assert.equal(days.open(P, 1).session().state(0).sets[0], 1, 'the live session carried the ticks');
});
