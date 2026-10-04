// The Muscles page (2 Oct, Noam): the body front and back always shown; tap muscles for every exercise that works them,
// "Main muscle" then "Also works", after the five programs that train them most.
const { test, expect } = require('./fixtures.js');
const { EX } = require('../exercises.js');

const works = (e, m) => e.muscles.primary.includes(m) || e.muscles.secondary.includes(m);

test('Muscles is a header tab: the body shows at once; tap glutes for its main and secondary exercises', async ({ app }) => {
  await app.open('#programs');
  await app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Muscles' }).click();
  await expect(app.heading()).toHaveText('Muscles');
  await expect(app.page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Muscles' })).toHaveAttribute('aria-current', 'page');
  const map = app.page.locator('.mmpick');
  await expect(map.locator('svg')).toBeVisible();
  await map.locator('[data-m="glutes"]').first().click();
  await expect(app.page.locator('[data-m="glutes"].mm-l4').first()).toBeVisible();
  const main = app.page.getByRole('region', { name: /^Main muscle/ }), also = app.page.getByRole('region', { name: /^Also works/ });
  const solo = Object.values(EX).filter((e) => e.cat !== 'couple'); // couple exercises (Phase 18) aren't on the Muscles page
  const nMain = solo.filter((e) => e.muscles.primary.includes('glutes')).length;
  const nAlso = solo.filter((e) => !e.muscles.primary.includes('glutes') && e.muscles.secondary.includes('glutes')).length;
  await expect(main.locator('.exlink')).toHaveCount(nMain);
  await expect(also.locator('.exlink')).toHaveCount(nAlso);
  await expect(main.locator('[data-ex="hip_thrust"]')).toHaveCount(1);
  await expect(app.page.locator('#mresults .wncard')).toHaveCount(5);
  expect(await app.sidewaysScroll()).toBe(0);
  await main.locator('[data-ex="hip_thrust"]').click();
  await expect(app.heading()).toHaveText(EX.hip_thrust.name);
});

test('several muscles combine; the equipment chips narrow; chips and Clear work', async ({ app }) => {
  await app.open('#muscles');
  const chips = app.page.getByRole('group', { name: 'Muscles' });
  await chips.getByRole('button', { name: 'Glutes' }).click();
  await chips.getByRole('button', { name: 'Hamstrings' }).click();
  await expect(app.page.locator('.eyebrow').first()).toHaveText('Glutes + Hamstrings');
  const first = await app.page.getByRole('region', { name: /^Main muscle/ }).locator('.exlink').first().getAttribute('data-ex');
  expect(['glutes', 'hamstrings'].every((m) => EX[first].muscles.primary.includes(m))).toBe(true);
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  const kb = await app.page.locator('#mresults .exlink').evaluateAll((els) => els.map((e) => e.dataset.ex));
  expect(kb.length).toBeGreaterThan(0);
  expect(kb.every((id) => EX[id].load === 'kb' && (works(EX[id], 'glutes') || works(EX[id], 'hamstrings')))).toBe(true);
  await chips.getByRole('button', { name: 'Clear' }).click();
  await expect(app.page.locator('#mresults .exlink')).toHaveCount(0);
  await expect(app.page.getByText('Tap a muscle on the body')).toBeVisible();
});
