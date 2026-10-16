// Phase 35 ticket 1a (decision 349): name Mali once in each couple exercise's cue and name, at the first she/her,
// the rest left as she/her. "her" before a noun is possessive (Mali's hips), else it is her (hold Mali). Run once:
// `node scripts/name-mali.js` rewrites exercises.js in place; a cue or name already naming Mali is left alone.
const fs = require('fs');
const path = require('path');

// Words after "her" that make it the object or subject, not a possessive ("her on her back", "watch her kneel").
const NOT_OWNED = new Set(('on onto to into in at by from with against over under up down out off across round around ' +
  'standing bent lying prone leaning facing kneeling kneel sitting astride and or a an the one both while as so slowly slow hard ' +
  'deep close closer tight right left still again first now there here forward forwards whole open wide come than ' +
  'until when if is').split(/\s+/).filter(Boolean));

function nameMali(text) {
  if (/\bMali\b/.test(text)) return text;
  const m = text.match(/\b(she|her)\b/i);
  if (!m) return text;
  const after = text.slice(m.index + m[0].length);
  let mali = 'Mali';
  if (m[0].toLowerCase() === 'her') {
    const next = after.match(/^ ([A-Za-z-]+)/);
    if (next && !NOT_OWNED.has(next[1].toLowerCase())) mali = "Mali's";
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

if (require.main === module) {
  const file = path.join(__dirname, '..', 'exercises.js');
  const { EX } = require(file);
  fs.writeFileSync(file, rewrite(fs.readFileSync(file, 'utf8'), EX));
}

module.exports = { nameMali, rewrite };
