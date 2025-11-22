# Analyse: Anreicherung der Therapeuten-Daten

## Zusammenfassung

Dieses Dokument analysiert Möglichkeiten, zusätzliche Details für jeden Therapeuten aus dem BMSGPK-Register zu finden und in die Datenbank zu übernehmen.

## 1. Aktuelle Datenbasis

### CSV-Import von gesundheit.gv.at

**Quelle**: https://psychotherapie.ehealth.gv.at/
**Format**: CSV-Export (`/tmp/pth_search.csv`)
**Import-Script**: `apps/web/import-register-therapists.mjs`

### Bereits extrahierte Felder:

```typescript
✅ Verfügbar aus CSV:
- Name (Vorname, Nachname)
- Titel
- Eintragungs-Nummer (licenseId)
- Email (Email1, Email2, Email3)
- Telefon
- Standorte (Berufssitz 1-4, Arbeitsort 1-4)
  - Label, Straße, Hausnummer, PLZ, Ort, Telefon
- PTH-Methoden (Therapiemethoden)
- Eintragungsdatum
- GPL (Gesamt-Vertragsliste) - ja/nein
- KPL (Kassen-Partnerliste) - ja/nein
- Psychotherapie - ja/nein
- Musiktherapie - ja/nein
```

## 2. Fehlende Daten in der Datenbank

### Datenbank-Schema vorhanden, aber meist leer:

```typescript
🔶 In DB-Schema definiert, aber nicht befüllt:
- websiteUrl - Persönliche Website
- socialLinkedin, socialInstagram, socialFacebook - Social Media
- videoUrl - Vorstellungsvideo
- profileImageUrl - Profilbild
- postalCode, street, state - Strukturierte Adresse
- latitude, longitude - GPS-Koordinaten (teilweise via Geocoding)
- priceMin, priceMax - Preisspanne
- ageGroups - Altersgruppen (z.B. "Kinder", "Erwachsene")
- qualifications - Zusätzliche Qualifikationen
- about - Ausführliche Über-mich Beschreibung
- availabilityStatus - Verfügbarkeitsstatus
- nextAvailableDate - Nächster freier Termin
- estimatedWaitWeeks - Wartezeit in Wochen
```

## 3. Möglichkeiten zur Datenanreicherung

### Option A: Erweiterte Websuche pro Therapeut 🟢 MACHBAR

**Ansatz**: Google-Suche nach jedem Therapeuten + strukturierte Datenextraktion

**Technische Umsetzung**:
```typescript
// Pseudo-Code für automatische Anreicherung
for (const therapist of therapists) {
  // 1. Google-Suche
  const searchQuery = `${therapist.displayName} Psychotherapeut ${therapist.city}`;
  const searchResults = await googleSearch(searchQuery);

  // 2. Website finden
  const website = extractWebsite(searchResults);

  // 3. Website scrapen
  if (website) {
    const scrapedData = await scrapeWebsite(website);

    // Extrahiere:
    // - Social Media Links (LinkedIn, Instagram, Facebook)
    // - Profilbild
    // - Detaillierte Beschreibung
    // - Preise
    // - Spezialisierungen
  }
}
```

**Vorteile**:
- ✅ Automatisierbar
- ✅ Kann viele zusätzliche Details finden
- ✅ Legitim (öffentlich verfügbare Daten)

**Nachteile**:
- ⚠️ Nicht alle Therapeuten haben Website
- ⚠️ Datenqualität variiert stark
- ⚠️ Rate Limits bei Google-API beachten
- ⚠️ Erfordert Validierung der Daten

**Geschätzte Erfolgsrate**: 40-60% der Therapeuten

---

### Option B: psyonline.at Integration 🟡 BEGRENZT MACHBAR

**Ansatz**: psyonline.at als zusätzliche Datenquelle nutzen

**Verfügbare Daten auf psyonline.at**:
- Detaillierte Profile mit Foto
- Ausführliche Beschreibungen
- Preise
- Spezialisierungen
- Kassenverträge
- Kontaktdaten

**Technische Umsetzung**:
```typescript
// Name-Matching zwischen BMSGPK und psyonline.at
const psyonlineProfile = await searchPsyonline({
  firstName: therapist.firstName,
  lastName: therapist.lastName,
  city: therapist.city,
});

if (psyonlineProfile && isMatch(psyonlineProfile, therapist)) {
  // Zusätzliche Daten übernehmen
  therapist.about = psyonlineProfile.description;
  therapist.profileImageUrl = psyonlineProfile.photo;
  therapist.websiteUrl = psyonlineProfile.website;
  therapist.priceMin = psyonlineProfile.priceMin;
  therapist.priceMax = psyonlineProfile.priceMax;
}
```

**Vorteile**:
- ✅ Hohe Datenqualität
- ✅ Strukturierte Daten
- ✅ Viele Therapeuten sind dort gelistet

**Nachteile**:
- ⚠️ Nicht alle BMSGPK-Therapeuten sind auf psyonline.at
- ⚠️ Matching-Probleme (gleiche Namen)
- ⚠️ Rechtliche Grauzone (AGBs prüfen)
- ⚠️ Anti-Scraping Maßnahmen möglich

**Geschätzte Erfolgsrate**: 30-50% der Therapeuten

---

### Option C: Direkte Therapeuten-Befragung 🟢 SAUBER & LEGAL

**Ansatz**: Therapeuten per Email kontaktieren und um Profil-Vervollständigung bitten

**Technische Umsetzung**:
```typescript
// 1. Email-Kampagne an alle importierten Therapeuten
const emailTemplate = `
Sehr geehrte/r ${therapist.displayName},

wir haben Sie aus dem offiziellen BMSGPK-Register in unsere
Plattform findmytherapy.at aufgenommen.

Um Ihr Profil zu vervollständigen, würden wir Sie bitten,
folgende Informationen zu ergänzen:

- Profilbild
- Ausführliche Beschreibung
- Website & Social Media
- Preise
- Spezialisierungen

Profil vervollständigen: [Link zum Claim-Prozess]

Mit freundlichen Grüßen
Das findmytherapy.at Team
`;

await sendEmail(therapist.email, emailTemplate);
```

**Vorteile**:
- ✅ Rechtlich absolut sauber
- ✅ Therapeuten können selbst entscheiden
- ✅ Hohe Datenqualität (direkt von der Quelle)
- ✅ Baut Beziehung zu Therapeuten auf
- ✅ DSGVO-konform

**Nachteile**:
- ⚠️ Zeitaufwändig
- ⚠️ Niedrige Response-Rate (geschätzt 5-15%)
- ⚠️ Erfordert Email-System mit Claim-Prozess

**Geschätzte Erfolgsrate**: 5-15% Antwortrate

---

### Option D: Manuelle Recherche 🔴 NICHT SKALIERBAR

**Ansatz**: Für jeden Therapeuten manuell googeln und Daten sammeln

**Vorteile**:
- ✅ Höchste Datenqualität
- ✅ Keine technischen Probleme

**Nachteile**:
- ❌ Nicht skalierbar (4000+ Therapeuten!)
- ❌ Sehr zeitaufwändig
- ❌ Fehleranfällig

**Geschätzte Erfolgsrate**: 100% (aber nicht praktikabel)

---

## 4. Empfehlung: Hybrid-Ansatz

### Phase 1: Automatisierte Basisanreicherung 🤖
```typescript
// Script: scripts/enrich-therapist-profiles-web.ts

1. Google-Suche für jeden Therapeuten
2. Website-Erkennung
3. Strukturierte Datenextraktion:
   - Social Media Links
   - Website
   - Profilbild (falls vorhanden)
4. Speicherung in DB mit Confidence-Score
```

### Phase 2: Therapeuten-Aktivierung 📧
```typescript
// Email-Kampagne an alle Therapeuten

1. Willkommens-Email mit Profil-Link
2. Möglichkeit zum "Claim" des Profils
3. Profil-Editor für Therapeuten
4. Verifizierung der Email-Adresse
```

### Phase 3: Manuelle Nachbearbeitung ✋
```typescript
// Für wichtige/populäre Therapeuten

1. Top 50 Therapeuten (nach Stadt/Spezialisierung)
2. Manuelle Recherche & Profil-Vervollständigung
3. Qualitätskontrolle
```

---

## 5. Implementierungs-Roadmap

### Script 1: Web-Enrichment (Semi-automatisch)
```bash
# Neues Script erstellen
scripts/enrich-from-web.ts

# Funktionalität:
- Google Custom Search API Integration
- Website-Scraping mit Playwright
- Datenextraktion mit AI (Claude/GPT)
- Confidence Scoring
- Batch-Verarbeitung mit Rate Limiting
```

### Script 2: Email-Kampagne
```bash
# Profil-Claim System
apps/web/app/claim/[token]/page.tsx

# Funktionalität:
- Token-basierte Email-Links
- Profil-Editor für Therapeuten
- Email-Verifizierung
- Automatische Status-Updates
```

### Script 3: Data Quality Check
```bash
scripts/validate-therapist-data.ts

# Funktionalität:
- Datenqualitäts-Metriken
- Vollständigkeits-Score pro Profil
- Anomalie-Erkennung
- Reports für manuelle Nachbearbeitung
```

---

## 6. Rechtliche & ethische Überlegungen

### ✅ Erlaubt & Empfohlen:
- Google-Suche nach öffentlichen Informationen
- Scraping von öffentlich zugänglichen Websites (mit Respekt für robots.txt)
- Verwendung von offiziellen Registerdaten (BMSGPK)
- Direkter Kontakt mit Therapeuten per Email (mit Opt-out)

### ⚠️ Grauzone (AGBs prüfen):
- Scraping von psyonline.at oder ähnlichen Verzeichnissen
- Verwendung von geschützten Datenbanken
- Automatisierte Anfragen ohne Rate Limiting

### ❌ Nicht erlaubt:
- Scraping hinter Login-Walls
- Verwendung von persönlichen Daten ohne Einwilligung
- Aggressive Scraping-Techniken (DDoS-ähnlich)
- Falsche Angaben über Datenherkunft

---

## 7. Datenqualität & Validierung

### Validierungs-Pipeline:
```typescript
interface ValidationResult {
  field: string;
  value: any;
  confidence: 'high' | 'medium' | 'low';
  source: 'csv' | 'web' | 'manual' | 'therapist';
  needsReview: boolean;
}

// Beispiel:
{
  field: 'websiteUrl',
  value: 'https://therapie-mueller.at',
  confidence: 'high',  // Domain enthält Therapeuten-Name
  source: 'web',
  needsReview: false
}

{
  field: 'priceMin',
  value: 80,
  confidence: 'low',  // Aus unstrukturiertem Text extrahiert
  source: 'web',
  needsReview: true
}
```

---

## 8. Nächste Schritte

### Sofort umsetzbar (Option C):
1. ✅ Email-System für Therapeuten-Aktivierung aufsetzen
2. ✅ Profil-Claim Prozess implementieren
3. ✅ Email-Kampagne starten

### Mittelfristig (Option A):
1. 🔧 Google Custom Search API einrichten
2. 🔧 Web-Scraping Script entwickeln
3. 🔧 AI-basierte Datenextraktion implementieren
4. 🔧 Batch-Verarbeitung mit Monitoring

### Optional (Option B):
1. ❓ psyonline.at AGBs prüfen
2. ❓ Matching-Algorithmus entwickeln
3. ❓ Scraping-Script testen (respektvoll)

---

## Fazit

**Empfehlung**: Kombination aus Option A (Web-Enrichment) und Option C (Therapeuten-Befragung)

- **Option C** sollte **sofort** gestartet werden (rechtlich sauber, baut Community auf)
- **Option A** kann **parallel** entwickelt werden (automatisiert, skalierbar)
- **Option B** nur nach rechtlicher Prüfung in Betracht ziehen

**Geschätzte Gesamterfolgsrate**: 50-70% der Therapeuten mit mindestens einer zusätzlichen Information (Website, Foto, oder Social Media)

---

## Technische Hinweise

### Rate Limiting:
```typescript
// Respektvolle Scraping-Konfiguration
const CONFIG = {
  requestsPerSecond: 1,      // Max 1 Anfrage pro Sekunde
  delayBetweenBatches: 5000, // 5 Sekunden Pause nach je 10 Anfragen
  maxRetries: 3,
  timeout: 10000,            // 10 Sekunden Timeout
  respectRobotsTxt: true,
};
```

### Monitoring:
```typescript
// Metrics zu tracken
interface EnrichmentMetrics {
  totalProcessed: number;
  successfulEnrichments: number;
  failedEnrichments: number;
  fieldsAdded: {
    websiteUrl: number;
    profileImageUrl: number;
    socialLinkedin: number;
    // ...
  };
  averageConfidenceScore: number;
  processingTimeMs: number;
}
```
