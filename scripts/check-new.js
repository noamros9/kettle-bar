#!/usr/bin/env node
// `npm run check:new [subject…]`: before pushing a content ticket, the rules CI checks over every library program, run
// here on this phase's programs only (added: 23, not the IIs), one config at a time: each day in its time range at every
// level, abs last, the gear, warm-up and cool-down, the about, 20 day names, a muscle program training its own muscle
// most (library.test.js) and bodyweight-only mode leaving no lateral raise and no lone row without a stand-in (floor.test.js).
const { buildConfig, timing, CONFIGS } = require('../program-builder.js');
const cat = require('../exercises.js');
const { programFocus } = require('../app/stats.js');
const { travel } = require('../app/swaps.js');

const { EX } = cat;
const PHASE = 23;
const bar = (e) => (e.equip || []).includes('bar');
const sentences = (t) => t.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
const FOCUS = {
  Chest: { own: ['chest'], helpers: ['triceps', 'front_delts'] },
  Back: { own: ['lats', 'upper_back'], helpers: ['biceps', 'rear_delts', 'traps'] },
  Shoulders: { own: ['front_delts', 'side_delts', 'rear_delts'], helpers: ['traps', 'triceps', 'upper_back'] },
  Arms: { own: ['biceps', 'triceps'], helpers: ['forearms'] },
  'Hips & adductors': { own: ['adductors', 'hip_flexors'], helpers: ['glutes'] },
  'Calves & lower legs': { own: ['calves', 'shins'], helpers: ['quads', 'hip_flexors'] },
  'Neck & traps': { own: ['neck', 'traps'], helpers: ['upper_back', 'rear_delts', 'forearms'] },
};
const ROWS = ['db_row', 'one_arm_row', 'kb_row'];
const gearPulls = (d) => d.blocks.flatMap((b) => b.items).filter((it) => !cat.allowedIn('bw', EX[it.ex]) && EX[it.ex].muscles.primary.some((m) => m === 'lats' || m === 'upper_back')).length;

function problemsOf(c) {
  const p = buildConfig(c), out = [];
  p.days.forEach((d) => {
    const ty = c.dayTypes[d.type], [lo, hi] = ty.minutes || c.minutes;
    const m = timing.dayTime(d.blocks, p.rests) / 60;
    if (m < lo - 1 || m > hi + 1.1) out.push(`d${d.day} L${d.level} ${m.toFixed(1)} min (${lo}-${hi})`);
    if ((ty.absSlots || c.absSlots || ['x']).length && d.blocks.at(-1).kind !== 'abs') out.push(`d${d.day}: abs not last`);
    if (d.warmup.seconds < 60 || d.warmup.seconds > 83) out.push(`d${d.day}: warm-up ${d.warmup.seconds} s`);
    if (d.cooldown.seconds < 120 || d.cooldown.seconds > 150) out.push(`d${d.day}: cool-down ${d.cooldown.seconds} s`);
    d.blocks.forEach((b) => b.items.forEach((it) => {
      const e = EX[it.ex];
      if (b.kind === 'abs' && bar(e)) out.push(`d${d.day}: abs ${it.ex} needs the bar`);
      if (p.equip === 'kb' && !((!e.load || e.load === 'kb') && !bar(e))) out.push(`gear kb: ${it.ex}`);
      if (p.equip === 'bw' && (e.load || bar(e))) out.push(`gear bw: ${it.ex}`);
    }));
    const left = travel(d, 'bw', p, cat).blocks.flatMap((b) => b.items).filter((it) => it.travelMissing);
    if (left.some((it) => it.ex === 'lateral_raise')) out.push(`d${d.day}: travel: lateral_raise has no floor stand-in`);
    const rows = left.filter((it) => ROWS.includes(it.ex)).length;
    if (rows && (rows > 1 || gearPulls(d) < 4)) out.push(`d${d.day}: travel: ${rows} rows left with ${gearPulls(d)} pulls`);
  });
  if (FOCUS[c.subject]) {
    const f = programFocus(p.days, EX), { own, helpers } = FOCUS[c.subject], mine = own.reduce((t, m) => t + (f[m] || 0), 0);
    Object.entries(f).filter(([m]) => ![...own, ...helpers, 'abs', 'obliques'].includes(m))
      .forEach(([m, x]) => { if (!(mine > x)) out.push(`focus: ${m} ${x.toFixed(2)} >= ${own.join('+')} ${mine.toFixed(2)}`); });
  }
  const s = sentences(c.about || '').length;
  if (s < 3 || s > 6) out.push(`about: ${s} sentences`);
  if (new Set(c.names || []).size !== 20) out.push(`names: ${new Set(c.names || []).size}`);
  return [...new Set(out)];
}

if (require.main === module) {
  const subjects = process.argv.slice(2);
  const list = CONFIGS.filter((c) => (c.added || 0) >= PHASE && !c.step && (!subjects.length || subjects.includes(c.subject)));
  let bad = 0;
  list.forEach((c) => {
    const p = problemsOf(c);
    if (p.length) { bad++; console.log(`${c.id}: ${p.slice(0, 5).join('; ')}${p.length > 5 ? ` (+${p.length - 5})` : ''}`); }
  });
  console.log(bad ? `${bad} of ${list.length} programs have problems` : `${list.length} programs: all ok`);
  process.exit(bad ? 1 : 0);
}

module.exports = { problemsOf };
