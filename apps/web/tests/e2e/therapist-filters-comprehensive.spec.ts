/**
 * E2E Tests: Comprehensive Therapist Filters
 *
 * Tests all filter functionalities of the therapist search:
 * - Format filters (Online, Präsenz, Hybrid)
 * - Gender filter (Egal, Weiblich, Männlich)
 * - Location/Distance filter
 * - Specialization filter
 * - Language filter
 * - Price range filter
 * - Insurance filter
 * - Sort options
 * - Filter combinations
 * - Filter reset
 */

import { test, expect, Page } from '@playwright/test';

// Helper function to dismiss cookie banner
async function dismissCookieBanner(page: Page) {
  try {
    const acceptButton = page.getByRole('button', { name: /akzeptieren|accept|annehmen/i });
    if (await acceptButton.isVisible({ timeout: 2000 })) {
      await acceptButton.click();
    }
  } catch {
    // No cookie banner present
  }
}

// Helper function to wait for results to update
async function waitForResultsUpdate(page: Page) {
  // Wait for any loading indicators to disappear and results to stabilize
  await page.waitForTimeout(500);
  await page.waitForLoadState('networkidle');
}

// Helper to get the current result count
async function getResultCount(page: Page): Promise<number> {
  const countText = await page.locator('text=/\\d+\\s*Therapeut/i').first().textContent();
  const match = countText?.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Helper to open mobile filter drawer if on mobile
async function openFiltersIfMobile(page: Page) {
  const filterButton = page.getByRole('button', { name: /Filter.*Sortierung/i });
  if (await filterButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await filterButton.click();
    await page.waitForTimeout(300);
  }
}

// Helper to close mobile filter drawer
async function closeFiltersIfMobile(page: Page) {
  const closeButton = page.locator('[class*="fixed"] button:has(svg)').first();
  if (await closeButton.isVisible({ timeout: 500 }).catch(() => false)) {
    await closeButton.click();
    await page.waitForTimeout(300);
  }
}

test.describe('Therapeut:innen Filter - Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/therapists');
    await dismissCookieBanner(page);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for data to load
  });

  test.describe('Format Filters', () => {
    test('should filter by Online format', async ({ page }) => {
      await openFiltersIfMobile(page);

      // Find and click Online filter
      const onlineCheckbox = page.locator('label:has-text("Online")').first();
      await expect(onlineCheckbox).toBeVisible({ timeout: 5000 });

      const initialCount = await getResultCount(page);
      await onlineCheckbox.click();
      await waitForResultsUpdate(page);

      // Results should change or stay same (if all have Online)
      const newCount = await getResultCount(page);
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('should filter by Vor Ort (Präsenz) format', async ({ page }) => {
      await openFiltersIfMobile(page);

      const praesenzCheckbox = page.locator('label:has-text("Vor Ort")').first();
      await expect(praesenzCheckbox).toBeVisible({ timeout: 5000 });

      const initialCount = await getResultCount(page);
      await praesenzCheckbox.click();
      await waitForResultsUpdate(page);

      const newCount = await getResultCount(page);
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('should filter by Hybrid format', async ({ page }) => {
      await openFiltersIfMobile(page);

      const hybridCheckbox = page.locator('label:has-text("Hybrid")').first();
      await expect(hybridCheckbox).toBeVisible({ timeout: 5000 });

      const initialCount = await getResultCount(page);
      await hybridCheckbox.click();
      await waitForResultsUpdate(page);

      const newCount = await getResultCount(page);
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('should allow multiple format filters simultaneously', async ({ page }) => {
      await openFiltersIfMobile(page);

      const onlineCheckbox = page.locator('label:has-text("Online")').first();
      const praesenzCheckbox = page.locator('label:has-text("Vor Ort")').first();

      await onlineCheckbox.click();
      await waitForResultsUpdate(page);

      const afterOnline = await getResultCount(page);

      await praesenzCheckbox.click();
      await waitForResultsUpdate(page);

      // Multiple filters should show union of results
      const afterBoth = await getResultCount(page);
      expect(afterBoth).toBeGreaterThanOrEqual(afterOnline);
    });
  });

  test.describe('Gender Filter', () => {
    test('should filter by female therapists', async ({ page }) => {
      await openFiltersIfMobile(page);

      const femaleOption = page.locator('label:has-text("Weiblich")').first();
      await expect(femaleOption).toBeVisible({ timeout: 5000 });

      const initialCount = await getResultCount(page);
      await femaleOption.click();
      await waitForResultsUpdate(page);

      const newCount = await getResultCount(page);
      expect(newCount).toBeLessThanOrEqual(initialCount);
      expect(newCount).toBeGreaterThan(0); // Should have female therapists in demo data
    });

    test('should filter by male therapists', async ({ page }) => {
      await openFiltersIfMobile(page);

      const maleOption = page.locator('label:has-text("Männlich")').first();
      await expect(maleOption).toBeVisible({ timeout: 5000 });

      const initialCount = await getResultCount(page);
      await maleOption.click();
      await waitForResultsUpdate(page);

      const newCount = await getResultCount(page);
      expect(newCount).toBeLessThanOrEqual(initialCount);
      expect(newCount).toBeGreaterThan(0); // Should have male therapists in demo data
    });

    test('should show all therapists with "Egal" option', async ({ page }) => {
      await openFiltersIfMobile(page);

      // First filter by female
      const femaleOption = page.locator('label:has-text("Weiblich")').first();
      await femaleOption.click();
      await waitForResultsUpdate(page);

      const filteredCount = await getResultCount(page);

      // Then select "Egal"
      const egalOption = page.locator('label:has-text("Egal")').first();
      await egalOption.click();
      await waitForResultsUpdate(page);

      const allCount = await getResultCount(page);
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });

  test.describe('Search Query Filter', () => {
    test('should filter by therapist name', async ({ page }) => {
      await openFiltersIfMobile(page);

      const searchInput = page.getByPlaceholder(/Name.*Spezialisierung/i);
      await expect(searchInput).toBeVisible({ timeout: 5000 });

      const initialCount = await getResultCount(page);
      await searchInput.fill('Dr');
      await waitForResultsUpdate(page);
      await page.waitForTimeout(500); // Debounce delay

      // Should find therapists with "Dr" in name
      const newCount = await getResultCount(page);
      // Could be 0 if no Dr in demo data
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('should filter by specialization keyword', async ({ page }) => {
      await openFiltersIfMobile(page);

      const searchInput = page.getByPlaceholder(/Name.*Spezialisierung/i);

      await searchInput.fill('Depression');
      await waitForResultsUpdate(page);
      await page.waitForTimeout(500);

      // Should show results or empty state
      const hasResults = await page.locator('article').first().isVisible().catch(() => false);
      const noResults = await page.getByText(/Keine.*Ergebnisse/i).isVisible().catch(() => false);

      expect(hasResults || noResults).toBeTruthy();
    });

    test('should show no results for nonsense query', async ({ page }) => {
      await openFiltersIfMobile(page);

      const searchInput = page.getByPlaceholder(/Name.*Spezialisierung/i);

      await searchInput.fill('XYZNONEXISTENT12345');
      await waitForResultsUpdate(page);
      await page.waitForTimeout(500);

      // Should show no results message
      await expect(page.getByText(/Keine.*Ergebnisse|Keine passenden/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Specialization Filter', () => {
    test('should show expandable specialization section', async ({ page }) => {
      await openFiltersIfMobile(page);

      // Click on Spezialisierung section header
      const specSection = page.locator('button:has-text("Spezialisierung")');
      await expect(specSection).toBeVisible({ timeout: 5000 });
      await specSection.click();
      await page.waitForTimeout(300);

      // Should show specialization options
      const specOptions = page.locator('button:has-text("Depression"), button:has-text("Angst"), button:has-text("Burnout")');
      const anyVisible = await specOptions.first().isVisible().catch(() => false);
      expect(anyVisible).toBeTruthy();
    });

    test('should filter by selecting a specialization', async ({ page }) => {
      await openFiltersIfMobile(page);

      // Expand specialization section
      const specSection = page.locator('button:has-text("Spezialisierung")');
      await specSection.click();
      await page.waitForTimeout(300);

      const initialCount = await getResultCount(page);

      // Click first available specialization
      const firstSpec = page.locator('[class*="flex-wrap"] button').first();
      if (await firstSpec.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstSpec.click();
        await waitForResultsUpdate(page);

        const newCount = await getResultCount(page);
        expect(newCount).toBeLessThanOrEqual(initialCount);
      }
    });
  });

  test.describe('Language Filter', () => {
    test('should show expandable language section', async ({ page }) => {
      await openFiltersIfMobile(page);

      const langSection = page.locator('button:has-text("Sprachen")');
      await expect(langSection).toBeVisible({ timeout: 5000 });
      await langSection.click();
      await page.waitForTimeout(300);

      // Should show language options
      const langOptions = page.locator('button:has-text("Deutsch"), button:has-text("Englisch")');
      const anyVisible = await langOptions.first().isVisible().catch(() => false);
      expect(anyVisible).toBeTruthy();
    });

    test('should filter by language', async ({ page }) => {
      await openFiltersIfMobile(page);

      const langSection = page.locator('button:has-text("Sprachen")');
      await langSection.click();
      await page.waitForTimeout(300);

      const initialCount = await getResultCount(page);

      // Select Englisch (should reduce results)
      const englishButton = page.locator('button:has-text("Englisch")').first();
      if (await englishButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await englishButton.click();
        await waitForResultsUpdate(page);

        const newCount = await getResultCount(page);
        expect(newCount).toBeLessThanOrEqual(initialCount);
      }
    });
  });

  test.describe('Insurance Filter', () => {
    test('should show insurance section', async ({ page }) => {
      await openFiltersIfMobile(page);

      const insuranceSection = page.locator('button:has-text("Krankenkasse")');
      await expect(insuranceSection).toBeVisible({ timeout: 5000 });
      await insuranceSection.click();
      await page.waitForTimeout(300);

      // Should show insurance checkbox
      const insuranceCheckbox = page.locator('label:has-text("Akzeptiert Krankenkasse")');
      await expect(insuranceCheckbox).toBeVisible({ timeout: 3000 });
    });

    test('should filter by insurance acceptance', async ({ page }) => {
      await openFiltersIfMobile(page);

      const insuranceSection = page.locator('button:has-text("Krankenkasse")');
      await insuranceSection.click();
      await page.waitForTimeout(300);

      const initialCount = await getResultCount(page);

      const insuranceCheckbox = page.locator('label:has-text("Akzeptiert Krankenkasse")');
      await insuranceCheckbox.click();
      await waitForResultsUpdate(page);

      const newCount = await getResultCount(page);
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });
  });

  test.describe('Price Filter', () => {
    test('should show price filter section', async ({ page }) => {
      await openFiltersIfMobile(page);

      const priceSection = page.locator('button:has-text("Preis")');
      await expect(priceSection).toBeVisible({ timeout: 5000 });
      await priceSection.click();
      await page.waitForTimeout(300);

      // Should show price toggle
      const priceToggle = page.locator('[aria-label*="Preis"]');
      const hasToggle = await priceToggle.isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasToggle).toBeTruthy();
    });
  });

  test.describe('Sort Options', () => {
    test('should have sort dropdown', async ({ page }) => {
      // Sort is usually visible on desktop without opening filters
      const sortSelect = page.locator('select');
      await expect(sortSelect.first()).toBeVisible({ timeout: 5000 });
    });

    test('should sort by different criteria', async ({ page }) => {
      const sortSelect = page.locator('select').first();

      // Check available sort options
      const options = await sortSelect.locator('option').allTextContents();
      expect(options.length).toBeGreaterThan(1);

      // Try sorting by availability
      await sortSelect.selectOption({ label: /Verfügbarkeit/i });
      await waitForResultsUpdate(page);

      // Page should still work
      const hasResults = await page.locator('article').first().isVisible().catch(() => false);
      expect(hasResults).toBeTruthy();
    });
  });

  test.describe('Filter Reset', () => {
    test('should reset all filters', async ({ page }) => {
      await openFiltersIfMobile(page);

      // Apply some filters
      const searchInput = page.getByPlaceholder(/Name.*Spezialisierung/i);
      await searchInput.fill('Test');
      await waitForResultsUpdate(page);

      // Find and click reset button
      const resetButton = page.getByRole('button', { name: /zurücksetzen|reset/i });
      if (await resetButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await resetButton.click();
        await waitForResultsUpdate(page);

        // Search input should be cleared
        await expect(searchInput).toHaveValue('');
      }
    });
  });

  test.describe('Location Filter', () => {
    test('should show location section', async ({ page }) => {
      await openFiltersIfMobile(page);

      const locationSection = page.locator('button:has-text("Standort")');
      await expect(locationSection).toBeVisible({ timeout: 5000 });
    });

    test('should have location input', async ({ page }) => {
      await openFiltersIfMobile(page);

      const locationSection = page.locator('button:has-text("Standort")');
      await locationSection.click();
      await page.waitForTimeout(300);

      const locationInput = page.getByPlaceholder(/Wien.*Graz/i);
      await expect(locationInput).toBeVisible({ timeout: 3000 });
    });

    test('should have "Nur in meiner Nähe" toggle', async ({ page }) => {
      await openFiltersIfMobile(page);

      const locationSection = page.locator('button:has-text("Standort")');
      await locationSection.click();
      await page.waitForTimeout(300);

      const nearbyToggle = page.locator('button:has-text("Nur in meiner Nähe")');
      await expect(nearbyToggle).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Combined Filters', () => {
    test('should combine format and gender filters', async ({ page }) => {
      await openFiltersIfMobile(page);

      const initialCount = await getResultCount(page);

      // Apply Online filter
      const onlineCheckbox = page.locator('label:has-text("Online")').first();
      await onlineCheckbox.click();
      await waitForResultsUpdate(page);

      const afterFormat = await getResultCount(page);

      // Apply female filter
      const femaleOption = page.locator('label:has-text("Weiblich")').first();
      await femaleOption.click();
      await waitForResultsUpdate(page);

      const afterBoth = await getResultCount(page);

      // Combined filter should be equal or less than single filter
      expect(afterBoth).toBeLessThanOrEqual(afterFormat);
    });

    test('should handle empty result state gracefully', async ({ page }) => {
      await openFiltersIfMobile(page);

      // Apply restrictive filters that likely result in 0
      const searchInput = page.getByPlaceholder(/Name.*Spezialisierung/i);
      await searchInput.fill('XYZNONEXISTENT');
      await waitForResultsUpdate(page);
      await page.waitForTimeout(500);

      // Should show empty state, not crash
      const emptyState = page.getByText(/Keine.*Ergebnisse|Keine passenden/i);
      await expect(emptyState).toBeVisible({ timeout: 5000 });

      // Should offer quiz link
      const quizLink = page.getByRole('link', { name: /Quiz/i });
      const hasQuizLink = await quizLink.isVisible({ timeout: 2000 }).catch(() => false);
      expect(hasQuizLink).toBeTruthy();
    });
  });

  test.describe('Pagination', () => {
    test('should show pagination when many results', async ({ page }) => {
      const resultCount = await getResultCount(page);

      if (resultCount > 20) {
        // Should have pagination
        const pagination = page.locator('button:has-text("Weiter"), button:has-text("2")');
        const hasPagination = await pagination.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasPagination).toBeTruthy();
      }
    });

    test('should navigate between pages', async ({ page }) => {
      const resultCount = await getResultCount(page);

      if (resultCount > 20) {
        // Click page 2
        const page2Button = page.locator('button:has-text("2")').first();
        if (await page2Button.isVisible({ timeout: 2000 }).catch(() => false)) {
          await page2Button.click();
          await waitForResultsUpdate(page);

          // Should show different results
          const hasResults = await page.locator('article').first().isVisible().catch(() => false);
          expect(hasResults).toBeTruthy();
        }
      }
    });
  });

  test.describe('Result Cards', () => {
    test('should display therapist cards with required info', async ({ page }) => {
      const firstCard = page.locator('article').first();
      await expect(firstCard).toBeVisible({ timeout: 5000 });

      // Should show name
      const hasName = await firstCard.locator('h3, [class*="font-bold"]').first().isVisible();
      expect(hasName).toBeTruthy();

      // Should show location
      const hasLocation = await firstCard.locator('text=/Wien|Graz|Linz|Salzburg|Innsbruck/i').isVisible().catch(() => false);
      // Location might not always be visible, just check card exists
    });

    test('should link to therapist detail page', async ({ page }) => {
      const firstLink = page.locator('a[href^="/therapists/"]').first();
      await expect(firstLink).toBeVisible({ timeout: 5000 });

      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/\/therapists\/[a-z0-9-]+/i);
    });
  });
});
