// Progress Store, edge by edge: storage failures, sync errors and retries, statuses, events.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote, mergeFirstSync } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } });
const tick = () => new Promise((r) => setTimeout(r, 5));
const make = (opts = {}) => { const s = createStore({ programIds: ['p', 'q'], storage: memStorage(), now: () => 't', retryDelay: () => 0, ...opts }); s.load(); return s; };
// a remote whose writes fail with the given codes, in order, then succeed
const flaky = (...codes) => {
  const writes = [];
  return { writes, kind: 'flaky', subscribe: (pid, onData) => { onData({}); return () => {}; },
    async write(pid, body) { writes.push(body); const c = codes.shift(); if (c !== undefined) { if (c === null) throw null; const e = new Error(c); e.code = c; throw e; } } };
};

test('defaults: real clock, online, and a random retry delay', () => {
  const store = createStore({ programIds: ['p'], storage: memStorage() });
  store.load(); store.toggle('p', 1);
  assert.match(store.days('p')[1], /^\d{4}-\d\d-\d\dT/);
  assert.equal(store.status, 'local');
});

test('a corrupt or unreadable device copy loads as nothing done', () => {
  const store = createStore({ programIds: ['p', 'q', 'r'], storage: { get: (k) => { if (k.endsWith('q')) throw new Error('blocked'); return k.endsWith('p') ? '{oops' : 'null'; }, set() {} } });
  store.load();
  assert.deepEqual([store.count('p'), store.count('q'), store.count('r')], [0, 0, 0]);
});

test('a full or blocked device copy never stops a tick', () => {
  const store = createStore({ programIds: ['p'], storage: { get: () => null, set() { throw new Error('quota'); } } });
  store.load(); store.toggle('p', 4);
  assert.ok(store.isDone('p', 4));
});

test('ticking twice un-ticks; unknown programs read as empty', () => {
  const store = make();
  store.toggle('p', 2); store.toggle('p', 2);
  assert.equal(store.isDone('p', 2), false);
  assert.equal(store.isDone('zzz', 1), false);
  assert.equal(store.count('zzz'), 0);
  assert.deepEqual(store.days('zzz'), {});
});

test('days() is a copy: changing it changes nothing', () => {
  const store = make(); store.toggle('p', 1);
  store.days('p')[9] = 'x';
  assert.equal(store.isDone('p', 9), false);
});

test('signing in: setAuth says sign-in until a remote is attached, then keeps the sync status', async () => {
  const store = make();
  const auth = { signIn() {} };
  store.setAuth(auth);
  assert.equal(store.status, 'signin');
  assert.equal(store.auth, auth);
  store.attach(createMemoryRemote()); await tick();
  store.setAuth(auth);
  assert.equal(store.status, 'ok');
});

test('detach without an account goes back to device-only; a broken unsubscribe is ignored', async () => {
  const store = make();
  store.attach({ kind: 'x', subscribe: () => () => { throw new Error('gone'); }, write: async () => {} });
  assert.equal(store.remote.kind, 'x');
  store.detach();
  assert.equal(store.status, 'local');
  assert.equal(store.remote, null);
});

test('later cloud snapshots replace the device copy, and an empty one clears it', async () => {
  const remote = createMemoryRemote({ p: { 1: 'a' } });
  const store = make(); store.attach(remote); await tick();
  await remote.write('p', { done: { 2: 'b' } });
  assert.deepEqual(store.days('p'), { 2: 'b' });
  let push; const manual = { subscribe: (pid, onData) => { if (pid === 'p') push = onData; return () => {}; }, write: async () => {} };
  store.attach(manual); push({ 3: 'c' }); push(null);
  assert.deepEqual(store.days('p'), {});
});

test('a subscription error shows a sync problem', () => {
  const store = make();
  const warn = console.warn; console.warn = () => {};
  store.attach({ subscribe: (pid, onData, onErr) => { onErr(new Error('boom')); return () => {}; }, write: async () => {} });
  console.warn = warn;
  assert.equal(store.status, 'err');
});

test('a snapshot that arrives after signing out is kept on the device but not written anywhere', async () => {
  const remote = createMemoryRemote({ p: { 5: 'x' } });
  const store = make(); store.toggle('p', 1);
  store.attach(remote); store.detach(); await tick();
  assert.ok(store.isDone('p', 5) && store.isDone('p', 1));
  assert.deepEqual(remote.docs.p, { 5: 'x' });
});

test('offline: the write is marked offline, and coming back online shows saving', async () => {
  let online = false;
  const store = make({ isOnline: () => online });
  const r = flaky(); store.attach(r); await tick();
  store.toggle('p', 1);
  assert.equal(store.status, 'offline');
  online = true; store.online();
  assert.equal(store.status, 'saving');
  await store.flush();
  assert.equal(store.status, 'ok');
  store.online();
  assert.equal(store.status, 'ok');
});

test('an unavailable cloud is retried once; success is ok, a second failure is a sync problem', async () => {
  const once = make(), r1 = flaky('unavailable'); once.attach(r1); await tick();
  once.toggle('p', 1); await once.flush();
  assert.equal(once.status, 'ok'); assert.equal(r1.writes.length, 2);
  const twice = make(), r2 = flaky('unavailable', 'unavailable'); twice.attach(r2); await tick();
  twice.toggle('p', 1); await twice.flush();
  assert.equal(twice.status, 'err');
});

test('an invalid write is view-only; any other failure is a sync problem', async () => {
  const bad = make(); bad.attach(flaky('invalid_argument')); await tick();
  bad.toggle('p', 1); await bad.flush();
  assert.equal(bad.status, 'ro');
  bad.toggle('p', 2); await bad.flush();
  assert.equal(bad.status, 'ro', 'view-only stops writing');
  for (const code of ['internal', null]) {
    const other = make(); other.attach(flaky(code)); await tick();
    other.toggle('p', 1); await other.flush();
    assert.equal(other.status, 'err');
  }
});

test('a write that finishes after switching accounts does not claim ok for the new one', async () => {
  let release; const slow = { subscribe: (pid, onData) => { onData({}); return () => {}; }, write: () => new Promise((r) => { release = r; }) };
  const store = make(); store.attach(slow); await tick();
  store.toggle('p', 1); await tick();
  store.attach(flaky()); store.detach();
  release(); await store.flush();
  assert.equal(store.status, 'local');
});

test('listeners can unsubscribe', () => {
  const store = make(); const seen = [];
  const off = store.on('change', (pid) => seen.push(pid));
  store.toggle('p', 1); off(); store.toggle('p', 2);
  assert.deepEqual(seen, ['p']);
});

test('memory remote: unsubscribe stops pushes; failWith rejects with that code', async () => {
  const remote = createMemoryRemote();
  const got = []; const off = remote.subscribe('p', (d) => got.push(d)); await tick();
  off(); await remote.write('p', { done: { 1: 'a' } });
  assert.deepEqual(got, [null]);
  await createMemoryRemote().write('p', { done: { 1: 'a' } }); // nobody listening: nothing to push to
  await assert.rejects(createMemoryRemote({}, { failWith: 'unavailable' }).write('p', { done: {} }), { code: 'unavailable' });
});

test('first-sync merge with nothing on the device keeps the cloud copy', () => {
  assert.deepEqual(mergeFirstSync(undefined, { 1: 'a' }), { 1: 'a' });
});

test('ticking a program the store was not loaded with still records it', () => {
  const store = make(); store.toggle('new', 1);
  assert.ok(store.isDone('new', 1));
});

test('the default retry waits between 0.6 and 1.4 s before the second try', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const store = createStore({ programIds: ['p'], storage: memStorage(), now: () => 't' });
  store.load(); const r = flaky('unavailable');
  store.attach(r);
  store.toggle('p', 1);
  for (let i = 0; i < 5; i++) await Promise.resolve();
  t.mock.timers.tick(599);
  for (let i = 0; i < 5; i++) await Promise.resolve();
  assert.equal(r.writes.length, 1, 'not retried before 0.6 s');
  t.mock.timers.tick(801);
  await store.flush();
  assert.equal(r.writes.length, 2);
  assert.equal(store.status, 'ok');
});

test('replaceAll sets whole programs at once: device copy, one write each, change events', async () => {
  const remote = createMemoryRemote({ p: { 1: 'a' } });
  const store = make(); store.attach(remote); await tick();
  const changed = []; store.on('change', (pid) => changed.push(pid));
  await store.replaceAll({ p: { 2: 'b' }, q: { 5: 'c' } });
  assert.deepEqual(store.days('p'), { 2: 'b' });
  assert.deepEqual(remote.docs, { p: { 2: 'b' }, q: { 5: 'c' } });
  assert.deepEqual([...new Set(changed)].sort(), ['p', 'q']); // the cloud echo of each write may add more
});

test('replaceAll without an account, or view-only, stays on the device', async () => {
  const storage = memStorage();
  const store = createStore({ programIds: ['p'], storage, now: () => 't' }); store.load();
  await store.replaceAll({ p: { 3: 'x' } });
  assert.deepEqual(JSON.parse(storage.m['kb-progress-p']), { 3: 'x' });
  const ro = make(); const r = flaky('permission-denied'); ro.attach(r); await tick();
  ro.toggle('p', 1); await ro.flush();
  await ro.replaceAll({ p: { 9: 'z' } });
  assert.equal(r.writes.length, 1);
  assert.ok(ro.isDone('p', 9));
});
