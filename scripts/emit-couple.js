// Turns a Grok text-only plan (decision 339) into after-dark.js program configs.
// Usage: node scripts/emit-couple.js <plan.md> [<text.md>] > snippet. Plan lines: `N. id | name | subject | kind | minutes |
// days | pools | blurb | day names | split`; abouts are `id: about` lines under the plan's "## 2. Abouts" or in the text file.
const fs = require('fs');
const [planPath, textPath] = process.argv.slice(2);
const text = fs.readFileSync(planPath, 'utf8');
const lines = text.split(/\n/).filter((l) => /^\d+\. /.test(l));
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

const aboutLines = (text.split('## 2. Abouts')[1] || '').split(/\n## /)[0] + '\n' + (textPath ? fs.readFileSync(textPath, 'utf8') : '');
const ABOUTS = {};
aboutLines.split(/\n/).forEach((l) => {
  const m = l.match(/^`?([a-z0-9-]+)`?: (.+)$/);
  if (m) ABOUTS[m[1]] = m[2].trim();
});
const DAYS = {
  'circuit/strength': `cycle: ['circuit', 'strength'],
    dayTypes: {
      circuit: gymThenSex('Circuit, then fuck', 'Circuit', C('Partner circuit', GYM_WORK, { ...LIFT, values: [3, 4, 5, 6] }), HOME_GYM, { pref: 2 }),
      strength: gymThenSex('Strength, then fuck', 'Strength', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), HOME_GYM_B, { pref: 2 }),
    }`,
  'strength/circuit': `cycle: ['strength', 'circuit'],
    dayTypes: {
      strength: gymThenSex('Strength, then fuck', 'Strength', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), HOME_GYM, { pref: 2 }),
      circuit: gymThenSex('Circuit, then fuck', 'Circuit', C('Partner circuit', GYM_WORK, { ...LIFT, values: [3, 4, 5, 6] }), HOME_GYM_B, { pref: 2 }),
    }`,
  'kiss/strength': `cycle: ['kiss', 'strength'],
    dayTypes: {
      kiss: gymThenSex('Kiss the reps, then fuck', 'Kiss', C('Kiss circuit', GYM_KISS, { ...LIFT, values: [3, 4, 5, 6] }), HOME_GYM, { pref: 2 }),
      strength: gymThenSex('Strength, then fuck', 'Strength', S('Partner strength', GYM_STRONG, { ...LIFT, values: [2, 3, 4, 5] }), HOME_GYM_B, { pref: 2 }),
    }`,
  'carry/circuit': `cycle: ['carry', 'circuit'],
    dayTypes: {
      carry: gymThenSex('Lift, then fuck', 'Lift', C('Carries', GYM_LIFT, { ...LIFT, values: [3, 4, 5, 6] }), HOME_GYM, { pref: 2 }),
      circuit: gymThenSex('Circuit, then fuck', 'Circuit', C('Partner circuit', GYM_WORK, { ...LIFT, values: [3, 4, 5, 6] }), HOME_GYM_B, { pref: 2 }),
    }`,
  'mouth/hands': `cycle: ['mouth', 'hands'],
    dayTypes: {
      mouth: sexThenSex('Mouths, then fuck', 'Mouth', SEX_MOUTH, HOME_FUCK, { pref: 2 }, { pref: 2 }),
      hands: sexThenSex('Hands in it, then fuck', 'Hands', SEX_WARM, HOME_FUCK_B, { pref: 2 }, { pref: 2 }),
    }`,
  'tongue/hands': `cycle: ['tongue', 'hands'],
    dayTypes: {
      tongue: sexThenSex('Tongue, then fuck', 'Tongue', SEX_MOUTH, HOME_FUCK, { pref: 2 }, { pref: 2 }),
      hands: sexThenSex('Hands, then fuck', 'Hands', SEX_HANDS, HOME_FUCK_B, { pref: 2 }, { pref: 2 }),
    }`,
  'fingers/mouth': `cycle: ['fingers', 'mouth'],
    dayTypes: {
      fingers: sexThenSex('Fingers, then fuck', 'Fingers', SEX_HANDS, HOME_FUCK, { pref: 2 }, { pref: 2 }),
      mouth: sexThenSex('Mouth and fingers, then fuck', 'Mouth', SEX_MOUTH, HOME_FUCK_B, { pref: 2 }, { pref: 2 }),
    }`,
  'tease/mouth': `cycle: ['tease', 'mouth'],
    dayTypes: {
      tease: sexThenSex('Tease, then fuck', 'Tease', SEX_TEASE, HOME_FUCK, { pref: 2 }, { pref: 2 }),
      mouth: sexThenSex('Mouth, then fuck', 'Mouth', SEX_MOUTH, HOME_FUCK_B, { pref: 2 }, { pref: 2 }),
    }`,
  'flow/again': `cycle: ['flow', 'again'],
    dayTypes: {
      flow: positionsOnly('Stay inside', 'Stay', HOME_ONLY, { pref: 2 }),
      again: positionsOnly('Stay, another mix', 'Again', HOME_ONLY_B, { pref: 2 }),
    }`,
  'hold/longer': `cycle: ['hold', 'longer'],
    dayTypes: {
      hold: positionsOnly('Hold after hold', 'Hold', HOME_ONLY, { pref: 2 }),
      longer: positionsOnly('Longer holds', 'Longer', HOME_ONLY_B, { pref: 2 }),
    }`,
  'deep/deeper': `cycle: ['deep', 'deeper'],
    dayTypes: {
      deep: positionsOnly('Deeper each hold', 'Deep', HOME_ONLY, { pref: 2 }),
      deeper: positionsOnly('Deeper still', 'Deeper', HOME_ONLY_B, { pref: 2 }),
    }`,
};

const SPLIT = {
  gym: 'Partner work, then positions',
  sex: 'Warm-up, then fucking',
  positions: 'One positions flow',
};
const LEVER = {
  gym: "[null, 'reps', 'holds']",
  sex: "[null, 'holds', 'holds']",
  positions: "[null, 'holds', 'holds']",
};

const chunks = [];
lines.forEach((line) => {
  const parts = line.replace(/^\d+\. /, '').split(' | ');
  const [id, name, subject, shape, , cycle] = parts;
  const blurb = parts[7];
  const names = parts[8].split(', ');
  if (!ABOUTS[id]) throw new Error('no about ' + id);
  const minutes = /^\[\d+, \d+\]$/.test(parts[4]) ? parts[4] : '[31, 40]';
  if (!DAYS[cycle]) throw new Error('no days ' + cycle + ' for ' + id);
  if (names.length !== 20) throw new Error(id + ' names ' + names.length);
  chunks.push(`  {
    id: ${q(id)}, ...C13, name: ${q(name)}, subject: ${q(subject)}, minutes: ${minutes}, levers: ${LEVER[shape]},
    split: ${q(parts[9] || SPLIT[shape])}, blurb: ${q(blurb)},
    about: ${q(ABOUTS[id])},
    names: [${names.map(q).join(', ')}],
    ${DAYS[cycle]},
  }`);
});
process.stdout.write(chunks.join(',\n') + ',\n');
