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
  const v = await app.data(() => KBStats.dayVolume(PROGRAMS[0].days[0], KBEx.EX));
  await expect(card.getByTestId('sets')).toHaveText(String(v.sets));
  await expect(card.getByTestId('workout-min')).toHaveText(`${v.workoutMin} min`);
  await expect(card.getByTestId('stretch-min')).toHaveText(`${v.stretchMin} min`);
  const map = card.getByRole('img', { name: 'Muscles worked today' });
  await expect(map).toBeVisible();
  const busiest = await app.data(() => { const m = KBStats.dayVolume(PROGRAMS[0].days[0], KBEx.EX).muscles; return Object.keys(m).sort((a, b) => m[b] - m[a])[0]; });
  await expect(map.locator(`[data-m="${busiest}"]`).first()).toHaveClass('mm-l4');
  await expect(card.getByText('Less')).toBeVisible();
  await map.scrollIntoViewIfNeeded();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/finish-card.png` });
});

test('Mark as done on the card marks the day; tapping again un-marks it', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60-d1');
  await tickEverySet(app);
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  await card.getByRole('button', { name: 'Mark day 1 as done' }).click();
  await expect(app.page.locator('.whead [data-toggle="1"]')).toHaveText('✓ Done');
  const done = card.getByRole('button', { name: '✓ Day 1 done' });
  await expect(done).toHaveAttribute('aria-pressed', 'true');
  await done.click();
  await expect(app.page.locator('.whead [data-toggle="1"]')).toHaveText('Mark as done');
});

test('the card shows this week so far (today counts once marked done) and the next workout', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60');
  await app.page.getByRole('checkbox', { name: 'Mark day 2 done' }).click(); // done earlier this week
  await app.go('#p-three-split-60-d1');
  await tickEverySet(app);
  const card = app.page.getByRole('region', { name: 'Workout complete' });
  const [d1, d2] = await app.data(() => [0, 1].map((i) => KBStats.dayVolume(PROGRAMS[0].days[i], KBEx.EX)));
  const week = card.getByTestId('week');
  await expect(week).toHaveText(`This week: 1 workout · ${d2.workoutMin} min + ${d2.stretchMin} min stretching`);
  await card.getByRole('button', { name: 'Mark day 1 as done' }).click();
  await expect(week).toHaveText(`This week: 2 workouts · ${d1.workoutMin + d2.workoutMin} min + ${d1.stretchMin + d2.stretchMin} min stretching`);
  const day3 = await app.data(() => PROGRAMS[0].days[2].name);
  const next = card.getByRole('button', { name: new RegExp(`^Next: Day 3 · ${day3}`) });
  await expect(next).toBeVisible();
  await next.click();
  await expect(app.heading()).toHaveText(day3);
});
