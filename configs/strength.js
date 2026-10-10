const { S, SS, C, E, A, T, L } = require('./shared.js');

const UPPER = S('Upper body', ['pushLoad', 'row', 'shoulders', 'arms', 'push?']);

// The frozen original (its days are read from JSON, ADR 1). Its two variations are generated look-alikes of it (below).
const THREE_SPLIT = {
  id: 'three-split-60', name: 'Three-Split 60', subject: 'Signature', frozen: 'programs/three-split-60.json',
  split: 'Chest & back / full body / abs & cardio', minutes: [26, 38],
  dayTypes: {
    cba: { label: 'Chest, back & abs', short: 'Chest · Back' },
    up: { label: 'Full body · upper focus', short: 'Upper body' },
    low: { label: 'Full body · lower focus', short: 'Lower body' },
    ac: { label: 'Abs & cardio', short: 'Abs · Cardio' },
  },
};

const CONFIGS = [
  // ---------------- SIGNATURE ----------------
  THREE_SPLIT,
  // ---------------- SIGNATURE (like Three-Split 60: straight sets, strength days 35–38 min, abs & cardio days 26–31 min;
  // each original has two variations, Tempo and Harder moves: the same split, only how it gets harder differs) ----------------
  ...(() => {
    const STR = [34.5, 38.4], AC = [25.5, 31.4];
    const ABS3 = ['absW', 'abs', 'abs'];
    const acDay = { label: 'Abs & cardio', short: 'Abs · Cardio', minutes: AC, blocks: [S('Cardio & core', ['cardio', 'abs', 'cardio', 'abs', 'cardio'])] };
    const base = { subject: 'Signature', minutes: [26, 38], absSlots: ABS3 };
    // Three-Split 60 is frozen, so its variations start from this generated look-alike: its four day types, its six-day cycle
    // (upper focus on days 2, 8, 14…, lower focus on 5, 11, 17…) and its time ranges, built from the same pools as the others.
    const threeSplitLike = {
      ...base, split: THREE_SPLIT.split, cycle: ['cba', 'up', 'ac', 'cba', 'low', 'ac'],
      names: ['Hammer', 'Chisel', 'Lathe', 'Plane', 'Rasp', 'Awl', 'Vise', 'Mallet', 'Level', 'Square', 'Bevel', 'Gauge', 'Clamp', 'Drill', 'Auger', 'Wrench', 'Ratchet', 'Pliers', 'Spanner', 'Jig'],
      dayTypes: {
        cba: { ...THREE_SPLIT.dayTypes.cba, minutes: STR, blocks: [S('Chest & back', ['push', 'pullBar', 'pushLoad', 'kb_row', 'pullBar?'])] },
        up: { ...THREE_SPLIT.dayTypes.up, minutes: STR, blocks: [S('Full body · upper', ['push', 'row', 'kb_press', 'arms', 'total?'])] },
        low: { ...THREE_SPLIT.dayTypes.low, minutes: STR, blocks: [S('Full body · lower', ['squat', 'hinge', 'lunge', 'glute', 'total?'])] },
        ac: acDay,
      },
    };
    // Each original gets two variations, Tempo and Harder moves: everything (split, cycle, day types, time ranges, abs,
    // equipment, pools) is the original's, only the levers, the words and the id are new. Same catalogue as the original, so
    // the pools match. They are new programs (added: 6), pinned like the rest.
    const TEXT = {
      'three-split-60': {
        tempo: ['Three-Split 60\'s rhythm again, but Levels II and III slow every lowering to three seconds instead of adding reps.',
          'The Three-Split 60 rhythm as a new program: chest and back, a full-body day, then abs and cardio. The full-body day alternates an upper and a lower focus, and abs finish every workout. The days and times match Three-Split 60, but it is built fresh, so the exercises are not the same ones. Where Three-Split 60 adds reps, this one gets harder by slowing down: at Levels II and III every lowering takes three seconds, on every move that can be slowed. Holds such as planks stay as they are. Suits you if you like the three-day rhythm and want more from each rep.'],
        harder: ['Three-Split 60\'s rhythm again, but Levels II and III swap moves for harder versions of them.',
          'The Three-Split 60 rhythm as a new program: chest and back, a full-body day, then abs and cardio. The full-body day alternates an upper and a lower focus, and abs finish every workout. The days and times match Three-Split 60, but it is built fresh, so the exercises are not the same ones. Where Three-Split 60 adds reps, this one gets harder by changing the moves: at Levels II and III many exercises become their harder version, such as archer push-ups for push-ups or kettlebell front squats for goblet squats. Moves without a harder version stay as they are. Suits you if you like the three-day rhythm and want new moves to learn.'],
      },
      'four-split-60': {
        tempo: ['The Four-Split cycle, but Levels II and III slow every lowering to three seconds instead of adding reps and weight.',
          'The same four-day cycle as Four-Split 60: push, pull-ups and back, legs, then abs and cardio, in straight sets with abs to finish. Four-Split 60 adds reps and then weight; this one keeps the weights and slows down, with a three-second lowering on every move that can take it at Levels II and III. Slower reps take longer, so fewer sets fit in a session and the days stay in their time range. Suits you if the weights you have are heavy enough and you want more out of them.'],
        harder: ['The Four-Split cycle, but Levels II and III swap moves for harder versions of them.',
          'The same four-day cycle as Four-Split 60: push, pull-ups and back, legs, then abs and cardio, in straight sets with abs to finish. Four-Split 60 adds reps and then weight; this one changes the moves instead. At Levels II and III many exercises become their harder version, such as archer push-ups for push-ups, kettlebell front squats for goblet squats or single-leg deadlifts for dumbbell ones. Moves without a harder version stay as they are. Suits you if you would rather learn a harder move than lift a heavier weight.'],
      },
      'two-split-60': {
        tempo: ['The Two-Split rhythm, but Levels II and III slow every lowering to three seconds instead of adding weight and reps.',
          'The same two-day rhythm as Two-Split 60: upper body, then lower body, each finished with abs, in straight sets. Two-Split 60 moves you one weight up and then adds reps; this one keeps the weights and slows down, with a three-second lowering on every move that can take it at Levels II and III. Slower reps take longer, so a session holds fewer sets and stays in its time range. Suits you if you want to feel stronger without changing the weights.'],
        harder: ['The Two-Split rhythm, but Levels II and III swap moves for harder versions of them.',
          'The same two-day rhythm as Two-Split 60: upper body, then lower body, each finished with abs, in straight sets. Two-Split 60 moves you one weight up and then adds reps; this one changes the moves instead. At Levels II and III many exercises become their harder version, such as pull-ups for negatives, shrimp squats for split squats or single-leg deadlifts for dumbbell ones. The upper day leans a little more on push-ups and bar pulls, which have harder versions to move to. Moves without a harder version stay as they are. Suits you if you would rather earn a harder move than a heavier weight.'],
      },
      'five-split-60': {
        tempo: ['The Five-Split body-part days, but Levels II and III slow every lowering to three seconds instead of adding reps and weight.',
          'The same five-day body-part split as Five-Split 60: chest, back, legs, shoulders and arms, then abs and cardio. Everything is straight sets, with abs to close. Five-Split 60 adds reps and then weight; this one keeps the weights and slows down, with a three-second lowering on every move that can take it at Levels II and III. Each muscle gets its own day, so the slow reps go where they count. Suits you if you like focused sessions and want each set to be harder without a heavier weight.'],
        harder: ['The Five-Split body-part days, but Levels II and III swap moves for harder versions of them.',
          'The same five-day body-part split as Five-Split 60: chest, back, legs, shoulders and arms, then abs and cardio. Everything is straight sets, with abs to close. Five-Split 60 adds reps and then weight; this one changes the moves instead. At Levels II and III many exercises become their harder version, such as archer push-ups for push-ups, chin-ups for chin holds or shrimp squats for split squats. Chest, back and arms days lean a little more on push-ups, bar pulls and kettlebell presses, which have harder versions to move to. Suits you if you like focused sessions and want new moves to work toward.'],
      },
      'full-body-duo-60': {
        tempo: ['The Full-Body Duo rhythm, but Levels II and III slow every lowering to three seconds instead of adding reps.',
          'The same two-day rhythm as Full-Body Duo 60: a full-body strength day, then an abs and cardio day. Everything is straight sets, with abs to finish. Full-Body Duo 60 adds reps and then brings harder variations; this one slows down from Level II on, with a three-second lowering on every move that can take it. Slower reps take longer, so fewer sets fit in a session and the days stay in their time range. Suits you when you want to keep the simple rhythm and make each rep count.'],
        harder: ['The Full-Body Duo rhythm, but harder versions of the moves come in from Level II, not just Level III.',
          'The same two-day rhythm as Full-Body Duo 60: a full-body strength day, then an abs and cardio day. Everything is straight sets, with abs to finish. Full-Body Duo 60 adds reps at Level II and brings harder variations at Level III; this one brings them at both levels. Many exercises become their harder version, such as kettlebell front squats for goblet squats, archer push-ups for push-ups or single-leg deadlifts for dumbbell ones. The full-body day leans on push-ups and bar pulls, which have harder versions to move to. Suits you if you want the simple rhythm with more to learn.'],
      },
    };
    // Harder moves only bites on exercises that have a harder version (the HARDER table in program-builder.js, which can't
    // grow without reshuffling pinned programs), and only about 60% of the time. Four-Split 60's pools have enough of them.
    // For the other three, a few slots of the Harder moves variation are swapped for pools (or one exercise) with more of
    // them: same day types, same number of exercises, same muscles, so the split stays what it was.
    const HARDER_SLOTS = {
      'two-split-60': { upper: ['push', 'pullBar', 'shoulders', 'row', 'arms?'] },
      'five-split-60': {
        chest: ['push', 'pushLoad', 'kb_press', 'push', 'triceps?'],
        back: ['pullBar', 'row', 'kb_row', 'pullBar', 'biceps?'],
        arms: ['kb_press', 'biceps', 'push', 'shoulders', 'triceps?'],
      },
      'full-body-duo-60': { full: ['squat', 'push', 'hinge', 'pullBar', 'total?'] },
    };
    const withSlots = (template, swaps = {}) => ({
      ...template,
      dayTypes: Object.fromEntries(Object.entries(template.dayTypes).map(([k, t]) => [k, swaps[k] ? { ...t, blocks: [{ ...t.blocks[0], slots: swaps[k] }] } : t])),
    });
    const withVariations = (template, original = template) => {
      const variation = (kind, name, levers, [blurb, about], swaps) => ({ ...withSlots(template, swaps), id: `${original.id}-${kind}`, name: `${original.name} ${name}`, added: 6, levers, blurb, about });
      const { tempo, harder } = TEXT[original.id];
      return [variation('tempo', 'Tempo', [null, 'tempo', 'tempo'], tempo), variation('harder', 'Harder Moves', [null, 'variation', 'variation'], harder, HARDER_SLOTS[original.id])];
    };
    const originals = [
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
    return [...withVariations(threeSplitLike, THREE_SPLIT), ...originals.flatMap((o) => [o, ...withVariations(o)])];
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
  // ---------------- MORE STRENGTH (Phase 5: three more each in Strength, Pull-ups, Legs & glutes, Kettlebell only) ----------------
  {
    id: 'arnold-split', added: 5, name: 'Arnold Split', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'reps'],
    split: 'Chest & back / shoulders & arms / legs', blurb: 'The classic bodybuilding split at home: chest and back together, shoulders and arms, then legs.',
    about: 'The classic bodybuilding split, adapted for dumbbells, a kettlebell and a bar. Chest and back share a day, shoulders and arms get the next, and legs the third, all in straight sets with abs to finish. Floor flys, Arnold presses and Bulgarian split squats join the familiar moves. Level II moves you one weight up and Level III adds reps. For building muscle more than chasing numbers.',
    names: ['Pump', 'Oak', 'Mr Universe', 'Muscle Beach', 'Venice', 'Golden Era', 'Iron Pump', 'Posing Room', 'Stage Ready', 'Physique', 'Sculpt', 'Chisel', 'Marble Statue', 'Bronze', 'Colossus', 'Atlas', 'Hercules', 'Titan', 'Olympia', 'Austrian Oak'],
    cycle: ['chestback', 'arms', 'legs'],
    dayTypes: {
      chestback: { label: 'Chest & back', short: 'Chest · Back', blocks: [S('Chest & back', ['chest2', 'pullBar2', 'chest2', 'row2', 'floor_fly?'])] },
      arms: { label: 'Shoulders & arms', short: 'Arms', blocks: [S('Shoulders & arms', ['arnold_press', 'biceps', 'triceps', 'shoulders2', 'arms?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'bulgarian_split_squat', 'glute2', 'lunge2?'])] },
    },
  },
  {
    id: 'strength-supersets', added: 5, name: 'Strength Supersets', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'tempo'],
    split: 'Upper supersets / lower supersets', blurb: 'Opposing muscles in supersets: push with pull, squat with hinge, so more work fits in 40 minutes.',
    about: 'Opposing muscles paired in supersets, so one rests while the other works: push with pull, squat with hinge. That fits more strength work into forty minutes without cutting rest. Upper and lower days alternate, with abs to finish. Level II moves you one weight up and Level III slows every lowering to three seconds. Good once straight sets start to feel long.',
    names: ['Tag Team', 'Double Header', 'Two-Step', 'Push-Pull', 'Yin-Yang Iron', 'Counterweight Set', 'Seesaw Set', 'Balance Beam Set', 'Tug of War', 'Back to Back', 'Twin Set', 'Pairs Skate', 'Duet Iron', 'Handshake', 'Swap Shop', 'Relay Pair', 'Mirror Set', 'Flip Flop', 'Opposites', 'Tandem Iron'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper supersets', short: 'Upper', blocks: [SS('Upper supersets', ['pushLoad2', 'row2', 'shoulders2', 'pullBar2', 'biceps', 'triceps'])] },
      lower: { label: 'Lower supersets', short: 'Lower', blocks: [SS('Lower supersets', ['squat2', 'hinge2', 'lunge2', 'glute2', 'kbSwing', 'barCore'])] },
    },
  },
  {
    id: 'heavy-duty', added: 5, name: 'Heavy Duty', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'weight'],
    split: 'Full body A / B / C', blurb: 'Full-body strength three ways, with heavier dumbbells and fewer, harder sets.',
    about: 'Full-body strength three ways, built on the heaviest moves you can do at home. Each day covers a squat or hinge, a press, a pull and a carry or core move, in straight sets with abs to finish. Days rotate so no pattern repeats back to back. Levels II and III both move you one weight up. For when your dumbbells are starting to feel light.',
    names: ['Anvil Day', 'Girder', 'I-Beam', 'Rebar', 'Cast Iron', 'Wrought Iron', 'Pig Iron', 'Steel Toe', 'Hard Hat', 'Load Bearing', 'Crane', 'Forklift', 'Freight', 'Cargo', 'Ballast Load', 'Payload', 'Heavy Lifting', 'Deadweight', 'Tonnage', 'Iron Works'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Squat, press, row', short: 'A', blocks: [S('Full body', ['squat2', 'pushLoad2', 'row2', 'glute2', 'carry?'])] },
      b: { label: 'Hinge, pull, press', short: 'B', blocks: [S('Full body', ['hinge2', 'pullBar2', 'shoulders2', 'lunge2', 'carry?'])] },
      c: { label: 'Lunge, push, pull', short: 'C', blocks: [S('Full body', ['lunge2', 'chest2', 'row2', 'hinge2', 'kbCore2?'])] },
    },
  },
  {
    id: 'bar-flow', added: 5, name: 'Bar Flow', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'variation'],
    split: 'Pull & core / pull & push', blurb: 'Pull-ups with bar core work: knee raises and L-sit hangs between the pulling sets.',
    about: 'Pull-ups with core work done on the same bar: hanging knee raises and L-sit hangs between the pulling sets. One day adds rows and core, the other adds pushing to balance the shoulders. Straight sets, with abs to finish. Level II adds reps and Level III brings harder variations, like the L-sit in place of knee raises. For a stronger grip and a flatter midsection together.',
    names: ['Swing Set', 'Monkey Bars', 'Jungle Gym', 'Trapeze', 'Rings', 'High Bar Flow', 'Kip', 'Hollow Hang', 'Muscle-Up Dream', 'Rail', 'Branch', 'Vine', 'Rope Climb', 'Chalk', 'Calluses', 'Grip Tape', 'Hang Glider', 'Dangle', 'Suspension', 'Aerial'],
    cycle: ['core', 'push'],
    dayTypes: {
      core: { label: 'Pull & bar core', short: 'Core', blocks: [S('Pull & bar core', ['pullBarMain', 'barCore', 'row2', 'barCore', 'pullBar2?'])] },
      push: { label: 'Pull & push', short: 'Push', blocks: [S('Pull & push', ['pullBar2', 'push', 'pullBarMain', 'shoulders2', 'barCore?'])] },
    },
  },
  {
    id: 'hang-tough', added: 5, name: 'Hang Tough', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'reps'],
    split: 'Grip & hang / pull volume', blurb: 'Grip and hanging strength first: dead hangs, holds and slow negatives, then pull-up volume.',
    about: 'For when the grip gives out before the back does: dead hangs, chin-over-bar holds, L-sit hangs and slow negatives. One day is about holding on, the other about pull-up volume in supersets with rows. Abs finish every session. Levels II and III add reps and seconds. Chalk helps.',
    names: ['White Knuckle', 'Death Grip', 'Hold Fast', 'Stay Put', 'Clinging', 'Barnacle', 'Limpet', 'Velcro', 'Hook Grip', 'Vice', 'Clamp', 'Pincer', 'Talon', 'Claw', 'Fist', 'Handhold', 'Last Rung', 'Cliffhanger', 'Holdout', 'Never Let Go'],
    cycle: ['hang', 'volume'],
    dayTypes: {
      hang: { label: 'Grip & hang', short: 'Hang', blocks: [S('Grip & hang', ['dead_hang', 'chin_hold', 'l_sit_hang', 'negative_pullup', 'hang_knee_raise?'])] },
      volume: { label: 'Pull volume', short: 'Volume', blocks: [SS('Pull volume', ['pullBarMain', 'row2', 'pullBar2', 'row2', 'biceps', 'barCore'])] },
    },
  },
  {
    id: 'commando', added: 5, name: 'Commando', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'variation'],
    split: 'EMOM + strength / strength + EMOM', blurb: 'Commando pull-ups and pull-up EMOMs, with rows and pushing between.',
    about: 'Military-style pulling: commando pull-ups, pull-up EMOMs and plenty of rows. One day opens with an EMOM that spreads pull-ups over the minutes, the other puts straight-set strength first. Push-ups keep the shoulders balanced, and abs finish each session. Level II adds reps and Level III brings harder variations. Tough, but the EMOM makes the volume manageable.',
    names: ['Recon', 'Ranger', 'Sapper', 'Scout', 'Platoon', 'Sergeant', 'Drill', 'Boot Camp', 'Barracks', 'Obstacle Course', 'Rope Wall', 'Night March', 'Dawn Patrol', 'Ruck', 'Field Day', 'Mess Hall', 'Parade Ground', 'Attention', 'At Ease', 'Dismissed'],
    cycle: ['emom', 'strength'],
    dayTypes: {
      emom: { label: 'EMOM + strength', short: 'EMOM', blocks: [E('Pull-up EMOM', ['pullBarMain', 'push', 'commando_pullup', 'row2'], { values: [10, 12, 14] }), S('Strength', ['row2', 'shoulders2', 'barCore?'])] },
      strength: { label: 'Strength + EMOM', short: 'Strength', blocks: [S('Strength', ['commando_pullup', 'row2', 'pushLoad2', 'barCore?']), E('EMOM', ['pullBar2', 'push', 'row2'], { values: [8, 10, 12] })] },
    },
  },
  {
    id: 'glute-builder', added: 5, name: 'Glute Builder', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'weight', 'tempo'],
    split: 'Thrust / hinge / single-leg', blurb: 'Hip thrusts, bridges, deadlifts and step-ups: the glutes worked from every angle.',
    about: 'The glutes worked from every angle: hip thrusts, bridges, deadlifts, step-ups and swings. Three days rotate, built around thrusting, hinging and single-leg work, each in straight sets with abs to finish. Level II moves you one weight up and Level III slows the lowering to three seconds. You need a couch or sturdy chair for the thrusts and step-ups.',
    names: ['Peach', 'Posterior', 'Shelf', 'Power Hips', 'Hip Drive', 'Backside', 'Engine Room Glutes', 'Round Two', 'Lift Off Glutes', 'Squeeze', 'Lockout', 'Top Position', 'Bridge Builder', 'Thrust Line', 'Hinge Power', 'Stride Power', 'Stair Climber', 'Hill Sprint', 'Glute Day', 'Bum Deal'],
    gear: 'A couch or sturdy chair for hip thrusts and step-ups.',
    cycle: ['thrust', 'hinge', 'single'],
    dayTypes: {
      thrust: { label: 'Thrust & bridge', short: 'Thrust', blocks: [S('Glutes', ['hip_thrust', 'glute2', 'lunge2', 'glute2', 'hinge2?'])] },
      hinge: { label: 'Hinge', short: 'Hinge', blocks: [S('Glutes & hamstrings', ['hinge2', 'hip_thrust', 'kbSwing', 'glute2', 'lunge2?'])] },
      single: { label: 'Single-leg', short: 'Single', blocks: [S('Single-leg', ['db_step_up', 'bulgarian_split_squat', 'single_leg_rdl', 'glute2', 'singleLeg?'])] },
    },
  },
  {
    id: 'step-up', added: 5, name: 'Step Up', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'weight', 'variation'],
    split: 'Split squat day / step-up day', blurb: 'Single-leg strength built on step-ups and Bulgarian split squats, one leg at a time.',
    about: 'Leg strength one side at a time, built on step-ups and Bulgarian split squats. One day centres on split squats and lunges, the other on step-ups and single-leg hinges, both with a little squatting and abs to finish. Level II moves you one weight up and Level III brings harder variations. You need a sturdy chair or step.',
    names: ['Staircase Legs', 'Landing', 'Stoop', 'Porch Step', 'Curb', 'Platform', 'Ledge', 'Terrace', 'Balcony', 'Mezzanine', 'Loft', 'Attic Stairs', 'Spiral Stairs', 'Fire Escape', 'Step Stool', 'Riser', 'Tread', 'Handrail', 'Top Floor', 'Rooftop'],
    gear: 'A sturdy chair or step.',
    cycle: ['split', 'step'],
    dayTypes: {
      split: { label: 'Split squats', short: 'Split', blocks: [S('Split squats', ['bulgarian_split_squat', 'lunge2', 'squat2', 'glute2', 'lunge2?'])] },
      step: { label: 'Step-ups', short: 'Step', blocks: [S('Step-ups', ['db_step_up', 'single_leg_rdl', 'squat2', 'lunge2', 'glute2?'])] },
    },
  },
  {
    id: 'leg-day-classic', added: 5, name: 'Leg Day Classic', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'weight', 'reps'],
    split: 'Squat day / hinge day / upper', blurb: 'Two proper leg days and an upper day: squat, hinge, lunge, heavy and simple.',
    about: 'Two proper leg days for every upper day, kept heavy and simple. The squat day builds on goblet and zercher squats, the hinge day on deadlifts and hip thrusts, and lunges appear in both. The upper day keeps the rest of you in balance. Straight sets with abs to finish. Level II moves you one weight up and Level III adds reps.',
    names: ['Quadzilla', 'Tree Trunks', 'Pillars', 'Oak Legs', 'Redwood', 'Sequoia', 'Baobab', 'Stump', 'Root Cellar', 'Foundation Stone', 'Bedrock', 'Groundwork', 'Footings', 'Piles', 'Stilts', 'Timber', 'Lumber', 'Log Cabin', 'Beam Legs', 'Mighty Oak'],
    cycle: ['squat', 'hinge', 'upper'],
    dayTypes: {
      squat: { label: 'Squat day', short: 'Squat', blocks: [S('Squat day', ['squat2', 'lunge2', 'squat2', 'glute2', 'lunge2?'])] },
      hinge: { label: 'Hinge day', short: 'Hinge', blocks: [S('Hinge day', ['hinge2', 'hip_thrust', 'lunge2', 'hinge2', 'glute2?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['pushLoad2', 'row2', 'shoulders2', 'pullBar2', 'arms?'])] },
    },
  },
  {
    id: 'windmill-and-press', added: 5, name: 'Windmill & Press', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Overhead A / overhead B', blurb: 'Kettlebell shoulder strength and stability: windmills, bottoms-up presses, get-ups and presses.',
    about: 'Strong, stable shoulders with one kettlebell: windmills, bottoms-up presses, Turkish get-ups and strict presses. Each day pairs the overhead work with a squat or hinge so the whole body gets trained. Straight sets, with abs to finish. Level II adds reps and Level III moves you to the heavier bell. Go light on the bottoms-up press: it is harder than it looks.',
    names: ['Overhead', 'Lockout Bell', 'Windmill', 'Weathervane', 'Lighthouse Bell', 'Beacon Bell', 'Torchbearer', 'Flag Bearer', 'Standard', 'Pennant', 'Mast Bell', 'Crow’s Nest', 'Periscope', 'Antenna', 'Spire Bell', 'Steeple', 'Minaret', 'Campanile', 'Bell Tower', 'Carillon'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Overhead A', short: 'A', blocks: [S('Overhead & legs', ['kb_windmill', 'bottoms_up_press', 'kbLower2', 'kb_row', 'kbCore2?'])] },
      b: { label: 'Overhead B', short: 'B', blocks: [S('Overhead & legs', ['turkish_getup', 'kb_press', 'kbLower2', 'kbUpper2', 'kb_windmill?'])] },
    },
  },
  {
    id: 'kettlebell-strength', added: 5, name: 'Kettlebell Strength', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'weight', 'tempo'],
    split: 'Squat & press / hinge & row', blurb: 'Grinding kettlebell strength: front and zercher squats, rows, presses and deadlifts.',
    about: 'Slow, grinding strength with one kettlebell: front squats, zercher squats, rows, presses and deadlifts. Squat-and-press days alternate with hinge-and-row days, in straight sets with abs to finish. Level II moves you to the heavier bell and Level III slows every lowering to three seconds. For strength rather than conditioning.',
    names: ['Grind', 'Millstone', 'Winch', 'Capstan', 'Windlass', 'Hoist', 'Block and Tackle', 'Pulley Bell', 'Jack', 'Lever Bell', 'Wedge', 'Crowbar', 'Pry Bar', 'Mallet Bell', 'Chisel Bell', 'Grindstone', 'Whetstone', 'Mortar', 'Pestle', 'Quern'],
    cycle: ['squat', 'hinge'],
    dayTypes: {
      squat: { label: 'Squat & press', short: 'Squat', blocks: [S('Squat & press', ['kb_front_squat', 'kb_press', 'zercher_squat', 'kbUpper2', 'kbCore2?'])] },
      hinge: { label: 'Hinge & row', short: 'Hinge', blocks: [S('Hinge & row', ['kb_deadlift', 'kb_row', 'kb_sumo_deadlift', 'kbUpper2', 'kbCore2?'])] },
    },
  },
  {
    id: 'kettlebell-flow', added: 5, name: 'Kettlebell Flow', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'variation'],
    split: 'Circuit / EMOM', blurb: 'Kettlebell circuits and EMOMs that flow from one move to the next without putting the bell down.',
    about: 'Kettlebell work that flows: circuits and EMOMs moving from swings to squats to presses without putting the bell down. One day is a long circuit, the other a mixed EMOM, each with a short strength block, then abs. Level II adds reps and Level III brings harder variations. Good for fitness and coordination as much as strength.',
    names: ['River Bell', 'Current Bell', 'Stream Bell', 'Flowing', 'Glide Bell', 'Ribbon', 'Silk', 'Wave Bell', 'Swell Bell', 'Tide Bell', 'Drift', 'Cascade Bell', 'Waterfall', 'Rapids Bell', 'Eddy Bell', 'Whirlpool', 'Delta Bell', 'Estuary Bell', 'Brook Bell', 'Spring Bell'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Circuit', short: 'Circuit', blocks: [C('Bell circuit', ['kbBallistic', 'kbLower2', 'kbUpper2', 'kbCore2', 'kbBallistic'], { values: [2, 3, 4] }), S('Strength', ['kbLower2', 'kbUpper2?'])] },
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('Bell EMOM', ['kbBallistic', 'kbUpper2', 'kbLower2', 'kbCore2'], { values: [12, 14, 16] }), S('Strength', ['kbUpper2', 'kbLower2?'])] },
    },
  },
  // ---------------- MORE BODYWEIGHT & BUSY WEEK (Phase 5) ----------------
  {
    id: 'kitchen-table', added: 5, name: 'Kitchen Table', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Push & pull / legs & core', blurb: 'Bodyweight strength with a pull: table rows and push-ups, then legs and core.',
    about: 'Bodyweight strength that finally includes pulling: rows under a sturdy table, paired with push-ups. The other day works legs and core. Supersets keep it moving, with abs to finish. Level II adds reps and Level III brings harder variations. Check the table can take your weight before the first row.',
    names: ['Breakfast Nook', 'Dining Room', 'Place Setting', 'Tablecloth Pull', 'Chair Back', 'Sideboard', 'Pantry', 'Countertop', 'Butcher Block', 'Cutting Board', 'Teapot', 'Saucepan', 'Skillet', 'Colander', 'Whisk', 'Ladle', 'Spatula', 'Rolling Pin', 'Oven Mitt', 'Dish Rack'],
    cycle: ['pushpull', 'legs'],
    dayTypes: {
      pushpull: { label: 'Push & pull', short: 'Push · Pull', blocks: [SS('Push & pull', ['pushBw2', 'table_row', 'pushBw2', 'pullBw', 'pike_pushup', 'table_row'])] },
      legs: { label: 'Legs & core', short: 'Legs', blocks: [SS('Legs & core', ['legsBw2', 'core2', 'legsBw2', 'coreAnti', 'legsBw2', 'table_row'])] },
    },
  },
  {
    id: 'calisthenics-base', added: 5, name: 'Calisthenics Base', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'tempo'],
    split: 'Push / pull & legs', blurb: 'The calisthenics basics in straight sets: push-up and squat progressions, table rows and hollow work.',
    about: 'The calisthenics basics in straight sets: push-up progressions, squat and lunge progressions, table rows and hollow-body work. Push and pull-and-legs days alternate, with abs to finish. Level II moves to harder progressions and Level III slows every lowering to three seconds. A foundation for the harder bodyweight skills.',
    names: ['Groundwork Cali', 'First Steps', 'Base Camp', 'Scaffold', 'Framework', 'Blueprint', 'Building Blocks', 'Lego', 'Bricklayer', 'Mortar Cali', 'Keystone Cali', 'Cornerstone Cali', 'Capstone', 'Lintel Cali', 'Sill', 'Beam Cali', 'Truss Cali', 'Post', 'Pillar Cali', 'Arch Cali'],
    cycle: ['push', 'pull'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [S('Push', ['pushBw2', 'pike_pushup', 'pushBw2', 'coreHollow', 'pushBw2?'])] },
      pull: { label: 'Pull & legs', short: 'Pull', blocks: [S('Pull & legs', ['table_row', 'legsBw2', 'pullBw', 'legsBw2', 'coreHollow?'])] },
    },
  },
  {
    id: 'floor-only', added: 5, name: 'Floor Only', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Floor A / floor B', blurb: 'Quiet bodyweight training on the floor: no jumping, nothing to wake the neighbours.',
    about: 'Quiet bodyweight training that never leaves the floor: no jumps, nothing to wake the neighbours or the baby. Push-ups, bridges, lunges, planks and slow core work in circuits, then abs. Two days alternate. Levels II and III add reps. Good for late evenings and flats with thin floors.',
    names: ['Hush Hush', 'Tiptoe', 'Whisper', 'Library', 'Night Owl', 'Midnight', 'Lights Out', 'Sleeping House', 'Soft Socks', 'Carpet', 'Rug', 'Floorboards', 'Downstairs', 'Upstairs Neighbour', 'Quiet Hours', 'Mute', 'Silent Mode', 'Stealth', 'Ninja', 'Mouse'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Floor A', short: 'A', blocks: [C('Floor circuit', ['pushBw2', 'glute_bridge_march', 'reverse_lunge', 'coreAnti', 'table_row?'], { values: [2, 3, 4] })] },
      b: { label: 'Floor B', short: 'B', blocks: [C('Floor circuit', ['legsBw2', 'pushBw2', 'coreRot', 'single_leg_bridge', 'coreHollow?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'express-circuit', added: 5, name: 'Express Circuit', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'reps', 'variation'], absSlots: ['absW', 'abs?'],
    split: 'Express A / express B', blurb: 'Twenty minutes, one full-body circuit, then two quick abs sets.',
    about: 'Twenty minutes that cover everything: one full-body circuit with a squat, a push, a pull, a hinge and cardio. Two quick abs sets finish it. Two circuits alternate. Level II adds reps and Level III brings harder variations. For the weeks when getting it done is the win.',
    names: ['Rush Hour', 'Express Lane', 'Fast Track', 'Shortcut', 'Commuter', 'Carpool', 'Drive-Through', 'Takeaway', 'Microwave', 'Instant', 'On the Go', 'Grab and Go', 'In and Out', 'Pit Crew', 'Quick Change', 'Speed Round', 'Lightning Round', 'Sprint Finish', 'Buzzer Beater', 'Photo Finish'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Express A', short: 'A', blocks: [C('Express circuit', ['squat2', 'push', 'row2', 'hinge2', 'hiit'], { values: [2, 3, 4] })] },
      b: { label: 'Express B', short: 'B', blocks: [C('Express circuit', ['lunge2', 'pushLoad2', 'pullBar2', 'kbSwing', 'hiit'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'two-block-20', added: 5, name: 'Two-Block 20', subject: 'Busy week', minutes: [19, 23], levers: [null, 'weight', 'reps'], absSlots: ['absW', 'abs?'],
    split: 'Upper + AMRAP / lower + AMRAP', blurb: 'Strength supersets, then a short conditioning finisher, in about twenty minutes.',
    about: 'Two blocks in twenty minutes: strength supersets first, then a short conditioning finisher. The supersets pair a push with a pull or a squat with a hinge, and the finisher is a quick AMRAP. Abs close it. Level II moves you one weight up and Level III adds reps. Strength and sweat when time is short.',
    names: ['Double Shift', 'Two-Step Iron', 'Duo Block', 'Pair Up', 'Twofer', 'Double Duty', 'Two Birds', 'Split Shift', 'Doubleheader', 'Two Halves', 'First Half', 'Second Half', 'Extra Time', 'Injury Time', 'Overtime', 'Added Time', 'Final Whistle', 'Full Time', 'Stoppage', 'Last Minute'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Upper + AMRAP', short: 'A', blocks: [SS('Supersets', ['pushLoad2', 'row2', 'shoulders2', 'pullBar2']), A('Finisher', ['hiit', 'squat2'], { values: [3, 4, 5] })] },
      b: { label: 'Lower + AMRAP', short: 'B', blocks: [SS('Supersets', ['squat2', 'hinge2', 'kbSwing', 'glute2']), A('Finisher', ['hiit', 'core2'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'lunch-break', added: 5, name: 'Lunch Break', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'reps', 'reps'], absSlots: ['absW', 'abs?'],
    split: 'EMOM A / EMOM B', blurb: 'A fifteen-minute EMOM and a couple of abs sets: done before lunch is over.',
    about: 'Done before lunch is over: a fifteen-minute EMOM, then two quick abs sets. Each minute is one move, rotating through a lift, bodyweight strength and cardio, so the clock runs the whole thing. Two versions alternate. Levels II and III add reps. Change your shirt after.',
    names: ['Sandwich', 'Soup of the Day', 'Salad Bar', 'Bento', 'Lunchbox', 'Brown Bag', 'Canteen', 'Food Truck', 'Deli', 'Diner', 'Café', 'Bistro', 'Picnic Bench', 'Park Bench', 'Noon', 'Twelve Sharp', 'High Noon', 'Midday Break', 'One O’Clock', 'Back to Work'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('EMOM', ['total', 'push', 'squat2', 'hiit', 'row2'], { values: [12, 14, 15] })] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('EMOM', ['kbBallistic', 'lunge2', 'pushLoad2', 'hiit', 'core2'], { values: [12, 14, 15] })] },
    },
  },
  // ---------------- PHASE 14: bodyweight programs with the floor-only pulls (catalogue 8: five floor pulls) ----------------
  {
    id: 'floor-pull', added: 14, catalogue: 8, name: 'Floor Pull', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Push & pull / legs & pull', blurb: 'Bodyweight strength with a pull every day, and no bar: floor pulls between push-ups and legs.',
    about: 'Bodyweight strength with a pull on every day and no bar needed. The pulls are done lying face down: prone lat pulls, superman rows, reverse snow angels and supermans, or table rows if you have a sturdy table. One day pairs them with push-ups, the other with single-leg work, in straight sets with full rests. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Groundwork', 'Floorboard', 'Parquet', 'Tatami', 'Lino', 'Rug Burn', 'Ground Floor', 'Basement', 'Flagstone', 'Doormat', 'Hearthrug', 'Deck', 'Plank Floor', 'Tile', 'Cork', 'Bamboo', 'Oak Boards', 'Terrazzo', 'Slate Floor', 'Mosaic'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: { label: 'Push & pull', short: 'Push · Pull', blocks: [S('Push & pull', ['pushBw2', 'pullBw', 'pushBw2', 'pullBw', 'pike_pushup?'])] },
      legs: { label: 'Legs & pull', short: 'Legs · Pull', blocks: [S('Legs & pull', ['legsBw2', 'pullBw', 'legsBw2', 'pullBw', 'legsBw2?'])] },
    },
  },
  {
    id: 'back-at-home', added: 14, catalogue: 8, name: 'Back at Home', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Back & push / back & legs', blurb: 'Circuits led by the upper back: two floor pulls a round, with push-ups or legs and core between.',
    about: 'Circuits that put the upper back first, for posture and balance with all the pushing most home training does. Every round has two floor pulls, such as reverse snow angels and superman rows, with push-ups or legs and a core move between them. Days alternate back with push and back with legs. Abs finish every session. Level II adds reps and Level III brings harder versions.',
    names: ['Shoulder Blade', 'Upright', 'Tall Spine', 'Stand Tall', 'Lifted', 'Backbone', 'Scapula', 'Rhomboid', 'Trapezius', 'Wingspan', 'Keelson', 'Mast', 'Flagpole', 'Plumb', 'Column', 'Pillar', 'Spire', 'Totem', 'Steeple', 'Lighthouse'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: { label: 'Back & push', short: 'Back · Push', blocks: [C('Back circuit', ['pullBw', 'pushBw2', 'pullBw', 'coreAnti', 'pullBw?'], { values: [2, 3, 4] })] },
      legs: { label: 'Back & legs', short: 'Back · Legs', blocks: [C('Back circuit', ['pullBw', 'legsBw2', 'pullBw', 'coreRot', 'legsBw2?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'quiet-upper', added: 14, catalogue: 8, name: 'Quiet Upper', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Upper A / upper B', blurb: 'Upper-body supersets on the floor: a push and a pull back to back, quiet enough for a flat at night.',
    about: 'Upper-body training in supersets, a push and a floor pull back to back, then rest. Nothing jumps, so it suits a flat late in the evening. One day leans on chest and triceps, the other on shoulders, with a pull in every pair so the back keeps up. Abs finish every session. Level II brings harder versions first and Level III adds reps on top.',
    names: ['Hush', 'Whisper', 'Tiptoe', 'Library', 'Night Shift', 'Lights Out', 'Muffle', 'Velvet', 'Felt', 'Slipper', 'Moth', 'Owl', 'Midnight', 'Small Hours', 'Silent Night', 'Low Key', 'Undertone', 'Pianissimo', 'Murmur', 'Shh'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Upper A', short: 'A', blocks: [SS('Push & pull', ['pushBw2', 'pullBw', 'diamond_pushup', 'pullBw', 'pushBw2', 'pullBw'])] },
      b: { label: 'Upper B', short: 'B', blocks: [SS('Push & pull', ['pike_pushup', 'pullBw', 'pushBw2', 'pullBw', 'pushBw2', 'pullBw'])] },
    },
  },
  // ---------------- PHASE 14: GRIP & FOREARMS (carries, hangs and curls for the hands and forearms; abs to finish) ----------------
  {
    id: 'grip-strength', added: 14, catalogue: 8, name: 'Grip Strength', subject: 'Grip & forearms', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Holds / curls / pulls', blurb: 'A stronger grip in three days: heavy holds and carries, forearm curls, then heavy pulls.',
    about: 'A stronger grip from three directions. One day holds heavy things for time, with farmer carries, dead hangs and bottoms-up holds. One day trains the forearms directly with wrist curls, reverse curls and hammer curls. The third pulls heavy, rows and deadlifts, with no straps. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Vice', 'Clamp', 'Pliers', 'Wrench', 'Talon', 'Claw', 'Iron Grip', 'Handshake', 'White Knuckle', 'Grapple', 'Hook', 'Lock Jaw', 'Pincer', 'Crusher', 'Monkey Grip', 'Death Grip', 'Tongs', 'Chalk', 'Calluses', 'Bulldog'],
    cycle: ['holds', 'curls', 'pulls'],
    dayTypes: {
      holds: { label: 'Holds & carries', short: 'Holds', blocks: [S('Holds & carries', ['farmer_carry', 'gripHold', 'gripHold', 'gripHold?'])] },
      curls: { label: 'Forearm curls', short: 'Curls', blocks: [S('Forearm curls', ['wrist_curl', 'reverse_wrist_curl', 'reverse_curl', 'gripCurl?'])] },
      pulls: { label: 'Heavy pulls', short: 'Pulls', blocks: [S('Heavy pulls', ['gripPull', 'gripPull', 'gripPull', 'gripHold?'])] },
    },
  },
  {
    id: 'carry-day', added: 14, catalogue: 8, name: 'Carry Day', subject: 'Grip & forearms', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Carry circuit A / B', blurb: 'Circuits built around carrying heavy things: farmer carries and suitcase marches between lifts.',
    about: 'Circuits built around picking heavy things up and carrying them. Every round has a farmer carry or a suitcase march between a squat or hinge and a pull, so the grip works while the rest of you does too. Rounds are steady rather than frantic. Abs finish every session. Level II asks for heavier weights and Level III adds time and reps.',
    names: ['Groceries', 'Luggage', 'Moving Day', 'Coal Sack', 'Water Buckets', 'Firewood', 'Haul', 'Porter', 'Sherpa', 'Stevedore', 'Pack Mule', 'Lift and Shift', 'Wheelbarrow', 'Hod', 'Removals', 'Cargo', 'Freight', 'Tote', 'Lug', 'Heave'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Carry circuit A', short: 'A', blocks: [C('Carry circuit', ['farmer_carry', 'squat2', 'gripPull', 'suitcase_march', 'gripCurl?'], { values: [2, 3, 4] })] },
      b: { label: 'Carry circuit B', short: 'B', blocks: [C('Carry circuit', ['suitcase_march', 'hinge2', 'row2', 'farmer_carry', 'gripCurl?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'forearm-pump', added: 14, catalogue: 8, name: 'Forearm Pump', subject: 'Grip & forearms', minutes: [26, 31], levers: [null, 'reps', 'tempo'],
    split: 'Upper A / upper B', blurb: 'Arm supersets with a forearm move in every pair: curls, rows and presses for big forearms.',
    about: 'Arm day with the forearms built in. Every superset pairs a forearm move, wrist curls, reverse curls or a heavy hold, with a curl, a row or a press, then rests. The forearms never fully recover between pairs, which is what makes them grow. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Popeye', 'Anvil Arm', 'Blacksmith', 'Lumberjack', 'Axe Handle', 'Sledge', 'Hammer Time', 'Rope Climb', 'Rowing Crew', 'Oarsman', 'Arm Wrestle', 'Gauntlet', 'Bracer', 'Vambrace', 'Cuff', 'Wristband', 'Sleeve', 'Pump', 'Forge Arm', 'Rigger'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Upper A', short: 'A', blocks: [SS('Forearm supersets', ['wrist_curl', 'db_curl', 'reverse_curl', 'gripPull', 'gripHold', 'pushLoad2'])] },
      b: { label: 'Upper B', short: 'B', blocks: [SS('Forearm supersets', ['reverse_wrist_curl', 'hammer_curl', 'gripHold', 'row2', 'gripCurl', 'shoulders2'])] },
    },
  },
  {
    id: 'hang-time', added: 14, catalogue: 8, name: 'Hang Time', subject: 'Grip & forearms', minutes: [24, 29], levers: [null, 'reps', 'variation'],
    split: 'Hang EMOM / curls & holds', blurb: 'Bar hangs on the minute one day, forearm curls and loaded holds the next: grip that lasts.',
    about: 'Grip endurance from the pull-up bar. One day is an EMOM: a hang, a lock-off or a few pull-ups at the top of every minute, resting in what is left. The other day builds the forearms with curls and loaded holds in straight sets. Abs finish every session. Level II adds reps and time and Level III brings harder hangs.',
    names: ['Monkey Bars', 'Jungle Gym', 'Trapeze', 'Swing Bar', 'Rafter', 'Branch', 'Ledge', 'Overhang', 'Crag', 'Bouldering', 'Rings', 'High Bar', 'Hang Glider', 'Zip Line', 'Rope Swing', 'Tarzan', 'Sloth', 'Gibbon', 'Bat', 'Chandelier'],
    cycle: ['emom', 'curls'],
    dayTypes: {
      emom: { label: 'Hang EMOM', short: 'EMOM', blocks: [E('Hang EMOM', ['climbHold', 'pullBarMain', 'climbHold', 'gripHold'], { values: [10, 12, 14, 16] })] },
      curls: { label: 'Curls & holds', short: 'Curls', blocks: [S('Curls & holds', ['gripCurl', 'gripCurl', 'gripHold', 'gripHold?'])] },
    },
  },
  {
    id: 'grip-and-lift', added: 14, catalogue: 8, name: 'Grip & Lift', subject: 'Grip & forearms', minutes: [30, 35], levers: [null, 'weight', 'weight'],
    split: 'Lower & grip / upper & grip', blurb: 'Full-body strength in straight sets, every day ending on a heavy hold or carry.',
    about: 'Full-body strength in straight sets, finished every day with grip work while the hands are already tired. One day is squats, deadlifts and a carry; the other is presses, rows and a hang or bottoms-up hold. Rests are full, and both later levels ask for heavier weights. Abs close every session. A good choice if you want a strong grip without a separate grip day.',
    names: ['Ironmonger', 'Foundry', 'Mill', 'Smithy', 'Rolling Mill', 'Ingot', 'Billet', 'Girder', 'Rebar', 'Rivet', 'Bolt', 'Hawser', 'Cable', 'Chain Link', 'Shackle', 'Winch', 'Capstan', 'Crane Hook', 'Hoist', 'Pulley'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Lower & grip', short: 'Lower', blocks: [S('Lower body', ['squat2', 'hinge2', 'lunge2']), S('Grip', ['farmer_carry', 'gripHold?'])] },
      upper: { label: 'Upper & grip', short: 'Upper', blocks: [S('Upper body', ['pushLoad2', 'gripPull', 'shoulders2']), S('Grip', ['gripHold', 'gripCurl?'])] },
    },
  },
  // ---------------- PHASE 14: KETTLEBELL COMPLEXES (one bell, moves chained without putting it down; abs to finish) ----------------
  {
    id: 'complex-builder', added: 14, catalogue: 8, name: 'Complex Builder', subject: 'Kettlebell complexes', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Clean & press / swing & squat', blurb: 'One kettlebell, never put down: cleans, presses, swings and squats chained into complexes.',
    about: 'Kettlebell complexes: four or five moves chained together without putting the bell down, then rest. One day is built around the clean and the press, the other around the swing and the squat. The bell stays in your hands for a whole round, so grip, breathing and pacing all get trained. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Chain', 'Sequence', 'Combo', 'Medley', 'Daisy Chain', 'Relay', 'Circuit Board', 'Cascade', 'Domino', 'Rosary', 'String', 'Link', 'Rope', 'Braid', 'Weave', 'Knot', 'Loop', 'Spiral', 'Coil', 'Thread'],
    cycle: ['press', 'swing'],
    dayTypes: {
      press: { label: 'Clean & press', short: 'Press', blocks: [C('Clean & press complex', ['kb_clean', 'kb_push_press', 'kbCx', 'kbCxLower', 'kbCx?'], { values: [3, 4, 5] })] },
      swing: { label: 'Swing & squat', short: 'Swing', blocks: [C('Swing & squat complex', ['kb_one_arm_swing', 'kbCxLower', 'kbCx', 'kbCxUpper', 'kbCx?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'complex-emom', added: 14, catalogue: 8, name: 'Complex EMOM', subject: 'Kettlebell complexes', minutes: [24, 29], equip: 'kb', levers: [null, 'reps', 'reps'],
    split: 'EMOM A / EMOM B', blurb: 'A short kettlebell complex at the top of every minute, the rest of the minute to breathe.',
    about: 'A kettlebell complex on the clock. At the top of every minute you do a short chain, a clean, a press and a squat, say, and rest for whatever is left of the minute. The chains change through the session so every move gets its turn. Abs finish every session. Levels II and III add reps, so the rest in each minute shrinks.',
    names: ['Top of the Hour', 'On the Dot', 'Sharp', 'Punctual', 'Prompt', 'On the Bell', 'Tick Tock', 'Countdown', 'Every Minute', 'Clock Watcher', 'Timekeeper', 'Stopwatch Set', 'Minute Mark', 'Lap Timer', 'Ticker Tape', 'Station', 'Shift', 'Watch', 'Chronograph', 'Sundown'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('Complex EMOM', ['kbCxUpper', 'kbCxLower', 'kbCx', 'kbCxCore'], { values: [12, 14, 16, 18] })] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('Complex EMOM', ['kbCxLower', 'kbCx', 'kbCxUpper', 'kbCxCore'], { values: [12, 14, 16, 18] })] },
    },
  },
  {
    id: 'bell-ladders', added: 14, catalogue: 8, name: 'Bell Ladders', subject: 'Kettlebell complexes', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Ladder A / ladder B', blurb: 'Kettlebell ladders: one rep of each move, then two, then three, climbing until the clock stops.',
    about: 'Kettlebell ladders that climb. A short chain of moves, a clean, a press and a front squat, is done once, then twice, then three times, and on up the ladder until the clock stops. Each day ends with a few minutes of loaded core work. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Rung', 'Step Ladder', 'Rope Ladder', 'Fire Escape', 'Staircase', 'Escalator', 'Ascent', 'Climb', 'Scaffold', 'Gantry', 'Ladder Up', 'Top Rung', 'Upward', 'Rising', 'Pyramid Step', 'Ziggurat', 'Terrace', 'Tier', 'Landing', 'Summit Rung'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladder A', short: 'A', blocks: [L('Bell ladder', ['kb_clean', 'kb_push_press', 'kbCxLower']), C('Loaded core', ['kbCxCore', 'kbCxCore', 'kbCxCore?'], { values: [2, 3] })] },
      b: { label: 'Ladder B', short: 'B', blocks: [L('Bell ladder', ['kb_one_arm_swing', 'kbCxUpper', 'kbCxLower']), C('Loaded core', ['kbCxCore', 'kbCxCore', 'kbCxCore?'], { values: [2, 3] })] },
    },
  },
  {
    id: 'bell-amrap', added: 14, catalogue: 8, name: 'Bell AMRAP', subject: 'Kettlebell complexes', minutes: [25, 30], equip: 'kb', levers: [null, 'reps', 'variation'],
    split: 'AMRAP A / AMRAP B', blurb: 'As many rounds as you can of a kettlebell complex, then a second, shorter one.',
    about: 'As many rounds as you can of a kettlebell complex, then a second, shorter one after a breather. The first AMRAP is the long one, five moves without putting the bell down; the second is a quicker chain to finish. Write your rounds down and try to beat them two weeks later. Abs finish every session. Level II adds reps and Level III brings harder moves.',
    names: ['Rounds Up', 'Tally', 'Scorecard', 'Personal Best', 'Beat It', 'Record', 'High Score', 'Leaderboard', 'Total', 'Rep Count', 'Notch', 'Score', 'Tick Mark', 'Chalk Line', 'Whiteboard', 'Logbook', 'Tally Ho', 'One More', 'Bonus Round', 'Final Count'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'AMRAP A', short: 'A', blocks: [A('Long AMRAP', ['kb_clean', 'kbCxUpper', 'kbCxLower', 'kbCx', 'kbCxCore'], { values: [10, 12] }), A('Short AMRAP', ['kbCx', 'kbCxCore'], { values: [5, 6] })] },
      b: { label: 'AMRAP B', short: 'B', blocks: [A('Long AMRAP', ['kb_one_arm_swing', 'kbCxLower', 'kbCxUpper', 'kbCx', 'kbCxCore'], { values: [10, 12] }), A('Short AMRAP', ['kbCx', 'kbCxCore'], { values: [5, 6] })] },
    },
  },
  {
    id: 'complex-and-carry', added: 14, catalogue: 8, name: 'Complex & Carry', subject: 'Kettlebell complexes', minutes: [28, 33], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Complex + carries A / B', blurb: 'A kettlebell complex, then straight sets of loaded carries and holds for grip and trunk.',
    about: 'A kettlebell complex followed by slow, loaded work for the trunk and grip. The complex chains four moves without putting the bell down, for three to five rounds. Then come straight sets of suitcase marches, around-the-body passes and bottoms-up holds, which train the hands and the core together. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Freight Train', 'Pack Horse', 'Caravan', 'Convoy', 'Barge', 'Tugboat', 'Ox Cart', 'Rickshaw', 'Dray', 'Sledge Pull', 'Yoke', 'Harness', 'Saddlebag', 'Rucksack', 'Kitbag', 'Holdall', 'Satchel', 'Trunk', 'Strongbox', 'Payload'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Complex + carries A', short: 'A', blocks: [C('Complex', ['kb_clean', 'kb_push_press', 'kbCxLower', 'kbCx?'], { values: [3, 4, 5] }), S('Carries & holds', ['suitcase_march', 'kbCxCore?'])] },
      b: { label: 'Complex + carries B', short: 'B', blocks: [C('Complex', ['kb_one_arm_swing', 'kbCxUpper', 'kbCxLower', 'kbCx?'], { values: [3, 4, 5] }), S('Carries & holds', ['kb_bottoms_up_hold', 'kbCxCore?'])] },
    },
  },
  // ---------------- PHASE 14: CLIMBER / PULL STRENGTH (the bar, hangs and lock-offs for climbers and pull-up chasers; abs to finish) ----------------
  {
    id: 'climb-strength', added: 14, catalogue: 8, name: 'Climb Strength', subject: 'Climber / pull strength', minutes: [30, 35], levers: [null, 'reps', 'variation'],
    split: 'Pull / hold / back', blurb: 'Pulling strength for climbers in three days: pull-ups, lock-offs and hangs, then the upper back.',
    about: 'Pulling strength the way climbers need it: strong in every position on the bar, not just at the top. Three days rotate pull-ups in several grips, holds such as lock-offs and L-sit hangs, and upper-back work that keeps shoulders healthy. Straight sets with full rests. Abs finish every session. Level II adds reps and Level III brings harder versions, like archer pull-ups.',
    names: ['Crimp', 'Sloper', 'Jug', 'Pinch Hold', 'Pocket', 'Undercling', 'Gaston', 'Mantle', 'Dyno', 'Flash', 'Onsight', 'Redpoint', 'Send', 'Beta', 'Crux', 'Overhang Wall', 'Roof', 'Arete', 'Chimney', 'Top Out'],
    cycle: ['pull', 'hold', 'back'],
    dayTypes: {
      pull: { label: 'Pull', short: 'Pull', blocks: [S('Pull-ups', ['climbPull', 'climbPull', 'climbPull', 'climbBack?'])] },
      hold: { label: 'Hold', short: 'Hold', blocks: [S('Holds & hangs', ['lock_off', 'climbHold', 'climbHold', 'climbPull?'])] },
      back: { label: 'Back', short: 'Back', blocks: [S('Upper back', ['climbBack', 'climbBack', 'climbPull', 'climbBack?'])] },
    },
  },
  {
    id: 'pull-ladder-climb', added: 14, catalogue: 8, name: 'Pull Ladders', subject: 'Climber / pull strength', minutes: [26, 31], levers: [null, 'reps', 'reps'],
    split: 'Ladder A / ladder B', blurb: 'Pull-up ladders: one rep, then two, then three, with a lock-off or hang between climbs.',
    about: 'Pull-up volume built the patient way, with ladders. One rep, then two, then three, climbing as long as the clock allows, with a hang, a lock-off or a core move at each rung. Two days alternate grips. A short circuit for the upper back follows. Abs finish every session. Levels II and III add reps, so the ladder climbs further.',
    names: ['Belay', 'Abseil', 'Carabiner', 'Quickdraw', 'Harness Up', 'Rope Up', 'Pitch', 'Anchor', 'Piton', 'Nut', 'Cam', 'Sling', 'Prusik', 'Jumar', 'Topo', 'Route', 'Grade', 'Ascender', 'Base Camp', 'Ridge'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladder A', short: 'A', blocks: [L('Pull ladder', ['pullup', 'climbHold', 'coreHollow']), C('Upper back', ['climbBack', 'climbBack'], { values: [2, 3] })] },
      b: { label: 'Ladder B', short: 'B', blocks: [L('Pull ladder', ['chinup', 'climbHold', 'coreAnti']), C('Upper back', ['climbBack', 'climbBack'], { values: [2, 3] })] },
    },
  },
  {
    id: 'hang-and-hold', added: 14, catalogue: 8, name: 'Hang & Hold', subject: 'Climber / pull strength', minutes: [24, 29], levers: [null, 'reps', 'variation'],
    split: 'Hang EMOM / pull EMOM', blurb: 'The bar on the minute: hangs and lock-offs one day, pull-ups of every grip the next.',
    about: 'Bar work on the clock, built for finger and pulling endurance. One day is an EMOM of hangs, lock-offs and L-sit hangs; the other an EMOM of pull-ups in different grips, with a core move between. Each minute you work, then rest in what is left. Abs finish every session. Level II adds reps and time and Level III brings harder versions.',
    names: ['Dead Point', 'Deadhang', 'Campus', 'Fingerboard', 'Edge', 'Rail', 'Pinch', 'Two-finger', 'Mono', 'Hangdog', 'Rest Point', 'Shake Out', 'Pump Clock', 'Endurance Wall', 'Traverse', 'Circuit Board', 'Lap Wall', 'Spray Wall', 'Board Night', 'Chalk Bag'],
    cycle: ['hang', 'pull'],
    dayTypes: {
      hang: { label: 'Hang EMOM', short: 'Hang', blocks: [E('Hang EMOM', ['climbHold', 'climbHold', 'climbBack', 'climbHold'], { values: [10, 12, 14, 16] })] },
      pull: { label: 'Pull EMOM', short: 'Pull', blocks: [E('Pull EMOM', ['climbPull', 'coreHollow', 'climbPull', 'climbBack'], { values: [10, 12, 14, 16] })] },
    },
  },
  {
    id: 'archer-project', added: 14, catalogue: 8, name: 'Archer Project', subject: 'Climber / pull strength', minutes: [30, 35], levers: [null, 'variation', 'variation'],
    split: 'Heavy pull / pull & push', blurb: 'A long project toward one-arm pulling: archer pull-ups, wide grips, slow negatives and lock-offs.',
    about: 'A project toward one-arm pulling, step by step over sixty days. Heavy days use archer pull-ups, wide-grip pull-ups, slow negatives and lock-offs in short straight sets with full rest. The other day pairs pulls with pushes, so the shoulders stay balanced. Abs finish every session. Both later levels move to harder versions rather than more reps.',
    names: ['Bowstring', 'Longbow', 'Quiver', 'Arrowhead', 'Fletching', 'Bullseye', 'Target', 'Archer', 'Robin Hood', 'Sagittarius', 'Crossbow', 'Recurve', 'Nock', 'Draw', 'Loose', 'Volley', 'Marksman', 'Range', 'Fletcher', 'Bowyer'],
    cycle: ['heavy', 'balance'],
    dayTypes: {
      heavy: { label: 'Heavy pull', short: 'Heavy', blocks: [S('Heavy pull', ['archer_pullup', 'wide_pullup', 'negative_pullup', 'lock_off'])] },
      balance: { label: 'Pull & push', short: 'Pull · Push', blocks: [SS('Pull & push', ['climbPull', 'pushBw2', 'climbPull', 'pike_pushup', 'climbHold', 'pushBw2'])] },
    },
  },
  {
    id: 'wall-ready', added: 14, catalogue: 8, name: 'Wall Ready', subject: 'Climber / pull strength', minutes: [26, 31], levers: [null, 'reps', 'variation'],
    split: 'Circuit A / circuit B', blurb: 'Circuits for climbers: a pull, a hang, a leg move and a core move every round.',
    about: 'All-round fitness for climbing in circuits. Each round has a pull on the bar, a hang or lock-off, a single-leg move for high steps, and a core move for keeping feet on the wall. Rounds are steady, with a breather between, so you can do them after a climbing session too. Abs finish every session. Level II adds reps and Level III brings harder versions.',
    names: ['Scramble', 'Bivouac', 'Cairn', 'Couloir', 'Col', 'Saddle', 'Cornice', 'Serac', 'Moraine', 'Tarn', 'Scree', 'Ledge Walk', 'Via Ferrata', 'Approach', 'Tick List', 'Guidebook', 'Crash Pad', 'Spotter', 'Highball', 'Lowball'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Climber circuit', ['climbPull', 'climbHold', 'legsBw2', 'coreHollow', 'climbBack?'], { values: [2, 3, 4] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Climber circuit', ['climbPull', 'legsBw2', 'climbHold', 'coreAnti', 'climbBack?'], { values: [2, 3, 4] })] },
    },
  },
  // ---------------- PHASE 14: 30-DAY PROGRAMS (three levels of ten days) ----------------
  {
    id: 'strength-30', added: 14, catalogue: 8, days: 30, name: 'Strength 30', subject: 'Strength', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Upper / lower, 30 days', blurb: 'A month of dumbbell and kettlebell strength: upper and lower days, a new level every ten days.',
    about: 'A month of strength with dumbbells and a kettlebell, for when sixty days is more than you want to commit to. Upper and lower days alternate in straight sets with full rests. Every ten days the level steps up: Level II asks for heavier weights and Level III adds reps on top. Abs finish every session. At the end of the month, start Round 2 or move to a longer program.',
    names: ['Week One', 'Foundation', 'Groundwork', 'Base Layer', 'Footing', 'Build-up', 'Stepping Up', 'Momentum', 'Halfway', 'Stride', 'Push On', 'Home Stretch', 'Last Lap', 'Month End', 'Full Moon'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper', short: 'Upper', blocks: [S('Upper body', ['pushLoad2', 'row2', 'shoulders2', 'arms', 'row2?'])] },
      lower: { label: 'Lower', short: 'Lower', blocks: [S('Lower body', ['squat2', 'hinge2', 'lunge2', 'glute2', 'singleLeg?'])] },
    },
  },
  {
    id: 'kettlebell-30', added: 14, catalogue: 8, days: 30, name: 'Kettlebell 30', subject: 'Kettlebell only', minutes: [25, 30], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Swing / press / squat, 30 days', blurb: 'A month with one kettlebell: swing, press and squat days in turn, a new level every ten days.',
    about: 'A month with one kettlebell. Three days rotate: a swing day for the hips and lungs, a press day for the shoulders and a squat day for the legs, each mixing straight sets with a short complex. Every ten days the level steps up: Level II adds reps and Level III asks for a heavier bell. Abs finish every session.',
    names: ['Bell One', 'Clean Start', 'First Swing', 'Hike', 'Rack Up', 'Lockout Day', 'Press On', 'Goblet', 'Snatch Grab', 'Halo', 'Windmill Day', 'Get-up', 'Iron Month', 'Last Bell', 'Ring Out'],
    cycle: ['swing', 'press', 'squat'],
    dayTypes: {
      swing: { label: 'Swing', short: 'Swing', blocks: [S('Swing strength', ['kb_swing', 'kbLower', 'kbBallistic', 'kbLower?']), C('Complex', ['kbCx', 'kbCxCore'], { values: [2, 3] })] },
      press: { label: 'Press', short: 'Press', blocks: [S('Press strength', ['kb_press', 'kbUpper', 'kbUpper2', 'kbUpper?']), C('Complex', ['kbCx', 'kbCxCore'], { values: [2, 3] })] },
      squat: { label: 'Squat', short: 'Squat', blocks: [S('Squat strength', ['goblet_squat', 'kbLower2', 'kbLower', 'kbLower2?']), C('Complex', ['kbCx', 'kbCxCore'], { values: [2, 3] })] },
    },
  },
  // ---------------- PHASE 14 ticket 9: Strength family +26, spread over its subjects ----------------
  // STRENGTH (+5)
  {
    id: 'push-pull', added: 14, catalogue: 8, name: 'Push Pull', subject: 'Strength', minutes: [38, 42], levers: [null, 'reps', 'weight'],
    split: 'Push / pull', blurb: 'Two days on repeat: everything that pushes, then everything that pulls, legs shared between them.',
    about: 'The simplest split there is: a push day and a pull day, on repeat. Push days are presses, squats and triceps; pull days are rows, hinges and biceps, so each muscle rests a full day between. Straight sets with full rests. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Push Off', 'Pull Through', 'Press Day', 'Row Day', 'Shove', 'Haul In', 'Thrust', 'Draw In', 'Drive', 'Reel', 'Ram', 'Tow', 'Heave Ho', 'Yank', 'Nudge'],
    cycle: ['push', 'pull'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [S('Push', ['pushLoad2', 'squat2', 'shoulders2', 'triceps', 'chest2?'])] },
      pull: { label: 'Pull', short: 'Pull', blocks: [S('Pull', ['row2', 'hinge2', 'row2', 'biceps', 'glute2?'])] },
    },
  },
  {
    id: 'body-part-split', added: 14, catalogue: 8, name: 'Body-Part Split', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'tempo'],
    split: 'Chest / back / legs / shoulders & arms', blurb: 'A classic four-day split: one muscle group a day, lots of sets for each.',
    about: 'The classic gym split, done at home: chest one day, back the next, then legs, then shoulders and arms. Each day spends all its sets on one area, so it can be worked hard and then left to recover for most of a week. Straight sets with full rests. Abs finish every session. Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Chest Day', 'Back Day', 'Leg Day', 'Arm Day', 'Pec Deck', 'Lat Spread', 'Quad Sweep', 'Delt Cap', 'Bicep Peak', 'Tricep Horseshoe', 'Calf Raise Day', 'Trap Day', 'Rear Delt', 'Front Squat Day', 'Pump Day'],
    cycle: ['chest', 'back', 'legs', 'arms'],
    dayTypes: {
      chest: { label: 'Chest', short: 'Chest', blocks: [S('Chest', ['chest2', 'pushLoad2', 'chest2', 'push', 'triceps?'])] },
      back: { label: 'Back', short: 'Back', blocks: [S('Back', ['row2', 'row2', 'hinge2', 'row2', 'biceps?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2', 'glute2', 'singleLeg?'])] },
      arms: { label: 'Shoulders & arms', short: 'Arms', blocks: [S('Shoulders & arms', ['shoulders2', 'biceps', 'triceps', 'shoulders2', 'arms?'])] },
    },
  },
  {
    id: 'upper-lower-volume', added: 14, catalogue: 8, name: 'Upper Lower Volume', subject: 'Strength', minutes: [38, 42], levers: [null, 'reps', 'tempo'],
    split: 'Upper volume / lower volume', blurb: 'Upper and lower days in supersets, built on volume: more sets and reps rather than heavier weights.',
    about: 'Upper and lower days built on volume rather than heavy weights. Exercises come in supersets, two back to back and then rest, so a lot of work fits in forty minutes. It suits lighter dumbbells or a time when heavy lifting is not an option. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Volume Up', 'Full Tank', 'Big Sets', 'Brimful', 'Bulk Order', 'Heap', 'Stack', 'Pile On', 'Overflow', 'Abundance', 'Plenty', 'Lots', 'Bumper', 'Jumbo', 'Mega'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper volume', short: 'Upper', blocks: [SS('Upper supersets', ['pushLoad2', 'row2', 'shoulders2', 'row2', 'biceps', 'triceps'])] },
      lower: { label: 'Lower volume', short: 'Lower', blocks: [SS('Lower supersets', ['squat2', 'hinge2', 'lunge2', 'glute2', 'singleLeg', 'glute2'])] },
    },
  },
  {
    id: 'strength-endurance', added: 14, catalogue: 8, name: 'Strength Endurance', subject: 'Strength', minutes: [33, 37], levers: [null, 'reps', 'reps'],
    split: 'Full body A / B', blurb: 'Full-body supersets with moderate weights and higher reps, for strength that lasts.',
    about: 'Strength that lasts rather than strength for one rep. Full-body days pair a lower and an upper exercise in supersets with moderate weights and higher reps, and short rests keep the heart rate up. Two days alternate. Abs finish every session. Both later levels add reps, so by Level III the sets are long.',
    names: ['Marathon', 'Long Haul', 'Distance', 'Staying Power', 'Stamina', 'Grit', 'Endure', 'Persist', 'Keep Going', 'Hold Out', 'Durable', 'Tireless', 'Steadfast', 'Iron Lung', 'Diesel'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Full body A', short: 'A', blocks: [SS('Full-body supersets', ['squat2', 'pushLoad2', 'hinge2', 'row2', 'lunge2', 'shoulders2'])] },
      b: { label: 'Full body B', short: 'B', blocks: [SS('Full-body supersets', ['lunge2', 'row2', 'squat2', 'chest2', 'glute2', 'row2'])] },
    },
  },
  {
    id: 'minimalist-strength', added: 14, catalogue: 8, name: 'Minimalist Strength', subject: 'Strength', minutes: [30, 35], levers: [null, 'weight', 'weight'],
    split: 'Three lifts A / B', blurb: 'Three big lifts a day and nothing else: squat or hinge, press, row. Heavier every level.',
    about: 'Three big lifts a day and nothing else, for people who want strength without a long list. Day A is a squat, a press and a row; day B a hinge, a press and a row, with more sets of each rather than more exercises. Rests are long. Abs finish every session. Both later levels ask for heavier weights.',
    names: ['Bare Bones', 'Essentials', 'Basics', 'Core Three', 'Trio', 'Simple', 'Plain', 'Clean Sheet', 'Less Is More', 'Spartan', 'Lean', 'Pared Down', 'Stripped', 'Distilled', 'Pure'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Three lifts A', short: 'A', blocks: [S('Three lifts', ['squat2', 'pushLoad2', 'row2'])] },
      b: { label: 'Three lifts B', short: 'B', blocks: [S('Three lifts', ['hinge2', 'shoulders2', 'row2'])] },
    },
  },
  // PULL-UPS (+4)
  {
    id: 'pullup-pyramid', added: 14, catalogue: 8, name: 'Pull-up Pyramid', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'tempo'],
    split: 'Pyramid / strength', blurb: 'A pull-up ladder one day, dumbbell strength for the rest of the body the next.',
    about: 'Pull-up volume through ladders, with the rest of the body trained the next day. On ladder days the pull-ups climb one rep, then two, then three, with a push-up and a squat at each rung. On strength days come presses, squats and hinges in straight sets. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Giza', 'Step Pyramid', 'Apex', 'Capstone', 'Pinnacle', 'Peak Day', 'Tip Top', 'Crest', 'Zenith', 'Spire Top', 'Obelisk', 'Pharaoh', 'Sphinx', 'Sandstone', 'Monument'],
    cycle: ['ladder', 'strength'],
    dayTypes: {
      ladder: { label: 'Pyramid', short: 'Ladder', blocks: [L('Pull-up pyramid', ['pullBarMain', 'pushBw2', 'legsBw2']), S('Back', ['row2', 'barCore?'])] },
      strength: { label: 'Strength', short: 'Strength', blocks: [S('Strength', ['squat2', 'pushLoad2', 'hinge2', 'shoulders2', 'lunge2?'])] },
    },
  },
  {
    id: 'chinup-strength', added: 14, catalogue: 8, name: 'Chin-up Strength', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'weight', 'variation'],
    split: 'Chin-ups & arms / back & legs', blurb: 'Chin-ups at the centre, with curls and presses one day and rows and legs the next.',
    about: 'Chin-ups at the centre of the program, the underhand grip that brings the biceps in. One day pairs them with curls and presses for the arms; the other with rows, hinges and squats for the back and legs. Straight sets with full rests. Abs finish every session. Level II asks for heavier weights and Level III brings harder bar moves.',
    names: ['Chin Up', 'Underhand', 'Supinated', 'Palms In', 'Bicep Bar', 'Curl Bar', 'Chin Over', 'Bar Chin', 'Grip Under', 'Pull Under', 'Close Grip', 'Neutral', 'Hang Low', 'Chin High', 'Clean Chin'],
    cycle: ['arms', 'back'],
    dayTypes: {
      arms: { label: 'Chin-ups & arms', short: 'Arms', blocks: [S('Chin-ups & arms', ['chinup', 'biceps', 'shoulders2', 'triceps', 'pullBar2?'])] },
      back: { label: 'Back & legs', short: 'Back', blocks: [S('Back & legs', ['chinup', 'row2', 'squat2', 'hinge2', 'pullBar2?'])] },
    },
  },
  {
    id: 'pull-and-push', added: 14, catalogue: 8, name: 'Pull & Push', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'tempo'],
    split: 'Pull-push A / B', blurb: 'Supersets that pair a pull-up with a push: balanced shoulders and lots of bar work.',
    about: 'Supersets that pair a pull on the bar with a push, so the shoulders stay balanced and the bar gets lots of work. Every pair is a pull-up or hang with a press or push-up, then rest. Two days alternate grips and pushes, and finish with legs. Abs close every session. Level II adds reps and Level III slows every rep down.',
    names: ['Seesaw', 'Tug of War', 'Yin Yang', 'Counterpart', 'Mirror', 'Balance Beam', 'Two-way', 'Back and Forth', 'Push-me Pull-you', 'Swing Door', 'Pendulum Day', 'Ebb and Flow', 'Tide Turn', 'Opposites', 'Pair Up'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Pull-push A', short: 'A', blocks: [SS('Pull & push', ['pullBarMain', 'pushLoad2', 'pullBar2', 'pushBw2', 'squat2', 'hinge2'])] },
      b: { label: 'Pull-push B', short: 'B', blocks: [SS('Pull & push', ['pullBar2', 'shoulders2', 'pullBarMain', 'chest2', 'lunge2', 'glute2'])] },
    },
  },
  {
    id: 'bar-emom', added: 14, catalogue: 8, name: 'Bar EMOM', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'tempo', 'reps'],
    split: 'Bar EMOM / strength', blurb: 'Pull-ups on the minute one day, full-body dumbbell strength the next.',
    about: 'Pull-ups on the clock: every minute a few reps on the bar, resting in what is left, alternating grips and hangs. The other day is full-body dumbbell strength in straight sets to round it out. Abs finish every session. Level II slows every rep down and Level III adds reps, so the minute gets tighter.',
    names: ['Minute Bar', 'Clock Bar', 'Top of Minute', 'Tick Bar', 'Bar Clock', 'Rep Clock', 'Hourly', 'Interval Bar', 'Bar Timer', 'Watch Bar', 'Second Bar', 'Lap Bar', 'Bar Beat', 'Metronome Bar', 'Pulse Bar'],
    cycle: ['emom', 'strength'],
    dayTypes: {
      emom: { label: 'Bar EMOM', short: 'EMOM', blocks: [E('Bar EMOM', ['pullBarMain', 'barCore', 'pullBar2', 'pullBarMain'], { values: [12, 14, 16, 18] }), S('Back & core', ['row2', 'core2?'])] },
      strength: { label: 'Strength', short: 'Strength', blocks: [S('Strength', ['squat2', 'pushLoad2', 'hinge2', 'shoulders2', 'lunge2?'])] },
    },
  },
  // LEGS & GLUTES (+5)
  {
    id: 'quad-focus', added: 14, catalogue: 8, name: 'Quad Focus', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'reps', 'tempo'],
    split: 'Squat / lunge / upper', blurb: 'The front of the legs first: squats and lunges of every kind, with an upper day between.',
    about: 'Legs with the front of the thighs first: squats one day, lunges and step-ups the next, then an upper-body day so the legs recover. Goblet, front and Zercher squats, split squats and Bulgarians all take their turn. Straight sets with full rests. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Quadzilla', 'Front Squat', 'Rectus', 'Vastus', 'Teardrop', 'Kneecap', 'Thigh Day', 'Sweep', 'Squat Rack', 'Lunge Walk', 'Step Up Day', 'Split Day', 'Pistol Day', 'Box Day', 'Stair Day'],
    cycle: ['squat', 'lunge', 'upper'],
    dayTypes: {
      squat: { label: 'Squat', short: 'Squat', blocks: [S('Squats', ['squat2', 'squat2', 'lunge2', 'singleLeg', 'squat2?'])] },
      lunge: { label: 'Lunge', short: 'Lunge', blocks: [S('Lunges', ['lunge2', 'lunge2', 'squat2', 'singleLeg', 'lunge2?'])] },
      upper: { label: 'Upper', short: 'Upper', blocks: [S('Upper body', ['pushLoad2', 'row2', 'shoulders2', 'row2', 'arms?'])] },
    },
  },
  {
    id: 'glute-lab', added: 14, catalogue: 8, name: 'Glute Lab', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'reps', 'weight'],
    split: 'Bridge & thrust / hinge & abduct', blurb: 'Glutes from every angle: thrusts and bridges one day, hinges and side work the next.',
    about: 'Glutes from every angle, two days on repeat. One day is hip thrusts, bridges and single-leg bridges, the strongest glute moves there are; the other is hinges like Romanian deadlifts and swings, with clamshells and lateral work for the sides of the hips. Straight sets with full rests. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Peach', 'Gluteus Max', 'Bridge Day', 'Thrust Day', 'Hip Hinge Day', 'Posterior', 'Shelf', 'Booty Day', 'Bum Day', 'Hip Day', 'Side Butt', 'Glute Med Day', 'Hip Extension', 'Lockout Hips', 'Squeeze'],
    cycle: ['thrust', 'hinge'],
    dayTypes: {
      thrust: { label: 'Bridge & thrust', short: 'Thrust', blocks: [S('Bridges & thrusts', ['hip_thrust', 'glute2', 'single_leg_bridge', 'glute2', 'clamshell?'])] },
      hinge: { label: 'Hinge & abduct', short: 'Hinge', blocks: [S('Hinges & side work', ['hinge2', 'hinge2', 'lateral_lunge', 'clamshell', 'glute2?'])] },
    },
  },
  {
    id: 'legs-twice', added: 14, catalogue: 8, name: 'Legs Twice', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'weight', 'reps'],
    split: 'Lower A / upper / lower B', blurb: 'Two different leg days around an upper day: squat-led, then hinge-led, heavier each level.',
    about: 'Two leg days for every upper day. The first leg day leads with a squat, the second with a hinge, so the week covers both without either getting stale; the upper day between gives the legs a rest. Straight sets with full rests. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Double Legs', 'Leg Again', 'Second Helping', 'Encore', 'Repeat', 'Twin', 'Pair of Legs', 'Leg Two', 'Leg Up', 'Legs Out', 'Under Pressure', 'Load Bearing', 'Pillars', 'Columns', 'Stilts'],
    cycle: ['lowA', 'upper', 'lowB'],
    dayTypes: {
      lowA: { label: 'Lower A (squat)', short: 'Lower A', blocks: [S('Lower A', ['squat2', 'lunge2', 'hinge2', 'glute2', 'singleLeg?'])] },
      upper: { label: 'Upper', short: 'Upper', blocks: [S('Upper body', ['pushLoad2', 'row2', 'shoulders2', 'arms', 'row2?'])] },
      lowB: { label: 'Lower B (hinge)', short: 'Lower B', blocks: [S('Lower B', ['hinge2', 'glute2', 'squat2', 'lunge2', 'singleLeg?'])] },
    },
  },
  {
    id: 'hamstring-strong', added: 14, catalogue: 8, name: 'Hamstring Strong', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'tempo', 'tempo'],
    split: 'Hinge / single leg', blurb: 'The back of the legs, slowly: Romanian deadlifts, single-leg hinges and bridges with long lowering.',
    about: 'The back of the legs, trained slowly and well. One day is hinges, Romanian deadlifts, kettlebell deadlifts and swings; the other is single-leg work, single-leg deadlifts, bridges and split squats. Both later levels slow every rep, with a long lowering that builds strong, resilient hamstrings. Straight sets with full rests. Abs finish every session.',
    names: ['Hammy', 'Biceps Femoris', 'Semitendinosus', 'Hinge Line', 'Long Lever', 'Back of Knee', 'Nordic', 'Good Morning', 'Deadlift Day', 'RDL Day', 'Pull Through', 'Swing Back', 'Hip Back', 'Slow Lower', 'Long Eccentric'],
    cycle: ['hinge', 'single'],
    dayTypes: {
      hinge: { label: 'Hinge', short: 'Hinge', blocks: [S('Hinges', ['hinge2', 'hinge2', 'glute2', 'hinge2', 'single_leg_bridge?'])] },
      single: { label: 'Single leg', short: 'Single', blocks: [S('Single leg', ['single_leg_rdl', 'singleLeg', 'single_leg_bridge', 'singleLeg', 'glute2?'])] },
    },
  },
  {
    id: 'athletic-legs', added: 14, catalogue: 8, name: 'Athletic Legs', subject: 'Legs & glutes', minutes: [33, 37], rests: { set: 45, exercise: 75 }, levers: [null, 'reps', 'variation'],
    split: 'Power & strength / single leg', blurb: 'Legs for sport: a jump to start, then strength, then single-leg control.',
    about: 'Legs that are strong and quick. Each day starts with a jump while you are fresh, then moves to strength, squats and hinges one day, single-leg work the other. Rests are a little longer than usual so the jumps stay sharp. Abs finish every session. Level II adds reps and Level III brings harder jumps and versions.',
    names: ['Spring Load', 'Pop', 'Snap Up', 'Rebound Day', 'Drive Up', 'Jump Day', 'Bound Day', 'Explode Up', 'Quick Legs', 'Fast Twitch', 'Elastic Legs', 'Power Step', 'Leap Day', 'Vault', 'Hurdle'],
    cycle: ['power', 'single'],
    dayTypes: {
      power: { label: 'Power & strength', short: 'Power', blocks: [S('Power & strength', ['plyoLow', 'squat2', 'hinge2', 'lunge2', 'plyoLow?'])] },
      single: { label: 'Single leg', short: 'Single', blocks: [S('Single leg', ['plyoLat', 'singleLeg', 'lunge2', 'singleLeg', 'glute2?'])] },
    },
  },
  // KETTLEBELL ONLY (+4)
  {
    id: 'bell-circuit', added: 14, catalogue: 8, name: 'Bell Circuit', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Circuit A / circuit B', blurb: 'One kettlebell, full-body circuits: a swing, a squat, a press and a row every round.',
    about: 'Full-body circuits with one kettlebell. Every round has a swing or a snatch, a squat, a press and a row, with a breather between rounds. Two days alternate the moves. It is strength and conditioning in one, about thirty minutes. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Round Robin', 'Merry-go-round', 'Carousel', 'Roundabout', 'Ferris Wheel', 'Lap of Bells', 'Bell Loop', 'Circle Back', 'Orbit', 'Revolution', 'Rotation Day', 'Spin Cycle', 'Whirligig', 'Turntable', 'Wheel'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Bell circuit', ['kbBallistic', 'kbLower', 'kbUpper', 'kbUpper2', 'kbCore2?'], { values: [3, 4, 5] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Bell circuit', ['kbSwing', 'kbLower2', 'kbUpper2', 'kbUpper', 'kbCore2?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'getup-strong', added: 14, catalogue: 8, name: 'Get-up Strong', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Get-up & press / swing & squat', blurb: 'The kettlebell essentials: Turkish get-ups and presses one day, swings and squats the next.',
    about: 'The kettlebell essentials, two days on repeat. One day is the Turkish get-up, slow and deliberate, with presses and windmills for strong, stable shoulders. The other is swings and squats for the hips and legs. Straight sets with full rests. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Get Up', 'Stand Up', 'Rise', 'Roll to Elbow', 'Bridge Up', 'Sweep Through', 'Lunge Up', 'Overhead Day', 'Pack the Shoulder', 'Eyes on Bell', 'Slow and Steady', 'Floor to Sky', 'Bell High', 'Low Sweep', 'Full Get-up'],
    cycle: ['getup', 'swing'],
    dayTypes: {
      getup: { label: 'Get-up & press', short: 'Get-up', blocks: [S('Get-up & press', ['turkish_getup', 'kb_press', 'kb_windmill', 'kbUpper2', 'kbCore2?'])] },
      swing: { label: 'Swing & squat', short: 'Swing', blocks: [S('Swing & squat', ['kb_swing', 'goblet_squat', 'kbLower2', 'kbLower', 'kbSwing?'])] },
    },
  },
  {
    id: 'swing-press-emom', added: 14, catalogue: 8, name: 'Swing & Press EMOM', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'EMOM A / EMOM B', blurb: 'Swings and presses on the minute: a kettlebell EMOM that builds power and shoulders.',
    about: 'Swings and presses on the minute. At the top of every minute comes a set of swings, presses, cleans or squats, and you rest for whatever is left. The EMOM is long enough to build real work capacity, with a short strength block after. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Swing Clock', 'Press Clock', 'Bell Minute', 'Iron Minute', 'Hike Minute', 'Hardstyle Clock', 'Snap Minute', 'Lock Minute', 'Rack Minute', 'Drive Minute', 'Float Minute', 'Punch Minute', 'Pack Minute', 'Bell Beat', 'Bell Pulse'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('Swing & press EMOM', ['kb_swing', 'kb_press', 'kbBallistic', 'kbUpper'], { values: [14, 16, 18, 20] }), S('Strength', ['kbLower2', 'kbLower2?'])] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('Swing & press EMOM', ['kbSwing', 'kbUpper2', 'kbLower', 'kbBallistic'], { values: [14, 16, 18, 20] }), S('Strength', ['kbUpper2', 'kbUpper2?'])] },
    },
  },
  {
    id: 'slow-bell', added: 14, catalogue: 8, name: 'Slow Bell', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'tempo', 'weight'],
    split: 'Lower / upper', blurb: 'Kettlebell strength done slowly: squats, deadlifts, presses and rows with a long lowering.',
    about: 'Kettlebell strength done slowly, which makes one bell feel heavier. Lower days are squats, deadlifts and lunges; upper days are presses, rows and get-ups. From Level II every rep has a three-second lowering, and Level III asks for a heavier bell as well. Straight sets with full rests. Abs finish every session.',
    names: ['Slow Burn Bell', 'Patience', 'Easy Lower', 'Long Way Down', 'Control Day', 'Steady Bell', 'Glacier', 'Tortoise', 'Snail', 'Sloth Day', 'Molasses', 'Treacle', 'Honey', 'Slow Drip', 'Hourglass Bell'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Lower', short: 'Lower', blocks: [S('Lower body', ['kbLower2', 'kbLower', 'kbLower2', 'kbLower', 'kbCore2?'])] },
      upper: { label: 'Upper', short: 'Upper', blocks: [S('Upper body', ['kbUpper2', 'kbUpper', 'kbUpper2', 'kbUpper', 'kbCore2?'])] },
    },
  },
  // BODYWEIGHT (+3)
  {
    id: 'pushup-progress', added: 14, catalogue: 8, name: 'Push-up Progress', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Push / legs & core', blurb: 'Better push-ups, step by step: from standard to diamond, archer and clap, with legs and core between.',
    about: 'A program for better push-ups. Push days work through push-up variations, standard, diamond, pike and spiderman, in straight sets; legs and core days give the arms time to recover. Level II moves to harder push-ups such as archers and claps, and Level III adds reps on top. Abs finish every session. No equipment.',
    names: ['Floor Press', 'Plank Up', 'Chest Down', 'Push Away', 'Elbows In', 'Lockout Arm', 'Diamond Day', 'Archer Day', 'Clap Day', 'Pike Day', 'Spider Day', 'Wide Day', 'Close Day', 'Decline Day', 'Hundred Club'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [S('Push-ups', ['pushup', 'pushBw2', 'pushBw2', 'pike_pushup', 'pushBw2?'])] },
      legs: { label: 'Legs & core', short: 'Legs', blocks: [S('Legs & core', ['legsBw2', 'legsBw2', 'coreAnti', 'legsBw2', 'coreHollow?'])] },
    },
  },
  {
    id: 'bodyweight-amrap', added: 14, catalogue: 8, name: 'Bodyweight AMRAP', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'AMRAP A / AMRAP B', blurb: 'As many rounds as you can of push-ups, squats, pulls and core, then a short burnout.',
    about: 'As many rounds as you can of a bodyweight circuit: a push, a squat or lunge, a floor pull and a core move. Write the rounds down and try to beat them two weeks later. A short burnout circuit follows. Abs finish every session. Both later levels add reps, so each round takes longer.',
    names: ['Max Out', 'Rounds Day', 'Count Up', 'Clock Run', 'Beat Yesterday', 'More Rounds', 'Score Day', 'Push On Day', 'Grind', 'Keep Moving', 'Nonstop', 'Full Gas', 'All In', 'Last Round', 'Final Bell'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'AMRAP A', short: 'A', blocks: [A('AMRAP', ['pushBw2', 'legsBw2', 'pullBw', 'coreAnti'], { values: [10, 12, 14] }), C('Burnout', ['pushBw2', 'legsBw2'], { values: [1, 2] })] },
      b: { label: 'AMRAP B', short: 'B', blocks: [A('AMRAP', ['legsBw2', 'pushBw2', 'pullBw', 'coreRot'], { values: [10, 12, 14] }), C('Burnout', ['legsBw2', 'pushBw2'], { values: [1, 2] })] },
    },
  },
  {
    id: 'pistol-path', added: 14, catalogue: 8, name: 'Pistol Path', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Single-leg legs / upper & core', blurb: 'Single-leg strength with no equipment, working toward the pistol squat, with upper days between.',
    about: 'Single-leg strength with no equipment, working toward the pistol squat. Leg days build through shrimp squats, Cossack squats, single-leg deadlifts and pistol box squats, slowly and with control. Upper and core days come between. Both later levels move to harder versions rather than more reps. Abs finish every session.',
    names: ['Pistol', 'Revolver', 'One Leg', 'Shrimp', 'Cossack', 'Flamingo Day', 'Crane Day', 'Stork', 'Heron Day', 'Single Track', 'Balance Squat', 'Deep One', 'Low One', 'Steady One', 'Sharpshooter'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: { label: 'Single-leg legs', short: 'Legs', blocks: [S('Single-leg strength', ['shrimp_squat', 'pistol_box_squat', 'cossack_squat', 'single_leg_rdl_bw', 'single_leg_bridge?'])] },
      upper: { label: 'Upper & core', short: 'Upper', blocks: [S('Upper & core', ['pushBw2', 'pullBw', 'pushBw2', 'coreHollow', 'pullBw?'])] },
    },
  },
  // BUSY WEEK (+5)
  {
    id: 'twenty-strength', added: 14, catalogue: 8, name: 'Twenty Strength', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'weight', 'reps'],
    split: 'Upper / lower, 20 minutes', blurb: 'Twenty minutes of straight-set strength: upper one day, lower the next, heavier each level.',
    about: 'Real strength in twenty minutes. Upper and lower days alternate, each three or four exercises in straight sets with honest rests, no supersets and no rushing. It is short because it is focused, not because it is easy. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Quick Lift', 'Short Set', 'Twenty Up', 'Brief', 'Snappy', 'Compact', 'Pocket', 'Express Lift', 'Fast Track', 'Lunch Lift', 'Coffee Lift', 'Early Lift', 'Late Lift', 'Nip In', 'Pop In'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper', short: 'Upper', blocks: [S('Upper body', ['pushLoad2', 'row2', 'shoulders2?'])] },
      lower: { label: 'Lower', short: 'Lower', blocks: [S('Lower body', ['squat2', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'twenty-tabata', added: 14, catalogue: 8, name: 'Twenty Tabata', subject: 'Busy week', minutes: [18.5, 21.4], absSlots: ['abs'], levers: [null, 'reps', 'variation'],
    split: 'Strength + Tabata A / B', blurb: 'Twenty minutes: a short strength superset, then a Tabata to finish you off.',
    about: 'Twenty minutes in two parts: a superset of strength moves, then a Tabata. The Tabata is cardio and core, twenty seconds hard and ten seconds rest, eight times. Strength and fitness in one short session. Two days alternate the moves. Abs finish every session. Level II adds reps and Level III brings harder moves.',
    names: ['Double Shot', 'Combo Meal', 'Two-parter', 'Duet', 'One-two Punch', 'Split Shift', 'Half and Half', 'Both Ways', 'Twin Set', 'Pair Bond', 'Tag Team', 'Double Act', 'Back to Back', 'Bookends', 'Brace of Two'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Strength + Tabata A', short: 'A', blocks: [SS('Strength', ['squat2', 'pushLoad2', 'hinge2?', 'row2?']), T('Tabata', ['hiit', 'core', 'hiit', 'core'], { values: [1] })] },
      b: { label: 'Strength + Tabata B', short: 'B', blocks: [SS('Strength', ['lunge2', 'row2', 'glute2?', 'shoulders2?']), T('Tabata', ['hiit', 'core', 'hiit', 'core'], { values: [1] })] },
    },
  },
  {
    id: 'fifteen-flat', added: 14, catalogue: 8, name: 'Fifteen Flat', subject: 'Busy week', minutes: [13, 17], absSlots: ['abs'], levers: [null, 'reps', 'reps'],
    split: 'Full body A / B / C', blurb: 'Fifteen minutes, full body, three circuits in turn: for the busiest days.',
    about: 'Fifteen minutes for the busiest days, when twenty is too much. One full-body circuit each day, three versions in turn, with a squat or hinge, a push, a pull and a core move every round. Short rests keep it moving. A quick abs finisher closes it. Both later levels add reps.',
    names: ['Quarter Hour', 'Fifteen', 'Sprint Session', 'Flash', 'Blink', 'Zip', 'Dash', 'Whizz', 'Rapid', 'Swift', 'Nimble', 'Brisk', 'Speedy', 'Hasty', 'Express Fifteen'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Full body A', short: 'A', blocks: [C('Circuit', ['squat2', 'pushLoad2', 'row2', 'core2?'], { values: [1, 2, 3] })] },
      b: { label: 'Full body B', short: 'B', blocks: [C('Circuit', ['hinge2', 'shoulders2', 'row2', 'core2?'], { values: [1, 2, 3] })] },
      c: { label: 'Full body C', short: 'C', blocks: [C('Circuit', ['lunge2', 'chest2', 'row2', 'core2?'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'commuter', added: 14, catalogue: 8, name: 'Commuter', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'reps', 'weight'],
    split: 'EMOM / AMRAP', blurb: 'Twenty minutes before or after the commute: an EMOM one day, an AMRAP the next.',
    about: 'Twenty minutes that fit around a commute. One day is an EMOM of full-body strength moves, a set at the top of every minute; the other is an AMRAP, as many rounds as you can of a short circuit. Both keep you moving without thinking about rests. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Rush Hour', 'Platform', 'Season Ticket', 'Timetable', 'Next Train', 'Ring Road', 'Bus Lane', 'Car Pool', 'Park and Ride', 'Mind the Gap', 'Last Stop', 'Express Line', 'Junction', 'Terminal', 'Arrivals'],
    cycle: ['emom', 'amrap'],
    dayTypes: {
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('EMOM', ['squat2', 'row2', 'pushLoad2', 'hinge2'], { values: [8, 10, 12, 14] })] },
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('AMRAP', ['lunge2', 'pushLoad2', 'row2', 'core2'], { values: [6, 8, 10, 12] })] },
    },
  },
  {
    id: 'kettlebell-20', added: 14, catalogue: 8, name: 'Kettlebell 20', subject: 'Busy week', minutes: [18.5, 21.4], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Bell EMOM / bell circuit', blurb: 'Twenty minutes with one kettlebell: an EMOM one day, a circuit the next.',
    about: 'Twenty minutes with one kettlebell for days when that is all there is. One day is an EMOM of swings, cleans, presses and squats; the other a circuit of the same, round after round with a short breather. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Bell Break', 'Quick Bell', 'Short Swing', 'Bell Snack', 'Kettle Twenty', 'Bell Dash', 'Hike Twenty', 'Swing Break', 'Twenty Bells', 'Bell Hour', 'Iron Twenty', 'Bell Bite', 'Small Bell', 'Bell Nip', 'Fast Bell'],
    cycle: ['emom', 'circuit'],
    dayTypes: {
      emom: { label: 'Bell EMOM', short: 'EMOM', blocks: [E('Bell EMOM', ['kbBallistic', 'kbLower', 'kbUpper', 'kbSwing'], { values: [6, 8, 10, 12] })] },
      circuit: { label: 'Bell circuit', short: 'Circuit', blocks: [C('Bell circuit', ['kbSwing', 'kbLower2', 'kbUpper2', 'kbCore2?'], { values: [2, 3, 4] })] },
    },
  },
  // ---------------- PHASE 16: CHEST (chest plus its helpers, the triceps and front shoulders; abs to finish) ----------------
  {
    id: 'chest-day', added: 16, catalogue: 9, name: 'Chest Day', subject: 'Chest', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Press / push-ups / lower & back', blurb: 'Two chest days for every other day: heavy presses, then push-ups and flys, then legs and back.',
    about: 'Two days of chest for every day of everything else. The first is heavy floor presses with a triceps move behind them; the second is push-up variations and flys for the stretch and squeeze. The third day trains legs and back so nothing falls behind. Abs finish every session. Level II asks for heavier dumbbells and Level III adds reps.',
    names: ['Breastplate', 'Cuirass', 'Barrel Chest', 'Bench Mark', 'Pec Deck', 'Chest Plate', 'Shield', 'Armour', 'Bulwark', 'Rampart', 'Front Line', 'Vanguard', 'Bastion', 'Keel', 'Prow', 'Bow Wave', 'Figurehead', 'Ironclad', 'Hull', 'Broadside'],
    cycle: ['press', 'push', 'rest'],
    dayTypes: {
      press: { label: 'Chest presses', short: 'Press', blocks: [S('Chest press', ['chestPress', 'chestPress', 'triceps2', 'shoulderPress?'])] },
      push: { label: 'Push-ups & flys', short: 'Push-ups', blocks: [S('Push-ups & flys', ['chestBw', 'floor_fly', 'chestBw', 'chestIso?'])] },
      rest: { label: 'Lower & back', short: 'Lower', blocks: [S('Lower & back', ['squat2', 'backRow', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'push-and-press', added: 16, catalogue: 9, name: 'Push & Press', subject: 'Chest', minutes: [28, 33], levers: [null, 'reps', 'tempo'],
    split: 'Chest & triceps / chest & shoulders', blurb: 'Chest every day in supersets, paired with the triceps one day and the shoulders the next.',
    about: 'Chest every day, in supersets with the muscles that help it press. One day pairs each chest move with a triceps move; the other pairs it with a shoulder press or raise. The helper works while the chest catches its breath, so the session stays short and dense. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Push Pair', 'Double Act', 'Tag Team', 'Partners', 'Duet', 'Twin Engine', 'Co-Pilot', 'Wingman', 'Sidekick', 'Backup', 'Relay Press', 'Second Wind', 'Doubles', 'Two-Step', 'Tandem', 'Pairing', 'Echo', 'Mirror', 'Coupling', 'Alliance'],
    cycle: ['tri', 'delt'],
    dayTypes: {
      tri: { label: 'Chest & triceps', short: 'Triceps', blocks: [SS('Chest & triceps', ['chestPress', 'triceps2', 'chestBw', 'triceps2', 'chestIso', 'triceps2'])] },
      delt: { label: 'Chest & shoulders', short: 'Shoulders', blocks: [SS('Chest & shoulders', ['chestPress', 'shoulderPress', 'chestBw', 'shoulderRaise', 'chestIso', 'shoulderRaise'])] },
    },
  },
  {
    id: 'pushup-chest', added: 16, catalogue: 9, name: 'Push-up Chest', subject: 'Chest', minutes: [26, 31], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Push-up circuit A / B / legs & back', blurb: 'A bigger chest with no equipment: push-up circuits two days in three, legs and floor pulls on the third.',
    about: 'A chest program for the floor and nothing else. Two days in three are push-up circuits: wide, pseudo-planche, close-grip and bottom holds, round after round with short rests. The third day is legs and floor pulls, so the back keeps up with the chest. Abs finish every session. Level II adds reps and Level III brings harder push-ups.',
    names: ['Floor Work', 'Ground Up', 'Carpet', 'Rug Burn', 'Living Room', 'Hallway', 'Plank Street', 'Lino', 'Parquet', 'Floorboards', 'Doormat', 'Tatami', 'Bare Floor', 'Push Mat', 'Deck', 'Ground Floor', 'Basement', 'Flagstone', 'Paving', 'Tiles'],
    cycle: ['a', 'b', 'legs'],
    dayTypes: {
      a: { label: 'Push-up circuit A', short: 'A', blocks: [C('Push-up circuit', ['chestBw', 'chestBw', 'pushup_hold', 'chestBw?'], { values: [3, 4, 5] })] },
      b: { label: 'Push-up circuit B', short: 'B', blocks: [C('Push-up circuit', ['wide_pushup', 'chestBw', 'close_grip_pushup', 'chestBw?'], { values: [3, 4, 5] })] },
      legs: { label: 'Legs & back', short: 'Legs', blocks: [C('Legs & back', ['legsBw2', 'backBw', 'legsBw2', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'chest-emom', added: 16, catalogue: 9, name: 'Chest EMOM', subject: 'Chest', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'Chest EMOM A / B', blurb: 'Chest on the minute every day, with a triceps or shoulder move in the rotation.',
    about: 'Chest every day, on the clock. Each minute starts a set, a press, a push-up or a fly, and what is left of the minute is your rest. A triceps move turns up in one day\'s rotation and a shoulder raise in the other\'s, so the helpers get their share. Abs finish every session. Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Tick Tock', 'Clockwork', 'Metronome', 'Pendulum', 'Stopwatch', 'Sundial', 'Hourglass', 'On the Dot', 'Top of the Hour', 'Chime', 'Second Hand', 'Minute Hand', 'Cuckoo', 'Big Ben', 'Alarm', 'Countdown', 'Lap Time', 'Split Time', 'Time Check', 'Bell Tower'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Chest EMOM A', short: 'A', blocks: [E('Chest EMOM', ['chestPress', 'chestBw', 'triceps2', 'chestIso'], { values: [12, 14, 16] })] },
      b: { label: 'Chest EMOM B', short: 'B', blocks: [E('Chest EMOM', ['chestBw', 'chestPress', 'shoulderRaise', 'chestIso'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'bell-chest', added: 16, catalogue: 9, name: 'Bell Chest', subject: 'Chest', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Chest / chest & triceps / legs & back', blurb: 'Chest with one kettlebell: one-arm floor presses and push-ups, then a day of legs and rows.',
    about: 'Chest work for a home with one kettlebell. Two days in three are built on the one-arm floor press, which also makes your core resist the twist, with push-ups and holds around it. One of those days adds floor dips and close-grip push-ups for the triceps. The third day is goblet squats, deadlifts and rows. Abs finish every session; Level II adds reps and Level III slows the reps down.',
    names: ['Cast Iron', 'Cannonball', 'Bell Ringer', 'Anchor', 'Ballast', 'Plumb Line', 'Counterweight', 'Pig Iron', 'Ingot Press', 'Bell Jar', 'Toll', 'Peal', 'Clapper', 'Carillon', 'Belfry', 'Gong', 'Chime Press', 'Ring Out', 'Last Bell', 'Doorbell'],
    cycle: ['a', 'b', 'other'],
    dayTypes: {
      a: { label: 'Chest', short: 'Chest', blocks: [S('Chest', ['kb_floor_press', 'chestBw', 'pushup_hold', 'chestBw?'])] },
      b: { label: 'Chest & triceps', short: 'Triceps', blocks: [S('Chest & triceps', ['chestBw', 'kb_floor_press', 'close_grip_pushup', 'floor_dip?'])] },
      other: { label: 'Legs & back', short: 'Legs', blocks: [S('Legs & back', ['kbLower2', 'kb_dead_stop_row', 'kbLower2', 'kb_row?'])] },
    },
  },
  {
    id: 'chest-ladders', added: 16, catalogue: 9, name: 'Chest Ladders', subject: 'Chest', minutes: [26, 31], levers: [null, 'reps', 'variation'],
    split: 'Ladder & triceps / ladder & shoulders', blurb: 'A chest ladder every day, climbing a rep at a time, then the triceps or the shoulders.',
    about: 'Every day climbs a chest ladder: one rep of a press and a push-up, then two, then three, as high as the time allows. A short block for a helper follows, triceps and shoulder raises one day and a press and triceps the other. Ladders pile up a lot of good reps without ever feeling like a grind. Abs finish every session. Level II adds reps and Level III brings harder push-ups.',
    names: ['Rung One', 'Step Ladder', 'Rope Ladder', 'Fire Escape', 'Stairwell', 'Escalator', 'Climb', 'Ascent', 'Summit Push', 'Rungs', 'Scaffold', 'Loft Ladder', 'Library Ladder', 'Jacob\'s Ladder', 'Upward', 'Rising', 'Top Step', 'Landing', 'Mezzanine', 'Attic'],
    cycle: ['tri', 'delt'],
    dayTypes: {
      tri: { label: 'Ladder & triceps', short: 'Triceps', blocks: [L('Chest ladder', ['chestBw', 'chestPress']), S('Helpers', ['triceps2', 'shoulderRaise'])] },
      delt: { label: 'Ladder & shoulders', short: 'Shoulders', blocks: [L('Chest ladder', ['chestPress', 'chestBw']), S('Helpers', ['shoulderPress', 'triceps2'])] },
    },
  },
  {
    id: 'chest-30', added: 16, catalogue: 9, days: 30, name: 'Chest 30', subject: 'Chest', minutes: [30, 35], levers: [null, 'weight', 'tempo'],
    split: 'Heavy chest / chest supersets / rest of you', blurb: 'A month of chest: heavy presses, then fly-and-push-up supersets, then a day for the rest of you.',
    about: 'A month for a stronger, fuller chest. One day is heavy: floor presses, close-grip presses and a triceps move, with full rests. The next is supersets of push-ups with flys and squeeze presses, for the pump. The third day trains legs and pulls so the rest of you keeps pace. Abs finish every session; Level II asks for heavier dumbbells and Level III slows every rep down.',
    names: ['Week One', 'Foundation', 'Groundwork', 'First Brick', 'Cornerstone', 'Lintel', 'Arch', 'Keystone', 'Buttress', 'Vault', 'Dome', 'Cupola', 'Spire', 'Pinnacle', 'Crown', 'Capstone', 'Finial', 'Weathervane', 'Flagpole', 'Topping Out'],
    cycle: ['heavy', 'pump', 'other'],
    dayTypes: {
      heavy: { label: 'Heavy chest', short: 'Heavy', blocks: [S('Heavy chest', ['db_floor_press', 'close_grip_press', 'chestPress', 'triceps2?'])] },
      pump: { label: 'Chest supersets', short: 'Pump', blocks: [SS('Chest supersets', ['chestBw', 'floor_fly', 'chestBw', 'squeeze_press'])] },
      other: { label: 'Rest of you', short: 'Rest', blocks: [S('Rest of you', ['squat2', 'pullBar2', 'hinge2', 'backRow?'])] },
    },
  },
  {
    id: 'chest-amrap-30', added: 16, catalogue: 9, days: 30, name: 'Chest AMRAP 30', subject: 'Chest', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'AMRAP & triceps / AMRAP & shoulders', blurb: 'Thirty days of chest AMRAPs: as many rounds as you can, with the triceps or shoulders in the round.',
    about: 'Thirty days, chest every one. Each day is an AMRAP: a push-up, a press and a helper move, as many rounds as you can in the time, at a pace you can hold. The helper is a triceps move one day and a shoulder move the next. Write down your rounds and try to beat them next time. Abs finish every session; Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Full Tilt', 'Flat Out', 'All In', 'No Brakes', 'Pedal Down', 'Redline', 'Overdrive', 'Max Effort', 'Top Gear', 'Burn', 'Blaze', 'Furnace', 'Boiler', 'Steam', 'Pressure', 'Surge', 'Torrent', 'Flood', 'Avalanche', 'Landslide'],
    cycle: ['tri', 'delt'],
    dayTypes: {
      tri: { label: 'AMRAP & triceps', short: 'Triceps', blocks: [A('Chest AMRAP', ['chestBw', 'chestPress', 'triceps2'], { values: [8, 10, 12] })] },
      delt: { label: 'AMRAP & shoulders', short: 'Shoulders', blocks: [A('Chest AMRAP', ['chestPress', 'chestBw', 'shoulderRaise'], { values: [8, 10, 12] })] },
    },
  },
  // ---------------- PHASE 16: BACK (lats and upper back plus their helpers, the biceps and rear shoulders; abs to finish) ----------------
  {
    id: 'back-day', added: 16, catalogue: 9, name: 'Back Day', subject: 'Back', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Rows / pull-ups / legs & push', blurb: 'Two back days for every other day: heavy rows, then the pull-up bar, then legs and pushing.',
    about: 'Two days of back for every day of everything else. The first is heavy rows, gorilla rows and dead-stop rows, with rear-shoulder work behind them; the second is the pull-up bar. A curl closes each back day when time allows. The third day trains legs and presses. Abs finish every session; Level II asks for heavier weights and Level III adds reps.',
    names: ['Spine', 'Backbone', 'Wingspan', 'Lat Spread', 'Mantle', 'Cape', 'Cloak', 'Rucksack', 'Backpack', 'Shell', 'Carapace', 'Hump', 'Ridge', 'Crest', 'Saddle', 'Yoke', 'Harness', 'Back Line', 'Rear Guard', 'Tailwind'],
    cycle: ['rows', 'bar', 'rest'],
    dayTypes: {
      rows: { label: 'Rows', short: 'Rows', blocks: [S('Rows', ['backRow', 'backRow', 'backRear', 'biceps2?'])] },
      bar: { label: 'Pull-ups', short: 'Bar', blocks: [S('Pull-ups', ['backBar', 'backBar', 'backRear', 'biceps2?'])] },
      rest: { label: 'Legs & push', short: 'Legs', blocks: [S('Legs & push', ['squat2', 'chestPress', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'back-and-biceps', added: 16, catalogue: 9, name: 'Back & Biceps', subject: 'Back', minutes: [28, 33], levers: [null, 'reps', 'tempo'],
    split: 'Back & biceps / back & rear shoulders', blurb: 'Back every day in supersets, with the biceps one day and the rear shoulders the next.',
    about: 'Back every day, in supersets with the muscles that help it pull. One day pairs each row or pull-up with a curl; the other pairs it with rear-shoulder work like reverse flys and Y raises. The helper works while the back recovers, so the session stays short. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Pull Pair', 'Draw Bridge', 'Oars', 'Rowboat', 'Tug of War', 'Winch Pull', 'Haul Line', 'Anchor Rope', 'Bowline', 'Sheet Bend', 'Halyard', 'Mainsheet', 'Rigging', 'Mooring', 'Grapnel', 'Tow Rope', 'Lifeline', 'Bell Rope', 'Pull Cord', 'Ripcord'],
    cycle: ['bi', 'rear'],
    dayTypes: {
      bi: { label: 'Back & biceps', short: 'Biceps', blocks: [SS('Back & biceps', ['backRow', 'biceps2', 'backBar', 'biceps2', 'backRear', 'biceps2'])] },
      rear: { label: 'Back & rear shoulders', short: 'Rear', blocks: [SS('Back & rear shoulders', ['backRow', 'backRear', 'backBar', 'backRear', 'backRow', 'shoulderHealth'])] },
    },
  },
  {
    id: 'floor-back', added: 16, catalogue: 9, name: 'Floor Back', subject: 'Back', minutes: [26, 31], equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Floor pulls A / B / legs & push', blurb: 'A stronger back with no bar and no weights: floor-pull circuits, then legs and push-ups.',
    about: 'A back program for the floor alone. Two days in three are circuits of floor pulls: prone lat pulls, superman rows, reverse snow angels and Y raises, which train the back by lifting against gravity. The third day is legs and push-ups. It suits travel, small rooms and anyone without a bar. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Snow Angel', 'Starfish', 'Swan Dive', 'Glider', 'Kite', 'Albatross', 'Condor', 'Osprey', 'Kestrel', 'Falcon', 'Heron', 'Stork', 'Crane Wings', 'Manta', 'Stingray', 'Flying Fish', 'Paper Plane', 'Hang Glide', 'Parasail', 'Skydiver'],
    cycle: ['a', 'b', 'legs'],
    dayTypes: {
      a: { label: 'Floor pulls A', short: 'A', blocks: [C('Floor pulls', ['backBw', 'backBw', 'backBw', 'backBw?'], { values: [3, 4, 5] })] },
      b: { label: 'Floor pulls B', short: 'B', blocks: [C('Back & rear shoulders', ['backBw', 'prone_ytw', 'backBw', 'backBw?'], { values: [3, 4, 5] })] },
      legs: { label: 'Legs & push', short: 'Legs', blocks: [C('Legs & push', ['legsBw2', 'chestBw', 'legsBw2', 'chestBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'back-emom', added: 16, catalogue: 9, name: 'Back EMOM', subject: 'Back', minutes: [24, 29], levers: [null, 'reps', 'variation'],
    split: 'Back EMOM A / B', blurb: 'Back on the minute every day: pull-ups, rows, rear-shoulder work and curls in rotation.',
    about: 'Back every day, on the clock. Each minute starts a set of pull-ups, rows, rear-shoulder work or curls, and the rest of the minute is yours. The rotation changes from one day to the next, so the bar and the dumbbells share the load. Abs finish every session. Level II adds reps and Level III brings harder pull-ups.',
    names: ['On the Minute', 'Punch Clock', 'Shift Bell', 'Whistle', 'Klaxon', 'Starting Gun', 'Heartbeat', 'Pulse', 'Drumbeat', 'Cadence', 'Rhythm', 'Tempo', 'Beat', 'Downbeat', 'Count In', 'Time Signature', 'Bar Line', 'Measure', 'Refrain', 'Coda'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Back EMOM A', short: 'A', blocks: [E('Back EMOM', ['backBar', 'backRow', 'biceps2', 'backRear'], { values: [12, 14, 16] })] },
      b: { label: 'Back EMOM B', short: 'B', blocks: [E('Back EMOM', ['backRow', 'backBar', 'backRear', 'biceps2'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'bell-back', added: 16, catalogue: 9, name: 'Bell Back', subject: 'Back', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Bell rows / pulls & swings / legs & press', blurb: 'Back with one kettlebell: rows, high pulls and swings, then a day of legs and presses.',
    about: 'Back work for a home with one kettlebell. One day is rows: dead-stop rows, kettlebell rows and high pulls. The next mixes rows with swings, which work the whole back of the body, and a floor pull. The third day is squats and presses. Abs finish every session; Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Pull', 'Rope Bell', 'Ship\'s Bell', 'Church Bell', 'Handbell', 'Cowbell', 'School Bell', 'Sleigh Bell', 'Dinner Bell', 'Diving Bell', 'Bell Hop', 'Belltower', 'Big Bell', 'Bronze', 'Foundry Bell', 'Liberty', 'Tenor Bell', 'Treble', 'Bell Curve', 'Bell Lap'],
    cycle: ['rows', 'swing', 'other'],
    dayTypes: {
      rows: { label: 'Bell rows', short: 'Rows', blocks: [S('Bell rows', ['kb_dead_stop_row', 'kb_row', 'kb_high_pull', 'backBw?'])] },
      swing: { label: 'Pulls & swings', short: 'Swings', blocks: [S('Pulls & swings', ['kb_row', 'kb_swing', 'backBw', 'kb_dead_stop_row?'])] },
      other: { label: 'Legs & press', short: 'Legs', blocks: [S('Legs & press', ['kbLower2', 'kb_press', 'kbLower2', 'kb_floor_press?'])] },
    },
  },
  {
    id: 'back-ladders', added: 16, catalogue: 9, name: 'Back Ladders', subject: 'Back', minutes: [26, 31], levers: [null, 'reps', 'tempo'],
    split: 'Ladder & biceps / ladder & rear shoulders', blurb: 'A pull ladder every day, a rep at a time, then the biceps or the rear shoulders.',
    about: 'Every day climbs a back ladder: one pull-up and one row, then two of each, then three, for as long as the time allows. A short helper block follows, curls and rear-shoulder work in turn. The ladder lets you do far more pull-ups than straight sets would, without ever going to failure. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Belay', 'Abseil', 'Rappel', 'Carabiner', 'Harness Up', 'Chalk Bag', 'Overhang', 'Chimney', 'Crux', 'Pitch', 'Ridge Line', 'Traverse', 'Scramble', 'Via Ferrata', 'Bolt Line', 'Top Rope', 'Lead Climb', 'Send', 'Flash', 'Onsight'],
    cycle: ['bi', 'rear'],
    dayTypes: {
      bi: { label: 'Ladder & biceps', short: 'Biceps', blocks: [L('Pull ladder', ['backBar', 'backRow']), S('Helpers', ['biceps2', 'backRear'])] },
      rear: { label: 'Ladder & rear shoulders', short: 'Rear', blocks: [L('Pull ladder', ['backRow', 'backBar']), S('Helpers', ['backRear', 'biceps2'])] },
    },
  },
  {
    id: 'back-30', added: 16, catalogue: 9, days: 30, name: 'Back 30', subject: 'Back', minutes: [30, 35], levers: [null, 'weight', 'tempo'],
    split: 'Heavy back / back supersets / rest of you', blurb: 'A month of back: heavy rows and pull-ups, then rear-shoulder supersets, then the rest of you.',
    about: 'A month for a wider, stronger back. One day is heavy: gorilla rows, rows and pull-ups, with full rests and a curl to close. The next is supersets of rows and pull-ups with rear-shoulder moves, for posture as much as size. The third day trains legs and presses. Abs finish every session; Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Day One', 'Ground Floor', 'Scaffolding', 'Joists', 'Beams', 'Rafters', 'Trusses', 'Ridge Beam', 'Purlins', 'Battens', 'Slates', 'Gables', 'Eaves', 'Gutter', 'Chimney Stack', 'Flashing', 'Skylight', 'Dormer', 'Weather Seal', 'Roof Party'],
    cycle: ['heavy', 'pump', 'other'],
    dayTypes: {
      heavy: { label: 'Heavy back', short: 'Heavy', blocks: [S('Heavy back', ['gorilla_row', 'backRow', 'backBar', 'biceps2?'])] },
      pump: { label: 'Back supersets', short: 'Pump', blocks: [SS('Back supersets', ['backRear', 'backRow', 'backRear', 'backBar'])] },
      other: { label: 'Rest of you', short: 'Rest', blocks: [S('Rest of you', ['squat2', 'chestPress', 'hinge2', 'shoulderPress?'])] },
    },
  },
  {
    id: 'back-circuit-30', added: 16, catalogue: 9, days: 30, name: 'Back Circuit 30', subject: 'Back', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Back circuit A / B', blurb: 'Thirty days of back circuits: rows, pull-ups, rear-shoulder work and curls, round after round.',
    about: 'Thirty days of back, every day a circuit. A row, a pull-up, a rear-shoulder move and a curl run back to back, then a short rest and another round. The two days order them differently and swap one move, so the bar and the dumbbells share the work. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Loop', 'Lap', 'Orbit', 'Circuit Board', 'Roundabout', 'Ring Road', 'Merry-go-round', 'Carousel', 'Wheel', 'Spin Cycle', 'Rotation', 'Revolution', 'Turnstile', 'Revolving Door', 'Ferris Wheel', 'Hamster Wheel', 'Water Wheel', 'Flywheel', 'Gear Train', 'Clock Face'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Back circuit A', short: 'A', blocks: [C('Back circuit', ['backRow', 'backBar', 'backRear', 'biceps2', 'backRow?'], { values: [3, 4, 5] })] },
      b: { label: 'Back circuit B', short: 'B', blocks: [C('Back circuit', ['backBar', 'backRow', 'biceps2', 'backRear', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  // ---------------- PHASE 16: SHOULDERS (all three heads plus the traps, rotator cuff and triceps; abs to finish) ----------------
  {
    id: 'shoulder-day', added: 16, catalogue: 9, name: 'Shoulder Day', subject: 'Shoulders', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Presses / raises / legs & back', blurb: 'Two shoulder days for every other day: presses, then raises and shrugs, then legs and back.',
    about: 'Two days of shoulders for every day of everything else. The first is presses, from dumbbells and the kettlebell to pike push-ups, with a triceps move to finish. The second is raises for the side and rear heads, with shrugs for the traps. The third day trains legs and back. Abs finish every session; Level II asks for heavier weights and Level III adds reps.',
    names: ['Epaulette', 'Shoulder Pad', 'Pauldron', 'Yoke', 'Atlas', 'Cannonball Delt', 'Boulder', 'Coat Hanger', 'Broad Frame', 'Shoulder Blade', 'Clavicle', 'Acromion', 'Collar', 'Mantle Shelf', 'Overhead', 'Top Shelf', 'High Ground', 'Lintel', 'Capital', 'Cornice'],
    cycle: ['press', 'raise', 'rest'],
    dayTypes: {
      press: { label: 'Presses', short: 'Press', blocks: [S('Presses', ['shoulderPress', 'shoulderPress', 'shoulderRaise', 'triceps2?'])] },
      raise: { label: 'Raises & shrugs', short: 'Raises', blocks: [S('Raises & shrugs', ['shoulderRaise', 'shoulderRaise', 'reverse_fly', 'trapsPool?'])] },
      rest: { label: 'Legs & back', short: 'Legs', blocks: [S('Legs & back', ['squat2', 'backRow', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'boulder-shoulders', added: 16, catalogue: 9, name: 'Boulder Shoulders', subject: 'Shoulders', minutes: [28, 33], levers: [null, 'reps', 'tempo'],
    split: 'Shoulders & triceps / shoulders & traps', blurb: 'Shoulders every day in supersets, with the triceps one day and the traps the next.',
    about: 'Shoulders every day, in supersets with their helpers. One day pairs each press or raise with a triceps move; the other pairs it with shrugs, upright rows or carries for the traps. A rotator-cuff move sits in every day to keep the joint happy. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Bedrock', 'Granite', 'Basalt', 'Marble', 'Quartz', 'Flint', 'Slate', 'Obsidian', 'Monolith', 'Menhir', 'Tor', 'Outcrop', 'Cairn', 'Megalith', 'Standing Stone', 'Dolmen', 'Massif', 'Escarpment', 'Mesa', 'Butte'],
    cycle: ['tri', 'traps'],
    dayTypes: {
      tri: { label: 'Shoulders & triceps', short: 'Triceps', blocks: [SS('Shoulders & triceps', ['shoulderPress', 'triceps2', 'shoulderRaise', 'triceps2', 'shoulderHealth', 'triceps2'])] },
      traps: { label: 'Shoulders & traps', short: 'Traps', blocks: [SS('Shoulders & traps', ['shoulderRaise', 'trapsPool', 'shoulderPress', 'trapsPool', 'shoulderHealth', 'trapsPool'])] },
    },
  },
  {
    id: 'floor-shoulders', added: 16, catalogue: 9, name: 'Floor Shoulders', subject: 'Shoulders', minutes: [26, 31], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Shoulder circuit A / B / legs & back', blurb: 'Shoulders with no equipment: pike push-ups, holds and raises in circuits, then legs and floor pulls.',
    about: 'Shoulders built on the floor. Two days in three are circuits of pike push-ups, pike holds, pseudo-planche push-ups, side-lying raises and Y raises, which train all three heads of the shoulder with only your body. The third day is legs and floor pulls. Abs finish every session; Level II adds reps and Level III brings harder variations.',
    names: ['Pike Peak', 'Steeple', 'Spire Top', 'Tent Pole', 'A-Frame', 'Gable End', 'Pyramid', 'Obelisk', 'Arrowhead', 'Wedge', 'Delta', 'Chevron', 'Peak Hold', 'Summit', 'Apex', 'Vertex', 'Tip Top', 'Crowning', 'Pinnacle Press', 'High Point'],
    cycle: ['a', 'b', 'legs'],
    dayTypes: {
      a: { label: 'Shoulder circuit A', short: 'A', blocks: [C('Shoulder circuit', ['shoulderBw', 'shoulderBw', 'shoulderBw', 'shoulderBw?'], { values: [3, 4, 5] })] },
      b: { label: 'Shoulder circuit B', short: 'B', blocks: [C('Shoulder circuit', ['pike_pushup', 'shoulderBw', 'prone_y_raise', 'shoulderBw?'], { values: [3, 4, 5] })] },
      legs: { label: 'Legs & back', short: 'Legs', blocks: [C('Legs & back', ['legsBw2', 'backBw', 'legsBw2', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'shoulder-emom', added: 16, catalogue: 9, name: 'Shoulder EMOM', subject: 'Shoulders', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'Shoulder EMOM A / B', blurb: 'Shoulders on the minute every day: presses, raises, traps and rotator-cuff work in rotation.',
    about: 'Shoulders every day, on the clock. Each minute starts a press, a raise, a trap move or a rotator-cuff move, and the rest of the minute is recovery. The two days change the order and swap the traps for the triceps, so the shoulder gets worked from every side. Abs finish every session; Level II adds reps and Level III asks for heavier weights.',
    names: ['Minute Mark', 'Quarter Hour', 'Half Past', 'Bang On Time', 'Dead On', 'Prompt', 'Punctual', 'Spot On', 'Like Clockwork', 'Timekeeper', 'Watchmaker', 'Chronometer', 'Escapement', 'Mainspring', 'Balance Wheel', 'Crown Wind', 'Bezel', 'Dial', 'Lume', 'Tourbillon'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Shoulder EMOM A', short: 'A', blocks: [E('Shoulder EMOM', ['shoulderPress', 'shoulderRaise', 'trapsPool', 'shoulderHealth'], { values: [12, 14, 16] })] },
      b: { label: 'Shoulder EMOM B', short: 'B', blocks: [E('Shoulder EMOM', ['shoulderRaise', 'shoulderPress', 'shoulderHealth', 'triceps2'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'bell-shoulders', added: 16, catalogue: 9, name: 'Bell Shoulders', subject: 'Shoulders', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Bell presses / press & pull / legs & back', blurb: 'Shoulders with one kettlebell: presses, bottoms-up presses, halos and high pulls, then legs and rows.',
    about: 'Shoulders with one kettlebell. One day is presses: the strict press, the bottoms-up press that makes every rep steady, and halos around the head. The next mixes clean and presses with high pulls for the traps and rear shoulders. The third day is squats, deadlifts and rows. Abs finish every session; Level II adds reps and Level III asks for a heavier bell.',
    names: ['Halo', 'Crown Press', 'Bell Arc', 'Orbit Press', 'Ring of Fire', 'Lighthouse', 'Beacon', 'Torch', 'Lantern', 'Flare', 'Signal Fire', 'Watchtower', 'Steeple Bell', 'Minaret', 'Turret', 'Battlement', 'Parapet', 'Rampart Press', 'Keep', 'Citadel'],
    cycle: ['press', 'pull', 'other'],
    dayTypes: {
      press: { label: 'Bell presses', short: 'Press', blocks: [S('Bell presses', ['kb_press', 'bottoms_up_press', 'kb_halo', 'kb_high_pull?'])] },
      pull: { label: 'Press & pull', short: 'Pull', blocks: [S('Press & pull', ['kb_clean_press', 'kb_high_pull', 'kb_halo', 'kb_press?'])] },
      other: { label: 'Legs & back', short: 'Legs', blocks: [S('Legs & back', ['kbLower2', 'kb_row', 'kbLower2', 'kb_dead_stop_row?'])] },
    },
  },
  {
    id: 'shoulder-ladders', added: 16, catalogue: 9, name: 'Shoulder Ladders', subject: 'Shoulders', minutes: [26, 31], levers: [null, 'reps', 'variation'],
    split: 'Ladder & cuff / ladder & triceps', blurb: 'A shoulder ladder every day, press and raise a rep at a time, then the rotator cuff or the triceps.',
    about: 'Every day climbs a shoulder ladder: one press and one raise, then two, then three, as far as the time allows. A short block follows, the rotator cuff and traps one day and the triceps the other. Ladders build a lot of volume with the weight staying crisp. Abs finish every session; Level II adds reps and Level III brings harder variations.',
    names: ['Stair Climb', 'Rung by Rung', 'Ladder Up', 'Steps', 'Flight', 'Spiral Stair', 'Belvedere', 'Lookout', 'Crow\'s Nest', 'Masthead', 'Topgallant', 'Skysail', 'Royal', 'Mizzen', 'Foremast', 'Bowsprit', 'Jib', 'Spinnaker', 'Gaff', 'Boom'],
    cycle: ['cuff', 'tri'],
    dayTypes: {
      cuff: { label: 'Ladder & cuff', short: 'Cuff', blocks: [L('Shoulder ladder', ['shoulderPress', 'shoulderRaise']), S('Helpers', ['shoulderHealth', 'trapsPool'])] },
      tri: { label: 'Ladder & triceps', short: 'Triceps', blocks: [L('Shoulder ladder', ['shoulderRaise', 'shoulderPress']), S('Helpers', ['triceps2', 'shoulderHealth'])] },
    },
  },
  {
    id: 'shoulders-30', added: 16, catalogue: 9, days: 30, name: 'Shoulders 30', subject: 'Shoulders', minutes: [30, 35], levers: [null, 'weight', 'tempo'],
    split: 'Heavy press / raise supersets / rest of you', blurb: 'A month of shoulders: heavy presses, then raise supersets for every head, then the rest of you.',
    about: 'A month for rounder, stronger shoulders. One day is heavy pressing, the dumbbell press and the Arnold press, with a raise and a trap move to close. The next is supersets of lateral raises with reverse flys and upright rows with external rotations, so every head of the shoulder gets its turn. The third day trains legs and back. Abs finish every session; Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Opening Day', 'First Light', 'Sunrise', 'Morning Press', 'Daybreak', 'High Noon', 'Zenith', 'Meridian', 'Afternoon', 'Golden Hour', 'Sundown', 'Dusk', 'Twilight', 'Evening Star', 'Nightfall', 'Midnight', 'Small Hours', 'Last Watch', 'Dawn Again', 'New Day'],
    cycle: ['heavy', 'pump', 'other'],
    dayTypes: {
      heavy: { label: 'Heavy press', short: 'Heavy', blocks: [S('Heavy press', ['db_shoulder_press', 'arnold_press', 'shoulderRaise', 'trapsPool?'])] },
      pump: { label: 'Raise supersets', short: 'Raises', blocks: [SS('Raise supersets', ['lateral_raise', 'reverse_fly', 'upright_row', 'external_rotation'])] },
      other: { label: 'Rest of you', short: 'Rest', blocks: [S('Rest of you', ['squat2', 'backRow', 'hinge2', 'chestPress?'])] },
    },
  },
  {
    id: 'shoulder-circuit-30', added: 16, catalogue: 9, days: 30, name: 'Shoulder Circuit 30', subject: 'Shoulders', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Shoulder circuit A / B', blurb: 'Thirty days of shoulder circuits: presses, raises, traps and cuff work, round after round.',
    about: 'Thirty days of shoulders, every day a circuit. A press, a raise, a rotator-cuff move and a helper run back to back with little rest, then another round. One day the helper is a triceps move, the other a trap move. The weights stay moderate so the shoulders get a lot of good work without strain. Abs finish every session; Level II adds reps and Level III asks for heavier weights.',
    names: ['Round Trip', 'Return Ticket', 'Shuttle Run', 'Commute', 'Day Trip', 'Grand Tour', 'Circuit Race', 'Time Trial', 'Lap of Honour', 'Victory Lap', 'Home Straight', 'Back Straight', 'Chicane', 'Hairpin', 'Pit Stop', 'Pole Position', 'Grid', 'Checkered Flag', 'Podium', 'Paddock'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Shoulder circuit A', short: 'A', blocks: [C('Shoulder circuit', ['shoulderPress', 'shoulderRaise', 'shoulderHealth', 'triceps2', 'shoulderPress?'], { values: [3, 4, 5] })] },
      b: { label: 'Shoulder circuit B', short: 'B', blocks: [C('Shoulder circuit', ['shoulderRaise', 'shoulderPress', 'trapsPool', 'shoulderHealth', 'shoulderPress?'], { values: [3, 4, 5] })] },
    },
  },
  // ---------------- PHASE 16: ARMS (biceps and triceps plus the forearms; abs to finish) ----------------
  {
    id: 'arm-day', added: 16, catalogue: 9, name: 'Arm Day', subject: 'Arms', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Biceps / triceps / legs', blurb: 'A biceps day, a triceps day, then legs: two arm days for every leg day.',
    about: 'Two arm days for every day of legs. The biceps day runs through curls, hammer curls, Zottman and concentration curls, with a forearm move when time allows. The triceps day covers extensions, kickbacks, the Tate press and floor dips. The third day is squats, deadlifts and lunges. Abs finish every session; Level II asks for heavier dumbbells and Level III adds reps.',
    names: ['Guns', 'Pythons', 'Cannons', 'Pipes', 'Sleeves Rolled', 'Short Sleeves', 'Tank Top', 'Flex', 'Peak', 'Horseshoe', 'Bicep Bomb', 'Arm Candy', 'Biceps Peak', 'Gun Show', 'Muscle Beach', 'Popeye Day', 'Strongman', 'Iron Arms', 'Armband', 'Tattoo'],
    cycle: ['bi', 'tri', 'legs'],
    dayTypes: {
      bi: { label: 'Biceps', short: 'Biceps', blocks: [S('Biceps', ['biceps2', 'biceps2', 'biceps2', 'gripCurl?'])] },
      tri: { label: 'Triceps', short: 'Triceps', blocks: [S('Triceps', ['triceps2', 'triceps2', 'triceps2', 'triceps2?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2', 'glute2?'])] },
    },
  },
  {
    id: 'arm-supersets', added: 16, catalogue: 9, name: 'Arm Supersets', subject: 'Arms', minutes: [28, 33], levers: [null, 'reps', 'tempo'],
    split: 'Biceps & triceps / arms & forearms', blurb: 'Arms every day: biceps and triceps supersets one day, with the forearms in the pairs the next.',
    about: 'Arms every day, in supersets. One day pairs a biceps move with a triceps move, back to back, three times over. The other day brings the forearms in, wrist curls and reverse curls paired with curls and extensions. Opposite muscles rest each other, so the work keeps coming without long pauses. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Ping Pong', 'Seesaw', 'Back and Forth', 'Push Me Pull You', 'Yin Yang', 'Flip Flop', 'Toggle', 'Switchback', 'Zigzag', 'Ebb and Flow', 'Tide', 'Swing Time', 'Pendulum Arms', 'Rocker', 'Teeter', 'Volley', 'Rally', 'Return', 'Crosscourt', 'Baseline'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Biceps & triceps', short: 'Arms', blocks: [SS('Biceps & triceps', ['biceps2', 'triceps2', 'biceps2', 'triceps2', 'biceps2', 'triceps2'])] },
      b: { label: 'Arms & forearms', short: 'Forearms', blocks: [SS('Arms & forearms', ['biceps2', 'gripCurl', 'triceps2', 'gripCurl', 'biceps2', 'triceps2'])] },
    },
  },
  {
    id: 'bodyweight-arms', added: 16, catalogue: 9, name: 'Bodyweight Arms', subject: 'Arms', minutes: [26, 31], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Arm circuit / arms & chest / legs & back', blurb: 'Arms with no equipment: dips, close-grip and diamond push-ups in circuits, then legs and floor pulls.',
    about: 'Arm work with only your body, led by the triceps: floor dips, close-grip and diamond push-ups and plank-to-push-ups in circuits. One day pairs them with chest push-ups. The third day is legs and floor pulls, where superman rows and lat pulls give the biceps what bodyweight can. Abs finish every session; Level II adds reps and Level III brings harder variations.',
    names: ['Dip Stick', 'Diamond', 'Gemstone', 'Crystal', 'Sapphire', 'Emerald', 'Ruby', 'Garnet', 'Topaz', 'Opal', 'Jade', 'Onyx', 'Amber', 'Pearl', 'Agate', 'Jasper', 'Beryl', 'Zircon', 'Tourmaline', 'Moonstone'],
    cycle: ['arms', 'chest', 'legs'],
    dayTypes: {
      arms: { label: 'Arm circuit', short: 'Arms', blocks: [C('Arm circuit', ['armsBw', 'armsBw', 'armsBw', 'armsBw?'], { values: [3, 4, 5] })] },
      chest: { label: 'Arms & chest', short: 'Chest', blocks: [C('Arms & chest', ['armsBw', 'chestBw', 'armsBw', 'chestBw?'], { values: [3, 4, 5] })] },
      legs: { label: 'Legs & back', short: 'Legs', blocks: [C('Legs & back', ['legsBw2', 'backBw', 'legsBw2', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'arm-emom', added: 16, catalogue: 9, name: 'Arm EMOM', subject: 'Arms', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'Arm EMOM A / B', blurb: 'Arms on the minute every day: curls and extensions in rotation, the forearms on day two.',
    about: 'Arms every day, on the clock. Each minute starts a set of curls or triceps extensions, and the rest of the minute is recovery. Day two swaps one slot for a forearm curl, so the grip keeps up with the arms. Short, honest sessions that leave the arms pumped. Abs finish every session; Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Arm Clock', 'Wristwatch', 'Fob Watch', 'Pocket Watch', 'Egg Timer', 'Kitchen Timer', 'Stop Clock', 'Chess Clock', 'Grandfather', 'Carriage Clock', 'Wall Clock', 'Station Clock', 'Town Clock', 'Atomic Clock', 'Water Clock', 'Candle Clock', 'Shot Clock', 'Game Clock', 'Overtime', 'Final Whistle'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Arm EMOM A', short: 'A', blocks: [E('Arm EMOM', ['biceps2', 'triceps2', 'biceps2', 'triceps2'], { values: [12, 14, 16] })] },
      b: { label: 'Arm EMOM B', short: 'B', blocks: [E('Arm EMOM', ['triceps2', 'biceps2', 'gripCurl', 'triceps2'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'chinup-arms', added: 16, catalogue: 9, name: 'Chin-up Arms', subject: 'Arms', minutes: [28, 33], levers: [null, 'reps', 'tempo'],
    split: 'Chin-ups & curls / dips & presses / legs', blurb: 'Arms from the bar and the floor: chin-ups and curls, dips and presses, then a leg day.',
    about: 'Arms trained with the big moves first. The biceps day starts on the bar with chin-ups and chin holds, then curls. The triceps day starts with floor dips and close-grip push-ups, then extensions. The third day is legs. Bodyweight moves load the arms heavily, and the dumbbells finish them off. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Chin Up', 'Bar Room', 'Monkey Arms', 'Rope Arms', 'Gymnast', 'Ringman', 'Acrobat', 'Aerialist', 'Trapeze Artist', 'Tumbler', 'Vaulter', 'High Wire', 'Big Top', 'Ringmaster', 'Strongarm', 'Circus Strong', 'Juggler', 'Stilt Walker', 'Fire Eater', 'Grand Finale'],
    cycle: ['bi', 'tri', 'legs'],
    dayTypes: {
      bi: { label: 'Chin-ups & curls', short: 'Biceps', blocks: [S('Chin-ups & curls', ['chinup', 'biceps2', 'chin_hold', 'biceps2?'])] },
      tri: { label: 'Dips & presses', short: 'Triceps', blocks: [S('Dips & presses', ['floor_dip', 'triceps2', 'close_grip_pushup', 'triceps2?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2', 'glute2?'])] },
    },
  },
  {
    id: 'arm-ladders', added: 16, catalogue: 9, name: 'Arm Ladders', subject: 'Arms', minutes: [26, 31], levers: [null, 'reps', 'variation'],
    split: 'Biceps ladder / triceps ladder', blurb: 'An arm ladder every day, curls and extensions a rep at a time, then the forearms.',
    about: 'Every day climbs an arm ladder: one curl and one extension, then two, then three, as far as the time allows. A short forearm block follows, curls and loaded holds. One day leads with the biceps, the other with the triceps. Ladders give the arms a lot of work with crisp, clean reps. Abs finish every session; Level II adds reps and Level III brings harder variations.',
    names: ['Rung Arms', 'Ladder Arms', 'Step Up', 'Stairs', 'Staircase', 'Stepladder', 'Rung Climb', 'Ladder Rack', 'Ladder Back', 'Ladder Lift', 'Rising Rungs', 'Upstairs', 'Downstairs', 'Banister', 'Handrail', 'Stairwell Arms', 'Landing Arms', 'Top Rung', 'Ladder Peak', 'Climb Down'],
    cycle: ['bi', 'tri'],
    dayTypes: {
      bi: { label: 'Biceps ladder', short: 'Biceps', blocks: [L('Arm ladder', ['biceps2', 'triceps2']), S('Forearms', ['gripCurl', 'gripHold'])] },
      tri: { label: 'Triceps ladder', short: 'Triceps', blocks: [L('Arm ladder', ['triceps2', 'biceps2']), S('Forearms', ['gripHold', 'gripCurl'])] },
    },
  },
  {
    id: 'arms-30', added: 16, catalogue: 9, days: 30, name: 'Arms 30', subject: 'Arms', minutes: [30, 35], levers: [null, 'weight', 'tempo'],
    split: 'Heavy curls / heavy triceps / rest of you', blurb: 'A month of arms: heavy curls, then heavy triceps, then a day for the rest of you.',
    about: 'A month for bigger arms. One day is heavy curls: dumbbell, hammer, Zottman and concentration curls with full rests. The next is heavy triceps: close-grip presses, overhead extensions, the Tate press and kickbacks. The third day trains legs, back and chest so the arms have something to sit on. Abs finish every session; Level II asks for heavier dumbbells and Level III slows every rep down.',
    names: ['Arm One', 'Bicep Base', 'Triceps Base', 'Building Arms', 'Arm Frame', 'Arm Brace', 'Strut', 'Girder Arms', 'Crossbeam', 'Truss Arms', 'Lattice', 'Arm Span', 'Cantilever', 'Suspension', 'Arch Bridge', 'Steel Arms', 'Cable Stay', 'Tie Rod', 'Bolted', 'Riveted'],
    cycle: ['bi', 'tri', 'other'],
    dayTypes: {
      bi: { label: 'Heavy curls', short: 'Biceps', blocks: [S('Heavy curls', ['db_curl', 'hammer_curl', 'zottman_curl', 'concentration_curl?'])] },
      tri: { label: 'Heavy triceps', short: 'Triceps', blocks: [S('Heavy triceps', ['close_grip_press', 'overhead_triceps_ext', 'tate_press', 'db_kickback?'])] },
      other: { label: 'Rest of you', short: 'Rest', blocks: [S('Rest of you', ['squat2', 'backRow', 'hinge2', 'chestPress?'])] },
    },
  },
  {
    id: 'arm-circuit-30', added: 16, catalogue: 9, days: 30, name: 'Arm Circuit 30', subject: 'Arms', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Arm circuit A / B', blurb: 'Thirty days of arm circuits: curls, extensions and forearm work, round after round.',
    about: 'Thirty days of arms, every day a circuit. Curls and triceps moves alternate with a forearm move in the round, little rest between, a short break between rounds. The two days order them differently and swap the forearm curl for a loaded hold. Moderate weights, a lot of reps, a big pump. Abs finish every session; Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Pump Up', 'Swole', 'Engorge', 'Inflate', 'Balloon', 'Blimp', 'Zeppelin', 'Hot Air', 'Bellows', 'Pump Action', 'Air Pump', 'Bike Pump', 'Hydraulic', 'Pneumatic', 'Compressor', 'Turbo', 'Supercharger', 'Boost', 'Nitro', 'Afterburner'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Arm circuit A', short: 'A', blocks: [C('Arm circuit', ['biceps2', 'triceps2', 'biceps2', 'triceps2', 'gripCurl?'], { values: [3, 4, 5] })] },
      b: { label: 'Arm circuit B', short: 'B', blocks: [C('Arm circuit', ['triceps2', 'biceps2', 'gripHold', 'biceps2', 'triceps2?'], { values: [3, 4, 5] })] },
    },
  },
  // ---------------- PHASE 16: HIPS & ADDUCTORS (inner thighs and hip flexors plus the glutes; abs to finish) ----------------
  {
    id: 'hip-day', added: 16, catalogue: 9, name: 'Hip Day', subject: 'Hips & adductors', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Inner thighs / hips & glutes / upper body', blurb: 'Two hip days for every upper-body day: inner thighs, then hips and glutes.',
    about: 'Two days of hips for every day of upper body. The first works the inner thighs: sumo pulses and sumo deadlifts with the kettlebell, side-lying adductions, Cossack squats and Copenhagen planks. The second balances them with glute bridges, clamshells and hip-flexor holds. The third day trains chest, back and shoulders. Abs finish every session; Level II asks for heavier weights and Level III adds reps.',
    names: ['Hinge Point', 'Pivot', 'Ball Joint', 'Socket', 'Saddle Joint', 'Swivel', 'Gimbal', 'Hip Hinge', 'Pelvis', 'Cradle', 'Basin', 'Keel Hips', 'Wishbone', 'Fulcrum', 'Axle', 'Hub', 'Spindle', 'Turntable', 'Rotor', 'Gyre'],
    cycle: ['inner', 'hips', 'upper'],
    dayTypes: {
      inner: { label: 'Inner thighs', short: 'Inner', blocks: [S('Inner thighs', ['adductorLoad', 'adductor', 'adductor', 'hipFlex?'])] },
      hips: { label: 'Hips & glutes', short: 'Hips', blocks: [S('Hips & glutes', ['hipGlute', 'adductor', 'hipFlex', 'hipGlute?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderPress', 'biceps2?'])] },
    },
  },
  {
    id: 'inner-thigh-supersets', added: 16, catalogue: 9, name: 'Inner Thigh Supersets', subject: 'Hips & adductors', minutes: [24, 29], levers: [null, 'reps', 'tempo'],
    split: 'Adductors & glutes / adductors & hip flexors', blurb: 'Inner thighs every day in supersets, with the glutes one day and the hip flexors the next.',
    about: 'The inner thighs every day, in supersets with the muscles around them. One day pairs each adductor move with a glute move, bridges, clamshells and hip thrusts; the other pairs it with hip-flexor work. Strong, supple adductors protect the groin and make every squat and lunge steadier. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Scissor', 'Pincer Legs', 'Squeeze', 'Clasp', 'Hug', 'Vise Grip', 'Nutcracker', 'Clamp Down', 'Zip', 'Lace Up', 'Buckle', 'Clasp Knife', 'Pinch', 'Grip Thigh', 'Hold Tight', 'Close Up', 'Draw In', 'Knit', 'Stitch', 'Seam'],
    cycle: ['glute', 'flex'],
    dayTypes: {
      glute: { label: 'Adductors & glutes', short: 'Glutes', blocks: [SS('Adductors & glutes', ['adductor', 'hipGlute', 'adductor', 'hipGlute', 'adductorLoad', 'hipGlute'])] },
      flex: { label: 'Adductors & hip flexors', short: 'Flexors', blocks: [SS('Adductors & hip flexors', ['adductor', 'hipFlex', 'adductorLoad', 'hipFlex', 'adductor', 'hipFlex'])] },
    },
  },
  {
    id: 'floor-hips', added: 16, catalogue: 9, name: 'Floor Hips', subject: 'Hips & adductors', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Hip circuit A / B / upper body', blurb: 'Hips and inner thighs with no equipment: adduction, frog pumps and Copenhagen planks, then push-ups and floor pulls.',
    about: 'Hips and inner thighs on the floor alone. Two days in three are circuits of side-lying adductions, adductor rock-backs, frog pumps, Cossack squats and Copenhagen planks, with glute bridges and hip-flexor holds around them. The third day is push-ups and floor pulls for the upper body. Abs finish every session; Level II adds reps and Level III makes every hold longer.',
    names: ['Frog', 'Lotus', 'Butterfly Hips', 'Starling', 'Crane Stance', 'Flamingo', 'Swan Legs', 'Duck Walk', 'Toad', 'Newt', 'Salamander', 'Gecko', 'Lizard Legs', 'Turtle', 'Tortoise', 'Crab', 'Spider', 'Mantis', 'Grasshopper', 'Cricket'],
    cycle: ['a', 'b', 'upper'],
    dayTypes: {
      a: { label: 'Hip circuit A', short: 'A', blocks: [C('Hip circuit', ['adductorBw', 'adductorBw', 'hipGlute', 'hipFlex?'], { values: [3, 4, 5] })] },
      b: { label: 'Hip circuit B', short: 'B', blocks: [C('Hip circuit', ['adductorBw', 'hipFlex', 'adductorBw', 'hipGlute?'], { values: [3, 4, 5] })] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [C('Upper body', ['chestBw', 'backBw', 'chestBw', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'hip-emom', added: 16, catalogue: 9, name: 'Hip EMOM', subject: 'Hips & adductors', minutes: [22, 27], levers: [null, 'reps', 'weight'],
    split: 'Hip EMOM A / B', blurb: 'Hips on the minute every day: adductors, glutes and hip flexors in rotation.',
    about: 'Hips every day, on the clock. Each minute starts a set for the inner thighs, the glutes or the hip flexors, and the rest of the minute is recovery. The two days change the order, so each muscle gets its turn to lead. Short sessions that leave the hips strong and loose. Abs finish every session; Level II adds reps and Level III asks for heavier weights.',
    names: ['Hip Clock', 'Pocket Time', 'Hip Beat', 'Tick', 'Tock', 'Click', 'Clack', 'Snap', 'Flick', 'Twitch', 'Blink', 'Wink', 'Nod', 'Shrug Off', 'Twist', 'Sway', 'Swing Low', 'Rock', 'Roll', 'Groove'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Hip EMOM A', short: 'A', blocks: [E('Hip EMOM', ['adductor', 'hipGlute', 'adductor', 'hipFlex'], { values: [12, 14, 16] })] },
      b: { label: 'Hip EMOM B', short: 'B', blocks: [E('Hip EMOM', ['hipFlex', 'adductorLoad', 'hipGlute', 'adductor'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'bell-hips', added: 16, catalogue: 9, name: 'Bell Hips', subject: 'Hips & adductors', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Sumo / swings & side lunges / upper body', blurb: 'Hips with one kettlebell: sumo deadlifts and pulses, swings and side lunges, then an upper-body day.',
    about: 'Hips and inner thighs with one kettlebell. One day is wide-stance work: sumo deadlifts, sumo pulses and lateral lunges, with floor adductor moves between. The next is swings and squats with more adductor work and a hip-flexor hold. The third day presses and rows the bell for the upper body. Abs finish every session; Level II adds reps and Level III asks for a heavier bell.',
    names: ['Sumo', 'Yokozuna', 'Dohyo', 'Shiko', 'Wide Stance', 'Horse Stance', 'Plie', 'Second Position', 'Straddle Bell', 'Bell Stance', 'Low Gear', 'Deep Set', 'Ground Force', 'Root Down', 'Plant', 'Anchor Legs', 'Stance Work', 'Footing', 'Base', 'Platform'],
    cycle: ['sumo', 'swing', 'upper'],
    dayTypes: {
      sumo: { label: 'Sumo', short: 'Sumo', blocks: [S('Sumo', ['sumo_pulse', 'kb_sumo_deadlift', 'adductorBw', 'lateral_lunge?'])] },
      swing: { label: 'Swings & side lunges', short: 'Swings', blocks: [S('Swings & side lunges', ['kb_swing', 'adductorBw', 'kbLower2', 'hipFlex?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['kb_press', 'kb_row', 'kbUpper2', 'kb_floor_press?'])] },
    },
  },
  {
    id: 'hip-ladders', added: 16, catalogue: 9, name: 'Hip Ladders', subject: 'Hips & adductors', minutes: [24, 29], levers: [null, 'reps', 'tempo'],
    split: 'Adductor ladder / glute ladder', blurb: 'A hip ladder every day, a rep at a time, then the hip flexors and inner thighs.',
    about: 'Every day climbs a hip ladder: one rep of an adductor move and a glute move, then two, then three, as far as the time allows. A short block for the hip flexors and inner thighs follows. One day leads with the inner thighs, the other with the glutes. Ladders add up to a lot of reps without ever feeling heavy. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Hip Step', 'Stride', 'Gait', 'Pace', 'March On', 'Step Out', 'Side Step', 'Cross Step', 'Box Step', 'Grapevine', 'Shuffle Step', 'Two Step', 'Quickstep', 'Foxtrot', 'Waltz', 'Tango', 'Samba', 'Rumba', 'Cha-cha', 'Mambo'],
    cycle: ['add', 'glute'],
    dayTypes: {
      add: { label: 'Adductor ladder', short: 'Adductors', blocks: [L('Hip ladder', ['adductorReps', 'gluteReps']), S('Hip flexors', ['hipFlex', 'adductor'])] },
      glute: { label: 'Glute ladder', short: 'Glutes', blocks: [L('Hip ladder', ['gluteReps', 'adductorReps']), S('Hip flexors', ['adductor', 'hipFlex'])] },
    },
  },
  {
    id: 'hips-30', added: 16, catalogue: 9, days: 30, name: 'Hips 30', subject: 'Hips & adductors', minutes: [28, 33], levers: [null, 'weight', 'tempo'],
    split: 'Heavy hips / hip supersets / upper body', blurb: 'A month of hips: heavy sumo work, then adductor and hip-flexor supersets, then the upper body.',
    about: 'A month for strong, open hips. One day is heavy: sumo deadlifts, sumo pulses and Cossack squats with full rests. The next pairs adductor moves with hip-flexor work in supersets, for strength through the whole range. The third day trains the upper body. Abs finish every session; Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Hips One', 'Opening', 'Unlock', 'Release', 'Unwind', 'Loosen', 'Free Up', 'Open Gate', 'Hinge Free', 'Swing Gate', 'Unlatch', 'Unbolt', 'Unhook', 'Unfasten', 'Untie', 'Unclasp', 'Undo', 'Unzip', 'Unbuckle', 'Unbound'],
    cycle: ['heavy', 'pair', 'upper'],
    dayTypes: {
      heavy: { label: 'Heavy hips', short: 'Heavy', blocks: [S('Heavy hips', ['kb_sumo_deadlift', 'sumo_pulse', 'cossack_squat', 'adductor?'])] },
      pair: { label: 'Hip supersets', short: 'Pairs', blocks: [SS('Hip supersets', ['adductor', 'hipFlex', 'adductor', 'hipFlex'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderPress', 'triceps2?'])] },
    },
  },
  {
    id: 'hip-circuit-30', added: 16, catalogue: 9, days: 30, name: 'Hip Circuit 30', subject: 'Hips & adductors', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'Hip circuit A / B', blurb: 'Thirty days of hip circuits: inner thighs, glutes and hip flexors, round after round.',
    about: 'Thirty days of hips, every day a circuit. An adductor move, a glute move and a hip-flexor move run back to back, then a short rest and another round. The two days change the order and bring the kettlebell in on day two. Moderate effort, a lot of reps, hips that feel strong and free. Abs finish every session; Level II adds reps and Level III asks for heavier weights.',
    names: ['Hip Loop', 'Ring Hips', 'Hoop', 'Hula', 'Halo Hips', 'Orbit Hips', 'Circle Back', 'Round Hips', 'Revolve', 'Spin', 'Whirl', 'Twirl', 'Pirouette', 'Spiral Hips', 'Swirl', 'Eddy', 'Vortex', 'Whirlpool', 'Maelstrom', 'Cyclone'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Hip circuit A', short: 'A', blocks: [C('Hip circuit', ['adductor', 'hipGlute', 'hipFlex', 'adductor', 'hipGlute?'], { values: [3, 4, 5] })] },
      b: { label: 'Hip circuit B', short: 'B', blocks: [C('Hip circuit', ['hipFlex', 'adductor', 'hipGlute', 'adductorLoad', 'hipFlex?'], { values: [3, 4, 5] })] },
    },
  },
  // ---------------- PHASE 16: CALVES & LOWER LEGS (calves and shins plus the feet and ankles; abs to finish) ----------------
  {
    id: 'calf-day', added: 16, catalogue: 9, name: 'Calf Day', subject: 'Calves & lower legs', minutes: [22, 27], levers: [null, 'reps', 'weight'],
    split: 'Calves / springs / upper body', blurb: 'Two lower-leg days for every upper-body day: calf raises and shins, then springy hops.',
    about: 'Two days of lower legs for every day of upper body. The first is calf raises, straight-legged and bent-knee, with tibialis raises and heel walks for the shins. The second makes the calves springy with pogo hops, skips and single-leg hops between raises. The third day trains chest, back and shoulders. Abs finish every session; Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Achilles', 'Heel Lift', 'Tiptoe', 'Ballerina', 'En Pointe', 'Relevé', 'Ankle Deep', 'Spring Heel', 'Stiletto', 'High Heels', 'Platform Shoe', 'Wedge Heel', 'Clog', 'Sandal', 'Sneaker', 'Spike', 'Cleat', 'Stud', 'Arch', 'Instep'],
    cycle: ['calves', 'spring', 'upper'],
    dayTypes: {
      calves: { label: 'Calves & shins', short: 'Calves', blocks: [S('Calves & shins', ['calf', 'calf', 'shin', 'calf?'])] },
      spring: { label: 'Springs', short: 'Springs', blocks: [S('Springs', ['calfPlyo', 'calf', 'shin', 'calfPlyo?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderPress', 'biceps2?'])] },
    },
  },
  {
    id: 'calves-and-shins', added: 16, catalogue: 9, name: 'Calves & Shins', subject: 'Calves & lower legs', minutes: [22, 27], levers: [null, 'reps', 'tempo'],
    split: 'Calves & shins / calves & springs', blurb: 'Lower legs every day in supersets: calves with shins one day, calves with hops the next.',
    about: 'Lower legs every day, in supersets. One day pairs each calf raise with a shin move, tibialis raises and heel walks, so the front and back of the lower leg stay balanced. The other day pairs raises with springy hops for elastic, quick calves. Strong lower legs protect the ankles and the Achilles. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Shin Splint', 'Front Line', 'Tibia', 'Fibula', 'Ankle Bone', 'Shin Guard', 'Gaiter', 'Spat', 'Puttee', 'Legging', 'Knee Sock', 'Shin Pad', 'Greave', 'Leg Armour', 'Boot Top', 'Wellington', 'Riding Boot', 'Hiking Boot', 'Combat Boot', 'Moon Boot'],
    cycle: ['shin', 'spring'],
    dayTypes: {
      shin: { label: 'Calves & shins', short: 'Shins', blocks: [SS('Calves & shins', ['calf', 'shin', 'calf', 'shin', 'calf', 'shin'])] },
      spring: { label: 'Calves & springs', short: 'Springs', blocks: [SS('Calves & springs', ['calf', 'calfPlyo', 'calf', 'shin', 'calfPlyo', 'calf'])] },
    },
  },
  {
    id: 'barefoot-legs', added: 16, catalogue: 9, name: 'Barefoot Legs', subject: 'Calves & lower legs', minutes: [21, 26], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Calf circuit A / B / upper body', blurb: 'Lower legs with no equipment: calf raises, holds, hops and shin work in circuits, then push-ups and floor pulls.',
    about: 'Lower-leg strength barefoot on the floor. Two days in three are circuits: calf raises on both legs and one, bent-knee raises, long holds on your toes, tibialis raises and heel walks, with pogo hops on day two. The third day is push-ups and floor pulls. Good for runners and anyone with weak ankles. Abs finish every session; Level II adds reps and Level III makes every hold longer.',
    names: ['Barefoot', 'Sand Walk', 'Beach Run', 'Dune', 'Pebble', 'Grass', 'Moss', 'Dew', 'Meadow Run', 'Riverbed', 'Stepping Stone', 'Boardwalk', 'Pier', 'Jetty', 'Tide Line', 'Shoreline', 'Rock Pool', 'Seaweed', 'Driftwood', 'Footprint'],
    cycle: ['a', 'b', 'upper'],
    dayTypes: {
      a: { label: 'Calf circuit A', short: 'A', blocks: [C('Calf circuit', ['calfBw', 'calfBw', 'shin', 'calfBw?'], { values: [3, 4, 5] })] },
      b: { label: 'Calf circuit B', short: 'B', blocks: [C('Calf circuit', ['calfPlyo', 'calfBw', 'shin', 'calfPlyo?'], { values: [3, 4, 5] })] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [C('Upper body', ['chestBw', 'backBw', 'chestBw', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'calf-emom', added: 16, catalogue: 9, name: 'Calf EMOM', subject: 'Calves & lower legs', minutes: [20, 25], levers: [null, 'reps', 'weight'],
    split: 'Calf EMOM A / B', blurb: 'Lower legs on the minute every day: calf raises, shin work and hops in rotation.',
    about: 'Lower legs every day, on the clock. Each minute starts a set of calf raises, shin work or hops, and the rest of the minute is recovery. The two days lead with different moves so the calves, shins and ankles all get fresh effort. Short and sharp, easy to fit in. Abs finish every session; Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Leg Clock', 'Footstep', 'Footfall', 'Patter', 'Pitter', 'Tap Dance', 'Clog Dance', 'Jig', 'Reel', 'Hornpipe', 'Polka', 'Hop Scotch', 'Skip Rope', 'Double Dutch', 'Bunny Hop', 'Kangaroo', 'Wallaby', 'Hare', 'Gazelle', 'Springbok'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Calf EMOM A', short: 'A', blocks: [E('Calf EMOM', ['calf', 'shin', 'calfPlyo', 'calf'], { values: [10, 12, 14] })] },
      b: { label: 'Calf EMOM B', short: 'B', blocks: [E('Calf EMOM', ['calfPlyo', 'calf', 'shin', 'calf'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'calf-builder', added: 16, catalogue: 9, name: 'Calf Builder', subject: 'Calves & lower legs', minutes: [20, 25], levers: [null, 'weight', 'reps'],
    split: 'Heavy raises / calf tabatas / upper body', blurb: 'Two lower-leg days for every upper-body day: heavy dumbbell raises, then calf Tabatas.',
    about: 'Two days of lower legs for every day of upper body. The first is heavy: dumbbell calf raises and other raises with full rests, then a shin move. The second is Tabatas, twenty seconds of raises, hops or shin work and ten seconds of rest, eight times over. The third day trains chest, back and shoulders. Abs finish every session; Level II asks for heavier dumbbells and Level III adds reps.',
    names: ['Calf Iron', 'Heavy Heels', 'Loaded Toes', 'Ankle Weight', 'Lead Boots', 'Iron Soles', 'Diving Boots', 'Ballast Feet', 'Anchor Heels', 'Steel Toe', 'Hob Nail', 'Work Boot', 'Toe Cap', 'Heel Plate', 'Horseshoe Heel', 'Clydesdale', 'Shire Horse', 'Draught Horse', 'Plough', 'Furrow'],
    cycle: ['heavy', 'tabata', 'upper'],
    dayTypes: {
      heavy: { label: 'Heavy raises', short: 'Heavy', blocks: [S('Heavy raises', ['db_calf_raise', 'calfReps', 'shin', 'calf?'])] },
      tabata: { label: 'Calf tabatas', short: 'Tabata', blocks: [T('Calf tabatas', ['calfBw', 'calfPlyo', 'calfBw', 'shin'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderPress', 'biceps2?'])] },
    },
  },
  {
    id: 'calf-ladders', added: 16, catalogue: 9, name: 'Calf Ladders', subject: 'Calves & lower legs', minutes: [24, 28], levers: [null, 'reps', 'tempo'],
    split: 'Raise ladder / hop ladder', blurb: 'A lower-leg ladder every day, raises and hops a rep at a time, then the shins.',
    about: 'Every day climbs a lower-leg ladder: one calf raise and one hop, then two, then three, for as long as the time allows. A short block for the shins and calves follows. One day leads with the raises, the other with the hops. Ladders give the calves a lot of quality reps without the burn taking over. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Rung Toes', 'Toe Ladder', 'Heel Ladder', 'Calf Steps', 'Stair Calves', 'Step Raise', 'Riser', 'Tread', 'Nosing', 'Stringer', 'Baluster', 'Newel', 'Winder', 'Flight Up', 'Half Landing', 'Quarter Turn', 'Spiral Up', 'Ladder Toes', 'Top Tread', 'Last Step'],
    cycle: ['raise', 'hop'],
    dayTypes: {
      raise: { label: 'Raise ladder', short: 'Raises', blocks: [L('Lower-leg ladder', ['calfReps', 'plyoReps']), S('Shins', ['shin', 'calf'])] },
      hop: { label: 'Hop ladder', short: 'Hops', blocks: [L('Lower-leg ladder', ['plyoReps', 'calfReps']), S('Shins', ['calf', 'shin'])] },
    },
  },
  {
    id: 'calves-30', added: 16, catalogue: 9, days: 30, name: 'Calves 30', subject: 'Calves & lower legs', minutes: [24, 29], levers: [null, 'weight', 'tempo'],
    split: 'Heavy calves / spring supersets / rest of you', blurb: 'A month of lower legs: heavy calf raises, then hop and shin supersets, then a day for the rest of you.',
    about: 'A month for stronger calves and steadier ankles. One day is heavy: dumbbell calf raises, bent-knee raises and single-leg raises with full rests. The next pairs springy hops with shin work in supersets. The third day trains squats, pulls and presses. Abs finish every session; Level II asks for heavier dumbbells and Level III slows every rep down.',
    names: ['Calf One', 'Heel Down', 'Toes Up', 'Rise', 'Lift Off', 'Take Off', 'Spring Up', 'Bounce', 'Rebound', 'Recoil', 'Elastic', 'Rubber Band', 'Bungee', 'Trampoline', 'Pogo', 'Coil Spring', 'Leaf Spring', 'Shock Absorber', 'Suspension Legs', 'Landing Gear'],
    cycle: ['heavy', 'spring', 'other'],
    dayTypes: {
      heavy: { label: 'Heavy calves', short: 'Heavy', blocks: [S('Heavy calves', ['db_calf_raise', 'bent_knee_calf_raise', 'single_leg_calf_raise', 'shin?'])] },
      spring: { label: 'Spring supersets', short: 'Springs', blocks: [SS('Spring supersets', ['calfPlyo', 'shin', 'calfPlyo', 'shin'])] },
      other: { label: 'Rest of you', short: 'Rest', blocks: [S('Rest of you', ['squat2', 'backRow', 'chestPress', 'hinge2?'])] },
    },
  },
  {
    id: 'calf-circuit-30', added: 16, catalogue: 9, days: 30, name: 'Calf Circuit 30', subject: 'Calves & lower legs', minutes: [20, 25], levers: [null, 'reps', 'weight'],
    split: 'Calf circuit A / B', blurb: 'Thirty days of lower-leg circuits: raises, shin work and hops, round after round.',
    about: 'Thirty days of lower legs, every day a circuit. Calf raises, a shin move and hops run back to back, a short rest, then another round. The two days change the order so each move gets to go first. Lower legs that are strong, springy and hard to injure. Abs finish every session; Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Calf Loop', 'Ankle Ring', 'Foot Circle', 'Heel Orbit', 'Toe Lap', 'Round Step', 'Spin Step', 'Circle Hop', 'Ring Hop', 'Loop Skip', 'Wheel Step', 'Lap Hop', 'Turn Step', 'Track Lap', 'Oval', 'Velodrome', 'Ring Track', 'Racecourse', 'Circuit Track', 'Home Lap'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Calf circuit A', short: 'A', blocks: [C('Calf circuit', ['calf', 'shin', 'calfPlyo', 'calf', 'shin?'], { values: [3, 4, 5] })] },
      b: { label: 'Calf circuit B', short: 'B', blocks: [C('Calf circuit', ['calfPlyo', 'calf', 'shin', 'calf', 'calfPlyo?'], { values: [3, 4, 5] })] },
    },
  },
  // ---------------- PHASE 16: NECK & TRAPS (gentle neck holds and the traps plus the upper back; abs to finish) ----------------
  {
    id: 'neck-day', added: 16, catalogue: 9, name: 'Neck Day', subject: 'Neck & traps', minutes: [24, 29], levers: [null, 'holds', 'weight'],
    split: 'Neck & traps / traps & upper back / lower & push', blurb: 'Two neck-and-traps days for every other day: gentle neck holds and shrugs, then the upper back.',
    about: 'Two days of neck and traps for every day of everything else. The first is gentle neck holds, front, back and side, at half effort, with shrugs and upright rows between. The second is the traps and upper back: shrugs, carries, Y raises and reverse snow angels. The third day trains legs and pushing. Neck work is always gentle and never forced. Abs finish every session; Level II makes the holds longer and Level III asks for heavier weights.',
    names: ['Bull Neck', 'Collar Line', 'Scruff', 'Nape', 'Crown', 'Atlas Bone', 'Axis', 'Vertebra', 'Column', 'Pillar', 'Post', 'Stanchion', 'Upright', 'Mast', 'Totem', 'Lamp Post', 'Flagstaff', 'Plinth', 'Pedestal', 'Statue'],
    cycle: ['neck', 'traps', 'rest'],
    dayTypes: {
      neck: { label: 'Neck & traps', short: 'Neck', blocks: [S('Neck & traps', ['neck', 'neck', 'traps2', 'neck?'])] },
      traps: { label: 'Traps & upper back', short: 'Traps', blocks: [S('Traps & upper back', ['traps2', 'traps2', 'trapsBw', 'traps2?'])] },
      rest: { label: 'Lower & push', short: 'Lower', blocks: [S('Lower & push', ['squat2', 'chestPress', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'neck-and-traps', added: 16, catalogue: 9, name: 'Neck & Traps', subject: 'Neck & traps', minutes: [22, 27], levers: [null, 'holds', 'tempo'],
    split: 'Neck & loaded traps / neck & upper back', blurb: 'Neck and traps every day in supersets: a gentle neck hold paired with shrugs or upper-back work.',
    about: 'Neck and traps every day, in supersets. Each pair starts with a gentle neck hold or a prone neck lift, then a trap move: shrugs and carries one day, Y raises and reverse snow angels the other. The neck work stays at half effort, building a neck that sits well and handles a long day at a desk. Abs finish every session; Level II makes the holds longer and Level III slows every rep down.',
    names: ['Steady Head', 'Level Gaze', 'Chin Up', 'Head High', 'Eyes Front', 'Poise', 'Bearing', 'Carriage', 'Posture', 'Stance', 'Stature', 'Composure', 'Balance Point', 'Plumb', 'True North', 'Keel Even', 'Upright Head', 'Lifted', 'Aligned', 'Centred'],
    cycle: ['load', 'back'],
    dayTypes: {
      load: { label: 'Neck & loaded traps', short: 'Shrugs', blocks: [SS('Neck & traps', ['neck', 'traps2', 'neck', 'traps2', 'neck', 'trapsBw'])] },
      back: { label: 'Neck & upper back', short: 'Upper back', blocks: [SS('Neck & upper back', ['neck', 'trapsBw', 'neck', 'traps2', 'trapsBw', 'traps2'])] },
    },
  },
  {
    id: 'desk-neck', added: 16, catalogue: 9, name: 'Desk Neck', subject: 'Neck & traps', minutes: [20, 25], equip: 'bw', levers: [null, 'holds', 'reps'],
    split: 'Neck circuit A / B / legs & push', blurb: 'Neck and upper back with no equipment, for long days at a desk: gentle holds, chin tucks and floor pulls.',
    about: 'Made for long days at a desk, with no equipment. Two days in three are circuits of gentle neck holds, chin tucks and prone neck lifts, with Y raises, Y-T-Ws and reverse snow angels for the upper back and traps. The third day is legs and push-ups. Everything is done at a calm, steady effort. Abs finish every session; Level II makes the holds longer and Level III adds reps.',
    names: ['Desk Break', 'Screen Time', 'Inbox Zero', 'Coffee Break', 'Lunch Hour', 'Commute Home', 'Out of Office', 'Stand Up', 'Look Up', 'Shoulders Down', 'Unhunch', 'Uncurl', 'Unslump', 'Tall Spine', 'Monitor Height', 'Chair Back', 'Keyboard Rest', 'Mouse Hand', 'Log Off', 'Weekend'],
    cycle: ['a', 'b', 'legs'],
    dayTypes: {
      a: { label: 'Neck circuit A', short: 'A', blocks: [C('Neck circuit', ['neck', 'trapsBw', 'neck', 'trapsBw?'], { values: [3, 4, 5] })] },
      b: { label: 'Neck circuit B', short: 'B', blocks: [C('Neck circuit', ['neck', 'neck', 'trapsBw', 'trapsBw?'], { values: [3, 4, 5] })] },
      legs: { label: 'Legs & push', short: 'Legs', blocks: [C('Legs & push', ['legsBw2', 'chestBw', 'legsBw2', 'backBw?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'neck-emom', added: 16, catalogue: 9, name: 'Neck EMOM', subject: 'Neck & traps', minutes: [20, 25], levers: [null, 'holds', 'weight'],
    split: 'Neck EMOM A / B', blurb: 'Neck and traps on the minute every day: gentle holds, shrugs and upper-back work in rotation.',
    about: 'Neck and traps every day, on the clock. Each minute starts a gentle neck hold, a set of shrugs or a set of upper-back work, and the rest of the minute is easy recovery. The neck work stays at half effort; the shrugs can be heavy. The two days change the order. Abs finish every session; Level II makes the holds longer and Level III asks for heavier weights.',
    names: ['Neck Clock', 'Steady Minute', 'Calm Minute', 'Even Keel', 'Slow Tick', 'Easy Beat', 'Soft Pulse', 'Gentle Hour', 'Hush', 'Still', 'Quiet Clock', 'Sandglass', 'Dripstone', 'Slow Drip', 'Patience', 'Easy Does It', 'Steady On', 'Hold Fast', 'Stay Put', 'Rest Easy'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Neck EMOM A', short: 'A', blocks: [E('Neck EMOM', ['neck', 'traps2', 'neck', 'trapsBw'], { values: [10, 12, 14] })] },
      b: { label: 'Neck EMOM B', short: 'B', blocks: [E('Neck EMOM', ['traps2', 'neck', 'trapsBw', 'neck'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'shrug-and-hold', added: 16, catalogue: 9, name: 'Shrug & Hold', subject: 'Neck & traps', minutes: [22, 27], levers: [null, 'weight', 'holds'],
    split: 'Shrugs & holds / upper-back circuit / legs & push', blurb: 'Two neck-and-traps days for every other day: heavy shrugs with gentle neck holds, then an upper-back circuit.',
    about: 'Two days of neck and traps for every day of everything else. The first alternates heavy shrugs and shrug holds with gentle neck holds, so the traps work hard while the neck works softly. The second is a calm circuit of upper-back floor work and neck holds. The third day trains legs and pushing. Abs finish every session; Level II asks for heavier dumbbells and Level III makes every hold longer.',
    names: ['Shrug', 'Hold Still', 'Steady Hold', 'Iron Collar', 'Shoulder Hold', 'Yoke Hold', 'Bear Hug', 'Strong Hold', 'Firm Grip', 'Stronghold', 'Hold the Line', 'Holdfast', 'Fortress', 'Garrison', 'Redoubt', 'Bulwark Hold', 'Battlement Hold', 'Ward', 'Bastion Hold', 'Sentinel'],
    cycle: ['shrug', 'circuit', 'rest'],
    dayTypes: {
      shrug: { label: 'Shrugs & holds', short: 'Shrugs', blocks: [S('Shrugs & holds', ['db_shrug', 'neck', 'shrug_hold', 'neck', 'upright_row?'])] },
      circuit: { label: 'Upper-back circuit', short: 'Circuit', blocks: [C('Upper-back circuit', ['trapsBw', 'neck', 'trapsBw', 'neck?'], { values: [3, 4, 5] })] },
      rest: { label: 'Legs & push', short: 'Legs', blocks: [S('Legs & push', ['squat2', 'chestPress', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'traps-ladders', added: 16, catalogue: 9, name: 'Trap Ladders', subject: 'Neck & traps', minutes: [22, 27], levers: [null, 'reps', 'tempo'],
    split: 'Shrug ladder / neck ladder', blurb: 'A traps-and-neck ladder every day, shrugs and neck lifts a rep at a time, then holds.',
    about: 'Every day climbs a ladder: a shrug and a neck lift, then two of each, then three, as far as the time allows. The trap move is a shrug, an upright row or a high pull; the neck move a prone neck lift or a chin tuck. A short block of gentle neck holds and upper-back work follows. One day leads with the traps, the other with the neck. The neck reps stay slow and small. Abs finish every session; Level II adds reps and Level III slows every rep down.',
    names: ['Trap Step', 'Shrug Step', 'Neck Step', 'Rung Neck', 'Ladder Neck', 'Climb Neck', 'Rising Neck', 'Up Step', 'High Step', 'Lift Step', 'Top Neck', 'Peak Neck', 'Summit Neck', 'Ridge Neck', 'Crest Neck', 'Tall Step', 'Steady Step', 'Even Step', 'Calm Step', 'Last Rung'],
    cycle: ['traps', 'neck'],
    dayTypes: {
      traps: { label: 'Shrug ladder', short: 'Traps', blocks: [L('Traps ladder', ['trapReps', 'neckReps']), S('Holds', ['neck', 'trapsBw'])] },
      neck: { label: 'Neck ladder', short: 'Neck', blocks: [L('Neck ladder', ['neckReps', 'trapReps']), S('Holds', ['trapsBw', 'neck'])] },
    },
  },
  {
    id: 'traps-30', added: 16, catalogue: 9, days: 30, name: 'Traps 30', subject: 'Neck & traps', minutes: [24, 29], levers: [null, 'weight', 'tempo'],
    split: 'Heavy traps / neck supersets / rest of you', blurb: 'A month of traps: heavy shrugs and carries, then gentle neck and upper-back supersets, then the rest of you.',
    about: 'A month for strong traps and a steady neck. One day is heavy: dumbbell shrugs, farmer carries and upright rows, with a neck hold to finish. The next pairs gentle neck holds with upper-back floor work in supersets. The third day trains legs and pushing. Abs finish every session; Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Traps One', 'Shoulder Shelf', 'Ledge Traps', 'Coat Rack', 'Hanger', 'Yoke Up', 'Carry On', 'Load Up', 'Lift Off Traps', 'Shrug It', 'High Shoulders', 'Strong Collar', 'Trap Door', 'Trap Line', 'Ridge Traps', 'Trap Peak', 'Trap Summit', 'Trap Crown', 'Mountain Traps', 'Everest'],
    cycle: ['heavy', 'pair', 'other'],
    dayTypes: {
      heavy: { label: 'Heavy traps', short: 'Heavy', blocks: [S('Heavy traps', ['db_shrug', 'farmer_carry', 'upright_row', 'neck?'])] },
      pair: { label: 'Neck supersets', short: 'Neck', blocks: [SS('Neck supersets', ['neck', 'trapsBw', 'neck', 'trapsBw'])] },
      other: { label: 'Rest of you', short: 'Rest', blocks: [S('Rest of you', ['squat2', 'chestPress', 'hinge2', 'backRow?'])] },
    },
  },
  {
    id: 'neck-circuit-30', added: 16, catalogue: 9, days: 30, name: 'Neck Circuit 30', subject: 'Neck & traps', minutes: [20, 25], levers: [null, 'holds', 'weight'],
    split: 'Neck circuit A / B', blurb: 'Thirty days of neck-and-traps circuits: gentle holds, shrugs and upper-back work, round after round.',
    about: 'Thirty days of neck and traps, every day a circuit. A gentle neck hold, a trap move and an upper-back move run back to back, then a short rest and another round. The two days change the order. The neck work stays calm and controlled; the shrugs and carries can be heavy. Abs finish every session; Level II makes the holds longer and Level III asks for heavier weights.',
    names: ['Neck Loop', 'Collar Ring', 'Torc', 'Choker', 'Necklace', 'Pendant', 'Locket', 'Chain', 'Ring Neck', 'Ruff', 'Cravat', 'Scarf', 'Stole', 'Boa', 'Wrap', 'Snood', 'Hood', 'Cowl', 'Turtleneck', 'Polo Neck'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Neck circuit A', short: 'A', blocks: [C('Neck circuit', ['neck', 'traps2', 'trapsBw', 'neck', 'traps2?'], { values: [3, 4, 5] })] },
      b: { label: 'Neck circuit B', short: 'B', blocks: [C('Neck circuit', ['traps2', 'neck', 'trapsBw', 'neck', 'trapsBw?'], { values: [3, 4, 5] })] },
    },
  },
  // ---------------- PHASE 16 ticket 8: STRENGTH FAMILY +50% (catalogue 9: the new muscle pools join the older subjects) ----------------
  // Strength +7
  {
    id: 'upper-lower-four', added: 16, catalogue: 9, name: 'Upper Lower Four', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'reps'],
    split: 'Upper A / lower A / upper B / lower B', blurb: 'Four different days in a row: two upper, two lower, every muscle twice in four days.',
    about: 'Four different days: two for the upper body, two for the lower. Every muscle trains twice in a cycle, with a different emphasis each time. Upper A leans on presses, upper B on pulls; lower A on squats, lower B on hinges. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['North', 'East', 'South', 'West', 'Compass', 'Bearing', 'Heading', 'Latitude', 'Longitude', 'Meridian Line', 'Equator', 'Tropic'],
    cycle: ['ua', 'la', 'ub', 'lb'],
    dayTypes: {
      ua: { label: 'Upper A · press', short: 'Upper A', blocks: [S('Upper A', ['chestPress', 'shoulderPress', 'backRow', 'triceps2', 'biceps2?'])] },
      la: { label: 'Lower A · squat', short: 'Lower A', blocks: [S('Lower A', ['squat2', 'lunge2', 'hinge2', 'calf', 'adductor?'])] },
      ub: { label: 'Upper B · pull', short: 'Upper B', blocks: [S('Upper B', ['backBar', 'backRow', 'chestPress', 'biceps2', 'backRear?'])] },
      lb: { label: 'Lower B · hinge', short: 'Lower B', blocks: [S('Lower B', ['hinge2', 'thrust', 'squat2', 'hipGlute', 'calf?'])] },
    },
  },
  {
    id: 'big-five', added: 16, catalogue: 9, name: 'Big Five', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'tempo'],
    split: 'Squat, press, hinge, row, carry', blurb: 'Five big patterns every session: a squat, a press, a hinge, a row and a carry, heavy and simple.',
    about: 'The five patterns that cover a strong body, all in every session: squat, press, hinge, row and carry. Straight sets, full rests, the same shape each day with different exercises, so you can see your strength climb. Abs finish every session. Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Five Alive', 'High Five', 'Famous Five', 'Pentagon', 'Five Star', 'Quintet', 'Five Pillars', 'Fist', 'Five Rings', 'Fifth Gear', 'Five Points', 'Take Five'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Big five A', short: 'A', blocks: [S('Big five', ['squat2', 'chestPress', 'hinge2', 'backRow', 'farmer_carry'])] },
      b: { label: 'Big five B', short: 'B', blocks: [S('Big five', ['lunge2', 'shoulderPress', 'thrust', 'backBar', 'suitcase_march'])] },
    },
  },
  {
    id: 'push-pull-legs-plus', added: 16, catalogue: 9, name: 'PPL Plus', subject: 'Strength', minutes: [38, 42], levers: [null, 'reps', 'weight'],
    split: 'Push / pull / legs / arms & shoulders', blurb: 'Push, pull and legs, plus a fourth day for arms and shoulders, in supersets.',
    about: 'The classic push, pull and legs split with a fourth day for arms and shoulders, all in supersets so the sessions stay dense. Push pairs chest with triceps, pull pairs back with biceps, legs pairs squats with hinges, and the fourth day pairs raises with curls and extensions. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Push It', 'Pull Through', 'Leg It', 'Arms Race', 'Four Square', 'Quad Day', 'Quartet', 'Four Seasons', 'Fourth Wall', 'Four Corners', 'Clover', 'Quadrant'],
    cycle: ['push', 'pull', 'legs', 'arms'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [SS('Push', ['chestPress', 'triceps2', 'shoulderPress', 'triceps2', 'chestBw', 'chestIso'])] },
      pull: { label: 'Pull', short: 'Pull', blocks: [SS('Pull', ['backBar', 'biceps2', 'backRow', 'biceps2', 'backRear', 'trapsPool'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [SS('Legs', ['squat2', 'hinge2', 'lunge2', 'thrust', 'calf', 'adductor'])] },
      arms: { label: 'Arms & shoulders', short: 'Arms', blocks: [SS('Arms & shoulders', ['shoulderRaise', 'biceps2', 'shoulderHealth', 'triceps2', 'biceps2', 'triceps2'])] },
    },
  },
  {
    id: 'strength-and-size', added: 16, catalogue: 9, name: 'Strength & Size', subject: 'Strength', minutes: [38, 42], levers: [null, 'weight', 'reps'],
    split: 'Heavy day / volume day', blurb: 'One heavy day for strength, one volume day for size: the same muscles, two ways.',
    about: 'Strength and size from the same muscles, trained two ways. The heavy day is few reps of big lifts with long rests; the volume day is supersets with more reps and shorter rests for the pump. Alternating them keeps both qualities climbing. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Heavy Metal', 'Volume Up', 'Loud', 'Quiet', 'Max', 'Pump', 'Grind', 'Flow', 'Iron', 'Silk', 'Anvil', 'Feather'],
    cycle: ['heavy', 'volume'],
    dayTypes: {
      heavy: { label: 'Heavy day', short: 'Heavy', blocks: [S('Heavy lifts', ['squat2', 'chestPress', 'hinge2', 'backRow'], { values: [4, 5] })] },
      volume: { label: 'Volume day', short: 'Volume', blocks: [SS('Volume supersets', ['lunge2', 'backBar', 'shoulderPress', 'thrust', 'biceps2', 'triceps2'])] },
    },
  },
  {
    id: 'dumbbell-only-strength', added: 16, catalogue: 9, name: 'Dumbbell Strength', subject: 'Strength', minutes: [38, 42], levers: [null, 'tempo', 'weight'],
    split: 'Dumbbell full body A / B / C', blurb: 'Full-body strength with only your dumbbells: no bar, no bell, three different days.',
    about: 'Everything with a pair of dumbbells. Three full-body days rotate: one leads with squats and presses, one with hinges and rows, one with lunges and overhead work. The kettlebell and the bar stay in the cupboard, which suits a small space or a trip. Abs finish every session. Level II slows every rep down and Level III asks for heavier dumbbells.',
    names: ['Pair', 'Twins', 'Matched', 'Brace', 'Couple', 'Duo', 'Doubles', 'Book Ends', 'Salt & Pepper', 'Left & Right', 'Yin & Yang', 'Mirror Pair'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Squat & press', short: 'A', blocks: [S('Full body A', ['db_squat', 'db_floor_press', 'db_row', 'lateral_raise', 'db_curl?'])] },
      b: { label: 'Hinge & row', short: 'B', blocks: [S('Full body B', ['db_rdl', 'gorilla_row', 'squeeze_press', 'reverse_fly', 'hammer_curl?'])] },
      c: { label: 'Lunge & overhead', short: 'C', blocks: [S('Full body C', ['db_lunge', 'db_shoulder_press', 'one_arm_row', 'close_grip_press', 'db_calf_raise?'])] },
    },
  },
  {
    id: 'antagonist-supersets', added: 16, catalogue: 9, name: 'Antagonist Supersets', subject: 'Strength', minutes: [38, 42], levers: [null, 'reps', 'tempo'],
    split: 'Chest-back / legs / shoulders-arms', blurb: 'Opposite muscles paired: chest with back, quads with hamstrings, biceps with triceps.',
    about: 'Every superset pairs opposite muscles: a press with a row, a squat with a hinge, a curl with an extension. While one works the other rests, so you get more done in the same time and the body stays balanced front to back. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Opposites', 'Front & Back', 'Push Me Pull Me', 'Balance Sheet', 'Counterpoint', 'Mirror Image', 'Antagonist', 'Rivals', 'Sparring', 'Duel', 'Tug', 'Seesaw Strength'],
    cycle: ['cb', 'legs', 'sa'],
    dayTypes: {
      cb: { label: 'Chest & back', short: 'Chest-back', blocks: [SS('Chest & back', ['chestPress', 'backRow', 'chestBw', 'backBar', 'chestIso', 'backRear'])] },
      legs: { label: 'Quads & hamstrings', short: 'Legs', blocks: [SS('Quads & hamstrings', ['squat2', 'hinge2', 'lunge2', 'thrust', 'calf', 'shin'])] },
      sa: { label: 'Shoulders & arms', short: 'Arms', blocks: [SS('Shoulders & arms', ['shoulderPress', 'backRear', 'biceps2', 'triceps2', 'biceps2', 'triceps2'])] },
    },
  },
  {
    id: 'strength-30-plus', added: 16, catalogue: 9, days: 30, name: 'Strength 30 Plus', subject: 'Strength', minutes: [33, 37], levers: [null, 'weight', 'tempo'],
    split: 'Push & legs / pull & hinge, 30 days', blurb: 'A month of strength in two days: push with legs, pull with hinges, heavier every ten days.',
    about: 'A month of strength in two alternating days. One pairs pushing with squats and lunges, the other pulling with hinges and glutes. Straight sets with full rests, and every ten days the level steps up: heavier weights at Level II, slower reps at Level III. Abs finish every session.',
    names: ['Thirty', 'Month One', 'Tally', 'Mark', 'Notch', 'Step', 'Rung', 'Grade', 'Tier', 'Level Up', 'Stage', 'Milestone'],
    cycle: ['push', 'pull'],
    dayTypes: {
      push: { label: 'Push & legs', short: 'Push', blocks: [S('Push & legs', ['squat2', 'chestPress', 'lunge2', 'shoulderPress', 'triceps2?'])] },
      pull: { label: 'Pull & hinge', short: 'Pull', blocks: [S('Pull & hinge', ['hinge2', 'backBar', 'thrust', 'backRow', 'biceps2?'])] },
    },
  },
  // Pull-ups +6
  {
    id: 'pullup-plus', added: 16, catalogue: 9, name: 'Pull-up Plus', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'weight'],
    split: 'Pull-ups & chest / pull-ups & legs', blurb: 'Pull-ups at the start of every day, then chest one day and legs the next.',
    about: 'Pull-ups come first every day while you are fresh: strict, chin-ups, wide or negatives in straight sets. Then one day trains the chest and the other the legs, so the rest of the body keeps pace. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['First Things First', 'Bar First', 'Lead Off', 'Opener', 'Kickoff Pull', 'Up Top', 'Head Start', 'Fresh Start', 'Early Bird', 'Morning Bar', 'Dawn Pull', 'Sunrise Bar'],
    cycle: ['chest', 'legs'],
    dayTypes: {
      chest: { label: 'Pull-ups & chest', short: 'Chest', blocks: [S('Pull-ups', ['backBar', 'backBar']), S('Chest', ['chestPress', 'chestBw', 'triceps2?'])] },
      legs: { label: 'Pull-ups & legs', short: 'Legs', blocks: [S('Pull-ups', ['backBar', 'pullBar2']), S('Legs', ['squat2', 'hinge2', 'lunge2?'])] },
    },
  },
  {
    id: 'pullup-emom-ladder', added: 16, catalogue: 9, name: 'Bar EMOM Ladder', subject: 'Pull-ups', minutes: [30, 35], levers: [null, 'reps', 'tempo'],
    split: 'Pull ladder / pull EMOM', blurb: 'More pull-ups without failing: a ladder one day, an EMOM the next, then a strength block.',
    about: 'Two ways to pile up pull-ups without ever failing a rep. One day climbs a ladder of pull-ups and push-ups; the other is a pull-up EMOM with a row. A short strength block for the legs or the rear shoulders follows each. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Rung Pull', 'Minute Pull', 'Step Pull', 'Tick Pull', 'Ladder Bar', 'Clock Bar', 'Climb Bar', 'Beat Bar', 'Up and Up', 'On Time', 'One More', 'Next Rung'],
    cycle: ['ladder', 'emom'],
    dayTypes: {
      ladder: { label: 'Pull ladder', short: 'Ladder', blocks: [L('Pull ladder', ['pullBarMain', 'chestBw']), S('Legs', ['squat2', 'hinge2'])] },
      emom: { label: 'Pull EMOM', short: 'EMOM', blocks: [E('Pull EMOM', ['backBar', 'backRow'], { values: [10, 12] }), S('Rear shoulders', ['backRear', 'shoulderHealth'])] },
    },
  },
  {
    id: 'chinup-biceps', added: 16, catalogue: 9, name: 'Chin-up Biceps', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'weight', 'reps'],
    split: 'Chin-ups & curls / pulls & presses', blurb: 'Chin-ups with curl supersets for arms and back, then a day of pulls and presses.',
    about: 'Chin-ups train the back and the biceps at once, so this program leans into it. One day supersets chin-ups and chin holds with curls; the other mixes pull-ups and rows with presses so the chest keeps up. Abs finish every session. Level II asks for heavier dumbbells and Level III adds reps.',
    names: ['Chin Music', 'Chin Strap', 'Chin Wag', 'Keep Your Chin Up', 'Chinwag', 'Double Chin', 'Chin Chin', 'Cheers', 'Up Chin', 'Chin Over', 'Bar Chin', 'Chin Check'],
    cycle: ['chin', 'press'],
    dayTypes: {
      chin: { label: 'Chin-ups & curls', short: 'Chins', blocks: [SS('Chin-ups & curls', ['chinup', 'biceps2', 'chin_hold', 'biceps2', 'negative_pullup', 'gripCurl'])] },
      press: { label: 'Pulls & presses', short: 'Press', blocks: [SS('Pulls & presses', ['backBar', 'chestPress', 'backRow', 'shoulderPress', 'backRear', 'triceps2'])] },
    },
  },
  {
    id: 'pullup-30', added: 16, catalogue: 9, days: 30, name: 'Pull-up 30', subject: 'Pull-ups', minutes: [30, 35], levers: [null, 'reps', 'variation'],
    split: 'Bar & push / bar & legs, 30 days', blurb: 'A month to more pull-ups: the bar every day, with pushing or legs after it.',
    about: 'A month on the bar. Every day starts with pull-ups in straight sets, then trains pushing one day and legs the next. Every ten days the level steps up: more reps at Level II, harder pull-up variations at Level III. Abs finish every session.',
    names: ['Pull One', 'Bar Week', 'Ten Pulls', 'Twenty Pulls', 'Bar Month', 'Thirty Bars', 'Pull Up', 'Bar Raise', 'High Bar Month', 'Bar Count', 'Pull Tally', 'Bar Mark'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: { label: 'Bar & push', short: 'Push', blocks: [S('Pull-ups', ['pullBarMain', 'backBar']), S('Push', ['chestPress', 'shoulderPress', 'triceps2?'])] },
      legs: { label: 'Bar & legs', short: 'Legs', blocks: [S('Pull-ups', ['backBar', 'pullBarMain']), S('Legs', ['squat2', 'hinge2', 'calf?'])] },
    },
  },
  {
    id: 'bar-and-bell', added: 16, catalogue: 9, name: 'Bar & Bell', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'weight', 'tempo'],
    split: 'Bar & swings / bar & presses', blurb: 'Pull-ups with a kettlebell: swings one day, presses the next, the bar every day.',
    about: 'The pull-up bar and the kettlebell together. Every day starts on the bar, then one day swings and squats with the bell, the other presses and rows it. The bar builds the back, the bell the hips and shoulders. Abs finish every session. Level II asks for a heavier bell and Level III slows every rep down.',
    names: ['Bar Bell', 'Bell Bar', 'Hang & Swing', 'Pull & Press', 'Iron Pair', 'Steel Duo', 'Bar Room', 'Bell Tower Bar', 'Swing Bar', 'Hang Bell', 'Bell Hop Bar', 'Ring the Bar'],
    cycle: ['swing', 'press'],
    dayTypes: {
      swing: { label: 'Bar & swings', short: 'Swing', blocks: [S('Bar & swings', ['backBar', 'kb_swing', 'pullBar2', 'goblet_squat'])] },
      press: { label: 'Bar & presses', short: 'Press', blocks: [S('Bar & presses', ['backBar', 'kb_press', 'pullBar2', 'kb_row'])] },
    },
  },
  {
    id: 'wide-grip-week', added: 16, catalogue: 9, name: 'Wide Grip', subject: 'Pull-ups', minutes: [33, 37], levers: [null, 'reps', 'reps'],
    split: 'Wide pulls / rear shoulders & arms / legs', blurb: 'A wider back from wide-grip pull-ups, rear-shoulder work and arms, with a leg day.',
    about: 'For width across the back. One day is wide-grip pull-ups, lat pulls and rows; the next is rear shoulders, traps and arms; the third trains the legs. Wide grips put the lats to work hard, and the rear-shoulder day keeps the shoulders healthy. Abs finish every session. Both later levels add reps.',
    names: ['Wide Load', 'Wingspan Bar', 'Broad', 'Expanse', 'Panorama', 'Wide Angle', 'Widescreen', 'Big Sky', 'Horizon', 'Open Range', 'Spread', 'Span'],
    cycle: ['wide', 'rear', 'legs'],
    dayTypes: {
      wide: { label: 'Wide pulls', short: 'Wide', blocks: [S('Wide pulls', ['wide_pullup', 'backBar', 'backRow', 'backBw?'])] },
      rear: { label: 'Rear shoulders & arms', short: 'Rear', blocks: [S('Rear shoulders & arms', ['backRear', 'trapsPool', 'biceps2', 'backRear?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2', 'calf?'])] },
    },
  },
  // Legs & glutes +6 (straight sets only)
  {
    id: 'glute-and-hamstring', added: 16, catalogue: 9, name: 'Glutes & Hamstrings', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'weight', 'reps'],
    split: 'Glutes / hamstrings / upper', blurb: 'The back of the legs: a glute day, a hamstring day, then an upper-body day.',
    about: 'The whole back of the legs. One day is glutes, with hip thrusts, bridges and abduction; the next is hamstrings, with Romanian deadlifts, single-leg hinges and swings. The third trains the upper body. Strong glutes and hamstrings protect the back and make you faster, and abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Hindquarters', 'Rear Engine', 'Back Wheels', 'Tailgate', 'Rear Axle', 'Back Burner', 'Rearguard', 'Rear Window', 'Back Porch', 'Back Yard', 'Rear Deck', 'Stern'],
    cycle: ['glutes', 'hams', 'upper'],
    dayTypes: {
      glutes: { label: 'Glutes', short: 'Glutes', blocks: [S('Glutes', ['thrust', 'hipGlute', 'glute2', 'adductor?'])] },
      hams: { label: 'Hamstrings', short: 'Hams', blocks: [S('Hamstrings', ['hinge2', 'single_leg_rdl', 'kb_swing', 'hipGlute?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderPress', 'biceps2?'])] },
    },
  },
  {
    id: 'legs-all-over', added: 16, catalogue: 9, name: 'Legs All Over', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'reps', 'weight'],
    split: 'Quads & calves / glutes & adductors / upper', blurb: 'Every part of the legs: quads and calves, glutes and inner thighs, then the upper body.',
    about: 'Legs from every angle, including the parts most programs skip. One day is quads and calves; the next is glutes and inner thighs; the third trains the upper body. The calf and adductor work make the legs stronger and the knees and ankles steadier. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Leg Map', 'Thigh Gap', 'Calf Country', 'Knee Deep', 'Hip Hop', 'Shin Dig', 'Ankle Deep', 'Leg Room', 'Lower Deck', 'Ground Level', 'Foot Work', 'Base Camp'],
    cycle: ['quads', 'glutes', 'upper'],
    dayTypes: {
      quads: { label: 'Quads & calves', short: 'Quads', blocks: [S('Quads & calves', ['squat2', 'lunge2', 'calf', 'shin?'])] },
      glutes: { label: 'Glutes & adductors', short: 'Glutes', blocks: [S('Glutes & adductors', ['thrust', 'adductorLoad', 'adductor', 'hipGlute?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['backRow', 'chestPress', 'shoulderRaise', 'triceps2?'])] },
    },
  },
  {
    id: 'kettlebell-legs', added: 16, catalogue: 9, name: 'Kettlebell Legs', subject: 'Legs & glutes', minutes: [33, 37], equip: 'kb', levers: [null, 'weight', 'tempo'],
    split: 'Squat & swing / hinge & lunge / upper', blurb: 'Legs and glutes with one kettlebell: goblet squats and swings, deadlifts and lunges, then upper body.',
    about: 'Strong legs with a single kettlebell. One day is goblet and front squats with swings; the next is deadlifts, sumo work and lunges; the third presses and rows the bell for the upper body. Straight sets, steady rests. Abs finish every session. Level II asks for a heavier bell and Level III slows every rep down.',
    names: ['Bell Legs', 'Goblet', 'Chalice', 'Grail', 'Cup', 'Tankard', 'Stein', 'Flagon', 'Pitcher', 'Jug', 'Urn', 'Vase'],
    cycle: ['squat', 'hinge', 'upper'],
    dayTypes: {
      squat: { label: 'Squat & swing', short: 'Squat', blocks: [S('Squat & swing', ['goblet_squat', 'kb_swing', 'kb_front_squat', 'kbCxLower?'])] },
      hinge: { label: 'Hinge & lunge', short: 'Hinge', blocks: [S('Hinge & lunge', ['kb_deadlift', 'kb_sumo_deadlift', 'lateral_lunge', 'sumo_pulse?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['kb_press', 'kb_row', 'kb_floor_press', 'kb_halo?'])] },
    },
  },
  {
    id: 'single-leg-30', added: 16, catalogue: 9, days: 30, name: 'Single Leg 30', subject: 'Legs & glutes', minutes: [30, 35], levers: [null, 'reps', 'variation'],
    split: 'Single-leg A / upper / single-leg B, 30 days', blurb: 'A month of one leg at a time: split squats, single-leg hinges and lunges, with an upper day.',
    about: 'A month for strong, balanced legs, one at a time. Two single-leg days, split squats and step-downs one, single-leg hinges and lunges the other, sit around an upper-body day. Training one leg at a time evens out a weaker side. Every ten days the level steps up: more reps at Level II, harder variations at Level III. Abs finish every session.',
    names: ['Solo', 'Single', 'Uno', 'Lone', 'One Way', 'Left Foot', 'Right Foot', 'Odd Leg', 'Even Leg', 'Flamingo Strength', 'Hop On', 'One Step'],
    cycle: ['a', 'upper', 'b'],
    dayTypes: {
      a: { label: 'Single-leg A', short: 'A', blocks: [S('Single-leg A', ['split_squat', 'singleLeg', 'calf', 'singleLeg?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderPress', 'biceps2?'])] },
      b: { label: 'Single-leg B', short: 'B', blocks: [S('Single-leg B', ['single_leg_rdl', 'lunge2', 'single_leg_bridge', 'singleLeg?'])] },
    },
  },
  {
    id: 'squat-everyday', added: 16, catalogue: 9, name: 'Squat Every Day', subject: 'Legs & glutes', minutes: [33, 37], levers: [null, 'tempo', 'reps'],
    split: 'Squat & push / squat & pull', blurb: 'A squat every day, then pushing one day and pulling the next: legs that get used to working.',
    about: 'A squat of some kind every day, then the upper body: pushing one day, pulling the next. Squatting often, at a manageable effort, makes the movement smooth and the legs used to working. The squat changes from goblet to front squat to split squat. Abs finish every session. Level II slows every rep down and Level III adds reps.',
    names: ['Daily Squat', 'Squat Rack', 'Deep Down', 'Rock Bottom', 'Ass to Grass', 'Below Parallel', 'Hole', 'Drive Up', 'Stand Up', 'Rise Up', 'Get Up', 'Sit Down'],
    cycle: ['push', 'pull'],
    dayTypes: {
      push: { label: 'Squat & push', short: 'Push', blocks: [S('Squat & push', ['squat2', 'lunge2', 'chestPress', 'shoulderPress?'])] },
      pull: { label: 'Squat & pull', short: 'Pull', blocks: [S('Squat & pull', ['squat2', 'hinge2', 'backRow', 'backBar?'])] },
    },
  },
  {
    id: 'glute-30', added: 16, catalogue: 9, days: 30, name: 'Glute 30', subject: 'Legs & glutes', minutes: [30, 35], levers: [null, 'weight', 'tempo'],
    split: 'Thrust / upper / hinge, 30 days', blurb: 'A month for the glutes: hip thrusts one day, hinges two days later, an upper day between.',
    about: 'A month built around the glutes. A hip-thrust day and a hinge day sit either side of an upper-body day, so the glutes work hard and then recover. Every ten days the level steps up: heavier weights at Level II, slower reps at Level III. Abs finish every session.',
    names: ['Glute One', 'Thrust Day', 'Bridge Day', 'Hinge Day', 'Glute Week', 'Peach Month', 'Glute Gains', 'Hip Drive', 'Glute Lift', 'Cheeks', 'Seat', 'Rear Power'],
    cycle: ['thrust', 'upper', 'hinge'],
    dayTypes: {
      thrust: { label: 'Thrust', short: 'Thrust', blocks: [S('Thrust', ['hip_thrust', 'hipGlute', 'thrust', 'adductor?'])] },
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper body', ['backRow', 'chestPress', 'shoulderRaise', 'biceps2?'])] },
      hinge: { label: 'Hinge', short: 'Hinge', blocks: [S('Hinge', ['hinge2', 'single_leg_rdl', 'kb_swing', 'glute2?'])] },
    },
  },
  // Kettlebell only +6 (straight / circuit / EMOM)
  {
    id: 'bell-muscle', added: 16, catalogue: 9, name: 'Bell Muscle', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Bell chest & back / bell legs / bell shoulders', blurb: 'Muscle with one kettlebell: floor presses and rows, squats and swings, presses and halos.',
    about: 'Building muscle with one kettlebell, body part by body part. One day presses and rows, one-arm floor presses, dead-stop rows; one trains the legs; one the shoulders with presses, bottoms-up presses and halos. Straight sets with steady rests. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Bell Body', 'Iron Bell', 'Bell Bulk', 'Bell Build', 'Bell Mass', 'Bell Frame', 'Bell Form', 'Bell Shape', 'Bell Mould', 'Bell Cast', 'Bell Forge', 'Bell Temper'],
    cycle: ['cb', 'legs', 'sh'],
    dayTypes: {
      cb: { label: 'Chest & back', short: 'Chest', blocks: [S('Chest & back', ['kb_floor_press', 'kb_dead_stop_row', 'kb_row', 'chestBw?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['goblet_squat', 'kb_swing', 'kbLower2', 'sumo_pulse?'])] },
      sh: { label: 'Shoulders', short: 'Shoulders', blocks: [S('Shoulders', ['kb_press', 'bottoms_up_press', 'kb_halo', 'kb_high_pull?'])] },
    },
  },
  {
    id: 'bell-emom-plus', added: 16, catalogue: 9, name: 'Bell EMOM Plus', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Bell EMOM & strength / strength & bell EMOM', blurb: 'A kettlebell EMOM and a strength block every day, the order flipping from one day to the next.',
    about: 'Every day has an EMOM and a strength block, and the order flips. Starting with the EMOM trains you to lift well when tired; starting with strength keeps the heavy work fresh. Swings, cleans and presses on the clock; rows, squats and floor presses in straight sets. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Flip', 'Flop', 'Swap', 'Switch', 'Turn', 'Reverse', 'Invert', 'Swivel', 'Toggle Bell', 'Change Up', 'Shift', 'Rotate'],
    cycle: ['emom', 'strength'],
    dayTypes: {
      emom: { label: 'EMOM & strength', short: 'EMOM', blocks: [E('Bell EMOM', ['kb_swing', 'kb_clean', 'kb_press'], { values: [9, 12] }), S('Strength', ['kb_row', 'goblet_squat', 'kb_floor_press?'])] },
      strength: { label: 'Strength & EMOM', short: 'Strength', blocks: [S('Strength', ['kb_dead_stop_row', 'kb_front_squat', 'kb_floor_press?']), E('Bell EMOM', ['kb_one_arm_swing', 'kb_push_press', 'kb_high_pull'], { values: [9, 12] })] },
    },
  },
  {
    id: 'bell-hips-core', added: 16, catalogue: 9, name: 'Bell Hips & Core', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Swing & sumo circuit / core & carry circuit', blurb: 'Hips and core with one bell: swing and sumo circuits, then windmills, halos and carries.',
    about: 'The kettlebell at its best: hips and core. One day is a circuit of swings, sumo deadlifts, sumo pulses and goblet squats; the other is windmills, halos, around-the-body passes and suitcase carries. Strong hips and a strong middle carry over to everything. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Hip Bell', 'Core Bell', 'Middle Bell', 'Belly Bell', 'Waist Bell', 'Swing Low', 'Swing High', 'Sumo Bell', 'Windmill Bell', 'Halo Bell', 'Carry Bell', 'Hinge Bell'],
    cycle: ['hips', 'core'],
    dayTypes: {
      hips: { label: 'Swing & sumo', short: 'Hips', blocks: [C('Hip circuit', ['kb_swing', 'kb_sumo_deadlift', 'sumo_pulse', 'goblet_squat', 'kb_one_arm_swing?'], { values: [3, 4, 5] })] },
      core: { label: 'Core & carry', short: 'Core', blocks: [C('Core circuit', ['kb_windmill', 'kb_halo', 'kb_around_body', 'suitcase_march', 'kbCore2?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'kettlebell-30-plus', added: 16, catalogue: 9, days: 30, name: 'Kettlebell 30 Plus', subject: 'Kettlebell only', minutes: [25, 30], equip: 'kb', levers: [null, 'weight', 'tempo'],
    split: 'Upper bell / lower bell, 30 days', blurb: 'A month with one kettlebell: upper-body days and lower-body days, straight sets.',
    about: 'A month of simple, steady kettlebell strength. Upper days press, row and floor press the bell; lower days squat, swing and deadlift it. Straight sets with full rests. Every ten days the level steps up: a heavier bell at Level II, slower reps at Level III. Abs finish every session.',
    names: ['Bell One', 'Bell Week', 'Bell Ten', 'Bell Twenty', 'Bell Thirty', 'Bell Month', 'Bell Step', 'Bell Rung', 'Bell Mark', 'Bell Notch', 'Bell Tally', 'Bell Score'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper bell', short: 'Upper', blocks: [S('Upper bell', ['kb_press', 'kb_row', 'kb_floor_press', 'kb_high_pull?'])] },
      lower: { label: 'Lower bell', short: 'Lower', blocks: [S('Lower bell', ['goblet_squat', 'kb_swing', 'kb_deadlift', 'lateral_lunge?'])] },
    },
  },
  {
    id: 'bell-arms', added: 16, catalogue: 9, name: 'Bell & Bodyweight Arms', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Press & dip / row & hold', blurb: 'Arms and upper body with one bell and the floor: presses, floor dips, rows and holds.',
    about: 'Upper body and arms with one kettlebell and your bodyweight. One day presses the bell and adds floor dips and close-grip push-ups for the triceps; the other rows it, holds it bottoms-up and adds floor pulls. Straight sets, steady rests. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Bell Arms', 'Dip & Press', 'Row & Hold', 'Bell Biceps', 'Bell Triceps', 'Bell Forearm', 'Bell Wrist', 'Bell Elbow', 'Bell Grip Arms', 'Bell Sleeve', 'Bell Cuff', 'Bell Band'],
    cycle: ['press', 'row'],
    dayTypes: {
      press: { label: 'Press & dip', short: 'Press', blocks: [S('Press & dip', ['kb_press', 'floor_dip', 'kb_floor_press', 'close_grip_pushup'])] },
      row: { label: 'Row & hold', short: 'Row', blocks: [S('Row & hold', ['kb_row', 'kb_bottoms_up_hold', 'kb_dead_stop_row', 'backBw'])] },
    },
  },
  {
    id: 'bell-full-emom', added: 16, catalogue: 9, name: 'Bell Full-Body EMOM', subject: 'Kettlebell only', minutes: [28, 32], equip: 'kb', levers: [null, 'reps', 'reps'],
    split: 'Long bell EMOM A / B', blurb: 'One long kettlebell EMOM a day: five moves round the clock for the whole body.',
    about: 'One long EMOM a day with the kettlebell: five moves in rotation, a set at the top of each minute, for twenty minutes or more. Swings, presses, squats, rows and core take turns, so nothing gets too tired. Steady, honest conditioning with strength built in. Abs finish every session. Both later levels add reps.',
    names: ['Round the Clock', 'Bell Clock', 'Bell Hour', 'Bell Minute', 'Bell Time', 'Bell Watch', 'Bell Dial', 'Bell Face', 'Bell Hand', 'Bell Chime', 'Bell Strike', 'Bell Toll Clock'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bell EMOM A', short: 'A', blocks: [E('Bell EMOM', ['kb_swing', 'kb_press', 'goblet_squat', 'kb_row', 'kbCore2'], { values: [15, 20] })] },
      b: { label: 'Bell EMOM B', short: 'B', blocks: [E('Bell EMOM', ['kb_clean', 'kb_floor_press', 'kb_deadlift', 'kb_high_pull', 'kb_halo'], { values: [15, 20] })] },
    },
  },
  // Bodyweight +7 (superset / straight / circuit / AMRAP)
  {
    id: 'bodyweight-muscle', added: 16, catalogue: 9, name: 'Bodyweight Muscle', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Chest & arms / back & shoulders / legs', blurb: 'Building muscle with no equipment: chest and arms, back and shoulders, then legs.',
    about: 'Muscle without equipment, body part by body part. One day is push-up variations and floor dips for chest and arms; one is floor pulls and pike work for back and shoulders; one is legs and glutes. Supersets keep it dense. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Body Built', 'Self Made', 'Home Grown', 'Hand Made', 'Natural', 'Raw', 'Bare Bones', 'Pure', 'Organic', 'Wild', 'Free Range', 'Off Grid'],
    cycle: ['chest', 'back', 'legs'],
    dayTypes: {
      chest: { label: 'Chest & arms', short: 'Chest', blocks: [SS('Chest & arms', ['chestBw', 'armsBw', 'chestBw', 'armsBw'])] },
      back: { label: 'Back & shoulders', short: 'Back', blocks: [SS('Back & shoulders', ['backBw', 'shoulderBw', 'backBw', 'shoulderBw'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [SS('Legs', ['legsBw2', 'thrustBw', 'adductorBw', 'calfBw'])] },
    },
  },
  {
    id: 'bodyweight-circuit-plus', added: 16, catalogue: 9, name: 'Bodyweight Circuits Plus', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Upper circuit / lower circuit / full circuit', blurb: 'Three bodyweight circuits: upper, lower and full body, round after round.',
    about: 'Three circuits in rotation, all on the floor. The upper circuit is push-ups, floor pulls and pike work; the lower is squats, lunges, bridges and calf raises; the full-body one mixes both with core. Short rests, steady rounds. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Circuit Up', 'Circuit Down', 'Circuit All', 'Body Loop', 'Floor Loop', 'Room Loop', 'Mat Loop', 'Ring Circuit', 'Round Body', 'Body Lap', 'Floor Lap', 'Mat Lap'],
    cycle: ['upper', 'lower', 'full'],
    dayTypes: {
      upper: { label: 'Upper circuit', short: 'Upper', blocks: [C('Upper circuit', ['chestBw', 'backBw', 'shoulderBw', 'armsBw', 'backBw?'], { values: [2, 3, 4] })] },
      lower: { label: 'Lower circuit', short: 'Lower', blocks: [C('Lower circuit', ['legsBw2', 'thrustBw', 'adductorBw', 'calfBw', 'legsBw2?'], { values: [2, 3, 4] })] },
      full: { label: 'Full circuit', short: 'Full', blocks: [C('Full circuit', ['chestBw', 'legsBw2', 'backBw', 'thrustBw', 'coreAnti?'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'pushup-pullup-bw', added: 16, catalogue: 9, name: 'Push & Floor Pull', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Push-pull AMRAP / legs AMRAP', blurb: 'AMRAPs with no equipment: push-ups and floor pulls one day, legs and glutes the next.',
    about: 'As many rounds as you can, on the floor. One day pairs push-up variations with floor pulls in an AMRAP; the other is legs and glutes. Note your rounds and try to beat them. Simple, measurable, and hard. Abs finish every session. Both later levels add reps.',
    names: ['Max Rounds', 'Beat It', 'Personal Best', 'Record', 'Top Score', 'High Score', 'New Best', 'Leaderboard', 'Scoreboard', 'Tally Up', 'Count Up', 'Rounds Up'],
    cycle: ['upper', 'legs'],
    dayTypes: {
      upper: { label: 'Push-pull AMRAP', short: 'Upper', blocks: [A('Push-pull AMRAP', ['chestBw', 'backBw', 'shoulderBw'], { values: [10, 12, 15] })] },
      legs: { label: 'Legs AMRAP', short: 'Legs', blocks: [A('Legs AMRAP', ['legsBw2', 'thrustBw', 'calfBw'], { values: [10, 12, 15] })] },
    },
  },
  {
    id: 'bodyweight-30', added: 16, catalogue: 9, days: 30, name: 'Bodyweight 30', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'tempo'],
    split: 'Upper / lower, 30 days, no gear', blurb: 'A month with no equipment: upper-body days and lower-body days in supersets.',
    about: 'A month of bodyweight strength. Upper days superset push-ups with floor pulls and pike work; lower days superset squats and lunges with bridges and calves. Every ten days the level steps up: harder variations at Level II, slower reps at Level III. Abs finish every session.',
    names: ['Body One', 'Body Week', 'Body Ten', 'Body Twenty', 'Body Thirty', 'Body Month', 'Floor Month', 'Mat Month', 'No Gear Month', 'Bare Month', 'Room Month', 'Free Month'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper', short: 'Upper', blocks: [SS('Upper', ['chestBw', 'backBw', 'shoulderBw', 'backBw'])] },
      lower: { label: 'Lower', short: 'Lower', blocks: [SS('Lower', ['legsBw2', 'thrustBw', 'adductorBw', 'calfBw'])] },
    },
  },
  {
    id: 'calisthenics-skills', added: 16, catalogue: 9, name: 'Calisthenics Skills', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Pseudo-planche & pike / pistol & bridge', blurb: 'Toward calisthenics skills: pseudo-planche and pike push-ups, pistol work and bridges.',
    about: 'The road toward calisthenics skills, at home. One day works the pressing skills, pseudo-planche push-ups, pike push-ups and holds; the other the leg and back skills, pistol progressions, shrimp squats and bridges. Straight sets with full rests, quality over quantity. Abs finish every session. Both later levels bring harder variations.',
    names: ['Skill One', 'Lean', 'Tuck', 'Straddle', 'Pistol', 'Shrimp', 'Bridge', 'Wheel', 'Pike', 'Planche', 'Lever', 'Flag'],
    cycle: ['press', 'legs'],
    dayTypes: {
      press: { label: 'Pseudo-planche & pike', short: 'Press', blocks: [S('Pressing skills', ['pseudo_planche_pushup', 'pike_pushup', 'pike_hold', 'archer_pushup'])] },
      legs: { label: 'Pistol & bridge', short: 'Legs', blocks: [S('Leg & back skills', ['pistol_box_squat', 'shrimp_squat', 'single_leg_bridge', 'reverse_snow_angel'])] },
    },
  },
  {
    id: 'travel-strength', added: 16, catalogue: 9, name: 'Travel Strength', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Hotel A / hotel B / hotel C', blurb: 'Strength in a hotel room: three quiet bodyweight days that need only floor space.',
    about: 'Made for hotel rooms: quiet, no jumping, only floor space. Three days rotate, each a full-body straight-set session of push-ups, floor pulls, squats, lunges and bridges in different variations. You keep your strength on the road without disturbing anyone below. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Room 101', 'Room Service', 'Do Not Disturb Strength', 'Late Checkout', 'Minibar', 'Lobby', 'Concierge', 'Suite', 'Penthouse Room', 'Bellhop', 'Turndown', 'Wake-up Call'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Hotel A', short: 'A', blocks: [S('Full body A', ['chestBw', 'backBw', 'legsBw2', 'thrustBw'])] },
      b: { label: 'Hotel B', short: 'B', blocks: [S('Full body B', ['pushBw2', 'backBw', 'lunge2', 'adductorBw'])] },
      c: { label: 'Hotel C', short: 'C', blocks: [S('Full body C', ['armsBw', 'shoulderBw', 'singleLeg', 'calfBw'])] },
    },
  },
  {
    id: 'pushup-and-squat', added: 16, catalogue: 9, name: 'Push-ups & Squats', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'tempo', 'reps'],
    split: 'Push-up & squat supersets A / B', blurb: 'The two best bodyweight moves, paired every day: push-up and squat supersets.',
    about: 'Push-ups and squats, the two best bodyweight moves, paired in supersets every day, with a floor pull and a bridge to balance them. The variations change each time, wide and close push-ups, cossack and split squats. Simple and effective. Abs finish every session. Level II slows every rep down and Level III adds reps.',
    names: ['Push Squat', 'Up Down', 'Down Up', 'Bob', 'Dip', 'Rise', 'Fall', 'Drop', 'Lift', 'Press Squat', 'Squat Press', 'Pair Up'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Supersets A', short: 'A', blocks: [SS('Push-ups & squats', ['chestBw', 'legsBw2', 'chestBw', 'legsBw2', 'backBw', 'thrustBw'])] },
      b: { label: 'Supersets B', short: 'B', blocks: [SS('Push-ups & squats', ['pushBw2', 'singleLeg', 'chestBw', 'adductorBw', 'backBw', 'calfBw'])] },
    },
  },
  // Busy week +6 (short)
  {
    id: 'twenty-muscle', added: 16, catalogue: 9, name: 'Twenty Muscle', subject: 'Busy week', minutes: [18.5, 21.4], absSlots: ['absW', 'abs?'], levers: [null, 'weight', 'reps'],
    split: 'Upper supersets / lower supersets, 20 minutes', blurb: 'Muscle in twenty minutes: upper-body supersets one day, lower-body the next.',
    about: 'Twenty minutes, real muscle. Every day is supersets, upper body one day and lower body the next, with short rests so the work adds up fast. Chest with back, shoulders with arms, squats with hinges, glutes with calves. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Twenty', 'Score', 'Two Tens', 'Four Fives', 'Quick Twenty', 'Lunch Twenty', 'Coffee Twenty', 'Lean Twenty', 'Fast Twenty', 'Tight Twenty', 'Busy Twenty', 'Last Twenty'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper supersets', short: 'Upper', blocks: [SS('Upper supersets', ['chestPress', 'backRow', 'shoulderRaise', 'biceps2'], { values: [2, 3, 4] })] },
      lower: { label: 'Lower supersets', short: 'Lower', blocks: [SS('Lower supersets', ['squat2', 'hinge2', 'thrust', 'calf'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'fifteen-emom', added: 16, catalogue: 9, name: 'Fifteen EMOM', subject: 'Busy week', minutes: [13, 17], absSlots: ['abs'], levers: [null, 'reps', 'weight'],
    split: 'Fifteen-minute EMOM A / B / C', blurb: 'Fifteen minutes on the clock: three EMOMs for the whole body, nothing else.',
    about: 'Fifteen minutes and done. Each day is one EMOM, a set at the top of every minute, rotating three or four moves that cover the whole body. Three different EMOMs keep it fresh. Ideal when you have a quarter of an hour. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Quarter Hour', 'Fifteen', 'Quick Clock', 'Short Clock', 'Snap Clock', 'Fast Clock', 'Brief', 'Express Clock', 'Rapid', 'Swift', 'Prompt Clock', 'Speedy'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('EMOM', ['squat2', 'chestPress', 'backRow'], { values: [6, 9, 12] })] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('EMOM', ['hinge2', 'shoulderPress', 'backBar'], { values: [6, 9, 12] })] },
      c: { label: 'EMOM C', short: 'C', blocks: [E('EMOM', ['lunge2', 'chestBw', 'thrust', 'kbBallistic'], { values: [8, 12] })] },
    },
  },
  {
    id: 'twenty-arms-abs', added: 16, catalogue: 9, name: 'Twenty Arms & Abs', subject: 'Busy week', minutes: [18.5, 21.4], absSlots: ['absW', 'abs?'], levers: [null, 'reps', 'tempo'],
    split: 'Arms circuit / shoulders circuit, 20 minutes', blurb: 'Twenty minutes for the bits that show: an arms circuit one day, shoulders the next, abs every day.',
    about: 'A short program for arms, shoulders and abs. One day is a circuit of curls and triceps moves, the next a circuit of presses and raises, and abs finish every day. Twenty minutes, a good pump, done. Pair it with a leg program if you want the full picture. Level II adds reps and Level III slows every rep down.',
    names: ['Pump Twenty', 'Arm Twenty', 'Abs Twenty', 'Shoulder Twenty', 'Flex Twenty', 'Show Twenty', 'Sleeve Twenty', 'Tee Twenty', 'Beach Twenty', 'Mirror Twenty', 'Peak Twenty', 'Cap Twenty'],
    cycle: ['arms', 'shoulders'],
    dayTypes: {
      arms: { label: 'Arms circuit', short: 'Arms', blocks: [C('Arms circuit', ['biceps2', 'triceps2', 'biceps2', 'triceps2?'], { values: [1, 2, 3] })] },
      shoulders: { label: 'Shoulders circuit', short: 'Shoulders', blocks: [C('Shoulders circuit', ['shoulderPress', 'shoulderRaise', 'shoulderHealth', 'trapsPool?'], { values: [1, 2, 3] })] },
    },
  },
  {
    id: 'twenty-tabata-plus', added: 16, catalogue: 9, name: 'Twenty Tabata Plus', subject: 'Busy week', minutes: [18.5, 21.4], absSlots: ['absW', 'abs?'], levers: [null, 'reps', 'reps'],
    split: 'Upper & Tabata / lower & Tabata', blurb: 'Twenty minutes: a short strength block, then a Tabata to finish, upper and lower days.',
    about: 'Strength and sweat in twenty minutes. A short straight-set block for the upper or lower body comes first, then a Tabata, twenty seconds hard and ten seconds rest, eight times. The new strength moves rotate in from the muscle-focus pools. Abs finish every session. Both later levels add reps.',
    names: ['Tabata Twenty', 'Sweat Twenty', 'Burn Twenty', 'Heat Twenty', 'Blaze Twenty', 'Spark Twenty', 'Fire Twenty', 'Flash Twenty', 'Flare Twenty', 'Glow Twenty', 'Ember Twenty', 'Torch Twenty'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & Tabata', short: 'Upper', blocks: [S('Upper', ['chestPress', 'backRow?'], { values: [2, 3] }), T('Tabata', ['hiit', 'chestBw'], { values: [1] })] },
      lower: { label: 'Lower & Tabata', short: 'Lower', blocks: [S('Lower', ['squat2', 'thrust?'], { values: [2, 3] }), T('Tabata', ['hiit', 'legsBw2'], { values: [1] })] },
    },
  },
  {
    id: 'busy-30', added: 16, catalogue: 9, days: 30, name: 'Busy 30', subject: 'Busy week', minutes: [18.5, 21.4], absSlots: ['absW', 'abs?'], levers: [null, 'reps', 'weight'],
    split: 'AMRAP / EMOM, 20 minutes, 30 days', blurb: 'A month of twenty-minute sessions: an AMRAP one day, an EMOM the next.',
    about: 'A month for a busy life: twenty minutes a day. One day is an AMRAP of a squat, a press and a pull; the next an EMOM of a hinge, a row and a carry. Every ten days the level steps up: more reps at Level II, heavier weights at Level III. Abs finish every session.',
    names: ['Busy One', 'Busy Week', 'Busy Ten', 'Busy Twenty', 'Busy Thirty', 'Busy Month', 'Rush Hour', 'School Run', 'Lunch Hour', 'Commute', 'Late Shift', 'Early Shift'],
    cycle: ['amrap', 'emom'],
    dayTypes: {
      amrap: { label: 'AMRAP', short: 'AMRAP', blocks: [A('AMRAP', ['squat2', 'chestPress', 'backRow'], { values: [10, 12, 15] })] },
      emom: { label: 'EMOM', short: 'EMOM', blocks: [E('EMOM', ['hinge2', 'backBar', 'farmer_carry'], { values: [9, 12] })] },
    },
  },
  {
    id: 'no-gear-twenty', added: 16, catalogue: 9, name: 'No-Gear Twenty', subject: 'Busy week', minutes: [18.5, 21.4], equip: 'bw', absSlots: ['abs', 'abs?'], levers: [null, 'reps', 'tempo'],
    split: 'Bodyweight circuit A / B, 20 minutes', blurb: 'Twenty minutes, no equipment: two bodyweight circuits that cover the whole body.',
    about: 'Twenty minutes, nothing but the floor. Two circuits alternate, each a push-up, a floor pull, a leg move and a glute move, round after round. Quiet enough for a flat, short enough for a lunch break. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Free Twenty', 'Floor Twenty', 'Mat Twenty', 'Room Twenty', 'Home Twenty', 'Hotel Twenty', 'Quiet Twenty', 'Bare Twenty', 'Body Twenty', 'Simple Twenty', 'Plain Twenty', 'Easy Twenty'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Bodyweight circuit', ['chestBw', 'backBw', 'legsBw2', 'thrustBw?'], { values: [1, 2, 3] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Bodyweight circuit', ['pushBw2', 'backBw', 'singleLeg', 'adductorBw?'], { values: [1, 2, 3] })] },
    },
  },
  // Grip & forearms +4
  {
    id: 'grip-emom', added: 16, catalogue: 9, name: 'Grip EMOM', subject: 'Grip & forearms', minutes: [24, 29], levers: [null, 'reps', 'weight'],
    split: 'Grip EMOM / forearm supersets', blurb: 'Grip on the minute: holds, carries and curls in an EMOM, then forearm supersets.',
    about: 'Grip strength on the clock. One day is an EMOM of farmer carries, dead hangs, shrug holds and wrist curls, a set at the top of every minute. The other day is forearm supersets, wrist curls with reverse curls and hammer curls with Zottman curls. Abs finish every session. Level II adds reps and time and Level III asks for heavier weights.',
    names: ['Grip Clock', 'Hold Time', 'Hang Clock', 'Carry Clock', 'Wrist Clock', 'Forearm Clock', 'Squeeze Clock', 'Crush Clock', 'Pinch Clock', 'Clamp Clock', 'Vice Clock', 'Grip Watch'],
    cycle: ['emom', 'ss'],
    dayTypes: {
      emom: { label: 'Grip EMOM', short: 'EMOM', blocks: [E('Grip EMOM', ['farmer_carry', 'gripHold', 'shrug_hold', 'gripCurl'], { values: [12, 14, 16] })] },
      ss: { label: 'Forearm supersets', short: 'Supersets', blocks: [SS('Forearm supersets', ['wrist_curl', 'reverse_curl', 'hammer_curl', 'zottman_curl', 'reverse_wrist_curl', 'gripHold'])] },
    },
  },
  {
    id: 'grip-and-pull', added: 16, catalogue: 9, name: 'Grip & Pull', subject: 'Grip & forearms', minutes: [28, 33], levers: [null, 'weight', 'tempo'],
    split: 'Heavy rows & holds / bar & carries', blurb: 'Grip built from pulling: heavy rows and holds, then the bar and carries.',
    about: 'Grip strength comes from pulling heavy things, so this program pulls. One day is heavy rows, gorilla rows and dead-stop rows with loaded holds between; the other is pull-ups, hangs and carries. No straps, ever. Abs finish every session. Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Pull Grip', 'Row Grip', 'Bar Grip', 'Carry Grip', 'Iron Fist', 'Steel Grip', 'Grip Lock', 'Hold Fast Grip', 'Grip Tight', 'Fist Bump', 'Knuckle Down', 'Clench'],
    cycle: ['rows', 'bar'],
    dayTypes: {
      rows: { label: 'Heavy rows & holds', short: 'Rows', blocks: [S('Heavy rows & holds', ['gorilla_row', 'gripHold', 'kb_dead_stop_row', 'gripHold?'])] },
      bar: { label: 'Bar & carries', short: 'Bar', blocks: [S('Bar & carries', ['backBar', 'dead_hang', 'farmer_carry', 'gripCurl?'])] },
    },
  },
  {
    id: 'forearm-circuit', added: 16, catalogue: 9, name: 'Forearm Circuit', subject: 'Grip & forearms', minutes: [24, 29], levers: [null, 'reps', 'reps'],
    split: 'Forearm circuit A / B', blurb: 'Forearms in circuits: curls, wrist work, holds and carries, round after round.',
    about: 'Big forearms from circuits. Wrist curls, reverse curls, Zottman curls, loaded holds and carries run back to back with short rests, then another round. The two days change the order and the hold. A burn you will feel for days at first. Abs finish every session. Both later levels add reps and time.',
    names: ['Forearm Loop', 'Wrist Loop', 'Grip Loop', 'Curl Loop', 'Hold Loop', 'Carry Loop', 'Popeye Loop', 'Sailor', 'Deckhand', 'Rigger Arms', 'Rope Puller', 'Oar Arms'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Forearm circuit A', short: 'A', blocks: [C('Forearm circuit', ['wrist_curl', 'zottman_curl', 'gripHold', 'reverse_wrist_curl', 'farmer_carry?'], { values: [3, 4, 5] })] },
      b: { label: 'Forearm circuit B', short: 'B', blocks: [C('Forearm circuit', ['reverse_curl', 'gripHold', 'wrist_curl', 'hammer_curl', 'suitcase_march?'], { values: [3, 4, 5] })] },
    },
  },
  {
    id: 'grip-30', added: 16, catalogue: 9, days: 30, name: 'Grip 30', subject: 'Grip & forearms', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Holds & lifts / curls & carries, 30 days', blurb: 'A month for a crushing grip: heavy holds and lifts, then forearm curls and carries.',
    about: 'A month for a stronger grip. One day is heavy lifts with long holds, deadlifts, rows and shrug holds; the next is forearm curls and carries. Every ten days the level steps up: heavier weights at Level II, more reps and time at Level III. Abs finish every session.',
    names: ['Grip One', 'Grip Week', 'Grip Ten', 'Grip Twenty', 'Grip Thirty', 'Grip Month', 'Handshake Month', 'Crush Month', 'Hold Month', 'Carry Month', 'Curl Month', 'Wrist Month'],
    cycle: ['lift', 'curl'],
    dayTypes: {
      lift: { label: 'Holds & lifts', short: 'Lifts', blocks: [S('Holds & lifts', ['hinge2', 'gripHold', 'gripPull', 'shrug_hold?'])] },
      curl: { label: 'Curls & carries', short: 'Curls', blocks: [S('Curls & carries', ['gripCurl', 'farmer_carry', 'gripCurl', 'suitcase_march?'])] },
    },
  },
  // Kettlebell complexes +4
  {
    id: 'complex-straight', added: 16, catalogue: 9, name: 'Complex Strength', subject: 'Kettlebell complexes', minutes: [26, 31], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Heavy complex A / B', blurb: 'Heavier kettlebell complexes in straight sets: fewer reps, longer rests, more strength.',
    about: 'Kettlebell complexes for strength rather than sweat. Each set chains a few moves, a clean, a press, a front squat, without putting the bell down, but with fewer reps and long rests so you can use a heavier bell. Two complexes alternate. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Heavy Chain', 'Iron Chain', 'Strong Link', 'Heavy Link', 'Anchor Chain', 'Tow Chain', 'Log Chain', 'Bike Chain', 'Chain Mail', 'Chain Gang', 'Chain Reaction', 'Chain Lightning'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Heavy complex A', short: 'A', blocks: [S('Heavy complex A', ['kb_clean', 'kb_press', 'kb_front_squat', 'kbCxCore?'])] },
      b: { label: 'Heavy complex B', short: 'B', blocks: [S('Heavy complex B', ['kb_swing', 'kb_high_pull', 'kb_push_press', 'kbCxLower?'])] },
    },
  },
  {
    id: 'complex-ladder-emom', added: 16, catalogue: 9, name: 'Complex Ladder EMOM', subject: 'Kettlebell complexes', minutes: [24, 29], equip: 'kb', levers: [null, 'reps', 'reps'],
    split: 'Complex ladder / complex EMOM', blurb: 'Two ways to chain the bell: a complex ladder one day, a complex EMOM the next.',
    about: 'Complexes, two ways. One day climbs a ladder: one rep of each move in the complex, then two, then three. The other day is an EMOM: one complex at the top of every minute. Both teach you to move smoothly from one lift to the next with the bell never touching down. Abs finish every session. Both later levels add reps.',
    names: ['Chain Ladder', 'Chain Clock', 'Link Ladder', 'Link Clock', 'Bell Steps', 'Bell Minutes', 'Climb Chain', 'Tick Chain', 'Rung Chain', 'Beat Chain', 'Step Chain', 'Tock Chain'],
    cycle: ['ladder', 'emom'],
    dayTypes: {
      ladder: { label: 'Complex ladder', short: 'Ladder', blocks: [L('Complex ladder', ['kbCx', 'kbCxLower']), C('Core', ['kbCxCore', 'kbCxCore'], { values: [2] })] },
      emom: { label: 'Complex EMOM', short: 'EMOM', blocks: [E('Complex EMOM', ['kbCx', 'kbCxUpper', 'kbCxLower'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'complex-30', added: 16, catalogue: 9, days: 30, name: 'Complex 30', subject: 'Kettlebell complexes', minutes: [24, 29], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Complex circuit / complex AMRAP, 30 days', blurb: 'A month of kettlebell complexes: circuits one day, AMRAPs the next.',
    about: 'A month of complexes with one kettlebell. One day is a complex circuit, round after round; the next an AMRAP of complexes. Every ten days the level steps up: more reps at Level II, a heavier bell at Level III. Abs finish every session.',
    names: ['Complex One', 'Complex Week', 'Complex Ten', 'Complex Twenty', 'Complex Thirty', 'Complex Month', 'Chain Month', 'Link Month', 'Bell Chain Month', 'Combo Month', 'Flow Month', 'String Month'],
    cycle: ['circuit', 'amrap'],
    dayTypes: {
      circuit: { label: 'Complex circuit', short: 'Circuit', blocks: [C('Complex circuit', ['kbCx', 'kbCxUpper', 'kbCxLower', 'kbCxCore'], { values: [3, 4, 5] })] },
      amrap: { label: 'Complex AMRAP', short: 'AMRAP', blocks: [A('Complex AMRAP', ['kbCx', 'kbCxLower', 'kbCxUpper'], { values: [10, 12, 15] })] },
    },
  },
  {
    id: 'complex-hips', added: 16, catalogue: 9, name: 'Hip Complexes', subject: 'Kettlebell complexes', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Swing complex / sumo complex', blurb: 'Complexes for the hips: swings, cleans and squats one day, sumo work and lunges the next.',
    about: 'Kettlebell complexes built around the hips. One day chains swings, cleans and front squats; the other sumo deadlifts, sumo pulses and lateral lunges. A circuit format with short rests between rounds. Strong hips and a big engine. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Hip Chain', 'Swing Chain', 'Sumo Chain', 'Lunge Chain', 'Squat Chain', 'Clean Chain', 'Hinge Chain', 'Drive Chain', 'Snap Chain', 'Pop Chain', 'Thrust Chain', 'Hip Link'],
    cycle: ['swing', 'sumo'],
    dayTypes: {
      swing: { label: 'Swing complex', short: 'Swing', blocks: [C('Swing complex', ['kb_swing', 'kb_clean', 'kb_front_squat', 'kb_one_arm_swing'], { values: [3, 4, 5] })] },
      sumo: { label: 'Sumo complex', short: 'Sumo', blocks: [C('Sumo complex', ['kb_sumo_deadlift', 'sumo_pulse', 'lateral_lunge', 'kbCxLower'], { values: [3, 4, 5] })] },
    },
  },
  // Climber / pull strength +3
  {
    id: 'climber-30', added: 16, catalogue: 9, days: 30, name: 'Climber 30', subject: 'Climber / pull strength', minutes: [26, 31], levers: [null, 'reps', 'variation'],
    split: 'Pull & hold / back & core, 30 days', blurb: 'A month of climbing strength: pull-ups and lock-offs, then back and core.',
    about: 'A month of climbing strength. One day is pull-ups, lock-offs and hangs in straight sets; the next is rows, rear-shoulder work and core for body tension on the wall. Every ten days the level steps up: more reps at Level II, harder pulls at Level III. Abs finish every session.',
    names: ['Crag One', 'Boulder Week', 'Route Ten', 'Pitch Twenty', 'Summit Thirty', 'Climb Month', 'Crimp', 'Sloper', 'Jug', 'Pinch Hold', 'Pocket', 'Undercling'],
    cycle: ['pull', 'back'],
    dayTypes: {
      pull: { label: 'Pull & hold', short: 'Pull', blocks: [S('Pull & hold', ['climbPull', 'climbHold', 'climbPull', 'climbHold?'])] },
      back: { label: 'Back & core', short: 'Back', blocks: [S('Back & core', ['backRow', 'backRear', 'climbBack', 'barCore?'])] },
    },
  },
  {
    id: 'climber-emom', added: 16, catalogue: 9, name: 'Climber EMOM', subject: 'Climber / pull strength', minutes: [24, 29], levers: [null, 'reps', 'reps'],
    split: 'Pull EMOM & core / hang EMOM & back', blurb: 'Climbing on the clock: pull-up EMOMs with core, hang EMOMs with back work.',
    about: 'Climbing strength on the clock. One day is a pull-up EMOM followed by core for body tension; the other a hang and lock-off EMOM followed by back and rear-shoulder work. EMOMs let you do a lot of pulling at good quality. Abs finish every session. Both later levels add reps and time.',
    names: ['Belay Clock', 'Rope Clock', 'Wall Clock', 'Crag Clock', 'Boulder Clock', 'Route Clock', 'Pitch Clock', 'Summit Clock', 'Ridge Clock', 'Ledge Clock', 'Chalk Clock', 'Send Clock'],
    cycle: ['pull', 'hang'],
    dayTypes: {
      pull: { label: 'Pull EMOM & core', short: 'Pull', blocks: [E('Pull EMOM', ['climbPull', 'climbPull', 'barCore'], { values: [8, 10, 12] }), S('Core', ['coreHollow', 'coreAnti?'])] },
      hang: { label: 'Hang EMOM & back', short: 'Hang', blocks: [E('Hang EMOM', ['climbHold', 'climbHold', 'climbPull'], { values: [8, 10, 12] }), S('Back', ['backRear', 'backRow?'])] },
    },
  },
  {
    id: 'climber-antagonist', added: 16, catalogue: 9, name: 'Climber Balance', subject: 'Climber / pull strength', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Pull & push supersets / legs & shoulders', blurb: 'Pulling strength kept in balance: pull and push supersets, then legs and shoulder health.',
    about: 'Climbers pull a lot, so this program pulls hard and balances it. One day supersets pull-ups and rows with presses and push-ups; the other trains the legs and the rotator cuff and rear shoulders. Balanced shoulders stay healthy over years of pulling. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Balance Point', 'Counterweight Climb', 'Even Keel Climb', 'Level Climb', 'Steady Climb', 'Plumb Climb', 'True Climb', 'Square Climb', 'Fair Climb', 'Poised', 'Balanced', 'Centred Climb'],
    cycle: ['pp', 'legs'],
    dayTypes: {
      pp: { label: 'Pull & push supersets', short: 'Pull-push', blocks: [SS('Pull & push', ['climbPull', 'chestPress', 'backRow', 'chestBw', 'climbBack', 'shoulderPress'])] },
      legs: { label: 'Legs & shoulders', short: 'Legs', blocks: [SS('Legs & shoulders', ['squat2', 'shoulderHealth', 'hinge2', 'backRear', 'lunge2', 'shoulderHealth'])] },
    },
  },
];

// Hand-written paragraphs for the older programs (newer ones carry theirs as `about:` in the config).
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

// Phase 23 ticket 2 (84–86, 171): a "II" of every Signature program: the same split, day types, blocks and minutes,
// built a level up (`step: 1`: its Level I is the original's Level II; its Level III adds a set where the day has room)
// at catalogue 13, so the newer exercises join. Three-Split 60 is frozen: its II starts from the look-alike its Tempo
// variation is made from, with Levels II and III adding reps as the original's do. The originals never change.
const twoOf = (c) => {
  const from = c.frozen ? { ...CONFIGS.find((x) => x.id === c.id + '-tempo'), levers: [null, 'reps', 'reps'] } : c;
  const { added, ...rest } = from; // eslint-disable-line no-unused-vars
  return {
    ...rest, id: `${c.id}-ii`, name: `${c.name} II`, added: 23, catalogue: 13, step: 1,
    blurb: `${c.name}, one level harder: every day starts where the original's Level II did, with the newer moves in the mix.`,
    // its original's first three sentences, then what the II changes: 4 sentences, as every about is 3 to 6
    about: `${(c.about.match(/[^.!?]+[.!?]+(\s|$)/g) || []).slice(0, 3).join('').trim()} This II is the same program one level up, with the newest moves in the mix, and its Level III adds a set where the day has room.`,
  };
};
const IIS = CONFIGS.filter((c) => c.subject === 'Signature').map(twoOf);
CONFIGS.push(...IIS);

// Phase 23 ticket 3 (83, 87, 184, 185, 205): Strength +10, Busy week +9, Bodyweight +10, at catalogue 13. In each
// subject half run 35–38 min, a quarter 31–35, a quarter shorter; a fifth are 30 days; gear as the subject's today.
const P23_LONG = [34.5, 38.4], P23_MID = [31, 35];
const P23_STRENGTH = [
  {
    id: 'heavy-light-medium', name: 'Heavy, Light, Medium', subject: 'Strength', minutes: P23_LONG, levers: [null, 'weight', 'tempo'],
    split: 'Heavy / light / medium', blurb: 'Three days that change the load: a heavy straight-set day, a light superset day and a medium day between.',
    about: 'Strength that comes from changing the effort across the week. The heavy day is straight sets of big lifts with long rests, the light day pairs moves in supersets with higher reps, and the medium day sits between. Abs finish every session. Level II moves you one weight up and Level III slows the lowering to three seconds.',
    names: ['Danube', 'Rhine', 'Volga', 'Nile', 'Amazon', 'Yangtze', 'Mekong', 'Indus', 'Ganges', 'Jordan', 'Tigris', 'Euphrates', 'Seine', 'Thames', 'Loire', 'Elbe', 'Oder', 'Vistula', 'Dnieper', 'Po'],
    cycle: ['heavy', 'light', 'medium'],
    dayTypes: {
      heavy: { label: 'Heavy day', short: 'Heavy', blocks: [S('Heavy lifts', ['squat2', 'chestPress', 'hinge2', 'backRow', 'total?'])] },
      light: { label: 'Light day', short: 'Light', blocks: [SS('Light pairs', ['lunge2', 'push', 'glute2', 'row2', 'shoulders2', 'triceps2'])] },
      medium: { label: 'Medium day', short: 'Medium', blocks: [S('Medium lifts', ['hinge2', 'pushLoad2', 'singleLeg', 'backBar', 'biceps2?'])] },
    },
  },
  {
    id: 'three-way-split', name: 'Three-Way Split', subject: 'Strength', minutes: P23_LONG, levers: [null, 'reps', 'weight'],
    split: 'Upper / lower / full body', blurb: 'An upper day, a lower day and a full-body day in straight sets, round and round.',
    about: 'Three days that share the work out evenly. The upper day presses and rows, the lower day squats, hinges and lunges, and the full-body day mixes both with a total-body lift. Straight sets with full rests throughout. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Oak', 'Cedar', 'Pine', 'Birch', 'Maple', 'Ash', 'Elm', 'Willow', 'Spruce', 'Larch', 'Fir', 'Beech', 'Alder', 'Cypress', 'Juniper', 'Sequoia', 'Redwood', 'Poplar', 'Linden', 'Hazel'],
    cycle: ['upper', 'lower', 'full'],
    dayTypes: {
      upper: { label: 'Upper body', short: 'Upper', blocks: [S('Upper', ['chestPress', 'backRow', 'shoulders2', 'triceps2', 'biceps2?'])] },
      lower: { label: 'Lower body', short: 'Lower', blocks: [S('Lower', ['squat2', 'hinge2', 'lunge2', 'glute2', 'calf?'])] },
      full: { label: 'Full body', short: 'Full', blocks: [S('Full body', ['total', 'push', 'row2', 'singleLeg', 'coreRot?'])] },
    },
  },
  {
    id: 'lifts-then-pairs', name: 'Lifts Then Pairs', subject: 'Strength', minutes: P23_LONG, levers: [null, 'weight', 'reps'],
    split: 'Three lifts, then supersets, A / B', blurb: 'Three heavy lifts in straight sets, then supersets of four more moves.',
    about: 'Heavy first, then volume. Each day opens with three big lifts in straight sets with full rests, then two supersets of four more moves, back to back with one rest after each pair. The two days swap the lifts and the pairs. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Tick', 'Tock', 'Pendulum', 'Escapement', 'Mainspring', 'Balance Wheel', 'Dial', 'Bezel', 'Crown', 'Chime', 'Gong', 'Hourglass', 'Sundial', 'Metronome', 'Chronograph', 'Quartz', 'Carillon', 'Bell Tower', 'Second Hand', 'Minute Hand'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Lifts & pairs A', short: 'A', blocks: [S('Lifts', ['squat2', 'pushLoad2', 'backRow']), SS('Pairs', ['total', 'row2', 'push', 'lunge2'])] },
      b: { label: 'Lifts & pairs B', short: 'B', blocks: [S('Lifts', ['hinge2', 'chestPress', 'backBar']), SS('Pairs', ['kbBallistic', 'shoulders2', 'singleLeg', 'glute2'])] },
    },
  },
  {
    id: 'superset-month', name: 'Superset Month', subject: 'Strength', days: 30, minutes: P23_LONG, levers: [null, 'reps', 'tempo'],
    split: 'Supersets A / B / C, 30 days', blurb: 'A month of full-body supersets, three days rotating, six lifts a day.',
    about: 'A month of strength done in pairs. Each day is three supersets of a lower and an upper lift, back to back with one rest after both, so six lifts fit in the session. Three days rotate, and every ten days the level steps up. Abs finish every session. Level II adds reps and Level III slows the lowering to three seconds.',
    names: ['Falcon', 'Hawk', 'Eagle', 'Osprey', 'Kestrel', 'Harrier', 'Kite', 'Buzzard', 'Condor', 'Vulture', 'Merlin', 'Hobby', 'Goshawk', 'Sparrowhawk', 'Peregrine', 'Gyrfalcon', 'Caracara', 'Owl', 'Harpy', 'Shrike'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Supersets A', short: 'A', blocks: [SS('Supersets', ['squat2', 'chestPress', 'hinge2', 'backRow', 'lunge2', 'shoulders2'])] },
      b: { label: 'Supersets B', short: 'B', blocks: [SS('Supersets', ['hinge2', 'pushLoad2', 'singleLeg', 'row2', 'glute2', 'triceps2'])] },
      c: { label: 'Supersets C', short: 'C', blocks: [SS('Supersets', ['total', 'push', 'lunge2', 'backBar', 'hipGlute', 'biceps2'])] },
    },
  },
  {
    id: 'four-movements', name: 'Four Movements', subject: 'Strength', minutes: P23_LONG, levers: [null, 'weight', 'variation'],
    split: 'Press / pull / squat / hinge', blurb: 'One movement pattern a day, four days round: press, pull, squat and hinge.',
    about: 'Every day trains one way the body moves. Press day pushes, pull day rows and pulls, squat day bends the knees and hinge day the hips, each in straight sets with the helpers that go with it. Four days rotate, so each pattern comes round again every fourth day. Abs finish every session. Level II moves you one weight up and Level III brings harder variations.',
    names: ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest', 'Zenith', 'Nadir', 'Meridian', 'Equator', 'Tropic', 'Pole', 'Bearing', 'Heading', 'Azimuth', 'Latitude', 'Longitude', 'True North'],
    cycle: ['press', 'pull', 'squat', 'hinge'],
    dayTypes: {
      press: { label: 'Press', short: 'Press', blocks: [S('Press', ['chestPress', 'pushLoad2', 'shoulders2', 'triceps2', 'push?'])] },
      pull: { label: 'Pull', short: 'Pull', blocks: [S('Pull', ['backRow', 'backBar', 'row2', 'biceps2', 'pullBar2?'])] },
      squat: { label: 'Squat', short: 'Squat', blocks: [S('Squat', ['squat2', 'lunge2', 'singleLeg', 'calf', 'glute2?'])] },
      hinge: { label: 'Hinge', short: 'Hinge', blocks: [S('Hinge', ['hinge2', 'glute2', 'hipGlute', 'total', 'coreRot?'])] },
    },
  },
  {
    id: 'push-pull-pairs', name: 'Push-Pull Pairs', subject: 'Strength', minutes: P23_MID, levers: [null, 'weight', 'reps'],
    split: 'Push-pull supersets / legs in straight sets', blurb: 'An upper day of push-pull supersets, then a leg day of straight sets.',
    about: 'Two days that train differently. The upper day pairs every press with a row or pull in supersets, so one side rests while the other works; the leg day is straight sets of squats, hinges, lunges and glute work with full rests. They alternate. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Piston', 'Cog', 'Crank', 'Flywheel', 'Camshaft', 'Gearbox', 'Sprocket', 'Axle', 'Ratchet Wheel', 'Lever', 'Pulley', 'Winch', 'Turbine', 'Rotor', 'Shaft', 'Spindle', 'Valve', 'Governor', 'Dynamo', 'Bellcrank'],
    cycle: ['upper', 'legs'],
    dayTypes: {
      upper: { label: 'Push-pull pairs', short: 'Upper', blocks: [SS('Push-pull pairs', ['chestPress', 'backRow', 'pushLoad2', 'row2', 'shoulders2', 'backBar'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2', 'glute2'])] },
    },
  },
  {
    id: 'big-three-month', name: 'Big Three Month', subject: 'Strength', days: 30, minutes: P23_MID, levers: [null, 'reps', 'variation'],
    split: 'Squat day / bench day / deadlift day, 30 days', blurb: 'A month built round the three big lifts, one leading each day.',
    about: 'A month built round the squat, the bench press and the deadlift. Each day one of them leads, with three helpers in straight sets: legs and a row after the squat, presses and triceps after the bench, glutes and back after the deadlift. Every ten days the level steps up. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Rung', 'Step', 'Landing', 'Stair', 'Riser', 'Tread', 'Flight', 'Banister', 'Newel', 'Stile', 'Scaffold', 'Gantry', 'Catwalk', 'Ramp', 'Terrace', 'Ledge', 'Summit', 'Crest', 'Ridge', 'Peak'],
    cycle: ['squat', 'bench', 'dead'],
    dayTypes: {
      squat: { label: 'Squat day', short: 'Squat', blocks: [S('Squat day', ['squat2', 'lunge2', 'backRow', 'calf?'])] },
      bench: { label: 'Bench day', short: 'Bench', blocks: [S('Bench day', ['chestPress', 'pushLoad2', 'triceps2', 'row2?'])] },
      dead: { label: 'Deadlift day', short: 'Deadlift', blocks: [S('Deadlift day', ['hinge2', 'glute2', 'backBar', 'biceps2?'])] },
    },
  },
  {
    id: 'density-supersets', name: 'Density Supersets', subject: 'Strength', minutes: P23_MID, levers: [null, 'tempo', 'weight'],
    split: 'Upper density / lower density', blurb: 'Six lifts in three supersets, upper and lower days, more work in the same half hour.',
    about: 'More work packed into the same time. Each day is three supersets, two lifts back to back with one rest after both, so the half hour holds six exercises. Upper and lower days alternate. Abs finish every session. Level II slows the lowering to three seconds and Level III moves you one weight up.',
    names: ['Granite', 'Basalt', 'Marble', 'Slate', 'Flint', 'Quartzite', 'Obsidian', 'Gneiss', 'Schist', 'Limestone', 'Sandstone', 'Shale', 'Jasper', 'Onyx', 'Agate', 'Feldspar', 'Pumice', 'Gabbro', 'Diorite', 'Dolomite'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper density', short: 'Upper', blocks: [SS('Upper supersets', ['chestPress', 'backRow', 'pushLoad2', 'row2', 'triceps2', 'biceps2'])] },
      lower: { label: 'Lower density', short: 'Lower', blocks: [SS('Lower supersets', ['squat2', 'hinge2', 'lunge2', 'glute2', 'singleLeg', 'calf'])] },
    },
  },
  {
    id: 'strength-express', name: 'Strength Express', subject: 'Strength', minutes: [26, 31], levers: [null, 'weight', 'reps'],
    split: 'Three lifts and one superset, A / B', blurb: 'Three lifts in straight sets and one closing superset, under half an hour.',
    about: 'Strength for the days with less time. Three lifts in straight sets come first, a squat or hinge, a press and a row, then one superset of two more moves to finish. Two days alternate. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Cheetah', 'Pronghorn', 'Springbok', 'Gazelle', 'Hare', 'Greyhound', 'Swift', 'Sailfish', 'Marlin', 'Mako', 'Ostrich', 'Impala', 'Jackrabbit', 'Wildebeest', 'Quarter Horse', 'Lion', 'Coyote', 'Zebra', 'Elk', 'Antelope'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Lifts & pair A', short: 'A', blocks: [S('Lifts', ['squat2', 'chestPress', 'row2']), SS('Closing pair', ['total', 'coreRot'])] },
      b: { label: 'Lifts & pair B', short: 'B', blocks: [S('Lifts', ['hinge2', 'pushLoad2', 'backRow']), SS('Closing pair', ['glute2', 'push'])] },
    },
  },
  {
    id: 'short-supersets', name: 'Short Supersets', subject: 'Strength', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Upper pairs / lower pairs / full-body pairs', blurb: 'Two supersets a day, upper, lower or full body, in under half an hour.',
    about: 'Short sessions of paired lifts. Each day is two supersets, two moves back to back with one rest after both: presses and rows on the upper day, squats and hinges on the lower, a mix on the full-body day. Three days rotate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Thunder', 'Lightning', 'Squall', 'Gale', 'Tempest', 'Cyclone', 'Monsoon', 'Typhoon', 'Blizzard', 'Hail', 'Sleet', 'Downpour', 'Whirlwind', 'Tornado', 'Sirocco', 'Mistral', 'Chinook', 'Bora', 'Haboob', 'Derecho'],
    cycle: ['upper', 'lower', 'full'],
    dayTypes: {
      upper: { label: 'Upper pairs', short: 'Upper', blocks: [SS('Upper pairs', ['chestPress', 'backRow', 'shoulders2', 'row2'])] },
      lower: { label: 'Lower pairs', short: 'Lower', blocks: [SS('Lower pairs', ['squat2', 'hinge2', 'lunge2', 'glute2'])] },
      full: { label: 'Full-body pairs', short: 'Full', blocks: [SS('Full-body pairs', ['total', 'push', 'singleLeg', 'backBar'])] },
    },
  },
];
const P23_BUSY = [
  {
    id: 'catch-up-full-body', name: 'Catch-Up Full Body', subject: 'Busy week', minutes: P23_LONG, levers: [null, 'reps', 'weight'],
    split: 'Full-body catch-up A / B', blurb: 'One longer full-body session for the day you finally get, supersets then a circuit.',
    about: 'For the week when one session is all you get, so it covers everything. Strength supersets come first, a lower and an upper lift back to back, then a circuit of four more moves. Two days alternate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekday', 'Weekend', 'Midweek', 'Payday', 'Deadline', 'Overtime', 'Inbox Zero', 'Clock Out', 'Last Train', 'Night Shift', 'Early Bird', 'Day Off', 'Long Weekend'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Catch-up A', short: 'A', blocks: [SS('Supersets', ['squat2', 'chestPress', 'hinge2', 'backRow']), C('Circuit', ['lunge2', 'push', 'row2', 'coreRot'], { values: [2, 3] })] },
      b: { label: 'Catch-up B', short: 'B', blocks: [SS('Supersets', ['hinge2', 'pushLoad2', 'singleLeg', 'row2']), C('Circuit', ['total', 'shoulders2', 'glute2', 'hiit'], { values: [2, 3] })] },
    },
  },
  {
    id: 'sunday-session', name: 'Sunday Session', subject: 'Busy week', days: 30, minutes: P23_LONG, levers: [null, 'weight', 'reps'],
    split: 'Lifts, then a long AMRAP, A / B, 30 days', blurb: 'A month of one long session at a time: four lifts, then an AMRAP to finish.',
    about: 'A month of sessions for whichever day has the time. Four lifts in straight sets come first, then an AMRAP of four moves, as many rounds as you can. Two days alternate, and every ten days the level steps up. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Pancake', 'Waffle', 'Omelette', 'Croissant', 'Bagel', 'Porridge', 'Brioche', 'Muffin', 'Scone', 'Crumpet', 'Granola', 'Frittata', 'Shakshuka', 'Toast', 'Benedict', 'Hash Brown', 'Kipper', 'Crepe', 'Danish', 'Brunch'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Lifts & AMRAP A', short: 'A', blocks: [S('Lifts', ['squat2', 'chestPress', 'backRow', 'hinge2']), A('AMRAP', ['total', 'push', 'lunge2', 'coreRot'], { values: [6, 8, 10] })] },
      b: { label: 'Lifts & AMRAP B', short: 'B', blocks: [S('Lifts', ['hinge2', 'pushLoad2', 'row2', 'singleLeg']), A('AMRAP', ['hiit', 'shoulders2', 'glute2', 'core2'], { values: [6, 8, 10] })] },
    },
  },
  {
    id: 'double-emom', name: 'Double EMOM', subject: 'Busy week', minutes: P23_LONG, levers: [null, 'reps', 'variation'],
    split: 'Two EMOMs a day, A / B', blurb: 'Two EMOMs back to back: the clock plans the session, you just start it.',
    about: 'No rests to plan and no list to remember. Each day is two EMOMs of four moves, a set at the top of every minute, the first leaning on legs and pushing, the second on hinges and pulling. Two days alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Double Shift', 'Back to Back', 'Twin Peaks', 'Second Wind', 'Encore', 'Reprise', 'Double Take', 'Two-Step', 'Tandem', 'Duet', 'Pair Up', 'Double Time', 'Rerun', 'Repeat', 'Echo', 'Mirror', 'Twin Engine', 'Double Header', 'Overlap', 'Relay'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Double EMOM A', short: 'A', blocks: [E('EMOM 1', ['squat2', 'push', 'row2', 'total'], { values: [8, 10, 12] }), E('EMOM 2', ['hinge2', 'shoulders2', 'lunge2', 'hiit'], { values: [8, 10, 12] })] },
      b: { label: 'Double EMOM B', short: 'B', blocks: [E('EMOM 1', ['lunge2', 'chestPress', 'backRow', 'kbBallistic'], { values: [8, 10, 12] }), E('EMOM 2', ['singleLeg', 'pushLoad2', 'glute2', 'coreRot'], { values: [8, 10, 12] })] },
    },
  },
  {
    id: 'long-ladder', name: 'Long Ladder', subject: 'Busy week', minutes: P23_LONG, levers: [null, 'reps', 'tempo'],
    split: 'Three ladders a day, A / B', blurb: 'Three rep ladders, each two moves, for one long session that climbs.',
    about: 'One long session built from ladders. Each ladder is two moves: one rep of each, then two, then three, as high as you can climb before the time runs out, three ladders a day. Two days alternate the pairs. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['First Floor', 'Second Floor', 'Third Floor', 'Mezzanine', 'Penthouse', 'Rooftop', 'Basement', 'Lobby', 'Atrium', 'Stairwell', 'Elevator', 'Landing Pad', 'Fire Escape', 'Skylight', 'Attic', 'Veranda', 'Loft', 'Tower', 'Spire', 'Observation Deck'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladders A', short: 'A', blocks: [L('Ladder 1', ['push', 'squat2']), L('Ladder 2', ['row2', 'hinge2']), L('Ladder 3', ['shoulders2', 'lunge2'])] },
      b: { label: 'Ladders B', short: 'B', blocks: [L('Ladder 1', ['chestPress', 'lunge2']), L('Ladder 2', ['backRow', 'glute2']), L('Ladder 3', ['total', 'coreRot'])] },
    },
  },
  {
    id: 'bell-weekend', name: 'Bell Weekend', subject: 'Busy week', minutes: P23_LONG, equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Long bell circuit / long bell EMOM', blurb: 'One kettlebell and one longer session: a bell circuit one day, a bell EMOM the next.',
    about: 'One kettlebell and the one longer session the week allows. One day is a circuit of swings, squats, presses and core work, round after round; the other is an EMOM of the same kind of moves. Nothing else needed. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Saturday Bell', 'Sunday Bell', 'Church Bell', 'Cowbell', 'Sleigh Bell', 'Doorbell', 'Bicycle Bell', 'School Bell', 'Ship Bell', 'Dinner Bell', 'Hand Bell', 'Jingle', 'Toll', 'Peal', 'Ring', 'Clang', 'Knell', 'Carol', 'Chime Out', 'Bell Lap'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Bell circuit', short: 'Circuit', blocks: [C('Bell circuit', ['kbLower2', 'kbUpper2', 'kbBallistic', 'kbCore2', 'kbSwing'], { values: [3, 4, 5, 6] })] },
      emom: { label: 'Bell EMOM', short: 'EMOM', blocks: [E('Bell EMOM', ['kbBallistic', 'kbLower2', 'kbUpper2', 'kbCore2'], { values: [20, 24, 28] })] },
    },
  },
  {
    id: 'half-hour-plus', name: 'Half Hour Plus', subject: 'Busy week', days: 30, minutes: P23_MID, levers: [null, 'reps', 'reps'],
    split: 'Upper EMOM / lower AMRAP, 30 days', blurb: 'A month of half-hour sessions: an upper-body EMOM one day, a lower-body AMRAP the next.',
    about: 'A month of sessions a little over half an hour. The upper day is an EMOM of pressing and pulling, a set at the top of every minute; the lower day is an AMRAP of squats, hinges and lunges, as many rounds as you can. Every ten days the level steps up. Abs finish every session. Both later levels add reps.',
    names: ['Half Past', 'Quarter To', 'Quarter Past', 'On the Hour', 'Noon', 'Midnight', 'Dawn', 'Dusk', 'Teatime', 'Lunch Hour', 'Peak Hour', 'Happy Hour', 'Golden Hour', 'Blue Hour', 'Witching Hour', 'High Noon', 'Small Hours', 'Eleventh Hour', 'Zero Hour', 'Prime Time'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper EMOM', short: 'Upper', blocks: [E('Upper EMOM', ['chestPress', 'backRow', 'shoulders2', 'triceps2'], { values: [14, 16, 18, 20] })] },
      lower: { label: 'Lower AMRAP', short: 'Lower', blocks: [A('Lower AMRAP', ['squat2', 'hinge2', 'lunge2', 'glute2'], { values: [12, 14, 16, 18] })] },
    },
  },
  {
    id: 'tabata-thirty', name: 'Tabata Thirty', subject: 'Busy week', minutes: P23_MID, levers: [null, 'reps', 'tempo'], absSlots: ['absW', 'abs?'],
    split: 'Supersets and two Tabatas, A / B', blurb: 'Strength supersets, then two Tabatas, in a little over half an hour.',
    about: 'Strength and sweat in one go. Two supersets of a lower and an upper lift come first, then two Tabatas, twenty seconds hard and ten seconds rest, eight times each. Two days alternate. Abs finish every session. Level II adds reps and Level III slows the lowering to three seconds.',
    names: ['Burst', 'Surge', 'Spike', 'Jolt', 'Kick', 'Rally', 'Push On', 'Fire Up', 'Spark', 'Flare', 'Ignite', 'Blaze', 'Torch', 'Kindle', 'Ember', 'Afterburn', 'Overdrive', 'Turbo', 'Boost', 'Sprint Plus'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Supersets & Tabatas A', short: 'A', blocks: [SS('Supersets', ['squat2', 'chestPress', 'hinge2', 'backRow'], { values: [2, 3, 4] }), T('Tabata 1', ['hiit', 'push'], { values: [1] }), T('Tabata 2', ['total', 'coreRot'], { values: [1] })] },
      b: { label: 'Supersets & Tabatas B', short: 'B', blocks: [SS('Supersets', ['lunge2', 'pushLoad2', 'glute2', 'row2'], { values: [2, 3, 4] }), T('Tabata 1', ['hiit', 'lunge2'], { values: [1] }), T('Tabata 2', ['kbBallistic', 'core2'], { values: [1] })] },
    },
  },
  {
    id: 'twenty-pairs', name: 'Twenty Pairs', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'weight', 'tempo'], absSlots: ['absW', 'abs?'],
    split: 'Antagonist pairs, upper / lower, 20 minutes', blurb: 'Twenty minutes of opposing pairs: press with row, squat with hinge.',
    about: 'Twenty minutes, nothing wasted. Each superset pairs muscles that work against each other, a press with a row on the upper day, a squat with a hinge on the lower, so one side rests while the other works. Two days alternate. Abs finish every session. Level II moves you one weight up and Level III slows the lowering to three seconds.',
    names: ['Ace', 'King', 'Queen', 'Jack', 'Joker', 'Deuce', 'Trey', 'Flush', 'Straight', 'Full House', 'Royal', 'Spade', 'Heart', 'Club', 'Diamond', 'Trump', 'Wild Card', 'Shuffle', 'Deal', 'Showdown'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper pairs', short: 'Upper', blocks: [SS('Upper pairs', ['chestPress', 'backRow', 'shoulders2', 'row2'], { values: [2, 3, 4] })] },
      lower: { label: 'Lower pairs', short: 'Lower', blocks: [SS('Lower pairs', ['squat2', 'hinge2', 'lunge2', 'glute2'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'twenty-circuit-plus', name: 'Twenty Circuit Plus', subject: 'Busy week', minutes: [18.5, 21.4], levers: [null, 'variation', 'reps'], absSlots: ['abs'],
    split: 'Full-body circuit A / B / C, 20 minutes', blurb: 'Three twenty-minute circuits rotating, four full-body moves a round.',
    about: 'A full-body circuit in twenty minutes. Each day is four moves back to back, a leg move, a press or a pull and a core or conditioning move, then round again. Three circuits rotate. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Loop', 'Lap', 'Orbit', 'Circle', 'Round', 'Ring Road', 'Roundabout', 'Beltway', 'Circuit Breaker', 'Racetrack', 'Velodrome', 'Carousel', 'Spiral', 'Whorl', 'Vortex', 'Eddy', 'Cycle', 'Wheel', 'Hoop', 'Halo'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Circuit', ['squat2', 'push', 'row2', 'coreRot'], { values: [2, 3, 4] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Circuit', ['hinge2', 'pushLoad2', 'backRow', 'hiit'], { values: [2, 3, 4] })] },
      c: { label: 'Circuit C', short: 'C', blocks: [C('Circuit', ['lunge2', 'shoulders2', 'total', 'glute2'], { values: [2, 3, 4] })] },
    },
  },
];
const P23_BW = [
  {
    id: 'bodyweight-long-haul', name: 'Bodyweight Long Haul', subject: 'Bodyweight', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Push / legs / pull & core, no gear', blurb: 'Longer bodyweight days in straight sets: push, legs, then pull and core.',
    about: 'No equipment and enough time to do it properly. Three days rotate in straight sets: push-ups and dips, then squats, lunges and glute work, then floor pulls and core. Each has five moves, so every muscle gets its volume without a single weight. Abs finish every session. Level II adds reps and Level III slows the lowering to three seconds.',
    names: ['Trailhead', 'Switchback', 'Ridgeline', 'Saddle', 'Col', 'Scree', 'Cairn', 'Bivouac', 'Basecamp', 'Traverse', 'Couloir', 'Moraine', 'Glacier', 'Tarn', 'Cirque', 'Arete', 'Gully', 'Bluff', 'Mesa', 'Butte'],
    cycle: ['push', 'legs', 'pull'],
    dayTypes: {
      push: { label: 'Push', short: 'Push', blocks: [S('Push', ['chestBw', 'pushBw2', 'shoulderBw', 'armsBw', 'chestBw?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['legsBw2', 'singleLeg', 'thrustBw', 'calfBw', 'adductorBw?'])] },
      pull: { label: 'Pull & core', short: 'Pull', blocks: [S('Pull & core', ['backBw', 'pullBw', 'coreRot', 'coreHollow', 'backBw?'])] },
    },
  },
  {
    id: 'calisthenics-volume', name: 'Calisthenics Volume', subject: 'Bodyweight', days: 30, minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Upper volume / lower volume, 30 days, no gear', blurb: 'A month of bodyweight supersets, three pairs a day, for more volume without weights.',
    about: 'A month of bodyweight volume. Each day is three supersets, two moves back to back with one rest after both, upper body one day and lower the next. Every ten days the level steps up. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Bar Star', 'Park Bench', 'Playground', 'Jungle Gym', 'Monkey Bars', 'Rings', 'Parallettes', 'Dip Station', 'Wall', 'Stoop', 'Railing', 'Step Up', 'Bollard', 'Lamp Post', 'Tree Branch', 'Fence', 'Picnic Table', 'Low Wall', 'Curb', 'Bleachers'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper volume', short: 'Upper', blocks: [SS('Upper supersets', ['chestBw', 'backBw', 'pushBw2', 'pullBw', 'armsBw', 'shoulderBw'])] },
      lower: { label: 'Lower volume', short: 'Lower', blocks: [SS('Lower supersets', ['legsBw2', 'thrustBw', 'singleLeg', 'adductorBw', 'calfBw', 'coreRot'])] },
    },
  },
  {
    id: 'floor-marathon', name: 'Floor Marathon', subject: 'Bodyweight', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Two long circuits a day, A / B, no gear', blurb: 'Two long bodyweight circuits a day, for stamina as much as strength.',
    about: 'A long session on the floor, no gear at all. Each day is two circuits, the first of push, legs, pull and core, the second of single-leg work, glutes and conditioning, round after round. Two days alternate. Abs finish every session. Both later levels add reps.',
    names: ['Boston', 'Berlin', 'London', 'Tokyo', 'Chicago', 'New York', 'Paris', 'Rome', 'Athens', 'Vienna', 'Prague', 'Lisbon', 'Seoul', 'Sydney', 'Valencia', 'Amsterdam', 'Dublin', 'Oslo', 'Stockholm', 'Copenhagen'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuits A', short: 'A', blocks: [C('Circuit 1', ['chestBw', 'legsBw2', 'backBw', 'coreRot'], { values: [2, 3, 4] }), C('Circuit 2', ['pushBw2', 'singleLeg', 'thrustBw', 'hiit'], { values: [2, 3, 4] })] },
      b: { label: 'Circuits B', short: 'B', blocks: [C('Circuit 1', ['pushBw2', 'legsBw2', 'pullBw', 'coreHollow'], { values: [2, 3, 4] }), C('Circuit 2', ['chestBw', 'adductorBw', 'calfBw', 'plyoLow'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'long-amrap', name: 'Long AMRAP', subject: 'Bodyweight', minutes: P23_LONG, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'One long AMRAP a day, A / B / C, no gear', blurb: 'One long bodyweight AMRAP a day: as many rounds as you can, nothing but the floor.',
    about: 'One long effort and no equipment. Each day is a single AMRAP of four bodyweight moves, as many rounds as you can before the time is up. Three days rotate the moves. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Largo', 'Lento', 'Adagio', 'Andante', 'Moderato', 'Allegretto', 'Allegro', 'Vivace', 'Presto', 'Prestissimo', 'Rubato', 'Ritardando', 'Accelerando', 'Fermata', 'Staccato', 'Legato', 'Crescendo', 'Forte', 'Piano', 'Coda'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'AMRAP A', short: 'A', blocks: [A('AMRAP', ['chestBw', 'legsBw2', 'backBw', 'coreRot'], { values: [22, 24, 26, 28] })] },
      b: { label: 'AMRAP B', short: 'B', blocks: [A('AMRAP', ['pushBw2', 'singleLeg', 'pullBw', 'hiit'], { values: [22, 24, 26, 28] })] },
      c: { label: 'AMRAP C', short: 'C', blocks: [A('AMRAP', ['armsBw', 'thrustBw', 'shoulderBw', 'coreHollow'], { values: [22, 24, 26, 28] })] },
    },
  },
  {
    id: 'circuit-and-amrap', name: 'Circuit and AMRAP', subject: 'Bodyweight', minutes: P23_LONG, equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'A circuit, then an AMRAP, A / B, no gear', blurb: 'A bodyweight strength circuit, then an AMRAP to empty the tank.',
    about: 'Build, then empty the tank. Each day starts with a circuit of four bodyweight strength moves, round after round with a short rest, and ends with an AMRAP of three more, as many rounds as you can. Two days alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Swell', 'Breaker', 'Crest Line', 'Trough', 'Undertow', 'Riptide', 'Tide', 'Surf', 'Foam', 'Spray', 'Rollers', 'Groundswell', 'Whitecap', 'Ripple', 'Wake', 'Backwash', 'Shorebreak', 'Point Break', 'Reef Break', 'Set Wave'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit & AMRAP A', short: 'A', blocks: [C('Circuit', ['pushBw2', 'legsBw2', 'backBw', 'thrustBw'], { values: [2, 3, 4] }), A('AMRAP', ['hiit', 'coreRot', 'chestBw'], { values: [6, 8, 10] })] },
      b: { label: 'Circuit & AMRAP B', short: 'B', blocks: [C('Circuit', ['chestBw', 'singleLeg', 'pullBw', 'adductorBw'], { values: [2, 3, 4] }), A('AMRAP', ['plyoLow', 'core2', 'armsBw'], { values: [6, 8, 10] })] },
    },
  },
  {
    id: 'no-gear-thirty', name: 'No-Gear Thirty', subject: 'Bodyweight', days: 30, minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'tempo'],
    split: 'Push & pull / legs & glutes, 30 days, no gear', blurb: 'A month of bodyweight strength in straight sets, upper and lower days.',
    about: 'A month of strength with nothing but the floor. Straight sets of push-ups and floor pulls one day, squats, lunges and glute bridges the next. Every ten days the level steps up. Abs finish every session. Level II brings harder variations and Level III slows the lowering to three seconds.',
    names: ['Grit', 'Spine', 'Backbone', 'Sinew', 'Tendon', 'Marrow', 'Knuckle', 'Fist', 'Grip', 'Stance', 'Brace', 'Anchor', 'Pillar', 'Column', 'Beam', 'Joist', 'Rafter', 'Truss', 'Keystone', 'Lintel'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Push & pull', short: 'Upper', blocks: [S('Push & pull', ['chestBw', 'backBw', 'pushBw2', 'pullBw', 'armsBw?'])] },
      lower: { label: 'Legs & glutes', short: 'Lower', blocks: [S('Legs & glutes', ['legsBw2', 'singleLeg', 'thrustBw', 'adductorBw', 'calfBw?'])] },
    },
  },
  {
    id: 'pairs-and-amrap', name: 'Pairs and AMRAP', subject: 'Bodyweight', minutes: P23_MID, equip: 'bw', levers: [null, 'reps', 'tempo'],
    split: 'Supersets, then a short AMRAP, A / B, no gear', blurb: 'Bodyweight supersets, then a short AMRAP, for strength and a sweat without gear.',
    about: 'Strength first, then the sweat. Two bodyweight supersets of a push or pull with a leg move come first, then a short AMRAP of two moves, as many rounds as you can. Two days alternate. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Firecracker', 'Sparkler', 'Rocket', 'Roman Candle', 'Catherine Wheel', 'Fountain', 'Comet', 'Meteor', 'Shooting Star', 'Starburst', 'Flash Bang', 'Pinwheel', 'Bottle Rocket', 'Fuse', 'Fizz', 'Crackle', 'Pop', 'Bang', 'Whizz', 'Zip'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Pairs & AMRAP A', short: 'A', blocks: [SS('Supersets', ['chestBw', 'legsBw2', 'backBw', 'thrustBw']), A('AMRAP', ['hiit', 'coreRot'], { values: [4, 5, 6] })] },
      b: { label: 'Pairs & AMRAP B', short: 'B', blocks: [SS('Supersets', ['pushBw2', 'singleLeg', 'pullBw', 'adductorBw']), A('AMRAP', ['plyoLow', 'core2'], { values: [4, 5, 6] })] },
    },
  },
  {
    id: 'core-and-limbs', name: 'Core and Limbs', subject: 'Bodyweight', minutes: P23_MID, equip: 'bw', levers: [null, 'variation', 'reps'],
    split: 'Upper & core / lower & core, no gear', blurb: 'Bodyweight straight sets for the arms or legs, then a core circuit every day.',
    about: 'Limbs first, then the middle. Each day opens with three bodyweight moves in straight sets, upper body one day and lower the next, then a circuit of core work: rotation, hollow holds and anti-extension. Two days alternate. Abs finish every session. Level II brings harder variations and Level III adds reps.',
    names: ['Trunk', 'Limb', 'Bough', 'Root', 'Stem', 'Branch', 'Twig', 'Leaf', 'Bark', 'Sap', 'Treetop', 'Canopy', 'Sapling', 'Acorn', 'Seed', 'Bud', 'Shoot', 'Thicket', 'Grove', 'Copse'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & core', short: 'Upper', blocks: [S('Upper', ['chestBw', 'backBw', 'pushBw2']), C('Core circuit', ['coreRot', 'coreHollow', 'coreAnti'], { values: [2, 3] })] },
      lower: { label: 'Lower & core', short: 'Lower', blocks: [S('Lower', ['legsBw2', 'singleLeg', 'thrustBw']), C('Core circuit', ['core2', 'coreRot', 'calfBw'], { values: [2, 3] })] },
    },
  },
  {
    id: 'circuit-25', name: 'Circuit 25', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Push-pull circuit / legs circuit, 25 minutes, no gear', blurb: 'Twenty-five minutes of bodyweight circuits, upper one day and legs the next.',
    about: 'A short circuit session, no equipment. The upper day goes round a push, a floor pull, a second push and a core move; the leg day round squats, single-leg work, glutes and conditioning. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Ping', 'Pong', 'Blip', 'Beep', 'Pulse', 'Signal', 'Beacon', 'Radar', 'Sonar', 'Morse', 'Ticker', 'Buzz', 'Click', 'Chirp', 'Tap', 'Knock', 'Ping Back', 'Relay Point', 'Flash Point', 'Checkpoint'],
    cycle: ['upper', 'legs'],
    dayTypes: {
      upper: { label: 'Push-pull circuit', short: 'Upper', blocks: [C('Push-pull circuit', ['chestBw', 'backBw', 'pushBw2', 'coreRot'], { values: [2, 3, 4] })] },
      legs: { label: 'Legs circuit', short: 'Legs', blocks: [C('Legs circuit', ['legsBw2', 'singleLeg', 'thrustBw', 'hiit'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'quick-calisthenics', name: 'Quick Calisthenics', subject: 'Bodyweight', minutes: [23, 27], equip: 'bw', levers: [null, 'variation', 'variation'],
    split: 'Push & legs / pull & core, 25 minutes', blurb: 'Short bodyweight supersets that move to harder variations as you level up.',
    about: 'Calisthenics that fit in twenty-five minutes. Two supersets a day, a push with a leg move one day, a floor pull with core work the next. The point is progress in the moves themselves, not more reps. Abs finish every session. Both later levels bring harder variations.',
    names: ['Flick', 'Snap', 'Pop Up', 'Hop', 'Skip', 'Jump', 'Bound', 'Leap', 'Spring', 'Bounce', 'Vault', 'Dart', 'Zoom', 'Whip', 'Swish', 'Dash Off', 'Scoot', 'Nip', 'Zing', 'Quickstep'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Push & legs', short: 'A', blocks: [SS('Supersets', ['pushBw2', 'legsBw2', 'chestBw', 'singleLeg'])] },
      b: { label: 'Pull & core', short: 'B', blocks: [SS('Supersets', ['backBw', 'coreRot', 'pullBw', 'coreHollow'])] },
    },
  },
];
const P23_T3 = [...P23_STRENGTH, ...P23_BUSY, ...P23_BW].map((c) => ({ ...c, added: 23, catalogue: 13 }));
CONFIGS.push(...P23_T3);

// Phase 23 ticket 4: Kettlebell only +9, Kettlebell complexes +5, Pull-ups +8, Climber / pull strength +4, by ticket 3's rules.
const P23_KB = [
  {
    id: 'long-bell-strength', name: 'Long Bell Strength', subject: 'Kettlebell only', minutes: P23_LONG, equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Bell squat & press / bell hinge & swing / bell full body', blurb: 'Longer one-bell days in straight sets: squat and press, hinge and swing, then full body.',
    about: 'One kettlebell and the time to use it properly. Three days rotate in straight sets: squats and presses, then hinges and swings, then a full-body day. Five moves a day, all with the same bell. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Anvil Bell', 'Iron Bell', 'Cast Bell', 'Black Bell', 'Cannonball', 'Shot Put', 'Kettle', 'Cauldron', 'Crucible Pot', 'Dutch Oven', 'Skillet', 'Pot Belly', 'Boiler', 'Steam Drum', 'Ballast', 'Counterweight', 'Plumb Bob', 'Sinker', 'Anchor Weight', 'Deadweight'],
    cycle: ['squat', 'hinge', 'full'],
    dayTypes: {
      squat: { label: 'Squat & press', short: 'Squat', blocks: [S('Squat & press', ['kbLower2', 'kbUpper2', 'kbLower', 'kbUpper2', 'kbCore2?'])] },
      hinge: { label: 'Hinge & swing', short: 'Hinge', blocks: [S('Hinge & swing', ['kbBallistic', 'kbUpper2', 'kbLower2', 'kbCore2', 'kbSwing?'])] },
      full: { label: 'Full body', short: 'Full', blocks: [S('Full body', ['kbAll', 'kbUpper2', 'kbLower2', 'kbCore2', 'kbAll?'])] },
    },
  },
  {
    id: 'bell-circuit-month', name: 'Bell Circuit Month', subject: 'Kettlebell only', days: 30, minutes: P23_LONG, equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Two bell circuits a day, A / B, 30 days', blurb: 'A month of two one-bell circuits a day, round after round.',
    about: 'A month of circuits with one kettlebell. Each day is two circuits of four moves, swings and squats, presses and core work, round after round with a short breather. Two days alternate, and every ten days the level steps up. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Orbit Ring', 'Ferris Wheel', 'Merry-Go-Round', 'Whirligig', 'Spinning Top', 'Gyroscope', 'Centrifuge', 'Turntable', 'Lazy Susan', 'Revolving Door', 'Water Wheel', 'Windmill Sail', 'Paddle Wheel', 'Treadwheel', 'Hamster Wheel', 'Big Wheel', 'Cartwheel', 'Catherine Ring', 'Roulette', 'Rotunda'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bell circuits A', short: 'A', blocks: [C('Circuit 1', ['kbBallistic', 'kbLower2', 'kbUpper2', 'kbCore2'], { values: [2, 3, 4] }), C('Circuit 2', ['kbSwing', 'kbLower', 'kbUpper2', 'kbAll'], { values: [2, 3, 4] })] },
      b: { label: 'Bell circuits B', short: 'B', blocks: [C('Circuit 1', ['kbAll', 'kbUpper2', 'kbLower2', 'kbCore2'], { values: [2, 3, 4] }), C('Circuit 2', ['kbBallistic', 'kbUpper', 'kbLower', 'kbCore2'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'bell-lifts-emom', name: 'Bell Lifts and EMOM', subject: 'Kettlebell only', minutes: P23_LONG, equip: 'kb', levers: [null, 'weight', 'tempo'],
    split: 'Bell lifts, then a bell EMOM, A / B', blurb: 'Three bell lifts in straight sets, then a bell EMOM to the end.',
    about: 'Strength first, then the clock. Each day opens with three kettlebell lifts in straight sets, then an EMOM of four more bell moves, a set at the top of every minute. Two days alternate. Abs finish every session. Level II asks for a heavier bell and Level III slows the lowering to three seconds.',
    names: ['Morning Bell', 'Noon Bell', 'Evening Bell', 'Vespers', 'Matins', 'Angelus', 'Curfew', 'Reveille', 'Last Post', 'Taps', 'Muster', 'Roll Call', 'Watch Bell', 'Dog Watch', 'Middle Watch', 'Forenoon', 'First Watch', 'Eight Bells', 'Two Bells', 'Six Bells'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Lifts & EMOM A', short: 'A', blocks: [S('Bell lifts', ['kbLower2', 'kbUpper2', 'kbLower']), E('Bell EMOM', ['kbBallistic', 'kbUpper2', 'kbCore2', 'kbLower2'], { values: [10, 12, 14] })] },
      b: { label: 'Lifts & EMOM B', short: 'B', blocks: [S('Bell lifts', ['kbBallistic', 'kbUpper2', 'kbLower2']), E('Bell EMOM', ['kbSwing', 'kbUpper', 'kbAll', 'kbCore2'], { values: [10, 12, 14] })] },
    },
  },
  {
    id: 'bell-push-pull-legs', name: 'Bell Push Pull Legs', subject: 'Kettlebell only', minutes: P23_LONG, equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Bell push / bell pull / bell legs', blurb: 'Push, pull and legs with a single kettlebell, in straight sets.',
    about: 'The classic three-day split with one kettlebell. Push day presses, pull day rows and pulls, legs day squats, lunges and swings, each in straight sets with core work along the way. Three days rotate. Abs finish every session. Level II adds reps and Level III slows the lowering to three seconds.',
    names: ['Tin', 'Copper', 'Bronze', 'Brass', 'Pewter', 'Nickel', 'Zinc', 'Cobalt', 'Chrome', 'Tungsten', 'Titanium', 'Platinum', 'Silver', 'Gold', 'Lead', 'Bismuth', 'Manganese', 'Vanadium', 'Iridium', 'Osmium'],
    cycle: ['push', 'pull', 'legs'],
    dayTypes: {
      push: { label: 'Bell push', short: 'Push', blocks: [S('Push', ['kbUpper2', 'kbUpper', 'kbUpper2', 'kbCore2', 'kbAll?'])] },
      pull: { label: 'Bell pull', short: 'Pull', blocks: [S('Pull', ['kbUpper2', 'kbAll', 'kbUpper2', 'kbCore2', 'kbUpper?'])] },
      legs: { label: 'Bell legs', short: 'Legs', blocks: [S('Legs', ['kbLower2', 'kbLower', 'kbBallistic', 'kbLower2', 'kbSwing?'])] },
    },
  },
  {
    id: 'bell-emom-trio', name: 'Bell EMOM Trio', subject: 'Kettlebell only', minutes: P23_LONG, equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Three-move bell EMOM A / B / C', blurb: 'One long bell EMOM a day, three moves taking turns at the top of each minute.',
    about: 'One bell, three moves and the clock. Each day is a long EMOM where three kettlebell moves take turns, one set at the top of every minute. Three days rotate, so each move gets plenty of minutes. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Trio', 'Triad', 'Trident', 'Trefoil', 'Tripod', 'Trilogy', 'Triangle', 'Triple Jump', 'Hat Trick', 'Three Count', 'Treble', 'Tercet', 'Triplet', 'Tricorn', 'Trimaran', 'Tri-State', 'Third Gear', 'Three Bells', 'Triskelion', 'Trifecta'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'EMOM A', short: 'A', blocks: [E('Bell EMOM', ['kbBallistic', 'kbUpper2', 'kbLower2'], { values: [24, 27, 30] })] },
      b: { label: 'EMOM B', short: 'B', blocks: [E('Bell EMOM', ['kbSwing', 'kbLower', 'kbCore2'], { values: [24, 27, 30] })] },
      c: { label: 'EMOM C', short: 'C', blocks: [E('Bell EMOM', ['kbAll', 'kbUpper', 'kbLower2'], { values: [24, 27, 30] })] },
    },
  },
  {
    id: 'bell-strength-thirty', name: 'Bell Strength Thirty', subject: 'Kettlebell only', days: 30, minutes: P23_MID, equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Bell upper & core / bell lower & swings, 30 days', blurb: 'A month of one-bell strength, upper and lower days in straight sets.',
    about: 'A month of strength with one kettlebell. Upper days press, row and brace; lower days squat, hinge and swing, all in straight sets with full rests. Every ten days the level steps up. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Acorn Bell', 'Pine Cone', 'Chestnut', 'Walnut', 'Hazelnut', 'Almond', 'Pecan', 'Cashew', 'Pistachio', 'Macadamia', 'Brazil Nut', 'Coconut', 'Peanut', 'Beechnut', 'Butternut', 'Hickory', 'Kola', 'Pine Nut', 'Candlenut', 'Chinquapin'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & core', short: 'Upper', blocks: [S('Upper & core', ['kbUpper2', 'kbUpper2', 'kbCore2', 'kbAll?'])] },
      lower: { label: 'Lower & swings', short: 'Lower', blocks: [S('Lower & swings', ['kbLower2', 'kbBallistic', 'kbLower', 'kbSwing?'])] },
    },
  },
  {
    id: 'circuit-then-swings', name: 'Circuit Then Swings', subject: 'Kettlebell only', minutes: P23_MID, equip: 'kb', levers: [null, 'reps', 'variation'],
    split: 'Bell circuit, then a swing EMOM, A / B', blurb: 'A one-bell strength circuit, then a swing EMOM to finish.',
    about: 'Strength in a circuit, then swings on the minute. Each day is a circuit of three kettlebell moves, round after round, then a short EMOM of swings and other ballistic moves. Two days alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Spark Plug', 'Ignition', 'Starter', 'Throttle', 'Clutch', 'Gear Shift', 'Choke', 'Carburettor', 'Manifold', 'Exhaust', 'Radiator', 'Fan Belt', 'Alternator', 'Distributor', 'Timing Belt', 'Crankshaft', 'Oil Pan', 'Dipstick', 'Spark Gap', 'Coil'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Circuit & swings A', short: 'A', blocks: [C('Bell circuit', ['kbLower2', 'kbUpper2', 'kbCore2'], { values: [2, 3, 4] }), E('Swing EMOM', ['kbSwing', 'kbBallistic'], { values: [6, 8, 10] })] },
      b: { label: 'Circuit & swings B', short: 'B', blocks: [C('Bell circuit', ['kbLower', 'kbUpper', 'kbAll'], { values: [2, 3, 4] }), E('Swing EMOM', ['kbBallistic', 'kbSwing'], { values: [6, 8, 10] })] },
    },
  },
  {
    id: 'quick-bell-circuit', name: 'Quick Bell Circuit', subject: 'Kettlebell only', minutes: [25, 30], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Short bell circuit A / B / C', blurb: 'A short one-bell circuit a day, three rotating, four moves a round.',
    about: 'A quick session with one kettlebell. Each day is a circuit of four bell moves, round after round with a short breather, and three circuits rotate. It fits a short slot without losing any part of the body. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Quick Fix', 'Fast Track', 'Speed Bump', 'Short Cut', 'Jiffy', 'Trice', 'Flash Bell', 'Snap Bell', 'Rapid', 'Brisk', 'Nimble', 'Fleet', 'Hasty', 'Swift Bell', 'Prompt', 'Lively', 'Spry', 'Zippy', 'Speedy', 'Pronto'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Circuit A', short: 'A', blocks: [C('Bell circuit', ['kbBallistic', 'kbLower2', 'kbUpper2', 'kbCore2'], { values: [2, 3, 4] })] },
      b: { label: 'Circuit B', short: 'B', blocks: [C('Bell circuit', ['kbSwing', 'kbUpper', 'kbLower', 'kbAll'], { values: [2, 3, 4] })] },
      c: { label: 'Circuit C', short: 'C', blocks: [C('Bell circuit', ['kbAll', 'kbUpper2', 'kbLower2', 'kbCore2'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'quick-bell-emom', name: 'Quick Bell EMOM', subject: 'Kettlebell only', minutes: [25, 30], equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Bell EMOM, upper / lower, short', blurb: 'A short one-bell EMOM, upper body one day and lower the next.',
    about: 'A short session the clock runs. Each day is an EMOM of four kettlebell moves, a set at the top of every minute, upper body one day and lower the next. No rests to plan. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Bell One', 'Bell Two', 'Bell Three', 'Bell Four', 'Bell Five', 'Bell Six', 'Bell Seven', 'Bell Eight', 'Bell Nine', 'Bell Ten', 'Bell Eleven', 'Bell Twelve', 'Bell Thirteen', 'Bell Fourteen', 'Bell Fifteen', 'Bell Sixteen', 'Bell Seventeen', 'Bell Eighteen', 'Bell Nineteen', 'Bell Twenty'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper EMOM', short: 'Upper', blocks: [E('Upper EMOM', ['kbUpper2', 'kbUpper', 'kbCore2', 'kbUpper2'], { values: [14, 16, 18, 20] })] },
      lower: { label: 'Lower EMOM', short: 'Lower', blocks: [E('Lower EMOM', ['kbLower2', 'kbBallistic', 'kbLower', 'kbSwing'], { values: [14, 16, 18, 20] })] },
    },
  },
];
const P23_CX = [
  {
    id: 'long-complex', name: 'Long Complex', subject: 'Kettlebell complexes', minutes: P23_LONG, equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Two complexes a day, A / B', blurb: 'Two kettlebell complexes a day: one long chain, then a shorter one.',
    about: 'Two complexes, each a chain of bell moves done without putting the bell down. The first is four moves long and the second three, both round after round. Two days alternate, one led by the clean and one by the swing. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Knot', 'Hitch', 'Bowline', 'Clove Hitch', 'Reef Knot', 'Sheet Bend', 'Half Hitch', 'Figure Eight', 'Slipknot', 'Granny Knot', 'Square Knot', 'Monkey Fist', 'Turk Head', 'Sheepshank', 'Taut Line', 'Prusik', 'Fisherman', 'Carrick Bend', 'Trucker Hitch', 'Constrictor'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Complexes A', short: 'A', blocks: [C('Long complex', ['kb_clean', 'kbCx', 'kbCxLower', 'kbCxUpper'], { values: [3, 4, 5] }), C('Short complex', ['kbCx', 'kbCxLower', 'kbCxCore'], { values: [2, 3, 4] })] },
      b: { label: 'Complexes B', short: 'B', blocks: [C('Long complex', ['kb_one_arm_swing', 'kbCxUpper', 'kbCxLower', 'kbCx'], { values: [3, 4, 5] }), C('Short complex', ['kbCx', 'kbCxUpper', 'kbCxCore'], { values: [2, 3, 4] })] },
    },
  },
  {
    id: 'complex-month', name: 'Complex Month', subject: 'Kettlebell complexes', days: 30, minutes: P23_LONG, equip: 'kb', levers: [null, 'reps', 'variation'],
    split: 'Complex AMRAP / complex ladders, 30 days', blurb: 'A month of complexes: an AMRAP day and a ladder day, one bell.',
    about: 'A month of kettlebell complexes in two shapes. One day is a long AMRAP of a five-move chain, then a short one; the other is two complex ladders, one rep of each move, then two, then three, and a core circuit. Every ten days the level steps up. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Braid', 'Plait', 'Weave', 'Twine', 'Strand', 'Cord', 'Rope', 'Cable', 'Hawser', 'Lanyard', 'Tether', 'Lariat', 'Halyard', 'Painter', 'Mooring Line', 'Bungee', 'Lashing', 'Ratline', 'Guy Line', 'Dock Line'],
    cycle: ['amrap', 'ladder'],
    dayTypes: {
      amrap: { label: 'Complex AMRAP', short: 'AMRAP', blocks: [A('Long AMRAP', ['kb_clean', 'kbCxUpper', 'kbCxLower', 'kbCx', 'kbCxCore'], { values: [12, 14, 16] }), A('Short AMRAP', ['kbCx', 'kbCxCore'], { values: [6, 8] })] },
      ladder: { label: 'Complex ladders', short: 'Ladder', blocks: [L('Ladder 1', ['kbCx', 'kbCxLower']), L('Ladder 2', ['kbCxUpper', 'kbCxCore']), C('Core', ['kbCxCore', 'kbCx'], { values: [2, 3] })] },
    },
  },
  {
    id: 'heavy-complex-emom', name: 'Heavy Complex EMOM', subject: 'Kettlebell complexes', minutes: P23_LONG, equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Heavy complex, then a complex EMOM, A / B', blurb: 'A heavy complex in straight sets, then a complex on every minute.',
    about: 'Heavy first, then fast. Each day opens with a heavy complex in straight sets, a clean, press and squat or a swing, pull and push press, then an EMOM of three more complex moves. Two days alternate. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Chain', 'Link', 'Shackle', 'Swivel', 'Clevis', 'Carabiner', 'Hook', 'Eyelet', 'Ring Bolt', 'Turnbuckle', 'Pulley Block', 'Snatch Block', 'Bollard Line', 'Capstan', 'Windlass', 'Cleat', 'Davit', 'Derrick', 'Boom', 'Jib'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Heavy & EMOM A', short: 'A', blocks: [S('Heavy complex', ['kb_clean', 'kb_press', 'kb_front_squat', 'kbCxCore?']), E('Complex EMOM', ['kbCx', 'kbCxUpper', 'kbCxLower'], { values: [12, 14, 16] })] },
      b: { label: 'Heavy & EMOM B', short: 'B', blocks: [S('Heavy complex', ['kb_swing', 'kb_high_pull', 'kb_push_press', 'kbCxLower?']), E('Complex EMOM', ['kbCx', 'kbCxLower', 'kbCxCore'], { values: [12, 14, 16] })] },
    },
  },
  {
    id: 'complex-ladder-plus', name: 'Complex Ladder Plus', subject: 'Kettlebell complexes', minutes: P23_MID, equip: 'kb', levers: [null, 'reps', 'tempo'],
    split: 'Two complex ladders and a core circuit, A / B', blurb: 'Two kettlebell complex ladders, then a core circuit.',
    about: 'Climb twice, then brace. Each day is two ladders of two complex moves, one rep of each, then two, then three, as high as you can go, then a short core circuit with the bell. Two days alternate. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Ladder Back', 'Rope Ladder', 'Step Stool', 'Stepladder', 'Extension', 'Jacob Ladder', 'Gangway', 'Gangplank', 'Companionway', 'Hatch', 'Deck', 'Bridge Deck', 'Quarterdeck', 'Forecastle', 'Poop Deck', 'Crow Nest', 'Mainmast', 'Mizzen', 'Topsail', 'Rigging'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladders & core A', short: 'A', blocks: [L('Ladder 1', ['kbCx', 'kbCxLower']), L('Ladder 2', ['kbCxUpper', 'kbCx']), C('Core', ['kbCxCore', 'kbCxCore'], { values: [2, 3] })] },
      b: { label: 'Ladders & core B', short: 'B', blocks: [L('Ladder 1', ['kb_clean', 'kbCxLower']), L('Ladder 2', ['kbCx', 'kbCxUpper']), C('Core', ['kbCxCore', 'kbCx'], { values: [2, 3] })] },
    },
  },
  {
    id: 'complex-express', name: 'Complex Express', subject: 'Kettlebell complexes', minutes: [24, 29], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'One complex AMRAP a day, A / B / C', blurb: 'One short kettlebell complex AMRAP a day, three rotating.',
    about: 'A complex, a clock and nothing else. Each day is one AMRAP of a four-move complex, as many rounds as you can before the time runs out. Three complexes rotate. Abs finish every session. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Jab', 'Flick Kick', 'Snap Pass', 'Quick Hands', 'Fast Feet', 'Blink', 'Flinch', 'Twitch', 'Pounce', 'Lunge Out', 'Spring Up', 'Dash Bell', 'Hustle', 'Scramble', 'Bustle', 'Scurry', 'Hurry', 'Scamper', 'Rush', 'Bolt'],
    cycle: ['a', 'b', 'c'],
    dayTypes: {
      a: { label: 'Complex AMRAP A', short: 'A', blocks: [A('Complex AMRAP', ['kb_clean', 'kbCxUpper', 'kbCxLower', 'kbCxCore'], { values: [14, 16, 18, 20] })] },
      b: { label: 'Complex AMRAP B', short: 'B', blocks: [A('Complex AMRAP', ['kb_one_arm_swing', 'kbCx', 'kbCxLower', 'kbCxCore'], { values: [14, 16, 18, 20] })] },
      c: { label: 'Complex AMRAP C', short: 'C', blocks: [A('Complex AMRAP', ['kbCx', 'kbCxUpper', 'kbCx', 'kbCxCore'], { values: [14, 16, 18, 20] })] },
    },
  },
];
const P23_PULL = [
  {
    id: 'pullup-volume', name: 'Pull-up Volume', subject: 'Pull-ups', minutes: P23_LONG, levers: [null, 'reps', 'weight'],
    split: 'Pull-up volume / push & legs / pull-up strength', blurb: 'Pull-up supersets for volume, a push and legs day, then heavy pull-ups.',
    about: 'More pull-ups, spread across the week. The volume day pairs pull-ups with rows and presses in supersets; the push and legs day gives the back a rest; the strength day is straight sets of harder pulls with full rests. Three days rotate. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Chin', 'Brow', 'Crown Bar', 'Overhand', 'Underhand', 'Neutral', 'Wide', 'Close', 'Mixed', 'Hook Grip', 'False Grip', 'Thumbless', 'Full Hang', 'Top Hold', 'Kip', 'Strict', 'Dead Stop', 'Scap Pull', 'Negative', 'Lock Off'],
    cycle: ['volume', 'pushlegs', 'strength'],
    dayTypes: {
      volume: { label: 'Pull-up volume', short: 'Volume', blocks: [SS('Pull-up volume', ['pullBarMain', 'row2', 'pullBar2', 'chestPress', 'biceps2', 'barCore'])] },
      pushlegs: { label: 'Push & legs', short: 'Push', blocks: [S('Push & legs', ['squat2', 'pushLoad2', 'hinge2', 'lunge2', 'pullBar?'])] },
      strength: { label: 'Pull-up strength', short: 'Strength', blocks: [S('Pull-up strength', ['pullBarMain', 'backBar', 'backRow', 'pullBar2', 'biceps2?'])] },
    },
  },
  {
    id: 'pullup-emom-month', name: 'Pull-up EMOM Month', subject: 'Pull-ups', days: 30, minutes: P23_LONG, levers: [null, 'reps', 'variation'],
    split: 'Pull-up EMOM, then strength, upper / lower, 30 days', blurb: 'A month that starts every day with a pull-up EMOM, then strength work.',
    about: 'A month of pull-ups on the minute. Every day opens with an EMOM of pull-ups and one other move, then straight sets: the upper body one day, the legs the next. Every ten days the level steps up. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Equinox', 'Solstice', 'New Moon', 'Full Moon', 'Half Moon', 'Crescent', 'Gibbous', 'Eclipse'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'EMOM & upper', short: 'Upper', blocks: [E('Pull-up EMOM', ['pullBarMain', 'push'], { values: [10, 12, 14] }), S('Upper', ['backRow', 'chestPress', 'shoulders2', 'biceps2?'])] },
      lower: { label: 'EMOM & lower', short: 'Lower', blocks: [E('Pull-up EMOM', ['pullBar2', 'barCore'], { values: [10, 12, 14] }), S('Lower', ['squat2', 'hinge2', 'lunge2', 'glute2?'])] },
    },
  },
  {
    id: 'ladder-and-pairs', name: 'Ladder and Pairs', subject: 'Pull-ups', minutes: P23_LONG, levers: [null, 'reps', 'tempo'],
    split: 'Pull-up ladder, then supersets, A / B', blurb: 'A pull-up ladder first, then full-body supersets.',
    about: 'Pull-ups while you are fresh, then the rest of the body. Each day opens with a pull-up ladder, one rep, then two, then three, as high as you can go, then supersets of a press, a row and the legs. Two days alternate. Abs finish every session. Level II adds reps and Level III slows the lowering to three seconds.',
    names: ['Oak Rung', 'Ash Rung', 'Elm Rung', 'Birch Rung', 'Pine Rung', 'Maple Rung', 'Cedar Rung', 'Yew Rung', 'Teak Rung', 'Walnut Rung', 'Cherry Rung', 'Hickory Rung', 'Beech Rung', 'Alder Rung', 'Larch Rung', 'Poplar Rung', 'Willow Rung', 'Spruce Rung', 'Rowan Rung', 'Holly Rung'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Ladder & pairs A', short: 'A', blocks: [L('Pull-up ladder', ['pullBarMain']), SS('Pairs', ['chestPress', 'row2', 'squat2', 'hinge2'])] },
      b: { label: 'Ladder & pairs B', short: 'B', blocks: [L('Pull-up ladder', ['pullBar2']), SS('Pairs', ['pushLoad2', 'backRow', 'lunge2', 'glute2'])] },
    },
  },
  {
    id: 'bar-four-day', name: 'Bar Four-Day', subject: 'Pull-ups', minutes: P23_LONG, levers: [null, 'weight', 'reps'],
    split: 'Wide pulls / chin-ups & arms / legs / bar core & push', blurb: 'Four days round the bar: wide pulls, chin-ups and arms, legs, then core and push.',
    about: 'Four days that treat the bar from every side. Wide-grip pulls and rear shoulders one day, chin-ups and arms the next, then a leg day, then hanging core work with presses. Straight sets throughout. Abs finish every session. Level II moves you one weight up and Level III adds reps.',
    names: ['Monkey', 'Gibbon', 'Lemur', 'Baboon', 'Macaque', 'Capuchin', 'Tamarin', 'Marmoset', 'Orangutan', 'Gorilla', 'Chimp', 'Bonobo', 'Howler', 'Spider Monkey', 'Mandrill', 'Colobus', 'Langur', 'Siamang', 'Loris', 'Tarsier'],
    cycle: ['wide', 'chin', 'legs', 'core'],
    dayTypes: {
      wide: { label: 'Wide pulls', short: 'Wide', blocks: [S('Wide pulls', ['pullBar2', 'backBar', 'backRear', 'row2', 'pullBar?'])] },
      chin: { label: 'Chin-ups & arms', short: 'Chin', blocks: [S('Chin-ups & arms', ['pullBarMain', 'biceps2', 'backRow', 'gripPull', 'biceps2?'])] },
      legs: { label: 'Legs', short: 'Legs', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2', 'glute2', 'calf?'])] },
      core: { label: 'Bar core & push', short: 'Core', blocks: [S('Bar core & push', ['barCore', 'chestPress', 'pushLoad2', 'barCore', 'triceps2?'])] },
    },
  },
  {
    id: 'pull-pairs-thirty', name: 'Pull Pairs Thirty', subject: 'Pull-ups', days: 30, minutes: P23_MID, levers: [null, 'reps', 'weight'],
    split: 'Pull-push supersets A / B, 30 days', blurb: 'A month of pull-ups paired with presses, in supersets.',
    about: 'A month where every pull has a push. Each day is three supersets, a pull-up or row with a press, back to back with one rest after both. Two days alternate, and every ten days the level steps up. Abs finish every session. Level II adds reps and Level III moves you one weight up.',
    names: ['Give and Take', 'Ebb and Flow', 'Up and Down', 'Rise and Fall', 'Day and Night', 'Hot and Cold', 'High and Low', 'Fire and Ice', 'Sun and Moon', 'Salt and Pepper', 'Bread and Butter', 'Rock and Roll', 'Stop and Go', 'Back and Forth', 'Push and Pull', 'Hide and Seek', 'Cat and Mouse', 'Black and White', 'Thick and Thin', 'Pros and Cons'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Pull-push A', short: 'A', blocks: [SS('Pull-push pairs', ['pullBarMain', 'chestPress', 'row2', 'pushLoad2', 'barCore', 'shoulders2'])] },
      b: { label: 'Pull-push B', short: 'B', blocks: [SS('Pull-push pairs', ['pullBar2', 'pushLoad2', 'backRow', 'push', 'biceps2', 'triceps2'])] },
    },
  },
  {
    id: 'bar-emom-pairs', name: 'Bar EMOM and Pairs', subject: 'Pull-ups', minutes: P23_MID, levers: [null, 'tempo', 'reps'],
    split: 'Bar EMOM, then supersets, A / B', blurb: 'A pull-up EMOM, then full-body supersets.',
    about: 'Pull-ups on the clock, then everything else in pairs. Each day opens with an EMOM of two bar moves, a set at the top of every minute, then two supersets of legs, a press and a row. Two days alternate. Abs finish every session. Level II slows every rep down and Level III adds reps.',
    names: ['Parallel', 'Horizontal', 'Vertical', 'Diagonal', 'Tangent', 'Arc', 'Chord', 'Radius', 'Vector', 'Axis', 'Plane', 'Angle', 'Apex', 'Vertex', 'Edge', 'Face', 'Prism', 'Cube', 'Sphere', 'Cone'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'EMOM & pairs A', short: 'A', blocks: [E('Bar EMOM', ['pullBarMain', 'barCore'], { values: [8, 10, 12] }), SS('Pairs', ['squat2', 'chestPress', 'hinge2', 'row2'])] },
      b: { label: 'EMOM & pairs B', short: 'B', blocks: [E('Bar EMOM', ['pullBar2', 'pullBarMain'], { values: [8, 10, 12] }), SS('Pairs', ['lunge2', 'pushLoad2', 'glute2', 'backRow'])] },
    },
  },
  {
    id: 'pullup-express', name: 'Pull-up Express', subject: 'Pull-ups', minutes: [26, 31], levers: [null, 'reps', 'variation'],
    split: 'Pull-up EMOM / pull-up ladders, short', blurb: 'A short pull-up day: an EMOM one day, two ladders the next.',
    about: 'Pull-ups for the shorter days. One day is an EMOM of pull-ups, a push, a second pull and hanging core work; the other is two ladders, each a pull-up paired with a push or squat. They alternate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Snap Chin', 'Quick Pull', 'Fast Bar', 'Short Hang', 'Speed Chin', 'Rapid Row', 'Flash Pull', 'Jolt Bar', 'Brisk Bar', 'Blitz Bar', 'Dash Pull', 'Zip Bar', 'Pop Chin', 'Spark Bar', 'Hop Bar', 'Kick Bar', 'Jump Bar', 'Flick Bar', 'Rush Pull', 'Bolt Bar'],
    cycle: ['emom', 'ladder'],
    dayTypes: {
      emom: { label: 'Pull-up EMOM', short: 'EMOM', blocks: [E('Pull-up EMOM', ['pullBarMain', 'push', 'pullBar2', 'barCore'], { values: [12, 14, 16, 18] })] },
      ladder: { label: 'Pull-up ladders', short: 'Ladder', blocks: [L('Ladder 1', ['pullBarMain', 'push']), L('Ladder 2', ['pullBar2', 'squat2'])] },
    },
  },
  {
    id: 'short-bar-strength', name: 'Short Bar Strength', subject: 'Pull-ups', minutes: [26, 31], levers: [null, 'weight', 'tempo'],
    split: 'Pull & press / pull & legs, short', blurb: 'Short straight-set days that start with the bar every time.',
    about: 'Heavy pulls in a short session. Each day opens with a pull-up, then a press and a row on one day, a squat and a hinge on the other, in straight sets. They alternate. Abs finish every session. Level II moves you one weight up and Level III slows the lowering to three seconds.',
    names: ['Iron Bar', 'Steel Bar', 'Crowbar', 'Rebar', 'Pry Bar', 'Bar Bell', 'Handle Bar', 'Towel Bar', 'Grab Bar', 'Roll Bar', 'Sway Bar', 'Torsion Bar', 'Tow Bar', 'Push Bar', 'Panic Bar', 'Drawbar', 'Busbar', 'Sandbar', 'Gold Bar', 'Space Bar'],
    cycle: ['press', 'legs'],
    dayTypes: {
      press: { label: 'Pull & press', short: 'Press', blocks: [S('Pull & press', ['pullBarMain', 'chestPress', 'backRow', 'barCore?'])] },
      legs: { label: 'Pull & legs', short: 'Legs', blocks: [S('Pull & legs', ['pullBar2', 'squat2', 'hinge2', 'biceps2?'])] },
    },
  },
];
const P23_CLIMB = [
  {
    id: 'long-climb-session', name: 'Long Climb Session', subject: 'Climber / pull strength', minutes: P23_LONG, levers: [null, 'reps', 'variation'],
    split: 'Pull & hold / back & core / pull volume', blurb: 'Longer climbing strength days: pulls and holds, back and core, then pull volume.',
    about: 'Strength for the wall, with the time to do it properly. One day is pull-ups and dead hangs in straight sets, the next upper back and hanging core, the third pull volume in supersets with rows and grip work. Three days rotate. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Crimp', 'Sloper', 'Pinch', 'Jug', 'Pocket', 'Edge Hold', 'Undercling', 'Gaston', 'Sidepull', 'Mantle', 'Heel Hook', 'Toe Hook', 'Dyno', 'Deadpoint', 'Flag', 'Drop Knee', 'Smear', 'Stem', 'Layback', 'Lock Hold'],
    cycle: ['pull', 'back', 'volume'],
    dayTypes: {
      pull: { label: 'Pull & hold', short: 'Pull', blocks: [S('Pull & hold', ['climbPull', 'climbHold', 'climbPull', 'climbBack', 'climbHold?'])] },
      back: { label: 'Back & core', short: 'Back', blocks: [S('Back & core', ['climbBack', 'climbBack', 'barCore', 'coreHollow', 'climbBack?'])] },
      volume: { label: 'Pull volume', short: 'Volume', blocks: [SS('Pull volume', ['climbPull', 'row2', 'climbPull', 'backRow', 'gripPull', 'climbHold'])] },
    },
  },
  {
    id: 'climber-month-plus', name: 'Climber Month Plus', subject: 'Climber / pull strength', days: 30, minutes: P23_LONG, levers: [null, 'reps', 'reps'],
    split: 'Pull ladder & circuit / hang EMOM & back, 30 days', blurb: 'A month for climbers: a ladder and a circuit one day, a hang EMOM and back work the next.',
    about: 'A month of pulling strength in two shapes. One day is a pull ladder, then a circuit of holds, legs and core; the other is an EMOM of hangs and pulls, then straight sets for the upper back and grip. Every ten days the level steps up. Abs finish every session. Both later levels add reps.',
    names: ['El Capitan', 'Half Dome', 'Eiger North', 'Fitz Roy', 'Cerro Torre', 'Trango', 'Grand Teton', 'Devil Tower', 'Moonlight Buttress', 'Nose Route', 'Salathe', 'Freerider', 'Astroman', 'Separate Reality', 'Midnight Lightning', 'Action Directe', 'Silence', 'Realization', 'Biographie', 'Jumbo Love'],
    cycle: ['ladder', 'hang'],
    dayTypes: {
      ladder: { label: 'Ladder & circuit', short: 'Ladder', blocks: [L('Pull ladder', ['climbPull', 'climbBack']), C('Circuit', ['climbHold', 'legsBw2', 'coreHollow', 'climbPull'], { values: [2, 3, 4] })] },
      hang: { label: 'Hang EMOM & back', short: 'Hang', blocks: [E('Hang EMOM', ['climbHold', 'climbBack', 'climbPull', 'coreAnti'], { values: [10, 12, 14] }), S('Back & grip', ['climbBack', 'backRow', 'gripPull'])] },
    },
  },
  {
    id: 'climb-supersets', name: 'Climb Supersets', subject: 'Climber / pull strength', minutes: P23_MID, levers: [null, 'weight', 'variation'],
    split: 'Pull & antagonist supersets A / B', blurb: 'Climbing pulls paired with the pushing muscles climbers forget.',
    about: 'Pulling strength with the balance climbers need. Each superset pairs a climbing pull or hang with a press or push, so the shoulders stay even. Two days alternate. Abs finish every session. Level II moves you one weight up and Level III brings harder variations.',
    names: ['Belay', 'Lower Off', 'Rappel', 'Top Rope', 'Lead', 'Redpoint', 'Onsight', 'Flash Send', 'Project', 'Beta', 'Crux', 'Rest Stance', 'Clip', 'Quickdraw', 'Anchor Point', 'Chalk', 'Tape', 'Harness', 'Rope Bag', 'Crash Pad'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Supersets A', short: 'A', blocks: [SS('Pull & push', ['climbPull', 'chestPress', 'climbBack', 'pushLoad2', 'climbHold', 'shoulders2'])] },
      b: { label: 'Supersets B', short: 'B', blocks: [SS('Pull & push', ['climbPull', 'push', 'backRow', 'triceps2', 'gripPull', 'coreHollow'])] },
    },
  },
  {
    id: 'short-climb-circuit', name: 'Short Climb Circuit', subject: 'Climber / pull strength', minutes: [24, 29], levers: [null, 'reps', 'variation'],
    split: 'Pull circuit / hold circuit, short', blurb: 'Short climbing circuits: a pull circuit one day, a hold circuit the next.',
    about: 'Climbing strength in a short slot. One day is a circuit of pull-ups, upper back and core; the other a circuit of hangs and holds with legs and anti-extension work. They alternate, round after round. Abs finish every session. Level II adds reps and Level III brings harder variations.',
    names: ['Boulder', 'Problem', 'Highball', 'Lowball', 'Traverse Wall', 'Overhang', 'Slab', 'Roof', 'Arete Edge', 'Corner', 'Crack', 'Chimney', 'Off-Width', 'Dihedral', 'Prow', 'Cave', 'Lip', 'Topout', 'Sit Start', 'Eliminate'],
    cycle: ['pull', 'hold'],
    dayTypes: {
      pull: { label: 'Pull circuit', short: 'Pull', blocks: [C('Pull circuit', ['climbPull', 'climbBack', 'coreHollow', 'climbPull'], { values: [2, 3, 4] })] },
      hold: { label: 'Hold circuit', short: 'Hold', blocks: [C('Hold circuit', ['climbHold', 'climbHold', 'coreAnti', 'legsBw2'], { values: [2, 3, 4] })] },
    },
  },
];
const P23_T4 = [...P23_KB, ...P23_CX, ...P23_PULL, ...P23_CLIMB].map((c) => ({ ...c, added: 23, catalogue: 13 }));
CONFIGS.push(...P23_T4);

// Phase 23: the new programs' ids in shelf order, appended to programs.config.js's ORDER after every older program
CONFIGS.order23 = [...IIS.map((c) => c.id), ...P23_T3.map((c) => c.id), ...P23_T4.map((c) => c.id)];
module.exports = CONFIGS;
