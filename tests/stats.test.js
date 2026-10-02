// Stats: what a done day counts for (planned work, ADR 2), on a hand-made day.
const test = require('node:test');
const assert = require('node:assert/strict');
const { dayVolume } = require('../app/stats.js');

const EX = {
  push: { muscles: { primary: ['chest', 'triceps'], secondary: ['front_delts'] } },
  row: { muscles: { primary: ['lats'], secondary: ['biceps'] } },
  lunge: { side: 1, muscles: { primary: ['quads', 'glutes'], secondary: [] } },
  plank: { u: 'sec', muscles: { primary: ['abs'], secondary: [] } },
};
const it = (ex, n, extra) => ({ ex, n, ...extra });
const day = (blocks) => ({ est: 30, warmup: { seconds: 60 }, cooldown: { seconds: 120 }, blocks });

test('minutes: workout estimate and stretching (warm-up + cool-down), kept apart', () => {
  const v = dayVolume(day([]), EX);
  assert.equal(v.workoutMin, 30);
  assert.equal(v.stretchMin, 3);
  assert.equal(dayVolume({ est: 20, blocks: [] }, EX).stretchMin, 0);
});

test('straight sets: each item its own sets or the block\'s; one-side reps count both sides; holds add sets, not reps', () => {
  const v = dayVolume(day([{ sets: 3, items: [it('push', 10, { sets: 4 }), it('lunge', 8), it('plank', 30)] }]), EX);
  assert.equal(v.sets, 4 + 3 + 3);
  assert.equal(v.reps, 4 * 10 + 3 * 8 * 2);
});

test('supersets use the block sets, circuits the rounds', () => {
  assert.deepEqual(pick(dayVolume(day([{ format: 'superset', sets: 3, items: [it('push', 10), it('row', 8)] }]), EX)), { sets: 6, reps: 54 });
  assert.deepEqual(pick(dayVolume(day([{ format: 'circuit', rounds: 4, items: [it('push', 10), it('plank', 20)] }]), EX)), { sets: 8, reps: 40 });
});

test('EMOM: one set per minute, rotating through the exercises, with their reps', () => {
  const v = dayVolume(day([{ format: 'emom', minutes: 5, items: [it('push', 8), it('row', 6)] }]), EX);
  assert.deepEqual(pick(v), { sets: 5, reps: 3 * 8 + 2 * 6 });
});

test('Tabata: one set per 20 s round, no reps', () => {
  assert.deepEqual(pick(dayVolume(day([{ format: 'tabata', tabatas: 2, items: [it('push', 0), it('row', 0)] }]), EX)), { sets: 16, reps: 0 });
});

test('AMRAP and ladder: one set per exercise per 2 minutes (at least one), no reps', () => {
  assert.deepEqual(pick(dayVolume(day([{ format: 'amrap', minutes: 8, items: [it('push', 5), it('row', 5)] }]), EX)), { sets: 8, reps: 0 });
  assert.deepEqual(pick(dayVolume(day([{ format: 'ladder', minutes: 1, items: [it('push', 1)] }]), EX)), { sets: 1, reps: 0 });
});

function pick(v) { return { sets: v.sets, reps: v.reps }; }

test('muscle load: each set counts 1 for every main muscle and ½ for every secondary one', () => {
  const v = dayVolume(day([{ sets: 3, items: [it('push', 10)] }, { format: 'emom', minutes: 4, items: [it('row', 5), it('plank', 20)] }]), EX);
  assert.deepEqual(v.muscles, { chest: 3, triceps: 3, front_delts: 1.5, lats: 2, biceps: 1, abs: 2 });
});

// ---------- weeks and summaries ----------
const { weekStart, summarize } = require('../app/stats.js');
const lookup = (programs) => (pid, n) => programs[pid] && programs[pid].days[n - 1];

test('weeks start on Sunday at midnight, local time', () => {
  assert.deepEqual(weekStart(new Date(2026, 8, 26, 23, 30)), new Date(2026, 8, 20)); // Saturday night -> previous Sunday
  assert.deepEqual(weekStart(new Date(2026, 8, 27, 8, 0)), new Date(2026, 8, 27)); // Sunday morning -> that Sunday
  assert.deepEqual(weekStart(new Date(2026, 8, 20)), new Date(2026, 8, 20));
});

test('summarize adds up the done days inside a time range', () => {
  const programs = { p: { days: [day([{ sets: 3, items: [it('push', 10)] }]), { est: 20, blocks: [{ sets: 2, items: [it('row', 8)] }] }] } };
  const at = (d, h = 9) => new Date(2026, 8, d, h).toISOString();
  const entries = [
    { pid: 'p', day: 1, time: at(27) }, // Sunday: in
    { pid: 'p', day: 2, time: at(30) }, // Wednesday: in
    { pid: 'p', day: 1, time: at(26, 23) }, // Saturday before: out
    { pid: 'gone', day: 1, time: at(28) }, // a program this app doesn't have: skipped
    { pid: 'p', day: 61, time: at(28) }, // a day the program doesn't have: skipped
  ];
  const s = summarize(entries, { dayOf: lookup(programs), EX, from: new Date(2026, 8, 27), to: new Date(2026, 9, 4) });
  assert.deepEqual(s, { workouts: 2, workoutMin: 50, stretchMin: 3, sets: 5, reps: 46, muscles: { chest: 3, triceps: 3, front_delts: 1.5, lats: 2, biceps: 1 } });
  assert.deepEqual(summarize([], { dayOf: lookup(programs), EX, from: new Date(0), to: new Date() }), { workouts: 0, workoutMin: 0, stretchMin: 0, sets: 0, reps: 0, muscles: {} });
});

// ---------- spans and per-week rows ----------
const { spanRange, weekly } = require('../app/stats.js');
const wed = new Date(2026, 8, 30, 12); // Wednesday 30 Sep 2026
const e = (d, pid = 'p', day = 1) => ({ pid, day, time: new Date(2026, 8, d, 9).toISOString() });

test('spans: this week, the last 4 weeks (this one included) and all time from the first week with a workout', () => {
  assert.deepEqual(spanRange('week', wed, []), { from: new Date(2026, 8, 27), to: new Date(2026, 9, 4) });
  assert.deepEqual(spanRange('4weeks', wed, []), { from: new Date(2026, 8, 6), to: new Date(2026, 9, 4) });
  assert.deepEqual(spanRange('all', wed, [e(29), e(10), e(15)]), { from: new Date(2026, 8, 6), to: new Date(2026, 9, 4) });
  assert.deepEqual(spanRange('all', wed, []), { from: new Date(2026, 8, 27), to: new Date(2026, 9, 4) }, 'nothing done: just this week');
  assert.throws(() => spanRange('decade', wed, []), /Unknown span decade/);
});

test('weekly rows: one per week in the range, newest first, empty weeks included', () => {
  const programs = { p: { days: [day([{ sets: 3, items: [it('push', 10)] }])] } };
  const rows = weekly([e(29), e(28), e(10)], { dayOf: lookup(programs), EX, from: new Date(2026, 8, 6), to: new Date(2026, 9, 4) });
  assert.deepEqual(rows.map((r) => [r.start.getDate(), r.workouts, r.sets]), [[27, 2, 6], [20, 0, 0], [13, 0, 0], [6, 1, 3]]);
});

test('muscles ranked by load, with names and each one\'s share of the biggest', () => {
  const { rankMuscles } = require('../app/stats.js');
  const names = { chest: 'Chest', abs: 'Abs', biceps: 'Biceps', calves: 'Calves' };
  assert.deepEqual(rankMuscles({ abs: 10, chest: 40, biceps: 5, calves: 0 }, names), [
    { muscle: 'chest', name: 'Chest', load: 40, share: 1 },
    { muscle: 'abs', name: 'Abs', load: 10, share: 0.25 },
    { muscle: 'biceps', name: 'Biceps', load: 5, share: 0.125 },
  ]);
  assert.deepEqual(rankMuscles({}, names), []);
});

// ---------- one report for the Stats page and the finish card ----------
const { report, rankMuscles: rank } = require('../app/stats.js');

test('report: scope and span in, totals, weeks and ranked muscles out', () => {
  const programs = { p: { days: [day([{ sets: 3, items: [it('push', 10)] }])] }, q: { days: [day([{ sets: 2, items: [it('row', 8)] }])] } };
  const dayOf = lookup(programs), names = { chest: 'Chest', triceps: 'Triceps', front_delts: 'Front shoulders', lats: 'Lats', biceps: 'Biceps' };
  const entries = [e(29), e(28, 'q'), e(10)], input = { entries, dayOf, EX, names };

  const week = report(input, { scope: 'all', span: 'week', now: wed });
  assert.deepEqual([week.from, week.to], [new Date(2026, 8, 27), new Date(2026, 9, 4)]);
  assert.equal(week.totals.workouts, 2);
  assert.equal(week.weeks, null, 'no weekly rows for a single week');
  assert.deepEqual(week.muscles, rank(week.totals.muscles, names));

  const all = report(input, { scope: 'all', span: 'all', now: wed });
  assert.equal(all.totals.workouts, 3);
  assert.equal(all.weeks.length, 4);

  const justP = report(input, { scope: 'p', span: 'all', now: wed });
  assert.equal(justP.totals.workouts, 2);
  assert.deepEqual(justP.muscles.map((m) => m.muscle), ['chest', 'triceps', 'front_delts']);
  assert.equal(justP.hasHistory, true);
  assert.equal(report({ ...input, entries: [] }, { scope: 'all', span: '4weeks', now: wed }).hasHistory, false);
});

test('the page asks for stats in one call per view', () => {
  const src = require('../build.js').PAGES.map((f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8')).join('\n');
  assert.doesNotMatch(src, /KBStats\.(summarize|spanRange|weekly|rankMuscles|weekStart)/);
});

test('rounds: summarize resolves each entry in its own round; report can narrow to one round', () => {
  const seen = [];
  const dayOf = (pid, n, round) => { seen.push(round); return day([{ sets: 1, items: [it('push', 10)] }]); };
  const entries = [{ ...e(29), round: 1 }, { ...e(30), round: 2 }, { ...e(28, 'q'), round: 1 }];
  const r = report({ entries, dayOf, EX, names: {} }, { scope: 'p', round: 2, span: 'all', now: wed });
  assert.equal(r.totals.workouts, 1);
  assert.deepEqual([...new Set(seen)], [2], 'totals, weekly rows and the time breakdown all ask for round 2 only');
  assert.equal(report({ entries, dayOf, EX, names: {} }, { scope: 'p', span: 'all', now: wed }).totals.workouts, 2, 'all rounds by default');
});

test('a guided flow: each pose is a set per pass; holds add no reps, poses in reps do (both sides)', () => {
  const v = dayVolume(day([{ format: 'flow', repeat: 2, items: [it('plank', 40), it('lunge', 6)] }]), EX);
  assert.equal(v.sets, 4);
  assert.equal(v.reps, 2 * 6 * 2);
  assert.equal(v.muscles.abs, 2);
});

test('bouts: each bout is one set of its combo, no reps', () => {
  const v = dayVolume(day([{ format: 'bouts', rest: 60, items: [it('plank', 180), it('plank', 180), it('push', 180)] }]), EX);
  assert.equal(v.sets, 3);
  assert.equal(v.reps, 0);
  assert.equal(v.muscles.abs, 2);
});

test('scoped: every program, one program, one round of one program (a round is ignored for all programs)', () => {
  const { scoped } = require('../app/stats.js');
  const es = [{ pid: 'p', round: 1 }, { pid: 'p', round: 2 }, { pid: 'q', round: 1 }];
  assert.equal(scoped(es, 'all').length, 3);
  assert.equal(scoped(es, 'all', 2).length, 3);
  assert.deepEqual(scoped(es, 'p').map((e) => e.round), [1, 2]);
  assert.deepEqual(scoped(es, 'p', 2), [{ pid: 'p', round: 2 }]);
});
