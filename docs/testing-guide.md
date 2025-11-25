# Testing Guide

Dieses Projekt verfügt über eine umfassende Test-Suite mit verschiedenen Test-Arten für maximale Stabilität und Regressionssicherheit.

## Schnellstart

```bash
# Alle Tests ausführen
pnpm test

# Nur Unit Tests
pnpm --filter web test

# Nur E2E Tests
pnpm e2e

# E2E Tests im UI-Modus (interaktiv)
pnpm e2e:ui

# Integration Tests
pnpm --filter web test -- tests/integration

# Visual Regression Tests
pnpm e2e -- tests/visual

# Tests mit Coverage
pnpm test -- --coverage
```

## Test-Kategorien

### 1. Unit Tests (Jest + React Testing Library)

**Lokation:** `*.test.ts(x)` neben den Quellcode-Dateien

**Verwendung:**

```bash
# Alle Unit Tests
pnpm --filter web test

# Mit Watch-Mode
pnpm --filter web test -- --watch

# Spezifischer Test
pnpm --filter web test -- TriageFlow.test.tsx
```

**Best Practices:**

- Tests direkt neben der zu testenden Datei platzieren
- Semantische Selektoren verwenden (`getByRole`, `getByLabelText`)
- Accessibility prüfen
- User-Interactions simulieren statt Implementierungsdetails zu testen

**Beispiel:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

test('button handles click', async () => {
  const handleClick = jest.fn()
  const user = userEvent.setup()

  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole('button'))

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 2. Integration Tests (Jest + Prisma)

**Lokation:** `apps/web/tests/integration/`

**Verwendung:**

```bash
# DB Integration Tests
pnpm --filter web test -- tests/integration/db

# API Contract Tests
pnpm --filter web test -- tests/integration/api
```

**Setup:**

- Benötigt PostgreSQL (lokal oder Docker)
- Test-Datenbank wird automatisch bereinigt
- Verwendet Test-Fixtures für konsistente Daten

**Beispiel:**

```typescript
import { getTestDbClient, setupDbTest, teardownDbTest } from '../../utils/db-test-client';
import { createTestUser } from '../../fixtures/user.factory';

describe('User Model', () => {
  const prisma = getTestDbClient();

  beforeEach(async () => {
    await setupDbTest(); // Reinigt DB
  });

  afterAll(async () => {
    await teardownDbTest(); // Disconnect
  });

  test('enforces unique email', async () => {
    const userData = createTestUser({ email: 'test@example.com' });
    await prisma.user.create({ data: userData });

    await expect(prisma.user.create({ data: userData })).rejects.toThrow(/Unique constraint/);
  });
});
```

### 3. E2E Tests (Playwright)

**Lokation:** `apps/web/tests/e2e/`

**Verwendung:**

```bash
# Alle E2E Tests
pnpm e2e

# Mit UI-Modus (interaktiv)
pnpm e2e:ui

# Spezifischer Test
pnpm e2e -- login-flow.spec.ts

# Debug-Modus
pnpm e2e -- --debug
```

**Best Practices:**

- Semantische Selektoren verwenden (`getByRole`, `getByLabel`)
- Auf `networkidle` warten
- Page Object Model für Wiederverwendbarkeit
- Test-Daten über Fixtures erstellen

**Beispiel:**

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Anmelden' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});
```

### 4. Visual Regression Tests (Playwright)

**Lokation:** `apps/web/tests/visual/`

**Verwendung:**

```bash
# Visual Tests ausführen
pnpm e2e -- tests/visual

# Baseline-Screenshots aktualisieren
pnpm e2e -- tests/visual --update-snapshots
```

**Wann Baselines aktualisieren:**

- Nach absichtlichen Design-Änderungen
- Bei neuen Features mit UI-Komponenten
- Immer in separatem PR mit "ui-changes" Label

**Beispiel:**

```typescript
test('homepage renders correctly', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('homepage-desktop.png', {
    maxDiffPixels: 100,
    fullPage: true,
  });
});
```

### 5. Accessibility Tests (Playwright + Axe)

**Lokation:** `apps/web/tests/e2e/docs-accessibility.spec.ts`

**Verwendung:**

```bash
# A11Y Tests
pnpm e2e -- accessibility
```

**Best Practices:**

- Automatische Axe-Scans für alle wichtigen Pages
- Keyboard-Navigation manuell testen
- Focus-Management prüfen
- Screen Reader Compatibility sicherstellen

## Test-Daten Management

### Fixtures

Test-Fixtures sind wiederverwendbare Factory-Funktionen für konsistente Test-Daten:

```typescript
import { createTestUser, createTestTherapist } from '../../fixtures/user.factory';
import { createLowRiskTriageSession } from '../../fixtures/triage.factory';

// User erstellen
const user = await createTestUser({ email: 'custom@example.com' });

// Therapeut erstellen
const therapist = await createTestTherapist();

// Triage Session erstellen
const triage = createLowRiskTriageSession(user.id);
```

### Test-DB Setup

Für lokale Entwicklung:

```bash
# Postgres starten (Docker)
docker run -d \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=test_db \
  -p 5432:5432 \
  postgres:16-alpine

# Test-DB vorbereiten
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" pnpm db:push
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" pnpm db:seed
```

## CI/CD Integration

Die Tests sind vollständig in die GitHub Actions CI-Pipeline integriert:

### Pull Request Pipeline

1. **Lint** - ESLint & Prettier Check
2. **Unit Tests** - Alle Unit Tests mit Coverage
3. **Integration Tests** - DB & API Tests
4. **Build** - Next.js Production Build
5. **E2E Tests** - Kritische User Flows
6. **A11Y Tests** - Accessibility Scans
7. **Visual Tests** - Nur bei PRs mit "ui-changes" Label

### Main Branch Pipeline

Alle Tests aus PR Pipeline + Deployment

### Test-Status

- Unit Tests: ✅ Aktiv
- Integration Tests: ✅ Aktiv
- E2E Tests: ✅ Aktiv (nur bei PRs)
- Visual Tests: ✅ Aktiv (nur bei UI-Changes)
- A11Y Tests: ✅ Aktiv (nur bei PRs)

## Debugging

### Unit Tests

```bash
# Mit Debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Einzelner Test mit Logs
pnpm test -- --verbose MyComponent.test.tsx
```

### E2E Tests

```bash
# Mit Playwright Inspector
pnpm e2e -- --debug

# Mit UI-Modus
pnpm e2e:ui

# Screenshots bei Fehlern
pnpm e2e -- --screenshot=only-on-failure

# Video-Recording
pnpm e2e -- --video=retain-on-failure
```

### Visual Regression

Wenn Visual Tests fehlschlagen:

1. Prüfe Diff-Images in `test-results/`
2. Entscheide: Ist die Änderung gewollt?
3. Falls ja: `pnpm e2e -- tests/visual --update-snapshots`
4. Falls nein: Fixe den CSS/Layout-Bug

## Test Coverage

### Coverage-Ziele

- **Unit Tests:** > 80% Line Coverage
- **Integration Tests:** 100% aller API-Routes
- **E2E Tests:** Alle kritischen User Flows

### Coverage anzeigen

```bash
# Coverage-Report generieren
pnpm test -- --coverage

# HTML-Report öffnen
open coverage/lcov-report/index.html
```

## Best Practices

### DO ✅

- **Semantische Selektoren** verwenden (role, label, text)
- **User-Interactions** simulieren statt interne State zu mocken
- **Async** richtig behandeln (`await`, `waitFor`)
- **Cleanup** nach Tests (DB, Mocks, etc.)
- **Fixtures** für Test-Daten verwenden
- **One Assert per Test** (wenn möglich)
- **Beschreibende Test-Namen** schreiben

### DON'T ❌

- **Fragile Selektoren** wie CSS-Klassen oder IDs
- **Implementation Details** testen
- **Timeouts** hart-coden (nutze `waitFor`)
- **Test-Daten** direkt in Tests erstellen
- **Shared State** zwischen Tests
- **Tests skippen** ohne Ticket/Issue

## Häufige Probleme

### Tests sind flaky

**Ursachen:**

- Race Conditions (nicht auf Async gewartet)
- Shared State zwischen Tests
- Timing-Abhängigkeiten

**Lösungen:**

```typescript
// ❌ BAD
await page.click(button);
await page.waitForTimeout(1000); // Vermeiden!

// ✅ GOOD
await page.click(button);
await page.waitForSelector('.success-message');
```

### Visual Tests schlagen fehl

**Ursachen:**

- Font-Rendering-Unterschiede
- Animation-Timing
- Browser-Version

**Lösungen:**

```typescript
await expect(page).toHaveScreenshot({
  maxDiffPixels: 100, // Toleranz erhöhen
  animations: 'disabled', // Animationen deaktivieren
});
```

### DB-Tests schlagen fehl

**Ursachen:**

- DB nicht gestartet
- Migrations nicht ausgeführt
- Test-Cleanup fehlt

**Lösungen:**

```bash
# DB-Status prüfen
docker ps | grep postgres

# Test-DB neu aufsetzen
DATABASE_URL="postgresql://..." pnpm db:push
```

## Weitere Ressourcen

- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [Playwright Docs](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Strategy](./testing-strategy.md)

## Hilfe & Support

Bei Problemen mit Tests:

1. Prüfe diese Dokumentation
2. Schaue in existierende Tests (als Beispiele)
3. Frage im Team-Chat
4. Erstelle ein Issue mit Test-Logs
