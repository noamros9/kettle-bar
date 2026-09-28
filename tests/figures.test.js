// Figure engine, through its two drawing functions, with made-up poses so each option is visible.
const test = require('node:test');
const assert = require('node:assert/strict');
const { figureSVG, muscleMapSVG } = require('../figures.js');

const stand = { t: [0, -34], hn: [-4, 30], hf: [4, 30], fn: [-4, 41], ff: [4, 41] };
const draw = (poses, extra = {}) => figureSVG({ name: 'Test move', poses, ...extra });
const count = (svg, re) => (svg.match(re) || []).length;

test('a figure is one frame per pose, labelled with the exercise name unless a label is given', () => {
  const svg = draw([stand, stand]);
  assert.equal(count(svg, /<g transform="translate\(/g), 2);
  assert.match(svg, /aria-label="Test move"/);
  assert.match(figureSVG({ name: 'x', poses: [stand] }, 'Custom'), /aria-label="Custom"/);
  assert.doesNotMatch(svg, /NaN/);
});

test('ground, mat, wall and pull-up bar', () => {
  assert.match(draw([stand]), /stroke="var\(--ground\)"/);
  assert.match(draw([{ ...stand, mat: 1 }]), /fill="var\(--mat\)"/);
  assert.match(draw([{ ...stand, wall: 30 }]), /opacity=".55"/);
  const bar = draw([{ ...stand, bar: 1, hn: [-4, -60], hf: [4, -60] }]);
  assert.match(bar, /y1="8" x2="116" y2="8" stroke="var\(--prop\)"/);
  assert.doesNotMatch(bar, /var\(--ground\)/);
});

test('dumbbells in either hand or both, kettlebells in either hand or both', () => {
  const lines = (p) => count(draw([{ ...stand, ...p }]), /stroke="var\(--kit\)" stroke-width/g);
  assert.equal(lines({}), 0);
  assert.equal(lines({ db: 'n' }), 3);
  assert.equal(lines({ db: 'f' }), 3);
  assert.equal(lines({ db: 'nf' }), 6);
  assert.equal(lines({ db: 'both' }), 3);
  for (const kb of ['n', 'f', 'both']) {
    const svg = draw([{ ...stand, kb }]);
    assert.equal(count(svg, /fill="none" stroke="var\(--kit\)"/g), 1, kb);
    assert.equal(count(svg, /r="6.6" fill="var\(--kit\)"/g), 1, kb);
  }
  assert.match(draw([{ ...stand, kb: 'n', kbd: [0, 1] }]), /var\(--kit\)/);
});

test('front view draws shoulders and hips as bars; custom joint hints and head direction are allowed', () => {
  const front = draw([stand], { view: 'front' });
  assert.ok(count(front, /stroke-width="7"/g) === 2);
  assert.doesNotMatch(draw([{ ...stand, eh: [1, 0], kh: [-1, 0], hd: [1, -1], lift: 5 }]), /NaN/);
  assert.doesNotMatch(draw([{ ...stand, ehn: [1, 0], ehf: [1, 0], khn: [-1, 0], khf: [-1, 0] }]), /NaN/);
});

test('limbs cope with targets out of reach, very close, or exactly on the joint', () => {
  for (const p of [{ hn: [-80, 0] }, { hn: [0, -33] }, { fn: [0, 0] }, { t: [0, 0] }]) {
    assert.doesNotMatch(draw([{ ...stand, ...p }]), /NaN/, JSON.stringify(p));
  }
});

test('muscle map: primary dark, secondary light, the rest plain, front and back, mirrored', () => {
  const svg = muscleMapSVG(['chest'], ['biceps']);
  assert.match(svg, /aria-label="Muscles worked"/);
  assert.equal(count(svg, /class="mm-p"/g), 2, 'chest on both halves');
  assert.equal(count(svg, /class="mm-s"/g), 2);
  assert.ok(count(svg, /class="mm-o"/g) > 10);
  assert.match(svg, />Front<\/text>[\s\S]*>Back<\/text>/);
  assert.match(muscleMapSVG([], [], 'Push-up muscles'), /aria-label="Push-up muscles"/);
});
