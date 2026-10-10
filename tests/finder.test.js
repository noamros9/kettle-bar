// ci-only: builds or reads the whole program library; the commit hook skips it, CI runs it (decision 312)
// The Program finder (Phase 15 ticket 3): finder text, limits read with plain rules, the why line, and ranking.
const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('../app/finder.js');

test('limits: minutes, gear and length read from plain words; nothing said, no limit', () => {
  const L = (q) => F.limits(q);
  assert.deepEqual(L('something for my back'), { minutes: null, gear: null, days: null });
  assert.deepEqual(L('20 minutes').minutes, [17, 23]);
  assert.deepEqual(L('20 min, no gear').minutes, [17, 23]);
  assert.deepEqual(L("about 30'").minutes, [27, 33]);
  assert.deepEqual(L('half an hour').minutes, [27, 33]);
  assert.deepEqual(L('a quarter of an hour').minutes, [12, 18]);
  assert.deepEqual(L('an hour').minutes, [50, 70]);
  assert.deepEqual(L('20-30 minutes').minutes, [20, 30]);
  assert.deepEqual(L('20 to 30 min').minutes, [20, 30]);
  assert.deepEqual(L('under 25 minutes').minutes, [0, 25]);
  assert.deepEqual(L('less than 20 min').minutes, [0, 20]);
  assert.deepEqual(L('something short').minutes, [0, 25]);
  assert.deepEqual(L('quick workout').minutes, [0, 25]);
  assert.deepEqual(L('a long session').minutes, [35, 90]);
  assert.equal(L('no gear').gear, 'bw');
  assert.equal(L('No equipment please').gear, 'bw');
  assert.equal(L('bodyweight only').gear, 'bw');
  assert.equal(L('without equipment').gear, 'bw');
  assert.equal(L('just a kettlebell').gear, 'kb');
  assert.equal(L('with my dumbbells').gear, null, 'dumbbells: all gear, no limit');
  assert.equal(L('a month of yoga').days, 30);
  assert.equal(L('30 days').days, 30);
  assert.equal(L('a 30-day plan').days, 30);
  assert.equal(L('two months').days, 60);
  assert.equal(L('60 days').days, 60);
  assert.deepEqual(F.limits(''), { minutes: null, gear: null, days: null });
  assert.deepEqual(F.limits(undefined), { minutes: null, gear: null, days: null });
});

const P = {
  back: { id: 'back', name: 'Back Basics', subject: 'Back care', split: 'Big three / movement', minutes: [18, 23], equip: 'bw', dayCount: 60, about: 'A steady routine for a back that likes to complain.' },
  bell: { id: 'bell', name: 'Kettlebell 30', subject: 'Kettlebell only', split: 'Swing / press / squat', minutes: [25, 30], equip: 'kb', dayCount: 30, about: 'A month with one kettlebell.' },
  iron: { id: 'iron', name: 'Iron PPL', subject: 'Strength', split: 'Push / pull / legs', minutes: [38, 42], equip: 'all', dayCount: 60, about: 'Push, pull and legs days.' },
};

test('fits: minutes overlap, gear you have (kettlebell takes no-equipment programs too), length', () => {
  assert.ok(F.fits(P.back, F.limits('20 minutes, no gear')));
  assert.ok(!F.fits(P.iron, F.limits('20 minutes')));
  assert.ok(F.fits(P.back, F.limits('kettlebell')), 'a kettlebell owner can do no-equipment programs');
  assert.ok(F.fits(P.bell, F.limits('kettlebell')));
  assert.ok(!F.fits(P.iron, F.limits('kettlebell')));
  assert.ok(!F.fits(P.bell, F.limits('no gear')));
  assert.ok(F.fits(P.bell, F.limits('a month')));
  assert.ok(!F.fits(P.back, F.limits('a month')));
  assert.ok(F.fits(P.iron, F.limits('')), 'no limits: everything fits');
});

test('why: subject, minutes, gear, a 30-day length, and the words it matched', () => {
  assert.equal(F.why(P.back, 'easy for my back, 20 minutes, no gear'), 'Back care · 18–23 min · no equipment · matches “back”');
  assert.equal(F.why(P.bell, 'a month with a kettlebell'), 'Kettlebell only · 25–30 min · kettlebell only · 30 days · matches “kettlebell”');
  assert.equal(F.why(P.iron, 'push and legs'), 'Strength · 38–42 min · dumbbells & kettlebell · matches “push”, “legs”');
  assert.equal(F.why(P.iron, ''), 'Strength · 38–42 min · dumbbells & kettlebell');
  assert.equal(F.why({ ...P.back, minutes: [20, 20] }, 'x'), 'Back care · 20 min · no equipment');
});

test('textOf: name, subject, split, blurb, about, formats and main muscles, as one paragraph', () => {
  const t = F.textOf({ ...P.back, blurb: 'Curl-ups, side planks and bird dogs.', formats: ['straight', 'flow'] }, { focus: { abs: 0.4, glutes: 0.3, lower_back: 0.2, calves: 0.01 }, names: { abs: 'Abs', glutes: 'Glutes', lower_back: 'Lower back', calves: 'Calves' } });
  assert.equal(t, 'Back Basics. Back care. Big three / movement. Curl-ups, side planks and bird dogs. A steady routine for a back that likes to complain. Straight sets, guided flows. Works abs, glutes, lower back.');
  assert.equal(F.textOf({ name: 'X', subject: 'Y' }), 'X. Y.');
});

test('rank: closest meaning first among programs that fit the limits; the rest only if too few fit', () => {
  const vecs = { back: [1, 0, 0], bell: [0.8, 0.6, 0], iron: [0, 0, 1] };
  const q = [1, 0, 0];
  assert.deepEqual(F.rank(vecs, q, P, F.limits(''), 2).map((r) => r.id), ['back', 'bell']);
  assert.deepEqual(F.rank(vecs, q, P, F.limits('kettlebell, a month'), 3).map((r) => [r.id, r.fits]), [['bell', true], ['back', false], ['iron', false]]);
  assert.equal(F.rank(vecs, q, P, F.limits(''), 5).length, 3);
  assert.ok(Math.abs(F.cosine([1, 0], [1, 1]) - Math.SQRT1_2) < 1e-9);
  assert.equal(F.cosine([0, 0], [1, 1]), 0);
  assert.deepEqual(F.rank({ ...vecs, gone: [1, 0, 0] }, q, P, F.limits(''), 5).map((r) => r.id), ['back', 'bell', 'iron'], 'a vector for an unknown program is ignored');
});

test('the build writes data/finder.json: every program\'s finder text, with its main muscles', () => {
  const out = require('./helpers/library.js').rendered(), lib = require('./helpers/library.js').library();
  const texts = JSON.parse(out['data/finder.json']);
  assert.deepEqual(Object.keys(texts).sort(), lib.map((p) => p.id).sort());
  assert.match(texts['back-basics'], /^Back Basics\. Back care\. .* Works [a-z ,]+\.$/);
  assert.ok(out['index.html'].includes('KBFinder'), 'the page has the finder');
});

test('edges: a built program (its days) or one that says nothing about length; no equip means all gear; an unnamed muscle', () => {
  const built = { ...P.bell, dayCount: undefined, days: Array.from({ length: 30 }, (_, i) => ({ day: i + 1 })) };
  assert.ok(F.fits(built, F.limits('a month')));
  assert.ok(F.fits({ ...P.iron, dayCount: undefined }, F.limits('60 days')), 'nothing said: 60 days');
  assert.equal(F.why({ ...P.iron, equip: undefined }, ''), 'Strength · 38–42 min · dumbbells & kettlebell');
  assert.equal(F.textOf({ name: 'X', subject: 'Y' }, { focus: { side_delts: 0.5 } }), 'X. Y. Works side_delts.');
});

// ---- Phase 15 ticket 2: Help me pick (goal, minutes, gear as taps) ----
test('GOALS cover every library subject, each subject once, and only subjects the families list', () => {
  const { FAMILIES } = require('../app/library.js');
  const listed = FAMILIES.flatMap(([, s]) => s);
  const goals = F.GOALS.flatMap(([, , subjects]) => subjects);
  assert.deepEqual([...goals].sort(), [...listed].sort());
  assert.equal(new Set(goals).size, goals.length);
  assert.deepEqual(F.MINUTES.map(([k]) => k), ['15', '20', '30', '35']);
  assert.deepEqual(F.GEAR.map(([k]) => k), ['bw', 'kb', 'all']);
});

test('pick: the goal\'s subjects within the minutes and gear; programs you have not started first; at most 5', () => {
  const { summarize, slim } = require('../app/programs.js');
  const lib = require('./helpers/library.js').library().map((p) => slim(summarize(p)));
  const r = F.pick(lib, { goal: 'gentle', minutes: '20', gear: 'bw' });
  assert.equal(r.loosened, null);
  assert.ok(r.list.length >= 1 && r.list.length <= 5);
  const subjects = F.GOALS.find(([k]) => k === 'gentle')[2];
  r.list.forEach((p) => { assert.ok(subjects.includes(p.subject), p.id); assert.ok(F.fits(p, { minutes: [18, 26], gear: 'bw', days: null }), p.id); });
  const started = F.pick(lib, { goal: 'gentle', minutes: '20', gear: 'bw' }, { started: [r.list[0].id] });
  assert.notEqual(started.list[0].id, r.list[0].id, 'a program you started goes after the rest');
  assert.equal(F.pick(lib, { goal: 'strength', minutes: '35', gear: 'all' }).list.length, 5);
});

test('pick never comes back empty: it loosens the minutes first, then the gear, and says so', () => {
  const P2 = [{ id: 'a', subject: 'Yoga', minutes: [30, 35], equip: 'bw', dayCount: 60 }, { id: 'b', subject: 'Yoga', minutes: [40, 45], equip: 'all', dayCount: 60 }];
  assert.deepEqual(F.pick(P2, { goal: 'flex', minutes: '15', gear: 'bw' }).loosened, 'minutes');
  assert.deepEqual(F.pick(P2, { goal: 'flex', minutes: '15', gear: 'bw' }).list.map((p) => p.id), ['a']);
  const P3 = [{ id: 'b', subject: 'Yoga', minutes: [40, 45], equip: 'all', dayCount: 60 }];
  assert.deepEqual(F.pick(P3, { goal: 'flex', minutes: '15', gear: 'bw' }), { list: [P3[0]], loosened: 'both' });
  assert.deepEqual(F.pick(P3, { goal: 'fight', minutes: '15', gear: 'bw' }), { list: [], loosened: 'both' }, 'a goal with no programs at all');
});

test('pick with an unknown goal finds nothing; unknown minutes set no minutes limit', () => {
  const P2 = [{ id: 'a', subject: 'Yoga', minutes: [40, 45], equip: 'bw', dayCount: 60 }];
  assert.deepEqual(F.pick(P2, { goal: 'zzz', minutes: '30', gear: 'bw' }).list, []);
  assert.deepEqual(F.pick(P2, { goal: 'flex', minutes: 'zzz', gear: 'bw' }), { list: P2, loosened: null });
});

// ---- ticket 5: Ask the finder ----
test('quantize: a unit vector as whole numbers from -127 to 127 (the deploy\'s program vectors); cosine reads them as they are', () => {
  assert.deepEqual(F.quantize([1, -1, 0.5, -0.003, 0]), [127, -127, 64, 0, 0]);
  const a = [0.6, 0.8, 0], b = [0.8, 0.6, 0];
  assert.ok(Math.abs(F.cosine(F.quantize(a), b) - F.cosine(a, b)) < 0.01);
});

test('track and percent: the download\'s progress over every file the model reports', () => {
  let files = {};
  assert.equal(F.percent(files), null, 'nothing reported yet');
  files = F.track(files, { status: 'initiate', file: 'config.json' });
  assert.equal(F.percent(files), null);
  files = F.track(files, { status: 'progress', file: 'onnx/model_quantized.onnx', loaded: 5, total: 20 });
  files = F.track(files, { status: 'progress', file: 'tokenizer.json', loaded: 10, total: 10 });
  assert.equal(F.percent(files), 50);
  files = F.track(files, { status: 'progress', file: 'onnx/model_quantized.onnx', loaded: 20, total: 20 });
  assert.equal(F.percent(files), 100);
  assert.equal(F.track(files, undefined), files);
  assert.equal(F.percent({ x: { loaded: 0, total: 0 } }), null);
});

test('answer: the programs that fit, at most five; with fewer than three, the closest others fill up to three and say so', () => {
  const r = (fit, n) => Array.from({ length: n }, (_, i) => ({ id: (fit ? 'f' : 'o') + i, score: 1 - i / 10, fits: fit }));
  assert.deepEqual(F.answer([...r(true, 6)]), { ids: ['f0', 'f1', 'f2', 'f3', 'f4'], fitting: 5 });
  assert.deepEqual(F.answer([...r(true, 3), ...r(false, 2)]), { ids: ['f0', 'f1', 'f2'], fitting: 3 });
  assert.deepEqual(F.answer([...r(true, 1), ...r(false, 4)]), { ids: ['f0', 'o0', 'o1'], fitting: 1 });
  assert.deepEqual(F.answer(r(false, 4)), { ids: ['o0', 'o1', 'o2'], fitting: 0 });
  assert.deepEqual(F.answer([]), { ids: [], fitting: 0 });
});
