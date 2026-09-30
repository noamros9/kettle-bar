// Travel mode (Phase 7 ticket 5): a setting that swaps, on every day page, what needs missing gear, until turned off.
const { test, expect } = require('./fixtures.js');

test('travel mode: bodyweight only swaps the gear out of a day, says so, stays after a reload, and turns off', async ({ app }, testInfo) => {
  await app.open('#settings');
  const group = app.page.getByRole('group', { name: 'Travel mode' });
  await expect(group.getByRole('button', { name: 'Off' })).toHaveAttribute('aria-pressed', 'true');
  await group.getByRole('button', { name: 'Bodyweight only' }).click();
  await expect(group.getByRole('button', { name: 'Bodyweight only' })).toHaveAttribute('aria-pressed', 'true');
  expect(await app.sidewaysScroll()).toBe(0);

  await app.go('#p-three-split-60-d1');
  const note = app.page.locator('.travelnote');
  await expect(note).toContainText('Travel mode: bodyweight only.');
  const swapped = app.page.locator('.notechip', { hasText: 'Swapped for travel' });
  expect(await swapped.count()).toBeGreaterThan(0);
  const left = await app.data(() => days.open('three-split-60', 1).day.blocks.flatMap((b) => b.items)
    .filter((it) => !it.travelMissing && (KBEx.EX[it.ex].load || (KBEx.EX[it.ex].equip || []).includes('bar'))).length);
  expect(left).toBe(0);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('travel-day.png') });

  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(app.page.locator('.travelnote')).toBeVisible();
  await app.page.locator('.travelnote').getByRole('button', { name: 'Change' }).click();
  await expect(app.heading()).toHaveText('Settings');
  await app.page.getByRole('group', { name: 'Travel mode' }).getByRole('button', { name: 'Off' }).click();
  await app.go('#p-three-split-60-d1');
  await expect(app.page.locator('.travelnote')).toHaveCount(0);
  await expect(app.page.locator('.notechip', { hasText: 'Swapped for travel' })).toHaveCount(0);
});
