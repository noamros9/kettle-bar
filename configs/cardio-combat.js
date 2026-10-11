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
  // ---------------- PHASE 14 ticket 10: Cardio & combat +13, spread over its subjects ----------------
  // CONDITIONING (+3)
  {
    id: 'dumbbell-engine', added: 14, catalogue: 8, name: 'Dumbbell Engine', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'weight', 'reps'],
    split: 'EMOM / AMRAP', blurb: 'Conditioning with your dumbbells: thrusters, rows and lunges on the minute one day, as many rounds as you can the next.',
    about: 'Conditioning built from dumbbell moves rather than jumps. One day is an EMOM, a set of thrusters, rows, swings or lunges at the top of every minute; the other an AMRAP of the same kind of moves, as many rounds as you can. Abs finish every session. Level II asks for heavier dumbbells and Level III adds reps on top.',
    names: ['Piston', 'Crankshaft', 'Camshaft', 'Flywheel', 'Gearbox', 'Clutch', 'Throttle', 'Exhaust', 'Spark Plug', 'Carburettor', 'Radiator', 'Dynamo', 'Alternator', 'Turbine', 'Combustion'],
    cycle: ['emom', 'amrap'],
    dayTypes: {
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('Dumbbell EMOM', ['total', 'row2', 'lunge2', 'squat2'], { values: [12, 14, 16] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('Dumbbell AMRAP', ['total', 'row2', 'squat2', 'pushLoad2'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'conditioning-ladders', added: 14, catalogue: 8, name: 'Conditioning Ladders', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Ladder A / ladder B', blurb: 'Two ladders a session: one rep, then two, then three, of a weighted move and a bodyweight one.',
    about: 'Conditioning by ladders: one rep of each move, then two, then three, climbing until the clock stops. Each session has two ladders, a weighted pair such as thrusters and rows, then a bodyweight pair such as burpees and lunges. The climb makes the work feel shorter than it is. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Jacob\'s Ladder', 'Rope Rung', 'Step Up Ladder', 'Climbing Frame', 'Ladder Back', 'Rungs Up', 'Fire Ladder', 'Ship Ladder', 'Loft Ladder', 'Tree Ladder', 'Library Ladder', 'Orchard Ladder', 'Painter\'s Ladder', 'Ladder Top', 'Ladder Down'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladder A', short: 'A', blocks: [L('Weighted ladder', ['total', 'row2']), L('Bodyweight ladder', ['cardio', 'legsBw'])] },
      b: { label: 'Ladder B', short: 'B', blocks: [L('Weighted ladder', ['squat2', 'pushLoad2']), L('Bodyweight ladder', ['cardio', 'push'])] },
    },
  },
  {
    id: 'work-and-rest', added: 14, catalogue: 8, name: 'Work & Rest', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'reps'],
    split: 'Circuit + Tabata A / B', blurb: 'A steady full-body circuit, then a Tabata: work, rest, work, rest, until you are done.',
    about: 'Two kinds of conditioning in one session. First a steady full-body circuit with a short rest between rounds, then a Tabata, twenty seconds as hard as you can and ten seconds of rest, eight times. The circuit builds the base and the Tabata pushes the ceiling. Abs finish every session. Both later levels add reps.',
    names: ['On Off', 'Go Stop', 'Red Green', 'Push Pause', 'Breathe Go', 'Start Stop', 'Flick', 'Switch Day', 'Toggle', 'Pulse Rest', 'Burst Rest', 'Sprint Rest', 'Hard Easy', 'Stop Start', 'Ready Go'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit + Tabata A', short: 'A', blocks: [C('Circuit', ['total', 'legsBw', 'row2', 'core'], { values: [2, 3] }), T('Tabata', ['cardio', 'core', 'cardio', 'core'], { values: [1] })] },
      b: { label: 'Circuit + Tabata B', short: 'B', blocks: [C('Circuit', ['squat2', 'push', 'row2', 'cardio'], { values: [2, 3] }), T('Tabata', ['cardio', 'legsBw', 'cardio', 'core'], { values: [1] })] },
    },
  },
  // HIIT (+2)
  {
    id: 'hiit-ladders', added: 14, catalogue: 8, name: 'HIIT Ladders', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Ladder / EMOM', blurb: 'Bodyweight HIIT that climbs: rep ladders one day, an EMOM the next, no equipment.',
    about: 'Bodyweight HIIT in two shapes. One day is a rep ladder that climbs, one rep of each move, then two, then three, as far as the clock allows; the other is an EMOM, a burst at the top of every minute. No equipment and no complicated moves. Abs finish every session. Both later levels add reps.',
    names: ['Step Climb', 'Stairway', 'Escalate', 'Ramp Up', 'Slope', 'Gradient', 'Incline', 'Rise Up', 'Up and Up', 'Higher', 'Uphill', 'Ascend', 'Elevator', 'Lift Shaft', 'Skyward'],
    cycle: ['ladder', 'emom'],
    dayTypes: {
      ladder: { label: 'Ladder', short: 'Ladder', blocks: [L('HIIT ladder', ['hiit', 'push', 'legsBw'])] },
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('HIIT EMOM', ['hiit', 'legsBw', 'hiitSec', 'push'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'quiet-hiit', added: 14, catalogue: 8, name: 'Quiet HIIT', subject: 'HIIT', minutes: [22, 27], equip: 'bw', warmup: 'quiet', levers: [null, 'variation', 'reps'],
    split: 'Circuit / AMRAP, no jumping', blurb: 'High-intensity intervals with no jumping: mountain climbers, push-ups, lunges and core, flat-friendly.',
    about: 'High intensity without a single jump, so it suits a flat, a hotel room or sore knees. Mountain climbers, fast push-ups, lunges and core moves get the heart rate up instead. One day is a fast circuit with short rests, the other an AMRAP. Abs finish every session. Level II brings harder versions and Level III adds reps on top.',
    names: ['Tiptoe HIIT', 'Silent Sweat', 'Hush Burn', 'Low Ceiling', 'Downstairs', 'Night Owl HIIT', 'Sleeping Baby', 'Thin Walls', 'Floorboards', 'Soft Landing', 'Library HIIT', 'Muted', 'Whisper Burn', 'Neighbour Friendly', 'Stealth'],
    cycle: ['circuit', 'amrap'],
    dayTypes: {
      circuit: { label: 'Circuit', short: 'Circuit', blocks: [C('Quiet circuit', ['mountain_climber', 'pushBw2', 'reverse_lunge', 'coreRot', 'bear_crawl?'], { values: [3, 4, 5] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('Quiet AMRAP', ['pushBw2', 'legsBw2', 'mountain_climber', 'coreAnti'], { values: [10, 12, 14] })] },
    },
  },
  // PLYOMETRICS (+2)
  {
    id: 'plyo-emom', added: 14, catalogue: 8, name: 'Plyo EMOM', subject: 'Plyometrics', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'reps'],
    split: 'Jump EMOM A / B', blurb: 'A few explosive jumps at the top of every minute, the rest of the minute to recover fully.',
    about: 'Jumps on the clock: a small set of explosive jumps at the top of every minute. The rest of the minute is for recovering fully, which keeps every rep fast. Vertical, broad and lateral jumps and explosive push-ups rotate. A short strength block follows. Abs finish every session. Both later levels add reps, so the recovery shrinks.',
    names: ['Jump Clock', 'Leap Minute', 'Hop Hour', 'Spring Minute', 'Bound Minute', 'Pop Minute', 'Air Minute', 'Lift Minute', 'Vault Minute', 'Rise Minute', 'Float Minute Jump', 'Soar Minute', 'Hang Time Jump', 'Flight Minute', 'Glide Minute'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Jump EMOM A', short: 'A', blocks: [E('Jump EMOM', ['plyoVert', 'plyoUp', 'plyoLow', 'plyoLat'], { values: [8, 10, 12, 14] }), S('Strength', ['legsBw2'])] },
      b: { label: 'Jump EMOM B', short: 'B', blocks: [E('Jump EMOM', ['plyoLat', 'plyoLow', 'plyoUp', 'plyoVert'], { values: [8, 10, 12, 14] }), S('Strength', ['pushBw2'])] },
    },
  },
  {
    id: 'single-leg-plyo', added: 14, catalogue: 8, name: 'Single-Leg Plyo', subject: 'Plyometrics', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'variation', 'reps'],
    split: 'Hop / bound', blurb: 'Plyometrics one leg at a time: hops, bounds, skaters and hop-and-stick landings.',
    about: 'Plyometrics one leg at a time, which is how most sports and every running stride actually load the legs. One day is hops and hop-and-stick landings, the other bounds and skaters. Sets are short and rests a full minute, so every rep is crisp and every landing is controlled. Abs finish each session. Level II brings harder jumps and Level III adds reps.',
    names: ['Hopscotch Day', 'One Foot', 'Peg Leg', 'Flamingo Hop', 'Kangaroo Rat', 'Skater Day', 'Speed Skater', 'Ice Rink', 'Long Jump', 'Triple Jump', 'Hop Step', 'Stick It', 'Land Soft', 'Steady Land', 'Hop Scotch'],
    cycle: ['hop', 'bound'],
    dayTypes: {
      hop: { label: 'Hop', short: 'Hop', blocks: [S('Hops', ['single_leg_hops', 'single_leg_hop_stick', 'plyoVert', 'single_leg_hops?'])] },
      bound: { label: 'Bound', short: 'Bound', blocks: [S('Bounds', ['bounding', 'skater_jumps', 'lateral_bound_hold', 'plyoLat?'])] },
    },
  },
  // BOXING (+2)
  {
    id: 'boxing-emom', added: 14, catalogue: 8, name: 'Boxing EMOM', subject: 'Boxing', minutes: [28, 33], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts + EMOM A / B', blurb: 'Shadowboxing bouts, then an EMOM of punches, push-ups and core for a fighter\'s fitness.',
    about: 'Shadowboxing for skill, then an EMOM for a fighter\'s fitness. Three or four bouts of combinations come first, called out by the voice. Then every minute starts a short set of punches, push-ups, burpees or core, resting in what is left. Abs finish every session. Levels II and III bring longer combinations and harder moves in the EMOM.',
    names: ['Round Bell', 'Corner Stool', 'Water Bottle', 'Towel In', 'Second Out', 'Ten Count', 'Standing Eight', 'Clinch Break', 'Referee', 'Judges', 'Scorecard Fight', 'Points', 'Split Decision', 'Unanimous', 'Knockdown'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts + EMOM A', short: 'A', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxMove?']), E('Fight EMOM', ['punches', 'push', 'cardio', 'core'], { values: [8, 10, 12] })] },
      b: { label: 'Bouts + EMOM B', short: 'B', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense?']), E('Fight EMOM', ['cardio', 'punches', 'core', 'push'], { values: [8, 10, 12] })] },
    },
  },
  {
    id: 'defence-first', added: 14, catalogue: 8, name: 'Defence First', subject: 'Boxing', minutes: [24, 29], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Slip & roll / counter', blurb: 'Shadowboxing built around defence: slips, rolls and bob-and-weave, then the counters that follow them.',
    about: 'Shadowboxing built around not getting hit. One day drills slips, rolls and bob-and-weave until they are automatic; the other drills the counters that follow, so defence turns straight into offence. Each bout is one combination, called by the voice. Abs finish every session. Levels II and III bring longer, harder combinations.',
    names: ['Slip Day', 'Roll Day', 'Weave', 'Bob', 'Duck', 'Parry', 'Block', 'Catch', 'Shell', 'High Guard', 'Peek-a-boo', 'Philly Shell', 'Shoulder Roll', 'Pull Counter', 'Check Hook'],
    cycle: ['slip', 'counter'],
    dayTypes: {
      slip: { label: 'Slip & roll', short: 'Slip', blocks: [B('Defence bouts', ['bxDefense', 'bxMove', 'bxDefense', 'bxDefense', 'bxBasic?'])] },
      counter: { label: 'Counter', short: 'Counter', blocks: [B('Counter bouts', ['slip_counter', 'bxDefense', 'bxPower', 'bxDefense', 'bxBasic?'])] },
    },
  },
  // KICKBOXING (+2)
  {
    id: 'kick-strength', added: 14, catalogue: 8, name: 'Kick Strength', subject: 'Kickboxing', minutes: [30, 35], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts + legs A / B', blurb: 'Kickboxing bouts, then single-leg strength in straight sets for higher, harder kicks.',
    about: 'Kickboxing bouts, then the leg strength behind good kicks. Three or four bouts of kicks, knees and combinations come first; then straight sets of single-leg work such as Cossack squats, single-leg deadlifts and lunges, for balance on the standing leg and power in the kicking one. Abs finish every session. Levels II and III bring harder kicks and moves.',
    names: ['Chamber', 'Pivot Kick', 'Hip Turn', 'Standing Leg', 'Shin Bone', 'Instep', 'Ball of Foot', 'Heel Kick', 'Snap Kick', 'Push Kick', 'Head Kick', 'Body Kick', 'Leg Kick', 'Calf Kick', 'Thigh Kick'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts + legs A', short: 'A', blocks: [B('Bouts', ['kkKick', 'kkCombo', 'kkKnee', 'kkKick?']), S('Leg strength', ['cossack_squat', 'single_leg_rdl_bw', 'legsBw2?'])] },
      b: { label: 'Bouts + legs B', short: 'B', blocks: [B('Bouts', ['kkCombo', 'kkKick', 'kkSpin', 'kkCombo?']), S('Leg strength', ['reverse_lunge', 'single_leg_rdl_bw', 'legsBw2?'])] },
    },
  },
  {
    id: 'kick-speed', added: 14, catalogue: 8, name: 'Kick Speed', subject: 'Kickboxing', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Speed A / speed B', blurb: 'Short, fast kickboxing bouts: quick kicks, switch kicks and footwork, about twenty-five minutes.',
    about: 'Kickboxing for speed, in about twenty-five minutes. Bouts focus on fast, snapping kicks, switch kicks and teeps, with footwork bouts between to keep the feet light. Each bout is one combination called by the voice, done as fast as you can keep it clean. Abs finish every session. Levels II and III bring longer, faster combinations.',
    names: ['Whip', 'Lash', 'Flick Kick', 'Snap', 'Blink Kick', 'Lightning', 'Thunder Kick', 'Quicksilver', 'Mercury', 'Hummingbird', 'Mongoose', 'Cobra Kick', 'Viper', 'Mantis', 'Swift Kick'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Speed A', short: 'A', blocks: [B('Speed bouts', ['kkKick', 'bxMove', 'kkCombo', 'kkKick?'])] },
      b: { label: 'Speed B', short: 'B', blocks: [B('Speed bouts', ['switch_kick', 'kkKick', 'bxMove', 'kkCombo?'])] },
    },
  },
  // RUNNING PREP (+1), COURT & FIELD SPORTS (+1)
  {
    id: 'hill-legs', added: 14, catalogue: 8, name: 'Hill Legs', subject: 'Running prep', minutes: [24, 29], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Uphill / downhill', blurb: 'Legs for hills: driving strength for the climbs, slow control for the descents.',
    about: 'Legs for running hills, both ways. Uphill days build drive with step-ups, lunges, wall drives and bounds; downhill days build control with slow single-leg work, which is where sore quads come from. Straight sets with full rests. Abs finish every session. Level II brings harder versions and Level III adds reps.',
    names: ['Switchback', 'Hairpin', 'Summit Push', 'False Flat', 'Ridge Run', 'Fell', 'Tor', 'Brow', 'Crest Run', 'Descent', 'Scree Run', 'Hillside Run', 'Climb Out', 'Drop Down', 'Valley'],
    cycle: ['up', 'down'],
    dayTypes: {
      up: { label: 'Uphill', short: 'Up', blocks: [S('Uphill drive', ['wall_drive', 'runLegs', 'bounding', 'runLegs', 'runDrill?'])] },
      down: { label: 'Downhill', short: 'Down', blocks: [S('Downhill control', ['reverse_lunge', 'single_leg_rdl_bw', 'lunge_to_balance', 'runLegs', 'runLegs?'])] },
    },
  },
  {
    id: 'reaction-ready', added: 14, catalogue: 8, name: 'Reaction Ready', subject: 'Court & field sports', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Reaction circuit / reaction EMOM', blurb: 'React and go: split steps, shuffles and short sprints in a circuit one day, on the minute the next.',
    about: 'Training for the moment the ball moves: split step, read, go. One day is a circuit of split-step hops, shuffles, shuttles and jumps; the other is an EMOM of the same, a burst at the top of every minute, so you practise starting fresh again and again. Abs finish every session. Both later levels add reps and time.',
    names: ['Ready Position', 'Split Step Day', 'First Read', 'Quick React', 'Jump Start', 'Off the Blocks', 'Gun Start', 'Reflex', 'Twitch', 'Startle', 'Alert', 'On Your Toes', 'Ball Watch', 'Anticipate', 'Read and React'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Reaction circuit', short: 'Circuit', blocks: [C('Reaction circuit', ['split_step', 'courtMove', 'courtPower', 'courtMove', 'courtLegs?'], { values: [3, 4, 5] })] },
      emom: { label: 'Reaction EMOM', short: 'EMOM', blocks: [E('Reaction EMOM', ['split_step', 'courtMove', 'courtPower', 'courtMove'], { values: [12, 14, 16] })] },
    },
  },
  // ---------------- PHASE 16 ticket 9: CARDIO & COMBAT +50% (catalogue 9) ----------------
  // Conditioning +5
  {
    id: 'engine-builder', added: 16, catalogue: 9, name: 'Engine Builder', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Long circuit / long EMOM', blurb: 'A bigger engine from long, steady work: a long circuit one day, a long EMOM the next.',
    about: 'Conditioning from long, steady efforts rather than all-out bursts. One day is a long circuit of a squat, a pull, a push, a swing and a cardio move; the other a long EMOM of the same kinds. You should be able to keep going the whole time. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Diesel', 'Long Haul', 'Cruise Control', 'Steady State', 'Tempo Run', 'Endurance', 'Engine Room', 'Boiler Room', 'Steam Engine', 'Locomotive', 'Freight Train', 'Iron Horse'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Long circuit', short: 'Circuit', blocks: [C('Long circuit', ['squat2', 'backRow', 'chestBw', 'kbBallistic', 'cardio'], { values: [3, 4] })] },
      emom: { label: 'Long EMOM', short: 'EMOM', blocks: [E('Long EMOM', ['hinge2', 'cardio', 'pushLoad2', 'hiit', 'row2'], { values: [12, 15, 18] })] },
    },
  },
  {
    id: 'death-by', added: 16, catalogue: 9, name: 'Death By', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'reps'],
    split: 'Ladder & Tabata / ladder & AMRAP', blurb: 'Climbing ladders that get harder every minute, then a Tabata or an AMRAP to finish.',
    about: 'Ladders that climb until they are hard: one rep, then two, then three, alternating two moves, until the time is up. A Tabata finishes one day and a short AMRAP the other. It feels easy at first and honest by the end. Abs finish every session. Both later levels add reps.',
    names: ['Death by Burpee', 'Death by Squat', 'Slow Climb', 'Creep Up', 'Build', 'Ramp', 'Escalate', 'Stack', 'Pile Up', 'Mount', 'Tower', 'Summit Push'],
    cycle: ['tabata', 'amrap'],
    dayTypes: {
      tabata: { label: 'Ladder & Tabata', short: 'Tabata', blocks: [L('Ladder', ['cardio', 'squat2']), T('Tabata', ['hiit', 'cardio'], { values: [1, 2] })] },
      amrap: { label: 'Ladder & AMRAP', short: 'AMRAP', blocks: [L('Ladder', ['hiit', 'pushLoad2']), A('AMRAP', ['kbBallistic', 'chestBw'], { values: [4, 5, 6] })] },
    },
  },
  {
    id: 'conditioning-30', added: 16, catalogue: 9, days: 30, name: 'Conditioning 30', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Circuit / EMOM / Tabata, 30 days', blurb: 'A month of conditioning: a circuit, an EMOM and Tabatas in turn.',
    about: 'A month to build your fitness. Three days rotate: a full-body circuit, an EMOM and a set of Tabatas. Every ten days the level steps up: more reps at Level II, heavier weights at Level III. Abs finish every session.',
    names: ['Cardio One', 'Cardio Week', 'Cardio Ten', 'Cardio Twenty', 'Cardio Thirty', 'Fit Month', 'Wind', 'Lungs', 'Heart', 'Breath', 'Pulse Month', 'Beat Month'],
    cycle: ['circuit', 'emom', 'tabata'],
    dayTypes: {
      circuit: { label: 'Circuit', short: 'Circuit', blocks: [C('Circuit', ['cardio', 'squat2', 'chestBw', 'kbBallistic', 'hiit'], { values: [3, 4] })] },
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('EMOM', ['hiit', 'hinge2', 'cardio', 'pushLoad2'], { values: [14, 16, 18] })] },
      tabata: { label: 'Tabatas', short: 'Tabata', blocks: [T('Tabatas', ['hiit', 'cardio', 'legsBw', 'hiit'], { values: [3, 4] })] },
    },
  },
  {
    id: 'bell-and-burpee', added: 16, catalogue: 9, name: 'Bell & Burpee', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Bell AMRAP / bodyweight AMRAP', blurb: 'Two AMRAPs: kettlebell work one day, bodyweight burpees and jumps the next.',
    about: 'As many rounds as you can, two ways. One day is a kettlebell AMRAP of swings, cleans and goblet squats; the other a bodyweight AMRAP of burpees, jumps and push-ups. Write down your rounds and try to beat them. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Burn', 'Burpee Burn', 'Swing Burn', 'Jump Burn', 'Bell Rush', 'Burpee Rush', 'Bell Blitz', 'Burpee Blitz', 'Bell Storm', 'Burpee Storm', 'Bell Fire', 'Burpee Fire'],
    cycle: ['bell', 'bw'],
    dayTypes: {
      bell: { label: 'Bell AMRAP', short: 'Bell', blocks: [A('Bell AMRAP', ['kb_swing', 'kb_clean', 'goblet_squat', 'kb_push_press'], { values: [12, 15] })] },
      bw: { label: 'Bodyweight AMRAP', short: 'Bodyweight', blocks: [A('Bodyweight AMRAP', ['burpee', 'plyoLow', 'chestBw', 'hiit'], { values: [12, 15] })] },
    },
  },
  {
    id: 'dumbbell-tabata', added: 16, catalogue: 9, name: 'Dumbbell Tabata', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'weight', 'reps'],
    split: 'Upper Tabatas / lower Tabatas', blurb: 'Tabatas with light dumbbells: upper-body moves one day, lower-body the next.',
    about: 'Tabatas with light dumbbells: twenty seconds of work, ten seconds of rest, eight times per Tabata. One day uses upper-body moves, thrusters, presses and rows; the other lower-body moves, squats, lunges and swings. The weight makes every interval count. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Weighted Twenty', 'Iron Interval', 'Loaded Tabata', 'Heavy Eight', 'Dumbbell Dash', 'Weighted Wind', 'Iron Eight', 'Load Rush', 'Bell Eight', 'Weighted Burst', 'Iron Burst', 'Heavy Burst'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper Tabatas', short: 'Upper', blocks: [T('Upper Tabatas', ['db_thruster', 'pushLoad2', 'row2', 'shoulderRaise'], { values: [2, 3, 4] })] },
      lower: { label: 'Lower Tabatas', short: 'Lower', blocks: [T('Lower Tabatas', ['squat2', 'lunge2', 'kb_swing', 'thrust'], { values: [2, 3, 4] })] },
    },
  },
  // HIIT +5 (no equipment unless named)
  {
    id: 'hiit-legs', added: 16, catalogue: 9, name: 'HIIT Legs', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Leg Tabatas / leg EMOM', blurb: 'HIIT for the legs: jump squats, lunges and skaters in Tabatas and EMOMs.',
    about: 'High-intensity intervals built around the legs. One day is Tabatas of jump squats, jump lunges, skaters and calf hops; the other an EMOM of the same kinds of moves. Strong, springy legs and a big heart. Abs finish every session. Level II adds reps and Level III brings harder moves.',
    names: ['Leg Fire', 'Quad Burn', 'Calf Burn', 'Jump Burn Legs', 'Skate', 'Glide', 'Leap', 'Bound Legs', 'Spring Legs', 'Pop Legs', 'Snap Legs', 'Fast Legs'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Leg Tabatas', short: 'Tabata', blocks: [T('Leg Tabatas', ['plyoLow', 'jump_lunge', 'skater_jumps', 'calfPlyo'], { values: [3, 4] })] },
      emom: { label: 'Leg EMOM', short: 'EMOM', blocks: [E('Leg EMOM', ['plyoLow', 'legsBw2', 'plyoLat', 'calfPlyo'], { values: [14, 16, 18] })] },
    },
  },
  {
    id: 'hiit-upper', added: 16, catalogue: 9, name: 'HIIT Upper', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Upper circuit / upper AMRAP', blurb: 'HIIT that works the upper body: push-ups, plank jacks and burpees in circuits and AMRAPs.',
    about: 'Intervals with the upper body doing the work. One day is a circuit of push-up variations, plank jacks, mountain climbers and burpees; the other an AMRAP of the same kinds. Your arms and shoulders work while your heart races. Abs finish every session. Level II adds reps and Level III brings harder moves.',
    names: ['Arm Fire', 'Push Burn', 'Shoulder Burn', 'Plank Rush', 'Climber Rush', 'Burpee Rush Upper', 'Upper Storm', 'Arm Storm', 'Push Storm', 'Upper Blaze', 'Arm Blaze', 'Push Blaze'],
    cycle: ['circuit', 'amrap'],
    dayTypes: {
      circuit: { label: 'Upper circuit', short: 'Circuit', blocks: [C('Upper circuit', ['chestBw', 'plank_jacks', 'mountain_climber', 'burpee', 'shoulderBw?'], { values: [3, 4, 5] })] },
      amrap: { label: 'Upper AMRAP', short: 'AMRAP', blocks: [A('Upper AMRAP', ['chestBw', 'plyoUp', 'hiit'], { values: [12, 15] })] },
    },
  },
  {
    id: 'hiit-ladder-tabata', added: 16, catalogue: 9, name: 'HIIT Mix', subject: 'HIIT', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'EMOM & Tabata / circuit & ladder', blurb: 'Two HIIT formats each day: an EMOM then a Tabata, or a circuit then a ladder.',
    about: 'Each day joins two formats so the effort changes halfway. One day is an EMOM followed by a Tabata; the other a circuit followed by a ladder. Your body never quite settles into a rhythm, which is the point. Abs finish every session. Both later levels add reps.',
    names: ['Two Step HIIT', 'Double Feature', 'Combo HIIT', 'Mix Tape HIIT', 'Shuffle HIIT', 'Switch HIIT', 'Change Up HIIT', 'Half and Half', 'Split HIIT', 'Duo HIIT', 'Pair HIIT', 'Twin HIIT'],
    cycle: ['et', 'cl'],
    dayTypes: {
      et: { label: 'EMOM & Tabata', short: 'EMOM', blocks: [E('EMOM', ['hiit', 'legsBw', 'hiitSec'], { values: [8, 10] }), T('Tabata', ['hiit', 'cardio'], { values: [1, 2] })] },
      cl: { label: 'Circuit & ladder', short: 'Circuit', blocks: [C('Circuit', ['hiit', 'push', 'cardio'], { values: [2, 3] }), L('Ladder', ['plyoLow', 'push'])] },
    },
  },
  {
    id: 'hiit-30-plus', added: 16, catalogue: 9, days: 30, name: 'HIIT 30 Plus', subject: 'HIIT', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Circuit / ladder, 30 days', blurb: 'A month of HIIT with no equipment: circuits one day, ladders the next.',
    about: 'A month of high-intensity training with nothing but the floor. Circuits and ladders alternate. Every ten days the level steps up with more reps. Hard but short, and over before it gets boring. Abs finish every session.',
    names: ['HIIT One', 'HIIT Week', 'HIIT Ten', 'HIIT Twenty', 'HIIT Thirty', 'HIIT Month', 'Spark Month', 'Fire Month', 'Burn Month', 'Blaze Month', 'Flame Month', 'Heat Month'],
    cycle: ['circuit', 'ladder'],
    dayTypes: {
      circuit: { label: 'Circuit', short: 'Circuit', blocks: [C('Circuit', ['hiit', 'legsBw', 'hiit', 'push', 'hiitSec?'], { values: [3, 4] })] },
      ladder: { label: 'Ladder', short: 'Ladder', blocks: [L('Ladder', ['hiit', 'push']), L('Ladder', ['plyoLow', 'core'])] },
    },
  },
  {
    id: 'bell-hiit', added: 16, catalogue: 9, name: 'Bell HIIT', subject: 'HIIT', minutes: [22, 27], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Bell circuit / bell AMRAP', blurb: 'HIIT with one kettlebell: swing circuits and AMRAPs that leave you breathless.',
    about: 'High-intensity training with one kettlebell. One day is a circuit of swings, snatches, goblet squats and bodyweight bursts; the other an AMRAP of swings, cleans and burpees. Fast, powerful hips and a heart that works hard. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Blast', 'Swing Blast', 'Snatch Blast', 'Bell Rush HIIT', 'Bell Fury', 'Swing Fury', 'Bell Frenzy', 'Bell Riot', 'Bell Rampage', 'Bell Stampede', 'Bell Thunder', 'Bell Lightning'],
    cycle: ['circuit', 'amrap'],
    dayTypes: {
      circuit: { label: 'Bell circuit', short: 'Circuit', blocks: [C('Bell circuit', ['kb_swing', 'hiit', 'kb_snatch', 'goblet_squat', 'hiit?'], { values: [3, 4, 5] })] },
      amrap: { label: 'Bell AMRAP', short: 'AMRAP', blocks: [A('Bell AMRAP', ['kb_swing', 'kb_clean', 'burpee'], { values: [12, 15] })] },
    },
  },
  // Plyometrics +4
  {
    id: 'plyo-power-straight', added: 16, catalogue: 9, name: 'Plyo Power', subject: 'Plyometrics', minutes: [25, 30], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'variation'],
    split: 'Vertical & upper / horizontal & lateral', blurb: 'Explosive power in straight sets: vertical jumps and push power, then broad jumps and bounds.',
    about: 'Explosive power trained the right way: few reps, full rests, maximum effort each rep. One day is vertical jumps and upper-body power; the other broad jumps, bounds and lateral jumps. Every rep should be as fast and high as you can make it. Abs finish every session. Level II adds reps and Level III brings harder jumps.',
    names: ['Launch', 'Lift Off Power', 'Rocket', 'Catapult', 'Trebuchet', 'Slingshot', 'Spring', 'Jack in the Box', 'Pogo Power', 'Kangaroo Power', 'Frog Power', 'Hare Power'],
    cycle: ['up', 'out'],
    dayTypes: {
      up: { label: 'Vertical & upper', short: 'Up', blocks: [S('Vertical & upper', ['plyoVert', 'plyoUp', 'plyoVert', 'plyoUp?'])] },
      out: { label: 'Horizontal & lateral', short: 'Out', blocks: [S('Horizontal & lateral', ['broad_jump', 'plyoLat', 'bounding', 'plyoLat?'])] },
    },
  },
  {
    id: 'plyo-calves', added: 16, catalogue: 9, name: 'Plyo Calves', subject: 'Plyometrics', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'reps'],
    split: 'Hop circuit / bound circuit', blurb: 'Springy feet and calves: pogo hops, single-leg hops and skips in circuits.',
    about: 'Plyometrics for the feet, ankles and calves. One day is a circuit of pogo hops, single-leg hops and calf raises; the other of skips, bounds and split steps. Elastic lower legs make you quicker and protect the Achilles. Abs finish every session. Both later levels add reps.',
    names: ['Pogo', 'Bounce', 'Boing', 'Spring Step', 'Hop Skip', 'Jump Rope', 'Skip Along', 'Hopscotch', 'Bunny', 'Cricket Hop', 'Flea', 'Grasshopper Hop'],
    cycle: ['hop', 'bound'],
    dayTypes: {
      hop: { label: 'Hop circuit', short: 'Hop', blocks: [C('Hop circuit', ['pogo_hops', 'single_leg_hops', 'calf_raise', 'plyoVert', 'calfPlyo?'], { values: [3, 4] })] },
      bound: { label: 'Bound circuit', short: 'Bound', blocks: [C('Bound circuit', ['power_skips', 'bounding', 'split_step', 'plyoLat', 'calfPlyo?'], { values: [3, 4] })] },
    },
  },
  {
    id: 'plyo-30', added: 16, catalogue: 9, days: 30, name: 'Plyo 30', subject: 'Plyometrics', minutes: [24, 29], equip: 'bw', rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'variation'],
    split: 'Jumps / hops & bounds, 30 days', blurb: 'A month of jumping: vertical and broad jumps, then hops and bounds.',
    about: 'A month of jump training. One day is vertical and broad jumps in straight sets with full rests; the next is hops and bounds. Every ten days the level steps up: more reps at Level II, harder jumps at Level III. Abs finish every session. Land softly every time.',
    names: ['Jump One', 'Jump Week', 'Jump Ten', 'Jump Twenty', 'Jump Thirty', 'Jump Month', 'Air Month', 'Sky Month', 'Spring Month', 'Bounce Month', 'Hop Month', 'Leap Month'],
    cycle: ['jumps', 'hops'],
    dayTypes: {
      jumps: { label: 'Jumps', short: 'Jumps', blocks: [S('Jumps', ['plyoVert', 'broad_jump', 'plyoLow', 'plyoUp?'])] },
      hops: { label: 'Hops & bounds', short: 'Hops', blocks: [S('Hops & bounds', ['plyoLat', 'single_leg_hops', 'bounding', 'pogo_hops?'])] },
    },
  },
  {
    id: 'plyo-strength-emom', added: 16, catalogue: 9, name: 'Jump & Lift', subject: 'Plyometrics', minutes: [26, 31], rests: { set: 60, exercise: 90 }, levers: [null, 'reps', 'weight'],
    split: 'Jump & squat EMOM / jump & hinge EMOM', blurb: 'Jumps paired with a heavy lift on the minute: power and strength together.',
    about: 'Power and strength together. Each EMOM pairs a jump with a heavy lift: jump squats with goblet squats one day, broad jumps with deadlifts the other. Lifting heavy then jumping fast trains the legs to produce force quickly. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Jump Lift', 'Power Pair', 'Lift Jump', 'Force', 'Drive', 'Thrust', 'Punch Up', 'Burst Lift', 'Pop Lift', 'Snap Lift', 'Bang', 'Boom'],
    cycle: ['squat', 'hinge'],
    dayTypes: {
      squat: { label: 'Jump & squat EMOM', short: 'Squat', blocks: [E('Jump & squat EMOM', ['plyoVert', 'squat2', 'plyoUp', 'pushLoad2'], { values: [12, 14, 16] })] },
      hinge: { label: 'Jump & hinge EMOM', short: 'Hinge', blocks: [E('Jump & hinge EMOM', ['broad_jump', 'hinge2', 'plyoLat', 'row2'], { values: [12, 14, 16] })] },
    },
  },
  // Boxing +4
  {
    id: 'boxing-circuit', added: 16, catalogue: 9, name: 'Boxing Circuit', subject: 'Boxing', minutes: [27, 32], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts & circuit A / B', blurb: 'Shadowboxing bouts, then a boxer\'s circuit of push-ups, squats and core.',
    about: 'Shadowboxing bouts first, then a boxer\'s circuit. The bouts drill combinations, defence and footwork; the circuit builds the strength behind them with push-ups, squats, burpees and core. Two versions alternate. Abs finish every session. Both later levels bring longer combinations and harder circuit moves.',
    names: ['Gym Rat', 'Bag Work', 'Mitt Work', 'Road Runner', 'Skip Rope', 'Speed Bag', 'Heavy Bag', 'Double End', 'Medicine Ball', 'Sit-up Board', 'Ring Work', 'Shadow Work'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts & circuit A', short: 'A', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense?']), C('Boxer circuit', ['chestBw', 'legsBw', 'burpee', 'coreRot'], { values: [1, 2, 3] })] },
      b: { label: 'Bouts & circuit B', short: 'B', blocks: [B('Bouts', ['bxMove', 'bxPower', 'bxBasic?']), C('Boxer circuit', ['push', 'plyoLat', 'cardio', 'coreAnti'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'boxing-power', added: 16, catalogue: 9, name: 'Knockout Power', subject: 'Boxing', minutes: [28, 33], levers: [null, 'variation', 'variation'],
    split: 'Power bouts & straight sets A / B', blurb: 'Hit harder: power bouts, then rotational strength and plyo push-ups in straight sets.',
    about: 'For punches that land with weight behind them. Power bouts drill hooks, uppercuts and crosses; then straight sets build the rotation and push behind them: Russian twists, kettlebell swings, clap push-ups and presses. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Knockout', 'Haymaker Power', 'One Punch', 'Lights Out', 'Sleeper', 'Glass Jaw', 'Iron Fist Power', 'Sledgehammer', 'Thunder Fist', 'Dynamite', 'TNT', 'Kaboom'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Power A', short: 'A', blocks: [B('Power bouts', ['bxPower', 'bxPower', 'bxBasic?']), S('Rotation & push', ['russian_twist', 'clap_pushup', 'kb_swing'])] },
      b: { label: 'Power B', short: 'B', blocks: [B('Power bouts', ['bxPower', 'bxDefense', 'bxPower?']), S('Rotation & push', ['windshield_wipers', 'explosive_pushup', 'kb_press'])] },
    },
  },
  {
    id: 'boxing-tabata-plus', added: 16, catalogue: 9, name: 'Boxing Tabatas', subject: 'Boxing', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Punch Tabatas / footwork Tabatas', blurb: 'Boxing in Tabatas: fast punches one day, footwork and defence the next.',
    about: 'Boxing at Tabata pace: twenty seconds as fast as you can, ten seconds rest. One day is punch Tabatas, straight shots, hooks and uppercuts; the other footwork and defence, shuffles, slips and rolls. Short, hard and great for hand speed. Abs finish every session. Both later levels bring longer combinations.',
    names: ['Flurry', 'Barrage', 'Combination Rush', 'Hand Speed', 'Fast Hands', 'Quick Fists', 'Blur', 'Machine Gun Hands', 'Rat-a-tat', 'Drum Roll', 'Rapid Fire Hands', 'Speed Demon'],
    cycle: ['punch', 'feet'],
    dayTypes: {
      punch: { label: 'Punch Tabatas', short: 'Punch', blocks: [T('Punch Tabatas', ['bxBasic', 'bxPower', 'bxBasic', 'bxPower'], { values: [2, 3, 4] })] },
      feet: { label: 'Footwork Tabatas', short: 'Feet', blocks: [T('Footwork Tabatas', ['bxMove', 'bxDefense', 'bxMove', 'bxDefense'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'boxing-30-plus', added: 16, catalogue: 9, days: 30, name: 'Boxing 30 Plus', subject: 'Boxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts & EMOM / bouts & straight sets, 30 days', blurb: 'A month of boxing: bouts every day, then an EMOM or straight sets for strength.',
    about: 'A month of boxing training. Every day starts with shadowboxing bouts, then either an EMOM of conditioning or straight sets of push-ups, squats and core. Every ten days the level steps up, with longer combinations and harder moves. Abs finish every session.',
    names: ['Fight Month', 'Camp One', 'Camp Ten', 'Camp Twenty', 'Camp Thirty', 'Fight Week', 'Weigh-in Week', 'Fight Night', 'Ring Walk', 'Opening Round', 'Middle Rounds', 'Final Bell'],
    cycle: ['emom', 'straight'],
    dayTypes: {
      emom: { label: 'Bouts & EMOM', short: 'EMOM', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense?']), E('EMOM', ['burpee', 'chestBw', 'coreRot'], { values: [6, 8] })] },
      straight: { label: 'Bouts & strength', short: 'Strength', blocks: [B('Bouts', ['bxPower', 'bxBasic', 'bxDefense?']), S('Strength', ['chestBw', 'legsBw2', 'coreAnti?'])] },
    },
  },
  // Kickboxing +4
  {
    id: 'kick-circuit', added: 16, catalogue: 9, name: 'Kick Circuit', subject: 'Kickboxing', minutes: [27, 32], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Bouts & kick circuit A / B', blurb: 'Kickboxing bouts, then a circuit of kicks, knees and leg strength.',
    about: 'Kickboxing bouts, then a circuit for the legs and hips behind every kick: knees, squats, lunges and core. Two versions alternate. Strong, mobile hips make kicks higher and harder. Abs finish every session. Level II brings longer combinations and Level III adds reps.',
    names: ['Kick Gym', 'Pad Work', 'Thai Pads', 'Shin Kick', 'Kick Bag', 'Kick Drill', 'Knee Drill', 'Leg Work', 'Hip Work', 'Kick Rounds', 'Kick Session', 'Kick Class'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts & circuit A', short: 'A', blocks: [B('Bouts', ['kkKick', 'kkCombo', 'kkKnee?']), C('Kick circuit', ['legsBw2', 'kkKnee', 'coreRot'], { values: [1, 2, 3] })] },
      b: { label: 'Bouts & circuit B', short: 'B', blocks: [B('Bouts', ['kkCombo', 'kkKick', 'kkKnee?']), C('Kick circuit', ['adductorBw', 'kkKnee', 'coreAnti'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'kick-tabata-plus', added: 16, catalogue: 9, name: 'Kick Tabatas', subject: 'Kickboxing', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Kick Tabatas / knee & punch Tabatas', blurb: 'Kickboxing in Tabatas: kicks one day, knees and punches the next.',
    about: 'Kickboxing at Tabata pace. One day is kick Tabatas, teeps, roundhouses and switch kicks; the other knees and punches. Twenty seconds as fast as clean technique allows, ten seconds rest. Great for speed and stamina. Abs finish every session. Both later levels bring longer combinations.',
    names: ['Kick Flurry', 'Knee Flurry', 'Kick Rush', 'Knee Rush', 'Kick Blitz', 'Knee Blitz', 'Kick Storm', 'Knee Storm', 'Kick Fire', 'Knee Fire', 'Kick Fury', 'Knee Fury'],
    cycle: ['kick', 'knee'],
    dayTypes: {
      kick: { label: 'Kick Tabatas', short: 'Kick', blocks: [T('Kick Tabatas', ['kkKick', 'kkKick', 'kkCombo', 'kkKick'], { values: [3, 4] })] },
      knee: { label: 'Knee & punch Tabatas', short: 'Knee', blocks: [T('Knee & punch Tabatas', ['kkKnee', 'bxBasic', 'kkKnee', 'bxPower'], { values: [3, 4] })] },
    },
  },
  {
    id: 'kick-30', added: 16, catalogue: 9, days: 30, name: 'Kickboxing 30', subject: 'Kickboxing', minutes: [24, 29], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Kick bouts / combo bouts, 30 days', blurb: 'A month of kickboxing: kick bouts one day, combination bouts the next.',
    about: 'A month of kickboxing bouts. One day drills kicks and knees, the next full combinations of punches and kicks. Every ten days the level steps up: longer combinations at Level II, more reps at Level III. Abs finish every session.',
    names: ['Kick One', 'Kick Week', 'Kick Ten', 'Kick Twenty', 'Kick Thirty', 'Kick Month', 'Thai Month', 'Knee Month', 'Shin Month', 'Combo Month', 'Clinch Month', 'Ring Month'],
    cycle: ['kick', 'combo'],
    dayTypes: {
      kick: { label: 'Kick bouts', short: 'Kick', blocks: [B('Kick bouts', ['kkKick', 'kkKnee', 'kkKick', 'kkSpin', 'kkKick?'])] },
      combo: { label: 'Combo bouts', short: 'Combo', blocks: [B('Combo bouts', ['kkCombo', 'bxBasic', 'kkCombo', 'kkKnee', 'kkCombo?'])] },
    },
  },
  {
    id: 'kick-flex', added: 16, catalogue: 9, name: 'High Kicks', subject: 'Kickboxing', minutes: [26, 31], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Kick bouts & hip strength / kick bouts & balance', blurb: 'Higher kicks: bouts, then hip strength and balance work that lifts the leg higher.',
    about: 'For higher, cleaner kicks. Kick bouts come first, then straight sets that build the hip strength and balance a high kick needs: standing knee holds, Cossack squats, single-leg work and side-lying adductions. Abs finish every session. Level II brings longer combinations and Level III adds reps.',
    names: ['High Kick', 'Head Kick', 'Axe Kick', 'Crescent', 'Hook Kick', 'Spinning Hook', 'Question Mark', 'Tornado', 'Butterfly Kick', 'Jump Kick', 'Flying Knee', 'Superman Punch'],
    cycle: ['hips', 'balance'],
    dayTypes: {
      hips: { label: 'Bouts & hip strength', short: 'Hips', blocks: [B('Kick bouts', ['kkKick', 'kkCombo', 'kkKick?']), S('Hip strength', ['standing_knee_hold', 'cossack_squat', 'side_lying_adduction'])] },
      balance: { label: 'Bouts & balance', short: 'Balance', blocks: [B('Kick bouts', ['kkKick', 'kkSpin?']), S('Balance', ['blStrength', 'single_leg_rdl_bw', 'blDynamic?'])] },
    },
  },
  // Running prep +3
  {
    id: 'runner-strength-30', added: 16, catalogue: 9, days: 30, name: 'Runner Strength 30', subject: 'Running prep', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Drills & legs / calves & core, 30 days', blurb: 'A month of strength for runners: drills and legs, then calves, shins and core.',
    about: 'A month to make running feel easier. One day is running drills and single-leg strength; the next calves, shins and core, the parts that hold up a running stride. Every ten days the level steps up: more reps at Level II, slower reps at Level III. Abs finish every session.',
    names: ['Run One', 'Run Week', 'Run Ten', 'Run Twenty', 'Run Thirty', 'Run Month', 'Stride Month', 'Pace Month', 'Mile Month', 'Lap Month', 'Track Month', 'Trail Month'],
    cycle: ['legs', 'calves'],
    dayTypes: {
      legs: { label: 'Drills & legs', short: 'Legs', blocks: [S('Drills & legs', ['runDrill', 'runLegs', 'singleLeg', 'runLegs?'])] },
      calves: { label: 'Calves & core', short: 'Calves', blocks: [S('Calves & core', ['calfBw', 'shin', 'coreAnti', 'calfBw?'])] },
    },
  },
  {
    id: 'trail-legs', added: 16, catalogue: 9, name: 'Trail Legs', subject: 'Running prep', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Ankles & balance / hills & core', blurb: 'For trail runners: strong ankles and balance, then hill strength and core.',
    about: 'For running on uneven ground. One day is a circuit of ankle strength and balance: single-leg holds, hops, heel walks and calf raises. The other is hill strength: lunges, squats, wall sits and core. Steadier feet on rocks and roots. Abs finish every session. Both later levels add reps.',
    names: ['Trail Head', 'Switchback', 'Ridge Run', 'Fell Run', 'Scree', 'Root', 'Rock', 'Mud', 'Creek', 'Ford', 'Summit Run', 'Descent'],
    cycle: ['ankles', 'hills'],
    dayTypes: {
      ankles: { label: 'Ankles & balance', short: 'Ankles', blocks: [C('Ankles & balance', ['blStatic', 'single_leg_hops', 'shin', 'calfBw', 'blDynamic?'], { values: [3, 4] })] },
      hills: { label: 'Hills & core', short: 'Hills', blocks: [C('Hills & core', ['runLegs', 'legsBw2', 'wall_sit', 'coreAnti', 'runLegs?'], { values: [3, 4] })] },
    },
  },
  {
    id: 'run-faster', added: 16, catalogue: 9, name: 'Run Faster', subject: 'Running prep', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Speed EMOM / power AMRAP', blurb: 'Speed for runners: sprint-drill EMOMs and power AMRAPs.',
    about: 'Training for a faster stride. One day is an EMOM of sprint drills, A-skips, wall drives and fast feet; the other an AMRAP of bounds, pogo hops and skips. Fast, springy legs, and a stronger kick at the end of a run. Abs finish every session. Both later levels add reps.',
    names: ['Kick', 'Sprint Finish', 'Final Straight', 'Burn Up', 'Fast Twitch', 'Turnover', 'Cadence', 'Stride Rate', 'Quick Feet', 'Fleet Foot', 'Swift Foot', 'Light Foot'],
    cycle: ['emom', 'amrap'],
    dayTypes: {
      emom: { label: 'Speed EMOM', short: 'EMOM', blocks: [E('Speed EMOM', ['runDrill', 'runFast', 'runDrill', 'calfPlyo'], { values: [12, 14, 16] })] },
      amrap: { label: 'Power AMRAP', short: 'AMRAP', blocks: [A('Power AMRAP', ['runPlyo', 'pogo_hops', 'power_skips'], { values: [10, 12, 15] })] },
    },
  },
  // Court & field sports +3
  {
    id: 'court-30', added: 16, catalogue: 9, days: 30, name: 'Court 30', subject: 'Court & field sports', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Agility circuit / power EMOM, 30 days', blurb: 'A month of game fitness: agility circuits and power EMOMs.',
    about: 'A month to get game fit. One day is an agility circuit of shuffles, carioca and shuttles; the next a power EMOM of split steps, bounds and jumps. Every ten days the level steps up: more reps at Level II, harder moves at Level III. Abs finish every session.',
    names: ['Game One', 'Game Week', 'Game Ten', 'Game Twenty', 'Game Thirty', 'Game Month', 'Season Start', 'Mid Season', 'Playoffs', 'Semis', 'Final', 'Trophy'],
    cycle: ['agility', 'power'],
    dayTypes: {
      agility: { label: 'Agility circuit', short: 'Agility', blocks: [C('Agility circuit', ['courtMove', 'courtLegs', 'courtMove', 'coreRot', 'courtMove?'], { values: [3, 4] })] },
      power: { label: 'Power EMOM', short: 'Power', blocks: [E('Power EMOM', ['courtPower', 'courtMove', 'courtPower', 'plyoLat'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'racket-ready', added: 16, catalogue: 9, name: 'Racket Ready', subject: 'Court & field sports', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'Footwork & shoulders / rotation & legs', blurb: 'For tennis, padel and squash: footwork and shoulder health, then rotation and legs.',
    about: 'For racket sports. One day is footwork drills with shoulder health work, external rotations and Y raises, to keep the hitting shoulder strong. The other is rotational power and legs: twists, lunges and lateral moves. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Ace', 'Deuce', 'Advantage', 'Love', 'Rally', 'Volley', 'Smash', 'Lob', 'Drop Shot', 'Backhand', 'Forehand', 'Match Point'],
    cycle: ['feet', 'rotation'],
    dayTypes: {
      feet: { label: 'Footwork & shoulders', short: 'Feet', blocks: [C('Footwork', ['courtMove', 'split_step', 'courtMove'], { values: [2, 3] }), S('Shoulder health', ['external_rotation', 'prone_y_raise', 'shoulderHealth'])] },
      rotation: { label: 'Rotation & legs', short: 'Rotation', blocks: [S('Rotation & legs', ['coreRot', 'lateral_lunge', 'courtLegs', 'coreRot?']), C('Lateral power', ['lateral_bounds', 'courtMove'], { values: [2, 3] })] },
    },
  },
  {
    id: 'field-speed', added: 16, catalogue: 9, name: 'Field Speed', subject: 'Court & field sports', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Sprint Tabatas / change-of-direction AMRAP', blurb: 'For football and rugby: sprint Tabatas, then change-of-direction AMRAPs.',
    about: 'For field sports. One day is sprint Tabatas: sprints in place, fast feet and high knees, twenty seconds at a time. The other is an AMRAP of shuttles, backpedals and lateral bounds. Repeated sprints and sharp turns are what a match asks of you. Abs finish every session. Both later levels add reps.',
    names: ['Kick-off Speed', 'Breakaway', 'Wing', 'Fullback', 'Striker', 'Winger', 'Sweeper', 'Libero', 'Scrum', 'Lineout', 'Try Line', 'Goal Line'],
    cycle: ['tabata', 'amrap'],
    dayTypes: {
      tabata: { label: 'Sprint Tabatas', short: 'Tabata', blocks: [T('Sprint Tabatas', ['runFast', 'hiitSec', 'runFast', 'high_knees'], { values: [3, 4] })] },
      amrap: { label: 'Change-of-direction AMRAP', short: 'AMRAP', blocks: [A('Change-of-direction AMRAP', ['shuttle_touch', 'backpedal', 'lateral_bounds'], { values: [10, 12, 15] })] },
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

// Phase 23 ticket 7: Conditioning +7, HIIT +7, Plyometrics +6, Running prep +5, Court & field sports +5, by ticket 3's
// rules: half 35–38 min, a quarter 31–35, a quarter shorter; a fifth at 30 days; gear in each subject's old shares.
const P23_LONG = [34.5, 38.4], P23_MID = [31, 35];
const P23_T7 = [
  // Conditioning +7
  {
    id: 'long-engine', name: 'Long Engine', subject: 'Conditioning', minutes: P23_LONG, levers: [null, 'reps', 'weight'],
    split: 'Long circuit & AMRAP / long EMOM & Tabata', blurb: 'Long conditioning days: a circuit then an AMRAP, or an EMOM then Tabatas.',
    about: 'Conditioning with time to build. One day is a long full-body circuit of lifts and cardio, then an AMRAP to finish; the other is an EMOM of the same kinds of moves, a set at the top of every minute, then two Tabatas. They alternate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Piston', 'Cylinder', 'Crankshaft', 'Camshaft', 'Valve', 'Spark Plug', 'Carburettor', 'Turbo', 'Intercooler', 'Manifold', 'Gearbox', 'Clutch', 'Driveshaft', 'Differential', 'Radiator', 'Throttle', 'Ignition', 'Exhaust', 'Torque', 'Redline'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Circuit & AMRAP', short: 'Circuit', blocks: [C('Long circuit', ['total', 'squat2', 'cardio', 'backRow', 'pushLoad2', 'hiit'], { values: [2, 3, 4] }), A('AMRAP', ['kbBallistic', 'chestBw', 'cardio'], { values: [6, 8, 10] })] },
      emom: { label: 'EMOM & Tabata', short: 'EMOM', blocks: [E('Long EMOM', ['hinge2', 'cardio', 'pushLoad2', 'hiit', 'row2'], { values: [15, 18, 20] }), T('Tabata 1', ['hiit', 'legsBw2'], { values: [1] }), T('Tabata 2', ['cardio', 'core2'], { values: [1] })] },
    },
  },
  {
    id: 'conditioning-month', name: 'Conditioning Month', subject: 'Conditioning', days: 30, minutes: P23_LONG, levers: [null, 'reps', 'variation'],
    split: 'Ladder & AMRAP / circuit & Tabata / EMOM, 30 days', blurb: 'A month of conditioning: a ladder and AMRAP, a circuit and Tabatas, then a long EMOM.',
    about: 'A month that hits every kind of conditioning. One day climbs a ladder then empties the tank in an AMRAP, the next goes round a full-body circuit then two Tabatas, the third is one long EMOM. Three days rotate. Every ten days the level steps up. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Ironman', 'Decathlon', 'Heptathlon', 'Pentathlon', 'Biathlon', 'Triathlon', 'Duathlon', 'Aquathlon', 'Ultra', 'Marathon', 'Relay', 'Steeplechase', 'Hurdles', 'Sprint Medley', 'Cross Country', 'Fell Run', 'Iron Mile', 'Grand Tour', 'Gauntlet', 'Endurance'],
    cycle: ['ladder', 'circuit', 'emom'],
    dayTypes: {
      ladder: { label: 'Ladder & AMRAP', short: 'Ladder', blocks: [L('Ladder 1', ['total', 'push']), L('Ladder 2', ['cardio', 'squat2']), A('AMRAP', ['hiit', 'row2', 'core2'], { values: [6, 8, 10] })] },
      circuit: { label: 'Circuit & Tabata', short: 'Circuit', blocks: [C('Circuit', ['kbBallistic', 'lunge2', 'chestBw', 'backRow', 'cardio'], { values: [2, 3, 4] }), T('Tabata 1', ['hiit', 'legsBw2'], { values: [1] }), T('Tabata 2', ['cardio', 'coreRot'], { values: [1] })] },
      emom: { label: 'Long EMOM', short: 'EMOM', blocks: [E('Long EMOM', ['total', 'cardio', 'squat2', 'hiit', 'pushLoad2', 'cardio'], { values: [24, 27, 30] })] },
    },
  },
  {
    id: 'dumbbell-conditioning', name: 'Dumbbell Conditioning', subject: 'Conditioning', minutes: P23_LONG, levers: [null, 'weight', 'reps'],
    split: 'Dumbbell AMRAPs / dumbbell ladders', blurb: 'Long dumbbell conditioning: two AMRAPs one day, two ladders the next.',
    about: 'Conditioning with the dumbbells in your hands the whole time. One day is two AMRAPs of thrusters, snatches, rows and lunges, as many rounds as you can; the other is two ladders of the same lifts, one rep each, then two, then three. They alternate. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Iron Lung', 'Steel Heart', 'Bronze Back', 'Copper Legs', 'Brass Neck', 'Tin Man', 'Zinc', 'Nickel', 'Cobalt', 'Chrome', 'Titanium', 'Tungsten', 'Pewter', 'Gunmetal', 'Cast Iron', 'Pig Iron', 'Wrought Iron', 'Alloy', 'Damascus', 'Carbon'],
    cycle: ['amrap', 'ladder'],
    dayTypes: {
      amrap: { label: 'Dumbbell AMRAPs', short: 'AMRAP', blocks: [A('AMRAP 1', ['total', 'row2', 'lunge2'], { values: [10, 12, 14] }), A('AMRAP 2', ['db_thruster', 'pushLoad2', 'hinge2', 'cardio'], { values: [10, 12, 14] })] },
      ladder: { label: 'Dumbbell ladders', short: 'Ladder', blocks: [L('Ladder 1', ['total', 'row2']), L('Ladder 2', ['squat2', 'pushLoad2']), L('Ladder 3', ['hinge2', 'cardio'])] },
    },
  },
  {
    id: 'swing-and-sprint', name: 'Swing and Sprint', subject: 'Conditioning', minutes: P23_LONG, levers: [null, 'reps', 'weight'],
    split: 'Swing EMOM & sprint Tabatas / bell circuit & AMRAP', blurb: 'Swings and sprints: a swing EMOM and Tabatas, or a bell circuit and an AMRAP.',
    about: 'Kettlebell power with cardio in between. One day is an EMOM of swings, snatches and cleans, then Tabatas of sprints on the spot and fast moves; the other is a kettlebell circuit, then an AMRAP of bell and bodyweight moves. They alternate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Pendulum', 'Swingball', 'Trapeze', 'Rope Swing', 'Tyre Swing', 'Porch Swing', 'Hammock Swing', 'Swingboat', 'Wrecking Ball', 'Plumb Line', 'Metronome Arm', 'Bell Rope', 'Censer', 'Thurible', 'Lasso', 'Bolas', 'Sling', 'Slingshot', 'Catapult', 'Trebuchet'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Swing EMOM & Tabatas', short: 'EMOM', blocks: [E('Swing EMOM', ['kbBallistic', 'kb_swing', 'kbBallistic', 'cardio'], { values: [14, 16, 18] }), T('Sprint Tabatas', ['hiitSec', 'hiit', 'hiitSec'], { values: [1] })] },
      circuit: { label: 'Bell circuit & AMRAP', short: 'Circuit', blocks: [C('Bell circuit', ['kbBallistic', 'goblet_squat', 'kb_row', 'kb_press', 'hiit'], { values: [2, 3, 4] }), A('AMRAP', ['kb_swing', 'burpee', 'cardio'], { values: [6, 8, 10] })] },
    },
  },
  {
    id: 'conditioning-35', name: 'Conditioning 35', subject: 'Conditioning', minutes: P23_MID, levers: [null, 'reps', 'reps'],
    split: 'EMOM & AMRAP / circuit & ladder', blurb: 'Thirty-five minutes of conditioning: an EMOM and an AMRAP, or a circuit and a ladder.',
    about: 'Conditioning that fits about half an hour. One day is an EMOM of lifts and cardio, then an AMRAP; the other a full-body circuit, then a ladder of two moves. They alternate. Abs finish every session. Both later levels add reps.',
    names: ['Thirty-Five', 'Mile Marker', 'Kilometre', 'Furlong', 'League', 'Fathom', 'Cubit', 'Span', 'Hand', 'Rod', 'Chain', 'Perch Length', 'Pole', 'Link', 'Yard', 'Foot', 'Inch', 'Nautical Mile', 'Knot', 'Rood'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'EMOM & AMRAP', short: 'EMOM', blocks: [E('EMOM', ['total', 'cardio', 'squat2', 'hiit'], { values: [12, 14, 16] }), A('AMRAP', ['row2', 'chestBw', 'cardio'], { values: [6, 8, 10] })] },
      circuit: { label: 'Circuit & ladder', short: 'Circuit', blocks: [C('Circuit', ['kbBallistic', 'lunge2', 'pushLoad2', 'backRow', 'hiit'], { values: [2, 3, 4] }), L('Ladder', ['cardio', 'push'])] },
    },
  },
  {
    id: 'tabata-hour-glass', name: 'Tabata Hourglass', subject: 'Conditioning', minutes: P23_MID, levers: [null, 'reps', 'variation'],
    split: 'Tabatas, then a ladder / Tabatas, then an AMRAP', blurb: 'Rounds of Tabatas, then a ladder one day and an AMRAP the next.',
    about: 'Tabatas first, twenty seconds hard and ten seconds rest, eight times over, three of them in a row. Then one day climbs a ladder of a lift and a cardio move, and the other runs an AMRAP. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Sand Glass', 'Egg Timer', 'Grain of Sand', 'Trickle', 'Drip', 'Dribble', 'Seep', 'Leak', 'Spill', 'Pour', 'Cascade', 'Rapids', 'Torrent', 'Flood', 'Deluge', 'Downpour', 'Cloudburst', 'Monsoon', 'Squall', 'Gale'],
    cycle: ['ladder', 'amrap'],
    dayTypes: {
      ladder: { label: 'Tabatas & ladder', short: 'Ladder', blocks: [T('Tabatas', ['hiit', 'squat2', 'cardio', 'push', 'hiit', 'core2'], { values: [1, 2] }), L('Ladder', ['total', 'cardio'])] },
      amrap: { label: 'Tabatas & AMRAP', short: 'AMRAP', blocks: [T('Tabatas', ['cardio', 'lunge2', 'hiit', 'row2', 'cardio', 'coreRot'], { values: [1, 2] }), A('AMRAP', ['kbBallistic', 'chestBw', 'hiit'], { values: [6, 8, 10] })] },
    },
  },
  {
    id: 'quick-engine', name: 'Quick Engine', subject: 'Conditioning', minutes: [23, 27], levers: [null, 'reps', 'weight'],
    split: 'Dumbbell EMOM / bell & body AMRAP, short', blurb: 'Short conditioning: a dumbbell EMOM one day, a bell-and-bodyweight AMRAP the next.',
    about: 'A short, hard session. One day is an EMOM of dumbbell lifts and cardio, a set at the top of every minute; the other is an AMRAP of kettlebell and bodyweight moves, as many rounds as you can. They alternate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Spark', 'Kindling', 'Tinder', 'Match', 'Fuse Wire', 'Fire Starter', 'Flint Strike', 'Firebrand', 'Blaze', 'Bonfire', 'Wildfire', 'Inferno', 'Firestorm', 'Flame', 'Flashpoint', 'Hotshot', 'Firecrest', 'Firebird', 'Phoenix', 'Salamander'],
    cycle: ['emom', 'amrap'],
    dayTypes: {
      emom: { label: 'Dumbbell EMOM', short: 'EMOM', blocks: [E('Dumbbell EMOM', ['total', 'row2', 'cardio', 'squat2'], { values: [14, 16, 18] })] },
      amrap: { label: 'Bell & body AMRAP', short: 'AMRAP', blocks: [A('Bell & body AMRAP', ['kbBallistic', 'chestBw', 'hiit', 'lunge2'], { values: [14, 16, 18] })] },
    },
  },
  // HIIT +7
  {
    id: 'hiit-long-burn', name: 'HIIT Long Burn', subject: 'HIIT', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Circuit & Tabatas / EMOM & AMRAP, long', blurb: 'Long no-gear HIIT: a circuit and Tabatas one day, an EMOM and an AMRAP the next.',
    about: 'A long HIIT session with no equipment. One day is a circuit of jumps, pushes and legs, then Tabatas, twenty seconds hard and ten seconds rest; the other is an EMOM then an AMRAP of the same kind of moves. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Solar Flare', 'Sunspot', 'Corona', 'Prominence', 'Photosphere', 'Chromosphere', 'Solar Wind', 'Aurora', 'Nova', 'Supernova', 'Pulsar', 'Quasar', 'Red Giant', 'White Dwarf', 'Blue Giant', 'Magnetar', 'Neutron Star', 'Comet Tail', 'Meteor Shower', 'Fireball'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Circuit & Tabatas', short: 'Circuit', blocks: [C('HIIT circuit', ['hiit', 'pushBw2', 'legsBw2', 'hiit', 'coreRot'], { values: [3, 4, 5] }), T('Tabata 1', ['hiit', 'hiitSec'], { values: [1] }), T('Tabata 2', ['plyoLow', 'core2'], { values: [1] })] },
      emom: { label: 'EMOM & AMRAP', short: 'EMOM', blocks: [E('HIIT EMOM', ['hiit', 'legsBw2', 'hiitSec', 'pushBw2'], { values: [14, 16, 18] }), A('AMRAP', ['hiit', 'chestBw', 'plyoLow', 'coreAnti'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'hiit-month', name: 'HIIT Month', subject: 'HIIT', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Tabatas & AMRAP / ladders / EMOM & circuit, 30 days', blurb: 'A month of HIIT with no gear: Tabatas and an AMRAP, ladders, then an EMOM and a circuit.',
    about: 'A month of high-intensity work in three shapes. One day is Tabatas back to back and a short AMRAP, the next two ladders that build a rep at a time, the third an EMOM then a circuit. Three days rotate. Every ten days the level steps up. Abs finish every session. Both later levels add reps.',
    names: ['Lightning', 'Thunderclap', 'Fork Lightning', 'Sheet Lightning', 'Ball Lightning', 'Heat Lightning', 'Thunderhead', 'Anvil Cloud', 'Supercell', 'Downburst', 'Microburst', 'Hailstone', 'Sleet', 'Updraft', 'Wind Shear', 'Twister', 'Waterspout', 'Dust Devil', 'Whirlwind', 'Cyclone'],
    cycle: ['tabata', 'ladder', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabatas & AMRAP', short: 'Tabata', blocks: [T('Tabatas', ['hiit', 'legsBw2', 'hiitSec', 'pushBw2', 'plyoLow', 'core2', 'hiit', 'coreRot'], { values: [2] }), A('AMRAP', ['hiit', 'pushBw2', 'legsBw2'], { values: [8, 10, 12] })] },
      ladder: { label: 'Ladders', short: 'Ladder', blocks: [L('Ladder 1', ['hiit', 'pushBw2']), L('Ladder 2', ['plyoLow', 'legsBw2']), L('Ladder 3', ['hiit', 'coreHollow'])] },
      emom: { label: 'EMOM & circuit', short: 'EMOM', blocks: [E('HIIT EMOM', ['hiit', 'hiitSec', 'legsBw2', 'pushBw2'], { values: [12, 14, 16] }), C('Circuit', ['plyoLow', 'chestBw', 'hiit', 'coreAnti'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'hiit-pyramid-long', name: 'HIIT Pyramid Long', subject: 'HIIT', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Three ladders / two ladders & Tabatas', blurb: 'HIIT pyramids: three ladders one day, two ladders and Tabatas the next.',
    about: 'Pyramids of reps, no equipment. One day climbs three ladders of a jump and a strength move, one rep each, then two, then three; the other climbs two ladders and then runs four Tabatas. They alternate. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Giza', 'Saqqara', 'Dahshur', 'Meidum', 'Teotihuacan', 'Chichen Itza', 'Tikal', 'Uxmal', 'Palenque', 'Ziggurat', 'Step Pyramid', 'Bent Pyramid', 'Red Pyramid', 'Capstone', 'Pyramidion', 'Obelisk', 'Sphinx', 'Pharaoh', 'Scarab', 'Ankh'],
    cycle: ['ladders', 'mixed'],
    dayTypes: {
      ladders: { label: 'Three ladders', short: 'Ladders', blocks: [L('Ladder 1', ['hiit', 'pushBw2']), L('Ladder 2', ['plyoLow', 'legsBw2']), L('Ladder 3', ['hiit', 'core2'])] },
      mixed: { label: 'Ladders & Tabatas', short: 'Mixed', blocks: [L('Ladder 1', ['hiit', 'chestBw']), L('Ladder 2', ['plyoLow', 'coreHollow']), T('Tabatas', ['hiitSec', 'legsBw2', 'hiit', 'coreRot'], { values: [1] })] },
    },
  },
  {
    id: 'bell-hiit-long', name: 'Bell HIIT Long', subject: 'HIIT', minutes: P23_LONG, equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Bell EMOM & Tabatas / bell circuit & AMRAP', blurb: 'Long HIIT with one kettlebell: an EMOM and Tabatas, or a circuit and an AMRAP.',
    about: 'High-intensity work built around one kettlebell. One day is an EMOM of swings, snatches and squats, then Tabatas mixing the bell with jumps; the other is a circuit of the same, then an AMRAP of swings and burpees. They alternate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Cannonball', 'Shot Put', 'Hammer Throw', 'Discus', 'Javelin', 'Caber', 'Stone Put', 'Weight Throw', 'Bowling Ball', 'Wrecking Swing', 'Iron Ball', 'Ball and Chain', 'Flail', 'Mace', 'Morning Star', 'Maul', 'Sledge', 'Gavel', 'Cudgel', 'Club'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Bell EMOM & Tabatas', short: 'EMOM', blocks: [E('Bell EMOM', ['kbBallistic', 'hiit', 'kbLower2', 'hiit'], { values: [14, 16, 18] }), T('Tabatas', ['kbSwing', 'hiit', 'kbBallistic', 'core2'], { values: [1] })] },
      circuit: { label: 'Bell circuit & AMRAP', short: 'Circuit', blocks: [C('Bell circuit', ['kb_swing', 'hiit', 'kbLower2', 'kbBallistic', 'hiit'], { values: [2, 3, 4] }), A('AMRAP', ['kb_swing', 'burpee', 'goblet_squat'], { values: [8, 10, 12] })] },
    },
  },
  {
    id: 'hiit-35', name: 'HIIT 35', subject: 'HIIT', minutes: P23_MID, equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'EMOM & Tabatas / circuit & ladder, 35 minutes', blurb: 'Thirty-five minutes of no-gear HIIT: an EMOM and Tabatas, or a circuit and a ladder.',
    about: 'HIIT for about half an hour, no equipment. One day is an EMOM of jumps and strength moves, then Tabatas; the other a circuit, then a ladder of a jump and a push. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Flash Fire', 'Quick Burn', 'Hot Coal', 'Live Wire', 'High Voltage', 'Short Circuit', 'Surge Protector', 'Power Line', 'Circuit Breaker', 'Fuse Box', 'Dynamo', 'Generator', 'Battery', 'Capacitor', 'Transformer', 'Conductor', 'Insulator', 'Resistor', 'Diode', 'Transistor'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'EMOM & Tabatas', short: 'EMOM', blocks: [E('HIIT EMOM', ['hiit', 'legsBw2', 'hiitSec', 'pushBw2'], { values: [12, 14, 16] }), T('Tabatas', ['hiit', 'core2'], { values: [1] })] },
      circuit: { label: 'Circuit & ladder', short: 'Circuit', blocks: [C('HIIT circuit', ['plyoLow', 'chestBw', 'hiit', 'legsBw2', 'coreRot'], { values: [2, 3, 4] }), L('Ladder', ['hiit', 'pushBw2'])] },
    },
  },
  {
    id: 'hiit-amrap-plus', name: 'HIIT AMRAP Plus', subject: 'HIIT', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Two AMRAPs A / B', blurb: 'Two no-gear AMRAPs a day, with a short rest between them.',
    about: 'As many rounds as you can, twice. Each day is two AMRAPs of jumps, pushes, legs and core, with a short rest between; two days alternate so the moves change. Count your rounds and beat them next time. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Rally', 'Volley', 'Salvo', 'Barrage', 'Fusillade', 'Broadside', 'Cannonade', 'Bombardment', 'Blitz', 'Onslaught', 'Sortie', 'Charge', 'Assault', 'Raid', 'Foray', 'Sally', 'Push', 'Drive', 'Thrust', 'Advance'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Two AMRAPs A', short: 'A', blocks: [A('AMRAP 1', ['hiit', 'pushBw2', 'legsBw2'], { values: [10, 12, 14] }), A('AMRAP 2', ['plyoLow', 'chestBw', 'coreRot'], { values: [10, 12, 14] })] },
      b: { label: 'Two AMRAPs B', short: 'B', blocks: [A('AMRAP 1', ['hiitSec', 'legsBw2', 'hiit'], { values: [10, 12, 14] }), A('AMRAP 2', ['hiit', 'pushBw2', 'coreAnti'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'hiit-express', name: 'HIIT Express', subject: 'HIIT', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Tabatas / EMOM, short', blurb: 'Short no-gear HIIT: Tabatas one day, an EMOM the next.',
    about: 'HIIT when time is short and there is no equipment. One day is Tabatas, twenty seconds hard and ten seconds rest, eight times over each; the other an EMOM of jumps and strength moves. They alternate. Abs finish every session. Both later levels add reps.',
    names: ['Blink', 'Wink', 'Jiffy', 'Trice', 'Instant', 'Moment', 'Heartbeat', 'Breath', 'Split Second', 'Nanosecond', 'Flicker Fast', 'Snap Shot', 'Quick Draw', 'Fast Track', 'Shortcut', 'Express Lane', 'Rush Hour', 'Speedway', 'Fast Lane', 'Overtake'],
    cycle: ['tabata', 'emom'],
    dayTypes: {
      tabata: { label: 'Tabatas', short: 'Tabata', blocks: [T('Tabatas', ['hiit', 'legsBw2', 'plyoLow', 'core2'], { values: [2, 3] })] },
      emom: { label: 'HIIT EMOM', short: 'EMOM', blocks: [E('HIIT EMOM', ['hiit', 'pushBw2', 'hiitSec', 'legsBw2'], { values: [12, 14, 16] })] },
    },
  },
  // Plyometrics +6
  {
    id: 'plyo-volume', name: 'Plyo Volume', subject: 'Plyometrics', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Vertical / horizontal / lateral & upper', blurb: 'Three plyometric days: jump up, jump out, then side to side with upper-body power.',
    about: 'Plyometrics in every direction across three days. Squat jumps, tuck jumps and pogo hops go up; broad jumps and bounds go out; skaters and lateral bounds go sideways, with clap and explosive push-ups for the upper body. Straight sets with full rests, so every jump is a good one. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Kangaroo Rat', 'Springhare', 'Galago', 'Tarsier', 'Sifaka', 'Flea', 'Grasshopper', 'Cricket', 'Locust', 'Froghopper', 'Click Beetle', 'Springtail', 'Tree Frog', 'Leopard Frog', 'Bullfrog', 'Hare', 'Jackrabbit', 'Klipspringer Leap', 'Ibex', 'Chamois'],
    cycle: ['up', 'out', 'side'],
    dayTypes: {
      up: { label: 'Vertical', short: 'Up', blocks: [S('Vertical', ['plyoVert', 'plyoLow', 'plyoVert', 'plyoLow', 'plyoVert?'])] },
      out: { label: 'Horizontal', short: 'Out', blocks: [S('Horizontal', ['broad_jump', 'bounding', 'plyoLow', 'plyoLat', 'plyoLow?'])] },
      side: { label: 'Lateral & upper', short: 'Side', blocks: [S('Lateral & upper', ['plyoLat', 'plyoUp', 'plyoLat', 'plyoUp', 'plyoLow?'])] },
    },
  },
  {
    id: 'plyo-month', name: 'Plyo Month', subject: 'Plyometrics', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Jump sets & EMOM / jump circuit, 30 days', blurb: 'A month of jumping: straight sets and an EMOM one day, a jump circuit the next.',
    about: 'A month of jumps. One day is straight sets of vertical and broad jumps, then an EMOM of hops and bounds, a set at the top of every minute; the other is a circuit of jumps, push-ups and landings. They alternate. Every ten days the level steps up. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Takeoff', 'Liftoff', 'Launch', 'Ascent', 'Apex', 'Zenith', 'Summit', 'Crest', 'Peak', 'Pinnacle', 'Hang Time', 'Airtime', 'Glide', 'Soar', 'Float', 'Drift', 'Descent', 'Touchdown', 'Landing Gear', 'Stick It'],
    cycle: ['sets', 'circuit'],
    dayTypes: {
      sets: { label: 'Jump sets & EMOM', short: 'Sets', blocks: [S('Jump sets', ['plyoVert', 'broad_jump', 'plyoLow', 'plyoUp?']), E('Jump EMOM', ['plyoLat', 'plyoLow', 'plyoVert', 'plyoUp'], { values: [12, 14, 16] })] },
      circuit: { label: 'Jump circuit', short: 'Circuit', blocks: [C('Jump circuit', ['plyoLow', 'plyoUp', 'plyoLat', 'plyoVert', 'legsBw2'], { values: [4, 5, 6] })] },
    },
  },
  {
    id: 'loaded-jumps', name: 'Loaded Jumps', subject: 'Plyometrics', minutes: P23_LONG, levers: [null, 'reps', 'weight'],
    split: 'Jump & squat contrast / jump & hinge contrast', blurb: 'Contrast training: a heavy lift, then a jump, so the jump gets more out of the legs.',
    about: 'Heavy then fast. Each straight set pairs a lift with a jump straight after it, squats then squat jumps one day, deadlifts and swings then broad jumps the next, so the jump gets more from muscles the lift has woken up. They alternate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Coiled', 'Primed', 'Cocked', 'Loaded', 'Wound Up', 'Charged', 'Armed', 'Set', 'Ready', 'Poised', 'Tensed', 'Braced', 'Drawn', 'Taut', 'Strung', 'Sprung', 'Released', 'Fired', 'Launched', 'Unleashed'],
    cycle: ['squat', 'hinge'],
    dayTypes: {
      squat: { label: 'Jump & squat', short: 'Squat', blocks: [S('Jump & squat contrast', ['squat2', 'plyoVert', 'squat2', 'plyoLow', 'lunge2', 'plyoLat'])] },
      hinge: { label: 'Jump & hinge', short: 'Hinge', blocks: [S('Jump & hinge contrast', ['hinge2', 'broad_jump', 'kb_swing', 'plyoLow', 'hinge2', 'bounding'])] },
    },
  },
  {
    id: 'plyo-35', name: 'Plyo 35', subject: 'Plyometrics', minutes: P23_MID, equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Jump EMOM / bound circuit, 35 minutes', blurb: 'Thirty-five minutes of jumps: an EMOM one day, a bound circuit the next.',
    about: 'Jumping for about half an hour. One day is an EMOM of vertical, broad and lateral jumps, a set at the top of every minute; the other a circuit of bounds, hops and explosive push-ups. They alternate. Abs finish every session. Both later levels add reps.',
    names: ['Bounce House', 'Pogo Stick', 'Spring Board', 'Diving Board', 'Springbok Jump', 'Kangaroo Hop', 'Frog Leap', 'Leapfrog', 'Hopper', 'Skipper', 'Jumper', 'Leaper', 'Vaulter', 'High Jumper', 'Long Jumper', 'Triple Jump', 'Pole Vault', 'Hurdler', 'Steeplejack', 'Sky Walker'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Jump EMOM', short: 'EMOM', blocks: [E('Jump EMOM', ['plyoVert', 'broad_jump', 'plyoLat', 'plyoLow'], { values: [16, 18, 20] })] },
      circuit: { label: 'Bound circuit', short: 'Circuit', blocks: [C('Bound circuit', ['bounding', 'plyoLat', 'plyoUp', 'single_leg_hops', 'plyoLow'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'single-leg-power', name: 'Single-Leg Power', subject: 'Plyometrics', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Hops & sticks / bounds & landings, EMOM then sets', blurb: 'One leg at a time: hops and stuck landings, then bounds, on the minute and in sets.',
    about: 'Power one leg at a time. Each day opens with an EMOM, single-leg hops and stuck landings one day, bounds and skaters the next, then straight sets of single-leg strength to finish. They alternate. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Flamingo', 'Heron', 'Stork', 'Crane', 'Egret', 'Ibis', 'Spoonbill', 'Avocet', 'Stilt', 'Curlew', 'Godwit', 'Sandpiper', 'Plover', 'Lapwing', 'Oystercatcher', 'Turnstone', 'Dunlin', 'Knot Bird', 'Snipe', 'Woodcock'],
    cycle: ['hop', 'bound'],
    dayTypes: {
      hop: { label: 'Hops & sticks', short: 'Hop', blocks: [E('Hop EMOM', ['single_leg_hops', 'single_leg_hop_stick', 'plyoLow', 'single_leg_hops'], { values: [10, 12, 14] }), S('Single leg', ['legsBw2', 'single_leg_bridge', 'legsBw2?'])] },
      bound: { label: 'Bounds & landings', short: 'Bound', blocks: [E('Bound EMOM', ['bounding', 'skater_jumps', 'plyoLat', 'plyoLow'], { values: [10, 12, 14] }), S('Single leg', ['legsBw2', 'cossack_squat', 'legsBw2?'])] },
    },
  },
  {
    id: 'plyo-express', name: 'Plyo Express', subject: 'Plyometrics', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Up & down / side & push, short', blurb: 'Short jump sessions: vertical and drop work, or lateral jumps and push-ups.',
    about: 'Plyometrics in a short slot. One day is straight sets of jumps up and drops down; the other lateral jumps and explosive push-ups. Full rests keep every rep sharp. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Pop', 'Spring Up', 'Jolt', 'Jerk', 'Twitch', 'Kick', 'Burst', 'Boom', 'Blast', 'Bounce Back', 'Snap Back', 'Rebound Jump', 'Recoil Jump', 'Springload', 'Quick Hop', 'Hip Hop', 'Hop To', 'Jump Start', 'Kickstart', 'Pep'],
    cycle: ['up', 'side'],
    dayTypes: {
      up: { label: 'Up & down', short: 'Up', blocks: [S('Up & down', ['plyoVert', 'plyoLow', 'plyoVert', 'plyoLow?'])] },
      side: { label: 'Side & push', short: 'Side', blocks: [S('Side & push', ['plyoLat', 'plyoUp', 'plyoLat', 'plyoUp?'])] },
    },
  },
  // Running prep +5
  {
    id: 'runner-volume', name: 'Runner Volume', subject: 'Running prep', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Drills & legs / calves & core / hills & hips', blurb: 'Three runner days: drills and leg strength, calves and core, then hill legs and hips.',
    about: 'The strength running needs, across three days. Running drills and single-leg strength one day; calves, shins and a runner\'s core the next; hill-style drives, lunges and hip work the third. Straight sets and short circuits. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Parkrun', 'Fun Run', 'Fell', 'Trail', 'Towpath', 'Bridleway', 'Footpath', 'Greenway', 'Ridgeway', 'Coast Path', 'Canal Path', 'Forest Track', 'Moor', 'Heath', 'Downs', 'Wold', 'Dale', 'Glen', 'Gorge', 'Ravine'],
    cycle: ['drills', 'calves', 'hills'],
    dayTypes: {
      drills: { label: 'Drills & legs', short: 'Drills', blocks: [C('Drills', ['runDrill', 'runFast', 'runDrill'], { values: [2, 3] }), S('Leg strength', ['runLegs', 'singleLeg', 'runLegs', 'runLegs?'])] },
      calves: { label: 'Calves & core', short: 'Calves', blocks: [S('Calves & core', ['calfBw', 'shin', 'coreAnti', 'calfBw', 'coreRot', 'runPlyo?'])] },
      hills: { label: 'Hills & hips', short: 'Hills', blocks: [S('Hills & hips', ['wall_drive', 'runLegs', 'runPlyo', 'hipGlute', 'runLegs', 'clamshell?'])] },
    },
  },
  {
    id: 'runner-month', name: 'Runner Month', subject: 'Running prep', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Speed EMOM & legs / runner circuit, 30 days', blurb: 'A month for runners: a speed EMOM and leg work one day, a runner circuit the next.',
    about: 'A month of strength and speed for running. One day is an EMOM of drills and fast feet, a set at the top of every minute, then single-leg strength in straight sets; the other a long circuit of bounds, legs, calves and core. They alternate. Every ten days the level steps up. Abs finish every session. Both later levels add reps.',
    names: ['5K', '10K', 'Half', 'Full', 'Tempo Run', 'Long Run', 'Easy Run', 'Recovery Run', 'Fartlek', 'Strides', 'Hill Reps', 'Track Reps', 'Negative Split', 'Even Pace', 'Kick', 'Finish Line', 'Start Gun', 'Bib Number', 'Medal', 'Personal Best'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Speed EMOM & legs', short: 'EMOM', blocks: [E('Speed EMOM', ['runDrill', 'runFast', 'runPlyo', 'runFast'], { values: [12, 14, 16] }), S('Single leg', ['runLegs', 'singleLeg', 'runLegs?'])] },
      circuit: { label: 'Runner circuit', short: 'Circuit', blocks: [C('Runner circuit', ['runPlyo', 'runLegs', 'calfBw', 'coreAnti', 'runLegs'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'stride-builder', name: 'Stride Builder', subject: 'Running prep', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Drills & AMRAP / bounds & single-leg sets', blurb: 'A longer stride: drills and an AMRAP one day, bounds and single-leg work the next.',
    about: 'For a longer, springier stride. One day is a drill circuit, then an AMRAP of fast feet, hops and lunges; the other is bounds and pogo hops in straight sets, then single-leg strength. They alternate. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Gait Line', 'Footstrike', 'Cadence', 'Turnover', 'Push-off', 'Toe-off', 'Midstance', 'Swing Phase', 'Arm Swing', 'Knee Drive', 'Heel Lift', 'Lean', 'Posture', 'Rhythm', 'Flow State', 'Glide Step', 'Bounce Step', 'Spring Step', 'Long Stride', 'Lope'],
    cycle: ['drills', 'bounds'],
    dayTypes: {
      drills: { label: 'Drills & AMRAP', short: 'Drills', blocks: [C('Drill circuit', ['runDrill', 'runDrill', 'runFast', 'runDrill'], { values: [2, 3, 4] }), A('AMRAP', ['runFast', 'runPlyo', 'runLegs', 'coreAnti'], { values: [10, 12, 14] })] },
      bounds: { label: 'Bounds & single leg', short: 'Bounds', blocks: [S('Bounds', ['bounding', 'pogo_hops', 'runPlyo']), S('Single leg', ['runLegs', 'singleLeg', 'runLegs', 'runLegs?'])] },
    },
  },
  {
    id: 'runner-strength-35', name: 'Runner Strength 35', subject: 'Running prep', minutes: P23_MID, equip: 'bw', levers: [null, 'tempo', 'reps'],
    split: 'Hips & single leg / calves, feet & core, 35 minutes', blurb: 'Thirty-five minutes of runner strength: hips and single legs, or calves, feet and core.',
    about: 'The strength that keeps runners running. One day trains the hips and single-leg strength, bridges, clamshells and lunges; the other the calves, shins and feet with a runner\'s core. Straight sets throughout. They alternate. Abs finish every session. Level II slows every rep down and Level III adds reps.',
    names: ['Pacer', 'Harrier', 'Strider', 'Jogger', 'Sprinter', 'Miler', 'Distance', 'Fell Runner', 'Trail Runner', 'Road Runner', 'Rabbit', 'Hare and Hounds', 'Courser', 'Racer', 'Dasher', 'Galloper', 'Trotter', 'Ambler', 'Rambler', 'Wanderer'],
    cycle: ['hips', 'feet'],
    dayTypes: {
      hips: { label: 'Hips & single leg', short: 'Hips', blocks: [S('Hips & single leg', ['single_leg_bridge', 'runLegs', 'clamshell', 'singleLeg', 'runLegs', 'hipGlute?'])] },
      feet: { label: 'Calves, feet & core', short: 'Feet', blocks: [S('Calves, feet & core', ['single_leg_calf_raise', 'shin', 'calfBw', 'coreAnti', 'coreRot', 'calfPlyo?'])] },
    },
  },
  {
    id: 'runner-express', name: 'Runner Express', subject: 'Running prep', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Drill & hop circuit / runner AMRAP, short', blurb: 'Short runner sessions: a drill and hop circuit, or a runner AMRAP.',
    about: 'Running prep in a short slot. One day is a circuit of drills, hops and single-leg work; the other an AMRAP of fast feet, bounds, lunges and core. They alternate. Abs finish every session. Both later levels add reps.',
    names: ['Warm Lap', 'Cool Lap', 'Victory Lap', 'Home Straight', 'Back Straight', 'Bend', 'Lane One', 'Lane Eight', 'Inside Lane', 'Outside Lane', 'Bell Lap', 'Split Time', 'Lap Time', 'Kick Lap', 'Pace Lap', 'Tempo Lap', 'Stride Out', 'Shake Out', 'Jog On', 'Run Home'],
    cycle: ['circuit', 'amrap'],
    dayTypes: {
      circuit: { label: 'Drill & hop circuit', short: 'Circuit', blocks: [C('Drill & hop circuit', ['runDrill', 'calfPlyo', 'runLegs', 'runDrill', 'runPlyo'], { values: [2, 3, 4] })] },
      amrap: { label: 'Runner AMRAP', short: 'AMRAP', blocks: [A('Runner AMRAP', ['runFast', 'runPlyo', 'runLegs', 'coreAnti'], { values: [14, 16, 18] })] },
    },
  },
  // Court & field sports +5
  {
    id: 'court-volume', name: 'Court Volume', subject: 'Court & field sports', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Agility circuit & power sets / reaction EMOM & legs', blurb: 'Long court sessions: agility and power one day, reaction work and legs the next.',
    about: 'The movement court and field sports ask for, in long sessions. One day is an agility circuit of shuffles, cuts and backpedals, then power jumps in straight sets; the other an EMOM of split steps and reactions, then leg strength for cutting. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Baseline', 'Sideline', 'Touchline', 'Byline', 'Halfway Line', 'Centre Circle', 'Penalty Spot', 'Free Throw', 'Three-Point', 'Key', 'Paint', 'Service Box', 'Tramline', 'Net Cord', 'Crease', 'Pitch', 'Wicket', 'End Zone', 'Goal Line', 'Try Line'],
    cycle: ['agility', 'react'],
    dayTypes: {
      agility: { label: 'Agility & power', short: 'Agility', blocks: [C('Agility circuit', ['courtMove', 'courtPower', 'courtMove', 'courtMove'], { values: [3, 4, 5] }), S('Power', ['courtPower', 'broad_jump', 'courtPower?'])] },
      react: { label: 'Reaction EMOM & legs', short: 'React', blocks: [E('Reaction EMOM', ['split_step', 'courtMove', 'courtPower', 'courtMove'], { values: [12, 14, 16] }), S('Cutting legs', ['courtLegs', 'cossack_squat', 'courtLegs', 'copenhagen_plank?'])] },
    },
  },
  {
    id: 'court-month', name: 'Court Month', subject: 'Court & field sports', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Tabatas & legs / agility AMRAP & power, 30 days', blurb: 'A month for court and field: Tabatas and legs one day, an agility AMRAP and power the next.',
    about: 'A month of game fitness. One day is Tabatas of footwork and power, then cutting strength in straight sets; the other an AMRAP of shuttles, shuffles and jumps, then power work. They alternate. Every ten days the level steps up. Abs finish every session. Both later levels add reps.',
    names: ['Kick-off', 'First Half', 'Half Time', 'Second Half', 'Extra Time', 'Overtime', 'Sudden Death', 'Tie-break', 'Deuce', 'Advantage', 'Match Point', 'Set Point', 'Break Point', 'Final Whistle', 'Buzzer', 'Time-out', 'Fast Break', 'Counter', 'Turnover', 'Rebound'],
    cycle: ['tabata', 'amrap'],
    dayTypes: {
      tabata: { label: 'Tabatas & legs', short: 'Tabata', blocks: [T('Footwork Tabatas', ['courtMove', 'courtPower', 'hiitSec', 'courtMove'], { values: [1] }), S('Cutting legs', ['courtLegs', 'copenhagen_plank', 'courtLegs', 'courtLegs?'])] },
      amrap: { label: 'Agility AMRAP & power', short: 'AMRAP', blocks: [A('Agility AMRAP', ['shuttle_touch', 'courtMove', 'courtPower', 'courtMove'], { values: [12, 14, 16] }), S('Power', ['courtPower', 'plyoLat', 'courtPower?'])] },
    },
  },
  {
    id: 'field-strength-long', name: 'Field Strength Long', subject: 'Court & field sports', minutes: P23_LONG, levers: [null, 'weight', 'reps'],
    split: 'Power & lower lifts / power & upper lifts, long', blurb: 'Long sessions of jumps then lifts: lower-body strength one day, upper the next.',
    about: 'Strength for contact and speed, with time for it. Each day opens with power jumps, then lifts in straight sets: squats, hinges and lunges one day, presses, rows and carries the next. They alternate. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Scrum', 'Lineout', 'Maul Push', 'Ruck', 'Tackle', 'Hand-off', 'Sidestep', 'Dummy', 'Offload', 'Breakdown', 'Blitz Defence', 'Drop Goal', 'Conversion', 'Penalty Kick', 'Grubber', 'Up and Under', 'Box Kick', 'Garryowen', 'Haka', 'Pack'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Power & lower', short: 'Lower', blocks: [S('Power', ['courtPower', 'broad_jump']), S('Lower lifts', ['squat2', 'hinge2', 'lunge2', 'courtLegs', 'squat2?'])] },
      upper: { label: 'Power & upper', short: 'Upper', blocks: [S('Power', ['courtPower', 'plyoUp']), S('Upper lifts', ['pushLoad2', 'row2', 'farmer_carry', 'shoulders2', 'backRow?'])] },
    },
  },
  {
    id: 'agility-35', name: 'Agility 35', subject: 'Court & field sports', minutes: P23_MID, equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Agility EMOM / footwork circuit & legs, 35 minutes', blurb: 'Thirty-five minutes of agility: an EMOM one day, a footwork circuit and legs the next.',
    about: 'Quick feet for about half an hour. One day is an EMOM of shuffles, cuts and first-step jumps, a set at the top of every minute; the other a footwork circuit, then leg strength for changing direction. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Dribble', 'Crossover', 'Spin Move', 'Jab Step', 'Pivot Foot', 'Euro Step', 'Step Back', 'Fadeaway', 'Pick', 'Roll', 'Screen', 'Cut', 'Backdoor', 'Give and Go', 'Alley-oop', 'Layup', 'Dunk', 'Rebound Leap', 'Block', 'Steal'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Agility EMOM', short: 'EMOM', blocks: [E('Agility EMOM', ['courtMove', 'courtPower', 'courtMove', 'courtLegs', 'courtMove'], { values: [20, 22, 25] })] },
      circuit: { label: 'Footwork circuit & legs', short: 'Circuit', blocks: [C('Footwork circuit', ['courtMove', 'split_step', 'courtMove', 'courtPower'], { values: [2, 3, 4] }), S('Legs', ['courtLegs', 'cossack_squat', 'courtLegs?'])] },
    },
  },
  {
    id: 'court-express', name: 'Court Express', subject: 'Court & field sports', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Footwork Tabatas / power circuit, short', blurb: 'Short court sessions: footwork Tabatas one day, a power circuit the next.',
    about: 'Game fitness in a short slot. One day is Tabatas of shuffles, fast feet and first-step jumps; the other a circuit of power jumps, cuts and cutting strength. They alternate. Abs finish every session. Both later levels add reps.',
    names: ['Serve', 'Return', 'Lob', 'Smash', 'Drop Shot', 'Volley Shot', 'Slice', 'Topspin', 'Backhand', 'Forehand', 'Ace', 'Let', 'Fault', 'Rally Shot', 'Passing Shot', 'Half Volley', 'Overhead', 'Chip', 'Dink', 'Drive Shot'],
    cycle: ['tabata', 'circuit'],
    dayTypes: {
      tabata: { label: 'Footwork Tabatas', short: 'Tabata', blocks: [T('Footwork Tabatas', ['courtMove', 'hiitSec', 'courtPower', 'courtMove'], { values: [3, 4] })] },
      circuit: { label: 'Power circuit', short: 'Circuit', blocks: [C('Power circuit', ['courtPower', 'courtMove', 'courtLegs', 'courtPower', 'coreRot'], { values: [2, 3, 4] })] },
    },
  },
].map((c) => ({ ...c, added: 23, catalogue: 13 }));
CONFIGS.push(...P23_T7);

// Phase 23 ticket 8: Boxing +7, Kickboxing +6 (Fighter +7 is in configs/mixed.js, its family file), by ticket 3's rules.
const P23_T8 = [
  // Boxing +7
  {
    id: 'boxing-volume', name: 'Boxing Volume', subject: 'Boxing', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Long bouts & circuit / long bouts & Tabatas', blurb: 'Long boxing sessions: plenty of rounds, then a circuit or Tabatas.',
    about: 'Boxing with the rounds a real session has. Each day is a long run of shadowboxing bouts, jabs and crosses, power combinations, slips and rolls, then a bodyweight circuit one day and Tabatas the next. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Jab', 'Cross', 'Hook', 'Uppercut', 'Overhand', 'Haymaker', 'Counterpunch', 'Body Shot', 'Liver Shot', 'Check Hook', 'Pivot', 'Slip', 'Roll', 'Parry', 'Catch', 'Clinch', 'Feint', 'Southpaw', 'Orthodox', 'Peekaboo'],
    cycle: ['circuit', 'tabata'],
    dayTypes: {
      circuit: { label: 'Bouts & circuit', short: 'Circuit', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxBasic', 'bxPower', 'bxMove?']), C('Circuit', ['chestBw', 'legsBw2', 'hiit', 'coreRot'], { values: [1, 2, 3] })] },
      tabata: { label: 'Bouts & Tabatas', short: 'Tabata', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense', 'bxPower', 'bxBasic?']), T('Tabatas', ['hiit', 'core2'], { values: [1, 2] })] },
    },
  },
  {
    id: 'boxing-month', name: 'Boxing Month', subject: 'Boxing', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts & EMOM / bouts & strength / bouts & Tabatas, 30 days', blurb: 'A month of boxing: bouts every day, then an EMOM, strength or Tabatas in turn.',
    about: 'A month built like a fight camp. Every day opens with shadowboxing bouts, then the work changes: an EMOM of conditioning, straight sets of push-ups, squats and core, or Tabatas. Three days rotate. Every ten days the level steps up. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Camp Day', 'Roadwork', 'Sparring Day', 'Pad Day', 'Bag Day', 'Rope Day', 'Mitt Work', 'Film Study', 'Weight Cut', 'Media Day', 'Open Workout', 'Fight Week Two', 'Taper', 'Weigh-in', 'Fight Eve', 'Ring Night', 'Corner', 'Cutman', 'Trainer', 'Promoter'],
    cycle: ['emom', 'strength', 'tabata'],
    dayTypes: {
      emom: { label: 'Bouts & EMOM', short: 'EMOM', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxMove', 'bxBasic?']), E('EMOM', ['burpee', 'chestBw', 'hiit', 'coreRot'], { values: [8, 10, 12] })] },
      strength: { label: 'Bouts & strength', short: 'Strength', blocks: [B('Bouts', ['bxPower', 'bxBasic', 'bxDefense', 'bxPower', 'bxBasic?']), S('Strength', ['chestBw', 'legsBw2', 'pushBw2', 'coreAnti?'])] },
      tabata: { label: 'Bouts & Tabatas', short: 'Tabata', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense', 'bxPower?']), T('Tabatas', ['hiit', 'coreRot', 'cardio', 'core2'], { values: [1, 2] })] },
    },
  },
  {
    id: 'boxing-and-bells', name: 'Boxing and Bells', subject: 'Boxing', minutes: P23_LONG, levers: [null, 'variation', 'variation'],
    split: 'Bouts & bell power / bouts & dumbbell strength', blurb: 'Bouts, then strength with weights: kettlebell power one day, dumbbells the next.',
    about: 'Boxing with the strength behind the punches. Each day is a long block of bouts, then weights: swings, cleans and push presses one day, rows, presses and rotational core with dumbbells the next. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Heavy Bag', 'Speed Bag', 'Double-End', 'Maize Bag', 'Uppercut Bag', 'Focus Mitt', 'Thai Pad', 'Body Shield', 'Hand Wrap', 'Mouthguard', 'Headgear', 'Gloves', 'Ring Rope', 'Turnbuckle', 'Canvas', 'Apron', 'Stool', 'Spit Bucket', 'Bell Ring', 'Scorecard'],
    cycle: ['bell', 'db'],
    dayTypes: {
      bell: { label: 'Bouts & bell power', short: 'Bell', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxPower', 'bxBasic?']), S('Bell power', ['kbBallistic', 'kb_push_press', 'kb_swing', 'coreRot?'])] },
      db: { label: 'Bouts & dumbbell strength', short: 'Dumbbell', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense', 'bxPower?']), S('Dumbbell strength', ['backRow', 'pushLoad2', 'db_woodchop', 'shoulders2?'])] },
    },
  },
  {
    id: 'combo-builder', name: 'Combo Builder', subject: 'Boxing', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Two-punch to six-punch bouts / defence & counter bouts', blurb: 'Bouts that grow from two punches to six, then defence and counters.',
    about: 'Long boxing sessions built around combinations. One day the bouts climb from jab-cross to four, five and six punches; the other drills slips, rolls and pulls with the counter that follows, then straight sets of push-ups and squats. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['One-Two', 'Three', 'Four Count', 'Five Count', 'Six Count', 'Double Up', 'Triple Jab', 'Stack', 'String', 'Chain Punch', 'Flurry', 'Volley Punch', 'Barrage Punch', 'Combination', 'Sequence', 'Pattern', 'Rhythm Punch', 'Cadence Punch', 'Tempo Punch', 'Beat'],
    cycle: ['combo', 'defence'],
    dayTypes: {
      combo: { label: 'Combination bouts', short: 'Combos', blocks: [B('Combination bouts', ['bxBasic', 'bxBasic', 'bxPower', 'bxPower', 'six_punch', 'bxPower', 'bxBasic?'])] },
      defence: { label: 'Defence & counter', short: 'Defence', blocks: [B('Defence bouts', ['bxDefense', 'pull_counter', 'bxDefense', 'shoulder_roll', 'bxMove']), S('Strength', ['pushBw2', 'legsBw2', 'coreRot?'])] },
    },
  },
  {
    id: 'boxing-35', name: 'Boxing 35', subject: 'Boxing', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts & EMOM / bouts & circuit, 35 minutes', blurb: 'Thirty-five minutes of boxing: bouts, then an EMOM or a circuit.',
    about: 'Boxing for about half an hour. Each day opens with shadowboxing bouts, then an EMOM of punches and conditioning one day and a bodyweight circuit the next. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Round One', 'Round Two', 'Round Three', 'Round Four', 'Round Five', 'Round Six', 'Round Seven', 'Round Eight', 'Round Nine', 'Round Ten', 'Round Eleven', 'Round Twelve', 'Championship Round', 'Decision', 'Split Decision', 'Unanimous', 'Majority', 'Draw', 'Rematch', 'Title Shot'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Bouts & EMOM', short: 'EMOM', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxMove?']), E('EMOM', ['punches', 'chestBw', 'hiit', 'coreRot'], { values: [8, 10, 12] })] },
      circuit: { label: 'Bouts & circuit', short: 'Circuit', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense?']), C('Circuit', ['pushBw2', 'legsBw2', 'burpee', 'coreAnti'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'body-shot-boxing', name: 'Body Shot Boxing', subject: 'Boxing', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Body & head bouts / punch Tabatas & core', blurb: 'Body shots and head shots in bouts, then punch Tabatas and core work.',
    about: 'Boxing that goes to the body. One day is bouts of body hooks, body-head doubles and level changes; the other is Tabatas of fast punches, then core straight sets, since body shots are taken as much as thrown. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Solar Plexus', 'Rib Shot', 'Kidney', 'Gut Punch', 'Short Rib', 'Floating Rib', 'Belly', 'Midsection', 'Torso', 'Ribcage', 'Sternum', 'Diaphragm', 'Flank', 'Side Body', 'Breadbasket', 'Engine Room', 'Middle', 'Core Shot', 'Body Blow', 'Low Blow'],
    cycle: ['body', 'tabata'],
    dayTypes: {
      body: { label: 'Body & head bouts', short: 'Body', blocks: [B('Body & head bouts', ['body_head', 'body_cross_hook', 'bxPower', 'jab_body_hook', 'bxDefense', 'bxBasic?'])] },
      tabata: { label: 'Punch Tabatas & core', short: 'Tabata', blocks: [T('Punch Tabatas', ['bxBasic', 'bxPower', 'bxBasic', 'bxPower'], { values: [2, 3] }), S('Core', ['coreRot', 'coreAnti', 'coreHollow?'])] },
    },
  },
  {
    id: 'boxing-express', name: 'Boxing Express', subject: 'Boxing', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Short bouts / footwork bouts & EMOM, short', blurb: 'Short boxing sessions: straight bouts, or footwork bouts and a short EMOM.',
    about: 'Boxing in a short slot. One day is a run of bouts, punches, power and defence; the other is footwork bouts, then a short EMOM of punches and push-ups. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Quick Jab', 'Flick Jab', 'Snap Jab', 'Pawing Jab', 'Range Finder', 'Double Tap', 'Stiff Jab', 'Pop Shot', 'Lead Hook', 'Rear Hand', 'Short Hook', 'Inside', 'Outside', 'Angle', 'Step Off', 'Cut Off', 'Ring Centre', 'Ropes', 'Corner Trap', 'Escape'],
    cycle: ['bouts', 'feet'],
    dayTypes: {
      bouts: { label: 'Short bouts', short: 'Bouts', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxBasic?', 'bxPower?'])] },
      feet: { label: 'Footwork bouts & EMOM', short: 'Feet', blocks: [B('Footwork bouts', ['bxMove', 'hook_pivot', 'bxBasic?']), E('EMOM', ['punches', 'chestBw', 'hiitSec'], { values: [6, 8, 10] })] },
    },
  },
  // Kickboxing +6
  {
    id: 'kickboxing-volume', name: 'Kickboxing Volume', subject: 'Kickboxing', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Kick & knee bouts & circuit / combo bouts & Tabatas', blurb: 'Long kickboxing sessions: kicks and knees, then combinations, with conditioning after.',
    about: 'Kickboxing with time for every weapon. One day is a long run of kick and knee bouts, then a bodyweight circuit; the other is bouts of punch-and-kick combinations, then Tabatas. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Roundhouse', 'Teep', 'Low Kick', 'High Kick', 'Switch Kick', 'Push Kick', 'Side Kick', 'Back Kick', 'Axe Kick', 'Hook Kick', 'Knee', 'Flying Knee', 'Elbow', 'Clinch Work', 'Sweep', 'Check', 'Block', 'Shin Guard', 'Ring Craft', 'Muay'],
    cycle: ['kick', 'combo'],
    dayTypes: {
      kick: { label: 'Kick & knee bouts & circuit', short: 'Kicks', blocks: [B('Kick & knee bouts', ['kkKick', 'kkKnee', 'kkKick', 'kkCombo', 'kkKnee', 'kkKick?']), C('Circuit', ['legsBw2', 'pushBw2', 'hiit', 'coreRot'], { values: [1, 2, 3] })] },
      combo: { label: 'Combo bouts & Tabatas', short: 'Combos', blocks: [B('Combo bouts', ['kkCombo', 'bxBasic', 'kkCombo', 'kkSpin', 'kkCombo', 'bxPower?']), T('Tabatas', ['hiit', 'core2'], { values: [1, 2] })] },
    },
  },
  {
    id: 'kickboxing-month', name: 'Kickboxing Month', subject: 'Kickboxing', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Kick bouts & legs / combo bouts & core, 30 days', blurb: 'A month of kickboxing: kick bouts and leg strength, then combos and core.',
    about: 'A month of kickboxing. One day is kick and knee bouts, then straight sets for the legs that throw them; the other is combination bouts, then a core circuit for the turn behind every kick. They alternate. Every ten days the level steps up. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Thai Camp', 'Wai Kru', 'Ram Muay', 'Mongkol', 'Pra Jiad', 'Nak Muay', 'Kru', 'Lumpinee', 'Rajadamnern', 'Sarama', 'Clinch Day', 'Pad Round', 'Kick Day', 'Knee Day', 'Shin Day', 'Run Day', 'Rest Day', 'Fight Day', 'Fight Card', 'Main Event'],
    cycle: ['kick', 'combo'],
    dayTypes: {
      kick: { label: 'Kick bouts & legs', short: 'Kicks', blocks: [B('Kick bouts', ['kkKick', 'kkKnee', 'kkKick', 'kkKnee', 'kkKick?']), S('Legs', ['legsBw2', 'cossack_squat', 'single_leg_rdl_bw', 'legsBw2?'])] },
      combo: { label: 'Combo bouts & core', short: 'Combos', blocks: [B('Combo bouts', ['kkCombo', 'bxBasic', 'kkCombo', 'kkSpin', 'kkCombo?']), C('Core circuit', ['coreRot', 'coreAnti', 'coreHollow', 'coreRot'], { values: [2, 3] })] },
    },
  },
  {
    id: 'kick-power-long', name: 'Kick Power Long', subject: 'Kickboxing', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Power kick bouts & plyo / knee bouts & hip strength', blurb: 'Kicks with more behind them: power bouts and jumps, then knees and hip strength.',
    about: 'Kickboxing for power. One day is bouts of hard kicks and combinations, then jumps in straight sets for the hips and legs that drive them; the other is knee and clinch bouts, then hip-flexor and adductor strength. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Thunder Kick', 'Iron Shin', 'Steel Knee', 'Hammer Kick', 'Axe Swing', 'Sickle', 'Scythe', 'Reaper', 'Whip Kick', 'Lash', 'Crack', 'Snap Kick', 'Chop', 'Cleave', 'Splitter', 'Breaker Kick', 'Bonebreaker', 'Hard Shin', 'Teak', 'Ironwood'],
    cycle: ['power', 'knee'],
    dayTypes: {
      power: { label: 'Power bouts & plyo', short: 'Power', blocks: [B('Power kick bouts', ['kkKick', 'kkCombo', 'kkKick', 'kkSpin', 'kkCombo?']), S('Plyo', ['plyoLat', 'plyoVert', 'plyoLow', 'plyoLat?'])] },
      knee: { label: 'Knee bouts & hips', short: 'Knees', blocks: [B('Knee bouts', ['kkKnee', 'clinch_knees', 'kkKnee', 'kkCombo', 'kkKnee?']), S('Hip strength', ['standing_knee_hold', 'adductorBw', 'hipFlex', 'cossack_squat?'])] },
    },
  },
  {
    id: 'kickboxing-35', name: 'Kickboxing 35', subject: 'Kickboxing', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Bouts & kick circuit / bouts & strength, 35 minutes', blurb: 'Thirty-five minutes of kickboxing: bouts, then a kick circuit or strength.',
    about: 'Kickboxing for about half an hour. Each day opens with bouts of kicks, knees and punches, then a circuit of kicks and conditioning one day and straight sets of strength the next. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Krabi', 'Ayutthaya', 'Sukhothai', 'Isan', 'Korat', 'Udon', 'Hat Yai', 'Hua Hin', 'Koh Samui', 'Koh Tao', 'Pai', 'Lampang', 'Nan', 'Trang', 'Surin', 'Buriram'],
    cycle: ['circuit', 'strength'],
    dayTypes: {
      circuit: { label: 'Bouts & kick circuit', short: 'Circuit', blocks: [B('Bouts', ['kkKick', 'kkCombo', 'kkKnee', 'bxBasic?']), C('Kick circuit', ['kkKick', 'hiit', 'kkKnee', 'coreRot'], { values: [1, 2, 3] })] },
      strength: { label: 'Bouts & strength', short: 'Strength', blocks: [B('Bouts', ['kkCombo', 'kkKick', 'kkSpin', 'kkKnee?']), S('Strength', ['legsBw2', 'pushBw2', 'singleLeg', 'coreAnti?'])] },
    },
  },
  {
    id: 'kick-tabata-strength', name: 'Kick Tabata Strength', subject: 'Kickboxing', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Kick Tabatas & legs / knee Tabatas & core', blurb: 'Kick Tabatas then leg strength, or knee Tabatas then core.',
    about: 'Kickboxing on the Tabata clock, twenty seconds hard and ten seconds rest. One day is kick Tabatas, then straight sets for the legs; the other is knee and punch Tabatas, then core work for the turn of the hips. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Twenty On', 'Ten Off', 'Eight Rounds', 'Four Minutes', 'Interval', 'Set Piece', 'Round Robin', 'Burst Kick', 'Rapid Fire', 'Quick Feet', 'Fast Hands', 'Hot Shins', 'Last Round', 'Final Ten', 'Empty Tank', 'Second Wind', 'Gas Tank', 'Engine Kick', 'Turbo Kick', 'Overdrive'],
    cycle: ['kick', 'knee'],
    dayTypes: {
      kick: { label: 'Kick Tabatas & legs', short: 'Kicks', blocks: [T('Kick Tabatas', ['kkKick', 'kkCombo', 'kkKick', 'kkCombo'], { values: [2, 3] }), S('Legs', ['legsBw2', 'single_leg_rdl_bw', 'legsBw2?'])] },
      knee: { label: 'Knee Tabatas & core', short: 'Knees', blocks: [T('Knee Tabatas', ['kkKnee', 'bxBasic', 'kkKnee', 'bxPower'], { values: [2, 3] }), S('Core', ['coreRot', 'coreAnti', 'coreRot?'])] },
    },
  },
  {
    id: 'kickboxing-express', name: 'Kickboxing Express', subject: 'Kickboxing', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Kick bouts / combo bouts, short', blurb: 'Short kickboxing sessions: kick bouts one day, combination bouts the next.',
    about: 'Kickboxing in a short slot. One day is bouts of kicks and knees; the other bouts of punch-and-kick combinations. They alternate. Abs finish every session. Both later levels bring longer combinations and harder moves.',
    names: ['Quick Kick', 'Flash Kick', 'Snap Teep', 'Light Feet', 'Fast Shin', 'Swift Knee', 'Short Round', 'Mini Bout', 'Sharp Shot', 'Clean Kick', 'Crisp', 'Tidy', 'Neat', 'Brisk', 'Nimble', 'Agile', 'Spry', 'Deft', 'Lithe', 'Fleet'],
    cycle: ['kick', 'combo'],
    dayTypes: {
      kick: { label: 'Kick bouts', short: 'Kicks', blocks: [B('Kick bouts', ['kkKick', 'kkKnee', 'kkKick', 'kkKnee', 'kkKick?'])] },
      combo: { label: 'Combo bouts', short: 'Combos', blocks: [B('Combo bouts', ['kkCombo', 'bxBasic', 'kkCombo', 'kkCombo?', 'kkSpin?'])] },
    },
  },
].map((c) => ({ ...c, added: 23, catalogue: 13 }));
CONFIGS.push(...P23_T8);

// Phase 23: the new programs' ids in shelf order, appended to programs.config.js's ORDER after every older program
CONFIGS.order23 = [...P23_T7, ...P23_T8].map((c) => c.id);
module.exports = CONFIGS;
