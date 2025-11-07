# Visual & UI Testing Suite

Umfassendes Testing-Setup für visuelle Qualität, Accessibility und UI-Probleme.

## Übersicht

Diese Test-Suite kombiniert mehrere Ansätze für maximale Test-Coverage:

### 1. **Accessibility Tests** (`accessibility.spec.ts`)
- **Tool:** axe-core
- **Testet:** WCAG 2.1 AA Compliance
- **Features:**
  - Color contrast
  - Keyboard accessibility
  - ARIA attributes
  - Touch target sizes (Mobile)
  - Focus indicators
  - Screen reader compatibility

### 2. **Generic UI Issue Detection** (`ui-issues.spec.ts`)
- **Testet:** Häufige UI-Probleme
- **Features:**
  - Horizontal scroll (Mobile/Tablet)
  - Text truncation/overflow
  - Overlapping elements
  - Elements outside viewport
  - Invisible text (same color as background)
  - Broken images
  - Form validation visibility
  - Button hover states

### 3. **Layout Shift Detection** (`layout-shift.spec.ts`)
- **Testet:** Visual stability (Core Web Vitals)
- **Features:**
  - Cumulative Layout Shift (CLS) measurement
  - Image dimension checks
  - Font loading issues
  - Dynamic content stability
  - Performance metrics

### 4. **Visual Regression Tests** (`pages.spec.ts`)
- **Testet:** Screenshot-basierte Regressionstests
- **Features:**
  - Full-page screenshots
  - Multiple viewports (mobile, tablet, desktop, wide)
  - Component states (hover, validation)
  - Dark mode (when implemented)
  - Localization

### 5. **Percy AI Visual Testing** (`percy-ai.spec.ts`) ⭐
- **Tool:** Percy by BrowserStack
- **Testet:** AI-gestützte visuelle Regressionstests
- **Features:**
  - Smart diffing (keine False Positives)
  - Cross-browser (Chrome, Firefox, Safari, Edge)
  - Responsive testing (alle Breakpoints)
  - PR integration
  - **5,000 Screenshots/Monat KOSTENLOS**
  - **Unbegrenzt für Open Source Projekte**

## Quick Start

### Alle Tests ausführen

```bash
# Alle visual tests (accessibility, ui-issues, layout-shift, pages)
pnpm exec playwright test tests/visual

# Nur auf einem Browser (schneller)
pnpm exec playwright test tests/visual --project=chromium-desktop

# Nur Accessibility Tests
pnpm exec playwright test tests/visual/accessibility.spec.ts

# Nur UI Issue Detection
pnpm exec playwright test tests/visual/ui-issues.spec.ts

# Nur Layout Shift Detection
pnpm exec playwright test tests/visual/layout-shift.spec.ts
```

### Percy AI Tests (empfohlen für CI/CD)

```bash
# Setup: Export deinen PERCY_TOKEN
export PERCY_TOKEN=your_token_here

# Percy Tests ausführen
pnpm exec percy exec -- pnpm exec playwright test tests/visual/percy-ai.spec.ts --project=chromium-desktop
```

Siehe [PERCY_SETUP.md](./PERCY_SETUP.md) für detaillierte Percy-Anleitung.

## CI/CD Integration

Alle Tests laufen automatisch in GitHub Actions:

```yaml
# .github/workflows/ci.yml

visual-regression-tests:
  name: Visual & UI Tests
  runs-on: ubuntu-latest
  needs: build
  if: github.event_name == 'pull_request' || github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
  # ... läuft automatisch bei jedem PR und Push zu main/develop
```

Die Tests laufen auf:
- ✅ Pull Requests
- ✅ Pushes zu main
- ✅ Pushes zu develop

## Was wird getestet?

### Seiten (alle Tests)
- Homepage (`/`)
- About Page (`/about`)
- Therapists Directory (`/therapists`)
- How It Works (`/how-it-works`)
- Login Page (`/login`)
- Signup Page (`/signup`)
- Register Page (`/register`)
- Triage Flow (`/triage`)

### Viewports
- **Mobile:** 375x667 (iPhone)
- **Tablet:** 768x1024 (iPad)
- **Desktop:** 1280x720
- **Wide:** 1920x1080

### Browser (in Playwright Config)
- Chrome Desktop
- Chrome Mobile (Pixel 5)
- Safari Mobile (iPhone 13)
- Safari Desktop
- Firefox Desktop
- iPad Pro

**In CI:** Nur Chromium Desktop (schneller, kostet weniger CI-Zeit)

## Test Coverage

| Test Type | Coverage | Auto-Detects |
|-----------|----------|--------------|
| **Accessibility** | WCAG 2.1 AA | Color contrast, keyboard access, ARIA, touch targets |
| **UI Issues** | Common problems | Overflow, truncation, overlapping, broken images |
| **Layout Shift** | Core Web Vitals | CLS, image dimensions, font loading |
| **Visual Regression** | Pixel-perfect | Any visual change (requires baselines) |
| **Percy AI** | Smart visual | Real bugs (ignores false positives) |

## Best Practices

### 1. Lokale Entwicklung

```bash
# Schneller Check während der Entwicklung
pnpm exec playwright test tests/visual/accessibility.spec.ts --project=chromium-desktop

# UI Issues prüfen
pnpm exec playwright test tests/visual/ui-issues.spec.ts --project=chromium-desktop
```

### 2. Vor dem Commit

```bash
# Alle visual tests auf Desktop
pnpm exec playwright test tests/visual --project=chromium-desktop

# Mit Mobile auch testen
pnpm exec playwright test tests/visual --project=mobile-chrome
```

### 3. Pull Requests

- Tests laufen automatisch in CI
- Percy zeigt visuelle Diffs direkt im PR
- Review die Ergebnisse vor dem Merge

### 4. Wichtige UI-Änderungen

```bash
# Percy für umfassende Cross-Browser-Tests
export PERCY_TOKEN=your_token
pnpm exec percy exec -- pnpm exec playwright test tests/visual/percy-ai.spec.ts
```

## Test-Ergebnisse verstehen

### ✅ Alle Tests passed
Perfekt! Deine UI hat keine erkannten Probleme.

### ❌ Accessibility Test failed
```
expect(accessibilityScanResults.violations).toEqual([])
Expected: []
Received: [{ id: 'color-contrast', ... }]
```
**Fix:** Prüfe die Console-Ausgabe für Details. Behebe Color Contrast oder andere WCAG-Violations.

### ❌ UI Issue Test failed
```
expect(truncatedTexts.length).toBe(0)
Expected: 0
Received: 3
```
**Fix:** Prüfe die Console-Ausgabe für Liste der truncated Texte. Füge `text-overflow: ellipsis` oder `overflow-wrap: break-word` hinzu.

### ❌ Layout Shift Test failed
```
expect(cls).toBeLessThan(0.1)
Expected: < 0.1
Received: 0.25
```
**Fix:** Füge explizite `width` und `height` zu Images hinzu. Reserviere Platz für dynamischen Content.

### ❌ Visual Regression failed
Screenshot unterscheidet sich vom Baseline.
**Fix:**
- Wenn gewünscht: Update baseline mit `--update-snapshots`
- Wenn Bug: Fixe das visuelle Problem

### ⚠️ Percy zeigt Diffs
Percy Dashboard zeigt visuelle Unterschiede.
**Options:**
- **Approve:** Wenn Änderung gewünscht (neues Baseline)
- **Reject:** Wenn Änderung ein Bug ist

## Performance

| Test Suite | Dauer (ca.) | Screenshots |
|------------|-------------|-------------|
| Accessibility | ~2-3 Min | 0 |
| UI Issues | ~3-4 Min | 0 |
| Layout Shift | ~3-4 Min | 0 |
| Visual Regression | ~5-7 Min | ~50 |
| Percy AI | ~8-12 Min | ~100+ |

**CI Optimization:**
- Nur Chromium Desktop
- Parallel execution
- Caching

## Kosten

| Tool | Kosten | Limits |
|------|--------|--------|
| **Playwright** | Kostenlos | Keine |
| **axe-core** | Kostenlos | Keine |
| **Percy Free** | Kostenlos | 5,000 screenshots/monat |
| **Percy Open Source** | Kostenlos | Unbegrenzt |

## Troubleshooting

### Tests sind flaky
1. Erhöhe Timeouts
2. Füge `waitForLoadState('networkidle')` hinzu
3. Warte auf spezifische Elemente
4. Deaktiviere Animationen

### Screenshots unterscheiden sich ständig
1. Nutze Percy AI (ignoriert False Positives)
2. Maskiere dynamische Elemente
3. Setze feste Viewport-Größen
4. Deaktiviere Animationen

### Tests dauern zu lange
1. Nutze nur `--project=chromium-desktop` lokal
2. Reduziere Anzahl der Screenshots
3. Nutze `fullyParallel: true` in Config
4. Splitte Tests in separate Jobs

### Percy: "Too many snapshots"
1. Upgrade zu Paid Plan
2. Beantrage Open Source Zugang (unbegrenzt)
3. Reduziere Snapshots (teste nur kritische Seiten)

## Ressourcen

### Dokumentation
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Percy Docs](https://www.browserstack.com/docs/percy)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [Percy Dashboard](https://percy.io)
- [Playwright Test Report](./playwright-report/index.html) (nach Test-Run)
- [Axe DevTools](https://www.deque.com/axe/devtools/) (Browser Extension)

### Alternatives (kostenlos)
- **Pixeleye:** Open Source, selbst-gehostet
- **Lost Pixel:** Modern UI, gute Playwright Integration
- **Visual Regression Tracker:** Einfaches Setup

## Nächste Schritte

1. ✅ Setup Percy Account (5 Minuten) - siehe [PERCY_SETUP.md](./PERCY_SETUP.md)
2. ✅ Füge `PERCY_TOKEN` zu GitHub Secrets hinzu
3. ✅ Teste lokal: `pnpm exec playwright test tests/visual`
4. ✅ Erstelle einen PR und schaue dir die Ergebnisse an
5. ✅ Review Percy Diffs im Dashboard

## Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im Projekt-Repo
- Checke die Playwright Docs
- Checke die Percy Docs
- Frage im Team

---

**Happy Testing! 🚀**
