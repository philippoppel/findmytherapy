# FindMyTherapy MVP – User Stories

## 1. Investor:innen-Erlebnis & Marketing
- **Story ID:** MKT-001
  **Als** Interessent:in auf der Landingpage
  **möchte ich** die Kernbotschaft und Produktwerte klar verstehen
  **damit** ich entscheide, ob ich ein Erstgespräch anfordere.
  **Akzeptanzkriterien:** Hero-Sektion mit Value Proposition, Call-to-Action zum Erstgespräch, vertrauensbildende Elemente (Logos, Testimonials, Sicherheits-Hinweis).

- **Story ID:** MKT-002
  **Als** Investorin
  **möchte ich** den moderierten Triagedurchlauf sehen
  **damit** ich verstehe, wie FindMyTherapy Klient:innen zur passenden Versorgung führt.
  **Akzeptanzkriterien:** Triage-Flow per Klick startbar, Fortschrittsanzeige, Beispielantworten, Ergebnisbildschirm mit Empfehlungen und Hinweis auf kuratierte Seed-Daten.

- **Story ID:** MKT-003  
  **Als** Investor:in oder Pilot-Therapeut:in  
  **möchte ich** eine Vorschau der Kurs- und Therapieseiten sehen  
  **damit** ich Angebotstiefe, Pricing-Hinweise und Storyline nachvollziehen kann.  
  **Akzeptanzkriterien:** Kurs- und Therapieseiten listen Seed-Inhalte, zeigen Preisrange, verlinken zurück zur Triage.

## 2. Pilot-Therapeut:innen Onboarding
- **Story ID:** THER-001  
  **Als** Pilot-Therapeut:in  
  **möchte ich** mich mit Basisdaten registrieren und ein Passwort vergeben  
  **damit** mein Profil geprüft und für den Pilot freigeschaltet werden kann.  
  **Akzeptanzkriterien:** Formular mit Pflichtfeldern (Name, E-Mail, Passwort, Stadt, Spezialgebiete, Modalitäten), Validierung, Speicherung in DB, Status `PENDING`, Bestätigungstext.

- **Story ID:** THER-002  
  **Als** Admin  
  **möchte ich** Pilot-Profile prüfen und ihren Status anpassen  
  **damit** nur verifizierte Therapeut:innen im öffentlichen Verzeichnis erscheinen.  
  **Akzeptanzkriterien:** Admin-Queue mit Filter `PENDING`, Statuswechsel zu `VERIFIED`/`REJECTED`, Notizfeld, Änderungslog.

- **Story ID:** THER-003  
  **Als** Pilot-Therapeut:in  
  **möchte ich** im Onboarding optionale Freitextfelder für Terminfenster & Preishinweise ausfüllen  
  **damit** das Verzeichnis meine Erreichbarkeit genauer abbildet.  
  **Akzeptanzkriterien:** Zusätzliche Felder werden erfasst, im Profil angezeigt und in Admin-Review sichtbar.

- **Story ID:** THER-004  
  **Als** Pilot-Therapeut:in  
  **möchte ich** Zugriff auf kompakte Compliance-Dokumente (DSGVO, Vertrag, Notfall-Prozess)  
  **damit** ich meine Pflichten vor dem Start prüfen kann.  
  **Akzeptanzkriterien:** Download-Link oder PDF-Viewer im Onboarding/Admin-Bereich, Dokumente versioniert abgelegt.

## 3. Klient:innen Journey & Seed-Daten
- **Story ID:** CLIENT-001  
  **Als** interessierte Klient:in  
  **möchte ich** mich einloggen können  
  **damit** ich den Pilot-Zugang mit Empfehlungen sehe.  
  **Akzeptanzkriterien:** Login via Passwort oder Magic Link, vorbereitete Zugangsdaten verfügbar, Fehlermeldungen für ungültige Versuche, TOTP-Hinweise.

- **Story ID:** CLIENT-002  
  **Als** neue Klient:in  
  **möchte ich** mich selbst registrieren können (Passwort + optional TOTP)  
  **damit** ich ohne Admin-Support auf den Zugang zugreifen kann.  
  **Akzeptanzkriterien:** Self-Service-Registrierung, Passwort-Policy, optionales Security-Setup, automatische Pilot-Rolle.

- **Story ID:** CLIENT-005  
  **Als** eingeloggte Klient:in  
  **möchte ich** mein Dashboard mit Kursen, Bestellungen und Empfehlungen sehen  
  **damit** ich jederzeit weiß, wie es weitergeht.  
  **Akzeptanzkriterien:** Kursübersicht inkl. Fortschritt, letzte Bestellungen, Matches/Empfehlungen auf `/dashboard/client`.

- **Story ID:** CLIENT-003  
  **Als** interessierte Person  
  **möchte ich** über ein Kontaktformular einen Rückruf oder Infos anfragen  
  **damit** das Care-Team mein Anliegen bearbeiten kann.  
  **Akzeptanzkriterien:** Formular mit Validierung, Speicherung in DB, Rückmeldung im UI, Queue-Eintrag für Follow-up.

- **Story ID:** CLIENT-004 *(offen)*  
  **Als** Support-Team  
  **möchte ich** dass Kontaktanfragen automatisch eine Bestätigungs-E-Mail und Slack/Inbox-Notification auslösen  
  **damit** keine Anfrage verloren geht.  
  **Akzeptanzkriterien:** E-Mail-/Notification-Dispatch, Retry-Mechanismus oder Logging, sichtbarer Statuswechsel.

## 4. Operatives Backbone & Sicherheit
- **Story ID:** OPS-001  
  **Als** Tech-Team  
  **möchte ich** Seed-Daten via Seed-Skript bereitstellen  
  **damit** frische Umgebungen in wenigen Minuten einsatzbereit sind.  
  **Akzeptanzkriterien:** `pnpm db:seed` erzeugt Benutzer, Profile, Kurse, Matches; wiederholbar ohne Fehler.

- **Story ID:** OPS-002  
  **Als** Admin oder Therapeut:in  
  **möchte ich** Zwei-Faktor-Authentifizierung aktivieren oder deaktivieren können  
  **damit** sensible Bereiche stärker geschützt sind.  
  **Akzeptanzkriterien:** Setup-Flow mit Secret/QR, Code-Validierung, Speicherung des verschlüsselten Secrets, Hinweistexte im UI.

- **Story ID:** OPS-003  
  **Als** Betreiber:in  
  **möchte ich** Basis-Monitoring und Fehlerlogging  
  **damit** ich Pilot-Probleme zeitnah erkenne.  
  **Akzeptanzkriterien:** `captureError`-Hooks in API-Routen, Worker-Heartbeat-Logs, Konsolenhinweise in DEV.

## 5. Qualität & Kommunikation
- **Story ID:** QA-001  
  **Als** Produktteam  
  **möchte ich** automatisierte Smoke-Tests für Kernformulare  
  **damit** kritische Flows (Triage, Registrierung, Kontakt) regressionssicher bleiben.  
  **Akzeptanzkriterien:** Jest-Specs für Triage, Registration, Contact; läuft via `pnpm test`.

- **Story ID:** QA-002 *(offen)*  
  **Als** Produktteam  
  **möchte ich** E2E-Tests für Auth- und Dashboard-Flows  
  **damit** Login/TOTP/Profil-Sichten automatisiert geprüft werden können.  
  **Akzeptanzkriterien:** Playwright-Szenario mit Login + Dashboard-Rundgang, Tagging `@smoke`, integriert in CI.

- **Story ID:** COMM-001  
  **Als** Moderator:in  
  **möchte ich** eine klare Dokumentation der MVP-Grenzen  
  **damit** ich Fragen zu Payments/Matching oder Terraform beantworten kann.  
  **Akzeptanzkriterien:** README/PROJECT_PLAN heben Parkpositionen hervor, Changelog erfasst bewusste Scope-Cuts.

---

**Status-Legende:** Stories ohne Zusatz gelten als erledigt; mit *(offen)* markierte Stories sind noch umzusetzen. Bitte nach Umsetzung jeweils Status im PROJECT_PLAN.md und hier aktualisieren.
