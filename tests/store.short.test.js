// Progress Store: days done "short on time" (Phase 7 ticket 4) live next to done days, on the device and in the same
// cloud document; a program without any keeps its old keys and document shape.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } });
const tick = () => new Promise((r) => setTimeout(r, 5));
const make = (storage = memStorage(), ids = ['p']) => { const s = createStore({ programIds: ids, storage, now: () => 't' }); s.load(); return s; };

test('short days: set, cleared, kept on the device and after a reload; none -> no device key', () => {
  const storage = memStorage();
  const a = make(storage);
  assert.equal(a.isShort('p', 2), false);
  const changed = []; a.on('change', (pid) => changed.push(pid));
  a.setShort('p', 2, true);
  assert.deepEqual(changed, ['p']);
  assert.equal(a.isShort('p', 2), true);
  assert.equal(storage.m['kb-short-p'], '{"2":true}');
  assert.equal(make(storage).isShort('p', 2), true, 'after a reload');
  a.setShort('p', 2, false);
  assert.equal('kb-short-p' in storage.m, false);
  assert.equal(make(storage).isShort('p', 2), false);
  assert.deepEqual(a.shortOf('p', 1), {});
  a.setShort('p', 4, true); a.toggle('p', 4); a.startRound('p', []);
  assert.deepEqual(a.shortOf('p', 1), { 4: true }, 'round 1 keeps it');
  assert.deepEqual(a.shortOf('p', 2), {});
  assert.deepEqual(a.shortOf('p'), {}, 'the current round');
});

test('short days go up in the program\'s cloud document and come down on another device', async () => {
  const remote = createMemoryRemote();
  const a = make(); a.attach(remote); await tick();
  a.setShort('p', 5, true); await a.flush();
  assert.deepEqual(remote.docs.p.short, { 5: true });
  const b = make(); b.attach(remote); await tick();
  assert.equal(b.isShort('p', 5), true);
});

test('a program you add later reads its short days from the device; deleting it forgets them', () => {
  const storage = memStorage({ 'kb-short-own-x': '{"1":true}' });
  const s = make(storage, []);
  s.addProgram('own-x');
  assert.equal(s.isShort('own-x', 1), true);
  s.deleteProgress('own-x');
  assert.equal('kb-short-own-x' in storage.m, false);
});

test('a device that refuses to store short days keeps going', () => {
  const m = {}, storage = { get: (k) => m[k] ?? null, set: (k, v) => { if (k.startsWith('kb-short-')) throw new Error('full'); m[k] = v; } };
  const s = make(storage);
  s.setShort('p', 1, true);
  assert.equal(s.isShort('p', 1), true, 'kept in memory');
  s.setShort('p', 1, false); // no remove(): the key is blanked, which throws here too
  assert.equal(s.isShort('p', 1), false);
});
