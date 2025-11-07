/**
 * Client Registration E2E Test
 *
 * Tests the complete client registration flow:
 * - Navigate to registration page
 * - Fill in client details
 * - Accept terms and conditions
 * - Submit registration
 * - Verify automatic login
 * - Verify redirect to dashboard
 */

import { test, expect } from '@playwright/test'

test.describe('Client Registration', () => {
  test('client can complete registration and login', async ({ page }) => {
    // ==========================================
    // STEP 1: Navigate to client registration page
    // ==========================================

    await page.goto('/signup')

    // Verify we're on the client registration page
    await expect(
      page.getByRole('heading', { name: /Account erstellen|Registrierung/i })
    ).toBeVisible()

    // ==========================================
    // STEP 2: Fill in personal information
    // ==========================================

    const uniqueEmail = `client.test.${Date.now()}@example.com`
    const password = 'ClientPass123!'

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('Client')
    await page.getByLabel(/^E-Mail-Adresse$/i).fill(uniqueEmail)
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill(password)
    await page.getByLabel(/Passwort bestätigen/i).fill(password)

    // ==========================================
    // STEP 3: Accept terms and submit
    // ==========================================

    // Accept terms and conditions
    await page.getByLabel(/Ich stimme den/i).check()

    // Submit the form
    await Promise.all([
      page.waitForResponse(
        response => response.url().includes('/api/clients/register') && response.status() === 201,
        { timeout: 10000 }
      ),
      page.getByRole('button', { name: /Account erstellen/i }).click(),
    ])

    // ==========================================
    // STEP 4: Verify success and auto-login
    // ==========================================

    // Verify success message or redirect to dashboard
    await page.waitForURL(/\/(dashboard|triage)/, { timeout: 15000 })

    // Verify user is logged in (check for user-specific content)
    await expect(page.getByRole('heading', { name: /Test|willkommen/i })).toBeVisible({
      timeout: 5000,
    })

    console.log('✅ Client Registration and Login completed!')
  })

  test('client registration validates required fields', async ({ page }) => {
    await page.goto('/signup')

    // Try to submit without filling any fields
    await page.getByRole('button', { name: /Account erstellen/i }).click()

    // Verify form validation prevents submission
    // The form should still be visible (not navigated away)
    await expect(
      page.getByRole('heading', { name: /Account erstellen|Registrierung/i })
    ).toBeVisible()
  })

  test('client registration validates password match', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('User')
    await page.getByLabel(/^E-Mail-Adresse$/i).fill('test@example.com')
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill('Password123!')
    await page.getByLabel(/Passwort bestätigen/i).fill('DifferentPassword123!')
    await page.getByLabel(/Ich stimme den/i).check()

    await page.getByRole('button', { name: /Account erstellen/i }).click()

    // Verify password mismatch error is shown
    await expect(page.getByText(/Passwörter stimmen nicht überein/i)).toBeVisible()
  })

  test('client registration validates email format', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('User')
    await page.getByLabel(/^E-Mail-Adresse$/i).fill('invalid-email')
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill('Password123!')
    await page.getByLabel(/Passwort bestätigen/i).fill('Password123!')
    await page.getByLabel(/Ich stimme den/i).check()

    await page.getByRole('button', { name: /Account erstellen/i }).click()

    // Verify email validation error is shown
    await expect(page.getByText(/gültige E-Mail/i)).toBeVisible()
  })

  test('client registration requires terms acceptance', async ({ page }) => {
    await page.goto('/signup')

    const uniqueEmail = `client.test.${Date.now()}@example.com`

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('User')
    await page.getByLabel(/^E-Mail-Adresse$/i).fill(uniqueEmail)
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill('Password123!')
    await page.getByLabel(/Passwort bestätigen/i).fill('Password123!')

    // Don't check terms checkbox
    await page.getByRole('button', { name: /Account erstellen/i }).click()

    // Verify form validation prevents submission
    await expect(
      page.getByRole('heading', { name: /Account erstellen|Registrierung/i })
    ).toBeVisible()
  })

  test('client registration validates password length', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('User')
    await page.getByLabel(/^E-Mail-Adresse$/i).fill('test@example.com')
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill('short')
    await page.getByLabel(/Passwort bestätigen/i).fill('short')
    await page.getByLabel(/Ich stimme den/i).check()

    await page.getByRole('button', { name: /Account erstellen/i }).click()

    // Verify password length error is shown - look for the error span specifically
    await expect(
      page.locator('span.text-xs.text-red-600', { hasText: /mindestens 8 Zeichen/i })
    ).toBeVisible()
  })
})
