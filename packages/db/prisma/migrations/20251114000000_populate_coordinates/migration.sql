-- Migration to populate missing latitude/longitude based on city names
-- This ensures all therapists with a city have proper coordinates for distance filtering

-- Update Wien
UPDATE "TherapistProfile"
SET latitude = 48.2082, longitude = 16.3738
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('wien', 'vienna');

-- Update Graz
UPDATE "TherapistProfile"
SET latitude = 47.0707, longitude = 15.4395
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'graz';

-- Update Linz
UPDATE "TherapistProfile"
SET latitude = 48.3069, longitude = 14.2858
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'linz';

-- Update Salzburg
UPDATE "TherapistProfile"
SET latitude = 47.8095, longitude = 13.055
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'salzburg';

-- Update Innsbruck
UPDATE "TherapistProfile"
SET latitude = 47.2692, longitude = 11.4041
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('innsbruck', 'ibk');

-- Update Klagenfurt
UPDATE "TherapistProfile"
SET latitude = 46.636, longitude = 14.3122
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'klagenfurt';

-- Update Villach
UPDATE "TherapistProfile"
SET latitude = 46.6141, longitude = 13.8506
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'villach';

-- Update Wels
UPDATE "TherapistProfile"
SET latitude = 48.157, longitude = 14.0249
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'wels';

-- Update Bregenz
UPDATE "TherapistProfile"
SET latitude = 47.5031, longitude = 9.7471
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'bregenz';

-- Update Dornbirn
UPDATE "TherapistProfile"
SET latitude = 47.4125, longitude = 9.7431
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'dornbirn';

-- Update Feldkirch
UPDATE "TherapistProfile"
SET latitude = 47.243, longitude = 9.5851
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'feldkirch';

-- Update Eisenstadt
UPDATE "TherapistProfile"
SET latitude = 47.8456, longitude = 16.5235
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'eisenstadt';

-- Update Mödling
UPDATE "TherapistProfile"
SET latitude = 48.0861, longitude = 16.2892
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('modling', 'mödling', 'moedling');

-- Update Baden
UPDATE "TherapistProfile"
SET latitude = 48.005, longitude = 16.2306
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'baden';

-- Update Steyr
UPDATE "TherapistProfile"
SET latitude = 48.0427, longitude = 14.4213
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('steyr', 'steyr land', 'steyr-land', 'steyr stadt', 'steyr-stadt');

-- Update Wiener Neustadt
UPDATE "TherapistProfile"
SET latitude = 47.8049, longitude = 16.2362
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('wiener neustadt', 'wr neustadt', 'wr. neustadt', 'wienerneustadt');

-- Update St. Pölten
UPDATE "TherapistProfile"
SET latitude = 48.2085, longitude = 15.6245
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('st polten', 'st pölten', 'st. polten', 'st. pölten', 'sankt polten', 'sankt pölten', 'stpolten');

-- Update Klosterneuburg
UPDATE "TherapistProfile"
SET latitude = 48.3059, longitude = 16.3253
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'klosterneuburg';

-- Update Leoben
UPDATE "TherapistProfile"
SET latitude = 47.3842, longitude = 15.0913
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'leoben';

-- Update Bruck an der Mur
UPDATE "TherapistProfile"
SET latitude = 47.4107, longitude = 15.2671
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('bruck an der mur', 'bruck', 'bruck/mur');

-- Update Feldkirchen in Kärnten
UPDATE "TherapistProfile"
SET latitude = 46.7228, longitude = 14.0956
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) IN ('feldkirchen in karnten', 'feldkirchen in kärnten');

-- Update Schwechat
UPDATE "TherapistProfile"
SET latitude = 48.1366, longitude = 16.474
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'schwechat';

-- Update Amstetten
UPDATE "TherapistProfile"
SET latitude = 48.1221, longitude = 14.8721
WHERE (latitude IS NULL OR longitude IS NULL)
AND city IS NOT NULL
AND LOWER(TRIM(city)) = 'amstetten';
