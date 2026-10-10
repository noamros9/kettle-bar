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
  const chips = app.page.locator('#mmap'); // Phase 30: grouped under Upper / Core / Lower
  await chips.getByRole('button', { name: 'Glutes', exact: true }).click();
  await chips.getByRole('button', { name: 'Hamstrings', exact: true }).click();
  await expect(app.page.locator('.eyebrow').first()).toHaveText('Glutes + Hamstrings');
  const first = await app.page.getByRole('region', { name: /^Main muscle/ }).locator('.exlink').first().getAttribute('data-ex');
  expect(['glutes', 'hamstrings'].every((m) => EX[first].muscles.primary.includes(m))).toBe(true);
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  const kb = await app.page.locator('#mresults .exlink').evaluateAll((els) => els.map((e) => e.dataset.ex));
  expect(kb.length).toBeGreaterThan(0);
  expect(kb.every((id) => EX[id].load === 'kb' && (works(EX[id], 'glutes') || works(EX[id], 'hamstrings')))).toBe(true);
  await chips.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(app.page.locator('#mresults .exlink')).toHaveCount(0);
  await expect(app.page.getByText('Tap a muscle on the body')).toBeVisible();
});

// Phase 30 ticket 3 (210, 211): chips under Upper / Core / Lower; a part's chip picks all its muscles
test('the Muscles page groups its chips; tapping Back picks lats, upper back, traps and neck, and again clears them', async ({ app }, testInfo) => {
  await app.open('#muscles');
  for (const g of ['Upper', 'Core', 'Lower']) await expect(app.page.getByRole('group', { name: `${g} muscles` })).toBeVisible();
  const upper = app.page.getByRole('group', { name: 'Upper muscles' });
  const back = upper.getByRole('button', { name: /^Back/ });
  await back.click();
  await expect(back).toHaveAttribute('aria-pressed', 'true');
  for (const m of ['Lats', 'Upper back', 'Traps', 'Neck']) await expect(upper.getByRole('button', { name: m, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.locator('.eyebrow').first()).toHaveText('Lats + Upper back + Traps + Neck');
  const ids = await app.page.getByRole('region', { name: /^Main muscle/ }).locator('.exlink').evaluateAll((els) => els.map((e) => e.dataset.ex));
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.every((id) => EX[id].muscles.primary.some((m) => ['lats', 'upper_back', 'traps', 'neck'].includes(m)))).toBe(true);
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/muscles-groups.png` });
  await upper.getByRole('button', { name: 'Traps', exact: true }).click(); // one off: Back is no longer all picked
  await expect(back).toHaveAttribute('aria-pressed', 'false');
  await back.click(); // picks the rest
  await expect(back).toHaveAttribute('aria-pressed', 'true');
  await back.click(); // all picked: clears them
  await expect(app.page.locator('#mresults .exlink')).toHaveCount(0);
});

test('the Exercises page: the Thighs chip lists squats and not calf raises, under its Lower label', async ({ app }, testInfo) => {
  await app.open('#exercises');
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^Muscles/ }).click();
  const subs = app.page.getByRole('group', { name: 'Filter by subject' });
  await expect(subs.locator('.fglabel')).toHaveText(['Upper', 'Core', 'Lower', '']);
  await subs.getByRole('button', { name: /^Thighs/ }).click();
  const ids = await app.page.locator('#exresults .exlink').evaluateAll((els) => els.map((e) => e.dataset.ex));
  expect(ids).toContain('goblet_squat');
  expect(ids).not.toContain('calf_raise');
  expect(await app.sidewaysScroll()).toBe(0);
  await app.page.screenshot({ path: `test-results/shots/${testInfo.project.name}/exercises-thighs.png` });
});
