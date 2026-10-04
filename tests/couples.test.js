// Phase 18 ticket 3: Couples, 20 programs for two (configs/after-dark.js). Mixed rules: every main block tagged, two
// families or more a day, no abs after a flow; every day is a couple session (couple exercises, positions at the end or
// in the rounds); 14 build up and 6 alternate; four are 30-day programs; none in build your own or random workouts.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS } = require('../program-builder.js');
const programs = require('./helpers/library.js').library();
const R = require('../recipes.js');

const IDS = ['sweat-together', 'foreplay-fitness', 'strip-circuit', 'kiss-me-reps', 'lift-me-up', 'date-night-burn', 'partners-in-grime',
  'take-it-off', 'slow-burn-couples', 'sweaty-sheets', 'dare-night', 'massage-and-mount', 'couples-kama-sutra-30',
  'thirty-days-of-foreplay', 'ride-along', 'couples-quickie', 'fuck-fit', 'pin-me-down', 'wheelbarrow-race', 'fit-to-fuck-30'];
const couples = programs.filter((p) => p.subject === 'Couples');
const cfgOf = (id) => CONFIGS.find((c) => c.id === id);
const TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');
const isPos = (id) => id.startsWith('pos_');

test('Couples: the 20 programs, in order, all for two, no equipment, Noam\'s names', () => {
  assert.deepEqual(couples.map((p) => p.id), IDS);
  IDS.forEach((id) => { const c = cfgOf(id); assert.ok(c.couple && c.equip === 'bw' && c.catalogue === 10, id); });
  assert.equal(IDS.filter((id) => cfgOf(id).days === 30).length, 4);
  ['Fuck Fit', 'Fit to Fuck 30', 'Massage & Mount', 'Strip Circuit'].forEach((n) => assert.ok(couples.some((p) => p.name === n), n));
});

test('every day: main blocks tagged, two families or more, no abs, couple exercises only, and positions', () => {
  couples.forEach((p) => p.days.forEach((d) => {
    const m = mains(d);
    assert.ok(m.every((b) => TAGS.includes(b.family)), `${p.id} d${d.day}: untagged`);
    assert.ok(new Set(m.map((b) => b.family)).size >= 2, `${p.id} d${d.day}: one family`);
    assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${p.id} d${d.day}: abs`);
    const items = m.flatMap((b) => b.items.map((it) => it.ex));
    assert.ok(items.every((id) => EX[id].cat === 'couple'), `${p.id} d${d.day}: a solo exercise`);
    assert.ok(items.some(isPos), `${p.id} d${d.day}: no position`);
  }));
});

test('14 build up (partner work, tease, positions) and 6 alternate (partner sets and positions in rounds, then a massage)', () => {
  const kind = (p) => (mains(p.days[0]).length === 3 ? 'build' : 'rounds');
  assert.equal(couples.filter((p) => kind(p) === 'build').length, 14);
  couples.forEach((p) => p.days.forEach((d) => {
    const m = mains(d);
    if (kind(p) === 'build') {
      assert.deepEqual(m.slice(1).map((b) => b.title), ['Tease', 'Positions'], `${p.id} d${d.day}`);
      assert.ok(m[2].items.every((it) => isPos(it.ex) || it.ex === 'winners_choice'), `${p.id} d${d.day}: positions block`);
    } else {
      assert.equal(m[0].format, 'circuit');
      assert.ok(m[0].items.some((it) => isPos(it.ex)) && m[0].items.some((it) => !isPos(it.ex)), `${p.id} d${d.day}: rounds alternate`);
      assert.ok(m[1].items.every((it) => it.ex.endsWith('massage')), `${p.id} d${d.day}: a massage to finish`);
    }
  }));
});

test('none of them is in build your own or random workouts', () => {
  IDS.forEach((id) => assert.ok(R.skipped.includes(id), id));
  assert.deepEqual(R.pick({ subjects: ['Couples'] }), []);
});
