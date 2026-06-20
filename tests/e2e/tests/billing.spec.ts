import { test, expect } from '@playwright/test';

test.describe('Billing & Subscriptions', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().addInitScript(() => {
      window.localStorage.setItem('auth_token', 'mock-token');
    });
  });

  test('Upgrade subscription and generate invoice', async ({ page }) => {
    await page.route('**/api/billing/upgrade', async route => {
      await route.fulfill({ json: { success: true, plan: 'ENTERPRISE', invoiceUrl: '/mock/invoice.pdf' } });
    });

    await page.goto('file://' + process.cwd() + '/public/index.html');
    await page.click('button:has-text("Upgrade to Enterprise")');
    
    // Simulate Razorpay popup success
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('razorpay_success', { detail: { paymentId: 'pay_mock123' } }));
    });

    await expect(page.locator('text=Successfully upgraded to ENTERPRISE')).toBeVisible();
    await expect(page.locator('a:has-text("Download Invoice")')).toHaveAttribute('href', '/mock/invoice.pdf');
  });
});
