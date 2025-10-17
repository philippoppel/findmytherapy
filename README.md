# Klarthera MVP – Demo-Plattform für Investor:innen & Pilot-Therapeut:innen

Klarthera befindet sich in der MVP-Phase. Ziel ist eine vorzeigbare Demo, die Investor:innen den Kernnutzen zeigt und erste Pilot-Therapeut:innen sowie interessierte Kund:innen an Bord holt. Viele produktionsreife Features (Stripe, vollautomatisches Matching, Terraform-Infra) bleiben bewusst „post-MVP“.

## 🎯 MVP-Fokus
- **Investor:innen-Story**: Marketing-Homepage, geführte Triage-Demo, Empfehlungen aus kuratierten Demo-Daten.
- **Pilot-Therapeut:innen**: Registrierung mit Profilangaben, Admin-Freigabe und Sichtbarkeit im Verzeichnis.
- **Interessierte Kund:innen**: Login/Registrierung, Triagedemo mit persistierten Antworten, Kontaktaufnahme zum Team.
- **Admin-Einblicke**: Dashboard mit Statusüberblick, einfache Pilot-Freigabe.
- **Demo-Datenbasis**: Seeds für Accounts, Kurse, Matches und Triage-Ergebnisse.

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
- pnpm ≥ 8
- Docker & Docker Compose (für Postgres, Redis, Mailhog)
- Optional: Stripe CLI, falls du Zahlungs-Flows prototypen möchtest (nicht im MVP genutzt)

## 🚀 Schnellstart (Lokal)
```bash
git clone <repository-url>
cd mental-health-platform
pnpm install

cp .env.example .env
# Werte bei Bedarf anpassen – Default-Werte reichen für die Demo

docker-compose up -d
pnpm db:push
pnpm db:seed

pnpm dev        # Startet Next.js (http://localhost:3000)
# Worker ist optional: pnpm --filter worker dev
```

## ☁️ Deployment auf Vercel

### Schnellstart (5 Minuten)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDEIN-USERNAME%2Fklarthera)

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
| Rolle          | Login                            | Passwort       |
|----------------|----------------------------------|----------------|
| Admin          | admin@mental-health-platform.com | Admin123!      |
| Client         | demo.client@example.com          | Client123!     |
| Pilot-Therapeut:in | dr.mueller@example.com           | Therapist123! |
| Pilot-Therapeut:in | mag.wagner@example.com           | Therapist123! |
| Pilot-Therapeut:in | dr.schneider@example.com         | Therapist123! |

## 🧭 Demo-Guides

### 1. Investor:innen-Tour
1. `http://localhost:3000/` – Hero, Vision, Social Proof.
2. `Triagedemo starten` → vollständiger Flow mit Demo-Fragen.
3. Ergebnissecreen zeigt Empfehlungen (Therapeut:innen & Programme) aus Seed-Daten.
4. Wahlweise Kurs- oder Therapist-Verzeichnisse öffnen, um Tiefe zu zeigen.

### 2. Pilot-Therapeut:innen Onboarding
1. `http://localhost:3000/register` – Formular ausfüllen oder Seed-Login nutzen.
2. Nach Login `http://localhost:3000/dashboard` aufrufen (requires `THERAPIST`).
3. Profilstatus ist zunächst „In Prüfung“.
4. Admin meldet sich an (`/admin`) und setzt Status auf „Verifiziert“.
5. Profil erscheint im öffentlichen Verzeichnis (`/therapists`) mit Badge „Verifiziert“.

### 3. Kund:innenreise
1. `http://localhost:3000/login` – Login oder `Registrieren`.
2. `http://localhost:3000/triage` – Fragen beantworten, Ergebnis wird gespeichert.
3. Empfehlungen durchsuchen, anschließend `Kontakt` für Follow-up auslösen.
4. E-Mails landen in Mailhog (`http://localhost:8025`) für Demo-Zwecke.

## ⚙️ Technik & Daten
- **Auth**: NextAuth (Passwort + Magic Link). TOTP optional für `ADMIN` & `THERAPIST`.
- **Datenbank**: PostgreSQL via Prisma. Seeds erzeugen Demo-User, Pilot-Profile, Kurse, Matches.
- **Lokalisierung**: Statisches `de-AT`, Internationalisierung wird post-MVP erweitert.
- **Background-Worker**: Placeholder – zukünftige Jobs (Stripe, Benachrichtigungen) sind TODOs.
- **Monitoring**: Sentry/OTel nur vorbereitet; aktive Integration erst nach MVP.

## 🧪 Tests & Qualität
- `pnpm test` – leichte Jest-Coverage (Triage-Demo, Formulare, UI-Tokens).
- `pnpm e2e` – Playwright Happy Path für Design-Doku & Accessibility.
- `pnpm lint`, `pnpm format` – Codequalität vor Pushes sicherstellen.
- Manuelle QA-Checkliste:
  - Triagedemo funktioniert durchgängig.
  - Pilot-Profil lässt sich freischalten und taucht im Verzeichnis auf.
  - Kontaktformular sendet E-Mail (Mailhog prüfen).

## 🔐 Sicherheit (MVP-Status)
- Passwort-Login mit bcrypt-Hashes + Magic Link.
- TOTP-Setup & -Verwaltung für privilegierte Rollen.
- Keine Rate-Limits, CSP oder Zahlungsfreigaben – Demo-Only! Feedback/Support via Team.
- Hinweis auf jeder Produktdemo: Daten nur Mock/Pilot, kein Notfall-Support.

## 🧭 Post-MVP (Parkposition)
- Stripe Billing & Checkout, Stripe Connect für Payouts.
- Konfigurierbare Matching-Engine & Worker-basierte Automation.
- Infrastruktur (Terraform, Observability, CI-Optimierungen).
- Kurs-Streaming, Zugangskontrolle, Refunds.
- Compliance-Dokumente (DSGVO, Notfall, Bezahlflows).

## 🤝 Pitch-Hilfen
- **Demo-Skript**: Starte im Hero, erzähle Problem → Triagedemo → Pilot-Profil → Admin-Backoffice.
- **Storytelling**: Betone, dass Matching & Payments vorbereitet, aber bewusst aus dem MVP scoped sind.
- **Feedback-Loop**: Dokumentiere Pilot-Rückmeldungen im Admin-Dashboard (Notizfelder folgen).

Viel Erfolg bei Demos & Gesprächen – und gib Bescheid, falls wir die nächste Ausbaustufe priorisieren sollen! 🏁
