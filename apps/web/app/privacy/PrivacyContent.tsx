'use client';

import { useTranslation } from '@/lib/i18n';
import { BackLink } from '../components/BackLink';

export function PrivacyContent() {
  const { t, language } = useTranslation();

  const sections = [
    { id: 'controller', titleKey: 'privacySection1Title', bodyKey: 'privacySection1Body' },
    { id: 'overview', titleKey: 'privacySection2Title', bodyKey: 'privacySection2Body' },
    { id: 'data-collection', titleKey: 'privacySection3Title', bodyKey: 'privacySection3Body' },
    { id: 'legal-basis', titleKey: 'privacySection4Title', bodyKey: 'privacySection4Body' },
    { id: 'cookies', titleKey: 'privacySection5Title', bodyKey: 'privacySection5Body' },
    { id: 'third-parties', titleKey: 'privacySection6Title', bodyKey: 'privacySection6Body' },
    { id: 'data-transfers', titleKey: 'privacySection7Title', bodyKey: 'privacySection7Body' },
    { id: 'retention', titleKey: 'privacySection8Title', bodyKey: 'privacySection8Body' },
    { id: 'health-data', titleKey: 'privacySection9Title', bodyKey: 'privacySection9Body' },
    { id: 'security', titleKey: 'privacySection10Title', bodyKey: 'privacySection10Body' },
    { id: 'rights', titleKey: 'privacySection11Title', bodyKey: 'privacySection11Body' },
    { id: 'supervisory', titleKey: 'privacySection12Title', bodyKey: 'privacySection12Body' },
    { id: 'changes', titleKey: 'privacySection13Title', bodyKey: 'privacySection13Body' },
    { id: 'contact', titleKey: 'privacySection14Title', bodyKey: 'privacySection14Body' },
  ];

  const formatDate = () => {
    return new Date().toLocaleDateString(language === 'de' ? 'de-AT' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <BackLink />

        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">
            {t('legalPages.privacyPolicy')}
          </h1>
          <p className="text-sm text-neutral-700">
            {t('legalPages.privacyResponsible')} {t('legalPages.privacyAsOf')} {new Date().getFullYear()}.
          </p>
        </header>

        <nav
          aria-label={t('legalPages.sectionNavigation')}
          className="rounded-2xl border border-divider bg-surface-1 p-4 text-sm text-neutral-700"
        >
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a className="text-link hover:underline" href={`#${section.id}`}>
                  {t(`legalPages.${section.titleKey}` as any)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="space-y-8">
          {sections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="space-y-2 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
            >
              <h2 className="text-xl font-semibold text-neutral-950">
                {t(`legalPages.${section.titleKey}` as any)}
              </h2>
              <div className="text-sm leading-relaxed text-neutral-800 whitespace-pre-line">
                {section.id === 'changes' ? (
                  <>
                    {t(`legalPages.${section.bodyKey}` as any)}
                    {'\n\n'}
                    <strong>{t('legalPages.lastUpdate')}</strong> {formatDate()}
                  </>
                ) : (
                  t(`legalPages.${section.bodyKey}` as any)
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
