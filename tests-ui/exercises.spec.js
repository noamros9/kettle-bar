// The Exercises page (Phase 8 ticket 3): search by name, muscle or cue, and chips by category and equipment.
const { test, expect } = require('./fixtures.js');
const { EX } = require('../exercises.js');

const total = Object.keys(EX).length;
const cards = (app) => app.page.locator('#exresults .exlink');

test('type "hip": hip thrusts, hip CARs and hip airplanes show, the field keeps focus, the counter follows', async ({ app }) => {
  await app.open('#exercises');
  await expect(app.page.locator('#excount')).toHaveText(`${total} exercises`);
  const field = app.page.getByRole('searchbox', { name: 'Search exercises' });
  await field.click();
  await field.pressSequentially('hip');
  await expect(field).toBeFocused();
  for (const id of ['hip_thrust', 'hip_cars', 'hip_airplane']) await expect(app.page.locator(`#exresults [data-ex="${id}"]`)).toHaveCount(1);
  const n = await cards(app).count();
  expect(n).toBeLessThan(total);
  await expect(app.page.locator('#excount')).toHaveText(`${n} of ${total} exercises`);
  expect(await app.sidewaysScroll()).toBe(0);

  await app.page.locator('#exresults [data-ex="hip_thrust"]').click();
  await expect(app.heading()).toHaveText(EX.hip_thrust.name);
  await app.page.goBack(); await app.loaded();
  await expect(app.page.getByRole('searchbox', { name: 'Search exercises' })).toHaveValue('hip');
  await expect(cards(app)).toHaveCount(n);
});

test('the Kettlebell chip keeps only kettlebell exercises; a category narrows further; nothing found says so', async ({ app }) => {
  await app.open('#exercises');
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  const kb = Object.values(EX).filter((e) => e.load === 'kb');
  await expect(cards(app)).toHaveCount(kb.length);
  const cat = app.page.getByRole('group', { name: 'Filter by category' });
  await expect(cat.getByRole('button', { name: /^All/ })).toContainText(String(kb.length));
  const first = cat.locator('.fchip').nth(1);
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  expect(await cards(app).count()).toBeLessThanOrEqual(kb.length);
  await app.page.getByRole('searchbox', { name: 'Search exercises' }).fill('zzzz');
  await expect(app.page.getByText('No exercises match.')).toBeVisible();
  await expect(app.page.locator('#excount')).toHaveText(`0 of ${total} exercises`);
});

test('the Exercises page points to the Muscles page', async ({ app }) => {
  await app.open('#exercises');
  await app.page.getByRole('button', { name: /Find exercises by muscle/ }).click();
  await expect(app.heading()).toHaveText('Muscles');
});

// Phase 18 ticket 2: the couple exercises have their own chip and section, each drawn with two figures
test('Couples: its own chip and section, every card drawn with two figures', async ({ app }) => {
  await app.open('#exercises');
  const n = Object.values(EX).filter((e) => e.cat === 'couple').length;
  await app.page.getByRole('group', { name: 'Filter by category' }).getByRole('button', { name: /^Couples/ }).click();
  await expect(cards(app)).toHaveCount(n);
  await expect(app.page.locator('.libcat h2')).toHaveText(['Couples']);
  expect(await app.page.locator('#exresults .exlink svg.fig').evaluateAll((l) => l.every((s) => s.querySelector('circle[fill="var(--fig2)"]')))).toBe(true);
  expect(await app.sidewaysScroll()).toBe(0);
});
