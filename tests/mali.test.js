// Phase 35 ticket 1a (decision 349): she is Mali in the exercises, once per cue and name, at the first she/her.
// Built days hold only exercise ids, so no pin moves (the build's pin gate checks that in CI).
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { nameMali } = require('../scripts/name-mali.js');

const SHE = /\b(she|her|hers|herself)\b/i;
const couple = Object.values(EX).filter((e) => e.cat === 'couple');

test('every couple cue and name that mentions her names Mali exactly once, before any she/her', () => {
  const bad = [];
  couple.forEach((e) => ['name', 'cue'].forEach((f) => {
    const t = e[f];
    const malis = (t.match(/\bMali\b/g) || []).length;
    if (!malis && !SHE.test(t)) return;
    const first = t.search(/\bMali\b/);
    if (malis !== 1 || SHE.test(t.slice(0, first))) bad.push(`${e.id}.${f}`);
  }));
  assert.deepEqual(bad, []);
});

test('no solo exercise names Mali', () => {
  assert.deepEqual(Object.values(EX).filter((e) => e.cat !== 'couple' && /Mali/.test(`${e.name} ${e.cue}`)).map((e) => e.id), []);
});

test('the script names Mali as her or as hers by the word after', () => {
  assert.equal(nameMali('She lies back. She smiles.'), 'Mali lies back. She smiles.');
  assert.equal(nameMali('Her on her back, knees open.'), 'Mali on her back, knees open.');
  assert.equal(nameMali('Her back on the wall.'), "Mali's back on the wall.");
  assert.equal(nameMali('You behind her, her top knee up.'), 'You behind Mali, her top knee up.');
  assert.equal(nameMali('Pin her to the wall.'), 'Pin Mali to the wall.');
  assert.equal(nameMali('Kneel at her side'), "Kneel at Mali's side");
  assert.equal(nameMali('Mali kneels. She smiles.'), 'Mali kneels. She smiles.');
  assert.equal(nameMali('You both stand.'), 'You both stand.');
});

test('day names keep her: no day type of any program names Mali (decision 350, so no pin moves)', () => {
  const CONFIGS = require('../programs.config.js');
  const hits = CONFIGS.flatMap((c) => Object.entries(c.dayTypes || {}).filter(([, d]) => /Mali/.test(`${d.label} ${d.short}`)).map(([k]) => `${c.id}.${k}`));
  assert.deepEqual(hits, []);
});
