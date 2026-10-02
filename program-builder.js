/* Program Builder: build(config, catalogue) -> a program (60 days unless its config says `days`); buildDay(recipe, { day, level, lever, rnd, memory },
   catalogue) -> one day. Pure: runs in Node (the build) and in the page (your own programs, Phase 6, and the random
   workout, Phase 7); the Exercise Catalogue is passed in.
   recipesOf(config) -> { dayTypeKey: recipe }: what one day needs (blocks, time range, equipment, rests, catalogue,
   levers, absSlots). build() is the loop over its days with one shared memory (newMemory(): what was used, how
   often, which stretches) and one rnd (makeRnd(seed)), so its days are what buildDay gives one by one.
   Owns the time model, rest values, exercise pools, progression levers, stretch picking and fitting.
   Node only: CONFIGS (programs.config.js), buildConfig / buildAll, and frozen programs (Three-Split 60),
   whose already-generated days are read from disk so saved progress stays valid (ADR 1). */
(function (root, Formats, L) {
  const REST = { set: 30, exercise: 60, beforeAbs: 120, superset: 45, round: 60, block: 60 };
  const ABS_SLOTS = ['absW', 'abs', 'abs?'];

  // ---------- deterministic randomness ----------
  function makeRnd(seedText) {
    let seed = [...seedText].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  }

  // what a run of days remembers, so an exercise or stretch isn't picked twice in a row
  const newMemory = () => ({ used: {}, count: {}, stretchUsed: {} });

  // ---------- recipes ----------
  // One recipe per day type: what one day needs. A day type's levers and absSlots win over the program's.
  function recipesOf(cfg) {
    const out = {};
    Object.entries(cfg.dayTypes).forEach(([key, type]) => {
      out[key] = {
        program: cfg.id, key, label: type.label, blocks: type.blocks,
        minutes: type.minutes || cfg.minutes, // a day type can have its own time range
        equip: cfg.equip, // undefined = all gear
        rests: cfg.rests ? { ...REST, ...cfg.rests } : REST, catalogue: cfg.catalogue || 0,
        levers: type.levers || cfg.levers,
        absSlots: type.absSlots || cfg.absSlots || ABS_SLOTS, // every day ends with abs, unless absSlots: []
      };
    });
    return out;
  }

  function makeBuilder(cat) {
    const { EX, allowedIn, scaleReps } = cat;

    // ---------- exercise pools ----------
    const ids = (fn) => Object.keys(EX).filter((k) => fn(EX[k]));
    const POOLS = {
      push: ['pushup', 'diamond_pushup', 'dive_bomber', 'spiderman_pushup', 'explosive_pushup', 'archer_pushup', 'plank_to_pushup'],
      pushLoad: ['db_floor_press', 'db_shoulder_press', 'kb_press', 'db_pullover'],
      shoulders: ['db_shoulder_press', 'kb_press', 'pike_pushup', 'lateral_raise', 'db_front_raise', 'kb_halo'],
      pullBar: ['pullup', 'chinup', 'negative_pullup', 'chin_hold', 'dead_hang', 'scap_pullup'],
      pullBarMain: ['pullup', 'chinup', 'negative_pullup'],
      row: ['db_row', 'one_arm_row', 'renegade_row', 'kb_high_pull'],
      biceps: ['db_curl', 'hammer_curl'],
      triceps: ['db_skullcrusher', 'overhead_triceps_ext', 'db_kickback', 'diamond_pushup'],
      arms: ['db_curl', 'hammer_curl', 'db_skullcrusher', 'overhead_triceps_ext', 'db_kickback'],
      squat: ['goblet_squat', 'db_squat', 'kb_front_squat', 'kb_sumo_deadlift'],
      hinge: ['db_rdl', 'kb_deadlift', 'kb_swing', 'single_leg_rdl'],
      lunge: ['db_lunge', 'reverse_lunge', 'lateral_lunge', 'split_squat', 'cossack_squat'],
      singleLeg: ['split_squat', 'single_leg_rdl', 'shrimp_squat', 'single_leg_bridge', 'cossack_squat', 'reverse_lunge'],
      glute: ['glute_bridge', 'single_leg_bridge', 'kb_swing', 'kb_deadlift', 'db_rdl'],
      legsBw: ['reverse_lunge', 'cossack_squat', 'shrimp_squat', 'squat_jump', 'jump_lunge', 'glute_bridge', 'single_leg_bridge', 'wall_sit'],
      total: ['db_thruster', 'kb_clean_press', 'burpee', 'kb_swing', 'kb_snatch', 'turkish_getup'],
      cardio: ['jumping_jacks', 'high_knees', 'burpee', 'squat_jump', 'jump_lunge', 'butt_kicks', 'punches', 'squat_thrust', 'mountain_climber', 'bear_crawl'],
      kbBallistic: ['kb_swing', 'kb_snatch', 'kb_clean_press', 'kb_high_pull'],
      kbUpper: ['kb_press', 'kb_clean_press', 'kb_high_pull', 'kb_halo', 'turkish_getup'],
      kbLower: ['goblet_squat', 'kb_front_squat', 'kb_sumo_deadlift', 'kb_deadlift', 'lateral_lunge'],
      kbAll: ['kb_swing', 'kb_clean_press', 'kb_press', 'kb_high_pull', 'goblet_squat', 'kb_sumo_deadlift', 'kb_snatch', 'kb_front_squat', 'kb_deadlift', 'turkish_getup', 'lateral_lunge'],
      kbSwing: ['kb_swing'],
      carry: ['suitcase_march', 'bear_crawl', 'kb_halo'],
      // Phase 5: yoga
      ygStand: ['warrior_one', 'warrior_two', 'reverse_warrior', 'triangle_pose', 'extended_side_angle', 'high_lunge', 'chair_pose'],
      ygBalance: ['tree_pose', 'warrior_three', 'half_moon', 'dancer_pose'],
      ygFloor: ['pigeon_pose', 'seated_twist', 'low_lunge', 'camel_pose', 'locust_pose', 'bridge_pose', 'garland_pose'],
      ygHips: ['pigeon_pose', 'seated_twist', 'garland_pose', 'low_lunge'],
      ygBack: ['bridge_pose', 'locust_pose', 'camel_pose', 'sphinx_pose'],
      ygCore: ['boat_pose', 'plank', 'side_plank', 'dolphin_pose', 'locust_pose', 'crow_pose', 'bridge_pose'],
      ygRest: ['childs_pose', 'puppy_pose', 'happy_baby', 'supine_twist', 'seated_forward_fold', 'forward_fold'],
      ygYinHips: ['pigeon_pose', 'low_lunge', 'butterfly', 'happy_baby', 'garland_pose', 'seated_forward_fold'],
      ygYinSpine: ['sphinx_pose', 'puppy_pose', 'supine_twist', 'childs_pose', 'seated_twist', 'forward_fold'],
      // Phase 5: Pilates
      plAbs: ['hundred', 'single_leg_stretch', 'double_leg_stretch', 'scissors', 'criss_cross'],
      plRoll: ['roll_up', 'rolling_like_a_ball', 'spine_stretch', 'seal', 'saw'],
      plBack: ['swan', 'swimming', 'leg_pull_front'],
      plSide: ['side_kick', 'single_leg_circles', 'shoulder_bridge'],
      plGlute: ['shoulder_bridge', 'side_kick', 'swimming', 'standing_leg_lift', 'plie_squat'],
      // Phase 5: boxing (one combo per bout)
      bxBasic: ['jab_cross', 'double_jab_cross', 'jab_cross_hook', 'cross_hook_cross', 'body_head'],
      bxPower: ['jab_cross_uppercut', 'rear_upper_hook_cross', 'four_punch', 'jab_body_hook', 'cross_hook_cross'],
      bxDefense: ['slip_counter', 'roll_hook', 'bob_and_weave'],
      bxMove: ['shadow_footwork', 'speed_bag', 'bob_and_weave'],
      // Phase 5: kickboxing
      kkKick: ['teep', 'front_kick', 'roundhouse', 'side_thrust_kick', 'switch_kick'],
      kkCombo: ['jab_cross_kick', 'jab_teep', 'hook_low_kick', 'kick_four'],
      kkKnee: ['knee_strike', 'clinch_knees'],
      kkSpin: ['back_kick', 'side_thrust_kick'],
      // Phase 5: flexibility (also uses some yoga poses and the cool-down stretches)
      fxSplit: ['half_split', 'front_split', 'lizard_pose', 'kneeling_quad', 'low_lunge'],
      fxStraddle: ['seated_straddle', 'frog_pose', 'wide_leg_fold', 'butterfly', 'garland_pose'],
      fxHips: ['figure_four', 'pigeon_pose', 'lizard_pose', 'frog_pose', 'happy_baby', 'garland_pose'],
      fxHam: ['lying_hamstring', 'half_split', 'forward_fold', 'seated_forward_fold', 'wide_leg_fold'],
      fxUpper: ['thread_the_needle', 'reverse_prayer', 'cow_face_arms', 'puppy_pose', 'chest_opener', 'cross_body_shoulder', 'overhead_triceps'],
      fxQuad: ['kneeling_quad', 'side_lying_quad', 'low_lunge', 'camel_pose'],
      fxSpine: ['supine_twist', 'seated_twist', 'sphinx_pose', 'childs_pose', 'cat_cow'],
      // Phase 5: mobility & posture
      mbSpine: ['open_book', 'quadruped_rotation', 'cat_cow', 'jefferson_curl'],
      mbShoulder: ['shoulder_cars', 'wall_slides', 'prone_ytw', 'chin_tucks', 'thread_the_needle'],
      mbHip: ['hip_cars', 'ninety_ninety', 'hip_airplane', 'deep_squat_hold', 'ankle_rocks'],
      mbPosture: ['chin_tucks', 'wall_slides', 'prone_ytw', 'reverse_prayer', 'open_book'],
      // Phase 5: balance & stability
      blStatic: ['single_leg_stand', 'heel_to_toe_walk', 'tree_pose', 'warrior_three'],
      blDynamic: ['single_leg_reach', 'star_excursion', 'tree_to_airplane', 'lunge_to_balance', 'single_leg_rdl_bw'],
      blStrength: ['pistol_box_squat', 'single_leg_calf_raise', 'single_leg_rdl_bw', 'copenhagen_plank', 'lunge_to_balance'],
      blPower: ['single_leg_hop_stick', 'lateral_bound_hold', 'star_excursion'],
      // Phase 5: HIIT (new moves with the existing cardio ones)
      hiit: ['skater_jumps', 'tuck_jumps', 'sprawl', 'burpee_broad_jump', 'plank_jacks', 'fast_step_ups', 'seal_jacks', 'burpee', 'mountain_climber', 'squat_jump', 'high_knees', 'jump_lunge'],
      hiitSec: ['fast_feet', 'sprint_in_place', 'lateral_shuffle'],
      // Phase 5: plyometrics
      plyoLow: ['broad_jump', 'drop_squat', 'pogo_hops', 'pause_squat_jump', 'squat_jump', 'tuck_jumps', 'star_jumps'],
      plyoLat: ['lateral_bounds', 'skater_jumps', 'single_leg_hops', 'bounding', 'power_skips'],
      plyoUp: ['clap_pushup', 'explosive_pushup', 'sprawl', 'plank_jacks', 'burpee'],
      plyoVert: ['pogo_hops', 'pause_squat_jump', 'tuck_jumps', 'squat_jump', 'star_jumps', 'single_leg_hops', 'power_skips'],
      // Phase 5: more strength. New pool names, so the older programs' pools (and days) stay as they are.
      pushLoad2: ['db_floor_press', 'db_shoulder_press', 'kb_press', 'db_pullover', 'floor_fly', 'arnold_press'],
      chest2: ['db_floor_press', 'floor_fly', 'db_pullover', 'pushup', 'explosive_pushup', 'clap_pushup'],
      shoulders2: ['db_shoulder_press', 'arnold_press', 'kb_press', 'bottoms_up_press', 'lateral_raise', 'db_front_raise', 'pike_pushup'],
      row2: ['db_row', 'one_arm_row', 'renegade_row', 'kb_high_pull', 'kb_row'],
      pullBar2: ['pullup', 'chinup', 'negative_pullup', 'commando_pullup', 'chin_hold', 'scap_pullup'],
      barCore: ['hang_knee_raise', 'l_sit_hang', 'dead_hang'],
      squat2: ['goblet_squat', 'db_squat', 'kb_front_squat', 'zercher_squat', 'kb_sumo_deadlift'],
      lunge2: ['db_lunge', 'reverse_lunge', 'split_squat', 'bulgarian_split_squat', 'db_step_up', 'lateral_lunge', 'cossack_squat'],
      glute2: ['hip_thrust', 'glute_bridge', 'single_leg_bridge', 'db_rdl', 'kb_swing', 'kb_deadlift'],
      hinge2: ['db_rdl', 'kb_deadlift', 'kb_swing', 'single_leg_rdl', 'hip_thrust'],
      kbUpper2: ['kb_press', 'bottoms_up_press', 'kb_row', 'kb_clean_press', 'kb_high_pull', 'kb_halo'],
      kbLower2: ['goblet_squat', 'kb_front_squat', 'zercher_squat', 'kb_sumo_deadlift', 'kb_deadlift', 'lateral_lunge'],
      kbCore2: ['kb_windmill', 'turkish_getup', 'kb_halo', 'suitcase_march'],
      // Phase 5: more everyday
      core2: ['plank', 'side_plank', 'hollow_hold', 'dead_bug', 'bird_dog', 'shoulder_taps', 'russian_twist', 'body_saw', 'windshield_wipers', 'cross_climber', 'plank_walkout', 'reverse_plank', 'side_plank_dip', 'heel_taps', 'plank_reach', 'bear_hold'],
      coreRot: ['windshield_wipers', 'side_plank_dip', 'heel_taps', 'russian_twist', 'cross_climber', 'side_plank', 'bicycle_crunch'],
      coreAnti: ['plank', 'body_saw', 'plank_reach', 'bear_hold', 'dead_bug', 'bird_dog', 'reverse_plank'],
      coreHollow: ['hollow_hold', 'hollow_rock', 'v_up', 'dragon_flag_negative', 'leg_raise', 'plank_walkout'],
      pullBw: ['table_row', 'superman'],
      pushBw2: ['pushup', 'diamond_pushup', 'spiderman_pushup', 'pike_pushup', 'plank_to_pushup', 'clap_pushup', 'archer_pushup'],
      legsBw2: ['reverse_lunge', 'cossack_squat', 'shrimp_squat', 'squat_jump', 'glute_bridge_march', 'single_leg_bridge', 'wall_sit', 'lateral_lunge'],
      core: ['plank', 'side_plank', 'hollow_hold', 'hollow_rock', 'dead_bug', 'weighted_dead_bug', 'bird_dog', 'bear_crawl', 'suitcase_march', 'kb_halo', 'db_side_bend', 'shoulder_taps', 'superman', 'russian_twist'],
      // Phase 14 (catalogue 8): new pool names only, so no config built before them changes
      runDrill: ['a_skip', 'wall_drive', 'high_knees', 'butt_kicks', 'power_skips'],
      runLegs: ['reverse_lunge', 'split_squat', 'single_leg_bridge', 'single_leg_rdl_bw', 'single_leg_calf_raise', 'glute_bridge_march', 'lunge_to_balance'],
      runPlyo: ['pogo_hops', 'bounding', 'single_leg_hops', 'skater_jumps', 'broad_jump'],
      runFast: ['sprint_in_place', 'fast_feet', 'arm_drive', 'backpedal'],
      courtMove: ['carioca', 'shuttle_touch', 'lateral_shuffle', 'backpedal', 'fast_feet'],
      courtPower: ['split_step', 'lateral_bounds', 'skater_jumps', 'broad_jump', 'tuck_jumps', 'single_leg_hop_stick'],
      courtLegs: ['cossack_squat', 'lateral_lunge', 'split_squat', 'single_leg_rdl_bw', 'reverse_lunge', 'copenhagen_plank'],
    };
    // Pools computed from the catalogue. An exercise marked `added: N` (the phase that added it) joins them only
    // for configs with `catalogue: N` or later, so new exercises can't reshuffle the days of existing programs.
    // Named pools that later catalogues add to (at the end, so a config at an older catalogue draws exactly as before)
    const POOL_ADDS = { pullBw: { 6: ['prone_lat_pull', 'superman_row'], 7: ['reverse_snow_angel'] } }; // Phase 10 and 13: floor-only pulls
    const computedPools = (upTo) => {
      const has = (fn) => ids((e) => (e.added || 0) <= upTo && fn(e));
      const adds = Object.fromEntries(Object.entries(POOL_ADDS).map(([name, byCat]) => [name, Object.entries(byCat).filter(([n]) => +n <= upTo).flatMap(([, list]) => list)]).filter(([, list]) => list.length));
      return {
        ...Object.fromEntries(Object.entries(adds).map(([name, list]) => [name, [...POOLS[name], ...list]])),
        mobility: has((e) => e.cat === 'warmup' || e.cat === 'cooldown'),
        abs: has((e) => e.cat === 'abs' && e.id !== 'mountain_climber' && !(e.equip || []).includes('bar')),
        absW: has((e) => e.cat === 'abs' && e.load && !(e.equip || []).includes('bar')),
        warmups: has((e) => e.cat === 'warmup'),
        cooldowns: has((e) => e.cat === 'cooldown'),
      };
    };
    const COMPUTED = new Map();
    const computed = (upTo) => COMPUTED.get(upTo) || COMPUTED.set(upTo, computedPools(upTo)).get(upTo);
    Object.assign(POOLS, computed(0)); // the pools as existing programs see them


    // easier -> harder, used by the "variation" lever
    const HARDER = {
      pushup: 'archer_pushup', spiderman_pushup: 'archer_pushup', diamond_pushup: 'explosive_pushup', plank_to_pushup: 'archer_pushup',
      goblet_squat: 'kb_front_squat', db_squat: 'kb_front_squat', split_squat: 'shrimp_squat', reverse_lunge: 'cossack_squat', lateral_lunge: 'cossack_squat',
      db_rdl: 'single_leg_rdl', glute_bridge: 'single_leg_bridge', kb_deadlift: 'kb_swing', negative_pullup: 'pullup', chin_hold: 'chinup',
      scap_pullup: 'negative_pullup', dead_hang: 'chin_hold', crunch: 'v_up', dead_bug: 'weighted_dead_bug', hollow_hold: 'hollow_rock',
      kb_swing: 'kb_snatch', kb_press: 'kb_clean_press', situp: 'db_situp', leg_raise: 'v_up', knee_tuck: 'v_up', squat_jump: 'jump_lunge',
      plank: 'bear_crawl', bird_dog: 'bear_crawl', weighted_crunch: 'weighted_toe_touch',
      // Phase 5 (new exercises only, so existing programs keep their days)
      chair_pose: 'twisting_chair', triangle_pose: 'half_moon', high_lunge: 'warrior_three', tree_pose: 'dancer_pose',
      bridge_pose: 'camel_pose', dolphin_pose: 'crow_pose',
      roll_up: 'teaser', single_leg_stretch: 'double_leg_stretch', rolling_like_a_ball: 'seal',
      jab_cross: 'jab_cross_hook', double_jab_cross: 'four_punch', jab_cross_hook: 'four_punch', body_head: 'jab_body_hook',
      jab_cross_uppercut: 'rear_upper_hook_cross', slip_counter: 'roll_hook',
      single_leg_reach: 'star_excursion', lunge_to_balance: 'pistol_box_squat', single_leg_stand: 'heel_to_toe_walk',
      tuck_jumps: 'burpee_broad_jump', sprawl: 'burpee_broad_jump', seal_jacks: 'skater_jumps', fast_step_ups: 'tuck_jumps',
      pause_squat_jump: 'tuck_jumps', pogo_hops: 'single_leg_hops', drop_squat: 'broad_jump', power_skips: 'bounding',
      hang_knee_raise: 'l_sit_hang', floor_fly: 'db_pullover', bulgarian_split_squat: 'shrimp_squat', db_step_up: 'bulgarian_split_squat', kb_row: 'kb_high_pull',
      heel_taps: 'windshield_wipers', plank_reach: 'body_saw', bear_hold: 'plank_walkout', glute_bridge_march: 'single_leg_bridge',
      teep: 'jab_teep', roundhouse: 'switch_kick', jab_cross_kick: 'kick_four', knee_strike: 'clinch_knees', front_kick: 'side_thrust_kick',
    };
    // holds: like reps (the level's number from the catalogue), said the way it feels in a flow
    const LEVER_TEXT = { base: 'Base', reps: 'More reps', holds: 'Longer holds', weight: 'Heavier weights', variation: 'Harder variations', tempo: 'Slow tempo' };

    // ---------- timing ----------
    // R: the program's rests (REST unless its config overrides some, like plyometrics' longer rests)
    const blockTime = (b, R = REST) => Formats.of(b).time(b, R, EX);
    function dayTime(blocks, R = REST) {
      return blocks.reduce((s, b, i) => s + blockTime(b, R) + (i ? (b.kind === 'abs' ? R.beforeAbs : R.block) : 0), 0);
    }

    // ---------- stretches (same approach as Three-Split 60) ----------
    function pickStretches(pool, blocks, seconds, day, used) {
      const w = {};
      blocks.forEach((b) => b.items.forEach((it) => {
        const k = b.sets || b.rounds || 3;
        EX[it.ex].muscles.primary.forEach((m) => { w[m] = (w[m] || 0) + 2 * k; });
        EX[it.ex].muscles.secondary.forEach((m) => { w[m] = (w[m] || 0) + k; });
      }));
      ['abs', 'obliques', 'hip_flexors'].forEach((m) => { if (w[m]) w[m] *= 0.5; });
      const max = Math.max(1, ...Object.values(w)); Object.keys(w).forEach((m) => { w[m] /= max; });
      const chosen = []; let t = 0;
      while (t < seconds && chosen.length < pool.length) {
        const score = (id) => {
          const m = EX[id].muscles, ago = day - (used[id] || -99);
          return m.primary.reduce((a, x) => a + (w[x] || 0), 0) + 0.5 * m.secondary.reduce((a, x) => a + (w[x] || 0), 0) - (ago <= 2 ? 0.45 : 0) - (ago <= 5 ? 0.15 : 0);
        };
        const id = pool.filter((x) => !chosen.includes(x)).sort((a, b) => score(b) - score(a))[0];
        chosen.push(id); t += EX[id].r[0] * (EX[id].side ? 2 : 1); used[id] = day;
        EX[id].muscles.primary.forEach((m) => { if (w[m]) w[m] *= 0.25; });
        EX[id].muscles.secondary.forEach((m) => { if (w[m]) w[m] *= 0.6; });
      }
      return { items: chosen.map((id) => ({ ex: id, n: EX[id].r[0] })), seconds: t };
    }

    // ---------- one day ----------
    // recipe: from recipesOf(cfg). opts: day (1-60), level (1-3), lever (optional: this day's lever, instead of the
    // recipe's for the level), rnd (makeRnd), memory (newMemory(), shared by the days of a run). Fills the memory.
    // plan(): the day's exercises at this level (candidates per slot) and each block's choices (its value, and which
    // optional slots it keeps); buildDay walks the choices to land in the time range, blockTimes() lists what each costs.
    function plan(recipe, { level, lever, rnd, memory }) {
      const cp = computed(recipe.catalogue);
      const allow = (id) => allowedIn(recipe.equip, EX[id]);
      const { used, count } = memory;
      const pool = (name) => {
        const p = cp[name] || POOLS[name] || [name];
        const list = p.filter((id) => EX[id] && allow(id));
        if (!list.length) throw new Error(`${recipe.program}: pool ${name} is empty`);
        return list;
      };
      const candidate = (name, taken) => {
        const opts = pool(name).filter((id) => !taken.has(id));
        const list = opts.length ? opts : pool(name);
        list.sort((a, b) => ((used[a] || -99) - (used[b] || -99)) || ((count[a] || 0) - (count[b] || 0)) || (rnd() - 0.5));
        taken.add(list[0]);
        return list[0];
      };
      // a block's lever wins over the day's (an explicit lever, else the day type's, else the program's)
      const dayLever = lever || (level === 1 ? 'base' : recipe.levers[level - 1]);
      const leverOf = (sp) => (sp.lever ? (level === 1 ? 'base' : sp.lever[level - 1]) : dayLever);
      const taken = new Set();

      // make one item at this level, applying the block's lever
      // scale: a block's holds are this many times longer (yin), in steps of 5 s, up to cap seconds
      const makeItem = (id, format, sp) => {
        const { scale, cap } = sp, lever = leverOf(sp);
        let ex = id, note, tempo;
        let idx = level - 1;
        if (lever === 'variation' && HARDER[id] && allow(HARDER[id]) && !taken.has(HARDER[id]) && rnd() < 0.6) { ex = HARDER[id]; taken.add(ex); idx = level - 2; note = 'Harder variation'; }
        else if (lever === 'weight' && EX[id].load) { idx = level - 2; note = 'Go one weight up'; }
        else if (lever === 'tempo' && EX[id].u !== 'sec' && Formats.FORMATS[format].tempo) { idx = level - 2; tempo = 1; note = '3 s lowering'; }
        const e = EX[ex];
        const n = scaleReps(e, e.r[Math.max(0, idx)], format);
        const it = { ex, n: scale ? Math.min(cap || Infinity, Math.round((n * scale) / 5) * 5) : n };
        if (note) it.note = note;
        if (tempo) it.tempo = 1;
        return it;
      };

      // candidates for each block; optional slots end with '?'
      const specs = recipe.blocks.concat(recipe.absSlots.length ? [{ f: 'straight', kind: 'abs', title: 'Abs', slots: recipe.absSlots }] : []);
      const cands = specs.map((sp) => sp.slots.map((slot, si) => {
        // long main blocks may drop their last one or two exercises to fit the time
        const autoOpt = sp.kind !== 'abs' && Formats.FORMATS[sp.f].optionalSlots && si >= Math.max(3, sp.slots.length - (sp.slots.length >= 5 ? 2 : 1));
        const opt = slot.endsWith('?') || autoOpt, name = slot.replace('?', '');
        const poolName = name === 'absW' && !cp.absW.some(allow) ? 'abs' : name;
        return { opt, id: candidate(poolName, taken) };
      }));
      // apply the level (and its lever) once per exercise, before searching
      cands.forEach((list, bi) => list.forEach((c) => { c.item = makeItem(c.id, specs[bi].kind === 'abs' ? 'straight' : specs[bi].f, specs[bi]); }));

      // block parameters (+ which optional slots to keep) the search may pick
      const choices = specs.map((sp, bi) => {
        const o = sp.kind === 'abs' ? { key: 'sets', values: [3], pref: 3 } : Formats.FORMATS[sp.f].options;
        const values = sp.values || o.values;
        const optIdx = cands[bi].map((c, i) => (c.opt ? i : -1)).filter((i) => i >= 0);
        const masks = [];
        for (let m = 0; m < 1 << optIdx.length; m++) masks.push(optIdx.filter((_, j) => m & (1 << j)));
        const out = [];
        values.forEach((v) => masks.forEach((keep) => out.push({ v, keep, pref: sp.pref || o.pref, key: o.key, nOpt: optIdx.length })));
        return out;
      });
      // one block as a choice makes it
      const blockOf = (i, c) => {
        const sp = specs[i];
        const items = cands[i].filter((x, j) => !x.opt || c.keep.includes(j)).map((x) => ({ ...x.item }));
        const b = { format: sp.kind === 'abs' ? 'straight' : sp.f, title: sp.title, kind: sp.kind || 'main', items };
        b[c.key] = c.v;
        if (sp.switchStance) b.switchStance = 1; // bouts: orthodox and southpaw in turn
        if (sp.family) b.family = sp.family; // mixed days: which family this block belongs to (Phase 8's stats read it)
        return b;
      };
      return { specs, choices, blockOf };
    }

    // every block's choices as minutes, at this level with these draws: what a block can be built to (recipe-book.js
    // tries each block of the library alone, so recipes.js knows what a mix of blocks can add up to)
    function blockTimes(recipe, opts) {
      const { specs, choices, blockOf } = plan(recipe, opts);
      return specs.map((sp, i) => choices[i].map((c) => blockTime(blockOf(i, c), recipe.rests) / 60));
    }

    function buildDay(recipe, { day, level, lever, rnd, memory }) {
      const R = recipe.rests;
      const cp = computed(recipe.catalogue);
      const { used, count, stretchUsed } = memory;
      const [lo, hi] = recipe.minutes;
      const { specs, choices, blockOf } = plan(recipe, { level, lever, rnd, memory });

      // search block parameters (+ which optional slots to keep) to land in the time range; a block with a `target`
      // [lo, hi] in minutes (a mix from build your own: its share of the day) is kept inside it when it can: the day's
      // range comes first, then the target (10 a minute outside it), then the preferred values
      let best = null;
      const walk = (bi, pick) => {
        if (bi === specs.length) {
          const blocks = specs.map((sp, i) => blockOf(i, pick[i]));
          const t = dayTime(blocks, R) / 60;
          let pen = t >= lo && t <= hi ? 0 : 100 + Math.abs(t - (lo + hi) / 2) * 10;
          pick.forEach((c, i) => { pen += Math.abs(c.v - c.pref) / (c.key === 'minutes' ? 4 : 1) + (c.nOpt - c.keep.length) * (specs[i].kind === 'abs' ? 2.5 : 1.2); });
          specs.forEach((sp, i) => {
            if (!sp.target) return;
            const bt = blockTime(blocks[i], R) / 60;
            pen += 10 * Math.max(0, sp.target[0] - bt, bt - sp.target[1]);
          });
          if (!best || pen < best.pen) best = { pen, blocks, t };
          return;
        }
        for (const c of choices[bi]) walk(bi + 1, pick.concat([c]));
      };
      walk(0, []);
      const blocks = best.blocks;
      blocks.forEach((b) => b.items.forEach((it) => { used[it.ex] = day; count[it.ex] = (count[it.ex] || 0) + 1; }));

      const warm = pickStretches(cp.warmups, blocks, 60, day, stretchUsed);
      const cool = pickStretches(cp.cooldowns, blocks, 120, day, stretchUsed);
      return {
        day, type: recipe.key, title: recipe.label, level, blocks,
        est: Math.round(best.t),
        warmup: { title: 'Warm-up', kind: 'warmup', items: warm.items, seconds: warm.seconds },
        cooldown: { title: 'Cool-down stretches', kind: 'cooldown', items: cool.items, seconds: cool.seconds },
        stretchMin: Math.round((warm.seconds + cool.seconds) / 60),
      };
    }

    // ---------- program builder: days 1 to its length (KBLength: 60 unless the config says), one memory and one rnd ----------
    function build(cfg) {
      if (cfg.frozen) throw new Error(cfg.id + ' is frozen: its days are read from ' + cfg.frozen + ' by the Node build');
      const rnd = makeRnd(cfg.id), memory = newMemory(), recipes = recipesOf(cfg);
      const days = [];
      const nameCount = {};
      const dayCount = L.dayCountOf(cfg);
      if (!L.LENGTHS.includes(dayCount)) throw new Error(`${cfg.id}: a program is 30 or 60 days, not ${dayCount}`);
      for (let d = 1; d <= dayCount; d++) {
        const level = L.levelOf(dayCount, d);
        const typeKey = cfg.cycle[(d - 1) % cfg.cycle.length];
        const { day, type, title, level: lv, ...rest } = buildDay(recipes[typeKey], { day: d, level, rnd, memory });

        const base = cfg.names[(d - 1) % cfg.names.length];
        nameCount[base] = (nameCount[base] || 0) + 1;
        const name = nameCount[base] > 1 ? `${base} ${['', 'I', 'II', 'III', 'IV', 'V'][nameCount[base]]}` : base;
        days.push({ day, type, title, level: lv, name, ...rest });
      }
      const dayTypes = dayTypesOf(cfg);
      const formats = [...new Set(days.flatMap((w) => w.blocks.filter((b) => b.kind === 'main').map((b) => b.format)))];
      return {
        id: cfg.id, name: cfg.name, subject: cfg.subject, blurb: cfg.blurb, about: cfg.about, split: cfg.split,
        minutes: cfg.minutes, equip: cfg.equip || 'all', gear: cfg.gear || null, formats,
        levels: ['Level I · Intermediate', `Level II · ${levelText(cfg, 1)}`, `Level III · ${levelText(cfg, 2)}`],
        rests: recipes[Object.keys(recipes)[0]].rests, dayTypes, days, ...(cfg.mix ? { mix: cfg.mix } : {}),
      };
    }

    // how a level gets harder, in words. A mix (build your own, `mix`: its subjects) says every block's own lever, in order
    function levelText(cfg, i) {
      if (!cfg.mix) return LEVER_TEXT[cfg.levers[i]];
      const own = Object.values(cfg.dayTypes).flatMap((t) => t.blocks.map((b) => b.lever[i])); // every block of a mix has its lever
      return [...new Set(own)].map((l, k) => (k ? LEVER_TEXT[l].toLowerCase() : LEVER_TEXT[l])).join(', ');
    }
    const COLORS = ['var(--t-cba)', 'var(--t-up)', 'var(--t-low)', 'var(--t-ac)'];
    function dayTypesOf(cfg) {
      const out = {};
      Object.entries(cfg.dayTypes).forEach(([k, v], i) => { out[k] = { label: v.label, short: v.short, c: COLORS[i % 4] }; });
      return out;
    }
    // frozen programs: generated once, then kept byte-for-byte; only their description comes from the config

    return { build, buildDay, blockTimes, dayTypesOf, POOLS, REST, timing: { blockTime, dayTime } };
  }

  const builders = new Map(); // one per catalogue (pools are computed from it)
  const forCatalogue = (cat) => builders.get(cat) || builders.set(cat, makeBuilder(cat)).get(cat);
  const build = (cfg, cat) => forCatalogue(cat).build(cfg);
  const buildDay = (recipe, opts, cat) => forCatalogue(cat).buildDay(recipe, opts);
  const blockTimes = (recipe, opts, cat) => forCatalogue(cat).blockTimes(recipe, opts);
  const api = { build, buildDay, blockTimes, recipesOf, newMemory, makeRnd, ABS_SLOTS };

  /* node:coverage ignore next */ // the page: the builder with nothing else
  if (typeof module === 'undefined' || !module.exports) { root.KBBuilder = api; return; }

  // Node: the program list, frozen programs from disk, and building them all
  const fs = require('fs'), path = require('path');
  const cat = require('./exercises.js'), b = forCatalogue(cat);
  const CONFIGS = require('./programs.config.js');
  function buildFrozen(cfg) {
    const saved = JSON.parse(fs.readFileSync(path.join(__dirname, cfg.frozen), 'utf8'));
    return { ...saved, subject: cfg.subject, about: cfg.about, split: cfg.split, minutes: cfg.minutes, equip: cfg.equip || 'all', formats: ['straight'], dayTypes: b.dayTypesOf(cfg) };
  }
  const buildConfig = (cfg) => (cfg.frozen ? buildFrozen(cfg) : b.build(cfg));
  module.exports = { ...api, buildConfig, buildAll: () => CONFIGS.map(buildConfig), CONFIGS, POOLS: b.POOLS, REST: b.REST, timing: b.timing };
  /* node:coverage ignore next 2 */
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./formats.js') : window.KBFormats,
  typeof module !== 'undefined' && module.exports ? require('./app/length.js') : window.KBLength);
