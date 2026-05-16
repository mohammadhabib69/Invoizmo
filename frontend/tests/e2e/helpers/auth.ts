import { Page } from '@playwright/test';

const FAKE_USER = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@invoizmo.com',
  role: 'user',
};
const FAKE_TOKEN = 'fake-access-token';

/**
 * Seeds auth tokens into localStorage so protected routes pass RequireAuth.
 * Must be called AFTER page.goto() to have a domain context, but BEFORE
 * navigating to the protected page. Pattern:
 *
 *   await page.goto('/login');          // any page — just to get domain context
 *   await seedAuthState(page);          // write to localStorage
 *   await page.goto('/dashboard');      // now RequireAuth will pass
 */
export async function seedAuthState(page: Page) {
  // Navigate to any public page first to establish a domain context
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');

  await page.evaluate(
    ({ user, token }) => {
      localStorage.setItem('invoizmo_access_token', token);
      localStorage.setItem('invoizmo_user', JSON.stringify(user));
    },
    { user: FAKE_USER, token: FAKE_TOKEN }
  );
}

/**
 * Registers common API mocks that return empty/default data.
 * Call this BEFORE page.goto() to ensure routes are intercepted.
 */
export async function mockCommonAPIs(page: Page) {
  // Dashboard stats
  await page.route('**/api/v1/analytics/**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          kpis: {
            totalRevenueMtd: 12500,
            totalInvoicesMtd: 8,
            overdueCount: 2,
            outstandingAmount: 3200,
          },
        },
      }),
    });
  });

  // Invoices list
  await page.route('**/api/v1/invoices*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Clients list (used by sidebar or other pages)
  await page.route('**/api/v1/clients*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Notifications
  await page.route('**/api/v1/notifications*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Users/me
  await page.route('**/api/v1/users/me*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          id: '1',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@invoizmo.com',
        },
      }),
    });
  });
}
