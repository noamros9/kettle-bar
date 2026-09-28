/* Kettle & Bar exercise catalogue: every exercise and stretch with its poses, reps per level, muscles,
   cue and suggested load. Data only; drawing lives in figures.js. */
(function (root) {
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

  // Defaults and derived fields (no authored numbers are changed here).
  Object.keys(EX).forEach((k) => {
    const e = EX[k];
    e.id = k; e.u = e.u || 'reps'; e.lv = 1;
    const [pri, sec] = (MUS[k] || e.mus || '|').split('|').map((x) => x.trim().split(/\s+/).filter(Boolean));
    e.muscles = { primary: pri, secondary: sec || [] };
  });
  const missing = Object.keys(EX).filter((k) => !EX[k].muscles.primary.length);
  if (missing.length) throw new Error('No muscles for: ' + missing.join(', '));
  const exercise = (id) => EX[id];
  const api = { EX, LOAD, MUSCLE_NAMES, exercise };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBEx = api;
})(typeof window !== 'undefined' ? window : globalThis);
