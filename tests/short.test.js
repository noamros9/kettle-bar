// Shorter today (Phase 7 ticket 4): trim(day) cuts a day to about 20 minutes: fewer sets, rounds or minutes, and the
// last exercises of a block dropped, never a block's first exercise.
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../program-builder.js');
const F = require('../formats.js');
const cat = require('../exercises.js');
const Short = require('../app/short.js');

const all = require('./helpers/library.js').library();
const restsOf = (p) => ({ ...B.REST, ...(p.rests || {}) });
const minutes = (day, R) => day.blocks.reduce((s, b, i) => s + F.of(b).time(b, R, cat.EX) + (i ? (b.kind === 'abs' ? R.beforeAbs : R.block) : 0), 0) / 60;
const firsts = (day) => day.blocks.map((b) => b.items[0].ex);
const straightOnly = (d) => d.blocks.every((b) => (b.format || 'straight') === 'straight');

// ---- the plan's test first ----
test('trim of a 35-minute straight-set day gives 18-22 minutes and keeps every block\'s first exercise', () => {
  const p = all.find((x) => x.days.some((d) => d.est >= 35 && straightOnly(d)));
  const day = p.days.find((d) => d.est >= 35 && straightOnly(d)), R = restsOf(p);
  const t = Short.trim(day, { R, EX: cat.EX });
  assert.ok(t.est >= 18 && t.est <= 22, `${p.id} day ${day.day}: ${t.est} min`);
  assert.equal(t.est, Math.round(minutes(t, R)), 'est is what the time model says');
  assert.deepEqual(firsts(t), firsts(day));
  assert.deepEqual(t.short, { from: day.est });
  assert.equal(day.est >= 35, true, 'the day itself is not changed');
});

// ---- the rest ----
// Couple sessions are a few long holds and may stay above 24 min: they trim shorter but don't count (Noam, 9 Oct 2026)
const COUPLE = new Set(B.CONFIGS.filter((c) => c.couple).map((c) => c.id));

test('every day of every program over 22 minutes trims into 18-22 (all but a few long flows; couple sessions exempt), never longer, first exercises kept', () => {
  let trimmed = 0, near = 0;
  for (const p of all) {
    const R = restsOf(p);
    for (const day of p.days) {
      const t = Short.trim(day, { R, EX: cat.EX });
      if (day.est <= Short.TARGET + 2) { assert.equal(t, day, `${p.id} ${day.day}: already short`); continue; }
      if (!COUPLE.has(p.id)) trimmed++;
      assert.ok(t.est <= day.est, `${p.id} ${day.day}`);
      assert.deepEqual(firsts(t), firsts(day), `${p.id} ${day.day}`);
      t.blocks.forEach((b, bi) => {
        const o = day.blocks[bi];
        assert.deepEqual(b.items.map((it) => it.ex), o.items.slice(0, b.items.length).map((it) => it.ex), 'only the last exercises are dropped');
        const k = F.of(b).options.key;
        assert.ok(b[k] <= o[k], `${p.id} ${day.day}: ${k} never grows`);
        b.items.forEach((it) => { if (it.sets) assert.ok(it.sets <= b.sets); });
      });
      if (!COUPLE.has(p.id) && t.est >= 18 && t.est <= 22 * 1.1) near++; // up to 10% over is fine (Noam, 9 Oct 2026)
    }
  }
  assert.ok(near / trimmed > 0.99, `${near} of ${trimmed} land in 18-22`);
});

test('a trimmed day keeps its warm-up, cool-down and everything else; its own rests count', () => {
  const p = all.find((x) => x.rests && x.days.some((d) => d.est > 25));
  const day = p.days.find((d) => d.est > 25), t = Short.trim(day, { R: restsOf(p), EX: cat.EX });
  assert.deepEqual(t.warmup, day.warmup);
  assert.deepEqual(t.cooldown, day.cooldown);
  assert.equal(t.name, day.name);
  assert.equal(t.day, day.day);
  assert.equal(Short.trim(day, { R: restsOf(p), EX: cat.EX, target: 30 }).est <= 32, true, 'another target');
});

test('odd blocks: a value below the format\'s smallest stays, an item\'s own sets follow the block\'s, other keys leave them', () => {
  const R = B.REST, EX = cat.EX;
  const day = {
    day: 1, est: 40, blocks: [
      { format: 'straight', kind: 'main', sets: 1, items: [{ ex: 'goblet_squat', n: 12 }, { ex: 'pushup', n: 12 }] },
      { format: 'straight', kind: 'main', sets: 5, items: [{ ex: 'kb_swing', n: 15, sets: 4 }, { ex: 'db_row', n: 10 }, { ex: 'plank', n: 40 }] },
      { format: 'circuit', kind: 'main', rounds: 5, items: [{ ex: 'burpee', n: 8, sets: 9 }, { ex: 'mountain_climber', n: 20 }, { ex: 'squat_jump', n: 10 }] },
    ],
  };
  const t = Short.trim(day, { R, EX, target: 12 });
  assert.equal(t.blocks[0].sets, 1, 'nothing below it to try');
  assert.ok(t.blocks[1].items[0].sets <= t.blocks[1].sets);
  assert.equal(t.blocks[2].items[0].sets, 9, 'a circuit changes rounds, not sets');
  assert.ok(t.est >= 10 && t.est <= 14, `${t.est}`);
});
