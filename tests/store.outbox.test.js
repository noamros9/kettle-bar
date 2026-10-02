// Phase 12 ticket 2: an outbox that survives closing the app. Every cloud write (progress and account data, deletes
// included) is kept on the device until the cloud confirms it; sent again on reconnect and on the next start, where it
// wins over the cloud's copy, so a change made offline (an un-done day, a deleted program) never comes back.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } });
const tick = (ms = 5) => new Promise((r) => setTimeout(r, ms));
let n = 0;
const make = (storage, ids = ['p', 'own-x']) => { const s = createStore({ programIds: ids, storage, now: () => `2026-10-02T10:00:${String(++n % 60).padStart(2, '0')}Z`, retryDelay: () => 0 }); s.load(); return s; };
// a remote that can go down: writes and removes fail as 'unavailable' while down
function flaky(remote) {
  const r = Object.create(remote);
  r.down = false;
  const guard = (f) => async (...a) => { if (r.down) { const e = new Error('offline'); e.code = 'unavailable'; throw e; } return f(...a); };
  r.write = guard(remote.write.bind(remote)); r.remove = guard(remote.remove.bind(remote));
  r.subscribe = remote.subscribe.bind(remote); r.subscribeAll = remote.subscribeAll.bind(remote);
  return r;
}

test('offline: an un-done day and a deleted own program reach the cloud after closing the app, and nothing comes back', async () => {
  const cloud = createMemoryRemote({ p: { done: { 1: 'a', 2: 'b' }, swaps: [] } }, { collections: { programs: { x: { name: 'X', updatedAt: '2026-10-01T00:00:00Z' } } } });
  const net = flaky(cloud), storage = memStorage();
  const one = make(storage); one.attach(net); await tick();
  assert.equal(one.isDone('p', 2), true);
  net.down = true;
  one.toggle('p', 2); one.deleteDoc('programs', 'x'); one.deleteProgress('own-x');
  await one.flush();
  assert.equal(one.waiting(), 3, 'three changes waiting');
  assert.ok(cloud.docs.p.done[2], 'the cloud still has day 2');
  // the app is closed; a new one starts on the same phone, online again
  net.down = false;
  const two = make(storage, ['p']); two.attach(net); await tick(20); await two.flush(); // own-x is gone from the catalogue
  assert.equal(two.isDone('p', 2), false, 'day 2 stays un-done');
  assert.equal(cloud.docs.p.done[2], undefined, 'and the cloud has it so');
  assert.equal(cloud.collections.programs.x, undefined, 'the deleted program is gone from the cloud');
  assert.equal(two.doc('programs', 'x'), null, 'and does not come back');
  assert.equal(cloud.docs['own-x'], undefined);
  assert.equal(two.waiting(), 0);
});

test('reconnecting in the same session sends what is waiting; a later change to the same doc replaces the earlier one', async () => {
  const cloud = createMemoryRemote(), net = flaky(cloud), storage = memStorage();
  const s = make(storage); s.attach(net); await tick();
  net.down = true;
  s.setDoc('prefs', 'main', { travel: 'bw' }); s.setDoc('prefs', 'main', { travel: 'kb' }); s.toggle('p', 3);
  await s.flush();
  assert.equal(s.waiting(), 3, 'three changes waiting');
  assert.equal(Object.keys(JSON.parse(storage.m['kb-outbox'])).length, 2, 'one box entry per doc');
  net.down = false; s.online(); await tick(); await s.flush();
  assert.equal(cloud.collections.prefs.main.travel, 'kb');
  assert.ok(cloud.docs.p.done[3]);
  assert.equal(s.waiting(), 0);
  assert.equal(storage.m['kb-outbox'], undefined, 'an empty box leaves no key on the device');
});

test('additions made offline still join with the cloud\'s (newest wins for a doc, done days joined when nothing is waiting)', async () => {
  const cloud = createMemoryRemote({ p: { done: { 1: 'a' }, swaps: [] } }), net = flaky(cloud), storage = memStorage();
  const s = make(storage); s.attach(net); await tick(); s.detach(); // signed out for a while: no box entries
  s.toggle('p', 4); await s.flush();
  assert.equal(s.waiting(), 0, 'nothing to send while not signed in');
  await cloud.write('progress', 'p', { done: { 1: 'a', 5: 'e' }, swaps: [] }); // another device
  const t = make(storage); t.attach(net); await tick(20); await t.flush();
  assert.deepEqual(Object.keys(t.days('p')).sort(), ['1', '4', '5']);
});

test('an old device (no outbox key) starts with an empty box', () => {
  const s = make(memStorage({ 'kb-progress-p': '{"1":"a"}' }));
  assert.equal(s.waiting(), 0);
  assert.equal(make(memStorage({ 'kb-outbox': 'not json' })).waiting(), 0);
});

test('a doc changed offline wins at the next start over an older cloud copy, and is sent', async () => {
  const cloud = createMemoryRemote({}, { collections: { prefs: { main: { travel: 'kb', updatedAt: '2026-10-02T11:00:00Z' } } } });
  const net = flaky(cloud), storage = memStorage();
  const s = make(storage); s.attach(net); await tick(); net.down = true;
  s.setDoc('prefs', 'main', { travel: 'bw' }); await s.flush(); // stamped earlier than the cloud's copy, but waiting
  net.down = false;
  const t = make(storage); t.attach(net); await tick(20); await t.flush();
  assert.equal(t.doc('prefs', 'main').travel, 'bw');
  assert.equal(cloud.collections.prefs.main.travel, 'bw');
});

test('reconnecting while signed out does nothing; a device that refuses to store the box keeps working', async () => {
  const s = make(memStorage()); s.online();
  assert.equal(s.waiting(), 0);
  const cloud = createMemoryRemote(), net = flaky(cloud);
  const full = memStorage(); full.set = (k, v) => { if (k === 'kb-outbox') throw new Error('full'); full.m[k] = v; };
  const t = make(full); t.attach(net); await tick(); net.down = true;
  t.toggle('p', 1); await t.flush();
  assert.equal(t.waiting(), 1, 'still known in memory');
  net.down = false; t.online(); await tick(); await t.flush();
  assert.equal(t.waiting(), 0);
});

test('a program deleted offline is removed from the cloud when the connection comes back in the same session', async () => {
  const cloud = createMemoryRemote({ 'own-x': { done: { 1: 'a' }, swaps: [] } }), net = flaky(cloud);
  const s = make(memStorage()); s.attach(net); await tick(); net.down = true;
  s.deleteProgress('own-x'); await s.flush();
  assert.ok(cloud.docs['own-x']);
  net.down = false; s.online(); await tick(); await s.flush();
  assert.equal(cloud.docs['own-x'], undefined);
  assert.equal(s.waiting(), 0);
});

test('an older device\'s box (plain numbers) reads as one change each; a retry adds no change', async () => {
  const storage = memStorage({ 'kb-outbox': JSON.stringify({ 'prefs/main': 4, 'progress/p': { s: 5, n: 3 }, 'random/r': {} }) });
  const s = make(storage, ['p']);
  assert.equal(s.waiting(), 5, 'a damaged entry counts as one change');
  const cloud = createMemoryRemote(), net = flaky(cloud); net.down = true;
  s.attach(net); await tick(20); await s.flush();
  assert.equal(s.waiting(), 5, 'the first sync re-sends without counting more');
  net.down = false; s.online(); await tick(); await s.flush();
  assert.equal(s.waiting(), 0);
});
