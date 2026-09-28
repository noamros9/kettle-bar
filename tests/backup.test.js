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
