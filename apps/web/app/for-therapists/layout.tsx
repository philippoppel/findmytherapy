import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Für Therapeut:innen – FindMyTherapy',
  description:
    'Professionelle Microsite für Ihre Praxis. SEO-optimiert für maximale Sichtbarkeit. Kostenlos starten.',
  openGraph: {
    title: 'Für Therapeut:innen – FindMyTherapy',
    description:
      'Professionelle Microsite für Ihre Praxis. SEO-optimiert für maximale Sichtbarkeit.',
    type: 'website',
  },
};

export default function ForTherapistsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
