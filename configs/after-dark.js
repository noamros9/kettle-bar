// After dark, Phase 18 (#185): the new After dark subjects, family Mixed. The first 30 After dark programs (Phase 16)
// stay in configs/mixed.js. Couple programs (`couple: true`) are sessions for two, him and her, mostly the same moves
// for both, from catalogue 10's couple exercises; they stay out of build your own and random workouts.
// Mixed rules hold: every main block tagged with its family, two families or more a day, no abs after a flow.
// Partner work is Strength or Cardio & combat; teasing, dares and massage are Mind & body flows; positions are a
// Cardio & combat flow of timed holds, held longer at Levels II and III.
const { S, SS, C, E, A, T, F } = require('./shared.js');

const LIFT = { family: 'Strength' };
const COND = { family: 'Cardio & combat' };
const CORE = { family: 'Mind & body', lever: [null, 'reps', 'reps'] };
const TEASE = { family: 'Mind & body', lever: [null, 'holds', 'holds'] };
const POS = { family: 'Cardio & combat', lever: [null, 'holds', 'holds'] };
const COUPLE = { added: 18, catalogue: 10, couple: true, equip: 'bw' };

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
];
