// Phase 18 tickets 4–6: the solo After dark subjects (training for it, alone), five programs each. Mixed rules: every
// main block tagged, two families or more a day, no abs after a flow; no couple exercise; no exercise twice in a block;
// each subject trains what it promises.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { CONFIGS } = require('../program-builder.js');
const { programFocus } = require('../app/stats.js');
const programs = require('./helpers/library.js').library();

// subject -> the muscles one of a program's three most-worked muscles must be
const PROMISE = {
  'Endurance & control': ['glutes', 'abs', 'hamstrings', 'quads', 'hip_flexors'],
  'Hip power & thrust': ['glutes', 'hamstrings'],
  'Carry & hold': ['quads', 'forearms', 'glutes', 'abs', 'upper_back', 'traps'],
  'Flexible & bendy': ['hamstrings', 'adductors', 'hip_flexors', 'glutes', 'lower_back'],
  'Strip & show-off': ['chest', 'front_delts', 'side_delts', 'biceps', 'triceps', 'abs', 'glutes'],
  'Her pleasure': ['neck', 'traps', 'forearms', 'upper_back', 'hip_flexors', 'quads', 'abs'],
  Quickie: ['quads', 'glutes', 'chest', 'abs', 'hamstrings', 'front_delts'],
  'Back & knees care': ['lower_back', 'glutes', 'abs', 'quads', 'forearms', 'rear_delts', 'upper_back', 'shins'],
};
const TAGS = ['Strength', 'Cardio & combat', 'Mind & body'];
const mains = (d) => d.blocks.filter((b) => b.kind !== 'abs' && b.kind !== 'warmup' && b.kind !== 'cooldown');

Object.entries(PROMISE).forEach(([subject, muscles]) => {
  test(`${subject}: five programs (one 30-day), Mixed rules, solo exercises only, what it promises`, () => {
    const list = programs.filter((p) => p.subject === subject);
    assert.equal(list.length, 5);
    assert.equal(list.filter((p) => CONFIGS.find((c) => c.id === p.id).days === 30).length, 1);
    list.forEach((p) => {
      p.days.forEach((d) => {
        const m = mains(d);
        assert.ok(m.every((b) => TAGS.includes(b.family)), `${p.id} d${d.day}: untagged`);
        assert.ok(new Set(m.map((b) => b.family)).size >= 2, `${p.id} d${d.day}: one family`);
        if (m.at(-1).format === 'flow') assert.ok(!d.blocks.some((b) => b.kind === 'abs'), `${p.id} d${d.day}: abs after a flow`);
        d.blocks.forEach((b) => {
          const ids = b.items.map((it) => it.ex);
          assert.equal(new Set(ids).size, ids.length, `${p.id} d${d.day} ${b.title}: an exercise twice`);
          assert.ok(ids.every((id) => EX[id].cat !== 'couple'), `${p.id} d${d.day}: a couple exercise`);
        });
      });
      const f = programFocus(p.days, EX), top = Object.entries(f).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
      assert.ok(top.some((k) => muscles.includes(k)), `${p.id}: top muscles ${top.join(', ')}`);
    });
  });
});
