// The Mixed family (Phase 6): programs whose days hold blocks from more than one family. Every main block says which
// (family: 'Strength' | 'Cardio & combat' | 'Mind & body'), so Phase 8's stats can split a day by family, and each
// block has its own lever where they differ: strength levels by weight or reps, a flow by holds (lever: [null, 'holds', 'holds']).
// absSlots per day type: a day that ends with strength keeps its abs, a day that ends in a flow has none.
const { S, SS, F } = require('./shared.js');

const ABS = ['absW', 'abs', 'abs?'];
const ONCE = { values: [1] };
const LIFT = { family: 'Strength' }; // a strength block of a mixed day
// a flow of a mixed day: held longer at Level II and III whatever the strength lever is; scale: short stretches (15 s) get longer holds too
const FLOW = { family: 'Mind & body', lever: [null, 'holds', 'holds'] };
const FLOW_SCALED = { ...FLOW, scale: 2, cap: 90 };

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
];

module.exports = CONFIGS;
