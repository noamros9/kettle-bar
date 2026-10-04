// Phase 16 ticket 2: catalogue 9, the exercises the muscle-focus subjects and the after-dark programs need, and three
// new muscles on the body map (neck, traps, shins). Builds at catalogue 8 or older never draw them.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { figureSVG, muscleMapSVG } = require('../figures.js');
const { buildConfig, CONFIGS } = require('../program-builder.js');

const NEW = Object.values(cat.EX).filter((e) => e.added === 9).map((e) => e.id);
const GROUPS = {
  Chest: ['wide_pushup', 'pseudo_planche_pushup', 'pushup_hold', 'close_grip_press', 'squeeze_press', 'kb_floor_press'],
  Back: ['reverse_fly', 'gorilla_row', 'kb_dead_stop_row', 'prone_y_raise'],
  Shoulders: ['upright_row', 'lateral_raise_hold', 'external_rotation', 'pike_hold'],
  Arms: ['concentration_curl', 'zottman_curl', 'cross_body_curl', 'tate_press', 'floor_dip', 'close_grip_pushup'],
  'Hips & adductors': ['side_lying_adduction', 'sumo_pulse', 'adductor_rockback', 'frog_pump', 'standing_knee_hold'],
  'Calves & lower legs': ['calf_raise', 'db_calf_raise', 'bent_knee_calf_raise', 'tibialis_raise', 'heel_walk', 'calf_raise_hold'],
  'Neck & traps': ['db_shrug', 'shrug_hold', 'neck_iso_front', 'neck_iso_back', 'neck_iso_side', 'prone_neck_lift'],
  'After-dark': ['pelvic_floor_hold', 'bridge_hold', 'bridge_pulse'],
};

test('catalogue 9 holds the exercises each new subject needs, and nothing else', () => {
  assert.deepEqual(NEW.slice().sort(), Object.values(GROUPS).flat().sort());
});

test('every new exercise draws, with muscles, a cue, reps for three levels and a known category', () => {
  const CATS = ['chest', 'back', 'abs', 'upper', 'lower', 'mobility'];
  NEW.forEach((id) => {
    const e = cat.EX[id];
    assert.ok(CATS.includes(e.cat), `${id}: ${e.cat}`);
    assert.ok(e.muscles.primary.length >= 1, id);
    [...e.muscles.primary, ...e.muscles.secondary].forEach((m) => assert.ok(cat.MUSCLE_NAMES[m], `${id}: unknown muscle ${m}`));
    assert.ok(e.cue.length > 30, id);
    assert.equal(e.r.length, 3, id);
    assert.ok(e.r[0] <= e.r[1] && e.r[1] <= e.r[2], `${id}: reps grow with the level`);
    assert.ok(e.u === 'sec' || e.tp > 0, `${id}: reps have a time per rep`);
    const svg = figureSVG(e, e.name);
    assert.match(svg, /^<svg/, id);
    assert.doesNotMatch(svg, /NaN|undefined/, id);
  });
});

test('none of them lands in an abs finisher or a warm-up: no new abs, warm-up or cool-down exercises', () => {
  NEW.forEach((id) => assert.ok(!['abs', 'warmup', 'cooldown'].includes(cat.EX[id].cat), id));
});

test('the subjects get their muscle: each group\'s exercises have it as a main muscle', () => {
  const MAIN = { Chest: ['chest', 'triceps'], Back: ['lats', 'upper_back', 'rear_delts', 'traps'], Shoulders: ['side_delts', 'front_delts', 'rear_delts', 'traps'], Arms: ['biceps', 'triceps', 'forearms'], 'Hips & adductors': ['adductors', 'hip_flexors', 'glutes'], 'Calves & lower legs': ['calves', 'shins'], 'Neck & traps': ['neck', 'traps'], 'After-dark': ['glutes', 'abs'] };
  Object.entries(GROUPS).forEach(([g, ids]) => ids.forEach((id) => assert.ok(cat.EX[id].muscles.primary.some((m) => MAIN[g].includes(m)), `${g}: ${id}`)));
});

test('the gear is what the move needs: loaded moves name their load, the bodyweight ones need none', () => {
  ['kb_floor_press', 'kb_dead_stop_row', 'sumo_pulse'].forEach((id) => assert.equal(cat.EX[id].load, 'kb', id));
  ['close_grip_press', 'squeeze_press', 'reverse_fly', 'gorilla_row', 'upright_row', 'lateral_raise_hold', 'external_rotation', 'concentration_curl', 'zottman_curl', 'cross_body_curl', 'tate_press', 'db_calf_raise', 'db_shrug', 'shrug_hold']
    .forEach((id) => assert.ok(['heavy', 'medium', 'light', 'single'].includes(cat.EX[id].load), id));
  ['wide_pushup', 'pseudo_planche_pushup', 'pushup_hold', 'prone_y_raise', 'pike_hold', 'floor_dip', 'close_grip_pushup', ...GROUPS['Hips & adductors'].filter((id) => id !== 'sumo_pulse'),
    'calf_raise', 'bent_knee_calf_raise', 'tibialis_raise', 'heel_walk', 'calf_raise_hold', 'neck_iso_front', 'neck_iso_back', 'neck_iso_side', 'prone_neck_lift', ...GROUPS['After-dark']]
    .forEach((id) => assert.ok(cat.allowedIn('bw', cat.EX[id]), `${id} needs no gear`));
});

test('the body map has the three new muscles, front or back, and only new exercises use them', () => {
  ['neck', 'traps', 'shins'].forEach((m) => {
    assert.ok(cat.MUSCLE_NAMES[m], m);
    assert.match(muscleMapSVG({ [m]: 1 }, 'x'), new RegExp(`data-m="${m}" class="mm-l4"`), `${m} is drawn`);
  });
  Object.values(cat.EX).filter((e) => (e.added || 0) < 9).forEach((e) => [...e.muscles.primary, ...e.muscles.secondary]
    .forEach((m) => assert.ok(!['neck', 'traps', 'shins'].includes(m), `${e.id} (older) now works ${m}: past stats would move`)));
});

test('builds at catalogue 8 or older never draw them: every config made before catalogue 9, rebuilt at 8', () => {
  const used = (p) => new Set(p.days.flatMap((d) => d.blocks.flatMap((b) => b.items.map((it) => it.ex))));
  CONFIGS.filter((c) => !c.frozen && (c.catalogue || 0) < 9).forEach((c) => {
    const u = used(buildConfig({ ...c, catalogue: 8 }));
    NEW.forEach((id) => assert.ok(!u.has(id), `${c.id} draws ${id}`));
  });
});
