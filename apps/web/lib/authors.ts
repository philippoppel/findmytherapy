import { Author } from './blogData'

export const authors: Record<string, Author> = {
  'gregor-studlar': {
    id: 'gregor-studlar',
    name: 'MMag. Dr. Gregor Studlar BA',
    slug: 'gregor-studlar',
    title: 'Psychotherapeut (Verhaltenstherapie) • Founder FindMyTherapy',
    credentials: 'Klinische Psychologie & Gesundheitspsychologie • Psychotherapeut (Verhaltenstherapie)',
    bio: 'Dr. Gregor Studlar ist Psychotherapeut mit Schwerpunkt Verhaltenstherapie und verfügt über umfassende klinische Erfahrung am Neuromed Campus. Seine Expertise umfasst die Behandlung von Angststörungen, Depression und Burnout. Als Gründer von FindMyTherapy verbindet er evidenzbasierte Psychotherapie mit digitalen Lösungen für bessere Versorgung.',
    avatar: '/images/team/gregorstudlar.jpg',
    email: 'gregor.studlar@findmytherapy.net',
    social: {
      linkedin: 'https://www.linkedin.com/in/gregor-studlar',
      website: 'https://findmytherapy.net',
    },
    expertise: [
      'Angststörungen & Panikattacken',
      'Depression & affektive Störungen',
      'Burnout & Stressbewältigung',
      'Kognitive Verhaltenstherapie',
      'Klinische Psychologie',
      'Digitale Gesundheitsversorgung',
    ],
  },
  'team-findmytherapy': {
    id: 'team-findmytherapy',
    name: 'Team FindMyTherapy',
    slug: 'team-findmytherapy',
    title: 'Redaktionsteam',
    credentials: 'Verifiziert von klinischen Psycholog:innen',
    bio: 'Unser interdisziplinäres Team aus Psycholog:innen, Therapeut:innen und Gesundheitsexpert:innen arbeitet daran, evidenzbasiertes Wissen zu mentaler Gesundheit zugänglich zu machen.',
    avatar: '/images/team/gregorstudlar.jpg',
    expertise: [
      'Mentale Gesundheit',
      'Psychotherapie',
      'Digitale Gesundheit',
    ],
  },
  'thomas-kaufmann': {
    id: 'thomas-kaufmann',
    name: 'Thomas Kaufmann BA pth.',
    slug: 'thomas-kaufmann',
    title: 'Psychotherapeut (Verhaltenstherapie) in Ausbildung unter Supervision',
    credentials: 'Verhaltenstherapie • NKA/NKV Notfallsanitäter • Sigmund Freud Universität Wien',
    bio: 'Thomas Kaufmann ist Psychotherapeut in Ausbildung unter Supervision mit Schwerpunkt Verhaltenstherapie. Seine Erfahrung als Notfallsanitäter prägt seinen lösungsorientierten Zugang zu Krisenintervention und Angststörungen. Er verbindet evidenzbasierte Methoden mit praxisnaher Begleitung in Phasen der Veränderung.',
    avatar: '/images/team/thomaskaufmann.jpeg',
    email: 'office@thomas-kaufmann.at',
    social: {
      website: 'https://thomas-kaufmann.at',
    },
    expertise: [
      'Angststörungen & Panikattacken',
      'Krisenintervention',
      'Depression & Stimmungsmanagement',
      'Stress & Burnout',
      'Verhaltenstherapie',
      'Traumafokussierte Therapie',
    ],
  },
}

export function getAuthorById(id: string): Author | undefined {
  return authors[id]
}

export function getAllAuthors(): Author[] {
  return Object.values(authors)
}
