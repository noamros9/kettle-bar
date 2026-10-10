const { S, C, E, F } = require('./shared.js');

const SUN = F('Sun salutations', ['sun_salutation']);
const ONCE = { values: [1] }; // a flow done once through (the hundred opens a Pilates session once)

const CONFIGS = [
  // ---------------- CORE & ABS, MOBILITY & POSTURE (28–30 min) ----------------
  {
    id: 'core-foundations', name: 'Core Foundations', subject: 'Core & abs', minutes: [27.5, 30.4], levers: [null, 'tempo', 'variation'],
    split: '3-day cycle', blurb: 'Anti-extension, anti-rotation and carry days, each with a mobility flow and a little strength.',
    names: ['Granite', 'Basalt', 'Quartz', 'Onyx', 'Jasper', 'Marble', 'Flint', 'Obsidian', 'Agate', 'Slate', 'Garnet', 'Topaz', 'Jade', 'Opal', 'Beryl', 'Feldspar', 'Mica', 'Pumice', 'Travertine', 'Eilat Stone'],
    cycle: ['ext', 'rot', 'carry'],
    dayTypes: {
      ext: { label: 'Anti-extension', short: 'Ext', blocks: [S('Core strength', ['core', 'core', 'squat']), C('Mobility flow', ['mobility', 'mobility', 'mobility'], { values: [2, 3] })] },
      rot: { label: 'Anti-rotation', short: 'Rot', blocks: [S('Core strength', ['core', 'core', 'push']), C('Mobility flow', ['mobility', 'mobility', 'mobility'], { values: [2, 3] })] },
      carry: { label: 'Carries', short: 'Carry', blocks: [S('Carries & strength', ['carry', 'carry', 'hinge']), C('Mobility flow', ['mobility', 'mobility', 'mobility'], { values: [2, 3] })] },
    },
  },
  {
    id: 'flow-state', name: 'Flow State', subject: 'Mobility & posture', minutes: [27.5, 30.4], levers: [null, 'tempo', 'reps'],
    split: '3-day cycle', blurb: 'Longer mobility flows, core circuits and light strength. Good between harder weeks.',
    names: ['Current', 'Eddy', 'Riffle', 'Cascade', 'Estuary', 'Tide', 'Delta Flow', 'Rapids', 'Spring', 'Meander', 'Brook', 'Lagoon', 'Wellspring', 'Undertow', 'Ripple', 'Stream', 'Confluence', 'Wake', 'Swell', 'Oasis'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Hips & core', short: 'A', blocks: [C('Mobility flow', ['mobility', 'mobility', 'mobility', 'mobility'], { values: [1, 2, 3, 4] }), C('Core circuit', ['core', 'core', 'core'], { values: [1, 2, 3] }), S('Light strength', ['squat'])] },
      b: { label: 'Spine & shoulders', short: 'B', blocks: [C('Mobility flow', ['mobility', 'mobility', 'mobility', 'mobility'], { values: [1, 2, 3, 4] }), C('Core circuit', ['core', 'core', 'core'], { values: [1, 2, 3] }), S('Light strength', ['row'])] },
      c: { label: 'Full flow', short: 'C', blocks: [C('Mobility flow', ['mobility', 'mobility', 'mobility', 'mobility'], { values: [1, 2, 3, 4] }), C('Core circuit', ['core', 'core', 'core'], { values: [1, 2, 3] }), S('Light strength', ['push'])] },
    },
  },
  {
    id: 'deep-core-60', name: 'Deep Core 60', subject: 'Core & abs', minutes: [27.5, 30.4], levers: [null, 'tempo', 'variation'],
    split: 'Core day / mobility & carries day', blurb: 'Alternates slow, long-hold core strength with mobility and loaded carries.',
    names: ['Trench', 'Abyss', 'Reef', 'Kelp', 'Coral', 'Fathom', 'Nautilus', 'Mariana', 'Bathysphere', 'Leviathan', 'Anchorage', 'Sounding', 'Benthic', 'Thermocline', 'Seamount', 'Plankton', 'Current Deep', 'Grotto', 'Atoll', 'Keel'],
    cycle: ['core', 'mob'],
    dayTypes: {
      core: { label: 'Core strength', short: 'Core', blocks: [S('Core strength', ['core', 'core', 'absW', 'core?'])] },
      mob: { label: 'Mobility & carries', short: 'Mobility', blocks: [C('Mobility flow', ['mobility', 'mobility', 'mobility', 'mobility'], { values: [2, 3] }), S('Carries', ['carry', 'carry?'])] },
    },
  },
  // ---------------- YOGA (Phase 5: guided flows, no abs finisher) ----------------
  {
    id: 'sun-and-strength', added: 5, name: 'Sun & Strength', subject: 'Yoga', minutes: [30, 35], equip: 'bw', absSlots: [], levers: [null, 'holds', 'variation'],
    split: 'Warriors / standing strength / hips & backbends', blurb: 'Sun salutations, then strong standing poses held on the clock, then a slower floor sequence.',
    about: 'A strong, steady yoga practice built on sun salutations and standing poses. Each session opens with salutations, moves through a standing flow and ends on the floor. The three days rotate warriors, standing strength with balance, and hips with backbends. Level II holds every pose longer and Level III brings harder versions, like twisting chair and half moon. One Start runs each flow and the voice names every pose.',
    names: ['Dawn', 'Daybreak', 'First Light', 'Sunrise', 'Morning Star', 'Aurora', 'Solar', 'Radiance', 'High Sun', 'Midday', 'Glow', 'Ember', 'Sunbeam', 'Golden Hour', 'Heliotrope', 'Corona', 'Solstice Sun', 'Daystar', 'Sunfire', 'Afterglow'],
    cycle: ['warriors', 'strength', 'open'],
    dayTypes: {
      warriors: { label: 'Salutations & warriors', short: 'Warriors', blocks: [SUN, F('Warrior flow', ['warrior_one', 'warrior_two', 'ygStand', 'ygStand', 'ygStand?', 'ygStand?']), F('Floor & rest', ['ygHips', 'ygBack', 'ygRest', 'ygRest?'])] },
      strength: { label: 'Standing strength', short: 'Standing', blocks: [SUN, F('Standing strength', ['chair_pose', 'ygStand', 'ygBalance', 'ygStand', 'ygBalance?', 'ygStand?']), F('Core & rest', ['ygCore', 'ygCore', 'ygRest', 'ygRest?'])] },
      open: { label: 'Hips & backbends', short: 'Hips', blocks: [SUN, F('Hip flow', ['ygHips', 'ygHips', 'ygHips', 'ygHips?']), F('Backbends & rest', ['ygBack', 'ygBack', 'ygBack?', 'ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'yin-deep-stretch', added: 5, name: 'Yin & Deep Stretch', subject: 'Yoga', minutes: [30, 35], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Hips & legs / spine & shoulders', blurb: 'Long, quiet floor holds of two minutes and more that let the hips, legs and spine open slowly.',
    about: 'Long, quiet holds on the floor, two minutes or more each, to open hips, legs and spine. There is nothing to push: you settle into each shape and let time do the work. Days alternate between hips and legs, and spine and shoulders. Levels II and III lengthen the holds a little more each time. Good after hard training days, or in the evening.',
    names: ['Still Water', 'Moonlight', 'Low Tide', 'Deep Well', 'Quiet Pond', 'Dusk', 'Nightfall', 'Slow River', 'Mist', 'Lantern', 'Hush', 'Candle', 'Evening Tide', 'Stillness', 'Moss', 'Willow', 'Fern', 'Dew', 'Twilight', 'Calm Sea'],
    cycle: ['hips', 'spine'],
    dayTypes: {
      hips: { label: 'Hips & legs', short: 'Hips', blocks: [F('Hip holds', ['ygYinHips', 'ygYinHips', 'ygYinHips', 'ygYinHips', 'ygYinHips?', 'ygYinHips?'], { scale: 4, cap: 240, values: [1] }), F('Spine & rest', ['ygYinSpine', 'ygYinSpine?', 'ygRest?'], { scale: 3, cap: 240, values: [1] })] },
      spine: { label: 'Spine & shoulders', short: 'Spine', blocks: [F('Spine holds', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine', 'ygYinSpine', 'ygYinSpine?', 'ygYinSpine?'], { scale: 4, cap: 240, values: [1] }), F('Hips & rest', ['ygYinHips', 'ygYinHips?', 'ygRest?'], { scale: 3, cap: 240, values: [1] })] },
    },
  },
  {
    id: 'balance-flow', added: 5, name: 'Balance Flow', subject: 'Yoga', minutes: [28, 32], equip: 'bw', absSlots: [], levers: [null, 'holds', 'variation'],
    split: 'Standing balance / balance & core', blurb: 'One-leg yoga poses strung into flows: tree, warrior three, half moon and dancer.',
    about: 'One-leg poses strung into flows, for steadier ankles, hips and focus. Tree, warrior three, half moon and dancer come back often, between standing poses that rest the standing leg. One day adds floor work for the hips and the other adds core. Level II holds each pose longer and Level III brings harder versions. Near a wall is fine while you find your balance.',
    names: ['Tightrope', 'Heron', 'Flamingo', 'Crane', 'Keel', 'Plumb Line', 'Fulcrum', 'Pivot', 'Stilt', 'Level', 'Poise', 'Counterweight', 'Spirit Level', 'Driftwood', 'Beam', 'Perch', 'Gyroscope', 'Ballast', 'Pendulum', 'Equilibrium'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Standing balance', short: 'Balance', blocks: [SUN, F('Balance flow', ['tree_pose', 'warrior_three', 'ygBalance', 'ygStand', 'ygBalance?', 'ygStand?']), F('Floor & rest', ['ygHips', 'ygHips', 'ygRest', 'ygRest?'])] },
      b: { label: 'Balance & core', short: 'Core', blocks: [SUN, F('Balance flow', ['half_moon', 'dancer_pose', 'ygBalance', 'chair_pose', 'ygStand', 'ygStand?']), F('Core & rest', ['ygCore', 'ygCore', 'ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'core-yoga', added: 5, name: 'Core Yoga', subject: 'Yoga', minutes: [28, 32], equip: 'bw', absSlots: [], levers: [null, 'holds', 'variation'],
    split: 'Core flow A / core flow B', blurb: 'Yoga built around the core: boat, plank, side plank, dolphin and crow, between standing poses.',
    about: 'Yoga that builds the core: boat, plank, side plank, dolphin and crow held on the clock. Each session opens with sun salutations, spends its middle on core poses and closes with standing work and rest. Two days alternate with different core shapes. Level II holds longer and Level III moves to harder poses. The session is core work already, so there is no separate abs finisher.',
    names: ['Kindling', 'Hearth', 'Forge', 'Furnace', 'Firebrand', 'Tinder', 'Blaze', 'Cinder', 'Torch', 'Bonfire', 'Flint Spark', 'Kiln', 'Brazier', 'Coal', 'Flare', 'Beacon', 'Pilot Light', 'Wick', 'Smelter', 'Crucible'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Core flow A', short: 'A', blocks: [SUN, F('Core flow', ['boat_pose', 'plank', 'side_plank', 'ygCore', 'ygCore?']), F('Standing', ['ygStand', 'ygStand', 'ygBalance?']), F('Rest', ['ygRest', 'ygRest?'])] },
      b: { label: 'Core flow B', short: 'B', blocks: [SUN, F('Core flow', ['dolphin_pose', 'ygCore', 'ygCore', 'ygBack', 'ygCore?']), F('Standing', ['chair_pose', 'ygBalance', 'ygStand?']), F('Rest', ['ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'morning-25', added: 5, name: 'Morning 25', subject: 'Yoga', minutes: [23, 27], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Wake-up A / wake-up B', blurb: 'A short morning practice: cat-cow and salutations, a few standing poses, then something gentle on the floor.',
    about: 'A short practice for the start of the day, about twenty-five minutes. Cat-cow and sun salutations wake the spine, a few standing poses warm the legs, and a gentle floor pose ends it. Two versions alternate so mornings do not repeat. Levels II and III hold each pose a little longer. Good on its own or before a busy day.',
    names: ['Coffee', 'First Stretch', 'Open Window', 'Birdsong', 'Early Bus', 'Porch', 'Kettle On', 'Morning Paper', 'Sunny Side', 'Toast', 'Fresh Start', 'Rooster', 'Alarm Off', 'Slippers', 'Blinds Up', 'Dew Point', 'Daylight', 'Good Morning', 'Wake Up', 'New Day'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Wake-up A', short: 'A', blocks: [F('Wake-up', ['cat_cow', 'sun_salutation']), F('Standing', ['ygStand', 'ygStand', 'ygStand', 'ygBalance?']), F('Unwind', ['ygHips', 'ygRest?'])] },
      b: { label: 'Wake-up B', short: 'B', blocks: [F('Wake-up', ['cat_cow', 'sun_salutation']), F('Standing', ['chair_pose', 'ygStand', 'ygBalance', 'ygStand?']), F('Unwind', ['ygBack', 'ygRest?'])] },
    },
  },
  // ---------------- PILATES (Phase 5: mat work in reps, as guided flows; no abs finisher) ----------------
  {
    id: 'mat-foundations', added: 5, name: 'Mat Foundations', subject: 'Pilates', minutes: [25, 29], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Mat A / mat B', blurb: 'The Pilates mat basics, learned properly: the hundred, the abs series, spine work and side-lying legs.',
    about: 'The Pilates mat basics, learned slowly and properly. Each session starts with the hundred, then moves through the abs series, the spine and back, and side-lying leg work. Two versions alternate so you meet every foundation move within a few days. Levels II and III add a few reps each time. One Start runs each series and the voice names every exercise.',
    names: ['Pointe', 'Plumb', 'Centre', 'Core Line', 'Neutral', 'Imprint', 'Breath', 'Frame', 'Anchor Point', 'Stack', 'Length', 'Hinge Point', 'Scoop', 'Powerhouse', 'Axis', 'Spiral', 'Balance Point', 'Keystone Line', 'Precision', 'Flow Line'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Mat A', short: 'A', blocks: [F('Warm-up series', ['hundred', 'roll_up'], ONCE), F('Abs series', ['single_leg_stretch', 'double_leg_stretch', 'plAbs', 'plAbs?']), F('Spine & back', ['spine_stretch', 'swan', 'plBack', 'plRoll?']), F('Side & hips', ['plSide', 'plSide', 'plSide?', 'plGlute?'])] },
      b: { label: 'Mat B', short: 'B', blocks: [F('Warm-up series', ['hundred', 'spine_stretch'], ONCE), F('Abs series', ['scissors', 'criss_cross', 'plAbs', 'plAbs?']), F('Roll & balance', ['rolling_like_a_ball', 'plRoll', 'plRoll?']), F('Back & sides', ['swimming', 'plSide', 'plSide', 'plGlute?'])] },
    },
  },
  {
    id: 'classical-mat', added: 5, name: 'Classical Mat', subject: 'Pilates', minutes: [24, 29], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'The classical order / order with a focus', blurb: 'The classical mat order from the hundred to the seal, alternating with a day that focuses on part of it.',
    about: 'The classical Pilates mat order, from the hundred to the seal. One day runs the order itself, in two series; the other keeps the opening and closing and spends its middle on abs, rolling, back or sides. Moving from one exercise to the next without stopping is part of the method. Level II adds reps and Level III brings harder versions, like the teaser in place of the roll-up. Suits you once the basics feel familiar.',
    names: ['Opening', 'Contrology', 'Return', 'Elbow Room', 'Long Line', 'Gratz', 'Studio', 'Carriage', 'Spring', 'Tower', 'Reformer', 'Cadillac', 'Magic Circle', 'Barrel', 'Wunda', 'Classic', 'Heritage', 'Legacy', 'Repertoire', 'Encore'],
    cycle: ['order', 'focus'],
    dayTypes: {
      order: { label: 'The classical order', short: 'Order', blocks: [
        F('Classical order: part one', ['hundred', 'roll_up', 'single_leg_circles', 'rolling_like_a_ball', 'single_leg_stretch', 'double_leg_stretch', 'scissors', 'criss_cross']),
        F('Classical order: part two', ['spine_stretch', 'saw', 'swan', 'side_kick', 'teaser', 'swimming', 'leg_pull_front', 'seal'])] },
      focus: { label: 'Order with a focus', short: 'Focus', blocks: [F('Opening', ['hundred', 'roll_up', 'plAbs'], ONCE), F('Focus', ['plAbs', 'plRoll', 'plBack', 'plSide', 'plAbs', 'plRoll', 'plSide?', 'plBack?']), F('Closing', ['teaser', 'seal'], ONCE)] },
    },
  },
  {
    id: 'pilates-core-glutes', added: 5, name: 'Pilates Core & Glutes', subject: 'Pilates', minutes: [25, 29], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'Core day / glutes day', blurb: 'Pilates aimed at the two places it works best: the deep core, and the glutes and hips.',
    about: 'Pilates aimed at the deep core and at the glutes and hips. The core day stacks the abs series with rolling and spine work, and the glute day builds on bridges, side kicks and standing leg work. Each session opens with the hundred. Level II adds reps and Level III brings harder versions of the same moves. Good alongside strength training, or on its own.',
    names: ['Girdle', 'Corset', 'Keel Line', 'Saddle', 'Seat', 'Pelvis', 'Brace', 'Sling', 'Hammock', 'Cradle', 'Arch', 'Pier', 'Column', 'Pillar', 'Buttress Line', 'Foundation', 'Plinth Line', 'Base', 'Root', 'Trunk'],
    cycle: ['core', 'glutes'],
    dayTypes: {
      core: { label: 'Core', short: 'Core', blocks: [F('Warm-up', ['hundred', 'spine_stretch'], ONCE), F('Core series', ['plAbs', 'plAbs', 'plAbs', 'plRoll', 'plAbs?', 'plRoll?']), F('Glutes', ['plGlute', 'plGlute', 'plGlute', 'plSide?'])] },
      glutes: { label: 'Glutes & hips', short: 'Glutes', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Glute series', ['shoulder_bridge', 'side_kick', 'plGlute', 'plGlute', 'plSide?']), F('Core finish', ['plAbs', 'plAbs', 'plBack', 'plAbs?'])] },
    },
  },
  {
    id: 'standing-pilates', added: 5, name: 'Standing Pilates', subject: 'Pilates', minutes: [22, 26], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Standing A / standing B', blurb: 'Pilates on your feet: roll-downs, leg lifts, pliés and heel raises, with a short mat finish.',
    about: 'Pilates mostly on your feet, for balance, posture and legs. Roll-downs, front and side leg lifts, plié squats and heel raises make up the standing part, and a short mat series finishes each day. Two versions alternate between leg work and balance. Levels II and III add reps. Good when getting down on the floor for long is not appealing.',
    names: ['Barre', 'Relevé', 'Plié', 'Tendu', 'Passé', 'Arabesque', 'Port de Bras', 'Rond', 'Sous-sus', 'Glissade', 'Développé', 'Fondu', 'Frappé', 'Battement', 'Coupé', 'Échappé', 'Attitude', 'Balancé', 'Chassé', 'Révérence'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Standing legs', short: 'Legs', blocks: [F('Standing warm-up', ['standing_roll_down', 'heel_raise']), F('Standing legs', ['standing_leg_lift', 'standing_side_leg_lift', 'plie_squat']), F('Mat finish', ['plAbs', 'plAbs?', 'swan?'])] },
      b: { label: 'Standing balance', short: 'Balance', blocks: [F('Standing warm-up', ['standing_roll_down', 'plie_squat']), F('Standing balance', ['standing_side_leg_lift', 'standing_leg_lift', 'heel_raise']), F('Mat finish', ['plBack', 'plAbs?', 'spine_stretch?'])] },
    },
  },
  {
    id: 'pilates-power', added: 5, name: 'Pilates Power', subject: 'Pilates', minutes: [26, 31], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'Power A / power B', blurb: 'The harder end of the mat: teasers, leg pulls and seals, with long back and side series.',
    about: 'The harder end of the Pilates mat, built around the teaser, leg pulls and the seal. After the hundred and a roll-up or spine stretch, a power series works the abs hard, and a back and sides series finishes. Two days alternate with different power moves. Level II adds reps and Level III brings harder versions. Best once the classical order feels comfortable.',
    names: ['Voltage', 'Current Line', 'Spark Plug', 'Dynamo', 'Surge', 'Torque Line', 'Amplifier', 'Charge', 'Circuit Line', 'Watt', 'Joule', 'Pulse', 'Kinetic', 'Thrust', 'Momentum', 'Impulse', 'Drive', 'Force', 'Output', 'Peak Power'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Power A', short: 'A', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Power series', ['teaser', 'double_leg_stretch', 'criss_cross', 'leg_pull_front', 'plAbs', 'plRoll?']), F('Back & sides', ['swimming', 'side_kick', 'shoulder_bridge', 'plBack', 'plSide?'])] },
      b: { label: 'Power B', short: 'B', blocks: [F('Warm-up', ['hundred', 'spine_stretch'], ONCE), F('Power series', ['teaser', 'scissors', 'seal', 'leg_pull_front', 'plAbs', 'plRoll?']), F('Back & sides', ['swan', 'swimming', 'plSide', 'plSide', 'plBack?'])] },
    },
  },
  // ---------------- FLEXIBILITY (Phase 5: long stretches as guided flows; no abs finisher) ----------------
  {
    id: 'front-splits-60', added: 5, name: 'Front Splits 60', subject: 'Flexibility', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Hamstrings / hip flexors', blurb: 'Sixty days toward the front split: hamstring and hip-flexor stretches, and a supported split every session.',
    about: 'Sixty days of work toward the front split, one leg at a time. One day opens the hamstrings and the next the hip flexors and quads, and both end with a supported split held only as deep as it stays easy. Holds are long and the voice counts you through both sides. Levels II and III lengthen every hold. Never force the depth: books or blocks under the hands are fine.',
    names: ['Inch by Inch', 'Long Line', 'Tape Measure', 'Ruler', 'Stretch Mark', 'Slow Slide', 'Gap Closer', 'Floor Bound', 'Hinge Line', 'Reach', 'Extension', 'Lengthen', 'Glide', 'Low Road', 'Split Second', 'Half Way', 'Almost', 'Near Floor', 'Touchdown', 'Full Split'],
    cycle: ['ham', 'hip'],
    dayTypes: {
      ham: { label: 'Hamstrings', short: 'Ham', blocks: [F('Warm into it', ['cat_cow', 'forward_fold'], ONCE), F('Hamstrings', ['half_split', 'lying_hamstring', 'fxHam', 'fxHam?']), F('Split', ['front_split'], ONCE)] },
      hip: { label: 'Hip flexors & quads', short: 'Hips', blocks: [F('Warm into it', ['cat_cow', 'low_lunge'], ONCE), F('Hip flexors & quads', ['lizard_pose', 'kneeling_quad', 'fxQuad', 'fxQuad?']), F('Split', ['front_split'], ONCE)] },
    },
  },
  {
    id: 'pancake-straddle', added: 5, name: 'Pancake & Straddle', subject: 'Flexibility', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Straddle / hips & hamstrings', blurb: 'Wide-leg flexibility toward the pancake: straddles, frog, butterfly and wide folds.',
    about: 'Wide-leg flexibility toward the pancake, folding flat over a wide straddle. Sessions move through straddle side reaches, frog, butterfly and wide forward folds, with hamstring work on alternate days. Every session ends with a pancake held as deep as it stays easy. Levels II and III lengthen the holds. Patient work for inner thighs, hamstrings and hips.',
    names: ['Wingspan', 'Compass Legs', 'Open Road', 'Wide Angle', 'Horizon Line', 'Fan', 'Spread', 'Delta Wing', 'Kite', 'Starfish Pose', 'Broadside', 'Open Gate', 'Wide Berth', 'Panorama', 'Landscape', 'Sweep', 'Flatland', 'Plains', 'Tablecloth', 'Crepe'],
    cycle: ['straddle', 'ham'],
    dayTypes: {
      straddle: { label: 'Straddle', short: 'Straddle', blocks: [F('Warm into it', ['cat_cow', 'butterfly'], ONCE), F('Straddle', ['seated_straddle', 'frog_pose', 'fxStraddle', 'fxStraddle', 'fxHam?']), F('Pancake', ['pancake'], ONCE)] },
      ham: { label: 'Hips & hamstrings', short: 'Hips', blocks: [F('Warm into it', ['cat_cow', 'wide_leg_fold'], ONCE), F('Hips & hamstrings', ['fxHam', 'fxHips', 'fxHam', 'fxHips?']), F('Pancake', ['pancake'], ONCE)] },
    },
  },
  {
    id: 'hips-open', added: 5, name: 'Hips Open', subject: 'Flexibility', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Outer hips / inner hips & flexors', blurb: 'Long stretches for tight hips: pigeon, lizard, frog, figure four and deep squats.',
    about: 'Long stretches for hips that sit all day: pigeon, lizard, frog, figure four and a deep squat hold. One day works the outer hips and glutes, the next the inner thighs and hip flexors. A twist or two for the spine closes each session. Levels II and III lengthen every hold. Good on its own, or as a second session after leg training.',
    names: ['Unlock', 'Hinge Oil', 'Loosen', 'Unwind Hips', 'Release', 'Soft Knot', 'Untangle', 'Open Door', 'Swivel', 'Ball Joint', 'Socket', 'Pivot Joint', 'Free Range', 'Easy Going', 'Loose Thread', 'Ease', 'Slack', 'Sway', 'Rocking Chair', 'Hammock Hips'],
    cycle: ['outer', 'inner'],
    dayTypes: {
      outer: { label: 'Outer hips & glutes', short: 'Outer', blocks: [F('Warm into it', ['cat_cow', 'garland_pose'], ONCE), F('Outer hips', ['pigeon_pose', 'figure_four', 'fxHips', 'fxHips?']), F('Spine', ['fxSpine', 'fxSpine?'])] },
      inner: { label: 'Inner hips & flexors', short: 'Inner', blocks: [F('Warm into it', ['cat_cow', 'low_lunge'], ONCE), F('Inner hips & flexors', ['lizard_pose', 'frog_pose', 'fxStraddle', 'fxQuad?']), F('Spine', ['fxSpine', 'fxSpine?'])] },
    },
  },
  {
    id: 'upper-body-flex', added: 5, name: 'Upper-Body Flexibility', subject: 'Flexibility', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Shoulders & chest / back & spine', blurb: 'Stretches for shoulders, chest and upper back: thread the needle, cow face arms, puppy and more.',
    about: 'Stretches for the shoulders, chest and upper back, for the hunched posture of desks, phones and pressing work. One day opens the shoulders and chest, the next the back and spine with twists and gentle backbends. Sessions are short, around twenty minutes. Levels II and III lengthen every hold. Pairs well with the upper-body strength days.',
    names: ['Open Chest', 'Shoulder Roll', 'Wingback', 'Collarbone', 'Shoulder Blade', 'Posture Check', 'Unhunch', 'Tall Neck', 'Yoke', 'Wishbone', 'Coat Hanger', 'Open Arms', 'Hug', 'Reach Back', 'Scapula', 'Rib Cage', 'Breathing Room', 'Heart Open', 'Upright', 'Lifted'],
    cycle: ['shoulders', 'spine'],
    dayTypes: {
      shoulders: { label: 'Shoulders & chest', short: 'Shoulders', blocks: [F('Warm into it', ['cat_cow'], ONCE), F('Shoulders & chest', ['thread_the_needle', 'cow_face_arms', 'fxUpper', 'fxUpper', 'fxUpper?'], { scale: 2, cap: 90 })] },
      spine: { label: 'Back & spine', short: 'Spine', blocks: [F('Warm into it', ['cat_cow'], ONCE), F('Back & spine', ['puppy_pose', 'fxSpine', 'fxSpine', 'fxUpper', 'fxSpine?'], { scale: 2, cap: 90 })] },
    },
  },
  {
    id: 'full-body-stretch', added: 5, name: 'Full-Body Stretch', subject: 'Flexibility', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Lower body / upper body & spine', blurb: 'A full stretch session from feet to neck, alternating a lower-body and an upper-body emphasis.',
    about: 'A full stretch session from the feet to the neck, for recovery days or for general flexibility. Each session covers legs, hips, back and shoulders, with the emphasis alternating between lower body and upper body. Holds are long and one Start runs each sequence. Levels II and III lengthen the holds. Good at the end of the day, or after a hard week.',
    names: ['Unwind', 'Wind Down', 'Soft Landing', 'Rest Stop', 'Recovery', 'Reset', 'Sunday', 'Deep Breath', 'Exhale', 'Loosen Up', 'Stretch Out', 'Long Day', 'Evening', 'Slow Motion', 'Pause', 'Breathe', 'Settle', 'Easy', 'Lull', 'Peace'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Lower body emphasis', short: 'Lower', blocks: [F('Warm into it', ['cat_cow'], ONCE), F('Legs & hips', ['fxHam', 'fxHips', 'fxQuad', 'fxStraddle', 'fxHips?']), F('Upper & spine', ['fxUpper', 'fxSpine?'])] },
      upper: { label: 'Upper body emphasis', short: 'Upper', blocks: [F('Warm into it', ['cat_cow'], ONCE), F('Upper & spine', ['fxUpper', 'fxSpine', 'fxUpper', 'fxSpine?']), F('Legs & hips', ['fxHam', 'fxHips', 'fxQuad?'])] },
    },
  },
  // ---------------- MOBILITY & POSTURE (Phase 5: drills as flows and circuits; no abs finisher. Flow State is here too.) ----------------
  {
    id: 'desk-reset', added: 5, name: 'Desk Reset', subject: 'Mobility & posture', minutes: [14, 18], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Reset A / reset B', blurb: 'A quick reset for desk days: neck, shoulders, upper back and hips in about fifteen minutes.',
    about: 'A quick reset for days spent sitting: neck, shoulders, upper back and hips in about fifteen minutes. Chin tucks and shoulder circles undo the forward head, then spine rotations and hip drills undo the chair. Two versions alternate. Levels II and III add a few reps. Good at lunchtime, or whenever you get up from the desk.',
    names: ['Coffee Break', 'Stand Up', 'Log Off', 'Lunch Hour', 'Screen Break', 'Stretch Break', 'Out of Office', 'Recess', 'Timeout', 'Walkabout', 'Water Cooler', 'Window Seat', 'Standing Desk', 'Elevator', 'Stairwell', 'Hallway', 'Printer Run', 'Five Minutes', 'Deadline', 'Clock Out'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Reset A', short: 'A', blocks: [F('Neck & shoulders', ['chin_tucks', 'shoulder_cars', 'mbShoulder', 'mbShoulder?']), F('Spine & hips', ['mbSpine', 'mbHip', 'mbSpine?', 'mbHip?'])] },
      b: { label: 'Reset B', short: 'B', blocks: [F('Spine & hips', ['open_book', 'hip_cars', 'mbHip?', 'mbSpine?']), F('Neck & shoulders', ['wall_slides', 'mbShoulder', 'mbShoulder', 'mbShoulder?'])] },
    },
  },
  {
    id: 'better-posture', added: 5, name: 'Better Posture', subject: 'Mobility & posture', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Posture circuit A / B', blurb: 'Circuits for standing taller: wall slides, prone Y-T-W and chin tucks, then stretches that open the chest.',
    about: 'Circuits for standing taller: wall slides, prone Y-T-W and chin tucks strengthen the muscles that hold you upright. Each circuit is followed by a guided flow that opens the chest and upper back. Two days alternate the drills and stretches. Levels II and III add reps. Best done often, three or four times a week.',
    names: ['Plumb Line Posture', 'Tall Order', 'Upright Citizen', 'Straight Back', 'Head High', 'Chin Up', 'Shoulders Back', 'Stand Tall', 'Proud', 'Spine Line', 'Book on Head', 'Lamppost', 'Flagpole', 'Mast', 'Tower Posture', 'Obelisk', 'Lighthouse', 'Pine', 'Cypress', 'Column Posture'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Posture circuit A', short: 'A', blocks: [C('Posture circuit', ['wall_slides', 'prone_ytw', 'chin_tucks', 'mbPosture?'], { values: [2, 3, 4] }), F('Open up', ['open_book', 'reverse_prayer', 'fxUpper', 'fxUpper?'])] },
      b: { label: 'Posture circuit B', short: 'B', blocks: [C('Posture circuit', ['mbPosture', 'mbShoulder', 'mbPosture', 'mbSpine?'], { values: [2, 3, 4] }), F('Open up', ['mbSpine', 'fxUpper', 'fxUpper', 'fxSpine?'])] },
    },
  },
  {
    id: 'joint-health', added: 5, name: 'Joint Health', subject: 'Mobility & posture', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Joint circles / control', blurb: 'Slow, controlled joint circles for hips, shoulders, spine and ankles, and drills that own the range.',
    about: 'Slow, controlled joint circles for hips, shoulders, spine and ankles, done with full attention. A guided flow of circles comes first, then a circuit of drills that build control at the ends of your range: hip airplanes, 90/90 switches and Y-T-W. Two days alternate the emphasis. Levels II and III add reps. For joints that feel good years from now.',
    names: ['Hinge Grease', 'Oil Can', 'Ball Bearing', 'Swivel Joint', 'Knuckle', 'Axle', 'Gimbal', 'Cog', 'Pulley', 'Crank', 'Lever Arm', 'Spindle', 'Rotor Joint', 'Turntable', 'Carousel', 'Orbit', 'Wheel', 'Compass Rose', 'Clockwork', 'Tick Tock'],
    cycle: ['circles', 'control'],
    dayTypes: {
      circles: { label: 'Joint circles', short: 'Circles', blocks: [F('Joint circles', ['hip_cars', 'shoulder_cars', 'ankle_rocks', 'mbSpine', 'mbSpine?']), C('Control', ['hip_airplane', 'ninety_ninety', 'prone_ytw', 'mbHip?'], { values: [2, 3] })] },
      control: { label: 'Control', short: 'Control', blocks: [F('Joint circles', ['shoulder_cars', 'hip_cars', 'mbSpine', 'mbShoulder?']), C('Control', ['ninety_ninety', 'hip_airplane', 'wall_slides', 'deep_squat_hold?'], { values: [2, 3] })] },
    },
  },
  {
    id: 'squat-hinge-mobility', added: 5, name: 'Squat & Hinge Mobility', subject: 'Mobility & posture', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Squat day / hinge day', blurb: 'Mobility for a deeper squat and a better hinge: ankles, hips, hamstrings and spine.',
    about: 'Mobility for a deeper squat and a cleaner hinge. Ankle rocks, 90/90 switches and hip circles loosen what a squat needs, and a squat-and-hinge circuit with deep squat holds and bodyweight Jefferson curls grooves it. A hip and hamstring flow closes each session. Levels II and III add reps. Pairs well with the legs and kettlebell programs.',
    names: ['Deep Seat', 'Ass to Grass', 'Heel Down', 'Hip Crease', 'Hinge Line', 'Knees Out', 'Sit Back', 'Tall Spine', 'Brace', 'Groove', 'Pattern', 'Rep Quality', 'Full Depth', 'Bottom Position', 'Pause Squat', 'Good Morning', 'Fold', 'Unfold', 'Rise', 'Stand Strong'],
    cycle: ['squat', 'hinge'],
    dayTypes: {
      squat: { label: 'Squat', short: 'Squat', blocks: [F('Hips & ankles', ['ankle_rocks', 'ninety_ninety', 'hip_cars', 'mbHip?']), C('Squat & hinge', ['deep_squat_hold', 'jefferson_curl', 'hip_airplane', 'garland_pose?'], { values: [2, 3] }), F('Release', ['fxHips', 'fxHam?'])] },
      hinge: { label: 'Hinge', short: 'Hinge', blocks: [F('Hips & spine', ['hip_cars', 'mbSpine', 'ninety_ninety', 'mbHip?']), C('Hinge & squat', ['jefferson_curl', 'hip_airplane', 'deep_squat_hold', 'forward_fold?'], { values: [2, 3] }), F('Release', ['fxHam', 'fxHips?'])] },
    },
  },
  // ---------------- BALANCE & STABILITY (Phase 5: abs to finish) ----------------
  {
    id: 'steady', added: 5, name: 'Steady', subject: 'Balance & stability', minutes: [23, 28], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Balance A / balance B', blurb: 'Everyday balance: one-leg stands, reaches and slow single-leg strength, then abs.',
    about: 'Everyday balance for steadier feet and fewer wobbles. A circuit alternates still balance, like one-leg stands and heel-to-toe walking, with moving balance, like reaches and knee lifts. A little single-leg strength and abs follow. Level II adds reps and Level III brings harder variations. A wall nearby is always allowed.',
    names: ['Anchor', 'Keel Balance', 'Rudder', 'Level Ground', 'Even Keel', 'Poise Point', 'Centre Line', 'Rooted', 'Planted', 'Grounded', 'Sure Foot', 'Footing', 'Foothold', 'Tripod', 'Stance', 'Steady Hand', 'Still Point', 'Calm', 'Stable', 'Solid Ground'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Balance A', short: 'A', blocks: [C('Balance circuit', ['blStatic', 'blDynamic', 'blStatic', 'blDynamic?'], { values: [1, 2, 3, 4] }), S('Single-leg strength', ['blStrength', 'blStrength?'])] },
      b: { label: 'Balance B', short: 'B', blocks: [C('Balance circuit', ['blDynamic', 'blStatic', 'blDynamic', 'blStatic?'], { values: [1, 2, 3, 4] }), S('Single-leg strength', ['blStrength', 'blStrength?'])] },
    },
  },
  {
    id: 'single-leg-strength', added: 5, name: 'Single-Leg Strength', subject: 'Balance & stability', minutes: [28, 32], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Strength A / strength B', blurb: 'Balance through strength: pistol box squats, one-leg deadlifts and calf raises in straight sets.',
    about: 'Balance through strength: legs that are strong one at a time are steady ones. Pistol box squats, bodyweight single-leg deadlifts, calf raises and Copenhagen planks are done in straight sets, then a short balance circuit and abs. Level II adds reps and Level III brings harder variations. You need a chair for the box squats and the Copenhagen plank.',
    names: ['One Foot', 'Single File', 'Solo', 'Unilateral', 'Lone Pine', 'Flamingo Strength', 'Stork', 'Pogo', 'Monopod', 'Unicycle', 'Crutch-Free', 'Peg Leg', 'Standalone', 'Independent', 'On Your Own', 'Self-Reliant', 'Free Standing', 'Single Track', 'Sole', 'Uno'],
    gear: 'A sturdy chair for box squats and Copenhagen planks.',
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Squat & calf', short: 'A', blocks: [S('Single-leg strength', ['pistol_box_squat', 'single_leg_rdl_bw', 'blStrength', 'blStrength?']), C('Balance', ['blDynamic', 'blStatic'], { values: [2, 3] })] },
      b: { label: 'Hinge & hips', short: 'B', blocks: [S('Single-leg strength', ['single_leg_rdl_bw', 'lunge_to_balance', 'copenhagen_plank', 'blStrength?']), C('Balance', ['blStatic', 'blDynamic'], { values: [2, 3] })] },
    },
  },
  {
    id: 'ankle-and-knee', added: 5, name: 'Ankle & Knee', subject: 'Balance & stability', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Ankles / knees', blurb: 'Resilient ankles and knees: calf raises, ankle rocks, heel-to-toe walks and controlled landings.',
    about: 'Stronger, steadier ankles and knees, for running, jumping or just stairs. A circuit of single-leg calf raises, ankle rocks, heel-to-toe walks and small hops builds the ankle, and knee-control work like lunges to knee drive and box squats follows. Abs finish the session. Levels II and III add reps. Good after a sprain has healed, with your physio\'s blessing.',
    names: ['Spring Step', 'Achilles', 'Arch', 'Heel Cord', 'Ball of Foot', 'Kneecap', 'Hinge Knee', 'Tendon', 'Ligament', 'Joint Guard', 'Ankle Brace', 'Knee Pad', 'Sprung Floor', 'Trampoline', 'Stairwell Climb', 'Hill Walk', 'Trail', 'Cobblestone', 'Uneven Ground', 'Sure Step'],
    cycle: ['ankle', 'knee'],
    dayTypes: {
      ankle: { label: 'Ankles', short: 'Ankles', blocks: [C('Ankles', ['single_leg_calf_raise', 'ankle_rocks', 'heel_to_toe_walk', 'single_leg_hop_stick?'], { values: [1, 2, 3, 4] }), S('Knee control', ['lunge_to_balance', 'blDynamic', 'blDynamic?'])] },
      knee: { label: 'Knees', short: 'Knees', blocks: [C('Landings', ['single_leg_hop_stick', 'star_excursion', 'single_leg_calf_raise', 'blStatic?'], { values: [1, 2, 3, 4] }), S('Knee control', ['pistol_box_squat', 'lunge_to_balance', 'blDynamic?'])] },
    },
  },
  {
    id: 'athletic-balance', added: 5, name: 'Athletic Balance', subject: 'Balance & stability', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Hops & sticks / bounds & strength', blurb: 'Balance for sport: hops and sticks, lateral bounds, and single-leg strength.',
    about: 'Balance for sport and quick feet: hops and sticks, lateral bounds and star reaches, all about landing still. Single-leg strength follows so the landings have something behind them, then abs. Two days alternate the jumps. Levels II and III add reps. Land softly, and stop the set when landings get sloppy.',
    names: ['Quick Feet', 'Agility', 'Cut', 'Juke', 'Side Step', 'Crossover', 'Break Point', 'Rebound', 'Pounce', 'Leap', 'Spring', 'Bound', 'Stick It', 'Landing', 'Touchdown Balance', 'Pivot Foot', 'Footwork Line', 'Change of Pace', 'Fast Twitch', 'Reaction'],
    cycle: ['hops', 'bounds'],
    dayTypes: {
      hops: { label: 'Hops & sticks', short: 'Hops', blocks: [C('Hops & sticks', ['single_leg_hop_stick', 'star_excursion', 'blPower?'], { values: [2, 3, 4] }), S('Strength', ['blStrength', 'blStrength', 'blDynamic?'])] },
      bounds: { label: 'Bounds & strength', short: 'Bounds', blocks: [C('Bounds', ['lateral_bound_hold', 'single_leg_hop_stick', 'blPower?'], { values: [2, 3, 4] }), S('Strength', ['blStrength', 'blStrength', 'blDynamic?'])] },
    },
  },
  {
    id: 'balance-and-core', added: 5, name: 'Balance & Core', subject: 'Balance & stability', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Balance & core A / B', blurb: 'Balance work and core stability together: one-leg drills, Copenhagen planks and anti-rotation holds.',
    about: 'Balance and core stability together, since each helps the other. A balance circuit comes first, then a core-stability circuit with Copenhagen planks, planks and anti-rotation work, then abs. Two days alternate the drills. Level II adds reps and Level III brings harder variations. You need a chair for the Copenhagen plank.',
    names: ['Plumb Core', 'Axis Point', 'Spine of Steel', 'Trunk Line', 'Midline', 'Brace Point', 'Iron Belt', 'Keel Core', 'Gyro', 'Spinning Top', 'Compass Needle', 'True North Core', 'Balance Beam', 'High Wire', 'Slackline', 'Stepping Stone', 'River Rock', 'Driftwood Core', 'Surfboard', 'Paddleboard'],
    gear: 'A sturdy chair for the Copenhagen plank.',
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Balance & core A', short: 'A', blocks: [C('Balance', ['blStatic', 'blDynamic', 'blStatic?'], { values: [2, 3] }), C('Core stability', ['copenhagen_plank', 'core', 'core', 'core?'], { values: [2, 3] })] },
      b: { label: 'Balance & core B', short: 'B', blocks: [C('Balance', ['blDynamic', 'blStatic', 'blDynamic?'], { values: [2, 3] }), C('Core stability', ['core', 'copenhagen_plank', 'core', 'core?'], { values: [2, 3] })] },
    },
  },
  // ---------------- MORE CORE & ABS (Phase 5) ----------------
  // catalogue: 5 on the core programs: their abs finishers draw on the new core moves too
  {
    id: 'core-circuits', added: 5, catalogue: 5, name: 'Core Circuits', subject: 'Core & abs', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Circuit A / circuit B', blurb: 'Core circuits with no rest between moves: planks, twists, climbers and hollow work.',
    about: 'Core circuits with no rest between moves: plank variations, rotations, climbers and hollow work, round after round. Two circuits alternate, each followed by the usual abs finisher. No equipment needed. Level II adds reps and Level III brings harder variations. Quick, sweaty core training.',
    names: ['Six Pack', 'Washboard', 'Midsection', 'Belt Line', 'Waistband', 'Center Mass', 'Hub', 'Pivot Core', 'Axle Core', 'Nucleus', 'Epicenter', 'Bullseye', 'Heart of It', 'Kernel', 'Pith', 'Marrow', 'Crux', 'Focal Point', 'Middle Ground', 'Core Temperature'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Core circuit', ['coreAnti', 'coreRot', 'coreHollow', 'core2', 'coreRot?'], { values: [2, 3, 4] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Core circuit', ['coreHollow', 'coreAnti', 'coreRot', 'core2', 'coreAnti?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'hollow-body', added: 5, catalogue: 5, name: 'Hollow Body', subject: 'Core & abs', minutes: [25, 30], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Hollow / anti-extension', blurb: 'Gymnastics-style core: hollow holds and rocks, V-ups, dragon flag negatives and body saws.',
    about: 'Gymnastics-style core strength: hollow holds and rocks, V-ups, dragon flag negatives and body saws. Slow straight sets build the shape that gymnasts and climbers rely on, with an abs finisher to close. Two days alternate hollow work with anti-extension planks. Level II adds reps and Level III brings harder variations. For a core that stays rigid when it counts.',
    names: ['Banana', 'Arch', 'Hollow Man', 'Tuck', 'Pike Position', 'Straddle Core', 'Tension', 'Rigid', 'Plank of Steel', 'Iron Board', 'Rafter', 'Joist', 'Truss', 'Cantilever', 'Suspension Core', 'Tightrope Core', 'Handstand Base', 'Rings Core', 'Parallel Bars', 'Floor Routine'],
    cycle: ['hollow', 'anti'],
    dayTypes: {
      hollow: { label: 'Hollow', short: 'Hollow', blocks: [S('Hollow body', ['hollow_hold', 'coreHollow', 'dragon_flag_negative', 'coreHollow', 'coreAnti?'])] },
      anti: { label: 'Anti-extension', short: 'Anti', blocks: [S('Anti-extension', ['body_saw', 'coreAnti', 'plank_walkout', 'coreAnti', 'coreHollow?'])] },
    },
  },
  {
    id: 'twist-and-brace', added: 5, catalogue: 5, name: 'Twist & Brace', subject: 'Core & abs', minutes: [25, 30], levers: [null, 'reps', 'weight'],
    split: 'Rotate / resist', blurb: 'Obliques and anti-rotation: windshield wipers, side plank dips, halos and carries.',
    about: 'The sides of the core: obliques that rotate, and deep muscles that resist rotation. One day twists with windshield wipers, heel taps and side plank dips, the other resists with carries, halos and plank reaches. Straight sets with an abs finisher. Level II adds reps and Level III moves you one weight up where there is a weight. Good for any sport that swings or throws.',
    names: ['Corkscrew', 'Spiral Staircase', 'Helix', 'Twister', 'Wringer', 'Torque Core', 'Crank Core', 'Turnstile', 'Revolving Door', 'Spin Cycle', 'Rotor Core', 'Pinwheel', 'Swivel Chair', 'Lazy Susan', 'Merry-Go-Round', 'Whirligig', 'Spinning Wheel', 'Yo-Yo Core', 'Drill Bit', 'Screwdriver'],
    cycle: ['rotate', 'resist'],
    dayTypes: {
      rotate: { label: 'Rotate', short: 'Rotate', blocks: [S('Rotate', ['windshield_wipers', 'coreRot', 'side_plank_dip', 'coreRot', 'russian_twist?'])] },
      resist: { label: 'Resist', short: 'Resist', blocks: [S('Resist', ['suitcase_march', 'kb_halo', 'plank_reach', 'coreAnti', 'carry?'])] },
    },
  },
  {
    id: 'abs-15', added: 5, catalogue: 5, name: 'Abs 15', subject: 'Core & abs', minutes: [13, 17], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Abs A / abs B', blurb: 'Fifteen minutes of abs, most days: a short circuit and the finisher, no equipment.',
    about: 'Fifteen minutes of abs you can fit into most days. A short core circuit is followed by the abs finisher, with no equipment and no setup. Two versions alternate so it never feels like the same session. Levels II and III add reps. Good on top of a walk, a run or another program.',
    names: ['Quarter Hour', 'Coffee Abs', 'Quick Core', 'Brief', 'Snapshot', 'Short Order', 'Espresso', 'Flash', 'Micro', 'Pocket', 'Mini', 'Bite Size', 'Express Abs', 'Quickie', 'Five Three', 'Rapid Core', 'Short Stack', 'Pit Stop', 'Commercial Break', 'Halftime'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Abs A', short: 'A', blocks: [C('Core circuit', ['coreHollow', 'coreRot', 'coreAnti'], { values: [1, 2, 3] })] },
      b: { label: 'Abs B', short: 'B', blocks: [C('Core circuit', ['coreAnti', 'coreHollow', 'coreRot'], { values: [1, 2, 3] })] },
    },
  },
  // ---------------- PHASE 14: a sixth program for each five-program subject (catalogue 8) ----------------
  {
    id: 'power-vinyasa', added: 14, catalogue: 8, name: 'Power Vinyasa', subject: 'Yoga', minutes: [32, 37], equip: 'bw', absSlots: [], levers: [null, 'variation', 'variation'],
    split: 'Power / twists / backbends', blurb: 'A strong, sweaty yoga practice: long standing flows, twists and backbends, with harder poses each level.',
    about: 'A strong yoga practice that keeps moving: salutations, then long standing flows held on the clock. Three days rotate a power flow with balances, a twisting day and a backbend day, each closing with core and rest. Both later levels bring harder poses rather than longer holds, so Level III looks different from Level I. About thirty-five minutes, no equipment.',
    names: ['Ignite', 'Charge', 'Momentum', 'Surge', 'Velocity', 'Updraft', 'Thrust', 'Kinetic', 'Drive', 'Torque', 'Pulse', 'Current', 'Voltage', 'Lift-off', 'Spiral', 'Whirl', 'Arc', 'Bridgework', 'Crescent', 'Summit'],
    cycle: ['power', 'twist', 'back'],
    dayTypes: {
      power: { label: 'Power flow', short: 'Power', blocks: [SUN, F('Power flow', ['chair_pose', 'ygStand', 'ygStand', 'ygBalance', 'ygStand', 'ygStand?']), F('Core', ['ygCore', 'ygCore', 'ygCore?']), F('Rest', ['ygRest', 'ygRest?'])] },
      twist: { label: 'Twists', short: 'Twists', blocks: [SUN, F('Twisting flow', ['twisting_chair', 'ygStand', 'seated_twist', 'ygStand', 'ygHips', 'ygStand?']), F('Core', ['ygCore', 'ygCore?']), F('Rest', ['supine_twist', 'ygRest?'])] },
      back: { label: 'Backbends', short: 'Back', blocks: [SUN, F('Standing', ['high_lunge', 'ygStand', 'ygBalance', 'ygStand?']), F('Backbends', ['ygBack', 'ygBack', 'camel_pose', 'ygBack?']), F('Rest', ['childs_pose', 'ygRest?'])] },
    },
  },
  {
    id: 'pilates-sculpt', added: 14, catalogue: 8, name: 'Pilates Sculpt', subject: 'Pilates', minutes: [24, 29], equip: 'bw', absSlots: [], levers: [null, 'variation', 'reps'],
    split: 'Abs / glutes & legs / back & sides', blurb: 'Pilates mat work in three focused days: abs, then glutes and legs, then back and sides.',
    about: 'Pilates mat work split into three focused days instead of the whole series every time. The abs day goes deep on the hundred and the stretches, the glutes day works side kicks, bridges and standing legs, and the back day strengthens with swan, swimming and leg pulls. Level II brings harder versions first and Level III adds reps on top. Every session opens with the hundred and a roll-up. No equipment beyond a mat.',
    names: ['Chisel', 'Contour', 'Silhouette', 'Outline', 'Sketch', 'Relief', 'Etching', 'Carve', 'Profile', 'Statue', 'Plaster', 'Marble Line', 'Clay', 'Bronze', 'Facet', 'Lathe', 'Mould', 'Stencil', 'Engrave', 'Cameo'],
    cycle: ['abs', 'glutes', 'back'],
    dayTypes: {
      abs: { label: 'Abs', short: 'Abs', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Abs series', ['single_leg_stretch', 'double_leg_stretch', 'scissors', 'criss_cross', 'plAbs', 'plAbs', 'plRoll?']), F('Roll & back', ['plRoll', 'plBack', 'plRoll', 'spine_stretch?'])] },
      glutes: { label: 'Glutes & legs', short: 'Glutes', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Glutes & legs', ['side_kick', 'shoulder_bridge', 'plGlute', 'standing_side_leg_lift', 'plie_squat', 'plGlute?']), F('Abs', ['plAbs', 'plAbs?'])] },
      back: { label: 'Back & sides', short: 'Back', blocks: [F('Warm-up', ['hundred', 'spine_stretch'], ONCE), F('Back & sides', ['swan', 'swimming', 'leg_pull_front', 'plSide', 'plBack', 'plSide', 'plSide?']), F('Abs', ['plAbs', 'plAbs', 'plRoll?'])] },
    },
  },
  {
    id: 'daily-stretch-15', added: 14, catalogue: 8, name: 'Daily Stretch 15', subject: 'Flexibility', minutes: [12, 17], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Legs / shoulders / spine', blurb: 'Fifteen minutes of stretching you can do every day: legs, then shoulders, then spine, in turn.',
    about: 'A short stretch for every day, about fifteen minutes, so it fits before bed or after training. Three days take turns: legs and hips, shoulders and chest, then the spine. Each is one calm flow of held stretches that the voice walks you through. Levels II and III hold each stretch a little longer. Small and often beats long and rare for flexibility.',
    names: ['Unwind', 'Loosen', 'Ease', 'Lengthen', 'Release', 'Soften', 'Breathe Out', 'Slacken', 'Settle', 'Melt', 'Drift', 'Let Go', 'Exhale', 'Unfurl', 'Unknot', 'Limber', 'Supple', 'Pliant', 'Elastic', 'Bend'],
    cycle: ['legs', 'upper', 'spine'],
    dayTypes: {
      legs: { label: 'Legs & hips', short: 'Legs', blocks: [F('Legs & hips', ['fxHam', 'fxHips', 'fxQuad', 'fxHam', 'fxHips?'])] },
      upper: { label: 'Shoulders & chest', short: 'Upper', blocks: [F('Shoulders & chest', ['fxUpper', 'fxUpper', 'fxUpper', 'fxUpper?', 'fxSpine?'])] },
      spine: { label: 'Spine', short: 'Spine', blocks: [F('Spine', ['cat_cow', 'fxSpine', 'fxSpine', 'fxSpine', 'fxHips?'])] },
    },
  },
  {
    id: 'balance-emom', added: 14, catalogue: 8, name: 'Balance EMOM', subject: 'Balance & stability', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'EMOM A / EMOM B', blurb: 'Balance on the clock: a new one-leg drill every minute, then slow single-leg strength and abs.',
    about: 'Balance work on the clock: every minute a new one-leg drill starts, and you rest for whatever is left of the minute. The drills rotate reaches, hops and sticks, and single-leg strength, so both legs work in turn. A short block of slow single-leg strength and abs finish each session. Levels II and III add reps, so the rest in each minute gets shorter. Good for runners and anyone who plays sport.',
    names: ['Second Hand', 'Metronome', 'Ticker', 'Chime', 'Minute Man', 'Sundial', 'Hourglass', 'Cuckoo', 'Big Ben', 'Escapement', 'Pendulum Swing', 'Tock', 'Quartz', 'Balance Wheel', 'Mainspring', 'Clockwork', 'Dial', 'Interval', 'Lap', 'Beat'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('Balance EMOM', ['blDynamic', 'blStrength', 'blPower', 'blDynamic'], { values: [8, 10, 12, 14] }), S('Single-leg strength', ['blStrength', 'blStrength?'])] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('Balance EMOM', ['blPower', 'blDynamic', 'blStrength', 'blStatic'], { values: [8, 10, 12, 14] }), S('Single-leg strength', ['blStrength', 'blStrength?'])] },
    },
  },
  {
    id: 'mobility-flow', added: 14, catalogue: 8, name: 'Mobility Flow', subject: 'Mobility & posture', minutes: [24, 29], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Hips / shoulders / spine', blurb: 'Longer mobility sessions in three days: hips, shoulders and spine, each a long guided flow.',
    about: 'A longer mobility practice, twenty-five minutes or so, for when a quick reset is not enough. Three days take one area each, hips, shoulders and spine, in a long guided flow followed by a shorter one for the rest of the body. Moves are slow joint circles and drills that own the range, not just stretches. Levels II and III add reps to each move. Good on rest days or as a weekly service for stiff joints.',
    names: ['Hinge', 'Swivel', 'Axle', 'Ball Joint', 'Gimbal', 'Pivot Point', 'Socket', 'Bearing', 'Spindle', 'Rotor', 'Knuckle', 'Universal', 'Castor', 'Trunnion', 'Bushing', 'Grease', 'Oil Can', 'Tune-up', 'Service', 'Overhaul'],
    cycle: ['hips', 'shoulders', 'spine'],
    dayTypes: {
      hips: { label: 'Hips', short: 'Hips', blocks: [F('Hip flow', ['hip_cars', 'mbHip', 'mbHip', 'ninety_ninety', 'mbHip', 'mbHip?']), F('Spine & shoulders', ['mbSpine', 'mbShoulder', 'mbSpine?'])] },
      shoulders: { label: 'Shoulders', short: 'Shoulders', blocks: [F('Shoulder flow', ['shoulder_cars', 'mbShoulder', 'mbShoulder', 'wall_slides', 'mbPosture', 'mbShoulder?']), F('Hips & spine', ['mbHip', 'mbSpine', 'mbHip', 'mbSpine?'])] },
      spine: { label: 'Spine', short: 'Spine', blocks: [F('Spine flow', ['cat_cow', 'mbSpine', 'mbSpine', 'open_book', 'mbPosture', 'mbSpine?']), F('Hips & shoulders', ['mbHip', 'mbShoulder', 'mbHip?'])] },
    },
  },
  // ---------------- PHASE 14: GENTLE / LOW IMPACT (no jumping, no floor-to-standing scrambles; no abs finisher) ----------------
  {
    id: 'gentle-start', added: 14, catalogue: 8, name: 'Gentle Start', subject: 'Gentle / low impact', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    gear: 'A chair and a clear bit of wall.',
    split: 'Circuit A / circuit B', blurb: 'Easy-going strength circuits with a chair and a wall, then a gentle stretch. A kind way back in.',
    about: 'A kind way into exercise, or back into it after a break. Each session is a relaxed circuit of sit-to-stands, wall push-ups, bridges and bird dogs, at your own pace with a breather between rounds, then a gentle stretch. Nothing jumps and nothing hurries. Levels II and III add a few reps to each move. Twenty minutes or so.',
    names: ['Sunday Morning', 'Easy Does It', 'First Steps', 'Fresh Air', 'Cup of Tea', 'Front Garden', 'Window Seat', 'Armchair', 'Slow Lane', 'Gentle Breeze', 'Afternoon Light', 'Warm Socks', 'Porch Swing', 'Rocking Chair', 'Footpath', 'Park Bench', 'Duck Pond', 'Blue Sky', 'Daisy', 'Primrose'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Gentle circuit', ['sit_to_stand', 'wall_pushup', 'glute_bridge', 'gentleStrength?'], { values: [2, 3, 4] }), F('Stretch', ['backMove', 'backMove', 'backMove', 'backMove?'])] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Gentle circuit', ['gentleStrength', 'bird_dog', 'gentleStrength', 'gentleStrength?'], { values: [2, 3, 4] }), F('Stretch', ['backMove', 'backMove', 'backMove', 'backMove?'])] },
    },
  },
  {
    id: 'chair-and-wall', added: 14, catalogue: 8, name: 'Chair & Wall', subject: 'Gentle / low impact', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'tempo'],
    gear: 'A sturdy chair and a wall.',
    split: 'Legs / upper & core', blurb: 'Simple strength with a chair and a wall, in straight sets with full rests: legs one day, upper body and core the next.',
    about: 'Simple, steady strength using only a chair and a wall. One day trains the legs with sit-to-stands, calf raises, clamshells and bridges; the other trains the upper body and core with wall push-ups, bird dogs and side planks from the knees. Straight sets with full rests, so every rep is done well. Level II adds reps and Level III slows every rep down.',
    names: ['Oak Chair', 'Pine Table', 'Brick Wall', 'Garden Wall', 'Stone Step', 'Banister', 'Doorframe', 'Windowsill', 'Hallway', 'Landing', 'Kitchen Chair', 'Dining Room', 'Front Door', 'Back Step', 'Mantelpiece', 'Bookshelf', 'Hearth', 'Skirting', 'Picture Rail', 'Dado'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['sit_to_stand', 'heel_raise', 'clamshell', 'glute_bridge', 'gentleStrength?'])] },
      upper: { label: 'Upper & core', short: 'Upper', blocks: [S('Upper & core', ['wall_pushup', 'bird_dog', 'side_plank_knee', 'dead_bug', 'gentleStrength?'])] },
    },
  },
  {
    id: 'low-impact-cardio', added: 14, catalogue: 8, name: 'Low-Impact Cardio', subject: 'Gentle / low impact', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Intervals A / B', blurb: 'Cardio without the jumping: marching, step touches and arm drives on the minute, kind to knees and neighbours.',
    about: 'Cardio that gets the heart going without a single jump. Each minute starts a block of marching, step touches, arm drives or sit-to-stands, and you rest for whatever is left of it. Pick the pace that feels like hard work for you. A short stretch closes each session. Levels II and III add time to each move, so the rests get shorter.',
    names: ['Quickstep', 'Foxtrot', 'Two-step', 'Line Dance', 'Shuffle Step', 'Marching Band', 'Parade', 'Promenade', 'Stroll', 'Saunter', 'Amble', 'Stride Out', 'Brisk Walk', 'Power Walk', 'Hike', 'Ramble', 'Wander', 'Trek', 'Pace', 'Rhythm'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Intervals A', short: 'A', blocks: [E('Low-impact EMOM', ['standing_march', 'gentleCardio', 'step_touch', 'gentleCardio'], { values: [10, 12, 14, 16] }), F('Stretch', ['backMove', 'backMove?'])] },
      b: { label: 'Intervals B', short: 'B', blocks: [E('Low-impact EMOM', ['step_touch', 'gentleCardio', 'arm_drive', 'gentleCardio'], { values: [10, 12, 14, 16] }), F('Stretch', ['backMove', 'backMove?'])] },
    },
  },
  {
    id: 'move-daily', added: 14, catalogue: 8, name: 'Move Daily', subject: 'Gentle / low impact', minutes: [13, 17], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Morning / evening', blurb: 'Fifteen gentle minutes for every day: a morning flow to wake up, an evening one to wind down.',
    about: 'Fifteen gentle minutes for every day, guided by the voice. The morning flow wakes the body with marching, cat-cow, sit-to-stands and arm circles. The evening flow winds down with pelvic tilts, knee hugs, twists and child\'s pose on the floor. Do one or both. Levels II and III add a few reps and seconds to each move.',
    names: ['Sunrise Walk', 'Dewdrop', 'Birdsong Hour', 'Lark', 'Robin', 'Wren', 'Blackbird', 'Sparrow', 'Nightingale', 'Owl Light', 'Moonrise', 'Lamplight', 'Starlight', 'Candlelight', 'Firefly', 'Glow-worm', 'Dusk Walk', 'Bedtime', 'Lullaby', 'Goodnight'],
    cycle: ['morning', 'evening'],
    dayTypes: {
      morning: { label: 'Morning', short: 'AM', blocks: [F('Morning flow', ['standing_march', 'cat_cow', 'sit_to_stand', 'arm_drive', 'step_touch', 'gentleStrength', 'gentleCardio', 'gentleStrength?'])] },
      evening: { label: 'Evening', short: 'PM', blocks: [F('Evening flow', ['pelvic_tilt', 'knee_hug', 'backMove', 'backMove', 'childs_pose', 'backMove?'])] },
    },
  },
  {
    id: 'strong-and-steady', added: 14, catalogue: 8, name: 'Strong & Steady', subject: 'Gentle / low impact', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    gear: 'A chair or a wall to hold for balance.',
    split: 'Legs & balance A / B', blurb: 'Steadier on your feet: simple leg strength and balance practice, holding a chair or wall at first.',
    about: 'Leg strength and balance for feeling steady on your feet, on stairs and on uneven ground. Each session pairs simple leg moves, sit-to-stands, calf raises and bridges, with balance practice such as one-leg stands and heel-to-toe walking. Hold a chair or a wall until you do not need it. Level II adds reps and Level III brings slightly harder versions.',
    names: ['Sure Foot', 'Steady Hand', 'Solid Ground', 'Firm Footing', 'Level Path', 'Stepping Stone', 'Handrail', 'Garden Path', 'Cobbles', 'Kerbside', 'Stairwell', 'Footbridge', 'Stile', 'Boardwalk', 'Pier', 'Jetty', 'Towpath Walk', 'Hillside', 'Meadow', 'Orchard'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Legs & balance A', short: 'A', blocks: [S('Legs', ['sit_to_stand', 'heel_raise', 'glute_bridge?']), C('Balance', ['gentleBalance', 'gentleBalance', 'gentleBalance?'], { values: [2, 3] })] },
      b: { label: 'Legs & balance B', short: 'B', blocks: [S('Legs', ['sit_to_stand', 'clamshell', 'single_leg_calf_raise?']), C('Balance', ['gentleBalance', 'gentleBalance', 'gentleBalance?'], { values: [2, 3] })] },
    },
  },
  // ---------------- PHASE 14: BACK CARE (gentle strength and movement for the lower back; no abs finisher) ----------------
  {
    id: 'back-basics', added: 14, catalogue: 8, name: 'Back Basics', subject: 'Back care', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Big three / movement', blurb: 'The core work back specialists recommend: curl-ups, side planks and bird dogs, then gentle movement.',
    about: 'A steady routine for a back that likes to complain. One day is the big three that back specialists recommend, McGill curl-ups, side planks from the knees and bird dogs, done slowly for the endurance that holds the spine steady. The other day is gentle movement: pelvic tilts, cat-cow and prone press-ups. Levels II and III add reps. If anything sharpens pain, stop and check with a professional.',
    names: ['Spine Line', 'Lumbar', 'Sacrum', 'Disc', 'Vertebra', 'Coccyx', 'Lordosis', 'Neutral', 'Brace Up', 'Hold Fast', 'Root', 'Trunk', 'Pillar Strength', 'Keystone', 'Lintel', 'Joist', 'Beam Strength', 'Truss', 'Strut', 'Buttress'],
    cycle: ['big3', 'move'],
    dayTypes: {
      big3: { label: 'Big three', short: 'Big 3', blocks: [S('The big three', ['mcgill_curl_up', 'side_plank_knee', 'bird_dog', 'backStrength?']), F('Unwind', ['backMove', 'backMove?'])] },
      move: { label: 'Movement', short: 'Move', blocks: [F('Back movement', ['pelvic_tilt', 'cat_cow', 'prone_press_up', 'backMove', 'backMove', 'backMove?']), C('Hips', ['glute_bridge', 'clamshell'], { values: [2, 3] })] },
    },
  },
  {
    id: 'back-flow', added: 14, catalogue: 8, name: 'Back Flow', subject: 'Back care', minutes: [13, 17], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Flow A / flow B', blurb: 'Fifteen minutes of guided back movement: tilts, press-ups, twists and stretches, for stiff days.',
    about: 'Fifteen minutes of gentle, guided movement for a stiff back. Each flow moves the spine every way it bends, forward, back, sideways and round, with pelvic tilts, prone press-ups, open books and twists, held and repeated slowly. Two flows alternate. Levels II and III add a few reps and seconds. Good first thing in the morning or after a long day sitting.',
    names: ['Unbend', 'Stretch Out', 'Uncurl', 'Easy Back', 'Loose Spine', 'Bend Easy', 'Soft Spine', 'Rested', 'Rolled Out', 'Unwound', 'Smooth', 'Supple Back', 'Wave', 'Ebb', 'Flow Back', 'Ripple Back', 'Tidal', 'Swaying', 'Willow Back', 'Reed'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Flow A', short: 'A', blocks: [F('Back flow', ['pelvic_tilt', 'cat_cow', 'prone_press_up', 'open_book', 'backMove', 'backMove?'])] },
      b: { label: 'Flow B', short: 'B', blocks: [F('Back flow', ['cat_cow', 'pelvic_tilt', 'sphinx_pose', 'supine_twist', 'backMove', 'backMove?'])] },
    },
  },
  {
    id: 'strong-back', added: 14, catalogue: 8, name: 'Strong Back', subject: 'Back care', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'reps', 'tempo'],
    split: 'Glutes & core / back & hips', blurb: 'Strength that protects the back: glutes, trunk and upper back in straight sets, slow and controlled.',
    about: 'Strength that protects the back, built slowly. One day trains the glutes and trunk with bridges, clamshells, curl-ups and side planks; the other the back and hips with bird dogs, supermans and Y-T-W raises. Straight sets with full rests, every rep controlled. Level II adds reps and Level III slows the reps down. Stop if anything sharpens pain.',
    names: ['Backbone Strong', 'Upright Life', 'Stand Up', 'Carry On', 'Lift Safe', 'Bend Well', 'Hinge Right', 'Posture Plus', 'Spine Guard', 'Shield', 'Armour', 'Bulwark', 'Rampart', 'Fortress', 'Stronghold', 'Citadel', 'Bastion', 'Keep', 'Tower', 'Battlement'],
    cycle: ['glutes', 'back'],
    dayTypes: {
      glutes: { label: 'Glutes & core', short: 'Glutes', blocks: [S('Glutes & core', ['glute_bridge', 'clamshell', 'mcgill_curl_up', 'side_plank_knee', 'backStrength?'])] },
      back: { label: 'Back & hips', short: 'Back', blocks: [S('Back & hips', ['bird_dog', 'superman', 'prone_ytw', 'backStrength', 'backStrength?'])] },
    },
  },
  {
    id: 'desk-back', added: 14, catalogue: 8, name: 'Desk Back', subject: 'Back care', minutes: [15, 20], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Reset circuit A / B', blurb: 'For long days sitting: a short circuit of back movement, posture drills and glute work.',
    about: 'For backs that sit all day. A short circuit undoes the desk: a back movement such as a press-up or open book, a posture drill such as chin tucks or wall slides, and a glute move to wake up the hips. Two or three relaxed rounds, about fifteen minutes. Levels II and III add reps. Good at lunchtime or straight after work.',
    names: ['Office Hours', 'Lunch Hour', 'Coffee Break', 'Clock Off', 'Desk Job', 'Swivel Chair', 'Keyboard', 'Monitor', 'Inbox Zero', 'Meeting Room', 'Water Cooler', 'Commute', 'Home Office', 'Standing Desk', 'Spreadsheet', 'Overtime Back', 'Nine to Five', 'Friday', 'Weekend', 'Out of Office'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Reset circuit A', short: 'A', blocks: [C('Desk reset', ['backMove', 'mbPosture', 'glute_bridge', 'backMove', 'mbPosture?'], { values: [2, 3, 4] })] },
      b: { label: 'Reset circuit B', short: 'B', blocks: [C('Desk reset', ['mbPosture', 'backMove', 'clamshell', 'mbPosture', 'backMove?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'back-and-hips', added: 14, catalogue: 8, name: 'Back & Hips', subject: 'Back care', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'Hips / spine', blurb: 'Back care through the hips: a hip flow and glute circuit one day, spine movement and trunk strength the next.',
    about: 'Back care that starts at the hips, because stiff hips and sleepy glutes often load the lower back. One day is a hip mobility flow followed by a glute circuit; the other is spine movement followed by trunk strength. Calm pace throughout. Level II adds reps and Level III brings slightly harder versions. Stop if anything sharpens pain.',
    names: ['Hip Joint', 'Pelvis', 'Ilium', 'Hip Crease', 'Glute Wake', 'Hip Opener', 'Hip Circle', 'Hip Flow', 'Saddle Joint', 'Hip Swing', 'Hip Key', 'Hip Lever', 'Hip Hinge Easy', 'Psoas', 'Piriformis', 'Gluteus', 'Hamstring Easy', 'Groin', 'Sit Bones', 'Tailbone'],
    cycle: ['hips', 'spine'],
    dayTypes: {
      hips: { label: 'Hips', short: 'Hips', blocks: [F('Hip flow', ['hip_cars', 'mbHip', 'mbHip', 'knee_hug']), C('Glutes', ['glute_bridge', 'clamshell', 'backStrength?'], { values: [2, 3] })] },
      spine: { label: 'Spine', short: 'Spine', blocks: [F('Spine flow', ['pelvic_tilt', 'cat_cow', 'backMove', 'backMove', 'backMove', 'backMove?']), C('Trunk', ['bird_dog', 'mcgill_curl_up', 'side_plank_knee?'], { values: [2, 3, 4] })] },
    },
  },
  // ---------------- PHASE 14: 30-DAY PROGRAMS (three levels of ten days) ----------------
  {
    id: 'yoga-30', added: 14, catalogue: 8, days: 30, name: 'Yoga 30', subject: 'Yoga', minutes: [23, 28], equip: 'bw', absSlots: [], levers: [null, 'holds', 'variation'],
    split: 'Stand / balance / unwind, 30 days', blurb: 'A month of yoga, about twenty-five minutes a day: standing, balance and floor days, a new level every ten days.',
    about: 'A month of yoga for building a habit, about twenty-five minutes a day. Three days rotate: a standing flow, a balance and core flow, and a slower floor flow to unwind. Each starts with sun salutations and the voice names every pose. Level II, from day 11, holds each pose longer, and Level III, from day 21, brings harder versions. No equipment beyond a mat.',
    names: ['Arrive', 'Root Down', 'Rise Up', 'Open Up', 'Find Balance', 'Breathe In', 'Settle In', 'Grow', 'Bloom', 'Steady', 'Strong', 'Soft', 'Bright', 'Whole', 'Namaste'],
    cycle: ['stand', 'balance', 'unwind'],
    dayTypes: {
      stand: { label: 'Standing', short: 'Stand', blocks: [SUN, F('Standing flow', ['warrior_one', 'ygStand', 'ygStand', 'ygStand?']), F('Rest', ['ygRest', 'ygRest?'])] },
      balance: { label: 'Balance & core', short: 'Balance', blocks: [SUN, F('Balance flow', ['tree_pose', 'ygBalance', 'ygStand', 'ygBalance?']), F('Core & rest', ['ygCore', 'ygRest', 'ygRest?'])] },
      unwind: { label: 'Unwind', short: 'Unwind', blocks: [F('Wake-up', ['cat_cow', 'sun_salutation']), F('Floor flow', ['ygHips', 'ygBack', 'ygHips', 'ygBack?']), F('Rest', ['ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'core-30', added: 14, catalogue: 8, days: 30, name: 'Core 30', subject: 'Core & abs', minutes: [16, 21], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Brace / twist / hollow, 30 days', blurb: 'A month of core work, under twenty minutes a day: brace, twist and hollow days, a new level every ten days.',
    about: 'A month of short core sessions, under twenty minutes a day. Three days rotate: bracing against arching, resisting and making rotation, and hollow-body work. Each is a circuit with a breather between rounds, then a short abs finisher. Every ten days the level steps up: Level II adds reps and Level III brings harder versions.',
    names: ['Core One', 'Brace Day', 'Twist Day', 'Hollow Day', 'Plank Day', 'Rotation', 'Anti-twist', 'Bird Dog Day', 'Dead Bug Day', 'Side Day', 'Rock Day', 'Hold Day', 'Final Plank', 'Iron Core', 'Six Pack'],
    cycle: ['brace', 'twist', 'hollow'],
    dayTypes: {
      brace: { label: 'Brace', short: 'Brace', blocks: [C('Brace circuit', ['coreAnti', 'coreAnti', 'core2', 'coreAnti?'], { values: [2, 3] })] },
      twist: { label: 'Twist', short: 'Twist', blocks: [C('Twist circuit', ['coreRot', 'coreRot', 'core2', 'coreRot?'], { values: [2, 3] })] },
      hollow: { label: 'Hollow', short: 'Hollow', blocks: [C('Hollow circuit', ['coreHollow', 'coreHollow', 'core2', 'coreHollow?'], { values: [2, 3] })] },
    },
  },
  // ---------------- PHASE 14 ticket 11: Mind & body +16, spread over its subjects ----------------
  // CORE & ABS (+3)
  {
    id: 'core-emom', added: 14, catalogue: 8, name: 'Core EMOM', subject: 'Core & abs', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Core EMOM A / B', blurb: 'Core work on the clock: a core move at the top of every minute, rest for what is left.',
    about: 'Core training on the clock. At the top of every minute comes one core move, a plank variation, a hollow hold, a twist or a dead bug, and you rest for whatever is left of the minute. The rotation hits the front, the sides and the back in turn. Abs finish every session. Both later levels add reps and seconds, so the rest in each minute shrinks.',
    names: ['Core Clock', 'Plank Minute', 'Ab Minute', 'Brace Minute', 'Twist Minute', 'Hollow Minute', 'Hold Minute', 'Core Beat', 'Core Pulse', 'Core Tick', 'Midsection', 'Six Minutes', 'Ten Minutes', 'Core Lap', 'Core Round'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Core EMOM A', short: 'A', blocks: [E('Core EMOM', ['coreAnti', 'coreRot', 'coreHollow', 'core2'], { values: [10, 12, 14] })] },
      b: { label: 'Core EMOM B', short: 'B', blocks: [E('Core EMOM', ['coreHollow', 'coreAnti', 'core2', 'coreRot'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'loaded-core', added: 14, catalogue: 8, name: 'Loaded Core', subject: 'Core & abs', minutes: [25, 30], levers: [null, 'weight', 'reps'],
    split: 'Carry & press / lift & chop', blurb: 'Core work with weights: carries, overhead holds, windmills and loaded twists in straight sets.',
    about: 'Core strength with weights, the way the trunk works when you carry and lift. One day is carries and overhead work, suitcase marches, farmer carries and bottoms-up holds; the other is loaded rotation and hinging, windmills, halos and weighted twists. Straight sets with full rests. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Ballast Core', 'Heavy Core', 'Iron Belt', 'Weight Belt', 'Load Line', 'Payload Core', 'Cargo Core', 'Keel Weight', 'Anchor Core', 'Plumb Weight', 'Sandbag', 'Ballast Bag', 'Core Load', 'Loaded Brace', 'Weighted Midline'],
    cycle: ['carry', 'chop'],
    dayTypes: {
      carry: { label: 'Carry & press', short: 'Carry', blocks: [S('Carries & holds', ['suitcase_march', 'farmer_carry', 'kb_bottoms_up_hold', 'absW', 'carry?'])] },
      chop: { label: 'Lift & chop', short: 'Chop', blocks: [S('Loaded rotation', ['kb_windmill', 'kb_halo', 'absW', 'kbCore2', 'absW?'])] },
    },
  },
  {
    id: 'plank-project', added: 14, catalogue: 8, name: 'Plank Project', subject: 'Core & abs', minutes: [20, 25], equip: 'bw', levers: [null, 'holds', 'variation'],
    split: 'Front / side', blurb: 'Every kind of plank, held on the clock: front planks one day, side planks the next.',
    about: 'Every kind of plank, held and built up over sixty days. Front days work long planks, plank reaches, shoulder taps and bear holds; side days work side planks, hip dips and Copenhagen planks. Straight sets of holds with rest between. Abs finish every session. Level II holds each plank longer and Level III moves to harder versions.',
    names: ['Plank One', 'Ironing Board', 'Tabletop', 'Surfboard', 'Diving Board', 'Plank Walk', 'Bridge Plank', 'Board Room', 'Floorboard Plank', 'Timber', 'Lumber', 'Beam Plank', 'Raft', 'Deck Plank', 'Gangplank'],
    cycle: ['front', 'side'],
    dayTypes: {
      front: { label: 'Front', short: 'Front', blocks: [S('Front planks', ['plank', 'plank_reach', 'shoulder_taps', 'bear_hold', 'coreAnti?'])] },
      side: { label: 'Side', short: 'Side', blocks: [S('Side planks', ['side_plank', 'side_plank_dip', 'copenhagen_plank', 'side_plank_knee', 'coreRot?'])] },
    },
  },
  // MOBILITY & POSTURE (+2)
  {
    id: 'shoulder-health', added: 14, catalogue: 8, name: 'Shoulder Health', subject: 'Mobility & posture', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Mobility / control', blurb: 'For stiff or cranky shoulders: a mobility flow, then a circuit of control and posture drills.',
    about: 'For shoulders that are stiff from desks or sore from training. Each session opens with a guided flow of shoulder circles, wall slides and thread-the-needle, then a circuit of control drills such as Y-T-W raises, reverse snow angels and chin tucks for the muscles that hold the shoulders back. Two days alternate the emphasis. Levels II and III add reps.',
    names: ['Rotator', 'Cuff Care', 'Scapula Glide', 'Shoulder Blade Day', 'Collarbone', 'Socket Day', 'Wing Back', 'Open Chest', 'Shoulder Roll', 'Shrug Off', 'Arm Circle Day', 'Wall Angel', 'Doorway', 'High Shelf', 'Reach Up'],
    cycle: ['mobility', 'control'],
    dayTypes: {
      mobility: { label: 'Mobility', short: 'Mobility', blocks: [F('Shoulder flow', ['shoulder_cars', 'wall_slides', 'thread_the_needle', 'mbShoulder', 'mbShoulder?']), C('Control', ['prone_ytw', 'reverse_snow_angel', 'chin_tucks?'], { values: [2, 3] })] },
      control: { label: 'Control', short: 'Control', blocks: [F('Shoulder flow', ['shoulder_cars', 'mbShoulder', 'mbPosture', 'mbShoulder?']), C('Control', ['reverse_snow_angel', 'prone_ytw', 'mbPosture', 'wall_slides?'], { values: [2, 3] })] },
    },
  },
  {
    id: 'hip-mobility', added: 14, catalogue: 8, name: 'Hip Mobility', subject: 'Mobility & posture', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Hips A / hips B', blurb: 'Twenty minutes for stiff hips: circles, 90/90s, deep squats and airplanes in a guided flow.',
    about: 'Twenty minutes for hips that sit too much. Each session is a guided flow of hip circles, 90/90 switches, deep squat holds and hip airplanes, with a short spine flow to finish. Two versions alternate so the hips move every way they can. Levels II and III add reps. Good before leg days or on their own.',
    names: ['Hip Hinge Flow', 'Ninety Ninety', 'Deep Squat', 'Airplane', 'Hip Circle Day', 'Socket Flow', 'Pelvic Flow', 'Hip Swing Day', 'Open Hips', 'Hip Key Flow', 'Sit Bone', 'Hip Pocket', 'Hip Drop', 'Hip Roll', 'Hip Lift'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Hips A', short: 'A', blocks: [F('Hip flow', ['hip_cars', 'ninety_ninety', 'mbHip', 'mbHip', 'mbHip?']), F('Spine', ['mbSpine', 'mbSpine?'])] },
      b: { label: 'Hips B', short: 'B', blocks: [F('Hip flow', ['deep_squat_hold', 'hip_airplane', 'mbHip', 'mbHip', 'mbHip?']), F('Spine', ['mbSpine', 'mbSpine?'])] },
    },
  },
  // YOGA (+2)
  {
    id: 'evening-yoga', added: 14, catalogue: 8, name: 'Evening Yoga', subject: 'Yoga', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Wind-down A / wind-down B', blurb: 'A slow evening practice: a few gentle standing poses, then hips, twists and rest on the floor.',
    about: 'A slow practice for the end of the day, about twenty minutes. A few gentle standing poses settle the legs, then the practice moves to the floor for hips, twists and long rests. There are no salutations and nothing fast. Two versions alternate. Levels II and III hold each pose a little longer. Good before bed.',
    names: ['Sunset', 'Evening Star', 'Twilight Yoga', 'Moonrise Yoga', 'Night Sky', 'Starry', 'Lavender', 'Chamomile', 'Pillow', 'Blanket', 'Lights Down', 'Hush Yoga', 'Dreamy', 'Slumber', 'Goodnight Yoga'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Wind-down A', short: 'A', blocks: [F('Gentle standing', ['mountain_pose', 'ygStand', 'forward_fold']), F('Floor', ['ygHips', 'supine_twist', 'ygRest', 'ygRest', 'ygRest?'])] },
      b: { label: 'Wind-down B', short: 'B', blocks: [F('Gentle standing', ['mountain_pose', 'ygStand', 'ygBalance']), F('Floor', ['ygBack', 'ygHips', 'happy_baby', 'ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'yoga-strength', added: 14, catalogue: 8, name: 'Yoga Strength', subject: 'Yoga', minutes: [30, 35], equip: 'bw', absSlots: [], levers: [null, 'variation', 'holds'],
    split: 'Arms & core / legs & balance', blurb: 'Yoga for strength: chaturangas, crow and boat for the upper body, chair and warriors for the legs.',
    about: 'Yoga for strength rather than stretch. One day works arms and core with plank, dolphin, crow and boat held on the clock; the other works legs and balance with chair, warriors and one-leg poses. Each starts with salutations and ends with rest. Level II brings harder poses first and Level III holds them longer.',
    names: ['Warrior Strong', 'Crow Day', 'Boat Day', 'Chair Day', 'Dolphin Day', 'Plank Yoga', 'Strong Roots', 'Oak Pose', 'Iron Yogi', 'Steel Flow', 'Power Pose', 'Lion', 'Tiger Yoga', 'Eagle Strong', 'Mountain Strong'],
    cycle: ['arms', 'legs'],
    dayTypes: {
      arms: { label: 'Arms & core', short: 'Arms', blocks: [SUN, F('Arms & core', ['plank', 'dolphin_pose', 'crow_pose', 'ygCore', 'ygCore?']), F('Core & balance', ['boat_pose', 'ygCore', 'ygBalance', 'ygCore?']), F('Rest', ['ygRest', 'ygRest?'])] },
      legs: { label: 'Legs & balance', short: 'Legs', blocks: [SUN, F('Legs & balance', ['chair_pose', 'warrior_two', 'ygBalance', 'ygStand', 'ygBalance', 'ygStand?']), F('Rest', ['ygRest', 'ygRest?'])] },
    },
  },
  // PILATES (+2)
  {
    id: 'pilates-flow', added: 14, catalogue: 8, name: 'Pilates Flow', subject: 'Pilates', minutes: [28, 33], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Flow A / flow B / flow C', blurb: 'Half an hour of Pilates that keeps moving: three flowing mat sessions in turn.',
    about: 'Half an hour of Pilates that keeps moving from one exercise to the next. Three sessions rotate, each opening with the hundred and moving through abs, back, sides and roll-downs, in different orders so the body never settles into one pattern. The voice names every move. Levels II and III add reps.',
    names: ['Current Flow', 'Glide', 'Sweep', 'Swirl', 'Eddy Flow', 'Ripple Flow', 'Stream Flow', 'River Flow', 'Breeze', 'Drift Flow', 'Float', 'Sail', 'Slide', 'Curve', 'Spiral Flow'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Flow A', short: 'A', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Abs & back', ['plAbs', 'plBack', 'plAbs', 'plRoll', 'plAbs?']), F('Sides & glutes', ['plSide', 'plGlute', 'plSide', 'plGlute?']), F('Close', ['spine_stretch', 'plRoll?'])] },
      b: { label: 'Flow B', short: 'B', blocks: [F('Warm-up', ['hundred', 'spine_stretch'], ONCE), F('Sides & abs', ['plSide', 'plAbs', 'plSide', 'plAbs', 'plSide?']), F('Back & roll', ['plBack', 'plRoll', 'plBack', 'plRoll?']), F('Close', ['saw', 'plRoll?'])] },
      c: { label: 'Flow C', short: 'C', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Back & sides', ['plBack', 'plSide', 'plBack', 'plSide', 'plBack?']), F('Abs & glutes', ['plAbs', 'plGlute', 'plAbs', 'plGlute?']), F('Close', ['seal', 'plRoll?'])] },
    },
  },
  {
    id: 'pilates-15', added: 14, catalogue: 8, name: 'Pilates 15', subject: 'Pilates', minutes: [13, 17], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'Express A / express B', blurb: 'Fifteen minutes of Pilates: the hundred, the abs series and one back move. Small and often.',
    about: 'Fifteen minutes of Pilates for days when there is no time for more. The hundred opens, the abs series follows, and one back extension and a roll-down close it. Two versions alternate. Level II adds reps and Level III brings harder moves such as the teaser. Small and often is how Pilates works best.',
    names: ['Pocket Pilates', 'Quick Mat', 'Mat Minute', 'Short Mat', 'Pilates Snack', 'Mini Mat', 'Lunch Mat', 'Morning Mat', 'Coffee Mat', 'Desk Mat', 'Brief Mat', 'Fifteen Mat', 'Quarter Mat', 'Fast Mat', 'Little Mat'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Express A', short: 'A', blocks: [F('Warm-up', ['hundred'], ONCE), F('Abs', ['plAbs', 'plAbs', 'plAbs?']), F('Back & roll', ['plBack', 'plRoll', 'plRoll?'])] },
      b: { label: 'Express B', short: 'B', blocks: [F('Warm-up', ['hundred'], ONCE), F('Abs', ['plAbs', 'plSide', 'plAbs?']), F('Back & roll', ['plBack', 'plRoll', 'plSide?'])] },
    },
  },
  // FLEXIBILITY (+2)
  {
    id: 'backbend-flex', added: 14, catalogue: 8, name: 'Backbend Flexibility', subject: 'Flexibility', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Spine & hip flexors / shoulders & chest', blurb: 'Flexibility for backbends: the front of the hips, the spine and the shoulders, opened slowly.',
    about: 'Flexibility for backbends, built from the places that limit them. One day opens the front of the hips and the spine with lunges, sphinx and camel; the other opens the shoulders and chest with puppy, thread-the-needle and chest openers. Every stretch is held on the clock and the voice walks you through. Levels II and III hold a little longer.',
    names: ['Arch', 'Bridge Bend', 'Wheel', 'Camel Day', 'Cobra Day', 'Sphinx Day', 'Bow', 'Locust Day', 'Fish', 'Crescent Bend', 'Rainbow', 'Arc Bend', 'Curve Back', 'Open Front', 'Heart Open'],
    cycle: ['spine', 'shoulders'],
    dayTypes: {
      spine: { label: 'Spine & hip flexors', short: 'Spine', blocks: [F('Warm into it', ['cat_cow', 'low_lunge'], ONCE), F('Hip flexors', ['fxQuad', 'fxQuad', 'fxQuad?']), F('Spine', ['sphinx_pose', 'camel_pose', 'fxSpine', 'fxSpine?'])] },
      shoulders: { label: 'Shoulders & chest', short: 'Shoulders', blocks: [F('Warm into it', ['cat_cow', 'puppy_pose'], ONCE), F('Shoulders', ['fxUpper', 'fxUpper', 'fxUpper?']), F('Chest & spine', ['chest_opener', 'fxUpper', 'fxSpine', 'fxSpine?'])] },
    },
  },
  {
    id: 'active-flexibility', added: 14, catalogue: 8, name: 'Active Flexibility', subject: 'Flexibility', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'holds', 'reps'],
    split: 'Stretch & control A / B', blurb: 'Stretch, then use it: held stretches followed by control drills that own the new range.',
    about: 'Flexibility you can use, not just reach. Each session holds a few long stretches, then follows them with a circuit of control drills, hip airplanes, 90/90s, wall slides, that make the new range strong. Two days alternate legs and shoulders. Level II holds the stretches longer and Level III adds reps to the drills.',
    names: ['Own It', 'Reach and Hold', 'Range', 'Control Day', 'Strong Stretch', 'Active Range', 'End Range', 'Full Range', 'Range Builder', 'Mobile', 'Supple Strong', 'Limber Strong', 'Flex Strength', 'Stretch Strong', 'Lengthen Strong'],
    cycle: ['legs', 'shoulders'],
    dayTypes: {
      legs: { label: 'Stretch & control A', short: 'A', blocks: [F('Stretch', ['fxHam', 'fxHips', 'fxSplit', 'fxHips?']), C('Control', ['hip_airplane', 'ninety_ninety', 'mbHip'], { values: [2, 3] })] },
      shoulders: { label: 'Stretch & control B', short: 'B', blocks: [F('Stretch', ['fxUpper', 'fxUpper', 'fxSpine', 'fxUpper?']), C('Control', ['wall_slides', 'prone_ytw', 'mbShoulder', 'mbPosture?'], { values: [2, 3, 4] })] },
    },
  },
  // BALANCE & STABILITY (+2)
  {
    id: 'steady-feet', added: 14, catalogue: 8, name: 'Steady Feet', subject: 'Balance & stability', minutes: [22, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Feet & ankles / hips', blurb: 'Balance from the ground up: feet and ankles one day, the hips that steady them the next.',
    about: 'Balance built from the ground up. One day trains the feet and ankles with heel-to-toe walks, calf raises and single-leg stands; the other trains the hips that keep the knee and pelvis steady, with reaches, airplanes and clamshells. Circuits with a breather between rounds. Abs finish every session. Both later levels move to harder versions.',
    names: ['Footprint', 'Barefoot', 'Arch Support', 'Ankle Day', 'Heel Toe', 'Tiptoe Day', 'Toe Grip', 'Sole', 'Footing Day', 'Foothold', 'Stance Day', 'Steady Step', 'Firm Foot', 'Grounded', 'Rooted'],
    cycle: ['feet', 'hips'],
    dayTypes: {
      feet: { label: 'Feet & ankles', short: 'Feet', blocks: [C('Feet & ankles', ['heel_to_toe_walk', 'single_leg_calf_raise', 'blStatic', 'ankle_rocks', 'blStatic?'], { values: [2, 3, 4] })] },
      hips: { label: 'Hips', short: 'Hips', blocks: [C('Hips', ['blDynamic', 'hip_airplane', 'clamshell', 'blDynamic', 'blStrength?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'loaded-balance', added: 14, catalogue: 8, name: 'Loaded Balance', subject: 'Balance & stability', minutes: [28, 32], levers: [null, 'weight', 'reps'],
    split: 'Single-leg loaded A / B', blurb: 'Single-leg strength with dumbbells and a kettlebell: balance that holds up under load.',
    about: 'Single-leg strength with weights, for balance that holds up when you carry or lift. Split squats, single-leg deadlifts, step-ups and suitcase marches are done one side at a time in straight sets, with a balance drill between. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Weighted Step', 'Loaded Stance', 'Heavy Foot', 'Iron Ankle', 'Counterbalance', 'Ballast Leg', 'Laden', 'Burden', 'Freight Leg', 'Shoulder Load', 'Bag Carry', 'One-sided', 'Offset', 'Uneven Load', 'Lopsided'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Single-leg loaded A', short: 'A', blocks: [S('Single-leg strength', ['singleLeg', 'single_leg_rdl', 'blStatic', 'suitcase_march', 'singleLeg?'])] },
      b: { label: 'Single-leg loaded B', short: 'B', blocks: [S('Single-leg strength', ['lunge2', 'singleLeg', 'blDynamic', 'singleLeg', 'suitcase_march?'])] },
    },
  },
  // GENTLE / LOW IMPACT (+2), BACK CARE (+1)
  {
    id: 'gentle-flow', added: 14, catalogue: 8, name: 'Gentle Flow', subject: 'Gentle / low impact', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Standing / floor', blurb: 'Gentle guided movement: simple standing poses one day, easy floor stretches the next.',
    about: 'Gentle, guided movement for any age or ability. One day is simple standing poses and slow marching, holding a chair if you like; the other is easy floor stretches for the back and hips. The voice walks you through everything and nothing is rushed. Levels II and III hold each pose a little longer.',
    names: ['Easy Morning', 'Soft Start', 'Light Touch', 'Gentle Hour', 'Calm Day', 'Kind Day', 'Unhurried', 'Leisure', 'Tranquil', 'Serene', 'Peaceful', 'Placid', 'Mellow', 'Mild', 'Tender'],
    cycle: ['standing', 'floor'],
    dayTypes: {
      standing: { label: 'Standing', short: 'Stand', blocks: [F('Standing', ['standing_march', 'mountain_pose', 'gentleBalance', 'gentleBalance', 'gentleCardio?']), F('Moving', ['step_touch', 'arm_drive', 'gentleCardio', 'gentleCardio', 'gentleBalance?'])] },
      floor: { label: 'Floor', short: 'Floor', blocks: [F('Back', ['pelvic_tilt', 'knee_hug', 'backMove', 'backMove?']), F('Hips & rest', ['backMove', 'backMove', 'childs_pose', 'backMove?'])] },
    },
  },
  {
    id: 'easy-strength', added: 14, catalogue: 8, name: 'Easy Strength', subject: 'Gentle / low impact', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'tempo', 'reps'],
    split: 'Strength & stretch A / B', blurb: 'Slow, simple strength in straight sets, then a gentle stretch. Every rep calm and controlled.',
    about: 'Slow, simple strength for building up gently. Each session is a few straight sets of moves like sit-to-stands, wall push-ups and bridges, with full rests, then a gentle stretch on the floor. Level II slows every rep down, which makes it harder without adding anything, and Level III adds a few reps.',
    names: ['Steady Strong', 'Little by Little', 'Step by Step', 'Inch by Inch', 'Slowly Does It', 'Gradual', 'Easy Build', 'Small Steps', 'Bit by Bit', 'Drop by Drop', 'Brick by Brick', 'One More Rep', 'Nice and Easy', 'Gentle Strong', 'Build Up'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Strength & stretch A', short: 'A', blocks: [S('Strength', ['sit_to_stand', 'wall_pushup', 'glute_bridge', 'gentleStrength?']), F('Stretch', ['backMove', 'backMove', 'backMove?'])] },
      b: { label: 'Strength & stretch B', short: 'B', blocks: [S('Strength', ['sit_to_stand', 'bird_dog', 'clamshell', 'gentleStrength?']), F('Stretch', ['backMove', 'backMove', 'backMove?'])] },
    },
  },
  {
    id: 'loaded-back-care', added: 14, catalogue: 8, name: 'Loaded Back Care', subject: 'Back care', minutes: [25, 30], absSlots: [], levers: [null, 'weight', 'reps'],
    split: 'Hinge & glutes / rows & trunk', blurb: 'For a back ready for more: light hinges, rows and carries with weights, then the back-care basics.',
    about: 'The next step for a back that is feeling better: learning to lift again, with weights, carefully. One day teaches the hinge with light Romanian deadlifts and glute bridges; the other builds the upper back and trunk with rows, carries and bird dogs. Straight sets, slow and controlled, with full rests. Level II asks for slightly heavier weights and Level III adds reps. Stop if anything sharpens pain.',
    names: ['Lift Well', 'Pick Up', 'Safe Lift', 'Hinge Well', 'Carry Well', 'Row Well', 'Strong Spine', 'Back to Lifting', 'Return', 'Comeback Back', 'Rebuild', 'Restore', 'Renew', 'Recover', 'Resilient'],
    cycle: ['hinge', 'rows'],
    dayTypes: {
      hinge: { label: 'Hinge & glutes', short: 'Hinge', blocks: [S('Hinge & glutes', ['db_rdl', 'glute_bridge', 'hip_thrust', 'backStrength', 'clamshell?'])] },
      rows: { label: 'Rows & trunk', short: 'Rows', blocks: [S('Rows & trunk', ['row2', 'suitcase_march', 'bird_dog', 'mcgill_curl_up', 'side_plank_knee?'])] },
    },
  },
  // ---------------- PHASE 16 ticket 10: MIND & BODY +50% (catalogue 9) ----------------
  // Core & abs +5
  {
    id: 'core-and-neck', added: 16, catalogue: 9, name: 'Core & Posture', subject: 'Core & abs', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Core & upper back / core & neck', blurb: 'A strong middle and an upright top half: core circuits with upper-back and gentle neck work.',
    about: 'Core strength paired with the muscles that hold you upright. One day joins planks and dead bugs with Y raises and reverse snow angels for the upper back; the other joins hollow holds and twists with gentle neck holds and chin tucks. Good posture starts in the middle. Abs finish every session. Level II adds reps and Level III makes every hold longer.',
    names: ['Upright', 'Tall', 'Stacked', 'Aligned Core', 'Plumb Line', 'Spine Line', 'Column Core', 'Pillar Core', 'Mast Core', 'Steady Core', 'Proud', 'Poised Core'],
    cycle: ['back', 'neck'],
    dayTypes: {
      back: { label: 'Core & upper back', short: 'Back', blocks: [C('Core & upper back', ['coreAnti', 'trapsBw', 'coreHollow', 'trapsBw', 'coreRot?'], { values: [3, 4] })] },
      neck: { label: 'Core & neck', short: 'Neck', blocks: [C('Core & neck', ['coreHollow', 'neck', 'coreRot', 'neck', 'coreAnti?'], { values: [3, 4] })] },
    },
  },
  {
    id: 'weighted-abs', added: 16, catalogue: 9, name: 'Weighted Abs', subject: 'Core & abs', minutes: [20, 25], levers: [null, 'weight', 'reps'],
    split: 'Weighted front / weighted sides', blurb: 'Abs that grow: weighted crunches, toe touches and side bends in straight sets.',
    about: 'Abs are a muscle like any other, and they grow with load. One day trains the front with weighted crunches, toe touches and dead bugs; the other the sides with side bends, weighted twists and suitcase carries. Straight sets with real rests. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Loaded Abs', 'Heavy Middle', 'Iron Abs', 'Weighted Core', 'Plate Abs', 'Bell Abs', 'Dumbbell Abs', 'Load Up Abs', 'Strong Middle', 'Dense Core', 'Thick Core', 'Solid Core'],
    cycle: ['front', 'sides'],
    dayTypes: {
      front: { label: 'Weighted front', short: 'Front', blocks: [S('Weighted front', ['absW', 'weighted_dead_bug', 'absW', 'coreHollow?'])] },
      sides: { label: 'Weighted sides', short: 'Sides', blocks: [S('Weighted sides', ['db_side_bend', 'suitcase_march', 'coreRot', 'absW?'])] },
    },
  },
  {
    id: 'core-30-plus', added: 16, catalogue: 9, days: 30, name: 'Core 30 Plus', subject: 'Core & abs', minutes: [18, 23], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Core EMOM / core circuit, 30 days', blurb: 'A month of core: an EMOM one day, a circuit the next.',
    about: 'A month for a stronger middle with no equipment. An EMOM one day and a circuit the next, mixing bracing, twisting and hollow work. Every ten days the level steps up: more reps at Level II, longer holds at Level III. Abs finish every session.',
    names: ['Core One', 'Core Week', 'Core Ten', 'Core Twenty', 'Core Thirty', 'Core Month', 'Middle Month', 'Brace Month', 'Twist Month', 'Hollow Month', 'Plank Month', 'Six Pack Month'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Core EMOM', short: 'EMOM', blocks: [E('Core EMOM', ['coreAnti', 'coreRot', 'coreHollow'], { values: [9, 12] })] },
      circuit: { label: 'Core circuit', short: 'Circuit', blocks: [C('Core circuit', ['coreHollow', 'coreAnti', 'coreRot', 'core2?'], { values: [3, 4] })] },
    },
  },
  {
    id: 'bell-core', added: 16, catalogue: 9, name: 'Bell Core', subject: 'Core & abs', minutes: [22, 27], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Bell core EMOM / bell core circuit', blurb: 'Core with one kettlebell: windmills, halos, carries and around-the-body passes.',
    about: 'Core training with one kettlebell. One day is an EMOM of windmills, halos and around-the-body passes; the other a circuit of carries, bottoms-up holds and Turkish get-ups. The bell makes your middle resist being pulled off line. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Middle', 'Bell Brace', 'Bell Twist', 'Bell Halo Core', 'Bell Windmill Core', 'Bell Carry Core', 'Bell Getup Core', 'Bell Pass', 'Bell Orbit Core', 'Bell Ring Core', 'Bell Spin Core', 'Bell Hold Core'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Bell core EMOM', short: 'EMOM', blocks: [E('Bell core EMOM', ['kb_windmill', 'kb_halo', 'kb_around_body'], { values: [9, 12, 15] })] },
      circuit: { label: 'Bell core circuit', short: 'Circuit', blocks: [C('Bell core circuit', ['suitcase_march', 'kb_bottoms_up_hold', 'turkish_getup', 'kbCore2?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'pilates-core-mix', added: 16, catalogue: 9, name: 'Pilates Core Mix', subject: 'Core & abs', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Pilates abs / plank & hollow', blurb: 'Pilates abs one day, planks and hollow holds the next: two schools of core.',
    about: 'Two schools of core training in turn. One day is a circuit of Pilates abdominal work: the hundred, leg stretches, scissors and roll-ups. The other is the strength-gym version: planks, side planks, hollow holds and dead bugs. Each covers what the other misses. Abs finish every session. Level II adds reps and Level III brings harder moves.',
    names: ['Two Schools', 'East West', 'Old New', 'Classic Modern', 'Studio Gym', 'Mat Floor', 'Hundred Plank', 'Roll Hold', 'Scissor Brace', 'Curl Plank', 'Stretch Brace', 'Flow Hold'],
    cycle: ['pilates', 'plank'],
    dayTypes: {
      pilates: { label: 'Pilates abs', short: 'Pilates', blocks: [C('Pilates abs', ['hundred', 'plAbs', 'plRoll', 'plAbs'], { values: [2, 3] })] },
      plank: { label: 'Plank & hollow', short: 'Plank', blocks: [C('Plank & hollow', ['plank', 'side_plank', 'coreHollow', 'dead_bug'], { values: [2, 3, 4] })] },
    },
  },
  // Mobility & posture +4 (flow and circuit, no abs)
  {
    id: 'desk-neck-reset', added: 16, catalogue: 9, name: 'Neck & Shoulder Reset', subject: 'Mobility & posture', minutes: [14, 18], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Neck & shoulders / upper back & chest', blurb: 'A short reset for screen days: gentle neck and shoulder work, then the upper back and chest.',
    about: 'A short reset for long screen days. One day is gentle neck and shoulder work: chin tucks, neck holds at half effort and shoulder circles. The other opens the chest and wakes up the upper back with Y raises, wall slides and open books. Fifteen minutes, nothing strenuous. Both later levels add reps.',
    names: ['Unhunch', 'Screen Break', 'Look Up', 'Roll Out', 'Reset', 'Stretch Break', 'Shoulders Back', 'Chin Up Reset', 'Desk Out', 'Laptop Lid', 'Phone Down', 'Stand Up Reset'],
    cycle: ['neck', 'back'],
    dayTypes: {
      neck: { label: 'Neck & shoulders', short: 'Neck', blocks: [C('Neck & shoulders', ['chin_tucks', 'neck', 'mbShoulder', 'neck', 'mbShoulder?'])] },
      back: { label: 'Upper back & chest', short: 'Back', blocks: [C('Upper back & chest', ['prone_y_raise', 'wall_slides', 'open_book', 'mbPosture', 'fxUpper?'])] },
    },
  },
  {
    id: 'ankle-hip-mobility', added: 16, catalogue: 9, name: 'Ankles & Hips', subject: 'Mobility & posture', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Ankles & calves / hips & groin', blurb: 'Mobility from the ground up: ankles and calves one day, hips and inner thighs the next.',
    about: 'Mobility from the ground up. One day works the ankles and calves: ankle rocks, tibialis raises, heel walks and calf stretches. The other the hips and inner thighs: hip circles, 90/90s and adductor rock-backs. Good ankles and hips make squats, runs and stairs easier. Both later levels add reps.',
    names: ['Ground Up', 'Ankle Deep', 'Hip Deep', 'Root Mobility', 'Foot Loose', 'Hip Loose', 'Free Ankles', 'Free Hips', 'Open Ankles', 'Open Hips', 'Easy Ankles', 'Easy Hips'],
    cycle: ['ankles', 'hips'],
    dayTypes: {
      ankles: { label: 'Ankles & calves', short: 'Ankles', blocks: [C('Ankles & calves', ['ankle_rocks', 'tibialis_raise', 'heel_walk', 'calf_raise', 'shin?'])] },
      hips: { label: 'Hips & groin', short: 'Hips', blocks: [C('Hips & groin', ['hip_cars', 'ninety_ninety', 'adductor_rockback', 'mbHip', 'adductorBw?'])] },
    },
  },
  {
    id: 'mobility-30', added: 16, catalogue: 9, days: 30, name: 'Mobility 30', subject: 'Mobility & posture', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Spine / hips / shoulders, 30 days', blurb: 'A month of mobility: spine, hips and shoulders in turn, a flow each day.',
    about: 'A month to move better. Three short flows rotate: the spine, the hips and the shoulders, each joint taken slowly through its full range. Every ten days the level steps up with more reps. Fifteen to twenty minutes of calm, useful movement.',
    names: ['Move One', 'Move Week', 'Move Ten', 'Move Twenty', 'Move Thirty', 'Move Month', 'Supple Month', 'Loose Month', 'Free Month', 'Flow Month', 'Range Month', 'Ease Month'],
    cycle: ['spine', 'hips', 'shoulders'],
    dayTypes: {
      spine: { label: 'Spine', short: 'Spine', blocks: [F('Spine flow', ['cat_cow', 'mbSpine', 'mbSpine', 'fxSpine', 'mbSpine?']), F('Hips & rest', ['mbHip', 'fxSpine', 'childs_pose', 'mbSpine?'])] },
      hips: { label: 'Hips', short: 'Hips', blocks: [F('Hip flow', ['hip_cars', 'mbHip', 'mbHip', 'fxHips', 'mbHip?']), F('Spine & rest', ['mbSpine', 'fxHips', 'happy_baby', 'mbHip?'])] },
      shoulders: { label: 'Shoulders', short: 'Shoulders', blocks: [F('Shoulder flow', ['shoulder_cars', 'mbShoulder', 'mbShoulder', 'fxUpper', 'mbShoulder?']), F('Upper back & rest', ['mbPosture', 'fxUpper', 'puppy_pose', 'mbShoulder?'])] },
    },
  },
  {
    id: 'posture-strength-circuit', added: 16, catalogue: 9, name: 'Posture Circuits', subject: 'Mobility & posture', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Back & neck circuit / hips & spine circuit', blurb: 'Posture you can keep: circuits for the upper back and neck, then the hips and spine.',
    about: 'Posture is strength as much as stretching. One day is a circuit for the upper back and neck: Y raises, reverse snow angels, chin tucks and prone neck lifts. The other is the hips and spine: glute bridges, bird dogs, open books and hip-flexor holds. Both later levels add reps.',
    names: ['Stand Tall', 'Sit Tall', 'Shoulders Down', 'Chest Up', 'Head Back', 'Hips Under', 'Long Spine', 'Neutral', 'Centred', 'Even', 'Square', 'Level'],
    cycle: ['back', 'hips'],
    dayTypes: {
      back: { label: 'Back & neck circuit', short: 'Back', blocks: [C('Back & neck', ['prone_y_raise', 'reverse_snow_angel', 'chin_tucks', 'prone_neck_lift', 'trapsBw?'])] },
      hips: { label: 'Hips & spine circuit', short: 'Hips', blocks: [C('Hips & spine', ['glute_bridge', 'bird_dog', 'open_book', 'standing_knee_hold', 'mbSpine?'])] },
    },
  },
  // Yoga +5 (flows only, no abs)
  {
    id: 'yoga-hips-hamstrings', added: 16, catalogue: 9, name: 'Hips & Hamstrings Yoga', subject: 'Yoga', minutes: [28, 32], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Hip flow / hamstring flow', blurb: 'Yoga for the tightest places: a long hip-opening flow one day, hamstrings the next.',
    about: 'Yoga for the two tightest places in most bodies. One day opens the hips: pigeon, lizard, frog and garland. The other the hamstrings: forward folds, half splits and pyramid-style stretches. Each starts with sun salutations and ends with rest. Both later levels make every hold longer.',
    names: ['Open Hips', 'Long Legs', 'Low Lunge', 'Pigeon Day', 'Lizard Day', 'Fold Day', 'Half Split Day', 'Garland Day', 'Frog Day', 'Happy Hips', 'Soft Hamstrings', 'Deep Fold'],
    cycle: ['hips', 'hams'],
    dayTypes: {
      hips: { label: 'Hip flow', short: 'Hips', blocks: [SUN, F('Hip flow', ['ygHips', 'fxHips', 'ygHips', 'fxHips', 'ygHips?']), F('Rest', ['ygRest', 'ygRest?'])] },
      hams: { label: 'Hamstring flow', short: 'Hams', blocks: [SUN, F('Hamstring flow', ['fxHam', 'ygStand', 'fxHam', 'fxSplit', 'fxHam?']), F('Rest', ['ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'yin-30', added: 16, catalogue: 9, days: 30, name: 'Yin 30', subject: 'Yoga', minutes: [25, 32], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Yin hips / yin spine, 30 days', blurb: 'A month of yin: long, quiet holds for the hips and the spine.',
    about: 'A month of yin yoga: few poses, held for minutes, with the muscles relaxed. One day works the hips and legs, the next the spine and shoulders. It is slow and quiet, the opposite of a workout, and it loosens what fast training tightens. Every ten days the holds grow longer.',
    names: ['Still', 'Quiet', 'Hush', 'Calm', 'Slow', 'Soft', 'Deep', 'Sink', 'Melt', 'Rest', 'Breathe', 'Settle'],
    cycle: ['hips', 'spine'],
    dayTypes: {
      hips: { label: 'Yin hips', short: 'Hips', blocks: [F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips', 'ygYinHips?'], { scale: 3, cap: 120 }), F('Rest', ['ygRest'])] },
      spine: { label: 'Yin spine', short: 'Spine', blocks: [F('Yin spine', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine', 'ygYinSpine?'], { scale: 3, cap: 120 }), F('Rest', ['ygRest'])] },
    },
  },
  {
    id: 'yoga-balance-core', added: 16, catalogue: 9, name: 'Balance & Core Yoga', subject: 'Yoga', minutes: [28, 32], equip: 'bw', absSlots: [], levers: [null, 'variation', 'holds'],
    split: 'Standing balance flow / core flow', blurb: 'Steady and strong: standing balances one day, yoga core work the next.',
    about: 'Yoga for steadiness and strength. One day is standing balances: tree, warrior three, half moon and dancer. The other is core work: boat, plank, side plank and dolphin. Both start with sun salutations and end lying down. Level II brings harder poses and Level III holds every pose longer.',
    names: ['Tree', 'Eagle', 'Dancer', 'Half Moon', 'Warrior Three', 'Boat', 'Crow', 'Dolphin', 'Side Plank Pose', 'Plank Pose', 'Steady Mind', 'Still Point'],
    cycle: ['balance', 'core'],
    dayTypes: {
      balance: { label: 'Standing balance flow', short: 'Balance', blocks: [SUN, F('Balance flow', ['ygStand', 'ygBalance', 'ygBalance', 'ygStand', 'ygBalance', 'ygStand', 'ygBalance?']), F('Rest', ['ygRest', 'ygRest?'])] },
      core: { label: 'Core flow', short: 'Core', blocks: [SUN, F('Core flow', ['ygCore', 'ygCore', 'ygStand', 'ygCore', 'ygCore', 'ygBalance', 'ygCore?']), F('Rest', ['ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'yoga-backbends', added: 16, catalogue: 9, name: 'Backbend Yoga', subject: 'Yoga', minutes: [28, 32], equip: 'bw', absSlots: [], levers: [null, 'holds', 'variation'],
    split: 'Backbends & hip flexors / twists & shoulders', blurb: 'An open front body: backbends and hip flexors, then twists and shoulder openers.',
    about: 'Yoga that opens the front of the body after long days sitting. One day builds toward backbends with low lunges, sphinx, cobra, bridge and camel. The other twists the spine and opens the shoulders. Sun salutations open every session and rest closes it. Level II holds every pose longer and Level III brings deeper versions.',
    names: ['Bow', 'Camel', 'Cobra', 'Bridge', 'Wheel', 'Locust', 'Sphinx', 'Fish', 'Twist', 'Thread', 'Eagle Arms', 'Cow Face'],
    cycle: ['back', 'twist'],
    dayTypes: {
      back: { label: 'Backbends & hip flexors', short: 'Backbends', blocks: [SUN, F('Backbends', ['low_lunge', 'ygBack', 'ygBack', 'ygHips', 'ygBack', 'ygBack', 'ygBack?']), F('Rest', ['ygRest', 'ygRest?'])] },
      twist: { label: 'Twists & shoulders', short: 'Twists', blocks: [SUN, F('Twists & shoulders', ['seated_twist', 'fxUpper', 'fxSpine', 'fxUpper', 'fxSpine', 'ygStand', 'fxUpper?']), F('Rest', ['ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'yoga-15', added: 16, catalogue: 9, name: 'Yoga 15', subject: 'Yoga', minutes: [13, 17], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Morning 15 / evening 15', blurb: 'Fifteen minutes of yoga: an energising morning flow and a calming evening one.',
    about: 'Yoga that fits a quarter of an hour. The morning flow wakes you up with sun salutations and standing poses; the evening flow winds you down with hips, twists and rest. Do whichever the day needs. Both later levels make every hold longer.',
    names: ['Sunup', 'Sundown', 'Wake', 'Wind Down', 'Rise', 'Rest Easy', 'Open Eyes', 'Close Eyes', 'First Breath', 'Last Breath', 'Morning Quiet', 'Night Quiet'],
    cycle: ['morning', 'evening'],
    dayTypes: {
      morning: { label: 'Morning 15', short: 'Morning', blocks: [SUN, F('Morning flow', ['ygStand', 'ygStand', 'ygBalance', 'ygRest'])] },
      evening: { label: 'Evening 15', short: 'Evening', blocks: [F('Evening flow', ['ygHips', 'supine_twist', 'ygYinSpine', 'ygRest', 'ygRest?'])] },
    },
  },
  // Pilates +4 (flows only, no abs)
  {
    id: 'pilates-glutes-legs', added: 16, catalogue: 9, name: 'Pilates Legs', subject: 'Pilates', minutes: [24, 29], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Glutes & side / legs & inner thighs', blurb: 'Pilates for the lower body: glutes and side kicks one day, legs and inner thighs the next.',
    about: 'Pilates for the hips and legs. One day is glute work and the side-lying series; the other standing work, plié squats, leg circles and inner-thigh lifts. Every session starts with the hundred and keeps the core switched on throughout. Both later levels add reps.',
    names: ['Side Kick', 'Leg Circle', 'Plié', 'Shoulder Bridge', 'Clam', 'Inner Thigh', 'Outer Thigh', 'Seat', 'Ballet Legs', 'Barre Legs', 'Long Legs', 'Lean Legs'],
    cycle: ['glutes', 'legs'],
    dayTypes: {
      glutes: { label: 'Glutes & side', short: 'Glutes', blocks: [F('Warm-up', ['hundred'], ONCE), F('Glutes', ['plGlute', 'plGlute', 'shoulder_bridge', 'plGlute?']), F('Side series', ['plSide', 'plSide', 'plSide?'])] },
      legs: { label: 'Legs & inner thighs', short: 'Legs', blocks: [F('Warm-up', ['hundred'], ONCE), F('Standing legs', ['plie_squat', 'standing_leg_lift', 'heel_raise', 'plGlute?']), F('Inner thighs', ['side_lying_adduction', 'single_leg_circles', 'plSide?'])] },
    },
  },
  {
    id: 'pilates-30', added: 16, catalogue: 9, days: 30, name: 'Pilates 30', subject: 'Pilates', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'Abs & spine / back & sides, 30 days', blurb: 'A month of mat Pilates: abs and spine one day, back and sides the next.',
    about: 'A month of mat Pilates. One day works the abdominals and the spine with the hundred, the stretches and roll-ups; the next the back and the sides with swan, swimming and side kicks. Every ten days the level steps up: more reps at Level II, harder moves like the teaser at Level III.',
    names: ['Mat One', 'Mat Week', 'Mat Ten', 'Mat Twenty', 'Mat Thirty', 'Mat Month', 'Centre Month', 'Control Month', 'Breath Month', 'Flow Month Pilates', 'Precision Month', 'Core Month Pilates'],
    cycle: ['abs', 'back'],
    dayTypes: {
      abs: { label: 'Abs & spine', short: 'Abs', blocks: [F('Warm-up', ['hundred', 'roll_up'], ONCE), F('Abs', ['plAbs', 'plAbs', 'plAbs', 'plAbs', 'plRoll?']), F('Spine', ['spine_stretch', 'plRoll', 'saw', 'plBack?'])] },
      back: { label: 'Back & sides', short: 'Back', blocks: [F('Warm-up', ['hundred'], ONCE), F('Back', ['swan', 'swimming', 'plBack', 'plBack', 'plRoll?']), F('Sides', ['plSide', 'plSide', 'plGlute', 'plSide?'])] },
    },
  },
  {
    id: 'pilates-posture', added: 16, catalogue: 9, name: 'Pilates Posture', subject: 'Pilates', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Spine & back / shoulders & core', blurb: 'Pilates for standing tall: spine and back extension, then shoulders and deep core.',
    about: 'Pilates for better posture. One day strengthens the back and lengthens the spine: swan, swimming, spine stretch and saw. The other works the shoulders and the deep core: leg pull front, the hundred and the stretches, with the shoulders kept down. Both later levels add reps.',
    names: ['Lengthen', 'Lift', 'Lengthen Up', 'Stand Tall Pilates', 'Crown Up', 'Long Neck', 'Wide Collar', 'Open Chest', 'Soft Ribs', 'Neutral Spine', 'Stacked Spine', 'Tall Spine'],
    cycle: ['spine', 'shoulders'],
    dayTypes: {
      spine: { label: 'Spine & back', short: 'Spine', blocks: [F('Warm-up', ['hundred'], ONCE), F('Back', ['swan', 'swimming', 'plBack', 'plBack', 'plSide?']), F('Spine', ['spine_stretch', 'saw', 'plRoll', 'plAbs?'])] },
      shoulders: { label: 'Shoulders & core', short: 'Shoulders', blocks: [F('Warm-up', ['hundred'], ONCE), F('Shoulders & core', ['leg_pull_front', 'plAbs', 'plAbs', 'plBack', 'plAbs?']), F('Roll down', ['plRoll', 'plRoll', 'spine_stretch?'])] },
    },
  },
  {
    id: 'pilates-20', added: 16, catalogue: 9, name: 'Pilates 20', subject: 'Pilates', minutes: [15, 21], equip: 'bw', absSlots: [], levers: [null, 'reps', 'variation'],
    split: 'Short mat A / B / C', blurb: 'Twenty-minute Pilates: three short mat sessions in turn, the classics trimmed down.',
    about: 'The Pilates mat classics trimmed to twenty minutes. Three short sessions rotate: one leans on the abs, one on the back and spine, one on the hips and sides. Each opens with the hundred. Level II adds reps and Level III brings harder moves.',
    names: ['Short Mat', 'Quick Mat', 'Twenty Mat', 'Mat Break', 'Mat Snack', 'Mat Dash', 'Mat Minute', 'Mat Moment', 'Mat Pause', 'Mat Pocket', 'Mat Express', 'Mat Lite'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Short mat A', short: 'A', blocks: [F('Warm-up', ['hundred'], ONCE), F('Abs', ['plAbs', 'plAbs', 'plAbs', 'plRoll']), F('Back', ['plBack', 'spine_stretch?'])] },
      b: { label: 'Short mat B', short: 'B', blocks: [F('Warm-up', ['hundred'], ONCE), F('Back & spine', ['plBack', 'spine_stretch', 'plBack', 'swan']), F('Abs', ['plAbs', 'plAbs?'])] },
      c: { label: 'Short mat C', short: 'C', blocks: [F('Warm-up', ['hundred'], ONCE), F('Hips & sides', ['plSide', 'plGlute', 'plSide', 'plGlute']), F('Abs', ['plAbs', 'plRoll?'])] },
    },
  },
  // Flexibility +4 (flow and circuit, no abs)
  {
    id: 'flexible-30', added: 16, catalogue: 9, days: 30, name: 'Flexible 30', subject: 'Flexibility', minutes: [18, 24.5], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Lower body / upper body & spine, 30 days', blurb: 'A month of stretching: legs and hips one day, shoulders and spine the next.',
    about: 'A month to become noticeably more flexible. One day stretches the hips, hamstrings and quads; the next the shoulders, chest and spine. Holds grow longer every ten days. A calm twenty minutes that undoes a lot of sitting.',
    names: ['Stretch One', 'Stretch Week', 'Stretch Ten', 'Stretch Twenty', 'Stretch Thirty', 'Stretch Month', 'Reach Month', 'Bend Month', 'Open Month', 'Long Month', 'Loose Month Flex', 'Free Month Flex'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Lower body', short: 'Lower', blocks: [F('Lower body', ['fxHips', 'fxHam', 'fxQuad', 'fxHips', 'fxHam?'], { scale: 2, cap: 90 })] },
      upper: { label: 'Upper body & spine', short: 'Upper', blocks: [F('Upper body & spine', ['fxUpper', 'fxSpine', 'fxUpper', 'fxSpine', 'fxUpper?'], { scale: 2, cap: 90 })] },
    },
  },
  {
    id: 'active-range', added: 16, catalogue: 9, name: 'Active Range', subject: 'Flexibility', minutes: [22, 27], equip: 'bw', absSlots: [], levers: [null, 'holds', 'reps'],
    split: 'Hip range circuit & stretch / shoulder range circuit & stretch', blurb: 'Flexibility you can use: strength at the end of the range, then a stretch.',
    about: 'Flexibility you can use, not just reach. Each day starts with a circuit of strength at the end of the range, Cossack squats, Copenhagen planks and standing knee holds one day, Y raises, wall slides and Y-T-Ws the other, then a stretch for the same area. Strength there is what makes new range stay. Level II makes every hold longer and Level III adds reps.',
    names: ['Own It', 'Use It', 'Hold It', 'Control', 'End Range', 'Active Stretch', 'Loaded Stretch', 'Strong Stretch', 'Range Strength', 'Deep Strength', 'Open Strength', 'Free Strength'],
    cycle: ['hips', 'shoulders'],
    dayTypes: {
      hips: { label: 'Hip range', short: 'Hips', blocks: [C('Hip range', ['cossack_squat', 'copenhagen_plank', 'standing_knee_hold'], { values: [2, 3] }), F('Hip stretch', ['fxHips', 'fxStraddle', 'fxHam', 'fxHips?'])] },
      shoulders: { label: 'Shoulder range', short: 'Shoulders', blocks: [C('Shoulder range', ['prone_y_raise', 'wall_slides', 'prone_ytw', 'reverse_snow_angel?']), F('Shoulder stretch', ['fxUpper', 'fxSpine', 'fxUpper', 'fxSpine', 'fxUpper?'], { values: [1, 2] })] },
    },
  },
  {
    id: 'calf-ankle-flex', added: 16, catalogue: 9, name: 'Calves & Ankles Stretch', subject: 'Flexibility', minutes: [14, 18], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Calves & feet / ankles & shins', blurb: 'The forgotten stretch: calves, feet, ankles and shins, fifteen minutes.',
    about: 'The lower legs, which most stretching routines forget. One day stretches the calves and feet; the other works ankle range and the shins with ankle rocks, heel walks and kneeling stretches. Supple calves and ankles help squats, running and sore feet. Both later levels make every hold longer.',
    names: ['Achilles Ease', 'Calf Ease', 'Foot Ease', 'Ankle Ease', 'Shin Ease', 'Heel Drop', 'Toe Point', 'Toe Flex', 'Arch Release', 'Sole', 'Instep Stretch', 'Ball of Foot'],
    cycle: ['calves', 'ankles'],
    dayTypes: {
      calves: { label: 'Calves & feet', short: 'Calves', blocks: [F('Calves & feet', ['forward_fold', 'ankle_rocks', 'fxHam', 'puppy_pose', 'ankle_rocks?'], { scale: 2, cap: 90 })] },
      ankles: { label: 'Ankles & shins', short: 'Ankles', blocks: [C('Ankle range', ['ankle_rocks', 'heel_walk', 'tibialis_raise'], { values: [2, 3] }), F('Stretch', ['kneeling_quad', 'childs_pose', 'ankle_rocks?'])] },
    },
  },
  {
    id: 'splits-30', added: 16, catalogue: 9, days: 30, name: 'Splits 30', subject: 'Flexibility', minutes: [18, 24], equip: 'bw', absSlots: [], levers: [null, 'holds', 'holds'],
    split: 'Front split / middle split, 30 days', blurb: 'A month toward the splits: front split one day, middle split the next.',
    about: 'A month toward the splits. One day works the front split with half splits, lizards and lunges; the next the middle split with frog, butterfly and straddle folds. Each day ends with a long hold in the split itself, as far as you can comfortably go. Every ten days the holds grow longer.',
    names: ['Split Start', 'Split Week', 'Split Ten', 'Split Twenty', 'Split Thirty', 'Split Month', 'Lower Down', 'Closer', 'Nearly', 'Almost', 'Floor Bound', 'Flat'],
    cycle: ['front', 'middle'],
    dayTypes: {
      front: { label: 'Front split', short: 'Front', blocks: [F('Front split', ['fxSplit', 'fxQuad', 'fxSplit', 'fxHam', 'front_split'], { scale: 2, cap: 90 }), F('Hip flexors', ['low_lunge', 'fxQuad', 'fxSplit?'], { scale: 2, cap: 90 })] },
      middle: { label: 'Middle split', short: 'Middle', blocks: [F('Middle split', ['fxStraddle', 'fxHips', 'fxStraddle', 'butterfly', 'seated_straddle'], { scale: 2, cap: 90 }), F('Inner thighs', ['frog_pose', 'fxStraddle', 'fxHips?'], { scale: 2, cap: 90 })] },
    },
  },
  // Balance & stability +4 (abs finish)
  {
    id: 'balance-30', added: 16, catalogue: 9, days: 30, name: 'Balance 30', subject: 'Balance & stability', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Static & strength / dynamic & power, 30 days', blurb: 'A month of balance: still holds and single-leg strength, then moving balance and hops.',
    about: 'A month for steadier balance. One day is still holds and single-leg strength; the next moving balance, reaches and hop-and-stick landings. Every ten days the level steps up: more reps at Level II, harder versions at Level III. Abs finish every session.',
    names: ['Steady One', 'Steady Week', 'Steady Ten', 'Steady Twenty', 'Steady Thirty', 'Steady Month', 'Poise Month', 'Still Month', 'Firm Month', 'Sure Month', 'Grounded Month', 'Rooted Month'],
    cycle: ['still', 'moving'],
    dayTypes: {
      still: { label: 'Static & strength', short: 'Still', blocks: [C('Static & strength', ['blStatic', 'blStrength', 'blStatic', 'blStrength', 'calf_raise_hold?'], { values: [2, 3] })] },
      moving: { label: 'Dynamic & power', short: 'Moving', blocks: [C('Dynamic & power', ['blDynamic', 'blPower', 'blDynamic', 'single_leg_hops', 'blPower?'], { values: [2, 3] })] },
    },
  },
  {
    id: 'balance-calves-feet', added: 16, catalogue: 9, name: 'Feet First', subject: 'Balance & stability', minutes: [22, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Feet & calves / ankles & shins', blurb: 'Balance from the feet up: calves and feet one day, ankles and shins the next.',
    about: 'Good balance starts in the feet. One day trains the calves and feet: single-leg calf raises, raises held on the toes and heel-to-toe walks. The other trains the ankles and shins: tibialis raises, heel walks and single-leg stands. Steadier feet, fewer rolled ankles. Abs finish every session. Both later levels add reps.',
    names: ['Feet First', 'Toe Hold', 'Heel Hold', 'Arch Strength', 'Ankle Strength', 'Foot Strength', 'Sure Foot', 'Steady Foot', 'Firm Foot', 'Grounded Feet', 'Barefoot Balance', 'Foot Notes'],
    cycle: ['feet', 'ankles'],
    dayTypes: {
      feet: { label: 'Feet & calves', short: 'Feet', blocks: [S('Feet & calves', ['single_leg_calf_raise', 'calf_raise_hold', 'heel_to_toe_walk', 'calfBw?'])] },
      ankles: { label: 'Ankles & shins', short: 'Ankles', blocks: [S('Ankles & shins', ['tibialis_raise', 'heel_walk', 'single_leg_stand', 'shin?'])] },
    },
  },
  {
    id: 'balance-strength-plus', added: 16, catalogue: 9, name: 'Strong Balance', subject: 'Balance & stability', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Single-leg loaded / hips & adductors', blurb: 'Balance with load: single-leg lifts with dumbbells, then hip and inner-thigh strength.',
    about: 'Balance that holds up under load. One day is single-leg work with dumbbells: split squats, single-leg deadlifts and step-ups. The other strengthens the hips and inner thighs that keep the knee steady: Copenhagen planks, side-lying adductions and clamshells. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Loaded Stance', 'Heavy Balance', 'Iron Stance', 'Strong Stance', 'Firm Stance', 'Planted', 'Anchored', 'Steady Load', 'Load Bearing', 'Weight Bearing', 'Stable', 'Unshakeable Balance'],
    cycle: ['loaded', 'hips'],
    dayTypes: {
      loaded: { label: 'Single-leg loaded', short: 'Loaded', blocks: [S('Single-leg loaded', ['split_squat', 'single_leg_rdl', 'singleLeg', 'blStrength?'])] },
      hips: { label: 'Hips & adductors', short: 'Hips', blocks: [S('Hips & adductors', ['copenhagen_plank', 'side_lying_adduction', 'clamshell', 'blDynamic?'])] },
    },
  },
  {
    id: 'balance-flow-emom', added: 16, catalogue: 9, name: 'Balance EMOM Plus', subject: 'Balance & stability', minutes: [20, 25], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Still EMOM / moving EMOM', blurb: 'Balance on the minute: still holds one day, moving balance the next.',
    about: 'Balance work on the clock. One day is an EMOM of still holds and single-leg strength; the other of moving balance and hop-and-stick landings. A short, focused session that keeps your feet sharp. Abs finish every session. Level II adds reps and Level III brings harder versions.',
    names: ['Balance Clock', 'Steady Clock', 'Still Clock', 'Move Clock', 'Poise Clock', 'Sure Clock', 'Firm Clock', 'Even Clock', 'Level Clock', 'True Clock', 'Plumb Clock', 'Centre Clock'],
    cycle: ['still', 'moving'],
    dayTypes: {
      still: { label: 'Still EMOM', short: 'Still', blocks: [E('Still EMOM', ['blStatic', 'blStrength', 'blStatic'], { values: [9, 12] })] },
      moving: { label: 'Moving EMOM', short: 'Moving', blocks: [E('Moving EMOM', ['blDynamic', 'blPower', 'blDynamic'], { values: [9, 12] })] },
    },
  },
  // Gentle / low impact +3 (no abs)
  {
    id: 'gentle-30', added: 16, catalogue: 9, days: 30, name: 'Gentle 30', subject: 'Gentle / low impact', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Gentle strength / gentle flow, 30 days', blurb: 'A gentle month: easy strength circuits one day, a calm flow the next.',
    about: 'A gentle month to build a habit. One day is an easy strength circuit: sit-to-stands, wall push-ups, bridges and marches. The next is a calm flow of stretches. No jumping, nothing on the floor that is hard to get up from. Every ten days there are a few more reps.',
    names: ['Easy One', 'Easy Week', 'Easy Ten', 'Easy Twenty', 'Easy Thirty', 'Easy Month', 'Gentle Month', 'Kind Month', 'Soft Month', 'Calm Month Gentle', 'Steady Month Gentle', 'Habit Month'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Gentle strength', short: 'Strength', blocks: [C('Gentle strength', ['gentleStrength', 'gentleCardio', 'gentleStrength', 'gentleBalance', 'gentleStrength?'])] },
      flow: { label: 'Gentle flow', short: 'Flow', blocks: [F('Gentle flow', ['backMove', 'ygRest', 'backMove', 'mbHip', 'backMove', 'mbSpine', 'ygRest', 'ygRest?'])] },
    },
  },
  {
    id: 'gentle-legs-balance', added: 16, catalogue: 9, name: 'Steady Legs', subject: 'Gentle / low impact', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'tempo'],
    split: 'Legs & calves / balance & ankles', blurb: 'Gentle leg strength and balance: legs and calves, then balance and ankles.',
    about: 'Stronger legs and steadier balance, gently. One day is legs and calves: sit-to-stands, calf raises and standing marches. The other is balance and ankles: single-leg stands, heel-to-toe walks and tibialis raises with a hand on the wall. Good for confidence on stairs and uneven ground. Level II adds reps and Level III slows every rep down.',
    names: ['Steady Steps', 'Firm Footing', 'Sure Steps', 'Stair Ready', 'Kerb Ready', 'Garden Path', 'Park Walk', 'Town Walk', 'Sunday Stroll', 'Steady Stroll', 'Easy Stride', 'Gentle Stride'],
    cycle: ['legs', 'balance'],
    dayTypes: {
      legs: { label: 'Legs & calves', short: 'Legs', blocks: [S('Legs & calves', ['sit_to_stand', 'calf_raise', 'standing_march', 'gentleStrength?'])] },
      balance: { label: 'Balance & ankles', short: 'Balance', blocks: [C('Balance & ankles', ['single_leg_stand', 'heel_to_toe_walk', 'tibialis_raise', 'gentleBalance?'])] },
    },
  },
  {
    id: 'gentle-emom', added: 16, catalogue: 9, name: 'Gentle EMOM', subject: 'Gentle / low impact', minutes: [15, 20], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Gentle EMOM A / B', blurb: 'An easy minute at a time: gentle strength and movement on the clock, plenty of rest.',
    about: 'Gentle exercise in small pieces. Each minute starts a short, easy set, wall push-ups, sit-to-stands, marches, step touches, and the rest of the minute is rest. The clock keeps you moving without ever rushing you. Both later levels add a few reps.',
    names: ['Easy Minute', 'Gentle Minute', 'Kind Minute', 'Calm Minute Gentle', 'Soft Minute', 'Slow Minute', 'Easy Clock', 'Gentle Clock', 'Kind Clock', 'Calm Clock', 'Soft Clock', 'Slow Clock'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Gentle EMOM A', short: 'A', blocks: [E('Gentle EMOM', ['wall_pushup', 'sit_to_stand', 'standing_march'], { values: [12, 15, 18] })] },
      b: { label: 'Gentle EMOM B', short: 'B', blocks: [E('Gentle EMOM', ['step_touch', 'glute_bridge', 'gentleBalance'], { values: [12, 15, 18] })] },
    },
  },
  // Back care +3 (no abs)
  {
    id: 'back-care-30', added: 16, catalogue: 9, days: 30, name: 'Back Care 30', subject: 'Back care', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Back strength / back movement, 30 days', blurb: 'A month for a happier back: strength one day, gentle movement the next.',
    about: 'A month for a back that feels better. One day builds the muscles that support it: bird dogs, McGill curl-ups, side planks from the knees and bridges. The next moves it gently through its range with cat-cow, pelvic tilts and open books. Every ten days there are a few more reps. Stop anything that sends pain down a leg.',
    names: ['Back One', 'Back Week', 'Back Ten', 'Back Twenty', 'Back Thirty', 'Back Month', 'Ease Back', 'Kind Back', 'Calm Back', 'Strong Back Month', 'Free Back', 'Happy Back'],
    cycle: ['strength', 'move'],
    dayTypes: {
      strength: { label: 'Back strength', short: 'Strength', blocks: [S('Back strength', ['backStrength', 'backStrength', 'backStrength', 'backStrength?'])] },
      move: { label: 'Back movement', short: 'Move', blocks: [C('Back movement', ['backMove', 'backMove', 'backMove', 'mbHip', 'backMove?'])] },
    },
  },
  {
    id: 'back-hips-glutes', added: 16, catalogue: 9, name: 'Back, Hips & Glutes', subject: 'Back care', minutes: [20, 25], equip: 'bw', absSlots: [], levers: [null, 'reps', 'tempo'],
    split: 'Glutes & core circuit / hips flow', blurb: 'For a back that aches from sitting: glutes and core, then a hip-opening flow.',
    about: 'Much back ache comes from weak glutes and stiff hips. One day is a circuit of glute bridges, frog pumps, clamshells and bird dogs. The other is a gentle flow for the hips and lower back. Level II adds reps and Level III slows every rep down. Stop anything that sends pain down a leg.',
    names: ['Sit Less', 'Stand More', 'Hip Free', 'Glute On', 'Back Ease', 'Desk Hips', 'Chair Back', 'Sofa Back', 'Car Back', 'Long Drive', 'Long Flight', 'Long Day'],
    cycle: ['glutes', 'hips'],
    dayTypes: {
      glutes: { label: 'Glutes & core circuit', short: 'Glutes', blocks: [C('Glutes & core', ['glute_bridge', 'frog_pump', 'clamshell', 'bird_dog', 'backStrength?'])] },
      hips: { label: 'Hips flow', short: 'Hips', blocks: [F('Hips flow', ['knee_hug', 'mbHip', 'backMove', 'figure_four', 'mbHip?']), F('Lower back', ['backMove', 'happy_baby', 'backMove?'])] },
    },
  },
  {
    id: 'upper-back-care', added: 16, catalogue: 9, name: 'Upper Back Care', subject: 'Back care', minutes: [18, 23], equip: 'bw', absSlots: [], levers: [null, 'reps', 'reps'],
    split: 'Upper back strength / neck & shoulder flow', blurb: 'For a stiff upper back and neck: upper-back strength, then a gentle neck and shoulder flow.',
    about: 'For the upper back and neck that stiffen at a desk. One day strengthens the upper back with Y raises, reverse snow angels and prone neck lifts. The other is a gentle flow for the neck and shoulders: chin tucks, thread the needle and open books. Both later levels add reps. Keep the neck work slow and easy.',
    names: ['Upper Ease', 'Neck Ease', 'Shoulder Ease', 'Desk Neck Care', 'Screen Neck', 'Text Neck', 'Hunch Fix', 'Stoop Fix', 'Slump Fix', 'Round Fix', 'Tall Back', 'Proud Back'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Upper back strength', short: 'Strength', blocks: [S('Upper back strength', ['prone_y_raise', 'reverse_snow_angel', 'prone_neck_lift', 'trapsBw?'])] },
      flow: { label: 'Neck & shoulder flow', short: 'Flow', blocks: [F('Neck & shoulder flow', ['chin_tucks', 'thread_the_needle', 'open_book', 'mbShoulder', 'mbShoulder', 'mbSpine', 'childs_pose', 'mbShoulder?'])] },
    },
  },
];

// Hand-written paragraphs for the older programs (newer ones carry theirs as `about:` in the config).
const ABOUT = {
  'core-foundations': 'Core training done properly: resisting arching, resisting twisting, and carrying load. Each day pairs one of those themes with a mobility flow and a little strength. Level II slows every lowering to three seconds and Level III brings harder variations. A solid base for your back and for everything else you lift.',
  'flow-state': 'Longer mobility flows, core circuits and light strength, for how you move more than how much you lift. The days cycle through hips and core, spine and shoulders, and a full flow. Level II slows the movements down and Level III adds reps. Good between harder programs or when you feel stiff.',
  'deep-core-60': 'Slow, long-hold core strength alternating with mobility and loaded carries. One day builds the deep core with holds and control, and the next moves you and makes you carry weight. Level II slows the lowering to three seconds and Level III brings harder variations. For a stronger midsection that also feels good.',
};
CONFIGS.forEach((c) => { if (ABOUT[c.id]) c.about = ABOUT[c.id]; });

// Phase 23: the new programs' ids in shelf order, appended to programs.config.js's ORDER after every older program
CONFIGS.order23 = [];
module.exports = CONFIGS;
