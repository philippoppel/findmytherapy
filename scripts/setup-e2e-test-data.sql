-- ============================================================================
-- E2E Test Data Setup Script
-- ============================================================================
-- Erstellt alle notwendigen Test-Daten für Microsite & Dossier Features
--
-- WICHTIG: Ersetze <client-user-id> und <therapist-user-id> mit echten IDs
--          aus deiner User-Tabelle!
--
-- Usage:
--   1. Finde User-IDs: SELECT id, email, role FROM "User" LIMIT 10;
--   2. Ersetze Platzhalter unten
--   3. Führe Script aus (siehe unten)
-- ============================================================================

-- ============================================================================
-- 1. THERAPEUTEN-PROFIL MIT MICROSITE KONFIGURIEREN
-- ============================================================================

-- Zeige verfügbare Therapeuten-Profile
SELECT
  tp.id,
  tp."userId",
  tp."displayName",
  tp.status,
  tp."micrositeSlug",
  u.email
FROM "TherapistProfile" tp
JOIN "User" u ON u.id = tp."userId"
ORDER BY tp."createdAt" DESC;

-- WICHTIG: Wähle ein Profil aus der Liste oben und ersetze unten die ID!

-- Konfiguriere Microsite für ersten Therapeuten
DO $$
DECLARE
  v_therapist_profile_id TEXT;
BEGIN
  -- Nimm das erste verfügbare Therapeuten-Profil
  SELECT id INTO v_therapist_profile_id
  FROM "TherapistProfile"
  WHERE status IN ('PENDING', 'VERIFIED')
  LIMIT 1;

  IF v_therapist_profile_id IS NULL THEN
    RAISE EXCEPTION 'Kein Therapeuten-Profil gefunden!';
  END IF;

  -- Update Profil mit Microsite-Daten
  UPDATE "TherapistProfile"
  SET
    -- Microsite Settings
    "micrositeSlug" = 'dr-maria-mueller',
    "micrositeStatus" = 'PUBLISHED',
    "micrositeLastPublishedAt" = NOW(),

    -- Basic Info
    "displayName" = 'Dr. Maria Müller',
    "title" = 'Klinische Psychologin & Psychotherapeutin',
    "headline" = 'Spezialistin für Angst, Depression und Burnout mit über 10 Jahren Erfahrung',
    "about" = E'Mit über 10 Jahren Erfahrung in der klinischen Praxis unterstütze ich Menschen dabei, ihre mentale Gesundheit zu verbessern.\n\nMein Schwerpunkt liegt auf evidenzbasierten Therapiemethoden wie kognitiver Verhaltenstherapie (KVT), Achtsamkeitsbasierter Stressreduktion (MBSR) und EMDR für Traumabearbeitung.\n\nIch arbeite sowohl mit Einzelpersonen als auch Paaren und biete auch Online-Sitzungen an.',

    -- Contact & Location
    "city" = 'Wien',
    "country" = 'AT',
    "online" = true,
    "languages" = ARRAY['Deutsch', 'Englisch'],

    -- Pricing (in Cents!)
    "priceMin" = 12000,  -- 120 EUR
    "priceMax" = 15000,  -- 150 EUR
    "pricingNote" = 'Wahltherapeut - teilweise Rückerstattung durch Krankenkasse möglich. Erstkonsultation: 90 Minuten (150€)',

    -- Specializations
    "specialties" = ARRAY['Angst', 'Depression', 'Burnout', 'Trauma', 'Beziehungsprobleme'],
    "modalities" = ARRAY['Verhaltenstherapie', 'Achtsamkeit', 'EMDR', 'Paartherapie'],
    "services" = ARRAY['Einzeltherapie', 'Paartherapie', 'Online-Sitzungen', 'EMDR-Traumatherapie'],

    -- Availability
    "acceptingClients" = true,
    "availabilityNote" = 'Termine verfügbar: Dienstag & Donnerstag 17:00-20:00, Samstag 09:00-13:00',
    "responseTime" = 'Innerhalb 24 Stunden',

    -- Experience
    "yearsExperience" = 12,
    "experienceSummary" = 'Approbierte Psychologische Psychotherapeutin, spezialisiert auf Verhaltenstherapie',
    "approachSummary" = 'Mein Ansatz verbindet wissenschaftlich fundierte Methoden mit einem empathischen, klientenzentrierten Therapiestil.',

    -- Verification
    "status" = 'VERIFIED',
    "isPublic" = true,

    -- Timestamps
    "updatedAt" = NOW()

  WHERE id = v_therapist_profile_id;

  RAISE NOTICE '✅ Therapeuten-Profil konfiguriert: ID=%', v_therapist_profile_id;
  RAISE NOTICE '🌐 Microsite URL: /t/dr-maria-mueller';
END $$;


-- ============================================================================
-- 2. CLIENT MIT TRIAGE SESSION ERSTELLEN
-- ============================================================================

-- Erstelle Test-Triage für ersten Client
DO $$
DECLARE
  v_client_id TEXT;
  v_triage_id TEXT;
BEGIN
  -- Finde ersten Client
  SELECT id INTO v_client_id
  FROM "User"
  WHERE role = 'CLIENT'
  LIMIT 1;

  IF v_client_id IS NULL THEN
    RAISE EXCEPTION 'Kein Client-User gefunden! Erstelle zuerst einen User mit role=CLIENT';
  END IF;

  -- Erstelle Triage Session
  v_triage_id := 'triage-e2e-' || gen_random_uuid()::text;

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
    "meta",
    "createdAt"
  )
  VALUES (
    v_triage_id,
    v_client_id,
    -- PHQ-9 Antworten (9 Items, je 0-3)
    -- Items: Interesse, Niedergeschlagenheit, Schlaf, Energie, Appetit, Versagen, Konzentration, Bewegung, Suizidgedanken
    ARRAY[1, 2, 1, 2, 1, 1, 1, 1, 0],  -- Score = 10 (leichte bis mittlere Depression)
    10,  -- PHQ-9 Total Score
    'moderate',
    -- GAD-7 Antworten (7 Items, je 0-3)
    ARRAY[2, 1, 2, 1, 1, 1, 0],  -- Score = 8 (leichte Angst)
    8,   -- GAD-7 Total Score
    'mild',
    -- Support-Präferenzen
    ARRAY['therapist', 'course']::text[],
    -- Verfügbarkeit
    ARRAY['online', 'mornings', 'weekend']::text[],
    'MEDIUM',  -- Risk Level
    'THERAPIST',
    false,  -- Kein akuter Notfall
    false,
    jsonb_build_object(
      'phq9Item9Score', 0,
      'hasSuicidalIdeation', false,
      'primaryConcerns', ARRAY['Stress am Arbeitsplatz', 'Schlafprobleme', 'Konzentrationsschwierigkeiten']
    ),
    NOW()
  );

  RAISE NOTICE '✅ Triage Session erstellt: ID=%', v_triage_id;
  RAISE NOTICE '📊 Scores: PHQ-9=10 (moderate), GAD-7=8 (mild), Risk=MEDIUM';
END $$;


-- ============================================================================
-- 3. CLIENT CONSENT FÜR DOSSIER-SHARING ERSTELLEN
-- ============================================================================

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
  'consent-e2e-' || gen_random_uuid()::text,
  u.id,
  'DOSSIER_SHARING',
  'GRANTED',
  NOW(),
  'e2e_test_setup',
  jsonb_build_object(
    'consentVersion', '1.0',
    'userAgent', 'test-setup-script',
    'ipAddress', 'setup'
  )
FROM "User" u
WHERE u.role = 'CLIENT'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Zeige Ergebnis
SELECT
  c.id,
  u.email as client_email,
  c.scope,
  c.status,
  c."grantedAt"
FROM "ClientConsent" c
JOIN "User" u ON u.id = c."clientId"
WHERE c.scope = 'DOSSIER_SHARING'
ORDER BY c."grantedAt" DESC
LIMIT 1;


-- ============================================================================
-- 4. ÜBERSICHT DER ERSTELLTEN TEST-DATEN
-- ============================================================================

-- Therapeuten mit Microsite
SELECT
  '🧑‍⚕️ THERAPEUT MIT MICROSITE' as info,
  tp."displayName",
  tp."micrositeSlug",
  tp."micrositeStatus",
  tp.status as verification_status,
  'https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/' || tp."micrositeSlug" as microsite_url
FROM "TherapistProfile" tp
WHERE tp."micrositeSlug" IS NOT NULL
  AND tp."micrositeStatus" = 'PUBLISHED'
LIMIT 1;

-- Client mit Triage & Consent
SELECT
  '🧑 CLIENT MIT TRIAGE & CONSENT' as info,
  u.email as client_email,
  ts.id as triage_id,
  ts."phq9Score",
  ts."gad7Score",
  ts."riskLevel",
  CASE WHEN cc.id IS NOT NULL THEN 'JA' ELSE 'NEIN' END as has_consent
FROM "User" u
JOIN "TriageSession" ts ON ts."clientId" = u.id
LEFT JOIN "ClientConsent" cc ON cc."clientId" = u.id AND cc.scope = 'DOSSIER_SHARING' AND cc.status = 'GRANTED'
WHERE u.role = 'CLIENT'
ORDER BY ts."createdAt" DESC
LIMIT 1;

-- Zusammenfassung für Dossier-Erstellung
SELECT
  '📋 BEREIT FÜR DOSSIER-ERSTELLUNG' as info,
  ts.id as triage_session_id,
  tp.id as therapist_profile_id,
  u_therapist.id as therapist_user_id,
  u_client.email as client_email
FROM "TriageSession" ts
JOIN "User" u_client ON u_client.id = ts."clientId"
CROSS JOIN "TherapistProfile" tp
JOIN "User" u_therapist ON u_therapist.id = tp."userId"
WHERE tp.status = 'VERIFIED'
  AND tp."micrositeSlug" = 'dr-maria-mueller'
  AND ts."createdAt" > NOW() - INTERVAL '1 hour'  -- Nur neue Triages
ORDER BY ts."createdAt" DESC
LIMIT 1;


-- ============================================================================
-- 5. NÄCHSTE SCHRITTE FÜR E2E TESTS
-- ============================================================================

-- Zeige Instructions
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Test-Daten erfolgreich erstellt!';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '📖 NÄCHSTE SCHRITTE:';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '1️⃣  MICROSITE TESTEN:';
  RAISE NOTICE '   URL: https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller';
  RAISE NOTICE '   - Öffne URL im Browser';
  RAISE NOTICE '   - Fülle Kontaktformular aus';
  RAISE NOTICE '   - Check: Lead in TherapistMicrositeLead Tabelle';
  RAISE NOTICE '';
  RAISE NOTICE '2️⃣  DOSSIER ERSTELLEN (Browser Console):';
  RAISE NOTICE '   // Login als Admin, dann in Console:';
  RAISE NOTICE '   const triageId = "<triage-id-from-above>";';
  RAISE NOTICE '   const therapistProfileId = "<therapist-profile-id-from-above>";';
  RAISE NOTICE '   ';
  RAISE NOTICE '   fetch("/api/dossiers", {';
  RAISE NOTICE '     method: "POST",';
  RAISE NOTICE '     headers: {"Content-Type": "application/json"},';
  RAISE NOTICE '     body: JSON.stringify({';
  RAISE NOTICE '       triageSessionId: triageId,';
  RAISE NOTICE '       recommendedTherapistIds: [therapistProfileId],';
  RAISE NOTICE '       trigger: "ADMIN"';
  RAISE NOTICE '     })';
  RAISE NOTICE '   }).then(r => r.json()).then(console.log);';
  RAISE NOTICE '';
  RAISE NOTICE '3️⃣  DOSSIER ABRUFEN (als Therapeut):';
  RAISE NOTICE '   // Logout, Login als Therapeut, dann:';
  RAISE NOTICE '   fetch("/api/dossiers/<dossierId>")';
  RAISE NOTICE '     .then(r => r.json())';
  RAISE NOTICE '     .then(console.log);';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📚 Vollständige Test-Anleitung:';
  RAISE NOTICE '   docs/E2E_TESTING_GUIDE.md';
  RAISE NOTICE '';
END $$;
