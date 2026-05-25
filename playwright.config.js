// @ts-check
/**
 * playwright.config.js — Playwright Test runner config.
 *
 * - testDir          : ./tests (8 spec files, 50 named tests + axe + lighthouse)
 * - webServer        : auto-launches `npx http-server . -p 4173` for tests;
 *                      reused if already running outside CI
 * - projects         : `chromium`     (Desktop Chrome @ 1280×800)
 *                      `mobile-chrome` (Pixel 5 emulation, 393×851)
 * - trace/screenshot : retained on failure only
 * - retries          : 1 in CI, 0 locally
 */
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npx http-server . -p 4173 -c-1 --silent',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
