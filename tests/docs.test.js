// Account docs: how two copies of your own programs, random workouts and preferences combine (pure).
const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('../app/docs.js');

const doc = (name, updatedAt, extra) => ({ name, updatedAt, ...extra });

test('the synced collections are named; progress is not one of them', () => {
  assert.deepEqual(D.COLLECTIONS, ['programs', 'random', 'prefs']);
});

test('stamping copies the body and sets updatedAt', () => {
  const body = { name: 'Push', picks: { a: [1] } };
  const out = D.stamp(body, 'T');
  assert.deepEqual(out, { name: 'Push', picks: { a: [1] }, updatedAt: 'T' });
  out.picks.a.push(2);
  assert.deepEqual(body.picks.a, [1]);
});

test('keepStamp leaves a stamped body as it is and stamps one without', () => {
  assert.deepEqual(D.keepStamp({ a: 1, updatedAt: 'X' }, 'T'), { a: 1, updatedAt: 'X' });
  assert.deepEqual(D.keepStamp({ a: 1 }, 'T'), { a: 1, updatedAt: 'T' });
});

test('sortKeys orders object keys deeply and leaves arrays and values alone', () => {
  assert.equal(JSON.stringify(D.sortKeys({ b: 1, a: { d: [{ z: 1, y: 2 }], c: null } })), '{"a":{"c":null,"d":[{"y":2,"z":1}]},"b":1}');
  assert.equal(D.sortKeys(5), 5);
});

test('first sync: union by id; on the same id the newer updatedAt wins; ties go to the cloud; says what to write back', () => {
  const local = { dev: doc('dev', '2'), both: doc('device newer', '5'), tie: doc('device tie', '3'), old: doc('device older', '1'), bare: { name: 'no stamp' } };
  const cloud = { web: doc('web', '2'), both: doc('cloud older', '4'), tie: doc('cloud tie', '3'), old: doc('cloud newer', '2'), bare: doc('cloud stamped', '1') };
  const { merged, push } = D.mergeFirstSync(local, cloud);
  assert.deepEqual(Object.keys(merged).sort(), ['bare', 'both', 'dev', 'old', 'tie', 'web']);
  assert.equal(merged.both.name, 'device newer');
  assert.equal(merged.tie.name, 'cloud tie');
  assert.equal(merged.old.name, 'cloud newer');
  assert.equal(merged.bare.name, 'cloud stamped');
  assert.deepEqual(push.sort(), ['both', 'dev']);
  assert.deepEqual(D.mergeFirstSync({}, {}), { merged: {}, push: [] });
});

test('first sync gives back copies', () => {
  const cloud = { a: doc('a', '1', { picks: [1] }) };
  const { merged } = D.mergeFirstSync({}, cloud);
  merged.a.picks.push(2);
  assert.deepEqual(cloud.a.picks, [1]);
});

test('the diff lists ids the file adds, ids only Replace would remove, and ids whose content differs (key order ignored)', () => {
  const current = { keep: { a: 1, b: 2 }, gone: { x: 1 }, edit: { a: 1 } };
  const file = { keep: { b: 2, a: 1 }, edit: { a: 2 }, fresh: { z: 1 } };
  assert.deepEqual(D.diff(current, file), { added: ['fresh'], removed: ['gone'], changed: ['edit'] });
  assert.deepEqual(D.diff({}, {}), { added: [], removed: [], changed: [] });
});

test('import merge: union by id, the file wins the same id only when newer; replace: the file\'s set', () => {
  const current = { a: doc('mine', '5'), b: doc('mine b', '1'), c: doc('mine c', '3') };
  const file = { a: doc('file', '4'), b: doc('file b', '2'), d: doc('file d', '1') };
  const merged = D.importMerge('programs', current, file, 'merge');
  assert.deepEqual(Object.keys(merged).sort(), ['a', 'b', 'c', 'd']);
  assert.deepEqual([merged.a.name, merged.b.name, merged.c.name, merged.d.name], ['mine', 'file b', 'mine c', 'file d']);
  assert.deepEqual(D.importMerge('random', current, file, 'replace'), file);
  assert.throws(() => D.importMerge('programs', current, file, 'nope'), /Unknown import mode nope/);
});

test('import merge of preferences keeps the device\'s; replace takes the file\'s', () => {
  const mine = { main: doc('mine', '1', { hidden: ['x'] }) }, theirs = { main: doc('theirs', '9', { hidden: [] }) };
  assert.deepEqual(D.importMerge('prefs', mine, theirs, 'merge'), mine);
  assert.deepEqual(D.importMerge('prefs', {}, theirs, 'merge'), theirs, 'a device with none takes the file\'s');
  assert.deepEqual(D.importMerge('prefs', mine, theirs, 'replace'), theirs);
});
