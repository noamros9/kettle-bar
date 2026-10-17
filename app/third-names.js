/* The third person's name (Phase 35, decisions 351–353). Pure: runs in Node and in the page (KBThird).
   A threesome cue holds a placeholder, never a name: {woman} (FMF) or {man} (MMF). The page fills it when it shows
   the cue, so the name is computed, never stored, and no built day or pin holds it.
     WOMEN, MEN               the names, picked by Noam (358, 410, 441, 448): Israeli, American, British and the world,
                              each origin spread evenly through the list; ORIGINS the lists by origin
     thirdName(at, kind)      kind 'woman' | 'man'. at { pid, day }: a program day, from the program's own start in
                              the list, one name a day; at { date }: a build-your-own workout, one a day by the date
                              (local calendar day); at { date, ex }: outside a workout (384), one per exercise id
                              and day, so neighbouring cards differ and each keeps its name all day
     fill(text, at, wrap?)    the text with each placeholder replaced by that day's name, through wrap (the page's
                              tappable name, 416) when given */
(function (root) {
  // the women (3g1) and the men (3g8): each origin in proportion to its size, the one furthest behind next, never the last one's again
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
        'Shira', 'Tamar', 'Hadar', 'Rotem', 'Shaked', 'Coral', 'Sivan', 'Nofar', 'Naama', 'Hadas', 'Lital', 'Dafna',
        'Noga', 'Maayan', 'Hagar', 'Dorin', 'Lior',
        'Eden', 'Natali', 'Efrat', 'Karin', 'Yuli', 'Mika', 'Nicole', 'Elinor', 'Lia', 'Yaara', 'Shai', 'Ofri', 'Tal', 'Lotem',
        'Shiraz', 'Alma', 'Kim', 'Amalia', 'Ziv', 'Eliana', 'Dina', 'Galia', 'Danielle', 'Avia', 'Inbal', 'Keshet'],
      us: ['Ashley', 'Madison', 'Kayla', 'Megan', 'Brittany', 'Paige', 'Riley', 'Amber', 'Heather', 'Alexis', 'Morgan', 'Vanessa',
        'Tiffany', 'Melissa', 'Sierra', 'Avery', 'Chelsea', 'Lindsey', 'Kimberly', 'Brooke', 'Jenna', 'Kendall', 'Skylar', 'Haley'],
      uk: ['Charlotte', 'Sophie', 'Amelia', 'Holly', 'Isla', 'Scarlett', 'Jade', 'Ruby', 'Ellie', 'Grace', 'Hannah', 'Abigail', 'Harriet', 'Florence', 'Lily'],
      world: ['Valentina', 'Chloe', 'Bianca', 'Natasha', 'Isabela', 'Juliette', 'Chiara', 'Ingrid', 'Carmen', 'Amelie', 'Francesca',
        'Katya', 'Luna', 'Yasmin', 'Elena', 'Mila', 'Adriana', 'Aiko', 'Mariana', 'Mei', 'Bruna', 'Noemi', 'Selin', 'Paola', 'Nala',
        'Camila', 'Gabriela', 'Catalina', 'Lola', 'Athena', 'Celine', 'Astrid', 'Vera', 'Polina', 'Sakura', 'Rin', 'Leilani', 'Shirin',
        'Nour', 'Amara', 'Luciana', 'Rafaela', 'Tatiana', 'Manuela', 'Gia', 'Monique', 'Antonella', 'Carla', 'Kaori', 'Suki', 'Ariadne',
        'Chantal', 'Liv', 'Maribel'],
    },
    man: {
      il: ['Itay', 'Omer', 'Ido', 'Nadav', 'Tomer', 'Guy', 'Ori', 'Asaf', 'Erez', 'Ran', 'Ariel', 'Daniel', 'Shahar', 'Alon', 'Yuval', 'Dor'],
      us: ['Jake', 'Tyler', 'Brandon', 'Ryan', 'Cole', 'Mason', 'Austin', 'Blake'],
      uk: ['Oliver', 'Harry', 'Jack', 'Theo', 'George', 'Finn', 'Callum', 'Jamie'],
      world: ['Mateo', 'Rafael', 'Diego', 'Lars', 'Kenji', 'Thiago', 'Julien', 'Hugo', 'Marco'],
    },
  };
  const WOMEN = spread(ORIGINS.woman), MEN = spread(ORIGINS.man);
  const LISTS = { woman: WOMEN, man: MEN };

  const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
  const dayNumber = (d) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);

  function thirdName(at, kind) {
    const list = LISTS[kind];
    if (!list) throw new Error(`thirdName: no names for "${kind}"`);
    const step = at.pid ? hash(at.pid) + at.day - 1 : dayNumber(at.date || new Date()) + (at.ex ? hash(at.ex) : 0);
    return list[step % list.length];
  }
  const fill = (text, at, wrap = (n) => n) => String(text).replace(/\{(woman|man)\}/g, (_, kind) => wrap(thirdName(at, kind)));

  const api = { WOMEN, MEN, ORIGINS, thirdName, fill };
  /* node:coverage ignore next 2 */ // the browser branch; the page's UI tests cover it
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.KBThird = api;
})(typeof window !== 'undefined' ? window : globalThis);
