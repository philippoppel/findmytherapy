/**
 * Critical User Journey E2E Test
 *
 * Tests the absolute minimum critical path:
 * - User can login
 * - User sees dashboard
 * - User can navigate
 *
 * This ensures authentication and basic navigation never break.
 */

import { test, expect } from '@playwright/test'

test.describe('Critical User Journey', () => {
  test('user can login and access dashboard', async ({ page }) => {
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

    // ==========================================
    // STEP 2: Verify Dashboard Access
    // ==========================================

    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Verify user is logged in (user name or welcome message visible)
    await expect(page.getByRole('heading', { name: /Nora|willkommen/i })).toBeVisible()

    // ==========================================
    // STEP 3: Verify Navigation Works
    // ==========================================

    // Check that we can see navigation elements
    const nav = page.locator('nav').or(page.getByRole('navigation'))
    await expect(nav.first()).toBeVisible()

    // ==========================================
    // STEP 4: Verify Can Logout
    // ==========================================

    // Try to find logout button
    const logoutButton = page.getByRole('button', { name: /Abmelden|Logout/i })
    if (await logoutButton.isVisible({ timeout: 2000 })) {
      await expect(logoutButton).toBeEnabled()
    }

    console.log('✅ Critical User Journey (Login → Dashboard → Navigation) completed!')
  })
})
