// Stats: a header tab showing what the days marked done add up to.
const { test, expect } = require('./fixtures.js');

test('Stats shows this week across all programs: workouts, minutes kept apart, sets and reps', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60');
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  await app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Stats' }).click();
  await expect(app.page).toHaveURL(/#stats$/);
  await expect(app.heading()).toHaveText('Stats');
  const [a, b] = await app.data(() => [0, 1].map((i) => KBStats.dayVolume(programs.day('three-split-60', i + 1), KBEx.EX)));
  const tile = (name) => app.page.getByRole('group', { name });
  await expect(tile('Workouts')).toContainText('2');
  await expect(tile('Workout minutes')).toContainText(String(a.workoutMin + b.workoutMin));
  await expect(tile('Stretching minutes')).toContainText(String(a.stretchMin + b.stretchMin));
  await expect(tile('Sets')).toContainText(String(a.sets + b.sets));
  await expect(tile('Reps')).toContainText(String(a.reps + b.reps));
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/stats.png` });
});

test('Stats with nothing done yet says so, and the header still fits', async ({ app }, testInfo) => {
  await app.open('#stats');
  await expect(app.page.getByText('No workouts marked done this week yet.')).toBeVisible();
  await expect(app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Stats' })).toHaveAttribute('aria-current', 'page');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/stats-empty.png` });
});

// history across weeks, loaded through Import; the clock is fixed on Wednesday 30 Sep 2026
const at = (m, d) => new Date(2026, m - 1, d, 9).toISOString();
const history = { 'three-split-60': { 1: at(9, 28), 2: at(9, 29), 3: at(9, 15) }, 'iron-ppl': { 1: at(8, 10) } };
async function withHistory(app) {
  await app.page.clock.setFixedTime(new Date(2026, 8, 30, 12));
  await app.open('#settings');
  await app.page.locator('#import-file').setInputFiles({ name: 'h.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: 'x', programs: history })) });
  await app.page.getByRole('button', { name: /^Merge/ }).click();
  await app.go('#stats');
}
const workouts = (app) => app.page.getByRole('group', { name: 'Workouts' }).locator('b');
const tab = (app, name) => app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name });
const rows = (app) => app.page.locator('table.weeks tbody tr');

test('time spans: this week, last 4 weeks, all time, with a row per week', async ({ app }, testInfo) => {
  await withHistory(app);
  await expect(workouts(app)).toHaveText('2');
  await expect(rows(app)).toHaveCount(0);
  await app.page.getByRole('button', { name: 'Last 4 weeks' }).click();
  await expect(workouts(app)).toHaveText('3');
  await expect(rows(app)).toHaveCount(0); // week by week is on the Time tab
  await tab(app, 'Time').click();
  await expect(rows(app)).toHaveCount(4);
  await expect(rows(app).first()).toContainText('27 Sept');
  await app.page.getByRole('button', { name: 'All time' }).click();
  await expect(rows(app)).toHaveCount(8);
  await tab(app, 'Overview').click();
  await expect(workouts(app)).toHaveText('4');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/stats-all.png`, fullPage: true });
});

test('the program switch narrows every number to one program; all time reads "since you started"', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await withHistory(app);
  await app.page.getByLabel('Program', { exact: true }).selectOption('iron-ppl');
  await expect(workouts(app)).toHaveText('0');
  await app.page.getByRole('button', { name: 'All time' }).click();
  await expect(workouts(app)).toHaveText('1');
  await expect(app.page.locator('.eyebrow')).toContainText('Iron PPL · since you started');
  await app.page.getByLabel('Program', { exact: true }).selectOption('all');
  await expect(workouts(app)).toHaveText('4');
});

test('muscle balance: a heat map and ranked bars that follow the span and program', async ({ app }, testInfo) => {
  await withHistory(app);
  await expect(app.page.getByRole('region', { name: 'Muscle balance' })).toHaveCount(0); // on its own tab
  await tab(app, 'Muscles').click();
  const section = app.page.getByRole('region', { name: 'Muscle balance' });
  await expect(section.getByRole('img', { name: /^Muscle balance/ })).toBeVisible();
  const bars = section.getByRole('listitem');
  const expected = await app.data(() => {
    const from = KBStats.weekStart(new Date()), to = new Date(from); to.setDate(to.getDate() + 7);
    const s = KBStats.summarize(doneEntries(), { dayOf, EX: KBEx.EX, from, to });
    return KBStats.rankMuscles(s.muscles, KBEx.MUSCLE_NAMES).map((m) => m.name);
  });
  await expect(bars).toHaveCount(expected.length);
  await expect(bars.first()).toContainText(expected[0]);
  const before = await bars.count();
  await app.page.getByLabel('Program', { exact: true }).selectOption('iron-ppl');
  await app.page.getByRole('button', { name: 'All time' }).click();
  const ironTop = await app.data(() => {
    const m = KBStats.dayVolume(programs.day('iron-ppl', 1), KBEx.EX).muscles; // Iron PPL's only done day
    return KBStats.rankMuscles(m, KBEx.MUSCLE_NAMES)[0].name;
  });
  await expect(bars.first()).toContainText(ironTop);
  await section.scrollIntoViewIfNeeded();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/stats-muscles.png` });
  expect(before).toBeGreaterThan(3);
});

test('tabs: Overview, Muscles and Time each render; the span and the program carry across them', async ({ app }) => {
  await withHistory(app);
  await expect(tab(app, 'Overview')).toHaveAttribute('aria-pressed', 'true');
  await app.page.getByRole('button', { name: 'All time' }).click();
  await app.page.getByLabel('Program', { exact: true }).selectOption('three-split-60');
  await expect(workouts(app)).toHaveText('3');
  await tab(app, 'Muscles').click();
  await expect(tab(app, 'Muscles')).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('region', { name: 'Muscle balance' })).toBeVisible();
  await expect(app.page.getByRole('button', { name: 'All time' })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByLabel('Program', { exact: true })).toHaveValue('three-split-60');
  await expect(app.page.getByRole('group', { name: 'Workouts' })).toHaveCount(0);
  await tab(app, 'Time').click();
  await expect(rows(app).first()).toBeVisible();
  await expect(app.page.getByLabel('Program', { exact: true })).toHaveValue('three-split-60');
  await app.page.getByRole('button', { name: 'This week' }).click();
  await expect(tab(app, 'Time')).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByText('Pick a longer span to see each week.')).toBeVisible();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.go('#programs'); await app.go('#stats');
  await expect(tab(app, 'Time')).toHaveAttribute('aria-pressed', 'true'); // kept while the app is open
});

test('Time tab: a mixed day splits its minutes between Strength and Mind & body; tap a family for its subjects', async ({ app }) => {
  await app.page.clock.setFixedTime(new Date(2026, 8, 30, 12));
  await app.open('#settings');
  await app.page.locator('#import-file').setInputFiles({ name: 'h.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'kettle-bar-progress', version: 1, exportedAt: 'x', programs: { 'three-split-60': { 1: at(9, 28) }, 'iron-yoga': { 1: at(9, 29) } } })) });
  await app.page.getByRole('button', { name: /^Merge/ }).click();
  await app.go('#stats');
  await tab(app, 'Time').click();
  const fams = app.page.getByRole('list', { name: 'Workout minutes by family' });
  await expect(fams.locator(':scope > li')).toHaveCount(2);
  await expect(fams).toContainText('Strength');
  await expect(fams).toContainText('Mind & body');
  const total = await app.data(() => [['three-split-60', 1], ['iron-yoga', 1]].reduce((a, [p, n]) => a + programs.day(p, n).est, 0));
  const shown = (await fams.locator(':scope > li .rval').allTextContents()).map((t) => parseInt(t, 10)).reduce((a, b) => a + b, 0);
  expect(Math.abs(shown - total)).toBeLessThanOrEqual(1); // each family rounded on its own
  await fams.getByRole('button', { name: /Strength/ }).click();
  await expect(fams.getByRole('button', { name: /Strength/ })).toHaveAttribute('aria-expanded', 'true');
  const subjects = app.page.getByRole('list', { name: 'Strength by subject' });
  await expect(subjects).toContainText('Strength & stretch');
  await expect(app.page.getByRole('list', { name: 'Workout minutes by format' })).toContainText('Guided flow');
  await expect(app.page.getByRole('group', { name: 'Mind & body minutes' })).not.toContainText(/^\s*Mind & body minutes\s*0\s*$/);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('trend: Last 3 months draws a line of 13 weeks; This year draws a bar per month and a month-by-month table', async ({ app }) => {
  await withHistory(app);
  await tab(app, 'Time').click();
  await app.page.getByRole('button', { name: 'Last 3 months' }).click();
  const trend = app.page.getByRole('region', { name: 'Minutes per week' });
  await expect(trend.locator('.tdot')).toHaveCount(13);
  await expect(rows(app)).toHaveCount(13);
  await app.page.getByRole('button', { name: 'This year' }).click();
  const months = app.page.getByRole('region', { name: 'Minutes per month' });
  await expect(months.locator('.tmark')).toHaveCount(10); // January to October: the span runs to the end of this week (3 Oct)
  await expect(months.locator('.tbar')).toHaveCount(2); // August (Iron PPL) and September
  await expect(app.page.locator('table.weeks caption')).toHaveText('Month by month');
  await expect(rows(app)).toHaveCount(10);
  await tab(app, 'Overview').click();
  await expect(workouts(app)).toHaveText('4');
  expect(await app.sidewaysScroll()).toBe(0);
});
