# FindMyTherapy MVP – Pilot-Plattform für Investor:innen & Therapeut:innen

> **⚠️ CRITICAL: Wenn du Datenbank-Schema-Änderungen machst (Prisma), lies ZUERST: [`CRITICAL_CHECKLIST.md`](./CRITICAL_CHECKLIST.md)**
>
> **TL;DR**: Bei Änderungen an `apps/web/prisma/schema.prisma` MUSST du `pnpm db:verify-production` ausführen, bevor du commitest!

FindMyTherapy befindet sich in der MVP-Phase. Ziel ist ein vorzeigbarer Pilot, der Investor:innen den Kernnutzen zeigt und erste Therapeut:innen sowie interessierte Kund:innen an Bord holt. Viele produktionsreife Features (Stripe, vollautomatisches Matching, Terraform-Infra) bleiben bewusst „post-MVP".

## 🎯 MVP-Fokus

- **Investor:innen-Story**: Marketing-Homepage, geführte Triage-Erfahrung, Empfehlungen aus kuratierten Seed-Daten.
- **Pilot-Therapeut:innen**: Registrierung mit Profilangaben, Admin-Freigabe und Sichtbarkeit im Verzeichnis.
- **Interessierte Kund:innen**: Login/Registrierung, Triage-Flow mit persistierten Antworten, Kontaktaufnahme zum Team.
- **Admin-Einblicke**: Dashboard mit Statusüberblick, einfache Pilot-Freigabe.
- **Seed-Datenbasis**: Seeds für Accounts, Kurse, Matches und Triage-Ergebnisse.

> **Nicht Teil des MVP:** Stripe-Zahlungen, automatisierte Matching-Engine, Content-Streaming, produktionsfertige Infrastruktur.

## 🗂 Projektstruktur (Kurzfassung)

```
mental-health-platform/
├── apps/
│   ├── web/           # Next.js 14 MVP-Frontend mit App Router
│   └── worker/        # Placeholder-Worker (Logging)
├── packages/
│   ├── db/            # Prisma Schema, Client & Seeddaten
│   ├── ui/            # Design-System Komponenten + Tokens
│   └── config/        # Typisierte Env-Validierung (Zod)
└── infrastructure/
    └── terraform/     # Platzhalter (leer bis Post-MVP)
```

## ✅ Voraussetzungen

- Node.js ≥ 20
- pnpm ≥ 9
- Docker & Docker Compose (für Postgres, Redis, Mailhog)
- Optional: Stripe CLI, falls du Zahlungs-Flows prototypen möchtest (nicht im MVP genutzt)

## 🚀 Schnellstart (Lokal)

```bash
git clone <repository-url>
cd mental-health-platform
pnpm install

cp .env.example .env
# Werte bei Bedarf anpassen – Default-Werte reichen für den Pilotbetrieb

docker-compose up -d
pnpm db:push
pnpm db:seed

pnpm dev        # Startet Next.js (http://localhost:3000)
# Worker ist optional: pnpm --filter worker dev
```

## ☁️ Deployment auf Vercel

### Schnellstart (5 Minuten)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDEIN-USERNAME%2Ffindmytherapy)

**Oder manuell:**

```bash
# 1. Code zu GitHub pushen
git push origin main

# 2. Bei Vercel importieren
# https://vercel.com/new - Repository auswählen

# 3. Datenbank initialisieren
./scripts/init-production-db.sh
```

📚 **Vollständige Anleitung**: [VERCEL_QUICKSTART.md](./VERCEL_QUICKSTART.md)
📖 **Detaillierte Docs**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Seed-Accounts (nach `pnpm db:seed`)

| Rolle              | Login                            | Passwort      |
| ------------------ | -------------------------------- | ------------- |
| Admin              | admin@mental-health-platform.com | Admin123!     |
| Client             | demo.client@example.com          | Client123!    |
| Pilot-Therapeut:in | dr.mueller@example.com           | Therapist123! |
| Pilot-Therapeut:in | mag.wagner@example.com           | Therapist123! |
| Pilot-Therapeut:in | dr.schneider@example.com         | Therapist123! |

## 🧭 Pilot-Guides

### 1. Investor:innen-Tour

1. `http://localhost:3000/` – Hero, Vision, Social Proof.
2. `Ersteinschätzung starten` → vollständiger Flow mit Beispiel-Fragen.
3. Ergebnissecreen zeigt Empfehlungen (Therapeut:innen & Programme) aus Seed-Daten.
4. Wahlweise Kurs- oder Therapist-Verzeichnisse öffnen, um Tiefe zu zeigen.

### 2. Pilot-Therapeut:innen Onboarding

1. `http://localhost:3000/register` – Formular ausfüllen oder Seed-Login nutzen.
2. Nach Login `http://localhost:3000/dashboard` aufrufen (requires `THERAPIST`).
3. Profilstatus ist zunächst „In Prüfung“.
4. Admin meldet sich an (`/admin`) und setzt Status auf „Verifiziert“.
5. Profil erscheint im öffentlichen Verzeichnis (`/therapists`) mit Badge „Verifiziert“.

### 3. Kund:innenreise

1. `http://localhost:3000/signup` – Self-Service-Registrierung oder Seed-Login via `http://localhost:3000/login` nutzen.
2. Nach dem Login erfolgt automatische Weiterleitung zum Client-Dashboard (`/dashboard/client`) mit Programmen, Matches & Bestellungen.
3. `http://localhost:3000/triage` – Ersteinschätzung ausfüllen, Ergebnisse landen im Dashboard.
4. Empfehlungen durchsuchen, anschließend `Kontakt` für Follow-up auslösen; Mails landen in Mailhog (`http://localhost:8025`).

## ⚙️ Technik & Daten

- **Auth**: NextAuth (Passwort + Magic Link). TOTP optional für `ADMIN` & `THERAPIST`.
- **Datenbank**: PostgreSQL via Prisma. Seeds erzeugen Pilot-Accounts, Profile, Kurse und Matches.
- **Lokalisierung**: Statisches `de-AT`, Internationalisierung wird post-MVP erweitert.
- **Background-Worker**: Placeholder – zukünftige Jobs (Stripe, Benachrichtigungen) sind TODOs.
- **Monitoring**: Sentry/OTel nur vorbereitet; aktive Integration erst nach MVP.

## 🧪 Tests & Qualität

### Test-Befehle

```bash
pnpm test              # Unit-Tests (Jest)
pnpm test --coverage   # Mit Coverage-Report
pnpm e2e               # E2E-Tests (Playwright)
pnpm e2e:ui            # E2E-Tests mit UI
pnpm lint              # ESLint
pnpm format            # Prettier (check mode)
```

### CI/CD Pipeline

Automatische Tests laufen bei jedem Push auf GitHub:

✅ **Linting** - ESLint & Prettier
✅ **Unit Tests** - Jest mit Coverage
✅ **Build** - Next.js Production Build
✅ **E2E Tests** - Playwright mit Chromium
✅ **Accessibility Tests** - Axe-Core Compliance
✅ **Security Scan** - npm audit & Dependency Check

Pipeline-Status: ![CI/CD](https://github.com/YOUR_USERNAME/mental-health-platform/workflows/CI%2FCD%20Pipeline/badge.svg)

### Test-Coverage

- **Triage Flow**: Comprehensive Tests mit wissenschaftlicher Validierung
- **API Routes**: Unit Tests für kritische Endpoints
- **Forms**: Registrierung & Kontaktformular
- **UI Components**: Design-System & Accessibility

Siehe [`docs/KRITISCHE_REVIEW_UND_TESTS.md`](./docs/KRITISCHE_REVIEW_UND_TESTS.md) für Details zu kritischen Bugfixes.

### Manuelle QA-Checkliste

- Triagedemo funktioniert durchgängig
- Pilot-Profil lässt sich freischalten und taucht im Verzeichnis auf
- Kontaktformular sendet E-Mail (Mailhog prüfen)
- ISR-Caching funktioniert (Therapeuten-Änderungen nach 5 Min sichtbar)

## 🔐 Sicherheit (MVP-Status)

- Passwort-Login mit bcrypt-Hashes + Magic Link.
- TOTP-Setup & -Verwaltung für privilegierte Rollen.
- Keine Rate-Limits, CSP oder Zahlungsfreigaben – MVP-only! Feedback/Support via Team.
- Hinweis auf jeder Produktdemo: Daten nur Mock/Pilot, kein Notfall-Support.

## 🧭 Post-MVP (Parkposition)

- Stripe Billing & Checkout, Stripe Connect für Payouts.
- Konfigurierbare Matching-Engine & Worker-basierte Automation.
- Infrastruktur (Terraform, Observability, CI-Optimierungen).
- Kurs-Streaming, Zugangskontrolle, Refunds.
- Compliance-Dokumente (DSGVO, Notfall, Bezahlflows).

## 🤝 Pitch-Hilfen

- **Pilot-Skript**: Starte im Hero, erzähle Problem → Triage-Flow → Pilot-Profil → Admin-Backoffice.
- **Storytelling**: Betone, dass Matching & Payments vorbereitet, aber bewusst aus dem MVP scoped sind.
- **Feedback-Loop**: Dokumentiere Pilot-Rückmeldungen im Admin-Dashboard (Notizfelder folgen).

Viel Erfolg bei Gesprächen – und gib Bescheid, falls wir die nächste Ausbaustufe priorisieren sollen! 🏁
