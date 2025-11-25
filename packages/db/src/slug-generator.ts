import { PrismaClient } from '@prisma/client';

/**
 * Converts a string to a URL-friendly slug
 * - Converts to lowercase
 * - Removes diacritics (ä → a, ü → u, etc.)
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * - Trims leading/trailing hyphens
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ß/g, 'ss') // German sharp s
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '') // Trim hyphens from start/end
    .replace(/-+/g, '-'); // Replace consecutive hyphens with single hyphen
}

/**
 * Generates a unique slug for a therapist profile
 * Default format: firstname-lastname
 * If conflict exists, appends -1, -2, etc.
 */
export async function generateUniqueSlug(
  prisma: PrismaClient,
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  profileId?: string, // Optional: exclude this profile ID from uniqueness check (for updates)
): Promise<string> {
  // Build base slug from name
  const parts: string[] = [];
  if (firstName) parts.push(slugify(firstName));
  if (lastName) parts.push(slugify(lastName));

  // Fallback if no name provided
  let baseSlug = parts.length > 0 ? parts.join('-') : 'therapeut';

  // Ensure minimum length
  if (baseSlug.length < 3) {
    baseSlug = `therapeut-${baseSlug}`;
  }

  // Check if base slug is available
  let slug = baseSlug;
  let suffix = 0;

  while (true) {
    const existing = await prisma.therapistProfile.findFirst({
      where: {
        micrositeSlug: slug,
        ...(profileId ? { id: { not: profileId } } : {}),
      },
    });

    if (!existing) {
      // Also check redirects to avoid conflicts with old slugs
      const redirect = await prisma.therapistMicrositeRedirect.findFirst({
        where: { fromSlug: slug },
      });

      if (!redirect) {
        return slug;
      }
    }

    // Conflict found, try with suffix
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }
}

/**
 * Validates a custom slug
 * Rules:
 * - Only lowercase letters, numbers, and hyphens
 * - Must start and end with alphanumeric
 * - 3-60 characters
 * - Cannot be a reserved word
 */
export function validateSlug(slug: string): {
  valid: boolean;
  error?: string;
} {
  // Reserved words that cannot be used as slugs
  const reservedWords = [
    'api',
    'admin',
    'dashboard',
    'auth',
    'login',
    'logout',
    'register',
    'signup',
    'signin',
    'profile',
    'settings',
    'therapists',
    'courses',
    'blog',
    'about',
    'contact',
    'privacy',
    'terms',
    'help',
    'support',
    'search',
    'directory',
  ];

  if (reservedWords.includes(slug)) {
    return {
      valid: false,
      error: 'Dieser Slug ist reserviert und kann nicht verwendet werden',
    };
  }

  if (slug.length < 3) {
    return {
      valid: false,
      error: 'Slug muss mindestens 3 Zeichen lang sein',
    };
  }

  if (slug.length > 60) {
    return {
      valid: false,
      error: 'Slug darf maximal 60 Zeichen lang sein',
    };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return {
      valid: false,
      error: 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten',
    };
  }

  if (!/^[a-z0-9]/.test(slug) || !/[a-z0-9]$/.test(slug)) {
    return {
      valid: false,
      error: 'Slug muss mit einem Buchstaben oder einer Zahl beginnen und enden',
    };
  }

  if (/--/.test(slug)) {
    return {
      valid: false,
      error: 'Slug darf keine aufeinanderfolgenden Bindestriche enthalten',
    };
  }

  return { valid: true };
}

/**
 * Checks if a slug is available (not in use by another profile or redirect)
 */
export async function isSlugAvailable(
  prisma: PrismaClient,
  slug: string,
  excludeProfileId?: string,
): Promise<boolean> {
  const profile = await prisma.therapistProfile.findFirst({
    where: {
      micrositeSlug: slug,
      ...(excludeProfileId ? { id: { not: excludeProfileId } } : {}),
    },
  });

  if (profile) return false;

  const redirect = await prisma.therapistMicrositeRedirect.findFirst({
    where: { fromSlug: slug },
  });

  if (redirect) return false;

  return true;
}

/**
 * Updates a therapist's slug and creates a redirect from the old slug
 */
export async function updateTherapistSlug(
  prisma: PrismaClient,
  profileId: string,
  newSlug: string,
): Promise<{ success: boolean; error?: string }> {
  // Validate new slug
  const validation = validateSlug(newSlug);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Check availability
  const available = await isSlugAvailable(prisma, newSlug, profileId);
  if (!available) {
    return {
      success: false,
      error: 'Dieser Slug ist bereits vergeben',
    };
  }

  // Get current profile
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: profileId },
    select: { micrositeSlug: true },
  });

  if (!profile) {
    return { success: false, error: 'Profil nicht gefunden' };
  }

  // Update slug
  await prisma.$transaction(async (tx) => {
    // Create redirect from old slug if it exists
    if (profile.micrositeSlug && profile.micrositeSlug !== newSlug) {
      await tx.therapistMicrositeRedirect.create({
        data: {
          fromSlug: profile.micrositeSlug,
          toSlug: newSlug,
        },
      });
    }

    // Update profile
    await tx.therapistProfile.update({
      where: { id: profileId },
      data: { micrositeSlug: newSlug },
    });
  });

  return { success: true };
}
