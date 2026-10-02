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
];

module.exports = CONFIGS;
