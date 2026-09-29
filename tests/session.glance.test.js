// Big timer: what the full-screen timer shows for the clock's current phase, read from the same plan the clock runs.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createSession, glance } = require('../app/session.js');

const EX = { warrior: { id: 'warrior', name: 'Warrior two', u: 'sec', side: 1 }, mountain: { id: 'mountain', name: 'Mountain pose', u: 'sec' } };
const flow = { day: 1, level: 1, blocks: [{ format: 'flow', title: 'Sun flow', kind: 'main', repeat: 1, items: [{ ex: 'mountain', n: 20 }, { ex: 'warrior', n: 30 }] }] };

test('glance: the current phase and the label of the next one, straight from a flow plan', () => {
  const { phases } = createSession({}, flow, { EX }).plan({ type: 'block', bi: 0 });
  assert.deepEqual(glance(phases[0], phases[1]), { label: phases[0].label, sub: phases[0].sub, fig: 'mountain', work: false, next: phases[1].label });
  const g = glance(phases[1], phases[2]);
  assert.equal(g.work, true);
  assert.equal(g.next, phases[2].label);
  assert.match(g.next, /Warrior two, left|Warrior two · left/);
});

test('glance: the last phase has nothing next, a phase without a drawing or sub has none', () => {
  assert.deepEqual(glance({ sec: 60, label: 'Rest', end: 'long' }, undefined), { label: 'Rest', sub: '', fig: null, work: false, next: null });
});

test('glance: no phase running gives nothing', () => {
  assert.equal(glance(null, undefined), null);
});
