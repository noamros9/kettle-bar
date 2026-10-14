// Phase 33 ticket 1: a program's progress learns paused, training weekdays and a note per time a day was done.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../app/progress.js');

const T = (n) => `2026-10-${String(n).padStart(2, '0')}T08:00:00.000Z`;
const withDays = () => P.toggle(P.toggle(P.empty(), 1, T(1)), 2, T(2));

test('an old document, device copy and empty value read as not paused, no weekdays, no notes', () => {
  for (const v of [P.fromDoc({ done: { 1: T(1) }, swaps: [], past: [] }), P.fromDevice({ done: '{"1":"x"}', swaps: '[]', past: '[]' }), P.empty()]) {
    assert.equal(P.pausedAt(v), null);
    assert.deepEqual(P.weekdaysOf(v), []);
    assert.equal(P.noteOf(v, 1, 1), '');
    assert.equal('paused' in v || 'weekdays' in v || 'notes' in v, false);
  }
});

test('pause and resume; weekdays sorted, each once, only 0-6; both survive a new round', () => {
  let v = P.setPaused(withDays(), T(3));
  assert.equal(P.pausedAt(v), T(3));
  v = P.setWeekdays(v, [4, 0, 2, 2, 9, -1, 1.5, 'x']);
  assert.deepEqual(P.weekdaysOf(v), [0, 2, 4]);
  const next = P.startRound(v, T(4), []);
  assert.equal(P.pausedAt(next), T(3));
  assert.deepEqual(P.weekdaysOf(next), [0, 2, 4]);
  assert.equal(P.pausedAt(P.setPaused(v, null)), null);
  assert.equal('paused' in P.setPaused(v, null), false);
  assert.equal('weekdays' in P.setWeekdays(v, []), false);
  assert.deepEqual(P.weekdaysOf(P.setWeekdays(v, 'not a list')), []);
});

test('a note: trimmed, cut to 140, empty removes it; only on a day done; one per time done (269)', () => {
  let v = P.setNote(withDays(), 1, '  felt strong  ', T(5));
  assert.equal(P.noteOf(v, 1, 1), 'felt strong');
  assert.deepEqual(v.notes, { 1: { [T(1)]: { text: 'felt strong', at: T(5) } } });
  assert.equal(P.noteOf(P.setNote(v, 1, 'x'.repeat(200), T(6)), 1, 1).length, 140);
  assert.equal(P.NOTE_MAX, 140);
  assert.equal('notes' in P.setNote(v, 1, '   ', T(6)), false);
  assert.deepEqual(P.setNote(v, 7, 'never done', T(6)), v, 'a day not done takes no note');
  assert.deepEqual(P.setNote(v, 1, 'wrong date', T(6), T(9)), v, 'nor a date it was not done on');
  // done again: each date its own note, the latest by default
  v = P.doAgain(v, 1, T(8));
  v = P.setNote(v, 1, 'second time', T(8));
  assert.equal(P.noteOf(v, 1, 1), 'second time');
  assert.equal(P.noteOf(v, 1, 1, T(1)), 'felt strong');
  // removing a date takes its note; unmarking the day takes them all
  assert.equal(P.noteOf(P.removeMark(v, 1, T(8)), 1, 1), 'felt strong');
  assert.equal(P.noteOf(P.removeMark(v, 1, T(1)), 1, 1, T(8)), 'second time');
  const off = P.toggle(v, 1, T(9));
  assert.equal('notes' in off, false);
  assert.equal(P.noteOf(off, 1, 1), '');
  assert.equal(P.noteOf(P.setNote(withDays(), 2, 'kept', T(5)), 1, 2), 'kept', 'another day keeps its note');
  assert.equal(P.noteOf(P.toggle(P.setNote(withDays(), 2, 'kept', T(5)), 1, T(9)), 1, 2), 'kept');
  assert.equal(P.noteOf(v, 7, 1), '', 'an unknown round');
});

test('a new round keeps the old notes in past; noteOf reads them there', () => {
  const v = P.setNote(withDays(), 2, 'last of round one', T(5));
  const next = P.startRound(v, T(6), []);
  assert.equal('notes' in next, false);
  assert.deepEqual(next.past[0].notes, v.notes);
  assert.equal(P.noteOf(next, 1, 2), 'last of round one');
  assert.equal(P.noteOf(next, 2, 2), '');
});

test('the three round-trip through the cloud document and the device copy; damaged ones are dropped', () => {
  const v = P.setWeekdays(P.setPaused(P.setNote(withDays(), 1, 'hi', T(5)), T(6)), [1, 3]);
  const doc = P.toDoc(v, 'now');
  assert.deepEqual(P.fromDoc(doc), v);
  const dev = P.toDevice(v);
  assert.deepEqual(Object.keys(dev).sort(), ['done', 'notes', 'past', 'paused', 'swaps', 'weekdays']);
  assert.deepEqual(P.fromDevice(dev), v);
  assert.deepEqual(Object.keys(P.toDevice(withDays())).sort(), ['done', 'past', 'swaps']);
  const bad = P.fromDoc({ done: { 1: T(1) }, swaps: [], past: [], paused: 5, weekdays: {}, notes: { 1: { a: { text: '', at: 'x' }, b: 'str', c: { text: 'ok', at: 1 } }, 2: [], 3: null } });
  assert.deepEqual(bad, { done: { 1: T(1) }, swaps: [], past: [] });
  assert.deepEqual(P.fromDoc({ done: {}, swaps: [], past: [], notes: 'x' }), P.empty());
});

test('first sync: notes from both sides, the newer edit wins per date; paused and weekdays from the cloud when it has them', () => {
  const base = withDays();
  const local = P.setWeekdays(P.setPaused(P.setNote(P.setNote(base, 1, 'mine, newer', T(9)), 2, 'only mine', T(5)), T(7)), [2]);
  const cloud = P.setNote(P.setNote(base, 1, 'cloud, older', T(6)), 2, 'cloud day two, newer', T(8));
  const { merged, changed } = P.mergeFirstSync(local, cloud);
  assert.equal(P.noteOf(merged, 1, 1), 'mine, newer');
  assert.equal(P.noteOf(merged, 1, 2), 'cloud day two, newer');
  assert.equal(P.pausedAt(merged), T(7), 'the cloud has none: mine');
  assert.deepEqual(P.weekdaysOf(merged), [2]);
  assert.equal(changed, true);
  const cloud2 = P.setWeekdays(P.setPaused(cloud, T(3)), [5]);
  const m2 = P.mergeFirstSync(local, cloud2).merged;
  assert.equal(P.pausedAt(m2), T(3));
  assert.deepEqual(P.weekdaysOf(m2), [5]);
  // the same notes, paused and weekdays: nothing to write
  assert.equal(P.mergeFirstSync(cloud2, cloud2).changed, false);
  // no cloud copy: a paused program alone is worth a document
  assert.equal(P.mergeFirstSync(P.setPaused(P.empty(), T(1)), null).changed, true);
  assert.equal(P.mergeFirstSync(P.empty(), null).changed, false);
  // a note on a date the merged days don't have is dropped
  const stray = { ...base, notes: { 1: { [T(30)]: { text: 'stray', at: T(30) } } } };
  assert.equal(P.mergeFirstSync(stray, base).merged.notes, undefined);
});

test('import: merge and replace carry them; an old file (none of the fields) keeps what the device has', () => {
  const cur = P.setWeekdays(P.setPaused(P.setNote(withDays(), 1, 'device', T(5)), T(6)), [1]);
  const file = { done: { 1: T(1), 3: T(3) }, swaps: [], past: [], notes: { 3: { [T(3)]: { text: 'from file', at: T(4) } } }, weekdays: [0, 6] };
  const m = P.importMerge(cur, file, 'merge');
  assert.equal(P.noteOf(m, 1, 1), 'device');
  assert.equal(P.noteOf(m, 1, 3), 'from file');
  assert.deepEqual(P.weekdaysOf(m), [0, 6]);
  assert.equal(P.pausedAt(m), T(6));
  const old = { done: { 1: T(1) } };
  const kept = P.importMerge(cur, old, 'merge');
  assert.equal(P.noteOf(kept, 1, 1), 'device');
  assert.equal(P.pausedAt(kept), T(6));
  const r = P.importMerge(cur, file, 'replace');
  assert.equal(P.noteOf(r, 1, 1), '', 'replace takes the file\'s notes');
  assert.equal(P.noteOf(r, 1, 3), 'from file');
  assert.equal(P.noteOf(P.importMerge(cur, old, 'replace'), 1, 1), 'device', 'a file with no notes leaves them');
  // the file a round ahead wins whole, with the device's paused and weekdays where it has none
  const ahead = { done: { 2: T(9) }, swaps: [], past: [{ round: 1, done: { 1: T(1) }, swaps: [], endedAt: T(8) }], notes: { 2: { [T(9)]: { text: 'round two', at: T(9) } } } };
  const w = P.importMerge(cur, ahead, 'merge');
  assert.equal(P.round(w), 2);
  assert.equal(P.noteOf(w, 2, 2), 'round two');
  assert.deepEqual(P.weekdaysOf(w), [1]);
  assert.deepEqual(P.importMerge(P.startRound(cur, T(8), []), file, 'merge'), P.startRound(cur, T(8), []), 'the device a round ahead keeps everything');
});
