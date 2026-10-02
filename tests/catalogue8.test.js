// Phase 14 ticket 3: catalogue 8, the exercises the new subjects need (running prep, court & field, grip, kettlebell
// complexes, climbing, gentle / low impact, back care). Builds at catalogue 7 or older never draw them.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { figureSVG } = require('../figures.js');
const { buildConfig, CONFIGS } = require('../program-builder.js');
const all = require('./helpers/library.js').library();

const NEW = Object.values(cat.EX).filter((e) => e.added === 8).map((e) => e.id);
const SUBJECTS = {
  'Running prep': ['a_skip', 'wall_drive', 'arm_drive'],
  'Court & field sports': ['carioca', 'shuttle_touch', 'split_step', 'backpedal'],
  'Grip & forearms': ['farmer_carry', 'wrist_curl', 'reverse_wrist_curl', 'reverse_curl', 'kb_bottoms_up_hold'],
  'Kettlebell complexes': ['kb_clean', 'kb_push_press', 'kb_one_arm_swing', 'kb_figure_eight', 'kb_around_body'],
  'Climber / pull strength': ['wide_pullup', 'lock_off', 'archer_pullup'],
  'Gentle / low impact': ['wall_pushup', 'sit_to_stand', 'standing_march', 'step_touch'],
  'Back care': ['pelvic_tilt', 'prone_press_up', 'clamshell', 'mcgill_curl_up', 'side_plank_knee'],
};

test('catalogue 8 holds the exercises each new subject needs, and nothing else', () => {
  assert.deepEqual(NEW.slice().sort(), Object.values(SUBJECTS).flat().sort());
});

test('every new exercise draws, with muscles, a cue, reps for three levels and a known category', () => {
  const CATS = ['chest', 'back', 'abs', 'cardio', 'upper', 'full', 'lower', 'mobility'];
  NEW.forEach((id) => {
    const e = cat.EX[id];
    assert.ok(CATS.includes(e.cat), `${id}: ${e.cat}`);
    assert.ok(e.muscles.primary.length >= 1, id);
    assert.ok(e.cue.length > 30, id);
    assert.equal(e.r.length, 3, id);
    assert.ok(e.r[0] <= e.r[1] && e.r[1] <= e.r[2], `${id}: reps grow with the level`);
    assert.ok(e.u === 'sec' || e.tp > 0, `${id}: reps have a time per rep`);
    assert.ok(e.poses.length >= 1, id);
    const svg = figureSVG(e, e.name);
    assert.match(svg, /^<svg/, id);
    assert.doesNotMatch(svg, /NaN|undefined/, id);
  });
});

test('the gear is what the move needs: bar moves on the bar, loaded moves with a kettlebell or dumbbells, the rest none', () => {
  ['wide_pullup', 'lock_off', 'archer_pullup'].forEach((id) => assert.deepEqual(cat.EX[id].equip, ['bar'], id));
  ['kb_clean', 'kb_push_press', 'kb_one_arm_swing', 'kb_figure_eight', 'kb_around_body', 'kb_bottoms_up_hold'].forEach((id) => assert.equal(cat.EX[id].load, 'kb', id));
  ['farmer_carry', 'wrist_curl', 'reverse_wrist_curl', 'reverse_curl'].forEach((id) => assert.ok(['heavy', 'medium', 'light'].includes(cat.EX[id].load), id));
  [...SUBJECTS['Running prep'], ...SUBJECTS['Court & field sports'], ...SUBJECTS['Gentle / low impact'], ...SUBJECTS['Back care']]
    .forEach((id) => assert.ok(cat.allowedIn('bw', cat.EX[id]), `${id} needs no gear`));
});

test('builds at catalogue 7 or older never draw them: the library, and every config rebuilt at 7', () => {
  const used = (p) => new Set(p.days.flatMap((d) => d.blocks.flatMap((b) => b.items.map((it) => it.ex))));
  all.forEach((p) => NEW.forEach((id) => assert.ok(!used(p).has(id), `${p.id} draws ${id}`)));
  CONFIGS.filter((c) => !c.frozen).forEach((c) => {
    const u = used(buildConfig({ ...c, catalogue: 7 }));
    NEW.forEach((id) => assert.ok(!u.has(id), `${c.id} at 7 draws ${id}`));
  });
});
