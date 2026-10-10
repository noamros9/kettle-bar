// Workout flows on a phone, with Playwright's fake clock so a 2-minute rest takes no time.
const { test, expect } = require('./fixtures.js');

const timer = (app) => ({ clock: app.page.locator('#tclock'), label: app.page.locator('#tlabel'), sub: app.page.locator('#tsub') });
const seconds = (app, n) => app.page.clock.runFor(n * 1000);
// find something in the app's own data: [day number, block index, item index] for the first match
const find = (app, pid, what) => app.data(([pid, what]) => {
  const p = programs.get(pid), EX = KBEx.EX;
  for (const d of p.days) {
    for (const [bi, b] of d.blocks.entries()) {
      const f = b.format || 'straight';
      if (what === 'hold' && f === 'straight') { const i = b.items.findIndex((it) => EX[it.ex].u === 'sec'); if (i >= 0) return { day: d.day, bi, i, name: EX[b.items[i].ex].name, n: b.items[i].n, side: !!EX[b.items[i].ex].side }; }
      if (what === f) return { day: d.day, bi, minutes: b.minutes, name: EX[b.items[0].ex].name, next: d.blocks[bi + 1] && d.blocks[bi + 1].kind };
    }
  }
}, [pid, what]);

// flows don't depend on the theme: run them once, in light mode
test.beforeEach(async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.page.clock.install();
});

test('ticking a set starts the 30 s rest, which counts down and ends; tapping it again un-ticks', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  const first = await app.data(() => { const b = programs.day('three-split-60', 1).blocks[0]; return { name: KBEx.EX[b.items[0].ex].name, sets: b.items[0].sets || b.sets }; });
  const pip = app.page.getByRole('button', { name: `Set 1 of ${first.name} done` });
  const t = timer(app);
  await pip.click();
  await expect(pip).toHaveAttribute('aria-pressed', 'true');
  await expect(t.label).toHaveText(`Rest · set 2 of ${first.sets} next`);
  await expect(t.clock).toHaveText('0:30');
  await seconds(app, 10);
  await expect(t.clock).toHaveText('0:20');
  await seconds(app, 21);
  await expect(t.clock).toHaveText('0:00');
  await expect(t.label).toHaveText('Go');
  await expect(t.sub).toHaveText('Rest is over, start the next set');
  await pip.click();
  await expect(pip).toHaveAttribute('aria-pressed', 'false');
  await expect(t.label).toHaveText('Go');
});

test('a hold runs a 3 s get-ready, then the hold, then ticks the set and starts the rest', async ({ app }) => {
  await app.open('#p-three-split-60');
  const hold = await find(app, 'three-split-60', 'hold');
  await app.go(`#p-three-split-60-d${hold.day}`);
  const t = timer(app);
  await app.page.getByRole('button', { name: new RegExp(`Start set 1 · ${hold.n} s`) }).first().click();
  await expect(t.label).toHaveText(`Get ready · ${hold.name}`);
  await seconds(app, 3.5);
  await expect(t.label).toHaveText(hold.side ? `${hold.name} · first side` : hold.name);
  await seconds(app, hold.side ? 2 * hold.n + 5 : hold.n);
  await expect(app.page.getByRole('button', { name: `Set 1 of ${hold.name} done` })).toHaveAttribute('aria-pressed', 'true');
  await expect(t.label).toHaveText(/^Rest · /);
});

test('the warm-up runs hands-free through every stretch and starts the workout clock', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  const total = await app.data(() => KBSession.createSession(programs.get('three-split-60'), programs.day('three-split-60', 1), { EX: KBEx.EX })
    .plan({ type: 'stretch', key: 'warm' }).phases.reduce((a, p) => a + p.sec, 0));
  const t = timer(app);
  await app.page.getByRole('button', { name: '▶ Start warm-up' }).click();
  await expect(t.label).toHaveText(/^Get ready · /);
  await seconds(app, total + 1);
  await expect(t.label).toHaveText('Warm-up done');
  await expect(app.page.locator('[data-stretch="warm"]')).toHaveText('✓ Done · run again');
  await expect(app.page.locator('#sess')).not.toHaveText('0:00');
});

test('Mark as done ticks the day, survives a reload and shows on the program page', async ({ app }) => {
  await app.open('#p-three-split-60-d1');
  await app.page.getByRole('button', { name: 'Mark as done' }).click();
  await expect(app.page.getByTestId('done-count')).toHaveText('✓ Done'); // Phase 30: done, with Do it again
  await app.page.reload(); await app.page.locator('#app h1').waitFor();
  await expect(app.page.getByTestId('done-count')).toHaveText('✓ Done');
  await app.go('#p-three-split-60');
  await expect(app.page.getByRole('checkbox', { name: 'Mark day 1 done' })).toHaveAttribute('aria-checked', 'true');
});

test('an EMOM runs minute by minute, marks the block done and rests before the abs', async ({ app }) => {
  await app.open('#p-minute-man');
  const e = await find(app, 'minute-man', 'emom');
  await app.go(`#p-minute-man-d${e.day}`);
  const t = timer(app), run = app.page.locator(`[data-run="${e.bi}"]`);
  await run.click();
  await seconds(app, 3.5);
  await expect(t.label).toHaveText(new RegExp(`^Min 1/${e.minutes} · ${e.name}`));
  await seconds(app, 60);
  await expect(t.label).toHaveText(new RegExp(`^Min 2/${e.minutes}`));
  await seconds(app, 60 * (e.minutes - 1));
  await expect(run).toHaveText('✓ Done · run again');
  await expect(t.label).toHaveText(e.next === 'abs' ? 'Rest · abs next' : /^Rest · /);
});

test('supersets tick pairs and circuits tick rounds, each with its own rest', async ({ app }) => {
  await app.open('#p-twenty-flat');
  const ss = await find(app, 'twenty-flat', 'superset');
  await app.go(`#p-twenty-flat-d${ss.day}`);
  await app.page.locator(`[data-rpip="${ss.bi}:0:1"]`).click();
  await expect(timer(app).label).toHaveText(/^Rest · pair A, round 2 of \d next$/);
  await expect(timer(app).clock).toHaveText('0:45');

  await app.go('#p-engine');
  const c = await find(app, 'engine', 'circuit');
  await app.go(`#p-engine-d${c.day}`);
  await app.page.locator(`[data-rpip="${c.bi}:1"]`).click();
  await expect(timer(app).label).toHaveText(/^Rest · round 2 of \d next$/);
  await expect(timer(app).clock).toHaveText('1:00');
});
