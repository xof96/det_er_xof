import { test, expect } from '@playwright/test';

test.describe('Home carousel navigation', () => {
  test('home shows the spatial carousel with all sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option', { selected: true })).toContainText('Projects');
  });

  test('arrow keys move through sections', async ({ page }) => {
    await page.goto('/');
    const listbox = page.getByRole('listbox');
    await listbox.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('option', { selected: true })).toContainText('AI Lab');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('option', { selected: true })).toContainText('Projects');
  });

  test('open a section and return to the atlas', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('listbox').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Projects');
    await page.getByRole('link', { name: /back to the atlas/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('listbox')).toBeVisible();
  });
});

test.describe('Projects → case study → back', () => {
  test('open Redactame case study from projects', async ({ page }) => {
    await page.goto('/projects');
    await page.getByRole('link', { name: /Redactame/ }).first().click();
    await expect(page).toHaveURL(/\/projects\/redactame$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Redactame');
    await expect(page.getByText('The problem', { exact: false })).toBeVisible();
    await page.getByRole('link', { name: /All projects/i }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });
});

test.describe('Photography gallery', () => {
  test('open a photo in the lightbox and navigate', async ({ page }) => {
    await page.goto('/photography');
    await page.getByRole('button', { name: /Open .* in viewer/i }).first().click();
    const dialog = page.getByRole('dialog', { name: /photo viewer/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('filter to a single collection', async ({ page }) => {
    await page.goto('/photography');
    await page.getByRole('link', { name: 'Open Roads' }).click();
    await expect(page).toHaveURL(/\/photography\/open-roads$/);
  });
});
