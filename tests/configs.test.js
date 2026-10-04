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
    // Phase 16 ticket 4: muscle focus, Chest, Back, Shoulders, Arms
    'chest-day', 'push-and-press', 'pushup-chest', 'chest-emom', 'bell-chest', 'chest-ladders', 'chest-30', 'chest-amrap-30',
    'back-day', 'back-and-biceps', 'floor-back', 'back-emom', 'bell-back', 'back-ladders', 'back-30', 'back-circuit-30',
    'shoulder-day', 'boulder-shoulders', 'floor-shoulders', 'shoulder-emom', 'bell-shoulders', 'shoulder-ladders', 'shoulders-30', 'shoulder-circuit-30',
    'arm-day', 'arm-supersets', 'bodyweight-arms', 'arm-emom', 'chinup-arms', 'arm-ladders', 'arms-30', 'arm-circuit-30',
    // Phase 16 ticket 5: muscle focus, Hips & adductors, Calves & lower legs, Neck & traps
    'hip-day', 'inner-thigh-supersets', 'floor-hips', 'hip-emom', 'bell-hips', 'hip-ladders', 'hips-30', 'hip-circuit-30',
    'calf-day', 'calves-and-shins', 'barefoot-legs', 'calf-emom', 'calf-builder', 'calf-ladders', 'calves-30', 'calf-circuit-30',
    'neck-day', 'neck-and-traps', 'desk-neck', 'neck-emom', 'shrug-and-hold', 'traps-ladders', 'traps-30', 'neck-circuit-30',
    // Phase 16 ticket 6: Variety (every day is different)
    'every-day-different', 'strength-roulette', 'sweat-shuffle', 'mind-body-mix', 'bodyweight-shuffle',
    'kettlebell-roulette', 'short-variety', 'muscle-tour', 'fighter-variety', 'athlete-variety',
    'variety-30', 'bodyweight-variety-30', 'core-roulette', 'long-variety', 'upper-roulette',
    // Phase 16 ticket 7: after-dark, Beach body, Bedroom stamina, Sex positions
    'beach-body', 'v-taper', 'booty-call', 'abs-out', 'gun-show-tonight',
    'shirt-off', 'bikini-ready', 'thirst-trap', 'beach-body-30', 'naked-mirror-30',
    'all-night-long', 'your-ladys-favorite', 'pound-town', 'round-two', 'deep-stroke',
    'hold-me-up', 'marathon-session', 'on-top', 'last-longer-30', 'pelvic-power-30',
    'the-pretzel', 'legs-over-shoulders', 'doggy-style-ready', 'reverse-cowgirl', 'wheelbarrow',
    'standing-o', 'splits-in-bed', 'bendy-body', 'kama-sutra-30', 'flexible-lover-30',
    // Phase 16 ticket 8: Strength family +50%
    'upper-lower-four', 'big-five', 'push-pull-legs-plus', 'strength-and-size', 'dumbbell-only-strength', 'antagonist-supersets', 'strength-30-plus',
    'pullup-plus', 'pullup-emom-ladder', 'chinup-biceps', 'pullup-30', 'bar-and-bell', 'wide-grip-week', 'glute-and-hamstring',
    'legs-all-over', 'kettlebell-legs', 'single-leg-30', 'squat-everyday', 'glute-30', 'bell-muscle', 'bell-emom-plus',
    'bell-hips-core', 'kettlebell-30-plus', 'bell-arms', 'bell-full-emom', 'bodyweight-muscle', 'bodyweight-circuit-plus', 'pushup-pullup-bw',
    'bodyweight-30', 'calisthenics-skills', 'travel-strength', 'pushup-and-squat', 'twenty-muscle', 'fifteen-emom', 'twenty-arms-abs',
    'twenty-tabata-plus', 'busy-30', 'no-gear-twenty', 'grip-emom', 'grip-and-pull', 'forearm-circuit', 'grip-30',
    'complex-straight', 'complex-ladder-emom', 'complex-30', 'complex-hips', 'climber-30', 'climber-emom', 'climber-antagonist',
    // Phase 16 ticket 9: Cardio & combat +50%
    'engine-builder', 'death-by', 'conditioning-30', 'bell-and-burpee', 'dumbbell-tabata', 'hiit-legs', 'hiit-upper',
    'hiit-ladder-tabata', 'hiit-30-plus', 'bell-hiit', 'plyo-power-straight', 'plyo-calves', 'plyo-30', 'plyo-strength-emom',
    'boxing-circuit', 'boxing-power', 'boxing-tabata-plus', 'boxing-30-plus', 'kick-circuit', 'kick-tabata-plus', 'kick-30',
    'kick-flex', 'runner-strength-30', 'trail-legs', 'run-faster', 'court-30', 'racket-ready', 'field-speed',
    // Phase 16 ticket 10: Mind & body +50%
    'core-and-neck', 'weighted-abs', 'core-30-plus', 'bell-core', 'pilates-core-mix', 'desk-neck-reset', 'ankle-hip-mobility', 'mobility-30',
    'posture-strength-circuit', 'yoga-hips-hamstrings', 'yin-30', 'yoga-balance-core', 'yoga-backbends', 'yoga-15', 'pilates-glutes-legs', 'pilates-30',
    'pilates-posture', 'pilates-20', 'flexible-30', 'active-range', 'calf-ankle-flex', 'splits-30', 'balance-30', 'balance-calves-feet',
    'balance-strength-plus', 'balance-flow-emom', 'gentle-30', 'gentle-legs-balance', 'gentle-emom', 'back-care-30', 'back-hips-glutes', 'upper-back-care',
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
