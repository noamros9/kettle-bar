// Program Catalogue: which programs exist, one program's days, and who uses an exercise.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { createProgramCatalogue, inlined, summarize } = require('../app/programs.js');
const { buildAll } = require('../program-builder.js');

const day = (n, exs, warm = []) => ({ day: n, blocks: [{ items: exs.map((ex) => ({ ex, n: 5 })) }], warmup: { items: warm.map((ex) => ({ ex, n: 30 })) } });
const programs = [
  { id: 'a', name: 'Alpha', subject: 'Strength', days: [day(1, ['pushup', 'squat'], ['arm_circle']), day(2, ['row'])] },
  { id: 'b', name: 'Bravo', subject: 'Core', days: [{ day: 1, blocks: [{ items: [{ ex: 'plank', n: 30 }] }], cooldown: { items: [{ ex: 'child_pose', n: 60 }] } }] },
];
const cat = createProgramCatalogue(inlined(programs));

test('lists every program without its days, with how many days and which exercises it uses', () => {
  assert.deepEqual(cat.ids(), ['a', 'b']);
  assert.deepEqual(cat.list()[0], { id: 'a', name: 'Alpha', subject: 'Strength', source: 'library', dayCount: 2, exercises: ['arm_circle', 'pushup', 'row', 'squat'] });
  assert.equal(cat.summary('b').name, 'Bravo');
  assert.equal(cat.summary('zzz'), undefined);
  assert.ok(cat.has('a'));
  assert.equal(cat.has('zzz'), false);
});

test('a loaded program and its days; unknown programs and days give nothing', async () => {
  assert.equal(cat.get('a').days.length, 2);
  assert.equal(cat.day('a', 2).blocks[0].items[0].ex, 'row');
  assert.equal(cat.day('a', 3), undefined);
  assert.equal(cat.get('zzz'), undefined);
  assert.equal(cat.day('zzz', 1), undefined);
  assert.equal((await cat.load('b')).name, 'Bravo');
  assert.equal(await cat.load('zzz'), undefined);
});

test('a program not loaded yet: get says nothing until load resolves', async () => {
  let resolveLoad;
  const lazy = createProgramCatalogue({ name: 'library', summaries: [{ id: 'c', name: 'Charlie', dayCount: 1, exercises: ['row'] }], load: () => new Promise((r) => { resolveLoad = r; }) });
  assert.equal(lazy.get('c'), undefined);
  const loading = lazy.load('c');
  assert.equal(lazy.load('c'), loading, 'one load at a time');
  resolveLoad({ id: 'c', name: 'Charlie', days: [day(1, ['row'])] });
  await loading;
  assert.equal(lazy.day('c', 1).blocks[0].items[0].ex, 'row');
  assert.deepEqual(lazy.programsUsing('row'), ['c']);
});

test('programsUsing agrees with scanning every day of every real program', () => {
  const real = require('./helpers/library.js').library(), all = createProgramCatalogue(inlined(real));
  const uses = (p, id) => p.days.some((w) => [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id));
  ['pushup', 'kb_swing', 'plank', 'pullup'].forEach((id) => assert.deepEqual(all.programsUsing(id), real.filter((p) => uses(p, id)).map((p) => p.id), id));
});

test('the page modules read programs only through the catalogue', () => {
  const src = [...require('../build.js').PAGES, 'app/main.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /\bPROGRAMS\b/);
  assert.doesNotMatch(src, /\bPROGRAM_SUMMARIES\b/, 'the list is data/library.json, not in the page');
  assert.equal((src.match(/setSource\('library'/g) || []).length, 1, 'the library source is set once, when the list arrives');
  assert.doesNotMatch(src, /\bPBYID\b/);
});

test('warm-up and cool-down exercises count as used; a day may have neither', () => {
  assert.deepEqual(cat.summary('b').exercises, ['child_pose', 'plank']);
  assert.deepEqual(cat.programsUsing('child_pose'), ['b']);
});

// ---------- programs loaded when opened, and kept for offline ----------
const { fetched } = require('../app/programs.js');
const summaries = programs.map((p) => ({ id: p.id, name: p.name, dayCount: p.days.length, exercises: [] }));
function fakeNet() {
  const net = { online: true, calls: [], cache: {} };
  net.fetchJson = (url) => { net.calls.push(url); return net.online ? Promise.resolve(JSON.parse(JSON.stringify(programs.find((p) => url === `data/${p.id}.json`)))) : Promise.reject(new Error('offline')); };
  net.store = { get: (url) => Promise.resolve(net.cache[url]), put: (url, v) => { net.cache[url] = v; return Promise.resolve(); } };
  return net;
}

test('fetched: a program loads once from data/<id>.json and is kept in the offline cache', async () => {
  const net = fakeNet(), c = createProgramCatalogue(fetched(summaries, { fetchJson: net.fetchJson, cache: net.store }));
  assert.equal(c.get('a'), undefined, 'nothing until loaded');
  assert.deepEqual(c.list().map((s) => s.id), ['a', 'b'], 'the list is there from the start');
  const [p1, p2] = await Promise.all([c.load('a'), c.load('a')]);
  assert.equal(p1.name, 'Alpha'); assert.equal(p1, p2);
  assert.deepEqual(net.calls, ['data/a.json']);
  assert.equal(net.cache['data/a.json'].name, 'Alpha');
  assert.equal(c.day('a', 2).blocks[0].items[0].ex, 'row');
});

test('fetched: offline, a program comes from the cache; with neither, the load fails and can be tried again', async () => {
  const net = fakeNet();
  net.cache['data/b.json'] = programs[1];
  net.online = false;
  const c = createProgramCatalogue(fetched(summaries, { fetchJson: net.fetchJson, cache: net.store }));
  assert.equal((await c.load('b')).name, 'Bravo');
  await assert.rejects(c.load('a'), /Alpha isn't available offline yet/);
  net.online = true;
  assert.equal((await c.load('a')).name, 'Alpha', 'a later try works');
});

test('loadEverything: the given programs first, then the rest, one at a time, telling as each arrives', async () => {
  const net = fakeNet(), c = createProgramCatalogue(fetched(summaries, { fetchJson: net.fetchJson, cache: net.store }));
  const arrived = [];
  await c.loadEverything(['b'], (pid) => arrived.push(pid));
  assert.deepEqual(net.calls, ['data/b.json', 'data/a.json']);
  assert.deepEqual(arrived, ['b', 'a']);
  assert.ok(c.ids().every((id) => c.get(id)));
  net.online = false;
  const d = createProgramCatalogue(fetched(summaries, { fetchJson: net.fetchJson, cache: { get: () => Promise.resolve(undefined), put: () => Promise.resolve() } }));
  await d.loadEverything([], () => {}); // offline with nothing cached: gives up quietly, tries again next time
  assert.equal(d.get('a'), undefined);
});

test('a cache that can\'t be written still opens the program; programs already loaded are not fetched again', async () => {
  const net = fakeNet();
  const c = createProgramCatalogue(fetched(summaries, { fetchJson: net.fetchJson, cache: { get: () => Promise.resolve(undefined), put: () => Promise.reject(new Error('quota')) } }));
  assert.equal((await c.load('a')).name, 'Alpha');
  await c.loadEverything([], () => {});
  assert.deepEqual(net.calls, ['data/a.json', 'data/b.json']);
});

// ---------- several sources: the library plus your own programs ----------
const own = (id, name, ex = 'row') => ({ id: `own-${id}`, name, subject: 'Strength', days: [day(1, [ex])] });
const ownSource = (list, extra = {}) => ({ ...inlined(list, 'own'), first: true, ...extra });

test('two sources: ids from both, own programs listed first, library order kept, each summary names its source', () => {
  const c = createProgramCatalogue(inlined(programs), ownSource([own('x', 'Mine'), own('y', 'Mine 2')]));
  assert.deepEqual(c.ids(), ['own-x', 'own-y', 'a', 'b']);
  assert.deepEqual(c.list().map((s) => s.source), ['own', 'own', 'library', 'library']);
  assert.equal(c.summary('own-x').name, 'Mine');
  assert.equal(c.summary('b').source, 'library');
  assert.ok(c.has('own-y') && c.has('a'));
  assert.equal(c.get('own-x').name, 'Mine');
  assert.equal(c.day('a', 1).blocks[0].items[0].ex, 'pushup');
  assert.deepEqual(c.programsUsing('row'), ['own-x', 'own-y', 'a']);
});

test('sources without "first" are listed in the order given', () => {
  const c = createProgramCatalogue(inlined([own('x', 'Mine')], 'own'), inlined(programs));
  assert.deepEqual(c.ids(), ['own-x', 'a', 'b']);
  const d = createProgramCatalogue(inlined(programs), inlined([own('x', 'Mine')], 'own'));
  assert.deepEqual(d.ids(), ['a', 'b', 'own-x']);
});

test('load asks the source the program belongs to', async () => {
  const asked = [];
  const mk = (name, list) => ({ name, summaries: list.map(summarize), load: (pid) => { asked.push(`${name}:${pid}`); return Promise.resolve(list.find((p) => p.id === pid)); } });
  const c = createProgramCatalogue(mk('library', programs), { ...mk('own', [own('x', 'Mine')]), first: true });
  assert.equal(c.get('own-x'), undefined);
  assert.equal((await c.load('own-x')).name, 'Mine');
  assert.equal((await c.load('b')).name, 'Bravo');
  assert.deepEqual(asked, ['own:own-x', 'library:b']);
  await c.loadEverything([], () => {});
  assert.deepEqual(asked, ['own:own-x', 'library:b', 'library:a'], 'only what is not loaded yet, across sources');
});

test('an id in two sources throws, at creation and when a source is replaced', () => {
  assert.throws(() => createProgramCatalogue(inlined(programs), inlined([{ ...programs[0] }], 'own')), /"a" is in both library and own/);
  const c = createProgramCatalogue(inlined(programs), ownSource([]));
  assert.throws(() => c.setSource('own', inlined([{ ...programs[1] }], 'own')), /"b" is in both/);
  assert.deepEqual(c.ids(), ['a', 'b'], 'unchanged after the refusal');
  assert.throws(() => createProgramCatalogue({ summaries: [], load() {} }), /needs a name/);
  assert.throws(() => createProgramCatalogue(inlined(programs), inlined([], 'library')), /two sources named library/);
});

test('setSource replaces a source at runtime: list, has, summary, get and change listeners follow', async () => {
  const c = createProgramCatalogue(inlined(programs), ownSource([own('x', 'Mine')]));
  const heard = [];
  const off = c.onChange(() => heard.push(c.ids().join()));
  assert.equal(c.get('own-x').name, 'Mine');
  c.setSource('own', ownSource([own('x', 'Mine renamed', 'plank'), own('z', 'New')]));
  assert.deepEqual(c.ids(), ['own-x', 'own-z', 'a', 'b']);
  assert.equal(c.summary('own-x').name, 'Mine renamed');
  assert.equal(c.get('own-x').name, 'Mine renamed', 'the new source\'s programs, not the old ones');
  assert.deepEqual(c.programsUsing('plank'), ['own-x', 'b']);
  c.setSource('own', ownSource([]));
  assert.equal(c.has('own-x'), false);
  assert.equal(c.get('own-x'), undefined);
  assert.deepEqual(c.ids(), ['a', 'b']);
  assert.equal(await c.load('own-x'), undefined);
  off();
  c.setSource('own', ownSource([own('q', 'Later')]));
  assert.deepEqual(heard, ['own-x,own-z,a,b', 'a,b'], 'no call after unsubscribing');
  assert.ok(c.has('own-q'));
});

test('setSource adds a source that was not there, and drops what the replaced source was loading', async () => {
  const c = createProgramCatalogue(inlined(programs));
  c.setSource('own', ownSource([own('x', 'Mine')]));
  assert.deepEqual(c.ids(), ['own-x', 'a', 'b']);
  let finish;
  const slow = { name: 'own', summaries: [summarize(own('s', 'Slow'))], load: () => new Promise((r) => { finish = r; }) };
  c.setSource('own', slow);
  const pending = c.load('own-s');
  c.setSource('own', ownSource([own('s', 'Fast')]));
  finish(own('s', 'Slow'));
  await pending;
  assert.equal(c.get('own-s').name, 'Fast', 'a load that finishes after its source was replaced is not kept');
});

// ---------- the slim summaries and the exercise index (ticket 7b) ----------
const { slim, firstSentence, usageIndex } = require('../app/programs.js');
const slimSummaries = summaries.map(({ exercises, ...s }) => s); // the page's summaries have no exercise lists

test('firstSentence: up to the first full stop, question or exclamation mark; a paragraph without one whole', () => {
  assert.equal(firstSentence('One. Two.'), 'One.');
  assert.equal(firstSentence('Really? Yes!'), 'Really?');
  assert.equal(firstSentence('No end'), 'No end');
});

test('slim keeps what the cards and filters need, with the first sentence of the paragraph (or the blurb) as `about`', () => {
  const full = summarize({ id: 'a', name: 'Alpha', subject: 'Strength', split: 'S', minutes: [20, 30], formats: ['straight'], equip: 'kb', about: 'First one. Second one.', blurb: 'Blurb.', levels: ['I'], rests: {}, dayTypes: {}, gear: 'g', days: [day(1, ['row'])] });
  assert.deepEqual(slim(full), { id: 'a', name: 'Alpha', subject: 'Strength', split: 'S', minutes: [20, 30], formats: ['straight'], equip: 'kb', dayCount: 1, about: 'First one.' });
  assert.equal(slim({ ...full, about: undefined }).about, 'Blurb.');
  assert.deepEqual(Object.keys(slim({ id: 'b', name: 'B', about: 'x', dayCount: 2 })), ['id', 'name', 'dayCount', 'about'], 'what a program does not have stays out');
});

test('usageIndex: exercise -> the programs that use it, in list order', () => {
  assert.deepEqual(usageIndex(programs), { arm_circle: ['a'], pushup: ['a'], row: ['a'], squat: ['a'], child_pose: ['b'], plank: ['b'] });
});

test('a source with an exercise index: programsUsing waits for loadUsage, then follows the index; sources with lists need no index', async () => {
  let asked = 0;
  const usage = { load: async () => { asked++; return usageIndex(programs); } };
  const lib = { ...fetched(slimSummaries, { fetchJson: async () => null, cache: { get: async () => null, put: async () => {} }, usage }) };
  const c = createProgramCatalogue(lib, ownSource([own('x', 'Mine', 'plank')]));
  assert.equal(c.usageReady(), false);
  assert.deepEqual(c.programsUsing('plank'), ['own-x'], 'own programs carry their lists');
  await Promise.all([c.loadUsage(), c.loadUsage()]);
  await c.loadUsage();
  assert.equal(c.usageReady(), true);
  assert.equal(asked, 1);
  assert.deepEqual(c.programsUsing('plank'), ['own-x', 'b']);
  assert.deepEqual(c.programsUsing('row'), ['a']);
  assert.deepEqual(c.programsUsing('nothing'), []);
  c.setSource('library', lib); // replaced: asked again
  assert.equal(c.usageReady(), false);
  await c.loadUsage();
  assert.equal(asked, 2);
  await createProgramCatalogue(inlined(programs)).loadUsage(); // nothing to load
  assert.equal(createProgramCatalogue(inlined(programs)).usageReady(), true);
});

test('loadUsage fails when the index is not available (the page says so); asking again can work', async () => {
  let up = false;
  const usage = { load: async () => { if (!up) throw new Error('not offline yet'); return {}; } };
  const c = createProgramCatalogue({ ...fetched(slimSummaries, { fetchJson: async () => null, cache: { get: async () => null, put: async () => {} }, usage }) });
  await assert.rejects(c.loadUsage(), /not offline yet/);
  assert.equal(c.usageReady(), false);
  up = true;
  await c.loadUsage();
  assert.equal(c.usageReady(), true);
});

test('an exercise index that arrives after its source was replaced is dropped, not kept for the new source', async () => {
  let finish;
  const usage = { load: () => new Promise((r) => { finish = r; }) };
  const mk = () => fetched(slimSummaries, { fetchJson: async () => null, cache: { get: async () => null, put: async () => {} }, usage });
  const c = createProgramCatalogue(mk());
  const first = c.loadUsage();
  c.setSource('library', mk());
  finish({ row: ['a'] });
  await first;
  assert.equal(c.usageReady(), false);
  const failing = { load: () => Promise.reject(new Error('late failure')) };
  const d = createProgramCatalogue({ ...mk(), usage: failing });
  const late = d.loadUsage();
  d.setSource('library', { ...mk(), usage: { load: async () => ({}) } });
  await assert.rejects(late, /late failure/);
  await d.loadUsage();
  assert.equal(d.usageReady(), true);
});

// Phase 23 (docs/plans/phase-23-fitness-programs.md, decisions 83, 87, 184, 185, 205): the new fitness programs. Built
// here one config at a time (never the whole library): per subject the new count, catalogue 13, some Phase 22 moves in
// every program, the minutes spread, a fifth at 30 days, gear in the subject's old shares, no two alike.
const P23 = { Strength: 10, 'Busy week': 9, Bodyweight: 10, 'Kettlebell only': 9, 'Kettlebell complexes': 5, 'Pull-ups': 8, 'Climber / pull strength': 4, Chest: 4, Back: 4, Shoulders: 4, Arms: 4, 'Neck & traps': 4, 'Grip & forearms': 5 }; // tickets 3–5; later tickets add their subjects here
const { CONFIGS: ALL_CONFIGS, buildConfig } = require('../program-builder.js');
const { EX: EX23 } = require('../exercises.js');
const new23 = (s) => ALL_CONFIGS.filter((c) => c.subject === s && c.added === 23 && !c.step);
const mid = (c) => (c.minutes[0] + c.minutes[1]) / 2;
const band = (c) => (mid(c) >= 35 && mid(c) <= 38 ? 'long' : mid(c) >= 31 && mid(c) < 35 ? 'mid' : mid(c) < 31 ? 'short' : 'over');
const spread = (list) => ({ long: Math.round(list.length / 2), mid: Math.round(list.length / 4) });
const formatsOf = (c) => [...new Set(Object.values(c.dayTypes).flatMap((t) => (t.blocks || []).map((b) => b.f)))].sort().join('+');

test('Phase 23: each subject\'s new count, at catalogue 13, each program using some Phase 22 exercises', () => {
  Object.entries(P23).forEach(([s, n]) => {
    const list = new23(s);
    assert.equal(list.length, n, s);
    list.forEach((c) => {
      assert.equal(c.catalogue, 13, c.id);
      const p = buildConfig(c);
      assert.ok(p.days.some((d) => d.blocks.some((b) => b.items.some((it) => EX23[it.ex].added === 13))), `${c.id} uses an added: 13 exercise`);
    });
  });
});

test('Phase 23: the minutes spread per subject (half 35–38, a quarter 31–35, the rest shorter), the 30-day fifth too', () => {
  Object.keys(P23).forEach((s) => {
    const list = new23(s), want = spread(list), count = (l, b) => l.filter((c) => band(c) === b).length;
    assert.equal(count(list, 'long'), want.long, `${s} 35–38`);
    assert.equal(count(list, 'mid'), want.mid, `${s} 31–35`);
    assert.equal(count(list, 'over'), 0, `${s} over 38`);
    const month = list.filter((c) => c.days === 30), wantM = spread(month);
    assert.equal(month.length, Math.round(list.length / 5), `${s} a fifth at 30 days`);
    assert.equal(count(month, 'long'), wantM.long, `${s} 30-day 35–38`);
    assert.equal(count(month, 'mid'), wantM.mid, `${s} 30-day 31–35`);
  });
});

test('Phase 23: gear in each subject\'s old shares (full gear, one kettlebell, no equipment), within one program', () => {
  Object.keys(P23).forEach((s) => {
    const old = ALL_CONFIGS.filter((c) => c.subject === s && c.added !== 23), list = new23(s);
    ['all', 'kb', 'bw'].forEach((g) => {
      const share = old.filter((c) => (c.equip || 'all') === g).length / old.length;
      const got = list.filter((c) => (c.equip || 'all') === g).length;
      assert.ok(Math.abs(got - share * list.length) <= 1, `${s} ${g}: ${got}, about ${(share * list.length).toFixed(1)}`);
    });
  });
});

test('Phase 23: no two programs of a subject share split and formats; names are new and each has 20 day names', () => {
  const older = new Set(ALL_CONFIGS.filter((c) => c.added !== 23).map((c) => c.name));
  Object.keys(P23).forEach((s) => {
    const seen = {};
    new23(s).forEach((c) => {
      const k = `${c.split} | ${formatsOf(c)}`;
      assert.ok(!seen[k], `${c.id} and ${seen[k]} share ${k}`);
      seen[k] = c.id;
      assert.ok(!older.has(c.name), `${c.id}: ${c.name} is an older program's name`);
      assert.equal(new Set(c.names).size, 20, `${c.id}: 20 day names`);
    });
  });
});
