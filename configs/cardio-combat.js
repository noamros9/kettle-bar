const { S, C, E, A, T, L, B } = require('./shared.js');

const CONFIGS = [
  // ---------------- CONDITIONING (25 min) ----------------
  {
    id: 'engine', name: 'Engine', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'variation'],
    split: 'Full body A / B', blurb: 'Full-body circuits with short rests, finished by an AMRAP: as many rounds as you can in a few minutes.',
    names: ['Piston', 'Turbo', 'Crankshaft', 'Camshaft', 'Flywheel', 'Throttle', 'Redline', 'Gearbox', 'Spark', 'Intake', 'Exhaust', 'Torque', 'Revolution', 'Overdrive', 'Clutch', 'Radiator', 'Manifold', 'Ignition', 'Drivetrain', 'Rotor'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Circuit', ['cardio', 'squat', 'push', 'row', 'cardio']), A('AMRAP finisher', ['total', 'cardio'])] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Circuit', ['total', 'lunge', 'cardio', 'pushLoad', 'cardio']), A('AMRAP finisher', ['kbBallistic', 'push'])] },
    },
  },
  {
    id: 'storm-front', name: 'Storm Front', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'variation'],
    split: 'Kettlebell day / bodyweight day', blurb: 'Alternates kettlebell EMOMs with bodyweight Tabata intervals (20 s hard, 10 s rest).',
    names: ['Squall', 'Gale', 'Tempest', 'Cyclone', 'Monsoon', 'Thunderhead', 'Downpour', 'Hailstorm', 'Sirocco', 'Mistral', 'Whirlwind', 'Blizzard', 'Typhoon', 'Nor\'easter', 'Derecho', 'Cloudburst', 'Lightning', 'Sharav', 'Haboob', 'Microburst'],
    cycle: ['kb', 'bw'],
    dayTypes: {
      kb: { label: 'Kettlebell EMOM', short: 'KB', blocks: [E('Kettlebell EMOM', ['kbBallistic', 'kbLower', 'cardio'], { values: [12, 14, 16, 18, 20] })] },
      bw: { label: 'Bodyweight Tabata', short: 'Tabata', blocks: [T('Tabata', ['cardio', 'legsBw', 'push', 'cardio'], { values: [2, 3, 4] }), C('Burnout', ['core', 'cardio'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'tabata-ten', name: 'Tabata Ten', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Full body A / B / C', blurb: 'Tabata blocks (20 s on, 10 s off) followed by a kettlebell AMRAP finisher.',
    names: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Omega'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Legs & cardio', short: 'A', blocks: [T('Tabatas', ['cardio', 'legsBw', 'cardio', 'legsBw']), A('Kettlebell AMRAP', ['kbBallistic', 'kbLower'])] },
      b: { label: 'Upper & cardio', short: 'B', blocks: [T('Tabatas', ['push', 'cardio', 'core', 'cardio']), A('Kettlebell AMRAP', ['kbBallistic', 'kbUpper'])] },
      c: { label: 'Total body', short: 'C', blocks: [T('Tabatas', ['total', 'cardio', 'legsBw', 'push']), A('Kettlebell AMRAP', ['kbBallistic', 'kbLower'])] },
    },
  },
  // ---------------- BOXING (Phase 5: 3-minute bouts, one combo each, no equipment; abs to finish) ----------------
  {
    id: 'fight-camp', added: 5, name: 'Fight Camp', subject: 'Boxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts A / bouts B', blurb: 'Shadowboxing in 3-minute bouts: one combination per bout, called out as the bell starts, then abs.',
    about: 'Shadowboxing like a fighter in camp: five or six 3-minute bouts with a minute of rest between. Each bout drills one combination, called out by the voice as it starts, mixing basics, power shots and defence. Every session ends with abs. Levels II and III bring longer combinations. No equipment, just room to move.',
    names: ['Opening Bell', 'Southside Gym', 'Sparring Day', 'Corner Man', 'Title Shot', 'Weigh-In', 'Main Event', 'Undercard', 'Headliner', 'Contender', 'Road Work', 'Hand Wraps', 'Mouthguard', 'Ring Rope', 'Canvas', 'Split Decision', 'Knockdown', 'Standing Eight', 'Final Round', 'Champion'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts A', short: 'A', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxBasic', 'bxPower?', 'bxDefense?'])] },
      b: { label: 'Bouts B', short: 'B', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense', 'bxPower?', 'bxBasic?'])] },
    },
  },
  {
    id: 'southpaw-switch', added: 5, name: 'Southpaw Switch', subject: 'Boxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Orthodox & southpaw A / B', blurb: 'Boxing bouts that switch stance each bout, so both hands learn to lead.',
    about: 'Boxing bouts that switch stance every bout, so both sides learn to lead and to throw the power hand. The odd bouts are orthodox, left foot forward, and the even bouts southpaw, the mirror image; the voice calls the stance with each combo. The combinations stay the same, which makes the weak side easy to hear and to feel. Levels II and III bring longer combinations, and abs finish every session.',
    names: ['Mirror', 'Lefty', 'Switch Hitter', 'Converted', 'Other Hand', 'Flip Side', 'Reflection', 'Two-Way', 'Ambidextrous', 'Crossroads', 'Swap Foot', 'Turnabout', 'Reverse', 'Opposite Lock', 'Twin Fists', 'Even Split', 'Mirror Match', 'Lead Change', 'Both Barrels', 'Full Circle'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Switch A', short: 'A', blocks: [B('Bouts · switch stance each bout', ['bxBasic', 'bxBasic', 'bxPower', 'bxDefense', 'bxPower?', 'bxBasic?'], { switchStance: 1 })] },
      b: { label: 'Switch B', short: 'B', blocks: [B('Bouts · switch stance each bout', ['bxMove', 'bxPower', 'bxBasic', 'bxDefense', 'bxBasic?', 'bxPower?'], { switchStance: 1 })] },
    },
  },
  {
    id: 'speed-and-footwork', added: 5, name: 'Speed & Footwork', subject: 'Boxing', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Feet A / feet B', blurb: 'Lighter, quicker boxing: footwork, speed-bag hands and fast one-twos, in 3-minute bouts.',
    about: 'Lighter, quicker boxing for speed and footwork. Bouts alternate between moving your feet, speed-bag hands and fast basic combinations, with some defence in between. Sessions are a little shorter, around 25 minutes, and end with abs. Levels II and III bring longer combinations. Good as a cardio day that still teaches something.',
    names: ['Quickstep', 'Light Feet', 'Hummingbird', 'Blur', 'Flicker', 'Skip Rope', 'Shuffle', 'Pitter-Patter', 'Tap Dance', 'Rapid Fire', 'Snap', 'Whip', 'Zip', 'Sprint', 'Dart', 'Swift', 'Jitterbug', 'Drumroll', 'Staccato', 'Allegro'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Feet A', short: 'A', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxMove', 'bxBasic?', 'bxDefense?'])] },
      b: { label: 'Feet B', short: 'B', blocks: [B('Bouts', ['shadow_footwork', 'bxBasic', 'speed_bag', 'bxDefense?', 'bxBasic?'])] },
    },
  },
  {
    id: 'heavy-hands', added: 5, name: 'Heavy Hands', subject: 'Boxing', minutes: [30, 35], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Power bouts + conditioning', blurb: 'Power combinations in 3-minute bouts, then a bodyweight conditioning circuit, then abs.',
    about: 'Power boxing followed by bodyweight conditioning. Four or five bouts drill the heavier combinations, uppercuts, hooks and body shots, with a minute of rest between. A circuit of push-ups, legs, core and cardio follows, then abs. Levels II and III bring longer combinations and harder circuit moves. The longest boxing session here, around 35 minutes.',
    names: ['Sledgehammer', 'Anvil', 'Iron Fist', 'Wrecking Ball', 'Haymaker', 'Brick Wall', 'Pile Driver', 'Battering Ram', 'Thunderclap', 'Heavy Bag', 'Stone Hands', 'Big Swing', 'Demolition', 'Bulldozer', 'Cannonball', 'Mallet', 'Boulder', 'Earthquake', 'Avalanche', 'Knockout'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Power bouts + circuit', short: 'A', blocks: [B('Power bouts', ['bxPower', 'bxPower', 'bxBasic', 'bxPower?', 'bxDefense?']), C('Conditioning', ['push', 'legsBw', 'core', 'cardio'], { values: [2, 3, 4] })] },
      b: { label: 'Power bouts + circuit B', short: 'B', blocks: [B('Power bouts', ['bxPower', 'bxBasic', 'bxPower', 'bxDefense?', 'bxPower?']), C('Conditioning', ['legsBw', 'push', 'cardio', 'core'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'boxers-engine', added: 5, name: "Boxer's Engine", subject: 'Boxing', minutes: [28, 33], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts + Tabata A / B', blurb: 'Boxing bouts for skill, then Tabata intervals for the engine a fighter needs, then abs.',
    about: 'Boxing bouts for skill, then Tabata intervals for the engine. Three or four 3-minute bouts mix basics, movement and power, and a Tabata of cardio and core follows: 20 seconds hard, 10 seconds rest. Abs finish every session. Levels II and III bring longer combinations and harder cardio moves. For fitness first, with boxing as the way in.',
    names: ['Gas Tank', 'Second Wind', 'Last Round', 'Stamina', 'Engine Room', 'Pistons', 'Bellows', 'Furnace Round', 'Endurance', 'Long Haul', 'Twelve Rounds', 'Distance', 'Pace Setter', 'Afterburner', 'Overdrive Round', 'Grit', 'Stoker', 'Boiler', 'Marathon Man', 'Iron Lungs'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts + Tabata A', short: 'A', blocks: [B('Bouts', ['bxBasic', 'bxMove', 'bxPower', 'bxDefense?']), T('Tabata', ['cardio', 'core', 'cardio', 'cardio'], { values: [1, 2] })] },
      b: { label: 'Bouts + Tabata B', short: 'B', blocks: [B('Bouts', ['bxMove', 'bxPower', 'bxBasic', 'bxBasic?']), T('Tabata', ['cardio', 'cardio', 'core', 'cardio'], { values: [1, 2] })] },
    },
  },
  // ---------------- KICKBOXING (Phase 5: bouts with kicks and knees, no equipment; abs to finish) ----------------
  {
    id: 'muay-thai-basics', added: 5, name: 'Muay Thai Basics', subject: 'Kickboxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Kicks & knees A / B', blurb: 'The Muay Thai basics in 3-minute bouts: teeps, roundhouses and knees, with simple punches between.',
    about: 'The Muay Thai basics, one per 3-minute bout: the teep, the roundhouse and knee strikes, with simple punches between. The voice calls each bout as it starts, and a minute of rest follows. Abs finish every session. Levels II and III bring harder versions, like the switch kick and jab-teep. No equipment, just room to kick.',
    names: ['Wai Kru', 'Mongkol', 'Prajioud', 'Nak Muay', 'Lumpinee', 'Rajadamnern', 'Sak Yant', 'Teep Line', 'Clinch Hold', 'Shin Guard', 'Pad Round', 'Kru', 'Camp Morning', 'Tamarind', 'Coconut Oil', 'Liniment', 'Ring Walk', 'Ram Muay', 'Sarama', 'Golden Belt'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Kicks & knees A', short: 'A', blocks: [B('Bouts', ['teep', 'roundhouse', 'kkKnee', 'bxBasic', 'kkKick?', 'kkCombo?'])] },
      b: { label: 'Kicks & knees B', short: 'B', blocks: [B('Bouts', ['kkKick', 'bxBasic', 'kkKnee', 'kkCombo', 'kkKick?', 'kkKnee?'])] },
    },
  },
  {
    id: 'kick-combos', added: 5, name: 'Kick Combos', subject: 'Kickboxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Combos A / B', blurb: 'Punches that set up kicks: jab-cross-roundhouse, hook-low kick and more, one combo per bout.',
    about: 'Kickboxing combinations where the hands set up the kicks: jab-cross-roundhouse, hook-low kick and jab-teep. Each 3-minute bout drills one combination, called out as it starts, with single kicks mixed in. Abs finish every session. Levels II and III bring longer combinations. Suits you once the single kicks feel natural.',
    names: ['Setup', 'Feint', 'Chain', 'Link', 'Sequence', 'Relay', 'Cascade Strike', 'Follow-Up', 'Double Up', 'Combo Breaker', 'Rhythm', 'Tempo', 'Crossfire', 'Counterpunch', 'Overlap', 'Weave', 'Braid', 'Stitch', 'Thread', 'Finisher'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Combos A', short: 'A', blocks: [B('Bouts', ['kkCombo', 'kkCombo', 'kkKick', 'kkCombo', 'kkCombo?', 'kkKick?'])] },
      b: { label: 'Combos B', short: 'B', blocks: [B('Bouts', ['kkKick', 'kkCombo', 'kkCombo', 'kkSpin', 'kkCombo?', 'kkKick?'])] },
    },
  },
  {
    id: 'clinch-and-knees', added: 5, name: 'Clinch & Knees', subject: 'Kickboxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Knees A / B', blurb: 'The close range of Muay Thai: clinch knees, knee strikes and teeps to make space.',
    about: 'The close range of Muay Thai: clinching, knee strikes, and teeps to make space again. Bouts alternate between knee work and kicks or combinations, so the hips and core work hard all session. Abs finish every day. Levels II and III bring harder versions. Tough on the hip flexors, so warm up properly.',
    names: ['Plum', 'Collar Tie', 'Underhook', 'Overhook', 'Frame', 'Pummel', 'Lock', 'Grip', 'Tie-Up', 'Break Away', 'Close Quarters', 'Inside Line', 'Elbow Line', 'Head Position', 'Posture Break', 'Sweep', 'Dump', 'Off-Balance', 'Knee Wall', 'Iron Grip'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Knees A', short: 'A', blocks: [B('Bouts', ['clinch_knees', 'teep', 'kkKnee', 'kkCombo', 'kkKnee?', 'kkKick?'])] },
      b: { label: 'Knees B', short: 'B', blocks: [B('Bouts', ['knee_strike', 'kkKick', 'clinch_knees', 'bxBasic', 'kkCombo?', 'kkKnee?'])] },
    },
  },
  {
    id: 'kickboxing-cardio', added: 5, name: 'Kickboxing Cardio', subject: 'Kickboxing', minutes: [24, 29], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts + Tabata A / B', blurb: 'Kickboxing bouts for fun and sweat, then a Tabata of cardio and core, then abs.',
    about: 'Kickboxing for sweat: three or four bouts of kicks, punches and combinations, then a Tabata of cardio and core. The bouts keep the skill honest and the Tabata makes sure you finish tired. Abs close every session. Levels II and III bring harder kicks and combinations. Around 25 minutes.',
    names: ['Heatwave', 'Firecracker', 'Sizzle', 'Scorcher', 'Heat Rash', 'Sauna', 'Steam', 'Ember Kick', 'Flashpoint', 'Tinderbox', 'Hotfoot', 'Sweatband', 'Blaze Kick', 'Chili', 'Wildfire', 'Sunburn', 'Boiling Point', 'Magma', 'Heat Lamp', 'Inferno'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts + Tabata A', short: 'A', blocks: [B('Bouts', ['kkKick', 'bxBasic', 'kkCombo', 'bxMove?']), T('Tabata', ['cardio', 'cardio', 'core', 'cardio'], { values: [1, 2] })] },
      b: { label: 'Bouts + Tabata B', short: 'B', blocks: [B('Bouts', ['kkCombo', 'kkKick', 'bxBasic', 'kkKnee?']), T('Tabata', ['cardio', 'core', 'cardio', 'cardio'], { values: [1, 2] })] },
    },
  },
  {
    id: 'full-contact', added: 5, name: 'Full Contact', subject: 'Kickboxing', minutes: [31, 36], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Everything + conditioning', blurb: 'Everything together, with no contact: kicks, punches, knees and spinning kicks, then a hard circuit.',
    about: 'Everything together, with no actual contact: kick combinations, power punches, knees and spinning kicks, bout after bout. A bodyweight conditioning circuit follows, then abs. The longest kickboxing session, 31 to 36 minutes. Levels II and III bring longer combinations and harder circuit moves. Best once the other kickboxing programs feel comfortable.',
    names: ['Main Card', 'Title Fight', 'Five Rounds', 'Championship', 'Grand Prix', 'Tournament', 'Showdown', 'Rematch', 'Unification', 'Super Fight', 'Prize Fight', 'Headline', 'Fight Night', 'Walkout', 'Face-Off', 'Stare Down', 'Bell to Bell', 'War', 'Legacy Fight', 'Undisputed'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Everything + circuit A', short: 'A', blocks: [B('Bouts', ['kkCombo', 'bxPower', 'kkKnee', 'kkSpin', 'kkCombo?']), C('Conditioning', ['legsBw', 'push', 'core', 'cardio'], { values: [2, 3] })] },
      b: { label: 'Everything + circuit B', short: 'B', blocks: [B('Bouts', ['kkKick', 'kkCombo', 'bxPower', 'kkKnee', 'bxDefense?']), C('Conditioning', ['push', 'legsBw', 'cardio', 'core'], { values: [2, 3] })] },
    },
  },
  // ---------------- HIIT (Phase 5: the existing timed formats; abs to finish) ----------------
  {
    id: 'hiit-20', added: 5, name: 'HIIT 20', subject: 'HIIT', minutes: [18, 22], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Intervals / EMOM', blurb: 'Twenty minutes of hard intervals with no equipment: a circuit and an AMRAP, or an EMOM.',
    about: 'Twenty hard minutes with no equipment. One day is a fast circuit of jumps, sprawls and bodyweight strength, finished by a short AMRAP. The other is an EMOM that changes exercise every minute. Abs close each session. Level II adds reps and Level III brings harder variations.',
    names: ['Red Zone', 'Redline Sprint', 'Max Effort', 'All Out', 'Flat Out', 'Full Throttle', 'Pedal Down', 'Gun It', 'Floor It', 'Top Speed', 'Warp', 'Hyper', 'Nitro', 'Rocket', 'Jet', 'Supersonic', 'Mach', 'Lightspeed', 'Quantum', 'Big Bang'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Intervals', short: 'A', blocks: [C('Intervals', ['hiit', 'legsBw', 'hiit', 'push'], { values: [2, 3, 4] }), A('Finisher', ['hiit', 'core'], { values: [2, 3, 4, 5] })] },
      b: { label: 'EMOM', short: 'B', blocks: [E('EMOM', ['hiit', 'legsBw', 'hiit', 'core'], { values: [10, 12, 14, 16] })] },
    },
  },
  {
    id: 'tabata-torch', added: 5, name: 'Tabata Torch', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Tabatas A / B', blurb: 'Tabata after Tabata: 20 seconds as hard as you can, 10 seconds rest, with no equipment.',
    about: 'Tabata after Tabata: 20 seconds as hard as you can, then 10 seconds of rest, eight times, with a minute between Tabatas. Each Tabata rotates through jumps, legs and core, and the timer runs the whole block. Abs finish each session. Level II adds reps to the moves and Level III brings harder variations. Short, brutal and over quickly.',
    names: ['Blowtorch', 'Flamethrower', 'Match', 'Lighter', 'Fuse', 'Wick Burn', 'Signal Fire', 'Beacon Fire', 'Campfire', 'Bonfire Night', 'Firework', 'Roman Candle', 'Sparkler', 'Catherine Wheel', 'Rocket Fire', 'Flare Gun', 'Kindler', 'Stoke', 'Ignite', 'Burn Out'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Tabatas A', short: 'A', blocks: [T('Tabatas', ['hiit', 'legsBw', 'hiit', 'core'], { values: [2, 3, 4] })] },
      b: { label: 'Tabatas B', short: 'B', blocks: [T('Tabatas', ['hiit', 'push', 'hiit', 'legsBw'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'thirty-thirty', added: 5, name: '30/30 Intervals', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: '30/30 A / B', blurb: 'Thirty seconds flat out, thirty seconds easy, every minute on the minute.',
    about: 'Thirty seconds flat out, then thirty seconds easy, every minute on the minute. The work is sprints in place, fast feet and shuffles, alternating with jump and bodyweight minutes. A short circuit follows on one of the days, and abs close each session. Levels II and III add reps. Simple to follow: the timer tells you when to go.',
    names: ['Half and Half', 'Split Minute', 'Tick', 'Tock', 'Pendulum Swing', 'Metronome', 'Heartbeat', 'Stop-Go', 'Red Light', 'Green Light', 'Traffic Light', 'Toggle', 'Switchback', 'Seesaw', 'Yo-Yo', 'Tide In', 'Tide Out', 'Breath In', 'Breath Out', 'Round Trip'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: '30/30 A', short: 'A', blocks: [E('30 on, 30 off', ['hiitSec', 'hiit', 'hiitSec', 'hiit'], { values: [14, 16, 18, 20] })] },
      b: { label: '30/30 B', short: 'B', blocks: [E('30 on, 30 off', ['hiitSec', 'legsBw', 'hiitSec', 'hiit'], { values: [10, 12, 14] }), C('Burnout', ['push', 'core'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'pyramid-hiit', added: 5, name: 'Pyramid HIIT', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Ladder + Tabata / ladder + AMRAP', blurb: 'Rep ladders that climb and climb, with a Tabata or an AMRAP to finish.',
    about: 'Rep ladders that climb: one rep of each move, then two, then three, for as long as the clock allows. One day pairs the ladder with a Tabata, the other with an AMRAP. Abs close every session. Level II adds reps and Level III brings harder variations. Satisfying if you like seeing a number go up.',
    names: ['Step Pyramid', 'Ziggurat', 'Giza', 'Summit', 'Staircase', 'Escalator', 'Climb', 'Ascent', 'Stack', 'Tower Climb', 'Rungs', 'Scale', 'Crescendo', 'Build Up', 'Spire', 'Pinnacle', 'Apex', 'Crown', 'Peak', 'Top Step'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladder + Tabata', short: 'A', blocks: [L('Pyramid ladder', ['hiit', 'push', 'legsBw']), T('Tabata', ['hiit', 'core', 'hiit', 'core'], { values: [1, 2] })] },
      b: { label: 'Ladder + AMRAP', short: 'B', blocks: [L('Pyramid ladder', ['hiit', 'legsBw', 'core']), A('AMRAP', ['hiit', 'push', 'hiit'])] },
    },
  },
  {
    id: 'afterburn', added: 5, name: 'Afterburn', subject: 'HIIT', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Circuit + Tabata / EMOM + AMRAP', blurb: 'The longest HIIT session: a circuit and a Tabata, or an EMOM and an AMRAP, then abs.',
    about: 'The longest and hardest HIIT session here, around half an hour. One day is a jump-heavy circuit followed by a Tabata, the other an EMOM followed by an AMRAP. Abs close both. Level II adds reps and Level III brings harder variations. Take a lighter day after it.',
    names: ['Ember Glow', 'Smoulder', 'Heat Soak', 'Coal Bed', 'Hot Coals', 'Glowing', 'Residual', 'Aftershock', 'Echo', 'Ripple Effect', 'Long Tail', 'Wake Burn', 'Lingering', 'Still Warm', 'Radiant', 'Thermal', 'Heat Sink', 'Kiln Glow', 'Forge Glow', 'Banked Fire'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit + Tabata', short: 'A', blocks: [C('Circuit', ['hiit', 'legsBw', 'push', 'hiit', 'core'], { values: [2, 3, 4] }), T('Tabata', ['hiit', 'hiitSec', 'hiit', 'core'], { values: [1, 2] })] },
      b: { label: 'EMOM + AMRAP', short: 'B', blocks: [E('EMOM', ['hiit', 'push', 'hiitSec', 'legsBw'], { values: [10, 12, 14] }), A('AMRAP', ['hiit', 'core', 'legsBw'], { values: [5, 6, 7, 8] })] },
    },
  },
  // ---------------- PLYOMETRICS (Phase 5: straight sets of few, explosive reps with long rests; abs to finish) ----------------
  ...(() => {
    const base = { added: 5, subject: 'Plyometrics', equip: 'bw', rests: { set: 60, exercise: 90 } };
    return [
      { ...base, id: 'spring-loaded', name: 'Spring Loaded', minutes: [25, 30], levers: [null, 'reps', 'variation'], split: 'Jumps / bounds',
        blurb: 'An introduction to jumping: squat jumps, broad jumps and bounds, few reps and full rests.',
        about: 'An introduction to jumping well: squat jumps, broad jumps, drop squats and bounds. Every rep is done fresh, so sets are short and rests are long: a minute between sets and a minute and a half between exercises. Abs finish each session. Level II adds reps and Level III brings harder jumps. Land softly and stop a set when it stops being springy.',
        names: ['Coil', 'Spring', 'Recoil', 'Bounce', 'Pop', 'Snap Jump', 'Catapult', 'Slingshot', 'Launch', 'Liftoff', 'Rebound Jump', 'Kangaroo', 'Hare', 'Grasshopper', 'Cricket', 'Springbok', 'Gazelle', 'Impala', 'Jackrabbit', 'Flea'],
        cycle: ['jumps', 'bounds'],
        dayTypes: {
          jumps: { label: 'Jumps', short: 'Jumps', blocks: [S('Jumps', ['plyoLow', 'plyoLow', 'plyoVert', 'plyoLow?'])] },
          bounds: { label: 'Bounds', short: 'Bounds', blocks: [S('Bounds', ['plyoLat', 'plyoLow', 'plyoLat', 'plyoLow?'])] },
        } },
      { ...base, id: 'vertical', name: 'Vertical', minutes: [25, 30], levers: [null, 'reps', 'variation'], split: 'Height A / height B',
        blurb: 'Jump higher: pogo hops, pause squat jumps, tuck jumps and single-leg hops, then leg strength.',
        about: 'Everything aimed at jumping higher: springy pogo hops, pause squat jumps, tuck jumps and single-leg hops. Jumps come first while you are fresh, with long rests, then a little single-leg strength to back them up. Abs finish each session. Level II adds reps and Level III brings harder jumps. Test your reach on a wall now and again.',
        names: ['Rim', 'Hang Time', 'Skyward', 'High Point', 'Ceiling', 'Updraft', 'Thermal Lift', 'Altitude', 'Elevation', 'Rise Up', 'Air Time', 'Float', 'Soar', 'Leap Up', 'Lift', 'Jumpman', 'High Bar', 'Top Shelf', 'Stratosphere', 'Cloud Nine'],
        cycle: ['a', 'b'],
        dayTypes: {
          a: { label: 'Height A', short: 'A', blocks: [S('Jumps', ['pogo_hops', 'pause_squat_jump', 'plyoVert', 'plyoVert?']), S('Strength', ['legsBw', 'legsBw?'])] },
          b: { label: 'Height B', short: 'B', blocks: [S('Jumps', ['plyoVert', 'single_leg_hops', 'plyoVert', 'plyoVert?']), S('Strength', ['legsBw', 'legsBw?'])] },
        } },
      { ...base, id: 'plyo-legs', name: 'Plyo Legs', minutes: [28, 32], levers: [null, 'reps', 'variation'], split: 'Forward / sideways',
        blurb: 'Explosive legs in every direction: jumps forward and up one day, sideways the next.',
        about: 'Explosive legs in every direction. One day jumps forward and up with broad jumps, bounds and squat jumps, the other goes sideways with lateral bounds, skaters and single-leg hops. Short sets and long rests keep every rep sharp, then abs finish. Level II adds reps and Level III brings harder jumps. Good for running and field sports.',
        names: ['Stride', 'Sprinter', 'Hurdle', 'Long Jump', 'Triple Jump', 'Hop Step', 'Takeoff Board', 'Sandpit', 'Track', 'Starting Block', 'Lane Change', 'Cutback', 'Sidestep', 'Crossover Step', 'Shuttle', 'Zigzag', 'Slalom', 'Cone Drill', 'Agility Ladder', 'Fast Break'],
        cycle: ['forward', 'side'],
        dayTypes: {
          forward: { label: 'Forward & up', short: 'Forward', blocks: [S('Forward & up', ['broad_jump', 'bounding', 'plyoLow', 'plyoLow', 'plyoLow?'])] },
          side: { label: 'Sideways', short: 'Side', blocks: [S('Sideways', ['lateral_bounds', 'skater_jumps', 'plyoLat', 'plyoLat', 'plyoLow?'])] },
        } },
      { ...base, id: 'upper-plyo', name: 'Upper Plyo', minutes: [24, 29], levers: [null, 'reps', 'variation'], split: 'Push power A / B',
        blurb: 'Explosive upper body: clap push-ups, explosive push-ups and sprawls, then push strength.',
        about: 'Explosive upper-body power: clap push-ups, explosive push-ups and sprawls, with long rests so each rep is fast. Push strength follows, then abs. Two days alternate the moves. Level II adds reps and Level III brings harder variations. Knees down on the clap push-ups is fine while the power builds.',
        names: ['Shove', 'Thrust Up', 'Push Off', 'Clap Back', 'Rebound Push', 'Pop Up', 'Snap Push', 'Firework Push', 'Burst', 'Bang', 'Kickback Push', 'Recoil Push', 'Ricochet', 'Punchline', 'Strike Force', 'Shockwave', 'Blast', 'Detonate', 'Boom', 'Thunderclap Push'],
        cycle: ['a', 'b'],
        dayTypes: {
          a: { label: 'Push power A', short: 'A', blocks: [S('Power', ['clap_pushup', 'plyoUp', 'plyoUp?']), S('Push strength', ['push', 'push', 'pike_pushup?'])] },
          b: { label: 'Push power B', short: 'B', blocks: [S('Power', ['explosive_pushup', 'plyoUp', 'plyoUp?']), S('Push strength', ['push', 'pike_pushup', 'push?'])] },
        } },
      { ...base, id: 'explosive-full-body', name: 'Explosive Full Body', minutes: [28, 32], levers: [null, 'reps', 'variation'], split: 'Legs & push / bounds & push',
        blurb: 'Jumps and explosive push-ups together, in straight sets with long rests.',
        about: 'Jumps and explosive push-ups together, for power from head to toe. Each session alternates a lower-body jump with an upper-body power move, in straight sets with long rests. Abs finish every day. Level II adds reps and Level III brings harder variations. The most demanding plyometrics program here, so come in fresh.',
        names: ['Dynamite', 'Powder Keg', 'Blast Radius', 'Chain Reaction', 'Nuclear', 'Reactor', 'Megaton', 'Supernova', 'Big Bang Power', 'Eruption', 'Volcano', 'Geyser', 'Tsunami', 'Hurricane', 'Tornado', 'Lightning Strike', 'Thunderbolt', 'Firestorm', 'Meteor', 'Comet'],
        cycle: ['a', 'b'],
        dayTypes: {
          a: { label: 'Legs & push', short: 'A', blocks: [S('Power', ['plyoLow', 'plyoUp', 'plyoLow', 'plyoUp', 'plyoVert?'])] },
          b: { label: 'Bounds & push', short: 'B', blocks: [S('Power', ['plyoLat', 'plyoUp', 'plyoLat', 'plyoUp', 'plyoLow?'])] },
        } },
    ];
  })(),
  // ---------------- MORE CONDITIONING (Phase 5) ----------------
  {
    id: 'sweat-circuit', added: 5, name: 'Sweat Circuit', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'variation'],
    split: 'Circuit A / circuit B', blurb: 'Big full-body circuits with dumbbells, kettlebell and bodyweight, then abs.',
    about: 'Big full-body circuits that mix dumbbells, the kettlebell and bodyweight, round after round. Each has a total-body lift, a jump, a push, a pull and a squat. Two circuits alternate, each around 25 minutes with abs to finish. Level II adds reps and Level III brings harder variations. For fitness that still builds some strength.',
    names: ['Drench', 'Soak', 'Downpour Circuit', 'Deluge', 'Torrent', 'Flood', 'Tsunami Circuit', 'Monsoon Circuit', 'Rainmaker', 'Storm Drain', 'Puddle', 'Splash', 'Drizzle', 'Shower', 'Steam Room', 'Humid', 'Muggy', 'Tropics', 'Jungle', 'Rainforest'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Circuit', ['total', 'hiit', 'push', 'row2', 'squat2'], { values: [2, 3, 4] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Circuit', ['kbBallistic', 'hiit', 'lunge2', 'pushLoad2', 'cardio'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'chipper', added: 5, name: 'Chipper', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'variation'],
    split: 'Long AMRAP / ladder', blurb: 'Long AMRAPs and ladders you chip away at: one long block, then abs.',
    about: 'Long blocks you chip away at: one day a long AMRAP of five moves, the other a rep ladder against the clock. Pace yourself and keep moving; the counter tracks rounds and rungs. Abs finish each session. Level II adds reps and Level III brings harder variations. Good for learning to hold a steady effort.',
    names: ['Chisel Away', 'Grindstone Circuit', 'Whittle', 'Sandpaper', 'File Down', 'Erode', 'Drip', 'Slow Burn', 'Steady State', 'Long Haul Circuit', 'Marathon Block', 'Endurance Block', 'Distance Block', 'Tortoise', 'Plodder', 'Diesel', 'Freight Train', 'Tractor', 'Mule', 'Workhorse'],
    cycle: ['amrap', 'ladder'],
    dayTypes: {
      amrap: { label: 'Long AMRAP', short: 'AMRAP', blocks: [A('Long AMRAP', ['total', 'push', 'hiit', 'row2', 'squat2'], { values: [12, 15, 18] })] },
      ladder: { label: 'Ladder', short: 'Ladder', blocks: [L('Ladder', ['kbBallistic', 'push', 'squat2'], { values: [8, 10, 12] }), A('Short AMRAP', ['hiit', 'core2'], { values: [5, 6, 7, 8] })] },
    },
  },
  {
    id: 'dumbbell-complex', added: 5, name: 'Dumbbell Complex', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Complex EMOM / complex circuit', blurb: 'Dumbbell complexes: several moves in a row without putting the weights down, as EMOMs and circuits.',
    about: 'Dumbbell complexes: several moves in a row without putting the weights down. One day runs them as an EMOM, the other as a circuit, with thrusters, rows, presses, lunges and deadlifts. Abs finish each session. Level II adds reps and Level III moves you one weight up. Use lighter dumbbells than you would for straight sets.',
    names: ['Chain Gang', 'Linkage', 'Daisy Chain', 'Conveyor', 'Assembly Line', 'Production Line', 'Relay Iron', 'Sequence Iron', 'Combo Platter', 'Set Menu', 'Tasting Menu', 'Seven Courses', 'Buffet', 'Full English', 'Brunch', 'Picnic', 'Potluck', 'Smorgasbord', 'Mezze', 'Tapas'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Complex EMOM', short: 'EMOM', blocks: [E('Complex EMOM', ['db_thruster', 'row2', 'shoulders2', 'lunge2', 'hinge2'], { values: [12, 15, 18, 20] })] },
      circuit: { label: 'Complex circuit', short: 'Circuit', blocks: [C('Complex circuit', ['hinge2', 'row2', 'squat2', 'pushLoad2', 'lunge2'], { values: [2, 3, 4] })] },
    },
  },
  // ---------------- PHASE 14: a sixth program for each five-program subject (catalogue 8) ----------------
  {
    id: 'boxing-strength', added: 14, catalogue: 8, name: 'Boxing Strength', subject: 'Boxing', minutes: [30, 35], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts + strength A / B', blurb: 'Shadowboxing bouts, then bodyweight strength in straight sets for the punches behind them, then abs.',
    about: 'Shadowboxing for skill, then strength for the punches behind it. Three or four 3-minute bouts mix basics, power and defence, each one combination called out by the voice. Then come straight sets of push-ups and single-leg work with full rests, because hard punches start in the legs and finish in the arms. Abs close every session. Levels II and III bring longer combinations and harder strength moves.',
    names: ['Southside', 'Ringside', 'Corner', 'Canvas', 'Rope-a-dope', 'Weigh-in', 'Main Event', 'Undercard', 'Title Shot', 'Gym Rat', 'Sparring', 'Heavy Bag', 'Hand Wraps', 'Mouthguard', 'Bell Ringer', 'Cutman', 'Glove Up', 'Roadwork', 'Fight Night', 'Belt'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts + strength A', short: 'A', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxPower?']), S('Strength', ['pushBw2', 'legsBw2', 'pushBw2?'])] },
      b: { label: 'Bouts + strength B', short: 'B', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense?']), S('Strength', ['legsBw2', 'pushBw2', 'legsBw2?'])] },
    },
  },
  {
    id: 'kick-and-core', added: 14, catalogue: 8, name: 'Kick & Core', subject: 'Kickboxing', minutes: [28, 33], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Bouts + core A / B', blurb: 'Kickboxing bouts, then a core circuit that builds the twist and brace every kick needs.',
    about: 'Kickboxing bouts first, then a core circuit built for kicking. Three or four bouts rotate kicks, combinations and knees, called out by the voice as each bell starts. The circuit after works anti-rotation, twisting and bracing, which is where kicks get their power and balance. A short abs finisher follows. Level II brings harder kicks and Level III adds reps in the circuit.',
    names: ['Shin Guard', 'Pad Work', 'Thai Pad', 'Teep Line', 'Clinch', 'Ring Craft', 'Low Kick', 'Switch', 'Spinning Back', 'Check', 'Sweep', 'Knee Up', 'Elbow Room', 'Mongkol', 'Sak Yant', 'Tiger Line', 'Crane Kick', 'Axe Kick', 'Round Kick', 'Liver Shot'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts + core A', short: 'A', blocks: [B('Bouts', ['kkKick', 'kkCombo', 'kkKnee', 'kkCombo?']), C('Kicker\'s core', ['coreRot', 'coreAnti', 'core2', 'coreRot?'], { values: [2, 3] })] },
      b: { label: 'Bouts + core B', short: 'B', blocks: [B('Bouts', ['kkCombo', 'kkKick', 'kkSpin', 'kkKnee?']), C('Kicker\'s core', ['coreAnti', 'coreRot', 'coreHollow', 'coreAnti?'], { values: [2, 3] })] },
    },
  },
  {
    id: 'bell-intervals', added: 14, catalogue: 8, name: 'Bell Intervals', subject: 'HIIT', minutes: [22, 27], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Tabata / EMOM', blurb: 'HIIT with one kettlebell: swing-led Tabatas one day, an EMOM of bell and bodyweight moves the next.',
    about: 'Intervals with a single kettlebell. One day is Tabatas, twenty seconds of swings, snatches and bodyweight moves as hard as you can, then ten seconds of rest. The other is an EMOM, a set at the top of every minute and the rest of the minute to recover. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Cast Iron', 'Clang', 'Handle', 'Horn', 'Bell Tower', 'Toll', 'Ring Out', 'Peal', 'Anvil', 'Cannonball', 'Pood', 'Swingset', 'Hike Pass', 'Overspeed', 'Float', 'Lockout', 'Rack', 'Hardstyle', 'Pendulum', 'Iron Bell'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabata', short: 'Tabata', blocks: [T('Bell Tabatas', ['kbSwing', 'hiit', 'kbBallistic', 'core'], { values: [2, 3, 4] })] },
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('Bell EMOM', ['kbBallistic', 'hiit', 'kbLower', 'hiit'], { values: [10, 12, 14, 16] })] },
    },
  },
  {
    id: 'plyo-circuits', added: 14, catalogue: 8, name: 'Plyo Circuits', subject: 'Plyometrics', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'variation'],
    split: 'Up & out / side to side', blurb: 'Jumps in circuits: vertical, broad and lateral jumps with an upper-body power move, a full minute between rounds.',
    about: 'Jumps in circuits rather than straight sets, so legs and arms take turns while the other recovers. One day goes up and out with vertical and broad jumps, the other goes side to side with bounds and skaters, and both add an explosive push. A full minute of rest between rounds keeps every jump crisp. Abs finish each session. Level II adds reps and Level III brings harder jumps.',
    names: ['Rebound', 'Trampoline', 'Pogo', 'Coil', 'Recoil', 'Kangaroo', 'Grasshopper', 'Springbok', 'Gazelle', 'Impala', 'Jackrabbit', 'Hopscotch', 'Leapfrog', 'Bungee', 'Catapult', 'Slingshot', 'Launch Pad', 'Liftoff', 'Spring Tide', 'Boing'],
    cycle: ['up', 'side'],
    dayTypes: {
      up: { label: 'Up & out', short: 'Up', blocks: [C('Plyo circuit', ['plyoVert', 'plyoUp', 'plyoLow', 'core?'], { values: [2, 3, 4] })] },
      side: { label: 'Side to side', short: 'Side', blocks: [C('Plyo circuit', ['plyoLat', 'plyoUp', 'plyoLat', 'core?'], { values: [2, 3, 4] })] },
    },
  },
  // ---------------- PHASE 14: RUNNING PREP (drills, single-leg strength and springs for runners; abs to finish) ----------------
  {
    id: 'run-ready', added: 14, catalogue: 8, name: 'Run Ready', subject: 'Running prep', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Drills & strength A / B', blurb: 'Running drills in a circuit, then single-leg strength: the gym half of getting ready to run.',
    about: 'The training that makes running feel easier, for the days you are not running. Each session starts with a circuit of running drills, A-skips, wall drives and high knees, to groove a quick, tall stride. Then come straight sets of single-leg strength for the hips and calves that take the load on every step. Abs finish every session. Levels II and III add reps.',
    names: ['First Mile', 'Warm Lap', 'Easy Pace', 'Trailhead', 'Kerb', 'Towpath', 'Track Bend', 'Park Loop', 'Finish Line', 'Bib Number', 'Start Gun', 'Split Time', 'Negative Split', 'Cadence', 'Stride', 'Footfall', 'Second Wind', 'Runner\'s High', 'Long Way Home', 'Parkrun'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Drills & strength A', short: 'A', blocks: [C('Running drills', ['runDrill', 'runDrill', 'runFast', 'runDrill?'], { values: [2, 3] }), S('Single-leg strength', ['runLegs', 'runLegs', 'runLegs?'])] },
      b: { label: 'Drills & strength B', short: 'B', blocks: [C('Running drills', ['runDrill', 'runFast', 'runDrill', 'runDrill?'], { values: [2, 3] }), S('Single-leg strength', ['runLegs', 'runLegs', 'runLegs?'])] },
    },
  },
  {
    id: 'stride-strength', added: 14, catalogue: 8, name: 'Stride Strength', subject: 'Running prep', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Hips / calves & feet / single leg', blurb: 'Strength for runners in three days: hips, then calves and feet, then single-leg control.',
    about: 'Slow, steady strength for the parts running wears out: hips, calves, feet and knees. Three days rotate, glutes and hips, calves and feet, then single-leg control, all in straight sets with full rests. Each session ends with abs. Level II adds reps and Level III slows every rep down, which is where tendons get strong. Pair it with two or three runs a week.',
    names: ['Achilles', 'Arch', 'Heel Strike', 'Forefoot', 'Glute Med', 'Hip Drive', 'Knee Lift', 'Shin', 'Ankle', 'Soleus', 'Gastroc', 'Plantar', 'IT Band', 'Hamstring', 'Toe Off', 'Midfoot', 'Push-off', 'Landing', 'Stance', 'Swing Leg'],
    cycle: ['hips', 'calves', 'single'],
    dayTypes: {
      hips: { label: 'Hips', short: 'Hips', blocks: [S('Hips & glutes', ['single_leg_bridge', 'glute_bridge_march', 'runLegs', 'clamshell', 'runLegs?'])] },
      calves: { label: 'Calves & feet', short: 'Calves', blocks: [S('Calves & feet', ['single_leg_calf_raise', 'heel_raise', 'runLegs', 'pogo_hops', 'runLegs?'])] },
      single: { label: 'Single leg', short: 'Single', blocks: [S('Single-leg control', ['reverse_lunge', 'single_leg_rdl_bw', 'lunge_to_balance', 'runLegs', 'runLegs?'])] },
    },
  },
  {
    id: 'springy-legs', added: 14, catalogue: 8, name: 'Springy Legs', subject: 'Running prep', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'variation'],
    split: 'Bounce / bound', blurb: 'Plyometrics for runners: pogo hops, bounds and single-leg hops that teach the legs to be springs.',
    about: 'Plyometrics made for runners, so each step gives back more of the energy it takes. One day works short, stiff bounces like pogo hops and split-step hops; the other works long bounds and single-leg hops. Sets are short and rests long, a minute between sets, so every rep is springy. Abs finish each session. Level II adds reps and Level III brings harder jumps.',
    names: ['Spring Step', 'Bounce', 'Recoil', 'Elastic', 'Rubber Band', 'Tendon', 'Slinky', 'Coil Spring', 'Pogo Stick', 'Bounder', 'Gazelle Run', 'Fawn', 'Hare', 'Deer Leap', 'Antelope', 'Spring Lamb', 'Jumping Bean', 'Flea', 'Cricket', 'Frog'],
    cycle: ['bounce', 'bound'],
    dayTypes: {
      bounce: { label: 'Bounce', short: 'Bounce', blocks: [S('Bounces', ['pogo_hops', 'split_step', 'runPlyo', 'runDrill', 'runPlyo?'])] },
      bound: { label: 'Bound', short: 'Bound', blocks: [S('Bounds', ['bounding', 'single_leg_hops', 'runPlyo', 'runDrill', 'runPlyo?'])] },
    },
  },
  {
    id: 'track-intervals', added: 14, catalogue: 8, name: 'Track Intervals', subject: 'Running prep', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'EMOM / AMRAP', blurb: 'Running fitness indoors: sprint-in-place EMOMs and drill AMRAPs, for days you cannot get out.',
    about: 'Running fitness for days you cannot get outside. One day is an EMOM, a burst of sprinting on the spot, fast feet or drills at the top of every minute, recovering in what is left. The other is an AMRAP of drills and single-leg work, as many rounds as you can. Abs finish every session. Levels II and III add reps, so the recovery shrinks.',
    names: ['400s', 'Mile Repeat', 'Fartlek', 'Tempo Run', 'Strides', 'Hill Repeats', 'Lap Time', 'Back Straight', 'Home Straight', 'Lane One', 'Bell Lap', 'Kick Finish', 'Pacer', 'Splits', 'Yasso', 'Ladder Run', 'Track Spikes', 'Baton', 'Relay', 'Anchor Leg'],
    cycle: ['emom', 'amrap'],
    dayTypes: {
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('Sprint EMOM', ['runFast', 'runDrill', 'runFast', 'runPlyo'], { values: [10, 12, 14, 16] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('Drill AMRAP', ['runDrill', 'runLegs', 'runFast', 'core'], { values: [8, 10, 12] })] },
    },
  },
  {
    id: 'runners-core', added: 14, catalogue: 8, name: 'Runner\'s Core & Hips', subject: 'Running prep', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Core & glutes A / B', blurb: 'Twenty minutes of core and hip circuits that keep a runner\'s pelvis level and stride steady.',
    about: 'A short circuit for the trunk and hips that keep a running stride steady when you tire. Planks, side planks and anti-rotation work hold the pelvis level, and bridges, clamshells and single-leg drills keep the hips strong. Two days alternate with different moves. A short abs finisher follows. Level II adds reps and Level III brings harder versions.',
    names: ['Level Pelvis', 'Steady State', 'Upright Run', 'Brace', 'Keel Line', 'Gyro', 'Plumb Bob', 'Stabiliser', 'Ballast Tank', 'Centre Line', 'Midline', 'Waistline', 'Belt Line', 'Axis', 'Core Temp', 'Hip Lock', 'Hip Hinge', 'Steadfast', 'Rock Steady', 'Even Keel'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Core & glutes A', short: 'A', blocks: [C('Core & hips', ['coreAnti', 'single_leg_bridge', 'side_plank', 'clamshell', 'runLegs?'], { values: [2, 3, 4] })] },
      b: { label: 'Core & glutes B', short: 'B', blocks: [C('Core & hips', ['coreRot', 'glute_bridge_march', 'coreAnti', 'runLegs', 'clamshell?'], { values: [2, 3, 4] })] },
    },
  },
  // ---------------- PHASE 14: COURT & FIELD SPORTS (agility, first-step power and change of direction; abs to finish) ----------------
  {
    id: 'court-agility', added: 14, catalogue: 8, name: 'Court Agility', subject: 'Court & field sports', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Agility A / B', blurb: 'Quick feet for court and field: shuttles, carioca and shuffles in circuits, with a jump in every round.',
    about: 'Footwork for tennis, basketball, football and every sport that changes direction. Circuits mix shuttle touches, carioca, lateral shuffles and backpedals with a jump each round, so feet stay quick while you tire. Rounds are short with a breather between. Abs finish every session. Levels II and III add reps and time to each drill.',
    names: ['Baseline', 'Sideline', 'Penalty Box', 'Free Throw', 'Half Court', 'Centre Circle', 'Service Line', 'Paint', 'Crease', 'Goal Line', 'Touchline', 'Kick-off', 'Tip-off', 'Face-off', 'Drop Shot', 'Fast Break', 'Give and Go', 'Pick and Roll', 'Rebound', 'Breakaway'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Agility A', short: 'A', blocks: [C('Agility circuit', ['courtMove', 'courtPower', 'courtMove', 'courtLegs', 'courtMove?'], { values: [2, 3, 4] })] },
      b: { label: 'Agility B', short: 'B', blocks: [C('Agility circuit', ['courtMove', 'courtLegs', 'courtMove', 'courtPower', 'courtMove?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'change-of-direction', added: 14, catalogue: 8, name: 'Change of Direction', subject: 'Court & field sports', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'variation'],
    gear: 'A sturdy chair for the Copenhagen plank.',
    split: 'EMOM / strength', blurb: 'Cut, stop and go: agility on the minute one day, and the side-to-side leg strength behind it the next.',
    about: 'Training for the cut: stopping, planting and going the other way without losing speed. One day is an EMOM of agility drills and jumps at the top of each minute. The other is straight sets of side-to-side leg strength, Cossack squats, single-leg deadlifts and Copenhagen planks, that protect knees and groins. Abs finish every session. Level II adds reps and Level III brings harder versions.',
    names: ['Crossover', 'Jab Step', 'Juke', 'Side Step', 'Spin Move', 'Plant', 'Cut Back', 'Stutter', 'Hesitation', 'Shake', 'Pivot Foot', 'Drop Step', 'Euro Step', 'Swerve', 'Feint', 'Dummy', 'Nutmeg', 'Dodge', 'Sidestep', 'Zig-zag'],
    cycle: ['emom', 'strength'],
    dayTypes: {
      emom: { label: 'Agility EMOM', short: 'EMOM', blocks: [E('Agility EMOM', ['courtMove', 'courtPower', 'courtMove', 'courtLegs'], { values: [10, 12, 14, 16] })] },
      strength: { label: 'Lateral strength', short: 'Strength', blocks: [S('Lateral strength', ['cossack_squat', 'courtLegs', 'copenhagen_plank', 'courtLegs', 'courtLegs?'])] },
    },
  },
  {
    id: 'first-step', added: 14, catalogue: 8, name: 'First Step', subject: 'Court & field sports', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'variation'],
    split: 'Forward power / lateral power', blurb: 'The first step decides the race to the ball: jumps and bounds for explosive starts, with long rests.',
    about: 'Explosive starts, because the first step often decides who gets to the ball. One day trains forward power with broad jumps, tuck jumps and split-step hops; the other trains lateral power with bounds, skaters and hop-and-stick landings. Sets are short and rests are a full minute, so every rep is fast. Abs finish each session. Level II adds reps and Level III brings harder jumps.',
    names: ['Jump Ball', 'Gun Lap', 'Launch', 'Burst', 'Takeoff', 'Get Set', 'Blocks', 'Explode', 'Snap', 'Trigger', 'Quick Start', 'Head Start', 'Off the Mark', 'Lift Off', 'Fire', 'Spark', 'Rocket', 'Jet', 'Turbo', 'Afterburner'],
    cycle: ['forward', 'lateral'],
    dayTypes: {
      forward: { label: 'Forward power', short: 'Forward', blocks: [S('Forward power', ['broad_jump', 'split_step', 'courtPower', 'courtMove', 'courtPower?'])] },
      lateral: { label: 'Lateral power', short: 'Lateral', blocks: [S('Lateral power', ['lateral_bounds', 'skater_jumps', 'courtPower', 'courtMove', 'courtPower?'])] },
    },
  },
  {
    id: 'field-strength', added: 14, catalogue: 8, name: 'Field Strength', subject: 'Court & field sports', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Legs & power / upper & core', blurb: 'Strength for contact sports with your dumbbells and kettlebell, each day starting with a jump.',
    about: 'Strength for field and contact sports, using your dumbbells and kettlebell. Each session starts with a jump while you are fresh, then lifts in straight sets: squats, hinges and lunges one day, presses, rows and carries the other. Abs finish every session. Level II asks for heavier weights and Level III adds reps on top. Two sessions a week sit well alongside practice.',
    names: ['Scrum', 'Tackle', 'Ruck', 'Maul', 'Lineout', 'Huddle', 'Snap Count', 'Blitz', 'Endzone', 'Try Line', 'Front Row', 'Linebacker', 'Fullback', 'Wing', 'Prop', 'Hooker', 'Lock', 'Flanker', 'Number Eight', 'Scrum Half'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: { label: 'Legs & power', short: 'Legs', blocks: [S('Jump', ['courtPower']), S('Legs', ['squat2', 'hinge2', 'lunge2', 'courtLegs?'])] },
      upper: { label: 'Upper & core', short: 'Upper', blocks: [S('Jump', ['courtPower']), S('Upper & core', ['pushLoad2', 'row2', 'farmer_carry', 'shoulders2?'])] },
    },
  },
  {
    id: 'game-day', added: 14, catalogue: 8, name: 'Game Day Conditioning', subject: 'Court & field sports', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Tabata / AMRAP', blurb: 'Repeat-sprint fitness for the last ten minutes of a match: agility Tabatas and AMRAPs.',
    about: 'Fitness for the end of the match, when legs are heavy and the game is still on. One day is Tabatas, twenty seconds of agility drills and jumps as hard as you can and ten seconds of rest. The other is an AMRAP that mixes shuttles, jumps and lateral strength. Abs finish every session. Level II adds reps and Level III brings harder jumps.',
    names: ['Extra Time', 'Injury Time', 'Final Whistle', 'Last Quarter', 'Overtime', 'Sudden Death', 'Tie-break', 'Match Point', 'Set Point', 'Fourth Down', 'Buzzer Beater', 'Shootout', 'Golden Goal', 'Full Time', 'Second Half', 'Comeback', 'Stoppage', 'Hail Mary', 'Clutch', 'Final Score'],
    cycle: ['tabata', 'amrap'],
    dayTypes: {
      tabata: { label: 'Tabata', short: 'Tabata', blocks: [T('Agility Tabatas', ['courtMove', 'courtPower', 'courtMove', 'core'], { values: [2, 3, 4] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('Match AMRAP', ['courtMove', 'courtPower', 'courtLegs', 'courtMove'], { values: [8, 10, 12] })] },
    },
  },
  // ---------------- PHASE 14: 30-DAY PROGRAMS (three levels of ten days) ----------------
  {
    id: 'hiit-30', added: 14, catalogue: 8, days: 30, name: 'HIIT 30', subject: 'HIIT', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Tabata / EMOM / AMRAP, 30 days', blurb: 'A month of short, sharp HIIT with no equipment: Tabata, EMOM and AMRAP days, a new level every ten days.',
    about: 'A month of short, sharp intervals with no equipment, about twenty minutes a day. Three days rotate a Tabata, an EMOM and an AMRAP, so no two days in a row feel the same. Every ten days the level steps up: Level II adds reps and Level III brings harder moves. Abs finish every session. A good month to rebuild fitness after time off.',
    names: ['Spark Day', 'Kindle', 'Light Up', 'Heat', 'Simmer', 'Boil', 'Steam', 'Pressure', 'Red Line', 'Overdrive', 'Afterburn Day', 'Meltdown', 'Wildfire', 'Inferno', 'Phoenix'],
    cycle: ['tabata', 'emom', 'amrap'],
    dayTypes: {
      tabata: { label: 'Tabata', short: 'Tabata', blocks: [T('Tabatas', ['hiit', 'legsBw', 'hiit', 'core'], { values: [2, 3] })] },
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('EMOM', ['hiit', 'push', 'hiitSec', 'legsBw'], { values: [10, 12, 14] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('AMRAP', ['hiit', 'legsBw', 'push', 'core'], { values: [8, 10, 12] })] },
    },
  },
  {
    id: 'boxing-30', added: 14, catalogue: 8, days: 30, name: 'Boxing 30', subject: 'Boxing', minutes: [24, 29], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts A / B, 30 days', blurb: 'A month of shadowboxing: bouts of combinations called by the voice, a new level every ten days.',
    about: 'A month of shadowboxing, from first combinations to longer ones. Each session is four or five 3-minute bouts, one combination per bout called out by the voice, mixing basics, power, movement and defence. Every ten days the level steps up and the combinations get longer. Abs finish every session. No equipment, just room to move.',
    names: ['First Bell', 'Stance', 'Guard Up', 'Jab Day', 'One-Two', 'Hook Day', 'Uppercut', 'Slip', 'Roll Under', 'Counter', 'Combination', 'Footwork Day', 'Pressure Fighter', 'Twelve Rounds', 'Decision'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts A', short: 'A', blocks: [B('Bouts', ['bxBasic', 'bxMove', 'bxPower', 'bxDefense', 'bxBasic?'])] },
      b: { label: 'Bouts B', short: 'B', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxDefense', 'bxPower', 'bxPower?'])] },
    },
  },
];

// Hand-written paragraphs for the older programs (newer ones carry theirs as `about:` in the config).
const ABOUT = {
  'engine': 'Full-body circuits with short rests, finished by an AMRAP: as many rounds as you can in a few minutes. Two circuit days alternate, each about 25 minutes. Level II adds reps and Level III brings harder variations. For fitness and sweat more than maximum strength.',
  'storm-front': 'Kettlebell EMOMs one day, bodyweight Tabatas the next. The EMOMs build steady power, and the Tabatas are 20 seconds hard and 10 seconds rest, eight times over. Level II adds reps and Level III brings harder variations. Suits you if you like intervals and a clock to chase.',
  'tabata-ten': 'Tabata blocks, 20 seconds hard and 10 seconds rest, followed by a kettlebell AMRAP. Three days rotate: legs and cardio, upper and cardio, and total body. Level II adds reps and Level III moves the finisher one weight up. Short, hard sessions for conditioning.',
};
CONFIGS.forEach((c) => { if (ABOUT[c.id]) c.about = ABOUT[c.id]; });

module.exports = CONFIGS;
