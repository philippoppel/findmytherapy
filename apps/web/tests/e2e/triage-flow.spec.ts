/**
 * E2E Tests for Adaptive Triage Flow
 *
 * Critical user journey: Triage assessment with adaptive questionnaires
 * - Low scores: PHQ-2/GAD-2 only (screening)
 * - High scores: Full PHQ-9/GAD-7 expansion
 */

import { test, expect } from '@playwright/test'

test.describe('Adaptive Triage Flow', () => {
  test('completes screening-only path with low scores', async ({ page }) => {
    // Navigate to triage
    await page.goto('/triage')
    await expect(page).toHaveURL(/\/triage/)

    // PHQ-2 Question 1: "Überhaupt nicht" (score: 0)
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // PHQ-2 Question 2: "An einzelnen Tagen" (score: 1)
    // Total PHQ-2 = 1 (<3, no expansion)
    await page.waitForTimeout(500)
    await expect(page.getByText(/Niedergeschlagenheit/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    // Wait for transition to GAD-2
    await page.waitForTimeout(3500)

    // GAD-2 Question 1: "Überhaupt nicht" (score: 0)
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // GAD-2 Question 2: "An einzelnen Tagen" (score: 1)
    // Total GAD-2 = 1 (<3, no expansion)
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    // Wait for transition to preferences (longer timeout for transition message)
    await page.waitForTimeout(3500)

    // Should see preferences - check for the therapist option button
    const therapistButton = page.getByRole('button', { name: /1:1 Psychotherapie/i })
    await expect(therapistButton).toBeVisible({ timeout: 5000 })
    await therapistButton.click()

    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /Online & Abends/i }).click()
    await page.waitForTimeout(300)

    // Submit
    await page.getByRole('button', { name: /Ergebnis anzeigen/i }).click()

    // Wait for result page - use the main heading as identifier
    await expect(page.getByRole('heading', { level: 3, name: /Empfohlene nächste Schritte/i })).toBeVisible({ timeout: 15000 })

    // Verify low severity result
    await expect(page.getByText(/Minimale depressive Symptome/i).first()).toBeVisible()
    await expect(page.getByText(/Minimale Angstsymptome/i).first()).toBeVisible()
  })

  test('expands to full assessment with high scores', async ({ page }) => {
    // Navigate to triage
    await page.goto('/triage')
    await expect(page).toHaveURL(/\/triage/)

    // PHQ-2 Question 1: "An mehr als der Hälfte der Tage" (score: 2)
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    // PHQ-2 Question 2: "Beinahe jeden Tag" (score: 3)
    // Total PHQ-2 = 5 (≥3, triggers expansion)
    await page.waitForTimeout(500)
    await expect(page.getByText(/Niedergeschlagenheit/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Beinahe jeden Tag/i }).first().click()

    // Wait for expansion transition (2.5s) + buffer
    await page.waitForTimeout(3500)

    // PHQ-9 Expanded Questions (Q3-Q9)
    // Question 3: Schlaf
    await expect(page.getByText(/Schwierigkeiten.*durchzuschlafen/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    await page.waitForTimeout(500)
    // Question 4: Müdigkeit
    await expect(page.getByText(/Müdigkeit.*keine Energie/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 5: Appetit
    await expect(page.getByText(/Appetit.*übermäßiges Bedürfnis/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    await page.waitForTimeout(500)
    // Question 6: Versagensgefühle
    await expect(page.getByText(/Schlechte Meinung.*Versager/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 7: Konzentration
    await expect(page.getByText(/Schwierigkeiten.*konzentrieren/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    await page.waitForTimeout(500)
    // Question 8: Bewegung
    await expect(page.getByText(/Bewegungen.*verlangsamt.*zappelig/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    await page.waitForTimeout(500)
    // Question 9: Suizidgedanken
    await expect(page.getByText(/Gedanken.*lieber tot/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // Wait for transition to GAD-2
    await page.waitForTimeout(3500)

    // GAD-2 Question 1: "An mehr als der Hälfte der Tage" (score: 2)
    await expect(page.getByText(/Nervosität/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    // GAD-2 Question 2: "Beinahe jeden Tag" (score: 3)
    // Total GAD-2 = 5 (≥3, triggers expansion)
    await page.waitForTimeout(500)
    await expect(page.getByText(/Sorgen.*stoppen.*kontrollieren/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Beinahe jeden Tag/i }).first().click()

    // Wait for expansion transition
    await page.waitForTimeout(3500)

    // GAD-7 Expanded Questions (Q3-Q7)
    // Question 3: Übermäßige Sorgen
    await expect(page.getByText(/Übermäßige Sorgen.*verschiedener Angelegenheiten/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 4: Entspannung
    await expect(page.getByText(/Schwierigkeiten zu entspannen/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    await page.waitForTimeout(500)
    // Question 5: Rastlosigkeit
    await expect(page.getByText(/Rastlosigkeit.*Stillsitzen schwer/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 6: Reizbarkeit
    await expect(page.getByText(/Verärgerung.*Gereiztheit/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    await page.waitForTimeout(500)
    // Question 7: Angstgefühle
    await expect(page.getByText(/Gefühl der Angst.*Schlimmes passieren/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    // Wait for transition to preferences
    await page.waitForTimeout(3500)

    // Complete preferences
    await expect(page.getByRole('button', { name: /1:1 Psychotherapie/i })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /1:1 Psychotherapie/i }).click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /Online & Abends/i }).click()
    await page.waitForTimeout(300)

    // Submit
    await page.getByRole('button', { name: /Ergebnis anzeigen/i }).click()

    // Wait for result page
    await expect(page.getByRole('heading', { level: 3, name: /Empfohlene nächste Schritte/i })).toBeVisible({ timeout: 15000 })

    // Verify scores are calculated correctly
    // PHQ-9: 2+3+2+1+2+1+2+0+0 = 13 (Moderate)
    // GAD-7: 2+3+1+2+1+2+1 = 12 (Moderate)
    await expect(page.getByText('13', { exact: true }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('12', { exact: true }).first()).toBeVisible({ timeout: 10000 })
  })

  test('shows crisis resources for high suicidal ideation scores', async ({ page }) => {
    // Navigate to triage
    await page.goto('/triage')
    await expect(page).toHaveURL(/\/triage/)

    // PHQ-2 Question 1: "An mehr als der Hälfte der Tage" (score: 2)
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()
    await page.getByRole('button', { name: /An mehr als der Hälfte der Tage/i }).first().click()

    // PHQ-2 Question 2: "An einzelnen Tagen" (score: 1)
    // Total PHQ-2 = 3 (≥3, triggers expansion)
    await page.waitForTimeout(500)
    await expect(page.getByText(/Niedergeschlagenheit/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    // Wait for expansion transition
    await page.waitForTimeout(3500)

    // PHQ-9 Expanded Questions (Q3-Q9)
    // Question 3: Schlaf
    await expect(page.getByText(/Schwierigkeiten.*durchzuschlafen/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 4: Müdigkeit
    await expect(page.getByText(/Müdigkeit.*keine Energie/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    await page.waitForTimeout(500)
    // Question 5: Appetit
    await expect(page.getByText(/Appetit.*übermäßiges Bedürfnis/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 6: Versagensgefühle
    await expect(page.getByText(/Schlechte Meinung.*Versager/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    await page.waitForTimeout(500)
    // Question 7: Konzentration
    await expect(page.getByText(/Schwierigkeiten.*konzentrieren/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /An einzelnen Tagen/i }).first().click()

    await page.waitForTimeout(500)
    // Question 8: Bewegung
    await expect(page.getByText(/Bewegungen.*verlangsamt.*zappelig/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    await page.waitForTimeout(500)
    // Question 9: Suizidgedanken - HIGH SCORE!
    // "Beinahe jeden Tag" (score: 3) should trigger crisis resources
    await expect(page.getByText(/Gedanken.*lieber tot/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Beinahe jeden Tag/i }).first().click()

    // Wait for transition to GAD-2
    await page.waitForTimeout(3500)

    // GAD-2 Questions - keep low scores (no expansion needed)
    // Question 1: "Überhaupt nicht" (score: 0)
    await expect(page.getByText(/Nervosität/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // Question 2: "Überhaupt nicht" (score: 0)
    await page.waitForTimeout(500)
    await expect(page.getByText(/Sorgen.*stoppen.*kontrollieren/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // Wait for transition to preferences
    await page.waitForTimeout(3500)

    // Complete preferences
    await expect(page.getByRole('button', { name: /1:1 Psychotherapie/i })).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /1:1 Psychotherapie/i }).click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /Online & Abends/i }).click()
    await page.waitForTimeout(300)

    // Submit
    await page.getByRole('button', { name: /Ergebnis anzeigen/i }).click()

    // Wait for result page
    await expect(page.getByRole('heading', { level: 3, name: /Empfohlene nächste Schritte/i })).toBeVisible({ timeout: 15000 })

    // Verify red ampel (high risk) is shown
    await expect(page.getByText(/Rot – Hohe Belastung/i)).toBeVisible({ timeout: 5000 })

    // Verify Crisis Resources are prominently displayed
    await expect(page.getByText(/Sofortige Unterstützung verfügbar/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('heading', { name: /Telefonseelsorge/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /142/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Kriseninterventionszentrum/i })).toBeVisible()

    // Verify emergency notice
    await expect(page.getByText(/akuter Gefahr/i)).toBeVisible()
  })

  test('can navigate back through questions', async ({ page }) => {
    await page.goto('/triage')

    // Answer first question
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()
    await page.waitForTimeout(500)

    // Should be on question 2
    await expect(page.getByText(/Niedergeschlagenheit/i)).toBeVisible()

    // Click back
    const backButton = page.getByRole('button', { name: /Zurück/i })
    await backButton.click()

    // Should be back on question 1
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()
  })

  test('shows progress indicator', async ({ page }) => {
    await page.goto('/triage')

    // Check that first question is visible
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()

    // Answer first question
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()
    await page.waitForTimeout(500)

    // Verify we moved to next question
    await expect(page.getByText(/Niedergeschlagenheit/i)).toBeVisible()
  })

  test('shows therapist recommendations for LOW risk (green light)', async ({ page }) => {
    // Navigate to triage
    await page.goto('/triage')
    await expect(page).toHaveURL(/\/triage/)

    // PHQ-2 Question 1: "Überhaupt nicht" (score: 0)
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // PHQ-2 Question 2: "Überhaupt nicht" (score: 0)
    // Total PHQ-2 = 0 (<3, no expansion)
    await page.waitForTimeout(500)
    await expect(page.getByText(/Niedergeschlagenheit/i)).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // Wait for transition to GAD-2
    await page.waitForTimeout(3500)

    // GAD-2 Question 1: "Überhaupt nicht" (score: 0)
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // GAD-2 Question 2: "Überhaupt nicht" (score: 0)
    // Total GAD-2 = 0 (<3, no expansion)
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()

    // Wait for transition to preferences
    await page.waitForTimeout(3500)

    // Select preferences
    await page.getByRole('button', { name: /1:1 Psychotherapie/i }).click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /Online & Abends/i }).click()
    await page.waitForTimeout(300)

    // Submit
    await page.getByRole('button', { name: /Ergebnis anzeigen/i }).click()

    // Wait for result page
    await expect(page.getByRole('heading', { level: 3, name: /Empfohlene nächste Schritte/i })).toBeVisible({ timeout: 15000 })

    // Verify green ampel (low risk)
    await expect(page.getByText(/Grün – Geringe Belastung/i)).toBeVisible({ timeout: 5000 })

    // Verify preventive support message
    await expect(page.getByText(/Präventive Unterstützung/i)).toBeVisible({ timeout: 5000 })

    // Verify therapist recommendations are shown
    await expect(page.getByText(/Therapeut:innen für präventive Begleitung/i).or(page.getByText(/Passende Therapeut:innen/i))).toBeVisible({ timeout: 5000 })

    // Verify "Therapeut:innen ansehen" button exists
    await expect(page.getByRole('link', { name: /Therapeut:innen ansehen/i }).first()).toBeVisible()

    // Verify "Erweiterte Filter" button exists
    await expect(page.getByRole('button', { name: /Erweiterte Filter/i }).first()).toBeVisible()
  })

  test('opens filter modal when "Erweiterte Filter" button is clicked', async ({ page }) => {
    // Navigate to triage
    await page.goto('/triage')

    // Complete screening with low scores
    await expect(page.getByText(/Wenig Interesse oder Freude/i)).toBeVisible()
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()
    await page.waitForTimeout(3500)
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Überhaupt nicht/i }).first().click()
    await page.waitForTimeout(3500)
    await page.getByRole('button', { name: /1:1 Psychotherapie/i }).click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /Online & Abends/i }).click()
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: /Ergebnis anzeigen/i }).click()

    // Wait for result page
    await expect(page.getByRole('heading', { level: 3, name: /Empfohlene nächste Schritte/i })).toBeVisible({ timeout: 15000 })

    // Wait for page to fully load and stabilize
    await page.waitForTimeout(2000)

    // Wait for "Erweiterte Filter" button to be visible and enabled
    const filterButton = page.getByRole('button', { name: /Erweiterte Filter/i }).first()
    await expect(filterButton).toBeVisible({ timeout: 15000 })
    await expect(filterButton).toBeEnabled({ timeout: 5000 })

    // Click "Erweiterte Filter" button
    await filterButton.click()

    // Wait for modal animation to complete
    await page.waitForTimeout(1000)

    // Verify filter modal opens - wait longer for modal to appear
    await expect(page.getByRole('heading', { level: 2, name: /Erweiterte Filter/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/Finde die passende Therapeut:in/i)).toBeVisible({ timeout: 5000 })

    // Verify filter sections exist
    await expect(page.getByText(/Format/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Online/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Vor Ort/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Hybrid/i })).toBeVisible()

    // Verify modal can be closed
    const closeButton = page.getByLabel(/Schließen/i)
    await closeButton.click()
    await page.waitForTimeout(500)
    await expect(page.getByRole('heading', { level: 2, name: /Erweiterte Filter/i })).not.toBeVisible()
  })
})
