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
    url: 'https://findmytherapy.net/for-therapists',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/for-therapists',
  },
};

export default function ForTherapistsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
