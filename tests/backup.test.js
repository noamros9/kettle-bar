// Backup: the progress file format (export now; import, diff and merge come in #14).
const test = require('node:test');
const assert = require('node:assert/strict');
const { exportProgress, fileName } = require('../app/backup.js');

test('export lists every program with its done days and when each was first marked', () => {
  const file = exportProgress({ a: { 1: '2026-09-01T07:00:00.000Z', 3: '2026-09-03T07:00:00.000Z' }, b: {} }, { now: () => '2026-09-28T12:00:00.000Z' });
  assert.deepEqual(file, {
    format: 'kettle-bar-progress', version: 1, exportedAt: '2026-09-28T12:00:00.000Z',
    programs: { a: { 1: '2026-09-01T07:00:00.000Z', 3: '2026-09-03T07:00:00.000Z' }, b: {} },
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

const { parseBackup, diffProgress, applyImport } = require('../app/backup.js');
const file = (programs, extra) => JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: 'x', programs, ...extra });
const known = ['a', 'b'];

test('reading a file keeps the programs this app has and names the ones it does not', () => {
  const got = parseBackup(file({ a: { 1: 't1' }, gone: { 2: 't2' } }), { known });
  assert.deepEqual(got, { programs: { a: { 1: 't1' } }, unknown: ['gone'] });
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

test('merge keeps days from both, earliest time wins (same rule as the first sync)', () => {
  const merged = applyImport({ a: { 1: '2026-01-05', 2: 'b' }, b: { 7: 'c' } }, { a: { 1: '2026-01-01', 3: 'd' } }, 'merge');
  assert.deepEqual(merged, { a: { 1: '2026-01-01', 2: 'b', 3: 'd' } });
  assert.deepEqual(applyImport({ a: { 1: '2026-01-01' } }, { a: { 1: '2026-02-01' } }, 'merge'), { a: { 1: '2026-01-01' } });
  assert.deepEqual(applyImport({}, { a: { 1: 't' } }, 'merge'), { a: { 1: 't' } });
});

test('replace makes each program in the file exactly as the file says; programs not in it are untouched', () => {
  assert.deepEqual(applyImport({ a: { 1: 't', 2: 't' }, b: { 7: 'c' } }, { a: { 3: 'd' } }, 'replace'), { a: { 3: 'd' } });
});

test('an unknown import mode is a programming error', () => {
  assert.throws(() => applyImport({}, {}, 'mix'), /Unknown import mode mix/);
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
