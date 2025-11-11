import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MicrositeHero } from './components/MicrositeHero';
import { MicrositeAbout } from './components/MicrositeAbout';
import { MicrositeExpertise } from './components/MicrositeExpertise';
import { MicrositeServices } from './components/MicrositeServices';
import { MicrositePricing } from './components/MicrositePricing';
import { MicrositeContact } from './components/MicrositeContact';
import { MicrositeAnalytics } from './components/MicrositeAnalytics';

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Generate static params for published microsites
export async function generateStaticParams() {
  try {
    const profiles = await prisma.therapistProfile.findMany({
      where: {
        micrositeStatus: 'PUBLISHED',
        status: 'VERIFIED',
        deletedAt: null,
        micrositeSlug: { not: null },
      },
      select: {
        micrositeSlug: true,
      },
      take: 100, // Limit for build performance
    });

    return profiles
      .filter((p) => p.micrositeSlug)
      .map((profile) => ({
        slug: profile.micrositeSlug!,
      }));
  } catch (error) {
    // If DB is not available during build (e.g., in CI without DB),
    // return empty array - pages will be generated on-demand via ISR
    console.warn('Could not generate static params for microsites:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const profile = await prisma.therapistProfile.findFirst({
      where: {
        micrositeSlug: params.slug,
        micrositeStatus: 'PUBLISHED',
        status: 'VERIFIED',
        deletedAt: null,
      },
      select: {
        displayName: true,
        title: true,
        headline: true,
        profileImageUrl: true,
        city: true,
        country: true,
        specialties: true,
        about: true,
      },
    });

    if (!profile) {
      return {
        title: 'Therapeut nicht gefunden',
      };
    }

  const title = `${profile.displayName}${profile.title ? ` - ${profile.title}` : ''} | FindMyTherapy`;
  const description =
    profile.headline ||
    profile.about?.substring(0, 160) ||
    `Psychotherapeut:in ${profile.displayName} aus ${profile.city || profile.country}`;

  const keywords = [
    'Psychotherapie',
    profile.city,
    profile.country,
    ...(profile.specialties || []),
    profile.displayName,
  ].filter(Boolean);

    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: profile.displayName }],
      openGraph: {
        title,
        description,
        type: 'profile',
        locale: 'de_AT',
        siteName: 'FindMyTherapy',
        images: profile.profileImageUrl
          ? [
              {
                url: profile.profileImageUrl,
                width: 400,
                height: 400,
                alt: profile.displayName,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary',
        title,
        description,
        images: profile.profileImageUrl ? [profile.profileImageUrl] : [],
      },
      alternates: {
        canonical: `/t/${params.slug}`,
      },
    };
  } catch (error) {
    console.warn('Could not generate metadata for microsite:', error);
    return {
      title: 'Therapeut Profil | FindMyTherapy',
    };
  }
}

export default async function TherapistMicrositePage({
  params,
}: {
  params: { slug: string };
}) {
  // Check for redirects first
  const redirectRecord = await prisma.therapistMicrositeRedirect.findUnique({
    where: { fromSlug: params.slug },
  });

  if (redirectRecord) {
    redirect(`/t/${redirectRecord.toSlug}`);
  }

  // Fetch therapist profile
  const profile = await prisma.therapistProfile.findFirst({
    where: {
      micrositeSlug: params.slug,
      micrositeStatus: 'PUBLISHED',
      status: 'VERIFIED',
      deletedAt: null,
    },
    select: {
      id: true,
      displayName: true,
      title: true,
      headline: true,
      profileImageUrl: true,
      approachSummary: true,
      experienceSummary: true,
      about: true,
      services: true,
      modalities: true,
      specialties: true,
      languages: true,
      priceMin: true,
      priceMax: true,
      pricingNote: true,
      city: true,
      country: true,
      online: true,
      videoUrl: true,
      acceptingClients: true,
      yearsExperience: true,
      responseTime: true,
      availabilityNote: true,
      micrositeSlug: true,
      micrositeBlocks: true,
      // Gallery & Media
      galleryImages: true,
      // Social Media
      socialLinkedin: true,
      socialInstagram: true,
      socialFacebook: true,
      websiteUrl: true,
      // Additional Info
      qualifications: true,
      ageGroups: true,
      acceptedInsurance: true,
      privatePractice: true,
      courses: {
        where: {
          status: 'PUBLISHED',
          deletedAt: null,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          currency: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // Structure data for Schema.org
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'MedicalBusiness'],
    name: profile.displayName,
    jobTitle: profile.title,
    description: profile.headline || profile.about,
    image: profile.profileImageUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city,
      addressCountry: profile.country,
    },
    areaServed: profile.online ? 'Online' : profile.city,
    knowsAbout: profile.specialties,
    knowsLanguage: profile.languages,
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Analytics tracking */}
      <MicrositeAnalytics profileId={profile.id} slug={params.slug} />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <MicrositeHero profile={profile} />

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <MicrositeAbout
                about={profile.about}
                approachSummary={profile.approachSummary}
                experienceSummary={profile.experienceSummary}
              />

              <MicrositeExpertise specialties={profile.specialties || []} />

              <MicrositeServices
                services={profile.services || []}
                modalities={profile.modalities || []}
              />

              {profile.videoUrl && (
                <section className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-semibold mb-4">Video-Vorstellung</h2>
                  <div className="aspect-video">
                    <iframe
                      src={profile.videoUrl}
                      title={`Video-Vorstellung von ${profile.displayName}`}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <MicrositePricing
                priceMin={profile.priceMin}
                priceMax={profile.priceMax}
                pricingNote={profile.pricingNote}
                languages={profile.languages || []}
                city={profile.city}
                country={profile.country}
                online={profile.online}
                acceptingClients={profile.acceptingClients}
                responseTime={profile.responseTime}
                availabilityNote={profile.availabilityNote}
              />

              <MicrositeContact
                slug={params.slug}
                therapistName={profile.displayName}
                acceptingClients={profile.acceptingClients}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
