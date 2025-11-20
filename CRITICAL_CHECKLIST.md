# ⚠️ KRITISCHE CHECKLISTE - IMMER BEFOLGEN ⚠️

**DIESE DATEI IST ÜBERLEBENSWICHTIG FÜR DAS PROJEKT**

Wenn du Code-Änderungen machst (egal ob manuell oder mit Claude/KI-Tools),
**MUSST** du diese Checkliste befolgen, um Production-Fehler zu vermeiden.

---

## 🔴 DATENBANK-ÄNDERUNGEN (Prisma Schema)

### ❌ NIEMALS NUR DIESE SCHRITTE:
```bash
# ❌ FALSCH - Schema ändern und direkt committen
# Bearbeite apps/web/prisma/schema.prisma
git add apps/web/prisma/schema.prisma
git commit -m "Add new model"
git push
# ☠️ PRODUCTION WIRD BRECHEN!
```

### ✅ IMMER DIESE SCHRITTE (IN DIESER REIHENFOLGE):

```bash
# 1. Schema-Datei bearbeiten
# Bearbeite: apps/web/prisma/schema.prisma

# 2. LOKAL testen
cd apps/web
DATABASE_URL="postgresql://postgres:password@localhost:5432/mental_health_dev" \
  pnpm exec prisma db push

# 3. PRODUCTION DATABASE UPDATEN (KRITISCH!)
pnpm db:verify-production
# Oder manuell:
vercel env pull .env.vercel.production --environment=production
DATABASE_URL="[URL aus .env.vercel.production]" pnpm exec prisma db push

# 4. Health-Check aufrufen um zu verifizieren
curl https://findmytherapy-qyva.vercel.app/api/health

# 5. Erst JETZT committen
git add apps/web/prisma/schema.prisma
git commit -m "Add new model [verified production DB updated]"
git push
```

### 🤖 Für Claude/AI Assistants:

**WENN DU EINE KI BIST UND DIESES PROJEKT BEARBEITEST:**

1. ✅ Lies IMMER diese Datei bevor du Prisma-Schema-Änderungen machst
2. ✅ Führe IMMER `pnpm db:verify-production` aus
3. ✅ Prüfe IMMER `/api/health` nach dem Deployment
4. ✅ Erwähne in deiner Antwort, dass du die Production-DB aktualisiert hast
5. ❌ Committe NIEMALS Schema-Änderungen ohne Production-DB-Update

**Warum ist das so wichtig?**
- Vercel verwendet eine ANDERE Datenbank als die lokale Entwicklung
- Prisma generiert den Client beim Build aus dem Schema
- Wenn die Production-Datenbank nicht das Schema hat, bricht die gesamte API

---

## 🔴 ENVIRONMENT VARIABLES

### Problem: Mehrere DATABASE_URLs

**Es gibt NICHT eine einzige DATABASE_URL!**

| Umgebung | DATABASE_URL |
|----------|--------------|
| **Lokal** | `postgresql://postgres:password@localhost:5432/mental_health_dev` |
| **Vercel Production** | `postgres://[hash]:sk_xxx@db.prisma.io:5432/postgres?sslmode=require` |
| **Vercel Preview** | Möglicherweise eine andere! |

### ✅ IMMER die richtige URL verwenden:

```bash
# Production URL holen
vercel env pull .env.vercel.production --environment=production

# Überprüfen welche URL verwendet wird
cat .env.vercel.production | grep DATABASE_URL

# Mit dieser URL arbeiten!
```

### ❌ NIEMALS annehmen:
- ❌ "Die lokale DB ist die gleiche wie Production"
- ❌ "Ein prisma db push lokal reicht"
- ❌ "Vercel wird das Schema automatisch aktualisieren"

---

## 🔴 DEPLOYMENT WORKFLOW

### Vor JEDEM Production-Deployment:

```bash
# 1. Health-Check
curl https://findmytherapy-qyva.vercel.app/api/health

# 2. Wenn Schema geändert wurde:
cd apps/web
pnpm db:verify-production

# 3. Nach dem Deployment:
curl https://findmytherapy-qyva.vercel.app/api/health

# 4. API testen:
curl -X POST https://findmytherapy-qyva.vercel.app/api/match \
  -H "Content-Type: application/json" \
  -d '{"problemAreas":["anxiety"],"languages":["German"]}'
```

---

## 🛡️ AUTOMATISCHE SAFEGUARDS

### Was ist bereits implementiert:

1. ✅ **Health-Check Endpoint** (`/api/health`)
   - Zeigt welche DB verwendet wird
   - Prüft kritische Tabellen
   - Gibt Statistiken zurück

2. ✅ **Verbesserte Error Messages**
   - Bei DB-Fehlern wird die verwendete DATABASE_URL angezeigt
   - Klare Anweisungen was zu tun ist

3. ✅ **Verifikations-Script** (`pnpm db:verify-production`)
   - Prüft automatisch Schema-Drift
   - Bietet an, Schema zu aktualisieren
   - Verhindert Deployments mit falscher Config

4. ✅ **GitHub Actions Workflow** (`.github/workflows/verify-db-schema.yml`)
   - Läuft bei jedem Push zu main
   - Überprüft Production-DB automatisch
   - Warnt bei Schema-Drift

---

## 🚨 NOTFALL-PROZEDUR

### Wenn Production broken ist:

```bash
# 1. Status prüfen
curl https://findmytherapy-qyva.vercel.app/api/health

# 2. Vercel Logs prüfen
vercel logs --follow

# 3. Production DB URL holen
vercel env pull .env.vercel.production --environment=production

# 4. Schema forcieren
cd apps/web
DATABASE_URL="[aus .env.vercel.production]" pnpm exec prisma db push --accept-data-loss

# 5. Vercel neu deployen
vercel --prod

# 6. Verifizieren
curl https://findmytherapy-qyva.vercel.app/api/health
```

---

## 📖 WEITERE DOKUMENTATION

- **Vollständige DB-Setup-Anleitung**: `apps/web/docs/DATABASE_SETUP.md`
- **Verifikations-Script**: `apps/web/scripts/verify-production-db.sh`
- **Health-Check Code**: `apps/web/lib/db-health-check.ts`

---

## ⚠️ WICHTIGSTE REGEL

**Wenn du nicht sicher bist, ob die Production-Datenbank aktualisiert wurde:**

```bash
# Führe IMMER aus:
cd apps/web
pnpm db:verify-production
```

**Es ist besser, dies 10x zu oft zu tun, als 1x zu wenig!**

---

## 🔒 Für Code-Reviews

Jeder Pull Request mit Prisma-Schema-Änderungen **MUSS**:
- [ ] `pnpm db:verify-production` ausgeführt haben
- [ ] Screenshot vom `/api/health` Endpoint nach dem Update enthalten
- [ ] Bestätigung dass Production-DB aktualisiert wurde

---

**Letzte Aktualisierung:** 20. November 2025
**Grund:** Production-Fehler durch fehlende MatchingPreferences-Tabelle
**Lösung:** Diese Checkliste + automatische Safeguards
