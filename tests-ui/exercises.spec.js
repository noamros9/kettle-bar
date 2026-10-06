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
  const cat = app.page.getByRole('group', { name: 'Filter by family' });
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

// Phase 18 ticket 2 / Phase 21 ticket 1: Couples is a family; its subjects are the sections
test('Couples: its own chip and subject sections, every card drawn with two figures', async ({ app }) => {
  await app.open('#exercises');
  const n = Object.values(EX).filter((e) => e.cat === 'couple').length;
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^Couples/ }).click();
  await expect(cards(app)).toHaveCount(n);
  await expect(app.page.locator('.libcat h2')).toHaveText(['Intercourse', 'Oral', 'Hands', 'Anal', 'Toys', 'Partner work', 'Tease', 'Dares', 'Massage']);
  expect(await app.page.locator('#exresults .exlink svg.fig').evaluateAll((l) => l.every((s) => s.querySelector('circle[fill="var(--fig2)"]')))).toBe(true);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('All shows six family sections; Muscles shows its seven subjects; Chest leaves one section', async ({ app }) => {
  await app.open('#exercises');
  await expect(app.page.locator('.libcat h2')).toHaveText(['Warm-up', 'Stretch & cool-down', 'Muscles', 'Cardio & combat', 'Mind & body', 'Couples']);
  await expect(app.page.getByRole('group', { name: 'Filter by subject' })).toHaveCount(0);
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^Muscles/ }).click();
  await expect(app.page.getByRole('group', { name: 'Filter by subject' }).getByRole('button')).toHaveCount(8);
  await expect(app.page.locator('.libcat h2')).toHaveText(['Chest', 'Back', 'Shoulders', 'Arms', 'Legs & glutes', 'Core & abs', 'Full body']);
  await app.page.getByRole('group', { name: 'Filter by subject' }).getByRole('button', { name: /^Chest/ }).click();
  await expect(app.page.locator('.libcat h2')).toHaveText(['Chest']);
  expect(await app.sidewaysScroll()).toBe(0);
});

// #234: an exercise page's muscle chips open the Exercises page filtered by that muscle; one muscle at a time, in the URL
const works = (m) => (e) => [...e.muscles.primary, ...e.muscles.secondary].includes(m);
const muscleRow = (app) => app.page.getByRole('group', { name: 'Filter by muscle' });

test('a muscle chip on an exercise page filters the Exercises page, keeping the search and equipment', async ({ app }) => {
  await app.open('#exercises');
  await app.page.getByRole('searchbox', { name: 'Search exercises' }).fill('squat');
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  const kbSquats = await cards(app).count();
  await app.page.locator('#exresults [data-ex="goblet_squat"]').click();
  await app.page.getByRole('button', { name: 'Exercises that work Glutes' }).click();
  await expect(app.heading()).toHaveText('Exercises');
  expect(new URL(app.page.url()).hash).toBe('#exercises?muscle=glutes');
  await expect(muscleRow(app).getByRole('button', { name: 'Glutes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('searchbox', { name: 'Search exercises' })).toHaveValue('squat');
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' })).toHaveAttribute('aria-pressed', 'true');
  const ids = await cards(app).evaluateAll((l) => l.map((b) => b.dataset.ex));
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.every((id) => works('glutes')(EX[id]))).toBe(true);

  // one at a time: Hamstrings replaces Glutes (no kettlebell squat works them), tapping it again unpicks it
  await muscleRow(app).getByRole('button', { name: 'Hamstrings' }).click();
  await expect(muscleRow(app).getByRole('button', { name: 'Glutes' })).toHaveAttribute('aria-pressed', 'false');
  await expect(app.page.getByText('No exercises match.')).toBeVisible();
  expect(new URL(app.page.url()).hash).toBe('#exercises?muscle=hamstrings');
  await muscleRow(app).getByRole('button', { name: 'Hamstrings' }).click();
  await expect(cards(app)).toHaveCount(kbSquats);
  expect(new URL(app.page.url()).hash).toBe('#exercises');

  await app.page.goBack(); await app.loaded(); // the picks replaced the URL: Back goes to the exercise
  await expect(app.heading()).toHaveText(EX.goblet_squat.name);
});

test('#exercises?muscle= opened cold shows that muscle; an unknown one shows everything', async ({ app }) => {
  await app.open('#exercises?muscle=glutes');
  await expect(cards(app)).toHaveCount(Object.values(EX).filter(works('glutes')).length);
  await expect(muscleRow(app).getByRole('button', { name: 'Glutes' })).toHaveAttribute('aria-pressed', 'true');
  await app.open('#exercises?muscle=nope');
  await expect(app.page.locator('#excount')).toHaveText(`${total} exercises`);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('Clear all resets the search and every filter', async ({ app }) => {
  await app.open('#exercises?muscle=glutes');
  await expect(app.page.getByRole('button', { name: 'Clear all' })).toBeVisible();
  await app.page.getByRole('searchbox', { name: 'Search exercises' }).fill('squat');
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^Muscles/ }).click();
  await app.page.getByRole('group', { name: 'Filter by subject' }).getByRole('button', { name: /^Legs/ }).click();
  await app.page.getByRole('button', { name: 'Clear all' }).click();
  await expect(app.page.getByRole('searchbox', { name: 'Search exercises' })).toHaveValue('');
  await expect(app.page.locator('#excount')).toHaveText(`${total} exercises`);
  await expect(muscleRow(app).locator('[aria-pressed="true"]')).toHaveCount(0);
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Any equipment' })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('group', { name: 'Filter by subject' })).toHaveCount(0);
  await expect(app.page.getByRole('button', { name: 'Clear all' })).toHaveCount(0);
  expect(new URL(app.page.url()).hash).toBe('#exercises');
});
