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
    avatar: '/images/authors/team.jpg',
    expertise: [
      'Mentale Gesundheit',
      'Psychotherapie',
      'Digitale Gesundheit',
    ],
  },
}

export function getAuthorById(id: string): Author | undefined {
  return authors[id]
}

export function getAllAuthors(): Author[] {
  return Object.values(authors)
}
