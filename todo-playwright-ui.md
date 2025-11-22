## Playwright/UI Stabilisierung – TODO

Ziel: Alle Playwright E2E/Visual/A11y-Tests sollen grün laufen.

### Daten & Auth
- E2E-Microsite-Tests: Unique-Kollisionen vermeiden (randomisierte E-Mail/Slug oder DB-Cleanup pro Suite), sonst Prisma-Errors auf `micrositeSlug`/Email.
- NextAuth-Testflow stabilisieren, damit Registrierungs-/Login-Tests nicht auf `/api/auth/error` landen (Fake-Provider/Mock oder feste Test-Creds sicherstellen).

### Semantik/Headings
- Pro Seite nur ein `<h1>` rendern (Marketing-/Therapists-Seiten); weitere Haupttitel auf `<h2>/<h3>` umbauen. Strikte Playwright-Checks scheitern aktuell an mehreren `h1`.

### Kontrast & „Invisible Text“
- Buttons/Badges/Chips in Heroes (Home/Therapists/Triage) mit höherem Kontrast versehen (heller Text auf dunklem BG oder umgekehrt, opakerer Hintergrund).
- Konkret: weiße/halbtransparente Buttons und braune Labels auf beigen Hintergründen anpassen, damit axe/UI-Issue-Checks (`color-contrast`, `invisible text`) grün werden.

### Layout / Viewport
- Deko-Blur-Kreise bzw. absolute Elemente auf Mobile verkleinern oder ausblenden (z.B. `md:block hidden`), um „Elements outside viewport“-Fails zu vermeiden.
- Touch-Targets (kleine Links/Buttons) auf min. 44x44 px bringen oder als akzeptierte Ausnahmen markieren.

### Assets
- Fehlende Team-/Hero-Bilder unter `public/images/...` hinzufügen oder Referenzen auf vorhandene Platzhalter ändern, damit „Broken images“-Checks grün werden.

### Tests anpassen (falls gewünscht)
- E2E-Assertions gezielter machen (z.B. `getByRole('heading', { name: /Finde .../ })` statt generisches `h1`), um Semantikänderungen zu entkoppeln.
- UI-Issue-Checks ggf. auf bekannte Ausnahmen einschränken (z.B. Deko-Overlays, bestimmte Chips).
- Microsite-Tracking-Route: Bei fehlenden Feldern defensiver oder die Tests mit gültigen Payloads versorgen.

### A11y
- `color-contrast`-Regel wieder aktivieren, nachdem die Farben korrigiert sind.
- Heading-Hierarchie wird mit eindeutiger `h1` automatisch grün; Touch-Target- und Label-Fälle prüfen.

### Seeds
- Seed-Daten so anlegen, dass Playwright-Tests reproduzierbar laufen (keine Slug-/Email-Kollisionen, vorhandene Profile/Assets für Public-/Microsite-Flows).

### Danach
- Playwright erneut laufen lassen:
  `DATABASE_URL=postgresql://postgres:password@localhost:5432/test_db NEXT_PUBLIC_DISABLE_COOKIE_BANNER=true pnpm --filter web e2e --project=chromium-desktop --reporter=line`
