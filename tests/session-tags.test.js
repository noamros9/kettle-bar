// Phase 36 ticket 1: every couple exercise's session tags (296–306), read from its sub, id, name and cue.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { tagAll, tagsOf } = require('../session-tags.js');

const TAGS = tagAll(EX);
const coupleIds = () => Object.keys(EX).filter((id) => EX[id].cat === 'couple');

const DRESS = ['clothed', 'undress', 'naked', null];
const FLAGS = ['warm', 'oral', 'anal', 'pussy', 'herMouth', 'finish'];
const PROPS = /^(him:)?(blindfold|cuffs|gag|ice|wax)$/;

test('every couple exercise has a place, a dress and its flags', () => {
  const ids = coupleIds();
  assert.ok(ids.length >= 831, `${ids.length} couple exercises`);
  assert.deepEqual(Object.keys(TAGS).sort(), [...ids].sort());
  for (const id of ids) {
    const t = TAGS[id];
    assert.ok(['home', 'shower', 'water'].includes(t.place), `${id} place ${t.place}`);
    assert.ok(DRESS.includes(t.dress), `${id} dress ${t.dress}`);
    for (const f of FLAGS) assert.equal(typeof t[f], 'boolean', `${id} ${f}`);
    t.props.forEach((p) => assert.match(p, PROPS, `${id} prop ${p}`));
  }
});

test('only couple exercises are tagged, and tagsOf reads one by id', () => {
  assert.ok(!('goblet_squat' in TAGS) && EX.goblet_squat);
  assert.deepEqual(tagsOf('pos_missionary', EX.pos_missionary), TAGS.pos_missionary);
});

test('the place follows the sub, and the shower and tub the cue names', () => {
  for (const id of coupleIds()) {
    const want = { shower: 'shower', pool: 'water', hottub: 'water' }[EX[id].sub] || (['fuck_shower_kneel', 'fuck_tub'].includes(id) ? 'shower' : 'home');
    assert.equal(TAGS[id].place, want, id);
  }
});

test('every kink exercise carries its prop, and nothing else does', () => {
  for (const id of coupleIds()) assert.equal(TAGS[id].props.length > 0, EX[id].sub === 'kink', id);
});

// Hand-checked against the cues (every kind, both directions of rimming and of kink).
const TABLE = {
  partner_squat: { place: 'home', dress: null, warm: false, pussy: false, herMouth: false, anal: false },
  slow_dance: { dress: null, warm: true },
  strip_round: { dress: 'clothed', warm: true },
  dare_lap_dance: { dress: 'clothed', pussy: true },
  dare_whisper: { dress: null, pussy: false },
  dare_touch: { dress: null },
  tease_zip_wall: { dress: 'undress', warm: true, pussy: true, herMouth: false },
  tease_his_belt: { dress: 'undress', herMouth: true, oral: true },
  back_massage: { dress: null, warm: true, pussy: false },
  mass_tits_head: { dress: 'naked', warm: true, herMouth: true, pussy: false },
  mass_him_thigh: { pussy: false, herMouth: false }, // "push into her fist"
  mass_pussy_side: { dress: 'naked', pussy: true, herMouth: false },
  pos_missionary: { dress: 'naked', pussy: true, oral: false, anal: false },
  pos_lotus: { pussy: true },
  fuck_tub: { place: 'shower', pussy: true },
  pos_oral_him: { oral: true, herMouth: true, pussy: false },
  pos_oral_her: { oral: true, pussy: true, herMouth: false },
  pos_69: { oral: true, pussy: true, herMouth: true },
  oral_squat_cock: { herMouth: true },
  hands_finger_ass_fold: { anal: true },
  hands_side_stand: { anal: false, pussy: true }, // a fingertip resting on her asshole
  anal_mating_press: { anal: true, pussy: false },
  toy_strapon_doggy: { anal: true, pussy: true },
  toy_strapon_prone: { anal: true },
  toy_strap_reverse: { anal: true, pussy: true },
  toy_dildo_suckhip: { herMouth: true, pussy: true },
  toy_dildo_nipple: { herMouth: false, pussy: true },
  rough_spank_thigh: { anal: true, pussy: false },
  rough_hair_face: { pussy: true, herMouth: false },
  kink_gag_chair: { props: ['gag'], herMouth: false, pussy: true },
  kink_blind_hero: { props: ['blindfold', 'cuffs'] },
  kink_ice_blind_squat: { props: ['blindfold', 'ice'] },
  kink_him_blind_suck: { props: ['him:blindfold'], herMouth: true },
  kink_him_tie_stroke: { props: ['him:cuffs'] },
  body_cum_face: { finish: true, herMouth: true },
  body_cum_pussy: { finish: true, pussy: true },
  body_crack_prone: { anal: false, finish: false }, // "not in"
  rim_bed_mouth: { anal: true, oral: true, herMouth: false },
  rim_her_kneel: { anal: false, oral: true, herMouth: true }, // her tongue on his asshole
  rim_squat_away: { anal: true, herMouth: false }, // "not in her mouth"
  edge_suck_stop: { herMouth: true, pussy: false },
  shower_suck: { place: 'shower', herMouth: true },
  pool_bikini_top: { place: 'water', dress: 'undress', herMouth: false },
  hottub_bubbles: { place: 'water', dress: 'undress', pussy: true },
  hottub_rim_mouth: { place: 'water', herMouth: true },
  balcony_lounge_ride: { place: 'home', herMouth: false, pussy: true },
  door_lean_up: { herMouth: false }, // "as she takes you" is her pussy
  pool_jet: { herMouth: false }, // "you watch her mouth open"
};

test('a hand-checked table of couple exercises matches its tags', () => {
  for (const [id, want] of Object.entries(TABLE)) {
    for (const [k, v] of Object.entries(want)) assert.deepEqual(TAGS[id][k], v, `${id}.${k}`);
  }
});
