# ⚡ Vercel Deployment - Schnellstart (5 Minuten)

Diese Anleitung bringt deine App in 5 Minuten live auf Vercel.

## 📋 Voraussetzungen

- ✅ Vercel Account (https://vercel.com - kostenlos)
- ✅ GitHub Repository (push deinen Code erst zu GitHub)

## 🚀 3-Schritt-Deployment

### Schritt 1: GitHub Repository erstellen (1 Min)

```bash
cd /Users/philippoppel/Desktop/mental-health-platform

# Git initialisieren (falls noch nicht geschehen)
git init
git add .
git commit -m "Initial commit - ready for deployment"

# GitHub Repo erstellen und pushen
# Gehe zu https://github.com/new
# Erstelle Repository "findmytherapy" (oder anderer Name)
# Dann:
git remote add origin git@github.com:DEIN-USERNAME/findmytherapy.git
git branch -M main
git push -u origin main
```

### Schritt 2: Bei Vercel importieren (2 Min)

1. Gehe zu https://vercel.com/new
2. Klicke auf "Import Git Repository"
3. Wähle dein GitHub Repository "findmytherapy"
4. **Framework Preset**: Next.js wird automatisch erkannt
5. **Root Directory**: Lasse leer (oder wähle `./`)
6. **Build Settings**:
   - Build Command: `pnpm vercel-build` (oder lasse default)
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`

### Schritt 3: Environment Variables setzen (2 Min)

Klicke auf **"Environment Variables"** und füge hinzu:

#### 🔴 Minimum Setup (für ersten Test)

```bash
# NextAuth
NEXTAUTH_URL=https://WIRD-VON-VERCEL-GESETZT.vercel.app
NEXTAUTH_SECRET=<openssl rand -base64 32>

# Email (verwende Dummy-Werte für ersten Test)
EMAIL_FROM=noreply@test.com
EMAIL_PROVIDER_API_KEY=dummy
EMAIL_SMTP_HOST=localhost
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=dummy
EMAIL_SMTP_PASS=dummy

# App
APP_BASE_URL=https://WIRD-VON-VERCEL-GESETZT.vercel.app
NODE_ENV=production

# Dummy-Werte für Build (werden später ersetzt)
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_PUBLISHABLE_KEY=pk_test_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy
STRIPE_CONNECT_CLIENT_ID=ca_dummy
STRIPE_PRICE_LISTING_MONTHLY=price_dummy
STRIPE_PRICE_LISTING_YEARLY=price_dummy
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=eu-central-1
S3_BUCKET=dummy
S3_ACCESS_KEY_ID=dummy
S3_SECRET_ACCESS_KEY=dummy
```

**Wichtig**: Für `DATABASE_URL` siehe nächster Abschnitt!

### Schritt 3.5: Datenbank einrichten

#### Option A: Vercel Postgres (Empfohlen - 1 Minute)

1. Im Vercel Dashboard: Storage → Create Database → Postgres
2. Wähle Region: Frankfurt (fra1)
3. Vercel fügt automatisch `DATABASE_URL` hinzu ✅
4. Fertig!

#### Option B: Externe DB (Neon, Supabase, etc.)

1. Erstelle PostgreSQL DB bei deinem Provider
2. Kopiere Connection String
3. Füge als `DATABASE_URL` in Vercel Environment Variables ein
4. Format: `postgresql://user:pass@host:5432/db?sslmode=require`

### Schritt 4: Deploy! 🚀

Klicke auf **"Deploy"**

Vercel wird jetzt:
- ✅ Code von GitHub holen
- ✅ Dependencies installieren
- ✅ Build durchführen
- ✅ App deployen

**Dauer**: ~2-3 Minuten

---

## 🗄️ Datenbank initialisieren (Post-Deployment)

Nach erfolgreichem Deployment:

### Schnelle Methode (5 Befehle):

```bash
# 1. Vercel CLI installieren
npm i -g vercel

# 2. Login
vercel login

# 3. Projekt verknüpfen
vercel link

# 4. Script ausführen
./scripts/init-production-db.sh

# 5. Fertig! 🎉
```

### Manuelle Methode:

```bash
# Environment Variables holen
vercel env pull .env.production

# Database Schema erstellen
source .env.production
pnpm prisma db push

# Seed-Daten laden (optional)
pnpm db:seed

# Cleanup
rm .env.production
```

---

## ✅ Testen

Öffne deine Vercel URL: `https://dein-projekt.vercel.app`

### Test-Accounts (nach Seed):

| Rolle | Email | Passwort |
|-------|-------|----------|
| Admin | admin@mental-health-platform.com | Admin123! |
| Client | demo.client@example.com | Client123! |
| Therapeut | dr.mueller@example.com | Therapist123! |

### Test-Checkliste:

- [ ] Landing Page lädt
- [ ] Login funktioniert
- [ ] Triage-Flow läuft durch
- [ ] Therapeuten-Verzeichnis zeigt Profile
- [ ] Dashboard zeigt Daten
- [ ] Admin kann Therapeuten verifizieren

---

## 🔧 Nach dem ersten Deployment

### NEXTAUTH_URL & APP_BASE_URL aktualisieren

1. Notiere deine Vercel URL (z.B. `findmytherapy.vercel.app`)
2. Gehe zu Vercel Dashboard → Settings → Environment Variables
3. Aktualisiere:
   - `NEXTAUTH_URL=https://findmytherapy.vercel.app`
   - `APP_BASE_URL=https://findmytherapy.vercel.app`
4. Klicke auf "Redeploy" (ohne neuen Commit)

### Email-Versand einrichten (Optional)

Für funktionierende Emails:

1. Registriere dich bei https://resend.com (100 Emails/Tag free)
2. Erstelle API Key
3. Update in Vercel:
   ```
   EMAIL_FROM=noreply@deine-domain.de
   EMAIL_PROVIDER_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_SMTP_HOST=smtp.resend.com
   EMAIL_SMTP_PORT=587
   EMAIL_SMTP_USER=resend
   EMAIL_SMTP_PASS=<DEIN_RESEND_KEY>
   ```
4. Redeploy

---

## 🎯 Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add Domain: `findmytherapy.health`
3. Folge DNS-Anweisungen
4. Update `NEXTAUTH_URL` und `APP_BASE_URL`
5. Redeploy

---

## 🐛 Troubleshooting

### Build schlägt fehl?

**Fehler**: "Cannot find module"
```bash
# Lösung: Stelle sicher dass vercel-build Script existiert
# In package.json sollte sein:
"vercel-build": "pnpm prisma generate && pnpm turbo build --filter=web"
```

### Database Connection Error?

**Fehler**: "Can't reach database"
```bash
# Lösung 1: Füge ?sslmode=require ans Ende der DATABASE_URL
DATABASE_URL=postgresql://...?sslmode=require

# Lösung 2: Bei Vercel Postgres - stelle sicher dass DB in gleicher Region wie App
```

### NextAuth Error?

**Fehler**: "Missing secret"
```bash
# Generiere neues Secret:
openssl rand -base64 32

# Füge als NEXTAUTH_SECRET in Vercel ein
```

### Environment Variables werden nicht geladen?

1. Gehe zu Settings → Environment Variables
2. Stelle sicher dass für **alle** Environments gesetzt:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
3. Redeploy

---

## 📊 Monitoring

### Vercel Analytics aktivieren

```bash
pnpm add @vercel/analytics --filter web
```

In `apps/web/app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Logs anzeigen

```bash
vercel logs
# oder
vercel logs --follow
```

Im Dashboard: Deployments → Select Deployment → Logs

---

## 💰 Kosten

**Free Tier**: Perfekt für MVP & Pilotphasen
- 100 GB Bandwidth
- Unlimited Requests
- 6000 Build Minutes/Monat
- 256 MB Postgres Storage

**Bei Überschreitung**: ~$20/Monat für Pro

---

## 🆘 Hilfe

- 📚 Vollständige Anleitung: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 Issues: GitHub Issues erstellen
- 💬 Vercel Docs: https://vercel.com/docs

---

**🎉 Geschafft! Deine App ist jetzt live auf Vercel!**

Teile die URL mit deinem Team für Pilot-Tests & internes Feedback.
