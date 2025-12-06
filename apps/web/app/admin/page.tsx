import { prisma } from '@/lib/prisma';
import { requireAdmin } from '../../lib/auth-guards';
import { updateTherapistStatus } from './actions';
import { AdminDashboardClient } from './AdminDashboardClient';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const fetchAdminData = async () => {
  const [userCount, therapistCount, pendingTherapists, recentAlerts, therapistProfiles] =
    await Promise.all([
      prisma.user.count(),
      prisma.therapistProfile.count({
        where: { deletedAt: null },
      }),
      prisma.therapistProfile.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      prisma.emergencyAlert.findMany({
        orderBy: { triggeredAt: 'desc' },
        take: 5,
        include: {
          client: {
            select: {
              email: true,
            },
          },
          handler: {
            select: {
              email: true,
            },
          },
        },
      }),
      prisma.therapistProfile.findMany({
        where: { deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          status: true,
          adminNotes: true,
          city: true,
          country: true,
          online: true,
          specialties: true,
          modalities: true,
          about: true,
          availabilityNote: true,
          pricingNote: true,
          updatedAt: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
    ]);

  return {
    userCount,
    therapistCount,
    pendingTherapists,
    recentAlerts,
    therapistProfiles,
  };
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const stats = await fetchAdminData();

  return (
    <AdminDashboardClient
      stats={stats}
      userEmail={session.user.email || ''}
      updateAction={updateTherapistStatus}
    />
  );
}
