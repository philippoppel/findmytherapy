// Austrian cities for SEO landing pages
export interface City {
  slug: string;
  name: string;
  state: string; // Bundesland
  population: number;
  description: string;
  metaDescription: string;
  keywords: string[];
}

export const austrianCities: City[] = [
  {
    slug: 'wien',
    name: 'Wien',
    state: 'Wien',
    population: 1920000,
    description:
      'Wien ist die Hauptstadt Österreichs und bietet ein umfangreiches Netzwerk an Psychotherapeut:innen. Mit über 4.000 praktizierenden Therapeut:innen findest du hier spezialisierte Hilfe für alle Bereiche der psychischen Gesundheit.',
    metaDescription:
      'Finde Psychotherapeut:innen in Wien. Über 4.000 Therapeut:innen für Depression, Angst, Burnout & mehr. Kassenplätze & private Praxen. Jetzt passende Hilfe finden.',
    keywords: [
      'Psychotherapie Wien',
      'Therapeut Wien',
      'Psychotherapeut Wien',
      'Psychologe Wien',
      'Therapie Wien',
      'Psychotherapie Wien Kosten',
      'Kassenpsychotherapie Wien',
    ],
  },
  {
    slug: 'graz',
    name: 'Graz',
    state: 'Steiermark',
    population: 290000,
    description:
      'Graz, die zweitgrößte Stadt Österreichs, verfügt über ein breites Angebot an psychotherapeutischer Versorgung. Von der Karl-Franzens-Universität bis zum LKH findest du hier qualifizierte Therapeut:innen.',
    metaDescription:
      'Psychotherapeut:innen in Graz finden. Therapeut:innen für Depression, Angst, Trauma & mehr in der Steiermark. Kassenplätze verfügbar. Jetzt Erstgespräch vereinbaren.',
    keywords: [
      'Psychotherapie Graz',
      'Therapeut Graz',
      'Psychotherapeut Graz',
      'Therapie Graz',
      'Psychologe Graz',
      'Kassenpsychotherapie Graz',
    ],
  },
  {
    slug: 'linz',
    name: 'Linz',
    state: 'Oberösterreich',
    population: 207000,
    description:
      'Linz bietet als Landeshauptstadt von Oberösterreich eine gute psychotherapeutische Infrastruktur. Ob Verhaltenstherapie, Psychoanalyse oder systemische Therapie – hier findest du die passende Unterstützung.',
    metaDescription:
      'Psychotherapie in Linz: Finde qualifizierte Therapeut:innen in Oberösterreich. Spezialisierungen für alle Bereiche. Online & vor Ort. Jetzt Therapeut:in finden.',
    keywords: [
      'Psychotherapie Linz',
      'Therapeut Linz',
      'Psychotherapeut Linz',
      'Therapie Linz',
      'Psychologe Linz',
      'Kassenpsychotherapie Linz',
    ],
  },
  {
    slug: 'salzburg',
    name: 'Salzburg',
    state: 'Salzburg',
    population: 155000,
    description:
      'Salzburg verbindet kulturelles Erbe mit moderner psychotherapeutischer Versorgung. Die Stadt bietet ein vielfältiges Angebot an Therapeut:innen mit unterschiedlichen Spezialisierungen.',
    metaDescription:
      'Therapeut:innen in Salzburg finden. Psychotherapie für Depression, Angst, Burnout & Trauma. Kassenplätze & Privatpraxen. Jetzt passende Hilfe in Salzburg finden.',
    keywords: [
      'Psychotherapie Salzburg',
      'Therapeut Salzburg',
      'Psychotherapeut Salzburg',
      'Therapie Salzburg',
      'Psychologe Salzburg',
    ],
  },
  {
    slug: 'innsbruck',
    name: 'Innsbruck',
    state: 'Tirol',
    population: 132000,
    description:
      'Innsbruck, die Hauptstadt Tirols, bietet trotz der alpinen Lage eine gute psychotherapeutische Versorgung. Viele Therapeut:innen bieten auch Online-Sitzungen an.',
    metaDescription:
      'Psychotherapie in Innsbruck & Tirol. Therapeut:innen für alle Bereiche der psychischen Gesundheit. Online & vor Ort verfügbar. Jetzt Erstgespräch vereinbaren.',
    keywords: [
      'Psychotherapie Innsbruck',
      'Therapeut Innsbruck',
      'Psychotherapeut Innsbruck',
      'Therapie Tirol',
      'Psychologe Innsbruck',
    ],
  },
  {
    slug: 'klagenfurt',
    name: 'Klagenfurt',
    state: 'Kärnten',
    population: 102000,
    description:
      'Klagenfurt am Wörthersee bietet als Landeshauptstadt Kärntens qualifizierte psychotherapeutische Betreuung. Die entspannte Atmosphäre der Region unterstützt den Heilungsprozess.',
    metaDescription:
      'Psychotherapeut:innen in Klagenfurt & Kärnten finden. Therapie für Depression, Angst, Trauma & mehr. Jetzt passende therapeutische Unterstützung finden.',
    keywords: [
      'Psychotherapie Klagenfurt',
      'Therapeut Klagenfurt',
      'Psychotherapeut Kärnten',
      'Therapie Klagenfurt',
    ],
  },
  {
    slug: 'villach',
    name: 'Villach',
    state: 'Kärnten',
    population: 64000,
    description:
      'Villach, die zweitgrößte Stadt Kärntens, bietet ein wachsendes Angebot an psychotherapeutischer Versorgung. Viele Therapeut:innen sind auf verschiedene Störungsbilder spezialisiert.',
    metaDescription:
      'Psychotherapie in Villach finden. Therapeut:innen für Depression, Angst & Burnout in Kärnten. Jetzt Erstgespräch vereinbaren.',
    keywords: [
      'Psychotherapie Villach',
      'Therapeut Villach',
      'Therapie Villach',
      'Psychologe Villach',
    ],
  },
  {
    slug: 'wels',
    name: 'Wels',
    state: 'Oberösterreich',
    population: 62000,
    description:
      'Wels bietet als zweitgrößte Stadt Oberösterreichs eine solide psychotherapeutische Infrastruktur mit verschiedenen Therapierichtungen.',
    metaDescription:
      'Therapeut:innen in Wels finden. Psychotherapie in Oberösterreich für alle Bereiche. Jetzt passende Hilfe finden.',
    keywords: ['Psychotherapie Wels', 'Therapeut Wels', 'Therapie Wels', 'Psychologe Wels'],
  },
  {
    slug: 'st-poelten',
    name: 'St. Pölten',
    state: 'Niederösterreich',
    population: 56000,
    description:
      'St. Pölten, die Landeshauptstadt Niederösterreichs, bietet qualifizierte psychotherapeutische Versorgung. Die Nähe zu Wien ermöglicht zusätzliche Behandlungsoptionen.',
    metaDescription:
      'Psychotherapie in St. Pölten & Niederösterreich. Therapeut:innen für Depression, Angst & Trauma. Jetzt Erstgespräch vereinbaren.',
    keywords: [
      'Psychotherapie St. Pölten',
      'Therapeut St. Pölten',
      'Therapie Niederösterreich',
      'Psychologe St. Pölten',
    ],
  },
  {
    slug: 'dornbirn',
    name: 'Dornbirn',
    state: 'Vorarlberg',
    population: 50000,
    description:
      'Dornbirn ist die größte Stadt Vorarlbergs und bietet ein gutes Netzwerk an Psychotherapeut:innen. Die Region profitiert von der Nähe zur Schweiz und Deutschland.',
    metaDescription:
      'Psychotherapeut:innen in Dornbirn & Vorarlberg finden. Therapie für alle Bereiche der psychischen Gesundheit. Jetzt Therapeut:in finden.',
    keywords: [
      'Psychotherapie Dornbirn',
      'Therapeut Vorarlberg',
      'Therapie Dornbirn',
      'Psychologe Vorarlberg',
    ],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return austrianCities.find((city) => city.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return austrianCities.map((city) => city.slug);
}
