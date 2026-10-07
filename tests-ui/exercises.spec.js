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
  await app.page.getByRole('button', { name: /^Equipment:/ }).click();
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  await expect(app.page.getByRole('button', { name: /^Equipment:/ })).toHaveText(/Equipment:\s*Kettlebell\s*▾/);
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' })).toHaveCount(0);
  const kb = Object.values(EX).filter((e) => e.load === 'kb');
  await expect(cards(app)).toHaveCount(kb.length);
  const cat = app.page.getByRole('group', { name: 'Filter by family' });
  await expect(cat.getByRole('button', { name: /^All/ })).toContainText(String(kb.length));
  const first = cat.locator('.ftab').nth(1);
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
  // Every kind with exercises, in app/library.js's order: catalogue 13 adds kinds ticket by ticket.
  const order = [['fuck', 'Intercourse'], ['oral', 'Oral'], ['hands', 'Hands'], ['anal', 'Anal'], ['toys', 'Toys'], ['partner', 'Partner work'],
    ['tease', 'Strip and tease'], ['dare', 'Dares'], ['massage', 'Massage'], ['rough', 'Rough'], ['kink', 'Kink-lite'], ['body', 'Body play'],
    ['rim', 'Rimming'], ['edging', 'Edging'], ['shower', 'Shower and bath'], ['pool', 'Pool'], ['hottub', 'Hot tub'], ['balcony', 'Balcony'],
    ['doorframe', 'Doorframe']];
  const subs = new Set(Object.values(EX).filter((e) => e.cat === 'couple').map((e) => e.sub));
  await expect(app.page.locator('.libcat h2')).toHaveText(order.filter(([k]) => subs.has(k)).map(([, name]) => name));
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

// #234: an exercise page's muscle chips open the Exercises page filtered by that muscle; one muscle at a time, in the URL.
// Phase 21 ticket 2: the chips sit behind "Muscle: Any ▾"; the open menu is page state and never the URL.
const works = (m) => (e) => [...e.muscles.primary, ...e.muscles.secondary].includes(m);
const muscleRow = (app) => app.page.getByRole('group', { name: 'Filter by muscle' });
const muscleLine = (app) => app.page.getByRole('button', { name: /^Muscle:/ });
const equipLine = (app) => app.page.getByRole('button', { name: /^Equipment:/ });

test('Muscle chips stay hidden until the line is opened; picking Glutes closes it, names it and filters', async ({ app }) => {
  await app.open('#exercises');
  await expect(muscleLine(app)).toHaveText(/Muscle:\s*Any\s*▾/);
  await expect(equipLine(app)).toHaveText(/Equipment:\s*Any\s*▾/);
  await expect(muscleLine(app)).toHaveAttribute('aria-expanded', 'false');
  await expect(muscleRow(app)).toHaveCount(0);
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' })).toHaveCount(0);
  await expect(app.page.locator('#exresults .ftabs')).toHaveAttribute('aria-label', 'Filter by family');

  await muscleLine(app).click();
  await expect(muscleLine(app)).toHaveAttribute('aria-expanded', 'true');
  await expect(muscleRow(app).getByRole('button', { name: 'Glutes' })).toBeVisible();
  expect(new URL(app.page.url()).hash).toBe('#exercises');

  await equipLine(app).click(); // one menu at a time
  await expect(muscleRow(app)).toHaveCount(0);
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' })).toBeVisible();
  await equipLine(app).click(); // the line again closes it
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' })).toHaveCount(0);
  expect(new URL(app.page.url()).hash).toBe('#exercises');

  await muscleLine(app).click();
  await muscleRow(app).getByRole('button', { name: 'Glutes' }).click();
  await expect(muscleRow(app)).toHaveCount(0);
  await expect(muscleLine(app)).toHaveText(/Muscle:\s*Glutes\s*▾/);
  await expect(muscleLine(app)).toHaveAttribute('aria-expanded', 'false');
  await expect(cards(app)).toHaveCount(Object.values(EX).filter(works('glutes')).length);
  expect(new URL(app.page.url()).hash).toBe('#exercises?muscle=glutes');

  await muscleLine(app).click();
  await muscleRow(app).getByRole('button', { name: 'Glutes' }).click(); // tapping the pick again unpicks it
  await expect(muscleLine(app)).toHaveText(/Muscle:\s*Any\s*▾/);
  await expect(cards(app)).toHaveCount(total);
  expect(new URL(app.page.url()).hash).toBe('#exercises');
});

test('a muscle chip on an exercise page filters the Exercises page, keeping the search and equipment', async ({ app }) => {
  await app.open('#exercises');
  await app.page.getByRole('searchbox', { name: 'Search exercises' }).fill('squat');
  await equipLine(app).click();
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  const kbSquats = await cards(app).count();
  await muscleLine(app).click(); // open as we leave: the link must land with the menu closed
  await app.page.locator('#exresults [data-ex="goblet_squat"]').click();
  await app.page.getByRole('button', { name: 'Exercises that work Glutes' }).click();
  await expect(app.heading()).toHaveText('Exercises');
  expect(new URL(app.page.url()).hash).toBe('#exercises?muscle=glutes');
  await expect(muscleLine(app)).toHaveText(/Muscle:\s*Glutes\s*▾/);
  await expect(muscleLine(app)).toHaveAttribute('aria-expanded', 'false');
  await expect(muscleRow(app)).toHaveCount(0);
  await muscleLine(app).click();
  await expect(muscleRow(app).getByRole('button', { name: 'Glutes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('searchbox', { name: 'Search exercises' })).toHaveValue('squat');
  await equipLine(app).click();
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' })).toHaveAttribute('aria-pressed', 'true');
  const ids = await cards(app).evaluateAll((l) => l.map((b) => b.dataset.ex));
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.every((id) => works('glutes')(EX[id]))).toBe(true);

  // one at a time: Hamstrings replaces Glutes (no kettlebell squat works them), tapping it again unpicks it
  await muscleLine(app).click();
  await muscleRow(app).getByRole('button', { name: 'Hamstrings' }).click();
  await expect(muscleRow(app)).toHaveCount(0);
  await muscleLine(app).click();
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
  await expect(muscleLine(app)).toHaveText(/Muscle:\s*Glutes\s*▾/);
  await expect(muscleLine(app)).toHaveAttribute('aria-expanded', 'false');
  await expect(muscleRow(app)).toHaveCount(0);
  await muscleLine(app).click();
  await expect(muscleRow(app).getByRole('button', { name: 'Glutes' })).toHaveAttribute('aria-pressed', 'true');
  await app.open('#exercises?muscle=nope');
  await expect(app.page.locator('#excount')).toHaveText(`${total} exercises`);
  expect(await app.sidewaysScroll()).toBe(0);
});

test('Clear all resets the search and every filter', async ({ app }) => {
  await app.open('#exercises?muscle=glutes');
  await expect(app.page.getByRole('button', { name: 'Clear all' })).toBeVisible();
  await app.page.getByRole('searchbox', { name: 'Search exercises' }).fill('squat');
  await equipLine(app).click();
  await app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Kettlebell' }).click();
  await app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^Muscles/ }).click();
  await app.page.getByRole('group', { name: 'Filter by subject' }).getByRole('button', { name: /^Legs/ }).click();
  await muscleLine(app).click();
  await expect(muscleRow(app)).toBeVisible();
  await app.page.getByRole('button', { name: 'Clear all' }).click();
  await expect(app.page.getByRole('searchbox', { name: 'Search exercises' })).toHaveValue('');
  await expect(app.page.locator('#excount')).toHaveText(`${total} exercises`);
  await expect(muscleRow(app)).toHaveCount(0);
  await expect(muscleLine(app)).toHaveText(/Muscle:\s*Any\s*▾/);
  await expect(equipLine(app)).toHaveText(/Equipment:\s*Any\s*▾/);
  await muscleLine(app).click();
  await expect(muscleRow(app).locator('[aria-pressed="true"]')).toHaveCount(0);
  await equipLine(app).click();
  await expect(app.page.getByRole('group', { name: 'Filter by equipment' }).getByRole('button', { name: 'Any equipment' })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('group', { name: 'Filter by family' }).getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(app.page.getByRole('group', { name: 'Filter by subject' })).toHaveCount(0);
  await expect(app.page.getByRole('button', { name: 'Clear all' })).toHaveCount(0);
  expect(new URL(app.page.url()).hash).toBe('#exercises');
});
