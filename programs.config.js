// The program library (issue #4). Each program is 60 days, starts at intermediate, ends every
// workout with abs (unless absSlots: [], as in yoga) and gets a matched warm-up and cool-down on top of its time range.
// Blocks: f = straight | superset (slots in pairs) | circuit | emom | amrap | tabata | ladder | flow (guided poses)
// | bouts (boxing: one combo per bout).
// Slots are pool names from program-builder.js (or exercise ids); a trailing '?' makes the slot optional (dropped if
// time is short). A block's scale: n makes its holds n times longer (yin), up to cap seconds.
// levers[1], levers[2] = how Level II and Level III get harder: reps | holds | weight | variation | tempo.
// about: the hand-written paragraph (3–6 sentences); older programs keep theirs in ABOUT below.
// added: 5 marks a program from Phase 5; only such programs may use exercises marked added: 5.

const S = (title, slots, extra) => ({ f: 'straight', title, slots, ...extra });
const SS = (title, slots, extra) => ({ f: 'superset', title, slots, ...extra });
const C = (title, slots, extra) => ({ f: 'circuit', title, slots, ...extra });
const E = (title, slots, extra) => ({ f: 'emom', title, slots, ...extra });
const A = (title, slots, extra) => ({ f: 'amrap', title, slots, ...extra });
const T = (title, slots, extra) => ({ f: 'tabata', title, slots, ...extra });
const L = (title, slots, extra) => ({ f: 'ladder', title, slots, ...extra });
const F = (title, slots, extra) => ({ f: 'flow', title, slots, ...extra });
const SUN = F('Sun salutations', ['sun_salutation']);
const B = (title, slots, extra) => ({ f: 'bouts', title, slots, ...extra }); // one combo per 3-minute bout
const ONCE = { values: [1] }; // a flow done once through (the hundred opens a Pilates session once)

const UPPER = S('Upper body', ['pushLoad', 'row', 'shoulders', 'arms', 'push?']);

const CONFIGS = [
  // ---------------- SIGNATURE ----------------
  {
    id: 'three-split-60', name: 'Three-Split 60', subject: 'Signature', frozen: 'programs/three-split-60.json',
    split: 'Chest & back / full body / abs & cardio', minutes: [26, 38],
    dayTypes: {
      cba: { label: 'Chest, back & abs', short: 'Chest · Back' },
      up: { label: 'Full body · upper focus', short: 'Upper body' },
      low: { label: 'Full body · lower focus', short: 'Lower body' },
      ac: { label: 'Abs & cardio', short: 'Abs · Cardio' },
    },
  },

  // ---------------- SIGNATURE (like Three-Split 60: straight sets, strength days 35–38 min, abs & cardio days 26–31 min) ----------------
  ...(() => {
    const STR = [34.5, 38.4], AC = [25.5, 31.4];
    const ABS3 = ['absW', 'abs', 'abs'];
    const acDay = { label: 'Abs & cardio', short: 'Abs · Cardio', minutes: AC, blocks: [S('Cardio & core', ['cardio', 'abs', 'cardio', 'abs', 'cardio'])] };
    const base = { subject: 'Signature', minutes: [26, 38], absSlots: ABS3 };
    return [
      { ...base, id: 'four-split-60', name: 'Four-Split 60', levers: [null, 'reps', 'weight'], split: 'Push / pull-ups & back / legs / abs & cardio',
        blurb: 'Your Three-Split rhythm stretched to four days: push, pull-ups & back, legs, then abs & cardio. Straight sets, abs to finish.',
        names: ['Keystone', 'Cornerstone', 'Lintel', 'Plinth', 'Rampart', 'Corbel', 'Parapet', 'Bastion', 'Buttress', 'Portcullis', 'Barbican', 'Gatehouse', 'Turret', 'Merlon', 'Embrasure', 'Postern', 'Donjon', 'Battlement', 'Moat', 'Citadel Wall'],
        cycle: ['push', 'pull', 'legs', 'ac'],
        dayTypes: {
          push: { label: 'Push', short: 'Push', minutes: STR, blocks: [S('Push', ['pushLoad', 'push', 'shoulders', 'triceps', 'push?'])] },
          pull: { label: 'Pull-ups & back', short: 'Pull', minutes: STR, blocks: [S('Pull-ups & back', ['pullBarMain', 'row', 'pullBar', 'row', 'biceps?'])] },
          legs: { label: 'Legs', short: 'Legs', minutes: STR, blocks: [S('Legs', ['squat', 'hinge', 'lunge', 'glute', 'total?'])] },
          ac: acDay,
        } },
      { ...base, id: 'two-split-60', name: 'Two-Split 60', levers: [null, 'weight', 'reps'], split: 'Upper + abs / lower + abs',
        blurb: 'Strength-heavy: alternating upper-body and lower-body days, each finished with abs. Straight sets, familiar rests.',
        names: ['North', 'South', 'Zenith', 'Nadir', 'Meridian', 'Equator', 'Tropic', 'Solstice', 'Equinox', 'Horizon', 'Latitude', 'Longitude', 'Polaris', 'Compass', 'Bearing', 'Azimuth', 'Waypoint', 'Landmark', 'True North', 'Pole Star'],
        cycle: ['upper', 'lower'],
        dayTypes: {
          upper: { label: 'Upper body + abs', short: 'Upper', minutes: STR, blocks: [S('Upper body', ['pushLoad', 'pullBarMain', 'shoulders', 'row', 'arms?'])] },
          lower: { label: 'Lower body + abs', short: 'Lower', minutes: STR, blocks: [S('Lower body', ['squat', 'hinge', 'singleLeg', 'glute', 'total?'])] },
        } },
      { ...base, id: 'five-split-60', name: 'Five-Split 60', levers: [null, 'reps', 'weight'], split: 'Chest / back / legs / shoulders & arms / abs & cardio',
        blurb: 'A body-part split: chest, back, legs, shoulders & arms, then abs & cardio. Each muscle gets its own day.',
        names: ['Quintet', 'Pentagon', 'Starfish', 'Five Points', 'Handful', 'Fivefold', 'Pentathlon', 'Quincunx', 'Five Stones', 'Pentagram', 'Five Rings', 'Quinary', 'High Five', 'Cinquain', 'Pentatonic', 'Five Oaks', 'Fifth Gear', 'Five Peaks', 'Quint', 'Five Fathoms'],
        cycle: ['chest', 'back', 'legs', 'arms', 'ac'],
        dayTypes: {
          chest: { label: 'Chest', short: 'Chest', minutes: STR, blocks: [S('Chest', ['pushLoad', 'push', 'push', 'pushLoad', 'triceps?'])] },
          back: { label: 'Back', short: 'Back', minutes: STR, blocks: [S('Back', ['pullBarMain', 'row', 'row', 'pullBar', 'biceps?'])] },
          legs: { label: 'Legs', short: 'Legs', minutes: STR, blocks: [S('Legs', ['squat', 'hinge', 'lunge', 'glute', 'singleLeg?'])] },
          arms: { label: 'Shoulders & arms', short: 'Arms', minutes: STR, blocks: [S('Shoulders & arms', ['shoulders', 'biceps', 'triceps', 'shoulders', 'arms?'])] },
          ac: acDay,
        } },
      { ...base, id: 'full-body-duo-60', name: 'Full-Body Duo 60', levers: [null, 'reps', 'variation'], split: 'Full body + abs / abs & cardio',
        blurb: 'Two-day rhythm: a full-body strength day, then an abs & cardio day. Simple and repeatable.',
        names: ['Tandem', 'Duet', 'Twin Peaks', 'Gemini', 'Pairing', 'Double Act', 'Yin', 'Yang', 'Bookends', 'Mirror', 'Echo Pair', 'Binary', 'Doublet', 'Couplet', 'Twofold', 'Dyad', 'Partners', 'Side by Side', 'Counterpart', 'Both Ways'],
        cycle: ['full', 'ac'],
        dayTypes: {
          full: { label: 'Full body + abs', short: 'Full body', minutes: STR, blocks: [S('Full body', ['squat', 'pushLoad', 'hinge', 'row', 'total?'])] },
          ac: acDay,
        } },
    ];
  })(),

  // ---------------- STRENGTH (40 min) ----------------
  {
    id: 'iron-ppl', name: 'Iron PPL', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'tempo'],
    split: 'Push / pull / legs', blurb: 'Classic push, pull and legs days with heavier dumbbell and kettlebell work in straight sets.',
    names: ['Anvil', 'Crucible', 'Ingot', 'Forge', 'Tempered', 'Wrought', 'Cast', 'Rivet', 'Alloy', 'Smelter', 'Bellows', 'Hammerfall', 'Quench', 'Slag', 'Billet', 'Ore', 'Foundry', 'Girder', 'Carbon', 'Steelyard'],
    cycle: ['push', 'pull', 'legs'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [S('Push', ['pushLoad', 'push', 'shoulders', 'triceps', 'push?'])] },
      pull: { label: 'Pull', short: 'Pull', blocks: [S('Pull', ['pullBarMain', 'row', 'row', 'biceps', 'pullBar?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat', 'hinge', 'lunge', 'glute', 'total?'])] },
    },
  },
  {
    id: 'upper-lower-power', name: 'Upper/Lower Power', subject: 'Strength', minutes: [38, 42], levers: [null, 'tempo', 'variation'],
    split: 'Upper / lower', blurb: 'Alternating upper and lower days built from supersets: two exercises back to back, then rest.',
    names: ['Everest', 'Denali', 'Aconcagua', 'Kilimanjaro', 'Elbrus', 'Matterhorn', 'Eiger', 'Hermon', 'Olympus', 'Etna', 'Fuji', 'Rainier', 'Whitney', 'Kosciuszko', 'Annapurna', 'Blanc', 'Vinson', 'Logan', 'Cotopaxi', 'Ararat'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper body', short: 'Upper', blocks: [SS('Upper supersets', ['pushLoad', 'row', 'shoulders', 'pullBar', 'triceps', 'biceps'])] },
      lower: { label: 'Lower body', short: 'Lower', blocks: [SS('Lower supersets', ['squat', 'glute', 'lunge', 'hinge', 'singleLeg', 'total'])] },
    },
  },
  {
    id: 'full-body-strength', name: 'Full-Body Strength 3×', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'variation'],
    split: 'Full body A / B / C', blurb: 'Three rotating full-body days of heavy compound pairs as supersets.',
    names: ['Orion', 'Lyra', 'Cygnus', 'Draco', 'Perseus', 'Aquila', 'Pegasus', 'Cassiopeia', 'Andromeda', 'Hydra', 'Carina', 'Vela', 'Centaurus', 'Corvus', 'Auriga', 'Bootes', 'Cepheus', 'Scorpius', 'Leo', 'Taurus'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Day A · squat & press', short: 'A', blocks: [SS('Strength pairs', ['squat', 'pushLoad', 'hinge', 'row']), S('Accessory', ['arms', 'shoulders?'])] },
      b: { label: 'Day B · hinge & pull', short: 'B', blocks: [SS('Strength pairs', ['hinge', 'push', 'lunge', 'pullBarMain']), S('Accessory', ['arms', 'row?'])] },
      c: { label: 'Day C · single leg & total', short: 'C', blocks: [SS('Strength pairs', ['singleLeg', 'shoulders', 'total', 'row']), S('Accessory', ['glute', 'push?'])] },
    },
  },

  // ---------------- PULL-UPS (35 min) ----------------
  {
    id: 'pullup-ladder', name: 'Pull-Up Ladder', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'variation'],
    split: 'Upper / lower', blurb: 'Upper days open with a pull-up ladder (1, 2, 3… reps), plus negatives and holds; lower days keep the legs strong.',
    gear: 'Optional: a resistance band for assisted reps', names: ['Rung', 'Crag', 'Belay', 'Carabiner', 'Summit Push', 'Traverse', 'Chimney', 'Overhang', 'Crux', 'Dyno', 'Jug', 'Crimp', 'Arete', 'Bouldering', 'Rappel', 'Topout', 'Ledge', 'Scramble', 'Handhold', 'Cornice'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper · pull-up ladder', short: 'Upper', blocks: [L('Pull-up ladder', ['pullBarMain']), S('Upper', ['row', 'push', 'pullBar', 'biceps?'])] },
      lower: { label: 'Lower body', short: 'Lower', blocks: [S('Lower', ['squat', 'hinge', 'lunge', 'glute', 'dead_hang?'])] },
    },
  },
  {
    id: 'bar-master', name: 'Bar Master', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'tempo', 'variation'],
    split: 'Full body A / B / C', blurb: 'Every day starts with a pull-up EMOM: a few quality reps at the top of each minute, then full-body strength.',
    gear: 'Optional: a resistance band for assisted reps', names: ['Falcon', 'Kestrel', 'Osprey', 'Harrier', 'Condor', 'Swift', 'Heron', 'Raven', 'Albatross', 'Merlin', 'Hawk', 'Eagle', 'Kite', 'Petrel', 'Shrike', 'Gannet', 'Hobby', 'Buzzard', 'Tern', 'Owl'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Day A', short: 'A', blocks: [E('Pull-up EMOM', ['pullBarMain', 'push'], { values: [8, 10, 12] }), S('Strength', ['squat', 'row', 'hinge?'])] },
      b: { label: 'Day B', short: 'B', blocks: [E('Pull-up EMOM', ['pullBar', 'pullBarMain'], { values: [8, 10, 12] }), S('Strength', ['lunge', 'pushLoad', 'glute?'])] },
      c: { label: 'Day C', short: 'C', blocks: [E('Pull-up EMOM', ['pullBarMain', 'core'], { values: [8, 10, 12] }), S('Strength', ['hinge', 'shoulders', 'squat?'])] },
    },
  },
  {
    id: 'grip-and-hang', name: 'Grip & Hang', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'weight', 'reps'],
    split: 'Push / pull / legs', blurb: 'Pull days mix chin-ups, hangs and holds with rows as supersets; push and legs days keep everything balanced.',
    names: ['Oak', 'Cedar', 'Birch', 'Willow', 'Cypress', 'Maple', 'Olive', 'Pine', 'Sequoia', 'Acacia', 'Baobab', 'Juniper', 'Rowan', 'Elm', 'Sycamore', 'Linden', 'Laurel', 'Carob', 'Ash', 'Fig'],
    cycle: ['push', 'pull', 'legs'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [S('Push', ['pushLoad', 'push', 'shoulders', 'triceps'])] },
      pull: { label: 'Pull · grip', short: 'Pull', blocks: [SS('Pull supersets', ['pullBarMain', 'row', 'pullBar', 'row', 'dead_hang', 'biceps'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat', 'hinge', 'lunge', 'glute'])] },
    },
  },

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

  // ---------------- KETTLEBELL ONLY (30 min) ----------------
  {
    id: 'one-bell', name: 'One Bell', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Kettlebell A / B / C', blurb: 'Everything with one bell: swings, cleans, presses, squats and get-ups in straight sets.',
    gear: 'Level III: a 20–24 kg kettlebell helps', names: ['Chime', 'Toll', 'Peal', 'Carillon', 'Clapper', 'Knell', 'Gong', 'Ring', 'Tintinnabulum', 'Belfry', 'Tocsin', 'Angelus', 'Cowbell', 'Handbell', 'Campanile', 'Echo', 'Resonance', 'Timbre', 'Tolling', 'Vesper'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Swing & press', short: 'A', blocks: [S('Kettlebell', ['kbBallistic', 'kbUpper', 'kbLower', 'kbAll?'])] },
      b: { label: 'Squat & pull', short: 'B', blocks: [S('Kettlebell', ['kbLower', 'kbBallistic', 'kbUpper', 'kbAll?'])] },
      c: { label: 'Get-up day', short: 'C', blocks: [S('Kettlebell', ['turkish_getup', 'kbBallistic', 'kbLower', 'kbUpper?'])] },
    },
  },
  {
    id: 'bell-complexes', name: 'Bell Complexes', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'variation'],
    split: 'Kettlebell A / B', blurb: 'Kettlebell complexes as EMOMs: chain several moves each minute without putting the bell down, then strength work.',
    gear: 'Level III: a 20–24 kg kettlebell helps', names: ['Allegro', 'Crescendo', 'Staccato', 'Legato', 'Fortissimo', 'Presto', 'Vivace', 'Sforzando', 'Cadenza', 'Rondo', 'Fugue', 'Coda', 'Overture', 'Scherzo', 'Tremolo', 'Glissando', 'Ostinato', 'Rubato', 'Toccata', 'Finale'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Complex A', short: 'A', blocks: [E('Complex EMOM', ['kbBallistic', 'kbUpper', 'kbLower'], { values: [10, 12, 14, 16] }), S('Strength', ['kbLower', 'kbUpper?'])] },
      b: { label: 'Complex B', short: 'B', blocks: [E('Complex EMOM', ['kbLower', 'kbBallistic', 'kbUpper'], { values: [10, 12, 14, 16] }), S('Strength', ['kbUpper', 'kbLower?'])] },
    },
  },
  {
    id: 'swing-century', name: 'Swing Century', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'reps'],
    split: 'Swing EMOM + strength', blurb: 'A swing EMOM every day that builds toward 100+ swings, plus presses and squats.',
    names: ['Pendulum', 'Arc', 'Momentum', 'Hip Drive', 'Snap', 'Float', 'Hike', 'Lockout', 'Centurion', 'Metronome', 'Swingset', 'Recoil', 'Backswing', 'Apex', 'Rebound', 'Velocity', 'Hundred', 'Drive Train', 'Launch', 'Whip'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Swings + upper', short: 'A', blocks: [E('Swing EMOM', ['kbSwing'], { values: [6, 8, 10, 12, 14] }), S('Strength', ['kbUpper', 'kbLower'])] },
      b: { label: 'Swings + lower', short: 'B', blocks: [E('Swing EMOM', ['kbSwing'], { values: [6, 8, 10, 12, 14] }), S('Strength', ['kbLower', 'kbUpper'])] },
    },
  },

  // ---------------- BUSY WEEK (20 min) ----------------
  {
    id: 'twenty-flat', name: '20 Flat', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'reps', 'tempo'], absSlots: ['absW', 'abs?'],
    split: 'Full body A / B', blurb: 'Twenty-minute full-body supersets for tight days.',
    names: ['Espresso', 'Lunch Break', 'Quick Draw', 'Sprint', 'Flash', 'Express', 'Shortcut', 'Snap Shot', 'Dash', 'Blitz', 'Rush Hour', 'Commute', 'Fast Lane', 'Split Second', 'Turnaround', 'Pit Stop', 'Countdown', 'Buzzer', 'Stopwatch', 'Photo Finish'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Full body A', short: 'A', blocks: [SS('Supersets', ['squat', 'push', 'hinge', 'row'], { values: [2, 3, 4] })] },
      b: { label: 'Full body B', short: 'B', blocks: [SS('Supersets', ['lunge', 'pushLoad', 'glute', 'pullBarMain'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'minute-man', name: 'Minute Man', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'reps', 'variation'], absSlots: ['absW', 'abs?'],
    split: 'EMOM only', blurb: 'One EMOM a day: a new exercise at the top of every minute, then abs. No rest to plan.',
    names: ['Tick', 'Tock', 'Chronograph', 'Escapement', 'Balance Wheel', 'Mainspring', 'Bezel', 'Crown', 'Dial', 'Sweep', 'Lug', 'Jewel', 'Tourbillon', 'Pendulum Clock', 'Sundial', 'Hourglass', 'Metronome Beat', 'Quartz Tick', 'Stopclock', 'Minute Hand'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('EMOM', ['total', 'push', 'squat', 'row'], { values: [10, 12, 14, 16] })] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('EMOM', ['kbBallistic', 'pullBarMain', 'lunge', 'cardio'], { values: [10, 12, 14, 16] })] },
      c: { label: 'EMOM C', short: 'C', blocks: [E('EMOM', ['hinge', 'shoulders', 'cardio', 'core'], { values: [10, 12, 14, 16] })] },
    },
  },
  {
    id: 'twenty-ladder', name: 'Twenty Ladder', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'reps', 'variation'], absSlots: ['absW', 'abs?'],
    split: 'Two ladders a day', blurb: 'Rep ladders against the clock: 1 rep of each move, then 2, then 3… climb as high as you can before time runs out.',
    names: ['Step Up', 'Stairwell', 'Escalator', 'Staircase', 'Landing', 'Mezzanine', 'Loft', 'Tower', 'Spire', 'Minaret', 'Lighthouse', 'Belvedere', 'Ziggurat', 'Terrace', 'Balcony', 'Rooftop', 'Attic', 'Skylight', 'Penthouse', 'Crow\'s Nest'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Push & squat ladders', short: 'A', blocks: [L('Ladder 1', ['push', 'squat']), L('Ladder 2', ['row', 'hinge'])] },
      b: { label: 'Pull & lunge ladders', short: 'B', blocks: [L('Ladder 1', ['pullBarMain', 'lunge']), L('Ladder 2', ['pushLoad', 'glute'])] },
    },
  },

  // ---------------- BODYWEIGHT / TRAVEL (25 min) ----------------
  {
    id: 'hotel-room', name: 'Hotel Room', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Full body circuits', blurb: 'Only a mat or a towel. Full-body circuits for trips and days away from your weights.',
    names: ['Lisbon', 'Kyoto', 'Reykjavik', 'Marrakesh', 'Oslo', 'Hanoi', 'Cusco', 'Tbilisi', 'Valletta', 'Porto', 'Seville', 'Tallinn', 'Ljubljana', 'Bruges', 'Split', 'Havana', 'Queenstown', 'Kotor', 'Hoi An', 'Eilat'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Circuit', ['push', 'legsBw', 'core', 'cardio', 'legsBw'])] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Circuit', ['legsBw', 'push', 'cardio', 'core', 'push'])] },
    },
  },
  {
    id: 'skill-ladder', name: 'Skill Ladder', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'tempo'],
    split: 'Skill A / B', blurb: 'Bodyweight skill progressions: archer push-ups, shrimp squats, hollow rocks. Harder versions arrive at Level II.',
    names: ['White Belt', 'Kata', 'Dojo', 'Kihon', 'Kumite', 'Sensei', 'Shodan', 'Randori', 'Tatami', 'Bushido', 'Kiai', 'Zanshin', 'Mushin', 'Kobudo', 'Ukemi', 'Senpai', 'Hanshi', 'Kyoshi', 'Renshi', 'Black Belt'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Push & legs skills', short: 'A', blocks: [S('Skills', ['push', 'legsBw', 'push', 'core'])] },
      b: { label: 'Legs & core skills', short: 'B', blocks: [S('Skills', ['legsBw', 'push', 'legsBw', 'core'])] },
    },
  },
  {
    id: 'no-gear-burn', name: 'No-Gear Burn', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Upper / lower', blurb: 'Bodyweight supersets with a short AMRAP burnout at the end.',
    names: ['Ember', 'Kindling', 'Blaze', 'Wildfire', 'Inferno', 'Flare', 'Scorch', 'Cinder', 'Firestorm', 'Beacon', 'Bonfire', 'Afterglow', 'Tinder', 'Smoulder', 'Torch', 'Pyre', 'Sparkler', 'Firewalk', 'Heatwave', 'Phoenix'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper burn', short: 'Upper', blocks: [SS('Supersets', ['push', 'core', 'push', 'cardio']), A('AMRAP burnout', ['cardio', 'push'], { values: [4, 5, 6] })] },
      lower: { label: 'Lower burn', short: 'Lower', blocks: [SS('Supersets', ['legsBw', 'cardio', 'legsBw', 'core']), A('AMRAP burnout', ['cardio', 'legsBw'], { values: [4, 5, 6] })] },
    },
  },

  // ---------------- LEGS & GLUTES (35 min) ----------------
  {
    id: 'lower-focus', name: 'Lower Focus', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'weight', 'variation'],
    split: 'Legs, legs, upper', blurb: 'Two lower-body days for every upper day, in straight sets.',
    names: ['Root', 'Taproot', 'Trunk', 'Bough', 'Stump', 'Rhizome', 'Bulb', 'Tuber', 'Stem', 'Stalk', 'Canopy', 'Seedling', 'Sapling', 'Grove', 'Orchard', 'Thicket', 'Meadow', 'Pasture', 'Terraces', 'Vineyard'],
    cycle: ['l1', 'l2', 'up'],
    dayTypes: {
      l1: { label: 'Legs · squat focus', short: 'Legs', blocks: [S('Legs', ['squat', 'hinge', 'lunge', 'glute', 'total?'])] },
      l2: { label: 'Legs · single leg', short: 'Legs', blocks: [S('Legs', ['singleLeg', 'hinge', 'squat', 'glute', 'lunge?'])] },
      up: { label: 'Upper body', short: 'Upper', blocks: [UPPER] },
    },
  },
  {
    id: 'posterior-chain', name: 'Posterior Chain', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'tempo', 'weight'],
    split: 'Hinge, glute, upper', blurb: 'Glute and hamstring emphasis with slow lowering and pauses.',
    names: ['Arch', 'Span', 'Truss', 'Pylon', 'Cantilever', 'Suspension', 'Keystone', 'Viaduct', 'Aqueduct', 'Causeway', 'Drawbridge', 'Footbridge', 'Pontoon', 'Trestle Span', 'Girder Span', 'Abutment', 'Pier', 'Deck', 'Cable Stay', 'Golden Gate'],
    cycle: ['hinge', 'glute', 'up'],
    dayTypes: {
      hinge: { label: 'Hinge day', short: 'Hinge', blocks: [S('Posterior chain', ['hinge', 'glute', 'hinge', 'singleLeg', 'glute?'])] },
      glute: { label: 'Glute day', short: 'Glute', blocks: [S('Glutes & legs', ['glute', 'squat', 'hinge', 'lunge', 'glute?'])] },
      up: { label: 'Upper body', short: 'Upper', blocks: [UPPER] },
    },
  },
  {
    id: 'single-leg-strong', name: 'Single-Leg Strong', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'variation', 'tempo'],
    split: 'Legs, legs, upper', blurb: 'Split squats, single-leg deadlifts and pistol-style progressions for balanced legs.',
    names: ['Heron Stand', 'Flamingo', 'Crane', 'Stork', 'Egret', 'Ibis', 'Spoonbill', 'Avocet', 'Stilt', 'Plover', 'Sandpiper', 'Curlew', 'Godwit', 'Lapwing', 'Bittern', 'Kingfisher', 'Hoopoe', 'Bee-eater', 'Roller', 'Wagtail'],
    cycle: ['l1', 'l2', 'up'],
    dayTypes: {
      l1: { label: 'Single leg A', short: 'Legs', blocks: [S('Single-leg strength', ['singleLeg', 'singleLeg', 'hinge', 'glute', 'singleLeg?'])] },
      l2: { label: 'Single leg B', short: 'Legs', blocks: [S('Single-leg strength', ['singleLeg', 'squat', 'singleLeg', 'glute', 'lunge?'])] },
      up: { label: 'Upper body', short: 'Upper', blocks: [UPPER] },
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
];

// ---------- program paragraphs (hand-written): what it trains, how it's built, how it gets harder, who it suits ----------
// The first sentence stands alone: program cards show only that.
const ABOUT = {
  'three-split-60': 'A balanced three-day cycle that trains every muscle twice a week and ends each workout with abs. Day one is chest and back, day two full body (alternating an upper and a lower focus), day three abs and cardio. Everything is straight sets with 30-second rests, using dumbbells, one kettlebell, a pull-up bar and a mat. Level I starts at an intermediate level, and Levels II and III add reps. A good home base if you want steady all-round strength.',
  'four-split-60': 'Your Three-Split rhythm stretched to four days, so each area gets more attention. The cycle runs push, pull-ups and back, legs, then abs and cardio, all as straight sets with abs to finish. Level II adds reps and Level III moves you one weight up. Suits you once three days feel familiar and you want more volume per muscle.',
  'two-split-60': 'A strength-leaning two-day rhythm: upper body, then lower body, each finished with abs. The straight sets and rests are the ones you know, with fewer exercises done more seriously. Level II moves you one weight up and Level III adds reps on top. Good when you want to feel stronger rather than more tired.',
  'five-split-60': 'A classic body-part split where each muscle group gets its own day. Chest, back, legs, shoulders and arms, then abs and cardio, in straight sets with abs to close. Level II adds reps and Level III moves you one weight up. Suits you if you like focused sessions and training most days.',
  'full-body-duo-60': 'The simplest rhythm here: a full-body strength day, then an abs and cardio day, repeated. Straight sets keep it easy to follow, and every workout ends with abs. Level II adds reps and Level III brings harder variations of the same moves. Good for busy stretches when you just want to keep going.',
  'iron-ppl': 'Push, pull and legs days built around heavier dumbbell and kettlebell work. Each session is longer straight sets with fewer, bigger exercises and abs to finish. Level II moves you one weight up, and Level III slows every lowering to three seconds. For building strength when you have 40 minutes.',
  'upper-lower-power': 'Upper and lower days built from supersets: two exercises back to back, then rest. Pairing moves fits more work into the time and keeps the heart rate up. Level II slows the lowering to three seconds and Level III brings harder variations. Suits you if straight sets feel slow.',
  'full-body-strength': 'Three rotating full-body days of heavy compound lifts, mostly as supersets. Day A is squat and press, B hinge and pull, C single-leg and total-body work. Level II moves you one weight up and Level III brings harder variations. Good for strength with every muscle trained every session.',
  'pullup-ladder': 'Built to raise your pull-up count, with upper days that open on a pull-up ladder. The ladder climbs one rep, then two, then three, with negatives and holds after it; lower days keep the legs strong. Level II adds reps and Level III brings harder bar variations. For when four or five pull-ups is where you are now.',
  'bar-master': 'Every day starts with a pull-up EMOM: a few quality reps at the top of each minute. Full-body strength work follows, across three rotating days. Level II slows the lowering to three seconds and Level III brings harder bar variations. Suits you if you want frequent, fresh pull-up practice.',
  'grip-and-hang': 'Pull days built around your grip: chin-ups, hangs and holds, paired with rows. Push and legs days keep the rest balanced, in straight sets and supersets. Level II moves you one weight up and Level III adds reps. Good if hanging on is what stops your pull-ups.',
  'engine': 'Full-body circuits with short rests, finished by an AMRAP: as many rounds as you can in a few minutes. Two circuit days alternate, each about 25 minutes. Level II adds reps and Level III brings harder variations. For fitness and sweat more than maximum strength.',
  'storm-front': 'Kettlebell EMOMs one day, bodyweight Tabatas the next. The EMOMs build steady power, and the Tabatas are 20 seconds hard and 10 seconds rest, eight times over. Level II adds reps and Level III brings harder variations. Suits you if you like intervals and a clock to chase.',
  'tabata-ten': 'Tabata blocks, 20 seconds hard and 10 seconds rest, followed by a kettlebell AMRAP. Three days rotate: legs and cardio, upper and cardio, and total body. Level II adds reps and Level III moves the finisher one weight up. Short, hard sessions for conditioning.',
  'core-foundations': 'Core training done properly: resisting arching, resisting twisting, and carrying load. Each day pairs one of those themes with a mobility flow and a little strength. Level II slows every lowering to three seconds and Level III brings harder variations. A solid base for your back and for everything else you lift.',
  'flow-state': 'Longer mobility flows, core circuits and light strength, for how you move more than how much you lift. The days cycle through hips and core, spine and shoulders, and a full flow. Level II slows the movements down and Level III adds reps. Good between harder programs or when you feel stiff.',
  'deep-core-60': 'Slow, long-hold core strength alternating with mobility and loaded carries. One day builds the deep core with holds and control, and the next moves you and makes you carry weight. Level II slows the lowering to three seconds and Level III brings harder variations. For a stronger midsection that also feels good.',
  'one-bell': 'Everything with one kettlebell: swings, cleans, presses, squats and get-ups. Three days rotate in straight sets: swing and press, squat and pull, and a get-up day. Level II adds reps and Level III moves you to the heavier bell. Suits you when the kettlebell is all you want to set up.',
  'bell-complexes': 'Kettlebell complexes as EMOMs: chain several moves each minute without putting the bell down. Strength work in straight sets follows the complex, on two alternating days. Level II adds reps and Level III brings harder variations. For grip, conditioning and flow with one bell.',
  'swing-century': 'A swing EMOM every day that builds toward a hundred swings and more. Presses and squats follow, alternating an upper-body and a lower-body day. Levels II and III both add reps, mostly to the swings. Good for hips, grip and conditioning in half an hour.',
  'twenty-flat': 'Twenty-minute full-body supersets for tight days. Two workouts alternate, each built from pairs done back to back, then abs. Level II adds reps and Level III slows the lowering to three seconds. For weeks when twenty minutes is all there is.',
  'minute-man': 'One EMOM a day: a new exercise at the top of every minute, then abs. The clock runs the whole session, so there is no rest to plan. Level II adds reps and Level III brings harder variations. Suits you if you like a timer telling you what to do.',
  'twenty-ladder': 'Rep ladders against the clock: one rep of each move, then two, then three, as high as you can climb. Two ladders a day, pairing push and squat or pull and lunge. Level II adds reps and Level III brings harder variations. Short, competitive sessions that track your progress by where you reach.',
  'hotel-room': 'Only a mat or a towel needed: full-body circuits for trips and days away from your weights. Two circuits alternate, each about 25 minutes of bodyweight work. Level II adds reps and Level III slows the lowering to three seconds. For keeping the habit on the road.',
  'skill-ladder': 'Bodyweight skills step by step: archer push-ups, shrimp squats, hollow rocks and more. Two days alternate in straight sets, one for push and legs and one for legs and core. Level II brings harder versions and Level III slows them down. For getting stronger with nothing but your body and patience.',
  'no-gear-burn': 'Bodyweight supersets with a short AMRAP burnout at the end. Upper and lower days alternate, with no equipment at all. Level II adds reps and Level III brings harder variations. Good for sweat and effort anywhere.',
  'lower-focus': 'Two lower-body days for every upper day, in straight sets. One leg day focuses on squats and the other on single-leg work, and the upper day keeps you balanced. Level II moves you one weight up and Level III brings harder variations. For stronger legs without neglecting the rest.',
  'posterior-chain': 'Glute and hamstring emphasis, with slow lowering and pauses. The cycle runs a hinge day, a glute day and an upper-body day, in straight sets. Level II slows every lowering to three seconds and Level III moves you one weight up. Good for your back, your sprint and how you stand.',
  'single-leg-strong': 'Split squats, single-leg deadlifts and pistol-style progressions, for legs that work evenly. Two single-leg days and an upper-body day rotate in straight sets. Level II brings harder variations and Level III slows the lowering to three seconds. Suits you if one side feels weaker, or balance is your next step.',
};
CONFIGS.forEach((c) => { if (ABOUT[c.id]) c.about = ABOUT[c.id]; });

module.exports = CONFIGS;
