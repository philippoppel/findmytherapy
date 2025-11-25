# Development Workflow

## Branch-Strategie

### Branches

- **`main`** - Production Branch (nur für Kunden)
  - Geschützt durch Branch Protection Rules
  - Automatisches Deployment zu Production via Vercel
  - Nutzt Prisma Accelerate Production Database

- **`develop`** - Development Branch (für Testing)
  - Automatisches Deployment zu Development Preview via Vercel
  - Nutzt Vercel Postgres Development Database
  - URL: `https://findmytherapy-qyva-git-develop-philipps-projects.vercel.app`

- **Feature Branches** - `feature/feature-name`
  - Werden von `develop` abgezweigt
  - Automatisches Preview Deployment für jeden PR
  - Nutzt Vercel Postgres Development Database

## Datenbanken

### Production (main)

- **Database:** Prisma Accelerate
- **Connection:** `DATABASE_URL` (nur Production)
- **Verwendung:** Echte Kundendaten

### Development/Preview (develop + Feature Branches)

- **Database:** Vercel Postgres `findmytherapy-development`
- **Connection:** `DATABASE_URL` (Preview + Development)
- **Verwendung:** Test-Daten
- **Test-Accounts:** Siehe Seed-Daten unten

## Workflow

### 1. Neue Features entwickeln

```bash
# Stelle sicher, dass du auf develop bist
git checkout develop
git pull origin develop

# Erstelle einen Feature Branch
git checkout -b feature/mein-neues-feature

# Entwickle dein Feature
# ... code changes ...

# Commit und push
git add .
git commit -m "feat: mein neues Feature"
git push -u origin feature/mein-neues-feature
```

### 2. Pull Request erstellen

```bash
# Erstelle einen PR zu develop
gh pr create --base develop --title "feat: mein neues Feature"
```

- Der PR bekommt automatisch eine Preview-URL von Vercel
- CI/CD Pipeline läuft automatisch (Lint, Build, Tests)
- Teste die Preview-URL ausgiebig

### 3. Merge zu develop

```bash
# Nach Review und erfolgreichen Tests
gh pr merge --squash
```

- Automatisches Deployment zu develop Branch
- Teste nochmal auf der develop URL

### 4. Release zu Production

```bash
# Wenn alles auf develop getestet ist
git checkout main
git pull origin main
git merge develop
git push origin main
```

- Automatisches Deployment zu Production
- Kunden sehen die neuen Features

## Test-Accounts (Development DB)

Nach dem Seeden der Development-DB sind folgende Test-Accounts verfügbar:

### Admin

- **Email:** admin@mental-health-platform.com
- **Passwort:** Admin123!

### Client

- **Email:** demo.client@example.com
- **Passwort:** Client123!

### Therapeuten

- **Email:** dr.mueller@example.com / **Passwort:** Therapist123!
- **Email:** mag.wagner@example.com / **Passwort:** Therapist123!
- **Email:** dr.schneider@example.com / **Passwort:** Therapist123!
- **Email:** sofia.kraus@example.com / **Passwort:** Therapist123!

## Datenbank-Management

### Production DB Schema Update

```bash
# Lokale Änderungen am Schema
# ... edit prisma/schema.prisma ...

# Push zu Production (VORSICHT!)
vercel env pull .env.production --environment=production
DATABASE_URL="<production-url>" pnpm db:push
```

**⚠️ WICHTIG:** Schema-Änderungen immer zuerst auf develop testen!

### Development DB Schema Update

```bash
# Pull Development ENV
vercel env pull .env.development --environment=development

# Schema pushen
DATABASE_URL="<development-url>" pnpm db:push

# Optional: Neu seeden
DATABASE_URL="<development-url>" pnpm db:seed
```

### Development DB komplett zurücksetzen

```bash
# Pull Development ENV
vercel env pull .env.development --environment=development

# Schema pushen (überschreibt alles)
DATABASE_URL="<development-url>" pnpm db:push --force-reset

# Neu seeden
DATABASE_URL="<development-url>" pnpm db:seed
```

## CI/CD Pipeline

Die GitHub Actions Pipeline läuft bei jedem Push:

1. **Lint** - Code-Qualität prüfen
2. **Build** - Projekt bauen
3. **Unit Tests** - Tests ausführen
4. **Security Scan** - Sicherheitsprüfung

Auf **main** Branch:

- Alle Checks müssen erfolgreich sein
- Branch Protection verhindert fehlerhafte Deployments

## Vercel Deployments

### Production (main Branch)

- **URL:** https://findmytherapy-demo.vercel.app
- **Datenbank:** Prisma Accelerate (Production)
- **Automatisch:** Bei jedem Push zu main

### Development (develop Branch)

- **URL:** https://findmytherapy-qyva-git-develop-philipps-projects.vercel.app
- **Datenbank:** Vercel Postgres (Development)
- **Automatisch:** Bei jedem Push zu develop

### Preview (Feature Branches)

- **URL:** `https://findmytherapy-qyva-git-<branch-name>-philipps-projects.vercel.app`
- **Datenbank:** Vercel Postgres (Development)
- **Automatisch:** Bei jedem PR

## Tipps

- **Nie direkt auf main pushen!** Immer über develop
- **Teste ausgiebig auf develop**, bevor du zu main mergst
- **Production DB nie für Tests verwenden!** Nur die Development DB
- **Regelmäßig develop mit main syncen:** `git merge main` wenn nötig
- **Feature Branches kurz halten:** Merge oft zu develop

## Troubleshooting

### Preview Deployment schlägt fehl

- Prüfe die Vercel Logs: `vercel logs <deployment-url>`
- Stelle sicher, dass alle ENV Variables für Preview gesetzt sind

### Development DB Schema out of sync

```bash
# Pull Development ENV
vercel env pull .env.development --environment=development

# Schema neu pushen
DATABASE_URL="<development-url>" pnpm db:push
```

### CI Pipeline schlägt fehl

- Prüfe die GitHub Actions Logs: `gh run view --log-failed`
- Lokaler Test: `pnpm lint && pnpm build && pnpm test`
