// Progress Store: swaps live next to done days, on the device and in the same cloud document.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } });
const tick = () => new Promise((r) => setTimeout(r, 5));
const make = (storage = memStorage()) => { const s = createStore({ programIds: ['p'], storage, now: () => 't' }); s.load(); return s; };
const swap = { day: 3, ex: 'pushup', to: 'pike_pushup' };

test('swaps are kept per program on the device, survive a reload, and come back as copies', () => {
  const storage = memStorage();
  const a = make(storage);
  assert.deepEqual(a.swaps('p'), []);
  const changed = []; a.on('change', (pid) => changed.push(pid));
  a.setSwaps('p', [swap]);
  assert.deepEqual(changed, ['p']);
  a.swaps('p').push({ junk: 1 });
  assert.deepEqual(a.swaps('p'), [swap]);
  assert.deepEqual(make(storage).swaps('p'), [swap], 'after a reload');
  assert.deepEqual(a.swaps('unknown'), []);
});

test('a broken device copy of swaps loads as none', () => {
  assert.deepEqual(make(memStorage({ 'kb-swaps-p': '{oops' })).swaps('p'), []);
});

test('signed in, swaps and done days share one cloud document; a tick never wipes a swap', async () => {
  const remote = createMemoryRemote();
  const store = make(); store.attach(remote); await tick();
  store.setSwaps('p', [swap]); await store.flush();
  assert.deepEqual(remote.docs.p.swaps, [swap]);
  store.toggle('p', 1); await store.flush();
  assert.deepEqual(remote.docs.p.swaps, [swap], 'still there after a tick');
  assert.deepEqual(remote.docs.p.done, { 1: 't' });
});

test('swaps made on another device arrive with the cloud document', async () => {
  const remote = createMemoryRemote({ p: { done: { 1: 'a' }, swaps: [swap] } });
  const store = make(); store.attach(remote); await tick();
  assert.deepEqual(store.swaps('p'), [swap]);
  await remote.write('p', { done: { 1: 'a' }, swaps: [] });
  assert.deepEqual(store.swaps('p'), []);
});

test('first sign-in keeps swaps from both sides: the cloud\'s first, then the device\'s new ones', async () => {
  const other = { day: 4, ex: 'squat', to: 'goblet_squat' };
  const remote = createMemoryRemote({ p: { done: {}, swaps: [swap] } });
  const store = make(); store.setSwaps('p', [other, swap]);
  store.attach(remote); await tick(); await store.flush();
  assert.deepEqual(store.swaps('p'), [swap, other]);
  assert.deepEqual(remote.docs.p.swaps, [swap, other]);
});

test('view-only: a swap stays on the device', async () => {
  const remote = createMemoryRemote({}, { failWith: 'permission-denied' });
  const store = make(); store.attach(remote); await tick();
  store.toggle('p', 1); await store.flush();
  store.setSwaps('p', [swap]); await store.flush();
  assert.equal(store.status, 'ro');
  assert.deepEqual(store.swaps('p'), [swap]);
  assert.equal(remote.docs.p, undefined);
});

test('a full device storage never stops a swap', () => {
  const store = createStore({ programIds: ['p'], storage: { get: () => null, set() { throw new Error('quota'); } } });
  store.load(); store.setSwaps('p', [swap]);
  assert.deepEqual(store.swaps('p'), [swap]);
});

test('signing in before the device copy is loaded still takes the cloud\'s swaps', async () => {
  const store = createStore({ programIds: ['p'], storage: memStorage(), now: () => 't' });
  store.attach(createMemoryRemote({ p: { done: {}, swaps: [swap] } })); await tick();
  assert.deepEqual(store.swaps('p'), [swap]);
});

test('ticking a program the store was not loaded with, signed in, writes no swaps for it', async () => {
  const remote = createMemoryRemote();
  const store = make(); store.attach(remote); await tick();
  store.toggle('new', 1); await store.flush();
  assert.deepEqual(remote.docs.new.swaps, []);
});

test('an import sets days and swaps together, in one write per program', async () => {
  const remote = createMemoryRemote();
  const store = make(); store.attach(remote); await tick();
  let writes = 0; const w = remote.write; remote.write = (...a) => { writes++; return w(...a); };
  await store.replaceAll({ p: { 2: 'b' } }, { p: [swap] });
  assert.deepEqual(store.swaps('p'), [swap]);
  assert.deepEqual(remote.docs.p.swaps, [swap]);
  assert.equal(writes, 1);
  await store.replaceAll({ p: { 3: 'c' } });
  assert.deepEqual(store.swaps('p'), [swap], 'no swaps given: the program keeps its own');
});

test('progress(pid) hands out a copy of the whole value', () => {
  const store = make(); store.toggle('p', 2); store.setSwaps('p', [swap]);
  const v = store.progress('p');
  assert.deepEqual(v, { done: { 2: 't' }, swaps: [swap] });
  v.done[9] = 'x'; v.swaps[0].to = 'zzz';
  assert.deepEqual(store.progress('p'), { done: { 2: 't' }, swaps: [swap] });
});
