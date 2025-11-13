import { Author } from './blogData'

export const authors: Record<string, Author> = {
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
