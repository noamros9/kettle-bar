// The program library: one file per family in configs/ (see configs/shared.js for how a config is written).
// configs/mixed.js (Phase 6): Mixed days, blocks from more than one family in a day.
// The program list order is ORDER below, not the family files' order, because families interleave in the list.
const FAMILY_FILES = [require('./configs/strength.js'), require('./configs/cardio-combat.js'), require('./configs/mind-body.js'), require('./configs/mixed.js')];
const ORDER = [
  // Signature: each original, then its two variations (Tempo, Harder moves; Phase 6 ticket 3b)
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
  // Phase 14 ticket 4: a sixth program for every five-program subject, and bodyweight programs with the floor pulls
  'power-vinyasa', 'pilates-sculpt', 'boxing-strength', 'kick-and-core', 'daily-stretch-15', 'mobility-flow',
  'balance-emom', 'bell-intervals', 'plyo-circuits', 'floor-pull', 'back-at-home', 'quiet-upper',
  // Phase 14 ticket 5: Running prep, Court & field sports
  'run-ready', 'stride-strength', 'springy-legs', 'track-intervals', 'runners-core',
  'court-agility', 'change-of-direction', 'first-step', 'field-strength', 'game-day',
  // Phase 14 ticket 6: Grip & forearms, Kettlebell complexes, Climber / pull strength
  'grip-strength', 'carry-day', 'forearm-pump', 'hang-time', 'grip-and-lift',
  'complex-builder', 'complex-emom', 'bell-ladders', 'bell-amrap', 'complex-and-carry',
  'climb-strength', 'pull-ladder-climb', 'hang-and-hold', 'archer-project', 'wall-ready',
];

const byId = new Map(FAMILY_FILES.flat().map((c) => [c.id, c]));
if (byId.size !== ORDER.length || ORDER.some((id) => !byId.has(id))) throw new Error('programs.config.js: ORDER and configs/ disagree');
module.exports = ORDER.map((id) => byId.get(id));
