/* Clock adapter: the on-screen timer, beeps, vibration, screen wake lock and the workout clock.
   Runs whatever the Workout Session asks for: T.apply(instruction) and T.runPlan(plan, onDone). */
const T = {
  dur: 30, left: 30, running: false, endAt: 0, iv: null, ctx: null, lock: null,
  fmt(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); },
  setLabel(a, b) { $('#tlabel').textContent = a; $('#tsub').textContent = b; },
  paint() {
    $('#tclock').textContent = this.fmt(this.left);
    $('#tclock').classList.toggle('zero', this.left <= 0);
    $('#tgo').textContent = this.running ? 'Pause' : (this.left > 0 && this.left < this.dur ? 'Resume' : 'Start');
    document.querySelectorAll('#presets button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.preset === this.dur)));
  },
  unlockAudio() {
    try { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); } catch (e) {}
  },
  beep(kind) {
    const long = kind !== 'short';
    try {
      const c = this.ctx; if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      // triangle carries better than sine at the same level; a short hold at the peak adds presence
      o.type = 'triangle'; o.frequency.value = long ? 880 : 1320; o.connect(g); g.connect(c.destination);
      const len = long ? 0.75 : 0.18, peak = long ? 0.75 : 0.5, t0 = c.currentTime;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
      g.gain.setValueAtTime(peak, t0 + len * 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
      o.start(t0); o.stop(t0 + len + 0.05);
    } catch (e) {}
    try { navigator.vibrate && navigator.vibrate(long ? 300 : 80); } catch (e) {}
  },
  // voice cues (holds, sides and flow poses): the phone's speech, on unless switched off in Settings
  voiceOn() { try { return localStorage.getItem('kb-voice') !== 'off'; } catch (e) { return true; } },
  speak(text) {
    if (!this.voiceOn()) return;
    try {
      const s = window.speechSynthesis; if (!s) return;
      s.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US';
      s.speak(u);
    } catch (e) { /* no speech on this device: the beeps still work */ }
  },
  async wake(on) {
    try { if (on && !this.lock && navigator.wakeLock) this.lock = await navigator.wakeLock.request('screen'); if (!on && this.lock) { await this.lock.release(); this.lock = null; } } catch (e) { this.lock = null; }
  },
  queue: [], phase: null,
  tick() {
    if (!this.running) return;
    this.left = (this.endAt - Date.now()) / 1000;
    const cur = this.phase;
    if (cur && cur.halfway && !this.halfSaid && this.left > 0 && this.left <= cur.sec / 2) { this.halfSaid = true; this.speak('Halfway'); }
    if (this.left <= 0) {
      this.left = 0; this.running = false; clearInterval(this.iv);
      const ph = this.phase || { end: 'long' };
      this.beep(ph.end);
      if (ph.sayEnd) this.speak(ph.sayEnd);
      const next = this.queue.shift();
      if (next) { this.begin(next); return; }
      this.phase = null; this.showFig(null);
      $('#timer').classList.remove('work');
      this.setLabel('Go', ph.work ? 'Done' : 'Rest is over, start the next set');
      if (ph.onEnd) ph.onEnd();
    }
    this.paint();
  },
  // guided flows: the current pose's drawing above the clock
  showFig(id) { const el = $('#tfig'); el.hidden = !id; el.innerHTML = id ? fig(id) : ''; },
  begin(ph) {
    this.phase = ph; this.dur = ph.sec; this.left = ph.sec; this.halfSaid = false;
    this.showFig(ph.fig);
    this.setLabel(ph.label, ph.sub || '');
    if (ph.say) this.speak(ph.say);
    $('#timer').classList.toggle('work', !!ph.work);
    this.go();
  },
  run(phases) { this.queue = phases.slice(1); this.begin(phases[0]); },
  go() {
    if (this.left <= 0) this.left = this.dur;
    this.running = true; this.endAt = Date.now() + this.left * 1000;
    clearInterval(this.iv); this.iv = setInterval(() => this.tick(), 200);
    this.wake(true); this.paint();
  },
  start(sec, label, sub) {
    if (sec) { this.run([{ sec, label, sub, end: 'long' }]); return; }
    if (!this.phase) this.phase = { sec: this.dur, end: 'long' };
    const l = $('#tlabel').textContent;
    if (l === 'Go' || l === 'Rest timer' || l === 'Workout finished') this.setLabel('Rest', 'Counting down');
    this.go();
  },
  clear() { this.showFig(null); this.queue = []; this.phase = null; this.running = false; clearInterval(this.iv); $('#timer').classList.remove('work'); this.left = this.dur; this.paint(); },
  pause() { this.tick(); this.running = false; clearInterval(this.iv); this.paint(); },
  adjust(d) {
    this.dur = Math.min(600, Math.max(5, this.dur + d));
    if (this.running) { this.endAt += d * 1000; this.tick(); } else this.left = Math.min(600, Math.max(0, this.left + d)) || this.dur;
    this.paint();
  },
  // carry out a Workout Session instruction
  apply(ins) {
    if (!ins || ins.none) return;
    if (ins.rest) this.start(ins.rest.sec, ins.rest.label, ins.rest.sub);
    else if (ins.clear) { this.clear(); this.setLabel(ins.clear.label, ins.clear.sub); }
  },
  // run a Workout Session plan; onDone fires when its last phase ends
  runPlan(plan, onDone) {
    if (!plan || !plan.phases.length) return;
    const phases = plan.phases.map((p) => ({ ...p }));
    phases[phases.length - 1].onEnd = onDone;
    this.run(phases);
  },
  preset(s) { this.dur = s; if (this.running) { this.endAt = Date.now() + s * 1000; this.tick(); } else this.left = s; this.paint(); },
};
const S = {
  startAt: 0, iv: null,
  start() { if (this.startAt) return; this.startAt = Date.now(); this.iv = setInterval(() => this.paint(), 1000); this.paint(); },
  // a restored workout: the clock shows the time since it started (nothing changes when it is already running)
  resume(ms) { if (this.startAt) return; this.startAt = ms; this.iv = setInterval(() => this.paint(), 1000); this.paint(); },
  reset() { this.startAt = 0; clearInterval(this.iv); this.paint(); },
  paint() { const s = this.startAt ? (Date.now() - this.startAt) / 1000 : 0; $('#sess').textContent = Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); },
};
$('#presets').innerHTML = [[30, '30s'], [45, '45s'], [60, '1 min'], [90, '1:30'], [120, '2 min']].map(([s, l]) => `<button data-preset="${s}" aria-pressed="false">${l}</button>`).join(' ');
$('#presets').addEventListener('click', (e) => { const b = e.target.closest('[data-preset]'); if (b) T.preset(+b.dataset.preset); });
document.querySelectorAll('[data-adj]').forEach((b) => b.addEventListener('click', () => T.adjust(+b.dataset.adj)));
const toggleTimer = () => { T.unlockAudio(); S.start(); if (T.running) T.pause(); else T.start(); };
$('#tgo').addEventListener('click', toggleTimer);
$('#tclock').addEventListener('click', toggleTimer);
$('#treset').addEventListener('click', () => { T.clear(); T.setLabel('Rest timer', 'Tap a set number when you finish a set'); });
$('#sessreset').addEventListener('click', () => S.reset());
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && T.running) { T.lock = null; T.wake(true); } });

