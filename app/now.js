/* Do now (Phase 25, #200): one exercise for dead time. Pure: runs in Node and in the page (KBNow).
     POOL                       the exercises Do now picks from: no equipment, quiet (no jumping, nothing on the floor),
                                doable standing or seated in work clothes (a hand-picked list; tests/now.test.js checks it)
     pick(cat, { mode, loads, seed, recent, level }) -> { ex, seconds, level }
                                mode 'random': one of the pool by the seed; mode 'missed' (What I missed): one whose first
                                main muscle had the least load in the last 7 days (`loads`, a muscle not in it counts as
                                0), ties broken by the seed. Never one of `recent` (the last three Do nows) while another
                                is left. level: the level its seconds are read at (1 when not given)
     secondsOf(e, level) -> 20-30: a hold's own seconds, else its reps at about 2 s each; both sides when it has two
     loads(entries, dayOf, EX, now) -> { muscle: load } of the days done in the last 7 days, by Stats' own rule
                                (KBStats.dayVolume), random workouts and Do nows included */
(function (root, S) {
  const POOL = [
    // legs: holds and slow reps, no jumps
    'wall_sit', 'bw_squat', 'sit_to_stand', 'sumo_squat_hold', 'chair_pose', 'calf_raise', 'calf_raise_hold',
    'single_leg_calf_raise', 'bent_knee_calf_raise', 'tibialis_raise', 'standing_knee_hold', 'single_leg_rdl_bw',
    'tree_pose',
    // upper body, core and neck
    'wall_pushup', 'standing_oblique_crunch', 'neck_iso_front', 'neck_iso_back', 'neck_iso_side', 'wall_slides',
    // joints and mobility
    'neck_circles', 'shoulder_rolls', 'arm_circles', 'wrist_circles', 'hip_circles', 'ankle_circles',
    'thoracic_rotations', 'trunk_rotations', 'arm_openers', 'elbow_rotations', 'shoulder_cars', 'hip_cars',
    // stretches
    'chest_opener', 'cross_body_shoulder', 'overhead_triceps', 'standing_quad', 'standing_side_stretch', 'neck_side',
    'neck_turn', 'wrist_flexor', 'wrist_extensor', 'wall_calf', 'standing_hamstring', 'wall_pec',
  ];
  const DAY_MS = 24 * 3600 * 1000;

  // one well-mixed number in [0, 1) from a seed (FNV-1a, then a mulberry32 step), as app/random.js draws its day type
  function mixed(seed) {
    let a = [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const oneOf = (list, seed) => list[Math.floor(mixed(seed) * list.length)];

  function secondsOf(e, level) {
    const n = e.r[Math.min(3, Math.max(1, level)) - 1];
    const s = (e.u === 'sec' ? n : n * 2) * (e.side ? 2 : 1);
    return Math.min(30, Math.max(20, Math.round(s)));
  }

  function pick(cat, { mode = 'random', loads = {}, seed = '', recent = [], level = 1 } = {}) {
    const fresh = POOL.filter((id) => !recent.includes(id));
    const list = fresh.length ? fresh : POOL.slice();
    let ex;
    if (mode === 'missed') {
      const muscleOf = (id) => cat.EX[id].muscles.primary[0];
      const muscles = [...new Set(list.map(muscleOf))];
      const least = Math.min(...muscles.map((m) => loads[m] || 0));
      const lowest = muscles.filter((m) => (loads[m] || 0) === least).sort();
      const m = oneOf(lowest, seed + ':m');
      ex = oneOf(list.filter((id) => muscleOf(id) === m), seed);
    } else ex = oneOf(list, seed);
    return { ex, seconds: secondsOf(cat.EX[ex], level), level };
  }

  function loads(entries, dayOf, EX, now) {
    const from = now.getTime() - 7 * DAY_MS, out = {};
    entries.filter((e) => Date.parse(e.time) >= from && Date.parse(e.time) <= now.getTime()).forEach((e) => {
      const day = dayOf(e.pid, e.day);
      if (!day) return;
      Object.entries(S.dayVolume(day, EX).muscles).forEach(([m, x]) => { out[m] = (out[m] || 0) + x; });
    });
    return out;
  }

  const api = { POOL, pick, secondsOf, loads };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBNow = api;
})(typeof window !== 'undefined' ? window : globalThis, typeof module !== 'undefined' && module.exports ? require('./stats.js') : window.KBStats);
