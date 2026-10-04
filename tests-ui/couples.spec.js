// Phase 18 ticket 3: a couple session on the phone. The positions block runs hands-free like any flow, each position
// drawn with two figures; Couples sits on the After dark tab; Help me pick has a goal for two.
const { test, expect } = require('./fixtures.js');
const { CONFIGS } = require('../program-builder.js');

test('a Sweat Together day: partner work, tease and positions; the positions run with two figures', async ({ app }) => {
  await app.page.clock.install();
  await app.open('#programs');
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: 'After dark' }).click();
  await app.page.getByRole('group', { name: 'Filter by subject' }).getByRole('button', { name: /^Couples/ }).click();
  await expect(app.page.locator('.pgroup h2')).toHaveText(['Couples']);
  await expect(app.page.locator('.eyebrow').first()).toHaveText(`Couples · ${CONFIGS.filter((c) => c.subject === 'Couples').length} programs`);
  await app.page.locator('[data-open-prog="sweat-together"]').click();
  await app.go('#p-sweat-together-d1');
  const d = await app.data(() => programs.day('sweat-together', 1).blocks.map((b) => b.title));
  expect(d).toEqual(['Partner circuit', 'Tease', 'Positions']);
  await expect(app.page.locator('.block .fmt')).toHaveText(['Circuits', 'Guided flow', 'Guided flow']);
  await app.page.locator('[data-run="2"]').click();
  await app.page.clock.runFor(6000);
  await expect(app.page.locator('#tfig svg.fig circle[fill="var(--fig2)"]')).toHaveCount(1);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('Help me pick: "For two, after dark" picks only couple programs', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('button', { name: 'Help me pick' }).click();
  const sheet = app.page.getByRole('dialog', { name: 'Help me pick' });
  await sheet.getByRole('group', { name: 'Goal' }).getByRole('button', { name: 'For two, after dark' }).click();
  await sheet.getByRole('group', { name: 'Minutes' }).getByRole('button', { name: 'About 30 min' }).click();
  await sheet.getByRole('group', { name: 'Gear' }).getByRole('button', { name: 'No equipment' }).click();
  const names = (await sheet.locator('.pickres b').allTextContents()).map((t) => t.trim());
  const ids = names.map((n) => CONFIGS.find((c) => c.name === n).id);
  expect(ids.length).toBeGreaterThan(0);
  ids.forEach((id) => expect(CONFIGS.find((c) => c.id === id).subject).toBe('Couples'));
  expect(await app.sidewaysScroll()).toBe(0);
});
