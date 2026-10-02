/* Kettle & Bar exercise catalogue: every exercise and stretch with its poses, reps per level, muscles,
   cue and suggested load. Data only; drawing lives in figures.js. */
(function (root, Formats) {
  /* ---------- Pose building blocks (profile view faces right, hip at 0,0, y down) ---------- */
  const P = (base, over) => Object.assign({}, base, over);
  const STAND = { t: [0, -34], hn: [3, -1], hf: [1, -1], fn: [2, 41], ff: [-2, 41] };
  const PLANK = { t: [30, -15], hn: [30, 18], hf: [33, 18], fn: [-37, 18], ff: [-39, 18], mat: 1 };
  const PUSHB = { t: [34, -4], hn: [29, 5], hf: [32, 5], fn: [-40, 5], ff: [-42, 5], eh: [-0.4, -1], mat: 1 };
  const FOREARM = { t: [33, -8], hn: [50, 9], hf: [52, 9], fn: [-40, 9], ff: [-41, 9], eh: [-0.3, 1], mat: 1 };
  const HANG = { t: [0, -34], hn: [3, -67], hf: [1, -67], fn: [-14, 33], ff: [-16, 32], kh: [1, 0.2], bar: 1 };
  const PULLTOP = { t: [-4, -34], hn: [8, -41], hf: [6, -41], eh: [0.2, 1], fn: [-12, 32], ff: [-14, 31], kh: [1, 0.2], bar: 1 };
  const PULLMID = { t: [-2, -34], hn: [6, -58], hf: [4, -58], eh: [0, 1], fn: [-13, 32], ff: [-15, 31], kh: [1, 0.2], bar: 1 };
  const SUPLEGS = { fn: [-24, 0], ff: [-26, 0], kh: [0.2, -1] };
  const SUP = P(SUPLEGS, { t: [34, 0], mat: 1 });
  const HINGE = { t: [26, -22], fn: [5, 40], ff: [3, 40] };
  const STAG = { t: [29, -17], fn: [-15, 38], ff: [14, 38], hf: [10, 16] };
  const VSEAT = { t: [-17, -29], fn: [28, -10], ff: [27, -9], kh: [0.2, -1], mat: 1 };
  const BSQ = { t: [30, -16], fn: [10, 14], ff: [8, 14], kh: [1, -0.5], hn: [33, 14], hf: [35, 14] };
  const JUMP = { t: [1, -34], hn: [6, -66], hf: [4, -66], fn: [1, 41], ff: [-1, 41], lift: 9 };
  const SQUAT = { t: [15, -30], fn: [10, 30], ff: [8, 30], kh: [1, -0.3] };
  const LUNGE_N = { t: [0, -34], fn: [21, 20], khn: [1, -1], ff: [-27, 17], khf: [0.3, 1], hn: [8, -8], hf: [-6, -4] };
  const LUNGE_F = { t: [0, -34], ff: [21, 20], khf: [1, -1], fn: [-27, 17], khn: [0.3, 1], hf: [8, -8], hn: [-6, -4] };
  const SWING_LOW = { t: [26, -21], fn: [6, 39], ff: [4, 39], hn: [6, 8], hf: [6, 8], kb: 'both', kh: [1, -0.3] };
  const RACK = P(STAND, { hn: [7, -38], ehn: [0.2, 1], kb: 'n', kbd: [-0.6, 0.5] });
  const PRESS_UP = P(STAND, { hn: [2, -67], kb: 'n', kbd: [-0.5, 0.35] });
  const GB_DOWN = P(SUP, { hn: [6, 2], hf: [6, 2], eh: [0, -1] });
  const GB_UP = { t: [32, 12], hd: [1, 0], hn: [8, 15.5], hf: [8, 15.5], eh: [0, -1], fn: [-22, 15.5], ff: [-24, 15.5], kh: [0, -1], mat: 1 };
  const HANDS_HIPS = { hn: [3, -4], hf: [2, -4], eh: [-1, -0.2] };
  const FSTAND = { t: [0, -34], hn: [-12, 0], hf: [12, 0], fn: [-8, 41], ff: [8, 41] };

  // Phase 5: guided poses (yoga, Pilates, flexibility, mobility) and combat stances
  const ARMS_UP = { hn: [2, -67], hf: [0, -67] };
  const FOLD = { t: [18, 28], hd: [0.3, 1], hn: [1, 38], hf: [-1, 38], eh: [1, 1], fn: [-4, 41], ff: [-6, 41] };
  const COBRA = { t: [26, -21], hd: [1, -0.8], hn: [30, 3], hf: [32, 3], eh: [-1, 0], fn: [-41, 3], ff: [-41, 4], mat: 1 };
  const DOWNDOG = { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36], mat: 1 };
  const TABLE = { t: [34, 0], hn: [34, 32], hf: [36, 32], fn: [-20, 22], ff: [-21, 22], kh: [1, 0.6], mat: 1 };
  const KNEEL = { t: [0, -34], fn: [-20, 21], ff: [-21, 21], kh: [1, 0.2], hn: [3, -2], hf: [2, -2], mat: 1 };
  const LIE = { t: [34, 0], fn: [-41, 0], ff: [-41, 1], hn: [9, 4], hf: [10, 4], mat: 1 };
  const PRONE = { t: [34, 0], hd: [1, 0], fn: [-41, 0], ff: [-41, 1], hn: [60, 1], hf: [61, 1], mat: 1 };
  const SEAT = { t: [0, -34], fn: [41, 0], ff: [40, 1], hn: [-6, 2], hf: [-5, 2], eh: [1, 0.3], mat: 1 };
  const WIDE = { t: [0, -34], fn: [-28, 33], ff: [28, 33], khn: [-1, 0], khf: [1, 0] }; // front view, feet wide
  const WAR2 = { t: [0, -34], fn: [-30, 26], khn: [-1, -0.4], ff: [34, 30], khf: [1, 0], hn: [-42, -33], hf: [42, -33], ehn: [0, -1], ehf: [0, -1] };

  const CURL = { t: [33, -8], hd: [0.6, -1] }; // lying on the back, head and shoulders curled up (head right, legs left)
  const TUCK = { t: [-14, -31], fn: [12, -6], ff: [11, -5], kh: [0.3, -1], hn: [13, -13], hf: [12, -12], mat: 1 };
  const TUCK_BACK = { t: [-30, 16], hd: [-0.4, -1], fn: [-6, -18], ff: [-7, -17], kh: [0, -1], hn: [-4, -10], hf: [-5, -10], mat: 1 };

  // boxing, orthodox stance in profile: the near arm and leg lead
  const GUARD = { t: [4, -34], fn: [14, 40], ff: [-12, 40], khn: [1, -0.2], khf: [1, -0.3], hn: [15, -41], hf: [11, -38], ehn: [-0.2, 1], ehf: [-0.2, 1] };
  const JAB = { ...GUARD, t: [6, -34], hn: [39, -38], ehn: [0, 1] };
  const CROSS = { ...GUARD, t: [10, -33], hf: [41, -36], ehf: [0, 1], ff: [-12, 38], hn: [16, -41] };
  const HOOK = { ...GUARD, t: [7, -34], hn: [24, -37], ehn: [0, -1] };
  const BODY_HOOK = { ...GUARD, t: [9, -32], fn: [16, 37], ff: [-12, 37], hn: [26, -22], ehn: [0, -1] };
  const UPPER = { ...GUARD, t: [5, -33], fn: [15, 38], ff: [-12, 38], hn: [20, -47], ehn: [0, 1] };
  const REAR_UPPER = { ...GUARD, t: [9, -33], fn: [15, 38], ff: [-12, 38], hf: [22, -46], ehf: [0, 1] };
  const BODY_JAB = { ...GUARD, t: [9, -32], fn: [18, 36], ff: [-12, 37], hn: [38, -20], ehn: [0, 1] };
  const SLIP = { ...GUARD, t: [12, -32], hd: [0.6, -0.8], hn: [22, -36], hf: [17, -34] };
  const ROLL = { ...GUARD, t: [11, -30], fn: [17, 33], ff: [-12, 33], hn: [22, -32], hf: [18, -30] };

  // kickboxing: kicks and knees from the same guard (near leg leads)
  const TEEP = { ...GUARD, t: [-5, -34], fn: [37, -12], khn: [1, -0.3], ff: [-4, 41] };
  const CHAMBER = { ...GUARD, t: [0, -34], fn: [16, 6], khn: [1, -1], ff: [-4, 41] };
  const ROUNDHOUSE = { ...GUARD, t: [-12, -32], hd: [0.8, -0.6], fn: [39, -16], khn: [1, -0.5], ff: [-2, 41], hf: [-10, -14], ehf: [0, 1] };
  const SIDE_THRUST = { ...GUARD, t: [-15, -31], hd: [1, 0], fn: [41, -4], khn: [1, -0.2], ff: [-3, 41] };
  const BACK_KICK = { ...GUARD, t: [17, -30], hd: [-0.3, -1], ff: [-40, -8], khf: [-1, -0.2], fn: [2, 41], hn: [22, -38], hf: [20, -36] };
  const KNEE_UP = { ...GUARD, t: [2, -34], fn: [4, 12], khn: [1, -1], ff: [-3, 41], hn: [28, -30], hf: [26, -29], ehn: [0, 1], ehf: [0, 1] };
  const SWITCHED = { ...GUARD, fn: [-12, 40], ff: [14, 40], khf: [1, -0.2], khn: [1, -0.3] };

  /*
   * Exercise library.
   * r: reps (or seconds) for Level I / II / III, exactly as used (Level I = intermediate).  u: 'reps' | 'sec'.  side: done on each side.
   * alt: alternating, number is the total.  tp: seconds per rep (for time estimates).
   * load: suggested weight.  cue: one-line how-to.
   */
  const EX = {
    // ---------------- CHEST ----------------
    pushup: { name: 'Push-ups', cat: 'chest', r: [15, 18, 20], tp: 2.5, cue: 'Hands under shoulders, body in one straight line, chest to a fist above the floor.', poses: [PLANK, PUSHB] },
    diamond_pushup: { name: 'Diamond push-ups', cat: 'chest', r: [10, 12, 14], tp: 2.6, cue: 'Hands together under your chest, elbows brush your ribs on the way down.', poses: [P(PLANK, { hn: [24, 18], hf: [25, 18] }), P(PUSHB, { hn: [24, 5], hf: [25, 5], eh: [-1, -0.4] })] },
    dive_bomber: { name: 'Dive-bomber push-ups', cat: 'chest', r: [8, 10, 12], tp: 3.5, cue: 'From a pike, swoop your chest forward just above the floor and up into a cobra. Push back to the pike.', poses: [
      { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36], mat: 1 },
      { t: [34, 6], hn: [44, 14], hf: [46, 14], eh: [-1, -0.2], fn: [-38, 14], ff: [-39, 14], mat: 1 },
      { t: [21.3, -26.5], hd: [1, -0.6], hn: [22, 6.5], hf: [24, 6.5], fn: [-40.5, 6.5], ff: [-41, 6.5], mat: 1 }] },
    db_floor_press: { name: 'Dumbbell floor press', cat: 'chest', r: [12, 15, 15], tp: 3, load: 'heavy', cue: 'Lie on your back, knees bent. Press both dumbbells up, lower until elbows touch the floor.', poses: [
      P(SUP, { hn: [26, -14], hf: [27, -14], eh: [0, 1], db: 'nf' }), P(SUP, { hn: [34, -33], hf: [35, -33], db: 'nf' })] },
    db_pullover: { name: 'Dumbbell pullover', cat: 'chest', r: [12, 15, 15], tp: 3.5, load: 'single', cue: 'Lie on your back holding one dumbbell over your chest. Lower it behind your head with long arms, pull back.', poses: [
      P(SUP, { hn: [34, -33], hf: [34, -33], db: 'both' }), P(SUP, { hn: [64, -13], hf: [64, -13], db: 'both' })] },
    spiderman_pushup: { name: 'Spiderman push-ups', cat: 'chest', r: [10, 12, 16], alt: 1, tp: 3, cue: 'As you lower, bring one knee to the outside of the same elbow. Alternate sides.', poses: [PLANK, P(PUSHB, { fn: [2, 4], khn: [1, 0] })] },
    explosive_pushup: { name: 'Explosive push-ups', cat: 'chest', r: [8, 10, 11], tp: 3, cue: 'Lower under control, then push hard enough that your hands leave the floor. Land soft.', poses: [PUSHB, P(PLANK, { hn: [33, 11], hf: [36, 11] })] },
    plank_to_pushup: { name: 'Plank up-downs', cat: 'chest', r: [10, 12, 14], tp: 4, cue: 'From a forearm plank, press up to straight arms one hand at a time, then come back down.', poses: [FOREARM, PLANK] },
    // ---------------- BACK ----------------
    pullup: { name: 'Pull-ups', cat: 'back', r: [4, 5, 6], tp: 4, equip: ['bar'], cue: 'Overhand grip, shoulder-width. Pull until your chin clears the bar, lower all the way.', poses: [HANG, PULLTOP] },
    chinup: { name: 'Chin-ups', cat: 'back', r: [4, 5, 6], tp: 4, equip: ['bar'], cue: 'Underhand grip, hands shoulder-width. Pull your chest toward the bar, lower slowly.', poses: [HANG, P(PULLTOP, { t: [-1, -34], hn: [7, -40], hf: [6, -40] })] },
    negative_pullup: { name: 'Slow negative pull-ups', cat: 'back', r: [4, 5, 6], tp: 7, equip: ['bar'], cue: 'Jump or step to the top position, then take 5 seconds to lower to a dead hang.', poses: [PULLTOP, PULLMID, HANG] },
    chin_hold: { name: 'Chin-over-bar hold', cat: 'back', u: 'sec', r: [20, 25, 30], equip: ['bar'], cue: 'Hold the top of a chin-up, chin above the bar, shoulders down away from your ears.', poses: [PULLTOP] },
    db_row: { name: 'Bent-over dumbbell rows', cat: 'back', r: [12, 15, 15], tp: 3, load: 'heavy', cue: 'Hinge forward with a flat back. Pull both dumbbells to your lower ribs, squeeze, lower.', poses: [P(HINGE, { hn: [27, 11], hf: [25, 11], db: 'nf' }), P(HINGE, { hn: [13, -5], hf: [12, -5], eh: [-1, -1], db: 'nf' })] },
    one_arm_row: { name: 'One-arm dumbbell row', cat: 'back', r: [12, 12, 14], side: 1, tp: 3, load: 'heavy', cue: 'Split stance, free hand on your front knee. Row the dumbbell to your hip, elbow close.', poses: [P(STAG, { hn: [30, 15], db: 'n' }), P(STAG, { hn: [14, -3], ehn: [-1, -1], db: 'n' })] },
    renegade_row: { name: 'Renegade rows', cat: 'back', r: [10, 12, 16], alt: 1, tp: 4, load: 'medium', cue: 'Plank on two dumbbells, feet wide. Row one to your hip without twisting, alternate.', poses: [P(PLANK, { hn: [30, 13], hf: [33, 13], db: 'nf' }), P(PLANK, { hn: [16, -2], ehn: [-1, -1], hf: [33, 13], db: 'nf' })] },
    kb_high_pull: { name: 'Kettlebell high pull', cat: 'back', r: [15, 15, 18], tp: 2.5, load: 'kb', cue: 'Hinge with the bell between your feet, drive your hips through and pull it to chest height, elbows high.', poses: [
      { t: [24, -24], fn: [7, 37], ff: [5, 37], kh: [1, -0.3], hn: [20, 8], hf: [20, 8], kb: 'both', kbd: [0, 1] },
      { t: [-2, -34], fn: [1, 41], ff: [-1, 41], hn: [9, -27], hf: [9, -27], eh: [-1, -1], kb: 'both', kbd: [0, 1] }] },
    superman: { name: 'Supermans', cat: 'back', r: [15, 18, 20], tp: 2.5, cue: 'Face down, arms forward. Lift arms, chest and legs off the floor, pause, lower.', poses: [
      { t: [34, 0], hn: [67, 1], hf: [67, 2], fn: [-41, 1], ff: [-41, 2], mat: 1 },
      { t: [33, -7], hn: [64, -12], hf: [64, -11], fn: [-40, -8], ff: [-40, -7], mat: 1 }] },
    // ---------------- ABS ----------------
    crunch: { name: 'Crunches', cat: 'abs', r: [25, 30, 35], tp: 1.8, cue: 'Knees bent, fingertips at your temples. Curl your shoulders off the floor, lower slowly.', poses: [
      P(SUP, { hn: [41, -6], hf: [41, -6], eh: [0.3, -1] }), P(SUP, { t: [30, -16], hn: [36, -24], hf: [36, -24], eh: [1, -0.2] })] },
    situp: { name: 'Sit-ups', cat: 'abs', r: [15, 20, 25], tp: 2.8, cue: 'Knees bent, arms crossed on your chest. Sit all the way up, lower with control.', poses: [
      P(SUP, { hn: [26, -6], hf: [26, -6], eh: [0, 1] }), P(SUP, { t: [-5, -34], hn: [0, -24], hf: [0, -24], eh: [0.5, 1] })] },
    db_situp: { name: 'Weighted sit-ups', cat: 'abs', r: [12, 15, 18], tp: 3, load: 'single', cue: 'Hold one dumbbell against your chest and sit all the way up.', poses: [
      P(SUP, { hn: [26, -6], hf: [26, -6], eh: [0, 1], db: 'both' }), P(SUP, { t: [-5, -34], hn: [0, -24], hf: [0, -24], eh: [0.5, 1], db: 'both' })] },
    leg_raise: { name: 'Leg raises', cat: 'abs', r: [12, 15, 18], tp: 3, cue: 'On your back, legs straight. Raise them to vertical, lower until heels hover.', poses: [
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [-41, -4], ff: [-41, -3], mat: 1 },
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [1, -41], ff: [2, -41], mat: 1 }] },
    weighted_crunch: { name: 'Weighted crunches', cat: 'abs', r: [20, 25, 30], tp: 2, load: 'single', cue: 'Hold one dumbbell on your chest, knees bent. Curl your shoulders up, lower slowly.', poses: [
      P(SUP, { hn: [24, -5], hf: [24, -5], eh: [0, 1], db: 'both' }), P(SUP, { t: [30, -16], hn: [22, -20], hf: [22, -20], eh: [0.3, 1], db: 'both' })] },
    weighted_dead_bug: { name: 'Weighted dead bugs', cat: 'abs', r: [16, 20, 24], alt: 1, tp: 2.2, load: 'single', cue: 'Hold one dumbbell or the kettlebell over your chest with straight arms. Lower one leg at a time to hover, back flat.', poses: [
      { t: [34, 0], hn: [35, -33], hf: [35, -33], db: 'both', fn: [-20, -21], khn: [0.3, -1], ff: [-40, -7], mat: 1 },
      { t: [34, 0], hn: [35, -33], hf: [35, -33], db: 'both', fn: [-40, -7], ff: [-20, -21], khf: [0.3, -1], mat: 1 }] },
    db_side_bend: { name: 'Dumbbell side bends', cat: 'abs', view: 'front', r: [12, 15, 15], side: 1, tp: 2.5, load: 'single', cue: 'Stand tall with one heavy dumbbell at your side. Bend sideways toward it, then pull yourself upright with your obliques. Switch sides.', poses: [
      { t: [0, -34], hn: [-12, 0], hf: [10, -4], ehf: [1, 0.3], fn: [-10, 41], ff: [10, 41], db: 'n' },
      { t: [-9, -33], hn: [-19, 4], hf: [9, -4], ehf: [1, 0.3], fn: [-10, 41], ff: [10, 41], db: 'n' }] },
    weighted_toe_touch: { name: 'Weighted toe touches', cat: 'abs', r: [12, 15, 20], tp: 2.2, load: 'single', cue: 'Legs straight up, one dumbbell in both hands. Reach it up toward your toes, lifting your shoulders.', poses: [
      { t: [34, 0], hn: [34, -33], hf: [34, -33], db: 'both', fn: [1, -41], ff: [2, -41], mat: 1 },
      { t: [29, -18], hn: [8, -41], hf: [8, -41], db: 'both', fn: [1, -41], ff: [2, -41], mat: 1 }] },
    plank: { name: 'Forearm plank', cat: 'abs', u: 'sec', r: [50, 60, 70], cue: 'Elbows under shoulders, squeeze glutes, body straight from head to heels.', poses: [FOREARM] },
    side_plank: { name: 'Side plank', cat: 'abs', u: 'sec', r: [30, 40, 50], side: 1, cue: 'On one forearm, feet stacked, hips high. Top arm reaches up. Switch sides.', poses: [P(FOREARM, { hf: [34, -41], ehf: [0, -1] })] },
    bicycle_crunch: { name: 'Bicycle crunches', cat: 'abs', r: [24, 30, 36], alt: 1, tp: 1.3, cue: 'Shoulders up, bring one knee in while the other leg extends. Rotate elbow toward knee.', poses: [
      { t: [30, -16], hn: [36, -24], hf: [36, -24], eh: [1, -0.2], fn: [-14, -19], khn: [1, -1], ff: [-40, -9], mat: 1 },
      { t: [30, -16], hn: [36, -24], hf: [36, -24], eh: [1, -0.2], ff: [-14, -19], khf: [1, -1], fn: [-40, -9], mat: 1 }] },
    russian_twist: { name: 'Russian twists', cat: 'abs', r: [24, 30, 36], alt: 1, tp: 1.3, load: 'single', cue: 'Sit back with feet up, hold a dumbbell and touch it to the floor beside each hip.', poses: [
      P(VSEAT, { hn: [4, 2], hf: [4, 2], db: 'both' }), P(VSEAT, { hn: [11, -15], hf: [11, -15], eh: [0, 1], db: 'both' })] },
    flutter_kicks: { name: 'Flutter kicks', cat: 'abs', r: [30, 40, 44], alt: 1, tp: 0.8, cue: 'Lower back pressed down, legs straight, small fast kicks just above the floor.', poses: [
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [-40, -12], ff: [-41, -2], mat: 1 },
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], ff: [-40, -12], fn: [-41, -2], mat: 1 }] },
    hollow_hold: { name: 'Hollow hold', cat: 'abs', u: 'sec', r: [30, 40, 50], cue: 'Lower back glued to the floor, arms and legs long and lifted. Hold.', poses: [{ t: [33, -8], hn: [64, -17], hf: [64, -16], fn: [-40, -9], ff: [-40, -8], mat: 1 }] },
    v_up: { name: 'V-ups', cat: 'abs', r: [10, 12, 14], tp: 3, cue: 'From flat, lift straight arms and legs at the same time and reach for your toes.', poses: [
      { t: [34, 0], hn: [67, -2], hf: [67, -1], fn: [-41, -2], ff: [-41, -1], mat: 1 },
      { t: [18, -29], hn: [-13, -38], hf: [-13, -37], fn: [-24, -33], ff: [-24, -32], mat: 1 }] },
    dead_bug: { name: 'Dead bugs', cat: 'abs', r: [16, 20, 24], alt: 1, tp: 2, cue: 'Arms up, knees bent at 90°. Lower opposite arm and leg to the floor, switch.', poses: [
      { t: [34, 0], hn: [64, -8], hf: [35, -33], fn: [-20, -21], khn: [0.3, -1], ff: [-40, -7], mat: 1 },
      { t: [34, 0], hn: [35, -33], hf: [64, -8], fn: [-40, -7], ff: [-20, -21], khf: [0.3, -1], mat: 1 }] },
    mountain_climber: { name: 'Mountain climbers', cat: 'abs', r: [30, 40, 44], alt: 1, tp: 0.8, cue: 'High plank, drive knees to your chest one after the other, hips level.', poses: [P(PLANK, { fn: [8, 16], khn: [1, 0] }), P(PLANK, { ff: [8, 16], khf: [1, 0] })] },
    shoulder_taps: { name: 'Plank shoulder taps', cat: 'abs', r: [20, 24, 28], alt: 1, tp: 1.3, cue: 'High plank, feet wide. Tap each hand to the opposite shoulder without rocking.', poses: [PLANK, P(PLANK, { hn: [26, -8], ehn: [-0.2, 1] })] },
    reverse_crunch: { name: 'Reverse crunches', cat: 'abs', r: [15, 18, 20], tp: 2.5, cue: 'Knees bent at 90°, curl your hips off the floor toward your chest, lower slowly.', poses: [
      { t: [34, 0], hn: [4, 2], hf: [4, 2], eh: [0, -1], fn: [-20, -21], ff: [-21, -21], kh: [0.3, -1], mat: 1 },
      { t: [33, 8], hd: [1, 0], hn: [8, 10], hf: [8, 10], eh: [0, -1], fn: [4, -26], ff: [3, -26], kh: [1, -0.4], mat: 1 }] },
    toe_touch: { name: 'Toe-touch crunches', cat: 'abs', r: [15, 20, 25], tp: 2, cue: 'Legs straight up, reach your hands to your toes, lifting shoulders off the floor.', poses: [
      { t: [34, 0], hn: [34, -33], hf: [35, -33], fn: [1, -41], ff: [2, -41], mat: 1 },
      { t: [29, -18], hn: [6, -41], hf: [7, -41], fn: [1, -41], ff: [2, -41], mat: 1 }] },
    bird_dog: { name: 'Bird dogs', cat: 'abs', r: [16, 20, 24], alt: 1, tp: 2.5, cue: 'On all fours, reach one arm forward and the opposite leg back, pause, switch.', poses: [
      { t: [32, -12], hn: [32, 21], hf: [34, 21], fn: [-20, 21], ff: [-21, 21], kh: [0.5, 1], mat: 1 },
      { t: [32, -12], hn: [65, -15], hf: [34, 21], fn: [-20, 21], ff: [-41, -3], kh: [0.5, 1], mat: 1 }] },
    knee_tuck: { name: 'Seated knee tucks', cat: 'abs', r: [15, 20, 25], tp: 2.5, cue: 'Sit back on your hands, feet off the floor. Pull knees to chest, extend legs long.', poses: [
      { t: [-17, -29], hn: [-25, 3], hf: [-26, 3], eh: [1, 0], fn: [39, -8], ff: [39, -7], mat: 1 },
      { t: [-15, -30], hn: [-25, 3], hf: [-26, 3], eh: [1, 0], fn: [12, -12], ff: [12, -11], kh: [0.2, -1], mat: 1 }] },
    // ---------------- CARDIO ----------------
    jumping_jacks: { name: 'Jumping jacks', cat: 'cardio', view: 'front', r: [40, 50, 55], tp: 0.8, cue: 'Jump feet wide while arms go overhead, jump back together.', poses: [
      FSTAND, { t: [0, -34], hn: [-22, -62], hf: [22, -62], fn: [-20, 38], ff: [20, 38], lift: 4 }] },
    high_knees: { name: 'High knees', cat: 'cardio', r: [40, 50, 56], alt: 1, tp: 0.6, cue: 'Run on the spot, knees to hip height, pump your arms.', poses: [
      { t: [2, -34], fn: [21, 20], khn: [1, -1], ff: [0, 41], hn: [12, -20], ehn: [0, 1], hf: [-10, -10], ehf: [-1, 0.3] },
      { t: [2, -34], ff: [21, 20], khf: [1, -1], fn: [0, 41], hf: [12, -20], ehf: [0, 1], hn: [-10, -10], ehn: [-1, 0.3] }] },
    burpee: { name: 'Burpees', cat: 'cardio', r: [10, 12, 14], tp: 4, cue: 'Squat, hands down, jump feet back to a plank, jump them in, jump up with arms overhead.', poses: [BSQ, P(PLANK, { mat: 0 }), JUMP] },
    squat_jump: { name: 'Squat jumps', cat: 'cardio', r: [12, 15, 18], tp: 2.5, cue: 'Squat until thighs are near parallel, explode up, land soft into the next rep.', poses: [P(SQUAT, { hn: [-4, 6], hf: [-6, 6] }), JUMP] },
    jump_lunge: { name: 'Jump lunges', cat: 'cardio', r: [16, 20, 24], alt: 1, tp: 2, cue: 'From a lunge, jump and switch legs in the air, land in a lunge on the other side.', poses: [LUNGE_N, LUNGE_F] },
    butt_kicks: { name: 'Butt kicks', cat: 'cardio', r: [40, 50, 56], alt: 1, tp: 0.6, cue: 'Jog on the spot, kicking your heels up toward your glutes.', poses: [
      { t: [2, -34], fn: [-7, 7], khn: [0.2, 1], ff: [0, 41], hn: [10, -14], ehn: [0, 1], hf: [-8, -8] },
      { t: [2, -34], ff: [-7, 7], khf: [0.2, 1], fn: [0, 41], hf: [10, -14], ehf: [0, 1], hn: [-8, -8] }] },
    punches: { name: 'Fast punches', cat: 'cardio', r: [40, 50, 56], alt: 1, tp: 0.6, cue: 'Boxing stance, hands up. Throw fast straight punches, left and right, back to guard.', poses: [
      { t: [0, -34], hn: [9, -36], hf: [7, -38], eh: [0, 1], fn: [10, 40], ff: [-12, 39] },
      { t: [1, -34], hn: [34, -36], hf: [7, -38], ehf: [0, 1], fn: [10, 40], ff: [-12, 39] }] },
    squat_thrust: { name: 'Squat thrusts', cat: 'cardio', r: [12, 15, 18], tp: 2.8, cue: 'Hands down, jump feet back to a plank, jump them back in. Keep the pace up.', poses: [BSQ, P(PLANK, { mat: 0 })] },
    kb_swing: { name: 'Kettlebell swings', cat: 'cardio', r: [20, 25, 30], tp: 2, load: 'kb', cue: 'Hike the bell back between your legs, snap your hips forward to float it to chest height.', poses: [SWING_LOW, { t: [-3, -34], fn: [1, 41], ff: [-1, 41], hn: [30, -36], hf: [30, -36], kb: 'both' }] },
    // ---------------- UPPER ----------------
    db_shoulder_press: { name: 'Dumbbell shoulder press', cat: 'upper', view: 'front', r: [12, 12, 14], tp: 3, load: 'medium', cue: 'Dumbbells at shoulder height, brace your core and press straight overhead.', poses: [
      P(FSTAND, { hn: [-17, -38], hf: [17, -38], ehn: [-1, 1], ehf: [1, 1], db: 'nf' }), P(FSTAND, { hn: [-12, -65], hf: [12, -65], db: 'nf' })] },
    lateral_raise: { name: 'Lateral raises', cat: 'upper', view: 'front', r: [12, 15, 18], tp: 3, load: 'light', cue: 'Soft elbows, raise the dumbbells out to the sides to shoulder height, lower slowly.', poses: [
      P(FSTAND, { db: 'nf' }), P(FSTAND, { hn: [-41, -29], hf: [41, -29], db: 'nf' })] },
    db_curl: { name: 'Dumbbell curls', cat: 'upper', r: [12, 12, 14], tp: 3, load: 'medium', cue: 'Palms forward, elbows pinned to your sides. Curl up, lower slowly.', poses: [
      P(STAND, { db: 'nf' }), P(STAND, { hn: [8, -30], hf: [6, -30], eh: [-0.2, 1], db: 'nf' })] },
    hammer_curl: { name: 'Hammer curls', cat: 'upper', r: [12, 12, 14], tp: 3, load: 'medium', cue: 'Palms facing each other, elbows still. Curl to your shoulders and lower.', poses: [
      P(STAND, { db: 'nf' }), P(STAND, { hn: [8, -30], hf: [6, -30], eh: [-0.2, 1], db: 'nf' })] },
    db_skullcrusher: { name: 'Lying triceps extensions', cat: 'upper', r: [12, 12, 14], tp: 3, load: 'light', cue: 'Lying down, arms up. Bend only at the elbows to lower the dumbbells beside your head.', poses: [
      P(SUP, { hn: [34, -33], hf: [35, -33], db: 'nf' }), P(SUP, { hn: [45, -8], hf: [46, -8], eh: [0, -1], db: 'nf' })] },
    overhead_triceps_ext: { name: 'Overhead triceps extension', cat: 'upper', r: [12, 15, 18], tp: 3, load: 'single', cue: 'Hold one dumbbell overhead with both hands, lower it behind your head, extend.', poses: [
      P(STAND, { hn: [2, -67], hf: [2, -67], db: 'both' }), P(STAND, { hn: [-9, -42], hf: [-9, -42], eh: [0.4, -1], db: 'both' })] },
    db_kickback: { name: 'Dumbbell kickbacks', cat: 'upper', r: [12, 12, 15], tp: 2.8, load: 'light', cue: 'Hinge forward, upper arms pinned to your sides. Straighten your elbows to push the dumbbells back.', poses: [
      P(HINGE, { hn: [13, 6], hf: [12, 6], eh: [-1, -1], db: 'nf' }), P(HINGE, { hn: [-2, -8], hf: [-3, -8], eh: [-1, -1], db: 'nf' })] },
    pike_pushup: { name: 'Pike push-ups', cat: 'upper', r: [10, 12, 14], tp: 3, cue: 'Hips high in an upside-down V. Bend your elbows to bring your head toward the floor.', poses: [
      { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36], mat: 1 },
      { t: [25, 23], hn: [44, 36], hf: [45, 36], eh: [-1, -1], fn: [-19.6, 36], ff: [-21, 36], mat: 1 }] },
    kb_press: { name: 'Kettlebell press', cat: 'upper', r: [8, 8, 10], side: 1, tp: 3, load: 'kb', cue: 'Bell racked at your shoulder, press it overhead until your arm is straight. Switch sides.', poses: [RACK, PRESS_UP] },
    db_front_raise: { name: 'Front raises', cat: 'upper', r: [12, 12, 14], tp: 3, load: 'light', cue: 'Straight arms, lift the dumbbells in front of you to shoulder height, lower slowly.', poses: [
      P(STAND, { db: 'nf' }), P(STAND, { hn: [33, -36], hf: [33, -36], db: 'nf' })] },
    kb_clean_press: { name: 'Kettlebell clean & press', cat: 'full', r: [6, 8, 8], side: 1, tp: 5, load: 'kb', cue: 'Swing the bell up into the rack at your shoulder, press overhead, lower back down. Switch sides.', poses: [
      { t: [24, -24], fn: [7, 37], ff: [5, 37], kh: [1, -0.3], hn: [14, 8], hf: [26, 2], kb: 'n' }, RACK, PRESS_UP] },
    db_thruster: { name: 'Dumbbell thrusters', cat: 'full', r: [12, 12, 14], tp: 3.5, load: 'medium', cue: 'Squat with dumbbells at your shoulders, drive up and press them overhead in one move.', poses: [
      P(SQUAT, { hn: [21, -34], hf: [20, -34], eh: [0.6, 1], db: 'nf' }), P(STAND, { hn: [2, -67], hf: [1, -67], db: 'nf' })] },
    // ---------------- LOWER ----------------
    goblet_squat: { name: 'Goblet squats', cat: 'lower', r: [15, 15, 18], tp: 3, load: 'kb', cue: 'Hold the bell by the horns at your chest. Sit down between your heels, chest up, stand.', poses: [
      P(STAND, { hn: [8, -24], hf: [8, -24], eh: [0.3, 1], kb: 'both', kbd: [0, 1] }),
      { t: [12, -32], fn: [18, 20], ff: [16, 20], kh: [1, -1], hn: [20, -22], hf: [20, -22], eh: [0.3, 1], kb: 'both', kbd: [0, 1] }] },
    db_lunge: { name: 'Dumbbell lunges', cat: 'lower', r: [20, 20, 24], alt: 1, tp: 2.8, load: 'medium', cue: 'Step forward and lower until both knees are at 90°, push back. Alternate legs.', poses: [P(STAND, { db: 'nf' }), P(LUNGE_N, { hn: [1, -1], hf: [-1, -1], db: 'nf' })] },
    reverse_lunge: { name: 'Reverse lunges', cat: 'lower', r: [20, 24, 28], alt: 1, tp: 2.5, cue: 'Step back and lower the back knee toward the floor, drive through the front heel.', poses: [P(STAND, HANDS_HIPS), P(LUNGE_F, HANDS_HIPS)] },
    split_squat: { name: 'Dumbbell split squats', cat: 'lower', r: [10, 12, 12], side: 1, tp: 3, load: 'medium', cue: 'Long split stance, dumbbells at your sides. Lower the back knee toward the floor, stand up. Switch legs.', poses: [
      { t: [0, -34], fn: [14, 39], ff: [-24, 34], khf: [0.3, 1], hn: [1, -1], hf: [-1, -1], db: 'nf' }, P(LUNGE_N, { hn: [1, -1], hf: [-1, -1], db: 'nf' })] },
    db_squat: { name: 'Dumbbell squats', cat: 'lower', r: [15, 15, 18], tp: 3, load: 'heavy', cue: 'Dumbbells hanging at your sides, feet shoulder-width. Sit down until thighs are parallel, drive up.', poses: [
      P(STAND, { db: 'nf' }), { t: [15, -30], fn: [14, 26], ff: [12, 26], kh: [1, -0.8], hn: [17, 2], hf: [16, 2], db: 'nf' }] },
    db_rdl: { name: 'Romanian deadlifts', cat: 'lower', r: [12, 15, 15], tp: 3, load: 'heavy', cue: 'Soft knees, push your hips back and slide the dumbbells down your thighs, stand tall.', poses: [
      P(STAND, { hn: [5, -1], hf: [4, -1], db: 'nf' }), { t: [30, -16], fn: [4, 40], ff: [2, 40], hn: [31, 17], hf: [30, 17], db: 'nf' }] },
    single_leg_rdl: { name: 'Single-leg deadlifts', cat: 'lower', r: [10, 10, 11], side: 1, tp: 3.5, load: 'medium', cue: 'Balance on one leg, hinge forward as the other leg lifts behind you, stand up. Switch.', poses: [
      P(STAND, { hn: [4, -1], hf: [2, -1], db: 'n' }), { t: [33, -8], ff: [2, 41], hn: [33, 25], hf: [31, 24], fn: [-40, -7], db: 'n' }] },
    kb_sumo_deadlift: { name: 'Kettlebell sumo deadlift', cat: 'lower', view: 'front', r: [15, 15, 18], tp: 2.5, load: 'kb', cue: 'Wide stance, toes out. Grip the bell between your feet, flat back, stand up tall.', poses: [
      { t: [0, -24], hn: [-3, 10], hf: [3, 10], fn: [-20, 24], ff: [20, 24], kb: 'both', kbd: [0, 1] },
      { t: [0, -34], hn: [-3, 0], hf: [3, 0], fn: [-20, 37], ff: [20, 37], kb: 'both', kbd: [0, 1] }] },
    glute_bridge: { name: 'Glute bridges', cat: 'lower', r: [20, 20, 25], tp: 2, cue: 'Feet flat, knees bent. Drive your hips up until knees, hips and shoulders line up.', poses: [GB_DOWN, GB_UP] },
    single_leg_bridge: { name: 'Single-leg glute bridges', cat: 'lower', r: [12, 12, 14], side: 1, tp: 2.5, cue: 'One foot planted, other leg straight. Lift your hips high, lower. Switch sides.', poses: [P(GB_DOWN, { fn: [-29, -29] }), P(GB_UP, { fn: [-38, -14] })] },
    wall_sit: { name: 'Wall sit', cat: 'lower', u: 'sec', r: [50, 60, 70], cue: 'Back flat against a wall, thighs parallel to the floor. Hold.', poses: [{ t: [0, -34], fn: [21, 20], ff: [19, 20], kh: [1, -1], hn: [14, -3], hf: [12, -3], wall: -6 }] },
    lateral_lunge: { name: 'Lateral lunges', cat: 'lower', view: 'front', r: [16, 16, 20], alt: 1, tp: 3, load: 'kb', cue: 'Hold the bell at your chest, step wide to one side and sit back on that leg. Alternate.', poses: [
      { t: [0, -34], hn: [-3, -22], hf: [3, -22], ehn: [-0.3, 1], ehf: [0.3, 1], kb: 'both', kbd: [0, 1], fn: [-8, 41], ff: [8, 41] },
      { t: [-3, -30], hn: [-6, -18], hf: [0, -18], ehn: [-0.3, 1], ehf: [0.3, 1], kb: 'both', kbd: [0, 1], fn: [-9, 26], ff: [36, 26], khn: [-1, -0.2] }] },

    // ---------------- ADDED FOR THE PROGRAM LIBRARY ----------------
    archer_pushup: { name: 'Archer push-ups', cat: 'chest', r: [6, 8, 10], alt: 1, tp: 3.5, mus: 'chest triceps | front_delts abs', cue: 'Hands wide. Lower toward one hand while the other arm slides out straight, push back up. Alternate sides.', poses: [
      PLANK, { t: [34, -4], hn: [29, 5], eh: [-0.4, -1], hf: [58, 6], fn: [-40, 5], ff: [-42, 5], mat: 1 }] },
    shrimp_squat: { name: 'Shrimp squats', cat: 'lower', r: [5, 6, 8], side: 1, tp: 4, mus: 'quads glutes | hamstrings', cue: 'Stand on one leg holding the other foot behind you. Lower until the back knee touches the floor, stand up. Switch.', poses: [
      { t: [4, -34], fn: [2, 41], ff: [-8, -2], khf: [0.2, 1], hf: [-8, -2], ehf: [-1, 0.2], hn: [16, -16] },
      { t: [16, -30], fn: [14, 26], khn: [1, -0.8], ff: [-16, 10], khf: [0.2, 1], hf: [-6, 4], hn: [44, -22] }] },
    cossack_squat: { name: 'Cossack squats', cat: 'lower', view: 'front', r: [10, 12, 14], alt: 1, tp: 3.5, mus: 'adductors quads glutes | hamstrings', cue: 'Very wide stance. Sit down over one foot while the other leg stays straight, toes up. Shift to the other side.', poses: [
      { t: [0, -34], hn: [-6, -20], hf: [6, -20], ehn: [-0.3, 1], ehf: [0.3, 1], fn: [-22, 37], ff: [22, 37] },
      { t: [-6, -30], hn: [2, -16], hf: [10, -16], ehn: [-0.3, 1], ehf: [0.3, 1], fn: [-10, 20], khn: [-1, -0.2], ff: [38, 20] }] },
    turkish_getup: { name: 'Turkish get-ups', cat: 'full', r: [2, 3, 3], side: 1, tp: 22, load: 'kb', mus: 'front_delts abs obliques | glutes triceps', cue: 'Lying down, press the bell up and keep your eyes on it. Roll to your elbow, then hand, sweep to a half-kneel and stand. Reverse it slowly. Switch sides.', poses: [
      { t: [34, 0], hn: [34, -33], kb: 'n', kbd: [0, -1], fn: [-24, 0], khn: [0.2, -1], ff: [-41, 1], hf: [8, 2], ehf: [0, -1], mat: 1 },
      { t: [-12, -32], hn: [-10, -65], kb: 'n', kbd: [0, -1], hf: [-28, 3], fn: [24, 0], khn: [0.2, -1], ff: [40, 3], mat: 1 },
      { t: [-2, -34], hn: [0, -67], kb: 'n', kbd: [0, -1], hf: [4, -2], fn: [-30, 20], khn: [0.3, 1], ff: [22, 20], khf: [1, -1], mat: 1 }] },
    suitcase_march: { name: 'Suitcase march', cat: 'abs', u: 'sec', r: [30, 40, 45], side: 1, load: 'kb', mus: 'obliques abs forearms | hip_flexors upper_back', cue: 'Hold the kettlebell at one side, stand tall without leaning and march slowly on the spot, knees to hip height. Switch hands.', poses: [
      { t: [0, -34], hn: [2, -1], kb: 'n', kbd: [0, 1], hf: [8, -18], ehf: [0, 1], fn: [0, 41], ff: [21, 20], khf: [1, -1] },
      { t: [0, -34], hn: [2, -1], kb: 'n', kbd: [0, 1], hf: [8, -18], ehf: [0, 1], ff: [0, 41], fn: [21, 20], khn: [1, -1] }] },
    kb_snatch: { name: 'Kettlebell snatches', cat: 'full', r: [8, 10, 12], side: 1, tp: 2.6, load: 'kb', mus: 'glutes hamstrings front_delts | upper_back forearms abs', cue: 'Swing the bell back, drive your hips and let it float straight up to a locked-out arm overhead, punching through at the top. Switch hands.', poses: [
      { t: [26, -21], fn: [6, 39], ff: [4, 39], kh: [1, -0.3], hn: [6, 8], hf: [18, -2], kb: 'n' },
      { t: [-1, -34], fn: [1, 41], ff: [-1, 41], hn: [10, -30], ehn: [-1, -1], hf: [4, -2], kb: 'n', kbd: [0, 1] },
      P(STAND, { hn: [2, -67], kb: 'n', kbd: [-0.5, 0.35] })] },
    kb_front_squat: { name: 'Kettlebell front squats', cat: 'lower', r: [8, 10, 12], side: 1, tp: 3, load: 'kb', mus: 'quads glutes | abs front_delts', cue: 'Hold the bell racked at one shoulder, elbow tucked. Squat deep with your chest up, stand. Switch sides.', poses: [
      RACK, { t: [12, -32], fn: [18, 20], ff: [16, 20], kh: [1, -1], hn: [18, -36], ehn: [0.2, 1], kb: 'n', kbd: [-0.6, 0.5], hf: [30, -20] }] },
    kb_deadlift: { name: 'Kettlebell deadlifts', cat: 'lower', r: [15, 18, 20], tp: 2.5, load: 'kb', mus: 'hamstrings glutes | lower_back forearms', cue: 'Bell between your feet. Hips back, flat back, grip the handle and stand up tall, then lower it under control.', poses: [
      { t: [24, -24], fn: [7, 37], ff: [5, 37], kh: [1, -0.3], hn: [16, 9], hf: [16, 9], kb: 'both', kbd: [0, 1] },
      P(STAND, { hn: [6, -1], hf: [6, -1], kb: 'both', kbd: [0, 1] })] },
    dead_hang: { name: 'Dead hang', cat: 'back', u: 'sec', r: [30, 40, 50], equip: ['bar'], mus: 'forearms lats | upper_back', cue: 'Hang from the bar with straight arms and a strong grip, shoulders slightly engaged. Breathe.', poses: [HANG] },
    scap_pullup: { name: 'Scapular pull-ups', cat: 'back', r: [8, 10, 12], tp: 2.5, equip: ['bar'], mus: 'upper_back lats | forearms', cue: 'From a dead hang with straight arms, pull your shoulder blades down and together to lift a few centimetres, then relax.', poses: [HANG, P(HANG, { hn: [3, -63], hf: [1, -63] })] },
    kb_halo: { name: 'Kettlebell halos', cat: 'abs', view: 'front', r: [10, 12, 14], alt: 1, tp: 2.5, load: 'kb', mus: 'front_delts side_delts | triceps abs obliques', cue: 'Hold the bell upside down by the horns and circle it around your head, close to your neck. Alternate directions.', poses: [
      P(FSTAND, { hn: [-16, -46], hf: [-4, -46], kb: 'both', kbd: [0, -1] }), P(FSTAND, { hn: [4, -46], hf: [16, -46], kb: 'both', kbd: [0, -1] })] },
    bear_crawl: { name: 'Bear crawl', cat: 'abs', u: 'sec', r: [30, 40, 45], mus: 'abs front_delts quads | triceps hip_flexors', cue: 'On hands and toes with knees hovering just off the floor, crawl forward and back in small steps, back flat.', poses: [
      { t: [32, -12], hn: [32, 21], hf: [34, 21], fn: [-16, 21], ff: [-17, 21], kh: [1, 1], mat: 1 },
      { t: [32, -12], hn: [42, 21], hf: [30, 21], fn: [-20, 21], ff: [-10, 21], kh: [1, 1], mat: 1 }] },
    hollow_rock: { name: 'Hollow rocks', cat: 'abs', r: [15, 20, 25], tp: 1.2, mus: 'abs | hip_flexors', cue: 'Hold the hollow position, arms and legs long, and rock gently from shoulders to hips without breaking the shape.', poses: [
      { t: [33, -8], hn: [64, -17], hf: [64, -16], fn: [-40, -9], ff: [-40, -8], mat: 1 },
      { t: [32, -13], hn: [62, -24], hf: [62, -23], fn: [-41, -3], ff: [-41, -2], mat: 1 }] },
    // ---------------- WARM-UP (dynamic, before the workout) ----------------
    arm_circles: { name: 'Arm circles', cat: 'warmup', view: 'front', u: 'sec', r: [30, 30, 30], mus: 'front_delts side_delts rear_delts | chest upper_back', cue: 'Arms out to the sides, draw circles that grow bigger. Switch direction halfway.', poses: [
      P(FSTAND, { hn: [-41, -30], hf: [41, -30] }), P(FSTAND, { hn: [-33, -54], hf: [33, -54] })] },
    inchworm: { name: 'Inchworms', cat: 'warmup', u: 'sec', r: [30, 30, 30], mus: 'hamstrings abs | chest front_delts calves', cue: 'Fold forward, walk your hands out to a plank, then walk them back and stand up. Keep it slow.', poses: [
      { t: [16, 29], hn: [28, 41], hf: [30, 41], eh: [1, 0], fn: [3, 41], ff: [1, 41] },
      { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36] }, P(PLANK, { mat: 0 })] },
    cat_cow: { name: 'Cat-cow', cat: 'warmup', u: 'sec', r: [30, 30, 30], mus: 'lower_back upper_back | abs', cue: 'On all fours, round your back and drop your head, then arch and look up. Move with your breath.', poses: [
      { t: [32, -12], hd: [0.3, 1], hn: [32, 21], hf: [34, 21], fn: [-20, 21], ff: [-21, 21], kh: [0.5, 1], mat: 1 },
      { t: [32, -12], hd: [1, -0.8], hn: [32, 21], hf: [34, 21], fn: [-20, 21], ff: [-21, 21], kh: [0.5, 1], mat: 1 }] },
    leg_swings: { name: 'Leg swings', cat: 'warmup', u: 'sec', r: [15, 15, 15], side: 1, mus: 'hip_flexors hamstrings | glutes adductors', cue: 'Stand tall, one hand on a wall if needed. Swing one leg forward and back, a little higher each time.', poses: [
      { t: [0, -34], fn: [30, 26], ff: [0, 41], hn: [10, -8], hf: [-6, -4] },
      { t: [2, -34], fn: [-24, 33], ff: [0, 41], hn: [10, -8], hf: [-6, -4] }] },
    bw_squat: { name: 'Bodyweight squats', cat: 'warmup', u: 'sec', r: [30, 30, 30], mus: 'quads glutes | adductors', cue: 'Easy squats with your arms forward, going a little deeper each rep.', poses: [
      STAND, { t: [15, -30], fn: [14, 26], ff: [12, 26], kh: [1, -0.8], hn: [46, -26], hf: [46, -24] }] },
    worlds_greatest: { name: "World's greatest stretch", cat: 'warmup', u: 'sec', r: [15, 15, 15], side: 1, mus: 'hip_flexors hamstrings glutes | upper_back adductors', cue: 'Step into a deep lunge, both hands down inside the front foot, then open the inside arm up to the ceiling.', poses: [
      { t: [31, -15], fn: [21, 20], khn: [1, -1], ff: [-27, 17], khf: [0.3, 1], hn: [30, 18], hf: [32, 18] },
      { t: [31, -15], fn: [21, 20], khn: [1, -1], ff: [-27, 17], khf: [0.3, 1], hf: [32, 18], hn: [31, -48], ehn: [-1, 0] }] },
    // ---------------- COOL-DOWN (static stretches, after the workout) ----------------
    chest_opener: { name: 'Chest opener', cat: 'cooldown', u: 'sec', r: [30, 30, 30], mus: 'chest front_delts | biceps', cue: 'Clasp your hands behind your back, straighten your arms and lift your chest.', poses: [
      { t: [2, -34], hd: [0.4, -1], hn: [-14, -4], hf: [-14, -4], fn: [2, 41], ff: [-2, 41] }] },
    cross_body_shoulder: { name: 'Cross-body shoulder stretch', cat: 'cooldown', view: 'front', u: 'sec', r: [15, 15, 15], side: 1, mus: 'rear_delts side_delts | upper_back', cue: 'Pull one straight arm across your chest with the other hand. Switch arms.', poses: [
      P(FSTAND, { hn: [24, -31], hf: [8, -28], ehf: [1, 1] })] },
    overhead_triceps: { name: 'Overhead triceps stretch', cat: 'cooldown', view: 'front', u: 'sec', r: [15, 15, 15], side: 1, mus: 'triceps lats |', cue: 'Reach one hand down between your shoulder blades and gently press the elbow with the other hand. Switch.', poses: [
      P(FSTAND, { hn: [2, -52], ehn: [-0.5, -1], hf: [-10, -55], ehf: [1, -0.2] })] },
    childs_pose: { name: "Child's pose", cat: 'cooldown', u: 'sec', r: [30, 30, 30], mus: 'lats lower_back | upper_back', cue: 'Sit back on your heels, reach your arms forward on the floor and let your chest sink.', poses: [
      { t: [32, 10], hn: [63, 17], hf: [64, 17], fn: [-5, 17], ff: [-6, 17], kh: [1, 0.5], mat: 1 }] },
    cobra_stretch: { name: 'Cobra stretch', cat: 'cooldown', u: 'sec', r: [30, 30, 30], mus: 'abs hip_flexors |', cue: 'Lie face down, hands under your shoulders, and press your chest up while your hips stay on the floor.', poses: [
      { t: [26, -21], hd: [1, -0.8], hn: [30, 3], hf: [32, 3], eh: [-1, 0], fn: [-41, 3], ff: [-41, 4], mat: 1 }] },
    seated_forward_fold: { name: 'Seated forward fold', cat: 'cooldown', u: 'sec', r: [30, 30, 30], mus: 'hamstrings lower_back | calves', cue: 'Sit with straight legs and fold forward from the hips, reaching toward your toes.', poses: [
      { t: [28, -19], hn: [41, -1], hf: [42, 0], eh: [0, -1], fn: [41, 1], ff: [41, 2], mat: 1 }] },
    standing_quad: { name: 'Standing quad stretch', cat: 'cooldown', u: 'sec', r: [15, 15, 15], side: 1, mus: 'quads hip_flexors |', cue: 'Stand on one leg, hold the other ankle and pull the heel to your glute, knees together. Switch.', poses: [
      { t: [1, -34], fn: [-8, -2], khn: [0.2, 1], ff: [0, 41], hn: [-8, -2], ehn: [-1, 0.2], hf: [14, -14] }] },
    kneeling_hip_flexor: { name: 'Kneeling hip flexor stretch', cat: 'cooldown', u: 'sec', r: [15, 15, 15], side: 1, mus: 'hip_flexors quads |', cue: 'Half-kneel on the mat, squeeze the back glute and shift your hips forward until the front of the hip stretches. Switch.', poses: [
      { t: [-2, -34], fn: [-30, 20], khn: [0.3, 1], ff: [22, 20], khf: [1, -1], hn: [3, -4], hf: [2, -4], eh: [-1, -0.2], mat: 1 }] },
    knee_hug: { name: 'Knee-to-chest stretch', cat: 'cooldown', u: 'sec', r: [15, 15, 15], side: 1, mus: 'glutes lower_back |', cue: 'Lie on your back and hug one knee to your chest, other leg long. Switch.', poses: [
      { t: [34, 0], fn: [6, -26], khn: [1, -0.6], ff: [-41, -1], hn: [14, -22], hf: [14, -22], mat: 1 }] },
    butterfly: { name: 'Butterfly stretch', cat: 'cooldown', view: 'front', u: 'sec', r: [30, 30, 30], mus: 'adductors | glutes', cue: 'Sit with the soles of your feet together and let your knees fall open. Sit tall.', poses: [
      { t: [0, -34], fn: [-4, 16], ff: [4, 16], khn: [-1, 0], khf: [1, 0], hn: [-18, 8], hf: [18, 8], mat: 1 }] },
    down_dog: { name: 'Downward dog', cat: 'cooldown', u: 'sec', r: [30, 30, 30], mus: 'calves hamstrings | lats front_delts', cue: 'Hips high, press your heels toward the floor and your chest toward your legs.', poses: [
      { t: [28.7, 18.3], hn: [56.5, 36], hf: [58, 36], fn: [-19.6, 36], ff: [-21, 36], mat: 1 }] },
    standing_side_stretch: { name: 'Standing side stretch', cat: 'cooldown', view: 'front', u: 'sec', r: [15, 15, 15], side: 1, mus: 'obliques lats |', cue: 'Reach one arm overhead and lean to the opposite side, hips steady. Switch.', poses: [
      { t: [-7, -33], hn: [-10, -4], ehn: [-1, 0.3], hf: [-22, -60], fn: [-8, 41], ff: [8, 41] }] },

    // ---------------- YOGA (Phase 5: guided flows; holds in seconds, sides in turn) ----------------
    mountain_pose: { name: 'Mountain pose', cat: 'yoga', added: 5, u: 'sec', r: [20, 25, 30], mus: 'upper_back abs | glutes calves', cue: 'Stand tall, feet together and grounded, then sweep your arms overhead on a slow breath in.', poses: [
      P(STAND, { hn: [3, -1], hf: [1, -1] }), P(STAND, ARMS_UP)] },
    sun_salutation: { name: 'Sun salutation', cat: 'yoga', added: 5, r: [3, 4, 5], tp: 30, mus: 'hamstrings chest front_delts | abs calves lats', cue: 'One breath per move: arms up, fold, step back to plank, lower and lift into cobra, then press back to downward dog and step forward.', poses: [
      P(STAND, ARMS_UP), FOLD, PLANK, COBRA, DOWNDOG] },
    forward_fold: { name: 'Standing forward fold', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], mus: 'hamstrings | lower_back calves', cue: 'Hinge from the hips with soft knees and let your head and arms hang heavy toward the floor.', poses: [FOLD] },
    chair_pose: { name: 'Chair pose', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], mus: 'quads glutes | front_delts upper_back abs', cue: 'Sit back as if into a chair, knees over toes, arms reaching up in line with your torso.', poses: [
      { t: [15, -31], fn: [15, 28], ff: [13, 28], kh: [1, -0.6], hn: [29, -61], hf: [27, -61] }] },
    twisting_chair: { name: 'Twisting chair', cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 45], side: 1, mus: 'quads obliques | glutes upper_back', cue: 'From chair pose, twist and hook one elbow outside the opposite knee, then open the top arm to the ceiling. Switch sides.', poses: [
      { t: [20, -27], fn: [15, 28], ff: [13, 28], kh: [1, -0.6], hn: [28, 4], ehn: [1, 0], hf: [20, -60] }] },
    warrior_one: { name: 'Warrior one', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], side: 1, mus: 'quads glutes | hip_flexors front_delts abs', cue: 'Long stance, front knee bent over the ankle, back foot angled in. Square your hips and reach both arms up.', poses: [
      { t: [0, -34], fn: [24, 27], khn: [1, -1], ff: [-34, 27], khf: [0.2, 1], ...ARMS_UP }] },
    warrior_two: { name: 'Warrior two', cat: 'yoga', added: 5, view: 'front', u: 'sec', r: [40, 50, 60], side: 1, mus: 'quads glutes | adductors side_delts abs', cue: 'Wide stance, front knee bent over the ankle, arms long at shoulder height. Gaze past your front hand.', poses: [WAR2] },
    reverse_warrior: { name: 'Reverse warrior', cat: 'yoga', added: 5, view: 'front', u: 'sec', r: [30, 40, 50], side: 1, mus: 'obliques quads | lats glutes adductors', cue: 'From warrior two, keep the front knee bent, slide the back hand down the back leg and arc the front arm up and over.', poses: [
      { ...WAR2, t: [9, -33], hn: [2, -66], ehn: [-1, 0], hf: [26, -2], ehf: [1, 0] }] },
    triangle_pose: { name: 'Triangle pose', cat: 'yoga', added: 5, view: 'front', u: 'sec', r: [40, 50, 60], side: 1, mus: 'obliques hamstrings | adductors glutes', cue: 'Straight legs in a wide stance. Reach forward over the front leg, then lower that hand to your shin and stack the top arm above it.', poses: [
      { t: [-26, -22], fn: [-30, 38], ff: [26, 36], hn: [-32, 17], ehn: [-1, 0], hf: [-20, -62], ehf: [1, 0] }] },
    extended_side_angle: { name: 'Extended side angle', cat: 'yoga', added: 5, view: 'front', u: 'sec', r: [40, 50, 60], side: 1, mus: 'obliques quads | glutes adductors lats', cue: 'From warrior two, lower the front forearm to your thigh and reach the top arm over your ear in one long line.', poses: [
      { ...WAR2, t: [-28, -19], hn: [-34, 22], ehn: [-1, 0], hf: [-54, -48], ehf: [1, 0] }] },
    high_lunge: { name: 'High lunge', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], side: 1, mus: 'quads hip_flexors | glutes abs', cue: 'Front knee bent, back heel lifted and back leg long. Lift your chest and reach your arms up.', poses: [
      { t: [0, -34], fn: [23, 26], khn: [1, -1], ff: [-35, 30], khf: [0.2, 1], ...ARMS_UP }] },
    tree_pose: { name: 'Tree pose', cat: 'yoga', added: 5, view: 'front', u: 'sec', r: [40, 50, 60], side: 1, mus: 'glutes calves | abs adductors', cue: 'Stand on one leg and press the other foot into your inner thigh or calf, not the knee. Hands together overhead.', poses: [
      { t: [0, -34], ff: [4, 41], fn: [3, 17], khn: [-1, 0], hn: [-2, -64], hf: [2, -64], ehn: [-1, 0], ehf: [1, 0] }] },
    warrior_three: { name: 'Warrior three', cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 45], side: 1, mus: 'glutes hamstrings | lower_back abs calves', cue: 'Balance on one leg and tip forward until your torso and back leg are level, arms reaching ahead.', poses: [
      { t: [34, -2], hd: [1, 0], fn: [0, 41], ff: [-41, -2], hn: [66, -4], hf: [65, -4] }] },
    half_moon: { name: 'Half moon', cat: 'yoga', added: 5, view: 'front', u: 'sec', r: [30, 40, 45], side: 1, mus: 'glutes obliques | hamstrings abs calves', cue: 'From triangle, bend the front knee, put that hand down ahead of the foot and lift the back leg level. Stack the top arm up.', poses: [
      { t: [-33, 6], hd: [-1, 0], fn: [-4, 46], ff: [41, -3], hn: [-33, 46], ehn: [-1, 0], hf: [-33, -36], ehf: [1, 0] }] },
    dancer_pose: { name: "Dancer's pose", cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 45], side: 1, mus: 'quads hip_flexors | glutes chest abs', cue: 'Hold one foot behind you, kick it into your hand and tip forward, the free arm reaching ahead.', poses: [
      { t: [22, -26], fn: [2, 41], ff: [-30, -22], khf: [0, 1], hf: [-28, -21], ehf: [-1, 0], hn: [52, -44] }] },
    boat_pose: { name: 'Boat pose', cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 50], mus: 'abs hip_flexors | obliques', cue: 'Balance on your sit bones, chest lifted, legs raised long or with bent knees, arms reaching forward.', poses: [
      { t: [-20, -27], hd: [0.6, -1], fn: [29, -29], ff: [28, -28], hn: [12, -25], hf: [12, -24], mat: 1 }] },
    bridge_pose: { name: 'Bridge pose', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], mus: 'glutes | hamstrings lower_back', cue: 'On your back, feet planted hip-width apart. Press into your feet and lift your hips, arms long on the floor.', poses: [
      P(GB_UP, { hn: [12, 15.5], hf: [12, 15.5] })] },
    pigeon_pose: { name: 'Pigeon pose', cat: 'yoga', added: 5, u: 'sec', r: [60, 75, 90], side: 1, mus: 'glutes hip_flexors | adductors lower_back', cue: 'Front shin folded across the mat, back leg long behind you. Square your hips and sit tall or fold forward.', poses: [
      { t: [4, -33], fn: [5, 7], khn: [1, 0.2], ff: [-41, 6], hn: [10, 7], hf: [12, 7], mat: 1 }] },
    seated_twist: { name: 'Seated twist', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], side: 1, mus: 'obliques lower_back | glutes upper_back', cue: 'Sit tall, one leg long and the other knee bent with its foot flat. Hug the knee and twist toward it, back hand behind you.', poses: [
      { t: [0, -34], fn: [16, 3], khn: [1, -1], ff: [41, 3], hn: [14, -14], ehn: [1, 0], hf: [-14, 3], mat: 1 }] },
    low_lunge: { name: 'Low lunge', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], side: 1, mus: 'hip_flexors quads | glutes abs', cue: 'Back knee down, front knee over the ankle. Sink your hips forward and reach your arms up.', poses: [
      { t: [-2, -34], fn: [22, 20], khn: [1, -1], ff: [-32, 20], khf: [0.3, 1], mat: 1, ...ARMS_UP }] },
    camel_pose: { name: 'Camel pose', cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 45], mus: 'hip_flexors chest | abs quads front_delts', cue: 'Kneel tall, hands on your lower back. Lift your chest and lean back, reaching for your heels only if it feels easy.', poses: [
      P(KNEEL, { t: [-16, -30], hd: [-1, -0.2], hn: [-19, 20], hf: [-20, 20], eh: [1, 0] })] },
    locust_pose: { name: 'Locust pose', cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 45], mus: 'lower_back glutes | upper_back hamstrings', cue: 'Face down, arms by your sides. Lift your chest, arms and legs off the floor and reach back through your toes.', poses: [
      { t: [33, -8], hd: [1, -0.2], fn: [-40, -5], ff: [-40, -4], hn: [4, -9], hf: [5, -8], mat: 1 }] },
    happy_baby: { name: 'Happy baby', cat: 'yoga', added: 5, u: 'sec', r: [45, 60, 75], mus: 'adductors glutes | lower_back hamstrings', cue: 'On your back, hold the outsides of your feet with knees wide and draw them toward your armpits.', poses: [
      { t: [34, 0], fn: [10, -28], ff: [11, -28], kh: [1, 0.4], hn: [10, -28], hf: [11, -28], mat: 1 }] },
    supine_twist: { name: 'Supine twist', cat: 'yoga', added: 5, u: 'sec', r: [45, 60, 75], side: 1, mus: 'obliques lower_back | glutes chest', cue: 'On your back, draw one knee across your body toward the floor and open the opposite arm wide. Switch sides.', poses: [
      { t: [34, 0], ff: [-41, 1], fn: [2, 8], khn: [1, -0.5], hn: [9, 4], hf: [10, 4], mat: 1 }] },
    crow_pose: { name: 'Crow pose', cat: 'yoga', added: 5, u: 'sec', r: [15, 20, 25], mus: 'front_delts triceps abs | forearms chest', cue: 'Squat, plant your hands, rest your knees high on the backs of your arms and lean forward until your feet lift.', poses: [
      { t: [28, 5], hd: [1, 0.2], hn: [31, 35], hf: [33, 35], eh: [-1, 0], fn: [-4, 14], ff: [-6, 13], kh: [1, 0.7] }] },
    garland_pose: { name: 'Garland pose', cat: 'yoga', added: 5, u: 'sec', r: [40, 50, 60], mus: 'adductors glutes | calves lower_back', cue: 'Feet wider than your hips, sink into a deep squat, elbows pressing your knees open, palms together.', poses: [
      { t: [8, -33], fn: [7, 19], ff: [6, 19], kh: [1, -0.6], hn: [17, -18], hf: [16, -18], eh: [1, 0.2] }] },
    dolphin_pose: { name: 'Dolphin pose', cat: 'yoga', added: 5, u: 'sec', r: [30, 40, 50], mus: 'front_delts abs | hamstrings upper_back', cue: 'Forearms down under your shoulders, hips high like a downward dog, head relaxed between your arms.', poses: [
      { t: [24, 23], hn: [48, 35], hf: [50, 35], eh: [0, 1], fn: [-21, 35], ff: [-23, 35], mat: 1 }] },
    puppy_pose: { name: 'Puppy pose', cat: 'yoga', added: 5, u: 'sec', r: [45, 60, 75], mus: 'lats upper_back | front_delts', cue: 'From hands and knees, walk your hands forward and melt your chest toward the floor, hips over your knees.', poses: [
      P(TABLE, { t: [30, 16], hd: [1, 0.5], hn: [62, 21], hf: [63, 21] })] },
    sphinx_pose: { name: 'Sphinx pose', cat: 'yoga', added: 5, u: 'sec', r: [60, 75, 90], mus: 'lower_back | abs hip_flexors', cue: 'Face down on your forearms, elbows under shoulders. Let your lower back soften as your chest lifts.', poses: [
      { t: [31, -14], hd: [1, -0.4], hn: [52, 5], hf: [53, 5], eh: [0, 1], fn: [-41, 4], ff: [-41, 5], mat: 1 }] },

    // ---------------- PILATES (Phase 5: mat work in reps, run as guided flows) ----------------
    hundred: { name: 'The hundred', cat: 'pilates', added: 5, r: [50, 80, 100], tp: 1, mus: 'abs | hip_flexors front_delts', cue: 'Curl your head and shoulders up, legs lifted, and pump long arms up and down: breathe in for five pumps, out for five.', poses: [
      { ...CURL, fn: [-29, -29], ff: [-28, -28], hn: [2, -10], hf: [2, -9], mat: 1 }, { ...CURL, fn: [-29, -29], ff: [-28, -28], hn: [2, -3], hf: [2, -2], mat: 1 }] },
    roll_up: { name: 'Roll-up', cat: 'pilates', added: 5, r: [6, 8, 10], tp: 7, mus: 'abs | hip_flexors hamstrings', cue: 'Lie with arms overhead. Peel up one vertebra at a time to reach over your legs, then roll back down just as slowly.', poses: [
      P(LIE, { hn: [66, 1], hf: [67, 1] }), P(LIE, { t: [0, -34], hn: [-30, -30], hf: [-30, -29] }), P(LIE, { t: [-28, -19], hd: [-0.6, 1], hn: [-41, -1], hf: [-42, 0], eh: [0, -1] })] },
    single_leg_circles: { name: 'Single-leg circles', cat: 'pilates', added: 5, r: [8, 10, 12], side: 1, tp: 3, mus: 'hip_flexors abs | quads adductors', cue: 'On your back, one leg long on the mat and the other pointing up. Draw small circles with the raised leg, hips still. Switch legs.', poses: [
      P(LIE, { fn: [-8, -40], khn: [1, 0] }), P(LIE, { fn: [8, -40], khn: [1, 0] })] },
    rolling_like_a_ball: { name: 'Rolling like a ball', cat: 'pilates', added: 5, r: [8, 10, 12], tp: 4, mus: 'abs | lower_back', cue: 'Balance in a tight ball, hands on your shins. Roll back to your shoulder blades and back up to balance, never onto your neck.', poses: [TUCK, TUCK_BACK] },
    single_leg_stretch: { name: 'Single-leg stretch', cat: 'pilates', added: 5, r: [16, 20, 24], alt: 1, tp: 2, mus: 'abs | hip_flexors obliques', cue: 'Head and shoulders curled up, pull one knee in as the other leg reaches long and low. Switch legs with control.', poses: [
      { ...CURL, fn: [4, -10], khn: [1, -1], ff: [-34, -22], hn: [13, -18], hf: [14, -17], mat: 1 }, { ...CURL, ff: [4, -10], khf: [1, -1], fn: [-34, -22], hn: [13, -18], hf: [14, -17], mat: 1 }] },
    double_leg_stretch: { name: 'Double-leg stretch', cat: 'pilates', added: 5, r: [8, 10, 12], tp: 5, mus: 'abs | hip_flexors', cue: 'Hug both knees in, then reach arms overhead and legs long at once. Circle the arms back and hug in again.', poses: [
      { ...CURL, fn: [4, -10], ff: [3, -9], kh: [1, -1], hn: [12, -18], hf: [13, -17], mat: 1 }, { ...CURL, fn: [-33, -24], ff: [-33, -23], hn: [62, -16], hf: [62, -15], mat: 1 }] },
    scissors: { name: 'Scissors', cat: 'pilates', added: 5, r: [16, 20, 24], alt: 1, tp: 2, mus: 'abs hamstrings | hip_flexors', cue: 'Curled up, one straight leg toward your face and the other long and low. Pulse twice and switch, like scissors.', poses: [
      { ...CURL, fn: [8, -40], ff: [-38, -12], hn: [10, -30], hf: [11, -29], mat: 1 }, { ...CURL, ff: [8, -40], fn: [-38, -12], hn: [10, -30], hf: [11, -29], mat: 1 }] },
    criss_cross: { name: 'Criss-cross', cat: 'pilates', added: 5, r: [16, 20, 24], alt: 1, tp: 2.5, mus: 'obliques abs | hip_flexors', cue: 'Hands behind your head, curl up and twist your elbow toward the opposite knee as the other leg reaches long. Switch.', poses: [
      { ...CURL, fn: [4, -10], khn: [1, -1], ff: [-34, -22], hn: [38, -16], hf: [38, -15], eh: [-1, -1], mat: 1 }, { ...CURL, ff: [4, -10], khf: [1, -1], fn: [-34, -22], hn: [38, -16], hf: [38, -15], eh: [-1, -1], mat: 1 }] },
    spine_stretch: { name: 'Spine stretch forward', cat: 'pilates', added: 5, r: [6, 8, 10], tp: 7, mus: 'lower_back hamstrings | upper_back', cue: 'Sit tall, legs long and a little apart, arms forward. Round forward from the top of your head as you breathe out, then stack back up.', poses: [
      P(SEAT, { hn: [30, -30], hf: [30, -29] }), P(SEAT, { t: [18, -29], hd: [0.5, 1], hn: [44, -6], hf: [44, -5] })] },
    saw: { name: 'Saw', cat: 'pilates', added: 5, view: 'front', r: [8, 10, 12], alt: 1, tp: 6, mus: 'obliques hamstrings | lower_back upper_back', cue: 'Sit tall with legs wide and arms out. Twist, then reach your front hand past the opposite little toe as if sawing it off. Come back and switch.', poses: [
      { t: [0, -34], fn: [-38, 8], ff: [38, 8], hn: [-40, -34], hf: [40, -34], ehn: [0, -1], ehf: [0, -1], mat: 1 },
      { t: [-18, -29], hd: [-0.4, 1], fn: [-38, 8], ff: [38, 8], hn: [-38, 4], hf: [10, -48], ehn: [-1, 0], ehf: [1, 0], mat: 1 }] },
    swan: { name: 'Swan', cat: 'pilates', added: 5, r: [6, 8, 10], tp: 5, mus: 'lower_back | upper_back glutes', cue: 'Face down, hands under your shoulders. Press your chest up, long through the spine, then lower with control.', poses: [
      P(PRONE, { hn: [36, 2], hf: [37, 2], eh: [-1, -1] }), COBRA] },
    side_kick: { name: 'Side kick series', cat: 'pilates', added: 5, r: [12, 15, 20], side: 1, tp: 3, mus: 'glutes | hip_flexors abs', cue: 'Lie on your side, head on your lower arm, legs a little forward. Lift and lower the top leg without rocking your hips. Switch sides.', poses: [
      { t: [34, -4], hd: [1, -0.3], hn: [44, -2], hf: [22, 4], fn: [-41, 1], ff: [-41, 2], mat: 1 }, { t: [34, -4], hd: [1, -0.3], hn: [44, -2], hf: [22, 4], fn: [-38, -16], ff: [-41, 2], mat: 1 }] },
    teaser: { name: 'Teaser', cat: 'pilates', added: 5, r: [4, 6, 8], tp: 8, mus: 'abs hip_flexors | quads', cue: 'From lying with legs lifted, roll up to balance in a V, arms reaching parallel to your legs. Roll down slowly.', poses: [
      P(LIE, { fn: [-29, -29], ff: [-28, -28], hn: [66, -2], hf: [67, -2] }), { t: [22, -26], hd: [0, -1], fn: [-29, -29], ff: [-28, -28], hn: [-8, -38], hf: [-8, -37], mat: 1 }] },
    swimming: { name: 'Swimming', cat: 'pilates', added: 5, r: [30, 40, 50], alt: 1, tp: 1, mus: 'lower_back glutes | upper_back rear_delts', cue: 'Face down, arms and legs long and lifted. Flutter opposite arm and leg in small, quick beats, chest up.', poses: [
      { t: [33, -8], hd: [1, -0.2], hn: [64, -15], hf: [63, -5], fn: [-40, -3], ff: [-40, -10], mat: 1 }, { t: [33, -8], hd: [1, -0.2], hn: [64, -5], hf: [63, -15], fn: [-40, -10], ff: [-40, -3], mat: 1 }] },
    leg_pull_front: { name: 'Leg pull front', cat: 'pilates', added: 5, r: [8, 10, 12], alt: 1, tp: 4, mus: 'abs glutes | front_delts triceps', cue: 'In a straight-arm plank, lift one straight leg, lower it, then the other, without letting your hips sway.', poses: [PLANK, P(PLANK, { ff: [-40, 4] })] },
    seal: { name: 'Seal', cat: 'pilates', added: 5, r: [8, 10, 12], tp: 4, mus: 'abs | lower_back adductors', cue: 'Knees apart, hands threaded through to hold your ankles. Clap your feet three times, roll back, roll up and clap again.', poses: [
      { ...TUCK, hn: [8, -3], hf: [7, -3] }, { ...TUCK_BACK, hn: [-6, -12], hf: [-7, -12] }] },
    shoulder_bridge: { name: 'Shoulder bridge', cat: 'pilates', added: 5, r: [6, 8, 10], side: 1, tp: 5, mus: 'glutes hamstrings | lower_back abs', cue: 'In a bridge, lift one leg to the ceiling, lower it to hip height and lift again. Keep the hips level. Switch legs.', poses: [
      P(GB_UP, { hn: [12, 15.5], hf: [12, 15.5] }), P(GB_UP, { hn: [12, 15.5], hf: [12, 15.5], fn: [-8, -40], khn: [1, 0] })] },
    standing_roll_down: { name: 'Standing roll-down', cat: 'pilates', added: 5, r: [5, 6, 8], tp: 8, mus: 'lower_back hamstrings | abs', cue: 'Stand tall, drop your chin and roll down one vertebra at a time until your hands hang. Roll back up just as slowly.', poses: [
      STAND, { t: [21, -27], hd: [0.3, 1], hn: [26, 0], hf: [24, 0], fn: [-2, 41], ff: [-4, 41] }, FOLD] },
    standing_leg_lift: { name: 'Standing leg lift', cat: 'pilates', added: 5, r: [12, 15, 20], side: 1, tp: 3, mus: 'hip_flexors glutes | abs quads', cue: 'Stand tall on one leg, hands on hips, and lift the other straight leg in front of you, then sweep it back behind. Switch legs.', poses: [
      P(STAND, { ...HANDS_HIPS, fn: [38, -15] }), P(STAND, { ...HANDS_HIPS, fn: [-20, 36] })] },
    standing_side_leg_lift: { name: 'Standing side leg lift', cat: 'pilates', added: 5, view: 'front', r: [12, 15, 20], side: 1, tp: 3, mus: 'glutes | adductors abs', cue: 'Stand tall with hands on hips and lift one straight leg out to the side, toes forward. Lower with control. Switch legs.', poses: [
      P(FSTAND, { hn: [-10, -6], hf: [10, -6], ehn: [-1, 0], ehf: [1, 0] }), P(FSTAND, { hn: [-10, -6], hf: [10, -6], ehn: [-1, 0], ehf: [1, 0], fn: [-30, 30] })] },
    plie_squat: { name: 'Plié squat', cat: 'pilates', added: 5, view: 'front', r: [15, 20, 25], tp: 3, mus: 'adductors glutes quads | calves', cue: 'Feet wide and turned out, bend your knees out over your toes and lower straight down, then press up tall.', poses: [
      { t: [0, -34], fn: [-22, 36], ff: [22, 36], hn: [-4, -18], hf: [4, -18], ehn: [-1, 0], ehf: [1, 0] }, { t: [0, -34], fn: [-26, 24], ff: [26, 24], khn: [-1, 0], khf: [1, 0], hn: [-4, -18], hf: [4, -18], ehn: [-1, 0], ehf: [1, 0] }] },
    heel_raise: { name: 'Pilates heel raises', cat: 'pilates', added: 5, r: [20, 25, 30], tp: 2, mus: 'calves | glutes abs', cue: 'Heels together and toes apart, rise high onto the balls of your feet, pause, and lower slowly.', poses: [
      STAND, P(STAND, { lift: 5, fn: [4, 41], ff: [0, 41] })] },

    // ---------------- BOXING (Phase 5: one combo per 3-minute bout; call = what the voice says) ----------------
    jab_cross: { name: 'Jab, cross', call: 'jab, cross', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts triceps | obliques chest calves', cue: 'The one-two: snap the lead hand straight out and back, then turn the rear hip and shoulder through the cross. Hands back to your chin.', poses: [GUARD, JAB, CROSS] },
    double_jab_cross: { name: 'Double jab, cross', call: 'double jab, cross', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts triceps | obliques calves', cue: 'Two quick jabs, the second a half step deeper, then a straight cross. Keep the rear hand glued to your chin on the jabs.', poses: [GUARD, JAB, GUARD, CROSS] },
    jab_cross_hook: { name: 'Jab, cross, hook', call: 'jab, cross, hook', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts obliques triceps | chest calves', cue: 'One-two, then pivot on the lead foot and swing a bent-arm lead hook at chin height, elbow level with your fist.', poses: [JAB, CROSS, HOOK] },
    cross_hook_cross: { name: 'Cross, hook, cross', call: 'cross, hook, cross', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques front_delts | triceps chest calves', cue: 'Start with the rear hand, let the turn back load the lead hook, then fire the cross again. Stay balanced over your feet.', poses: [CROSS, HOOK, CROSS] },
    jab_cross_uppercut: { name: 'Jab, cross, uppercut', call: 'jab, cross, uppercut', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts triceps biceps | obliques quads', cue: 'One-two, then dip the knees slightly and drive a lead uppercut up the middle, palm facing you.', poses: [JAB, CROSS, UPPER] },
    rear_upper_hook_cross: { name: 'Uppercut, hook, cross', call: 'rear uppercut, hook, cross', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques front_delts biceps | triceps quads', cue: 'Rear uppercut from the legs, lead hook as the hips turn back, then a straight cross to finish.', poses: [REAR_UPPER, HOOK, CROSS] },
    four_punch: { name: 'Jab, cross, hook, cross', call: 'jab, cross, hook, cross', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts obliques triceps | chest calves abs', cue: 'The classic four-punch combination: one-two, lead hook, cross. Keep each punch crisp and reset your guard at the end.', poses: [JAB, CROSS, HOOK, CROSS] },
    body_head: { name: 'Jab to the body, cross', call: 'jab to the body, cross to the head', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts quads | triceps obliques', cue: 'Bend the knees to drop level and jab to the body, then come up with a cross to the head.', poses: [BODY_JAB, CROSS] },
    jab_body_hook: { name: 'Jab, cross, body hook', call: 'jab, cross, body hook', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques front_delts | quads triceps', cue: 'One-two, then drop the lead elbow and dig a short hook to the body, bending the knees rather than leaning.', poses: [JAB, CROSS, BODY_HOOK] },
    slip_counter: { name: 'Slip and cross', call: 'slip, cross', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques quads | front_delts triceps', cue: 'Slip an imagined jab by dipping your head just outside it, then come back with a cross. Small movements, eyes forward.', poses: [GUARD, SLIP, CROSS] },
    roll_hook: { name: 'Roll and hook', call: 'roll, hook', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'quads obliques | glutes front_delts', cue: 'Bend the knees and roll under an imagined hook in a U shape, then answer with your own lead hook.', poses: [GUARD, ROLL, HOOK] },
    bob_and_weave: { name: 'Bob and weave', call: 'bob and weave', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'quads glutes obliques | calves', cue: 'Drop under imaginary punches by bending the knees, moving your head side to side in a U, hands up the whole time.', poses: [GUARD, ROLL, GUARD] },
    shadow_footwork: { name: 'Shadowboxing footwork', call: 'footwork', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'calves quads | glutes abs', cue: 'Stay on the balls of your feet: step forward, back and to the sides, never crossing your feet, and throw a jab now and then.', poses: [
      GUARD, { ...GUARD, fn: [20, 40], ff: [-6, 40] }, { ...JAB, fn: [20, 40], ff: [-6, 40] }] },
    speed_bag: { name: 'Speed bag drill', call: 'speed bag', cat: 'boxing', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts side_delts | forearms upper_back', cue: 'Hands up at eye level, roll your fists in fast small circles in front of your face, as if keeping a speed bag going.', poses: [
      { ...GUARD, hn: [22, -46], hf: [19, -41], ehn: [0, 1], ehf: [0, 1] }, { ...GUARD, hn: [20, -41], hf: [21, -46], ehn: [0, 1], ehf: [0, 1] }] },

    // ---------------- KICKBOXING (Phase 5: one kick or combination per 3-minute bout) ----------------
    teep: { name: 'Teep', call: 'teep', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'hip_flexors quads | abs glutes calves', cue: 'The push kick: lift the lead knee and drive the ball of the foot straight out as if pushing a door shut, leaning back a little. Hands up.', poses: [GUARD, CHAMBER, TEEP] },
    front_kick: { name: 'Snap front kick', call: 'front kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'quads hip_flexors | abs calves', cue: 'Chamber the knee high, snap the lower leg out to kick with the ball of the foot, snap it back and step down in stance.', poses: [GUARD, CHAMBER, { ...TEEP, t: [-2, -34], fn: [36, -18] }] },
    roundhouse: { name: 'Roundhouse kick', call: 'roundhouse', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques glutes hip_flexors | quads calves', cue: 'Pivot on the standing foot and swing the leg round, hip turning over, to strike with the shin. The rear arm swings back for balance.', poses: [GUARD, CHAMBER, ROUNDHOUSE] },
    side_thrust_kick: { name: 'Side kick', call: 'side kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'glutes quads | obliques abs calves', cue: 'Turn side-on, chamber the knee to your chest and drive the heel straight out, body leaning away in one line. Recoil and step down.', poses: [GUARD, CHAMBER, SIDE_THRUST] },
    back_kick: { name: 'Spinning back kick', call: 'back kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'glutes hamstrings | lower_back abs', cue: 'Turn your back, look over your shoulder and drive the heel straight back like a mule, then turn back to guard.', poses: [GUARD, BACK_KICK] },
    switch_kick: { name: 'Switch kick', call: 'switch kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques hip_flexors glutes | calves quads', cue: 'A quick hop to swap your feet, then fire the new rear leg as a roundhouse. Land back in your normal stance.', poses: [GUARD, SWITCHED, ROUNDHOUSE] },
    knee_strike: { name: 'Knee strikes', call: 'knees', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'hip_flexors abs | quads glutes', cue: 'Hands reach out as if holding a head, pull down and drive the knee up through it, hips forward. Alternate knees.', poses: [GUARD, KNEE_UP] },
    clinch_knees: { name: 'Clinch knees', call: 'clinch and knees', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'hip_flexors abs upper_back | quads forearms', cue: 'Hands locked behind an imagined neck, elbows tight. Pull down and drive alternating knees, turning your hips into each one.', poses: [
      { ...KNEE_UP, fn: [0, 41], khn: [1, -0.2], ff: [-3, 41] }, KNEE_UP, { ...KNEE_UP, fn: [0, 41], khn: [1, -0.2], ff: [8, 14], khf: [1, -1] }] },
    jab_cross_kick: { name: 'Jab, cross, roundhouse', call: 'jab, cross, kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques front_delts glutes | triceps hip_flexors calves', cue: 'One-two, and let the turn of the cross load a lead-leg roundhouse. Reset your guard at the end.', poses: [JAB, CROSS, ROUNDHOUSE] },
    jab_teep: { name: 'Jab, teep', call: 'jab, teep', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'front_delts hip_flexors | quads abs', cue: 'Jab to find the distance, then push kick off the lead leg to keep it. Step back to stance.', poses: [JAB, CHAMBER, TEEP] },
    hook_low_kick: { name: 'Hook, low kick', call: 'hook, low kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques glutes | front_delts quads calves', cue: 'Lead hook, then turn the hips over and chop the rear shin into an imagined thigh. Hands stay up.', poses: [HOOK, { ...ROUNDHOUSE, fn: [36, 8] }] },
    kick_four: { name: 'Jab, cross, hook, kick', call: 'jab, cross, hook, kick', cat: 'kick', added: 5, u: 'sec', r: [180, 180, 180], mus: 'obliques front_delts glutes | triceps hip_flexors calves', cue: 'The full combination: one-two, lead hook, then a rear roundhouse off the turn of the hook.', poses: [JAB, CROSS, HOOK, ROUNDHOUSE] },

    // ---------------- FLEXIBILITY (Phase 5: long stretches, run as guided flows) ----------------
    half_split: { name: 'Half split', cat: 'flex', added: 5, u: 'sec', r: [60, 75, 90], side: 1, mus: 'hamstrings | calves lower_back', cue: 'Kneel, straighten the front leg with the toes up and hinge forward over it with a long back, hands beside the leg.', poses: [
      { t: [26, -22], fn: [38, 16], ff: [-19, 21], khf: [1, 0.6], hn: [27, 20], hf: [29, 20], mat: 1 }] },
    front_split: { name: 'Front split (supported)', cat: 'flex', added: 5, u: 'sec', r: [45, 60, 75], side: 1, mus: 'hamstrings hip_flexors | quads glutes', cue: 'From a low lunge, slide the front heel forward and the back knee back only as far as it stays easy, hands on the floor or on books.', poses: [
      { t: [0, -34], fn: [40, 8], ff: [-40, 8], hn: [8, 8], hf: [-6, 8], eh: [0, 1], mat: 1 }] },
    pancake: { name: 'Pancake', cat: 'flex', added: 5, view: 'front', u: 'sec', r: [60, 75, 90], mus: 'adductors hamstrings | lower_back', cue: 'Sit with legs wide, knees and toes up. Walk your hands forward and fold from the hips, chest toward the floor.', poses: [
      { t: [0, -34], fn: [-38, 8], ff: [38, 8], hn: [-10, 4], hf: [10, 4], mat: 1 }, { t: [0, -20], hd: [0, 1], fn: [-38, 8], ff: [38, 8], hn: [-12, 8], hf: [12, 8], mat: 1 }] },
    seated_straddle: { name: 'Seated straddle side reach', cat: 'flex', added: 5, view: 'front', u: 'sec', r: [45, 60, 75], side: 1, mus: 'adductors obliques hamstrings | lats', cue: 'Legs wide, sit tall. Reach one hand toward the opposite foot, the top arm arcing overhead. Switch sides.', poses: [
      { t: [-18, -29], fn: [-38, 8], ff: [38, 8], hn: [-37, 5], ehn: [-1, 0], hf: [-34, -52], ehf: [1, 0], mat: 1 }] },
    lizard_pose: { name: 'Lizard pose', cat: 'flex', added: 5, u: 'sec', r: [60, 75, 90], side: 1, mus: 'hip_flexors adductors | glutes hamstrings', cue: 'From a lunge with the back knee down, put both hands inside the front foot and sink the hips, forearms down if you can.', poses: [
      { t: [30, -12], hd: [1, -0.3], fn: [24, 20], khn: [1, -1], ff: [-33, 20], khf: [0.3, 1], hn: [40, 20], hf: [42, 20], eh: [0, 1], mat: 1 }] },
    frog_pose: { name: 'Frog pose', cat: 'flex', added: 5, view: 'front', u: 'sec', r: [60, 75, 90], mus: 'adductors | hip_flexors glutes', cue: 'On forearms and knees, slide the knees wide with shins parallel and feet flexed, then ease the hips back.', poses: [
      { t: [0, -18], hd: [0, 1], fn: [-36, 14], ff: [36, 14], khn: [-1, -0.4], khf: [1, -0.4], hn: [-8, 14], hf: [8, 14], mat: 1 }] },
    wide_leg_fold: { name: 'Wide-leg forward fold', cat: 'flex', added: 5, view: 'front', u: 'sec', r: [60, 75, 90], mus: 'hamstrings adductors | lower_back calves', cue: 'Stand with feet wide and parallel, hinge forward from the hips and let your head hang toward the floor between your feet.', poses: [
      { t: [0, 26], hd: [0, 1], fn: [26, 38], ff: [-26, 38], hn: [9, 40], hf: [-9, 40], ehn: [1, 0], ehf: [-1, 0] }] }, // torso down: the hips flip
    thread_the_needle: { name: 'Thread the needle', cat: 'flex', added: 5, u: 'sec', r: [45, 60, 75], side: 1, mus: 'upper_back rear_delts | lats obliques', cue: 'On hands and knees, slide one arm under your chest along the floor until that shoulder and ear rest down. Switch sides.', poses: [
      P(TABLE, { t: [30, 14], hd: [1, 0.4], hn: [20, 31], ehn: [0, 1], hf: [60, 31] })] },
    reverse_prayer: { name: 'Reverse prayer', cat: 'flex', added: 5, u: 'sec', r: [30, 45, 60], mus: 'chest front_delts | forearms', cue: 'Press your palms together behind your back, fingers pointing up, and roll your shoulders back and open.', poses: [
      P(STAND, { hn: [-7, -22], hf: [-8, -22], eh: [0.4, 1] })] },
    cow_face_arms: { name: 'Cow face arms', cat: 'flex', added: 5, view: 'front', u: 'sec', r: [45, 60, 75], side: 1, mus: 'triceps front_delts | lats chest', cue: 'Reach one hand down behind your neck and the other up behind your back until the fingers meet, or use a towel. Switch.', poses: [
      P(FSTAND, { hn: [3, -48], ehn: [-0.4, -1], hf: [-1, -26], ehf: [1, 1] })] },
    lying_hamstring: { name: 'Lying hamstring stretch', cat: 'flex', added: 5, u: 'sec', r: [60, 75, 90], side: 1, mus: 'hamstrings | calves', cue: 'On your back, hold one straight leg behind the thigh or calf and ease it toward you, the other leg long on the floor.', poses: [
      P(LIE, { fn: [2, -41], khn: [1, 0], hn: [5, -30], hf: [6, -29] })] },
    figure_four: { name: 'Figure-four stretch', cat: 'flex', added: 5, u: 'sec', r: [60, 75, 90], side: 1, mus: 'glutes | hip_flexors lower_back', cue: 'On your back, cross one ankle over the other knee and pull that leg in behind the thigh. Switch sides.', poses: [
      { t: [34, 0], ff: [2, -18], khf: [1, -1], fn: [-4, -20], khn: [1, 0.4], hn: [10, -18], hf: [10, -17], mat: 1 }] },
    kneeling_quad: { name: 'Kneeling quad stretch', cat: 'flex', added: 5, u: 'sec', r: [60, 75, 90], side: 1, mus: 'quads hip_flexors |', cue: 'Half-kneel, reach back for the back foot and draw the heel toward your glute, hips pressing forward. Switch sides.', poses: [
      { t: [0, -34], fn: [22, 20], khn: [1, -1], ff: [-6, -2], khf: [0, 1], hn: [4, -4], hf: [-5, -2], ehf: [-1, 0], mat: 1 }] },
    side_lying_quad: { name: 'Side-lying quad stretch', cat: 'flex', added: 5, u: 'sec', r: [45, 60, 75], side: 1, mus: 'quads | hip_flexors', cue: 'Lie on your side, head on your arm, and pull the top heel toward your glute, knees together. Switch sides.', poses: [
      { t: [34, -4], hd: [1, -0.3], hn: [44, -2], ff: [-41, 2], fn: [-4, 4], khn: [-0.2, 1], hf: [-4, 4], ehf: [0, 1], mat: 1 }] },

    // ---------------- MOBILITY & POSTURE (Phase 5: controlled drills for joints and posture) ----------------
    hip_cars: { name: 'Hip circles (CARs)', cat: 'mobility', added: 5, r: [5, 6, 8], side: 1, tp: 8, mus: 'hip_flexors glutes | adductors abs', cue: 'Stand tall on one leg, hand on a wall. Lift the other knee and draw the biggest slow circle you can with it, hips square. Switch.', poses: [
      P(STAND, { ...HANDS_HIPS, fn: [16, 6], khn: [1, -1] }), P(STAND, { ...HANDS_HIPS, fn: [4, 14], khn: [0.2, -1] }), P(STAND, { ...HANDS_HIPS, fn: [-18, 34], khn: [0.3, 1] })] },
    shoulder_cars: { name: 'Shoulder circles (CARs)', cat: 'mobility', added: 5, r: [5, 6, 8], side: 1, tp: 6, mus: 'front_delts side_delts rear_delts | upper_back chest', cue: 'Brace your middle and move one straight arm through the biggest slow circle it can make: forward, up, back and down. Switch.', poses: [
      P(STAND, { hn: [30, -48] }), P(STAND, { hn: [2, -67] }), P(STAND, { hn: [-24, -52], ehn: [-1, 0] })] },
    wall_slides: { name: 'Wall slides', cat: 'mobility', added: 5, r: [10, 12, 15], tp: 3, mus: 'upper_back rear_delts | side_delts lower_back', cue: 'Back, head and arms against a wall in a W. Slide the arms up to a Y without the wrists or lower back leaving the wall.', poses: [
      P(STAND, { wall: -7, t: [-2, -34], hd: [0, -1], hn: [-4, -46], hf: [-5, -46], eh: [-0.3, 1] }), P(STAND, { wall: -7, t: [-2, -34], hd: [0, -1], hn: [-4, -66], hf: [-5, -66] })] },
    open_book: { name: 'Open book', cat: 'mobility', added: 5, r: [8, 10, 12], side: 1, tp: 4, mus: 'upper_back obliques | chest', cue: 'Lie on your side, knees bent in front. Open the top arm up and over, following it with your eyes, then close. Switch sides.', poses: [
      { t: [34, -4], hd: [1, -0.3], fn: [12, 14], ff: [11, 15], kh: [1, 0], hn: [60, 0], hf: [60, 1], mat: 1 }, { t: [34, -4], hd: [0.2, -1], fn: [12, 14], ff: [11, 15], kh: [1, 0], hn: [60, 1], hf: [34, -37], mat: 1 }] },
    chin_tucks: { name: 'Chin tucks', cat: 'mobility', added: 5, r: [10, 12, 15], tp: 3, mus: 'upper_back | front_delts', cue: 'Sit or stand tall and glide your head straight back, making a double chin, as if someone pulled the back of your head. Hold, release.', poses: [
      P(STAND, { t: [2, -34], hd: [0.5, -1] }), P(STAND, { t: [0, -34], hd: [-0.1, -1] })] },
    ninety_ninety: { name: '90/90 switches', cat: 'mobility', added: 5, r: [8, 10, 12], alt: 1, tp: 4, mus: 'glutes hip_flexors | adductors abs', cue: 'Sit with both knees bent to 90 degrees to one side. Keeping your chest up, lift the knees and rotate them over to the other side.', poses: [
      { t: [0, -34], fn: [14, 4], khn: [1, 0.3], ff: [-12, 4], khf: [-1, 0.3], hn: [-12, 3], hf: [-10, 3], eh: [0.3, 1], mat: 1 }, { t: [0, -34], fn: [18, 4], ff: [16, 4], kh: [1, -1], hn: [-12, 3], hf: [-10, 3], eh: [0.3, 1], mat: 1 }] },
    deep_squat_hold: { name: 'Deep squat hold', cat: 'mobility', added: 5, u: 'sec', r: [45, 60, 75], mus: 'adductors glutes | calves lower_back quads', cue: 'Sink into your deepest squat with heels down and chest up, arms reaching forward. Shift gently side to side.', poses: [
      { t: [10, -32], fn: [7, 19], ff: [6, 19], kh: [1, -0.6], hn: [38, -18], hf: [37, -17] }] },
    hip_airplane: { name: 'Hip airplanes', cat: 'mobility', added: 5, r: [5, 6, 8], side: 1, tp: 6, mus: 'glutes | hamstrings abs adductors', cue: 'Balance on one leg, hinged forward with the other leg back. Slowly rotate your pelvis open to the side, then closed. Switch legs.', poses: [
      { t: [32, -12], hd: [1, 0], fn: [2, 41], ff: [-38, -8], hn: [4, -4], hf: [3, -4], eh: [-1, -0.2] }, { t: [30, -16], hd: [1, -0.3], fn: [2, 41], ff: [-38, -14], hn: [4, -4], hf: [3, -4], eh: [-1, -0.2] }] },
    prone_ytw: { name: 'Prone Y-T-W', cat: 'mobility', added: 5, r: [6, 8, 10], tp: 6, mus: 'upper_back rear_delts | lower_back side_delts', cue: 'Face down, forehead just off the floor. Lift your arms into a Y, then a T, then pull the elbows down into a W, squeezing the shoulder blades.', poses: [
      { t: [33, -6], hd: [1, 0], fn: [-41, 0], ff: [-41, 1], hn: [62, -16], hf: [62, -15], mat: 1 }, { t: [33, -6], hd: [1, 0], fn: [-41, 0], ff: [-41, 1], hn: [22, -14], hf: [22, -13], eh: [-1, -1], mat: 1 }] },
    jefferson_curl: { name: 'Jefferson curl (bodyweight)', cat: 'mobility', added: 5, r: [5, 6, 8], tp: 8, mus: 'hamstrings lower_back | upper_back', cue: 'Stand tall, tuck your chin and roll down one vertebra at a time with straight legs, then roll back up. Slow and light.', poses: [
      STAND, { t: [22, -26], hd: [0.3, 1], hn: [28, 0], hf: [26, 0], fn: [-2, 41], ff: [-4, 41] }, FOLD] },
    ankle_rocks: { name: 'Ankle rocks', cat: 'mobility', added: 5, r: [10, 12, 15], side: 1, tp: 2, mus: 'calves | quads', cue: 'Half-kneel and rock the front knee forward past your toes, heel staying down, then back. Switch legs.', poses: [
      { t: [0, -34], fn: [21, 20], khn: [1, -1], ff: [-20, 21], khf: [1, 0.6], hn: [18, -6], hf: [17, -6], mat: 1 }, { t: [6, -33], fn: [14, 20], khn: [1, -1], ff: [-20, 21], khf: [1, 0.6], hn: [24, -6], hf: [23, -6], mat: 1 }] },
    quadruped_rotation: { name: 'Quadruped T-spine rotation', cat: 'mobility', added: 5, r: [8, 10, 12], side: 1, tp: 3, mus: 'upper_back obliques | rear_delts', cue: 'On hands and knees, one hand behind your head. Point the elbow down under your chest, then rotate it up toward the ceiling. Switch.', poses: [
      P(TABLE, { hn: [34, -6], ehn: [0.2, 1], hd: [0.8, 0.6] }), P(TABLE, { hn: [34, -8], ehn: [-0.4, -1], hd: [0.6, -0.8] })] },

    // ---------------- BALANCE & STABILITY (Phase 5) ----------------
    single_leg_stand: { name: 'Single-leg stand', cat: 'balance', added: 5, u: 'sec', r: [30, 40, 45], side: 1, mus: 'calves glutes | abs', cue: 'Stand on one leg, knee soft, the other foot just off the floor. Keep your hips level and eyes on one point; try it with eyes closed later. Switch.', poses: [
      P(STAND, { ...HANDS_HIPS, fn: [8, 26], khn: [1, -0.4] })] },
    single_leg_reach: { name: 'Single-leg reach', cat: 'balance', added: 5, r: [8, 10, 12], side: 1, tp: 3, mus: 'glutes hamstrings | calves abs lower_back', cue: 'Balance on one leg and hinge forward to touch the floor ahead of you, the free leg reaching back. Stand tall again without touching down. Switch.', poses: [
      P(STAND, { fn: [8, 26], khn: [1, -0.4] }), { t: [26, -22], fn: [-32, -10], ff: [2, 40], khf: [1, -0.3], hn: [36, 10], hf: [35, 10] }] },
    tree_to_airplane: { name: 'Knee lift to airplane', cat: 'balance', added: 5, r: [6, 8, 10], side: 1, tp: 5, mus: 'glutes hamstrings | abs lower_back calves', cue: 'Stand on one leg with the other knee lifted, then tip forward into an airplane: torso and back leg level, arms out behind. Return. Switch.', poses: [
      P(STAND, { fn: [16, 6], khn: [1, -1], hn: [3, -4], hf: [2, -4], eh: [-1, -0.2] }), { t: [34, -2], hd: [1, 0], ff: [0, 41], fn: [-41, -2], hn: [8, -8], hf: [7, -8] }] },
    star_excursion: { name: 'Star reach', cat: 'balance', added: 5, r: [6, 8, 10], side: 1, tp: 4, mus: 'glutes quads | adductors calves abs', cue: 'Squat a little on one leg and tap the other foot out in front, to the side and behind, like the points of a star, without putting weight on it. Switch.', poses: [
      { t: [8, -33], ff: [2, 37], khf: [1, -0.4], fn: [36, 30], ...HANDS_HIPS }, { t: [14, -31], ff: [2, 37], khf: [1, -0.4], fn: [-34, 32], ...HANDS_HIPS }] },
    heel_to_toe_walk: { name: 'Heel-to-toe walk', cat: 'balance', added: 5, u: 'sec', r: [30, 40, 45], mus: 'calves | glutes abs adductors', cue: 'Walk in a straight line placing each heel right against the other toes, arms out if you need them. Turn and come back, slowly.', poses: [
      P(STAND, { fn: [7, 41], ff: [-7, 41], hn: [22, -14], hf: [-18, -14] }), P(STAND, { fn: [-7, 41], ff: [7, 41], hn: [-18, -14], hf: [22, -14] })] },
    pistol_box_squat: { name: 'Pistol box squat', cat: 'balance', added: 5, r: [5, 6, 8], side: 1, tp: 4, mus: 'quads glutes | abs adductors calves', cue: 'Stand on one leg in front of a chair, the other leg straight out. Sit back to the chair under control, then stand up on the one leg. Switch.', poses: [
      P(STAND, { ff: [0, 41], fn: [36, 18], hn: [34, -30], hf: [34, -29] }), { t: [16, -30], ff: [10, 26], khf: [1, -0.6], fn: [41, 12], hn: [48, -24], hf: [48, -23] }] },
    single_leg_hop_stick: { name: 'Single-leg hop and stick', cat: 'balance', added: 5, r: [6, 8, 10], side: 1, tp: 3, mus: 'calves quads glutes | abs', cue: 'Hop forward on one leg and land softly, knee over toes, and hold still for two seconds before the next hop. Switch.', poses: [
      P(STAND, { lift: 8, fn: [-10, 30], khn: [0.3, 1] }), { t: [12, -32], ff: [4, 36], khf: [1, -0.4], fn: [-18, 28], khn: [0.3, 1], hn: [18, -12], hf: [-10, -12] }] },
    lateral_bound_hold: { name: 'Lateral bound and hold', cat: 'balance', added: 5, view: 'front', r: [8, 10, 12], alt: 1, tp: 3, mus: 'glutes quads | adductors calves abs', cue: 'Leap sideways from one foot and land on the other, knee soft, and hold the landing for two seconds. Bound back.', poses: [
      { t: [-6, -33], fn: [-10, 37], khn: [-1, -0.2], ff: [24, 18], khf: [1, 0.3], hn: [-24, -14], hf: [18, -20] }, { t: [6, -33], ff: [10, 37], khf: [1, -0.2], fn: [-24, 18], khn: [-1, 0.3], hn: [-18, -20], hf: [24, -14] }] },
    copenhagen_plank: { name: 'Copenhagen plank', cat: 'balance', added: 5, u: 'sec', r: [15, 20, 25], side: 1, mus: 'adductors obliques | abs glutes', cue: 'Side plank on your forearm with the top leg resting on a chair seat and the bottom leg under it or lifted. Hips high. Switch.', poses: [
      { ...FOREARM, t: [33, -12], fn: [-40, -12], ff: [-40, -10], hf: [34, -44], ehf: [0, -1] }] },
    single_leg_calf_raise: { name: 'Single-leg calf raise', cat: 'balance', added: 5, r: [12, 15, 18], side: 1, tp: 2, mus: 'calves | abs', cue: 'Stand on one leg, a fingertip on a wall, and rise onto the ball of the foot as high as you can. Lower slowly. Switch.', poses: [
      P(STAND, { fn: [-10, 30], khn: [0.3, 1] }), P(STAND, { lift: 5, fn: [-10, 30], khn: [0.3, 1] })] },
    single_leg_rdl_bw: { name: 'Single-leg deadlift (bodyweight)', cat: 'balance', added: 5, r: [8, 10, 12], side: 1, tp: 3.5, mus: 'hamstrings glutes | lower_back abs', cue: 'Balance on one leg and hinge forward with a flat back as the other leg lifts behind you, then squeeze your glute to stand. Switch.', poses: [
      STAND, { t: [30, -16], fn: [2, 41], ff: [-38, -12], hn: [30, 14], hf: [29, 14] }] },
    lunge_to_balance: { name: 'Reverse lunge to knee drive', cat: 'balance', added: 5, r: [8, 10, 12], side: 1, tp: 4, mus: 'glutes quads | hip_flexors abs calves', cue: 'Step back into a lunge, then drive the back knee up to hip height and balance there for a moment before the next rep. Switch.', poses: [
      P(LUNGE_F, {}), P(STAND, { ff: [0, 41], fn: [16, 6], khn: [1, -1], hn: [-12, -20], hf: [16, -40] })] },

    // ---------------- HIIT (Phase 5: fast cardio for timed formats) ----------------
    skater_jumps: { name: 'Skater jumps', cat: 'cardio', added: 5, r: [20, 24, 30], alt: 1, tp: 1.5, mus: 'glutes quads | calves adductors abs', cue: 'Leap sideways from one foot to the other, landing softly with the trailing leg sweeping behind, like a speed skater.', poses: [
      { t: [14, -31], fn: [4, 36], khn: [1, -0.4], ff: [-26, 34], khf: [0.3, 1], hn: [-16, -8], hf: [26, -18] }, { t: [14, -31], ff: [4, 36], khf: [1, -0.4], fn: [-26, 34], khn: [0.3, 1], hf: [-16, -8], hn: [26, -18] }] },
    tuck_jumps: { name: 'Tuck jumps', cat: 'cardio', added: 5, r: [8, 10, 12], tp: 2, mus: 'quads glutes hip_flexors | calves abs', cue: 'Dip and jump straight up, pulling both knees toward your chest at the top. Land softly and go again.', poses: [
      { t: [16, -30], fn: [10, 30], ff: [8, 30], kh: [1, -0.3], hn: [-12, -6], hf: [-13, -6] }, { t: [2, -34], lift: 22, fn: [10, 6], ff: [9, 7], kh: [1, -1], hn: [18, -12], hf: [17, -12] }] },
    sprawl: { name: 'Sprawls', cat: 'cardio', added: 5, r: [10, 12, 15], tp: 2.5, mus: 'abs quads chest | hip_flexors front_delts', cue: 'From standing, drop your hands and shoot your legs back so your hips land low near the floor, then snap back up to your feet.', poses: [
      STAND, P(SQUAT, { hn: [22, 30], hf: [24, 30] }), { t: [30, -14], hd: [1, -0.3], hn: [30, 18], hf: [33, 18], fn: [-38, 16], ff: [-39, 17] }] },
    burpee_broad_jump: { name: 'Burpee broad jump', cat: 'cardio', added: 5, r: [6, 8, 10], tp: 4, mus: 'quads glutes chest | calves triceps abs', cue: 'Do a burpee, then jump forward as far as you can, land softly, turn around and repeat.', poses: [
      PLANK, P(SQUAT, { hn: [-12, -6], hf: [-13, -6] }), { t: [14, -31], lift: 12, fn: [-12, 38], ff: [-14, 38], hn: [40, -50], hf: [38, -50] }] },
    plank_jacks: { name: 'Plank jacks', cat: 'cardio', added: 5, r: [20, 24, 30], tp: 1, mus: 'abs | adductors front_delts calves', cue: 'In a straight-arm plank, jump your feet wide and back together quickly without letting your hips bounce.', poses: [
      PLANK, P(PLANK, { t: [30, -17], fn: [-36, 18], ff: [-40, 18] })] },
    fast_step_ups: { name: 'Fast step-ups', cat: 'cardio', added: 5, r: [20, 24, 30], alt: 1, tp: 1.2, mus: 'quads glutes | calves hip_flexors', cue: 'Step quickly up onto a low step or the bottom stair and back down, leading with alternate feet, arms pumping.', poses: [
      P(STAND, { fn: [16, 22], khn: [1, -1], hn: [-12, -10], hf: [14, -18] }), P(STAND, { ff: [16, 22], khf: [1, -1], fn: [2, 41], hf: [-12, -10], hn: [14, -18] })] },
    fast_feet: { name: 'Fast feet', cat: 'cardio', added: 5, u: 'sec', r: [30, 30, 30], mus: 'calves quads | glutes abs', cue: 'In a low athletic stance, patter your feet as fast as you can, staying on the balls of the feet, arms ready.', poses: [
      { t: [12, -32], fn: [10, 34], ff: [-6, 35], kh: [1, -0.4], hn: [24, -14], hf: [20, -12] }, { t: [12, -32], lift: 4, fn: [12, 30], ff: [-6, 35], kh: [1, -0.4], hn: [24, -14], hf: [20, -12] }] },
    lateral_shuffle: { name: 'Lateral shuffle', cat: 'cardio', added: 5, view: 'front', u: 'sec', r: [30, 30, 30], mus: 'glutes quads adductors | calves', cue: 'Low and wide, shuffle three quick steps to one side without crossing your feet, touch down, and shuffle back.', poses: [
      { t: [0, -32], fn: [-24, 32], ff: [24, 32], khn: [-1, 0], khf: [1, 0], hn: [-14, -12], hf: [14, -12] }, { t: [0, -32], fn: [-12, 34], ff: [12, 34], khn: [-1, 0], khf: [1, 0], hn: [-14, -12], hf: [14, -12] }] },
    sprint_in_place: { name: 'Sprint in place', cat: 'cardio', added: 5, u: 'sec', r: [30, 30, 30], mus: 'hip_flexors quads calves | abs glutes', cue: 'Sprint on the spot as fast as you can: knees driving up, on the balls of your feet, arms pumping hard.', poses: [
      { t: [6, -34], fn: [18, 4], khn: [1, -1], ff: [-4, 41], hn: [-14, -20], hf: [20, -34] }, { t: [6, -34], ff: [18, 4], khf: [1, -1], fn: [-4, 41], hf: [-14, -20], hn: [20, -34] }] },
    seal_jacks: { name: 'Seal jacks', cat: 'cardio', added: 5, view: 'front', r: [20, 24, 30], tp: 1, mus: 'chest calves | rear_delts quads', cue: 'Like a jumping jack, but your arms open wide at shoulder height as the feet jump out, and clap in front as they jump in.', poses: [
      P(FSTAND, { hn: [-40, -34], hf: [40, -34] }), P(FSTAND, { fn: [-20, 38], ff: [20, 38], hn: [-3, -34], hf: [3, -34], ehn: [0, 1], ehf: [0, 1] })] },

    // ---------------- PLYOMETRICS (Phase 5: few, fast, full-effort reps with long rests) ----------------
    broad_jump: { name: 'Broad jumps', cat: 'lower', added: 5, r: [5, 6, 8], tp: 4, mus: 'glutes quads | hamstrings calves', cue: 'Swing your arms back, then jump forward as far as you can, landing softly in a half squat. Reset fully before the next one.', poses: [
      P(SQUAT, { hn: [-14, -6], hf: [-15, -6] }), { t: [16, -31], lift: 14, fn: [-14, 36], ff: [-16, 36], hn: [42, -46], hf: [40, -46] }, P(SQUAT, { hn: [30, -14], hf: [29, -14] })] },
    drop_squat: { name: 'Drop squats', cat: 'lower', added: 5, r: [6, 8, 10], tp: 2.5, mus: 'quads glutes | calves hamstrings', cue: 'Rise onto your toes with arms up, then drop quickly into a half squat and stick the landing, as if landing from a box.', poses: [
      P(STAND, { lift: 4, ...ARMS_UP }), P(SQUAT, { hn: [-14, -6], hf: [-15, -6] })] },
    lateral_bounds: { name: 'Lateral bounds', cat: 'lower', added: 5, view: 'front', r: [10, 12, 16], alt: 1, tp: 1.8, mus: 'glutes quads adductors | calves', cue: 'Bound powerfully sideways from one leg to the other, going for distance, and push off again straight away.', poses: [
      { t: [-6, -33], fn: [-10, 37], khn: [-1, -0.2], ff: [24, 18], khf: [1, 0.3], hn: [-24, -14], hf: [18, -20] }, { t: [0, -34], lift: 12, fn: [-14, 36], ff: [14, 36], hn: [-26, -24], hf: [26, -24] }] },
    pogo_hops: { name: 'Pogo hops', cat: 'lower', added: 5, r: [20, 25, 30], tp: 0.7, mus: 'calves | quads', cue: 'Small, quick, springy hops on the balls of your feet with nearly straight knees, spending as little time on the ground as you can.', poses: [
      P(STAND, { lift: 1 }), P(STAND, { lift: 8, fn: [4, 41], ff: [2, 41] })] },
    single_leg_hops: { name: 'Single-leg hops', cat: 'lower', added: 5, r: [8, 10, 12], side: 1, tp: 1.5, mus: 'calves quads glutes | abs', cue: 'Hop continuously on one foot, springy and quick, staying tall. Switch legs.', poses: [
      P(STAND, { fn: [-10, 30], khn: [0.3, 1] }), P(STAND, { lift: 8, fn: [-10, 30], khn: [0.3, 1] })] },
    clap_pushup: { name: 'Clap push-ups', cat: 'chest', added: 5, r: [5, 6, 8], tp: 3, mus: 'chest triceps front_delts | abs', cue: 'Lower, then push up hard enough to clap your hands before landing with soft elbows. Knees down is fine while you build up.', poses: [
      PUSHB, { ...PLANK, t: [30, -19], hn: [34, 2], hf: [34, 2], eh: [0, 1] }] },
    power_skips: { name: 'Power skips', cat: 'cardio', added: 5, r: [10, 12, 16], alt: 1, tp: 1.5, mus: 'calves glutes hip_flexors | quads', cue: 'Skip for height, driving one knee up and the opposite arm high each time, landing softly.', poses: [
      { t: [2, -34], lift: 12, fn: [16, 6], khn: [1, -1], ff: [-4, 41], hn: [-14, -22], hf: [8, -64] }, { t: [2, -34], lift: 12, ff: [16, 6], khf: [1, -1], fn: [-4, 41], hf: [-14, -22], hn: [8, -64] }] },
    star_jumps: { name: 'Star jumps', cat: 'cardio', added: 5, view: 'front', r: [8, 10, 12], tp: 2, mus: 'quads glutes | calves side_delts', cue: 'Crouch, then explode up into a star, arms and legs wide in the air. Land with feet together and soft knees.', poses: [
      { t: [0, -30], fn: [-8, 26], ff: [8, 26], khn: [-1, -0.3], khf: [1, -0.3], hn: [-8, -2], hf: [8, -2] }, { t: [0, -34], lift: 14, fn: [-26, 32], ff: [26, 32], hn: [-28, -62], hf: [28, -62] }] },
    bounding: { name: 'Bounding', cat: 'lower', added: 5, r: [10, 12, 16], alt: 1, tp: 1.5, mus: 'glutes quads | hamstrings calves hip_flexors', cue: 'Exaggerated running strides in place or across the room: drive the knee up, push hard off the back foot and float.', poses: [
      { t: [6, -33], lift: 10, fn: [22, 12], khn: [1, -1], ff: [-30, 26], khf: [0.2, 1], hn: [-10, -14], hf: [24, -40] }, { t: [6, -33], lift: 10, ff: [22, 12], khf: [1, -1], fn: [-30, 26], khn: [0.2, 1], hf: [-10, -14], hn: [24, -40] }] },
    pause_squat_jump: { name: 'Pause squat jumps', cat: 'lower', added: 5, r: [5, 6, 8], tp: 4, mus: 'quads glutes | calves', cue: 'Squat down and hold still for two seconds, then jump as high as you can from the pause. Land softly and reset.', poses: [
      P(SQUAT, { hn: [30, -18], hf: [29, -18] }), P(STAND, { lift: 14, ...ARMS_UP })] },

    // ---------------- MORE STRENGTH (Phase 5: dumbbell, kettlebell and bar variety) ----------------
    floor_fly: { name: 'Dumbbell floor fly', cat: 'chest', added: 5, r: [12, 14, 15], tp: 3, load: 'light', mus: 'chest | front_delts biceps', cue: 'On your back, dumbbells over your chest with soft elbows. Open the arms wide until the upper arms touch the floor, then hug them back up.', poses: [
      P(SUP, { hn: [34, -33], hf: [35, -33], db: 'nf' }), P(SUP, { hn: [30, -8], hf: [40, -8], eh: [0, 1], db: 'nf' })] },
    arnold_press: { name: 'Arnold press', cat: 'upper', added: 5, r: [10, 12, 12], tp: 3.5, load: 'medium', mus: 'front_delts side_delts triceps | upper_back', cue: 'Start with the dumbbells at your chin, palms facing you. Press up while turning the palms forward, and reverse on the way down.', poses: [
      P(STAND, { hn: [10, -38], hf: [9, -37], eh: [0, 1], db: 'nf' }), P(STAND, { hn: [3, -67], hf: [1, -67], db: 'nf' })] },
    hang_knee_raise: { name: 'Hanging knee raises', cat: 'abs', added: 5, equip: ['bar'], r: [10, 12, 15], tp: 3, mus: 'abs hip_flexors | forearms lats', cue: 'Hang from the bar, shoulders active. Curl your knees up toward your chest without swinging, then lower slowly.', poses: [
      HANG, P(HANG, { fn: [20, 19], ff: [19, 20], kh: [1, -1] })] },
    l_sit_hang: { name: 'L-sit hang', cat: 'abs', added: 5, equip: ['bar'], u: 'sec', r: [10, 15, 20], mus: 'abs hip_flexors | forearms lats quads', cue: 'Hang from the bar and lift straight legs to hip height, toes pointed. Bent knees are fine while you build up.', poses: [
      P(HANG, { fn: [40, -3], ff: [39, -2], kh: [1, -0.2] })] },
    commando_pullup: { name: 'Commando pull-ups', cat: 'back', added: 5, equip: ['bar'], r: [4, 5, 6], alt: 1, tp: 4.5, mus: 'lats biceps | upper_back forearms obliques', cue: 'Grip the bar with hands close, one in front of the other. Pull up so your head passes one side of the bar, lower, then the other side.', poses: [
      HANG, P(PULLTOP, { t: [-7, -33], hd: [-0.3, -1] })] },
    kb_windmill: { name: 'Kettlebell windmill', cat: 'full', added: 5, view: 'front', r: [5, 6, 8], side: 1, tp: 5, load: 'kb', mus: 'obliques glutes | side_delts hamstrings', cue: 'Bell locked out overhead, feet turned away from it. Push your hip out and slide the free hand down your leg, eyes on the bell. Stand back up. Switch.', poses: [
      P(FSTAND, { fn: [-10, 41], ff: [10, 41], hf: [14, -66], kb: 'f', kbd: [0, -1] }), { t: [-20, -27], fn: [-12, 40], ff: [12, 39], hn: [-26, 20], ehn: [-1, 0], hf: [4, -62], ehf: [1, 0], kb: 'f', kbd: [0.3, -1] }] },
    bottoms_up_press: { name: 'Bottoms-up press', cat: 'upper', added: 5, r: [5, 6, 8], side: 1, tp: 4, load: 'kb', mus: 'front_delts forearms | triceps side_delts abs', cue: 'Hold the bell upside down by the handle, bottom to the ceiling, and press it overhead slowly without letting it tip. Switch.', poses: [
      P(STAND, { hn: [8, -46], ehn: [0.2, 1], kb: 'n', kbd: [0, -1] }), P(STAND, { hn: [2, -67], kb: 'n', kbd: [0, -1] })] },
    db_step_up: { name: 'Dumbbell step-ups', cat: 'lower', added: 5, r: [10, 12, 12], side: 1, tp: 3.5, load: 'medium', mus: 'quads glutes | hamstrings calves', cue: 'Dumbbells at your sides, step onto a sturdy chair or step and drive through that heel to stand tall on top. Step down slowly. Switch legs.', poses: [
      P(STAND, { fn: [16, 20], khn: [1, -1], db: 'nf' }), P(STAND, { lift: 20, ff: [-10, 36], khf: [0.3, 1], db: 'nf' })] },
    bulgarian_split_squat: { name: 'Bulgarian split squats', cat: 'lower', added: 5, r: [8, 10, 12], side: 1, tp: 3.5, load: 'medium', mus: 'quads glutes | adductors hamstrings', cue: 'Back foot on a chair behind you, dumbbells at your sides. Sink straight down until the front thigh is level, then drive up. Switch legs.', poses: [
      { t: [2, -34], fn: [18, 40], ff: [-32, 8], khf: [0.2, 1], hn: [4, -1], hf: [2, -1], db: 'nf' }, { t: [4, -34], fn: [20, 26], khn: [1, -1], ff: [-30, -4], khf: [0.2, 1], hn: [6, -1], hf: [4, -1], db: 'nf' }] },
    hip_thrust: { name: 'Hip thrusts', cat: 'lower', added: 5, r: [10, 12, 15], tp: 3.5, load: 'single', mus: 'glutes | hamstrings quads', cue: 'Upper back against the edge of a couch or chair, a dumbbell on your hips. Drive your hips up until your body is flat from knees to shoulders, squeeze, lower.', poses: [
      { t: [30, -16], hd: [0.6, -1], fn: [-24, 20], ff: [-26, 20], kh: [0, -1], hn: [2, -4], hf: [2, -3], eh: [0, -1], db: 'both' }, { t: [34, -2], hd: [1, -0.4], fn: [-22, 22], ff: [-24, 22], kh: [0, -1], hn: [4, -6], hf: [4, -5], eh: [0, -1], db: 'both' }] },
    zercher_squat: { name: 'Kettlebell zercher squat', cat: 'lower', added: 5, r: [8, 10, 12], tp: 3.5, load: 'kb', mus: 'quads glutes upper_back | abs biceps', cue: 'Cradle the bell in the crooks of your elbows against your chest. Squat deep with an upright torso, then stand.', poses: [
      P(STAND, { hn: [10, -22], hf: [9, -22], eh: [0, 1], kb: 'both', kbd: [0, 1] }), P(SQUAT, { hn: [24, -22], hf: [23, -22], eh: [0, 1], kb: 'both', kbd: [0, 1] })] },
    kb_row: { name: 'Kettlebell row', cat: 'back', added: 5, r: [10, 12, 12], side: 1, tp: 3, load: 'kb', mus: 'lats upper_back | biceps rear_delts', cue: 'Split stance, free hand on your front knee. Row the bell to your hip, elbow brushing your side, and lower with control. Switch.', poses: [
      P(STAG, { hn: [30, 15], kb: 'n', kbd: [0, 1] }), P(STAG, { hn: [14, -3], ehn: [-1, -1], kb: 'n', kbd: [0, 1] })] },

    // ---------------- MORE EVERYDAY (Phase 5: core and bodyweight variety) ----------------
    dragon_flag_negative: { name: 'Dragon flag negatives', cat: 'abs', added: 5, r: [3, 4, 5], tp: 6, mus: 'abs | hip_flexors lats obliques', cue: 'Lie on your back holding something sturdy behind your head. Lift your body straight up onto your shoulders, then lower it as one rigid line, as slowly as you can.', poses: [
      { t: [14, 31], hd: [1, 0.4], fn: [-6, -41], ff: [-5, -40], hn: [34, 36], hf: [35, 36], eh: [0, -1], mat: 1 }, { t: [30, 16], hd: [1, 0], fn: [-39, -12], ff: [-38, -11], hn: [48, 18], hf: [49, 18], eh: [0, -1], mat: 1 }] },
    body_saw: { name: 'Body saw', cat: 'abs', added: 5, r: [10, 12, 15], tp: 3, mus: 'abs | front_delts lats', cue: 'In a forearm plank with feet on a towel or socks, rock your whole body back past your elbows and forward again, hips level.', poses: [
      FOREARM, { t: [33, -8], hn: [42, 9], hf: [44, 9], fn: [-48, 9], ff: [-49, 9], eh: [-0.2, 1], mat: 1 }] },
    windshield_wipers: { name: 'Windshield wipers', cat: 'abs', added: 5, r: [8, 10, 12], alt: 1, tp: 4, mus: 'obliques abs | hip_flexors', cue: 'On your back, arms wide, legs up together. Lower both legs to one side without letting your shoulders lift, then sweep them over to the other. Bend the knees to make it easier.', poses: [
      P(LIE, { fn: [0, -41], ff: [1, -40], hn: [20, 3], hf: [21, 3] }), P(LIE, { fn: [-28, -30], ff: [-27, -29], hn: [20, 3], hf: [21, 3] })] },
    cross_climber: { name: 'Cross-body climbers', cat: 'abs', added: 5, r: [20, 24, 30], alt: 1, tp: 1.2, mus: 'obliques abs | hip_flexors front_delts', cue: 'In a straight-arm plank, drive one knee across toward the opposite elbow, then switch, fast and controlled.', poses: [
      P(PLANK, { fn: [8, 12], khn: [1, 0.5] }), P(PLANK, { ff: [8, 12], khf: [1, 0.5] })] },
    plank_walkout: { name: 'Plank walk-outs', cat: 'abs', added: 5, r: [6, 8, 10], tp: 6, mus: 'abs front_delts | hamstrings chest triceps', cue: 'From standing, fold down and walk your hands out to a long plank, even past your shoulders, then walk them back and stand.', poses: [
      FOLD, PLANK, P(PLANK, { t: [30, -12], hn: [46, 18], hf: [48, 18] })] },
    table_row: { name: 'Table rows', cat: 'back', added: 5, r: [8, 10, 12], tp: 3, mus: 'lats upper_back | biceps rear_delts abs', cue: 'Lie under a sturdy table, grip the edge and pull your chest to it with your body straight from heels to shoulders. Bend the knees to make it easier.', poses: [
      { t: [33, -6], hd: [0.6, -1], fn: [-40, 4], ff: [-41, 5], hn: [36, -38], hf: [37, -38], mat: 1 }, { t: [31, -14], hd: [0.6, -1], fn: [-40, 4], ff: [-41, 5], hn: [34, -30], hf: [35, -30], eh: [-1, 1], mat: 1 }] },
    // Phase 10: floor-only stand-ins (travel mode's Bodyweight only, the Swap list, builds at catalogue 6 and later)
    prone_lat_pull: { name: 'Prone lat pulls', cat: 'back', added: 6, r: [10, 12, 15], tp: 3, mus: 'lats upper_back | rear_delts lower_back', cue: 'Face down, arms long overhead and just off the floor. Pull your elbows down to your ribs, squeezing the shoulder blades, then reach long again.', poses: [
      { t: [33, -6], hd: [1, 0], fn: [-41, 0], ff: [-41, 1], hn: [64, -9], hf: [64, -8], mat: 1 }, { t: [33, -6], hd: [1, 0], fn: [-41, 0], ff: [-41, 1], hn: [20, -10], hf: [20, -9], eh: [-1, -1], mat: 1 }] },
    superman_row: { name: 'Superman rows', cat: 'back', added: 6, r: [8, 10, 12], tp: 3.5, mus: 'upper_back lats | lower_back rear_delts glutes', cue: 'Face down, lift your chest and arms off the floor and hold them up. Row your elbows back past your ribs, then reach forward again without lowering.', poses: [
      { t: [31, -13], hd: [1, -0.3], fn: [-41, -3], ff: [-41, -2], hn: [60, -27], hf: [60, -26], mat: 1 }, { t: [31, -13], hd: [1, -0.3], fn: [-41, -3], ff: [-41, -2], hn: [12, -18], hf: [12, -17], eh: [-1, -1], mat: 1 }] },
    side_lying_raise: { name: 'Side-lying lateral raises', cat: 'upper', added: 6, r: [12, 15, 18], tp: 3, side: 1, mus: 'side_delts | upper_back', cue: 'Lie on your side, head on your bottom arm. Raise the top arm from your hip until it points at the ceiling, pause, lower slowly. Switch sides.', poses: [
      { t: [34, -4], hd: [1, -0.3], hn: [46, -3], fn: [-41, 2], ff: [-41, 0], hf: [0, -5], ehf: [0, -1], mat: 1 }, { t: [34, -4], hd: [1, -0.3], hn: [46, -3], fn: [-41, 2], ff: [-41, 0], hf: [36, -37], ehf: [1, 0], mat: 1 }] },
    reverse_plank: { name: 'Reverse plank', cat: 'abs', added: 5, u: 'sec', r: [20, 30, 40], mus: 'glutes lower_back | hamstrings rear_delts triceps', cue: 'Sit with legs long, hands behind your hips, then lift the hips until your body is straight from heels to shoulders, chest proud.', poses: [
      { t: [32, -10], hd: [0.8, -1], hn: [34, 20], hf: [35, 20], fn: [-40, 18], ff: [-41, 18], mat: 1 }] },
    side_plank_dip: { name: 'Side plank hip dips', cat: 'abs', added: 5, r: [10, 12, 15], side: 1, tp: 2.5, mus: 'obliques | abs glutes', cue: 'In a side plank on your forearm, lower the hip toward the floor and lift it back up high. Switch sides.', poses: [
      P(FOREARM, { hf: [34, -41], ehf: [0, -1] }), P(FOREARM, { t: [34, -3], fn: [-40, 9], ff: [-41, 9], hf: [36, -36], ehf: [0, -1] })] },
    heel_taps: { name: 'Heel taps', cat: 'abs', added: 5, r: [20, 24, 30], alt: 1, tp: 1.2, mus: 'obliques | abs', cue: 'On your back, knees bent and head and shoulders curled up. Reach side to side to tap each heel with the hand on that side.', poses: [
      { ...CURL, fn: [-22, 1], ff: [-21, 2], kh: [0, -1], hn: [2, -3], hf: [4, -2], mat: 1 }, { ...CURL, t: [33, -9], fn: [-22, 1], ff: [-21, 2], kh: [0, -1], hn: [4, -2], hf: [2, -3], mat: 1 }] },
    plank_reach: { name: 'Plank reaches', cat: 'abs', added: 5, r: [12, 16, 20], alt: 1, tp: 2.5, mus: 'abs obliques | front_delts glutes', cue: 'In a straight-arm plank, feet wide, reach one arm straight ahead without twisting your hips. Put it down and switch.', poses: [
      PLANK, P(PLANK, { hn: [62, -14], ehn: [0, -1] })] },
    bear_hold: { name: 'Bear plank hold', cat: 'abs', added: 5, u: 'sec', r: [30, 40, 50], mus: 'abs | front_delts quads', cue: 'On hands and toes with knees bent under your hips, lift the knees an inch off the floor and hold, back flat.', poses: [
      { t: [34, 0], hn: [34, 30], hf: [36, 30], fn: [-16, 30], ff: [-17, 30], kh: [1, 0.2], mat: 1 }] },
    glute_bridge_march: { name: 'Glute bridge march', cat: 'lower', added: 5, r: [12, 16, 20], alt: 1, tp: 2.5, mus: 'glutes | hamstrings abs', cue: 'Hold a high glute bridge and lift one knee toward your chest, then the other, without your hips dropping or twisting.', poses: [
      GB_UP, P(GB_UP, { fn: [10, -12], khn: [1, -1] })] },
  };


  /* Muscles each exercise works: 'primary | secondary', space-separated group ids (see MUSCLE_NAMES). */
  const MUSCLE_NAMES = {
    chest: 'Chest', front_delts: 'Front shoulders', side_delts: 'Side shoulders', rear_delts: 'Rear shoulders',
    triceps: 'Triceps', biceps: 'Biceps', forearms: 'Forearms', lats: 'Lats', upper_back: 'Upper back',
    lower_back: 'Lower back', abs: 'Abs', obliques: 'Obliques', hip_flexors: 'Hip flexors', glutes: 'Glutes',
    quads: 'Quads', hamstrings: 'Hamstrings', adductors: 'Inner thighs', calves: 'Calves',
  };
  const MUS = {
    pushup: 'chest triceps front_delts | abs', diamond_pushup: 'triceps chest | front_delts abs',
    dive_bomber: 'chest front_delts triceps | lower_back abs', db_floor_press: 'chest triceps | front_delts',
    db_pullover: 'lats chest | triceps abs', spiderman_pushup: 'chest triceps obliques | front_delts abs hip_flexors',
    explosive_pushup: 'chest triceps front_delts | abs', plank_to_pushup: 'triceps abs chest | front_delts',
    pullup: 'lats upper_back | biceps forearms rear_delts', chinup: 'lats biceps | upper_back forearms',
    negative_pullup: 'lats upper_back biceps | forearms', chin_hold: 'biceps lats forearms | upper_back abs',
    db_row: 'lats upper_back | biceps rear_delts forearms', one_arm_row: 'lats upper_back | biceps rear_delts obliques',
    renegade_row: 'lats abs | upper_back triceps obliques', kb_high_pull: 'upper_back rear_delts glutes | hamstrings side_delts biceps',
    superman: 'lower_back glutes | upper_back hamstrings',
    crunch: 'abs | obliques', situp: 'abs hip_flexors | obliques', db_situp: 'abs hip_flexors | obliques',
    leg_raise: 'abs hip_flexors |', weighted_crunch: 'abs | obliques', weighted_dead_bug: 'abs | hip_flexors front_delts',
    db_side_bend: 'obliques | abs lower_back', weighted_toe_touch: 'abs | front_delts', plank: 'abs | front_delts glutes',
    side_plank: 'obliques | abs glutes side_delts', bicycle_crunch: 'obliques abs | hip_flexors',
    russian_twist: 'obliques abs | hip_flexors', flutter_kicks: 'abs hip_flexors | quads', hollow_hold: 'abs | hip_flexors',
    v_up: 'abs hip_flexors |', dead_bug: 'abs | hip_flexors', mountain_climber: 'abs hip_flexors | front_delts quads',
    shoulder_taps: 'abs obliques | front_delts triceps', reverse_crunch: 'abs | hip_flexors', toe_touch: 'abs |',
    bird_dog: 'lower_back abs glutes | rear_delts', knee_tuck: 'abs hip_flexors |',
    jumping_jacks: 'calves side_delts | quads glutes', high_knees: 'hip_flexors quads | calves abs',
    burpee: 'quads chest | triceps abs glutes', squat_jump: 'quads glutes | calves', jump_lunge: 'quads glutes | calves hamstrings',
    butt_kicks: 'hamstrings calves | quads', punches: 'front_delts triceps | obliques', squat_thrust: 'abs quads | hip_flexors front_delts',
    kb_swing: 'glutes hamstrings | lower_back abs forearms',
    db_shoulder_press: 'front_delts side_delts triceps | upper_back', lateral_raise: 'side_delts | upper_back',
    db_curl: 'biceps | forearms', hammer_curl: 'biceps forearms |', db_skullcrusher: 'triceps |',
    overhead_triceps_ext: 'triceps | abs', db_kickback: 'triceps | rear_delts', pike_pushup: 'front_delts triceps | upper_back chest',
    kb_press: 'front_delts triceps | side_delts abs', db_front_raise: 'front_delts | side_delts',
    kb_clean_press: 'front_delts glutes hamstrings | triceps upper_back abs', db_thruster: 'quads glutes front_delts | triceps abs',
    goblet_squat: 'quads glutes | abs adductors', db_lunge: 'quads glutes | hamstrings adductors', reverse_lunge: 'glutes quads | hamstrings',
    split_squat: 'quads glutes | hamstrings adductors', db_squat: 'quads glutes | hamstrings forearms',
    db_rdl: 'hamstrings glutes | lower_back forearms', single_leg_rdl: 'hamstrings glutes | lower_back abs',
    kb_sumo_deadlift: 'glutes adductors quads | hamstrings lower_back', glute_bridge: 'glutes | hamstrings',
    single_leg_bridge: 'glutes hamstrings | abs', wall_sit: 'quads | glutes', lateral_lunge: 'adductors glutes quads | hamstrings',
  };

  const LOAD = {
    light: 'Dumbbells 6–8 kg',
    medium: 'Dumbbells 8–12 kg',
    heavy: 'Dumbbells 12–16 kg',
    single: 'One dumbbell 10–14 kg',
    kb: 'Kettlebell',
  };

  // Defaults and derived fields (no authored numbers are changed here). Muscles are written
  // 'primary … | secondary …'; every exercise needs at least one primary muscle.
  function normalize(ex, mus) {
    Object.keys(ex).forEach((k) => {
      const e = ex[k];
      e.id = k; e.u = e.u || 'reps'; e.lv = 1;
      const [pri, sec = []] = (mus[k] || e.mus || '|').split('|').map((x) => x.trim().split(/\s+/).filter(Boolean));
      e.muscles = { primary: pri, secondary: sec };
    });
    const missing = Object.keys(ex).filter((k) => !ex[k].muscles.primary.length);
    if (missing.length) throw new Error('No muscles for: ' + missing.join(', '));
    return ex;
  }
  normalize(EX, MUS);

  // Equipment a program allows: everything, kettlebell only (no dumbbells, no bar), or bodyweight.
  const EQUIP = {
    all: () => true,
    kb: (e) => (!e.load || e.load === 'kb') && !(e.equip || []).includes('bar'),
    bw: (e) => !e.load && !(e.equip || []).includes('bar'),
  };
  const allowedIn = (equip, e) => EQUIP[equip || 'all'](e);
  // reps inside a timed format are a fraction of the straight-set number
  function scaleReps(e, n, format) {
    if (Formats.of({ format }).halveReps) return e.u === 'sec' ? Math.min(n, 30) : Math.max(3, Math.round(n * 0.5));
    return n;
  }
  const api = { EX, LOAD, MUSCLE_NAMES, normalize, allowedIn, scaleReps };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBEx = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./formats.js') : window.KBFormats);
