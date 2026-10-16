// The program library: one file per family in configs/ (see configs/shared.js for how a config is written).
// configs/mixed.js (Phase 6): Mixed days, blocks from more than one family in a day.
// The program list order is ORDER below, not the family files' order, because families interleave in the list.
const FAMILY_FILES = [require('./configs/strength.js'), require('./configs/cardio-combat.js'), require('./configs/mind-body.js'), require('./configs/mixed.js'), require('./configs/after-dark.js')];
const ORDER = [
  // Signature: each original, then its two variations (Tempo, Harder moves; Phase 6 ticket 3b)
  'three-split-60', 'three-split-60-tempo', 'three-split-60-harder', 'four-split-60', 'four-split-60-tempo', 'four-split-60-harder',
  'two-split-60', 'two-split-60-tempo', 'two-split-60-harder', 'five-split-60', 'five-split-60-tempo', 'five-split-60-harder',
  'full-body-duo-60', 'full-body-duo-60-tempo', 'full-body-duo-60-harder', 'iron-ppl',
  'upper-lower-power', 'full-body-strength', 'pullup-ladder', 'bar-master', 'grip-and-hang', 'engine',
  'storm-front', 'tabata-ten', 'core-foundations', 'flow-state', 'deep-core-60', 'one-bell', 'bell-complexes',
  'swing-century', 'twenty-flat', 'minute-man', 'twenty-ladder', 'hotel-room', 'skill-ladder', 'no-gear-burn',
  'lower-focus', 'posterior-chain', 'single-leg-strong', 'sun-and-strength', 'yin-deep-stretch', 'balance-flow',
  'core-yoga', 'morning-25', 'mat-foundations', 'classical-mat', 'pilates-core-glutes', 'standing-pilates',
  'pilates-power', 'fight-camp', 'southpaw-switch', 'speed-and-footwork', 'heavy-hands', 'boxers-engine',
  'muay-thai-basics', 'kick-combos', 'clinch-and-knees', 'kickboxing-cardio', 'full-contact', 'front-splits-60',
  'pancake-straddle', 'hips-open', 'upper-body-flex', 'full-body-stretch', 'desk-reset', 'better-posture',
  'joint-health', 'squat-hinge-mobility', 'steady', 'single-leg-strength', 'ankle-and-knee', 'athletic-balance',
  'balance-and-core', 'hiit-20', 'tabata-torch', 'thirty-thirty', 'pyramid-hiit', 'afterburn', 'spring-loaded',
  'vertical', 'plyo-legs', 'upper-plyo', 'explosive-full-body', 'arnold-split', 'strength-supersets', 'heavy-duty',
  'bar-flow', 'hang-tough', 'commando', 'glute-builder', 'step-up', 'leg-day-classic', 'windmill-and-press',
  'kettlebell-strength', 'kettlebell-flow', 'core-circuits', 'hollow-body', 'twist-and-brace', 'abs-15',
  'sweat-circuit', 'chipper', 'dumbbell-complex', 'kitchen-table', 'calisthenics-base', 'floor-only',
    'express-circuit', 'two-block-20', 'lunch-break',
  // Phase 6: Mixed
  'lift-and-lengthen', 'iron-yoga', 'strong-hips', 'upper-and-open', 'kettlebell-and-yoga', 'posture-strength',
  // Phase 6 ticket 2: Fighter, Athlete
  'fight-ready', 'strike-and-lift', 'southpaw-strength', 'muay-thai-conditioning', 'boxers-body', 'knockout-circuit',
  'jump-lift-stick', 'court-ready', 'field-day', 'explosive-legs', 'power-and-poise', 'all-round-athlete',
  // Phase 6 ticket 3: Balanced week, Calm strength
  'three-in-one', 'everyday-athlete', 'balanced-30', 'whole-body-week', 'lift-sweat-stretch', 'the-generalist',
  'slow-burn', 'steady-strength', 'pilates-and-iron', 'yin-and-yang', 'quiet-power', 'control',
  // Phase 14 ticket 4: a sixth program for every five-program subject, and bodyweight programs with the floor pulls
  'power-vinyasa', 'pilates-sculpt', 'boxing-strength', 'kick-and-core', 'daily-stretch-15', 'mobility-flow',
  'balance-emom', 'bell-intervals', 'plyo-circuits', 'floor-pull', 'back-at-home', 'quiet-upper',
  // Phase 14 ticket 5: Running prep, Court & field sports
  'run-ready', 'stride-strength', 'springy-legs', 'track-intervals', 'runners-core',
  'court-agility', 'change-of-direction', 'first-step', 'field-strength', 'game-day',
  // Phase 14 ticket 6: Grip & forearms, Kettlebell complexes, Climber / pull strength
  'grip-strength', 'carry-day', 'forearm-pump', 'hang-time', 'grip-and-lift',
  'complex-builder', 'complex-emom', 'bell-ladders', 'bell-amrap', 'complex-and-carry',
  'climb-strength', 'pull-ladder-climb', 'hang-and-hold', 'archer-project', 'wall-ready',
  // Phase 14 ticket 7: Gentle / low impact, Back care
  'gentle-start', 'chair-and-wall', 'low-impact-cardio', 'move-daily', 'strong-and-steady',
  'back-basics', 'back-flow', 'strong-back', 'desk-back', 'back-and-hips',
  // Phase 14 ticket 8: 30-day programs, two per family
  'strength-30', 'kettlebell-30', 'hiit-30', 'boxing-30', 'yoga-30', 'core-30', 'balanced-month', 'calm-month',
  // Phase 14 ticket 9: Strength family +26
  'push-pull', 'body-part-split', 'upper-lower-volume', 'strength-endurance', 'minimalist-strength',
  'pullup-pyramid', 'chinup-strength', 'pull-and-push', 'bar-emom',
  'quad-focus', 'glute-lab', 'legs-twice', 'hamstring-strong', 'athletic-legs',
  'bell-circuit', 'getup-strong', 'swing-press-emom', 'slow-bell',
  'pushup-progress', 'bodyweight-amrap', 'pistol-path',
  'twenty-strength', 'twenty-tabata', 'fifteen-flat', 'commuter', 'kettlebell-20',
  // Phase 14 ticket 10: Cardio & combat +13
  'dumbbell-engine', 'conditioning-ladders', 'work-and-rest', 'hiit-ladders', 'quiet-hiit', 'plyo-emom', 'single-leg-plyo',
  'boxing-emom', 'defence-first', 'kick-strength', 'kick-speed', 'hill-legs', 'reaction-ready',
  // Phase 14 ticket 11: Mind & body +16
  'core-emom', 'loaded-core', 'plank-project', 'shoulder-health', 'hip-mobility', 'evening-yoga', 'yoga-strength', 'pilates-flow',
  'pilates-15', 'backbend-flex', 'active-flexibility', 'steady-feet', 'loaded-balance', 'gentle-flow', 'easy-strength', 'loaded-back-care',
  // Phase 14 ticket 12: Mixed +15
  'bodyweight-and-stretch', 'supersets-and-stretch', 'lift-and-move', 'bouts-and-bells', 'kick-and-stretch', 'fighter-25',
  'bodyweight-athlete', 'speed-and-strength', 'court-athlete', 'balanced-25', 'kettlebell-week', 'no-gear-week',
  'calm-bodyweight', 'slow-supersets', 'evening-strength',
  // Phase 16 ticket 4: muscle focus, Chest, Back, Shoulders, Arms
  'chest-day', 'push-and-press', 'pushup-chest', 'chest-emom', 'bell-chest', 'chest-ladders', 'chest-30', 'chest-amrap-30',
  'back-day', 'back-and-biceps', 'floor-back', 'back-emom', 'bell-back', 'back-ladders', 'back-30', 'back-circuit-30',
  'shoulder-day', 'boulder-shoulders', 'floor-shoulders', 'shoulder-emom', 'bell-shoulders', 'shoulder-ladders', 'shoulders-30', 'shoulder-circuit-30',
  'arm-day', 'arm-supersets', 'bodyweight-arms', 'arm-emom', 'chinup-arms', 'arm-ladders', 'arms-30', 'arm-circuit-30',
  // Phase 16 ticket 5: muscle focus, Hips & adductors, Calves & lower legs, Neck & traps
  'hip-day', 'inner-thigh-supersets', 'floor-hips', 'hip-emom', 'bell-hips', 'hip-ladders', 'hips-30', 'hip-circuit-30',
  'calf-day', 'calves-and-shins', 'barefoot-legs', 'calf-emom', 'calf-builder', 'calf-ladders', 'calves-30', 'calf-circuit-30',
  'neck-day', 'neck-and-traps', 'desk-neck', 'neck-emom', 'shrug-and-hold', 'traps-ladders', 'traps-30', 'neck-circuit-30',
  // Phase 16 ticket 6: Variety (every day is different)
  'every-day-different', 'strength-roulette', 'sweat-shuffle', 'mind-body-mix', 'bodyweight-shuffle',
  'kettlebell-roulette', 'short-variety', 'muscle-tour', 'fighter-variety', 'athlete-variety',
  'variety-30', 'bodyweight-variety-30', 'core-roulette', 'long-variety', 'upper-roulette',
  // Phase 16 ticket 7: after-dark, Beach body, Bedroom stamina, Sex positions
  'beach-body', 'v-taper', 'booty-call', 'abs-out', 'gun-show-tonight',
  'shirt-off', 'bikini-ready', 'thirst-trap', 'beach-body-30', 'naked-mirror-30',
  'all-night-long', 'your-ladys-favorite', 'pound-town', 'round-two', 'deep-stroke',
  'hold-me-up', 'marathon-session', 'on-top', 'last-longer-30', 'pelvic-power-30',
  'the-pretzel', 'legs-over-shoulders', 'doggy-style-ready', 'reverse-cowgirl', 'wheelbarrow',
  'standing-o', 'splits-in-bed', 'bendy-body', 'kama-sutra-30', 'flexible-lover-30',
  // Phase 16 ticket 8: Strength family +50%
  'upper-lower-four', 'big-five', 'push-pull-legs-plus', 'strength-and-size', 'dumbbell-only-strength', 'antagonist-supersets', 'strength-30-plus',
  'pullup-plus', 'pullup-emom-ladder', 'chinup-biceps', 'pullup-30', 'bar-and-bell', 'wide-grip-week', 'glute-and-hamstring',
  'legs-all-over', 'kettlebell-legs', 'single-leg-30', 'squat-everyday', 'glute-30', 'bell-muscle', 'bell-emom-plus',
  'bell-hips-core', 'kettlebell-30-plus', 'bell-arms', 'bell-full-emom', 'bodyweight-muscle', 'bodyweight-circuit-plus', 'pushup-pullup-bw',
  'bodyweight-30', 'calisthenics-skills', 'travel-strength', 'pushup-and-squat', 'twenty-muscle', 'fifteen-emom', 'twenty-arms-abs',
  'twenty-tabata-plus', 'busy-30', 'no-gear-twenty', 'grip-emom', 'grip-and-pull', 'forearm-circuit', 'grip-30',
  'complex-straight', 'complex-ladder-emom', 'complex-30', 'complex-hips', 'climber-30', 'climber-emom', 'climber-antagonist',
  // Phase 16 ticket 9: Cardio & combat +50%
  'engine-builder', 'death-by', 'conditioning-30', 'bell-and-burpee', 'dumbbell-tabata', 'hiit-legs', 'hiit-upper',
  'hiit-ladder-tabata', 'hiit-30-plus', 'bell-hiit', 'plyo-power-straight', 'plyo-calves', 'plyo-30', 'plyo-strength-emom',
  'boxing-circuit', 'boxing-power', 'boxing-tabata-plus', 'boxing-30-plus', 'kick-circuit', 'kick-tabata-plus', 'kick-30',
  'kick-flex', 'runner-strength-30', 'trail-legs', 'run-faster', 'court-30', 'racket-ready', 'field-speed',
  // Phase 16 ticket 10: Mind & body +50%
  'core-and-neck', 'weighted-abs', 'core-30-plus', 'bell-core', 'pilates-core-mix', 'desk-neck-reset', 'ankle-hip-mobility', 'mobility-30',
  'posture-strength-circuit', 'yoga-hips-hamstrings', 'yin-30', 'yoga-balance-core', 'yoga-backbends', 'yoga-15', 'pilates-glutes-legs', 'pilates-30',
  'pilates-posture', 'pilates-20', 'flexible-30', 'active-range', 'calf-ankle-flex', 'splits-30', 'balance-30', 'balance-calves-feet',
  'balance-strength-plus', 'balance-flow-emom', 'gentle-30', 'gentle-legs-balance', 'gentle-emom', 'back-care-30', 'back-hips-glutes', 'upper-back-care',
  // Phase 16 ticket 11: Mixed +50%
  'chest-and-open', 'legs-and-lengthen-plus', 'neck-and-shoulders-stretch', 'stretch-30-plus', 'kb-and-stretch', 'fighter-neck',
  'fighter-legs', 'fighter-30', 'fighter-emom', 'fighter-power', 'athlete-30', 'athlete-calves-hips',
  'athlete-supersets', 'athlete-circuit', 'athlete-kb', 'balanced-muscle', 'balanced-fighter', 'balanced-bw-plus',
  'balanced-month-plus', 'balanced-kb-plus', 'calm-muscle', 'calm-30-plus', 'calm-neck-back', 'calm-bell-plus',
  // Phase 18 ticket 3: Couples (configs/after-dark.js)
  'sweat-together', 'foreplay-fitness', 'strip-circuit', 'kiss-me-reps', 'lift-me-up', 'date-night-burn', 'partners-in-grime',
  'take-it-off', 'slow-burn-couples', 'sweaty-sheets', 'dare-night', 'massage-and-mount', 'couples-kama-sutra-30',
  'thirty-days-of-foreplay', 'ride-along', 'couples-quickie', 'fuck-fit', 'pin-me-down', 'wheelbarrow-race', 'fit-to-fuck-30',
  // Phase 18 ticket 4: Endurance & control, Hip power & thrust, Carry & hold, Flexible & bendy
  'last-all-night', 'edge-control', 'stamina-intervals', 'slow-and-steady', 'control-30',
  'thrust-master', 'pound-it', 'hip-drive-ladders', 'piston', 'thrust-30',
  'hold-her-up', 'against-the-wall', 'carry-me-home', 'grip-it-tight', 'stand-and-deliver-30',
  'bend-me-over', 'open-wide', 'arch-your-back', 'do-the-splits', 'bendy-30',
  // Phase 18 ticket 5: Strip & show-off, Her pleasure, Quickie, Back & knees care
  'pump-before-the-date', 'striptease-pump', 'show-off', 'abs-on-show', 'date-night-pump-30',
  'all-about-her', 'going-down', 'fingers-and-forearms', 'ladies-first', 'her-pleasure-30',
  'quickie', 'wham-bam', 'nooner', 'hot-and-fast', 'quickie-30',
  'no-bad-backs', 'kneel-easy', 'strong-wrists', 'the-morning-after', 'back-and-knees-30',
  // Phase 18 ticket 6: Date night warm-up, Positions tour, Morning glory / Sunday (couple)
  'pre-game', 'before-we-go-out', 'appetizer', 'warm-me-up', 'date-night-warm-up-30',
  'floor-tour-30', 'standing-tour-30', 'bendy-tour-30', 'strong-tour-30', 'grand-tour-30',
  'morning-glory', 'lazy-sunday', 'breakfast-in-bed', 'sleep-in', 'morning-glory-30',
  // Phase 20 ticket 8: Explicit (+20), gym-then-sex / sex-then-sex / positions-only
  'set-then-fuck', 'sweat-then-spread', 'earn-the-pussy', 'lift-her-then-fuck', 'grind-after-reps', 'short-and-dirty', 'long-afternoon',
  'mouth-then-cock', 'tongue-then-thrust', 'fingers-then-fuck', 'eat-then-pound', 'tease-then-bury', 'quick-and-deep', 'slow-deep-fuck',
  'stay-inside-her', 'hold-after-hold', 'deeper-every-hold', 'all-the-positions', 'cock-in-her', 'nothing-but-fucking',
  // Phase 20 ticket 9: Beach body, Bedroom stamina, Sex positions (+27)
  'beach-set-then-fuck', 'beach-pump-then-grab', 'beach-flex-then-spread', 'beach-mouth-then-body', 'beach-lick-the-abs', 'beach-tease-then-grab', 'beach-grab-and-stay', 'beach-shirtless-holds', 'beach-body-she-grabs',
  'bed-set-then-last', 'bed-sweat-then-hard', 'bed-lift-then-again', 'bed-mouth-then-last', 'bed-hands-then-again', 'bed-tease-then-keep', 'bed-stay-hard', 'bed-round-after-round', 'bed-keep-it-up',
  'fold-then-fuck', 'open-then-hold-her', 'kiss-then-fold', 'mouth-then-fold', 'hands-then-the-angle', 'tease-then-fold', 'stay-in-the-fold', 'hold-the-angle', 'deeper-every-angle',
  // Phase 20 ticket 10: Couples, Endurance & control, Hip power & thrust (+27)
  'couple-set-then-fuck', 'couple-sweat-then-hold', 'couple-kiss-then-close', 'couple-mouth-then-both', 'couple-hands-then-both', 'couple-tease-then-both', 'couple-stay-together', 'couple-hold-together', 'couple-deeper-together', 'endure-set-then-edge', 'endure-sweat-then-pace', 'endure-lift-then-last', 'endure-mouth-then-edge', 'endure-hands-then-pace', 'endure-tease-then-edge', 'endure-stay-on-edge', 'endure-pace-the-hold', 'endure-deep-control', 'hip-set-then-drive', 'hip-strong-then-pound', 'hip-kiss-then-thrust', 'hip-mouth-then-drive', 'hip-hands-then-pound', 'hip-tease-then-slam', 'hip-stay-driving', 'hip-glute-holds', 'hip-deep-drive',
  // Phase 20 ticket 11: Carry & hold, Flexible & bendy, Strip & show-off (+27)
  'carry-circuit-then-fuck', 'carry-slow-then-fuck', 'carry-lifts-then-fuck', 'carry-mouth-then-fuck', 'carry-fingers-then-fuck', 'carry-tease-then-fuck', 'carry-mixed-holds', 'carry-longer-holds', 'carry-deeper-holds', 'bendy-circuit-then-fuck', 'bendy-slow-then-fuck', 'bendy-kiss-then-fuck', 'bendy-mouth-then-fuck', 'bendy-fingers-then-fuck', 'bendy-tease-then-fuck', 'bendy-mixed-holds', 'bendy-longer-holds', 'bendy-deeper-holds', 'strip-circuit-then-fuck', 'strip-slow-then-fuck', 'strip-kiss-then-fuck', 'strip-mouth-then-fuck', 'strip-fingers-then-fuck', 'strip-tease-then-fuck', 'strip-mixed-holds', 'strip-longer-holds', 'strip-deeper-holds',
  // Phase 20 ticket 12: Her pleasure, Quickie, Back & knees care (+27)
  'pleasure-circuit-her-come', 'pleasure-strength-her-come', 'pleasure-kiss-her-come', 'pleasure-mouth-her-come', 'pleasure-fingers-her-come', 'pleasure-tease-her-come', 'pleasure-holds-her-come', 'pleasure-longer-her-come', 'pleasure-deeper-her-come', 'quick-circuit-fast-fuck', 'quick-strength-fast-fuck', 'quick-carry-fast-fuck', 'quick-mouth-fast-fuck', 'quick-fingers-fast-fuck', 'quick-tease-fast-fuck', 'quick-holds-fast-fuck', 'quick-longer-fast-fuck', 'quick-deeper-fast-fuck', 'knees-circuit-easy-fuck', 'knees-strength-easy-fuck', 'knees-kiss-easy-fuck', 'knees-mouth-easy-fuck', 'knees-fingers-easy-fuck', 'knees-tease-easy-fuck', 'knees-holds-easy-fuck', 'knees-longer-easy-fuck', 'knees-deeper-easy-fuck',
  // Phase 20 ticket 13: Date night warm-up, Positions tour, Morning glory / Sunday (+27)
  'date-circuit-night', 'date-strength-night', 'date-kiss-night', 'date-mouth-hands', 'date-fingers-mouth', 'date-tease-mouth', 'date-mix-holds', 'date-long-holds', 'date-deep-holds', 'stand-tour-sixty', 'strong-tour-sixty', 'face-tour-sixty', 'behind-tour-sixty', 'close-tour-sixty', 'deep-tour-sixty', 'house-tour-sixty', 'grand-tour-sixty', 'kneel-tour-sixty', 'morning-circuit-bed', 'morning-strength-bed', 'morning-carry-bed', 'morning-mouth-hands', 'morning-fingers-bed', 'morning-tease-sheet', 'sunday-mix-holds', 'sunday-long-holds', 'sunday-deep-holds',
  'grind-circuit-then-fuck', 'brace-slow-then-fuck', 'kiss-squat-then-fuck', 'lick-pussy-then-fuck', 'slide-fingers-then-fuck', 'cloth-tease-then-fuck', 'suck-clit-then-fuck', 'palm-fingers-then-fuck', 'skirt-grind-then-fuck', 'tongue-cunt-then-fuck', 'knuckle-open-then-fuck', 'denim-tease-then-fuck', 'eat-cunt-then-fuck', 'pin-mix-stay-in', 'grip-long-stay-in', 'sink-deep-stay-in', 'fold-mix-stay-in', 'press-long-stay-in', 'drive-deep-stay-in', 'lock-mix-stay-in', 'brace-long-stay-in', 'root-deep-stay-in', 'clasp-mix-stay-in',
  'grind-circuit-fuck', 'lift-her-slow', 'tongue-her-open', 'finger-her-open', 'tease-clothes-off', 'mouth-down-body', 'curl-inside-her', 'counter-grind-mouth', 'eat-her-below', 'hook-fingers-deep', 'couch-tease-taste', 'slow-eat-her', 'mix-her-holds', 'stay-buried-in', 'deeper-each-thrust', 'chair-bed-mix', 'park-inside-her', 'fold-her-deeper', 'floor-mix-holds', 'pin-her-down', 'heels-high-deep', 'stand-lie-mix',
  'beach-circuit-strip', 'beach-strength-strip', 'beach-kiss-strip', 'beach-show-strip', 'beach-mouth-warm', 'beach-finger-warm', 'beach-tease-warm', 'beach-mix-holds', 'beach-long-holds', 'beach-deep-holds', 'stamina-circuit-fuck', 'stamina-strength-fuck', 'stamina-kiss-fuck', 'stamina-core-fuck', 'stamina-mouth-fuck', 'stamina-fingers-last', 'stamina-tease-fuck', 'stamina-mix-holds', 'stamina-long-holds', 'stamina-deep-holds',
  'fold-hips-circuit', 'lift-hip-strength', 'reach-kiss-squat', 'angle-snap-circuit', 'spread-mouth-hands', 'curl-finger-reach', 'grind-cloth-tease', 'seal-back-holds', 'lock-hip-still', 'depth-fold-over', 'dare-circuit-close', 'outlast-slow-set', 'kiss-bet-squat', 'tag-circuit-play', 'pin-then-take', 'giggle-mouth-hands', 'silly-finger-mouth', 'skirt-grind-mouth', 'slow-mouth-palms', 'knuckle-wet-mouth', 'laugh-mix-holds', 'stillness-long-hold', 'deeper-bet-holds', 'bed-mix-holds', 'cling-long-stay',
  'control-brace-circuit', 'wind-slow-strength', 'pace-kiss-squats', 'edge-mouth-hands', 'holdoff-finger-mouth', 'quiet-pelvis-holds', 'clock-long-holds', 'hips-circuit-drive', 'glutes-slow-pound', 'thrust-kiss-squats', 'drive-mouth-hands', 'hips-finger-slam', 'pound-hold-runs', 'thrust-long-holds', 'carry-circuit-grip', 'lift-slow-carries', 'carry-lifts-circuit', 'grip-mouth-hold', 'lift-finger-carry', 'carry-held-clusters', 'grip-long-carries',
  'bendy-circuit-fold', 'bendy-strength-kneel', 'bendy-kiss-fold', 'bendy-mouth-deeper', 'bendy-fingers-fold', 'bendy-hold-spread', 'bendy-long-kneel', 'strip-circuit-show', 'strip-strength-flex', 'strip-kiss-display', 'strip-mouth-watch', 'strip-hands-display', 'strip-hold-display', 'strip-long-display', 'pleasure-circuit-come', 'pleasure-strength-come', 'pleasure-kiss-clit', 'pleasure-mouth-come', 'pleasure-fingers-come', 'pleasure-hold-come', 'pleasure-long-come',
  'quick-half-dressed', 'quick-no-waiting', 'quick-carry-fuck', 'quick-mouth-rush', 'quick-finger-rush', 'quick-straight-in', 'quick-timed-holds', 'knees-towel-hips', 'knees-long-spine', 'knees-soft-squat', 'knees-propped-elbows', 'knees-bed-edge', 'knees-thick-pad', 'knees-headboard', 'date-silk-scent', 'date-cab-waiting', 'date-wine-mouth', 'date-heels-leave', 'date-coat-chill', 'date-tie-inside', 'date-shirt-gown',
  'legs-high-deep-fuck', 'bend-over-for-you', 'rug-down-and-fuck', 'lap-close-and-fuck', 'edge-open-and-fuck', 'side-by-side-hold', 'on-her-back-holds', 'sunday-move-and-fuck', 'slow-sunday-bed-fuck', 'carry-her-sunday-fuck', 'mouth-sunday-slow-fuck', 'fingers-sunday-bed-fuck', 'stay-inside-sunday-long', 'linger-deep-sunday-hold',
  'hard-circuit-then-fuck', 'hard-slow-then-fuck', 'hard-mouth-on-her', 'hard-fingers-open-her', 'hard-clothes-then-fuck', 'hard-tongue-and-hands', 'hard-finger-and-mouth', 'hard-grind-then-lick', 'hard-eat-her-cunt', 'hard-stroke-her-open', 'hard-holds-on-cock', 'hard-stay-and-fuck', 'hard-sink-and-grind', 'hard-rearrange-holds', 'hard-long-hold-fuck', 'hard-full-depth-fuck', 'hard-grip-and-fuck',
  'circuit-grind-fuck', 'strength-press-fuck', 'mouth-shirt-fuck', 'finger-skirt-fuck', 'cloth-grind-fuck', 'lap-lick-fuck', 'cotton-finger-fuck', 'panty-grind-fuck', 'stomach-lick-fuck', 'stay-in-holds', 'hold-run-fuck', 'depth-hip-fuck', 'buried-run-fuck', 'palm-hold-fuck', 'fold-deeper-fuck', 'stand-hold-fuck',
  // Phase 22 ticket 19: Rough and Kink-lite, 12 each
  'rough-set-then-spank', 'rough-sweat-then-pin', 'rough-lift-then-hold', 'rough-grind-then-hair',
  'rough-spank-then-fuck', 'rough-pin-then-thrust', 'rough-quick-and-mean', 'rough-long-hold',
  'rough-stay-and-spank', 'rough-pin-and-stay', 'rough-hair-and-hips', 'rough-held-down',
  'kink-set-then-blind', 'kink-sweat-then-cuffs', 'kink-lift-then-gag', 'kink-grind-then-wax',
  'kink-blind-then-fuck', 'kink-gag-then-ice', 'kink-quick-tie', 'kink-long-ice',
  'kink-stay-blind', 'kink-cuffed-open', 'kink-gagged-holds', 'kink-ice-wax',
  // Phase 22 ticket 20: Body play and Rimming, 12 each
  'body-set-then-tits', 'body-sweat-then-grind', 'body-lift-then-thigh', 'body-push-then-cum',
  'body-tits-then-hold', 'body-grind-then-hold', 'body-quick-and-slick', 'body-long-on-her',
  'body-stay-on-tits', 'body-grind-and-stay', 'body-thighs-and-hips', 'body-cum-on-her',
  'rim-set-then-tongue', 'rim-sweat-then-ass', 'rim-lift-then-rim', 'rim-grind-then-tongue',
  'rim-tongue-then-fuck', 'rim-ass-then-cock', 'rim-quick-lick', 'rim-long-tongue',
  'rim-stay-and-lick', 'rim-open-and-eat', 'rim-tongue-holds', 'rim-her-tongue',
  // Phase 22 ticket 20b: Edging and Massage, 12 each
  'edge-set-then-stop', 'edge-sweat-then-out', 'edge-lift-then-slow', 'edge-squat-then-still',
  'edge-stop-then-fuck', 'edge-out-then-shallow', 'edge-quick-stop', 'edge-long-still',
  'edge-stay-and-stop', 'edge-pull-and-stay', 'edge-slow-and-deep', 'edge-brace-and-hold',
  'massage-set-then-oil', 'massage-sweat-then-hands', 'massage-lift-then-back', 'massage-squat-then-oil',
  'massage-oil-then-fuck', 'massage-forearm-then-fuck', 'massage-quick-oil', 'massage-long-oil',
  'massage-stay-oiled', 'massage-hands-down-her', 'massage-oiled-holds', 'massage-she-oils-you',
  // Phase 22 ticket 20c: Strip and tease, and Shower and bath, 12 each
  'tease-set-then-zip', 'tease-sweat-then-bra', 'tease-lift-then-panties', 'tease-grind-then-lap',
  'tease-zip-then-fuck', 'tease-bra-then-cock', 'tease-quick-strip', 'tease-long-strip',
  'tease-stay-and-peel', 'tease-skirt-up', 'tease-dry-holds', 'tease-her-strip',
  'shower-set-then-tile', 'shower-sweat-then-soap', 'shower-lift-then-tub', 'shower-push-then-stream',
  'shower-tile-then-hold', 'shower-soap-then-hold', 'shower-quick-and-wet', 'shower-long-steam',
  'shower-stay-on-tile', 'shower-soap-and-stay', 'shower-tub-and-hips', 'shower-stream-on-her',
  // Phase 22 ticket 20d: Pool and Hot tub, 12 each
  'pool-set-then-wall', 'pool-sweat-then-step', 'pool-lift-then-lounge', 'pool-push-then-jet',
  'pool-wall-then-hold', 'pool-step-then-hold', 'pool-quick-soak', 'pool-long-soak',
  'pool-stay-on-wall', 'pool-step-and-stay', 'pool-lounge-and-hips', 'pool-jet-on-her',
  'hottub-set-then-seat', 'hottub-sweat-then-bubbles', 'hottub-lift-then-cover', 'hottub-push-then-heat',
  'hottub-seat-then-hold', 'hottub-bubble-then-hold', 'hottub-quick-steam', 'hottub-long-heat',
  'hottub-stay-in-seat', 'hottub-bubbles-and-stay', 'hottub-cover-and-hips', 'hottub-jet-in-seat',
  // Phase 22 ticket 20e: Balcony and Doorframe, 12 each
  'balcony-set-then-rail', 'balcony-sweat-then-glass', 'balcony-lift-then-chair', 'balcony-push-then-table',
  'balcony-rail-then-hold', 'balcony-glass-then-hold', 'balcony-quick-air', 'balcony-long-night',
  'balcony-stay-at-rail', 'balcony-glass-and-stay', 'balcony-chair-and-hips', 'balcony-fingers-on-her',
  'doorframe-set-then-jamb', 'doorframe-sweat-then-lintel', 'doorframe-lift-then-threshold', 'doorframe-push-then-door',
  'doorframe-jamb-then-hold', 'doorframe-lintel-then-hold', 'doorframe-quick-frame', 'doorframe-long-frame',
  'doorframe-stay-on-jamb', 'doorframe-lintel-and-stay', 'doorframe-threshold-and-hips', 'doorframe-mouth-in-frame',
];

// Phase 23 (ticket 1): each fitness family file lists its new programs in its own `order23`, appended here in the family
// order, so the content tickets never edit this one list (and two of them can build at once)
const ORDER23 = FAMILY_FILES.flatMap((f) => f.order23 || []);
ORDER.push(...ORDER23);
const byId = new Map(FAMILY_FILES.flat().map((c) => [c.id, c]));
if (byId.size !== ORDER.length || ORDER.some((id) => !byId.has(id))) throw new Error('programs.config.js: ORDER and configs/ disagree');
// Variety programs (Phase 16) are dealt into an ordinary cycle here, so every reader of the library sees one kind of config
const { expand } = require('./variety.js');
// Phase 26: a re-timed program carries its band as `long` (configs/long.js), and the builder lengthens its days to it
const LONG = require('./configs/long.js');
// Phase 36 ticket 3 (305, 365): every couple program is dealt in order (no couple program had been started)
const ruled = (c) => (c.couple ? { ...c, sessionRules: 1 } : c);
module.exports = ORDER.map((id) => expand(ruled(LONG[id] ? { ...byId.get(id), long: LONG[id] } : byId.get(id))));
