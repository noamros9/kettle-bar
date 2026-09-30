// Shorter today (Phase 7 ticket 4): "Short on time?" on a day page trims it to about 20 minutes; marked done, Stats
// count what it was trimmed to; it stays after a reload, and a tap brings the full day back.
const { test, expect } = require('./fixtures.js');

test('short on time: the day trims to about 20 minutes, stays so after a reload, counts as such, and comes back', async ({ app }, testInfo) => {
  const P = 'three-split-60';
  await app.open('#p-' + P);
  const n = await app.data((pid) => programs.get(pid).days.find((d) => d.est >= 30).day, P);
  const full = await app.data(([pid, d]) => programs.day(pid, d).est, [P, n]);
  await app.go(`#p-${P}-d${n}`);
  const btn = app.page.locator('.shortbtn');
  await expect(btn).toContainText('Short on time?');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toContainText(`instead of ${full}`);
  const est = await app.data(([pid, d]) => days.open(pid, d).day.est, [P, n]);
  expect(est).toBeGreaterThanOrEqual(18); expect(est).toBeLessThanOrEqual(22);
  await expect(app.page.locator('.meta')).toContainText(`About ${est} min`);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: testInfo.outputPath('short-day.png') });

  await app.page.reload(); await app.heading().waitFor(); await app.loaded();
  await expect(app.page.locator('.shortbtn')).toHaveAttribute('aria-pressed', 'true');
  await app.page.getByRole('button', { name: 'Mark as done' }).first().click();
  await app.go('#stats');
  await expect(app.page.getByRole('group', { name: 'Workout minutes' })).toContainText(String(est));

  await app.go(`#p-${P}-d${n}`);
  await app.page.locator('.shortbtn').click();
  await expect(app.page.locator('.shortbtn')).toHaveAttribute('aria-pressed', 'false');
  await expect(app.page.locator('.meta')).toContainText(`About ${full} min`);
});

test('a day already about 20 minutes has no switch', async ({ app }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone-light', 'theme-independent');
  await app.open('#p-twenty-flat');
  const n = await app.data(() => programs.get('twenty-flat').days.find((d) => d.est <= 22).day);
  await app.go(`#p-twenty-flat-d${n}`);
  await expect(app.page.locator('.whead')).toBeVisible();
  await expect(app.page.locator('.shortbtn')).toHaveCount(0);
});
