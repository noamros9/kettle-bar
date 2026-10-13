// Progress Store: first-sync merge and writes, through the in-memory remote adapter.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = () => { const m = {}; return { m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } }; };
const tick = () => new Promise((r) => setTimeout(r, 5));

test('device ticks upload on first sign-in and cloud ticks come down', async () => {
  const storage = memStorage();
  const store = createStore({ programIds: ['p'], storage, now: () => 't' });
  store.load(); store.toggle('p', 1);
  const remote = createMemoryRemote({ p: { done: { 2: 'c' } } });
  store.attach(remote); await tick(); await store.flush();
  assert.deepEqual(Object.keys(remote.docs.p.done).sort(), ['1', '2']);
  assert.equal(store.count('p'), 2);
  assert.equal(JSON.parse(storage.m['kb-progress-p'])[2], 'c');
});

test('toggling writes through and emits change and status events', async () => {
  const store = createStore({ programIds: ['p'], storage: memStorage(), now: () => 't' });
  const events = [];
  store.on('change', (pid) => events.push('change:' + pid));
  store.on('status', (s) => events.push(s));
  store.load();
  const remote = createMemoryRemote();
  store.attach(remote); await tick(); await store.flush();
  store.toggle('p', 5); await store.flush();
  assert.deepEqual(remote.docs.p.done, { 5: 't' });
  assert.ok(events.includes('change:p') && events.includes('saving') && events.at(-1) === 'ok');
});

test('a refused write switches to view-only', async () => {
  const store = createStore({ programIds: ['p'], storage: memStorage() });
  store.load(); store.attach(createMemoryRemote({}, { failWith: 'permission-denied' })); await tick();
  store.toggle('p', 1); await store.flush();
  assert.equal(store.status, 'ro');
  assert.ok(store.readonly);
});

test('signing out keeps the device copy', async () => {
  const store = createStore({ programIds: ['p'], storage: memStorage() });
  store.load(); store.setAuth({}); store.attach(createMemoryRemote({ p: { done: { 3: 'x' } } })); await tick();
  store.detach();
  assert.equal(store.status, 'signin');
  assert.ok(store.isDone('p', 3));
});

// Phase 24 ticket 5 (review V A1, decision 332): one listener on the progress collection, not one per program
const counting = (remote) => {
  const calls = { subscribe: [], subscribeAll: [] };
  const sub = remote.subscribe.bind(remote), all = remote.subscribeAll.bind(remote);
  return { calls, remote: { ...remote, subscribe: (...a) => { calls.subscribe.push(a.slice(0, 2)); return sub(...a); }, subscribeAll: (...a) => { calls.subscribeAll.push(a[0]); return all(...a); } } };
};

test('attach listens to progress once, as a collection: no listener per program', async () => {
  const store = createStore({ programIds: ['a', 'b', 'c', 'd', 'e'], storage: memStorage(), now: () => 't' });
  store.load();
  const { calls, remote } = counting(createMemoryRemote({ a: { done: { 1: 'x' }, swaps: [], past: [] }, b: { done: { 2: 'y' }, swaps: [], past: [] } }));
  store.attach(remote); await tick(); await store.flush();
  assert.deepEqual(calls.subscribe, []);
  assert.deepEqual(calls.subscribeAll.filter((c) => c === 'progress'), ['progress']);
  assert.ok(store.isDone('a', 1) && store.isDone('b', 2));
});

test('the first snapshot is every program\'s first sync: device-only progress goes up, the cloud\'s comes down', async () => {
  const storage = memStorage();
  const store = createStore({ programIds: ['a', 'b', 'c'], storage, now: () => 't' });
  store.load(); store.toggle('c', 4); // only on this device
  const remote = createMemoryRemote({ a: { done: { 1: 'x' }, swaps: [], past: [] } });
  store.attach(remote); await tick(); await store.flush();
  assert.ok(store.isDone('a', 1));
  assert.ok(remote.docs.c && remote.docs.c.done[4], 'device-only progress written up');
  assert.equal(remote.docs.b, undefined, 'nothing to say about an untouched program');
});

test('later snapshots pass on only what changed; an echo of our own write redraws nothing; detach stops it', async () => {
  const store = createStore({ programIds: ['a', 'b'], storage: memStorage(), now: () => 't' });
  store.load();
  const remote = createMemoryRemote({ a: { done: { 1: 'x' }, swaps: [], past: [] } });
  store.attach(remote); await tick(); await store.flush();
  const changed = []; store.on('change', (pid) => changed.push(pid));
  await remote.write('progress', 'b', { done: { 5: 'z' }, swaps: [], past: [] }); await tick();
  assert.deepEqual(changed, ['b']);
  assert.ok(store.isDone('b', 5));
  changed.length = 0;
  store.toggle('a', 2); await tick(); await store.flush(); await tick();
  assert.deepEqual(changed, ['a'], 'our own change once; its echo from the cloud redraws nothing');
  await remote.remove('progress', 'b'); await tick();
  assert.equal(store.isDone('b', 5), false, 'a document deleted in the cloud empties the program here');
  store.detach(); changed.length = 0;
  await remote.write('progress', 'a', { done: { 9: 'q' }, swaps: [], past: [] }); await tick();
  assert.deepEqual(changed, []);
});

test('a program added after sign-in syncs from the last snapshot; dropped, it is ignored', async () => {
  const store = createStore({ programIds: ['a'], storage: memStorage(), now: () => 't' });
  store.load();
  const remote = createMemoryRemote({ own1: { done: { 3: 'x' }, swaps: [], past: [] } });
  store.attach(remote); await tick();
  store.addProgram('own1');
  assert.ok(store.isDone('own1', 3));
  store.dropProgram('own1');
  await remote.write('progress', 'own1', { done: { 7: 'y' }, swaps: [], past: [] }); await tick();
  assert.equal(store.isDone('own1', 7), false);
});

test('a program added before the first snapshot syncs with it', async () => {
  const store = createStore({ programIds: [], storage: memStorage(), now: () => 't' });
  store.load();
  let deliver;
  store.attach({ kind: 'slow', subscribe: () => () => {}, subscribeAll: (c, onDocs) => { if (c === 'progress') deliver = onDocs; return () => {}; }, write: async () => {}, remove: async () => {} });
  store.addProgram('own1');
  deliver({ own1: { done: { 2: 'x' }, swaps: [], past: [] } });
  assert.ok(store.isDone('own1', 2));
});

test('an error on the progress listener shows as a sync error', async () => {
  const store = createStore({ programIds: ['a'], storage: memStorage(), now: () => 't' });
  store.load();
  const warn = console.warn; console.warn = () => {};
  try {
    store.attach({ kind: 'x', subscribe: () => () => {}, subscribeAll: (c, onDocs, onErr) => { if (c === 'progress') onErr(new Error('denied')); return () => {}; }, write: async () => {} });
  } finally { console.warn = warn; }
  assert.equal(store.status, 'err');
});
