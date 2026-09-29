// Workout Session: rest rules and timer plans, no browser needed.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const { createSession } = require('../app/session.js');
const { buildAll } = require('../program-builder.js');

const programs = Object.fromEntries(buildAll().map((p) => [p.id, p]));
const day = (pid, n) => programs[pid].days[n - 1];
const firstOf = (pid, format) => programs[pid].days.find((d) => d.blocks.some((b) => b.format === format));

test('straight sets: 30 s between sets, 1 min between exercises, 2 min before abs', () => {
  const p = programs['three-split-60'], w = day('three-split-60', 1), s = createSession(p, w, { EX });
  const b = w.blocks[0], last = b.items.length - 1;
  assert.equal(s.complete({ type: 'set', bi: 0, i: 0, k: 1 }).rest.sec, 30);
  assert.equal(s.complete({ type: 'set', bi: 0, i: 0, k: b.items[0].sets }).rest.sec, 60);
  const toAbs = s.complete({ type: 'set', bi: 0, i: last, k: b.items[last].sets });
  assert.equal(toAbs.rest.sec, 120);
  assert.match(toAbs.rest.label, /abs next/);
});

test('tapping the same set again un-ticks it and starts no rest', () => {
  const p = programs['three-split-60'], s = createSession(p, day('three-split-60', 1), { EX });
  s.complete({ type: 'set', bi: 0, i: 0, k: 1 });
  assert.deepEqual(s.complete({ type: 'set', bi: 0, i: 0, k: 1 }), { none: true });
  assert.equal(s.state(0).sets[0], 0);
});

test('the last set of the workout ends it and points to the cool-down', () => {
  const w = day('three-split-60', 1), s = createSession(programs['three-split-60'], w, { EX });
  w.blocks.forEach((b, bi) => b.items.forEach((it, i) => s.complete({ type: 'set', bi, i, k: it.sets })));
  assert.ok(s.allDone());
});

test('supersets rest 45 s between rounds, 1 min between pairs', () => {
  const w = firstOf('upper-lower-power', 'superset'), p = programs['upper-lower-power'], s = createSession(p, w, { EX });
  const bi = w.blocks.findIndex((b) => b.format === 'superset'), b = w.blocks[bi];
  assert.equal(s.complete({ type: 'pair', bi, pi: 0, k: 1 }).rest.sec, 45);
  assert.equal(s.complete({ type: 'pair', bi, pi: 0, k: b.sets }).rest.sec, 60);
});

test('circuits rest 1 min between rounds', () => {
  const w = firstOf('engine', 'circuit'), s = createSession(programs.engine, w, { EX });
  const bi = w.blocks.findIndex((b) => b.format === 'circuit');
  assert.equal(s.complete({ type: 'round', bi, k: 1 }).rest.sec, 60);
});

test('EMOM plan: one 60 s phase per minute, rotating exercises, long beep at the end', () => {
  const w = firstOf('minute-man', 'emom'), s = createSession(programs['minute-man'], w, { EX });
  const bi = w.blocks.findIndex((b) => b.format === 'emom'), b = w.blocks[bi];
  const plan = s.plan({ type: 'block', bi });
  const minutes = plan.phases.filter((x) => x.sec === 60);
  assert.equal(minutes.length, b.minutes);
  assert.match(minutes[1].label, new RegExp(EX[b.items[1 % b.items.length].ex].name));
  assert.equal(plan.phases.at(-1).end, 'long');
  assert.deepEqual(plan.then, { type: 'block', bi });
});

test('Tabata plan: 8 × (20 s work + 10 s rest) per Tabata, without the last rest', () => {
  const w = firstOf('tabata-ten', 'tabata'), s = createSession(programs['tabata-ten'], w, { EX });
  const bi = w.blocks.findIndex((b) => b.format === 'tabata'), b = w.blocks[bi];
  const plan = s.plan({ type: 'block', bi });
  assert.equal(plan.phases.filter((x) => x.sec === 20).length, 8 * b.tabatas);
  assert.equal(plan.phases.filter((x) => x.sec === 10).length, 7 * b.tabatas);
});

test('hold plan: 3 s get-ready, then the hold; one-side holds get both sides and a switch', () => {
  const p = programs['three-split-60'];
  const w = p.days.find((d) => d.blocks.some((b) => b.items.some((it) => EX[it.ex].u === 'sec' && EX[it.ex].side)));
  const s = createSession(p, w, { EX });
  const bi = w.blocks.findIndex((b) => b.items.some((it) => EX[it.ex].u === 'sec' && EX[it.ex].side));
  const i = w.blocks[bi].items.findIndex((it) => EX[it.ex].u === 'sec' && EX[it.ex].side);
  const plan = s.plan({ type: 'hold', bi, i });
  assert.equal(plan.phases[0].sec, 3);
  assert.equal(plan.phases.filter((x) => x.work).length, 2);
  assert.ok(plan.phases.some((x) => x.label === 'Switch sides'));
});

test('stretch plans run the whole warm-up and mark it done', () => {
  const w = day('three-split-60', 1), s = createSession(programs['three-split-60'], w, { EX });
  const plan = s.plan({ type: 'stretch', key: 'warm' });
  const work = plan.phases.filter((x) => x.work).reduce((a, x) => a + x.sec, 0);
  assert.equal(work, w.warmup.seconds);
  s.complete(plan.then);
  assert.ok(s.stretchDone('warm'));
});

// resume: a stored snapshot brings the session back exactly
const viaJson = (s) => JSON.parse(JSON.stringify(s.snapshot())); // what the device stores
const hiit = () => ({ p: programs['hiit-20'], w: day('hiit-20', 1) });

test('a snapshot restores ticks in two blocks and an AMRAP counter: same state, same next instruction', () => {
  const { p, w } = hiit();
  const amrap = w.blocks.findIndex((b) => b.format === 'amrap'), circ = w.blocks.findIndex((b) => b.format === 'circuit');
  const straight = w.blocks.findIndex((b) => (b.format || 'straight') === 'straight');
  assert.ok(circ >= 0 && straight >= 0 && amrap >= 0);
  const a = createSession(p, w, { EX });
  a.complete({ type: 'round', bi: circ, k: 1 });
  a.complete({ type: 'set', bi: straight, i: 0, k: 1 });
  a.count(amrap, 1); a.count(amrap, 1);
  a.complete({ type: 'stretch', key: 'warm' });
  a.setStarted(1234);
  const b = createSession(p, w, { EX, saved: viaJson(a) });
  assert.deepEqual(b.snapshot(), a.snapshot());
  assert.equal(b.state(circ).rounds, 1);
  assert.equal(b.state(straight).sets[0], 1);
  assert.equal(b.state(amrap).count, 2);
  assert.ok(b.stretchDone('warm') && !b.stretchDone('cool'));
  assert.equal(b.started(), 1234);
  const next = { type: 'set', bi: straight, i: 0, k: 2 };
  assert.deepEqual(b.complete(next), a.complete(next), 'the next instruction is the same');
  assert.notEqual(b.state(0), a.state(0), 'its own state, not shared with the snapshot');
});

test('a session that never started has no start time; supersets restore too', () => {
  const p = programs['no-gear-burn'], w = day('no-gear-burn', 1), bi = w.blocks.findIndex((b) => b.format === 'superset');
  const a = createSession(p, w, { EX });
  assert.equal(a.started(), null);
  a.complete({ type: 'pair', bi, pi: 0, k: 1 });
  const b = createSession(p, w, { EX, saved: viaJson(a) });
  assert.equal(b.state(bi).sets[0], 1);
  assert.equal(b.started(), null);
});

test('a snapshot that no longer matches the day is ignored whole, not half applied', () => {
  const { p, w } = hiit(), a = createSession(p, w, { EX });
  a.complete({ type: 'round', bi: 0, k: 1 });
  const fresh = createSession(p, w, { EX }).snapshot();
  const ignored = (saved) => assert.deepEqual(createSession(p, w, { EX, saved }).snapshot(), fresh);
  const s = viaJson(a);
  ignored({ ...s, state: s.state.slice(1) }); // a block fewer
  ignored({ ...s, state: [...s.state, s.state[0]] }); // a block more
  const items = viaJson(a); items.state[2].sets.pop(); ignored(items); // an item fewer
  const format = viaJson(a); format.state[0] = { f: 'straight', sets: [0] }; ignored(format); // another format
  const types = viaJson(a); types.state[0].rounds = 'one'; ignored(types);
  const stretched = viaJson(a); stretched.stretched = { warm: 1, cool: false }; ignored(stretched);
  ignored({ state: 'x', stretched: {} });
  ignored({});
  ignored(null);
  const other = programs['no-gear-burn'], sw = day('no-gear-burn', 1);
  assert.deepEqual(createSession(other, sw, { EX, saved: s }).snapshot(), createSession(other, sw, { EX }).snapshot(), 'another day\'s snapshot');
});

test('ticks still carry over a swap through from, start time included', () => {
  const { p, w } = hiit(), a = createSession(p, w, { EX });
  a.complete({ type: 'round', bi: 0, k: 1 }); a.setStarted(99);
  const b = createSession(p, w, { EX, from: a });
  assert.equal(b.state(0).rounds, 1);
  assert.equal(b.started(), 99);
});
