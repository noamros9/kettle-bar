// After dark, Phase 18 (#185): the new After dark subjects, family Mixed. The first 30 After dark programs (Phase 16)
// stay in configs/mixed.js. Couple programs (`couple: true`) are sessions for two, him and her, mostly the same moves
// for both, from catalogue 10's couple exercises; they stay out of build your own and random workouts.
// Mixed rules hold: every main block tagged with its family, two families or more a day, no abs after a flow.
// Partner work is Strength or Cardio & combat; teasing, dares and massage are Mind & body flows; positions are a
// Cardio & combat flow of timed holds, held longer at Levels II and III.
const { S, SS, C, E, A, T, L, F } = require('./shared.js');

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

module.exports = [
  // ---- Couples (ticket 3): 14 build up, 6 alternate; 4 are 30-day programs ----
  {
    id: 'sweat-together', ...COUPLE, name: 'Sweat Together', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Partner circuit / partner strength, then tease and positions', blurb: 'Your first couple workout: a partner circuit, a slow dance, then into bed for the finish.',
    about: 'The way in. One day is a partner circuit, squats holding hands, high-five push-ups and sit-up claps, round after round; the other is partner strength done slowly together. Every session then slows down: a slow dance or a dare, and a few positions held long enough to count as work. Level II adds reps, Level III makes every hold longer.',
    names: ['First Date', 'Second Date', 'Third Date', 'Hand in Hand', 'Side by Side', 'Face to Face', 'Heart Rate Up', 'Breathless', 'Warm Bodies', 'Sweat Equity', 'Steamed Up', 'Glow', 'Flushed', 'Heated', 'Melting', 'Dripping', 'Afterglow', 'Lights Out', 'Sheets', 'Together'],
    cycle: ['circuit', 'strength'],
    dayTypes: {
      circuit: buildUp('Partner circuit', 'Circuit', C('Partner circuit', ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerLower?'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare'], ['positions', 'positions']),
      strength: buildUp('Partner strength', 'Strength', S('Partner strength', ['partnerLower', 'partnerUpper', 'partnerHold'], LIFT), ['dare', 'slow_dance?'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'foreplay-fitness', ...COUPLE, name: 'Foreplay Fitness', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Kiss reps / dares, then positions', blurb: 'Every rep is foreplay: kiss squats and kiss push-ups, dares between rounds, positions to finish.',
    about: 'A workout that never quite lets you forget where it\'s heading. Kiss squats and kiss push-ups put your faces together every rep; a dare drawn by the timer comes between rounds. The tease block slows things right down, and the session ends in positions held as long as your legs allow. Level II adds reps and Level III holds everything longer.',
    names: ['Warm-up Act', 'Opening Move', 'First Kiss', 'Lip Service', 'Slow Hands', 'Close Call', 'Almost', 'Not Yet', 'Wait for It', 'Patience', 'Getting Warmer', 'Hot and Cold', 'Tease', 'Under the Skin', 'Simmer', 'Boil Over', 'Can\'t Wait', 'Now', 'Finally', 'Encore'],
    cycle: ['kiss', 'dares'],
    dayTypes: {
      kiss: buildUp('Kiss reps', 'Kiss', C('Kiss circuit', ['kiss_squat', 'kiss_pushup', 'partnerCore', 'dare?'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare_neck'], ['positions', 'positions']),
      dares: buildUp('Dares', 'Dares', C('Dare circuit', ['partnerLower', 'dare', 'partnerUpper', 'dare'], { ...COND, values: [2, 3, 4, 5] }), ['dare_whisper', 'dare_eyes_closed'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'strip-circuit', ...COUPLE, name: 'Strip Circuit', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Strip circuit / strip EMOM, then positions', blurb: 'Lose the round, lose a layer: a partner circuit with a strip forfeit after every round.',
    about: 'Every round ends in a forfeit: whoever did fewer reps or broke the hold first takes off one layer of the winner\'s choosing. One day is a circuit of partner squats, push-ups and holds, the other an EMOM where you race each other inside each minute. By the end nobody is wearing much, and the positions block takes care of the rest. Both later levels add reps.',
    names: ['Coat Check', 'Shoes Off', 'Socks Too', 'Top Button', 'Unzipped', 'Belt Loose', 'Off the Shoulder', 'Shirtless', 'Down to This', 'Lace', 'Straps', 'Last Layer', 'Birthday Suit', 'Bare', 'Nothing On', 'Skin', 'Exposed', 'Full Monty', 'In the Buff', 'Dressed Down'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: buildUp('Strip circuit', 'Circuit', C('Strip circuit', ['partnerLower', 'partnerUpper', 'partnerHold', 'strip_round'], { ...COND, values: [3, 4, 5, 6] }), ['dare_undress'], ['positions', 'positions']),
      emom: buildUp('Strip EMOM', 'EMOM', E('Strip EMOM', ['partnerLower', 'partnerUpper', 'partnerCore', 'strip_round'], { ...COND, values: [12, 14, 16, 18, 20] }), ['dare_undress', 'dare_touch?'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'kiss-me-reps', ...COUPLE, name: 'Kiss Me Reps', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Kiss squats / kiss push-ups, then positions', blurb: 'A kiss at the bottom of every squat and every push-up, then a slow finish together.',
    about: 'Built around the kiss reps. One day leads with kiss squats and mirror lunges for the legs, the other with kiss push-ups and wheelbarrow walks for the upper body, both in straight sets so you can take your time at the bottom. Then a slow dance, and positions chosen for being face to face. Level II adds reps, Level III holds everything longer.',
    names: ['Peck', 'Smooch', 'Kiss Me Quick', 'Kiss Me Slow', 'Pucker Up', 'Lip Lock', 'French', 'Butterfly Kiss', 'Eskimo Kiss', 'Neck Kiss', 'Collarbone', 'Earlobe', 'Bite', 'Breath', 'Linger', 'Mouth to Mouth', 'Kiss Chase', 'Sealed', 'Kissed All Over', 'Goodnight Kiss'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: buildUp('Kiss squats', 'Legs', S('Kiss legs', ['kiss_squat', 'mirror_lunge', 'partner_bridge'], LIFT), ['slow_dance'], ['positionsSlow', 'positionsSlow']),
      upper: buildUp('Kiss push-ups', 'Upper', S('Kiss upper', ['kiss_pushup', 'wheelbarrow_walk', 'plank_taps'], LIFT), ['slow_dance', 'dare_no_hands?'], ['positionsSlow', 'positions']),
    },
  },
  {
    id: 'lift-me-up', ...COUPLE, name: 'Lift Me Up', subject: 'Couples', minutes: [28, 33], levers: [null, 'holds', 'reps'],
    split: 'Carries and holds / legs and grip, then standing positions', blurb: 'He carries, she holds on: partner carries, lift-and-holds and the standing positions they make possible.',
    about: 'Strength for the positions where she\'s off the floor. Piggyback carries, lift-and-holds and back-to-back wall sits build his legs, back and grip and her squeeze; partner squats and wheelbarrow walks fill in the rest. Each session ends on the standing positions: the carry, the wheelbarrow, the edge of the bed. Level II holds longer, Level III adds reps.',
    names: ['Pick Me Up', 'Lift Off', 'Up You Go', 'Hold Tight', 'Hang On', 'Legs Around', 'Arms Around', 'Off the Ground', 'Carried Away', 'Swept Off Her Feet', 'Over the Threshold', 'Piggyback', 'Wrapped Up', 'Against the Wall', 'Standing Room', 'Heavy Lifting', 'Strong Arms', 'Lighter Than Air', 'Weightless', 'Put Me Down'],
    cycle: ['carry', 'legs'],
    dayTypes: {
      carry: buildUp('Carries and holds', 'Carry', C('Carries and holds', ['partnerHold', 'partner_squat', 'partnerHold', 'plank_taps?', 'partnerLower?'], { ...LIFT, values: [2, 3, 4, 5] }), ['slow_dance'], ['positionsStanding', 'positionsStanding']),
      legs: buildUp('Legs and grip', 'Legs', S('Legs and grip', ['partnerLower', 'lift_hold', 'back_to_back_sit', 'partnerCore?', 'partnerHold?'], LIFT), ['dare'], ['positionsStanding', 'positions']),
    },
  },
  {
    id: 'date-night-burn', ...COUPLE, days: 30, name: 'Date Night Burn', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Tabata for two / partner circuit, then positions, 30 days', blurb: 'A month of date nights: a hard partner burn, a tease, and the rest of the evening sorted.',
    about: 'Thirty date nights. One day is a partner Tabata, twenty seconds hard and ten seconds off, side by side; the next a partner circuit that ends every round with a dare. Both slow down into a tease and finish in positions. Every ten days the level goes up: more reps first, then longer holds.',
    names: ['Reservation', 'Table for Two', 'Candlelight', 'Wine List', 'Appetizer', 'Main Course', 'Dessert', 'Nightcap', 'Your Place', 'My Place', 'Valet', 'Taxi Home', 'Doorstep', 'Come In', 'Coat Off', 'Music On', 'Lights Down', 'Couch', 'Bedroom', 'Breakfast'],
    cycle: ['tabata', 'circuit'],
    dayTypes: {
      tabata: buildUp('Tabata for two', 'Tabata', T('Tabata for two', ['partnerLower', 'partnerUpper'], { ...COND, values: [1, 2, 3] }), ['slow_dance', 'dare'], ['positions', 'positions', 'positions?']),
      circuit: buildUp('Partner circuit', 'Circuit', C('Partner circuit', ['partnerLower', 'partnerCore', 'dare', 'partnerUpper?'], { ...COND, values: [2, 3, 4, 5] }), ['dare_neck'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'partners-in-grime', ...COUPLE, name: 'Partners in Grime', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Partner AMRAP / partner EMOM, then shower-ready positions', blurb: 'Get filthy together: a sweaty partner AMRAP, then positions before the shower.',
    about: 'The sweatiest one. One day is a partner AMRAP, as many rounds as you can of squats, push-ups and sit-up claps; the other an EMOM that never lets the heart rate settle. Afterwards a quick dare and a run of positions while you\'re both still breathing hard, then the shower together. Both later levels add reps.',
    names: ['Dirty', 'Grubby', 'Mud', 'Sweatbox', 'Wet Look', 'Grimy', 'Messy', 'Soaked', 'Damp', 'Sticky', 'Slick', 'Glisten', 'Puddle', 'Steam Room', 'Rinse', 'Lather', 'Shower Together', 'Towel Off', 'Clean Again', 'Dirty Again'],
    cycle: ['amrap', 'emom'],
    dayTypes: {
      amrap: buildUp('Partner AMRAP', 'AMRAP', A('Partner AMRAP', ['partnerLower', 'partnerUpper', 'partnerCore'], { ...COND, values: [10, 12, 14, 16, 18] }), ['dare', 'slow_dance?'], ['positions', 'positions']),
      emom: buildUp('Partner EMOM', 'EMOM', E('Partner EMOM', ['partnerLower', 'partnerUpper', 'partnerCore', 'partnerHold'], { ...COND, values: [12, 14, 16, 18, 20] }), ['dare_touch'], ['positions', 'positionsStanding']),
    },
  },
  {
    id: 'take-it-off', ...COUPLE, name: 'Take It Off', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Strip forfeits / undress me, then positions', blurb: 'Strip forfeits and the undress-me dare, then everything else comes off too.',
    about: 'A slower cousin of Strip Circuit. Partner strength sets with a strip forfeit after each exercise; the other day a circuit where the dare is always to undress your partner, slowly. The tease is long and the positions are the ones where you can see each other. Level II adds reps, Level III holds everything longer.',
    names: ['Button Up', 'Unbutton', 'Zip Down', 'Hook and Eye', 'Slip Off', 'Shrug Off', 'Kick Off', 'Peel', 'Unwrap', 'Gift', 'Ribbon', 'Reveal', 'Curtain Up', 'Undone', 'Loose', 'Stripped', 'Bare Back', 'Shown', 'All Off', 'Leave It On'],
    cycle: ['forfeit', 'undress'],
    dayTypes: {
      forfeit: buildUp('Strip forfeits', 'Forfeit', S('Partner strength', ['partnerLower', 'strip_round', 'partnerUpper', 'strip_round'], LIFT), ['dare_undress'], ['positionsSlow', 'positions']),
      undress: buildUp('Undress me', 'Undress', C('Undress circuit', ['partnerLower', 'dare_undress', 'partnerCore'], { ...COND, values: [2, 3, 4, 5] }), ['slow_dance', 'dare_touch'], ['positionsBed', 'positionsBed']),
    },
  },
  {
    id: 'slow-burn-couples', ...COUPLE, name: 'Slow Burn Couples', subject: 'Couples', minutes: [36, 44], levers: [null, 'holds', 'holds'],
    split: 'Slow strength / long tease, then long positions', blurb: 'Nothing rushed: slow partner strength, a long tease and positions held a long time.',
    about: 'The long, slow one, for an evening with nowhere to be. Partner strength at a slow pace with long holds, back-to-back wall sits and bridges; then a slow dance, a massage and a dare; then the slow positions, spooning, lotus, missionary, held long and breathed through. Level II and III make every hold longer.',
    names: ['Slow Down', 'Low Light', 'Simmer', 'Smoulder', 'Embers', 'Candle', 'Wax', 'Velvet', 'Silk', 'Honey', 'Molasses', 'Long Night', 'No Hurry', 'Unhurried', 'Lazy', 'Languid', 'Drawn Out', 'Lingering', 'All Night', 'Sunrise'],
    cycle: ['strength', 'tease'],
    dayTypes: {
      strength: buildUp('Slow strength', 'Strength', S('Slow partner strength', ['lift_hold', 'partner_bridge', 'back_to_back_sit', 'partner_carry?'], LIFT), ['slow_dance', 'back_massage'], ['positionsSlow', 'positionsSlow', 'positionsSlow']),
      tease: buildUp('Long tease', 'Tease', C('Partner holds', ['partnerHold', 'partnerCore', 'partnerHold'], { ...LIFT, values: [2, 3] }), ['slow_dance', 'leg_massage', 'dare', 'back_massage?'], ['positionsSlow', 'positionsSlow', 'positionsSlow', 'positionsSlow?']),
    },
  },
  {
    id: 'sweaty-sheets', ...COUPLE, name: 'Sweaty Sheets', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Bed-ready strength / partner Tabata, then a long positions block', blurb: 'The workout ends where you want it to: a long run of positions on the bed.',
    about: 'The positions block is the main event here. A shorter partner warm-up, strength one day and a Tabata the other, gets you warm; a dare gets you closer; then a long block of positions in bed, one after another, each held for a minute or more. Level II adds reps to the partner work, Level III holds the positions longer.',
    names: ['Fresh Sheets', 'Turned Down', 'Pillow Talk', 'Duvet', 'Under Covers', 'Thread Count', 'Satin', 'Cotton', 'Linen', 'Bedspring', 'Headboard', 'Footboard', 'Mattress', 'Bedhead', 'Rumpled', 'Tangled', 'Twisted Sheets', 'Laundry Day', 'Change the Sheets', 'Again'],
    cycle: ['strength', 'tabata'],
    dayTypes: {
      strength: buildUp('Bed-ready strength', 'Strength', S('Partner strength', ['partnerLower', 'partnerCore'], LIFT), ['dare'], ['positionsBed', 'positionsBed', 'positionsBed', 'positionsBed?']),
      tabata: buildUp('Partner Tabata', 'Tabata', T('Partner Tabata', ['partnerLower', 'partnerCore'], { ...COND, values: [1, 2, 3] }), ['dare', 'slow_dance?'], ['positionsBed', 'positionsBed', 'positionsBed', 'positionsBed?']),
    },
  },
  {
    id: 'dare-night', ...COUPLE, name: 'Dare Night', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Dare circuit / winner\'s choice, then positions', blurb: 'Win the round, call the dare: a partner circuit where the timer hands out dares.',
    about: 'Competitive and a bit wicked. Every round of the partner circuit ends with a dare drawn by the timer, and whoever won the round decides who does it. The other day is all about winner\'s choice: win a round, pick the next position. The tease block is dares only. Level II adds reps, Level III holds everything longer.',
    names: ['Truth', 'Dare', 'Double Dare', 'Triple Dare', 'Chicken', 'Call Your Bluff', 'All In', 'Raise', 'Fold', 'Wild Card', 'Joker', 'Ace', 'Spin the Bottle', 'Seven Minutes', 'Never Have I Ever', 'Forfeit', 'Loser Pays', 'Winner Takes All', 'Rematch', 'Sudden Death'],
    cycle: ['dares', 'choice'],
    dayTypes: {
      dares: buildUp('Dare circuit', 'Dares', C('Dare circuit', ['partnerLower', 'partnerUpper', 'dare', 'partnerCore?'], { ...COND, values: [2, 3, 4, 5] }), ['dare', 'dare'], ['positions', 'positions']),
      choice: buildUp('Winner\'s choice', 'Choice', C('Winner\'s choice', ['partnerCore', 'partnerLower', 'winners_choice'], { ...COND, values: [2, 3, 4, 5] }), ['dare', 'dare?'], ['winners_choice', 'positions', 'positions', 'positions?']),
    },
  },
  {
    id: 'massage-and-mount', ...COUPLE, name: 'Massage & Mount', subject: 'Couples', minutes: [36, 42], levers: [null, 'reps', 'holds'],
    split: 'Partner strength, massage, then her on top', blurb: 'Work hard, get rubbed down, then she climbs on: cowgirl, reverse and lotus.',
    about: 'Three parts every time. A partner strength or circuit block for both of you; a proper massage, back and then legs and glutes; and positions where she\'s on top and in charge, cowgirl, reverse cowgirl and lotus. The massage block is long enough to be the point. Level II adds reps, Level III holds everything longer.',
    names: ['Knots', 'Kneading', 'Pressure Points', 'Warm Oil', 'Long Strokes', 'Thumbs', 'Shoulder Rub', 'Back Rub', 'Foot Rub', 'Deep Tissue', 'Hot Stone', 'Spa Night', 'Rub Down', 'Loosened Up', 'Melted', 'Saddle Up', 'Giddy Up', 'Ride', 'Rodeo', 'Cowgirl Up'],
    cycle: ['strength', 'circuit'],
    dayTypes: {
      strength: buildUp('Strength and massage', 'Strength', S('Partner strength', ['partnerLower', 'partnerUpper', 'partnerHold', 'partnerCore?'], LIFT), ['back_massage', 'leg_massage'], ['positionsHer', 'positionsHer', 'positionsHer?']),
      circuit: buildUp('Circuit and massage', 'Circuit', C('Partner circuit', ['partnerLower', 'partnerCore', 'partnerUpper'], { ...COND, values: [2, 3, 4, 5] }), ['leg_massage', 'back_massage'], ['positionsHer', 'positionsHer', 'positionsHer?']),
    },
  },
  {
    id: 'couples-kama-sutra-30', ...COUPLE, days: 30, name: 'Couple\'s Kama Sutra 30', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Floor / standing / her on top, 30 days', blurb: 'Thirty days through the positions together, each day warming up for the ones it ends with.',
    about: 'The together version of Kama Sutra 30. Three kinds of day turn: floor positions after partner core and bridges; standing positions after carries and wall sits; her-on-top positions after squats and lunges. Each session warms up exactly what its positions ask for, teases, then works through them. Every ten days it gets harder, reps first, then longer holds.',
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
    split: 'Kiss circuit / dare circuit / massage, 30 days', blurb: 'A month that takes its time: kisses, dares and massages, a little longer every ten days.',
    about: 'Thirty days where the tease is the main event. Kiss reps one day, a dare circuit the next, a massage day the third, each with a partner block to get you breathing first and a few positions at the end. Every ten days it gets harder: more reps, then longer holds and longer teases.',
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
    split: 'Squats and cowgirl / lunges and reverse, in rounds', blurb: 'Squat together, then she rides: partner legs and her-on-top positions, round after round.',
    about: 'Alternating rounds built for her legs and his hips. A set of partner squats or mirror lunges, then straight into cowgirl or reverse cowgirl for the length of a hold, then back to the squats. Two or three rounds, then a back massage to finish. Level II adds reps, Level III holds every position longer.',
    names: ['Saddle', 'Stirrups', 'Trot', 'Canter', 'Gallop', 'Bareback', 'Rein In', 'Giddy Up', 'Bronco', 'Rodeo', 'Eight Seconds', 'Buck', 'Ride It Out', 'Hold On', 'Home Stretch', 'Finish Line', 'Photo Finish', 'Victory Lap', 'Cool Down', 'Stable'],
    cycle: ['squat', 'lunge'],
    dayTypes: {
      squat: rounds('Squats and cowgirl', 'Squat', ['partner_squat', 'positionsHer', 'kiss_squat', 'positionsHer'], [2, 3, 4, 5]),
      lunge: rounds('Lunges and reverse', 'Lunge', ['mirror_lunge', 'pos_reverse_cowgirl', 'partner_bridge', 'pos_cowgirl'], [2, 3, 4, 5], ['leg_massage']),
    },
  },
  {
    id: 'couples-quickie', ...COUPLE, name: 'Couple\'s Quickie', subject: 'Couples', minutes: [18, 22], levers: [null, 'reps', 'holds'],
    split: 'Quick rounds / quick standing rounds', blurb: 'Twenty minutes, start to finish: partner sets and positions in quick rounds.',
    about: 'For when there isn\'t time but you want it anyway. Short partner sets and one position each round, twice through, then a quick massage. One day keeps it on the bed, the other stands up. Level II adds reps, Level III holds every position longer.',
    names: ['Quick One', 'Lunch Break', 'Before Work', 'Before Dinner', 'Commercial Break', 'Halftime', 'Snack', 'Shortcut', 'Express', 'Fast Lane', 'Rush Hour', 'Speedy', 'In and Out', 'Pit Stop', 'Ten Minutes', 'Kitchen Counter', 'Against the Door', 'Still Dressed', 'Late Already', 'Worth It'],
    cycle: ['bed', 'standing'],
    dayTypes: {
      bed: rounds('Quick rounds', 'Bed', ['partnerCore', 'positionsBed', 'partnerUpper', 'positionsBed'], [1, 2, 3]),
      standing: rounds('Quick standing rounds', 'Standing', ['partnerLower', 'positionsStanding', 'partnerHold', 'positionsStanding', 'partnerCore?'], [1, 2, 3]),
    },
  },
  {
    id: 'fuck-fit', ...COUPLE, name: 'Fuck Fit', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Push and positions / legs and positions, in rounds', blurb: 'The workout is the sex and the sex is the workout: partner sets and positions in turn.',
    about: 'No pretending this one is about anything else. Every round is a partner set followed by a position held as a set: push-ups then missionary, squats then standing from behind, bridges then cowgirl. The positions are timed like any exercise and get longer as you level up. A massage to close. Level II adds reps, Level III holds every position longer.',
    names: ['Rep One', 'Set Two', 'Superset', 'Drop Set', 'Burnout', 'Failure', 'Pump', 'Power', 'Grind', 'Max Effort', 'Personal Best', 'New Record', 'Spotter', 'Form Check', 'Full Range', 'Time Under Tension', 'Rest Day', 'Deload', 'Gains', 'Fit'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: rounds('Push and positions', 'Push', ['highfive_pushup', 'pos_missionary', 'plank_taps', 'positionsBed'], [2, 3, 4, 5]),
      legs: rounds('Legs and positions', 'Legs', ['partner_squat', 'pos_standing_behind', 'partner_bridge', 'pos_cowgirl'], [2, 3, 4, 5], ['leg_massage']),
    },
  },
  {
    id: 'pin-me-down', ...COUPLE, name: 'Pin Me Down', subject: 'Couples', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Core and floor / holds and floor, in rounds', blurb: 'Partner core and holds, then pinned to the bed: missionary, lying flat, legs over shoulders.',
    about: 'Floor work and floor positions. A round of sit-up claps or leg throws, then a position where one of you is pinned: missionary, lying flat from behind, legs over shoulders. Then plank taps or a wall sit, and another. Two or three rounds and a back massage. Level II adds reps, Level III holds every position longer.',
    names: ['Pinned', 'Held Down', 'Wrists', 'Can\'t Move', 'Surrender', 'Give In', 'Tap Out', 'Submission', 'Grappling', 'Wrestle', 'Mount', 'Guard', 'Escape', 'Reversal', 'Your Turn', 'My Turn', 'Pinned Again', 'Two Count', 'Three Count', 'Winner'],
    cycle: ['core', 'holds'],
    dayTypes: {
      core: rounds('Core and floor', 'Core', ['partner_situp', 'pos_missionary', 'leg_throws', 'pos_legs_up'], [2, 3, 4, 5]),
      holds: rounds('Holds and floor', 'Holds', ['plank_taps', 'pos_prone', 'back_to_back_sit', 'pos_missionary'], [2, 3, 4, 5], ['leg_massage']),
    },
  },
  {
    id: 'wheelbarrow-race', ...COUPLE, name: 'Wheelbarrow Race', subject: 'Couples', minutes: [24, 29], levers: [null, 'reps', 'holds'],
    split: 'Wheelbarrow walks / carries, in rounds', blurb: 'Wheelbarrow walks across the room, then the wheelbarrow position at the end of it.',
    about: 'Strong shoulders for her, strong hips and grip for him. Each round: a wheelbarrow walk, then the wheelbarrow position for a hold; then high-five push-ups and standing from behind. The other day swaps in carries and the standing carry. A massage to finish, mostly for her shoulders. Level II adds reps, Level III holds every position longer.',
    names: ['On Your Marks', 'Get Set', 'Go', 'Wheel Spin', 'Push Cart', 'Barrow', 'Hand Walk', 'Race Day', 'Lap One', 'Lap Two', 'Overtake', 'Home Straight', 'Neck and Neck', 'Dead Heat', 'Photo Finish', 'Podium', 'Gold', 'Silver', 'Bronze', 'Rematch'],
    cycle: ['wheel', 'carry'],
    dayTypes: {
      wheel: rounds('Wheelbarrow rounds', 'Wheel', ['wheelbarrow_walk', 'pos_wheelbarrow', 'highfive_pushup', 'pos_standing_behind'], [2, 3, 4, 5]),
      carry: rounds('Carry rounds', 'Carry', ['partner_carry', 'pos_standing_carry', 'lift_hold', 'pos_edge_of_bed'], [2, 3, 4, 5]),
    },
  },
  {
    id: 'fit-to-fuck-30', ...COUPLE, days: 30, name: 'Fit to Fuck 30', subject: 'Couples', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Upper rounds / lower rounds / standing rounds, 30 days', blurb: 'Thirty days of partner sets and positions in turn, a little harder every ten days.',
    about: 'Fuck Fit, stretched over a month. Three kinds of round turn: upper-body partner work with floor positions, legs with her-on-top positions, and carries with standing positions. Every session finishes with a massage. Every ten days it gets harder, more reps first and then longer holds.',
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
    split: 'Hip-drive circuit / control & breath', blurb: 'Stamina and control: hip-drive circuits one day, pelvic-floor holds and slow breathing the next.',
    about: 'Two halves of lasting longer. One day is a hip-drive circuit, bridges, swings and core round after round with short rests, so the hips and lungs keep going. The other trains control: pelvic-floor holds and their release, slow tempo bridges, and a long stretch where you practise slow breathing under tension. Level II adds reps, Level III holds everything longer.',
    names: ['Dusk', 'Nightfall', 'Late Show', 'Second Wind', 'Third Wind', 'Slow Down', 'Breathe', 'Steady', 'Easy Now', 'Hold Back', 'Not Yet', 'Pace Yourself', 'Long Game', 'Distance', 'Overtime', 'Extra Innings', 'After Hours', 'Small Hours', 'Dawn', 'Breakfast in Bed'],
    cycle: ['drive', 'control'],
    dayTypes: {
      drive: { label: 'Hip-drive circuit', short: 'Drive', blocks: [C('Hip drive', ['thrust', 'kbBallistic', 'coreAnti', 'thrust', 'hiit?'], { ...COND, values: [2, 3, 4, 5] }), C('Control', ['pelvic_floor_hold', 'pelvic'], { ...CORE, values: [2] })] },
      control: { label: 'Control & breath', short: 'Control', absSlots: [], blocks: [S('Slow hips', ['bridge_hold', 'thrust', 'pelvic_floor_hold', 'pelvic'], { ...LIFT, lever: [null, 'tempo', 'holds'] }), F('Breathe', ['ygHips', 'ygYinHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'edge-control', ...SOLO, name: 'Edge Control', subject: 'Endurance & control', minutes: [26, 31], levers: [null, 'tempo', 'holds'],
    split: 'Tempo strength / holds & yin', blurb: 'Learn to ride the edge: slow tempo strength and long holds that teach you to stay calm under pressure.',
    about: 'Control is a skill, and this trains it. Everything is slow: five-second lowerings on squats, thrusts and push-ups, long holds at the hardest point, pelvic-floor holds between sets. The other day finishes with a long yin stretch where the only job is to breathe slowly while it burns. Level II slows the tempo further, Level III holds longer.',
    names: ['On the Edge', 'Brink', 'Close Call', 'Hold It', 'Breathe Out', 'Count to Ten', 'Slow Burn', 'Cool Head', 'Steady Hands', 'Tension', 'Release', 'Again', 'Just Wait', 'Patience', 'Discipline', 'Mind Over', 'Ride It', 'Stay There', 'Almost', 'Then Go'],
    cycle: ['tempo', 'holds'],
    dayTypes: {
      tempo: { label: 'Tempo strength', short: 'Tempo', blocks: [S('Slow strength', ['squat2', 'thrust', 'push', 'pelvic_floor_hold'], LIFT), C('Core holds', ['coreAnti', 'pelvic'], { ...CORE, values: [2, 3] })] },
      holds: { label: 'Holds & yin', short: 'Holds', absSlots: [], blocks: [C('Holds', ['posHold', 'bridge_hold', 'posHold', 'pelvic_floor_hold', 'posHold?'], { ...LIFT, values: [2, 3, 4, 5] }), F('Yin', ['ygYinHips', 'ygYinSpine', 'ygRest?'], YIN)] },
    },
  },
  {
    id: 'stamina-intervals', ...SOLO, name: 'Stamina Intervals', subject: 'Endurance & control', minutes: [24, 29], levers: [null, 'reps', 'reps'],
    split: 'Tabata & core / EMOM & pelvic floor', blurb: 'Intervals for the long session: hard bursts, short rests, and the core and pelvic floor to keep control.',
    about: 'Heart and lungs for going the distance. A Tabata of hip drive and burpee-type work one day, a long EMOM the next, each followed by core and pelvic-floor work done while you\'re still breathing hard, which is exactly when control matters. Both later levels add reps.',
    names: ['Sprint', 'Interval', 'Burst', 'Recover', 'Go Again', 'Twenty On', 'Ten Off', 'Every Minute', 'Heartbeat', 'Pulse', 'Racing', 'Breathless', 'Catch Your Breath', 'Hold On', 'Keep Up', 'Stay With Me', 'Final Round', 'Last Push', 'Done', 'Not Done'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabata & core', short: 'Tabata', blocks: [T('Tabata', ['hiit', 'thrustBw'], { ...COND, values: [1, 2, 3] }), C('Core & control', ['coreHollow', 'pelvic', 'coreAnti'], { ...CORE, values: [2, 3] })] },
      emom: { label: 'EMOM & pelvic floor', short: 'EMOM', blocks: [E('Stamina EMOM', ['thrust', 'cardio', 'kbBallistic', 'hiit'], { ...COND, values: [8, 10, 12] }), C('Control', ['pelvic_floor_hold', 'pelvic', 'coreRot'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'slow-and-steady', ...SOLO, name: 'Slow and Steady', subject: 'Endurance & control', minutes: [30, 35], levers: [null, 'tempo', 'reps'],
    split: 'Slow lower / slow upper / breath flow', blurb: 'Strength at a crawl, then a breathing flow: the patience that makes a long night longer.',
    about: 'Three slow days. Lower body at a three-second tempo, upper body the same, and a breath-led flow day with pelvic-floor holds. Nothing is fast and nothing is rushed: the goal is to feel every rep and stay relaxed while you work, which is what control in bed actually is. Level II slows the tempo, Level III adds reps.',
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
    split: 'Drive / hold / breathe, 30 days', blurb: 'Thirty days to last longer: hip drive, long holds and breathing, harder every ten days.',
    about: 'A month on staying power. Three days turn: hip drive with a short conditioning finish, long holds with pelvic-floor work, and a breathing stretch. Every ten days the level goes up, more reps first and then longer holds, so by the end you\'re fitter and calmer under pressure.',
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
    split: 'Heavy thrusts / thrust conditioning', blurb: 'Heavy hip thrusts and swings for drive, then thrust intervals for the stamina to keep it up.',
    about: 'All about the hips. One day is heavy: hip thrusts, Romanian deadlifts and swings in straight sets, the glutes doing the work. The other turns the same movements into conditioning, thrust and swing intervals that keep the hips moving when the lungs want to stop. Level II asks for heavier weights, Level III adds reps.',
    names: ['Drive', 'Power', 'Piston', 'Pump', 'Hammer', 'Engine', 'Torque', 'Horsepower', 'Momentum', 'Impact', 'Force', 'Thrust', 'Launch', 'Lift Off', 'Full Throttle', 'Redline', 'Turbo', 'Overdrive', 'Top Gear', 'Master'],
    cycle: ['heavy', 'cond'],
    dayTypes: {
      heavy: { label: 'Heavy thrusts', short: 'Heavy', blocks: [S('Heavy hips', ['hip_thrust', 'hinge2', 'kb_swing', 'glute2?'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      cond: { label: 'Thrust conditioning', short: 'Cond', blocks: [C('Thrust circuit', ['thrust', 'kbBallistic', 'thrustBw', 'hiit'], { ...COND, values: [2, 3, 4, 5] }), C('Core', ['coreHollow', 'pelvic_floor_hold'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'pound-it', ...SOLO, name: 'Pound It', subject: 'Hip power & thrust', minutes: [24, 29], levers: [null, 'reps', 'reps'],
    split: 'Swing EMOM / thrust Tabata', blurb: 'Fast, hard hips: kettlebell swings every minute, thrust Tabatas, and a hip stretch after.',
    about: 'Speed and power from the hips. One day is a swing EMOM, a set of swings and a thrust at the top of every minute; the other is thrust and bridge-pulse Tabatas. Both end with a short hip-flexor stretch so the hips stay as loose as they are strong. Both later levels add reps.',
    names: ['Pound', 'Bang', 'Slam', 'Hammer Time', 'Pile Driver', 'Jackhammer', 'Drum', 'Beat', 'Rhythm', 'Tempo', 'Pulse', 'Throb', 'Knock', 'Rattle', 'Shake', 'Bounce', 'Rock', 'Roll', 'Grind', 'Pound Again'],
    cycle: ['swing', 'tabata'],
    dayTypes: {
      swing: { label: 'Swing EMOM', short: 'Swing', absSlots: [], blocks: [E('Swing EMOM', ['kbBallistic', 'thrust', 'kbBallistic', 'thrustBw'], { ...COND, values: [12, 14, 16] }), F('Hip stretch', ['fxHips', 'ygHips', 'ygRest?'], FLOW)] },
      tabata: { label: 'Thrust Tabata', short: 'Tabata', absSlots: [], blocks: [T('Thrust Tabata', ['thrustBw', 'hiit'], { ...COND, values: [2, 3] }), S('Glutes', ['hip_thrust', 'glute2'], LIFT), F('Hip stretch', ['fxHips', 'ygRest'], FLOW)] },
    },
  },
  {
    id: 'hip-drive-ladders', ...SOLO, name: 'Hip Drive Ladders', subject: 'Hip power & thrust', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Thrust ladders / single-leg power', blurb: 'Ladders of thrusts and swings, then single-leg hip work for drive on either side.',
    about: 'Volume for the hips. Ladders climb from one rep to ten on hip thrusts and swings, so you do a lot of work without noticing; the other day trains each side alone with single-leg thrusts, step-ups and lunges, because no position keeps both hips square. Level II adds reps, Level III heavier weights.',
    names: ['First Rung', 'Climb', 'Step Up', 'Higher', 'Halfway', 'Summit', 'Back Down', 'Ladder Up', 'Ladder Down', 'One More', 'Ten', 'Left', 'Right', 'Both', 'Even', 'Square', 'Balanced', 'Level', 'Top Rung', 'View From Up Here'],
    cycle: ['ladder', 'single'],
    dayTypes: {
      ladder: { label: 'Thrust ladders', short: 'Ladder', blocks: [L('Thrust ladder', ['hip_thrust', 'kbBallistic'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2, 3] })] },
      single: { label: 'Single-leg power', short: 'Single', blocks: [S('Single-leg hips', ['single_leg_bridge', 'singleLeg', 'lunge2', 'hipGlute'], LIFT), T('Finisher', ['thrustBw', 'plyoLow'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'piston', ...SOLO, name: 'Piston', subject: 'Hip power & thrust', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Bodyweight thrust circuit / hip plyos, then stretch', blurb: 'No equipment, all hips: bridge circuits, jumps and a long hip-flexor stretch.',
    about: 'Hip power anywhere. A bodyweight circuit of bridge pulses, frog pumps and single-leg bridges one day; hip-driven jumps and plyometrics the next. Both end with a hip-flexor and glute stretch, because tight hip flexors steal drive. Level II adds reps, Level III moves on to harder variations.',
    names: ['Cylinder', 'Stroke', 'Compression', 'Ignition', 'Combustion', 'Exhaust', 'Rev', 'Idle', 'Spark', 'Firing', 'Pistons Pumping', 'Crank', 'Camshaft', 'Valve', 'Pressure', 'Release', 'Cycle', 'Revolution', 'Running Hot', 'Piston'],
    cycle: ['circuit', 'plyo'],
    dayTypes: {
      circuit: { label: 'Thrust circuit', short: 'Circuit', absSlots: [], blocks: [C('Thrust circuit', ['thrustBw', 'gluteReps', 'thrustBw', 'coreAnti'], { ...LIFT, values: [2, 3, 4] }), F('Hip stretch', ['fxHips', 'ygHips', 'fxQuad', 'ygRest?'], FLOW)] },
      plyo: { label: 'Hip plyos', short: 'Plyo', absSlots: [], blocks: [S('Hip plyos', ['plyoVert', 'plyoLow', 'thrustBw'], COND), F('Hip stretch', ['fxHips', 'fxQuad', 'ygRest'], FLOW)] },
    },
  },
  {
    id: 'thrust-30', ...SOLO, days: 30, name: 'Thrust 30', subject: 'Hip power & thrust', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Heavy / fast / single-leg, 30 days', blurb: 'Thirty days of hip power: heavy thrusts, fast swings and single-leg drive, harder every ten days.',
    about: 'A month for the hips. Three days turn: heavy hip thrusts and hinges, a fast swing-and-thrust EMOM, and single-leg work with a stretch after. Every ten days it gets harder, heavier weights first and then more reps.',
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
    split: 'Carries & grip / legs & holds', blurb: 'Grip, legs and a strong back: the strength to hold her up for longer than a minute.',
    about: 'For the standing positions. One day is carries and grip, farmer carries, holds and dead hangs; the other is legs and holds, squats, wall sits and isometric holds at the angle you\'ll be holding her. Core work finishes both. Level II asks for heavier weights, Level III holds longer.',
    names: ['Pick Up', 'Lift', 'Hold', 'Carry', 'Strong Arms', 'Iron Grip', 'Steady Legs', 'Planted', 'Rooted', 'Pillar', 'Column', 'Atlas', 'Heavy Lifting', 'Load', 'Bear It', 'Hold Tight', 'Don\'t Let Go', 'Still Standing', 'Up Against', 'Put Her Down'],
    cycle: ['carry', 'legs'],
    dayTypes: {
      carry: { label: 'Carries & grip', short: 'Carry', blocks: [S('Carries & grip', ['carry', 'gripHold', 'row2', 'gripCurl'], LIFT), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [2] })] },
      legs: { label: 'Legs & holds', short: 'Legs', blocks: [S('Legs', ['squat2', 'lunge2'], LIFT), C('Holds', ['wall_sit', 'posHold', 'posHold'], { ...HOLDS, values: [2, 3] })] },
    },
  },
  {
    id: 'against-the-wall', ...SOLO, name: 'Against the Wall', subject: 'Carry & hold', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'reps'],
    split: 'Wall holds / leg circuit', blurb: 'Wall sits, holds and leg circuits: the legs for every position that ends against a wall.',
    about: 'No equipment, just a wall and your legs. Wall sits, split-squat holds and calf-raise holds at the angles the standing positions use one day; a bodyweight leg circuit for endurance the other. Both finish with core work for a back that doesn\'t complain. Level II holds longer, Level III adds reps.',
    names: ['Wall', 'Brick', 'Plaster', 'Corner', 'Doorframe', 'Hallway', 'Shower Wall', 'Back to the Wall', 'Pinned', 'Leaning', 'Pressed', 'Braced', 'Squat Down', 'Hold Still', 'Thighs on Fire', 'Shaking', 'Hold It', 'Burning', 'Still Here', 'Down the Wall'],
    cycle: ['holds', 'circuit'],
    dayTypes: {
      holds: { label: 'Wall holds', short: 'Holds', blocks: [C('Wall holds', ['wall_sit', 'posHold', 'calf_raise_hold', 'posHold'], { ...LIFT, values: [2, 3, 4] }), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
      circuit: { label: 'Leg circuit', short: 'Circuit', blocks: [C('Leg circuit', ['legsBw2', 'posLegs', 'thrustBw', 'legsBw2'], { ...COND, values: [2, 3, 4] }), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'carry-me-home', ...SOLO, name: 'Carry Me Home', subject: 'Carry & hold', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Carry EMOM / pull & grip', blurb: 'Carries every minute, then rows, curls and grip: arms and back for carrying her to bed.',
    about: 'Carrying is a whole-body job. A carry EMOM with squats and swings one day, the arms, back and grip the next: rows, curls, holds and hangs. Your forearms will know about it. Level II asks for heavier weights, Level III adds reps.',
    names: ['Front Door', 'Hallway', 'Stairs', 'Landing', 'Bedroom Door', 'Threshold', 'Over the Shoulder', 'Fireman\'s Carry', 'Bridal Carry', 'Piggyback', 'All the Way', 'Up the Stairs', 'No Lift', 'Strong Back', 'Big Arms', 'Grip Strength', 'Forearms', 'Biceps', 'Long Way Round', 'Home'],
    cycle: ['emom', 'pull'],
    dayTypes: {
      emom: { label: 'Carry EMOM', short: 'EMOM', blocks: [E('Carry EMOM', ['carry', 'squat2', 'kbBallistic', 'carry'], { ...COND, values: [10, 12] }), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [2] })] },
      pull: { label: 'Pull & grip', short: 'Pull', blocks: [S('Pull & grip', ['row2', 'biceps2', 'gripHold', 'gripCurl'], LIFT), C('Core', ['coreHollow', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'grip-it-tight', ...SOLO, name: 'Grip It Tight', subject: 'Carry & hold', minutes: [24, 29], levers: [null, 'holds', 'weight'],
    split: 'Grip & legs / holds & core', blurb: 'Grip and legs in supersets, then holds and core: hold on tight and keep holding.',
    about: 'Grip and legs, worked together. Supersets pair a squat with a carry and a lunge with a hold, so the hands work while the legs do; the other day is isometric holds and core, planks, wall sits and hangs. Hold her up and keep her there. Level II holds longer, Level III asks for heavier weights.',
    names: ['Squeeze', 'Clench', 'Clasp', 'Clutch', 'Grasp', 'Hang On', 'Locked', 'Vice', 'Clamp', 'White Knuckles', 'Tight', 'Tighter', 'Grip', 'Hold Fast', 'Never Let Go', 'Firm', 'Steady', 'Strong Hands', 'Holding On', 'Let Go'],
    cycle: ['super', 'holds'],
    dayTypes: {
      super: { label: 'Grip & legs', short: 'Super', blocks: [SS('Grip & legs', ['squat2', 'carry', 'lunge2', 'gripHold'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      holds: { label: 'Holds & core', short: 'Holds', blocks: [C('Holds', ['gripHold', 'posHold', 'climbHold', 'posHold'], { ...LIFT, values: [2, 3, 4] }), C('Core', ['coreHollow', 'coreAnti'], { ...CORE, values: [2, 3] })] },
    },
  },
  {
    id: 'stand-and-deliver-30', ...SOLO, days: 30, name: 'Stand and Deliver 30', subject: 'Carry & hold', minutes: [26, 31], levers: [null, 'weight', 'holds'],
    split: 'Carry / legs / holds, 30 days', blurb: 'Thirty days to the standing positions: carries, legs and holds, harder every ten days.',
    about: 'A month for holding her up. Carries and grip, legs and lunges, and isometric holds turn in that order, each with core work. Every ten days it gets harder, heavier first and then longer holds, until a minute against the wall is easy.',
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
    split: 'Hamstrings & hinge / forward fold flow', blurb: 'Hamstrings and hips for bending all the way over: hinges for strength, folds held long.',
    about: 'For the positions that start bent over. One day strengthens the hinge, Romanian deadlifts, good mornings and back extensions, then stretches the hamstrings; the other is a long forward-fold flow, pyramid, wide-leg fold and half splits, held until they let go. Level II holds longer, Level III adds reps.',
    names: ['Bend', 'Fold', 'Over', 'Further', 'Touch Your Toes', 'Palms Down', 'Ragdoll', 'Hang', 'Hinge', 'Deep Fold', 'Forward', 'Bow', 'Curtsy', 'Reach', 'Long Legs', 'Hamstrings', 'All the Way', 'Head to Knees', 'Flat Back', 'Bent Over'],
    cycle: ['hinge', 'fold'],
    dayTypes: {
      hinge: { label: 'Hamstrings & hinge', short: 'Hinge', absSlots: [], blocks: [S('Hinge', ['hinge2', 'backStrength', 'hinge2'], LIFT), F('Hamstrings', ['fxHam', 'fxHam', 'ygRest?'], FLOW_SCALED)] },
      fold: { label: 'Forward fold flow', short: 'Fold', absSlots: [], blocks: [C('Strong at the angle', ['hinge2', 'coreHollow', 'thrustBw'], { ...LIFT, values: [2] }), F('Fold flow', ['fxHam', 'fxStraddle', 'fxSplit', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'open-wide', ...SOLO, name: 'Open Wide', subject: 'Flexible & bendy', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Adductor strength / straddle flow', blurb: 'Inner thighs strong and open: Cossack squats and Copenhagen planks, then the straddle held long.',
    about: 'Wide is a strength as well as a stretch. One day builds the inner thighs with Cossack squats, Copenhagen planks and side-lying adductions, then opens them; the other is a long straddle, frog and butterfly flow. No equipment needed. Level II and III hold everything longer.',
    names: ['Wide', 'Wider', 'Open', 'Straddle', 'Frog', 'Butterfly', 'Pancake', 'Side Split', 'Spread', 'Stretch', 'Inner Thighs', 'Open Hips', 'Wide Open', 'Arms Wide', 'Legs Apart', 'Gate', 'Doors Open', 'Splay', 'Flat', 'Wide Awake'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Adductor strength', short: 'Strength', absSlots: [], blocks: [C('Adductors', ['cossack_squat', 'copenhagen_plank', 'adductorBw', 'adductorBw'], { ...LIFT, values: [2, 3] }), F('Open', ['fxStraddle', 'fxHips', 'ygRest?'], FLOW_SCALED)] },
      flow: { label: 'Straddle flow', short: 'Flow', absSlots: [], blocks: [C('Warm hips', ['adductorBw', 'mbHip', 'adductorBw?'], { ...LIFT, values: [2, 3] }), F('Straddle flow', ['fxStraddle', 'fxHips', 'fxStraddle', 'ygYinHips', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'arch-your-back', ...SOLO, name: 'Arch Your Back', subject: 'Flexible & bendy', minutes: [24, 29], levers: [null, 'holds', 'reps'],
    split: 'Back strength / backbend flow', blurb: 'A strong, bendy spine: back extensions and bridges, then backbends held long.',
    about: 'For arching, from doggy to the bridge. One day strengthens the back and glutes, supermans, bridges and back extensions; the other is a backbend flow, cobra, camel, bridge and wheel if you have it, with hip-flexor stretches that let the arch happen. Level II holds longer, Level III adds reps.',
    names: ['Arch', 'Curve', 'Bow', 'Cobra', 'Camel', 'Bridge', 'Wheel', 'Crescent', 'Swan', 'Cat', 'Cow', 'Sway', 'Spine', 'Bend Back', 'Open Chest', 'Heart Open', 'Lift', 'Rise', 'Arc', 'Arched'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Back strength', short: 'Strength', absSlots: [], blocks: [C('Back & glutes', ['backStrength', 'glute2', 'backBw', 'thrustBw'], { ...LIFT, values: [2, 3, 4] }), F('Open', ['ygBack', 'fxQuad', 'ygRest?'], FLOW)] },
      flow: { label: 'Backbend flow', short: 'Flow', absSlots: [], blocks: [C('Warm spine', ['backStrength', 'mbSpine'], { ...LIFT, values: [2] }), F('Backbend flow', ['ygBack', 'fxSpine', 'fxQuad', 'ygBack', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'do-the-splits', ...SOLO, name: 'Do the Splits', subject: 'Flexible & bendy', minutes: [26, 31], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Splits strength / splits flow', blurb: 'Front splits and side splits, strong at the end range and held long.',
    about: 'Splits, both kinds. One day builds strength at the end range, split-squat holds, Cossacks and active leg lifts, then stretches; the other is a long splits flow, lizard, half splits and the splits themselves, held long. Level II and III hold everything longer.',
    names: ['Split', 'Half Split', 'Lizard', 'Runner\'s Lunge', 'Pigeon', 'Hanuman', 'Side Split', 'Middle Split', 'Center', 'Slide', 'Lower', 'Floor', 'Almost There', 'Closer', 'Touchdown', 'Flat', 'Showgirl', 'Gymnast', 'Dancer', 'Splits'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Splits strength', short: 'Strength', absSlots: [], blocks: [C('End range', ['posLegs', 'adductorBw', 'hipFlex', 'mbHip'], { ...LIFT, values: [2, 3] }), F('Splits', ['fxSplit', 'fxHam', 'ygRest?'], FLOW_SCALED)] },
      flow: { label: 'Splits flow', short: 'Flow', absSlots: [], blocks: [C('Warm hips', ['hipFlex', 'mbHip'], { ...LIFT, values: [2] }), F('Splits flow', ['fxSplit', 'fxQuad', 'fxHam', 'fxStraddle', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'bendy-30', ...SOLO, days: 30, name: 'Bendy 30', subject: 'Flexible & bendy', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Hips / hamstrings / back, 30 days', blurb: 'Thirty days to bend any way she likes: hips, hamstrings and back, held longer every ten days.',
    about: 'A month of range. Hips, hamstrings and back turn day by day, each with a short strength circuit at the angle it opens, then a long flow. Every ten days every hold gets longer.',
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
    split: 'Upper pump / arms & abs', blurb: 'Twenty minutes before you go out: chest, shoulders and arms full of blood, abs lit up.',
    about: 'A pump, not a workout to recover from. Supersets of presses, flies, raises and curls with short rests fill the muscles that show, and a fast abs finisher tightens the middle. Do it an hour before the date, shower, and walk in looking your best. Level II adds reps, Level III asks for heavier weights.',
    names: ['Getting Ready', 'Shower After', 'Cologne', 'Good Shirt', 'Mirror Check', 'Pumped', 'Filled Out', 'Veins', 'Sleeves Tight', 'Buttons Strain', 'Fresh', 'Sharp', 'Dressed Up', 'Out the Door', 'Fashionably Late', 'Walk In', 'Heads Turn', 'Looking Good', 'Feeling Good', 'Showtime'],
    cycle: ['upper', 'arms'],
    dayTypes: {
      upper: { label: 'Upper pump', short: 'Upper', blocks: [SS('Upper pump', ['chest2', 'shoulders2', 'chestIso', 'shoulderRaise'], LIFT), T('Abs finisher', ['coreHollow', 'hiit'], { ...COND, values: [1] })] },
      arms: { label: 'Arms & abs', short: 'Arms', blocks: [SS('Arm pump', ['biceps2', 'triceps2', 'biceps2', 'triceps2'], LIFT), T('Abs finisher', ['coreRot', 'hiit'], { ...COND, values: [1] })] },
    },
  },
  {
    id: 'striptease-pump', ...SOLO, name: 'Striptease Pump', subject: 'Strip & show-off', minutes: [21, 25], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Push-up pump / core & glutes', blurb: 'No equipment, maximum show: push-up pumps, glute pumps and abs, for when the clothes come off.',
    about: 'A bodyweight pump for anywhere, a hotel room included. One day is push-up variations in a circuit until the chest and arms are full; the other is glutes and abs, bridges, frog pumps and hollow holds. Short, sweaty and ready to strip. Level II adds reps, Level III moves to harder variations.',
    names: ['Lights Down', 'Music On', 'Slow Song', 'First Button', 'Shirt Off', 'Belt', 'Shoes', 'Socks', 'Down to Briefs', 'Spotlight', 'Stage', 'Pole', 'Chair', 'Hips', 'Shimmy', 'Grind', 'Tease', 'Reveal', 'Encore', 'Curtain'],
    cycle: ['push', 'core'],
    dayTypes: {
      push: { label: 'Push-up pump', short: 'Push', blocks: [C('Push-up pump', ['chestBw', 'armsBw', 'chestBw', 'shoulderBw'], { ...LIFT, values: [2, 3, 4] }), T('Abs', ['coreHollow', 'hiit'], { ...COND, values: [1, 2] })] },
      core: { label: 'Core & glutes', short: 'Core', blocks: [C('Glute pump', ['thrustBw', 'gluteReps', 'thrustBw'], { ...LIFT, values: [2] }), T('Abs', ['coreRot', 'coreHollow'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'show-off', ...SOLO, name: 'Show Off', subject: 'Strip & show-off', minutes: [24, 29], levers: [null, 'weight', 'reps'],
    split: 'Shoulders & arms / chest & back', blurb: 'Shoulders, arms, chest and back in quick supersets: the muscles that look good in a doorway.',
    about: 'For a V-shape and arms that fill a sleeve. Shoulders and arms one day, chest and back the next, all in supersets so it\'s over fast, and a short abs block to finish. Nothing heavy enough to leave you sore for the evening. Level II asks for heavier weights, Level III adds reps.',
    names: ['Doorway', 'Silhouette', 'Shoulders Back', 'Chest Out', 'Wide', 'Tall', 'Broad', 'Strut', 'Swagger', 'Peacock', 'Flex', 'Pose', 'Look at Me', 'Spotlight', 'Center Stage', 'Main Character', 'Showstopper', 'Head Turner', 'Eye Candy', 'Show Off'],
    cycle: ['shoulders', 'chest'],
    dayTypes: {
      shoulders: { label: 'Shoulders & arms', short: 'Shoulders', blocks: [SS('Shoulders & arms', ['shoulders2', 'biceps2', 'shoulderRaise', 'triceps2'], LIFT), C('Abs', ['coreHollow', 'coreRot'], { ...CORE, values: [2] })] },
      chest: { label: 'Chest & back', short: 'Chest', blocks: [SS('Chest & back', ['chest2', 'row2', 'chestIso', 'backRear'], LIFT), C('Abs', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'abs-on-show', ...SOLO, name: 'Abs on Show', subject: 'Strip & show-off', minutes: [20, 24], levers: [null, 'reps', 'reps'],
    split: 'Abs & chest / abs & arms', blurb: 'Abs first, every time, then a quick chest or arm pump: the middle she\'ll see first.',
    about: 'Built around the abs, because they\'re what shows first when the shirt comes off. Every day opens with a weighted and bodyweight abs circuit, then a quick pump of chest or arms in an EMOM. Level II and III add reps.',
    names: ['Six', 'Eight', 'Washboard', 'Ridges', 'Obliques', 'V-Lines', 'Belly', 'Waist', 'Lean', 'Tight', 'Carved', 'Etched', 'Cut', 'Crunch Time', 'Core', 'Center', 'Midriff', 'Show Them', 'Abs Out', 'On Show'],
    cycle: ['chest', 'arms'],
    dayTypes: {
      chest: { label: 'Abs & chest', short: 'Chest', blocks: [C('Abs', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [1, 2] }), E('Chest pump', ['chest2', 'chestBw'], { ...LIFT, values: [6, 8] })] },
      arms: { label: 'Abs & arms', short: 'Arms', blocks: [C('Abs', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [1, 2] }), E('Arm pump', ['biceps2', 'triceps2'], { ...LIFT, values: [6, 8] })] },
    },
  },
  {
    id: 'date-night-pump-30', ...SOLO, days: 30, name: 'Date Night Pump 30', subject: 'Strip & show-off', minutes: [22, 26], levers: [null, 'reps', 'weight'],
    split: 'Chest & shoulders / arms / abs & glutes, 30 days', blurb: 'Thirty short pumps: chest and shoulders, arms, abs and glutes, a little harder every ten days.',
    about: 'A month of pre-date pumps that add up. Chest and shoulders, arms, then abs and glutes turn day by day, each twenty minutes of supersets and a finisher. Every ten days the level goes up, more reps and then heavier weights.',
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
    split: 'Neck & forearms / kneeling comfort', blurb: 'Endurance where she needs it: neck and forearms that don\'t tire, and knees and hips happy to kneel.',
    about: 'For giving rather than receiving. One day builds endurance in the neck, upper back and forearms, the muscles that give out first when you\'re going down on her or using your hands. The other makes kneeling comfortable: hip-flexor, quad and knee mobility with a strong core. Level II holds longer, Level III adds reps.',
    names: ['Ladies First', 'Her Turn', 'Patience', 'Attention', 'Detail', 'Slow Hands', 'Gentle', 'Listen', 'Follow Her Lead', 'Take Your Time', 'No Rush', 'Generous', 'Devotion', 'Worship', 'On Your Knees', 'Down There', 'Encore for Her', 'Twice', 'Thank You', 'Her Favorite'],
    cycle: ['neck', 'kneel'],
    dayTypes: {
      neck: { label: 'Neck & forearms', short: 'Neck', blocks: [C('Neck & upper back', ['neck', 'trapsBw', 'neck', 'trapsBw'], { ...LIFT, values: [2, 3] }), C('Arms & core', ['armsBw', 'coreAnti', 'armsBw'], { ...HOLDS, values: [2, 3] })] },
      kneel: { label: 'Kneeling comfort', short: 'Kneel', absSlots: [], blocks: [C('Strong knees & hips', ['legsBw2', 'hipFlex', 'posLegs'], { ...LIFT, values: [2, 3] }), F('Kneel easy', ['fxQuad', 'fxHips', 'ygHips', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'going-down', ...SOLO, name: 'Going Down', subject: 'Her pleasure', minutes: [22, 26], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Neck endurance / hips & quads open', blurb: 'Neck endurance and hips that let you stay down there as long as she wants.',
    about: 'Named for what it\'s for. Neck holds in every direction and chin tucks build the endurance to stay in position without strain; upper-back work keeps the shoulders from creeping up. The other day opens the hip flexors and quads so kneeling at the edge of the bed is comfortable for a long time. Both later levels hold longer.',
    names: ['Head Down', 'Chin Up', 'Steady', 'Hold Still', 'Stay There', 'Eyes Up', 'Long Neck', 'Relax the Jaw', 'Breathe Through the Nose', 'Rhythm', 'Patience', 'Persistence', 'Dedication', 'All Night', 'Endurance', 'Steady Pace', 'Don\'t Stop', 'Right There', 'Almost', 'There'],
    cycle: ['neck', 'hips'],
    dayTypes: {
      neck: { label: 'Neck endurance', short: 'Neck', blocks: [C('Neck holds', ['neckReps', 'neck', 'neck', 'neck'], { ...LIFT, values: [2, 3] }), C('Upper back', ['trapsBw', 'backBw'], { ...HOLDS, values: [2, 3] })] },
      hips: { label: 'Hips & quads open', short: 'Hips', absSlots: [], blocks: [C('Strong hips', ['hipFlex', 'thrustBw', 'hipFlex'], { ...LIFT, values: [2, 3] }), F('Kneeling flow', ['fxQuad', 'ygHips', 'fxQuad', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'fingers-and-forearms', ...SOLO, name: 'Fingers and Forearms', subject: 'Her pleasure', minutes: [23, 27], levers: [null, 'reps', 'holds'],
    split: 'Forearm endurance / wrists & core', blurb: 'Forearms, wrists and grip that keep going: hands that don\'t tire before she\'s done.',
    about: 'Your hands are a big part of it. Wrist curls, reverse curls, holds and carries build forearm endurance one day; the other strengthens the wrists through their whole range with core work alongside, so nothing cramps or aches halfway. Level II adds reps, Level III holds longer.',
    names: ['Fingertips', 'Light Touch', 'Firm Touch', 'Circles', 'Slow Circles', 'Pressure', 'Rhythm', 'Wrist', 'Forearm', 'Grip', 'Hold', 'Squeeze', 'Release', 'Steady Hand', 'Quick Hands', 'Skilled', 'Magic Fingers', 'Handy', 'Hands On', 'Hand It to You'],
    cycle: ['forearms', 'wrists'],
    dayTypes: {
      forearms: { label: 'Forearm endurance', short: 'Forearms', blocks: [S('Forearms', ['gripCurl', 'gripHold', 'gripCurl', 'carry?'], LIFT), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [1, 2] })] },
      wrists: { label: 'Wrists & core', short: 'Wrists', blocks: [C('Wrists & grip', ['gripCurl', 'gripHold', 'gripPull'], { ...LIFT, values: [2, 3] }), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'ladies-first', ...SOLO, name: 'Ladies First', subject: 'Her pleasure', minutes: [26, 31], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Neck & core / hips & knees / hands & back', blurb: 'Everything it takes to put her first: neck, hands, knees and hips, round in three days.',
    about: 'The whole kit for giving: neck and core one day, hips and knees for kneeling the next, hands and upper back the third. No equipment, mostly holds and controlled reps, and a flow on the hip day. Level II adds reps, Level III holds longer.',
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
    split: 'Neck / hips / core, 30 days', blurb: 'Thirty days of getting better at her: neck, hips and core, longer holds every ten days.',
    about: 'A month for her benefit. Neck and upper back, hips and kneeling comfort, and core with pelvic-floor control turn day by day. Every ten days it gets harder, more reps first and then longer holds.',
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
    split: 'Tabata & strength / EMOM', blurb: 'In and out in under twenty minutes, sweating: a Tabata and a strength block, or one fast EMOM.',
    about: 'For days with no time. One day pairs a Tabata with a short strength circuit; the other is a single EMOM that works the whole body. Under twenty minutes, done. Both later levels add reps.',
    names: ['Quick', 'Fast', 'Brief', 'Short', 'Snappy', 'Hurry', 'Rush', 'Dash', 'Blitz', 'Flash', 'Zip', 'Zoom', 'Express', 'Instant', 'Rapid', 'Speedy', 'Swift', 'On the Clock', 'Ten to Go', 'Done'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabata & strength', short: 'Tabata', absSlots: [], blocks: [T('Tabata', ['hiit', 'thrustBw'], { ...COND, values: [1, 2, 3] }), C('Strength', ['squat2', 'push', 'hinge2?'], { ...LIFT, values: [2, 3, 4] })] },
      emom: { label: 'EMOM', short: 'EMOM', absSlots: [], blocks: [E('EMOM', ['kbBallistic', 'push', 'squat2', 'coreAnti'], { ...COND, values: [10, 12, 14, 16] }), C('Core', ['coreHollow', 'coreRot?'], { ...CORE, values: [1, 2, 3] })] },
    },
  },
  {
    id: 'wham-bam', ...SOLO, name: 'Wham Bam', subject: 'Quickie', minutes: [16, 20], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Bodyweight blast / hip blast', blurb: 'No equipment, no warm-up chat: a bodyweight blast and you\'re done. Thank you, ma\'am.',
    about: 'Bodyweight only and over quickly. A full-body circuit as fast as you can move one day, a hip and glute blast the other, each with a quick Tabata. Level II adds reps, Level III moves to harder variations.',
    names: ['Wham', 'Bam', 'Thank You', 'Ma\'am', 'Slam', 'Bang', 'Pow', 'Boom', 'Crash', 'Smash', 'Whack', 'Thud', 'Kapow', 'Zap', 'Pop', 'Snap', 'Crackle', 'Sizzle', 'Fizz', 'Done Already'],
    cycle: ['blast', 'hips'],
    dayTypes: {
      blast: { label: 'Bodyweight blast', short: 'Blast', absSlots: [], blocks: [C('Blast', ['legsBw2', 'pushBw2', 'hiit', 'coreAnti'], { ...COND, values: [1, 2, 3] }), C('Strength', ['legsBw2', 'pushBw2'], { ...LIFT, values: [1, 2] })] },
      hips: { label: 'Hip blast', short: 'Hips', absSlots: [], blocks: [T('Hip Tabata', ['thrustBw', 'hiit'], { ...COND, values: [1, 2] }), C('Glutes', ['thrustBw', 'gluteReps'], { ...LIFT, values: [1, 2, 3] })] },
    },
  },
  {
    id: 'nooner', ...SOLO, name: 'Nooner', subject: 'Quickie', minutes: [18, 22], levers: [null, 'reps', 'weight'],
    split: 'AMRAP & core / strength & finisher', blurb: 'A lunchtime quickie: an AMRAP or a strength block, a finisher, back at your desk by one.',
    about: 'Midday and quick. An AMRAP of swings, presses and squats with a core finisher one day; a short strength superset with a Tabata after the other. Back to work with a grin. Level II adds reps, Level III asks for heavier weights.',
    names: ['Noon', 'Lunch Hour', 'Midday', 'Twelve Sharp', 'High Noon', 'Siesta', 'Long Lunch', 'Back by One', 'Desk Break', 'Quick Bite', 'Out to Lunch', 'Meeting', 'Busy', 'Do Not Disturb', 'Lunch Date', 'Afternoon Delight', 'Sneak Out', 'Back Soon', 'Grinning', 'Nooner'],
    cycle: ['amrap', 'strength'],
    dayTypes: {
      amrap: { label: 'AMRAP & core', short: 'AMRAP', absSlots: [], blocks: [A('AMRAP', ['kbBallistic', 'push', 'squat2'], { ...COND, values: [8, 10, 12, 14] }), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [1, 2, 3] })] },
      strength: { label: 'Strength & finisher', short: 'Strength', absSlots: [], blocks: [SS('Strength', ['squat2', 'push', 'hinge2', 'row2'], LIFT), T('Finisher', ['hiit', 'thrustBw'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'hot-and-fast', ...SOLO, name: 'Hot and Fast', subject: 'Quickie', minutes: [16, 20], levers: [null, 'reps', 'reps'],
    split: 'Hot circuit / fast EMOM', blurb: 'Hot circuits and fast EMOMs, under twenty minutes and drenched.',
    about: 'Fast and hard. A hot circuit of swings, burpees and squats one day; a quick EMOM of swings and presses with a Tabata after the next. A minute of core to close. Both later levels add reps.',
    names: ['Hot', 'Hotter', 'Fast', 'Faster', 'Fire', 'Blaze', 'Scorch', 'Sizzle', 'Steam', 'Sweat', 'Drench', 'Pour', 'Flood', 'Boil', 'Fever', 'Heatwave', 'Sauna', 'Furnace', 'Inferno', 'Cool Off'],
    cycle: ['circuit', 'ladder'],
    dayTypes: {
      circuit: { label: 'Hot circuit', short: 'Circuit', absSlots: [], blocks: [C('Hot circuit', ['kbBallistic', 'hiit', 'squat2', 'push?'], { ...COND, values: [2, 3, 4, 5] }), C('Core', ['coreHollow', 'coreRot?'], { ...CORE, values: [1, 2, 3] })] },
      ladder: { label: 'Fast EMOM', short: 'EMOM', absSlots: [], blocks: [E('Fast EMOM', ['kbBallistic', 'push'], { ...LIFT, values: [8, 10, 12] }), T('Finisher', ['hiit', 'thrustBw'], { ...COND, values: [1, 2] })] },
    },
  },
  {
    id: 'quickie-30', ...SOLO, days: 30, name: 'Quickie 30', subject: 'Quickie', minutes: [16, 20], levers: [null, 'reps', 'weight'],
    split: 'Tabata / EMOM / AMRAP, 30 days', blurb: 'Thirty quick ones: Tabata, EMOM and AMRAP in turn, under twenty minutes each.',
    about: 'A month of quickies. Tabata, EMOM and AMRAP days turn, each with a short second block so every session mixes kinds of work. Under twenty minutes a day, harder every ten days.',
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
    split: 'Back strength / back flow', blurb: 'A lower back that\'s ready for anything: the McGill basics, glutes, and a gentle back flow.',
    about: 'Thrusting, carrying and arching all load the lower back. One day builds it the way physios do, bird dogs, curl-ups, side planks and bridges, with the glutes doing their share; the other moves the spine gently through every direction. Level II adds reps, Level III holds longer.',
    names: ['Spine', 'Lumbar', 'Brace', 'Bird Dog', 'Curl-up', 'Side Plank', 'Bridge', 'Neutral', 'Long Back', 'Straight Up', 'Supported', 'Solid', 'Stable', 'Steady', 'Pain-free', 'Ready', 'Resilient', 'Robust', 'Bulletproof', 'Good Back'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Back strength', short: 'Strength', blocks: [C('Back strength', ['backStrength', 'backStrength', 'thrustBw', 'backStrength'], { ...LIFT, values: [2, 3] }), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      flow: { label: 'Back flow', short: 'Flow', absSlots: [], blocks: [C('Back & glutes', ['backStrength', 'thrustBw', 'backStrength'], { ...LIFT, values: [2, 3] }), F('Back flow', ['backMove', 'backMove', 'backMove', 'backMove', 'ygRest', 'backMove?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'kneel-easy', ...SOLO, name: 'Kneel Easy', subject: 'Back & knees care', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Knee strength / knee & hip mobility', blurb: 'Knees that can kneel and squat all night: strength around the knee and mobility above and below it.',
    about: 'Knees take a beating in the kneeling positions. One day strengthens everything around them, slow squats, split-squat holds, tibialis raises and step-downs; the other loosens the hips and ankles above and below, so the knee isn\'t doing their job. Level II adds reps, Level III holds longer.',
    names: ['Kneecap', 'Patella', 'Quad', 'Shin', 'Ankle', 'Hip', 'Bend', 'Straighten', 'Squat Low', 'Kneel', 'Cushion', 'Pillow', 'Soft Landing', 'Steady', 'Strong', 'Supple', 'Smooth', 'Easy', 'No Creak', 'Good Knees'],
    cycle: ['strength', 'mobility'],
    dayTypes: {
      strength: { label: 'Knee strength', short: 'Strength', blocks: [C('Knee strength', ['legsBw2', 'shin', 'posLegs', 'legsBw2'], { ...LIFT, values: [2, 3] }), C('Holds', ['posHold', 'posHold'], { ...HOLDS, values: [2] })] },
      mobility: { label: 'Knee & hip mobility', short: 'Mobility', absSlots: [], blocks: [C('Ankles & hips', ['shin', 'mbHip', 'legsBw2', 'shin?'], { ...LIFT, values: [2, 3] }), F('Hips & quads', ['fxQuad', 'fxHips', 'ygHips', 'fxQuad?', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'strong-wrists', ...SOLO, name: 'Strong Wrists', subject: 'Back & knees care', minutes: [22, 26], levers: [null, 'reps', 'holds'],
    split: 'Wrists & forearms / shoulders & upper back', blurb: 'Wrists, shoulders and upper back for every position where you hold yourself up on your hands.',
    about: 'Missionary, doggy and the wheelbarrow all put weight through the hands. One day strengthens the wrists and forearms through their range; the other builds shoulder health and upper-back strength with a short mobility flow. Level II adds reps, Level III holds longer.',
    names: ['Wrist', 'Palm', 'Fingers', 'Forearm', 'Elbow', 'Shoulder', 'Scapula', 'Rotator', 'Upper Back', 'Posture', 'Support', 'Plank Ready', 'Hands Down', 'Weight Bearing', 'Steady Arms', 'Locked Out', 'Strong Base', 'Pillars', 'Holding Up', 'Good Wrists'],
    cycle: ['wrists', 'shoulders'],
    dayTypes: {
      wrists: { label: 'Wrists & forearms', short: 'Wrists', blocks: [S('Wrists & forearms', ['gripCurl', 'gripHold', 'gripCurl?'], LIFT), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
      shoulders: { label: 'Shoulders & upper back', short: 'Shoulders', absSlots: [], blocks: [C('Shoulder health', ['shoulderHealth', 'backRear', 'shoulderHealth', 'backRear?'], { ...LIFT, values: [2, 3, 4] }), F('Shoulder mobility', ['mbShoulder', 'fxUpper', 'mbShoulder', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'the-morning-after', ...SOLO, name: 'The Morning After', subject: 'Back & knees care', minutes: [20, 24], equip: 'bw', levers: [null, 'holds', 'holds'],
    split: 'Gentle strength / gentle flow', blurb: 'For the morning after a long night: gentle strength and a slow flow that puts everything back.',
    about: 'Recovery, not training. Gentle glute, core and back work wakes things up one day; a slow flow through the hips, back and shoulders puts them back where they belong the next. Nothing hard, everything helpful. Level II and III hold longer.',
    names: ['Sunrise', 'Coffee', 'Stretch', 'Yawn', 'Slow Start', 'Easy Morning', 'Lazy Sunday', 'Bed Head', 'Sore', 'Stiff', 'Loosen', 'Unwind', 'Undo', 'Reset', 'Restore', 'Recover', 'Refresh', 'Better', 'Ready Again', 'Tonight?'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Gentle strength', short: 'Strength', absSlots: [], blocks: [C('Gentle strength', ['gentleStrength', 'backStrength', 'gentleStrength', 'backStrength?'], { ...LIFT, values: [2, 3] }), F('Stretch', ['backMove', 'ygHips', 'backMove', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      flow: { label: 'Gentle flow', short: 'Flow', absSlots: [], blocks: [C('Wake up', ['gentleBalance', 'backStrength', 'gentleStrength?'], { ...LIFT, values: [2, 3] }), F('Morning flow', ['backMove', 'ygHips', 'mbShoulder', 'ygBack', 'ygRest', 'backMove?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'back-and-knees-30', ...SOLO, days: 30, name: 'Back & Knees 30', subject: 'Back & knees care', minutes: [22, 26], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Back / knees / wrists & shoulders, 30 days', blurb: 'Thirty days for the joints that positions load: back, knees, wrists and shoulders.',
    about: 'A month of looking after yourself. Back, knees, and wrists with shoulders turn day by day, each with strength work and something gentle after. Every ten days it gets harder, reps first and then longer holds.',
    names: ['Day One', 'Back', 'Knees', 'Wrists', 'Hips', 'Shoulders', 'Ankles', 'Spine', 'Brace', 'Day Ten', 'Stronger', 'Steadier', 'Looser', 'Easier', 'Smoother', 'Sturdier', 'Supple', 'Sound', 'Ready', 'Day Thirty'],
    cycle: ['back', 'knees', 'wrists'],
    dayTypes: {
      back: { label: 'Back', short: 'Back', absSlots: [], blocks: [C('Back strength', ['backStrength', 'backStrength', 'thrustBw', 'backStrength?'], { ...LIFT, values: [2, 3, 4] }), F('Back flow', ['backMove', 'backMove', 'backMove', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      knees: { label: 'Knees', short: 'Knees', absSlots: [], blocks: [C('Knee strength', ['legsBw2', 'shin', 'posLegs'], { ...LIFT, values: [2, 3] }), F('Hips & quads', ['fxQuad', 'fxHips', 'ygRest?'], FLOW_SCALED)] },
      wrists: { label: 'Wrists & shoulders', short: 'Wrists', blocks: [C('Shoulders & upper back', ['shoulderBw', 'trapsBw', 'backBw'], { ...LIFT, values: [2, 3] }), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
    },
  },
];
