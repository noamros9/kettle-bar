// Phone UI tests (ADR 4): a 390 × 844 phone in light and dark mode. No desktop runs: the app is used on a phone.
const { defineConfig } = require('@playwright/test');

const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

module.exports = defineConfig({
  testDir: 'tests-ui',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'list', // github: failures show as run annotations
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  projects: [
    { name: 'phone-light', use: { ...phone, colorScheme: 'light' } },
    { name: 'phone-dark', use: { ...phone, colorScheme: 'dark' } },
  ],
  webServer: { command: 'npm run -s build && node scripts/serve.js 4173', url: 'http://localhost:4173/index.html', reuseExistingServer: !process.env.CI, timeout: 60000 },
});
