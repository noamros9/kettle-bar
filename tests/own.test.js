// Build your own (Phase 6 ticket 5): choices -> config, validation, the record that is stored, the days rebuilt from it,
// the own-programs catalogue source, and how the page keeps the catalogue and the Progress Store in step.
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('../recipes.js');
const Builder = require('../program-builder.js');
const cat = require('../exercises.js');
const Own = require('../app/own.js');
const { createProgramCatalogue, inlined } = require('../app/programs.js');
const { createStore, createMemoryRemote } = require('../app/store.js');

const recipes = R.of(R.book());
const deps = { recipes, build: Builder.build, ex: cat };
const choices = (extra = {}) => ({ subjects: ['Strength'], split: 3, minutes: 30, equipment: 'kb', formats: ['straight', 'superset'], levers: ['weight', 'reps'], ...extra });
const days = (p) => JSON.stringify(p.days);
const memStorage = () => { const m = {}; return { m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } }; };
const tick = () => new Promise((r) => setTimeout(r, 5));

// ---- the plan's test first ----
test('toConfig builds the same 60 days twice; another seed gives other days', () => {
  const a = Builder.build(Own.toConfig(recipes, { id: 'x1', name: 'Mine', choices: choices(), seed: 's1' }), cat);
  const b = Builder.build(Own.toConfig(recipes, { id: 'x1', name: 'Mine', choices: choices(), seed: 's1' }), cat);
  assert.equal(a.days.length, 60);
  assert.equal(days(a), days(b));
  const other = Builder.build(Own.toConfig(recipes, { id: 'x1', name: 'Mine', choices: choices(), seed: 's2' }), cat);
  assert.notEqual(days(a), days(other));
});

test('toConfig: id own-<id>, the user\'s name, and the catalogue it was made with', () => {
  const c = Own.toConfig(recipes, { id: 'x1', name: 'Push me', choices: choices(), seed: 's1', catalogue: 3 });
  assert.equal(c.id, 'own-x1');
  assert.equal(c.name, 'Push me');
  assert.equal(c.catalogue, 3);
  assert.equal(Own.toConfig(recipes, { id: 'x1', name: 'N', choices: choices(), seed: 's1' }).catalogue, R.book().catalogue, 'the newest when none is given');
  assert.equal(Own.pidOf('x1'), 'own-x1');
});

test('a saved record read back builds identical days, whatever the catalogue asks for later', () => {
  const entry = { id: 'x1', name: 'Mine', choices: choices(), seed: 'abc', catalogue: 4 };
  const first = Own.programOf(deps, Own.fromRecord('x1', Own.toRecord(entry, '2026-09-29T10:00:00Z')));
  const viaJson = Own.fromRecord('x1', JSON.parse(JSON.stringify(Own.toRecord(entry, '2026-09-29T10:00:00Z'))));
  const second = Own.programOf(deps, viaJson);
  assert.equal(days(first), days(second));
  assert.equal(first.id, 'own-x1');
  assert.equal(first.name, 'Mine');
  // built with catalogue 4, not the newest
  assert.equal(days(first), days(Builder.build(Own.toConfig(recipes, entry), cat)));
});

test('the record is { name, choices, seed, catalogue, createdAt, updatedAt } and nothing else; the days are not stored', () => {
  const r = Own.toRecord({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T1');
  assert.deepEqual(Object.keys(r).sort(), ['catalogue', 'choices', 'createdAt', 'name', 'seed', 'updatedAt']);
  assert.deepEqual([r.createdAt, r.updatedAt], ['T1', 'T1']);
  assert.equal(Own.toRecord({ name: 'M', choices: choices(), seed: 's', catalogue: 5, createdAt: 'T0' }, 'T2').createdAt, 'T0', 'a later save keeps when it was made');
  const copy = choices(); const rec = Own.toRecord({ name: 'M', choices: copy, seed: 's', catalogue: 5 }, 'T'); copy.split = 1;
  assert.equal(rec.choices.split, 3, 'a copy');
});

test('fromRecord refuses damaged records with a message', () => {
  const ok = Own.toRecord({ name: 'M', choices: choices(), seed: 's', catalogue: 5 }, 'T');
  assert.throws(() => Own.fromRecord('a', null), /damaged/);
  assert.throws(() => Own.fromRecord('a', { ...ok, name: '' }), /name/);
  assert.throws(() => Own.fromRecord('a', { ...ok, choices: null }), /choices/);
  assert.throws(() => Own.fromRecord('a', { ...ok, seed: 5 }), /seed/);
  assert.throws(() => Own.fromRecord('a', { ...ok, catalogue: 'new' }), /catalogue/);
  assert.equal(Own.fromRecord('a', ok).pid, 'own-a');
});

// ---- choices ----
test('defaults come from the subject: its formats ticked, two of its levers, a combination that builds', () => {
  R.book().subjects.forEach(([subject]) => {
    const c = Own.defaults(recipes, subject);
    const o = recipes.options(subject);
    assert.deepEqual(c.subjects, [subject]);
    assert.deepEqual(c.formats, o.formats);
    assert.ok(c.levers.every((l) => o.levers.includes(l)), subject);
    assert.equal(Own.problem(recipes, c), null, `${subject}: ${Own.problem(recipes, c)}`);
  });
  assert.deepEqual(Own.defaults(recipes, 'Boxing').levers, ['variation', 'variation'], 'one lever: both levels use it');
  assert.equal(Own.subjects(recipes).length, R.book().subjects.length);
  assert.deepEqual(Own.subjects(recipes)[0], { name: 'Signature', family: 'Strength' });
});

test('problem: a message for every choice the recipes refuse, nothing for one that builds', () => {
  assert.equal(Own.problem(recipes, choices()), null);
  assert.match(Own.problem(recipes, choices({ split: 6 })), /1 to 5/);
  assert.match(Own.problem(recipes, choices({ minutes: 22 })), /Minutes/);
  assert.match(Own.problem(recipes, choices({ levers: ['holds', 'reps'] })), /does not get harder/);
  assert.match(Own.problem(recipes, choices({ formats: [] })), /Tick at least one format/);
  const none = R.book().subjects.map(([s]) => s).find((s) => !recipes.options(s).equipment.bw.length);
  assert.match(Own.problem(recipes, { ...Own.defaults(recipes, none), equipment: 'bw' }), /No .* day types fit/);
});

test('states: equipment and minutes the subject cannot build are off, each with a short reason', () => {
  const yoga = Own.states(recipes, Own.defaults(recipes, 'Yoga'));
  const o = recipes.options('Yoga');
  ['all', 'kb', 'bw'].forEach((eq) => assert.equal(yoga.equipment[eq].ok, o.equipment[eq].length > 0));
  [20, 25, 30, 35, 40].forEach((m) => assert.equal(yoga.minutes[m].ok, o.equipment[Own.defaults(recipes, 'Yoga').equipment].includes(m)));
  const s = R.book().subjects.map(([n]) => n).find((n) => ['all', 'kb', 'bw'].some((eq) => !recipes.options(n).equipment[eq].length));
  const st = Own.states(recipes, Own.defaults(recipes, s));
  const off = ['all', 'kb', 'bw'].find((eq) => !st.equipment[eq].ok);
  assert.match(st.equipment[off].reason, new RegExp(s));
  assert.equal(st.equipment.all.reason, st.equipment.all.ok ? '' : st.equipment.all.reason);
  const strength = Own.states(recipes, choices());
  assert.equal(strength.minutes[20].ok, false);
  assert.match(strength.minutes[20].reason, /20-minute Strength days with a kettlebell only/);
  assert.equal(strength.minutes[30].reason, '');
});

test('fit: what a change of subject, equipment or minutes leaves is a combination that builds', () => {
  // Strength has no 20-minute days: from 20 minutes it moves to the nearest that builds
  assert.equal(Own.fit(recipes, choices({ minutes: 20 })).minutes, 25);
  // an equipment the subject cannot do falls to one it can
  const none = R.book().subjects.map(([s]) => s).find((s) => !recipes.options(s).equipment.bw.length);
  assert.notEqual(Own.fit(recipes, { ...Own.defaults(recipes, none), equipment: 'bw' }).equipment, 'bw');
  // formats the subject doesn't have are dropped, levers it doesn't have are replaced, days per cycle kept in 1 to 5
  const f = Own.fit(recipes, choices({ formats: ['straight', 'bouts'], levers: ['holds', 'weight'], split: 9 }));
  assert.deepEqual(f.formats, ['straight']);
  assert.deepEqual(f.levers, ['reps', 'weight']);
  assert.equal(f.split, 5);
  assert.equal(Own.fit(recipes, choices({ split: 0 })).split, 1);
  assert.deepEqual(Own.fit(recipes, choices()), choices());
});

test('summaryLine says the cycle, the time and the gear', () => {
  const p = Own.programOf(deps, Own.fromRecord('a', Own.toRecord({ name: 'M', choices: choices(), seed: 'q', catalogue: 5 }, 'T')));
  assert.equal(Own.summaryLine(p), `${p.split} · 60 days · ~28–32 min · kettlebell only`);
  const all = Own.programOf(deps, Own.fromRecord('a', Own.toRecord({ name: 'M', choices: choices({ equipment: 'all' }), seed: 'q', catalogue: 5 }, 'T')));
  assert.match(Own.summaryLine(all), /all equipment$/);
  const bw = Own.programOf(deps, Own.fromRecord('a', Own.toRecord({ name: 'M', choices: Own.defaults(recipes, 'Bodyweight'), seed: 'q', catalogue: 5 }, 'T')));
  assert.match(Own.summaryLine(bw), /~\d+–\d+ min · (no equipment|kettlebell only|all equipment)$/);
  assert.equal(Own.summaryLine({ ...p, equip: 'bw' }).split(' · ').at(-1), 'no equipment');
});

test('ids: own-safe, lower case, different each time; the default name follows the subject', () => {
  const a = Own.newId(1e12, () => 0.123), b = Own.newId(1e12, () => 0.456);
  assert.match(a, /^[a-z0-9]+$/);
  assert.notEqual(a, b);
  assert.match(Own.newId(), /^[a-z0-9]+$/);
  assert.equal(Own.defaultName('Yoga'), 'My Yoga 60');
  assert.match(Own.newSeed(() => 0.5), /^[a-z0-9]+$/);
  assert.notEqual(Own.newSeed(() => 0.1), Own.newSeed(() => 0.9));
  assert.match(Own.newSeed(), /^[a-z0-9]+$/);
});

// ---- the catalogue source ----
const record = (name, seed, extra = {}) => Own.toRecord({ name, choices: choices(), seed, catalogue: 5, ...extra }, extra.createdAt || 'T');

test('source: newest first, days built from the records, summaries for the list, skips what is damaged', async () => {
  const src = Own.source({ a: record('Old', 's1', { createdAt: '2026-09-01T00:00:00Z' }), b: record('New', 's2', { createdAt: '2026-09-02T00:00:00Z' }), c: { name: 'Broken' } }, deps);
  assert.equal(src.name, 'own');
  assert.equal(src.first, true);
  assert.deepEqual(src.summaries.map((s) => s.id), ['own-b', 'own-a']);
  assert.equal(src.summaries[0].dayCount, 60);
  assert.ok(src.summaries[0].exercises.length > 5);
  assert.equal(src.summaries[0].days, undefined);
  assert.deepEqual(src.skipped.map((x) => x.id), ['c']);
  assert.match(src.skipped[0].error, /damaged|choices|seed|catalogue/);
  assert.equal((await src.load('own-a')).name, 'Old');
  // same createdAt: by id, so the order never flickers
  const tie = Own.source({ y: record('Y', 's'), x: record('X', 's') }, deps);
  assert.deepEqual(tie.summaries.map((s) => s.id), ['own-x', 'own-y']);
  // a record with no createdAt (imported by hand) counts as the oldest
  const { createdAt, ...bare } = record('Bare', 's');
  assert.deepEqual(Own.source({ a: bare, b: record('Dated', 't', { createdAt: '2026-01-01T00:00:00Z' }) }, deps).summaries.map((s) => s.id), ['own-b', 'own-a']);
});

test('source: a record the recipes cannot build any more is skipped with the reason, the others stay', () => {
  const bad = record('Gone', 's', { choices: choices({ subjects: ['Nothing here'] }) });
  const src = Own.source({ a: record('Fine', 's'), z: bad }, deps);
  assert.deepEqual(src.summaries.map((s) => s.id), ['own-a']);
  assert.match(src.skipped[0].error, /Unknown subject/);
});

test('the own source sits first in the catalogue, with source "own", next to the library', () => {
  const lib = inlined([Builder.build({ ...R.make(choices({ subjects: ['Strength'] }), 'x'), id: 'lib-1', name: 'Lib' }, cat)]);
  const catalogue = createProgramCatalogue(lib);
  catalogue.setSource('own', Own.source({ a: record('Mine', 's') }, deps));
  assert.deepEqual(catalogue.ids(), ['own-a', 'lib-1']);
  assert.equal(catalogue.summary('own-a').source, 'own');
  assert.equal(catalogue.day('own-a', 1).day, 1);
});

// ---- link: the store's docs -> the catalogue source; the catalogue -> the Progress Store's ids ----
function page(opts = {}) {
  const storage = memStorage(), remote = opts.remote;
  const store = createStore({ programIds: ['lib-1'], storage, now: opts.now || (() => 'T'), retryDelay: () => 0 });
  store.load();
  const lib = inlined([Builder.build({ ...R.make(choices(), 'x'), id: 'lib-1', name: 'Lib' }, cat)]);
  const catalogue = createProgramCatalogue(lib);
  let loads = 0;
  const load = opts.load || (() => { loads++; return Promise.resolve(recipes); });
  const link = Own.link({ store, programs: catalogue, load, ...deps, recipes: undefined });
  return { store, catalogue, link, storage, get loads() { return loads; } };
}

test('link: a saved program joins the catalogue, and the store learns its id', async () => {
  const p = page();
  const changes = []; p.catalogue.onChange(() => changes.push(p.catalogue.ids().join()));
  p.store.setDoc('programs', 'x1', Own.toRecord({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  await tick();
  assert.deepEqual(p.catalogue.ids(), ['own-x1', 'lib-1']);
  assert.deepEqual(p.store.programIds(), ['lib-1', 'own-x1']);
  p.store.toggle('own-x1', 1);
  assert.equal(p.store.isDone('own-x1', 1), true);
  assert.ok(p.storage.m['kb-progress-own-x1'], 'ticks are kept on the device like any program');
  // the second doc change does not load the book again
  p.store.setDoc('programs', 'x2', Own.toRecord({ name: 'Two', choices: choices(), seed: 't', catalogue: 5 }, 'T'));
  assert.equal(p.loads, 1);
  assert.deepEqual(p.catalogue.ids().sort(), ['lib-1', 'own-x1', 'own-x2']);
  assert.ok(changes.length >= 2);
});

test('link: other collections are ignored; a deleted program leaves the catalogue and the store', async () => {
  const p = page();
  p.store.setDoc('prefs', 'main', { a: 1 }); p.store.setDoc('random', 'r', { a: 1 });
  await tick();
  assert.equal(p.loads, 0);
  p.store.setDoc('programs', 'x1', Own.toRecord({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  await tick();
  p.store.deleteDoc('programs', 'x1');
  assert.deepEqual(p.catalogue.ids(), ['lib-1']);
  assert.deepEqual(p.store.programIds(), ['lib-1']);
  assert.equal(p.store.isDone('own-x1', 1), false);
});

test('link: docs already on the device are built when the page asks (refresh), loading the book once', async () => {
  const p = page();
  p.link.refresh(); // nothing stored: no book needed
  assert.equal(p.loads, 0);
  p.store.setDoc('programs', 'x1', Own.toRecord({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  await Promise.all([p.link.refresh(), p.link.refresh()]);
  assert.deepEqual(p.catalogue.ids(), ['own-x1', 'lib-1']);
});

test('link: no recipe book (offline, never opened build): own programs wait, nothing breaks, and come when it can load', async () => {
  let up = false;
  const p = page({ load: () => (up ? Promise.resolve(recipes) : Promise.reject(new Error('offline'))) });
  p.store.setDoc('programs', 'x1', Own.toRecord({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  await tick();
  assert.deepEqual(p.catalogue.ids(), ['lib-1']);
  up = true;
  await p.link.refresh();
  assert.deepEqual(p.catalogue.ids(), ['own-x1', 'lib-1']);
});

test('link: a program that arrives from the account on another device is built and its progress is subscribed', async () => {
  const one = createMemoryRemote();
  const a = page(), b = page();
  a.store.attach(one); b.store.attach(one); await tick();
  a.store.setDoc('programs', 'x1', Own.toRecord({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  a.store.toggle('lib-1', 1); await a.store.flush(); await tick();
  await tick();
  assert.deepEqual(b.catalogue.ids(), ['own-x1', 'lib-1']);
  a.store.toggle('own-x1', 2); await a.store.flush(); await tick();
  assert.equal(b.store.isDone('own-x1', 2), true, 'progress of an own program syncs like any program');
  assert.deepEqual(Object.keys(one.docs['own-x1'].done), ['2']);
});

// ---- the Progress Store learns ids at runtime ----
test('store.addProgram: loads the device copy, subscribes when signed in, is a no-op for a known id', async () => {
  const storage = memStorage();
  storage.set('kb-progress-own-a', JSON.stringify({ 4: '2026-01-01T00:00:00Z' }));
  const store = createStore({ programIds: ['p'], storage, now: () => 'T', retryDelay: () => 0 });
  store.load();
  assert.equal(store.count('own-a'), 0);
  store.addProgram('own-a');
  assert.equal(store.isDone('own-a', 4), true);
  const seen = []; store.on('change', (pid) => seen.push(pid));
  store.addProgram('own-a'); store.addProgram('p');
  assert.deepEqual(store.programIds(), ['p', 'own-a']);
  assert.deepEqual(seen, []);

  const remote = createMemoryRemote({ 'own-b': { done: { 7: 'c' } } });
  store.attach(remote); await tick();
  seen.length = 0;
  store.addProgram('own-b'); await tick();
  assert.equal(store.isDone('own-b', 7), true, 'the cloud copy of a program added after sign-in comes down');
  store.toggle('own-b', 1); await store.flush();
  assert.deepEqual(Object.keys(remote.docs['own-b'].done).sort(), ['1', '7']);
  assert.deepEqual([...new Set(seen)], ['own-b']);
});

test('store.addProgram: the device copy of a new program goes up on its first sync, merged with the cloud', async () => {
  const storage = memStorage();
  storage.set('kb-progress-own-a', JSON.stringify({ 2: '2026-01-01T00:00:00Z' }));
  const store = createStore({ programIds: ['p'], storage, now: () => 'T', retryDelay: () => 0 });
  store.load();
  const remote = createMemoryRemote({ 'own-a': { done: { 3: 'c' } } });
  store.attach(remote); await tick();
  store.addProgram('own-a'); await tick(); await store.flush();
  assert.deepEqual(Object.keys(remote.docs['own-a'].done).sort(), ['2', '3']);
});

test('store.dropProgram: forgets it in memory, stops listening to the cloud, keeps the device copy; the others are untouched', async () => {
  const storage = memStorage();
  const store = createStore({ programIds: ['p'], storage, now: () => 'T', retryDelay: () => 0 });
  store.load(); store.addProgram('own-a'); store.toggle('own-a', 1); store.toggle('p', 1);
  const remote = createMemoryRemote();
  store.attach(remote); await tick(); await store.flush();
  store.dropProgram('own-a');
  assert.deepEqual(store.programIds(), ['p']);
  assert.equal(store.count('own-a'), 0);
  assert.ok(storage.m['kb-progress-own-a'], 'the device copy stays: what happens to a deleted program\'s progress is ticket 6\'s call');
  await remote.write('progress', 'own-a', { done: { 9: 'c' } }); await tick();
  assert.equal(store.count('own-a'), 0, 'no longer listening');
  assert.equal(store.count('p'), 1);
  store.dropProgram('own-a'); store.dropProgram('never-there'); // both fine
  store.dropProgram('p'); // dropped and re-added: the device copy is read again
  store.addProgram('p'); assert.equal(store.count('p'), 1);
  // dropped before signing in: nothing to unsubscribe
  const local = createStore({ programIds: ['p'], storage: memStorage() }); local.load(); local.addProgram('own-z'); local.dropProgram('own-z');
  assert.deepEqual(local.programIds(), ['p']);
});

test('store: an update for a program that was just dropped is ignored', async () => {
  let deliver;
  const remote = { subscribe: (col, id, onData) => { if (id === 'own-a') deliver = onData; return () => {}; }, write: async () => {} };
  const store = createStore({ programIds: ['p'], storage: memStorage(), now: () => 'T', retryDelay: () => 0 });
  store.load(); store.attach(remote); store.addProgram('own-a');
  store.dropProgram('own-a');
  deliver({ done: { 3: 'c' } }); // already on its way
  assert.equal(store.count('own-a'), 0);
  assert.deepEqual(store.programIds(), ['p']);
});
