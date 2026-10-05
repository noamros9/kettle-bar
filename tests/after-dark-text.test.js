// Phase 20 ticket 3: the 30 Phase 16 After dark programs (Beach body, Bedroom stamina, Sex positions).
// Days stay put. The pin is a sha256 of { id, cycle, dayTypes } in file order, taken before the blurb and about rewrite.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const mixed = require('../configs/mixed.js');

const SUBJECTS = ['Beach body', 'Bedroom stamina', 'Sex positions'];
const IDS = ['beach-body', 'v-taper', 'booty-call', 'abs-out', 'gun-show-tonight',
  'shirt-off', 'bikini-ready', 'thirst-trap', 'beach-body-30', 'naked-mirror-30',
  'all-night-long', 'your-ladys-favorite', 'pound-town', 'round-two', 'deep-stroke',
  'hold-me-up', 'marathon-session', 'on-top', 'last-longer-30', 'pelvic-power-30',
  'the-pretzel', 'legs-over-shoulders', 'doggy-style-ready', 'reverse-cowgirl', 'wheelbarrow',
  'standing-o', 'splits-in-bed', 'bendy-body', 'kama-sutra-30', 'flexible-lover-30'];
const DAYS = 'd505b704da5bfa9be7ac39351f24c364d7e78f81da511b50f99bc5acbfa0fa83';

const of = (id) => mixed.find((c) => c.id === id);

test('the 30 Phase 16 After dark programs keep their ids, cycle and day types', () => {
  assert.deepEqual(mixed.filter((c) => SUBJECTS.includes(c.subject)).map((c) => c.id), IDS);
  const pin = IDS.map((id) => {
    const c = of(id);
    return { id: c.id, cycle: c.cycle, dayTypes: c.dayTypes };
  });
  assert.equal(crypto.createHash('sha256').update(JSON.stringify(pin)).digest('hex'), DAYS);
});

test('every blurb is one sentence of at most 140 characters, and every about is one paragraph', () => {
  IDS.forEach((id) => {
    const c = of(id);
    assert.equal(/[\r\n]/.test(c.blurb), false, id);
    assert.match(c.blurb, /^[^.!?]+[.!?]$/, `${id} blurb`);
    assert.ok(c.blurb.length <= 140, `${id} blurb is ${c.blurb.length} characters`);
    assert.equal(/[\r\n]/.test(c.about), false, `${id} about`);
    assert.match(c.about, /[.!?]$/, `${id} about`);
  });
});
