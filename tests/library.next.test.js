// What next: suggestNext(pid, summaries, progressOf, { families }) -> up to 3 program ids of the same family.
const test = require('node:test');
const assert = require('node:assert/strict');
const { suggestNext } = require('../app/library.js');

const FAM = [['Strength', ['Signature', 'Strength', 'Pull-ups']], ['Mind', ['Yoga', 'Pilates']], ['Mixed', ['Fighter', 'Athlete']]];
const mk = (id, subject, formats = ['straight'], extra = {}) => ({ id, subject, formats, source: 'library', ...extra });
const S = [
  mk('sig1', 'Signature'), mk('str1', 'Strength'), mk('str2', 'Strength', ['straight', 'emom']),
  mk('pull1', 'Pull-ups'), mk('pull2', 'Pull-ups', ['superset']), mk('yoga1', 'Yoga', ['flow']), mk('pil1', 'Pilates', ['flow']),
  mk('fig1', 'Fighter', ['bouts']), mk('ath1', 'Athlete'), mk('ath2', 'Athlete', ['tabata']),
];
const none = () => 0;
const next = (pid, progress = none, list = S) => suggestNext(pid, list, progress, { families: FAM });

test('never the same program, never one with progress, never another family', () => {
  const got = next('sig1', (id) => (id === 'str1' ? 3 : 0));
  assert.ok(!got.includes('sig1') && !got.includes('str1'));
  assert.ok(got.length === 3 && got.every((id) => ['str2', 'pull1', 'pull2'].includes(id)));
});

test('prefers a different subject, then more new formats, then library order', () => {
  assert.deepEqual(next('str1'), ['pull2', 'sig1', 'pull1']);
});

test('the same subject only when its formats differ', () => {
  const list = [mk('a', 'Strength'), mk('b', 'Strength'), mk('c', 'Strength', ['emom'])];
  assert.deepEqual(next('a', none, list), ['c']);
});

test('at most three; fewer when fewer fit', () => {
  assert.equal(next('sig1').length, 3);
  assert.deepEqual(next('yoga1'), ['pil1']);
  assert.deepEqual(next('yoga1', (id) => (id === 'pil1' ? 1 : 0)), []);
});

test("own program: library programs of its first subject's family; own programs are never suggested", () => {
  const mix = mk('own-x', 'Yoga + Strength', ['straight'], { source: 'own', mix: ['Yoga', 'Strength'] });
  assert.deepEqual(next('own-x', none, [mix, ...S]), ['pil1', 'yoga1']);
  const one = mk('own-y', 'Pull-ups', ['straight'], { source: 'own' });
  const other = mk('own-z', 'Strength', ['straight'], { source: 'own' });
  assert.deepEqual(next('own-y', none, [one, other, ...S]), ['str2', 'sig1', 'str1']);
});

test('Mixed programs get the Mixed family', () => {
  assert.deepEqual(next('fig1'), ['ath1', 'ath2']);
});

test('a subject no family lists, or an unknown program, gets nothing', () => {
  assert.deepEqual(next('own-q', none, [mk('own-q', 'Juggling', ['straight'], { source: 'own' }), ...S]), []);
  assert.deepEqual(next('nope'), []);
});
