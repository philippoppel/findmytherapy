/**
 * Content Filter Functions
 *
 * Filters marketing content based on enabled features.
 * Removes navigation items, feature tabs, benefits, and FAQ items
 * when specific features are disabled.
 */

import { FEATURES } from './features';
import type { FeatureTab, FeatureIconKey } from '../app/marketing-content';

type NavigationItem = {
  label: string;
  href: string;
};

type Benefit = {
  icon: FeatureIconKey;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
};

type FAQItem = {
  question: string;
  answer: string;
};

type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  tertiaryCta: { label: string; href: string };
  metrics: Array<{ value: string; label: string }>;
  image: { src: string; alt: string };
};

type WhyContent = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
  image: { src: string; alt: string };
};

type BenefitsContent = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  benefits: readonly Benefit[];
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

/**
 * Filters navigation items based on enabled features
 * Removes links to disabled features
 */
export function filterNavigationItems(items: readonly NavigationItem[]): NavigationItem[] {
  return items.filter((item) => {
    // Remove triage/assessment links if feature is disabled
    if (!FEATURES.ASSESSMENT && (item.href === '/triage' || item.href === '#phq-info')) {
      return false;
    }
    return true;
  });
}

/**
 * Filters feature tabs based on enabled features
 * Removes tabs for disabled features
 */
export function filterFeatureTabs(tabs: readonly FeatureTab[]): FeatureTab[] {
  return tabs.filter((tab) => {
    // Remove triage tab if assessment is disabled
    if (!FEATURES.ASSESSMENT && (tab.value === 'triage' || tab.value === 'session-zero')) {
      return false;
    }
    // Remove microsite tab if microsite is disabled
    if (!FEATURES.MICROSITE && tab.value === 'microsite') {
      return false;
    }
    return true;
  });
}

/**
 * Filters client benefits based on enabled features
 */
export function filterClientBenefits(benefits: readonly Benefit[]): Benefit[] {
  return benefits.filter((benefit) => {
    // Remove assessment benefit if feature is disabled
    if (!FEATURES.ASSESSMENT && benefit.title === 'Kostenlose Ersteinschätzung') {
      return false;
    }
    return true;
  });
}

/**
 * Filters therapist benefits based on enabled features
 */
export function filterTherapistBenefits(benefits: readonly Benefit[]): Benefit[] {
  return benefits.filter((benefit) => {
    // Remove assessment-related benefit
    if (!FEATURES.ASSESSMENT && benefit.title === 'Erstgespräch-Vorbericht') {
      return false;
    }
    // Remove microsite benefit
    if (!FEATURES.MICROSITE && benefit.title === 'Deine automatische Praxis-Webseite') {
      return false;
    }
    return true;
  });
}

/**
 * Filters FAQ items based on enabled features
 * Removes questions about disabled features
 */
export function filterFAQItems(items: readonly FAQItem[]): FAQItem[] {
  return items.filter((item) => {
    const question = item.question.toLowerCase();
    const answer = item.answer.toLowerCase();

    // Remove assessment-related FAQs
    if (!FEATURES.ASSESSMENT) {
      if (
        question.includes('ampel') ||
        question.includes('triage') ||
        answer.includes('phq-9') ||
        answer.includes('gad-7')
      ) {
        return false;
      }
    }

    // Remove microsite-related FAQs
    if (!FEATURES.MICROSITE) {
      if (
        question.includes('webseite') ||
        question.includes('microsite') ||
        answer.includes('findmytherapy.com/t/')
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Gets hero content with feature-aware adjustments
 * Modifies CTAs, metrics, and description based on enabled features
 */
export function getFilteredHeroContent(heroContent: HeroContent): HeroContent {
  const filtered = { ...heroContent };

  // Adjust primary CTA if assessment is disabled
  if (!FEATURES.ASSESSMENT) {
    // Update eyebrow to remove assessment reference
    filtered.eyebrow = 'Therapeut:innen-Vermittlung & Begleitung';

    // Replace assessment-related metrics with therapist-focused metrics
    filtered.metrics = [
      { value: 'Verifiziert', label: 'Alle Profile geprüft' },
      { value: 'Transparent', label: 'Klare Spezialisierungen' },
      { value: '100% DSGVO', label: 'EU-Datenschutz' },
    ];

    // Adjust description to remove assessment references
    filtered.description = filtered.description
      .replace(
        /Validierte Ampel-Ersteinschätzung \(PHQ-9, GAD-7, WHO-5\) in unter 5 Minuten – mit Kursen, /,
        '',
      )
      .replace(
        /mit Kursen, Therapeut:innen-Vermittlung oder Krisenhilfe/,
        'mit Therapeut:innen-Vermittlung und professionellen Kursen',
      );
  }

  // Adjust description if microsite is disabled
  if (!FEATURES.MICROSITE) {
    filtered.description = filtered.description.replace(/, eine kostenlose Praxis-Webseite/, '');
  }

  return filtered;
}

/**
 * Gets why section content with feature-aware adjustments
 */
export function getFilteredWhyContent(whyContent: WhyContent): WhyContent {
  const filtered = { ...whyContent };

  if (!FEATURES.ASSESSMENT) {
    // Remove assessment-related bullet points
    filtered.bullets = filtered.bullets.filter(
      (bullet: string) =>
        !bullet.includes('Ampel-Ersteinschätzung') && !bullet.includes('Fragebögen'),
    );

    // Update CTA
    filtered.cta = {
      label: 'Therapeut:innen durchsuchen',
      href: '/therapists',
    };

    // Adjust description
    filtered.description = filtered.description.replace(
      /Ersteinschätzung, Vermittlung und Begleitung/,
      'Vermittlung und Begleitung',
    );
  }

  return filtered;
}

/**
 * Gets client benefits content with filtered benefits and adjusted CTAs
 */
export function getFilteredClientBenefits(clientBenefits: BenefitsContent): BenefitsContent {
  const filtered = { ...clientBenefits };

  // Filter benefits
  filtered.benefits = filterClientBenefits(clientBenefits.benefits);

  // Adjust CTAs if assessment is disabled
  if (!FEATURES.ASSESSMENT) {
    filtered.cta = {
      primary: {
        label: 'Therapeut:innen finden',
        href: '/therapists',
      },
      secondary: {
        label: 'Kurse ansehen',
        href: '/courses',
      },
    };
  }

  return filtered;
}

/**
 * Gets therapist benefits content with filtered benefits
 */
export function getFilteredTherapistBenefits(therapistBenefits: BenefitsContent): BenefitsContent {
  const filtered = { ...therapistBenefits };

  // Filter benefits
  filtered.benefits = filterTherapistBenefits(therapistBenefits.benefits);

  return filtered;
}

type ContactCta = {
  heading: string;
  subheading: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

/**
 * Gets contact CTA content with feature-aware adjustments
 */
export function getFilteredContactCta(contactCta: ContactCta): ContactCta {
  const filtered = { ...contactCta };

  if (!FEATURES.ASSESSMENT) {
    // Remove reference to "Erstgespräch-Vorberichte" which requires assessment
    filtered.subheading = filtered.subheading
      .replace(/Erhalte Erstgespräch-Vorberichte vor jedem ersten Termin, /, '')
      .replace(/eine kostenlose Praxis-Webseite und /, 'Eine kostenlose Praxis-Webseite, ');
  }

  if (!FEATURES.MICROSITE) {
    // Remove reference to microsite
    filtered.subheading = filtered.subheading
      .replace(/, eine kostenlose Praxis-Webseite/, '')
      .replace(/eine kostenlose Praxis-Webseite und /, '')
      .replace(/Eine kostenlose Praxis-Webseite, /, '');
  }

  return filtered;
}

/**
 * Gets complete filtered marketing content
 * Convenience function that applies all filters at once
 */
export function getFilteredMarketingContent(content: {
  navigation: readonly NavigationItem[];
  heroContent: HeroContent;
  whyContent: WhyContent;
  featureTabs: readonly FeatureTab[];
  clientBenefits: BenefitsContent;
  therapistBenefits: BenefitsContent;
  faqItems: readonly FAQItem[];
}) {
  return {
    navigation: filterNavigationItems(content.navigation),
    heroContent: getFilteredHeroContent(content.heroContent),
    whyContent: getFilteredWhyContent(content.whyContent),
    featureTabs: filterFeatureTabs(content.featureTabs),
    clientBenefits: getFilteredClientBenefits(content.clientBenefits),
    therapistBenefits: getFilteredTherapistBenefits(content.therapistBenefits),
    faqItems: filterFAQItems(content.faqItems),
  };
}
