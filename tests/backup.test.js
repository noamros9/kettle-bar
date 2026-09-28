// Backup: the progress file format (export now; import, diff and merge come in #14).
const test = require('node:test');
const assert = require('node:assert/strict');
const { exportProgress, fileName } = require('../app/backup.js');

test('export lists every program with its done days and when each was first marked', () => {
  const file = exportProgress({ a: { 1: '2026-09-01T07:00:00.000Z', 3: '2026-09-03T07:00:00.000Z' }, b: {} }, { now: () => '2026-09-28T12:00:00.000Z' });
  assert.deepEqual(file, {
    format: 'kettle-bar-progress', version: 1, exportedAt: '2026-09-28T12:00:00.000Z',
    programs: { a: { 1: '2026-09-01T07:00:00.000Z', 3: '2026-09-03T07:00:00.000Z' }, b: {} }, swaps: {}, rounds: {},
  });
});

test('export is a copy: later ticks do not change a file already made', () => {
  const done = { a: { 1: 't' } };
  const file = exportProgress(done, { now: () => 'n' });
  done.a[2] = 't2';
  assert.deepEqual(file.programs.a, { 1: 't' });
});

test('export uses the real clock by default', () => {
  assert.match(exportProgress({}).exportedAt, /^\d{4}-\d\d-\d\dT/);
});

test('the file is named after the local date it was made', () => {
  assert.equal(fileName(new Date(2026, 8, 5, 23, 30)), 'kettle-bar-progress-2026-09-05.json');
});

const { parseBackup, diffProgress } = require('../app/backup.js');
const file = (programs, extra) => JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: 'x', programs, ...extra });
const known = ['a', 'b'];

test('reading a file keeps the programs this app has and names the ones it does not', () => {
  const got = parseBackup(file({ a: { 1: 't1' }, gone: { 2: 't2' } }), { known });
  assert.deepEqual(got, { programs: { a: { 1: 't1' } }, swaps: {}, rounds: {}, unknown: ['gone'] });
});

test('reading refuses files that are not a readable backup, saying why', () => {
  assert.throws(() => parseBackup('{oops', { known }), /isn't a Kettle & Bar backup \(it can't be read\)/);
  assert.throws(() => parseBackup('[]', { known }), /isn't a Kettle & Bar backup/);
  assert.throws(() => parseBackup('null', { known }), /isn't a Kettle & Bar backup/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'other' }), { known }), /isn't a Kettle & Bar backup/);
  assert.throws(() => parseBackup(file({}, { version: 2 }), { known }), /newer version of the app/);
  assert.throws(() => parseBackup(file(null), { known }), /damaged/);
  assert.throws(() => parseBackup(file({ a: [] }), { known }), /damaged: a/);
  assert.throws(() => parseBackup(file({ a: { x: 't' } }), { known }), /damaged: a day x/);
  assert.throws(() => parseBackup(file({ a: { 0: 't' } }), { known }), /damaged: a day 0/);
  assert.throws(() => parseBackup(file({ a: { 1: 5 } }), { known }), /damaged: a day 1/);
});

test('the diff shows, per program, the days an import would add and the days replacing would remove', () => {
  const current = { a: { 1: 't', 2: 't', 12: 't' }, b: { 3: 't' } };
  const incoming = { a: { 1: 'x', 4: 'x', 5: 'x', 6: 'x' }, b: { 3: 'x' } };
  assert.deepEqual(diffProgress(current, incoming), { a: { added: [4, 5, 6], removed: [2, 12] } });
  assert.deepEqual(diffProgress({}, { a: { 10: 'x', 9: 'x' } }), { a: { added: [9, 10], removed: [] } });
});




test('day lists read as ranges', () => {
  const { dayRanges } = require('../app/backup.js');
  assert.equal(dayRanges([1, 2, 3, 5, 7, 8]), '1–3, 5, 7–8');
  assert.equal(dayRanges([4]), '4');
  assert.equal(dayRanges([]), '');
});

// ---------- the nightly backup file (all accounts), and restoring from it through import ----------
const { nightlyFile } = require('../app/backup.js');
const rows = [
  { uid: 'u2', email: 'b@x', pid: 'b', done: { 3: 't3' } },
  { uid: 'u1', email: 'a@x', pid: 'b', done: { 2: 't2', 10: 't10' } },
  { uid: 'u1', email: 'a@x', pid: 'a', done: {} },
];

test('the nightly file groups progress by account, in a stable order, with no timestamp', () => {
  const text = nightlyFile(rows);
  assert.deepEqual(JSON.parse(text), { format: 'kettle-bar-backup', version: 1, users: {
    u1: { email: 'a@x', programs: { a: {}, b: { 2: 't2', 10: 't10' } } },
    u2: { email: 'b@x', programs: { b: { 3: 't3' } } } } });
  assert.equal(nightlyFile([...rows].reverse()), text, 'same data, same bytes: an unchanged night makes no commit');
  assert.ok(text.indexOf('"u1"') < text.indexOf('"u2"'));
  assert.doesNotMatch(text, /exportedAt/);
});

test('an account without an email is still backed up', () => {
  assert.deepEqual(JSON.parse(nightlyFile([{ uid: 'u', pid: 'a', done: { 1: 't' } }])).users.u, { email: null, programs: { a: { 1: 't' } } });
});

test('importing the nightly file restores the signed-in account, or the only account in it', () => {
  const text = nightlyFile(rows);
  assert.deepEqual(parseBackup(text, { known, uid: 'u2' }).programs, { b: { 3: 't3' } });
  assert.deepEqual(parseBackup(nightlyFile([rows[0]]), { known }).programs, { b: { 3: 't3' } });
  assert.throws(() => parseBackup(text, { known }), /more than one account\. Sign in/);
  assert.throws(() => parseBackup(text, { known, uid: 'someone-else' }), /more than one account/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'kettle-bar-backup', version: 1, users: {} }), { known }), /damaged: it has no accounts/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'kettle-bar-backup', version: 1 }), { known }), /damaged: it has no accounts/);
});

// ---------- swaps in backups ----------
const sw = (day, ex, to, onward) => ({ day, ex, to, ...(onward ? { onward: true } : {}) });

test('export carries each program\'s swaps (only programs that have any)', () => {
  const f = exportProgress({ a: {}, b: {} }, { now: () => 'n', swaps: { a: [sw(3, 'pushup', 'pike_pushup')], b: [] } });
  assert.deepEqual(f.swaps, { a: [sw(3, 'pushup', 'pike_pushup')] });
  assert.deepEqual(exportProgress({ a: {} }, { now: () => 'n' }).swaps, {});
});

test('reading a file takes the swaps of known programs; older files without swaps read as none; bad swaps are refused', () => {
  const text = file({ a: { 1: 't' } }, { swaps: { a: [sw(2, 'x', 'y', true)], gone: [sw(1, 'x', 'y')] } });
  assert.deepEqual(parseBackup(text, { known }).swaps, { a: [sw(2, 'x', 'y', true)] });
  assert.deepEqual(parseBackup(file({ a: {} }), { known }).swaps, {});
  assert.throws(() => parseBackup(file({ a: {} }, { swaps: { a: {} } }), { known }), /damaged: a swaps/);
  assert.throws(() => parseBackup(file({ a: {} }, { swaps: { a: [{ day: 0, ex: 'x', to: 'y' }] } }), { known }), /damaged: a swaps/);
  assert.throws(() => parseBackup(file({ a: {} }, { swaps: { a: [{ day: 1, ex: 'x' }] } }), { known }), /damaged: a swaps/);
  assert.throws(() => parseBackup(file({ a: {} }, { swaps: [] }), { known }), /damaged: swaps/);
});


test('the nightly file carries swaps per account, only where there are any, and reads back', () => {
  const text = nightlyFile([{ uid: 'u', email: 'e', pid: 'a', done: { 1: 't' }, swaps: [sw(1, 'x', 'y')] }, { uid: 'u', email: 'e', pid: 'b', done: {}, swaps: [] }, { uid: 'u', email: 'e', pid: 'c', done: {} }]);
  assert.deepEqual(JSON.parse(text).users.u.swaps, { a: [sw(1, 'x', 'y')] });
  assert.deepEqual(parseBackup(text, { known: ['a', 'b'] }).swaps, { a: [sw(1, 'x', 'y')] });
  assert.equal(JSON.parse(nightlyFile([{ uid: 'u', pid: 'a', done: {} }])).users.u.swaps, undefined, 'no swaps: no field, so old backups stay byte-identical');
});

// ---------- the import plan: one step from a file to a review and the result ----------
const { planImport } = require('../app/backup.js');

test('planImport: a review of what would change, then the result and message for Merge and for Replace', () => {
  const current = { a: { done: { 1: '2026-01-05', 2: 'b', 12: 'l' }, swaps: [sw(1, 'p', 'q')] }, b: { done: { 7: 'c' }, swaps: [] } };
  const text = file({ a: { 1: '2026-01-01', 4: 'x', 5: 'y' }, retired: { 1: 'z' } }, { swaps: { a: [sw(9, 'p', 'z', true)] } });
  const plan = planImport(current, text, { known: ['a', 'b'], name: 'mine.json' });
  assert.equal(plan.name, 'mine.json');
  assert.deepEqual(plan.diff, { a: { added: [4, 5], removed: [2, 12] } });
  assert.deepEqual(plan.swapNotes, [{ pid: 'a', file: 1, mine: 1 }]);
  assert.deepEqual(plan.unknown, ['retired']);
  assert.equal(plan.added, 2);
  assert.equal(plan.removed, 2);
  assert.equal(plan.hasChanges, true);
  assert.deepEqual(plan.result('merge'), { a: { done: { 1: '2026-01-01', 2: 'b', 4: 'x', 5: 'y', 12: 'l' }, swaps: [sw(1, 'p', 'q'), sw(9, 'p', 'z', true)], past: [] } });
  assert.deepEqual(plan.result('replace'), { a: { done: { 1: '2026-01-01', 4: 'x', 5: 'y' }, swaps: [sw(9, 'p', 'z', true)], past: [] } });
  assert.equal(plan.message('merge'), 'Merged: 2 days added.');
  assert.equal(plan.message('replace'), 'Replaced: 2 days added, 2 removed.');
});

test('planImport: a file that matches has no changes; one day reads "1 day"; a program new to this device starts empty', () => {
  const same = planImport({ a: { done: { 1: 't' }, swaps: [] } }, file({ a: { 1: 't' } }), { known: ['a'] });
  assert.equal(same.hasChanges, false);
  assert.deepEqual(same.swapNotes, []);
  const one = planImport({}, file({ a: { 3: 't' } }), { known: ['a'] });
  assert.equal(one.message('merge'), 'Merged: 1 day added.');
  assert.deepEqual(one.result('merge'), { a: { done: { 3: 't' }, swaps: [], past: [] } });
  assert.throws(() => planImport({}, 'nope', { known: ['a'] }), /isn't a Kettle & Bar backup/);
});

test('the page modules leave counting and merging an import to planImport', () => {
  const fs = require('fs'), path = require('path');
  const src = ['app/views.js', 'app/main.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /reduce\(\(a, pid\)|diffProgress|importMerge|parseBackup/);
});

// ---------- rounds in backups ----------
const past1 = [{ round: 1, done: { 1: 'a', 2: 'b' }, swaps: [sw(1, 'p', 'q')], endedAt: 'e' }];

test('export and the nightly file carry past rounds, only where there are any', () => {
  assert.deepEqual(exportProgress({ a: {}, b: {} }, { now: () => 'n', rounds: { a: past1, b: [] } }).rounds, { a: past1 });
  assert.deepEqual(exportProgress({ a: {} }, { now: () => 'n' }).rounds, {});
  const text = nightlyFile([{ uid: 'u', pid: 'a', done: {}, swaps: [], past: past1 }, { uid: 'u', pid: 'b', done: {}, past: [] }]);
  assert.deepEqual(JSON.parse(text).users.u.rounds, { a: past1 });
  assert.equal(JSON.parse(nightlyFile([{ uid: 'u', pid: 'a', done: {} }])).users.u.rounds, undefined);
  assert.deepEqual(parseBackup(text, { known: ['a'] }).rounds, { a: past1 });
});

test('reading rounds: known programs only, older files have none, broken rounds are refused', () => {
  assert.deepEqual(parseBackup(file({ a: {} }, { rounds: { a: past1, gone: past1 } }), { known }).rounds, { a: past1 });
  assert.deepEqual(parseBackup(file({ a: {} }), { known }).rounds, {});
  assert.throws(() => parseBackup(file({ a: {} }, { rounds: [] }), { known }), /damaged: rounds/);
  assert.throws(() => parseBackup(file({ a: {} }, { rounds: { a: [{ round: 0, done: {}, swaps: [], endedAt: 'e' }] } }), { known }), /damaged: a rounds/);
  assert.throws(() => parseBackup(file({ a: {} }, { rounds: { a: [{ round: 1, done: [], swaps: [], endedAt: 'e' }] } }), { known }), /damaged: a rounds/);
  assert.throws(() => parseBackup(file({ a: {} }, { rounds: { a: {} } }), { known }), /damaged: a rounds/);
});

test('planImport: a file on another round says so, and Merge takes whichever is further along', () => {
  const current = { a: { done: { 1: 'x' }, swaps: [], past: [] } };
  const plan = planImport(current, file({ a: { 3: 'c' } }, { rounds: { a: past1 } }), { known: ['a'] });
  assert.deepEqual(plan.roundNotes, [{ pid: 'a', file: 2, mine: 1 }]);
  assert.equal(plan.hasChanges, true);
  assert.deepEqual(plan.result('merge').a, { done: { 3: 'c' }, swaps: [], past: past1 });
  assert.deepEqual(planImport(current, file({ a: { 1: 'x' } }), { known: ['a'] }).roundNotes, []);
});
