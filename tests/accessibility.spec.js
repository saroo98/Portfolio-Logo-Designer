// @ts-check
const { test, expect } = require('./fixtures');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility', () => {
  test('41 skip-link-exists', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a.skip-link, a[href="#top"][data-skip], a[href="#main"]').first();
    await expect(skip, 'skip link present').toHaveCount(1);
    const href = await skip.getAttribute('href');
    expect(href).toMatch(/^#(top|main)$/);
    const isHiddenOffscreen = await skip.evaluate((el) => {
      const cs = getComputedStyle(el);
      const clip = cs.clipPath || cs.clip || '';
      const rect = el.getBoundingClientRect();
      const offscreen = rect.top < -10 || rect.left < -10 || rect.width <= 1 || rect.height <= 1;
      return clip.includes('inset(') || clip.includes('rect(') || offscreen;
    });
    expect(isHiddenOffscreen, 'skip link visually hidden until focused').toBe(true);
    await skip.focus();
    const focusedVisible = await skip.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 10 && rect.height > 10 && rect.top >= -2;
    });
    expect(focusedVisible, 'skip link visible on focus').toBe(true);
  });

  test('42 lightbox-focus-trap', async ({ page }) => {
    await page.goto('/');
    await page.locator('.work:nth-of-type(1) > figure').click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    const allowed = new Set(['lb-close', 'lb-prev', 'lb-next']);
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      const focusedId = await page.evaluate(() => document.activeElement && document.activeElement.id);
      expect(allowed.has(focusedId), `tab ${i + 1} focus inside dialog (got: ${focusedId})`).toBe(true);
    }
  });

  test('43 lightbox-focus-return', async ({ page }) => {
    await page.goto('/');
    const fig = page.locator('.work:nth-of-type(3) > figure');
    await fig.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
    const focusBack = await page.evaluate(() => {
      const figs = document.querySelectorAll('.work > figure');
      return document.activeElement === figs[2];
    });
    expect(focusBack, 'focus returned to invoking figure').toBe(true);
  });

  test('44 body-scroll-lock-lightbox', async ({ page }) => {
    await page.goto('/');
    await page.locator('.work:nth-of-type(1) > figure').click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');
  });

  test('45 body-scroll-lock-mobile-menu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'mobile menu requires <= 720px viewport');
    await page.goto('/');
    await page.click('#burger');
    await expect(page.locator('body')).toHaveClass(/menu-open/);
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');
  });

  test('46 theme-aria-pressed', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('#theme');
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await btn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  test('axe-bonus: zero serious/critical violations across key states', async ({ page }) => {
    await page.goto('/');

    const checkState = async (label) => {
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const bad = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );
      if (bad.length) {
        const summary = bad
          .map((v) => `  - ${v.id} (${v.impact}): ${v.help}`)
          .join('\n');
        throw new Error(`axe found ${bad.length} serious/critical violations at "${label}":\n${summary}`);
      }
    };

    await checkState('initial load');
    // open lightbox
    await page.locator('.work:nth-of-type(1) > figure').click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await checkState('lightbox open');
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
  });
});
