// Doing a day again (Phase 30 ticket 4, decisions 212–217): every date counts, the day counts once; stored as an
// optional `again: { day: [time] }`, carried by the device copy, the cloud document, backups and merges.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../app/progress.js');
const B = require('../app/backup.js');
const S = require('../app/stats.js');

const MON = '2026-10-05T09:00:00.000Z', THU = '2026-10-08T09:00:00.000Z', SAT = '2026-10-10T09:00:00.000Z';
const MON_PM = '2026-10-05T18:00:00.000Z';
const doneTwice = () => P.doAgain(P.doAgain(P.empty(), 3, MON), 3, THU);

test('a day done on Monday and again on Thursday: two entries, the day counted once', () => {
  const v = doneTwice();
  assert.deepEqual(v.done, { 3: MON });
  assert.deepEqual(v.again, { 3: [THU] });
  assert.equal(P.count(v), 1);
  assert.ok(P.isDone(v, 3));
  assert.deepEqual(P.marks(v, 3), [MON, THU]);
  assert.deepEqual(P.entries('p', v).map((e) => [e.day, e.time, e.round]), [[3, MON, 1], [3, THU, 1]]);
  assert.deepEqual(P.marks(v, 4), []);
});

test('stats: two History days and both workouts; done twice on one date is one day and two workouts', () => {
  const dayOf = () => ({ est: 30, blocks: [] });
  const two = P.entries('p', doneTwice());
  const weeks = S.daysPerWeek(two, { dayOf, from: new Date('2026-10-05T00:00:00Z'), to: new Date('2026-10-12T00:00:00Z') });
  assert.equal(weeks.reduce((a, w) => a + w.days, 0), 2);
  const sameDay = P.entries('p', P.doAgain(P.doAgain(P.empty(), 1, MON), 1, MON_PM));
  assert.equal(sameDay.length, 2);
  assert.equal(S.daysPerWeek(sameDay, { dayOf, from: new Date('2026-10-05T00:00:00Z'), to: new Date('2026-10-12T00:00:00Z') }).reduce((a, w) => a + w.days, 0), 1);
});

test('removing a date: Monday gone leaves Thursday as the day\'s first; the last one unmarks the day', () => {
  const v = P.removeMark(doneTwice(), 3, MON);
  assert.deepEqual(v.done, { 3: THU });
  assert.equal(v.again, undefined);
  const gone = P.removeMark(v, 3, THU);
  assert.deepEqual(gone.done, {});
  assert.equal(P.removeMark(gone, 3, THU).done[3], undefined); // nothing to remove: unchanged
  const three = P.doAgain(doneTwice(), 3, SAT), mid = P.removeMark(three, 3, THU);
  assert.deepEqual([mid.done[3], mid.again[3]], [MON, [SAT]]);
});

test('unmarking a day (the old toggle) drops its again dates too', () => {
  const v = P.toggle(doneTwice(), 3, SAT);
  assert.deepEqual(v.done, {});
  assert.equal(v.again, undefined);
});

test('an old document, device copy or value without again reads as before, and writes no again', () => {
  const old = P.fromDoc({ done: { 1: MON }, swaps: [], past: [] });
  assert.equal(old.again, undefined);
  assert.equal('again' in P.toDoc(old, SAT), false);
  assert.equal('again' in P.toDevice(old), false);
  const v = doneTwice();
  assert.deepEqual(P.fromDevice(P.toDevice(v)).again, { 3: [THU] });
  assert.deepEqual(P.fromDoc(JSON.parse(JSON.stringify(P.toDoc(v, SAT)))).again, { 3: [THU] });
  assert.equal(P.fromDoc({ done: {}, again: { 1: 'x', 2: [], 3: [5] } }).again, undefined); // damaged: ignored
});

test('a new round keeps the old round\'s again dates in its past; entries still list them', () => {
  const r2 = P.startRound(doneTwice(), SAT, []);
  assert.equal(r2.again, undefined);
  assert.deepEqual(r2.past[0].again, { 3: [THU] });
  assert.deepEqual(P.entries('p', r2).map((e) => [e.day, e.time, e.round]), [[3, MON, 1], [3, THU, 1]]);
});

test('two devices each adding a date merge to both (first sync and import)', () => {
  const a = P.doAgain(P.doAgain(P.empty(), 2, MON), 2, THU), b = P.doAgain(P.doAgain(P.empty(), 2, MON), 2, SAT);
  const { merged, changed } = P.mergeFirstSync(a, b);
  assert.deepEqual(P.marks(merged, 2), [MON, THU, SAT]);
  assert.ok(changed);
  assert.equal(P.mergeFirstSync(b, b).changed, false);
  assert.deepEqual(P.marks(P.importMerge(a, b, 'merge'), 2), [MON, THU, SAT]);
  assert.deepEqual(P.marks(P.importMerge(a, b, 'replace'), 2), [MON, SAT]);
  assert.deepEqual(P.marks(P.importMerge(a, { done: { 2: MON } }, 'replace'), 2), [MON, THU]); // a file without again keeps this device's
  const ahead = P.startRound(b, SAT, []);
  assert.deepEqual(P.importMerge(a, ahead, 'merge').past[0].again, { 2: [SAT] }); // the round further along wins whole
  assert.deepEqual(P.importMerge(ahead, { done: { 2: MON }, again: { 2: [THU] }, past: [] }, 'merge').past.length, 1);
  assert.deepEqual(P.importMerge(P.empty(), { done: { 1: MON }, again: { 1: [THU] }, past: [{ round: 1, done: {}, swaps: [] }] }, 'merge').again, { 1: [THU] });
});

test('backups: export carries again only when there is some; an old backup imports; import adds the file\'s dates', () => {
  const file = B.exportProgress({ p: { 3: MON } }, { now: () => SAT, again: { p: { 3: [THU] }, q: {} } });
  assert.deepEqual(file.again, { p: { 3: [THU] } });
  assert.equal('again' in B.exportProgress({ p: {} }, { now: () => SAT, again: { p: {} } }), false);
  const old = JSON.stringify({ format: B.FORMAT, version: 2, exportedAt: SAT, programs: { p: { 3: MON } } });
  const plan = B.planImport({ p: P.toDoc(doneTwice(), SAT) }, old, { known: ['p'], name: 'f' });
  assert.equal(plan.hasChanges, false);
  const fresh = B.planImport({ p: P.toDoc(P.doAgain(P.empty(), 3, MON), SAT) }, JSON.stringify(file), { known: ['p'], name: 'f' });
  assert.ok(fresh.canMerge);
  assert.match(fresh.message('merge'), /1 repeat added/);
  assert.deepEqual(P.marks(fresh.result('merge').p, 3), [MON, THU]);
  assert.throws(() => B.parseBackup(JSON.stringify({ ...file, again: { p: { 3: 'x' } } }), { known: ['p'] }), /again dates/);
  assert.throws(() => B.parseBackup(JSON.stringify({ ...file, again: [] }), { known: ['p'] }), /again dates/);
  assert.deepEqual(B.parseBackup(JSON.stringify(file), { known: [] }).again, {}); // an unknown program's dates are left out
  const nightly = JSON.parse(B.nightlyFile([{ uid: 'u', email: 'e', pid: 'p', ...doneTwice() }, { uid: 'u', email: 'e', pid: 'q', ...P.empty() }]));
  assert.deepEqual(nightly.users.u.again, { p: { 3: [THU] } });
});
