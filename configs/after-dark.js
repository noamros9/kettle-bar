// After dark, Phase 18 (#185): the new After dark subjects, family Mixed. The first 30 After dark programs (Phase 16)
// stay in configs/mixed.js. Couple programs (`couple: true`) are sessions for two, him and her, mostly the same moves
// for both, from catalogue 10's couple exercises; they stay out of build your own and random workouts.
// Mixed rules hold: every main block tagged with its family, two families or more a day, no abs after a flow.
// Partner work is Strength or Cardio & combat; teasing, dares and massage are Mind & body flows; positions are a
// Cardio & combat flow of timed holds, held longer at Levels II and III.
const { S, SS, C, E, A, T, L, F } = require('./shared.js');
const { EX } = require('../exercises.js');

const LIFT = { family: 'Strength' };
const COND = { family: 'Cardio & combat' };
const CORE = { family: 'Mind & body', lever: [null, 'reps', 'reps'] };
const TEASE = { family: 'Mind & body', lever: [null, 'holds', 'holds'] };
const POS = { family: 'Cardio & combat', lever: [null, 'holds', 'holds'] };
const COUPLE = { added: 18, catalogue: 10, couple: true, equip: 'bw' };
const SOLO = { added: 18, catalogue: 10 }; // the solo After dark subjects: training for it, alone
// flows of the solo subjects: held longer at Level II and III; scaled: short stretches held twice as long (as in mixed.js)
const FLOW = { family: 'Mind & body', lever: [null, 'holds', 'holds'] };
const FLOW_SCALED = { ...FLOW, scale: 2, cap: 90 };
const YIN = { ...FLOW, scale: 3, cap: 120, values: [1] };
const CORE_S = { family: 'Strength', lever: [null, 'reps', 'reps'] }; // core as strength work, on a day whose other block is a flow
const HOLDS = { family: 'Mind & body' }; // isometric holds as body control, on a day whose other block is strength

// a build-up day: partner work, then teasing, then positions (no abs after them)
const buildUp = (label, short, work, tease, positions) => ({ label, short, absSlots: [], blocks: [work, F('Tease', tease, TEASE), F('Positions', positions, POS)] });
// an alternating day: partner sets and positions in turn, round after round, then a massage to finish
const rounds = (label, short, slots, values, finish = ['back_massage']) => ({ label, short, absSlots: [], blocks: [C('Rounds', slots, { ...COND, values }), F('Massage', finish, TEASE)] });

// Phase 20 ticket 8: Explicit. Each sex block draws one merged pool, so every exercise it can use has the same chance, basics about 1.5x.
const EXPLICIT = { added: 20, catalogue: 11, couple: true, equip: 'bw' };
const C13 = { ...EXPLICIT, catalogue: 13 };
// partner work, then positions from sexPositions (explicit and positions together)
const gymThenSex = (label, short, work, positions, flow) => ({ label, short, absSlots: [], blocks: [work, F('Positions', positions, { ...POS, ...flow })] });
// warm-up from sexWarm, then intercourse from sexFuck
const sexThenSex = (label, short, warmup, fuck, warm, intercourse) => ({ label, short, absSlots: [], blocks: [F('Warm-up', warmup, { ...TEASE, ...warm }), F('Fuck', fuck, { ...POS, ...intercourse })] });
// Sex then the subject's own pool (Rough, Body play): her mouth and your hands first, the lead block last.
const warmThenLead = (label, short, warmup, lead, warm, climax, title) => ({ label, short, absSlots: [], blocks: [F('Warm-up', warmup, { ...TEASE, ...warm }), F(title, lead, { ...POS, ...climax })] });
// one positions flow from sexPositions. One family. oneFamily marks it so the two-families test skips it, and only it.
const positionsOnly = (label, short, positions, flow) => ({ label, short, absSlots: [], oneFamily: true, blocks: [F('Positions', positions, { ...POS, ...flow })] });
// Ticket 20 rim positions: warm is one sexFuck flow at three passes, and the lead day adds a fuck flow beside the rim
// flow, so the sexFuck pool still comes up and a shorter day can land near 20 minutes.
const flowBlock = (pool, keep, drop, pref, values) => F('Positions', poses(pool, keep, drop), { ...POS, pref, ...(values ? { values } : {}) });
const flowDay = (label, short, blocks) => ({ label, short, absSlots: [], oneFamily: true, blocks });
const poses = (pool, keep, drop) => [...Array(keep).fill(pool), ...Array(drop).fill(pool + '?')];
const GYM_WORK = ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold?'];
const GYM_THREE = ['partnerLower', 'partnerUpper', 'partnerCore'];
const GYM_STRONG = ['partnerLower', 'partnerUpper', 'partnerHold', 'partnerCore?'];
const GYM_LIFT = ['partnerHold', 'partnerLower', 'partnerUpper', 'partnerCore?'];
const GYM_KISS = ['kiss_squat', 'kiss_pushup', 'partnerCore', 'partnerLower?'];
// Kiss squat and kiss push-up are in sexWarm. Rough gym uses the kiss-free partner pools, or a partner-block draw counts twice and breaks the 3x median.
const ROUGH_THREE = ['partner', 'partnerCore', 'partnerHold'];
const ROUGH_WORK = ['partner', 'partnerCore', 'partnerHold', 'partner?'];
const ROUGH_STRONG = ['partnerHold', 'partner', 'partnerCore', 'partner?'];
const ROUGH_LIFT = ['partnerHold', 'partner', 'partnerCore', 'partnerHold?'];
const ROUGH_PUSH = ['partnerCore', 'partner', 'partnerHold', 'partner?'];
const GYM_LONG_WORK = ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold', 'partner?'];
const GYM_POS = poses('sexPositions', 4, 2);
const GYM_POS_B = poses('sexPositions', 4, 2);
const GYM_SHORT_POS = poses('sexPositions', 2, 2);
const GYM_LONG_POS = poses('sexPositions', 5, 3);
const SEX_WARM = poses('sexWarm', 5, 2);
const SEX_MOUTH = poses('sexWarm', 4, 2);
const SEX_HANDS = poses('sexWarm', 4, 2);
const SEX_TEASE = poses('sexWarm', 4, 2);
const SEX_SHORT_WARM = poses('sexWarm', 4, 1);
const SEX_LONG_WARM = poses('sexWarm', 5, 3);
const SEX_FUCK = poses('sexFuck', 4, 2);
const SEX_DEEP = poses('sexFuck', 4, 2);
const SEX_SHORT_FUCK = poses('sexFuck', 3, 1);
const SEX_LONG_FUCK = poses('sexFuck', 5, 4);
const ONLY_FLOW = poses('sexPositions', 8, 6);
const ONLY_ALT = poses('sexPositions', 8, 6);

// Positions tour (Phase 18 ticket 6): 30 one-off days. tour(...) pairs each position with each way to prepare for it
// (positions × ways = 30 day types), dealt way by way so the same position never comes two days running; each day
// prepares, then does the position together, and a couple more after.
const POSITION_GROUP = {
  pos_missionary: 'hips', pos_prone: 'hips', pos_spooning: 'hips', pos_legs_up: 'range', pos_butterfly: 'range', pos_pretzel: 'range',
  pos_cowgirl: 'top', pos_reverse_cowgirl: 'top', pos_lotus: 'top', pos_doggy: 'behind', pos_standing_behind: 'behind',
  pos_standing_carry: 'carry', pos_wheelbarrow: 'carry', pos_edge_of_bed: 'carry', pos_69: 'mouth',
};
const STRONG = { hips: ['thrustBw', 'pushBw2', 'coreAnti'], range: ['coreHollow', 'adductorBw', 'thrustBw'], top: ['legsBw2', 'adductorBw', 'thrustBw'], behind: ['thrustBw', 'legsBw2', 'coreAnti'], carry: ['posLegs', 'partnerHold', 'coreAnti'], mouth: ['neckReps', 'neck', 'coreAnti'] };
const OPEN = { hips: ['fxHips', 'ygHips', 'ygRest', 'fxHips?'], range: ['fxHam', 'fxHips', 'fxStraddle', 'ygRest?'], top: ['fxHips', 'fxQuad', 'ygRest', 'fxHips?'], behind: ['fxQuad', 'ygBack', 'ygRest', 'fxQuad?'], carry: ['fxQuad', 'fxHam', 'ygRest', 'fxHips?'], mouth: ['ygBack', 'fxHips', 'ygRest', 'ygBack?'] };
const WAYS = {
  strong: ['strength', (g) => S('Strong for it', STRONG[g], LIFT)],
  open: ['range', (g) => F('Open for it', OPEN[g], FLOW_SCALED)],
  stamina: ['stamina', () => C('Stamina for it', ['thrustBw', 'posHold', 'hiit', 'thrustBw?'], { ...LIFT, values: [2, 3, 4] })],
  grip: ['grip & holds', () => C('Grip and holds', ['partnerHold', 'posHold', 'partnerHold', 'posHold?'], { ...LIFT, values: [2, 3, 4, 5] })],
  legs: ['legs', () => C('Legs for it', ['legsBw2', 'posLegs', 'partnerLower', 'legsBw2?'], { ...LIFT, values: [2, 3, 4] })],
  core: ['core', () => C('Core for it', ['coreAnti', 'coreHollow', 'partnerCore', 'coreRot?'], { ...LIFT, values: [2, 3, 4] })],
};
const TOUR_NAMES = ['First Stop', 'Next Stop', 'Detour', 'Scenic Route', 'Landmark', 'Sightseeing', 'Postcard', 'Souvenir', 'Guidebook', 'Halfway', 'Off the Map', 'Hidden Gem', 'Local Favorite', 'Must-See', 'Day Trip', 'Overnight', 'Layover', 'Passport Stamp', 'Last Stop', 'Home Again'];
function tour(id, name, blurb, about, positions, ways) {
  if (positions.length * ways.length !== 30) throw new Error(`${id}: ${positions.length} positions × ${ways.length} ways is not 30 days`);
  const dayTypes = {}, cycle = [];
  ways.forEach((w) => positions.forEach((pos) => {
    const g = POSITION_GROUP[pos], [way, block] = WAYS[w], key = `${pos.slice(4)}-${w}`;
    dayTypes[key] = { label: `${EX[pos].name} · ${way}`, short: EX[pos].name.split(' ')[0], absSlots: [], blocks: [block(g), F('The position', [pos, 'positions', 'positions?', 'positions?'], POS)] };
    cycle.push(key);
  }));
  return { id, ...COUPLE, days: 30, name, subject: 'Positions tour', minutes: [24, 30], levers: [null, 'reps', 'holds'],
    split: `${name.replace(/^Positions Tour: |^The /, '')}: ${positions.length} positions × ${ways.length} ways, 30 days`, blurb, about, names: TOUR_NAMES, cycle, dayTypes };
}

module.exports = [
  // ---- Couples (ticket 3): 14 build up, 6 alternate; 4 are 30-day programs ----
  {
    id: 'sweat-together', ...COUPLE, name: 'Sweat Together', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit / partner strength, then tease and positions', blurb: 'Your first couple workout: a partner circuit, a slow dance, then into bed so you can fuck her.',
    about: 'The way in, and you two finish with you inside her. One day is a partner circuit, squats holding hands, high-five push-ups and sit-up claps, round after round; the other is partner strength done slowly together. Every session then slows down: a slow dance or a dare, and a few positions held long enough to count as work, your cock in her pussy. Level II adds reps, Level III makes every hold longer.',
    names: ['First Date', 'Second Date', 'Third Date', 'Hand in Hand', 'Side by Side', 'Face to Face', 'Heart Rate Up', 'Breathless', 'Warm Bodies', 'Sweat Equity', 'Steamed Up', 'Glow', 'Flushed', 'Heated', 'Melting', 'Dripping', 'Afterglow', 'Lights Out', 'Sheets', 'Together'],
    cycle: ['circuit', 'strength'],
    dayTypes: {
      circuit: buildUp('Partner circuit', 'Circuit', C('Partner circuit', ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerLower?'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare'], ['positions', 'positions']),
      strength: buildUp('Partner strength', 'Strength', S('Partner strength', ['partnerLower', 'partnerUpper', 'partnerHold'], LIFT), ['dare', 'slow_dance?'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'foreplay-fitness', ...COUPLE, name: 'Foreplay Fitness', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Kiss reps / dares, then positions', blurb: 'Every rep is foreplay: kiss squats and kiss push-ups, dirty dares between rounds, then you two fuck.',
    about: 'A workout that never quite lets you two forget you are about to fuck. Kiss squats and kiss push-ups put your faces together every rep; a dare drawn by the timer comes between rounds. The tease block slows things right down, and the session ends in positions held as long as the legs allow, your cock deep in her pussy. Level II adds reps and Level III holds everything longer.',
    names: ['Warm-up Act', 'Opening Move', 'First Kiss', 'Lip Service', 'Slow Hands', 'Close Call', 'Almost', 'Not Yet', 'Wait for It', 'Patience', 'Getting Warmer', 'Hot and Cold', 'Tease', 'Under the Skin', 'Simmer', 'Boil Over', 'Can\'t Wait', 'Now', 'Finally', 'Encore'],
    cycle: ['kiss', 'dares'],
    dayTypes: {
      kiss: buildUp('Kiss reps', 'Kiss', C('Kiss circuit', ['kiss_squat', 'kiss_pushup', 'partnerCore', 'dare?'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare_neck'], ['positions', 'positions']),
      dares: buildUp('Dares', 'Dares', C('Dare circuit', ['partnerLower', 'dare', 'partnerUpper', 'dare'], { ...COND, values: [2, 3, 4, 5] }), ['dare_whisper', 'dare_eyes_closed'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'strip-circuit', ...COUPLE, name: 'Strip Circuit', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Strip circuit / strip EMOM, then positions', blurb: 'Lose the round, lose a layer: a partner circuit with a strip forfeit, until you two are naked and fucking.',
    about: 'Every round ends in a forfeit: whoever did fewer reps or broke the hold first takes off one layer of the winner\'s choosing. One day is a circuit of partner squats, push-ups and holds, the other an EMOM where you race each other inside each minute. By the end nobody is wearing much, and the positions block is you fucking her, your cock in her pussy. Both later levels add reps.',
    names: ['Coat Check', 'Shoes Off', 'Socks Too', 'Top Button', 'Unzipped', 'Belt Loose', 'Off the Shoulder', 'Shirtless', 'Down to This', 'Lace', 'Straps', 'Last Layer', 'Birthday Suit', 'Bare', 'Nothing On', 'Skin', 'Exposed', 'Full Monty', 'In the Buff', 'Dressed Down'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: buildUp('Strip circuit', 'Circuit', C('Strip circuit', ['partnerLower', 'partnerUpper', 'partnerHold', 'strip_round'], { ...COND, values: [3, 4, 5, 6] }), ['dare_undress'], ['positions', 'positions']),
      emom: buildUp('Strip EMOM', 'EMOM', E('Strip EMOM', ['partnerLower', 'partnerUpper', 'partnerCore', 'strip_round'], { ...COND, values: [12, 14, 16, 18, 20] }), ['dare_undress', 'dare_touch?'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'kiss-me-reps', ...COUPLE, name: 'Kiss Me Reps', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats / kiss push-ups, then positions', blurb: 'A kiss at the bottom of every squat and every push-up, then a slow face-to-face fuck together.',
    about: 'Built around the kiss reps, mouth to mouth. One day leads with kiss squats and mirror lunges for the legs, the other with kiss push-ups and wheelbarrow walks for the upper body, both in straight sets so you two can take your time at the bottom. Then a slow dance, and positions chosen for being face to face while you fuck her. Level II adds reps, Level III holds everything longer.',
    names: ['Peck', 'Smooch', 'Kiss Me Quick', 'Kiss Me Slow', 'Pucker Up', 'Lip Lock', 'French', 'Butterfly Kiss', 'Eskimo Kiss', 'Neck Kiss', 'Collarbone', 'Earlobe', 'Bite', 'Breath', 'Linger', 'Mouth to Mouth', 'Kiss Chase', 'Sealed', 'Kissed All Over', 'Goodnight Kiss'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: buildUp('Kiss squats', 'Legs', S('Kiss legs', ['kiss_squat', 'mirror_lunge', 'partner_bridge'], LIFT), ['slow_dance'], ['positionsSlow', 'positionsSlow']),
      upper: buildUp('Kiss push-ups', 'Upper', S('Kiss upper', ['kiss_pushup', 'wheelbarrow_walk', 'plank_taps'], LIFT), ['slow_dance', 'dare_no_hands?'], ['positionsSlow', 'positions']),
    },
  },
  {
    id: 'lift-me-up', ...COUPLE, name: 'Lift Me Up', subject: 'Couples', minutes: [28, 33], levers: [null, 'holds', 'reps'],
    split: 'Carries and holds / legs and grip, then standing positions', blurb: 'You carry her, she holds on: partner carries, lift-and-holds, and the standing fucks they make possible.',
    about: 'Strength for the positions where you hold her off the floor on your cock. Piggyback carries, lift-and-holds and back-to-back wall sits build your legs, back and grip and her squeeze; partner squats and wheelbarrow walks fill in the rest. Each session ends on the standing positions: the carry, the wheelbarrow, the edge of the bed. Level II holds longer, Level III adds reps.',
    names: ['Pick Me Up', 'Lift Off', 'Up You Go', 'Hold Tight', 'Hang On', 'Legs Around', 'Arms Around', 'Off the Ground', 'Carried Away', 'Swept Off Her Feet', 'Over the Threshold', 'Piggyback', 'Wrapped Up', 'Against the Wall', 'Standing Room', 'Heavy Lifting', 'Strong Arms', 'Lighter Than Air', 'Weightless', 'Put Me Down'],
    cycle: ['carry', 'legs'],
    dayTypes: {
      carry: buildUp('Carries and holds', 'Carry', C('Carries and holds', ['partnerHold', 'partner_squat', 'partnerHold', 'plank_taps?', 'partnerLower?'], { ...LIFT, values: [2, 3, 4, 5] }), ['slow_dance'], ['positionsStanding', 'positionsStanding']),
      legs: buildUp('Legs and grip', 'Legs', S('Legs and grip', ['partnerLower', 'lift_hold', 'back_to_back_sit', 'partnerCore?', 'partnerHold?'], LIFT), ['dare'], ['positionsStanding', 'positions']),
    },
  },
  {
    id: 'date-night-burn', ...COUPLE, days: 30, name: 'Date Night Burn', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Tabata for two / partner circuit, then positions, 30 days', blurb: 'Date nights that end in a fuck: a hard partner burn, a tease, and the rest of the night spent in bed.',
    about: 'Thirty date nights, and they end with you inside her. One day is a partner Tabata, twenty seconds hard and ten seconds off, side by side; the next a partner circuit that ends every round with a dare. Both slow down into a tease and finish in positions, your cock in her pussy. Every ten days the level goes up: more reps first, then longer holds.',
    names: ['Reservation', 'Table for Two', 'Candlelight', 'Wine List', 'Appetizer', 'Main Course', 'Dessert', 'Nightcap', 'Your Place', 'My Place', 'Valet', 'Taxi Home', 'Doorstep', 'Come In', 'Coat Off', 'Music On', 'Lights Down', 'Couch', 'Bedroom', 'Breakfast'],
    cycle: ['tabata', 'circuit'],
    dayTypes: {
      tabata: buildUp('Tabata for two', 'Tabata', T('Tabata for two', ['partnerLower', 'partnerUpper'], { ...COND, values: [1, 2, 3] }), ['slow_dance', 'dare'], ['positions', 'positions', 'positions?']),
      circuit: buildUp('Partner circuit', 'Circuit', C('Partner circuit', ['partnerLower', 'partnerCore', 'dare', 'partnerUpper?'], { ...COND, values: [2, 3, 4, 5] }), ['dare_neck'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'partners-in-grime', ...COUPLE, name: 'Partners in Grime', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Partner AMRAP / partner EMOM, then shower-ready positions', blurb: 'Get filthy together: a sweaty partner AMRAP, then fuck while you two are still dripping, before the shower.',
    about: 'The sweatiest fuck on the list. One day is a partner AMRAP, as many rounds as you can of squats, push-ups and sit-up claps; the other an EMOM that never lets the heart rate settle. Afterwards a quick dare and a run of positions while you two are still breathing hard, your cock in her, then the shower together. Both later levels add reps.',
    names: ['Dirty', 'Grubby', 'Mud', 'Sweatbox', 'Wet Look', 'Grimy', 'Messy', 'Soaked', 'Damp', 'Sticky', 'Slick', 'Glisten', 'Puddle', 'Steam Room', 'Rinse', 'Lather', 'Shower Together', 'Towel Off', 'Clean Again', 'Dirty Again'],
    cycle: ['amrap', 'emom'],
    dayTypes: {
      amrap: buildUp('Partner AMRAP', 'AMRAP', A('Partner AMRAP', ['partnerLower', 'partnerUpper', 'partnerCore'], { ...COND, values: [10, 12, 14, 16, 18] }), ['dare', 'slow_dance?'], ['positions', 'positions']),
      emom: buildUp('Partner EMOM', 'EMOM', E('Partner EMOM', ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold'], { ...COND, values: [12, 14, 16, 18, 20] }), ['dare_touch'], ['positions', 'positionsStanding']),
    },
  },
  {
    id: 'take-it-off', ...COUPLE, name: 'Take It Off', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Strip forfeits / undress me, then positions', blurb: 'Strip forfeits and the undress-me dare, then everything else comes off and you two fuck in full view.',
    about: 'A slower, dirtier cousin of Strip Circuit. Partner strength sets with a strip forfeit after each exercise; the other day a circuit where the dare is always to undress your partner, slowly. The tease is long and the positions are the ones where you can see your cock in her. Level II adds reps, Level III holds everything longer.',
    names: ['Button Up', 'Unbutton', 'Zip Down', 'Hook and Eye', 'Slip Off', 'Shrug Off', 'Kick Off', 'Peel', 'Unwrap', 'Gift', 'Ribbon', 'Reveal', 'Curtain Up', 'Undone', 'Loose', 'Stripped', 'Bare Back', 'Shown', 'All Off', 'Leave It On'],
    cycle: ['forfeit', 'undress'],
    dayTypes: {
      forfeit: buildUp('Strip forfeits', 'Forfeit', S('Partner strength', ['partnerLower', 'strip_round', 'partnerUpper', 'strip_round'], LIFT), ['dare_undress'], ['positionsSlow', 'positions']),
      undress: buildUp('Undress me', 'Undress', C('Undress circuit', ['partnerLower', 'dare_undress', 'partnerCore'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare_touch'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'slow-burn-couples', ...COUPLE, name: 'Slow Burn Couples', subject: 'Couples', minutes: [36, 44], levers: [null, 'holds', 'holds'],
    split: 'Slow strength / long tease, then long positions', blurb: 'Nothing rushed: slow partner strength, a long tease, and positions held a long time with your cock in her.',
    about: 'The long, slow fuck, for an evening with nowhere to be. Partner strength at a slow pace with long holds, back-to-back wall sits and bridges; then a slow dance, a massage and a dare; then the slow positions, spooning, lotus, missionary, held long and breathed through with your cock buried in her. Level II and III make every hold longer.',
    names: ['Slow Down', 'Low Light', 'Simmer', 'Smoulder', 'Embers', 'Candle', 'Wax', 'Velvet', 'Silk', 'Honey', 'Molasses', 'Long Night', 'No Hurry', 'Unhurried', 'Lazy', 'Languid', 'Drawn Out', 'Lingering', 'All Night', 'Sunrise'],
    cycle: ['strength', 'tease'],
    dayTypes: {
      strength: buildUp('Slow strength', 'Strength', S('Slow partner strength', ['lift_hold', 'partner_bridge', 'back_to_back_sit', 'partner_carry?'], LIFT), ['slow_dance', 'back_massage'], ['positionsSlow', 'positionsSlow', 'positionsSlow']),
      tease: buildUp('Long tease', 'Tease', C('Partner holds', ['partnerHold', 'partnerCore', 'partnerHold'], { ...LIFT, values: [2, 3] }), ['slow_dance', 'leg_massage', 'dare', 'back_massage?'], ['positionsSlow', 'positionsSlow', 'positionsSlow', 'positionsSlow?']),
    },
  },
  {
    id: 'sweaty-sheets', ...COUPLE, name: 'Sweaty Sheets', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Bed-ready strength / partner Tabata, then a long positions block', blurb: 'The workout ends in bed: a long run of positions, fucking on the sheets, you inside her.',
    about: 'The positions block is the fuck, and it is the main event here. A shorter partner warm-up, strength one day and a Tabata the other, gets you two warm; a dare gets you closer; then a long block of positions in bed, one after another, each held for a minute or more with your cock in her. Level II adds reps to the partner work, Level III holds the positions longer.',
    names: ['Fresh Sheets', 'Turned Down', 'Pillow Talk', 'Duvet', 'Under Covers', 'Thread Count', 'Satin', 'Cotton', 'Linen', 'Bedspring', 'Headboard', 'Footboard', 'Mattress', 'Bedhead', 'Rumpled', 'Tangled', 'Twisted Sheets', 'Laundry Day', 'Change the Sheets', 'Again'],
    cycle: ['strength', 'tabata'],
    dayTypes: {
      strength: buildUp('Bed-ready strength', 'Strength', S('Partner strength', ['partnerLower', 'partnerCore'], LIFT), ['dare'], ['positionsBed', 'positionsBed', 'positionsBed', 'positionsBed?']),
      tabata: buildUp('Partner Tabata', 'Tabata', T('Partner Tabata', ['partnerLower', 'partnerCore'], { ...COND, values: [1, 2, 3] }), ['dare', 'slow_dance?'], ['positionsBed', 'positionsBed', 'positionsBed', 'positionsBed?']),
    },
  },
  {
    id: 'dare-night', ...COUPLE, name: 'Dare Night', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Dare circuit / winner\'s choice, then positions', blurb: 'Win the round, call the dare: a partner circuit where the timer hands out filthy dares, then you two fuck.',
    about: 'Competitive and a bit wicked, and it ends with you inside her. Every round of the partner circuit ends with a dare drawn by the timer, and whoever won the round decides who does it. The other day is all about winner\'s choice: win a round, pick the next position. The tease block is dares only. Level II adds reps, Level III holds everything longer.',
    names: ['Truth', 'Dare', 'Double Dare', 'Triple Dare', 'Chicken', 'Call Your Bluff', 'All In', 'Raise', 'Fold', 'Wild Card', 'Joker', 'Ace', 'Spin the Bottle', 'Seven Minutes', 'Never Have I Ever', 'Forfeit', 'Loser Pays', 'Winner Takes All', 'Rematch', 'Sudden Death'],
    cycle: ['dares', 'choice'],
    dayTypes: {
      dares: buildUp('Dare circuit', 'Dares', C('Dare circuit', ['partnerLower', 'partnerUpper', 'dare', 'partnerCore?'], { ...COND, values: [2, 3, 4, 5] }), ['dare', 'dare'], ['positions', 'positions']),
      choice: buildUp('Winner\'s choice', 'Choice', C('Winner\'s choice', ['partnerCore', 'partnerLower', 'winners_choice'], { ...COND, values: [2, 3, 4, 5] }), ['dare', 'dare?'], ['winners_choice', 'positions', 'positions', 'positions?']),
    },
  },
  {
    id: 'massage-and-mount', ...COUPLE, name: 'Massage & Mount', subject: 'Couples', minutes: [36, 42], levers: [null, 'reps', 'holds'],
    split: 'Partner strength, massage, then her on top', blurb: 'Work hard, get rubbed down, then she gets on top of your cock: cowgirl, reverse and lotus.',
    about: 'Three parts every time, and the last is her on top of your cock. A partner strength or circuit block for both of you; a proper massage, back and then legs and glutes; and positions where she is on top, cowgirl, reverse cowgirl and lotus. The massage block is long enough to be the point. Level II adds reps, Level III holds everything longer.',
    names: ['Knots', 'Kneading', 'Pressure Points', 'Warm Oil', 'Long Strokes', 'Thumbs', 'Shoulder Rub', 'Back Rub', 'Foot Rub', 'Deep Tissue', 'Hot Stone', 'Spa Night', 'Rub Down', 'Loosened Up', 'Melted', 'Saddle Up', 'Giddy Up', 'Ride', 'Rodeo', 'Cowgirl Up'],
    cycle: ['strength', 'circuit'],
    dayTypes: {
      strength: buildUp('Strength and massage', 'Strength', S('Partner strength', ['partnerLower', 'partnerUpper', 'partnerHold', 'partnerCore?'], LIFT), ['back_massage', 'leg_massage'], ['positionsHer', 'positionsHer', 'positionsHer?']),
      circuit: buildUp('Circuit and massage', 'Circuit', C('Partner circuit', ['partnerLower', 'partnerCore', 'partnerUpper'], { ...COND, values: [2, 3, 4, 5] }), ['leg_massage', 'back_massage'], ['positionsHer', 'positionsHer', 'positionsHer?']),
    },
  },
  {
    id: 'couples-kama-sutra-30', ...COUPLE, days: 30, name: 'Couple\'s Kama Sutra 30', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Floor / standing / her on top, 30 days', blurb: 'Thirty days fucking through the positions together, each day warming up for the ones you two end inside.',
    about: 'The together version of Kama Sutra 30: thirty days of you inside her, position after position. Three kinds of day turn: floor positions after partner core and bridges; standing positions after carries and wall sits; her-on-top positions after squats and lunges. Each session warms up exactly what its positions ask for, teases, then works through them. Every ten days it gets harder, reps first, then longer holds.',
    names: ['Chapter One', 'The Lotus', 'The Bridge', 'The Swan', 'The Lion', 'The Tiger', 'The Crab', 'The Elephant', 'The Mare', 'The Cobra', 'The Butterfly', 'The Peacock', 'The Bow', 'The Wheel', 'The Plough', 'The Fan', 'The Moon', 'The Star', 'The Scissors', 'The Last Page'],
    cycle: ['floor', 'standing', 'top'],
    dayTypes: {
      floor: buildUp('Floor positions', 'Floor', C('Partner core', ['partnerCore', 'partner_bridge', 'partnerCore', 'partnerLower?'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance'], ['positionsBed', 'positionsBed']),
      standing: buildUp('Standing positions', 'Standing', S('Carries and holds', ['partnerHold', 'back_to_back_sit', 'partnerLower', 'partnerCore?'], LIFT), ['dare', 'slow_dance?'], ['positionsStanding', 'positionsStanding', 'positions?']),
      top: buildUp('Her on top', 'On top', S('Squats and lunges', ['partner_squat', 'mirror_lunge', 'kiss_squat'], LIFT), ['dare_lap_dance'], ['positionsHer', 'positionsHer']),
    },
  },
  {
    id: 'thirty-days-of-foreplay', ...COUPLE, days: 30, name: '30 Days of Foreplay', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Kiss circuit / dare circuit / massage, 30 days', blurb: 'A month that takes its time before the fuck: kisses, dares and massages, then you inside her at the end.',
    about: 'Thirty days where the tease is the main event and the fuck waits at the end. Kiss reps one day, a dare circuit the next, a massage day the third, each with a partner block to get you two breathing first and a few positions at the end, your cock in her pussy. Every ten days it gets harder: more reps, then longer holds and longer teases.',
    names: ['Day One', 'Glance', 'Smile', 'Brush', 'Graze', 'Whisper', 'Lean In', 'Close', 'Closer', 'Lips', 'Neck', 'Shoulders', 'Hands', 'Hips', 'Thighs', 'Slowly', 'Softly', 'Barely', 'Almost', 'Day Thirty'],
    cycle: ['kiss', 'dares', 'massage'],
    dayTypes: {
      kiss: buildUp('Kiss circuit', 'Kiss', C('Kiss circuit', ['kiss_squat', 'kiss_pushup', 'partnerCore'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare_neck'], ['positionsSlow', 'positionsSlow']),
      dares: buildUp('Dare circuit', 'Dares', C('Dare circuit', ['partnerLower', 'dare', 'partnerUpper'], { ...COND, values: [2, 3, 4, 5] }), ['dare', 'dare_whisper'], ['positions', 'positions']),
      massage: buildUp('Massage day', 'Massage', S('Partner strength', ['partnerLower', 'partnerHold'], LIFT), ['back_massage', 'leg_massage'], ['positionsSlow', 'positionsSlow']),
    },
  },
  // alternating: a partner set, then a position, round after round
  {
    id: 'ride-along', ...COUPLE, name: 'Ride Along', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Squats and cowgirl / lunges and reverse, in rounds', blurb: 'Squat together, then she sits on your cock: partner legs and her-on-top positions, round after round.',
    about: 'Alternating rounds built for her legs, your hips, and her sitting on your cock. A set of partner squats or mirror lunges, then straight into cowgirl or reverse cowgirl for the length of a hold, her pussy on your cock, then back to the squats. Two or three rounds, then a back massage to finish. Level II adds reps, Level III holds every position longer.',
    names: ['Saddle', 'Stirrups', 'Trot', 'Canter', 'Gallop', 'Bareback', 'Rein In', 'Giddy Up', 'Bronco', 'Rodeo', 'Eight Seconds', 'Buck', 'Ride It Out', 'Hold On', 'Home Stretch', 'Finish Line', 'Photo Finish', 'Victory Lap', 'Cool Down', 'Stable'],
    cycle: ['squat', 'lunge'],
    dayTypes: {
      squat: rounds('Squats and cowgirl', 'Squat', ['partner_squat', 'positionsHer', 'kiss_squat', 'positionsHer'], [2, 3, 4, 5]),
      lunge: rounds('Lunges and reverse', 'Lunge', ['mirror_lunge', 'pos_reverse_cowgirl', 'partner_bridge', 'pos_cowgirl'], [2, 3, 4, 5], ['leg_massage']),
    },
  },
  {
    id: 'couples-quickie', ...COUPLE, name: 'Couple\'s Quickie', subject: 'Couples', minutes: [18, 22], levers: [null, 'reps', 'holds'],
    split: 'Quick rounds / quick standing rounds', blurb: 'Twenty minutes, start to finish: partner sets and positions in quick rounds, a fast fuck together.',
    about: 'For when there isn\'t time for a long fuck but you two want one anyway. Short partner sets and one position each round, twice through, then a quick massage. One day keeps it on the bed, the other stands up. Level II adds reps, Level III holds every position longer.',
    names: ['Quick One', 'Lunch Break', 'Before Work', 'Before Dinner', 'Commercial Break', 'Halftime', 'Snack', 'Shortcut', 'Express', 'Fast Lane', 'Rush Hour', 'Speedy', 'In and Out', 'Pit Stop', 'Ten Minutes', 'Kitchen Counter', 'Against the Door', 'Still Dressed', 'Late Already', 'Worth It'],
    cycle: ['bed', 'standing'],
    dayTypes: {
      bed: rounds('Quick rounds', 'Bed', ['partnerCore', 'positionsBed', 'partnerUpper', 'positionsBed'], [1, 2, 3]),
      standing: rounds('Quick standing rounds', 'Standing', ['partnerLower', 'positionsStanding', 'partnerHold', 'positionsStanding', 'partnerCore?'], [1, 2, 3]),
    },
  },
  {
    id: 'fuck-fit', ...COUPLE, name: 'Fuck Fit', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Push and positions / legs and positions, in rounds', blurb: 'No pretending: partner sets, then your cock in her, turn by turn, the workout and the fuck as one thing.',
    about: 'No pretending this one is about anything but the two of you fucking. Every round is a partner set followed by a position held as a set: push-ups then missionary, squats then standing from behind, bridges then cowgirl, your cock in her pussy the whole hold. The positions are timed like any exercise and get longer as you level up. A massage to close. Level II adds reps, Level III holds every position longer.',
    names: ['Rep One', 'Set Two', 'Superset', 'Drop Set', 'Burnout', 'Failure', 'Pump', 'Power', 'Grind', 'Max Effort', 'Personal Best', 'New Record', 'Spotter', 'Form Check', 'Full Range', 'Time Under Tension', 'Rest Day', 'Deload', 'Gains', 'Fit'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: rounds('Push and positions', 'Push', ['highfive_pushup', 'pos_missionary', 'plank_taps', 'positionsBed'], [2, 3, 4, 5]),
      legs: rounds('Legs and positions', 'Legs', ['partner_squat', 'pos_standing_behind', 'partner_bridge', 'pos_cowgirl'], [2, 3, 4, 5], ['leg_massage']),
    },
  },
  {
    id: 'pin-me-down', ...COUPLE, name: 'Pin Me Down', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Core and floor / holds and floor, in rounds', blurb: 'Partner core and holds, then you pin her and fuck her: missionary, lying flat, her legs over your shoulders.',
    about: 'Floor work and then a pinned fuck, her under you. A round of sit-up claps or leg throws, then a position where you pin her: missionary, lying flat from behind, her legs over your shoulders. Then plank taps or a wall sit, and another. Two or three rounds and a back massage. Level II adds reps, Level III holds every position longer.',
    names: ['Pinned', 'Held Down', 'Wrists', 'Can\'t Move', 'Surrender', 'Give In', 'Tap Out', 'Submission', 'Grappling', 'Wrestle', 'Mount', 'Guard', 'Escape', 'Reversal', 'Your Turn', 'My Turn', 'Pinned Again', 'Two Count', 'Three Count', 'Winner'],
    cycle: ['core', 'holds'],
    dayTypes: {
      core: rounds('Core and floor', 'Core', ['partner_situp', 'pos_missionary', 'leg_throws', 'pos_legs_up'], [2, 3, 4, 5]),
      holds: rounds('Holds and floor', 'Holds', ['plank_taps', 'pos_prone', 'back_to_back_sit', 'pos_missionary'], [2, 3, 4, 5], ['leg_massage']),
    },
  },
  {
    id: 'wheelbarrow-race', ...COUPLE, name: 'Wheelbarrow Race', subject: 'Couples', minutes: [24, 29], levers: [null, 'reps', 'holds'],
    split: 'Wheelbarrow walks / carries, in rounds', blurb: 'Wheelbarrow her across the room, then fuck her in the wheelbarrow position at the far wall.',
    about: 'Strong shoulders for her, strong hips and grip for you, so you can hold her up and fuck her. Each round: a wheelbarrow walk, then the wheelbarrow position for a hold; then high-five push-ups and standing from behind. The other day swaps in carries and the standing carry. A massage to finish, mostly for her shoulders. Level II adds reps, Level III holds every position longer.',
    names: ['On Your Marks', 'Get Set', 'Go', 'Wheel Spin', 'Push Cart', 'Barrow', 'Hand Walk', 'Race Day', 'Lap One', 'Lap Two', 'Overtake', 'Home Straight', 'Neck and Neck', 'Dead Heat', 'Photo Finish', 'Podium', 'Gold', 'Silver', 'Bronze', 'Rematch'],
    cycle: ['wheel', 'carry'],
    dayTypes: {
      wheel: rounds('Wheelbarrow rounds', 'Wheel', ['wheelbarrow_walk', 'pos_wheelbarrow', 'highfive_pushup', 'pos_standing_behind'], [2, 3, 4, 5]),
      carry: rounds('Carry rounds', 'Carry', ['partner_carry', 'pos_standing_carry', 'lift_hold', 'pos_edge_of_bed'], [2, 3, 4, 5]),
    },
  },
  {
    id: 'fit-to-fuck-30', ...COUPLE, days: 30, name: 'Fit to Fuck 30', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Upper rounds / lower rounds / standing rounds, 30 days', blurb: 'Thirty days of partner sets and fucking in turn, a little harder every ten days.',
    about: 'Fuck Fit, stretched over a month of you inside her. Three kinds of round turn: upper-body partner work with floor positions, legs with her-on-top positions, and carries with standing positions. Every session finishes with a massage. Every ten days it gets harder, more reps first and then longer holds.',
    names: ['Day One', 'Warming Up', 'Getting There', 'Rhythm', 'Tempo', 'Stamina', 'Endurance', 'Drive', 'Power', 'Grip', 'Balance', 'Range', 'Flex', 'Hold', 'Push', 'Pull', 'Lift', 'Carry', 'Finish Strong', 'Day Thirty'],
    cycle: ['upper', 'lower', 'standing'],
    dayTypes: {
      upper: rounds('Upper rounds', 'Upper', ['partnerUpper', 'positionsBed', 'partnerCore', 'positionsBed'], [2, 3, 4, 5]),
      lower: rounds('Lower rounds', 'Lower', ['partnerLower', 'positionsHer', 'partnerLower', 'positionsHer'], [2, 3, 4, 5], ['leg_massage']),
      standing: rounds('Standing rounds', 'Standing', ['partnerHold', 'positionsStanding', 'partnerLower', 'positionsStanding', 'partnerCore?'], [2, 3, 4, 5]),
    },
  },
  // ---- Endurance & control (ticket 4): lasting longer. Pelvic-floor holds, breath and tempo, interval conditioning ----
  {
    id: 'last-all-night', ...SOLO, name: 'Last All Night', subject: 'Endurance & control', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Hip-drive circuit / control & breath', blurb: 'Stamina to fuck her all night: hip-drive circuits one day, pelvic-floor holds and slow breathing the next.',
    about: 'Two halves of lasting longer while you fuck her. One day is a hip-drive circuit, bridges, swings and core round after round with short rests, so the hips and lungs keep going. The other trains control: pelvic-floor holds and their release, slow tempo bridges, and a long stretch where you practise slow breathing under tension. Level II adds reps, Level III holds everything longer.',
    names: ['Dusk', 'Nightfall', 'Late Show', 'Second Wind', 'Third Wind', 'Slow Down', 'Breathe', 'Steady', 'Easy Now', 'Hold Back', 'Not Yet', 'Pace Yourself', 'Long Game', 'Distance', 'Overtime', 'Extra Innings', 'After Hours', 'Small Hours', 'Dawn', 'Breakfast in Bed'],
    cycle: ['drive', 'control'],
    dayTypes: {
      drive: { label: 'Hip-drive circuit', short: 'Drive', blocks: [C('Hip drive', ['thrust', 'kbBallistic', 'coreAnti', 'thrust', 'hiit?'], { ...COND, values: [2, 3, 4, 5] }), C('Control', ['pelvic_floor_hold', 'pelvic'], { ...CORE, values: [2] })] },
      control: { label: 'Control & breath', short: 'Control', absSlots: [], blocks: [S('Slow hips', ['bridge_hold', 'thrust', 'pelvic_floor_hold', 'pelvic'], { ...LIFT, lever: [null, 'tempo', 'holds'] }), F('Breathe', ['ygHips', 'ygYinHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'edge-control', ...SOLO, name: 'Edge Control', subject: 'Endurance & control', minutes: [26, 31], levers: [null, 'tempo', 'holds'],
    split: 'Tempo strength / holds & yin', blurb: 'Learn to fuck her on the edge: slow tempo strength and long holds that teach you to stay calm inside her.',
    about: 'Control is a skill, and this is how you last once you are buried in her. Everything is slow: five-second lowerings on squats, thrusts and push-ups, long holds at the hardest point, pelvic-floor holds between sets. The other day finishes with a long yin stretch where the only job is to breathe slowly while it burns. Level II slows the tempo further, Level III holds longer.',
    names: ['On the Edge', 'Brink', 'Close Call', 'Hold It', 'Breathe Out', 'Count to Ten', 'Slow Burn', 'Cool Head', 'Steady Hands', 'Tension', 'Release', 'Again', 'Just Wait', 'Patience', 'Discipline', 'Mind Over', 'Ride It', 'Stay There', 'Almost', 'Then Go'],
    cycle: ['tempo', 'holds'],
    dayTypes: {
      tempo: { label: 'Tempo strength', short: 'Tempo', blocks: [S('Slow strength', ['squat2', 'thrust', 'push', 'pelvic_floor_hold'], LIFT), C('Core holds', ['coreAnti', 'pelvic'], { ...CORE, values: [2, 3] })] },
      holds: { label: 'Holds & yin', short: 'Holds', absSlots: [], blocks: [C('Holds', ['posHold', 'bridge_hold', 'posHold', 'pelvic_floor_hold', 'posHold?'], { ...LIFT, values: [2, 3, 4, 5] }), F('Yin', ['ygYinHips', 'ygYinSpine', 'ygRest?'], YIN)] },
    },
  },
  {
    id: 'stamina-intervals', ...SOLO, name: 'Stamina Intervals', subject: 'Endurance & control', minutes: [24, 29], levers: [null, 'reps', 'reps'],
    split: 'Tabata & core / EMOM & pelvic floor', blurb: 'Intervals for a long fuck: hard bursts, short rests, and core and pelvic floor so you keep control inside her.',
    about: 'Heart and lungs for a long fuck. A Tabata of hip drive and burpee-type work one day, a long EMOM the next, each followed by core and pelvic-floor work done while you\'re still breathing hard, which is exactly when control matters with your cock in her. Both later levels add reps.',
    names: ['Sprint', 'Interval', 'Burst', 'Recover', 'Go Again', 'Twenty On', 'Ten Off', 'Every Minute', 'Heartbeat', 'Pulse', 'Racing', 'Breathless', 'Catch Your Breath', 'Hold On', 'Keep Up', 'Stay With Me', 'Final Round', 'Last Push', 'Done', 'Not Done'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabata & core', short: 'Tabata', blocks: [T('Tabata', ['hiit', 'thrustBw'], { ...COND, values: [1, 2, 3] }), C('Core & control', ['coreHollow', 'pelvic', 'coreAnti'], { ...CORE, values: [2, 3] })] },
      emom: { label: 'EMOM & pelvic floor', short: 'EMOM', blocks: [E('Stamina EMOM', ['thrust', 'cardio', 'kbBallistic', 'hiit'], { ...COND, values: [8, 10, 12] }), C('Control', ['pelvic_floor_hold', 'pelvic', 'coreRot'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'slow-and-steady', ...SOLO, name: 'Slow and Steady', subject: 'Endurance & control', minutes: [30, 35], levers: [null, 'tempo', 'reps'],
    split: 'Slow lower / slow upper / breath flow', blurb: 'Strength at a crawl, then a breathing flow: the patience to fuck her slowly and not speed up.',
    about: 'Three slow days, which is what a long, unhurried fuck takes. Lower body at a three-second tempo, upper body the same, and a breath-led flow day with pelvic-floor holds. Nothing is fast and nothing is rushed: the goal is to feel every rep and stay relaxed while you work, which is what control in bed actually is when you are inside her. Level II slows the tempo, Level III adds reps.',
    names: ['Tortoise', 'Easy Does It', 'Gently', 'Measured', 'Deliberate', 'Unhurried', 'Even Keel', 'Calm', 'Composed', 'Quiet', 'Deep Breath', 'Long Exhale', 'Low Gear', 'Cruise', 'Coast', 'Glide', 'Drift', 'Float', 'Still', 'Steady On'],
    cycle: ['lower', 'upper', 'flow'],
    dayTypes: {
      lower: { label: 'Slow lower', short: 'Lower', blocks: [S('Slow legs and hips', ['squat2', 'hinge2', 'thrust', 'adductor'], LIFT), C('Control', ['pelvic_floor_hold', 'pelvic'], { ...CORE, values: [2] })] },
      upper: { label: 'Slow upper', short: 'Upper', blocks: [S('Slow upper', ['push', 'row2', 'shoulders2', 'pushBw2?'], LIFT), C('Control', ['coreAnti', 'pelvic_floor_hold'], { ...CORE, values: [2] })] },
      flow: { label: 'Breath flow', short: 'Flow', absSlots: [], blocks: [C('Pelvic floor', ['pelvic_floor_hold', 'bridge_hold', 'dead_bug', 'pelvic'], { ...CORE_S, values: [3, 4] }), F('Breath flow', ['ygHips', 'ygBack', 'ygRest', 'ygYinHips', 'ygBack?', 'ygHips?', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'control-30', ...SOLO, days: 30, name: 'Control 30', subject: 'Endurance & control', minutes: [24, 29], levers: [null, 'reps', 'holds'],
    split: 'Drive / hold / breathe, 30 days', blurb: 'Thirty days to last longer with your cock in her: hip drive, long holds and breathing, harder every ten days.',
    about: 'A month on staying power, so you can keep fucking her. Three days turn: hip drive with a short conditioning finish, long holds with pelvic-floor work, and a breathing stretch. Every ten days the level goes up, more reps first and then longer holds, so by the end you\'re fitter and calmer under pressure with your cock in her.',
    names: ['Day One', 'Hold', 'Breathe', 'Drive', 'Steady', 'Slow', 'Strong', 'Calm', 'Longer', 'Day Ten', 'Deeper', 'Again', 'Still', 'Control', 'Patience', 'Stamina', 'Power', 'Easy', 'Endless', 'Day Thirty'],
    cycle: ['drive', 'hold', 'breathe'],
    dayTypes: {
      drive: { label: 'Drive', short: 'Drive', blocks: [S('Hip drive', ['thrust', 'kbBallistic', 'glute2'], LIFT), T('Finisher', ['hiit', 'thrustBw'], { ...COND, values: [1, 2] })] },
      hold: { label: 'Hold', short: 'Hold', blocks: [C('Holds', ['bridge_hold', 'posHold', 'posHold'], { ...LIFT, values: [2, 3, 4] }), C('Pelvic floor', ['pelvic_floor_hold', 'pelvic'], { ...CORE, values: [2, 3] })] },
      breathe: { label: 'Breathe', short: 'Breathe', absSlots: [], blocks: [C('Control', ['pelvic', 'coreHollow', 'pelvic_floor_hold', 'coreAnti?'], { ...CORE_S, values: [3, 4] }), F('Breathe', ['ygHips', 'ygYinHips', 'ygRest', 'ygBack?', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  // ---- Hip power & thrust (ticket 4) ----
  {
    id: 'thrust-master', ...SOLO, name: 'Thrust Master', subject: 'Hip power & thrust', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Heavy thrusts / thrust conditioning', blurb: 'Heavy hip thrusts and swings so you can pound her pussy, then intervals for the stamina to keep it up.',
    about: 'All about the hips that slam your cock into her. One day is heavy: hip thrusts, Romanian deadlifts and swings in straight sets, the glutes doing the work. The other turns the same movements into conditioning, thrust and swing intervals that keep the hips moving when the lungs want to stop. Level II asks for heavier weights, Level III adds reps.',
    names: ['Drive', 'Power', 'Piston', 'Pump', 'Hammer', 'Engine', 'Torque', 'Horsepower', 'Momentum', 'Impact', 'Force', 'Thrust', 'Launch', 'Lift Off', 'Full Throttle', 'Redline', 'Turbo', 'Overdrive', 'Top Gear', 'Master'],
    cycle: ['heavy', 'cond'],
    dayTypes: {
      heavy: { label: 'Heavy thrusts', short: 'Heavy', blocks: [S('Heavy hips', ['hip_thrust', 'hinge2', 'kb_swing', 'glute2?'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      cond: { label: 'Thrust conditioning', short: 'Cond', blocks: [C('Thrust circuit', ['thrust', 'kbBallistic', 'thrustBw', 'hiit'], { ...COND, values: [2, 3, 4, 5] }), C('Core', ['coreHollow', 'pelvic_floor_hold'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'pound-it', ...SOLO, name: 'Pound It', subject: 'Hip power & thrust', minutes: [24, 29], levers: [null, 'reps', 'reps'],
    split: 'Swing EMOM / thrust Tabata', blurb: 'Fast, hard hips for pounding her pussy: kettlebell swings every minute, thrust Tabatas, and a hip stretch after.',
    about: 'Speed and power from the hips, the kind you pound her pussy with. One day is a swing EMOM, a set of swings and a thrust at the top of every minute; the other is thrust and bridge-pulse Tabatas. Both end with a short hip-flexor stretch so the hips stay as loose as they are strong. Both later levels add reps.',
    names: ['Pound', 'Bang', 'Slam', 'Hammer Time', 'Pile Driver', 'Jackhammer', 'Drum', 'Beat', 'Rhythm', 'Tempo', 'Pulse', 'Throb', 'Knock', 'Rattle', 'Shake', 'Bounce', 'Rock', 'Roll', 'Grind', 'Pound Again'],
    cycle: ['swing', 'tabata'],
    dayTypes: {
      swing: { label: 'Swing EMOM', short: 'Swing', absSlots: [], blocks: [E('Swing EMOM', ['kbBallistic', 'thrust', 'kbBallistic', 'thrustBw'], { ...COND, values: [12, 14, 16] }), F('Hip stretch', ['fxHips', 'ygHips', 'ygRest?'], FLOW)] },
      tabata: { label: 'Thrust Tabata', short: 'Tabata', absSlots: [], blocks: [T('Thrust Tabata', ['thrustBw', 'hiit'], { ...COND, values: [2, 3] }), S('Glutes', ['hip_thrust', 'glute2'], LIFT), F('Hip stretch', ['fxHips', 'ygRest'], FLOW)] },
    },
  },
  {
    id: 'hip-drive-ladders', ...SOLO, name: 'Hip Drive Ladders', subject: 'Hip power & thrust', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Thrust ladders / single-leg power', blurb: 'Ladders of thrusts and swings, then single-leg hip work so you can drive your cock into her from either side.',
    about: 'Volume for the hips you fuck her with. Ladders climb from one rep to ten on hip thrusts and swings, so you do a lot of work without noticing; the other day trains each side alone with single-leg thrusts, step-ups and lunges, because no position keeps both hips square. Level II adds reps, Level III heavier weights.',
    names: ['First Rung', 'Climb', 'Step Up', 'Higher', 'Halfway', 'Summit', 'Back Down', 'Ladder Up', 'Ladder Down', 'One More', 'Ten', 'Left', 'Right', 'Both', 'Even', 'Square', 'Balanced', 'Level', 'Top Rung', 'View From Up Here'],
    cycle: ['ladder', 'single'],
    dayTypes: {
      ladder: { label: 'Thrust ladders', short: 'Ladder', blocks: [L('Thrust ladder', ['hip_thrust', 'kbBallistic'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2, 3] })] },
      single: { label: 'Single-leg power', short: 'Single', blocks: [S('Single-leg hips', ['single_leg_bridge', 'singleLeg', 'lunge2', 'hipGlute'], LIFT), T('Finisher', ['thrustBw', 'plyoLow'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'piston', ...SOLO, name: 'Piston', subject: 'Hip power & thrust', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Bodyweight thrust circuit / hip plyos, then stretch', blurb: 'No equipment, all hips: bridge circuits, jumps and a long hip-flexor stretch, so you can piston into her pussy.',
    about: 'Hip power for wherever you fuck her. A bodyweight circuit of bridge pulses, frog pumps and single-leg bridges one day; hip-driven jumps and plyometrics the next. Both end with a hip-flexor and glute stretch, because tight hip flexors steal drive. Level II adds reps, Level III moves on to harder variations.',
    names: ['Cylinder', 'Stroke', 'Compression', 'Ignition', 'Combustion', 'Exhaust', 'Rev', 'Idle', 'Spark', 'Firing', 'Pistons Pumping', 'Crank', 'Camshaft', 'Valve', 'Pressure', 'Release', 'Cycle', 'Revolution', 'Running Hot', 'Piston'],
    cycle: ['circuit', 'plyo'],
    dayTypes: {
      circuit: { label: 'Thrust circuit', short: 'Circuit', absSlots: [], blocks: [C('Thrust circuit', ['thrustBw', 'gluteReps', 'thrustBw', 'coreAnti'], { ...LIFT, values: [2, 3, 4] }), F('Hip stretch', ['fxHips', 'ygHips', 'fxQuad', 'ygRest?'], FLOW)] },
      plyo: { label: 'Hip plyos', short: 'Plyo', absSlots: [], blocks: [S('Hip plyos', ['plyoVert', 'plyoLow', 'thrustBw'], COND), F('Hip stretch', ['fxHips', 'fxQuad', 'ygRest'], FLOW)] },
    },
  },
  {
    id: 'thrust-30', ...SOLO, days: 30, name: 'Thrust 30', subject: 'Hip power & thrust', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Heavy / fast / single-leg, 30 days', blurb: 'Thirty days of hips built for fucking her: heavy thrusts, fast swings and single-leg drive, harder every ten days.',
    about: 'A month for the hips that work your cock into her. Three days turn: heavy hip thrusts and hinges, a fast swing-and-thrust EMOM, and single-leg work with a stretch after. Every ten days it gets harder, heavier weights first and then more reps.',
    names: ['Day One', 'Heavy', 'Fast', 'Single', 'Drive', 'Snap', 'Squeeze', 'Lockout', 'Hinge', 'Day Ten', 'Heavier', 'Faster', 'Stronger', 'Power', 'Speed', 'Balance', 'Grind', 'Explode', 'Finish', 'Day Thirty'],
    cycle: ['heavy', 'fast', 'single'],
    dayTypes: {
      heavy: { label: 'Heavy', short: 'Heavy', blocks: [S('Heavy hips', ['hip_thrust', 'hinge2', 'glute2'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      fast: { label: 'Fast', short: 'Fast', blocks: [E('Swing EMOM', ['kbBallistic', 'thrust', 'hiit'], { ...COND, values: [10, 12, 14] }), C('Core', ['coreHollow', 'pelvic_floor_hold'], { ...CORE, values: [2] })] },
      single: { label: 'Single-leg', short: 'Single', absSlots: [], blocks: [S('Single-leg', ['single_leg_bridge', 'singleLeg', 'hipGlute'], LIFT), F('Stretch', ['fxHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  // ---- Carry & hold (ticket 4): legs, grip and core to hold her up ----
  {
    id: 'hold-her-up', ...SOLO, name: 'Hold Her Up', subject: 'Carry & hold', minutes: [28, 33], levers: [null, 'weight', 'holds'],
    split: 'Carries & grip / legs & holds', blurb: 'Grip, legs and a strong back: the strength to hold her up on your cock and fuck her there longer than a minute.',
    about: 'For the standing fucks, her off the floor on your cock. One day is carries and grip, farmer carries, holds and dead hangs; the other is legs and holds, squats, wall sits and isometric holds at the angle you\'ll be holding her. Core work finishes both. Level II asks for heavier weights, Level III holds longer.',
    names: ['Pick Up', 'Lift', 'Hold', 'Carry', 'Strong Arms', 'Iron Grip', 'Steady Legs', 'Planted', 'Rooted', 'Pillar', 'Column', 'Atlas', 'Heavy Lifting', 'Load', 'Bear It', 'Hold Tight', 'Don\'t Let Go', 'Still Standing', 'Up Against', 'Put Her Down'],
    cycle: ['carry', 'legs'],
    dayTypes: {
      carry: { label: 'Carries & grip', short: 'Carry', blocks: [S('Carries & grip', ['carry', 'gripHold', 'row2', 'gripCurl'], LIFT), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [2] })] },
      legs: { label: 'Legs & holds', short: 'Legs', blocks: [S('Legs', ['squat2', 'lunge2'], LIFT), C('Holds', ['wall_sit', 'posHold', 'posHold'], { ...HOLDS, values: [2, 3] })] },
    },
  },
  {
    id: 'against-the-wall', ...SOLO, name: 'Against the Wall', subject: 'Carry & hold', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'reps'],
    split: 'Wall holds / leg circuit', blurb: 'Wall sits, holds and leg circuits: the legs for every fuck that pins her to a wall on your cock.',
    about: 'No equipment, just a wall, your legs, and her back against it while you fuck her. Wall sits, split-squat holds and calf-raise holds at the angles the standing positions use one day; a bodyweight leg circuit for endurance the other. Both finish with core work for a back that doesn\'t complain. Level II holds longer, Level III adds reps.',
    names: ['Wall', 'Brick', 'Plaster', 'Corner', 'Doorframe', 'Hallway', 'Shower Wall', 'Back to the Wall', 'Pinned', 'Leaning', 'Pressed', 'Braced', 'Squat Down', 'Hold Still', 'Thighs on Fire', 'Shaking', 'Hold It', 'Burning', 'Still Here', 'Down the Wall'],
    cycle: ['holds', 'circuit'],
    dayTypes: {
      holds: { label: 'Wall holds', short: 'Holds', blocks: [C('Wall holds', ['wall_sit', 'posHold', 'calf_raise_hold', 'posHold'], { ...LIFT, values: [2, 3, 4] }), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
      circuit: { label: 'Leg circuit', short: 'Circuit', blocks: [C('Leg circuit', ['legsBw2', 'posLegs', 'thrustBw', 'legsBw2'], { ...COND, values: [2, 3, 4] }), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'carry-me-home', ...SOLO, name: 'Carry Me Home', subject: 'Carry & hold', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Carry EMOM / pull & grip', blurb: 'Carries every minute, then rows, curls and grip: arms and back for carrying her to bed and fucking her.',
    about: 'Carrying her to the bed you are about to fuck her on is a whole-body job. A carry EMOM with squats and swings one day, the arms, back and grip the next: rows, curls, holds and hangs. Your forearms will know about it. Level II asks for heavier weights, Level III adds reps.',
    names: ['Front Door', 'Hallway', 'Stairs', 'Landing', 'Bedroom Door', 'Threshold', 'Over the Shoulder', 'Fireman\'s Carry', 'Bridal Carry', 'Piggyback', 'All the Way', 'Up the Stairs', 'No Lift', 'Strong Back', 'Big Arms', 'Grip Strength', 'Forearms', 'Biceps', 'Long Way Round', 'Home'],
    cycle: ['emom', 'pull'],
    dayTypes: {
      emom: { label: 'Carry EMOM', short: 'EMOM', blocks: [E('Carry EMOM', ['carry', 'squat2', 'kbBallistic', 'carry'], { ...COND, values: [10, 12] }), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [2] })] },
      pull: { label: 'Pull & grip', short: 'Pull', blocks: [S('Pull & grip', ['row2', 'biceps2', 'gripHold', 'gripCurl'], LIFT), C('Core', ['coreHollow', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'grip-it-tight', ...SOLO, name: 'Grip It Tight', subject: 'Carry & hold', minutes: [24, 29], levers: [null, 'holds', 'weight'],
    split: 'Grip & legs / holds & core', blurb: 'Grip and legs in supersets, then holds and core: hang onto her ass and keep your cock in her.',
    about: 'Grip and legs, for hanging on to her ass while you fuck standing. Supersets pair a squat with a carry and a lunge with a hold, so the hands work while the legs do; the other day is isometric holds and core, planks, wall sits and hangs. Hold her up and keep her there on your cock. Level II holds longer, Level III asks for heavier weights.',
    names: ['Squeeze', 'Clench', 'Clasp', 'Clutch', 'Grasp', 'Hang On', 'Locked', 'Vice', 'Clamp', 'White Knuckles', 'Tight', 'Tighter', 'Grip', 'Hold Fast', 'Never Let Go', 'Firm', 'Steady', 'Strong Hands', 'Holding On', 'Let Go'],
    cycle: ['super', 'holds'],
    dayTypes: {
      super: { label: 'Grip & legs', short: 'Super', blocks: [SS('Grip & legs', ['squat2', 'carry', 'lunge2', 'gripHold'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      holds: { label: 'Holds & core', short: 'Holds', blocks: [C('Holds', ['gripHold', 'posHold', 'climbHold', 'posHold'], { ...LIFT, values: [2, 3, 4] }), C('Core', ['coreHollow', 'coreAnti'], { ...CORE, values: [2, 3] })] },
    },
  },
  {
    id: 'stand-and-deliver-30', ...SOLO, days: 30, name: 'Stand and Deliver 30', subject: 'Carry & hold', minutes: [26, 31], levers: [null, 'weight', 'holds'],
    split: 'Carry / legs / holds, 30 days', blurb: 'Thirty days to the standing fucks: carries, legs and holds, harder every ten days, until you can keep her up.',
    about: 'A month of getting strong enough to hold her up and fuck her standing, her on your cock. Carries and grip, legs and lunges, and isometric holds turn in that order, each with core work. Every ten days it gets harder, heavier first and then longer holds, until a minute against the wall is easy.',
    names: ['Day One', 'Lift', 'Carry', 'Hold', 'Squat', 'Brace', 'Grip', 'Stand', 'Steady', 'Day Ten', 'Heavier', 'Longer', 'Stronger', 'Deeper', 'Higher', 'Firmer', 'Tighter', 'Taller', 'Deliver', 'Day Thirty'],
    cycle: ['carry', 'legs', 'holds'],
    dayTypes: {
      carry: { label: 'Carry', short: 'Carry', blocks: [S('Carry & grip', ['carry', 'gripHold', 'row2'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'lunge2', 'singleLeg'], LIFT), C('Core', ['coreRot', 'coreHollow'], { ...CORE, values: [2] })] },
      holds: { label: 'Holds', short: 'Holds', blocks: [C('Holds', ['wall_sit', 'posHold', 'gripHold', 'posHold'], { ...LIFT, values: [2, 3, 4] }), T('Finisher', ['hiit', 'posLegs'], { ...COND, values: [1] })] },
    },
  },
  // ---- Flexible & bendy (ticket 4): splits, hips, hamstrings, back bends, held long ----
  {
    id: 'bend-me-over', ...SOLO, name: 'Bend Me Over', subject: 'Flexible & bendy', minutes: [26, 31], levers: [null, 'holds', 'reps'],
    split: 'Hamstrings & hinge / forward fold flow', blurb: 'Hamstrings and hips so you can fold over her and stay there: hinges for strength, forward folds held long.',
    about: 'For folding at the hips over her, from behind, and keeping the angle without your hamstrings pulling you out. One day strengthens the hinge, Romanian deadlifts, good mornings and back extensions, then stretches the hamstrings; the other is a long forward-fold flow, pyramid, wide-leg fold and half splits, held until they let go. Level II holds longer, Level III adds reps.',
    names: ['Bend', 'Fold', 'Over', 'Further', 'Touch Your Toes', 'Palms Down', 'Ragdoll', 'Hang', 'Hinge', 'Deep Fold', 'Forward', 'Bow', 'Curtsy', 'Reach', 'Long Legs', 'Hamstrings', 'All the Way', 'Head to Knees', 'Flat Back', 'Bent Over'],
    cycle: ['hinge', 'fold'],
    dayTypes: {
      hinge: { label: 'Hamstrings & hinge', short: 'Hinge', absSlots: [], blocks: [S('Hinge', ['hinge2', 'backStrength', 'hinge2'], LIFT), F('Hamstrings', ['fxHam', 'fxHam', 'ygRest?'], FLOW_SCALED)] },
      fold: { label: 'Forward fold flow', short: 'Fold', absSlots: [], blocks: [C('Strong at the angle', ['hinge2', 'coreHollow', 'thrustBw'], { ...LIFT, values: [2] }), F('Fold flow', ['fxHam', 'fxStraddle', 'fxSplit', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'open-wide', ...SOLO, name: 'Open Wide', subject: 'Flexible & bendy', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Adductor strength / straddle flow', blurb: 'Inner thighs strong and open: Cossack squats and Copenhagen planks, then a straddle you can fuck from.',
    about: 'Wide is a strength as well as a stretch, and a wide stance while you fuck her needs both. One day builds your inner thighs with Cossack squats, Copenhagen planks and side-lying adductions, then opens them; the other is a long straddle, frog and butterfly flow. No equipment needed. Level II and III hold everything longer.',
    names: ['Wide', 'Wider', 'Open', 'Straddle', 'Frog', 'Butterfly', 'Pancake', 'Side Split', 'Spread', 'Stretch', 'Inner Thighs', 'Open Hips', 'Wide Open', 'Arms Wide', 'Legs Apart', 'Gate', 'Doors Open', 'Splay', 'Flat', 'Wide Awake'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Adductor strength', short: 'Strength', absSlots: [], blocks: [C('Adductors', ['cossack_squat', 'copenhagen_plank', 'adductorBw', 'adductorBw'], { ...LIFT, values: [2, 3] }), F('Open', ['fxStraddle', 'fxHips', 'ygRest?'], FLOW_SCALED)] },
      flow: { label: 'Straddle flow', short: 'Flow', absSlots: [], blocks: [C('Warm hips', ['adductorBw', 'mbHip', 'adductorBw?'], { ...LIFT, values: [2, 3] }), F('Straddle flow', ['fxStraddle', 'fxHips', 'fxStraddle', 'ygYinHips', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'arch-your-back', ...SOLO, name: 'Arch Your Back', subject: 'Flexible & bendy', minutes: [24, 29], levers: [null, 'holds', 'reps'],
    split: 'Back strength / backbend flow', blurb: 'A strong, bendy spine so you can arch over her: back extensions and bridges, then backbends held long.',
    about: 'For arching over her while you fuck, from doggy to a bridge. One day strengthens your back and glutes, supermans, bridges and back extensions; the other is a backbend flow, cobra, camel, bridge and wheel if you have it, with hip-flexor stretches that let your arch happen. Level II holds longer, Level III adds reps.',
    names: ['Arch', 'Curve', 'Bow', 'Cobra', 'Camel', 'Bridge', 'Wheel', 'Crescent', 'Swan', 'Cat', 'Cow', 'Sway', 'Spine', 'Bend Back', 'Open Chest', 'Heart Open', 'Lift', 'Rise', 'Arc', 'Arched'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Back strength', short: 'Strength', absSlots: [], blocks: [C('Back & glutes', ['backStrength', 'glute2', 'backBw', 'thrustBw'], { ...LIFT, values: [2, 3, 4] }), F('Open', ['ygBack', 'fxQuad', 'ygRest?'], FLOW)] },
      flow: { label: 'Backbend flow', short: 'Flow', absSlots: [], blocks: [C('Warm spine', ['backStrength', 'mbSpine'], { ...LIFT, values: [2] }), F('Backbend flow', ['ygBack', 'fxSpine', 'fxQuad', 'ygBack', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'do-the-splits', ...SOLO, name: 'Do the Splits', subject: 'Flexible & bendy', minutes: [26, 31], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Splits strength / splits flow', blurb: 'Front splits and side splits so you can drop your hips and get deeper, strong at the end range and held long.',
    about: 'Splits, both kinds, so your hips can drop close and you can still drive. One day builds strength at the end range, split-squat holds, Cossacks and active leg lifts, then stretches; the other is a long splits flow, lizard, half splits and the splits themselves, held long. Level II and III hold everything longer.',
    names: ['Split', 'Half Split', 'Lizard', 'Runner\'s Lunge', 'Pigeon', 'Hanuman', 'Side Split', 'Middle Split', 'Center', 'Slide', 'Lower', 'Floor', 'Almost There', 'Closer', 'Touchdown', 'Flat', 'Showgirl', 'Gymnast', 'Dancer', 'Splits'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Splits strength', short: 'Strength', absSlots: [], blocks: [C('End range', ['posLegs', 'adductorBw', 'hipFlex', 'mbHip'], { ...LIFT, values: [2, 3] }), F('Splits', ['fxSplit', 'fxHam', 'ygRest?'], FLOW_SCALED)] },
      flow: { label: 'Splits flow', short: 'Flow', absSlots: [], blocks: [C('Warm hips', ['hipFlex', 'mbHip'], { ...LIFT, values: [2] }), F('Splits flow', ['fxSplit', 'fxQuad', 'fxHam', 'fxStraddle', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'bendy-30', ...SOLO, days: 30, name: 'Bendy 30', subject: 'Flexible & bendy', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Hips / hamstrings / back, 30 days', blurb: 'Thirty days of range so you can fold, kneel and hold any angle: hips, hamstrings and back, longer every ten days.',
    about: 'A month of range, so you can get into whichever angle the fuck asks and stay comfortable. Hips, hamstrings and back turn day by day, each with a short strength circuit at the angle it opens, then a long flow. Every ten days every hold gets longer.',
    names: ['Day One', 'Hips', 'Hamstrings', 'Back', 'Open', 'Fold', 'Arch', 'Twist', 'Reach', 'Day Ten', 'Deeper', 'Further', 'Wider', 'Lower', 'Longer', 'Softer', 'Looser', 'Freer', 'Bendy', 'Day Thirty'],
    cycle: ['hips', 'ham', 'back'],
    dayTypes: {
      hips: { label: 'Hips', short: 'Hips', absSlots: [], blocks: [C('Strong hips', ['adductorBw', 'hipFlex', 'mbHip'], { ...LIFT, values: [2] }), F('Hip flow', ['fxHips', 'fxStraddle', 'ygYinHips', 'ygRest?'], FLOW_SCALED)] },
      ham: { label: 'Hamstrings', short: 'Ham', absSlots: [], blocks: [C('Strong hinge', ['thrustBw', 'backStrength', 'coreHollow'], { ...LIFT, values: [2] }), F('Hamstring flow', ['fxHam', 'fxSplit', 'fxHam', 'ygRest?'], FLOW_SCALED)] },
      back: { label: 'Back', short: 'Back', absSlots: [], blocks: [C('Strong back', ['backStrength', 'backBw', 'thrustBw?'], { ...LIFT, values: [2, 3] }), F('Back flow', ['ygBack', 'fxSpine', 'fxQuad', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  // ---- Strip & show-off (ticket 5): a pump before a date, short and sweaty ----
  {
    id: 'pump-before-the-date', ...SOLO, name: 'Pump Before the Date', subject: 'Strip & show-off', minutes: [22, 26], levers: [null, 'reps', 'weight'],
    split: 'Upper pump / arms & abs', blurb: 'Twenty minutes before you go out: chest, shoulders and arms full of blood, abs lit, a body built to fuck her in.',
    about: 'A pump, not a workout to recover from, so you look worth her hands and her mouth when your clothes come off. Supersets of presses, flies, raises and curls with short rests fill the muscles that show, and a fast abs finisher tightens the middle. Do it an hour before the date, shower, and walk in looking your best. Level II adds reps, Level III asks for heavier weights.',
    names: ['Getting Ready', 'Shower After', 'Cologne', 'Good Shirt', 'Mirror Check', 'Pumped', 'Filled Out', 'Veins', 'Sleeves Tight', 'Buttons Strain', 'Fresh', 'Sharp', 'Dressed Up', 'Out the Door', 'Fashionably Late', 'Walk In', 'Heads Turn', 'Looking Good', 'Feeling Good', 'Showtime'],
    cycle: ['upper', 'arms'],
    dayTypes: {
      upper: { label: 'Upper pump', short: 'Upper', blocks: [SS('Upper pump', ['chest2', 'shoulders2', 'chestIso', 'shoulderRaise'], LIFT), T('Abs finisher', ['coreHollow', 'hiit'], { ...COND, values: [1] })] },
      arms: { label: 'Arms & abs', short: 'Arms', blocks: [SS('Arm pump', ['biceps2', 'triceps2', 'biceps2', 'triceps2'], LIFT), T('Abs finisher', ['coreRot', 'hiit'], { ...COND, values: [1] })] },
    },
  },
  {
    id: 'striptease-pump', ...SOLO, name: 'Striptease Pump', subject: 'Strip & show-off', minutes: [21, 25], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Push-up pump / core & glutes', blurb: 'No equipment, maximum show: push-up pumps, glute pumps and abs, for when the clothes come off and you fuck her.',
    about: 'A bodyweight pump for anywhere you might strip and fuck her, a hotel room included. One day is push-up variations in a circuit until the chest and arms are full; the other is glutes and abs, bridges, frog pumps and hollow holds. Short, sweaty and ready for her to take the rest off. Level II adds reps, Level III moves to harder variations.',
    names: ['Lights Down', 'Music On', 'Slow Song', 'First Button', 'Shirt Off', 'Belt', 'Shoes', 'Socks', 'Down to Briefs', 'Spotlight', 'Stage', 'Pole', 'Chair', 'Hips', 'Shimmy', 'Grind', 'Tease', 'Reveal', 'Encore', 'Curtain'],
    cycle: ['push', 'core'],
    dayTypes: {
      push: { label: 'Push-up pump', short: 'Push', blocks: [C('Push-up pump', ['chestBw', 'armsBw', 'chestBw', 'shoulderBw'], { ...LIFT, values: [2, 3, 4] }), T('Abs', ['coreHollow', 'hiit'], { ...COND, values: [1, 2] })] },
      core: { label: 'Core & glutes', short: 'Core', blocks: [C('Glute pump', ['thrustBw', 'gluteReps', 'thrustBw'], { ...LIFT, values: [2] }), T('Abs', ['coreRot', 'coreHollow'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'show-off', ...SOLO, name: 'Show Off', subject: 'Strip & show-off', minutes: [24, 29], levers: [null, 'weight', 'reps'],
    split: 'Shoulders & arms / chest & back', blurb: 'Shoulders, arms, chest and back in quick supersets: the muscles that look good naked in a doorway.',
    about: 'For a V-shape and arms that fill a sleeve, and look better naked when she undresses you. Shoulders and arms one day, chest and back the next, all in supersets so it\'s over fast, and a short abs block to finish. Nothing heavy enough to leave you sore for the evening. Level II asks for heavier weights, Level III adds reps.',
    names: ['Doorway', 'Silhouette', 'Shoulders Back', 'Chest Out', 'Wide', 'Tall', 'Broad', 'Strut', 'Swagger', 'Peacock', 'Flex', 'Pose', 'Look at Me', 'Spotlight', 'Center Stage', 'Main Character', 'Showstopper', 'Head Turner', 'Eye Candy', 'Show Off'],
    cycle: ['shoulders', 'chest'],
    dayTypes: {
      shoulders: { label: 'Shoulders & arms', short: 'Shoulders', blocks: [SS('Shoulders & arms', ['shoulders2', 'biceps2', 'shoulderRaise', 'triceps2'], LIFT), C('Abs', ['coreHollow', 'coreRot'], { ...CORE, values: [2] })] },
      chest: { label: 'Chest & back', short: 'Chest', blocks: [SS('Chest & back', ['chest2', 'row2', 'chestIso', 'backRear'], LIFT), C('Abs', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'abs-on-show', ...SOLO, name: 'Abs on Show', subject: 'Strip & show-off', minutes: [20, 24], levers: [null, 'reps', 'reps'],
    split: 'Abs & chest / abs & arms', blurb: 'Abs first, every time, then a quick chest or arm pump: the middle she licks first, just above your cock.',
    about: 'Built around the abs, because they\'re what she licks first when the shirt comes off, right above your cock. Every day opens with a weighted and bodyweight abs circuit, then a quick pump of chest or arms in an EMOM. Level II and III add reps.',
    names: ['Six', 'Eight', 'Washboard', 'Ridges', 'Obliques', 'V-Lines', 'Belly', 'Waist', 'Lean', 'Tight', 'Carved', 'Etched', 'Cut', 'Crunch Time', 'Core', 'Center', 'Midriff', 'Show Them', 'Abs Out', 'On Show'],
    cycle: ['chest', 'arms'],
    dayTypes: {
      chest: { label: 'Abs & chest', short: 'Chest', blocks: [C('Abs', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [1, 2] }), E('Chest pump', ['chest2', 'chestBw'], { ...LIFT, values: [6, 8] })] },
      arms: { label: 'Abs & arms', short: 'Arms', blocks: [C('Abs', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [1, 2] }), E('Arm pump', ['biceps2', 'triceps2'], { ...LIFT, values: [6, 8] })] },
    },
  },
  {
    id: 'date-night-pump-30', ...SOLO, days: 30, name: 'Date Night Pump 30', subject: 'Strip & show-off', minutes: [22, 26], levers: [null, 'reps', 'weight'],
    split: 'Chest & shoulders / arms / abs & glutes, 30 days', blurb: 'Thirty short pumps: chest and shoulders, arms, abs and glutes, so you look ready to fuck her.',
    about: 'A month of pre-date pumps for a body you want her hands and her mouth on. Chest and shoulders, arms, then abs and glutes turn day by day, each twenty minutes of supersets and a finisher. Every ten days the level goes up, more reps and then heavier weights.',
    names: ['Day One', 'Chest', 'Arms', 'Abs', 'Glutes', 'Shoulders', 'Pump', 'Fill', 'Flex', 'Day Ten', 'Bigger', 'Fuller', 'Harder', 'Leaner', 'Sharper', 'Tighter', 'Broader', 'Stronger', 'Ready', 'Day Thirty'],
    cycle: ['chest', 'arms', 'abs'],
    dayTypes: {
      chest: { label: 'Chest & shoulders', short: 'Chest', blocks: [SS('Chest & shoulders', ['chest2', 'shoulders2', 'chestIso', 'shoulderRaise'], LIFT), T('Finisher', ['hiit', 'coreHollow'], { ...COND, values: [1] })] },
      arms: { label: 'Arms', short: 'Arms', blocks: [SS('Arms', ['biceps2', 'triceps2', 'biceps2', 'triceps2'], LIFT), T('Finisher', ['hiit', 'coreRot'], { ...COND, values: [1] })] },
      abs: { label: 'Abs & glutes', short: 'Abs', blocks: [S('Glutes', ['hip_thrust', 'glute2'], LIFT), C('Abs', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [1, 2] })] },
    },
  },
  // ---- Her pleasure (ticket 5): neck, jaw and forearm endurance, kneeling comfort, hip flexors ----
  {
    id: 'all-about-her', ...SOLO, name: 'All About Her', subject: 'Her pleasure', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'reps'],
    split: 'Neck & forearms / kneeling comfort', blurb: 'Endurance for eating her out: neck and forearms that don\'t quit, and knees and hips happy to kneel at her pussy.',
    about: 'For giving her your mouth and hands, not for your own cock. One day builds endurance in the neck, upper back and forearms, the muscles that give out first when you\'re going down on her or using your fingers on her clit. The other makes kneeling comfortable: hip-flexor, quad and knee mobility with a strong core. Level II holds longer, Level III adds reps.',
    names: ['Ladies First', 'Her Turn', 'Patience', 'Attention', 'Detail', 'Slow Hands', 'Gentle', 'Listen', 'Follow Her Lead', 'Take Your Time', 'No Rush', 'Generous', 'Devotion', 'Worship', 'On Your Knees', 'Down There', 'Encore for Her', 'Twice', 'Thank You', 'Her Favorite'],
    cycle: ['neck', 'kneel'],
    dayTypes: {
      neck: { label: 'Neck & forearms', short: 'Neck', blocks: [C('Neck & upper back', ['neck', 'trapsBw', 'neck', 'trapsBw'], { ...LIFT, values: [2, 3] }), C('Arms & core', ['armsBw', 'coreAnti', 'armsBw'], { ...HOLDS, values: [2, 3] })] },
      kneel: { label: 'Kneeling comfort', short: 'Kneel', absSlots: [], blocks: [C('Strong knees & hips', ['legsBw2', 'hipFlex', 'posLegs'], { ...LIFT, values: [2, 3] }), F('Kneel easy', ['fxQuad', 'fxHips', 'ygHips', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'going-down', ...SOLO, name: 'Going Down', subject: 'Her pleasure', minutes: [22, 26], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Neck endurance / hips & quads open', blurb: 'Neck endurance and open hips, so your mouth can stay on her pussy as long as she wants it there.',
    about: 'Named for eating her out. Neck holds in every direction and chin tucks build the endurance to stay down there, mouth on her pussy, without strain; upper-back work keeps the shoulders from creeping up. The other day opens the hip flexors and quads so kneeling at the edge of the bed is comfortable for a long time. Both later levels hold longer.',
    names: ['Head Down', 'Chin Up', 'Steady', 'Hold Still', 'Stay There', 'Eyes Up', 'Long Neck', 'Relax the Jaw', 'Breathe Through the Nose', 'Rhythm', 'Patience', 'Persistence', 'Dedication', 'All Night', 'Endurance', 'Steady Pace', 'Don\'t Stop', 'Right There', 'Almost', 'There'],
    cycle: ['neck', 'hips'],
    dayTypes: {
      neck: { label: 'Neck endurance', short: 'Neck', blocks: [C('Neck holds', ['neckReps', 'neck', 'neck', 'neck'], { ...LIFT, values: [2, 3] }), C('Upper back', ['trapsBw', 'backBw'], { ...HOLDS, values: [2, 3] })] },
      hips: { label: 'Hips & quads open', short: 'Hips', absSlots: [], blocks: [C('Strong hips', ['hipFlex', 'thrustBw', 'hipFlex'], { ...LIFT, values: [2, 3] }), F('Kneeling flow', ['fxQuad', 'ygHips', 'fxQuad', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'fingers-and-forearms', ...SOLO, name: 'Fingers and Forearms', subject: 'Her pleasure', minutes: [23, 27], levers: [null, 'reps', 'holds'],
    split: 'Forearm endurance / wrists & core', blurb: 'Forearms, wrists and grip that keep going: fingers that don\'t cramp while they\'re in her pussy.',
    about: 'Your hands are a big part of fucking her. Wrist curls, reverse curls, holds and carries build forearm endurance one day; the other strengthens the wrists through their whole range with core work alongside, so nothing cramps or aches halfway through having your fingers in her pussy. Level II adds reps, Level III holds longer.',
    names: ['Fingertips', 'Light Touch', 'Firm Touch', 'Circles', 'Slow Circles', 'Pressure', 'Rhythm', 'Wrist', 'Forearm', 'Grip', 'Hold', 'Squeeze', 'Release', 'Steady Hand', 'Quick Hands', 'Skilled', 'Magic Fingers', 'Handy', 'Hands On', 'Hand It to You'],
    cycle: ['forearms', 'wrists'],
    dayTypes: {
      forearms: { label: 'Forearm endurance', short: 'Forearms', blocks: [S('Forearms', ['gripCurl', 'gripHold', 'gripCurl', 'carry?'], LIFT), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [1, 2] })] },
      wrists: { label: 'Wrists & core', short: 'Wrists', blocks: [C('Wrists & grip', ['gripCurl', 'gripHold', 'gripPull'], { ...LIFT, values: [2, 3] }), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'ladies-first', ...SOLO, name: 'Ladies First', subject: 'Her pleasure', minutes: [26, 31], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Neck & core / hips & knees / hands & back', blurb: 'Everything it takes to put her pussy first: neck, hands, knees and hips, so your cock waits its turn.',
    about: 'The whole kit for giving, mouth and fingers on her pussy before your cock goes in. Neck and core one day, hips and knees for kneeling the next, hands and upper back the third. No equipment, mostly holds and controlled reps, and a flow on the hip day. Level II adds reps, Level III holds longer.',
    names: ['After You', 'Please', 'Your Way', 'As You Like', 'Say When', 'More?', 'Slower', 'Faster', 'Harder', 'Softer', 'Right There', 'Don\'t Stop', 'Again', 'Your Turn Again', 'Whatever You Want', 'Generous', 'Attentive', 'Gentleman', 'Ladies First', 'Then Me'],
    cycle: ['neck', 'hips', 'hands'],
    dayTypes: {
      neck: { label: 'Neck & core', short: 'Neck', blocks: [C('Neck', ['neckReps', 'neck', 'neck', 'trapsBw?'], { ...LIFT, values: [2, 3, 4] }), C('Core', ['coreAnti', 'coreHollow', 'pelvic'], { ...CORE, values: [2, 3] })] },
      hips: { label: 'Hips & knees', short: 'Hips', absSlots: [], blocks: [C('Hips & knees', ['hipFlex', 'legsBw2', 'posLegs', 'hipFlex?'], { ...LIFT, values: [2, 3, 4] }), F('Hips open', ['fxQuad', 'fxHips', 'ygHips', 'ygRest?'], FLOW_SCALED)] },
      hands: { label: 'Hands & back', short: 'Hands', blocks: [C('Upper back', ['trapsBw', 'backBw', 'trapsBw'], { ...LIFT, values: [2, 3] }), C('Hands & core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'her-pleasure-30', ...SOLO, days: 30, name: 'Her Pleasure 30', subject: 'Her pleasure', minutes: [22, 26], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Neck / hips / core, 30 days', blurb: 'Thirty days of getting better with your mouth and hands on her pussy: neck, hips and core, longer holds.',
    about: 'A month for her benefit, aimed at her clit and her pussy, your mouth and fingers. Neck and upper back, hips and kneeling comfort, and core with pelvic-floor control turn day by day. Every ten days it gets harder, more reps first and then longer holds.',
    names: ['Day One', 'Kiss', 'Neck', 'Hips', 'Knees', 'Hands', 'Breath', 'Pace', 'Patience', 'Day Ten', 'Longer', 'Slower', 'Deeper', 'Softer', 'Steadier', 'Closer', 'Better', 'Best', 'Hers', 'Day Thirty'],
    cycle: ['neck', 'hips', 'core'],
    dayTypes: {
      neck: { label: 'Neck', short: 'Neck', blocks: [C('Neck', ['neckReps', 'neck', 'neck'], { ...LIFT, values: [2, 3] }), C('Upper back', ['trapsBw', 'backBw'], { ...HOLDS, values: [1, 2] })] },
      hips: { label: 'Hips', short: 'Hips', absSlots: [], blocks: [C('Strong hips', ['hipFlex', 'thrustBw', 'posLegs'], { ...LIFT, values: [2, 3] }), F('Hips open', ['fxQuad', 'fxHips', 'ygRest?'], FLOW_SCALED)] },
      core: { label: 'Core', short: 'Core', blocks: [C('Core & control', ['coreHollow', 'pelvic', 'coreAnti', 'pelvic'], { ...CORE, values: [2, 3] }), T('Finisher', ['thrustBw', 'hiit'], { ...COND, values: [1] })] },
    },
  },
  // ---- Quickie (ticket 5): 15 to 20 minutes, intense ----
  {
    id: 'quickie', ...SOLO, name: 'Quickie', subject: 'Quickie', minutes: [16, 20], levers: [null, 'reps', 'reps'],
    split: 'Tabata & strength / EMOM', blurb: 'In and out in under twenty minutes: a Tabata and a strength block, or one fast EMOM, like a quick fuck.',
    about: 'For days with no time, trained like a quick fuck: in, hard, done. One day pairs a Tabata with a short strength circuit; the other is a single EMOM that works the whole body. Under twenty minutes, done. Both later levels add reps.',
    names: ['Quick', 'Fast', 'Brief', 'Short', 'Snappy', 'Hurry', 'Rush', 'Dash', 'Blitz', 'Flash', 'Zip', 'Zoom', 'Express', 'Instant', 'Rapid', 'Speedy', 'Swift', 'On the Clock', 'Ten to Go', 'Done'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabata & strength', short: 'Tabata', absSlots: [], blocks: [T('Tabata', ['hiit', 'thrustBw'], { ...COND, values: [1, 2, 3] }), C('Strength', ['squat2', 'push', 'hinge2?'], { ...LIFT, values: [2, 3, 4] })] },
      emom: { label: 'EMOM', short: 'EMOM', absSlots: [], blocks: [E('EMOM', ['kbBallistic', 'push', 'squat2', 'coreAnti'], { ...COND, values: [10, 12, 14, 16] }), C('Core', ['coreHollow', 'coreRot?'], { ...CORE, values: [1, 2, 3] })] },
    },
  },
  {
    id: 'wham-bam', ...SOLO, name: 'Wham Bam', subject: 'Quickie', minutes: [16, 20], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Bodyweight blast / hip blast', blurb: 'No equipment and no warm-up chat: a bodyweight blast, then you\'re done, thank you ma\'am.',
    about: 'Bodyweight only, over as fast as a wham-bam fuck. A full-body circuit as fast as you can move one day, a hip and glute blast the other, each with a quick Tabata. Level II adds reps, Level III moves to harder variations.',
    names: ['Wham', 'Bam', 'Thank You', 'Ma\'am', 'Slam', 'Bang', 'Pow', 'Boom', 'Crash', 'Smash', 'Whack', 'Thud', 'Kapow', 'Zap', 'Pop', 'Snap', 'Crackle', 'Sizzle', 'Fizz', 'Done Already'],
    cycle: ['blast', 'hips'],
    dayTypes: {
      blast: { label: 'Bodyweight blast', short: 'Blast', absSlots: [], blocks: [C('Blast', ['legsBw2', 'pushBw2', 'hiit', 'coreAnti'], { ...COND, values: [1, 2, 3] }), C('Strength', ['legsBw2', 'pushBw2'], { ...LIFT, values: [1, 2] })] },
      hips: { label: 'Hip blast', short: 'Hips', absSlots: [], blocks: [T('Hip Tabata', ['thrustBw', 'hiit'], { ...COND, values: [1, 2] }), C('Glutes', ['thrustBw', 'gluteReps'], { ...LIFT, values: [1, 2, 3] })] },
    },
  },
  {
    id: 'nooner', ...SOLO, name: 'Nooner', subject: 'Quickie', minutes: [18, 22], levers: [null, 'reps', 'weight'],
    split: 'AMRAP & core / strength & finisher', blurb: 'A lunchtime quickie: an AMRAP or a strength block, a finisher, and back at your desk by one.',
    about: 'Midday, quick, and dirty enough to leave you half hard thinking about her. An AMRAP of swings, presses and squats with a core finisher one day; a short strength superset with a Tabata after the other. Back to work with a grin. Level II adds reps, Level III asks for heavier weights.',
    names: ['Noon', 'Lunch Hour', 'Midday', 'Twelve Sharp', 'High Noon', 'Siesta', 'Long Lunch', 'Back by One', 'Desk Break', 'Quick Bite', 'Out to Lunch', 'Meeting', 'Busy', 'Do Not Disturb', 'Lunch Date', 'Afternoon Delight', 'Sneak Out', 'Back Soon', 'Grinning', 'Nooner'],
    cycle: ['amrap', 'strength'],
    dayTypes: {
      amrap: { label: 'AMRAP & core', short: 'AMRAP', absSlots: [], blocks: [A('AMRAP', ['kbBallistic', 'push', 'squat2'], { ...COND, values: [8, 10, 12, 14] }), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [1, 2, 3] })] },
      strength: { label: 'Strength & finisher', short: 'Strength', absSlots: [], blocks: [SS('Strength', ['squat2', 'push', 'hinge2', 'row2'], LIFT), T('Finisher', ['hiit', 'thrustBw'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'hot-and-fast', ...SOLO, name: 'Hot and Fast', subject: 'Quickie', minutes: [16, 20], levers: [null, 'reps', 'reps'],
    split: 'Hot circuit / fast EMOM', blurb: 'Hot circuits and fast EMOMs, under twenty minutes, and you finish drenched like you just fucked her.',
    about: 'Fast and hard, like the quick fuck it is named for. A hot circuit of swings, burpees and squats one day; a quick EMOM of swings and presses with a Tabata after the next. A minute of core to close. Both later levels add reps.',
    names: ['Hot', 'Hotter', 'Fast', 'Faster', 'Fire', 'Blaze', 'Scorch', 'Sizzle', 'Steam', 'Sweat', 'Drench', 'Pour', 'Flood', 'Boil', 'Fever', 'Heatwave', 'Sauna', 'Furnace', 'Inferno', 'Cool Off'],
    cycle: ['circuit', 'ladder'],
    dayTypes: {
      circuit: { label: 'Hot circuit', short: 'Circuit', absSlots: [], blocks: [C('Hot circuit', ['kbBallistic', 'hiit', 'squat2', 'push?'], { ...COND, values: [2, 3, 4, 5] }), C('Core', ['coreHollow', 'coreRot?'], { ...CORE, values: [1, 2, 3] })] },
      ladder: { label: 'Fast EMOM', short: 'EMOM', absSlots: [], blocks: [E('Fast EMOM', ['kbBallistic', 'push'], { ...LIFT, values: [8, 10, 12] }), T('Finisher', ['hiit', 'thrustBw'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'quickie-30', ...SOLO, days: 30, name: 'Quickie 30', subject: 'Quickie', minutes: [16, 20], levers: [null, 'reps', 'weight'],
    split: 'Tabata / EMOM / AMRAP, 30 days', blurb: 'Thirty quick ones: Tabata, EMOM and AMRAP in turn, each under twenty minutes and none of them polite.',
    about: 'A month of quickies, short and filthy, the way a fast fuck with her is. Tabata, EMOM and AMRAP days turn, each with a short second block so every session mixes kinds of work. Under twenty minutes a day, harder every ten days.',
    names: ['Day One', 'Quick', 'Fast', 'Sharp', 'Snap', 'Flash', 'Dash', 'Zip', 'Blitz', 'Day Ten', 'Quicker', 'Faster', 'Sharper', 'Snappier', 'Hotter', 'Harder', 'Sweatier', 'Fitter', 'Done', 'Day Thirty'],
    cycle: ['tabata', 'emom', 'amrap'],
    dayTypes: {
      tabata: { label: 'Tabata', short: 'Tabata', absSlots: [], blocks: [T('Tabata', ['hiit', 'thrustBw'], { ...COND, values: [1, 2] }), C('Strength', ['squat2', 'push'], { ...LIFT, values: [1, 2, 3] })] },
      emom: { label: 'EMOM', short: 'EMOM', absSlots: [], blocks: [E('EMOM', ['kbBallistic', 'push', 'squat2'], { ...COND, values: [10, 12, 14] }), C('Core', ['coreHollow', 'coreRot'], { ...CORE, values: [1, 2, 3] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', absSlots: [], blocks: [A('AMRAP', ['kbBallistic', 'squat2', 'push'], { ...COND, values: [10, 12, 14] }), C('Core', ['coreAnti', 'coreHollow?'], { ...CORE, values: [1, 2, 3] })] },
    },
  },
  // ---- Back & knees care (ticket 5): the joints that positions load ----
  {
    id: 'no-bad-backs', ...SOLO, name: 'No Bad Backs', subject: 'Back & knees care', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Back strength / back flow', blurb: 'A lower back that can thrust, carry her and arch all night: McGill basics, glutes, and a gentle back flow.',
    about: 'Thrusting your cock into her, carrying her and arching all load the lower back. One day builds it the way physios do, bird dogs, curl-ups, side planks and bridges, with the glutes doing their share; the other moves the spine gently through every direction. Level II adds reps, Level III holds longer.',
    names: ['Spine', 'Lumbar', 'Brace', 'Bird Dog', 'Curl-up', 'Side Plank', 'Bridge', 'Neutral', 'Long Back', 'Straight Up', 'Supported', 'Solid', 'Stable', 'Steady', 'Pain-free', 'Ready', 'Resilient', 'Robust', 'Bulletproof', 'Good Back'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Back strength', short: 'Strength', blocks: [C('Back strength', ['backStrength', 'backStrength', 'thrustBw', 'backStrength'], { ...LIFT, values: [2, 3] }), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      flow: { label: 'Back flow', short: 'Flow', absSlots: [], blocks: [C('Back & glutes', ['backStrength', 'thrustBw', 'backStrength'], { ...LIFT, values: [2, 3] }), F('Back flow', ['backMove', 'backMove', 'backMove', 'backMove', 'ygRest', 'backMove?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'kneel-easy', ...SOLO, name: 'Kneel Easy', subject: 'Back & knees care', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Knee strength / knee & hip mobility', blurb: 'Knees that can kneel and squat all night: strength around the knee, and the mobility to eat her pussy.',
    about: 'Knees take a beating in the kneeling positions, eating her out or fucking her down low. One day strengthens everything around them, slow squats, split-squat holds, tibialis raises and step-downs; the other loosens the hips and ankles above and below, so the knee isn\'t doing their job. Level II adds reps, Level III holds longer.',
    names: ['Kneecap', 'Patella', 'Quad', 'Shin', 'Ankle', 'Hip', 'Bend', 'Straighten', 'Squat Low', 'Kneel', 'Cushion', 'Pillow', 'Soft Landing', 'Steady', 'Strong', 'Supple', 'Smooth', 'Easy', 'No Creak', 'Good Knees'],
    cycle: ['strength', 'mobility'],
    dayTypes: {
      strength: { label: 'Knee strength', short: 'Strength', blocks: [C('Knee strength', ['legsBw2', 'shin', 'posLegs', 'legsBw2'], { ...LIFT, values: [2, 3] }), C('Holds', ['posHold', 'posHold'], { ...HOLDS, values: [2] })] },
      mobility: { label: 'Knee & hip mobility', short: 'Mobility', absSlots: [], blocks: [C('Ankles & hips', ['shin', 'mbHip', 'legsBw2', 'shin?'], { ...LIFT, values: [2, 3] }), F('Hips & quads', ['fxQuad', 'fxHips', 'ygHips', 'fxQuad?', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'strong-wrists', ...SOLO, name: 'Strong Wrists', subject: 'Back & knees care', minutes: [22, 26], levers: [null, 'reps', 'holds'],
    split: 'Wrists & forearms / shoulders & upper back', blurb: 'Wrists, shoulders and upper back for every fuck where you hold yourself up on your hands over her.',
    about: 'Missionary, doggy and the wheelbarrow all put weight through your hands while you fuck her. One day strengthens the wrists and forearms through their range; the other builds shoulder health and upper-back strength with a short mobility flow. Level II adds reps, Level III holds longer.',
    names: ['Wrist', 'Palm', 'Fingers', 'Forearm', 'Elbow', 'Shoulder', 'Scapula', 'Rotator', 'Upper Back', 'Posture', 'Support', 'Plank Ready', 'Hands Down', 'Weight Bearing', 'Steady Arms', 'Locked Out', 'Strong Base', 'Pillars', 'Holding Up', 'Good Wrists'],
    cycle: ['wrists', 'shoulders'],
    dayTypes: {
      wrists: { label: 'Wrists & forearms', short: 'Wrists', blocks: [S('Wrists & forearms', ['gripCurl', 'gripHold', 'gripCurl?'], LIFT), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
      shoulders: { label: 'Shoulders & upper back', short: 'Shoulders', absSlots: [], blocks: [C('Shoulder health', ['shoulderHealth', 'backRear', 'shoulderHealth', 'backRear?'], { ...LIFT, values: [2, 3, 4] }), F('Shoulder mobility', ['mbShoulder', 'fxUpper', 'mbShoulder', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'the-morning-after', ...SOLO, name: 'The Morning After', subject: 'Back & knees care', minutes: [20, 24], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Gentle strength / gentle flow', blurb: 'For the morning after a long night of fucking her: gentle strength and a slow flow that puts you back together.',
    about: 'Recovery, not training, after a long night of fucking her. Gentle glute, core and back work wakes things up one day; a slow flow through the hips, back and shoulders puts them back where they belong the next. Nothing hard, everything helpful. Level II and III hold longer.',
    names: ['Sunrise', 'Coffee', 'Stretch', 'Yawn', 'Slow Start', 'Easy Morning', 'Lazy Sunday', 'Bed Head', 'Sore', 'Stiff', 'Loosen', 'Unwind', 'Undo', 'Reset', 'Restore', 'Recover', 'Refresh', 'Better', 'Ready Again', 'Tonight?'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Gentle strength', short: 'Strength', absSlots: [], blocks: [C('Gentle strength', ['gentleStrength', 'backStrength', 'gentleStrength', 'backStrength?'], { ...LIFT, values: [2, 3] }), F('Stretch', ['backMove', 'ygHips', 'backMove', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      flow: { label: 'Gentle flow', short: 'Flow', absSlots: [], blocks: [C('Wake up', ['gentleBalance', 'backStrength', 'gentleStrength?'], { ...LIFT, values: [2, 3] }), F('Morning flow', ['backMove', 'ygHips', 'mbShoulder', 'ygBack', 'ygRest', 'backMove?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'back-and-knees-30', ...SOLO, days: 30, name: 'Back & Knees 30', subject: 'Back & knees care', minutes: [22, 26], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Back / knees / wrists & shoulders, 30 days', blurb: 'Thirty days for the joints a hard fuck loads: back, knees, wrists and shoulders, so you can keep going.',
    about: 'A month of looking after yourself, because fucking her is hard on a body. Back, knees, and wrists with shoulders turn day by day, each with strength work and something gentle after. Every ten days it gets harder, reps first and then longer holds.',
    names: ['Day One', 'Back', 'Knees', 'Wrists', 'Hips', 'Shoulders', 'Ankles', 'Spine', 'Brace', 'Day Ten', 'Stronger', 'Steadier', 'Looser', 'Easier', 'Smoother', 'Sturdier', 'Supple', 'Sound', 'Ready', 'Day Thirty'],
    cycle: ['back', 'knees', 'wrists'],
    dayTypes: {
      back: { label: 'Back', short: 'Back', absSlots: [], blocks: [C('Back strength', ['backStrength', 'backStrength', 'thrustBw', 'backStrength?'], { ...LIFT, values: [2, 3, 4] }), F('Back flow', ['backMove', 'backMove', 'backMove', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      knees: { label: 'Knees', short: 'Knees', absSlots: [], blocks: [C('Knee strength', ['legsBw2', 'shin', 'posLegs'], { ...LIFT, values: [2, 3] }), F('Hips & quads', ['fxQuad', 'fxHips', 'ygRest?'], FLOW_SCALED)] },
      wrists: { label: 'Wrists & shoulders', short: 'Wrists', blocks: [C('Shoulders & upper back', ['shoulderBw', 'trapsBw', 'backBw'], { ...LIFT, values: [2, 3] }), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
    },
  },
  // ---- Date night warm-up (ticket 6, couple): a short partner stretch and tease, 15 to 20 minutes ----
  {
    id: 'pre-game', ...COUPLE, name: 'Pre-Game', subject: 'Date night warm-up', minutes: [16, 20], levers: [null, 'reps', 'holds'],
    split: 'Partner warm-up / tease', blurb: 'Before you two go out: a quick partner warm-up and a tease that leaves you both wanting a fuck all evening.',
    about: 'Twenty minutes before the date, to get you hard and her wet. A short partner circuit to get the blood moving, squats holding hands and high-five push-ups, then a tease that\'s meant to stay unfinished: a slow dance and a dare. You two go out warm and come home in a hurry to fuck. Level II adds reps, Level III holds the tease longer.',
    names: ['Kick-off', 'Warm-up', 'Pre-Drinks', 'Getting Ready', 'Mirror', 'Lipstick', 'Cologne', 'Taxi\'s Here', 'Five Minutes', 'Coat On', 'Not Now', 'Later', 'Hold That Thought', 'To Be Continued', 'Promise', 'Rain Check', 'Tonight', 'Can\'t Wait', 'Hurry Home', 'Kick-on'],
    cycle: ['circuit', 'stretch'],
    dayTypes: {
      circuit: { label: 'Partner warm-up', short: 'Warm-up', absSlots: [], blocks: [C('Partner warm-up', ['partnerLower', 'partnerUpper', 'partnerCore'], { ...LIFT, values: [2, 3, 4] }), F('Tease', ['slow_dance', 'dare'], TEASE)] },
      stretch: { label: 'Stretch and tease', short: 'Stretch', absSlots: [], blocks: [F('Stretch together', ['fxHips', 'ygHips', 'fxHam', 'ygRest?'], FLOW), F('Tease', ['kiss_squat', 'dare_whisper', 'slow_dance?'], { ...TEASE, family: 'Strength' })] },
    },
  },
  {
    id: 'before-we-go-out', ...COUPLE, name: 'Before We Go Out', subject: 'Date night warm-up', minutes: [16, 20], levers: [null, 'reps', 'holds'],
    split: 'Kiss reps / dares', blurb: 'Kiss squats and kiss push-ups, a dare you two must not finish, and out the door flushed and horny.',
    about: 'A warm-up that leaves your mouths busy and the fuck for later. Kiss squats and kiss push-ups for a few rounds, then a dare drawn by the timer that you two are not allowed to finish until you get home. Short, sweet and a little cruel. Level II adds reps, Level III holds longer.',
    names: ['Lipstick Mark', 'Collar', 'Flushed', 'Rosy', 'Glowing', 'Breathless', 'Late Again', 'Worth It', 'Keys', 'Wallet', 'Phone', 'Door', 'Lift', 'Street', 'Cab', 'Restaurant', 'Bar', 'Dance Floor', 'Home Early', 'Finally'],
    cycle: ['kiss', 'dares'],
    dayTypes: {
      kiss: { label: 'Kiss reps', short: 'Kiss', absSlots: [], blocks: [C('Kiss circuit', ['kiss_squat', 'kiss_pushup', 'partnerCore?'], { ...LIFT, values: [2, 3, 4] }), F('Tease', ['slow_dance', 'dare_neck'], TEASE)] },
      dares: { label: 'Dares', short: 'Dares', absSlots: [], blocks: [C('Partner circuit', ['partnerLower', 'partnerUpper', 'partnerCore?'], { ...LIFT, values: [2, 3, 4] }), F('Dares', ['dare', 'dare', 'slow_dance?'], TEASE)] },
    },
  },
  {
    id: 'appetizer', ...COUPLE, name: 'Appetizer', subject: 'Date night warm-up', minutes: [15, 19], levers: [null, 'reps', 'holds'],
    split: 'Partner Tabata / slow dance', blurb: 'A taste of the fuck coming later: a quick partner Tabata, then a slow dance that leaves you two aching.',
    about: 'Small and spicy, foreplay for the fuck later, you hard and her wet. A partner Tabata, side by side, twenty seconds on and ten off, then a slow dance and a massage to bring the heart rate down and the mood up. Level II adds reps, Level III holds longer.',
    names: ['Amuse-Bouche', 'Starter', 'Bite', 'Nibble', 'Taste', 'Sample', 'Morsel', 'Tapas', 'Canapé', 'Oysters', 'Champagne', 'Olives', 'Bread', 'Small Plate', 'Sharing', 'Tasting Menu', 'Second Course', 'Palate', 'Appetite', 'Main Course Later'],
    cycle: ['tabata', 'dance'],
    dayTypes: {
      tabata: { label: 'Partner Tabata', short: 'Tabata', absSlots: [], blocks: [T('Partner Tabata', ['partnerLower', 'partnerUpper'], { ...LIFT, values: [1, 2] }), F('Tease', ['slow_dance', 'back_massage'], TEASE)] },
      dance: { label: 'Slow dance', short: 'Dance', absSlots: [], blocks: [C('Partner holds', ['partnerHold', 'partnerLower', 'partnerCore?'], { ...LIFT, values: [2, 3, 4] }), F('Slow', ['slow_dance', 'dare_no_hands'], TEASE)] },
    },
  },
  {
    id: 'warm-me-up', ...COUPLE, name: 'Warm Me Up', subject: 'Date night warm-up', minutes: [16, 20], levers: [null, 'holds', 'holds'],
    split: 'Stretch together / massage', blurb: 'A partner stretch and a hands-on massage: warm, loose, and horny before anybody has fucked.',
    about: 'The gentle one, hands on skin, and nobody has fucked yet. Stretch side by side through the hips and hamstrings, then trade a massage, back one day and legs the next, with a dare to close. Nothing sweaty, everything warm. Both later levels hold longer.',
    names: ['Cold Hands', 'Warm Hands', 'Rub', 'Knead', 'Loosen', 'Soften', 'Melt', 'Thaw', 'Heat', 'Glow', 'Toasty', 'Cosy', 'Blanket', 'Fireplace', 'Candle', 'Bath', 'Steam', 'Ember', 'Kindle', 'Warmed Up'],
    cycle: ['back', 'legs'],
    dayTypes: {
      back: { label: 'Stretch and back massage', short: 'Back', absSlots: [], blocks: [F('Stretch together', ['ygBack', 'fxHips', 'ygRest', 'fxHam?'], FLOW_SCALED), F('Massage', ['back_massage', 'dare_neck'], { ...TEASE, family: 'Strength' })] },
      legs: { label: 'Stretch and leg massage', short: 'Legs', absSlots: [], blocks: [F('Stretch together', ['fxHam', 'fxHips', 'ygRest', 'fxQuad?'], FLOW_SCALED), F('Massage', ['leg_massage', 'dare_touch'], { ...TEASE, family: 'Strength' })] },
    },
  },
  {
    id: 'date-night-warm-up-30', ...COUPLE, days: 30, name: 'Date Night Warm-up 30', subject: 'Date night warm-up', minutes: [16, 20], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit / stretch / kiss, 30 days', blurb: 'Thirty date nights started dirty: a quick partner warm-up and a tease you two are not allowed to finish.',
    about: 'A month of warm-ups to leave you two horny. A partner circuit, a partner stretch and kiss reps turn day by day, each ending in a tease left unfinished on purpose. Every ten days it gets harder, more reps and then longer holds.',
    names: ['Day One', 'Date', 'Dinner', 'Drinks', 'Dancing', 'Movie', 'Walk', 'Picnic', 'Gallery', 'Day Ten', 'Concert', 'Show', 'Party', 'Wedding', 'Weekend Away', 'Hotel', 'Room Service', 'Late Checkout', 'Anniversary', 'Day Thirty'],
    cycle: ['circuit', 'stretch', 'kiss'],
    dayTypes: {
      circuit: { label: 'Partner circuit', short: 'Circuit', absSlots: [], blocks: [C('Partner circuit', ['partnerLower', 'partnerUpper', 'partnerCore'], { ...LIFT, values: [2, 3, 4] }), F('Tease', ['slow_dance', 'dare'], TEASE)] },
      stretch: { label: 'Partner stretch', short: 'Stretch', absSlots: [], blocks: [F('Stretch together', ['fxHips', 'fxHam', 'ygRest?'], FLOW), F('Tease', ['dare', 'slow_dance?'], { ...TEASE, family: 'Strength' })] },
      kiss: { label: 'Kiss reps', short: 'Kiss', absSlots: [], blocks: [C('Kiss circuit', ['kiss_squat', 'kiss_pushup'], { ...LIFT, values: [2, 3, 4] }), F('Tease', ['dare_neck', 'slow_dance'], TEASE)] },
    },
  },
  // ---- Positions tour (ticket 6, couple): 30 one-off days, each a position and a way to prepare for it ----
  tour('floor-tour-30', 'Positions Tour: Floor', 'Ten positions on the bed, each prepared three ways: strength, range and stamina, then you two fuck in them.',
    'Thirty different days, and on every one of them you two fuck on the bed. Each day takes one of ten floor positions and prepares for it one of three ways: the strength it asks for, the range it needs, or the stamina to keep it going. Then you do it, for real, your cock in her pussy, and a couple more after. No day repeats. Every ten days the holds get longer.',
    ['pos_missionary', 'pos_legs_up', 'pos_cowgirl', 'pos_reverse_cowgirl', 'pos_doggy', 'pos_spooning', 'pos_lotus', 'pos_prone', 'pos_pretzel', 'pos_69'], ['strong', 'open', 'stamina']),
  tour('standing-tour-30', 'Positions Tour: Standing', 'The five standing positions, each prepared six ways over thirty days, then you two fuck in them on your feet.',
    'Thirty days on your feet, fucking her standing. The standing positions, from behind, the carry, the edge of the bed, the wheelbarrow and the butterfly, each prepared six ways: strength, range, stamina, grip and holds, legs, and core. Then you fuck her in them. No day repeats. Every ten days the holds get longer.',
    ['pos_standing_behind', 'pos_standing_carry', 'pos_edge_of_bed', 'pos_wheelbarrow', 'pos_butterfly'], ['strong', 'open', 'stamina', 'grip', 'legs', 'core']),
  tour('bendy-tour-30', 'Positions Tour: Bendy', 'The positions that ask for your range, each prepared five ways over thirty days, then you fuck her in them.',
    'Thirty days for the fucks that ask your hips, hamstrings and back for range. Legs over shoulders, the pretzel, the butterfly, the lotus, the wheelbarrow and standing from behind: each is prepared five ways, mostly about your range, then you fuck her in them. No day repeats. Every ten days the holds get longer.',
    ['pos_legs_up', 'pos_pretzel', 'pos_butterfly', 'pos_lotus', 'pos_wheelbarrow', 'pos_standing_behind'], ['open', 'strong', 'core', 'legs', 'stamina']),
  tour('strong-tour-30', 'Positions Tour: Strong', 'The positions that take strength to fuck in, each built five ways over thirty days.',
    'Thirty days for the fucks that take strength to hold. The standing carry, the wheelbarrow, missionary, cowgirl, reverse cowgirl and doggy: each is built five ways, strength, grip and holds, legs, core and stamina, then you fuck her in them. No day repeats. Every ten days the holds get longer.',
    ['pos_standing_carry', 'pos_wheelbarrow', 'pos_missionary', 'pos_cowgirl', 'pos_reverse_cowgirl', 'pos_doggy'], ['strong', 'grip', 'legs', 'core', 'stamina']),
  tour('grand-tour-30', 'The Grand Tour', 'Fifteen positions, each prepared two ways: thirty days of fucking together, and never the same night twice.',
    'The whole menu, and you fuck her in a different position every night. Fifteen positions from missionary to the wheelbarrow, each prepared two ways, its strength and its range, over thirty days, then you fuck her in them, your cock in her, with a couple more after. No day repeats. Every ten days the holds get longer.',
    ['pos_missionary', 'pos_legs_up', 'pos_cowgirl', 'pos_reverse_cowgirl', 'pos_doggy', 'pos_standing_behind', 'pos_spooning', 'pos_lotus', 'pos_standing_carry', 'pos_edge_of_bed', 'pos_wheelbarrow', 'pos_prone', 'pos_butterfly', 'pos_pretzel', 'pos_69'], ['strong', 'open']),
  // ---- Morning glory / Sunday (ticket 6, couple): slow and long, stretch, partner work, positions ----
  {
    id: 'morning-glory', ...COUPLE, name: 'Morning Glory', subject: 'Morning glory / Sunday', minutes: [40, 48], levers: [null, 'holds', 'holds'],
    split: 'Wake-up flow, partner work, slow positions', blurb: 'A slow weekend morning: a wake-up stretch, easy partner work, a massage, then slow fucking in bed together.',
    about: 'For mornings with nowhere to be but in bed fucking, slow and deep. A wake-up flow side by side in bed, easy partner work to get the blood moving, a massage and a slow dance, then the slow positions, spooning, lotus, missionary, held long with you inside her. Coffee after. Both later levels hold longer.',
    names: ['Sunrise', 'Alarm Off', 'Snooze', 'Five More Minutes', 'Bed Head', 'Morning Breath', 'Coffee Later', 'Sunlight', 'Curtains Closed', 'Lazy', 'Slow', 'Warm Sheets', 'Spoon', 'Stretch', 'Yawn', 'Good Morning', 'Breakfast Later', 'Brunch', 'Afternoon Already', 'Morning Glory'],
    cycle: ['wake', 'easy'],
    dayTypes: {
      wake: { label: 'Wake up slow', short: 'Wake', absSlots: [], blocks: [F('Wake-up flow', ['ygHips', 'ygBack', 'fxHips', 'ygRest', 'ygRest?'], FLOW), S('Easy partner work', ['partnerLower', 'partnerCore'], LIFT), F('Massage', ['back_massage', 'slow_dance'], TEASE), F('Positions', ['positionsSlow', 'positionsSlow', 'positionsSlow?'], POS)] },
      easy: { label: 'Easy morning', short: 'Easy', absSlots: [], blocks: [F('Wake-up flow', ['ygBack', 'fxHam', 'ygHips', 'ygRest', 'ygRest?'], FLOW), C('Partner holds', ['partner_bridge', 'partnerHold', 'partnerCore?'], { ...LIFT, values: [2, 3, 4] }), F('Massage', ['leg_massage', 'dare_neck'], TEASE), F('Positions', ['positionsBed', 'positionsSlow', 'positionsSlow?'], POS)] },
    },
  },
  {
    id: 'lazy-sunday', ...COUPLE, name: 'Lazy Sunday', subject: 'Morning glory / Sunday', minutes: [45, 55], levers: [null, 'holds', 'holds'],
    split: 'Long stretch, partner holds, long positions', blurb: 'The longest, slowest one: a long stretch, partner holds, a massage each, then positions held while you two fuck.',
    about: 'Sunday, the whole morning, spent loosening up and then fucking slowly, you inside her. A long stretch flow, partner holds that take their time, a massage for each of you, then a long block of slow positions. Fifty minutes that don\'t feel like exercise. Both later levels hold longer.',
    names: ['Sunday', 'No Plans', 'Pyjamas', 'Newspaper', 'Croissants', 'Pancakes', 'Rain Outside', 'Duvet Day', 'Slow Jams', 'Long Bath', 'Nap', 'Second Nap', 'Late Lunch', 'Afternoon', 'Golden Hour', 'Sunday Best', 'Sunday Roast', 'Sunday Night', 'Monday Tomorrow', 'Lazy'],
    cycle: ['long', 'longer'],
    dayTypes: {
      long: { label: 'Long and slow', short: 'Long', absSlots: [], blocks: [F('Long stretch', ['ygHips', 'ygBack', 'fxHips', 'fxHam', 'ygRest', 'ygRest?'], FLOW_SCALED), C('Partner holds', ['partnerHold', 'partner_bridge', 'partnerHold'], { ...LIFT, values: [2, 3] }), F('Massage', ['back_massage', 'leg_massage'], TEASE), F('Positions', ['positionsSlow', 'positionsSlow', 'positionsBed', 'positionsBed?'], POS)] },
      longer: { label: 'Longer', short: 'Longer', absSlots: [], blocks: [F('Long stretch', ['ygYinHips', 'ygBack', 'fxStraddle', 'ygRest', 'ygRest?'], FLOW_SCALED), S('Partner strength', ['partnerLower', 'partnerUpper'], LIFT), F('Massage', ['leg_massage', 'slow_dance'], TEASE), F('Positions', ['positionsBed', 'positionsSlow', 'positionsBed', 'positionsBed?'], POS)] },
    },
  },
  {
    id: 'breakfast-in-bed', ...COUPLE, name: 'Breakfast in Bed', subject: 'Morning glory / Sunday', minutes: [40, 48], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, tease, her on top', blurb: 'Work up an appetite: a partner circuit, a long tease, then cowgirl before breakfast, your cock in her.',
    about: 'A livelier morning: get sweaty, then she sits on your cock before breakfast. A partner circuit to wake up properly, a stretch, a long tease with dares, then positions where she is on top, cowgirl, reverse and lotus, your cock in her. Breakfast after, in bed. Level II adds reps, Level III holds longer.',
    names: ['Toast', 'Butter', 'Jam', 'Honey', 'Eggs', 'Bacon', 'Coffee', 'Orange Juice', 'Tray', 'Crumbs', 'Sticky Fingers', 'Syrup', 'Whipped Cream', 'Strawberries', 'Second Helping', 'Seconds', 'Full', 'Satisfied', 'Brunch', 'Breakfast in Bed'],
    cycle: ['circuit', 'stretch'],
    dayTypes: {
      circuit: { label: 'Circuit and on top', short: 'Circuit', absSlots: [], blocks: [C('Partner circuit', ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold?'], { ...LIFT, values: [3, 4, 5] }), F('Stretch', ['fxHips', 'ygRest'], FLOW), F('Tease', ['dare', 'dare', 'slow_dance'], TEASE), F('Positions', ['positionsHer', 'positionsHer', 'positionsHer?'], POS)] },
      stretch: { label: 'Stretch and on top', short: 'Stretch', absSlots: [], blocks: [F('Stretch', ['ygHips', 'fxHips', 'fxQuad', 'ygRest'], FLOW), S('Partner legs', ['partnerLower', 'partnerLower'], LIFT), F('Tease', ['dare_lap_dance', 'back_massage'], TEASE), F('Positions', ['positionsHer', 'positionsHer', 'positionsHer?'], POS)] },
    },
  },
  {
    id: 'sleep-in', ...COUPLE, name: 'Sleep In', subject: 'Morning glory / Sunday', minutes: [40, 48], levers: [null, 'holds', 'holds'],
    split: 'Bed stretch, massage, slow positions', blurb: 'Never leave the bed: stretch, massage and a slow fuck, all of it under the covers together.',
    about: 'Everything here happens in bed, under the covers, and it ends with your cock in her. A gentle stretch lying down, partner bridges and core, a long massage, and the positions that suit a lazy morning, spooning, lying flat, missionary. Both later levels hold longer.',
    names: ['Stay', 'Don\'t Get Up', 'Under Covers', 'Pillow Fort', 'Blanket', 'Cocoon', 'Nest', 'Burrow', 'Hibernate', 'Snuggle', 'Cuddle', 'Spoon', 'Big Spoon', 'Little Spoon', 'Tangle', 'Warm', 'Drowsy', 'Dozing', 'Half Awake', 'Sleep In'],
    cycle: ['stretch', 'massage'],
    dayTypes: {
      stretch: { label: 'Bed stretch', short: 'Stretch', absSlots: [], blocks: [F('Bed stretch', ['ygHips', 'ygBack', 'ygYinHips', 'ygRest', 'ygRest?'], FLOW), C('In bed', ['partner_bridge', 'partnerCore', 'partnerHold?'], { ...LIFT, values: [2, 3, 4] }), F('Massage', ['back_massage', 'dare_eyes_closed'], TEASE), F('Positions', ['positionsSlow', 'positionsSlow', 'positionsSlow?'], POS)] },
      massage: { label: 'Long massage', short: 'Massage', absSlots: [], blocks: [F('Bed stretch', ['ygBack', 'fxHam', 'ygRest', 'ygRest?'], FLOW), C('In bed', ['partner_bridge', 'partner_situp'], { ...LIFT, values: [2, 3] }), F('Massage', ['back_massage', 'leg_massage', 'dare_touch'], TEASE), F('Positions', ['positionsSlow', 'positionsBed', 'positionsSlow?'], POS)] },
    },
  },
  {
    id: 'morning-glory-30', ...COUPLE, days: 30, name: 'Morning Glory 30', subject: 'Morning glory / Sunday', minutes: [40, 48], levers: [null, 'reps', 'holds'],
    split: 'Slow / lively / lazy, 30 days', blurb: 'Thirty slow mornings: a stretch, partner work, a tease and positions you two fuck in, longer every ten days.',
    about: 'A month of mornings, or weekends if that\'s more realistic, with a fuck before anyone gets dressed. Slow, lively and lazy mornings turn, each with a stretch, partner work, a tease and a block of positions to match, you inside her. Every ten days it gets harder, more reps and then longer holds.',
    names: ['Day One', 'Dawn', 'Daybreak', 'First Light', 'Sunup', 'Morning', 'Rise', 'Shine', 'Stir', 'Day Ten', 'Wake', 'Linger', 'Laze', 'Lounge', 'Loll', 'Bask', 'Rest', 'Doze', 'Glory', 'Day Thirty'],
    cycle: ['slow', 'lively', 'lazy'],
    dayTypes: {
      slow: { label: 'Slow morning', short: 'Slow', absSlots: [], blocks: [F('Wake-up flow', ['ygHips', 'ygBack', 'ygRest', 'ygRest?'], FLOW), C('Partner holds', ['partner_bridge', 'partnerHold', 'partnerCore?'], { ...LIFT, values: [2, 3, 4] }), F('Massage', ['back_massage', 'slow_dance'], TEASE), F('Positions', ['positionsSlow', 'positionsSlow', 'positionsSlow?'], POS)] },
      lively: { label: 'Lively morning', short: 'Lively', absSlots: [], blocks: [F('Stretch', ['fxHips', 'ygRest'], FLOW), C('Partner circuit', ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold?'], { ...LIFT, values: [3, 4, 5] }), F('Tease', ['dare', 'dare'], TEASE), F('Positions', ['positions', 'positions', 'positions', 'positions?'], POS)] },
      lazy: { label: 'Lazy morning', short: 'Lazy', absSlots: [], blocks: [F('Bed stretch', ['ygYinHips', 'ygBack', 'ygRest?'], FLOW_SCALED), C('In bed', ['partner_bridge', 'partnerCore', 'partnerHold?'], { ...LIFT, values: [2, 3, 4] }), F('Massage', ['leg_massage', 'dare_neck'], TEASE), F('Positions', ['positionsBed', 'positionsSlow', 'positionsBed?'], POS)] },
    },
  },
  // ---- Explicit (Phase 20 ticket 8): 7 gym-then-sex, 7 sex-then-sex, 6 positions-only. Catalogue 11 alongside catalogue 10. ----
  {
    id: 'set-then-fuck', ...EXPLICIT, name: 'Set Then Fuck', subject: 'Explicit', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit or strength, then positions', blurb: 'You train with her first, a partner circuit, then you lay her down and fuck her through the positions.',
    about: 'One day you run a partner circuit with her, squats and push-ups and core, and the next day the strength sets are slower. Then you put her on her back, turn her over, or stand her up and fuck her, your cock in her pussy, one position after another. You stay in the hold long enough to feel it. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['First Set', 'Her on the Mat', 'After Reps', 'On Her Back', 'Her Legs Up', 'From Behind', 'Standing Fuck', 'Deep Hold', 'Second Set', 'Sweat on Her', 'Kiss the Rep', 'Spread Her', 'Long Stroke', 'Her Hips', 'Pin the Hold', 'Last Set', 'Cock In', 'Slow Grind', 'Her Thighs', 'Bed After'],
    cycle: ['circuit', 'strength'],
    dayTypes: {
      circuit: gymThenSex('Circuit, then fuck', 'Circuit', C('Partner circuit', GYM_WORK, { ...LIFT, values: [3, 4, 5, 6] }), GYM_POS, { pref: 2 }),
      strength: gymThenSex('Strength, then fuck', 'Strength', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), GYM_POS_B, { pref: 2 }),
    },
  },
  {
    id: 'sweat-then-spread', ...EXPLICIT, name: 'Sweat Then Spread', subject: 'Explicit', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner strength or circuit, then positions', blurb: 'Partner strength until the sweat starts, then you spread her open and fuck her in long holds.',
    about: 'You get the sweat on first. Partner strength one day and a circuit the next, then you spread her thighs and fuck her with your cock buried. Her legs stay where you put them, on your shoulders or open on the bed, and you hold there instead of racing the stroke. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat', 'Open Her', 'Thighs Wide', 'Hold It', 'Buried', 'Her Knees', 'Work First', 'Spread', 'Long Fuck', 'Dripping', 'Hips Up', 'Stay Deep', 'Second Round', 'Her Calves', 'Press In', 'Slow Spread', 'After Sweat', 'Wide', 'In Her', 'Last Hold'],
    cycle: ['strength', 'circuit'],
    dayTypes: {
      strength: gymThenSex('Strength, then spread', 'Strength', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), GYM_POS, { pref: 2 }),
      circuit: gymThenSex('Circuit, then spread', 'Circuit', C('Partner circuit', GYM_WORK, { ...LIFT, values: [3, 4, 5, 6] }), GYM_POS_B, { pref: 2 }),
    },
  },
  {
    id: 'earn-the-pussy', ...EXPLICIT, name: 'Earn the Pussy', subject: 'Explicit', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Hard partner work, then positions', blurb: 'You do the hard partner work beside her, then you get your cock in her pussy and keep it there.',
    about: 'You pay for her pussy with the work. You squat, push and carry beside her until the set is done, then you get your cock in her and you keep it there. You move her through one position after another instead of rushing the hold, her cunt around you the whole time. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Earn It', 'Pay For It', 'In Her Pussy', 'Keep It', 'Hard Set', 'After the Carry', 'Yours', 'Deep Enough', 'Worked For', 'Stay In', 'Her Pussy', 'No Rush', 'Long Enough', 'Taken', 'Held Open', 'The Price', 'Cock Deep', 'Still In', 'Last Rep', 'Kept'],
    cycle: ['circuit', 'carry'],
    dayTypes: {
      circuit: gymThenSex('Work, then her pussy', 'Work', C('Partner circuit', GYM_WORK, { ...LIFT, values: [3, 4, 5, 6] }), GYM_POS, { pref: 2 }),
      carry: gymThenSex('Carry, then her pussy', 'Carry', S('Carries and holds', GYM_LIFT, { ...LIFT, values: [2, 3, 4, 5] }), GYM_POS_B, { pref: 2 }),
    },
  },
  {
    id: 'lift-her-then-fuck', ...EXPLICIT, name: 'Lift Her Then Fuck', subject: 'Explicit', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries and holds, then positions', blurb: 'You squat, carry and hold her, then you fuck her standing and on the bed, her legs where you put them.',
    about: 'You spend the first part picking her up. Carries, holds and squats, her weight on you, and then you fuck her standing with her legs around your waist. On the bed her calves go on your shoulders, your cock in her, and you stay in the hold you put her in. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Her', 'On Your Hip', 'Carry', 'Hold Her Up', 'Then Fuck', 'Standing', 'Her Legs', 'Waist', 'Bed', 'Shoulders', 'Picked Up', 'Still Holding', 'Deep Stand', 'Her Weight', 'Put Her Down', 'Fuck Her There', 'Arms Full', 'Up', 'Down on the Bed', 'Last Carry'],
    cycle: ['carry', 'circuit'],
    dayTypes: {
      carry: gymThenSex('Lift, then fuck', 'Lift', C('Carries', GYM_LIFT, { ...LIFT, values: [3, 4, 5, 6] }), GYM_POS, { pref: 2 }),
      circuit: gymThenSex('Circuit, then fuck', 'Circuit', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), GYM_POS_B, { pref: 2 }),
    },
  },
  {
    id: 'grind-after-reps', ...EXPLICIT, name: 'Grind After Reps', subject: 'Explicit', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats and pushes, then positions', blurb: 'Kiss squats and partner pushes first, then a slow grind with your cock buried in her pussy.',
    about: 'Kiss squats and partner pushes start you close enough that you are already hard. Then you grind with your cock buried in her pussy, slow circles from your hips, not a race. One day leans on the kissing circuit and the other on strength sets, and both end with you inside her. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Kiss Squat', 'Then Grind', 'Buried', 'Slow Hip', 'After the Push', 'In Her', 'Close', 'Grind', 'Her Mouth Near', 'Reps Done', 'Stay Buried', 'Circle', 'Deep Grind', 'Hands on Her', 'Long One', 'No Rush', 'Hips', 'Second Grind', 'Still Hard', 'Last Kiss'],
    cycle: ['kiss', 'strength'],
    dayTypes: {
      kiss: gymThenSex('Kiss the reps, then grind', 'Kiss', C('Kiss circuit', GYM_KISS, { ...LIFT, values: [3, 4, 5, 6] }), GYM_POS, { pref: 2 }),
      strength: gymThenSex('Strength, then grind', 'Strength', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), GYM_POS_B, { pref: 2 }),
    },
  },
  {
    id: 'short-and-dirty', ...EXPLICIT, name: 'Short and Dirty', subject: 'Explicit', minutes: [22, 30], levers: [null, 'reps', 'holds'],
    split: 'Short partner blast, then a short positions block', blurb: 'A short partner blast, then you bend her over and fuck her before either of you has cooled off.',
    about: 'A short partner blast, not a full workout, and then you bend her over while you are both still warm. You fuck her before either of you cools off, your cock in her pussy or her ass, fewer positions and shorter holds. It stays a short session on purpose. Level II adds reps to the partner work. Level III holds every position a little longer.',
    names: ['Short', 'Dirty', 'Bend Her', 'Quick Fuck', 'Still Warm', 'From Behind', 'No Cool-Down', 'Fast and Deep', 'Her Ass', 'Two Blocks', 'Blast', 'In Her', 'Before You Cool', 'Short Hold', 'Over', 'Hard and Brief', 'Sweat Left', 'Now', 'Deep Enough', 'Done Dirty'],
    cycle: ['blast', 'push'],
    dayTypes: {
      blast: gymThenSex('Short blast, then fuck', 'Blast', C('Short circuit', ['partnerLower', 'partnerUpper', 'partnerCore'], { ...LIFT, values: [2, 3, 4], pref: 3 }), GYM_SHORT_POS, { values: [1, 2, 3], pref: 1 }),
      push: gymThenSex('Short strength, then fuck', 'Push', S('Short strength', ['partnerLower', 'partnerHold', 'partnerUpper'], { ...LIFT, values: [2, 3, 4], pref: 3 }), GYM_SHORT_POS, { values: [1, 2, 3], pref: 1 }),
    },
  },
  {
    id: 'long-afternoon', ...EXPLICIT, name: 'Long Afternoon', subject: 'Explicit', minutes: [46, 54], levers: [null, 'reps', 'holds'],
    split: 'Long partner workout, then a long positions block', blurb: 'A long partner workout together, then you fuck her through position after position for the rest of the afternoon.',
    about: 'This one takes the afternoon. A long partner workout together, rounds enough to matter, then you fuck her through position after position. You stay in each hold, on her back, from behind and standing, your cock in her until the session is the long one. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Afternoon', 'No Rush', 'Long Work', 'Then Her', 'Position One', 'Stay', 'Hours', 'Deep Afternoon', 'Another Hold', 'Still Going', 'Her Again', 'Long Fuck', 'Unhurried', 'Round After', 'In Her Still', 'The Long One', 'Sun Low', 'Not Done', 'Keep Fucking', 'Last of the Day'],
    cycle: ['long', 'longer'],
    dayTypes: {
      long: gymThenSex('Long circuit, then fuck', 'Long', C('Long circuit', GYM_LONG_WORK, { ...LIFT, values: [3, 4, 5, 6], pref: 6 }), GYM_LONG_POS, { values: [2, 3], pref: 3 }),
      longer: gymThenSex('Long strength, then fuck', 'Longer', S('Long strength', ['partnerLower', 'partnerUpper', 'partnerHold', 'partnerCore', 'partner?'], { ...LIFT, values: [3, 4, 5], pref: 5 }), GYM_LONG_POS, { values: [2, 3], pref: 3 }),
    },
  },
  {
    id: 'mouth-then-cock', ...EXPLICIT, name: 'Mouth Then Cock', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Mouths and hands, then fucking', blurb: 'You eat her pussy and she sucks your cock, then you fuck her, in her pussy or her ass, for the rest of the session.',
    about: 'You start with your mouth on her pussy and her mouth on your cock. Hands, a tease and a massage sit in that first stretch, and then you fuck her for the rest of the session. Her pussy or her ass, and a toy on her when you put one there, and you do not race it. Level II and Level III hold every part longer.',
    names: ['Eat Her', 'She Sucks', 'Then Cock', 'Her Mouth', 'Your Tongue', 'In After', 'Pussy or Ass', 'Deep After', 'Oral First', 'Fuck Second', 'Her Clit', 'Down Her Throat', 'Then In', 'Hold Deep', 'Both', 'Massage In', 'Slow Mouth', 'Hard After', 'Stay In', 'Last Thrust'],
    cycle: ['mouth', 'hands'],
    dayTypes: {
      mouth: sexThenSex('Mouths, then fuck', 'Mouth', SEX_MOUTH, SEX_FUCK, { pref: 2 }, { pref: 2 }),
      hands: sexThenSex('Hands in it, then fuck', 'Hands', SEX_WARM, SEX_DEEP, { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'tongue-then-thrust', ...EXPLICIT, name: 'Tongue Then Thrust', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tongue on her, then a deep fuck', blurb: 'Your tongue works her clit until she is soaked, then you thrust your cock into her and hold it deep.',
    about: 'You start with your tongue on her clit. Her mouth or her hand stays on your cock until she is soaked, and then you thrust in and hold deep. One day stays on your tongue, the other works your fingers in harder, and then your cock goes in her pussy or her ass. Level II and Level III hold every part longer.',
    names: ['Tongue', 'Her Clit', 'Soaked', 'Then Thrust', 'Hold Deep', 'In Her', 'Slow Lick', 'Hard After', 'Open', 'Cock In', 'Wet', 'Drive', 'Stay Deep', 'Her Taste', 'Second Thrust', 'Buried', 'Long Lick', 'Fuck', 'Deeper', 'Held'],
    cycle: ['tongue', 'hands'],
    dayTypes: {
      tongue: sexThenSex('Tongue, then thrust', 'Tongue', SEX_MOUTH, SEX_DEEP, { pref: 2 }, { pref: 2 }),
      hands: sexThenSex('Hands, then thrust', 'Hands', SEX_HANDS, SEX_FUCK, { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'fingers-then-fuck', ...EXPLICIT, name: 'Fingers Then Fuck', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fingers and her hand, then fucking', blurb: 'You finger her while she strokes your cock, then you put it in and fuck her pussy.',
    about: 'Hands first. You finger her cunt while she strokes your cock, and her mouth joins when you pull her down, with a little massage so it is not only speed. Then you put your cock in and fuck her, pussy or ass, and you keep it deep. Level II and Level III hold every part longer.',
    names: ['Fingers', 'Her Hand', 'Stroke', 'Then In', 'Two Fingers', 'Her Cunt', 'Slow Hand', 'Put It In', 'Fuck Her', 'Wet Fingers', 'Mutual', 'After Hands', 'Deep', 'In Her Pussy', 'Thumb', 'Second Block', 'Open Her', 'Cock', 'Hold', 'Fucked'],
    cycle: ['fingers', 'mouth'],
    dayTypes: {
      fingers: sexThenSex('Fingers, then fuck', 'Fingers', poses('sexWarm', 4, 3), SEX_FUCK, { pref: 2 }, { pref: 2 }),
      mouth: sexThenSex('Mouth and fingers, then fuck', 'Mouth', poses('sexWarm', 5, 3), SEX_DEEP, { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'eat-then-pound', ...EXPLICIT, name: 'Eat Then Pound', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Going down, then a hard fuck', blurb: 'You go down on her, fingers in it too, then you pound her pussy hard and deep.',
    about: 'You go down on her to open the session, fingers in her too, and her mouth on your cock while you are still between her legs. Then you pound her pussy, your cock in deep, and you take her ass in the same session so the day is not one note. You do not rush the holds just because the strokes are hard. Level II and Level III hold every part longer.',
    names: ['Go Down', 'Eat', 'Fingers Too', 'Then Pound', 'Her Pussy', 'Hard', 'Face In', 'Cock After', 'Deep Pound', 'Open', 'Tongue First', 'Hips', 'In Hard', 'Second', 'Ass Too', 'Stay', 'Rough Enough', 'Her Taste', 'Buried', 'Last Pound'],
    cycle: ['eat', 'hands'],
    dayTypes: {
      eat: sexThenSex('Eat her, then pound', 'Eat', SEX_MOUTH, SEX_DEEP, { pref: 2 }, { pref: 2 }),
      hands: sexThenSex('Hands, then pound', 'Hands', SEX_HANDS, SEX_FUCK, { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'tease-then-bury', ...EXPLICIT, name: 'Tease Then Bury', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage and tease, then a deep hold', blurb: 'Massage, a slow tease and her mouth on your cock, then you bury it in her and hold deep.',
    about: 'You rub her down, tease her, and get her mouth on your cock before you bury it. Your hands and your tongue take their time on her cunt, and then you are inside her, holding deep in her pussy or her ass. You stay at the base instead of pulling out to chase a faster stroke. Level II and Level III hold every part longer.',
    names: ['Tease', 'Massage', 'Her Mouth', 'Bury It', 'Slow', 'Hold Deep', 'Hands First', 'Then In', 'Keep It', 'Deep', 'Rub', 'Suck', 'Inside', 'Stay Buried', 'Her Ass', 'Pussy', 'Long Tease', 'No Hurry', 'In to the Base', 'Held There'],
    cycle: ['tease', 'mouth'],
    dayTypes: {
      tease: sexThenSex('Tease, then bury', 'Tease', SEX_TEASE, SEX_DEEP, { pref: 2 }, { pref: 2 }),
      mouth: sexThenSex('Mouth, then bury', 'Mouth', SEX_MOUTH, SEX_FUCK, { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'quick-and-deep', ...EXPLICIT, name: 'Quick and Deep', subject: 'Explicit', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'Short mouths and hands, then a short fuck', blurb: 'A fast turn with mouths and hands, then you fuck her deep while the session is still a short one.',
    about: 'A fast turn with mouths and hands, then a short fuck that is still deep. You do not linger on the tease. Your cock goes in her pussy or her ass and you hold it there, and the session still ends sooner than the rest. Level II and Level III hold every part a little longer.',
    names: ['Quick', 'Deep', 'Fast Mouth', 'Then In', 'Short Fuck', 'Her Lips', 'Hard In', 'Brief', 'Deep Enough', 'No Linger', 'Hands Fast', 'Cock In', 'Short Hold', 'Pussy', 'Now', 'In and Hold', 'Quick Grind', 'Done Deep', 'Warm Enough', 'Out'],
    cycle: ['quick', 'hands'],
    dayTypes: {
      quick: sexThenSex('Quick mouth, then deep', 'Quick', SEX_SHORT_WARM, SEX_SHORT_FUCK, { values: [1, 2, 3], pref: 1 }, { values: [1, 2, 3], pref: 1 }),
      hands: sexThenSex('Quick hands, then deep', 'Hands', SEX_SHORT_WARM, SEX_SHORT_FUCK, { values: [1, 2, 3], pref: 1 }, { values: [1, 2, 3], pref: 1 }),
    },
  },
  {
    id: 'slow-deep-fuck', ...EXPLICIT, name: 'Slow Deep Fuck', subject: 'Explicit', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'Long warm-up, then a long fuck', blurb: 'A long warm-up, your mouth and hands all over her cunt and her ass, then you fuck her slowly with your cock kept deep.',
    about: 'A long warm-up, your mouth and hands on her cunt and her ass. Her mouth is on your cock, and you rub her down before you fuck her. Then you fuck her slowly with your cock kept deep, in her pussy and in her ass, for the long sex session. Level II and Level III hold every part longer.',
    names: ['Slow', 'Deep', 'All Over Her', 'Her Cunt', 'Her Ass', 'Mouth Long', 'Hands Long', 'Then Fuck', 'Kept Deep', 'Unhurried', 'In Her', 'Long Hold', 'Base', 'Slow Stroke', 'Stay', 'Deeper', 'No Clock', 'Still In', 'Afternoon Fuck', 'Last Deep'],
    cycle: ['slow', 'deeper'],
    dayTypes: {
      slow: sexThenSex('Long warm-up, then fuck', 'Slow', SEX_LONG_WARM, SEX_LONG_FUCK, { values: [2, 3], pref: 3 }, { values: [2, 3], pref: 3 }),
      deeper: sexThenSex('Longer, then deeper', 'Deeper', SEX_LONG_WARM, SEX_LONG_FUCK, { values: [2, 3], pref: 3 }, { values: [2, 3], pref: 3 }),
    },
  },
  {
    id: 'stay-inside-her', ...EXPLICIT, name: 'Stay Inside Her', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'One positions flow', blurb: 'You stay inside her and move from position to position, one long hold after another.',
    about: 'You stay inside her and move from position to position, one long hold after another, your cock in her pussy or her ass. There is no workout in front of it and no separate teasing. You change the angle when the hold ends, and you do not pull out between them. Level II and Level III hold every position longer.',
    names: ['Stay', 'Inside', 'Next Position', 'Hold', 'Still In', 'Move', 'Her Pussy', 'Her Ass', 'Another', 'Do Not Pull Out', 'Long', 'Change', 'Deep', 'Keep It', 'Flow', 'In Her', 'Next Hold', 'Same Cock', 'Through', 'Last Position'],
    cycle: ['flow', 'again'],
    dayTypes: {
      flow: positionsOnly('Stay inside', 'Stay', ONLY_FLOW, { pref: 2 }),
      again: positionsOnly('Stay, another mix', 'Again', ONLY_ALT, { pref: 2 }),
    },
  },
  {
    id: 'hold-after-hold', ...EXPLICIT, name: 'Hold After Hold', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'One positions flow, holds getting longer', blurb: 'One flow of positions, your cock in her pussy or her ass, the holds getting longer as the levels climb.',
    about: 'One session, and the work is the holds. Your cock stays in her, pussy or ass, and you change position when the hold ends, not before. You are not training beside her first. Level II and Level III hold every position longer.',
    names: ['Hold', 'After', 'Longer', 'In Her', 'Count It', 'Next', 'Pussy', 'Ass', 'Stay Through', 'The Hold', 'Again', 'Deeper Hold', 'Do Not Rush', 'Change Late', 'Old One', 'New One', 'Still', 'Clock', 'Full Hold', 'Last Count'],
    cycle: ['hold', 'longer'],
    dayTypes: {
      hold: positionsOnly('Hold after hold', 'Hold', ONLY_FLOW, { pref: 2 }),
      longer: positionsOnly('Longer holds', 'Longer', ONLY_ALT, { pref: 2 }),
    },
  },
  {
    id: 'deeper-every-hold', ...EXPLICIT, name: 'Deeper Every Hold', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'One positions flow, deeper each hold', blurb: 'You fuck her through a single run of positions, working your cock deeper into her on every new hold.',
    about: 'Each new hold is a chance to get your cock deeper into her. You fuck her on her back, from behind and standing, pressing in a little further every time you set her hips. There is no workout before it and no separate oral. Level II and Level III hold every position longer.',
    names: ['Deeper', 'Every Hold', 'On Her Back', 'From Behind', 'Standing', 'Further In', 'Base', 'Her Hips', 'Again Deeper', 'Press', 'In More', 'Next Inch', 'Hold It There', 'Cock Deep', 'Her Legs', 'Behind', 'Open', 'All the Way', 'Stay Deep', 'Deepest'],
    cycle: ['deep', 'deeper'],
    dayTypes: {
      deep: positionsOnly('Deeper each hold', 'Deep', ONLY_ALT, { pref: 2 }),
      deeper: positionsOnly('Deeper still', 'Deeper', ONLY_FLOW, { pref: 2 }),
    },
  },
  {
    id: 'all-the-positions', ...EXPLICIT, name: 'All the Positions', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'One positions flow, old and new', blurb: 'Just positions: you fuck her on her back, from behind and standing, your cock in her the whole way.',
    about: 'Just positions. You fuck her on her back, from behind and standing, your cock in her the whole way, including her ass and the strap-on buckled on you and used in her. You do not stop to train, and you do not warm her up apart from the fucking. Level II and Level III hold every position longer.',
    names: ['All of Them', 'On Her Back', 'From Behind', 'Standing', 'Old One', 'New One', 'Mix', 'Her Ass', 'Toy', 'Mission', 'Legs Up', 'Prone', 'Edge', 'Chair', 'Wall', 'Spoon', 'Deep Mix', 'Another', 'The Lot', 'Last One'],
    cycle: ['all', 'rest'],
    dayTypes: {
      all: positionsOnly('All of them', 'All', ONLY_FLOW, { pref: 2 }),
      rest: positionsOnly('The rest of them', 'Rest', ONLY_ALT, { pref: 2 }),
    },
  },
  {
    id: 'cock-in-her', ...EXPLICIT, name: 'Cock in Her', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'One positions flow, nothing else', blurb: 'Sixty days of fucking and nothing else, your cock in her for a different run of positions every time.',
    about: 'Sixty days of fucking and nothing else. Your cock stays in her, and each day you move her through another run of positions, on her back, from behind and standing. You are not training for it first, and you are not spending the session only on her mouth. Level II and Level III hold every position longer.',
    names: ['Cock In', 'In Her', 'Nothing Else', 'Just Fuck', 'Fresh Mix', 'Today', 'Her', 'Deep', 'Again', 'This Position', 'Next', 'Stay', 'Pussy', 'Ass', 'Hold', 'Through', 'Only This', 'In', 'Keep Fucking', 'Day of It'],
    cycle: ['in', 'mix'],
    dayTypes: {
      in: positionsOnly('Cock in her', 'In', ONLY_ALT, { pref: 2 }),
      mix: positionsOnly('A fresh mix', 'Mix', ONLY_FLOW, { pref: 2 }),
    },
  },
  {
    id: 'nothing-but-fucking', ...EXPLICIT, name: 'Nothing but Fucking', subject: 'Explicit', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'One positions flow, no gym and no foreplay block', blurb: 'You skip the workout and the foreplay and just fuck her, position after position, for the whole session.',
    about: 'You skip the workout and the foreplay and just fuck her, position after position, for the whole session. Her pussy, her ass, and the strap-on buckled on you and used in her, your hands on her hips while you hold each one. You change her angle and you stay inside. Level II and Level III hold every position longer.',
    names: ['Nothing Else', 'Just Fuck', 'Position', 'After', 'Her Pussy', 'Her Ass', 'Strap on You', 'In Her', 'Whole Session', 'Skip the Gym', 'No Foreplay', 'Next', 'Hold', 'From Behind', 'On Her Back', 'Standing', 'Toy on Her', 'Keep Going', 'All Session', 'Still Fucking'],
    cycle: ['fuck', 'more'],
    dayTypes: {
      fuck: positionsOnly('Nothing but fucking', 'Fuck', ONLY_FLOW, { pref: 2 }),
      more: positionsOnly('More of it', 'More', ONLY_ALT, { pref: 2 }),
    },
  },
  // ---- Rough (Phase 22 ticket 19): 4 gym, 4 sex, 4 positions. Catalogue 13. Sex days are warm, then rough. ----
  {
    id: 'rough-set-then-spank', ...C13, name: 'Set Then Spank', subject: 'Rough', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, then spanking every third day',
    blurb: 'You train with her first, then you spank her ass and fuck her with your cock still buried in her pussy.',
    about: 'You train with her first, a partner circuit one day and shorter sets on the others. Two days in three you finish on her mouth, your hands and your tongue, with a tease and a massage. On the third you spank her ass, pin her wrists, or fist her hair and fuck her with your cock in her pussy. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Spank After the Set', 'Palm on Her Cheek', 'Circuit Then Slap', 'Wrist Under You', 'Fist After Sets', 'Over Your Lap', 'Thigh Gone Red', 'Held and Slapped', 'Mean Third Day', 'Her Cheek Hot', 'Slap Then Stay', 'Both Wrists Down', 'Hair Wrapped Tight', 'Flat on the Bed', 'Cock and Palm', 'Red on the Right', 'Lap and Spank', 'Mouth Day First', 'Massage Between', 'Pin and Fuck'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Spank her', 'Spank', C('Partner circuit', ROUGH_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRough', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rough-sweat-then-pin', ...C13, name: 'Sweat Then Pin', subject: 'Rough', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, then pinning every third day',
    blurb: 'You get the sweat on with her, then you pin her wrists down and fuck her pussy slow and deep.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three the rest is her mouth, your hands and tongue, teasing and a massage. On the third you pin her wrists down and fuck her pussy, or spank her and hold her hair while you stay buried. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat Then the Pin', 'Wrists to the Bed', 'Both Arms Down', 'Pin and Thrust', 'Palm on Her Back', 'Forearm Across Her', 'Held at the Hip', 'Sweaty Pin', 'Her Wrists Together', 'Down and Pinned', 'Pin the Grind', 'After the Sweat Pin', 'Slow Under the Pin', 'Deep and Pinned', 'Hair While Pinned', 'Weight on the Pin', 'Pinned Missionary', 'Side Pin Hold', 'Last Pin of Her', 'Pin Her Through'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Pin her', 'Pin', C('Partner circuit', ROUGH_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRough', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rough-lift-then-hold', ...C13, name: 'Lift Then Hold', subject: 'Rough', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries beside her, then holding her down',
    blurb: 'You squat and carry beside her, then you hold her down and fuck her cunt with your cock kept deep.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you go to her mouth, your hands and tongue, a tease and a massage. On the third you hold her down and fuck her cunt, a palm on her or a fist in her hair. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Then the Hold', 'Carry Then Down', 'Flat Hold Down', 'Across Her Back', 'Over the Lap Hold', 'Forearm Hold Down', 'Held From Above', 'Squat Then Down', 'Her Hips Pinned', 'Stay on Her Down', 'Hold the Rough', 'Weight Kept Down', 'Down on Her Side', 'Lap Spank Hold', 'Palm Between Her', 'After the Carry Down', 'Deep While Held', 'Pressed Flat Down', 'Last Hold Down', 'Hold Her There'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Hold her down', 'Hold', C('Partner circuit', ROUGH_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRough', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rough-grind-then-hair', ...C13, name: 'Grind Then Hair', subject: 'Rough', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats, then a fist in her hair',
    blurb: 'Kiss squats and partner pushes first, then a fist in her hair while you fuck her from behind.',
    about: 'Partner squats and pushes start you close, already hard against her. Two days in three you finish with her mouth, your hands and tongue, teasing and massage. On the third a fist in her hair keeps her where you want her while you spank her and fuck her from behind. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Grind Then the Fist', 'Fist at Her Nape', 'Hair and the Hips', 'From Behind Mean', 'Kiss Then Fist', 'Pull Her Up Hard', 'Hair and the Spank', 'Wrapped and Fucked', 'Nape in Your Hand', 'Grind With a Fist', 'Her Head Pulled', 'Behind and Mean', 'Hair Down Her Back', 'Hip and the Fist', 'Slow With Her Hair', 'After the Kiss Fist', 'Cheek to the Mat', 'Fist and the Cock', 'Held by the Hair', 'Last Fist in Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fist in her hair', 'Hair', C('Partner circuit', ROUGH_PUSH, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRough', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rough-spank-then-fuck', ...C13, name: 'Spank Then Fuck', subject: 'Rough', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then you spank her',
    blurb: 'You spank her ass and her thigh with your cock in her, then you fuck her and hold it deep.',
    about: 'Every day starts with her mouth, your hands and your tongue, a tease and a massage while you are both down to skin. Then you spank her ass and her thigh with your cock in her, and you fuck her and hold it deep. One day runs longer in the warm-up, the other in the spanking. Level II and Level III hold every part longer.',
    names: ['Spank Then the Fuck', 'Ass Then the Cock', 'Thigh Slap Deep', 'Palm and Thrust', 'Cheek Then Grind', 'Spank and Stay In', 'Red Then Deep', 'Slap Her Thigh', 'In Her and Slap', 'Both Cheeks Red', 'Spank the Rough', 'Warm Then Palm', 'Mouth Then Slap', 'Fuck and Spank', 'Deep After Red', 'Her Thigh Hot', 'Palm While Buried', 'Spank the Grind', 'Hold the Slap', 'Last Spank of Her'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then spank', 'Mouth', poses('sexWarm', 5, 2), poses('sexRough', 4, 2), { pref: 2 }, { pref: 2 }, 'Rough'),
      mean: warmThenLead('Mouth, then meaner', 'Mean', poses('sexWarm', 5, 2), poses('sexRough', 5, 2), { pref: 1 }, { pref: 2 }, 'Rough'),
    },
  },
  {
    id: 'rough-pin-then-thrust', ...C13, name: 'Pin Then Thrust', subject: 'Rough', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then you pin her wrists',
    blurb: 'You pin both her wrists and fuck her pussy, then you stay buried and grind your cock in her cunt.',
    about: 'You open on her mouth and with your hands, tongue on her clit, a slow tease and a rub. Then you pin both her wrists and fuck her pussy, and you stay buried and grind. The two days change how long each part is held, and both end with her pinned. Level II and Level III hold every part longer.',
    names: ['Pin Then the Thrust', 'Wrists Then Cock', 'Pinned and Buried', 'Both Wrists In', 'Grind While Pinned', 'Arms Above Her', 'Pin Then Deep', 'Held Open Pinned', 'Wrist and Thrust', 'Stay Pinned In', 'Slow Pin Fuck', 'Her Arms Down', 'Pin the Base', 'Thrust Under Pin', 'Deep Wrist Hold', 'Pinned From Behind', 'Two Hands One Pin', 'She Takes the Pin', 'Long Pinned Grind', 'Last Thrust Pin'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then pin', 'Mouth', poses('sexWarm', 5, 2), poses('sexRough', 4, 2), { pref: 2 }, { pref: 2 }, 'Rough'),
      mean: warmThenLead('Mouth, then pinned', 'Pin', poses('sexWarm', 5, 2), poses('sexRough', 5, 2), { pref: 1 }, { pref: 2 }, 'Rough'),
    },
  },
  {
    id: 'rough-quick-and-mean', ...C13, name: 'Quick and Mean', subject: 'Rough', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short mouth, then a short rough fuck',
    blurb: 'A short one: you slap her ass, pull her hair, and fuck her before either of you cools off.',
    about: 'A short one, still with her mouth and your hands first, tongue and a tease before you get mean. Then you slap her ass, pull her hair, and fuck her before either of you cools off. One day is shorter on the warm-up, the other on the rough part. Level II and Level III hold every part a little longer.',
    names: ['Quick and the Mean', 'Short Slap', 'Fast Fist', 'Brief and Rough', 'Slap Before Cool', 'Short Pin Mean', 'Mean and Brief', 'Hair and Quick', 'Fast Then Deep', 'Short Mean Fuck', 'Short Palm', 'Quick Thigh Slap', 'Warm and Mean', 'Brief Spank', 'Fast Behind Her', 'Short and Hard', 'Slap and Done', 'Quick Wrist Pin', 'Mean Minute', 'Last Quick Slap'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Short mouth, then slap', 'Mouth', poses('sexWarm', 5, 2), poses('sexRough', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Rough'),
      mean: warmThenLead('Shorter mouth, then mean', 'Mean', poses('sexWarm', 5, 1), poses('sexRough', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Rough'),
    },
  },
  {
    id: 'rough-long-hold', ...C13, name: 'Long Hold', subject: 'Rough', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long mouth, then a long hold-down',
    blurb: 'A long afternoon of holding her down, spanking her, and fucking her pussy and her ass without a rush.',
    about: 'This one takes the afternoon, and it still starts with her mouth, your hands and tongue, a tease and a long massage. Then you hold her down, spank her, and fuck her pussy and her ass without a rush. One day lingers on the warm-up and the other on the holds. Level II and Level III hold every part longer.',
    names: ['Long Hold Down', 'Afternoon Pin', 'Slow Spank Long', 'Hours on Her', 'Long Fist Hold', 'Unhurried Slap', 'Held All Afternoon', 'Deep Mean Hour', 'Palm for Hours', 'Long Over the Lap', 'Stay and the Spank', 'Long Mean Fuck', 'Long Thigh Slap', 'Afternoon Hair', 'Held Without Rush', 'Slow Red Afternoon', 'Long Flat Hold', 'Spank the Hour', 'Deep and Long Mean', 'Last Long Hold'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Long mouth, then hold', 'Mouth', poses('sexWarm', 5, 2), poses('sexRough', 8, 2), { pref: 3 }, { pref: 3 }, 'Rough'),
      mean: warmThenLead('Longer hold-down', 'Hold', poses('sexWarm', 5, 2), poses('sexRough', 8, 3), { pref: 3 }, { pref: 3 }, 'Rough'),
    },
  },
  {
    id: 'rough-stay-and-spank', ...C13, name: 'Stay and Spank', subject: 'Rough', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage two days, spanking on the third',
    blurb: 'You stay inside her and spank her ass on the holds, cock in her pussy or her ass the whole way.',
    about: 'Two days in three you stay on her mouth, your hands and tongue, teasing and massage, hold after hold. On the third you stay inside her and spank her ass, cock in her pussy or her ass, and you pin her wrists when the hold asks for it. You stay in her from one hold to the next. Level II and Level III hold every position longer.',
    names: ['Stay and the Spank', 'Inside and Slap', 'Cock Then Palm', 'Hold and Cheek', 'Slap and Stay In', 'Red While Inside', 'Ass or Her Pussy', 'Palm on the Hold', 'Stay for the Slap', 'Third Day Slap', 'Mouth Hold Spank', 'Massage Hold Spank', 'Tongue Hold Spank', 'Spank the Next', 'In and Red', 'Cheek on the Hold', 'Lap While Inside', 'Fist on Third Spank', 'Spank Through It', 'Last Inside Slap'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Spank and pin', 'Spank', poses('sexRough', 8, 7), { pref: 2 }),
    },
  },
  {
    id: 'rough-pin-and-stay', ...C13, name: 'Pin and Stay', subject: 'Rough', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Hands and tongue, pinning on the third',
    blurb: 'You pin her wrists, keep your cock in her, and move to the next hold without pulling out.',
    about: 'Two days in three are her mouth, your hands and tongue, a tease and a massage, one hold into the next. On the third you pin her wrists, keep your cock in her, and move straight into the next hold. A fist in her hair shows up when that hold wants it. Level II and Level III hold every position longer.',
    names: ['Pin and Stay In', 'Wrists and the Cock', 'Pinned Through It', 'Next Hold Pinned', 'Arms and Inside', 'Stay in the Pin', 'Third Day Pin', 'Mouth Hold Pin', 'Hands Day Pin', 'Tongue Then Pin', 'Buried and Pinned', 'Wrist to Her Wrist', 'Hold Her Pinned', 'Pin the Angle', 'Side and the Pin', 'Above and the Pin', 'Deep Pin Hold', 'Her Arms Wide Pin', 'Last Pinned Hold', 'Pin Her and Stay'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Pin and stay', 'Pin', poses('sexRough', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'rough-hair-and-hips', ...C13, name: 'Hair and Hips', subject: 'Rough', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tease and massage, her hair on the third',
    blurb: 'A fist in her hair and your cock in her cunt, one long hold after another, her hips in your hands.',
    about: 'Two days in three you use your mouth, your hands and your tongue, with teasing and massage between the holds. On the third a fist in her hair and your cock in her cunt, her hips in your hands, and you spank her when the hold is that kind. You do the whole run inside her. Level II and Level III hold every position longer.',
    names: ['Hair and the Hips', 'Fist and Her Cunt', 'Nape and the Hold', 'Hips in Your Hand', 'Hair Through It', 'Third Day Fist', 'Mouth Then Hair', 'Massage Then Fist', 'Behind With Hair', 'Pull and the Hold', 'Her Hips Yours', 'Fist at the Base', 'Hair and a Spank', 'Slow Hair Fuck', 'Cheek Turned Hard', 'Hips Up by Hair', 'In and Fisted', 'Hold by Her Hair', 'Third and Mean', 'Last Hair Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Hair and spank', 'Hair', poses('sexRough', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'rough-held-down', ...C13, name: 'Held Down', subject: 'Rough', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Over your lap on the third day',
    blurb: 'You hold her down flat, on her side, or over your lap, and you fuck her until that hold ends.',
    about: 'Two days in three you are on her mouth, hands and tongue working, a tease and a massage. On the third you hold her down flat, on her side, or over your lap, and you fuck her until that hold ends. Spanking and a fist in her hair sit in the same run. Level II and Level III hold every position longer.',
    names: ['Held Down Flat', 'Flat Fuck Hold', 'Over the Lap Fuck', 'Side Hold Fuck', 'Palm on Her Spine', 'Forearm Down Her', 'Third Day Down', 'Mouth Then Down', 'Massage Then Flat', 'Across Her Body', 'Lap Fuck Hold', 'Held to the End', 'Down and Deep Mean', 'Weight on Top Her', 'She Stays Flat', 'Hold the Flat', 'Spank While Down', 'Hair While Down', 'Pressed and Fucked', 'Last Down Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Hold her down', 'Down', poses('sexRough', 8, 4), { pref: 2 }),
    },
  },
  // ---- Kink-lite (Phase 22 ticket 19): 4 gym, 4 sex, 4 positions. Lead day is the toys; the other days are fucking. ----
  {
    id: 'kink-set-then-blind', ...C13, name: 'Set Then Blind', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner work, blindfold every third day',
    blurb: 'You train with her first, then you blindfold her and fuck her, hands on her hips, cock in her pussy.',
    about: 'You train beside her first, squats and pushes, and then the day splits. Two days in three you finish by fucking her, cock in her pussy, one hold after another. On the third you blindfold her, cuff her wrists or gag her, ice on her tits or wax on her ass, and one of those holds she blindfolds you or ties your wrists. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Set Then the Blind', 'Blindfold On Her', 'Cuffs After Sets', 'Gag After the Work', 'Ice on Her Tits', 'Wax on Her Ass', 'She Ties Your Wrists', 'Cloth on Her Eyes', 'Wrists Cuffed Tight', 'Third Day Blind', 'Fuck Day After Sets', 'Fuck Day Beside Her', 'Ice on Your Chest', 'Wax on Her Hip', 'Gagged and Fucked', 'Blind and Deep', 'Cuff and the Hold', 'She Blinds You', 'Toy Day After Sets', 'Last Blind Set'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Blindfold her', 'Blind', C('Partner circuit', GYM_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexKink', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'kink-sweat-then-cuffs', ...C13, name: 'Sweat Then Cuffs', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, cuffs every third day',
    blurb: 'Sweat with her first, then you cuff her wrists and fuck her pussy with her hands held together.',
    about: 'Sweat with her first, a short partner circuit, and then you fuck. Two days in three that fuck is plain, cock in her pussy, hold after hold. On the third you cuff her wrists, gag her or ice her tits, and once she cuffs you or runs wax over your chest while you stay inside her. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat Then the Cuffs', 'Loose Cuffs On', 'Wrists Together Cuffed', 'Ankles Cuffed Open', 'Gag After Sweat', 'Ice After the Sweat', 'She Cuffs You', 'Cloth Gag Sweat', 'Cuff and Fuck Her', 'Third Day Cuff', 'Plain Fuck One', 'Plain Fuck Two', 'Wax Over Your Chest', 'Her Ankles Open', 'Cuffs and Deep', 'Held by the Cuffs', 'Sweat and the Tie', 'Ice While Cuffed', 'She Ties Your Wrists', 'Last Cuff Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Cuff her', 'Cuffs', C('Partner circuit', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexKink', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'kink-lift-then-gag', ...C13, name: 'Lift Then Gag', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries, then a gag every third day',
    blurb: 'You carry beside her, then a gag in her mouth while you fuck her and watch her take your cock.',
    about: 'You carry beside her, then the session turns to sex. Two days in three you fuck her, cock buried, changing the hold when it ends. On the third a gag is in her mouth, or a blindfold, or wax on her skin, and one hold she gags you or ties your wrists while you stay in her. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Then the Gag', 'Gag in Her Mouth', 'Ball Beside the Cock', 'Cloth Between Teeth', 'Blind After Carry', 'Wax After the Lift', 'She Gags You', 'Gagged Deep In', 'Carry Then Gag', 'Third Day Gag', 'Fuck After the Lift', 'Fuck After a Squat', 'Ice After Carry', 'Tied After the Lift', 'Gag and the Grind', 'Mouth Full of Gag', 'She Ties After', 'Gag on the Hold', 'Deep and Gagged', 'Last Gag Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Gag her', 'Gag', C('Partner circuit', GYM_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexKink', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'kink-grind-then-wax', ...C13, name: 'Grind Then Wax', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats, then wax every third day',
    blurb: 'Kiss squats first, then wax on her tits and her ass while you fuck her and feel her cunt grip you.',
    about: 'Kiss squats first, close enough that you are already hard. Two days in three you fuck her after, cock in her cunt, one position then the next. On the third wax goes on her tits and her ass, or ice, or a blindfold, and once the ice is on your chest while you fuck her. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Grind Then the Wax', 'Wax on Her Tits', 'Wax on Her Ass', 'Drip and Fuck', 'Ice and the Grind', 'Blind After Kiss', 'She Ices Your Chest', 'Wax on Her Hip', 'Hot Then the Cock', 'Third Day Wax', 'Fuck After the Kiss', 'Fuck After Squats', 'Wax on Your Chest', 'Ice on Her Nipple', 'Drip Down Her Side', 'Kiss Then Wax', 'Wax and Deep In', 'She Waxes Close', 'Hold Under Wax', 'Last Wax Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Wax on her', 'Wax', C('Partner circuit', GYM_KISS, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexKink', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'kink-blind-then-fuck', ...C13, name: 'Blind Then Fuck', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Blindfold one day, fucking the other',
    blurb: 'You blindfold her and cuff her wrists, then you fuck her deep, and one day she blindfolds you instead.',
    about: 'One day you blindfold her and cuff her wrists, then you fuck her deep, and she may blindfold you on that same day. The other day you fuck her, cock in her pussy, from the start through the last hold. You hold it deep either way. Level II and Level III hold every part longer.',
    names: ['Blind Then the Fuck', 'Cloth Then Cock', 'Cuffs Then Deep', 'She Blinds You First', 'Eyes Covered Fuck', 'Fuck Her Both Ways', 'Plain Deep Fuck', 'Blind and Buried', 'Wrist Tie First', 'Then You Fuck Her', 'Hold After the Blind', 'Deep After Cloth', 'She Ties You First', 'Fuck and Hold Deep', 'Second Stretch Fuck', 'Blind Lead Day', 'Buried Either Way', 'Last Blind Fuck', 'Cuff Then the Cock', 'Cloth Off the Fuck'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Blindfold, then fuck', 'Blind', poses('sexKink', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'kink-gag-then-ice', ...C13, name: 'Gag Then Ice', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'A gag and ice, then a fuck',
    blurb: 'A gag in her mouth and ice on her tits, your cock in her cunt, then you fuck her and hold deep.',
    about: 'One day a gag is in her mouth and ice is on her tits, your cock in her cunt, and then you fuck her and hold deep. The other day you fuck her the whole session, her pussy or her ass, and you stay buried. She can gag you or ice your chest on the day with the gag and the ice. Level II and Level III hold every part longer.',
    names: ['Gag Then the Ice', 'Ice on Her Tits', 'Gag Then Deep', 'Cube and the Cock', 'She Ices Your Chest', 'Fuck Her All Day', 'Both Holds a Fuck', 'Gag and the Grind', 'Ice Then Thrust', 'Hold After Ice', 'Her Pussy All Day', 'Her Ass All Day', 'She Gags You', 'Cold on Her Skin', 'Gag in Deep', 'Ice and Stay In', 'Toy Day Fuck', 'Chest Gets the Ice', 'Second Hold Fuck', 'Last Gag and Ice'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Gag and ice, then fuck', 'Gag', poses('sexKink', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'kink-quick-tie', ...C13, name: 'Quick Tie', subject: 'Kink-lite', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short tie, or a short fuck',
    blurb: 'A short one: you tie her wrists, gag her, and fuck her while you are both still warm.',
    about: 'A short one. One day you tie her wrists, gag her, and fuck her while you are both still warm, and she may tie your wrists too. The other day is a short fuck, cock in her, start to finish. Level II and Level III hold every part a little longer.',
    names: ['Quick Tie Her', 'Short Gag Tie', 'Fast Cuff Tie', 'Brief Blind Tie', 'Tie and Fuck Her', 'Short and Tied', 'Quick Wrist Tie', 'She Ties You Fast', 'Short Plain Fuck', 'Brief Fuck Twice', 'Fast Cloth Tie', 'Quick Ice Tie', 'Warm and Tied', 'Short Gagged Fuck', 'Tie Then Done', 'Fast Deep Tie', 'Brief Wax Tie', 'Quick and In Her', 'She Cuffs You Fast', 'Last Quick Tie'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Tie, then fuck', 'Tie', poses('sexKink', 4, 2), poses('sexFuck', 8, 2), { pref: 1 }, { pref: 1 }),
      fuck: sexThenSex('Short fuck, then more', 'Fuck', poses('sexFuck', 6, 2), poses('sexFuck', 6, 2), { pref: 1 }, { pref: 1 }),
    },
  },
  {
    id: 'kink-long-ice', ...C13, name: 'Long Ice', subject: 'Kink-lite', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long blindfold, or a long fuck',
    blurb: 'A long session of ice, wax, and a blindfold on her while you fuck her, and once she ices your chest.',
    about: 'One day is ice, wax, and a blindfold on her while you fuck her, and once she ices your chest or ties your wrists. The other day is a long fuck, your cock kept deep in her pussy from the first hold to the last. You take your time on both and let the afternoon run. Level II and Level III hold every part longer.',
    names: ['Long Ice Day', 'Afternoon Wax', 'Long Blind Fuck', 'Hours of Ice', 'She Ices You Long', 'Long Plain Fuck', 'Both Holds Long', 'Wax for Hours', 'Blind the Hour', 'Ice on Chest Long', 'Deep Long Fuck', 'Unhurried Ice', 'Long Gag Ice', 'Tie for Hours', 'Cock Kept Deep', 'Slow Ice Fuck', 'Long Cloth Ice', 'Long Wax Afternoon', 'Wax and Stay In', 'Last Long Ice'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Ice and wax, then fuck', 'Ice', poses('sexKink', 4, 4), poses('sexFuck', 8, 3), { pref: 3 }, { pref: 3 }),
      fuck: sexThenSex('Long fuck, then more', 'Fuck', poses('sexFuck', 6, 3), poses('sexFuck', 6, 3), { pref: 3 }, { pref: 3 }),
    },
  },
  {
    id: 'kink-stay-blind', ...C13, name: 'Stay Blind', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, blindfold on the third',
    blurb: 'You stay inside her with the blindfold on, cock in her pussy, one long hold after another.',
    about: 'Two days in three you fuck her, cock in her pussy, one long hold after another. On the third the blindfold is on, and you stay inside her, cuffs or a gag when that hold uses them. One of those holds she blindfolds you and you keep fucking her. Level II and Level III hold every position longer.',
    names: ['Stay Blind In', 'Blind and Inside', 'Cloth on the Hold', 'Cuff on the Third', 'Gag on That Hold', 'She Blinds a Hold', 'Fuck Hold Plain', 'Fuck Hold Next', 'Eyes Covered In', 'Stay in the Dark', 'Third Day Cloth', 'Ice on That Hold', 'Wax While Inside', 'Blind Through It', 'Cock and the Cloth', 'Hold Under Cloth', 'She Ties a Hold', 'Deep and Blind', 'Next Hold Blind', 'Last Blind Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Blindfold on', 'Blind', poses('sexKink', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'kink-cuffed-open', ...C13, name: 'Cuffed Open', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, cuffs on the third',
    blurb: 'Her wrists or her ankles in loose cuffs, your cock in her cunt, hold after hold without pulling out.',
    about: 'Two days in three are fucking, hold after hold, your cock in her cunt. On the third her wrists or her ankles are in loose cuffs, and you stay in her between holds. A gag or her cuffs on your wrists shows up in that same run. Level II and Level III hold every position longer.',
    names: ['Cuffed Open Wide', 'Wrists in the Cuffs', 'Ankles Loose Cuffed', 'Cuff and Stay In', 'She Cuffs a Hold', 'Fuck Hold Open', 'Fuck Hold After', 'Open and Cuffed', 'Gag With the Cuffs', 'Third Day Cuffs', 'Ankle and the Cock', 'Wrist and Deep In', 'Loose and Inside', 'Cuff the Hold', 'Stay Cuffed In', 'Her Ankles Wide', 'She Ties the Hold', 'Buried in Cuffs', 'Hold Her Cuffed', 'Last Cuff of Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Cuffs on', 'Cuffs', poses('sexKink', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'kink-gagged-holds', ...C13, name: 'Gagged Holds', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, a gag on the third',
    blurb: 'A gag in her mouth and your cock buried in her pussy, and you change the hold without leaving her.',
    about: 'Two days in three you fuck her and change the hold with your cock still in her. On the third a gag is in her mouth and you stay buried, blindfold or cuffs in the same run. She can gag you on that day and you keep the hold. Level II and Level III hold every position longer.',
    names: ['Gagged Hold In', 'Gag and Buried', 'Cloth in Her Mouth', 'Change While Gagged', 'She Gags a Hold', 'Fuck Hold Gagged', 'Plain Hold Gag', 'Plain Hold Next', 'Blind With the Gag', 'Third Day Gag', 'Cuff and the Gag', 'Stay and the Gag', 'Deep Gagged Hold', 'Mouth Full Hold', 'Gag the Next Hold', 'Her Gag Stays In', 'In and Gagged', 'Hold the Gag', 'Buried Gag Hold', 'Last Gagged Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Gag in', 'Gag', poses('sexKink', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'kink-ice-wax', ...C13, name: 'Ice and Wax', subject: 'Kink-lite', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, ice and wax on the third',
    blurb: 'Ice on her tits or wax on her skin while you fuck her, and one day the ice is on your chest.',
    about: 'Two days in three you fuck her, position after position, cock in her pussy. On the third ice is on her tits or wax is on her skin while you fuck her, and one hold the ice is on your chest. A blindfold can be on her for the same run. Level II and Level III hold every position longer.',
    names: ['Ice and the Wax', 'Ice on the Tits', 'Wax on Her Skin', 'Ice on Your Chest', 'Third Day Cold', 'Fuck Hold on Ice', 'Plain Hold Cold', 'Plain Hold Hot', 'Drip While Inside', 'Cube on Her Tit', 'Wax and the Cock', 'She Ices a Hold', 'Cold and Deep In', 'Hot Wax Hold', 'Blind and the Ice', 'Stay Under Wax', 'Chest Then Fuck', 'Ice the Hold', 'Wax the Next', 'Last Ice Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Ice and wax', 'Wax', poses('sexKink', 8, 4), { pref: 2 }),
    },
  },
  // ---- Body play (Phase 22 ticket 20): 4 gym, 4 sex, 4 positions. Catalogue 13. Sex days are warm, then body. ----
  {
    id: 'body-set-then-tits', ...C13, name: 'Set Then Tits', subject: 'Body play', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, then her tits every third day',
    blurb: 'You train with her first, then you fuck her oiled tits and watch your cock slide in that squeeze.',
    about: 'You train with her first, a short partner circuit on two days and a longer one on the third. Two days in three you finish on her mouth, your hands and your tongue, with a tease and a massage. On the third your cock fucks her tits, grinds along her wet pussy, slides between her closed thighs, or you paint your cum on her skin. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Cleavage After Sets', 'Oil Between Her Tits', 'Cock in the Cleavage', 'She Squeezes the Shaft', 'Astride Her Ribs', 'Watch Her Tits Hug', 'Third Day Cleavage', 'Slick Tit Slide', 'Hands on Her Shoulders', 'Tits After Circuit', 'Mouth Day Cleavage', 'Massage Day Cleavage', 'Kneeling Titfuck', 'Side-On Her Tits', 'Her Cleavage Holds', 'Slide and Watch It', 'Oil on Both Tits', 'The Third Squeeze', 'Circuit Then Cleavage', 'Last Cleavage Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her tits', 'Tits', C('Partner circuit', ROUGH_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexBody', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'body-sweat-then-grind', ...C13, name: 'Sweat Then Grind', subject: 'Body play', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, then grinding every third day',
    blurb: 'You get the sweat on with her, then you grind your cock along her wet pussy and feel her clit drag it.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three the rest is her mouth, your hands and tongue, teasing and a massage. On the third you grind your cock along her wet pussy, fuck her tits, or slide between her thighs, and you paint your cum on her skin. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat Then the Grind', 'Clit on the Shaft', 'Grind Along Her Cunt', 'Wet Pussy Drag', 'Mound on Your Cock', 'Sweaty Grind Hold', 'Third Day Grind', 'Mouth Day Grind', 'Massage Day Grind', 'Slide on Her Slit', 'Clit Drags the Top', 'Grind After Sweat', 'Her Cunt on the Shaft', 'Stay on the Grind', 'Slick Along Her', 'Grind the Third', 'Pussy Gloss on You', 'After the Sweat Grind', 'Hot Grind Hold', 'Last Grind of Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Grind on her', 'Grind', C('Partner circuit', ROUGH_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexBody', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'body-lift-then-thigh', ...C13, name: 'Lift Then Thigh', subject: 'Body play', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries beside her, then her thighs',
    blurb: 'You squat and carry beside her, then you fuck her closed thighs and feel them squeeze your cock.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you go to her mouth, your hands and tongue, a tease and a massage. On the third you fuck her closed thighs, grind along her wet pussy, or slide your cock between her tits, and you paint your cum on her ass. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Then Her Thighs', 'Closed Thigh Squeeze', 'Cock Between Thighs', 'Carry Then Thighs', 'Oil in the Gap', 'Thigh Hug on Shaft', 'Third Day Thighs', 'Mouth Day Thighs', 'Massage Day Thighs', 'Slide Under Her Pussy', 'Thighs Pressed Shut', 'After the Carry Slide', 'Her Thighs Hot', 'Fuck the Closed Gap', 'Squeeze and Watch', 'Thighs From Behind', 'Deep Thigh Slide', 'Held by Her Thighs', 'Last Thigh Fuck', 'Thighs the Whole Way'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her thighs', 'Thigh', C('Partner circuit', ROUGH_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexBody', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'body-push-then-cum', ...C13, name: 'Push Then Cum', subject: 'Body play', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner pushes, then your cum on her',
    blurb: 'Partner pushes first, then you stroke your cock and paint your cum across her tits and her ass.',
    about: 'Partner pushes start you close, already hard against her. Two days in three you finish with her mouth, your hands and tongue, teasing and massage. On the third you stroke your cock and paint your cum on her tits, her ass and her belly, or you fuck her tits and her thighs. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Push Then the Cum', 'Paint Her Tits', 'Stripe Across Her Ass', 'Cum on Her Belly', 'Stroke and Paint', 'Load on Her Skin', 'Third Day Cum', 'Mouth Day Cum', 'Massage Day Cum', 'Watch It Stripe', 'Cum on Her Hip', 'After the Push Paint', 'Thick on Both Tits', 'Cum Along Her Back', 'Paint Her Mound', 'Stroke for the Stripe', 'Her Skin Marked', 'Cum and Watch', 'Push Then Paint', 'Last Stripe on Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Cum on her skin', 'Cum', C('Partner circuit', ROUGH_PUSH, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexBody', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'body-tits-then-hold', ...C13, name: 'Tits Then Hold', subject: 'Body play', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then you fuck her tits',
    blurb: 'Her mouth and your hands first, then you fuck her tits and hold your cock in that slick squeeze.',
    about: 'Every day starts with her mouth, your hands and your tongue, a tease and a massage while you are both down to skin. Then you fuck her tits and hold your cock in that slick squeeze, and you grind her wet pussy when the hold changes. One day runs longer in the warm-up, the other on her tits. Level II and Level III hold every part longer.',
    names: ['Tits Then the Hold', 'Mouth Then Cleavage', 'Slick Squeeze Hold', 'Cock Between Tits', 'Hold in Her Cleavage', 'Oil and the Shaft', 'Warm Then Tits', 'Longer on Her Tits', 'Squeeze and Stay', 'Watch the Slide', 'Tits Hug the Cock', 'Hands Then Tits', 'Tongue Then Tits', 'Cleavage Hold Deep', 'Both Tits Around', 'Stay in the Squeeze', 'Grind After Tits', 'Titfuck the Hold', 'Slick and Held', 'Last Tit Hold'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then tits', 'Mouth', poses('sexWarm', 5, 2), poses('sexBody', 4, 2), { pref: 2 }, { pref: 2 }, 'Body'),
      mean: warmThenLead('Mouth, then more', 'Tits', poses('sexWarm', 5, 2), poses('sexBody', 5, 2), { pref: 1 }, { pref: 2 }, 'Body'),
    },
  },
  {
    id: 'body-grind-then-hold', ...C13, name: 'Grind Then Hold', subject: 'Body play', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then you grind her',
    blurb: 'Her mouth and your tongue first, then you grind your cock along her wet cunt and stay on her clit.',
    about: 'You open on her mouth and with your hands, tongue on her clit, a slow tease and a rub. Then you grind your cock along her wet cunt and stay on her clit, and you fuck her tits when that hold comes. The two days change how long each part is held, and both end with you grinding her. Level II and Level III hold every part longer.',
    names: ['Grind Then the Hold', 'Tongue Then Grind', 'Clit Under the Shaft', 'Stay on Her Cunt', 'Wet Grind Hold', 'Mouth Then the Grind', 'Along Her Slit', 'Grind and Stay On', 'Her Clit Drags', 'Hold the Grind', 'Cunt Gloss Hold', 'Hands Then Grind', 'Longer Grind Day', 'Pussy Along the Cock', 'Grind Until It Ends', 'Slick Clit Hold', 'Tits After Grind', 'Open Then Grind', 'Both Days Grinding', 'Last Grind Hold'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then grind', 'Mouth', poses('sexWarm', 5, 2), poses('sexBody', 4, 2), { pref: 2 }, { pref: 2 }, 'Body'),
      mean: warmThenLead('Mouth, then grinding', 'Grind', poses('sexWarm', 5, 2), poses('sexBody', 5, 2), { pref: 1 }, { pref: 2 }, 'Body'),
    },
  },
  {
    id: 'body-quick-and-slick', ...C13, name: 'Quick and Slick', subject: 'Body play', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short mouth, then a short slide on her',
    blurb: 'A short one: her mouth first, then your cock between her tits and her thighs before either of you cools off.',
    about: 'A short one, still with her mouth and your hands first, tongue and a tease before you get your cock on her. Then your cock goes between her tits and her thighs before either of you cools off. One day is shorter on the warm-up, the other on the slide. Level II and Level III hold every part a little longer.',
    names: ['Quick and the Slick', 'Short Tit Slide', 'Fast Thigh Gap', 'Brief Cleavage', 'Slide Before Cool', 'Short Mouth Slick', 'Quick Between Tits', 'Fast on Her Thighs', 'Brief and Slick', 'Short Cock Slide', 'Warm Then Slide', 'Quick Oil Slide', 'Slick and Done', 'Short Grind Slide', 'Fast Cleavage', 'Slide While Warm', 'Quick Thigh Fuck', 'Short Slick Hold', 'Slide and Finish', 'Last Quick Slick'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Short mouth, then tits', 'Mouth', poses('sexWarm', 5, 2), poses('sexBody', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Body'),
      mean: warmThenLead('Shorter mouth, then slide', 'Slide', poses('sexWarm', 5, 1), poses('sexBody', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Body'),
    },
  },
  {
    id: 'body-long-on-her', ...C13, name: 'Long on Her', subject: 'Body play', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long mouth, then a long slide on her',
    blurb: 'A long afternoon of her mouth, then your cock between her tits and her thighs, and your cum on her skin.',
    about: 'This one takes the afternoon, and it still starts with her mouth, your hands and tongue, a tease and a long massage. Then your cock stays between her tits and her thighs, and you paint your cum on her skin. One day lingers on the warm-up and the other on those holds. Level II and Level III hold every part longer.',
    names: ['Long on Her Skin', 'Afternoon Cleavage', 'Hours Between Thighs', 'Slow Cum on Skin', 'Long Tit Squeeze', 'Unhurried Slide', 'Paint the Afternoon', 'Long Mouth Then Tits', 'Thighs for Hours', 'Cum Across the Hour', 'Stay on Her Long', 'Long Slick Hold', 'Afternoon Grind', 'Skin for the Hour', 'Long Oil Slide', 'Tits the Long Way', 'Cum on the Long Day', 'Hold Her All Day', 'Deep Long Slide', 'Last Long on Her'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Long mouth, then tits', 'Mouth', poses('sexWarm', 4, 1), poses('sexBody', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Body'),
      mean: warmThenLead('Longer on her skin', 'Skin', poses('sexWarm', 3, 2), poses('sexBody', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Body'),
    },
  },
  {
    id: 'body-stay-on-tits', ...C13, name: 'Stay on Tits', subject: 'Body play', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage two days, her tits on the third',
    blurb: 'You stay on her tits with your cock squeezed between them, one long hold after another.',
    about: 'Two days in three you stay on her mouth, your hands and tongue, teasing and massage, hold after hold. On the third you stay on her tits, cock squeezed between them, and you grind her pussy or fuck her thighs when the hold asks for it. You watch your cock the whole way. Level II and Level III hold every position longer.',
    names: ['Stay on Her Tits', 'Cleavage Hold After', 'Squeezed the Whole Way', 'Third Day on Tits', 'Mouth Hold Tits', 'Massage Hold Tits', 'Cock Kept in Tits', 'Watch Between Them', 'Oil Hold on Tits', 'Stay for the Squeeze', 'Tits Into the Next', 'Grind on That Hold', 'Thighs on Third', 'Long Cleavage Stay', 'Both Days on Mouth', 'Tit Stay Through', 'Slick Stay Hold', 'Her Tits the Third', 'Hold and Watch Tits', 'Last Stay on Tits'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Tits and grind', 'Tits', poses('sexBody', 8, 7), { pref: 2 }),
    },
  },
  {
    id: 'body-grind-and-stay', ...C13, name: 'Grind and Stay', subject: 'Body play', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Hands and tongue, grinding on the third',
    blurb: 'You grind your cock along her wet pussy and stay on her clit, hold after hold, without pulling away.',
    about: 'Two days in three are her mouth, your hands and tongue, a tease and a massage, one hold into the next. On the third you grind your cock along her wet pussy and stay on her clit, and you fuck her tits when that hold wants it. You stay against her from one hold to the next. Level II and Level III hold every position longer.',
    names: ['Grind Stay on Her', 'Clit Stay Hold', 'Along Her the Hold', 'Third Day on Clit', 'Mouth Hold Grind', 'Hands Day Grind', 'Stay Against Her Cunt', 'Pussy Stay Through', 'Grind the Next Hold', 'Wet Stay on Shaft', 'Tits on That Grind', 'Hold Without Leaving', 'Clit Through It', 'Stay and the Grind', 'Slick Clit Stay', 'Her Cunt the Third', 'Grind Hold to Hold', 'Pressed Along Her', 'Last Grind Stay', 'Stay on the Clit'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Grind and stay', 'Grind', poses('sexBody', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'body-thighs-and-hips', ...C13, name: 'Thighs and Hips', subject: 'Body play', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tease and massage, her thighs on the third',
    blurb: 'Your cock slides between her closed thighs, her ass in your hands, one hold after another.',
    about: 'Two days in three you use your mouth, your hands and your tongue, with teasing and massage between the holds. On the third your cock slides between her closed thighs, her ass in your hands, and you grind her pussy when the hold is that kind. You keep your hands on her hips the whole run. Level II and Level III hold every position longer.',
    names: ['Thighs and Her Hips', 'Closed Gap Hold', 'Ass in Your Hands', 'Hips Through the Slide', 'Third Day Thigh Gap', 'Mouth Then the Gap', 'Massage Then Thighs', 'Slide and Her Ass', 'Hands on Her Hips', 'Thigh Hold to Hold', 'Grind on the Gap', 'Her Ass the Hold', 'Oil Gap Hold', 'Hips Yours the Run', 'Behind Her Thighs', 'Stay in the Gap', 'Thighs the Third', 'Squeeze Her Hips', 'Long Thigh Hold', 'Last Hip Slide'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Thighs and ass', 'Thigh', poses('sexBody', 8, 3), { pref: 2 }),
    },
  },
  {
    id: 'body-cum-on-her', ...C13, name: 'Cum on Her', subject: 'Body play', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth two days, your cum on the third',
    blurb: 'You stroke your cock and paint your cum on her tits, her ass and her belly, and you watch it stripe her.',
    about: 'Two days in three you are on her mouth, hands and tongue working, a tease and a massage. On the third you stroke your cock and paint your cum on her tits, her ass and her belly, and you watch it stripe her skin. Fucking her tits and her thighs sits in the same run. Level II and Level III hold every position longer.',
    names: ['Cum on Her Skin', 'Paint the Tits Hold', 'Stripe Her Ass Hold', 'Belly Takes the Cum', 'Watch the Stripe', 'Third Day Paint', 'Mouth Then the Cum', 'Massage Then Paint', 'Stroke and the Hold', 'Cum Across Tits', 'Ass Cheek Striped', 'Load on Her Belly', 'Tits in That Run', 'Thighs in That Run', 'Paint Hold to Hold', 'Her Skin the Third', 'Thick Stripe Hold', 'Cum and Her Tits', 'Stay for the Paint', 'Last Paint Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 3), { pref: 2 }),
      lead: positionsOnly('Cum on her', 'Cum', poses('sexBody', 8, 4), { pref: 2 }),
    },
  },
  // ---- Rimming (Phase 22 ticket 20): 4 gym, 4 sex, 4 positions. Lead day is the rimming; the other days are fucking. ----
  {
    id: 'rim-set-then-tongue', ...C13, name: 'Set Then Tongue', subject: 'Rimming', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner work, your tongue every third day',
    blurb: 'You train with her first, then you spread her cheeks and lick her asshole slow and wide.',
    about: 'You train beside her first, squats and pushes, and then the day splits. Two days in three you finish by fucking her, cock in her pussy, one hold after another. On the third you spread her cheeks and lick her asshole, and on one hold you are lying flat on your back while she puts her tongue on your asshole and strokes your cock. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Tongue After the Set', 'Cheeks Spread Wide', 'Lick Her Slow', 'Flat Tongue on Her', 'Third Day Tongue', 'Fuck Day After Work', 'Fuck Day at Her Side', 'Asshole After Reps', 'Wide Slow Lick', 'She Licks You Flat', 'Back Flat Her Tongue', 'Set Then Her Ass', 'Mouth on Her Rim', 'Hold the Cheeks Open', 'Drip on the Lick', 'Tongue the Third', 'Stroke While Flat', 'Lick and Stay Wide', 'After Sets Her Rim', 'Last Tongue Set'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Lick her ass', 'Tongue', C('Partner circuit', GYM_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRim', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rim-sweat-then-ass', ...C13, name: 'Sweat Then Ass', subject: 'Rimming', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, her asshole every third day',
    blurb: 'Sweat with her first, then you get under her and lick her asshole while her cunt drips on your mouth.',
    about: 'Sweat with her first, a short partner circuit, and then you fuck. Two days in three that fuck is plain, cock in her pussy, hold after hold. On the third you lick her asshole while her cunt drips on your mouth, and once you are standing tall while her tongue is on your asshole. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat Then Her Ass', 'Drip on Your Mouth', 'Lick Under the Sweat', 'Cunt Drip Lick', 'Standing Tall Her Tongue', 'Plain Fuck One Rim', 'Plain Fuck Two Rim', 'Third Day Her Rim', 'Sweat and the Lick', 'Tongue After Sweat', 'Her Asshole Wet', 'Tall While She Licks', 'Drip and the Tongue', 'Ass After the Sweat', 'Lick the Sweaty Rim', 'Hold Her Hips Lick', 'Wide After Sweat', 'She Licks You Tall', 'Rim the Sweat Day', 'Last Sweat Lick'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Lick her', 'Ass', C('Partner circuit', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRim', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rim-lift-then-rim', ...C13, name: 'Lift Then Rim', subject: 'Rimming', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries, then her asshole every third day',
    blurb: 'You carry beside her, then your tongue is on her asshole and you lick her until that hold ends.',
    about: 'You carry beside her, then the session turns to sex. Two days in three you fuck her, cock buried, changing the hold when it ends. On the third your tongue is on her asshole, and one hold you are lying flat on your back while she licks your asshole and strokes your cock. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Then the Rim', 'Tongue After Carry', 'Flat Back Her Lick', 'Stroke on Your Back', 'Carry Then Asshole', 'Fuck After the Lift Rim', 'Fuck After a Squat Rim', 'Third Day Rim', 'Lick Until It Ends', 'Her Tongue You Flat', 'Asshole After Carry', 'Buried Fuck Rim Day', 'Tongue on Her Rim', 'Back Down She Licks', 'Cock in Her Fist Flat', 'Rim After the Carry', 'Hold Ends on Tongue', 'She Licks the Flat', 'Deep Rim After Lift', 'Last Rim After Carry'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Tongue on her', 'Rim', C('Partner circuit', GYM_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRim', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rim-grind-then-tongue', ...C13, name: 'Grind Then Tongue', subject: 'Rimming', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats, then her asshole every third day',
    blurb: 'Kiss squats first, then you lick her asshole and her tongue licks your asshole.',
    about: 'Kiss squats first, close enough that you are already hard. Two days in three you fuck her after, cock in her cunt, one position then the next. On the third you lick her asshole, and once you are standing tall while her tongue licks your asshole. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Grind Then Her Tongue', 'Kiss Then the Lick', 'Standing Her Tongue', 'Tall While She Rims', 'Lick After Squats', 'Fuck After the Kiss Rim', 'Fuck After Squats Rim', 'Third Day Her Tongue', 'Asshole After Kiss', 'She Rims You Tall', 'Tongue on Both', 'Hard Then Her Rim', 'Squat Then Lick', 'Her Tongue Standing', 'Cunt Then the Rim', 'Kiss Squat Lick', 'Tall and Her Mouth', 'Lick Her Then Tall', 'Hold Under Tongue', 'Last Tongue Squat'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Lick her asshole', 'Tongue', C('Partner circuit', GYM_KISS, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexRim', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'rim-tongue-then-fuck', ...C13, name: 'Tongue Then Fuck', subject: 'Rimming', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her asshole one day, fucking the other',
    blurb: 'You lick her asshole, she licks yours, then you fuck her deep, and the other day you fuck her the whole way.',
    about: 'One day you lick her asshole, and you are lying flat on your back while she licks your asshole, then you fuck her deep. The other day you fuck her, cock in her pussy, from the start through the last hold. You hold it deep either way. Level II and Level III hold every part longer.',
    names: ['Tongue Then the Fuck', 'Flat While She Licks', 'Lick Then Deep', 'Back Down Then Cock', 'Other Day All Fuck', 'Both Holds a Fuck Rim', 'Asshole Then Buried', 'She Licks You Flat Day', 'Fuck Her Both Rim', 'Hold After the Lick', 'Deep After Tongue', 'Pussy the Other Day', 'Flat Back Lick Fuck', 'Tongue Lead Day', 'Buried Either Rim', 'Last Tongue Fuck', 'Lick Hers Then Yours', 'Cock After the Rim', 'Whole Way Fuck Day', 'Flat and Then Deep'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Lick, then fuck', 'Tongue', poses('sexRim', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'rim-ass-then-cock', ...C13, name: 'Ass Then Cock', subject: 'Rimming', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her asshole, then a fuck',
    blurb: 'Your tongue on her asshole, your cock in her cunt, and the other day you fuck her pussy and her ass.',
    about: 'One day your tongue is on her asshole and then your cock is in her cunt, and you are standing tall while she licks your asshole. The other day you fuck her the whole session, her pussy or her ass, and you stay buried. You take both days down to skin. Level II and Level III hold every part longer.',
    names: ['Asshole Then the Cock', 'Tall for Her Lick', 'Tongue Then Her Cunt', 'Standing Rim Day', 'Other Day Her Pussy', 'Other Day Her Ass', 'Stay Buried Rim', 'Cock After Asshole', 'She Licks You Tall Day', 'Down to Skin Rim', 'Fuck the Whole Rim', 'Tongue on Her First', 'Tall and Her Tongue', 'Cunt After the Lick', 'Buried the Other', 'Asshole Then Deep', 'Both Days to Skin', 'Her Ass the Fuck Day', 'Lick Then Stay In', 'Last Ass Then Cock'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Ass, then cock', 'Ass', poses('sexRim', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'rim-quick-lick', ...C13, name: 'Quick Lick', subject: 'Rimming', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short lick, or a short fuck',
    blurb: 'A short one: you lick her asshole, she licks yours, and you fuck her before either of you cools off.',
    about: 'A short one. One day you lick her asshole, you are standing tall while she licks your asshole, and you fuck her while you are both still warm. The other day is a short fuck, cock in her, start to finish. Level II and Level III hold every part a little longer.',
    names: ['Quick Lick Her', 'Short Standing Lick', 'Tall and a Fast Lick', 'Brief Rim Then Fuck', 'Lick Before Cool', 'Short Fuck the Other', 'Quick Tongue Fuck', 'She Licks You Fast', 'Warm Short Rim', 'Fast Asshole Lick', 'Short Cock After', 'Brief and Her Tongue', 'Quick Rim Then In', 'Standing Quick Rim', 'Before the Cool Lick', 'Short Buried Fuck', 'Fast Lick Then In', 'Quick Her Rim', 'Both Still Warm Rim', 'Last Quick Lick'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Lick, then fuck', 'Lick', poses('sexRim', 4, 2), poses('sexFuck', 8, 2), { pref: 1 }, { pref: 1 }),
      fuck: sexThenSex('Short fuck, then more', 'Fuck', poses('sexFuck', 6, 2), poses('sexFuck', 6, 2), { pref: 1 }, { pref: 1 }),
    },
  },
  {
    id: 'rim-long-tongue', ...C13, name: 'Long Tongue', subject: 'Rimming', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long lick, or a long fuck',
    blurb: 'A long afternoon of your tongue on her asshole and hers on yours, then a long fuck with your cock kept deep.',
    about: 'One day your tongue is on her asshole, and you are lying flat on your back while her tongue is on your asshole, then you fuck her. The other day is a long fuck, your cock kept deep in her pussy from the first hold to the last. You take your time on both and let the afternoon run. Level II and Level III hold every part longer.',
    names: ['Long Tongue Day', 'Afternoon on Her Rim', 'Flat for the Long Lick', 'Hours of Her Asshole', 'Her Tongue the Hour', 'Long Plain Fuck Rim', 'Both Holds Long Rim', 'Tongue for Hours', 'Back Down the Hour', 'Cock Kept Deep Rim', 'Unhurried Lick', 'Long Fuck After Rim', 'Flat and Her Tongue', 'Afternoon Rim Fuck', 'Slow Tongue Hour', 'Deep From First Hold', 'Long Lick Then Cock', 'Her Rim the Afternoon', 'Stay Deep the Hour', 'Last Long Tongue'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Lick, then fuck', 'Tongue', poses('sexRim', 4, 2), poses('sexFuck', 5, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }),
      fuck: sexThenSex('Long fuck, then more', 'Fuck', poses('sexFuck', 4, 2), poses('sexFuck', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }),
    },
  },
  {
    id: 'rim-stay-and-lick', ...C13, name: 'Stay and Lick', subject: 'Rimming', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, her asshole on the third',
    blurb: 'You stay with your tongue flat on her asshole, her cunt dripping on your mouth, hold after hold.',
    about: 'Two days in three you fuck her, cock in her pussy, one long hold after another. On the third your tongue stays flat on her asshole, her cunt dripping on your mouth, and one hold you are lying flat on your back while she licks your asshole. You keep the holds long. Level II and Level III hold every position longer.',
    names: ['Stay and the Lick', 'Flat Tongue Stay', 'Drip on the Hold', 'Third Day Flat Lick', 'Fuck Hold Lick One', 'Fuck Hold Lick Two', 'Back Flat She Licks', 'Cunt Drip Hold', 'Tongue Stays on Her', 'Long Lick Hold', 'She Licks a Hold', 'Asshole the Third', 'Stay With the Tongue', 'Mouth Wet From Her', 'Flat Back Hold', 'Lick Through the Run', 'Hold Her Open Lick', 'Dripping Lick Stay', 'Next Hold Her Rim', 'Last Stay Lick'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: flowDay('Fuck her', 'Fuck', [flowBlock('sexFuck', 6, 12, 3, [3])]),
      lead: flowDay('Tongue on her', 'Lick', [flowBlock('sexRim', 3, 2, 2), flowBlock('sexFuck', 6, 2, 2)]),
    },
  },
  {
    id: 'rim-open-and-eat', ...C13, name: 'Open and Eat', subject: 'Rimming', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, licking her on the third',
    blurb: 'You spread her cheeks and lick her asshole, hold after hold, and on the other days you fuck her deep.',
    about: 'Two days in three are fucking, hold after hold, your cock in her cunt. On the third you spread her cheeks and lick her asshole, and you are standing tall while her tongue is on your asshole. You fuck her deep on the days in between. Level II and Level III hold every position longer.',
    names: ['Open and Eat Her', 'Cheeks Open Hold', 'Standing Tongue Hold', 'Tall on the Third', 'Fuck Hold Open One', 'Fuck Hold Open Two', 'Lick the Open Rim', 'Her Tongue You Tall', 'Spread and the Tongue', 'Deep on Other Days', 'Asshole Held Open', 'Third Day Open', 'Cock Deep Between', 'Eat Her on Third', 'Tall She Licks Hold', 'Cheeks in Your Hands', 'Lick Hold to Hold', 'Fuck Deep the Rest', 'Open the Next', 'Last Open Lick'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: flowDay('Fuck her', 'Fuck', [flowBlock('sexFuck', 6, 12, 3, [3])]),
      lead: flowDay('Cheeks spread', 'Open', [flowBlock('sexRim', 3, 3, 2), flowBlock('sexFuck', 6, 2, 2)]),
    },
  },
  {
    id: 'rim-tongue-holds', ...C13, name: 'Tongue Holds', subject: 'Rimming', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, your tongue on the third',
    blurb: 'Your tongue works her asshole, hold after hold, and two days in three your cock is buried in her pussy.',
    about: 'Two days in three you fuck her and change the hold with your cock still in her. On the third your tongue works her asshole and you stay there, and one hold you are lying flat on your back while she licks your asshole. She strokes your cock on that hold. Level II and Level III hold every position longer.',
    names: ['Tongue Holds on Her', 'Work Her Asshole', 'Flat Back Stroke', 'Change While Buried', 'Third Day Tongue Hold', 'Fuck Hold Tongue One', 'Fuck Hold Tongue Two', 'She Licks You Flat Hold', 'Stay on Her Rim', 'Cock Still in Her Rim', 'Stroke on the Flat', 'Tongue the Next Hold', 'Asshole Hold Run', 'Back Down a Hold', 'Her Hand on You Flat', 'Buried Then Tongue', 'Hold and Her Rim', 'Lick the Changed Hold', 'Flat and a Stroke', 'Last Tongue Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: flowDay('Fuck her', 'Fuck', [flowBlock('sexFuck', 6, 12, 3, [3])]),
      lead: flowDay('Tongue holds', 'Tongue', [flowBlock('sexRim', 3, 2, 2), flowBlock('sexFuck', 6, 2, 2)]),
    },
  },
  {
    id: 'rim-her-tongue', ...C13, name: 'Her Tongue', subject: 'Rimming', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, her tongue on the third',
    blurb: 'You are standing tall, her tongue on your asshole and her hand on your cock, and you lick hers on the other holds.',
    about: 'Two days in three you fuck her, position after position, cock in her pussy. On the third you are standing tall while she kneels behind you, her tongue on your asshole and her hand on your cock, and you lick her asshole on the other holds of that day. A long lick of her sits in the same run. Level II and Level III hold every position longer.',
    names: ['Her Tongue on You', 'Standing Tall Her Mouth', 'Kneels Behind You Tall', 'Hand on Your Cock Tall', 'Her Tongue the Third', 'Fuck Hold Her Tongue', 'Plain Hold Her Rim', 'You Lick Her Too', 'Tall and Her Hand', 'Asshole She Licks', 'Other Holds You Lick', 'Long Lick of Her', 'Standing the Third', 'Her Tongue Stays', 'Cock in Her Hand Tall', 'Fuck Then Her Tongue', 'Behind You Standing', 'Lick Hers Standing', 'Same Run Her Rim', 'Last Her Tongue'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: flowDay('Fuck her', 'Fuck', [flowBlock('sexFuck', 6, 10, 3, [3])]),
      lead: flowDay('Her tongue', 'Hers', [flowBlock('sexRim', 3, 2, 2), flowBlock('sexFuck', 6, 2, 2)]),
    },
  },
  // ---- Edging (Phase 22 ticket 20b): 4 gym, 4 sex, 4 positions. Catalogue 13. Sex days are warm, then edging. ----
  {
    id: 'edge-set-then-stop', ...C13, name: 'Set Then Stop', subject: 'Edging', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, then you pull out every third day',
    blurb: 'You train with her first, then you pull your cock out of her pussy, breathe, and hold the head of your cock still on her clit.',
    about: 'You train with her first, a partner circuit one day and shorter sets on the others. Two days in three you finish on her mouth, your hands and your tongue, with a tease and a massage. On the third you pull out of her pussy when you are close, breathe, and brace with the head of your cock on her clit. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Stop After the Set', 'Head on Her Clit', 'Circuit Then Out', 'Breathe With the Head', 'Base in Your Fist', 'Shallow After Sets', 'Still on Her Clit', 'Mouth Then the Head', 'Hands Then the Head', 'Brace After Reps', 'Pull Out Deep', 'Hold the Head Still', 'Belly Braced Stop', 'Forearms Braced Stop', 'Back In After', 'Clit Under a Stop', 'Set Then the Stop', 'Clit Under the Head', 'Grip and Breathe', 'Last Stop of the Set'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Pull out and stop', 'Stop', C('Partner circuit', ROUGH_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexEdging', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'edge-sweat-then-out', ...C13, name: 'Sweat Then Out', subject: 'Edging', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, then you slip out every third day',
    blurb: 'You get the sweat on with her, then you slip out of her cunt and rest your cock on her clit while you breathe.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three the rest is her mouth, your hands and tongue, teasing and a massage. On the third you slip out of her cunt, breathe, and leave the head of your cock on her clit, or you hold still and shallow until you can go back in. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat Then the Out', 'Slip Out and Breathe', 'Head Left on Her', 'Sweaty Pull Out', 'Out After the Sweat', 'Rest It on Her Clit', 'Shallow After Sweat', 'Still After Sweat', 'Brace After Sweat', 'Mouth Between Sweat', 'Hands Between Sweat', 'Clit Between Sweat', 'Cock Out to Breathe', 'Base Gripped Out', 'Wide Feet Brace', 'Hip Hand Brace', 'Back In Slow', 'Counter Pull Out', 'Sweat on the Pull', 'Last Out of Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Slip out', 'Out', C('Partner circuit', ROUGH_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexEdging', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'edge-lift-then-slow', ...C13, name: 'Lift Then Slow', subject: 'Edging', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries beside her, then shallow strokes',
    blurb: 'You squat and carry beside her, then you slow to shallow strokes in her pussy and grip the base of your cock.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you go to her mouth, your hands and tongue, a tease and a massage. On the third you slow to shallow strokes in her pussy and grip the base of your cock, braced while you breathe. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Then the Slow', 'Shallow After Carry', 'Slow in Her Pussy', 'Base Grip Slow', 'Brace the Shallow', 'Carry Then Shallow', 'Mouth After Lift', 'Hands After Lift', 'Only Shallow Now', 'Stroke Gone Short', 'Head Only Inside', 'Forearm Brace Slow', 'Belly Brace Slow', 'Knees Brace Slow', 'Hold the Slow', 'Breathe the Shallow', 'Still Mid Stroke', 'Slow and Braced', 'In to the Head', 'Last Shallow Stroke'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Shallow strokes', 'Slow', C('Partner circuit', ROUGH_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexEdging', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'edge-squat-then-still', ...C13, name: 'Squat Then Still', subject: 'Edging', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner squats, then you hold still',
    blurb: 'Partner squats beside her first, then you hold still inside her cunt and brace while you breathe.',
    about: 'Partner squats beside her start you close, already hard against her. Two days in three you finish with her mouth, your hands and tongue, teasing and massage. On the third you hold still deep in her pussy and brace while she squeezes, the head of your cock stopped inside her. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Squat Then Still', 'Hold Still Inside', 'Brace and Freeze', 'Hips Held Still', 'Still After Squats', 'Mouth After Squat', 'Hands After Squat', 'Deep and Motionless', 'Thumb Off Her Clit', 'Her Hips in Your Hands', 'Knees Brace Still', 'Back Brace Still', 'Breathe Inside Her', 'Cock Not Moving', 'Waist Hand Brace', 'Frozen Deep in Her', 'Partner Then Still', 'Freeze and Breathe', 'Still While She Squeezes', 'Last Still Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Hold still', 'Still', C('Partner circuit', ROUGH_PUSH, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexEdging', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'edge-stop-then-fuck', ...C13, name: 'Stop Then Fuck', subject: 'Edging', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then you stop',
    blurb: 'You start on her mouth, then you pull your cock out of her cunt, breathe, and leave the head of your cock sitting on her clit.',
    about: 'Every day starts with her mouth, your hands and your tongue, a tease and a massage while you are both down to skin. Then you pull out of her pussy, breathe, and leave the head of your cock sitting on her clit before you fuck her again. One day runs longer in the warm-up, the other in the stop. Level II and Level III hold every part longer.',
    names: ['Mouth Then the Stop', 'Stop Then Back In', 'Head Parked on Clit', 'Breathe Then Fuck', 'Grip Then Back', 'Pressed Hard on Her Clit', 'Harder Against Her Clit', 'Held Long on Her Clit', 'Clit and the Head', 'Still at Her Entrance', 'Pull Out to Breathe', 'Base Then In', 'Shallow Then Deep', 'Brace Then Thrust', 'Stop at the Entrance', 'Clit Then Stop', 'Hands Then Stop', 'Hold the Stop', 'Cock on Her Clit', 'Last Stop Fuck'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then stop', 'Mouth', poses('sexWarm', 5, 2), poses('sexEdging', 4, 2), { pref: 2 }, { pref: 2 }, 'Edging'),
      mean: warmThenLead('Mouth, then still', 'Still', poses('sexWarm', 5, 2), poses('sexEdging', 5, 2), { pref: 1 }, { pref: 2 }, 'Edging'),
    },
  },
  {
    id: 'edge-out-then-shallow', ...C13, name: 'Out Then Shallow', subject: 'Edging', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then shallow strokes',
    blurb: 'You open on her clit with your tongue, then you pull out and take only shallow strokes while you grip the base.',
    about: 'You open on her mouth and with your hands, tongue on her clit, a slow tease and a rub. Then you pull out and take only shallow strokes in her cunt while you grip the base of your cock. The two days change how long each part is held, and both end shallow. Level II and Level III hold every part longer.',
    names: ['Clit Then Shallow', 'Out Then the Head', 'Shallow in Her Cunt', 'Grip Through Shallow', 'Mouth Then Shallow', 'Hands Then Shallow', 'Shallow and Her Grip', 'Head Barely In Her', 'Head and Her Clit', 'Brace the Shallow Fuck', 'Slow at the Entrance', 'Only the Head In', 'Breathe on the Out', 'Hip Brace Shallow', 'Forearm Brace Shallow', 'Back to Shallow', 'Still Between Strokes', 'Shallow and Deep', 'Count the Shallow', 'Last Shallow Fuck'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then shallow', 'Mouth', poses('sexWarm', 5, 2), poses('sexEdging', 4, 2), { pref: 2 }, { pref: 2 }, 'Edging'),
      mean: warmThenLead('Mouth, then shallower', 'Shallow', poses('sexWarm', 5, 2), poses('sexEdging', 5, 2), { pref: 1 }, { pref: 2 }, 'Edging'),
    },
  },
  {
    id: 'edge-quick-stop', ...C13, name: 'Quick Stop', subject: 'Edging', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short mouth, then a short stop',
    blurb: 'A short one: her mouth first, then you pull out, grip the base, and fuck her again before either of you cools off.',
    about: 'A short one, still with her mouth and your hands first, tongue and a tease before you stop. Then you pull out, grip the base of your cock, and fuck her again before either of you cools off. One day is shorter on the warm-up, the other on the stop. Level II and Level III hold every part a little longer.',
    names: ['Quick Pull Out', 'Short Stop Fuck', 'Brief Brace', 'Fast Grip the Base', 'Short Mouth Stop', 'A Minute at Her Clit', 'Cool Off Stop', 'Quick Head on Clit', 'Brief Shallow', 'Short and Still', 'Fast Breathe Out', 'Quick Back In', 'Short Brace Fuck', 'Head Jerked Out', 'Base Grip Quick', 'Hip Brace Quick', 'Knees Brace Quick', 'Done After the Stop', 'Still at the Tip', 'Last Quick Stop'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Short mouth, then stop', 'Mouth', poses('sexWarm', 5, 2), poses('sexEdging', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Edging'),
      mean: warmThenLead('Shorter mouth, then stop', 'Stop', poses('sexWarm', 5, 1), poses('sexEdging', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Edging'),
    },
  },
  {
    id: 'edge-long-still', ...C13, name: 'Long Still', subject: 'Edging', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long mouth, then a long still hold',
    blurb: 'A long afternoon on her mouth and her cunt, holding still inside her when you are close, your hands braced on her hips.',
    about: 'This one takes the afternoon, and it still starts with her mouth, your hands and tongue, a tease and a long massage. Then you stay deep and hold still, or pull out to the head of your cock on her clit, and you take your time. One day lingers on the warm-up and the other on the still holds. Level II and Level III hold every part longer.',
    names: ['Long Still Inside', 'Afternoon Brace', 'Hours Holding Still', 'Slow Afternoon Stop', 'Long Pull Out', 'Unhurried Shallow', 'Held Still for Hours', 'Deep Still Hour', 'Palm Brace Long', 'Forearm Brace Long', 'Mouth Long Then Still', 'Long Stop Fuck', 'Long Head on Clit', 'Afternoon at the Base', 'Breathe the Hour', 'Still Without Rush', 'Long Freeze Inside', 'Brace the Hour', 'Deep and Long Still', 'Last Long Still'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Long mouth, then still', 'Mouth', poses('sexWarm', 5, 2), poses('sexEdging', 8, 2), { pref: 3 }, { pref: 3 }, 'Edging'),
      mean: warmThenLead('Longer still', 'Still', poses('sexWarm', 5, 2), poses('sexEdging', 8, 3), { pref: 3 }, { pref: 3 }, 'Edging'),
    },
  },
  {
    id: 'edge-stay-and-stop', ...C13, name: 'Stay and Stop', subject: 'Edging', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage two days, stopping on the third',
    blurb: 'On the third day you pull out of her pussy, breathe, and set the head of your cock back on her clit.',
    about: 'Two days in three you stay on her mouth, your hands and tongue, teasing and massage, hold after hold. On the third you pull out of her pussy, breathe, and set the head of your cock back on her clit, braced with a hand on her hip. You stay near her from one hold to the next. Level II and Level III hold every position longer.',
    names: ['Stay and the Stop', 'Inside Then Out', 'Head Resting on Clit', 'Brace on Her Hips', 'Stop and Stay Near', 'Head Set on Her Clit', 'Stop With Her Close', 'Mouth Then a Stop', 'Hands Then a Stop', 'Clit Then a Stop', 'Stop and Breathe There', 'Breathe on Her Clit', 'Grip at the Base', 'Shallow Against Her', 'Still With the Head', 'Back In After Breath', 'Belly Brace Hold', 'Knee Brace Hold', 'Stop Through It', 'Last Inside Stop'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 3), { pref: 2 }),
      lead: positionsOnly('Stop on her clit', 'Stop', poses('sexEdging', 8, 7), { pref: 2 }),
    },
  },
  {
    id: 'edge-pull-and-stay', ...C13, name: 'Pull and Stay', subject: 'Edging', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Hands and tongue, pulling out on the third',
    blurb: 'You pull out when the hold gets close, keep your hands on her hips, and go back in only after you have breathed.',
    about: 'Two days in three are her mouth, your hands and tongue, a tease and a massage, one hold into the next. On the third you pull out when you are close, keep your hands on her hips, and go back in only after you have breathed. The head of your cock stays on her clit while you brace. Level II and Level III hold every position longer.',
    names: ['Pull and Stay Near', 'Out and the Cock', 'Through the Pull Out', 'Hips Caught on the Out', 'Hips and the Out', 'Stay After the Out', 'Out While She Squeezes', 'Mouth Then Pull Out', 'Hands While You Slip Out', 'Clit Then Out', 'Head Held on Clit', 'Brace After Out', 'Back In After Out', 'Shallow After Out', 'Still After the Out', 'Side and the Out', 'Above and the Out', 'Deep Out Hold', 'Her Hips Held Out', 'Last Out Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Pull out and stay', 'Out', poses('sexEdging', 9, 4), { pref: 2 }),
    },
  },
  {
    id: 'edge-slow-and-deep', ...C13, name: 'Slow and Deep', subject: 'Edging', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tease and massage, shallow on the third',
    blurb: 'You slow the stroke until it is shallow, cock just inside her cunt, and you brace your forearms while you breathe.',
    about: 'Two days in three you use your mouth, your hands and your tongue, with teasing and massage between the holds. On the third you slow the stroke until it is shallow, cock just inside her cunt, and you brace your forearms while you breathe. You keep that shallow stroke through the holds. Level II and Level III hold every position longer.',
    names: ['Slow Stroke Held', 'Shallow and Her Cunt', 'Base in Your Hand', 'Stroke Cut Short', 'Slow Through It', 'Shallow Just Inside', 'Mouth Then Slow', 'Hands Then Slow', 'Behind Gone Shallow', 'Brace and the Slow', 'Her Hips Held Slow', 'Hand on the Base', 'Slow Inside Hold', 'Forearms on the Slow', 'Knees on the Slow', 'In Only the Head', 'Hold the Shallow', 'Slow With a Breath', 'Breathe the Slow Hold', 'Last Slow Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Shallow and slow', 'Slow', poses('sexEdging', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'edge-brace-and-hold', ...C13, name: 'Brace and Hold', subject: 'Edging', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Still and braced on the third day',
    blurb: 'You hold still deep in her pussy when either of you is close, hands braced, and you keep that brace until the hold ends.',
    about: 'Two days in three you are on her mouth, hands and tongue working, a tease and a massage. On the third you hold still deep in her pussy when either of you is close, hands braced, and you keep that brace until the hold ends. You freeze there and breathe. Level II and Level III hold every position longer.',
    names: ['Brace and Hold Still', 'Deep Freeze Hold', 'Hands Brace Her Hips', 'Belly Braced Deep', 'Forearm Brace Hold', 'Brace When She Clenches', 'Mouth Then Brace', 'Hands Then Brace', 'Still to the End', 'Brace Kept Deep', 'Freeze Deep in Her', 'Weight Braced Still', 'She Held Still', 'Thumb Off on Brace', 'Cock Held Motionless', 'Brace the Deep', 'Still While Close', 'Hold the Brace', 'Braced and Inside', 'Last Brace Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Brace and freeze', 'Brace', poses('sexEdging', 8, 4), { pref: 2 }),
    },
  },
  // ---- Massage (Phase 22 ticket 20b): 4 gym, 4 sex, 4 positions. Lead day is the oil; the other days are fucking. ----
  {
    id: 'massage-set-then-oil', ...C13, name: 'Set Then Oil', subject: 'Massage', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner work, oil every third day',
    blurb: 'You train with her first, then you oil her back and fuck her, your cock in her pussy, hands braced on her hips.',
    about: 'You train beside her first, squats and pushes, and then the day splits. Two days in three you finish by fucking her, cock in her pussy, one hold after another. On the third you oil her with your hands and forearms, work down her body, and fuck her with your cock in her pussy while you brace, and one hold she oils your chest and your cock. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Oil After the Set', 'Forearm Down Her Back', 'Circuit Then Oil', 'Knead Then Fuck', 'Glide Beside Her Spine', 'Oiled Palm on Her', 'Brace After Oil', 'Oil on Her Lower Back', 'Slick Before You Fuck', 'Set Then the Oil', 'Hands Oiled Deep', 'Cock In After Oil', 'Hip Brace Oiled', 'Knees Brace Oiled', 'Oil and Stay In', 'Back Shining Oil', 'Heel of the Hand', 'Long Glide Down', 'She Oils After Sets', 'Last Oil Set'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Oil her', 'Oil', C('Partner circuit', GYM_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexMassage', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'massage-sweat-then-hands', ...C13, name: 'Sweat Then Hands', subject: 'Massage', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, hands every third day',
    blurb: 'You sweat with her first, then your oiled hands and forearms work down her body and your cock goes in her cunt.',
    about: 'Sweat with her first, a short partner circuit, and then you fuck. Two days in three that fuck is plain, cock in her pussy, hold after hold. On the third your oiled hands and forearms work down her body and your cock goes in her cunt while you brace. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sweat Then the Oil', 'Oiled Hands Down Her', 'Forearm After Sweat', 'Knead After Sweat', 'Glide After Sweat', 'Hands Slick Down Her', 'Cock In While Sweaty', 'Fuck With Oil on You', 'Sweat and the Glide', 'Oil and Fuck Her', 'Brace the Oiled Fuck', 'Palm Heel Down Her', 'Both Hands Oiled', 'Cock After the Glide', 'Hip Hold Oiled', 'Sweaty Forearm', 'Oil on Her Shoulder', 'Hands Work Down', 'Stay Braced Oiled', 'Last Oil Hands'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Hands down her', 'Arms', C('Partner circuit', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexMassage', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'massage-lift-then-back', ...C13, name: 'Lift Then Back', subject: 'Massage', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries, then her back every third day',
    blurb: 'You carry beside her, then you oil the muscle beside her spine and fuck her from behind with your cock in her pussy.',
    about: 'You carry beside her, then the session turns to sex. Two days in three you fuck her, cock buried, changing the hold when it ends. On the third you oil the muscle beside her spine and fuck her from behind, your forearm gliding down her back. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Lift Then the Oil', 'Oil Beside Her Spine', 'Forearm After Carry', 'Knead After the Lift', 'Glide After Carry', 'Oil on the Long Muscle', 'Fuck After the Oil', 'Squat Then Oil Her', 'Spine Muscle Oiled', 'Brace Behind Her', 'Hips Held Oiled', 'Knees Under the Oil', 'Cock In From the Oil', 'Long Glide Spine', 'Heel Down Her Back', 'Oil Then From Behind', 'Carry Then the Glide', 'Back Soft Under Oil', 'Deep After the Oil', 'Last Back Oil'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('Oil her back', 'Back', C('Partner circuit', GYM_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexMassage', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'massage-squat-then-oil', ...C13, name: 'Squat Then Oil', subject: 'Massage', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats, then she oils you',
    blurb: 'Kiss squats first, then she oils your chest and your cock, and you fuck up into her cunt while you hold her hips.',
    about: 'Kiss squats first, close enough that you are already hard. Two days in three you fuck her after, cock in her cunt, one position then the next. On the third she oils your chest and your cock, and you fuck up into her while you hold her hips. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Squat Then Her Oil', 'She Oils Your Chest', 'She Oils Your Cock', 'Oil Then You Fuck Up', 'Kiss Then the Oil', 'Her Slick Hands on You', 'Fuck After the Oil Squat', 'Oiled Fist on You', 'Chest Glide Oil', 'She Sits Then You Fuck', 'Hold Her Hips Oiled', 'Fuck Up Into Her', 'Knees Outside Oil', 'Sit Brace Oil', 'Her Hands Slick', 'Oil Down Your Stomach', 'Cock Slick Then In', 'She Oils and You Fuck', 'Brace While She Oils', 'Last She Oils'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [1, 2, 3, 4] }), poses('sexFuck', 14, 0), { pref: 1 }),
      lead: gymThenSex('She oils you', 'Hers', C('Partner circuit', GYM_KISS, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexMassage', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'massage-oil-then-fuck', ...C13, name: 'Oil Then Fuck', subject: 'Massage', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Oil one day, fucking the other',
    blurb: 'You oil her with your hands and forearms, then you fuck her deep, and the other day you fuck her from the first hold.',
    about: 'One day you oil her with your hands and forearms, work down her body, and fuck her deep with your cock in her pussy. The other day you fuck her, cock in her pussy, from the first hold through the last. You hold it deep either way. Level II and Level III hold every part longer.',
    names: ['Oil Then the Fuck', 'Forearm Then Cock', 'Knead Then Deep', 'Glide Then In Her', 'Deep Fuck After Oil', 'Oil on Her Then In', 'Slick Forearm Then In', 'Heel Then Your Cock', 'Hands Oiled First', 'Oil Then You Fuck', 'Hold After the Oil', 'Deep After Glide', 'Cock Kept After Oil', 'Buried After the Glide', 'Buried After Oil', 'Last Oil Fuck', 'Palm Then the Cock', 'Spine Then Deep', 'Brace Then the Fuck', 'Oil Into Her Cunt'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Oil, then fuck', 'Oil', poses('sexMassage', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'massage-forearm-then-fuck', ...C13, name: 'Forearm Then Fuck', subject: 'Massage', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'A forearm, then a fuck',
    blurb: 'Your oiled forearm glides down her back into a fuck, and the other day your cock stays in her pussy the whole session.',
    about: 'One day your oiled forearm glides down the muscle beside her spine and you fuck her, cock kept in her pussy. The other day your cock stays in her pussy the whole session, hold after hold. She can oil your chest on the day with the forearm. Level II and Level III hold every part longer.',
    names: ['Forearm Then the Fuck', 'Glide Down Into Her', 'Oil the Long Muscle', 'Knead Then the Cock', 'Cock Kept in Her Cunt', 'Forearm Down the Muscle', 'Cock Stays Buried', 'Deep After Forearm', 'Heel of Forearm In', 'Brace After Glide', 'Spine to Her Cunt', 'Oil Then Thrust', 'Hold After Forearm', 'Buried the Whole Time', 'Cock Stays Oiled In', 'Glide Then a Thrust', 'Palm Glide Fuck', 'Hip Brace Forearm', 'Stay In After Oil', 'Last Forearm Fuck'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Forearm, then fuck', 'Arm', poses('sexMassage', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'massage-quick-oil', ...C13, name: 'Quick Oil', subject: 'Massage', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short oil, or a short fuck',
    blurb: 'A short one: you oil her, fuck her while you are both still warm, and the other day is a short fuck with your cock kept in.',
    about: 'A short one. One day you oil her fast, get your cock in her pussy, and brace before either of you cools off. The other day is a short fuck, cock in her, start to finish. Level II and Level III hold every part a little longer.',
    names: ['Quick Oil Her', 'Short Forearm Fuck', 'Fast Knead In', 'Brief Glide Fuck', 'Oil and Fuck Short', 'Short and Oiled', 'Quick Palm Oil', 'Short Fuck Kept In', 'Brief Fuck Oiled', 'Fast Hands Oil', 'Oil While You Are Hot', 'Short Brace Oil', 'Oil Then Done', 'Fast Deep Oil', 'Brief Spine Oil', 'Quick In Her Oil', 'Knees Brace Quick Oil', 'Hip Brace Quick Oil', 'Slick and Still Hot', 'Last Quick Oil'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Oil, then fuck', 'Oil', poses('sexMassage', 4, 2), poses('sexFuck', 8, 2), { pref: 1 }, { pref: 1 }),
      fuck: sexThenSex('Short fuck, then more', 'Fuck', poses('sexFuck', 6, 2), poses('sexFuck', 6, 2), { pref: 1 }, { pref: 1 }),
    },
  },
  {
    id: 'massage-long-oil', ...C13, name: 'Long Oil', subject: 'Massage', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long oil, or a long fuck',
    blurb: 'A long oiling, your forearms down her body and your cock in her cunt, and the other day is a long fuck held deep.',
    about: 'One day is oil on her back, your forearms and hands working down her, and your cock in her pussy for the afternoon. The other day is a long fuck, your cock kept deep in her pussy from the first hold to the last. You take your time on both and let the afternoon run. Level II and Level III hold every part longer.',
    names: ['Long Oil on Her Back', 'Afternoon Forearm', 'Long Glide Fuck', 'Hours of Oil', 'Slick the Long Fuck', 'Oil Down Her for Hours', 'Knead for Hours', 'Oil the Hour', 'Deep Long Oil Fuck', 'Unhurried Forearm', 'Long Palm Oil', 'Cock Kept Deep Oil', 'Slow Oil Fuck', 'Long Heel Glide', 'Brace the Long Oil', 'Spine for Hours', 'Oil and Stay Deep', 'Long Hands Down Her', 'Forearm Afternoon', 'Last Long Oil'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Oil, then fuck', 'Oil', poses('sexMassage', 4, 4), poses('sexFuck', 8, 3), { pref: 3 }, { pref: 3 }),
      fuck: sexThenSex('Long fuck, then more', 'Fuck', poses('sexFuck', 6, 3), poses('sexFuck', 6, 3), { pref: 3 }, { pref: 3 }),
    },
  },
  {
    id: 'massage-stay-oiled', ...C13, name: 'Stay Oiled', subject: 'Massage', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, oil on the third',
    blurb: 'Two days you fuck her hold after hold, and on the third your oiled hands work down her body with your cock in her pussy.',
    about: 'Two days in three you fuck her, cock in her pussy, one long hold after another. On the third your oiled hands work down her body with your cock still in her pussy, a hand braced on her hip. You stay inside her from one hold to the next. Level II and Level III hold every position longer.',
    names: ['Stay Oiled In', 'Oil and Inside', 'Forearm on Her Back', 'Knead While You Fuck', 'Glide on Her Skin', 'Oiled and Buried', 'Slick Cock Still In', 'Hands Oiled In', 'Stay in the Oil', 'Oil Across Her Hips', 'Palm on Her Hip', 'Brace While Oiled', 'Cock and the Oil', 'Deep Under the Oil', 'Deep and Oiled', 'Oil Between Strokes', 'Spine Under Your Palm', 'Heel on Her Back', 'Oil Through It', 'Last Oiled Hold'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Oil on her', 'Oil', poses('sexMassage', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'massage-hands-down-her', ...C13, name: 'Hands Down Her', subject: 'Massage', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, hands on the third',
    blurb: 'You keep your cock in her cunt, and on the third day your oiled hands and forearms hold the position while you fuck.',
    about: 'Two days in three are fucking, hold after hold, your cock in her cunt. On the third your oiled hands and forearms work down her body and hold her there while you fuck. You keep your cock in her between those holds. Level II and Level III hold every position longer.',
    names: ['Hands Down Her Oil', 'Forearms Down Her Back', 'Oiled Palm Hold', 'Knead and Stay In', 'Glide and the Cock', 'Hands Slick on Her Spine', 'Cock In Under Hands', 'Oil Under Your Palms', 'Heel Hold Down Her', 'Palms Braced on Her Hips', 'Stay Hands In', 'Deep Hands Hold', 'Oil Down to Her Hips', 'Both Palms Oiled', 'Hold Her Oiled', 'Spine Hands Hold', 'Cock Under Hands', 'Knees Brace Hands', 'Last Hands Oil', 'Hands Through It'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Hands down her', 'Hands', poses('sexMassage', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'massage-oiled-holds', ...C13, name: 'Oiled Holds', subject: 'Massage', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, oiled holds on the third',
    blurb: 'You fuck her through the holds, and on the third you oil her skin and stay inside her from one hold to the next.',
    about: 'Two days in three you fuck her and change the hold with your cock still in her. On the third you oil her skin and stay inside her, your hands and forearms working while you fuck. You change the hold without leaving her. Level II and Level III hold every position longer.',
    names: ['Oiled Hold In', 'Oil and Buried', 'Glide While Inside', 'Change While Oiled', 'Knead Her While In', 'Slick and Still Inside', 'Oil Between the Fucks', 'Forearm on Her Spine', 'Oil Worked Into Skin', 'Palm Circling Her Hip', 'Stay and the Oil', 'Deep Oiled Hold', 'Skin Slick Hold', 'Oil Smeared Down Her', 'Brace the Oiled', 'In and Oiled', 'Hold the Oil', 'Buried Oil Hold', 'Spine Hold Oil', 'Last Oiled In'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Oil and stay', 'Oil', poses('sexMassage', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'massage-she-oils-you', ...C13, name: 'She Oils You', subject: 'Massage', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, she oils you on the third',
    blurb: 'Two days you fuck her, and on the third she oils your chest and your cock, then sits on you while you fuck up into her.',
    about: 'Two days in three you fuck her, position after position, cock in her pussy. On the third she oils your chest and your cock, then she sits on you while you fuck up into her. You hold her hips while she is slick on you. Level II and Level III hold every position longer.',
    names: ['She Oils Your Stomach', 'Oil on Your Chest', 'Her Hands on Your Cock', 'Her Palms on Your Chest', 'Slick Hands Then In', 'Her Hands Then Your Cock', 'Slick Fist Then In', 'Fuck Up Into Her Cunt', 'Sit Brace Her Oil', 'Chest Oil Hold', 'You Fuck Up Oiled', 'Hips Held While Oiled', 'Knees Brace Her Oil', 'Deep While She Oils', 'Oil Down Your Chest', 'Her Fist on Your Cock', 'Then Into Her Cunt', 'Hold After Her Oil', 'Brace Under Her Oil', 'Last She Oils You'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 7), { pref: 1 }),
      lead: positionsOnly('She oils you', 'Hers', poses('sexMassage', 8, 4), { pref: 2 }),
    },
  },
  // ---- Strip and tease (Phase 22 ticket 20c): 4 gym, 4 sex, 4 positions. Lead day is the strip; the other days are fucking.
  // Positions stay one flow: sexTease on the lead day, sexFuck on the warm days. ----
  {
    id: 'tease-set-then-zip', ...C13, name: 'Set Then Zip', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner work, her zip every third day',
    blurb: 'You train with her first, then you unzip her dress and fuck her against the wall, hands on her ass, cock in her cunt.',
    about: 'You train beside her first, squats and pushes, and then the day splits. Two days in three you finish by fucking her, cock in her pussy, one hold after another. On the third you unzip her dress, peel her bra and drag her panties aside, and you grind your cock on her through the denim before you push into her cunt. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Zipper Down Her Back', 'Dress Off Her Arms', 'Bra Cups Down', 'Panties Hooked Aside', 'Both Hands on Her Bare Ass', 'Cock in Her at the Wall', 'Feet Planted in Her', 'Zipper Tab in Hand', 'Dress at Her Elbows', 'Cunt Around You There', 'Soft Knees at the Wall', 'Bare Ass in Both Hands', 'Zipper Between Her Shoulders', 'Dress at Her Waist', 'Bra Half Off Her Tits', 'Thrust on the Wall', 'Shoulder Blades on the Wall', 'Fingers on the Zipper', 'Panties Aside and Your Cock In', 'Jeans Still at Your Thighs'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Unzip her', 'Zip', C('Partner circuit', GYM_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexTease', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'tease-sweat-then-bra', ...C13, name: 'Sweat Then Bra', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, her bra every third day',
    blurb: 'You get the sweat on with her, then you unhook her bra and fuck her from behind, her tits in your hands.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three you finish by fucking her, cock in her pussy, hold after hold. On the third you unhook her bra, roll her nipples, and fuck her from behind with her tits in your hands. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Bra Clasp in Your Fingers', 'Nipples Rolled Bare', 'Denim in Her Cleft', 'Straps Off Her Shoulders', 'Hips Gripped From Behind', 'Jeans Wet From Her Drip', 'Bra Down Her Arms', 'Cock in From Behind', 'Chest Against Her Back', 'Panties Aside Behind Her', 'Soft Knees Behind Her', 'Tits Bare in Your Hands', 'Clasp Open at Her Back', 'Denim Soaked in the Cleft', 'Bra on the Floor', 'Standing Fuck Behind Her', 'Feet Planted Behind Her', 'Hands Locked on Her Hips', 'Cockhead in Wet Denim', 'Unhooked and Fucked'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Unhook her bra', 'Bra', C('Partner circuit', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexTease', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'tease-lift-then-panties', ...C13, name: 'Lift Then Panties', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries, then her panties every third day',
    blurb: 'You squat and carry beside her, then your teeth peel her panties down and your mouth goes on her pussy.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you fuck her, cock buried, changing the hold when it ends. On the third your teeth peel her panties down her thighs and your mouth goes on her pussy from behind. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Waistband in Your Teeth', 'Panties at Her Knees', 'Kneeling on Your Heels', 'Cotton Down Her Thighs', 'Mouth on Her From Behind', 'Teeth in the Cotton', 'Tongue Flat on Her Cunt', 'Hips Held From Your Kneel', 'Slow Drag Down Her Thighs', 'Cotton Stuck at Her Knees', 'Eating Her From Behind', 'Heels Braced Behind Her', 'Waistband in Your Mouth', 'Knees on the Floor Behind', 'Cunt Bare for Your Tongue', 'Teeth Walking Her Waistband', 'Face in Her From Below', 'Tongue Up Her Cunt', 'Panties Resting Mid-Thigh', 'Mouth on Her With Them Down'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Panties in your teeth', 'Panties', C('Partner circuit', GYM_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexTease', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'tease-grind-then-lap', ...C13, name: 'Grind Then Lap', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats, then her lap every third day',
    blurb: 'Kiss squats first, then you sit in the chair, her pussy grinding your cock through denim, and you fuck up into her cunt.',
    about: 'Kiss squats first, close enough that you are already hard. Two days in three you fuck her after, cock in her cunt, one position then the next. On the third you sit in the chair, her pussy grinding your cock through denim, and you fuck up into her cunt. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Tits Filling Your Face', 'Pussy Grinding Your Jeans', 'Hands Full of Her Ass', 'Chair Under the Grind', 'Panties Aside in Your Lap', 'Fucking Up Into Her', 'Denim Hot Under Her Slit', 'Zipper Open in the Chair', 'Facing You on Your Cock', 'Her Ass Toward You', 'Watching Her Back Grind', 'Chair Held by Your Feet', 'Jeans Soaked Under Her', 'Cock Up in Her Lap', 'Bra Off in Your Lap', 'Skirt on Your Thighs', 'Cunt Around You Seated', 'Grind Heavy in Your Lap', 'Denim Dark Under Her', 'Fuck Up With Her Ass Held'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Fuck her', 'Fuck', C('Partner circuit', GYM_THREE, { ...LIFT, values: [5, 6, 7], pref: 5 }), poses('sexFuck', 9, 7), { pref: 1 }),
      lead: gymThenSex('Grind in your lap', 'Lap', C('Partner circuit', GYM_KISS, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexTease', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'tease-zip-then-fuck', ...C13, name: 'Zip Then Fuck', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her zip one day, fucking the other',
    blurb: 'You unzip her, drag your cock along her slit, then you fuck her deep, and the other day you stay in her the whole way.',
    about: 'One day you unzip her, drag your cock along her slit, and fuck her deep. The other day you stay in her the whole way, cock in her pussy from the first hold through the last. You hold it deep either way. Level II and Level III hold every part longer.',
    names: ['Zipper Open to Her Waist', 'Cockhead on Her Slit', 'Skirt Up and Aside', 'Cups Below Her Tits', 'Buried to the Base', 'Pussy Around You Deep', 'Ass Around Your Cock', 'Denim Off and Cock In', 'Mouth on Her Inner Thigh', 'Shirt Over Her Tits', 'Cock Sunk Past the Cotton', 'Staying at Her Base', 'Cunt Gripping You', 'Dress Strap in Your Teeth', 'Fucking Her Skirt-Up', 'Hips Tilted on Your Cock', 'Slit Wet on Your Cockhead', 'Half Dressed and Deep', 'Cock Deep in Her Cunt', 'Both Cheeks in Your Grip'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Unzip, then fuck', 'Zip', poses('sexTease', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 1), poses('sexFuck', 6, 1), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'tease-bra-then-cock', ...C13, name: 'Bra Then Cock', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her bra, then a fuck',
    blurb: 'You unhook her bra and suck her tits, your cock in her cunt after, and the other day you fuck her pussy and her ass.',
    about: 'One day you unhook her bra and suck her tits, then your cock goes in her cunt. The other day you fuck her pussy and her ass and you stay buried. You take both days down to skin. Level II and Level III hold every part longer.',
    names: ['Nipple in Your Mouth', 'Clasp Open Beside Her', 'Cotton Soaked in Your Hand', 'Two Fingers in Her Pussy', 'Cups Under Her Tits', 'Thumb on Her Clit Through Cotton', 'Sucking Her With Fingers In', 'Clasp Open at Her Ribs', 'Blouse Off Her Shoulders', 'Cunt Wet on Your Fingers', 'Cock Deep in Her Pussy', 'Cock Deep in Her Ass', 'Bare Nipple in Your Mouth', 'Hand Down Her Panties', 'Bra Off Under Her Shirt', 'Fingers Crooked in Her', 'Mouth Full of Her Tit', 'Shirt Undone Beside Her', 'Clit Under Your Thumb on Cotton', 'Buried in Her Wet Cunt'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Bra, then cock', 'Bra', poses('sexTease', 4, 2), poses('sexFuck', 8, 0), { pref: 2 }, { pref: 2 }),
      fuck: sexThenSex('Fuck, then more', 'Fuck', poses('sexFuck', 6, 0), poses('sexFuck', 6, 0), { pref: 2 }, { pref: 2 }),
    },
  },
  {
    id: 'tease-quick-strip', ...C13, name: 'Quick Strip', subject: 'Strip and tease', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short strip, or a short fuck',
    blurb: 'A short one: you strip her to her panties and fuck her before either of you cools off.',
    about: 'A short one. One day you strip her to her panties and fuck her before either of you cools off. The other day is a short fuck, cock in her, start to finish. Level II and Level III hold every part a little longer.',
    names: ['Fast Zipper Down Her', 'Clasp Flicked Open', 'Panties Yanked to Mid-Thigh', 'Quick Denim Grind', 'Cock in While Still Warm', 'Skirt Flipped Up', 'Cotton Hooked Aside', 'Mouth on Wet Cotton', 'Strap Off Her Shoulder', 'In Her Before You Cool', 'Teeth on Her Waistband', 'Mouth on Her Tit Fast', 'Cockhead on Her Slit Fast', 'Deep Push Still Dressed', 'Cock Up From Her Lap', 'Panties Aside While Still Warm', 'Nipple Wet Under the Bra', 'Cock in Her on the Counter', 'Into Her Soaked Cunt', 'Buried in Her Warm Cunt'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Strip, then fuck', 'Strip', poses('sexTease', 4, 2), poses('sexFuck', 8, 2), { pref: 1 }, { pref: 1 }),
      fuck: sexThenSex('Short fuck, then more', 'Fuck', poses('sexFuck', 6, 2), poses('sexFuck', 6, 2), { pref: 1 }, { pref: 1 }),
    },
  },
  {
    id: 'tease-long-strip', ...C13, name: 'Long Strip', subject: 'Strip and tease', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long strip, or a long fuck',
    blurb: 'A long afternoon of peeling her clothes off, grinding through denim, and a long fuck with your cock kept deep.',
    about: 'One day is a long peel of her clothes, a grind through denim, and a long fuck with your cock kept deep. The other day you fuck her from the first hold to the last, cock in her pussy. You take your time on both and let the afternoon run. Level II and Level III hold every part longer.',
    names: ['Slow Zipper the Length of Her', 'Bra Open for a Long Suck', 'Denim Grind That Stays', 'Panties Drawn Down Slow', 'Lap Grind Kept Going', 'Dress Off by Inches', 'Long Suck on Her Tits', 'Cotton Soaked Through', 'Teeth Slow on Her Waistband', 'Cock at the Base in Her', 'Skirt Up for a Long Fuck', 'Mouth Rolling Her Stocking', 'Shirt Off Over Her Head', 'Fingers Under Her Skirt', 'Half Dressed All Afternoon', 'Mouth Through Soaked Cotton', 'Hands Cupping Her Bare Tits', 'Cockhead Wet Along Her Slit', 'Slow Grind in Dark Jeans', 'Deep With Her Clothes Off'],
    cycle: ['lead', 'fuck'],
    dayTypes: {
      lead: sexThenSex('Peel, then fuck', 'Peel', poses('sexTease', 4, 2), poses('sexFuck', 5, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }),
      fuck: sexThenSex('Long fuck, then more', 'Fuck', poses('sexFuck', 4, 2), poses('sexFuck', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }),
    },
  },
  {
    id: 'tease-stay-and-peel', ...C13, name: 'Stay and Peel', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, her panties on the third',
    blurb: 'You stay with her panties in your teeth and your mouth on her pussy, hold after hold.',
    about: 'Two days in three you fuck her, cock in her pussy, one long hold after another. On the third you stay with her panties in your teeth and your mouth on her pussy, hold after hold. Your tongue stays flat on her cunt from behind while you hold her ass. Level II and Level III hold every position longer.',
    names: ['Panties Held in Your Teeth', 'Cotton Mid-Thigh', 'Tongue Staying on Her Cunt', 'Waistband Between Your Teeth', 'Hips Rocking on Your Mouth', 'Kneeling With Panties Down', 'Cock Back Deep in Her', 'Cunt Around the Base', 'Face Buried Behind Her', 'Teeth Still in the Cotton', 'Eating Her and Staying Down', 'Panties Twisted at Her Knees', 'Tongue Flat From Behind', 'Hips Still for Your Mouth', 'Cunt on Your Tongue', 'Mouth Up From Your Heels', 'Pussy Open Over Your Mouth', 'Staying on Her With Them Peeled', 'Ass Held While You Eat Her', 'Cock Between the Licks'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Panties in your teeth', 'Peel', poses('sexTease', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'tease-skirt-up', ...C13, name: 'Skirt Up', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, her skirt on the third',
    blurb: 'You lift her skirt and grind your cock through her panties, and two days in three you fuck her deep.',
    about: 'Two days in three you fuck her deep, hold after hold, your cock in her cunt. On the third you lift her skirt and grind your cock through her panties, then you fuck her from the front. Her thighs stay open and your hands stay on her hips under that skirt. Level II and Level III hold every position longer.',
    names: ['Skirt Rucked to Her Waist', 'Thighs Open on the Counter', 'Grinding Through Her Panties', 'Cockhead Slick on Her Slit', 'Hips Pinned Under Your Hands', 'Fucking Her From the Front', 'Panties Aside Under the Skirt', 'Knees Open Off the Mattress', 'Cock Up Under the Skirt', 'Mound Hot Through Cotton', 'Cunt on the Counter', 'Skirt Bunched in Your Fist', 'Front Fuck Under the Skirt', 'Denim Against Her Panties', 'Hips Held So She Stays', 'Zip Open Under Her Skirt', 'Cock Kept Under the Skirt', 'Mouth on Her Bare Thigh', 'Cotton Aside at Her Cunt', 'Buried Under Her Skirt'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Skirt up', 'Skirt', poses('sexTease', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'tease-dry-holds', ...C13, name: 'Dry Holds', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, a clothed grind on the third',
    blurb: 'You grind your cock against her cunt through your clothes, hold after hold, and two days in three you fuck her deep.',
    about: 'Two days in three you fuck her and change the hold with your cock still in her. On the third you grind your cock against her cunt through your clothes, hold after hold. The denim stays pressed to her until you push in. Level II and Level III hold every position longer.',
    names: ['Denim Pressed to Her Cunt', 'Grind Through Jeans and Panties', 'Plank Over Her in Jeans', 'Fabric Soaked Between You', 'Cock on Her Clothed Slit', 'Hand Inside Her Panties', 'Spooned Grind in Jeans', 'Clit Under Wet Cotton', 'Cock in Past Open Jeans', 'Jeans Dark Where She Soaked', 'Dry Hump on Her Mound', 'Heat of Her Cunt Through Cotton', 'On Your Sides Still in Jeans', 'Cock Clothed in Her Cleft', 'Panties Wet on Your Thumb', 'Cotton Aside as You Push', 'Hips Rolling on Your Denim', 'Hard Against Her Clothes', 'Clit Through the Denim', 'Her Cunt Around You in Jeans'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 6), { pref: 1 }),
      lead: positionsOnly('Grind through clothes', 'Denim', poses('sexTease', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'tease-her-strip', ...C13, name: 'Her Strip', subject: 'Strip and tease', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Fucking two days, she strips on the third',
    blurb: 'You sit and watch her take her dress and her bra off, then your mouth is on her pussy, and two days in three you fuck her.',
    about: 'Two days in three you fuck her, position after position, cock in her pussy. On the third you sit and watch her take her dress and her bra off, then your mouth is on her pussy. She peels your jeans while you watch, and you fuck up into her as the dress drops. Level II and Level III hold every position longer.',
    names: ['Dress Coming Off for You', 'Her Bra in Her Own Hands', 'She Feeds Your Mouth Her Tit', 'Your Belt in Her Fingers', 'She Peels Your Jeans Down', 'Her Mouth Through Your Underwear', 'Watching Her Suck Your Cock', 'Panties Sliding on Your Shaft', 'Fucking Up as the Dress Drops', 'She Kneels Over Your Face', 'You Eat Her With Panties Aside', 'Your Shirt Open in Her Hands', 'Tits in Your Mouth as She Stands', 'Her Mouth on Your Bare Cock', 'She Unzips You at the Wall', 'Cock in Her With the Belt Open', 'Watching the Dress Hit the Floor', 'Two Fingers in Her Standing', 'Her Ass Heavy in Your Hands', 'Bare Cock Between Her Lips'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Fuck her', 'Fuck', poses('sexFuck', 12, 7), { pref: 1 }),
      lead: positionsOnly('She strips', 'Hers', poses('sexTease', 8, 4), { pref: 2 }),
    },
  },
  // ---- Shower and bath (Phase 22 ticket 20c): 4 gym, 4 sex, 4 positions. Catalogue 13. Sex days are warm, then shower. ----
  {
    id: 'shower-set-then-tile', ...C13, name: 'Set Then Tile', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, then the tile every third day',
    blurb: 'You train with her first, then you fuck her against the wet tile, palm on the glass, cock in her pussy.',
    about: 'You train with her first, a short partner circuit on two days and a longer one on the third. Two days in three you finish on her mouth, your hands and your tongue, with a tease and a massage. On the third you fuck her against the wet tile, soap her from her tits down to her cunt, and you keep your cock in her while you brace on the tub lip and the tile. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Palms Smearing the Glass', 'Tits Flat on the Pane', 'Palm by Her Head on the Tile', 'Foot Up on the Tub Lip', 'Cock Deep With Her Back on the Tile', 'Steam Running Off Her Back', 'Glass Fogged Around Her Palms', 'Wet Grip on Her Hip', 'Soft Knees on the Wet Floor', 'Palm Braced on the Tile', 'Fucking Her Into the Pane', 'Water Running Between Her Tits', 'Tub Lip Under That Foot', 'Hot Cunt Around You on Tile', 'Shoulder Blades Flat on Tile', 'Lean Shared on the Glass', 'Behind Her in the Shower Steam', 'Buried in Her on Soft Knees', 'The Tile Takes Your Push', 'Buried Against the Wet Pane'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her on the tile', 'Tile', C('Partner circuit', ROUGH_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexShower', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'shower-sweat-then-soap', ...C13, name: 'Sweat Then Soap', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, then soap every third day',
    blurb: 'You get the sweat on with her, then you soap her tits and her cunt and slide two fingers into her pussy.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three the rest is her mouth, your hands and tongue, teasing and a massage. On the third you soap her tits and her cunt and slide two fingers into her pussy. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Soap Slid Over Her Tits', 'Lather Worked to Her Cunt', 'Two Soapy Fingers in Her', 'Suds Across Her Shoulders', 'Slippery Nipples in Your Palms', 'Fingers Crooked in the Suds', 'Free Palm Flat on Tile', 'Her Cunt Slick With Soap', 'Soap Along Her Stomach', 'Suds Beading on Her Nipples', 'Soaping Her From the Side', 'Cunt Closing Around Your Fingers', 'Soap From Collarbone to Slit', 'Wet Tits Filling Your Hands', 'Lather Thick on Her Mound', 'Tile Under You While Soaping', 'Fingers In Under the Soap', 'Suds Worked Inside Her Pussy', 'Hands Traveling Her Front', 'A Handful of Suds on Her Cunt'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Soap her', 'Soap', C('Partner circuit', ROUGH_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexShower', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'shower-lift-then-tub', ...C13, name: 'Lift Then Tub', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries beside her, then the tub lip',
    blurb: 'You squat and carry beside her, then you fuck her on the tub lip, both hands on the porcelain, cock in her cunt.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you go to her mouth, your hands and tongue, a tease and a massage. On the third you fuck her on the tub lip, both hands on the porcelain, cock in her cunt. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Pelvis Set on the Porcelain', 'Both Hands on the Tub Lip', 'Kneeling in Between Her Feet', 'Her Cunt Dripping Onto You', 'Hauling Your Weight on the Tub', 'Her Feet Outside on the Floor', 'Cock in Her Over Porcelain', 'Knees on the Bath Mat', 'Cold Tub Lip in Your Hands', 'Open Knees on the Porcelain', 'Fuck Her From the Outside Kneel', 'Waterline at Her Calves', 'Hip Pulled to the Tub Lip', 'Porcelain Smeared From Her Cunt', 'Kneeling Outside and in Her', 'The Drive Off That Tub Lip', 'Her Cunt Level With Your Hips', 'Deep Over the White Tub Lip', 'Knuckles White on Porcelain', 'Her Ass Out Over the Tub'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her on the tub', 'Tub', C('Partner circuit', ROUGH_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexShower', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'shower-push-then-stream', ...C13, name: 'Push Then Stream', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner pushes, then the stream',
    blurb: 'Partner pushes first, then you hold the shower head on her clit and fuck her while the water beats there.',
    about: 'Partner pushes start you close, already hard against her. Two days in three you finish with her mouth, your hands and tongue, teasing and massage. On the third you hold the shower head on her clit and fuck her while the water beats there. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Stream Beating on Her Clit', 'Shower Head Between Her Thighs', 'Spray Focused on Her Cunt', 'Fucking Her While Water Hits', 'Your Hand Aiming That Stream', 'Cock in Her Under the Spray', 'Tile Palm and the Shower Head', 'Her Clit Under Hard Spray', 'Stream Running Down Her Slit', 'Water Off Her Hair on You', 'Cock in Her Cleft in the Hair Wash', 'Free Hand on Her Soapy Clit', 'Her Fist Locked on the Rail', 'Spray on Her Over the Bench', 'Her Cunt Glistening in Spray', 'Thrusts While the Water Beats', 'Her Clit Taking That Spray', 'Stream Across Her Open Cunt', 'Shower Head Close on Her Clit', 'Cock in Her Wet Ass Behind'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Stream on her clit', 'Stream', C('Partner circuit', ROUGH_PUSH, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexShower', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'shower-tile-then-hold', ...C13, name: 'Tile Then Hold', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then the tile',
    blurb: 'Her mouth and your hands first, then you fuck her against the tile and hold your cock deep in her wet cunt.',
    about: 'Every day starts with her mouth, your hands and your tongue, a tease and a massage while you are both down to skin. Then you fuck her against the tile and hold your cock deep in her wet cunt. One day runs longer in the warm-up, the other against the tile. Level II and Level III hold every part longer.',
    names: ['Tongue Under the Stream on Her', 'Her Mouth on Your Cock in Steam', 'Her Tits Cold Against Glass', 'Deep Fuck Against Wet Tile', 'Fingers in Her Cunt on Tile', 'Held Hard on Fogged Glass', 'Her Back Sliding on Wet Tile', 'One Hand on Her Hip and on the Tile', 'Cunt Gripping You on the Tile', 'Water Between Your Mouth and Her', 'Soapy Palm With Your Cock in Her', 'Soft Knees Palm on the Tile', 'Her Wet Tits Pressed to Glass', 'Stay Buried on the Wet Tile', 'Cock Deep With Stream on Her', 'Thrust Braced on the Tub Lip', 'Shoulder Planted on the Tile', 'Fucking Her Against the Glass', 'Eating Her With Water on You', 'Your Base Against the Tile'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then tile', 'Mouth', poses('sexWarm', 5, 2), poses('sexShower', 4, 2), { pref: 2 }, { pref: 2 }, 'Shower'),
      mean: warmThenLead('Mouth, then more tile', 'Tile', poses('sexWarm', 5, 2), poses('sexShower', 5, 2), { pref: 1 }, { pref: 2 }, 'Shower'),
    },
  },
  {
    id: 'shower-soap-then-hold', ...C13, name: 'Soap Then Hold', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then soap under the stream',
    blurb: 'Her mouth and your tongue first, then you soap her cunt and fuck her under the stream with your cock kept in her.',
    about: 'You open on her mouth and with your hands, tongue on her clit, a slow tease and a massage. Then you soap her cunt and fuck her under the stream with your cock kept in her. The two days change how long each part is held, and both end under the water. Level II and Level III hold every part longer.',
    names: ['Soap Worked Into Her Cunt', 'Tongue on Her Sudsy Thighs', 'Fucking Her Under the Stream', 'Cock Kept in Her Soapy Cunt', 'Lather on Her Tits While Deep', 'Soapy Fingers Beside Your Cock', 'Her Clit Slick Under Soap', 'Stream Running Off Your Back', 'Suds Between Her Ass and You', 'Water on Her Tits While Eating', 'Soapy Cunt Tight on Your Cock', 'Soapy Grip on Her Hips', 'Buried Deep Under the Stream', 'Soapy Nipple Between Your Lips', 'One Hand Soap and One on Tile', 'Her Cunt Slippery on Your Cock', 'Water Beading on Soapy Tits', 'Two Fingers Sliding in Lather', 'Cock in With Soap on Her Ass', 'Kept in Her Under the Water'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then soap', 'Mouth', poses('sexWarm', 5, 2), poses('sexShower', 4, 2), { pref: 2 }, { pref: 2 }, 'Shower'),
      mean: warmThenLead('Mouth, then the stream', 'Soap', poses('sexWarm', 5, 2), poses('sexShower', 5, 2), { pref: 1 }, { pref: 2 }, 'Shower'),
    },
  },
  {
    id: 'shower-quick-and-wet', ...C13, name: 'Quick and Wet', subject: 'Shower and bath', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short mouth, then a short shower',
    blurb: 'A short one: her mouth first, then you fuck her under the shower before either of you cools off.',
    about: 'A short one, still with her mouth and your hands first, tongue and a tease before you get under the water. Then you fuck her under the shower before either of you cools off. One day is shorter on the warm-up, the other on the fuck. Level II and Level III hold every part a little longer.',
    names: ['Quick Fuck Against Wet Tile', 'Fast Soap Across Her Tits', 'Short Burst on Her Clit', 'Brief and Buried in Steam', 'Cock in Her Before Cooling', 'Fast Palm on the Glass', 'Short Kneel Between Her Feet', 'Water Rushed Over Her Cunt', 'Quick Thrust on the Tub Lip', 'Still Warm Under the Stream', 'Fast Soapy Fingers in Her', 'A Brief Fuck on the Glass', 'Cock in Her Under Short Spray', 'Short Buried on the Wet Floor', 'Mouth on Her Tits in the Water', 'Fast Behind Her on the Tile', 'A Short Thrust in the Suds', 'Rail in Hand and Cock in Fast', 'Buried on the Warm Wet Tile', 'In Her as the Water Runs'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Short mouth, then shower', 'Mouth', poses('sexWarm', 5, 2), poses('sexShower', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Shower'),
      mean: warmThenLead('Shorter mouth, then shower', 'Wet', poses('sexWarm', 5, 1), poses('sexShower', 4, 2), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Shower'),
    },
  },
  {
    id: 'shower-long-steam', ...C13, name: 'Long Steam', subject: 'Shower and bath', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long mouth, then a long steam',
    blurb: 'A long afternoon of her mouth, then you fuck her in the shower and in the bath, cock in her pussy, without a rush.',
    about: 'This one takes the afternoon, and it still starts with her mouth, your hands and tongue, a tease and a long massage. Then you fuck her in the shower and in the bath, cock in her pussy, without a rush. One day lingers on the warm-up and the other in the steam. Level II and Level III hold every part longer.',
    names: ['Long Fuck Flat on the Tile', 'Hours of Steam on Her Back', 'Hours With Stream on Her Clit', 'Slow Soap Over Tits and Cunt', 'Unhurried Strokes in Her Cunt', 'Long Fuck Braced on the Tub Lip', 'Afternoon Fog on the Glass', 'Her Tits Wet Through the Long Fuck', 'Slow Fuck With Palm on Tile', 'Long Kneel Outside the Tub', 'Water On Her the Whole Fuck', 'Soapy Fingers in Her for Ages', 'Your Cock Deep in the Warm Bath', 'Stream on Her Through the Fuck', 'A Long Eat of Her in the Tub', 'Her Wet Ass Pressed to Your Hips', 'Long Drive Braced on the Tile', 'Suds Left on Her for Hours', 'Buried Deep in the Warm Tub', 'Cock in Her Beneath the Water'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Long mouth, then steam', 'Mouth', poses('sexWarm', 4, 1), poses('sexShower', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Shower'),
      mean: warmThenLead('Longer in the water', 'Steam', poses('sexWarm', 3, 2), poses('sexShower', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Shower'),
    },
  },
  {
    id: 'shower-stay-on-tile', ...C13, name: 'Stay on Tile', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage two days, the tile on the third',
    blurb: 'You stay against the wet tile with your cock in her pussy, one long hold after another.',
    about: 'Two days in three you stay on her mouth, your hands and tongue, teasing and massage, hold after hold. On the third you stay against the wet tile with your cock in her pussy, one long hold after another. Her back stays on the tile and your palm stays on the glass. Level II and Level III hold every position longer.',
    names: ['Staying Deep on the Tile', 'Her Back Kept on Wet Tile', 'Palm Staying Flat on the Tile', 'Chest on the Glass and Cock Deep', 'Her Hip Held Into the Tile', 'Water Running While You Stay', 'Her Cunt Around You on Tile', 'Both Feet on the Wet Floor', 'Soft Knees and Still Inside', 'Cock in Her Against Fogged Glass', 'One Foot on the Lip Inside Her', 'Wet Shoulder Blades on the Tile', 'Still Buried With Steam on You', 'Grip on Her Hip at the Tile', 'The Base of You on the Tile', 'Cock in Her With Water on Her Belly', 'You Lean Your Weight on the Glass', 'Soft Knees for the Whole Stay', 'Her Pussy Hot on the Tile', 'In Her With Your Palm on Glass'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 3), { pref: 3, values: [1, 2, 3, 4] }),
      lead: positionsOnly('Stay on the tile', 'Tile', poses('sexShower', 8, 7), { pref: 2 }),
    },
  },
  {
    id: 'shower-soap-and-stay', ...C13, name: 'Soap and Stay', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Hands and tongue, soap on the third',
    blurb: 'You soap her from her shoulders to her cunt and stay with your fingers in her pussy, hold after hold.',
    about: 'Two days in three are her mouth, your hands and tongue, a tease and a massage, one hold into the next. On the third you soap her from her shoulders to her cunt and stay with your fingers in her pussy, hold after hold. The lather stays on her tits while your fingers stay in. Level II and Level III hold every position longer.',
    names: ['Soap Left on Her Cunt', 'Fingers Kept in Her Soapy Cunt', 'Lather Thick Across Her Tits', 'Suds Between Your Hand and Her', 'Fingers Staying Up in Her', 'Fingers in Her as Soap Runs', 'Her Mound White With Suds', 'Fingers in Her Palm on Tile', 'Slippery Thumb on Her Clit', 'Soapy Tits Against Your Chest', 'Two Fingers Held Up in Her', 'Lather Down the Crack of Her', 'Soap Sitting on Her Clit', 'Suds Dripping From Her Nipples', 'Soapy Fingers Still in Her Pussy', 'Fingers in Her Cunt From Beside', 'Her Cunt Gripping Your Suds', 'Fingers in Her Soap on Her Ass', 'Soaping Her Under the Stream', 'Cock and Fingers in the Suds'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Soap and stay', 'Soap', poses('sexShower', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'shower-tub-and-hips', ...C13, name: 'Tub and Hips', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tease and massage, the tub lip on the third',
    blurb: 'Your cock slides into her over the tub lip, her hips in your hands, one hold after another.',
    about: 'Two days in three you use your mouth, your hands and your tongue, with teasing and massage between the holds. On the third your cock slides into her over the tub lip, her hips in your hands, one hold after another. You kneel on the mat and keep one hand on the porcelain. Level II and Level III hold every position longer.',
    names: ['Her Hips Hauled Over the Lip', 'Cock Sliding In Over Porcelain', 'Her Ass in Your Hands at the Tub', 'Her Chest and Arms Over the Lip', 'Kneeling Behind Her on the Mat', 'Tub Lip in One Hand Her Hip', 'Driving Hard Off the Porcelain', 'Her Hips Raised to Your Cock', 'Cock in Her With Water at Her Waist', 'Spooned Behind Her in the Tub', 'Her Top Knee on the Tub Wall', 'Fucking Her Along the Tub Floor', 'Her Hips Bridged Up to You', 'Tub Lip Crushed in Your Fist', 'Her Wet Ass Against Your Thighs', 'Squatting Behind Her in Water', 'Her Hips Open in the Water', 'Lip in One Hand Hip in the Other', 'Staying Inside Over Porcelain', 'Her Hips Up Clear of the Water'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Over the tub lip', 'Tub', poses('sexShower', 8, 3), { pref: 2 }),
    },
  },
  {
    id: 'shower-stream-on-her', ...C13, name: 'Stream on Her', subject: 'Shower and bath', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth two days, the stream on the third',
    blurb: 'You hold the stream on her clit and fuck her from behind, and you watch the water run down her ass.',
    about: 'Two days in three you are on her mouth, hands and tongue working, a tease and a massage. On the third you hold the stream on her clit and fuck her from behind, and you watch the water run down her ass. The shower head stays on her cunt while one palm braces on the tile. Level II and Level III hold every position longer.',
    names: ['Stream Held Hard on Her Clit', 'Shower Head Up Under Her', 'Water Beating Through the Fuck', 'Spray on Her Cunt From Behind', 'Kneeling With Stream and Tile', 'Her Clit Under the Beating', 'Shower Head Aimed at Her Clit', 'Watching Water Run Her Ass', 'Her Hands and Knees in the Stream', 'In Her While She Grips the Rail', 'Water Running Off Her Onto You', 'Her Clit Glistening Under Spray', 'The Stream Close as You Fuck', 'Her Pussy Wet From the Shower Head', 'Cock in Her Stream in Her Crack', 'Spray on Her Clit From the Bench', 'You Aim the Stream at Her Cunt', 'Thrusting as Water Hits Her Cunt', 'One Palm Bracing One Hand Streaming', 'Deep in Her Under That Stream'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 3), { pref: 2 }),
      lead: positionsOnly('Stream on her', 'Stream', poses('sexShower', 8, 4), { pref: 2 }),
    },
  },
  // ---- Pool (Phase 22 ticket 20d): 4 gym, 4 sex, 4 positions. Catalogue 13. Sex days are warm, then pool. ----
  {
    id: 'pool-set-then-wall', ...C13, name: 'Set Then Wall', subject: 'Pool', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, then the wall every third day',
    blurb: 'You train with her first, then you stand at the pool wall and fuck her pussy, one hand on the coping.',
    about: 'You train with her first, a short partner circuit on two days and a longer one on the third. Two days in three you finish on her mouth, your hands and your tongue, with a tease and a massage. On the third you stand at the pool wall and fuck her pussy with a palm on the coping, kneel upright with her on the shallow step, or take her on the lounger beside the water, and the jet or your fingers find her clit. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Her Back on the Pool Wall', 'Palm Flat on the Coping', 'Cock Deep at Her Wall', 'Water Sitting at Your Hips', 'Hip Hauled Into You', 'Knees Soft in the Water', 'Facing Her in the Water', 'Her Palms on the Stone', 'Ass Tipped at the Coping', 'From Behind at the Wall', 'A Cheek in Your Hand', 'Cold Water and Her Cunt', 'Coping Under Your Palm', 'Slow Then Harder at the Wall', 'Her Heat Around You There', 'Stomach Cold and Pussy Hot', 'Both Feet Planted in the Pool', 'Hand on the Stone Beside Hers', 'Waist-Deep and Inside Her', 'Buried With the Coping Held'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her at the wall', 'Wall', C('Partner circuit', ROUGH_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexPool', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'pool-sweat-then-step', ...C13, name: 'Sweat Then Step', subject: 'Pool', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, then the step every third day',
    blurb: 'You get the sweat on with her, then you kneel upright with her on the shallow step and fuck her there.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three the rest is her mouth, your hands and tongue, teasing and a massage. On the third you kneel upright with her on the shallow step and fuck her there, cock in her cunt, or you take her at the wall and on the lounger. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Both Kneeling Upright on the Step', 'She Kneels Onto Your Cock', 'Shallow Water on That Step', 'Wet Tits on Your Chest', 'One Palm Planted on the Deck', 'Her Ass Filling Your Hands', 'Fucking Her From Your Hips', 'Thighs Against Yours on the Step', 'Chests Up in the Shallow', 'Cock Above That Shallow', 'Hand Off Her Ass Onto the Deck', 'Pulling Her Down on the Step', 'Face to Face on That Step', 'Slow and Deep From Your Hips', 'Her Pussy Gripping on the Step', 'One Hand Back on Her Ass', 'Deck Hot Under Your Palm', 'Knees on the Wide Top Step', 'Tits Wet Against Your Chest', 'Buried From a Kneel There'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her on the step', 'Step', C('Partner circuit', ROUGH_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexPool', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'pool-lift-then-lounge', ...C13, name: 'Lift Then Lounge', subject: 'Pool', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries beside her, then the lounger',
    blurb: 'You squat and carry beside her, then you kneel at the lounger and fuck her, cock in her cunt.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you go to her mouth, your hands and tongue, a tease and a massage. On the third you kneel at the lounger and fuck her, cock in her cunt, or you stand at the wall and kneel with her on the shallow step. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['On Her Back on the Lounger', 'Kneeling Between Her Feet', 'Ass at the End of the Cushion', 'Cock Sinking Into Her There', 'Frame Held While You Fuck', 'Face Down Along the Cushion', 'Hips at the Lounger End', 'Her Back Bare in the Night Air', 'Kneeling Behind Her on the Deck', 'One Hand on the Frame', 'Watching Her Cunt Take You', 'Sun on Her Wet Tits There', 'Slow Then Deep on the Cushion', 'Her Mouth Beside the Lounger', 'On Her Side Along the Cushion', 'Cock in Her Mouth on the Cushion', 'Up on Your Knees on the Cushion', 'She Stands Wet on the Deck', 'Fucking Her From the Lounger', 'Eyes on Where You Enter Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her on the lounger', 'Lounge', C('Partner circuit', ROUGH_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexPool', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'pool-push-then-jet', ...C13, name: 'Push Then Jet', subject: 'Pool', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner pushes, then the jet',
    blurb: 'Partner pushes first, then you hold her on the jet and rub her clit under the water.',
    about: 'Partner pushes start you close, already hard against her. Two days in three you finish with her mouth, your hands and tongue, teasing and massage. On the third you hold her on the jet and rub her clit under the water, and you fuck her at the wall and on the step. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Jet Hammering Her Clit', 'Her Back on the Wall for the Jet', 'Hip Held So She Stays on It', 'Fingers Hot on Her Cunt', 'Both of You at the Ladder', 'Her Hands Locked on the Rails', 'Rubbing Her Under the Water', 'Bikini Bow in Your Fingers', 'Cups Falling Off Her Tits', 'A Tit Heavy in Your Palm', 'Bottoms Untied at Her Side', 'Cupping Her Cunt at Her Hip', 'Waist-Deep With Your Hand', 'Her Mouth Open on the Jet', 'Clit Jumping Under Your Fingers', 'A Rail in Your Free Hand', 'Sun on the Shallow Over Her Lap', 'Circles on Her Clit There', 'Kneeling Beside Her on the Step', 'Watching Her Hips Roll Into It'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Jet on her clit', 'Jet', C('Partner circuit', ROUGH_PUSH, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexPool', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'pool-wall-then-hold', ...C13, name: 'Wall Then Hold', subject: 'Pool', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then the wall',
    blurb: 'Her mouth and your hands first, then you fuck her at the pool wall and keep your cock deep in her cunt.',
    about: 'Every day starts with her mouth, your hands and your tongue, a tease and a massage while you are both down to skin. Then you fuck her at the pool wall and keep your cock deep in her cunt, and you take her on the shallow step when the hold changes. One day runs longer in the warm-up, the other at the wall. Level II and Level III hold every part longer.',
    names: ['Tongue on Her Before the Wall', 'Her Mouth on Your Cock First', 'Then Buried at the Wall', 'Cock Kept Deep in the Water', 'Palm and Her Hip at Once', 'Longer on the Pool Wall', 'Longer With Her Mouth First', 'Water Between Your Stomach and Her', 'Grip on the Coping While In', 'Her Cunt Hot in That Cold', 'Facing the Stone While You Fuck', 'Cheek Gripped From Behind', 'Feet Planted and Fucking Her', 'Slow Strokes Then Harder There', 'Stay Buried at the Coping', 'Her Tits Wet Against the Wall', 'Hand Hauling Her Hip In', 'Your Base Against Her There', 'Wall at Her Back While You Fuck', 'Held Deep in That Pool Cold'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then wall', 'Mouth', poses('sexWarm', 5, 2), poses('sexPool', 4, 2), { pref: 2 }, { pref: 2 }, 'Pool'),
      mean: warmThenLead('Mouth, then more wall', 'Wall', poses('sexWarm', 5, 2), poses('sexPool', 5, 2), { pref: 1 }, { pref: 2 }, 'Pool'),
    },
  },
  {
    id: 'pool-step-then-hold', ...C13, name: 'Step Then Hold', subject: 'Pool', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then the step',
    blurb: 'Her mouth and your tongue first, then you fuck her on the shallow step and stay in her pussy.',
    about: 'You open on her mouth and with your hands, tongue on her clit, a slow tease and a massage. Then you fuck her on the shallow step and stay in her pussy, and you fuck her at the wall when that hold comes. The two days change how long each part is held, and both end on the step. Level II and Level III hold every part longer.',
    names: ['Tongue on Her Clit Then the Step', 'Mouth First Then the Shallow', 'Then Both Kneeling There', 'She Sinks Onto You Upright', 'Fucking Her From That Kneel', 'Chests Up and Your Cock In', 'Palm on the Deck While Inside', 'Ass in Both Hands on the Step', 'Longer on That Top Step', 'Hands on Her Then the Step', 'Thighs Hot Against Yours There', 'Shallow Water Around Her Cunt', 'Stay Inside From the Kneel', 'Hips Rolling in the Shallow', 'Her Tits on Your Chest There', 'Slow Kneel Then Harder', 'Deck Under Your Hand While In', 'Watching Her Take You Kneeling', 'Heat Around You on the Step', 'Deep From the Top Step'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then step', 'Mouth', poses('sexWarm', 5, 2), poses('sexPool', 4, 2), { pref: 2 }, { pref: 2 }, 'Pool'),
      mean: warmThenLead('Mouth, then the step', 'Step', poses('sexWarm', 5, 2), poses('sexPool', 5, 2), { pref: 1 }, { pref: 2 }, 'Pool'),
    },
  },
  {
    id: 'pool-quick-soak', ...C13, name: 'Quick Soak', subject: 'Pool', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short mouth, then a short soak',
    blurb: 'A short one: her mouth first, then you fuck her at the wall before either of you cools off.',
    about: 'A short one, still with her mouth and your hands first, tongue and a tease before you get in the water. Then you fuck her at the wall before either of you cools off. One day is shorter on the warm-up, the other on the fuck. Level II and Level III hold every part a little longer.',
    names: ['Quick Fuck at the Wall', 'Fast Palm on the Coping', 'Short and Buried in the Pool', 'Brief Kneel on the Top Step', 'Cock in Her Before You Cool', 'Fast Jet on Her Clit', 'Short Rub in the Shallow', 'Quick Tit in Your Palm', 'Bikini Off in a Hurry', 'Still Warm Against the Wall', 'A Brief Fuck on the Lounger', 'Fast From Behind at the Coping', 'Rails Grabbed and Cock In Her', 'Quick and Deep in the Cold', 'Her Cunt Before You Cool Off', 'Fast Circles on Her Clit', 'Short Stay Against the Wall', 'In Her on the Cushion Fast', 'Buried While the Water Moves', 'Coping in Hand and Cock In'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Short mouth, then pool', 'Mouth', poses('sexWarm', 5, 2), poses('sexPool', 4, 4), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Pool'),
      mean: warmThenLead('Shorter mouth, then pool', 'Soak', poses('sexWarm', 5, 1), poses('sexPool', 4, 4), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Pool'),
    },
  },
  {
    id: 'pool-long-soak', ...C13, name: 'Long Soak', subject: 'Pool', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long mouth, then a long soak',
    blurb: 'A long afternoon of her mouth, then you fuck her in the pool and on the lounger, cock in her pussy.',
    about: 'This one takes the afternoon, and it still starts with her mouth, your hands and tongue, a tease and a long massage. Then you fuck her in the pool and on the lounger, cock in her pussy. One day lingers on the warm-up and the other in the water. Level II and Level III hold every part longer.',
    names: ['Long Fuck at the Pool Wall', 'Hours With Her on the Step', 'Afternoon on the Lounger', 'Slow Strokes in the Pool', 'Unhurried at the Coping', 'Her Tits Wet the Whole Time', 'Long Rub on Her Clit', 'Jet on Her Clit for Ages', 'Cock Deep Through the Afternoon', 'Unhurried Kneel on the Top Step', 'Long Kneel Beside Her Hip', 'Palm on the Coping for Hours', 'Sun on Her Through the Fuck', 'Slow Kneel on the Wide Step', 'Lounger Fuck That Keeps Going', 'Cold Water the Whole Hour', 'Her Cunt Hot for Those Hours', 'Hands on Her Hips All Afternoon', 'Bikini Off Then the Long Fuck', 'Buried Deep on the Lounger'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Long mouth, then soak', 'Mouth', poses('sexWarm', 4, 1), poses('sexPool', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Pool'),
      mean: warmThenLead('Longer in the pool', 'Soak', poses('sexWarm', 3, 2), poses('sexPool', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Pool'),
    },
  },
  {
    id: 'pool-stay-on-wall', ...C13, name: 'Stay on the Wall', subject: 'Pool', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage two days, the wall on the third',
    blurb: 'You stay at the pool wall with your cock in her pussy, one long hold after another.',
    about: 'Two days in three you stay on her mouth, your hands and tongue, teasing and massage, hold after hold. On the third you stay at the pool wall with your cock in her pussy, one long hold after another. Your palm stays on the coping and her cunt stays around you. Level II and Level III hold every position longer.',
    names: ['Staying Deep at the Wall', 'Her Back Kept on the Wall', 'Palm Staying on the Coping', 'Cock in Her Against the Stone', 'Hip Held Into the Wall', 'Water at Your Hips the Whole Stay', 'Her Cunt Around You at the Wall', 'Both Feet on the Pool Floor', 'From Behind and Kept Inside', 'Cheek Kept in Your Hand', 'Her Palms Beside Yours on the Stone', 'Cold on Your Stomach While Inside', 'Grip on Her Hip at the Wall', 'Your Base in Her at the Wall', 'Slow Then Hard and Staying There', 'Her Tits Wet at the Wall', 'One Hand Flat on the Pool Wall', 'Ass Shoved Back Onto Your Hips', 'Stay Buried in That Cold Water', 'In Her With the Coping Held'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 9, 3), { pref: 2 }),
      lead: positionsOnly('Stay on the wall', 'Wall', poses('sexPool', 8, 7), { pref: 2 }),
    },
  },
  {
    id: 'pool-step-and-stay', ...C13, name: 'Step and Stay', subject: 'Pool', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Hands and tongue, the step on the third',
    blurb: 'You stay on the shallow step with your cock in her cunt, hold after hold.',
    about: 'Two days in three are her mouth, your hands and tongue, a tease and a massage, one hold into the next. On the third you stay on the shallow step with your cock in her cunt, hold after hold. You kneel upright with her and keep a palm on the deck. Level II and Level III hold every position longer.',
    names: ['Staying on the Top Step', 'Her Cunt Kept in the Shallow', 'Kneeling Upright and Inside Her', 'She Stays on Your Cock There', 'Shallow Water While You Stay', 'Hips Held on the Top Step', 'Fucking From the Kneel and Staying', 'Chests Up for the Whole Stay', 'Both Knees in That Shallow', 'Tits Against You on the Step', 'Palm on the Deck and Your Cock In', 'Thighs Pressed in the Shallow', 'Stay Inside Her From Your Hips', 'Her Ass in Your Hands on the Step', 'Face to Face and Staying In', 'Deck Under Your Palm the Whole Stay', 'Pulling Her Down and Staying In', 'Wide Step Under Both of You', 'Her Grip on You While You Stay', 'Deep in the Shallow With Her'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Stay on the step', 'Step', poses('sexPool', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'pool-lounge-and-hips', ...C13, name: 'Lounge and Hips', subject: 'Pool', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tease and massage, the lounger on the third',
    blurb: 'Your cock slides into her on the lounger, her hips in your hands, one hold after another.',
    about: 'Two days in three you use your mouth, your hands and your tongue, with teasing and massage between the holds. On the third your cock slides into her on the lounger, her hips in your hands, one hold after another. You kneel at the cushion and keep one hand on the frame. Level II and Level III hold every position longer.',
    names: ['Her Hips Hauled on the Lounger', 'Cock In With Her Hips in Hand', 'Kneeling Up Between Her Hips', 'Frame in One Hand and Her Hip', 'Sun on Her While You Hold Those Hips', 'Face Up on the Cushion Under You', 'Hips at the End and You In', 'Driving Into Her on That Cushion', 'Wet From the Pool and Open for You', 'One Hand Locked on Her Hip', 'Night Air on Her Bare Back', 'Face Down With Those Hips Held', 'Behind Her Hips on the Deck', 'The Cushion Under Her Hips', 'Slow With Her Hips in Your Hands', 'Eyes on Her Hips as You Fuck', 'Knees on the Deck at Those Hips', 'Buried While Her Hips Come to You', 'Lounger Frame Under Your Hand', 'In Her With Her Hips Held'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('On the lounger', 'Lounge', poses('sexPool', 8, 5), { pref: 2 }),
    },
  },
  {
    id: 'pool-jet-on-her', ...C13, name: 'Jet on Her', subject: 'Pool', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth two days, the jet on the third',
    blurb: 'You hold her on the jet and rub her clit, and you fuck her at the wall between those holds.',
    about: 'Two days in three you are on her mouth, hands and tongue working, a tease and a massage. On the third you hold her on the jet and rub her clit, and you fuck her at the wall between those holds. The jet stays on her cunt while one hand holds her hip. Level II and Level III hold every position longer.',
    names: ['Jet Held Hard on Her Clit', 'Your Fingers Beside That Jet', 'Hip Pinned So She Stays on It', 'Her Clit Under the Return Jet', 'Your Hand Under the Water There', 'Her Clit at the Ladder Rails', 'Bikini Top Off in Your Fist', 'Bare Tit in the Cold Pool', 'Bottoms Off and Her Cunt Cupped', 'Standing at Her Hip in the Pool', 'Clit Rubbed on the Top Step', 'Shallow Water Over Her Lap', 'Kneeling at the Lounger on Her Clit', 'Thumb Slow Beside the Cushion', 'Watching That Jet Hit Her Clit', 'Her Mouth Open Under the Jet', 'Coping Under Your Free Hand', 'She Soaks Your Fingers There', 'Circles Kept on Her Clit', 'Hot Cunt Against the Cold Pool'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Jet on her', 'Jet', poses('sexPool', 8, 4), { pref: 2 }),
    },
  },
  // ---- Hot tub (Phase 22 ticket 20d): 4 gym, 4 sex, 4 positions. Catalogue 13. Sex days are warm, then hot tub. ----
  {
    id: 'hottub-set-then-seat', ...C13, name: 'Set Then Seat', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit, then the seat every third day',
    blurb: 'You train with her first, then you sit in the seat and fuck up into her, bubbles at your chest.',
    about: 'You train with her first, a short partner circuit on two days and a longer one on the third. Two days in three you finish on her mouth, your hands and your tongue, with a tease and a massage. On the third you fuck her in the seat with the bubbles at your chest, she reclines face up in the lounger or you recline there and fuck up into her, or you take her on the cover beside the tub, and your hand stays on her cunt. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Sitting Deep in the Molded Seat', 'Bubbles Crowding Your Chest', 'Fucking Up in the Hot Seat', 'Her Knees on the Seat Beside You', 'The Seat Back at Your Shoulders', 'Wet Tits Up in the Steam', 'She Sits Down Into the Bubbles', 'Your Cock Up in That Heat', 'Hand on the Tub Rim While You Fuck', 'Sideways and Onto Your Cock', 'Her Legs Together on the Seat', 'Your Arm Around Her Waist There', 'She Faces Away on Your Lap', 'Far Jet on Her Tits in the Seat', 'Her Feet Down on the Tub Floor', 'She Kneels Upright on the Seat', 'Her Hands on the Rim Chest Up', 'You Stand Behind Her in the Heat', 'You Kneel Up and She Stands', 'Buried to the Base in the Seat'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her in the seat', 'Seat', C('Partner circuit', ROUGH_WORK, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexHottub', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'hottub-sweat-then-bubbles', ...C13, name: 'Sweat Then Bubbles', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Sweat first, then the bubbles every third day',
    blurb: 'You get the sweat on with her, then you untie her bikini under the bubbles and cup her cunt.',
    about: 'You get the sweat on beside her before anyone is naked. Two days in three the rest is her mouth, your hands and tongue, teasing and a massage. On the third you untie her bikini under the bubbles and cup her cunt, and you fuck her in the seat and on the cover. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['Bikini Untied Under the Bubbles', 'Your Hand Kept on Her Cunt', 'Sitting Side by Side in the Heat', 'Her Tits Clear of the Bubbles', 'The Crotch Jet on Her Clit', 'Next Seat With Her Hip Held', 'She Stands Beside Your Seat', 'Rubbing Her Clit in the Heat', 'Bubbles Breaking on Your Wrist', 'Her Stomach Under Your Eyes', 'Both of You on the Outer Step', 'Her Knees Open on That Step', 'Circles on Her Clit in the Steam', 'The Shell Under Your Free Hand', 'Her Hips Rolling on Your Hand', 'Your Palm on Her Cunt in the Heat', 'Steam on Her Tits While You Rub', 'Slow Rub From the Hot Seat', 'She Pushes Her Cunt on Your Hand', 'Cold Air on Your Face in the Tub'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Under the bubbles', 'Bubbles', C('Partner circuit', ROUGH_STRONG, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexHottub', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'hottub-lift-then-cover', ...C13, name: 'Lift Then Cover', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Carries beside her, then the cover',
    blurb: 'You squat and carry beside her, then you fuck her on the cover beside the tub, cock in her cunt.',
    about: 'You squat and carry beside her, her weight in your arms, and then the day splits. Two days in three you go to her mouth, your hands and tongue, a tease and a massage. On the third you fuck her on the cover beside the tub, cock in her cunt, or you take her in the seat and in the lounger. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['On Her Back on the Closed Cover', 'Standing on the Ground Between Her', 'Your Cock Sinking In Beside the Tub', 'Both Hands Hauling Her Hips', 'Face Down on the Closed Cover', 'Her Cheek Turned on the Cover', 'Standing Behind Her at the Cover', 'Her Ass Bare in the Cold Air', 'Steam Hitting Your Side There', 'On Her Side Along the Cover', 'Her Top Knee Drawn Up There', 'That Top Thigh in Your Hand', 'You Sit on the Closed Cover', 'She Stands Wet Between Your Knees', 'You Pull Her Onto Your Cock', 'Your Hand on the Cover While In', 'Her Wet Tits in the Cold Air', 'Deep and Slow Beside the Steam', 'Her Hips at the End of the Cover', 'Eyes on Her Cunt Beside the Tub'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her on the cover', 'Cover', C('Partner circuit', ROUGH_LIFT, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexHottub', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'hottub-push-then-heat', ...C13, name: 'Push Then Heat', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'reps', 'holds'],
    split: 'Partner pushes, then the lounger',
    blurb: 'Partner pushes first, then she reclines face up in the lounger and you fuck her from the front.',
    about: 'Partner pushes start you close, already hard against her. Two days in three you finish with her mouth, your hands and tongue, teasing and massage. On the third she reclines face up in the lounger and you fuck her from the front, or you recline and fuck up into her. Level II adds reps to the partner work. Level III holds every position longer.',
    names: ['She Reclines Face Up There', 'Her Head on the Headrest', 'A Jet Beating on Her Tits', 'Her Knees Open in the Hot Water', 'You Fuck Her From the Front There', 'Lounger Side Held in Your Hand', 'You Recline and Fuck Up Into Her', 'She Sits Down as You Lie Back', 'Hot Water at Your Chest There', 'Her Knees Outside Your Hips There', 'Her Tits Dropping Toward Your Mouth', 'The Headrest Behind Your Head', 'You Meet Her Drop in the Lounger', 'Her Face Up in That Lounger', 'Your Face Up While You Fuck Up', 'Bubbles Bursting Around Your Ribs', 'Her Hip in Your Hand at the Lounger', 'Slow Then Deep in That Lounger', 'Steam Rolling Over the Lounger', 'Your Cock Up Under Her There'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: gymThenSex('Mouth and hands', 'Warm', C('Partner circuit', ROUGH_THREE, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexWarm', 8, 2), { pref: 1 }),
      lead: gymThenSex('Fuck her in the lounger', 'Heat', C('Partner circuit', ROUGH_PUSH, { ...LIFT, values: [2, 3, 4, 5, 6] }), poses('sexHottub', 4, 2), { pref: 2 }),
    },
  },
  {
    id: 'hottub-seat-then-hold', ...C13, name: 'Seat Then Hold', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then the seat',
    blurb: 'Her mouth and your hands first, then you fuck her in the seat and keep your cock deep in her cunt.',
    about: 'Every day starts with her mouth, your hands and your tongue, a tease and a massage while you are both down to skin. Then you fuck her in the seat and keep your cock deep in her cunt, and your hand stays on her under the bubbles when the hold changes. One day runs longer in the warm-up, the other in the seat. Level II and Level III hold every part longer.',
    names: ['Her Mouth on You Before the Seat', 'Then Buried in the Hot Seat', 'Your Cock Kept in the Bubbles', 'The Seat Back and Your Cock', 'Longer Buried in That Seat', 'Longer on Her Mouth Before It', 'Fucking Up and Staying in Her', 'Her Cunt Hot Around You There', 'Sideways and Kept Inside Her', 'On Your Lap Facing Away Deep', 'Tub Rim in Your Hand While Buried', 'Bubbles Crowding Your Stomach', 'Her Wet Tits on Your Arm', 'Her Far Thigh Held in the Seat', 'Her Feet Down in the Hot Water', 'That Heat Gripping Your Cock', 'A Slow Roll Then Harder There', 'You Stay in Her in That Seat', 'She Folds Onto the Rim There', 'Hand on the Rim and Cock in Her'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then seat', 'Mouth', poses('sexWarm', 5, 2), poses('sexHottub', 4, 2), { pref: 2 }, { pref: 2 }, 'Hot tub'),
      mean: warmThenLead('Mouth, then more seat', 'Seat', poses('sexWarm', 5, 2), poses('sexHottub', 5, 2), { pref: 1 }, { pref: 2 }, 'Hot tub'),
    },
  },
  {
    id: 'hottub-bubble-then-hold', ...C13, name: 'Bubble Then Hold', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth first, then the bubbles',
    blurb: 'Her mouth and your tongue first, then your hand stays on her cunt under the bubbles while you fuck her.',
    about: 'You open on her mouth and with your hands, tongue on her clit, a slow tease and a massage. Then your hand stays on her cunt under the bubbles while you fuck her, and you keep your cock in her in the seat. The two days change how long each part is held, and both end in that heat. Level II and Level III hold every part longer.',
    names: ['Your Tongue on Her Then the Heat', 'Your Hand on Her Cunt Under Bubbles', 'Bubbles at Your Chest While Inside', 'Her Bikini Off Under the Water', 'Seat Jet on Her Clit While You Fuck', 'Her Hip Held Onto That Jet', 'She Stands Hot at Your Shoulder', 'The Rub Kept Up in the Seat', 'Longer Under Those Bubbles', 'Her Mouth First Then Her Cunt', 'Your Fingers Where She Is Slick', 'Steam on Her Tits While Inside', 'Side by Side With Your Hand There', 'Her Hips Pushing Into Your Palm', 'That Crotch Jet Through the Hold', 'The Next Seat Holding Her On It', 'Cold Air and Her Cunt on Your Hand', 'You Stay on Her Clit in the Heat', 'Bubbles Breaking Over Her Tits', 'Your Cock in Her Under the Bubbles'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Mouth, then bubbles', 'Mouth', poses('sexWarm', 5, 2), poses('sexHottub', 4, 2), { pref: 2 }, { pref: 2 }, 'Hot tub'),
      mean: warmThenLead('Mouth, then the heat', 'Bubbles', poses('sexWarm', 5, 2), poses('sexHottub', 5, 2), { pref: 1 }, { pref: 2 }, 'Hot tub'),
    },
  },
  {
    id: 'hottub-quick-steam', ...C13, name: 'Quick Steam', subject: 'Hot tub', minutes: [22, 30], levers: [null, 'holds', 'holds'],
    split: 'A short mouth, then a short steam',
    blurb: 'A short one: her mouth first, then you fuck her in the seat before either of you cools off.',
    about: 'A short one, still with her mouth and your hands first, tongue and a tease before you get in the heat. Then you fuck her in the seat before either of you cools off. One day is shorter on the warm-up, the other on the fuck. Level II and Level III hold every part a little longer.',
    names: ['A Quick Fuck in the Hot Seat', 'Fast Hand Under Those Bubbles', 'A Short Jet Burst on Her Clit', 'Brief and Buried in the Heat', 'In Her Cunt Before the Heat Fades', 'Fast Fuck Up From the Seat', 'A Short Recline in the Lounger', 'Steam and a Fast Thrust in Her', 'A Quick Fuck on the Cover', 'Still Warm in That Hot Seat', 'Her Bikini Off in a Rush', 'A Brief Fuck Among the Bubbles', 'The Jet Hits and Your Cock In', 'Short and Deep in the Hot Seat', 'Her Cunt in the Steam and Fast', 'Fast Strokes From That Seat', 'The Cover and a Short Fuck', 'Her Hip Grabbed in the Heat', 'In Her as Those Bubbles Rise', 'Buried in the Warm Hot Seat'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Short mouth, then tub', 'Mouth', poses('sexWarm', 5, 2), poses('sexHottub', 4, 4), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Hot tub'),
      mean: warmThenLead('Shorter mouth, then tub', 'Steam', poses('sexWarm', 5, 1), poses('sexHottub', 4, 4), { values: [1, 2], pref: 1 }, { values: [1, 2], pref: 1 }, 'Hot tub'),
    },
  },
  {
    id: 'hottub-long-heat', ...C13, name: 'Long Heat', subject: 'Hot tub', minutes: [46, 54], levers: [null, 'holds', 'holds'],
    split: 'A long mouth, then a long heat',
    blurb: 'A long afternoon of her mouth, then you fuck her in the hot tub and on the cover, cock in her pussy.',
    about: 'This one takes the afternoon, and it still starts with her mouth, your hands and tongue, a tease and a long massage. Then you fuck her in the hot tub and on the cover, cock in her pussy. One day lingers on the warm-up and the other in the heat. Level II and Level III hold every part longer.',
    names: ['A Long Fuck in the Hot Seat', 'Hours of Bubbles on Her Skin', 'A Long Afternoon in the Lounger', 'Slow Heat Around Your Cock', 'Unhurried Strokes in That Seat', 'A Long Fuck on the Closed Cover', 'Her Tits in the Steam for Hours', 'Your Hand on Her Cunt All Afternoon', 'The Jet on Her Through the Heat', 'Your Cock Deep in the Warm Seat', 'Face Up in the Lounger for Ages', 'Fucking Up Through the Afternoon', 'The Cover Beside the Tub for Hours', 'Bubbles Left Shining on Her Skin', 'A Slow Lap Fuck in the Hot Seat', 'Steam Over You the Whole Afternoon', 'Her Cunt Hot for That Hour', 'Her Hips Held in the Long Heat', 'One Long Recline and Your Cock In', 'Buried Deep in That Tub Seat'],
    cycle: ['open', 'mean'],
    dayTypes: {
      open: warmThenLead('Long mouth, then heat', 'Mouth', poses('sexWarm', 4, 1), poses('sexHottub', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Hot tub'),
      mean: warmThenLead('Longer in the heat', 'Heat', poses('sexWarm', 3, 2), poses('sexHottub', 4, 2), { pref: 5, values: [1, 2, 3, 4, 5] }, { pref: 5, values: [1, 2, 3, 4, 5] }, 'Hot tub'),
    },
  },
  {
    id: 'hottub-stay-in-seat', ...C13, name: 'Stay in the Seat', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Massage two days, the seat on the third',
    blurb: 'You stay in the seat with your cock in her pussy, one long hold after another.',
    about: 'Two days in three you stay on her mouth, your hands and tongue, teasing and massage, hold after hold. On the third you stay in the seat with your cock in her pussy, one long hold after another. The bubbles stay at your chest and her cunt stays around you. Level II and Level III hold every position longer.',
    names: ['Staying Deep in the Hot Seat', 'Her Cunt Kept Hot Around You', 'Bubbles Rising While You Stay', 'Fucking Up and Staying Put', 'The Seat Back for the Whole Stay', 'Sideways in the Seat and Staying', 'Her Legs Together While You Stay', 'On Your Lap Away and Staying In', 'The Tub Rim Held for That Stay', 'Her Wet Tits on You While In', 'That Heat Around You the Whole Stay', 'Both of You Sat in That Seat', 'Slow and Deep and Staying There', 'Her Hips Held Down in the Seat', 'The Far Jet on Her Tits as You Stay', 'Her Feet on the Floor and You In', 'Water at Your Chest for That Stay', 'Your Hand on the Rim the Whole Stay', 'She Sinks and You Stay Up in Her', 'Inside Her in That Hot Seat'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Stay in the seat', 'Seat', poses('sexHottub', 8, 7), { pref: 2 }),
    },
  },
  {
    id: 'hottub-bubbles-and-stay', ...C13, name: 'Bubbles and Stay', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Hands and tongue, the bubbles on the third',
    blurb: 'You keep your hand on her cunt under the bubbles, hold after hold, and you fuck her in the seat.',
    about: 'Two days in three are her mouth, your hands and tongue, a tease and a massage, one hold into the next. On the third you keep your hand on her cunt under the bubbles, hold after hold, and you fuck her in the seat. The jet stays on her clit while your palm stays on her. Level II and Level III hold every position longer.',
    names: ['Your Hand Staying on Her Cunt', 'Bubbles Left Thick on Her', 'Her Clit Under Your Hand in the Heat', 'Bikini Off and Your Hand Staying', 'The Jet Staying on Her Clit', 'Her Hip Held to That Seat Jet', 'Side by Side for That Stay', 'Your Fingers Kept on Her Cunt', 'She Stays Standing Beside the Seat', 'The Rub Staying Under the Water', 'Steam on You While Your Hand Stays', 'Her Cunt Hot on Your Fingers There', 'The Next Seat and the Jet Stays', 'Your Palm on Her the Whole Stay', 'Bubbles at Your Chest and on Her', 'Her Hips Rolling Against Your Hand', 'Cold Air While Your Hand Works Her', 'Slick Heat Under Those Bubbles', 'Staying on Her Clit in the Seat', 'Your Hand and Your Cock in the Heat'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 3), { pref: 2 }),
      lead: positionsOnly('Bubbles and stay', 'Bubbles', poses('sexHottub', 8, 4), { pref: 2 }),
    },
  },
  {
    id: 'hottub-cover-and-hips', ...C13, name: 'Cover and Hips', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Tease and massage, the cover on the third',
    blurb: 'Your cock slides into her on the cover, her hips in your hands, one hold after another.',
    about: 'Two days in three you use your mouth, your hands and your tongue, with teasing and massage between the holds. On the third your cock slides into her on the cover, her hips in your hands, one hold after another. You stand on the ground beside the tub and keep both hands on her hips. Level II and Level III hold every position longer.',
    names: ['Her Hips Set on the Cover', 'Your Cock In Beside the Hot Tub', 'Those Hips Held in the Cold Air', 'Standing at Her Hips on the Ground', 'The Cover Warm Under Her Back', 'Face Up There With Her Hips Held', 'Steam Beside Her Open Hips', 'Her Top Thigh and Her Hip in Hand', 'Behind Her Hips at the Cover', 'Her Ass in the Cold and Hips Yours', 'Sitting on the Cover Inside Her', 'She Stands and You Hold Her Hips', 'Deep With Her Hips Pulled to You', 'Both Hands Locked at Her Hips', 'Her Cheek on the Cover Hips Yours', 'Slow at Her Hips Beside the Tub', 'Wet Tits and Her Hips Open There', 'The Cover Under One Hand Her Hip', 'Driving Hard at Her Hips There', 'In Her With Those Hips Held'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 3 }),
      lead: positionsOnly('On the cover', 'Cover', poses('sexHottub', 8, 5), { pref: 2 }),
    },
  },
  {
    id: 'hottub-jet-in-seat', ...C13, name: 'Jet in the Seat', subject: 'Hot tub', minutes: [31, 40], levers: [null, 'holds', 'holds'],
    split: 'Her mouth two days, the seat jet on the third',
    blurb: 'You hold her on the seat jet and fuck up into her, and you watch her tits in the steam.',
    about: 'Two days in three you are on her mouth, hands and tongue working, a tease and a massage. On the third you hold her on the seat jet and fuck up into her, and you watch her tits in the steam. The jet stays on her clit while you stay in the seat. Level II and Level III hold every position longer.',
    names: ['The Seat Jet Hammering Her Clit', 'You Sat in the Next Seat', 'Her Hip Held to the Crotch Jet', 'Bubbles Thick Around That Jet', 'Her Clit Taking the Seat Jet', 'Your Hand on Her as the Jet Hits', 'Her Tits Shaking Over That Jet', 'Her Mouth Open in the Steam', 'The Tub Rim Held Beside the Jet', 'She Stays Put on That Jet', 'Side by Side Where the Jets Hit', 'Bikini Untied and the Jet on Her', 'Your Hand Working With the Jet', 'Her Hot Clit Under That Jet', 'Her Knees Open on the Seat Jet', 'Water at Her Chest on That Jet', 'Watching Her Shake on the Jet', 'Bubbles Crowding Around the Jet', 'Her Hip Under Your Hand on It', 'Fucking Her While the Jet Hits'],
    cycle: ['warm', 'warm', 'lead'],
    dayTypes: {
      warm: positionsOnly('Mouth, hands, massage', 'Warm', poses('sexWarm', 8, 4), { pref: 2 }),
      lead: positionsOnly('Jet in the seat', 'Jet', poses('sexHottub', 8, 4), { pref: 2 }),
    },
  },
];
