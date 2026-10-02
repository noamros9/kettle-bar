// Renderability: every program's days 1, 31 and 60 can be drawn by the page. The phone UI suite only samples
// one program per subject; this walk covers all of them, in milliseconds.
const test = require('node:test');
const assert = require('node:assert/strict');
const { buildAll } = require('../program-builder.js');
const Formats = require('../formats.js');
const cat = require('../exercises.js');
const { daySummary } = require('../app/summary.js');
const { createSession } = require('../app/session.js');
const { alternatives } = require('../app/swaps.js');

const DAYS = [1, 31, 60];
const { EX, MUSCLE_NAMES } = cat;

// what is wrong with this day, as a list of words (empty: the page can draw it)
function problems(program, day) {
  const bad = [];
  const attempt = (what, fn) => { try { return fn(); } catch (e) { bad.push(`${what}: ${e.message}`); return undefined; } };
  const known = (b) => !b.format || Object.hasOwn(Formats.FORMATS, b.format);
  const stretches = [day.warmup, day.cooldown].filter(Boolean);
  day.blocks.forEach((b, bi) => { if (!known(b)) bad.push(`block ${bi}: unknown format ${b.format}`); });
  [...day.blocks, ...stretches].forEach((b) => b.items.forEach((it) => {
    const e = EX[it.ex];
    if (!e) bad.push(`unknown exercise ${it.ex}`);
    else {
      if (!e.poses || !e.poses.length) bad.push(`${it.ex} has no poses`);
      if (!e.muscles || !e.muscles.primary || !e.muscles.primary.length) bad.push(`${it.ex} has no muscles`);
    }
  }));
  if (bad.length) return bad; // the rest needs known formats and exercises

  const lines = attempt('daySummary', () => daySummary(day, program, cat));
  if (lines && (lines.length !== 2 || lines.some((l) => typeof l !== 'string' || !l))) bad.push('daySummary is not two lines');
  const session = attempt('createSession', () => createSession(program, day, { EX }));
  if (session) {
    day.blocks.forEach((b, bi) => {
      if (!Formats.of(b).timed) return;
      const p = attempt(`plan of block ${bi}`, () => session.plan({ type: 'block', bi }));
      if (!p || !p.phases || !p.phases.length || !p.then) bad.push(`block ${bi} (${b.format}) has no plan`);
    });
  }
  day.blocks.forEach((b, bi) => b.items.forEach((it, i) => {
    attempt(`alternatives of block ${bi} item ${i}`, () => alternatives(it.ex, b, program, cat));
  }));
  return bad;
}

const programs = require('./helpers/library.js').library();

test('the walk covers every program', () => {
  assert.ok(programs.length >= 98, `${programs.length} programs`);
});

for (const program of programs) {
  test(`${program.name}: days ${DAYS.join(', ')} are renderable`, () => {
    for (const n of DAYS) {
      const day = program.days[n - 1];
      assert.ok(day, `day ${n} exists`);
      assert.deepEqual(problems(program, day), [], `day ${n}`);
    }
  });
}

test('a day with an unknown format or exercise, or a summary that cannot be read, is reported', () => {
  const program = programs.find((p) => p.days[0].blocks.some((b) => Formats.of(b).timed)) || programs[0];
  const day = program.days[0], copy = () => JSON.parse(JSON.stringify(day));
  assert.deepEqual(problems(program, day), []);

  const format = copy(); format.blocks[0].format = 'pyramid';
  assert.match(problems(program, format).join('\n'), /unknown format pyramid/);

  const exercise = copy(); exercise.blocks[0].items[0].ex = 'no_such_exercise';
  assert.match(problems(program, exercise).join('\n'), /unknown exercise no_such_exercise/);

  const noType = copy(); noType.blocks[0].format = 'straight'; noType.blocks[0].items = [{ ex: Object.keys(EX)[0], n: 5 }];
  const broken = { ...program, dayTypes: {}, levels: [] }; // a program the summary cannot read
  assert.match(problems(broken, noType).join('\n'), /daySummary/);
});
