# Vercel Deployment Guide - FindMyTherapy

Diese Anleitung führt dich Schritt für Schritt durch das Deployment auf Vercel.

## Voraussetzungen

- Vercel Account (https://vercel.com)
- GitHub Account (empfohlen für automatische Deployments)
- Vercel Postgres Database ODER externe PostgreSQL-Datenbank

## Option 1: One-Click Deployment (Empfohlen)

### Schritt 1: GitHub Repository vorbereiten

```bash
cd /Users/philippoppel/Desktop/mental-health-platform
git init
git add .
git commit -m "Initial commit - MVP ready for deployment"
git remote add origin <DEINE-GITHUB-REPO-URL>
git push -u origin main
```

### Schritt 2: Mit Vercel verbinden

1. Gehe zu https://vercel.com/new
2. Importiere dein GitHub Repository
3. Vercel erkennt automatisch das Next.js Projekt

### Schritt 3: Build & Output Settings

```
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm turbo build --filter=web
Output Directory: apps/web/.next
Install Command: pnpm install
Node Version: 20.x
```

### Schritt 4: Environment Variables einrichten

Klicke auf "Environment Variables" und füge folgende Variablen hinzu:

#### 🔴 Kritisch - Unbedingt erforderlich

```bash
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME

# NextAuth
NEXTAUTH_URL=https://DEINE-APP.vercel.app
NEXTAUTH_SECRET=<generiere mit: openssl rand -base64 32>

# Redis (Optional für MVP, kann Dummy-Wert sein)
REDIS_URL=redis://localhost:6379

# Email (Verwende Resend oder SMTP)
EMAIL_FROM=noreply@deine-domain.de
EMAIL_PROVIDER_API_KEY=<RESEND_API_KEY oder SMTP Details>
EMAIL_SMTP_HOST=smtp.resend.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=resend
EMAIL_SMTP_PASS=<RESEND_API_KEY>

# App
APP_BASE_URL=https://DEINE-APP.vercel.app
NODE_ENV=production
```

#### 🟡 Optional - Für spätere Features

```bash
# Stripe (Kann mit Test-Keys gefüllt werden)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...
STRIPE_PRICE_LISTING_MONTHLY=price_...
STRIPE_PRICE_LISTING_YEARLY=price_...

# S3 (Kann mit Dummy-Werten gefüllt werden)
S3_ENDPOINT=https://s3.eu-central-1.amazonaws.com
S3_REGION=eu-central-1
S3_BUCKET=findmytherapy-media
S3_ACCESS_KEY_ID=dummy
S3_SECRET_ACCESS_KEY=dummy
```

### Schritt 5: Datenbank einrichten

#### Option A: Vercel Postgres (Empfohlen)

1. Gehe zu deinem Vercel Projekt Dashboard
2. Klicke auf "Storage" → "Create Database"
3. Wähle "Postgres" → "Continue"
4. Wähle Region: Frankfurt (fra1)
5. Vercel fügt automatisch `DATABASE_URL` zu deinen Env Variables hinzu

#### Option B: Externe Datenbank (z.B. Neon, Supabase)

1. Erstelle eine PostgreSQL Datenbank bei deinem Provider
2. Kopiere die Connection String
3. Füge sie als `DATABASE_URL` in Vercel ein

### Schritt 6: Datenbank initialisieren

Nach dem ersten erfolgreichen Deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link zu deinem Projekt
vercel link

# Prisma Migrationen ausführen
vercel env pull .env.production
DATABASE_URL="<DEINE_VERCEL_POSTGRES_URL>" pnpm prisma db push

# Seed-Daten laden (optional)
DATABASE_URL="<DEINE_VERCEL_POSTGRES_URL>" pnpm db:seed
```

**Alternative: Über Vercel CLI direkt**

```bash
vercel env pull .env.production
source .env.production
pnpm prisma db push
pnpm db:seed
```

### Schritt 7: Deploy!

```bash
git push origin main
```

Oder klicke einfach auf "Deploy" im Vercel Dashboard.

---

## Option 2: Vercel CLI Deployment

```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Deployment starten (folge den Prompts)
vercel

# Production Deployment
vercel --prod
```

---

## Post-Deployment Checklist

### ✅ Deployment verifizieren

1. **Öffne deine App**: https://DEINE-APP.vercel.app
2. **Teste Landing Page**: Sollte laden
3. **Teste Login**: Mit Seed-Accounts einloggen
4. **Teste Triage-Flow**: Vollständigen Fragebogen durchgehen
5. **Teste Admin-Login**: admin@mental-health-platform.com / Admin123!

### ✅ Datenbank prüfen

```bash
# Über Vercel CLI in DB verbinden
vercel env pull
DATABASE_URL="<URL>" pnpm prisma studio
```

Prüfe ob:
- ✅ Tabellen existieren
- ✅ Seed-Daten geladen sind
- ✅ User-Accounts angelegt sind

### ✅ Logs überwachen

```bash
vercel logs <DEPLOYMENT-URL>
```

Oder im Vercel Dashboard unter "Deployments" → "Logs"

---

## Troubleshooting

### Problem: Build schlägt fehl

**Fehler**: "Cannot find module @prisma/client"

**Lösung**:
```bash
# In vercel.json sicherstellen:
"buildCommand": "pnpm install && pnpm prisma generate && pnpm turbo build --filter=web"
```

### Problem: Environment Variables fehlen

**Fehler**: "Invalid environment configuration: DATABASE_URL: Required"

**Lösung**:
1. Gehe zu Vercel Dashboard → Settings → Environment Variables
2. Stelle sicher, dass ALLE erforderlichen Variablen gesetzt sind
3. Wähle Environment: Production, Preview, Development (alle 3!)
4. Redeploy mit neuem Commit oder "Redeploy" Button

### Problem: Datenbank-Verbindung schlägt fehl

**Fehler**: "Can't reach database server at ..."

**Lösung**:
- Prüfe `DATABASE_URL` Format: `postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require`
- Bei Vercel Postgres: Füge `?sslmode=require` ans Ende der URL
- Bei externen DBs: Stelle sicher, dass Vercel IPs erlaubt sind (0.0.0.0/0 für Start)

### Problem: NextAuth Fehler

**Fehler**: "Missing secret in configuration"

**Lösung**:
```bash
# Generiere ein neues Secret
openssl rand -base64 32

# Füge es als NEXTAUTH_SECRET in Vercel ein
```

### Problem: Emails werden nicht versendet

**Lösung für MVP**:
- Verwende Resend.com (100 Emails/Tag kostenlos)
- Registriere dich bei https://resend.com
- Erstelle API Key
- Setze `EMAIL_PROVIDER_API_KEY=re_...`
- Verifiziere deine Domain oder nutze resend.dev Email

---

## Custom Domain einrichten

1. Gehe zu Vercel Dashboard → Settings → Domains
2. Füge deine Domain hinzu (z.B. findmytherapy.health)
3. Folge den DNS-Anweisungen (A Record oder CNAME)
4. Aktualisiere `NEXTAUTH_URL` und `APP_BASE_URL` in Environment Variables
5. Redeploy

---

## Performance Optimierungen

### Edge Caching aktivieren

In `apps/web/next.config.js` bereits konfiguriert:
```js
experimental: {
  serverActions: true,
}
```

### ISR (Incremental Static Regeneration)

Für statische Seiten wie Blog:
```tsx
export const revalidate = 3600; // 1 Stunde
```

### Image Optimization

Next.js Image-Komponente wird automatisch von Vercel optimiert.

---

## Monitoring & Analytics

### Vercel Analytics aktivieren

1. Gehe zu Dashboard → Analytics → Enable
2. In `apps/web/app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Vercel Speed Insights

```bash
pnpm add @vercel/speed-insights --filter web
```

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

---

## Kosten-Übersicht (Stand 2025)

| Service | Free Tier | Pro |
|---------|-----------|-----|
| Vercel Hosting | 100GB Bandwidth | $20/Monat |
| Vercel Postgres | 256MB Storage | $20/Monat |
| Vercel Blob | 500MB | $0.15/GB |
| Build Minutes | 6000/Monat | Unlimited |

**MVP-Empfehlung**: Free Tier ist ausreichend für Pilotphasen & erste 1000 Nutzer.

---

## Sicherheits-Hinweise

### ⚠️ Vor Production-Launch:

1. **Rate Limiting** implementieren (z.B. mit Upstash Ratelimit)
2. **CSP Headers** konfigurieren
3. **CORS** richtig setzen
4. **Environment Secrets** rotieren
5. **Backup-Strategie** für Datenbank einrichten
6. **Monitoring** (Sentry) aktivieren

---

## Support & Hilfe

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

Bei Problemen: Öffne ein Issue im GitHub Repo oder kontaktiere das Team.

**Viel Erfolg beim Deployment! 🚀**
