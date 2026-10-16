// Phase 35 ticket 1a (decision 349): name Mali once in each couple exercise's cue and name, at the first she/her,
// the rest left as she/her. "her" before a noun is possessive (Mali's hips), else it is her (hold Mali). Run once:
// `node scripts/name-mali.js` rewrites exercises.js in place; a cue or name already naming Mali is left alone.
// Ticket 1b (350): `node scripts/name-mali.js programs` does the same to couple programs' blurbs and abouts in configs/.
const fs = require('fs');
const path = require('path');

// Words after "her" that make it the object or subject, not a possessive ("her on her back", "watch her kneel").
const NOT_OWNED = new Set(('on onto to into in at by from with against over under up down out off across round around ' +
  'standing bent lying prone leaning facing kneeling kneel sitting astride and or a an the one both while as so slowly slow hard ' +
  'deep close closer tight right left still again first now there here forward forwards whole open wide come than ' +
  'until when if is through before for after where your harder deeper pulled lifted hauled during laughing unhurried ' +
  'mid aloft suspended impaled raised almost fast no take wait long start two lengthens hold').split(/\s+/).filter(Boolean));
// Adjectives: hers before a noun (her wet pussy), else her (get her wet., carry her half dressed).
const ADJ = new Set('wet bare slick naked dressed clothed half closed'.split(' '));

function nameMali(text) {
  if (/\bMali\b/.test(text)) return text;
  const m = text.match(/\b(she|hers|her)\b/i);
  if (!m) return text;
  const after = text.slice(m.index + m[0].length);
  let mali = m[0].toLowerCase() === 'hers' ? "Mali's" : 'Mali';
  if (m[0].toLowerCase() === 'her') {
    const next = after.match(/^ ([A-Za-z-]+)( ([A-Za-z-]+))?/);
    const word = next && next[1].toLowerCase(), then = next && next[3] && next[3].toLowerCase();
    if (next && !NOT_OWNED.has(word) && !(ADJ.has(word) && (!then || NOT_OWNED.has(then) || ADJ.has(then)))) mali = "Mali's";
  }
  return text.slice(0, m.index) + mali + after;
}

const literal = (s, q) => q + s.replace(/\\/g, '\\\\').split(q).join('\\' + q) + q;

function rewrite(src, EX) {
  let out = src;
  for (const e of Object.values(EX)) {
    if (e.cat !== 'couple') continue;
    for (const field of ['name', 'cue']) {
      const next = nameMali(e[field]);
      if (next === e[field]) continue;
      const q = [`'`, `"`].find((c) => out.includes(`${field}: ${literal(e[field], c)}`));
      if (!q && [`'`, `"`].some((c) => out.includes(`${field}: ${literal(next, c)}`))) continue; // a shared text, done
      if (!q) throw new Error(`name-mali: ${e.id}.${field} not found in exercises.js`);
      const was = `${field}: ${literal(e[field], q)}`;
      out = out.split(was).join(`${field}: ${literal(next, q)}`); // a text two exercises share gets the same change
    }
  }
  return out;
}

// Each text, as a literal anywhere in src, gets Mali (the program texts sit in fields and in tour() arguments).
function rewriteTexts(src, texts) {
  let out = src;
  for (const t of texts) {
    const next = nameMali(t);
    if (next === t) continue;
    const q = [`'`, '"'].find((c) => out.includes(literal(t, c)));
    if (q) out = out.split(literal(t, q)).join(literal(next, q));
  }
  return out;
}

if (require.main === module) {
  const root = path.join(__dirname, '..');
  if (process.argv[2] === 'programs') {
    const texts = require(path.join(root, 'programs.config.js')).filter((c) => c.couple).flatMap((c) => [c.blurb, c.about]);
    fs.readdirSync(path.join(root, 'configs')).forEach((f) => {
      const file = path.join(root, 'configs', f);
      const src = fs.readFileSync(file, 'utf8'), out = rewriteTexts(src, texts);
      if (out !== src) fs.writeFileSync(file, out);
    });
  } else {
    const file = path.join(root, 'exercises.js');
    fs.writeFileSync(file, rewrite(fs.readFileSync(file, 'utf8'), require(file).EX));
  }
}

module.exports = { nameMali, rewrite, rewriteTexts };
