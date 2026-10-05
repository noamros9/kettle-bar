// The Mixed family (Phase 6): programs whose days hold blocks from more than one family. Every main block says which
// (family: 'Strength' | 'Cardio & combat' | 'Mind & body'), so Phase 8's stats can split a day by family, and each
// block has its own lever where they differ: strength levels by weight or reps, a flow by holds (lever: [null, 'holds', 'holds']).
// absSlots per day type: a day that ends with strength keeps its abs, a day that ends in a flow has none.
const { S, SS, C, E, A, T, L, F, B } = require('./shared.js');

const ABS = ['absW', 'abs', 'abs?'];
const ONCE = { values: [1] };
const LIFT = { family: 'Strength' }; // a strength block of a mixed day
// a flow of a mixed day: held longer at Level II and III whatever the strength lever is; scale: short stretches (15 s) get longer holds too
const FLOW = { family: 'Mind & body', lever: [null, 'holds', 'holds'] };
const FLOW_SCALED = { ...FLOW, scale: 2, cap: 90 };
// Fighter and Athlete: bouts get harder by variation (longer combinations), a conditioning circuit is Cardio & combat like the bouts,
// plyometrics are straight sets of few explosive reps (reps, then harder jumps) on long rests, and balance work is Mind & body
const BOUTS = { family: 'Cardio & combat', lever: [null, 'variation', 'variation'] };
const SWITCH = { ...BOUTS, switchStance: 1 }; // orthodox and southpaw in turn
const COND = { family: 'Cardio & combat' };
const PLYO = { family: 'Cardio & combat', lever: [null, 'reps', 'variation'] };
const BAL = { family: 'Mind & body' };
const PLYO_RESTS = { set: 60, exercise: 90 }; // as in the Plyometrics programs
// Balanced week: conditioning that levels by reps whatever the strength lever is (it has no weight to add)
const CARDIO = { family: 'Cardio & combat', lever: [null, 'reps', 'reps'] };
const CARDIO_TABATA = { ...CARDIO, values: [1, 2] };
// Calm strength: Pilates and core are Mind & body, they level by reps; the strength block is slow (tempo lever at Level II, then
// tempo again or weight); the finish is yin, held long: scale 3 and cap 120 make even a 30 s stretch a minute and a half, up to two minutes, and Level II and III hold longer still
const PILATES = { family: 'Mind & body', lever: [null, 'reps', 'reps'] };
const PILATES_UP = { family: 'Mind & body', lever: [null, 'reps', 'variation'] }; // Pilates: harder moves (roll-up to teaser) at Level III
const CORE = { family: 'Mind & body', lever: [null, 'reps', 'reps'] };
const YIN = { family: 'Mind & body', lever: [null, 'holds', 'holds'], scale: 3, cap: 120, values: [1] };

// ---------------- Variety (Phase 16): every day is different ----------------
// A Variety config has day types and formats and no cycle: variety.js deals one (day type, format) pair per day, none
// twice. Each day type's main block is marked vary (it takes the day's format) and tagged with its family; some day
// types add a fixed second block from another family. A day type's own `formats` narrow the program's: strength works
// in sets, supersets, circuits, EMOMs and AMRAPs; conditioning in circuits, EMOMs, AMRAPs and Tabatas; neck work only
// in calm formats (never a Tabata).
const VARY = (title, slots, tag) => ({ ...S(title, slots, tag), vary: true });
const LIFT_F = ['straight', 'superset', 'circuit', 'emom', 'amrap'];
const SWEAT_F = ['circuit', 'emom', 'amrap', 'tabata'];
const SWEAT5_F = ['circuit', 'emom', 'amrap', 'tabata', 'straight'];
const COMBAT_F = ['emom', 'amrap', 'tabata']; // a circuit of boxing or kicking combinations runs too long
const CORE_F = ['straight', 'superset', 'circuit', 'emom', 'tabata'];
const SHORT_F = ['circuit', 'emom', 'amrap', 'tabata'];
const CALM_F = ['straight', 'superset', 'circuit'];
const VAR_LIFT = { family: 'Strength' };
const VAR_SWEAT = { family: 'Cardio & combat', lever: [null, 'reps', 'reps'] };
const VAR_CORE = { family: 'Mind & body', lever: [null, 'reps', 'reps'] };
const VT = {
  // strength
  push: ['Push', ['chestPress', 'shoulderPress', 'chestBw', 'triceps2'], VAR_LIFT, LIFT_F],
  pull: ['Pull', ['backRow', 'backBar', 'backRear', 'biceps2'], VAR_LIFT, LIFT_F],
  legs: ['Legs', ['squat2', 'lunge2', 'hinge2', 'calf'], VAR_LIFT, LIFT_F],
  glutes: ['Glutes & hips', ['hipGlute', 'adductor', 'hinge2', 'hipFlex'], VAR_LIFT, LIFT_F],
  chest: ['Chest', ['chestPress', 'chestBw', 'chestIso', 'triceps2'], VAR_LIFT, LIFT_F],
  back: ['Back', ['backRow', 'backBar', 'backRear', 'trapsPool'], VAR_LIFT, LIFT_F],
  shoulders: ['Shoulders', ['shoulderPress', 'shoulderRaise', 'shoulderHealth', 'trapsPool'], VAR_LIFT, LIFT_F],
  arms: ['Arms', ['biceps2', 'triceps2', 'biceps2', 'triceps2'], VAR_LIFT, LIFT_F],
  upper: ['Upper body', ['pushLoad2', 'row2', 'shoulders2', 'arms'], VAR_LIFT, LIFT_F],
  lower: ['Lower body', ['squat2', 'hinge2', 'lunge2', 'glute2'], VAR_LIFT, LIFT_F],
  full: ['Full body', ['total', 'squat2', 'row2', 'pushLoad2'], VAR_LIFT, LIFT_F],
  kb: ['Kettlebell', ['kbBallistic', 'kbLower2', 'kbUpper2', 'kbCore2'], VAR_LIFT, LIFT_F],
  calves: ['Calves & shins', ['calf', 'shin', 'calfPlyo', 'calf'], VAR_LIFT, LIFT_F],
  neck: ['Neck & traps', ['neck', 'traps2', 'trapsBw', 'neck'], VAR_LIFT, CALM_F],
  forearms: ['Forearms', ['gripCurl', 'gripHold', 'gripPull', 'gripCurl'], VAR_LIFT, LIFT_F],
  upperBack: ['Upper back', ['backRear', 'trapsPool', 'backBw', 'shoulderHealth'], VAR_LIFT, LIFT_F],
  singleLeg: ['Single leg', ['singleLeg', 'lunge2', 'calf', 'adductor'], VAR_LIFT, LIFT_F],
  posterior: ['Back of the body', ['hinge2', 'hipGlute', 'backRow', 'core'], VAR_LIFT, LIFT_F],
  // bodyweight strength
  pushBw: ['Push-ups', ['chestBw', 'pushBw2', 'armsBw', 'shoulderBw'], VAR_LIFT, LIFT_F],
  pullBw: ['Floor pulls', ['backBw', 'pullBw', 'trapsBw', 'backBw'], VAR_LIFT, LIFT_F],
  legsBw: ['Legs, no gear', ['legsBw2', 'runLegs', 'calfBw', 'adductorBw'], VAR_LIFT, LIFT_F],
  glutesBw: ['Glutes, no gear', ['hipGlute', 'adductorBw', 'legsBw2', 'hipFlex'], VAR_LIFT, LIFT_F],
  fullBw: ['Full body, no gear', ['legsBw', 'push', 'core', 'cardio'], VAR_LIFT, LIFT_F],
  shouldersBw: ['Shoulders, no gear', ['shoulderBw', 'pike_hold', 'prone_y_raise', 'pushBw2'], VAR_LIFT, LIFT_F],
  armsBw: ['Arms, no gear', ['armsBw', 'armsBw', 'chestBw', 'backBw'], VAR_LIFT, LIFT_F],
  // kettlebell
  kbCx: ['Complexes', ['kbCx', 'kbCxLower', 'kbCxUpper', 'kbCxCore'], VAR_LIFT, LIFT_F],
  kbLegs: ['Bell legs', ['kbLower2', 'kbCxLower', 'goblet_squat', 'kb_swing'], VAR_LIFT, LIFT_F],
  kbPress: ['Bell press', ['kbUpper2', 'kb_press', 'kb_floor_press', 'kb_halo'], VAR_LIFT, LIFT_F],
  kbPull: ['Bell pull', ['kb_row', 'kb_dead_stop_row', 'kb_high_pull', 'kbBallistic'], VAR_LIFT, LIFT_F],
  kbHips: ['Bell hips', ['sumo_pulse', 'kb_sumo_deadlift', 'kbBallistic', 'adductorBw'], VAR_LIFT, LIFT_F],
  kbCore: ['Bell core', ['kbCore2', 'kbCxCore', 'coreAnti', 'coreRot'], VAR_LIFT, LIFT_F],
  kbFull: ['Bell full body', ['kbCx', 'kbLower2', 'kbUpper2', 'kbBallistic'], VAR_LIFT, LIFT_F],
  kbGrip: ['Bell grip', ['kb_bottoms_up_hold', 'suitcase_march', 'kbCxUpper', 'kb_row'], VAR_LIFT, LIFT_F],
  kbSwing: ['Swings', ['kb_swing', 'kb_one_arm_swing', 'kbCxLower', 'kbCore2'], VAR_LIFT, LIFT_F],
  // conditioning and combat
  hiit: ['HIIT', ['hiit', 'hiit', 'cardio', 'hiitSec'], VAR_SWEAT, SWEAT_F],
  plyo: ['Jumps', ['plyoLow', 'plyoLat', 'plyoUp', 'plyoVert'], VAR_SWEAT, SWEAT_F],
  box: ['Boxing', ['bxBasic', 'bxPower', 'bxDefense'], VAR_SWEAT, COMBAT_F],
  kick: ['Kickboxing', ['kkKick', 'kkCombo', 'kkKnee'], VAR_SWEAT, COMBAT_F],
  run: ['Running drills', ['runDrill', 'runPlyo', 'runFast', 'runLegs'], VAR_SWEAT, SWEAT_F],
  court: ['Court moves', ['courtMove', 'courtPower', 'courtLegs', 'courtMove'], VAR_SWEAT, SWEAT_F],
  kbCardio: ['Bell cardio', ['kbBallistic', 'cardio', 'kb_swing', 'hiit'], VAR_SWEAT, SWEAT_F],
  sprint: ['Sprints', ['runFast', 'hiitSec', 'runDrill', 'courtMove'], VAR_SWEAT, SWEAT_F],
  power: ['Power', ['plyoUp', 'courtPower', 'runPlyo', 'hiit'], VAR_SWEAT, SWEAT_F],
  skips: ['Skips & hops', ['runDrill', 'calfPlyo', 'hiitSec', 'plyoLow'], VAR_SWEAT, SWEAT_F],
  // conditioning with straight sets too (Sweat Shuffle)
  cond: ['Conditioning', ['cardio', 'total', 'hiit', 'core'], VAR_SWEAT, SWEAT5_F],
  bwCond: ['Bodyweight burn', ['legsBw', 'push', 'cardio', 'core'], VAR_SWEAT, SWEAT5_F],
  footwork: ['Footwork', ['bxMove', 'runFast', 'courtMove', 'hiitSec'], VAR_SWEAT, SWEAT5_F],
  jumps: ['Jump circuit', ['plyoVert', 'plyoLat', 'hiit', 'plyoLow'], VAR_SWEAT, SWEAT5_F],
  // combat (Fighter Variety)
  jabs: ['Jabs & crosses', ['bxBasic', 'bxBasic', 'bxMove', 'bxDefense'], VAR_SWEAT, COMBAT_F],
  punches: ['Power punches', ['bxPower', 'bxPower', 'bxDefense', 'bxMove'], VAR_SWEAT, COMBAT_F],
  kicks: ['Kicks', ['kkKick', 'kkKick', 'kkCombo', 'kkKnee'], VAR_SWEAT, COMBAT_F],
  combos: ['Combinations', ['kkCombo', 'bxPower', 'kkKnee', 'bxBasic'], VAR_SWEAT, COMBAT_F],
  clinch: ['Clinch', ['kkKnee', 'bxDefense', 'core'], VAR_SWEAT, COMBAT_F],
  defence: ['Defence', ['bxDefense', 'bxMove', 'bxDefense', 'bxBasic'], VAR_SWEAT, COMBAT_F],
  bodyShots: ['Body shots', ['bxPower', 'kkCombo', 'coreRot', 'bxBasic'], VAR_SWEAT, COMBAT_F],
  kickCore: ['Kicks & core', ['kkKick', 'coreHollow', 'kkSpin', 'coreAnti'], VAR_SWEAT, COMBAT_F],
  fightPush: ['Fighter push', ['chestBw', 'shoulderPress', 'triceps2', 'core'], VAR_LIFT, LIFT_F],
  fightPull: ['Fighter pull', ['backBar', 'backRow', 'gripHold', 'core'], VAR_LIFT, LIFT_F],
  fightLegs: ['Fighter legs', ['squat2', 'plyoLat', 'lunge2', 'calfPlyo'], VAR_LIFT, LIFT_F],
  fightCore: ['Fighter core', ['coreRot', 'coreAnti', 'coreHollow', 'core2'], VAR_LIFT, LIFT_F],
  // mind & body
  core: ['Core', ['coreAnti', 'coreRot', 'coreHollow', 'core2'], VAR_CORE, CORE_F],
  balance: ['Balance', ['blStatic', 'blDynamic', 'blStrength', 'blPower'], VAR_CORE, CORE_F],
  mobility: ['Mobility', ['mbHip', 'mbSpine', 'mbShoulder', 'mbPosture'], VAR_CORE, CORE_F],
  pilates: ['Pilates', ['plAbs', 'plRoll', 'plBack', 'plGlute'], VAR_CORE, CORE_F],
  yogaStrength: ['Yoga strength', ['ygCore', 'ygBalance', 'ygStand', 'ygCore'], VAR_CORE, CORE_F],
  backCare: ['Back care', ['backStrength', 'backMove', 'backStrength', 'backMove'], VAR_CORE, CORE_F],
  gentle: ['Gentle strength', ['gentleStrength', 'gentleBalance', 'gentleStrength', 'gentleCardio'], VAR_CORE, CORE_F],
  hips: ['Hips', ['mbHip', 'ygHips', 'hipFlex', 'adductorBw'], VAR_CORE, CORE_F],
  posture: ['Posture', ['mbPosture', 'trapsBw', 'chin_tucks', 'mbShoulder'], VAR_CORE, CALM_F],
  pilatesSide: ['Pilates, side & glutes', ['plSide', 'plGlute', 'plAbs', 'plBack'], VAR_CORE, CORE_F],
  hollow: ['Hollow & brace', ['coreHollow', 'coreAnti', 'coreRot', 'plAbs'], VAR_CORE, CORE_F],
  weighted: ['Weighted core', ['absW', 'coreAnti', 'coreRot', 'absW'], VAR_CORE, CORE_F],
  sideCore: ['Side core', ['coreRot', 'side_plank', 'coreAnti', 'coreRot'], VAR_CORE, CORE_F],
  rolls: ['Rolls & curls', ['plRoll', 'plAbs', 'coreHollow', 'plRoll'], VAR_CORE, CORE_F],
  backCore: ['Back & core', ['backStrength', 'coreAnti', 'plBack', 'bird_dog'], VAR_CORE, CORE_F],
  balanceCore: ['Balance & core', ['blStrength', 'coreAnti', 'blDynamic', 'coreRot'], VAR_CORE, CORE_F],
  bellCore: ['Kettlebell core', ['kbCore2', 'coreAnti', 'kbCxCore', 'coreRot'], VAR_CORE, CORE_F],
};
// fixed second blocks: a short burst of conditioning, a short stretch (no abs after it), a short lift, a short core circuit
const AFTER = {
  sweat: T('Finisher', ['hiit', 'cardio'], { ...VAR_SWEAT, values: [1] }),
  sweatBw: T('Finisher', ['hiit', 'cardio'], { ...VAR_SWEAT, values: [1] }),
  flow: F('Stretch', ['ygRest', 'ygHips', 'ygRest?'], { family: 'Mind & body', lever: [null, 'holds', 'holds'] }),
  lift: S('Strength', ['squat2', 'pushLoad2', 'row2?'], VAR_LIFT),
  liftBw: S('Strength', ['legsBw2', 'pushBw2', 'backBw?'], VAR_LIFT),
  liftKb: S('Strength', ['kbLower2', 'kbUpper2', 'kb_row?'], VAR_LIFT),
  core: C('Core', ['coreAnti', 'coreRot'], { ...VAR_CORE, values: [2] }),
};
// day types for a Variety config: each key's main block, plus the second block named for it (if any); `only` replaces
// every day type's formats (Short Variety: timed formats only)
function vtypes(keys, second = {}, only) {
  return Object.fromEntries(keys.map((k) => {
    const [label, slots, tag, own] = VT[k], after = second[k] && AFTER[second[k]];
    // a day that ends in a stretch never takes an AMRAP: fifteen minutes at most, too short with only a stretch after it
    const formats = (only || own).filter((f) => !(second[k] === 'flow' && f === 'amrap'));
    return [k, { label, short: label, formats, ...(second[k] === 'flow' ? { absSlots: [] } : {}), blocks: [VARY(label, slots, tag), ...(after ? [after] : [])] }];
  }));
}
const every = (keys, what) => Object.fromEntries(keys.map((k) => [k, what]));

const CONFIGS = [
  // ---------------- STRENGTH & STRETCH (six programs, 28–40 min) ----------------
  {
    id: 'lift-and-lengthen', added: 6, catalogue: 5, name: 'Lift & Lengthen', subject: 'Strength & stretch', minutes: [32, 38], levers: [null, 'weight', 'reps'],
    gear: 'A sturdy chair or couch for step-ups and hip thrusts.',
    split: 'Upper / lower / full body, each with a stretch', blurb: 'Straight-set or superset strength, then a long flexibility flow for the muscles you just trained.',
    about: 'Strength first, then a flexibility flow for the muscles you just worked. Upper days end on chest and shoulders, lower days on hamstrings, hips and quads, and the full-body day on a stretch from feet to neck. The lifting is straight sets and supersets with dumbbells, a kettlebell and the bar. Level II moves you one weight up and Level III adds reps, while every hold in the flow gets a little longer. Good if you lift and never stretch.',
    names: ['Elastic', 'Spring Back', 'Slingshot', 'Bungee', 'Cable Car', 'Suspension', 'Drawbridge', 'Crane Arm', 'Telescope', 'Extension Ladder', 'Hoist', 'Pulley Lift', 'Winch', 'Lever Arm', 'Long Reach', 'Full Span', 'Stretch Goal', 'Tape Measure', 'Slide Rule', 'Horizon'],
    cycle: ['upper', 'lower', 'full'],
    dayTypes: {
      upper: { label: 'Upper & shoulders', short: 'Upper', absSlots: [], blocks: [
        S('Upper strength', ['pushLoad2', 'row2', 'shoulders2', 'row2?'], LIFT),
        F('Chest & shoulders flow', ['thread_the_needle', 'cow_face_arms', 'fxUpper', 'fxUpper', 'fxUpper?'], FLOW_SCALED)] },
      lower: { label: 'Lower & hips', short: 'Lower', absSlots: [], blocks: [
        S('Lower strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        F('Hips & hamstrings flow', ['fxHam', 'fxHips', 'fxQuad', 'fxHam', 'fxHips?'], FLOW)] },
      full: { label: 'Full body & spine', short: 'Full', absSlots: [], blocks: [
        SS('Full-body supersets', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        F('Full stretch', ['fxHam', 'fxUpper', 'fxHips', 'fxSpine', 'fxSpine?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'iron-yoga', added: 6, catalogue: 5, name: 'Iron Yoga', subject: 'Strength & stretch', minutes: [33, 38], equip: 'all', levers: [null, 'weight', 'reps'],
    gear: 'A sturdy chair or couch for step-ups and hip thrusts.',
    split: 'Lift & flow / salutations, lift & abs / lower & hips', blurb: 'Heavy-ish lifting and a yoga flow in one session: iron first, salutations and standing poses after, or the other way round.',
    about: 'Lifting and yoga in one session, so strength and range of motion improve together. Upper and lower days lift first and close with a yoga flow, standing poses on the upper day and hips and backbends on the lower. The middle day opens with sun salutations and warriors, then lifts, then finishes with abs. Level II moves you one weight up and Level III adds reps. Every yoga hold gets longer at the higher levels, and one Start runs each flow.',
    names: ['Anvil', 'Forge & Flow', 'Cast Iron', 'Wrought', 'Temper', 'Hammer & Breath', 'Steel Bend', 'Ironwood', 'Bellows', 'Crucible Calm', 'Blacksmith', 'Alloy', 'Ingot', 'Wrought Iron Pose', 'Heavy Sun', 'Iron Lotus', 'Cold Iron', 'Bar & Mat', 'Warm Metal', 'Quench'],
    cycle: ['upper', 'salute', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & standing flow', short: 'Upper', absSlots: [], blocks: [
        S('Upper strength', ['pushLoad2', 'pullBar2', 'shoulders2', 'row2?'], LIFT),
        F('Yoga flow', ['sun_salutation', 'warrior_two', 'ygStand', 'ygBalance', 'ygRest?'], FLOW)] },
      salute: { label: 'Salutations, lift & abs', short: 'Salute', absSlots: ABS, blocks: [
        F('Salutations & warriors', ['sun_salutation', 'warrior_one', 'warrior_two', 'ygStand?'], FLOW),
        SS('Full-body supersets', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT)] },
      lower: { label: 'Lower & hips', short: 'Lower', absSlots: [], blocks: [
        S('Lower strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        F('Hips & backbends', ['ygHips', 'ygHips', 'ygBack', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'strong-hips', added: 6, catalogue: 5, name: 'Strong Hips', subject: 'Strength & stretch', minutes: [32, 38], levers: [null, 'weight', 'reps'],
    gear: 'A sturdy chair or couch for step-ups and hip thrusts.',
    split: 'Squat / hinge / single-leg, each with hip mobility', blurb: 'Leg strength followed by hip mobility, so the hips can use the strength you build.',
    about: 'Leg strength and hip mobility in the same session. Squat, hinge and single-leg days each end with a flow of hip drills and stretches, like 90/90 switches, hip circles, pigeon and deep squat holds. The lifting is straight sets with dumbbells and a kettlebell. Level II moves you one weight up and Level III adds reps, and the hip flow gets a little longer each level. Good for lifters whose hips feel tight, and for desk days that left them stiff.',
    names: ['Hinge Point', 'Ball & Socket', 'Deep Seat', 'Hip Crease', 'Pelvic Floor Plan', 'Open Gate', 'Saddle Up', 'Crossbeam', 'Rocker', 'Swing Arc', 'Turnout', 'Frog Stance', 'Wide Base', 'Stride', 'Long Step', 'Low Rider', 'Sit Deep', 'Loose Hinge', 'Free Hips', 'Full Range'],
    cycle: ['squat', 'hinge', 'single'],
    dayTypes: {
      squat: { label: 'Squat & hip openers', short: 'Squat', absSlots: [], blocks: [
        S('Squat strength', ['squat2', 'lunge2', 'glute2', 'squat2?'], LIFT),
        F('Hip mobility', ['ninety_ninety', 'hip_cars', 'deep_squat_hold', 'garland_pose', 'mbHip?'], FLOW)] },
      hinge: { label: 'Hinge & hamstrings', short: 'Hinge', absSlots: [], blocks: [
        S('Hinge strength', ['hinge2', 'glute2', 'kbSwing', 'hinge2?'], LIFT),
        F('Hips & hamstrings', ['fxHips', 'fxHam', 'ninety_ninety', 'fxHam?', 'fxHips?'], FLOW)] },
      single: { label: 'Single-leg & stability', short: 'Single', absSlots: [], blocks: [
        S('Single-leg strength', ['singleLeg', 'lunge2', 'singleLeg', 'glute2?'], LIFT),
        F('Hip mobility', ['hip_airplane', 'hip_cars', 'fxHips', 'ygHips', 'mbHip?'], FLOW)] },
    },
  },
  {
    id: 'upper-and-open', added: 6, catalogue: 5, name: 'Upper & Open', subject: 'Strength & stretch', minutes: [30, 36], levers: [null, 'weight', 'reps'],
    split: 'Push & open / pull & open / shoulders & arms', blurb: 'Upper-body lifting, then shoulder and chest stretches that keep the range you are training for.',
    about: 'Upper-body strength followed by shoulder and chest flexibility. Push days end by opening the chest, pull days by releasing the back and shoulders, and the arms day with a flow for the shoulder girdle. The lifting is straight sets with dumbbells, a kettlebell and the pull-up bar. Level II moves you one weight up and Level III adds reps, and each stretch is held longer. Good for anyone who presses and pulls a lot and feels their shoulders round forward.',
    names: ['Open Arms', 'Wide Reach', 'Broad Shoulders', 'Lat Spread', 'Wingspan', 'Eagle Eye', 'Unfurl', 'Full Extension', 'Overhead', 'Reach Up', 'Collarbone', 'Big Yawn', 'Scapular', 'Deltoid Drift', 'Arm Span', 'Yoke Off', 'Shrug', 'Chest Out', 'Open Book Day', 'Rib Cage Room'],
    cycle: ['push', 'pull', 'arms'],
    dayTypes: {
      push: { label: 'Push & open', short: 'Push', absSlots: [], blocks: [
        S('Push strength', ['pushLoad2', 'shoulders2', 'chest2', 'triceps?'], LIFT),
        F('Chest & shoulder stretch', ['chest_opener', 'thread_the_needle', 'fxUpper', 'fxUpper', 'fxUpper?'], FLOW_SCALED)] },
      pull: { label: 'Pull & open', short: 'Pull', absSlots: [], blocks: [
        S('Pull strength', ['pullBar2', 'row2', 'row2', 'biceps?'], LIFT),
        F('Back & shoulder stretch', ['puppy_pose', 'thread_the_needle', 'fxUpper', 'fxSpine', 'fxUpper?'], FLOW_SCALED)] },
      arms: { label: 'Shoulders, arms & open', short: 'Arms', absSlots: [], blocks: [
        S('Shoulders & arms', ['shoulders2', 'biceps', 'triceps', 'arms?'], LIFT),
        F('Shoulder flow', ['cross_body_shoulder', 'cow_face_arms', 'reverse_prayer', 'fxUpper', 'fxUpper?'], FLOW_SCALED)] },
    },
  },
  {
    // the kettlebell-flow id and name already belong to a Kettlebell only program, so this one is Kettlebell & Yoga
    id: 'kettlebell-and-yoga', added: 6, catalogue: 5, name: 'Kettlebell & Yoga', subject: 'Strength & stretch', minutes: [30, 36], equip: 'kb', gear: 'One kettlebell and a mat.', levers: [null, 'reps', 'reps'],
    split: 'Bell & standing flow / salutations, bell & abs / bell & hips', blurb: 'One kettlebell for strength and swings, one yoga flow for range, in the same half hour.',
    about: 'One kettlebell and a mat, strength and yoga together. Two days lift first and close with a flow, standing poses on one and hips and backbends on the other. The middle day opens with sun salutations and warriors, then swings, presses and squats, and ends with abs. Level II and III add reps, since one bell stays one weight, and the yoga holds get longer too. Good when you want to train with almost no gear and still finish loose.',
    names: ['Bell & Breath', 'Ring & Sun', 'Swing & Sway', 'Bell Pose', 'Kettle Yoga', 'Handle & Mat', 'Cast Bell', 'Sun Bell', 'Round Iron', 'One Bell Calm', 'Clean & Cobra', 'Press & Pose', 'Goblet Lotus', 'Bell Salute', 'Swing Low', 'Bell Tree', 'Gong', 'Bell Bridge', 'Steady Bell', 'Bell Down Dog'],
    cycle: ['stand', 'salute', 'hips'],
    dayTypes: {
      stand: { label: 'Bell & standing flow', short: 'Standing', absSlots: [], blocks: [
        S('Bell strength', ['kbLower2', 'kbUpper2', 'kbLower2', 'kbUpper2?'], LIFT),
        F('Standing flow', ['sun_salutation', 'warrior_two', 'ygStand', 'ygBalance', 'ygStand?'], FLOW)] },
      salute: { label: 'Salutations, bell & abs', short: 'Salute', absSlots: ABS, blocks: [
        F('Salutations & warriors', ['sun_salutation', 'warrior_one', 'warrior_two', 'ygStand?'], FLOW),
        S('Bell strength', ['kbBallistic', 'kbLower2', 'kbUpper2', 'kbCore2'], LIFT)] },
      hips: { label: 'Bell & hips', short: 'Hips', absSlots: [], blocks: [
        S('Bell strength', ['kbLower2', 'kbBallistic', 'kbCore2', 'kbLower2?'], LIFT),
        F('Hips & backbends', ['ygHips', 'ygHips', 'ygBack', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'posture-strength', added: 6, catalogue: 5, name: 'Posture Strength', subject: 'Strength & stretch', minutes: [30, 36], levers: [null, 'weight', 'reps'],
    gear: 'A sturdy chair or couch for step-ups and hip thrusts.',
    split: 'Pull & posture / back & spine / reset, pull & abs', blurb: 'Pulling strength for the back, with posture drills and mobility flows that undo a day at a desk.',
    about: 'Pulling strength for the muscles that hold you upright, with mobility and posture work alongside. Pull-ups, rows and hinges build the back, and wall slides, prone Y-T-W, chin tucks and spine rotations keep the shoulders and upper back moving well. One day opens with a posture reset, then pulls, and ends with abs. Level II moves you one weight up and Level III adds reps, while the drills add reps too. Suits desk workers who want to stand taller and lift heavier.',
    names: ['Plumb Line', 'Tall Spine', 'Shoulders Back', 'Chin Tuck', 'Upright', 'Coat Rack', 'Lat Pull', 'Back Brace', 'Neutral Neck', 'Rack & Roll', 'Lifted Chest', 'Ribs Down', 'Standing Tall', 'Stack Up', 'Straight Line', 'Spine Line', 'Backbone', 'Rear Delt Day', 'Head High', 'Proud Posture'],
    cycle: ['pull', 'back', 'reset'],
    dayTypes: {
      pull: { label: 'Pull & posture', short: 'Pull', absSlots: [], blocks: [
        S('Pulls', ['pullBar2', 'row2', 'row2', 'pullBw?'], LIFT),
        F('Posture flow', ['wall_slides', 'prone_ytw', 'chin_tucks', 'mbPosture', 'mbPosture?'], FLOW)] },
      back: { label: 'Back & spine', short: 'Back', absSlots: [], blocks: [
        S('Back & hinge', ['row2', 'hinge2', 'row2', 'pullBw?'], LIFT),
        F('Spine & shoulders', ['open_book', 'quadruped_rotation', 'mbSpine', 'mbShoulder', 'mbSpine?'], FLOW)] },
      reset: { label: 'Reset, pull & abs', short: 'Reset', absSlots: ABS, blocks: [
        F('Posture reset', ['chin_tucks', 'wall_slides', 'prone_ytw', 'mbPosture', 'mbPosture?'], FLOW),
        S('Pulls', ['pullBar2', 'row2', 'row2', 'pullBw?'], LIFT)] },
    },
  },
  // ---------------- FIGHTER (six programs, 30–38 min): bouts + strength or conditioning + a short mobility flow ----------------
  {
    id: 'fight-ready', added: 6, catalogue: 5, name: 'Fight Ready', subject: 'Fighter', minutes: [30, 36], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Bouts & mobility / bouts, strength & abs / bouts & conditioning', blurb: 'Boxing bouts first, then mobility, bodyweight strength or a conditioning circuit, with no equipment.',
    about: 'Boxing in 3-minute bouts, then the rest of a fighter\'s work. One day closes with a mobility flow for hips and shoulders, one with bodyweight strength and abs, and one with a conditioning circuit and a short flow. The voice calls each combination as the bout starts. Levels II and III bring longer combinations in the bouts, more reps in the strength and conditioning, and longer holds in the flows. No equipment, just room to move.',
    names: ['Camp Opens', 'Roadwork', 'Gym Bag', 'Hand Wraps', 'Focus Mitts', 'Shadow Ring', 'Bell to Bell', 'Corner Talk', 'Sparring Prep', 'Fight Week', 'Cutting Weight', 'Weigh-In Day', 'Ring Walk', 'Tale of the Tape', 'Referee\'s Orders', 'Touch Gloves', 'Final Bell', 'Post-Fight', 'Rematch', 'Fight Night'],
    cycle: ['flow', 'lift', 'burn'],
    dayTypes: {
      flow: { label: 'Bouts & mobility', short: 'Flow', absSlots: [], blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxBasic', 'bxPower?'], BOUTS),
        F('Hips & shoulders flow', ['mbHip', 'mbShoulder', 'mbHip', 'mbShoulder', 'mbSpine?'], FLOW)] },
      lift: { label: 'Bouts, strength & abs', short: 'Lift', absSlots: ABS, blocks: [
        B('Bouts', ['bxBasic', 'bxMove', 'bxPower', 'bxDefense?'], BOUTS),
        S('Bodyweight strength', ['pushBw2', 'legsBw2', 'pullBw', 'pushBw2?'], LIFT)] },
      burn: { label: 'Bouts & conditioning', short: 'Burn', absSlots: [], blocks: [
        B('Bouts', ['bxPower', 'bxBasic', 'bxDefense', 'bxPower?'], BOUTS),
        C('Conditioning', ['cardio', 'legsBw2', 'pushBw2', 'cardio'], COND),
        F('Cool-down flow', ['mbHip', 'mbSpine', 'mbShoulder', 'mbSpine?'], FLOW)] },
    },
  },
  {
    id: 'strike-and-lift', added: 6, catalogue: 5, name: 'Strike & Lift', subject: 'Fighter', minutes: [33, 38], equip: 'all', levers: [null, 'weight', 'reps'],
    gear: 'A pair of dumbbells or a kettlebell.',
    split: 'Punch & press / kick & squat / bouts & reset', blurb: 'Boxing or kickboxing bouts, then dumbbell and kettlebell strength for the muscles you just used.',
    about: 'Striking first, then lifting to back it up. Punch days pair boxing bouts with presses and rows, kick days pair kickboxing bouts with squats, hinges and lunges, and the third day mixes both styles and ends with a mobility flow. Dumbbells or a kettlebell are all you need. Level II moves you one weight up and Level III adds reps, the bouts bring longer combinations and every hold in the flow gets longer. Strength days end with abs.',
    names: ['Jab & Press', 'Teep & Squat', 'Reset Day', 'Cross & Row', 'Roundhouse & Lunge', 'Loose Hands', 'Hook & Shoulder', 'Knee & Hinge', 'Open Guard', 'Uppercut & Curl', 'Switch & Step-Up', 'Cool Corner', 'Body Shot & Bridge', 'Low Kick & Deadlift', 'Long Guard', 'Elbow & Press', 'Clinch & Carry', 'Slip & Swing', 'Gloves Off', 'Ring Rust'],
    cycle: ['punch', 'kick', 'reset'],
    dayTypes: {
      punch: { label: 'Punch & press', short: 'Punch', absSlots: ABS, blocks: [
        B('Boxing bouts', ['bxBasic', 'bxPower', 'bxPower', 'bxDefense?'], BOUTS),
        SS('Push & pull', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT)] },
      kick: { label: 'Kick & squat', short: 'Kick', absSlots: ABS, blocks: [
        B('Kickboxing bouts', ['kkKick', 'kkCombo', 'kkKnee', 'kkCombo?'], BOUTS),
        S('Legs', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT)] },
      reset: { label: 'Bouts & reset', short: 'Reset', absSlots: [], blocks: [
        B('Bouts', ['bxBasic', 'kkKick', 'bxPower', 'kkCombo', 'bxDefense?'], BOUTS),
        F('Hips & shoulders flow', ['mbHip', 'mbShoulder', 'ygHips', 'mbSpine', 'fxHips?'], FLOW)] },
    },
  },
  {
    id: 'southpaw-strength', added: 6, catalogue: 5, name: 'Southpaw Strength', subject: 'Fighter', minutes: [31, 37], equip: 'kb', levers: [null, 'reps', 'reps'], gear: 'One kettlebell.',
    split: 'Switch bouts & press / switch bouts & hinge / switch bouts & mobility', blurb: 'Boxing bouts that switch stance each round, then kettlebell strength that trains both sides.',
    about: 'Boxing that switches stance every bout, then one kettlebell to make both sides strong. Odd bouts are orthodox and even bouts southpaw, the voice calls the stance with each combination, and the kettlebell work is done on both sides too. One day presses, one hinges and swings, and the third finishes with a mobility flow for hips and shoulders. Levels II and III bring longer combinations, more reps and longer holds. Good for evening out a weaker side.',
    names: ['Lead Hand', 'Rear Hand', 'Mirror Image', 'Switch Hitter', 'Wrong Foot', 'Other Side', 'Left Hook Day', 'Both Sides', 'Lefty', 'Open Stance', 'Cross Step', 'Flip It', 'Weak Side', 'Even Odds', 'Double Duty', 'Righty Lefty', 'Square Up', 'Turn Over', 'Stance Change', 'Ambidextrous'],
    cycle: ['press', 'hinge', 'mobility'],
    dayTypes: {
      press: { label: 'Switch bouts & press', short: 'Press', absSlots: ABS, blocks: [
        B('Bouts · switch stance each bout', ['bxBasic', 'bxBasic', 'bxPower', 'bxDefense?'], SWITCH),
        S('Bell upper body', ['kbUpper2', 'kbUpper2', 'kbCore2?', 'kbUpper2?'], LIFT)] },
      hinge: { label: 'Switch bouts & hinge', short: 'Hinge', absSlots: ABS, blocks: [
        B('Bouts · switch stance each bout', ['bxPower', 'bxBasic', 'bxMove', 'bxPower?'], SWITCH),
        S('Bell lower body', ['kbLower2', 'kbBallistic', 'kbLower2?', 'kbBallistic?'], LIFT)] },
      mobility: { label: 'Switch bouts & mobility', short: 'Mobility', absSlots: [], blocks: [
        B('Bouts · switch stance each bout', ['bxBasic', 'bxPower', 'bxDefense', 'bxBasic', 'bxMove?'], SWITCH),
        F('Hips & shoulders flow', ['mbShoulder', 'mbHip', 'mbSpine', 'mbHip', 'mbShoulder', 'fxHips?'], FLOW)] },
    },
  },
  {
    id: 'muay-thai-conditioning', added: 6, catalogue: 5, name: 'Muay Thai Conditioning', subject: 'Fighter', minutes: [32, 38], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Knees & conditioning / kicks, Tabata & abs / clinch & flow', blurb: 'Muay Thai bouts of kicks and knees, then conditioning that builds the engine to keep throwing them.',
    about: 'Kicks, knees and the engine to keep throwing them. Each session opens with 3-minute Muay Thai bouts of teeps, roundhouses, knees and clinch work, then a conditioning circuit, a Tabata or an AMRAP. Two days end with a hip flow, and the kicks day adds leg strength, a Tabata and abs. Levels II and III bring harder kicks and combinations in the bouts, more reps in the conditioning and longer holds in the flows. No equipment, but room to kick.',
    names: ['Pad Round', 'Teep Line', 'Rope Skip', 'Sandbag', 'Shin Check', 'Elbow Drill', 'Clinch Rounds', 'Knee Tap', 'Thai Pads', 'Low Kick', 'Body Kick', 'Sweep', 'Muay Tay', 'Wai Kru', 'Ram Muay', 'Dutch Kick', 'Plum Grip', 'Ring Craft', 'Fifth Round', 'Stadium Night'],
    cycle: ['knees', 'kicks', 'clinch'],
    dayTypes: {
      knees: { label: 'Knees & conditioning', short: 'Knees', absSlots: [], blocks: [
        B('Kicks & knees bouts', ['teep', 'kkKnee', 'clinch_knees', 'kkKick?'], BOUTS),
        C('Conditioning', ['cardio', 'legsBw2', 'cardio', 'pushBw2'], COND),
        F('Hips flow', ['mbHip', 'ygHips', 'mbHip', 'fxHips?'], FLOW)] },
      kicks: { label: 'Kicks, legs & Tabata', short: 'Kicks', absSlots: ABS, blocks: [
        B('Kick bouts', ['kkKick', 'kkCombo', 'kkKick', 'kkCombo?'], BOUTS),
        S('Leg strength', ['legsBw2', 'singleLeg', 'legsBw2?'], LIFT),
        T('Tabata', ['cardio', 'cardio', 'cardio', 'cardio'], { ...COND, values: [1, 2] })] },
      clinch: { label: 'Clinch, AMRAP & flow', short: 'Clinch', absSlots: [], blocks: [
        B('Clinch & combo bouts', ['clinch_knees', 'kkCombo', 'bxBasic', 'kkKnee?'], BOUTS),
        A('AMRAP', ['pushBw2', 'legsBw2', 'cardio'], COND),
        F('Hips & spine flow', ['mbHip', 'mbSpine', 'ygHips', 'mbSpine?'], FLOW)] },
    },
  },
  {
    id: 'boxers-body', added: 6, catalogue: 5, name: 'Boxer\'s Body', subject: 'Fighter', minutes: [32, 36], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Upper & shoulders flow / lower & hips flow / full-body circuit & abs', blurb: 'Boxing bouts followed by bodyweight strength, for the shoulders, legs and back a boxer stands on.',
    about: 'Boxing bouts, then bodyweight strength for a boxer\'s body. Push-ups and rows build the shoulders and back, and single-leg work builds the legs. The upper day ends with a shoulder flow, the lower day with a hip flow, and the third day is a full-body circuit with abs. Levels II and III bring longer combinations in the bouts, more reps in the strength and longer holds in the flows. No equipment.',
    names: ['Heavy Bag', 'Speed Bag', 'Double End', 'Jump Rope', 'Neck Roll', 'Shoulder Fire', 'Leg Drive', 'Pivot Foot', 'Six Rounds', 'Body Work', 'Lats & Lungs', 'Iron Chin', 'Stance & Spine', 'Push Away', 'Draw the Bow', 'Fast Twitch', 'Light on Feet', 'Ring Legs', 'Trunk Turn', 'Fit to Fight'],
    cycle: ['upper', 'lower', 'full'],
    dayTypes: {
      upper: { label: 'Upper & shoulder flow', short: 'Upper', absSlots: [], blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxBasic', 'bxDefense?'], BOUTS),
        S('Upper strength', ['pushBw2', 'pullBw', 'pushBw2', 'pullBw?'], LIFT),
        F('Shoulder flow', ['mbShoulder', 'fxUpper', 'mbShoulder', 'fxUpper?'], FLOW)] },
      lower: { label: 'Lower & hip flow', short: 'Lower', absSlots: [], blocks: [
        B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense?'], BOUTS),
        S('Lower strength', ['legsBw2', 'singleLeg', 'legsBw2', 'singleLeg?'], LIFT),
        F('Hip flow', ['mbHip', 'fxHips', 'mbHip', 'fxHam?'], FLOW)] },
      full: { label: 'Full-body circuit & abs', short: 'Full', absSlots: ABS, blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxMove?'], BOUTS),
        C('Body-weight circuit', ['pushBw2', 'legsBw2', 'pullBw', 'singleLeg'], LIFT)] },
    },
  },
  {
    id: 'knockout-circuit', added: 6, catalogue: 5, name: 'Knockout Circuit', subject: 'Fighter', minutes: [30, 36], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Bouts, circuit & flow / bouts, EMOM & flow / bouts, Tabata, strength & abs', blurb: 'Short boxing bouts followed by a hard round of conditioning: a circuit, an EMOM or a Tabata.',
    about: 'Fewer bouts and more sweat. Three boxing bouts open each day, then one hard block of conditioning: a circuit, an EMOM or a Tabata. The circuit and EMOM days end with a short flow, and the Tabata day adds bodyweight strength and abs. Everything is bodyweight and about half an hour. Levels II and III bring longer combinations in the bouts, more reps in the conditioning and longer holds in the flow. For fighters short on time and not short on grit.',
    names: ['Round One', 'Round Two', 'Body Shots', 'Ropes', 'Cut Man', 'Knockdown', 'On the Ropes', 'Clinch Break', 'Late Rounds', 'Championship Rounds', 'Punch Drunk', 'Counter Punch', 'Rope-a-Dope', 'Glass Jaw', 'Swarmer', 'Slugger', 'Bell Rings', 'Throw Down', 'Lights Out', 'Ten Count'],
    cycle: ['circuit', 'emom', 'tabata'],
    dayTypes: {
      circuit: { label: 'Bouts, circuit & flow', short: 'Circuit', absSlots: [], blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxDefense'], BOUTS),
        C('Conditioning circuit', ['cardio', 'pushBw2', 'legsBw2', 'core2'], COND),
        F('Cool-down flow', ['mbSpine', 'mbHip', 'mbShoulder', 'mbHip?'], FLOW)] },
      emom: { label: 'Bouts, EMOM & flow', short: 'EMOM', absSlots: [], blocks: [
        B('Bouts', ['bxPower', 'bxBasic', 'bxMove'], BOUTS),
        E('EMOM', ['pushBw2', 'legsBw2', 'cardio', 'core2'], COND),
        F('Cool-down flow', ['mbHip', 'mbShoulder', 'mbSpine', 'mbHip?'], FLOW)] },
      tabata: { label: 'Bouts, Tabata & strength', short: 'Tabata', absSlots: ABS, blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxDefense'], BOUTS),
        T('Tabata', ['cardio', 'pushBw2', 'cardio', 'legsBw2'], { ...COND, values: [1, 2] }),
        S('Strength', ['pushBw2', 'pullBw', 'legsBw2?'], LIFT)] },
    },
  },

  // ---------------- ATHLETE (six programs, 30–40 min): jump, lift, stick. Plyometrics lead, on long rests ----------------
  {
    id: 'jump-lift-stick', added: 6, catalogue: 5, name: 'Jump Lift Stick', subject: 'Athlete', minutes: [34, 38], equip: 'all', levers: [null, 'weight', 'reps'], rests: PLYO_RESTS,
    gear: 'A pair of dumbbells or a kettlebell, and a sturdy chair or couch for the balance work.',
    split: 'Legs / upper / full body: jump, lift, stick', blurb: 'The athlete\'s order: jumps while you are fresh, then strength, then balance drills that teach the landing.',
    about: 'Jump, lift, stick, in that order. Jumps come first while you are fresh, with long rests so each rep stays sharp. Strength follows with dumbbells and a kettlebell, then a balance circuit of hops, reaches and single-leg holds teaches you to land and stay landed. Three days rotate legs, upper body and full body, and the upper day ends with abs. Level II moves you one weight up and Level III adds reps, jumps bring more reps then harder variations, and balance adds reps.',
    names: ['Take Off', 'Touch Down', 'Spring Loaded', 'Loaded Jump', 'Stick It', 'Clean Landing', 'Height Test', 'Reach Up', 'Box Clear', 'Lift Off', 'Hang Time', 'Stomp', 'Soft Knees', 'Plant', 'Freeze Frame', 'Hold Still', 'Second Effort', 'Peak Week', 'Combine Day', 'Personal Best'],
    cycle: ['legs', 'upper', 'full'],
    dayTypes: {
      legs: { label: 'Legs: jump, lift, stick', short: 'Legs', absSlots: [], blocks: [
        S('Jumps', ['plyoLow', 'plyoLow', 'plyoVert?'], PLYO),
        S('Lower strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        C('Stick the landing', ['blPower', 'blStatic', 'blDynamic', 'blStatic?'], BAL)] },
      upper: { label: 'Upper: power, lift, stick', short: 'Upper', absSlots: ABS, blocks: [
        S('Upper power', ['plyoUp', 'plyoUp'], PLYO),
        SS('Upper strength', ['pushLoad2', 'row2'], LIFT),
        C('Balance', ['blStatic', 'blDynamic'], BAL)] },
      full: { label: 'Full body: jump, lift, stick', short: 'Full', absSlots: [], blocks: [
        S('Jumps', ['plyoLat', 'plyoLow', 'plyoLat?'], PLYO),
        SS('Full-body strength', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        C('Stick the landing', ['blPower', 'blDynamic', 'blStatic', 'blPower?'], BAL)] },
    },
  },
  {
    id: 'court-ready', added: 6, catalogue: 5, name: 'Court Ready', subject: 'Athlete', minutes: [34, 38], equip: 'bw', levers: [null, 'reps', 'reps'], rests: PLYO_RESTS,
    split: 'Lateral / vertical / landing', blurb: 'Bodyweight jumps, single-leg strength and balance for basketball, volleyball, tennis and anything with a court.',
    about: 'Bodyweight training for court sports: quick sideways bounds, high jumps and landings you can trust. Jumps come first on long rests, single-leg strength follows, then balance drills in every direction. One day is lateral, one vertical and one about landing and upper-body strength, which ends with abs. Levels II and III bring more reps, and the jumps get harder variations at Level III. No equipment, and a wall is welcome for the balance work.',
    names: ['Tip Off', 'Baseline', 'Sideline', 'Crossover', 'Split Step', 'Jump Serve', 'Rim Check', 'Box Out', 'Pivot', 'Drop Step', 'Fast Break', 'Closeout', 'Backcourt', 'Net Cord', 'Spike', 'Block Jump', 'Rebound', 'Lane Change', 'Timeout', 'Buzzer Beater'],
    cycle: ['lateral', 'vertical', 'landing'],
    dayTypes: {
      lateral: { label: 'Lateral & stick', short: 'Lateral', absSlots: [], blocks: [
        S('Lateral jumps', ['plyoLat', 'plyoLat', 'plyoLow', 'plyoLat?'], PLYO),
        S('Single-leg strength', ['legsBw2', 'singleLeg', 'singleLeg', 'legsBw2?'], LIFT),
        C('Balance', ['blDynamic', 'blStatic', 'blDynamic', 'blPower?'], BAL)] },
      vertical: { label: 'Vertical', short: 'Vertical', absSlots: [], blocks: [
        S('Vertical jumps', ['plyoVert', 'plyoVert', 'plyoLow', 'plyoVert?'], PLYO),
        S('Lower strength', ['legsBw2', 'singleLeg', 'singleLeg', 'legsBw2?'], LIFT),
        C('Balance', ['blStatic', 'blDynamic', 'blStatic?'], BAL)] },
      landing: { label: 'Landing, upper & abs', short: 'Landing', absSlots: ABS, blocks: [
        S('Jumps', ['plyoLow', 'plyoUp'], PLYO),
        S('Upper & back', ['pushBw2', 'pullBw'], LIFT),
        C('Landings', ['blPower', 'blDynamic'], BAL)] },
    },
  },
  {
    id: 'field-day', added: 6, catalogue: 5, name: 'Field Day', subject: 'Athlete', minutes: [33, 38], equip: 'all', levers: [null, 'weight', 'reps'], rests: PLYO_RESTS,
    gear: 'A pair of dumbbells or a kettlebell.',
    split: 'Sprint / power / stability', blurb: 'Bounds and skips, hip-driven lifting and single-leg stability for running and field sports.',
    about: 'Training for the field: running, cutting and change of direction. The sprint day opens with bounds and power skips, the power day with jumps and explosive push-ups, and the stability day with single-leg hops. Lifting is hip-driven, with hinges, glute work and swings, and every day has balance drills that make one-leg strength stick. Level II moves you one weight up and Level III adds reps, and the jumps get harder variations at Level III.',
    names: ['Kickoff', 'Sprint Start', 'Hash Marks', 'End Zone', 'Cleats On', 'First Down', 'Breakaway', 'Wide Open', 'Cut Back', 'Sideline Sprint', 'Turf', 'Goal Line', 'Two-Minute Drill', 'Pitch', 'Touchline', 'Corner Flag', 'Long Ball', 'Through Ball', 'Overtime', 'Trophy'],
    cycle: ['sprint', 'power', 'stability'],
    dayTypes: {
      sprint: { label: 'Sprint: bounds & hips', short: 'Sprint', absSlots: [], blocks: [
        S('Bounds & skips', ['bounding', 'power_skips', 'plyoLat', 'plyoLat?'], PLYO),
        S('Hip-driven strength', ['hinge2', 'glute2', 'hinge2', 'glute2?'], LIFT),
        C('Balance', ['blDynamic', 'blPower', 'blDynamic?'], BAL)] },
      power: { label: 'Power: jump & push', short: 'Power', absSlots: ABS, blocks: [
        S('Power', ['plyoLow', 'plyoUp'], PLYO),
        SS('Strength', ['squat2', 'pushLoad2'], LIFT),
        C('Balance', ['blStatic', 'blDynamic'], BAL)] },
      stability: { label: 'Stability: hops & legs', short: 'Stability', absSlots: [], blocks: [
        S('Single-leg hops', ['single_leg_hops', 'plyoVert', 'plyoVert', 'plyoLat?'], PLYO),
        S('Leg strength', ['squat2', 'lunge2', 'singleLeg', 'lunge2?'], LIFT),
        C('Stick the landing', ['blPower', 'blStatic', 'blPower', 'blDynamic?'], BAL)] },
    },
  },
  {
    id: 'explosive-legs', added: 6, catalogue: 5, name: 'Explosive Legs', subject: 'Athlete', minutes: [33, 38], equip: 'kb', levers: [null, 'reps', 'reps'], rests: PLYO_RESTS, gear: 'One kettlebell.',
    split: 'Jump / bound / single-leg', blurb: 'Jumps, bounds and single-leg hops, backed by kettlebell legs and balance work.',
    about: 'Explosive legs from three directions. One day jumps up and forward, one bounds sideways, and one is single-leg, with hops and single-leg strength. One kettlebell provides the loaded work: squats, deadlifts, swings and cleans. Balance drills close each day, followed by abs on the bound day. Levels II and III add reps, since one bell stays one weight, and the jumps get harder variations at Level III. Long rests keep each jump fresh.',
    names: ['Pop', 'Coil', 'Catapult', 'Launch Pad', 'Ballistic', 'Trampoline', 'Rocket Legs', 'Hare', 'Kangaroo', 'Grasshopper', 'Springbok', 'Flea', 'Cat Spring', 'Ram Jam', 'Quad Squad', 'Thunder Thighs', 'Pistons', 'Bell & Bound', 'Sky Walk', 'Peak Height'],
    cycle: ['jump', 'bound', 'single'],
    dayTypes: {
      jump: { label: 'Jump & squat', short: 'Jump', absSlots: [], blocks: [
        S('Jumps', ['plyoLow', 'plyoVert', 'plyoLow', 'plyoVert?'], PLYO),
        S('Bell legs', ['kbLower2', 'kbBallistic', 'kbLower2', 'kbLower2?'], LIFT),
        C('Balance', ['blStatic', 'blDynamic', 'blStatic?'], BAL)] },
      bound: { label: 'Bound & swing', short: 'Bound', absSlots: ABS, blocks: [
        S('Bounds', ['plyoLat', 'bounding'], PLYO),
        S('Bell hinge', ['kbBallistic', 'kbLower2?'], LIFT),
        C('Balance', ['blPower', 'blDynamic'], BAL)] },
      single: { label: 'Single-leg', short: 'Single', absSlots: [], blocks: [
        S('Single-leg hops', ['single_leg_hops', 'plyoVert', 'single_leg_hops', 'plyoVert?'], PLYO),
        S('Single-leg strength', ['singleLeg', 'kbLower2', 'singleLeg', 'kbLower2?'], LIFT),
        C('Stick the landing', ['blPower', 'blStatic', 'blPower', 'blDynamic?'], BAL)] },
    },
  },
  {
    id: 'power-and-poise', added: 6, catalogue: 5, name: 'Power & Poise', subject: 'Athlete', minutes: [33, 38], equip: 'all', levers: [null, 'weight', 'reps'], rests: PLYO_RESTS,
    gear: 'A pair of dumbbells or a kettlebell, and a sturdy chair for the balance work.',
    split: 'Upper power / lower power / control', blurb: 'Explosive moves, dumbbell strength and slow single-leg control: power you can steer.',
    about: 'Power that you can also control. Every session pairs explosive moves with strength and finishes with slow, careful balance. The upper day throws in clap push-ups and sprawls, the lower day jumps, and the control day mixes both with single-leg strength like pistol box squats, single-leg deadlifts and Copenhagen planks. Level II moves you one weight up and Level III adds reps, and jumps bring harder variations at Level III. Only the upper day ends with abs.',
    names: ['Steady Power', 'Poised', 'Balanced Blast', 'Clap & Hold', 'Jump & Freeze', 'Coiled Calm', 'Still Water', 'Even Keel', 'Plumb', 'Tightrope', 'Center Line', 'Graceful Force', 'Quiet Strength', 'Controlled Burn', 'Gyro', 'Plant & Punch', 'Weighted Calm', 'Poise Under Load', 'Ballerina Bounds', 'Fine Tuned'],
    cycle: ['upper', 'lower', 'control'],
    dayTypes: {
      upper: { label: 'Upper power & poise', short: 'Upper', absSlots: ABS, blocks: [
        S('Upper power', ['plyoUp', 'plyoUp'], PLYO),
        SS('Upper strength', ['pushLoad2', 'row2'], LIFT),
        C('Balance', ['blStatic', 'blDynamic'], BAL)] },
      lower: { label: 'Lower power & poise', short: 'Lower', absSlots: [], blocks: [
        S('Jumps', ['plyoLow', 'plyoVert', 'plyoLow', 'plyoVert?'], PLYO),
        S('Lower strength', ['squat2', 'glute2', 'lunge2', 'hinge2?'], LIFT),
        C('Balance', ['blDynamic', 'blPower', 'blDynamic?'], BAL)] },
      control: { label: 'Control', short: 'Control', absSlots: [], blocks: [
        S('Power', ['plyoLat', 'plyoUp', 'plyoLat?'], PLYO),
        S('Strength', ['squat2', 'row2', 'hinge2', 'pushLoad2?'], LIFT),
        S('Single-leg control', ['blStrength', 'blStrength', 'blStrength?'], BAL)] },
    },
  },
  {
    id: 'all-round-athlete', added: 6, catalogue: 5, name: 'All-Round Athlete', subject: 'Athlete', minutes: [36, 40], equip: 'all', levers: [null, 'weight', 'reps'], rests: PLYO_RESTS,
    gear: 'A pair of dumbbells or a kettlebell, and a sturdy chair or couch.',
    split: 'Lower / upper / full body: the longest athlete sessions', blurb: 'The full version of jump, lift, stick: longer jump sets, more lifting and a longer balance block.',
    about: 'The fullest athlete program here, about 40 minutes. Jumps, bounds and explosive push-ups come first on long rests, then a fuller strength block with dumbbells and a kettlebell, then a longer balance circuit. Lower, upper and full-body days rotate, and the lower and full days end with abs. Level II moves you one weight up and Level III adds reps, jumps bring more reps and harder variations, and balance drills add reps too. Come in fresh and rested.',
    names: ['Decathlon', 'Pentathlon', 'Triathlete', 'Two-Way Player', 'Utility Man', 'Swiss Army', 'Generalist', 'Cross-Trainer', 'Mixed Bag', 'Whole Game', 'Full Roster', 'Starting Five', 'Varsity', 'Team Captain', 'Pre-Season', 'In-Season', 'Playoffs', 'Finals', 'Podium', 'Hall of Fame'],
    cycle: ['lower', 'upper', 'full'],
    dayTypes: {
      lower: { label: 'Lower: jump, lift, stick', short: 'Lower', absSlots: ABS, blocks: [
        S('Jumps & bounds', ['plyoLow', 'plyoLat'], PLYO),
        S('Lower strength', ['squat2', 'hinge2'], LIFT),
        C('Balance', ['blPower', 'blDynamic'], BAL)] },
      upper: { label: 'Upper: power, lift, stick', short: 'Upper', absSlots: [], blocks: [
        S('Upper power', ['plyoUp', 'plyoUp', 'plyoUp', 'plyoUp?'], PLYO),
        SS('Upper strength', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT),
        S('Balance strength', ['blStrength', 'blStrength', 'blStrength?'], BAL)] },
      full: { label: 'Full body & abs', short: 'Full', absSlots: ABS, blocks: [
        S('Jumps', ['plyoLat', 'plyoUp'], PLYO),
        SS('Full-body strength', ['squat2', 'pushLoad2'], LIFT),
        C('Balance', ['blDynamic', 'blPower'], BAL)] },
    },
  },
  // ---------------- BALANCED WEEK (six programs, 28–40 min): one block from each family in every day ----------------
  {
    id: 'three-in-one', added: 6, catalogue: 5, name: 'Three in One', subject: 'Balanced week', minutes: [34, 39], equip: 'all', levers: [null, 'weight', 'reps'],
    gear: 'A pair of dumbbells or a kettlebell, and a mat.',
    split: 'Upper / lower / full body: a superset, a Tabata and a short flow', blurb: 'A superset for strength, a Tabata for the engine and a short flow to finish, in one session.',
    about: 'Every session has three parts: a superset, a Tabata and a short flow. The superset is for strength, the Tabata for heart and lungs, and the flow for your range of motion. Upper, lower and full-body days rotate, and the flow follows the muscles you just used. The full-body day opens with its flow and ends with abs. Level II moves you one weight up and Level III adds reps, and every hold in the flow gets longer. Good when you cannot choose between lifting, cardio and stretching.',
    names: ['Triple Play', 'Trifecta', 'Three Ring', 'Tripod', 'Triad', 'Three Course', 'Trio', 'Three Act', 'Triple Threat', 'Trinity', 'Tri-Star', 'Third Time', 'Three Peat', 'Trilogy', 'Threefold', 'Tri-Color', 'Three Legged', 'Triangle', 'Tricycle', 'Triple Crown'],
    cycle: ['upper', 'lower', 'full'],
    dayTypes: {
      upper: { label: 'Upper: superset, Tabata & flow', short: 'Upper', absSlots: [], blocks: [
        SS('Upper superset', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT),
        T('Tabata', ['hiit', 'pushBw2', 'hiit', 'cardio'], { ...CARDIO, values: [1, 2, 3] }),
        F('Short flow', ['mbShoulder', 'fxUpper', 'fxUpper'], { ...FLOW, values: [1] })] },
      lower: { label: 'Lower: superset, Tabata & flow', short: 'Lower', absSlots: [], blocks: [
        SS('Lower superset', ['squat2', 'hinge2', 'lunge2', 'glute2'], LIFT),
        T('Tabata', ['hiit', 'legsBw2', 'hiit', 'cardio'], { ...CARDIO, values: [1, 2, 3] }),
        F('Short flow', ['fxHips', 'fxHam', 'fxQuad'], { ...FLOW, values: [1] })] },
      full: { label: 'Flow, full-body superset, Tabata & abs', short: 'Full', absSlots: ABS, blocks: [
        F('Short flow', ['sun_salutation', 'fxSpine', 'ygStand'], { ...FLOW, values: [1] }),
        SS('Full-body superset', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        T('Tabata', ['hiit', 'hiitSec', 'hiit', 'legsBw2'], { ...CARDIO, values: [1, 2, 3] })] },
    },
  },
  {
    id: 'everyday-athlete', added: 6, catalogue: 5, name: 'Everyday Athlete', subject: 'Balanced week', minutes: [34, 39], equip: 'all', levers: [null, 'weight', 'reps'],
    gear: 'A pair of dumbbells or a kettlebell, and a sturdy chair or couch for the balance work.',
    split: 'Legs / upper / full body: lift, sweat, balance', blurb: 'Strength, a hard conditioning block and balance drills: what a person who moves well every day trains.',
    about: 'The three things an everyday athlete needs: strength, a strong engine and balance. Each day lifts with dumbbells or a kettlebell, then sweats through a circuit, an AMRAP or an EMOM, and finishes with balance drills on one leg. The upper day closes with abs. Level II moves you one weight up and Level III adds reps, the conditioning adds reps at both levels, and balance work adds reps too. Good for anyone who wants to stay fit for whatever the week throws at them.',
    names: ['Commuter', 'Stair Climber', 'Grocery Run', 'Bus Sprint', 'Park Bench', 'Weekend Hike', 'Carry It All', 'Bike Lane', 'Garden Day', 'Move Day', 'Playground', 'Dog Walker', 'Beach Day', 'Trail Head', 'Pickup Game', 'City Walk', 'Ladder Up', 'Shovel Snow', 'Free Saturday', 'Anywhere Fit'],
    cycle: ['legs', 'upper', 'full'],
    dayTypes: {
      legs: { label: 'Legs, circuit & balance', short: 'Legs', absSlots: [], blocks: [
        S('Leg strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        C('Sweat circuit', ['hiit', 'legsBw2', 'hiit', 'cardio'], CARDIO),
        C('Balance', ['blDynamic', 'blStatic', 'blPower', 'blDynamic?'], BAL)] },
      upper: { label: 'Upper, AMRAP, balance & abs', short: 'Upper', absSlots: ABS, blocks: [
        SS('Upper strength', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT),
        A('AMRAP', ['hiit', 'pushBw2', 'hiit', 'legsBw2'], CARDIO),
        C('Balance', ['blStatic', 'blDynamic', 'blStatic?'], BAL)] },
      full: { label: 'Full body, EMOM & balance', short: 'Full', absSlots: [], blocks: [
        S('Full-body strength', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        E('EMOM', ['hiit', 'legsBw2', 'cardio', 'pushBw2'], CARDIO),
        C('Balance', ['blDynamic', 'blPower', 'blStatic', 'blDynamic?'], BAL)] },
    },
  },
  {
    id: 'balanced-30', added: 6, catalogue: 5, name: 'Balanced 30', subject: 'Balanced week', minutes: [29, 34], equip: 'bw', levers: [null, 'reps', 'reps'],
    gear: 'A mat, and a sturdy table for the rows.',
    split: 'Circuit, EMOM & yoga / push-pull, AMRAP & stretch / legs, Tabata & hips', blurb: 'Half an hour, no equipment: bodyweight strength, a burst of cardio and a flow, every day.',
    about: 'Half an hour with nothing but a mat: bodyweight strength, a burst of cardio and a flow, all in one session. One day is a strength circuit, an EMOM and a yoga flow, one is push-ups and rows, an AMRAP and a stretch, and the third is legs, a Tabata and a hip flow. Levels II and III add reps in the strength and cardio, and each hold in the flows gets longer. The shortest way to cover everything in a day.',
    names: ['Half Hour', 'Thirty Flat', 'Level Scale', 'Even Split', 'Fair Share', 'Equal Parts', 'Level Ground', 'Fifty Fifty', 'A Bit of Each', 'Well Rounded', 'Square Meal', 'Balance Sheet', 'Middle Way', 'Golden Mean', 'Zero Gear', 'Just a Mat', 'Solid Thirty', 'Full Plate', 'Steady Thirty', 'Neat and Tidy'],
    cycle: ['circuit', 'pushpull', 'legs'],
    dayTypes: {
      circuit: { label: 'Circuit, EMOM & yoga', short: 'Circuit', absSlots: [], blocks: [
        C('Strength circuit', ['pushBw2', 'legsBw2', 'pullBw', 'core2'], LIFT),
        E('EMOM', ['hiit', 'cardio', 'hiitSec', 'hiit'], CARDIO),
        F('Yoga flow', ['sun_salutation', 'warrior_two', 'ygBalance', 'ygRest?'], FLOW)] },
      pushpull: { label: 'Push-pull, AMRAP & stretch', short: 'Push-pull', absSlots: [], blocks: [
        S('Push & pull', ['pushBw2', 'pullBw', 'pushBw2', 'pullBw?'], LIFT),
        A('AMRAP', ['hiit', 'legsBw2', 'hiit', 'cardio'], CARDIO),
        F('Stretch flow', ['fxUpper', 'fxHam', 'fxSpine', 'fxHips?'], FLOW_SCALED)] },
      legs: { label: 'Legs, Tabata & hip flow', short: 'Legs', absSlots: [], blocks: [
        S('Legs', ['legsBw2', 'singleLeg', 'legsBw2', 'singleLeg?', 'legsBw2?'], LIFT),
        T('Tabata', ['hiit', 'legsBw2', 'hiit', 'cardio'], CARDIO_TABATA),
        F('Hip flow', ['ygHips', 'mbHip', 'fxHips', 'ygHips?'], FLOW)] },
    },
  },
  {
    id: 'whole-body-week', added: 6, catalogue: 5, name: 'Whole Body Week', subject: 'Balanced week', minutes: [30, 36], equip: 'kb', levers: [null, 'reps', 'reps'],
    gear: 'One kettlebell and a mat.',
    split: 'Push / legs / pull / full body: bell strength, bell conditioning and a flow', blurb: 'One kettlebell and a mat: bell strength, bell conditioning and a flow, in a four-day rotation.',
    about: 'A four-day rotation with one kettlebell and a mat, so a run of days covers the whole body. Push, legs and pull days each start with bell strength, then swing or circuit conditioning, then a flow for the same area: shoulders, hips or spine. The full-body day opens with sun salutations and ends with a bell Tabata and abs. Levels II and III add reps, since one bell stays one weight, and every hold in the flows gets longer.',
    names: ['Monday Bell', 'Tuesday Bell', 'Wednesday Bell', 'Thursday Bell', 'Friday Bell', 'Saturday Bell', 'Sunday Bell', 'Week One', 'Week Two', 'Week Three', 'Weekender', 'Midweek', 'Week In', 'Week Out', 'Seven Days', 'Weekly Round', 'Full Circle', 'Calendar', 'Every Day Bell', 'Weekend Warrior'],
    cycle: ['push', 'legs', 'pull', 'full'],
    dayTypes: {
      push: { label: 'Push, swings & shoulders', short: 'Push', absSlots: [], blocks: [
        S('Bell press', ['kbUpper2', 'kbUpper2', 'kbCore2', 'kbUpper2?'], LIFT),
        E('Swing EMOM', ['kbBallistic', 'cardio', 'kbBallistic', 'hiit'], CARDIO),
        F('Shoulder flow', ['mbShoulder', 'fxUpper', 'mbShoulder', 'fxUpper?'], FLOW_SCALED)] },
      legs: { label: 'Legs, AMRAP & hips', short: 'Legs', absSlots: [], blocks: [
        S('Bell legs', ['kbLower2', 'kbLower2', 'kbBallistic', 'kbLower2?'], LIFT),
        A('AMRAP', ['kbSwing', 'hiit', 'legsBw2', 'cardio'], CARDIO),
        F('Hip flow', ['ygHips', 'mbHip', 'fxHam', 'ygHips?'], FLOW)] },
      pull: { label: 'Pull, circuit & spine', short: 'Pull', absSlots: [], blocks: [
        S('Bell pulls & hinge', ['kbUpper2', 'kbLower2', 'kbUpper2', 'kbLower2?'], LIFT),
        C('Conditioning circuit', ['kbBallistic', 'hiit', 'cardio', 'hiit'], CARDIO),
        F('Spine flow', ['mbSpine', 'fxSpine', 'ygBack', 'mbSpine?'], FLOW)] },
      full: { label: 'Salutations, bell, Tabata & abs', short: 'Full', absSlots: ABS, blocks: [
        F('Sun salutations', ['sun_salutation', 'warrior_one', 'ygStand'], FLOW),
        S('Full-body bell strength', ['kbLower2', 'kbUpper2', 'kbLower2', 'kbUpper2?'], LIFT),
        T('Bell Tabata', ['kbSwing', 'hiit', 'kbBallistic', 'cardio'], CARDIO_TABATA)] },
    },
  },
  {
    id: 'lift-sweat-stretch', added: 6, catalogue: 5, name: 'Lift Sweat Stretch', subject: 'Balanced week', minutes: [33, 38], equip: 'all', levers: [null, 'weight', 'reps'],
    gear: 'A pair of dumbbells or a kettlebell, a sturdy chair or couch, and a pull-up bar on upper days.',
    split: 'Legs / upper / full body: heavy sets, a hard finisher and a long stretch', blurb: 'Heavy straight sets, a hard conditioning finisher and a real stretch of the muscles you trained.',
    about: 'The order the name says: lift heavy in straight sets, sweat through a hard block, then stretch what you worked. Leg days finish with an AMRAP and a stretch for hips and hamstrings, upper days with a ladder and a stretch for chest, shoulders and back, and full-body days with a circuit and a stretch from feet to neck. Level II moves you one weight up and Level III adds reps, the conditioning adds reps, and every stretch is held a bit longer.',
    names: ['Pump', 'Grind', 'Sweat Equity', 'Cool Off', 'Wind Down', 'Payoff', 'Reward', 'Ease Off', 'Loosen Up', 'Fully Worked', 'Drained', 'Wrung Out', 'Stretched Thin', 'Dripping', 'Salt & Stretch', 'Heavy Then Easy', 'Peak & Valley', 'Lifted Off', 'Long Cooldown', 'Earned It'],
    cycle: ['legs', 'upper', 'full'],
    dayTypes: {
      legs: { label: 'Legs, AMRAP & hip stretch', short: 'Legs', absSlots: [], blocks: [
        S('Leg strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        A('AMRAP', ['hiit', 'legsBw2', 'hiit', 'cardio'], CARDIO),
        F('Hips & hamstrings', ['fxHam', 'fxHips', 'fxQuad', 'fxHam?'], FLOW)] },
      upper: { label: 'Upper, ladder & shoulder stretch', short: 'Upper', absSlots: [], blocks: [
        S('Upper strength', ['pushLoad2', 'pullBar2', 'shoulders2', 'row2?'], LIFT),
        L('Ladder', ['hiit', 'pushBw2', 'hiit'], CARDIO),
        F('Chest, shoulders & back', ['chest_opener', 'thread_the_needle', 'fxUpper', 'fxUpper', 'fxSpine?'], FLOW_SCALED)] },
      full: { label: 'Full body, circuit & stretch', short: 'Full', absSlots: [], blocks: [
        SS('Full-body strength', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        C('Sweat circuit', ['hiit', 'legsBw2', 'cardio', 'hiit'], CARDIO),
        F('Full stretch', ['fxHam', 'fxUpper', 'fxHips', 'fxSpine', 'fxSpine?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'the-generalist', added: 6, catalogue: 5, name: 'The Generalist', subject: 'Balanced week', minutes: [34, 39], equip: 'all', levers: [null, 'weight', 'reps'],
    gear: 'A pair of dumbbells or a kettlebell, and a sturdy chair or couch.',
    split: 'Punch / kick / breath: strength, bouts or a circuit and a Pilates or mobility finish', blurb: 'A different skill every day: boxing, kickboxing or a hard circuit, with strength and a Pilates or mobility finish.',
    about: 'Learn a bit of everything. The punch day pairs a superset with boxing bouts and ends with a mobility flow, the kick day pairs leg strength with kickboxing bouts and ends with hip work, and the third day opens with Pilates, lifts, sweats through a circuit and finishes with abs. Level II moves you one weight up and Level III adds reps, the bouts bring longer combinations, and the Pilates and flows get longer holds and more reps. For people who get bored doing the same thing twice.',
    names: ['Jack of All', 'Renaissance', 'Polymath', 'Well Read', 'Dabbler', 'Sampler', 'Tasting Menu', 'Grab Bag', 'Odd Jobs', 'Handyman', 'Wild Card', 'Variety Show', 'Buffet', 'Mixed Media', 'Open Book', 'Curious', 'Try Anything', 'Many Hats', 'All Rounder', 'Field Guide'],
    cycle: ['punch', 'kick', 'breath'],
    dayTypes: {
      punch: { label: 'Superset, bouts & mobility', short: 'Punch', absSlots: [], blocks: [
        SS('Upper superset', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT),
        B('Boxing bouts', ['bxBasic', 'bxPower', 'bxDefense?'], BOUTS),
        F('Shoulder & spine flow', ['mbShoulder', 'mbSpine', 'mbShoulder', 'fxUpper?'], FLOW)] },
      kick: { label: 'Legs, kick bouts & hips', short: 'Kick', absSlots: [], blocks: [
        S('Leg strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        B('Kickboxing bouts', ['kkKick', 'kkCombo', 'kkKnee?'], BOUTS),
        F('Hip flow', ['mbHip', 'ygHips', 'fxHips', 'mbHip?'], FLOW)] },
      breath: { label: 'Pilates, lift, circuit & abs', short: 'Breath', absSlots: ABS, blocks: [
        F('Pilates warm-up', ['hundred', 'roll_up', 'spine_stretch', 'plRoll?'], FLOW),
        S('Full-body strength', ['squat2', 'pushLoad2', 'hinge2', 'row2?'], LIFT),
        C('Sweat circuit', ['hiit', 'legsBw2', 'hiit', 'cardio'], CARDIO)] },
    },
  },

  // ---------------- CALM STRENGTH (six programs, 30–40 min): Pilates or core, slow strength, a yin finish ----------------
  {
    id: 'slow-burn', added: 6, catalogue: 5, name: 'Slow Burn', subject: 'Calm strength', minutes: [33, 38], equip: 'all', levers: [null, 'tempo', 'tempo'], absSlots: [],
    gear: 'A pair of dumbbells or a kettlebell, and a mat.',
    split: 'Lower / upper / full body: Pilates, slow lifting and a yin finish', blurb: 'A Pilates warm-up, strength with a three-second lowering and a yin finish of long, quiet holds.',
    about: 'Strength that is slow on purpose. A Pilates mat series opens each session, then dumbbell or kettlebell strength with a slow lowering at Levels II and III, so every rep takes longer and asks more of the muscle. The finish is yin: three floor stretches held for a minute and a half or more, not seconds, with nothing to push through. Lower, upper and full-body days rotate. Level II slows the lowering to three seconds and Level III keeps it, while the Pilates gets more reps and the yin holds get longer. Good after a noisy week.',
    names: ['Ember', 'Low Flame', 'Simmer', 'Slow Cooker', 'Long Fuse', 'Steady Heat', 'Banked Coals', 'Smolder', 'Glow', 'Warm Stone', 'Kiln', 'Hearth', 'Candlelight', 'Pilot Light', 'Slow Boil', 'Tea Steep', 'Low & Slow', 'Afterglow', 'Cinder', 'Embers Out'],
    cycle: ['lower', 'upper', 'full'],
    dayTypes: {
      lower: { label: 'Pilates, slow legs & yin hips', short: 'Lower', blocks: [
        F('Pilates series', ['hundred', 'plAbs', 'shoulder_bridge', 'plRoll?'], PILATES),
        S('Slow leg strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips'], YIN)] },
      upper: { label: 'Pilates, slow upper & yin spine', short: 'Upper', blocks: [
        F('Pilates series', ['hundred', 'plRoll', 'plBack', 'plAbs?'], PILATES),
        SS('Slow upper strength', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT),
        F('Yin spine & shoulders', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine'], YIN)] },
      full: { label: 'Pilates, slow full body & yin', short: 'Full', blocks: [
        F('Pilates series', ['hundred', 'plAbs', 'plSide', 'plRoll?'], PILATES),
        S('Slow full-body strength', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        F('Yin hips & spine', ['ygYinHips', 'ygYinSpine', 'ygYinHips'], YIN)] },
    },
  },
  {
    id: 'steady-strength', added: 6, catalogue: 5, name: 'Steady Strength', subject: 'Calm strength', minutes: [33, 38], equip: 'all', levers: [null, 'weight', 'tempo'], absSlots: [],
    gear: 'A pair of dumbbells or a kettlebell, a mat, and a pull-up bar on pull days.',
    split: 'Push / pull / legs: slow supersets, core and a yin finish', blurb: 'Slow supersets, a quiet core circuit and a long yin finish, with steady breathing all the way.',
    about: 'Push, pull and legs done at a calm, steady pace. Each session is a slow superset, a core circuit of dead bugs, bird dogs and planks that is held rather than rushed, and a yin finish of long floor holds. Level II moves you one weight up. Level III adds a three-second lowering to every rep, while the core block adds reps and the yin holds get longer. Nothing here should leave you breathless.',
    names: ['Even Keel', 'Level Head', 'Steady State', 'Slow Steady', 'Metronome', 'Cruise Control', 'Paced', 'Measured', 'Deep Breath', 'Sure Footed', 'Firm Hand', 'Anchor', 'Ballast', 'Ground Floor', 'Keel', 'Solid State', 'Held Breath', 'Still Point', 'Plumb Line', 'Bedrock'],
    cycle: ['push', 'pull', 'legs'],
    dayTypes: {
      push: { label: 'Slow push, core & yin', short: 'Push', blocks: [
        C('Core circuit', ['coreAnti', 'core2', 'coreAnti', 'core2?'], CORE),
        SS('Slow push supersets', ['pushLoad2', 'shoulders2', 'chest2', 'triceps?'], LIFT),
        F('Yin shoulders & spine', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine'], YIN)] },
      pull: { label: 'Slow pull, core & yin', short: 'Pull', blocks: [
        C('Core circuit', ['coreAnti', 'core2', 'coreAnti', 'core2?'], CORE),
        SS('Slow pull supersets', ['row2', 'pullBar2', 'row2', 'biceps'], LIFT),
        F('Yin back & hips', ['ygYinSpine', 'ygYinHips', 'ygYinSpine'], YIN)] },
      legs: { label: 'Slow legs, core & yin', short: 'Legs', blocks: [
        C('Core circuit', ['coreAnti', 'core2', 'coreAnti', 'core2?'], CORE),
        S('Slow leg strength', ['squat2', 'hinge2', 'lunge2', 'glute2?'], LIFT),
        F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips'], YIN)] },
    },
  },
  {
    id: 'pilates-and-iron', added: 6, catalogue: 5, name: 'Pilates & Iron', subject: 'Calm strength', minutes: [34, 39], equip: 'all', levers: [null, 'tempo', 'tempo'], absSlots: [],
    gear: 'A pair of dumbbells or a kettlebell, a mat, and a pull-up bar on back days.',
    split: 'Glutes & legs / back & core / full body: a longer Pilates series, iron and yin', blurb: 'A longer Pilates series first, dumbbell strength lifted slowly, and a yin finish.',
    about: 'The most Pilates of the group, and a pairing that works: the mat teaches control, the iron builds strength and yin lets it settle. Glute and leg days start with bridges and side work, back and core days with the hundred and a roll-up, and the full-body day with a mixed series. Dumbbells or a kettlebell follow, lifted with a three-second lowering at Levels II and III. Pilates adds reps and the harder moves at Level III, and the yin holds get longer.',
    names: ['Reformer', 'Mat & Metal', 'Powerhouse', 'Core & Iron', 'Barbell Barre', 'Control Freak', 'Precision', 'Flow & Iron', 'Breath Work', 'Centering', 'Iron Mat', 'Plates & Plies', 'Cadillac', 'Magic Circle', 'Joseph', 'Contrology', 'Neutral Spine', 'Ribs Closed', 'Heavy Mat', 'Ironed Out'],
    cycle: ['glutes', 'back', 'full'],
    dayTypes: {
      glutes: { label: 'Pilates glutes, slow legs & yin', short: 'Glutes', blocks: [
        F('Pilates glutes & sides', ['plGlute', 'plGlute', 'single_leg_circles', 'plSide', 'plAbs?'], PILATES_UP),
        S('Slow leg strength', ['squat2', 'glute2', 'lunge2', 'hinge2?'], LIFT),
        F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips'], YIN)] },
      back: { label: 'Pilates back, slow pulls & yin', short: 'Back', blocks: [
        F('Pilates back & core', ['hundred', 'roll_up', 'plBack', 'plRoll', 'plAbs?'], PILATES_UP),
        SS('Slow upper strength', ['row2', 'pushLoad2', 'pullBar2', 'shoulders2'], LIFT),
        F('Yin spine', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine'], YIN)] },
      full: { label: 'Pilates, slow full body & yin', short: 'Full', blocks: [
        F('Pilates series', ['hundred', 'plAbs', 'plRoll', 'plBack', 'plSide?'], PILATES_UP),
        S('Slow full-body strength', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        F('Yin hips & spine', ['ygYinHips', 'ygYinSpine', 'ygYinHips'], YIN)] },
    },
  },
  {
    id: 'yin-and-yang', added: 6, catalogue: 5, name: 'Yin & Yang', subject: 'Calm strength', minutes: [30, 35], equip: 'bw', levers: [null, 'tempo', 'tempo'], absSlots: [],
    gear: 'A mat, and a sturdy table for the rows.',
    split: 'Legs / upper: slow bodyweight strength, core and a long yin finish', blurb: 'Yang first: slow bodyweight strength and core. Then yin: two to three minutes per stretch, no equipment.',
    about: 'Yang first, then yin, with no equipment. Slow bodyweight strength, push-ups, lunges, bridges and rows, each lowered over three seconds at Levels II and III, then a short core block, then the long, quiet holds of yin. Two days alternate between legs and upper body. The yin holds are a minute and a half or more, and get longer at Levels II and III. Good for evenings and for days you would rather not touch a weight.',
    names: ['Balance', 'Sun & Moon', 'Push & Pull', 'Hard & Soft', 'Fire & Water', 'Day & Night', 'Give & Take', 'Ebb & Flow', 'Tide Turns', 'Dark & Light', 'Wax & Wane', 'Two Halves', 'Circle', 'Opposites', 'Harmony', 'Counterpoint', 'Both Ways', 'Full Circle', 'Yang Hour', 'Yin Hour'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: { label: 'Slow legs, core & yin hips', short: 'Legs', blocks: [
        S('Slow leg strength', ['legsBw2', 'singleLeg', 'legsBw2', 'singleLeg?'], LIFT),
        C('Core', ['coreAnti', 'core2', 'coreHollow'], CORE),
        F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips'], YIN)] },
      upper: { label: 'Slow upper, core & yin spine', short: 'Upper', blocks: [
        S('Slow upper strength', ['pushBw2', 'pullBw', 'pushBw2', 'pullBw?'], LIFT),
        C('Core', ['coreAnti', 'core2', 'coreRot'], CORE),
        F('Yin spine & shoulders', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine'], YIN)] },
    },
  },
  {
    id: 'quiet-power', added: 6, catalogue: 5, name: 'Quiet Power', subject: 'Calm strength', minutes: [30, 36], equip: 'kb', levers: [null, 'tempo', 'tempo'], absSlots: [], gear: 'One kettlebell and a mat.',
    split: 'Legs / upper / full body: one bell lifted slowly, core and a yin finish', blurb: 'One kettlebell, lifted slowly, plus core work and a yin finish: strength with the volume turned down.',
    about: 'One kettlebell and a mat, and no rush. Goblet squats, front squats, deadlifts, presses and rows are lowered over three seconds at Levels II and III, which makes a single bell heavy enough. Each session opens with a short core block and ends with yin holds for the hips and spine. Legs, upper body and full-body days rotate. The bell stays one weight, so the slow lowering does the work of making it harder, and the yin holds get longer. Quiet on the neighbours, too.',
    names: ['Hush', 'Whisper', 'Library Voice', 'Soft Step', 'Low Volume', 'Muted', 'Velvet', 'Slow Motion', 'Still Bell', 'Quiet Bell', 'Slow Swing', 'Pause', 'Hold', 'Felt Hammer', 'Padded', 'Silent Gong', 'Dim Light', 'Late Night', 'Hushed Hall', 'Softly'],
    cycle: ['legs', 'upper', 'full'],
    dayTypes: {
      legs: { label: 'Core, slow bell legs & yin hips', short: 'Legs', blocks: [
        C('Core', ['coreAnti', 'core2', 'coreAnti'], CORE),
        S('Slow bell legs', ['kbLower2', 'kbLower2', 'kbLower2', 'kbLower2?'], LIFT),
        F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips'], YIN)] },
      upper: { label: 'Core, slow bell upper & yin spine', short: 'Upper', blocks: [
        C('Core', ['coreAnti', 'core2', 'coreAnti'], CORE),
        S('Slow bell upper body', ['kbUpper2', 'kbUpper2', 'kbUpper2', 'kbUpper2?'], LIFT),
        F('Yin spine & shoulders', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine'], YIN)] },
      full: { label: 'Core, slow bell full body & yin', short: 'Full', blocks: [
        C('Core', ['coreAnti', 'coreRot', 'core2'], CORE),
        S('Slow bell full body', ['kbLower2', 'kbUpper2', 'kbLower2', 'kbUpper2?'], LIFT),
        F('Yin hips & spine', ['ygYinHips', 'ygYinSpine', 'ygYinHips'], YIN)] },
    },
  },
  {
    id: 'control', added: 6, catalogue: 5, name: 'Control', subject: 'Calm strength', minutes: [33, 38], equip: 'all', levers: [null, 'tempo', 'weight'], absSlots: [],
    gear: 'A pair of dumbbells or a kettlebell, and a mat.',
    split: 'Single-leg / hinge / shoulders: Pilates control, slow single-limb strength and a yin finish', blurb: 'Pilates control work, slow single-leg and single-arm strength, and a yin finish that undoes the day.',
    about: 'Strength that trains control, not just force. Pilates leg circles, bridges and swans open each session, then slow single-leg and single-arm work, split squats, single-leg deadlifts and one-arm rows lowered over three seconds, then yin holds. One day is single-leg, one is hinges and glutes, and one is shoulders and back. Level II adds the slow lowering and Level III moves you one weight up, Pilates gets harder moves at Level III, and the yin holds get longer. Best when you feel strong but wobbly.',
    names: ['Center', 'Stability', 'Neutral', 'Aligned', 'Precise', 'Deliberate', 'Composed', 'Restrained', 'Held Back', 'Reined In', 'Fine Motor', 'Slow Hands', 'Careful', 'Exact', 'Tidy Reps', 'Smooth', 'Graceful', 'Poised Reps', 'Measured Steps', 'Mastery'],
    cycle: ['single', 'hinge', 'shoulders'],
    dayTypes: {
      single: { label: 'Pilates, slow single-leg & yin', short: 'Single', blocks: [
        F('Pilates leg work', ['single_leg_circles', 'shoulder_bridge', 'plSide', 'plGlute?'], PILATES_UP),
        S('Slow single-leg strength', ['singleLeg', 'lunge2', 'singleLeg', 'glute2?'], LIFT),
        F('Yin hips', ['ygYinHips', 'ygYinHips', 'ygYinHips'], YIN)] },
      hinge: { label: 'Pilates, slow hinge & yin', short: 'Hinge', blocks: [
        F('Pilates back & glutes', ['swan', 'swimming', 'shoulder_bridge', 'plBack?'], PILATES_UP),
        S('Slow hinge strength', ['hinge2', 'glute2', 'hinge2', 'squat2?'], LIFT),
        F('Yin hips & spine', ['ygYinHips', 'ygYinSpine', 'ygYinHips'], YIN)] },
      shoulders: { label: 'Pilates, slow shoulders & yin', short: 'Shoulders', blocks: [
        F('Pilates series', ['hundred', 'leg_pull_front', 'plBack', 'plRoll?'], PILATES_UP),
        S('Slow shoulders & back', ['shoulders2', 'row2', 'shoulders2', 'row2?'], LIFT),
        F('Yin spine & shoulders', ['ygYinSpine', 'ygYinSpine', 'ygYinSpine'], YIN)] },
    },
  },
  // ---------------- PHASE 14: 30-DAY PROGRAMS (three levels of ten days) ----------------
  {
    id: 'balanced-month', added: 14, catalogue: 8, days: 30, name: 'Balanced Month', subject: 'Balanced week', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Lift & sweat / lift & stretch, 30 days', blurb: 'A month that covers everything: strength every day, with a burst of cardio or a flow after it.',
    about: 'A month that covers the whole of fitness without planning a week. Every day starts with strength in straight sets; one day follows it with a short Tabata of cardio, the next with a yoga or mobility flow. Every ten days the level steps up: the strength asks for heavier weights at Level II and more reps at Level III, and the cardio and flows grow with it. Abs finish the strength-and-cardio days.',
    names: ['All-rounder', 'Mixed Bag', 'Variety', 'Spectrum', 'Palette', 'Mosaic Day', 'Patchwork', 'Medley Day', 'Assortment', 'Sampler', 'Rainbow', 'Kaleidoscope', 'Smorgasbord', 'Buffet', 'Tapas'],
    cycle: ['sweat', 'stretch'],
    dayTypes: {
      sweat: { label: 'Lift & sweat', short: 'Sweat', blocks: [
        S('Strength', ['squat2', 'pushLoad2', 'row2', 'hinge2?'], LIFT),
        T('Tabata', ['hiit', 'cardio', 'hiit', 'core'], CARDIO_TABATA)] },
      stretch: { label: 'Lift & stretch', short: 'Stretch', absSlots: [], blocks: [
        S('Strength', ['lunge2', 'shoulders2', 'row2', 'glute2?'], LIFT),
        F('Flow', ['sun_salutation', 'ygStand', 'ygHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'calm-month', added: 14, catalogue: 8, days: 30, name: 'Calm Month', subject: 'Calm strength', minutes: [26, 31], levers: [null, 'tempo', 'weight'], absSlots: [],
    gear: 'A pair of dumbbells or a kettlebell, and a mat.',
    split: 'Pilates & slow strength / slow strength & yin, 30 days', blurb: 'A quiet month: Pilates and slow strength one day, slow strength and long yin holds the next.',
    about: 'A quiet month of strength without hurry. One day opens with a Pilates series before slow dumbbell or kettlebell strength; the other pairs slow strength with a yin finish of long floor holds. From day 11 every rep gets a slow lowering, and from day 21 the weights go up. Nothing jumps and nothing rushes, and there is no separate abs finisher.',
    names: ['Quiet Hour', 'Still Morning', 'Calm Water', 'Slow Tide', 'Soft Light', 'Deep Breath', 'Steady Hand', 'Stone Garden', 'Zen', 'Tea House', 'Bamboo Grove', 'Paper Lantern', 'Koi Pond', 'Moss Garden', 'Temple Bell'],
    cycle: ['pilates', 'yin'],
    dayTypes: {
      pilates: { label: 'Pilates & slow strength', short: 'Pilates', blocks: [
        F('Pilates series', ['hundred', 'plAbs', 'plRoll', 'plAbs?'], PILATES),
        S('Slow strength', ['squat2', 'row2', 'pushLoad2', 'hinge2?'], LIFT)] },
      yin: { label: 'Slow strength & yin', short: 'Yin', blocks: [
        S('Slow strength', ['lunge2', 'shoulders2', 'glute2', 'row2?'], LIFT),
        F('Yin', ['ygYinHips', 'ygYinSpine', 'ygYinHips'], YIN)] },
    },
  },
  // ---------------- PHASE 14 ticket 12: Mixed +15, three per subject ----------------
  // STRENGTH & STRETCH (+3)
  {
    id: 'bodyweight-and-stretch', added: 14, catalogue: 8, name: 'Bodyweight & Stretch', subject: 'Strength & stretch', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Upper & open / lower & lengthen', blurb: 'No equipment: bodyweight strength, then a stretch for the muscles you just worked.',
    about: 'Strength and flexibility with no equipment, in about twenty-five minutes. Upper days pair push-ups and floor pulls with a chest and shoulder stretch; lower days pair squats and single-leg work with a hip and hamstring stretch. The flow at the end is held on the clock and the voice walks you through it. Levels II and III add reps to the strength and hold the stretches longer.',
    names: ['Stretch Out', 'Reach Long', 'Bend and Lift', 'Push and Open', 'Squat and Fold', 'Lift and Lengthen', 'Strong and Supple', 'Flex Day', 'Work and Ease', 'Tension Release', 'Contract Relax', 'Pull and Open', 'Hinge and Fold', 'Rise and Reach', 'Steady Stretch'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & open', short: 'Upper', absSlots: [], blocks: [
        S('Upper strength', ['pushBw2', 'pullBw', 'pushBw2', 'pullBw?'], LIFT),
        F('Chest & shoulders', ['fxUpper', 'fxUpper', 'fxUpper', 'fxUpper?'], FLOW_SCALED)] },
      lower: { label: 'Lower & lengthen', short: 'Lower', absSlots: [], blocks: [
        S('Lower strength', ['legsBw2', 'legsBw2', 'single_leg_bridge', 'legsBw2?'], LIFT),
        F('Hips & hamstrings', ['fxHam', 'fxHips', 'fxQuad', 'fxHips?'], FLOW)] },
    },
  },
  {
    id: 'supersets-and-stretch', added: 14, catalogue: 8, name: 'Supersets & Stretch', subject: 'Strength & stretch', minutes: [28, 33], levers: [null, 'weight', 'weight'],
    split: 'Push & open / legs & lengthen', blurb: 'Dumbbell supersets, heavier each level, then a long stretch for what you trained.',
    about: 'Supersets with dumbbells or a kettlebell, then a long stretch. Push days pair presses with rows and finish with the chest and shoulders opened; leg days pair squats with hinges and finish with the hips and hamstrings. The supersets get heavier at both later levels and the stretches hold longer. A good way to stay mobile while you get strong.',
    names: ['Pair and Stretch', 'Two and Open', 'Back to Back Stretch', 'Duo Stretch', 'Couple Up', 'Twin Lift', 'Pair Lift', 'Partner', 'Match', 'Double Up', 'Yoked', 'Linked', 'Tandem', 'Duet Lift', 'Paired'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: { label: 'Push & open', short: 'Push', absSlots: [], blocks: [
        SS('Push supersets', ['pushLoad2', 'row2', 'shoulders2', 'row2'], LIFT),
        F('Chest & shoulders', ['chest_opener', 'fxUpper', 'fxUpper', 'fxUpper?'], FLOW_SCALED)] },
      legs: { label: 'Legs & lengthen', short: 'Legs', absSlots: [], blocks: [
        SS('Leg supersets', ['squat2', 'hinge2', 'lunge2', 'glute2'], LIFT),
        F('Hips & hamstrings', ['fxHam', 'fxHips', 'fxQuad', 'fxHam?'], FLOW)] },
    },
  },
  {
    id: 'lift-and-move', added: 14, catalogue: 8, name: 'Lift & Move', subject: 'Strength & stretch', minutes: [30, 35], levers: [null, 'tempo', 'weight'],
    split: 'Lift & mobility A / B, abs on A', blurb: 'Full-body strength in straight sets, then a joint mobility flow for hips, spine and shoulders.',
    about: 'Strength and mobility in one session. Each day starts with full-body strength in straight sets, then moves to a guided mobility flow, hip circles, 90/90s, open books and wall slides, that keeps joints moving well under the load. Day A ends with abs. Level II slows the lifting down and Level III asks for heavier weights; the mobility grows with it.',
    names: ['Move Well', 'Lift Well', 'Joint Care', 'Range and Load', 'Strong Joints', 'Oiled', 'Well Hinged', 'Smooth Mover', 'Easy Joints', 'Free Moving', 'Loose and Strong', 'Fluid', 'Agile', 'Limber Lift', 'Spry'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Lift & mobility A', short: 'A', absSlots: ABS, blocks: [
        F('Mobility', ['hip_cars', 'mbHip', 'mbSpine', 'mbShoulder?'], FLOW),
        S('Strength', ['squat2', 'pushLoad2', 'row2', 'hinge2?'], LIFT)] },
      b: { label: 'Lift & mobility B', short: 'B', absSlots: [], blocks: [
        S('Strength', ['hinge2', 'shoulders2', 'row2', 'lunge2?'], LIFT),
        F('Mobility', ['shoulder_cars', 'mbShoulder', 'mbSpine', 'mbHip?'], FLOW)] },
    },
  },
  // FIGHTER (+3)
  {
    id: 'bouts-and-bells', added: 14, catalogue: 8, name: 'Bouts & Bells', subject: 'Fighter', minutes: [30, 35], equip: 'kb', levers: [null, 'reps', 'weight'],
    gear: 'One kettlebell.',
    split: 'Bouts & swings / bouts & presses', blurb: 'Boxing bouts, then kettlebell strength: swings and squats one day, cleans and presses the next.',
    about: 'Boxing bouts first, then a kettlebell for the strength a fighter needs. Swing and squat days build the hips and legs that power punches; clean and press days build the shoulders that keep the hands up. Every session ends with abs. Levels II and III bring longer combinations, and Level II adds reps to the bell while Level III asks for a heavier one.',
    names: ['Iron Fist', 'Bell Bout', 'Kettle Fight', 'Ring Iron', 'Corner Bell', 'Glove and Bell', 'Round Bell Day', 'Swing Round', 'Press Round', 'Heavy Round', 'Bell Clinch', 'Iron Round', 'Fight Bell', 'Bout Bell', 'Ringer'],
    cycle: ['swing', 'press'],
    dayTypes: {
      swing: { label: 'Bouts & swings', short: 'Swing', absSlots: ABS, blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxDefense', 'bxPower?'], BOUTS),
        S('Bell legs', ['kb_swing', 'kbLower', 'kbLower2?'], LIFT)] },
      press: { label: 'Bouts & presses', short: 'Press', absSlots: ABS, blocks: [
        B('Bouts', ['bxMove', 'bxBasic', 'bxPower', 'bxDefense?'], BOUTS),
        S('Bell upper body', ['kb_clean', 'kbUpper', 'kbUpper2?'], LIFT)] },
    },
  },
  {
    id: 'kick-and-stretch', added: 14, catalogue: 8, name: 'Kick & Stretch', subject: 'Fighter', minutes: [28, 33], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Kicks & hips / combos & spine', blurb: 'Kickboxing bouts, then a flexibility flow for higher, easier kicks.',
    about: 'Kickboxing bouts, then the flexibility that makes kicks higher and easier. Kick days drill teeps, roundhouses and side kicks, then open the hips and hamstrings; combination days mix punches and kicks, then work the spine and hip flexors. The stretches are held on the clock and the voice walks you through. Levels II and III bring longer combinations and longer holds.',
    names: ['High Kick', 'Split Kick', 'Limber Leg', 'Head Height', 'Long Leg', 'Hip Turn Stretch', 'Kick Flex', 'Open Hip Kick', 'Loose Leg', 'Swing High', 'Reach Kick', 'Stretch Kick', 'Easy Kick', 'Flow Kick', 'Free Kick'],
    cycle: ['kicks', 'combos'],
    dayTypes: {
      kicks: { label: 'Kicks & hips', short: 'Kicks', absSlots: [], blocks: [
        B('Kick bouts', ['kkKick', 'kkKick', 'kkCombo', 'kkKnee?'], BOUTS),
        F('Hips & hamstrings', ['fxHips', 'fxHam', 'fxSplit', 'fxHips?'], FLOW)] },
      combos: { label: 'Combos & spine', short: 'Combos', absSlots: [], blocks: [
        B('Combination bouts', ['kkCombo', 'bxBasic', 'kkCombo', 'kkKick?'], BOUTS),
        F('Spine & hip flexors', ['fxSpine', 'fxQuad', 'fxSpine', 'fxQuad?'], FLOW)] },
    },
  },
  {
    id: 'fighter-25', added: 14, catalogue: 8, name: 'Fighter 25', subject: 'Fighter', minutes: [24, 29], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Bouts & core A / B', blurb: 'Twenty-five minutes: shadowboxing bouts, then a core circuit a fighter would recognise.',
    about: 'A fighter\'s session in twenty-five minutes. Three bouts of shadowboxing come first, one combination per bout called by the voice. Then a core circuit of planks, twists and hollow holds, the trunk strength that keeps a fighter balanced and protected. Levels II and III bring longer combinations and add reps to the core.',
    names: ['Quick Round', 'Short Card', 'Prelim', 'Opener', 'Warm-up Fight', 'Three Rounder', 'Undercard Bout', 'Exhibition', 'Spar', 'Mitt Work', 'Pad Round', 'Shadow Round', 'Gym Round', 'Practice Round', 'Drill Round'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bouts & core A', short: 'A', absSlots: [], blocks: [
        B('Bouts', ['bxBasic', 'bxPower', 'bxDefense?'], BOUTS),
        C('Fighter\'s core', ['coreAnti', 'coreRot', 'coreHollow', 'coreRot?'], CORE)] },
      b: { label: 'Bouts & core B', short: 'B', absSlots: [], blocks: [
        B('Bouts', ['bxMove', 'bxBasic', 'bxPower?'], BOUTS),
        C('Fighter\'s core', ['coreRot', 'coreHollow', 'coreAnti', 'coreAnti?'], CORE)] },
    },
  },
  // ATHLETE (+3)
  {
    id: 'bodyweight-athlete', added: 14, catalogue: 8, name: 'Bodyweight Athlete', subject: 'Athlete', minutes: [30, 35], equip: 'bw', levers: [null, 'reps', 'variation'], rests: PLYO_RESTS,
    split: 'Jump & lift / bound & balance', blurb: 'The athlete\'s order with no equipment: jumps first, then bodyweight strength, then balance.',
    about: 'Athletic training with no equipment, in the athlete\'s order: jumps while you are fresh, then strength, then balance. Jump days pair vertical and broad jumps with push-ups and squats; bound days pair lateral bounds with single-leg strength and landing drills. Rests are long so every jump is crisp. Abs finish the jump days. Level II adds reps and Level III brings harder versions.',
    names: ['Field Test', 'Combine', 'Try-out', 'Pre-season', 'Training Camp', 'Two-a-day', 'Scrimmage', 'Practice Day', 'Drill Day', 'Agility Day', 'Speed Day', 'Power Day', 'Balance Day Athlete', 'Ready Set', 'Game Ready'],
    cycle: ['jump', 'bound'],
    dayTypes: {
      jump: { label: 'Jump & lift', short: 'Jump', absSlots: ABS, blocks: [
        S('Jumps', ['plyoVert', 'plyoLow', 'plyoVert?'], PLYO),
        S('Bodyweight strength', ['pushBw2', 'legsBw2', 'pullBw?'], LIFT)] },
      bound: { label: 'Bound & balance', short: 'Bound', absSlots: [], blocks: [
        S('Bounds', ['plyoLat', 'plyoLat', 'plyoLow?'], PLYO),
        S('Single-leg strength', ['singleLeg', 'legsBw2', 'legsBw2?'], LIFT),
        C('Balance', ['blPower', 'blDynamic', 'blStatic?'], BAL)] },
    },
  },
  {
    id: 'speed-and-strength', added: 14, catalogue: 8, name: 'Speed & Strength', subject: 'Athlete', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Speed & legs / speed & upper', blurb: 'Running drills and sprints in place, then dumbbell strength: fast first, strong second.',
    about: 'Fast first, strong second. Each session opens with a circuit of running drills and sprints in place, A-skips, wall drives and fast feet, while the legs are fresh. Then comes dumbbell or kettlebell strength in straight sets, legs one day and upper body the next. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Sprint Start', 'Fast Feet Day', 'Quick Step', 'Acceleration', 'Top Speed', 'Flying Start', 'Drive Phase', 'Max Velocity', 'Sprint Strong', 'Speed Lift', 'Fast and Strong', 'Quick Lift', 'Burst Lift', 'Speed Rep', 'Rapid Strength'],
    cycle: ['legs', 'upper'],
    dayTypes: {
      legs: { label: 'Speed & legs', short: 'Legs', absSlots: ABS, blocks: [
        C('Speed drills', ['runDrill', 'runFast', 'runDrill'], { ...COND, values: [2, 3] }),
        S('Leg strength', ['squat2', 'hinge2', 'lunge2?'], LIFT)] },
      upper: { label: 'Speed & upper', short: 'Upper', absSlots: ABS, blocks: [
        C('Speed drills', ['runFast', 'runDrill', 'runFast'], { ...COND, values: [2, 3] }),
        S('Upper strength', ['pushLoad2', 'row2', 'shoulders2?'], LIFT)] },
    },
  },
  {
    id: 'court-athlete', added: 14, catalogue: 8, name: 'Court Athlete', subject: 'Athlete', minutes: [30, 35], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Agility, legs & balance A / B', blurb: 'For court sports: agility drills, lateral leg strength and landing control in every session.',
    about: 'Everything a court sport asks of the legs in one session. Agility drills come first, shuttles, carioca and split steps; then lateral leg strength such as Cossack squats and Copenhagen planks; then balance and landing drills that protect knees and ankles. No equipment. Abs finish day A. Levels II and III add reps and time.',
    names: ['Hardcourt', 'Clay Court', 'Grass Court', 'Gym Floor', 'Squash Court', 'Badminton', 'Volley', 'Spike', 'Dig', 'Set Shot', 'Layup', 'Drive Shot', 'Smash', 'Lob', 'Rally'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Agility, legs & balance A', short: 'A', absSlots: ABS, blocks: [
        C('Agility', ['courtMove', 'courtPower', 'courtMove'], { ...COND, values: [2, 3] }),
        S('Lateral strength', ['cossack_squat', 'courtLegs', 'courtLegs?'], LIFT),
        C('Landing', ['blPower', 'blStatic'], BAL)] },
      b: { label: 'Agility, legs & balance B', short: 'B', absSlots: [], blocks: [
        C('Agility', ['courtMove', 'courtMove', 'courtPower'], { ...COND, values: [2, 3] }),
        S('Lateral strength', ['courtLegs', 'copenhagen_plank', 'courtLegs?'], LIFT),
        C('Landing', ['blDynamic', 'blPower'], BAL)] },
    },
  },
  // BALANCED WEEK (+3)
  {
    id: 'balanced-25', added: 14, catalogue: 8, name: 'Balanced 25', subject: 'Balanced week', minutes: [24, 29], levers: [null, 'weight', 'reps'],
    split: 'Lift & sweat / lift & flow', blurb: 'Twenty-five minutes that cover the week: a superset, then an EMOM or a short flow.',
    about: 'A balanced week in twenty-five-minute sessions. Every day starts with a strength superset; one day follows it with a short EMOM of cardio moves, the next with a short yoga or mobility flow. Over a week that is strength every day, plus cardio and flexibility twice each. Abs finish the cardio days. Level II asks for heavier weights and Level III adds reps.',
    names: ['Short Balance', 'Little of Each', 'Bit of Everything', 'Pick and Mix', 'Sampler Day', 'Taster', 'Snack Plate', 'Bento', 'Mezze', 'Small Plates', 'Thali', 'Tasting Menu', 'Platter', 'Medley 25', 'Mix 25'],
    cycle: ['sweat', 'flow'],
    dayTypes: {
      sweat: { label: 'Lift & sweat', short: 'Sweat', absSlots: ABS, blocks: [
        SS('Strength', ['squat2', 'pushLoad2', 'hinge2', 'row2'], LIFT),
        E('Cardio EMOM', ['hiit', 'cardio', 'hiitSec', 'hiit'], { ...CARDIO, values: [6, 8] })] },
      flow: { label: 'Lift & flow', short: 'Flow', absSlots: [], blocks: [
        SS('Strength', ['lunge2', 'row2', 'glute2', 'shoulders2'], LIFT),
        F('Flow', ['sun_salutation', 'ygStand', 'ygHips', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'kettlebell-week', added: 14, catalogue: 8, name: 'Kettlebell Week', subject: 'Balanced week', minutes: [30, 35], equip: 'kb', levers: [null, 'weight', 'reps'],
    gear: 'One kettlebell and a mat.',
    split: 'Bell strength, Tabata & flow A / B', blurb: 'One kettlebell for strength, a bodyweight Tabata for the engine and a flow to finish.',
    about: 'A balanced session around one kettlebell. Bell strength comes first in straight sets, then a Tabata of bodyweight cardio, twenty seconds hard and ten seconds rest, then a short yoga or mobility flow. Two days alternate the moves. Level II asks for a heavier bell and Level III adds reps; the Tabata and flow grow with it.',
    names: ['Bell Balance', 'Iron and Air', 'Bell and Breath', 'Swing and Stretch', 'Bell Mix', 'Kettle Week', 'Bell Blend', 'Bell Trio', 'Iron Trio', 'Bell All-round', 'Bell Harmony', 'Bell Rhythm', 'Bell Medley', 'Bell Fusion', 'Bell Circle'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Bell, Tabata & flow A', short: 'A', absSlots: [], blocks: [
        S('Bell strength', ['kb_swing', 'kbLower2', 'kbUpper2'], LIFT),
        T('Tabata', ['hiit', 'cardio', 'hiit', 'core'], CARDIO_TABATA),
        F('Flow', ['sun_salutation', 'ygStand', 'ygRest?'], FLOW)] },
      b: { label: 'Bell, Tabata & flow B', short: 'B', absSlots: [], blocks: [
        S('Bell strength', ['kb_clean', 'kbUpper', 'kbLower'], LIFT),
        T('Tabata', ['cardio', 'hiit', 'core', 'hiit'], CARDIO_TABATA),
        F('Flow', ['mbHip', 'mbSpine', 'mbShoulder?'], FLOW)] },
    },
  },
  {
    id: 'no-gear-week', added: 14, catalogue: 8, name: 'No-Gear Week', subject: 'Balanced week', minutes: [28, 33], equip: 'bw', levers: [null, 'reps', 'variation'],
    split: 'Circuit, AMRAP & flow / supersets, Tabata & stretch', blurb: 'No equipment, everything covered: bodyweight strength, a burst of cardio and a flow every day.',
    about: 'A balanced week with no equipment at all. One day is a bodyweight strength circuit, an AMRAP and a yoga flow; the other is supersets, a Tabata and a stretch. Strength, fitness and flexibility every session in about half an hour. Level II adds reps and Level III brings harder versions of the strength moves.',
    names: ['Travel Week', 'Holiday Week', 'Anywhere', 'Park Session', 'Beach Session', 'Living Room', 'Garden Session', 'Rooftop', 'Balcony', 'Campsite', 'Cabin', 'Lodge', 'Hostel', 'Guest Room', 'Spare Room'],
    cycle: ['circuit', 'supersets'],
    dayTypes: {
      circuit: { label: 'Circuit, AMRAP & flow', short: 'Circuit', absSlots: [], blocks: [
        C('Strength circuit', ['pushBw2', 'legsBw2', 'pullBw', 'core2'], LIFT),
        A('AMRAP', ['hiit', 'cardio', 'hiit'], { ...CARDIO, values: [5, 6] }),
        F('Flow', ['sun_salutation', 'ygStand', 'ygRest?'], FLOW)] },
      supersets: { label: 'Supersets, Tabata & stretch', short: 'Supersets', absSlots: [], blocks: [
        SS('Supersets', ['pushBw2', 'legsBw2', 'pullBw', 'legsBw2'], LIFT),
        T('Tabata', ['hiit', 'core', 'hiit', 'cardio'], CARDIO_TABATA),
        F('Stretch', ['fxHips', 'fxHam', 'fxUpper?'], FLOW)] },
    },
  },
  // CALM STRENGTH (+3)
  {
    id: 'calm-bodyweight', added: 14, catalogue: 8, name: 'Calm Bodyweight', subject: 'Calm strength', minutes: [28, 33], equip: 'bw', levers: [null, 'tempo', 'reps'], absSlots: [],
    split: 'Core, slow strength & yin A / B', blurb: 'No equipment, no hurry: core work, slow bodyweight strength and a long yin finish.',
    about: 'Strength with no equipment and no hurry. Each session opens with a core circuit, then slow bodyweight strength, push-ups, squats and floor pulls, then finishes with long, quiet yin holds. From day 21 every rep gets a slow lowering, and Level III adds reps on top. Nothing jumps, and there is no separate abs finisher.',
    names: ['Quiet Floor', 'Still Strength', 'Soft Power', 'Gentle Force', 'Calm Push', 'Easy Squat', 'Slow Pull', 'Deep Calm', 'Low Light', 'Hushed', 'Muted Strength', 'Subtle', 'Understated', 'Restful Strength', 'Steady Calm'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Core, slow strength & yin A', short: 'A', blocks: [
        C('Core', ['coreAnti', 'core2', 'coreAnti'], CORE),
        S('Slow strength', ['pushBw2', 'legsBw2', 'pullBw'], LIFT),
        F('Yin', ['ygYinHips', 'ygYinHips', 'ygYinSpine'], YIN)] },
      b: { label: 'Core, slow strength & yin B', short: 'B', blocks: [
        C('Core', ['coreRot', 'core2', 'coreHollow'], CORE),
        S('Slow strength', ['legsBw2', 'pushBw2', 'pullBw'], LIFT),
        F('Yin', ['ygYinSpine', 'ygYinSpine', 'ygYinHips'], YIN)] },
    },
  },
  {
    id: 'slow-supersets', added: 14, catalogue: 8, name: 'Slow Supersets', subject: 'Calm strength', minutes: [30, 35], levers: [null, 'tempo', 'reps'], absSlots: [],
    gear: 'A pair of dumbbells or a kettlebell, and a mat.',
    split: 'Pilates & slow supersets A / B', blurb: 'A Pilates series, then dumbbell supersets with a slow lowering: calm, controlled strength.',
    about: 'Calm strength with a Pilates start. A short mat series of the hundred, the abs series and a roll-down opens each session, then dumbbell or kettlebell supersets done slowly and deliberately. Two days alternate upper and lower emphasis. Level II adds a three-second lowering to every rep and Level III adds reps on top. No separate abs finisher.',
    names: ['Measured', 'Deliberate', 'Unhurried Lift', 'Careful', 'Precise', 'Considered', 'Thoughtful', 'Patient Lift', 'Calm Hands', 'Still Lift', 'Quiet Lift', 'Gentle Iron', 'Soft Iron', 'Calm Iron', 'Steady Iron'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Pilates & slow supersets A', short: 'A', blocks: [
        F('Pilates series', ['hundred', 'plAbs', 'plRoll'], PILATES),
        SS('Slow supersets', ['pushLoad2', 'row2', 'squat2', 'hinge2'], LIFT)] },
      b: { label: 'Pilates & slow supersets B', short: 'B', blocks: [
        F('Pilates series', ['hundred', 'plBack', 'plAbs'], PILATES),
        SS('Slow supersets', ['lunge2', 'row2', 'shoulders2', 'glute2'], LIFT)] },
    },
  },
  {
    id: 'evening-strength', added: 14, catalogue: 8, name: 'Evening Strength', subject: 'Calm strength', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'tempo'], absSlots: [],
    gear: 'One kettlebell and a mat.',
    split: 'Bell lower & yin / bell upper & yin', blurb: 'A calm evening session: a short Pilates start, one kettlebell lifted steadily, then yin.',
    about: 'A calm session for the evening with one kettlebell. A short Pilates series wakes the core, then steady kettlebell strength, lower body one day and upper body the next, then long yin holds to wind down before bed. Level II adds reps and Level III slows every rep down. Nothing fast and nothing loud.',
    names: ['After Hours', 'Nightcap', 'Evening Bell', 'Dusk Bell', 'Lamplit', 'Fireside', 'Hearthside', 'Late Bell', 'Moon Bell', 'Star Bell', 'Owl Bell', 'Bedtime Bell', 'Last Light', 'Sundown Bell', 'Night Bell'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Bell lower & yin', short: 'Lower', blocks: [
        F('Pilates', ['hundred', 'plAbs'], PILATES),
        S('Bell lower body', ['kbLower2', 'kbLower', 'kbLower2'], LIFT),
        F('Yin hips', ['ygYinHips', 'ygYinHips'], YIN)] },
      upper: { label: 'Bell upper & yin', short: 'Upper', blocks: [
        F('Pilates', ['hundred', 'plRoll'], PILATES),
        S('Bell upper body', ['kbUpper2', 'kbUpper', 'kbUpper2'], LIFT),
        F('Yin spine', ['ygYinSpine', 'ygYinSpine'], YIN)] },
    },
  },
  // ---------------- PHASE 16: VARIETY (every day is different: no day type and format twice) ----------------
  {
    id: 'every-day-different', added: 16, catalogue: 9, variety: true, name: 'Every Day Different', subject: 'Variety', minutes: [30, 36], levers: [null, 'reps', 'weight'],
    formats: LIFT_F, split: 'Every day different · everything', blurb: 'Sixty days and no two alike: strength, cardio, combat and core, each in a new format every time.',
    about: 'Sixty days and no two the same. Each day picks a kind of training, push, pull, legs, jumps, boxing, core and more, and a format, straight sets, supersets, a circuit, an EMOM, an AMRAP or a Tabata, and that pair never comes back. Strength days end with a short burst of cardio or a short core circuit; cardio and core days end with a short lift. The same kind of training never lands two days running. Level II adds reps and Level III asks for heavier weights.',
    names: ['Wild Card', 'Lucky Dip', 'Grab Bag', 'Mystery Box', 'Surprise', 'Plot Twist', 'Curveball', 'Joker', 'Dice Roll', 'Coin Toss', 'Spin the Wheel', 'Pick a Card', 'Shuffle', 'Deal Me In', 'Free Spin', 'Jackpot', 'Scratch Card', 'Raffle', 'Tombola', 'Lottery'],
    dayTypes: vtypes(['push', 'pull', 'legs', 'glutes', 'shoulders', 'arms', 'full', 'upper', 'hiit', 'plyo', 'box', 'run', 'core', 'balance'],
      { push: 'sweat', pull: 'core', legs: 'sweat', glutes: 'core', shoulders: 'sweat', arms: 'core', full: 'sweat', upper: 'core', hiit: 'lift', plyo: 'lift', box: 'lift', run: 'lift', core: 'lift', balance: 'lift' }),
  },
  {
    id: 'strength-roulette', added: 16, catalogue: 9, variety: true, name: 'Strength Roulette', subject: 'Variety', minutes: [24, 30], levers: [null, 'weight', 'reps'],
    formats: LIFT_F, split: 'Every day different · strength only', blurb: 'Strength every day, never the same twice: a new body part and a new format each time.',
    about: 'Strength every day, and never the same session twice. Each day deals a body part, chest, back, shoulders, arms, legs, glutes, full body, kettlebell and more, with a format: straight sets, supersets, a circuit, an EMOM or an AMRAP. Sixty days, sixty different pairs, and the same body part never two days running. Abs finish every session. Level II asks for heavier weights and Level III adds reps.',
    names: ['Roulette', 'Red or Black', 'Spin', 'Croupier', 'House Edge', 'Double Zero', 'Even Money', 'Straight Up', 'Split Bet', 'Corner Bet', 'Column', 'Dozen', 'High Roller', 'Chip Stack', 'Wheel Spin', 'Ball Drop', 'Pocket', 'Table Limit', 'All on Red', 'Cash Out'],
    dayTypes: vtypes(['push', 'pull', 'legs', 'glutes', 'chest', 'back', 'shoulders', 'arms', 'upper', 'lower', 'full', 'kb']),
  },
  {
    id: 'sweat-shuffle', added: 16, catalogue: 9, variety: true, name: 'Sweat Shuffle', subject: 'Variety', minutes: [23, 29], levers: [null, 'reps', 'variation'],
    formats: SWEAT5_F, split: 'Every day different · cardio & combat', blurb: 'Cardio every day in a new shape: HIIT, jumps, boxing, sprints and footwork, never the same pair twice.',
    about: 'Cardio and combat every day, always in a new shape. Each day deals one of twelve kinds of conditioning, HIIT, jumps, boxing, kickboxing, running drills, court moves, sprints, footwork and more, with a format: a circuit, an EMOM, an AMRAP, a Tabata or straight sets. Sixty days, no pair twice, and never the same kind two days running. Abs finish every session. Level II adds reps and Level III brings harder moves.',
    names: ['Shuffle Step', 'Mixer', 'Blender', 'Smoothie', 'Cocktail', 'Mash-up', 'Remix', 'Medley Mix', 'Playlist', 'Shuffle Play', 'B-Side', 'Encore', 'Mixtape', 'Bassline', 'Drop', 'Breakdown', 'Build-up', 'Crescendo', 'Fade Out', 'Last Track'],
    dayTypes: vtypes(['hiit', 'plyo', 'box', 'kick', 'run', 'court', 'sprint', 'power', 'cond', 'bwCond', 'footwork', 'jumps', 'kbCardio', 'clinch', 'skips']),
  },
  {
    id: 'mind-body-mix', added: 16, catalogue: 9, variety: true, name: 'Mind & Body Mix', subject: 'Variety', minutes: [22, 28], levers: [null, 'reps', 'holds'],
    formats: CORE_F, absSlots: [], split: 'Every day different · core, balance & mobility', blurb: 'Core, balance, Pilates, mobility and yoga strength, a new pairing every day, ending with a stretch.',
    about: 'The calmer side of training, never the same twice. Each day deals one of twelve kinds of work, core, balance, mobility, Pilates, yoga strength, back care, hips, posture and more, with a format: straight sets, supersets, a circuit, an EMOM or a Tabata. Every day ends with a short stretch. Sixty days, no pair twice. Level II adds reps and Level III makes every hold longer.',
    names: ['Still Water', 'Lotus Pond', 'Zen Garden', 'Bamboo', 'Willow', 'Cherry Blossom', 'Moss Garden', 'Raked Sand', 'Stepping Stones', 'Koi', 'Lantern Light', 'Tea House', 'Paper Screen', 'Bonsai', 'Mountain Mist', 'Morning Dew', 'Evening Calm', 'Moonrise', 'Quiet Hour', 'Deep Breath'],
    dayTypes: vtypes(['core', 'balance', 'mobility', 'pilates', 'yogaStrength', 'backCare', 'gentle', 'hips', 'posture', 'pilatesSide', 'hollow', 'balanceCore', 'sideCore'],
      every(['core', 'balance', 'mobility', 'pilates', 'yogaStrength', 'backCare', 'gentle', 'hips', 'posture', 'pilatesSide', 'hollow', 'balanceCore', 'sideCore'], 'flow')),
  },
  {
    id: 'bodyweight-shuffle', added: 16, catalogue: 9, variety: true, name: 'Bodyweight Shuffle', subject: 'Variety', minutes: [24, 30], equip: 'bw', levers: [null, 'reps', 'tempo'],
    formats: LIFT_F, split: 'Every day different · no equipment', blurb: 'No equipment and no repeats: push-ups, floor pulls, legs, jumps and boxing, a new pairing every day.',
    about: 'No equipment, and no two days alike. Each day deals a kind of training you can do on the floor, push-ups, floor pulls, legs, glutes, shoulders, arms, HIIT, jumps, boxing, kickboxing, running drills and core, with a format to match. Sixty days, no pair twice, never the same kind two days running. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Living Room', 'Hotel Floor', 'Park Bench', 'Back Garden', 'Balcony', 'Rooftop', 'Hallway Hustle', 'Kitchen Floor', 'Bedside', 'Campsite', 'Beach Towel', 'Picnic Rug', 'Yoga Mat', 'Office Floor', 'Dorm Room', 'Studio Flat', 'Spare Room', 'Garage', 'Porch', 'Patio'],
    dayTypes: vtypes(['pushBw', 'pullBw', 'legsBw', 'glutesBw', 'fullBw', 'shouldersBw', 'armsBw', 'hiit', 'plyo', 'box', 'kick', 'run', 'core', 'balance']),
  },
  {
    id: 'kettlebell-roulette', added: 16, catalogue: 9, variety: true, name: 'Kettlebell Roulette', subject: 'Variety', minutes: [24, 30], equip: 'kb', levers: [null, 'reps', 'weight'],
    formats: LIFT_F, split: 'Every day different · one kettlebell', blurb: 'One kettlebell and no repeats: complexes, swings, presses, rows and core, a new pairing every day.',
    about: 'One kettlebell, sixty different days. Each day deals a kind of bell work, complexes, swings, legs, presses, rows, hips, core, grip and more, with a format: straight sets, supersets, a circuit, an EMOM or an AMRAP, plus a couple of cardio days. No pair comes back, and the same kind never lands two days running. Abs finish every session. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Roulette', 'Iron Wheel', 'Bell Spin', 'Bell Toss', 'Lucky Bell', 'Bell Draw', 'Bell Deal', 'Bell Bet', 'Bell Odds', 'Bell Chance', 'Bell Luck', 'Bell Fortune', 'Bell Gamble', 'Bell Wager', 'Bell Stake', 'Bell Pot', 'Bell Ante', 'Bell Raise', 'Bell Call', 'Bell Fold'],
    dayTypes: vtypes(['kb', 'kbCx', 'kbLegs', 'kbPress', 'kbPull', 'kbHips', 'kbCore', 'kbFull', 'kbGrip', 'kbSwing', 'kbCardio', 'box', 'core']),
  },
  {
    id: 'short-variety', added: 16, catalogue: 9, variety: true, name: 'Short Variety', subject: 'Variety', minutes: [15, 22], levers: [null, 'reps', 'reps'],
    formats: SHORT_F, split: 'Every day different · 15–22 minutes', blurb: 'About twenty minutes, never the same twice: a quick circuit, EMOM, AMRAP or Tabata every day.',
    about: 'Short sessions that never repeat. Each day deals one of fifteen kinds of training, strength, cardio and core, in a timed format: a circuit, an EMOM, an AMRAP or a Tabata. Fifteen to twenty-two minutes, sixty different days, and never the same kind two days running. Abs finish every session. Both later levels add reps.',
    names: ['Quickie', 'Express', 'Pit Stop', 'Flash', 'Blitz', 'Sprint Session', 'Snack', 'Espresso', 'Shot', 'Quick Fix', 'Fast Lane', 'Short Cut', 'Speed Round', 'Lightning', 'Zip', 'Dash', 'Rush', 'Whirlwind', 'Snap', 'In and Out'],
    dayTypes: vtypes(['push', 'pull', 'legs', 'glutes', 'shoulders', 'arms', 'full', 'kb', 'hiit', 'plyo', 'sprint', 'run', 'core', 'balance', 'pilates'], {}, SHORT_F),
  },
  {
    id: 'muscle-tour', added: 16, catalogue: 9, variety: true, name: 'Muscle Tour', subject: 'Variety', minutes: [26, 32], levers: [null, 'weight', 'tempo'],
    formats: LIFT_F, split: 'Every day different · one muscle group a day', blurb: 'A tour of the body: chest, back, shoulders, arms, hips, calves, neck and more, a new pairing every day.',
    about: 'A tour of every muscle group, one a day, never the same way twice. Chest, back, shoulders, arms, hips and inner thighs, calves and shins, neck and traps, legs, glutes, forearms, upper back and core each get their days, each time in a different format. Neck days stay calm, in sets, supersets or circuits only. Abs finish every session. Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Grand Tour', 'Road Trip', 'Itinerary', 'Passport', 'Stamp', 'Boarding Pass', 'Layover', 'Departure', 'Arrival', 'Landmark', 'Sightseeing', 'Guidebook', 'Postcard', 'Souvenir', 'Map Pin', 'Compass Rose', 'Waypoint', 'Detour', 'Scenic Route', 'Homecoming'],
    dayTypes: vtypes(['chest', 'back', 'shoulders', 'arms', 'glutes', 'calves', 'neck', 'legs', 'lower', 'forearms', 'upperBack', 'core', 'singleLeg']),
  },
  {
    id: 'fighter-variety', added: 16, catalogue: 9, variety: true, name: 'Fighter Variety', subject: 'Variety', minutes: [24, 30], levers: [null, 'reps', 'variation'],
    formats: LIFT_F, split: 'Every day different · strike & strength', blurb: 'Fight training that never repeats: punches, kicks, clinch, defence and fighter strength in new formats daily.',
    about: 'Training like a fighter, never the same day twice. Combat days deal jabs and crosses, power punches, kicks, combinations, clinch knees, defence or body shots; strength days deal fighter push, pull, legs, core, single-leg work, the upper back or a gentle neck day. Each comes in a different format every time. Abs finish every session. Level II adds reps and Level III brings longer combinations and harder moves.',
    names: ['Southpaw', 'Orthodox', 'Switch Hit', 'Counter', 'Feint', 'Parry', 'Slip', 'Weave', 'Uppercut', 'Haymaker', 'Liver Shot', 'Teep Kick', 'Low Kick', 'Spinning Back', 'Clinch Up', 'Ring Craft', 'Corner Man', 'Bell to Bell', 'Twelve Rounds', 'Title Fight'],
    dayTypes: vtypes(['jabs', 'punches', 'kicks', 'combos', 'clinch', 'defence', 'bodyShots', 'kickCore', 'fightPush', 'fightPull', 'fightLegs', 'fightCore', 'neck', 'power', 'box', 'singleLeg', 'upperBack']),
  },
  {
    id: 'athlete-variety', added: 16, catalogue: 9, variety: true, name: 'Athlete Variety', subject: 'Variety', minutes: [24, 30], levers: [null, 'reps', 'weight'],
    formats: LIFT_F, split: 'Every day different · speed & strength', blurb: 'Sport-ready training that never repeats: sprints, jumps, court moves and athletic strength in new formats daily.',
    about: 'Athletic training, never the same day twice. Speed days deal running drills, court moves, vertical and lateral jumps, upper-body power or sprints; strength days deal legs, glutes, single-leg work, pulls, pushes, full body or the back of the body; one kind is balance. Each comes in a different format every time. Abs finish every session. Level II adds reps and Level III asks for heavier weights.',
    names: ['Kick-off', 'Tip-off', 'Face-off', 'First Serve', 'Starting Blocks', 'Pole Vault', 'High Jump', 'Long Jump', 'Triple Jump', 'Hurdles', 'Relay Leg', 'Anchor Leg', 'Breakaway', 'Fast Break', 'Counterattack', 'Overtime Legs', 'Extra Time', 'Penalty Box', 'Final Quarter', 'Full Time'],
    dayTypes: vtypes(['run', 'court', 'plyo', 'power', 'sprint', 'jumps', 'legs', 'glutes', 'singleLeg', 'pull', 'push', 'full', 'posterior', 'balance']),
  },
  {
    id: 'variety-30', added: 16, catalogue: 9, days: 30, variety: true, name: 'Variety 30', subject: 'Variety', minutes: [30, 36], levers: [null, 'weight', 'reps'],
    formats: ['straight', 'superset', 'circuit', 'emom'], split: 'Every day different · 30 days, two families a day', blurb: 'A month with no repeats: every day a new pairing, strength with cardio or a stretch, cardio with strength.',
    about: 'A month where no day repeats and every day mixes two kinds of training. A strength day ends with a short Tabata of cardio or a stretch; a cardio day ends with a short lift. The main work changes kind and format every day: straight sets, supersets, circuits or EMOMs. Every ten days the level steps up: heavier weights at Level II, more reps at Level III.',
    names: ['Thirty Ways', 'Month of Sundays', 'Calendar', 'Advent', 'Countdown Month', 'Day Planner', 'Diary', 'Almanac', 'Moon Cycle', 'Full Moon', 'Half Moon', 'New Moon', 'Waxing', 'Waning', 'Crescent', 'Gibbous', 'Equinox', 'Solstice', 'Season', 'Harvest'],
    dayTypes: vtypes(['push', 'pull', 'legs', 'glutes', 'shoulders', 'full', 'hiit', 'plyo'],
      { push: 'sweat', pull: 'sweat', legs: 'flow', glutes: 'sweat', shoulders: 'flow', full: 'sweat', hiit: 'lift', plyo: 'lift' },
      ['straight', 'superset', 'circuit', 'emom']), // no AMRAP: too short with a stretch after it
  },
  {
    id: 'bodyweight-variety-30', added: 16, catalogue: 9, days: 30, variety: true, name: 'Bodyweight Variety 30', subject: 'Variety', minutes: [26, 32], equip: 'bw', levers: [null, 'reps', 'holds'],
    formats: LIFT_F, split: 'Every day different · 30 days, no equipment', blurb: 'A month on the floor with no repeats: bodyweight strength with a burst of cardio or a stretch, every day new.',
    about: 'A month with no equipment and no repeats. Every day mixes two kinds of training: bodyweight strength with a short Tabata or a stretch, or jumps and HIIT with a short bodyweight lift. The main work changes kind and format every day. Every ten days the level steps up: more reps at Level II, longer holds at Level III. Good for travel or a month away from your gear.',
    names: ['Floor Month', 'Mat Month', 'Rug Month', 'Room Thirty', 'Body Month', 'Bare Hands', 'No Kit', 'Travel Light', 'Carry-on', 'Backpacker', 'Nomad', 'Wanderer', 'Drifter', 'Rover', 'Vagabond', 'Pilgrim', 'Voyager', 'Explorer', 'Trekker', 'Globetrotter'],
    dayTypes: vtypes(['pushBw', 'pullBw', 'legsBw', 'glutesBw', 'shouldersBw', 'plyo', 'hiit'],
      { pushBw: 'sweatBw', pullBw: 'flow', legsBw: 'sweatBw', glutesBw: 'flow', shouldersBw: 'sweatBw', plyo: 'liftBw', hiit: 'liftBw' }),
  },
  {
    id: 'core-roulette', added: 16, catalogue: 9, variety: true, name: 'Core Roulette', subject: 'Variety', minutes: [18, 24], levers: [null, 'reps', 'variation'],
    formats: CORE_F, absSlots: [], split: 'Every day different · core only', blurb: 'Core every day, never the same twice: brace, rotate, hollow, Pilates, weighted and balance core in new formats.',
    about: 'Core every day, and never the same session twice. Each day deals one of twelve kinds of core work, bracing, rotation, hollow holds, Pilates rolls, side planks, weighted core, back and core, balance and core, kettlebell core and more, with a format: straight sets, supersets, a circuit, an EMOM or a Tabata. The whole session is core, so there is no extra abs finisher. Level II adds reps and Level III brings harder moves.',
    names: ['Six Pack', 'Washboard', 'Midsection', 'Centre Line', 'Core Value', 'Torso', 'Trunk Line', 'Belly Button', 'Waistline', 'Corset', 'Girdle', 'Cummerbund', 'Belt Line', 'Obi', 'Sash', 'Brace Up', 'Tighten', 'Cinch', 'Hollow', 'Plank Line'],
    dayTypes: vtypes(['core', 'hollow', 'sideCore', 'rolls', 'weighted', 'backCore', 'balanceCore', 'bellCore', 'pilates', 'pilatesSide', 'yogaStrength', 'balance']),
  },
  {
    id: 'long-variety', added: 16, catalogue: 9, variety: true, name: 'Long Variety', subject: 'Variety', minutes: [38, 44], levers: [null, 'weight', 'weight'],
    formats: ['straight', 'superset', 'circuit', 'emom'], split: 'Every day different · 40 minutes, lift & finish', blurb: 'Forty minutes, no repeats: a big strength block in a new format every day, then a cardio or core finisher.',
    about: 'Longer sessions that never repeat. Each day deals a body part and a format for a big strength block, straight sets, supersets, a circuit or an EMOM, then finishes with a short Tabata of cardio or a core circuit. About forty minutes, sixty different days, and never the same body part two days running. Abs finish every session. Both later levels ask for heavier weights, so this one is for building strength over two months.',
    names: ['Long Haul', 'Marathon', 'Distance', 'Endurance', 'Stamina', 'Staying Power', 'Second Half', 'Long Game', 'Deep End', 'Full Session', 'Double Shift', 'Overtime Session', 'Long Road', 'Slow Burn', 'Extended Play', 'Director\'s Cut', 'Box Set', 'Feature Length', 'Epic', 'Saga'],
    dayTypes: vtypes(['push', 'pull', 'legs', 'glutes', 'chest', 'back', 'shoulders', 'arms', 'upper', 'lower', 'full', 'kb', 'calves', 'singleLeg', 'posterior', 'forearms'],
      { push: 'sweat', pull: 'core', legs: 'sweat', glutes: 'core', chest: 'sweat', back: 'core', shoulders: 'sweat', arms: 'core', upper: 'sweat', lower: 'core', full: 'sweat', kb: 'core', calves: 'sweat', singleLeg: 'core', posterior: 'sweat', forearms: 'core' },
      ['straight', 'superset', 'circuit', 'emom']), // no AMRAP: fifteen minutes at most, too short for a long day
  },
  {
    id: 'upper-roulette', added: 16, catalogue: 9, variety: true, name: 'Upper Body Roulette', subject: 'Variety', minutes: [24, 30], levers: [null, 'reps', 'tempo'],
    formats: LIFT_F, split: 'Every day different · upper body only', blurb: 'Upper body every day, never the same twice: chest, back, shoulders, arms, grip and more in new formats.',
    about: 'The upper body every day, never the same session twice. Each day deals chest, back, shoulders, arms, push, pull, upper back, forearms, bodyweight push-ups or floor pulls, a kettlebell press or a gentle neck-and-traps day, each in a different format. The same kind never lands two days running, and neck days stay calm. Abs finish every session. Level II adds reps and Level III slows every rep down.',
    names: ['Top Half', 'Upper Deck', 'Top Floor', 'Penthouse', 'Upper Circle', 'Gallery', 'Balcony Seat', 'Crow\'s Nest Top', 'High Shelf', 'Top Drawer', 'Upper Crust', 'Skyline', 'Cloud Nine', 'Overhead Bin', 'Loft', 'Mansard', 'Top Tier', 'Upper Hand', 'High Table', 'Summit Day'],
    dayTypes: vtypes(['chest', 'back', 'shoulders', 'arms', 'push', 'pull', 'upperBack', 'forearms', 'pushBw', 'pullBw', 'kbPress', 'neck', 'shouldersBw']),
  },
  // ---------------- PHASE 16: AFTER-DARK (Noam's: looks, stamina and positions; every main block tagged with its family) ----------------
  // Beach body: the look (chest, shoulders, arms, abs, glutes), lean from a cardio finisher; Bedroom stamina: hip drive,
  // endurance and control; Sex positions: the hip, adductor, hamstring and back range positions need, and the strength to hold them.
  // ---- Beach body ----
  {
    id: 'beach-body', added: 16, catalogue: 9, name: 'Beach Body', subject: 'Beach body', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Upper & burn / glutes & abs', blurb: 'Chest, shoulders and arms one day, ass and abs the next, a burn after each so you look ready to fuck.',
    about: 'For the body you want seen naked, cock out or ass up. One day is chest, shoulders and arms in straight sets, then a short Tabata to burn; the other is glutes and abs, then the same. The muscles that show get the volume, and the cardio keeps you lean. Level II asks for heavier weights and Level III adds reps.',
    names: ['Sunscreen', 'Lifeguard', 'Speedo', 'Sandbar', 'Tan Lines', 'Beach Towel Flex', 'Riviera', 'Ibiza', 'Malibu', 'Bondi', 'Copacabana', 'Mykonos', 'Cabo', 'Miami Vice', 'Pool Party', 'Cabana', 'Sun Lounger', 'Oiled Up', 'Golden Hour Glow', 'Last Swim'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & burn', short: 'Upper', blocks: [S('Chest, shoulders & arms', ['chestPress', 'shoulderRaise', 'biceps2', 'triceps2', 'chestBw?'], LIFT), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
      lower: { label: 'Glutes & abs', short: 'Glutes', blocks: [S('Glutes & abs', ['thrust', 'glute2', 'coreAnti', 'coreHollow', 'hipGlute?'], LIFT), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
    },
  },
  {
    id: 'v-taper', added: 16, catalogue: 9, name: 'V-Taper', subject: 'Beach body', minutes: [28, 33], levers: [null, 'reps', 'tempo'],
    split: 'Wide back & shoulders / waist & legs', blurb: 'Lats and side shoulders for width, a smaller waist from core work: the V she grabs while you fuck.',
    about: 'The V: wide shoulders and lats over a waist narrow enough to grab while you fuck. One day pairs pull-ups and rows with lateral raises in supersets for width. The other works the waist with anti-rotation core and the legs so nothing looks skipped, then a short cardio circuit. Level II adds reps and Level III slows every rep down.',
    names: ['Wingspan', 'Cobra Hood', 'Delta Wing', 'Stingray Back', 'Hourglass', 'Wasp Waist', 'Coat Hanger', 'Arrowhead', 'Kite Shape', 'Swimmer', 'Diver', 'Rower', 'Paddler', 'Butterfly Stroke', 'Lat Spread', 'Front Double', 'Back Double', 'Vacuum', 'Stage Ready', 'Spotlight'],
    cycle: ['wide', 'waist'],
    dayTypes: {
      wide: { label: 'Wide back & shoulders', short: 'Wide', blocks: [SS('Width supersets', ['backBar', 'shoulderRaise', 'backRow', 'shoulderRaise', 'backRear', 'shoulderPress'], LIFT), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
      waist: { label: 'Waist & legs', short: 'Waist', blocks: [S('Legs', ['squat2', 'hinge2', 'lunge2?'], LIFT), C('Waist circuit', ['coreAnti', 'coreRot', 'hiit'], { ...CORE, values: [2, 3] })] },
    },
  },
  {
    id: 'booty-call', added: 16, catalogue: 9, name: 'Booty Call', subject: 'Beach body', minutes: [28, 33], levers: [null, 'weight', 'tempo'],
    split: 'Glutes heavy / glutes pump / upper & abs', blurb: 'A rounder ass to grab and fuck: heavy hip thrusts and hinges, a pump day, then upper body and abs.',
    about: 'All about the ass you want clapped, grabbed and fucked. One day is heavy: hip thrusts, Romanian deadlifts and lunges with full rests. The next is a pump: bridges, frog pumps, clamshells and pulses in a circuit. The third trains the upper body and abs so the whole picture works. Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Peach', 'Bubble', 'Badonkadonk', 'Junk in the Trunk', 'Back That Up', 'Baby Got Back', 'Shake It', 'Twerk Ready', 'Cheeky', 'Bum Day', 'Rear View', 'Caboose', 'Bottoms Up', 'Booty Shorts', 'Squat Booty', 'Glute Gains', 'Round Two Cheeks', 'Seat of Power', 'Derriere', 'Behind Closed Doors'],
    cycle: ['heavy', 'pump', 'upper'],
    dayTypes: {
      heavy: { label: 'Glutes heavy', short: 'Heavy', blocks: [S('Heavy glutes', ['hip_thrust', 'hinge2', 'lunge2?', 'thrust?'], LIFT), C('Abs', ['coreHollow', 'coreRot'], { ...CORE, values: [2] })] },
      pump: { label: 'Glutes pump', short: 'Pump', blocks: [C('Glute pump', ['thrust', 'hipGlute', 'adductor', 'thrust', 'hipGlute?'], { ...LIFT, values: [2, 3, 4] }), C('Abs', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      upper: { label: 'Upper & abs', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderRaise'], LIFT), C('Abs', ['coreHollow', 'coreRot'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'abs-out', added: 16, catalogue: 9, name: 'Abs Out', subject: 'Beach body', minutes: [24, 29], levers: [null, 'reps', 'variation'],
    split: 'Abs & HIIT / obliques & HIIT', blurb: 'Abs she can lick down to your cock: core every day, then HIIT to strip the fat over them.',
    about: 'A six-pack she wants her tongue on takes strong abs and a thin layer of fat, so every day does both. One day trains the front of the abs with hollow holds, crunches and leg raises; the other the obliques with twists and side planks. A HIIT block follows each, hard enough to sweat. Level II adds reps and Level III brings harder moves.',
    names: ['Six Pack', 'Washboard', 'Shredded', 'Cut', 'Ripped', 'Chiselled', 'Etched', 'Carved', 'Sculpted', 'Grated Cheese', 'Ab Crack', 'V-Line', 'Adonis Belt', 'Sex Lines', 'Obliques Out', 'Ab Flash', 'Crop Top', 'Lift the Shirt', 'Show Off', 'Abs for Days'],
    cycle: ['front', 'side'],
    dayTypes: {
      front: { label: 'Abs & HIIT', short: 'Abs', absSlots: [], blocks: [C('Abs', ['coreHollow', 'absW', 'coreAnti', 'coreHollow'], { ...CORE, values: [3, 4] }), T('HIIT', ['hiit', 'hiit', 'cardio', 'hiit'], CARDIO)] },
      side: { label: 'Obliques & HIIT', short: 'Obliques', absSlots: [], blocks: [C('Obliques', ['coreRot', 'side_plank', 'coreRot', 'absW'], { ...CORE, values: [3, 4] }), T('HIIT', ['hiit', 'cardio', 'hiit', 'cardio'], CARDIO)] },
    },
  },
  {
    id: 'gun-show-tonight', added: 16, catalogue: 9, name: 'Gun Show Tonight', subject: 'Beach body', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Arms & chest / arms & shoulders', blurb: 'Arms that look obscene in a tight shirt: biceps and triceps every day, chest or shoulders, then a pump.',
    about: 'For arms that look filthy holding her up or pinning her down. Every day is biceps and triceps in supersets, paired with the chest one day and the shoulders the next, then a short AMRAP of push-ups and HIIT for the pump and a sweat. Plenty of reps, moderate weights and short rests. Level II adds reps and Level III asks for heavier dumbbells.',
    names: ['Sleeve Buster', 'Tickets Please', 'Show Time', 'Front Row', 'Flex Friday', 'Pythons Out', 'Bicep Kiss', 'Arm Day Date', 'Tight Tee', 'Muscle Shirt', 'Tank Season', 'Rolled Sleeves', 'Peak Show', 'Curl Up', 'Pump Cover', 'Vein Train', 'Swole Patrol', 'Big Guns', 'Loaded', 'Encore Arms'],
    cycle: ['chest', 'delts'],
    dayTypes: {
      chest: { label: 'Arms & chest', short: 'Chest', blocks: [SS('Arms & chest', ['biceps2', 'triceps2', 'biceps2', 'chestPress'], LIFT), A('Pump', ['chestBw', 'hiit'], { ...COND, values: [4, 5, 6] })] },
      delts: { label: 'Arms & shoulders', short: 'Shoulders', blocks: [SS('Arms & shoulders', ['triceps2', 'biceps2', 'triceps2', 'shoulderRaise'], LIFT), A('Pump', ['armsBw', 'hiit'], { ...COND, values: [4, 5, 6] })] },
    },
  },
  {
    id: 'shirt-off', added: 16, catalogue: 9, name: 'Shirt Off', subject: 'Beach body', minutes: [28, 33], equip: 'bw', levers: [null, 'reps', 'holds'],
    split: 'Push & abs / pull & legs', blurb: 'Shirt off, no equipment: push-up and floor-pull circuits, abs and legs, a burn so you stay fuckable.',
    about: 'The body you fuck in, with no gym. One day is a circuit of push-up variations, pike push-ups and abs; the other is floor pulls, legs and glutes. A short Tabata finishes both so you stay lean. Everything happens on the floor, so it travels well. Level II adds reps and Level III makes every hold longer.',
    names: ['No Shirt', 'Shirtless', 'Bare Chest', 'Skin Deep', 'Body Heat', 'Sweat Glow', 'Hot Room', 'Steam', 'Flushed', 'Heat Wave', 'Summer Body', 'Hot Stuff', 'Sizzle', 'Simmer', 'Slow Burn Body', 'Afterglow', 'Fire Starter', 'Spark', 'Kindle', 'Ember'],
    cycle: ['push', 'pull'],
    dayTypes: {
      push: { label: 'Push & abs', short: 'Push', blocks: [C('Push & abs', ['chestBw', 'shoulderBw', 'coreHollow', 'chestBw', 'coreAnti?'], { ...LIFT, values: [3, 4, 5] }), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
      pull: { label: 'Pull & legs', short: 'Pull', blocks: [C('Pull & legs', ['backBw', 'legsBw2', 'thrustBw', 'backBw', 'legsBw2?'], { ...LIFT, values: [3, 4, 5] }), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
    },
  },
  {
    id: 'bikini-ready', added: 16, catalogue: 9, name: 'Bikini Ready', subject: 'Beach body', minutes: [28, 33], levers: [null, 'reps', 'weight'],
    split: 'Glutes & shoulders / abs & legs / burn & stretch', blurb: 'Shoulders, ass and abs that look good in nothing: lifts, a burn, and a stretch before you get naked.',
    about: 'For what shows in a bikini or trunks when they come off: toned shoulders, a round ass and a flat stomach. One day pairs glute work with shoulder raises; the next is abs and legs; the third is a HIIT circuit with a long stretch after it. Level II adds reps and Level III asks for heavier weights.',
    names: ['String Bikini', 'Triangle Top', 'High Cut', 'Thong Season', 'Trunks', 'Sarong', 'Kaftan', 'Sun Hat', 'Flip Flops', 'Beach Bag', 'Shades', 'Poolside', 'Swim-up Bar', 'Piña Colada', 'Mojito', 'Daiquiri', 'Margarita', 'Aperol', 'Sundowner', 'Skinny Dip'],
    cycle: ['glutes', 'abs', 'burn'],
    dayTypes: {
      glutes: { label: 'Glutes & shoulders', short: 'Glutes', blocks: [SS('Glutes & shoulders', ['thrust', 'shoulderRaise', 'glute2', 'shoulderRaise', 'hipGlute', 'shoulderPress'], LIFT), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
      abs: { label: 'Abs & legs', short: 'Abs', blocks: [S('Legs', ['squat2', 'lunge2', 'adductor'], LIFT), C('Abs', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [2, 3] })] },
      burn: { label: 'Burn & stretch', short: 'Burn', absSlots: [], blocks: [C('HIIT', ['hiit', 'cardio', 'hiit', 'thrustBw'], CARDIO), F('Stretch', ['ygHips', 'fxHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'thirst-trap', added: 16, catalogue: 9, name: 'Thirst Trap', subject: 'Beach body', minutes: [26, 31], levers: [null, 'reps', 'reps'],
    split: 'Pump upper / pump lower', blurb: 'High-rep pump supersets, upper then lower, so you look full and tight in the hours before you fuck.',
    about: 'A pump so you look full and tight when the clothes come off to fuck. Every day is supersets with short rests and plenty of reps, the upper body one day and glutes and legs the next, then an EMOM of abs. Blood fills the muscles and they look their best for a few hours, good before a night out, or a photo. Both later levels add reps.',
    names: ['Mirror Selfie', 'Gym Pic', 'Golden Light', 'Filter Free', 'Angles', 'Good Side', 'Thirst', 'Swipe Right', 'Super Like', 'Its a Match', 'DM Slide', 'Story Post', 'Close Friends', 'Link in Bio', 'Hashtag', 'Viral', 'Likes', 'Followers', 'Notifications On', 'Read Receipts'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Pump upper', short: 'Upper', blocks: [SS('Upper pump', ['chestPress', 'backRow', 'shoulderRaise', 'biceps2', 'triceps2', 'chestIso'], LIFT), E('Abs', ['coreHollow', 'coreRot'], { ...CORE, values: [4, 6] })] },
      lower: { label: 'Pump lower', short: 'Lower', blocks: [SS('Lower pump', ['thrust', 'posLegs', 'hipGlute', 'calf', 'adductor', 'glute2'], LIFT), E('Abs', ['coreAnti', 'coreHollow'], { ...CORE, values: [4, 6] })] },
    },
  },
  {
    id: 'beach-body-30', added: 16, catalogue: 9, days: 30, name: 'Beach Body 30', subject: 'Beach body', minutes: [30, 35], levers: [null, 'weight', 'tempo'],
    split: 'Lift & burn / lift & stretch, 30 days', blurb: 'Thirty days to get naked on holiday: the muscles that show, a burn or a stretch after every lift.',
    about: 'A month before the holiday, for a body you want fucked in the sun. Every day lifts the muscles that show, chest and arms, shoulders and back, or glutes and legs, then either burns with a short Tabata or stretches with a short flow. Every ten days the level steps up: heavier weights at Level II and slower reps at Level III. Abs finish the burn days.',
    names: ['Countdown', 'Booked', 'Passport Ready', 'Packed', 'Departure Lounge', 'In Flight', 'Touchdown', 'Check-in', 'Room Key', 'Ocean View', 'First Dip', 'Day Bed', 'Snorkel', 'Jet Ski', 'Banana Boat', 'Beach Club', 'Sunset Drinks', 'Night Swim', 'Last Night', 'Home Tanned'],
    cycle: ['chest', 'back', 'glutes'],
    dayTypes: {
      chest: { label: 'Chest & arms, burn', short: 'Chest', blocks: [S('Chest & arms', ['chestPress', 'biceps2', 'triceps2', 'chestBw?'], LIFT), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
      back: { label: 'Shoulders & back, stretch', short: 'Back', absSlots: [], blocks: [S('Shoulders & back', ['shoulderPress', 'backRow', 'shoulderRaise', 'backBar?'], LIFT), F('Stretch', ['fxUpper', 'ygRest', 'ygRest?'], FLOW)] },
      glutes: { label: 'Glutes & legs, burn', short: 'Glutes', blocks: [S('Glutes & legs', ['thrust', 'posLegs', 'glute2', 'calf?'], LIFT), T('Burn', ['hiit', 'cardio'], { ...CARDIO, values: [1] })] },
    },
  },
  {
    id: 'naked-mirror-30', added: 16, catalogue: 9, days: 30, name: 'Naked in the Mirror 30', subject: 'Beach body', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Upper & HIIT / lower & core, 30 days', blurb: 'A month for the mirror after the shower: upper body and HIIT, then ass, legs and core.',
    about: 'A month for liking the naked body in the mirror after the shower, ass and all. One day lifts the upper body and finishes with an AMRAP of HIIT; the next lifts glutes and legs and finishes with a core circuit. Every day mixes strength with something else, and every ten days it gets harder: more reps at Level II, heavier weights at Level III.',
    names: ['Steamed Up', 'Towel Drop', 'Bathroom Light', 'Full Length', 'Reflection', 'Double Take', 'Second Look', 'Turn Around', 'Side View', 'Bare', 'Unwrapped', 'Au Naturel', 'Birthday Suit', 'Nothing On', 'Lights On', 'Candlelit', 'Silk Sheets', 'Robe Off', 'Strip Down', 'Bare All'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & HIIT', short: 'Upper', blocks: [S('Upper body', ['chestPress', 'backRow', 'shoulderRaise', 'arms?'], LIFT), A('HIIT', ['hiit', 'cardio'], { ...CARDIO, values: [5, 6, 7] })] },
      lower: { label: 'Lower & core', short: 'Lower', blocks: [S('Lower body', ['thrust', 'posLegs', 'hinge2', 'adductor?'], LIFT), C('Core', ['coreHollow', 'coreRot', 'coreAnti'], { ...CORE, values: [2, 3] })] },
    },
  },
  // ---- Bedroom stamina ----
  {
    id: 'all-night-long', added: 16, catalogue: 9, name: 'All Night Long', subject: 'Bedroom stamina', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Hip-drive circuit / stamina EMOM', blurb: 'Endurance to keep fucking: hip-drive circuits and long EMOMs that teach you to keep going.',
    about: 'Stamina for the long fuck. One day is a hip-drive circuit, bridges, swings, frog pumps and core, round after round with short rests. The other is a long EMOM that keeps the heart rate up without stopping. You learn to breathe, pace yourself and keep going when you want to quit. Both later levels add reps.',
    names: ['Midnight', 'One AM', 'Two AM', 'Three AM', 'Night Owl', 'Insomnia', 'Wide Awake', 'Lights Low', 'Do Not Disturb', 'Until Dawn', 'Sunrise Again', 'No Sleep', 'Encore', 'Again', 'One More Time', 'Keep Going', 'Don\'t Stop', 'Still Going', 'Endless', 'Marathon Man'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Hip-drive circuit', short: 'Circuit', blocks: [C('Hip drive', ['thrust', 'kbBallistic', 'thrust', 'coreAnti', 'hiit?'], { ...COND, values: [2, 3, 4, 5] }), C('Core', ['coreHollow', 'coreRot'], { ...CORE, values: [2] })] },
      emom: { label: 'Stamina EMOM', short: 'EMOM', blocks: [E('Stamina EMOM', ['thrust', 'cardio', 'posLegs', 'hiit'], { ...COND, values: [12, 14, 16, 18] }), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'your-ladys-favorite', added: 16, catalogue: 9, name: 'Your Lady\'s Favorite Fuck', subject: 'Bedroom stamina', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Thrust power / core & control / stretch & stamina', blurb: 'The fuck she asks for twice: hip thrusts and swings, core control, then a stamina circuit and a stretch.',
    about: 'Noam named this one. It builds what makes you better in bed: powerful hips, a strong core, endurance and the control to fuck her properly. One day is heavy hip thrusts, swings and bridge pulses for drive; the next is core and pelvic-floor control; the third is a stamina circuit with a long hip stretch after it. Level II asks for heavier weights and Level III adds reps.',
    names: ['Her Favorite', 'Repeat Customer', 'Five Stars', 'Rave Reviews', 'Tell Her Friends', 'Legend', 'Word of Mouth', 'Fan Favorite', 'Crowd Pleaser', 'Standing Ovation', 'Curtain Call', 'Bravo', 'Request Line', 'By Popular Demand', 'Main Event', 'Headliner', 'Top Billing', 'Signature Move', 'Hall of Fame', 'Lifetime Achievement'],
    cycle: ['thrust', 'core', 'stamina'],
    dayTypes: {
      thrust: { label: 'Thrust power', short: 'Thrust', blocks: [S('Thrust power', ['hip_thrust', 'kb_swing', 'bridge_pulse', 'thrust?'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      core: { label: 'Core & control', short: 'Core', blocks: [S('Hips', ['thrust', 'adductor', 'hipFlex'], LIFT), C('Core & control', ['coreHollow', 'pelvic', 'coreRot', 'pelvic_floor_hold'], { ...CORE, values: [2, 3] })] },
      stamina: { label: 'Stamina & stretch', short: 'Stamina', absSlots: [], blocks: [C('Stamina', ['thrust', 'hiit', 'kbBallistic', 'cardio'], { ...COND, values: [3, 4, 5] }), F('Hip stretch', ['fxHips', 'ygHips', 'fxStraddle', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'pound-town', added: 16, catalogue: 9, name: 'Pound Town', subject: 'Bedroom stamina', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Hip drive AMRAP / swings & thrusters', blurb: 'Fast, powerful hips for pounding: AMRAPs of bridge pulses and frog pumps, swings, thrusters and core.',
    about: 'Speed and power from the hips, so you can pound her and not slow down. One day is an AMRAP of bridge pulses, frog pumps and squats, as many rounds as you can; the other is kettlebell swings and thrusters in straight sets, with core after. Fast hip extension, repeated without slowing down, is the whole point. Level II adds reps and Level III asks for heavier weights.',
    names: ['Pound It', 'Drill Sergeant', 'Jackhammer', 'Piston', 'Pile Driver', 'Battering Ram', 'Sledge', 'Hammer Down', 'Full Throttle', 'Express Train', 'Bump and Grind', 'Rhythm Section', 'Drum Solo', 'Beat It', 'Pump Action Hips', 'Rapid Fire', 'Machine Gun', 'Turbo Hips', 'Overdrive Hips', 'Last Stop'],
    cycle: ['amrap', 'swing'],
    dayTypes: {
      amrap: { label: 'Hip drive AMRAP', short: 'AMRAP', blocks: [A('Hip drive', ['thrustBw', 'thrustBw', 'posLegs'], { ...COND, values: [10, 12, 15] }), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
      swing: { label: 'Swings & thrusters', short: 'Swings', blocks: [S('Swings & thrusters', ['kb_swing', 'db_thruster', 'kb_one_arm_swing', 'thrust?'], LIFT), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'round-two', added: 16, catalogue: 9, name: 'Round Two', subject: 'Bedroom stamina', minutes: [24, 29], levers: [null, 'reps', 'variation'],
    split: 'Intervals & recovery / Tabatas & core', blurb: 'Recover fast and fuck again: hard intervals with short rests, Tabatas and core.',
    about: 'Training how fast you recover, so round two is a real fuck and not a lie-down. One day is hard EMOM intervals, the next Tabatas, both with rests short enough that you start again before you feel ready. A core block follows each. Over sixty days your heart learns to settle quickly. Level II adds reps and Level III brings harder moves.',
    names: ['Ding Ding', 'Second Bell', 'Back for More', 'Seconds', 'Refill', 'Top Up', 'Reload', 'Recharge', 'Reboot', 'Restart', 'Second Wind', 'Revival', 'Comeback', 'Rematch', 'Sequel', 'Part Two', 'Return Visit', 'Again Please', 'Round Three', 'Overtime Round'],
    cycle: ['emom', 'tabata'],
    dayTypes: {
      emom: { label: 'Intervals & recovery', short: 'EMOM', blocks: [E('Intervals', ['hiit', 'thrustBw', 'cardio', 'posLegs'], { ...COND, values: [10, 12, 14, 16] }), C('Core', ['coreHollow', 'pelvic'], { ...CORE, values: [2] })] },
      tabata: { label: 'Tabatas & core', short: 'Tabata', blocks: [T('Tabatas', ['hiit', 'thrustBw', 'hiit', 'cardio'], COND), C('Core', ['coreAnti', 'coreRot'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'deep-stroke', added: 16, catalogue: 9, name: 'Deep Stroke', subject: 'Bedroom stamina', minutes: [26, 31], levers: [null, 'tempo', 'holds'],
    split: 'Slow hips / pelvic control & stretch', blurb: 'Slow control, cock deep on purpose: tempo hip work, pelvic-floor holds and core, then a deep hip stretch.',
    about: 'Control over speed, so you can stay deep and fuck her slowly. One day is slow-tempo hip work: hip thrusts, bridges and single-leg bridges with long pauses at the top. The other is pelvic-floor holds, core and a long, deep stretch for the hips and inner thighs. A strong, controllable pelvic floor helps with stamina and control for every body. Level II slows every rep down and Level III makes every hold longer.',
    names: ['Slow Hand', 'Easy Does It', 'Take Your Time', 'Savour', 'Linger', 'Lazy Sunday', 'Slow Dance', 'Smooth Operator', 'Velvet', 'Silk', 'Honey', 'Molasses', 'Treacle', 'Slow Jam', 'Quiet Storm', 'Late Night Jazz', 'Low Lights', 'Soft Focus', 'Deep End', 'Long Exhale'],
    cycle: ['slow', 'control'],
    dayTypes: {
      slow: { label: 'Slow hips', short: 'Slow', blocks: [S('Slow hips', ['hip_thrust', 'single_leg_bridge', 'thrust', 'bridge_hold'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      control: { label: 'Pelvic control & stretch', short: 'Control', absSlots: [], blocks: [C('Glute & pelvic holds', ['bridge_hold', 'pelvic_floor_hold', 'glute_bridge', 'pelvic_floor_hold'], LIFT), F('Deep hip stretch', ['fxHips', 'fxStraddle', 'ygHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'hold-me-up', added: 16, catalogue: 9, name: 'Hold Me Up', subject: 'Bedroom stamina', minutes: [28, 33], levers: [null, 'weight', 'holds'],
    split: 'Lift & carry / squat & hold', blurb: 'Strong enough to hold your partner up and keep fucking: deadlifts, carries, grip, squats and long holds.',
    about: 'For the positions where you take your partner\'s weight and keep fucking. One day is lifting and carrying: deadlifts, farmer carries, rows and grip holds. The other is squats, wall sits and other long holds that keep your legs steady under load. Strong legs, back and grip make it easy, not a strain. Level II asks for heavier weights and Level III makes every hold longer.',
    names: ['Pick Me Up', 'Up Against the Wall', 'Carry Me', 'Lift Off', 'Sweep Off Your Feet', 'Over the Threshold', 'Fireman\'s Lift', 'Piggyback', 'Koala', 'Wrapped Around', 'Legs Locked', 'Hold Tight', 'Don\'t Let Go', 'Steady Now', 'Strong Arms', 'Iron Legs', 'Pillar', 'Foundation', 'Rock Solid', 'Unshakeable'],
    cycle: ['carry', 'hold'],
    dayTypes: {
      carry: { label: 'Lift & carry', short: 'Carry', blocks: [S('Lift & carry', ['hinge2', 'farmer_carry', 'backRow', 'gripHold?'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      hold: { label: 'Squat & hold', short: 'Hold', blocks: [S('Squat & hold', ['squat2', 'posHold', 'posLegs', 'posHold?'], LIFT), E('Stamina', ['cardio', 'thrustBw'], { ...COND, values: [6, 8] })] },
    },
  },
  {
    id: 'marathon-session', added: 16, catalogue: 9, name: 'Marathon Session', subject: 'Bedroom stamina', minutes: [36, 42], levers: [null, 'reps', 'tempo'],
    split: 'Long circuit / long EMOM', blurb: 'About forty minutes so the night can be long: circuits and EMOMs of hips and core, built for lasting.',
    about: 'Long sessions for long nights of fucking. Each day is about forty minutes of steady work: a long circuit of hip drive, legs, push-ups and core one day, a long EMOM the next, with core to finish. Nothing is all-out; it is about lasting. Level II adds reps and Level III slows every rep down.',
    names: ['The Long Run', 'Distance', 'Endurance Night', 'Iron Man', 'Ultra', 'Long Haul Hips', 'Overnight', 'Red-eye', 'Night Shift', 'Graveyard Shift', 'Double Header', 'Extra Innings', 'Five Setter', 'Tie Break', 'Penalties', 'Sudden Death', 'Golden Goal', 'Last Man Standing', 'Survivor', 'Finisher'],
    cycle: ['circuit', 'emom'],
    dayTypes: {
      circuit: { label: 'Long circuit', short: 'Circuit', blocks: [C('Long circuit', ['thrust', 'posLegs', 'chestBw', 'kbBallistic', 'coreAnti'], { ...COND, values: [4, 5, 6] }), C('Core', ['coreHollow', 'pelvic'], { ...CORE, values: [2] })] },
      emom: { label: 'Long EMOM', short: 'EMOM', blocks: [E('Long EMOM', ['thrust', 'cardio', 'posLegs', 'chestBw', 'hiit'], { ...COND, values: [20, 25, 30] }), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'on-top', added: 16, catalogue: 9, name: 'On Top', subject: 'Bedroom stamina', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Quads & hips / pulses & holds / stretch', blurb: 'For riding on top of his cock: quads, inner thighs and hips that last, pulses, holds, then a hip stretch.',
    about: 'For the one on top, riding his cock. Riding asks for quads, inner thighs and hips that keep working for a long time, and a core that holds you up. One day is squats, sumo pulses and lunges; the next pulses, wall sits and bridge holds; the third a gentle circuit with a long hip stretch. Level II adds reps and Level III makes every hold longer.',
    names: ['Cowgirl', 'Rodeo', 'Saddle Up', 'Ride On', 'Giddy Up', 'Bareback', 'Bronco', 'Trot', 'Canter', 'Gallop', 'Rein In', 'Spurs', 'Stirrups', 'Bucking Bronco', 'Mechanical Bull', 'Eight Seconds', 'Yee-haw', 'Wild West', 'High Noon Ride', 'Sunset Ride'],
    cycle: ['quads', 'pulses', 'stretch'],
    dayTypes: {
      quads: { label: 'Quads & hips', short: 'Quads', blocks: [S('Quads & hips', ['posLegs', 'sumo_pulse', 'lunge2?', 'adductor?'], LIFT), C('Core', ['coreAnti', 'coreHollow'], { ...CORE, values: [2] })] },
      pulses: { label: 'Pulses & holds', short: 'Pulses', blocks: [C('Pulses & holds', ['sumo_pulse', 'posHold', 'bridge_pulse', 'posHold', 'adductor?'], { ...COND, values: [3, 4, 5] }), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
      stretch: { label: 'Stretch', short: 'Stretch', absSlots: [], blocks: [C('Gentle circuit', ['thrustBw', 'adductor', 'hipFlex', 'thrustBw?'], LIFT), F('Hip stretch', ['fxHips', 'fxStraddle', 'ygHips', 'ygRest', 'fxHips?'], FLOW)] },
    },
  },
  {
    id: 'last-longer-30', added: 16, catalogue: 9, days: 30, name: 'Last Longer 30', subject: 'Bedroom stamina', minutes: [28, 33], levers: [null, 'reps', 'weight'],
    split: 'Hips & stamina / control & stretch, 30 days', blurb: 'Thirty days of stamina so you last longer inside her: hip drive and a sweat, then control and a stretch.',
    about: 'A month to last longer inside her. One day is hip drive, thrusts, swings and squats, followed by a stamina Tabata; the next is slow glute work and pelvic-floor control, followed by a long hip stretch. Every day mixes strength with cardio or flexibility. Every ten days the level steps up: more reps at Level II, heavier weights at Level III.',
    names: ['Day One Stamina', 'Warming Up', 'Pace Yourself', 'Breathe', 'Slow Down', 'Edge', 'Hold Back', 'Ride the Wave', 'Build Up', 'Plateau', 'Peak', 'Hold It', 'Control', 'Patience Pays', 'Longer', 'Longer Still', 'Staying Power', 'Endurance Test', 'Go the Distance', 'Thirty Strong'],
    cycle: ['hips', 'core'],
    dayTypes: {
      hips: { label: 'Hips & stamina', short: 'Hips', blocks: [S('Hip drive', ['thrust', 'kb_swing', 'posLegs', 'thrust?'], LIFT), T('Stamina', ['hiit', 'thrustBw'], { ...CARDIO, values: [1, 2] })] },
      core: { label: 'Control & stretch', short: 'Control', absSlots: [], blocks: [C('Glutes & control', ['single_leg_bridge', 'pelvic_floor_hold', 'bridge_hold', 'pelvic', 'thrustBw?'], LIFT), F('Hip stretch', ['fxHips', 'ygHips', 'fxStraddle', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'pelvic-power-30', added: 16, catalogue: 9, days: 30, name: 'Pelvic Power 30', subject: 'Bedroom stamina', minutes: [24, 29], levers: [null, 'holds', 'reps'],
    split: 'Glutes & pelvic floor / hips & HIIT, 30 days', blurb: 'A month for the muscles under a good fuck: glutes and pelvic floor, then hips with a short HIIT burst.',
    about: 'A month for the deep muscles that change how you fuck. One day trains the glutes and the pelvic floor together: bridges, holds and gentle pelvic-floor squeezes. The next works the hips and inner thighs, then a short HIIT burst. Every day mixes two kinds of work, and every ten days it gets harder: longer holds at Level II, more reps at Level III.',
    names: ['Root', 'Core Deep', 'Foundation Floor', 'Basin', 'Bowl', 'Cradle', 'Hammock', 'Sling', 'Trampoline Floor', 'Lift and Hold', 'Squeeze', 'Release', 'Pulse', 'Elevator', 'Ground Floor Up', 'Top Floor', 'Hold the Lift', 'Gentle Squeeze', 'Strong Base', 'Power Up'],
    cycle: ['floor', 'hips'],
    dayTypes: {
      floor: { label: 'Glutes & pelvic floor', short: 'Floor', blocks: [S('Glutes', ['thrust', 'bridge_hold', 'single_leg_bridge'], LIFT), C('Pelvic floor', ['pelvic_floor_hold', 'pelvic', 'pelvic_floor_hold'], { ...CORE, values: [2, 3] })] },
      hips: { label: 'Hips & HIIT', short: 'Hips', blocks: [S('Hips', ['adductor', 'thrust', 'hipFlex', 'adductor?'], LIFT), T('HIIT', ['hiit', 'cardio'], { ...CARDIO, values: [1, 2] })] },
    },
  },
  // ---- Sex positions ----
  {
    id: 'the-pretzel', added: 16, catalogue: 9, name: 'The Pretzel', subject: 'Sex positions', minutes: [26, 31], levers: [null, 'holds', 'reps'],
    split: 'Hip opening / inner-thigh strength', blurb: 'Bend into the positions that knot you: deep hip-opening flows, then inner-thigh and hip strength to hold them.',
    about: 'For the positions that tie you in a knot while you fuck. One day is a long hip-opening flow: pigeon, frog, lizard and happy baby, held long. The next builds strength at those same angles: Cossack squats, Copenhagen planks, side-lying adductions and frog pumps, so the range is yours to use, not just to reach. Level II makes every hold longer and Level III adds reps.',
    names: ['Pretzel', 'Twist', 'Knot', 'Reef Knot', 'Granny Knot', 'Figure of Eight', 'Bowline Hips', 'Tangle', 'Twister', 'Contortionist', 'Gumby', 'Rubber Band', 'Elastic Girl', 'Origami', 'Folded', 'Bent Over Backwards', 'Lotus', 'Pigeon', 'Lizard', 'Happy Baby'],
    cycle: ['open', 'strong'],
    dayTypes: {
      open: { label: 'Hip opening', short: 'Open', absSlots: [], blocks: [C('Strong at the angle', ['adductorBw', 'thrustBw', 'mbHip', 'adductorBw?'], LIFT), F('Hip opening', ['fxHips', 'fxStraddle', 'ygHips', 'fxHips', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      strong: { label: 'Inner-thigh strength', short: 'Strength', blocks: [S('Inner-thigh strength', ['cossack_squat', 'copenhagen_plank', 'adductor', 'frog_pump'], LIFT), C('Core', ['coreRot', 'pelvic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'legs-over-shoulders', added: 16, catalogue: 9, name: 'Legs Over Shoulders', subject: 'Sex positions', minutes: [26, 31], levers: [null, 'holds', 'variation'],
    split: 'Hamstrings & core / hamstring flow', blurb: 'Legs high and comfortable while you fuck: hamstring and hip flexibility, and the core to stay there.',
    about: 'For fucking with legs up high and hips curled in. Lying hamstring stretches, half splits and forward folds open the back of the legs; leg raises, hollow holds and dead bugs build the core that keeps the hips curled and steady. One day leads with strength, the other with a long flow. Level II makes every hold longer and Level III brings harder moves.',
    names: ['Ankles Up', 'Sky High', 'Feet to Ceiling', 'Legs Up', 'Over the Top', 'Deep Fold', 'Candlestick', 'Plough', 'Jackknife', 'Folding Chair', 'Pike', 'Butterfly Up', 'High Kick', 'Can-can', 'Ballerina Legs', 'Rockette', 'Showgirl', 'Leg Lift', 'Hamstring Heaven', 'Toes to Nose'],
    cycle: ['core', 'flow'],
    dayTypes: {
      core: { label: 'Hamstrings & core', short: 'Core', absSlots: [], blocks: [C('Core', ['coreHollow', 'leg_raise', 'dead_bug', 'coreHollow'], CORE), S('Hamstrings', ['single_leg_rdl_bw', 'hinge2', 'thrust?'], LIFT)] },
      flow: { label: 'Hamstring flow', short: 'Flow', absSlots: [], blocks: [C('Active hamstrings', ['single_leg_rdl_bw', 'hipFlex', 'thrustBw', 'coreHollow?'], LIFT), F('Hamstring flow', ['fxHam', 'fxSplit', 'fxHam', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'doggy-style-ready', added: 16, catalogue: 9, name: 'Doggy Style Ready', subject: 'Sex positions', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Hips & back / knees & core', blurb: 'Doggy on all fours or behind: hip drive and back care one day, knees, core and holds the next.',
    about: 'For positions on all fours, from either side. One day trains hip drive and keeps the lower back happy: hip thrusts, bird dogs, cat-cow and back-care moves. The other builds steady knees, hips and core in a kneeling and table position: rock-backs, bear holds and planks. A happy back and strong hips make it comfortable for a longer fuck. Level II adds reps and Level III makes every hold longer.',
    names: ['All Fours', 'Table Top', 'Bird Dog', 'Puppy Pose', 'Cat Cow', 'Downward Dog', 'Good Boy', 'Fetch', 'Sit Stay', 'Roll Over', 'Play Dead', 'Wag', 'Howl', 'Bark', 'Leash', 'Collar', 'Treat', 'Best in Show', 'Top Dog', 'Dog Days'],
    cycle: ['hips', 'knees'],
    dayTypes: {
      hips: { label: 'Hips & back', short: 'Hips', blocks: [S('Hip drive', ['thrust', 'hinge2', 'thrust?'], LIFT), C('Back care', ['backStrength', 'backMove', 'bird_dog'], { ...CORE, values: [2, 3] })] },
      knees: { label: 'Knees & core', short: 'Knees', blocks: [C('Kneeling strength', ['adductor_rockback', 'bear_hold', 'posHold', 'coreAnti'], LIFT), F('Stretch', ['ygBack', 'fxSpine', 'ygRest', 'ygRest?'], FLOW)], absSlots: [] },
    },
  },
  {
    id: 'reverse-cowgirl', added: 16, catalogue: 9, name: 'Reverse Cowgirl', subject: 'Sex positions', minutes: [26, 31], levers: [null, 'reps', 'holds'],
    split: 'Quads & balance / thighs & hips', blurb: 'Quads, gripping inner thighs and balance for riding his cock facing away, plus hips that sit deep.',
    about: 'Facing away and on top asks for strong quads, inner thighs that grip, balance and hips that let you sit deep on his cock. One day is quads and balance: split squats, wall sits and single-leg work. The next is inner thighs and hip mobility with a deep squat flow. Level II adds reps and Level III makes every hold longer.',
    names: ['Facing Away', 'Rear View Ride', 'Back to Front', 'Reverse Gear', 'Rewind', 'Turnaround', 'About Face', 'U-turn', 'Backspin', 'Flip Side', 'Mirror Image', 'Over the Shoulder', 'Look Back', 'Glance Back', 'Throwback', 'Rearview', 'Hindsight', 'Back Seat', 'Rumble Seat', 'Saddle Back'],
    cycle: ['quads', 'thighs'],
    dayTypes: {
      quads: { label: 'Quads & balance', short: 'Quads', blocks: [S('Quads', ['posLegs', 'split_squat', 'wall_sit?', 'singleLeg?'], LIFT), C('Balance', ['blStrength', 'blDynamic'], { ...CORE, values: [2] })] },
      thighs: { label: 'Thighs & hips', short: 'Thighs', absSlots: [], blocks: [C('Inner thighs', ['sumo_pulse', 'adductor', 'deep_squat_hold', 'adductor'], LIFT), F('Deep hips', ['garland_pose', 'fxHips', 'fxStraddle', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'wheelbarrow', added: 16, catalogue: 9, name: 'Wheelbarrow', subject: 'Sex positions', minutes: [26, 31], equip: 'bw', levers: [null, 'holds', 'reps'],
    split: 'Arms & core holds / push & bridge', blurb: 'Hold yourself up on your hands while you get fucked: plank, bear and push-up holds, bridges, no equipment.',
    about: 'For positions where you hold yourself up on your hands and get fucked. One day is long holds: planks, push-up bottom holds, bear holds and pike holds. The other builds push-up strength and the bridges and glutes for the other half of the move. No equipment needed. Level II makes every hold longer and Level III adds reps.',
    names: ['Wheelbarrow', 'Handstand', 'Hand Walk', 'Bear Walk', 'Crab Walk', 'Plank Up', 'Hold Position', 'Brace Yourself', 'Arms Locked', 'Steady Hands', 'Strong Wrists', 'Upper Hand Hold', 'Push Back', 'Lean In', 'Ground Control', 'Grounded', 'Rooted Hands', 'Table Hold', 'Bridge Over', 'Arch Up'],
    cycle: ['holds', 'push'],
    dayTypes: {
      holds: { label: 'Arms & core holds', short: 'Holds', blocks: [C('Holds', ['plank', 'pushup_hold', 'bear_hold', 'pike_hold', 'coreAnti'], { ...LIFT, values: [3, 4] }), C('Bridges', ['bridge_hold', 'thrustBw'], { ...CORE, values: [2] })] },
      push: { label: 'Push & bridge', short: 'Push', blocks: [C('Push & bridge', ['chestBw', 'thrustBw', 'armsBw', 'thrustBw'], { ...LIFT, values: [3, 4, 5] }), C('Core', ['coreHollow', 'coreAnti'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'standing-o', added: 16, catalogue: 9, name: 'Standing O', subject: 'Sex positions', minutes: [28, 33], levers: [null, 'weight', 'holds'],
    split: 'Legs & lift / balance & holds', blurb: 'For standing sex: legs and back to lift and hold, calves and balance so you stay steady on your feet.',
    about: 'For fucking on your feet without folding into a wobble. One day builds the legs and back to lift and hold: squats, deadlifts and carries. The other trains balance and endurance on your feet: calf raises and holds, single-leg work and wall sits. Steady feet and strong legs keep it going instead of wobbling. Level II asks for heavier weights and Level III makes every hold longer.',
    names: ['Standing Ovation', 'On Your Feet', 'Stand and Deliver', 'Upright', 'Tall Order', 'Up Against It', 'Wall Flower', 'Tiptoe Up', 'Stand Firm', 'Take a Stand', 'Stand Tall', 'Stand By Me', 'Stand Up Guy', 'Grandstand', 'Bandstand', 'Stand Easy', 'Last Stand', 'Stand Off', 'Kickstand', 'Nightstand'],
    cycle: ['lift', 'balance'],
    dayTypes: {
      lift: { label: 'Legs & lift', short: 'Lift', blocks: [S('Legs & lift', ['squat2', 'hinge2', 'farmer_carry', 'posLegs?'], LIFT), C('Core', ['coreAnti', 'pelvic'], { ...CORE, values: [2] })] },
      balance: { label: 'Balance & holds', short: 'Balance', blocks: [C('Balance & holds', ['calf', 'singleLeg', 'posHold', 'blStrength'], { ...LIFT, values: [2, 3, 4] }), C('Balance', ['blDynamic', 'blStatic'], { ...CORE, values: [2] })] },
    },
  },
  {
    id: 'splits-in-bed', added: 16, catalogue: 9, name: 'Splits in Bed', subject: 'Sex positions', minutes: [24, 29], levers: [null, 'holds', 'holds'],
    split: 'Front split / straddle', blurb: 'Toward a front split and a wide straddle you can fuck in: long flows with strength at the end of the range.',
    about: 'Working toward the splits, front and side, wide enough to fuck in. One day is a front-split flow, half splits, lizards and lunges held long; the other a straddle flow, frog, butterfly and wide-leg folds. Each starts with a short strength circuit at the end of the range, which is what makes new flexibility stick. Both later levels make every hold longer.',
    names: ['Split Second', 'Full Split', 'Half Split', 'Middle Split', 'Side Split', 'Straddle', 'Pancake', 'Frog Legs', 'Butterfly Wings', 'Wide Open', 'Spread Eagle', 'Starfish Legs', 'Ballet Barre', 'Gymnast Split', 'Cheerleader', 'Dancer', 'Ice Skater', 'Grand Jeté', 'Splits Pending', 'Flat to the Floor'],
    cycle: ['front', 'side'],
    dayTypes: {
      front: { label: 'Front split', short: 'Front', absSlots: [], blocks: [C('Active range', ['hipFlex', 'single_leg_rdl_bw', 'split_squat', 'hipFlex?'], LIFT), F('Front split flow', ['fxSplit', 'fxQuad', 'fxSplit', 'fxHam', 'ygRest', 'fxSplit?'], FLOW_SCALED)] },
      side: { label: 'Straddle', short: 'Side', absSlots: [], blocks: [C('Active range', ['adductor', 'cossack_squat', 'copenhagen_plank', 'adductor?'], LIFT), F('Straddle flow', ['fxStraddle', 'fxHips', 'fxStraddle', 'ygRest', 'fxStraddle?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'bendy-body', added: 16, catalogue: 9, name: 'Bendy Body', subject: 'Sex positions', minutes: [24, 29], levers: [null, 'holds', 'variation'],
    split: 'Backbends & hips / twists & shoulders', blurb: 'A body that bends every way you fuck: backbends, hip openers, twists and shoulder openers, with core between.',
    about: 'Flexible all over, not just in the hips, for positions that bend you while you fuck. One day is backbends and hip openers: bridge, camel, cobra and pigeon. The other is twists and shoulder openers, for the positions where you turn or reach back. A short strength circuit for the back starts each day so the new range comes with control. Level II makes every hold longer and Level III brings deeper poses.',
    names: ['Bendy', 'Willow', 'Reed', 'Bamboo Bend', 'Rubber', 'Flex Appeal', 'Limber', 'Supple', 'Lithe', 'Loose', 'Fluid', 'Liquid', 'Wave', 'Ripple', 'Serpent', 'Cobra', 'Camel', 'Bow', 'Wheel', 'Scorpion'],
    cycle: ['back', 'twist'],
    dayTypes: {
      back: { label: 'Backbends & hips', short: 'Backbends', absSlots: [], blocks: [C('Back strength', ['superman', 'bridge_pulse', 'backStrength', 'coreHollow?'], LIFT), F('Backbends & hips', ['ygBack', 'ygHips', 'ygBack', 'fxHips', 'ygRest', 'ygHips?'], FLOW_SCALED)] },
      twist: { label: 'Twists & shoulders', short: 'Twists', absSlots: [], blocks: [C('Back & twist strength', ['backBw', 'coreRot', 'trapsBw', 'mbSpine?'], LIFT), F('Twists & shoulders', ['fxSpine', 'fxUpper', 'fxSpine', 'fxUpper', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  {
    id: 'kama-sutra-30', added: 16, catalogue: 9, days: 30, name: 'Kama Sutra 30', subject: 'Sex positions', minutes: [28, 33], levers: [null, 'reps', 'holds'],
    split: 'Hips strong / hips open / hold it, 30 days', blurb: 'Thirty days of positions: hip strength, hip range and the holds that keep you there while you fuck.',
    about: 'A month that works through what the classics ask of a body you fuck in. One day builds hip and inner-thigh strength with a short stretch after; the next opens the hips and hamstrings with a long flow after a short strength circuit at the same angles; the third trains the holds, wall sits, bridges and planks, with a stamina burst. Every day mixes two kinds of work, and every ten days it gets harder.',
    names: ['Chapter One', 'The Lotus', 'The Bridge', 'The Swan', 'The Lion', 'The Tiger', 'The Crab', 'The Elephant', 'The Mare', 'The Cobra', 'The Butterfly', 'The Peacock', 'The Bow', 'The Wheel', 'The Plough', 'The Fan', 'The Moon', 'The Star', 'The Scissors', 'The Last Page'],
    cycle: ['strong', 'open', 'hold'],
    dayTypes: {
      strong: { label: 'Hips strong', short: 'Strong', absSlots: [], blocks: [S('Hip strength', ['thrust', 'adductor', 'cossack_squat', 'hipFlex?'], LIFT), F('Stretch', ['fxHips', 'ygRest', 'ygRest?'], FLOW)] },
      open: { label: 'Hips open', short: 'Open', absSlots: [], blocks: [C('Strong at the angle', ['adductorBw', 'thrustBw', 'hipFlex', 'adductorBw?'], LIFT), F('Hip & hamstring flow', ['fxHips', 'fxHam', 'fxStraddle', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      hold: { label: 'Hold it', short: 'Hold', blocks: [C('Holds', ['posHold', 'bridge_hold', 'posHold', 'plank'], { ...LIFT, values: [3, 4] }), T('Stamina', ['hiit', 'thrustBw'], { ...CARDIO, values: [1] })] },
    },
  },
  {
    id: 'flexible-lover-30', added: 16, catalogue: 9, days: 30, name: 'Flexible Lover 30', subject: 'Sex positions', minutes: [24, 29], equip: 'bw', levers: [null, 'holds', 'reps'],
    split: 'Open & strong / bend & hold, 30 days', blurb: 'A month of flexibility you can fuck with: open hips and hamstrings, then bend and hold, no equipment.',
    about: 'A month of flexibility you can actually use while you fuck, on the floor with nothing else. One day pairs a hip-opening flow with bodyweight strength at the same angles; the next pairs backbends and twists with holds that keep you steady. Every day mixes flexibility with strength, and every ten days it gets harder: longer holds at Level II, more reps at Level III.',
    names: ['Open Up', 'Loosen Up', 'Bend Over', 'Stretch Out', 'Reach', 'Unfold', 'Unwind Hips', 'Melt', 'Soften', 'Sink', 'Deepen', 'Open Wide', 'Arch', 'Curl', 'Twist and Shout', 'Roll With It', 'Let Go', 'Give In', 'Surrender', 'Bliss'],
    cycle: ['open', 'bend'],
    dayTypes: {
      open: { label: 'Open & strong', short: 'Open', absSlots: [], blocks: [C('Strong at the angle', ['adductorBw', 'thrustBw', 'adductorBw', 'thrustBw?'], LIFT), F('Hip opening', ['fxHips', 'fxStraddle', 'fxHam', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
      bend: { label: 'Bend & hold', short: 'Bend', absSlots: [], blocks: [C('Holds', ['posHold', 'bridge_hold', 'plank', 'posHold?'], LIFT), F('Backbends & twists', ['ygBack', 'fxSpine', 'ygBack', 'ygRest', 'ygRest?'], FLOW_SCALED)] },
    },
  },
  // ---------------- PHASE 16 ticket 11: MIXED +50% over the older Mixed subjects (catalogue 9) ----------------
  // Strength & stretch +5 (strength, then a flow; no abs after a flow)
  {
    id: 'chest-and-open', added: 16, catalogue: 9, name: 'Chest & Open', subject: 'Strength & stretch', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Chest & chest opener / back & shoulder opener', blurb: 'Press and pull, then open what you trained: chest openers after chest, shoulder openers after back.',
    about: 'Strength followed by a stretch for the same muscles. The chest day presses and flies, then opens the chest and shoulders in a flow; the back day rows and pulls, then opens the upper back and lats. Training and stretching the same area keeps the muscles strong and long. Level II asks for heavier weights and Level III adds reps.',
    names: ['Open Chest', 'Wide Open', 'Heart Opener', 'Chest Stretch', 'Arms Wide', 'Spread Wings', 'Open Arms', 'Embrace', 'Broad Chest', 'Pec Release', 'Lat Release', 'Back Open'],
    cycle: ['chest', 'back'],
    dayTypes: {
      chest: { label: 'Chest & chest opener', short: 'Chest', absSlots: [], blocks: [S('Chest', ['chestPress', 'chestBw', 'chestIso', 'triceps2?'], LIFT), F('Chest opener', ['chest_opener', 'fxUpper', 'puppy_pose', 'ygRest?'], FLOW)] },
      back: { label: 'Back & shoulder opener', short: 'Back', absSlots: [], blocks: [S('Back', ['backRow', 'backBar', 'backRear', 'biceps2?'], LIFT), F('Shoulder opener', ['thread_the_needle', 'fxUpper', 'childs_pose', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'legs-and-lengthen-plus', added: 16, catalogue: 9, name: 'Legs & Long', subject: 'Strength & stretch', minutes: [28, 33], levers: [null, 'weight', 'tempo'],
    split: 'Quads & hip flexors / hamstrings & glutes', blurb: 'Legs, then a long stretch: quads with hip flexors, hamstrings with glutes.',
    about: 'Leg strength with a long stretch after. One day squats and lunges, then stretches the quads and hip flexors; the other hinges and thrusts, then stretches the hamstrings and glutes. Strong legs that do not feel tight. Level II asks for heavier weights and Level III slows every rep down.',
    names: ['Long Legs', 'Lean Legs', 'Leg Stretch', 'Quad Release', 'Hip Release', 'Ham Release', 'Glute Release', 'Free Legs', 'Loose Legs', 'Light Legs', 'Supple Legs', 'Easy Legs'],
    cycle: ['quads', 'hams'],
    dayTypes: {
      quads: { label: 'Quads & hip flexors', short: 'Quads', absSlots: [], blocks: [S('Quads', ['squat2', 'lunge2', 'calf', 'adductor?'], LIFT), F('Quad & hip flexor stretch', ['low_lunge', 'fxQuad', 'fxSplit', 'ygRest?'], FLOW)] },
      hams: { label: 'Hamstrings & glutes', short: 'Hams', absSlots: [], blocks: [S('Hamstrings', ['hinge2', 'thrust', 'single_leg_rdl', 'hipGlute?'], LIFT), F('Hamstring & glute stretch', ['fxHam', 'figure_four', 'pigeon_pose', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'neck-and-shoulders-stretch', added: 16, catalogue: 9, name: 'Shoulders & Neck Ease', subject: 'Strength & stretch', minutes: [26, 31], levers: [null, 'reps', 'weight'],
    split: 'Shoulders & neck stretch / traps & upper-back stretch', blurb: 'Shoulder strength, then a gentle neck and upper-back stretch.',
    about: 'For strong shoulders and an easy neck. One day presses and raises for the shoulders, then a gentle flow for the neck and shoulders; the other works the traps and upper back with shrugs and Y raises, then stretches them. Neck work is always gentle. Level II adds reps and Level III asks for heavier weights.',
    names: ['Ease Up', 'Let Go Shoulders', 'Drop the Shoulders', 'Soft Neck', 'Loose Traps', 'Melt Shoulders', 'Shoulder Ease', 'Neck Ease Day', 'Collar Ease', 'Yoke Ease', 'Breathe Out', 'Unclench'],
    cycle: ['shoulders', 'traps'],
    dayTypes: {
      shoulders: { label: 'Shoulders & neck stretch', short: 'Shoulders', absSlots: [], blocks: [S('Shoulders', ['shoulderPress', 'shoulderRaise', 'shoulderHealth', 'triceps2?'], LIFT), F('Neck & shoulder stretch', ['chin_tucks', 'cross_body_shoulder', 'fxUpper', 'ygRest?'], FLOW)] },
      traps: { label: 'Traps & upper-back stretch', short: 'Traps', absSlots: [], blocks: [S('Traps & upper back', ['trapsPool', 'prone_y_raise', 'backRear', 'neck?'], LIFT), F('Upper-back stretch', ['thread_the_needle', 'puppy_pose', 'fxSpine', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'stretch-30-plus', added: 16, catalogue: 9, days: 30, name: 'Strength & Stretch 30', subject: 'Strength & stretch', minutes: [28, 33], levers: [null, 'weight', 'reps'],
    split: 'Upper & open / lower & lengthen, 30 days', blurb: 'A month of lifting and stretching: upper body with an opener, lower body with a long stretch.',
    about: 'A month that builds strength without stiffness. Upper days lift and then open the chest and shoulders; lower days lift and then lengthen the hips and hamstrings. Every ten days the level steps up: heavier weights at Level II, more reps at Level III.',
    names: ['Lift & Open', 'Lift & Lengthen', 'Press & Stretch', 'Squat & Stretch', 'Pull & Open', 'Hinge & Lengthen', 'Strong & Long', 'Firm & Free', 'Hard & Soft', 'Iron & Silk', 'Tight & Loose', 'Work & Rest'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper & open', short: 'Upper', absSlots: [], blocks: [SS('Upper', ['chestPress', 'backRow', 'shoulderPress', 'biceps2'], LIFT), F('Opener', ['chest_opener', 'fxUpper', 'ygRest?'], FLOW)] },
      lower: { label: 'Lower & lengthen', short: 'Lower', absSlots: [], blocks: [SS('Lower', ['squat2', 'hinge2', 'lunge2', 'thrust'], LIFT), F('Lengthen', ['fxHam', 'fxHips', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'kb-and-stretch', added: 16, catalogue: 9, name: 'Bell & Stretch', subject: 'Strength & stretch', minutes: [26, 31], equip: 'kb', levers: [null, 'reps', 'weight'],
    split: 'Bell upper & opener / bell lower & hip flow', blurb: 'One kettlebell, then a stretch: upper-body bell work with an opener, lower-body with a hip flow.',
    about: 'Kettlebell strength with a stretch to finish. One day presses and rows the bell, then opens the chest and shoulders; the other squats and swings it, then flows through the hips. One bell and a mat are all you need. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Open', 'Bell Long', 'Bell Ease', 'Bell Release', 'Bell Soft', 'Bell Free', 'Bell Loose', 'Bell Supple', 'Bell Calm', 'Bell Quiet', 'Bell Breathe', 'Bell Rest'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Bell upper & opener', short: 'Upper', absSlots: [], blocks: [S('Bell upper', ['kb_press', 'kb_row', 'kb_floor_press', 'kb_halo?'], LIFT), F('Opener', ['chest_opener', 'fxUpper', 'ygRest?'], FLOW)] },
      lower: { label: 'Bell lower & hip flow', short: 'Lower', absSlots: [], blocks: [S('Bell lower', ['goblet_squat', 'kb_swing', 'kb_sumo_deadlift', 'lateral_lunge?'], LIFT), F('Hip flow', ['ygHips', 'fxHips', 'ygRest?'], FLOW)] },
    },
  },
  // Fighter +5 (bouts with strength, conditioning or a flow)
  {
    id: 'fighter-neck', added: 16, catalogue: 9, name: 'Fighter\'s Neck', subject: 'Fighter', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Bouts & neck / bouts & grip', blurb: 'Fighters train the neck and the grip: bouts, then gentle neck work one day, grip the next.',
    about: 'Fighters train two things most programs skip: the neck and the grip. Each day starts with bouts, then one day adds gentle neck holds, shrugs and upper-back work, and the other carries, hangs and forearm curls. A strong neck and grip help in the clinch. Neck work stays at half effort. Both later levels add reps.',
    names: ['Thick Neck', 'Iron Grip Fighter', 'Clinch Ready', 'Neck Bridge', 'Collar Tie', 'Plum Grip', 'Head Control', 'Under Hook', 'Over Hook', 'Grip Fight', 'Hand Fight', 'Tie Up'],
    cycle: ['neck', 'grip'],
    dayTypes: {
      neck: { label: 'Bouts & neck', short: 'Neck', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense?'], BOUTS), S('Neck & traps', ['neck', 'trapsPool', 'neck', 'trapsBw?'], LIFT)] },
      grip: { label: 'Bouts & grip', short: 'Grip', blocks: [B('Bouts', ['kkCombo', 'kkKnee', 'bxBasic?'], BOUTS), S('Grip', ['farmer_carry', 'gripHold', 'gripCurl', 'gripHold?'], LIFT)] },
    },
  },
  {
    id: 'fighter-legs', added: 16, catalogue: 9, name: 'Fighter Legs', subject: 'Fighter', minutes: [28, 33], levers: [null, 'reps', 'weight'],
    split: 'Kick bouts & legs / bouts & calves', blurb: 'Legs that last a fight: kick bouts with leg strength, punch bouts with calves and hops.',
    about: 'Fighters live on their legs. One day pairs kick bouts with squats, lunges and adductor work; the other punch bouts with calf raises, hops and footwork. Legs that keep you moving and kicking in the last round. Level II adds reps and Level III asks for heavier weights.',
    names: ['Fight Legs', 'Ring Legs', 'Bounce Legs', 'Kick Legs', 'Stance Legs', 'Sprawl Legs', 'Switch Legs', 'Step Legs', 'Pivot Legs', 'Circle Legs', 'Cut Off', 'Ring Craft Legs'],
    cycle: ['kick', 'calves'],
    dayTypes: {
      kick: { label: 'Kick bouts & legs', short: 'Kick', blocks: [B('Kick bouts', ['kkKick', 'kkCombo', 'kkKick?'], BOUTS), S('Legs', ['squat2', 'lunge2', 'adductor', 'calf?'], LIFT)] },
      calves: { label: 'Bouts & calves', short: 'Calves', blocks: [B('Bouts', ['bxMove', 'bxBasic', 'bxPower?'], BOUTS), C('Calves & feet', ['calf', 'calfPlyo', 'shin', 'calfPlyo'], { ...LIFT, values: [2, 3] })] },
    },
  },
  {
    id: 'fighter-30', added: 16, catalogue: 9, days: 30, name: 'Fighter 30', subject: 'Fighter', minutes: [28, 33], levers: [null, 'reps', 'reps'],
    split: 'Bouts & strength / bouts & flow, 30 days', blurb: 'A month of fight training: bouts with strength one day, bouts with a flow the next.',
    about: 'A month of fight training. Every day starts with bouts; one day follows them with strength for the push, the pull and the legs, the next with core and a mobility flow for the hips and shoulders. Every ten days the level steps up with more reps and longer combinations.',
    names: ['Camp Start', 'Camp Week', 'Camp Ten Days', 'Camp Twenty Days', 'Camp Thirty Days', 'Camp Month', 'Fight Week Month', 'Sparring Month', 'Pad Month', 'Bag Month', 'Ring Month Fighter', 'Title Month'],
    cycle: ['strength', 'flow'],
    dayTypes: {
      strength: { label: 'Bouts & strength', short: 'Strength', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense?'], BOUTS), S('Strength', ['chestBw', 'backRow', 'squat2', 'coreRot?'], LIFT)] },
      flow: { label: 'Bouts, core & flow', short: 'Flow', absSlots: [], blocks: [B('Bouts', ['kkKick', 'kkCombo', 'kkKnee?'], BOUTS), C('Core', ['coreRot', 'coreAnti', 'coreHollow?'], CORE), F('Mobility flow', ['mbHip', 'fxHips', 'mbShoulder', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'fighter-emom', added: 16, catalogue: 9, name: 'Fighter EMOM', subject: 'Fighter', minutes: [28, 33], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Bouts & strength EMOM / bouts & core EMOM', blurb: 'Bouts, then an EMOM: push-ups, sprawls and squats one day, core the next.',
    about: 'Bouts first, then a fighter\'s EMOM. One day the EMOM is push-ups, sprawls and squats, strength for the scramble; the other it is core, twists, hollow holds and planks. Hard, honest and over in half an hour. Both later levels add reps.',
    names: ['Sprawl', 'Scramble', 'Shoot', 'Stuff', 'Brawl', 'Grind', 'Pressure', 'Pace', 'Cardio King', 'Gas Tank', 'Second Round', 'Championship Rounds'],
    cycle: ['sprawl', 'core'],
    dayTypes: {
      sprawl: { label: 'Bouts & strength EMOM', short: 'Strength', blocks: [B('Bouts', ['bxBasic', 'bxPower', 'bxDefense?'], BOUTS), E('Strength EMOM', ['chestBw', 'sprawl', 'legsBw2'], { ...LIFT, values: [6, 8, 10] })] },
      core: { label: 'Bouts & core EMOM', short: 'Core', blocks: [B('Bouts', ['kkCombo', 'kkKick', 'kkKnee?'], BOUTS), E('Core EMOM', ['coreRot', 'coreHollow', 'coreAnti'], { ...CORE, values: [6, 8, 10] })] },
    },
  },
  {
    id: 'fighter-power', added: 16, catalogue: 9, name: 'Fighter Power', subject: 'Fighter', minutes: [30, 35], levers: [null, 'reps', 'weight'],
    split: 'Power bouts & explosive strength / bouts & hips', blurb: 'Power for punches and kicks: explosive push-ups and swings, then hip strength and mobility.',
    about: 'Power behind every strike. One day pairs power bouts with explosive strength: clap push-ups, swings, thrusters and rotational work. The other pairs combination bouts with hip strength and a hip flow, because kicks start in the hips. Level II adds reps and Level III asks for heavier weights.',
    names: ['Power Shot', 'Power Kick', 'Snap', 'Torque', 'Rotation', 'Hip Turn', 'Pivot Power', 'Drive Power', 'Explode', 'Detonate', 'Ignite', 'Blast'],
    cycle: ['power', 'hips'],
    dayTypes: {
      power: { label: 'Power bouts & explosive strength', short: 'Power', blocks: [B('Power bouts', ['bxPower', 'bxPower', 'bxBasic?'], BOUTS), S('Explosive strength', ['clap_pushup', 'kb_swing', 'db_thruster', 'russian_twist?'], LIFT)] },
      hips: { label: 'Bouts & hips', short: 'Hips', absSlots: [], blocks: [B('Bouts', ['kkCombo', 'kkKick', 'kkKnee?'], BOUTS), S('Hip strength', ['cossack_squat', 'standing_knee_hold', 'adductor'], LIFT), F('Hip flow', ['fxHips', 'ygHips', 'ygRest?'], FLOW)] },
    },
  },
  // Athlete +5 (plyometrics first, then strength and balance; long plyometric rests)
  {
    id: 'athlete-30', added: 16, catalogue: 9, days: 30, name: 'Athlete 30', subject: 'Athlete', minutes: [33, 38], rests: PLYO_RESTS, levers: [null, 'weight', 'reps'],
    split: 'Jump, lift, balance A / B, 30 days', blurb: 'A month of athletic training: jumps, then strength, then balance, every day.',
    about: 'A month to move like an athlete. Every day starts with jumps while you are fresh, then strength, then balance. One day leans on the legs, the other on the upper body and single-leg work. Every ten days the level steps up: heavier weights at Level II, more reps at Level III.',
    names: ['Athlete One', 'Athlete Week', 'Athlete Ten', 'Athlete Twenty', 'Athlete Thirty', 'Athlete Month', 'Sport Month', 'Game Month Athlete', 'Field Month', 'Track Month Athlete', 'Court Month', 'Pitch Month'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Jump, lift, balance A', short: 'A', blocks: [S('Jumps', ['plyoVert', 'broad_jump'], { ...PLYO, values: [2, 3] }), S('Strength', ['squat2', 'hinge2', 'backRow?'], LIFT), C('Balance', ['blStrength', 'blStatic'], { ...BAL, values: [1, 2] })] },
      b: { label: 'Jump, lift, balance B', short: 'B', blocks: [S('Jumps', ['plyoLat', 'plyoUp'], { ...PLYO, values: [2, 3] }), S('Strength', ['chestPress', 'singleLeg', 'backBar?'], LIFT), C('Balance', ['blDynamic', 'blPower'], { ...BAL, values: [1, 2] })] },
    },
  },
  {
    id: 'athlete-calves-hips', added: 16, catalogue: 9, name: 'Athletic Legs Plus', subject: 'Athlete', minutes: [33, 38], rests: PLYO_RESTS, levers: [null, 'reps', 'reps'],
    split: 'Hops & calves / bounds & hips', blurb: 'The athletic lower body: hops and calves, then bounds, hips and inner thighs.',
    about: 'The parts of the legs that make an athlete fast and robust. One day pairs hops with calf and shin strength; the other bounds with hip and inner-thigh strength. Balance work closes each day. Fewer pulled calves and groins, more spring. Both later levels add reps.',
    names: ['Spring Heel Athlete', 'Elastic Athlete', 'Bounce Athlete', 'Hop Athlete', 'Bound Athlete', 'Stride Athlete', 'Leap Athlete', 'Launch Athlete', 'Quick Athlete', 'Swift Athlete', 'Agile Athlete', 'Nimble Athlete'],
    cycle: ['hops', 'bounds'],
    dayTypes: {
      hops: { label: 'Hops & calves', short: 'Hops', blocks: [S('Hops', ['pogo_hops', 'single_leg_hops'], { ...PLYO, values: [2, 3] }), S('Calves & shins', ['calf', 'shin', 'calf?'], LIFT), C('Balance', ['blStatic', 'blStrength'], { ...BAL, values: [1, 2] })] },
      bounds: { label: 'Bounds & hips', short: 'Bounds', blocks: [S('Bounds', ['bounding', 'lateral_bounds'], { ...PLYO, values: [2, 3] }), S('Hips & inner thighs', ['adductor', 'thrust', 'adductorLoad?'], LIFT), C('Balance', ['blDynamic', 'blPower'], { ...BAL, values: [1, 2] })] },
    },
  },
  {
    id: 'athlete-supersets', added: 16, catalogue: 9, name: 'Athlete Supersets', subject: 'Athlete', minutes: [33, 38], rests: PLYO_RESTS, levers: [null, 'weight', 'reps'],
    split: 'Jump & lower supersets / throw & upper supersets', blurb: 'Jumps, then strength supersets: lower body one day, upper body the next.',
    about: 'Jumps first, then strength in supersets so the session stays tight. One day is vertical and broad jumps, then squat and hinge supersets; the other is explosive push-ups, then press and pull supersets. A short balance block finishes each. Level II asks for heavier weights and Level III adds reps.',
    names: ['Pair Up Athlete', 'Double Up', 'Back to Back', 'One Two', 'Combo Athlete', 'Link Athlete', 'Chain Athlete', 'Tag Athlete', 'Relay Athlete', 'Tandem Athlete', 'Partner Athlete', 'Duo Athlete'],
    cycle: ['lower', 'upper'],
    dayTypes: {
      lower: { label: 'Jump & lower supersets', short: 'Lower', blocks: [S('Jumps', ['plyoVert', 'broad_jump'], { ...PLYO, values: [2, 3] }), SS('Lower supersets', ['squat2', 'hinge2', 'lunge2', 'thrust'], { ...LIFT, values: [2, 3] }), C('Balance', ['blStrength', 'blStatic'], { ...BAL, values: [1, 2] })] },
      upper: { label: 'Throw & upper supersets', short: 'Upper', blocks: [S('Upper power', ['plyoUp', 'clap_pushup'], { ...PLYO, values: [2, 3] }), SS('Upper supersets', ['chestPress', 'backRow', 'shoulderPress', 'backBar'], { ...LIFT, values: [2, 3] }), C('Balance', ['blDynamic', 'blPower'], { ...BAL, values: [1, 2] })] },
    },
  },
  {
    id: 'athlete-circuit', added: 16, catalogue: 9, name: 'Athlete Circuits', subject: 'Athlete', minutes: [33, 38], equip: 'bw', rests: PLYO_RESTS, levers: [null, 'reps', 'variation'],
    split: 'Jump & bodyweight circuit A / B', blurb: 'Athletic training with no equipment: jumps, a bodyweight circuit and balance.',
    about: 'Athletic training with nothing but the floor. Jumps first, then a bodyweight circuit of single-leg work, push-ups and floor pulls, then balance. The two days change the jumps and the circuit. Good for travel, or for teams with no gym. Level II adds reps and Level III brings harder moves.',
    names: ['Field Circuit', 'Park Athlete', 'Beach Athlete', 'Track Circuit', 'Grass Athlete', 'Turf Athlete', 'Sand Athlete', 'Court Circuit', 'Gym-free', 'Kit-free', 'Bare Athlete', 'Body Athlete'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Jump & circuit A', short: 'A', blocks: [S('Jumps', ['plyoVert', 'plyoLat'], { ...PLYO, values: [2, 3] }), C('Bodyweight circuit', ['singleLeg', 'chestBw', 'backBw', 'legsBw2?'], { ...LIFT, values: [2, 3] }), C('Balance', ['blStrength', 'blStatic'], { ...BAL, values: [1, 2] })] },
      b: { label: 'Jump & circuit B', short: 'B', blocks: [S('Jumps', ['broad_jump', 'plyoUp'], { ...PLYO, values: [2, 3] }), C('Bodyweight circuit', ['legsBw2', 'pushBw2', 'backBw', 'adductorBw?'], { ...LIFT, values: [2, 3] }), C('Balance', ['blDynamic', 'blPower'], { ...BAL, values: [1, 2] })] },
    },
  },
  {
    id: 'athlete-kb', added: 16, catalogue: 9, name: 'Bell Athlete', subject: 'Athlete', minutes: [33, 38], equip: 'kb', rests: PLYO_RESTS, levers: [null, 'reps', 'weight'],
    split: 'Jump & swing / jump & press', blurb: 'Athletic training with one kettlebell: jumps, then swings or presses, then balance.',
    about: 'Athletic power with one kettlebell. Each day starts with jumps, then swings and squats one day, presses and rows the next, then balance. The swing and the jump train the same explosive hips. Level II adds reps and Level III asks for a heavier bell.',
    names: ['Bell Jump', 'Bell Leap', 'Bell Spring', 'Bell Power', 'Bell Speed', 'Bell Agility', 'Bell Sport', 'Bell Game', 'Bell Field', 'Bell Court', 'Bell Track', 'Bell Pitch'],
    cycle: ['swing', 'press'],
    dayTypes: {
      swing: { label: 'Jump & swing', short: 'Swing', blocks: [S('Jumps', ['plyoVert', 'broad_jump'], { ...PLYO, values: [2, 3] }), S('Swing & squat', ['kb_swing', 'goblet_squat', 'kb_one_arm_swing?'], LIFT), C('Balance', ['blStrength', 'blStatic'], { ...BAL, values: [1, 2] })] },
      press: { label: 'Jump & press', short: 'Press', blocks: [S('Jumps', ['plyoLat', 'plyoUp'], { ...PLYO, values: [2, 3] }), S('Press & row', ['kb_press', 'kb_row', 'kb_push_press?'], LIFT), C('Balance', ['blDynamic', 'blPower'], { ...BAL, values: [1, 2] })] },
    },
  },
  // Balanced week +5 (a block from each family every day: strength, cardio or combat, and a flow or circuit)
  {
    id: 'balanced-muscle', added: 16, catalogue: 9, name: 'Balanced Muscle', subject: 'Balanced week', minutes: [30, 35], levers: [null, 'weight', 'reps'],
    split: 'Upper / lower / arms & shoulders: lift, sweat, stretch', blurb: 'Muscle with balance: a lift for one area, a Tabata, then a stretch, every day.',
    about: 'Muscle building inside a balanced week. Every day lifts one area, upper, lower or arms and shoulders, then does a short Tabata, then a stretch for what you trained. Every family of training, every day, with the strength leading. Level II asks for heavier weights and Level III adds reps.',
    names: ['Balanced Build', 'Even Build', 'Fair Build', 'Whole Build', 'Rounded Build', 'Complete Build', 'Total Build', 'Full Build', 'All Build', 'Every Build', 'Steady Build', 'True Build'],
    cycle: ['upper', 'lower', 'arms'],
    dayTypes: {
      upper: { label: 'Upper, sweat & stretch', short: 'Upper', absSlots: [], blocks: [S('Upper', ['chestPress', 'backRow', 'shoulderPress'], LIFT), T('Tabata', ['hiit', 'cardio'], CARDIO_TABATA), F('Stretch', ['fxUpper', 'ygRest', 'ygRest?'], FLOW)] },
      lower: { label: 'Lower, sweat & stretch', short: 'Lower', absSlots: [], blocks: [S('Lower', ['squat2', 'hinge2', 'calf'], LIFT), T('Tabata', ['hiit', 'legsBw'], CARDIO_TABATA), F('Stretch', ['fxHips', 'fxHam', 'ygRest?'], FLOW)] },
      arms: { label: 'Arms & shoulders, sweat & stretch', short: 'Arms', absSlots: [], blocks: [SS('Arms & shoulders', ['biceps2', 'triceps2', 'shoulderRaise', 'shoulderHealth'], LIFT), T('Tabata', ['hiit', 'cardio'], CARDIO_TABATA), F('Stretch', ['fxUpper', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'balanced-fighter', added: 16, catalogue: 9, name: 'Balanced Fighter', subject: 'Balanced week', minutes: [30, 35], levers: [null, 'reps', 'weight'],
    split: 'Lift, bouts & core / lift, bouts & flow', blurb: 'Strength, a few bouts and core or a flow: a fighter\'s balanced week.',
    about: 'A balanced week with a fighter\'s accent. Every day lifts, then does a few shadowboxing or kickboxing bouts, then finishes with a core circuit or a mobility flow. Strength, combat and recovery every day. Level II adds reps and Level III asks for heavier weights.',
    names: ['Balanced Bout', 'Even Bout', 'Fair Fight', 'Whole Fight', 'Rounded Fighter', 'Complete Fighter', 'Total Fighter', 'Full Fighter', 'All-round Fighter', 'Every Round', 'Steady Fighter', 'True Fighter'],
    cycle: ['core', 'flow'],
    dayTypes: {
      core: { label: 'Lift, bouts & core', short: 'Core', blocks: [S('Strength', ['squat2', 'chestPress', 'backRow?'], LIFT), B('Bouts', ['bxBasic', 'bxPower'], BOUTS), C('Core', ['coreRot', 'coreAnti', 'coreHollow?'], { ...CORE, values: [1, 2] })] },
      flow: { label: 'Lift, bouts & flow', short: 'Flow', absSlots: [], blocks: [S('Strength', ['hinge2', 'shoulderPress', 'backBar'], LIFT), B('Bouts', ['kkKick', 'kkCombo'], BOUTS), F('Mobility flow', ['mbHip', 'fxHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'balanced-bw-plus', added: 16, catalogue: 9, name: 'Balanced Bodyweight', subject: 'Balanced week', minutes: [28, 33], equip: 'bw', levers: [null, 'reps', 'reps'],
    split: 'Push, HIIT & yoga / legs, jumps & stretch', blurb: 'A balanced week with no equipment: bodyweight strength, HIIT and a flow every day.',
    about: 'Everything in one session, on the floor. Every day has bodyweight strength, a HIIT block and a flow: push-ups with an EMOM and a yoga flow one day, legs with jumps and a long stretch the next. Strength, cardio and mobility, every day, no gear. Both later levels add reps.',
    names: ['Balanced Floor', 'Even Floor', 'Fair Floor', 'Whole Floor', 'Rounded Floor', 'Complete Floor', 'Total Floor', 'Full Floor', 'All Floor', 'Every Floor', 'Steady Floor', 'True Floor'],
    cycle: ['push', 'legs'],
    dayTypes: {
      push: { label: 'Push, HIIT & yoga', short: 'Push', absSlots: [], blocks: [SS('Push & pull', ['chestBw', 'backBw', 'shoulderBw', 'backBw'], LIFT), E('HIIT EMOM', ['hiit', 'cardio'], { ...CARDIO, values: [6, 8] }), F('Yoga flow', ['ygStand', 'ygHips', 'ygRest', 'ygRest?'], FLOW)] },
      legs: { label: 'Legs, jumps & stretch', short: 'Legs', absSlots: [], blocks: [SS('Legs', ['legsBw2', 'thrustBw', 'adductorBw', 'calfBw'], LIFT), C('Jumps', ['plyoLow', 'plyoLat'], { ...CARDIO, values: [2, 3] }), F('Stretch', ['fxHam', 'fxHips', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'balanced-month-plus', added: 16, catalogue: 9, days: 30, name: 'Balanced Month Plus', subject: 'Balanced week', minutes: [30, 35], levers: [null, 'reps', 'weight'],
    split: 'Lift, AMRAP & core / lift, Tabata & flow, 30 days', blurb: 'A balanced month: strength, a cardio burst and core or a flow, every day.',
    about: 'A month that covers all of fitness every day. One day lifts, does a short AMRAP and finishes with a core circuit; the next lifts, does a Tabata and finishes with a flow. Every ten days the level steps up: more reps at Level II, heavier weights at Level III.',
    names: ['Balanced One', 'Balanced Week One', 'Balanced Ten', 'Balanced Twenty', 'Balanced Thirty', 'Balanced Month Two', 'Even Month', 'Fair Month', 'Whole Month', 'Rounded Month', 'Complete Month', 'Total Month'],
    cycle: ['amrap', 'tabata'],
    dayTypes: {
      amrap: { label: 'Lift, AMRAP & core', short: 'AMRAP', blocks: [S('Strength', ['squat2', 'chestPress', 'backRow'], LIFT), A('AMRAP', ['hiit', 'kbBallistic'], { ...CARDIO, values: [5, 6, 7] }), C('Core', ['coreAnti', 'coreRot'], CORE)] },
      tabata: { label: 'Lift, Tabata & flow', short: 'Tabata', absSlots: [], blocks: [S('Strength', ['hinge2', 'shoulderPress', 'backBar'], LIFT), T('Tabata', ['hiit', 'cardio'], CARDIO_TABATA), F('Flow', ['ygStand', 'ygHips', 'ygRest', 'ygRest?'], FLOW)] },
    },
  },
  {
    id: 'balanced-kb-plus', added: 16, catalogue: 9, name: 'Balanced Bell', subject: 'Balanced week', minutes: [28, 33], equip: 'kb', levers: [null, 'weight', 'reps'],
    split: 'Bell lift, bell EMOM & flow / bell lift, bouts & core', blurb: 'A balanced week with one kettlebell: bell strength, conditioning or bouts, then a flow or core.',
    about: 'A balanced week with one kettlebell. One day lifts the bell, then does a bell EMOM, then a mobility flow; the other lifts, then does a few shadowboxing bouts, then a core circuit. Strength, cardio or combat, and recovery, every day. Level II asks for a heavier bell and Level III adds reps.',
    names: ['Balanced Bell One', 'Even Bell', 'Fair Bell', 'Whole Bell', 'Rounded Bell', 'Complete Bell', 'Total Bell', 'Full Bell', 'All Bell', 'Every Bell', 'Steady Bell', 'True Bell'],
    cycle: ['emom', 'bouts'],
    dayTypes: {
      emom: { label: 'Bell lift, EMOM & flow', short: 'EMOM', absSlots: [], blocks: [S('Bell strength', ['goblet_squat', 'kb_press', 'kb_row'], LIFT), E('Bell EMOM', ['kb_swing', 'kb_clean'], { ...CARDIO, values: [6, 8] }), F('Flow', ['mbHip', 'fxHips', 'ygRest', 'ygRest?'], FLOW)] },
      bouts: { label: 'Bell lift, bouts & core', short: 'Bouts', blocks: [S('Bell strength', ['kb_deadlift', 'kb_floor_press', 'kb_dead_stop_row?'], LIFT), B('Bouts', ['bxBasic', 'bxPower?'], BOUTS), C('Core', ['kbCore2', 'coreRot'], { ...CORE, values: [1, 2] })] },
    },
  },
  // Calm strength +4 (a Pilates or core block, slow strength, a long yin finish)
  {
    id: 'calm-muscle', added: 16, catalogue: 9, name: 'Calm Muscle', subject: 'Calm strength', minutes: [30, 35], levers: [null, 'tempo', 'weight'],
    split: 'Upper slow / lower slow: Pilates, slow strength, yin', blurb: 'Muscle built slowly: a Pilates series, slow-tempo strength, then a long yin hold.',
    about: 'Muscle building at a calm pace. Each day starts with a Pilates series, then lifts slowly, three or four seconds down, for the upper or lower body, then ends with long yin holds. Slow reps build muscle and control without rushing. Level II slows every rep down and Level III asks for heavier weights.',
    names: ['Slow Build', 'Calm Build', 'Quiet Build', 'Still Build', 'Easy Build', 'Gentle Build', 'Soft Build', 'Steady Build Calm', 'Patient Build', 'Mindful Build', 'Deep Build', 'Long Build'],
    cycle: ['upper', 'lower'],
    dayTypes: {
      upper: { label: 'Upper slow', short: 'Upper', absSlots: [], blocks: [F('Pilates series', ['hundred', 'plAbs', 'plBack'], PILATES), S('Slow upper', ['chestPress', 'backRow', 'shoulderPress', 'biceps2?'], LIFT), F('Yin', ['ygYinSpine', 'ygYinSpine?'], YIN)] },
      lower: { label: 'Lower slow', short: 'Lower', absSlots: [], blocks: [F('Pilates series', ['hundred', 'plGlute', 'plSide'], PILATES), S('Slow lower', ['squat2', 'hinge2', 'thrust', 'calf?'], LIFT), F('Yin', ['ygYinHips', 'ygYinHips?'], YIN)] },
    },
  },
  {
    id: 'calm-30-plus', added: 16, catalogue: 9, days: 30, name: 'Calm 30', subject: 'Calm strength', minutes: [26, 31], levers: [null, 'tempo', 'reps'],
    split: 'Core, slow strength & yin A / B, 30 days', blurb: 'A calm month: core, slow strength and yin, every day.',
    about: 'A calm month of strength. Every day starts with a core circuit, lifts slowly, then finishes with long yin holds. The two days change the lifts and the yin. Every ten days the level steps up: slower reps at Level II, more reps at Level III.',
    names: ['Calm One', 'Calm Week', 'Calm Ten', 'Calm Twenty', 'Calm Thirty', 'Calm Month Two', 'Quiet Month', 'Still Month Calm', 'Slow Month', 'Easy Month Calm', 'Gentle Month Calm', 'Soft Month Calm'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Core, slow strength & yin A', short: 'A', absSlots: [], blocks: [C('Core', ['coreAnti', 'coreHollow'], CORE), SS('Slow supersets', ['squat2', 'backRow', 'chestPress', 'hinge2'], LIFT), F('Yin', ['ygYinHips', 'ygYinHips?'], YIN)] },
      b: { label: 'Core, slow strength & yin B', short: 'B', absSlots: [], blocks: [C('Core', ['coreRot', 'pelvic'], CORE), SS('Slow supersets', ['lunge2', 'backBar', 'shoulderPress', 'thrust'], LIFT), F('Yin', ['ygYinSpine', 'ygYinSpine?'], YIN)] },
    },
  },
  {
    id: 'calm-neck-back', added: 16, catalogue: 9, name: 'Calm Back', subject: 'Calm strength', minutes: [26, 31], equip: 'bw', levers: [null, 'tempo', 'reps'],
    split: 'Back & neck / hips & glutes: core, slow strength, yin', blurb: 'For a calmer back: core, slow upper-back or glute strength, then yin.',
    about: 'Calm strength for the back. One day pairs back-care core with slow upper-back and gentle neck work, then a yin finish for the spine; the other pairs Pilates glute work with slow bridges and hip work, then a yin finish for the hips. Everything is slow and controlled. Level II slows every rep down and Level III adds reps.',
    names: ['Calm Spine', 'Quiet Back', 'Still Back', 'Slow Back', 'Easy Back', 'Gentle Back', 'Soft Back', 'Steady Back', 'Kind Back Calm', 'Patient Back', 'Mindful Back', 'Deep Back'],
    cycle: ['back', 'hips'],
    dayTypes: {
      back: { label: 'Back & neck', short: 'Back', absSlots: [], blocks: [C('Back care', ['backStrength', 'bird_dog'], CORE), S('Slow upper back', ['prone_y_raise', 'reverse_snow_angel', 'prone_neck_lift'], LIFT), F('Yin', ['ygYinSpine', 'ygYinSpine?'], YIN)] },
      hips: { label: 'Hips & glutes', short: 'Hips', absSlots: [], blocks: [F('Pilates glutes', ['plGlute', 'shoulder_bridge'], PILATES), S('Slow glutes', ['single_leg_bridge', 'frog_pump', 'clamshell'], LIFT), F('Yin', ['ygYinHips', 'ygYinHips?'], YIN)] },
    },
  },
  {
    id: 'calm-bell-plus', added: 16, catalogue: 9, name: 'Calm Bell', subject: 'Calm strength', minutes: [28, 33], equip: 'kb', levers: [null, 'tempo', 'weight'],
    split: 'Pilates, slow bell & yin A / B', blurb: 'One kettlebell lifted slowly, between a Pilates series and a long yin finish.',
    about: 'Kettlebell strength, slowly. Each day starts with a Pilates series, lifts the bell with slow tempo, goblet squats, presses, rows and deadlifts, then ends with long yin holds. The bell feels heavier when you slow down. Level II slows every rep down and Level III asks for a heavier bell.',
    names: ['Slow Bell', 'Calm Bell One', 'Quiet Bell', 'Still Bell', 'Easy Bell', 'Gentle Bell', 'Soft Bell', 'Steady Bell Calm', 'Patient Bell', 'Mindful Bell', 'Deep Bell', 'Long Bell'],
    cycle: ['a', 'b'],
    dayTypes: {
      a: { label: 'Pilates, slow bell & yin A', short: 'A', absSlots: [], blocks: [F('Pilates series', ['hundred', 'plAbs', 'plRoll'], PILATES), S('Slow bell', ['goblet_squat', 'kb_press', 'kb_row'], LIFT), F('Yin', ['ygYinHips', 'ygYinHips?'], YIN)] },
      b: { label: 'Pilates, slow bell & yin B', short: 'B', absSlots: [], blocks: [F('Pilates series', ['hundred', 'plBack', 'plSide'], PILATES), S('Slow bell', ['kb_deadlift', 'kb_floor_press', 'kb_dead_stop_row'], LIFT), F('Yin', ['ygYinSpine', 'ygYinSpine?'], YIN)] },
    },
  },
];

module.exports = CONFIGS;
