// Phase 35 ticket 1d (decision 359): couple cues and exercise names are read to him, so he is "you". Run once:
// `node scripts/his-pov.js` rewrites exercises.js in place: he → you (with the verb after it: he kneels → you kneel),
// him → you, his → your (yours at the end of a phrase), himself → yourself, he's → you're. Claude reviews the result
// and fixes what a script can't tell apart; tests/his-pov.test.js keeps every couple cue and name this way.
const fs = require('fs');
const path = require('path');

const IRREGULAR = { is: 'are', has: 'have', does: 'do', goes: 'go', was: 'were', lies: 'lie', ties: 'tie', dies: 'die', "isn't": "aren't", "doesn't": "don't", "hasn't": "haven't", "wasn't": "weren't" };
// "he kneels" → "kneel": the verb after he, or after he and one adverb ("he slowly pushes")
function agree(verb) {
  const v = verb.toLowerCase();
  if (IRREGULAR[v]) return IRREGULAR[v];
  if (!/[a-z]s$/.test(v) || /ss$/.test(v)) return verb;
  if (/[^aeiou]ies$/.test(v)) return verb.slice(0, -3) + 'y';
  if (/(ch|sh|ss|x|z|o)es$/.test(v)) return verb.slice(0, -2);
  return verb.slice(0, -1);
}
const cap = (w, like) => (/^[A-Z]/.test(like) ? w[0].toUpperCase() + w.slice(1) : w);

// Verbs he takes in the catalogue ("he fucks", "he kneels"): in a clause that began with he, the same verbs after "and"
// or a comma agree too ("you brace on your hands and fuck her"); nouns like "fingers" elsewhere are left alone.
let VERBS = new Set();
const verbsOf = (texts) => new Set(texts.flatMap((t) => [...t.matchAll(/\bhe (?:\w+ly )?([a-z]+s)\b/gi)].map((m) => m[1].toLowerCase())));
const agreeAfterAnd = (clause) => clause.replace(/(\band |, )((?:\w+ly )?)([a-z]+s)\b/g, (m, j, adv, w) => (VERBS.has(w) ? `${j}${adv}${agree(w)}` : m));

function pronouns(text) {
  return text
    .replace(/\b(he)'s\b/gi, (m, h) => cap("you're", h))
    .replace(/\b(he) ((?:\w+ly )?)([a-z']+)/gi, (m, h, adv, verb) => `${cap('you', h)} ${adv}${agree(verb)}`)
    .replace(/\bhe\b/gi, (m) => cap('you', m))
    .replace(/\bhimself\b/gi, (m) => cap('yourself', m))
    .replace(/\bhim\b/gi, (m) => cap('you', m))
    .replace(/\bhis(?=[.,;:!?)]|$)/gi, (m) => cap('yours', m))
    .replace(/\bhis\b/gi, (m) => cap('your', m));
}
function toYou(text) {
  return text.split(/(?<=[.;:!?])/).map((c) => (/^\s*he\b/i.test(c) ? agreeAfterAnd(pronouns(c)) : pronouns(c))).join('');
}

const literal = (s, q) => q + s.replace(/\\/g, '\\\\').split(q).join('\\' + q) + q;

function rewrite(src, EX) {
  VERBS = new Set([...verbsOf(Object.values(EX).filter((e) => e.cat === 'couple').map((e) => e.cue)), 'meets', 'works', 'lets', 'stays', 'lowers', 'keeps', 'sits', 'braces', 'helps']);
  let out = src;
  for (const e of Object.values(EX)) {
    if (e.cat !== 'couple' || e.trio === 'MMF') continue; // an MMF cue's he/his may be the other man
    for (const field of ['name', 'cue']) {
      const next = toYou(e[field]);
      if (next === e[field]) continue;
      const q = [`'`, `"`].find((c) => out.includes(`${field}: ${literal(e[field], c)}`));
      if (!q && [`'`, `"`].some((c) => out.includes(`${field}: ${literal(next, c)}`))) continue; // a shared text, done
      if (!q) throw new Error(`his-pov: ${e.id}.${field} not found in exercises.js`);
      out = out.split(`${field}: ${literal(e[field], q)}`).join(`${field}: ${literal(next, q)}`);
    }
  }
  return out;
}

if (require.main === module) {
  const file = path.join(__dirname, '..', 'exercises.js');
  fs.writeFileSync(file, rewrite(fs.readFileSync(file, 'utf8'), require(file).EX));
}

module.exports = { toYou, agree, rewrite };
