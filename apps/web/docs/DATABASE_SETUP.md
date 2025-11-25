# Datenbank-Konfiguration

## Übersicht

Dieses Projekt verwendet PostgreSQL als Datenbank. Es ist **kritisch wichtig**, dass die richtige DATABASE_URL verwendet wird, um Schema-Inkonsistenzen zu vermeiden.

## Umgebungen

### Lokale Entwicklung

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/mental_health_dev"
```

### Vercel Production

Die Production-Umgebung verwendet eine Prisma-gehostete PostgreSQL-Datenbank:

```bash
DATABASE_URL="postgres://[user]:[password]@db.prisma.io:5432/postgres?sslmode=require"
```

**WICHTIG**: Die exakte URL kann mit folgendem Befehl abgerufen werden:

```bash
vercel env pull .env.vercel.production --environment=production
```

## Häufige Probleme und Lösungen

### Problem: "Table does not exist in database"

**Ursache**: Das Prisma-Schema wurde nicht auf die Produktionsdatenbank angewendet.

**Lösung**:

1. Hole die Production DATABASE_URL:

   ```bash
   vercel env pull .env.vercel.production --environment=production
   ```

2. Prüfe welche URL verwendet wird:

   ```bash
   grep DATABASE_URL .env.vercel.production
   ```

3. Wende das Schema auf die richtige Datenbank an:

   ```bash
   cd apps/web
   DATABASE_URL="[die URL aus Schritt 2]" pnpm exec prisma db push
   ```

4. Verifiziere dass die Tabellen existieren:
   ```bash
   DATABASE_URL="[die URL]" pnpm exec prisma studio
   ```

### Problem: Mehrere Datenbank-Instanzen

**Symptom**: Schema-Updates funktionieren lokal, aber nicht in Production.

**Lösung**:

- Verwende IMMER den Health-Check-Endpoint um zu verifizieren welche Datenbank verwendet wird:

  ```bash
  curl https://[your-domain].vercel.app/api/health
  ```

- Die Response zeigt die aktuelle Datenbankverbindung:
  ```json
  {
    "status": "healthy",
    "database": "db.prisma.io",
    "tables": {
      "users": 123,
      "therapists": 45,
      "matches": 678,
      "preferences": 234
    }
  }
  ```

## Schema-Updates

### Schritt-für-Schritt Anleitung

1. **Lokale Änderungen am Schema** (`apps/web/prisma/schema.prisma`)

   ```bash
   # Schema lokal testen
   DATABASE_URL="postgresql://postgres:password@localhost:5432/mental_health_dev" \
     pnpm exec prisma db push
   ```

2. **Schema in Production deployen**

   ```bash
   # Production URL holen
   vercel env pull .env.vercel.production --environment=production

   # Schema anwenden (URL aus .env.vercel.production verwenden)
   cd apps/web
   DATABASE_URL="[PRODUCTION_URL]" pnpm exec prisma db push
   ```

3. **Deployment auslösen**

   ```bash
   git add apps/web/prisma/schema.prisma
   git commit -m "Update database schema"
   git push
   ```

4. **Verifizieren**

   ```bash
   # Health-Check aufrufen
   curl https://[your-domain].vercel.app/api/health

   # API testen
   curl -X POST https://[your-domain].vercel.app/api/match \
     -H "Content-Type: application/json" \
     -d '{"problemAreas": ["anxiety"], "languages": ["German"]}'
   ```

## Automatische Schema-Validierung

Das Projekt enthält automatische Schema-Validierung:

### Health-Check Endpoint

```bash
GET /api/health
```

Dieser Endpoint prüft:

- ✅ Datenbankverbindung
- ✅ Existenz kritischer Tabellen
- ✅ Basis-Statistiken

### Startup-Validierung

Die Datei `lib/db-health-check.ts` enthält Funktionen zur Schema-Validierung:

```typescript
import { validateDatabaseSchema } from '@/lib/db-health-check';

// In kritischen API-Routes verwenden
await validateDatabaseSchema();
```

## Fehlerbehebung

### Prisma Client ist veraltet

**Symptom**: "Type 'MatchingPreferences' does not exist"

**Lösung**:

```bash
cd apps/web
pnpm exec prisma generate
```

### Falsche Datenbank wird verwendet

**Symptom**: Änderungen erscheinen nicht in Production

**Lösung**:

1. Vercel Environment Variables überprüfen:

   ```bash
   vercel env ls
   ```

2. Production DATABASE_URL verifizieren:

   ```bash
   vercel env pull .env.vercel.production --environment=production
   cat .env.vercel.production | grep DATABASE_URL
   ```

3. Mit dieser URL direkt auf die Datenbank zugreifen:
   ```bash
   PGPASSWORD="[password]" psql -h db.prisma.io -p 5432 -U [user] -d postgres -c "\dt"
   ```

## Best Practices

1. ✅ **Immer** die richtige DATABASE_URL verwenden
2. ✅ **Vor** Schema-Änderungen ein Backup erstellen
3. ✅ **Nach** Schema-Änderungen den Health-Check aufrufen
4. ✅ Schema-Änderungen in Git committen
5. ✅ Nie `--force` bei Prisma-Befehlen verwenden (außer explizit gewünscht)
6. ✅ Den Health-Check-Endpoint für Monitoring nutzen

## Monitoring

### Regelmäßige Checks

Setup eines Cron-Jobs für regelmäßige Health-Checks:

```bash
# Alle 5 Minuten
*/5 * * * * curl -f https://[your-domain].vercel.app/api/health || echo "Health check failed"
```

### Sentry Integration

Fehler in der Matching-API werden automatisch mit detaillierten Informationen geloggt:

- Datenbank-URL (teilweise maskiert)
- Fehlende Tabellen
- Stack Traces

## Notfall-Prozedur

Falls die Production-Datenbank nicht erreichbar ist:

1. **Status prüfen**:

   ```bash
   curl https://[your-domain].vercel.app/api/health
   ```

2. **Vercel Logs prüfen**:

   ```bash
   vercel logs --follow
   ```

3. **Datenbank direkt testen**:

   ```bash
   vercel env pull .env.vercel.production --environment=production
   source .env.vercel.production
   PGPASSWORD="[password]" psql -h db.prisma.io -p 5432 -U [user] -d postgres -c "SELECT 1"
   ```

4. **Schema-Status prüfen**:
   ```bash
   DATABASE_URL="[production-url]" pnpm exec prisma db push --dry-run
   ```
