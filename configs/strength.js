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

module.exports = CONFIGS;
