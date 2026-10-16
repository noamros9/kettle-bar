// Phase 35 ticket 1 (289, 290, 291): the third figure, the FMF/MMF tag and where a catalogue-14 exercise is dealt.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX, TRIO, markedTrio } = require('../exercises.js');
const { figureSVG, animationFrames } = require('../figures.js');
const { filedUnder } = require('../program-builder.js');

const STAND = { t: [0, -34], hn: [3, -1], hf: [1, -1], fn: [2, 41], ff: [-2, 41] };
const KNEEL = { t: [4, -30], hn: [8, -6], hf: [6, -6], fn: [-20, 20], ff: [-22, 20], kh: [1, -0.5] };
const stub = (poses, extra = {}) => ({ id: 'stub_trio', name: 'Stub threesome', cat: 'couple', sub: 'oral', trio: 'FMF', poses, ...extra });
const count = (svg, s) => svg.split(s).length - 1;

test('a threesome draws three figures, the third behind in its own colour, with the pelvic mark on all three', () => {
  const svg = figureSVG(stub([markedTrio(STAND, STAND, [18, 0], 1, KNEEL, [-20, 0], 0)]));
  assert.ok(svg.includes('var(--fig)') && svg.includes('var(--fig2)') && svg.includes('var(--fig3)'));
  assert.equal(count(svg, 'fill="var(--mark)"'), 3);
  assert.ok(svg.indexOf('var(--fig3)') < svg.indexOf('var(--fig2)'), 'the third is drawn first, furthest back');
  const plain = figureSVG(stub([TRIO(STAND, STAND, [18, 0], 1, KNEEL, [-20, 0], 0)]));
  assert.equal(count(plain, 'fill="var(--mark)"'), 0, 'no mark unless asked');
  assert.ok(Number(plain.match(/viewBox="0 \S+ (\S+)/)[1]) >= 160, 'three figures get at least a pair\'s width');
});

test('a side view draws the third figure\'s far limbs in its far colour, and the third moves in the animation', () => {
  const ex = stub([TRIO(STAND, STAND, [18, 0], 1, STAND, [-20, 0], 0), TRIO(STAND, STAND, [18, 0], 1, KNEEL, [-20, 0], 0)]);
  assert.ok(figureSVG(ex).includes('var(--fig3-far)'));
  assert.ok(!figureSVG({ ...ex, view: 'front' }).includes('var(--fig3-far)'));
  const frames = animationFrames(ex, { steps: 4 });
  const thirdHead = (svg) => svg.match(/<circle cx="([\d.-]+)" cy="([\d.-]+)" r="7" fill="var\(--fig3\)"/).slice(1).join(',');
  assert.ok(new Set(frames.map(thirdHead)).size > 1);
});

test('a threesome keeps its act kind and the Threesome kind deals it too; a place × act exercise files under its place only', () => {
  assert.deepEqual(filedUnder({ sub: 'oral', trio: 'FMF' }), ['oral', 'threesome']);
  assert.deepEqual(filedUnder({ sub: 'fuck', trio: 'MMF' }), ['fuck', 'threesome']);
  assert.deepEqual(filedUnder({ sub: 'threesome', trio: 'FMF' }), ['threesome']);
  assert.deepEqual(filedUnder({ sub: 'pool', act: 'oral' }), ['pool']);
  assert.deepEqual(filedUnder({ sub: 'pool', act: 'threesome', trio: 'MMF' }), ['pool', 'threesome']);
  assert.deepEqual(filedUnder({ sub: 'oral' }), ['oral']);
});

// standing checks for the catalogue-14 tickets (2a–4l): every threesome is tagged and drawn with three figures
test('every tagged exercise is FMF or MMF and draws three figures in every pose; every place × act one sits at a place', () => {
  const PLACES = ['shower', 'pool', 'hottub', 'balcony', 'doorframe'];
  const bad = Object.values(EX).flatMap((e) => [
    ...(e.trio !== undefined && !['FMF', 'MMF'].includes(e.trio) ? [`${e.id}: trio ${e.trio}`] : []),
    ...(e.trio && !e.poses.every((p) => p.three) ? [`${e.id}: a pose without its third figure`] : []),
    ...(e.act !== undefined && !PLACES.includes(e.sub) ? [`${e.id}: act ${e.act} but sub ${e.sub}`] : []),
  ]);
  assert.deepEqual(bad, []);
});
