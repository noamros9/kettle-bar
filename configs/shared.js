// The program library (issue #4). Each program is 60 days, starts at intermediate, ends every
// workout with abs (unless absSlots: [], as in yoga) and gets a matched warm-up and cool-down on top of its time range.
// Blocks: f = straight | superset (slots in pairs) | circuit | emom | amrap | tabata | ladder | flow (guided poses)
// | bouts (boxing: one combo per bout).
// Slots are pool names from program-builder.js (or exercise ids); a trailing '?' makes the slot optional (dropped if
// time is short). A block's scale: n makes its holds n times longer (yin), up to cap seconds.
// levers[1], levers[2] = how Level II and Level III get harder: reps | holds | weight | variation | tempo.
// about: the hand-written paragraph (3–6 sentences); older programs keep theirs in an ABOUT table in their family file.

// Block constructors, one per format, shared by every family file (and by configs/mixed.js in Phase 6).

const S = (title, slots, extra) => ({ f: 'straight', title, slots, ...extra });
const SS = (title, slots, extra) => ({ f: 'superset', title, slots, ...extra });
const C = (title, slots, extra) => ({ f: 'circuit', title, slots, ...extra });
const E = (title, slots, extra) => ({ f: 'emom', title, slots, ...extra });
const A = (title, slots, extra) => ({ f: 'amrap', title, slots, ...extra });
const T = (title, slots, extra) => ({ f: 'tabata', title, slots, ...extra });
const L = (title, slots, extra) => ({ f: 'ladder', title, slots, ...extra });
const F = (title, slots, extra) => ({ f: 'flow', title, slots, ...extra });
const B = (title, slots, extra) => ({ f: 'bouts', title, slots, ...extra }); // one combo per 3-minute bout

module.exports = { S, SS, C, E, A, T, L, F, B };
