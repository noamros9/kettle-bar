// Progress Store, account data: own programs, random workouts and preferences (users/{uid}/programs|random|prefs).
// Same store, same remote adapter seam; progress itself is untouched (see the last tests).
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } });
const tick = () => new Promise((r) => setTimeout(r, 5));
let n = 0;
const make = (opts = {}) => { const s = createStore({ programIds: ['p'], storage: memStorage(), now: () => 'T' + ++n, retryDelay: () => 0, ...opts }); s.load(); return s; };

test('the in-memory remote round-trips a document in each new collection', async () => {
  const remote = createMemoryRemote();
  for (const [col, id] of [['programs', 'a'], ['random', 'r1'], ['prefs', 'main']]) {
    const got = []; const off = remote.subscribe(col, id, (d) => got.push(d)); await tick();
    await remote.write(col, id, { name: col, list: [1, 2] });
    assert.deepEqual(got, [null, { name: col, list: [1, 2] }]);
    assert.deepEqual(remote.collections[col][id], { name: col, list: [1, 2] });
    off();
  }
  const all = []; remote.subscribeAll('programs', (d) => all.push(d)); await tick();
  await remote.write('programs', 'b', { name: 'b' });
  assert.deepEqual(all, [{ a: { name: 'programs', list: [1, 2] } }, { a: { name: 'programs', list: [1, 2] }, b: { name: 'b' } }]);
  await remote.remove('programs', 'a');
  assert.deepEqual(all.at(-1), { b: { name: 'b' } });
  assert.equal(remote.docs, remote.collections.progress, 'docs stays the progress documents');
});

test('the in-memory remote keeps collections apart, copies what it stores, and fails writes and removes with failWith', async () => {
  const remote = createMemoryRemote({ p: { done: {} } }, { collections: { random: { r: { name: 'r' } } } });
  assert.deepEqual(Object.keys(remote.collections.programs), []);
  const body = { a: [1] }; await remote.write('prefs', 'main', body); body.a.push(2);
  assert.deepEqual(remote.collections.prefs.main, { a: [1] });
  const got = []; const off = remote.subscribeAll('random', (d) => got.push(d)); await tick(); off();
  await remote.write('random', 'q', {}); await remote.remove('random', 'nothing-here');
  assert.deepEqual(got, [{ r: { name: 'r' } }]);
  const broken = createMemoryRemote({}, { failWith: 'permission-denied' });
  await assert.rejects(broken.write('prefs', 'main', {}), { code: 'permission-denied' });
  await assert.rejects(broken.remove('prefs', 'main'), { code: 'permission-denied' });
});

test('a doc is kept on the device under kb-doc-<collection>-<id> with an index kb-docs-<collection>, and survives a reload', () => {
  const storage = memStorage(), store = make({ storage });
  store.setDoc('programs', 'my-push', { name: 'Push' });
  store.setDoc('programs', 'a', { name: 'A' });
  store.setDoc('prefs', 'main', { favourites: ['x'] });
  assert.deepEqual(Object.keys(storage.m).sort(), ['kb-doc-prefs-main', 'kb-doc-programs-a', 'kb-doc-programs-my-push', 'kb-docs-prefs', 'kb-docs-programs']);
  assert.equal(storage.m['kb-docs-programs'], '["a","my-push"]');
  assert.deepEqual(JSON.parse(storage.m['kb-doc-programs-my-push']), { name: 'Push', updatedAt: store.doc('programs', 'my-push').updatedAt });
  const again = createStore({ programIds: ['p'], storage }); again.load();
  assert.deepEqual(again.docs('programs'), store.docs('programs'));
  assert.deepEqual(again.doc('prefs', 'main').favourites, ['x']);
  assert.deepEqual(again.docs('random'), {});
});

test('a saved doc is stamped with the time, is a copy both ways, and reading what is not there gives null', () => {
  const store = make(); const body = { name: 'Push', picks: [1] };
  store.setDoc('random', 'r', body); body.picks.push(2);
  const got = store.doc('random', 'r');
  assert.match(got.updatedAt, /^T\d+$/);
  assert.deepEqual(got.picks, [1]);
  got.picks.push(3); store.docs('random').r.picks.push(4);
  assert.deepEqual(store.doc('random', 'r').picks, [1]);
  assert.equal(store.doc('random', 'nope'), null);
  store.setDoc('random', 'r', { ...got, name: 'again' });
  assert.notEqual(store.doc('random', 'r').updatedAt, got.updatedAt, 'every save restamps');
});

test('only the three account collections can be used, and progress keeps its own calls', () => {
  const store = make();
  for (const col of ['progress', 'other', undefined]) {
    assert.throws(() => store.setDoc(col, 'x', {}), /Unknown collection/);
    assert.throws(() => store.doc(col, 'x'), /Unknown collection/);
    assert.throws(() => store.docs(col), /Unknown collection/);
    assert.throws(() => store.deleteDoc(col, 'x'), /Unknown collection/);
    assert.throws(() => store.replaceDocs(col, {}), /Unknown collection/);
  }
});

test('a corrupt, missing or unreadable device doc loads as nothing; a full device never stops a save', () => {
  const m = { 'kb-docs-programs': '["ok","bad","gone","blocked"]', 'kb-doc-programs-ok': '{"name":"ok"}', 'kb-doc-programs-bad': '{oops', 'kb-docs-random': '{oops', 'kb-docs-prefs': '"main"' };
  const store = createStore({ programIds: [], storage: { get: (k) => { if (k.endsWith('blocked')) throw new Error('blocked'); return m[k] ?? null; }, set() { throw new Error('quota'); }, remove() { throw new Error('blocked'); } } });
  store.load();
  assert.deepEqual(store.docs('programs'), { ok: { name: 'ok' } });
  assert.deepEqual(store.docs('random'), {});
  assert.deepEqual(store.docs('prefs'), {});
  store.setDoc('programs', 'new', { name: 'x' });
  store.deleteDoc('programs', 'new');
  assert.equal(store.doc('programs', 'new'), null);
});

test('deleting a doc removes it from the device (key and index), the cloud, and says so', async () => {
  const storage = memStorage(), remote = createMemoryRemote();
  const store = make({ storage }); store.attach(remote); await tick();
  store.setDoc('programs', 'a', { name: 'A' }); store.setDoc('programs', 'b', { name: 'B' }); await store.flush();
  const seen = []; store.on('docs', (c) => seen.push(c));
  store.deleteDoc('programs', 'a'); await store.flush();
  assert.equal(store.doc('programs', 'a'), null);
  assert.equal(storage.m['kb-doc-programs-a'], undefined);
  assert.equal(storage.m['kb-docs-programs'], '["b"]');
  assert.deepEqual(Object.keys(remote.collections.programs), ['b']);
  assert.ok(seen.includes('programs'));
  store.deleteDoc('programs', 'never-there'); await store.flush(); // nothing to remove, nothing written
});

test('a device without remove clears a deleted doc\'s text instead', () => {
  const m = {}, storage = { get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } };
  const store = make({ storage });
  store.setDoc('programs', 'a', { name: 'A' }); store.deleteDoc('programs', 'a');
  assert.equal(m['kb-doc-programs-a'], '');
  const again = createStore({ programIds: [], storage }); again.load();
  assert.deepEqual(again.docs('programs'), {});
});

test('first sync: device and cloud docs combine (union by id, newer updatedAt wins) and the device\'s newer ones go up', async () => {
  const storage = memStorage(), store = make({ storage, now: () => '2026-09-29T10:00:00.000Z' });
  store.setDoc('programs', 'mine', { name: 'device only' });
  store.setDoc('programs', 'both', { name: 'device newer' });
  store.setDoc('programs', 'old', { name: 'device older' });
  const remote = createMemoryRemote({}, { collections: { programs: {
    both: { name: 'cloud older', updatedAt: '2026-09-01T00:00:00.000Z' },
    old: { name: 'cloud newer', updatedAt: '2026-10-01T00:00:00.000Z' },
    web: { name: 'cloud only', updatedAt: '2026-09-02T00:00:00.000Z' } } } });
  const seen = []; store.on('docs', (c) => seen.push(c));
  store.attach(remote); await tick(); await store.flush();
  const names = Object.fromEntries(Object.entries(store.docs('programs')).map(([id, b]) => [id, b.name]));
  assert.deepEqual(names, { mine: 'device only', both: 'device newer', old: 'cloud newer', web: 'cloud only' });
  assert.deepEqual(Object.fromEntries(Object.entries(remote.collections.programs).map(([id, b]) => [id, b.name])), names);
  assert.ok(seen.includes('programs'));
  assert.equal(JSON.parse(storage.m['kb-doc-programs-web']).name, 'cloud only', 'the device copy has the cloud-only doc too');
});

test('first sync with nothing to send writes nothing; later snapshots replace the device set', async () => {
  const remote = createMemoryRemote({}, { collections: { random: { r: { name: 'r', updatedAt: 'a' } } } });
  const writes = []; const w = remote.write; remote.write = (...a) => { writes.push(a); return w(...a); };
  const store = make(); store.attach(remote); await tick(); await store.flush();
  assert.deepEqual(writes.filter((w) => w[0] !== 'progress'), []);
  assert.deepEqual(Object.keys(store.docs('random')), ['r']);
  await w('random', 's', { name: 's' }); await remote.remove('random', 'r');
  assert.deepEqual(Object.keys(store.docs('random')), ['s']);
});

test('a cloud snapshot never undoes a doc whose write is still on its way (nor brings back one being deleted)', async () => {
  let push; const held = [];
  const manual = { subscribe: (c, id, onData) => { onData(null); return () => {}; },
    subscribeAll: (c, onDocs) => { if (c === 'programs') push = onDocs; onDocs({ gone: { name: 'old', updatedAt: '1' } }); return () => {}; },
    write: (c, id) => (c === 'progress' ? Promise.resolve() : new Promise((r) => held.push(r))), remove: async () => {} };
  const store = make(); store.attach(manual); await tick();
  store.setDoc('programs', 'new', { name: 'new' }); store.deleteDoc('programs', 'gone');
  push({ gone: { name: 'old', updatedAt: '1' }, other: { name: 'other', updatedAt: '2' } });
  assert.deepEqual(Object.keys(store.docs('programs')).sort(), ['new', 'other'], 'kept the pending one, dropped the one being deleted, took the new one');
  await tick(); held.forEach((r) => r()); await store.flush();
  push({ other: { name: 'other', updatedAt: '2' } });
  assert.deepEqual(Object.keys(store.docs('programs')), ['other'], 'once nothing is pending the cloud\'s set is the truth');
});

test('setDoc and replaceDocs write through when signed in; replaceDocs sets exactly the given docs and keeps their own stamps', async () => {
  const remote = createMemoryRemote(), store = make();
  store.attach(remote); await tick();
  store.setDoc('programs', 'a', { name: 'A' }); store.setDoc('programs', 'b', { name: 'B' }); await store.flush();
  assert.deepEqual(Object.keys(remote.collections.programs), ['a', 'b']);
  const q = store.replaceDocs('programs', { b: { name: 'B2', updatedAt: 'X' }, c: { name: 'C' } });
  assert.ok(q && typeof q.then === 'function');
  await store.flush();
  assert.deepEqual(store.docs('programs').b, { name: 'B2', updatedAt: 'X' });
  assert.match(store.doc('programs', 'c').updatedAt, /^T\d+$/, 'a doc without a stamp gets one');
  assert.deepEqual(Object.keys(remote.collections.programs).sort(), ['b', 'c']);
  assert.deepEqual(remote.collections.programs.b, { name: 'B2', updatedAt: 'X' });
});

test('two devices sharing one account: a prefs doc written on one appears on the other', async () => {
  const remote = createMemoryRemote();
  const one = make(), two = make();
  one.attach(remote); two.attach(remote); await tick();
  one.setDoc('prefs', 'main', { favourites: ['pushup'], hidden: [], travel: true }); await one.flush();
  assert.deepEqual(two.doc('prefs', 'main').favourites, ['pushup']);
  two.setDoc('prefs', 'main', { ...two.doc('prefs', 'main'), travel: false }); await two.flush();
  assert.equal(one.doc('prefs', 'main').travel, false);
});

test('signing out keeps the device docs; a doc saved signed out goes up at the next first sync', async () => {
  const store = make(); const remote = createMemoryRemote();
  store.attach(remote); await tick(); store.detach();
  store.setDoc('prefs', 'main', { travel: true }); await store.flush();
  assert.equal(remote.collections.prefs.main, undefined);
  store.attach(remote); await tick(); await store.flush();
  assert.equal(remote.collections.prefs.main.travel, true);
});

test('rules not published yet: refused docs never touch progress or the sync status, and stay on the device', async () => {
  const warn = console.warn; console.warn = () => {};
  const denied = (target) => { const e = new Error('denied'); e.code = 'permission-denied'; throw Object.assign(e, { target }); };
  const remote = createMemoryRemote();
  const write = remote.write, remove = remote.remove;
  remote.write = (col, id, body) => (col === 'progress' ? write(col, id, body) : denied(col));
  remote.remove = (col, id) => denied(col);
  remote.subscribeAll = (col, onDocs, onErr) => { onErr(Object.assign(new Error('Missing or insufficient permissions'), { code: 'permission-denied' })); return () => {}; };
  const store = make(); store.attach(remote); await tick();
  store.setDoc('programs', 'a', { name: 'A' }); store.deleteDoc('programs', 'a'); store.setDoc('prefs', 'main', { travel: true });
  store.toggle('p', 1); await store.flush();
  console.warn = warn;
  assert.equal(store.status, 'ok');
  assert.equal(store.readonly, false);
  assert.deepEqual(Object.keys(remote.docs.p.done), ['1'], 'progress was written');
  assert.ok(store.isDone('p', 1));
  assert.equal(store.doc('prefs', 'main').travel, true);
});

test('a doc write that fails with anything else is also kept quiet: the device copy stands', async () => {
  const warn = console.warn; console.warn = () => {};
  const remote = createMemoryRemote({}, { collections: { prefs: {} } });
  remote.write = async (col) => { if (col !== 'progress') { const e = new Error('x'); throw e; } };
  const store = make(); store.attach(remote); await tick();
  store.setDoc('prefs', 'main', { travel: true }); await store.flush();
  console.warn = warn;
  assert.equal(store.status, 'ok');
  assert.equal(store.doc('prefs', 'main').travel, true);
});

test('progress: device strings and the cloud document are exactly what they were before account data', async () => {
  const storage = memStorage(), remote = createMemoryRemote();
  const calls = []; const sub = remote.subscribe, wr = remote.write;
  remote.subscribe = (col, id, ...r) => { calls.push(['subscribe', col, id]); return sub(col, id, ...r); };
  remote.write = (col, id, body) => { calls.push(['write', col, id]); return wr(col, id, body); };
  const store = createStore({ programIds: ['p'], storage, now: () => '2026-09-29T10:00:00.000Z' }); store.load();
  store.attach(remote); await tick();
  store.toggle('p', 2); store.toggle('p', 1);
  store.setSwaps('p', [{ day: 3, ex: 'pushup', to: 'pike_pushup', onward: true }]); await store.flush();
  const swap = { day: 3, ex: 'pushup', to: 'pike_pushup', onward: true };
  assert.deepEqual(storage.m, {
    'kb-progress-p': '{"1":"2026-09-29T10:00:00.000Z","2":"2026-09-29T10:00:00.000Z"}',
    'kb-swaps-p': JSON.stringify([swap]),
    'kb-past-p': '[]',
  });
  assert.equal(JSON.stringify(remote.docs.p), '{"done":{"1":"2026-09-29T10:00:00.000Z","2":"2026-09-29T10:00:00.000Z"},"swaps":[{"day":3,"ex":"pushup","to":"pike_pushup","onward":true}],"past":[],"updatedAt":"2026-09-29T10:00:00.000Z"}');
  assert.deepEqual(Object.keys(remote.docs), ['p']);
  assert.deepEqual(calls[0], ['subscribe', 'progress', 'p']);
  assert.ok(calls.slice(1).every((c) => c[0] === 'write' && c[1] === 'progress' && c[2] === 'p'));
  assert.equal(Object.keys(storage.m).length, 3, 'no account-data keys appear');
});

test('a docs snapshot that arrives after signing out is kept on the device but not written anywhere', async () => {
  const remote = createMemoryRemote({}, { collections: { random: { web: { name: 'web', updatedAt: '1' } } } });
  const store = make(); store.setDoc('random', 'mine', { name: 'mine' });
  store.attach(remote); store.detach(); await tick(); await store.flush();
  assert.deepEqual(Object.keys(store.docs('random')).sort(), ['mine', 'web']);
  assert.deepEqual(Object.keys(remote.collections.random), ['web']);
});
