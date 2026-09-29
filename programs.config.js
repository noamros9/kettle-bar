// The program library (issue #4). Each program is 60 days, starts at intermediate, ends every
// workout with abs and gets a matched warm-up and cool-down on top of its time range.
// Blocks: f = straight | superset (slots in pairs) | circuit | emom | amrap | tabata | ladder.
// Slots are pool names from gen-programs.js; a trailing '?' makes the slot optional (dropped if time is short).
// levers[1], levers[2] = how Level II and Level III get harder: reps | weight | variation | tempo.

const S = (title, slots, extra) => ({ f: 'straight', title, slots, ...extra });
const SS = (title, slots, extra) => ({ f: 'superset', title, slots, ...extra });
const C = (title, slots, extra) => ({ f: 'circuit', title, slots, ...extra });
const E = (title, slots, extra) => ({ f: 'emom', title, slots, ...extra });
const A = (title, slots, extra) => ({ f: 'amrap', title, slots, ...extra });
const T = (title, slots, extra) => ({ f: 'tabata', title, slots, ...extra });
const L = (title, slots, extra) => ({ f: 'ladder', title, slots, ...extra });

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
CONFIGS.forEach((c) => { c.about = ABOUT[c.id]; });

module.exports = CONFIGS;
