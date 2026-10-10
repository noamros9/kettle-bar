// Doing a day again, the buttons (Phase 30 ticket 5, decisions 212, 215, 314): the program page's ✓ on a done tile
// adds a date; History lists every date and removes one (asking first); a past round's dates stay as they were.
const { test, expect } = require('./fixtures.js');

const PID = 'three-split-60';
const tab = (app, name) => app.page.getByRole('group', { name: 'Stats views' }).getByRole('button', { name });

test('the ✓ on a done tile adds a date and the tile stays done; History shows both; Remove takes one, asking first', async ({ app }, testInfo) => {
  await app.page.clock.install({ time: new Date(2026, 9, 5, 9) }); // Monday 5 Oct 2026
  await app.open('#p-' + PID);
  const tick = app.page.getByRole('checkbox', { name: 'Mark day 3 done' });
  await tick.click();
  await expect(tick).toHaveAttribute('aria-checked', 'true');
  await app.page.clock.setSystemTime(new Date(2026, 9, 8, 9)); // Thursday
  await tick.click(); // done again (314): never unmarks
  await expect(tick).toHaveAttribute('aria-checked', 'true');
  expect(await app.data((p) => [store.count(p), store.marks(p, 3).length], PID)).toEqual([1, 2]);
  await app.go('#stats');
  await tab(app, 'History').click();
  for (const d of ['Monday 5 October', 'Thursday 8 October']) await expect(app.page.getByRole('button', { name: new RegExp(`^${d}: 1 workout`) })).toBeVisible();
  await app.page.getByRole('button', { name: /^Monday 5 October/ }).click();
  await app.page.getByRole('button', { name: 'Remove day 3 on this date' }).click();
  const ask = app.page.getByRole('group', { name: 'Remove this workout?' });
  await expect(ask).toBeVisible();
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/history-remove.png` });
  await ask.getByRole('button', { name: 'Keep' }).click(); // asks first: Keep changes nothing
  expect(await app.data((p) => store.marks(p, 3).length, PID)).toBe(2);
  await app.page.getByRole('button', { name: 'Remove day 3 on this date' }).click();
  await app.page.getByRole('group', { name: 'Remove this workout?' }).getByRole('button', { name: 'Remove' }).click();
  await expect(app.page.getByRole('button', { name: /^Monday 5 October: no workouts/ })).toBeVisible();
  await expect(app.page.getByRole('button', { name: /^Thursday 8 October: 1 workout/ })).toBeVisible();
  const left = await app.data((p) => [store.count(p), store.marks(p, 3)], PID);
  expect(left[0]).toBe(1);
  expect(left[1].length).toBe(1);
  expect(left[1][0].slice(0, 10)).toBe(new Date(2026, 9, 8, 9).toISOString().slice(0, 10)); // Thursday's (the clock runs on)
});

test('a past round\'s dates show in History without Remove; its day starts the new round undone', async ({ app }) => {
  await app.page.clock.install({ time: new Date(2026, 9, 5, 9) });
  await app.open('#p-' + PID);
  await app.page.getByRole('checkbox', { name: 'Mark day 1 done' }).click();
  await app.data((p) => store.startRound(p, []), PID);
  await app.go('#p-' + PID + '-d1');
  await expect(app.page.getByRole('button', { name: 'Do it again' })).toHaveCount(0);
  await expect(app.page.getByRole('button', { name: 'Mark as done' })).toBeVisible();
  await app.go('#stats');
  await tab(app, 'History').click();
  await app.page.getByRole('button', { name: /^Monday 5 October/ }).click();
  await expect(app.page.locator('.hlist .hwork')).toHaveCount(1);
  await expect(app.page.getByRole('button', { name: /^Remove day/ })).toHaveCount(0);
});
