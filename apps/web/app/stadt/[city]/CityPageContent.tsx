'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Phone, ArrowRight, CheckCircle2, Shield, Clock } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { BackLink } from '@/app/components/BackLink';
import { useTranslation } from '@/lib/i18n';

type City = {
  name: string;
  slug: string;
  state: string;
  description: string;
};

type Therapist = {
  id: string;
  displayName: string | null;
  title: string | null;
  profileImageUrl: string | null;
  specialties: string[];
  micrositeSlug: string | null;
};

type Props = {
  city: City;
  therapistCount: number;
  featuredTherapists: Therapist[];
  otherCities: City[];
  structuredData: {
    citySchema: object;
    breadcrumbSchema: object;
    faqSchema: object;
  };
};

export function CityPageContent({ city, therapistCount, featuredTherapists, otherCities, structuredData }: Props) {
  const { t } = useTranslation();

  const commonSpecialties = [
    t('cityPage.depression'),
    t('cityPage.anxietyDisorders'),
    t('cityPage.burnout'),
    t('cityPage.traumaPtsd'),
    t('cityPage.relationshipIssues'),
    t('cityPage.eatingDisorders'),
  ];

  const faqItems = [
    {
      question: t('cityPage.faqHowToFind', { city: city.name }),
      answer: t('cityPage.faqHowToFindAnswer', { city: city.name }),
    },
    {
      question: t('cityPage.faqCost', { city: city.name }),
      answer: t('cityPage.faqCostAnswer', { city: city.name }),
    },
    {
      question: t('cityPage.faqInsurance', { city: city.name }),
      answer: t('cityPage.faqInsuranceAnswer', { city: city.name }),
    },
    {
      question: t('cityPage.faqOnline', { city: city.name }),
      answer: t('cityPage.faqOnlineAnswer', { city: city.name }),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.citySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {/* Back Link */}
            <div className="mb-6">
              <BackLink variant="dark" />
            </div>

            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-primary-200">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t('cityPage.home')}
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/therapists" className="hover:text-white transition-colors">
                    {t('cityPage.therapists')}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">{city.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary-300" />
                <span className="text-primary-200">{city.state}, {t('cityPage.austria')}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('cityPage.findTherapists', { city: city.name })}
              </h1>

              <p className="text-xl text-primary-100 mb-8">{city.description}</p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary-300" />
                  <span>
                    {therapistCount > 0
                      ? t('cityPage.therapistsCount', { count: therapistCount })
                      : t('cityPage.therapistsAvailable')}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-300" />
                  <span>{t('cityPage.verifiedProfiles')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary-300" />
                  <span>{t('cityPage.onlineAndOnsite')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  <Link href={`/therapists?city=${encodeURIComponent(city.name)}`}>
                    {t('cityPage.findTherapistsIn', { city: city.name })}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Link href="/triage">{t('cityPage.startAssessment')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('cityPage.commonTherapyAreas', { city: city.name })}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('cityPage.ourTherapistsSpecialize', { city: city.name })}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {commonSpecialties.map((specialty) => (
                <Link
                  key={specialty}
                  href={`/therapists?city=${encodeURIComponent(city.name)}&specialty=${encodeURIComponent(specialty)}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{specialty}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Therapists */}
        {featuredTherapists.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('cityPage.therapistsIn', { city: city.name })}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('cityPage.discoverQualified')}
              </p>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredTherapists.map((therapist) => (
                  <Link
                    key={therapist.id}
                    href={
                      therapist.micrositeSlug
                        ? `/t/${therapist.micrositeSlug}`
                        : `/therapists/${therapist.id}`
                    }
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {therapist.profileImageUrl ? (
                          <Image
                            src={therapist.profileImageUrl}
                            alt={therapist.displayName || t('therapistProfile.therapist')}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary-600">
                            {therapist.displayName?.charAt(0) || 'T'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {therapist.displayName || t('therapistProfile.therapist')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {therapist.title || t('therapistProfile.therapist')}
                        </p>
                        {therapist.specialties?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {therapist.specialties.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <Link href={`/therapists?city=${encodeURIComponent(city.name)}`}>
                    {t('cityPage.showAllTherapists', { city: city.name })}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('cityPage.faqTitle', { city: city.name })}
            </h2>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Cities */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('cityPage.otherCities')}
            </h2>

            <div className="flex flex-wrap gap-3">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/stadt/${c.slug}`}
                  className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cityPage.readyForFirstStep')}</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              {t('cityPage.findSupportNow', { city: city.name })}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                <Link href="/triage">
                  <Phone className="mr-2 h-5 w-5" />
                  {t('cityPage.startAssessment')}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link href={`/therapists?city=${encodeURIComponent(city.name)}`}>
                  {t('cityPage.browseTherapists')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
