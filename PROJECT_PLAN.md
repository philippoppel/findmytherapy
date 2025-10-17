# Klarthera MVP Plan

## 0. Zielbild & Erfolgskriterien
- Fokus: Vorzeigbarer MVP-Prototyp für Investor:innen-Demos und erste Pilot-Kund:innen.
- Live-Fähigkeit: Stable Web-Demo mit echter Authentifizierung, Demo-Daten und erster Real-World-Anbindung für Pilot-Therapeut:innen.
- Erfolgsmessung:
  - Mindestens 5 Pilot-Therapeut:innen können sich registrieren, Profil anlegen und freigeschaltet werden.
  - Interessierte Kund:innen durchlaufen Triagedemo und erhalten handverlesene Empfehlungen (manuell kuratiert).
  - Investoren-Demo deckt 3 Kern-Stories ab: Landing → Triage → Empfehlung, Landing → Therapiesuche, Landing → Pilot-Therapeut-Investitionsstory.

## 1. Kern-Erlebnis für Investor:innen-Demo
- Marketing-Homepage, Blog/Stories und strukturierte Produkt-Abschnitte finalisieren.
- Geführte Triage-Demo mit validiertem Copywriting, klaren Ergebnissen und Notfall-Hinweisen.
- Demo-Empfehlungen auf Basis von Demo-Datensätzen sichtbar machen (keine echte Matching-Engine, aber Storytelling für Algorithmus).
- Kurs- und Therapieseiten präsentieren Demo-Inhalte inklusive Pricing-Hinweisen (kein Checkout).
- Analytics-Basics (z. B. Plausible/Segment placeholder) für Engagement-Messung vorbereiten.

## 2. Pilot-Therapeut:innen Onboarding
- Vereinfachtes Registrierungsformular: E-Mail/Passwort + Profilgrundlagen (Name, Stadt, Fachgebiete, Formate).
- Admin-Review-Flow: einfache Ansicht mit Statuswechsel (Pending → Freigeschaltet) und Kommentar-Feld.
- Sichtbarkeit: freigeschaltete Profile erscheinen im Verzeichnis mit Kennzeichnung „Pilot“.
- Optional: Termine/Pricing als Freitext, keine Stripe-Integration im MVP.
- Vertragliche/Compliance Hinweise als statischer Download oder PDF-Link integrieren.

## 3. Client Journey & Demo-Daten
- Registrierung/Login für Kund:innen (Passwort + optional Magic Link) mit TOTP nur für Admin/Therapeut:innen.
- Geführte Triageschritte mit persistierter Session (Speicherung in DB, um manuelle Nachbearbeitung zu ermöglichen).
- Empfehlungsscreen mit handverlesenen Pilot-Profilen, Kursmodulen und manuellem Call-to-Action („Termin anfragen“ per Formular/E-Mail).
- Kontaktformular mit Routing an internes Demo-Team (Mailhog/SMTP) inkl. Auto-Bestätigung.
- Öffentliche Verzeichnisse (Therapists, Courses) nutzen dieselbe Datenquelle, leiten aber auf Triagedemo für tiefergehende Empfehlungen.

## 4. Operatives Backbone
- Datenmodell: Prisma-Tabellen für Users, TherapistProfiles, Listings, Courses, Matches (Dummy) sind ausreichend; Cleanup und Migrationsskript beibehalten.
- Seed-Skripte aktualisieren: Demo-Accounts + Pilot-Beispiele + initiale Matches/Triage-Resultate.
- Hintergrundjobs: Worker bleibt minimal (Logs), aber vorbereiteter Hook für E-Mail-Benachrichtigungen (TODO in Code kommentieren).
- Monitoring: Manuelles Error-Logging via console/Sentry-Placeholder; tatsächliche Integration nur bei Bedarf.
- Infrastruktur: Lokale Docker-Compose-Stacks; Deployment erfolgt manuell (z. B. Vercel/Render). Terraform erst nach MVP neu planen.

## 5. Qualität & Kommunikation
- Smoke-Tests: Jest für kritische Komponenten (Auth-Flow, Triage, Kontaktformular) + Playwright Happy Path (Landing → Triage → Empfehlung).
- Accessibility-Check: Weiterhin axe-Basislauf für zentrale Seiten.
- Dokumentation: README aktualisieren für MVP-Setup (Pilot-Registrierung, Seed-Daten, Demo-Ablauf), kurzer Pitch-Guide für Demo-Szenarien.
- Feedback-Loop: Admin kann Notizen zu Pilot-Therapeut:innen hinterlegen (zunächst in separater Tabelle/JSON-Feld).
- Security: Passwort-Reset-Link als statischer Hinweis (Support kontaktieren), Sessions auf Standard NextAuth-Konfiguration belassen.

## 6. Nach-MVP Parkposition
- Stripe-Zahlungsflüsse, Matching-Algorithmus, Content-Streaming, Terraform-Infrastruktur, vollwertige Hintergrundjobs bleiben explizit „Post-MVP“.
- Change-Log führen, welche Bereiche absichtlich gescope-downt wurden, um Investoren-Nachfragen beantworten zu können.
