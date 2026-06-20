import { test, expect } from '@playwright/test';

test.describe('Projects & Digital Twin', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.context().addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token');
    });
  });

  test('Create a new construction project', async ({ page }) => {
    await page.route('**/api/projects', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: { id: 'proj-123', name: 'Downtown Skyscraper' } });
      } else {
        await route.continue();
      }
    });

    await page.goto('file://' + process.cwd() + '/public/index.html');
    await page.fill('input[name="projectName"]', 'Downtown Skyscraper');
    await page.fill('input[name="location"]', 'Bangalore, India');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/projects/proj-123');
    await expect(page.locator('text=Downtown Skyscraper')).toBeVisible();
  });
});
