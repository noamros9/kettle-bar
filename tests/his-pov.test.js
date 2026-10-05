// Phase 20 ticket 5.5: standing his-POV check. Every program with couple: true, found at test time
// (never a list of ids), so programs added in later phases are checked too. Blurb and about must not
// address her as "you". A real false positive may be allowed by program id; a new program never gets
// an exception just to pass. Ids, cycle and dayTypes of the 105 After dark programs stay pinned in
// tests/after-dark-text.test.js and tests/after-dark-text-18.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const CONFIGS = require('../programs.config.js');

// Her-side phrasings: "you" is her. Checked case-insensitively as substrings.
const HER_SIDE = [
  'your pussy', 'your clit', 'your tits', 'your breasts', 'your nipples', 'your cunt',
  'his cock in you', 'on his cock', 'ride him', 'he fucks you', 'you ride', 'you get fucked',
  'he pounds you', 'straddle him', 'sit on his',
];
// id -> phrases that are genuine false positives in that program's wording
const ALLOW = {};

test('no couple program addresses her as you', () => {
  const couple = CONFIGS.filter((c) => c.couple);
  assert.ok(couple.length > 0, 'expected couple programs');
  const hits = [];
  couple.forEach((c) => {
    assert.equal(typeof c.blurb, 'string', c.id);
    assert.equal(typeof c.about, 'string', c.id);
    const text = `${c.blurb}\n${c.about}`.toLowerCase();
    const allow = ALLOW[c.id] || [];
    HER_SIDE.forEach((p) => {
      if (allow.includes(p)) return;
      if (text.includes(p)) hits.push(`${c.id}: ${p}`);
    });
  });
  assert.deepEqual(hits, []);
});
