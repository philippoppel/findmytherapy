# Verschlüsselungs-Implementation für Session-Zero-Dossiers

## Übersicht

Dieses Dokument beschreibt die Implementierung der Ende-zu-Ende-Verschlüsselung für Session-Zero-Dossiers, die sensible Ersteinschätzungsdaten von Klient:innen an verifizierte Therapeut:innen übermitteln.

## Sicherheitsarchitektur

### Verschlüsselung

- **Algorithmus**: AES-256-GCM (Authenticated Encryption with Associated Data)
- **Schlüsselverwaltung**: PBKDF2-basierte Schlüsselableitung mit 100.000 Iterationen
- **IV (Initialization Vector)**: 16 Bytes, zufällig generiert für jede Verschlüsselung
- **Authentication Tag**: 16 Bytes für Datenintegrität

### Datenschutz

- **IP-Hashing**: SHA-256-Hash von IP-Adressen für Zugriffsprotokolle
- **Pseudonymisierung**: Klient:innen können Alias statt Klarnamen verwenden
- **Zugriffskontrolle**: Nur verifizierte Therapeut:innen aus der Empfehlungsliste erhalten Zugriff
- **Zeitliche Begrenzung**: Signierte URLs laufen nach 72 Stunden ab (konfigurierbar)

## Implementierte Komponenten

### 1. Datenbankschema (`packages/db/prisma/schema.prisma`)

Neue Modelle:

- `SessionZeroDossier`: Speichert verschlüsselte Dossiers
- `DossierAccessLog`: Protokolliert alle Zugriffe (DSGVO-konform)
- `ClientConsent`: Verwaltet Einwilligungen zur Datenweitergabe

### 2. Verschlüsselungs-Utilities (`apps/web/lib/encryption.ts`)

Funktionen:

- `encryptDossierData()`: Verschlüsselt Dossier-Payloads
- `decryptDossierData()`: Entschlüsselt Dossier-Payloads
- `buildDossierPayload()`: Erstellt strukturierte Dossier-Daten aus Triage-Sessions
- `hashIPAddress()`: Hasht IP-Adressen für Logs

### 3. Storage-Abstraktion (`apps/web/lib/storage.ts`)

Funktionen:

- `generateSignedDossierURL()`: Erstellt JWT-signierte URLs mit Ablaufdatum
- `verifySignedDossierToken()`: Verifiziert signierte Tokens
- Unterstützt lokalen Filesystem-Storage (dev) und S3 (production-ready)

### 4. API-Endpoints

#### POST `/api/dossiers`

Erstellt ein neues verschlüsseltes Dossier:

- Validiert Einwilligung (ClientConsent)
- Verschlüsselt sensible Daten
- Generiert signierte URLs für empfohlene Therapeut:innen
- Verhindert Duplikate

#### GET `/api/dossiers/:id`

Ruft ein Dossier ab (mit Zugriffskontrolle):

- Verifiziert Berechtigung (Admin, Client, oder empfohlener Therapeut)
- Prüft Ablaufdatum
- Entschlüsselt Daten
- Protokolliert Zugriff in DossierAccessLog

#### POST `/api/dossiers/:id/links`

Generiert neue signierte URLs:

- Nur für Admin oder Dossier-Besitzer
- Verifiziert Therapeut-Status (VERIFIED)
- Prüft Empfehlungsliste

### 5. Triage-Integration (`apps/web/app/api/triage/route.ts`)

- Neues Feld `consentDossierSharing` im Triage-Payload
- Automatische Erstellung von ClientConsent bei Zustimmung
- Keine automatische Dossier-Erstellung (muss explizit via POST /api/dossiers erfolgen)

## Verwendung

### 1. Environment-Variablen konfigurieren

```bash
# .env
DOSSIER_ENCRYPTION_KEY="<generiert via: openssl rand -hex 32>"
STORAGE_TYPE="local"  # oder "s3"
LOCAL_STORAGE_PATH="/tmp/dossiers"
```

### 2. Dossier erstellen

```typescript
// Nach Triage-Abschluss und Consent
const response = await fetch('/api/dossiers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    triageSessionId: '<triage-session-id>',
    recommendedTherapistIds: ['<therapist-id-1>', '<therapist-id-2>'],
    trigger: 'AUTO', // oder 'ADMIN', 'WORKER'
  }),
});

const { data } = await response.json();
// data.dossierId, data.signedUrls, data.expiresAt
```

### 3. Dossier abrufen

```typescript
// Als Therapeut oder Admin
const response = await fetch(`/api/dossiers/${dossierId}`);
const { data } = await response.json();

// data.payload enthält entschlüsselte Daten:
// - PHQ-9/GAD-7 Scores
// - Red Flags
// - Präferenzen
// - Verfügbarkeit
```

### 4. Neue signierte URL erstellen

```typescript
// Als Admin oder Client
const response = await fetch(`/api/dossiers/${dossierId}/links`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    therapistUserId: '<user-id>',
    expiresInHours: 72,
  }),
});

const { data } = await response.json();
// data.url, data.expiresAt
```

## Sicherheitshinweise

### Für Entwicklung

1. **Niemals** echte Produktionsdaten mit Dev-Keys verschlüsseln
2. Environment-Variablen NICHT in Git committen
3. Lokale Dossier-Dateien in `.gitignore` aufnehmen

### Für Production

1. **Starke Encryption Keys verwenden**: `openssl rand -hex 32`
2. **Schlüsselrotation implementieren**: `encryptionKeyId` unterstützt mehrere Keys
3. **S3 mit Server-Side Encryption konfigurieren**
4. **HTTPS erzwingen** für alle API-Requests
5. **Regelmäßige Security Audits** der Zugriffsprotokolle
6. **Ablauf-Cleanup**: Cronjob zum Löschen abgelaufener Dossiers

## Tests

Alle Tests befinden sich in `apps/web/tests/`:

- `unit/lib/encryption.test.ts`: Verschlüsselungs-Logik
- `unit/lib/storage.test.ts`: Signierte URLs und Token-Verifikation
- `integration/api/dossiers/create.test.ts`: Dossier-Erstellung

Tests ausführen:

```bash
npm run test
```

## Compliance & DSGVO

### Datenminimierung

- Nur notwendige Daten werden verschlüsselt
- Metadaten (z.B. riskLevel) bleiben unverschlüsselt für effiziente Queries

### Transparenz

- Jeder Zugriff wird in `DossierAccessLog` protokolliert
- Clients können ihre Zugriffsprotokolle einsehen

### Recht auf Löschung

- Dossiers haben Ablaufdatum (72h default)
- Consent kann widerrufen werden → Dossier wird gelöscht

### Datenübertragbarkeit

- JSON-Export des Dossiers verfügbar
- Entschlüsselte Daten können als strukturiertes JSON exportiert werden

## Zukünftige Verbesserungen

### MVP+ (nächste Phase)

- [ ] PDF-Generierung mit React-PDF
- [ ] E-Mail-Benachrichtigung an Therapeut:innen
- [ ] Dashboard für Therapeut:innen zum Anzeigen von Dossiers

### Scale

- [ ] AWS KMS Integration für Schlüsselverwaltung
- [ ] Automatischer Cleanup-Job für abgelaufene Dossiers
- [ ] Versionierung von Dossiers (bei Re-Assessment)
- [ ] Outcome-Feedback zurück ins System

## Support

Bei Fragen oder Problemen:

1. Dokumentation prüfen: `docs/features/session-zero-dossier.md`
2. Tests als Beispiele verwenden
3. Issue im Repository erstellen
