# FindMyTherapy MVP Plan

## 0. Zielbild & Erfolgskriterien
- Fokus: Vorzeigbarer MVP-Prototyp für Investor:innen-Sessions und erste Pilot-Kund:innen.
- Live-Fähigkeit: Stable Web-Erlebnis mit echter Authentifizierung, Seed-Daten und erster Real-World-Anbindung für Pilot-Therapeut:innen.
- Erfolgsmessung:
  - Mindestens 5 Pilot-Therapeut:innen können sich registrieren, Profil anlegen und freigeschaltet werden.
  - Interessierte Kund:innen durchlaufen den Triage-Flow und erhalten handverlesene Empfehlungen (manuell kuratiert).
  - Investor:innen-Story deckt 3 Kern-Szenarien ab: Landing → Triage → Empfehlung, Landing → Therapiesuche, Landing → Pilot-Therapeut:innen-Story.

## 1. Kern-Erlebnis für Investor:innen
- [x] Marketing-Homepage, Blog/Stories und strukturierte Produkt-Abschnitte finalisiert (apps/web/app/page.tsx, apps/web/app/blog/*).
- [x] Geführter Triage-Flow mit validiertem Copywriting, Ergebnisscreen und Hinweistext verfügbar (apps/web/app/triage/TriageFlow.tsx).
- [x] Empfehlungen auf Basis der Seed-Datensätze sichtbar (API persistiert Snapshot + empfiehlt Pilotprofile & Kurse in apps/web/app/api/triage/route.ts, TriageFlow).
- [x] Kurs- und Therapieseiten zeigen Seed-Inhalte inklusive Pricing-Hinweisen (apps/web/app/courses/page.tsx, apps/web/app/therapists/page.tsx).
- [x] Analytics-Basics per Placeholder Script & track()-Utility integriert (apps/web/app/layout.tsx, apps/web/lib/analytics.ts).

## 2. Pilot-Therapeut:innen Onboarding
- [x] Vereinfachtes Registrierungsformular mit Passwort + Profilfeldern erstellt, schreibt in DB und markiert Profile als pending (apps/web/app/register/RegistrationForm.tsx, api/register).
- [x] Admin-Review-Flow inklusive Statuswechsel und Notizfeld umgesetzt (apps/web/app/admin/page.tsx, actions.ts).
- [x] Sichtbarkeit im Verzeichnis nur für freigeschaltete Pilot-Profile inkl. „Pilot“-Badge (apps/web/app/therapists/page.tsx & TherapistDirectory.tsx).
- [x] Dedizierte Felder für Termin-/Pricing-Freitext im Onboarding ergänzen Profil & Admin-Review (apps/web/app/register/RegistrationForm.tsx, dashboard/profile, admin/page.tsx).
- [x] Vertragliche/Compliance-Hinweise stehen als Download bereit (apps/web/app/register/page.tsx, public/compliance/findmytherapy-pilot-compliance-pack.pdf).

## 3. Client Journey & Seed-Daten
- [x] Registrierung/Login für Kund:innen: Self-Service-Registrierung + Auto-Login (apps/web/app/signup/*, apps/web/app/api/clients/register/route.ts), Magic-Link-Login weiter verfügbar; role-based Redirects leiten zum passenden Dashboard.
- [x] Geführte Triageschritte werden als Snapshot persistiert (packages/db/prisma/schema.prisma, apps/web/app/api/triage/route.ts).
- [x] Empfehlungsscreen zeigt kuratierte Pilot-Profile & Programme mit Highlights (apps/web/app/triage/TriageFlow.tsx).
- [x] Client-Dashboard bündelt Programme, Matches & Bestellungen (apps/web/app/dashboard/client/page.tsx).
- [ ] Kontaktformular legt Anfragen in der DB an (apps/web/app/api/contact/route.ts); queueNotification ist weiterhin nur ein Placeholder, kein E-Mail-Routing oder Auto-Bestätigung.
- [x] Öffentliche Verzeichnisse für Therapeut:innen und Kurse nutzen gemeinsame Seed-Daten und verlinken zurück zur Triage.

## 4. Operatives Backbone
- [x] Datenmodell in Prisma deckt Users, TherapistProfiles, Listings, Courses, Matches etc. ab (packages/db/prisma/schema.prisma).
- [x] Seed-Skripte erzeugen Pilot-Accounts, Profile, Kurse und Matches inkl. Triage-Resultaten (packages/db/src/seed.ts).
- [x] Hintergrundjobs: Worker loggt Heartbeats und verweist auf Notification-Hook Placeholder (apps/worker/src/index.ts); API-Queues nutzen queueNotification.
- [x] Monitoring: Fehler landen im captureError Placeholder (apps/web/lib/monitoring.ts, API-Routen).
- [x] Infrastruktur: Docker-Compose-Stack & Deployment-Guides (docker-compose.yml, README.md, DEPLOYMENT.md) vorhanden; Terraform bleibt verschoben.

## 5. Qualität & Kommunikation
- [ ] Smoke-Tests: Jest deckt Triage-, Registrierungs- und Kontaktformulare ab (plus TOTP-Helper); End-to-End/Auth-Flow-Szenarien fehlen weiterhin.
- [x] Accessibility-Check via Playwright + axe für zentrale Seiten eingerichtet (apps/web/tests/e2e/docs-accessibility.spec.ts).
- [x] Dokumentation (README.md, Guides) aktualisiert.
- [x] Feedback-Loop über Admin-Notizen verfügbar (apps/web/app/admin/page.tsx).
- [x] Security-Hinweise & Passwort-Reset-Fluss mit Supportverweis vorhanden (apps/web/app/forgot-password, apps/web/app/api/password-reset/request/route.ts, NextAuth-Konfiguration).

## 6. Nach-MVP Parkposition
- Stripe-Zahlungsflüsse, Matching-Algorithmus, Content-Streaming, Terraform-Infrastruktur, vollwertige Hintergrundjobs bleiben explizit „Post-MVP“.
- Change-Log führen, welche Bereiche absichtlich gescope-downt wurden, um Investoren-Nachfragen beantworten zu können.
