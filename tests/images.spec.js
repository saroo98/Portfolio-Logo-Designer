// @ts-check
/**
 * images.spec.js — Tests 37–40: work-image attributes + reveal.
 *   37 all-images-have-alt    — 11 imgs, alt length > 5 each
 *   38 lazy-decoding-attrs    — loading=lazy + decoding=async on all
 *   39 width-height-attrs     — width=2000 height=1000 (CLS prevention)
 *   40 in-view-class-applied  — scrolling image 5 into view triggers .in-view
 */
const { test, expect } = require('./fixtures');

test.describe('Images', () => {
  test('37 all-images-have-alt', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('.work img');
    await expect(imgs).toHaveCount(11);
    const alts = await imgs.evaluateAll((nodes) => nodes.map((n) => n.getAttribute('alt')));
    for (const alt of alts) {
      expect(alt, 'alt text non-empty').toBeTruthy();
      expect((alt || '').length).toBeGreaterThan(5);
    }
  });

  test('38 lazy-decoding-attrs', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('.work img');
    const data = await imgs.evaluateAll((nodes) =>
      nodes.map((n) => ({ loading: n.getAttribute('loading'), decoding: n.getAttribute('decoding') }))
    );
    for (const d of data) {
      expect(d.loading).toBe('lazy');
      expect(d.decoding).toBe('async');
    }
  });

  test('39 width-height-attrs', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('.work img');
    const data = await imgs.evaluateAll((nodes) =>
      nodes.map((n) => ({ w: n.getAttribute('width'), h: n.getAttribute('height') }))
    );
    for (const d of data) {
      expect(d.w).toBe('2000');
      expect(d.h).toBe('1000');
    }
  });

  test('40 in-view-class-applied', async ({ page }) => {
    await page.goto('/');
    const target = page.locator('.work img').nth(4);
    await target.scrollIntoViewIfNeeded();
    await expect(target).toHaveClass(/in-view/, { timeout: 3000 });
  });
});
