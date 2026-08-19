import { test, expect } from '@playwright/test';

test.describe('Mobile layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home has no horizontal overflow and the carousel works', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('listbox')).toBeVisible();

    // No accidental horizontal scrolling.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);

    // Buttons remain usable on touch-sized screens.
    await page.getByRole('button', { name: 'Next section' }).click();
    await expect(page.getByRole('option', { selected: true })).toContainText('AI Lab');
  });

  test('a section page reads cleanly on mobile', async ({ page }) => {
    await page.goto('/photography');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Photography');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
