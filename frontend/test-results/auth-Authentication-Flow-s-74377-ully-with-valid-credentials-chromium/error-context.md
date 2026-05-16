# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> should login successfully with valid credentials
- Location: tests/e2e/auth.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard/
Received string:  "http://localhost:3000/login"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    5 × unexpected value "http://localhost:3000/login"
    - waiting for" http://localhost:3000/login" navigation to finish...
    - navigated to "http://localhost:3000/login"
    17 × unexpected value "http://localhost:3000/login"

```

```yaml
- button "Light":
  - img
- button "Dark":
  - img
- button "System":
  - img
- link "Invoizmo":
  - /url: /
  - img "Invoizmo"
- heading "Hello, Friend!" [level=1]
- paragraph: Register with your personal details to use all of site features
- button "Sign Up"
- heading "Sign In" [level=2]
- paragraph: Welcome back! Please enter your details.
- button ""
- button ""
- button ""
- text: Or use email Email Address
- textbox "john@example.com"
- text: Password
- link "Forgot?":
  - /url: "#"
- textbox "••••••••"
- button "Sign In"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Flow', () => {
  4  |   test('should login successfully with valid credentials', async ({ page }) => {
  5  |     // Mock the login API before navigating
  6  |     await page.route('**/api/v1/auth/login', async route => {
  7  |       await route.fulfill({
  8  |         status: 200,
  9  |         contentType: 'application/json',
  10 |         body: JSON.stringify({
  11 |           success: true,
  12 |           data: {
  13 |             accessToken: 'fake-access-token',
  14 |             user: {
  15 |               id: '1',
  16 |               firstName: 'Test',
  17 |               lastName: 'User',
  18 |               email: 'test@invoizmo.com',
  19 |               role: 'user',
  20 |             },
  21 |           },
  22 |         }),
  23 |       });
  24 |     });
  25 | 
  26 |     await page.goto('/login');
  27 | 
  28 |     await page.fill('input[type="email"]', 'test@invoizmo.com');
  29 |     await page.fill('input[type="password"]', 'password12345');
  30 |     const loginResponse = page.waitForResponse('**/api/v1/auth/login');
  31 |     await page.click('button[type="submit"]');
  32 |     await loginResponse;
  33 | 
> 34 |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  35 |   });
  36 | 
  37 |   test('should show error with invalid credentials', async ({ page }) => {
  38 |     // Mock the login API to return 401
  39 |     await page.route('**/api/v1/auth/login', async route => {
  40 |       await route.fulfill({
  41 |         status: 401,
  42 |         contentType: 'application/json',
  43 |         body: JSON.stringify({
  44 |           success: false,
  45 |           error: 'Invalid credentials',
  46 |         }),
  47 |       });
  48 |     });
  49 | 
  50 |     await page.goto('/login');
  51 | 
  52 |     await page.fill('input[type="email"]', 'invalid@invoizmo.com');
  53 |     await page.fill('input[type="password"]', 'wrongpassword');
  54 |     await page.click('button[type="submit"]');
  55 | 
  56 |     // Error message should appear
  57 |     await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  58 |   });
  59 | 
  60 |   test('should redirect unauthenticated users to /login', async ({ page }) => {
  61 |     // Navigate directly to a protected route without auth
  62 |     await page.goto('/dashboard');
  63 |     await expect(page).toHaveURL('/login', { timeout: 10000 });
  64 |   });
  65 | });
  66 | 
```