// Phase 34 ticket 2 (decisions 259, 260, 262): hidden day types, not programs. Only the recipe book reads this file
// (recipe-book.js), so random workouts and Build your own can make a 15-minute day for every fitness subject, and the
// rest-day card a 10 or 15-minute flow; programs.config.js never loads it, so no library program, pin or finder entry.
// Each subject's 15-min circuit is its first program's first work block, cut to four moves and run as a circuit: the
// subject's own pools and gear, nothing hand-picked to drift from them.
const PROGRAMS = require('../programs.config.js');
const { SHELVES } = require('../app/library.js');
const { C, F } = require('./shared.js');

// not Signature or After dark (259); nor Flexibility and Yin yoga, whose own short programs already fit 15 and whose
// long holds make a circuit too coarse to land there
const NOT = new Set(['Signature', 'Flexibility', 'Yin yoga', ...SHELVES.find(([s]) => s === 'After dark')[1]]);
// the program a circuit comes from: the subject's first, or one whose moves fit 15 better
const SOURCE = { 'Core & abs': 'core-circuits' };
const firstOf = (subject) => PROGRAMS.find((c) => (SOURCE[subject] ? c.id === SOURCE[subject] : c.subject === subject && !c.frozen && !c.variety && !c.couple));
// moves per circuit: four, or fewer where a lever's Level III (longer holds, slower tempo) or fixed bouts would run past 17
const FEWER = { 'Power yoga': 2, Boxing: 2, Kickboxing: 2, 'Strength & stretch': 1, Fighter: 1, 'Weekly mix': 1 };
const four = (slots, n = 4) => slots.map((s) => s.replace('?', '')).slice(0, n);
const circuit = (cfg) => {
  const n = FEWER[cfg.subject] || 4;
  const blocks = Object.values(cfg.dayTypes)[0].blocks;
  // its own lever, plain progression, and from one round up: built short, then lengthened to 15 by rounds, so the
  // subject's other levers (longer holds, slower tempo) and slow draws can't stretch it past 17
  const as = ({ f, title, slots, values, ...more }, name, k) => C(name, four(slots, k), { ...more, lever: [null, 'reps', 'reps'], values: [1, 2, 3, 4, 5, 6] });
  // a Mixed day keeps two families: two moves from each of its first two blocks
  if (blocks[0].family && blocks[1]) return blocks.slice(0, 2).map((b) => as(b, b.title, Math.min(2, n)));
  return [as(blocks.find((b) => b.slots.length >= 3), '15-min circuit', n)];
};

const SUBJECTS = [...new Set(PROGRAMS.map((c) => c.subject))].filter((s) => !NOT.has(s) && firstOf(s));
const CIRCUITS = SUBJECTS.map((subject) => {
  const src = firstOf(subject);
  return {
    id: `short-${src.id}`, hidden: true, targets: [15], catalogue: 15, subject, minutes: [13, 17], equip: src.equip, levers: src.levers, absSlots: [],
    cycle: ['short'], dayTypes: { short: { label: '15-min circuit', short: '15 min', blocks: circuit(src) } },
  };
});

// the rest-day flows (262): no gear, held poses a round at a time, then one breathing drill to close; one day type
// lands on 10 and on 15 (fewer or more rounds)
const REST = [['Mobility & posture', ['mbHip', 'mbSpine', 'mbShoulder', 'mbHip']], ['Flexibility', ['fxHam', 'fxHips', 'fxUpper', 'fxSpine']], ['Yoga', ['ygHips', 'ygRest', 'ygHips', 'ygRest']]]
  .map(([subject, slots]) => ({
    id: `rest-${subject.toLowerCase().replace(/[^a-z]+/g, '-')}`, hidden: true, targets: [10, 15], catalogue: 15, subject, minutes: [10, 15], equip: 'bw', levers: [null, 'holds', 'holds'], absSlots: [],
    cycle: ['rest'],
    dayTypes: { rest: { label: 'Rest-day flow', short: 'Rest', blocks: [C('Poses', slots, { lever: [null, 'reps', 'reps'], values: [1, 2, 3, 4, 5, 6] }), F('Breathe', ['breath'], { lever: [null, 'reps', 'reps'] })] } },
  }));

module.exports = [...CIRCUITS, ...REST];
