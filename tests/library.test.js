// The Phase 5 library, one subject at a time: what each new subject promises (docs/plans/phase-5-catalogue-and-library.md).
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const { buildAll, CONFIGS, timing, build } = require('../program-builder.js');

const { EX, allowedIn } = cat;
const programs = buildAll();
const cfgOf = Object.fromEntries(CONFIGS.map((c) => [c.id, c]));
const itemsOf = (d) => [...d.blocks.flatMap((b) => b.items), ...d.warmup.items, ...d.cooldown.items];

// subject -> how many programs, whether days end with abs, and the formats its main blocks may use
const SUBJECTS = {
  Yoga: { count: 5, abs: false, formats: ['flow'] },
  Pilates: { count: 5, abs: false, formats: ['flow'] },
};

for (const [subject, want] of Object.entries(SUBJECTS)) {
  test(`${subject}: ${want.count} programs of 60 days, each day inside its time range`, () => {
    const list = programs.filter((p) => p.subject === subject);
    assert.equal(list.length, want.count);
    list.forEach((p) => {
      assert.equal(p.days.length, 60, p.id);
      const cfg = cfgOf[p.id];
      p.days.forEach((d) => {
        const [lo, hi] = cfg.dayTypes[d.type].minutes || cfg.minutes, t = timing.dayTime(d.blocks) / 60;
        assert.ok(t >= lo - 1 && t <= hi + 1.1, `${p.id} d${d.day}: ${t.toFixed(1)} min, want ${lo}-${hi}`);
      });
    });
  });

  test(`${subject}: every exercise exists, has poses and muscles, and fits the program's equipment`, () => {
    programs.filter((p) => p.subject === subject).forEach((p) => p.days.forEach((d) => itemsOf(d).forEach((it) => {
      const e = EX[it.ex];
      assert.ok(e && e.poses.length && e.muscles.primary.length, `${p.id} d${d.day}: ${it.ex}`);
      assert.ok(allowedIn(p.equip, e), `${p.id} d${d.day}: ${it.ex} needs more than ${p.equip}`);
    })));
  });

  test(`${subject}: ${want.abs ? 'an abs block last' : 'no abs finisher'}; main blocks are ${want.formats.join(' / ')}`, () => {
    programs.filter((p) => p.subject === subject).forEach((p) => p.days.forEach((d) => {
      const main = d.blocks.filter((b) => b.kind !== 'abs');
      assert.equal(d.blocks.at(-1).kind === 'abs', want.abs, `${p.id} d${d.day}`);
      main.forEach((b) => assert.ok(want.formats.includes(b.format), `${p.id} d${d.day}: ${b.format}`));
    }));
  });
}

test('every exercise added in Phase 5 is marked added: 5, and only programs marked added: 5 use them', () => {
  const PHASE5_CATS = ['yoga', 'pilates', 'flex', 'mobility', 'boxing', 'kick', 'balance'];
  Object.values(EX).filter((e) => PHASE5_CATS.includes(e.cat)).forEach((e) => assert.equal(e.added, 5, e.id));
  programs.forEach((p) => p.days.forEach((d) => itemsOf(d).forEach((it) => {
    assert.ok((EX[it.ex].added || 0) <= (cfgOf[p.id].added || 0), `${p.id} d${d.day}: ${it.ex} is newer than the program`);
  })));
});

test('a flow repeats 1–3 times and its time is its poses plus 5 s to move into each (per side)', () => {
  const b = { format: 'flow', repeat: 2, items: [{ ex: 'warrior_two', n: 40 }, { ex: 'boat_pose', n: 30 }, { ex: 'sun_salutation', n: 3 }] };
  assert.equal(timing.blockTime(b), 2 * (2 * (5 + 40) + (5 + 30) + (5 + 3 * 30)));
});

test('a block scale lengthens holds in 5 s steps, up to its cap', () => {
  const cfg = JSON.parse(JSON.stringify(cfgOf['yin-deep-stretch']));
  const blocks = cfg.dayTypes.hips.blocks;
  delete blocks[0].cap;
  const d = build(cfg, cat).days[0], n = d.blocks[0].items.map((it) => it.n);
  assert.ok(n.every((x) => x % 5 === 0));
  assert.ok(Math.max(...build(cfgOf['yin-deep-stretch'], cat).days.flatMap((w) => w.blocks.flatMap((b) => b.items.map((it) => it.n)))) <= 240);
});
