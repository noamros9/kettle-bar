// Phase 32 ticket 1: an exercise, a day, a program and a random workout in words, and a program as a calendar file.
const test = require('node:test');
const assert = require('node:assert/strict');
const { EX } = require('../exercises.js');
const X = require('../app/export.js');

const PROGRAM = {
  id: 'made-up', name: 'Made up', subject: 'Strength', about: 'A test program, for the words.',
  levels: ['Level I · Intermediate', 'Level II · Strong', 'Level III · Peak'],
  dayTypes: { up: { label: 'Full body · upper focus' } }, rests: { set: 45 },
  days: [],
};
const day = (n, level, blocks, more = {}) => ({ day: n, name: `Day name ${n}`, type: 'up', title: 'Upper', level, est: 34, blocks, ...more });
const straight = (items, sets = 3) => ({ title: 'Upper push', kind: 'main', sets, items });
const abs = { title: 'Abs', kind: 'abs', sets: 2, items: [{ ex: 'plank', n: 60 }] };
const WARM = { title: 'Warm-up', seconds: 90, items: [{ ex: 'arm_circles', n: 30 }] };
const COOL = { title: 'Cool-down', seconds: 125, items: [{ ex: 'cross_body_shoulder', n: 30 }] };
const D1 = day(1, 1, [straight([{ ex: 'pushup', n: 15 }, { ex: 'one_arm_row', n: 10, sets: 4, note: 'Go one weight up' }]), abs], { warmup: WARM, cooldown: COOL, stretchMin: 4 });
const D2 = day(2, 2, [{ title: 'Burn', kind: 'main', format: 'circuit', rounds: 4, items: [{ ex: 'kb_swing', n: 12 }] }]);
const D3 = day(3, 3, [{ title: 'Finisher', kind: 'main', format: 'emom', minutes: 10, items: [{ ex: 'one_arm_row', n: 8 }, { ex: 'side_plank', n: 20 }] }]);
PROGRAM.days = [D1, D2, D3];

test('an exercise: its name, the dose at each level and the equipment, as its page says them', () => {
  assert.equal(X.exerciseText(EX.pushup), 'Push-ups\nReps: 15 / 18 / 20 reps (Level I / II / III)\nEquipment: Bodyweight, mat'.replace('Push-ups', EX.pushup.name));
  assert.equal(X.exerciseDose(EX.plank), '50 / 60 / 70 s (Level I / II / III)');
  assert.equal(X.exerciseDose(EX.side_plank), `${EX.side_plank.r.join(' / ')} s each side (Level I / II / III)`);
  assert.equal(X.exerciseDose(EX.arm_circles), '30 s');
  assert.equal(X.exerciseDose(EX.cross_body_shoulder), `${EX.cross_body_shoulder.r[0]} s each side`);
  assert.match(X.exerciseText(EX.plank), /^Hold: /m);
  assert.match(X.exerciseText(EX.goblet_squat), /Equipment: Kettlebell$/);
  assert.match(X.exerciseText(EX.pullup), /Equipment: Pull-up bar$/);
});

test('a day reads as expected at its own level: header, warm-up, blocks with sets × reps and rests, cool-down', () => {
  const t = X.dayText(D1, PROGRAM, EX);
  assert.equal(t.split('\n')[0], 'Day 1 · Day name 1');
  assert.equal(t.split('\n')[1], 'Full body · upper focus · Level I · Intermediate · ~34 min + 4 min stretching');
  assert.match(t, /\nWarm-up · 1:30\n- .+ · 30 seconds\n/);
  assert.match(t, /\n1 · Upper push\n3\/4 sets · 45 s between sets · 1 min between exercises\n/);
  assert.match(t, new RegExp(`- ${EX.pushup.name} · 3 × 15 reps\\n`));
  assert.match(t, new RegExp(`- ${EX.one_arm_row.name} · 4 × 10 each side · Go one weight up\\n`));
  assert.match(t, /\nRest 2 min, then abs\n\nAbs · Abs\n/);
  assert.match(t, /\nCool-down · 2:05\n- .+ · 30 sec each side$/);
  assert.doesNotMatch(t, new RegExp(EX.pushup.cue.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'no cues');
  // level II and III days say their own level
  assert.match(X.dayText(D2, PROGRAM, EX), /Level II · Strong · ~34 min$/m);
  assert.match(X.dayText(D3, PROGRAM, EX), /Level III · Peak/);
});

test('every format says its block and its items the way the day page counts them', () => {
  const blocks = {
    superset: { format: 'superset', sets: 3, items: [{ ex: 'pushup', n: 12 }, { ex: 'one_arm_row', n: 10 }] },
    circuit: { format: 'circuit', rounds: 4, items: [{ ex: 'kb_swing', n: 12 }] },
    emom: { format: 'emom', minutes: 10, items: [{ ex: 'one_arm_row', n: 8 }, { ex: 'side_plank', n: 20 }, { ex: 'pushup', n: 8 }] },
    amrap: { format: 'amrap', minutes: 8, items: [{ ex: 'plank', n: 20 }, { ex: 'pushup', n: 8 }] },
    tabata: { format: 'tabata', tabatas: 2, items: [{ ex: 'pushup', n: 20 }] },
    flow: { format: 'flow', repeat: 2, items: [{ ex: 'plank', n: 30 }] },
    flow1: { format: 'flow', repeat: 1, items: [{ ex: 'plank', n: 30 }] },
    flow3: { format: 'flow', repeat: 3, items: [{ ex: 'plank', n: 30 }] },
    bouts: { format: 'bouts', rest: 60, items: [{ ex: 'pushup', n: 180 }] },
    bouts0: { format: 'bouts', items: [{ ex: 'pushup', n: 180 }] },
    ladder: { format: 'ladder', minutes: 8, items: [{ ex: 'pushup', n: 1 }, { ex: 'one_arm_row', n: 1 }] },
  };
  const lines = Object.fromEntries(Object.entries(blocks).map(([k, b]) => [k, X.dayText(day(5, 1, [{ title: 'B', kind: 'main', ...b }]), { name: 'P', days: [] }, EX).split('\n').slice(3)]));
  assert.deepEqual(lines.superset, ['1 · B · Supersets', 'Pairs back to back · 3 rounds per pair · 45 s rest · 1 min between pairs', `- ${EX.pushup.name} · 12 reps`, `- ${EX.one_arm_row.name} · 10 each side`]);
  assert.deepEqual(lines.circuit.slice(1), ['One after another · 4 rounds · 1 min rest between rounds', `- ${EX.kb_swing.name} · 12 reps`]);
  assert.deepEqual(lines.emom.slice(2), [`- ${EX.one_arm_row.name} · 8 reps per minute, each side`, `- ${EX.side_plank.name} · 20 sec per minute`, `- ${EX.pushup.name} · 8 reps per minute`]);
  assert.deepEqual(lines.amrap.slice(1), ['As many rounds as possible in 8 min', `- ${EX.plank.name} · 20 sec per round`, `- ${EX.pushup.name} · 8 reps per round`]);
  assert.deepEqual(lines.tabata.slice(1), ['2 × 4 min: 20 s hard, 10 s rest, 8 rounds · 1 min between Tabatas', `- ${EX.pushup.name} · 20 sec hard, 10 sec rest`]);
  assert.equal(lines.flow[1], '1 poses, twice through');
  assert.equal(lines.flow1[1], '1 poses');
  assert.equal(lines.flow3[1], '1 poses, three times through');
  assert.deepEqual(lines.bouts.slice(1), ['1 bouts, 1 min rest between', `- ${EX.pushup.name} · 3 min bout`]);
  assert.equal(lines.bouts0[1], '1 bouts, 1 min rest between');
  assert.deepEqual(lines.ladder.slice(2), [`- ${EX.pushup.name} · 1→ reps, +1 each rung`, `- ${EX.one_arm_row.name} · 1→ reps each side, +1 each rung`]);
  assert.deepEqual(X.doseParts({ ex: 'pushup', n: 9 }, undefined, EX), { n: 9, unit: 'reps' });
});

test('a program has its name and about, then every day', () => {
  const t = X.programText(PROGRAM, EX);
  assert.ok(t.startsWith('Made up\nStrength · 3 days\n\nA test program, for the words.\n\n\nDay 1 · Day name 1\n'));
  for (const d of PROGRAM.days) assert.ok(t.includes(`Day ${d.day} · ${d.name}`));
  assert.ok(X.programText({ ...PROGRAM, about: undefined, blurb: undefined, subject: undefined }, EX).startsWith('Made up\n3 days\n\n\nDay 1'));
  assert.ok(X.programText({ ...PROGRAM, about: undefined, blurb: 'Short.' }, EX).includes('\n\nShort.\n'));
});

test('a random workout reads like a day, named for what it is', () => {
  const made = { subject: 'Kettlebell', day: D2, program: { id: 'random', levels: PROGRAM.levels, dayTypes: {}, days: [D2] } };
  const t = X.randomText(made, EX);
  assert.equal(t.split('\n')[0], 'Random workout · Kettlebell');
  assert.equal(t.split('\n')[1], 'Upper · Level II · Strong · ~34 min');
});

test('an After dark day\'s text is as explicit as its page: every exercise by its own name', () => {
  const ids = ['toy_ring_back', 'body_ass_cheek'];
  const d = day(1, 1, [{ title: 'Her', kind: 'main', format: 'flow', repeat: 1, items: ids.map((ex) => ({ ex, n: 60 })) }]);
  const t = X.dayText(d, { name: 'Late', levels: PROGRAM.levels, days: [d] }, EX);
  for (const id of ids) assert.ok(t.includes(`- ${EX[id].name} · 60 seconds`), EX[id].name);
});

const NOW = new Date(Date.UTC(2026, 9, 14, 5, 6, 7));
test('the calendar: Sun/Tue/Thu from a Monday start puts day 1 on Tuesday and skips days already done', () => {
  const out = X.ics(PROGRAM, { start: '2026-10-12', weekdays: [0, 2, 4], now: NOW }, EX);
  const ev = X.parseIcs(out);
  assert.deepEqual(ev.map((e) => e.start), ['20261013', '20261015', '20261018']);
  assert.deepEqual(ev.map((e) => e.end), ['20261014', '20261016', '20261019']);
  assert.equal(ev[0].uid, 'made-up-d1-2026-10-12@kettle-bar');
  assert.equal(ev[0].summary, 'Kettle & Bar · Made up · Day 1 · Full body · upper focus');
  assert.equal(ev[0].description, X.dayText(D1, PROGRAM, EX));
  assert.match(out, /\r\nDTSTAMP:20261014T050607Z\r\n/);
  assert.match(out, /\r\nDTSTART;VALUE=DATE:20261013\r\n/);
  const skipped = X.parseIcs(X.ics(PROGRAM, { start: '2026-10-12', weekdays: [0, 2, 4], done: [1], now: NOW }, EX));
  assert.deepEqual(skipped.map((e) => [e.uid.split('-')[2], e.start]), [['d2', '20261013'], ['d3', '20261015']]);
  // the default now, every day done, and no weekday picked
  assert.match(X.ics(PROGRAM, { start: '2026-10-12', weekdays: [1] }, EX), /DTSTAMP:\d{8}T\d{6}Z/);
  assert.deepEqual(X.parseIcs(X.ics(PROGRAM, { start: '2026-10-12', weekdays: [], done: [1, 2, 3] }, EX)), []);
  assert.throws(() => X.ics(PROGRAM, { start: '2026-10-12', weekdays: [] }, EX), /Pick at least one weekday/);
});

test('folding, escaping and CRLF match RFC 5545', () => {
  const out = X.ics({ ...PROGRAM, days: [D1] }, { start: '2026-10-12', weekdays: [1], now: NOW }, EX);
  assert.ok(out.endsWith('END:VCALENDAR\r\n'));
  assert.doesNotMatch(out.replace(/\r\n/g, ''), /\n/, 'every line ends in CRLF');
  const octets = (s) => Buffer.byteLength(s, 'utf8');
  for (const line of out.split('\r\n')) assert.ok(octets(line) <= 75, line);
  // a 200-character description folds into lines of at most 75 octets, and unfolds back
  const long = 'x'.repeat(190) + ', a; b\\';
  const folded = X.fold('DESCRIPTION:' + X.escapeText(long));
  assert.ok(folded.split('\r\n').length > 2);
  folded.split('\r\n').forEach((l, i) => { assert.ok(octets(l) <= 75); if (i) assert.equal(l[0], ' '); });
  assert.equal(X.parseIcs(`BEGIN:VEVENT\r\n${folded}\r\nEND:VEVENT\r\n`)[0].description, long);
  assert.equal(X.escapeText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
  // never inside a character: multi-byte letters fold whole
  const wide = X.fold('SUMMARY:' + 'é'.repeat(50) + '€'.repeat(30) + '𝄞'.repeat(10));
  for (const l of wide.split('\r\n')) { assert.ok(octets(l) <= 75); assert.doesNotMatch(l, /�/); }
  assert.equal(wide.replace(/\r\n /g, ''), 'SUMMARY:' + 'é'.repeat(50) + '€'.repeat(30) + '𝄞'.repeat(10));
  // a line with no known name is ignored; a DESCRIPTION with an escaped capital N is a newline too
  assert.deepEqual(X.parseIcs('BEGIN:VEVENT\r\nLOCATION:home\r\nDESCRIPTION:a\\Nb\r\nEND:VEVENT\r\n'), [{ description: 'a\nb' }]);
});

test('between two main blocks: the block rest', () => {
  const d = day(4, 1, [straight([{ ex: 'pushup', n: 15 }]), { ...straight([{ ex: 'kb_swing', n: 15 }]), title: 'Swing' }]);
  assert.match(X.dayText(d, PROGRAM, EX), /\nRest 1 min\n\n2 · Swing\n/);
});
