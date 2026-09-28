// Program Progress: one program's done days and swaps, how they're stored, and how two copies combine.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../app/progress.js');

const sw = (day, ex, to, onward) => ({ day, ex, to, ...(onward ? { onward: true } : {}) });

test('the cloud document: round trip, older documents without swaps, and no document at all', () => {
  const v = { done: { 1: 'a', 3: 'c' }, swaps: [sw(2, 'x', 'y')], past: [] };
  assert.deepEqual(P.toDoc(v, 'now'), { done: { 1: 'a', 3: 'c' }, swaps: [sw(2, 'x', 'y')], past: [], updatedAt: 'now' });
  assert.deepEqual(P.fromDoc(P.toDoc(v, 'now')), v);
  assert.deepEqual(P.fromDoc({ done: { 1: 'a' } }), { done: { 1: 'a' }, swaps: [], past: [] });
  assert.deepEqual(P.fromDoc({}), P.empty());
  assert.equal(P.fromDoc(null), null);
});

test('the device copy uses today\'s two keys and strings, and survives broken ones', () => {
  const v = P.fromDevice({ done: '{"3":"2026-09-28T09:00:00.000Z"}', swaps: '[{"day":1,"ex":"pushup","to":"pike_pushup"}]', past: null });
  assert.deepEqual(v, { done: { 3: '2026-09-28T09:00:00.000Z' }, swaps: [sw(1, 'pushup', 'pike_pushup')], past: [] });
  assert.deepEqual(P.toDevice(v), { done: '{"3":"2026-09-28T09:00:00.000Z"}', swaps: '[{"day":1,"ex":"pushup","to":"pike_pushup"}]', past: '[]' });
  assert.deepEqual(P.fromDevice({ done: null, swaps: null, past: null }), P.empty());
  assert.deepEqual(P.fromDevice({ done: '{oops', swaps: 'null', past: '{oops' }), P.empty());
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
  assert.deepEqual(P.entries('p', b), [{ pid: 'p', day: 4, time: 't', round: 1 }]);
});

test('next day: the first not done, or the first not done after a given day (else from the start)', () => {
  const v = { done: { 1: 't', 2: 't', 5: 't' }, swaps: [], past: [] }, days = [1, 2, 3, 4, 5, 6];
  assert.equal(P.nextDay(v, days), 3);
  assert.equal(P.nextDay(v, days, 4), 6);
  assert.equal(P.nextDay({ done: { 6: 't' }, swaps: [], past: [] }, days, 6), 1, 'after the last: from the start, not the same day');
  assert.equal(P.nextDay({ done: { 1: 't' }, swaps: [], past: [] }, [1], 1), null);
  assert.equal(P.nextDay({ done: { 1: 't' }, swaps: [], past: [] }, [1]), null);
});

test('first sign-in: days from both (earliest time wins), the cloud\'s swaps then the device\'s new ones; says whether to write back', () => {
  const local = { done: { 1: '2026-01-05', 3: 'c' }, swaps: [sw(4, 'a', 'b'), sw(2, 'x', 'y')], past: [] };
  const cloud = { done: { 1: '2026-01-01', 2: 'b' }, swaps: [sw(2, 'x', 'y')], past: [] };
  assert.deepEqual(P.mergeFirstSync(local, cloud), { merged: { done: { 1: '2026-01-01', 2: 'b', 3: 'c' }, swaps: [sw(2, 'x', 'y'), sw(4, 'a', 'b')], past: [] }, changed: true });
  assert.deepEqual(P.mergeFirstSync(P.empty(), cloud), { merged: cloud, changed: false });
  assert.deepEqual(P.mergeFirstSync({ done: { 1: 'a' }, swaps: [], past: [] }, null), { merged: { done: { 1: 'a' }, swaps: [], past: [] }, changed: true });
  assert.equal(P.mergeFirstSync({ done: { 2: 'z' }, swaps: [], past: [] }, cloud).changed, false, 'same days, earlier cloud time: nothing new to write');
});

test('import: merge keeps both (earliest day time; the file\'s swaps last); replace takes the file\'s; no swaps in the file keeps mine', () => {
  const mine = { done: { 1: '2026-01-05', 2: 'b' }, swaps: [sw(1, 'p', 'q'), sw(5, 'r', 's')], past: [] };
  const file = { done: { 1: '2026-01-01', 3: 'd' }, swaps: [sw(5, 'r', 's'), sw(9, 'p', 'z', true)], past: [] };
  assert.deepEqual(P.importMerge(mine, file, 'merge'), { done: { 1: '2026-01-01', 2: 'b', 3: 'd' }, swaps: [sw(1, 'p', 'q'), sw(5, 'r', 's'), sw(9, 'p', 'z', true)], past: [] });
  assert.deepEqual(P.importMerge(mine, file, 'replace'), file);
  assert.deepEqual(P.importMerge(mine, { done: { 7: 'x' } }, 'replace'), { done: { 7: 'x' }, swaps: mine.swaps, past: [] });
  assert.deepEqual(P.importMerge(undefined, { done: { 7: 'x' } }, 'merge'), { done: { 7: 'x' }, swaps: [], past: [] });
  assert.throws(() => P.importMerge(mine, file, 'mix'), /Unknown import mode mix/);
});

test('merging a file without swaps keeps my swaps as they are', () => {
  const mine = { done: {}, swaps: [sw(1, 'p', 'q')], past: [] };
  assert.deepEqual(P.importMerge(mine, { done: { 2: 'b' } }, 'merge'), { done: { 2: 'b' }, swaps: [sw(1, 'p', 'q')], past: [] });
});

// ---------- rounds: doing a program again ----------
test('a value starts in round 1; the document and the device copy carry past rounds, older ones read as none', () => {
  assert.equal(P.round(P.empty()), 1);
  const v = { done: { 1: 'b' }, swaps: [], past: [{ round: 1, done: { 1: 'a' }, swaps: [sw(2, 'x', 'y')], endedAt: 'e' }] };
  assert.equal(P.round(v), 2);
  assert.deepEqual(P.fromDoc(P.toDoc(v, 'now')), v);
  assert.deepEqual(P.fromDoc({ done: { 1: 'a' } }).past, []);
  assert.deepEqual(P.fromDevice(P.toDevice(v)), v);
  assert.deepEqual(P.fromDevice({ done: null, swaps: null, past: null }), P.empty());
});

test('starting a new round keeps the last one as it was, starts from day 1, and keeps only the onward swaps you choose', () => {
  const onA = sw(10, 'pushup', 'pike_pushup', true), onB = sw(20, 'row', 'renegade_row', true), today = sw(5, 'squat', 'lunge');
  const v = { done: { 1: 'a', 2: 'b' }, swaps: [onA, today, onB], past: [] };
  const next = P.startRound(v, 'end', [onB]);
  assert.equal(P.round(next), 2);
  assert.deepEqual(next.done, {});
  assert.deepEqual(next.past, [{ round: 1, done: { 1: 'a', 2: 'b' }, swaps: [onA, today, onB], endedAt: 'end' }]);
  assert.deepEqual(next.swaps, [sw(1, 'row', 'renegade_row', true)], 'kept onward swaps reach the whole new round; today-only ones stay behind');
  assert.deepEqual(P.onwardSwaps(v), [onA, onB]);
});

test('entries cover every round, each with its round number', () => {
  const v = { done: { 3: 'c' }, swaps: [], past: [{ round: 1, done: { 1: 'a' }, swaps: [], endedAt: 'e' }] };
  assert.deepEqual(P.entries('p', v), [{ pid: 'p', day: 1, time: 'a', round: 1 }, { pid: 'p', day: 3, time: 'c', round: 2 }]);
  assert.deepEqual(P.swapsOfRound(v, 1), []);
  assert.deepEqual(P.swapsOfRound({ ...v, swaps: [sw(1, 'x', 'y')] }, 2), [sw(1, 'x', 'y')]);
});

test('two copies in different rounds: the one further along wins whole; the same round merges as before', () => {
  const r1 = { done: { 1: 'a', 2: 'b' }, swaps: [], past: [] };
  const r2 = { done: { 1: 'z' }, swaps: [], past: [{ round: 1, done: { 1: 'a' }, swaps: [], endedAt: 'e' }] };
  assert.deepEqual(P.mergeFirstSync(r1, r2), { merged: r2, changed: false });
  assert.deepEqual(P.mergeFirstSync(r2, r1), { merged: r2, changed: true });
  assert.deepEqual(P.importMerge(r1, r2, 'merge'), r2);
  assert.deepEqual(P.importMerge(r2, r1, 'merge'), r2);
  assert.deepEqual(P.importMerge(r2, { done: { 9: 'x' } }, 'replace').past, r2.past, 'a file without rounds keeps mine');
  assert.deepEqual(P.importMerge(r2, r1, 'replace'), r1);
});

test('a file a round ahead brings its swaps along; a file ahead without swaps brings none', () => {
  const mine = { done: { 1: 'a' }, swaps: [sw(3, 'p', 'q')], past: [] };
  const ahead = { done: {}, swaps: [sw(1, 'x', 'y', true)], past: [{ round: 1, done: { 1: 'a' }, swaps: [], endedAt: 'e' }] };
  assert.deepEqual(P.importMerge(mine, ahead, 'merge').swaps, [sw(1, 'x', 'y', true)]);
  assert.deepEqual(P.importMerge(mine, { done: {}, past: ahead.past }, 'merge').swaps, []);
});
