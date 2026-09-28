// Program Builder: build(config) -> 60-day program, for every program in programs.config.js.
// Owns the time model, rest values, exercise pools, progression levers, stretch picking and fitting.
// A config with `frozen` (Three-Split 60) keeps its already-generated days so saved progress stays valid.
const { EX } = require('./exercises.js');
const CONFIGS = require('./programs.config.js');

const REST = { set: 30, exercise: 60, beforeAbs: 120, superset: 45, round: 60, block: 60 };
const SETUP = 5;

// ---------- deterministic randomness ----------
function makeRnd(seedText) {
  let seed = [...seedText].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
}

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
  core: ['plank', 'side_plank', 'hollow_hold', 'hollow_rock', 'dead_bug', 'weighted_dead_bug', 'bird_dog', 'bear_crawl', 'suitcase_march', 'kb_halo', 'db_side_bend', 'shoulder_taps', 'superman', 'russian_twist'],
  mobility: ids((e) => e.cat === 'warmup' || e.cat === 'cooldown'),
  abs: ids((e) => e.cat === 'abs' && e.id !== 'mountain_climber' && !(e.equip || []).includes('bar')),
  absW: ids((e) => e.cat === 'abs' && e.load && !(e.equip || []).includes('bar')),
};

const EQUIP = {
  all: () => true,
  kb: (e) => (!e.load || e.load === 'kb') && !(e.equip || []).includes('bar'),
  bw: (e) => !e.load && !(e.equip || []).includes('bar'),
};

// easier -> harder, used by the "variation" lever
const HARDER = {
  pushup: 'archer_pushup', spiderman_pushup: 'archer_pushup', diamond_pushup: 'explosive_pushup', plank_to_pushup: 'archer_pushup',
  goblet_squat: 'kb_front_squat', db_squat: 'kb_front_squat', split_squat: 'shrimp_squat', reverse_lunge: 'cossack_squat', lateral_lunge: 'cossack_squat',
  db_rdl: 'single_leg_rdl', glute_bridge: 'single_leg_bridge', kb_deadlift: 'kb_swing', negative_pullup: 'pullup', chin_hold: 'chinup',
  scap_pullup: 'negative_pullup', dead_hang: 'chin_hold', crunch: 'v_up', dead_bug: 'weighted_dead_bug', hollow_hold: 'hollow_rock',
  kb_swing: 'kb_snatch', kb_press: 'kb_clean_press', situp: 'db_situp', leg_raise: 'v_up', knee_tuck: 'v_up', squat_jump: 'jump_lunge',
  plank: 'bear_crawl', bird_dog: 'bear_crawl', weighted_crunch: 'weighted_toe_touch',
};
const LEVER_TEXT = { base: 'Base', reps: 'More reps', weight: 'Heavier weights', variation: 'Harder variations', tempo: 'Slow tempo' };

// ---------- timing ----------
function work(it) {
  const e = EX[it.ex], mult = e.side ? 2 : 1, slow = it.tempo ? 1.5 : 1;
  return (e.u === 'sec' ? it.n * mult : it.n * e.tp * mult * slow) + (e.side ? 5 : 0);
}
function blockTime(b) {
  const W = b.items.map((it) => work(it) + SETUP);
  switch (b.format) {
    case 'straight': return b.items.reduce((s, it, i) => s + b.sets * W[i] + (b.sets - 1) * REST.set, 0) + (b.items.length - 1) * REST.exercise;
    case 'superset': {
      let t = 0;
      for (let i = 0; i < b.items.length; i += 2) t += b.sets * (W[i] + (W[i + 1] || 0) + 10) + (b.sets - 1) * REST.superset;
      return t + (Math.ceil(b.items.length / 2) - 1) * REST.exercise;
    }
    case 'circuit': return b.rounds * W.reduce((a, x) => a + x + 10, 0) + (b.rounds - 1) * REST.round;
    case 'emom': case 'amrap': case 'ladder': return b.minutes * 60;
    case 'tabata': return b.tabatas * 240 + (b.tabatas - 1) * REST.block;
    default: throw new Error('format ' + b.format);
  }
}
function dayTime(blocks) {
  return blocks.reduce((s, b, i) => s + blockTime(b) + (i ? (b.kind === 'abs' ? REST.beforeAbs : REST.block) : 0), 0);
}

// ---------- stretches (same approach as Three-Split 60) ----------
const WARMUPS = ids((e) => e.cat === 'warmup');
const COOLDOWNS = ids((e) => e.cat === 'cooldown');
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

// ---------- block options ----------
const OPTS = {
  straight: { key: 'sets', values: [2, 3, 4, 5], pref: 4 },
  superset: { key: 'sets', values: [2, 3, 4, 5], pref: 4 },
  circuit: { key: 'rounds', values: [2, 3, 4, 5, 6], pref: 4 },
  emom: { key: 'minutes', values: [4, 6, 8, 10, 12, 14, 16, 18, 20], pref: 12 },
  amrap: { key: 'minutes', values: [3, 4, 5, 6, 7, 8, 10, 12, 15], pref: 8 },
  ladder: { key: 'minutes', values: [5, 6, 7, 8, 10, 12], pref: 8 },
  tabata: { key: 'tabatas', values: [1, 2, 3, 4], pref: 2 },
};

// reps inside a timed format are a fraction of the straight-set number
function scaledReps(e, n, format) {
  if (format === 'emom' || format === 'amrap') return e.u === 'sec' ? Math.min(n, 30) : Math.max(3, Math.round(n * 0.5));
  return n;
}

// ---------- program builder ----------
function build(cfg) {
  if (cfg.frozen) return buildFrozen(cfg);
  const rnd = makeRnd(cfg.id);
  const allow = (id) => EQUIP[cfg.equip || 'all'](EX[id]);
  const used = {}, count = {}, stretchUsed = {};
  const pool = (name) => {
    const p = POOLS[name] || [name];
    const list = p.filter((id) => EX[id] && allow(id));
    if (!list.length) throw new Error(`${cfg.id}: pool ${name} is empty`);
    return list;
  };
  const candidate = (name, taken) => {
    const opts = pool(name).filter((id) => !taken.has(id));
    const list = opts.length ? opts : pool(name);
    list.sort((a, b) => ((used[a] || -99) - (used[b] || -99)) || ((count[a] || 0) - (count[b] || 0)) || (rnd() - 0.5));
    taken.add(list[0]);
    return list[0];
  };
  const days = [];
  const nameCount = {};
  for (let d = 1; d <= 60; d++) {
    const level = d <= 20 ? 1 : d <= 40 ? 2 : 3;
    const lever = level === 1 ? 'base' : cfg.levers[level - 1];
    const typeKey = cfg.cycle[(d - 1) % cfg.cycle.length];
    const type = cfg.dayTypes[typeKey];
    const [lo, hi] = type.minutes || cfg.minutes; // a day type can have its own time range
    const taken = new Set();

    // make one item at this level, applying the program's lever
    const makeItem = (id, format) => {
      let ex = id, note, tempo;
      let idx = level - 1;
      if (lever === 'variation' && HARDER[id] && allow(HARDER[id]) && !taken.has(HARDER[id]) && rnd() < 0.6) { ex = HARDER[id]; taken.add(ex); idx = level - 2; note = 'Harder variation'; }
      else if (lever === 'weight' && EX[id].load) { idx = level - 2; note = 'Go one weight up'; }
      else if (lever === 'tempo' && EX[id].u !== 'sec' && format !== 'emom' && format !== 'amrap' && format !== 'ladder') { idx = level - 2; tempo = 1; note = '3 s lowering'; }
      const e = EX[ex];
      const it = { ex, n: scaledReps(e, e.r[Math.max(0, idx)], format) };
      if (note) it.note = note;
      if (tempo) it.tempo = 1;
      return it;
    };

    // candidates for each block; optional slots end with '?'
    const specs = type.blocks.concat([{ f: 'straight', kind: 'abs', title: 'Abs', slots: cfg.absSlots || ['absW', 'abs', 'abs?'] }]);
    const cands = specs.map((sp) => sp.slots.map((slot, si) => {
      // long main blocks may drop their last one or two exercises to fit the time
      const autoOpt = sp.kind !== 'abs' && sp.f !== 'emom' && sp.f !== 'ladder' && sp.f !== 'tabata' && si >= Math.max(3, sp.slots.length - (sp.slots.length >= 5 ? 2 : 1));
      const opt = slot.endsWith('?') || autoOpt, name = slot.replace('?', '');
      const poolName = name === 'absW' && !POOLS.absW.some(allow) ? 'abs' : name;
      return { opt, id: candidate(poolName, taken) };
    }));
    // apply the level (and its lever) once per exercise, before searching
    cands.forEach((list, bi) => list.forEach((c) => { c.item = makeItem(c.id, specs[bi].kind === 'abs' ? 'straight' : specs[bi].f); }));

    // search block parameters (+ which optional slots to keep) to land in the program's time range
    const choices = specs.map((sp, bi) => {
      const o = sp.kind === 'abs' ? { key: 'sets', values: [3], pref: 3 } : OPTS[sp.f];
      const values = sp.values || o.values;
      const optIdx = cands[bi].map((c, i) => (c.opt ? i : -1)).filter((i) => i >= 0);
      const masks = [];
      for (let m = 0; m < 1 << optIdx.length; m++) masks.push(optIdx.filter((_, j) => m & (1 << j)));
      const out = [];
      values.forEach((v) => masks.forEach((keep) => out.push({ v, keep, pref: sp.pref || o.pref, key: o.key, nOpt: optIdx.length })));
      return out;
    });
    let best = null;
    const walk = (bi, pick) => {
      if (bi === specs.length) {
        const blocks = specs.map((sp, i) => {
          const c = pick[i];
          const items = cands[i].filter((x, j) => !x.opt || c.keep.includes(j)).map((x) => ({ ...x.item }));
          const b = { format: sp.kind === 'abs' ? 'straight' : sp.f, title: sp.title, kind: sp.kind || 'main', items };
          b[c.key] = c.v;
          return b;
        });
        const t = dayTime(blocks) / 60;
        let pen = t >= lo && t <= hi ? 0 : 100 + Math.abs(t - (lo + hi) / 2) * 10;
        pick.forEach((c, i) => { pen += Math.abs(c.v - c.pref) / (c.key === 'minutes' ? 4 : 1) + (c.nOpt - c.keep.length) * (specs[i].kind === 'abs' ? 2.5 : 1.2); });
        if (!best || pen < best.pen) best = { pen, blocks, t };
        return;
      }
      for (const c of choices[bi]) walk(bi + 1, pick.concat([c]));
    };
    walk(0, []);
    const blocks = best.blocks;
    blocks.forEach((b) => b.items.forEach((it) => { used[it.ex] = d; count[it.ex] = (count[it.ex] || 0) + 1; }));

    const theme = cfg.names;
    const base = theme[(d - 1) % theme.length];
    nameCount[base] = (nameCount[base] || 0) + 1;
    const name = nameCount[base] > 1 ? `${base} ${['', 'I', 'II', 'III', 'IV', 'V'][nameCount[base]]}` : base;

    const warm = pickStretches(WARMUPS, blocks, 60, d, stretchUsed);
    const cool = pickStretches(COOLDOWNS, blocks, 120, d, stretchUsed);
    days.push({
      day: d, type: typeKey, title: type.label, level, name, blocks,
      est: Math.round(best.t),
      warmup: { title: 'Warm-up', kind: 'warmup', items: warm.items, seconds: warm.seconds },
      cooldown: { title: 'Cool-down stretches', kind: 'cooldown', items: cool.items, seconds: cool.seconds },
      stretchMin: Math.round((warm.seconds + cool.seconds) / 60),
    });
  }
  const dayTypes = dayTypesOf(cfg);
  const formats = [...new Set(days.flatMap((w) => w.blocks.filter((b) => b.kind === 'main').map((b) => b.format)))];
  return {
    id: cfg.id, name: cfg.name, subject: cfg.subject, blurb: cfg.blurb, split: cfg.split,
    minutes: cfg.minutes, equip: cfg.equip || 'all', gear: cfg.gear || null, formats,
    levels: ['Level I · Intermediate', `Level II · ${LEVER_TEXT[cfg.levers[1]]}`, `Level III · ${LEVER_TEXT[cfg.levers[2]]}`],
    rests: REST, dayTypes, days,
  };
}

const COLORS = ['var(--t-cba)', 'var(--t-up)', 'var(--t-low)', 'var(--t-ac)'];
function dayTypesOf(cfg) {
  const out = {};
  Object.entries(cfg.dayTypes).forEach(([k, v], i) => { out[k] = { label: v.label, short: v.short, c: COLORS[i % 4] }; });
  return out;
}
// frozen programs: generated once, then kept byte-for-byte; only their description comes from the config
function buildFrozen(cfg) {
  const saved = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, cfg.frozen), 'utf8'));
  return { ...saved, subject: cfg.subject, split: cfg.split, minutes: cfg.minutes, equip: cfg.equip || 'all', formats: ['straight'], dayTypes: dayTypesOf(cfg) };
}
const buildAll = () => CONFIGS.map(build);

module.exports = { build, buildAll, CONFIGS, POOLS, REST, timing: { work, blockTime, dayTime } };
