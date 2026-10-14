// Backup, Phase 33 ticket 1: paused, training weekdays and day notes ride in the progress file and the nightly file,
// with no change of version; old files (none of them) still import and leave the device's alone.
const test = require('node:test');
const assert = require('node:assert/strict');
const { exportProgress, planImport, parseBackup, nightlyFile } = require('../app/backup.js');
const P = require('../app/progress.js');

const T = (n) => `2026-10-${String(n).padStart(2, '0')}T08:00:00.000Z`;
const NOTE = { 1: { [T(1)]: { text: 'felt strong', at: T(2) } } };

test('export: written only when a program has one, as copies; none -> the same file as before', () => {
  const opts = { now: () => 'n', paused: { a: T(3), b: null }, weekdays: { a: [1, 3], b: [] }, notes: { a: NOTE, b: {} } };
  const f = exportProgress({ a: { 1: T(1) }, b: {} }, opts);
  assert.deepEqual(f.paused, { a: T(3) });
  assert.deepEqual(f.weekdays, { a: [1, 3] });
  assert.deepEqual(f.notes, { a: NOTE });
  assert.equal(f.version, 2);
  opts.notes.a[1][T(1)].text = 'changed later';
  assert.equal(f.notes.a[1][T(1)].text, 'felt strong');
  const plain = exportProgress({ a: { 1: T(1) } }, { now: () => 'n', paused: { a: null }, weekdays: { a: [] }, notes: { a: {} } });
  assert.deepEqual(Object.keys(plain).sort(), ['exportedAt', 'format', 'programs', 'rounds', 'swaps', 'version']);
});

test('an old file (none of the fields) still imports and keeps the device\'s pause, weekdays and notes', () => {
  const dev = P.setWeekdays(P.setPaused(P.setNote(P.toggle(P.empty(), 1, T(1)), 1, 'mine', T(2)), T(3)), [2]);
  const old = JSON.stringify({ format: 'kettle-bar-progress', version: 2, exportedAt: 'x', programs: { a: { 1: T(1), 2: T(4) } } });
  const plan = planImport({ a: P.toDoc(dev, 'n') }, old, { known: ['a'] });
  for (const mode of ['merge', 'replace']) {
    const r = plan.result(mode).a;
    assert.equal(P.noteOf(r, 1, 1), 'mine');
    assert.equal(P.pausedAt(r), T(3));
    assert.deepEqual(P.weekdaysOf(r), [2]);
  }
  const v1 = JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: 'x', programs: { a: { 1: T(1) } } });
  assert.deepEqual(parseBackup(v1, { known: ['a'] }).notes, {});
});

test('they round-trip through a file: export on one device, merge on another', () => {
  const src = P.setWeekdays(P.setPaused(P.setNote(P.toggle(P.empty(), 1, T(1)), 1, 'felt strong', T(2)), T(3)), [0, 4]);
  const text = JSON.stringify(exportProgress({ a: src.done }, { now: () => 'n', paused: { a: src.paused }, weekdays: { a: src.weekdays }, notes: { a: src.notes } }));
  const plan = planImport({}, text, { known: ['a'] });
  assert.equal(plan.hasChanges, true);
  const r = plan.result('merge').a;
  assert.equal(P.noteOf(r, 1, 1), 'felt strong');
  assert.equal(P.pausedAt(r), T(3));
  assert.deepEqual(P.weekdaysOf(r), [0, 4]);
  // only a newer note, or only another pause or weekdays: still a change to merge; the same file: none
  const same = planImport({ a: P.toDoc(src, 'n') }, text, { known: ['a'] });
  assert.equal(same.hasChanges, false);
  const older = P.setNote(src, 1, 'older', T(1));
  const newer = planImport({ a: P.toDoc(older, 'n') }, text, { known: ['a'] });
  assert.equal(newer.canMerge, true);
  assert.equal(P.noteOf(newer.result('merge').a, 1, 1), 'felt strong');
  const resumed = planImport({ a: P.toDoc(P.setWeekdays(P.setPaused(src, null), [1]), 'n') }, text, { known: ['a'] });
  assert.equal(resumed.canMerge, true);
});

test('damaged sections are refused, naming the program; unknown programs are left out', () => {
  const f = (extra) => JSON.stringify({ format: 'kettle-bar-progress', version: 2, exportedAt: 'x', programs: { a: {} }, ...extra });
  assert.throws(() => parseBackup(f({ paused: [] }), { known: ['a'] }), /damaged: paused programs/);
  assert.throws(() => parseBackup(f({ paused: { a: 5 } }), { known: ['a'] }), /damaged: a paused programs/);
  assert.throws(() => parseBackup(f({ weekdays: { a: [7] } }), { known: ['a'] }), /damaged: a weekdays/);
  assert.throws(() => parseBackup(f({ notes: { a: 'x' } }), { known: ['a'] }), /damaged: a notes/);
  assert.deepEqual(parseBackup(f({ weekdays: { a: [1], gone: [2] } }), { known: ['a'] }).weekdays, { a: [1] });
});

test('the nightly file carries them in a fixed order, and only where there are some', () => {
  const v = P.setWeekdays(P.setPaused(P.setNote(P.toggle(P.empty(), 1, T(1)), 1, 'n', T(2)), T(3)), [1]);
  const rows = [{ uid: 'u', email: 'e', pid: 'a', ...v }, { uid: 'u', email: 'e', pid: 'b', ...P.empty() }];
  const text = nightlyFile(rows);
  const u = JSON.parse(text).users.u;
  assert.deepEqual(u.paused, { a: T(3) });
  assert.deepEqual(u.weekdays, { a: [1] });
  assert.deepEqual(u.notes, { a: v.notes });
  assert.equal(nightlyFile([...rows].reverse()), text);
  assert.equal('notes' in JSON.parse(nightlyFile([rows[1]])).users.u, false);
  // and the nightly file imports them
  assert.equal(P.noteOf(planImport({}, text, { known: ['a', 'b'], uid: 'u' }).result('merge').a, 1, 1), 'n');
});
