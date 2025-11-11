# E2E Testing Guide - Microsite & Dossier Features

**Stand:** 2025-11-10
**Production URL:** https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app

---

## 🚀 Voraussetzungen

### 1. Vercel Deployment Protection deaktivieren (optional)

**Warum?** Damit du Microsites öffentlich testen kannst ohne Login.

**Schritte:**
1. Gehe zu https://vercel.com/philipps-projects-0f51423d/findmytherapy-qyva
2. Settings → Deployment Protection
3. Wähle "Only Preview Deployments" oder "Disabled"
4. Speichern

**Alternative:** Mit Passwort testen (wird bei jedem Aufruf abgefragt)

### 2. Test-Accounts vorbereiten

Du brauchst Zugriff auf:
- ✅ **Admin Account** (für Profil-Konfiguration & Dossier-Erstellung)
- ✅ **Therapeut Account** (für Dossier-Zugriff)
- ✅ **Client Account** (für Triage & Consent)

**Accounts checken:**
```bash
# Zeige alle vorhandenen Users
DATABASE_URL="<production-db-url>" node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, firstName: true }
  });
  console.table(users);
  await prisma.\$disconnect();
})();
"
```

---

## 🎭 Feature 1: Therapist Microsite (E2E)

### Setup: Therapeuten-Profil mit Microsite konfigurieren

#### Option A: Via Admin UI (empfohlen, wenn UI vorhanden)

1. **Login als Admin**
   - Öffne: https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/login
   - Email: `<dein-admin-email>`
   - Passwort: `<dein-passwort>`

2. **Zum Admin-Panel navigieren**
   - URL: `/admin` oder `/admin/therapists`
   - Falls keine UI: Siehe Option B (Database)

3. **Therapeuten-Profil bearbeiten**
   - Wähle einen Therapeuten aus der Liste
   - Fülle folgende Pflichtfelder:
     - **Display Name:** z.B. "Dr. Maria Müller"
     - **Headline:** z.B. "Spezialistin für Angst und Depression"
     - **About:** Längere Bio (min. 50 Zeichen)
     - **Specialties:** ["Angst", "Depression", "Burnout"]
     - **City:** "Wien"
     - **Country:** "AT"
     - **Price Range:** Min: 120 EUR, Max: 150 EUR (in Cents: 12000, 15000)

4. **Microsite aktivieren**
   - **Microsite Slug:** `dr-maria-mueller` (lowercase, keine Umlaute, keine Leerzeichen)
   - **Microsite Status:** `PUBLISHED`
   - **Status:** `VERIFIED`
   - **Is Public:** ✓ (Checkbox ankreuzen)

5. **Speichern**

#### Option B: Via Database (schneller für Testing)

```sql
-- 1. Zeige verfügbare Therapeuten-Profile
SELECT id, "userId", "displayName", status, "micrositeSlug"
FROM "TherapistProfile";

-- 2. Wähle ein Profil und konfiguriere es
UPDATE "TherapistProfile"
SET
  -- Microsite Settings
  "micrositeSlug" = 'dr-maria-mueller',
  "micrositeStatus" = 'PUBLISHED',

  -- Basic Info (wenn noch nicht gefüllt)
  "displayName" = 'Dr. Maria Müller',
  "title" = 'Klinische Psychologin',
  "headline" = 'Spezialistin für Angst, Depression und Burnout',
  "about" = 'Mit über 10 Jahren Erfahrung in der klinischen Praxis unterstütze ich Menschen dabei, ihre mentale Gesundheit zu verbessern. Mein Schwerpunkt liegt auf evidenzbasierten Therapiemethoden wie kognitiver Verhaltenstherapie.',

  -- Contact & Location
  "city" = 'Wien',
  "country" = 'AT',
  "online" = true,
  "languages" = ARRAY['Deutsch', 'Englisch'],

  -- Pricing (in Cents!)
  "priceMin" = 12000,  -- 120 EUR
  "priceMax" = 15000,  -- 150 EUR
  "pricingNote" = 'Wahltherapeut - teilweise Rückerstattung durch Krankenkasse möglich',

  -- Specializations
  "specialties" = ARRAY['Angst', 'Depression', 'Burnout', 'Trauma'],
  "modalities" = ARRAY['Verhaltenstherapie', 'Achtsamkeit', 'EMDR'],
  "services" = ARRAY['Einzeltherapie', 'Paartherapie', 'Online-Sitzungen'],

  -- Availability
  "acceptingClients" = true,
  "availabilityNote" = 'Termine verfügbar: Dienstag & Donnerstag Abend, Samstag Vormittag',

  -- Verification
  "status" = 'VERIFIED',
  "isPublic" = true,

  -- Timestamps
  "micrositeLastPublishedAt" = NOW()

WHERE "id" = '<your-therapist-profile-id>';  -- Ersetze mit echter ID

-- 3. Verifiziere die Änderungen
SELECT "displayName", "micrositeSlug", "micrositeStatus", status
FROM "TherapistProfile"
WHERE "micrositeSlug" = 'dr-maria-mueller';
```

**Script ausführen:**
```bash
cd /Users/philippoppel/Desktop/mental-health-platform/packages/db

# SQL-Befehle in Datei speichern
cat > /tmp/setup-microsite.sql <<'EOF'
-- Deine SQL-Befehle hier einfügen
EOF

# Ausführen
DATABASE_URL="postgres://dc3d983a2d5564eed3157b72340a507086a37eac899b8c9f4f4e006e19fb18e0:sk_wmb50uHxFD_cBgqGPcckT@db.prisma.io:5432/postgres?sslmode=require" \
npx prisma db execute --file /tmp/setup-microsite.sql --schema prisma/schema.prisma
```

---

### E2E Test: Microsite aufrufen & interagieren

#### Test 1: Öffentlichen Zugriff auf Microsite testen

1. **Öffne die Microsite-URL**
   ```
   https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller
   ```

2. **Was du sehen solltest:**
   - ✅ **Hero Section:**
     - Profilbild (wenn hochgeladen)
     - Name: "Dr. Maria Müller"
     - Titel: "Klinische Psychologin"
     - Standort: "Wien, AT"
     - "Verified" Badge

   - ✅ **About Section:**
     - Bio-Text
     - "Über mich" Überschrift

   - ✅ **Expertise Section:**
     - Chips mit Spezialisierungen: "Angst", "Depression", "Burnout", "Trauma"

   - ✅ **Services Section:**
     - Liste: "Einzeltherapie", "Paartherapie", "Online-Sitzungen"
     - Modalitäten: "Verhaltenstherapie", "Achtsamkeit", "EMDR"

   - ✅ **Pricing Section (Sidebar):**
     - Preisspanne: "120 € - 150 €"
     - Note: "Wahltherapeut..."
     - Sprachen: "Deutsch, Englisch"
     - Verfügbarkeit: "Dienstag & Donnerstag..."

   - ✅ **Contact Form (Sidebar):**
     - Felder: Name, E-Mail, Telefon (optional), Nachricht
     - Consent Checkbox
     - "Anfrage senden" Button

3. **SEO-Check (optional):**
   - Rechtsklick → "Seitenquelltext anzeigen"
   - Suche nach `<script type="application/ld+json">` → Schema.org JSON-LD sollte sichtbar sein
   - `<meta property="og:title">` → OpenGraph-Tags für Social Media

---

#### Test 2: Lead-Formular absenden

1. **Fülle das Kontaktformular aus:**
   - **Name:** Max Mustermann
   - **E-Mail:** max.mustermann@example.com
   - **Telefon:** +43 664 1234567 (optional)
   - **Nachricht:** "Ich würde gerne einen Termin für ein Erstgespräch vereinbaren. Verfügbar sind Dienstagabende."
   - **Consent:** ✓ Checkbox aktivieren

2. **Klicke auf "Anfrage senden"**

3. **Erwartetes Verhalten:**
   - ✅ Erfolgsmeldung erscheint: "Ihre Anfrage wurde erfolgreich gesendet"
   - ✅ Formular wird geleert oder Seite refresht
   - ❌ NICHT: Fehlermeldung oder Redirect zu 500-Seite

4. **Verifikation in Database:**
   ```sql
   SELECT
     l."name",
     l."email",
     l."message",
     l."consent",
     l."status",
     l."createdAt",
     tp."displayName" as therapist_name
   FROM "TherapistMicrositeLead" l
   JOIN "TherapistProfile" tp ON tp."id" = l."therapistProfileId"
   WHERE l."email" = 'max.mustermann@example.com'
   ORDER BY l."createdAt" DESC
   LIMIT 1;
   ```

   **Sollte zeigen:**
   - ✅ Name: "Max Mustermann"
   - ✅ Email: "max.mustermann@example.com"
   - ✅ Consent: true
   - ✅ Status: "NEW"
   - ✅ createdAt: aktueller Timestamp

---

#### Test 3: Analytics Tracking (im Hintergrund)

**Automatisch beim Seitenaufruf:**
- Die `<MicrositeAnalytics>` Komponente sollte beim Laden einen Track-Event senden
- Client-seitig: Netzwerk-Tab in Browser DevTools öffnen → POST zu `/api/microsites/track`

**Verifikation:**
```sql
SELECT
  v."occurredAt",
  v."source",
  v."sessionId",
  tp."displayName" as therapist_name
FROM "TherapistMicrositeVisit" v
JOIN "TherapistProfile" tp ON tp."id" = v."therapistProfileId"
WHERE tp."micrositeSlug" = 'dr-maria-mueller'
ORDER BY v."occurredAt" DESC
LIMIT 5;
```

**Sollte zeigen:**
- ✅ Neue Einträge bei jedem Seitenaufruf
- ✅ `occurredAt`: Zeitstempel des Besuchs
- ✅ `sessionId`: Eindeutige Session-ID

---

#### Test 4: Slug-Redirect (nach Slug-Änderung)

**Setup:**
1. Ändere den Slug zu einem neuen Wert:
   ```sql
   -- Erstelle Redirect für alte URL
   INSERT INTO "TherapistMicrositeRedirect" ("id", "fromSlug", "toSlug", "createdAt")
   VALUES ('test-redirect-' || gen_random_uuid()::text, 'dr-maria-mueller', 'dr-maria-mueller-neu', NOW());

   -- Update Profil mit neuem Slug
   UPDATE "TherapistProfile"
   SET "micrositeSlug" = 'dr-maria-mueller-neu'
   WHERE "micrositeSlug" = 'dr-maria-mueller';
   ```

2. **Öffne alte URL:**
   ```
   https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller
   ```

3. **Erwartetes Verhalten:**
   - ✅ Automatischer Redirect (302) zur neuen URL `/t/dr-maria-mueller-neu`
   - ✅ Browser-URL ändert sich
   - ✅ Seite wird korrekt geladen

---

#### Test 5: SEO & Social Media Preview

**LinkedIn Preview:**
1. Öffne: https://www.linkedin.com/post-inspector/
2. Gib URL ein: `https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller`
3. Klicke "Inspect"

**Erwartetes Ergebnis:**
- ✅ Titel: "Dr. Maria Müller - Klinische Psychologin | FindMyTherapy"
- ✅ Beschreibung: "Spezialistin für Angst, Depression und Burnout"
- ✅ Bild: Profilbild (wenn hochgeladen)

**Twitter/X Card Validator:**
1. Öffne: https://cards-dev.twitter.com/validator
2. Gleiche URL einfügen
3. Preview sollte ähnlich zu LinkedIn sein

---

### Troubleshooting Microsite

| Problem | Ursache | Lösung |
|---------|---------|--------|
| **404 Not Found** | Slug nicht vorhanden oder falsch geschrieben | Prüfe `micrositeSlug` in DB |
| **Seite leer / keine Daten** | Profil nicht gefüllt | Fülle `displayName`, `about`, `specialties` |
| **"Not Published"** | Status nicht PUBLISHED | Setze `micrositeStatus = 'PUBLISHED'` |
| **401 Unauthorized** | Deployment Protection aktiv | Deaktiviere in Vercel Settings |
| **Formular sendet nicht** | CORS oder API-Fehler | Check Browser Console + Netzwerk-Tab |

---

## 🔐 Feature 2: Session-Zero-Dossier (E2E)

### Setup: Test-Daten vorbereiten

#### 1. Client mit Triage Session & Consent

**Prüfe vorhandene Daten:**
```sql
-- Zeige Clients mit Triage Sessions
SELECT
  u.id as user_id,
  u.email,
  u."firstName",
  ts.id as triage_id,
  ts."phq9Score",
  ts."gad7Score",
  ts."riskLevel",
  ts."requiresEmergency"
FROM "User" u
LEFT JOIN "TriageSession" ts ON ts."clientId" = u.id
WHERE u.role = 'CLIENT'
ORDER BY ts."createdAt" DESC;
```

**Falls keine Triage vorhanden, erstelle eine:**
```sql
-- Erstelle Test-Triage für bestehenden Client
INSERT INTO "TriageSession" (
  "id",
  "clientId",
  "phq9Answers",
  "phq9Score",
  "phq9Severity",
  "gad7Answers",
  "gad7Score",
  "gad7Severity",
  "supportPreferences",
  "availability",
  "riskLevel",
  "recommendedNextStep",
  "requiresEmergency",
  "emergencyTriggered",
  "createdAt"
)
SELECT
  'triage-test-' || gen_random_uuid()::text,
  u.id,  -- clientId
  ARRAY[1,1,1,1,1,1,1,1,0],  -- PHQ-9 Antworten (0-3 je Item)
  8,     -- PHQ-9 Score (Summe = leichte Depression)
  'mild',
  ARRAY[1,1,1,1,1,1,0],  -- GAD-7 Antworten
  6,     -- GAD-7 Score (leichte Angst)
  'mild',
  ARRAY['therapist', 'course'],  -- Support-Präferenzen
  ARRAY['online', 'mornings'],   -- Verfügbarkeit
  'MEDIUM',  -- Risk Level
  'THERAPIST',
  false,  -- Kein Notfall
  false,
  NOW()
FROM "User" u
WHERE u.role = 'CLIENT'
LIMIT 1;
```

#### 2. Client Consent erstellen

```sql
-- Consent für Dossier-Sharing
INSERT INTO "ClientConsent" (
  "id",
  "clientId",
  "scope",
  "status",
  "grantedAt",
  "source",
  "metadata"
)
SELECT
  'consent-' || gen_random_uuid()::text,
  u.id,
  'DOSSIER_SHARING',
  'GRANTED',
  NOW(),
  'e2e_test',
  '{}'::jsonb
FROM "User" u
WHERE u.role = 'CLIENT'
LIMIT 1
ON CONFLICT DO NOTHING;  -- Falls bereits vorhanden
```

#### 3. Verifizierte Therapeuten checken

```sql
-- Zeige verfügbare Therapeuten für Dossier-Empfehlung
SELECT
  tp.id as profile_id,
  u.id as user_id,
  u.email,
  tp."displayName",
  tp.status
FROM "TherapistProfile" tp
JOIN "User" u ON u.id = tp."userId"
WHERE tp.status = 'VERIFIED'
ORDER BY tp."createdAt" DESC;
```

**Wichtig:** Notiere dir:
- ✅ `user_id` des Clients (für Login)
- ✅ `triage_id` der Triage Session
- ✅ `profile_id` des Therapeuten (für recommendedTherapistIds)
- ✅ `user_id` des Therapeuten (für Login als Therapeut)

---

### E2E Test: Dossier erstellen & einsehen

#### Test 1: Dossier über Admin-UI oder API erstellen

**Option A: Wenn Admin-UI vorhanden**

1. **Login als Admin**
   - URL: https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/login
   - Email: `<admin-email>`

2. **Navigate zu Triage-Übersicht**
   - URL: `/admin/triage` oder `/admin/clients`

3. **Wähle Triage-Session aus**
   - Finde die Session mit ID `<deine-triage-id>`
   - Klicke "Dossier erstellen" oder ähnlichen Button

4. **Wähle empfohlene Therapeuten**
   - Checkbox bei Therapeuten setzen (mind. 1)
   - Klicke "Erstellen"

5. **Erwartetes Ergebnis:**
   - ✅ Erfolgsmeldung: "Dossier erfolgreich erstellt"
   - ✅ Download-Link oder "Dossier ansehen" Button
   - ✅ Anzeige von Risk Level + Red Flags

**Option B: Via Browser DevTools + API**

1. **Login als Admin**
   - Öffne https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/login
   - Logge dich ein

2. **Öffne Browser DevTools**
   - F12 oder Rechtsklick → "Untersuchen"
   - Tab "Console"

3. **Führe API-Call aus:**
   ```javascript
   // Dossier erstellen
   fetch('/api/dossiers', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       triageSessionId: '<deine-triage-id>',  // Ersetzen!
       recommendedTherapistIds: ['<therapist-profile-id>'],  // Ersetzen!
       trigger: 'ADMIN'
     })
   })
   .then(r => r.json())
   .then(data => {
     console.log('✅ Dossier erstellt:', data);
     window.dossierId = data.data.dossierId;
     console.log('Dossier ID:', window.dossierId);
   })
   .catch(err => console.error('❌ Fehler:', err));
   ```

4. **Erwartete Console-Ausgabe:**
   ```json
   {
     "success": true,
     "data": {
       "dossierId": "clxxx...",
       "triageSessionId": "...",
       "riskLevel": "MEDIUM",
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

5. **Notiere die `dossierId`** für weitere Tests!

---

#### Test 2: Dossier als berechtigter Therapeut einsehen

1. **Logout & Login als Therapeut**
   - Logout von Admin-Account
   - Login mit Therapeuten-Credentials (User der in `recommendedTherapistIds` war)

2. **Option A: Via UI (wenn vorhanden)**
   - Navigate zu `/dashboard/therapist` oder `/dashboard/dossiers`
   - Sollte Liste mit zugewiesenen Dossiers zeigen
   - Klicke auf Dossier um Details zu sehen

3. **Option B: Via Browser Console + API**
   ```javascript
   // Dossier abrufen
   fetch('/api/dossiers/<dossierId>')  // Ersetze <dossierId>
     .then(r => r.json())
     .then(data => {
       console.log('✅ Dossier-Daten:', data);

       // Zeige wichtige Infos
       const p = data.data.payload;
       console.log('📊 Scores:', {
         PHQ9: p.phq9Score + '/27 (' + p.phq9Severity + ')',
         GAD7: p.gad7Score + '/21 (' + p.gad7Severity + ')',
         Risk: p.riskLevel
       });
       console.log('🚩 Red Flags:', p.redFlags);
       console.log('🎯 Themes:', p.themes);
       console.log('👤 Client:', p.clientAlias);
     })
     .catch(err => console.error('❌ Fehler:', err));
   ```

4. **Erwartete Console-Ausgabe:**
   ```javascript
   {
     "success": true,
     "data": {
       "id": "clxxx...",
       "riskLevel": "MEDIUM",
       "redFlags": [],  // oder Array mit Red Flags
       "payload": {
         "clientAlias": "Klient:in",  // NICHT der echte Name!
         "phq9Score": 8,
         "phq9Severity": "mild",
         "phq9Answers": [1,1,1,1,1,1,1,1,0],
         "gad7Score": 6,
         "gad7Severity": "mild",
         "gad7Answers": [1,1,1,1,1,1,0],
         "riskLevel": "MEDIUM",
         "requiresEmergency": false,
         "hasSuicidalIdeation": false,
         "phq9Item9Score": 0,
         "redFlags": [],
         "supportPreferences": ["therapist", "course"],
         "availability": ["online", "mornings"],
         "themes": [
           { "name": "Depression", "intensity": 30, "notes": "PHQ-9 Schweregrad: mild" },
           { "name": "Angst", "intensity": 29, "notes": "GAD-7 Schweregrad: mild" }
         ],
         "createdAt": "2025-11-10T..."
       }
     }
   }
   ```

5. **Wichtig:**
   - ✅ Als Therapeut siehst du **clientAlias**, NICHT den echten Namen
   - ✅ Admin/Client sehen den echten Namen

---

#### Test 3: Zugriff OHNE Berechtigung (sollte fehlschlagen)

1. **Logout & Login als anderer Therapeut**
   - Therapeut der NICHT in `recommendedTherapistIds` war

2. **Versuche Dossier abzurufen:**
   ```javascript
   fetch('/api/dossiers/<dossierId>')
     .then(r => r.json())
     .then(data => console.log('Response:', data))
   ```

3. **Erwartetes Ergebnis:**
   ```json
   {
     "success": false,
     "error": "Access denied"
   }
   ```
   - ✅ Status: 403 Forbidden
   - ✅ Kein Zugriff auf entschlüsselte Daten

4. **Verifikation in Database:**
   ```sql
   -- Letzter Access Log sollte DENIED sein
   SELECT
     dal."accessedAt",
     dal."status",
     dal."reason",
     u."email" as therapist_email
   FROM "DossierAccessLog" dal
   JOIN "User" u ON u.id = dal."therapistUserId"
   WHERE dal."dossierId" = '<dossier-id>'
   ORDER BY dal."accessedAt" DESC
   LIMIT 1;
   ```

   **Sollte zeigen:**
   - ✅ Status: "DENIED"
   - ✅ Reason: "User not authorized to access this dossier"

---

#### Test 4: Signierte URL generieren & nutzen

1. **Als Admin eingeloggt:**
   ```javascript
   // Neue signierte URL für Therapeut generieren
   fetch('/api/dossiers/<dossierId>/links', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       therapistUserId: '<user-id-of-therapist>',  // Ersetzen!
       expiresInHours: 72
     })
   })
   .then(r => r.json())
   .then(data => {
     console.log('✅ Signierte URL:', data.data.url);
     // Kopiere die URL
   });
   ```

2. **Öffne die signierte URL in neuem Inkognito-Tab**
   - URL Format: `https://.../api/dossiers/<id>/download?token=eyJhbGciOiJ...`

3. **Erwartetes Verhalten:**
   - ✅ Automatischer Download ODER
   - ✅ JSON-Antwort mit Dossier-Daten (je nach Implementation)
   - ❌ NICHT: 403 oder 401 Error

4. **Nach 72 Stunden:**
   - Link sollte abgelaufen sein → 410 Gone Error

---

#### Test 5: Abgelaufenes Dossier testen

1. **Setze Ablaufdatum in Vergangenheit:**
   ```sql
   UPDATE "SessionZeroDossier"
   SET "expiresAt" = NOW() - INTERVAL '1 day'
   WHERE "id" = '<dossier-id>';
   ```

2. **Versuche Zugriff:**
   ```javascript
   fetch('/api/dossiers/<dossierId>')
     .then(r => r.json())
     .then(data => console.log('Response:', data));
   ```

3. **Erwartetes Ergebnis:**
   ```json
   {
     "success": false,
     "error": "Dossier has expired",
     "code": "DOSSIER_EXPIRED",
     "expiresAt": "2025-11-09T..."
   }
   ```
   - ✅ Status: 410 Gone
   - ✅ Access Log mit Status: "EXPIRED"

---

#### Test 6: Access Logging überprüfen

**Alle Zugriffe sollten geloggt sein:**

```sql
SELECT
  dal."accessedAt",
  dal."status",
  dal."channel",
  LENGTH(dal."ipHash") as ip_hash_length,
  dal."userAgent",
  u."email" as therapist_email,
  u."role"
FROM "DossierAccessLog" dal
JOIN "User" u ON u.id = dal."therapistUserId"
WHERE dal."dossierId" = '<dossier-id>'
ORDER BY dal."accessedAt" DESC;
```

**Sollte zeigen:**
- ✅ Alle Zugriffe (SUCCESS, DENIED, EXPIRED)
- ✅ IP-Hash ist 64 Zeichen lang (SHA-256)
- ✅ Channel: WEB_DASHBOARD oder SIGNED_LINK
- ✅ Korrekte Therapeuten-User-IDs

---

### Troubleshooting Dossier

| Problem | Ursache | Lösung |
|---------|---------|--------|
| **"Consent required"** | ClientConsent fehlt oder REVOKED | Erstelle Consent mit Scope DOSSIER_SHARING |
| **"Triage session not found"** | Falsche ID oder Session existiert nicht | Prüfe TriageSession Tabelle |
| **"Dossier bereits vorhanden"** | Pro Triage nur 1 Dossier erlaubt | Neuen Triage erstellen ODER altes Dossier löschen |
| **"Decryption failed"** | DOSSIER_ENCRYPTION_KEY fehlt/falsch | Prüfe Vercel Env Vars |
| **403 bei Zugriff** | User nicht in recommendedTherapistIds | Prüfe Therapeut-ID in Dossier |
| **Network Error bei API** | NextAuth Session abgelaufen | Logout/Login neu durchführen |

---

## 📊 Kompletter E2E Flow (alle Features zusammen)

### Szenario: Neuer Client → Triage → Dossier → Therapeut kontaktieren

1. **Als neuer Client registrieren**
   - `/register` → Registrierung mit Email/Passwort
   - Role: CLIENT (automatisch)

2. **Triage durchführen**
   - `/triage` → PHQ-9 & GAD-7 Fragebogen ausfüllen
   - Consent für Dossier-Sharing: ✓ Checkbox aktivieren
   - Absenden

3. **System generiert Empfehlungen**
   - Basierend auf Scores werden Therapeuten empfohlen
   - RecommendationSnapshot wird erstellt

4. **Admin erstellt Dossier** (automatisch oder manuell)
   - Triage wird analysiert
   - Dossier mit Verschlüsselung erstellt
   - Empfohlene Therapeuten erhalten Zugriff

5. **Therapeut erhält Benachrichtigung** (zukünftig via Email)
   - "Neues Dossier verfügbar"
   - Link zum Dashboard

6. **Therapeut sieht Dossier**
   - Login → `/dashboard/therapist/dossiers`
   - Öffnet Dossier
   - Sieht Scores, Red Flags, Präferenzen
   - Entscheidet: "Ich kann helfen"

7. **Client sieht Therapeuten-Empfehlung**
   - Dashboard zeigt empfohlene Therapeuten
   - Klick auf Profil → Microsite öffnet sich
   - `/t/<slug>` zeigt vollständiges Profil

8. **Client kontaktiert Therapeut via Microsite**
   - Kontaktformular ausfüllen
   - Lead wird erstellt
   - Therapeut erhält Anfrage (zukünftig via Email)

9. **Therapeut antwortet**
   - Sieht Lead im Dashboard (zukünftig)
   - Vereinbart Erstgespräch

**🎉 Ende-zu-Ende: Client findet passenden Therapeuten!**

---

## 🔧 Nützliche Development-Tools

### Browser DevTools

**Console Shortcuts:**
```javascript
// Schnell-Check: Bin ich eingeloggt?
fetch('/api/auth/session').then(r => r.json()).then(console.log);

// Alle Dossiers auflisten
fetch('/api/dossiers').then(r => r.json()).then(console.log);

// Therapeuten-Profil abrufen
fetch('/api/microsites/dr-maria-mueller/route').then(r => r.json()).then(console.log);
```

### Network Tab monitoring

**Wichtige Requests:**
- `POST /api/dossiers` → Dossier-Erstellung
- `GET /api/dossiers/:id` → Dossier-Abruf
- `POST /api/microsites/:slug/leads` → Lead-Submission
- `POST /api/microsites/track` → Analytics-Tracking

**Was du sehen solltest:**
- ✅ Status 200/201 bei Erfolg
- ✅ Keine CORS-Fehler
- ✅ Response enthält expected data structure

---

## ✅ Testing Checklist

### Microsite Feature
- [ ] Therapeuten-Profil mit Microsite konfiguriert
- [ ] Microsite öffnet sich unter `/t/<slug>`
- [ ] Alle Sections werden angezeigt (Hero, About, Expertise, etc.)
- [ ] Kontaktformular funktioniert (Lead wird erstellt)
- [ ] Analytics-Tracking funktioniert (Visit wird geloggt)
- [ ] SEO Meta-Tags sind vorhanden
- [ ] Social Media Preview funktioniert (LinkedIn/Twitter)
- [ ] Slug-Redirect funktioniert (falls konfiguriert)

### Dossier Feature
- [ ] ClientConsent kann erstellt werden
- [ ] Dossier kann über API erstellt werden
- [ ] Verschlüsselung funktioniert (encryptedPayload nicht lesbar)
- [ ] Berechtigter Therapeut kann Dossier abrufen
- [ ] Nicht-berechtigter Therapeut wird blockiert (403)
- [ ] Access-Logging funktioniert (SUCCESS/DENIED/EXPIRED)
- [ ] IP-Adressen werden gehasht (SHA-256)
- [ ] Signierte URLs können generiert werden
- [ ] Abgelaufene Dossiers werden blockiert (410)
- [ ] Admin sieht echten Client-Namen, Therapeut nur Alias

### Integration
- [ ] Triage → Dossier → Therapeut-Empfehlung Flow funktioniert
- [ ] Client kann Therapeuten-Microsite aus Empfehlung öffnen
- [ ] Lead von Microsite wird Therapeut zugeordnet
- [ ] Alle Daten sind DSGVO-konform (Hashing, Consent, Logging)

---

## 📸 Was du dokumentieren solltest (Screenshots)

Für Bug-Reports oder Feature-Demos:
1. ✅ Microsite Hero Section
2. ✅ Kontaktformular mit Erfolgsmeldung
3. ✅ Dossier-Erstellung (Response in Console)
4. ✅ Dossier-Anzeige als Therapeut
5. ✅ Access-Denied Fehlermeldung (403)
6. ✅ Database-Queries mit Ergebnissen
7. ✅ Network-Tab mit API-Requests

---

Viel Erfolg beim Testen! 🚀

Bei Fragen oder Problemen: Siehe Troubleshooting Sections oder erstelle ein Issue.
