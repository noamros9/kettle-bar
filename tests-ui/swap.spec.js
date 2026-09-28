// Swapping an exercise for today: pick an alternative, choose Today only; ticks, reloads and stats follow.
const { test, expect } = require('./fixtures.js');

async function firstExercise(app) {
  return app.data(() => {
    const it = PROGRAMS[0].days[0].blocks[0].items[0];
    const alts = KBSwaps.alternatives(it.ex, PROGRAMS[0].days[0].blocks[0], PROGRAMS[0], KBEx);
    const to = KBEx.EX[alts[0]];
    return { from: KBEx.EX[it.ex].name, to: to.name, toId: alts[0], reps: to.r[PROGRAMS[0].days[0].level - 1] };
  });
}

test('swap an exercise for today: the card shows the new one with its own reps, and ticks stay', async ({ app }, testInfo) => {
  await app.open('#p-three-split-60-d1');
  const x = await firstExercise(app);
  await app.page.getByRole('button', { name: `Set 1 of ${x.from} done` }).click();
  await app.page.getByRole('button', { name: `Swap ${x.from}` }).click();
  const sheet = app.page.getByRole('dialog', { name: `Swap ${x.from}` });
  await expect(sheet).toBeVisible();
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/swap-sheet.png` });
  await sheet.getByRole('button', { name: new RegExp(`^${x.to}`) }).click();
  await sheet.getByRole('button', { name: 'Today only' }).click();
  await expect(sheet).toHaveCount(0);
  const card = app.page.locator('article.ex').filter({ hasText: `Swapped from ${x.from}` });
  await expect(card.locator('.nm')).toHaveText(x.to);
  await expect(card.locator('.cnt b')).toHaveText(String(x.reps));
  await expect(card).toContainText(`Swapped from ${x.from}`);
  await expect(app.page.getByRole('button', { name: `Set 1 of ${x.to} done` })).toHaveAttribute('aria-pressed', 'true');
  expect(await app.sidewaysScroll()).toBe(0);
  await card.scrollIntoViewIfNeeded();
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/swap-card.png` });
});

test('a swap survives a reload, stays on that day only, and counts in the stats', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-three-split-60-d1');
  const x = await firstExercise(app);
  await app.page.getByRole('button', { name: `Swap ${x.from}` }).click();
  const sheet = app.page.getByRole('dialog', { name: `Swap ${x.from}` });
  await sheet.getByRole('button', { name: new RegExp(`^${x.to}`) }).click();
  await sheet.getByRole('button', { name: 'Today only' }).click();
  await app.page.reload(); await app.page.locator('#app h1').waitFor();
  await expect(app.page.locator('article.ex').filter({ hasText: `Swapped from ${x.from}` }).locator('.nm')).toHaveText(x.to);
  await app.go('#p-three-split-60-d4'); // same kind of day, not swapped
  const d4first = await app.data(() => KBEx.EX[PROGRAMS[0].days[3].blocks[0].items[0].ex].name);
  await expect(app.page.getByRole('button', { name: `Set 1 of ${d4first} done` })).toBeVisible();
  await expect(app.page.getByText('Swapped from')).toHaveCount(0);
  await app.go('#p-three-split-60-d1');
  await app.page.getByRole('button', { name: 'Mark as done' }).click();
  const reps = await app.data(() => KBStats.dayVolume(dayOf('three-split-60', 1), KBEx.EX).reps);
  await app.go('#stats');
  await expect(app.page.getByRole('group', { name: 'Reps' }).locator('b')).toHaveText(reps.toLocaleString('en-US'));
});
