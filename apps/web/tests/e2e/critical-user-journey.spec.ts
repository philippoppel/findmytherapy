/**
 * Critical User Journey E2E Test
 *
 * Tests the essential user flow from login to finding therapists.
 * This ensures the critical business path never breaks.
 */

import { test, expect } from '@playwright/test'

test.describe('Critical User Journey', () => {
  test('completes journey from login to viewing therapist details', async ({ page }) => {
    // ==========================================
    // STEP 1: Login
    // ==========================================

    await page.goto('/login')

    await page.getByLabel(/Email/i).fill('demo.client@example.com')
    await page.getByLabel(/Passwort|Password/i).fill('Client123!')

    await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/auth-custom/login')),
      page.getByRole('button', { name: 'Anmelden' }).click(),
    ])

    await page.waitForURL(/\/dashboard/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: /Nora|willkommen/i })).toBeVisible()

    // ==========================================
    // STEP 2: Navigate to Therapists
    // ==========================================

    await page.goto('/therapeuten')

    // Verify therapist list page loaded
    await expect(page.getByRole('heading', { name: /Therapeut/i }).first()).toBeVisible({ timeout: 10000 })

    // Verify therapist cards are displayed
    const therapistCards = page.locator('[data-testid="therapist-card"]').or(
      page.locator('article').filter({ hasText: /Dr\\.|Mag\\./i })
    )
    await expect(therapistCards.first()).toBeVisible({ timeout: 10000 })

    // ==========================================
    // STEP 3: View Therapist Details
    // ==========================================

    // Click on first therapist
    await therapistCards.first().click()

    // Wait for detail page
    await page.waitForURL(/\/therapeuten\/\w+/, { timeout: 10000 })

    // Verify therapist details are visible
    await expect(page.getByRole('heading', { name: /Dr\\.|Mag\\./i })).toBeVisible({ timeout: 10000 })

    // Verify key information
    const pageContent = await page.textContent('body')
    expect(pageContent).toMatch(/€|EUR/i) // Price information

    console.log('✅ Critical User Journey completed successfully!')
  })
})
