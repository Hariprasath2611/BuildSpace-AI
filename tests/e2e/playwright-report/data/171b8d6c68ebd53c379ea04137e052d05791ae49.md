# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication & RBAC >> Invalid login shows error message
- Location: tests\auth.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Invalid credentials')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Invalid credentials')

```

```yaml
- textbox: wrong@domain.com
- textbox: badpass
- button "Login"
- text: Welcome, Apex Builders Admin
- textbox
- textbox
- button "Create Project"
- textbox
- button "Send"
- text: The concrete curing time for C30 grade is typically 28 days for full strength.
- button "Upgrade to Enterprise"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication & RBAC', () => {
  4  |   test('Admin user can login successfully', async ({ page }) => {
  5  |     // Mock the backend API call if backend is not running
  6  |     await page.route('**/api/auth/login', async route => {
  7  |       const json = { token: 'mock-token-admin', user: { name: 'Apex Builders Admin', role: 'ADMIN' } };
  8  |       await route.fulfill({ json });
  9  |     });
  10 | 
  11 |     await page.goto('file://' + process.cwd() + '/public/index.html');
  12 |     await page.fill('input[type="email"]', 'admin@apexbuilders.com');
  13 |     await page.fill('input[type="password"]', 'password123');
  14 |     await page.click('button[type="submit"]');
  15 | 
  16 |     await expect(page).toHaveURL('/dashboard');
  17 |     await expect(page.locator('text=Welcome, Apex Builders Admin')).toBeVisible();
  18 |   });
  19 | 
  20 |   test('Invalid login shows error message', async ({ page }) => {
  21 |     await page.route('**/api/auth/login', async route => {
  22 |       await route.fulfill({ status: 401, json: { message: 'Invalid credentials' } });
  23 |     });
  24 | 
  25 |     await page.goto('file://' + process.cwd() + '/public/index.html');
  26 |     await page.fill('input[type="email"]', 'wrong@domain.com');
  27 |     await page.fill('input[type="password"]', 'badpass');
  28 |     await page.click('button[type="submit"]');
  29 | 
> 30 |     await expect(page.locator('text=Invalid credentials')).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  31 |   });
  32 | });
  33 | 
```