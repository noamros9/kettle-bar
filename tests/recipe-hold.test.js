// Decision 318 (Phase 23): the phase's new programs (added: 23) stay out of the recipe book, so Build your own and
// random workouts don't change mid-phase; the phase's last ticket lets them in all at once. Tiny configs only.
const test = require('node:test');
const assert = require('node:assert/strict');
const { generate, HELD } = require('../recipe-book.js');
const { CONFIGS } = require('../program-builder.js');

const cfg = { id: 'tiny', subject: 'Yoga', minutes: [28, 32], levers: [null, 'holds', 'holds'], equip: 'bw', cycle: ['a'], names: ['x'],
  dayTypes: { a: { label: 'Only', short: 'Only', blocks: CONFIGS.find((c) => c.id === 'flow-state').dayTypes.a.blocks } } };
const late = { ...cfg, id: 'late', added: 23, levers: [null, 'tempo', 'tempo'], dayTypes: { a: { ...cfg.dayTypes.a, label: 'Late' } } };

test('a program from the held phase is skipped: no day type, no levers, listed as skipped', () => {
  assert.equal(HELD, 23);
  const book = generate({ configs: [cfg, late] });
  assert.deepEqual(book.types.map((t) => t.label), ['Only']);
  assert.deepEqual(book.skipped, ['late']);
  assert.deepEqual(book.subjects[0][2], ['holds'], 'its levers don\'t join the subject\'s');
});

test('once the hold moves past the phase, the same program is in the book', () => {
  const book = generate({ configs: [cfg, late], held: 24 });
  assert.deepEqual(book.types.map((t) => t.label).sort(), ['Late', 'Only']);
  assert.deepEqual(book.skipped, []);
});
