// The program list is ordered: programs.config.js sets the order of the program list, so the ids
// (in order) are pinned here. Adding a program means adding its id to this list.
const test = require('node:test');
const assert = require('node:assert/strict');
const CONFIGS = require('../programs.config.js');

const IDS = [
    // Signature: each original, then its Tempo and Harder moves variations (Phase 6 ticket 3b)
    'three-split-60', 'three-split-60-tempo', 'three-split-60-harder', 'four-split-60', 'four-split-60-tempo', 'four-split-60-harder',
    'two-split-60', 'two-split-60-tempo', 'two-split-60-harder', 'five-split-60', 'five-split-60-tempo', 'five-split-60-harder',
    'full-body-duo-60', 'full-body-duo-60-tempo', 'full-body-duo-60-harder', 'iron-ppl',
    'upper-lower-power', 'full-body-strength', 'pullup-ladder', 'bar-master', 'grip-and-hang', 'engine',
    'storm-front', 'tabata-ten', 'core-foundations', 'flow-state', 'deep-core-60', 'one-bell', 'bell-complexes',
    'swing-century', 'twenty-flat', 'minute-man', 'twenty-ladder', 'hotel-room', 'skill-ladder', 'no-gear-burn',
    'lower-focus', 'posterior-chain', 'single-leg-strong', 'sun-and-strength', 'yin-deep-stretch', 'balance-flow',
    'core-yoga', 'morning-25', 'mat-foundations', 'classical-mat', 'pilates-core-glutes', 'standing-pilates',
    'pilates-power', 'fight-camp', 'southpaw-switch', 'speed-and-footwork', 'heavy-hands', 'boxers-engine',
    'muay-thai-basics', 'kick-combos', 'clinch-and-knees', 'kickboxing-cardio', 'full-contact', 'front-splits-60',
    'pancake-straddle', 'hips-open', 'upper-body-flex', 'full-body-stretch', 'desk-reset', 'better-posture',
    'joint-health', 'squat-hinge-mobility', 'steady', 'single-leg-strength', 'ankle-and-knee', 'athletic-balance',
    'balance-and-core', 'hiit-20', 'tabata-torch', 'thirty-thirty', 'pyramid-hiit', 'afterburn', 'spring-loaded',
    'vertical', 'plyo-legs', 'upper-plyo', 'explosive-full-body', 'arnold-split', 'strength-supersets', 'heavy-duty',
    'bar-flow', 'hang-tough', 'commando', 'glute-builder', 'step-up', 'leg-day-classic', 'windmill-and-press',
    'kettlebell-strength', 'kettlebell-flow', 'core-circuits', 'hollow-body', 'twist-and-brace', 'abs-15',
    'sweat-circuit', 'chipper', 'dumbbell-complex', 'kitchen-table', 'calisthenics-base', 'floor-only',
    'express-circuit', 'two-block-20', 'lunch-break',
    // Phase 6: Mixed
    'lift-and-lengthen', 'iron-yoga', 'strong-hips', 'upper-and-open', 'kettlebell-and-yoga', 'posture-strength',
    // Phase 6 ticket 2: Fighter, Athlete
    'fight-ready', 'strike-and-lift', 'southpaw-strength', 'muay-thai-conditioning', 'boxers-body', 'knockout-circuit',
    'jump-lift-stick', 'court-ready', 'field-day', 'explosive-legs', 'power-and-poise', 'all-round-athlete',
    // Phase 6 ticket 3: Balanced week, Calm strength
    'three-in-one', 'everyday-athlete', 'balanced-30', 'whole-body-week', 'lift-sweat-stretch', 'the-generalist',
    'slow-burn', 'steady-strength', 'pilates-and-iron', 'yin-and-yang', 'quiet-power', 'control',
    // Phase 14 ticket 4: a sixth program for every five-program subject, and the floor-pull programs
    'power-vinyasa', 'pilates-sculpt', 'boxing-strength', 'kick-and-core', 'daily-stretch-15', 'mobility-flow',
    'balance-emom', 'bell-intervals', 'plyo-circuits', 'floor-pull', 'back-at-home', 'quiet-upper',
    // Phase 14 ticket 5: Running prep, Court & field sports
    'run-ready', 'stride-strength', 'springy-legs', 'track-intervals', 'runners-core',
    'court-agility', 'change-of-direction', 'first-step', 'field-strength', 'game-day',
    // Phase 14 ticket 6: Grip & forearms, Kettlebell complexes, Climber / pull strength
    'grip-strength', 'carry-day', 'forearm-pump', 'hang-time', 'grip-and-lift',
    'complex-builder', 'complex-emom', 'bell-ladders', 'bell-amrap', 'complex-and-carry',
    'climb-strength', 'pull-ladder-climb', 'hang-and-hold', 'archer-project', 'wall-ready',
    // Phase 14 ticket 7: Gentle / low impact, Back care
    'gentle-start', 'chair-and-wall', 'low-impact-cardio', 'move-daily', 'strong-and-steady',
    'back-basics', 'back-flow', 'strong-back', 'desk-back', 'back-and-hips',
    // Phase 14 ticket 8: 30-day programs, two per family
    'strength-30', 'kettlebell-30', 'hiit-30', 'boxing-30', 'yoga-30', 'core-30', 'balanced-month', 'calm-month',
    // Phase 14 ticket 9: Strength family +26
    'push-pull', 'body-part-split', 'upper-lower-volume', 'strength-endurance', 'minimalist-strength',
    'pullup-pyramid', 'chinup-strength', 'pull-and-push', 'bar-emom',
    'quad-focus', 'glute-lab', 'legs-twice', 'hamstring-strong', 'athletic-legs',
    'bell-circuit', 'getup-strong', 'swing-press-emom', 'slow-bell',
    'pushup-progress', 'bodyweight-amrap', 'pistol-path',
    'twenty-strength', 'twenty-tabata', 'fifteen-flat', 'commuter', 'kettlebell-20',
    // Phase 14 ticket 10: Cardio & combat +13
    'dumbbell-engine', 'conditioning-ladders', 'work-and-rest', 'hiit-ladders', 'quiet-hiit', 'plyo-emom', 'single-leg-plyo',
    'boxing-emom', 'defence-first', 'kick-strength', 'kick-speed', 'hill-legs', 'reaction-ready',
    // Phase 14 ticket 11: Mind & body +16
    'core-emom', 'loaded-core', 'plank-project', 'shoulder-health', 'hip-mobility', 'evening-yoga', 'yoga-strength', 'pilates-flow',
    'pilates-15', 'backbend-flex', 'active-flexibility', 'steady-feet', 'loaded-balance', 'gentle-flow', 'easy-strength', 'loaded-back-care',
    // Phase 14 ticket 12: Mixed +15
    'bodyweight-and-stretch', 'supersets-and-stretch', 'lift-and-move', 'bouts-and-bells', 'kick-and-stretch', 'fighter-25',
    'bodyweight-athlete', 'speed-and-strength', 'court-athlete', 'balanced-25', 'kettlebell-week', 'no-gear-week',
    'calm-bodyweight', 'slow-supersets', 'evening-strength',
];

test('the config ids, in order, are today\'s list', () => {
  assert.deepEqual(CONFIGS.map((c) => c.id), IDS);
});

test('each family file holds only its own family\'s subjects', () => {
  const { FAMILIES } = require('../app/library.js');
  const files = { Strength: 'strength', 'Cardio & combat': 'cardio-combat', 'Mind & body': 'mind-body', Mixed: 'mixed' };
  for (const [family, subjects] of FAMILIES) {
    const own = require(`../configs/${files[family]}.js`);
    assert.ok(own.length > 0);
    assert.deepEqual([...new Set(own.map((c) => c.subject))].filter((s) => !subjects.includes(s)), [], family);
  }
});
