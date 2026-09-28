const { EX } = require('./lib.js');

// deterministic RNG
let seed = 20260928;
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

const POOLS = {
  push: ['pushup', 'diamond_pushup', 'decline_pushup', 'spiderman_pushup', 'explosive_pushup', 'plank_to_pushup'],
  pull: ['pullup', 'chinup', 'negative_pullup', 'pullup', 'chinup', 'chin_hold'],
  dbchest: ['db_floor_press', 'db_pullover'],
  row: ['db_row', 'one_arm_row', 'renegade_row', 'kb_high_pull'],
  cbaMix: ['superman', 'plank_to_pushup', 'diamond_pushup', 'kb_high_pull', 'renegade_row', 'chin_hold', 'decline_pushup'],
  uPress: ['db_shoulder_press', 'kb_press', 'pike_pushup'],
  uPull: ['db_row', 'one_arm_row', 'kb_high_pull'],
  uArms1: ['db_curl', 'hammer_curl', 'lateral_raise', 'db_front_raise'],
  uArms2: ['db_skullcrusher', 'overhead_triceps_ext', 'chair_dips', 'diamond_pushup'],
  total: ['db_thruster', 'kb_clean_press', 'burpee', 'kb_swing'],
  lSquat: ['goblet_squat', 'kb_sumo_deadlift', 'bulgarian_split_squat'],
  lHinge: ['db_rdl', 'single_leg_rdl', 'kb_swing'],
  lLunge: ['db_lunge', 'reverse_lunge', 'lateral_lunge', 'step_up'],
  lGlute: ['glute_bridge', 'single_leg_bridge', 'wall_sit'],
  lTotal: ['db_thruster', 'squat_jump', 'burpee', 'kb_clean_press'],
  cardio: ['jumping_jacks', 'high_knees', 'burpee', 'squat_jump', 'jump_lunge', 'butt_kicks', 'punches', 'squat_thrust', 'kb_swing', 'mountain_climber'],
  abs: Object.keys(EX).filter((k) => EX[k].cat === 'abs' && k !== 'mountain_climber'),
};

const used = {}; // id -> last day used
const count = {};
function pick(pool, level, taken, day) {
  const opts = [...new Set(pool)].filter((id) => EX[id].lv <= level && !taken.has(id));
  opts.sort((a, b) => ((used[a] || -99) - (used[b] || -99)) || ((count[a] || 0) - (count[b] || 0)) || (rnd() - 0.5));
  const id = opts[0];
  used[id] = day; count[id] = (count[id] || 0) + 1; taken.add(id);
  return id;
}

const TRANS = 10; // seconds to move between exercises
function itemTime(it) {
  const e = EX[it.ex];
  const mult = e.side ? 2 : 1;
  const work = e.u === 'sec' ? it.n * mult : it.n * e.tp * mult;
  return work + TRANS + (e.side ? 5 : 0);
}
function blockTime(b) {
  const round = b.items.reduce((s, it) => s + itemTime(it), 0);
  return b.sets * round + (b.sets - 1) * b.rest;
}
const BETWEEN = 120;
function total(w) { return w.blocks.reduce((s, b) => s + blockTime(b), 0) + (w.blocks.length - 1) * BETWEEN; }

const NAMES = {
  cba: ['Iron Frame', 'Anvil', 'Bulwark', 'Keel', 'Rampart', 'Ridgeline', 'Breakwater', 'Lintel', 'Crossbeam', 'Bastion', 'Hull', 'Buttress', 'Girder', 'Foundry', 'Pillar', 'Harbor Wall', 'Stonework', 'Headland', 'Trestle', 'Citadel'],
  up: ['Hoist', 'Pulley', 'Winch', 'Crane', 'Derrick', 'Rigging', 'Capstan', 'Block & Tackle', 'Mast', 'Lever'],
  low: ['Bedrock', 'Piston', 'Tread', 'Switchback', 'Pedal', 'Footing', 'Ballast', 'Stride', 'Anchor', 'Gradient'],
  ac: ['Spark Plug', 'Tempo', 'Afterburner', 'Live Wire', 'Pulse', 'Squall', 'Flywheel', 'Tailwind', 'Crosswind', 'Ignition', 'Undertow', 'Riptide', 'Static', 'Voltage', 'Cadence', 'Whirl', 'Updraft', 'Current', 'Brushfire', 'Overdrive'],
};
const ni = { cba: 0, up: 0, low: 0, ac: 0 };

const days = [];
for (let d = 1; d <= 60; d++) {
  const level = d <= 20 ? 1 : d <= 40 ? 2 : 3;
  const r = (d - 1) % 3;
  const taken = new Set();
  const it = (id) => ({ ex: id, n: EX[id].r[level - 1] });
  const P = (pool) => it(pick(POOLS[pool], level, taken, d));
  let type, title, blocks, key;
  if (r === 0) {
    type = 'cba'; key = 'cba'; title = 'Chest, back & abs';
    blocks = [
      { title: 'Chest & back', sets: 4, rest: 90, items: [P('push'), P('pull'), P('dbchest'), P('row'), P('cbaMix')] },
      { title: 'Abs', sets: 3, rest: 45, items: [P('abs'), P('abs'), P('abs'), P('abs')] },
    ];
  } else if (r === 1) {
    const upper = Math.floor((d - 1) / 3) % 2 === 0;
    type = upper ? 'up' : 'low'; key = type;
    title = upper ? 'Full body · upper focus' : 'Full body · lower focus';
    blocks = upper
      ? [{ title: 'Upper body + total body', sets: 4, rest: 90, items: [P('uPress'), P('uPull'), P('uArms1'), P('uArms2'), P('total')] }]
      : [{ title: 'Lower body + total body', sets: 4, rest: 90, items: [P('lSquat'), P('lHinge'), P('lLunge'), P('lGlute'), P('lTotal')] }];
    blocks.push({ title: 'Abs', sets: 3, rest: 45, items: [P('abs'), P('abs'), P('abs'), P('abs')] });
  } else {
    type = 'ac'; key = 'ac'; title = 'Abs & cardio';
    blocks = [
      { title: 'Cardio + core', sets: 4, rest: 60, items: [P('cardio'), P('abs'), P('cardio'), P('abs'), P('cardio')] },
      { title: 'Core finisher', sets: 3, rest: 45, items: [P('abs'), P('abs'), P('abs'), P('abs')] },
    ];
  }
  const w = { day: d, type, title, level, name: NAMES[key][ni[key]++], blocks };
  // tune to 30–35 min: search sets/rest combos closest to the preferred shape
  const A = blocks[0], B = blocks[1];
  const prefA = type === 'ac' ? 60 : 90;
  let best = null;
  for (const as of [3, 4, 5]) for (const ar of [60, 75, 90, 120]) for (const bs of [2, 3, 4]) for (const br of [30, 45, 60]) {
    if (type === 'ac' && ar > 75) continue;
    A.sets = as; A.rest = ar; B.sets = bs; B.rest = br;
    const t = total(w) / 60;
    const inRange = t >= 30.5 && t <= 34.4;
    const pen = (inRange ? 0 : 100 + Math.abs(t - 32.5) * 10) + Math.abs(as - 4) * 3 + Math.abs(ar - prefA) / 15 * 2 + Math.abs(bs - 3) * 2.5 + Math.abs(br - 45) / 15 * 1.5;
    if (!best || pen < best.pen) best = { pen, as, ar, bs, br };
  }
  A.sets = best.as; A.rest = best.ar; B.sets = best.bs; B.rest = best.br;
  w.est = Math.round(total(w) / 60);
  days.push(w);
}

const program = {
  id: 'three-split-60',
  name: 'Three-Split 60',
  blurb: 'Chest & back, full body, abs & cardio on a repeating three-day cycle. Dumbbells, one kettlebell, a pull-up bar and a mat.',
  levels: ['Level I · Base', 'Level II · Build', 'Level III · Peak'],
  between: BETWEEN,
  days,
};

if (require.main === module) {
  const rows = days.map((w) => `${String(w.day).padStart(2)} ${w.type.padEnd(3)} L${w.level} ${String(w.est).padStart(2)}min  ${w.blocks.map((b) => `${b.sets}x${b.rest}s[${b.items.map((i) => i.ex + ':' + i.n).join(',')}]`).join(' | ')}`);
  console.log(rows.join('\n'));
  const ests = days.map((d) => d.est);
  console.log('min', Math.min(...ests), 'max', Math.max(...ests));
  console.log(Object.entries(count).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ':' + v).join(' '));
  console.log('unused:', Object.keys(EX).filter((k) => !count[k]).join(', '));
  require('fs').writeFileSync(__dirname + '/program.json', JSON.stringify(program));
}
module.exports = program;
