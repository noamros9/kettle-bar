// Warm-up that matches the format (Phase 7 ticket 6): boxing, kickboxing, HIIT and plyometrics days get a dynamic
// warm-up, yoga / Pilates / flexibility / mobility days a gentle one, picked when the day opens. Stored days keep their
// own warm-ups (pins), and the warm-up's length never changes, so stretching minutes stay what they were.
const test = require('node:test');
const assert = require('node:assert/strict');
const cat = require('../exercises.js');
const W = require('../app/warmup.js');
const { buildAll } = require('../program-builder.js');

const EX = cat.EX, all = require('./helpers/library.js').library();
const secondsOf = (w) => w.items.reduce((s, it) => s + it.n * (EX[it.ex].side ? 2 : 1), 0);
const daysOf = (subject) => all.filter((p) => p.subject === subject).flatMap((p) => p.days.map((d) => ({ ...d, subject })));

// ---- the plan's test first ----
test('a boxing day\'s warm-up holds only dynamic moves; a straight-set day\'s warm-up is unchanged', () => {
  const boxing = daysOf('Boxing');
  assert.ok(boxing.length);
  boxing.forEach((d) => {
    const w = W.warmupFor(d, EX, d.subject);
    assert.notEqual(w, d.warmup);
    w.items.forEach((it) => assert.ok(W.DYNAMIC.includes(it.ex), `day ${d.day}: ${it.ex}`));
    assert.ok(w.items.some((it) => it.ex === 'shadow_footwork'), 'a combat day starts on its feet');
  });
  const straight = all.find((p) => p.id === 'three-split-60').days[0];
  assert.equal(W.warmupFor(straight, EX), straight.warmup);
});

// ---- the rest ----
test('HIIT and plyometrics days are dynamic; yoga, Pilates, flexibility and mobility days gentle; mixed and strength days keep theirs (unless mostly jumps)', () => {
  for (const s of ['Kickboxing', 'HIIT', 'Plyometrics']) daysOf(s).forEach((d) => assert.equal(W.kindOf(d, EX, d.subject), 'dynamic', `${s} ${d.day}`));
  for (const s of ['Yoga', 'Pilates', 'Flexibility', 'Mobility & posture']) {
    daysOf(s).forEach((d) => {
      assert.equal(W.kindOf(d, EX, d.subject), 'gentle', `${s} ${d.day}`);
      W.warmupFor(d, EX, d.subject).items.forEach((it) => assert.ok(W.GENTLE.includes(it.ex), `${s} ${d.day}: ${it.ex}`));
    });
  }
  // a strength day keeps its own warm-up, unless most of it is jumps and cardio (Athletic Legs' power days, Phase 14): then it warms up dynamically
  const mostlyCardio = (d) => { const cats = d.blocks.filter((b) => b.kind !== 'abs').flatMap((b) => b.items.map((it) => EX[it.ex].cat)).filter((c) => c !== 'abs'); return cats.filter((c) => c === 'cardio').length * 2 > cats.length; };
  for (const s of ['Strength', 'Legs & glutes', 'Strength & stretch']) daysOf(s).forEach((d) => assert.equal(W.warmupFor(d, EX, d.subject) === d.warmup, !mostlyCardio(d), `${s} ${d.day}`));
});

test('every day\'s warm-up keeps its length, has no move twice, and is the same each time the day opens', () => {
  for (const p of all) {
    for (const d of p.days) {
      if (!d.warmup) continue;
      const w = W.warmupFor(d, EX, p.subject);
      assert.equal(secondsOf(w), d.warmup.seconds, `${p.id} ${d.day}`);
      assert.equal(w.seconds, d.warmup.seconds);
      assert.equal(new Set(w.items.map((it) => it.ex)).size, w.items.length, `${p.id} ${d.day}`);
      assert.deepEqual(W.warmupFor(d, EX, p.subject), w);
    }
  }
  const moves = new Set(daysOf('HIIT').flatMap((d) => W.warmupFor(d, EX, d.subject).items.map((it) => it.ex)));
  assert.ok(moves.size >= 3, 'it varies from day to day');
});

test('a day without a warm-up, or an odd length, is handled', () => {
  const d = daysOf('Boxing')[0];
  const none = { ...d, warmup: undefined };
  assert.equal(W.warmupFor(none, EX), none.warmup);
  const odd = W.warmupFor({ ...d, warmup: { ...d.warmup, seconds: 75 } }, EX);
  assert.equal(secondsOf(odd), 75);
  const long = W.warmupFor({ ...d, warmup: { ...d.warmup, seconds: 400 } }, EX);
  assert.equal(secondsOf(long), 400, 'more time than the moves: the last one runs longer');
  for (const g of daysOf('Yoga').slice(0, 4)) { // gentle moves include one-side ones: 15 s left goes to a two-sided move
    const w = W.warmupFor({ ...g, warmup: { ...g.warmup, seconds: 75 } }, EX, 'Yoga');
    assert.equal(secondsOf(w), 75);
    w.items.forEach((it) => assert.ok(Number.isInteger(it.n)));
  }
});

test('without a subject (your own programs, random workouts) the moves decide', () => {
  const [box] = daysOf('Boxing'), [yoga] = daysOf('Pilates'), [hiit] = daysOf('HIIT');
  assert.equal(W.kindOf(box, EX), 'dynamic');
  assert.equal(W.kindOf(yoga, EX), 'gentle');
  const cardio = { day: 1, blocks: [{ kind: 'main', items: [{ ex: 'jumping_jacks' }, { ex: 'high_knees' }, { ex: 'goblet_squat' }] }, { kind: 'main', items: [{ ex: 'plank' }] }] };
  assert.equal(W.kindOf(cardio, EX), 'dynamic', 'mostly cardio, abs aside');
  assert.equal(W.kindOf({ ...cardio, blocks: [{ kind: 'main', items: [{ ex: 'goblet_squat' }, { ex: 'jumping_jacks' }] }] }, EX), null);
  assert.equal(W.kindOf(hiit, EX, 'Strength'), W.kindOf(hiit, EX), 'a subject not named: the moves');
});

test('Phase 14 subjects: running and court days warm up dynamically, gentle and back-care days gently', () => {
  const W = require('../app/warmup.js'), { EX } = require('../exercises.js');
  const day = { blocks: [{ kind: 'main', items: [{ ex: 'glute_bridge' }] }], warmup: { seconds: 60, items: [] } };
  assert.deepEqual(['Running prep', 'Court & field sports', 'Gentle / low impact', 'Back care'].map((s) => W.kindOf(day, EX, s)), ['dynamic', 'dynamic', 'gentle', 'gentle']);
});
