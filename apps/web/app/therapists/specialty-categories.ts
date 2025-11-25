/**
 * Specialty Categories and Mapping
 *
 * This file defines the standard categories for therapist specializations
 * and provides mapping functions to automatically categorize specialties.
 */

export interface SpecialtyCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  icon?: string;
  color?: string;
}

export const SPECIALTY_CATEGORIES: SpecialtyCategory[] = [
  {
    id: 'anxiety',
    name: 'Angst & Panik',
    description: 'Angststörungen, Panikattacken, Phobien, Zwangsstörungen',
    keywords: ['angst', 'panik', 'phobie', 'zwang', 'agoraphobie', 'soziale angst'],
    icon: '😰',
    color: '#FEF3C7',
  },
  {
    id: 'depression',
    name: 'Depression & Burnout',
    description: 'Depressive Störungen, Burnout, Erschöpfung',
    keywords: ['depression', 'depressiv', 'burnout', 'erschöpfung', 'antriebslosigkeit'],
    icon: '😔',
    color: '#DBEAFE',
  },
  {
    id: 'trauma',
    name: 'Trauma & PTBS',
    description: 'Traumabewältigung, PTBS, Missbrauch, Gewalt',
    keywords: ['trauma', 'ptbs', 'ptsd', 'missbrauch', 'gewalt', 'traumatisierung'],
    icon: '💔',
    color: '#FCE7F3',
  },
  {
    id: 'relationships',
    name: 'Beziehungen & Familie',
    description: 'Paartherapie, Familientherapie, Trennungsbewältigung',
    keywords: ['beziehung', 'partnerschaft', 'ehe', 'familie', 'trennung', 'scheidung', 'paar'],
    icon: '💑',
    color: '#FED7AA',
  },
  {
    id: 'eating-disorders',
    name: 'Ess-Störungen',
    description: 'Anorexie, Bulimie, Binge-Eating',
    keywords: ['essstörung', 'anorexie', 'bulimie', 'binge', 'magersucht'],
    icon: '🍽️',
    color: '#E9D5FF',
  },
  {
    id: 'addiction',
    name: 'Sucht & Abhängigkeit',
    description: 'Alkohol, Drogen, Spielsucht, Internetsucht',
    keywords: ['sucht', 'abhängigkeit', 'alkohol', 'drogen', 'spielsucht', 'internetsucht'],
    icon: '🚬',
    color: '#FCA5A5',
  },
  {
    id: 'personality',
    name: 'Persönlichkeitsstörungen',
    description: 'Borderline, Narzissmus, andere Persönlichkeitsstörungen',
    keywords: ['persönlichkeit', 'borderline', 'narziss', 'emotional instabil'],
    icon: '🎭',
    color: '#C7D2FE',
  },
  {
    id: 'stress',
    name: 'Stress & Lebenskrise',
    description: 'Stressbewältigung, Lebenskrisen, Sinnkrisen',
    keywords: ['stress', 'krise', 'lebenskrise', 'sinnkrise', 'überforderung'],
    icon: '😓',
    color: '#FED7E2',
  },
  {
    id: 'self-esteem',
    name: 'Selbstwert & Identität',
    description: 'Selbstwertgefühl, Selbstvertrauen, Identitätsfindung',
    keywords: ['selbstwert', 'selbstvertrauen', 'selbstbewusstsein', 'identität'],
    icon: '✨',
    color: '#D1FAE5',
  },
  {
    id: 'sleep',
    name: 'Schlaf-Störungen',
    description: 'Insomnie, Schlafprobleme',
    keywords: ['schlaf', 'schlafstörung', 'insomnie', 'schlafprobleme'],
    icon: '😴',
    color: '#E0E7FF',
  },
  {
    id: 'grief',
    name: 'Trauer & Verlust',
    description: 'Trauerbegleitung, Verlusterfahrungen',
    keywords: ['trauer', 'verlust', 'tod', 'trauerarbeit'],
    icon: '🕊️',
    color: '#F3F4F6',
  },
  {
    id: 'sexuality',
    name: 'Sexualität & Intimität',
    description: 'Sexuelle Probleme, Intimität, Geschlechtsidentität',
    keywords: ['sexualität', 'sexuelle', 'intimität', 'geschlechtsidentität', 'lgbtq'],
    icon: '💕',
    color: '#FBCFE8',
  },
  {
    id: 'children-youth',
    name: 'Kinder & Jugendliche',
    description: 'Kinder- und Jugendpsychotherapie, Erziehungsprobleme',
    keywords: ['kinder', 'jugend', 'jugendliche', 'eltern', 'erziehung', 'adhs', 'ads'],
    icon: '👶',
    color: '#FEF9C3',
  },
  {
    id: 'work',
    name: 'Arbeit & Karriere',
    description: 'Berufliche Probleme, Mobbing, Karriereberatung',
    keywords: ['arbeit', 'karriere', 'beruf', 'mobbing', 'arbeitsplatz'],
    icon: '💼',
    color: '#BFDBFE',
  },
  {
    id: 'psychosomatic',
    name: 'Psychosomatik',
    description: 'Psychosomatische Beschwerden, körperliche Symptome',
    keywords: ['psychosomatik', 'psychosomatisch', 'somatisierung', 'körper'],
    icon: '🧘',
    color: '#C4B5FD',
  },
];

/**
 * Normalize specialty string for matching
 */
function normalizeSpecialty(specialty: string): string {
  return specialty
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, ' ') // Remove special chars
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Find matching categories for a specialty
 * Returns array of category IDs that match
 */
export function categorizeSpecialty(specialty: string): string[] {
  const normalized = normalizeSpecialty(specialty);
  const matchingCategories: string[] = [];

  for (const category of SPECIALTY_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (normalized.includes(keyword)) {
        matchingCategories.push(category.id);
        break;
      }
    }
  }

  return matchingCategories;
}

/**
 * Group specialties by category
 */
export function groupSpecialtiesByCategory(specialties: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  // Initialize with all categories
  for (const category of SPECIALTY_CATEGORIES) {
    groups.set(category.id, []);
  }

  // Add an "other" category for uncategorized specialties
  groups.set('other', []);

  for (const specialty of specialties) {
    const categories = categorizeSpecialty(specialty);

    if (categories.length === 0) {
      groups.get('other')!.push(specialty);
    } else {
      for (const categoryId of categories) {
        groups.get(categoryId)?.push(specialty);
      }
    }
  }

  // Remove empty categories
  for (const [categoryId, specialtiesList] of groups.entries()) {
    if (specialtiesList.length === 0 && categoryId !== 'other') {
      groups.delete(categoryId);
    }
  }

  return groups;
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): SpecialtyCategory | undefined {
  return SPECIALTY_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return SPECIALTY_CATEGORIES.map((cat) => cat.id);
}

/**
 * Get all category names for display
 */
export function getAllCategoryNames(): Array<{ id: string; name: string }> {
  return SPECIALTY_CATEGORIES.map((cat) => ({ id: cat.id, name: cat.name }));
}
