// Formats in one place: every rule that depends on a block's format lives in formats.js (review III, ticket 3).
// The expected numbers were taken from the functions this table replaced (blockTime, OPTS, stats setsOf, summary's
// blockText, FORMAT_NAMES) on one sample block per format, before they moved.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const Formats = require('../formats.js');
const { EX } = require('../exercises.js');
const { timing, REST } = require('../program-builder.js');

const it = (ex, n, extra) => ({ ex, n, ...extra });
const SAMPLES = {
  straight: { format: 'straight', sets: 3, items: [it('pushup', 10), it('one_arm_row', 8, { sets: 4 }), it('plank', 40)] },
  superset: { format: 'superset', sets: 3, items: [it('pushup', 10, { tempo: 1 }), it('one_arm_row', 8), it('plank', 40)] },
  circuit: { format: 'circuit', rounds: 3, items: [it('pushup', 10), it('side_plank', 30), it('diamond_pushup', 8)] },
  emom: { format: 'emom', minutes: 10, items: [it('pushup', 5), it('one_arm_row', 4), it('plank', 30)] },
  amrap: { format: 'amrap', minutes: 7, items: [it('pushup', 5), it('one_arm_row', 4)] },
  ladder: { format: 'ladder', minutes: 5, items: [it('pushup', 1), it('one_arm_row', 1), it('dive_bomber', 1)] },
  tabata: { format: 'tabata', tabatas: 2, items: [it('pushup', 20), it('plank', 20), it('diamond_pushup', 20)] },
  flow: { format: 'flow', title: 'Sun flow', repeat: 2, items: [it('side_plank', 30), it('pushup', 6), it('plank', 20)] },
  bouts: { format: 'bouts', rest: 60, items: [it('jab_cross', 180), it('four_punch', 180), it('jab_cross_hook', 180)] },
};
const R2 = { set: 45, exercise: 90, beforeAbs: 120, superset: 60, round: 75, block: 100 };
const EXPECT = {
  straight: { time: 699, timeR: 849, name: 'Straight sets', text: '3 exercises in straight sets', sets: [['pushup', 3, 10], ['one_arm_row', 4, 16], ['plank', 3, 0]] },
  superset: { time: 736.5, timeR: 826.5, name: 'Supersets', text: '3 exercises as supersets', sets: [['pushup', 3, 10], ['one_arm_row', 3, 16], ['plank', 3, 0]] },
  circuit: { time: 587.4000000000001, timeR: 617.4000000000001, name: 'Circuits', text: 'a 3-round circuit of 3 exercises', sets: [['pushup', 3, 10], ['side_plank', 3, 0], ['diamond_pushup', 3, 8]] },
  emom: { time: 600, timeR: 600, name: 'EMOM', text: 'a 10-minute EMOM', sets: [['pushup', 4, 5], ['one_arm_row', 3, 8], ['plank', 3, 0]] },
  amrap: { time: 420, timeR: 420, name: 'AMRAP', text: 'a 7-minute AMRAP', sets: [['pushup', 3, 0], ['one_arm_row', 3, 0]] },
  ladder: { time: 300, timeR: 300, name: 'Ladders', text: 'a 5-minute ladder', sets: [['pushup', 2, 0], ['one_arm_row', 2, 0], ['dive_bomber', 2, 0]] },
  tabata: { time: 540, timeR: 580, name: 'Tabata', text: '2 Tabatas', sets: [['pushup', 6, 0], ['plank', 5, 0], ['diamond_pushup', 5, 0]] },
  flow: { time: 230, timeR: 230, name: 'Guided flow', text: 'a 3-pose flow done twice', sets: [['side_plank', 2, 0], ['pushup', 2, 6], ['plank', 2, 0]] },
  bouts: { time: 660, timeR: 660, name: 'Bouts', text: '3 bouts', sets: [['jab_cross', 1, 0], ['four_punch', 1, 0], ['jab_cross_hook', 1, 0]] },
};
const NINE = Object.keys(SAMPLES);

test('there is one entry for each of the nine formats, and no other', () => {
  assert.deepEqual(Object.keys(Formats.FORMATS).sort(), [...NINE].sort());
  assert.deepEqual(Object.keys(Formats.NAMES).sort(), [...NINE].sort());
});

for (const f of NINE) {
  test(`${f}: time, sets, summary words and name agree with the old per-module rules`, () => {
    const b = SAMPLES[f], x = EXPECT[f], fm = Formats.FORMATS[f];
    assert.equal(fm.time(b, REST, EX), x.time);
    assert.equal(fm.time(b, { ...R2 }, EX), x.timeR);
    assert.deepEqual(fm.sets(b, EX).map((s) => [s.ex, s.sets, s.repsPerSet]), x.sets);
    assert.equal(fm.summary(b), x.text);
    assert.equal(fm.name, x.name);
    assert.equal(Formats.NAMES[f], x.name);
    assert.equal(Formats.of(b), fm);
  });
}

test('the Program Builder times blocks through the table, and rests can be overridden', () => {
  for (const f of NINE) {
    assert.equal(timing.blockTime(SAMPLES[f]), EXPECT[f].time);
    assert.equal(timing.blockTime(SAMPLES[f], R2), EXPECT[f].timeR);
  }
});

test('a block with no format is straight sets; an unknown format is an error', () => {
  assert.equal(Formats.of({ items: [] }), Formats.FORMATS.straight);
  assert.throws(() => Formats.of({ format: 'yoga' }), /format yoga/);
});

test('options: the choice each format offers to the Program Builder', () => {
  const o = (f) => Formats.FORMATS[f].options;
  assert.deepEqual(o('straight'), { key: 'sets', values: [2, 3, 4, 5], pref: 4 });
  assert.deepEqual(o('superset'), { key: 'sets', values: [2, 3, 4, 5], pref: 4 });
  assert.deepEqual(o('circuit'), { key: 'rounds', values: [2, 3, 4, 5, 6], pref: 4 });
  assert.deepEqual(o('emom'), { key: 'minutes', values: [4, 6, 8, 10, 12, 14, 16, 18, 20], pref: 12 });
  assert.deepEqual(o('amrap'), { key: 'minutes', values: [3, 4, 5, 6, 7, 8, 10, 12, 15], pref: 8 });
  assert.deepEqual(o('ladder'), { key: 'minutes', values: [5, 6, 7, 8, 10, 12], pref: 8 });
  assert.deepEqual(o('tabata'), { key: 'tabatas', values: [1, 2, 3, 4], pref: 2 });
  assert.deepEqual(o('flow'), { key: 'repeat', values: [1, 2, 3], pref: 1 });
  assert.deepEqual(o('bouts'), { key: 'rest', values: [60], pref: 60 });
});

test('which formats run from one Start, get slow tempo, may drop optional slots, or halve their reps', () => {
  const pick = (k) => NINE.filter((f) => Formats.FORMATS[f][k]);
  assert.deepEqual(pick('timed'), ['emom', 'amrap', 'ladder', 'tabata', 'flow', 'bouts']);
  assert.deepEqual(pick('tempo'), ['straight', 'superset', 'circuit', 'tabata', 'bouts']);
  assert.deepEqual(pick('optionalSlots'), ['straight', 'superset', 'circuit', 'amrap']);
  assert.deepEqual(pick('halveReps'), ['emom', 'amrap']);
});

test('summary words: a one-pose flow is named by its title; passes; a/an; plurals', () => {
  const flow = SAMPLES.flow;
  assert.equal(Formats.FORMATS.flow.summary({ ...flow, items: [flow.items[0]], repeat: 3 }), 'sun flow done three times');
  assert.equal(Formats.FORMATS.flow.summary({ ...flow, repeat: 1 }), 'a 3-pose flow');
  assert.equal(Formats.FORMATS.flow.summary({ ...flow, repeat: 4 }), 'a 3-pose flow');
  assert.equal(Formats.FORMATS.emom.summary({ ...SAMPLES.emom, minutes: 8 }), 'an 8-minute EMOM');
  assert.equal(Formats.FORMATS.tabata.summary({ ...SAMPLES.tabata, tabatas: 1 }), '1 Tabata');
  assert.equal(Formats.FORMATS.bouts.summary({ ...SAMPLES.bouts, items: [SAMPLES.bouts.items[0]] }), '1 bout');
});

test('bouts take their rest from the block', () => {
  const b = { ...SAMPLES.bouts, rest: 90 };
  assert.equal(Formats.FORMATS.bouts.time(b, REST, EX), 3 * 180 + 2 * 90);
});

test('done when: no file but formats.js, the session and the configs spells out the flow or bouts format', () => {
  const root = path.join(__dirname, '..');
  const files = [...fs.readdirSync(root).filter((f) => f.endsWith('.js')), ...fs.readdirSync(path.join(root, 'app')).filter((f) => f.endsWith('.js')).map((f) => 'app/' + f)];
  const allowed = new Set(['formats.js', 'app/session.js']);
  const hits = files.filter((f) => !allowed.has(f) && /'(bouts|flow)'|"(bouts|flow)"|`(bouts|flow)`/.test(fs.readFileSync(path.join(root, f), 'utf8')));
  assert.deepEqual(hits, []);
});
