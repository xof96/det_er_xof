import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('shows validation errors when empty', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText(/add your name/i)).toBeVisible();
    await expect(page.getByText(/add an email/i)).toBeVisible();
    await expect(page.getByText(/write a message/i)).toBeVisible();
  });

  test('submits a valid message (API intercepted)', async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      const body = route.request().postDataJSON();
      expect(body.name).toBe('Ada Lovelace');
      expect(body.email).toBe('ada@example.com');
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, delivered: false, message: 'Message received.' }),
      });
    });

    await page.goto('/contact');
    await page.getByLabel('Name').fill('Ada Lovelace');
    await page.getByLabel('Email').fill('ada@example.com');
    await page.getByLabel('Message').fill('Hello — I really enjoyed exploring the atlas!');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/message sent/i)).toBeVisible();
  });
});

test.describe('Reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('carousel still works with reduced motion', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('listbox').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/projects$/);
  });
});
