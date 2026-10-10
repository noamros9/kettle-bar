// The finish card: appears when every set of the day is ticked; shows what the day added up to; marks it done.
const { test, expect } = require('./fixtures.js');

async function tickEverySet(app) {
  const pips = app.page.locator('[data-pip]');
  const n = await pips.count();
  for (let i = 0; i < n; i++) await pips.nth(i).click();
}

test('ticking every set shows the finish card with sets, workout and stretching minutes', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60-d1');
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  await expect(card).toHaveCount(0);
  await tickEverySet(app);
  await expect(card).toBeVisible();
  const v = await app.data(() => KBStats.dayVolume(programs.day('three-split-60', 1), KBEx.EX));
  await expect(card.getByTestId('sets')).toHaveText(String(v.sets));
  await expect(card.getByTestId('workout-min')).toHaveText(`${v.workoutMin} min`);
  await expect(card.getByTestId('stretch-min')).toHaveText(`${v.stretchMin} min`);
  const map = card.getByRole('img', { name: 'Muscles worked today' });
  await expect(map).toBeVisible();
  const busiest = await app.data(() => { const m = KBStats.dayVolume(programs.day('three-split-60', 1), KBEx.EX).muscles; return Object.keys(m).sort((a, b) => m[b] - m[a])[0]; });
  await expect(map.locator(`[data-m="${busiest}"]`).first()).toHaveClass('mm-l4');
  await expect(card.getByText('Less')).toBeVisible();
  await map.scrollIntoViewIfNeeded();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/finish-card.png` });
});

// Phase 30 ticket 5 (212, 215): marking never unmarks; a done day is done again from a fresh session
test('Mark as done on the card marks the day; Do it again starts fresh and its card adds a date', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60-d1');
  await tickEverySet(app);
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  await card.getByRole('button', { name: 'Mark day 1 as done' }).click();
  await expect(app.page.getByTestId('done-count')).toHaveText('✓ Done');
  await expect(card).toHaveCount(0); // the session is done with
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/done-day.png` });
  await app.page.getByRole('button', { name: 'Do it again' }).click();
  await tickEverySet(app);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/done-again-card.png` });
  await card.getByRole('button', { name: 'Mark day 1 done again' }).click();
  await expect(app.page.getByTestId('done-count')).toHaveText('✓ Done 2×');
  expect(await app.data(() => [store.count('three-split-60'), store.entries('three-split-60').length])).toEqual([1, 2]);
});

test('the card shows this week so far (today counts once marked done) and the next workout', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60');
  await app.page.getByRole('checkbox', { name: 'Mark day 2 done' }).click(); // done earlier this week
  await app.go('#p-three-split-60-d1');
  await tickEverySet(app);
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  const [d1, d2] = await app.data(() => [0, 1].map((i) => KBStats.dayVolume(programs.day('three-split-60', i + 1), KBEx.EX)));
  const week = card.getByTestId('week');
  await expect(week).toHaveText(`This week: 1 workout · ${d2.workoutMin} min + ${d2.stretchMin} min stretching`);
  await card.getByRole('button', { name: 'Mark day 1 as done' }).click();
  await expect(week).toHaveText(`This week: 2 workouts · ${d1.workoutMin + d2.workoutMin} min + ${d1.stretchMin + d2.stretchMin} min stretching`);
  const day3 = await app.data(() => programs.get('three-split-60').days[2].name);
  const next = card.getByRole('button', { name: new RegExp(`^Next: Day 3 · ${day3}`) });
  await expect(next).toBeVisible();
  await next.click();
  await expect(app.heading()).toHaveText(day3);
});

test('marking the last day done offers What next: Start Round 2 and same-family programs not started; tapping one opens it', async ({ app }, testInfo) => {
  await app.open('#programs');
  await app.data(() => { for (let d = 1; d < 60; d++) store.toggle('three-split-60', d); store.toggle('iron-ppl', 1); });
  await app.go('#p-three-split-60-d60');
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  await tickEverySet(app);
  await expect(card.getByText('What next?')).toHaveCount(0);
  await card.getByRole('button', { name: 'Mark day 60 as done' }).click();
  const next = card.locator('.wncard');
  await expect(card.getByRole('button', { name: 'Start Round 2' })).toBeVisible();
  const n = await next.count();
  expect(n).toBeGreaterThanOrEqual(2); expect(n).toBeLessThanOrEqual(3);
  const ids = await next.evaluateAll((els) => els.map((e) => e.dataset.openProg));
  const fam = await app.data((ids) => ids.map((id) => programs.summary(id).subject).map((s) => KBLibrary.FAMILIES.find(([, l]) => l.includes(s))[0]), ids);
  expect(ids).not.toContain('three-split-60'); expect(ids).not.toContain('iron-ppl');
  expect(new Set(fam).size).toBe(1);
  expect(await app.sidewaysScroll()).toBe(0);
  const name = await next.first().locator('b').textContent();
  await next.first().click();
  await expect(app.heading()).toHaveText(name);
  await app.go('#p-three-split-60');
  await expect(app.page.getByRole('heading', { name: 'What next?' })).toBeVisible();
});
