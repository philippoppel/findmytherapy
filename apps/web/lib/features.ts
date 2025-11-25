/**
 * Feature Flag System
 *
 * Central configuration for enabling/disabling major platform features.
 * Features can be toggled via environment variables without code changes.
 *
 * Usage:
 * - In components: import { FEATURES } from '@/lib/features'
 * - Check: if (FEATURES.ASSESSMENT) { ... }
 * - Use FeatureGate component for conditional rendering
 *
 * Environment Variables:
 * - NEXT_PUBLIC_FEATURE_ASSESSMENT (default: true)
 * - NEXT_PUBLIC_FEATURE_MICROSITE (default: true)
 * - NEXT_PUBLIC_FEATURE_CHATBOT (default: true)
 */

// Helper to parse env vars with defaults
const parseFeatureFlag = (value: string | undefined, defaultValue = true): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Feature flags configuration
 * All features are enabled by default for backwards compatibility
 */
export const FEATURES = {
  /**
   * Assessment / Ersteinschätzung
   * - Triage flow with PHQ-9, GAD-7, WHO-5 questionnaires
   * - Adaptive assessment
   * - Risk evaluation and recommendations
   * - Crisis resources
   */
  ASSESSMENT: parseFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_ASSESSMENT, true),

  /**
   * Therapist Microsites
   * - Individual therapist landing pages (/t/[slug])
   * - Microsite editor in dashboard
   * - Contact forms and lead generation
   * - Analytics tracking
   */
  MICROSITE: parseFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_MICROSITE, true),

  /**
   * AI Chatbot
   * - Chat widget on marketing pages
   * - Knowledge base with RAG
   * - Feature recommendations
   * - Support conversations
   */
  CHATBOT: parseFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_CHATBOT, true),
} as const;

/**
 * Type-safe feature names
 */
export type FeatureName = keyof typeof FEATURES;

/**
 * Check if a feature is enabled
 * @param feature - The feature name to check
 * @returns true if feature is enabled
 */
export const isFeatureEnabled = (feature: FeatureName): boolean => {
  return FEATURES[feature];
};

/**
 * Get list of all enabled features
 * @returns Array of enabled feature names
 */
export const getEnabledFeatures = (): FeatureName[] => {
  return Object.entries(FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([name]) => name as FeatureName);
};

/**
 * Check if all specified features are enabled
 * @param features - Features to check
 * @returns true if all features are enabled
 */
export const areAllFeaturesEnabled = (...features: FeatureName[]): boolean => {
  return features.every((feature) => FEATURES[feature]);
};

/**
 * Check if any of the specified features are enabled
 * @param features - Features to check
 * @returns true if at least one feature is enabled
 */
export const isAnyFeatureEnabled = (...features: FeatureName[]): boolean => {
  return features.some((feature) => FEATURES[feature]);
};
