// Program Catalogue: which programs exist, one program's days, and who uses an exercise.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { createProgramCatalogue, inlined } = require('../app/programs.js');
const { buildAll } = require('../program-builder.js');

const day = (n, exs, warm = []) => ({ day: n, blocks: [{ items: exs.map((ex) => ({ ex, n: 5 })) }], warmup: { items: warm.map((ex) => ({ ex, n: 30 })) } });
const programs = [
  { id: 'a', name: 'Alpha', subject: 'Strength', days: [day(1, ['pushup', 'squat'], ['arm_circle']), day(2, ['row'])] },
  { id: 'b', name: 'Bravo', subject: 'Core', days: [{ day: 1, blocks: [{ items: [{ ex: 'plank', n: 30 }] }], cooldown: { items: [{ ex: 'child_pose', n: 60 }] } }] },
];
const cat = createProgramCatalogue(inlined(programs));

test('lists every program without its days, with how many days and which exercises it uses', () => {
  assert.deepEqual(cat.ids(), ['a', 'b']);
  assert.deepEqual(cat.list()[0], { id: 'a', name: 'Alpha', subject: 'Strength', dayCount: 2, exercises: ['arm_circle', 'pushup', 'row', 'squat'] });
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
  const lazy = createProgramCatalogue({ summaries: [{ id: 'c', name: 'Charlie', dayCount: 1, exercises: ['row'] }], load: () => new Promise((r) => { resolveLoad = r; }) });
  assert.equal(lazy.get('c'), undefined);
  const loading = lazy.load('c');
  assert.equal(lazy.load('c'), loading, 'one load at a time');
  resolveLoad({ id: 'c', name: 'Charlie', days: [day(1, ['row'])] });
  await loading;
  assert.equal(lazy.day('c', 1).blocks[0].items[0].ex, 'row');
  assert.deepEqual(lazy.programsUsing('row'), ['c']);
});

test('programsUsing agrees with scanning every day of every real program', () => {
  const real = buildAll(), all = createProgramCatalogue(inlined(real));
  const uses = (p, id) => p.days.some((w) => [...w.blocks.flatMap((b) => b.items), ...(w.warmup ? w.warmup.items : []), ...(w.cooldown ? w.cooldown.items : [])].some((it) => it.ex === id));
  ['pushup', 'kb_swing', 'plank', 'pullup'].forEach((id) => assert.deepEqual(all.programsUsing(id), real.filter((p) => uses(p, id)).map((p) => p.id), id));
});

test('the page modules read programs only through the catalogue', () => {
  const src = ['app/views.js', 'app/main.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /\bPROGRAMS\b/);
  assert.equal((src.match(/\bPROGRAM_SUMMARIES\b/g) || []).length, 1, 'only where the catalogue is created');
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
