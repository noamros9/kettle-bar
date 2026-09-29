// The program list is ordered: programs.config.js sets the order of the program list, so the ids
// (in order) are pinned here. Adding a program means adding its id to this list.
const test = require('node:test');
const assert = require('node:assert/strict');
const CONFIGS = require('../programs.config.js');

const IDS = [
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
    // Phase 6 ticket 2: Fighter, Athlete
    'fight-ready', 'strike-and-lift', 'southpaw-strength', 'muay-thai-conditioning', 'boxers-body', 'knockout-circuit',
    'jump-lift-stick', 'court-ready', 'field-day', 'explosive-legs', 'power-and-poise', 'all-round-athlete',
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
