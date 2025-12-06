import { prisma } from '@/lib/prisma';
import { requireTherapist } from '@/lib/auth-guards';
import { ListingPageClient } from './ListingPageClient';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const fetchListingInfo = async (userId: string) => {
  const profile = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      listings: true,
    },
  });

  return profile;
};

export default async function ListingPage() {
  const session = await requireTherapist();
  const profile = await fetchListingInfo(session.user.id);
  const listing = profile?.listings[0];

  // Serialize the listing data for the client component
  const listingData = listing
    ? {
        status: listing.status,
        plan: listing.plan,
        currentPeriodStart: listing.currentPeriodStart?.toLocaleDateString('de-AT') ?? null,
        currentPeriodEnd: listing.currentPeriodEnd?.toLocaleDateString('de-AT') ?? null,
      }
    : null;

  return <ListingPageClient listing={listingData} />;
}
