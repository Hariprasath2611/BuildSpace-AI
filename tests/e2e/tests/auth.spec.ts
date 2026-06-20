import { test, expect } from '@playwright/test';

test.describe('Authentication & RBAC', () => {
  test('Admin user can login successfully', async ({ page }) => {
    // Mock the backend API call if backend is not running
    await page.route('**/api/auth/login', async route => {
      const json = { token: 'mock-token-admin', user: { name: 'Apex Builders Admin', role: 'ADMIN' } };
      await route.fulfill({ json });
    });

    await page.goto('file://' + process.cwd() + '/public/index.html');
    await page.fill('input[type="email"]', 'admin@apexbuilders.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome, Apex Builders Admin')).toBeVisible();
  });

  test('Invalid login shows error message', async ({ page }) => {
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({ status: 401, json: { message: 'Invalid credentials' } });
    });

    await page.goto('file://' + process.cwd() + '/public/index.html');
    await page.fill('input[type="email"]', 'wrong@domain.com');
    await page.fill('input[type="password"]', 'badpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
