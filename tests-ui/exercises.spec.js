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

test('By muscle: tap glutes and hamstrings on the map; exercises with both as main muscles lead; chips and Clear work too', async ({ app }) => {
  await app.open('#exercises');
  await app.page.getByRole('button', { name: /By muscle:/ }).click();
  const map = app.page.locator('.mmpick');
  await expect(map.locator('svg')).toBeVisible();
  await map.locator('[data-m="glutes"]').first().click();
  await map.locator('[data-m="hamstrings"]').first().click();
  const chips = app.page.getByRole('group', { name: 'Muscles' });
  await expect(chips.getByRole('button', { name: 'Glutes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(chips.getByRole('button', { name: 'Hamstrings' })).toHaveAttribute('aria-pressed', 'true');
  await expect(map.locator('[data-m="glutes"].mm-l4').first()).toBeVisible();
  await expect(app.page.locator('#exresults h2')).toHaveText('Best for Glutes + Hamstrings');
  const first = await cards(app).first().getAttribute('data-ex');
  expect(['glutes', 'hamstrings'].every((m) => EX[first].muscles.primary.includes(m)), `${first} works both as main muscles`).toBe(true);
  await expect(app.page.locator('#exresults [data-ex="db_rdl"]')).toHaveCount(1);
  await expect(app.page.getByRole('button', { name: /By muscle:/ })).toContainText('Glutes, Hamstrings');
  expect(await app.sidewaysScroll()).toBe(0);
  await chips.getByRole('button', { name: 'Hamstrings' }).click();
  await expect(app.page.locator('#exresults h2')).toHaveText('Best for Glutes');
  await chips.getByRole('button', { name: 'Clear' }).click();
  await expect(cards(app)).toHaveCount(total);
});
