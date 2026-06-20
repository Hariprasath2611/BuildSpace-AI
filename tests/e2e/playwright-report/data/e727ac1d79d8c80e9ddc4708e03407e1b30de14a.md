# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects.spec.ts >> Projects & Digital Twin >> Create a new construction project
- Location: tests\projects.spec.ts:11:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "/projects/proj-123"
Received: "file:///D:/work/BuildSpace%20AI/tests/e2e/public/index.html"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "file:///D:/work/BuildSpace%20AI/tests/e2e/public/index.html"

```

```yaml
- textbox
- textbox
- button "Login"
- text: Welcome, Apex Builders Admin
- textbox: Downtown Skyscraper
- textbox: Bangalore, India
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
  3  | test.describe('Projects & Digital Twin', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Mock authentication state
  6  |     await page.context().addInitScript(() => {
  7  |       window.localStorage.setItem('auth_token', 'mock-token');
  8  |     });
  9  |   });
  10 | 
  11 |   test('Create a new construction project', async ({ page }) => {
  12 |     await page.route('**/api/projects', async route => {
  13 |       if (route.request().method() === 'POST') {
  14 |         await route.fulfill({ json: { id: 'proj-123', name: 'Downtown Skyscraper' } });
  15 |       } else {
  16 |         await route.continue();
  17 |       }
  18 |     });
  19 | 
  20 |     await page.goto('file://' + process.cwd() + '/public/index.html');
  21 |     await page.fill('input[name="projectName"]', 'Downtown Skyscraper');
  22 |     await page.fill('input[name="location"]', 'Bangalore, India');
  23 |     await page.click('button[type="submit"]');
  24 | 
> 25 |     await expect(page).toHaveURL('/projects/proj-123');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  26 |     await expect(page.locator('text=Downtown Skyscraper')).toBeVisible();
  27 |   });
  28 | });
  29 | 
```