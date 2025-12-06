import type { Metadata } from 'next';
import { ImprintContent } from './ImprintContent';

export const metadata: Metadata = {
  title: 'Legal Notice | FindMyTherapy',
  description: 'Legal Notice of FindMyTherapy GmbH. Provider information according to §5 ECG and §25 MedienG.',
  alternates: {
    canonical: 'https://findmytherapy.net/imprint',
    languages: {
      'de-AT': 'https://findmytherapy.net/imprint',
      'en': 'https://findmytherapy.net/imprint',
      'x-default': 'https://findmytherapy.net/imprint',
    },
  },
  openGraph: {
    title: 'Legal Notice | FindMyTherapy',
    description: 'Legal Notice and provider information of FindMyTherapy.',
    type: 'website',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
    url: 'https://findmytherapy.net/imprint',
  },
};

export default function ImprintPage() {
  return <ImprintContent />;
}
