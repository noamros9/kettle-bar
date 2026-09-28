const { EX } = require('./lib.js');

// deterministic RNG
let seed = 20260928;
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

const POOLS = {
  push: ['pushup', 'diamond_pushup', 'dive_bomber', 'spiderman_pushup', 'explosive_pushup', 'plank_to_pushup'],
  pull: ['pullup', 'chinup', 'negative_pullup', 'pullup', 'chinup', 'chin_hold'],
  dbchest: ['db_floor_press', 'db_pullover'],
  row: ['db_row', 'one_arm_row', 'renegade_row', 'kb_high_pull'],
  cbaMix: ['superman', 'plank_to_pushup', 'diamond_pushup', 'kb_high_pull', 'renegade_row', 'chin_hold', 'dive_bomber'],
  uPress: ['db_shoulder_press', 'kb_press', 'pike_pushup'],
  uPull: ['db_row', 'one_arm_row', 'kb_high_pull'],
  uArms1: ['db_curl', 'hammer_curl', 'lateral_raise', 'db_front_raise'],
  uArms2: ['db_skullcrusher', 'overhead_triceps_ext', 'db_kickback', 'diamond_pushup'],
  uExtra: ['pushup', 'dive_bomber', 'lateral_raise', 'renegade_row'],
  total: ['db_thruster', 'kb_clean_press', 'burpee', 'kb_swing'],
  lSquat: ['goblet_squat', 'kb_sumo_deadlift', 'db_squat', 'split_squat'],
  lHinge: ['db_rdl', 'single_leg_rdl', 'kb_swing'],
  lLunge: ['db_lunge', 'reverse_lunge', 'lateral_lunge', 'split_squat'],
  lGlute: ['glute_bridge', 'single_leg_bridge', 'wall_sit'],
  lTotal: ['db_thruster', 'squat_jump', 'burpee', 'kb_clean_press'],
  cardio: ['jumping_jacks', 'high_knees', 'burpee', 'squat_jump', 'jump_lunge', 'butt_kicks', 'punches', 'squat_thrust', 'kb_swing', 'mountain_climber'],
  abs: Object.keys(EX).filter((k) => EX[k].cat === 'abs' && k !== 'mountain_climber' && !(EX[k].equip || []).includes('bar')),
  absWeighted: Object.keys(EX).filter((k) => EX[k].cat === 'abs' && EX[k].load),
};

// Straight sets: every set of one exercise, then the next exercise. Abs always come last.
const REST = { set: 30, exercise: 60, beforeAbs: 120 };
const SETUP = 5; // seconds to get into position for each set

const used = {}; // id -> last day used
const count = {};
function candidate(pool, taken) {
  const opts = [...new Set(pool)].filter((id) => !taken.has(id));
  opts.sort((a, b) => ((used[a] || -99) - (used[b] || -99)) || ((count[a] || 0) - (count[b] || 0)) || (rnd() - 0.5));
  taken.add(opts[0]);
  return opts[0];
}
function setWork(ex, n) {
  const e = EX[ex], mult = e.side ? 2 : 1;
  return (e.u === 'sec' ? n * mult : n * e.tp * mult) + (e.side ? 5 : 0) + SETUP;
}
function itemTime(it) { return it.sets * setWork(it.ex, it.n) + (it.sets - 1) * REST.set; }
function blockTime(b) { return b.items.reduce((s, it) => s + itemTime(it), 0) + (b.items.length - 1) * REST.exercise; }
function total(w) { return blockTime(w.blocks[0]) + REST.beforeAbs + blockTime(w.blocks[1]); }

const NAMES = {
  cba: ['Iron Frame', 'Anvil', 'Bulwark', 'Keel', 'Rampart', 'Ridgeline', 'Breakwater', 'Lintel', 'Crossbeam', 'Bastion', 'Hull', 'Buttress', 'Girder', 'Foundry', 'Pillar', 'Harbor Wall', 'Stonework', 'Headland', 'Trestle', 'Citadel'],
  up: ['Hoist', 'Pulley', 'Winch', 'Crane', 'Derrick', 'Rigging', 'Capstan', 'Block & Tackle', 'Mast', 'Lever'],
  low: ['Bedrock', 'Piston', 'Tread', 'Switchback', 'Pedal', 'Footing', 'Ballast', 'Stride', 'Anchor', 'Gradient'],
  ac: ['Spark Plug', 'Tempo', 'Afterburner', 'Live Wire', 'Pulse', 'Squall', 'Flywheel', 'Tailwind', 'Crosswind', 'Ignition', 'Undertow', 'Riptide', 'Static', 'Voltage', 'Cadence', 'Whirl', 'Updraft', 'Current', 'Brushfire', 'Overdrive'],
};
const ni = { cba: 0, up: 0, low: 0, ac: 0 };


// Warm-up (~1 min) and cool-down (~2 min) chosen to cover the muscles the day works hardest.
// Not counted in the day's time estimate.
const WARMUPS = Object.keys(EX).filter((k) => EX[k].cat === 'warmup');
const COOLDOWNS = Object.keys(EX).filter((k) => EX[k].cat === 'cooldown');
const stretchUsed = {};
function stretchTime(id) { const e = EX[id]; return e.r[0] * (e.side ? 2 : 1); }
function pickStretches(pool, blocks, seconds, day) {
  const w = {};
  blocks.forEach((b) => b.items.forEach((it) => {
    EX[it.ex].muscles.primary.forEach((m) => { w[m] = (w[m] || 0) + 2 * it.sets; });
    EX[it.ex].muscles.secondary.forEach((m) => { w[m] = (w[m] || 0) + it.sets; });
  }));
  // abs close every day, so they would win every time: count them at half weight, then normalise
  ['abs', 'obliques', 'hip_flexors'].forEach((m) => { if (w[m]) w[m] *= 0.5; });
  const max = Math.max(1, ...Object.values(w)); Object.keys(w).forEach((m) => { w[m] /= max; });
  const chosen = []; let t = 0;
  while (t < seconds) {
    const score = (id) => {
      const m = EX[id].muscles;
      return m.primary.reduce((a, x) => a + (w[x] || 0), 0) + 0.5 * m.secondary.reduce((a, x) => a + (w[x] || 0), 0)
        - (day - (stretchUsed[id] || -99) <= 2 ? 0.45 : 0) - (day - (stretchUsed[id] || -99) <= 5 ? 0.15 : 0);
    };
    const opts = pool.filter((id) => !chosen.includes(id)).sort((a, b) => score(b) - score(a));
    const id = opts[0]; if (!id) break;
    chosen.push(id); t += stretchTime(id); stretchUsed[id] = day;
    EX[id].muscles.primary.forEach((m) => { if (w[m]) w[m] *= 0.25; });
    EX[id].muscles.secondary.forEach((m) => { if (w[m]) w[m] *= 0.6; });
  }
  return { items: chosen.map((id) => ({ ex: id, n: EX[id].r[0], sets: 1 })), seconds: t };
}

const SLOTS = {
  cba: ['push', 'pull', 'dbchest', 'row', 'cbaMix', 'push'],
  up: ['uPress', 'uPull', 'uArms1', 'uArms2', 'total', 'uExtra'],
  low: ['lSquat', 'lHinge', 'lLunge', 'lGlute', 'lTotal', 'lSquat'],
  ac: ['cardio', 'abs', 'cardio', 'abs', 'cardio', 'cardio'],
};
const TITLES = {
  cba: ['Chest, back & abs', 'Chest & back'],
  up: ['Full body · upper focus', 'Upper body + total body'],
  low: ['Full body · lower focus', 'Lower body + total body'],
  ac: ['Abs & cardio', 'Cardio & core'],
};

const days = [];
for (let d = 1; d <= 60; d++) {
  const level = d <= 20 ? 1 : d <= 40 ? 2 : 3;
  const r = (d - 1) % 3;
  const type = r === 0 ? 'cba' : r === 2 ? 'ac' : (Math.floor((d - 1) / 3) % 2 === 0 ? 'up' : 'low');
  const taken = new Set();
  const mainC = SLOTS[type].map((pool) => candidate(POOLS[pool], taken));
  // abs close every workout: no pull-up bar, at least one move with a dumbbell or the kettlebell
  const absC = [candidate(POOLS.absWeighted, taken), ...[0, 1, 2, 3].map(() => candidate(POOLS.abs, taken))];
  const n = (id) => EX[id].r[level - 1];
  // pick how many exercises and sets fit 30–35 min, closest to 5 main × 4 sets and 3 abs × 3 sets
  // strength days (1, 2) run longer to keep 5 main exercises; abs & cardio days (3) are the short ones
  const [lo, hi] = type === 'ac' ? [24.5, 30.4] : [34.5, 38.4];
  let best = null;
  // abs subsets always keep the weighted move (index 0); any of the others may be left out
  const absSets = [];
  for (let mask = 0; mask < 16; mask++) {
    const pick = [0, ...[1, 2, 3, 4].filter((k, j) => mask & (1 << j))];
    if (pick.length >= 2 && pick.length <= 4) absSets.push(pick);
  }
  // main: the first four slots always, then either or both of the last two
  const mainSets = [[0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 5], [0, 1, 2, 3, 4, 5]];
  for (const mp of mainSets) for (const sm of [3, 4, 5]) for (const pick of absSets) for (const sa of [3]) {
    const ea = pick.length, em = mp.length;
    const w = { blocks: [
      { items: mp.map((k) => mainC[k]).map((id) => ({ ex: id, n: n(id), sets: sm })) },
      { items: pick.map((k) => absC[k]).map((id) => ({ ex: id, n: n(id), sets: sa })) }] };
    const t = total(w) / 60;
    const pen = (t >= lo && t <= hi ? 0 : 100 + Math.abs(t - (lo + hi) / 2) * 10) + Math.abs(em - 5) * 6 + Math.abs(sm - 4) * 1.5 + Math.abs(ea - 3) * 9 + Math.abs(sa - 3) * 2 + pick.reduce((a, k) => a + k, 0) * 0.1 + (mp.includes(5) && !mp.includes(4) ? 0.5 : 0);
    if (!best || pen < best.pen) best = { pen, w, em, sm, ea, sa };
  }
  const blocks = [
    { title: TITLES[type][1], kind: 'main', sets: best.sm, items: best.w.blocks[0].items },
    { title: 'Abs', kind: 'abs', sets: best.sa, items: best.w.blocks[1].items },
  ];
  blocks.forEach((b) => b.items.forEach((it) => { used[it.ex] = d; count[it.ex] = (count[it.ex] || 0) + 1; }));
  const w = { day: d, type, title: TITLES[type][0], level, name: NAMES[type][ni[type]++], blocks };
  w.est = Math.round(total(w) / 60);
  const warm = pickStretches(WARMUPS, blocks, 60, d), cool = pickStretches(COOLDOWNS, blocks, 120, d);
  w.warmup = { title: 'Warm-up', kind: 'warmup', items: warm.items, seconds: warm.seconds };
  w.cooldown = { title: 'Cool-down stretches', kind: 'cooldown', items: cool.items, seconds: cool.seconds };
  w.stretchMin = Math.round((warm.seconds + cool.seconds) / 60);
  days.push(w);
}

const program = {
  id: 'three-split-60',
  name: 'Three-Split 60',
  blurb: 'Chest & back, full body, abs & cardio on a repeating three-day cycle. Dumbbells, one kettlebell, a pull-up bar and a mat.',
  levels: ['Level I · Intermediate', 'Level II · Strong', 'Level III · Peak'],
  rests: REST,
  days,
};

if (require.main === module) {
  const rows = days.map((w) => `${String(w.day).padStart(2)} ${w.type.padEnd(3)} L${w.level} ${String(w.est).padStart(2)}min +${w.stretchMin} W[${w.warmup.items.map((i) => i.ex).join(',')}] C[${w.cooldown.items.map((i) => i.ex).join(',')}] ${w.blocks.map((b) => `${b.items.length}x${b.sets}[${b.items.map((i) => i.ex + ':' + i.n).join(',')}]`).join(' | ')}`);
  console.log(rows.join('\n'));
  const ests = days.map((d) => d.est);
  console.log('min', Math.min(...ests), 'max', Math.max(...ests));
  console.log(Object.entries(count).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ':' + v).join(' '));
  console.log('unused:', Object.keys(EX).filter((k) => !count[k] && !/warmup|cooldown/.test(EX[k].cat)).join(', '));
  require('fs').writeFileSync(__dirname + '/program.json', JSON.stringify(program));
}
module.exports = program;
