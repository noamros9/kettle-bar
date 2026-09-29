// Bouts (Phase 5, boxing and kickboxing): 3-minute bouts with 1 minute of rest, one combo per bout called by the voice.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createSession } = require('../app/session.js');

const EX = {
  one_two: { id: 'one_two', name: 'Jab, cross', call: 'jab, cross', u: 'sec' },
  hook: { id: 'hook', name: 'Jab, cross, hook', call: 'jab, cross, hook', u: 'sec' },
  feet: { id: 'feet', name: 'Footwork', call: 'footwork', u: 'sec' },
};
const day = { day: 1, level: 1, blocks: [{ format: 'bouts', title: 'Bouts', kind: 'main', items: [{ ex: 'one_two', n: 180 }, { ex: 'hook', n: 180 }, { ex: 'feet', n: 180 }] }] };

test('a 3-bout block: 3 work phases each calling its combo, 2 rests, then the block is done', () => {
  const s = createSession({}, day, { EX });
  const { phases, then } = s.plan({ type: 'block', bi: 0 });
  const work = phases.filter((p) => p.work), rest = phases.filter((p) => !p.work);
  assert.deepEqual(work.map((p) => [p.sec, p.say, p.end, p.fig]), [
    [180, 'Bout 1: jab, cross', 'long', 'one_two'], [180, 'Bout 2: jab, cross, hook', 'long', 'hook'], [180, 'Bout 3: footwork', 'long', 'feet']]);
  assert.equal(work[1].label, 'Jab, cross, hook');
  assert.equal(work[1].sub, 'Bout 2 of 3');
  assert.deepEqual(rest.map((p) => [p.sec, p.say || null]), [[5, null], [60, 'Rest'], [60, 'Rest']]);
  assert.equal(phases[0].label, 'Get ready · Jab, cross');
  assert.match(phases[2].label, /^Rest · next: Jab, cross, hook/);
  assert.equal(phases.at(-1).sayEnd, 'Done');
  assert.ok(work.every((p) => p.halfway));
  s.complete(then);
  assert.ok(s.blockDone(0));
});

test('switching stance: the voice calls orthodox and southpaw in turn with each combo', () => {
  const s = createSession({}, { ...day, blocks: [{ ...day.blocks[0], switchStance: 1 }] }, { EX });
  const work = s.plan({ type: 'block', bi: 0 }).phases.filter((p) => p.work);
  assert.deepEqual(work.map((p) => p.say), ['Bout 1, orthodox: jab, cross', 'Bout 2, southpaw: jab, cross, hook', 'Bout 3, orthodox: footwork']);
  assert.equal(work[1].label, 'Southpaw · Jab, cross, hook');
});

test('a bout without a spoken call says the combo name; the rest comes from the block', () => {
  const s = createSession({}, { day: 1, blocks: [{ format: 'bouts', title: 'B', rest: 30, items: [{ ex: 'x', n: 120 }, { ex: 'x', n: 120 }] }] }, { EX: { x: { name: 'Jab', u: 'sec' } } });
  const { phases } = s.plan({ type: 'block', bi: 0 });
  assert.equal(phases[1].say, 'Bout 1: Jab');
  assert.deepEqual(phases.map((p) => p.sec), [5, 120, 30, 120]);
});
