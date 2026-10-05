// Phase 20 ticket 4: the 75 Phase 18 After dark programs (configs/after-dark.js). Ids, cycle and dayTypes stay
// what they were (sha256 of that slice, taken before the wording changed). Blurbs are one sentence of at most 140
// characters; abouts are one paragraph.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const configs = require('../configs/after-dark.js');

const IDS = [
  'sweat-together', 'foreplay-fitness', 'strip-circuit', 'kiss-me-reps', 'lift-me-up', 'date-night-burn', 'partners-in-grime',
  'take-it-off', 'slow-burn-couples', 'sweaty-sheets', 'dare-night', 'massage-and-mount', 'couples-kama-sutra-30',
  'thirty-days-of-foreplay', 'ride-along', 'couples-quickie', 'fuck-fit', 'pin-me-down', 'wheelbarrow-race', 'fit-to-fuck-30',
  'last-all-night', 'edge-control', 'stamina-intervals', 'slow-and-steady', 'control-30',
  'thrust-master', 'pound-it', 'hip-drive-ladders', 'piston', 'thrust-30',
  'hold-her-up', 'against-the-wall', 'carry-me-home', 'grip-it-tight', 'stand-and-deliver-30',
  'bend-me-over', 'open-wide', 'arch-your-back', 'do-the-splits', 'bendy-30',
  'pump-before-the-date', 'striptease-pump', 'show-off', 'abs-on-show', 'date-night-pump-30',
  'all-about-her', 'going-down', 'fingers-and-forearms', 'ladies-first', 'her-pleasure-30',
  'quickie', 'wham-bam', 'nooner', 'hot-and-fast', 'quickie-30',
  'no-bad-backs', 'kneel-easy', 'strong-wrists', 'the-morning-after', 'back-and-knees-30',
  'pre-game', 'before-we-go-out', 'appetizer', 'warm-me-up', 'date-night-warm-up-30',
  'floor-tour-30', 'standing-tour-30', 'bendy-tour-30', 'strong-tour-30', 'grand-tour-30',
  'morning-glory', 'lazy-sunday', 'breakfast-in-bed', 'sleep-in', 'morning-glory-30',
];

test('the 75 Phase 18 After dark programs keep their ids, cycle and dayTypes', () => {
  assert.deepEqual(configs.slice(0, IDS.length).map((c) => c.id), IDS);
  const slice = configs.slice(0, IDS.length).map((c) => ({ id: c.id, cycle: c.cycle, dayTypes: c.dayTypes }));
  const hash = crypto.createHash('sha256').update(JSON.stringify(slice)).digest('hex');
  assert.equal(hash, 'd364051c2acd8fd3fbb056f59a8c4029c4a1fc99e9f382bff768cbbee42ba313');
});

test('every blurb is one sentence of at most 140 characters, and every about is one paragraph', () => {
  configs.forEach((c) => {
    assert.equal(typeof c.blurb, 'string', c.id);
    assert.equal(c.blurb, c.blurb.trim(), c.id);
    assert.ok(c.blurb.length > 0 && c.blurb.length <= 140, `${c.id}: blurb is ${c.blurb.length} characters`);
    assert.ok(!/[\r\n]/.test(c.blurb), `${c.id}: blurb line break`);
    const marks = c.blurb.match(/[.!?]/g) || [];
    assert.deepEqual(marks, [c.blurb.at(-1)], `${c.id}: blurb is not one sentence: ${c.blurb}`);
    assert.equal(typeof c.about, 'string', c.id);
    assert.equal(c.about, c.about.trim(), c.id);
    assert.ok(c.about.length > 0, c.id);
    assert.ok(!/[\r\n]/.test(c.about), `${c.id}: about is not one paragraph`);
    assert.ok(/[.!?]/.test(c.about), `${c.id}: about has no sentence`);
  });
});
