import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Mock the login API before navigating
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            accessToken: 'fake-access-token',
            user: {
              id: '1',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@invoizmo.com',
              role: 'user',
            },
          },
        }),
      });
    });

    await page.goto('/login');

    await page.fill('input[type="email"]', 'test@invoizmo.com');
    await page.fill('input[type="password"]', 'password12345');
    const loginResponse = page.waitForResponse('**/api/v1/auth/login');
    await page.click('button[type="submit"]');
    await loginResponse;

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Mock the login API to return 401
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid credentials',
        }),
      });
    });

    await page.goto('/login');

    await page.fill('input[type="email"]', 'invalid@invoizmo.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Error message should appear
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  });

  test('should redirect unauthenticated users to /login', async ({ page }) => {
    // Navigate directly to a protected route without auth
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login', { timeout: 10000 });
  });
});
