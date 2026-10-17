// Phase 35 ticket 3g1 (decisions 413, 419–426): deals every guest's fields to the quotas and writes app/guests.js.
// Seeded, so a rerun writes the same file; hook and text already written there are kept. Run: node scripts/deal-guests.js
// [text files…]: each line `N. Name | hook | text` (a woman) or `N. Name | text` (a man) sets that guest's words (3g3-3g6).
const fs = require('fs');
const path = require('path');
const { WOMEN, MEN, ORIGINS } = require('../app/third-names.js');

let seed = 3101;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = (l) => { const a = [...l]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// a deck of the options repeated to n, shuffled: every option within one of the others
const deck = (opts, n) => shuffle(Array.from({ length: n }, (_, i) => opts[i % opts.length]));
// the least used of the allowed options, ties at random: even overall while fitting each woman
const least = (count, allowed) => { const m = Math.min(...allowed.map((o) => count[o] || 0)); const o = shuffle(allowed.filter((x) => (count[x] || 0) === m))[0]; count[o] = (count[o] || 0) + 1; return o; };
const from = (kind) => Object.fromEntries(Object.entries(ORIGINS[kind]).flatMap(([k, l]) => l.map((n) => [n, k])));

// her look follows her name (413, 420, 421): per origin the tones, colours and eyes dealt in turn, so each spreads
const LOOK = {
  il: { skin: ['olive', 'tan', 'fair', 'olive', 'brown', 'tan', 'dark'], hair: ['black', 'dark brown', 'brown', 'black', 'light brown', 'dark brown', 'auburn', 'blonde (dyed)'], eyes: ['brown', 'dark brown', 'hazel', 'green', 'brown', 'blue'] },
  us: { skin: ['fair', 'tan', 'brown', 'fair', 'dark'], hair: ['blonde', 'brown', 'black', 'red', 'dark brown', 'platinum (dyed)'], eyes: ['blue', 'brown', 'green', 'hazel'] },
  uk: { skin: ['fair', 'fair', 'olive', 'brown', 'dark'], hair: ['blonde', 'brown', 'red', 'dark brown', 'pink (dyed)'], eyes: ['blue', 'green', 'grey', 'brown'] },
};
const WORLD = { // skin, hair, eyes
  Valentina: ['tan', 'dark brown', 'brown'], Isabela: ['brown', 'black', 'dark brown'], Carmen: ['olive', 'black', 'brown'],
  Luna: ['tan', 'brown', 'hazel'], Adriana: ['brown', 'dark brown', 'brown'], Mariana: ['tan', 'black', 'green'],
  Chloe: ['fair', 'light brown', 'blue'], Juliette: ['fair', 'red', 'green'], Amelie: ['fair', 'blonde', 'grey'],
  Bianca: ['olive', 'dark brown', 'brown'], Chiara: ['olive', 'brown', 'hazel'], Francesca: ['tan', 'black', 'brown'],
  Elena: ['olive', 'auburn', 'green'], Natasha: ['fair', 'blonde', 'blue'], Katya: ['fair', 'light brown', 'grey'],
  Mila: ['fair', 'platinum blonde', 'blue'], Ingrid: ['fair', 'blonde', 'blue'], Yasmin: ['brown', 'black', 'dark brown'],
  Aiko: ['East Asian, light', 'black', 'dark brown'], Mei: ['East Asian, light', 'black', 'brown'],
  Bruna: ['tan', 'dark brown', 'brown'], Noemi: ['olive', 'dark brown', 'hazel'], Selin: ['olive', 'black', 'green'],
  Paola: ['tan', 'black', 'brown'], Nala: ['dark', 'black', 'dark brown'],
};
const BODY = ['petite', 'slim', 'athletic', 'curvy', 'thick'];
const HEIGHT = { petite: [150, 158], slim: [160, 176], athletic: [162, 178], curvy: [157, 172], thick: [156, 172] };
const BREASTS = { petite: ['small', 'medium', 'big'], slim: ['small', 'medium', 'big'], athletic: ['small', 'medium', 'big', 'very big'], curvy: ['medium', 'big', 'very big'], thick: ['medium', 'big', 'very big'] };
const ASS = { petite: ['small', 'round'], slim: ['small', 'round'], athletic: ['round', 'big'], curvy: ['round', 'big'], thick: ['big'] };
const LENGTH = ['pixie', 'shoulder', 'long', 'very long'];
const PUSSY = ['shaved', 'landing strip', 'trimmed']; // never natural (423)
const VIBES = ['bold and dominant', 'teasing', 'shy then wild', 'sensual and slow'];
const ACTS = ['fuck', 'oral', 'hands', 'anal', 'toys', 'rough', 'kink', 'body', 'rim', 'edging', 'massage', 'tease'];
const INK = ['a swallow on each hip', 'a word inked inside her thigh', 'a pierced clit hood and a navel stud', 'a sleeve of flowers',
  'a heart on her ass cheek', 'a bar through her tongue and one nipple',
  'a small tattoo low on her hip', 'a script tattoo under her breasts', 'pierced nipples', 'a belly-button ring',
  'a vine tattoo down her thigh', 'a tongue piercing', 'a half-sleeve on one arm', 'a tiny tattoo just above her pussy',
  'a clit-hood piercing', 'a butterfly on her lower back', 'pierced nipples and a thigh tattoo', 'a snake around her ankle',
  'a moon behind her ear', 'a rose on her ribs', 'a septum ring', 'a line of stars down her spine', 'a garter tattoo on her thigh',
  'a dragon across her back', 'a nipple bar and a belly ring', 'roman numerals on her collarbone', 'a lotus at the top of her ass'];
const JOBS = ['a bartender at your local', "Mali's yoga teacher", 'a nurse on night shifts', 'a tattoo artist', 'a lawyer you met at a wedding',
  "Mali's friend from work", 'a personal trainer at your gym', 'a flight attendant', 'a barista who flirts with you both', 'a photographer',
  'a dancer', 'a med student', "your neighbour's daughter, home from abroad", 'a surf instructor', 'a sommelier', 'a real-estate agent',
  "Mali's old roommate", 'a DJ', 'a pastry chef', 'a lifeguard', 'a fashion buyer', 'a dentist', 'a pilates instructor', 'an architect',
  'a hairdresser', 'a vet', 'a startup founder', "Mali's cousin's friend", 'a model', 'a sailing skipper', 'a waitress at the beach bar',
  'a masseuse', 'an artist with a studio downtown', 'a radio host', 'a lingerie shop owner', 'a hotel receptionist', 'a teacher',
  'a pole-dance instructor', 'a climbing coach', 'a translator', 'a florist', 'a journalist', 'a makeup artist', 'a software engineer',
  'a sales rep you met on a flight', 'a wine-bar owner', 'a physio', "Mali's spinning instructor", 'a jazz singer', 'a cocktail waitress',
  'a gallery curator', 'a chef', 'a backpacker you met in Thailand', 'an actress', 'an ER doctor', 'a sound engineer', 'a stylist',
  'a ski instructor', 'a police officer', 'a dive instructor', 'a marketing manager', 'a club promoter', 'a bookshop owner', 'a cellist',
  'a skincare therapist', 'a festival volunteer you met at Meteor', 'a horse rider', 'an MMA fighter', 'a psychologist', 'a sex-shop clerk',
  'a pharmacist', 'a cabin crew trainee', 'a burlesque performer', 'a kindergarten teacher', 'a boxing coach', 'a perfumer', 'a fitness model',
  'a hostel owner in Tel Aviv', 'a student from Mali\'s pottery class', 'a baker', 'an interior designer', 'a concierge', 'a camgirl',
  'a yacht stewardess', 'a nightclub bartender', 'a wedding planner', 'a crossfit coach', 'a wine importer', 'a podcast host',
  'a stunt double', 'a boutique owner', 'a TV producer', 'a spa manager', 'a tango teacher', 'an airline pilot', 'a fashion photographer',
  'a bodyguard', 'a vineyard owner', 'a strip-club dancer', 'a personal shopper'];
const MEN_BODY = ['lean', 'athletic', 'muscular', 'big', 'stocky'];
const MEN_HAIR = ['short black', 'buzzed', 'curly dark', 'shaved head', 'brown, swept back', 'dirty blond', 'long, tied back'];
const MEN_SKIN = { il: ['olive', 'tan', 'fair', 'brown', 'olive', 'dark'], us: ['fair', 'brown', 'dark', 'tan'], uk: ['fair', 'fair', 'brown', 'olive'] };
const COCK = ['average and hard as rock', 'thick', 'long', 'big and thick', 'long and curved'];

// a guest already dealt keeps every field (411: a name is one person); only new names are dealt, each to the value
// used least so far, so the quotas stay even as the list grows (3g8: 83 -> 100 women)
function deal(old = {}) {
  const wf = from('woman'), turn = {}, counts = {}, guests = {};
  const kept = (n) => old[n] && old[n].age;
  const tally = (f, v) => { counts[f] = counts[f] || {}; [].concat(v).forEach((x) => { counts[f][x] = (counts[f][x] || 0) + 1; }); };
  const lengthOf = (h) => ['very long', 'long', 'shoulder', 'pixie'].find((l) => h.startsWith(l));
  WOMEN.filter(kept).forEach((n) => {
    const g = old[n]; guests[n] = g;
    tally('body', g.body); tally('age', g.age); tally('length', lengthOf(g.hair)); tally('pussy', g.pussy); tally('vibe', g.vibe);
    tally('breasts', g.breasts); tally('ass', g.ass); tally('acts', g.acts); tally('job', g.job); tally('ink', g.ink || 'none');
    if (g.from !== 'world') turn[g.from] = (turn[g.from] || 0) + 1;
  });
  const fresh = WOMEN.filter((n) => !kept(n)), c = (f) => (counts[f] = counts[f] || {});
  const jobs = shuffle(JOBS).filter((j) => !c('job')[j]), inks = shuffle(INK).filter((i) => !c('ink')[i]);
  if (jobs.length < fresh.length) throw new Error(`deal-guests: ${jobs.length} jobs left for ${fresh.length} new women`);
  fresh.forEach((name) => {
    const o = wf[name], body = least(c('body'), BODY), [lo, hi] = HEIGHT[body], t = turn[o] = (turn[o] || 0) + 1;
    const [skin, colour, eyes] = o === 'world' ? WORLD[name] : ['skin', 'hair', 'eyes'].map((k) => LOOK[o][k][(t - 1) % LOOK[o][k].length]);
    const a1 = least(c('acts'), ACTS), a2 = least(c('acts'), ACTS.filter((x) => x !== a1));
    const inked = Object.entries(c('ink')).filter(([k]) => k !== 'none').reduce((x, [, v]) => x + v, 0) < Math.round(WOMEN.length / 4);
    const ink = inked ? inks.pop() : null; tally('ink', ink || 'none');
    guests[name] = { kind: 'woman', from: o, age: least(c('age'), Array.from({ length: 25 }, (_, i) => 21 + i)), height: Math.round(lo + rnd() * (hi - lo)), body,
      breasts: least(c('breasts'), BREASTS[body]), ass: least(c('ass'), ASS[body]), pussy: least(c('pussy'), PUSSY), skin,
      hair: `${least(c('length'), LENGTH)} ${colour}`, eyes, ink, job: jobs.pop(), vibe: least(c('vibe'), VIBES), acts: [a1, a2], hook: '', text: '' };
  });
  MEN.forEach((name) => { guests[name] = old[name]; });
  return guests;
}

const file = path.join(__dirname, '../app/guests.js');
const old = fs.existsSync(file) ? require(file).GUESTS : {};
for (const f of process.argv.slice(2)) {
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\d+\.\s+([A-Z][a-z]+)\s*\|(.*)$/);
    if (!m) continue;
    const parts = m[2].split('|').map((x) => x.trim()), name = m[1];
    if (!WOMEN.includes(name) && !MEN.includes(name)) throw new Error(`deal-guests: ${name} (${f}) is no guest`);
    old[name] = WOMEN.includes(name) ? { hook: parts[0], text: parts[1] } : { text: parts[0] };
  }
}
const body = Object.entries(deal(old)).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');
fs.writeFileSync(file, `/* The guests (Phase 35, decisions 410-426): who each named third person is, the same in every program and card (411).
   Fields dealt by scripts/deal-guests.js to the quotas (413, 419-425); hook and text written per woman (412), text per
   man (414). Pure data: runs in Node and in the page (KBGuests). */
(function (root) {
  const GUESTS = {
${body}
  };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = { GUESTS }; else root.KBGuests = { GUESTS };
})(typeof window !== 'undefined' ? window : globalThis);
`);
console.log(`app/guests.js: ${WOMEN.length} women, ${MEN.length} men`);
