import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | FindMyTherapy',
  description:
    'Artikel zu mentaler Gesundheit, Psychotherapie und Selbsthilfe in Österreich. Expertenwissen zu Depression, Angst, Burnout und mehr.',
  keywords: [
    'Psychotherapie Blog',
    'mentale Gesundheit Artikel',
    'Depression Ratgeber',
    'Angststörung Hilfe',
    'Burnout Prävention',
    'Psychotherapie Österreich',
    'Mental Health Blog',
  ],
  alternates: {
    canonical: 'https://findmytherapy.net/blog',
  },
  openGraph: {
    title: 'Blog | FindMyTherapy',
    description: 'Artikel zu mentaler Gesundheit, Psychotherapie und Selbsthilfe in Österreich.',
    type: 'website',
    url: 'https://findmytherapy.net/blog',
    locale: 'de_AT',
    siteName: 'FindMyTherapy',
    images: [
      {
        url: 'https://findmytherapy.net/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FindMyTherapy Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | FindMyTherapy',
    description: 'Artikel zu mentaler Gesundheit, Psychotherapie und Selbsthilfe in Österreich.',
    images: ['https://findmytherapy.net/images/og-image.jpg'],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
