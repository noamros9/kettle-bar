// Phase 20 ticket 5.5: standing his-POV check. Every couple: true program and every program on the After dark
// shelf (70 of its 105 aren't couple), found at test time
// (never a list of ids), so programs added in later phases are checked too. Blurb and about must not
// address her as "you". A real false positive may be allowed by program id; a new program never gets
// an exception just to pass. Ids, cycle and dayTypes of the 105 After dark programs stay pinned in
// tests/after-dark-text.test.js and tests/after-dark-text-18.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const CONFIGS = require('../programs.config.js');
const { SHELVES } = require('../app/library.js');

const AFTER_DARK = new Set(SHELVES.find(([name]) => name === 'After dark')[1]);

// Her-side phrasings: "you" is her. Checked case-insensitively as substrings.
const HER_SIDE = [
  'your pussy', 'your clit', 'your tits', 'your breasts', 'your nipples', 'your cunt',
  'his cock in you', 'on his cock', 'ride him', 'he fucks you', 'you ride', 'you get fucked',
  'he pounds you', 'straddle him', 'sit on his',
  'your ass up', 'ass up', 'you get bent', 'bend you over', 'take a fuck', 'fuck you',
  'to be fucked', 'get bent over', 'open you up', 'arch you', 'pin you', 'hold you up',
  'in a bikini', 'your bikini',
];
// id -> phrases that are genuine false positives in that program's wording
const ALLOW = {};

test('no couple or After dark program addresses her as you', () => {
  const couple = CONFIGS.filter((c) => c.couple || AFTER_DARK.has(c.subject));
  assert.ok(couple.length >= 105, `${couple.length} programs checked`);
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

// Phase 20 ticket 8 (Noam): a description says what he does to her, never how the builder made it.
const BUILDER_TALK = /\b(slot|slots|dealt|deals|deal|catalogue|old ones|new ones|old positions|new positions|positions you (already )?know|the new exercises)\b/i;

test('no couple or After dark description talks about the builder (slots, catalogues, old or new positions)', () => {
  const hits = CONFIGS.filter((c) => c.couple || AFTER_DARK.has(c.subject))
    .filter((c) => BUILDER_TALK.test(`${c.blurb}\n${c.about}`))
    .map((c) => `${c.id}: ${`${c.blurb}\n${c.about}`.match(BUILDER_TALK)[0]}`);
  assert.deepEqual(hits, []);
});

// Phase 22 ticket 10b: her kink-lite on him is allowed. Anything in him still fails. Substring, case-insensitive.
const { EX } = require('../exercises.js');
const IN_HIM = [
  'peg',
  'strap-on on him',
  'strap-on on you',
  'strap-on in him',
  'strap-on in you',
  'strap-on in his',
  'strap-on up his',
  'in his ass',
  'in your ass',
  'into his ass',
  'into your ass',
  'up his ass',
  'up your ass',
  'his asshole',
  'your asshole',
  'his hole',
  'your hole',
  'finger in his ass',
  'finger in your ass',
  'fingers in his ass',
  'fingers in your ass',
  'finger his ass',
  'finger your ass',
  'fingers his ass',
  'fingers your ass',
  'toy in his ass',
  'toy in your ass',
  'dildo in his ass',
  'dildo in your ass',
  'plug in his ass',
  'plug in your ass',
  'in him',
];
const RIM_OK = new Set(['his asshole', 'his hole', 'your asshole', 'your hole']);

// Her tongue on his or your asshole passes only when the exercise is rimming. Anything else in him still fails.
function inHimHits(e) {
  if (e.cat !== 'couple') return [];
  const text = `${e.name}\n${e.cue}`.toLowerCase();
  const rimTongue = e.sub === 'rim' && String(e.cue).toLowerCase().includes('her tongue');
  const hits = [];
  IN_HIM.forEach((p) => {
    if (rimTongue && RIM_OK.has(p)) return;
    if (text.includes(p)) hits.push(p);
  });
  return hits;
}

test('no couple exercise puts anything in him', () => {
  const hits = [];
  Object.values(EX).forEach((e) => {
    inHimHits(e).forEach((p) => hits.push(`${e.id}: ${p}`));
  });
  assert.deepEqual(hits, []);
});

test('her tongue on your asshole passes only as rimming', () => {
  const phrases = (e) => inHimHits(e);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Rim', cue: 'Her tongue on your asshole.' }), []);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Rim', cue: 'Her tongue on your hole.' }), []);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Rim', cue: 'Her tongue on his asshole.' }), []);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Rim', cue: 'Her tongue on your asshole. Finger your ass.' }), ['finger your ass']);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'oral', name: 'Rim', cue: 'Her tongue on your asshole.' }), ['your asshole']);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Rim', cue: 'Spread your asshole.' }), ['your asshole']);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Rim', cue: 'Her tongue in your ass.' }), ['in your ass']);
  assert.deepEqual(phrases({ cat: 'couple', sub: 'rim', name: 'Peg', cue: 'Her tongue on your asshole and peg you.' }), ['peg']);
  assert.deepEqual(phrases({ cat: 'other', sub: 'rim', name: 'x', cue: 'Finger your ass.' }), []);
});
