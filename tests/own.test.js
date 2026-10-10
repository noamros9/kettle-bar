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
const deps = { build: Builder.build, ex: cat };
// a record as the page saves it: the choices, the seed and the config they made
const saved = (entry, now) => Own.toRecord({ ...entry, config: Own.configOf(recipes, entry) }, now);
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
  // all equipment: a kettlebell-only day of today's book may need a catalogue-13 kettlebell move (Phase 22 ticket 21)
  const entry = { id: 'x1', name: 'Mine', choices: choices({ equipment: 'all' }), seed: 'abc', catalogue: 4 };
  const first = Own.programOf(deps, Own.fromRecord('x1', saved(entry, '2026-09-29T10:00:00Z')));
  const viaJson = Own.fromRecord('x1', JSON.parse(JSON.stringify(saved(entry, '2026-09-29T10:00:00Z'))));
  const second = Own.programOf(deps, viaJson);
  assert.equal(days(first), days(second));
  assert.equal(first.id, 'own-x1');
  assert.equal(first.name, 'Mine');
  // built with catalogue 4, not the newest
  assert.equal(days(first), days(Builder.build(Own.toConfig(recipes, entry), cat)));
});

test('the record is { name, choices, seed, catalogue, config, createdAt, updatedAt }; the days are not stored, and the config is compact', () => {
  const r = saved({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T1');
  assert.deepEqual(Object.keys(r).sort(), ['catalogue', 'choices', 'config', 'createdAt', 'name', 'seed', 'updatedAt']);
  assert.deepEqual([r.createdAt, r.updatedAt], ['T1', 'T1']);
  assert.equal(saved({ name: 'M', choices: choices(), seed: 's', catalogue: 5, createdAt: 'T0' }, 'T2').createdAt, 'T0', 'a later save keeps when it was made');
  const copy = choices(); const rec = saved({ name: 'M', choices: copy, seed: 's', catalogue: 5 }, 'T'); copy.split = 1;
  assert.equal(rec.choices.split, 3, 'a copy');
});

test('fromRecord refuses damaged records with a message', () => {
  const ok = saved({ name: 'M', choices: choices(), seed: 's', catalogue: 5 }, 'T');
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
  const p = Own.programOf(deps, Own.fromRecord('a', saved({ name: 'M', choices: choices(), seed: 'q', catalogue: 5 }, 'T')));
  assert.equal(Own.summaryLine(p), `${p.split} · 60 days · ~28–32 min · kettlebell only`);
  const all = Own.programOf(deps, Own.fromRecord('a', saved({ name: 'M', choices: choices({ equipment: 'all' }), seed: 'q', catalogue: 5 }, 'T')));
  assert.match(Own.summaryLine(all), /all equipment$/);
  const bw = Own.programOf(deps, Own.fromRecord('a', saved({ name: 'M', choices: Own.defaults(recipes, 'Bodyweight'), seed: 'q', catalogue: 5 }, 'T')));
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
const record = (name, seed, extra = {}) => saved({ name, choices: choices(), seed, catalogue: 5, ...extra }, extra.createdAt || 'T');

test('source with a cache: a rename (or another program changing) reuses the built days; a new config rebuilds', () => {
  let builds = 0;
  const cache = new Map(), counted = { build: (c, x) => { builds += 1; return Builder.build(c, x); }, ex: cat, cache };
  const a = record('Mine', 's1'), b = record('Other', 's2');
  const first = Own.source({ a, b }, counted);
  assert.equal(builds, 2);
  const renamed = Own.source({ a: { ...a, name: 'Pull it' }, b }, counted);
  assert.equal(builds, 2);
  assert.equal(renamed.summaries.find((x) => x.id === 'own-a').name, 'Pull it');
  assert.equal(JSON.stringify(renamed.preloaded.find((p) => p.id === 'own-a').days), JSON.stringify(first.preloaded.find((p) => p.id === 'own-a').days));
  Own.source({ a: record('Mine', 's3'), b }, counted); // a new seed makes a new config
  assert.equal(builds, 3);
  for (let i = 0; i < 4; i += 1) Own.source({ a: record('Mine', 'n' + i) }, counted); // old entries don't pile up
  assert.ok(cache.size <= 4);
});

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
  const { config, ...legacy } = record('Old', 's');
  const src = Own.source({ a: record('Fine', 's'), z: { ...record('Bad', 's'), config: 'nope' }, y: legacy }, deps);
  assert.deepEqual(src.summaries.map((s) => s.id), ['own-a']);
  assert.deepEqual(src.skipped.map((x) => x.id).sort(), ['y', 'z']);
  assert.match(src.skipped.find((x) => x.id === 'z').error, /damaged config/);
  assert.match(src.skipped.find((x) => x.id === 'y').error, /no config yet/);
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
  const link = Own.link({ store, programs: catalogue, load, ...deps });
  return { store, catalogue, link, storage, get loads() { return loads; } };
}

test('link: a saved program joins the catalogue, and the store learns its id', async () => {
  const p = page();
  const changes = []; p.catalogue.onChange(() => changes.push(p.catalogue.ids().join()));
  p.store.setDoc('programs', 'x1', saved({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  await tick();
  assert.deepEqual(p.catalogue.ids(), ['own-x1', 'lib-1']);
  assert.deepEqual(p.store.programIds(), ['lib-1', 'own-x1']);
  p.store.toggle('own-x1', 1);
  assert.equal(p.store.isDone('own-x1', 1), true);
  assert.ok(p.storage.m['kb-progress-own-x1'], 'ticks are kept on the device like any program');
  // built from the stored config: the recipe book is never asked for
  p.store.setDoc('programs', 'x2', saved({ name: 'Two', choices: choices(), seed: 't', catalogue: 5 }, 'T'));
  assert.equal(p.loads, 0);
  assert.deepEqual(p.catalogue.ids().sort(), ['lib-1', 'own-x1', 'own-x2']);
  assert.ok(changes.length >= 2);
});

test('link: other collections are ignored; a deleted program leaves the catalogue and the store', async () => {
  const p = page();
  p.store.setDoc('prefs', 'main', { a: 1 }); p.store.setDoc('random', 'r', { a: 1 });
  await tick();
  assert.equal(p.loads, 0);
  p.store.setDoc('programs', 'x1', saved({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  await tick();
  p.store.deleteDoc('programs', 'x1');
  assert.deepEqual(p.catalogue.ids(), ['lib-1']);
  assert.deepEqual(p.store.programIds(), ['lib-1']);
  assert.equal(p.store.isDone('own-x1', 1), false);
});

test('link: docs already on the device are built when the page asks (refresh), with no recipe book', () => {
  const p = page({ load: () => { throw new Error('the book must not be needed'); } });
  p.link.refresh(); // nothing stored
  p.store.replaceDocs('programs', { x1: saved({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T') });
  p.link.refresh();
  assert.deepEqual(p.catalogue.ids(), ['own-x1', 'lib-1']);
});

test('boot with own programs stored and the recipe book unavailable (offline, never fetched): they are all there', () => {
  const first = page(); // a device that saved two programs
  first.store.setDoc('programs', 'x1', saved({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
  first.store.setDoc('programs', 'x2', saved({ name: 'Two', choices: choices({ split: 5 }), seed: 't', catalogue: 5 }, 'T'));
  first.store.toggle('own-x1', 4);
  // a fresh page on the same device storage, whose book can never load
  const store = createStore({ programIds: ['lib-1'], storage: first.storage, now: () => 'T' });
  store.load();
  const catalogue = createProgramCatalogue(inlined([Builder.build({ ...R.make(choices(), 'x'), id: 'lib-1', name: 'Lib' }, cat)]));
  let asked = 0;
  Own.link({ store, programs: catalogue, load: () => { asked++; return Promise.reject(new Error('offline')); }, ...deps }).refresh();
  assert.equal(asked, 0);
  assert.deepEqual(catalogue.ids().sort(), ['lib-1', 'own-x1', 'own-x2']);
  assert.equal(catalogue.day('own-x2', 1).day, 1);
  assert.equal(store.isDone('own-x1', 4), true);
});

// ---- the core rule: a program you are halfway through never changes when the recipe book does ----
test('a saved program builds byte-identical days after the recipe book changes: a day type dropped, one added', () => {
  const entry = { name: 'Mine', choices: choices({ split: 4 }), seed: 'keep-me', catalogue: 5 };
  const record = JSON.parse(JSON.stringify(saved(entry, 'T'))); // as it comes back from the device or the cloud
  const before = days(Own.programOf(deps, Own.fromRecord('x', record)));
  const book = JSON.parse(JSON.stringify(R.book()));
  // drop every Strength day type but one, and add a copy of one under a new label: make() from this book gives other days
  const strength = book.subjects.findIndex(([n]) => n === 'Strength');
  const of = book.types.filter((t) => t.subject === strength);
  const changed = { ...book, types: [...book.types.filter((t) => t.subject !== strength || t === of[0]), { ...of[1], id: 'new:x', label: 'Brand new' }] };
  const other = R.of(changed);
  assert.notEqual(days(Builder.build(Own.toConfig(other, { id: 'x', name: 'Mine', ...entry }), cat)), before, 'the changed book would reshuffle it');
  assert.equal(days(Own.programOf(deps, Own.fromRecord('x', record))), before);
  // and the stored config is the whole story: the days do not read the choices or the seed
  const noChoices = { ...record, choices: { ...record.choices, split: 1 }, seed: 'something else' };
  assert.equal(days(Own.programOf(deps, Own.fromRecord('x', noChoices))), before);
});

test('the stored config is what make() produced, without what is worked out again; its names match make()', () => {
  const made = recipes.make({ ...choices({ split: 5, equipment: 'all' }), catalogue: 5 }, 'abc');
  const config = Own.configOf(recipes, { choices: choices({ split: 5, equipment: 'all' }), seed: 'abc', catalogue: 5 });
  assert.deepEqual(Object.keys(config).filter((k) => !(k in made)), []);
  assert.deepEqual(['id', 'name', 'names'].filter((k) => k in config), []);
  const built = Own.programOf(deps, { pid: 'own-x', name: 'N', config });
  assert.equal(days(built), days(Builder.build({ ...made, id: 'own-x', name: 'N' }, cat)), 'the same days, names included');
  const size = JSON.stringify(saved({ name: 'My Strength 60', choices: choices({ split: 5 }), seed: 'abc', catalogue: 5 }, '2026-09-29T10:00:00.000Z')).length;
  assert.ok(size < 12000, `a 5-day record is ${size} bytes`);
});

test('link: a doc without a config (none exist) is made once through the book and saved back; it stays out while the book is away', async () => {
  const { config, ...legacy } = saved({ name: 'Old', choices: choices(), seed: 's', catalogue: 5 }, 'T');
  let up = false;
  const p = page({ load: () => (up ? Promise.resolve(recipes) : Promise.reject(new Error('offline'))) });
  p.store.replaceDocs('programs', { x1: legacy, bad: { ...legacy, choices: choices({ subjects: ['Nothing here'] }) } });
  await tick();
  assert.deepEqual(p.catalogue.ids(), ['lib-1']);
  up = true;
  await Promise.all([p.link.refresh(), p.link.refresh()]);
  assert.deepEqual(p.catalogue.ids(), ['own-x1', 'lib-1']);
  assert.deepEqual(p.store.doc('programs', 'x1').config, config, 'saved back');
  assert.equal(p.store.doc('programs', 'bad').config, undefined, 'unbuildable: left as it was');
  const stored = p.store.doc('programs', 'x1');
  assert.equal(days(p.catalogue.get('own-x1')), days(Own.programOf(deps, Own.fromRecord('x1', stored))));
});

test('link: a program that arrives from the account on another device is built and its progress is subscribed', async () => {
  const one = createMemoryRemote();
  const a = page(), b = page();
  a.store.attach(one); b.store.attach(one); await tick();
  a.store.setDoc('programs', 'x1', saved({ name: 'Mine', choices: choices(), seed: 's', catalogue: 5 }, 'T'));
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
  assert.ok(storage.m['kb-progress-own-a'], 'the device copy stays: only deleteProgress (you deleted it) removes it');
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

// ---- ticket 6: rename, delete, edit ----
const Backup = require('../app/backup.js');
const editDeps = { recipes, ...deps };
const rec = (extra = {}) => saved({ name: 'Mine', choices: choices({ minutes: 40 }), seed: 'ed', catalogue: R.book().catalogue, ...extra }, '2026-09-01T00:00:00Z');
// what you did on a day: everything but the type key, which only says how the day is coloured in the rebuilt cycle
const didOf = (d) => { const { type, ...rest } = d; return JSON.stringify(rest); };
const built = (record, id = 'x1') => Own.programOf(deps, Own.fromRecord(id, record));

test('edit minutes after ticking days 1-3: days 1-3 are unchanged, day 4 is in the new range', () => {
  const before = rec(), old = built(before);
  const after = Own.edit(editDeps, 'x1', before, { choices: choices({ minutes: 25 }), doneDays: [1, 2, 3] }, '2026-09-02T00:00:00Z');
  const now = built(after);
  [0, 1, 2].forEach((i) => assert.equal(didOf(now.days[i]), didOf(old.days[i]), 'day ' + (i + 1) + ' is what you did'));
  assert.ok(old.days[3].est > 35, 'day 4 was a 40-minute day');
  assert.ok(now.days[3].est >= 22 && now.days[3].est <= 28, 'day 4 is a 25-minute day: ' + now.days[3].est);
  assert.deepEqual(Object.keys(after.frozenDays), ['1', '2', '3']);
  assert.equal(after.choices.minutes, 25);
  assert.equal(after.createdAt, before.createdAt, 'the same program');
  assert.equal(after.updatedAt, '2026-09-02T00:00:00Z');
  assert.equal(now.id, 'own-x1');
});

test('edit: days from a past round are frozen too; days frozen by an earlier edit stay frozen', () => {
  const first = Own.edit(editDeps, 'x1', rec(), { choices: choices({ minutes: 30 }), doneDays: [1, 2] }, 'T1');
  const p1 = built(first);
  // round 1 ended with days 5 and 9 done; round 2 has day 1 done: the caller passes every done day of every round
  const second = Own.edit(editDeps, 'x1', first, { choices: choices({ minutes: 25, split: 4 }), doneDays: [1, 5, 9] }, 'T2');
  const p2 = built(second);
  assert.deepEqual(Object.keys(second.frozenDays).sort(), ['1', '2', '5', '9']);
  [1, 2, 5, 9].forEach((n) => assert.equal(didOf(p2.days[n - 1]), didOf(p1.days[n - 1]), 'day ' + n));
  assert.notEqual(didOf(p2.days[5]), didOf(p1.days[5]), 'day 6 was not done: rebuilt');
  assert.equal(p2.days.length, 60);
});

test('edit: name and seed can change with the choices; a name left out stays; days out of range are ignored', () => {
  const before = rec();
  const a = Own.edit(editDeps, 'x1', before, { name: 'New name', choices: choices(), seed: 'other', doneDays: [61, 0] }, 'T');
  assert.equal(a.name, 'New name'); assert.equal(a.seed, 'other');
  assert.equal(a.frozenDays, undefined, 'nothing done: nothing frozen, and no key');
  assert.equal(Own.edit(editDeps, 'x1', before, { choices: choices(), doneDays: [] }, 'T').name, 'Mine');
  assert.equal(Own.edit(editDeps, 'x1', before, { choices: choices(), doneDays: [] }, 'T').seed, 'ed');
});

test('a frozen day keeps its type only while the new cycle still calls that type the same; otherwise it shows by its own title', () => {
  const before = rec({ choices: choices({ split: 3 }) });
  const old = built(before);
  const after = Own.edit(editDeps, 'x1', before, { choices: choices({ split: 2 }), doneDays: [1, 2, 3] }, 'T');
  const now = built(after);
  [0, 1, 2].forEach((i) => {
    const d = now.days[i], o = old.days[i], t = now.dayTypes[o.type];
    assert.equal(d.title, o.title);
    if (t && t.label === o.title) assert.equal(d.type, o.type); else assert.equal(d.type, undefined);
  });
  assert.ok(now.days.slice(0, 3).some((d) => d.type === undefined), 'a three-day cycle became two: the third day type is gone');
});

test('building from a record never touches the recipe book, frozen days or not', () => {
  const after = Own.edit(editDeps, 'x1', rec(), { choices: choices({ minutes: 25 }), doneDays: [1, 2] }, 'T');
  const spy = { book() { throw new Error('the book was asked'); }, options() { throw new Error('the book was asked'); }, make() { throw new Error('the book was asked'); } };
  const p = Own.programOf({ build: Builder.build, ex: cat, recipes: spy }, Own.fromRecord('x1', JSON.parse(JSON.stringify(after))));
  assert.equal(p.days.length, 60);
  // and the stored days are what a book from another catalogue would not change
  assert.equal(didOf(p.days[0]), didOf(built(rec()).days[0]));
});

test('fromRecord: frozenDays are checked; a damaged one is refused', () => {
  const ok = Own.edit(editDeps, 'x1', rec(), { choices: choices(), doneDays: [1] }, 'T');
  assert.deepEqual(Object.keys(Own.fromRecord('a', ok).frozenDays), ['1']);
  assert.equal(Own.fromRecord('a', rec()).frozenDays, undefined);
  assert.throws(() => Own.fromRecord('a', { ...ok, frozenDays: [] }), /frozen/);
  assert.throws(() => Own.fromRecord('a', { ...ok, frozenDays: { 1: 'x' } }), /frozen/);
  assert.throws(() => Own.fromRecord('a', { ...ok, frozenDays: { 61: ok.frozenDays[1] } }), /frozen/);
  assert.throws(() => Own.fromRecord('a', { ...ok, frozenDays: { one: ok.frozenDays[1] } }), /frozen/);
  assert.throws(() => Own.fromRecord('a', { ...ok, frozenDays: { 1: { ...ok.frozenDays[1], blocks: null } } }), /frozen/);
});

test('an edited record stays compact: about ten frozen days, and no day number or name repeated', () => {
  const after = Own.edit(editDeps, 'x1', rec(), { choices: choices({ minutes: 25 }), doneDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }, 'T');
  const bytes = JSON.stringify(after).length;
  assert.ok(bytes < 12000, 'record is ' + bytes + ' bytes');
  assert.equal(after.frozenDays[1].day, undefined);
  console.log('edited record with 10 frozen days:', bytes, 'bytes; before the edit:', JSON.stringify(rec()).length);
});

test('an edited record round-trips a backup file and an import, and builds the same days', () => {
  const after = Own.edit(editDeps, 'x1', rec(), { choices: choices({ minutes: 25 }), doneDays: [1, 2, 3] }, '2026-09-02T00:00:00Z');
  const file = JSON.stringify(Backup.exportProgress({ 'own-x1': { 1: 't' } }, { now: () => 'n', ownPrograms: { x1: after } }));
  const parsed = Backup.parseBackup(file, { known: ['own-x1'] });
  assert.deepEqual(parsed.ownPrograms.x1, JSON.parse(JSON.stringify(after)));
  assert.deepEqual(built(parsed.ownPrograms.x1).days, built(after).days);
});

test('rename: trimmed, not empty, at most 60 characters; a new time, everything else as it was', () => {
  assert.equal(Own.checkName('  '), 'Give it a name.');
  assert.equal(Own.checkName(''), 'Give it a name.');
  assert.match(Own.checkName('x'.repeat(61)), /60/);
  assert.equal(Own.checkName('x'.repeat(60)), null);
  assert.equal(Own.checkName('Legs day'), null);
  const before = Own.edit(editDeps, 'x1', rec(), { choices: choices(), doneDays: [1] }, 'T0');
  const after = Own.renamed(before, '  Legs day  ', 'T1');
  assert.equal(after.name, 'Legs day');
  assert.deepEqual({ ...after, name: 0, updatedAt: 0 }, { ...before, name: 0, updatedAt: 0 });
  assert.equal(after.updatedAt, 'T1');
  assert.throws(() => Own.renamed(before, ' ', 'T1'), /name/);
});

test('rename through the store: the catalogue shows the new name and the progress stays', async () => {
  const p = page();
  p.store.setDoc('programs', 'x1', rec());
  await tick(); p.store.toggle('own-x1', 2);
  p.store.setDoc('programs', 'x1', Own.renamed(p.store.doc('programs', 'x1'), 'Renamed', 'T'));
  assert.equal(p.catalogue.summary('own-x1').name, 'Renamed');
  assert.equal(p.store.isDone('own-x1', 2), true);
});

test('store.deleteProgress: its device keys and its cloud progress document go; the others stay', async () => {
  const storage = memStorage();
  const store = createStore({ programIds: ['p'], storage, now: () => 'T', retryDelay: () => 0 });
  store.load(); store.addProgram('own-a'); store.toggle('own-a', 1); store.toggle('p', 1);
  store.setSwaps('own-a', [{ day: 1, ex: 'a', to: 'b' }]);
  store.startRound('own-a', []); // a past round
  const remote = createMemoryRemote();
  store.attach(remote); await tick(); await store.flush();
  assert.ok(remote.docs['own-a'] && remote.docs.p);
  ['kb-progress-own-a', 'kb-swaps-own-a', 'kb-past-own-a'].forEach((k) => assert.ok(storage.m[k], k));
  await store.deleteProgress('own-a');
  assert.deepEqual(Object.keys(storage.m).filter((k) => k.endsWith('own-a')), [], 'no device key is left');
  assert.equal(remote.docs['own-a'], undefined, 'the cloud document is gone');
  assert.ok(remote.docs.p, 'other programs are untouched');
  assert.equal(store.count('own-a'), 0); assert.equal(store.round('own-a'), 1);
  assert.deepEqual(store.programIds(), ['p']);
  assert.equal(store.count('p'), 1);
  // no longer listening: a late write from another device does not bring it back
  await remote.write('progress', 'own-a', { done: { 9: 'c' } }); await tick();
  assert.equal(store.count('own-a'), 0);
  await store.deleteProgress('never-there'); // nothing to delete: fine
});

test('store.deleteProgress: signed out (no cloud) and on a device that cannot remove keys; a cloud that fails does not throw', async () => {
  const noRemove = { m: {}, get(k) { return this.m[k] ?? null; }, set(k, v) { this.m[k] = v; } };
  const local = createStore({ programIds: [], storage: noRemove, now: () => 'T' });
  local.load(); local.addProgram('own-a'); local.toggle('own-a', 1);
  await local.deleteProgress('own-a');
  assert.equal(noRemove.m['kb-progress-own-a'], '', 'cleared when the device has no remove');
  const store = createStore({ programIds: [], storage: memStorage(), now: () => 'T', retryDelay: () => 0 });
  store.load(); store.addProgram('own-b'); store.toggle('own-b', 1);
  const remote = createMemoryRemote({}, {});
  store.attach(remote); await tick(); await store.flush();
  const warn = console.warn; console.warn = () => {};
  remote.remove = async () => { throw new Error('offline'); };
  try { await store.deleteProgress('own-b'); } finally { console.warn = warn; }
  assert.equal(store.count('own-b'), 0);
});

test('delete a program end to end: doc, progress on the device and in the cloud, and the other device drops it', async () => {
  const remote = createMemoryRemote();
  const a = page(), b = page();
  a.store.attach(remote); b.store.attach(remote); await tick();
  a.store.setDoc('programs', 'x1', rec()); await tick(); await a.store.flush();
  assert.deepEqual(b.catalogue.ids(), ['own-x1', 'lib-1'], 'the other device has it');
  a.store.toggle('own-x1', 1); await a.store.flush(); await tick();
  assert.equal(b.store.isDone('own-x1', 1), true);
  await a.store.deleteProgress('own-x1');
  await a.store.deleteDoc('programs', 'x1'); await tick();
  assert.equal(remote.collections.programs.x1, undefined);
  assert.equal(remote.docs['own-x1'], undefined);
  assert.equal(a.store.doc('programs', 'x1'), null);
  assert.deepEqual(a.catalogue.ids(), ['lib-1']);
  assert.deepEqual(b.catalogue.ids(), ['lib-1'], 'the other device drops it when the doc disappears');
  assert.deepEqual(b.store.programIds(), ['lib-1']);
  assert.deepEqual(Object.keys(a.storage.m).filter((k) => k.includes('own-x1') || k.includes('-programs-x1')), []);
});

// ---- Phase 31 ticket 2 (#111): what the builder previews is what Save keeps ----
test('a preview built under the id the builder picked equals the program saved with that id, every day', () => {
  const id = Own.newId(Date.parse('2026-10-10T08:00:00Z'), () => 0.5), made = { choices: choices(), seed: 'pv1', catalogue: R.book().catalogue };
  const preview = Own.programOf(deps, { pid: Own.pidOf(id), name: 'Preview', config: Own.configOf(recipes, { choices: made.choices, seed: made.seed }) });
  const kept = Own.programOf(deps, Own.fromRecord(id, saved({ name: 'Mine', ...made }, '2026-10-10T08:01:00Z')));
  assert.equal(preview.days.length, 60);
  assert.equal(days(preview), days(kept));
  // the old way: a preview under a stand-in pid draws other days than the program you get (the bug)
  const standIn = Own.programOf(deps, { pid: 'own-preview', name: 'Preview', config: Own.configOf(recipes, { choices: made.choices, seed: made.seed }) });
  assert.notEqual(days(standIn), days(kept));
});
