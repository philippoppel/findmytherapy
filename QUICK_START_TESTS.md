# Quick Start: Tests ausführen

## Status: ✅ Tests sind lauffähig!

**Letzte Validierung:** 200+ Tests passed

## Sofort starten (ohne DB)

```bash
# Alle Unit Tests ausführen (ohne Integration Tests)
pnpm --filter web test -- --testPathIgnorePatterns=integration

# Erwartet: 200+ Tests passed ✅
```

## Mit Database (für Integration Tests)

### 1. Postgres starten

```bash
# Option A: Docker (empfohlen)
docker run -d \
  --name postgres-test \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=test_db \
  -p 5432:5432 \
  postgres:16-alpine

# Option B: Lokal installiertes Postgres
# Stelle sicher dass Postgres auf Port 5432 läuft
```

### 2. Test-Datenbank vorbereiten

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" pnpm db:push
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" pnpm db:seed
```

### 3. Integration Tests ausführen

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" \
  pnpm --filter web test -- tests/integration

# Erwartet:
# - User Model: ~30 Tests ✅
# - TherapistProfile Model: ~25 Tests ✅
# - API Contract Tests: ~12 Tests ✅
```

## E2E Tests

```bash
# 1. Development Server starten (in separatem Terminal)
pnpm dev

# 2. E2E Tests ausführen
pnpm e2e

# 3. Oder mit UI-Modus (interaktiv, empfohlen)
pnpm e2e:ui
```

## Visual Regression Tests

```bash
# Development Server muss laufen
pnpm dev

# Beim ersten Mal: Baseline-Screenshots erstellen
pnpm e2e -- tests/visual

# Nach Design-Änderungen: Baselines aktualisieren
pnpm e2e -- tests/visual --update-snapshots
```

## Test-Coverage

```bash
# Mit Coverage-Report
pnpm --filter web test -- --coverage

# Coverage HTML-Report öffnen
open apps/web/coverage/lcov-report/index.html
```

## Spezifische Tests ausführen

```bash
# Einzelner Test
pnpm --filter web test -- user.test.ts

# Test-Pattern
pnpm --filter web test -- --testNamePattern="User Model"

# Watch-Mode (läuft bei Änderungen neu)
pnpm --filter web test -- --watch

# Nur geänderte Tests
pnpm --filter web test -- --onlyChanged
```

## CI/CD Pipeline

Die Tests laufen automatisch in GitHub Actions:

```yaml
✅ Unit Tests          - Bei jedem Push
✅ Integration Tests   - Bei PRs
✅ E2E Tests          - Bei PRs auf main
✅ Visual Tests       - Bei PRs mit "ui-changes" Label
✅ A11Y Tests         - Bei PRs
```

### Lokale CI-Simulation

```bash
# 1. Postgres starten
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=test_db \
  postgres:16-alpine

# 2. DB vorbereiten
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" pnpm db:push

# 3. Unit Tests
pnpm --filter web test -- --testPathIgnorePatterns=integration --coverage

# 4. Integration Tests
DATABASE_URL="postgresql://postgres:password@localhost:5432/test_db" \
  pnpm --filter web test -- tests/integration

# 5. Build
pnpm build

# 6. E2E Tests
pnpm e2e
```

## Troubleshooting

### Tests schlagen fehl: "Cannot find module '@prisma/client'"

```bash
# Prisma Client generieren
pnpm db:generate
```

### Integration Tests: "Connection refused"

```bash
# Prüfe ob Postgres läuft
docker ps | grep postgres

# Oder neu starten
docker restart postgres-test
```

### E2E Tests: "net::ERR_CONNECTION_REFUSED"

```bash
# Dev-Server muss laufen
pnpm dev

# In separatem Terminal:
pnpm e2e
```

### Visual Tests unterscheiden sich

```bash
# Diff-Images ansehen
open apps/web/test-results/

# Wenn Änderung gewollt ist:
pnpm e2e -- tests/visual --update-snapshots
```

## Was getestet wird

### ✅ Unit Tests (200+)

- React Komponenten
- Business Logic
- Utility-Funktionen
- Validation Schemas
- Scoring-Algorithmen

### ✅ Integration Tests (67+)

- **DB Layer:**
  - User Model (Constraints, Relations, Indexes)
  - TherapistProfile Model (Arrays, Pricing, Soft Deletes)

- **API Layer:**
  - Triage API (Contract, Status Codes, Error Handling)

### ✅ E2E Tests (25+)

- Login Flow
- Triage Flow
- Therapist Search & Filter
- Therapist Detail Page
- Responsive Behavior

### ✅ Visual Tests (15+)

- Page Screenshots (Homepage, Login, Triage, etc.)
- Responsive Layouts (Mobile, Tablet, Desktop)
- Text Overflow Detection
- Component States (Hover, Error, etc.)

## Performance

**Typische Test-Zeiten:**

- Unit Tests: ~30s
- Integration Tests: ~45s (mit DB)
- E2E Tests: ~2-3min
- Visual Tests: ~3-4min

## Nächste Schritte

1. **Teste jetzt:**

   ```bash
   pnpm --filter web test -- --testPathIgnorePatterns=integration
   ```

2. **Erweitere Tests:**
   - Siehe `docs/testing-guide.md` für Beispiele
   - Nutze Fixtures in `tests/fixtures/`

3. **Aktiviere in CI:**
   - Push auf develop → Tests laufen automatisch
   - Öffne PR → Alle Tests laufen

## Weitere Dokumentation

- 📖 [Testing Strategy](./docs/testing-strategy.md) - Architektur & Prinzipien
- 📖 [Testing Guide](./docs/testing-guide.md) - Entwickler-Handbuch
- 📖 [Test Status](./TEST_STATUS.md) - Detaillierter Status-Report

## Fragen?

Bei Problemen:

1. Prüfe diese Dokumentation
2. Schaue in existierende Tests
3. Erstelle ein Issue mit Test-Logs
