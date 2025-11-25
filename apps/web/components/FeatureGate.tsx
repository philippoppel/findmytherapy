/**
 * FeatureGate Component
 *
 * Conditionally renders children based on feature flags.
 * Use this component to wrap any UI elements that should only appear
 * when a specific feature is enabled.
 *
 * @example
 * ```tsx
 * <FeatureGate feature="ASSESSMENT">
 *   <AssessmentSection />
 * </FeatureGate>
 * ```
 *
 * @example With fallback
 * ```tsx
 * <FeatureGate feature="CHATBOT" fallback={<SupportEmailCTA />}>
 *   <ChatWidget />
 * </FeatureGate>
 * ```
 */

import { type ReactNode } from 'react';
import { FEATURES, type FeatureName } from '@/lib/features';

interface FeatureGateProps {
  /**
   * The feature that must be enabled for children to render
   */
  feature: FeatureName;

  /**
   * Content to render when the feature is enabled
   */
  children: ReactNode;

  /**
   * Optional content to render when the feature is disabled
   * If not provided, nothing will be rendered
   */
  fallback?: ReactNode;

  /**
   * If true, renders fallback when feature is ENABLED
   * and children when feature is DISABLED (inverted logic)
   */
  invert?: boolean;
}

/**
 * Conditionally renders children based on whether a feature is enabled
 */
export function FeatureGate({
  feature,
  children,
  fallback = null,
  invert = false,
}: FeatureGateProps) {
  const isEnabled = FEATURES[feature];
  const shouldRenderChildren = invert ? !isEnabled : isEnabled;

  if (shouldRenderChildren) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Hook to check if a feature is enabled
 * Useful for conditional logic in components
 *
 * @example
 * ```tsx
 * const hasAssessment = useFeature('ASSESSMENT')
 * const ctaText = hasAssessment ? 'Start Assessment' : 'Contact Us'
 * ```
 */
export function useFeature(feature: FeatureName): boolean {
  return FEATURES[feature];
}

/**
 * Higher-order component that wraps a component with feature gating
 *
 * @example
 * ```tsx
 * const AssessmentSection = withFeatureGate(
 *   AssessmentSectionComponent,
 *   'ASSESSMENT'
 * )
 * ```
 */
export function withFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  feature: FeatureName,
  fallback?: ReactNode,
) {
  return function FeatureGatedComponent(props: P) {
    return (
      <FeatureGate feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureGate>
    );
  };
}
