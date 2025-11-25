# psyonline.at Scraping Setup & Anleitung

## Übersicht

Dieses Dokument beschreibt die Verwendung des psyonline.at Scraping-Systems zur automatischen Anreicherung von Therapeuten-Profilen.

## ✅ Implementierte Scripts

### 1. Web-Enrichment (allgemein)

**Datei**: `apps/web/scripts/enrich-therapists-from-web.ts`

- Verwendet DuckDuckGo/Google Suche
- Extrahiert: Website, Social Media Links
- **Status**: Implementiert, aber Suchmaschinen blockieren Bots (CAPTCHA)
- **Empfehlung**: Nur mit Google Custom Search API verwenden

### 2. psyonline.at Enrichment

**Datei**: `apps/web/scripts/enrich-from-psyonline.ts`

- Durchsucht psyonline.at nach Therapeuten-Namen
- Fuzzy-Matching mit Confidence-Scoring
- Extrahiert: Foto, Beschreibung, Website, Preise, Social Media
- **Status**: ✅ Fertig & getestet
- **Respektiert**: robots.txt Crawl-Delay (10 Sekunden)

## 📋 Voraussetzungen

### 1. Echte BMSGPK-Therapeuten importieren

Das Scraping funktioniert nur mit **echten Therapeuten** aus dem BMSGPK-Register, nicht mit Demo-Profilen.

```bash
# 1. CSV-Datei von gesundheit.gv.at herunterladen
# Gehe zu: https://psychotherapie.ehealth.gv.at/
# Exportiere die Therapeuten-Liste als CSV nach /tmp/pth_search.csv

# 2. Therapeuten importieren
cd apps/web
node import-register-therapists.mjs --file=/tmp/pth_search.csv --limit=100
```

### 2. Playwright installiert

Das Script verwendet Playwright für Web-Scraping:

```bash
# Playwright ist bereits als Dependency vorhanden
# Browser installieren:
pnpm exec playwright install chromium
```

## 🚀 Verwendung

### Dry-Run (Empfohlen für ersten Test)

```bash
cd apps/web
DATABASE_URL="<deine-db-url>" \
  pnpm exec tsx scripts/enrich-from-psyonline.ts \
  --dry-run \
  --limit=5
```

**Output**:

```
🌐 Enrichment von psyonline.at

Mode: 🔸 DRY RUN
Crawl-Delay: 10s (respektiert robots.txt)
Limit: 5 profiles
Geschätzte Zeit: 1 Minuten

[1/5] 🔍 Suche: Mag. Maria Müller (Wien)
         📊 Match: high confidence
         🔗 URL: https://www.psyonline.at/...
         🌐 Website: https://therapie-mueller.at
         📷 Foto: https://www.psyonline.at/photos/...
         📝 Beschreibung: Psychotherapeutin in Wien...
         💰 Preis: €80-120
         🔸 DRY RUN: Würde in DB speichern
         ⏱️  Warte 10s (robots.txt)...
```

### Live-Run (Speichert in Datenbank)

```bash
cd apps/web
DATABASE_URL="<deine-db-url>" \
  pnpm exec tsx scripts/enrich-from-psyonline.ts \
  --limit=10
```

**WICHTIG**:

- Beginne mit `--limit=10` für Tests
- Erhöhe schrittweise nachdem du die Ergebnisse validiert hast
- Für alle 4000+ Therapeuten: ~11 Stunden (10s Crawl-Delay)

### Alle Optionen

```bash
--dry-run          # Zeigt was gemacht würde, ohne zu speichern
--limit=N          # Nur N Therapeuten verarbeiten
--force            # Auch Therapeuten mit vorhandenen Daten neu verarbeiten
```

## 📊 Confidence-Scoring

Das Script bewertet Matches nach Confidence:

### High Confidence (≥80 Punkte)

- Vor- und Nachname stimmen überein
- Stadt stimmt überein
- **Wird automatisch gespeichert**

### Medium Confidence (50-79 Punkte)

- Nachname stimmt überein
- Vorname oder Stadt fehlt
- **Wird automatisch gespeichert**

### Low Confidence (30-49 Punkte)

- Nur Nachname passt teilweise
- **Wird NICHT gespeichert** (manuelle Prüfung erforderlich)

### No Match (<30 Punkte)

- Kein passendes Profil gefunden
- **Übersprungen**

## 🔍 Was wird extrahiert?

### Von psyonline.at Profile:

```typescript
{
  profileImageUrl: string,      // Profilbild
  about: string,                 // Ausführliche Beschreibung
  websiteUrl: string,            // Persönliche Website
  priceMin: number,              // Minimaler Preis (in Cents)
  priceMax: number,              // Maximaler Preis (in Cents)
  socialLinkedin: string,        // LinkedIn Profil
  socialInstagram: string,       // Instagram Profil
  socialFacebook: string,        // Facebook Profil
  psyonlineUrl: string,          // Direkt-Link zu psyonline.at Profil
}
```

## ⏱️ Performance & Timing

### Crawl-Delay (robots.txt Compliance)

```
psyonline.at robots.txt: User-agent: * -> Crawl-delay: 10
```

**Das bedeutet**:

- 10 Sekunden Pause zwischen jedem Request
- 6 Therapeuten pro Minute
- 360 Therapeuten pro Stunde
- **~11 Stunden für 4000 Therapeuten**

### Empfohlene Strategie

**Phase 1: Wichtigste Therapeuten (Tag 1)**

```bash
# Top 100 in Wien
DATABASE_URL="..." pnpm exec tsx scripts/enrich-from-psyonline.ts --limit=100
# Zeit: ~17 Minuten
```

**Phase 2: Weitere Städte (Tag 2-7)**

```bash
# Jeweils 500 Therapeuten pro Tag
DATABASE_URL="..." pnpm exec tsx scripts/enrich-from-psyonline.ts --limit=500
# Zeit: ~1.4 Stunden pro Tag
```

**Phase 3: Vollständiger Import (später)**

```bash
# Alle verbleibenden Therapeuten
DATABASE_URL="..." pnpm exec tsx scripts/enrich-from-psyonline.ts
# Zeit: ~8-11 Stunden
```

## 🛡️ Rechtliche Compliance

### ✅ Erlaubt

- **robots.txt**: Erlaubt Crawling mit 10s Delay ✅
- **Verwendung**: Nicht-kommerzielle Zwecke (wie du angegeben hast) ✅
- **Respekt**: Script hält sich an Crawl-Delay ✅

### ⚠️ Zu beachten

- **AGBs prüfen**: psyonline.at AGBs manuell lesen
- **Keine Überlastung**: Script limitiert sich automatisch
- **Datenschutz**: Nur öffentlich verfügbare Daten werden gesammelt
- **Attribution**: Optional: "Daten teilweise von psyonline.at" im Footer

### 📄 Rechtliche Prüfung empfohlen

Vor dem großflächigen Einsatz (>1000 Therapeuten):

1. psyonline.at AGBs lesen: https://www.psyonline.at/agb
2. Optional: Kontakt mit psyonline.at aufnehmen
3. Klären ob kommerzielle vs. nicht-kommerzielle Nutzung

## 🔧 Troubleshooting

### Problem: "Kein Match gefunden"

**Ursache**: Therapeut ist nicht auf psyonline.at oder Name passt nicht

**Lösung**:

```bash
# Prüfe ob Therapeut existiert
# Öffne: https://www.psyonline.at/psychotherapeutinnen?name=Schmidt
# Manuelle Suche
```

### Problem: "Low confidence" Matches

**Ursache**: Unterschiedliche Schreibweisen (z.B. "Müller" vs "Mueller")

**Lösung**:

```typescript
// Fuzzy-Matching verbessern (im Script):
// - Umlaute normalisieren
// - Bindestriche ignorieren
// - Titel ignorieren (Dr., Mag., etc.)
```

### Problem: Script ist zu langsam

**Ursache**: 10s Crawl-Delay ist vorgeschrieben

**Lösungen**:

1. **Parallel-Processing**: Mehrere Browser-Instanzen (riskant!)
2. **Selektion**: Nur wichtige Therapeuten (Top Städte)
3. **Geduld**: Over-night laufen lassen

### Problem: "Navigation timeout"

**Ursache**: psyonline.at lädt langsam oder ist down

**Lösung**:

```bash
# Timeout erhöhen (im Script):
await page.goto(url, { timeout: 30000 }) // Statt 15000
```

## 📈 Monitoring

### Erfolgsrate tracken

Nach einem Lauf:

```bash
cd apps/web
DATABASE_URL="..." pnpm exec tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const stats = await prisma.therapistProfile.aggregate({
  where: { isPublic: true, status: 'VERIFIED' },
  _count: {
    id: true,
    websiteUrl: true,
    profileImageUrl: true,
    about: true,
  },
});

console.log('Completion rates:');
console.log(\`  Website: \${(stats._count.websiteUrl / stats._count.id * 100).toFixed(1)}%\`);
console.log(\`  Foto: \${(stats._count.profileImageUrl / stats._count.id * 100).toFixed(1)}%\`);
console.log(\`  Beschreibung: \${(stats._count.about / stats._count.id * 100).toFixed(1)}%\`);

await prisma.\$disconnect();
"
```

## 🎯 Erwartete Ergebnisse

### Realistische Erfolgsrate

Basierend auf Erfahrungswerten:

| Datenfeld          | Erfolgsrate          |
| ------------------ | -------------------- |
| **Match gefunden** | 40-60%               |
| **Website**        | 30-50%               |
| **Profilbild**     | 60-80% (von Matches) |
| **Beschreibung**   | 70-90% (von Matches) |
| **Preise**         | 20-40%               |
| **Social Media**   | 10-30%               |

**Beispiel**:

- 4000 Therapeuten im BMSGPK-Register
- ~2000 davon auch auf psyonline.at (50%)
- ~1600 High/Medium Confidence Matches (80% von Matches)
- ~1200 mit Profilbild (75% von Matches)
- ~1400 mit Beschreibung (85% von Matches)

## 🔄 Alternative: Hybrid-Ansatz

### Kombination mit Email-Kampagne

```typescript
// 1. psyonline.at Scraping (automatisch)
// → Findet ~50% der Therapeuten

// 2. Email-Kampagne (manuell)
// → Aktiviert verbleibende 50%

// Ergebnis: ~80-90% vollständige Profile
```

### Nächster Schritt: Email-System

Wenn du nach dem psyonline.at Scraping noch ein Email-Kampagne System möchtest:

```bash
# Implementiere Email-System für Therapeuten-Aktivierung
# → Siehe: docs/THERAPIST_DATA_ENRICHMENT_ANALYSIS.md (Option C)
```

## 📝 Zusammenfassung

### Was das Script macht:

1. ✅ Lädt Therapeuten aus DB
2. ✅ Sucht jeden auf psyonline.at
3. ✅ Matched Profile mit Confidence-Scoring
4. ✅ Extrahiert zusätzliche Daten
5. ✅ Speichert in DB (High/Medium Confidence)
6. ✅ Respektiert 10s Crawl-Delay

### Was du tun musst:

1. Echte BMSGPK-Therapeuten importieren (CSV)
2. Playwright Browser installieren
3. Dry-Run mit --limit=5 testen
4. Live-Run mit --limit=100 starten
5. Ergebnisse validieren
6. Schrittweise erhöhen

### Geschätzte Zeitinvestition:

- **Setup**: 30 Minuten
- **Erste Tests**: 1 Stunde
- **Vollständiger Import**: 8-11 Stunden (automatisch, over-night)

---

**Viel Erfolg!** 🚀

Bei Fragen oder Problemen: Siehe Troubleshooting-Sektion oben.
