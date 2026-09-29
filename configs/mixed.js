// The Mixed family (Phase 6): programs whose days hold blocks from more than one family. Every main block says which
// (family: 'Strength' | 'Cardio & combat' | 'Mind & body'), so Phase 8's stats can split a day by family, and each
// block has its own lever where they differ: strength levels by weight or reps, a flow by holds (lever: [null, 'holds', 'holds']).
// absSlots per day type: a day that ends with strength keeps its abs, a day that ends in a flow has none.
const { S, SS, C, E, A, T, F, B } = require('./shared.js');

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
];

module.exports = CONFIGS;
