import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TherapistProfileContent } from './TherapistProfileContent';

type TherapistProfilePageProps = {
  params: {
    profileId: string;
  };
  searchParams?: {
    from?: string;
  };
};

export async function generateMetadata({ params }: TherapistProfilePageProps) {
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: params.profileId },
    select: {
      displayName: true,
      headline: true,
      title: true,
      isPublic: true,
      profileImageUrl: true,
      city: true,
      country: true,
      specialties: true,
      modalities: true,
    },
  });

  if (!profile || !profile.isPublic) {
    return {
      title: 'Therapist not found | FindMyTherapy',
    };
  }

  const title = `${profile.displayName ?? 'Therapist'}${profile.title ? ` - ${profile.title}` : ''} | FindMyTherapy`;
  const description =
    profile.headline ??
    `Psychotherapist ${profile.displayName} from ${profile.city ?? profile.country ?? 'Austria'}. Book your first session now.`;

  const keywords = [
    'Psychotherapy',
    profile.city,
    profile.country,
    profile.displayName,
    ...(profile.specialties ?? []),
    ...(profile.modalities ?? []),
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: profile.displayName ?? 'Therapist' }],
    alternates: {
      canonical: `https://findmytherapy.net/therapists/${params.profileId}`,
      languages: {
        'de-AT': `https://findmytherapy.net/therapists/${params.profileId}`,
        'en': `https://findmytherapy.net/therapists/${params.profileId}`,
        'x-default': `https://findmytherapy.net/therapists/${params.profileId}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      locale: 'de_AT',
      alternateLocale: 'en',
      siteName: 'FindMyTherapy',
      url: `https://findmytherapy.net/therapists/${params.profileId}`,
      images: profile.profileImageUrl
        ? [
            {
              url: profile.profileImageUrl,
              width: 400,
              height: 400,
              alt: `${profile.displayName} - Psychotherapist`,
            },
          ]
        : [
            {
              url: 'https://findmytherapy.net/images/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'FindMyTherapy - Find Therapists',
            },
          ],
    },
    twitter: {
      card: profile.profileImageUrl ? 'summary' : 'summary_large_image',
      title,
      description,
      images: profile.profileImageUrl
        ? [profile.profileImageUrl]
        : ['https://findmytherapy.net/images/og-image.jpg'],
    },
  };
}

export default async function TherapistProfilePage({
  params,
  searchParams,
}: TherapistProfilePageProps) {
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: params.profileId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      courses: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
      },
    },
  });

  if (!profile || !profile.isPublic) {
    notFound();
  }

  // Redirect to microsite if available and published (only for verified profiles)
  if (
    profile.micrositeSlug &&
    profile.micrositeStatus === 'PUBLISHED' &&
    profile.status === 'VERIFIED'
  ) {
    redirect(`/t/${profile.micrositeSlug}`);
  }

  const fromTriage = searchParams?.from === 'triage';

  // Schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'MedicalBusiness'],
    '@id': `https://findmytherapy.net/therapists/${params.profileId}`,
    name: profile.displayName,
    jobTitle: profile.title ?? 'Psychotherapist',
    description: profile.headline ?? profile.about?.substring(0, 200),
    image: profile.profileImageUrl,
    url: `https://findmytherapy.net/therapists/${params.profileId}`,
    medicalSpecialty: 'Psychotherapy',
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city,
      addressCountry: profile.country ?? 'AT',
    },
    areaServed: profile.online
      ? [{ '@type': 'Country', name: 'Austria' }, 'Online']
      : { '@type': 'City', name: profile.city },
    knowsAbout: profile.specialties,
    knowsLanguage: profile.languages,
    priceRange:
      profile.priceMin || profile.priceMax
        ? `${profile.priceMin ?? '?'}€ - ${profile.priceMax ?? '?'}€`
        : undefined,
    availableService: (profile.modalities ?? []).map((modality) => ({
      '@type': 'MedicalTherapy',
      name: modality,
    })),
  };

  return (
    <TherapistProfileContent
      profile={profile}
      profileId={params.profileId}
      fromTriage={fromTriage}
      structuredData={structuredData}
    />
  );
}
