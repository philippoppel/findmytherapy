import { test, expect } from '@playwright/test';
import { prisma } from '@mental-health/db';

test.describe('Therapist Microsite Feature', () => {
  let therapistEmail: string;
  let therapistPassword: string;
  let therapistSlug: string;

  test.beforeAll(async () => {
    // Create a test therapist with verified status
    therapistEmail = `therapist.microsite.${Date.now()}@test.com`;
    therapistPassword = 'Test1234!';

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(therapistPassword, 10);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email: therapistEmail,
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'Therapeut',
        role: 'THERAPIST',
        emailVerified: new Date(),
      },
    });

    const profile = await prisma.therapistProfile.create({
      data: {
        userId: user.id,
        status: 'VERIFIED',
        displayName: 'Dr. Test Therapeut',
        title: 'Klinische Psychologin',
        headline: 'Spezialisiert auf Angststörungen und Depression',
        specialties: ['Angststörungen', 'Depression', 'Burnout', 'Trauma'],
        modalities: ['Verhaltenstherapie', 'Gesprächstherapie'],
        services: ['Einzeltherapie', 'Paartherapie'],
        languages: ['Deutsch', 'Englisch'],
        priceMin: 8000,
        priceMax: 12000,
        city: 'Wien',
        country: 'AT',
        online: true,
        acceptingClients: true,
        about: 'Ich bin eine erfahrene Therapeutin mit Schwerpunkt auf Angststörungen.',
        micrositeStatus: 'DRAFT',
      },
    });

    therapistSlug = profile.micrositeSlug || 'test-therapeut';
  });

  test.afterAll(async () => {
    // Cleanup
    await prisma.therapistProfile.deleteMany({
      where: { user: { email: therapistEmail } },
    });
    await prisma.user.deleteMany({
      where: { email: therapistEmail },
    });
  });

  test.describe('Profile Edit → Public View Flow', () => {
    test('should update profile and see changes on microsite', async ({ page }) => {
      // 1. Login as therapist
      await page.goto('/login');
      await page.fill('input[name="email"]', therapistEmail);
      await page.fill('input[name="password"]', therapistPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard/**');

      // 2. Navigate to profile editor
      await page.goto('/dashboard/profile');
      await page.waitForSelector('input[name="displayName"]');

      // 3. Update profile information
      const newHeadline = `Updated Headline ${Date.now()}`;
      await page.fill('input[name="headline"]', newHeadline);

      // Save profile
      await page.click('button[type="submit"]');
      await page.waitForSelector('text=/erfolgreich|gespeichert/i', { timeout: 10000 });

      // 4. Publish microsite
      await page.goto('/dashboard/therapist/microsite');
      await page.waitForSelector('text=/Veröffentlichen/i');
      await page.click('button:has-text("Veröffentlichen")');
      await page.waitForSelector('text=/Veröffentlicht/i');

      // Get slug from page
      const slugElement = await page.locator('input[id="slug"]');
      const slug = await slugElement.inputValue();

      // 5. Visit public microsite (in new context to simulate public user)
      const context = await page.context().browser()!.newContext();
      const publicPage = await context.newPage();
      await publicPage.goto(`/t/${slug}`);

      // 6. Verify changes are visible on microsite
      await expect(publicPage.locator(`text=${newHeadline}`)).toBeVisible();
      await expect(publicPage.locator('text=/Dr. Test Therapeut/i')).toBeVisible();
      await expect(publicPage.locator('text=/Verifiziert/i')).toBeVisible();

      await context.close();
    });
  });

  test.describe('Lead Capture Flow', () => {
    test('should submit lead form and see it in dashboard', async ({ page, context }) => {
      // 1. Ensure microsite is published
      await page.goto('/login');
      await page.fill('input[name="email"]', therapistEmail);
      await page.fill('input[name="password"]', therapistPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard/**');

      await page.goto('/dashboard/therapist/microsite');
      const publishButton = await page.locator('button:has-text("Veröffentlichen"), button:has-text("Zurückziehen")');
      const buttonText = await publishButton.textContent();

      if (buttonText?.includes('Veröffentlichen')) {
        await publishButton.click();
        await page.waitForSelector('text=/Veröffentlicht/i');
      }

      const slugElement = await page.locator('input[id="slug"]');
      const slug = await slugElement.inputValue();

      // 2. Open microsite as public user (new context)
      const publicContext = await context.browser()!.newContext();
      const publicPage = await publicContext.newPage();
      await publicPage.goto(`/t/${slug}`);
      await publicPage.waitForSelector('h1:has-text("Dr. Test Therapeut")');

      // 3. Fill out contact form
      const uniqueId = Date.now();
      await publicPage.fill('input[id="name"]', `Test Client ${uniqueId}`);
      await publicPage.fill('input[id="email"]', `client.${uniqueId}@test.com`);
      await publicPage.fill('textarea[id="message"]', 'Ich möchte gerne einen Termin vereinbaren. Ich habe Probleme mit Angstzuständen.');

      // Accept consent checkbox
      await publicPage.check('input[type="checkbox"]');

      // Submit form
      await publicPage.click('button[type="submit"]:has-text("Anfrage senden")');

      // Wait for success message
      await publicPage.waitForSelector('text=/gesendet|erfolgreich/i', { timeout: 10000 });
      await expect(publicPage.locator('text=/gesendet|erfolgreich/i')).toBeVisible();

      await publicContext.close();

      // 4. Check lead in therapist dashboard
      await page.goto('/dashboard/therapist/leads');
      await page.waitForSelector('h1:has-text("Kontaktanfragen")');

      // Verify lead appears in table
      await expect(page.locator(`text=Test Client ${uniqueId}`)).toBeVisible();
      await expect(page.locator(`text=client.${uniqueId}@test.com`)).toBeVisible();
    });
  });

  test.describe('Publishing Workflow', () => {
    test('should toggle between draft and published states', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.fill('input[name="email"]', therapistEmail);
      await page.fill('input[name="password"]', therapistPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard/**');

      // Go to microsite dashboard
      await page.goto('/dashboard/therapist/microsite');
      await page.waitForSelector('h1:has-text("Meine Microsite")');

      const slugElement = await page.locator('input[id="slug"]');
      const slug = await slugElement.inputValue();

      // Test 1: Publish microsite
      const publishButton = await page.locator('button:has-text("Veröffentlichen"), button:has-text("Zurückziehen")').first();
      const initialText = await publishButton.textContent();

      if (initialText?.includes('Zurückziehen')) {
        // Already published, unpublish first
        await publishButton.click();
        await page.waitForSelector('text=/Entwurf/i');
      }

      // Now publish
      await page.click('button:has-text("Veröffentlichen")');
      await page.waitForSelector('text=/Veröffentlicht/i');
      await expect(page.locator('span:has-text("✓ Veröffentlicht")')).toBeVisible();

      // Verify microsite is accessible
      const response = await page.request.get(`/t/${slug}`);
      expect(response.status()).toBe(200);

      // Test 2: Unpublish microsite
      await page.click('button:has-text("Zurückziehen")');
      await page.waitForSelector('text=/Entwurf/i');
      await expect(page.locator('span:has-text("Entwurf")').first()).toBeVisible();

      // Verify microsite returns 404
      const unpublishedResponse = await page.request.get(`/t/${slug}`);
      expect(unpublishedResponse.status()).toBe(404);
    });
  });

  test.describe('Slug Management', () => {
    test('should update slug and redirect from old URL', async ({ page }) => {
      // Login
      await page.goto('/login');
      await page.fill('input[name="email"]', therapistEmail);
      await page.fill('input[name="password"]', therapistPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard/**');

      // Go to microsite dashboard
      await page.goto('/dashboard/therapist/microsite');
      await page.waitForSelector('h1:has-text("Meine Microsite")');

      // Get current slug
      const slugInput = await page.locator('input[id="slug"]');
      const oldSlug = await slugInput.inputValue();

      // Ensure microsite is published
      const publishButton = await page.locator('button:has-text("Veröffentlichen"), button:has-text("Zurückziehen")').first();
      const buttonText = await publishButton.textContent();

      if (buttonText?.includes('Veröffentlichen')) {
        await publishButton.click();
        await page.waitForSelector('text=/Veröffentlicht/i');
      }

      // Change slug
      const newSlug = `test-therapeut-${Date.now()}`;
      await slugInput.fill(newSlug);

      // Wait for availability check (500ms debounce + API call)
      await page.waitForSelector('text=/Verfügbar/i', { timeout: 10000 });

      // Save new slug
      await page.click('button:has-text("Slug speichern")');
      await page.waitForSelector('text=/aktualisiert|erfolgreich/i');

      // Test 1: New slug works
      await page.goto(`/t/${newSlug}`);
      await expect(page.locator('h1:has-text("Dr. Test Therapeut")').first()).toBeVisible();

      // Test 2: Old slug redirects to new slug
      const response = await page.goto(`/t/${oldSlug}`);
      expect(page.url()).toContain(newSlug);
    });
  });

  test.describe('Microsite SEO & Structure', () => {
    test('should have proper meta tags and structured data', async ({ page }) => {
      // Login and publish
      await page.goto('/login');
      await page.fill('input[name="email"]', therapistEmail);
      await page.fill('input[name="password"]', therapistPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard/**');

      await page.goto('/dashboard/therapist/microsite');
      const slugElement = await page.locator('input[id="slug"]');
      const slug = await slugElement.inputValue();

      // Ensure published
      const publishButton = await page.locator('button:has-text("Veröffentlichen"), button:has-text("Zurückziehen")').first();
      const buttonText = await publishButton.textContent();

      if (buttonText?.includes('Veröffentlichen')) {
        await publishButton.click();
        await page.waitForSelector('text=/Veröffentlicht/i');
      }

      // Visit microsite
      await page.goto(`/t/${slug}`);

      // Check for Schema.org structured data
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      expect(structuredData).toBeTruthy();
      expect(structuredData).toContain('"@type"');
      expect(structuredData).toContain('Person');

      // Check meta tags
      const title = await page.title();
      expect(title).toContain('Dr. Test Therapeut');

      // Check Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Login and get slug
      await page.goto('/login');
      await page.fill('input[name="email"]', therapistEmail);
      await page.fill('input[name="password"]', therapistPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard/**');

      await page.goto('/dashboard/therapist/microsite');
      const slugElement = await page.locator('input[id="slug"]');
      const slug = await slugElement.inputValue();

      // Visit microsite on mobile
      await page.goto(`/t/${slug}`);

      // Check that key elements are visible
      await expect(page.locator('h1').first()).toBeVisible();

      // Check that contact form is accessible
      const contactForm = await page.locator('form');
      await expect(contactForm).toBeVisible();
    });
  });
});
