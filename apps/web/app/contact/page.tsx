import type { Metadata } from 'next';
import { ChatWidget } from '@/components/support/ChatWidget';
import { FeatureGate } from '@/components/FeatureGate';
import { ContactContent } from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact – FindMyTherapy',
  description: 'Contact the FindMyTherapy Care Team by email or chat. Emergency numbers and immediate help available.',
  alternates: {
    canonical: 'https://findmytherapy.net/contact',
    languages: {
      'de-AT': 'https://findmytherapy.net/contact',
      'en': 'https://findmytherapy.net/contact',
      'x-default': 'https://findmytherapy.net/contact',
    },
  },
  openGraph: {
    title: 'Contact – FindMyTherapy',
    description: 'Contact the FindMyTherapy Care Team.',
    type: 'website',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
    url: 'https://findmytherapy.net/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
      <ContactContent />
      <FeatureGate feature="CHATBOT">
        <ChatWidget />
      </FeatureGate>
    </div>
  );
}
