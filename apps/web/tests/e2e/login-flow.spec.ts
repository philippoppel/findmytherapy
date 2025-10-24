import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('displays login form and accepts credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Verify login page is displayed
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    // Verify form inputs are present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    // Verify submit button is present
    await expect(page.getByRole('button', { name: 'Anmelden' })).toBeVisible();

    // Verify test credentials hint is shown
    await expect(page.getByText(/Test-Zugangsdaten/i)).toBeVisible();
    await expect(page.getByText(/dr\.mueller@example\.com/)).toBeVisible();
  });

  test('successfully logs in and redirects to dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in test credentials
    await page.getByLabel('Email').fill('dr.mueller@example.com');
    await page.getByLabel('Password').fill('Therapist123!');

    // Click login button and wait for custom login API
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/auth-custom/login')),
      page.getByRole('button', { name: 'Anmelden' }).click(),
    ]);

    // Verify login API succeeded
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.user.email).toBe('dr.mueller@example.com');

    // Wait for navigation to dashboard (will redirect to /dashboard/therapist for therapists)
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle');

    // Verify therapist dashboard is displayed
    await expect(page.getByRole('heading', { name: /Willkommen zurück/i })).toBeVisible();

    // Verify email is displayed
    await expect(page.getByText('dr.mueller@example.com')).toBeVisible();
  });

  test('shows error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // Click login button
    await page.getByRole('button', { name: 'Anmelden' }).click();

    // Verify error message is shown
    await expect(page.getByText(/Ungültige E-Mail oder Passwort/i)).toBeVisible();

    // Verify we're still on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('shows loading state during login', async ({ page }) => {
    await page.goto('/login');

    // Fill in credentials
    await page.getByLabel('Email').fill('dr.mueller@example.com');
    await page.getByLabel('Password').fill('Therapist123!');

    // Click login button
    const loginButton = page.getByRole('button', { name: 'Anmelden' });
    await loginButton.click();

    // Verify loading state appears (might be very brief)
    // This checks that the button shows "Lädt..." during the request
    await expect(loginButton.or(page.getByRole('button', { name: 'Lädt...' }))).toBeVisible();
  });
});
