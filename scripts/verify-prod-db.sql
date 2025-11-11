-- Verify all tables exist
SELECT
  'Microsite Tables' as category,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('TherapistMicrositeVisit', 'TherapistMicrositeLead', 'TherapistMicrositeRedirect')

UNION ALL

SELECT
  'Dossier Tables' as category,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('SessionZeroDossier', 'DossierAccessLog', 'ClientConsent')

UNION ALL

SELECT
  'Core Tables' as category,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('User', 'TherapistProfile', 'TriageSession');

-- Show all public tables
SELECT '--- All Public Tables ---' as info;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
