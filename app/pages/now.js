/* ---------------- Do now (Phase 25, #200) ----------------
   One exercise for dead time: no equipment, quiet, 20-30 s (app/now.js picks it). A card on the Programs page and the
   home-screen shortcut (#now) both offer Random and What I missed; nothing is picked until a tap (174). Start runs one
   timed hold on the clock (a silent 3 s get-ready, one beep at the end, no voice: 180); Another picks again; Done keeps
   it as a random record with choices { now } (145): counted in Stats and History, never a trained day (181). */
let nowState = null; // { mode, pick: { ex, seconds, level }, seed } once a button was tapped
let nowNotice = ''; // "Do now done…", once, on the Programs page
const nowLoads = () => KBNow.loads(doneEntries(), dayOf, EX, new Date());
function nowPick(mode) {
  const seed = KBRandom.newSeed();
  nowState = { mode, seed, pick: KBNow.pick(KBEx, { mode, seed, loads: mode === 'missed' ? nowLoads() : {}, recent: random.recentNow(), level: KBRandom.levelOf(doneLevels()) }) };
  nowNotice = '';
  if (route.view === 'now') render(); else go('now');
}
const nowButtons = (cls = '') => `<div class="pbtns${cls}"><button class="btn" data-now="random">Random</button><button class="btn ghost" data-now="missed">What I missed</button></div>`;
// the card on the Programs page, under the rest-day card
function nowCard() {
  return `<div class="nowcard"><div class="rc-t"><b>Do now</b><span>One exercise for a spare minute: no equipment, quiet, 20–30 seconds.</span></div>
    <div class="rc-a"><button class="btn" data-now="random">Random</button><button class="btn ghost" data-now="missed">What I missed</button></div></div>`;
}
function viewNow() {
  const head = `<div class="crumbs"><button class="back" data-go="programs">← Programs</button></div><div class="eyebrow">Do now</div>`;
  if (!nowState) {
    return `${head}<h1>Do now</h1><p class="lede">One exercise for a spare minute: no equipment, quiet, 20–30 seconds. Random, or one for the muscles you've worked least this week.</p>${nowButtons()}`;
  }
  const { pick, mode } = nowState, e = EX[pick.ex];
  return `${head}<h1>${esc(e.name)}</h1>
    <p class="lede">${mode === 'missed' ? `For your ${esc(MUSCLE_NAMES[e.muscles.primary[0]].toLowerCase())}: worked least in the last 7 days.` : 'A random one from the quiet, no-equipment list.'}</p>
    <div class="card nowex"><div class="bigfig">${fig(e.id)}</div>
      <dl class="facts"><div><dt>How to</dt><dd>${cueOf(e)}</dd></div>
        <div><dt>Time</dt><dd>${pick.seconds} s${e.side ? ', switch sides halfway' : ''}</dd></div></dl></div>
    <div class="pbtns"><button class="btn" data-now-start="1">Start · ${pick.seconds} s</button><button class="btn ghost" data-now-another="1">Another</button><button class="btn ghost" data-now-done="1">Done</button></div>`;
}
// one timed hold: a silent get-ready, then the time, one beep at its end
function nowStart() {
  const { pick } = nowState, e = EX[pick.ex];
  T.unlockAudio(); T.clear();
  T.runPlan({ phases: [{ sec: 3, label: `Get ready · ${e.name}`, sub: 'Do now', end: 'none' }, { sec: pick.seconds, label: e.name, sub: e.side ? 'Switch sides halfway' : 'Do now', end: 'long', work: 1 }] }, () => T.setLabel("Time's up", 'Tap Done to count it'));
}
function nowDone() {
  random.doNow({ ...nowState.pick, mode: nowState.mode, seed: nowState.seed });
  nowNotice = `Do now done: ${EX[nowState.pick.ex].name}. Stats has it under Random workouts.`;
  nowState = null; T.clear(); T.setLabel('Rest timer', 'Tap a set number when you finish a set');
  go('programs');
}
