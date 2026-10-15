#!/usr/bin/env node
// `npm run long-list -- <backup.json>` (Phase 26 ticket 2): which programs get longer. Per re-timed subject, about half
// end at 35–38 min and a quarter at 31–35, counting what's already there (53, 155), by each program's average day (342). Only
// programs nobody has started (the backup: a fresh export from Settings, or a nightly file), not frozen and not Phase
// 23's move (153, 84); movers spread over each subject's splits and formats first, then the smaller change (156).
// Prints configs/long.js's map, grouped by family, and the counts per subject for the plan's "The list".
const LONG = [35, 38], MID = [31, 35];
const KEPT = ['Busy week', 'Quickie', 'Date night warm-up']; // 154: kept at their length, with every After dark subject

const midOf = ([lo, hi]) => (lo + hi) / 2;
const bucket = (t) => (t > 35 ? 'long' : t > 30.5 ? 'mid' : 'short'); // Up to 30 / 31–35 / 35+, as the length filter
const bucketOf = (m) => bucket(midOf(m)); // a band's bucket

// the ids with any day done, in the current round or a past one, in any account of the file
function startedIn(file) {
  const out = new Set();
  (file.users ? Object.values(file.users) : [file]).forEach((u) => {
    Object.entries(u.programs || {}).forEach(([id, days]) => { if (Object.keys(days).length) out.add(id); });
    Object.entries(u.rounds || {}).forEach(([id, past]) => { if (past.length) out.add(id); });
  });
  return out;
}

const kindOf = (c) => `${c.split} · ${[...new Set(Object.values(c.dayTypes).flatMap((t) => t.blocks.map((b) => b.f)))].sort().join('+')}`;

// n of cands moved to band: a split with fewer picks first, then a kind (split and formats) with fewer, then the smaller change
function pick(cands, n, band, avg) {
  const left = [...cands], chosen = [], splits = {}, kinds = {};
  const change = (c) => midOf(band) - avg(c);
  while (chosen.length < n && left.length) {
    left.sort((a, b) => (splits[a.split] || 0) - (splits[b.split] || 0) || (kinds[kindOf(a)] || 0) - (kinds[kindOf(b)] || 0)
      || change(a) - change(b) || (a.id < b.id ? -1 : 1));
    const c = left.shift();
    chosen.push(c);
    splits[c.split] = (splits[c.split] || 0) + 1;
    kinds[kindOf(c)] = (kinds[kindOf(c)] || 0) + 1;
  }
  return chosen;
}

// configs: the library's; started: ids from startedIn; avg(config): its average day in minutes (the middle of its range
// when not given). -> { map: { id: band }, subjects: { subject: counts after } }
function longList(configs, { started, avg = (c) => midOf(c.minutes), afterDark = require('../app/library.js').SHELVES.find(([s]) => s === 'After dark')[1] }) {
  const map = {}, subjects = {};
  const bySubject = new Map();
  configs.filter((c) => !KEPT.includes(c.subject) && !afterDark.includes(c.subject))
    .forEach((c) => bySubject.set(c.subject, [...(bySubject.get(c.subject) || []), c]));
  bySubject.forEach((list, subject) => {
    const movable = (c) => !c.frozen && c.added !== 23 && !started.has(c.id);
    const now = (c) => (map[c.id] ? bucketOf(map[c.id]) : bucket(avg(c)));
    const count = (b) => list.filter((c) => now(c) === b).length;
    const wantLong = Math.ceil(list.length / 2), wantMid = Math.round(list.length / 4);
    pick(list.filter((c) => movable(c) && now(c) !== 'long'), Math.max(0, wantLong - count('long')), LONG, avg).forEach((c) => { map[c.id] = LONG; });
    pick(list.filter((c) => movable(c) && now(c) === 'short'), Math.max(0, wantMid - count('mid')), MID, avg).forEach((c) => { map[c.id] = MID; });
    subjects[subject] = {
      total: list.length, long: count('long'), mid: count('mid'), short: count('short'),
      shortOf: { long: Math.max(0, wantLong - count('long')), mid: Math.max(0, wantMid - count('mid')) },
    };
  });
  return { map, subjects };
}

// the map as configs/long.js lines, one comment per family (familyOf: id -> family file)
function mapText(map, familyOf) {
  const families = [...new Set(Object.keys(map).map((id) => familyOf[id]))];
  return families.map((f) => `  // ${f}\n${Object.keys(map).filter((id) => familyOf[id] === f).map((id) => `  '${id}': [${map[id].join(', ')}],\n`).join('')}`).join('');
}

// the command line: reads the real library and the backup, prints
if (require.main === module) {
  const fs = require('fs');
  if (!process.argv[2]) { console.error('usage: npm run long-list -- <backup.json>'); process.exit(1); }
  const started = startedIn(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));
  const { CONFIGS } = require('../program-builder.js');
  const familyOf = {};
  ['strength', 'cardio-combat', 'mind-body', 'mixed'].forEach((f) => require(`../configs/${f}.js`).forEach((c) => { familyOf[c.id] = f; }));
  // each program's average day, from the library as the build makes it (the build cache keeps it quick when warm)
  const days = new Map(require('../build-cache.js').cachedBuild().programs.map((p) => [p.id, p.days]));
  const out = longList(CONFIGS, { started, avg: (c) => days.get(c.id).reduce((s, d) => s + d.est, 0) / days.get(c.id).length });
  console.log(`started: ${[...started].sort().join(', ')}\n`);
  console.log('| Subject | Programs | 35–38 | 31–35 | Shorter | Short of the spread |\n|---|---|---|---|---|---|');
  Object.entries(out.subjects).forEach(([s, n]) => console.log(`| ${s} | ${n.total} | ${n.long} | ${n.mid} | ${n.short} | ${n.shortOf.long || n.shortOf.mid ? `${n.shortOf.long} long, ${n.shortOf.mid} mid` : '–'} |`));
  console.log(`\n${Object.keys(out.map).length} move:\n${mapText(out.map, familyOf)}`);
}

module.exports = { longList, startedIn, bucketOf, mapText, LONG, MID };
