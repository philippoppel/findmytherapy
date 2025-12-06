import type { Metadata } from 'next';
import { AboutPageContent } from './AboutPageContent';

export const metadata: Metadata = {
  title: 'Über uns – Team | FindMyTherapy',
  description:
    'Lerne das Team hinter FindMyTherapy kennen. Wir verbinden Menschen mit passender Unterstützung für mentale Gesundheit.',
  openGraph: {
    title: 'Über uns – Team | FindMyTherapy',
    description:
      'Lerne das Team hinter FindMyTherapy kennen. Wir verbinden Menschen mit passender Unterstützung für mentale Gesundheit.',
    type: 'website',
    url: 'https://findmytherapy.net/about',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/about',
    languages: {
      'de-AT': 'https://findmytherapy.net/about',
      'en': 'https://findmytherapy.net/about',
      'x-default': 'https://findmytherapy.net/about',
    },
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
