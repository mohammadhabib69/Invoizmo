import { test, expect } from '@playwright/test';
import { seedAuthState, mockCommonAPIs } from './helpers/auth';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Seed localStorage with auth tokens (navigates to /login internally)
    await seedAuthState(page);

    // 2. Register API mocks BEFORE navigating to the protected page
    await mockCommonAPIs(page);

    // 3. Now navigate to dashboard — RequireAuth will pass because localStorage has the token
    await page.goto('/dashboard');

    // 4. Wait for the page to fully render (spinner → content)
    await page.waitForSelector('h1', { timeout: 15000 });
  });

  test('should display the dashboard heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Dashboard');
  });

  test('should display KPI stat cards', async ({ page }) => {
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Invoices Sent')).toBeVisible();
    await expect(page.locator('text=Overdue Invoices')).toBeVisible();
    await expect(page.locator('text=Outstanding')).toBeVisible();
  });

  test('should display Create Invoice button', async ({ page }) => {
    await expect(page.locator('text=Create Invoice').first()).toBeVisible();
  });

  test('should display Recent Invoices section', async ({ page }) => {
    await expect(page.locator('text=Recent Invoices')).toBeVisible();
  });

  test('should display Quick Actions section', async ({ page }) => {
    await expect(page.locator('text=Quick Actions')).toBeVisible();
  });

  test('should navigate to invoices page via sidebar link', async ({ page }) => {
    const invoicesLink = page.getByRole('link', { name: 'Invoices' }).first();
    await expect(invoicesLink).toBeVisible();
    await invoicesLink.click();
    await expect(page).toHaveURL(/\/invoices/, { timeout: 8000 });
  });

  test('should navigate to /invoices/new from Create Invoice button', async ({ page }) => {
    await page.locator('a[href="/invoices/new"]').first().click();
    await expect(page).toHaveURL(/\/invoices\/new/, { timeout: 8000 });
  });
});
