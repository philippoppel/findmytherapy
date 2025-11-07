# Percy AI Visual Testing Setup

Percy ist ein AI-gestütztes Visual Testing Tool, das intelligente visuelle Regressionstests ermöglicht.

## Features

- **AI-Powered Diffing:** Erkennt echte UI-Bugs und ignoriert False Positives (Anti-Aliasing, Font-Rendering, etc.)
- **Cross-Browser Testing:** Automatische Tests in Chrome, Firefox, Safari, Edge
- **Responsive Testing:** Mehrere Viewports in einem Test
- **Smart Baseline Management:** Automatische Baseline-Verwaltung pro Branch
- **GitHub Integration:** Visuelle Diffs direkt in PRs
- **5,000 Screenshots/Monat KOSTENLOS** (oder unbegrenzt für Open Source)

## Quick Start

### 1. Percy Account erstellen

1. Gehe zu https://percy.io
2. Registriere dich (kostenlos - 5,000 screenshots/monat)
3. Erstelle ein neues Projekt

### 2. Percy Token erhalten

1. Gehe zu Project Settings
2. Kopiere deinen `PERCY_TOKEN`
3. Setze den Token als Umgebungsvariable:

```bash
export PERCY_TOKEN=your_percy_token_here
```

Für permanente Verwendung, füge zu deinem `.env.local` hinzu:
```
PERCY_TOKEN=your_percy_token_here
```

### 3. Tests ausführen

```bash
# Lokaler Test mit Percy
pnpm exec percy exec -- pnpm exec playwright test tests/visual/percy-ai.spec.ts --project=chromium-desktop

# Nur Percy Tests
pnpm exec percy exec -- pnpm exec playwright test tests/visual/percy-ai.spec.ts

# Mit spezifischem Browser
pnpm exec percy exec -- pnpm exec playwright test tests/visual/percy-ai.spec.ts --project=mobile-chrome
```

## Open Source Projekt Setup

Wenn euer Projekt Open Source ist, könnt ihr **unbegrenzte Screenshots kostenlos** bekommen:

1. Gehe zu https://www.browserstack.com/open-source
2. Beantrage Zugang für euer Projekt
3. Erhalte unbegrenzten Zugang zu Percy + BrowserStack

## CI/CD Integration (GitHub Actions)

Füge Percy zu eurem CI/CD-Workflow hinzu:

```yaml
# .github/workflows/ci.yml

percy-visual-tests:
  name: Percy AI Visual Tests
  runs-on: ubuntu-latest
  needs: build
  if: github.event_name == 'pull_request'

  services:
    postgres:
      image: postgres:16-alpine
      env:
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: password
        POSTGRES_DB: percy_db
      ports:
        - 5432:5432

  steps:
    - uses: actions/checkout@v4

    - uses: pnpm/action-setup@v2
      with:
        version: '9'

    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Install Playwright browsers
      run: pnpm --filter web exec playwright install --with-deps chromium

    - name: Setup database
      env:
        DATABASE_URL: postgresql://postgres:password@localhost:5432/percy_db
      run: |
        pnpm db:push
        pnpm db:seed

    - name: Build
      run: pnpm --filter web build
      env:
        # ... all your env vars ...

    - name: Run Percy visual tests
      env:
        PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
        DATABASE_URL: postgresql://postgres:password@localhost:5432/percy_db
        # ... other env vars ...
      run: |
        pnpm --filter web start &
        sleep 15
        pnpm exec percy exec -- pnpm exec playwright test tests/visual/percy-ai.spec.ts --project=chromium-desktop
```

**WICHTIG:** Füge `PERCY_TOKEN` als GitHub Secret hinzu:
1. Gehe zu Settings > Secrets and variables > Actions
2. Klicke "New repository secret"
3. Name: `PERCY_TOKEN`
4. Value: Dein Percy Token
5. Klicke "Add secret"

## Percy Dashboard

Nach dem Test-Run:

1. Gehe zu https://percy.io/[your-org]/[your-project]
2. Sieh dir visuelle Diffs an
3. Approve oder Reject Changes
4. Diffs werden automatisch in GitHub PRs angezeigt

## Best Practices

### 1. Dynamische Inhalte ignorieren

```typescript
await percySnapshot(page, 'Homepage', {
  widths: [375, 1280],
  percyCSS: `
    .timestamp { display: none; }
    .random-id { display: none; }
  `
})
```

### 2. Mehrere Viewports testen

```typescript
await percySnapshot(page, 'Homepage', {
  widths: [375, 768, 1024, 1280, 1920],
  minHeight: 1024
})
```

### 3. Animationen deaktivieren

```typescript
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
})

await percySnapshot(page, 'Homepage')
```

### 4. Auf Inhalte warten

```typescript
await page.goto('/')
await page.waitForLoadState('networkidle')
await page.waitForSelector('[data-testid="main-content"]')

// Oder spezifische Elemente
await page.waitForFunction(() => {
  const images = document.querySelectorAll('img')
  return Array.from(images).every(img => img.complete)
})

await percySnapshot(page, 'Homepage')
```

## Kosten-Übersicht

| Plan | Preis | Screenshots/Monat | Features |
|------|-------|-------------------|----------|
| **Free** | $0 | 5,000 | Alle Features, unbegrenzte User |
| **Open Source** | $0 | Unbegrenzt | Alle Features, nach Approval |
| Startup | $149 | 25,000 | Alle Features + 1 Jahr History |
| Business | $349 | 100,000 | Alle Features + Priority Support |

## Vergleich: Percy vs. Playwright Built-in

| Feature | Percy AI | Playwright Built-in |
|---------|----------|-------------------|
| **AI Diffing** | ✅ Ja | ❌ Nein (Pixel-by-Pixel) |
| **Cross-Browser** | ✅ Automatisch | ⚠️ Manuell konfigurieren |
| **False Positives** | ✅ Sehr wenige | ⚠️ Viele (Anti-Aliasing, etc.) |
| **PR Integration** | ✅ Automatisch | ❌ Nein |
| **Baseline Management** | ✅ Automatisch | ⚠️ Manuell (Git) |
| **Kosten** | ✅ 5k/Monat kostenlos | ✅ Komplett kostenlos |
| **Setup Complexity** | ⚠️ Token erforderlich | ✅ Sehr einfach |
| **Offline Testing** | ❌ Nein (Cloud) | ✅ Ja |

## Empfehlung

**Nutze beide:**
- **Playwright Built-in:** Für schnelle, lokale Checks während der Entwicklung
- **Percy AI:** Für umfassende, CI/CD-integrierte Visual Regression Tests

## Troubleshooting

### "PERCY_TOKEN not set"
```bash
export PERCY_TOKEN=your_token_here
```

### "Percy build failed"
Prüfe, ob der Server läuft:
```bash
curl http://localhost:3000
```

### "Too many snapshots"
Du hast das Free-Tier-Limit erreicht (5,000/Monat). Optionen:
1. Upgrade auf Paid Plan
2. Beantrage Open Source Zugang (unbegrenzt)
3. Reduziere Anzahl der Snapshots

### "Snapshots are inconsistent"
Stelle sicher, dass:
- Seite vollständig geladen ist (`waitForLoadState('networkidle')`)
- Animationen deaktiviert sind
- Dynamische Inhalte (Timestamps, etc.) ignoriert werden

## Weitere Ressourcen

- [Percy Docs](https://www.browserstack.com/docs/percy)
- [Percy Playwright Integration](https://www.browserstack.com/docs/percy/integrate/playwright)
- [Open Source Program](https://www.browserstack.com/open-source)
- [Percy Blog](https://www.browserstack.com/blog/tag/percy/)

## Alternativen (auch kostenlos)

Wenn Percy nicht passt, probiere:

1. **Pixeleye** (Open Source)
   - Selbst-gehostet
   - Komplett kostenlos
   - https://github.com/pixeleye-io/pixeleye

2. **Lost Pixel** (Open Source)
   - Modern UI
   - Gute Playwright Integration
   - https://github.com/lost-pixel/lost-pixel

3. **Visual Regression Tracker** (Open Source)
   - Selbst-gehostet
   - Einfaches Setup
   - https://github.com/Visual-Regression-Tracker/Visual-Regression-Tracker

4. **Playwright Built-in**
   - Komplett kostenlos
   - Kein externes Tool
   - Bereits in eurem Projekt integriert
