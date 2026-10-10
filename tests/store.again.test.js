// Progress Store: days done again (Phase 30 ticket 4) live next to done days, on the device and in the same cloud
// document; a program without any keeps its old keys and document shape.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } });
const tick = () => new Promise((r) => setTimeout(r, 5));

test('done again: each date kept on the device and in the cloud document; Remove takes one; none -> no key', async () => {
  const storage = memStorage(), times = ['t1', 't2', 't3'];
  const s = createStore({ programIds: ['p'], storage, now: () => times.shift() }); s.load();
  const remote = createMemoryRemote();
  s.attach(remote);
  s.doAgain('p', 3); s.doAgain('p', 3);
  assert.equal(s.count('p'), 1);
  assert.deepEqual(s.marks('p', 3), ['t1', 't2']);
  assert.deepEqual(s.againOf('p'), { 3: ['t2'] });
  assert.equal(storage.m['kb-again-p'], '{"3":["t2"]}');
  assert.deepEqual(s.entries('p').map((e) => e.time), ['t1', 't2']);
  await s.flush(); await tick();
  assert.deepEqual(remote.docs.p.again, { 3: ['t2'] });
  const again = createStore({ programIds: ['p'], storage, now: () => 'x' }); again.load();
  assert.deepEqual(again.marks('p', 3), ['t1', 't2'], 'after a reload');
  s.removeMark('p', 3, 't1');
  assert.deepEqual(s.marks('p', 3), ['t2']);
  assert.equal('kb-again-p' in storage.m, false);
  s.deleteProgress('p');
  assert.equal('kb-progress-p' in storage.m, false);
});
