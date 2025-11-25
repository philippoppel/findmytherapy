# Test-Strategie Mental Health Platform

## Übersicht

Diese Test-Suite ist darauf ausgelegt, robuste Regressionstests bereitzustellen, die auch bei häufigen Änderungen an GUI und DB-Schema stabil bleiben.

## Prinzipien

### 1. **Stabilität durch Abstraktion**

- Tests verwenden semantische Selektoren (role, label) statt fragiler CSS-Selektoren
- DB-Tests validieren Constraints und Relations, nicht konkrete Feldnamen
- API-Tests prüfen Contracts (Struktur, Typen) statt exakte Responses

### 2. **Layered Testing Pyramid**

```
           /\
          /  \     E2E Tests (wenige, kritische Flows)
         /----\
        /      \   Integration Tests (API, DB)
       /--------\
      /          \ Unit Tests (viele, schnell, isoliert)
     /------------\
```

### 3. **Visual Regression Detection**

- Automatische Screenshots bei kritischen Breakpoints
- Pixel-basierter Vergleich für Layout-Probleme
- Erkennung von überlaufendem Text, falschem Scaling

## Test-Kategorien

### 1. Unit Tests

**Ziel:** Isolierte Komponenten und Funktionen testen

**Abdeckung:**

- UI-Komponenten (`@mental-health/ui`)
  - Rendering mit verschiedenen Props
  - Accessibility (aria-labels, keyboard navigation)
  - Interaktionen (onClick, onChange)
- Utility-Funktionen
- Validation Schemas (Zod)
- Business Logic (Scoring, Matching-Algorithmen)

**Tools:** Jest + React Testing Library

**Lokation:** Neben der Datei als `.test.ts(x)`

**Beispiel:**

```typescript
// packages/ui/src/components/button.test.tsx
describe('Button', () => {
  it('renders with correct variant', () => {...})
  it('is accessible via keyboard', () => {...})
  it('handles loading state', () => {...})
})
```

### 2. DB Integration Tests

**Ziel:** Validierung von DB-Operationen und Schema-Constraints

**Abdeckung:**

- CRUD-Operationen für alle Models
- Relations und Cascading Deletes
- Unique Constraints
- Indexes Performance
- Schema Migrations (Backward Compatibility)

**Tools:** Jest + Prisma Test Client

**Lokation:** `apps/web/tests/integration/db/`

**Beispiel:**

```typescript
// tests/integration/db/user.test.ts
describe('User Model', () => {
  it('enforces unique email constraint', async () => {...})
  it('cascades delete to therapist profile', async () => {...})
  it('indexes email lookups efficiently', async () => {...})
})
```

**Strategie bei Schema-Änderungen:**

- Tests validieren Constraints, nicht Feldnamen
- Migrations werden mit Rollback-Tests geprüft
- Seed-Data wird programmatisch generiert

### 3. API Contract Tests

**Ziel:** API-Stabilität garantieren, auch wenn sich Implementierung ändert

**Abdeckung:**

- Response Shape Validation (Zod Schemas)
- Status Codes
- Error Handling
- Authentication/Authorization
- Rate Limiting

**Tools:** Jest + MSW (Mock Service Worker) für Mocking

**Lokation:** `apps/web/tests/integration/api/`

**Beispiel:**

```typescript
// tests/integration/api/triage.contract.test.ts
describe('POST /api/triage', () => {
  it('returns valid triage result schema', async () => {
    const response = await fetch('/api/triage', {...})
    const schema = TriageResultSchema
    expect(schema.safeParse(await response.json()).success).toBe(true)
  })
})
```

### 4. E2E Tests

**Ziel:** Kritische User Flows Ende-zu-Ende testen

**Abdeckung:**

- **Authentifizierung:** Login, Logout, 2FA, Password Reset
- **Triage Flow:** Fragebogen ausfüllen → Ergebnis → Therapeuten-Matching
- **Therapeuten-Suche:** Filter, Sortierung, Detailansicht
- **Buchung:** Termin buchen, Bezahlung
- **Dashboard:** Therapeut/Client-spezifische Funktionen

**Tools:** Playwright

**Lokation:** `apps/web/tests/e2e/`

**Stabilität:**

- Semantic Selektoren: `page.getByRole('button', { name: 'Login' })`
- Page Object Model für Wiederverwendbarkeit
- Fixtures für Test-Daten

**Beispiel:**

```typescript
// tests/e2e/user-journey-client.spec.ts
test('complete client journey', async ({ page }) => {
  await authPage.register({ email, password });
  await triagePage.fillQuestionnaire({ mood: 5, anxiety: 7 });
  await therapistPage.selectTherapist(0);
  await bookingPage.bookAppointment({ date: '2025-11-01' });
  await expect(page.getByText('Termin bestätigt')).toBeVisible();
});
```

### 5. Visual Regression Tests

**Ziel:** Layout-Probleme automatisch erkennen

**Abdeckung:**

- Alle Public Pages (Marketing, Triage, Login, etc.)
- Dashboard-Views (Therapist, Client, Admin)
- Responsive Breakpoints (Mobile, Tablet, Desktop)
- Dark/Light Mode
- Verschiedene Sprachen (de-AT, en)

**Tools:** Playwright Visual Comparisons

**Lokation:** `apps/web/tests/visual/`

**Strategie:**

- Baseline-Screenshots bei stabilem Design
- Toleranz für Antialiasing und kleine Pixel-Unterschiede
- Separate Baselines pro Viewport

**Beispiel:**

```typescript
// tests/visual/pages.spec.ts
test('homepage renders correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage-desktop.png', {
    maxDiffPixels: 100,
    fullPage: true,
  });
});
```

**Overflow-Detection:**

```typescript
test('no text overflow in therapist cards', async ({ page }) => {
  await page.goto('/therapists');
  const cards = page.getByTestId('therapist-card');
  for (const card of await cards.all()) {
    const box = await card.boundingBox();
    const scrollWidth = await card.evaluate((el) => el.scrollWidth);
    const clientWidth = await card.evaluate((el) => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
  }
});
```

### 6. Accessibility Tests

**Ziel:** WCAG 2.1 AA Compliance sicherstellen

**Abdeckung:**

- Automated Scans mit Axe-Core
- Keyboard Navigation
- Screen Reader Compatibility
- Focus Management
- Color Contrast

**Tools:** Playwright + Axe-Core

**Lokation:** `apps/web/tests/a11y/`

### 7. Performance Tests (Optional)

**Ziel:** Performance-Regressions vermeiden

**Abdeckung:**

- Lighthouse Scores (> 90)
- API Response Times (< 500ms p95)
- Bundle Size (< 200KB gzipped)

**Tools:** Lighthouse CI, Playwright Performance Profiling

## Test Data Management

### Fixtures

- **Typ-sichere Factories** für Test-Daten
- Faker für realistische Daten
- Separate Seeds für Unit vs. E2E Tests

```typescript
// tests/fixtures/user.factory.ts
export const createTestUser = (overrides?: Partial<User>) => ({
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  role: 'CLIENT',
  ...overrides,
});
```

### DB-Setup für Tests

- **Unit Tests:** In-Memory SQLite (schnell, isoliert)
- **Integration Tests:** Docker PostgreSQL (realistisch)
- **E2E Tests:** Seeded PostgreSQL (stabile Daten)

## CI/CD Integration

### GitHub Actions Pipeline

```yaml
jobs:
  unit-tests: # Schnell, immer ausführen
  integration: # Bei jedem PR
  e2e: # Bei jedem PR
  visual: # Bei PRs mit UI-Änderungen
  a11y: # Bei jedem PR
```

### Test-Strategie nach Branch

- **develop:** Unit + Integration
- **PR → main:** Alle Tests
- **main:** Alle Tests + Deployment

## Maintenance

### Baseline Updates

- Visual Baselines: Nach absichtlichen Design-Änderungen
- Contract Tests: Bei API-Versioning
- E2E Tests: Bei Major-Features

### Test Coverage Goals

- **Unit Tests:** > 80%
- **Integration Tests:** 100% aller API-Routes
- **E2E Tests:** Alle kritischen Flows
- **Visual Tests:** Alle Public Pages

## Migration Guide

### Bei DB-Schema-Änderungen

1. Schreibe Migration + Rollback-Test
2. Aktualisiere Seed-Scripts
3. Validiere, dass alte Tests noch laufen
4. Update nur Tests mit Breaking Changes

### Bei UI-Redesign

1. Erstelle neue Feature-Branch
2. Update Visual Baselines schrittweise
3. Validiere, dass alle Flows funktional bleiben
4. Merge nach Baseline-Approval

## Tools & Bibliotheken

- **Jest:** Unit Tests
- **React Testing Library:** Component Tests
- **Playwright:** E2E, Visual, A11y
- **Axe-Core:** Accessibility Scanning
- **MSW:** API Mocking
- **Faker:** Test Data
- **Prisma:** DB Testing
- **Zod:** Schema Validation

## Nächste Schritte

1. ✅ Test-Strategie dokumentieren
2. 🔄 DB Integration Tests implementieren
3. 🔄 API Contract Tests aufbauen
4. 🔄 Visual Regression Tests einrichten
5. 🔄 E2E Tests erweitern
6. 🔄 CI-Pipeline aktivieren
