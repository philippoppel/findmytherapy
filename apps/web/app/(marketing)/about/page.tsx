import type { Metadata } from 'next';
import { TeamSection } from '@/app/components/marketing/TeamSection';
import { teamContent } from '@/app/marketing-content';

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
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/about',
  },
};

export default function AboutPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Über FindMyTherapy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Wir verbinden Menschen mit passender Unterstützung für mentale Gesundheit – mit
              Orientierung, Transparenz und evidenzbasiertem Wissen.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20 bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-12 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Unsere Mission
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                FindMyTherapy ist eine evidenzbasierte Plattform für mentale Gesundheit in
                Österreich. Wir bieten digitale Ersteinschätzung mit validierten Fragebögen (PHQ-9,
                GAD-7), Therapeuten-Matching und therapeutisch fundierte Online-Kurse.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Unser Ziel ist es, die Suche nach passender Unterstützung zu vereinfachen und
                gleichzeitig verifiziertes Wissen von anerkannten Psychotherapeut:innen zugänglich
                zu machen – auch für akute Notfälle wie Panikattacken.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <TeamSection content={teamContent} />

          {/* Values Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Unsere Werte
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Evidenzbasiert
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Alle Inhalte und Methoden basieren auf wissenschaftlichen Erkenntnissen und werden
                  von Expert:innen verifiziert.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Datenschutz
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  100% DSGVO-konform mit EU-Datenschutz. Deine Daten bleiben sicher und werden
                  niemals weitergegeben.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Transparenz
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Klare Qualitätskriterien, nachvollziehbare Empfehlungen und offene Kommunikation
                  über unsere Prozesse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
