import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type {
  MatchingPreferencesInput,
  MatchingWeights,
  MatchResult,
  MatchingResponse,
  TherapistForMatching,
  FilterReason,
  FilteredTherapist,
  ZeroResultsAnalysis,
} from './types';
import { DEFAULT_WEIGHTS, PROBLEM_AREA_MAPPING } from './types';
import { calculateMatchScore, calculateDistanceKm } from './score-calculator';
import { generateMatchExplanation } from './explanation-generator';
import { getAvailabilityMeta } from '@/app/therapists/availability';

// Felder die wir vom Therapeuten brauchen
const THERAPIST_SELECT = {
  id: true,
  displayName: true,
  title: true,
  specialties: true,
  modalities: true,
  languages: true,
  online: true,
  city: true,
  latitude: true,
  longitude: true,
  // availabilityStatus, estimatedWaitWeeks, nextAvailableDate werden aus availabilityNote extrahiert
  availabilityNote: true,
  acceptingClients: true,
  priceMin: true,
  priceMax: true,
  acceptedInsurance: true,
  privatePractice: true,
  rating: true,
  reviewCount: true,
  yearsExperience: true,
  profileImageUrl: true,
  headline: true,
} satisfies Prisma.TherapistProfileSelect;

interface MatchingOptions {
  weights?: MatchingWeights;
  limit?: number;
  includeFiltered?: boolean; // Für Debugging
}

interface MatchingResult {
  matches: MatchResult[];
  total: number;
  filtered?: FilteredTherapist[];
}

// Haupt-Matching-Funktion
export async function findMatches(
  preferences: MatchingPreferencesInput,
  options: MatchingOptions = {},
): Promise<MatchingResult> {
  const { weights = DEFAULT_WEIGHTS, limit = 10, includeFiltered = false } = options;

  // 1. Öffentliche, verifizierte Therapeuten laden (mit Limit für Effizienz)
  let rawTherapists;
  try {
    rawTherapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
        status: 'VERIFIED',
        deletedAt: null,
      },
      select: THERAPIST_SELECT,
      take: 200, // Limit für Netzwerk-Effizienz - mehr als genug für gutes Matching
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('does not exist')) {
      throw new Error(
        `Datenbank-Schema-Fehler: Eine erforderliche Tabelle existiert nicht. ` +
          `Bitte überprüfen Sie die Datenbankverbindung und das Schema. ` +
          `Aktuelle Datenbank: ${process.env.DATABASE_URL?.substring(0, 40)}...`,
      );
    }
    throw error;
  }

  // Availability-Felder aus availabilityNote berechnen
  const therapists: TherapistForMatching[] = rawTherapists.map((t) => {
    const availMeta = getAvailabilityMeta(t.availabilityNote, t.acceptingClients);
    return {
      ...t,
      availabilityStatus:
        availMeta.rank === 0
          ? 'AVAILABLE'
          : availMeta.rank === 1
            ? 'AVAILABLE'
            : availMeta.rank === 2
              ? 'LIMITED'
              : availMeta.rank === 3
                ? 'WAITLIST'
                : 'UNAVAILABLE',
      estimatedWaitWeeks:
        availMeta.rank === 0
          ? 0
          : availMeta.rank === 1
            ? 1
            : availMeta.rank === 2
              ? 3
              : availMeta.rank === 3
                ? 6
                : 12,
      nextAvailableDate: availMeta.nextAvailableDate,
    };
  });

  // 2. Harte Filter anwenden mit Fallback-Strategie
  const MIN_RESULTS = 3; // Mindestanzahl an Ergebnissen vor Fallback

  // Versuch 1: Alle harten Filter inkl. Spezialisierung
  let { passed, filtered } = applyHardFilters(therapists, preferences, { strictSpecialty: true });

  // Fallback: Wenn zu wenig Ergebnisse, lockere NUR den Spezialisierungs-Filter
  // WICHTIG: Sprache, Format und Versicherung bleiben IMMER hart!
  if (passed.length < MIN_RESULTS) {
    const fallback = applyHardFilters(therapists, preferences, { strictSpecialty: false });
    passed = fallback.passed;
    filtered = fallback.filtered;
  }

  // 3. Scores berechnen und sortieren
  const matchResults: MatchResult[] = [];

  for (const therapist of passed) {
    const scoreBreakdown = calculateMatchScore(preferences, therapist, weights);
    const explanation = generateMatchExplanation(therapist, preferences, scoreBreakdown);

    // Distanz hinzufügen falls verfügbar
    let distanceKm: number | undefined;
    if (
      preferences.latitude &&
      preferences.longitude &&
      therapist.latitude &&
      therapist.longitude
    ) {
      distanceKm = calculateDistanceKm(
        { lat: preferences.latitude, lng: preferences.longitude },
        { lat: therapist.latitude, lng: therapist.longitude },
      );
    }

    matchResults.push({
      therapist,
      score: scoreBreakdown.total,
      scoreBreakdown,
      explanation,
      distanceKm,
    });
  }

  // Nach Score sortieren (absteigend)
  matchResults.sort((a, b) => b.score - a.score);

  // Auf Limit beschränken
  const topMatches = matchResults.slice(0, limit);

  return {
    matches: topMatches,
    total: passed.length,
    filtered: includeFiltered ? filtered : undefined,
  };
}

// Harte Filter anwenden
interface FilterOptions {
  strictSpecialty: boolean; // Wenn false, wird Spezialisierung nur im Score berücksichtigt
  // Sprache, Format und Versicherung bleiben IMMER hart!
}

function applyHardFilters(
  therapists: TherapistForMatching[],
  preferences: MatchingPreferencesInput,
  options: FilterOptions = { strictSpecialty: true },
): { passed: TherapistForMatching[]; filtered: FilteredTherapist[] } {
  const passed: TherapistForMatching[] = [];
  const filtered: FilteredTherapist[] = [];

  for (const therapist of therapists) {
    const filterReason = checkHardFilters(therapist, preferences, options);

    if (filterReason) {
      filtered.push({ therapistId: therapist.id, reason: filterReason });
    } else {
      passed.push(therapist);
    }
  }

  return { passed, filtered };
}

// Einzelnen Therapeuten gegen harte Kriterien prüfen
function checkHardFilters(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput,
  options: FilterOptions = { strictSpecialty: true },
): FilterReason | null {
  // 1. Spezialisierung muss Problemfeld abdecken (nur wenn strictSpecialty = true)
  if (options.strictSpecialty && preferences.problemAreas.length > 0) {
    const hasSpecialtyMatch = checkSpecialtyMatch(therapist, preferences);
    if (!hasSpecialtyMatch) {
      return 'no_specialty_match';
    }
  }

  // 2. Sprache muss IMMER passen (bleibt IMMER harter Filter)
  if (preferences.languages.length > 0) {
    const therapistLangs = (therapist.languages || []).map((l) => l.toLowerCase());
    const hasLanguageMatch = preferences.languages.some((lang) =>
      therapistLangs.includes(lang.toLowerCase()),
    );
    if (!hasLanguageMatch) {
      return 'language_mismatch';
    }
  }

  // 3. Versicherung/Kosten muss IMMER passen (wenn gefordert)
  if (preferences.insuranceType !== 'ANY') {
    const hasInsuranceMatch = checkInsuranceMatch(therapist, preferences);
    if (!hasInsuranceMatch) {
      return 'insurance_mismatch';
    }
  }

  // 4. Online/Präsenz muss IMMER kompatibel sein (bleibt IMMER harter Filter)
  if (preferences.format === 'ONLINE' && !therapist.online) {
    return 'format_mismatch';
  }
  if (preferences.format === 'IN_PERSON') {
    // Therapeut muss Präsenz anbieten (nicht nur online)
    if (!therapist.city && !therapist.latitude) {
      // Kein Standort = vermutlich nur online
      if (therapist.online) {
        return 'format_mismatch';
      }
    }
  }

  // 5. Entfernung prüfen (wenn Präsenz gewünscht und maxDistance angegeben)
  // Dies bleibt ein harter Filter, weil er vom User explizit gesetzt wird
  if (preferences.format !== 'ONLINE' && preferences.maxDistanceKm) {
    if (preferences.latitude && preferences.longitude) {
      if (therapist.latitude && therapist.longitude) {
        const distance = calculateDistanceKm(
          { lat: preferences.latitude, lng: preferences.longitude },
          { lat: therapist.latitude, lng: therapist.longitude },
        );
        if (distance > preferences.maxDistanceKm) {
          return 'distance_exceeded';
        }
      }
    }
  }

  return null; // Alle Filter bestanden
}

// Spezialisierungs-Match prüfen
function checkSpecialtyMatch(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput,
): boolean {
  const therapistSpecs = (therapist.specialties || []).map((s) => s.toLowerCase());
  if (therapistSpecs.length === 0) return false;

  for (const problemArea of preferences.problemAreas) {
    const normalizedArea = problemArea.toLowerCase();

    // Direkte Übereinstimmung
    if (therapistSpecs.some((ts) => ts.includes(normalizedArea) || normalizedArea.includes(ts))) {
      return true;
    }

    // Mapping-basierte Übereinstimmung
    const relatedSpecs = PROBLEM_AREA_MAPPING[normalizedArea] || [];
    for (const related of relatedSpecs) {
      const relatedLower = related.toLowerCase();
      if (therapistSpecs.some((ts) => ts.includes(relatedLower) || relatedLower.includes(ts))) {
        return true;
      }
    }
  }

  return false;
}

// Versicherungs-Match prüfen
function checkInsuranceMatch(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput,
): boolean {
  if (preferences.insuranceType === 'ANY') return true;

  // Selbstzahler
  if (preferences.insuranceType === 'SELF_PAY') {
    return therapist.privatePractice === true;
  }

  if (!therapist.acceptedInsurance || therapist.acceptedInsurance.length === 0) {
    return false;
  }

  const insuranceKeywords: Record<string, string[]> = {
    PUBLIC: ['gesetzlich', 'öffentlich', 'krankenkasse', 'gkk', 'ögk', 'bva', 'svs', 'oegk'],
    PRIVATE: ['privat', 'private', 'zusatz'],
  };

  const keywords = insuranceKeywords[preferences.insuranceType] || [];
  const therapistInsLower = therapist.acceptedInsurance.map((i) => i.toLowerCase());

  return keywords.some((kw) => therapistInsLower.some((ins) => ins.includes(kw)));
}

// Matching-Präferenzen speichern
export async function saveMatchingPreferences(
  preferences: MatchingPreferencesInput,
  userId?: string,
): Promise<{ id: string; sessionId: string }> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 Tage

  try {
    const saved = await prisma.matchingPreferences.create({
      data: {
        sessionId,
        userId,
        problemAreas: preferences.problemAreas,
        languages: preferences.languages,
        insuranceType: preferences.insuranceType,
        format: preferences.format,
        maxDistanceKm: preferences.maxDistanceKm,
        latitude: preferences.latitude,
        longitude: preferences.longitude,
        postalCode: preferences.postalCode,
        city: preferences.city,
        maxWaitWeeks: preferences.maxWaitWeeks,
        preferredMethods: preferences.preferredMethods || [],
        therapistGender: preferences.therapistGender,
        therapistAgeRange: preferences.therapistAgeRange,
        communicationStyle: preferences.communicationStyle || 'ANY',
        priceMax: preferences.priceMax,
        expiresAt,
      },
      select: {
        id: true,
        sessionId: true,
      },
    });

    return saved;
  } catch (error) {
    if (error instanceof Error && error.message.includes('does not exist')) {
      throw new Error(
        `Datenbank-Schema-Fehler: Die MatchingPreferences-Tabelle existiert nicht. ` +
          `Bitte führen Sie 'prisma db push' mit der korrekten DATABASE_URL aus. ` +
          `Aktuelle Datenbank: ${process.env.DATABASE_URL?.substring(0, 40)}...`,
      );
    }
    throw error;
  }
}

// Analysiere warum keine Ergebnisse gefunden wurden
export async function analyzeFailedFilters(
  preferences: MatchingPreferencesInput,
): Promise<ZeroResultsAnalysis> {
  // Therapeuten laden (mit Limit für Effizienz)
  const rawTherapists = await prisma.therapistProfile.findMany({
    where: {
      isPublic: true,
      status: 'VERIFIED',
      deletedAt: null,
    },
    select: THERAPIST_SELECT,
    take: 200, // Limit für Netzwerk-Effizienz
  });

  const therapists: TherapistForMatching[] = rawTherapists.map((t) => {
    const availMeta = getAvailabilityMeta(t.availabilityNote, t.acceptingClients);
    return {
      ...t,
      availabilityStatus:
        availMeta.rank === 0
          ? 'AVAILABLE'
          : availMeta.rank === 1
            ? 'AVAILABLE'
            : availMeta.rank === 2
              ? 'LIMITED'
              : availMeta.rank === 3
                ? 'WAITLIST'
                : 'UNAVAILABLE',
      estimatedWaitWeeks:
        availMeta.rank === 0
          ? 0
          : availMeta.rank === 1
            ? 1
            : availMeta.rank === 2
              ? 3
              : availMeta.rank === 3
                ? 6
                : 12,
      nextAvailableDate: null,
    };
  });

  // Teste jeden harten Filter einzeln
  const analysis: ZeroResultsAnalysis = {
    failedFilter: 'none',
    alternativesCount: {},
    matchedCriteria: [],
  };

  // 1. Teste Sprache
  if (preferences.languages.length > 0) {
    const withLanguage = therapists.filter((t) => {
      const therapistLangs = (t.languages || []).map((l) => l.toLowerCase());
      return preferences.languages.some((lang) => therapistLangs.includes(lang.toLowerCase()));
    });

    if (withLanguage.length === 0) {
      analysis.failedFilter = 'language';
      analysis.specificValue = preferences.languages.join(', ');

      // Zähle wie viele ohne Sprach-Filter verfügbar wären
      const withoutLanguageFilter = therapists.filter((t) => {
        // Teste alle anderen Filter außer Sprache
        if (preferences.insuranceType !== 'ANY' && !checkInsuranceMatch(t, preferences))
          return false;
        if (preferences.format === 'ONLINE' && !t.online) return false;
        if (preferences.format === 'IN_PERSON' && !t.city && !t.latitude) return false;
        return true;
      });
      analysis.alternativesCount.relaxLanguage = withoutLanguageFilter.length;

      return analysis;
    } else {
      // Sprache passt - als matched criterion speichern
      analysis.matchedCriteria.push({
        criterion: `Sprache: ${preferences.languages.join(', ')}`,
        availableCount: withLanguage.length,
      });
    }
  }

  // 2. Teste Versicherung
  if (preferences.insuranceType !== 'ANY') {
    const withInsurance = therapists.filter((t) => checkInsuranceMatch(t, preferences));

    if (withInsurance.length === 0) {
      analysis.failedFilter = 'insurance';
      analysis.specificValue = preferences.insuranceType;

      const withoutInsuranceFilter = therapists.filter((t) => {
        if (preferences.languages.length > 0) {
          const therapistLangs = (t.languages || []).map((l) => l.toLowerCase());
          if (!preferences.languages.some((lang) => therapistLangs.includes(lang.toLowerCase())))
            return false;
        }
        if (preferences.format === 'ONLINE' && !t.online) return false;
        if (preferences.format === 'IN_PERSON' && !t.city && !t.latitude) return false;
        return true;
      });
      analysis.alternativesCount.relaxInsurance = withoutInsuranceFilter.length;

      return analysis;
    } else {
      analysis.matchedCriteria.push({
        criterion: `Versicherung: ${preferences.insuranceType}`,
        availableCount: withInsurance.length,
      });
    }
  }

  // 3. Teste Format (Online/Präsenz)
  if (preferences.format === 'ONLINE') {
    const withOnline = therapists.filter((t) => t.online);

    if (withOnline.length === 0) {
      analysis.failedFilter = 'format';
      analysis.specificValue = 'Online-Therapie';

      const withoutFormatFilter = therapists.filter((t) => {
        if (preferences.languages.length > 0) {
          const therapistLangs = (t.languages || []).map((l) => l.toLowerCase());
          if (!preferences.languages.some((lang) => therapistLangs.includes(lang.toLowerCase())))
            return false;
        }
        if (preferences.insuranceType !== 'ANY' && !checkInsuranceMatch(t, preferences))
          return false;
        return true;
      });
      analysis.alternativesCount.relaxFormat = withoutFormatFilter.length;

      return analysis;
    } else {
      analysis.matchedCriteria.push({
        criterion: 'Online-Therapie',
        availableCount: withOnline.length,
      });
    }
  }

  // 4. Teste Distanz
  if (
    preferences.format !== 'ONLINE' &&
    preferences.maxDistanceKm &&
    preferences.latitude &&
    preferences.longitude
  ) {
    const inDistance = therapists.filter((t) => {
      if (!t.latitude || !t.longitude) return false;
      const distance = calculateDistanceKm(
        { lat: preferences.latitude!, lng: preferences.longitude! },
        { lat: t.latitude, lng: t.longitude },
      );
      return distance <= preferences.maxDistanceKm!;
    });

    if (inDistance.length === 0) {
      analysis.failedFilter = 'distance';
      analysis.specificValue = `${preferences.maxDistanceKm} km`;

      const withoutDistanceFilter = therapists.filter((t) => {
        if (preferences.languages.length > 0) {
          const therapistLangs = (t.languages || []).map((l) => l.toLowerCase());
          if (!preferences.languages.some((lang) => therapistLangs.includes(lang.toLowerCase())))
            return false;
        }
        if (preferences.insuranceType !== 'ANY' && !checkInsuranceMatch(t, preferences))
          return false;
        return true;
      });
      analysis.alternativesCount.relaxDistance = withoutDistanceFilter.length;

      return analysis;
    } else {
      analysis.matchedCriteria.push({
        criterion: `Umkreis: ${preferences.maxDistanceKm} km`,
        availableCount: inDistance.length,
      });
    }
  }

  // 5. Teste Spezialisierung (letzter Check)
  if (preferences.problemAreas.length > 0) {
    const withSpecialty = therapists.filter((t) => checkSpecialtyMatch(t, preferences));

    if (withSpecialty.length === 0) {
      analysis.failedFilter = 'specialty';
      analysis.specificValue = preferences.problemAreas.join(', ');

      const withoutSpecialtyFilter = therapists.filter((t) => {
        if (preferences.languages.length > 0) {
          const therapistLangs = (t.languages || []).map((l) => l.toLowerCase());
          if (!preferences.languages.some((lang) => therapistLangs.includes(lang.toLowerCase())))
            return false;
        }
        if (preferences.insuranceType !== 'ANY' && !checkInsuranceMatch(t, preferences))
          return false;
        if (preferences.format === 'ONLINE' && !t.online) return false;
        if (preferences.format === 'IN_PERSON' && !t.city && !t.latitude) return false;
        return true;
      });
      analysis.alternativesCount.relaxSpecialty = withoutSpecialtyFilter.length;

      return analysis;
    } else {
      analysis.matchedCriteria.push({
        criterion: `Spezialisierung: ${preferences.problemAreas.join(', ')}`,
        availableCount: withSpecialty.length,
      });
    }
  }

  return analysis;
}

// Vollständige Matching-Response erstellen
export async function createMatchingResponse(
  preferences: MatchingPreferencesInput,
  options: MatchingOptions = {},
  userId?: string,
): Promise<MatchingResponse> {
  // Matches finden
  const result = await findMatches(preferences, options);

  // Präferenzen speichern
  const saved = await saveMatchingPreferences(preferences, userId);

  // Analysiere warum keine Ergebnisse, wenn 0 Matches
  let zeroResultsAnalysis: ZeroResultsAnalysis | undefined;
  if (result.total === 0) {
    zeroResultsAnalysis = await analyzeFailedFilters(preferences);
  }

  return {
    matches: result.matches,
    total: result.total,
    preferences: saved,
    zeroResultsAnalysis,
  };
}

// Abgelaufene Präferenzen löschen (für Cron-Job)
export async function cleanupExpiredPreferences(): Promise<number> {
  const result = await prisma.matchingPreferences.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
