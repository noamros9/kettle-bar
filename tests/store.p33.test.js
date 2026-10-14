// Progress Store, Phase 33 ticket 1: paused, training weekdays and day notes live in the program's progress, on the
// device under keys of their own (only when set) and in the same cloud document.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore, createMemoryRemote } = require('../app/store.js');

const memStorage = (m = {}) => ({ m, get: (k) => m[k] ?? null, set: (k, v) => { m[k] = v; }, remove: (k) => { delete m[k]; } });
const tick = () => new Promise((r) => setTimeout(r, 5));
let clock = 0;
const make = (storage = memStorage(), ids = ['p']) => { const s = createStore({ programIds: ids, storage, now: () => `t${++clock}` }); s.load(); return s; };

test('pause, weekdays and a note: set, kept on the device after a reload, cleared with no key left', () => {
  const storage = memStorage();
  const a = make(storage);
  assert.equal(a.isPaused('p'), false);
  assert.deepEqual(a.weekdays('p'), []);
  assert.deepEqual(Object.keys(storage.m).filter((k) => /paused|weekdays|notes/.test(k)), []);
  a.setPaused('p', true);
  a.setWeekdays('p', [4, 1]);
  a.toggle('p', 3);
  a.setNote('p', 3, 'heavy today');
  const b = make(storage);
  assert.equal(b.isPaused('p'), true);
  assert.match(b.pausedAt('p'), /^t\d+$/);
  assert.deepEqual(b.weekdays('p'), [1, 4]);
  assert.equal(b.noteOf('p', 3), 'heavy today');
  assert.deepEqual(Object.values(b.notesOf('p')[3]).map((n) => n.text), ['heavy today']);
  a.setPaused('p', false); a.setWeekdays('p', []); a.setNote('p', 3, '');
  assert.deepEqual(Object.keys(storage.m).filter((k) => /paused|weekdays|notes/.test(k)), []);
  assert.deepEqual(a.notesOf('p'), {});
  // a new round: the note stays with round 1
  a.setNote('p', 3, 'round one'); a.startRound('p', []);
  assert.equal(a.noteOf('p', 3), '');
  assert.equal(a.noteOf('p', 3, { round: 1 }), 'round one');
  // deleting the program forgets every key
  a.setPaused('p', true);
  a.deleteProgress('p');
  assert.deepEqual(Object.keys(storage.m).filter((k) => k.endsWith('-p')), []);
});

test('they go up in the program\'s cloud document and come down on another device', async () => {
  const remote = createMemoryRemote();
  const a = make(); a.attach(remote); await tick();
  a.toggle('p', 1); a.setNote('p', 1, 'from phone A'); a.setPaused('p', true); a.setWeekdays('p', [0, 2]);
  await a.flush();
  assert.deepEqual(remote.docs.p.weekdays, [0, 2]);
  assert.ok(remote.docs.p.paused);
  const b = make(); b.attach(remote); await tick();
  assert.equal(b.noteOf('p', 1), 'from phone A');
  assert.equal(b.isPaused('p'), true);
  assert.deepEqual(b.weekdays('p'), [0, 2]);
});
