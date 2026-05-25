// @ts-check
/**
 * load.spec.js — Tests 01–08: page load & document structure.
 *   01 page-loads-200       — root URL returns HTTP 200
 *   02 doctype-and-lang     — <!doctype html>, lang="en", data-theme valid
 *   03 title-text           — exact <title> string
 *   04 meta-description     — meta description content matches handoff copy
 *   05 viewport-meta        — width=device-width, initial-scale=1
 *   06 main-element         — exactly one <main id="top">
 *   07 hero-h1-content      — H1 contains "Maryam Ansari," and "logo designer."
 *   08 footer-renders       — copyright + "United Kingdom"
 */
const { test, expect } = require('./fixtures');

const EXPECTED_DESCRIPTION =
  'Maryam Ansari — a quiet practice of logos and marks. Based in the UK. Selected work, 2010—2024.';

test.describe('Page load & structure', () => {
  test('01 page-loads-200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response, 'response object should exist').not.toBeNull();
    expect(response.status()).toBe(200);
  });

  test('02 doctype-and-lang', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html.toLowerCase().startsWith('<!doctype html>')).toBe(true);
    const htmlEl = page.locator('html');
    await expect(htmlEl).toHaveAttribute('lang', 'en');
    const dataTheme = await htmlEl.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(dataTheme);
  });

  test('03 title-text', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Maryam Ansari — Logo Designer');
  });

  test('04 meta-description', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', EXPECTED_DESCRIPTION);
  });

  test('05 viewport-meta', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="viewport"]');
    const content = await meta.getAttribute('content');
    expect(content).toMatch(/width=device-width/);
    expect(content).toMatch(/initial-scale=1/);
  });

  test('06 main-element', async ({ page }) => {
    await page.goto('/');
    const mains = page.locator('main');
    await expect(mains).toHaveCount(1);
    await expect(mains.first()).toHaveAttribute('id', 'top');
  });

  test('07 hero-h1-content', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('section.hero h1');
    await expect(h1).toHaveCount(1);
    const text = (await h1.textContent()) || '';
    expect(text).toContain('Maryam Ansari,');
    expect(text).toContain('logo designer.');
  });

  test('08 footer-renders', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer.foot');
    await expect(footer).toBeVisible();
    const text = (await footer.textContent()) || '';
    expect(text).toContain('© 2010 — 2024');
    expect(text).toContain('United Kingdom');
  });
});
