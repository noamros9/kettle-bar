// The program library: one file per family in configs/ (see configs/shared.js for how a config is written).
// configs/mixed.js (Phase 6): Mixed days, blocks from more than one family in a day.
// The program list order is ORDER below, not the family files' order, because families interleave in the list.
const FAMILY_FILES = [require('./configs/strength.js'), require('./configs/cardio-combat.js'), require('./configs/mind-body.js'), require('./configs/mixed.js')];
const ORDER = [
  'three-split-60', 'four-split-60', 'two-split-60', 'five-split-60', 'full-body-duo-60', 'iron-ppl',
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
];

const byId = new Map(FAMILY_FILES.flat().map((c) => [c.id, c]));
if (byId.size !== ORDER.length || ORDER.some((id) => !byId.has(id))) throw new Error('programs.config.js: ORDER and configs/ disagree');
module.exports = ORDER.map((id) => byId.get(id));
