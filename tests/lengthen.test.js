// The lengthening pass (Phase 26 ticket 1, decisions 55, 157, 170): a config with `long: [lo, hi]` builds its days exactly
// as before, then each day gets longer without moving a pick. Checked on small made-up configs, never the whole library.
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../program-builder.js');
const cat = require('../exercises.js');
const { FORMATS } = require('../formats.js');
const { S, C, E, B: Bouts } = require('../configs/shared.js');

const cfg = (extra) => ({
  id: 'test-long', name: 'Test', subject: 'Test', split: 'x', blurb: 'x', names: ['One', 'Two'],
  minutes: [24, 29], levers: [null, 'reps', 'weight'], cycle: ['a', 'b'],
  dayTypes: {
    a: { label: 'A', short: 'A', blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad']), C('Legs', ['squat', 'lunge', 'hinge'])] },
    b: { label: 'B', short: 'B', blocks: [E('Engine', ['cardio', 'cardio']), S('Pull', ['row', 'row'])] },
  },
  ...extra,
});
// one boxing block of two bouts: one more bout per block can't take a 10-minute day to 35
const boxing = (extra) => cfg({ minutes: [8, 12], absSlots: [], cycle: ['a'], dayTypes: { a: { label: 'A', short: 'A', blocks: [Bouts('Box', ['bxBasic', 'bxBasic'])] } }, ...extra });

const mins = (c, d) => B.timing.dayTime(d.blocks, B.recipesOf(c)[d.type].rests) / 60;
const valuesOf = (c, d, i) => {
  const sp = c.dayTypes[d.type].blocks[i];
  return sp ? sp.values || FORMATS[sp.f].options.values : FORMATS.straight.options.values;
};

test('every pick of every day stays in its block and order; only sets, rounds and slots at a block\'s end are added', () => {
  const plain = B.build(cfg(), cat), long = B.build(cfg({ long: [35, 38] }), cat);
  long.days.forEach((d, i) => {
    const was = plain.days[i];
    assert.deepEqual([d.warmup, d.cooldown, d.name, d.level], [was.warmup, was.cooldown, was.name, was.level]);
    assert.equal(d.blocks.length, was.blocks.length);
    d.blocks.forEach((b, j) => {
      const old = was.blocks[j];
      assert.deepEqual(b.items.slice(0, old.items.length), old.items, `d${d.day} block ${j}: the old picks, in order`);
      assert.ok(b.items.length - old.items.length <= (b.kind === 'abs' ? 0 : 1), `d${d.day} block ${j}: at most one added slot`);
      assert.equal(new Set(d.blocks.flatMap((x) => x.items.map((it) => it.ex))).size, d.blocks.flatMap((x) => x.items).length, `d${d.day}: no exercise twice`);
    });
  });
});

// three day types, one of them light (one short block): its days stay lighter (decisions 340-344)
const three = (extra) => cfg({
  cycle: ['a', 'b', 'l'],
  dayTypes: { ...cfg().dayTypes, l: { label: 'L', short: 'L', blocks: [C('Legs', ['squat', 'lunge', 'hinge'])] } },
  ...extra,
});
const avg = (c, p) => p.days.reduce((s, d) => s + mins(c, d), 0) / p.days.length;

test("two day types: every day lands in 35 to 41.8 (10% over), the average in 35–38, and the card shows each day's range", () => {
  const c = cfg({ long: [35, 38] }), p = B.build(c, cat);
  p.days.forEach((d) => {
    const t = mins(c, d);
    assert.ok(t >= 35 && t <= 41.8, `d${d.day}: ${t.toFixed(1)} min`);
    assert.equal(d.est, Math.round(t));
  });
  assert.ok(avg(c, p) >= 35 && avg(c, p) <= 38, avg(c, p).toFixed(1));
  const ests = p.days.map((d) => d.est);
  assert.deepEqual(p.minutes, [Math.min(...ests), Math.max(...ests)]);
});

test('three day types: the shortest stays lighter (at least 28), the others carry the average, none past 41.8', () => {
  const c = three({ long: [35, 38] }), plain = B.build(three(), cat), p = B.build(c, cat);
  const light = p.days.filter((d) => d.type === 'l'), main = p.days.filter((d) => d.type !== 'l');
  light.forEach((d) => assert.ok(mins(c, d) >= Math.min(28, mins(c, plain.days[d.day - 1])) - 0.01, `light d${d.day}: ${mins(c, d).toFixed(1)}`));
  assert.ok(light.every((d) => mins(c, d) < 35), 'the lighter days stay lighter');
  p.days.forEach((d) => assert.ok(mins(c, d) <= 41.8, `d${d.day}: ${mins(c, d).toFixed(1)}`));
  assert.ok(main.every((d) => mins(c, d) >= 35), 'the main days are long');
  assert.ok(avg(c, p) >= 35, avg(c, p).toFixed(1));
});

test("when the main days can't carry the average, the light days are lengthened like the rest", () => {
  // main day types held at 3 sets and no abs: they can't reach the 38.5 a light day at 28 would need
  const held = (extra) => three({
    absSlots: [],
    dayTypes: {
      a: { label: 'A', short: 'A', blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad'], { values: [3] }), S('Squat', ['squat', 'squat', 'squat'], { values: [3] })] },
      b: { label: 'B', short: 'B', blocks: [S('Pull', ['row', 'row', 'row'], { values: [3] }), S('Hinge', ['hinge', 'hinge', 'hinge'], { values: [3] })] },
      l: { label: 'L', short: 'L', minutes: [18, 22], blocks: [C('Legs', ['squat', 'lunge', 'hinge']), C('Push', ['push', 'push', 'push'])] }, // its own shorter range, like Signature's arms & core
    },
    ...extra,
  });
  const c = held({ long: [35, 38] }), p = B.build(c, cat);
  assert.ok(p.days.filter((d) => d.type === 'l').every((d) => mins(c, d) >= 35), 'the light days went past their floor of 28, to 35');
});

test('formats grow only by their own rules: values from the format, no slot where it adds no time', () => {
  const c = cfg({ long: [35, 38] }), plain = B.build(cfg(), cat), p = B.build(c, cat);
  p.days.forEach((d, i) => d.blocks.forEach((b, j) => {
    const key = b.kind === 'abs' ? 'sets' : FORMATS[b.format].options.key;
    assert.ok(valuesOf(c, d, j).includes(b[key]), `d${d.day} block ${j}: ${key} ${b[key]}`);
    assert.ok(b[key] >= plain.days[i].blocks[j][key], 'never fewer');
    if (b.format === 'emom') assert.equal(b.items.length, plain.days[i].blocks[j].items.length, 'an EMOM grows by minutes only');
  }));
});

test('a config that can\'t reach its band gets longer anyway, and its minutes say what its days reached', () => {
  const c = boxing({ long: [35, 38] }), plain = B.build(boxing(), cat), p = B.build(c, cat);
  p.days.forEach((d, i) => {
    assert.ok(mins(c, d) > mins(c, plain.days[i]), `d${d.day} longer`);
    assert.equal(d.blocks[0].items.length, plain.days[i].blocks[0].items.length + 1, 'one more bout, no more');
  });
  const ests = p.days.map((d) => d.est);
  assert.deepEqual(p.minutes, [Math.min(...ests), Math.max(...ests)]);
  assert.ok(p.minutes[1] < 35);
});

test('added slots prefer catalogue 13\'s exercises, and the pass never touches the build\'s random stream', () => {
  // blocks held at 2 sets or rounds: only a slot can make them longer
  const capped = (extra) => cfg({ cycle: ['a'], dayTypes: { a: { label: 'A', short: 'A', blocks: [S('Press', ['pushLoad', 'pushLoad', 'pushLoad'], { values: [2] }), C('Legs', ['squat', 'lunge', 'hinge'], { values: [2] })] } }, absSlots: [], ...extra });
  const c = capped({ long: [35, 38] }), plain = B.build(capped(), cat), p = B.build(c, cat);
  const added = p.days.flatMap((d, i) => d.blocks.flatMap((b, j) => b.items.slice(plain.days[i].blocks[j].items.length)));
  assert.ok(added.length > 0);
  assert.ok(added.every((it) => cat.EX[it.ex].added === 13), added.map((it) => it.ex).join());
  assert.deepEqual(B.build(c, cat), p, 'the same config builds the same days');
});

test('a config without `long` builds exactly as before, and programs.config.js applies configs/long.js', () => {
  const LONG = require('../configs/long.js');
  assert.deepEqual(B.build(cfg({ long: undefined }), cat), B.build(cfg(), cat));
  B.CONFIGS.forEach((x) => assert.deepEqual(x.long, LONG[x.id], x.id));
  Object.keys(LONG).forEach((id) => assert.ok(B.CONFIGS.some((x) => x.id === id), `${id} is a program`));
});
