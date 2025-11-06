# Test Suite

Diese Test-Suite bietet umfassende Regressionstests für die Mental Health Platform.

## Struktur

```
tests/
├── e2e/                    # End-to-End Tests (Playwright)
│   ├── login-flow.spec.ts
│   ├── triage-flow.spec.ts
│   ├── therapist-search.spec.ts
│   └── docs-accessibility.spec.ts
│
├── visual/                 # Visual Regression Tests
│   └── pages.spec.ts
│
├── integration/            # Integration Tests
│   ├── db/                # Database Integration Tests
│   │   ├── user.test.ts
│   │   └── therapist-profile.test.ts
│   └── api/               # API Contract Tests
│       └── triage.contract.test.ts
│
├── fixtures/              # Test Data Factories
│   ├── user.factory.ts
│   ├── therapist.factory.ts
│   └── triage.factory.ts
│
└── utils/                 # Test Utilities
    ├── db-test-client.ts
    └── api-test-client.ts
```

## Schnellstart

```bash
# Alle Tests
pnpm test

# E2E Tests
pnpm e2e

# E2E Tests im UI-Modus
pnpm e2e:ui

# Integration Tests
pnpm test -- tests/integration

# Visual Tests
pnpm e2e -- tests/visual
```

## Neue Tests schreiben

### Unit Test für Komponente

```typescript
// app/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### Integration Test für DB

```typescript
// tests/integration/db/mymodel.test.ts
import { getTestDbClient, setupDbTest } from '../../utils/db-test-client'

describe('MyModel', () => {
  const prisma = getTestDbClient()

  beforeEach(async () => {
    await setupDbTest()
  })

  it('creates record', async () => {
    const record = await prisma.myModel.create({ data: {...} })
    expect(record).toBeTruthy()
  })
})
```

### E2E Test

```typescript
// tests/e2e/my-flow.spec.ts
import { test, expect } from '@playwright/test'

test('user can complete flow', async ({ page }) => {
  await page.goto('/start')
  await page.getByRole('button', { name: 'Next' }).click()
  await expect(page).toHaveURL(/\/success/)
})
```

## Mehr Informationen

Siehe [Testing Guide](../../docs/testing-guide.md) für detaillierte Dokumentation.
