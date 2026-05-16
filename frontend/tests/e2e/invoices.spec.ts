import { test, expect } from '@playwright/test';
import { seedAuthState, mockCommonAPIs } from './helpers/auth';

const MOCK_INVOICES = [
  {
    _id: 'inv-001',
    invoiceNumber: 'INV-001',
    client: { name: 'Acme Corp' },
    total: 1500,
    status: 'paid',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'inv-002',
    invoiceNumber: 'INV-002',
    client: { name: 'Globex Inc' },
    total: 2400,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

test.describe('Invoices Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Seed localStorage (navigates to /login internally)
    await seedAuthState(page);

    // 2. Register API mocks before navigation
    await mockCommonAPIs(page);

    // 3. Navigate to the invoices page
    await page.goto('/invoices');

    // 4. Wait for page content
    await page.waitForSelector('h1', { timeout: 15000 });
  });

  test('should display the Invoices heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Invoices');
  });

  test('should display the New Invoice button', async ({ page }) => {
    const btn = page.locator('a[href="/invoices/new"]').first();
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('New Invoice');
  });

  test('should display status filter tabs', async ({ page }) => {
    for (const tab of ['All', 'Draft', 'Sent', 'Paid', 'Overdue']) {
      await expect(page.locator(`text=${tab}`).first()).toBeVisible();
    }
  });

  test('should display search input', async ({ page }) => {
    // The invoices page has a search input inside a relative div
    const searchInput = page.locator('input').filter({ hasAttribute: 'placeholder' }).first();
    await expect(searchInput).toBeVisible();
  });

  test('should navigate to new invoice page', async ({ page }) => {
    await page.locator('a[href="/invoices/new"]').first().click();
    await expect(page).toHaveURL(/\/invoices\/new/, { timeout: 8000 });
  });

  test('should show invoices in the list when data exists', async ({ page }) => {
    // Override the invoices route to return data
    await page.route('**/api/v1/invoices*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: MOCK_INVOICES }),
      });
    });

    await page.reload();
    await page.waitForSelector('h1', { timeout: 15000 });

    await expect(page.locator('text=INV-001')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=INV-002')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Acme Corp')).toBeVisible();
    await expect(page.locator('text=Globex Inc')).toBeVisible();
  });
});
