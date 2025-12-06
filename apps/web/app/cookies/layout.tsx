import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie-Richtlinie | FindMyTherapy',
  description: 'Cookie-Richtlinie und Cookie-Einstellungen von FindMyTherapy. Verwalten Sie Ihre Cookie-Präferenzen.',
  alternates: {
    canonical: 'https://findmytherapy.net/cookies',
    languages: {
      'de-AT': 'https://findmytherapy.net/cookies',
      'en': 'https://findmytherapy.net/cookies',
      'x-default': 'https://findmytherapy.net/cookies',
    },
  },
  openGraph: {
    title: 'Cookie-Richtlinie | FindMyTherapy',
    description: 'Cookie-Richtlinie und Cookie-Einstellungen von FindMyTherapy.',
    type: 'website',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
    url: 'https://findmytherapy.net/cookies',
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
