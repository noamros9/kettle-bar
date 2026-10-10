// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// Phase 18 ticket 6: the couple subjects besides Couples. Date night warm-up (short partner warm-up and tease), Positions
// tour (30 one-off days: a position and a way to prepare for it, then the position) and Morning glory / Sunday (slow and
// long, ending in positions). All for two: out of build your own and random workouts; Mixed rules hold.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS } = require('../program-builder.js');
const R = require('../recipes.js');
const programs = require('./helpers/library.js').library();

const SUBJECTS = ['Date night warm-up', 'Positions tour', 'Morning glory / Sunday'];
const TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');
const of = (subject) => programs.filter((p) => p.subject === subject);
const cfgOf = (id) => CONFIGS.find((c) => c.id === id);

test('five programs each, all for two and out of build your own; Mixed rules every day; a couple exercise every day', () => {
  SUBJECTS.forEach((s) => {
    assert.equal(of(s).length, 5, s);
    assert.deepEqual(R.pick({ subjects: [s] }), [], s);
    of(s).forEach((p) => {
      assert.ok(cfgOf(p.id).couple && R.skipped.includes(p.id), p.id);
      p.days.forEach((d) => {
        const m = mains(d);
        assert.ok(m.every((b) => TAGS.includes(b.family)), `${p.id} d${d.day}: untagged`);
        assert.ok(new Set(m.map((b) => b.family)).size >= 2, `${p.id} d${d.day}: one family`);
        assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${p.id} d${d.day}: abs`);
        assert.ok(m.some((b) => b.items.some((it) => EX[it.ex].cat === 'couple')), `${p.id} d${d.day}: nothing for two`);
        m.forEach((b) => { const ids = b.items.map((it) => it.ex); assert.equal(new Set(ids).size, ids.length, `${p.id} d${d.day} ${b.title}`); });
      });
    });
  });
});

test('Positions tour: 30 one-off days, never the same position two days running, each ending with its own position', () => {
  of('Positions tour').forEach((p) => {
    assert.equal(p.days.length, 30);
    assert.equal(new Set(p.days.map((d) => d.type)).size, 30, `${p.id}: a day repeats`);
    const pos = (d) => 'pos_' + d.type.split('-')[0];
    p.days.forEach((d, i) => {
      const last = mains(d).at(-1);
      assert.equal(last.title, 'The position');
      assert.equal(last.items[0].ex, pos(d), `${p.id} d${d.day}`);
      assert.ok(last.items.every((it) => it.ex.startsWith('pos_')));
      if (i) assert.notEqual(pos(d), pos(p.days[i - 1]), `${p.id} d${d.day}: same position as yesterday`);
    });
  });
});

test('Date night warm-up is short; Morning glory / Sunday is long and ends in positions', () => {
  of('Date night warm-up').forEach((p) => assert.ok(cfgOf(p.id).minutes[1] <= 20, p.id));
  of('Morning glory / Sunday').forEach((p) => {
    assert.ok(cfgOf(p.id).minutes[0] >= 40, p.id);
    p.days.forEach((d) => assert.ok(mains(d).at(-1).items.every((it) => it.ex.startsWith('pos_')), `${p.id} d${d.day}`));
  });
});
