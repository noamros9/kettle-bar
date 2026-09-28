// Progress Store: first-sync merge and writes, through the in-memory remote adapter.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote, mergeFirstSync } = require('../app/store.js');

const memStorage = () => { const m = {}; return { m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } }; };
const tick = () => new Promise((r) => setTimeout(r, 5));

test('merge keeps days ticked on either side, earliest time wins', () => {
  assert.deepEqual(mergeFirstSync({ 1: '2026-01-02', 3: 'b' }, { 1: '2026-01-01', 2: 'a' }), { 1: '2026-01-01', 2: 'a', 3: 'b' });
  assert.deepEqual(mergeFirstSync({ 1: 'x' }, null), { 1: 'x' });
});

test('device ticks upload on first sign-in and cloud ticks come down', async () => {
  const storage = memStorage();
  const store = createStore({ programIds: ['p'], storage, now: () => 't' });
  store.load(); store.toggle('p', 1);
  const remote = createMemoryRemote({ p: { 2: 'c' } });
  store.attach(remote); await tick(); await store.flush();
  assert.deepEqual(Object.keys(remote.docs.p).sort(), ['1', '2']);
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
  assert.deepEqual(remote.docs.p, { 5: 't' });
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
  store.load(); store.setAuth({}); store.attach(createMemoryRemote({ p: { 3: 'x' } })); await tick();
  store.detach();
  assert.equal(store.status, 'signin');
  assert.ok(store.isDone('p', 3));
});
