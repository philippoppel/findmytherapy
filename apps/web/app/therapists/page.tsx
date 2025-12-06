import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ClipboardCheck, Search } from 'lucide-react';

import { TherapistDirectory } from './TherapistDirectorySimplified';
import { getTherapistCards } from './getTherapistCards';
import { NavigationPills } from './SearchModeSelector';
import { BackLink } from '../components/BackLink';
import { FooterLinks } from './FooterLinks';

// Force dynamic rendering to prevent database access during build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Therapeut:innen finden in Österreich – FindMyTherapy',
  description:
    'Finde zertifizierte Psychotherapeut:innen in Österreich mit klarer Spezialisierung, verfügbaren Terminen und transparenten Therapieschwerpunkten. Verifizierte Profile, Online und Vor-Ort-Termine.',
  keywords: [
    'Therapeut finden Österreich',
    'Psychotherapeut Wien',
    'Online Therapie Österreich',
    'Psychotherapie Termine',
    'Therapeutensuche',
    'Kassenplatz Therapie',
    'verifizierte Therapeuten',
  ],
  openGraph: {
    title: 'Therapeut:innen finden in Österreich – Verifizierte Profile',
    description:
      'Entdecke zertifizierte Psychotherapeut:innen mit verfügbaren Terminen. Online und vor Ort in Wien, Graz, Linz und ganz Österreich.',
    type: 'website',
    url: 'https://findmytherapy.net/therapists',
    locale: 'de_AT',
    alternateLocale: 'en',
    siteName: 'FindMyTherapy',
  },
  alternates: {
    canonical: 'https://findmytherapy.net/therapists',
    languages: {
      'de-AT': 'https://findmytherapy.net/therapists',
      'en': 'https://findmytherapy.net/therapists',
      'x-default': 'https://findmytherapy.net/therapists',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Therapeut:innen finden in Österreich',
    description:
      'Zertifizierte Psychotherapeut:innen mit verfügbaren Terminen. Transparent, verifiziert, DSGVO-konform.',
  },
};

export default async function TherapistsPage() {
  const { therapists } = await getTherapistCards();

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section with Background Image */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-[380px] sm:h-[420px]">
          <Image
            src="/images/search/suche-hero.jpg"
            alt="Therapeutensuche – professionelle Beratung finden"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[rgb(var(--bg))]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Top Navigation */}
          <nav className="flex items-center justify-between px-4 sm:px-6 pt-6">
            <BackLink variant="dark" />
            <Link
              href="/triage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/80 hover:text-white transition-colors"
              aria-label="Wissenschaftlicher Test"
            >
              <ClipboardCheck className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline" aria-hidden>Wissenschaftlicher Test</span>
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center px-4 pt-8 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Direkte Suche
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Alle Therapeut:innen
              <br className="hidden sm:block" />
              <span className="text-primary-200"> durchsuchen</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
              Filtere nach deinen Kriterien und finde passende
              Therapeut:innen in unserem kuratierten Netzwerk.
            </p>

            {/* Navigation Pills */}
            <NavigationPills active="filter" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-8 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Directory Container */}
          <div className="bg-surface-1 rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-divider mb-6">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-default">
                  Verifizierte Therapeut:innen
                </h2>
                <p className="text-muted text-sm">
                  Nutze die Filter um passende Therapeut:innen zu finden.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
                <Sparkles className="h-4 w-4" />
                {therapists.length} Profile
              </div>
            </div>
            <TherapistDirectory therapists={therapists} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-divider bg-surface-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <FooterLinks />
        </div>
      </footer>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Psychotherapeut:innen in Österreich',
            description: 'Verifizierte Psychotherapeut:innen mit verfügbaren Terminen in Österreich',
            numberOfItems: therapists.length,
            itemListElement: therapists.slice(0, 10).map((t, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Person',
                name: t.name,
                jobTitle: 'Psychotherapeut:in',
                url: `https://findmytherapy.net/therapists/${t.id}`,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Therapeut:innen finden in Österreich',
            description: 'Finde zertifizierte Psychotherapeut:innen in Österreich',
            url: 'https://findmytherapy.net/therapists',
            isPartOf: {
              '@type': 'WebSite',
              name: 'FindMyTherapy',
              url: 'https://findmytherapy.net',
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://findmytherapy.net' },
                { '@type': 'ListItem', position: 2, name: 'Therapeut:innen', item: 'https://findmytherapy.net/therapists' },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
