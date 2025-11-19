// Types
export type {
  MatchingPreferencesInput,
  MatchingWeights,
  ScoreBreakdown,
  MatchExplanation,
  MatchResult,
  MatchingResponse,
  TherapistForMatching,
  Coordinates,
  FilterReason,
  FilteredTherapist,
} from './types'

export {
  DEFAULT_WEIGHTS,
  PROBLEM_AREA_MAPPING,
  AVAILABILITY_STATUS_WEEKS,
} from './types'

// Score Calculator
export {
  calculateMatchScore,
  calculateDistanceKm,
} from './score-calculator'

// Explanation Generator
export {
  generateMatchExplanation,
  generateShortExplanation,
} from './explanation-generator'

// Matching Service
export {
  findMatches,
  saveMatchingPreferences,
  createMatchingResponse,
  cleanupExpiredPreferences,
} from './matching-service'
