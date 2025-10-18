import { test, expect } from '@playwright/test';

test.describe('Triage MVP Flow', () => {
  test('completes guided triage and surfaces recommendation summary', async ({ page }) => {
    await page.goto('/triage');
    await expect(page.getByRole('heading', { name: /Ersteinschätzung/i }).first()).toBeVisible();

    await page.getByRole('button', { name: /Selten oder nie/ }).click();
    await expect(page.getByRole('heading', { name: /Energie & Fokus/i })).toBeVisible();

    await page.getByRole('button', { name: /Kaum/ }).click();
    await expect(page.getByRole('heading', { name: /Innere Anspannung/i })).toBeVisible();

    await page.getByRole('button', { name: /Selten/ }).first().click();
    await expect(page.getByRole('heading', { name: /Was hilft dir gerade am meisten/i })).toBeVisible();

    await page.getByRole('button', { name: '1:1 Therapie oder Beratung' }).click();
    await page.getByRole('button', { name: 'Digitale Programme & Übungen' }).click();
    await page.getByRole('button', { name: /^Weiter$/ }).click();

    await expect(page.getByRole('heading', { name: /Wie flexibel bist du terminlich/i })).toBeVisible();
    await page.getByRole('button', { name: 'Online & Abends' }).click();
    await page.getByRole('button', { name: 'Hybrid' }).click();
    await page.getByRole('button', { name: /^Weiter$/ }).click();

    await expect(page.getByRole('heading', { name: /Deine Klarthera Empfehlung/i })).toBeVisible();
    await expect(page.getByText(/Score \d+ von 18/i)).toBeVisible();
    await expect(page.getByText(/Empfohlene Pilot-Therapeut:innen/i)).toBeVisible();
    await expect(page.getByText(/Passende Programme/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Therapeut:innen ansehen/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Kurse vergleichen/i })).toBeVisible();
  });
});
