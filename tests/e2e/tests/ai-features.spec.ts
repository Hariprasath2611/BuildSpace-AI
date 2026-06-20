import { test, expect } from '@playwright/test';

test.describe('AI Features & Vision', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token');
    });
  });

  test('AI Copilot can answer questions', async ({ page }) => {
    await page.route('**/api/ai/copilot/chat', async route => {
      await route.fulfill({ json: { response: 'The concrete curing time for C30 grade is typically 28 days for full strength.' } });
    });

    await page.goto('file://' + process.cwd() + '/public/index.html');
    await page.fill('textarea[name="prompt"]', 'What is the curing time for C30 concrete?');
    await page.click('button:has-text("Send")');

    await expect(page.locator('text=The concrete curing time for C30 grade is typically 28 days for full strength.')).toBeVisible();
  });
});
