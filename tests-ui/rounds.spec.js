// Doing a program again: start a new round any time, review rest-of-program swaps, earlier rounds still count.
const fs = require('fs');
const { test, expect } = require('./fixtures.js');

async function roundOneDone(app) {
  await app.open('#p-iron-ppl');
  for (const n of [1, 2]) await app.page.getByRole('checkbox', { name: `Mark day ${n} done` }).click();
  // two rest-of-program swaps and one today-only swap, made in round 1
  return app.data(() => {
    const d = days.open('iron-ppl', 3), b = d.day.blocks[0];
    const a = b.items[0].ex, bEx = b.items[1].ex, toA = d.alternatives(0, 0)[0], toB = d.alternatives(0, 1)[0];
    d.swap(0, 0, toA, { onward: true }); d.swap(0, 1, toB, { onward: true });
    return { a: KBEx.EX[a].name, toA: KBEx.EX[toA].name, b: KBEx.EX[bEx].name, toB: KBEx.EX[toB].name };
  });
}

test('start Round 2: review each rest-of-program swap, then day 1 again with "Round 2" everywhere', async ({ app }, testInfo) => {
  const s = await roundOneDone(app);
  await app.go('#p-iron-ppl');
  await app.page.getByRole('button', { name: 'Start Round 2' }).click();
  const sheet = app.page.getByRole('dialog', { name: 'Start Round 2' });
  await expect(sheet).toContainText('Round 1 stays in your stats');
  const keepA = sheet.getByRole('checkbox', { name: `Keep ${s.toA} instead of ${s.a}` });
  const keepB = sheet.getByRole('checkbox', { name: `Keep ${s.toB} instead of ${s.b}` });
  await expect(keepA).toBeChecked(); await expect(keepB).toBeChecked();
  await keepB.uncheck();
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/round-sheet.png` });
  await sheet.getByRole('button', { name: 'Start Round 2' }).click();
  await expect(sheet).toHaveCount(0);
  await expect(app.page.locator('.phead')).toContainText('Round 2');
  await expect(app.page.getByRole('checkbox', { name: 'Mark day 1 done' })).toHaveAttribute('aria-checked', 'false');
  await app.go('#p-iron-ppl-d3');
  await expect(app.page.locator('.whead .eyebrow')).toContainText('Round 2 · Day 3');
  await expect(app.page.locator('article.ex').filter({ hasText: `Swapped from ${s.a}` }).locator('.nm')).toHaveText(s.toA);
  await expect(app.page.getByText(`Swapped from ${s.b}`)).toHaveCount(0);
  await app.go('#programs');
  await expect(app.page.locator('[data-open-prog="iron-ppl"]')).toContainText('Round 2');
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/round-list.png` });
});

test('stats count every round, and a Round switch narrows to one; the export carries rounds', async ({ app }) => {
  test.skip(test.info().project.name !== 'phone-light', 'theme-independent');
  await roundOneDone(app);
  await app.data(() => store.startRound('iron-ppl', []));
  await app.go('#p-iron-ppl');
  await app.page.getByRole('checkbox', { name: 'Mark day 1 done' }).click();
  await app.go('#stats');
  await app.page.getByLabel('Program', { exact: true }).selectOption('iron-ppl');
  const workouts = app.page.getByRole('group', { name: 'Workouts' }).locator('b');
  await expect(workouts).toHaveText('3');
  const roundSel = app.page.getByLabel('Round', { exact: true });
  await roundSel.selectOption('1');
  await expect(workouts).toHaveText('2');
  await roundSel.selectOption('2');
  await expect(workouts).toHaveText('1');
  await app.go('#settings');
  const [download] = await Promise.all([app.page.waitForEvent('download'), app.page.getByRole('button', { name: 'Export progress' }).click()]);
  const file = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expect(file.rounds['iron-ppl'].map((r) => [r.round, Object.keys(r.done).length])).toEqual([[1, 2]]);
});
