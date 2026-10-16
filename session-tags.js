/* Phase 36 (decisions 296–306): what each couple exercise means for the order of a session, read from its `sub`,
   id, name and cue, with a short override list for what the words don't say. The builder's order step (ticket 2)
   and tests/session-order.test.js read these; no exercise changes for them.
   - place: 'home' | 'shower' | 'water' (304; the shower bridges the other two); null for a partner gym exercise
   - dress: 'clothed' (stays dressed) | 'undress' (starts dressed, ends naked) | 'naked' | null (either way) (296)
   - warm: massage and teasing, the openers (301)
   - oral: mouth on genitals or ass, either way (297)
   - anal: his cock, a toy, his tongue or a finger in her ass (298; a fingertip resting on it isn't)
   - pussy / herMouth: what must wait for a shower after anal (298)
   - finish: he cums on her (299)
   - props: what she or he wears or gets (blindfold, cuffs, gag, ice, wax); 'him:' when it's on him (300)
   Pure: runs in Node and in the page (the builder deals couple days in both). */
(function (root) {

  const PLACE = { shower: 'shower', pool: 'water', hottub: 'water' };
  const HER_ASS = /\b(in|into|inside|up|fills|enters) her (ass|asshole)\b|\bfuck(s|ing)? her ass\b|\bplug\b|\bbeads\b/;
  const PUSSY = /pussy|cunt|clit|\bslit\b|mound|labia/;
  const SEX = /\bfuck|inside her|\binto her\b(?! (\w+ )?(fist|hands?|mouth|grip|palm))|push(es)? in\b|slides? in\b|\brides? (you|your)|grinds? on your cock/;
  const PART = '(the |your )?(cock|shaft|balls|ass|asshole|crack|tip|head|you)';
  const HER_MOUTH = new RegExp(String.raw`\b(you|cock|shaft|balls|dick|toy|dildo)\b[^.,]{0,30}\b(in|into|across|on|over|fills) her (\w+ )?(mouth|lips)\b|\bher (\w+ )?(mouth|lips|tongue)\b[^.,]{0,25}\b(on|onto|round|around|over|along|down|off|finds)\b ${PART}\b|\bwith her (\w+ )?mouth\b|\bshe (sucks|licks|swallows)\b|\bsucks your\b|\b69\b|throat`);
  const HIS_MOUTH = /your (mouth|tongue|lips)\b[^.]{0,60}\b(pussy|cunt|clit|slit|mound|ass|asshole|crack)|\byou (eat|lick)\b|\beat(s|ing)? her\b|\b69\b/;
  const PROPS = { blindfold: /blindfold|\bblind\b/, cuffs: /\bcuff|\bties?\b|\btied\b|ankles? (bound|strapped)|wrists? (bound|strapped)/, gag: /\bgag/, ice: /\bice\b/, wax: /\bwax\b|candle/ };

  const OVERRIDES = {
    // the place the cue names, though the sub doesn't
    fuck_shower_kneel: { place: 'shower' }, fuck_tub: { place: 'shower' },
    // dressed throughout
    dare_lap_dance: { dress: 'clothed' }, strip_round: { dress: 'clothed' }, dare_undress: { dress: 'undress' }, dare_touch: { dress: null },
    // a bikini comes off in the water
    pool_bikini_top: { dress: 'undress', herMouth: false }, pool_bikini_bottom: { dress: 'undress' }, hottub_bubbles: { dress: 'undress' },
    rim_squat_away: { herMouth: false }, // "not in her mouth"
    body_cum_face: { herMouth: true }, // his load on her lips
  };

  const TEASE_OPENERS = ['slow_dance', 'kiss_squat', 'kiss_pushup']; // a kiss or a sway, dressed or not

  function tagsOf(id, e) {
    const t = (id.replace(/_/g, ' ') + ' ' + e.name + ' ' + e.cue).toLowerCase();
    const herRims = e.sub === 'rim' && id.startsWith('rim_her_');
    const anal = e.sub === 'anal' || (e.sub === 'rim' && !herRims) || HER_ASS.test(t);
    const sexy = !['partner', 'dare'].includes(e.sub) || PUSSY.test(t);
    const props = [];
    for (const p in PROPS) if (PROPS[p].test(t)) props.push((id.startsWith('kink_him_') ? 'him:' : '') + p);
    const dress = e.sub === 'partner' || TEASE_OPENERS.includes(id) || (e.sub === 'dare' && !PUSSY.test(t)) || (e.added < 13 && e.sub === 'massage') ? null
      : e.sub === 'tease' ? 'undress' : 'naked';
    return {
      place: e.sub === 'partner' ? null : PLACE[e.sub] || 'home', // a partner gym exercise goes anywhere
      dress,
      warm: ['massage', 'tease'].includes(e.sub),
      oral: e.sub === 'oral' || e.sub === 'rim' || HER_MOUTH.test(t) || HIS_MOUTH.test(t),
      anal,
      pussy: sexy && (PUSSY.test(t) || (SEX.test(t) && !anal)),
      herMouth: herRims || HER_MOUTH.test(t),
      finish: /\bcum\b/.test(id.replace(/_/g, ' ')),
      props,
      ...OVERRIDES[id],
    };
  }

  // every couple exercise of a catalogue, tagged
  const tagAll = (EX) => Object.fromEntries(Object.keys(EX).filter((id) => EX[id].cat === 'couple').map((id) => [id, tagsOf(id, EX[id])]));

  const api = { tagsOf, tagAll };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBSessionTags = api;
})(typeof window !== 'undefined' ? window : globalThis);
