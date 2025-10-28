# Contributing Guide

Danke für dein Interesse an FindMyTherapy! Dieses Dokument beschreibt unseren Entwicklungsprozess.

## 📋 Inhaltsverzeichnis

- [Setup](#setup)
- [Entwicklungsworkflow](#entwicklungsworkflow)
- [Code-Standards](#code-standards)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [CI/CD Pipeline](#cicd-pipeline)

## Setup

### Voraussetzungen
- Node.js 20.x
- pnpm 9.x
- Docker & Docker Compose
- Git

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd mental-health-platform

# Dependencies installieren
pnpm install

# Docker-Services starten
docker-compose up -d

# Datenbank initialisieren
pnpm db:push
pnpm db:seed

# Dev-Server starten
pnpm dev
```

Die App läuft jetzt auf `http://localhost:3000`

### Environment Variables

Kopiere `.env.example` nach `.env` und passe die Werte an:

```bash
cp .env.example .env
```

Wichtige Variablen:
- `DATABASE_URL`: PostgreSQL Connection String
- `NEXTAUTH_URL`: App-URL (lokal: `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Secret für Session-Verschlüsselung

## Entwicklungsworkflow

### Branch-Strategie

- `main` - Production (geschützt)
- `develop` - Development Branch
- `feature/*` - Feature-Branches
- `bugfix/*` - Bugfix-Branches
- `hotfix/*` - Hotfix-Branches

### Feature entwickeln

```bash
# Neuen Feature-Branch erstellen
git checkout -b feature/my-new-feature develop

# Entwickeln...
# Tests schreiben...

# Vor jedem Commit
pnpm lint          # Linting
pnpm test          # Unit Tests
pnpm build         # Build testen

# Committen (folgt Conventional Commits)
git commit -m "feat: add new feature"

# Pushen und PR erstellen
git push origin feature/my-new-feature
```

## Code-Standards

### TypeScript

- Verwende **strenge TypeScript-Typen**, keine `any`
- Nutze Type-Inference wo möglich
- Exportiere Types aus zentralen Dateien

```typescript
// ✅ Gut
interface User {
  id: string
  email: string
  role: UserRole
}

// ❌ Schlecht
function getUser(): any {
  // ...
}
```

### React Components

- **Funktionale Komponenten** mit Hooks
- Props mit TypeScript-Interfaces typisieren
- Verwende `const` für Komponenten

```typescript
// ✅ Gut
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary' }) => {
  return <button onClick={onClick} className={variant}>{children}</button>
}

// ❌ Schlecht
export function Button(props: any) {
  return <button>{props.children}</button>
}
```

### Server Components vs Client Components

- **Default: Server Components** (Next.js 14)
- Nur `"use client"` wenn nötig (State, Events, Browser APIs)
- Datenbank-Zugriffe nur in Server Components

```typescript
// ✅ Server Component (Default)
export default async function Page() {
  const data = await prisma.user.findMany()
  return <div>{data.length} users</div>
}

// ✅ Client Component (wenn nötig)
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Styling

- **Tailwind CSS** für Styling
- Verwende Design-System Komponenten aus `@mental-health/ui`
- Responsive Design (mobile-first)

```tsx
// ✅ Gut
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
  <Button variant="primary">Click me</Button>
</div>

// ❌ Schlecht
<div style={{ display: 'flex' }}>
  <button>Click me</button>
</div>
```

### Naming Conventions

- **Dateien**: kebab-case (`user-profile.tsx`)
- **Komponenten**: PascalCase (`UserProfile`)
- **Funktionen**: camelCase (`getUserProfile`)
- **Konstanten**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserProfile`)

## Testing

### Unit Tests (Jest)

- Teste kritische Business-Logik
- Teste komplexe Komponenten
- Mindestens 70% Coverage

```typescript
// user.test.ts
import { calculateAge } from './user'

describe('calculateAge', () => {
  it('should calculate age correctly', () => {
    expect(calculateAge('1990-01-01')).toBe(34)
  })
})
```

### E2E Tests (Playwright)

- Teste kritische User-Flows
- Teste Happy Paths
- Teste Error-Handling

```typescript
// triage.spec.ts
test('complete triage flow', async ({ page }) => {
  await page.goto('/triage')
  await page.click('text=Start')
  // ... weitere Steps
  await expect(page).toHaveURL('/triage/results')
})
```

### Test-Befehle

```bash
pnpm test              # Unit Tests
pnpm test --coverage   # Mit Coverage
pnpm e2e               # E2E Tests
pnpm e2e:ui            # E2E Tests mit UI
```

## Git Workflow

### Commit Messages

Folge [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: Neues Feature
- `fix`: Bugfix
- `docs`: Dokumentation
- `style`: Formatting, keine Code-Änderung
- `refactor`: Code-Refactoring
- `test`: Tests hinzufügen/ändern
- `chore`: Build, Dependencies, etc.
- `perf`: Performance-Verbesserung

**Beispiele:**

```bash
feat(auth): add two-factor authentication
fix(triage): correct PHQ-9 score calculation
docs: update README with deployment instructions
refactor(api): extract user validation logic
test(triage): add comprehensive triage flow tests
chore: update dependencies to latest versions
perf(homepage): implement ISR caching with 5-minute revalidation
```

### Pre-commit Hooks

Husky führt automatisch vor jedem Commit aus:

```bash
# 1. Lint-staged - ESLint & Prettier für staged files
# 2. Type-check
```

### Pull Requests

1. **Erstelle einen Branch** von `develop`
2. **Entwickle & teste** dein Feature
3. **Update deinen Branch** mit `develop`
4. **Erstelle PR** mit aussagekräftiger Beschreibung
5. **Warte auf CI** - alle Tests müssen grün sein
6. **Code Review** - mindestens 1 Approval erforderlich
7. **Merge** - Squash & Merge in `develop`

**PR-Template:**

```markdown
## Beschreibung
Kurze Beschreibung der Änderungen

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests passing
- [ ] No console errors
```

## CI/CD Pipeline

### GitHub Actions Workflow

Bei jedem Push/PR laufen automatisch:

1. **Lint** - ESLint & Prettier
2. **Unit Tests** - Jest mit Coverage
3. **Build** - Next.js Production Build
4. **E2E Tests** - Playwright
5. **Accessibility Tests** - Axe-Core
6. **Security Scan** - npm audit

### Pipeline-Status

- ✅ Alle Checks müssen grün sein
- ❌ Bei Fehlern: Fix und erneut pushen
- Pipeline läuft ca. 5-10 Minuten

### Deployment

**Production (main):**
- Automatisch bei Merge in `main`
- Vercel deployed automatisch
- Domain: `https://findmytherapy.net`

**Preview (PRs):**
- Automatisch für jeden PR
- Eigene Preview-URL
- Ideal für Testing & Reviews

## Best Practices

### Performance

- **ISR Caching** für statische Seiten mit `revalidate`
- **Server Components** wo möglich
- **Image Optimization** mit `next/image`
- **Code Splitting** automatisch durch Next.js

### Security

- **Keine Secrets** in Code committen
- **Environment Variables** für Konfiguration
- **Input Validation** mit Zod
- **SQL Injection** - Prisma schützt automatisch

### Accessibility

- **Semantic HTML** verwenden
- **ARIA Labels** für interaktive Elemente
- **Keyboard Navigation** testen
- **Color Contrast** prüfen (WCAG AA)

### Database

- **Migrations** für Schema-Änderungen
- **Seeds** für Test-Daten
- **Transactions** für kritische Operationen
- **Indexes** für häufige Queries

## Häufige Probleme

### Build-Fehler

```bash
# Cache löschen
rm -rf .next
pnpm build
```

### Datenbank-Probleme

```bash
# Datenbank zurücksetzen
docker-compose down -v
docker-compose up -d
pnpm db:push
pnpm db:seed
```

### Type-Errors

```bash
# Prisma Client neu generieren
pnpm db:generate
```

## Hilfe & Support

- **Issues**: GitHub Issues für Bugs & Features
- **Discussions**: GitHub Discussions für Fragen
- **Docs**: Weitere Docs in `/docs` Ordner

## Lizenz

Siehe [LICENSE](./LICENSE)
