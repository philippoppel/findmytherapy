import type { Metadata } from 'next';
import { PrivacyContent } from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | FindMyTherapy',
  description: 'Privacy Policy of FindMyTherapy. Information about the processing of your personal data according to GDPR.',
  alternates: {
    canonical: 'https://findmytherapy.net/privacy',
    languages: {
      'de-AT': 'https://findmytherapy.net/privacy',
      'en': 'https://findmytherapy.net/privacy',
      'x-default': 'https://findmytherapy.net/privacy',
    },
  },
  openGraph: {
    title: 'Privacy Policy | FindMyTherapy',
    description: 'Privacy Policy of FindMyTherapy. GDPR-compliant data processing.',
    type: 'website',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
    url: 'https://findmytherapy.net/privacy',
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
