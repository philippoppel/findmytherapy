/**
 * PHQ-9 & GAD-7 Questionnaire Definitions
 *
 * Official validated questionnaires for mental health screening
 */

export type QuestionnaireAnswer = {
  value: number;
  label: string;
  description: string;
};

export type QuestionnaireQuestion = {
  id: string;
  text: string;
  helpText?: string;
  scientificContext?: string;
};

// Standard response options for both PHQ-9 and GAD-7 (0-3 scale)
export const standardResponseOptions: QuestionnaireAnswer[] = [
  {
    value: 0,
    label: 'Überhaupt nicht',
    description: 'In den letzten zwei Wochen nicht aufgetreten',
  },
  {
    value: 1,
    label: 'An einzelnen Tagen',
    description: 'Gelegentlich, aber nicht regelmäßig',
  },
  {
    value: 2,
    label: 'An mehr als der Hälfte der Tage',
    description: 'Häufiger als nicht, deutlich spürbar',
  },
  {
    value: 3,
    label: 'Beinahe jeden Tag',
    description: 'Nahezu täglich, stark beeinträchtigend',
  },
];

/**
 * PHQ-9 (Patient Health Questionnaire - 9 items)
 *
 * Source: Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure.
 * J Gen Intern Med. 2001;16(9):606-613.
 */
export const phq9Questions: QuestionnaireQuestion[] = [
  {
    id: 'phq9_1',
    text: 'Wenig Interesse oder Freude an Ihren Tätigkeiten',
    helpText:
      'Haben Sie das Gefühl, dass Aktivitäten, die Ihnen früher Freude bereitet haben, nicht mehr interessant sind?',
    scientificContext: 'Anhedonie (Verlust der Freude) ist ein Kernsymptom depressiver Störungen.',
  },
  {
    id: 'phq9_2',
    text: 'Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit',
    helpText:
      'Fühlen Sie sich gedrückt, traurig oder haben das Gefühl, dass sich nichts mehr bessern wird?',
    scientificContext: 'Depressive Stimmung ist das zweite Kernsymptom depressiver Episoden.',
  },
  {
    id: 'phq9_3',
    text: 'Schwierigkeiten ein- oder durchzuschlafen, oder vermehrter Schlaf',
    helpText: 'Probleme mit dem Schlaf – entweder zu wenig oder zu viel Schlaf.',
    scientificContext: 'Schlafstörungen treten bei über 80% der Menschen mit Depression auf.',
  },
  {
    id: 'phq9_4',
    text: 'Müdigkeit oder Gefühl, keine Energie zu haben',
    helpText: 'Fühlen Sie sich erschöpft, selbst nach ausreichend Ruhe?',
    scientificContext:
      'Energiemangel kann die Ausführung alltäglicher Aufgaben deutlich erschweren.',
  },
  {
    id: 'phq9_5',
    text: 'Verminderter Appetit oder übermäßiges Bedürfnis zu essen',
    helpText: 'Veränderungen in Ihrem Essverhalten oder Appetit.',
    scientificContext: 'Appetit- und Gewichtsveränderungen sind häufige körperliche Symptome.',
  },
  {
    id: 'phq9_6',
    text: 'Schlechte Meinung von sich selbst; Gefühl, ein Versager zu sein oder die Familie enttäuscht zu haben',
    helpText: 'Negative Gedanken über sich selbst oder Schuldgefühle.',
    scientificContext:
      'Niedriges Selbstwertgefühl und Schuldgefühle sind kognitive Symptome der Depression.',
  },
  {
    id: 'phq9_7',
    text: 'Schwierigkeiten, sich auf etwas zu konzentrieren, z.B. beim Zeitunglesen oder Fernsehen',
    helpText: 'Probleme, aufmerksam zu bleiben oder Entscheidungen zu treffen.',
    scientificContext:
      'Konzentrationsprobleme beeinträchtigen oft die Arbeits- und Alltagsfähigkeit.',
  },
  {
    id: 'phq9_8',
    text: 'Waren Ihre Bewegungen oder Ihre Sprache so verlangsamt, dass es auch anderen auffallen würde? Oder waren Sie im Gegenteil „zappelig" oder ruhelos und hatten dadurch einen stärkeren Bewegungsdrang als sonst?',
    helpText: 'Auffällige Veränderungen in Bewegung oder Aktivität.',
    scientificContext: 'Psychomotorische Veränderungen können von außen sichtbar sein.',
  },
  {
    id: 'phq9_9',
    text: 'Gedanken, dass Sie lieber tot wären oder sich Leid zufügen möchten',
    helpText:
      'Dies ist eine sehr wichtige Frage. Bei Ja-Antworten werden sofort Hilfsressourcen angezeigt.',
    scientificContext: 'Suizidgedanken erfordern sofortige professionelle Unterstützung.',
  },
];

/**
 * PHQ-9 Severity Levels
 */
export type PHQ9Severity = 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';

export function calculatePHQ9Severity(score: number): PHQ9Severity {
  if (score >= 20) return 'severe';
  if (score >= 15) return 'moderately_severe';
  if (score >= 10) return 'moderate';
  if (score >= 5) return 'mild';
  return 'minimal';
}

export const phq9SeverityLabels: Record<PHQ9Severity, string> = {
  minimal: 'Minimale depressive Symptome',
  mild: 'Leichte depressive Symptome',
  moderate: 'Mittelschwere depressive Symptome',
  moderately_severe: 'Mittelschwer bis schwere depressive Symptome',
  severe: 'Schwere depressive Symptome',
};

export const phq9SeverityDescriptions: Record<PHQ9Severity, string> = {
  minimal:
    'Keine oder nur sehr geringe Anzeichen einer Depression. Psychoedukation, Bewegung und soziale Aktivierung wirken präventiv.',
  mild: 'Leichte depressive Symptome, die im Alltag spürbar sind. Evidenzbasierte Selbsthilfe und digitale Programme sind laut S3-Leitlinie eine geeignete Erstmaßnahme.',
  moderate:
    'Mittelschwere Symptome, die den Alltag deutlich beeinträchtigen. Die S3-Leitlinie empfiehlt Psychotherapie und eine ärztliche Abklärung weiterer Therapieoptionen.',
  moderately_severe:
    'Ausgeprägte Symptome mit erheblicher Funktionsbeeinträchtigung. Dringend psychotherapeutische und ärztliche Behandlung aufnehmen, ggf. Kombinationstherapie einleiten.',
  severe:
    'Sehr schwere depressive Symptome. Sofort professionelle Hilfe organisieren – Psychotherapie, psychiatrische Behandlung und Krisendienst sind angezeigt.',
};

/**
 * GAD-7 (Generalized Anxiety Disorder - 7 items)
 *
 * Source: Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder.
 * Arch Intern Med. 2006;166(10):1092-1097.
 */
export const gad7Questions: QuestionnaireQuestion[] = [
  {
    id: 'gad7_1',
    text: 'Nervosität, Ängstlichkeit oder Anspannung',
    helpText: 'Fühlen Sie sich angespannt oder „auf dem Sprung"?',
    scientificContext: 'Grundlegende Nervosität ist ein Kernsymptom von Angststörungen.',
  },
  {
    id: 'gad7_2',
    text: 'Nicht in der Lage sein, Sorgen zu stoppen oder zu kontrollieren',
    helpText: 'Kreisen Ihre Gedanken ständig um Sorgen, die Sie nicht abstellen können?',
    scientificContext: 'Unkontrollierbare Sorgen kennzeichnen die generalisierte Angststörung.',
  },
  {
    id: 'gad7_3',
    text: 'Übermäßige Sorgen bezüglich verschiedener Angelegenheiten',
    helpText: 'Machen Sie sich über viele verschiedene Dinge gleichzeitig Sorgen?',
    scientificContext: 'Sorgen, die viele Lebensbereiche betreffen, sind typisch für GAD.',
  },
  {
    id: 'gad7_4',
    text: 'Schwierigkeiten zu entspannen',
    helpText: 'Fällt es Ihnen schwer, zur Ruhe zu kommen?',
    scientificContext: 'Innere Anspannung verhindert oft Entspannung und Erholung.',
  },
  {
    id: 'gad7_5',
    text: 'Rastlosigkeit, so dass Stillsitzen schwer fällt',
    helpText: 'Fühlen Sie sich getrieben oder können nicht still sitzen?',
    scientificContext: 'Psychomotorische Unruhe ist ein häufiges Angstsymptom.',
  },
  {
    id: 'gad7_6',
    text: 'Schnelle Verärgerung oder Gereiztheit',
    helpText: 'Reagieren Sie schneller gereizt oder ärgerlich als sonst?',
    scientificContext: 'Reizbarkeit kann ein Zeichen chronischer Anspannung sein.',
  },
  {
    id: 'gad7_7',
    text: 'Gefühl der Angst, so als würde etwas Schlimmes passieren',
    helpText: 'Haben Sie das Gefühl einer drohenden Gefahr oder Katastrophe?',
    scientificContext:
      'Angst vor zukünftigen negativen Ereignissen ist zentral bei Angststörungen.',
  },
];

/**
 * GAD-7 Severity Levels
 */
export type GAD7Severity = 'minimal' | 'mild' | 'moderate' | 'severe';

export function calculateGAD7Severity(score: number): GAD7Severity {
  if (score >= 15) return 'severe';
  if (score >= 10) return 'moderate';
  if (score >= 5) return 'mild';
  return 'minimal';
}

export const gad7SeverityLabels: Record<GAD7Severity, string> = {
  minimal: 'Minimale Angstsymptome',
  mild: 'Leichte Angstsymptome',
  moderate: 'Mittelschwere Angstsymptome',
  severe: 'Schwere Angstsymptome',
};

export const gad7SeverityDescriptions: Record<GAD7Severity, string> = {
  minimal:
    'Keine oder nur sehr geringe Angstsymptome. Stressmanagement, Schlafhygiene und Aktivierung stabilisieren die Resilienz.',
  mild: 'Leichte Angstsymptome, die gelegentlich auftreten. Strukturierte Selbsthilfe und Entspannungsverfahren werden empfohlen.',
  moderate:
    'Mittelschwere Angstsymptome, die Alltag und Lebensqualität beeinträchtigen. Wirksam sind kognitive Verhaltenstherapie und ärztliche Abklärung.',
  severe:
    'Schwere Angstsymptome mit deutlicher Einschränkung. Rasch psychotherapeutische und ärztliche Unterstützung hinzuziehen, ggf. kombinierte Behandlung.',
};

/**
 * Risk Level Assessment based on PHQ-9 and GAD-7 scores
 */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

type RiskAssessmentOptions = {
  phq9Item9Score?: number;
};

export function assessRiskLevel(
  phq9Score: number,
  gad7Score: number,
  options: RiskAssessmentOptions = {},
): {
  level: RiskLevel;
  requiresEmergency: boolean;
  ampelColor: 'green' | 'yellow' | 'red';
  hasSuicidalIdeation: boolean;
} {
  const { phq9Item9Score = 0 } = options;
  const phq9Severity = calculatePHQ9Severity(phq9Score);
  const gad7Severity = calculateGAD7Severity(gad7Score);
  const hasSuicidalIdeation = phq9Item9Score >= 1;

  const meetsEmergencyCriteria = hasSuicidalIdeation || phq9Score >= 20;
  const needsHighIntensitySupport =
    phq9Severity === 'moderately_severe' ||
    phq9Severity === 'severe' ||
    gad7Severity === 'severe' ||
    (phq9Severity === 'moderate' && gad7Severity === 'moderate');

  const hasRelevantSymptoms =
    phq9Severity === 'moderate' ||
    gad7Severity === 'moderate' ||
    (phq9Severity === 'mild' && gad7Severity === 'mild') ||
    (phq9Severity === 'mild' && gad7Severity === 'moderate') ||
    (phq9Severity === 'moderate' && gad7Severity === 'mild');

  if (meetsEmergencyCriteria) {
    return {
      level: 'HIGH',
      requiresEmergency: true,
      ampelColor: 'red',
      hasSuicidalIdeation,
    };
  }

  if (needsHighIntensitySupport) {
    return {
      level: 'HIGH',
      requiresEmergency: false,
      ampelColor: 'red',
      hasSuicidalIdeation,
    };
  }

  if (hasRelevantSymptoms) {
    return {
      level: 'MEDIUM',
      requiresEmergency: false,
      ampelColor: 'yellow',
      hasSuicidalIdeation,
    };
  }

  // LOW: minimal on both or only one mild
  return {
    level: 'LOW',
    requiresEmergency: false,
    ampelColor: 'green',
    hasSuicidalIdeation,
  };
}

/**
 * Additional context questions
 */
export type SupportOption = {
  value: string;
  label: string;
  description: string;
};

export const supportOptions: SupportOption[] = [
  {
    value: 'therapist',
    label: '1:1 Psychotherapie',
    description: 'Individuelle therapeutische Begleitung durch eine*n Therapeut*in',
  },
  {
    value: 'course',
    label: 'Digitale Programme & Kurse',
    description: 'Strukturierte Selbsthilfe-Programme mit Übungen und Psychoedukation',
  },
  {
    value: 'group',
    label: 'Gruppenangebote',
    description: 'Austausch und Unterstützung in therapeutisch geleiteten Gruppen',
  },
  {
    value: 'checkin',
    label: 'Regelmäßige Check-ins',
    description: 'Begleitende Gespräche mit dem Care-Team zur Verlaufskontrolle',
  },
];

export const availabilityOptions: SupportOption[] = [
  {
    value: 'online',
    label: 'Online & Abends',
    description: 'Flexible Online-Termine, auch außerhalb regulärer Arbeitszeiten',
  },
  {
    value: 'hybrid',
    label: 'Hybrid (vor Ort + online)',
    description: 'Kombination aus Präsenz- und Online-Terminen',
  },
  {
    value: 'mornings',
    label: 'Morgens unter der Woche',
    description: 'Termine am Vormittag während der Woche',
  },
  {
    value: 'weekend',
    label: 'Wochenende',
    description: 'Termine am Samstag oder Sonntag',
  },
];
