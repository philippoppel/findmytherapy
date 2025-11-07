/**
 * Therapist Registration E2E Test
 *
 * Tests the complete therapist registration flow:
 * - Navigate to registration page
 * - Fill in therapist details
 * - Select specialties and modalities
 * - Submit registration
 * - Verify success message
 */

import { test, expect } from '@playwright/test'

test.describe('Therapist Registration', () => {
  test('therapist can complete registration', async ({ page }) => {
    // ==========================================
    // STEP 1: Navigate to registration page
    // ==========================================

    await page.goto('/register')

    // Verify we're on the registration page
    await expect(page.getByRole('heading', { name: /Registrierung/i })).toBeVisible()

    // ==========================================
    // STEP 2: Fill in personal information
    // ==========================================

    const uniqueEmail = `therapist.test.${Date.now()}@example.com`

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('Therapeut')
    await page.getByLabel(/^E-Mail$/i).fill(uniqueEmail)
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill('SecurePass123!')
    await page.getByLabel(/Passwort bestätigen/i).fill('SecurePass123!')
    await page.getByLabel(/Praxisstandort/i).fill('Wien')

    // ==========================================
    // STEP 3: Select specialty and modality
    // ==========================================

    // Select at least one specialty
    await page.getByRole('button', { name: /Depression & Burnout/i }).click()

    // Select at least one modality
    await page.getByRole('button', { name: /Online/i }).click()

    // ==========================================
    // STEP 4: Accept terms and submit
    // ==========================================

    // Accept terms and conditions
    await page.getByRole('checkbox', { name: /Ich stimme den/i }).click()

    // Submit the form
    await Promise.all([
      page.waitForResponse(
        response => response.url().includes('/api/register') && response.status() === 201,
        { timeout: 10000 }
      ),
      page.getByRole('button', { name: /Registrierung abschließen/i }).click(),
    ])

    // ==========================================
    // STEP 5: Verify success message
    // ==========================================

    await expect(
      page.getByText(/Danke für deine Registrierung|unter Prüfung/i)
    ).toBeVisible({ timeout: 10000 })

    console.log('✅ Therapist Registration completed!')
  })

  test('therapist registration validates required fields', async ({ page }) => {
    await page.goto('/register')

    // Try to submit without filling any fields
    await page.getByRole('button', { name: /Registrierung abschließen/i }).click()

    // Verify form validation prevents submission
    // The form should still be visible (not navigated away)
    await expect(page.getByRole('heading', { name: /Registrierung/i })).toBeVisible()
  })

  test('therapist registration validates password match', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel(/Vorname/i).fill('Test')
    await page.getByLabel(/Nachname/i).fill('User')
    await page.getByLabel(/^E-Mail$/i).fill('test@example.com')
    await page.getByLabel(/^Passwort$/i, { exact: false }).first().fill('Password123!')
    await page.getByLabel(/Passwort bestätigen/i).fill('DifferentPassword123!')
    await page.getByLabel(/Praxisstandort/i).fill('Wien')

    await page.getByRole('button', { name: /Depression & Burnout/i }).click()
    await page.getByRole('button', { name: /Online/i }).click()

    await page.getByRole('button', { name: /Registrierung abschließen/i }).click()

    // Verify password mismatch error is shown
    await expect(page.getByText(/Passwörter stimmen nicht überein/i)).toBeVisible()
  })

  test('organisation can request demo access', async ({ page }) => {
    await page.goto('/register')

    // Switch to organisation role
    await page.getByLabel(/Ich interessiere mich als/i).selectOption('ORGANISATION')

    // Fill in organisation details
    const uniqueEmail = `org.test.${Date.now()}@example.com`

    await page.getByLabel(/Vorname/i).fill('Organisation')
    await page.getByLabel(/Nachname/i).fill('Admin')
    await page.getByLabel(/^E-Mail$/i).fill(uniqueEmail)
    await page.getByLabel(/Unternehmen \/ Organisation/i).fill('Test Organisation GmbH')
    await page
      .getByLabel(/Worauf sollen wir uns vorbereiten/i)
      .fill('Wir interessieren uns für BGM.')

    // Submit the form
    await Promise.all([
      page.waitForResponse(
        response => response.url().includes('/api/access-request') && response.status() === 201,
        { timeout: 10000 }
      ),
      page.getByRole('button', { name: /Zugang anfragen/i }).click(),
    ])

    // Verify success message
    await expect(page.getByText(/Vielen Dank! Deine Anfrage ist bei uns angekommen/i)).toBeVisible(
      { timeout: 10000 }
    )

    console.log('✅ Organisation Demo Request completed!')
  })
})
