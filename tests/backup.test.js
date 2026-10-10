// Backup: the progress file format (export now; import, diff and merge come in #14).
const test = require('node:test');
const assert = require('node:assert/strict');
const { exportProgress, fileName } = require('../app/backup.js');

test('export lists every program with its done days and when each was first marked', () => {
  const file = exportProgress({ a: { 1: '2026-09-01T07:00:00.000Z', 3: '2026-09-03T07:00:00.000Z' }, b: {} }, { now: () => '2026-09-28T12:00:00.000Z' });
  assert.deepEqual(file, {
    format: 'kettle-bar-progress', version: 2, exportedAt: '2026-09-28T12:00:00.000Z',
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
  assert.deepEqual(got, { programs: { a: { 1: 't1' } }, swaps: {}, rounds: {}, short: {}, again: {}, unknown: ['gone'], ownPrograms: null, random: null, prefs: null });
});

test('reading refuses files that are not a readable backup, saying why', () => {
  assert.throws(() => parseBackup('{oops', { known }), /isn't a Kettle & Bar backup \(it can't be read\)/);
  assert.throws(() => parseBackup('[]', { known }), /isn't a Kettle & Bar backup/);
  assert.throws(() => parseBackup('null', { known }), /isn't a Kettle & Bar backup/);
  assert.throws(() => parseBackup(JSON.stringify({ format: 'other' }), { known }), /isn't a Kettle & Bar backup/);
  assert.throws(() => parseBackup(file({}, { version: 3 }), { known }), /newer version of the app/);
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
  assert.deepEqual(JSON.parse(text), { format: 'kettle-bar-backup', version: 2, users: {
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
  const src = [...require('../build.js').PAGES, 'app/main.js'].map((f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
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

// ---------- account data: own programs, random workouts, preferences (file version 2) ----------
const file2 = (programs, extra) => JSON.stringify({ format: 'kettle-bar-progress', version: 2, exportedAt: 'x', programs, ...extra });
const own = (name, updatedAt, extra) => ({ name, updatedAt, ...extra });

test('a version 1 export still imports, unchanged: same diff, notes and results, and no account data to touch', () => {
  const v1 = JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: '2026-09-01T00:00:00.000Z', programs: { a: { 1: 't', 4: 'x' } }, swaps: { a: [sw(2, 'p', 'q')] }, rounds: {} });
  const current = { a: { done: { 1: 't', 2: 'b' }, swaps: [], past: [] } };
  const plan = planImport(current, v1, { known: ['a'], name: 'old.json', docs: { programs: { keep: own('Mine', '1') }, random: {}, prefs: { main: { travel: true } } } });
  assert.deepEqual(plan.diff, { a: { added: [4], removed: [2] } });
  assert.deepEqual(plan.swapNotes, [{ pid: 'a', file: 1, mine: 0 }]);
  assert.deepEqual(plan.result('replace'), { a: { done: { 1: 't', 4: 'x' }, swaps: [sw(2, 'p', 'q')], past: [] } });
  assert.deepEqual(plan.docDiff, { programs: { added: [], removed: [], changed: [] }, random: { added: [], removed: [], changed: [] } });
  assert.equal(plan.prefsNote, null);
  assert.deepEqual(plan.docsResult('replace'), { programs: null, random: null, prefs: null }, 'a file without account data leaves yours alone, even for Replace');
  assert.equal(plan.message('replace'), 'Replaced: 1 day added, 1 removed.');
  assert.equal(plan.message('merge'), 'Merged: 1 day added.');
  assert.deepEqual(parseBackup(v1, { known: ['a'] }).ownPrograms, null);
  const nightly1 = JSON.stringify({ format: 'kettle-bar-backup', version: 1, users: { u: { email: 'e', programs: { a: { 1: 't' } } } } });
  assert.deepEqual(parseBackup(nightly1, { known: ['a'] }).programs, { a: { 1: 't' } });
});

test('export adds ownPrograms, random and prefs only when there are any; an old-style export has no such keys', () => {
  const f = exportProgress({ a: {} }, { now: () => 'n', ownPrograms: { z: own('Z', '2', { b: 1, a: 2 }), y: own('Y', '1') }, random: { r1: own('R', '3') }, prefs: { main: { travel: true } } });
  assert.equal(f.version, 2);
  assert.deepEqual(Object.keys(f.ownPrograms), ['y', 'z']);
  assert.equal(JSON.stringify(f.ownPrograms.z), '{"a":2,"b":1,"name":"Z","updatedAt":"2"}');
  assert.deepEqual(f.random, { r1: own('R', '3') });
  assert.deepEqual(f.prefs, { travel: true });
  const bare = exportProgress({ a: {} }, { now: () => 'n', ownPrograms: {}, random: {}, prefs: {} });
  assert.deepEqual(Object.keys(bare), ['format', 'version', 'exportedAt', 'programs', 'swaps', 'rounds']);
  assert.deepEqual(Object.keys(exportProgress({ a: {} }, { now: () => 'n', prefs: null })), Object.keys(bare));
});

test('a version 2 export with one own program and one random workout shows both in the import diff', () => {
  const text = JSON.stringify(exportProgress({ a: { 1: 't' } }, { now: () => 'n', ownPrograms: { mine: own('My push day', '2026-09-01') }, random: { r1: own('Quick one', '2026-09-02') } }));
  const plan = planImport({ a: { done: { 1: 't' }, swaps: [], past: [] } }, text, { known: ['a'], name: 'v2.json', docs: { programs: {}, random: {}, prefs: {} } });
  assert.deepEqual(plan.docDiff.programs, { added: [{ id: 'mine', name: 'My push day' }], removed: [], changed: [] });
  assert.deepEqual(plan.docDiff.random, { added: [{ id: 'r1', name: 'Quick one' }], removed: [], changed: [] });
  assert.equal(plan.hasChanges, true, 'account data alone is a change');
  assert.equal(plan.added, 0);
  assert.equal(plan.message('merge'), 'Merged: 0 days added, 1 own program added, 1 random workout added.');
});

test('import diff and results: merge is a union where the newer updatedAt wins; replace is the file\'s set; ids without a name show as the id', () => {
  const docs = { programs: { keep: own('Keep', '5'), both: own('Mine', '3'), gone: own('Gone', '1'), bare: {} }, random: { r: own('R', '1') }, prefs: {} };
  const text = file2({}, { ownPrograms: { keep: own('File keep', '4'), both: own('File', '6'), fresh: own('Fresh', '1'), bare: { name: '', updatedAt: '9' } }, random: { r: own('R', '1') } });
  const plan = planImport({}, text, { known: [], docs });
  assert.deepEqual(plan.docDiff.programs, { added: [{ id: 'fresh', name: 'Fresh' }], removed: [{ id: 'gone', name: 'Gone' }], changed: [{ id: 'bare', name: 'bare' }, { id: 'both', name: 'File' }, { id: 'keep', name: 'File keep' }] });
  assert.deepEqual(plan.docDiff.random, { added: [], removed: [], changed: [] });
  const merged = plan.docsResult('merge');
  assert.deepEqual(Object.keys(merged.programs).sort(), ['bare', 'both', 'fresh', 'gone', 'keep']);
  assert.deepEqual([merged.programs.keep.name, merged.programs.both.name, merged.programs.bare.updatedAt], ['Keep', 'File', '9']);
  assert.deepEqual(plan.docsResult('replace').programs, { keep: own('File keep', '4'), both: own('File', '6'), fresh: own('Fresh', '1'), bare: { name: '', updatedAt: '9' } });
  assert.equal(plan.docsResult('replace').prefs, null);
  assert.equal(plan.message('replace'), 'Replaced: 0 days added, 0 removed; own programs: 1 added, 1 removed, 3 changed.');
});

test('preferences: Replace takes the file\'s, Merge keeps the device\'s (or the file\'s when the device has none); the review says when they differ', () => {
  const text = file2({}, { prefs: { travel: true, updatedAt: '2' } });
  const mine = { main: { travel: false, updatedAt: '1' } };
  const plan = planImport({}, text, { known: [], docs: { programs: {}, random: {}, prefs: mine } });
  assert.deepEqual(plan.prefsNote, { mine: true });
  assert.deepEqual(plan.docsResult('merge').prefs, mine);
  assert.deepEqual(plan.docsResult('replace').prefs, { main: { travel: true, updatedAt: '2' } });
  assert.equal(plan.hasChanges, true);
  assert.equal(plan.message('replace'), 'Replaced: 0 days added, 0 removed; preferences from the file.');
  const fresh = planImport({}, text, { known: [] });
  assert.deepEqual(fresh.prefsNote, { mine: false });
  assert.deepEqual(fresh.docsResult('merge').prefs, { main: { travel: true, updatedAt: '2' } });
  assert.equal(fresh.message('merge'), 'Merged: 0 days added, preferences from the file.');
  assert.equal(planImport({}, text, { known: [], docs: { programs: {}, random: {}, prefs: { main: { updatedAt: '2', travel: true } } } }).prefsNote, null, 'the same preferences are no change');
});

test('reading account data: refuses broken sections, says which', () => {
  const bad = (extra, re) => assert.throws(() => parseBackup(file2({}, extra), { known }), re);
  bad({ ownPrograms: [] }, /damaged: own programs/);
  bad({ ownPrograms: { x: [] } }, /damaged: own programs x/);
  bad({ random: 'r' }, /damaged: random workouts/);
  bad({ random: { r: 5 } }, /damaged: random workouts r/);
  bad({ prefs: [] }, /damaged: preferences/);
  const ok = parseBackup(file2({}, { ownPrograms: { x: own('X', '1') }, random: {}, prefs: { travel: true } }), { known });
  assert.deepEqual([ok.ownPrograms, ok.random, ok.prefs], [{ x: own('X', '1') }, {}, { travel: true }]);
});

test('the nightly file (version 2) carries each account\'s ownPrograms, random and prefs, only when non-empty, in a stable order', () => {
  const docRows = [
    { uid: 'u1', email: 'a@x', collection: 'random', id: 'r2', doc: { updatedAt: '2', name: 'B' } },
    { uid: 'u1', email: 'a@x', collection: 'programs', id: 'zed', doc: { name: 'Z', updatedAt: '1' } },
    { uid: 'u1', email: 'a@x', collection: 'programs', id: 'alpha', doc: { updatedAt: '1', name: 'A', picks: { b: 1, a: 2 } } },
    { uid: 'u1', email: 'a@x', collection: 'prefs', id: 'main', doc: { travel: true, hidden: [] } },
    { uid: 'u1', email: 'a@x', collection: 'prefs', id: 'other', doc: { ignored: true } },
    { uid: 'u3', email: 'c@x', collection: 'programs', id: 'solo', doc: { name: 'S' } },
  ];
  const text = nightlyFile(rows, docRows);
  const data = JSON.parse(text);
  assert.equal(data.version, 2);
  assert.deepEqual(Object.keys(data.users), ['u1', 'u2', 'u3']);
  assert.deepEqual(Object.keys(data.users.u1.ownPrograms), ['alpha', 'zed']);
  assert.equal(JSON.stringify(data.users.u1.ownPrograms.alpha), '{"name":"A","picks":{"a":2,"b":1},"updatedAt":"1"}');
  assert.deepEqual(data.users.u1.random, { r2: { name: 'B', updatedAt: '2' } });
  assert.deepEqual(data.users.u1.prefs, { hidden: [], travel: true });
  assert.equal(data.users.u2.ownPrograms, undefined);
  assert.deepEqual(data.users.u3, { email: 'c@x', programs: {}, ownPrograms: { solo: { name: 'S' } } });
  assert.equal(nightlyFile([...rows].reverse(), [...docRows].reverse()), text, 'same data, same bytes');
  assert.equal(nightlyFile(rows), nightlyFile(rows, []), 'no account data: no fields');
  assert.doesNotMatch(nightlyFile(rows), /ownPrograms|random|prefs/);
  const back = parseBackup(text, { known, uid: 'u1' });
  assert.deepEqual(Object.keys(back.ownPrograms), ['alpha', 'zed']);
  assert.deepEqual(back.random.r2, { name: 'B', updatedAt: '2' });
  assert.deepEqual(back.prefs, { hidden: [], travel: true });
});

// ---- Shorter today (Phase 7 ticket 4): short days travel in export, nightly and import; files without them are unchanged ----
test('short days are exported only when there are some, and a file without them is the same bytes as before', () => {
  const now = () => 'T';
  const before = JSON.stringify(exportProgress({ a: { 1: 't' } }, { now }));
  assert.equal(JSON.stringify(exportProgress({ a: { 1: 't' } }, { now, short: { a: {} } })), before);
  const f = exportProgress({ a: { 1: 't' } }, { now, short: { a: { 1: true }, b: {} } });
  assert.deepEqual(f.short, { a: { 1: true } });
});

test('short days in a file are read, checked and imported; an old file keeps yours', () => {
  const file = JSON.stringify({ format: 'kettle-bar-progress', version: 2, programs: { a: { 1: 't', 2: 'u' } }, short: { a: { 2: true }, zz: { 1: true } } });
  const parsed = parseBackup(file, { known: ['a'] });
  assert.deepEqual(parsed.short, { a: { 2: true } }, 'unknown programs are left out');
  const plan = planImport({ a: { done: { 1: 't', 2: 'u' }, swaps: [], past: [] } }, file, { known: ['a'], name: 'f' });
  assert.equal(plan.hasChanges, true, 'a short day the device lacks is a change');
  assert.equal(plan.canMerge, true);
  assert.deepEqual(plan.result('merge').a.short, { 2: true });
  const old = JSON.stringify({ format: 'kettle-bar-progress', version: 2, programs: { a: { 1: 't' } } });
  const mine = { a: { done: { 1: 't' }, swaps: [], past: [], short: { 1: true } } };
  assert.deepEqual(planImport(mine, old, { known: ['a'], name: 'f' }).result('replace').a.short, { 1: true });
  assert.equal(planImport(mine, file.replace('"2":true', '"1":true'), { known: ['a'], name: 'f' }).hasChanges, true, 'days added still count');
  for (const bad of [[1], { a: 'x' }, { a: { 0: true } }, { a: { 1: 'yes' } }]) {
    const t = JSON.stringify({ format: 'kettle-bar-progress', version: 2, programs: { a: {} }, short: bad });
    assert.throws(() => parseBackup(t, { known: ['a'] }), /damaged: .*short/);
  }
});

test('the nightly file carries short days of the current round, and past rounds keep their own', () => {
  const past = [{ round: 1, done: { 3: 'x' }, swaps: [], short: { 3: true }, endedAt: 'e' }];
  const text = nightlyFile([{ uid: 'u', pid: 'a', done: { 1: 't' }, swaps: [], past, short: { 1: true } }, { uid: 'u', pid: 'b', done: {}, past: [] }]);
  const u = JSON.parse(text).users.u;
  assert.deepEqual(u.short, { a: { 1: true } });
  assert.deepEqual(u.rounds.a[0].short, { 3: true });
  const plain = nightlyFile([{ uid: 'u', pid: 'b', done: {}, past: [] }]);
  assert.equal('short' in JSON.parse(plain).users.u, false);
  assert.deepEqual(parseBackup(text, { known: ['a', 'b'], uid: 'u' }).short, { a: { 1: true } });
});

test('Phase 13: a skip list rides in the prefs; an old prefs doc without one still imports', () => {
  const f = exportProgress({ a: {} }, { now: () => 'n', prefs: { main: { skip: ['pushup', 'kb_swing'], travel: 'bw' } } });
  assert.deepEqual(f.prefs, { skip: ['pushup', 'kb_swing'], travel: 'bw' });
  assert.deepEqual(parseBackup(JSON.stringify(f), { known: ['a'] }).prefs, { skip: ['pushup', 'kb_swing'], travel: 'bw' });
  const old = exportProgress({ a: {} }, { now: () => 'n', prefs: { main: { travel: 'bw' } } });
  assert.deepEqual(parseBackup(JSON.stringify(old), { known: ['a'] }).prefs, { travel: 'bw' });
});
