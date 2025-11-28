import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { CrisisResources } from '../triage/CrisisResources';
import { ChatWidget } from '../../components/support/ChatWidget';
import { FeatureGate } from '@/components/FeatureGate';
import { BackLink } from '../components/BackLink';

export const metadata: Metadata = {
  title: 'Kontakt – FindMyTherapy',
  description:
    'Kontaktiere das FindMyTherapy Care-Team per E-Mail oder Chat. Notfallnummern und Sofort-Hilfe verfügbar.',
};

export default function ContactPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
      <div className="min-h-screen bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <BackLink />
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
              Kontakt
            </h1>
            <p className="mt-4 text-lg text-muted">
              Wir sind für dich da – per E-Mail, Chat oder in akuten Notfällen
            </p>
          </div>

          {/* Email Contact */}
          <div className="rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-neutral-950">E-Mail</h2>
                <p className="mt-2 text-muted">
                  Schreib uns eine E-Mail und wir melden uns innerhalb von 24 Stunden bei dir.
                </p>
                <a
                  href="mailto:care@findmytherapy.net"
                  className="mt-4 inline-block text-lg font-semibold text-primary-600 transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  care@findmytherapy.net
                </a>
              </div>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="mt-12">
            <CrisisResources />
          </div>
        </div>
      </div>
      <FeatureGate feature="CHATBOT">
        <ChatWidget />
      </FeatureGate>
    </div>
  );
}
