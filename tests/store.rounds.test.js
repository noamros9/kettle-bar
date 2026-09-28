// Progress Store: starting a new round, on the device and in the cloud.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; } });
const tick = () => new Promise((r) => setTimeout(r, 5));
const onward = { day: 4, ex: 'pushup', to: 'pike_pushup', onward: true };

test('starting a round keeps the last one, survives a reload (third device key), and syncs', async () => {
  const storage = memStorage(), remote = createMemoryRemote();
  const store = createStore({ programIds: ['p'], storage, now: () => 't' }); store.load();
  store.attach(remote); await tick();
  store.toggle('p', 1); store.setSwaps('p', [onward]);
  const changed = []; store.on('change', (pid) => changed.push(pid));
  store.startRound('p', [onward]); await store.flush();
  assert.deepEqual([...new Set(changed)], ['p']); // the cloud's echo of the write may add more
  assert.equal(store.round('p'), 2);
  assert.equal(store.count('p'), 0);
  assert.deepEqual(store.swaps('p'), [{ ...onward, day: 1 }]);
  assert.deepEqual(JSON.parse(storage.m['kb-past-p']), [{ round: 1, done: { 1: 't' }, swaps: [onward], endedAt: 't' }]);
  assert.equal(remote.docs.p.past.length, 1);
  const again = createStore({ programIds: ['p'], storage }); again.load();
  assert.equal(again.round('p'), 2);
  assert.deepEqual(again.progress('p').past[0].done, { 1: 't' });
  assert.deepEqual(again.entries('p'), [{ pid: 'p', day: 1, time: 't', round: 1 }]);
});
