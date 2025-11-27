import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Mapping: Blog-Tags → Therapeuten-Specialties
const TAG_TO_SPECIALTY: Record<string, string[]> = {
  // Angst-bezogen
  Angst: ['Angststörungen', 'Angst', 'Panikattacken', 'Phobien', 'Soziale Angst'],
  Panikattacken: ['Panikattacken', 'Angststörungen', 'Panikstörung', 'Angst'],
  Angststörungen: ['Angststörungen', 'Angst', 'Panikattacken', 'Phobien'],
  Phobien: ['Phobien', 'Angststörungen', 'Angst'],

  // Depression-bezogen
  Depression: ['Depression', 'Depressive Störungen', 'Burnout', 'Stimmungsstörungen'],
  Burnout: ['Burnout', 'Erschöpfung', 'Stress', 'Depression'],
  Erschöpfung: ['Burnout', 'Erschöpfung', 'Stress'],

  // Trauma-bezogen
  Trauma: ['Trauma', 'PTBS', 'Traumatherapie', 'Belastungsstörungen'],
  PTBS: ['PTBS', 'Trauma', 'Traumatherapie'],

  // Beziehungen
  Beziehung: ['Beziehungsprobleme', 'Paartherapie', 'Familientherapie', 'Beziehungen'],
  Partnerschaft: ['Paartherapie', 'Beziehungsprobleme', 'Eheberatung'],

  // Selbstwert
  Selbstwert: ['Selbstwert', 'Selbstbewusstsein', 'Persönlichkeitsentwicklung'],
  Selbsthilfe: ['Selbsthilfe', 'Persönlichkeitsentwicklung', 'Coaching'],

  // Stress
  Stress: ['Stressmanagement', 'Burnout', 'Work-Life-Balance', 'Stress'],
  Arbeitswelt: ['Arbeitsplatzkonflikte', 'Burnout', 'Mobbing', 'Stressmanagement'],

  // Therapieformen
  Verhaltenstherapie: ['Verhaltenstherapie', 'Kognitive Verhaltenstherapie', 'CBT'],
  KVT: ['Kognitive Verhaltenstherapie', 'Verhaltenstherapie', 'CBT'],

  // Allgemein
  Psychotherapie: ['Psychotherapie', 'Gesprächstherapie'],
  'Mentale Gesundheit': ['Psychotherapie', 'Wohlbefinden'],
};

// Alle Keywords für die Suche
function getSearchKeywords(tags: string[]): string[] {
  const keywords = new Set<string>();

  tags.forEach(tag => {
    // Direktes Mapping
    const specialties = TAG_TO_SPECIALTY[tag];
    if (specialties) {
      specialties.forEach(s => keywords.add(s.toLowerCase()));
    }
    // Tag selbst auch als Keyword
    keywords.add(tag.toLowerCase());
  });

  return Array.from(keywords);
}

/**
 * GET /api/blog/recommended-therapists
 *
 * Query params:
 * - tags: comma-separated list of blog tags (e.g., "Angst,Panikattacken")
 * - limit: number of results (default: 3, max: 6)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagsParam = searchParams.get('tags');
    const limit = Math.min(parseInt(searchParams.get('limit') || '3'), 6);

    if (!tagsParam) {
      return NextResponse.json({ therapists: [], message: 'No tags provided' });
    }

    const tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean);

    if (tags.length === 0) {
      return NextResponse.json({ therapists: [], message: 'No valid tags' });
    }

    const keywords = getSearchKeywords(tags);

    // Suche Therapeuten mit passenden Specialties
    // Optimiert: Nur limit + Puffer statt limit * 3
    const therapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
        status: 'VERIFIED',
        // Mindestens eine Specialty muss matchen
        OR: keywords.map(keyword => ({
          specialties: {
            hasSome: [keyword],
          },
        })),
      },
      select: {
        id: true,
        displayName: true,
        title: true,
        specialties: true,
        approachSummary: true,
        city: true,
        online: true,
        profileImageUrl: true,
        availabilityStatus: true,
        estimatedWaitWeeks: true,
        rating: true,
        reviewCount: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      take: limit + 3, // Nur kleiner Puffer für Randomisierung
    });

    // Fallback: Wenn nicht genug, hole allgemeine Therapeuten in EINER Query
    let result = therapists;

    if (therapists.length < limit) {
      // Eine einzige kombinierte Query statt zwei separate
      result = await prisma.therapistProfile.findMany({
        where: {
          isPublic: true,
          status: 'VERIFIED',
        },
        select: {
          id: true,
          displayName: true,
          title: true,
          specialties: true,
          approachSummary: true,
          city: true,
          online: true,
          profileImageUrl: true,
          availabilityStatus: true,
          estimatedWaitWeeks: true,
          rating: true,
          reviewCount: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        take: limit + 3,
        orderBy: {
          rating: 'desc',
        },
      });
    }

    // Randomisieren und limitieren
    const shuffled = result.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);

    // Transformieren für Frontend
    const transformedTherapists = selected.map(t => ({
      id: t.id,
      name: t.displayName || `${t.user.firstName || ''} ${t.user.lastName || ''}`.trim() || 'Therapeut:in',
      title: t.title || 'Psychotherapie',
      specialties: (t.specialties || []).slice(0, 3),
      approach: t.approachSummary || '',
      city: t.city || null,
      online: t.online,
      image: t.profileImageUrl && !t.profileImageUrl.includes('default') ? t.profileImageUrl : null,
      availabilityStatus: t.availabilityStatus,
      estimatedWaitWeeks: t.estimatedWaitWeeks,
      rating: t.rating || 0,
      reviewCount: t.reviewCount || 0,
    }));

    // Cache für 5 Minuten - reduziert DB-Last bei häufigen Blog-Aufrufen
    return NextResponse.json(
      {
        therapists: transformedTherapists,
        matchedTags: tags,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching recommended therapists:', error);
    return NextResponse.json({ error: 'Failed to fetch therapists', therapists: [] }, { status: 500 });
  }
}
