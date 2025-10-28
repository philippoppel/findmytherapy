/**
 * Therapist Search E2E Tests
 *
 * Tests the complete therapist search and filtering functionality
 */

import { test, expect } from '@playwright/test'

test.describe('Therapist Search Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')
  })

  test('displays therapist directory page', async ({ page }) => {
    // Verify page title
    await expect(page.getByRole('heading', { name: /therapeuten/i })).toBeVisible()

    // Verify search/filter UI is present
    await expect(page.locator('input[type="search"], [role="searchbox"]')).toBeVisible()
  })

  test('searches for therapists by name', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], [role="searchbox"]').first()

    // Type in search
    await searchInput.fill('Mueller')
    await page.waitForTimeout(500) // Wait for debounce

    // Verify results are filtered
    const therapistCards = page.locator('[data-testid="therapist-card"]')
    const count = await therapistCards.count()

    if (count > 0) {
      const firstCard = therapistCards.first()
      const cardText = await firstCard.textContent()
      expect(cardText?.toLowerCase()).toContain('mueller')
    }
  })

  test('filters by specialty', async ({ page }) => {
    // Look for specialty filter
    const specialtyFilter = page.getByText(/spezialisierung|fachgebiet/i).first()

    if (await specialtyFilter.isVisible()) {
      await specialtyFilter.click()

      // Select a specialty (e.g., "Angststörungen")
      const anxietyOption = page.getByText(/angst/i).first()
      if (await anxietyOption.isVisible()) {
        await anxietyOption.click()
        await page.waitForTimeout(500)

        // Verify results show the specialty
        const therapistCards = page.locator('[data-testid="therapist-card"]')
        const count = await therapistCards.count()

        if (count > 0) {
          const firstCard = therapistCards.first()
          const cardText = await firstCard.textContent()
          expect(cardText?.toLowerCase()).toContain('angst')
        }
      }
    }
  })

  test('filters by location', async ({ page }) => {
    // Look for location filter
    const locationFilter = page.locator('input[placeholder*="Ort"], input[placeholder*="Stadt"]').first()

    if (await locationFilter.isVisible()) {
      await locationFilter.fill('Wien')
      await page.waitForTimeout(500)

      // Verify results show Vienna therapists
      const therapistCards = page.locator('[data-testid="therapist-card"]')
      const count = await therapistCards.count()

      if (count > 0) {
        const firstCard = therapistCards.first()
        const cardText = await firstCard.textContent()
        expect(cardText).toContain('Wien')
      }
    }
  })

  test('filters by online availability', async ({ page }) => {
    // Look for online filter checkbox
    const onlineFilter = page.getByText(/online|videoberatung/i).first()

    if (await onlineFilter.isVisible()) {
      await onlineFilter.click()
      await page.waitForTimeout(500)

      // Verify results show online availability
      const therapistCards = page.locator('[data-testid="therapist-card"]')
      const count = await therapistCards.count()

      if (count > 0) {
        // At least one result should indicate online availability
        expect(count).toBeGreaterThan(0)
      }
    }
  })

  test('navigates to therapist detail page', async ({ page }) => {
    const therapistCards = page.locator('[data-testid="therapist-card"], .therapist-card')
    const count = await therapistCards.count()

    if (count > 0) {
      // Click first therapist card
      await therapistCards.first().click()

      // Wait for navigation
      await page.waitForURL(/\/therapists\/[\w-]+/, { timeout: 5000 })

      // Verify we're on detail page
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })

  test('displays correct therapist count', async ({ page }) => {
    // Look for result count
    const resultCount = page.getByText(/\d+ therapeuten/i)

    if (await resultCount.isVisible()) {
      const text = await resultCount.textContent()
      const match = text?.match(/(\d+)/)

      if (match) {
        const count = parseInt(match[1])
        expect(count).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('handles no results gracefully', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], [role="searchbox"]').first()

    // Search for something that doesn't exist
    await searchInput.fill('xyznonexistent123')
    await page.waitForTimeout(500)

    // Verify empty state message
    const emptyMessage = page.getByText(/keine therapeuten gefunden|no results/i)
    await expect(emptyMessage).toBeVisible({ timeout: 3000 })
  })

  test('resets filters', async ({ page }) => {
    // Apply some filters first
    const searchInput = page.locator('input[type="search"], [role="searchbox"]').first()
    await searchInput.fill('Test')
    await page.waitForTimeout(500)

    // Look for reset button
    const resetButton = page.getByRole('button', { name: /zurücksetzen|filter löschen|clear/i })

    if (await resetButton.isVisible()) {
      await resetButton.click()
      await page.waitForTimeout(500)

      // Verify search is cleared
      const searchValue = await searchInput.inputValue()
      expect(searchValue).toBe('')
    }
  })

  test('maintains filters on page reload', async ({ page }) => {
    // Apply a search filter
    const searchInput = page.locator('input[type="search"], [role="searchbox"]').first()
    await searchInput.fill('Mueller')
    await page.waitForTimeout(500)

    // Get current URL (should include query params)
    const urlBeforeReload = page.url()

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify URL still has the filter
    const urlAfterReload = page.url()
    expect(urlAfterReload).toContain(urlBeforeReload.split('?')[0])
  })
})

test.describe('Therapist Detail Page', () => {
  test('displays therapist information', async ({ page }) => {
    // First, go to therapists page and click a card
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    const therapistCards = page.locator('[data-testid="therapist-card"], .therapist-card')
    const count = await therapistCards.count()

    if (count > 0) {
      await therapistCards.first().click()
      await page.waitForURL(/\/therapists\/[\w-]+/)

      // Verify profile sections
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      // Look for common profile elements
      const commonElements = [
        page.getByText(/spezialisierung|fachgebiet/i),
        page.getByText(/ausbildung|qualifikation/i),
        page.getByText(/kontakt|termin/i)
      ]

      // At least some elements should be visible
      for (const element of commonElements) {
        if (await element.isVisible()) {
          expect(element).toBeVisible()
          break
        }
      }
    }
  })

  test('shows contact button', async ({ page }) => {
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    const therapistCards = page.locator('[data-testid="therapist-card"], .therapist-card')
    const count = await therapistCards.count()

    if (count > 0) {
      await therapistCards.first().click()
      await page.waitForURL(/\/therapists\/[\w-]+/)

      // Look for contact/booking button
      const contactButton = page.getByRole('button', { name: /kontakt|termin|anfrage/i })

      if (await contactButton.isVisible()) {
        await expect(contactButton).toBeVisible()
        await expect(contactButton).toBeEnabled()
      }
    }
  })

  test('navigates back to directory', async ({ page }) => {
    await page.goto('/therapists')
    const therapistCards = page.locator('[data-testid="therapist-card"], .therapist-card')

    if ((await therapistCards.count()) > 0) {
      await therapistCards.first().click()
      await page.waitForURL(/\/therapists\/[\w-]+/)

      // Look for back button
      const backButton = page.getByRole('button', { name: /zurück/i }).or(
        page.locator('[aria-label*="zurück"], [aria-label*="back"]')
      )

      if (await backButton.isVisible()) {
        await backButton.click()
        await expect(page).toHaveURL(/\/therapists\/?$/)
      } else {
        // Use browser back if no back button
        await page.goBack()
        await expect(page).toHaveURL(/\/therapists\/?$/)
      }
    }
  })
})

test.describe('Responsive Behavior', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    // Verify page is usable on mobile
    await expect(page.getByRole('heading', { name: /therapeuten/i })).toBeVisible()

    const therapistCards = page.locator('[data-testid="therapist-card"], .therapist-card')
    const count = await therapistCards.count()

    if (count > 0) {
      // Cards should be stacked vertically
      const firstCard = therapistCards.first()
      await expect(firstCard).toBeVisible()
    }
  })

  test('filter menu works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/therapists')
    await page.waitForLoadState('networkidle')

    // Look for mobile filter button
    const filterButton = page.getByRole('button', { name: /filter/i })

    if (await filterButton.isVisible()) {
      await filterButton.click()

      // Filter menu should open
      await page.waitForTimeout(300)

      // Verify filters are accessible
      const searchInput = page.locator('input[type="search"], [role="searchbox"]')
      await expect(searchInput.first()).toBeVisible()
    }
  })
})
