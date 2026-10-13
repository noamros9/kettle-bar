// Own-program pins (Phase 24 ticket 6, code review C1): an own program is rebuilt from its stored config with today's
// builder on every load, so a builder change could reshuffle one you're halfway through without any library pin
// noticing. Each record in tests/fixtures/own-days.json (one per recipe-book subject and four mixes, stored as the page
// stores them) must still build the days it pinned.
const test = require('node:test');
const assert = require('node:assert/strict');
const { pinOf } = require('../scripts/pins.js');
const { daysOf, records } = require('../scripts/own-pins.js');
const pins = require('./fixtures/own-days.json');

test('every pinned own program still builds the same days from its stored record', () => {
  const ids = Object.keys(pins);
  assert.ok(ids.length >= 50, `${ids.length} pinned`);
  const changed = ids.filter((id) => pinOf(daysOf(id, pins[id].record)) !== pins[id].days);
  assert.deepEqual(changed, [], 'A builder change reshuffles saved own programs (someone may be halfway through one). '
    + 'Make the change keep their days, or decide with Noam that it may, then re-pin with scripts/own-pins.js.');
});

test('the pins cover every subject the recipe book offers today, and the mixes', () => {
  const now = records().map(([id]) => id);
  const missing = now.filter((id) => !pins[id]);
  assert.deepEqual(missing, [], 'a new subject has no own-program pin yet: run node scripts/own-pins.js');
  assert.ok(Object.keys(pins).filter((id) => id.split('-').length > 2 && pins[id].record.choices.subjects.length > 1).length >= 4, 'four mixes');
});
