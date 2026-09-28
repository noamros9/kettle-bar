// Program Progress: one program's done days and swaps, how they're stored, and how two copies combine.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../app/progress.js');

const sw = (day, ex, to, onward) => ({ day, ex, to, ...(onward ? { onward: true } : {}) });

test('the cloud document: round trip, older documents without swaps, and no document at all', () => {
  const v = { done: { 1: 'a', 3: 'c' }, swaps: [sw(2, 'x', 'y')] };
  assert.deepEqual(P.toDoc(v, 'now'), { done: { 1: 'a', 3: 'c' }, swaps: [sw(2, 'x', 'y')], updatedAt: 'now' });
  assert.deepEqual(P.fromDoc(P.toDoc(v, 'now')), v);
  assert.deepEqual(P.fromDoc({ done: { 1: 'a' } }), { done: { 1: 'a' }, swaps: [] });
  assert.deepEqual(P.fromDoc({}), P.empty());
  assert.equal(P.fromDoc(null), null);
});

test('the device copy uses today\'s two keys and strings, and survives broken ones', () => {
  const v = P.fromDevice({ done: '{"3":"2026-09-28T09:00:00.000Z"}', swaps: '[{"day":1,"ex":"pushup","to":"pike_pushup"}]' });
  assert.deepEqual(v, { done: { 3: '2026-09-28T09:00:00.000Z' }, swaps: [sw(1, 'pushup', 'pike_pushup')] });
  assert.deepEqual(P.toDevice(v), { done: '{"3":"2026-09-28T09:00:00.000Z"}', swaps: '[{"day":1,"ex":"pushup","to":"pike_pushup"}]' });
  assert.deepEqual(P.fromDevice({ done: null, swaps: null }), P.empty());
  assert.deepEqual(P.fromDevice({ done: '{oops', swaps: 'null' }), P.empty());
});

test('ticking and swaps make new values; the old one is untouched', () => {
  const a = P.empty(), b = P.toggle(a, 4, 't'), c = P.toggle(b, 4, 't2');
  assert.ok(P.isDone(b, 4));
  assert.equal(P.isDone(a, 4), false);
  assert.equal(P.count(b), 1);
  assert.equal(P.isDone(c, 4), false, 'ticking again un-ticks');
  const d = P.withSwaps(b, [sw(1, 'x', 'y')]);
  assert.deepEqual(d.swaps, [sw(1, 'x', 'y')]);
  assert.deepEqual(b.swaps, []);
  assert.deepEqual(P.entries('p', b), [{ pid: 'p', day: 4, time: 't' }]);
});

test('next day: the first not done, or the first not done after a given day (else from the start)', () => {
  const v = { done: { 1: 't', 2: 't', 5: 't' }, swaps: [] }, days = [1, 2, 3, 4, 5, 6];
  assert.equal(P.nextDay(v, days), 3);
  assert.equal(P.nextDay(v, days, 4), 6);
  assert.equal(P.nextDay({ done: { 6: 't' }, swaps: [] }, days, 6), 1, 'after the last: from the start, not the same day');
  assert.equal(P.nextDay({ done: { 1: 't' }, swaps: [] }, [1], 1), null);
  assert.equal(P.nextDay({ done: { 1: 't' }, swaps: [] }, [1]), null);
});

test('first sign-in: days from both (earliest time wins), the cloud\'s swaps then the device\'s new ones; says whether to write back', () => {
  const local = { done: { 1: '2026-01-05', 3: 'c' }, swaps: [sw(4, 'a', 'b'), sw(2, 'x', 'y')] };
  const cloud = { done: { 1: '2026-01-01', 2: 'b' }, swaps: [sw(2, 'x', 'y')] };
  assert.deepEqual(P.mergeFirstSync(local, cloud), { merged: { done: { 1: '2026-01-01', 2: 'b', 3: 'c' }, swaps: [sw(2, 'x', 'y'), sw(4, 'a', 'b')] }, changed: true });
  assert.deepEqual(P.mergeFirstSync(P.empty(), cloud), { merged: cloud, changed: false });
  assert.deepEqual(P.mergeFirstSync({ done: { 1: 'a' }, swaps: [] }, null), { merged: { done: { 1: 'a' }, swaps: [] }, changed: true });
  assert.equal(P.mergeFirstSync({ done: { 2: 'z' }, swaps: [] }, cloud).changed, false, 'same days, earlier cloud time: nothing new to write');
});

test('import: merge keeps both (earliest day time; the file\'s swaps last); replace takes the file\'s; no swaps in the file keeps mine', () => {
  const mine = { done: { 1: '2026-01-05', 2: 'b' }, swaps: [sw(1, 'p', 'q'), sw(5, 'r', 's')] };
  const file = { done: { 1: '2026-01-01', 3: 'd' }, swaps: [sw(5, 'r', 's'), sw(9, 'p', 'z', true)] };
  assert.deepEqual(P.importMerge(mine, file, 'merge'), { done: { 1: '2026-01-01', 2: 'b', 3: 'd' }, swaps: [sw(1, 'p', 'q'), sw(5, 'r', 's'), sw(9, 'p', 'z', true)] });
  assert.deepEqual(P.importMerge(mine, file, 'replace'), file);
  assert.deepEqual(P.importMerge(mine, { done: { 7: 'x' } }, 'replace'), { done: { 7: 'x' }, swaps: mine.swaps });
  assert.deepEqual(P.importMerge(undefined, { done: { 7: 'x' } }, 'merge'), { done: { 7: 'x' }, swaps: [] });
  assert.throws(() => P.importMerge(mine, file, 'mix'), /Unknown import mode mix/);
});

test('merging a file without swaps keeps my swaps as they are', () => {
  const mine = { done: {}, swaps: [sw(1, 'p', 'q')] };
  assert.deepEqual(P.importMerge(mine, { done: { 2: 'b' } }, 'merge'), { done: { 2: 'b' }, swaps: [sw(1, 'p', 'q')] });
});
