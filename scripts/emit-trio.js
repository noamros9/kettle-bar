// Turns a Grok text file (decision 368) into rows for exercises.js's TRIOS. Usage: node scripts/emit-trio.js <text.md> <places.json> [sub]
// Lines: `N. id | name | FMF|MMF | [us|other |] base id | pose@place | cue` (pose@place is Grok's hint; pair from 2d on,
// 383: 'other' is a seventh row field); places.json gives each id its
// hand-placed third figure, 'pose x y flip'. A sub (the Threesome kind, 390) is the row's eighth field, after the pair
// (null for us): the exercise keeps its base's drawing under its own sub. Prints the rows; stops on any line it can't use.
const fs = require('fs');
const { EX } = require('../exercises.js');
const { nameMali } = require('./name-mali.js'); // a name's first her is Mali (349): Grok writes "Spank her in doggy"
const PLACED = /^(stand|kneel|lean|straddle|sit|fours|squat|lie|prone) -?\d+ -?\d+ [01]$/;
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

function rows(text, places, sub) {
  const seen = new Set(), bad = [];
  const out = text.split(/\r?\n/).filter((l) => /^\d+\. /.test(l)).map((l) => {
    const f = l.replace(/^\d+\. /, '').split(' | ').map((s) => s.trim());
    const [id, name, trio, pair, base, , cue] = f.length === 7 ? f : [...f.slice(0, 3), 'us', ...f.slice(3)];
    const how = places[id];
    const other = trio === 'FMF' ? '{man}' : '{woman}';
    [[!/^[a-z0-9_]+$/.test(id) || seen.has(id) || EX[id], 'id taken or bad'], [!['FMF', 'MMF'].includes(trio), 'trio'],
      [!EX[base] || EX[base].cat !== 'couple' || EX[base].trio, 'base'], [!PLACED.test(how), 'third'], [!['us', 'other'].includes(pair), 'pair'],
      [!cue || cue.includes(other) || !cue.includes(trio === 'FMF' ? '{woman}' : '{man}'), 'placeholder']]
      .forEach(([fail, what]) => fail && bad.push(`${id}: ${what}`));
    seen.add(id);
    const tail = sub ? [pair === 'other' ? q(pair) : 'null', q(sub)] : pair === 'other' ? [q(pair)] : [];
    return `    [${[...[id, nameMali(name), trio, base, how, cue].map(q), ...tail].join(', ')}],`;
  });
  if (bad.length) throw new Error(bad.join('\n'));
  return out.join('\n');
}

if (require.main === module) console.log(rows(fs.readFileSync(process.argv[2], 'utf8'), JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), process.argv[4]));
module.exports = { rows };
