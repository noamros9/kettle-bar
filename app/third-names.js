/* The third person's name (Phase 35, decisions 351–353). Pure: runs in Node and in the page (KBThird).
   A threesome cue holds a placeholder, never a name: {woman} (FMF) or {man} (MMF). The page fills it when it shows
   the cue, so the name is computed, never stored, and no built day or pin holds it.
     WOMEN, MEN               the names, picked by Noam (358, 410): Israeli, American, British and (women) the world,
                              each origin spread evenly through the list; ORIGINS the lists by origin
     thirdName(at, kind)      kind 'woman' | 'man'. at { pid, day }: a program day, from the program's own start in
                              the list, one name a day; at { date }: a build-your-own workout, one a day by the date
                              (local calendar day); at { date, ex }: outside a workout (384), one per exercise id
                              and day, so neighbouring cards differ and each keeps its name all day
     fill(text, at)           the text with each placeholder replaced by that day's name */
(function (root) {
  // the men: Israeli names with the American and British ones (alternating) spread evenly between them
  const weave = (il, us, uk) => {
    const others = us.flatMap((n, i) => [n, uk[i]]);
    return il.flatMap((n, i) => (Math.floor((i + 1) * others.length / il.length) > Math.floor(i * others.length / il.length) ? [n, others[Math.floor(i * others.length / il.length)]] : [n]));
  };
  // the women (3g1): each origin in proportion to its size, the one furthest behind next, never the last one's again
  const spread = (lists) => {
    const due = (k) => (used[k] + 0.5) / lists[k].length, used = Object.fromEntries(Object.keys(lists).map((k) => [k, 0])), out = [];
    for (let last = null, left = Object.values(lists).flat().length; left; left--) {
      const open = Object.keys(lists).filter((k) => used[k] < lists[k].length);
      const k = open.filter((x) => x !== last).sort((x, y) => due(x) - due(y))[0] || last;
      out.push(lists[k][used[k]++]); last = k;
    }
    return out;
  };
  const ORIGINS = {
    woman: {
      il: ['Noa', 'Yael', 'Maya', 'Adi', 'Roni', 'Gal', 'Michal', 'Hila', 'Dana', 'Noy', 'Shani', 'Inbar', 'Keren', 'Lihi', 'Neta', 'Agam',
        'Ella', 'Moran', 'Yarden', 'Romi', 'Bar', 'Lian', 'Linoy', 'Anat', 'Hodaya',
        'Shira', 'Tamar', 'Hadar', 'Rotem', 'Shaked', 'Coral', 'Sivan', 'Nofar', 'Naama', 'Hadas', 'Lital', 'Dafna'],
      us: ['Ashley', 'Madison', 'Kayla', 'Megan', 'Brittany', 'Paige', 'Riley', 'Amber', 'Heather', 'Alexis', 'Morgan', 'Vanessa',
        'Tiffany', 'Melissa', 'Sierra'],
      uk: ['Charlotte', 'Sophie', 'Amelia', 'Holly', 'Isla', 'Scarlett', 'Jade', 'Ruby', 'Ellie', 'Grace', 'Hannah'],
      world: ['Valentina', 'Chloe', 'Bianca', 'Natasha', 'Isabela', 'Juliette', 'Chiara', 'Ingrid', 'Carmen', 'Amelie', 'Francesca',
        'Katya', 'Luna', 'Yasmin', 'Elena', 'Mila', 'Adriana', 'Aiko', 'Mariana', 'Mei'],
    },
    man: {
      il: ['Itay', 'Omer', 'Ido', 'Nadav', 'Tomer', 'Guy', 'Ori', 'Asaf', 'Erez', 'Ran', 'Ariel', 'Daniel', 'Shahar', 'Alon', 'Yuval', 'Dor'],
      us: ['Jake', 'Tyler', 'Brandon', 'Ryan'],
      uk: ['Oliver', 'Harry', 'Jack', 'Theo'],
    },
  };
  const WOMEN = spread(ORIGINS.woman), MEN = weave(ORIGINS.man.il, ORIGINS.man.us, ORIGINS.man.uk);
  const LISTS = { woman: WOMEN, man: MEN };

  const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
  const dayNumber = (d) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);

  function thirdName(at, kind) {
    const list = LISTS[kind];
    if (!list) throw new Error(`thirdName: no names for "${kind}"`);
    const step = at.pid ? hash(at.pid) + at.day - 1 : dayNumber(at.date || new Date()) + (at.ex ? hash(at.ex) : 0);
    return list[step % list.length];
  }
  const fill = (text, at) => String(text).replace(/\{(woman|man)\}/g, (_, kind) => thirdName(at, kind));

  const api = { WOMEN, MEN, ORIGINS, thirdName, fill };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBThird = api;
})(typeof window !== 'undefined' ? window : globalThis);
