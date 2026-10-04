// Phase 16 ticket 3: Variety programs. A config with `variety: true` has day types and formats but no cycle; expand()
// deals one (day type, format) pair per day, none twice, and the rest of the engine sees an ordinary config.
const test = require('node:test');
const assert = require('node:assert/strict');
const { expand, ALLOWED } = require('../variety.js');
const { S, C } = require('../configs/shared.js');
const { buildConfig, CONFIGS } = require('../program-builder.js');

const base = (over = {}) => ({
  id: 'variety-test', name: 'Variety Test', subject: 'Variety', minutes: [28, 40], levers: [null, 'reps', 'variation'], variety: true, catalogue: 9,
  names: Array.from({ length: 20 }, (_, i) => `Name ${i + 1}`), formats: ['straight', 'circuit', 'emom', 'amrap', 'tabata', 'ladder'],
  dayTypes: Object.fromEntries(['push', 'pull', 'legs', 'core', 'full', 'arms', 'hips', 'conditioning', 'shoulders', 'back'].map((k) => [k, {
    label: k[0].toUpperCase() + k.slice(1), short: k, blocks: [{ ...S('Main', ['push', 'squat', 'hinge', 'row']), vary: true }, C('Finisher', ['cardio', 'cardio'])],
  }])),
  ...over,
});
const pairs = (cfg) => cfg.cycle.map((k) => [k.split('-')[0], cfg.dayTypes[k].blocks[0].f]);

test('60 days, each its own day type and format: no pair twice, and the same day type never two days running', () => {
  const cfg = expand(base());
  assert.equal(cfg.cycle.length, 60);
  assert.equal(new Set(cfg.cycle).size, 60, 'every day its own day type');
  assert.equal(new Set(pairs(cfg).map((p) => p.join('|'))).size, 60, 'no (day type, format) twice');
  pairs(cfg).forEach((p, i) => { if (i) assert.notEqual(p[0], pairs(cfg)[i - 1][0], `day ${i + 1} repeats day ${i}'s type`); });
});

test('a 30-day Variety program deals 30', () => {
  const cfg = expand(base({ days: 30 }));
  assert.equal(cfg.cycle.length, 30);
  assert.equal(new Set(cfg.cycle).size, 30);
});

test('only the blocks marked vary take the day\'s format; the label says the format; the rest stays as written', () => {
  const cfg = expand(base());
  Object.entries(cfg.dayTypes).forEach(([k, t]) => {
    const [type, f] = k.split('-');
    assert.equal(t.blocks[0].f, f);
    assert.ok(!('vary' in t.blocks[0]), 'the mark is dropped');
    assert.deepEqual(t.blocks[1], C('Finisher', ['cardio', 'cardio']));
    assert.match(t.label, new RegExp(`^${type[0].toUpperCase()}`));
    assert.match(t.label, / · /);
  });
  assert.equal(cfg.split, 'Every day is different');
  assert.equal(expand(base({ split: 'Own words' })).split, 'Own words');
});

test('the same config deals the same days (pins hold); another id deals other days', () => {
  assert.deepEqual(expand(base()).cycle, expand(base()).cycle);
  assert.notDeepEqual(expand(base()).cycle, expand(base({ id: 'variety-other' })).cycle);
});

test('a day type can narrow the formats it takes', () => {
  const b = base({ formats: ['straight', 'superset', 'circuit', 'emom', 'amrap', 'tabata', 'ladder'] }); // 9 × 7 + 2 = 65 pairs
  b.dayTypes.core.formats = ['emom', 'tabata'];
  const cfg = expand(b);
  Object.keys(cfg.dayTypes).filter((k) => k.startsWith('core-')).forEach((k) => assert.ok(['emom', 'tabata'].includes(k.split('-')[1]), k));
});

test('refused: too few pairs for its days, a format that is not a work format, a day type with nothing to vary', () => {
  assert.throws(() => expand(base({ formats: ['straight', 'circuit'] })), /needs at least 60 different day types and formats, not 20/);
  assert.throws(() => expand(base({ formats: ['straight', 'flow', 'circuit', 'emom', 'amrap', 'tabata'] })), /flow is not a format a Variety day can take/);
  const b = base(); b.dayTypes.push.blocks = [S('Main', ['push'])];
  assert.throws(() => expand(b), /push: no block is marked vary/);
  assert.deepEqual(ALLOWED, ['straight', 'superset', 'circuit', 'emom', 'amrap', 'tabata', 'ladder']);
});

test('a config without variety is left exactly as it is (the library\'s other programs never change)', () => {
  CONFIGS.filter((c) => !c.variety).forEach((c) => assert.equal(expand(c), c, c.id));
});

test('a Variety config builds: 60 days, each day\'s main block in its own format', () => {
  const p = buildConfig(expand(base()));
  assert.equal(p.days.length, 60);
  p.days.forEach((d) => assert.equal(d.blocks.find((b) => b.kind === 'main').format, d.type.split('-')[1], `day ${d.day}`));
  assert.equal(p.split, 'Every day is different');
});

test('build your own leaves Variety programs out of its recipe book (60 one-off day types are not a subject to pick)', () => {
  const { generate } = require('../recipe-book.js');
  const families = [['Strength', ['Strength']], ['Mixed', []]];
  const strength = CONFIGS.find((c) => c.id === 'full-body-strength');
  const book = generate({ configs: [strength, expand(base())], families, catalogue: 9 });
  assert.ok(book.skipped.includes('variety-test'));
  assert.ok(!book.subjects.some((s) => s[0] === 'Variety'));
});
