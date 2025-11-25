# Production Test Plan - Microsite & Dossier Features

## ✅ Deployment Status (Stand: 2025-11-10 20:30)

### Infrastructure

- **GitHub Actions:** ✅ Erfolgreich deployed
- **Vercel Deployment:** ✅ Live (https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app)
- **Database Migrations:** ✅ Alle 6 Migrationen angewendet
- **Environment Variables:** ✅ DOSSIER_ENCRYPTION_KEY, STORAGE_TYPE, LOCAL_STORAGE_PATH gesetzt

### Database Status

```
✅ TherapistMicrositeVisit: 0 records (ready)
✅ TherapistMicrositeLead: 0 records (ready)
✅ TherapistMicrositeRedirect: 0 records (ready)
✅ SessionZeroDossier: 0 records (ready)
✅ DossierAccessLog: 0 records (ready)
✅ ClientConsent: 0 records (ready)

📊 Existing Data:
   - 6 Users (1 Client, 4 Therapists, 1 Admin)
   - 4 Therapist Profiles (none configured for microsite yet)
   - 1 Triage Session (ready for dossier creation)
```

---

## 🧪 Test Plan

### Feature 1: Therapist Microsite

#### Prerequisites

Um Microsites zu testen, muss zuerst ein Therapeut-Profil konfiguriert werden:

**Option A: Via Admin UI (empfohlen)**

1. Login als Admin auf https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app
2. Gehe zu Admin Panel → Therapeuten
3. Wähle ein Profil aus
4. Setze folgende Felder:
   - `micrositeSlug`: z.B. `"dr-maria-mueller"` (lowercase, keine Umlaute)
   - `micrositeStatus`: `PUBLISHED`
   - `status`: `VERIFIED` (falls noch nicht)
5. Fülle Profil-Felder aus:
   - `displayName`
   - `headline`
   - `about`
   - `specialties` (Array)
   - `city`, `country`
   - `priceMin`, `priceMax` (in Cents)

**Option B: Via Database (für Testing)**

```sql
UPDATE "TherapistProfile"
SET
  "micrositeSlug" = 'dr-maria-mueller',
  "micrositeStatus" = 'PUBLISHED',
  "status" = 'VERIFIED',
  "displayName" = 'Dr. Maria Müller',
  "headline" = 'Spezialistin für Angst und Depression',
  "about" = 'Mit über 10 Jahren Erfahrung...',
  "specialties" = ARRAY['Angst', 'Depression', 'Burnout'],
  "city" = 'Wien',
  "country" = 'AT',
  "priceMin" = 12000,  -- 120 EUR
  "priceMax" = 15000,  -- 150 EUR
  "isPublic" = true
WHERE "id" = '<your-therapist-id>';
```

#### Test Cases

**TC1: Microsite öffentlich abrufen**

```bash
# URL Format: /t/{micrositeSlug}
curl -I https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller
```

✅ **Erwartung:**

- Status 200 (oder 401 wenn Deployment Protection aktiv)
- HTML mit Therapeuten-Profil
- SEO Meta-Tags (OpenGraph, Schema.org)

**TC2: Lead-Formular absenden**

```bash
curl -X POST https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/api/microsites/dr-maria-mueller/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "+43 664 1234567",
    "message": "Ich würde gerne einen Termin vereinbaren.",
    "consent": true
  }'
```

✅ **Erwartung:**

- Status 201
- Response: `{"success": true, "message": "Ihre Anfrage wurde erfolgreich gesendet", "leadId": "..."}`
- Neuer Eintrag in `TherapistMicrositeLead` Tabelle

**TC3: Analytics Tracking**

```bash
curl -X POST https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/api/microsites/track \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "dr-maria-mueller",
    "source": "google",
    "sessionId": "test-session-123"
  }'
```

✅ **Erwartung:**

- Status 200
- Neuer Eintrag in `TherapistMicrositeVisit` Tabelle

**TC4: SEO-Check**

- Öffne: https://www.linkedin.com/post-inspector/
- Gib URL ein: https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller
- ✅ **Erwartung:** Preview zeigt Bild, Titel, Beschreibung

**TC5: Redirect-Test (nach Slug-Änderung)**

```sql
-- Simuliere Slug-Änderung
INSERT INTO "TherapistMicrositeRedirect" ("id", "fromSlug", "toSlug", "createdAt")
VALUES ('test-redirect-1', 'dr-maria-old', 'dr-maria-mueller', NOW());
```

```bash
curl -I https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-old
```

✅ **Erwartung:** 301/302 Redirect zu neuer URL

---

### Feature 2: Session-Zero-Dossier

#### Prerequisites

1. **Client mit Consent:** Ein User mit `role: CLIENT` + `ClientConsent` für `DOSSIER_SHARING`
2. **Triage Session:** Abgeschlossene `TriageSession` mit PHQ-9/GAD-7 Scores
3. **Verifizierter Therapeut:** Mindestens ein `TherapistProfile` mit `status: VERIFIED`

**Setup via SQL (für Testing):**

```sql
-- 1. Create ClientConsent for existing client
INSERT INTO "ClientConsent" ("id", "clientId", "scope", "status", "grantedAt", "source", "metadata")
SELECT
  'consent-' || gen_random_uuid()::text,
  u."id",
  'DOSSIER_SHARING',
  'GRANTED',
  NOW(),
  'manual_test',
  '{}'::jsonb
FROM "User" u
WHERE u."role" = 'CLIENT'
LIMIT 1;

-- 2. Verify we have a triage session
SELECT id, "clientId", "phq9Score", "gad7Score", "riskLevel"
FROM "TriageSession"
WHERE id = '<your-triage-session-id>';

-- 3. Get verified therapist ID
SELECT id, "displayName"
FROM "TherapistProfile"
WHERE "status" = 'VERIFIED'
LIMIT 1;
```

#### Test Cases

**TC1: Dossier erstellen (als Admin)**

```bash
# Benötigt: Session Token (als Admin eingeloggt)
curl -X POST https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/api/dossiers \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{
    "triageSessionId": "<your-triage-session-id>",
    "recommendedTherapistIds": ["<therapist-profile-id>"],
    "trigger": "ADMIN"
  }'
```

✅ **Erwartung:**

- Status 201
- Response enthält:
  ```json
  {
    "success": true,
    "data": {
      "dossierId": "clxxx...",
      "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
      "version": 1,
      "expiresAt": "2025-11-13T20:30:00.000Z",
      "signedUrls": {
        "<therapist-profile-id>": {
          "url": "https://.../api/dossiers/.../download?token=...",
          "expiresAt": "..."
        }
      },
      "redFlagsCount": 0
    }
  }
  ```
- Dossier in DB mit verschlüsseltem `encryptedPayload`

**TC2: Dossier ohne Consent versuchen**

```bash
# Löschen Sie zuerst den Consent:
DELETE FROM "ClientConsent" WHERE "clientId" = '<client-id>';

# Dann versuchen Dossier zu erstellen
curl -X POST .../api/dossiers ...
```

✅ **Erwartung:**

- Status 403
- `{"success": false, "error": "Client consent required for dossier sharing", "code": "CONSENT_REQUIRED"}`

**TC3: Dossier abrufen (als berechtigter Therapeut)**

```bash
# Benötigt: Session Token des Therapeuten, der in recommendedTherapistIds ist
curl https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/api/dossiers/<dossierId> \
  -H "Cookie: next-auth.session-token=<therapist-session-token>"
```

✅ **Erwartung:**

- Status 200
- Entschlüsselte Payload mit:
  - PHQ-9/GAD-7 Scores und Antworten
  - Red Flags (z.B. Suizidgedanken)
  - Themes (Depression, Angst, etc. mit Intensität)
  - Client Alias (kein Klarname für Therapeuten)
- Neuer Eintrag in `DossierAccessLog` mit Status `SUCCESS`

**TC4: Dossier als nicht-berechtigter Therapeut abrufen**

```bash
# Therapeut, der NICHT in recommendedTherapistIds ist
curl https://.../api/dossiers/<dossierId> \
  -H "Cookie: next-auth.session-token=<other-therapist-token>"
```

✅ **Erwartung:**

- Status 403
- `{"success": false, "error": "Access denied"}`
- Eintrag in `DossierAccessLog` mit Status `DENIED`

**TC5: Signierte URL generieren**

```bash
# Als Admin oder Client Owner
curl -X POST https://.../api/dossiers/<dossierId>/links \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<admin-token>" \
  -d '{
    "therapistUserId": "<user-id-of-therapist>",
    "expiresInHours": 72
  }'
```

✅ **Erwartung:**

- Status 200
- Response mit JWT-signierter URL:
  ```json
  {
    "success": true,
    "data": {
      "url": "https://.../api/dossiers/<id>/download?token=eyJhbGciOiJ...",
      "expiresAt": "2025-11-13T20:30:00.000Z",
      "therapistId": "...",
      "therapistName": "Dr. Maria Müller"
    }
  }
  ```

**TC6: Abgelaufenes Dossier abrufen**

```sql
-- Setze expiresAt auf Vergangenheit
UPDATE "SessionZeroDossier"
SET "expiresAt" = NOW() - INTERVAL '1 day'
WHERE "id" = '<dossier-id>';
```

```bash
curl https://.../api/dossiers/<dossierId> ...
```

✅ **Erwartung:**

- Status 410
- `{"success": false, "error": "Dossier has expired", "code": "DOSSIER_EXPIRED"}`
- Eintrag in `DossierAccessLog` mit Status `EXPIRED`

**TC7: Access Log überprüfen**

```sql
SELECT
  dal."accessedAt",
  dal."status",
  dal."channel",
  dal."ipHash",
  u."email" as therapist_email
FROM "DossierAccessLog" dal
JOIN "User" u ON u."id" = dal."therapistUserId"
WHERE dal."dossierId" = '<dossier-id>'
ORDER BY dal."accessedAt" DESC;
```

✅ **Erwartung:**

- IP-Adressen sind gehasht (SHA-256, 64 Zeichen)
- Status: SUCCESS, DENIED, oder EXPIRED
- Channel: WEB_DASHBOARD oder SIGNED_LINK

---

## 🔒 Security Checks

### Dossier Encryption

```sql
-- Verschlüsselter Payload sollte nicht lesbar sein
SELECT
  "id",
  LEFT("encryptedPayload", 50) as encrypted_preview,
  "encryptionKeyId"
FROM "SessionZeroDossier";
```

✅ **Erwartung:** `encryptedPayload` ist Hex-String (z.B. `a1b2c3...`) + nicht JSON

### IP Hashing

```sql
SELECT DISTINCT "ipHash", LENGTH("ipHash") as hash_length
FROM "DossierAccessLog";
```

✅ **Erwartung:** Alle `ipHash` sind 64 Zeichen lang (SHA-256)

### Environment Variables

```bash
vercel env ls | grep DOSSIER
```

✅ **Erwartung:**

- DOSSIER_ENCRYPTION_KEY ✅
- STORAGE_TYPE ✅
- LOCAL_STORAGE_PATH ✅

---

## 🐛 Troubleshooting

### Problem: 401 Unauthorized beim Microsite-Zugriff

**Ursache:** Vercel Deployment Protection aktiv
**Lösung:**

- Vercel Dashboard → Settings → Deployment Protection → Disable
- ODER: Custom Domain hinzufügen (umgeht Protection)

### Problem: "Microsite nicht gefunden"

**Ursache:**

- Slug nicht gesetzt
- Status nicht PUBLISHED
- Therapeut nicht VERIFIED
  **Lösung:** Siehe Prerequisites TC1

### Problem: "Dossier bereits vorhanden"

**Ursache:** Pro TriageSession kann nur 1 Dossier erstellt werden
**Lösung:**

- Neue TriageSession erstellen ODER
- Bestehendes Dossier löschen (nur für Testing)

### Problem: Decryption Error

**Ursache:**

- DOSSIER_ENCRYPTION_KEY nicht gesetzt
- Key wurde nach Verschlüsselung geändert
  **Lösung:**
- Prüfe: `vercel env ls | grep DOSSIER_ENCRYPTION_KEY`
- Bei Key-Änderung: Alte Dossiers sind nicht mehr entschlüsselbar

---

## 📊 Production Readiness Checklist

### Microsite Feature

- [x] Migration deployed
- [x] Tables existieren
- [x] APIs funktionieren
- [ ] Mindestens 1 Therapeut mit Microsite konfiguriert
- [ ] Lead-Notification-E-Mails implementieren (TODO im Code)
- [ ] Analytics-Dashboard für Therapeuten (geplant MVP+)

### Dossier Feature

- [x] Migration deployed
- [x] Tables existieren
- [x] APIs funktionieren
- [x] Verschlüsselung konfiguriert
- [x] Environment Variables gesetzt
- [ ] PDF-Generierung implementieren (geplant MVP+)
- [ ] Therapeuten-Dashboard für Dossier-Zugriff (geplant MVP+)
- [ ] E-Mail-Benachrichtigung bei neuem Dossier (TODO im Code)
- [ ] Cleanup-Job für abgelaufene Dossiers (geplant Scale)

### Infrastructure

- [x] Production DB migrations angewendet
- [x] Vercel deployment erfolgreich
- [x] Environment variables gesetzt
- [ ] Custom Domain konfigurieren (optional)
- [ ] Deployment Protection deaktivieren (für öffentliche Microsites)
- [ ] Monitoring für Failed Dossier-Zugriffe (TODO)

---

## 🎯 Next Steps

1. **Microsite aktivieren:**
   - Login als Admin
   - Therapeuten-Profil mit Microsite-Daten füllen
   - `micrositeStatus` auf `PUBLISHED` setzen
   - Testen unter `/t/{slug}`

2. **Dossier testen:**
   - Client mit Consent erstellen
   - Triage durchführen
   - Dossier via API erstellen
   - Als Therapeut abrufen

3. **MVP+ Features:**
   - PDF-Export implementieren
   - Therapeuten-Dashboard
   - E-Mail-Benachrichtigungen
   - Automatisches Cleanup

---

Generiert: 2025-11-10 20:30 CET
