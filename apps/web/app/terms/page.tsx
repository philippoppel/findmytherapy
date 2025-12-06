import type { Metadata } from 'next';
import { TermsContent } from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms and Conditions | FindMyTherapy',
  description: 'Terms and Conditions of FindMyTherapy. Terms of use for the platform.',
  alternates: {
    canonical: 'https://findmytherapy.net/terms',
    languages: {
      'de-AT': 'https://findmytherapy.net/terms',
      'en': 'https://findmytherapy.net/terms',
      'x-default': 'https://findmytherapy.net/terms',
    },
  },
  openGraph: {
    title: 'Terms and Conditions | FindMyTherapy',
    description: 'Terms and Conditions of FindMyTherapy.',
    type: 'website',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
    url: 'https://findmytherapy.net/terms',
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
